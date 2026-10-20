"use client";

import { useLanguage } from "@/components/LanguageProvider";
import React, { useMemo, useState } from "react";
import { Card, Typography, Input, Row, Col, Space, Tag, Select, Button } from "antd";
import { SwapOutlined, CopyOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";
import { convertStructuredFormat, type StructuredFormat } from "@/lib/format-conversion";
import { downloadText } from "@/lib/download";

const { Text } = Typography;
const { TextArea } = Input;

type Fmt = StructuredFormat;

const SAMPLE_TOML = `# Sample config
title = "mydevtools"
version = "2.0.0"

[server]
host = "0.0.0.0"
port = 3000
enabled = true

[database]
url = "postgres://localhost/app"
pool_size = 10
tags = ["prod", "primary"]`;

export default function TomlConverterPage() {
    const { t } = useLanguage();
    const [from, setFrom] = useState<Fmt>("toml");
    const [to, setTo] = useState<Fmt>("json");
    const [input, setInput] = useState(SAMPLE_TOML);
    const [rootName, setRootName] = useState("root");

    const { output, error } = useMemo(() => {
        try { return { output: convertStructuredFormat(input, from, to, rootName), error: null }; }
        catch (err) { return { output: "", error: err instanceof Error ? err.message : String(err) }; }
    }, [input, from, to, rootName]);

    const errorText = (() => {
        if (!error) return "";
        const invalidName = /^“([\s\S]*)” is not a valid XML element or attribute name\.$/.exec(error);
        if (invalidName) return t("Invalid XML element or attribute name: {name}", { name: invalidName[1] });
        const noNull = /^(TOML|XML) has no unambiguous null representation\. Remove nulls or choose JSON\/YAML\.$/.exec(error);
        if (noNull) return t("{format} has no unambiguous null representation. Remove nulls or choose JSON/YAML.", { format: noNull[1] });
        if (error.startsWith("Invalid XML: ")) return t("Invalid XML: {details}", { details: error.slice(13) });
        const xmlOutputPrefix = "The data cannot be represented as a single XML document: ";
        if (error.startsWith(xmlOutputPrefix)) return t("The data cannot be represented as a single XML document: {details}", { details: error.slice(xmlOutputPrefix.length) });
        return t(error);
    })();

    const swap = () => {
        if (!error) setInput(output);
        const t = from; setFrom(to); setTo(t);
    };

    const copyOutput = async () => {
        await copyToClipboard(output);
    };

    return (
        <ToolPageLayout
            title="JSON / YAML / TOML / XML Converter"
            description="Convert in all twelve directions between JSON, YAML, TOML and XML"
            icon={<SwapOutlined style={{ fontSize: 24, color: "#a16207" }} />}
            color="#a16207"
            learnMore={{
                whatIs: "Convert JSON, YAML, TOML and XML locally in all twelve directions. Unsupported mappings produce errors instead of silent data loss.",
                whyUse: "Move supported configuration values between formats and inspect the result before saving it.",
                howToUse: ["Choose the source and destination formats, then paste a document up to 2 MiB.", "Read the mapping notes and resolve any error before copying or downloading output.", "Swap uses valid output as the next input; when an error exists, it keeps your original input."],
                tips: ["Comments and formatting are omitted. XML text stays strings, and TOML date/time values become ISO text.", "Quote precision-sensitive numeric values before conversion. TOML and XML cannot represent null unambiguously.", "XML uses @_attribute for attributes and #text for text. Top-level arrays use item elements inside the selected root."],
            }}
        >
            <Card>
                <Space wrap size="middle" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Space wrap>
                        <Text type="secondary">{t("From:")}</Text>
                        <Select aria-label={t("Source format")} value={from} onChange={setFrom} options={[
                            { value: "toml", label: "TOML" },
                            { value: "json", label: "JSON" },
                            { value: "yaml", label: "YAML" },
                            { value: "xml", label: "XML" },
                        ]} style={{ width: 100 }} />
                        <button type="button" onClick={swap}>{t("Swap formats")}</button>
                        <Text type="secondary">{t("To:")}</Text>
                        <Select aria-label={t("Destination format")} value={to} onChange={setTo} options={[
                            { value: "toml", label: "TOML" },
                            { value: "json", label: "JSON" },
                            { value: "yaml", label: "YAML" },
                            { value: "xml", label: "XML" },
                        ]} style={{ width: 100 }} />
                    </Space>
                    {error ? <Tag color="red">{t("Conversion error")}</Tag> : <Tag color="green">{t(input.trim() ? "Ready" : "Waiting for input")}</Tag>}
                </Space>
            </Card>

            <div className="wb-workbench" style={{ marginTop: 18 }}>{to === "xml" && <label>{t("XML root wrapper name")}<input dir="ltr" value={rootName} maxLength={100} onChange={(event) => setRootName(event.target.value)} /></label>}<p>{t("One named XML root is retained; otherwise the chosen root wraps the output. Conversion omits comments and formatting. Review the mapping notes before use.")}</p><button disabled={!!error || !output} onClick={() => downloadText(output, `converted.${to}`, to === "xml" ? "application/xml" : "text/plain")}>{t("Download {format}", { format: to.toUpperCase() })}</button></div>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                    <Card size="small" title={<Space><Text strong>{t("Input")}</Text><Tag color="blue">{from.toUpperCase()}</Tag></Space>}>
                        <TextArea
                            value={input}
                            aria-label={t("Conversion input")}
                            dir="ltr"
                            onChange={(e) => setInput(e.target.value)}
                            autoSize={{ minRows: 16, maxRows: 28 }}
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16, direction: "ltr", textAlign: "left" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        size="small"
                        title={<Space><Text strong>{t("Output")}</Text><Tag color="green">{to.toUpperCase()}</Tag></Space>}
                        extra={!error && <Button type="text" disabled={!output} onClick={copyOutput} icon={<CopyOutlined />}>{t("Copy")}</Button>}
                    >
                        {error ? (
                            <div role="alert"><p>{t("Conversion failed. Check the source format and mapping notes. Quote values that cannot be represented safely.")}</p><Text type="danger" dir="auto" style={{ whiteSpace: "pre-wrap" }}>{errorText}</Text></div>
                        ) : (
                            <TextArea
                                value={output}
                                aria-label={t("Conversion output")}
                                dir="ltr"
                                readOnly
                                autoSize={{ minRows: 16, maxRows: 28 }}
                                style={{ fontFamily: "var(--font-geist-mono)", fontSize: 16, direction: "ltr", textAlign: "left" }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
