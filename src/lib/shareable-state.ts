// Shareable URL state.
//
// Each tool decides what part of its state is *meaningful to share* (input,
// key settings) and gets a typed serializer/parser via `defineShareSchema`.
// State is serialised to JSON → deflated → base64url-encoded into the URL
// hash. Hash (not query) so the server never sees the payload — privacy
// matters because users will paste tokens/keys into shared inputs.
//
// Compression keeps long inputs well under URL-length limits (most browsers
// support ≥ 32 KB; we cap at 16 KB raw / ~10 KB compressed for safety).
//
// Schema versioning is mandatory. Old links keep working when fields are
// added; old links *gracefully ignore* when fields are removed.

import { useCallback, useEffect, useRef, useState } from "react";

const HASH_PREFIX = "#s=";
const MAX_PRE_COMPRESSION_BYTES = 16 * 1024;
const MAX_HASH_BYTES = 12 * 1024;

// ──────────────────────────────────────────────────────────────────────
// Browser-native deflate via CompressionStream (Chrome / Edge / Safari / FF).
// Falls back to uncompressed-with-marker when unavailable.
// ──────────────────────────────────────────────────────────────────────

async function deflate(text: string): Promise<Uint8Array> {
    if (typeof CompressionStream === "undefined") return new TextEncoder().encode(text);
    const stream = new Response(new Blob([text]).stream().pipeThrough(new CompressionStream("deflate-raw")));
    return new Uint8Array(await stream.arrayBuffer());
}

async function inflate(bytes: Uint8Array): Promise<string> {
    if (typeof DecompressionStream === "undefined") return new TextDecoder().decode(bytes);
    // Slice produces a plain ArrayBuffer rather than the polymorphic
    // ArrayBufferLike that strict TS rejects as a BlobPart.
    const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    const stream = new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("deflate-raw")));
    return await stream.text();
}

function bytesToBase64Url(b: Uint8Array): string {
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < b.length; i += chunk) bin += String.fromCharCode(...b.subarray(i, i + chunk));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(s: string): Uint8Array {
    const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

// ──────────────────────────────────────────────────────────────────────
// Schema definition — tools declare what they share.
// ──────────────────────────────────────────────────────────────────────

export interface ShareSchema<T> {
    /** Tool id, used to namespace + verify the payload is for this tool. */
    toolId: string;
    /** Bump on breaking schema changes. Old payloads with mismatched version
     *  are ignored rather than mis-applied. */
    version: number;
    /** Drop nothing — just a hook to remove huge / sensitive fields before serialising. */
    sanitize?: (state: T) => Partial<T>;
    /** Reject malformed or stale state before a tool applies it. */
    validate?: (state: unknown) => state is T;
}

/** Encode + write to `location.hash`. Returns the share URL or `null` on overflow. */
export async function buildShareUrl<T>(schema: ShareSchema<T>, state: T): Promise<string | null> {
    const sanitized = schema.sanitize ? schema.sanitize(state) : state;
    const raw = JSON.stringify({ t: schema.toolId, v: schema.version, s: sanitized });
    if (raw.length > MAX_PRE_COMPRESSION_BYTES) return null;
    const bytes = await deflate(raw);
    const b64 = bytesToBase64Url(bytes);
    if (b64.length > MAX_HASH_BYTES) return null;
    const { origin, pathname } = window.location;
    return `${origin}${pathname}${HASH_PREFIX}${b64}`;
}

/** Decode whatever's in the current hash, if it looks like ours. */
export async function readShareState<T>(schema: ShareSchema<T>): Promise<T | null> {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash;
    if (!hash.startsWith(HASH_PREFIX)) return null;
    const b64 = hash.slice(HASH_PREFIX.length);
    if (!b64) return null;
    try {
        const bytes = base64UrlToBytes(b64);
        const text = await inflate(bytes);
        const parsed = JSON.parse(text) as { t: string; v: number; s: unknown };
        if (parsed.t !== schema.toolId) return null;
        if (parsed.v !== schema.version) return null;
        if (schema.validate && !schema.validate(parsed.s)) return null;
        return parsed.s as T;
    } catch {
        return null;
    }
}

export function clearShareHash() {
    if (typeof window === "undefined") return;
    if (!window.location.hash.startsWith(HASH_PREFIX)) return;
    // Replace hash without scrolling.
    history.replaceState(null, "", window.location.pathname + window.location.search);
}

// ──────────────────────────────────────────────────────────────────────
// React hook — read once on mount, hand off to the tool.
// ──────────────────────────────────────────────────────────────────────

export function useShareableState<T>(schema: ShareSchema<T>, onLoad: (state: T) => void): void {
    // Keep the latest onLoad in a ref via an effect so the mount-only loader
    // doesn't capture a stale closure (and we don't violate refs-during-render).
    const cb = useRef(onLoad);
    useEffect(() => { cb.current = onLoad; }, [onLoad]);
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const s = await readShareState(schema);
            if (cancelled) return;
            if (s) {
                cb.current(s);
                clearShareHash();
            }
        })();
        return () => { cancelled = true; };
        // schema is a value defined at module scope; intentionally only run once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

// ──────────────────────────────────────────────────────────────────────
// Hook + state setter for showing the modal.
// ──────────────────────────────────────────────────────────────────────

export function useBuildShareUrl<T>(schema: ShareSchema<T>) {
    const [url, setUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [building, setBuilding] = useState(false);

    const build = useCallback(async (state: T) => {
        setBuilding(true); setError(null); setUrl(null);
        try {
            const u = await buildShareUrl(schema, state);
            if (!u) setError("State is too large to fit in a URL — consider trimming the input.");
            else setUrl(u);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setBuilding(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { url, error, building, build, reset: () => { setUrl(null); setError(null); } };
}
