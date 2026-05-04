"use client";

import React, { useState, useMemo, useCallback } from "react";
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
import { useAppStore } from "@/lib/store";

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
    const zoneIndex = ip.indexOf("%");
    let cleanIP = zoneIndex !== -1 ? ip.substring(0, zoneIndex) : ip;

    if (cleanIP.includes(".")) {
        const lastColon = cleanIP.lastIndexOf(":");
        if (lastColon === -1) return null;
        const ipv6Part = cleanIP.substring(0, lastColon);
        const ipv4Part = cleanIP.substring(lastColon + 1);
        const ipv4Octets = parseIPv4(ipv4Part);
        if (!ipv4Octets) return null;

        const hex1 = ((ipv4Octets[0] << 8) + ipv4Octets[1]).toString(16);
        const hex2 = ((ipv4Octets[2] << 8) + ipv4Octets[3]).toString(16);
        cleanIP = ipv6Part + ":" + hex1 + ":" + hex2;
    }

    let expanded = cleanIP;
    if (cleanIP.includes("::")) {
        const parts = cleanIP.split("::");
        if (parts.length > 2) return null;

        const left = parts[0] ? parts[0].split(":").filter(p => p !== "") : [];
        const right = parts[1] ? parts[1].split(":").filter(p => p !== "") : [];
        const missingGroups = 8 - left.length - right.length;

        if (missingGroups < 0) return null;

        const middle = Array(missingGroups).fill("0");
        expanded = [...left, ...middle, ...right].join(":");
    }

    const groups = expanded.split(":");
    if (groups.length !== 8) return null;

    const result: number[] = [];
    for (const group of groups) {
        if (group.length > 4) return null;
        const num = parseInt(group || "0", 16);
        if (isNaN(num) || num < 0 || num > 0xFFFF) return null;
        result.push(num);
    }
    return result;
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

    if (groups.every((g, i) => i === 7 ? g === 1 : g === 0)) return "Loopback";
    if (first === 0xfe80) return "Link-Local";
    if (first === 0xfec0) return "Site-Local (Deprecated)";
    if ((first >> 8) === 0xff) {
        const scope = (first >> 4) & 0xf;
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
        const isLinkLocal = ipv6Groups[0] === 0xfe80;
        const isMulticast = (ipv6Groups[0] >> 8) === 0xff;
        const isPrivate = (ipv6Groups[0] & 0xfe00) === 0xfc00;
        const isDocumentation = ipv6Groups[0] === 0x2001 && ipv6Groups[1] === 0x0db8;
        const isAnycast = ipv6Groups[0] === 0x2001 && ipv6Groups[1] === 0;

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
            isReserved: false,
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
    if (!octets || cidr < 0 || cidr > 32) return null;

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
    if (!groups || prefix < 0 || prefix > 128) return null;

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
    const num = parseInt(decimal, 10);
    if (isNaN(num) || num < 0 || num > 4294967295) return "";

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
            ip[0] >= 224
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
    const { darkMode } = useAppStore();
    const [inputIP, setInputIP] = useState("");
    const [cidr, setCidr] = useState(24);
    const [ipv6Prefix, setIpv6Prefix] = useState(64);
    const [conversionInput, setConversionInput] = useState("");
    const [conversionType, setConversionType] = useState<"binary" | "decimal" | "hex">("binary");

    const ipInfo = useMemo(() => analyzeIP(inputIP), [inputIP]);

    const subnetInfo = useMemo(() => {
        if (ipInfo.version === "IPv4") return calculateIPv4Subnet(inputIP, cidr);
        return null;
    }, [inputIP, cidr, ipInfo.version]);

    const ipv6SubnetInfo = useMemo(() => {
        if (ipInfo.version === "IPv6") return calculateIPv6Subnet(inputIP, ipv6Prefix);
        return null;
    }, [inputIP, ipv6Prefix, ipInfo.version]);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copied!`);
    };

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
            message.success("Converted successfully!");
        } else {
            message.error("Invalid input format");
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
        { title: "IP Address", dataIndex: "ip", key: "ip", render: (ip: string) => <Text code style={{ fontSize: 11 }}>{ip}</Text> },
        { title: "Type", dataIndex: "desc", key: "desc", render: (desc: string) => <Text style={{ fontSize: 11 }}>{desc}</Text> },
        {
            title: "",
            key: "action",
            width: 50,
            render: (_: unknown, record: { ip: string }) => (
                <Button size="small" type="link" onClick={() => setInputIP(record.ip)}>Use</Button>
            )
        },
    ];

    const subnetColumns = [
        { title: "CIDR", dataIndex: "cidr", key: "cidr" },
        { title: "Subnet Mask", dataIndex: "mask", key: "mask" },
        { title: "Hosts", dataIndex: "hosts", key: "hosts" },
    ];

    return (
        <ToolPageLayout
            title="IP Address Tools"
            description="Comprehensive IPv4/IPv6 analyzer, converter, and subnet calculator"
            icon={<GlobalOutlined style={{ fontSize: 24, color: "#1890ff" }} />}
            color="#1890ff"
            learnMore={{
                whatIs: "A complete utility for inspecting both IPv4 (32-bit, dotted-decimal) and IPv6 (128-bit, colon-hex) addresses. It validates the address, classifies it (private, loopback, link-local, multicast, reserved, documentation, ULA), shows the binary, decimal, and hex forms, computes the in-addr.arpa / ip6.arpa reverse-DNS pointer, and runs subnet math without sending the address anywhere.",
                whyUse: "Network engineers waste minutes per IP toggling between calculators, RFC tables, and online lookups. This tool collapses that into a single view — useful when triaging firewall hits, planning a VPC, decoding access logs, or answering 'is 100.64.0.5 public?' (it's not — that's CGNAT space, RFC 6598).",
                howToUse: [
                    "Enter any IPv4 or IPv6 address — validation runs as you type",
                    "Read the classification, scope, and which RFC defines the range",
                    "Switch to the subnet tab to compute network/broadcast/usable hosts for a CIDR",
                    "Toggle representations: binary, decimal, hex, expanded vs compressed IPv6",
                    "Generate a random address inside a chosen prefix for synthetic test data",
                ],
                tips: [
                    "IPv4 private space: 10.0.0.0/8 (RFC 1918), 172.16.0.0/12, 192.168.0.0/16",
                    "100.64.0.0/10 (RFC 6598) is shared CGNAT space — neither truly public nor private",
                    "169.254.0.0/16 (RFC 3927) is link-local — auto-assigned when DHCP fails",
                    "IPv6 fc00::/7 is the Unique Local Address space — the IPv6 equivalent of RFC 1918",
                    "IPv6 :: compresses one run of consecutive zero groups — only one :: per address",
                    "/64 is the standard IPv6 subnet size; smaller subnets break SLAAC",
                    "224.0.0.0/4 (IPv4) and ff00::/8 (IPv6) are multicast — used for mDNS, OSPF, IGMP",
                ],
                useCases: [
                    "Confirming whether a logged IP is internal, external, or shared CGNAT",
                    "Planning VPC, VNet, and on-prem subnet allocations without overlap",
                    "Decoding firewall and SIEM events that log IPs in unfamiliar formats",
                    "Converting IPv4 to IPv4-mapped IPv6 (::ffff:1.2.3.4) for dual-stack systems",
                    "Building reverse-DNS PTR records during DNS configuration",
                    "Studying for CCNA, CompTIA Network+, AWS Networking certifications",
                ],
            }}
        >
            <Tabs
                defaultActiveKey="analyze"
                items={[
                    {
                        key: "analyze",
                        label: <span><SearchOutlined /> Analyze</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={16}>
                                    <Card size="small">
                                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                            <Input
                                                size="large"
                                                placeholder="Enter IPv4 (e.g., 192.168.1.1) or IPv6 (e.g., 2001:db8::1)"
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
                                                }
                                            />

                                            <Space wrap>
                                                <Text type="secondary">Generate:</Text>
                                                <Button size="small" onClick={() => handleGenerateRandom("ipv4", "public")}>
                                                    Public IPv4
                                                </Button>
                                                <Button size="small" onClick={() => handleGenerateRandom("ipv4", "private")}>
                                                    Private IPv4
                                                </Button>
                                                <Button size="small" onClick={() => handleGenerateRandom("ipv6", "global")}>
                                                    Global IPv6
                                                </Button>
                                                <Button size="small" onClick={() => handleGenerateRandom("ipv6", "linklocal")}>
                                                    Link-Local IPv6
                                                </Button>
                                            </Space>
                                        </Space>
                                    </Card>

                                    {ipInfo.isValid && (
                                        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                                            <Col xs={24} md={12}>
                                                <Card title="Address Information" size="small">
                                                    <Descriptions column={1} size="small">
                                                        <Descriptions.Item label="Version">
                                                            <Tag color="blue">{ipInfo.version}</Tag>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Network Type">
                                                            <Tag color={ipInfo.isPrivate || ipInfo.isLoopback ? "orange" : "cyan"}>
                                                                {ipInfo.networkType}
                                                            </Tag>
                                                        </Descriptions.Item>
                                                        {ipInfo.ipClass && (
                                                            <Descriptions.Item label="IP Class">
                                                                <Tag color="purple">Class {ipInfo.ipClass}</Tag>
                                                            </Descriptions.Item>
                                                        )}
                                                        {ipInfo.scope && (
                                                            <Descriptions.Item label="Scope">
                                                                <Tag color="geekblue">{ipInfo.scope}</Tag>
                                                            </Descriptions.Item>
                                                        )}
                                                        <Descriptions.Item label="Properties">
                                                            <Space wrap size={[4, 4]}>
                                                                {ipInfo.isPrivate && <Tag color="orange">Private</Tag>}
                                                                {ipInfo.isLoopback && <Tag color="cyan">Loopback</Tag>}
                                                                {ipInfo.isMulticast && <Tag color="magenta">Multicast</Tag>}
                                                                {ipInfo.isLinkLocal && <Tag color="gold">Link-Local</Tag>}
                                                                {ipInfo.isBroadcast && <Tag color="red">Broadcast</Tag>}
                                                                {ipInfo.isDocumentation && <Tag color="purple">Documentation</Tag>}
                                                                {ipInfo.isAnycast && <Tag color="volcano">Anycast</Tag>}
                                                                {ipInfo.isReserved && <Tag color="red">Reserved</Tag>}
                                                                {!ipInfo.isPrivate && !ipInfo.isLoopback && !ipInfo.isMulticast &&
                                                                    !ipInfo.isLinkLocal && !ipInfo.isReserved && !ipInfo.isBroadcast &&
                                                                    !ipInfo.isDocumentation && (
                                                                        <Tag color="green">Globally Routable</Tag>
                                                                    )}
                                                            </Space>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Card title="Representations" size="small">
                                                    <Space orientation="vertical" style={{ width: "100%" }} size="small">
                                                        {ipInfo.version === "IPv6" && ipInfo.compressed && (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Text type="secondary">Compressed:</Text>
                                                                <Space>
                                                                    <Text code>{ipInfo.compressed}</Text>
                                                                    <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.compressed!, "Compressed")} />
                                                                </Space>
                                                            </div>
                                                        )}
                                                        {ipInfo.version === "IPv6" && ipInfo.expanded && (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Text type="secondary">Expanded:</Text>
                                                                <Space>
                                                                    <Text code style={{ fontSize: 11 }}>{ipInfo.expanded}</Text>
                                                                    <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.expanded!, "Expanded")} />
                                                                </Space>
                                                            </div>
                                                        )}
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Text type="secondary">Hexadecimal:</Text>
                                                            <Space>
                                                                <Text code style={{ fontSize: 11 }}>{ipInfo.hexadecimal}</Text>
                                                                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.hexadecimal, "Hex")} />
                                                            </Space>
                                                        </div>
                                                        {ipInfo.version === "IPv4" && (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Text type="secondary">Decimal:</Text>
                                                                <Space>
                                                                    <Text code>{ipInfo.decimal}</Text>
                                                                    <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.decimal, "Decimal")} />
                                                                </Space>
                                                            </div>
                                                        )}
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                                                            <Text type="secondary">Binary:</Text>
                                                            <Space>
                                                                <Text code style={{ fontSize: 10, wordBreak: "break-all" }}>{ipInfo.binary}</Text>
                                                                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.binary, "Binary")} />
                                                            </Space>
                                                        </div>
                                                        {ipInfo.reversePtr && (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                                                                <Text type="secondary">Reverse PTR:</Text>
                                                                <Space>
                                                                    <Text code style={{ fontSize: 10, wordBreak: "break-all" }}>{ipInfo.reversePtr}</Text>
                                                                    <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipInfo.reversePtr!, "PTR")} />
                                                                </Space>
                                                            </div>
                                                        )}
                                                        {ipInfo.version === "IPv4" && (
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Text type="secondary">IPv6 Mapped:</Text>
                                                                <Space>
                                                                    <Text code>{ipv4ToIPv6(inputIP)}</Text>
                                                                    <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipv4ToIPv6(inputIP)!, "IPv6 Mapped")} />
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
                                            message="Invalid IP Address"
                                            description="Enter a valid IPv4 (e.g., 192.168.1.1) or IPv6 (e.g., 2001:db8::1) address"
                                            showIcon
                                        />
                                    )}
                                </Col>

                                <Col xs={24} lg={8}>
                                    <Card title="Example IP Addresses" size="small">
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
                        label: <span><CalculatorOutlined /> Subnet Calculator</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={16}>
                                    <Card size="small">
                                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                            <Row gutter={16} align="middle">
                                                <Col flex="auto">
                                                    <Input
                                                        size="large"
                                                        placeholder="Enter IP address"
                                                        value={inputIP}
                                                        onChange={(e) => setInputIP(e.target.value)}
                                                        prefix={<WifiOutlined />}
                                                    />
                                                </Col>
                                                <Col>
                                                    <Text strong>/</Text>
                                                </Col>
                                                <Col>
                                                    {ipInfo.version === "IPv6" ? (
                                                        <InputNumber
                                                            min={1}
                                                            max={128}
                                                            value={ipv6Prefix}
                                                            onChange={(v) => setIpv6Prefix(v || 64)}
                                                            style={{ width: 80 }}
                                                        />
                                                    ) : (
                                                        <InputNumber
                                                            min={0}
                                                            max={32}
                                                            value={cidr}
                                                            onChange={(v) => setCidr(v || 24)}
                                                            style={{ width: 80 }}
                                                        />
                                                    )}
                                                </Col>
                                            </Row>

                                            {ipInfo.version === "IPv4" && (
                                                <Space wrap>
                                                    <Text type="secondary">Quick select:</Text>
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
                                                    <Text type="secondary">Quick select:</Text>
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
                                                <Card title="Subnet Details" size="small">
                                                    <Descriptions column={1} size="small">
                                                        <Descriptions.Item label="Network Address">
                                                            <Space>
                                                                <Text code>{subnetInfo.networkAddress}</Text>
                                                                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(subnetInfo.networkAddress, "Network")} />
                                                            </Space>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Broadcast Address">
                                                            <Space>
                                                                <Text code>{subnetInfo.broadcastAddress}</Text>
                                                                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(subnetInfo.broadcastAddress, "Broadcast")} />
                                                            </Space>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Subnet Mask">
                                                            <Space>
                                                                <Text code>{subnetInfo.subnetMask}</Text>
                                                                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(subnetInfo.subnetMask, "Subnet Mask")} />
                                                            </Space>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Wildcard Mask">
                                                            <Space>
                                                                <Text code>{subnetInfo.wildcardMask}</Text>
                                                                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(subnetInfo.wildcardMask, "Wildcard")} />
                                                            </Space>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Card title="Host Range" size="small">
                                                    <Descriptions column={1} size="small">
                                                        <Descriptions.Item label="First Usable Host">
                                                            <Text code>{subnetInfo.firstHost}</Text>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Last Usable Host">
                                                            <Text code>{subnetInfo.lastHost}</Text>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                    <Divider style={{ margin: "12px 0" }} />
                                                    <Row gutter={16}>
                                                        <Col span={12}>
                                                            <Statistic
                                                                title="Total Addresses"
                                                                value={subnetInfo.totalHosts.toLocaleString()}
                                                                styles={{ content: { fontSize: 18 } }}
                                                            />
                                                        </Col>
                                                        <Col span={12}>
                                                            <Statistic
                                                                title="Usable Hosts"
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
                                        <Card title="IPv6 Subnet Details" size="small" style={{ marginTop: 16 }}>
                                            <Descriptions column={{ xs: 1, md: 2 }} size="small">
                                                <Descriptions.Item label="Network">
                                                    <Space>
                                                        <Text code>{ipv6SubnetInfo.network}</Text>
                                                        <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(ipv6SubnetInfo.network, "Network")} />
                                                    </Space>
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Address Space">
                                                    <Text>{ipv6SubnetInfo.range}</Text>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    )}
                                </Col>

                                <Col xs={24} lg={8}>
                                    <Card title="Common Subnet Sizes" size="small">
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
                        label: <span><SwapOutlined /> Convert</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24}>
                                    <Card title="Convert to IPv4" size="small">
                                        <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                                            <Row gutter={16}>
                                                <Col xs={24} md={6}>
                                                    <Select
                                                        value={conversionType}
                                                        onChange={setConversionType}
                                                        style={{ width: "100%" }}
                                                        options={[
                                                            { value: "binary", label: "Binary" },
                                                            { value: "decimal", label: "Decimal" },
                                                            { value: "hex", label: "Hexadecimal" },
                                                        ]}
                                                    />
                                                </Col>
                                                <Col xs={24} md={14}>
                                                    <Input
                                                        value={conversionInput}
                                                        onChange={(e) => setConversionInput(e.target.value)}
                                                        placeholder={
                                                            conversionType === "binary"
                                                                ? "11000000.10101000.00000001.00000001 or 11000000101010000000000100000001"
                                                                : conversionType === "decimal"
                                                                    ? "3232235777"
                                                                    : "c0:a8:01:01 or c0a80101"
                                                        }
                                                    />
                                                </Col>
                                                <Col xs={24} md={4}>
                                                    <Button type="primary" icon={<SwapOutlined />} onClick={handleConvert} block>
                                                        Convert
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Alert
                                                type="info"
                                                message="Conversion Formats"
                                                description={
                                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                                        <li><strong>Binary:</strong> 32 bits, optionally separated by dots</li>
                                                        <li><strong>Decimal:</strong> Single number 0-4294967295</li>
                                                        <li><strong>Hexadecimal:</strong> 8 hex digits, optionally with colons</li>
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
