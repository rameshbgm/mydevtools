import { asRecord, getString } from "@/lib/structured-data";

export type AsyncApiSummary = {
    version: string;
    title: string;
    channels: number;
    operations: number;
    servers: number;
    messages: number;
    issues: string[];
};

export function inspectAsyncApi(value: unknown): AsyncApiSummary {
    const document = asRecord(value);
    const version = getString(document.asyncapi) ?? "Unknown";
    const info = asRecord(document.info);
    const channels = asRecord(document.channels);
    const operations = asRecord(document.operations);
    const components = asRecord(document.components);
    const messages = asRecord(components.messages);
    const issues: string[] = [];
    if (!getString(document.asyncapi)) issues.push("Missing required `asyncapi` version.");
    if (!getString(info.title)) issues.push("Missing `info.title`.");
    if (!getString(info.version)) issues.push("Missing `info.version`.");
    if (!Object.keys(channels).length) issues.push("No channels were declared.");
    if (!/^([23])\./.test(version)) issues.push("This tool supports AsyncAPI 2.x and 3.x documents.");
    return {
        version,
        title: getString(info.title) ?? "Untitled API",
        channels: Object.keys(channels).length,
        operations: Object.keys(operations).length,
        servers: Object.keys(asRecord(document.servers)).length,
        messages: Object.keys(messages).length,
        issues,
    };
}
