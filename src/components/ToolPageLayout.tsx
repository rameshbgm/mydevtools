"use client";

/* ToolPageLayout — "Press" edition.
 * Editorial header with crumbs, serif title, alpha tag, lede.
 * Learn-more lives in a hairline-bordered "footnote" block (collapsed by default).
 * Functionality preserved 1:1 with the previous layout API.
 */

import React, { useState } from "react";
import Link from "next/link";

interface LearnMore {
    whatIs?: string;
    whyUse?: string;
    howToUse?: string[];
    tips?: string[];
    useCases?: string[];
}

interface ToolPageLayoutProps {
    title: string;
    description: string;
    /** Kept for API compatibility — no longer rendered as a colorful chip. */
    icon?: React.ReactNode;
    /** Kept for API compatibility — accent color is now controlled globally. */
    color?: string;
    children: React.ReactNode;
    alpha?: boolean;
    learnMore?: LearnMore;
}

export default function ToolPageLayout({
    title,
    description,
    children,
    alpha,
    learnMore,
}: Readonly<ToolPageLayoutProps>) {
    const [learnOpen, setLearnOpen] = useState(false);

    return (
        <div style={{ width: "100%" }}>
            <header className="press-toolhead">
                <nav aria-label="Breadcrumb" className="press-toolhead__crumbs">
                    <Link href="/">Index</Link>
                    <span style={{ margin: "0 8px" }}>/</span>
                    <span>{title}</span>
                </nav>
                <h1 className="press-toolhead__title">
                    {title}
                    {alpha && <span className="press-toolhead__alpha">Alpha</span>}
                </h1>
                {description && (
                    <p className="press-toolhead__desc">{description}</p>
                )}
            </header>

            {learnMore && (
                <section className="press-learn">
                    <button
                        type="button"
                        className="press-learn__head press-learn__head--btn"
                        onClick={() => setLearnOpen((v) => !v)}
                        aria-expanded={learnOpen}
                    >
                        <h3>About this tool</h3>
                        <span className="press-learn__toggle">
                            {learnOpen ? "[ −  hide ]" : "[ +  read ]"}
                        </span>
                    </button>

                    <div className="press-learn__body" hidden={!learnOpen}>
                        {learnMore.whatIs && (
                            <div className="press-learn__section">
                                <h4>What it is</h4>
                                <p>{learnMore.whatIs}</p>
                            </div>
                        )}
                        {learnMore.whyUse && (
                            <div className="press-learn__section">
                                <h4>Why use it</h4>
                                <p>{learnMore.whyUse}</p>
                            </div>
                        )}
                        {learnMore.howToUse && learnMore.howToUse.length > 0 && (
                            <div className="press-learn__section">
                                <h4>How to use</h4>
                                <ol>
                                    {learnMore.howToUse.map((step) => (
                                        <li key={step.slice(0, 32)}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        )}
                        {learnMore.useCases && learnMore.useCases.length > 0 && (
                            <div className="press-learn__section">
                                <h4>Use cases</h4>
                                <ul>
                                    {learnMore.useCases.map((u) => (
                                        <li key={u.slice(0, 32)}>{u}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {learnMore.tips && learnMore.tips.length > 0 && (
                            <div className="press-learn__section">
                                <h4>Notes from the editor</h4>
                                <ul>
                                    {learnMore.tips.map((t) => (
                                        <li key={t.slice(0, 32)}>{t}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <div>{children}</div>
        </div>
    );
}
