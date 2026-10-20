import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
async function main(){
    const origin=process.env.EXPANSION_APP_ORIGIN??"http://127.0.0.1:3100",port=Number(process.env.EXPANSION_S3_PORT);if(!port||new URL(origin).hostname!=="127.0.0.1")throw new Error("Use the owned loopback app and Garage fixture.");
    const connection={endpoint:`http://127.0.0.1:${port}`,region:"garage",accessKeyId:"GK11111111111111111111111111111111",secretAccessKey:"2222222222222222222222222222222222222222222222222222222222222222",sessionToken:"",forcePathStyle:true,allowHttp:true},key=`production-public-fixture/${randomUUID()}.bin`;
    const call=async(operation:string,data:Record<string,unknown>={})=>{const response=await fetch(origin+"/api/local-connectors",{method:"POST",headers:{"Content-Type":"application/json",Origin:origin,"X-MyDevtools-Local-Token":"public-fixture-local-access-key-2026-expansion"},body:JSON.stringify({service:"s3",operation,connection,bucket:"expansion-public-fixture",key,...data}),signal:AbortSignal.timeout(25000)});return{status:response.status,value:await response.json()};};
    const bytes=Buffer.alloc(8*1024*1024,165);let created=false;
    try{
        const uploaded=await call("upload",{write:true,base64:bytes.toString("base64")});assert.equal(uploaded.status,200,JSON.stringify(uploaded.value));created=true;assert.equal(uploaded.value.bytes,bytes.length);
        const downloaded=await call("download");assert.equal(downloaded.status,200);assert.ok(Buffer.from(downloaded.value.base64,"base64").equals(bytes));
        const legacy=await fetch(origin+"/tools/s3-browser",{redirect:"manual"});assert.equal(legacy.status,308);assert.ok(legacy.headers.get("location")?.endsWith("/api-and-web-services/s3-browser"));
        const wrongCategory=await fetch(origin+"/generators/s3-browser",{redirect:"manual"});assert.equal(wrongCategory.status,308);assert.ok(wrongCategory.headers.get("location")?.endsWith("/api-and-web-services/s3-browser"));
        const missingToken=await fetch(origin+"/api/local-connectors",{headers:{Origin:origin}});assert.equal(missingToken.status,401);
        console.log("Production 8 MiB upload/download roundtrip, native token gate and legacy/wrong-category redirects passed.");
    }finally{if(created){const removed=await call("delete",{write:true,confirmKey:key});assert.equal(removed.status,200);}}
}
main().catch((cause)=>{console.error(cause);process.exitCode=1;});
