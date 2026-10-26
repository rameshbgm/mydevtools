"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppstoreOutlined, ArrowRightOutlined, SearchOutlined, StarFilled, StarOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CATEGORY_DESCRIPTIONS, CATEGORY_ICONS, getToolsByCategory, toolsRegistry, type ToolCategory } from "@/lib/tools-registry";
import { dashboardCategoryHashId, toolPath } from "@/lib/category-routes";
import { BOUNDARY_LABELS, dataBoundaryForTool } from "@/lib/data-boundaries";
import { matchesToolQuery } from "@/lib/tool-search";
import { useAppStore } from "@/lib/store";
import { useLanguage } from "./LanguageProvider";

export default function SignalCatalog() {
    const { t, language } = useLanguage();
    const addRecentTool = useAppStore(s => s.addRecentTool);
    const bookmarks = useAppStore(s => s.bookmarks);
    const savedIds = useMemo(() => new Set(bookmarks.flatMap(menu => menu.toolIds)), [bookmarks]);
    const categorized = useMemo(() => getToolsByCategory(), []);
    const categories = useMemo(() => [...categorized.keys()].sort((a,b) => t(a).localeCompare(t(b), language)), [categorized, language, t]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<ToolCategory | "all">("all");
    const [savedOnly, setSavedOnly] = useState(false);
    const [layout, setLayout] = useState<"list" | "grid">("list");
    const [sort, setSort] = useState("asc");
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    useEffect(() => {
        const readLocation = () => {
            const query = new URLSearchParams(window.location.search).get("q");
            if (query) setSearch(query);
            const selected = [...categorized.keys()].find(c => `#${dashboardCategoryHashId(c)}` === window.location.hash);
            if (selected) setCategory(selected);
            if (query || selected) document.getElementById("landing-full-catalog")?.scrollIntoView();
        };
        readLocation(); window.addEventListener("hashchange", readLocation);
        return () => window.removeEventListener("hashchange", readLocation);
    }, [categorized]);
    const matches = useMemo(() => toolsRegistry.filter(tool => matchesToolQuery(tool, search, language) && (!savedOnly || savedIds.has(tool.id))), [search, language, savedOnly, savedIds]);
    const filtered = matches.filter(tool => category === "all" || tool.category === category);
    const groups = categories.map(c => [c, filtered.filter(tool => tool.category === c).sort((a,b) => (sort === "desc" ? -1 : 1) * t(a.name).localeCompare(t(b.name), language))] as const).filter(([, items]) => items.length);
    function reset() { setSearch(""); setCategory("all"); setSavedOnly(false); }
    function selectCategory(next: ToolCategory | "all") { setCategory(next); }
    return <section className="wb-cat-workspace signal-catalog" id="landing-full-catalog" aria-labelledby="signal-catalog-title">
        <div className="signal-catalog-intro"><div><h2 id="signal-catalog-title">{t("Your whole toolkit. One place.")}</h2><p>{t("{tools} tools. {categories} categories. One place to get started.", { tools: toolsRegistry.length, categories: categories.length })}</p></div><span>{t("Find a tool by name, task, format, or category.")}</span></div>
        <div className="signal-catalog-search"><label><SearchOutlined /><span className="sr-only">{t("Search tools")}</span><input id="catalog-search" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={t("Search tools, formats, or tasks…")} /></label><button type="button" aria-label={t("Show bookmarked tools")} aria-pressed={savedOnly} onClick={() => setSavedOnly(v => !v)}>{savedOnly ? <StarFilled /> : <StarOutlined />}<span>{t("Bookmarks")}</span><b>{savedIds.size}</b></button></div>
        <div className="signal-catalog-body"><aside className="signal-category-rail"><div className="signal-category-heading"><strong>{t("Categories")}</strong><span>{categories.length}</span></div><nav tabIndex={0} aria-label={t("Tool categories")}><button type="button" aria-pressed={category === "all"} onClick={() => selectCategory("all")}><AppstoreOutlined /><span>{t("All tools")}</span><b>{matches.length}</b></button>{categories.map(c => { const Icon = CATEGORY_ICONS[c]; return <button key={c} type="button" aria-pressed={category === c} onClick={() => selectCategory(c)}><Icon /><span>{t(c)}</span><b>{matches.filter(tool => tool.category === c).length}</b></button>; })}</nav></aside><div className="signal-catalog-results"><label className="signal-catalog-category-filter" htmlFor="signal-category-select">{t("Categories")}<select id="signal-category-select" value={category} onChange={e => selectCategory(e.target.value as ToolCategory | "all")}><option value="all">{t("All tools")} ({matches.length})</option>{categories.map(c => <option key={c} value={c}>{t(c)} ({matches.filter(tool => tool.category === c).length})</option>)}</select></label>
                <div className="signal-catalog-toolbar"><div><h3>{t(category === "all" ? "All tools" : category)}</h3><p role="status">{t("{count} matching tools", { count: filtered.length })}</p></div><div><label className="sr-only" htmlFor="signal-catalog-sort">{t("Sort tools")}</label><select id="signal-catalog-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="asc">{t("Name A–Z")}</option><option value="desc">{t("Name Z–A")}</option></select><div className="signal-layout-switch"><button type="button" aria-label={t("Grid layout")} aria-pressed={layout === "grid"} onClick={() => setLayout("grid")}><AppstoreOutlined /></button><button type="button" aria-label={t("List layout")} aria-pressed={layout === "list"} onClick={() => setLayout("list")}><UnorderedListOutlined /></button></div></div></div>
                {!filtered.length && <div className="signal-catalog-empty"><SearchOutlined /><h3>{t(savedOnly && !savedIds.size ? "No bookmarked tools yet." : "No matching tools.")}</h3><p>{t(savedOnly && !savedIds.size ? "Use the bookmarks button in the header to save tools to a menu." : "Try another category or a broader search.")}</p><button type="button" onClick={reset}>{t("Show all tools")}</button></div>}
                {groups.map(([c, items]) => {
                    const compact = category === "all" && !search.trim() && !savedOnly;
                    const open = expanded.has(c);
                    const visible = compact && !open ? items.slice(0,3) : items;
                    const Icon = CATEGORY_ICONS[c];
                    return <section key={c} className="wb-cat-category-block signal-catalog-group" id={dashboardCategoryHashId(c)} aria-labelledby={`title-${dashboardCategoryHashId(c)}`}><div className="signal-catalog-group-heading"><h3 id={`title-${dashboardCategoryHashId(c)}`}><Icon />{t(c)}<small>{items.length}</small></h3>{compact && <button type="button" onClick={() => selectCategory(c)}>{t("View category")} <ArrowRightOutlined /></button>}</div>{category !== "all" && <p className="signal-category-description">{t(CATEGORY_DESCRIPTIONS[c])}</p>}
                        <div className={`signal-tool-directory signal-tool-directory-${layout}`}>{visible.map(tool => <Link key={tool.id} href={toolPath(tool)} prefetch={false} onClick={() => addRecentTool(tool.id)} className="wb-cat-tool-card signal-tool-row"><tool.icon /><span className="signal-tool-row-copy"><strong>{t(tool.name)}</strong><span>{t(tool.description)}</span></span><span className="signal-tool-boundary">{savedIds.has(tool.id) && <StarFilled aria-label={t("Bookmarks")} />}{t(BOUNDARY_LABELS[dataBoundaryForTool(tool.id)])}</span><ArrowRightOutlined className="signal-tool-row-arrow" /></Link>)}</div>
                        {compact && items.length > 3 && <button className="signal-show-category" type="button" aria-expanded={open} onClick={() => setExpanded(previous => { const next = new Set(previous); if (next.has(c)) next.delete(c); else next.add(c); return next; })}>{t(open ? "Show fewer" : "Show all {count} tools", { count: items.length })}</button>}
                    </section>;
                })}
                <a className="signal-catalog-back" href="#landing-full-catalog">{t("Back to catalog search")}</a>
            </div></div>
    </section>;
}
