"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button, Card, Space, Slider, Switch, InputNumber, Typography, Row, Col, App } from "antd";
import BulkSecretGenerator from "@/components/BulkSecretGenerator";
import { generateSecrets } from "@/lib/random-secrets";
import SimpleList from "@/components/SimpleList";
import { LockOutlined, CopyOutlined, ReloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title } = Typography;

const CHAR_SETS = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePassword(
    length: number,
    options: { lowercase: boolean; uppercase: boolean; numbers: boolean; symbols: boolean }
): string {
    let chars = "";
    if (options.lowercase) chars += CHAR_SETS.lowercase;
    if (options.uppercase) chars += CHAR_SETS.uppercase;
    if (options.numbers) chars += CHAR_SETS.numbers;
    if (options.symbols) chars += CHAR_SETS.symbols;

    if (!chars) return "";

    return generateSecrets(chars, length, 1)[0];
}

function calculateStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "#f5222d" };
    if (score <= 4) return { score, label: "Fair", color: "#faad14" };
    if (score <= 5) return { score, label: "Good", color: "#52c41a" };
    return { score, label: "Strong", color: "#1677ff" };
}

export default function PasswordGeneratorPage() {
    const { t } = useLanguage();
    const { message } = App.useApp();
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
    });
    const [password, setPassword] = useState("");
    useEffect(() => { setPassword(generatePassword(16, { lowercase: true, uppercase: true, numbers: true, symbols: true })); }, []);
    const [history, setHistory] = useState<string[]>([]);

    const generate = useCallback(() => {
        const newPassword = generatePassword(length, options);
        if (newPassword) {
            setPassword(newPassword);
            setHistory((prev) => [newPassword, ...prev].slice(0, 10));
        } else {
            message.warning(t("Select at least one character set"));
        }
    }, [length, options, message, t]);

    const strength = calculateStrength(password);

    return (
        <ToolPageLayout
            title={t("Password Generator")}
            description={t("Generate secure random passwords")}
            icon={<LockOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "A cryptographically secure password generator creates random passwords using strong entropy sources. It ensures passwords are unpredictable and resistant to brute force attacks.",
                whyUse: "Generate random passwords and API secrets with explicit length and character choices. Use an appropriate length, store them safely and avoid password reuse.",
                howToUse: [
                    "Set desired password length (longer = more secure)",
                    "Toggle character types: uppercase, lowercase, numbers, symbols",
                    "Optionally exclude ambiguous characters (0, O, l, 1, etc.)",
                    "Generate and copy your secure password"
                ],
                tips: [
                    "Use at least 16 characters for important accounts",
                    "Include all character types for maximum entropy",
                    "Use a password manager to store generated passwords",
                    "Never reuse passwords across different sites"
                ],
                useCases: [
                    "Creating strong passwords for online accounts",
                    "Generating API keys and secrets",
                    "Creating encryption passphrases",
                    "Setting up service account credentials"
                ]
            }}
        >
            <Row className="signal-working-panes" gutter={[24, 24]}>
                <Col xs={24} lg={14}>
                    <Card>
                        {/* Generated Password Display */}
                        <div
                            style={{
                                padding: "24px",
                                background: "var(--wb-card-bg)",
                                borderRadius: 6,
                                marginBottom: 24,
                                textAlign: "center",
                            }}
                        >
                            <Text
                                dir={password ? "ltr" : undefined}
                                style={{
                                    fontSize: 24,
                                    fontFamily: "var(--font-geist-mono)",
                                    wordBreak: "break-all",
                                    letterSpacing: 1,
                                }}
                            >
                                {password || t("Configure options below")}
                            </Text>
                        </div>

                        {/* Strength Indicator */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <Text>{t("Password Strength")}</Text>
                                <Text style={{ color: strength.color, fontWeight: 600 }}>{t(strength.label)}</Text>
                            </div>
                            <div style={{ height: 8, background: "var(--wb-card-bg)", borderRadius: 4, overflow: "hidden" }}>
                                <div
                                    style={{
                                        width: `${(strength.score / 7) * 100}%`,
                                        height: "100%",
                                        background: strength.color,
                                        transition: "all 0.3s",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <Space wrap style={{ marginBottom: 24 }}>
                            <Button type="primary" icon={<ReloadOutlined />} onClick={generate} size="large">
                                {t("Generate New")}</Button>
                            <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(password)} size="large">
                                {t("Copy Password")}</Button>
                        </Space>

                        {/* Length Slider */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <Text>{t("Password Length")}</Text>
                                <InputNumber
                                    dir="ltr"
                                    aria-label={t("Password Length")}
                                    min={4}
                                    max={64}
                                    value={length}
                                    onChange={(v) => v && setLength(v)}
                                    style={{ width: 80 }}
                                />
                            </div>
                            <Slider
                                aria-label={t("Password Length")}
                                min={4}
                                max={64}
                                value={length}
                                onChange={setLength}
                                marks={{ 4: "4", 16: "16", 32: "32", 64: "64" }}
                            />
                        </div>

                        {/* Character Options */}
                        <Title level={5}>{t("Character Sets")}</Title>
                        <div className="tool-split-pane" style={{ gap: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text>{t("Lowercase (a-z)")}</Text>
                                <Switch aria-label={t("Lowercase (a-z)")} checked={options.lowercase} onChange={(v) => setOptions({ ...options, lowercase: v })} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text>{t("Uppercase (A-Z)")}</Text>
                                <Switch aria-label={t("Uppercase (A-Z)")} checked={options.uppercase} onChange={(v) => setOptions({ ...options, uppercase: v })} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text>{t("Numbers (0-9)")}</Text>
                                <Switch aria-label={t("Numbers (0-9)")} checked={options.numbers} onChange={(v) => setOptions({ ...options, numbers: v })} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text>{t("Symbols (!@#$...)")}</Text>
                                <Switch aria-label={t("Symbols (!@#$...)")} checked={options.symbols} onChange={(v) => setOptions({ ...options, symbols: v })} />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card
                        title={t("Password History")}
                        extra={
                            <Button size="small" icon={<DeleteOutlined />} onClick={() => setHistory([])}>
                                {t("Clear")}</Button>
                        }
                    >
                        {history.length === 0 ? (
                            <Text type="secondary">{t("Generated passwords will appear here")}</Text>
                        ) : (
                            <SimpleList
                                size="small"
                                dataSource={history}
                                renderItem={(item, index) => (
                                    <Text
                                        dir="ltr"
                                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                                        ellipsis={{ tooltip: item }}
                                    >
                                        {index + 1}. {item}
                                    </Text>
                                )}
                                renderExtra={(item) => (
                                    <Button
                                        aria-label={t("Copy")}
                                        size="small"
                                        type="text"
                                        icon={<CopyOutlined />}
                                        onClick={() => copyToClipboard(item)}
                                    />
                                )}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
            <BulkSecretGenerator />
        </ToolPageLayout>
    );
}
