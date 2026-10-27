"use client";
import Link from "next/link";
import { GiftOutlined, GithubOutlined, LinkedinOutlined, UserOutlined } from "@ant-design/icons";
import { APP_VERSION } from "@/lib/app-version";
import { toolsRegistry } from "@/lib/tools-registry";
import { useLanguage } from "./LanguageProvider";
import PwaInstallButton from "./PwaInstallButton";
import WhatsNewLink from "./WhatsNewLink";

export default function AppFooter() {
    const { t } = useLanguage();
    return <footer className="wb-footer"><div className="signal-footer">
        <div className="signal-footer-summary"><span>© {new Date().getFullYear()} My Dev Tools</span><WhatsNewLink /><span>{t("{count} tools", { count: toolsRegistry.length })}</span><span>{t("Client-side by default · see each tool for details")}</span><PwaInstallButton /></div>
        <nav aria-label={t("Resources")}><Link className="signal-footer-resource signal-footer-releases" href="/release-notes"><GiftOutlined />{t("Release notes")} · {APP_VERSION}</Link><a className="signal-footer-resource signal-footer-author" href="https://rameshsnotebook.com/" target="_blank" rel="noopener noreferrer"><UserOutlined />Ramesh Maharaddi</a><a className="signal-footer-social signal-footer-github" href="https://github.com/rameshbgm/mydevtools" target="_blank" rel="noopener noreferrer" aria-label={t("GitHub profile")}><GithubOutlined /></a><a className="signal-footer-social signal-footer-linkedin" href="https://www.linkedin.com/in/rameshbgm/" target="_blank" rel="noopener noreferrer" aria-label={t("LinkedIn profile")}><LinkedinOutlined /></a></nav>
    </div></footer>;
}
