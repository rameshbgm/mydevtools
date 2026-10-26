"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowDownOutlined, ArrowRightOutlined, BranchesOutlined, DownloadOutlined, FolderOpenOutlined, LockOutlined, SafetyCertificateOutlined, SplitCellsOutlined } from "@ant-design/icons";
import { useDesktopRuntime } from "@/lib/desktop-runtime";
import { toolPathFromId } from "@/lib/category-routes";
import { triggerPwaInstallPrompt } from "@/lib/pwa-install-prompt";
import { useLanguage } from "./LanguageProvider";
import LandingToolCarousel from "./LandingToolCarousel";

interface LandingMarketingProps { darkMode: boolean; stats: { total: number; categories: number }; onToolClick: (id: string) => void; children?: ReactNode }

/** Signal: a request/response instrument, followed by direct routes into the real tools. */
export default function LandingMarketing({ stats, onToolClick, children }: LandingMarketingProps) {
    const { t, direction, language } = useLanguage();
    const desktop = useDesktopRuntime();
    const [installHelp, setInstallHelp] = useState(false);
    return <div className="landing-intro landing-signal" lang={language} dir={direction}>
        <section className="landing-hero" aria-labelledby="landing-title">
            <div className="landing-hero-heading"><h1 id="landing-title">{t("Build. Inspect. Debug.")} <span>{t("Keep your flow.")}</span></h1>
                <div className="landing-hero-summary"><p className="landing-hero-description">{t("Format JSON, test HTTP and gRPC APIs, and inspect tokens. Keep your notes, snippets, and workflows beside the tools you use.")}</p><div className="landing-hero-features"><Link href={toolPathFromId("project-workspaces")!}><FolderOpenOutlined />{t("Project Workspaces")}</Link><Link href={toolPathFromId("tool-workbench")!}><SplitCellsOutlined />{t("Tool Tabs")}</Link><Link href={toolPathFromId("saved-workflows")!}><BranchesOutlined />{t("Saved Workflows")}</Link><a href="#landing-full-catalog">{t("Explore {count} tools", { count: stats.total })}<ArrowDownOutlined /></a></div></div>
            </div>
            <LandingToolCarousel onToolClick={onToolClick} />
            <p className="landing-hero-facts"><LockOutlined /> {t("Local processing by default")}<span aria-hidden="true">·</span>{t("No account required")}<span aria-hidden="true">·</span>{t("{count} tool categories", { count: stats.categories })}</p>
        </section>
        {children}
        <section className="landing-workspace-section" id="landing-workspace-story" aria-labelledby="landing-workspace-title"><div className="landing-section-heading"><h2 id="landing-workspace-title">{t("More than a collection of tabs.")}</h2><p>{t("Keep the context. Get back to the work.")}</p></div><div className="landing-workspace-links">{[
            { id: "project-workspaces", Icon: FolderOpenOutlined, title: "Give each project its own space.", text: "Keep notes, snippets, bookmarks and saved connections together. Switch projects when the work changes." },
            { id: "tool-workbench", Icon: SplitCellsOutlined, title: "Keep the next tool within reach.", text: "Open tools in parallel tabs in the workbench. Compare a response, check a query and pick up where you left off." },
            { id: "saved-workflows", Icon: BranchesOutlined, title: "Save the steps you repeat.", text: "Chain supported transformations into a saved workflow. Run the same sequence on the next input." },
        ].map(({ id, Icon, title, text }) => <Link key={id} href={toolPathFromId(id)!} onClick={() => onToolClick(id)}><Icon /><span><strong>{t(title)}</strong><span>{t(text)}</span></span><ArrowRightOutlined /></Link>)}</div></section>
        <section id="landing-data-boundary" className="landing-data-section" aria-labelledby="landing-data-title"><SafetyCertificateOutlined /><div><h2 id="landing-data-title">{t("Know where your data goes.")}</h2><p>{t("Formatting, decoding and other local transformations run on your device.")} {t("API and lookup tools contact the services shown in the tool when you run them. Native database and storage connections need the desktop app or local runtime.")}</p><p>{t("Projects and preferences stay in this browser. Use the passphrase-protected vaults for credentials and private files, and export backups for safekeeping.")}</p></div></section>
        <div className="landing-bottom-links"><Link href="/guides">{t("Debugging guides")} <ArrowRightOutlined /></Link><Link href="/release-notes">{t("Release notes")}</Link>{!desktop && <button type="button" aria-expanded={installHelp} aria-controls="landing-install-help" onClick={async () => { if (!(await triggerPwaInstallPrompt())) setInstallHelp(v => !v); }}><DownloadOutlined />{t("Install web app")}</button>}</div>
        {installHelp && <p id="landing-install-help" className="landing-install-help" role="status">{t("Use your browser’s install or “Add to Dock” option where supported. Offline use requires the app and tool resources to have been cached first; network tools still need a connection.")}</p>}
    </div>;
}
