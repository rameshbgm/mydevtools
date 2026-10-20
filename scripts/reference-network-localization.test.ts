/* eslint-disable @typescript-eslint/no-explicit-any -- Hook VM fixtures inspect actual heterogeneous page callbacks. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { REFERENCE_NETWORK_TRANSLATIONS as rows, referenceNetworkMatches } from "../src/lib/i18n/reference-network";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
const ids = ["port-reference", "ip-ranges-reference"];
const root = process.env.REFERENCE_NETWORK_STAGE_ROOT ?? process.cwd();
const placeholders = (text: string) => (text.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
const tr = (language: Language, source: string, values: Record<string, string | number> = {}) => {
    let value = language === "en" ? source : rows[source]?.[LANGUAGES.findIndex(item => item.id === language) - 1] ?? translate(language, source);
    for (const [key, item] of Object.entries(values)) value = value.replaceAll(`{${key}}`, String(item));
    return value;
};
for (const [source, columns] of Object.entries(rows)) {
    assert.equal(columns.length, 7, source);
    columns.forEach((value, index) => {
        assert.ok(value.trim()); assert.deepEqual(placeholders(value), placeholders(source));
        for (const token of source.match(/RFC \d+|(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/\d+)?|[a-f0-9:]*::[a-f0-9:.]*(?:\/\d+)?/gi) ?? []) assert.ok(value.includes(token), `Technical identifier changed: ${token} in ${source}`);
        if (SHARED_TRANSLATIONS[source]) assert.deepEqual(columns, SHARED_TRANSLATIONS[source], `Shared collision: ${source}`);
        if (!process.env.REFERENCE_NETWORK_STAGE_ROOT) assert.equal(translate(LANGUAGES[index + 1].id, source), value, `Catalog wiring: ${source}`);
    });
}
for (const id of ids) {
    const source = readFileSync(resolve(root, `src/app/tools/${id}/page.tsx`), "utf8"), file = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function scan(node: ts.Node) {
        if (ts.isJsxText(node) && /[A-Za-z]/.test(node.text)) {
            const text = node.text.trim();
            assert.match(text, /^(?:TCP|UDP|(?:AWS|Google Cloud|Azure|Cloudflare|GitHub|Fastly):|[—· ]*TEST-NET-[123]|2001:db8::\/32|(?:[a-z0-9.-]+\.[a-z]{2,}[^ ]*|\/ips-v6))$/, `${id}: raw authored UI copy ${text}`);
        }
        if (ts.isCallExpression(node) && node.expression.getText(file) === "t" && node.arguments[0]) {
            const collect = (child: ts.Node) => {
                if (ts.isStringLiteral(child)) assert.ok(rows[child.text] || SHARED_TRANSLATIONS[child.text], `${id}: untranslated ${child.text}`);
                else if (ts.isConditionalExpression(child)) { collect(child.whenTrue); collect(child.whenFalse); }
            }; collect(node.arguments[0]);
        }
        if (ts.isPropertyAssignment(node) && ["description", "details", "category"].includes(node.name.getText(file)) && ts.isStringLiteral(node.initializer)) assert.ok(rows[node.initializer.text] || SHARED_TRANSLATIONS[node.initializer.text], `${id}: reference prose not translated: ${node.initializer.text}`);
        ts.forEachChild(node, scan);
    } scan(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
}
const nativeRequire = createRequire(resolve("package.json")), React = nativeRequire("react"), jsxRuntime = nativeRequire("react/jsx-runtime");
function harness(id: string, initial: Record<string, any> = {}, saved: string | null = null) {
    const source = readFileSync(resolve(root, `src/app/tools/${id}/page.tsx`), "utf8"), file = ts.createSourceFile(id, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), stateNames: string[] = [];
    function scan(node: ts.Node) {
        if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") stateNames.push(node.name.elements[0].getText(file));
        ts.forEachChild(node, scan);
    } scan(file);
    const cells: any[] = [], refs: any[] = [], effects: any[] = [], memos: any[] = [], writes: string[] = [], storageWrites: string[] = [], copies: { value: string; label?: string }[] = [], downloads: { value: string; filename: string; mime: string }[] = [];
    let stateIndex = 0, refIndex = 0, effectIndex = 0, memoIndex = 0, language: Language = "en", renderPhase = false, now = 1_000_000, nextTimer = 0, randomCalls = 0;
    const randomValues: number[] = [], timers = new Map<number, { fn: () => void; delay: number; due: number; interval: boolean }>();
    const schedule = (fn: () => void, delay = 0, interval = false) => { const id = ++nextTimer; timers.set(id, { fn, delay, due: now + delay, interval }); return id; };
    const clear = (id: number) => timers.delete(id);
    const advance = (ms: number) => {
        now += ms;
        // Simulate a throttled browser: each due interval callback runs once, not once per missed tick.
        for (const [key, item] of [...timers]) if (timers.has(key) && item.due <= now) { if (item.interval) item.due = now + item.delay; else timers.delete(key); item.fn(); }
    };
    const memoCell = (fn: () => any, deps: any[]) => { const i = memoIndex++; if (!memos[i] || deps.some((value, k) => value !== memos[i].deps[k])) memos[i] = { deps, value: fn() }; return memos[i].value; };
    const hooks = { ...React,
        useState: (fallback: any) => { const i = stateIndex++; if (!(i in cells)) cells[i] = Object.hasOwn(initial, stateNames[i]) ? initial[stateNames[i]] : typeof fallback === "function" ? fallback() : fallback; return [cells[i], (value: any) => { assert.ok(!renderPhase, `${id}: state writes during render`); cells[i] = typeof value === "function" ? value(cells[i]) : value; writes.push(stateNames[i]); }]; },
        useRef: (fallback: any) => { const i = refIndex++; return refs[i] ?? (refs[i] = { current: fallback }); }, useMemo: memoCell,
        useCallback: (fn: any, deps: any[]) => memoCell(() => fn, deps),
        useEffect: (fn: any, deps: any[] = []) => { const i = effectIndex++; if (!effects[i] || deps.some((value, k) => value !== effects[i].deps[k])) effects[i] = { fn, deps, pending: true, cleanup: effects[i]?.cleanup }; },
    };
    const ui = (tag: string) => function FixtureUI(props: any) { return React.createElement(tag, props, props.title || props.extra ? [props.title, props.extra, props.children] : props.children); };
    const stub = () => null, motion = new Proxy({}, { get: (_, tag) => ui(`motion-${String(tag)}`) });
    const dependencies = (name: string): any => {
        if (name === "react") return hooks;
        if (name === "react/jsx-runtime") return jsxRuntime;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => { const locale = language; return { language: locale, direction: locale === "ar" ? "rtl" : "ltr", t: (source: string, values?: Record<string, string | number>) => tr(locale, source, values) }; } };
        if (name.endsWith("store")) return { useAppStore: () => ({ darkMode: false }) };
        if (name.endsWith("project-storage")) return { projectStorage: { getItem: () => saved, setItem: (_: string, value: string) => storageWrites.push(value) } };
        if (name.endsWith("clipboard")) return { copyToClipboard: (value: string, label?: string) => { copies.push({ value, label }); return Promise.resolve(true); } };
        if (name.endsWith("download")) return { downloadText: (value: string, filename: string, mime: string) => downloads.push({ value, filename, mime }) };
        if (name.endsWith("table-export")) return nativeRequire(resolve("src/lib/table-export.ts"));
        if (name.endsWith("reference-network")) return { referenceNetworkMatches };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: any) => React.createElement("layout", props, props.title, props.description, Object.values(props.learnMore ?? {}).flat(), props.children) };
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => stub });
        if (name === "framer-motion") return { motion, AnimatePresence: ui("presence") };
        if (name === "antd") return { Button: ui("button"), Card: ui("card"), Typography: { Text: ui("text"), Title: ui("title"), Paragraph: ui("paragraph") }, Row: ui("row"), Col: ui("col"), Space: Object.assign(ui("space"), { Compact: ui("compact") }), Select: Object.assign(ui("select"), { Option: ui("option") }), Input: ui("input"), InputNumber: ui("number"), Statistic: ui("statistic"), Switch: ui("switch"), Table: function TableFixture(props: any) { return React.createElement("table", props, props.dataSource.map((record: any) => props.columns.map((column: any) => React.createElement("cell", { key: column.key }, column.render ? column.render(record[column.dataIndex], record) : record[column.dataIndex])))); }, Tag: ui("tag"), Tooltip: ui("tooltip"), Progress: ui("progress"), Divider: ui("divider"), Alert: ui("alert"), Segmented: ui("segmented"), Tabs: ui("tabs"), Badge: ui("badge"), Descriptions: Object.assign(ui("descriptions"), { Item: ui("description") }) };
        throw new Error(`Unexpected dependency ${name}`);
    };
    class ClockDate extends Date { static now() { return now; } }
    const math = Object.create(Math); math.random = () => { randomCalls++; return randomValues.shift() ?? 0.25; };
    const compiled = { exports: {} as { default: () => any } };
    runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, { module: compiled, exports: compiled.exports, require: dependencies, Date: ClockDate, Math: math, setTimeout: (fn: () => void, delay: number) => schedule(fn, delay), setInterval: (fn: () => void, delay: number) => schedule(fn, delay, true), clearTimeout: clear, clearInterval: clear });
    const state = () => JSON.parse(JSON.stringify(Object.fromEntries(stateNames.map((key, i) => [key, cells[i]]))));
    const render = (next = language) => {
        language = next; stateIndex = refIndex = effectIndex = memoIndex = 0;
        const elements: any[] = [], text: string[] = [];
        const walk = (node: any): void => {
            if (node == null || typeof node === "boolean") return;
            if (typeof node === "string" || typeof node === "number") { text.push(String(node)); return; }
            if (Array.isArray(node)) { node.forEach(walk); return; }
            if (typeof node.type === "function") { walk(node.type(node.props)); return; }
            elements.push(node); walk(node.props?.children);
        };
        renderPhase = true; try { walk(compiled.exports.default()); } finally { renderPhase = false; }
        effects.forEach(effect => { if (effect.pending) { effect.cleanup?.(); effect.pending = false; effect.cleanup = effect.fn(); } });
        const find = (type: string, predicate: (props: any) => boolean = () => true) => { const element = elements.find(node => node.type === type && predicate(node.props)); assert.ok(element, `${id}: missing ${type}`); return element.props; };
        return { elements, text: text.join(" "), find, button: (source: string, values?: Record<string, string | number>) => find("button", props => props.children === tr(language, source, values)) };
    };
    const stable = () => { const before = state(), count = randomCalls, tasks = [...timers.keys()], storage = [...storageWrites]; writes.length = 0; for (const item of LANGUAGES) render(item.id); assert.deepEqual(state(), before, `${id}: locale mutated data`); assert.deepEqual(writes, [], `${id}: locale wrote state`); assert.equal(randomCalls, count, `${id}: locale rerolled`); assert.deepEqual([...timers.keys()], tasks, `${id}: locale restarted timer`); assert.deepEqual(storageWrites, storage, `${id}: locale wrote storage`); };
    return { render, state, stable, advance, timers, randomValues, storageWrites, copies, downloads, randomCalls: () => randomCalls, cleanup: () => effects.forEach(effect => effect.cleanup?.()) };
}
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
function textOf(node: any): string {
    if (node == null || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(textOf).join(" ");
    if (typeof node.type === "function") return textOf(node.type(node.props));
    return textOf(node.props?.children);
}
for (const language of LANGUAGES) {
    const ports = harness("port-reference"); let view = ports.render(language.id); const allPorts = clone(view.find("table").dataSource);
    assert.equal(new Set(allPorts.map((record: any) => view.find("table").rowKey(record))).size, allPorts.length, "Port/service/protocol keys are unique");
    for (const record of allPorts) { const column = view.find("table").columns.find((column: any) => column.key === "description"); assert.equal(column.render(record.description), tr(language.id, record.description)); }
    ports.stable();
    for (const locale of LANGUAGES) { view = ports.render(locale.id); assert.deepEqual(clone(view.find("table").dataSource), allPorts); }
    view = ports.render(language.id); view.find("input", props => props["aria-label"] === tr(language.id, "Quick Port Lookup")).onChange({ target: { value: "3000" } }); view = ports.render(); assert.equal(view.elements.filter(node => node.type === "descriptions" && node.props.column.md === 4).length, 2); assert.ok(view.text.includes("Grafana / Dev")); assert.ok(view.text.includes("Dev Server")); ports.stable();
    view = ports.render(language.id); view.find("input", props => props["aria-label"] === tr(language.id, "Quick Port Lookup")).onChange({ target: { value: "465" } }); view = ports.render(); assert.ok(view.text.includes(tr(language.id, "Message submission with implicit TLS (RFC 8314)"))); assert.ok(!view.text.includes("deprecated, use 587"));
    const copy = view.find("button", props => props["aria-label"] === tr(language.id, "Copy {value}", { value: 465 })); copy.onClick(); assert.equal(ports.copies.at(-1)?.value, "465");
    for (const input of ["443abc", "443.9", "443e0", "0x1bb", "-1", "65536", "٤٤٣", " "]) { view = ports.render(language.id); view.find("input", props => props["aria-label"] === tr(language.id, "Quick Port Lookup")).onChange({ target: { value: input } }); view = ports.render(); assert.equal(view.elements.filter(node => node.type === "descriptions" && node.props.column.md === 4).length, 0, input); assert.equal(view.find("alert").title, tr(language.id, "Enter a whole port number from 0 to 65535.")); ports.stable(); }
    view = ports.render(language.id); view.find("input", props => props["aria-label"] === tr(language.id, "Quick Port Lookup")).onChange({ target: { value: "65535" } }); view = ports.render(); assert.equal(view.find("alert").title, tr(language.id, "No listed service for port {port}", { port: 65535 }));
    view.find("select", props => props.value === "all" && props["aria-label"] === tr(language.id, "Category")).onChange("Database"); view = ports.render(); view.find("select", props => props["aria-label"] === tr(language.id, "Protocol")).onChange("UDP"); view = ports.render(); assert.deepEqual(clone(view.find("table").dataSource).map((record: any) => record.port), [1434]); ports.stable();
    view = ports.render(language.id); view.find("select", props => props["aria-label"] === tr(language.id, "Category")).onChange("all"); view.find("input", props => props["aria-label"] === tr(language.id, "Search reference")).onChange({ target: { value: "443" } }); view = ports.render(); assert.ok(view.find("table").dataSource.some((record: any) => record.port === 443 && record.protocol === "TCP/UDP"), "HTTP/3 UDP port preserved"); ports.stable();
    view = ports.render(language.id); view.find("input", props => props["aria-label"] === tr(language.id, "Search reference")).onChange({ target: { value: tr(language.id, "Message submission with implicit TLS (RFC 8314)") } }); view.find("select", props => props["aria-label"] === tr(language.id, "Protocol")).onChange("all"); view = ports.render(); assert.deepEqual(clone(view.find("table").dataSource).map((record: any) => record.port), [465]); ports.stable();
    view = ports.render(language.id); view.find("input", props => props["aria-label"] === tr(language.id, "Search reference")).onChange({ target: { value: "" } }); view.find("select", props => props["aria-label"] === tr(language.id, "Category")).onChange("Email"); view.find("select", props => props["aria-label"] === tr(language.id, "Security")).onChange("secure"); view = ports.render(); assert.deepEqual(clone(view.find("table").dataSource).map((record: any) => record.port), [465, 587, 993, 995]); ports.stable();
    view = ports.render(language.id); view.find("select", props => props["aria-label"] === tr(language.id, "Security")).onChange("insecure"); view = ports.render(); assert.deepEqual(clone(view.find("table").dataSource).map((record: any) => record.port), [25, 110, 143]); ports.stable(); ports.cleanup();

    const ip = harness("ip-ranges-reference"); view = ip.render(language.id); const ipv4 = clone(view.find("table").dataSource); assert.equal(ipv4.length, 17); const countColumn = view.find("table").columns.find((column: any) => column.key === "addressCount");
    for (const [cidr, expected] of [["10.0.0.0/8", "16,777,216"], ["172.16.0.0/12", "1,048,576"], ["192.168.0.0/16", "65,536"], ["255.255.255.255/32", "1"], ["240.0.0.0/4", "268,435,456"]]) assert.equal(textOf(countColumn.render(undefined, ipv4.find((record: any) => record.cidr === cidr))), expected);
    assert.equal(ipv4.find((record: any) => record.cidr === "240.0.0.0/4").range, "240.0.0.0 - 255.255.255.255");
    for (const locale of LANGUAGES) { view = ip.render(locale.id); assert.deepEqual(clone(view.find("table").dataSource), ipv4); } ip.stable();
    view = ip.render(language.id); const docButton = view.find("button", props => props["aria-label"] === tr(language.id, "Copy {value}", { value: "192.0.2.0/24" })); docButton.onClick(); assert.equal(ip.copies.at(-1)?.value, "192.0.2.0/24");
    view.find("input").onChange({ target: { value: "RFC 1918" } }); view = ip.render(); assert.deepEqual(clone(view.find("table").dataSource).map((record: any) => record.cidr), ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]); ip.stable();
    view = ip.render(language.id); view.find("input").onChange({ target: { value: "192.0.0.0/24" } }); view = ip.render(); const special = view.find("table").dataSource[0]; assert.ok(textOf(view.find("table").expandable.expandedRowRender(special)).includes(tr(language.id, special.details))); assert.ok(special.details.includes("discovery addresses, not translation prefixes")); ip.stable();
    view = ip.render(language.id); view.find("input").onChange({ target: { value: "" } }); view.find("select").onChange("Private"); view = ip.render(); assert.equal(view.find("table").dataSource.length, 3); view.find("tabs").onChange("ipv6"); view = ip.render(); assert.equal(ip.state().categoryFilter, "all"); const ipv6 = clone(view.find("table").dataSource); assert.equal(ipv6.length, 15); assert.ok(ipv6.some((record: any) => record.cidr === "3fff::/20" && record.rfc === "RFC 9637")); assert.ok(ipv6.some((record: any) => record.cidr === "100:0:0:1::/64" && record.rfc === "RFC 9780"));
    const v6Count = view.find("table").columns.find((column: any) => column.key === "addressCount"); assert.equal(textOf(v6Count.render(undefined, ipv6.find((record: any) => record.cidr === "::1/128"))), "1"); assert.equal(textOf(v6Count.render(undefined, ipv6.find((record: any) => record.cidr === "3fff::/20"))), "2^108");
    const links = view.elements.filter(node => node.type === "a").map(node => node.props.href); assert.ok(links.includes("https://ip-ranges.amazonaws.com/ip-ranges.json")); assert.ok(links.includes("https://api.github.com/meta"));
    for (const locale of LANGUAGES) { view = ip.render(locale.id); assert.deepEqual(clone(view.find("table").dataSource), ipv6); assert.deepEqual(view.elements.filter(node => node.type === "a").map(node => node.props.href), links); }
    view = ip.render(language.id); view.find("input").onChange({ target: { value: "RFC 9637" } }); view = ip.render(); assert.deepEqual(clone(view.find("table").dataSource).map((record: any) => record.cidr), ["3fff::/20"]); view.find("button", props => props["aria-label"] === tr(language.id, "Copy {value}", { value: "3fff::/20" })).onClick(); assert.equal(ip.copies.at(-1)?.value, "3fff::/20"); ip.stable();
    view = ip.render(language.id); view.find("input").onChange({ target: { value: "" } }); view.find("select").onChange("Documentation"); view = ip.render(); assert.deepEqual(clone(view.find("table").dataSource).map((record: any) => record.cidr), ["2001:db8::/32", "3fff::/20"]); ip.stable(); ip.cleanup();
}
console.log(`Network references: two actual pages, ${Object.keys(rows).length} complete translation rows; strict multi-service lookup, localized search/filter, copy bytes, raw data, address counts and primary-source corrections passed in eight languages.`);
