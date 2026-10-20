"use client";
import { useMemo, useState } from "react";
import { CodeOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import { identifierConfigMessage } from "@/lib/i18n/identifier-config";
import ToolPageLayout from "@/components/ToolPageLayout";
import { GITIGNORE_TEMPLATES, generateGitignore } from "@/lib/gitignore-templates";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";
export default function GitignoreGeneratorPage() {
    const { t } = useLanguage();
    const [selected, setSelected] = useState(["node", "next", "secrets"]), [custom, setCustom] = useState(""), [search, setSearch] = useState("");
    const output = useMemo(() => { try { return { value: generateGitignore(selected, custom), error: "" }; } catch (cause) { return { value: "", error: cause instanceof Error ? cause.message : String(cause) }; } }, [selected, custom]);
    return <ToolPageLayout title={t(".gitignore Generator")} description={t("Combine stack, editor and operating-system starter patterns with your own overrides")} icon={<CodeOutlined />} color="#08979c"><div className="wb-workbench">
        <p>{t("Choose starter patterns, review their scope and add project-specific overrides. Pattern order is preserved; the last matching pattern wins. Generated files do not remove files already tracked by Git.")}</p>
        <label>{t("Find templates")}<input dir="auto" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("Python, Rust, macOS…")} /></label>
        <div className="wb-form-grid">{(["Stack", "Editor", "Operating system", "Local data"] as const).map((group) => <fieldset className="wb-cron-field" key={group}><legend>{t(group)}</legend>{GITIGNORE_TEMPLATES.filter((item) => item.group === group && (item.name + " " + t(item.name)).toLocaleLowerCase().includes(search.toLocaleLowerCase())).map((template) => <label className="wb-checkbox" key={template.id}><input type="checkbox" checked={selected.includes(template.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, template.id] : current.filter((id) => id !== template.id))} />{t(template.name)}</label>)}</fieldset>)}</div>
        <p>{t("{count} templates selected. Dependency lockfiles remain tracked by these starters. Review broad patterns such as *.key, build/ or vendor/ for your project.", { count: selected.length })}</p>
        <label>{t("Custom patterns / existing .gitignore (appended last)")}<textarea dir="ltr" rows={6} maxLength={100_000} value={custom} onChange={(event) => setCustom(event.target.value)} spellCheck={false} placeholder={t("# Example override\n!important.log")} /></label>
        <div className="wb-workbench-actions"><button disabled={!selected.length && !custom.trim()} onClick={() => void copyToClipboard(output.value)}>{t("Copy .gitignore")}</button><button disabled={!selected.length && !custom.trim()} onClick={() => downloadText(output.value, ".gitignore")}>{t("Download .gitignore")}</button><button onClick={() => { setSelected([]); setCustom(""); }}>{t("Clear choices")}</button></div>
        {output.error && <p role="alert">{identifierConfigMessage(output.error, t)}</p>}<label>{t(".gitignore preview")}<textarea dir="ltr" rows={18} value={output.value} readOnly /></label>
        <p>{t("Ignoring a directory also excludes its children. To re-include a child, allow traversal of its parent first.")} <a href="https://git-scm.com/docs/gitignore" target="_blank" rel="noreferrer">{t("Git pattern documentation")}</a></p>
    </div></ToolPageLayout>;
}
