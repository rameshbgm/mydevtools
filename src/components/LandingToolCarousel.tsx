"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightOutlined, LeftOutlined, PauseOutlined, PlayCircleOutlined, RightOutlined, SwapOutlined } from "@ant-design/icons";
import { toolsRegistry, type ToolDefinition } from "@/lib/tools-registry";
import { toolPath } from "@/lib/category-routes";
import { BOUNDARY_LABELS, dataBoundaryForTool } from "@/lib/data-boundaries";
import { useLanguage } from "./LanguageProvider";

const ROTATION_MS = 4000;
function randomTool(current: number) {
    // Every other registered tool has an equal chance; there is no ordered playlist.
    const choice = Math.floor(Math.random() * (toolsRegistry.length - 1));
    return choice >= current ? choice + 1 : choice;
}

function ToolVisual({ tool }: { tool: ToolDefinition }) {
    const { t } = useLanguage();
    const Icon = tool.icon;
    if (tool.id === "api-request-builder") return <div className="landing-spotlight-api" dir="ltr"><div className="landing-request-url"><b>{"GET"}</b><code>{"/workspaces/playground"}</code><ArrowRightOutlined /></div><span className="landing-field-label">{t("Example API response")}</span><pre>{'{\n  "workspace": "Playground",\n  "status": "ready"\n}'}</pre></div>;
    if (tool.id === "json-formatter") return <div className="landing-spotlight-code" dir="ltr"><code>{'{"hello":"world","ready":true}'}</code><ArrowRightOutlined /><pre>{'{\n  "hello": "world",\n  "ready": true\n}'}</pre></div>;
    if (tool.id === "base64") return <div className="landing-spotlight-code" dir="ltr"><code>{"Hello, developer."}</code><SwapOutlined /><pre>{"SGVsbG8sIGRldmVsb3Blci4="}</pre></div>;
    if (["color-contrast-checker", "color-picker", "color-palette-extractor", "css-gradient-generator"].includes(tool.id)) return <div className="landing-spotlight-palette" aria-hidden="true"><div><span>Aa</span><span>Aa</span></div><div><i /><i /><i /><i /><i /></div></div>;
    return <div className="landing-spotlight-diagram" aria-hidden="true"><div className="landing-spotlight-symbol"><Icon /></div><svg viewBox="0 0 400 160"><path d="M0 80H80Q100 80 100 60V40Q100 20 120 20H160M100 60V120Q100 140 120 140H160M240 20H280Q300 20 300 40V120Q300 140 320 140H400M240 80H400" /><circle cx="80" cy="80" r="4" /><circle cx="320" cy="140" r="4" /></svg><div className="landing-spotlight-tags">{tool.tags.slice(0,3).map(tag => <code key={tag}>{t(tag)}</code>)}</div></div>;
}

export default function LandingToolCarousel({ onToolClick }: { onToolClick: (id: string) => void }) {
    const { t } = useLanguage();
    const [slides, setSlides] = useState(() => ({ indices: [toolsRegistry.findIndex(tool => tool.id === "api-request-builder")], cursor: 0 }));
    const [paused, setPaused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);
    const [pageVisible, setPageVisible] = useState(true);
    const frame = useRef<HTMLElement>(null);
    useEffect(() => {
        setSlides(current => ({ indices: [randomTool(current.indices[current.cursor])], cursor: 0 }));
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPaused(media.matches);
        const reduceMotion = () => { if (media.matches) setPaused(true); };
        const visibility = () => setPageVisible(!document.hidden);
        const observer = new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { threshold: .15 });
        if (frame.current) observer.observe(frame.current);
        media.addEventListener("change", reduceMotion);
        document.addEventListener("visibilitychange", visibility);
        return () => { observer.disconnect(); media.removeEventListener("change", reduceMotion); document.removeEventListener("visibilitychange", visibility); };
    }, []);
    useEffect(() => {
        if (paused || hovered || focused || !visible || !pageVisible) return;
        const timer = window.setInterval(() => setSlides(current => ({ indices: [...current.indices, randomTool(current.indices[current.cursor])].slice(-100), cursor: Math.min(current.indices.length, 99) })), ROTATION_MS);
        return () => window.clearInterval(timer);
    }, [paused, hovered, focused, visible, pageVisible]);
    const tool = toolsRegistry[slides.indices[slides.cursor]];
    const next = () => setSlides(current => current.cursor < current.indices.length - 1 ? { ...current, cursor: current.cursor + 1 } : { indices: [...current.indices, randomTool(current.indices[current.cursor])].slice(-100), cursor: Math.min(current.indices.length, 99) });
    const shuffle = () => setSlides(current => { const indices = [...current.indices.slice(0,current.cursor + 1), randomTool(current.indices[current.cursor])].slice(-100); return { indices, cursor: indices.length - 1 }; });
    const Icon = tool.icon;
    return <section ref={frame} className="landing-spotlight" aria-label={t("Discover tools")} aria-roledescription={t("Carousel")} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
        <div className="landing-spotlight-header"><span>{t("Discover tools")}<span className="landing-spotlight-total">{t("{count} tools", { count: toolsRegistry.length })}</span></span><div><button type="button" aria-label={t(paused ? "Resume tool carousel" : "Pause tool carousel")} onClick={() => setPaused(value => !value)}>{paused ? <PlayCircleOutlined /> : <PauseOutlined />}</button><button type="button" aria-label={t("Show a random tool")} onClick={shuffle}><SwapOutlined /><span>{t("Show a random tool")}</span></button></div></div>
        <div className="landing-spotlight-navigation"><button type="button" aria-label={t("Previous tool")} disabled={slides.cursor === 0} onClick={() => setSlides(current => ({ ...current, cursor: Math.max(0,current.cursor - 1) }))}><LeftOutlined /></button><button type="button" aria-label={t("Next tool")} onClick={next}><RightOutlined /></button></div>
        <div key={tool.id} className="landing-spotlight-slide" aria-roledescription={t("Slide")} aria-live={paused || focused ? "polite" : "off"}>
            <div className="landing-spotlight-copy"><div className="landing-spotlight-category"><Icon /><span>{t(tool.category)}</span></div><h2>{t(tool.name)}</h2><p>{t(tool.description)}</p><Link href={toolPath(tool)} onClick={() => onToolClick(tool.id)}>{t("Open tool")}<ArrowRightOutlined /></Link><span className="landing-spotlight-boundary">{t(BOUNDARY_LABELS[dataBoundaryForTool(tool.id)])}</span></div>
            <div className="landing-spotlight-visual"><ToolVisual tool={tool} /></div>
        </div>
    </section>;
}
