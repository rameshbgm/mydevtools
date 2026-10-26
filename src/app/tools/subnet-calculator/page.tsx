"use client";

import React, { useState, useMemo } from "react";
import {
    Card,
    Input,
    Button,
    Typography,
    Row,
    Col,
    Space,
    Tag,
    Alert,
    Descriptions,
    Table,
    Select,
    Slider,
    InputNumber,
    Tooltip,
    Divider,
} from "antd";
import { copyToClipboard } from "@/lib/clipboard";
import {
    ClusterOutlined,
    CopyOutlined,
    CalculatorOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;
const { Option } = Select;

// ─── Types ───────────────────────────────────────────────────────────

interface SubnetInfo {
    isValid: boolean;
    networkAddress: string;
    broadcastAddress: string;
    firstHost: string;
    lastHost: string;
    subnetMask: string;
    wildcardMask: string;
    cidr: number;
    totalHosts: number;
    usableHosts: number;
    ipClass: string;
    binary: {
        network: string;
        broadcast: string;
        mask: string;
    };
}

// ─── Utils ───────────────────────────────────────────────────────────

function parseIPv4(ip: string): number[] | null {
    const parts = ip.split(".");
    if (parts.length !== 4) return null;

    const octets: number[] = [];
    for (const part of parts) {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 0 || num > 255 || part !== num.toString()) {
            return null;
        }
        octets.push(num);
    }
    return octets;
}

function ipToNumber(ip: string): number {
    const octets = parseIPv4(ip);
    if (!octets) return 0;
    return octets.reduce((acc, o, i) => acc + o * Math.pow(256, 3 - i), 0);
}

function numberToIP(num: number): string {
    return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
    ].join(".");
}

function cidrToMask(cidr: number): string {
    const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    return numberToIP(mask);
}

function maskToCidr(mask: string): number | null {
    const octets = parseIPv4(mask);
    if (!octets) return null;

    const binary = octets.map(o => o.toString(2).padStart(8, "0")).join("");
    if (!/^1*0*$/.test(binary)) return null;
    return binary.indexOf("0") === -1 ? 32 : binary.indexOf("0");
}

function ipToBinary(ip: string): string {
    const octets = parseIPv4(ip);
    if (!octets) return "";
    return octets.map(o => o.toString(2).padStart(8, "0")).join(".");
}

function getIPClass(ip: string): string {
    const octets = parseIPv4(ip);
    if (!octets) return "Unknown";

    const first = octets[0];
    if (first >= 0 && first <= 127) return "A";
    if (first >= 128 && first <= 191) return "B";
    if (first >= 192 && first <= 223) return "C";
    if (first >= 224 && first <= 239) return "D (Multicast)";
    return "E (Reserved)";
}

function calculateSubnet(ip: string, cidr: number): SubnetInfo {
    const octets = parseIPv4(ip);

    if (!octets || !Number.isInteger(cidr) || cidr < 0 || cidr > 32) {
        return {
            isValid: false,
            networkAddress: "",
            broadcastAddress: "",
            firstHost: "",
            lastHost: "",
            subnetMask: "",
            wildcardMask: "",
            cidr: 0,
            totalHosts: 0,
            usableHosts: 0,
            ipClass: "",
            binary: { network: "", broadcast: "", mask: "" },
        };
    }

    const ipNum = ipToNumber(ip);
    const maskNum = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const wildcardNum = ~maskNum >>> 0;

    const networkNum = (ipNum & maskNum) >>> 0;
    const broadcastNum = (networkNum | wildcardNum) >>> 0;

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2;

    const networkAddress = numberToIP(networkNum);
    const broadcastAddress = numberToIP(broadcastNum);
    const subnetMask = cidrToMask(cidr);
    const wildcardMask = numberToIP(wildcardNum);

    // First and last usable hosts
    let firstHost = numberToIP(networkNum + 1);
    let lastHost = numberToIP(broadcastNum - 1);

    if (cidr === 32) {
        firstHost = lastHost = networkAddress;
    } else if (cidr === 31) {
        firstHost = networkAddress;
        lastHost = broadcastAddress;
    }

    return {
        isValid: true,
        networkAddress,
        broadcastAddress,
        firstHost,
        lastHost,
        subnetMask,
        wildcardMask,
        cidr,
        totalHosts,
        usableHosts,
        ipClass: getIPClass(ip),
        binary: {
            network: ipToBinary(networkAddress),
            broadcast: ipToBinary(broadcastAddress),
            mask: ipToBinary(subnetMask),
        },
    };
}

// ─── Common Subnets ──────────────────────────────────────────────────

const COMMON_SUBNETS = [
    { cidr: 8, mask: "255.0.0.0", hosts: "16,777,214", description: "Class A" },
    { cidr: 16, mask: "255.255.0.0", hosts: "65,534", description: "Class B" },
    { cidr: 24, mask: "255.255.255.0", hosts: "254", description: "Class C" },
    { cidr: 25, mask: "255.255.255.128", hosts: "126", description: "Half C" },
    { cidr: 26, mask: "255.255.255.192", hosts: "62", description: "Quarter C" },
    { cidr: 27, mask: "255.255.255.224", hosts: "30", description: "1/8 C" },
    { cidr: 28, mask: "255.255.255.240", hosts: "14", description: "1/16 C" },
    { cidr: 29, mask: "255.255.255.248", hosts: "6", description: "1/32 C" },
    { cidr: 30, mask: "255.255.255.252", hosts: "2", description: "Point-to-Point" },
    { cidr: 31, mask: "255.255.255.254", hosts: "2", description: "Point-to-Point (RFC 3021)" },
    { cidr: 32, mask: "255.255.255.255", hosts: "1", description: "Host Route" },
];

// ─── Component ───────────────────────────────────────────────────────

export default function SubnetCalculatorPage() {
    const { t } = useLanguage();
    const [inputIP, setInputIP] = useState("192.168.1.0");
    const [cidr, setCidr] = useState(24);
    const [inputMask, setInputMask] = useState("255.255.255.0");
    const [inputMode, setInputMode] = useState<"cidr" | "mask">("cidr");

    const handleMaskChange = (mask: string) => {
        setInputMask(mask);
        const cidrValue = maskToCidr(mask);
        if (cidrValue !== null) {
            setCidr(cidrValue);
        }
    };

    const handleCidrChange = (value: number) => {
        setCidr(value);
        setInputMask(cidrToMask(value));
    };

    const subnetInfo = useMemo(() => calculateSubnet(inputIP, inputMode === "mask" ? (maskToCidr(inputMask) ?? -1) : cidr), [inputIP, cidr, inputMode, inputMask]);

    const handleCopy = (text: string) => copyToClipboard(text, t("Copied!"));

    const handleCopyAll = () => {
        if (!subnetInfo.isValid) return;

        const text = `IP Address: ${inputIP}/${cidr}
Network Address: ${subnetInfo.networkAddress}
Broadcast Address: ${subnetInfo.broadcastAddress}
Subnet Mask: ${subnetInfo.subnetMask}
Wildcard Mask: ${subnetInfo.wildcardMask}
First Host: ${subnetInfo.firstHost}
Last Host: ${subnetInfo.lastHost}
Total Hosts: ${subnetInfo.totalHosts.toLocaleString()}
Usable Hosts: ${subnetInfo.usableHosts.toLocaleString()}`;

        copyToClipboard(text, t("All subnet info copied!"));
    };

    const columns = [
        { title: "CIDR", dataIndex: "cidr", key: "cidr", render: (c: number) => <Text dir="ltr" code>/{c}</Text> },
        { title: t("Subnet Mask"), dataIndex: "mask", key: "mask", render: (m: string) => <Text dir="ltr" code>{m}</Text> },
        { title: t("Usable Hosts"), dataIndex: "hosts", key: "hosts" },
        { title: t("Description"), dataIndex: "description", key: "description" },
        {
            title: t("Action"),
            key: "action",
            render: (_: unknown, record: { cidr: number }) => (
                <Button size="small" onClick={() => handleCidrChange(record.cidr)}>{t("Use")}</Button>
            )
        },
    ];

    return (
        <ToolPageLayout
            title={t("Subnet Calculator")}
            description={t("Calculate subnet masks, network ranges, CIDR notation, and available hosts")}
            icon={<ClusterOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: t("Calculate IPv4 network boundaries, subnet masks, broadcast addresses and usable host ranges locally."),
                whyUse: t("Check IP allocation and firewall or router configuration without manual binary arithmetic."),
                howToUse: [t("Enter an IPv4 address."), t("Choose a CIDR prefix from /0 to /32 or enter a contiguous subnet mask."), t("Inspect the host range, binary values and common subnet table. Copy values for documentation.")],
                tips: [t("A /24 network has 254 usable host addresses. /31 point-to-point networks use both addresses; /32 identifies one host."), t("Wildcard masks invert subnet masks and are used in ACLs and OSPF.")],
                useCases: [t("Plan subnets for routers, cloud networks and local environments.")],
            }}
        >
            <Row gutter={[16, 16]}>
                {/* Input Section */}
                <Col xs={24} lg={10}>
                    <Card
                        title={
                            <Space>
                                <CalculatorOutlined />
                                <span>{t("Subnet Input")}</span>
                            </Space>
                        }
                        size="small"
                    >
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>{t("IP Address")}</Text>
                                <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                    size="large"
                                    placeholder={t("Enter IP address (e.g., 192.168.1.0)")}
                                    aria-label={t("IP Address")} value={inputIP}
                                    onChange={(e) => setInputIP(e.target.value)}
                                    prefix={<ClusterOutlined />}
                                />
                            </div>

                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                                    <Text strong>{t("Subnet")}</Text>
                                    <Select
                                        aria-label={t("Subnet input mode")} value={inputMode}
                                        onChange={setInputMode}
                                        size="small"
                                        style={{ width: "min(100%, 220px)", minWidth: 0 }}
                                        popupMatchSelectWidth={false}
                                    >
                                        <Option value="cidr">{t("CIDR Notation")}</Option>
                                        <Option value="mask">{t("Subnet Mask")}</Option>
                                    </Select>
                                </div>

                                {inputMode === "cidr" ? (
                                    <div>
                                        <Slider
                                            min={0}
                                            max={32}
                                            aria-label={t("CIDR prefix length")} value={cidr}
                                            onChange={handleCidrChange}
                                            marks={{
                                                0: "/0",
                                                8: "/8",
                                                16: "/16",
                                                24: "/24",
                                                32: "/32",
                                            }}
                                        />
                                        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                                            <Space.Compact>
                                                <Button disabled style={{ pointerEvents: "none" }}>/</Button>
                                                <InputNumber styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }} dir="ltr" aria-label={t("CIDR prefix length")}
                                                    min={0}
                                                    max={32}
                                                    value={cidr}
                                                    onChange={(v) => handleCidrChange(v ?? 24)}
                                                    style={{ width: 100, direction: "ltr", fontSize: 16 }}
                                                />
                                            </Space.Compact>
                                        </div>
                                    </div>
                                ) : (
                                    <Input dir="ltr" styles={{ input: { direction: "ltr", textAlign: "left", fontSize: 16 } }}
                                        size="large"
                                        placeholder="255.255.255.0"
                                        aria-label={t("Subnet Mask")} value={inputMask}
                                        onChange={(e) => handleMaskChange(e.target.value)}
                                    />
                                )}
                            </div>

                            {!subnetInfo.isValid && (
                                <Alert
                                    type="error"
                                    title={t("Invalid Input")}
                                    description={t("Please enter a valid IPv4 address and subnet.")}
                                />
                            )}
                        </Space>
                    </Card>

                    {/* Common Subnets Reference */}
                    <Card title={t("Common Subnet Sizes")} size="small" style={{ marginTop: 16 }}>
                        <Table
                            dataSource={COMMON_SUBNETS.map((row) => ({ ...row, description: t(row.description) }))}
                            columns={columns}
                            pagination={false}
                            size="small"
                            rowKey="cidr"
                            scroll={{ x: 460, y: 300 }}
                        />
                    </Card>
                </Col>

                {/* Results Section */}
                <Col xs={24} lg={14}>
                    {subnetInfo.isValid && (
                        <>
                            <Card
                                title={t("Subnet Information")}
                                size="small"
                                extra={
                                    <Button icon={<CopyOutlined />} onClick={handleCopyAll}>
                                        {t("Copy All")}</Button>
                                }
                            >
                                <Descriptions column={{ xs: 1, sm: 2 }} size="small" bordered>
                                    <Descriptions.Item label={t("IP Address")}>
                                        <Space>
                                            <Tag color="blue">{inputIP}/{cidr}</Tag>
                                            <Button aria-label={t("Copy")}
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(`${inputIP}/${cidr}`)}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("IP Class")}>
                                        <Tag color="purple">{t("Class {value}", { value: t(subnetInfo.ipClass) })}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("Network Address")}>
                                        <Space>
                                            <Text dir="ltr" code>{subnetInfo.networkAddress}</Text>
                                            <Button aria-label={t("Copy")}
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.networkAddress)}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("Broadcast Address")}>
                                        <Space>
                                            <Text dir="ltr" code>{subnetInfo.broadcastAddress}</Text>
                                            <Button aria-label={t("Copy")}
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.broadcastAddress)}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("Subnet Mask")}>
                                        <Space>
                                            <Text dir="ltr" code>{subnetInfo.subnetMask}</Text>
                                            <Button aria-label={t("Copy")}
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.subnetMask)}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("Wildcard Mask")}>
                                        <Space>
                                            <Text dir="ltr" code>{subnetInfo.wildcardMask}</Text>
                                            <Tooltip title={t("Used in ACLs and OSPF")}>
                                                <InfoCircleOutlined style={{ color: "var(--wb-accent)" }} />
                                            </Tooltip>
                                            <Button aria-label={t("Copy")}
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.wildcardMask)}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("First Usable Host")}>
                                        <Space>
                                            <Text dir="ltr" code>{subnetInfo.firstHost}</Text>
                                            <Button aria-label={t("Copy")}
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.firstHost)}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("Last Usable Host")}>
                                        <Space>
                                            <Text dir="ltr" code>{subnetInfo.lastHost}</Text>
                                            <Button aria-label={t("Copy")}
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.lastHost)}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("Total Addresses")}>
                                        <Tag color="geekblue">{subnetInfo.totalHosts.toLocaleString()}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("Usable Hosts")}>
                                        <Tag color="green">{subnetInfo.usableHosts.toLocaleString()}</Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            <Card title={t("Binary Representation")} size="small" style={{ marginTop: 16 }}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label={t("Network")}>
                                        <Text dir="ltr" code style={{ fontFamily: "monospace", fontSize: 16 }}>
                                            {subnetInfo.binary.network}
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("Subnet Mask")}>
                                        <Text dir="ltr" code style={{ fontFamily: "monospace", fontSize: 16 }}>
                                            {subnetInfo.binary.mask}
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t("Broadcast")}>
                                        <Text dir="ltr" code style={{ fontFamily: "monospace", fontSize: 16 }}>
                                            {subnetInfo.binary.broadcast}
                                        </Text>
                                    </Descriptions.Item>
                                </Descriptions>
                                <Divider style={{ margin: "12px 0" }} />
                                <Paragraph type="secondary" style={{ fontSize: 16, margin: 0 }}>
                                    {t("Network bits")}: <Tag color="blue">{cidr}</Tag> |
                                    {t("Host bits")}: <Tag color="green">{32 - cidr}</Tag>
                                </Paragraph>
                            </Card>
                        </>
                    )}
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
