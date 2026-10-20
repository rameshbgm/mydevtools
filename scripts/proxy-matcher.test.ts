import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
// Next's test helpers expect the global provided by its server bootstrap.
Object.assign(globalThis,{AsyncLocalStorage});
async function main(){
    // This installed Next build still exports the middleware-named test helper.
    const { unstable_doesMiddlewareMatch }=await import("next/experimental/testing/server"),{config}=await import("../src/proxy");
    for(const url of ["/api","/api/local-connectors","/api/proxy","/api/webhook","/_next/static/public.js","/icons/favicon-32.png"])assert.equal(unstable_doesMiddlewareMatch({config,nextConfig:{},url}),false,url);
    for(const url of ["/","/api-and-web-services/s3-browser","/api-and-web-services/sql-client","/tools/s3-browser","/wrong-category/s3-browser","/release-notes"])assert.equal(unstable_doesMiddlewareMatch({config,nextConfig:{},url}),true,url);
    console.log("Proxy excludes API body cloning while preserving canonical API-category tools, redirects and page matching.");
}
main().catch((cause)=>{console.error(cause);process.exitCode=1;});
