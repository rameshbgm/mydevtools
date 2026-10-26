"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button, Card, Space, Typography, Row, Col, Select, InputNumber, Segmented, Tag, Alert } from "antd";
import { CreditCardOutlined, CopyOutlined, ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import { downloadText } from "@/lib/download";
import { tableToCsv } from "@/lib/table-export";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import { CARD_TYPES, generateCard, type GeneratedCard } from "@/lib/credit-card";

const { Text, Title } = Typography;

type ExportFormat = "plain" | "csv" | "json";

/** Card-face brand mark. Simple wordmark — no third-party logo assets. */
function BrandMark({ brand }: Readonly<{ brand: string }>) {
    return (
        <span
            style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                opacity: 0.95,
            }}
        >
            {brand}
        </span>
    );
}

/** A card rendered to look like a real one: gradient face, chip, embossed digits. */
function CardFace({ card, onCopy }: Readonly<{ card: GeneratedCard; onCopy: (v: string, label: string) => void }>) {
    const { t } = useLanguage();
    return (
        <div
            style={{
                position: "relative",
                aspectRatio: "1.586 / 1",
                minHeight: 200,
                borderRadius: 6,
                padding: 22,
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}cc 45%, #0f172a 140%)`,
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.28)",
                overflow: "hidden",
            }}
        >
            {/* Sheen */}
            <div
                aria-hidden
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "var(--wb-card-bg)",
                    pointerEvents: "none",
                }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 }}>
                {/* EMV chip */}
                <div
                    aria-hidden
                    style={{
                        width: 42,
                        height: 32,
                        borderRadius: 6,
                        background: "var(--wb-card-bg)",
                        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
                    }}
                />
                <BrandMark brand={card.brand} />
            </div>

            <button dir="ltr"
                type="button"
                onClick={() => onCopy(card.number, "Card number")}
                title={t("Copy card number")}
                style={{
                    zIndex: 1,
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
                    // ponytail: scale the type to the digit count so 19-digit
                    // numbers (Visa/Maestro/UnionPay) stay on one line like a real card.
                    fontSize: card.length > 16 ? "clamp(12px, 1.6vw, 15px)" : "clamp(14px, 2vw, 19px)",
                    letterSpacing: card.length > 16 ? 0.6 : 1.4,
                    fontWeight: 600,
                    textShadow: "0 1px 2px rgba(0,0,0,0.35)",
                    whiteSpace: "nowrap",
                    width: "100%",
                }}
            >
                {card.formatted}
            </button>

            <div style={{ display: "flex", gap: 20, alignItems: "flex-end", zIndex: 1 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 8, letterSpacing: 1, opacity: 0.7, textTransform: "uppercase" }}>
                        {t("Card holder")}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {card.holder}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 8, letterSpacing: 1, opacity: 0.7, textTransform: "uppercase" }}>{t("Expires")}</div>
                    <div dir="ltr" style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8 }}>{card.expiry}</div>
                </div>
                <div>
                    <div style={{ fontSize: 8, letterSpacing: 1, opacity: 0.7, textTransform: "uppercase" }}>{t("CVV")}</div>
                    <div dir="ltr" style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8 }}>{card.cvv}</div>
                </div>
            </div>
        </div>
    );
}

function serialise(cards: GeneratedCard[], format: ExportFormat): string {
    if (format === "json") {
        return JSON.stringify(
            cards.map((c) => ({
                brand: c.brand,
                number: c.number,
                cvv: c.cvv,
                expiry: c.expiry,
                holder: c.holder,
            })),
            null,
            2
        );
    }
    if (format === "csv") {
        return tableToCsv(["brand", "number", "cvv", "expiry", "holder"], cards.map((card) => [card.brand, card.number, card.cvv, card.expiry, card.holder]), false);
    }
    return cards.map((c) => c.number).join("\n");
}

export default function CreditCardGeneratorPage() {
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [brand, setBrand] = useState<string>("Visa");
    // "any" = let the generator pick a random supported length for the brand.
    const [length, setLength] = useState<number | "any">("any");
    const [count, setCount] = useState(4);
    const [format, setFormat] = useState<ExportFormat>("plain");
    const [cards, setCards] = useState<GeneratedCard[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const selectedType = CARD_TYPES.find((t) => t.name === brand) ?? CARD_TYPES[0];

    const generate = useCallback(() => {
        const type = CARD_TYPES.find((t) => t.name === brand) ?? CARD_TYPES[0];
        const len = length !== "any" && type.lengths.includes(length) ? length : undefined;
        if (!Number.isInteger(count) || count < 1 || count > 50) return;
        setCards(Array.from({ length: count }, () => generateCard(type, len)));
    }, [brand, length, count]);

    // First render gets a deck so the page is never empty. Client-only: the
    // numbers are random, so generating during SSR would break hydration.
    useEffect(() => {
        if (mounted && cards.length === 0) generate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    const handleCopy = useCallback((value: string, label: string) => {
        copyToClipboard(value, t("{label} copied", { label: t(label) }));
    }, [t]);

    const copyAll = useCallback(() => {
        if (!cards.length) return;
        copyToClipboard(serialise(cards, format), t("{count} cards ({format}) copied", { count: cards.length, format: format === "plain" ? t("Plain") : format.toUpperCase() }));
    }, [cards, format, t]);

    const download = useCallback(() => {
        if (!cards.length) return;
        const ext = format === "plain" ? "txt" : format;
        const mime = format === "json" ? "application/json;charset=utf-8" : format === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8";
        downloadText(serialise(cards, format), `test-cards.${ext}`, mime);
    }, [cards, format]);

    return (
        <ToolPageLayout
            title={t("Credit Card Generator")}
            description={t("Generate synthetic Luhn-valid card fixtures with security codes and expiry dates")}
            icon={<CreditCardOutlined />}
            color="#0891b2"
            learnMore={{
                whatIs: t("Generate synthetic format fixtures from the listed prefix and length patterns, with a Luhn check digit, synthetic security code, future expiry and placeholder holder. Brand patterns are hints, not issuer lookups."),
                howToUse: [t("Choose a brand, an optional supported length and a count. Generate, copy a single value or export the batch as plain text, CSV or JSON. Changing settings does not change an existing batch until you generate again.")],
                tips: [t("No account lookup or transaction is performed. Account allocation and payment responses are unknown; use provider-published sandbox fixtures for transaction tests. Everything is generated locally."), t("American Express uses a 4-digit security code and 15-digit number displayed in 4-6-5 groups. Other listed brands use 3-digit security codes. Exported field names and generated data are not translated.")],
            }}
        >
            <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                <Alert
                    type="warning"
                    showIcon
                    title={t("Test data only")}
                    description={t("Synthetic format fixtures only. No account lookup is performed, and payment outcomes are unknown. Use your provider’s published sandbox fixtures for transaction tests.")}
                />

                <Card>
                    <Row gutter={[16, 16]} align="bottom">
                        <Col xs={24} sm={12} md={7}>
                            <Text strong style={{ display: "block", marginBottom: 6 }}>
                                {t("Card brand")}</Text>
                            {mounted && (
                                <Select aria-label={t("Card brand")}
                                    value={brand}
                                    onChange={(v) => {
                                        setBrand(v);
                                        setLength("any");
                                    }}
                                    style={{ width: "100%" }}
                                    options={CARD_TYPES.map((type) => ({ value: type.name, label: type.name }))}
                                />
                            )}
                        </Col>
                        <Col xs={12} sm={12} md={5}>
                            <Text strong style={{ display: "block", marginBottom: 6 }}>
                                {t("Number length")}</Text>
                            {mounted && (
                                <Select<number | "any"> aria-label={t("Number length")}
                                    value={length}
                                    onChange={setLength}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "any" as const, label: t("Any") },
                                        ...selectedType.lengths.map((l) => ({ value: l, label: t("{count} digits", { count: l }) })),
                                    ]}
                                />
                            )}
                        </Col>
                        <Col xs={12} sm={8} md={4}>
                            <Text strong style={{ display: "block", marginBottom: 6 }}>
                                {t("How many")}</Text>
                            {mounted && (
                                <InputNumber aria-label={t("How many")}
                                    min={1}
                                    max={50}
                                    precision={0}
                                    value={count}
                                    onChange={(v) => setCount(v ?? 1)}
                                    style={{ width: "100%" }}
                                />
                            )}
                        </Col>
                        <Col xs={24} sm={16} md={8}>
                            <Space wrap>
                                <Button type="primary" icon={<ReloadOutlined />} disabled={!Number.isInteger(count) || count < 1 || count > 50} onClick={generate}>
                                    {t("Generate")}</Button>
                                <Button icon={<CopyOutlined />} onClick={copyAll} disabled={!cards.length}>
                                    {t("Copy all")}</Button>
                                <Button icon={<DownloadOutlined />} onClick={download} disabled={!cards.length}>
                                    {t("Download")}</Button>
                            </Space>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {t("Export format")}</Text>
                        {mounted && (
                            <Segmented
                                value={format}
                                onChange={(v) => setFormat(v as ExportFormat)}
                                options={[
                                    { value: "plain", label: t("Plain") },
                                    { value: "csv", label: "CSV" },
                                    { value: "json", label: "JSON" },
                                ]}
                            />
                        )}
                        <Tag color="blue">{t("Security code: {count} digits", { count: selectedType.cvvLength })}</Tag>
                        <Tag>{t("Lengths: {lengths}", { lengths: selectedType.lengths.join(", ") })}</Tag>
                    </div>
                </Card>

                {cards.length > 0 && (
                    <Row gutter={[16, 16]}>
                        {cards.map((card, i) => (
                            <Col xs={24} sm={12} lg={8} key={`${card.number}-${i}`}>
                                <Space orientation="vertical" size={8} style={{ width: "100%" }}>
                                    <CardFace card={card} onCopy={handleCopy} />
                                    <Space size={6} wrap>
                                        <Tag>{t("{count} digits", { count: card.length })}</Tag>
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => handleCopy(card.number, "Card number")}
                                        >
                                            {t("Number")}</Button>
                                        <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(card.cvv, "CVV")}>
                                            {t("CVV")}</Button>
                                    </Space>
                                </Space>
                            </Col>
                        ))}
                    </Row>
                )}

                <Card size="small">
                    <Title level={5} style={{ marginTop: 0 }}>
                        {t("Supported brands")}</Title>
                    <Space wrap size={[8, 8]}>
                        {CARD_TYPES.map((type) => (
                            <Tag key={type.name} color={type.name === brand ? "blue" : undefined}>
                                {type.name} · {type.lengths.join("/")} {t("digits")}
                            </Tag>
                        ))}
                    </Space>
                </Card>
            </Space>
        </ToolPageLayout>
    );
}
