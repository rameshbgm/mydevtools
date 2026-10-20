import { generateModelFiles, type ModelTarget } from "../lib/model-generation";
self.onmessage = async (event: MessageEvent<{ input: string; target: ModelTarget; name: string }>) => {
    try { self.postMessage({ files: await generateModelFiles(event.data.input, event.data.target, event.data.name) }); }
    catch (cause) { self.postMessage({ error: cause instanceof Error ? cause.message : String(cause) }); }
};
