"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, Select, Tabs, message, Alert, Divider, Radio, Tooltip } from "antd";
import {
    SecurityScanOutlined,
    CopyOutlined,
    CheckOutlined,
    ClearOutlined,
    LockOutlined,
    UnlockOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";
import { copyToClipboard } from "@/lib/clipboard";

const { TextArea } = Input;
const { Text, Title } = Typography;

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
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
}, null, 2);

export default function JWSToolPage() {
    const { darkMode } = useAppStore();
    const [activeTab, setActiveTab] = useState<"sign" | "verify">("sign");

    // Sign state
    const [payload, setPayload] = useState(SAMPLE_PAYLOAD);
    const [algorithm, setAlgorithm] = useState<Algorithm>("HS256");
    const [secret, setSecret] = useState("your-256-bit-secret");
    const [privateKey, setPrivateKey] = useState("");
    const [signedJws, setSignedJws] = useState("");

    // Verify state
    const [jwsToVerify, setJwsToVerify] = useState("");
    const [verifySecret, setVerifySecret] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [verifyResult, setVerifyResult] = useState<{ valid: boolean; payload?: string; error?: string } | null>(null);

    const isSymmetric = (alg: Algorithm) => alg.startsWith("HS");

    const base64UrlEncode = (str: string): string => {
        return btoa(str)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    };

    const base64UrlDecode = (str: string): string => {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) base64 += "=";
        return atob(base64);
    };

    const getAlgorithmParams = (alg: Algorithm): { name: string; hash?: string } => {
        switch (alg) {
            case "HS256": return { name: "HMAC", hash: "SHA-256" };
            case "HS384": return { name: "HMAC", hash: "SHA-384" };
            case "HS512": return { name: "HMAC", hash: "SHA-512" };
            case "RS256": return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };
            case "RS384": return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-384" };
            case "RS512": return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-512" };
            case "ES256": return { name: "ECDSA", hash: "SHA-256" };
            case "ES384": return { name: "ECDSA", hash: "SHA-384" };
            case "ES512": return { name: "ECDSA", hash: "SHA-512" };
            case "PS256": return { name: "RSA-PSS", hash: "SHA-256" };
            case "PS384": return { name: "RSA-PSS", hash: "SHA-384" };
            case "PS512": return { name: "RSA-PSS", hash: "SHA-512" };
            default: return { name: "HMAC", hash: "SHA-256" };
        }
    };

    const handleSign = useCallback(async () => {
        try {
            // Validate payload is valid JSON
            JSON.parse(payload);

            const header = { alg: algorithm, typ: "JWT" };
            const encodedHeader = base64UrlEncode(JSON.stringify(header));
            const encodedPayload = base64UrlEncode(payload);
            const signingInput = `${encodedHeader}.${encodedPayload}`;

            const algParams = getAlgorithmParams(algorithm);
            const encoder = new TextEncoder();

            let cryptoKey: CryptoKey;

            if (isSymmetric(algorithm)) {
                // HMAC
                cryptoKey = await crypto.subtle.importKey(
                    "raw",
                    encoder.encode(secret),
                    { name: algParams.name, hash: algParams.hash },
                    false,
                    ["sign"]
                );
            } else {
                // RSA/ECDSA - parse PEM
                if (!privateKey.trim()) {
                    message.error("Private key is required for asymmetric algorithms");
                    return;
                }

                const pemContent = privateKey
                    .replace(/-----BEGIN [A-Z ]+-----/, "")
                    .replace(/-----END [A-Z ]+-----/, "")
                    .replace(/\s/g, "");

                const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));

                const keyAlgorithm: RsaHashedImportParams | EcKeyImportParams =
                    algorithm.startsWith("ES")
                        ? { name: algParams.name, namedCurve: algorithm === "ES256" ? "P-256" : algorithm === "ES384" ? "P-384" : "P-521" }
                        : { name: algParams.name, hash: algParams.hash! };

                cryptoKey = await crypto.subtle.importKey(
                    "pkcs8",
                    binaryKey,
                    keyAlgorithm,
                    false,
                    ["sign"]
                );
            }

            let signParams: AlgorithmIdentifier | RsaPssParams | EcdsaParams;
            if (algorithm.startsWith("PS")) {
                const saltLength = algorithm === "PS256" ? 32 : algorithm === "PS384" ? 48 : 64;
                signParams = { name: algParams.name, saltLength };
            } else if (algorithm.startsWith("ES")) {
                signParams = { name: algParams.name, hash: algParams.hash! };
            } else {
                signParams = { name: algParams.name };
            }

            const signature = await crypto.subtle.sign(
                signParams,
                cryptoKey,
                encoder.encode(signingInput)
            );

            const encodedSignature = base64UrlEncode(
                String.fromCharCode(...new Uint8Array(signature))
            );

            setSignedJws(`${signingInput}.${encodedSignature}`);
            message.success("JWS signed successfully!");
        } catch (error) {
            message.error(`Signing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }, [payload, algorithm, secret, privateKey]);

    const handleVerify = useCallback(async () => {
        try {
            const parts = jwsToVerify.split(".");
            if (parts.length !== 3) {
                setVerifyResult({ valid: false, error: "Invalid JWS format - must have 3 parts" });
                return;
            }

            const [encodedHeader, encodedPayload, encodedSignature] = parts;
            const header = JSON.parse(base64UrlDecode(encodedHeader));
            const alg = header.alg as Algorithm;

            if (!ALGORITHMS.find(a => a.value === alg)) {
                setVerifyResult({ valid: false, error: `Unsupported algorithm: ${alg}` });
                return;
            }

            const algParams = getAlgorithmParams(alg);
            const encoder = new TextEncoder();
            const signingInput = `${encodedHeader}.${encodedPayload}`;

            let cryptoKey: CryptoKey;

            if (isSymmetric(alg)) {
                cryptoKey = await crypto.subtle.importKey(
                    "raw",
                    encoder.encode(verifySecret),
                    { name: algParams.name, hash: algParams.hash },
                    false,
                    ["verify"]
                );
            } else {
                if (!publicKey.trim()) {
                    setVerifyResult({ valid: false, error: "Public key is required for asymmetric algorithms" });
                    return;
                }

                const pemContent = publicKey
                    .replace(/-----BEGIN [A-Z ]+-----/, "")
                    .replace(/-----END [A-Z ]+-----/, "")
                    .replace(/\s/g, "");

                const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));

                const keyAlgorithm: RsaHashedImportParams | EcKeyImportParams =
                    alg.startsWith("ES")
                        ? { name: algParams.name, namedCurve: alg === "ES256" ? "P-256" : alg === "ES384" ? "P-384" : "P-521" }
                        : { name: algParams.name, hash: algParams.hash! };

                cryptoKey = await crypto.subtle.importKey(
                    "spki",
                    binaryKey,
                    keyAlgorithm,
                    false,
                    ["verify"]
                );
            }

            const signatureBytes = Uint8Array.from(
                base64UrlDecode(encodedSignature),
                c => c.charCodeAt(0)
            );

            let verifyParams: AlgorithmIdentifier | RsaPssParams | EcdsaParams;
            if (alg.startsWith("PS")) {
                const saltLength = alg === "PS256" ? 32 : alg === "PS384" ? 48 : 64;
                verifyParams = { name: algParams.name, saltLength };
            } else if (alg.startsWith("ES")) {
                verifyParams = { name: algParams.name, hash: algParams.hash! };
            } else {
                verifyParams = { name: algParams.name };
            }

            const valid = await crypto.subtle.verify(
                verifyParams,
                cryptoKey,
                signatureBytes,
                encoder.encode(signingInput)
            );

            const decodedPayload = base64UrlDecode(encodedPayload);
            setVerifyResult({
                valid,
                payload: valid ? JSON.stringify(JSON.parse(decodedPayload), null, 2) : undefined,
                error: valid ? undefined : "Signature verification failed",
            });
        } catch (error) {
            setVerifyResult({
                valid: false,
                error: `Verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            });
        }
    }, [jwsToVerify, verifySecret, publicKey]);

    const tabItems = [
        {
            key: "sign",
            label: (
                <span>
                    <LockOutlined /> Sign
                </span>
            ),
            children: (
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                        <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Text strong>Algorithm</Text>
                            <Tooltip title="HMAC algorithms use a shared secret. RSA/ECDSA use public/private key pairs.">
                                <InfoCircleOutlined style={{ color: darkMode ? "#8c8c8c" : "#595959" }} />
                            </Tooltip>
                        </div>
                        <Select
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
                        <Text strong>Payload (JSON)</Text>
                        <TextArea
                            value={payload}
                            onChange={(e) => setPayload(e.target.value)}
                            rows={8}
                            style={{ marginTop: 8, fontFamily: "monospace" }}
                            placeholder='{"sub": "1234567890", "name": "John Doe"}'
                        />
                    </div>

                    {isSymmetric(algorithm) ? (
                        <div>
                            <Text strong>Secret Key</Text>
                            <Input.Password
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                style={{ marginTop: 8, fontFamily: "monospace" }}
                                placeholder="your-256-bit-secret"
                            />
                        </div>
                    ) : (
                        <div>
                            <Text strong>Private Key (PEM)</Text>
                            <TextArea
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
                        Sign JWS
                    </Button>

                    {signedJws && (
                        <div>
                            <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text strong>Signed JWS</Text>
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(signedJws)}
                                >
                                    Copy
                                </Button>
                            </div>
                            <TextArea
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
                    <UnlockOutlined /> Verify
                </span>
            ),
            children: (
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                        <Text strong>JWS Token</Text>
                        <TextArea
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
                        <Radio.Group
                            value={jwsToVerify && (() => {
                                try {
                                    const parts = jwsToVerify.split(".");
                                    if (parts.length === 3) {
                                        const header = JSON.parse(base64UrlDecode(parts[0]));
                                        return isSymmetric(header.alg) ? "symmetric" : "asymmetric";
                                    }
                                } catch {
                                    return "symmetric";
                                }
                                return "symmetric";
                            })()}
                            style={{ marginBottom: 16 }}
                        >
                            <Radio.Button value="symmetric" disabled>Secret (HMAC)</Radio.Button>
                            <Radio.Button value="asymmetric" disabled>Public Key (RSA/EC)</Radio.Button>
                        </Radio.Group>
                        <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                            Algorithm detected from JWS header
                        </Text>
                    </div>

                    <div>
                        <Text strong>Secret Key or Public Key</Text>
                        <TextArea
                            value={verifySecret || publicKey}
                            onChange={(e) => {
                                const val = e.target.value;
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
                            placeholder="Enter secret key for HMAC or public key (PEM) for RSA/ECDSA"
                        />
                    </div>

                    <Button
                        type="primary"
                        icon={<UnlockOutlined />}
                        onClick={handleVerify}
                        size="large"
                        block
                    >
                        Verify Signature
                    </Button>

                    {verifyResult && (
                        <Alert
                            type={verifyResult.valid ? "success" : "error"}
                            title={verifyResult.valid ? "Signature Valid" : "Signature Invalid"}
                            description={
                                verifyResult.valid ? (
                                    <div>
                                        <Text strong>Decoded Payload:</Text>
                                        <pre style={{
                                            marginTop: 8,
                                            padding: 12,
                                            background: darkMode ? "#1f1f1f" : "#f5f5f5",
                                            borderRadius: 6,
                                            overflow: "auto"
                                        }}>
                                            {verifyResult.payload}
                                        </pre>
                                    </div>
                                ) : (
                                    verifyResult.error
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
            title="JWS Sign & Verify"
            description="Create and verify JSON Web Signatures (JWS)"
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
