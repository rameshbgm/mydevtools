import { inspectImageMetadata } from "../lib/image-inspection";
import { stripImageMetadata } from "../lib/image-metadata";
self.onmessage = async (event: MessageEvent<{ operation: "inspect" | "strip"; bytes: Uint8Array }>) => {
    try { self.postMessage({ value: event.data.operation === "inspect" ? await inspectImageMetadata(event.data.bytes) : stripImageMetadata(event.data.bytes) }); }
    catch (cause) { self.postMessage({ error: cause instanceof Error ? cause.message : String(cause) }); }
};
