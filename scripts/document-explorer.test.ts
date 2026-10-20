import assert from "node:assert/strict";
import http from "node:http";
import { documentPreview } from "../src/lib/document-preview";
import { parseDocumentJson } from "../src/lib/document-json";
import { documentHttp,documentEndpoint } from "../src/lib/document-http";
import { guardMongoReadQuery,parseMongoConnection,runMongo } from "../src/lib/mongo-explorer";
import { firestoreSegments,parseFirestoreConnection,runFirestore } from "../src/lib/firestore-explorer";
import { elasticIndex,guardElasticQuery,parseElasticsearchConnection,runElasticsearch } from "../src/lib/elasticsearch-explorer";
async function main(){
    assert.ok(documentPreview({large:"x".repeat(10000)},100).endsWith("complete result."));assert.ok(documentPreview({small:1}).includes("\n"));
    const source='{"safe":42,"exact":9007199254740992,"big":9223372036854775807,"decimal":1.234567890123456789,"negativeZero":-0,"overflow":1e400,"underflow":1e-10000,"text":"9223372036854775807"}';
    const parsed=parseDocumentJson(source);assert.equal(parsed.convertedNumbers,5);const values=parsed.value as Record<string,unknown>;assert.equal(values.safe,42);assert.equal(values.big,"9223372036854775807");assert.equal(values.decimal,"1.234567890123456789");assert.equal(values.negativeZero,"-0");assert.equal(values.overflow,"1e400");assert.equal(values.underflow,"1e-10000");
    const raw=parseDocumentJson('{"big":9223372036854775807,"decimal":1.234567890123456789}',"raw");assert.equal(JSON.stringify(raw.value),'{"big":9223372036854775807,"decimal":1.234567890123456789}');assert.throws(()=>parseDocumentJson("9223372036854775807","reject"),/Extended JSON/);assert.equal(parseDocumentJson("1.2300e2").value,123);assert.throws(()=>parseDocumentJson("NaN"));
    const mongo=parseMongoConnection({host:"127.0.0.1",port:27017,username:"",password:"",authSource:"admin",tls:true,mode:"direct",replicaSet:"",authMechanism:"SCRAM-SHA-256"});
    assert.throws(()=>parseMongoConnection({...mongo,mode:"srv",tls:false}),/verified TLS/);assert.throws(()=>parseMongoConnection({...mongo,host:"169.254.169.254"}),/addresses/);assert.throws(()=>parseMongoConnection({...mongo,authMechanism:"MONGODB-AWS"}),/SCRAM/);
    for(const query of [{$out:"file"},{$where:"return true"},{$lookup:{pipeline:[{$merge:"dest"}]}},{$group:{x:{$accumulator:{init:"function(){}"}}}}])assert.throws(()=>guardMongoReadQuery(query),/writes|JavaScript/);
    await assert.rejects(()=>runMongo(mongo,"find",{database:"fixture",collection:"records",filter:"[]"}),/object/);await assert.rejects(()=>runMongo(mongo,"aggregate",{database:"fixture",collection:"records",pipeline:'[{"$out":"written"}]'}),/writes/);
    const firestore=parseFirestoreConnection({mode:"emulator",projectId:"demo-mydevtools-fixture",databaseId:"(default)",token:"not-sent-to-emulator",emulatorHost:"127.0.0.1",emulatorPort:8080});assert.equal(firestore.token,"");assert.deepEqual(firestoreSegments("records/日本語","document"),["records","日本語"]);for(const path of ["../private","records//one","records/one/","records/__reserved__"])assert.throws(()=>firestoreSegments(path,"document"));
    await assert.rejects(()=>runFirestore(firestore,"delete",{documentPath:"records/one"}),/Unsupported/);
    const elastic=parseElasticsearchConnection({endpoint:"https://example.com/es/",allowHttp:false,authMode:"none",username:"ignored",password:"ignored",token:"ignored"});assert.equal(elastic.endpoint,"https://example.com/es");assert.equal(elastic.password,"");assert.throws(()=>documentEndpoint("http://localhost:9200",false),/HTTP explicitly/);assert.equal(elasticIndex(".public-fixture"),".public-fixture");for(const value of ["_all","../private","UPPER","index*","index,other"])assert.throws(()=>elasticIndex(value));
    assert.throws(()=>guardElasticQuery({query:{script:{script:"return true"}}}),/scripts/);await assert.rejects(()=>runElasticsearch(elastic,"delete",{index:"records"}),/Unsupported/);await assert.rejects(()=>runElasticsearch(elastic,"search",{index:"records",query:'{"size":100000}'}),/bounded controls/);
    if(process.env.EXPANSION_DOCUMENT_TRANSPORT==="true"){
        let mode="json",calls=0,lastAuthorization="",lastBody="";
        const server=http.createServer((request,response)=>{calls++;lastAuthorization=String(request.headers.authorization??"");const parts:Buffer[]=[];request.on("data",(chunk)=>parts.push(chunk));request.on("end",()=>{lastBody=Buffer.concat(parts).toString();if(mode==="oversized"){response.writeHead(200,{"Content-Length":3*1024*1024});response.end();}else if(mode==="stream"){response.writeHead(200);for(let i=0;i<40;i++)response.write(Buffer.alloc(65536));response.end();}else if(mode==="error"){response.writeHead(500,{"Content-Type":"application/json"});response.end('{"error":{"type":"publicfixturesecret"}}');}else if(mode==="redirect"){response.writeHead(302,{Location:"https://example.com/private"});response.end('{}');}else{response.writeHead(200,{"Content-Type":"application/json"});response.end('{"hits":{"hits":[{"_source":{"big":9223372036854775807}}]},"timed_out":false}');}});});
        await new Promise<void>((resolve)=>server.listen(0,"127.0.0.1",resolve));const port=(server.address() as {port:number}).port,target=new URL(`http://127.0.0.1:${port}/`);
        try{
            const connection=parseElasticsearchConnection({endpoint:target.href,allowHttp:true,authMode:"apiKey",username:"",password:"",token:"publicfixturesecret"});const result=await runElasticsearch(connection,"search",{index:"records",query:'{"query":{"term":{"big":9223372036854775807}}}'});assert.equal(lastAuthorization,"ApiKey publicfixturesecret");assert.ok(lastBody.includes('"big":9223372036854775807'));assert.ok("raw"in result&&result.raw.includes('"big":9223372036854775807'));
            mode="oversized";await assert.rejects(()=>documentHttp(target,"GET",{}),/2 MiB/);mode="stream";await assert.rejects(()=>documentHttp(target,"GET",{}),/2 MiB/);
            mode="error";calls=0;await assert.rejects(()=>runElasticsearch(connection,"search",{index:"records"}),(cause:unknown)=>cause instanceof Error&&!cause.message.includes("publicfixturesecret"));assert.equal(calls,1);
            mode="redirect";calls=0;await assert.rejects(()=>documentHttp(target,"GET",{}),/HTTP 302/);assert.equal(calls,1,"No credential-bearing redirect follows");
            console.log("Document REST transport headers, exact query literals, raw response, streaming/body bounds, secret-free errors and no retry/redirect fixtures passed.");
        }finally{server.closeAllConnections();await new Promise<void>((resolve,reject)=>server.close((cause)=>cause?reject(cause):resolve()));}
    }
    console.log("Document number preservation, Mongo/Firestore/Elasticsearch settings, readonly query guards, path bounds and page validation fixtures passed.");
}
main().catch((cause)=>{console.error(cause);process.exitCode=1;});
