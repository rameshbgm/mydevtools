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
    Tabs,
    Table,
    Spin,
    Tag,
    Select,
    Alert,
    Empty,
    Tooltip,
    Descriptions,
    Badge,
    InputNumber,
    Collapse,
    Segmented,
    Switch,
} from "antd";
import { messageService as message } from "@/lib/messageService";
import {
    BlockOutlined,
    SendOutlined,
    CopyOutlined,
    LinkOutlined,
    HistoryOutlined,
    ClockCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
    FileTextOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import SslConfigSection, { DEFAULT_SSL_CONFIG, buildSslProxyFields, type SslConfig } from "@/components/SslConfigSection";
import { copyToClipboard as sharedCopy } from "@/lib/clipboard";

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// ─── Types ───────────────────────────────────────────────────────────

interface SoapHeader {
    key: string;
    value: string;
    enabled: boolean;
}

interface SoapRequest {
    id: string;
    timestamp: Date;
    endpoint: string;
    soapAction: string;
    body: string;
    response?: string;
    status?: number;
    duration?: number;
    error?: string;
}

interface WSDLOperation {
    name: string;
    soapAction?: string;
    inputMessage?: string;
}

// ─── Sample Data ─────────────────────────────────────────────────────

const SAMPLE_ENDPOINT = "https://www.dataaccess.com/webservicesserver/NumberConversion.wso";
const SAMPLE_SOAP_ACTION = "http://www.dataaccess.com/webservicesserver/NumberToDollars";

const SAMPLE_SOAP_REQUEST = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:web="http://www.dataaccess.com/webservicesserver/">
    <soap:Header/>
    <soap:Body>
        <web:NumberToDollars>
            <web:dNum>1234.56</web:dNum>
        </web:NumberToDollars>
    </soap:Body>
</soap:Envelope>`;

const SOAP_TEMPLATES = {
    basic: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Header/>
    <soap:Body>
        <!-- Add your request here -->
    </soap:Body>
</soap:Envelope>`,

    soap12: `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Header/>
    <soap12:Body>
        <!-- Add your request here -->
    </soap12:Body>
</soap12:Envelope>`,

    withSecurity: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
    <soap:Header>
        <wsse:Security>
            <wsse:UsernameToken>
                <wsse:Username>YOUR_USERNAME</wsse:Username>
                <wsse:Password>YOUR_PASSWORD</wsse:Password>
            </wsse:UsernameToken>
        </wsse:Security>
    </soap:Header>
    <soap:Body>
        <!-- Add your request here -->
    </soap:Body>
</soap:Envelope>`,
};

// ─── Utils ───────────────────────────────────────────────────────────

function formatXml(xml: string): string {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");
        const serializer = new XMLSerializer();
        const formatted = serializer.serializeToString(doc);

        // Simple formatting
        let indent = 0;
        const lines: string[] = [];
        const tokens = formatted.replace(/>\s*</g, ">\n<").split("\n");

        for (const token of tokens) {
            if (token.match(/^<\//)) indent--;
            lines.push("  ".repeat(Math.max(0, indent)) + token.trim());
            if (token.match(/^<[^/!?]/) && !token.match(/\/>$/)) indent++;
        }

        return lines.join("\n");
    } catch {
        return xml;
    }
}

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// ─── Component ───────────────────────────────────────────────────────

export default function SoapClientPage() {
    const [endpoint, setEndpoint] = useState(SAMPLE_ENDPOINT);
    const [soapAction, setSoapAction] = useState(SAMPLE_SOAP_ACTION);
    const [soapVersion, setSoapVersion] = useState<"1.1" | "1.2">("1.1");
    const [requestBody, setRequestBody] = useState(SAMPLE_SOAP_REQUEST);
    const [responseBody, setResponseBody] = useState("");
    const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [timeout, setTimeout] = useState(30);
    const [status, setStatus] = useState<number | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<SoapRequest[]>([]);
    const [activeTab, setActiveTab] = useState("request");

    // Custom headers
    const [headers, setHeaders] = useState<SoapHeader[]>([
        { key: "Content-Type", value: "text/xml; charset=utf-8", enabled: true },
    ]);
    const [headerMode, setHeaderMode] = useState<"form" | "json">("form");
    const [headerJson, setHeaderJson] = useState("{}");

    // SSL/TLS configuration (proxied requests)
    const [sslConfig, setSslConfig] = useState<SslConfig>(DEFAULT_SSL_CONFIG);
    const [useProxy, setUseProxy] = useState(false);

    const soapHeadersToJson = (hdrs: SoapHeader[]): string => {
        const obj: Record<string, string> = {};
        hdrs.filter(h => h.enabled && h.key).forEach(h => { obj[h.key] = h.value; });
        return Object.keys(obj).length === 0 ? "{}" : JSON.stringify(obj, null, 2);
    };

    const jsonToSoapHeaders = (json: string): SoapHeader[] | null => {
        try {
            const obj = JSON.parse(json);
            if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return null;
            return Object.entries(obj).map(([key, value]) => ({ key, value: String(value), enabled: true }));
        } catch {
            return null;
        }
    };

    const switchHeaderMode = (mode: "form" | "json") => {
        if (mode === "json") setHeaderJson(soapHeadersToJson(headers));
        else {
            const parsed = jsonToSoapHeaders(headerJson);
            if (parsed !== null) setHeaders(parsed);
        }
        setHeaderMode(mode);
    };

    // Send SOAP request
    const handleSend = async () => {
        if (!endpoint.trim()) {
            message.warning("Please enter an endpoint URL");
            return;
        }

        if (!requestBody.trim()) {
            message.warning("Please enter a SOAP request body");
            return;
        }

        setLoading(true);
        setError(null);
        setResponseBody("");
        setStatus(null);
        setDuration(null);

        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), timeout * 1000);

        try {
            // Build headers
            const requestHeaders: Record<string, string> = {};
            headers.filter(h => h.enabled && h.key).forEach(h => {
                requestHeaders[h.key] = h.value;
            });

            // Set Content-Type based on SOAP version
            if (!requestHeaders["Content-Type"]) {
                requestHeaders["Content-Type"] = soapVersion === "1.2"
                    ? "application/soap+xml; charset=utf-8"
                    : "text/xml; charset=utf-8";
            }

            // Add SOAPAction header for SOAP 1.1
            if (soapVersion === "1.1" && soapAction) {
                requestHeaders["SOAPAction"] = `"${soapAction}"`;
            }

            // Auto-route through the server proxy when the user has any SSL config set
            // (verify toggle, custom CA, or mTLS certs) — those only apply server-side.
            const sslConfigured = sslConfig.sslVerify || !!sslConfig.sslCaCert.trim() ||
                !!sslConfig.sslClientCert.trim() || !!sslConfig.sslClientKey.trim();
            const shouldProxy = useProxy || sslConfigured;

            let respStatus: number;
            let respText: string;
            const respHeaders: Record<string, string> = {};

            if (shouldProxy) {
                const proxyRes = await fetch("/api/proxy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        url: endpoint,
                        method: "POST",
                        headers: requestHeaders,
                        body: requestBody,
                        bodyIsBase64: false,
                        timeout: timeout * 1000,
                        followRedirects: true,
                        ...buildSslProxyFields(sslConfig),
                    }),
                    signal: controller.signal,
                });
                const data = await proxyRes.json();
                if (data.error) throw new Error(data.error);
                respStatus = data.status ?? 0;
                respText = data.bodyIsBase64
                    ? atob(data.body)
                    : (data.body ?? "");
                Object.assign(respHeaders, data.headers ?? {});
            } else {
                try {
                    const response = await fetch(endpoint, {
                        method: "POST",
                        headers: requestHeaders,
                        body: requestBody,
                        signal: controller.signal,
                    });
                    respStatus = response.status;
                    respText = await response.text();
                    response.headers.forEach((value, key) => { respHeaders[key] = value; });
                } catch (corsErr) {
                    if (!(corsErr instanceof TypeError)) throw corsErr;
                    // CORS or network error — transparently retry through the server proxy
                    const proxyRes = await fetch("/api/proxy", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            url: endpoint,
                            method: "POST",
                            headers: requestHeaders,
                            body: requestBody,
                            bodyIsBase64: false,
                            timeout: timeout * 1000,
                            followRedirects: true,
                            ...buildSslProxyFields(sslConfig),
                        }),
                        signal: controller.signal,
                    });
                    const data = await proxyRes.json();
                    if (data.error) throw new Error(data.error);
                    respStatus = data.status ?? 0;
                    respText = data.bodyIsBase64 ? atob(data.body) : (data.body ?? "");
                    Object.assign(respHeaders, data.headers ?? {});
                }
            }

            clearTimeout(timeoutId);
            const elapsed = Date.now() - startTime;

            const formattedResponse = formatXml(respText);

            setStatus(respStatus);
            setDuration(elapsed);
            setResponseBody(formattedResponse);
            setResponseHeaders(respHeaders);

            // Add to history
            const historyEntry: SoapRequest = {
                id: generateId(),
                timestamp: new Date(),
                endpoint,
                soapAction,
                body: requestBody,
                response: formattedResponse,
                status: respStatus,
                duration: elapsed,
            };
            setHistory(prev => [historyEntry, ...prev.slice(0, 49)]);

            if (respStatus >= 200 && respStatus < 300) {
                message.success(`Request completed in ${elapsed}ms${shouldProxy ? " (via proxy)" : ""}`);
            } else {
                message.warning(`Request returned status ${respStatus}`);
            }

            setActiveTab("response");
        } catch (err: any) {
            clearTimeout(timeoutId);
            const elapsed = Date.now() - startTime;

            if (err.name === "AbortError") {
                setError(`Request timed out after ${timeout} seconds`);
            } else {
                setError(err.message || "Request failed");
            }

            setDuration(elapsed);

            // Add to history with error
            const historyEntry: SoapRequest = {
                id: generateId(),
                timestamp: new Date(),
                endpoint,
                soapAction,
                body: requestBody,
                error: err.message,
                duration: elapsed,
            };
            setHistory(prev => [historyEntry, ...prev.slice(0, 49)]);

            message.error("Request failed: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    // Add header
    const addHeader = () => {
        setHeaders(prev => [...prev, { key: "", value: "", enabled: true }]);
    };

    // Update header
    const updateHeader = (index: number, field: keyof SoapHeader, value: string | boolean) => {
        setHeaders(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    // Remove header
    const removeHeader = (index: number) => {
        setHeaders(prev => prev.filter((_, i) => i !== index));
    };

    // Load template
    const loadTemplate = (template: keyof typeof SOAP_TEMPLATES) => {
        setRequestBody(SOAP_TEMPLATES[template]);
    };

    // Load from history
    const loadFromHistory = (entry: SoapRequest) => {
        setEndpoint(entry.endpoint);
        setSoapAction(entry.soapAction);
        setRequestBody(entry.body);
        if (entry.response) {
            setResponseBody(entry.response);
        }
        message.success("Loaded from history");
    };

    // Copy to clipboard
    const copyToClipboard = (text: string, label: string) => sharedCopy(text, `${label} copied!`);

    // Generate cURL command
    const generateCurl = useMemo(() => {
        const headerArgs = headers
            .filter(h => h.enabled && h.key)
            .map(h => `-H '${h.key}: ${h.value}'`)
            .join(" \\\n  ");

        const soapActionHeader = soapVersion === "1.1" && soapAction
            ? `-H 'SOAPAction: "${soapAction}"' \\\n  `
            : "";

        return `curl -X POST '${endpoint}' \\
  -H 'Content-Type: ${soapVersion === "1.2" ? "application/soap+xml" : "text/xml"}; charset=utf-8' \\
  ${soapActionHeader}${headerArgs ? headerArgs + " \\\n  " : ""}-d '${requestBody.replace(/'/g, "'\\''")}'`;
    }, [endpoint, soapAction, soapVersion, requestBody, headers]);

    return (
        <ToolPageLayout
            title="SOAP Client"
            description="Test SOAP web services by sending requests and viewing responses"
            icon={<BlockOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs: "SOAP (Simple Object Access Protocol) Client is a powerful testing tool for interacting with SOAP-based web services. SOAP is an XML-based protocol used for exchanging structured information between applications over a network. This tool allows you to construct SOAP envelopes, send requests to SOAP endpoints, and analyze the responses - all without writing any code.",
                whyUse: "When integrating with enterprise systems, legacy applications, or government services, you'll often encounter SOAP web services. This tool helps you debug integration issues, test WSDL operations before implementation, verify service responses, and understand the XML message structure. It's essential for developers working with banking APIs, ERP systems, healthcare integrations (HL7), and other enterprise services that still rely on SOAP.",
                howToUse: [
                    "Enter the SOAP endpoint URL (usually ends with ?wsdl or .asmx for .NET services)",
                    "Select the SOAP version (1.1 or 1.2) - check your WSDL for the correct version",
                    "For SOAP 1.1, provide the SOAPAction header value (found in your WSDL operation binding)",
                    "Use a template or write your SOAP envelope in the request editor",
                    "Add any custom headers if required (authentication tokens, API keys, etc.)",
                    "Click Send to execute the request and view the response",
                    "Use the History tab to replay or compare previous requests"
                ],
                tips: [
                    "Use the WS-Security template for services requiring username/password authentication",
                    "SOAP 1.2 doesn't require a SOAPAction header - it's embedded in the Content-Type",
                    "Check response headers for debugging info like server version and error details",
                    "Copy the cURL command to share requests with team members or use in scripts",
                    "The timeout setting is crucial for slow services - increase it for complex operations"
                ],
                useCases: [
                    "Testing enterprise integrations (SAP, Oracle, Salesforce SOAP APIs)",
                    "Debugging SOAP service connectivity issues in development",
                    "Validating WSDL operations before implementing client code",
                    "Comparing responses between different SOAP service versions",
                    "Learning SOAP protocol structure for new developers"
                ]
            }}
        >
            <Row gutter={[16, 16]}>
                {/* Request Configuration */}
                <Col xs={24}>
                    <Card size="small">
                        <Row gutter={[12, 12]} align="middle">
                            <Col flex="1">
                                <Input
                                    size="large"
                                    placeholder="Enter SOAP endpoint URL..."
                                    value={endpoint}
                                    onChange={(e) => setEndpoint(e.target.value)}
                                    prefix={<LinkOutlined />}
                                />
                            </Col>
                            <Col>
                                <Select
                                    value={soapVersion}
                                    onChange={setSoapVersion}
                                    style={{ width: 100 }}
                                >
                                    <Option value="1.1">SOAP 1.1</Option>
                                    <Option value="1.2">SOAP 1.2</Option>
                                </Select>
                            </Col>
                            <Col>
                                <Tooltip title={`Timeout: ${timeout}s`}>
                                    <Space.Compact>
                                        <InputNumber
                                            min={5}
                                            max={120}
                                            value={timeout}
                                            onChange={(v) => setTimeout(v || 30)}
                                            style={{ width: 80 }}
                                        />
                                        <Button disabled style={{ pointerEvents: "none" }}>s</Button>
                                    </Space.Compact>
                                </Tooltip>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SendOutlined />}
                                    onClick={handleSend}
                                    loading={loading}
                                    style={{ backgroundColor: "#fa541c", borderColor: "#fa541c" }}
                                >
                                    Send
                                </Button>
                            </Col>
                        </Row>

                        {soapVersion === "1.1" && (
                            <div style={{ marginTop: 12 }}>
                                <Space.Compact style={{ width: "100%" }}>
                                    <Button disabled style={{ pointerEvents: "none" }}>SOAPAction</Button>
                                    <Input
                                        placeholder="SOAPAction header (for SOAP 1.1)"
                                        value={soapAction}
                                        onChange={(e) => setSoapAction(e.target.value)}
                                    />
                                </Space.Compact>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Request Panel */}
                <Col xs={24} lg={12}>
                    <Card
                        title="Request"
                        extra={
                            <Space>
                                <Select
                                    placeholder="Load template"
                                    size="small"
                                    style={{ width: 140 }}
                                    onChange={loadTemplate}
                                    value={undefined}
                                >
                                    <Option value="basic">SOAP 1.1 Basic</Option>
                                    <Option value="soap12">SOAP 1.2</Option>
                                    <Option value="withSecurity">WS-Security</Option>
                                </Select>
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(requestBody, "Request")}
                                >
                                    Copy
                                </Button>
                            </Space>
                        }
                    >
                        <Tabs
                            size="small"
                            items={[
                                {
                                    key: "body",
                                    label: "Body",
                                    children: (
                                        <CodeEditor
                                            value={requestBody}
                                            onChange={(v) => setRequestBody(v || "")}
                                            language="xml"
                                            height={350}
                                        />
                                    ),
                                },
                                {
                                    key: "headers",
                                    label: `Headers (${headers.filter(h => h.enabled).length})`,
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 12 }}>
                                                <Segmented
                                                    size="small"
                                                    value={headerMode}
                                                    onChange={(v) => switchHeaderMode(v as "form" | "json")}
                                                    options={[
                                                        { label: "Form", value: "form" },
                                                        { label: "JSON", value: "json" },
                                                    ]}
                                                />
                                            </div>
                                            {headerMode === "form" ? (
                                                <>
                                                    {headers.map((header, index) => (
                                                        <Space key={index} style={{ display: "flex", marginBottom: 8 }}>
                                                            <Input
                                                                placeholder="Header name"
                                                                value={header.key}
                                                                onChange={(e) => updateHeader(index, "key", e.target.value)}
                                                                style={{ width: 200 }}
                                                            />
                                                            <Input
                                                                placeholder="Value"
                                                                value={header.value}
                                                                onChange={(e) => updateHeader(index, "value", e.target.value)}
                                                                style={{ width: 250 }}
                                                            />
                                                            <Button aria-label="Delete"
                                                                type="text"
                                                                danger
                                                                icon={<DeleteOutlined />}
                                                                onClick={() => removeHeader(index)}
                                                            />
                                                        </Space>
                                                    ))}
                                                    <Button type="dashed" icon={<PlusOutlined />} onClick={addHeader} block>
                                                        Add Header
                                                    </Button>
                                                </>
                                            ) : (
                                                <div>
                                                    <Input.TextArea
                                                        value={headerJson}
                                                        onChange={e => {
                                                            setHeaderJson(e.target.value);
                                                            const parsed = jsonToSoapHeaders(e.target.value);
                                                            if (parsed !== null) setHeaders(parsed);
                                                        }}
                                                        rows={6}
                                                        style={{ fontFamily: "monospace", fontSize: 12 }}
                                                        placeholder={'{\n  "Authorization": "Bearer xxx"\n}'}
                                                    />
                                                    <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: "block" }}>
                                                        JSON object — auto-syncs to form when valid
                                                    </Text>
                                                </div>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    key: "ssl",
                                    label: <><SafetyCertificateOutlined /> SSL</>,
                                    children: (
                                        <Space orientation="vertical" size={12} style={{ width: "100%" }}>
                                            <Alert
                                                type="info"
                                                showIcon
                                                title="SSL options apply when the request goes through the server proxy"
                                                description="Enable 'Force server proxy' below to route every request through the proxy, or leave it off and the proxy will be used automatically when you configure any SSL option."
                                                style={{ fontSize: 12 }}
                                            />
                                            <div style={{
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                gap: 12, padding: "4px 0",
                                            }}>
                                                <div>
                                                    <Text strong style={{ fontSize: 13 }}>Force server proxy</Text>
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                                            Always route through /api/proxy (avoids browser CORS for any host).
                                                        </Text>
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={useProxy}
                                                    onChange={setUseProxy}
                                                />
                                            </div>
                                            <SslConfigSection value={sslConfig} onChange={setSslConfig} compact />
                                        </Space>
                                    ),
                                },
                                {
                                    key: "curl",
                                    label: "cURL",
                                    children: (
                                        <div>
                                            <Button
                                                size="small"
                                                icon={<CopyOutlined />}
                                                onClick={() => copyToClipboard(generateCurl, "cURL command")}
                                                style={{ marginBottom: 8 }}
                                            >
                                                Copy cURL
                                            </Button>
                                            <CodeEditor
                                                value={generateCurl}
                                                language="bash"
                                                height={280}
                                                readOnly
                                            />
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>

                {/* Response Panel */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                Response
                                {status !== null && (
                                    <Tag color={status >= 200 && status < 300 ? "success" : "error"}>
                                        {status}
                                    </Tag>
                                )}
                                {duration !== null && (
                                    <Tag icon={<ClockCircleOutlined />}>{duration}ms</Tag>
                                )}
                            </Space>
                        }
                        extra={
                            responseBody && (
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(responseBody, "Response")}
                                >
                                    Copy
                                </Button>
                            )
                        }
                    >
                        {loading && (
                            <div style={{ textAlign: "center", padding: 40 }}>
                                <Spin size="large" />
                                <div style={{ marginTop: 16 }}>Sending request...</div>
                            </div>
                        )}

                        {error && !loading && (
                            <Alert
                                type="error"
                                title="Request Failed"
                                description={error}
                                showIcon
                            />
                        )}

                        {responseBody && !loading && (
                            <Tabs
                                size="small"
                                items={[
                                    {
                                        key: "body",
                                        label: "Body",
                                        children: (
                                            <CodeEditor
                                                value={responseBody}
                                                language="xml"
                                                height={350}
                                                readOnly
                                            />
                                        ),
                                    },
                                    {
                                        key: "headers",
                                        label: `Headers (${Object.keys(responseHeaders).length})`,
                                        children: (
                                            <Descriptions column={1} size="small" bordered>
                                                {Object.entries(responseHeaders).map(([key, value]) => (
                                                    <Descriptions.Item key={key} label={key}>
                                                        <Text code copyable>{value}</Text>
                                                    </Descriptions.Item>
                                                ))}
                                            </Descriptions>
                                        ),
                                    },
                                ]}
                            />
                        )}

                        {!responseBody && !loading && !error && (
                            <Empty description="Send a request to see the response" />
                        )}
                    </Card>
                </Col>

                {/* History */}
                <Col xs={24}>
                    <Collapse
                        items={[
                            {
                                key: "history",
                                label: (
                                    <Space>
                                        <HistoryOutlined />
                                        Request History
                                        <Badge count={history.length} />
                                    </Space>
                                ),
                                children: history.length > 0 ? (
                                    <Table
                                        size="small"
                                        dataSource={history.map((h, i) => ({ ...h, key: i }))}
                                        columns={[
                                            {
                                                title: "Time",
                                                dataIndex: "timestamp",
                                                width: 180,
                                                render: (ts) => new Date(ts).toLocaleString(),
                                            },
                                            {
                                                title: "Endpoint",
                                                dataIndex: "endpoint",
                                                ellipsis: true,
                                            },
                                            {
                                                title: "Status",
                                                dataIndex: "status",
                                                width: 80,
                                                render: (status, record) =>
                                                    record.error ? (
                                                        <Tag color="error">Error</Tag>
                                                    ) : (
                                                        <Tag color={status >= 200 && status < 300 ? "success" : "warning"}>
                                                            {status}
                                                        </Tag>
                                                    ),
                                            },
                                            {
                                                title: "Duration",
                                                dataIndex: "duration",
                                                width: 100,
                                                render: (d) => d && `${d}ms`,
                                            },
                                            {
                                                title: "Actions",
                                                width: 100,
                                                render: (_, record) => (
                                                    <Button
                                                        size="small"
                                                        type="link"
                                                        onClick={() => loadFromHistory(record)}
                                                    >
                                                        Load
                                                    </Button>
                                                ),
                                            },
                                        ]}
                                        pagination={{ pageSize: 5, size: "small" }}
                                    />
                                ) : (
                                    <Empty description="No request history" />
                                ),
                            },
                        ]}
                    />
                </Col>
            </Row>

            {/* Info */}
            <Card size="small" style={{ marginTop: 16 }}>
                <Row gutter={[16, 8]}>
                    <Col span={24}>
                        <Title level={5} style={{ margin: 0 }}>
                            <FileTextOutlined /> Quick Tips
                        </Title>
                    </Col>
                    <Col xs={24} md={8}>
                        <Text type="secondary">
                            <strong>SOAP 1.1:</strong> Uses text/xml content type and SOAPAction header
                        </Text>
                    </Col>
                    <Col xs={24} md={8}>
                        <Text type="secondary">
                            <strong>SOAP 1.2:</strong> Uses application/soap+xml content type
                        </Text>
                    </Col>
                    <Col xs={24} md={8}>
                        <Text type="secondary">
                            <strong>WS-Security:</strong> Load the security template and add credentials
                        </Text>
                    </Col>
                </Row>
            </Card>
        </ToolPageLayout>
    );
}
