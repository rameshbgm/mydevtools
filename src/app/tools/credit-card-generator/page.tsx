"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button, Card, Space, Typography, Row, Col, Select, InputNumber, Segmented, Tag, Alert } from "antd";
import { CreditCardOutlined, CopyOutlined, ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
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
    return (
        <div
            style={{
                position: "relative",
                aspectRatio: "1.586 / 1",
                minHeight: 200,
                borderRadius: 16,
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
                        "radial-gradient(circle at 82% 12%, rgba(255,255,255,0.28), transparent 45%), radial-gradient(circle at 10% 95%, rgba(255,255,255,0.14), transparent 40%)",
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
                        background: "linear-gradient(135deg, #f6d365 0%, #d4af37 55%, #b8860b 100%)",
                        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
                    }}
                />
                <BrandMark brand={card.brand} />
            </div>

            <button
                type="button"
                onClick={() => onCopy(card.number, "Card number")}
                title="Copy card number"
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
                        Card holder
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {card.holder}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 8, letterSpacing: 1, opacity: 0.7, textTransform: "uppercase" }}>Expires</div>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8 }}>{card.expiry}</div>
                </div>
                <div>
                    <div style={{ fontSize: 8, letterSpacing: 1, opacity: 0.7, textTransform: "uppercase" }}>CVV</div>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8 }}>{card.cvv}</div>
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
        return ["brand,number,cvv,expiry,holder", ...cards.map((c) => `${c.brand},${c.number},${c.cvv},${c.expiry},${c.holder}`)].join("\n");
    }
    return cards.map((c) => c.number).join("\n");
}

export default function CreditCardGeneratorPage() {
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
        setCards(Array.from({ length: count }, () => generateCard(type, len)));
    }, [brand, length, count]);

    // First render gets a deck so the page is never empty. Client-only: the
    // numbers are random, so generating during SSR would break hydration.
    useEffect(() => {
        if (mounted && cards.length === 0) generate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    const handleCopy = useCallback((value: string, label: string) => {
        copyToClipboard(value, `${label} copied`);
    }, []);

    const copyAll = useCallback(() => {
        if (!cards.length) return;
        handleCopy(serialise(cards, format), `${cards.length} cards (${format.toUpperCase()})`);
    }, [cards, format, handleCopy]);

    const download = useCallback(() => {
        if (!cards.length) return;
        const ext = format === "plain" ? "txt" : format;
        const blob = new Blob([serialise(cards, format)], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `test-cards.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    }, [cards, format]);

    return (
        <ToolPageLayout
            title="Credit Card Generator"
            description="Generate Luhn-valid test card numbers for every major brand — with CVV, expiry and card-style preview"
            icon={<CreditCardOutlined />}
            color="#0891b2"
            learnMore={{
                whatIs: "This tool generates syntactically valid credit card numbers for every major brand — Visa, Mastercard, American Express, Discover, JCB, Diners Club, Maestro, UnionPay, RuPay, Elo, Hipercard, Mir, Troy and InterPayment. Each number carries a correct brand prefix (IIN), a supported length, and a valid Luhn (mod-10) check digit, alongside a matching CVV, a future expiry date and a placeholder holder name.",
                whyUse: "Payment forms, checkout flows and validation libraries need input that passes format and checksum checks. Typing a real card number into a dev environment is a genuine security risk. These numbers pass client-side validation but belong to no account and will be declined by every real payment processor.",
                howToUse: [
                    "Pick a card brand — the CVV length and available number lengths follow the brand automatically",
                    "Optionally pin a specific number length; leave it on Any for a random supported length",
                    "Choose how many cards to generate, then press Generate",
                    "Click a card number on the card face to copy just that number",
                    "Use Copy all or Download to export the whole batch as plain text, CSV or JSON",
                ],
                tips: [
                    "These numbers are for testing only — they are not real accounts and cannot be charged",
                    "American Express uses a 4-digit CID; every other brand here uses a 3-digit CVV",
                    "Amex numbers are 15 digits and display in 4-6-5 grouping rather than groups of four",
                    "Payment gateways publish their own sandbox card numbers — use those to test specific approve/decline responses",
                    "Generation runs entirely in your browser; nothing is sent to a server",
                ],
                useCases: [
                    "Filling checkout and payment forms in development and staging",
                    "Testing Luhn validation and brand-detection logic",
                    "Seeding test fixtures and QA datasets",
                    "Verifying card-input masking and formatting in a UI",
                    "Demonstrating payment flows without exposing real card data",
                ],
            }}
        >
            <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                <Alert
                    type="warning"
                    showIcon
                    title="Test data only"
                    description="These numbers pass format and Luhn checks but are not linked to any account. They cannot be used for real payments, and attempting to do so is fraud."
                />

                <Card>
                    <Row gutter={[16, 16]} align="bottom">
                        <Col xs={24} sm={12} md={7}>
                            <Text strong style={{ display: "block", marginBottom: 6 }}>
                                Card brand
                            </Text>
                            {mounted && (
                                <Select
                                    value={brand}
                                    onChange={(v) => {
                                        setBrand(v);
                                        setLength("any");
                                    }}
                                    style={{ width: "100%" }}
                                    options={CARD_TYPES.map((t) => ({ value: t.name, label: t.name }))}
                                />
                            )}
                        </Col>
                        <Col xs={12} sm={12} md={5}>
                            <Text strong style={{ display: "block", marginBottom: 6 }}>
                                Number length
                            </Text>
                            {mounted && (
                                <Select<number | "any">
                                    value={length}
                                    onChange={setLength}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "any" as const, label: "Any" },
                                        ...selectedType.lengths.map((l) => ({ value: l, label: `${l} digits` })),
                                    ]}
                                />
                            )}
                        </Col>
                        <Col xs={12} sm={8} md={4}>
                            <Text strong style={{ display: "block", marginBottom: 6 }}>
                                How many
                            </Text>
                            {mounted && (
                                <InputNumber
                                    min={1}
                                    max={50}
                                    value={count}
                                    onChange={(v) => setCount(v ?? 1)}
                                    style={{ width: "100%" }}
                                />
                            )}
                        </Col>
                        <Col xs={24} sm={16} md={8}>
                            <Space wrap>
                                <Button type="primary" icon={<ReloadOutlined />} onClick={generate}>
                                    Generate
                                </Button>
                                <Button icon={<CopyOutlined />} onClick={copyAll} disabled={!cards.length}>
                                    Copy all
                                </Button>
                                <Button icon={<DownloadOutlined />} onClick={download} disabled={!cards.length}>
                                    Download
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Export format
                        </Text>
                        {mounted && (
                            <Segmented
                                value={format}
                                onChange={(v) => setFormat(v as ExportFormat)}
                                options={[
                                    { value: "plain", label: "Plain" },
                                    { value: "csv", label: "CSV" },
                                    { value: "json", label: "JSON" },
                                ]}
                            />
                        )}
                        <Tag color="blue">CVV {selectedType.cvvLength} digits</Tag>
                        <Tag>Lengths: {selectedType.lengths.join(", ")}</Tag>
                    </div>
                </Card>

                {cards.length > 0 && (
                    <Row gutter={[16, 16]}>
                        {cards.map((card, i) => (
                            <Col xs={24} sm={12} lg={8} key={`${card.number}-${i}`}>
                                <Space orientation="vertical" size={8} style={{ width: "100%" }}>
                                    <CardFace card={card} onCopy={handleCopy} />
                                    <Space size={6} wrap>
                                        <Tag>{card.length} digits</Tag>
                                        <Button
                                            size="small"
                                            icon={<CopyOutlined />}
                                            onClick={() => handleCopy(card.number, "Card number")}
                                        >
                                            Number
                                        </Button>
                                        <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(card.cvv, "CVV")}>
                                            CVV
                                        </Button>
                                    </Space>
                                </Space>
                            </Col>
                        ))}
                    </Row>
                )}

                <Card size="small">
                    <Title level={5} style={{ marginTop: 0 }}>
                        Supported brands
                    </Title>
                    <Space wrap size={[8, 8]}>
                        {CARD_TYPES.map((t) => (
                            <Tag key={t.name} color={t.name === brand ? "blue" : undefined}>
                                {t.name} · {t.lengths.join("/")} digits
                            </Tag>
                        ))}
                    </Space>
                </Card>
            </Space>
        </ToolPageLayout>
    );
}
