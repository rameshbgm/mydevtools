import { translate, type Language } from "./i18n/catalog";
interface SearchableTool { id: string; name: string; description: string; category: string; tags: string[] }
const TASKS: Record<string, string[]> = {
    "inspect an api response": ["json-formatter", "json-path-tester", "api-request-builder"],
    "debug api": ["api-request-builder", "cors-tester", "security-headers-analyzer"],
    "verify jwt": ["jwt-decoder", "jws-tool", "jwk-generator"],
    "webhook signature": ["webhook-signature-debugger", "webhook-receiver"],
    "clean logs": ["har-log-redactor", "text-tools"],
    "extract data": ["json-path-tester", "regex-tester", "xpath-tester"],
    "repeat task": ["saved-workflows"],
    "time ordered id": ["uuid-generator"],
};
const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase().trim();
export function matchesToolQuery(tool: SearchableTool, query: string, language: Language = "en") {
    const normalized = normalize(query);
    if (!normalized) return true;
    if (Object.entries(TASKS).some(([phrase, ids]) => ([phrase, translate(language, phrase)].some((alias) => normalize(alias).includes(normalized) || normalized.includes(normalize(alias)))) && ids.includes(tool.id))) return true;
    const text = normalize(`${tool.name} ${translate(language, tool.name)} ${tool.description} ${translate(language, tool.description)} ${tool.category} ${translate(language, tool.category)} ${tool.tags.join(" ")}`);
    return normalized.split(/\s+/).every((word) => text.includes(word));
}
