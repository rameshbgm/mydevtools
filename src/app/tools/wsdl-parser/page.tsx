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
    Tag,
    Tree,
    Collapse,
    Descriptions,
    Alert,
    Empty,
    Divider,
} from "antd";
import { messageService as message } from "@/lib/messageService";
import {
    CloudOutlined,
    LinkOutlined,
    CopyOutlined,
    DownloadOutlined,
    ApiOutlined,
    FunctionOutlined,
    DatabaseOutlined,
    FileTextOutlined,
    BranchesOutlined,
} from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

// ─── Types ───────────────────────────────────────────────────────────

interface WSDLPort {
    name: string;
    binding: string;
    address: string;
}

interface WSDLService {
    name: string;
    documentation?: string;
    ports: WSDLPort[];
}

interface WSDLOperation {
    name: string;
    documentation?: string;
    input?: string;
    output?: string;
    faults: string[];
    soapAction?: string;
}

interface WSDLBinding {
    name: string;
    type: string;
    style?: string;
    transport?: string;
    operations: WSDLOperation[];
}

interface WSDLPortType {
    name: string;
    operations: WSDLOperation[];
}

interface WSDLMessage {
    name: string;
    parts: { name: string; element?: string; type?: string }[];
}

interface WSDLType {
    name: string;
    type: "element" | "complexType" | "simpleType";
    content?: string;
}

interface ParsedWSDL {
    targetNamespace: string;
    services: WSDLService[];
    bindings: WSDLBinding[];
    portTypes: WSDLPortType[];
    messages: WSDLMessage[];
    types: WSDLType[];
    imports: { namespace: string; location?: string }[];
    rawXml: string;
}

// ─── Sample WSDL ─────────────────────────────────────────────────────

const SAMPLE_WSDL = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="http://example.com/calculator"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             name="CalculatorService"
             targetNamespace="http://example.com/calculator">

    <types>
        <xsd:schema targetNamespace="http://example.com/calculator">
            <xsd:element name="AddRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="a" type="xsd:int"/>
                        <xsd:element name="b" type="xsd:int"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            <xsd:element name="AddResponse">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="result" type="xsd:int"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:schema>
    </types>

    <message name="AddInput">
        <part name="parameters" element="tns:AddRequest"/>
    </message>
    <message name="AddOutput">
        <part name="parameters" element="tns:AddResponse"/>
    </message>

    <portType name="CalculatorPortType">
        <operation name="Add">
            <documentation>Adds two integers</documentation>
            <input message="tns:AddInput"/>
            <output message="tns:AddOutput"/>
        </operation>
    </portType>

    <binding name="CalculatorBinding" type="tns:CalculatorPortType">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="Add">
            <soap:operation soapAction="http://example.com/calculator/Add"/>
            <input><soap:body use="literal"/></input>
            <output><soap:body use="literal"/></output>
        </operation>
    </binding>

    <service name="CalculatorService">
        <documentation>A simple calculator web service</documentation>
        <port name="CalculatorPort" binding="tns:CalculatorBinding">
            <soap:address location="http://example.com/calculator"/>
        </port>
    </service>
</definitions>`;

// ─── WSDL Parser ─────────────────────────────────────────────────────

function parseWSDL(xmlString: string): ParsedWSDL {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "text/xml");

    // Check for parsing errors
    const parseError = doc.querySelector("parsererror");
    if (parseError) {
        throw new Error("Invalid XML: " + parseError.textContent);
    }

    const root = doc.documentElement;
    const targetNamespace = root.getAttribute("targetNamespace") || "";

    // Helper to get local name without namespace prefix
    const getLocalName = (name: string) => name.includes(":") ? name.split(":")[1] : name;

    // Parse services
    const services: WSDLService[] = [];
    const serviceElements = root.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "service");
    for (let i = 0; i < serviceElements.length; i++) {
        const svc = serviceElements[i];
        const ports: WSDLPort[] = [];
        const portElements = svc.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "port");

        for (let j = 0; j < portElements.length; j++) {
            const port = portElements[j];
            const addressEl = port.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/soap/", "address")[0] ||
                port.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/soap12/", "address")[0];
            ports.push({
                name: port.getAttribute("name") || "",
                binding: getLocalName(port.getAttribute("binding") || ""),
                address: addressEl?.getAttribute("location") || "",
            });
        }

        const docEl = svc.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "documentation")[0];
        services.push({
            name: svc.getAttribute("name") || "",
            documentation: docEl?.textContent || undefined,
            ports,
        });
    }

    // Parse bindings
    const bindings: WSDLBinding[] = [];
    const bindingElements = root.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "binding");
    for (let i = 0; i < bindingElements.length; i++) {
        const binding = bindingElements[i];
        const soapBinding = binding.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/soap/", "binding")[0] ||
            binding.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/soap12/", "binding")[0];

        const operations: WSDLOperation[] = [];
        const opElements = binding.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "operation");

        for (let j = 0; j < opElements.length; j++) {
            const op = opElements[j];
            const soapOp = op.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/soap/", "operation")[0] ||
                op.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/soap12/", "operation")[0];
            operations.push({
                name: op.getAttribute("name") || "",
                soapAction: soapOp?.getAttribute("soapAction") || undefined,
                faults: [],
            });
        }

        bindings.push({
            name: binding.getAttribute("name") || "",
            type: getLocalName(binding.getAttribute("type") || ""),
            style: soapBinding?.getAttribute("style") || undefined,
            transport: soapBinding?.getAttribute("transport") || undefined,
            operations,
        });
    }

    // Parse portTypes
    const portTypes: WSDLPortType[] = [];
    const portTypeElements = root.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "portType");
    for (let i = 0; i < portTypeElements.length; i++) {
        const pt = portTypeElements[i];
        const operations: WSDLOperation[] = [];
        const opElements = pt.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "operation");

        for (let j = 0; j < opElements.length; j++) {
            const op = opElements[j];
            const docEl = op.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "documentation")[0];
            const inputEl = op.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "input")[0];
            const outputEl = op.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "output")[0];
            const faultEls = op.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "fault");

            operations.push({
                name: op.getAttribute("name") || "",
                documentation: docEl?.textContent || undefined,
                input: inputEl ? getLocalName(inputEl.getAttribute("message") || "") : undefined,
                output: outputEl ? getLocalName(outputEl.getAttribute("message") || "") : undefined,
                faults: Array.from(faultEls).map(f => getLocalName(f.getAttribute("message") || "")),
            });
        }

        portTypes.push({
            name: pt.getAttribute("name") || "",
            operations,
        });
    }

    // Parse messages
    const messages: WSDLMessage[] = [];
    const messageElements = root.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "message");
    for (let i = 0; i < messageElements.length; i++) {
        const msg = messageElements[i];
        const parts: { name: string; element?: string; type?: string }[] = [];
        const partElements = msg.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "part");

        for (let j = 0; j < partElements.length; j++) {
            const part = partElements[j];
            parts.push({
                name: part.getAttribute("name") || "",
                element: part.getAttribute("element") ? getLocalName(part.getAttribute("element")!) : undefined,
                type: part.getAttribute("type") ? getLocalName(part.getAttribute("type")!) : undefined,
            });
        }

        messages.push({
            name: msg.getAttribute("name") || "",
            parts,
        });
    }

    // Parse types (simplified)
    const types: WSDLType[] = [];
    const typesEl = root.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "types")[0];
    if (typesEl) {
        const schemas = typesEl.getElementsByTagNameNS("http://www.w3.org/2001/XMLSchema", "schema");
        for (let i = 0; i < schemas.length; i++) {
            const schema = schemas[i];

            // Elements
            const elements = schema.getElementsByTagNameNS("http://www.w3.org/2001/XMLSchema", "element");
            for (let j = 0; j < elements.length; j++) {
                const el = elements[j];
                if (el.parentElement === schema) { // Only top-level elements
                    types.push({
                        name: el.getAttribute("name") || "",
                        type: "element",
                        content: el.outerHTML,
                    });
                }
            }

            // Complex types
            const complexTypes = schema.getElementsByTagNameNS("http://www.w3.org/2001/XMLSchema", "complexType");
            for (let j = 0; j < complexTypes.length; j++) {
                const ct = complexTypes[j];
                if (ct.parentElement === schema && ct.getAttribute("name")) {
                    types.push({
                        name: ct.getAttribute("name") || "",
                        type: "complexType",
                        content: ct.outerHTML,
                    });
                }
            }

            // Simple types
            const simpleTypes = schema.getElementsByTagNameNS("http://www.w3.org/2001/XMLSchema", "simpleType");
            for (let j = 0; j < simpleTypes.length; j++) {
                const st = simpleTypes[j];
                if (st.parentElement === schema && st.getAttribute("name")) {
                    types.push({
                        name: st.getAttribute("name") || "",
                        type: "simpleType",
                        content: st.outerHTML,
                    });
                }
            }
        }
    }

    // Parse imports
    const imports: { namespace: string; location?: string }[] = [];
    const importElements = root.getElementsByTagNameNS("http://schemas.xmlsoap.org/wsdl/", "import");
    for (let i = 0; i < importElements.length; i++) {
        const imp = importElements[i];
        imports.push({
            namespace: imp.getAttribute("namespace") || "",
            location: imp.getAttribute("location") || undefined,
        });
    }

    return {
        targetNamespace,
        services,
        bindings,
        portTypes,
        messages,
        types,
        imports,
        rawXml: xmlString,
    };
}

// ─── Generate Sample Request ─────────────────────────────────────────

function generateSampleRequest(operation: WSDLOperation, messages: WSDLMessage[], targetNs: string): string {
    const inputMsg = messages.find(m => m.name === operation.input);

    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:tns="${targetNs}">
    <soap:Header/>
    <soap:Body>
        <tns:${operation.name}Request>
            <!-- Add parameters here -->
        </tns:${operation.name}Request>
    </soap:Body>
</soap:Envelope>`;
}

// ─── Component ───────────────────────────────────────────────────────

export default function WsdlParserPage() {
    const [wsdlInput, setWsdlInput] = useState(SAMPLE_WSDL);
    const [wsdlUrl, setWsdlUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [parsedWsdl, setParsedWsdl] = useState<ParsedWSDL | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedOperation, setSelectedOperation] = useState<WSDLOperation | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    // Parse WSDL
    const handleParse = () => {
        setError(null);
        setSelectedOperation(null);

        try {
            const parsed = parseWSDL(wsdlInput);
            setParsedWsdl(parsed);
            message.success("WSDL parsed successfully!");
        } catch (err: any) {
            setError(err.message);
            setParsedWsdl(null);
        }
    };

    // Fetch WSDL from URL
    const handleFetchWsdl = async () => {
        if (!wsdlUrl.trim()) {
            message.warning("Please enter a WSDL URL");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(wsdlUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const text = await response.text();
            setWsdlInput(text);

            const parsed = parseWSDL(text);
            setParsedWsdl(parsed);
            message.success("WSDL fetched and parsed!");
        } catch (err: any) {
            setError(`Failed to fetch WSDL: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Build tree data for services
    const treeData = useMemo((): DataNode[] => {
        if (!parsedWsdl) return [];

        return parsedWsdl.services.map(service => ({
            title: <Text strong><ApiOutlined /> {service.name}</Text>,
            key: `service-${service.name}`,
            children: service.ports.map(port => {
                const binding = parsedWsdl.bindings.find(b => b.name === port.binding);
                return {
                    title: <Text><BranchesOutlined /> {port.name}</Text>,
                    key: `port-${port.name}`,
                    children: binding?.operations.map(op => ({
                        title: (
                            <Space>
                                <FunctionOutlined style={{ color: "#52c41a" }} />
                                <Text>{op.name}</Text>
                                {op.soapAction && <Tag style={{ fontSize: 10 }}>SOAP</Tag>}
                            </Space>
                        ),
                        key: `op-${port.name}-${op.name}`,
                        isLeaf: true,
                    })) || [],
                };
            }),
        }));
    }, [parsedWsdl]);

    // Generate sample request for selected operation
    const sampleRequest = useMemo(() => {
        if (!selectedOperation || !parsedWsdl) return "";
        return generateSampleRequest(selectedOperation, parsedWsdl.messages, parsedWsdl.targetNamespace);
    }, [selectedOperation, parsedWsdl]);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copied!`);
    };

    return (
        <ToolPageLayout
            title="WSDL Parser"
            description="Parse and visualize WSDL files for SOAP web services"
            icon={<CloudOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "A WSDL (Web Services Description Language) Parser unwraps SOAP service contracts into their structural building blocks: services, ports, bindings, port types, operations, messages, and the XSD types that flow across the wire. WSDL 1.1 and 2.0 documents are dense XML; this tool surfaces every node so you can read the contract like an API reference.",
                whyUse: "SOAP is still the lingua franca for banking, insurance, healthcare (HL7), tax authorities, and telecom OSS/BSS systems. Even with modern REST replacements, integrating with these services means reading a WSDL — and a 5,000-line XML file is brutal without tooling. This parser saves the back-and-forth between the WSDL, the XSD imports, and your IDE.",
                howToUse: [
                    "Paste a WSDL document into the editor, or enter a remote URL to fetch (CORS permitting)",
                    "Click 'Parse' to load the service tree — services, ports, bindings, operations",
                    "Drill into any operation to see its input message, output message, and SOAP fault types",
                    "Inspect the linked XSD types to understand the request/response shape",
                    "Generate a sample SOAP envelope and copy it straight into the SOAP Client tool",
                ],
                tips: [
                    "Remote WSDLs hosted without CORS headers won't load in the browser — paste the XML directly instead",
                    "Check `<soap:binding transport>` to confirm SOAP 1.1 (HTTP) vs SOAP 1.2 — they have different envelope namespaces",
                    "`<wsdl:import>` and `<xsd:import>` pull in additional schemas — fetch and inline them to see the full picture",
                    "Operation style (document/literal vs rpc/encoded) changes how the body is wrapped — most modern services use document/literal-wrapped",
                    "WS-Policy attachments describe security and transactional requirements — look for `<wsp:Policy>` blocks",
                    "Use the XSD Validator tool to verify a sample message before sending it to the service",
                ],
                useCases: [
                    "Reverse-engineering legacy enterprise SOAP services for integration",
                    "Generating client stubs in code-first tooling (Apache CXF, JAX-WS, .NET wsdl.exe)",
                    "Auditing SOAP service contracts during procurement or vendor migration",
                    "Building documentation for internal SOAP services exposed via API gateways",
                    "Diagnosing schema mismatches when wire requests fail with `Fault` responses",
                    "Onboarding to bank, payment, or government SOAP APIs without IDE plugins",
                ],
            }}
        >
            <Row gutter={[16, 16]}>
                {/* Input Panel */}
                <Col xs={24} lg={12}>
                    <Card
                        title="WSDL Input"
                        extra={
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={handleParse}
                                    icon={<FileTextOutlined />}
                                >
                                    Parse
                                </Button>
                            </Space>
                        }
                    >
                        {/* URL Input */}
                        <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
                            <Input
                                placeholder="Enter WSDL URL..."
                                value={wsdlUrl}
                                onChange={(e) => setWsdlUrl(e.target.value)}
                                prefix={<LinkOutlined />}
                            />
                            <Button
                                onClick={handleFetchWsdl}
                                loading={loading}
                                icon={<DownloadOutlined />}
                            >
                                Fetch
                            </Button>
                        </Space.Compact>

                        <Divider style={{ margin: "12px 0" }}>Or paste WSDL XML</Divider>

                        <CodeEditor
                            value={wsdlInput}
                            onChange={(v) => setWsdlInput(v || "")}
                            language="xml"
                            height={400}
                        />
                    </Card>
                </Col>

                {/* Output Panel */}
                <Col xs={24} lg={12}>
                    {error && (
                        <Alert
                            type="error"
                            message="Parse Error"
                            description={error}
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                    )}

                    {parsedWsdl ? (
                        <Card title="Parsed WSDL">
                            <Tabs
                                activeKey={activeTab}
                                onChange={setActiveTab}
                                items={[
                                    {
                                        key: "overview",
                                        label: "Overview",
                                        children: (
                                            <div>
                                                <Descriptions column={1} size="small" bordered>
                                                    <Descriptions.Item label="Target Namespace">
                                                        <Text code copyable>{parsedWsdl.targetNamespace}</Text>
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Services">
                                                        {parsedWsdl.services.length}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Port Types">
                                                        {parsedWsdl.portTypes.length}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Bindings">
                                                        {parsedWsdl.bindings.length}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Messages">
                                                        {parsedWsdl.messages.length}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Types">
                                                        {parsedWsdl.types.length}
                                                    </Descriptions.Item>
                                                </Descriptions>

                                                <Divider>Service Tree</Divider>
                                                <Tree
                                                    treeData={treeData}
                                                    defaultExpandAll
                                                    onSelect={(_, { node }) => {
                                                        const key = node.key as string;
                                                        if (key.startsWith("op-")) {
                                                            const opName = key.split("-").slice(2).join("-");
                                                            const op = parsedWsdl.portTypes
                                                                .flatMap(pt => pt.operations)
                                                                .find(o => o.name === opName);
                                                            if (op) setSelectedOperation(op);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "services",
                                        label: `Services (${parsedWsdl.services.length})`,
                                        children: (
                                            <div>
                                                {parsedWsdl.services.map(svc => (
                                                    <Card key={svc.name} size="small" style={{ marginBottom: 12 }}>
                                                        <Text strong><ApiOutlined /> {svc.name}</Text>
                                                        {svc.documentation && (
                                                            <Paragraph type="secondary" style={{ margin: "8px 0 0" }}>
                                                                {svc.documentation}
                                                            </Paragraph>
                                                        )}
                                                        {svc.ports.map(port => (
                                                            <div key={port.name} style={{ marginTop: 8, paddingLeft: 16 }}>
                                                                <Text><BranchesOutlined /> {port.name}</Text>
                                                                <br />
                                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                                    Binding: {port.binding}
                                                                </Text>
                                                                <br />
                                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                                    Address: <Text code copyable style={{ fontSize: 11 }}>{port.address}</Text>
                                                                </Text>
                                                            </div>
                                                        ))}
                                                    </Card>
                                                ))}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "operations",
                                        label: "Operations",
                                        children: (
                                            <Table
                                                size="small"
                                                dataSource={parsedWsdl.portTypes.flatMap(pt =>
                                                    pt.operations.map(op => ({ ...op, portType: pt.name, key: `${pt.name}-${op.name}` }))
                                                )}
                                                columns={[
                                                    {
                                                        title: "Operation",
                                                        dataIndex: "name",
                                                        render: (name, record) => (
                                                            <Button
                                                                type="link"
                                                                size="small"
                                                                onClick={() => setSelectedOperation(record)}
                                                            >
                                                                <FunctionOutlined /> {name}
                                                            </Button>
                                                        ),
                                                    },
                                                    { title: "Port Type", dataIndex: "portType" },
                                                    { title: "Input", dataIndex: "input", render: (v) => v && <Tag>{v}</Tag> },
                                                    { title: "Output", dataIndex: "output", render: (v) => v && <Tag>{v}</Tag> },
                                                ]}
                                                pagination={false}
                                                scroll={{ y: 300 }}
                                            />
                                        ),
                                    },
                                    {
                                        key: "messages",
                                        label: `Messages (${parsedWsdl.messages.length})`,
                                        children: (
                                            <Collapse
                                                items={parsedWsdl.messages.map(msg => ({
                                                    key: msg.name,
                                                    label: <><DatabaseOutlined /> {msg.name}</>,
                                                    children: (
                                                        <Table
                                                            size="small"
                                                            dataSource={msg.parts.map((p, i) => ({ ...p, key: i }))}
                                                            columns={[
                                                                { title: "Part", dataIndex: "name" },
                                                                { title: "Element", dataIndex: "element", render: (v) => v && <Tag color="blue">{v}</Tag> },
                                                                { title: "Type", dataIndex: "type", render: (v) => v && <Tag color="green">{v}</Tag> },
                                                            ]}
                                                            pagination={false}
                                                        />
                                                    ),
                                                }))}
                                            />
                                        ),
                                    },
                                    {
                                        key: "types",
                                        label: `Types (${parsedWsdl.types.length})`,
                                        children: (
                                            <Table
                                                size="small"
                                                dataSource={parsedWsdl.types.map((t, i) => ({ ...t, key: i }))}
                                                columns={[
                                                    { title: "Name", dataIndex: "name" },
                                                    {
                                                        title: "Type",
                                                        dataIndex: "type",
                                                        render: (type) => (
                                                            <Tag color={type === "element" ? "blue" : type === "complexType" ? "purple" : "green"}>
                                                                {type}
                                                            </Tag>
                                                        ),
                                                    },
                                                ]}
                                                pagination={false}
                                                scroll={{ y: 300 }}
                                                expandable={{
                                                    expandedRowRender: (record) => (
                                                        <pre style={{ fontSize: 11, margin: 0, overflow: "auto" }}>
                                                            {record.content}
                                                        </pre>
                                                    ),
                                                }}
                                            />
                                        ),
                                    },
                                ]}
                            />
                        </Card>
                    ) : (
                        <Card>
                            <Empty description="Parse a WSDL to see its structure" />
                        </Card>
                    )}

                    {/* Selected Operation Details */}
                    {selectedOperation && parsedWsdl && (
                        <Card
                            title={<><FunctionOutlined /> {selectedOperation.name}</>}
                            style={{ marginTop: 16 }}
                            extra={
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(sampleRequest, "Sample request")}
                                >
                                    Copy Request
                                </Button>
                            }
                        >
                            {selectedOperation.documentation && (
                                <Paragraph type="secondary">{selectedOperation.documentation}</Paragraph>
                            )}
                            <Descriptions size="small" column={1}>
                                <Descriptions.Item label="Input Message">
                                    <Tag>{selectedOperation.input}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Output Message">
                                    <Tag>{selectedOperation.output}</Tag>
                                </Descriptions.Item>
                                {selectedOperation.soapAction && (
                                    <Descriptions.Item label="SOAP Action">
                                        <Text code copyable>{selectedOperation.soapAction}</Text>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>

                            <Divider>Sample SOAP Request</Divider>
                            <CodeEditor
                                value={sampleRequest}
                                language="xml"
                                height={200}
                                readOnly
                            />
                        </Card>
                    )}
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
