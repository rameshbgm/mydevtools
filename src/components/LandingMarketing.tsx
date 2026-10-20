"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ApiOutlined, ArrowDownOutlined, ArrowRightOutlined, BranchesOutlined, CheckCircleOutlined, CodeOutlined, DatabaseOutlined, DownloadOutlined, FileTextOutlined, FolderOpenOutlined, GlobalOutlined, LinkOutlined, LockOutlined, SafetyCertificateOutlined, SplitCellsOutlined } from "@ant-design/icons";
import { useDesktopRuntime } from "@/lib/desktop-runtime";
import { toolPathFromId } from "@/lib/category-routes";
import { APP_VERSION } from "@/lib/app-version";
import { triggerPwaInstallPrompt } from "@/lib/pwa-install-prompt";
import { useLanguage } from "./LanguageProvider";

interface LandingMarketingProps {
    darkMode: boolean;
    stats: { total: number; categories: number };
    onToolClick: (id: string) => void;
}
const TASKS = [
    { id: "json-formatter", name: "JSON Formatter", task: "Make a payload readable", icon: CodeOutlined },
    { id: "api-request-builder", name: "API Request Builder", task: "Send and inspect a request", icon: ApiOutlined },
    { id: "sql-client", name: "SQL Client", task: "Query and explore your data", icon: DatabaseOutlined },
    { id: "text-diff", name: "Text Diff", task: "See exactly what changed", icon: SplitCellsOutlined },
    { id: "jwt-decoder", name: "JWT Decoder", task: "Inspect a token’s claims", icon: SafetyCertificateOutlined },
    { id: "csv-to-json", name: "CSV to JSON", task: "Turn a table into a payload", icon: FileTextOutlined },
];
const STORY = [
    { title: "Give each project its own space.", description: "Keep notes, snippets, bookmarks and saved connections together. Switch projects when the work changes.", id: "project-workspaces", action: "Open Project Workspaces", icon: FolderOpenOutlined },
    { title: "Keep the next tool within reach.", description: "Open tools in parallel tabs in the workbench. Compare a response, check a query and pick up where you left off.", id: "tool-workbench", action: "Open Tool Workbench", icon: SplitCellsOutlined },
    { title: "Save the steps you repeat.", description: "Chain supported transformations into a saved workflow. Run the same sequence on the next input.", id: "saved-workflows", action: "Open Saved Workflows", icon: BranchesOutlined },
];

function ToolLink({ id, children, onOpen, className }: { id: string; children: ReactNode; onOpen: (id: string) => void; className?: string }) {
    return <Link href={toolPathFromId(id) ?? "/"} prefetch={false} className={className} onClick={() => onOpen(id)}>{children}</Link>;
}

function ExampleProject({ step }: { step: number }) {
    const { t, direction } = useLanguage();
    return <>
        <div className="landing-project-bar"><span><FolderOpenOutlined aria-hidden="true" /> <bdi dir="ltr">checkout-api</bdi></span><span className="landing-example-label">{t("Example project")}</span></div>
        {step === 0 ? <div className="landing-project-grid">
            <div className="landing-project-tree" aria-hidden="true"><strong>{t("Project resources")}</strong><span className="landing-tree-selected"><FileTextOutlined aria-hidden="true" /> {t("Notes")}</span><span><CodeOutlined aria-hidden="true" /> {t("Snippets")}</span><span><LinkOutlined aria-hidden="true" /> {t("Bookmarks")}</span><span><LockOutlined aria-hidden="true" /> {t("Vault · locked")}</span></div>
            <div className="landing-project-document"><span className="landing-file-name" dir="ltr">release-checklist.md</span><h4>{t("Ready for the next release")}</h4><p><CheckCircleOutlined aria-hidden="true" /> {t("Validate the API response")}</p><p><CheckCircleOutlined aria-hidden="true" /> {t("Compare the schema changes")}</p><p><span className="landing-check-empty" aria-hidden="true" /> {t("Check the staging query")}</p><div className="landing-note-footer">{t("Notes and resources stay with this project.")}</div></div>
        </div> : step === 1 ? <div className="landing-parallel-preview" dir={direction}>
            <div className="landing-preview-tabs"><span><CodeOutlined aria-hidden="true" /> {t("JSON Formatter")}</span><span><DatabaseOutlined aria-hidden="true" /> {t("SQL Client")}</span></div>
            <div className="landing-preview-split"><div><span className="landing-file-name">{t("API response")}</span><pre dir="ltr">{'{\n  "status": "ready",\n  "items": 3,\n  "project": "checkout-api"\n}'}</pre></div><div><span className="landing-file-name">{t("Query result · example")}</span><table dir="ltr"><caption className="sr-only">{t("Example query result")}</caption><thead><tr><th>id</th><th>status</th></tr></thead><tbody><tr><td>1041</td><td>ready</td></tr><tr><td>1042</td><td>ready</td></tr><tr><td>1043</td><td>ready</td></tr></tbody></table></div></div>
        </div> : <div className="landing-workflow-preview">
            <span className="landing-file-name">{t("Saved workflow · example")}</span><h4>{t("Inspect an encoded payload")}</h4>
            <ol><li><span>{t("Decode Base64")}</span><span>{t("Text")}</span></li><li><span>{t("Format JSON")}</span><span>JSON</span></li><li><span>SHA-256</span><span>{t("Digest")}</span></li></ol>
            <div className="landing-workflow-result"><CheckCircleOutlined aria-hidden="true" /> {t("One input. Three reusable steps.")}</div>
        </div>}
    </>;
}

export default function LandingMarketing({ darkMode, stats, onToolClick }: LandingMarketingProps) {
    const { t, direction, language } = useLanguage();
    const desktop = useDesktopRuntime();
    const reducedMotion = useReducedMotion();
    const root = useRef<HTMLDivElement>(null);
    const story = useRef<HTMLDivElement>(null);
    const manuallySelectedStory = useRef(false);
    const [storyStep, setStoryStep] = useState(0);
    const [installHelp, setInstallHelp] = useState(false);
    const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
    const { scrollYProgress: storyProgress } = useScroll({ target: story, offset: ["start center", "end center"] });
    useMotionValueEvent(storyProgress, "change", (value) => {
        if (reducedMotion || manuallySelectedStory.current || !story.current || story.current.clientWidth < 850) return;
        setStoryStep(Math.min(2, Math.floor(value * 3)));
    });
    const transition = reducedMotion ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };
    function selectStory(index: number) { manuallySelectedStory.current = true; setStoryStep(index); }
    function storyKeys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        const offset = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
        const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : offset ? (index + offset + 3) % 3 : -1;
        if (next < 0) return;
        event.preventDefault(); selectStory(next); document.getElementById(`landing-story-tab-${next}`)?.focus();
    }
    return <div ref={root} className={`landing-intro ${darkMode ? "landing-dark" : "landing-light"}`} lang={language} dir={direction}>
        <nav className="landing-section-nav" aria-label={t("Introduction sections")}>
            <a href="#landing-workspace-story">{t("Workspace")}</a><a href="#landing-data-boundary">{t("Your data")}</a><a href="#landing-full-catalog">{t("All tools")} <ArrowDownOutlined aria-hidden="true" /></a>
            <motion.span className="landing-scroll-progress" style={{ scaleX: reducedMotion ? 0 : scrollYProgress, transformOrigin: direction === "rtl" ? "right" : "left" }} aria-hidden="true" />
        </nav>
        <section className="landing-hero" aria-labelledby="landing-title">
            <div className="landing-hero-copy">
                <h1 id="landing-title">{t("Your everyday")}{language === "ja" || language === "zh" ? "" : " "}<span>{t("developer workspace.")}</span></h1>
                <p className="landing-hero-description">{t("Format JSON. Test APIs. Inspect tokens. Work with databases. The tools you reach for all day, together in one workspace.")}</p>
                <div className="landing-hero-actions"><a className="landing-button landing-button-primary" href="#landing-full-catalog">{t("Explore {count} tools", { count: stats.total })} <ArrowRightOutlined aria-hidden="true" /></a></div>
                <p className="landing-hero-facts"><LockOutlined aria-hidden="true" /> {t("Local processing by default")} <span aria-hidden="true">·</span> {t("No account required")}</p>
                <div className="landing-release-line"><Link href="/release-notes#release-2.0.0" prefetch={false}>{t("What’s new in {version}", { version: APP_VERSION })} <ArrowRightOutlined aria-hidden="true" /></Link><span>{t("{count} tool categories", { count: stats.categories })}</span></div>
            </div>
        </section>
        <section className="landing-task-section" aria-labelledby="landing-task-title">
            <div className="landing-section-heading"><h2 id="landing-task-title">{t("What are you working on?")}</h2><a href="#landing-full-catalog" className="landing-text-link">{t("Search all tools")} <ArrowRightOutlined aria-hidden="true" /></a></div>
            <div className="landing-task-index">{TASKS.map(({ id, name, task, icon: Icon }) => <ToolLink key={id} id={id} onOpen={onToolClick} className="landing-task-link"><Icon aria-hidden="true" /><span><strong>{t(name)}</strong><span>{t(task)}</span></span><ArrowRightOutlined aria-hidden="true" /></ToolLink>)}</div>
        </section>
        <section id="landing-workspace-story" className="landing-story-section" aria-labelledby="landing-story-title">
            <div className="landing-section-heading"><h2 id="landing-story-title">{t("More than a collection of tabs.")}</h2><p>{t("Keep the context. Get back to the work.")}</p></div>
            <div ref={story} className="landing-story-layout">
                <div className="landing-story-steps" role="tablist" aria-label={t("Workspace features")} aria-orientation="vertical">{STORY.map((item, index) => <button id={`landing-story-tab-${index}`} key={item.id} type="button" role="tab" aria-selected={storyStep === index} aria-controls="landing-story-panel" tabIndex={storyStep === index ? 0 : -1} onClick={() => selectStory(index)} onKeyDown={(event) => storyKeys(event, index)}><item.icon aria-hidden="true" /><span><strong>{t(item.title)}</strong><span>{t(item.description)}</span></span></button>)}</div>
                <div className="landing-story-sticky"><div id="landing-story-panel" role="tabpanel" aria-labelledby={`landing-story-tab-${storyStep}`} tabIndex={0}>
                    <figure className="landing-project-preview"><AnimatePresence mode="wait" initial={false}><motion.div key={storyStep} initial={reducedMotion ? false : { opacity: 0.6, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? { opacity: 1 } : { opacity: 0.6, y: -6 }} transition={transition}><ExampleProject step={storyStep} /></motion.div></AnimatePresence><figcaption>{t("Illustrative workspace. Your saved projects stay separate.")}</figcaption></figure>
                    <ToolLink id={STORY[storyStep].id} onOpen={onToolClick} className="landing-story-action">{t(STORY[storyStep].action)} <ArrowRightOutlined aria-hidden="true" /></ToolLink>
                </div></div>
            </div>
        </section>
        <section id="landing-data-boundary" className="landing-data-section" aria-labelledby="landing-data-title">
            <div><LockOutlined className="landing-data-mark" aria-hidden="true" /><h2 id="landing-data-title">{t("Know where your data goes.")}</h2><p>{t("Every tool shows its processing boundary before you use it.")}</p></div>
            <dl className="landing-data-list"><div><dt><SafetyCertificateOutlined aria-hidden="true" /> {t("Browser tools")}</dt><dd>{t("Formatting, decoding and other local transformations run on your device.")}</dd></div><div><dt><GlobalOutlined aria-hidden="true" /> {t("Network tools")}</dt><dd>{t("API and lookup tools contact the services shown in the tool when you run them. Native database and storage connections need the desktop app or local runtime.")}</dd></div><div><dt><FolderOpenOutlined aria-hidden="true" /> {t("Saved work")}</dt><dd>{t("Projects and preferences stay in this browser. Use the passphrase-protected vaults for credentials and private files, and export backups for safekeeping.")}</dd></div></dl>
        </section>
        <section className="landing-close" aria-labelledby="landing-close-title"><div><h2 id="landing-close-title">{t("Find your next everyday tool.")}</h2><p>{t("{tools} tools. {categories} categories. One place to get started.", { tools: stats.total, categories: stats.categories })}</p></div><a href="#landing-full-catalog" className="landing-button landing-button-primary">{t("Open the catalog")} <ArrowRightOutlined aria-hidden="true" /></a></section>
        <div className="landing-bottom-links"><Link href="/guides" prefetch={false}>{t("Debugging guides")} <ArrowRightOutlined aria-hidden="true" /></Link><Link href="/release-notes" prefetch={false}>{t("Release notes")}</Link>{!desktop && <button type="button" aria-expanded={installHelp} aria-controls="landing-install-help" onClick={async () => { if (!(await triggerPwaInstallPrompt())) setInstallHelp((value) => !value); }}><DownloadOutlined aria-hidden="true" /> {t("Install web app")}</button>}</div>
        {installHelp && <p id="landing-install-help" className="landing-install-help" role="status">{t("Use your browser’s install or “Add to Dock” option where supported. Offline use requires the app and tool resources to have been cached first; network tools still need a connection.")}</p>}
    </div>;
}
