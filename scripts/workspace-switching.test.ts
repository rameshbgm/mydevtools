import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { webcrypto } from "node:crypto";
import ts from "typescript";
import * as routes from "../src/lib/category-routes";
import type * as Projects from "../src/lib/project-storage";

const nativeRequire = createRequire(import.meta.url);
class MemoryStorage implements Storage {
    private values = new Map<string, string>();
    denied = new Set<string>();
    get length() { return this.values.size; }
    key(index: number) { return [...this.values.keys()][index] ?? null; }
    getItem(key: string) { return this.values.get(key) ?? null; }
    setItem(key: string, value: string) { if (this.denied.has(key)) throw new Error("Fixture quota denied"); this.values.set(key, value); }
    removeItem(key: string) { this.values.delete(key); }
    clear() { this.values.clear(); }
}
const local = new MemoryStorage();
const session = new MemoryStorage();
const compile = (path: string) => ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
const projectSource = compile("src/lib/project-storage.ts"), bridgeSource = compile("src/lib/tool-bridge.ts");
function documentAt(path: string, embedded = false) {
    const navigations: { kind: string; path: string }[] = [], events: string[] = [];
    const location = (pathname: string) => ({ origin: "http://fixture.local", pathname, search: "", hash: "", reload: () => navigations.push({ kind: "reload", path: pathname }), assign: (next: string) => navigations.push({ kind: "assign", path: next }) });
    const parent = { location: location("/text-and-utilities/tool-workbench"), dispatchEvent: (event: Event) => events.push(`parent:${event.type}`) };
    const window = { localStorage: local, sessionStorage: session, location: location(path), parent: undefined as unknown, dispatchEvent: (event: Event) => events.push(event.type) };
    window.parent = embedded ? parent : window;
    const globals = { window, sessionStorage: session, Event, crypto: webcrypto, console };
    const bridge = { exports: {} };
    runInNewContext(bridgeSource, { ...globals, module: bridge, exports: bridge.exports });
    const module = { exports: {} };
    const dependencies = (name: string) => name === "./category-routes" ? routes : name === "./tool-bridge" ? bridge.exports : name === "./project-purge" ? nativeRequire("../src/lib/project-purge.ts") : nativeRequire(name);
    runInNewContext(projectSource, { ...globals, module, exports: module.exports, require: dependencies });
    return { api: module.exports as typeof Projects, window, navigations, events };
}

const personal = documentAt("/formatters/json-formatter");
const { ACTIVE_PROJECT_KEY, PROJECT_LOCATION_KEY, projectKey } = personal.api;
const alpha = personal.api.createProject("Alpha", local), beta = personal.api.createProject("Beta", local);
personal.api.projectStorage.setItem("wb-sticky-notes-v1", "Personal notes");
personal.api.projectStorage.setItem("mydevtools-tool-tabs-v1", JSON.stringify([{ id: "personal-tab", tool: "json-formatter" }]));
session.setItem("mydevtools.bridge.payload", "public fixture handoff");
personal.api.switchProject(alpha.id);
assert.equal(local.getItem(ACTIVE_PROJECT_KEY), alpha.id);
assert.equal(local.getItem(PROJECT_LOCATION_KEY), "/formatters/json-formatter");
assert.equal(personal.navigations[0].path, "/text-and-utilities/tool-workbench", "A new workspace opens its own empty tool workspace");
assert.equal(session.getItem("mydevtools.bridge.payload"), null, "A pending handoff must not enter the destination workspace");
assert.deepEqual(personal.events, ["mydevtools-project-lock"]);
personal.api.projectStorage.setItem("late-before-navigation", "Personal pending write");
assert.equal(local.getItem("late-before-navigation"), "Personal pending write", "The old document retains its original namespace until full navigation");
assert.equal(local.getItem(projectKey("late-before-navigation", alpha.id)), null);

const alphaPage = documentAt("/text-and-utilities/sticky-notes");
assert.equal(alphaPage.api.activeSessionProjectId(), alpha.id);
assert.equal(alphaPage.api.projectStorage.getItem("wb-sticky-notes-v1"), null);
assert.equal(alphaPage.api.projectStorage.getItem("mydevtools-tool-tabs-v1"), null);
alphaPage.api.projectStorage.setItem("wb-sticky-notes-v1", "Alpha notes");
alphaPage.api.projectStorage.setItem("mydevtools-tool-tabs-v1", JSON.stringify([{ id: "a", tool: "json-formatter" }, { id: "b", tool: "base64" }]));
alphaPage.api.projectStorage.setItem("mydevtools-tool-tabs-active-v1", "b");
alphaPage.api.switchProject(beta.id);
assert.equal(alphaPage.navigations[0].path, "/text-and-utilities/tool-workbench");
const betaPage = documentAt("/encoding-and-decoding/base64");
assert.equal(betaPage.api.projectStorage.getItem("wb-sticky-notes-v1"), null);
betaPage.api.projectStorage.setItem("wb-sticky-notes-v1", "Beta notes");
betaPage.api.switchProject(alpha.id);
assert.equal(betaPage.navigations[0].path, "/text-and-utilities/sticky-notes", "Returning to Alpha restores Alpha's screen, not Beta's screen");
const returnedAlpha = documentAt("/text-and-utilities/sticky-notes");
assert.equal(returnedAlpha.api.projectStorage.getItem("wb-sticky-notes-v1"), "Alpha notes");
assert.equal(returnedAlpha.api.projectStorage.getItem("mydevtools-tool-tabs-active-v1"), "b");
returnedAlpha.api.switchProject("personal");
assert.equal(returnedAlpha.navigations[0].path, "/formatters/json-formatter");
assert.equal(documentAt("/").api.projectStorage.getItem("wb-sticky-notes-v1"), "Personal notes");
assert.equal(local.getItem(projectKey("wb-sticky-notes-v1", beta.id)), "Beta notes");

for (const input of ["", "https://evil.example/", "//evil.example/", "/api/proxy", "/_next/static/file", "/not-a-tool/unknown", "javascript:alert(1)"]) {
    local.setItem(projectKey(PROJECT_LOCATION_KEY, beta.id), input);
    assert.equal(personal.api.projectDestination(beta.id, local), "/text-and-utilities/tool-workbench", input);
}
for (const [input, expected] of [["/tools/json-formatter?input=private#fragment", "/formatters/json-formatter"], ["/encoding-and-decoding/base64?data=private", "/encoding-and-decoding/base64"], ["/?q=private", "/"], ["/guides#example", "/guides"]]) {
    personal.api.rememberProjectPath(input, local, beta.id);
    assert.equal(local.getItem(projectKey(PROJECT_LOCATION_KEY, beta.id)), expected, "Only canonical paths persist; user-input parameters never persist");
}
local.setItem(ACTIVE_PROJECT_KEY, alpha.id);
const stale = documentAt("/formatters/json-formatter");
stale.api.activeSessionProjectId();
local.setItem(ACTIVE_PROJECT_KEY, beta.id);
stale.api.reloadActiveProject();
assert.equal(stale.navigations[0].path, "/guides", "A storage-event reload follows the newly active workspace's path");
local.setItem(ACTIVE_PROJECT_KEY, alpha.id);
const frame = documentAt("/encoding-and-decoding/base64", true);
frame.api.switchProject(beta.id);
assert.equal(local.getItem(projectKey(PROJECT_LOCATION_KEY, alpha.id)), "/text-and-utilities/tool-workbench", "Embedded panes remember the containing workspace, not an iframe route");
assert.equal(frame.navigations[0].path, "/guides");
assert.deepEqual(frame.events, ["mydevtools-project-lock", "parent:mydevtools-project-lock"]);
local.setItem(ACTIVE_PROJECT_KEY, alpha.id);
const denied = documentAt("/formatters/json-formatter");
local.denied.add(ACTIVE_PROJECT_KEY);
assert.throws(() => denied.api.switchProject(beta.id), /quota denied/);
assert.equal(denied.navigations.length, 0);
assert.equal(denied.events.length, 0);
assert.equal(local.getItem(ACTIVE_PROJECT_KEY), alpha.id);
local.denied.clear();

// Run the actual Tool Tabs component callbacks against each document's real
// scoped storage. This covers legacy saved arrays and active-tab restoration.
type Element = { type: unknown; props: Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any
function elements(value: unknown): Element[] {
    if (Array.isArray(value)) return value.flatMap(elements);
    if (!value || typeof value !== "object" || !("props" in value)) return [];
    const item = value as Element;
    return [item, ...elements(item.props.children)];
}
function workbench(api: typeof Projects) {
    const hooks: unknown[] = [], effects: (() => void)[] = [];
    let cursor = 0, mounted = false;
    const module = { exports: {} as { default: () => Element } };
    const react = nativeRequire("react");
    const dependencies = (name: string) => {
        if (name === "react") return { ...react, useState: (initial: unknown) => { const index = cursor++; if (!(index in hooks)) hooks[index] = initial; return [hooks[index], (value: unknown) => { hooks[index] = typeof value === "function" ? value(hooks[index]) : value; }]; }, useEffect: (effect: () => void) => { if (!mounted) effects.push(effect); } };
        if (name.endsWith("project-storage")) return api;
        if (name.endsWith("category-routes")) return routes;
        if (name.endsWith("tools-registry")) return { toolsRegistry: [{ id: "json-formatter", name: "JSON Formatter", category: "Formatters", description: "JSON", tags: [] }, { id: "base64", name: "Base64", category: "Encoding & Decoding", description: "Base64", tags: [] }] };
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ direction: "ltr", t: (source: string, values?: Record<string, string>) => source.replace(/\{(\w+)\}/g, (match, key) => values?.[key] ?? match) }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: () => null };
        if (name === "@ant-design/icons") return { AppstoreOutlined: () => null, ArrowLeftOutlined: () => null, ArrowRightOutlined: () => null };
        return nativeRequire(name);
    };
    const window: { parent?: unknown } = {}; window.parent = window;
    runInNewContext(compile("src/app/tools/tool-workbench/page.tsx"), { module, exports: module.exports, require: dependencies, window, crypto: webcrypto, document: { getElementById: () => ({ focus() {} }) } });
    const render = () => { cursor = 0; let tree = module.exports.default(); if (!mounted) { mounted = true; effects.splice(0).forEach((effect) => effect()); cursor = 0; tree = module.exports.default(); } return elements(tree); };
    return { render };
}
local.setItem(ACTIVE_PROJECT_KEY, alpha.id);
const alphaTabs = workbench(documentAt("/text-and-utilities/tool-workbench").api);
let tree = alphaTabs.render();
assert.equal(tree.find((node) => node.props.role === "tab" && node.props["aria-selected"])?.props.id, "tab-b");
tree.find((node) => node.props.id === "tab-a")!.props.onClick();
assert.equal(local.getItem(projectKey("mydevtools-tool-tabs-active-v1", alpha.id)), "a");
tree = alphaTabs.render();
tree.find((node) => node.props.id === "tab-a")!.props.onKeyDown({ key: "End", preventDefault() {} });
assert.equal(local.getItem(projectKey("mydevtools-tool-tabs-active-v1", alpha.id)), "b");
local.setItem(ACTIVE_PROJECT_KEY, beta.id);
assert.equal(workbench(documentAt("/text-and-utilities/tool-workbench").api).render().filter((node) => node.props.role === "tab").length, 0);
local.setItem(ACTIVE_PROJECT_KEY, alpha.id);
tree = alphaTabs.render();
tree.find((node) => node.props["aria-label"] === "Close Base64 tab")!.props.onClick();
assert.equal(local.getItem(projectKey("mydevtools-tool-tabs-active-v1", alpha.id)), "a");
tree = alphaTabs.render();
tree.find((node) => node.props["aria-label"] === "Close JSON Formatter tab")!.props.onClick();
assert.equal(local.getItem(projectKey("mydevtools-tool-tabs-active-v1", alpha.id)), null);
assert.equal(local.getItem("mydevtools-tool-tabs-v1"), JSON.stringify([{ id: "personal-tab", tool: "json-formatter" }]), "Personal tabs survive workspace tab mutations");

// Execute the real first-paint script, including unavailable browser storage:
// Signal opens on the full introduction; explicit compact/full preferences still win.
const layoutSource = readFileSync("src/app/layout.tsx", "utf8");
assert.match(layoutSource, /data-workspace-mode="full"/);
const layout = ts.createSourceFile("layout.tsx", layoutSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let bootstrap = "";
function findBootstrap(node: ts.Node) {
    if (ts.isStringLiteral(node) && node.text.includes("dataset.workspaceMode=")) bootstrap = node.text;
    ts.forEachChild(node, findBootstrap);
}
findBootstrap(layout);
assert.ok(bootstrap);
for (const choice of [null, "focused", "full", "invalid", "storage-denied"]) {
    let dark = false;
    const root = { dataset: { workspaceMode: "full" }, classList: { toggle: (_name: string, enabled: boolean) => { dark = enabled; } }, style: { colorScheme: "light" } };
    runInNewContext(bootstrap, { document: { documentElement: root }, localStorage: { getItem: (key: string) => {
        if (choice === "storage-denied") throw new Error("Fixture storage denied");
        return key === "mydevtools-workspace-mode" ? choice : '{"state":{"darkMode":true}}';
    } } });
    assert.equal(root.dataset.workspaceMode, choice === "focused" ? "focused" : "full", String(choice));
    if (choice !== "storage-denied") { assert.equal(dark, true); assert.equal(root.style.colorScheme, "dark", "The Signal default preserves the saved theme"); }
}

console.log("Workspace switching: per-workspace screen/tab restoration, saved-data isolation, safe navigation, handoff cleanup, write failures and full introduction defaults with saved-view/theme preservation passed.");
