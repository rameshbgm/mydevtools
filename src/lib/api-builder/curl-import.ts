// cURL command parser. Translates a (typically pasted) curl invocation into
// the API Request Builder's form state. Goals:
//   - Tolerate common Postman / browser DevTools / Chrome "copy as cURL" output
//   - Handle line continuations (backslash + newline) and Windows ^ continuations
//   - Recognize the most common flags. Unknown flags are ignored, never throw.

export interface ParsedCurl {
    method: string;
    url: string;
    headers: { key: string; value: string }[];
    body: string | null;
    bodyType: "json" | "text" | "x-www-form-urlencoded" | null;
    queryParams: { key: string; value: string }[];
    basicAuth?: { username: string; password: string };
    cookies?: string;
}

// Tokeniser: respects '..' "..", \-escapes, and backslash-newline line joins.
function tokenize(input: string): string[] {
    const src = input
        .replace(/\\\r?\n/g, " ")      // backslash + newline → space
        .replace(/\^\r?\n/g, " ")      // Windows ^ + newline → space
        .trim();
    const out: string[] = [];
    let i = 0;
    while (i < src.length) {
        const c = src[i];
        if (c === " " || c === "\t" || c === "\n" || c === "\r") { i++; continue; }
        if (c === "'") {
            const end = src.indexOf("'", i + 1);
            if (end === -1) { out.push(src.slice(i + 1)); break; }
            out.push(src.slice(i + 1, end));
            i = end + 1; continue;
        }
        if (c === '"') {
            // double-quote with backslash escapes
            let j = i + 1, buf = "";
            while (j < src.length && src[j] !== '"') {
                if (src[j] === "\\" && j + 1 < src.length) { buf += src[j + 1]; j += 2; continue; }
                buf += src[j]; j++;
            }
            out.push(buf);
            i = j + 1; continue;
        }
        // bare token — read until whitespace or quote
        let j = i;
        while (j < src.length && !/[\s'"]/.test(src[j])) j++;
        out.push(src.slice(i, j));
        i = j;
    }
    return out;
}

export function parseCurl(input: string): ParsedCurl {
    const tokens = tokenize(input.trim());
    if (tokens.length === 0 || (tokens[0] !== "curl" && tokens[0] !== "Invoke-WebRequest")) {
        if (tokens[0] && /^https?:\/\//.test(tokens[0])) {
            // bare URL — treat as a GET
            return { method: "GET", url: tokens[0], headers: [], body: null, bodyType: null, queryParams: [] };
        }
        throw new Error(`Input doesn't look like a curl command (got "${tokens[0] ?? ""}")`);
    }

    let method = "GET";
    let url = "";
    const headers: { key: string; value: string }[] = [];
    let body: string | null = null;
    let bodyType: ParsedCurl["bodyType"] = null;
    let basicAuth: ParsedCurl["basicAuth"];
    let cookies: string | undefined;

    const dataParts: string[] = [];
    let dataIsForm = false;

    for (let i = 1; i < tokens.length; i++) {
        const tok = tokens[i];
        const next = () => tokens[++i];
        const matches = (...flags: string[]) => flags.includes(tok);

        if (matches("-X", "--request")) { method = (next() || "GET").toUpperCase(); continue; }
        if (matches("-H", "--header")) {
            const h = next() || "";
            const colon = h.indexOf(":");
            if (colon > 0) headers.push({ key: h.slice(0, colon).trim(), value: h.slice(colon + 1).trim() });
            continue;
        }
        if (matches("-d", "--data", "--data-raw", "--data-binary", "--data-ascii")) {
            dataParts.push(next() || "");
            continue;
        }
        if (matches("--data-urlencode")) {
            dataParts.push(next() || "");
            dataIsForm = true;
            continue;
        }
        if (matches("-F", "--form")) {
            dataParts.push(next() || "");
            dataIsForm = true;
            continue;
        }
        if (matches("-u", "--user")) {
            const cred = next() || "";
            const i2 = cred.indexOf(":");
            if (i2 >= 0) basicAuth = { username: cred.slice(0, i2), password: cred.slice(i2 + 1) };
            else basicAuth = { username: cred, password: "" };
            continue;
        }
        if (matches("-b", "--cookie")) { cookies = next() || ""; continue; }
        if (matches("-A", "--user-agent")) { headers.push({ key: "User-Agent", value: next() || "" }); continue; }
        if (matches("-e", "--referer")) { headers.push({ key: "Referer", value: next() || "" }); continue; }
        if (matches("--compressed", "-i", "--include", "-s", "--silent", "-v", "--verbose", "-L", "--location", "-k", "--insecure", "-f", "--fail", "-g", "--globoff")) {
            continue; // ignored — proxy handles compression/redirects/SSL/verbosity itself
        }
        if (tok.startsWith("--") || tok.startsWith("-")) {
            // unknown flag — skip the next token if it doesn't look like a flag/URL
            const peek = tokens[i + 1];
            if (peek && !peek.startsWith("-") && !/^https?:\/\//.test(peek)) i++;
            continue;
        }
        if (!url) { url = tok; continue; }
    }

    if (dataParts.length > 0) {
        const joined = dataParts.join("&");
        body = joined;
        if (dataIsForm) {
            bodyType = "x-www-form-urlencoded";
        } else if (/^\s*[{[]/.test(joined)) {
            bodyType = "json";
        } else {
            bodyType = "text";
        }
        if (method === "GET") method = "POST"; // curl flips to POST if data is present without -X
    }

    // split query params out of URL
    let cleanUrl = url;
    const queryParams: { key: string; value: string }[] = [];
    try {
        const u = new URL(url);
        u.searchParams.forEach((v, k) => queryParams.push({ key: k, value: v }));
        u.search = "";
        cleanUrl = u.toString().replace(/\?$/, "");
    } catch {
        // not a parseable URL — return as-is, user can fix
    }

    return { method, url: cleanUrl, headers, body, bodyType, queryParams, basicAuth, cookies };
}
