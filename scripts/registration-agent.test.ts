import assert from "node:assert/strict";
import { rdapQuery, summarizeRdap, rdapRegistryUrl, lookupRdap } from "../src/lib/rdap";
import { inspectUserAgent, parseUserAgentHints } from "../src/lib/user-agent-inspector";
async function main() {
    assert.deepEqual(rdapQuery("BÜCHER.example"), { type: "domain", value: "xn--bcher-kva.example", bootstrapUrl: "https://data.iana.org/rdap/dns.json", path: "domain/xn--bcher-kva.example" });
    assert.equal(rdapQuery("8.8.8.8/24").path, "ip/8.8.8.8/24");
    assert.equal(rdapQuery("2001:0db8::/32").value, "2001:db8::/32");
    for (const invalid of ["https://example.com", "example.com/path", "example.com/24", "999.1.2.3", "8.8.8.8/33", "2001:db8::/129", "2001:invalid::"]) assert.throws(() => rdapQuery(invalid));
    assert.equal(rdapRegistryUrl(rdapQuery("www.example.com"), { services: [[["com"], ["http://insecure.example/", "https://rdap.example/registry/"]], [["example.com"], ["https://specific.example/"]]] }), "https://specific.example/domain/www.example.com");
    assert.equal(rdapRegistryUrl(rdapQuery("8.8.8.8"), { services: [[["0.0.0.0/0"], ["https://root.example/"]], [["8.0.0.0/8"], ["https://v4.example/registry/"]]] }), "https://v4.example/registry/ip/8.8.8.8");
    assert.equal(rdapRegistryUrl(rdapQuery("2001:db8::1"), { services: [[["::/0"], ["https://root.example/"]], [["2001:db8::/32"], ["https://v6.example/"]]] }), "https://v6.example/ip/2001%3Adb8%3A%3A1");
    assert.throws(() => rdapRegistryUrl(rdapQuery("example.com"), { services: [] }), /no RDAP/);
    assert.throws(() => rdapRegistryUrl(rdapQuery("example.com"), { services: [[["com"], ["https://user:pass@bad.example/", "javascript:alert(1)"]]] }), /HTTPS/);
    const summary = summarizeRdap({ objectClassName: "domain", ldhName: "EXAMPLE.COM", handle: "EXAMPLE-HANDLE", status: ["active"], nameservers: [{ ldhName: "ns1.example.com" }], events: [{ eventAction: "registration", eventDate: "1995-08-14T04:00:00Z" }], entities: [{ handle: "registrar", roles: ["registrar"], vcardArray: ["vcard", [["fn", {}, "text", "Public Fixture Registrar"]]], entities: [{ handle: "nested", roles: ["abuse"] }] }], links: [{ href: "javascript:alert(1)" }, { href: "https://user:password@example.com" }, { href: "https://rdap.example.com/domain/example.com", rel: "self" }], notices: [{ title: "Privacy", description: ["Some fields are redacted"] }], redacted: [{ name: "contact" }] });
    assert.equal(summary.entities[0].name, "Public Fixture Registrar"); assert.equal(summary.entities[1].handle, "nested"); assert.equal(summary.links.length, 1); assert.equal(summary.redactedFields, 1); assert.deepEqual(summary.nameservers, ["ns1.example.com"]);
    const chrome = inspectUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"); assert.equal(chrome.browser.name, "Chrome"); assert.equal(chrome.operatingSystem.name, "Windows"); assert.equal(chrome.cpu.architecture, "x86-64");
    const iphone = inspectUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"); assert.equal(iphone.browser.name, "Safari"); assert.equal(iphone.operatingSystem.name, "iOS"); assert.equal(iphone.device.type, "mobile"); assert.equal(iphone.cpu.architecture, "Unknown");
    const hints = inspectUserAgent("Mozilla/5.0 AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36", JSON.stringify({ platform: "Windows", architecture: "arm", bitness: "64", brands: [{ brand: "Google Chrome", version: "131" }], fullVersionList: [{ brand: "Google Chrome", version: "131.0.6778.0" }] })); assert.equal(hints.cpu.architecture, "arm (64-bit)"); assert.equal(hints.clientHints?.fullVersionList?.[0].version, "131.0.6778.0");
    assert.equal(inspectUserAgent("unknown-agent").browser.name, "Unknown"); assert.equal(inspectUserAgent("Googlebot/2.1").automationTokenDetected, true);
    assert.throws(() => parseUserAgentHints('{"mobile":"true"}')); assert.throws(() => inspectUserAgent("x".repeat(16_385)));
    if (process.env.EXPANSION_RDAP_ORIGIN) {
        for (const source of ["example.com", "8.8.8.8"]) {
            const record = await lookupRdap(rdapQuery(source), AbortSignal.timeout(25_000), ((url, options) => fetch(process.env.EXPANSION_RDAP_ORIGIN + String(url), options)) as typeof fetch);
            assert.ok(record.summary.handle || record.summary.name); console.log("Real RDAP public fixture:", source, record.summary.kind, record.summary.name, record.summary.handle, record.summary.events.length, "events");
        }
    }
    console.log("RDAP domain/IPv4/IPv6 input, safe entity/link summaries and browser/OS/device/CPU/hint/unknown UA fixtures passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
