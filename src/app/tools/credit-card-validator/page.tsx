"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, message, Alert, Tag, InputNumber, Select, Table, Segmented } from "antd";
import { CreditCardOutlined, CopyOutlined, CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;

interface CardType {
    name: string;
    prefixes: number[];
    lengths: number[];
    color: string;
}

const CARD_TYPES: CardType[] = [
    { name: "Visa", prefixes: [4], lengths: [13, 16, 19], color: "#1a1f71" },
    { name: "Mastercard", prefixes: [51, 52, 53, 54, 55, 2221, 2720], lengths: [16], color: "#eb001b" },
    { name: "American Express", prefixes: [34, 37], lengths: [15], color: "#006fcf" },
    { name: "Discover", prefixes: [6011, 644, 645, 646, 647, 648, 649, 65], lengths: [16, 19], color: "#ff6000" },
    { name: "JCB", prefixes: [3528, 3589], lengths: [16, 19], color: "#0b4ea2" },
    { name: "Diners Club", prefixes: [300, 301, 302, 303, 304, 305, 36, 38], lengths: [14, 16, 19], color: "#004c97" },
    { name: "Maestro", prefixes: [5018, 5020, 5038, 5893, 6304, 6759, 6761, 6762, 6763], lengths: [12, 13, 14, 15, 16, 17, 18, 19], color: "#cc0000" },
];

function luhnCheck(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, "");
    if (!digits) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

function detectCardType(cardNumber: string): CardType | null {
    const digits = cardNumber.replace(/\D/g, "");

    for (const cardType of CARD_TYPES) {
        for (const prefix of cardType.prefixes) {
            if (digits.startsWith(prefix.toString())) {
                return cardType;
            }
        }
    }

    return null;
}

function generateCardNumber(cardType: CardType): string {
    const prefix = cardType.prefixes[Math.floor(Math.random() * cardType.prefixes.length)];
    const length = cardType.lengths[Math.floor(Math.random() * cardType.lengths.length)];

    let number = prefix.toString();

    // Generate random digits (leaving last digit for checksum)
    while (number.length < length - 1) {
        number += Math.floor(Math.random() * 10);
    }

    // Calculate Luhn checksum digit
    let sum = 0;
    let isEven = true;

    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return number + checkDigit;
}

function formatCardNumber(number: string): string {
    const digits = number.replace(/\D/g, "");
    const groups = [];

    for (let i = 0; i < digits.length; i += 4) {
        groups.push(digits.slice(i, i + 4));
    }

    return groups.join(" ");
}

export default function CreditCardValidatorPage() {
    const [cardNumber, setCardNumber] = useState("");
    const [generateType, setGenerateType] = useState("Visa");
    const [generateCount, setGenerateCount] = useState(5);
    const [generatedCards, setGeneratedCards] = useState<string[]>([]);
    const [mode, setMode] = useState<"validate" | "generate">("validate");

    const validation = useMemo(() => {
        const digits = cardNumber.replace(/\D/g, "");
        if (!digits) return null;

        const isValidLuhn = luhnCheck(digits);
        const cardType = detectCardType(digits);
        const isValidLength = cardType ? cardType.lengths.includes(digits.length) : digits.length >= 13 && digits.length <= 19;

        return {
            isValid: isValidLuhn && isValidLength,
            isValidLuhn,
            isValidLength,
            cardType,
            digits,
            formatted: formatCardNumber(digits),
        };
    }, [cardNumber]);

    const handleGenerate = () => {
        const type = CARD_TYPES.find((t) => t.name === generateType);
        if (!type) return;

        const cards: string[] = [];
        for (let i = 0; i < generateCount; i++) {
            cards.push(generateCardNumber(type));
        }
        setGeneratedCards(cards);
    };

    const copyCards = () => {
        navigator.clipboard.writeText(generatedCards.join("\n"));
        message.success("Card numbers copied!");
    };

    return (
        <ToolPageLayout
            title="Credit Card Validator & Generator"
            description="Validate card numbers and generate test cards using Luhn algorithm"
            icon={<CreditCardOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "This tool validates credit card numbers using the Luhn algorithm (checksum) and identifies the card brand. It can also generate valid test card numbers for development purposes.",
                whyUse: "Developers need to test payment flows without real cards. This tool validates card format before API calls and generates test numbers that pass basic validation but aren't real accounts.",
                howToUse: [
                    "Enter a card number to validate its format and checksum",
                    "View detected card brand (Visa, Mastercard, Amex, etc.)",
                    "Switch to Generate mode to create test card numbers",
                    "Copy generated cards for use in development"
                ],
                tips: [
                    "Generated cards are for testing only - they're not real!",
                    "Luhn validation catches typos but doesn't verify account existence",
                    "Different card brands have different number patterns",
                    "Use with test mode in Stripe, PayPal, or other payment gateways"
                ],
                useCases: [
                    "Testing payment form validation logic",
                    "Generating test data for e-commerce development",
                    "Verifying card number input before API submission",
                    "Learning about card number patterns and checksums"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Segmented
                        value={mode}
                        onChange={(v) => setMode(v as "validate" | "generate")}
                        options={[
                            { value: "validate", label: "Validate Card" },
                            { value: "generate", label: "Generate Test Cards" },
                        ]}
                        block
                        size="large"
                    />
                </Col>

                {mode === "validate" ? (
                    <>
                        <Col xs={24} lg={14}>
                            <Card title="Card Number">
                                <Input
                                    size="large"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="Enter credit card number..."
                                    prefix={<CreditCardOutlined />}
                                    style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: 2 }}
                                    maxLength={25}
                                />

                                {validation && (
                                    <div style={{ marginTop: 16 }}>
                                        <Alert
                                            type={validation.isValid ? "success" : "error"}
                                            showIcon
                                            icon={validation.isValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                            message={validation.isValid ? "Valid Card Number" : "Invalid Card Number"}
                                            description={
                                                <Space orientation="vertical">
                                                    <Text>Formatted: <Text code>{validation.formatted}</Text></Text>
                                                    <Space wrap>
                                                        <Tag color={validation.isValidLuhn ? "green" : "red"}>
                                                            Luhn Check: {validation.isValidLuhn ? "Pass" : "Fail"}
                                                        </Tag>
                                                        <Tag color={validation.isValidLength ? "green" : "red"}>
                                                            Length: {validation.digits.length} digits
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
                            <Card title="Supported Card Types">
                                <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={CARD_TYPES.map((t, i) => ({ ...t, key: i }))}
                                    columns={[
                                        {
                                            title: "Type",
                                            dataIndex: "name",
                                            render: (name, record) => (
                                                <Tag color={record.color}>{name}</Tag>
                                            ),
                                        },
                                        {
                                            title: "Prefix",
                                            dataIndex: "prefixes",
                                            render: (p) => p.slice(0, 2).join(", ") + (p.length > 2 ? "..." : ""),
                                        },
                                        {
                                            title: "Length",
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
                            <Card title="Generate Test Cards">
                                <Space wrap style={{ marginBottom: 16 }}>
                                    <div>
                                        <Text style={{ display: "block", marginBottom: 4 }}>Card Type</Text>
                                        <Select
                                            value={generateType}
                                            onChange={setGenerateType}
                                            style={{ width: 180 }}
                                            options={CARD_TYPES.map((t) => ({ value: t.name, label: t.name }))}
                                        />
                                    </div>
                                    <div>
                                        <Text style={{ display: "block", marginBottom: 4 }}>Count</Text>
                                        <InputNumber
                                            value={generateCount}
                                            onChange={(v) => setGenerateCount(v || 1)}
                                            min={1}
                                            max={100}
                                            style={{ width: 100 }}
                                        />
                                    </div>
                                    <div style={{ paddingTop: 22 }}>
                                        <Button type="primary" icon={<ReloadOutlined />} onClick={handleGenerate}>
                                            Generate
                                        </Button>
                                    </div>
                                </Space>

                                {generatedCards.length > 0 && (
                                    <Card
                                        type="inner"
                                        title={`Generated ${generateType} Cards`}
                                        extra={
                                            <Button size="small" icon={<CopyOutlined />} onClick={copyCards}>
                                                Copy All
                                            </Button>
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
                                                        {formatCardNumber(card)}
                                                    </Text>
                                                    <Button
                                                        size="small"
                                                        icon={<CopyOutlined />}
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(card);
                                                            message.success("Copied!");
                                                        }}
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
                                message="Test Cards Only"
                                description="These are randomly generated numbers that pass Luhn validation. They are NOT real credit cards and cannot be used for actual transactions. Use only for testing purposes."
                                style={{ marginBottom: 16 }}
                            />

                            <Card title="About Luhn Algorithm">
                                <Paragraph type="secondary">
                                    The Luhn algorithm (also known as the "modulus 10" algorithm) is a
                                    simple checksum formula used to validate credit card numbers, IMEI
                                    numbers, and other identification numbers.
                                </Paragraph>
                                <Paragraph type="secondary">
                                    It can detect any single-digit error and most transpositions of
                                    adjacent digits.
                                </Paragraph>
                            </Card>
                        </Col>
                    </>
                )}
            </Row>
        </ToolPageLayout>
    );
}
