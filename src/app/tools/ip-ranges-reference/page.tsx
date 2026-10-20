"use client";

import React, { useState, useMemo } from "react";
import {
    Button,
    Card,
    Input,
    Typography,
    Row,
    Col,
    Space,
    Table,
    Tag,
    Select,
    Alert,
    Tabs,
    Badge,
} from "antd";
import {
    ClusterOutlined,
    SearchOutlined,
    CopyOutlined,
    InfoCircleOutlined,
    GlobalOutlined,
    LockOutlined,
    ExperimentOutlined,
} from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import { copyToClipboard } from "@/lib/clipboard";
import { referenceNetworkMatches } from "@/lib/i18n/reference-network";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;
const { Option } = Select;

// ─── Types ───────────────────────────────────────────────────────────

interface IPRange {
    range: string;
    cidr: string;
    description: string;
    category: "Private" | "Loopback" | "Link-Local" | "Multicast" | "Reserved" | "Special" | "Documentation" | "Carrier-Grade NAT";
    rfc?: string;
    details?: string;
}

// ─── IP Range Database ───────────────────────────────────────────────

const IPV4_RANGES: IPRange[] = [
    // Private Ranges (RFC 1918)
    {
        range: "10.0.0.0 - 10.255.255.255",
        cidr: "10.0.0.0/8",
        description: "Private-Use Network",
        category: "Private",
        rfc: "RFC 1918",
        details: "The largest RFC 1918 block. Used in internal networks; cloud defaults vary by provider and configuration."
    },
    {
        range: "172.16.0.0 - 172.31.255.255",
        cidr: "172.16.0.0/12",
        description: "Private-Use Network",
        category: "Private",
        rfc: "RFC 1918",
        details: "An RFC 1918 block for internal networks. Container and cloud subnet choices depend on configuration."
    },
    {
        range: "192.168.0.0 - 192.168.255.255",
        cidr: "192.168.0.0/16",
        description: "Private-Use Network",
        category: "Private",
        rfc: "RFC 1918",
        details: "Smallest private block. Most common in home routers and small office networks. Typically 192.168.0.x or 192.168.1.x."
    },
    // Loopback
    {
        range: "127.0.0.0 - 127.255.255.255",
        cidr: "127.0.0.0/8",
        description: "Loopback (localhost)",
        category: "Loopback",
        rfc: "RFC 1122",
        details: "127.0.0.1 is 'localhost'. Used for testing local network applications. Packets never leave the host."
    },
    // Link-Local
    {
        range: "169.254.0.0 - 169.254.255.255",
        cidr: "169.254.0.0/16",
        description: "Link-Local (APIPA)",
        category: "Link-Local",
        rfc: "RFC 3927",
        details: "Link-local communication when routable configuration is unavailable, including isolated networks. This alone does not prove a DHCP failure."
    },
    // Carrier-Grade NAT
    {
        range: "100.64.0.0 - 100.127.255.255",
        cidr: "100.64.0.0/10",
        description: "Carrier-Grade NAT (Shared Address Space)",
        category: "Carrier-Grade NAT",
        rfc: "RFC 6598",
        details: "Used by ISPs for large-scale NAT. Not routable on the public internet. May appear in traceroutes."
    },
    // Multicast
    {
        range: "224.0.0.0 - 239.255.255.255",
        cidr: "224.0.0.0/4",
        description: "Multicast",
        category: "Multicast",
        rfc: "RFC 5771",
        details: "Class D addresses for one-to-many communication. Used by IGMP, OSPF, RIPv2. 224.0.0.1 = all hosts, 224.0.0.2 = all routers."
    },
    // Reserved/Special
    {
        range: "0.0.0.0 - 0.255.255.255",
        cidr: "0.0.0.0/8",
        description: "Current Network (This Host)",
        category: "Reserved",
        rfc: "RFC 1122",
        details: "This-network block. The single address 0.0.0.0 has unspecified-address and wildcard-binding uses; these meanings do not apply to every address in the block."
    },
    {
        range: "240.0.0.0 - 255.255.255.255",
        cidr: "240.0.0.0/4",
        description: "Reserved (Class E)",
        category: "Reserved",
        rfc: "RFC 1112",
        details: "Reserved block. The more-specific 255.255.255.255/32 allocation is limited broadcast."
    },
    {
        range: "255.255.255.255",
        cidr: "255.255.255.255/32",
        description: "Limited Broadcast",
        category: "Special",
        rfc: "RFC 919",
        details: "Broadcast to all hosts on the local network segment. Not forwarded by routers."
    },
    // Documentation
    {
        range: "192.0.2.0 - 192.0.2.255",
        cidr: "192.0.2.0/24",
        description: "TEST-NET-1 (Documentation)",
        category: "Documentation",
        rfc: "RFC 5737",
        details: "Reserved for documentation and examples. Use in tutorials, books, and training materials."
    },
    {
        range: "198.51.100.0 - 198.51.100.255",
        cidr: "198.51.100.0/24",
        description: "TEST-NET-2 (Documentation)",
        category: "Documentation",
        rfc: "RFC 5737",
        details: "Reserved for documentation. Second documentation range for examples needing multiple networks."
    },
    {
        range: "203.0.113.0 - 203.0.113.255",
        cidr: "203.0.113.0/24",
        description: "TEST-NET-3 (Documentation)",
        category: "Documentation",
        rfc: "RFC 5737",
        details: "Reserved for documentation. Third documentation range for complex examples."
    },
    // Benchmarking
    {
        range: "198.18.0.0 - 198.19.255.255",
        cidr: "198.18.0.0/15",
        description: "Benchmark Testing",
        category: "Special",
        rfc: "RFC 2544",
        details: "Reserved for network benchmark testing. Used by network equipment vendors."
    },
    // IETF Protocol Assignments
    {
        range: "192.0.0.0 - 192.0.0.255",
        cidr: "192.0.0.0/24",
        description: "IETF Protocol Assignments",
        category: "Reserved",
        rfc: "RFC 6890",
        details: "IETF protocol assignments with more-specific exceptions. 192.0.0.170 and 192.0.0.171 are NAT64/DNS64 discovery addresses, not translation prefixes."
    },
    // 6to4 Anycast Relay (deprecated)
    {
        range: "192.88.99.0 - 192.88.99.255",
        cidr: "192.88.99.0/24",
        description: "6to4 Relay Anycast (deprecated)",
        category: "Special",
        rfc: "RFC 7526",
        details: "Was used for 6to4 relay anycast. Formally deprecated in 2015; should not be used in new deployments."
    },
    // AS112
    {
        range: "192.31.196.0 - 192.31.196.255",
        cidr: "192.31.196.0/24",
        description: "AS112-v4",
        category: "Special",
        rfc: "RFC 7535",
        details: "Anycast prefix used by the AS112 project to absorb DNS queries for private addresses."
    },
];

const IPV6_RANGES: IPRange[] = [
    // Loopback
    {
        range: "::1/128",
        cidr: "::1/128",
        description: "Loopback (localhost)",
        category: "Loopback",
        rfc: "RFC 4291",
        details: "IPv6 equivalent of 127.0.0.1. Single address for local testing."
    },
    // Unspecified
    {
        range: "::/128",
        cidr: "::/128",
        description: "Unspecified Address",
        category: "Special",
        rfc: "RFC 4291",
        details: "The unspecified IPv6 address indicates absence of an address; socket APIs can use it for wildcard binding. It is not a destination address."
    },
    // Link-Local
    {
        range: "fe80::/10",
        cidr: "fe80::/10",
        description: "Link-Local Unicast",
        category: "Link-Local",
        rfc: "RFC 4291",
        details: "Link-local unicast scope. Routers must not forward these addresses beyond the link."
    },
    // Unique Local (Private)
    {
        range: "fc00::/7",
        cidr: "fc00::/7",
        description: "Unique Local Address (Private)",
        category: "Private",
        rfc: "RFC 4193",
        details: "Unique-local space for local communication. Locally assigned prefixes use fd00::/8 and a pseudo-random Global ID; fc00::/8 is not defined for local assignment."
    },
    // Multicast
    {
        range: "ff00::/8",
        cidr: "ff00::/8",
        description: "Multicast",
        category: "Multicast",
        rfc: "RFC 4291",
        details: "All IPv6 multicast addresses. ff02::1 = all nodes, ff02::2 = all routers."
    },
    // Global Unicast
    {
        range: "2000::/3",
        cidr: "2000::/3",
        description: "Global Unicast",
        category: "Special",
        rfc: "RFC 4291",
        details: "A global-unicast allocation space that also contains special-purpose subprefixes, including documentation. Membership does not guarantee global reachability."
    },
    // Documentation
    {
        range: "2001:db8::/32",
        cidr: "2001:db8::/32",
        description: "Documentation",
        category: "Documentation",
        rfc: "RFC 3849",
        details: "Reserved for documentation and examples. Use in tutorials and documentation."
    },
    { range: "3fff::/20", cidr: "3fff::/20", description: "Documentation", category: "Documentation", rfc: "RFC 9637", details: "Additional IPv6 documentation space for larger examples; not for operational addressing." },
    { range: "100:0:0:1::/64", cidr: "100:0:0:1::/64", description: "Dummy IPv6 Prefix", category: "Special", rfc: "RFC 9780", details: "A dummy source prefix for specific protocol uses, including multipoint BFD; not a routable destination block." },
    // 6to4
    {
        range: "2002::/16",
        cidr: "2002::/16",
        description: "6to4 Transition",
        category: "Special",
        rfc: "RFC 3056",
        details: "The 6to4 prefix embeds IPv4 addresses. RFC 7526 deprecated 6to4 relay anycast; this is a legacy transition mechanism."
    },
    // Teredo
    {
        range: "2001::/32",
        cidr: "2001::/32",
        description: "Teredo Tunneling",
        category: "Special",
        rfc: "RFC 4380",
        details: "Teredo addresses for IPv6 tunneling through NAT. Used by Windows."
    },
    // NAT64 well-known prefix
    {
        range: "64:ff9b::/96",
        cidr: "64:ff9b::/96",
        description: "IPv4/IPv6 Translation (NAT64)",
        category: "Special",
        rfc: "RFC 6052",
        details: "Well-known prefix for IPv4-embedded IPv6 addresses used by NAT64 / DNS64 translators."
    },
    {
        range: "64:ff9b:1::/48",
        cidr: "64:ff9b:1::/48",
        description: "Local-Use IPv4/IPv6 Translation",
        category: "Special",
        rfc: "RFC 8215",
        details: "Local-use prefix for IPv4/IPv6 translation when the well-known prefix is unsuitable."
    },
    {
        range: "::ffff:0:0/96",
        cidr: "::ffff:0:0/96",
        description: "IPv4-Mapped IPv6 Address",
        category: "Special",
        rfc: "RFC 4291",
        details: "Used to represent IPv4 addresses inside IPv6 (::ffff:192.0.2.1). Common in dual-stack sockets."
    },
    // Discard prefix
    {
        range: "100::/64",
        cidr: "100::/64",
        description: "Discard-Only Address Block",
        category: "Reserved",
        rfc: "RFC 6666",
        details: "Used as a sink for traffic that should be silently discarded. Routers blackhole this prefix."
    },
];

// ─── Component ───────────────────────────────────────────────────────

export default function IPRangesReferencePage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [activeTab, setActiveTab] = useState("ipv4");

    const filteredRanges = useMemo(() => {
        const ranges = activeTab === "ipv4" ? IPV4_RANGES : IPV6_RANGES;

        return ranges.filter(range => {
            if (searchQuery) {
                const matchesText = referenceNetworkMatches(searchQuery, range.range, range.cidr, range.description, range.category, range.rfc ?? "", range.details ?? "");
                if (!matchesText) return false;
            }

            if (categoryFilter !== "all" && range.category !== categoryFilter) return false;

            return true;
        });
    }, [searchQuery, categoryFilter, activeTab]);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            "Private": "green",
            "Loopback": "cyan",
            "Link-Local": "gold",
            "Multicast": "purple",
            "Reserved": "red",
            "Special": "blue",
            "Documentation": "orange",
            "Carrier-Grade NAT": "magenta",
        };
        return colors[category] || "default";
    };

    const getCategoryIcon = (category: string) => {
        if (category === "Private") return <LockOutlined />;
        if (category === "Documentation") return <ExperimentOutlined />;
        return <GlobalOutlined />;
    };

    const columns = [
        {
            title: t("CIDR"),
            dataIndex: "cidr",
            key: "cidr",
            width: 180,
            render: (cidr: string) => <Space><Text code strong dir="ltr">{cidr}</Text><Button size="small" type="text" aria-label={t("Copy {value}", { value: cidr })} icon={<CopyOutlined />} onClick={() => copyToClipboard(cidr)} /></Space>
        },
        {
            title: t("Category"),
            dataIndex: "category",
            key: "category",
            width: 130,
            render: (category: string) => (
                <Tag color={getCategoryColor(category)} icon={getCategoryIcon(category)}>
                    {t(category)}
                </Tag>
            )
        },
        {
            title: t("Description"),
            dataIndex: "description",
            key: "description",
            width: 200,
            render: (description: string) => t(description),
        },
        {
            title: t("RFC"),
            dataIndex: "rfc",
            key: "rfc",
            width: 100,
            render: (rfc?: string) => rfc ? <Tag>{rfc}</Tag> : "-"
        },
        {
            title: t("Addresses in block"),
            key: "addressCount",
            width: 120,
            render: (_: unknown, record: IPRange) => <Text code dir="ltr">{record.cidr.includes(":") ? (record.cidr.endsWith("/128") ? "1" : `2^${128 - Number(record.cidr.split("/")[1])}`) : (2 ** (32 - Number(record.cidr.split("/")[1]))).toLocaleString("en-US")}</Text>
        },
    ];

    const categories = activeTab === "ipv4"
        ? [...new Set(IPV4_RANGES.map(r => r.category))]
        : [...new Set(IPV6_RANGES.map(r => r.category))];

    return (
        <ToolPageLayout
            title={t("IP Ranges Reference")}
            description={t("Reference guide for private, reserved, and special-use IP address ranges")}
            icon={<ClusterOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: t("A curated local reference for selected IPv4 and IPv6 special-purpose blocks. It is not a complete registry or a live reachability test. More-specific allocations can have different rules."),
                howToUse: [t("Select IPv4 or IPv6, search CIDRs, RFC identifiers or descriptions, and filter by category. Expand rows for context. Copy buttons copy the CIDR exactly.")],
                tips: [t("Address counts describe the entire CIDR block, not usable hosts. Routing and host-assignment rules depend on the allocation and subnet. Check the linked IANA registries and RFCs for exceptions.")],
            }}
        >
            <Row gutter={[16, 16]}>
                {/* Filters */}
                <Col xs={24}>
                    <Card size="small">
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={10}>
                                <Input aria-label={t("Search reference")} dir="auto" style={{ fontSize: 16 }}
                                    placeholder={t("Search ranges, descriptions, RFCs...")}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    prefix={<SearchOutlined />}
                                    allowClear
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Select aria-label={t("Category")}
                                    value={categoryFilter}
                                    onChange={setCategoryFilter}
                                    style={{ width: "100%" }}
                                    placeholder={t("Category")}
                                >
                                    <Option value="all">{t("All Categories")}</Option>
                                    {categories.map(cat => (
                                        <Option key={cat} value={cat}>
                                            <Tag color={getCategoryColor(cat)} style={{ marginRight: 8 }}>{t(cat)}</Tag>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={12} md={4}>
                                <Text type="secondary">{t("{count} ranges", { count: filteredRanges.length })}</Text>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* IP Version Tabs */}
                <Col xs={24}>
                    <Card size="small">
                        <Tabs
                            activeKey={activeTab}
                            onChange={(key) => {
                                setActiveTab(key);
                                setCategoryFilter("all");
                            }}
                            items={[
                                {
                                    key: "ipv4",
                                    label: (
                                        <Space>
                                            <GlobalOutlined />
                                            {t("IPv4 Ranges")}<Badge count={IPV4_RANGES.length} style={{ backgroundColor: "#1890ff" }} />
                                        </Space>
                                    ),
                                },
                                {
                                    key: "ipv6",
                                    label: (
                                        <Space>
                                            <GlobalOutlined />
                                            {t("IPv6 Ranges")}<Badge count={IPV6_RANGES.length} style={{ backgroundColor: "#52c41a" }} />
                                        </Space>
                                    ),
                                },
                            ]}
                        />

                        <Table
                            dataSource={filteredRanges}
                            columns={columns}
                            rowKey="cidr"
                            pagination={false}
                            size="small"
                            expandable={{
                                expandedRowRender: (record) => (
                                    <div style={{ padding: "12px 0" }}>
                                        <Space orientation="vertical" style={{ width: "100%" }}>
                                            <div>
                                                <Text strong>{t("Range:")}</Text>
                                                <Text code>{record.range}</Text>
                                            </div>
                                            {record.details && (
                                                <div>
                                                    <Text strong>{t("Details:")}</Text>
                                                    <Paragraph style={{ margin: 0 }}>{t(record.details)}</Paragraph>
                                                </div>
                                            )}
                                        </Space>
                                    </div>
                                ),
                            }}
                        />
                    </Card>
                </Col>

                {/* Quick Reference Cards */}
                <Col xs={24}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Card
                                title={<><LockOutlined /> {t("Private Ranges")}</>}
                                size="small"
                                style={{ height: "100%" }}
                            >
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <div>
                                        <Text code>10.0.0.0/8</Text>
                                        <Text type="secondary"> {t("— 16,777,216 addresses")}</Text>
                                    </div>
                                    <div>
                                        <Text code>172.16.0.0/12</Text>
                                        <Text type="secondary"> {t("— 1,048,576 addresses")}</Text>
                                    </div>
                                    <div>
                                        <Text code>192.168.0.0/16</Text>
                                        <Text type="secondary"> {t("— 65,536 addresses")}</Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                title={<><ExperimentOutlined /> {t("Documentation Ranges")}</>}
                                size="small"
                                style={{ height: "100%" }}
                            >
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <Alert
                                        type="info"
                                        title={t("Reserved for examples")}
                                        description={t("Use these in tutorials, docs, and training")}
                                        style={{ padding: "8px 12px" }}
                                    />
                                    <div>
                                        <Text code>192.0.2.0/24</Text> — TEST-NET-1
                                    </div>
                                    <div>
                                        <Text code>198.51.100.0/24</Text> — TEST-NET-2
                                    </div>
                                    <div>
                                        <Text code>203.0.113.0/24</Text> — TEST-NET-3
                                    </div>
                                    <div>
                                        <Text code>2001:db8::/32</Text> {t("— IPv6 documentation")}</div>
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                title={<><InfoCircleOutlined /> {t("Special Addresses")}</>}
                                size="small"
                                style={{ height: "100%" }}
                            >
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <div>
                                        <Text code>127.0.0.1</Text>
                                        <Text type="secondary"> {t("— localhost (IPv4)")}</Text>
                                    </div>
                                    <div>
                                        <Text code>::1</Text>
                                        <Text type="secondary"> {t("— localhost (IPv6)")}</Text>
                                    </div>
                                    <div>
                                        <Text code>0.0.0.0</Text>
                                        <Text type="secondary"> {t("— wildcard bind address")}</Text>
                                    </div>
                                    <div>
                                        <Text code>255.255.255.255</Text>
                                        <Text type="secondary"> {t("— broadcast")}</Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Live cloud provider ranges */}
                <Col xs={24}>
                    <Card size="small" title={<><GlobalOutlined /> {t("Cloud Provider Range Sources")}</>}>
                        <Paragraph style={{ fontSize: 13, marginBottom: 8 }}>
                            {t("Cloud range feeds change independently of this local reference. These links open provider sources; the page does not fetch or validate their current contents.")}</Paragraph>
                        <Space orientation="vertical" size={4} style={{ width: "100%" }}>
                            <div><Text strong>AWS:</Text>{" "}<a href="https://ip-ranges.amazonaws.com/ip-ranges.json" target="_blank" rel="noopener noreferrer">ip-ranges.amazonaws.com/ip-ranges.json</a></div>
                            <div><Text strong>Google Cloud:</Text>{" "}<a href="https://www.gstatic.com/ipranges/cloud.json" target="_blank" rel="noopener noreferrer">gstatic.com/ipranges/cloud.json</a></div>
                            <div><Text strong>Azure:</Text>{" "}<a href="https://www.microsoft.com/download/details.aspx?id=56519" target="_blank" rel="noopener noreferrer">microsoft.com/download/details.aspx?id=56519</a></div>
                            <div><Text strong>Cloudflare:</Text>{" "}<a href="https://www.cloudflare.com/ips-v4" target="_blank" rel="noopener noreferrer">cloudflare.com/ips-v4</a> · <a href="https://www.cloudflare.com/ips-v6" target="_blank" rel="noopener noreferrer">/ips-v6</a></div>
                            <div><Text strong>GitHub:</Text>{" "}<a href="https://api.github.com/meta" target="_blank" rel="noopener noreferrer">api.github.com/meta</a></div>
                            <div><Text strong>Fastly:</Text>{" "}<a href="https://api.fastly.com/public-ip-list" target="_blank" rel="noopener noreferrer">api.fastly.com/public-ip-list</a></div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
