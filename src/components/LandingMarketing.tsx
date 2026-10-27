"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ApiOutlined, ArrowDownOutlined, ArrowRightOutlined, BranchesOutlined, CodeOutlined, DesktopOutlined, DownloadOutlined, FileSearchOutlined, FolderOpenOutlined, GithubOutlined, LockOutlined, SafetyCertificateOutlined, SplitCellsOutlined } from "@ant-design/icons";
import { useDesktopRuntime } from "@/lib/desktop-runtime";
import { toolPathFromId } from "@/lib/category-routes";
import { triggerPwaInstallPrompt } from "@/lib/pwa-install-prompt";
import { useLanguage } from "./LanguageProvider";
import LandingToolCarousel from "./LandingToolCarousel";

interface LandingMarketingProps { darkMode: boolean; stats: { total: number; categories: number }; onToolClick: (id: string) => void; children?: ReactNode }

/** One introduction: what the toolkit does, tools to discover, and routes into saved work. */
export default function LandingMarketing({ stats, onToolClick, children }: LandingMarketingProps) {
    const { t, direction, language } = useLanguage();
    const desktop = useDesktopRuntime();
    const [installHelp, setInstallHelp] = useState(false);
    return <div className="landing-intro landing-signal" lang={language} dir={direction}>
        <section className="landing-hero" aria-labelledby="landing-title">
            <div className="landing-hero-heading">
                <div className="landing-hero-watermarks" aria-hidden="true"><SafetyCertificateOutlined className="landing-watermark-security" /><CodeOutlined className="landing-watermark-code" /><LockOutlined className="landing-watermark-lock" /><GithubOutlined className="landing-watermark-source" /><FileSearchOutlined className="landing-watermark-audit" /><ApiOutlined className="landing-watermark-api" /></div>
                <h1 id="landing-title">{t("Developer tools.")} <span>{t("Open by design.")}</span></h1>
                <p className="landing-hero-description">{t("Online tools can leave you guessing where sensitive data goes. Our local tools process on your device; network tools disclose their connections. Audit the MIT-licensed source to review how it works.")}</p>
                <div className="landing-hero-cta"><a className="landing-hero-browse" href="#landing-full-catalog">{t("Explore {count} tools", { count: stats.total })}<ArrowDownOutlined /></a><a className="landing-hero-source" href="https://github.com/rameshbgm/mydevtools" target="_blank" rel="noopener noreferrer"><GithubOutlined />{t("Audit the source code")}<ArrowRightOutlined /></a></div>
                <ul className="landing-hero-proof"><li><DesktopOutlined /><span>{t("On-device tools")}</span></li><li><ApiOutlined /><span>{t("Disclosed connections")}</span></li><li><GithubOutlined /><span>{t("MIT open source")}</span></li></ul>
            </div>
            <LandingToolCarousel onToolClick={onToolClick} />
            <div className="landing-hero-footer"><p className="landing-hero-facts"><LockOutlined /> {t("Local processing by default")}<span aria-hidden="true">·</span>{t("No account required")}</p><nav className="landing-hero-features" aria-label={t("Project Workspaces")}><Link href={toolPathFromId("project-workspaces")!}><FolderOpenOutlined />{t("Project Workspaces")}</Link><Link href={toolPathFromId("tool-workbench")!}><SplitCellsOutlined />{t("Tool Tabs")}</Link><Link href={toolPathFromId("saved-workflows")!}><BranchesOutlined />{t("Saved Workflows")}</Link></nav></div>
        </section>
        {children}
        <section className="landing-workspace-section" id="landing-workspace-story" aria-labelledby="landing-workspace-title"><div className="landing-section-heading"><h2 id="landing-workspace-title">{t("More than a collection of tabs.")}</h2><p>{t("Keep the context. Get back to the work.")}</p></div><div className="landing-workspace-links">{[
            { id: "project-workspaces", Icon: FolderOpenOutlined, title: "Give each project its own space.", text: "Keep notes, snippets, bookmarks and saved connections together. Switch projects when the work changes." },
            { id: "tool-workbench", Icon: SplitCellsOutlined, title: "Keep the next tool within reach.", text: "Open tools in parallel tabs in the workbench. Compare a response, check a query and pick up where you left off." },
            { id: "saved-workflows", Icon: BranchesOutlined, title: "Save the steps you repeat.", text: "Chain supported transformations into a saved workflow. Run the same sequence on the next input." },
        ].map(({ id, Icon, title, text }) => <Link key={id} href={toolPathFromId(id)!} onClick={() => onToolClick(id)}><Icon /><span><strong>{t(title)}</strong><span>{t(text)}</span></span><ArrowRightOutlined /></Link>)}</div></section>
        <section id="landing-data-boundary" className="landing-data-section" aria-labelledby="landing-data-title"><SafetyCertificateOutlined /><div><h2 id="landing-data-title">{t("Know where your data goes.")}</h2><p>{t("Formatting, decoding and other local transformations run on your device.")} {t("API and lookup tools contact the services shown in the tool when you run them. Native database and storage connections need the desktop app or local runtime.")}</p><p>{t("Projects and preferences stay in this browser. Use the passphrase-protected vaults for credentials and private files, and export backups for safekeeping.")}</p></div></section>
        <div className="landing-bottom-links"><Link href="/release-notes">{t("Release notes")}</Link>{!desktop && <button type="button" aria-expanded={installHelp} aria-controls="landing-install-help" onClick={async () => { if (!(await triggerPwaInstallPrompt())) setInstallHelp(v => !v); }}><DownloadOutlined />{t("Install web app")}</button>}</div>
        {installHelp && <p id="landing-install-help" className="landing-install-help" role="status">{t("Use your browser’s install or “Add to Dock” option where supported. Offline use requires the app and tool resources to have been cached first; network tools still need a connection.")}</p>}
    </div>;
}
