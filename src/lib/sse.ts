/** SSE framing handles CRLF across chunk boundaries and multiline data fields. */
export class SseDataParser {
    private buffer = "";
    push(chunk: string): string[] {
        this.buffer += chunk;
        if (this.buffer.length > 4 * 1024 * 1024) throw new Error("SSE frame exceeds the 4 MiB limit.");
        const data: string[] = [];
        let match: RegExpExecArray | null;
        while ((match = /\r?\n\r?\n/.exec(this.buffer))) {
            const block = this.buffer.slice(0, match.index);
            this.buffer = this.buffer.slice(match.index + match[0].length);
            const lines = block.split(/\r?\n/).filter((line) => line === "data" || line.startsWith("data:"));
            if (lines.length) data.push(lines.map((line) => line === "data" ? "" : line.slice(5).replace(/^ /, "")).join("\n"));
        }
        return data;
    }
}
export async function firstSseRpcResult(response: Response, id: unknown): Promise<unknown> {
    if (!response.body) throw new Error("No SSE response body.");
    const reader = response.body.getReader(), decoder = new TextDecoder(), parser = new SseDataParser();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) throw new Error("SSE stream ended before the matching JSON-RPC response.");
            for (const data of parser.push(decoder.decode(value, { stream: true }))) {
                if (!data || data === "[DONE]") continue;
                let event; try { event = JSON.parse(data); } catch { throw new Error("Invalid JSON in MCP SSE response."); }
                if (event.id === id && ("result" in event || "error" in event)) return event;
            }
        }
    } finally { await reader.cancel().catch(() => undefined); reader.releaseLock(); }
}
