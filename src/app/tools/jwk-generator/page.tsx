"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, Select, message, Collapse, Tag, Divider } from "antd";
import {
    KeyOutlined,
    CopyOutlined,
    ReloadOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { showErrorModal } from "@/lib/errorModal";
import { downloadText } from "@/lib/download";
import { copyToClipboard } from "@/lib/clipboard";
import { generateJwk, symmetricJwkSizes } from "@/lib/jwk-tools";

const { TextArea } = Input;
const { Text } = Typography;

type KeyType = "RSA" | "EC" | "oct";
type ECCurve = "P-256" | "P-384" | "P-521";
type KeyUse = "sig" | "enc";

const KEY_TYPES: { value: KeyType; label: string; description: string }[] = [
    { value: "RSA", label: "RSA", description: "RSA key pair for signing (RS256) or encryption (RSA-OAEP)" },
    { value: "EC", label: "Elliptic Curve (EC)", description: "ECDSA key pair for signing (ES256, ES384, ES512)" },
    { value: "oct", label: "Symmetric (oct)", description: "Symmetric key for HMAC signing (HS256) or AES encryption" },
];

const EC_CURVES: { value: ECCurve; label: string; algorithm: string }[] = [
    { value: "P-256", label: "P-256 (secp256r1)", algorithm: "ES256" },
    { value: "P-384", label: "P-384 (secp384r1)", algorithm: "ES384" },
    { value: "P-521", label: "P-521 (secp521r1)", algorithm: "ES512" },
];

const RSA_KEY_SIZES = [2048, 3072, 4096];


export default function JWKGeneratorPage() {
    const { t } = useLanguage();

    // Generation state
    const [keyType, setKeyType] = useState<KeyType>("RSA");
    const [keyUse, setKeyUse] = useState<KeyUse>("sig");
    const [rsaKeySize, setRsaKeySize] = useState(2048);
    const [ecCurve, setEcCurve] = useState<ECCurve>("P-256");
    const [symmetricKeySize, setSymmetricKeySize] = useState(256);
    const [keyId, setKeyId] = useState("");

    // Output
    const [publicJwk, setPublicJwk] = useState("");
    const [privateJwk, setPrivateJwk] = useState("");
    const [jwkSet, setJwkSet] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        setPublicJwk(""); setPrivateJwk(""); setJwkSet("");
        try {
            const result = await generateJwk({ keyType, keyUse, rsaKeySize, ecCurve, symmetricKeySize, keyId });
            setPrivateJwk(JSON.stringify(result.privateKey, null, 2));
            setPublicJwk(result.publicKey ? JSON.stringify(result.publicKey, null, 2) : "");
            setJwkSet(JSON.stringify(result.jwks, null, 2));
            message.success(t("JWK generated successfully!"));
        } catch (error) {
            showErrorModal({
                title: t("JWK generation failed"), error,
                context: t("Could not generate a {type} JWK with size or curve {size}.", { type: keyType, size: keyType === "RSA" ? rsaKeySize : keyType === "EC" ? ecCurve : symmetricKeySize }),
                recommendations: [
                    t("Check the selected key type, use, size and curve, then try again."),
                    t("Keep private and symmetric keys secret, including any JWKS that contains them."),
                    t("If your browser blocks the algorithm, use a compatible local key-generation tool."),
                ],
            });
        } finally { setIsGenerating(false); }
    }, [keyType, keyUse, rsaKeySize, ecCurve, symmetricKeySize, keyId, t]);

    const downloadJwk = (content: string, filename: string) => downloadText(content, filename, "application/json");

    const collapseItems = [
        ...(publicJwk ? [{
            key: "public",
            label: (
                <Space>
                    <Text strong>{t("Public Key (JWK)")}</Text>
                    <Tag color="green">{t("Safe to share")}</Tag>
                </Space>
            ),
            children: (
                <div>
                    <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(publicJwk, t("Public JWK copied!"))}>
                            {t("Copy")}</Button>
                        <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadJwk(publicJwk, "public-key.jwk")}>
                            {t("Download")}</Button>
                    </div>
                    <TextArea aria-label={t("Public Key (JWK)")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                        value={publicJwk}
                        readOnly
                        rows={12}
                        style={{ fontFamily: "monospace" }}
                    />
                </div>
            ),
        }] : []),
        ...(privateJwk ? [{
            key: "private",
            label: (
                <Space>
                    <Text strong>{t(keyType === "oct" ? "Symmetric Key (JWK)" : "Private Key (JWK)")}</Text>
                    <Tag color="red">{t("Keep secret!")}</Tag>
                </Space>
            ),
            children: (
                <div>
                    <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(privateJwk, t("Private JWK copied!"))}>
                            {t("Copy")}</Button>
                        <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadJwk(privateJwk, "private-key.jwk")}>
                            {t("Download")}</Button>
                    </div>
                    <TextArea aria-label={t("Private or symmetric JWK")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                        value={privateJwk}
                        readOnly
                        rows={keyType === "RSA" ? 20 : 12}
                        style={{ fontFamily: "monospace" }}
                    />
                </div>
            ),
        }] : []),
        ...(jwkSet ? [{
            key: "jwks",
            label: (
                <Space>
                    <Text strong>{t("JWK Set (JWKS)")}</Text>
                    <Tag color={keyType === "oct" ? "red" : "blue"}>{t(keyType === "oct" ? "Contains a secret key — do not publish" : "For .well-known/jwks.json")}</Tag>
                </Space>
            ),
            children: (
                <div>
                    <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(jwkSet, t("JWK Set copied!"))}>
                            {t("Copy")}</Button>
                        <Button size="small" icon={<DownloadOutlined />} onClick={() => downloadJwk(jwkSet, "jwks.json")}>
                            {t("Download")}</Button>
                    </div>
                    <TextArea aria-label={t("JWK Set (JWKS)")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                        value={jwkSet}
                        readOnly
                        rows={15}
                        style={{ fontFamily: "monospace" }}
                    />
                </div>
            ),
        }] : []),
    ];

    return (
        <ToolPageLayout
            title={t("JWK Generator")}
            description={t("Generate JSON Web Keys for RSA, EC, and symmetric algorithms")}
            icon={<KeyOutlined style={{ fontSize: 24 }} />}
            color="#fa8c16"
            learnMore={{
                whatIs: "JSON Web Key (JWK) is a standard (RFC 7517) for representing cryptographic keys using JSON. JWKs can represent RSA, Elliptic Curve (EC), and symmetric keys in a portable, standardized format.",
                whyUse: "JWKs support JWT/JWS/JWE operations and OAuth 2.0 / OpenID Connect token validation. Publish only public keys as JWKS at .well-known endpoints; never publish private or symmetric keys.",
                howToUse: [
                    "Select a key type: RSA for broad compatibility, EC for smaller keys, or symmetric for shared secrets",
                    "Choose the key use: 'sig' for signing (JWS) or 'enc' for encryption (JWE)",
                    "Set the key size or curve based on your security requirements",
                    "Optionally set a custom Key ID (kid) for key identification",
                    "Click Generate to create the key(s)",
                    "Download or copy the keys as needed",
                ],
                tips: [
                    "RSA 2048-bit is minimum for production; 3072+ bits for long-term security",
                    "P-256 (ES256) offers equivalent security to RSA 3072 with much smaller keys",
                    "Always keep private keys secret - only share public keys",
                    "Use the JWKS format for publishing public keys at .well-known/jwks.json",
                    "Include 'kid' (key ID) to support key rotation",
                ],
                useCases: [
                    "Generating signing keys for JWT authentication",
                    "Creating key pairs for OAuth 2.0 / OpenID Connect providers",
                    "Setting up encryption keys for JWE",
                    "Publishing public keys for token validation endpoints",
                    "Key generation for API authentication",
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Key Type")}</Text>
                            <Select aria-label={t("Key Type")}
                                value={keyType}
                                onChange={(v) => {
                                    setKeyType(v);
                                    if (v === "EC") {
                                        setKeyUse("sig"); // EC only supports signing.
                                        if (!symmetricJwkSizes("sig").includes(symmetricKeySize)) setSymmetricKeySize(256);
                                    }
                                    if (v === "oct" && !symmetricJwkSizes(keyUse).includes(symmetricKeySize)) setSymmetricKeySize(256);
                                }}
                                style={{ width: "100%" }}
                                options={KEY_TYPES.map(option => ({
                                    value: option.value,
                                    label: t(option.label),
                                }))}
                            />
                            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                                {t(KEY_TYPES.find(option => option.value === keyType)?.description ?? "")}
                            </Text>
                        </div>

                        <div style={{ flex: 1, minWidth: 200 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Key Use")}</Text>
                            <Select aria-label={t("Key Use")}
                                value={keyUse}
                                onChange={(use) => { setKeyUse(use); if (!symmetricJwkSizes(use).includes(symmetricKeySize)) setSymmetricKeySize(256); }}
                                style={{ width: "100%" }}
                                disabled={keyType === "EC"} // EC only for signing
                                options={[
                                    { value: "sig", label: t("Signature (sig)") },
                                    { value: "enc", label: t("Encryption (enc)") },
                                ]}
                            />
                        </div>

                        {keyType === "RSA" && (
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Key Size (bits)")}</Text>
                                <Select aria-label={t("Key Size (bits)")}
                                value={rsaKeySize}
                                    onChange={setRsaKeySize}
                                    style={{ width: "100%" }}
                                    options={RSA_KEY_SIZES.map(s => ({
                                        value: s,
                                        label: t("{size} bits", { size: s }),
                                    }))}
                                />
                            </div>
                        )}

                        {keyType === "EC" && (
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Curve")}</Text>
                                <Select aria-label={t("Curve")}
                                value={ecCurve}
                                    onChange={setEcCurve}
                                    style={{ width: "100%" }}
                                    options={EC_CURVES.map(c => ({
                                        value: c.value,
                                        label: `${c.label} → ${c.algorithm}`,
                                    }))}
                                />
                            </div>
                        )}

                        {keyType === "oct" && (
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Key Size (bits)")}</Text>
                                <Select aria-label={t("Key Size (bits)")}
                                value={symmetricKeySize}
                                    onChange={setSymmetricKeySize}
                                    style={{ width: "100%" }}
                                    options={symmetricJwkSizes(keyUse).map(s => ({
                                        value: s,
                                        label: t("{size} bits", { size: s }),
                                    }))}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Key ID (kid) - Optional")}</Text>
                        <Input aria-label={t("Key ID (kid) - Optional")} dir="ltr" styles={{ input: { direction: "ltr" } }}
                            value={keyId}
                            onChange={(e) => setKeyId(e.target.value)}
                            placeholder={t("Auto-generated if empty")}
                            style={{ fontFamily: "monospace" }}
                        />
                    </div>

                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={handleGenerate}
                        loading={isGenerating}
                        size="large"
                        block
                    >
                        {t("Generate JWK")}</Button>

                    {(publicJwk || privateJwk) && (
                        <>
                            <Divider />
                            <Collapse
                                defaultActiveKey={["public", "private", "jwks"]}
                                items={collapseItems}
                            />
                        </>
                    )}
                </Space>
            </Card>
        </ToolPageLayout>
    );
}
