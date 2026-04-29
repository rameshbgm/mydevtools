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
import { messageService as message } from "@/lib/messageService";
import {
    ClusterOutlined,
    CopyOutlined,
    CalculatorOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
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

function maskToCidr(mask: string): number {
    const octets = parseIPv4(mask);
    if (!octets) return 0;

    const binary = octets.map(o => o.toString(2).padStart(8, "0")).join("");
    const match = binary.match(/^1*/);
    return match ? match[0].length : 0;
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

    if (!octets || cidr < 0 || cidr > 32) {
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
    const [inputIP, setInputIP] = useState("192.168.1.0");
    const [cidr, setCidr] = useState(24);
    const [inputMask, setInputMask] = useState("255.255.255.0");
    const [inputMode, setInputMode] = useState<"cidr" | "mask">("cidr");

    const handleMaskChange = (mask: string) => {
        setInputMask(mask);
        const cidrValue = maskToCidr(mask);
        if (cidrValue > 0) {
            setCidr(cidrValue);
        }
    };

    const handleCidrChange = (value: number) => {
        setCidr(value);
        setInputMask(cidrToMask(value));
    };

    const subnetInfo = useMemo(() => calculateSubnet(inputIP, cidr), [inputIP, cidr]);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copied!`);
    };

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

        navigator.clipboard.writeText(text);
        message.success("All subnet info copied!");
    };

    const columns = [
        { title: "CIDR", dataIndex: "cidr", key: "cidr", render: (c: number) => <Text code>/{c}</Text> },
        { title: "Subnet Mask", dataIndex: "mask", key: "mask", render: (m: string) => <Text code>{m}</Text> },
        { title: "Usable Hosts", dataIndex: "hosts", key: "hosts" },
        { title: "Description", dataIndex: "description", key: "description" },
        {
            title: "Action",
            key: "action",
            render: (_: unknown, record: { cidr: number }) => (
                <Button size="small" onClick={() => handleCidrChange(record.cidr)}>Use</Button>
            )
        },
    ];

    return (
        <ToolPageLayout
            title="Subnet Calculator"
            description="Calculate subnet masks, network ranges, CIDR notation, and available hosts"
            icon={<ClusterOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "The Subnet Calculator is a networking tool that helps you divide IP networks into smaller subnetworks (subnets). It calculates network boundaries, broadcast addresses, usable host ranges, and converts between CIDR notation and traditional subnet masks. Subnetting is fundamental to network design, security isolation, and efficient IP address allocation.",
                whyUse: "Network engineers and developers need to understand subnetting for configuring routers, firewalls, VPCs in cloud environments, and troubleshooting connectivity issues. This tool instantly shows you network ranges, helping you plan IP allocations, verify configurations, and understand network boundaries without manual binary calculations.",
                howToUse: [
                    "Enter an IP address from the network you want to analyze",
                    "Select the CIDR prefix length (e.g., /24) or enter a subnet mask",
                    "View the calculated network address, broadcast, and host range",
                    "Use the slider to quickly explore different subnet sizes",
                    "Copy individual values or all results for documentation",
                    "Reference the common subnets table for standard configurations"
                ],
                tips: [
                    "A /24 network (255.255.255.0) provides 254 usable addresses - perfect for small offices",
                    "Use /30 or /31 for point-to-point links between routers",
                    "The wildcard mask is the inverse of subnet mask - used in ACLs and OSPF",
                    "Private networks typically use 10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16",
                    "Cloud providers (AWS, Azure, GCP) reserve 5 IPs per subnet for internal use"
                ],
                useCases: [
                    "Planning VPC and subnet architecture in AWS/Azure/GCP",
                    "Configuring firewall rules and access control lists",
                    "Allocating IP ranges for different departments or environments",
                    "Troubleshooting network connectivity and routing issues",
                    "Studying for networking certifications (CCNA, CompTIA Network+)"
                ]
            }}
        >
            <Row gutter={[16, 16]}>
                {/* Input Section */}
                <Col xs={24} lg={10}>
                    <Card
                        title={
                            <Space>
                                <CalculatorOutlined />
                                <span>Subnet Input</span>
                            </Space>
                        }
                        size="small"
                    >
                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                            <div>
                                <Text strong style={{ display: "block", marginBottom: 8 }}>IP Address</Text>
                                <Input
                                    size="large"
                                    placeholder="Enter IP address (e.g., 192.168.1.0)"
                                    value={inputIP}
                                    onChange={(e) => setInputIP(e.target.value)}
                                    prefix={<ClusterOutlined />}
                                />
                            </div>

                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <Text strong>Subnet</Text>
                                    <Select
                                        value={inputMode}
                                        onChange={setInputMode}
                                        size="small"
                                        style={{ width: 140 }}
                                        popupMatchSelectWidth={false}
                                    >
                                        <Option value="cidr">CIDR Notation</Option>
                                        <Option value="mask">Subnet Mask</Option>
                                    </Select>
                                </div>

                                {inputMode === "cidr" ? (
                                    <div>
                                        <Slider
                                            min={0}
                                            max={32}
                                            value={cidr}
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
                                                <InputNumber
                                                    min={0}
                                                    max={32}
                                                    value={cidr}
                                                    onChange={(v) => handleCidrChange(v || 24)}
                                                    style={{ width: 80 }}
                                                />
                                            </Space.Compact>
                                        </div>
                                    </div>
                                ) : (
                                    <Input
                                        size="large"
                                        placeholder="255.255.255.0"
                                        value={inputMask}
                                        onChange={(e) => handleMaskChange(e.target.value)}
                                    />
                                )}
                            </div>

                            {!subnetInfo.isValid && (
                                <Alert
                                    type="error"
                                    message="Invalid Input"
                                    description="Please enter a valid IPv4 address and subnet."
                                />
                            )}
                        </Space>
                    </Card>

                    {/* Common Subnets Reference */}
                    <Card title="Common Subnet Sizes" size="small" style={{ marginTop: 16 }}>
                        <Table
                            dataSource={COMMON_SUBNETS}
                            columns={columns}
                            pagination={false}
                            size="small"
                            rowKey="cidr"
                            scroll={{ y: 300 }}
                        />
                    </Card>
                </Col>

                {/* Results Section */}
                <Col xs={24} lg={14}>
                    {subnetInfo.isValid && (
                        <>
                            <Card
                                title="Subnet Information"
                                size="small"
                                extra={
                                    <Button icon={<CopyOutlined />} onClick={handleCopyAll}>
                                        Copy All
                                    </Button>
                                }
                            >
                                <Descriptions column={{ xs: 1, sm: 2 }} size="small" bordered>
                                    <Descriptions.Item label="IP Address">
                                        <Space>
                                            <Tag color="blue">{inputIP}/{cidr}</Tag>
                                            <Button
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(`${inputIP}/${cidr}`, "CIDR")}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="IP Class">
                                        <Tag color="purple">Class {subnetInfo.ipClass}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Network Address">
                                        <Space>
                                            <Text code>{subnetInfo.networkAddress}</Text>
                                            <Button
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.networkAddress, "Network")}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Broadcast Address">
                                        <Space>
                                            <Text code>{subnetInfo.broadcastAddress}</Text>
                                            <Button
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.broadcastAddress, "Broadcast")}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Subnet Mask">
                                        <Space>
                                            <Text code>{subnetInfo.subnetMask}</Text>
                                            <Button
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.subnetMask, "Subnet mask")}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Wildcard Mask">
                                        <Space>
                                            <Text code>{subnetInfo.wildcardMask}</Text>
                                            <Tooltip title="Used in ACLs and OSPF">
                                                <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                            </Tooltip>
                                            <Button
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.wildcardMask, "Wildcard")}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="First Usable Host">
                                        <Space>
                                            <Text code>{subnetInfo.firstHost}</Text>
                                            <Button
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.firstHost, "First host")}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Last Usable Host">
                                        <Space>
                                            <Text code>{subnetInfo.lastHost}</Text>
                                            <Button
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => handleCopy(subnetInfo.lastHost, "Last host")}
                                            />
                                        </Space>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Total Addresses">
                                        <Tag color="geekblue">{subnetInfo.totalHosts.toLocaleString()}</Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Usable Hosts">
                                        <Tag color="green">{subnetInfo.usableHosts.toLocaleString()}</Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            <Card title="Binary Representation" size="small" style={{ marginTop: 16 }}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Network">
                                        <Text code style={{ fontFamily: "monospace", fontSize: 12 }}>
                                            {subnetInfo.binary.network}
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Subnet Mask">
                                        <Text code style={{ fontFamily: "monospace", fontSize: 12 }}>
                                            {subnetInfo.binary.mask}
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Broadcast">
                                        <Text code style={{ fontFamily: "monospace", fontSize: 12 }}>
                                            {subnetInfo.binary.broadcast}
                                        </Text>
                                    </Descriptions.Item>
                                </Descriptions>
                                <Divider style={{ margin: "12px 0" }} />
                                <Paragraph type="secondary" style={{ fontSize: 12, margin: 0 }}>
                                    Network bits: <Tag color="blue">{cidr}</Tag> |
                                    Host bits: <Tag color="green">{32 - cidr}</Tag>
                                </Paragraph>
                            </Card>
                        </>
                    )}
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
