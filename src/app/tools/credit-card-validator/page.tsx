"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Alert, Tag, InputNumber, Select, Table, Segmented } from "antd";
import { CreditCardOutlined, CopyOutlined, CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import { CARD_TYPES, cardDigits, luhnCheck, detectCardType, generateCardNumber, formatCardNumber } from "@/lib/credit-card";

const { Text, Paragraph } = Typography;

export default function CreditCardValidatorPage() {
    const { t } = useLanguage();
    const [cardNumber, setCardNumber] = useState("");
    const [generateType, setGenerateType] = useState("Visa");
    const [generateCount, setGenerateCount] = useState(5);
    const [generatedCards, setGeneratedCards] = useState<string[]>([]);
    const [generatedType, setGeneratedType] = useState("Visa");
    const [mode, setMode] = useState<"validate" | "generate">("validate");

    const validation = useMemo(() => {
        if (!cardNumber.trim()) return null;
        const digits = cardDigits(cardNumber) ?? "";
        const isValidLuhn = luhnCheck(cardNumber);
        const cardType = detectCardType(digits);
        const isValidLength = cardType ? cardType.lengths.includes(digits.length) : digits.length >= 13 && digits.length <= 19;

        return {
            isValid: isValidLuhn && isValidLength,
            isValidLuhn,
            isValidLength,
            cardType,
            digits,
            formatted: formatCardNumber(digits, cardType?.name),
        };
    }, [cardNumber]);

    const handleGenerate = () => {
        const type = CARD_TYPES.find((t) => t.name === generateType);
        if (!type || !Number.isInteger(generateCount) || generateCount < 1 || generateCount > 100) return;

        const cards: string[] = [];
        for (let i = 0; i < generateCount; i++) {
            cards.push(generateCardNumber(type));
        }
        setGeneratedCards(cards);
        setGeneratedType(type.name);
    };

    const copyCards = () => copyToClipboard(generatedCards.join("\n"), t("Card numbers copied!"));

    return (
        <ToolPageLayout
            title={t("Credit Card Validator & Generator")}
            description={t("Validate card numbers and generate test cards using Luhn algorithm")}
            icon={<CreditCardOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: t("Check number length and the Luhn checksum, with a brand hint from the listed prefix patterns. Generate synthetic numbers for local form tests; no account lookup is performed."),
                howToUse: [t("Enter ASCII digits with spaces or hyphens to check format and checksum. Other characters are rejected. Switch to Generate, choose a brand and count, then copy the results.")],
                tips: [t("A valid checksum does not prove account existence, ownership or payment acceptance. Generated values may overlap allocated numbers; use your provider’s published sandbox fixtures for transaction tests.")],
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Segmented
                        value={mode}
                        onChange={(v) => setMode(v as "validate" | "generate")}
                        options={[
                            { value: "validate", label: t("Validate Card") },
                            { value: "generate", label: t("Generate Test Cards") },
                        ]}
                        block
                        size="large"
                    />
                </Col>

                {mode === "validate" ? (
                    <>
                        <Col xs={24} lg={14}>
                            <Card title={t("Card Number")}>
                                <Input
                                    size="large"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder={t("Enter credit card number...")}
                                    prefix={<CreditCardOutlined />}
                                    style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 2 }}
                                    maxLength={25}
                                    dir="ltr"
                                    aria-label={t("Card number")}
                                />

                                {validation && (
                                    <div style={{ marginTop: 16 }}>
                                        <Alert
                                            type={validation.isValid ? "success" : "error"}
                                            showIcon
                                            icon={validation.isValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                            title={validation.isValid ? t("Checksum and length pass") : t("Checksum or format failed")}
                                            description={
                                                <Space orientation="vertical">
                                                    <Text>{t("Formatted:")} <Text code>{validation.formatted}</Text></Text>
                                                    <Space wrap>
                                                        <Tag color={validation.isValidLuhn ? "green" : "red"}>
                                                            {t("Luhn Check:")} {t(validation.isValidLuhn ? "Pass" : "Fail")}
                                                        </Tag>
                                                        <Tag color={validation.isValidLength ? "green" : "red"}>
                                                            {t("Length: {count} digits", { count: validation.digits.length })}
                                                        </Tag>
                                                        {validation.cardType && (
                                                            <Tag color="blue">{validation.cardType.name}</Tag>
                                                        )}
                                                    </Space>
                                                </Space>
                                            }
                                        />
                                    </div>
                                )}
                            </Card>
                        </Col>

                        <Col xs={24} lg={10}>
                            <Card title={t("Supported Card Types")}>
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={CARD_TYPES.map((t, i) => ({ ...t, key: i }))}
                                    columns={[
                                        {
                                            title: t("Type"),
                                            dataIndex: "name",
                                            render: (name, record) => (
                                                <Tag color={record.color}>{name}</Tag>
                                            ),
                                        },
                                        {
                                            title: t("Prefix"),
                                            dataIndex: "prefixes",
                                            render: (p) => p.slice(0, 2).join(", ") + (p.length > 2 ? "..." : ""),
                                        },
                                        {
                                            title: t("Length"),
                                            dataIndex: "lengths",
                                            render: (l) => l.join(", "),
                                        },
                                    ]}
                                />
                            </Card>
                        </Col>
                    </>
                ) : (
                    <>
                        <Col xs={24} lg={14}>
                            <Card title={t("Generate Test Cards")}>
                                <Space wrap style={{ marginBottom: 16 }}>
                                    <div>
                                        <Text style={{ display: "block", marginBottom: 4 }}>{t("Card Type")}</Text>
                                        <Select aria-label={t("Card Type")}
                                            value={generateType}
                                            onChange={setGenerateType}
                                            style={{ width: 180 }}
                                            options={CARD_TYPES.map((t) => ({ value: t.name, label: t.name }))}
                                        />
                                    </div>
                                    <div>
                                        <Text style={{ display: "block", marginBottom: 4 }}>{t("Count")}</Text>
                                        <InputNumber aria-label={t("Count")}
                                            value={generateCount}
                                            onChange={(v) => setGenerateCount(v || 1)}
                                            min={1}
                                            max={100}
                                            precision={0}
                                            style={{ width: 100 }}
                                        />
                                    </div>
                                    <div style={{ paddingTop: 22 }}>
                                        <Button type="primary" icon={<ReloadOutlined />} disabled={!Number.isInteger(generateCount) || generateCount < 1 || generateCount > 100} onClick={handleGenerate}>
                                            {t("Generate")}</Button>
                                    </div>
                                </Space>

                                {generatedCards.length > 0 && (
                                    <Card
                                        type="inner"
                                        title={t("Generated {brand} Cards", { brand: generatedType })}
                                        extra={
                                            <Button size="small" icon={<CopyOutlined />} onClick={copyCards}>
                                                {t("Copy All")}</Button>
                                        }
                                    >
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            {generatedCards.map((card, i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        padding: "8px 12px",
                                                        background: "rgba(0,0,0,0.02)",
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    <Text code style={{ fontFamily: "monospace", letterSpacing: 1 }}>
                                                        {formatCardNumber(card, generatedType)}
                                                    </Text>
                                                    <Button aria-label={t("Copy")}
                                                        size="small"
                                                        icon={<CopyOutlined />}
                                                        onClick={() => copyToClipboard(card)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                )}
                            </Card>
                        </Col>

                        <Col xs={24} lg={10}>
                            <Alert
                                type="warning"
                                showIcon
                                title={t("Test Cards Only")}
                                description={t("These random values pass a checksum only. No account lookup is performed. Use them for local form tests, and use your provider’s published sandbox fixtures for payment responses.")}
                                style={{ marginBottom: 16 }}
                            />

                            <Card title={t("About Luhn Algorithm")}>
                                <Paragraph type="secondary">
                                    {t("The Luhn algorithm (also known as the \"modulus 10\" algorithm) is a simple checksum formula used to validate credit card numbers, IMEI numbers, and other identification numbers.")}</Paragraph>
                                <Paragraph type="secondary">
                                    {t("It can detect any single-digit error and most transpositions of adjacent digits.")}</Paragraph>
                            </Card>
                        </Col>
                    </>
                )}
            </Row>
        </ToolPageLayout>
    );
}
