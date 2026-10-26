"use client";

import { useLanguage } from "@/components/LanguageProvider";
import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
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
    Tabs,
    Divider,
    InputNumber,
    Select,
    Statistic,
    Table,
} from "antd";
import { messageService as message } from "@/lib/messageService";
import {
    WifiOutlined,
    CopyOutlined,
    SwapOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    GlobalOutlined,
    CalculatorOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text } = Typography;

// ─── Types ───────────────────────────────────────────────────────────

interface IPInfo {
    version: "IPv4" | "IPv6" | null;
    isValid: boolean;
    isPrivate: boolean;
    isLoopback: boolean;
    isMulticast: boolean;
    isReserved: boolean;
    isLinkLocal: boolean;
    isDocumentation: boolean;
    isBroadcast: boolean;
    isAnycast: boolean;
    binary: string;
    decimal: string;
    hexadecimal: string;
    ipClass?: string;
    networkType: string;
    reversePtr?: string;
    compressed?: string;
    expanded?: string;
    scope?: string;
}

interface SubnetInfo {
    networkAddress: string;
    broadcastAddress: string;
    firstHost: string;
    lastHost: string;
    totalHosts: number;
    usableHosts: number;
    subnetMask: string;
    wildcardMask: string;
    cidr: number;
}

// ─── Sample Data ─────────────────────────────────────────────────────

const SAMPLE_IPS = [
    { ip: "192.168.1.1", desc: "Private (RFC 1918)" },
    { ip: "10.0.0.1", desc: "Private Class A" },
    { ip: "172.16.0.1", desc: "Private Class B" },
    { ip: "127.0.0.1", desc: "Loopback" },
    { ip: "8.8.8.8", desc: "Google DNS" },
    { ip: "1.1.1.1", desc: "Cloudflare DNS" },
    { ip: "224.0.0.1", desc: "Multicast" },
    { ip: "169.254.1.1", desc: "Link-Local (APIPA)" },
    { ip: "::1", desc: "IPv6 Loopback" },
    { ip: "fe80::1", desc: "IPv6 Link-Local" },
    { ip: "2001:4860:4860::8888", desc: "Google DNS IPv6" },
    { ip: "2606:4700:4700::1111", desc: "Cloudflare IPv6" },
];

const COMMON_SUBNETS = [
    { cidr: "/8", mask: "255.0.0.0", hosts: "16,777,214" },
    { cidr: "/16", mask: "255.255.0.0", hosts: "65,534" },
    { cidr: "/24", mask: "255.255.255.0", hosts: "254" },
    { cidr: "/25", mask: "255.255.255.128", hosts: "126" },
    { cidr: "/26", mask: "255.255.255.192", hosts: "62" },
    { cidr: "/27", mask: "255.255.255.224", hosts: "30" },
    { cidr: "/28", mask: "255.255.255.240", hosts: "14" },
    { cidr: "/29", mask: "255.255.255.248", hosts: "6" },
    { cidr: "/30", mask: "255.255.255.252", hosts: "2" },
    { cidr: "/32", mask: "255.255.255.255", hosts: "1" },
];

// ─── IPv4 Utils ───────────────────────────────────────────────────────

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

function getIPv4Class(octets: number[]): string {
    const first = octets[0];
    if (first >= 0 && first <= 127) return "A";
    if (first >= 128 && first <= 191) return "B";
    if (first >= 192 && first <= 223) return "C";
    if (first >= 224 && first <= 239) return "D (Multicast)";
    return "E (Experimental)";
}

function isPrivateIPv4(octets: number[]): boolean {
    const [a, b] = octets;
    return (
        a === 10 ||
        (a === 172 && b >= 16 && b <= 31) ||
        (a === 192 && b === 168)
    );
}

function isLoopbackIPv4(octets: number[]): boolean {
    return octets[0] === 127;
}

function isMulticastIPv4(octets: number[]): boolean {
    return octets[0] >= 224 && octets[0] <= 239;
}

function isLinkLocalIPv4(octets: number[]): boolean {
    return octets[0] === 169 && octets[1] === 254;
}

function isDocumentationIPv4(octets: number[]): boolean {
    const [a, b, c] = octets;
    return (
        (a === 192 && b === 0 && c === 2) ||
        (a === 198 && b === 51 && c === 100) ||
        (a === 203 && b === 0 && c === 113)
    );
}

function isBroadcastIPv4(octets: number[]): boolean {
    return octets.every(o => o === 255);
}

function isReservedIPv4(octets: number[]): boolean {
    const [a, b, c] = octets;
    return (
        a === 0 ||
        (a === 100 && b >= 64 && b <= 127) ||
        (a === 192 && b === 0 && c === 0) ||
        (a === 192 && b === 88 && c === 99) ||
        a >= 240
    );
}

// ─── IPv6 Utils ───────────────────────────────────────────────────────

function parseIPv6(ip: string): number[] | null {
    const zoneParts = ip.split("%");
    if (zoneParts.length > 2 || (zoneParts.length === 2 && !/^[A-Za-z0-9_.~-]+$/.test(zoneParts[1]))) return null;
    let cleanIP = zoneParts[0];
    if (cleanIP.includes(".")) {
        const lastColon = cleanIP.lastIndexOf(":");
        if (lastColon < 0) return null;
        const octets = parseIPv4(cleanIP.slice(lastColon + 1));
        if (!octets) return null;
        cleanIP = cleanIP.slice(0, lastColon + 1) + ((octets[0] << 8) | octets[1]).toString(16) + ":" + ((octets[2] << 8) | octets[3]).toString(16);
    }
    const halves = cleanIP.split("::");
    if (halves.length > 2) return null;
    const left = halves[0] ? halves[0].split(":") : [];
    const right = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
    if (![...left, ...right].every(group => /^[0-9a-fA-F]{1,4}$/.test(group))) return null;
    if (halves.length === 1) return left.length === 8 ? left.map(group => parseInt(group, 16)) : null;
    const missing = 8 - left.length - right.length;
    if (missing < 1) return null;
    return [...left.map(group => parseInt(group, 16)), ...Array(missing).fill(0), ...right.map(group => parseInt(group, 16))];
}

function compressIPv6(groups: number[]): string {
    const hexGroups = groups.map(g => g.toString(16));

    let longestStart = -1;
    let longestLen = 0;
    let currentStart = -1;
    let currentLen = 0;

    for (let i = 0; i < 8; i++) {
        if (groups[i] === 0) {
            if (currentStart === -1) currentStart = i;
            currentLen++;
            if (currentLen > longestLen) {
                longestStart = currentStart;
                longestLen = currentLen;
            }
        } else {
            currentStart = -1;
            currentLen = 0;
        }
    }

    if (longestLen > 1) {
        const left = hexGroups.slice(0, longestStart).join(":");
        const right = hexGroups.slice(longestStart + longestLen).join(":");
        if (longestStart === 0 && longestLen === 8) return "::";
        if (longestStart === 0) return "::" + right;
        if (longestStart + longestLen === 8) return left + "::";
        return left + "::" + right;
    }

    return hexGroups.join(":");
}

function expandIPv6(groups: number[]): string {
    return groups.map(g => g.toString(16).padStart(4, "0")).join(":");
}

function getIPv6Scope(groups: number[]): string {
    const first = groups[0];

    if (groups.every(g => g === 0)) return "Unspecified";
    if (groups.every((g, i) => i === 7 ? g === 1 : g === 0)) return "Loopback";
    if ((first & 0xffc0) === 0xfe80) return "Link-Local";
    if ((first & 0xffc0) === 0xfec0) return "Site-Local (Deprecated)";
    if ((first >> 8) === 0xff) {
        const scope = first & 0xf;
        const scopes: Record<number, string> = {
            0x1: "Interface-Local",
            0x2: "Link-Local",
            0x4: "Admin-Local",
            0x5: "Site-Local",
            0x8: "Organization-Local",
            0xe: "Global",
        };
        return `Multicast (${scopes[scope] || "Unknown"})`;
    }
    if ((first & 0xfe00) === 0xfc00) return "Unique Local";
    if ((first & 0xe000) === 0x2000) return "Global Unicast";

    return "Unknown";
}

// ─── Analysis ─────────────────────────────────────────────────────────

function analyzeIP(input: string): IPInfo {
    const trimmed = input.trim();

    if (!trimmed) {
        return {
            version: null,
            isValid: false,
            isPrivate: false,
            isLoopback: false,
            isMulticast: false,
            isReserved: false,
            isLinkLocal: false,
            isDocumentation: false,
            isBroadcast: false,
            isAnycast: false,
            binary: "",
            decimal: "",
            hexadecimal: "",
            networkType: "Enter an IP address",
        };
    }

    const ipv4Octets = parseIPv4(trimmed);
    if (ipv4Octets) {
        const binary = ipv4Octets.map(o => o.toString(2).padStart(8, "0")).join(".");
        const decimal = ipv4Octets.reduce((acc, o, i) => acc + o * Math.pow(256, 3 - i), 0).toString();
        const hex = ipv4Octets.map(o => o.toString(16).padStart(2, "0")).join(":");

        const isPrivate = isPrivateIPv4(ipv4Octets);
        const isLoopback = isLoopbackIPv4(ipv4Octets);
        const isMulticast = isMulticastIPv4(ipv4Octets);
        const isLinkLocal = isLinkLocalIPv4(ipv4Octets);
        const isDocumentation = isDocumentationIPv4(ipv4Octets);
        const isBroadcast = isBroadcastIPv4(ipv4Octets);
        const isReserved = isReservedIPv4(ipv4Octets);

        let networkType = "Public/Global";
        if (isBroadcast) networkType = "Broadcast";
        else if (isLoopback) networkType = "Loopback";
        else if (isPrivate) networkType = "Private (RFC 1918)";
        else if (isMulticast) networkType = "Multicast";
        else if (isLinkLocal) networkType = "Link-Local (APIPA)";
        else if (isDocumentation) networkType = "Documentation";
        else if (isReserved) networkType = "Reserved";

        return {
            version: "IPv4",
            isValid: true,
            isPrivate,
            isLoopback,
            isMulticast,
            isReserved,
            isLinkLocal,
            isDocumentation,
            isBroadcast,
            isAnycast: false,
            binary,
            decimal,
            hexadecimal: hex,
            ipClass: getIPv4Class(ipv4Octets),
            networkType,
            reversePtr: `${[...ipv4Octets].reverse().join(".")}.in-addr.arpa`,
        };
    }

    const ipv6Groups = parseIPv6(trimmed);
    if (ipv6Groups) {
        const binary = ipv6Groups.map(g => g.toString(2).padStart(16, "0")).join(":");
        const hex = expandIPv6(ipv6Groups);
        const compressed = compressIPv6(ipv6Groups);

        const isLoopback = ipv6Groups.every((g, i) => i === 7 ? g === 1 : g === 0);
        const isLinkLocal = (ipv6Groups[0] & 0xffc0) === 0xfe80;
        const isMulticast = (ipv6Groups[0] >> 8) === 0xff;
        const isPrivate = (ipv6Groups[0] & 0xfe00) === 0xfc00;
        const isDocumentation = ipv6Groups[0] === 0x2001 && ipv6Groups[1] === 0x0db8;
        const isAnycast = false; // Assignment to multiple interfaces cannot be inferred from syntax.

        const scope = getIPv6Scope(ipv6Groups);
        let networkType = scope;
        if (isDocumentation) networkType = "Documentation";

        const reverseNibbles = hex.replace(/:/g, "").split("").reverse().join(".");

        return {
            version: "IPv6",
            isValid: true,
            isPrivate,
            isLoopback,
            isMulticast,
            isReserved: ipv6Groups.every(g => g === 0) || (ipv6Groups[0] & 0xffc0) === 0xfec0,
            isLinkLocal,
            isDocumentation,
            isBroadcast: false,
            isAnycast,
            binary,
            decimal: "N/A (128-bit)",
            hexadecimal: hex,
            networkType,
            reversePtr: `${reverseNibbles}.ip6.arpa`,
            compressed,
            expanded: hex,
            scope,
        };
    }

    return {
        version: null,
        isValid: false,
        isPrivate: false,
        isLoopback: false,
        isMulticast: false,
        isReserved: false,
        isLinkLocal: false,
        isDocumentation: false,
        isBroadcast: false,
        isAnycast: false,
        binary: "",
        decimal: "",
        hexadecimal: "",
        networkType: "Invalid",
    };
}

// ─── Subnet Calculator ────────────────────────────────────────────────

function calculateIPv4Subnet(ip: string, cidr: number): SubnetInfo | null {
    const octets = parseIPv4(ip);
    if (!octets || !Number.isInteger(cidr) || cidr < 0 || cidr > 32) return null;

    const ipNum = octets.reduce((acc, o, i) => acc + (o << (24 - i * 8)), 0) >>> 0;
    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcard = ~mask >>> 0;

    const networkNum = (ipNum & mask) >>> 0;
    const broadcastNum = (networkNum | wildcard) >>> 0;

    const numToIP = (n: number): string => {
        return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    };

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? totalHosts : totalHosts - 2;

    return {
        networkAddress: numToIP(networkNum),
        broadcastAddress: numToIP(broadcastNum),
        firstHost: cidr >= 31 ? numToIP(networkNum) : numToIP(networkNum + 1),
        lastHost: cidr >= 31 ? numToIP(broadcastNum) : numToIP(broadcastNum - 1),
        totalHosts,
        usableHosts: Math.max(0, usableHosts),
        subnetMask: numToIP(mask),
        wildcardMask: numToIP(wildcard),
        cidr,
    };
}

function calculateIPv6Subnet(ip: string, prefix: number): { network: string; range: string } | null {
    const groups = parseIPv6(ip);
    if (!groups || !Number.isInteger(prefix) || prefix < 0 || prefix > 128) return null;

    const networkGroups = [...groups];
    const fullGroups = Math.floor(prefix / 16);
    const remainingBits = prefix % 16;

    for (let i = fullGroups; i < 8; i++) {
        if (i === fullGroups && remainingBits > 0) {
            const mask = (~0 << (16 - remainingBits)) & 0xFFFF;
            networkGroups[i] = networkGroups[i] & mask;
        } else {
            networkGroups[i] = 0;
        }
    }

    const network = compressIPv6(networkGroups) + "/" + prefix;
    const totalAddresses = prefix >= 64 ? `2^${128 - prefix}` : `2^${128 - prefix}`;

    return {
        network,
        range: totalAddresses + " addresses",
    };
}

// ─── Conversion Utils ─────────────────────────────────────────────────

function ipv4ToIPv6(ip: string): string | null {
    const octets = parseIPv4(ip);
    if (!octets) return null;

    const hex1 = ((octets[0] << 8) + octets[1]).toString(16);
    const hex2 = ((octets[2] << 8) + octets[3]).toString(16);

    return `::ffff:${hex1}:${hex2}`;
}

function binaryToIPv4(binary: string): string {
    const clean = binary.replace(/[\.\s]/g, "");
    if (clean.length !== 32 || !/^[01]+$/.test(clean)) return "";

    const octets = [];
    for (let i = 0; i < 4; i++) {
        octets.push(parseInt(clean.substring(i * 8, (i + 1) * 8), 2));
    }
    return octets.join(".");
}

function decimalToIPv4(decimal: string): string {
    if (!/^\d+$/.test(decimal.trim())) return "";
    const num = Number(decimal.trim());
    if (!Number.isSafeInteger(num) || num < 0 || num > 4294967295) return "";

    return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255,
    ].join(".");
}

function hexToIPv4(hex: string): string {
    const clean = hex.replace(/[:\s]/g, "").toLowerCase();
    if (clean.length !== 8 || !/^[0-9a-f]+$/.test(clean)) return "";

    const num = parseInt(clean, 16);
    return decimalToIPv4(num.toString());
}

// ─── Random IP Generation ─────────────────────────────────────────────

function generateRandomIPv4(type: "public" | "private" | "any"): string {
    const random = () => Math.floor(Math.random() * 256);

    if (type === "private") {
        const choice = Math.floor(Math.random() * 3);
        if (choice === 0) return `10.${random()}.${random()}.${random()}`;
        if (choice === 1) return `172.${16 + Math.floor(Math.random() * 16)}.${random()}.${random()}`;
        return `192.168.${random()}.${random()}`;
    }

    if (type === "public") {
        let ip;
        do {
            ip = [random(), random(), random(), random()];
        } while (
            ip[0] === 10 ||
            ip[0] === 127 ||
            (ip[0] === 172 && ip[1] >= 16 && ip[1] <= 31) ||
            (ip[0] === 192 && ip[1] === 168) ||
            ip[0] >= 224 || isReservedIPv4(ip) || isDocumentationIPv4(ip) || isLinkLocalIPv4(ip)
        );
        return ip.join(".");
    }

    return [random(), random(), random(), random()].join(".");
}

function generateRandomIPv6(type: "global" | "linklocal" | "unique"): string {
    const randomHex = () => Math.floor(Math.random() * 65536).toString(16);

    if (type === "linklocal") {
        return `fe80::${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}`;
    }

    if (type === "unique") {
        return `fd${randomHex().substring(0, 2)}:${randomHex()}:${randomHex()}::${randomHex()}`;
    }

    const first = (0x2000 + Math.floor(Math.random() * 0x2000)).toString(16);
    return `${first}:${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}`;
}

// ─── Component ───────────────────────────────────────────────────────

export default function IPAddressToolsPage() {
    const { t } = useLanguage();
    const tCurrent = useRef(t);
    useEffect(() => { tCurrent.current = t; }, [t]);
    const [inputIP, setInputIP] = useState("");
    const [cidr, setCidr] = useState(24);
    const [ipv6Prefix, setIpv6Prefix] = useState(64);
    const [conversionInput, setConversionInput] = useState("");
    const [conversionType, setConversionType] = useState<"binary" | "decimal" | "hex">("binary");

    const localizeType = (value: string) => value.startsWith("Multicast (")
        ? t("Multicast ({scope})", { scope: t(value.slice(11, -1)) }) : t(value);
    const ipInfo = useMemo(() => analyzeIP(inputIP), [inputIP]);

    const subnetInfo = useMemo(() => {
        if (ipInfo.version === "IPv4") return calculateIPv4Subnet(inputIP, cidr);
        return null;
    }, [inputIP, cidr, ipInfo.version]);

    const ipv6SubnetInfo = useMemo(() => {
        if (ipInfo.version === "IPv6") return calculateIPv6Subnet(inputIP, ipv6Prefix);
        return null;
    }, [inputIP, ipv6Prefix, ipInfo.version]);

    const handleCopy = (text: string) => copyToClipboard(text);

    const handleConvert = useCallback(() => {
        let result = "";
        if (conversionType === "binary") {
            result = binaryToIPv4(conversionInput);
        } else if (conversionType === "decimal") {
            result = decimalToIPv4(conversionInput);
        } else if (conversionType === "hex") {
            result = hexToIPv4(conversionInput);
        }

        if (result) {
            setInputIP(result);
            message.success(tCurrent.current("Converted successfully!"));
        } else {
            message.error(tCurrent.current("Invalid input format"));
        }
    }, [conversionInput, conversionType]);

    const handleGenerateRandom = (version: "ipv4" | "ipv6", type: string) => {
        if (version === "ipv4") {
            setInputIP(generateRandomIPv4(type as "public" | "private" | "any"));
        } else {
            setInputIP(generateRandomIPv6(type as "global" | "linklocal" | "unique"));
        }
    };

    const getStatusColor = () => {
        if (!inputIP) return undefined;
        return ipInfo.isValid ? "success" : "error";
    };

    const sampleColumns = [
        { title: t("IP Address"), dataIndex: "ip", key: "ip", render: (ip: string) => <Text code style={{ fontSize: 11 }}>{ip}</Text> },
        { title: t("Type"), dataIndex: "desc", key: "desc", render: (desc: string) => <Text style={{ fontSize: 11 }}>{t(desc)}</Text> },
        {
            title: "",
            key: "action",
            width: 50,
            render: (_: unknown, record: { ip: string }) => (
                <Button size="small" type="link" onClick={() => setInputIP(record.ip)}>{t("Use")}</Button>
            )
        },
    ];

    const subnetColumns = [
        { title: t("CIDR"), dataIndex: "cidr", key: "cidr" },
        { title: t("Subnet Mask"), dataIndex: "mask", key: "mask" },
        { title: t("Hosts"), dataIndex: "hosts", key: "hosts" },
    ];

    return (
        <ToolPageLayout
            title={t("IP Address Tools")}
            description={t("Comprehensive IPv4/IPv6 analyzer, converter, and subnet calculator")}
            icon={<GlobalOutlined style={{ fontSize: 24, color: "var(--wb-accent)" }} />}
            color="#1890ff"
            learnMore={{
                whatIs: t("Inspect IPv4 and IPv6 addresses, representations and subnet ranges locally."),
                whyUse: t("Use the analyzer, subnet calculator or conversion tab; choose a sample to begin."),
                howToUse: [t("Enter an address, select an integer prefix length, then inspect or copy the result.")],
                tips: [t("Classification lists selected special-use ranges; it does not prove routability or whether an address is assigned."), t("Anycast cannot be identified from an address alone.")],
            }}
        >
            <Tabs
                defaultActiveKey="analyze"
                items={[
                    {
                        key: "analyze",
                        label: <span><SearchOutlined /> {t("Analyze")}</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={16}>
                                    <Card size="small">
                                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                            <Input
                                                size="large"
                                                placeholder={t("Enter IPv4 (e.g., 192.168.1.1) or IPv6 (e.g., 2001:db8::1)")}
                                                value={inputIP}
                                                onChange={(e) => setInputIP(e.target.value)}
                                                prefix={<WifiOutlined />}
                                                allowClear
                                                status={getStatusColor()}
                                                suffix={
                                                    inputIP && (
                                                        ipInfo.isValid ? (
                                                            <CheckCircleOutlined style={{ color: "#52c41a" }} />
                                                        ) : (
                                                            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                                                        )
                                                    )
                                                } dir="ltr" aria-label={t("IP address")}
                                            />

                                            <Space wrap>
                                                <Text type="secondary">{t("Generate:")}</Text>
                                                <Button size="small" onClick={() => handleGenerateRandom("ipv4", "public")}>
                                                    {t("Public IPv4")}
                                                </Button>
                                                <Button size="small" onClick={() => handleGenerateRandom("ipv4", "private")}>
                                                    {t("Private IPv4")}
                                                </Button>
                                                <Button size="small" onClick={() => handleGenerateRandom("ipv6", "global")}>
                                                    {t("Global IPv6")}
                                                </Button>
                                                <Button size="small" onClick={() => handleGenerateRandom("ipv6", "linklocal")}>
                                                    {t("Link-Local IPv6")}
                                                </Button>
                                            </Space>
                                        </Space>
                                    </Card>

                                    {ipInfo.isValid && (
                                        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                                            <Col xs={24} md={12}>
                                                <Card title={t("Address Information")} size="small">
                                                    <Descriptions column={1} size="small">
                                                        <Descriptions.Item label={t("Version")}>
                                                            <Tag color="blue">{ipInfo.version}</Tag>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={t("Network Type")}>
                                                            <Tag color={ipInfo.isPrivate || ipInfo.isLoopback ? "orange" : "cyan"}>
                                                                {localizeType(ipInfo.networkType)}
                                                            </Tag>
                                                        </Descriptions.Item>
                                                        {ipInfo.ipClass && (
                                                            <Descriptions.Item label={t("IP Class")}>
                                                                <Tag color="purple">{t("Class")} {localizeType(ipInfo.ipClass)}</Tag>
                                                            </Descriptions.Item>
                                                        )}
                                                        {ipInfo.scope && (
                                                            <Descriptions.Item label={t("Scope")}>
                                                                <Tag color="geekblue">{localizeType(ipInfo.scope)}</Tag>
                                                            </Descriptions.Item>
                                                        )}
                                                        <Descriptions.Item label={t("Properties")}>
                                                            <Space wrap size={[4, 4]}>
                                                                {ipInfo.isPrivate && <Tag color="orange">{t("Private")}</Tag>}
                                                                {ipInfo.isLoopback && <Tag color="cyan">{t("Loopback")}</Tag>}
                                                                {ipInfo.isMulticast && <Tag color="magenta">{t("Multicast")}</Tag>}
                                                                {ipInfo.isLinkLocal && <Tag color="gold">{t("Link-Local")}</Tag>}
                                                                {ipInfo.isBroadcast && <Tag color="red">{t("Broadcast")}</Tag>}
                                                                {ipInfo.isDocumentation && <Tag color="purple">{t("Documentation")}</Tag>}
                                                                {ipInfo.isAnycast && <Tag color="volcano">{t("Anycast")}</Tag>}
                                                                {ipInfo.isReserved && <Tag color="red">{t("Reserved")}</Tag>}
                                                                {!ipInfo.isPrivate && !ipInfo.isLoopback && !ipInfo.isMulticast &&
                                                                    !ipInfo.isLinkLocal && !ipInfo.isReserved && !ipInfo.isBroadcast &&
                                                                    !ipInfo.isDocumentation && (
                                                                        <Tag color="green">{t("No listed special-use flag")}</Tag>
                                                                    )}
                                                            </Space>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Card title={t("Representations")} size="small">
                                                    <Space orientation="vertical" style={{ width: "100%" }} size="small">
                                                        {ipInfo.version === "IPv6" && ipInfo.compressed && (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Text type="secondary">{t("Compressed:")}</Text>
                                                                <Space>
                                                                    <Text code>{ipInfo.compressed}</Text>
                                                                    <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.compressed!)} />
                                                                </Space>
                                                            </div>
                                                        )}
                                                        {ipInfo.version === "IPv6" && ipInfo.expanded && (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Text type="secondary">{t("Expanded:")}</Text>
                                                                <Space>
                                                                    <Text code style={{ fontSize: 11 }}>{ipInfo.expanded}</Text>
                                                                    <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.expanded!)} />
                                                                </Space>
                                                            </div>
                                                        )}
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Text type="secondary">{t("Hexadecimal:")}</Text>
                                                            <Space>
                                                                <Text code style={{ fontSize: 11 }}>{ipInfo.hexadecimal}</Text>
                                                                <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.hexadecimal)} />
                                                            </Space>
                                                        </div>
                                                        {ipInfo.version === "IPv4" && (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Text type="secondary">{t("Decimal:")}</Text>
                                                                <Space>
                                                                    <Text code>{ipInfo.decimal}</Text>
                                                                    <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.decimal)} />
                                                                </Space>
                                                            </div>
                                                        )}
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                                                            <Text type="secondary">{t("Binary:")}</Text>
                                                            <Space>
                                                                <Text code style={{ fontSize: 10, wordBreak: "break-all" }}>{ipInfo.binary}</Text>
                                                                <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.binary)} />
                                                            </Space>
                                                        </div>
                                                        {ipInfo.reversePtr && (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                                                                <Text type="secondary">{t("Reverse PTR:")}</Text>
                                                                <Space>
                                                                    <Text code style={{ fontSize: 10, wordBreak: "break-all" }}>{ipInfo.reversePtr}</Text>
                                                                    <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.reversePtr!)} />
                                                                </Space>
                                                            </div>
                                                        )}
                                                        {ipInfo.version === "IPv4" && (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Text type="secondary">{t("IPv6 Mapped:")}</Text>
                                                                <Space>
                                                                    <Text code>{ipv4ToIPv6(inputIP)}</Text>
                                                                    <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipv4ToIPv6(inputIP)!)} />
                                                                </Space>
                                                            </div>
                                                        )}
                                                    </Space>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}

                                    {!ipInfo.isValid && inputIP && (
                                        <Alert
                                            style={{ marginTop: 16 }}
                                            type="error"
                                            title={t("Invalid IP Address")}
                                            description={t("Enter a valid IPv4 (e.g., 192.168.1.1) or IPv6 (e.g., 2001:db8::1) address")}
                                            showIcon
                                        />
                                    )}
                                </Col>

                                <Col xs={24} lg={8}>
                                    <Card title={t("Example IP Addresses")} size="small">
                                        <Table
                                            dataSource={SAMPLE_IPS}
                                            columns={sampleColumns}
                                            pagination={false}
                                            size="small"
                                            rowKey="ip"
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },
                    {
                        key: "subnet",
                        label: <span><CalculatorOutlined /> {t("Subnet Calculator")}</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={16}>
                                    <Card size="small">
                                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                            <Row gutter={16} align="middle">
                                                <Col flex="auto">
                                                    <Input
                                                        size="large"
                                                        placeholder={t("Enter IP address")}
                                                        value={inputIP}
                                                        onChange={(e) => setInputIP(e.target.value)}
                                                        prefix={<WifiOutlined />} dir="ltr" aria-label={t("Subnet address")}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Text strong>/</Text>
                                                </Col>
                                                <Col>
                                                    {ipInfo.version === "IPv6" ? (
                                                        <InputNumber
                                                            min={0}
                                                            max={128}
                                                            value={ipv6Prefix}
                                                            onChange={(v) => setIpv6Prefix(v ?? 64)}
                                                            style={{ width: 80 }} dir="ltr" aria-label={t("IPv6 prefix length")}
                                                        />
                                                    ) : (
                                                        <InputNumber
                                                            min={0}
                                                            max={32}
                                                            value={cidr}
                                                            onChange={(v) => setCidr(v ?? 24)}
                                                            style={{ width: 80 }} dir="ltr" aria-label={t("IPv4 prefix length")}
                                                        />
                                                    )}
                                                </Col>
                                            </Row>

                                            {ipInfo.version === "IPv4" && (
                                                <Space wrap>
                                                    <Text type="secondary">{t("Quick select:")}</Text>
                                                    {[8, 16, 24, 25, 26, 27, 28, 29, 30, 32].map(c => (
                                                        <Button
                                                            key={c}
                                                            size="small"
                                                            type={cidr === c ? "primary" : "default"}
                                                            onClick={() => setCidr(c)}
                                                        >
                                                            /{c}
                                                        </Button>
                                                    ))}
                                                </Space>
                                            )}

                                            {ipInfo.version === "IPv6" && (
                                                <Space wrap>
                                                    <Text type="secondary">{t("Quick select:")}</Text>
                                                    {[48, 56, 64, 112, 128].map(p => (
                                                        <Button
                                                            key={p}
                                                            size="small"
                                                            type={ipv6Prefix === p ? "primary" : "default"}
                                                            onClick={() => setIpv6Prefix(p)}
                                                        >
                                                            /{p}
                                                        </Button>
                                                    ))}
                                                </Space>
                                            )}
                                        </Space>
                                    </Card>

                                    {subnetInfo && ipInfo.version === "IPv4" && (
                                        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                                            <Col xs={24} md={12}>
                                                <Card title={t("Subnet Details")} size="small">
                                                    <Descriptions column={1} size="small">
                                                        <Descriptions.Item label={t("Network Address")}>
                                                            <Space>
                                                                <Text code>{subnetInfo.networkAddress}</Text>
                                                                <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(subnetInfo.networkAddress)} />
                                                            </Space>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={t("Broadcast Address")}>
                                                            <Space>
                                                                <Text code>{subnetInfo.broadcastAddress}</Text>
                                                                <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(subnetInfo.broadcastAddress)} />
                                                            </Space>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={t("Subnet Mask")}>
                                                            <Space>
                                                                <Text code>{subnetInfo.subnetMask}</Text>
                                                                <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(subnetInfo.subnetMask)} />
                                                            </Space>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={t("Wildcard Mask")}>
                                                            <Space>
                                                                <Text code>{subnetInfo.wildcardMask}</Text>
                                                                <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(subnetInfo.wildcardMask)} />
                                                            </Space>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Card title={t("Host Range")} size="small">
                                                    <Descriptions column={1} size="small">
                                                        <Descriptions.Item label={t("First Usable Host")}>
                                                            <Text code>{subnetInfo.firstHost}</Text>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label={t("Last Usable Host")}>
                                                            <Text code>{subnetInfo.lastHost}</Text>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                    <Divider style={{ margin: "12px 0" }} />
                                                    <Row gutter={16}>
                                                        <Col span={12}>
                                                            <Statistic
                                                                title={t("Total Addresses")}
                                                                value={subnetInfo.totalHosts.toLocaleString()}
                                                                styles={{ content: { fontSize: 18 } }}
                                                            />
                                                        </Col>
                                                        <Col span={12}>
                                                            <Statistic
                                                                title={t("Usable Hosts")}
                                                                value={subnetInfo.usableHosts.toLocaleString()}
                                                                styles={{ content: { fontSize: 18, color: "#52c41a" } }}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}

                                    {ipv6SubnetInfo && ipInfo.version === "IPv6" && (
                                        <Card title={t("IPv6 Subnet Details")} size="small" style={{ marginTop: 16 }}>
                                            <Descriptions column={{ xs: 1, md: 2 }} size="small">
                                                <Descriptions.Item label={t("Network")}>
                                                    <Space>
                                                        <Text code>{ipv6SubnetInfo.network}</Text>
                                                        <Button aria-label={t("Copy")} size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipv6SubnetInfo.network)} />
                                                    </Space>
                                                </Descriptions.Item>
                                                <Descriptions.Item label={t("Address Space")}>
                                                    <Text>{t("{count} addresses", { count: ipv6SubnetInfo.range.split(" ")[0] })}</Text>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    )}
                                </Col>

                                <Col xs={24} lg={8}>
                                    <Card title={t("Common Subnet Sizes")} size="small">
                                        <Table
                                            dataSource={COMMON_SUBNETS}
                                            columns={subnetColumns}
                                            pagination={false}
                                            size="small"
                                            rowKey="cidr"
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },
                    {
                        key: "convert",
                        label: <span><SwapOutlined /> {t("Convert")}</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24}>
                                    <Card title={t("Convert to IPv4")} size="small">
                                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                            <Row gutter={16}>
                                                <Col xs={24} md={6}>
                                                    <Select
                                                        value={conversionType}
                                                        onChange={setConversionType}
                                                        style={{ width: "100%" }}
                                                        options={[
                                                            { value: "binary", label: t("Binary") },
                                                            { value: "decimal", label: t("Decimal") },
                                                            { value: "hex", label: t("Hexadecimal") },
                                                        ]}
                                                    />
                                                </Col>
                                                <Col xs={24} md={14}>
                                                    <Input
                                                        value={conversionInput}
                                                        onChange={(e) => setConversionInput(e.target.value)}
                                                        placeholder={
                                                            conversionType === "binary"
                                                                ? t("{first} or {second}", { first: "11000000.10101000.00000001.00000001", second: "11000000101010000000000100000001" })
                                                                : conversionType === "decimal"
                                                                    ? "3232235777"
                                                                    : t("{first} or {second}", { first: "c0:a8:01:01", second: "c0a80101" })
                                                        } dir="ltr" aria-label={t("Conversion input")}
                                                    />
                                                </Col>
                                                <Col xs={24} md={4}>
                                                    <Button type="primary" icon={<SwapOutlined />} onClick={handleConvert} block>
                                                        {t("Convert")}
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Alert
                                                type="info"
                                                title={t("Conversion Formats")}
                                                description={
                                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                                        <li><strong>{t("Binary:")}</strong> {t("32 bits, optionally separated by dots")}</li>
                                                        <li><strong>{t("Decimal:")}</strong> {t("Single number 0-4294967295")}</li>
                                                        <li><strong>{t("Hexadecimal:")}</strong> {t("8 hex digits, optionally with colons")}</li>
                                                    </ul>
                                                }
                                            />
                                        </Space>
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
            />
        </ToolPageLayout>
    );
}
