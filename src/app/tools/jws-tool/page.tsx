"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, Select, Tabs, message, Alert, Radio, Tooltip } from "antd";
import {
    SecurityScanOutlined,
    CopyOutlined,
    CheckOutlined,
    ClearOutlined,
    LockOutlined,
    UnlockOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import { localizeJoseError } from "@/lib/i18n/jose-tools";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";
import { copyToClipboard } from "@/lib/clipboard";
import { signCompactJws, verifyCompactJws, parseJwsHeader } from "@/lib/jws-crypto";

const { TextArea } = Input;
const { Text } = Typography;

type Algorithm = "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "PS256" | "PS384" | "PS512";

const ALGORITHMS: { value: Algorithm; label: string; type: string }[] = [
    { value: "HS256", label: "HS256 (HMAC SHA-256)", type: "symmetric" },
    { value: "HS384", label: "HS384 (HMAC SHA-384)", type: "symmetric" },
    { value: "HS512", label: "HS512 (HMAC SHA-512)", type: "symmetric" },
    { value: "RS256", label: "RS256 (RSA SHA-256)", type: "asymmetric" },
    { value: "RS384", label: "RS384 (RSA SHA-384)", type: "asymmetric" },
    { value: "RS512", label: "RS512 (RSA SHA-512)", type: "asymmetric" },
    { value: "ES256", label: "ES256 (ECDSA P-256)", type: "asymmetric" },
    { value: "ES384", label: "ES384 (ECDSA P-384)", type: "asymmetric" },
    { value: "ES512", label: "ES512 (ECDSA P-521)", type: "asymmetric" },
    { value: "PS256", label: "PS256 (RSA-PSS SHA-256)", type: "asymmetric" },
    { value: "PS384", label: "PS384 (RSA-PSS SHA-384)", type: "asymmetric" },
    { value: "PS512", label: "PS512 (RSA-PSS SHA-512)", type: "asymmetric" },
];

const SAMPLE_PAYLOAD = JSON.stringify({
    sub: "1234567890",
    name: "John Doe",
    iat: 1767225600,
    exp: 1767229200,
}, null, 2);

export default function JWSToolPage() {
    const { t } = useLanguage();
    const { darkMode } = useAppStore();
    const [activeTab, setActiveTab] = useState<"sign" | "verify">("sign");

    // Sign state
    const [payload, setPayload] = useState(SAMPLE_PAYLOAD);
    const [algorithm, setAlgorithm] = useState<Algorithm>("HS256");
    const [secret, setSecret] = useState("0123456789abcdef0123456789abcdef");
    const [privateKey, setPrivateKey] = useState("");
    const [signedJws, setSignedJws] = useState("");

    // Verify state
    const [jwsToVerify, setJwsToVerify] = useState("");
    const [verifyAlgorithm, setVerifyAlgorithm] = useState<Algorithm>("HS256");
    const [verifySecret, setVerifySecret] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [verifyResult, setVerifyResult] = useState<{ valid: boolean; payload?: string; error?: string } | null>(null);

    const isSymmetric = (alg: Algorithm) => alg.startsWith("HS");

    const handleSign = useCallback(async () => {
        setSignedJws("");
        try {
            const signed = await signCompactJws(payload, algorithm, isSymmetric(algorithm) ? secret : privateKey);
            setSignedJws(signed);
            message.success(t("JWS signed successfully!"));
        } catch (error) {
            message.error(t("Signing failed. Check the JSON, algorithm and key, then try again.") + (error instanceof Error ? "\n" + error.message : ""));
        }
    }, [payload, algorithm, secret, privateKey, t]);

    const handleVerify = useCallback(async () => {
        setVerifyResult(null);
        try {
            setVerifyResult(await verifyCompactJws(jwsToVerify, verifyAlgorithm, isSymmetric(verifyAlgorithm) ? verifySecret : publicKey));
        } catch (error) {
            const diagnostic = error instanceof Error ? error.message : "Unknown error";
            setVerifyResult({ valid: false, error: diagnostic === "Invalid JWS format - must have 3 parts" ? diagnostic : `Verification failed: ${diagnostic}` });
        }
    }, [jwsToVerify, verifyAlgorithm, verifySecret, publicKey]);

    const tabItems = [
        {
            key: "sign",
            label: (
                <span>
                    <LockOutlined /> {t("Sign")}</span>
            ),
            children: (
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                        <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Text strong>{t("Algorithm")}</Text>
                            <Tooltip title={t("HMAC algorithms use a shared secret. RSA/ECDSA use public/private key pairs.")}>
                                <InfoCircleOutlined style={{ color: darkMode ? "#8c8c8c" : "#595959" }} />
                            </Tooltip>
                        </div>
                        <Select aria-label={t("Algorithm")}
                                value={algorithm}
                            onChange={setAlgorithm}
                            style={{ width: "100%" }}
                            options={ALGORITHMS.map(a => ({
                                value: a.value,
                                label: a.label,
                            }))}
                        />
                    </div>

                    <div>
                        <Text strong>{t("Payload (JSON)")}</Text>
                        <TextArea aria-label={t("Payload (JSON)")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                            value={payload}
                            onChange={(e) => setPayload(e.target.value)}
                            rows={8}
                            style={{ marginTop: 8, fontFamily: "monospace" }}
                            placeholder='{"sub": "1234567890", "name": "John Doe"}'
                        />
                    </div>

                    {isSymmetric(algorithm) ? (
                        <div>
                            <Text strong>{t("Secret Key")}</Text>
                            <Text type="secondary" style={{ display: "block", marginTop: 4 }}>{t("HMAC secrets need at least 32, 48 or 64 UTF-8 bytes for HS256, HS384 or HS512. Use a random secret; the example is public.")}</Text>
                            <Input.Password aria-label={t("Secret Key")} dir="ltr" styles={{ input: { direction: "ltr" } }}
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                style={{ marginTop: 8, fontFamily: "monospace" }}
                                placeholder="0123456789abcdef0123456789abcdef"
                            />
                        </div>
                    ) : (
                        <div>
                            <Text strong>{t("Private Key (PEM)")}</Text>
                            <TextArea aria-label={t("Private Key (PEM)")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                                value={privateKey}
                                onChange={(e) => setPrivateKey(e.target.value)}
                                rows={6}
                                style={{ marginTop: 8, fontFamily: "monospace" }}
                                placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                            />
                        </div>
                    )}

                    <Button
                        type="primary"
                        icon={<LockOutlined />}
                        onClick={handleSign}
                        size="large"
                        block
                    >
                        {t("Sign JWS")}</Button>

                    {signedJws && (
                        <div>
                            <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text strong>{t("Signed JWS")}</Text>
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(signedJws)}
                                >
                                    {t("Copy")}</Button>
                            </div>
                            <TextArea aria-label={t("Signed JWS")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                                value={signedJws}
                                readOnly
                                rows={4}
                                style={{ fontFamily: "monospace", wordBreak: "break-all" }}
                            />
                        </div>
                    )}
                </Space>
            ),
        },
        {
            key: "verify",
            label: (
                <span>
                    <UnlockOutlined /> {t("Verify")}</span>
            ),
            children: (
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                        <Text strong>{t("JWS Token")}</Text>
                        <TextArea aria-label={t("JWS Token")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                            value={jwsToVerify}
                            onChange={(e) => {
                                setJwsToVerify(e.target.value);
                                setVerifyResult(null);
                            }}
                            rows={4}
                            style={{ marginTop: 8, fontFamily: "monospace" }}
                            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        />
                    </div>

                    <div>
                        <Text strong>{t("Expected algorithm")}</Text>
                        <Select aria-label={t("Expected algorithm")} value={verifyAlgorithm} onChange={(value) => { setVerifyAlgorithm(value); setVerifyResult(null); }} style={{ width: "100%", marginTop: 8, marginBottom: 16 }} options={ALGORITHMS.map(a => ({ value: a.value, label: a.label }))} />
                        <Radio.Group
                            value={jwsToVerify && (() => {
                                try {
                                    const parts = jwsToVerify.split(".");
                                    if (parts.length === 3) {
                                        const header = parseJwsHeader(parts[0]);
                                        return isSymmetric(header.alg) ? "symmetric" : "asymmetric";
                                    }
                                } catch {
                                    return "symmetric";
                                }
                                return "symmetric";
                            })()}
                            style={{ marginBottom: 16 }}
                        >
                            <Radio.Button value="symmetric" disabled>{t("Secret (HMAC)")}</Radio.Button>
                            <Radio.Button value="asymmetric" disabled>{t("Public Key (RSA/EC)")}</Radio.Button>
                        </Radio.Group>
                        <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                            {t("Algorithm detected from JWS header")}</Text>
                    </div>

                    <div>
                        <Text strong>{t("Secret Key or Public Key")}</Text>
                        <TextArea aria-label={t("Secret Key or Public Key")} dir="ltr" styles={{ textarea: { direction: "ltr" } }}
                            value={verifySecret || publicKey}
                            onChange={(e) => {
                                const val = e.target.value;
                                setVerifyResult(null);
                                if (val.includes("-----BEGIN")) {
                                    setPublicKey(val);
                                    setVerifySecret("");
                                } else {
                                    setVerifySecret(val);
                                    setPublicKey("");
                                }
                            }}
                            rows={6}
                            style={{ marginTop: 8, fontFamily: "monospace" }}
                            placeholder={t("Enter secret key for HMAC or public key (PEM) for RSA/ECDSA")}
                        />
                    </div>

                    <Button
                        type="primary"
                        icon={<UnlockOutlined />}
                        onClick={handleVerify}
                        size="large"
                        block
                    >
                        {t("Verify Signature")}</Button>

                    {verifyResult && (
                        <Alert
                            type={verifyResult.valid ? "success" : "error"}
                            title={t(verifyResult.valid ? "Signature Valid" : "Signature Invalid")}
                            description={
                                verifyResult.valid ? (
                                    <div>
                                        <Text strong>{t("Decoded Payload:")}</Text>
                                        <pre dir="ltr" style={{
                                            marginTop: 8,
                                            padding: 12,
                                            background: darkMode ? "var(--signal-inset)" : "var(--signal-inset)",
                                            borderRadius: 6,
                                            overflow: "auto"
                                        }}>
                                            {verifyResult.payload}
                                        </pre>
                                    </div>
                                ) : (
                                    localizeJoseError(t, verifyResult.error ?? "")
                                )
                            }
                            showIcon
                            icon={verifyResult.valid ? <CheckOutlined /> : <ClearOutlined />}
                        />
                    )}
                </Space>
            ),
        },
    ];

    return (
        <ToolPageLayout
            title={t("JWS Sign & Verify")}
            description={t("Create and verify JSON Web Signatures (JWS)")}
            icon={<SecurityScanOutlined style={{ fontSize: 24 }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "JSON Web Signature (JWS) is a standard (RFC 7515) for digitally signing content using JSON-based data structures. JWS is the foundation of JWT - when you have a signed JWT, it's actually a JWS with a JSON payload.",
                whyUse: "JWS provides data integrity and authenticity verification. It ensures that data hasn't been tampered with and confirms the identity of the signer. Essential for secure API authentication, OAuth tokens, and data exchange.",
                howToUse: [
                    "Select a signing algorithm - HMAC for shared secrets, RSA/ECDSA for public-key cryptography",
                    "Enter your JSON payload with claims (e.g., user info, expiration time)",
                    "Provide your secret key (HMAC) or private key (RSA/ECDSA)",
                    "Click Sign to generate the JWS token",
                    "Use the Verify tab to validate signatures with the corresponding key",
                ],
                tips: [
                    "HS256 is simplest but requires sharing the secret - use for internal services",
                    "RS256/ES256 allow public verification without exposing the signing key",
                    "ES256 (ECDSA) provides equivalent security to RS256 with smaller key sizes",
                    "Always include 'exp' (expiration) and 'iat' (issued at) claims",
                    "Use RS256/RS384/RS512 for OAuth 2.0 and OpenID Connect",
                ],
                useCases: [
                    "Creating authentication tokens for APIs",
                    "Signing OAuth 2.0 access tokens",
                    "Verifying webhook payloads",
                    "Secure data exchange between services",
                    "Digital signatures for documents",
                ],
            }}
        >
            <Alert type="warning" showIcon title={t("Decoded claims are untrusted")} description={t("A valid signature does not validate claims. Use only expected algorithms and trusted keys; validate issuer, audience, expiry and purpose in your application.")} style={{ marginBottom: 16 }} />
            <Card>
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key as "sign" | "verify")}
                    items={tabItems}
                />
            </Card>
        </ToolPageLayout>
    );
}
