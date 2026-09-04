import { asRecord, getArray, getString, isRecord, type DataRecord } from "@/lib/structured-data";

export type ContractChange = {
    severity: "breaking" | "attention" | "info";
    location: string;
    message: string;
};

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head", "options", "trace"]);

function operationEntries(paths: DataRecord): Map<string, DataRecord> {
    const operations = new Map<string, DataRecord>();
    for (const [path, pathItem] of Object.entries(paths)) {
        for (const [method, operation] of Object.entries(asRecord(pathItem))) {
            if (HTTP_METHODS.has(method.toLowerCase()) && isRecord(operation)) {
                operations.set(`${method.toUpperCase()} ${path}`, operation);
            }
        }
    }
    return operations;
}

function parameterMap(operation: DataRecord): Map<string, DataRecord> {
    const params = new Map<string, DataRecord>();
    for (const parameter of getArray(operation.parameters)) {
        const item = asRecord(parameter);
        const name = getString(item.name);
        const location = getString(item.in);
        if (name && location) params.set(`${location}:${name}`, item);
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
    if (!isRecord(source.paths)) return "Expected a `paths` object.";
    return null;
}

/** A deliberately conservative contract diff: every breaking finding is actionable without guessing runtime behavior. */
export function compareOpenApiContracts(beforeValue: unknown, afterValue: unknown): ContractChange[] {
    const before = asRecord(beforeValue);
    const after = asRecord(afterValue);
    const changes: ContractChange[] = [];
    const oldOperations = operationEntries(asRecord(before.paths));
    const newOperations = operationEntries(asRecord(after.paths));

    for (const key of oldOperations.keys()) {
        if (!newOperations.has(key)) changes.push({ severity: "breaking", location: key, message: "Operation was removed." });
    }
    for (const key of newOperations.keys()) {
        if (!oldOperations.has(key)) changes.push({ severity: "info", location: key, message: "Operation was added." });
    }

    for (const [key, oldOperation] of oldOperations) {
        const newOperation = newOperations.get(key);
        if (!newOperation) continue;
        const oldParameters = parameterMap(oldOperation);
        const newParameters = parameterMap(newOperation);
        for (const [paramKey, newParameter] of newParameters) {
            const oldParameter = oldParameters.get(paramKey);
            if (!oldParameter && newParameter.required === true) {
                changes.push({ severity: "breaking", location: key, message: `Required ${paramKey} parameter was added.` });
            }
            if (oldParameter?.required !== true && newParameter.required === true) {
                changes.push({ severity: "breaking", location: key, message: `${paramKey} parameter became required.` });
            }
        }

        const oldResponses = asRecord(oldOperation.responses);
        const newResponses = asRecord(newOperation.responses);
        for (const status of Object.keys(oldResponses)) {
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
                changes.push({ severity: "breaking", location: `components.schemas.${name}`, message: `Property \`${field}\` became required.` });
            }
        }
    }
    return changes;
}
