"use client";

import sources from "@/lib/reference-sources.json";
import { useLanguage } from "./LanguageProvider";

export default function ReferenceProvenance({ toolId }: { toolId?: string | null }) {
    const { t } = useLanguage();
    const matches = sources.filter((source) => toolId && source.tools.includes(toolId));
    if (!matches.length) return null;
    return (
        <details className="wb-reference-provenance">
            <summary>{t("Standards, sources and review dates")}</summary>
            <ul>
                {matches.map((source) => (
                    <li key={source.id}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer"><bdi dir="ltr">{source.label}</bdi></a>
                        {" · "}<bdi dir="ltr">{source.version}</bdi>{" · "}{t("Reviewed")}{" "}
                        <bdi dir="ltr"><time dateTime={source.verifiedAt}>{source.verifiedAt}</time></bdi>
                        <p>{t(source.scope)} {t("Review interval: {days} days.", { days: source.reviewDays })}</p>
                    </li>
                ))}
            </ul>
            <a href="/guides">{t("Runnable debugging guides")}</a>
        </details>
    );
}
