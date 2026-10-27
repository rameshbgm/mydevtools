"use client";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowRightOutlined, HistoryOutlined } from "@ant-design/icons";
import { RELEASE_NOTES, KIND_LABEL, APP_VERSION } from "@/lib/release-notes";
import { markReleaseSeen } from "@/lib/release-preference";
import { useLanguage } from "@/components/LanguageProvider";

export default function ReleaseNotesPage() {
    const { t, language } = useLanguage();
    useEffect(() => { if (RELEASE_NOTES.some(release => release.version === APP_VERSION)) markReleaseSeen(APP_VERSION); }, []);
    return <div className="signal-release-page"><header className="signal-document-header"><h1><HistoryOutlined />{t("Release notes")}</h1><p>{t("What’s new in {version}", { version: APP_VERSION })}</p></header>
        <div className="signal-release-list">{RELEASE_NOTES.map((release, index) => <article key={`${release.version}-${release.date}`} id={`release-${release.version}`} className="signal-release wb-release-anchor"><header className="signal-release-heading"><span className="signal-release-version">v{release.version}</span><h2>{t(release.title)}</h2><time dateTime={release.date}>{new Date(`${release.date}T12:00:00Z`).toLocaleDateString(language, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time></header>{release.summary && <p>{t(release.summary)}</p>}<details open={index === 0}><summary>{t(KIND_LABEL[release.kind])} · {t("Release details")}</summary><div className="signal-release-sections">{release.sections.map(section => <section key={section.label}><h3>{t(section.label)}</h3><ul>{section.bullets.map(bullet => <li key={bullet}>{t(bullet)}</li>)}</ul></section>)}</div></details></article>)}</div>
        <Link href="/#landing-full-catalog" className="signal-release-catalog">{t("Open the catalog")} <ArrowRightOutlined /></Link>
    </div>;
}
