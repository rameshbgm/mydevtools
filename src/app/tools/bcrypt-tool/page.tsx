"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Space, Input, App, InputNumber, Tabs, Typography, Tag } from "antd";
import { CopyOutlined, LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useLanguage } from "@/components/LanguageProvider";
import { CRYPTO_UTILITY_HELP } from "@/lib/i18n/crypto-utilities";
import bcrypt from "bcryptjs";

const { Text } = Typography;

export default function BCryptToolPage() {
    const { t } = useLanguage();
    const latestT = useRef(t);
    useEffect(() => { latestT.current = t; }, [t]);
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
            message.warning(latestT.current("Enter a password to hash"));
            return;
        }
        setHashing(true);
        try {
            const result = await bcrypt.hash(password, rounds);
            setHash(result);
            message.success(latestT.current("Hash generated"));
        } catch (e: unknown) {
            message.error(e instanceof Error ? latestT.current("Crypto operation failed: {detail}", { detail: e.message }) : latestT.current("Operation failed"));
        } finally {
            setHashing(false);
        }
    };

    const handleVerify = async () => {
        if (!verifyPwd || !verifyHash) {
            message.warning(latestT.current("Enter both a password and a BCrypt hash"));
            return;
        }
        setVerifying(true);
        try {
            const ok = await bcrypt.compare(verifyPwd, verifyHash);
            setVerifyResult(ok ? "match" : "nomatch");
        } catch (e: unknown) {
            message.error(e instanceof Error ? latestT.current("Crypto operation failed: {detail}", { detail: e.message }) : latestT.current("Operation failed"));
            setVerifyResult(null);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <ToolPageLayout
            title={t("BCrypt Hash & Verify")}
            description={t("Generate BCrypt password hashes and verify passwords")}
            icon={<LockOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={CRYPTO_UTILITY_HELP["bcrypt-tool"]}
        >
            <Tabs
                size="large"
                items={[
                    {
                        key: "hash",
                        label: t("Hash Password"),
                        children: (
                            <Card>
                                <Space orientation="vertical" style={{ width: "100%" }} size="large">
                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Password")}</Text>
                                        <Input.Password
                                            dir="ltr"
                                            styles={{ input: { direction: "ltr" } }}
                                            size="large"
                                            aria-label={t("Password")}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={t("Enter password to hash")}
                                        />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Salt rounds")}</Text>
                                        <InputNumber aria-label={t("Salt rounds")} dir="ltr" min={4} max={15} value={rounds} onChange={(v) => setRounds(v ?? 10)} />
                                        <Text type="secondary" style={{ marginInlineStart: 12, fontSize: 12 }}>
                                            {t("(4–15; higher = slower & more secure)")}
                                        </Text>
                                    </div>
                                    <Button
                                        type="primary"
                                        size="large"
                                        loading={hashing}
                                        icon={<LockOutlined />}
                                        onClick={handleHash}
                                    >
                                        {t("Generate Hash")}
                                    </Button>
                                    {hash && (
                                        <Card size="small" title={t("BCrypt Hash")}>
                                            <div
                                                dir="ltr"
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
                                                {t("Copy")}
                                            </Button>
                                        </Card>
                                    )}
                                </Space>
                            </Card>
                        ),
                    },
                    {
                        key: "verify",
                        label: t("Verify Password"),
                        children: (
                            <Card>
                                <Space orientation="vertical" style={{ width: "100%" }} size="large">
                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>{t("BCrypt hash")}</Text>
                                        <Input
                                            aria-label={t("BCrypt hash")}
                                            dir="ltr"
                                            styles={{ input: { direction: "ltr" } }}
                                            size="large"
                                            value={verifyHash}
                                            onChange={(e) => setVerifyHash(e.target.value)}
                                            placeholder="$2a$10$..."
                                            style={{ fontFamily: "var(--font-geist-mono)" }}
                                        />
                                    </div>
                                    <div>
                                        <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Password to test")}</Text>
                                        <Input.Password
                                            dir="ltr"
                                            styles={{ input: { direction: "ltr" } }}
                                            size="large"
                                            aria-label={t("Password to test")}
                                            value={verifyPwd}
                                            onChange={(e) => setVerifyPwd(e.target.value)}
                                            placeholder={t("Candidate password")}
                                        />
                                    </div>
                                    <Button
                                        type="primary"
                                        size="large"
                                        loading={verifying}
                                        onClick={handleVerify}
                                    >
                                        {t("Verify")}
                                    </Button>
                                    {verifyResult === "match" && (
                                        <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: 14, padding: "6px 12px" }}>
                                            {t("Password matches the hash")}
                                        </Tag>
                                    )}
                                    {verifyResult === "nomatch" && (
                                        <Tag icon={<CloseCircleOutlined />} color="error" style={{ fontSize: 14, padding: "6px 12px" }}>
                                            {t("Password does NOT match the hash")}
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
