// Postman Collection v2.1 import/export.
//
// Spec: https://schema.postman.com/json/collection/v2.1.0/collection.json
//
// We import a flat list of requests; nested folders are flattened with their
// path prepended to the request name (e.g. "Auth / Login"). On export we emit
// a single top-level item array. Supported text form and GraphQL bodies retain
// their fields. Scripts, file references and inherited auth are not imported.

export interface PostmanRequest {
    id?: string;
    name: string;
    method: string;
    url: string;
    headers: { key: string; value: string }[];
    queryParams: { key: string; value: string }[];
    body: string;
    bodyMode: "raw" | "urlencoded" | "formdata" | "graphql" | "none";
    formData?: { key: string; value: string }[];
    graphqlQuery?: string;
    graphqlVariables?: string;
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
        graphql?: { query?: string; variables?: string };
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
    if (raw.length > 2 * 1024 * 1024) throw new Error("Collection import exceeds 2 MiB.");
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
    if (path.length > 20 || items.length > 500) throw new Error("Collection nesting or item limit exceeded.");
    for (const it of items) {
        if (!it || typeof it !== "object") throw new Error("Invalid collection item.");
        if (it.item) {
            if (!Array.isArray(it.item)) throw new Error("Collection folder items must be an array.");
            walkItems(it.item, [...path, it.name || ""], out);
            continue;
        }
        if (it.request) {
            const name = [...path, it.name || ""].filter(Boolean).join(" / ");
            out.push(convertRequest(name, it.request));
            if (out.length > 500) throw new Error("Import at most 500 requests at a time.");
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
    let formData: PostmanRequest["formData"], graphqlQuery: string | undefined, graphqlVariables: string | undefined;
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
            formData = r.body.urlencoded.filter((field) => !field.disabled).map(({ key, value }) => ({ key, value }));
        } else if (r.body.mode === "formdata" && r.body.formdata) {
            if (r.body.formdata.some((field) => !field.disabled && field.type === "file")) throw new Error("File form fields need to be attached manually; this importer supports text form fields.");
            formData = r.body.formdata.filter((field) => !field.disabled).map(({ key, value }) => ({ key, value }));
            body = "";
            bodyMode = "formdata";
        } else if (r.body.mode === "graphql") {
            graphqlQuery = r.body.graphql?.query ?? ""; graphqlVariables = r.body.graphql?.variables ?? "{}";
            bodyMode = "graphql";
        } else if (r.body.mode === "file") {
            throw new Error("Binary file references must be attached manually.");
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
        formData, graphqlQuery, graphqlVariables,
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
        formData?: { key: string; value: string; enabled: boolean }[];
        graphqlQuery?: string;
        graphqlVariables?: string;
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
                body: bodyForExport(r.body, r.bodyType, r.formData, r.graphqlQuery, r.graphqlVariables),
            },
        })),
    };
    return JSON.stringify(collection, null, 2);
}

function bodyForExport(body: string, type: string, fields?: { key: string; value: string; enabled: boolean }[], query?: string, variables?: string): PostmanRequestDef["body"] | undefined {
    if (type === "form-data" || type === "x-www-form-urlencoded") {
        const form = fields?.filter((field) => field.enabled).map(({ key, value }) => ({ key, value })) ?? [...new URLSearchParams(body)].map(([key, value]) => ({ key, value }));
        return type === "form-data" ? { mode: "formdata", formdata: form.map((field) => ({ ...field, type: "text" })) } : { mode: "urlencoded", urlencoded: form };
    }
    if (type === "graphql") return { mode: "graphql", graphql: { query: query ?? body, variables: variables ?? "{}" } };
    if (!body) return undefined;
    if (type === "json") return { mode: "raw", raw: body, options: { raw: { language: "json" } } };
    if (type === "xml") return { mode: "raw", raw: body, options: { raw: { language: "xml" } } };
    if (type === "text") return { mode: "raw", raw: body, options: { raw: { language: "text" } } };
    if (type === "x-www-form-urlencoded") return { mode: "raw", raw: body };
    return { mode: "raw", raw: body };
}
