const SENSITIVE_KEY = /^(authorization|proxy-authorization|cookie|set-cookie|password|passwd|secret|client.?secret|access.?token|refresh.?token|id.?token|api.?key|x-api-key|private.?key|passphrase|proxy.?session.?token|ssl.?client.?key|client.?key|token)$/i;
const SENSITIVE_ENV_KEY = /(?:^|[_-])(?:secret|password|passwd|api[_-]?key|access[_-]?token|refresh[_-]?token|private[_-]?key|session[_-]?token|token)(?:$|[_-])/i;
const isSensitiveKey = (key: string) => SENSITIVE_KEY.test(key) || SENSITIVE_ENV_KEY.test(key);
export const REDACTED = "[REDACTED]";

/** Preserve structure and variable placeholders, remove credentials from portable exports. */
export function redactSecrets(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(redactSecrets);
    if (value && typeof value === "object") {
        const record = value as Record<string, unknown>;
        // Header/environment editor rows have a name/key plus a value.
        const namedSecret = isSensitiveKey(String(record.key ?? record.name ?? ""));
        return Object.fromEntries(Object.entries(record).map(([key, item]) => [key,
            (isSensitiveKey(key) || (key === "value" && namedSecret)) && item
                ? REDACTED : redactSecrets(item),
        ]));
    }
    if (typeof value === "string") {
        if (/-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/.test(value)) return REDACTED;
        if (/^\s*[\[{]/.test(value)) {
            try { return JSON.stringify(redactSecrets(JSON.parse(value))); } catch { /* May be plain log text. */ }
        }
        if (/^https?:\/\//i.test(value)) {
            try {
                const url = new URL(value);
                if (url.username) url.username = REDACTED;
                if (url.password) url.password = REDACTED;
                for (const key of [...url.searchParams.keys()]) if (isSensitiveKey(key)) url.searchParams.set(key, REDACTED);
                return url.toString();
            } catch { /* Retain non-URL text. */ }
        }
        return value.replace(/\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi, `Bearer ${REDACTED}`);
    }
    return value;
}

/** Local HAR/JSON and log sanitization, with an explicit preview before export. */
export function redactDocument(input: string, extraFields: string[] = []): string {
    const custom = new Set(extraFields.map((field) => field.trim().toLowerCase()).filter(Boolean));
    const walk = (value: unknown): unknown => {
        if (Array.isArray(value)) return value.map(walk);
        if (value && typeof value === "object") {
            const record = value as Record<string, unknown>;
            const secretRow = custom.has(String(record.name ?? record.key ?? "").toLowerCase());
            return Object.fromEntries(Object.entries(record).map(([key, item]) => [key, custom.has(key.toLowerCase()) || (secretRow && key === "value") ? REDACTED : walk(item)]));
        }
        if (typeof value === "string" && /^\s*[\[{]/.test(value)) {
            try { return JSON.stringify(walk(JSON.parse(value))); } catch { /* Plain text. */ }
        }
        return value;
    };
    try { return JSON.stringify(walk(redactSecrets(JSON.parse(input))), null, 2); }
    catch {
        const fields = ["authorization", "proxy-authorization", "cookie", "set-cookie", "password", "secret", "api[_-]?key", "access[_-]?token", "refresh[_-]?token", ...[...custom].map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))];
        const pattern = new RegExp(`(\\b(?:${fields.join("|")})\\s*[:=]\\s*)(?:"[^"\\r\\n]*"|'[^'\\r\\n]*'|[^\\r\\n,;]+)`, "gi");
        return input.replace(pattern, `$1${REDACTED}`)
            .replace(/\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi, `Bearer ${REDACTED}`)
            .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, REDACTED);
    }
}
