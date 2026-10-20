import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { parse } from "yaml";
import { COMPOSE_TEMPLATES, generateCompose, parseComposeEnvironment, serviceFromTemplate } from "../src/lib/compose-generator";
const services = COMPOSE_TEMPLATES.map((template) => serviceFromTemplate(template,template.id));
const result = generateCompose("public-fixture",services), document = parse(result.yaml);
assert.equal(Object.keys(document.services).length,12);
assert.equal(document.services.postgres.volumes[0].target,"/var/lib/postgresql");
for (const service of Object.values(document.services) as any[]) for (const port of service.ports ?? []) assert.equal(port.host_ip,"127.0.0.1");
assert.equal(document.services.redis.command[0],"redis-server"); assert.ok(document.services.redis.command.includes("--requirepass"));
assert.ok(result.requiredVariables.includes("POSTGRES_PASSWORD")); assert.ok(result.requiredVariables.includes("REDIS_PASSWORD")); assert.ok(result.requiredVariables.includes("NATS_TOKEN"));
assert.ok(result.envExample.includes("MYSQL_ROOT_PASSWORD=CHANGE_ME")); assert.ok(!result.yaml.includes("version:"));
assert.deepEqual({...parseComposeEnvironment('A=a=b\nB=日本語 # literal\n# comment\nC="literal quotes"')},{A:"a=b",B:"日本語 # literal",C:'"literal quotes"'});
assert.equal(parseComposeEnvironment("__proto__=safe")["__proto__"],"safe");
assert.throws(() => parseComposeEnvironment("A=1\nA=2"),/Duplicate/); assert.throws(() => parseComposeEnvironment("wrong line"),/KEY=value/);
const duplicate = structuredClone(services.slice(0,2)); duplicate[1].ports[0].published=5432; assert.throws(() => generateCompose("fixture",duplicate),/collision/);
const cycle = structuredClone(services.slice(0,2)); cycle[0].dependsOn=[cycle[1].name];cycle[1].dependsOn=[cycle[0].name];assert.throws(() => generateCompose("fixture",cycle),/cycle/);
const unknown = structuredClone(services.slice(0,1));unknown[0].dependsOn=["missing"];assert.throws(() => generateCompose("fixture",unknown),/unknown dependency/);
const linked = structuredClone(services.slice(0,2));linked[1].dependsOn=[linked[0].name];assert.deepEqual(parse(generateCompose("fixture",linked).yaml).services.mysql.depends_on,["postgres"]);
const traversal = structuredClone(services.slice(0,1));traversal[0].volumes[0].target="/data/../host";assert.throws(() => generateCompose("fixture",traversal),/mount paths/);
const shared = structuredClone(services.slice(0,2));shared[1].volumes[0].name=shared[0].volumes[0].name;assert.ok(generateCompose("fixture",shared).warnings.some((warning) => warning.includes("shared")));
assert.throws(() => generateCompose("bad name",services),/Project name/);assert.throws(() => generateCompose("fixture",[]),/1–20/);
const invalidCommand=structuredClone(services.slice(0,1));invalidCommand[0].command='"shell string"';assert.throws(() => generateCompose("fixture",invalidCommand),/JSON array/);
if (process.env.EXPANSION_COMPOSE === "true") {
    const directory=mkdtempSync(join(tmpdir(),"mydevtools-compose-fixture-"));
    try {
        const file=join(directory,"compose.yaml");writeFileSync(file,result.yaml);
        const environment={...process.env,...Object.fromEntries(result.requiredVariables.map((key)=>[key,"public-fixture-value-only"]))};
        const config=spawnSync("docker",["compose","--project-directory",directory,"-f",file,"config","--quiet"],{env:environment,encoding:"utf8",timeout:30000});
        assert.equal(config.status,0,config.stderr);
        // Each starter must also validate independently, without the other services.
        for (const service of services) {writeFileSync(file,generateCompose("fixture",[service]).yaml);const individual=spawnSync("docker",["compose","--project-directory",directory,"-f",file,"config","--quiet"],{env:environment,encoding:"utf8",timeout:30000});assert.equal(individual.status,0,`${service.name}: ${individual.stderr}`);}
        console.log("Docker Compose independently validated the full 12-service stack and every standalone starter.");
    } finally {rmSync(directory,{recursive:true,force:true});}
}
console.log("Compose YAML/required environment, loopback bindings, dependency cycles, port conflicts, mounts and literal-value fixtures passed.");
