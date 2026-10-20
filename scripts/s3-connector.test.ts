import assert from "node:assert/strict";
import http from "node:http";
import { parseS3Connection,runS3 } from "../src/lib/s3-connector";
async function main(){
const settings={endpoint:"https://s3.us-east-1.amazonaws.com",region:"us-east-1",accessKeyId:"public-fixture-access-key",secretAccessKey:"public-fixture-secret-key",sessionToken:"",forcePathStyle:true,allowHttp:false};
assert.equal(parseS3Connection(settings).endpoint,settings.endpoint);
for(const endpoint of ["https://user:pass@example.com/","file:///tmp/key","https://example.com/path","https://example.com/?key=secret","https://169.254.169.254/","https://example.com/#part"]){assert.throws(()=>parseS3Connection({...settings,endpoint}),/endpoint|host|addresses/);}
assert.throws(()=>parseS3Connection({...settings,endpoint:"http://localhost:1234"}),/HTTP explicitly/);
assert.equal(parseS3Connection({...settings,endpoint:"http://localhost:1234/",allowHttp:true}).endpoint,"http://localhost:1234");
assert.throws(()=>parseS3Connection({...settings,sessionToken:"bad\r\nheader"}),/control/);
await assert.rejects(()=>runS3(settings,"unknown",{}),/Unsupported/);
await assert.rejects(()=>runS3(settings,"info",{bucket:"arn:aws:s3:example",key:"file"}),/DNS-style/);
await assert.rejects(()=>runS3(settings,"info",{bucket:"public-fixture",key:"\uD800"}),/valid Unicode/);
await assert.rejects(()=>runS3(settings,"info",{bucket:"public-fixture",key:"é".repeat(513)}),/1024/);
await assert.rejects(()=>runS3(settings,"upload",{bucket:"public-fixture",key:"file",base64:""}),/Enable storage writes/);
await assert.rejects(()=>runS3(settings,"delete",{bucket:"public-fixture",key:"file",write:true,confirmKey:"other"}),/complete object key/);
await assert.rejects(()=>runS3(settings,"upload",{bucket:"public-fixture",key:"file",write:true,base64:"%%%="}),/canonical Base64/);
if(process.env.EXPANSION_S3_TRANSPORT==="true"){
    let mode="large-header",requests=0;
    const server=http.createServer((request,response)=>{
        requests++;
        if(mode==="large-header"){response.writeHead(200,{"Content-Length":3*1024*1024});response.end();}
        else if(mode==="large-stream"){response.writeHead(200);for(let index=0;index<40;index++)response.write(Buffer.alloc(65536,120));response.end();}
        else if(mode==="error"){response.writeHead(500,{"Content-Type":"application/xml"});response.end('<Error><Code>InternalError</Code><Message>public-fixture-secret-key</Message></Error>');}
        else if(mode==="head"){response.writeHead(200,{"Content-Length":16*1024*1024,"Content-Type":"application/octet-stream","ETag":'"public-fixture"'});response.end();}
        else {response.writeHead(200,{"Content-Type":"application/xml"});response.end('<?xml version="1.0"?><ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Buckets><Bucket><Name>public-fixture</Name><CreationDate>2026-10-19T00:00:00Z</CreationDate></Bucket></Buckets></ListAllMyBucketsResult>');}
    });
    await new Promise<void>((resolve)=>server.listen(0,"127.0.0.1",resolve));
    const port=(server.address() as {port:number}).port,connection=parseS3Connection({...settings,endpoint:`http://127.0.0.1:${port}`,allowHttp:true});
    try{
        await assert.rejects(()=>runS3(connection,"buckets",{}),/size limit/);
        mode="large-stream";await assert.rejects(()=>runS3(connection,"buckets",{}),/size limit/);
        mode="error";requests=0;await assert.rejects(()=>runS3(connection,"buckets",{}),(cause:unknown)=>cause instanceof Error&&!cause.message.includes(settings.secretAccessKey));assert.equal(requests,1,"No automatic retries");
        mode="head";assert.equal((await runS3(connection,"info",{bucket:"public-fixture",key:"large"}) as {size:string}).size,String(16*1024*1024));
        mode="buckets";assert.equal((await runS3(connection,"buckets",{}) as {buckets:{name:string}[]}).buckets[0].name,"public-fixture");
        console.log("Signed transport/raw XML and streamed response bounds, HEAD metadata, secret-free errors and retry count fixtures passed.");
    }finally{server.closeAllConnections();await new Promise<void>((resolve,reject)=>server.close((cause)=>cause?reject(cause):resolve()));}
}
console.log("S3 settings, explicit credentials/HTTP gates, bucket/key bounds, write and deletion confirmation fixtures passed.");

}
main().catch((cause)=>{console.error(cause);process.exitCode=1;});
