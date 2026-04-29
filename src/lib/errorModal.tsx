"use client";

import React from "react";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

export interface ErrorDetailParams {
    /** Modal title — usually "Generation failed" or similar. */
    title: string;
    /** The thrown error or a string describing it. */
    error: unknown;
    /** One-sentence context explaining what was being attempted. */
    context?: string;
    /** Bulleted recommendations the user can try. */
    recommendations?: string[];
    /** Override the suggestions shown for known error patterns. */
    cause?: string;
}

/**
 * Inspect a thrown error and try to identify the likely root cause.
 * Returned strings are user-facing.
 */
function diagnose(error: unknown): { cause: string; recommendations: string[] } | null {
    const msg = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    const lower = msg.toLowerCase();

    if (lower.includes("not implemented") || lower.includes("notsupportederror")) {
        return {
            cause: "Your browser doesn't implement the required Web Crypto algorithm.",
            recommendations: [
                "Try a different algorithm/curve in the form (e.g., RSA 2048 or ECDSA P-256 are the most widely supported).",
                "Update to the latest version of Chrome, Firefox, Safari, or Edge.",
                "If you need Ed25519 or PQC algorithms, use the OpenSSL commands tab instead.",
            ],
        };
    }
    if (lower.includes("operationerror") || lower.includes("invalid key")) {
        return {
            cause: "The Web Crypto API rejected the key parameters.",
            recommendations: [
                "Pick a standard RSA key size (2048 / 3072 / 4096) — non-standard sizes are often rejected.",
                "For ECDSA, only P-256, P-384, and P-521 are supported in browsers.",
                "Check the hash algorithm matches the signing algorithm (SHA-256 is the safest default).",
            ],
        };
    }
    if (lower.includes("secure context") || lower.includes("subtle is undefined")) {
        return {
            cause: "Web Crypto requires a secure origin (HTTPS or localhost).",
            recommendations: [
                "Open this app on https:// or on http://localhost.",
                "If you're behind a corporate proxy, ensure it isn't downgrading the connection.",
            ],
        };
    }
    if (lower.includes("quota") || lower.includes("memory") || lower.includes("allocation")) {
        return {
            cause: "The browser ran out of memory generating that key.",
            recommendations: [
                "Use a smaller key size (RSA 4096 → 2048).",
                "Close other tabs to free memory and try again.",
            ],
        };
    }
    if (lower.includes("network") || lower.includes("fetch")) {
        return {
            cause: "A network call failed.",
            recommendations: [
                "Check your internet connection.",
                "If you're behind a corporate proxy or firewall, the request may be blocked.",
                "Try again — transient network failures often resolve on retry.",
            ],
        };
    }
    if (lower.includes("syntax") || lower.includes("unexpected token") || lower.includes("invalid json") || lower.includes("invalid xml")) {
        return {
            cause: "The input couldn't be parsed.",
            recommendations: [
                "Validate the input in the matching Validator tool first.",
                "Check for trailing commas, smart quotes (“”), or invisible characters pasted from a doc/wiki.",
                "Make sure the format matches what this tool expects (PEM vs DER, JSON vs JS object).",
            ],
        };
    }
    return null;
}

/**
 * Show a rich, modal-style error explanation with diagnostics.
 * Falls back to a generic message when the cause can't be identified.
 *
 * Note: uses AntD's static `Modal.error`. Theming is best-effort —
 * for fully theme-aware modals, prefer `App.useApp().modal.error`.
 */
export function showErrorModal({
    title,
    error,
    context,
    recommendations,
    cause,
}: ErrorDetailParams) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : "Error";
    const diagnosed = diagnose(error);

    const finalCause = cause ?? diagnosed?.cause;
    const finalRecs = recommendations ?? diagnosed?.recommendations ?? [];

    Modal.error({
        title: (
            <span>
                <ExclamationCircleFilled style={{ color: "#f5222d", marginRight: 8 }} />
                {title}
            </span>
        ),
        icon: null,
        width: 580,
        centered: true,
        content: (
            <div style={{ marginTop: 8 }}>
                {context && (
                    <p style={{ marginBottom: 12, color: "var(--text-secondary, #525252)" }}>
                        {context}
                    </p>
                )}

                {finalCause && (
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
                            Likely cause
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-secondary, #525252)" }}>
                            {finalCause}
                        </div>
                    </div>
                )}

                <div
                    style={{
                        padding: "10px 12px",
                        background: "rgba(245, 34, 45, 0.08)",
                        border: "1px solid rgba(245, 34, 45, 0.25)",
                        borderRadius: 8,
                        marginBottom: 12,
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 0.5,
                            color: "#f5222d",
                            marginBottom: 4,
                            textTransform: "uppercase",
                        }}
                    >
                        {errorName}
                    </div>
                    <code
                        style={{
                            fontSize: 12,
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                            display: "block",
                        }}
                    >
                        {errorMessage}
                    </code>
                </div>

                {finalRecs.length > 0 && (
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>
                            What to try
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.7 }}>
                            {finalRecs.map((rec) => (
                                <li key={rec}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        ),
    });
}
