import net from "node:net";
import { MongoClient,BSON,type Document } from "mongodb";
import { connectorHost,connectorObject,connectorPort,connectorText } from "./connector-config";
import { ConnectorHttpError } from "./local-connector-auth";
import { parseDocumentJson,documentJsonObject } from "./document-json";
export interface MongoConnection {host:string;port:number;username:string;password:string;authSource:string;tls:boolean;mode:"direct"|"discover"|"srv";replicaSet:string;authMechanism:"SCRAM-SHA-256"|"SCRAM-SHA-1"}
export interface DocumentResult {documents:unknown[];raw:string;encoding:string;truncated:boolean;nextOffset?:number;nextToken?:string;convertedNumbers?:number;details?:unknown}
export interface DocumentNames {names:string[];truncated:boolean;nextToken?:string;details?:unknown}
function databaseName(value:unknown):string{const name=connectorText(value,"MongoDB database name",200,false);if(Buffer.byteLength(name)>63||/[\s\/."$\\\x00]/.test(name))throw new ConnectorHttpError("Enter a MongoDB database name up to 63 UTF-8 bytes without spaces, slashes, dots, quotes or dollar signs.",400);return name;}
function collectionName(value:unknown):string{const name=connectorText(value,"collection name",255,false);if(Buffer.byteLength(name)>255||name.includes("\0"))throw new ConnectorHttpError("Collection names must be nonempty, up to 255 UTF-8 bytes, without NUL characters.",400);return name;}
export function parseMongoConnection(value:unknown):MongoConnection{
    const input=connectorObject(value),host=connectorHost(input.host);
    if(typeof input.tls!=="boolean"||!["direct","discover","srv"].includes(String(input.mode))||!["SCRAM-SHA-256","SCRAM-SHA-1"].includes(String(input.authMechanism)))throw new ConnectorHttpError("Check the MongoDB mode, SCRAM authentication and TLS setting.",400);
    if(input.mode==="srv"&&(!input.tls||net.isIP(host)))throw new ConnectorHttpError("SRV mode requires a DNS hostname and verified TLS.",400);
    const username=connectorText(input.username,"username",256),password=connectorText(input.password,"password",4096),replicaSet=connectorText(input.replicaSet,"replica set",128);
    if(/[\x00-\x1f]/.test(username+password+replicaSet))throw new ConnectorHttpError("MongoDB credentials and replica-set names cannot contain control characters.",400);
    if(password&&!username)throw new ConnectorHttpError("Enter a username with the MongoDB password.",400);
    return{host,port:connectorPort(input.port),username,password,authSource:databaseName(input.authSource),tls:input.tls,mode:input.mode as MongoConnection["mode"],replicaSet,authMechanism:input.authMechanism as MongoConnection["authMechanism"]};
}
export function documentPage(input:Record<string,unknown>):{limit:number;offset:number}{const limit=input.limit??50,offset=input.offset??0;if(typeof limit!=="number"||!Number.isInteger(limit)||limit<1||limit>100||typeof offset!=="number"||!Number.isInteger(offset)||offset<0||offset>10000)throw new ConnectorHttpError("Use a page size of 1–100 and offset of 0–10,000.",400);return{limit,offset};}
const ALLOWED_STAGES=new Set(["$match","$project","$sort","$skip","$limit","$group","$count","$unwind","$addFields","$set","$unset","$replaceRoot","$replaceWith","$lookup","$facet","$sample","$bucket","$bucketAuto","$sortByCount","$unionWith","$graphLookup","$geoNear","$densify","$fill","$setWindowFields"]);
export function guardMongoReadQuery(value:unknown):void{
    let nodes=0;
    function visit(node:unknown,depth:number){if(++nodes>10000||depth>40)throw new ConnectorHttpError("Query exceeds 10,000 values or 40 nesting levels.",400);if(node&&typeof node==="object")for(const[key,child]of Object.entries(node)){if(["$out","$merge","$where","$function","$accumulator","$eval"].includes(key))throw new ConnectorHttpError("Database writes and server-side JavaScript are not available in this read-only explorer.",400);visit(child,depth+1);}}
    visit(value,0);
}
function readQuery(value:unknown,label:string,fallback:string):unknown{
    const source=value===undefined?fallback:connectorText(value,label,65536,false);
    try{const parsed=parseDocumentJson(source,"reject").value;guardMongoReadQuery(parsed);return BSON.EJSON.parse(source,{relaxed:false});}catch(cause){if(cause instanceof ConnectorHttpError)throw cause;throw new ConnectorHttpError(cause instanceof Error?cause.message:`Invalid ${label}.`,400);}
}
export async function runMongo(config:MongoConnection,operation:string,input:Record<string,unknown>):Promise<DocumentNames|DocumentResult>{
    if(!["databases","collections","find","aggregate"].includes(operation))throw new ConnectorHttpError("Unsupported MongoDB read operation.",400);
    const database=operation==="databases"?"":databaseName(input.database),collection=["find","aggregate"].includes(operation)?collectionName(input.collection):"",{limit,offset}=documentPage(input);
    let filter:Document={},projection:Document={},sort:Record<string,1|-1>={_id:1},pipeline:Document[]=[];
    if(operation==="find"){
        try{filter=documentJsonObject(readQuery(input.filter,"filter","{}"),"Filter");projection=documentJsonObject(readQuery(input.projection,"projection","{}"),"Projection");}catch(cause){throw new ConnectorHttpError(cause instanceof Error?cause.message:"Invalid filter or projection.",400);}
        try{const parsed=parseDocumentJson(input.sort===undefined?'{"_id":1}':connectorText(input.sort,"sort",8192,false),"reject").value;const object=documentJsonObject(parsed,"Sort");if(Object.keys(object).length>20||Object.entries(object).some(([key,value])=>!key||key.includes("\0")||value!==1&&value!==-1))throw new Error("Sort uses up to 20 field names with direction 1 or -1.");sort=object as Record<string,1|-1>;}catch(cause){throw new ConnectorHttpError(cause instanceof Error?cause.message:"Invalid sort.",400);}
    }
    if(operation==="aggregate"){
        const parsed=readQuery(input.pipeline,"aggregation pipeline","[]");if(!Array.isArray(parsed)||parsed.length>40||parsed.some((stage)=>!stage||typeof stage!=="object"||Array.isArray(stage)||Object.keys(stage).length!==1||!ALLOWED_STAGES.has(Object.keys(stage)[0])))throw new ConnectorHttpError("Use up to 40 supported read-only aggregation stages. Output/write, administrative and scripting stages are unavailable.",400);pipeline=parsed;
    }
    const host=net.isIP(config.host)===6?`[${config.host}]`:config.host,uri=config.mode==="srv"?`mongodb+srv://${host}/`:`mongodb://${host}:${config.port}/`;
    const client=new MongoClient(uri,{...(config.username?{auth:{username:config.username,password:config.password},authSource:config.authSource,authMechanism:config.authMechanism}:{}),...(config.replicaSet?{replicaSet:config.replicaSet}:{}),directConnection:config.mode==="direct",tls:config.tls,tlsAllowInvalidCertificates:false,tlsAllowInvalidHostnames:false,connectTimeoutMS:5000,serverSelectionTimeoutMS:5000,socketTimeoutMS:8000,timeoutMS:10000,maxPoolSize:1,minPoolSize:0,maxConnecting:1,waitQueueTimeoutMS:1000,retryReads:false,retryWrites:false,promoteValues:false,promoteLongs:false,promoteBuffers:false,bsonRegExp:true,appName:"mydevtools-read-explorer"});
    const controller=new AbortController(),timer=setTimeout(()=>{controller.abort();void client.close(true).catch(()=>{});},15000);
    try{
        await client.connect();
        if(operation==="databases"){const result=await client.db("admin").admin().listDatabases({nameOnly:true,authorizedDatabases:true,maxTimeMS:5000});return{names:result.databases.slice(0,200).map((row)=>row.name),truncated:result.databases.length>200};}
        const db=client.db(database);
        if(operation==="collections"){
            const cursor=db.listCollections({},{nameOnly:true,authorizedCollections:true,batchSize:50,maxTimeMS:5000}),names:string[]=[];
            try{for await(const item of cursor){if(names.length===200)return{names,truncated:true};names.push(item.name);}}finally{await cursor.close();}
            return{names,truncated:false};
        }
        const cursor=operation==="find"?db.collection(collection).find(filter,{projection,sort,skip:offset,limit:limit+1,batchSize:10,maxTimeMS:5000,allowDiskUse:false,signal:controller.signal}):db.collection(collection).aggregate([...pipeline,...(offset?[{$skip:offset}]:[]),{$limit:limit+1}],{batchSize:10,maxTimeMS:5000,allowDiskUse:false,signal:controller.signal});
        const documents:unknown[]=[];let size=2,truncated=false;
        try{for await(const document of cursor){if(documents.length===limit){truncated=true;break;}const text=BSON.EJSON.stringify(document,{relaxed:false}),bytes=Buffer.byteLength(text)+1;if(size+bytes>2*1024*1024){if(!documents.length)throw new ConnectorHttpError("A document exceeds the 2 MiB result limit. Project fewer fields.",413);truncated=true;break;}size+=bytes;documents.push(JSON.parse(text));}}finally{await cursor.close();}
        return{documents,raw:JSON.stringify(documents),encoding:"Canonical MongoDB Extended JSON; BSON number/date/object-ID/binary types are retained.",truncated,...(truncated?{nextOffset:offset+documents.length}:{})};
    }catch(cause){if(cause instanceof ConnectorHttpError)throw cause;if(controller.signal.aborted)throw new ConnectorHttpError("MongoDB request exceeded fifteen seconds. Reduce the query scope.",504);const candidate=cause&&typeof cause==="object"&&"name"in cause?String(cause.name):"MongoRequestFailed";const name=/^[A-Za-z_]{1,64}$/.test(candidate)&&![config.username,config.password].some((secret)=>secret&&candidate.includes(secret))?candidate:"MongoRequestFailed";throw new ConnectorHttpError(`${name}. Check the host, trusted TLS certificate, SCRAM credentials, database permissions and query. No writes or server-side JavaScript are supported.`,502);}
    finally{clearTimeout(timer);await client.close(true);}
}
