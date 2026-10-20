import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { MongoClient,BSON } from "mongodb";
import { parseMongoConnection,runMongo,type DocumentResult,type DocumentNames } from "../src/lib/mongo-explorer";
import { parseFirestoreConnection,runFirestore } from "../src/lib/firestore-explorer";
import { parseElasticsearchConnection,runElasticsearch } from "../src/lib/elasticsearch-explorer";
async function main(){
    const mongoPort=Number(process.env.EXPANSION_MONGO_PORT),firestorePort=Number(process.env.EXPANSION_FIRESTORE_PORT),elasticPort=Number(process.env.EXPANSION_ELASTIC_PORT);if(!mongoPort||!firestorePort||!elasticPort)throw new Error("Set the three owned fixture ports.");
    const suffix=randomUUID().replace(/-/g,""),database="fixture_"+suffix,index="fixture-"+suffix,collection="fixture-"+suffix;
    const mongo=parseMongoConnection({host:"127.0.0.1",port:mongoPort,username:"fixture",password:"public-fixture-password-only",authSource:"admin",tls:false,mode:"direct",replicaSet:"",authMechanism:"SCRAM-SHA-256"}),fixture=new MongoClient(`mongodb://127.0.0.1:${mongoPort}`,{auth:{username:mongo.username,password:mongo.password},authSource:"admin"});
    const firestore=parseFirestoreConnection({mode:"emulator",projectId:"demo-mydevtools-fixture",databaseId:"(default)",token:"public-token-must-not-be-sent-to-emulator",emulatorHost:"127.0.0.1",emulatorPort:firestorePort}),firestoreRoot=`http://127.0.0.1:${firestorePort}/v1/projects/${firestore.projectId}/databases/(default)/documents`;
    const elastic=parseElasticsearchConnection({endpoint:`http://127.0.0.1:${elasticPort}`,allowHttp:true,authMode:"basic",username:"elastic",password:"public-fixture-password-only",token:""}),elasticHeaders={Authorization:"Basic "+Buffer.from("elastic:public-fixture-password-only").toString("base64"),"Content-Type":"application/json"};
    const createdFirestore:string[]=[];
    const cloud=async(path:string,method="GET",body?:unknown)=>{const response=await fetch(firestoreRoot+"/"+path,{method,headers:body?{"Content-Type":"application/json"}:{},body:body?JSON.stringify(body):undefined});const text=await response.text();assert.ok(response.ok,`${method} Firestore: ${response.status} ${text.slice(0,500)}`);return text?JSON.parse(text):{};};
    const es=async(path:string,method="GET",body?:unknown)=>{const response=await fetch(elastic.endpoint+"/"+path,{method,headers:elasticHeaders,body:body===undefined?undefined:typeof body==="string"?body:JSON.stringify(body)});const text=await response.text();assert.ok(response.ok,`${method} Elasticsearch: ${response.status} ${text.slice(0,500)}`);return text?JSON.parse(text):{};};
    try{
        await fixture.connect();
        await fixture.db(database).collection("records").insertMany(Array.from({length:5},(_,i)=>({_id:new BSON.ObjectId(),rank:new BSON.Int32(i),active:i%2===0,name:i===0?"日本語 العربية":"Public fixture "+i,big:BSON.Long.fromString("9223372036854775807"),decimal:BSON.Decimal128.fromString("1234567890.1234567890123456789"),date:new Date("2026-10-19T00:00:00.123Z"),binary:new BSON.Binary(Buffer.from([0,1,128,255])),regex:new BSON.BSONRegExp("public","i")})));
        assert.ok((await runMongo(mongo,"databases",{}) as DocumentNames).names.includes(database));assert.deepEqual((await runMongo(mongo,"collections",{database}) as DocumentNames).names,["records"]);
        const mongoResult=await runMongo(mongo,"find",{database,collection:"records",filter:'{"active":true}',sort:'{"rank":1}',limit:2}) as DocumentResult;assert.equal(mongoResult.documents.length,2);assert.equal(mongoResult.truncated,true);
        const first=mongoResult.documents[0] as any;assert.equal(first.big.$numberLong,"9223372036854775807");assert.equal(first.decimal.$numberDecimal,"1234567890.1234567890123456789");assert.equal(first.rank.$numberInt,"0");assert.equal(first.binary.$binary.base64,"AAGA/w==");assert.equal(first.name,"日本語 العربية");assert.match(first._id.$oid,/^[0-9a-f]{24}$/);assert.equal(first.date.$date.$numberLong,String(Date.parse("2026-10-19T00:00:00.123Z")));assert.deepEqual(first.regex.$regularExpression,{pattern:"public",options:"i"});
        const second=await runMongo(mongo,"find",{database,collection:"records",filter:'{"active":true}',sort:'{"rank":1}',limit:2,offset:mongoResult.nextOffset}) as DocumentResult;assert.equal(second.documents.length,1);
        const aggregate=await runMongo(mongo,"aggregate",{database,collection:"records",pipeline:'[{"$match":{"active":true}},{"$count":"matching"}]'}) as DocumentResult;assert.equal((aggregate.documents[0] as any).matching.$numberInt,"3");
        await assert.rejects(()=>runMongo(mongo,"aggregate",{database,collection:"records",pipeline:'[{"$out":"written"}]'}),/writes/);assert.deepEqual((await fixture.db(database).listCollections({},{nameOnly:true}).toArray()).map((c)=>c.name),["records"]);
        await assert.rejects(()=>runMongo({...mongo,password:"wrong-public-fixture-password"},"databases",{}),(cause:unknown)=>cause instanceof Error&&!cause.message.includes("wrong-public-fixture-password"));
        // Firestore REST typed values and nested collections.
        for(let i=0;i<5;i++){const path=`${collection}/${i===0?encodeURIComponent("日本語 العربية"):"doc-"+i}`;createdFirestore.push(path);await cloud(path,"PATCH",{fields:{rank:{integerValue:String(i)},active:{booleanValue:i%2===0},big:{integerValue:"9223372036854775807"},text:{stringValue:"Public firestore fixture"},binary:{bytesValue:"AAGA/w=="},timestamp:{timestampValue:"2026-10-19T00:00:00.123456Z"}}});}
        const nested=createdFirestore[0]+"/details/one";createdFirestore.push(nested);await cloud(nested,"PATCH",{fields:{note:{stringValue:"Nested public fixture"}}});
        assert.equal(firestore.token,"");assert.ok((await runFirestore(firestore,"collections",{}) as DocumentNames).names.includes(collection));
        console.log("Mongo fixtures and Firestore collection discovery passed");
        const firestoreFirst=await runFirestore(firestore,"documents",{collection,limit:2}) as DocumentResult;assert.equal(firestoreFirst.documents.length,2);assert.ok(firestoreFirst.nextToken);assert.ok(firestoreFirst.raw.includes('9223372036854775807'));
        console.log("Firestore first document page passed");
        const firestoreSecond=await runFirestore(firestore,"documents",{collection,limit:2,cursor:firestoreFirst.nextToken}) as DocumentResult;assert.equal(firestoreSecond.documents.length,2);
        console.log("Firestore second page passed");
        const parent=decodeURIComponent(createdFirestore[0]);assert.deepEqual((await runFirestore(firestore,"collections",{parentPath:parent}) as DocumentNames).names,["details"]);
        console.log("Firestore subcollection discovery passed");
        const firestoreGet=await runFirestore(firestore,"get",{documentPath:parent}) as DocumentResult;assert.equal((firestoreGet.documents[0] as any).fields.big.integerValue,"9223372036854775807");
        console.log("Firestore get passed");
        const filtered=await runFirestore(firestore,"query",{collection,options:'{"where":{"fieldFilter":{"field":{"fieldPath":"active"},"op":"EQUAL","value":{"booleanValue":true}}}}',limit:10}) as DocumentResult;assert.equal(filtered.documents.length,3);
        // Elasticsearch raw response retains numeric literals that browser Number would round.
        await es(index,"PUT",{settings:{number_of_shards:1,number_of_replicas:0},mappings:{properties:{rank:{type:"integer"},big:{type:"long"},name:{type:"keyword"},active:{type:"boolean"}}}});
        for(let i=0;i<5;i++)await es(`${index}/_doc/${i}?refresh=true`,"PUT",`{"rank":${i},"big":9223372036854775807,"active":${i%2===0},"name":"日本語 العربية"}`);
        assert.ok((await runElasticsearch(elastic,"indices",{pattern:index}) as DocumentNames).names.includes(index));
        const mapping=await runElasticsearch(elastic,"mapping",{index}) as DocumentResult;assert.ok(mapping.raw.includes('"long"'));
        const search=await runElasticsearch(elastic,"search",{index,query:'{"query":{"term":{"active":true}},"sort":[{"rank":"asc"}]}',limit:2}) as DocumentResult;assert.equal(search.documents.length,2);assert.equal((search.documents[0] as any)._source.big,"9223372036854775807");assert.ok(search.raw.includes('"big":9223372036854775807'));assert.ok((search.convertedNumbers??0)>=2);
        const searchNext=await runElasticsearch(elastic,"search",{index,query:'{"query":{"term":{"active":true}},"sort":[{"rank":"asc"}]}',limit:2,offset:search.nextOffset}) as DocumentResult;assert.equal(searchNext.documents.length,1);
        const exact=await runElasticsearch(elastic,"search",{index,query:'{"query":{"term":{"big":9223372036854775807}}}',limit:10}) as DocumentResult;assert.equal(exact.documents.length,5);
        const get=await runElasticsearch(elastic,"get",{index,documentId:"0"}) as DocumentResult;assert.equal((get.documents[0] as any)._source.big,"9223372036854775807");
        await assert.rejects(()=>runElasticsearch(elastic,"search",{index,query:'{"query":{"script":{"script":"return true"}}}'}),/scripts/);
        console.log("Real MongoDB BSON/find/aggregate/paging/auth, Firestore typed documents/subcollections/query/paging and Elasticsearch mapping/search/exact-long/raw export fixtures passed.");
        // Stable public fixtures for the production browser, separate from test cleanup.
        await fixture.db("expansion_public_fixture").collection<{_id:string;name:string;big:BSON.Long}>("records").replaceOne({_id:"browser-public"},{name:"Public MongoDB fixture",big:BSON.Long.fromString("9223372036854775807")},{upsert:true});
        await cloud("browser_public_fixture/one","PATCH",{fields:{name:{stringValue:"Public Firestore fixture"},big:{integerValue:"9223372036854775807"}}});
        await es("expansion-public-fixture","PUT",{settings:{number_of_replicas:0}}).catch(()=>{});await es("expansion-public-fixture/_doc/one?refresh=true","PUT",'{"name":"Public Elasticsearch fixture","big":9223372036854775807}');
    }finally{
        await fixture.db(database).dropDatabase().catch(()=>{});await fixture.close();
        for(const path of createdFirestore.reverse())await cloud(path,"DELETE");
        await es(index,"DELETE").catch(()=>{});
    }
}
main().catch((cause)=>{console.error(cause);process.exitCode=1;});
