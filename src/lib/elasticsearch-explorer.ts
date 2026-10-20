import { connectorObject,connectorText } from "./connector-config";
import { ConnectorHttpError } from "./local-connector-auth";
import { bearerToken,documentEndpoint,documentHttp } from "./document-http";
import { documentJsonObject,parseDocumentJson } from "./document-json";
import { documentPage,type DocumentNames,type DocumentResult } from "./mongo-explorer";
export interface ElasticsearchConnection {endpoint:string;allowHttp:boolean;authMode:"none"|"basic"|"apiKey"|"bearer";username:string;password:string;token:string}
export function parseElasticsearchConnection(value:unknown):ElasticsearchConnection{
    const input=connectorObject(value);if(typeof input.allowHttp!=="boolean"||!["none","basic","apiKey","bearer"].includes(String(input.authMode)))throw new ConnectorHttpError("Check the Elasticsearch authentication mode and HTTP setting.",400);
    const endpoint=documentEndpoint(input.endpoint,input.allowHttp),authMode=input.authMode as ElasticsearchConnection["authMode"];
    const username=authMode==="basic"?connectorText(input.username,"username",256,false):"",password=authMode==="basic"?connectorText(input.password,"password",4096,false):"",token=authMode==="apiKey"||authMode==="bearer"?bearerToken(input.token,"API key / bearer token"):"";
    if(/[\x00-\x1f]/.test(username+password)||username.includes(":"))throw new ConnectorHttpError("Basic authentication username cannot contain a colon; credentials cannot contain control characters.",400);
    return{endpoint,allowHttp:input.allowHttp,authMode,username,password,token};
}
export function elasticIndex(value:unknown):string{const index=connectorText(value,"index or alias",255,false);if(Buffer.byteLength(index)>255||index!==index.toLowerCase()||/[\s\\/*?"<>|,#:\x00-\x1f]/.test(index)||/^[+_-]/.test(index)||index==="."||index==="..")throw new ConnectorHttpError("Enter one concrete lowercase Elasticsearch index/alias without wildcards, slashes or reserved characters.",400);return index;}
export function guardElasticQuery(value:unknown):void{let count=0;function walk(node:unknown,depth:number){if(++count>10000||depth>40)throw new ConnectorHttpError("Query exceeds 10,000 values or 40 nesting levels.",400);if(node&&typeof node==="object")for(const[key,child]of Object.entries(node)){if(["script","script_score","script_fields","runtime_mappings","scripted_metric","init_script","map_script","combine_script","reduce_script","_script"].includes(key))throw new ConnectorHttpError("Server-side scripts are unavailable in this read-only explorer.",400);walk(child,depth+1);}}walk(value,0);}
export async function runElasticsearch(config:ElasticsearchConnection,operation:string,input:Record<string,unknown>):Promise<DocumentNames|DocumentResult>{
    if(!["indices","mapping","search","get"].includes(operation))throw new ConnectorHttpError("Unsupported Elasticsearch read operation.",400);
    const headers:Record<string,string>=config.authMode==="basic"?{Authorization:"Basic "+Buffer.from(config.username+":"+config.password).toString("base64")}:config.authMode==="apiKey"?{Authorization:`ApiKey ${config.token}`}:config.authMode==="bearer"?{Authorization:`Bearer ${config.token}`}:{},url=(path:string)=>new URL(config.endpoint+"/"+path);
    const send=(target:URL,method:"GET"|"POST",body?:unknown)=>documentHttp(target,method,headers,body,[config.password,config.token]);
    if(operation==="indices"){
        const pattern=connectorText(input.pattern??"*","index pattern",255,false);if(!/^[a-z0-9.*?_-]+$/.test(pattern)||pattern==="."||pattern==="..")throw new ConnectorHttpError("Index listing patterns support lowercase letters, digits, dots, hyphens, underscores, * and ?.",400);
        const target=url("_cat/indices/"+encodeURIComponent(pattern));target.searchParams.set("format","json");target.searchParams.set("h","index,health,status,docs.count,store.size");target.searchParams.set("bytes","b");target.searchParams.set("expand_wildcards","open");
        const response=await send(target,"GET");if(!Array.isArray(response.value))throw new ConnectorHttpError("Elasticsearch returned an unexpected index list.",502);
        const selected=response.value.slice(0,200);return{names:selected.flatMap((item)=>item&&typeof item==="object"&&typeof item.index==="string"?[item.index]:[]),truncated:response.value.length>200,details:selected};
    }
    const index=elasticIndex(input.index);
    if(operation==="mapping"){const response=await send(url(encodeURIComponent(index)+"/_mapping"),"GET");return{documents:[response.value],raw:response.raw,encoding:"Elasticsearch mapping response; raw JSON retained.",truncated:false,convertedNumbers:response.convertedNumbers};}
    if(operation==="get"){
        const id=connectorText(input.documentId,"document ID",512,false);if(/[\x00-\x1f\uD800-\uDFFF]/u.test(id)||Buffer.byteLength(id)>512)throw new ConnectorHttpError("Use a valid Unicode document ID up to 512 UTF-8 bytes.",400);
        const response=await send(url(encodeURIComponent(index)+"/_doc/"+encodeURIComponent(id)),"GET");return{documents:[response.value],raw:response.raw,encoding:"Elasticsearch JSON. Numbers that would be rounded are displayed as source strings; raw JSON retains numeric literals.",truncated:false,convertedNumbers:response.convertedNumbers};
    }
    const {limit,offset}=documentPage(input);if(offset+limit>10000)throw new ConnectorHttpError("Keep offset + page size at or below 10,000; use search_after for deeper pagination.",400);
    let body:Record<string,unknown>;try{body=documentJsonObject(parseDocumentJson(input.query===undefined?'{"query":{"match_all":{}}}':connectorText(input.query,"search options",65536,false),"raw").value);}catch(cause){throw new ConnectorHttpError(cause instanceof Error?cause.message:"Invalid search JSON.",400);}
    const allowed=new Set(["query","sort","_source","fields","highlight","aggs","aggregations","post_filter","collapse","search_after","track_total_hits"]);if(Object.keys(body).some((key)=>!allowed.has(key)))throw new ConnectorHttpError("Search options support query, sort, _source, fields, highlight, aggs/aggregations, post_filter, collapse, search_after and track_total_hits. Size/from/timeout use bounded controls.",400);
    guardElasticQuery(body);
    if(body.search_after!==undefined&&(!Array.isArray(body.search_after)||offset!==0))throw new ConnectorHttpError("search_after must be an array and uses offset zero.",400);
    if(body.track_total_hits!==undefined&&typeof body.track_total_hits!=="boolean"&&!(typeof body.track_total_hits==="number"&&Number.isInteger(body.track_total_hits)&&body.track_total_hits>=0&&body.track_total_hits<=10000))throw new ConnectorHttpError("track_total_hits must be a boolean or integer from 0 to 10,000.",400);
    const response=await send(url(encodeURIComponent(index)+"/_search"),"POST",{...body,size:limit,from:offset,timeout:"5s",track_total_hits:body.track_total_hits??false}),value=documentJsonObject(response.value,"Search response"),hits=value.hits&&typeof value.hits==="object"?value.hits as {hits?:unknown[];total?:unknown}:{};
    const documents=Array.isArray(hits.hits)?hits.hits.slice(0,limit):[];
    return{documents,raw:response.raw,encoding:"Elasticsearch JSON. Numbers that would be rounded are displayed as source strings; raw JSON retains numeric literals.",truncated:documents.length===limit,...(documents.length===limit&&offset+limit<10000?{nextOffset:offset+limit}:{}),convertedNumbers:response.convertedNumbers,details:{total:hits.total??null,timedOut:value.timed_out??false,shards:value._shards??null,aggregations:value.aggregations??null,note:"A full page may have more results. search_after values from the last hit can be used with an explicit stable sort; concurrent updates may change pagination."}};
}
