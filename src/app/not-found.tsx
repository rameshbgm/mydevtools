"use client";
import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightOutlined, HomeOutlined } from "@ant-design/icons";
import { toolsRegistry } from "@/lib/tools-registry";
import { toolPath } from "@/lib/category-routes";
import { useLanguage } from "@/components/LanguageProvider";

function levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let prev = dp[0];
        dp[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const tmp = dp[j];
            dp[j] = a[i - 1] === b[j - 1]
                ? prev
                : 1 + Math.min(prev, dp[j], dp[j - 1]);
            prev = tmp;
        }
    }
    return dp[b.length];
}

export default function NotFound() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const requested = (pathname ?? "").split("/").filter(Boolean).at(-1) ?? "";
    const suggestions = useMemo(() => toolsRegistry.map(tool => ({ tool, score: levenshtein(requested.toLowerCase().replace(/-/g, ""), tool.id.replace(/-/g, "")) })).sort((a,b) => a.score-b.score).slice(0,4).map(item => item.tool), [requested]);
    return <section className="signal-empty-page"><span className="signal-error-code" aria-hidden="true">404</span><h1>{t("Page not found")}</h1><p>{t("We couldn’t find this page.")} <code>{pathname}</code></p><div className="signal-empty-page-links">{suggestions.map(tool => <Link key={tool.id} href={toolPath(tool)}><tool.icon /><span>{t(tool.name)}</span><ArrowRightOutlined /></Link>)}</div><Link className="wb-native-button" href="/"><HomeOutlined /> {t("Go Home")}</Link></section>;
}
