import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Exercise the actual page helpers without importing the Next.js client UI.
// Optional root supports proving the regression against an isolated staged copy.
const root = resolve(process.argv[2] ?? ".");
function loadHelpers(id: string, names: string[]) {
    const path = resolve(root, `src/app/tools/${id}/page.tsx`);
    const source = readFileSync(path, "utf8");
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const selected = file.statements.filter((node) => {
        if (ts.isFunctionDeclaration(node)) return !!node.name && names.includes(node.name.text);
        if (ts.isVariableStatement(node)) return node.declarationList.declarations.some((declaration) => ["NAMED_ENTITIES", "REVERSE_ENTITIES", "NUMERIC_CONTROL_REPLACEMENTS"].includes(declaration.name.getText(file)));
        return false;
    });
    const sourceCode = selected.map((node) => node.getText(file)).join("\n") + `\nmodule.exports = { ${names.join(", ")} };`;
    const compiled = { exports: {} as Record<string, (...args: string[]) => string> };
    const code = ts.transpileModule(sourceCode, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
    runInNewContext(code, { module: compiled, exports: compiled.exports, Error, RangeError, String, TextEncoder, TextDecoder, Uint8Array });
    for (const name of names) assert.equal(typeof compiled.exports[name], "function", `${id}/${name}`);
    return compiled.exports;
}
const html = loadHelpers("html-entities", ["encodeHtmlEntities", "decodeHtmlEntities"]);
const unicode = loadHelpers("unicode-converter", ["textToUnicodeEscape", "unicodeEscapeToText", "textToCodePoints", "codePointsToText", "textToUtf8Hex", "utf8HexToText", "textToUtf16", "utf16ToText"]);
const require = createRequire(resolve("package.json"));
const { createDocument } = require("@mixmark-io/domino") as { createDocument: (html: string) => { querySelector: (selector: string) => { textContent: string } } };
const htmlOracle = (reference: string) => createDocument(`<p>${reference}</p>`).querySelector("p").textContent;

// Explicit public fixtures: globe U+1F30D, musical G clef U+1D11E,
// CJK Extension B U+20000, plus the valid upper Unicode boundary.
const fixtures = [
    { text: "🌍", decimal: "&#127757;", hex: "&#x1F30D;", utf16: "D83C DF0D", escape: "\\u{1F30D}", points: "U+1F30D", utf8: "F0 9F 8C 8D" },
    { text: "𝄞", decimal: "&#119070;", hex: "&#x1D11E;", utf16: "D834 DD1E", escape: "\\u{1D11E}", points: "U+1D11E", utf8: "F0 9D 84 9E" },
    { text: "𠀀", decimal: "&#131072;", hex: "&#x20000;", utf16: "D840 DC00", escape: "\\u{20000}", points: "U+20000", utf8: "F0 A0 80 80" },
    { text: "\u{10FFFF}", decimal: "&#1114111;", hex: "&#x10FFFF;", utf16: "DBFF DFFF", escape: "\\u{10FFFF}", points: "U+10FFFF", utf8: "F4 8F BF BF" },
];
for (const fixture of fixtures) {
    assert.equal(html.encodeHtmlEntities(fixture.text, "numeric"), fixture.decimal, `${fixture.points}: numeric HTML must encode the entire code point`);
    assert.equal(html.encodeHtmlEntities(fixture.text, "all"), fixture.decimal);
    assert.equal(html.encodeHtmlEntities(fixture.text, "named"), fixture.text);
    for (const reference of [fixture.decimal, fixture.hex, fixture.hex.replace("#x", "#X"), fixture.hex.toLowerCase()]) {
        assert.equal(html.decodeHtmlEntities(reference), fixture.text, reference);
        assert.equal(html.decodeHtmlEntities(reference), htmlOracle(reference), `${reference}: independent HTML parser oracle`);
    }
    assert.equal(unicode.textToUtf16(fixture.text), fixture.utf16, `${fixture.points}: both UTF-16 units are required`);
    assert.equal(unicode.utf16ToText(fixture.utf16), fixture.text);
    assert.equal(unicode.textToUnicodeEscape(fixture.text), fixture.escape);
    assert.equal(unicode.unicodeEscapeToText(fixture.escape), fixture.text);
    assert.equal(unicode.unicodeEscapeToText(fixture.utf16.split(" ").map((unit) => `\\u${unit}`).join("")), fixture.text, "Fixed-width surrogate escapes round-trip");
    assert.equal(unicode.textToCodePoints(fixture.text), fixture.points);
    assert.equal(unicode.codePointsToText(fixture.points), fixture.text);
    assert.equal(unicode.textToUtf8Hex(fixture.text), fixture.utf8);
    assert.equal(unicode.utf8HexToText(fixture.utf8), fixture.text);
}
const mixed = "A café 你好 🌍𝄞𠀀 👩‍💻 e\u0301";
for (const mode of ["numeric", "all", "named"]) assert.equal(html.decodeHtmlEntities(html.encodeHtmlEntities(mixed, mode)), mixed, mode);
// Compare rendered entity meaning with an independent parser, since a paired
// encoder/decoder can agree on the same incorrect character mapping.
for (const text of [mixed, "ordinary space", "non-breaking\u00A0space", "both \u00A0 spaces"]) {
    for (const mode of ["numeric", "all", "named"]) {
        const encoded = html.encodeHtmlEntities(text, mode);
        assert.equal(htmlOracle(encoded), text, "HTML encoding must preserve ordinary and non-breaking spaces");
        assert.equal(html.decodeHtmlEntities(encoded), text);
    }
}
assert.equal(html.decodeHtmlEntities("&nbsp;"), "\u00A0");
assert.equal(html.decodeHtmlEntities("&nbsp;"), htmlOracle("&nbsp;"));
for (const [encode, decode] of [["textToUtf16", "utf16ToText"], ["textToUnicodeEscape", "unicodeEscapeToText"], ["textToCodePoints", "codePointsToText"], ["textToUtf8Hex", "utf8HexToText"]]) assert.equal(unicode[decode](unicode[encode](mixed)), mixed, encode);
for (const raw of ["", "\u0000", "\uD800", "\uDC00", "\uD800A\uDC00", "\\u{1F30D}", "\\u0041"]) {
    assert.equal(unicode.utf16ToText(unicode.textToUtf16(raw)), raw, "UTF-16 preserves original code units, including unpaired surrogates");
    assert.equal(unicode.unicodeEscapeToText(unicode.textToUnicodeEscape(raw)), raw, "Escape round-trip preserves literal input");
}
// HTML numeric references use U+FFFD for null, surrogates and values above
// U+10FFFF, rather than wrapping to a 16-bit unit or throwing during rendering.
// https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state
for (const reference of ["&#0;", "&#x0;", "&#55296;", "&#56319;", "&#56320;", "&#57343;", "&#xD800;", "&#xDFFF;", "&#1114112;", "&#x110000;", "&#99999999999999999999999999999999;"]) {
    assert.equal(html.decodeHtmlEntities(reference), "\uFFFD", reference);
    assert.equal(html.decodeHtmlEntities(reference), htmlOracle(reference), `${reference}: independent invalid-reference oracle`);
}
for (const [reference, expected] of [["&#55295;", "\uD7FF"], ["&#57344;", "\uE000"], ["&#65535;", "\uFFFF"], ["&#x10000;", "\u{10000}"]]) assert.equal(html.decodeHtmlEntities(reference), expected, reference);
// Check every C1 control against an independent parser, including unmapped
// values; these are HTML legacy replacements, not Unicode truncation.
const c1Expected = [
    0x20ac, 0x81, 0x201a, 0x192, 0x201e, 0x2026, 0x2020, 0x2021,
    0x2c6, 0x2030, 0x160, 0x2039, 0x152, 0x8d, 0x17d, 0x8f,
    0x90, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014,
    0x2dc, 0x2122, 0x161, 0x203a, 0x153, 0x9d, 0x17e, 0x178,
];
for (const [index, expected] of c1Expected.entries()) {
    for (const reference of [`&#${0x80 + index};`, `&#x${(0x80 + index).toString(16)};`]) {
        assert.equal(html.decodeHtmlEntities(reference), String.fromCodePoint(expected), reference);
        assert.equal(html.decodeHtmlEntities(reference), htmlOracle(reference), `${reference}: legacy control oracle`);
    }
}
for (const reference of ["&#9;", "&#10;", "&#13;", "&#31;", "&#127;", "&#xFDD0;", "&#xFFFE;"]) assert.equal(html.decodeHtmlEntities(reference), htmlOracle(reference), `${reference}: whitespace/control/noncharacter preserved`);
for (const literal of ["&#;", "&#x;", "&#-1;", "&#xGG;", "&#12x;", "&#127757", "&unknown;"]) assert.equal(html.decodeHtmlEntities(literal), literal, "Unrecognized or incomplete tool syntax remains literal");
for (const [encoded, expected] of [["&amp;lt;", "&lt;"], ["&amp;#127757;", "&#127757;"], ["&#38;#127757;", "&#127757;"], ["&#x26;#x1F30D;", "&#x1F30D;"]]) assert.equal(html.decodeHtmlEntities(encoded), expected, "Decode exactly one entity layer");
const markup = '<script title="🌍 & café">';
for (const mode of ["all", "named", "numeric"]) {
    const encoded = html.encodeHtmlEntities(markup, mode);
    assert.ok(!/[<>\"]/.test(encoded), "Reserved markup characters remain escaped");
    assert.equal(html.decodeHtmlEntities(encoded), markup);
}
assert.equal(unicode.unicodeEscapeToText("\\u{5C}u0041"), "\\u0041", "Newly decoded text must not be decoded again");
for (const invalid of ["\\u{110000}", "\\u{FFFFFFFFFFFFFFFFFFFFFFFF}"]) assert.throws(() => unicode.unicodeEscapeToText(invalid), RangeError, invalid);
console.log("Unicode conversion: supplementary-plane HTML decimal/hex, UTF-16 code units, Unicode escapes/UTF-8/code points, mixed scripts, literal/surrogate preservation, invalid ranges/C1 remapping and independent HTML parser oracles pass.");
