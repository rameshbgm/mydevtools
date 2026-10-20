"use client";
import { useLanguage } from "@/components/LanguageProvider";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, message, Select, Divider, Collapse, Tag } from "antd";
import {
    KeyOutlined,
    CopyOutlined,
    DownloadOutlined,
    ReloadOutlined,
    LockOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { showErrorModal } from "@/lib/errorModal";
import { downloadText } from "@/lib/download";
import { copyToClipboard as sharedCopy } from "@/lib/clipboard";

const { TextArea } = Input;
const { Text } = Typography;

type KeyAlgorithm = "RSA" | "ECDSA" | "Ed25519";
type RSAKeySize = 2048 | 3072 | 4096;
type ECCurve = "P-256" | "P-384" | "P-521";
type OutputFormat = "PEM" | "PKCS8" | "JWK";

interface KeyPairResult {
    publicKey: string;
    privateKey: string;
    algorithm: string;
    format: string;
}

export default function KeyPairGeneratorPage() {
    const { t } = useLanguage();
    const [algorithm, setAlgorithm] = useState<KeyAlgorithm>("RSA");
    const [rsaKeySize, setRsaKeySize] = useState<RSAKeySize>(2048);
    const [ecCurve, setEcCurve] = useState<ECCurve>("P-256");
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("PEM");
    const [isGenerating, setIsGenerating] = useState(false);
    const [keyPair, setKeyPair] = useState<KeyPairResult | null>(null);

    const base64Encode = (buffer: ArrayBuffer): string => {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    };

    const formatPEM = (base64: string, type: string): string => {
        const lines = base64.match(/.{1,64}/g) || [];
        return `-----BEGIN ${type}-----\n${lines.join("\n")}\n-----END ${type}-----`;
    };

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        setKeyPair(null);

        try {
            let cryptoKeyPair: CryptoKeyPair;
                        let keyInfo: string;

            if (algorithm === "RSA") {
                cryptoKeyPair = await crypto.subtle.generateKey(
                    {
                        name: "RSASSA-PKCS1-v1_5",
                        modulusLength: rsaKeySize,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: rsaKeySize === 2048 ? "SHA-256" : rsaKeySize === 3072 ? "SHA-384" : "SHA-512",
                    },
                    true,
                    ["sign", "verify"]
                );
                keyInfo = `RSA ${rsaKeySize}-bit`;
            } else if (algorithm === "ECDSA") {
                cryptoKeyPair = await crypto.subtle.generateKey(
                    {
                        name: "ECDSA",
                        namedCurve: ecCurve,
                    },
                    true,
                    ["sign", "verify"]
                );
                keyInfo = `ECDSA ${ecCurve}`;
            } else {
                cryptoKeyPair = await crypto.subtle.generateKey(
                    { name: "Ed25519" }, true, ["sign", "verify"]
                );
                keyInfo = "Ed25519";
            }

            let publicKeyStr: string;
            let privateKeyStr: string;

            if (outputFormat === "PEM" || outputFormat === "PKCS8") {
                const publicKeyDer = await crypto.subtle.exportKey("spki", cryptoKeyPair.publicKey);
                const privateKeyDer = await crypto.subtle.exportKey("pkcs8", cryptoKeyPair.privateKey);

                publicKeyStr = formatPEM(base64Encode(publicKeyDer), "PUBLIC KEY");
                privateKeyStr = formatPEM(base64Encode(privateKeyDer), "PRIVATE KEY");
            } else {
                // JWK format
                const publicJwk = await crypto.subtle.exportKey("jwk", cryptoKeyPair.publicKey);
                const privateJwk = await crypto.subtle.exportKey("jwk", cryptoKeyPair.privateKey);

                publicKeyStr = JSON.stringify(publicJwk, null, 2);
                privateKeyStr = JSON.stringify(privateJwk, null, 2);
            }

            setKeyPair({
                publicKey: publicKeyStr,
                privateKey: privateKeyStr,
                algorithm: keyInfo,
                format: outputFormat,
            });

            message.success(t("Key pair generated successfully!"));

        } catch (error) {
            console.error("Key pair generation error:", error);
            showErrorModal({
                title: t("Key pair generation failed"),
                error,
                context: t("Could not generate {algorithm} key pair in {format} format.", { algorithm: algorithm === "RSA" ? `RSA ${rsaKeySize}` : algorithm === "ECDSA" ? `ECDSA ${ecCurve}` : "Ed25519", format: outputFormat }),
                recommendations: [
                    t("Try RSA 2048 or ECDSA P-256 — the most widely supported across browsers."),
                    t("Ed25519 requires native Web Crypto support. Choose RSA or ECDSA if this browser does not support it."),
                    t("If RSA 4096+ is failing, your browser may be capping key sizes — drop to 2048 or 3072."),
                ],
            });
        } finally {
            setIsGenerating(false);
        }
    }, [algorithm, rsaKeySize, ecCurve, outputFormat, t]);

    const copyToClipboard = (text: string, label: string) => sharedCopy(text, t("{label} copied to clipboard!", { label }));

    const downloadKey = (content: string, filename: string) => {
        const ext = keyPair?.format === "JWK" ? ".jwk" : ".pem";
        const type = keyPair?.format === "JWK" ? "application/json" : "application/x-pem-file";
        downloadText(content, filename + ext, type);
    };

    return (
        <ToolPageLayout
            title={t("Key Pair Generator")}
            description={t("Generate RSA, ECDSA, and Ed25519 key pairs")}
            icon={<KeyOutlined style={{ fontSize: 24 }} />}
            color="#597ef7"
            learnMore={{
                whatIs: t("A cryptographic key pair consists of a public key and a private key. The public key can be shared freely and is used to verify signatures or encrypt data. The private key must be kept secret and is used to sign data or decrypt messages."),
                whyUse: t("Key pairs are fundamental to public-key cryptography used in SSL/TLS certificates, SSH authentication, code signing, JWTs, and secure communication. Generating keys locally ensures the private key never leaves your machine."),
                howToUse: [
                    t("Select the key algorithm: RSA for broad compatibility, ECDSA for efficiency"),
                    t("Choose the key size (RSA) or curve (ECDSA)"),
                    t("Select the output format: PEM for most uses, JWK for web applications"),
                    t("Click Generate to create your key pair"),
                    t("Download and securely store the private key"),
                ],
                tips: [
                    t("RSA 2048-bit is minimum for security; use 3072+ for long-term keys"),
                    t("ECDSA P-256 offers equivalent security to RSA 3072 with smaller keys"),
                    t("Never share your private key - only the public key is meant to be distributed"),
                    t("PEM exports SPKI public keys and unencrypted PKCS#8 private keys; JWK exports JSON keys."),
                    t("Private keys are not encrypted by this tool. Store downloaded keys securely."),
                ],
                useCases: [
                    t("Generating keys for SSL/TLS certificates"),
                    t("Exporting signing key material"),
                    t("JWT signing keys for authentication systems"),
                    t("Code signing certificates"),
                    t("S/MIME email encryption"),
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 180 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Algorithm")}</Text>
                            <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Algorithm")}
                                value={algorithm}
                                onChange={setAlgorithm}
                                style={{ width: "100%" }}
                                options={[
                                    { value: "RSA", label: "RSA" },
                                    { value: "ECDSA", label: t("ECDSA (Elliptic Curve)") },
                                    { value: "Ed25519", label: t("Ed25519 (Edwards Curve)") },
                                ]}
                            />
                        </div>

                        {algorithm === "RSA" && (
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Key Size")}</Text>
                                <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Key Size")}
                                    value={rsaKeySize}
                                    onChange={setRsaKeySize}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: 2048, label: t("2048 bits (Standard)") },
                                        { value: 3072, label: t("3072 bits (Enhanced)") },
                                        { value: 4096, label: t("4096 bits (Maximum)") },
                                    ]}
                                />
                            </div>
                        )}

                        {algorithm === "ECDSA" && (
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Curve")}</Text>
                                <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Curve")}
                                    value={ecCurve}
                                    onChange={setEcCurve}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "P-256", label: "P-256 (secp256r1) - ES256" },
                                        { value: "P-384", label: "P-384 (secp384r1) - ES384" },
                                        { value: "P-521", label: "P-521 (secp521r1) - ES512" },
                                    ]}
                                />
                            </div>
                        )}

                        <div style={{ flex: 1, minWidth: 180 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Output Format")}</Text>
                            <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Output Format")}
                                value={outputFormat}
                                onChange={setOutputFormat}
                                style={{ width: "100%" }}
                                options={[
                                    { value: "PEM", label: "PEM (PKCS#8)" },
                                    { value: "JWK", label: "JWK (JSON Web Key)" },
                                ]}
                            />
                        </div>
                    </div>

                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={handleGenerate}
                        loading={isGenerating}
                        size="large"
                        block
                    >{t("Generate Key Pair")}</Button>

                    {keyPair && (
                        <>
                            <Divider />

                            <div style={{ marginBottom: 16 }}>
                                <Space>
                                    <Tag color="blue">{keyPair.algorithm}</Tag>
                                    <Tag color="purple">{keyPair.format}</Tag>
                                </Space>
                            </div>

                            <Collapse defaultActiveKey={["public", "private"]} items={[
                                {
                                    key: "public",
                                    label: (
                                        <Space>
                                            <Text strong>{t("Public Key")}</Text>
                                            <Tag color="green">{t("Safe to share")}</Tag>
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => copyToClipboard(keyPair.publicKey, t("Public key"))}
                                                >{t("Copy")}</Button>
                                                <Button
                                                    size="small"
                                                    icon={<DownloadOutlined />}
                                                    onClick={() => downloadKey(keyPair.publicKey, "public-key")}
                                                >{t("Download")}</Button>
                                            </div>
                                            <TextArea aria-label={t("Public key output")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                                value={keyPair.publicKey}
                                                readOnly
                                                rows={outputFormat === "JWK" ? 12 : 8}
                                                style={{ fontFamily: "monospace", fontSize: 16 }}
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    key: "private",
                                    label: (
                                        <Space>
                                            <LockOutlined />
                                            <Text strong>{t("Private Key")}</Text>
                                            <Tag color="red">{t("Keep Secret!")}</Tag>
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => copyToClipboard(keyPair.privateKey, t("Private key"))}
                                                >{t("Copy")}</Button>
                                                <Button
                                                    size="small"
                                                    icon={<DownloadOutlined />}
                                                    onClick={() => downloadKey(keyPair.privateKey, "private-key")}
                                                >{t("Download")}</Button>
                                            </div>
                                            <TextArea aria-label={t("Private key output")} dir="ltr" styles={{ textarea: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                                value={keyPair.privateKey}
                                                readOnly
                                                rows={algorithm === "RSA" ? 20 : outputFormat === "JWK" ? 15 : 10}
                                                style={{ fontFamily: "monospace", fontSize: 16 }}
                                            />
                                        </div>
                                    ),
                                },
                            ]} />
                        </>
                    )}
                </Space>
            </Card>
        </ToolPageLayout>
    );
}
