"use client";

import React, { useState } from "react";
import { Button, Card, Space, Input, Segmented, Select, App, Typography } from "antd";
import { CopyOutlined, ClearOutlined, SafetyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";
import CryptoJS from "crypto-js";

const { TextArea } = Input;
const { Text } = Typography;

type Mode = "Encrypt" | "Decrypt";
type KeySize = 128 | 192 | 256;

export default function AesToolPage() {
    const { message } = App.useApp();
    const [mode, setMode] = useState<Mode>("Encrypt");
    const [keySize, setKeySize] = useState<KeySize>(256);
    const [passphrase, setPassphrase] = useState("");
    const [input, setInput] = useState("Hello, mydevtools!");
    const [output, setOutput] = useState("");

    const run = () => {
        if (!passphrase) {
            message.warning("Enter a passphrase");
            return;
        }
        if (!input) {
            message.warning("Enter text");
            return;
        }
        try {
            if (mode === "Encrypt") {
                const cfg = { keySize: keySize / 32 };
                const encrypted = CryptoJS.AES.encrypt(input, passphrase, cfg).toString();
                setOutput(encrypted);
            } else {
                const cfg = { keySize: keySize / 32 };
                const decrypted = CryptoJS.AES.decrypt(input, passphrase, cfg);
                const text = decrypted.toString(CryptoJS.enc.Utf8);
                if (!text) throw new Error("Decryption failed — wrong passphrase or corrupted ciphertext");
                setOutput(text);
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Operation failed";
            message.error(msg);
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
            title="AES Encrypt & Decrypt"
            description="Symmetric AES encryption with passphrase (CBC + PBKDF2)"
            icon={<SafetyOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs:
                    "AES (Advanced Encryption Standard) is a symmetric block cipher used worldwide for encrypting data at rest and in transit. This tool uses crypto-js OpenSSL-compatible AES with passphrase-derived keys (PBKDF2), CBC mode, and a random salt + IV.",
                whyUse:
                    "Quickly encrypt or decrypt small text payloads — config secrets, debug data, ciphertext from CLI tools — without installing OpenSSL. Output is OpenSSL-compatible (Salted__... base64).",
                howToUse: [
                    "Choose Encrypt or Decrypt",
                    "Pick a key size (128, 192, 256 bits)",
                    "Enter a passphrase — same passphrase needed to decrypt",
                    "Paste text or ciphertext",
                ],
                tips: [
                    "Always use AES-256 unless you have a specific reason not to",
                    "Each encryption produces different ciphertext (random salt+IV)",
                    "Compatible with `openssl enc -aes-256-cbc -base64`",
                ],
                useCases: [
                    "Quick encryption of debug logs and config secrets",
                    "Round-tripping ciphertext from OpenSSL CLI",
                    "Teaching / learning AES symmetric crypto",
                ],
            }}
        >
            <Space style={{ marginBottom: 16 }} wrap>
                <Segmented<Mode>
                    options={["Encrypt", "Decrypt"]}
                    value={mode}
                    onChange={(v) => setMode(v)}
                    size="large"
                />
                <Select
                    value={keySize}
                    onChange={(v) => setKeySize(v as KeySize)}
                    style={{ width: 130 }}
                    options={[
                        { value: 128, label: "AES-128" },
                        { value: 192, label: "AES-192" },
                        { value: 256, label: "AES-256" },
                    ]}
                />
                <Button type="primary" icon={<SafetyOutlined />} onClick={run}>{mode}</Button>
                <Button onClick={swap} disabled={!output}>Use Output as Input</Button>
                <Button icon={<CopyOutlined />} disabled={!output} onClick={() => copyToClipboard(output)}>Copy</Button>
                <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); setPassphrase(""); }}>Clear</Button>
            </Space>

            <Card style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>Passphrase</Text>
                <Input.Password
                    size="large"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter passphrase used for key derivation"
                />
            </Card>

            <div className="tool-split-pane" style={{ gap: 16 }}>
                <Card size="small" title={mode === "Encrypt" ? "Plaintext" : "Ciphertext (Base64)"}>
                    <TextArea
                        rows={14}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === "Encrypt" ? "Text to encrypt" : "U2FsdGVkX1+..."}
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                    />
                </Card>
                <Card size="small" title={mode === "Encrypt" ? "Ciphertext (Base64)" : "Plaintext"}>
                    <TextArea
                        rows={14}
                        value={output}
                        readOnly
                        placeholder="Output will appear here"
                        style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                    />
                </Card>
            </div>
        </ToolPageLayout>
    );
}
