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
    Badge,
    Tabs,
    Alert,
} from "antd";
import {
    GlobalOutlined,
    SearchOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Paragraph } = Typography;
const { Option } = Select;

// ─── Types ───────────────────────────────────────────────────────────

interface PortInfo {
    port: number;
    protocol: "TCP" | "UDP" | "TCP/UDP";
    service: string;
    description: string;
    category: string;
    security?: "secure" | "insecure" | "neutral";
}

// ─── Port Database ───────────────────────────────────────────────────

const PORT_DATABASE: PortInfo[] = [
    // Well-known Ports (0-1023)
    { port: 20, protocol: "TCP", service: "FTP-Data", description: "File Transfer Protocol (data transfer)", category: "File Transfer", security: "insecure" },
    { port: 21, protocol: "TCP", service: "FTP", description: "File Transfer Protocol (control)", category: "File Transfer", security: "insecure" },
    { port: 22, protocol: "TCP", service: "SSH", description: "Secure Shell - encrypted remote access and file transfer", category: "Remote Access", security: "secure" },
    { port: 23, protocol: "TCP", service: "Telnet", description: "Unencrypted text communications (legacy)", category: "Remote Access", security: "insecure" },
    { port: 25, protocol: "TCP", service: "SMTP", description: "Simple Mail Transfer Protocol - email sending", category: "Email", security: "insecure" },
    { port: 53, protocol: "TCP/UDP", service: "DNS", description: "Domain Name System - translates domain names to IPs", category: "Network Infrastructure" },
    { port: 67, protocol: "UDP", service: "DHCP Server", description: "Dynamic Host Configuration Protocol (server)", category: "Network Infrastructure" },
    { port: 68, protocol: "UDP", service: "DHCP Client", description: "Dynamic Host Configuration Protocol (client)", category: "Network Infrastructure" },
    { port: 69, protocol: "UDP", service: "TFTP", description: "Trivial File Transfer Protocol", category: "File Transfer", security: "insecure" },
    { port: 80, protocol: "TCP", service: "HTTP", description: "Hypertext Transfer Protocol - unencrypted web traffic", category: "Web", security: "insecure" },
    { port: 110, protocol: "TCP", service: "POP3", description: "Post Office Protocol v3 - email retrieval", category: "Email", security: "insecure" },
    { port: 119, protocol: "TCP", service: "NNTP", description: "Network News Transfer Protocol - Usenet", category: "News" },
    { port: 123, protocol: "UDP", service: "NTP", description: "Network Time Protocol - time synchronization", category: "Network Infrastructure" },
    { port: 137, protocol: "UDP", service: "NetBIOS-NS", description: "NetBIOS Name Service", category: "Windows Networking" },
    { port: 138, protocol: "UDP", service: "NetBIOS-DGM", description: "NetBIOS Datagram Service", category: "Windows Networking" },
    { port: 139, protocol: "TCP", service: "NetBIOS-SSN", description: "NetBIOS Session Service", category: "Windows Networking" },
    { port: 143, protocol: "TCP", service: "IMAP", description: "Internet Message Access Protocol - email retrieval", category: "Email", security: "insecure" },
    { port: 161, protocol: "UDP", service: "SNMP", description: "Simple Network Management Protocol", category: "Network Management" },
    { port: 162, protocol: "UDP", service: "SNMP-Trap", description: "SNMP Trap (notifications)", category: "Network Management" },
    { port: 179, protocol: "TCP", service: "BGP", description: "Border Gateway Protocol - internet routing", category: "Network Infrastructure" },
    { port: 194, protocol: "TCP", service: "IRC", description: "Internet Relay Chat", category: "Communication" },
    { port: 389, protocol: "TCP/UDP", service: "LDAP", description: "Lightweight Directory Access Protocol", category: "Directory Services" },
    { port: 443, protocol: "TCP", service: "HTTPS", description: "HTTP Secure - encrypted web traffic (TLS/SSL)", category: "Web", security: "secure" },
    { port: 445, protocol: "TCP", service: "SMB", description: "Server Message Block - Windows file sharing", category: "Windows Networking" },
    { port: 465, protocol: "TCP", service: "SMTPS", description: "SMTP over SSL (deprecated, use 587)", category: "Email", security: "secure" },
    { port: 514, protocol: "UDP", service: "Syslog", description: "System logging protocol", category: "Logging" },
    { port: 515, protocol: "TCP", service: "LPD", description: "Line Printer Daemon - printing", category: "Printing" },
    { port: 587, protocol: "TCP", service: "SMTP-Submit", description: "Email message submission (STARTTLS)", category: "Email", security: "secure" },
    { port: 636, protocol: "TCP", service: "LDAPS", description: "LDAP over SSL", category: "Directory Services", security: "secure" },
    { port: 993, protocol: "TCP", service: "IMAPS", description: "IMAP over SSL", category: "Email", security: "secure" },
    { port: 995, protocol: "TCP", service: "POP3S", description: "POP3 over SSL", category: "Email", security: "secure" },

    // Registered Ports (1024-49151)
    { port: 1080, protocol: "TCP", service: "SOCKS", description: "SOCKS proxy protocol", category: "Proxy" },
    { port: 1194, protocol: "UDP", service: "OpenVPN", description: "OpenVPN tunneling", category: "VPN", security: "secure" },
    { port: 1433, protocol: "TCP", service: "MSSQL", description: "Microsoft SQL Server", category: "Database" },
    { port: 1434, protocol: "UDP", service: "MSSQL-M", description: "Microsoft SQL Server Browser", category: "Database" },
    { port: 1521, protocol: "TCP", service: "Oracle", description: "Oracle Database listener", category: "Database" },
    { port: 1723, protocol: "TCP", service: "PPTP", description: "Point-to-Point Tunneling Protocol", category: "VPN" },
    { port: 2049, protocol: "TCP/UDP", service: "NFS", description: "Network File System", category: "File Transfer" },
    { port: 2082, protocol: "TCP", service: "cPanel", description: "cPanel control panel (HTTP)", category: "Web Hosting" },
    { port: 2083, protocol: "TCP", service: "cPanel SSL", description: "cPanel control panel (HTTPS)", category: "Web Hosting", security: "secure" },
    { port: 2181, protocol: "TCP", service: "Zookeeper", description: "Apache Zookeeper client", category: "Distributed Systems" },
    { port: 3000, protocol: "TCP", service: "Dev Server", description: "Common development server (Node.js, React, Rails)", category: "Development" },
    { port: 3306, protocol: "TCP", service: "MySQL", description: "MySQL/MariaDB database", category: "Database" },
    { port: 3389, protocol: "TCP", service: "RDP", description: "Remote Desktop Protocol", category: "Remote Access" },
    { port: 3478, protocol: "TCP/UDP", service: "STUN", description: "Session Traversal Utilities for NAT", category: "VoIP" },
    { port: 4000, protocol: "TCP", service: "Dev Server", description: "Common development server", category: "Development" },
    { port: 4443, protocol: "TCP", service: "Alt-HTTPS", description: "Alternative HTTPS port", category: "Web", security: "secure" },
    { port: 5000, protocol: "TCP", service: "Dev Server", description: "Flask, Docker Registry, development servers", category: "Development" },
    { port: 5060, protocol: "TCP/UDP", service: "SIP", description: "Session Initiation Protocol (VoIP)", category: "VoIP" },
    { port: 5061, protocol: "TCP", service: "SIPS", description: "SIP over TLS", category: "VoIP", security: "secure" },
    { port: 5432, protocol: "TCP", service: "PostgreSQL", description: "PostgreSQL database", category: "Database" },
    { port: 5672, protocol: "TCP", service: "AMQP", description: "Advanced Message Queuing Protocol (RabbitMQ)", category: "Message Queue" },
    { port: 5900, protocol: "TCP", service: "VNC", description: "Virtual Network Computing", category: "Remote Access" },
    { port: 5984, protocol: "TCP", service: "CouchDB", description: "Apache CouchDB", category: "Database" },
    { port: 6379, protocol: "TCP", service: "Redis", description: "Redis in-memory data store", category: "Database" },
    { port: 6443, protocol: "TCP", service: "Kubernetes API", description: "Kubernetes API server", category: "Container Orchestration", security: "secure" },
    { port: 6660, protocol: "TCP", service: "IRC", description: "IRC (alternative)", category: "Communication" },
    { port: 6667, protocol: "TCP", service: "IRC", description: "IRC (common)", category: "Communication" },
    { port: 6697, protocol: "TCP", service: "IRC-SSL", description: "IRC over SSL", category: "Communication", security: "secure" },
    { port: 7000, protocol: "TCP", service: "Cassandra", description: "Apache Cassandra inter-node", category: "Database" },
    { port: 7001, protocol: "TCP", service: "WebLogic", description: "Oracle WebLogic Server", category: "Application Server" },
    { port: 8000, protocol: "TCP", service: "HTTP Alt", description: "Alternative HTTP (Python SimpleHTTPServer, Django)", category: "Development" },
    { port: 8008, protocol: "TCP", service: "HTTP Alt", description: "Alternative HTTP", category: "Development" },
    { port: 8080, protocol: "TCP", service: "HTTP Proxy", description: "HTTP proxy, Tomcat, development servers", category: "Web" },
    { port: 8081, protocol: "TCP", service: "HTTP Alt", description: "Alternative HTTP, Nexus Repository", category: "Development" },
    { port: 8088, protocol: "TCP", service: "HTTP Alt", description: "Alternative HTTP", category: "Development" },
    { port: 8443, protocol: "TCP", service: "HTTPS Alt", description: "Alternative HTTPS, Tomcat SSL", category: "Web", security: "secure" },
    { port: 8888, protocol: "TCP", service: "HTTP Alt", description: "Alternative HTTP, Jupyter Notebook", category: "Development" },
    { port: 9000, protocol: "TCP", service: "PHP-FPM", description: "PHP FastCGI Process Manager, SonarQube", category: "Development" },
    { port: 9042, protocol: "TCP", service: "Cassandra CQL", description: "Cassandra Query Language native", category: "Database" },
    { port: 9090, protocol: "TCP", service: "Prometheus", description: "Prometheus monitoring", category: "Monitoring" },
    { port: 9092, protocol: "TCP", service: "Kafka", description: "Apache Kafka broker", category: "Message Queue" },
    { port: 9200, protocol: "TCP", service: "Elasticsearch", description: "Elasticsearch HTTP", category: "Search/Database" },
    { port: 9300, protocol: "TCP", service: "Elasticsearch", description: "Elasticsearch transport", category: "Search/Database" },
    { port: 9418, protocol: "TCP", service: "Git", description: "Git protocol", category: "Version Control" },
    { port: 10000, protocol: "TCP", service: "Webmin", description: "Webmin web-based admin", category: "System Administration" },
    { port: 11211, protocol: "TCP", service: "Memcached", description: "Memcached caching", category: "Cache" },
    { port: 15672, protocol: "TCP", service: "RabbitMQ", description: "RabbitMQ management UI", category: "Message Queue" },
    { port: 27017, protocol: "TCP", service: "MongoDB", description: "MongoDB database", category: "Database" },
    { port: 27018, protocol: "TCP", service: "MongoDB Shard", description: "MongoDB shardsvr", category: "Database" },
    { port: 27019, protocol: "TCP", service: "MongoDB Config", description: "MongoDB configsvr", category: "Database" },
];

// Get unique categories
const CATEGORIES = [...new Set(PORT_DATABASE.map(p => p.category))].sort();

// ─── Component ───────────────────────────────────────────────────────

export default function PortReferencePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [protocolFilter, setProtocolFilter] = useState<string>("all");
    const [securityFilter, setSecurityFilter] = useState<string>("all");
    const [portLookup, setPortLookup] = useState("");

    const filteredPorts = useMemo(() => {
        return PORT_DATABASE.filter(port => {
            // Text search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesText =
                    port.service.toLowerCase().includes(query) ||
                    port.description.toLowerCase().includes(query) ||
                    port.port.toString().includes(query);
                if (!matchesText) return false;
            }

            // Category filter
            if (categoryFilter !== "all" && port.category !== categoryFilter) return false;

            // Protocol filter
            if (protocolFilter !== "all" && !port.protocol.includes(protocolFilter)) return false;

            // Security filter
            if (securityFilter !== "all") {
                if (securityFilter === "secure" && port.security !== "secure") return false;
                if (securityFilter === "insecure" && port.security !== "insecure") return false;
            }

            return true;
        });
    }, [searchQuery, categoryFilter, protocolFilter, securityFilter]);

    const lookedUpPort = useMemo(() => {
        const num = parseInt(portLookup, 10);
        if (isNaN(num)) return null;
        return PORT_DATABASE.find(p => p.port === num);
    }, [portLookup]);

    const columns = [
        {
            title: "Port",
            dataIndex: "port",
            key: "port",
            width: 80,
            sorter: (a: PortInfo, b: PortInfo) => a.port - b.port,
            render: (port: number) => <Text code strong>{port}</Text>
        },
        {
            title: "Protocol",
            dataIndex: "protocol",
            key: "protocol",
            width: 100,
            render: (protocol: string) => (
                <Tag color={protocol.includes("UDP") ? "orange" : "blue"}>{protocol}</Tag>
            )
        },
        {
            title: "Service",
            dataIndex: "service",
            key: "service",
            width: 140,
            render: (service: string, record: PortInfo) => (
                <Space>
                    <Text strong>{service}</Text>
                    {record.security === "secure" && (
                        <Badge status="success" />
                    )}
                    {record.security === "insecure" && (
                        <Badge status="error" />
                    )}
                </Space>
            )
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: 160,
            render: (category: string) => <Tag>{category}</Tag>
        },
    ];

    return (
        <ToolPageLayout
            title="Port Number Reference"
            description="Comprehensive reference of common network ports, protocols, and services"
            icon={<GlobalOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: "The Port Number Reference is a comprehensive database of TCP and UDP network ports used by common services and applications. Ports are 16-bit numbers (0-65535) that identify specific processes or services on a networked computer. This reference covers well-known ports (0-1023), registered ports (1024-49151), and common application-specific ports.",
                whyUse: "Understanding port numbers is essential for network security, firewall configuration, and troubleshooting connectivity issues. This reference helps you quickly identify what service uses a particular port, whether it's secure or insecure, and what category of application it belongs to. It's invaluable for security audits, penetration testing, and network administration.",
                howToUse: [
                    "Use Quick Lookup to find a specific port number instantly",
                    "Search by service name, port number, or description",
                    "Filter by category (Database, Web, Email, etc.)",
                    "Filter by protocol (TCP, UDP, or both)",
                    "Filter by security status to identify insecure protocols",
                    "Click column headers to sort the results"
                ],
                tips: [
                    "Ports below 1024 are 'privileged' and require root/admin on Unix systems",
                    "HTTP (80) should redirect to HTTPS (443) - avoid plain HTTP in production",
                    "Development ports (3000, 5000, 8080) should be blocked in firewalls",
                    "Some ports have both TCP and UDP versions (like DNS on 53)",
                    "Ephemeral/dynamic ports (49152-65535) are used for client connections"
                ],
                useCases: [
                    "Configuring firewall rules and security groups",
                    "Troubleshooting network connectivity issues",
                    "Security audits and penetration testing",
                    "Understanding application network requirements",
                    "Learning networking fundamentals for certifications"
                ]
            }}
        >
            <Row gutter={[16, 16]}>
                {/* Quick Lookup */}
                <Col xs={24}>
                    <Card title="Quick Port Lookup" size="small">
                        <Row gutter={16} align="middle">
                            <Col xs={24} md={8}>
                                <Input
                                    size="large"
                                    placeholder="Enter port number (e.g., 443)"
                                    value={portLookup}
                                    onChange={(e) => setPortLookup(e.target.value)}
                                    prefix={<SearchOutlined />}
                                    type="number"
                                />
                            </Col>
                            <Col xs={24} md={16}>
                                {lookedUpPort ? (
                                    <Descriptions size="small" column={{ xs: 1, sm: 2, md: 4 }}>
                                        <Descriptions.Item label="Port">
                                            <Text code strong>{lookedUpPort.port}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Protocol">
                                            <Tag color={lookedUpPort.protocol.includes("UDP") ? "orange" : "blue"}>
                                                {lookedUpPort.protocol}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Service">
                                            <Space>
                                                <Text strong>{lookedUpPort.service}</Text>
                                                {lookedUpPort.security === "secure" && <Tag color="success">Secure</Tag>}
                                                {lookedUpPort.security === "insecure" && <Tag color="error">Insecure</Tag>}
                                            </Space>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Category">
                                            <Tag>{lookedUpPort.category}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Description" span={4}>
                                            {lookedUpPort.description}
                                        </Descriptions.Item>
                                    </Descriptions>
                                ) : portLookup ? (
                                    <Alert
                                        type="info"
                                        message={`Port ${portLookup} is not in our database`}
                                        description="This might be an ephemeral port (49152-65535), a custom application port, or an unregistered port."
                                    />
                                ) : null}
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Filters */}
                <Col xs={24}>
                    <Card size="small">
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} md={8}>
                                <Input
                                    placeholder="Search ports, services, descriptions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    prefix={<SearchOutlined />}
                                    allowClear
                                />
                            </Col>
                            <Col xs={12} md={5}>
                                <Select
                                    value={categoryFilter}
                                    onChange={setCategoryFilter}
                                    style={{ width: "100%" }}
                                    placeholder="Category"
                                >
                                    <Option value="all">All Categories</Option>
                                    {CATEGORIES.map(cat => (
                                        <Option key={cat} value={cat}>{cat}</Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={12} md={4}>
                                <Select
                                    value={protocolFilter}
                                    onChange={setProtocolFilter}
                                    style={{ width: "100%" }}
                                    placeholder="Protocol"
                                >
                                    <Option value="all">All Protocols</Option>
                                    <Option value="TCP">TCP</Option>
                                    <Option value="UDP">UDP</Option>
                                </Select>
                            </Col>
                            <Col xs={12} md={4}>
                                <Select
                                    value={securityFilter}
                                    onChange={setSecurityFilter}
                                    style={{ width: "100%" }}
                                    placeholder="Security"
                                >
                                    <Option value="all">All</Option>
                                    <Option value="secure">🔒 Secure Only</Option>
                                    <Option value="insecure">⚠️ Insecure Only</Option>
                                </Select>
                            </Col>
                            <Col xs={12} md={3}>
                                <Text type="secondary">{filteredPorts.length} ports</Text>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Port Table */}
                <Col xs={24}>
                    <Card size="small">
                        <Table
                            dataSource={filteredPorts}
                            columns={columns}
                            rowKey="port"
                            pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => `${total} ports` }}
                            size="small"
                            scroll={{ x: 800 }}
                        />
                    </Card>
                </Col>

                {/* Port Ranges Info */}
                <Col xs={24}>
                    <Card title="Port Number Ranges" size="small">
                        <Descriptions column={{ xs: 1, sm: 3 }} size="small" bordered>
                            <Descriptions.Item label="Well-Known Ports">
                                <Space direction="vertical">
                                    <Text code>0 - 1023</Text>
                                    <Text type="secondary">System/root ports. Require elevated privileges.</Text>
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Registered Ports">
                                <Space direction="vertical">
                                    <Text code>1024 - 49151</Text>
                                    <Text type="secondary">User/application ports. IANA registered services.</Text>
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Dynamic/Ephemeral">
                                <Space direction="vertical">
                                    <Text code>49152 - 65535</Text>
                                    <Text type="secondary">Private/temporary ports. Client-side connections.</Text>
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
