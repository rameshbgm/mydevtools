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
type Element={type:any;props:Record<string,any>};
function text(node:any):string{return node==null||typeof node==="boolean"?"":Array.isArray(node)?node.map(text).join(""):typeof node==="object"?text(node.props?.children):String(node);}
function harness(id:"homepage"|"release"){
    const path=id==="homepage"?"src/app/page.tsx":"src/app/release-notes/page.tsx",source=readFileSync(path,"utf8"),ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    assert.equal((ast as ts.SourceFile&{parseDiagnostics:ts.Diagnostic[]}).parseDiagnostics.length,0);
    const calls:string[]=[];function inspect(n:ts.Node){if(ts.isCallExpression(n)&&n.expression.getText(ast)==="t")calls.push(n.arguments[0]?.getText(ast));ts.forEachChild(n,inspect);}inspect(ast);
    assert.ok(calls.includes("tool.description"),`${id}: actual tool summary uses translation`);
    assert.ok(calls.includes(id==="homepage"?"CATEGORY_DESCRIPTIONS[category]":"catDesc"),`${id}: actual category summary uses translation`);
    let language:Language="en",slot=0,effectSlot=0,tree:Element;const cells:any[]=[],effects:unknown[][]=[],pending:(()=>void)[]=[],actions:{type:string;value?:any}[]=[];
    const store={darkMode:false,addRecentTool:(value:string)=>actions.push({type:"recent",value}),setNavigating:(...value:any[])=>actions.push({type:"navigation",value})};
    const component=(name:string)=>(props:any)=>React.createElement(name,props,props.children);
    const changed=(before:unknown[]|undefined,next:unknown[])=>!before||before.length!==next.length||next.some((v,i)=>!Object.is(v,before[i]));
    const dependencies=(name:string):any=>{
        if(name==="react")return{...React,useState:(initial:any)=>{const key=slot++;if(!(key in cells))cells[key]=typeof initial==="function"?initial():initial;return[cells[key],(value:any)=>{cells[key]=typeof value==="function"?value(cells[key]):value;}];},useEffect:(effect:()=>void,deps:unknown[])=>{const key=effectSlot++;if(changed(effects[key],deps)){effects[key]=deps;pending.push(effect);}},useMemo:(compute:()=>unknown)=>compute()};
        if(name==="react/jsx-runtime")return jsx;
        if(name==="next/link")return{__esModule:true,default:component("link")};
        if(name==="next/navigation")return{useRouter:()=>({push:(value:string)=>actions.push({type:"route",value})})};
        if(name==="antd")return new Proxy({Typography:{Text:"text",Title:"title"}},{get:(target,key)=>target[key as keyof typeof target]??component(String(key))});
        if(name==="@ant-design/icons")return new Proxy({},{get:()=>component("icon")});
        if(name==="framer-motion")return{motion:new Proxy({},{get:(_,key)=>component(String(key))})};
        if(name.endsWith("LanguageProvider"))return{useLanguage:()=>{const locale=language;return{language:locale,direction:locale==="ar"?"rtl":"ltr",t:(source:string,values?:Record<string,string|number>)=>tr(locale,source,values)};}};
        if(name.endsWith("tools-registry"))return{toolsRegistry,getToolsByCategory,CATEGORY_DESCRIPTIONS,CATEGORY_COLORS,CATEGORY_ICONS};
        if(name.endsWith("category-routes"))return paths;
        if(name.endsWith("data-boundaries"))return boundaries;
        if(name.endsWith("tool-search"))return search;
        if(name.endsWith("release-notes"))return releases;
        if(name.endsWith("release-preference"))return{markReleaseSeen:(value:string)=>actions.push({type:"release-seen",value})};
        if(name.endsWith("store"))return{useAppStore:(selector?:any)=>selector?selector(store):store};
        if(name.endsWith("seo-content"))return{SITE_URL};
        if(name.endsWith("WorkspaceModeToggle"))return{__esModule:true,default:component("workspace-mode")};
        if(name.endsWith("LandingMarketing"))return{__esModule:true,default:component("marketing")};
        throw Error(`Unexpected dependency ${name}`);
    };
    const module={exports:{} as{default:()=>Element}};
    runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{module,exports:module.exports,require:dependencies,URLSearchParams,Date,document:{getElementById:()=>null},window:{location:{search:""}}});
    const render=(locale:Language=language)=>{language=locale;slot=effectSlot=0;tree=module.exports.default();while(pending.length)pending.shift()!();return tree;};
    const all=()=>{const nodes:Element[]=[],seen=new Set();const walk=(node:any)=>{if(!node||typeof node!=="object"||seen.has(node))return;seen.add(node);if(Array.isArray(node))return node.forEach(walk);if(node.props){nodes.push(node);["children","title","description","label","extra"].forEach(k=>walk(node.props[k]));for(const item of node.props.items??[]){walk(item.label);walk(item.children);}}};walk(tree);return nodes;};
    return{render,all,actions,cells};
}
const rawRegistry=JSON.stringify(toolsRegistry),rawCategories=JSON.stringify(CATEGORY_DESCRIPTIONS);
for(const id of["homepage","release"]as const){
    const page=harness(id);page.render();const initialActions=JSON.stringify(page.actions);let schema:string|undefined;
    for(const{ id:language }of LANGUAGES){
        page.render(language);const nodes=page.all();for(const source of descriptions)assert.ok(nodes.some(node=>node.props.children===tr(language,source)),`${id}/${language}: ${source}`);
        assert.equal(JSON.stringify(page.actions),initialActions,`${id}: locale does not navigate, rewrite release preference or open a tool`);assert.equal(JSON.stringify(toolsRegistry),rawRegistry);assert.equal(JSON.stringify(CATEGORY_DESCRIPTIONS),rawCategories);
        if(id==="homepage"){
            const links=nodes.filter(n=>n.props.className==="wb-cat-tool-card");assert.equal(links.length,147);for(const tool of toolsRegistry)assert.ok(links.some(n=>n.props.href===paths.toolPath(tool)));
            const data=nodes.find(n=>n.props.type==="application/ld+json");assert.ok(data);const json=data.props.dangerouslySetInnerHTML.__html;if(schema)assert.equal(json,schema);else schema=json;
        }else for(const tool of toolsRegistry)assert.ok(nodes.some(n=>n.props.role==="button"&&typeof n.props.onClick==="function"&&text(n).includes(tr(language,tool.description))),`${id}/${language}: navigable card ${tool.id}`);
    }
    page.render("ar");if(id==="homepage"){
        const input=page.all().find(n=>n.props.id==="catalog-search");assert.ok(input);input.props.onChange({target:{value:"JSON"}});page.render();const link=page.all().find(n=>n.props.className==="wb-cat-tool-card"&&n.props.href===paths.toolPathFromId("json-formatter"));assert.ok(link);link.props.onClick();assert.equal(page.actions.at(-1)?.value,"json-formatter");
    }else{
        const tool=toolsRegistry[0],card=page.all().find(n=>n.props.role==="button"&&text(n).includes(tr("ar",tool.description)));assert.ok(card);card.props.onClick();assert.equal(page.actions.at(-1)?.value,paths.toolPath(tool));
    }
}
console.log("Catalog descriptions: all147 tool summaries and15 category summaries cover all8 languages; actual homepage/release renders translate them, raw IDs/URLs/schema stay stable, locale changes cause no tool/navigation writes and real click callbacks preserve canonical destinations. No browser verification claimed.");
