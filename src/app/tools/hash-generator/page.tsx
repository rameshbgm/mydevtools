"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, Input, Card, Typography, App, Spin } from "antd";
import { LockOutlined, CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useLanguage } from "@/components/LanguageProvider";
import { CRYPTO_UTILITY_HELP } from "@/lib/i18n/crypto-utilities";
import SendToButton from "@/components/SendToButton";
import ShareButton from "@/components/ShareButton";
import ToolBridgeBanner from "@/components/ToolBridgeBanner";
import { useShareableState, type ShareSchema } from "@/lib/shareable-state";

const { TextArea } = Input;
const { Text } = Typography;

interface ShareState { input: string; }
const SHARE_SCHEMA: ShareSchema<ShareState> = { toolId: "hash-generator", version: 1 };

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
        "Keccak-224": CryptoJS.SHA3(input, { outputLength: 224 }).toString(),
        "Keccak-256": CryptoJS.SHA3(input, { outputLength: 256 }).toString(),
        "Keccak-384": CryptoJS.SHA3(input, { outputLength: 384 }).toString(),
        "Keccak-512": CryptoJS.SHA3(input, { outputLength: 512 }).toString(),
        "RIPEMD-160": CryptoJS.RIPEMD160(input).toString(),
    };
}

// Name the existing CryptoJS SHA3 digests accurately; the algorithm and digest bytes are unchanged.
function hashAlgorithmLabel(id: string): string {
    const keccak = /^Keccak-(224|256|384|512)$/.exec(id);
    return keccak ? `Keccak-${keccak[1]} (CryptoJS SHA3)` : id;
}

export default function HashGeneratorPage() {
    const { t } = useLanguage();
    const latestT = useRef(t);
    useEffect(() => { latestT.current = t; }, [t]);
    const { message } = App.useApp();
    const [input, setInput] = useState("Hello, mydevtools!");
    const [hashes, setHashes] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const generate = useCallback(async () => {
        if (!input) { message.warning(latestT.current("Enter some text first")); return; }
        setLoading(true);
        try {
            const result = await computeHashes(input);
            setHashes(result);
        } catch (cause: unknown) {
            message.error(cause instanceof Error ? latestT.current("Crypto operation failed: {detail}", { detail: cause.message }) : latestT.current("Error generating hashes"));
        } finally {
            setLoading(false);
        }
    }, [input, message]);

    useEffect(() => { generate(); }, []);

    useShareableState(SHARE_SCHEMA, (s) => {
        setInput(s.input);
        setLoading(true);
        void computeHashes(s.input)
            .then(setHashes)
            .catch((cause: unknown) => message.error(cause instanceof Error ? latestT.current("Crypto operation failed: {detail}", { detail: cause.message }) : latestT.current("Error generating hashes")))
            .finally(() => setLoading(false));
    });

    const copyAll = () => {
        const text = Object.entries(hashes).map(([k, v]) => `${k}: ${v}`).join("\n");
        copyToClipboard(text, t("All hashes copied!"));
    };

    return (
        <ToolPageLayout
            title={t("Hash Generator")}
            description={t("Generate MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, Keccak (CryptoJS SHA3), RIPEMD-160 hashes")}
            icon={<LockOutlined style={{ fontSize: 24, color: "#f5222d" }} />}
            color="#f5222d"
            learnMore={CRYPTO_UTILITY_HELP["hash-generator"]}
        >
            <ToolBridgeBanner
                accepts={["text"]}
                onAccept={(p) => setInput(p.data)}
            />

            <Card size="small" title={t("Input Text")} style={{ marginBottom: 16 }}>
                <TextArea aria-label={t("Input Text")} dir="auto" rows={4} value={input} onChange={(e) => setInput(e.target.value)} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }} />
                <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Button type="primary" icon={<ReloadOutlined spin={loading} />} onClick={generate} loading={loading}>
                        {t("Generate Hashes")}
                    </Button>
                    {Object.keys(hashes).length > 0 && (
                        <Button icon={<CopyOutlined />} onClick={copyAll}>{t("Copy All")}</Button>
                    )}
                    <ShareButton schema={SHARE_SCHEMA} getState={() => ({ input })} />
                    <SendToButton data={input} kind="text" sourceToolId="hash-generator" />
                </div>
            </Card>

            {loading ? (
                <div style={{ textAlign: "center", padding: 40 }}><Spin /></div>
            ) : (
                <div className="tool-split-pane" style={{ gap: 12 }}>
                    {Object.entries(hashes).map(([algo, hash]) => (
                        <Card key={algo} size="small" title={<bdi dir="ltr">{hashAlgorithmLabel(algo)}</bdi>} extra={
                            <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(hash, t("{algorithm} copied!", { algorithm: hashAlgorithmLabel(algo) }))} />
                        }>
                            <Text dir="ltr" code copyable={{ tooltips: [t("Copy"), t("Copied!")] }} style={{ fontSize: 12, wordBreak: "break-all" }}>{hash}</Text>
                        </Card>
                    ))}
                </div>
            )}
        </ToolPageLayout>
    );
}
