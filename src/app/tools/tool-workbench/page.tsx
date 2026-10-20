"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useState } from "react";
import { AppstoreOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { toolsRegistry } from "@/lib/tools-registry";
import { toolPath } from "@/lib/category-routes";
import { projectStorage } from "@/lib/project-storage";
const KEY = "mydevtools-tool-tabs-v1";
const ACTIVE_TAB_KEY = "mydevtools-tool-tabs-active-v1";
const available = toolsRegistry.filter((tool) => tool.id !== "tool-workbench" && tool.id !== "project-workspaces").sort((a, b) => a.name.localeCompare(b.name));
interface ToolTab { id: string; tool: string }
export default function ToolWorkbenchPage() {
    const { t, direction } = useLanguage();
    const leftDelta = direction === "rtl" ? 1 : -1;
    const [embedded, setEmbedded] = useState(false);
    const [tabs, setTabs] = useState<ToolTab[]>([]), [active, setActive] = useState("");
    const [search, setSearch] = useState(""), [selected, setSelected] = useState("json-formatter"), [ready, setReady] = useState(false), [error, setError] = useState("");
    useEffect(() => {
        if (window.parent !== window) { setEmbedded(true); return; }
        try {
            const saved: unknown = JSON.parse(projectStorage.getItem(KEY) ?? "[]");
            if (!Array.isArray(saved)) throw new Error("Saved tabs are invalid.");
            const rows: ToolTab[] = saved.filter((row) => row && typeof row.id === "string" && typeof row.tool === "string" && available.some((tool) => tool.id === row.tool)).slice(0, 8);
            const savedActive = projectStorage.getItem(ACTIVE_TAB_KEY);
            setTabs(rows); setActive(rows.find((row) => row.id === savedActive)?.id ?? rows[0]?.id ?? "");
        } catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
        setReady(true);
    }, []);
    const persist = (next: ToolTab[]) => { setTabs(next); try { projectStorage.setItem(KEY, JSON.stringify(next)); } catch { setError("Tabs remain open for this session, but could not be saved. Check browser storage permissions."); } };
    const activate = (id: string) => {
        setActive(id);
        try { if (id) projectStorage.setItem(ACTIVE_TAB_KEY, id); else projectStorage.removeItem(ACTIVE_TAB_KEY); }
        catch { setError("Tabs remain open for this session, but could not be saved. Check browser storage permissions."); }
    };
    const move = (id: string, target: number) => { const index = tabs.findIndex((tab) => tab.id === id); if (index < 0 || target < 0 || target >= tabs.length) return; const next = [...tabs]; const [item] = next.splice(index, 1); next.splice(target, 0, item); persist(next); };
    const matches = available.filter((tool) => `${tool.name} ${t(tool.name)} ${tool.description} ${tool.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase()));
    if (embedded) return <div className="wb-workbench"><p>{t("Tool Tabs is already running in the containing workspace.")}</p><a href={toolPath({ id: "tool-workbench", category: "Text & Utilities" })} target="_top">{t("Open the main Tool Tabs workspace")}</a></div>;
    return <ToolPageLayout title="Tool Tabs" description={t("Keep several tools open with independent inputs, and switch without losing your place")} icon={<AppstoreOutlined />} color="#08979c"><div className="wb-workbench">
        <p>{t("Open up to eight tools. Inputs stay in their tabs while this page is open. The tab list is saved per project; unsaved tool inputs are cleared when this page reloads or closes.")}</p>
        <div className="wb-form-grid"><label>{t("Find a tool")}<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label>{t("Tool to open")}<select value={matches.some((tool) => tool.id === selected) ? selected : matches[0]?.id ?? ""} onChange={(event) => setSelected(event.target.value)}>{matches.map((tool) => <option key={tool.id} value={tool.id}>{t(tool.name)}</option>)}</select></label></div>
        <button disabled={!ready || tabs.length >= 8 || !matches.length} onClick={() => { const tool = matches.find((row) => row.id === selected) ?? matches[0]; if (!tool) return; const tab = { id: crypto.randomUUID(), tool: tool.id }; persist([...tabs, tab]); activate(tab.id); }}>{t("Open tool in a new tab")}</button>
        {!!tabs.length && <div role="tablist" aria-label={t("Open tools")} className="wb-tool-tabs">{tabs.map((tab, index) => { const tool = available.find((row) => row.id === tab.tool)!; return <div key={tab.id} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", tab.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); move(event.dataTransfer.getData("text/plain"), index); }} className="wb-tool-tab">
            <button id={`tab-${tab.id}`} role="tab" aria-selected={active === tab.id} aria-controls={`panel-${tab.id}`} tabIndex={active === tab.id ? 0 : -1} onClick={() => activate(tab.id)} onKeyDown={(event) => { const next = event.key === "ArrowRight" ? (index - leftDelta + tabs.length) % tabs.length : event.key === "ArrowLeft" ? (index + leftDelta + tabs.length) % tabs.length : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : -1; if (next >= 0) { event.preventDefault(); activate(tabs[next].id); document.getElementById(`tab-${tabs[next].id}`)?.focus(); } }}>{t(tool.name)}</button>
            <button aria-label={t("Move {name} tab left", { name: t(tool.name) })} disabled={index + leftDelta < 0 || index + leftDelta >= tabs.length} onClick={() => move(tab.id, index + leftDelta)}><ArrowLeftOutlined /></button><button aria-label={t("Move {name} tab right", { name: t(tool.name) })} disabled={index - leftDelta < 0 || index - leftDelta >= tabs.length} onClick={() => move(tab.id, index - leftDelta)}><ArrowRightOutlined /></button><button aria-label={t("Close {name} tab", { name: t(tool.name) })} onClick={() => { const next = tabs.filter((row) => row.id !== tab.id); persist(next); if (active === tab.id) activate(next[Math.min(index, next.length - 1)]?.id ?? ""); }}>{t("Close")}</button>
        </div>; })}</div>}
        {tabs.map((tab) => { const tool = available.find((row) => row.id === tab.tool)!; return <section role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} hidden={active !== tab.id} key={tab.id}><iframe className="wb-tool-frame" title={t("{name} workspace", { name: t(tool.name) })} src={`${toolPath(tool)}?embedded=1`} allow="clipboard-read; clipboard-write" /></section>; })}
        {!tabs.length && ready && <p>{t("No tools are open. Choose a tool above to begin.")}</p>}{error && <p role="alert">{t("Review the settings and saved data, then try again.")} {t(error)}</p>}
    </div></ToolPageLayout>;
}
