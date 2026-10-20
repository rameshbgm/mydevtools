import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
const nativeRequire = createRequire(resolve("package.json"));
const ts = nativeRequire("typescript"), React = nativeRequire("react"), runtime = nativeRequire("react/jsx-runtime");
const root = process.env.NETWORK_TEST_ROOT || process.cwd();
const { NETWORK_TOOL_TRANSLATIONS: rows } = nativeRequire(resolve(root, "src/lib/i18n/network-tools.ts"));
const { LANGUAGES, SHARED_TRANSLATIONS, translate } = nativeRequire(resolve("src/lib/i18n/catalog.ts"));
const languageIds = LANGUAGES.map((item: { id: string }) => item.id);
const tFor = (language: string, source: string, values?: Record<string, string | number>) => {
    let text = language === "en" ? source : (rows[source]?.[languageIds.indexOf(language) - 1] ?? translate(language, source));
    for (const [key, value] of Object.entries(values ?? {})) text = text.replaceAll(`{${key}}`, String(value));
    return text;
};
const placeholders = (s: string) => (s.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(rows) as [string, string[]][]) {
    assert.equal(columns.length, 7, source);
    columns.forEach((value, i) => {
        assert.ok(value.trim(), source); assert.deepEqual(placeholders(value), placeholders(source));
        if (Object.hasOwn(SHARED_TRANSLATIONS, source)) assert.deepEqual(columns, SHARED_TRANSLATIONS[source], `Catalog collision: ${source}`);
        if (!process.env.NETWORK_TEST_ROOT) assert.equal(translate(languageIds[i + 1], source), value, `Catalog missing ${source}`);
    });
}
const names = ["dns-lookup", "subnet-calculator", "websocket-tester", "url-parser"];
for (const name of names) {
    const source = readFileSync(resolve(root, `src/app/tools/${name}/page.tsx`), "utf8"), file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function scan(node: any) {
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && ts.isStringLiteral(node.arguments[0])) assert.ok(rows[node.arguments[0].text] || SHARED_TRANSLATIONS[node.arguments[0].text], `Missing ${name}: ${node.arguments[0].text}`);
        if (ts.isJsxText(node) && node.text.trim()) assert.ok(["/", "...", ":", "@", "TTL", "s", "|", "protocol", "hostname", "port", "pathname", "search", "hash"].includes(node.text.trim()), `Untranslated JSX ${name}: ${node.text}`);
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            const tag = node.tagName.getText(file);
            if (["Input", "InputNumber", "TextArea"].includes(tag)) {
                assert.ok(node.attributes.properties.some((attr: any) => ts.isJsxAttribute(attr) && attr.name.text === "dir" && attr.initializer.text === "ltr"));
                assert.ok(node.attributes.properties.some((attr: any) => ts.isJsxAttribute(attr) && attr.name.text === "aria-label"), `${name}/${tag}: accessible name`);
            }
        }
        ts.forEachChild(node, scan);
    } scan(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
}
type Element = { type: string; props: Record<string, any> };
function harness(name: string, initial: Record<string, any> = {}) {
    const path = resolve(root, `src/app/tools/${name}/page.tsx`), source = readFileSync(path, "utf8"), file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), stateNames: string[] = [];
    function collect(node: any) { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") stateNames.push(node.name.elements[0].getText(file)); ts.forEachChild(node, collect); } collect(file);
    let delayCopies = false;
    const copyResolutions: ((value: boolean) => void)[] = [];
    let language = "en", stateIndex = 0, refIndex = 0, memoIndex = 0, effectIndex = 0, renderPhase = false;
    const cells: any[] = [], refs: any[] = [], memos: any[] = [], effects: any[] = [], writes: string[] = [], copies: string[] = [], notices: string[] = [], requests: any[] = [], sockets: any[] = [];
    const stub = () => null, ui = (tag: string) => (props: Record<string, any>) => React.createElement(tag, props, props.title || props.extra ? [props.title, props.extra, props.children] : props.children);
    const message = { success: (text: string) => notices.push(text), warning: (text: string) => notices.push(text), error: (text: string) => notices.push(text) };
    class Socket {
        static OPEN = 1; static CLOSED = 3; readyState = 0; onopen?: () => void; onmessage?: (event: any) => void; onerror?: () => void; onclose?: (event: any) => void; sent: string[] = []; closes = 0;
        constructor(public url: string) { sockets.push(this); }
        send(text: string) { this.sent.push(text); }
        close() { this.closes++; this.readyState = 3; }
    }
    const compiled = { exports: {} as { default: () => any } };
    const dependencies = (moduleName: string): any => {
        if (moduleName === "react") return { ...React,
            useState: (fallback: any) => { const i = stateIndex++; if (!(i in cells)) cells[i] = Object.hasOwn(initial, stateNames[i]) ? initial[stateNames[i]] : typeof fallback === "function" ? fallback() : fallback; return [cells[i], (value: any) => { assert.ok(!renderPhase, "No state writes during render"); cells[i] = typeof value === "function" ? value(cells[i]) : value; writes.push(stateNames[i]); }]; },
            useRef: (fallback: any) => { const i = refIndex++; if (!(i in refs)) refs[i] = { current: fallback }; return refs[i]; },
            useMemo: (compute: () => any, deps: any[]) => { const i = memoIndex++; if (!memos[i] || deps.some((value, k) => value !== memos[i].deps[k])) memos[i] = { deps, value: compute() }; return memos[i].value; },
            useEffect: (fn: () => any, deps: any[]) => { const i = effectIndex++; if (!effects[i] || deps.some((value, k) => value !== effects[i].deps[k])) effects[i] = { deps, fn, pending: true, cleanup: effects[i]?.cleanup }; }
        };
        if (moduleName === "react/jsx-runtime") return runtime;
        if (moduleName.endsWith("LanguageProvider")) return { useLanguage: () => { const locale = language; return { language: locale, direction: locale === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => tFor(locale, source, values) }; } };
        if (moduleName.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: Record<string, any>) => React.createElement("layout", props, props.title, props.description, Object.values(props.learnMore ?? {}).flat(), props.children) };
        if (moduleName === "@ant-design/icons") return new Proxy({}, { get: () => stub });
        if (moduleName === "antd") {
            const Input = Object.assign(ui("input"), { TextArea: ui("textarea") }), Space = Object.assign(ui("space"), { Compact: ui("compact") }), Select = Object.assign(ui("select"), { Option: ui("option") }), Descriptions = Object.assign(ui("descriptions"), { Item: ui("description") });
            return { Input, Space, Select, Descriptions, Typography: { Text: ui("text"), Paragraph: ui("paragraph") }, Card: ui("card"), Button: ui("button"), Row: ui("row"), Col: ui("col"), Tag: ui("tag"), Alert: ui("alert"), Table: ui("table"), Slider: ui("slider"), InputNumber: ui("number"), Tooltip: ui("tooltip"), Divider: ui("divider"), Spin: ui("spin"), Empty: Object.assign(ui("empty"), { PRESENTED_IMAGE_SIMPLE: "simple" }), App: { useApp: () => ({ message }) } };
        }
        if (moduleName.endsWith("clipboard")) return { copyToClipboard: async (value: string) => { copies.push(value); return delayCopies ? new Promise<boolean>((resolve) => copyResolutions.push(resolve)) : true; } };
        if (moduleName.endsWith("certificate-fetch-response")) return nativeRequire(resolve("src/lib/certificate-fetch-response.ts"));
        throw new Error(`Unexpected dependency ${moduleName}`);
    };
    const fetch = (url: string, options: any) => new Promise<Response>((resolve, reject) => requests.push({ url, options, resolve, reject }));
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, { module: compiled, exports: compiled.exports, require: dependencies, URL, Date, Intl, Error, String, Number, Blob, ArrayBuffer, fetch, WebSocket: Socket });
    const state = () => Object.fromEntries(stateNames.map((key, i) => [key, cells[i]]));
    const render = (next = language) => {
        language = next; stateIndex = refIndex = memoIndex = effectIndex = 0;
        const elements: Element[] = [], text: string[] = [];
        function walk(node: any) {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { text.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            if (typeof node.type === "function") { walk(node.type(node.props)); return; }
            if (node.props) { elements.push(node); walk(node.props.children); }
        }
        renderPhase = true; try { walk(compiled.exports.default()); } finally { renderPhase = false; }
        effects.forEach((effect) => { if (effect.pending) { effect.cleanup?.(); effect.cleanup = effect.fn(); effect.pending = false; } });
        const button = (source: string) => { const found = elements.find((node) => node.type === "button" && node.props.children === tFor(language, source)); assert.ok(found, `Missing button ${name}/${source}/${language}`); return found.props.onClick as () => any; };
        return { elements, text: text.join(" "), button, field: (source: string) => { const found = elements.find((node) => node.props["aria-label"] === tFor(language, source)); assert.ok(found, `Missing field ${name}/${source}/${language}`); return found; } };
    };
    const stable = () => { const before = JSON.stringify(state()), requestsBefore = requests.length, socketsBefore = sockets.length, closes = sockets.map((socket) => socket.closes); writes.length = 0; for (const id of languageIds) render(id); assert.equal(JSON.stringify(state()), before); assert.deepEqual(writes, []); assert.equal(requests.length, requestsBefore); assert.equal(sockets.length, socketsBefore); assert.deepEqual(sockets.map((socket) => socket.closes), closes, "Locale must not close or reconnect sockets"); };
    return { render, state, stable, copies, notices, requests, sockets, pauseCopies: () => { delayCopies = true; }, finishCopy: () => copyResolutions.shift()!(true), cleanup: () => effects.forEach((effect) => effect.cleanup?.()) };
}
async function main() {
const response = { Status: 0, Answer: [{ name: "fixture.example.", type: 1, TTL: 300, data: "192.0.2.42" }] };
for (const id of languageIds) {
    const dns = harness("dns-lookup", { hostname: "例え.example", types: ["A", "MX"] });
    let view = dns.render(id); const pending = view.button("Lookup")(); assert.equal(dns.requests.length, 2);
    assert.deepEqual(dns.requests.map((request) => request.url), ["https://cloudflare-dns.com/dns-query?name=%E4%BE%8B%E3%81%88.example&type=A", "https://cloudflare-dns.com/dns-query?name=%E4%BE%8B%E3%81%88.example&type=MX"]);
    assert.equal(dns.requests[0].options.headers.Accept, "application/dns-json"); dns.stable();
    dns.requests.forEach((request) => request.resolve(new Response(JSON.stringify(response), { headers: { "content-type": "application/json" } }))); await pending;
    view = dns.render(id); assert.ok(view.text.includes("192.0.2.42")); await view.button("Copy all")();
    assert.equal(dns.copies[0], "; DNS lookup for 例え.example via cloudflare\n\n;; A\nfixture.example.\t300\tIN\tA\t192.0.2.42\n\n;; MX\nfixture.example.\t300\tIN\tA\t192.0.2.42\n");
    assert.equal(dns.notices.at(-1), tFor(id, "Copied as zone-file lines")); dns.stable();
    const empty = harness("dns-lookup", { hostname: " " }); empty.render(id).button("Lookup")(); assert.equal(empty.requests.length, 0); assert.equal(empty.notices[0], tFor(id, "Enter a hostname"));
    const failure = harness("dns-lookup", { types: ["A"] }); const failed = failure.render(id).button("Lookup")(); failure.requests[0].reject(new Error("external 原因 %")); await failed; assert.ok(failure.render(id).text.includes("external 原因 %")); failure.stable();

    const socket = harness("websocket-tester", { url: "wss://fixture.example/path?key=%25", outgoing: '{"message":"हिन्दी 日本語 العربية 🌍"}' });
    view = socket.render(id); view.button("Connect")(); assert.equal(socket.sockets.length, 1); assert.equal(socket.sockets[0].url, "wss://fixture.example/path?key=%25"); socket.stable();
    const transport = socket.sockets[0]; transport.readyState = 1; transport.onopen(); view = socket.render(id); assert.ok(view.text.includes(tFor(id, "Connection opened"))); view.button("Send frame")(); assert.equal(transport.sent[0], '{"message":"हिन्दी 日本語 العربية 🌍"}');
    transport.onmessage({ data: "opaque %252F 🌍 العربية" }); transport.onmessage({ data: new Blob([new Uint8Array([0, 255, 1])]) });
    view = socket.render(id); assert.ok(view.text.includes("opaque %252F 🌍 العربية")); assert.ok(view.text.includes(tFor(id, "[binary blob, {count} bytes]", { count: 3 }))); assert.equal(socket.state().frames.at(-1).data, "[binary blob, 3 bytes]"); socket.stable();
    transport.onerror(); transport.onclose({ code: 1008, reason: "policy 原因 %" }); view = socket.render(id); assert.ok(view.text.includes(tFor(id, "Closed (code {code}, reason: {reason})", { code: 1008, reason: "policy 原因 %" }))); assert.ok(view.text.includes(tFor(id, "Socket error"))); view.button("Clear")(); assert.equal(socket.state().frames.length, 0); socket.stable(); socket.cleanup(); assert.equal(transport.closes, 1);
    const idle = harness("websocket-tester"); idle.render(id).button("Send frame")(); assert.equal(idle.notices[0], tFor(id, "Socket not open")); idle.stable();
}
const inFlight = harness("dns-lookup", { results: { A: response } });
inFlight.pauseCopies(); const copyPending = inFlight.render("en").button("Copy all")(); inFlight.render("ar"); inFlight.finishCopy(); await copyPending; assert.equal(inFlight.notices.at(-1), tFor("ar", "Copied as zone-file lines"));
const retained = harness("websocket-tester"); const originalSend = retained.render("en").button("Send frame"); retained.render("fr"); originalSend(); assert.equal(retained.notices.at(-1), tFor("fr", "Socket not open"));
// Real URLSearchParams is the independent parser oracle, including literal percent and opaque schemes.
for (const input of ["https://u:p@example.test:443/a%252Fb?tag=a&tag=b&q=%25&literal=%252F&bad=%E0%A4#frag", "mailto:user@example.test?subject=Hello%25&subject=二", "custom:opaque%25?x=%2525&x=2", "https://[2001:db8::1]:8443/日本語?q=العربية", "file:///tmp/a%20b?x=%25", "custom:(none)?q=%25", "custom:(default)?q=1"]) {
    const oracle = new URL(input), page = harness("url-parser", { url: input });
    for (const id of languageIds) {
        const view = page.render(id), table = view.elements.find((node) => node.type === "table"), expected = Array.from(oracle.searchParams.entries());
        assert.ok(view.text.includes(oracle.href));
        const pathRow = view.elements.find((node) => node.type === "description" && node.props.label === tFor(id, "Pathname")); assert.ok(pathRow);
        const pathChildren = pathRow.props.children.props.children; assert.equal(pathChildren[0].props.children, oracle.pathname); if (oracle.pathname) { await pathChildren[1].props.onClick(); assert.equal(page.copies.at(-1), oracle.pathname); }
        assert.ok(table); assert.deepEqual(JSON.parse(JSON.stringify(table.props.dataSource.map((row: any) => [row.paramKey, row.value]))), expected);
        for (const row of table.props.dataSource) {
            const rendered: Element = table.props.columns[1].render(row.value); assert.equal(rendered.props.children, row.value, "Never decode a query value twice");
            await table.props.columns[2].render(undefined, row).props.onClick(); assert.equal(page.copies.at(-1), row.value);
        }
        const fullCopy = view.elements.find((node) => node.type === "button" && typeof node.props.onClick === "function" && String(node.props.onClick).includes("item.value")); assert.ok(fullCopy); await fullCopy.props.onClick(); assert.equal(page.copies.at(-1), oracle.href);
    } page.stable();
}
// Independent well-known IPv4 results and public route handlers, including the previous /0 bugs.
const subnetFixtures = [
    { ip: "192.168.1.77", cidr: 24, network: "192.168.1.0", broadcast: "192.168.1.255", first: "192.168.1.1", last: "192.168.1.254", mask: "255.255.255.0", hosts: 254 },
    { ip: "203.0.113.7", cidr: 0, network: "0.0.0.0", broadcast: "255.255.255.255", first: "0.0.0.1", last: "255.255.255.254", mask: "0.0.0.0", hosts: 4294967294 },
    { ip: "192.0.2.11", cidr: 31, network: "192.0.2.10", broadcast: "192.0.2.11", first: "192.0.2.10", last: "192.0.2.11", mask: "255.255.255.254", hosts: 2 },
    { ip: "198.51.100.8", cidr: 32, network: "198.51.100.8", broadcast: "198.51.100.8", first: "198.51.100.8", last: "198.51.100.8", mask: "255.255.255.255", hosts: 1 },
];
for (const fixture of subnetFixtures) for (const id of languageIds) {
    const subnet = harness("subnet-calculator", { inputIP: fixture.ip, cidr: fixture.cidr, inputMask: fixture.mask });
    let view = subnet.render(id); await view.button("Copy All")(); const expected = `IP Address: ${fixture.ip}/${fixture.cidr}\nNetwork Address: ${fixture.network}\nBroadcast Address: ${fixture.broadcast}\nSubnet Mask: ${fixture.mask}`; assert.ok(subnet.copies.at(-1)!.startsWith(expected)); assert.ok(subnet.copies.at(-1)!.includes(`First Host: ${fixture.first}\nLast Host: ${fixture.last}`)); assert.ok(subnet.copies.at(-1)!.endsWith(`Usable Hosts: ${fixture.hosts.toLocaleString()}`)); subnet.stable();
    view = subnet.render(id); view.field("Subnet input mode").props.onChange("mask"); view = subnet.render(id); view.field("Subnet Mask").props.onChange({ target: { value: "0.0.0.0" } }); view = subnet.render(id); assert.equal(subnet.state().cidr, 0); await view.button("Copy All")(); assert.ok(subnet.copies.at(-1)!.includes("Network Address: 0.0.0.0\nBroadcast Address: 255.255.255.255"));
    view.field("Subnet Mask").props.onChange({ target: { value: "255.0.255.0" } }); view = subnet.render(id); assert.ok(view.elements.some((node) => node.type === "alert" && node.props.title === tFor(id, "Invalid Input"))); assert.ok(!view.elements.some((node) => node.type === "button" && node.props.children === tFor(id, "Copy All"))); subnet.stable();
    view = subnet.render(id); view.field("Subnet input mode").props.onChange("cidr"); view = subnet.render(id); view.elements.find((node) => node.type === "number")!.props.onChange(0); assert.equal(subnet.state().cidr, 0); subnet.stable();
}
for (const initial of [{ inputIP: "01.2.3.4" }, { inputIP: "256.1.1.1" }, { inputIP: "192.0.2" }, { cidr: -1 }, { cidr: 33 }, { cidr: 24.5 }, { inputMode: "mask", inputMask: "255.255.255.1" }, { inputMode: "mask", inputMask: "255.255.0" }]) {
    const invalid = harness("subnet-calculator", initial); for (const id of languageIds) assert.ok(invalid.render(id).elements.some((node) => node.type === "alert" && node.props.title === tFor(id, "Invalid Input"))); invalid.stable();
}
console.log("Network tools: eight-language rendered callbacks, DNS/WebSocket boundary stubs, unchanged requests/payloads on locale changes, URL percent/duplicate/opaque fixtures and strict IPv4 /0-/32 fixtures passed. No external network or browser execution claimed.");

}
main().catch((error) => { console.error(error); process.exitCode = 1; });
