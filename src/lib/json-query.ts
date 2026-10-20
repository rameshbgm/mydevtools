import { parseQueryJson, type QueryNumberMode } from "./json-number-source";
import { JSONPath } from "jsonpath-plus";
import { search } from "./vendor/jmespath.mjs";
export type JsonQueryEngine = "jsonpath" | "jmespath";
export function queryJson(input: string, expression: string, engine: JsonQueryEngine, numberMode: QueryNumberMode = "reject"): unknown {
    if (input.length > 2 * 1024 * 1024 || expression.length > 2048) throw new Error("Use JSON up to 2 MiB and an expression up to 2048 characters.");
    const json = parseQueryJson(input, numberMode);
    return engine === "jmespath" ? search(json, expression, (literal) => parseQueryJson(literal, numberMode)) : JSONPath({ path: expression, json, wrap: true, eval: "safe" });
}
