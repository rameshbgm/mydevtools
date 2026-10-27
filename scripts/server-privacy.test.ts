import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { waitForRequest, hasWebhookListener, deliverRequest, clearSession } from "../src/lib/webhook-store";
import { consumeManagedRouteQuota } from "../src/lib/server-network-policy";
import { readConnectorBody } from "../src/lib/local-connector-auth";

async function main() {
    const id = "public-privacy-fixture-session";
    const payload = { method: "POST", path: "/fixture", query: {}, headers: { authorization: "public-fixture-only" }, bodyText: "public payload" };
    assert.equal(deliverRequest(id, payload), null, "No listener means no saved request");
    assert.deepEqual(await waitForRequest(id, 5, new AbortController().signal), [], "No replay of missed requests");
    const pending = waitForRequest(id, 1000, new AbortController().signal);
    assert.equal(hasWebhookListener(id), true);
    const deliveredId = deliverRequest(id, payload);
    assert.ok(deliveredId);
    assert.deepEqual(await pending, [{ ...payload, id: deliveredId, receivedAt: (await pending)[0].receivedAt }]);
    assert.equal(hasWebhookListener(id), false, "Delivery releases the listener immediately");
    assert.deepEqual(await waitForRequest(id, 5, new AbortController().signal), [], "Delivered data cannot be replayed");
    const abort = new AbortController(), aborted = waitForRequest(id, 1000, abort.signal);
    abort.abort(); assert.deepEqual(await aborted, []); assert.equal(hasWebhookListener(id), false);
    const cleared = waitForRequest(id, 1000, new AbortController().signal);
    clearSession(id); assert.deepEqual(await cleared, []); assert.equal(hasWebhookListener(id), false);
    const older = waitForRequest(id, 1000, new AbortController().signal);
    const replacement = waitForRequest(id, 5, new AbortController().signal);
    assert.deepEqual(await older, []); assert.deepEqual(await replacement, []);
    assert.equal(hasWebhookListener(id), false);

    for (const source of ['{"file":"public-fixture"}', '["invalid-object"]', 'too large']) {
        const bytes = new TextEncoder().encode(source);
        const request = new Request("http://localhost/api/local-connectors", { method: "POST", duplex: "half", body: new ReadableStream({ start(controller) { controller.enqueue(bytes); controller.close(); } }) } as RequestInit);
        if (source.startsWith('{')) assert.deepEqual(await readConnectorBody(request), { file: "public-fixture" });
        else await assert.rejects(() => readConnectorBody(request, source === 'too large' ? 3 : undefined));
        assert.ok(bytes.every((byte) => byte === 0), "Connector byte buffers are cleared on success and failure");
    }
    const scope = "privacy-unit-fixture";
    assert.equal(consumeManagedRouteQuota(new Request("http://localhost", { headers: { "x-forwarded-for": "192.0.2.1" } }), scope, 1), true);
    assert.equal(consumeManagedRouteQuota(new Request("http://localhost", { headers: { "x-forwarded-for": "192.0.2.2" } }), scope, 1), false, "Quota is aggregate, not a client tracking record");

    for (const [source, exit] of [
        ['console.log("public-log-sentinel"); console.error("public-error-sentinel"); process.emitWarning("public-warning-sentinel"); process.stdout.write("public-write", () => { if (process.env.OTEL_SDK_DISABLED !== "true") process.exitCode = 2; }); require("./desktop/privacy.cjs")();', 0],
        ['throw new Error("public-fatal-sentinel")', 1],
        ['Promise.reject(new Error("public-rejection-sentinel"))', 1],
    ] as const) {
        const child = spawnSync(process.execPath, ["--require", "./scripts/preload-privacy.cjs", "-e", source], { encoding: "utf8" });
        assert.equal(child.status, exit); assert.equal(child.stdout, ""); assert.equal(child.stderr, "");
    }
    console.log("Server privacy: live delivery without replay, timeout/abort/clear cleanup, scrubbed connector bytes, no client quota tracking, and silent normal/warning/fatal/rejection paths passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
