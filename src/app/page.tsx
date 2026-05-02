"use client";

/* Dashboard — "Press" edition.
 * Editorial index: a masthead + categorized list of tools rendered as
 * numbered entries (think table of contents). Search filters the index.
 * No glass, no gradients, no neon, no springy motion.
 * Functionality preserved: search, recents, click navigates, clear-recents.
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    toolsRegistry,
    getToolsByCategory,
    type ToolCategory,
    type ToolDefinition,
} from "@/lib/tools-registry";
import { useAppStore } from "@/lib/store";

const LEDE =
    "Eighty-eight tools, one tab. No accounts, no uploads — every byte stays in your browser.";

function ToolEntry({
    tool,
    index,
    onClick,
}: Readonly<{
    tool: ToolDefinition;
    index: number;
    onClick: () => void;
}>) {
    return (
        <div
            role="link"
            tabIndex={0}
            className="press-entry"
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <span className="press-entry__num">{String(index).padStart(2, "0")}</span>
            <div className="press-entry__body">
                <h3 className="press-entry__title">{tool.name}</h3>
                <p className="press-entry__desc">{tool.description}</p>
            </div>
            <span className="press-entry__meta">{tool.tags.slice(0, 2).join(" · ")}</span>
        </div>
    );
}

export default function Dashboard() {
    const router = useRouter();
    const { recentTools, addRecentTool, clearRecentTools, setNavigating } = useAppStore();
    const [search, setSearch] = useState("");

    const allCategorized = useMemo(() => getToolsByCategory(), []);

    const filteredCategorized = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return allCategorized;
        const result = new Map<ToolCategory, ToolDefinition[]>();
        allCategorized.forEach((tools, category) => {
            const matches = tools.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
                    category.toLowerCase().includes(q)
            );
            if (matches.length > 0) result.set(category, matches);
        });
        return result;
    }, [search, allCategorized]);

    const matchCount = useMemo(
        () => Array.from(filteredCategorized.values()).reduce((sum, t) => sum + t.length, 0),
        [filteredCategorized]
    );

    const handleClick = (id: string) => {
        addRecentTool(id);
        setNavigating(true, id);
        router.push(`/tools/${id}`);
    };

    const stats = useMemo(
        () => ({ total: toolsRegistry.length, categories: allCategorized.size }),
        [allCategorized]
    );

    const recentDefs = useMemo(
        () =>
            recentTools
                .slice(0, 6)
                .map((id) => toolsRegistry.find((t) => t.id === id))
                .filter(Boolean) as ToolDefinition[],
        [recentTools]
    );

    /* Number tools globally so each entry has a stable index across categories. */
    const numbering = useMemo(() => {
        const map = new Map<string, number>();
        let n = 0;
        allCategorized.forEach((tools) => {
            tools.forEach((t) => {
                n += 1;
                map.set(t.id, n);
            });
        });
        return map;
    }, [allCategorized]);

    return (
        <article>
            {/* Masthead */}
            <section className="press-masthead">
                <div>
                    <div className="press-masthead__edition">
                        <span>Vol. 01</span>
                        <span>·</span>
                        <span>{stats.total} tools</span>
                        <span>·</span>
                        <span>{stats.categories} sections</span>
                        <span>·</span>
                        <span>Local edition</span>
                    </div>
                    <h1 className="press-masthead__title">
                        Developer <em>almanac</em>.
                    </h1>
                    <p className="press-masthead__lede">{LEDE}</p>
                </div>

                <aside className="press-masthead__sidenote">
                    <strong>Editor&rsquo;s note</strong>
                    Hit <kbd>⌘K</kbd> to jump anywhere. Or scroll the index below — tools are
                    numbered so you can cite the entry by number. Recently opened items live
                    just under this masthead.
                </aside>
            </section>

            {/* Search row */}
            <section style={{ marginBottom: 32 }}>
                <label htmlFor="press-search" className="press-eyebrow" style={{ display: "block", marginBottom: 8 }}>
                    Index search
                </label>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                        id="press-search"
                        type="text"
                        value={search}
                        placeholder={`Filter ${stats.total} entries by name, tag, or section…`}
                        onChange={(e) => setSearch(e.target.value)}
                        suppressHydrationWarning
                        style={{
                            flex: "1 1 320px",
                            minWidth: 0,
                            background: "var(--paper)",
                            border: "1px solid var(--ink)",
                            borderRadius: "var(--radius)",
                            padding: "10px 14px",
                            font: "400 15px/1 var(--font-serif)",
                            color: "var(--ink)",
                            outline: "none",
                        }}
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            style={{
                                appearance: "none",
                                background: "transparent",
                                border: "1px solid var(--rule-soft)",
                                color: "var(--ink-soft)",
                                padding: "8px 14px",
                                borderRadius: "var(--radius)",
                                fontFamily: "var(--font-mono)",
                                fontSize: 12,
                                cursor: "pointer",
                            }}
                        >
                            clear
                        </button>
                    )}
                </div>
                {search.trim() && (
                    <p
                        style={{
                            marginTop: 10,
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "var(--ink-faint)",
                        }}
                    >
                        {matchCount} {matchCount === 1 ? "result" : "results"} for{" "}
                        <span className="press-mono" style={{ color: "var(--ink)" }}>
                            &ldquo;{search}&rdquo;
                        </span>
                    </p>
                )}
            </section>

            {/* Recently used (only when not searching) */}
            {recentDefs.length > 0 && !search.trim() && (
                <section style={{ marginBottom: 40 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            paddingBottom: 8,
                            borderBottom: "1px solid var(--rule)",
                            marginBottom: 8,
                        }}
                    >
                        <h2 className="press-eyebrow" style={{ margin: 0 }}>
                            Recently opened
                        </h2>
                        <button
                            type="button"
                            onClick={clearRecentTools}
                            style={{
                                background: "transparent",
                                border: 0,
                                color: "var(--ink-faint)",
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                cursor: "pointer",
                            }}
                        >
                            clear
                        </button>
                    </div>
                    {recentDefs.map((tool, i) => (
                        <ToolEntry
                            key={tool.id}
                            tool={tool}
                            index={numbering.get(tool.id) ?? i + 1}
                            onClick={() => handleClick(tool.id)}
                        />
                    ))}
                </section>
            )}

            {/* Empty state */}
            {search.trim() && filteredCategorized.size === 0 && (
                <section
                    style={{
                        textAlign: "center",
                        padding: "60px 0",
                        borderTop: "1px solid var(--rule-soft)",
                        borderBottom: "1px solid var(--rule-soft)",
                    }}
                >
                    <p
                        className="press-mono"
                        style={{ color: "var(--ink-faint)", margin: 0 }}
                    >
                        No entries match &ldquo;{search}&rdquo;.
                    </p>
                </section>
            )}

            {/* Index by section */}
            {Array.from(filteredCategorized.entries()).map(([category, tools]) => (
                <section key={category}>
                    <header className="press-section-head">
                        <h2 className="press-section-head__title">{category}</h2>
                        <div className="press-section-head__rule" />
                        <span className="press-section-head__count">
                            {String(tools.length).padStart(2, "0")} entries
                        </span>
                    </header>

                    {tools.map((tool) => (
                        <ToolEntry
                            key={tool.id}
                            tool={tool}
                            index={numbering.get(tool.id) ?? 0}
                            onClick={() => handleClick(tool.id)}
                        />
                    ))}
                </section>
            ))}
        </article>
    );
}
