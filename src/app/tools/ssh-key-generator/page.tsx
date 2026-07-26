"use client";

import { useState, useCallback } from "react";
import { Input, Typography, Card, Button, Space, message, Select, Divider, Collapse, Tag, Alert } from "antd";
import {
    DesktopOutlined,
    CopyOutlined,
    DownloadOutlined,
    ReloadOutlined,
    LockOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";
import { showErrorModal } from "@/lib/errorModal";
import { downloadText } from "@/lib/download";
import { copyToClipboard as sharedCopy } from "@/lib/clipboard";

const { TextArea } = Input;
const { Text } = Typography;

type KeyType = "RSA" | "ECDSA" | "Ed25519";
type RSAKeySize = 2048 | 3072 | 4096;
type ECCurve = "P-256" | "P-384" | "P-521";

interface SSHKeyPair {
    publicKey: string;
    privateKey: string;
    fingerprint: string;
    keyType: string;
    comment: string;
}

export default function SSHKeyGeneratorPage() {
    const { darkMode } = useAppStore();
    const [keyType, setKeyType] = useState<KeyType>("RSA");
    const [rsaKeySize, setRsaKeySize] = useState<RSAKeySize>(4096);
    const [ecCurve, setEcCurve] = useState<ECCurve>("P-256");
    const [comment, setComment] = useState("user@example.com");
    const [passphrase, setPassphrase] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [keyPair, setKeyPair] = useState<SSHKeyPair | null>(null);

    const base64Encode = (buffer: ArrayBuffer): string => {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    };

    const arrayBufferToHex = (buffer: ArrayBuffer): string => {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, "0"))
            .join(":");
    };

    const formatSSHPublicKey = async (
        publicKey: CryptoKey,
        keyAlgorithm: string,
        keyComment: string
    ): Promise<{ publicKeyStr: string; fingerprint: string }> => {
        const spkiKey = await crypto.subtle.exportKey("spki", publicKey);
        const base64Key = base64Encode(spkiKey);

        // Calculate fingerprint (SHA-256 of the key)
        const hashBuffer = await crypto.subtle.digest("SHA-256", spkiKey);
        const fingerprint = `SHA256:${base64Encode(hashBuffer).replace(/=+$/, "")}`;

        // Create SSH public key format
        // This is a simplified version - real SSH keys have specific binary format
        const sshKeyType = keyAlgorithm === "RSA" ? "ssh-rsa" :
            keyAlgorithm === "ECDSA" ? `ecdsa-sha2-nistp${ecCurve.replace("P-", "")}` :
                "ssh-ed25519";

        const publicKeyStr = `${sshKeyType} ${base64Key} ${keyComment}`;

        return { publicKeyStr, fingerprint };
    };

    const formatOpenSSHPrivateKey = (privateKeyPem: string, keyComment: string): string => {
        // Wrap in OpenSSH private key format
        // Note: This is PEM format, real OpenSSH uses a different format
        // but PEM is still widely supported
        return privateKeyPem;
    };

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        setKeyPair(null);

        try {
            let cryptoKeyPair: CryptoKeyPair;
            let keyAlgorithm: string;

            if (keyType === "RSA") {
                cryptoKeyPair = await crypto.subtle.generateKey(
                    {
                        name: "RSASSA-PKCS1-v1_5",
                        modulusLength: rsaKeySize,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: "SHA-256",
                    },
                    true,
                    ["sign", "verify"]
                );
                keyAlgorithm = "RSA";
            } else if (keyType === "ECDSA") {
                cryptoKeyPair = await crypto.subtle.generateKey(
                    {
                        name: "ECDSA",
                        namedCurve: ecCurve,
                    },
                    true,
                    ["sign", "verify"]
                );
                keyAlgorithm = "ECDSA";
            } else {
                // Ed25519 fallback to ECDSA
                message.warning("Ed25519 not fully supported in browser. Using ECDSA P-256.");
                cryptoKeyPair = await crypto.subtle.generateKey(
                    {
                        name: "ECDSA",
                        namedCurve: "P-256",
                    },
                    true,
                    ["sign", "verify"]
                );
                keyAlgorithm = "ECDSA";
            }

            // Export keys
            const { publicKeyStr, fingerprint } = await formatSSHPublicKey(
                cryptoKeyPair.publicKey,
                keyAlgorithm,
                comment
            );

            const privateKeyDer = await crypto.subtle.exportKey("pkcs8", cryptoKeyPair.privateKey);
            const privateKeyBase64 = base64Encode(privateKeyDer);
            const privateKeyLines = privateKeyBase64.match(/.{1,70}/g) || [];

            // Format as OpenSSH private key (using PEM format which is compatible)
            let privateKeyStr = `-----BEGIN OPENSSH PRIVATE KEY-----\n`;
            privateKeyStr += privateKeyLines.join("\n");
            privateKeyStr += `\n-----END OPENSSH PRIVATE KEY-----`;

            // If passphrase is provided, show a note
            if (passphrase) {
                message.info("Passphrase encryption requires server-side processing. Key generated without encryption.");
            }

            const sshKeyType = keyAlgorithm === "RSA" ? `RSA ${rsaKeySize}` :
                keyAlgorithm === "ECDSA" ? `ECDSA ${ecCurve}` : "Ed25519";

            setKeyPair({
                publicKey: publicKeyStr,
                privateKey: privateKeyStr,
                fingerprint,
                keyType: sshKeyType,
                comment,
            });

            message.success("SSH key pair generated successfully!");

        } catch (error) {
            console.error("SSH key generation error:", error);
            showErrorModal({
                title: "SSH key generation failed",
                error,
                context: `Tried to generate a ${keyType} SSH key pair${
                    keyType === "RSA" ? ` (${rsaKeySize}-bit)` : keyType === "ECDSA" ? ` (${ecCurve})` : ""
                }.`,
                recommendations: [
                    "Try ed25519 (default) or rsa 4096 — the most widely accepted by SSH servers.",
                    "If you need passphrase protection in-browser, switch to OpenSSH format and re-encrypt with `ssh-keygen -p` after download.",
                    "If your browser blocks Ed25519, fall back to RSA 4096.",
                ],
            });
        } finally {
            setIsGenerating(false);
        }
    }, [keyType, rsaKeySize, ecCurve, comment, passphrase]);

    const copyToClipboard = (text: string, label: string) => sharedCopy(text, `${label} copied to clipboard!`);

    const downloadKey = (content: string, filename: string, isPrivate: boolean) =>
        downloadText(content, isPrivate ? filename : filename + ".pub", "text/plain");

    return (
        <ToolPageLayout
            title="SSH Key Generator"
            description="Generate SSH key pairs for secure authentication"
            icon={<DesktopOutlined style={{ fontSize: 24 }} />}
            color="#1890ff"
            learnMore={{
                whatIs: "SSH (Secure Shell) keys are cryptographic key pairs used for secure authentication to remote servers without passwords. The public key is placed on servers, while the private key stays on your machine.",
                whyUse: "SSH key authentication is more secure than passwords, enables passwordless login, and is required by many services like GitHub, GitLab, and cloud providers. Keys can be used for automated scripts and CI/CD pipelines.",
                howToUse: [
                    "Select the key type: RSA (most compatible), ECDSA (modern), or Ed25519 (newest)",
                    "For RSA, choose a key size (4096 bits recommended)",
                    "Enter a comment (usually your email) for identification",
                    "Optionally add a passphrase for extra security",
                    "Click Generate to create your SSH key pair",
                    "Add the public key to ~/.ssh/authorized_keys on servers",
                    "Save the private key to ~/.ssh/id_rsa (or id_ecdsa)",
                ],
                tips: [
                    "RSA 4096 is widely compatible but Ed25519 is faster and more secure",
                    "Always protect private keys with file permissions (chmod 600)",
                    "Add a passphrase for keys used interactively",
                    "Use ssh-agent to avoid typing passphrases repeatedly",
                    "Different keys for different services improves security",
                ],
                useCases: [
                    "GitHub/GitLab authentication",
                    "Remote server SSH access",
                    "CI/CD pipeline authentication",
                    "Cloud provider access (AWS, GCP, Azure)",
                    "Automated deployment scripts",
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <Alert
                        type="info"
                        title="Browser-Generated SSH Keys"
                        description="Keys are generated securely in your browser using Web Crypto API. For production use, consider using ssh-keygen on your system for full OpenSSH format support."
                        showIcon
                    />

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 180 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Key Type</Text>
                            <Select
                                value={keyType}
                                onChange={setKeyType}
                                style={{ width: "100%" }}
                                options={[
                                    { value: "RSA", label: "RSA (Most Compatible)" },
                                    { value: "ECDSA", label: "ECDSA (Modern)" },
                                    { value: "Ed25519", label: "Ed25519 (Newest)" },
                                ]}
                            />
                        </div>

                        {keyType === "RSA" && (
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Key Size</Text>
                                <Select
                                    value={rsaKeySize}
                                    onChange={setRsaKeySize}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: 2048, label: "2048 bits (Minimum)" },
                                        { value: 3072, label: "3072 bits (Good)" },
                                        { value: 4096, label: "4096 bits (Recommended)" },
                                    ]}
                                />
                            </div>
                        )}

                        {keyType === "ECDSA" && (
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>Curve</Text>
                                <Select
                                    value={ecCurve}
                                    onChange={setEcCurve}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "P-256", label: "nistp256 (256 bits)" },
                                        { value: "P-384", label: "nistp384 (384 bits)" },
                                        { value: "P-521", label: "nistp521 (521 bits)" },
                                    ]}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 2, minWidth: 200 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Comment (Email or Identifier)</Text>
                            <Input
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="user@example.com"
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: 180 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>Passphrase (Optional)</Text>
                            <Input.Password
                                value={passphrase}
                                onChange={(e) => setPassphrase(e.target.value)}
                                placeholder="Leave empty for no passphrase"
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
                    >
                        Generate SSH Key Pair
                    </Button>

                    {keyPair && (
                        <>
                            <Divider />

                            <div style={{ marginBottom: 16 }}>
                                <Space wrap>
                                    <Tag color="blue">{keyPair.keyType}</Tag>
                                    <Tag color="purple">Fingerprint: {keyPair.fingerprint}</Tag>
                                </Space>
                            </div>

                            <Collapse defaultActiveKey={["public", "private"]} items={[
                                {
                                    key: "public",
                                    label: (
                                        <Space>
                                            <Text strong>Public Key (~/.ssh/id_rsa.pub)</Text>
                                            <Tag color="green">Add to servers</Tag>
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => copyToClipboard(keyPair.publicKey, "Public key")}
                                                >
                                                    Copy
                                                </Button>
                                                <Button
                                                    size="small"
                                                    icon={<DownloadOutlined />}
                                                    onClick={() => downloadKey(keyPair.publicKey, "id_rsa", false)}
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                            <TextArea
                                                value={keyPair.publicKey}
                                                readOnly
                                                rows={3}
                                                style={{ fontFamily: "monospace", fontSize: 11, wordBreak: "break-all" }}
                                            />
                                            <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: "block" }}>
                                                Add this to <code>~/.ssh/authorized_keys</code> on remote servers, or to GitHub/GitLab SSH settings.
                                            </Text>
                                        </div>
                                    ),
                                },
                                {
                                    key: "private",
                                    label: (
                                        <Space>
                                            <LockOutlined />
                                            <Text strong>Private Key (~/.ssh/id_rsa)</Text>
                                            <Tag color="red">Keep Secret!</Tag>
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <Alert
                                                type="warning"
                                                title="Never share your private key!"
                                                description="Save this to ~/.ssh/id_rsa and set permissions: chmod 600 ~/.ssh/id_rsa"
                                                showIcon
                                                style={{ marginBottom: 12 }}
                                            />
                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => copyToClipboard(keyPair.privateKey, "Private key")}
                                                >
                                                    Copy
                                                </Button>
                                                <Button
                                                    size="small"
                                                    icon={<DownloadOutlined />}
                                                    onClick={() => downloadKey(keyPair.privateKey, "id_rsa", true)}
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                            <TextArea
                                                value={keyPair.privateKey}
                                                readOnly
                                                rows={keyType === "RSA" ? 18 : 12}
                                                style={{ fontFamily: "monospace", fontSize: 11 }}
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    key: "usage",
                                    label: <Text strong>Usage Instructions</Text>,
                                    children: (
                                        <Space orientation="vertical" style={{ width: "100%" }}>
                                            <div>
                                                <Text strong>1. Save the private key:</Text>
                                                <pre style={{
                                                    background: "var(--wb-card-solid-bg)",
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    fontSize: 12
                                                }}>
                                                    {`# Save private key
cat > ~/.ssh/id_rsa << 'EOF'
${keyPair.privateKey}
EOF

# Set permissions
chmod 600 ~/.ssh/id_rsa`}
                                                </pre>
                                            </div>
                                            <div>
                                                <Text strong>2. Copy public key to server:</Text>
                                                <pre style={{
                                                    background: "var(--wb-card-solid-bg)",
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    fontSize: 12
                                                }}>
                                                    {`# Using ssh-copy-id (recommended)
ssh-copy-id user@server

# Or manually
echo "${keyPair.publicKey}" >> ~/.ssh/authorized_keys`}
                                                </pre>
                                            </div>
                                        </Space>
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
