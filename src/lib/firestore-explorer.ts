import { connectorObject,connectorHost,connectorPort,connectorText } from "./connector-config";
import { ConnectorHttpError } from "./local-connector-auth";
import { bearerToken,documentHttp } from "./document-http";
import { documentJsonObject,parseDocumentJson } from "./document-json";
import { documentPage,type DocumentNames,type DocumentResult } from "./mongo-explorer";
export interface FirestoreConnection {mode:"production"|"emulator";projectId:string;databaseId:string;token:string;emulatorHost:string;emulatorPort:number}
export function parseFirestoreConnection(value:unknown):FirestoreConnection{
    const input=connectorObject(value),projectId=connectorText(input.projectId,"project ID",63,false),databaseId=connectorText(input.databaseId,"database ID",63,false);
    if(!["production","emulator"].includes(String(input.mode))||!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId)||databaseId!=="(default)"&&!/^[a-z][a-z0-9-]{2,61}[a-z0-9]$/.test(databaseId))throw new ConnectorHttpError("Check the Firestore mode, 6–30 character project ID and database ID.",400);
    return{mode:input.mode as FirestoreConnection["mode"],projectId,databaseId,token:input.mode==="production"?bearerToken(input.token,"OAuth access token or Firebase ID token"):"",emulatorHost:connectorHost(input.emulatorHost),emulatorPort:connectorPort(input.emulatorPort)};
}
export function firestoreSegments(value:unknown,kind:"document"|"collection"|"any",allowEmpty=false):string[]{
    const path=connectorText(value,"Firestore path",6000,allowEmpty);if(!path&&allowEmpty)return[];
    const segments=path.split("/");
    if(segments.length>80||Buffer.byteLength(path)>6000||segments.some((segment)=>!segment||segment==="."||segment===".."||/^__.*__$/.test(segment)||Buffer.byteLength(segment)>1500||/[\x00-\x1f\x7f\uD800-\uDFFF]/u.test(segment))||kind==="document"&&segments.length%2!==0||kind==="collection"&&segments.length%2!==1)throw new ConnectorHttpError("Use valid alternating collection/document path segments, without empty, dot, reserved or control-character segments.",400);
    return segments;
}
function queryObject(source:unknown,fallback="{}"):Record<string,unknown>{try{return documentJsonObject(parseDocumentJson(source===undefined?fallback:connectorText(source,"structured query",65536,false),"raw").value);}catch(cause){throw new ConnectorHttpError(cause instanceof Error?cause.message:"Invalid structured query.",400);}}
export async function runFirestore(config:FirestoreConnection,operation:string,input:Record<string,unknown>):Promise<DocumentNames|DocumentResult>{
    if(!["collections","documents","query","get"].includes(operation))throw new ConnectorHttpError("Unsupported Firestore read operation.",400);
    const {limit,offset}=documentPage(input),parent=firestoreSegments(input.parentPath??"","document",true),token=connectorText(input.cursor??"","page token",8192);
    // The explicit emulator mode uses its documented admin identity for metadata
    // discovery. Cloud credentials are discarded and never sent to the emulator.
    const host=config.emulatorHost.includes(":")?`[${config.emulatorHost}]`:config.emulatorHost,endpoint=config.mode==="production"?"https://firestore.googleapis.com":`http://${host}:${config.emulatorPort}`;
    const root=`/v1/projects/${encodeURIComponent(config.projectId)}/databases/${encodeURIComponent(config.databaseId)}/documents`,parentPath=root+(parent.length?"/"+parent.map(encodeURIComponent).join("/"):""),headers:Record<string,string>=config.mode==="production"?{Authorization:`Bearer ${config.token}`}:{Authorization:"Bearer owner"},baseName=`projects/${config.projectId}/databases/${config.databaseId}/documents`;
    const send=(url:URL,method:"GET"|"POST",body?:unknown)=>documentHttp(url,method,headers,body,[config.token]);
    if(operation==="collections"){
        const response=await send(new URL(endpoint+parentPath+":listCollectionIds"),"POST",{pageSize:100,...(token?{pageToken:token}:{})}),value=documentJsonObject(response.value,"Collection list");
        const names=Array.isArray(value.collectionIds)?value.collectionIds.filter((name):name is string=>typeof name==="string").slice(0,100):[];
        return{names,truncated:typeof value.nextPageToken==="string"&&!!value.nextPageToken,nextToken:typeof value.nextPageToken==="string"?value.nextPageToken:""};
    }
    if(operation==="get"){
        const path=firestoreSegments(input.documentPath,"document"),response=await send(new URL(endpoint+root+"/"+path.map(encodeURIComponent).join("/")),"GET");
        return{documents:[response.value],raw:response.raw,encoding:"Firestore REST typed values. Integer values remain decimal strings.",truncated:false,convertedNumbers:response.convertedNumbers};
    }
    const collection=firestoreSegments(input.collection,"collection");if(collection.length!==1)throw new ConnectorHttpError("Choose one collection ID relative to the parent document path.",400);
    if(operation==="documents"){
        const url=new URL(endpoint+parentPath+"/"+encodeURIComponent(collection[0]));url.searchParams.set("pageSize",String(limit));if(token)url.searchParams.set("pageToken",token);
        const projection=queryObject(input.options),allowed=new Set(["fields"]);if(Object.keys(projection).some((key)=>!allowed.has(key)))throw new ConnectorHttpError("List options support only a fields array. Use the structured query for filtering.",400);
        if(projection.fields!==undefined){if(!Array.isArray(projection.fields)||projection.fields.length>50||projection.fields.some((field)=>typeof field!=="string"||!field||field.length>1500||/[\x00-\x1f]/.test(field)))throw new ConnectorHttpError("Projection fields must be up to 50 nonempty field-path strings.",400);for(const field of projection.fields)url.searchParams.append("mask.fieldPaths",field);}
        const response=await send(url,"GET"),value=documentJsonObject(response.value,"Document list"),next=typeof value.nextPageToken==="string"?value.nextPageToken:"";
        return{documents:Array.isArray(value.documents)?value.documents.slice(0,limit):[],raw:response.raw,encoding:"Firestore REST typed values. Integer values remain decimal strings.",truncated:!!next,nextToken:next,convertedNumbers:response.convertedNumbers,details:{parent:baseName+(parent.length?"/"+parent.join("/"):"")}};
    }
    const query=queryObject(input.options),allowed=new Set(["where","orderBy","select","startAt","endAt"]);if(Object.keys(query).some((key)=>!allowed.has(key)))throw new ConnectorHttpError("Structured query options support where, orderBy, select, startAt and endAt. Collection, limit and offset use the controls above.",400);
    const response=await send(new URL(endpoint+parentPath+":runQuery"),"POST",{structuredQuery:{...query,from:[{collectionId:collection[0]}],limit,...(offset?{offset}:{})}});
    if(!Array.isArray(response.value))throw new ConnectorHttpError("Firestore returned an unexpected query response.",502);
    const documents=response.value.flatMap((item)=>item&&typeof item==="object"&&"document"in item?[item.document]:[]).slice(0,limit);
    return{documents,raw:response.raw,encoding:"Firestore REST typed values. Integer values remain decimal strings.",truncated:documents.length===limit,...(documents.length===limit?{nextOffset:offset+documents.length}:{}),convertedNumbers:response.convertedNumbers,details:{note:"A full query page can mean more records exist. Offset queries can incur reads for skipped documents; use startAt/orderBy for larger datasets."}};
}
