import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { S3Client,PutObjectCommand,DeleteObjectCommand,HeadObjectCommand } from "@aws-sdk/client-s3";
import { parseS3Connection,runS3,type S3BucketPage,type S3ObjectPage,type S3Download,type S3ObjectInfo } from "../src/lib/s3-connector";
async function main(){
    const port=Number(process.env.EXPANSION_S3_PORT);if(!port)throw new Error("Set EXPANSION_S3_PORT to the owned Garage fixture port.");
    const config=parseS3Connection({endpoint:`http://127.0.0.1:${port}`,region:"garage",accessKeyId:"GK11111111111111111111111111111111",secretAccessKey:"2222222222222222222222222222222222222222222222222222222222222222",sessionToken:"",forcePathStyle:true,allowHttp:true});
    const bucket="expansion-public-fixture",prefix=`integration-${randomUUID()}/`,created=new Set<string>();
    const fixture=new S3Client({endpoint:config.endpoint,region:config.region,credentials:{accessKeyId:config.accessKeyId,secretAccessKey:config.secretAccessKey},forcePathStyle:true,maxAttempts:1,requestChecksumCalculation:"WHEN_REQUIRED",responseChecksumValidation:"WHEN_REQUIRED"});
    const put=async(key:string,bytes:Buffer)=>{created.add(key);await fixture.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:bytes,ContentLength:bytes.length}));};
    try{
        const buckets=await runS3(config,"buckets",{}) as S3BucketPage;assert.ok(buckets.buckets.some((row)=>row.name===bucket));
        const key=prefix+'folder/日本語 العربية "&?.bin',bytes=Buffer.from([0,1,128,255,10,13]);created.add(key);
        const upload=await runS3(config,"upload",{bucket,key,base64:bytes.toString("base64"),contentType:"application/octet-stream",write:true}) as {bytes:number;createdOnly:boolean};assert.equal(upload.bytes,bytes.length);assert.equal(upload.createdOnly,true);
        const list=await runS3(config,"objects",{bucket,prefix,cursor:""}) as S3ObjectPage;assert.ok(list.folders.includes(prefix+"folder/"));
        const nested=await runS3(config,"objects",{bucket,prefix:prefix+"folder/",cursor:""}) as S3ObjectPage;assert.ok(nested.objects.some((row)=>row.key===key));
        const info=await runS3(config,"info",{bucket,key}) as S3ObjectInfo;assert.equal(info.size,String(bytes.length));assert.equal(info.contentType,"application/octet-stream");
        const download=await runS3(config,"download",{bucket,key}) as S3Download;assert.deepEqual(Buffer.from(download.base64,"base64"),bytes);
        await assert.rejects(()=>runS3(config,"upload",{bucket,key,base64:"YQ==",write:true}),/already exists/);
        const overwritten=await runS3(config,"upload",{bucket,key,base64:"cmVwbGFjZWQ=",write:true,overwrite:true}) as {bytes:number};assert.equal(overwritten.bytes,8);
        assert.equal(Buffer.from((await runS3(config,"download",{bucket,key}) as S3Download).base64,"base64").toString(),"replaced");
        const raceKey=prefix+"race";created.add(raceKey);
        const race=await Promise.allSettled([runS3(config,"upload",{bucket,key:raceKey,base64:"YQ==",write:true}),runS3(config,"upload",{bucket,key:raceKey,base64:"Yg==",write:true})]);assert.equal(race.filter((item)=>item.status==="fulfilled").length,1,"Create-only condition must prevent concurrent replacement");
        const maximum=Buffer.alloc(8*1024*1024,0xa5),maxKey=prefix+"maximum.bin";created.add(maxKey);await runS3(config,"upload",{bucket,key:maxKey,base64:maximum.toString("base64"),write:true});assert.deepEqual(Buffer.from((await runS3(config,"download",{bucket,key:maxKey}) as S3Download).base64,"base64"),maximum);
        const largeKey=prefix+"too-large.bin";await put(largeKey,Buffer.alloc(8*1024*1024+1));assert.equal((await runS3(config,"info",{bucket,key:largeKey}) as S3ObjectInfo).size,String(8*1024*1024+1));await assert.rejects(()=>runS3(config,"download",{bucket,key:largeKey}),/size limit/);
        // Seed more than one provider page independently, then exercise connector cursors.
        for(let start=0;start<103;start+=10)await Promise.all(Array.from({length:Math.min(10,103-start)},(_,i)=>put(prefix+`pages/${String(start+i).padStart(3,"0")}`,Buffer.from("public fixture"))));
        const first=await runS3(config,"objects",{bucket,prefix:prefix+"pages/",cursor:""}) as S3ObjectPage;assert.equal(first.objects.length,100);assert.ok(first.nextToken);const second=await runS3(config,"objects",{bucket,prefix:prefix+"pages/",cursor:first.nextToken}) as S3ObjectPage;assert.equal(second.objects.length,3);assert.equal(new Set([...first.objects,...second.objects].map((item)=>item.key)).size,103);
        await assert.rejects(()=>runS3(config,"delete",{bucket,key,write:true,confirmKey:"wrong"}),/complete object key/);assert.ok(await fixture.send(new HeadObjectCommand({Bucket:bucket,Key:key})));
        await runS3(config,"delete",{bucket,key,write:true,confirmKey:key});created.delete(key);await assert.rejects(()=>runS3(config,"info",{bucket,key}));
        await assert.rejects(()=>runS3({...config,secretAccessKey:"public-fixture-wrong-secret"},"buckets",{}),(cause:unknown)=>cause instanceof Error&&!cause.message.includes("public-fixture-wrong-secret"));
        // Leave only explicitly named public UI fixtures for the production browser check.
        await fixture.send(new PutObjectCommand({Bucket:bucket,Key:"browser-public-fixture/readme.txt",Body:"Public storage browser fixture — 日本語 العربية",ContentType:"text/plain; charset=utf-8"}));
        console.log("Real Garage buckets/prefixes, Unicode/binary transfers, metadata, pagination, create-only races, overwrite, 8 MiB boundary, delete gates and credential-error fixtures passed.");
    }finally{for(const key of created)await fixture.send(new DeleteObjectCommand({Bucket:bucket,Key:key}));fixture.destroy();}
}
main().catch((cause)=>{console.error(cause);process.exitCode=1;});
