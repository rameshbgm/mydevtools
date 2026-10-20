import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { generateExtraClientCode, prepareCodeRequest, type ClientCodeRequest } from "../src/lib/api-builder/client-codegen";
const run = promisify(execFile);
async function main() {
    const directory = await mkdtemp(join(tmpdir(), "mydevtools-csharp-"));
    try {
        await writeFile(join(directory, "Fixture.csproj"), '<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable></PropertyGroup></Project>');
        await writeFile(join(directory, "NuGet.Config"), '<configuration><packageSources><clear /></packageSources></configuration>');
        for (const body of ['日本語 العربية \' " \\ $ #{literal}\n\0 end', [["same", "one"], ["same", 'two\nquotes " العربية']] as [string, string][]]) {
            const request: ClientCodeRequest = { url: "http://127.0.0.1:38129/fixture?q=space%20value", method: "PATCH", headers: { "Content-Type": "application/json", "X-Fixture": 'quote \' " \\ $ #{literal}', "Content-Length": "999999" }, body };
            const server = `using var listener = new System.Net.HttpListener();
listener.Prefixes.Add("http://127.0.0.1:38129/");
listener.Start();
var fixtureTask = System.Threading.Tasks.Task.Run(async () => {
    var incoming = await listener.GetContextAsync();
    using var reader = new System.IO.StreamReader(incoming.Request.InputStream, Encoding.UTF8);
    var raw = await reader.ReadToEndAsync();
    var json = System.Text.Json.JsonSerializer.Serialize(new { method = incoming.Request.HttpMethod, url = incoming.Request.RawUrl, header = incoming.Request.Headers["X-Fixture"], contentType = incoming.Request.ContentType, body = raw });
    var bytes = Encoding.UTF8.GetBytes(json);
    incoming.Response.ContentType = "application/json";
    incoming.Response.ContentLength64 = bytes.Length;
    await incoming.Response.OutputStream.WriteAsync(bytes);
    incoming.Response.Close();
    listener.Stop();
});
`;
            const code = generateExtraClientCode("csharp", request).replace("using var handler =", server + "\nusing var handler =") + "\nawait fixtureTask;\n";
            await writeFile(join(directory, "Program.cs"), code);
            const output = await run("docker", ["run", "--rm", "--network", "none", "--label", "com.mydevtools.expansion=true", "-e", "DOTNET_CLI_TELEMETRY_OPTOUT=1", "-e", "DOTNET_NOLOGO=1", "-e", "DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1", "-v", `${directory}:/work`, "-w", "/work", "mcr.microsoft.com/dotnet/sdk:10.0", "dotnet", "run", "--configuration", "Release", "--verbosity", "quiet"], { timeout: 90_000, maxBuffer: 2 * 1024 * 1024 });
            const match = /(?:^|\n)200\r?\n([^\n]+)\s*$/.exec(output.stdout); assert.ok(match, output.stdout + output.stderr);
            const result = JSON.parse(match[1]), expected = prepareCodeRequest(request);
            assert.equal(result.method, "PATCH"); assert.equal(result.url, "/fixture?q=space%20value"); assert.equal(result.header, request.headers["X-Fixture"]); assert.equal(result.contentType, expected.headers["Content-Type"]); assert.equal(result.body, expected.body);
        }
        console.log("Generated C# compiled and executed raw/multipart HTTP fixtures in an isolated .NET 10 container without external networking; Unicode/control/quote escaping and duplicate fields passed.");
    } finally { await rm(directory, { recursive: true, force: true }); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
