import { compareContractSchemas, resolveContractRef } from "./schema-compatibility";
import { asRecord, getArray, getString, isRecord, type DataRecord } from "@/lib/structured-data";

export type ContractChange = {
    severity: "breaking" | "attention" | "info";
    location: string;
    message: string;
};

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head", "options", "trace", "query"]);

function operationEntries(paths: DataRecord, document: DataRecord, changes: ContractChange[]): Map<string, DataRecord> {
    const operations = new Map<string, DataRecord>();
    for (const [path, pathItem] of Object.entries(paths)) {
        const resolvedPath = asRecord(resolveContractRef(pathItem, document, (message) => changes.push({ severity: "attention", location: path, message })));
        for (const [method, operation] of Object.entries(resolvedPath)) {
            if (HTTP_METHODS.has(method.toLowerCase()) && isRecord(operation)) {
                operations.set(`${method.toUpperCase()} ${path}`, { ...operation, parameters: [...getArray(resolvedPath.parameters), ...getArray(operation.parameters)] });
            }
        }
    }
    return operations;
}

function parameterMap(operation: DataRecord, document: DataRecord, changes: ContractChange[], location: string): Map<string, DataRecord> {
    const params = new Map<string, DataRecord>();
    for (const parameter of getArray(operation.parameters)) {
        const item = asRecord(resolveContractRef(parameter, document, (message) => changes.push({ severity: "attention", location, message })));
        const name = getString(item.name);
        const parameterLocation = getString(item.in);
        if (name && parameterLocation) params.set(`${parameterLocation}:${name}`, item);
    }
    return params;
}

function requiredFields(schema: DataRecord): Set<string> {
    return new Set(getArray(schema.required).filter((item): item is string => typeof item === "string"));
}

function componentSchemas(document: DataRecord): DataRecord {
    return asRecord(asRecord(document.components).schemas);
}

export function validateOpenApiDocument(document: unknown): string | null {
    const source = asRecord(document);
    if (!getString(source.openapi) && !getString(source.swagger)) {
        return "Expected an OpenAPI `openapi` or Swagger `swagger` version field.";
    }
    if (!/^(3\.[012]\.\d+)$/.test(String(source.openapi)) && source.swagger !== "2.0") return "Supported versions: Swagger 2.0 and OpenAPI 3.0, 3.1, 3.2. Unknown versions cannot be evaluated.";
    if (!isRecord(source.paths)) return "Expected a `paths` object.";
    return null;
}

/** A deliberately conservative contract diff: every breaking finding is actionable without guessing runtime behavior. */
export function compareOpenApiContracts(beforeValue: unknown, afterValue: unknown): ContractChange[] {
    const before = asRecord(beforeValue);
    const after = asRecord(afterValue);
    const changes: ContractChange[] = [];
    const oldOperations = operationEntries(asRecord(before.paths), before, changes);
    const newOperations = operationEntries(asRecord(after.paths), after, changes);

    for (const key of oldOperations.keys()) {
        if (!newOperations.has(key)) changes.push({ severity: "breaking", location: key, message: "Operation was removed." });
    }
    for (const key of newOperations.keys()) {
        if (!oldOperations.has(key)) changes.push({ severity: "info", location: key, message: "Operation was added." });
    }

    for (const [key, oldOperation] of oldOperations) {
        const newOperation = newOperations.get(key);
        if (!newOperation) continue;
        const oldParameters = parameterMap(oldOperation, before, changes, key);
        const newParameters = parameterMap(newOperation, after, changes, key);
        for (const [paramKey, newParameter] of newParameters) {
            const oldParameter = oldParameters.get(paramKey);
            if (!oldParameter && newParameter.required === true) {
                changes.push({ severity: "breaking", location: key, message: `Required ${paramKey} parameter was added.` });
            }
            if (oldParameter && oldParameter.required !== true && newParameter.required === true) {
                changes.push({ severity: "breaking", location: key, message: `${paramKey} parameter became required.` });
            }
        }

        for (const [paramKey, oldParameter] of oldParameters) {
            const newParameter = newParameters.get(paramKey);
            if (newParameter) changes.push(...compareContractSchemas(oldParameter.schema ?? oldParameter, newParameter.schema ?? newParameter, `${key}.parameters.${paramKey}`, "request", before, after));
        }
        const resolve = (value: unknown, doc: DataRecord, location: string) => asRecord(resolveContractRef(value, doc, (message) => changes.push({ severity: "attention", location, message })));
        const compareContent = (oldValue: unknown, newValue: unknown, direction: "request" | "response", location: string) => {
            const oldResolved = resolve(oldValue, before, location), newResolved = resolve(newValue, after, location);
            if (oldResolved.schema !== undefined || newResolved.schema !== undefined) changes.push(...compareContractSchemas(oldResolved.schema ?? {}, newResolved.schema ?? {}, `${location}.schema`, direction, before, after));
            const oldContent = asRecord(oldResolved.content), newContent = asRecord(newResolved.content);
            for (const mediaType of Object.keys(oldContent)) {
                if (!(mediaType in newContent)) changes.push({ severity: "breaking", location, message: `${direction} media type ${mediaType} was removed.` });
                else changes.push(...compareContractSchemas(asRecord(oldContent[mediaType]).schema ?? {}, asRecord(newContent[mediaType]).schema ?? {}, `${location}.${mediaType}`, direction, before, after));
            }
        };
        const oldBody = resolve(oldOperation.requestBody, before, key), newBody = resolve(newOperation.requestBody, after, key);
        if (oldBody.required !== true && newBody.required === true) changes.push({ severity: "breaking", location: key, message: "Request body became required." });
        compareContent(oldBody, newBody, "request", `${key}.requestBody`);
        if (JSON.stringify(oldOperation.security ?? before.security) !== JSON.stringify(newOperation.security ?? after.security)) changes.push({ severity: "attention", location: key, message: "Security requirements changed; review authentication compatibility." });
        const oldResponses = asRecord(oldOperation.responses);
        const newResponses = asRecord(newOperation.responses);
        for (const status of Object.keys(oldResponses)) {
            if (newResponses[status]) compareContent(oldResponses[status], newResponses[status], "response", `${key}.responses.${status}`);
            if (!newResponses[status]) {
                changes.push({ severity: status.startsWith("2") ? "breaking" : "attention", location: key, message: `Response ${status} was removed.` });
            }
        }
    }

    const oldSchemas = componentSchemas(before);
    const newSchemas = componentSchemas(after);
    for (const [name, oldSchemaValue] of Object.entries(oldSchemas)) {
        const newSchema = newSchemas[name];
        if (!isRecord(newSchema)) continue;
        const oldRequired = requiredFields(asRecord(oldSchemaValue));
        for (const field of requiredFields(newSchema)) {
            if (!oldRequired.has(field)) {
                changes.push({ severity: "attention", location: `components.schemas.${name}`, message: `Property \`${field}\` became required; impact depends on request/response usage. Referenced operations are evaluated separately.` });
            }
        }
    }
    for (const field of ["webhooks", "securitySchemes", "callbacks", "links"]) {
        if (JSON.stringify(before[field] ?? asRecord(before.components)[field]) !== JSON.stringify(after[field] ?? asRecord(after.components)[field])) changes.push({ severity: "attention", location: field, message: `Changed ${field}; semantic compatibility is outside the evaluated rules.` });
    }
    const unique = new Map(changes.map((change) => [`${change.severity}:${change.location}:${change.message}`, change]));
    return [...unique.values()];
}
