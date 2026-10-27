import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReferenceProvenance from "../src/components/ReferenceProvenance";
import sources from "../src/lib/reference-sources.json";
import { LANGUAGES, translate } from "../src/lib/i18n/catalog";
import { REFERENCE_PROVENANCE_TRANSLATIONS } from "../src/lib/i18n/reference-provenance";

const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(REFERENCE_PROVENANCE_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    for (const column of columns) {
        assert.ok(column.trim(), source);
        assert.notEqual(column, source, `Untranslated reference explanation: ${source}`);
        assert.deepEqual(placeholders(column), placeholders(source), source);
    }
}

// Protocol names and numeric constants in explanations must survive translation.
// Versions and links are separately rendered from the unchanged source records.
const protectedScopeData: Record<string, string[]> = {
    mcp: ["HTTP", "JSON-RPC", "initialize"],
    a2a: ["JSONRPC", "REST", "gRPC"],
    openapi: ["Swagger 2", "OpenAPI", "3.0–3.2", "3.2"],
    schema: ["Ajv"],
    oauth: ["Authorization Code", "PKCE S256"],
    "problem-details": ["RFC 7807", "application/problem+json"],
    "http-status": ["413/418/422", "104", "2026-11-13"],
    uuid: ["v3/v5", "v4", "v7", "UUID"],
    trace: ["v00"],
    "openai-models": ["BPE", "API"],
    "gitignore-patterns": ["Git"],
    ulid: ["26", "Crockford", "Base32"],
    "null-mx": ["MX", "A/AAAA", "NXDOMAIN", "DNS"],
    "php-curl": ["PHP", "8.5", "CurlHandle", "curl_close()", "raw/multipart"],
    "rdap-bootstrap": ["DNS", "IP", "HTTPS"],
    "rdap-json": ["IP"],
    "toon-subset": ["TOON"],
    "ipv6-special": ["IPv6"],
    "tls13-current": ["RFC 9846", "RFC 8446"],
};
for (const source of sources) {
    assert.ok(Object.hasOwn(REFERENCE_PROVENANCE_TRANSLATIONS, source.scope), `Missing scope: ${source.id}`);
    for (const language of LANGUAGES) {
        const scope = translate(language.id, source.scope);
        if (language.id !== "en") assert.notEqual(scope, source.scope, `${source.id}/${language.id}`);
        for (const token of protectedScopeData[source.id] ?? []) assert.ok(scope.includes(token), `${source.id}/${language.id} lost ${token}`);
        for (const data of [source.version, source.url, source.verifiedAt]) assert.equal(translate(language.id, data), data, `${source.id} source data changed`);
        const interval = translate(language.id, "Review interval: {days} days.", { days: source.reviewDays });
        assert.ok(interval.includes(String(source.reviewDays)));
        assert.ok(!interval.includes("{days}"));
    }
}

// Check the real shared component selects only the tool's primary references and
// preserves their exact URLs, version strings and machine-readable ISO dates.
const toolIds = [...new Set(sources.flatMap((source) => source.tools))];
const componentSource = readFileSync("src/components/ReferenceProvenance.tsx", "utf8");
const componentCode = ts.transpileModule(componentSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
const nativeRequire = createRequire(import.meta.url);
// A label such as JSON Schema can also be translated elsewhere in the UI.
// Check the actual provenance output, whose source labels must remain literal.
for (const language of LANGUAGES) {
    const compiled = { exports: {} as { default: typeof ReferenceProvenance } };
    runInNewContext(componentCode, { module: compiled, exports: compiled.exports, require: (name: string) => {
        if (name === "react/jsx-runtime") return nativeRequire(name);
        if (name.endsWith("reference-sources.json")) return sources;
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t: (source: string, values?: Record<string, string | number>) => translate(language.id, source, values) }) };
        throw new Error(`Unexpected provenance dependency: ${name}`);
    } });
    for (const toolId of toolIds) {
        const html = renderToStaticMarkup(createElement(compiled.exports.default, { toolId }));
        assert.ok(html.includes(translate(language.id, "Standards, sources and review dates")));
        for (const source of sources.filter((item) => item.tools.includes(toolId))) {
            const literalLink = renderToStaticMarkup(createElement("a", { href: source.url, target: "_blank", rel: "noopener noreferrer" }, createElement("bdi", { dir: "ltr" }, source.label)));
            assert.ok(html.includes(literalLink), `${language.id}/${toolId}/${source.id}: literal source label`);
            assert.ok(html.includes(renderToStaticMarkup(createElement("bdi", { dir: "ltr" }, source.version))));
            assert.ok(html.includes(`<time dateTime="${source.verifiedAt}">${source.verifiedAt}</time>`));
            const explanation = renderToStaticMarkup(createElement("p", {}, translate(language.id, source.scope), " ", translate(language.id, "Review interval: {days} days.", { days: source.reviewDays })));
            assert.ok(html.includes(explanation));
        }
    }
}
for (const toolId of toolIds) {
    const html = renderToStaticMarkup(createElement(ReferenceProvenance, { toolId }));
    assert.ok(html.includes("Standards, sources and review dates"));
    for (const source of sources) {
        const link = renderToStaticMarkup(createElement("a", { href: source.url, target: "_blank", rel: "noopener noreferrer" }, createElement("bdi", { dir: "ltr" }, source.label)));
        assert.equal(html.includes(link), source.tools.includes(toolId), `${toolId}/${source.id} selection`);
        if (!source.tools.includes(toolId)) continue;
        assert.ok(html.includes(renderToStaticMarkup(createElement("bdi", { dir: "ltr" }, source.version))));
        assert.ok(html.includes(`<bdi dir="ltr"><time dateTime="${source.verifiedAt}">${source.verifiedAt}</time></bdi>`));
        assert.ok(html.includes(renderToStaticMarkup(createElement("p", {}, source.scope, " ", `Review interval: ${source.reviewDays} days.`))));
    }
}
for (const toolId of [undefined, null, "unknown-reference-fixture"]) assert.equal(renderToStaticMarkup(createElement(ReferenceProvenance, { toolId })), "");
const component = readFileSync("src/components/ReferenceProvenance.tsx", "utf8");
assert.ok(component.startsWith('"use client";'));
assert.ok(component.includes("t(source.scope)"), "Authored scopes must use the current language");
assert.ok(component.includes('t("Review interval: {days} days.", { days: source.reviewDays })'));
console.log(`Reference provenance: ${sources.length} scopes in eight languages, exact protocol data and primary links, ISO dates, RTL isolation and tool-specific selection pass.`);
