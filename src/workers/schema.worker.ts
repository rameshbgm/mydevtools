import { validateJsonSchema } from "../lib/json-schema-workbench";

self.onmessage = (event: MessageEvent<{ instance: unknown; schema: unknown }>) => {
    self.postMessage(validateJsonSchema(event.data.instance, event.data.schema));
};
