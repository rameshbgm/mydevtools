import http from "node:http";
import https from "node:https";
import { connectorHost,connectorText } from "./connector-config";
import { ConnectorHttpError } from "./local-connector-auth";
import { parseDocumentJson } from "./document-json";
export function documentEndpoint(value:unknown,allowHttp:boolean):string{
    let endpoint:URL;try{endpoint=new URL(connectorText(value,"service endpoint",2048,false));}catch{throw new ConnectorHttpError("Enter an absolute service endpoint URL.",400);}
    if(!["https:","http:"].includes(endpoint.protocol)||endpoint.username||endpoint.password||endpoint.search||endpoint.hash)throw new ConnectorHttpError("Use an HTTP(S) endpoint without embedded credentials, query or fragment.",400);
    connectorHost(endpoint.hostname);
    if(endpoint.protocol==="http:"&&!allowHttp)throw new ConnectorHttpError("Enable unencrypted HTTP explicitly for this development service, or use HTTPS.",400);
    return endpoint.href.replace(/\/$/,"");
}
export function bearerToken(value:unknown,label="token"):string{const token=connectorText(value,label,16384,false);if(/[\s\x00-\x1f\x7f]/.test(token))throw new ConnectorHttpError(`Check ${label}; whitespace and control characters are not supported.`,400);return token;}
export interface DocumentHttpResult {value:unknown;raw:string;convertedNumbers:number}
/** Fixed connector methods/paths only; no redirects, ambient proxy/auth, or retries. */
export async function documentHttp(url:URL,method:"GET"|"POST",headers:Record<string,string>,body?:unknown,secrets:string[]=[]):Promise<DocumentHttpResult>{
    const encoded=body===undefined?undefined:Buffer.from(JSON.stringify(body));if(encoded&&encoded.length>128*1024)throw new ConnectorHttpError("Query request exceeds 128 KiB.",400);
    const agent=url.protocol==="https:"?new https.Agent({keepAlive:false,rejectUnauthorized:true}):new http.Agent({keepAlive:false});
    try{return await new Promise<DocumentHttpResult>((resolve,reject)=>{
        let finished=false;
        const finish=(cause?:Error,result?:DocumentHttpResult)=>{if(finished)return;finished=true;clearTimeout(timer);if(cause)reject(cause);else resolve(result!);};
        const request=(url.protocol==="https:"?https.request:http.request)(url,{method,agent,headers:{Accept:"application/json","Accept-Encoding":"identity",...(encoded?{"Content-Type":"application/json","Content-Length":String(encoded.length)}:{}),...headers}},response=>{
            const parts:Buffer[]=[];let size=0;
            const declared=response.headers["content-length"];
            if(declared&&/^\d+$/.test(declared)&&Number(declared)>2*1024*1024){request.destroy();finish(new ConnectorHttpError("Document response exceeds 2 MiB. Reduce page size or project fewer fields.",413));return;}
            response.on("data",(part:Buffer)=>{size+=part.length;if(size>2*1024*1024){request.destroy();finish(new ConnectorHttpError("Document response exceeds 2 MiB. Reduce page size or project fewer fields.",413));}else parts.push(part);});
            response.on("error",()=>finish(new ConnectorHttpError("The document response stream ended unexpectedly.",502)));
            response.on("end",()=>{
                if(finished)return;
                const raw=Buffer.concat(parts,size).toString("utf8"),status=response.statusCode??502;
                let parsed:ReturnType<typeof parseDocumentJson>;try{parsed=parseDocumentJson(raw);}catch{finish(new ConnectorHttpError(`The service returned HTTP ${status} without a supported JSON response. Check the endpoint and service version.`,502));return;}
                if(status<200||status>=300){const obj=parsed.value&&typeof parsed.value==="object"?parsed.value as {error?:{status?:unknown;type?:unknown}}:{};const candidate=obj.error?.status??obj.error?.type;const code=typeof candidate==="string"&&/^[A-Za-z_]{1,64}$/.test(candidate)&&!secrets.some((secret)=>secret&&candidate.includes(secret))?candidate:"ServiceRequestFailed";finish(new ConnectorHttpError(`HTTP ${status} · ${code}. Check the query, endpoint, credentials and permissions.`,status>=400&&status<500?status:502));return;}
                finish(undefined,{...parsed,raw});
            });
        });
        const timer=setTimeout(()=>{request.destroy();finish(new ConnectorHttpError("Document request exceeded twelve seconds. Reduce the query scope or check the service.",504));},12000);
        request.on("error",()=>finish(new ConnectorHttpError("Could not connect to the document service. Check the address, network and trusted TLS certificate.",502)));
        request.end(encoded);
    });}finally{agent.destroy();}
}
