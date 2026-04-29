"use client";

import React, { useState, useCallback } from "react";
import { Button, Card, Space, Slider, Switch, InputNumber, Typography, Row, Col, List, App } from "antd";
import { LockOutlined, CopyOutlined, ReloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
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

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (x) => chars[x % chars.length]).join("");
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
    const { message } = App.useApp();
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
    });
    const [password, setPassword] = useState(() => generatePassword(16, { lowercase: true, uppercase: true, numbers: true, symbols: true }));
    const [history, setHistory] = useState<string[]>([]);

    const generate = useCallback(() => {
        const newPassword = generatePassword(length, options);
        if (newPassword) {
            setPassword(newPassword);
            setHistory((prev) => [newPassword, ...prev].slice(0, 10));
        } else {
            message.warning("Select at least one character set");
        }
    }, [length, options, message]);

    const strength = calculateStrength(password);

    return (
        <ToolPageLayout
            title="Password Generator"
            description="Generate secure random passwords"
            icon={<LockOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "A cryptographically secure password generator creates random passwords using strong entropy sources. It ensures passwords are unpredictable and resistant to brute force attacks.",
                whyUse: "Weak passwords are the #1 cause of security breaches. This tool creates strong, random passwords that meet complexity requirements and are impossible to guess or crack efficiently.",
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
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={14}>
                    <Card>
                        {/* Generated Password Display */}
                        <div
                            style={{
                                padding: "24px",
                                background: "linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(82, 196, 26, 0.05))",
                                borderRadius: 12,
                                marginBottom: 24,
                                textAlign: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 24,
                                    fontFamily: "var(--font-geist-mono)",
                                    wordBreak: "break-all",
                                    letterSpacing: 1,
                                }}
                            >
                                {password || "Configure options below"}
                            </Text>
                        </div>

                        {/* Strength Indicator */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <Text>Password Strength</Text>
                                <Text style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</Text>
                            </div>
                            <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
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
                                Generate New
                            </Button>
                            <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(password)} size="large">
                                Copy Password
                            </Button>
                        </Space>

                        {/* Length Slider */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <Text>Password Length</Text>
                                <InputNumber
                                    min={4}
                                    max={64}
                                    value={length}
                                    onChange={(v) => v && setLength(v)}
                                    style={{ width: 80 }}
                                />
                            </div>
                            <Slider
                                min={4}
                                max={64}
                                value={length}
                                onChange={setLength}
                                marks={{ 4: "4", 16: "16", 32: "32", 64: "64" }}
                            />
                        </div>

                        {/* Character Options */}
                        <Title level={5}>Character Sets</Title>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text>Lowercase (a-z)</Text>
                                <Switch checked={options.lowercase} onChange={(v) => setOptions({ ...options, lowercase: v })} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text>Uppercase (A-Z)</Text>
                                <Switch checked={options.uppercase} onChange={(v) => setOptions({ ...options, uppercase: v })} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text>Numbers (0-9)</Text>
                                <Switch checked={options.numbers} onChange={(v) => setOptions({ ...options, numbers: v })} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text>Symbols (!@#$...)</Text>
                                <Switch checked={options.symbols} onChange={(v) => setOptions({ ...options, symbols: v })} />
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card
                        title="Password History"
                        extra={
                            <Button size="small" icon={<DeleteOutlined />} onClick={() => setHistory([])}>
                                Clear
                            </Button>
                        }
                    >
                        {history.length === 0 ? (
                            <Text type="secondary">Generated passwords will appear here</Text>
                        ) : (
                            <List
                                size="small"
                                dataSource={history}
                                renderItem={(item, index) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                key="copy"
                                                size="small"
                                                type="text"
                                                icon={<CopyOutlined />}
                                                onClick={() => copyToClipboard(item)}
                                            />,
                                        ]}
                                    >
                                        <Text
                                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }}
                                            ellipsis={{ tooltip: item }}
                                        >
                                            {index + 1}. {item}
                                        </Text>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
