"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { App, Button, ConfigProvider, Drawer, Grid, Layout, Menu, Tooltip } from "antd";
import { CodeOutlined, DatabaseOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SearchOutlined, StarOutlined, SunOutlined } from "@ant-design/icons";
import { getToolsByCategory, CATEGORY_ICONS, ALPHA_CATEGORIES, toolsRegistry, type ToolCategory } from "@/lib/tools-registry";
import { getToolIdFromPublicPath, toolPath } from "@/lib/category-routes";
import { setMessageInstance } from "@/lib/messageService";
import { useAppStore } from "@/lib/store";
import { signalTheme } from "@/lib/signal-theme";
import { useLanguage } from "./LanguageProvider";
import AppFooter from "./AppFooter";
import NavigationLoader from "./NavigationLoader";
import ProjectSwitcher from "./ProjectSwitcher";
import LanguagePicker from "./LanguagePicker";
import enUS from "antd/locale/en_US";
import hiIN from "antd/locale/hi_IN";
import esES from "antd/locale/es_ES";
import frFR from "antd/locale/fr_FR";
import deDE from "antd/locale/de_DE";
import jaJP from "antd/locale/ja_JP";
import zhCN from "antd/locale/zh_CN";
import arEG from "antd/locale/ar_EG";

const componentLocales = { en: enUS, hi: hiIN, es: esES, fr: frFR, de: deDE, ja: jaJP, zh: zhCN, ar: arEG };
const CommandPalette = dynamic(() => import("./WorkspaceOverlays").then(m => m.CommandPalette), { ssr: false });
const BookmarkButton = dynamic(() => import("./WorkspaceOverlays").then(m => m.BookmarkButton), { ssr: false });
const ShortcutsHelp = dynamic(() => import("./ShortcutsHelp"), { ssr: false });
const { Sider, Header, Content } = Layout;

function MessageBridge() {
    const { message } = App.useApp();
    useEffect(() => { setMessageInstance(message); }, [message]);
    return null;
}

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
    const { language, direction, t } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === "/";
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.lg;
    const { darkMode, toggleDarkMode, sidebarCollapsed, toggleSidebar, setNavigating } = useAppStore();
    const [commandOpen, setCommandOpen] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);
    const [bookmarksLoaded, setBookmarksLoaded] = useState(false);
    const [embedded, setEmbedded] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [landingSection, setLandingSection] = useState<"tools" | "data" | null>(null);
    const currentToolId = getToolIdFromPublicPath(pathname);
    const currentTool = toolsRegistry.find(tool => tool.id === currentToolId);
    const activeCategory = currentTool?.category ?? null;
    const [openKey, setOpenKey] = useState<string | null>(activeCategory);
    const [popupKey, setPopupKey] = useState<string | null>(null);
    const collapsedMenu = sidebarCollapsed && !isMobile;
    const categorized = useMemo(() => getToolsByCategory(), []);
    const appTheme = useMemo(() => signalTheme(darkMode), [darkMode]);
    const navigate = React.useCallback((path: string) => {
        if (path === pathname) return;
        setNavigating(true, getToolIdFromPublicPath(path));
        router.push(path);
    }, [pathname, router, setNavigating]);

    useEffect(() => { setEmbedded(window.parent !== window); setHydrated(true); }, []);
    useEffect(() => {
        const updateSection = () => {
            const hash = window.location.hash;
            setLandingSection(hash === "#landing-data-boundary" ? "data" : hash === "#landing-full-catalog" || hash.startsWith("#category-") ? "tools" : null);
        };
        updateSection();
        window.addEventListener("hashchange", updateSection);
        return () => window.removeEventListener("hashchange", updateSection);
    }, [pathname]);
    useEffect(() => {
        setPopupKey(null);
        if (!collapsedMenu) setOpenKey(activeCategory);
    }, [pathname, activeCategory, collapsedMenu]);
    useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); document.documentElement.style.colorScheme = darkMode ? "dark" : "light"; }, [darkMode]);
    useEffect(() => {
        setMobileDrawerOpen(false);
        if (currentToolId && !window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname, currentToolId]);
    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") { event.preventDefault(); setCommandOpen(v => !v); return; }
            const target = event.target as HTMLElement;
            if (event.key === "?" && !event.metaKey && !event.ctrlKey && !event.altKey && !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) && !target.isContentEditable) { event.preventDefault(); setShortcutsOpen(v => !v); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const menuItems = useMemo(() => [
        { key: "/", icon: <HomeOutlined />, label: t("Dashboard") },
        ...[...categorized.entries()].map(([category, tools]) => {
            const Icon = CATEGORY_ICONS[category as ToolCategory];
            return { key: category, icon: <Icon />, label: <span className="signal-category-label"><span>{t(category)}</span>{ALPHA_CATEGORIES.includes(category as ToolCategory) ? <small>ALPHA</small> : <small>{tools.length}</small>}</span>, children: tools.map(tool => ({ key: toolPath(tool), icon: <tool.icon />, label: <span className="signal-menu-tool">{t(tool.name)}</span> })) };
        }),
    ], [categorized, t]);
    const sidebar = <>
        <div className="signal-sidebar-brand">
            <Link href="/" className="signal-brand" aria-label="My Dev Tools"><span className="signal-brand-symbol"><CodeOutlined /></span>{(!sidebarCollapsed || isMobile) && <span>mydevtools<span className="signal-brand-dot">.</span></span>}</Link>
            {(!sidebarCollapsed || isMobile) && <div className="signal-brand-meta"><span>{t("Developer Toolkit")}</span></div>}
        </div>
        {(!sidebarCollapsed || isMobile) && <div className="signal-sidebar-caption"><span>{t("All tools")}</span><span>{toolsRegistry.length}</span></div>}
        <Menu className="signal-sidebar-menu" classNames={{ popup: { root: "signal-sidebar-popup" } }} mode="inline" selectedKeys={[pathname]} openKeys={collapsedMenu ? popupKey ? [popupKey] : [] : openKey ? [openKey] : []} onOpenChange={keys => collapsedMenu ? setPopupKey(keys.at(-1) ?? null) : setOpenKey(keys.find(key => key !== openKey) ?? null)} items={menuItems} onClick={({ key }) => { setPopupKey(null); if (key.startsWith("/")) navigate(key); }} />
        {(!sidebarCollapsed || isMobile) && <div className="signal-sidebar-links"><Link href="/release-notes" aria-current={pathname === "/release-notes" ? "page" : undefined}>{t("Release notes")}</Link></div>}
    </>;

    if (embedded) return <ConfigProvider locale={componentLocales[language]} direction={direction} theme={appTheme}><App><MessageBridge /><main className="wb-embedded-content signal-app" data-signal-ready={hydrated}>{children}</main></App></ConfigProvider>;
    return <ConfigProvider locale={componentLocales[language]} direction={direction} theme={appTheme}><App>
        <MessageBridge /><NavigationLoader />
        {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} darkMode={darkMode} />}
        {shortcutsOpen && <ShortcutsHelp onClose={() => setShortcutsOpen(false)} />}
        <a className="signal-skip-link" href="#signal-main">{t("Skip to main content")}</a>
        <Layout className="wb-shell-layout signal-app" data-signal-brand="2.1" data-signal-ready={hydrated}>
            {!isHome && <Sider className="wb-shell-sider wb-desktop-sidebar" collapsible collapsed={sidebarCollapsed} onCollapse={toggleSidebar} trigger={null} width={248} collapsedWidth={64}>{sidebar}</Sider>}
            {!isHome && <Drawer placement={direction === "rtl" ? "right" : "left"} open={isMobile && mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} size={Math.min(288, typeof window !== "undefined" ? window.innerWidth - 48 : 288)} classNames={{ body: "wb-shell-drawer-body", mask: "wb-shell-drawer-mask" }} styles={{ body: { padding: 0 }, header: { display: "none" } }}>{sidebar}</Drawer>}
            <Layout className={`wb-shell-content-frame${isHome ? " signal-home-frame" : sidebarCollapsed ? " wb-sidebar-collapsed" : ""}`}>
                <Header className={`wb-shell-header signal-header${isHome ? " signal-home-header" : ""}`}>
                    {isHome ? <><Link className="signal-brand" href="/" aria-label="My Dev Tools"><span className="signal-brand-symbol"><CodeOutlined /></span><span>mydevtools<span className="signal-brand-dot">.</span></span></Link><nav className="signal-home-navigation" aria-label={t("Introduction sections")}><a href="#landing-full-catalog" aria-current={landingSection === "tools" ? "location" : undefined} onClick={() => setLandingSection("tools")}>{t("All tools")}</a><a href="#landing-data-boundary" aria-current={landingSection === "data" ? "location" : undefined} onClick={() => setLandingSection("data")}>{t("Your data")}</a></nav></> : <><Tooltip title={t(isMobile ? "Open menu" : sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar")}><Button type="text" aria-label={t(isMobile ? "Open menu" : sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar")} icon={sidebarCollapsed || isMobile ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => isMobile ? setMobileDrawerOpen(true) : toggleSidebar()} /></Tooltip><div className="signal-header-location"><Link href="/">{t("Workspace")}</Link>{currentTool && <><span aria-hidden="true">/</span><strong>{t(currentTool.name)}</strong></>}</div></>}
                    <button className="signal-search-trigger" onClick={() => setCommandOpen(true)} aria-label={`${t("Search tools…")} ⌘K`}><SearchOutlined /><span>{t("Search tools…")}</span><kbd>⌘K</kbd></button>
                    <div className="signal-header-actions">
                        <Tooltip title={t("Memory & Storage Manager")}><Button type="text" aria-label={t("Memory & Storage Manager")} icon={<DatabaseOutlined />} onClick={() => navigate("/memory")} /></Tooltip>
                        <Tooltip title={t(darkMode ? "Switch to Light Mode" : "Switch to Dark Mode")}><Button type="text" aria-label={t(darkMode ? "Switch to Light Mode" : "Switch to Dark Mode")} icon={darkMode ? <SunOutlined /> : <MoonOutlined />} onClick={toggleDarkMode} /></Tooltip>
                        {bookmarksLoaded ? <BookmarkButton darkMode={darkMode} currentToolId={currentToolId} onNavigate={navigate} /> : <Button type="text" aria-label={t("Open bookmarks")} icon={<StarOutlined />} onClick={() => setBookmarksLoaded(true)} />}
                        <LanguagePicker />
                    </div>
                </Header>
                <Content className={`signal-content${isHome ? " signal-home-content" : ""}`} id="signal-main" tabIndex={-1}>{!isHome && <ProjectSwitcher />}{children}</Content>
                <AppFooter />
            </Layout>
        </Layout>
    </App></ConfigProvider>;
}
