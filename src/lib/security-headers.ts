export type SecurityFinding = {
    severity: "high" | "medium" | "low" | "info";
    title: string;
    detail: string;
};

export function parseResponseHeaders(input: string): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const line of input.split(/\r?\n/)) {
        const index = line.indexOf(":");
        if (index < 1) continue;
        headers[line.slice(0, index).trim().toLowerCase()] = line.slice(index + 1).trim();
    }
    return headers;
}

export function analyseSecurityHeaders(input: string): SecurityFinding[] {
    const headers = parseResponseHeaders(input);
    const csp = headers["content-security-policy"];
    const findings: SecurityFinding[] = [];
    if (!csp) findings.push({ severity: "high", title: "Content-Security-Policy is missing", detail: "Start with a report-only policy, then enforce a policy tailored to your application." });
    else {
        const lower = csp.toLowerCase();
        if (lower.includes("'unsafe-inline'")) findings.push({ severity: "high", title: "CSP permits inline code", detail: "Replace unsafe-inline with nonces or hashes where possible." });
        if (lower.includes("'unsafe-eval'")) findings.push({ severity: "medium", title: "CSP permits eval-like code", detail: "Remove unsafe-eval unless a verified dependency requires it." });
        if (!/\bobject-src\b/.test(lower)) findings.push({ severity: "medium", title: "CSP does not set object-src", detail: "Use `object-src 'none'` unless plugins are required." });
        if (!/\bframe-ancestors\b/.test(lower)) findings.push({ severity: "medium", title: "CSP does not set frame-ancestors", detail: "Use frame-ancestors to control who can embed the page." });
    }
    if (!headers["strict-transport-security"]) findings.push({ severity: "medium", title: "HSTS is missing", detail: "On HTTPS sites, consider Strict-Transport-Security after verifying all subdomains." });
    if (headers["x-content-type-options"]?.toLowerCase() !== "nosniff") findings.push({ severity: "low", title: "X-Content-Type-Options: nosniff is missing", detail: "Prevent content type sniffing for script and style responses." });
    if (!headers["referrer-policy"]) findings.push({ severity: "low", title: "Referrer-Policy is missing", detail: "Use strict-origin-when-cross-origin or a stricter policy where appropriate." });
    if (!headers["permissions-policy"]) findings.push({ severity: "low", title: "Permissions-Policy is missing", detail: "Explicitly restrict sensitive browser capabilities that your site does not use." });
    if (!findings.length) findings.push({ severity: "info", title: "No common header gaps detected", detail: "Review the policy against your application’s real resource and embedding requirements before deploying." });
    return findings;
}
