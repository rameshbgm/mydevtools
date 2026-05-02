"use client";

/* not-found — "Press" edition.
 * A minimal "this entry is missing from the index" page with fuzzy suggestions.
 */

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toolsRegistry } from "@/lib/tools-registry";

function levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let prev = dp[0];
        dp[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const tmp = dp[j];
            dp[j] = a[i - 1] === b[j - 1]
                ? prev
                : 1 + Math.min(prev, dp[j], dp[j - 1]);
            prev = tmp;
        }
    }
    return dp[b.length];
}

export default function NotFound() {
    const router = useRouter();
    const pathname = usePathname();

    const requestedSlug = useMemo(() => {
        const m = pathname?.match(/^\/tools\/([^/]+)/);
        return m?.[1] ?? "";
    }, [pathname]);

    const suggestions = useMemo(() => {
        if (!requestedSlug) {
            return toolsRegistry
                .filter((t) =>
                    ["json-formatter", "jwt-decoder", "uuid-generator", "regex-tester"].includes(t.id)
                )
                .slice(0, 4);
        }
        const target = requestedSlug.toLowerCase().replace(/-/g, "");
        const scored = toolsRegistry.map((t) => {
            const id = t.id.toLowerCase().replace(/-/g, "");
            const name = t.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const idDist = levenshtein(target, id);
            const nameDist = levenshtein(target, name);
            const tagBonus = t.tags.some((tag) =>
                target.includes(tag.toLowerCase().replace(/[^a-z0-9]/g, ""))
            )
                ? -3
                : 0;
            return { tool: t, score: Math.min(idDist, nameDist) + tagBonus };
        });
        scored.sort((a, b) => a.score - b.score);
        return scored.slice(0, 4).map((s) => s.tool);
    }, [requestedSlug]);

    return (
        <article style={{ maxWidth: 720, margin: "0 auto", padding: "32px 0" }}>
            <p className="press-eyebrow" style={{ marginBottom: 12 }}>
                Erratum · 404
            </p>
            <h1 className="press-h1" style={{ marginBottom: 14 }}>
                {requestedSlug
                    ? "This entry was never set in type."
                    : "We couldn’t find that page in the almanac."}
            </h1>
            <p
                style={{
                    font: "italic 400 16px/1.55 var(--font-serif)",
                    color: "var(--ink-soft)",
                    margin: "0 0 28px",
                    maxWidth: "60ch",
                }}
            >
                {requestedSlug ? (
                    <>
                        We searched the index of{" "}
                        <span className="press-mono">{toolsRegistry.length}</span> tools and could
                        not locate{" "}
                        <span
                            className="press-mono"
                            style={{
                                background: "var(--paper-tint)",
                                padding: "1px 6px",
                                border: "1px solid var(--rule-soft)",
                            }}
                        >
                            {requestedSlug}
                        </span>
                        . A few candidates that read alike are listed below.
                    </>
                ) : (
                    <>
                        The path{" "}
                        <span
                            className="press-mono"
                            style={{
                                background: "var(--paper-tint)",
                                padding: "1px 6px",
                                border: "1px solid var(--rule-soft)",
                            }}
                        >
                            {pathname}
                        </span>{" "}
                        is not part of this edition.
                    </>
                )}
            </p>

            {suggestions.length > 0 && (
                <section style={{ marginBottom: 32 }}>
                    <h2
                        className="press-eyebrow"
                        style={{
                            paddingBottom: 8,
                            borderBottom: "1px solid var(--rule)",
                            marginBottom: 8,
                        }}
                    >
                        {requestedSlug ? "Did you mean…" : "Try one of these"}
                    </h2>
                    {suggestions.map((tool, i) => (
                        <button
                            key={tool.id}
                            type="button"
                            onClick={() => router.push(`/tools/${tool.id}`)}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "32px 1fr",
                                gap: 12,
                                width: "100%",
                                padding: "12px 0",
                                textAlign: "left",
                                background: "transparent",
                                border: 0,
                                borderBottom: "1px solid var(--rule-soft)",
                                cursor: "pointer",
                                color: "var(--ink)",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: 11,
                                    color: "var(--ink-faint)",
                                }}
                            >
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span>
                                <span
                                    style={{
                                        font: "600 15px/1.3 var(--font-serif)",
                                        display: "block",
                                    }}
                                >
                                    {tool.name}
                                </span>
                                <span
                                    style={{
                                        fontSize: 12.5,
                                        color: "var(--ink-soft)",
                                    }}
                                >
                                    {tool.description}
                                </span>
                            </span>
                        </button>
                    ))}
                </section>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link
                    href="/"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "var(--ink)",
                        color: "var(--paper)",
                        padding: "10px 16px",
                        textDecoration: "none",
                        fontSize: 13,
                    }}
                >
                    Return to the index
                </Link>
            </div>
        </article>
    );
}
