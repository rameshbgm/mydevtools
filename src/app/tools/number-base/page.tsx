"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Button, Space } from "antd";
import { NumberOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;

export default function NumberBasePage() {
    const [decimal, setDecimal] = useState("255");

    const { num, isValid, conversions } = useMemo(() => {
        const n = parseInt(decimal);
        const valid = !isNaN(n);
        return {
            num: n,
            isValid: valid,
            conversions: valid ? [
                { label: "Decimal", value: n.toString(10) },
                { label: "Binary", value: n.toString(2) },
                { label: "Octal", value: n.toString(8) },
                { label: "Hexadecimal", value: n.toString(16).toUpperCase() },
            ] : [],
        };
    }, [decimal]);

    const copyAll = () => {
        copyToClipboard(conversions.map((c) => `${c.label}: ${c.value}`).join("\n"), "All bases copied!");
    };

    return (
        <ToolPageLayout
            title="Number Base Converter"
            description="Convert between decimal, binary, octal and hex"
            icon={<NumberOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: "A number base converter transforms numbers between different numeral systems: decimal (base 10), binary (base 2), octal (base 8), and hexadecimal (base 16). Each base uses different digits to represent values.",
                whyUse: "Different number bases are used in computing: binary for hardware, hex for memory addresses and colors, octal for Unix permissions. This tool helps programmers work with all formats.",
                howToUse: [
                    "Enter a decimal number in the input field",
                    "View instant conversions to binary, octal, and hex",
                    "Copy any converted value with one click",
                    "Results update as you type"
                ],
                tips: [
                    "Hex colors use format #RRGGBB (e.g., #FF5733)",
                    "Binary is fundamental for understanding bit operations",
                    "Octal 755 = rwxr-xr-x in Unix permissions",
                    "JavaScript uses 0x for hex, 0b for binary, 0o for octal"
                ],
                useCases: [
                    "Converting hex color codes to RGB values",
                    "Understanding Unix file permissions",
                    "Debugging binary data and bit flags",
                    "Working with memory addresses"
                ]
            }}
        >
            <Card size="small" title="Enter a decimal number" style={{ marginBottom: 16, maxWidth: 400 }}>
                <Input
                    size="large"
                    value={decimal}
                    onChange={(e) => setDecimal(e.target.value)}
                    placeholder="e.g. 255"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                />
            </Card>

            {isValid && (
                <>
                    <Space style={{ marginBottom: 12 }}>
                        <Button icon={<CopyOutlined />} onClick={copyAll}>Copy All Bases</Button>
                    </Space>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                        {conversions.map((c) => (
                            <Card
                                key={c.label}
                                size="small"
                                title={c.label}
                                extra={<Button size="small" type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard(c.value, `${c.label} copied!`)} />}
                            >
                                <Text code style={{ fontSize: 16 }}>{c.value}</Text>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </ToolPageLayout>
    );
}
