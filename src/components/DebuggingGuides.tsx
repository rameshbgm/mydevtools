"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { DEBUGGING_GUIDES } from "@/lib/debugging-guides";
import { guideExampleHref } from "@/lib/guide-examples";

export default function DebuggingGuides() {
    const { t } = useLanguage();
    return <section className="wb-workbench wb-debugging-guides" aria-labelledby="debugging-guides-title">
        <h1 id="debugging-guides-title">{t("Debugging guides")}</h1>
        <p>{t("Use public fixtures to test a specific result, then repeat with your own input. Example loaders fill forms; network requests require an explicit tool action.")}</p>
        <nav aria-label={t("Guide topics")}>
            {DEBUGGING_GUIDES.map((guide) => <p key={guide.id}><a href={`#${guide.id}`}>{t(guide.title)}</a></p>)}
        </nav>
        {DEBUGGING_GUIDES.map((guide) => <article key={guide.id} id={guide.id}>
            <h2>{t(guide.title)}</h2>
            <p>{t(guide.explanation)}</p>
            <ol>{guide.steps.map((step) => <li key={step}>{t(step)}</li>)}</ol>
            <details><summary>{t("Public example")}</summary><pre dir="ltr" tabIndex={0}>{guide.example}</pre></details>
            <p><strong>{t("Expected result:")}</strong> {t(guide.expected)}</p>
            <Link className="wb-native-button" prefetch={false} href={guideExampleHref(guide)}>{t(guide.id === "cors" ? "Open CORS Tester" : "Load example in tool")}</Link>
            <p><a href={guide.source} target="_blank" rel="noopener noreferrer">{t("Primary reference")}</a></p>
        </article>)}
    </section>;
}
