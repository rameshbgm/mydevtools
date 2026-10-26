/* eslint-disable @typescript-eslint/no-explicit-any -- Render actual release callbacks with deterministic React/UI boundaries. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { RELEASE_NOTES, KIND_LABEL, APP_VERSION } from "../src/lib/release-notes";
import { RELEASE_HISTORY_TRANSLATIONS as rows } from "../src/lib/i18n/release-history";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";

const originalReleases = JSON.stringify(RELEASE_NOTES);
const prose = [...new Set(RELEASE_NOTES.flatMap(release => [release.title, ...(release.summary ? [release.summary] : []), ...release.sections.flatMap(section => [section.label, ...section.bullets])]))];
const placeholders = (value: string) => (value.match(/\{[a-zA-Z][a-zA-Z0-9]*\}/g) ?? []).sort();
const code = (value: string) => value.match(/`[^`]*`/g) ?? [];
const tr = (language: Language, source: string, values: Record<string, string | number> = {}) => {
    let value = language === "en" ? source : rows[source]?.[LANGUAGES.findIndex(item => item.id === language) - 1] ?? translate(language, source);
    for (const [key, item] of Object.entries(values)) value = value.replaceAll(`{${key}}`, String(item));
    return value;
};
assert.equal(RELEASE_NOTES.length, 10);
assert.equal(prose.length, 339);
for (const source of prose) assert.ok(rows[source], `Release prose absent: ${source}`);
for (const source of Object.values(KIND_LABEL)) assert.ok(rows[source] || SHARED_TRANSLATIONS[source], source);
for (const [source, columns] of Object.entries(rows)) {
    assert.equal(columns.length, 7, source);
    columns.forEach((value, index) => {
        assert.ok(value.trim(), source);
        assert.deepEqual(placeholders(value), placeholders(source), `Interpolation changed: ${source}`);
        // Literal paths, shell commands, expressions and code examples remain exact.
        assert.deepEqual(code(value).sort(), code(source).sort(), `Literal code changed: ${source}`);
        for (const url of source.match(/https?:\/\/[^\s)]+/g) ?? []) assert.ok(value.includes(url), `URL changed: ${source}`);
        for (const numeral of new Set(source.match(/\d+(?:\.\d+)*/g) ?? [])) assert.ok(value.includes(numeral), `Version, count or date changed: ${numeral} in ${source}`);
        if (SHARED_TRANSLATIONS[source]) assert.deepEqual(columns, SHARED_TRANSLATIONS[source], `Shared collision: ${source}`);
        if (!process.env.RELEASE_HISTORY_STAGE_ROOT) assert.equal(translate(LANGUAGES[index + 1].id, source), value, `Catalog wiring: ${source}`);
    });
}
const source = readFileSync(resolve(process.env.RELEASE_HISTORY_STAGE_ROOT ?? ".", "src/app/release-notes/page.tsx"), "utf8");
for (const expression of ["release.title", "release.summary", "section.label", "bullet", "KIND_LABEL[release.kind]"]) assert.ok(source.includes(`t(${expression})`), `${expression} not translated at render`);
assert.doesNotMatch(source,/key=\{(?:language|direction|t\()/);
assert.doesNotMatch(source,/(?:marginLeft|paddingLeft|borderLeft):/);
const nativeRequire=createRequire(resolve("package.json")),React=nativeRequire("react"),runtime=nativeRequire("react/jsx-runtime");
let language:Language="en",mounted=false;const seen:string[]=[];
const module={exports:{} as{default:()=>any}};
const dependencies=(name:string):any=>{
 if(name==="react")return{...React,useEffect:(fn:()=>void)=>{if(!mounted){mounted=true;fn();}}};
 if(name==="react/jsx-runtime")return runtime;
 if(name==="next/link")return{__esModule:true,default:(p:any)=>React.createElement("a",p,p.children)};
 if(name==="@ant-design/icons")return new Proxy({},{get:()=>()=>null});
 if(name.endsWith("LanguageProvider"))return{useLanguage:()=>({language,t:(key:string,values?:Record<string,string|number>)=>tr(language,key,values)})};
 if(name.endsWith("release-notes"))return{RELEASE_NOTES,KIND_LABEL,APP_VERSION};
 if(name.endsWith("release-preference"))return{markReleaseSeen:(v:string)=>seen.push(v)};
 throw Error(`Unexpected dependency ${name}`);
};
runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{module,exports:module.exports,require:dependencies});
for(const locale of LANGUAGES){language=locale.id;const elements:any[]=[],texts:string[]=[];const walk=(n:any):void=>{if(n==null||typeof n==="boolean")return;if(typeof n==="string"||typeof n==="number"){texts.push(String(n));return;}if(Array.isArray(n)){n.forEach(walk);return;}if(typeof n.type==="function"){walk(n.type(n.props));return;}elements.push(n);walk(n.props?.children);};walk(module.exports.default());
 for(const copy of prose)assert.ok(texts.includes(tr(language,copy)),`${language}: ${copy}`);
 for(const release of RELEASE_NOTES){const article=elements.find(e=>e.props?.id===`release-${release.version}`);assert.ok(article,`Version anchor ${release.version}`);assert.ok(elements.some(e=>e.type==="time"&&e.props.dateTime===release.date),`Date ${release.date}`);}
 const details=elements.filter(e=>e.type==="details");assert.equal(details.length,RELEASE_NOTES.length);assert.equal(details[0].props.open,true);assert.ok(details.slice(1).every(e=>e.props.open===false));
 assert.deepEqual(seen,[APP_VERSION],"Locale changes do not rewrite release acknowledgement");assert.equal(JSON.stringify(RELEASE_NOTES),originalReleases);
}
console.log("Release history: every title, summary, section and bullet renders in8 languages; native details, version anchors, dates and one-time seen preference remain intact.");
