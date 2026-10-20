"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Space, Input, Segmented, Alert, App, Typography } from "antd";
import { CopyOutlined, ClearOutlined, SafetyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useLanguage } from "@/components/LanguageProvider";
import { CRYPTO_UTILITY_HELP } from "@/lib/i18n/crypto-utilities";
import { encryptLegacyAesText, decryptLegacyAesText } from "@/lib/aes-text";

const { TextArea } = Input;
const { Text } = Typography;

type Mode = "Encrypt" | "Decrypt";

export default function AesToolPage() {
    const { t } = useLanguage();
    const latestT = useRef(t);
    useEffect(() => { latestT.current = t; }, [t]);
    const { message } = App.useApp();
    const [mode, setMode] = useState<Mode>("Encrypt");
    const [passphrase, setPassphrase] = useState("");
    const [input, setInput] = useState("Hello, mydevtools!");
    const [output, setOutput] = useState("");

    const run = () => {
        setOutput("");
        if (!passphrase) {
            message.warning(latestT.current("Enter a passphrase"));
            return;
        }
        if (!input) {
            message.warning(latestT.current("Enter text"));
            return;
        }
        try {
            setOutput(mode === "Encrypt"
                ? encryptLegacyAesText(input, passphrase)
                : decryptLegacyAesText(input, passphrase));
            if (mode === "Decrypt") message.success(latestT.current("Decryption completed"));
        } catch (e: unknown) {
            message.error(mode === "Decrypt"
                ? latestT.current("Decryption failed — wrong passphrase or corrupted ciphertext")
                : e instanceof Error ? latestT.current("Crypto operation failed: {detail}", { detail: e.message }) : latestT.current("Operation failed"));
            setOutput("");
        }
    };

    const swap = () => {
        if (!output) return;
        setInput(output);
        setOutput("");
        setMode(mode === "Encrypt" ? "Decrypt" : "Encrypt");
    };

    return (
        <ToolPageLayout
            title={t("AES Encrypt & Decrypt")}
            description={t("Encrypt and decrypt text with CryptoJS AES passphrases")}
            icon={<SafetyOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={CRYPTO_UTILITY_HELP["aes-tool"]}
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Segmented<Mode>
                    aria-label={t("Operation")}
                    options={[{ value: "Encrypt", label: t("Encrypt") }, { value: "Decrypt", label: t("Decrypt") }]}
                    value={mode}
                    onChange={(v) => { setMode(v); setOutput(""); }}
                    size="large"
                />
                <Text><bdi dir="ltr">AES-256-CBC</bdi>{": "}{t("Fixed compatibility format")}</Text>
                <Button type="primary" icon={<SafetyOutlined />} onClick={run}>{t(mode)}</Button>
                <Button onClick={swap} disabled={!output}>{t("Use Output as Input")}</Button>
                <Button icon={<CopyOutlined />} disabled={!output} onClick={() => copyToClipboard(output)}>{t("Copy")}</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); setPassphrase(""); }}>{t("Clear")}</Button>
            </Space>

            <Alert
                type="warning"
                showIcon
                title={t("Legacy compatibility only")}
                description={t("No authentication tag: a successful decryption does not prove the passphrase or ciphertext is correct. Use for existing CryptoJS data and compatibility checks.")}
                style={{ marginBottom: 16 }}
            />

            <Card style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Passphrase")}</Text>
                <Input.Password
                    aria-label={t("Passphrase")}
                    dir="ltr"
                    styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                    size="large"
                    value={passphrase}
                    onChange={(e) => { setPassphrase(e.target.value); setOutput(""); }}
                    placeholder={t("Enter passphrase used for key derivation")}
                />
            </Card>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title={t(mode === "Encrypt" ? "Plaintext" : "Ciphertext (Base64)")}>
                    <TextArea
                        rows={14}
                        aria-label={t(mode === "Encrypt" ? "Plaintext" : "Ciphertext (Base64)")}
                        dir={mode === "Encrypt" ? "auto" : "ltr"}
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setOutput(""); }}
                        placeholder={mode === "Encrypt" ? t("Text to encrypt") : "U2FsdGVkX1+..."}
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16, direction: mode === "Decrypt" ? "ltr" : undefined, textAlign: mode === "Decrypt" ? "left" : undefined }}
                    />
                </Card>
                <Card size="small" title={t(mode === "Encrypt" ? "Ciphertext (Base64)" : "Plaintext")}>
                    <TextArea
                        rows={14}
                        aria-label={t(mode === "Encrypt" ? "Ciphertext (Base64)" : "Plaintext")}
                        dir={mode === "Encrypt" ? "ltr" : "auto"}
                        value={output}
                        readOnly
                        placeholder={t("Output will appear here")}
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16, direction: mode === "Encrypt" ? "ltr" : undefined, textAlign: mode === "Encrypt" ? "left" : undefined }}
                    />
                </Card>
            </div>
        </ToolPageLayout>
    );
}
