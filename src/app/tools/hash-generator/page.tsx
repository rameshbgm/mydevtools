"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button, Input, Card, Typography, App, Spin } from "antd";
import { LockOutlined, CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text } = Typography;

// Lazy load CryptoJS only when needed
async function computeHashes(input: string): Promise<Record<string, string>> {
    const CryptoJS = (await import("crypto-js")).default;
    return {
        MD5: CryptoJS.MD5(input).toString(),
        "SHA-1": CryptoJS.SHA1(input).toString(),
        "SHA-224": CryptoJS.SHA224(input).toString(),
        "SHA-256": CryptoJS.SHA256(input).toString(),
        "SHA-384": CryptoJS.SHA384(input).toString(),
        "SHA-512": CryptoJS.SHA512(input).toString(),
        "SHA-3 (224)": CryptoJS.SHA3(input, { outputLength: 224 }).toString(),
        "SHA-3 (256)": CryptoJS.SHA3(input, { outputLength: 256 }).toString(),
        "SHA-3 (384)": CryptoJS.SHA3(input, { outputLength: 384 }).toString(),
        "SHA-3 (512)": CryptoJS.SHA3(input, { outputLength: 512 }).toString(),
        "RIPEMD-160": CryptoJS.RIPEMD160(input).toString(),
    };
}

export default function HashGeneratorPage() {
    const { message } = App.useApp();
    const [input, setInput] = useState("Hello, DevTools Hub!");
    const [hashes, setHashes] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const generate = useCallback(async () => {
        if (!input) { message.warning("Enter some text first"); return; }
        setLoading(true);
        try {
            const result = await computeHashes(input);
            setHashes(result);
        } catch {
            message.error("Error generating hashes");
        } finally {
            setLoading(false);
        }
    }, [input, message]);

    useEffect(() => { generate(); }, []);

    const copyAll = () => {
        const text = Object.entries(hashes).map(([k, v]) => `${k}: ${v}`).join("\n");
        copyToClipboard(text, "All hashes copied!");
    };

    return (
        <ToolPageLayout
            title="Hash Generator"
            description="Generate MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA-3, RIPEMD-160 hashes"
            icon={<LockOutlined style={{ fontSize: 24, color: "#f5222d" }} />}
            color="#f5222d"
            learnMore={{
                whatIs: "A cryptographic hash function takes any input and produces a fixed-size output (hash/digest). The same input always produces the same hash, but it's practically impossible to reverse the process or find two inputs with the same hash.",
                whyUse: "Hashes are essential for password storage, data integrity verification, digital signatures, and checksums. They provide a way to verify data hasn't been tampered with without storing the original data.",
                howToUse: [
                    "Enter your text in the input field",
                    "Click 'Generate Hashes' to compute all hash algorithms",
                    "Copy individual hashes or all at once",
                    "Compare hashes to verify data integrity"
                ],
                tips: [
                    "SHA-256 is the most commonly used secure hash algorithm today",
                    "MD5 and SHA-1 are considered weak - don't use for security",
                    "SHA-3 is the newest standard with different internal design",
                    "Even a tiny change in input completely changes the hash output"
                ],
                useCases: [
                    "Verifying file downloads match expected checksums",
                    "Generating content-based cache keys",
                    "Creating deterministic IDs from data",
                    "Comparing data integrity across systems"
                ]
            }}
        >
            <Card size="small" title="Input Text" style={{ marginBottom: 16 }}>
                <TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }} />
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <Button type="primary" icon={<ReloadOutlined spin={loading} />} onClick={generate} loading={loading}>
                        Generate Hashes
                    </Button>
                    {Object.keys(hashes).length > 0 && (
                        <Button icon={<CopyOutlined />} onClick={copyAll}>Copy All</Button>
                    )}
                </div>
            </Card>

            {loading ? (
                <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {Object.entries(hashes).map(([algo, hash]) => (
                        <Card key={algo} size="small" title={algo} extra={
                            <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(hash, `${algo} copied!`)} />
                        }>
                            <Text code copyable style={{ fontSize: 12, wordBreak: "break-all" }}>{hash}</Text>
                        </Card>
                    ))}
                </div>
            )}
        </ToolPageLayout>
    );
}
