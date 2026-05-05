"use client";

import React, { useState, useMemo } from "react";
import {
    Card,
    Input,
    Typography,
    Row,
    Col,
    Space,
    Table,
    Tag,
    Select,
    Descriptions,
    Alert,
    Tabs,
    Badge,
} from "antd";
import {
    ClusterOutlined,
    SearchOutlined,
    InfoCircleOutlined,
    GlobalOutlined,
    LockOutlined,
    ExperimentOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph, Title } = Typography;
const { Option } = Select;

// ─── Types ───────────────────────────────────────────────────────────

interface IPRange {
    range: string;
    cidr: string;
    description: string;
    category: "Private" | "Loopback" | "Link-Local" | "Multicast" | "Reserved" | "Special" | "Documentation" | "Carrier-Grade NAT";
    rfc?: string;
    usableAddresses?: string;
    details?: string;
}

// ─── IP Range Database ───────────────────────────────────────────────

const IPV4_RANGES: IPRange[] = [
    // Private Ranges (RFC 1918)
    {
        range: "10.0.0.0 - 10.255.255.255",
        cidr: "10.0.0.0/8",
        description: "Private Network (Class A)",
        category: "Private",
        rfc: "RFC 1918",
        usableAddresses: "16,777,214",
        details: "Largest private block. Commonly used in enterprise networks, data centers, and cloud VPCs. AWS, Azure, and GCP use this for default VPCs."
    },
    {
        range: "172.16.0.0 - 172.31.255.255",
        cidr: "172.16.0.0/12",
        description: "Private Network (Class B)",
        category: "Private",
        rfc: "RFC 1918",
        usableAddresses: "1,048,574",
        details: "Medium-sized private block. Often used in Docker networks (default: 172.17.0.0/16) and Kubernetes pod networks."
    },
    {
        range: "192.168.0.0 - 192.168.255.255",
        cidr: "192.168.0.0/16",
        description: "Private Network (Class C)",
        category: "Private",
        rfc: "RFC 1918",
        usableAddresses: "65,534",
        details: "Smallest private block. Most common in home routers and small office networks. Typically 192.168.0.x or 192.168.1.x."
    },
    // Loopback
    {
        range: "127.0.0.0 - 127.255.255.255",
        cidr: "127.0.0.0/8",
        description: "Loopback (localhost)",
        category: "Loopback",
        rfc: "RFC 1122",
        usableAddresses: "16,777,214",
        details: "127.0.0.1 is 'localhost'. Used for testing local network applications. Packets never leave the host."
    },
    // Link-Local
    {
        range: "169.254.0.0 - 169.254.255.255",
        cidr: "169.254.0.0/16",
        description: "Link-Local (APIPA)",
        category: "Link-Local",
        rfc: "RFC 3927",
        usableAddresses: "65,534",
        details: "Automatic Private IP Addressing. Assigned when DHCP fails. Windows/Linux auto-configure these."
    },
    // Carrier-Grade NAT
    {
        range: "100.64.0.0 - 100.127.255.255",
        cidr: "100.64.0.0/10",
        description: "Carrier-Grade NAT (Shared Address Space)",
        category: "Carrier-Grade NAT",
        rfc: "RFC 6598",
        usableAddresses: "4,194,302",
        details: "Used by ISPs for large-scale NAT. Not routable on the public internet. May appear in traceroutes."
    },
    // Multicast
    {
        range: "224.0.0.0 - 239.255.255.255",
        cidr: "224.0.0.0/4",
        description: "Multicast",
        category: "Multicast",
        rfc: "RFC 5771",
        usableAddresses: "268,435,456",
        details: "Class D addresses for one-to-many communication. Used by IGMP, OSPF, RIPv2. 224.0.0.1 = all hosts, 224.0.0.2 = all routers."
    },
    // Reserved/Special
    {
        range: "0.0.0.0 - 0.255.255.255",
        cidr: "0.0.0.0/8",
        description: "Current Network (This Host)",
        category: "Reserved",
        rfc: "RFC 1122",
        details: "0.0.0.0 means 'any address' or 'all interfaces' when binding servers. Not routable."
    },
    {
        range: "240.0.0.0 - 255.255.255.254",
        cidr: "240.0.0.0/4",
        description: "Reserved (Class E)",
        category: "Reserved",
        rfc: "RFC 1112",
        details: "Reserved for future use. Not assigned for normal unicast. Some OS support it experimentally."
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
        usableAddresses: "256",
        details: "Reserved for documentation and examples. Use in tutorials, books, and training materials."
    },
    {
        range: "198.51.100.0 - 198.51.100.255",
        cidr: "198.51.100.0/24",
        description: "TEST-NET-2 (Documentation)",
        category: "Documentation",
        rfc: "RFC 5737",
        usableAddresses: "256",
        details: "Reserved for documentation. Second documentation range for examples needing multiple networks."
    },
    {
        range: "203.0.113.0 - 203.0.113.255",
        cidr: "203.0.113.0/24",
        description: "TEST-NET-3 (Documentation)",
        category: "Documentation",
        rfc: "RFC 5737",
        usableAddresses: "256",
        details: "Reserved for documentation. Third documentation range for complex examples."
    },
    // Benchmarking
    {
        range: "198.18.0.0 - 198.19.255.255",
        cidr: "198.18.0.0/15",
        description: "Benchmark Testing",
        category: "Special",
        rfc: "RFC 2544",
        usableAddresses: "131,072",
        details: "Reserved for network benchmark testing. Used by network equipment vendors."
    },
    // IETF Protocol Assignments
    {
        range: "192.0.0.0 - 192.0.0.255",
        cidr: "192.0.0.0/24",
        description: "IETF Protocol Assignments",
        category: "Reserved",
        rfc: "RFC 6890",
        usableAddresses: "256",
        details: "Allocated for IETF protocol assignments. 192.0.0.170 / 192.0.0.171 are NAT64/DNS64 well-known prefixes."
    },
    // 6to4 Anycast Relay (deprecated)
    {
        range: "192.88.99.0 - 192.88.99.255",
        cidr: "192.88.99.0/24",
        description: "6to4 Relay Anycast (deprecated)",
        category: "Special",
        rfc: "RFC 7526",
        usableAddresses: "256",
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
        details: "Indicates absence of address. Used in DHCP and when binding to all interfaces."
    },
    // Link-Local
    {
        range: "fe80::/10",
        cidr: "fe80::/10",
        description: "Link-Local Unicast",
        category: "Link-Local",
        rfc: "RFC 4291",
        details: "Automatically configured on all interfaces. Not routable beyond the local link."
    },
    // Unique Local (Private)
    {
        range: "fc00::/7 (fd00::/8 used)",
        cidr: "fc00::/7",
        description: "Unique Local Address (Private)",
        category: "Private",
        rfc: "RFC 4193",
        details: "IPv6 equivalent of RFC 1918 private addresses. fd00::/8 is commonly used for internal networks."
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
        details: "Publicly routable IPv6 addresses. Currently 2000::/3 is allocated for global unicast."
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
    // 6to4
    {
        range: "2002::/16",
        cidr: "2002::/16",
        description: "6to4 Transition",
        category: "Special",
        rfc: "RFC 3056",
        details: "Used for 6to4 tunneling. Embeds IPv4 address in the 6to4 prefix."
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
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [activeTab, setActiveTab] = useState("ipv4");

    const filteredRanges = useMemo(() => {
        const ranges = activeTab === "ipv4" ? IPV4_RANGES : IPV6_RANGES;

        return ranges.filter(range => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesText =
                    range.range.toLowerCase().includes(query) ||
                    range.cidr.toLowerCase().includes(query) ||
                    range.description.toLowerCase().includes(query) ||
                    (range.details || "").toLowerCase().includes(query);
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
            title: "CIDR",
            dataIndex: "cidr",
            key: "cidr",
            width: 180,
            render: (cidr: string) => <Text code strong>{cidr}</Text>
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: 130,
            render: (category: string) => (
                <Tag color={getCategoryColor(category)} icon={getCategoryIcon(category)}>
                    {category}
                </Tag>
            )
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 200,
        },
        {
            title: "RFC",
            dataIndex: "rfc",
            key: "rfc",
            width: 100,
            render: (rfc?: string) => rfc ? <Tag>{rfc}</Tag> : "-"
        },
        {
            title: "Usable IPs",
            dataIndex: "usableAddresses",
            key: "usableAddresses",
            width: 120,
            render: (count?: string) => count ? <Text code>{count}</Text> : "-"
        },
    ];

    const categories = activeTab === "ipv4"
        ? [...new Set(IPV4_RANGES.map(r => r.category))]
        : [...new Set(IPV6_RANGES.map(r => r.category))];

    return (
        <ToolPageLayout
            title="IP Ranges Reference"
            description="Reference guide for private, reserved, and special-use IP address ranges"
            icon={<ClusterOutlined style={{ fontSize: 24, color: "#eb2f96" }} />}
            color="#eb2f96"
            learnMore={{
                whatIs: "The IP Ranges Reference is a comprehensive guide to special-purpose IP address ranges defined by IETF RFCs. It covers private networks (RFC 1918), loopback addresses, link-local addresses, multicast ranges, documentation ranges, and other reserved address blocks for both IPv4 and IPv6. Understanding these ranges is essential for network architecture and security.",
                whyUse: "When designing networks, configuring firewalls, or troubleshooting connectivity, you need to know which IP ranges are routable on the public internet and which are reserved for special purposes. This reference helps you identify private addresses, avoid using reserved ranges incorrectly, and understand what different address types mean when they appear in logs or packet captures.",
                howToUse: [
                    "Switch between IPv4 and IPv6 tabs to view respective ranges",
                    "Search by CIDR notation, description, or RFC number",
                    "Filter by category to focus on specific range types",
                    "Expand rows to see detailed information and use cases",
                    "Reference RFC numbers for official documentation"
                ],
                tips: [
                    "Use 10.0.0.0/8 for large enterprise networks and cloud VPCs",
                    "192.168.0.0/16 is standard for home networks and small offices",
                    "Documentation ranges (192.0.2.0/24, etc.) are safe for examples",
                    "Link-local (169.254.x.x) appearing means DHCP isn't working",
                    "IPv6 unique local (fd00::/8) is the equivalent of RFC 1918 private"
                ],
                useCases: [
                    "Designing network architectures for cloud and on-premises",
                    "Writing firewall rules that distinguish public vs private traffic",
                    "Troubleshooting why traffic isn't reaching destinations",
                    "Teaching and documentation using proper example ranges",
                    "Understanding IP addresses in security logs and packet captures"
                ]
            }}
        >
            <Row gutter={[16, 16]}>
                {/* Filters */}
                <Col xs={24}>
                    <Card size="small">
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={10}>
                                <Input
                                    placeholder="Search ranges, descriptions, RFCs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    prefix={<SearchOutlined />}
                                    allowClear
                                />
                            </Col>
                            <Col xs={12} md={6}>
                                <Select
                                    value={categoryFilter}
                                    onChange={setCategoryFilter}
                                    style={{ width: "100%" }}
                                    placeholder="Category"
                                >
                                    <Option value="all">All Categories</Option>
                                    {categories.map(cat => (
                                        <Option key={cat} value={cat}>
                                            <Tag color={getCategoryColor(cat)} style={{ marginRight: 8 }}>{cat}</Tag>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={12} md={4}>
                                <Text type="secondary">{filteredRanges.length} ranges</Text>
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
                                            IPv4 Ranges
                                            <Badge count={IPV4_RANGES.length} style={{ backgroundColor: "#1890ff" }} />
                                        </Space>
                                    ),
                                },
                                {
                                    key: "ipv6",
                                    label: (
                                        <Space>
                                            <GlobalOutlined />
                                            IPv6 Ranges
                                            <Badge count={IPV6_RANGES.length} style={{ backgroundColor: "#52c41a" }} />
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
                                                <Text strong>Range: </Text>
                                                <Text code>{record.range}</Text>
                                            </div>
                                            {record.details && (
                                                <div>
                                                    <Text strong>Details: </Text>
                                                    <Paragraph style={{ margin: 0 }}>{record.details}</Paragraph>
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
                                title={<><LockOutlined /> Private Ranges</>}
                                size="small"
                                style={{ height: "100%" }}
                            >
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <div>
                                        <Text code>10.0.0.0/8</Text>
                                        <Text type="secondary"> — 16M hosts, enterprise/cloud</Text>
                                    </div>
                                    <div>
                                        <Text code>172.16.0.0/12</Text>
                                        <Text type="secondary"> — 1M hosts, Docker/K8s</Text>
                                    </div>
                                    <div>
                                        <Text code>192.168.0.0/16</Text>
                                        <Text type="secondary"> — 65K hosts, home/office</Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                title={<><ExperimentOutlined /> Documentation Ranges</>}
                                size="small"
                                style={{ height: "100%" }}
                            >
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <Alert
                                        type="info"
                                        message="Safe for examples"
                                        description="Use these in tutorials, docs, and training"
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
                                        <Text code>2001:db8::/32</Text> — IPv6 Docs
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                title={<><InfoCircleOutlined /> Special Addresses</>}
                                size="small"
                                style={{ height: "100%" }}
                            >
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <div>
                                        <Text code>127.0.0.1</Text>
                                        <Text type="secondary"> — localhost (IPv4)</Text>
                                    </div>
                                    <div>
                                        <Text code>::1</Text>
                                        <Text type="secondary"> — localhost (IPv6)</Text>
                                    </div>
                                    <div>
                                        <Text code>0.0.0.0</Text>
                                        <Text type="secondary"> — all interfaces</Text>
                                    </div>
                                    <div>
                                        <Text code>255.255.255.255</Text>
                                        <Text type="secondary"> — broadcast</Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Live cloud provider ranges */}
                <Col xs={24}>
                    <Card size="small" title={<><GlobalOutlined /> Live Cloud Provider Ranges</>}>
                        <Paragraph style={{ fontSize: 13, marginBottom: 8 }}>
                            Cloud providers publish their public IP ranges as machine-readable feeds that change frequently
                            (often weekly). These are not embedded in this tool — fetch them live from the source for accurate, up-to-date CIDRs:
                        </Paragraph>
                        <Space orientation="vertical" size={4} style={{ width: "100%" }}>
                            <div><Text strong>AWS:</Text>{" "}<a href="https://ip-ranges.amazonaws.com/ip-ranges.json" target="_blank" rel="noopener noreferrer">ip-ranges.amazonaws.com/ip-ranges.json</a></div>
                            <div><Text strong>Google Cloud:</Text>{" "}<a href="https://www.gstatic.com/ipranges/cloud.json" target="_blank" rel="noopener noreferrer">gstatic.com/ipranges/cloud.json</a></div>
                            <div><Text strong>Azure:</Text>{" "}<a href="https://www.microsoft.com/download/details.aspx?id=56519" target="_blank" rel="noopener noreferrer">microsoft.com/download (ServiceTags JSON)</a></div>
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
