"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { CERTIFICATE_TOOL_TRANSLATIONS } from "@/lib/i18n/certificate-tools";

import { useState, useCallback } from "react";
import { App, Input, Typography, Card, Button, Space, Select, Divider, Collapse, Tag, Alert } from "antd";
import {
    DesktopOutlined,
    CopyOutlined,
    DownloadOutlined,
    ReloadOutlined,
    LockOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { generateSSHKeyPair, type GeneratedSSHKeyPair, type SSHKeyType, type SSHRSASize, type SSHCurve } from "@/lib/ssh-key-generation";
import { showErrorModal } from "@/lib/errorModal";
import { downloadText } from "@/lib/download";
import { copyToClipboard as sharedCopy } from "@/lib/clipboard";

const { TextArea } = Input;
const { Text } = Typography;

export default function SSHKeyGeneratorPage() {
    const { t } = useLanguage();
    const { message } = App.useApp();
    const [keyType, setKeyType] = useState<SSHKeyType>("RSA");
    const [rsaKeySize, setRsaKeySize] = useState<SSHRSASize>(4096);
    const [ecCurve, setEcCurve] = useState<SSHCurve>("P-256");
    const [comment, setComment] = useState("user@example.com");
    const [isGenerating, setIsGenerating] = useState(false);
    const [keyPair, setKeyPair] = useState<GeneratedSSHKeyPair | null>(null);

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        setKeyPair(null);

        try {
            const generated = await generateSSHKeyPair({ type: keyType, rsaSize: rsaKeySize, curve: ecCurve, comment });
            setKeyPair(generated);

            message.success(t("SSH key pair generated successfully!"));

        } catch (error) {
            console.error("SSH key generation error:", error);
            showErrorModal({
                title: t("SSH key generation failed"),
                error,
                context: error instanceof Error && Object.hasOwn(CERTIFICATE_TOOL_TRANSLATIONS, error.message) ? t(error.message) : t("Could not generate a {algorithm} SSH key pair.", { algorithm: keyType === "RSA" ? `RSA ${rsaKeySize}` : keyType === "ECDSA" ? `ECDSA ${ecCurve}` : "Ed25519" }),
                recommendations: [
                    t("Try RSA 4096 if your browser does not support Ed25519."),
                    t("Downloaded private keys are unencrypted. Add a passphrase locally with ssh-keygen -p -f followed by the saved private-key path."),
                    t("If your browser blocks Ed25519, fall back to RSA 4096."),
                ],
            });
        } finally {
            setIsGenerating(false);
        }
    }, [keyType, rsaKeySize, ecCurve, comment, message, t]);

    const copyToClipboard = (text: string, label: string) => sharedCopy(text, t("{label} copied to clipboard!", { label }));

    const downloadKey = (content: string, filename: string, isPrivate: boolean) =>
        downloadText(content, isPrivate ? filename : filename + ".pub", "text/plain");

    return (
        <ToolPageLayout
            title={t("SSH Key Generator")}
            description={t("Generate SSH key pairs for secure authentication")}
            icon={<DesktopOutlined style={{ fontSize: 24 }} />}
            color="#1890ff"
            learnMore={{
                whatIs: t("SSH (Secure Shell) keys are cryptographic key pairs used for secure authentication to remote servers without passwords. The public key is placed on servers, while the private key stays on your machine."),
                whyUse: t("SSH key authentication is more secure than passwords, enables passwordless login, and is required by many services like GitHub, GitLab, and cloud providers. Keys can be used for automated scripts and CI/CD pipelines."),
                howToUse: [
                    t("Select the key type: RSA (most compatible), ECDSA (modern), or Ed25519 (newest)"),
                    t("For RSA, choose a key size (4096 bits recommended)"),
                    t("Enter a comment (usually your email) for identification"),
                    t("Private keys are unencrypted; add a passphrase locally with ssh-keygen -p after saving"),
                    t("Click Generate to create your SSH key pair"),
                    t("Add the public key to ~/.ssh/authorized_keys on servers"),
                    t("Save the matching private and public files, then set the private file permissions to chmod 600"),
                ],
                tips: [
                    t("Ed25519 requires browser support; unsupported browsers report an error without changing the selected algorithm"),
                    t("Always protect private keys with file permissions (chmod 600)"),
                    t("Use ssh-keygen -p -f with the saved private-key path to add a passphrase"),
                    t("Use ssh-agent to avoid typing passphrases repeatedly"),
                    t("Different keys for different services improves security"),
                ],
                useCases: [
                    t("GitHub/GitLab authentication"),
                    t("Remote server SSH access"),
                    t("CI/CD pipeline authentication"),
                    t("Cloud provider access (AWS, GCP, Azure)"),
                    t("Automated deployment scripts"),
                ],
            }}
        >
            <Card>
                <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                    <Alert
                        type="info"
                        title={t("Browser-Generated SSH Keys")}
                        description={t("Real RSA, ECDSA and Ed25519 keys are generated locally with Web Crypto and exported in OpenSSH format. Private keys are unencrypted. Save them with chmod 600 and add a passphrase locally using ssh-keygen -p -f followed by the private-key path.")}
                        showIcon
                    />

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 180 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Key Type")}</Text>
                            <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Key Type")}
                                value={keyType}
                                onChange={setKeyType}
                                style={{ width: "100%" }}
                                options={[
                                    { value: "RSA", label: t("RSA (Most Compatible)") },
                                    { value: "ECDSA", label: t("ECDSA (Modern)") },
                                    { value: "Ed25519", label: t("Ed25519 (Newest)") },
                                ]}
                            />
                        </div>

                        {keyType === "RSA" && (
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Key Size")}</Text>
                                <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Key Size")}
                                    value={rsaKeySize}
                                    onChange={setRsaKeySize}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: 2048, label: t("2048 bits (Minimum)") },
                                        { value: 3072, label: t("3072 bits (Good)") },
                                        { value: 4096, label: t("4096 bits (Recommended)") },
                                    ]}
                                />
                            </div>
                        )}

                        {keyType === "ECDSA" && (
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Curve")}</Text>
                                <Select styles={{ root: { maxWidth: "100%", minWidth: 0 }, input: { fontSize: 16 }, popup: { root: { maxWidth: "calc(100vw - 32px)", overflowWrap: "anywhere" } } }} aria-label={t("Curve")}
                                    value={ecCurve}
                                    onChange={setEcCurve}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: "P-256", label: t("nistp256 (256 bits)") },
                                        { value: "P-384", label: t("nistp384 (384 bits)") },
                                        { value: "P-521", label: t("nistp521 (521 bits)") },
                                    ]}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 2, minWidth: 200 }}>
                            <Text strong style={{ display: "block", marginBottom: 8 }}>{t("Comment (Email or Identifier)")}</Text>
                            <Input styles={{ input: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Comment (Email or Identifier)")}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="user@example.com"
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
                    >{t("Generate SSH Key Pair")}</Button>

                    {keyPair && (
                        <>
                            <Divider />

                            <div style={{ marginBottom: 16 }}>
                                <Space wrap>
                                    <Tag color="blue">{keyPair.keyType}</Tag>
                                    <Tag color="purple">{t("Fingerprint:")}{keyPair.fingerprint}</Tag>
                                </Space>
                            </div>

                            <Collapse defaultActiveKey={["public", "private"]} items={[
                                {
                                    key: "public",
                                    label: (
                                        <Space>
                                            <Text strong>{t("Public Key")}</Text>
                                            <Tag color="green">{t("Add to servers")}</Tag>
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
                                                    onClick={() => downloadKey(keyPair.publicKey, keyPair.filename, false)}
                                                >{t("Download")}</Button>
                                            </div>
                                            <TextArea dir="ltr" styles={{ textarea: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Public key output")}
                                                value={keyPair.publicKey}
                                                readOnly
                                                rows={3}
                                                style={{ direction: "ltr", textAlign: "left", fontFamily: "monospace", fontSize: 16, wordBreak: "break-all" }}
                                            />
                                            <Text type="secondary" style={{ fontSize: 16, marginTop: 8, display: "block" }}>{t("Add this to")}<code dir="ltr">~/.ssh/authorized_keys</code>{t("on remote servers, or to GitHub/GitLab SSH settings.")}</Text>
                                        </div>
                                    ),
                                },
                                {
                                    key: "private",
                                    label: (
                                        <Space>
                                            <LockOutlined />
                                            <Text strong>{t("Private Key (unencrypted OpenSSH)")}</Text>
                                            <Tag color="red">{t("Keep Secret!")}</Tag>
                                        </Space>
                                    ),
                                    children: (
                                        <div>
                                            <Alert
                                                type="warning"
                                                title={t("Never share your private key!")}
                                                description={t("Save the private file with chmod 600. Add a passphrase with ssh-keygen -p -f followed by its path. Keep a protected backup.")}
                                                showIcon
                                                style={{ marginBottom: 12 }}
                                            />
                                            <div style={{ marginBottom: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => copyToClipboard(keyPair.privateKey, t("Private key"))}
                                                >{t("Copy")}</Button>
                                                <Button
                                                    size="small"
                                                    icon={<DownloadOutlined />}
                                                    onClick={() => downloadKey(keyPair.privateKey, keyPair.filename, true)}
                                                >{t("Download")}</Button>
                                            </div>
                                            <TextArea dir="ltr" styles={{ textarea: { fontSize: 16, direction: "ltr", textAlign: "left" } }} aria-label={t("Private key output")}
                                                value={keyPair.privateKey}
                                                readOnly
                                                rows={keyPair.keyType.startsWith("RSA") ? 18 : 12}
                                                style={{ direction: "ltr", textAlign: "left", fontFamily: "monospace", fontSize: 16 }}
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    key: "usage",
                                    label: <Text strong>{t("Usage Instructions")}</Text>,
                                    children: (
                                        <Space orientation="vertical" style={{ width: "100%" }}>
                                            <div>
                                                <Text strong>{t("1. Save the private key:")}</Text>
                                                <pre dir="ltr" style={{
                                                    background: "var(--wb-card-solid-bg)",
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    fontSize: 16
                                                }}>
                                                    {`# Save private key
cat > ~/.ssh/${keyPair.filename} << 'EOF'
${keyPair.privateKey}
EOF

# Set permissions
chmod 600 ~/.ssh/${keyPair.filename}`}
                                                </pre>
                                            </div>
                                            <div>
                                                <Text strong>{t("2. Copy public key to server:")}</Text>
                                                <pre dir="ltr" style={{
                                                    background: "var(--wb-card-solid-bg)",
                                                    padding: 8,
                                                    borderRadius: 4,
                                                    fontSize: 16
                                                }}>
                                                    {`# Save the public key next to the private key first
ssh-copy-id -i ~/.ssh/${keyPair.filename}.pub user@server

# Add a passphrase to the private key locally
ssh-keygen -p -f ~/.ssh/${keyPair.filename}` }
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
