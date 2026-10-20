import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import Ajv2019 from "ajv/dist/2019";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { isRecord } from "@/lib/structured-data";

export type SchemaIssue = { path: string; message: string; kind?: "schema" | "instance" };
export const SUPPORTED_SCHEMA_DIALECTS = ["2020-12", "2019-09", "draft-07"] as const;
const validators = new Map<string, ValidateFunction>();

/** No remote loading: unresolved references and unsupported vocabularies are errors. */
export function validateJsonSchema(value: unknown, schemaValue: unknown): SchemaIssue[] {
    try {
        if (typeof schemaValue !== "boolean" && !isRecord(schemaValue)) {
            return [{ path: "$schema", kind: "schema", message: "A JSON Schema must be an object or a boolean." }];
        }
        const key = JSON.stringify(schemaValue);
        if (key.length > 1024 * 1024) throw new Error("Schema exceeds the 1 MiB limit.");
        let validate = validators.get(key);
        if (!validate) {
            const dialect = isRecord(schemaValue) ? schemaValue.$schema : undefined;
            const options = { allErrors: true, strict: true, strictTypes: false, strictTuples: false, strictRequired: false, allowUnionTypes: true, validateFormats: true, ownProperties: true };
            const ajv = !dialect || dialect === "https://json-schema.org/draft/2020-12/schema"
                ? new Ajv2020(options)
                : dialect === "https://json-schema.org/draft/2019-09/schema"
                    ? new Ajv2019(options)
                    : dialect === "http://json-schema.org/draft-07/schema#" || dialect === "https://json-schema.org/draft-07/schema"
                        ? new Ajv(options)
                        : null;
            if (!ajv) throw new Error(`Unsupported schema dialect: ${String(dialect)}. Choose ${SUPPORTED_SCHEMA_DIALECTS.join(", ")}.`);
            addFormats(ajv);
            validate = ajv.compile(schemaValue);
            if (validators.size >= 12) validators.clear();
            validators.set(key, validate);
        }
        if (validate(value)) return [];
        return (validate.errors ?? []).map((error: ErrorObject) => ({
            path: `$${error.instancePath}${error.keyword === "required" ? "/" + String(error.params.missingProperty).replace(/~/g, "~0").replace(/\//g, "~1") : ""}`,
            message: `${error.message ?? "Validation failed"}${error.keyword === "additionalProperties" ? `: ${error.params.additionalProperty}` : ""}`,
            kind: "instance" as const,
        }));
    } catch (error) {
        return [{ path: "$schema", kind: "schema", message: `Schema cannot be evaluated: ${error instanceof Error ? error.message : "Invalid schema"}. No validity claim can be made.` }];
    }
}
