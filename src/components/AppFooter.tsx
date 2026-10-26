"use client";
import Link from "next/link";
import { GithubOutlined, LinkedinOutlined } from "@ant-design/icons";
import { APP_VERSION } from "@/lib/app-version";
import { toolsRegistry } from "@/lib/tools-registry";
import { useLanguage } from "./LanguageProvider";
import PwaInstallButton from "./PwaInstallButton";

export default function AppFooter() {
    const { t } = useLanguage();
    return <footer className="wb-footer"><div className="signal-footer">
        <span>© {new Date().getFullYear()} My Dev Tools</span>
        <nav aria-label={t("Resources")}><Link href="/guides">{t("Debugging guides")}</Link><Link href="/release-notes">{t("Release notes")} · {APP_VERSION}</Link><a href="https://rameshsnotebook.com/" target="_blank" rel="noopener noreferrer">Ramesh Maharaddi</a><a href="https://github.com/rameshbgm/mydevtools" target="_blank" rel="noopener noreferrer" aria-label={t("GitHub profile")}><GithubOutlined /></a><a href="https://www.linkedin.com/in/rameshbgm/" target="_blank" rel="noopener noreferrer" aria-label={t("LinkedIn profile")}><LinkedinOutlined /></a></nav>
        <div className="signal-footer-meta"><span>{t("{count} tools", { count: toolsRegistry.length })}</span><span>{t("Client-side by default · see each tool for details")}</span><PwaInstallButton /></div>
    </div></footer>;
}
