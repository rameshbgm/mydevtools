// Postman Collection v2.1 import/export.
//
// Spec: https://schema.postman.com/json/collection/v2.1.0/collection.json
//
// We import a flat list of requests; nested folders are flattened with their
// path prepended to the request name (e.g. "Auth / Login"). On export we emit
// a single top-level item array — round-trips of our own exports are lossless.

export interface PostmanRequest {
    id?: string;
    name: string;
    method: string;
    url: string;
    headers: { key: string; value: string }[];
    queryParams: { key: string; value: string }[];
    body: string;
    bodyMode: "raw" | "urlencoded" | "formdata" | "none";
    rawLanguage?: "json" | "xml" | "text" | "html" | "javascript";
}

interface PostmanItem {
    name?: string;
    item?: PostmanItem[];          // folder
    request?: PostmanRequestDef;   // request
}

interface PostmanRequestDef {
    method?: string;
    header?: { key: string; value: string; disabled?: boolean }[];
    body?: {
        mode?: "raw" | "urlencoded" | "formdata" | "file" | "graphql";
        raw?: string;
        urlencoded?: { key: string; value: string; disabled?: boolean }[];
        formdata?: { key: string; value: string; type?: string; disabled?: boolean }[];
        options?: { raw?: { language?: string } };
    };
    url?: string | {
        raw?: string;
        protocol?: string;
        host?: string[] | string;
        path?: string[] | string;
        query?: { key: string; value: string; disabled?: boolean }[];
    };
}

interface PostmanCollection {
    info: { name: string; schema: string; _postman_id?: string };
    item: PostmanItem[];
}

export function parsePostmanCollection(raw: string): PostmanRequest[] {
    let parsed: unknown;
    try { parsed = JSON.parse(raw); }
    catch { throw new Error("Invalid JSON — paste a Postman Collection v2.x export"); }
    if (!parsed || typeof parsed !== "object") throw new Error("Not a Postman collection");
    const col = parsed as PostmanCollection;
    if (!col.item || !Array.isArray(col.item)) throw new Error("Missing or invalid 'item' array");
    const out: PostmanRequest[] = [];
    walkItems(col.item, [], out);
    return out;
}

function walkItems(items: PostmanItem[], path: string[], out: PostmanRequest[]) {
    for (const it of items) {
        if (it.item) {
            walkItems(it.item, [...path, it.name || ""], out);
            continue;
        }
        if (it.request) {
            const name = [...path, it.name || ""].filter(Boolean).join(" / ");
            out.push(convertRequest(name, it.request));
        }
    }
}

function convertRequest(name: string, r: PostmanRequestDef): PostmanRequest {
    const headers = (r.header || [])
        .filter((h) => !h.disabled)
        .map((h) => ({ key: h.key, value: h.value }));

    let urlStr = "";
    let queryParams: { key: string; value: string }[] = [];
    if (typeof r.url === "string") {
        urlStr = r.url;
    } else if (r.url) {
        urlStr = r.url.raw || "";
        queryParams = (r.url.query || []).filter((q) => !q.disabled).map((q) => ({ key: q.key, value: q.value }));
    }
    // strip query from urlStr if it's already broken out
    if (queryParams.length > 0 && urlStr.includes("?")) {
        urlStr = urlStr.split("?")[0];
    }

    let body = "";
    let bodyMode: PostmanRequest["bodyMode"] = "none";
    let rawLanguage: PostmanRequest["rawLanguage"] | undefined;
    if (r.body) {
        if (r.body.mode === "raw" && r.body.raw) {
            body = r.body.raw;
            bodyMode = "raw";
            const lang = r.body.options?.raw?.language;
            if (lang === "json" || lang === "xml" || lang === "text" || lang === "html" || lang === "javascript") {
                rawLanguage = lang;
            }
        } else if (r.body.mode === "urlencoded" && r.body.urlencoded) {
            body = r.body.urlencoded
                .filter((p) => !p.disabled)
                .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
                .join("&");
            bodyMode = "urlencoded";
        } else if (r.body.mode === "formdata" && r.body.formdata) {
            // we keep formdata as urlencoded-style key=value pairs for the importer to map
            body = r.body.formdata
                .filter((p) => !p.disabled)
                .map((p) => `${p.key}=${p.value}`)
                .join("\n");
            bodyMode = "formdata";
        } else if (r.body.mode === "graphql") {
            // collapsed to raw for now
            body = JSON.stringify(r.body);
            bodyMode = "raw";
            rawLanguage = "json";
        }
    }

    return {
        name,
        method: (r.method || "GET").toUpperCase(),
        url: urlStr,
        headers,
        queryParams,
        body,
        bodyMode,
        rawLanguage,
    };
}

export interface ExportInput {
    name: string;
    requests: {
        name: string;
        method: string;
        url: string;
        headers: { key: string; value: string; enabled: boolean }[];
        queryParams: { key: string; value: string; enabled: boolean }[];
        body: string;
        bodyType: string;
    }[];
}

export function exportPostmanCollection(input: ExportInput): string {
    const collection: PostmanCollection = {
        info: {
            name: input.name || "mydevtools API Request Builder export",
            schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        item: input.requests.map((r) => ({
            name: r.name,
            request: {
                method: r.method,
                header: r.headers.filter((h) => h.enabled).map((h) => ({ key: h.key, value: h.value })),
                url: {
                    raw: r.url,
                    query: r.queryParams.filter((q) => q.enabled).map((q) => ({ key: q.key, value: q.value })),
                },
                body: bodyForExport(r.body, r.bodyType),
            },
        })),
    };
    return JSON.stringify(collection, null, 2);
}

function bodyForExport(body: string, type: string): PostmanRequestDef["body"] | undefined {
    if (!body) return undefined;
    if (type === "json") return { mode: "raw", raw: body, options: { raw: { language: "json" } } };
    if (type === "xml") return { mode: "raw", raw: body, options: { raw: { language: "xml" } } };
    if (type === "text") return { mode: "raw", raw: body, options: { raw: { language: "text" } } };
    if (type === "x-www-form-urlencoded") return { mode: "raw", raw: body };
    return { mode: "raw", raw: body };
}
