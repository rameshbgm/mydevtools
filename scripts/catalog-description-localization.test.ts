import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { toolsRegistry, getToolsByCategory, CATEGORY_DESCRIPTIONS, CATEGORY_COLORS, CATEGORY_ICONS } from "../src/lib/tools-registry";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { CATALOG_DESCRIPTION_TRANSLATIONS as rows } from "../src/lib/i18n/catalog-descriptions";
import * as paths from "../src/lib/category-routes";
import * as boundaries from "../src/lib/data-boundaries";
import * as releases from "../src/lib/release-notes";
import * as search from "../src/lib/tool-search";
import { SITE_URL } from "../src/lib/seo-content";

const require = createRequire(import.meta.url), React = require("react"), jsx = require("react/jsx-runtime");
const descriptions = [...toolsRegistry.map(tool => tool.description), ...Object.values(CATEGORY_DESCRIPTIONS)];
assert.equal(toolsRegistry.length,147); assert.equal(Object.keys(CATEGORY_DESCRIPTIONS).length,15);
assert.equal(Object.keys(rows).length,162);
const tokens = (source: string) => [...new Set(source.match(/RFC \d+|SHA-\d+|RIPEMD-160|MD5|UTF-8|AES-CBC|PKCS#12\/PFX|JSON-RPC 2\.0|UUIDv3\/v5|UUIDv4|UUIDv7|ws:\/\/|wss:\/\/|agent-card\.json|camelCase|snake_case|PascalCase|kebab-case|d4–d20/g) ?? [])];
const tr = (language: Language, source: string, values?: Record<string,string|number>) => {
    let copy = language === "en" ? source : rows[source]?.[LANGUAGES.findIndex(l=>l.id===language)-1] ?? translate(language,source);
    for(const[key,value]of Object.entries(values??{}))copy=copy.replaceAll(`{${key}}`,String(value));
    return copy;
};
for(const source of descriptions){
    const columns=rows[source]; assert.ok(columns,`Missing ${source}`); assert.equal(columns.length,7);
    if(SHARED_TRANSLATIONS[source])assert.deepEqual(columns,SHARED_TRANSLATIONS[source],`Existing vocabulary: ${source}`);
    columns.forEach((copy,index)=>{ assert.ok(copy.trim()); assert.notEqual(copy,source,source); for(const token of tokens(source)) assert.ok(copy.includes(token),`Literal ${token}: ${LANGUAGES[index+1].id}/${source}`); if(!process.env.CATALOG_DESCRIPTION_STAGE)assert.equal(translate(LANGUAGES[index+1].id,source),copy,source); });
}
type Element = {type: unknown; props: Record<string, any>};
function harness(path: string) {
    const source=readFileSync(path,"utf8");
    let language:Language="en",slot=0;
    const cells:any[]=[],actions:string[]=[];
    const store={darkMode:false,bookmarks:[],addRecentTool:(id:string)=>actions.push(id)};
    const ui=(name:string)=>(props:any)=>React.createElement(name,props,props.children);
    const dependencies=(name:string):any=>{
        if(name==="react")return {...React,useState:(initial:any)=>{const key=slot++;if(!(key in cells))cells[key]=typeof initial==="function"?initial():initial;return[cells[key],(v:any)=>{cells[key]=typeof v==="function"?v(cells[key]):v;}];},useEffect:()=>{},useMemo:(fn:()=>any)=>fn()};
        if(name==="react/jsx-runtime")return jsx;
        if(name==="next/link")return{__esModule:true,default:ui("link")};
        if(name==="@ant-design/icons")return new Proxy({},{get:()=>ui("icon")});
        if(name.endsWith("LanguageProvider"))return{useLanguage:()=>({language,direction:language==="ar"?"rtl":"ltr",t:(key:string,values?:Record<string,string|number>)=>tr(language,key,values)})};
        if(name.endsWith("tools-registry"))return{toolsRegistry,getToolsByCategory,CATEGORY_DESCRIPTIONS,CATEGORY_ICONS};
        if(name.endsWith("category-routes"))return paths;
        if(name.endsWith("data-boundaries"))return boundaries;
        if(name.endsWith("tool-search"))return search;
        if(name.endsWith("store"))return{useAppStore:(selector:any)=>selector(store)};
        if(name.endsWith("seo-content"))return{SITE_URL};
        if(name.endsWith("SignalCatalog"))return{__esModule:true,default:ui("signal-catalog")};
        if(name.endsWith("WorkspaceModeToggle"))return{__esModule:true,default:ui("workspace-mode")};
        if(name.endsWith("LandingMarketing"))return{__esModule:true,default:ui("marketing")};
        throw Error(`Unexpected dependency ${name}`);
    };
    const module={exports:{} as {default:()=>Element}};
    runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{module,exports:module.exports,require:dependencies,URLSearchParams,Set});
    const render=(locale:Language=language)=>{language=locale;slot=0;const nodes:Element[]=[];const walk=(n:any)=>{if(!n||typeof n!=="object")return;if(Array.isArray(n))return n.forEach(walk);if(n.props){nodes.push(n);walk(n.props.children);}};walk(module.exports.default());return nodes;};
    return {render,actions};
}
const rawRegistry=JSON.stringify(toolsRegistry),rawCategories=JSON.stringify(CATEGORY_DESCRIPTIONS);
const page=harness("src/components/SignalCatalog.tsx");
for(const {id:language} of LANGUAGES){
    for(const category of getToolsByCategory().keys()){
        let nodes=page.render(language);
        nodes.find(n=>n.props.id==="signal-category-select")!.props.onChange({target:{value:category}});
        nodes=page.render(language);
        const expected=toolsRegistry.filter(tool=>tool.category===category);
        const links=nodes.filter(n=>String(n.props.className??"").includes("signal-tool-row")&&n.props.href);
        assert.equal(links.length,expected.length,`${language}/${category}`);
        for(const tool of expected){assert.ok(nodes.some(n=>n.props.children===tr(language,tool.description)),`${language}/${tool.id}: summary`);assert.ok(links.some(n=>n.props.href===paths.toolPath(tool)),`${tool.id}: canonical destination`);}
        assert.ok(nodes.some(n=>n.props.children===tr(language,CATEGORY_DESCRIPTIONS[category])));
    }
    assert.equal(JSON.stringify(toolsRegistry),rawRegistry);assert.equal(JSON.stringify(CATEGORY_DESCRIPTIONS),rawCategories);assert.equal(page.actions.length,0,"Locale/category selection does not open tools");
}
let nodes=page.render("ar");nodes.find(n=>n.props.id==="signal-category-select")!.props.onChange({target:{value:"all"}});nodes=page.render();nodes.find(n=>n.props.id==="catalog-search")!.props.onChange({target:{value:"JSON"}});nodes=page.render();const jsonLink=nodes.find(n=>n.props.href===paths.toolPathFromId("json-formatter"));assert.ok(jsonLink);jsonLink.props.onClick();assert.equal(page.actions.at(-1),"json-formatter");
const home=harness("src/app/page.tsx");let schema:string|undefined;
for(const {id:language} of LANGUAGES){const nodes=home.render(language),data=nodes.find(n=>n.props.type==="application/ld+json");assert.ok(data);const current=data.props.dangerouslySetInnerHTML.__html;if(schema)assert.equal(current,schema);else schema=current;assert.equal(JSON.parse(current).mainEntity.itemListElement.length,147);}
console.log("Signal catalog: all147 tools and15 categories retain all8 translations; category filters expose every canonical tool link, localized search/click callbacks work, and homepage schema/registry stay unchanged.");
