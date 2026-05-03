"use client";

import React, { useState } from "react";
import { Button, Card, Space, Input, App, InputNumber, Tabs, Typography, Tag } from "antd";
import { CopyOutlined, LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";
import bcrypt from "bcryptjs";

const { Text } = Typography;

export default function BCryptToolPage() {
    const { message } = App.useApp();

    const [password, setPassword] = useState("");
    const [rounds, setRounds] = useState(10);
    const [hash, setHash] = useState("");
    const [hashing, setHashing] = useState(false);

    const [verifyPwd, setVerifyPwd] = useState("");
    const [verifyHash, setVerifyHash] = useState("");
    const [verifyResult, setVerifyResult] = useState<"match" | "nomatch" | null>(null);
    const [verifying, setVerifying] = useState(false);

    const handleHash = async () => {
        if (!password) {
            message.warning("Enter a password to hash");
            return;
        }
        setHashing(true);
        try {
            const result = await bcrypt.hash(password, rounds);
            setHash(result);
            message.success("Hash generated");
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Hash error";
            message.error(msg);
        } finally {
            setHashing(false);
        }
    };

    const handleVerify = async () => {
        if (!verifyPwd || !verifyHash) {
            message.warning("Enter both a password and a BCrypt hash");
            return;
        }
        setVerifying(true);
        try {
            const ok = await bcrypt.compare(verifyPwd, verifyHash);
            setVerifyResult(ok ? "match" : "nomatch");
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Verify error";
            message.error(msg);
            setVerifyResult(null);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <ToolPageLayout
            title="BCrypt Hash & Verify"
            description="Generate BCrypt password hashes and verify passwords"
            icon={<LockOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs:
                    "BCrypt is a password-hashing function based on the Blowfish cipher with built-in salt and a tunable cost factor (rounds). Each hash includes its salt and rounds, so verifying just requires the hash and the candidate password.",
                whyUse:
                    "Storing plain passwords is unacceptable. BCrypt is widely used (Django, Laravel, Spring) and tunable: higher rounds slow down brute-force attacks. Use this tool to generate test hashes or verify existing ones during development.",
                howToUse: [
                    "Hash tab: enter a password and salt rounds (10–12 typical)",
                    "Click Generate to create a BCrypt hash",
                    "Verify tab: paste a BCrypt hash and a candidate password to check a match",
                ],
                tips: [
                    "Rounds = 10 is a good starting point; 12 for stronger security",
                    "Each call produces a different hash because of the random salt",
                    "Higher rounds = slower (each +1 doubles time)",
                ],
                useCases: [
                    "Generating test passwords for seeding databases",
                    "Verifying user passwords during debugging",
                    "Comparing bcrypt rounds performance on your hardware",
                ],
            }}
        >
            <Tabs
                size="large"
                items={[
                    {
                        key: "hash",
                        label: "Hash Password",
                        children: (
                            <Card>
                                <Space orientation="vertical" style={{ width: "100%" }} size="large">
                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>Password</Text>
                                        <Input.Password
                                            size="large"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password to hash"
                                        />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>Salt rounds</Text>
                                        <InputNumber min={4} max={15} value={rounds} onChange={(v) => setRounds(v ?? 10)} />
                                        <Text type="secondary" style={{ marginLeft: 12, fontSize: 12 }}>
                                            (4–15; higher = slower & more secure)
                                        </Text>
                                    </div>
                                    <Button
                                        type="primary"
                                        size="large"
                                        loading={hashing}
                                        icon={<LockOutlined />}
                                        onClick={handleHash}
                                    >
                                        Generate Hash
                                    </Button>
                                    {hash && (
                                        <Card size="small" title="BCrypt Hash">
                                            <div
                                                style={{
                                                    fontFamily: "var(--font-geist-mono)",
                                                    fontSize: 13,
                                                    wordBreak: "break-all",
                                                    padding: 12,
                                                    background: "rgba(0,0,0,0.04)",
                                                    borderRadius: 6,
                                                }}
                                            >
                                                {hash}
                                            </div>
                                            <Button
                                                style={{ marginTop: 12 }}
                                                icon={<CopyOutlined />}
                                                onClick={() => copyToClipboard(hash)}
                                            >
                                                Copy
                                            </Button>
                                        </Card>
                                    )}
                                </Space>
                            </Card>
                        ),
                    },
                    {
                        key: "verify",
                        label: "Verify Password",
                        children: (
                            <Card>
                                <Space orientation="vertical" style={{ width: "100%" }} size="large">
                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>BCrypt hash</Text>
                                        <Input
                                            size="large"
                                            value={verifyHash}
                                            onChange={(e) => setVerifyHash(e.target.value)}
                                            placeholder="$2a$10$..."
                                            style={{ fontFamily: "var(--font-geist-mono)" }}
                                        />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>Password to test</Text>
                                        <Input.Password
                                            size="large"
                                            value={verifyPwd}
                                            onChange={(e) => setVerifyPwd(e.target.value)}
                                            placeholder="Candidate password"
                                        />
                                    </div>
                                    <Button
                                        type="primary"
                                        size="large"
                                        loading={verifying}
                                        onClick={handleVerify}
                                    >
                                        Verify
                                    </Button>
                                    {verifyResult === "match" && (
                                        <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: 14, padding: "6px 12px" }}>
                                            Password matches the hash
                                        </Tag>
                                    )}
                                    {verifyResult === "nomatch" && (
                                        <Tag icon={<CloseCircleOutlined />} color="error" style={{ fontSize: 14, padding: "6px 12px" }}>
                                            Password does NOT match the hash
                                        </Tag>
                                    )}
                                </Space>
                            </Card>
                        ),
                    },
                ]}
            />
        </ToolPageLayout>
    );
}
