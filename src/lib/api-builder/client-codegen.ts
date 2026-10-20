export type ExtraCodeTarget = "php" | "ruby" | "csharp";
export interface ClientCodeRequest { url: string; method: string; headers: Record<string, string>; body: string | [string, string][] | null }
function phpString(value: string): string {
    const parts = value.match(/[^\x00-\x1f\x7f]+|[\x00-\x1f\x7f]/g) ?? [];
    return parts.map((part) => /^[\x00-\x1f\x7f]$/.test(part) ? `chr(${part.charCodeAt(0)})` : `'${part.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`).join(" . ") || "''";
}
const rubyString = (value: string) => JSON.stringify(value).replace(/#/g, "\\#");
const csharpString = (value: string) => JSON.stringify(value).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
export function prepareCodeRequest(request: ClientCodeRequest): ClientCodeRequest & { body: string | null } {
    const url = new URL(request.url);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("Use an HTTP(S) URL without embedded credentials.");
    if (!/^[!#$%&'*+.^_`|~\dA-Za-z-]+$/.test(request.method)) throw new Error("Invalid HTTP method.");
    const headers: Record<string, string> = {};
    for (const [name, value] of Object.entries(request.headers)) {
        if (!/^[!#$%&'*+.^_`|~\dA-Za-z-]+$/.test(name) || /[\r\n\0]/.test(value)) throw new Error("Header names must be HTTP tokens and values cannot contain CR, LF or NUL.");
        if (!["content-length", "transfer-encoding"].includes(name.toLowerCase())) headers[name] = value;
    }
    let body: string | null = typeof request.body === "string" || request.body === null ? request.body : null;
    if (Array.isArray(request.body)) {
        let boundary = "----mydevtools-code-sample";
        for (let index = 0; request.body.some(([key, value]) => key.includes(boundary) || value.includes(boundary)); index++) { if (index >= 100) throw new Error("Choose form values without the generated multipart boundary."); boundary += "-"; }
        const fieldName = (value: string) => value.replace(/\r\n|\r|\n/g, "%0D%0A").replace(/"/g, "%22");
        body = request.body.map(([key, value]) => `--${boundary}\r\nContent-Disposition: form-data; name="${fieldName(key)}"\r\n\r\n${value.replace(/\r\n|\r|\n/g, "\r\n")}\r\n`).join("") + `--${boundary}--\r\n`;
        for (const name of Object.keys(headers)) if (name.toLowerCase() === "content-type") delete headers[name];
        headers["Content-Type"] = `multipart/form-data; boundary=${boundary}`;
    }
    if (body !== null && ["GET", "HEAD"].includes(request.method.toUpperCase())) throw new Error("These samples do not attach a body to GET or HEAD.");
    return { url: url.toString(), method: request.method, headers, body };
}
export function generateExtraClientCode(target: ExtraCodeTarget, request: ClientCodeRequest): string {
    const input = prepareCodeRequest(request), entries = Object.entries(input.headers);
    if (target === "php") return `<?php
// PHP with cURL. Resolved headers/body may contain credentials.
// The HTTP client calculates framing; redirects are not followed.
$client = curl_init();
curl_setopt_array($client, [
    CURLOPT_URL => ${phpString(input.url)},
    CURLOPT_CUSTOMREQUEST => ${phpString(input.method)},
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_HTTPHEADER => [${entries.map(([name, value]) => "\n        " + phpString(`${name}: ${value}`)).join(",")}${entries.length ? "\n    " : ""}],${input.body !== null ? `
    CURLOPT_POSTFIELDS => ${phpString(input.body)},` : ""}
]);
$body = curl_exec($client);
if ($body === false) { throw new RuntimeException(curl_error($client)); }
echo curl_getinfo($client, CURLINFO_RESPONSE_CODE), PHP_EOL, $body;
unset($client);
`;
    if (target === "ruby") return `require 'net/http'
require 'uri'
require 'openssl'

# Ruby standard library. Resolved values may contain credentials.
uri = URI(${rubyString(input.url)})
headers = {${entries.map(([name, value]) => "\n  " + rubyString(name) + " => " + rubyString(value)).join(",")}${entries.length ? "\n" : ""}}
request = Net::HTTPGenericRequest.new(${rubyString(input.method)}, ${input.body !== null}, ${input.method.toUpperCase() !== "HEAD"}, uri.request_uri, headers)
${input.body !== null ? `request.body = ${rubyString(input.body)}\n` : ""}http = Net::HTTP.new(uri.host, uri.port, nil)
http.use_ssl = uri.scheme == 'https'
http.verify_mode = OpenSSL::SSL::VERIFY_PEER
http.open_timeout = 15
http.read_timeout = 15
response = http.request(request)
puts response.code
puts response.body
`;
    return `using System;
using System.Net.Http;
using System.Text;

// C# top-level program (.NET 8+). Resolved values may contain credentials.
using var handler = new HttpClientHandler { AllowAutoRedirect = false };
using var client = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(15) };
using var request = new HttpRequestMessage(new HttpMethod(${csharpString(input.method)}), ${csharpString(input.url)});
${input.body !== null ? `request.Content = new ByteArrayContent(Encoding.UTF8.GetBytes(${csharpString(input.body)}));\n` : ""}${entries.map(([name, value]) => `if (!request.Headers.TryAddWithoutValidation(${csharpString(name)}, ${csharpString(value)}))
{
    request.Content ??= new ByteArrayContent(Array.Empty<byte>());
    if (!request.Content.Headers.TryAddWithoutValidation(${csharpString(name)}, ${csharpString(value)}))
        throw new InvalidOperationException("Unsupported header: " + ${csharpString(name)});
}`).join("\n")}
using var response = await client.SendAsync(request);
Console.WriteLine((int)response.StatusCode);
Console.WriteLine(await response.Content.ReadAsStringAsync());
`;
}
