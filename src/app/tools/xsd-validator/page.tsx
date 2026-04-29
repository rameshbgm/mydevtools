"use client";

import React, { useState, useMemo } from "react";
import {
    Card,
    Button,
    Typography,
    Row,
    Col,
    Space,
    Table,
    message,
    Tag,
    Alert,
    Divider,
    Descriptions,
    Collapse,
    List,
    Tooltip,
    Badge,
} from "antd";
import {
    ApartmentOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    InfoCircleOutlined,
    FileTextOutlined,
    BulbOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text, Paragraph, Title } = Typography;

// ─── Types ───────────────────────────────────────────────────────────

interface ValidationError {
    line: number;
    column: number;
    message: string;
    severity: "error" | "warning" | "info";
}

interface XSDElement {
    name: string;
    type?: string;
    minOccurs?: string;
    maxOccurs?: string;
    children?: XSDElement[];
}

interface XSDType {
    name: string;
    kind: "simple" | "complex";
    base?: string;
    elements?: XSDElement[];
    attributes?: { name: string; type?: string; use?: string }[];
}

interface ParsedXSD {
    targetNamespace?: string;
    elements: XSDElement[];
    types: XSDType[];
    attributes: { name: string; type?: string }[];
    groups: { name: string }[];
}

// ─── Sample Data ─────────────────────────────────────────────────────

const SAMPLE_XSD = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           targetNamespace="http://example.com/bookstore"
           xmlns:tns="http://example.com/bookstore"
           elementFormDefault="qualified">

    <!-- Simple Types -->
    <xs:simpleType name="ISBNType">
        <xs:restriction base="xs:string">
            <xs:pattern value="\\d{3}-\\d{10}"/>
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="RatingType">
        <xs:restriction base="xs:integer">
            <xs:minInclusive value="1"/>
            <xs:maxInclusive value="5"/>
        </xs:restriction>
    </xs:simpleType>

    <!-- Complex Types -->
    <xs:complexType name="BookType">
        <xs:sequence>
            <xs:element name="title" type="xs:string"/>
            <xs:element name="author" type="xs:string" maxOccurs="unbounded"/>
            <xs:element name="isbn" type="tns:ISBNType"/>
            <xs:element name="price" type="xs:decimal"/>
            <xs:element name="rating" type="tns:RatingType" minOccurs="0"/>
        </xs:sequence>
        <xs:attribute name="id" type="xs:integer" use="required"/>
        <xs:attribute name="category" type="xs:string"/>
    </xs:complexType>

    <xs:complexType name="BookstoreType">
        <xs:sequence>
            <xs:element name="book" type="tns:BookType" maxOccurs="unbounded"/>
        </xs:sequence>
        <xs:attribute name="name" type="xs:string" use="required"/>
    </xs:complexType>

    <!-- Root Element -->
    <xs:element name="bookstore" type="tns:BookstoreType"/>

</xs:schema>`;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore xmlns="http://example.com/bookstore" name="My Books">
    <book id="1" category="Fiction">
        <title>The Great Gatsby</title>
        <author>F. Scott Fitzgerald</author>
        <isbn>978-0743273565</isbn>
        <price>14.99</price>
        <rating>5</rating>
    </book>
    <book id="2" category="Science">
        <title>A Brief History of Time</title>
        <author>Stephen Hawking</author>
        <isbn>978-0553380163</isbn>
        <price>18.00</price>
    </book>
</bookstore>`;

const SAMPLE_INVALID_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore xmlns="http://example.com/bookstore" name="My Books">
    <book id="abc" category="Fiction">
        <title>Test Book</title>
        <!-- Missing required author element -->
        <isbn>invalid-isbn</isbn>
        <price>not-a-number</price>
        <rating>10</rating>
    </book>
</bookstore>`;

// ─── XSD Parser ──────────────────────────────────────────────────────

function parseXSD(xsdString: string): ParsedXSD {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xsdString, "text/xml");

    const parseError = doc.querySelector("parsererror");
    if (parseError) {
        throw new Error("Invalid XSD XML: " + parseError.textContent);
    }

    const root = doc.documentElement;
    const XS_NS = "http://www.w3.org/2001/XMLSchema";

    const targetNamespace = root.getAttribute("targetNamespace") || undefined;

    const getLocalName = (name: string) => name?.includes(":") ? name.split(":")[1] : name;

    // Parse elements
    const elements: XSDElement[] = [];
    const elementNodes = root.getElementsByTagNameNS(XS_NS, "element");
    for (let i = 0; i < elementNodes.length; i++) {
        const el = elementNodes[i];
        if (el.parentElement === root) {
            elements.push({
                name: el.getAttribute("name") || "",
                type: el.getAttribute("type") ? getLocalName(el.getAttribute("type")!) : undefined,
                minOccurs: el.getAttribute("minOccurs") || undefined,
                maxOccurs: el.getAttribute("maxOccurs") || undefined,
            });
        }
    }

    // Parse types
    const types: XSDType[] = [];

    // Complex types
    const complexTypes = root.getElementsByTagNameNS(XS_NS, "complexType");
    for (let i = 0; i < complexTypes.length; i++) {
        const ct = complexTypes[i];
        if (ct.parentElement === root || ct.parentElement?.parentElement === root) {
            const name = ct.getAttribute("name");
            if (!name) continue;

            const typeElements: XSDElement[] = [];
            const childEls = ct.getElementsByTagNameNS(XS_NS, "element");
            for (let j = 0; j < childEls.length; j++) {
                const ce = childEls[j];
                typeElements.push({
                    name: ce.getAttribute("name") || "",
                    type: ce.getAttribute("type") ? getLocalName(ce.getAttribute("type")!) : undefined,
                    minOccurs: ce.getAttribute("minOccurs") || undefined,
                    maxOccurs: ce.getAttribute("maxOccurs") || undefined,
                });
            }

            const attributes: { name: string; type?: string; use?: string }[] = [];
            const attrEls = ct.getElementsByTagNameNS(XS_NS, "attribute");
            for (let j = 0; j < attrEls.length; j++) {
                const attr = attrEls[j];
                attributes.push({
                    name: attr.getAttribute("name") || "",
                    type: attr.getAttribute("type") ? getLocalName(attr.getAttribute("type")!) : undefined,
                    use: attr.getAttribute("use") || undefined,
                });
            }

            types.push({
                name,
                kind: "complex",
                elements: typeElements,
                attributes,
            });
        }
    }

    // Simple types
    const simpleTypes = root.getElementsByTagNameNS(XS_NS, "simpleType");
    for (let i = 0; i < simpleTypes.length; i++) {
        const st = simpleTypes[i];
        if (st.parentElement === root) {
            const name = st.getAttribute("name");
            if (!name) continue;

            const restriction = st.getElementsByTagNameNS(XS_NS, "restriction")[0];
            const base = restriction?.getAttribute("base");

            types.push({
                name,
                kind: "simple",
                base: base ? getLocalName(base) : undefined,
            });
        }
    }

    // Parse global attributes
    const attributes: { name: string; type?: string }[] = [];
    const attrNodes = root.getElementsByTagNameNS(XS_NS, "attribute");
    for (let i = 0; i < attrNodes.length; i++) {
        const attr = attrNodes[i];
        if (attr.parentElement === root) {
            attributes.push({
                name: attr.getAttribute("name") || "",
                type: attr.getAttribute("type") ? getLocalName(attr.getAttribute("type")!) : undefined,
            });
        }
    }

    // Parse groups
    const groups: { name: string }[] = [];
    const groupNodes = root.getElementsByTagNameNS(XS_NS, "group");
    for (let i = 0; i < groupNodes.length; i++) {
        const grp = groupNodes[i];
        if (grp.parentElement === root) {
            groups.push({ name: grp.getAttribute("name") || "" });
        }
    }

    return { targetNamespace, elements, types, attributes, groups };
}

// ─── Validator ───────────────────────────────────────────────────────

function validateXmlStructure(xmlString: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "text/xml");

    const parseError = doc.querySelector("parsererror");
    if (parseError) {
        errors.push({
            line: 1,
            column: 1,
            message: "XML Parse Error: " + (parseError.textContent || "Unknown error"),
            severity: "error",
        });
    }

    return errors;
}

function validateAgainstXSD(xmlString: string, xsdString: string, parsedXSD: ParsedXSD): ValidationError[] {
    const errors: ValidationError[] = [];

    // First check XML structure
    const structureErrors = validateXmlStructure(xmlString);
    if (structureErrors.length > 0) {
        return structureErrors;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Note: Full XSD validation requires a proper XML Schema validator
    // Browser DOMParser doesn't support XSD validation natively
    // This is a simplified structural check

    const root = xmlDoc.documentElement;

    // Check namespace
    if (parsedXSD.targetNamespace) {
        const xmlNs = root.namespaceURI;
        if (xmlNs !== parsedXSD.targetNamespace) {
            errors.push({
                line: 1,
                column: 1,
                message: `Namespace mismatch. Expected: ${parsedXSD.targetNamespace}, Found: ${xmlNs || "none"}`,
                severity: "warning",
            });
        }
    }

    // Check root element
    const rootElementDef = parsedXSD.elements.find(
        e => e.name === root.localName || e.name === root.tagName
    );

    if (!rootElementDef && parsedXSD.elements.length > 0) {
        errors.push({
            line: 1,
            column: 1,
            message: `Unknown root element: "${root.localName}". Expected one of: ${parsedXSD.elements.map(e => e.name).join(", ")}`,
            severity: "error",
        });
    }

    // Additional structural checks could be added here
    // For full XSD validation, use a server-side validator

    if (errors.length === 0) {
        // Add info message that this is basic validation
        errors.push({
            line: 0,
            column: 0,
            message: "Note: This is structural validation only. For complete XSD validation including type checking and constraints, use a dedicated XML validator.",
            severity: "info",
        });
    }

    return errors;
}

// ─── Component ───────────────────────────────────────────────────────

export default function XsdValidatorPage() {
    const [xsdInput, setXsdInput] = useState(SAMPLE_XSD);
    const [xmlInput, setXmlInput] = useState(SAMPLE_XML);
    const [parsedXsd, setParsedXsd] = useState<ParsedXSD | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
    const [xsdParseError, setXsdParseError] = useState<string | null>(null);
    const [validated, setValidated] = useState(false);

    // Parse XSD
    const handleParseXsd = () => {
        setXsdParseError(null);
        try {
            const parsed = parseXSD(xsdInput);
            setParsedXsd(parsed);
            message.success("XSD parsed successfully!");
        } catch (err: any) {
            setXsdParseError(err.message);
            setParsedXsd(null);
        }
    };

    // Validate XML against XSD
    const handleValidate = () => {
        if (!parsedXsd) {
            message.warning("Please parse the XSD first");
            return;
        }

        const errors = validateAgainstXSD(xmlInput, xsdInput, parsedXsd);
        setValidationErrors(errors);
        setValidated(true);

        const errorCount = errors.filter(e => e.severity === "error").length;
        if (errorCount === 0) {
            message.success("Validation passed!");
        } else {
            message.error(`Validation failed with ${errorCount} error(s)`);
        }
    };

    // Load sample data
    const loadValidSample = () => {
        setXmlInput(SAMPLE_XML);
        setValidated(false);
    };

    const loadInvalidSample = () => {
        setXmlInput(SAMPLE_INVALID_XML);
        setValidated(false);
    };

    // Count errors by severity
    const errorCounts = useMemo(() => {
        return {
            error: validationErrors.filter(e => e.severity === "error").length,
            warning: validationErrors.filter(e => e.severity === "warning").length,
            info: validationErrors.filter(e => e.severity === "info").length,
        };
    }, [validationErrors]);

    const isValid = validated && errorCounts.error === 0;

    return (
        <ToolPageLayout
            title="XSD Validator"
            description="Validate XML documents against XSD schemas"
            icon={<ApartmentOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: "XSD (XML Schema Definition) validation verifies that an XML document conforms to a specific schema. It checks element names, types, cardinality, and structure against the schema definition.",
                whyUse: "XSD validation ensures XML data meets expected format requirements. It's essential for SOAP web services, enterprise integrations, and any system that requires strict data contracts.",
                howToUse: [
                    "Paste your XSD schema in the left editor",
                    "Paste the XML document to validate in the right editor",
                    "Click 'Validate' to check conformance",
                    "Review any schema violations or errors"
                ],
                tips: [
                    "Ensure namespaces match between XSD and XML",
                    "XSD can define complex types with specific constraints",
                    "Use xs:sequence for ordered elements, xs:choice for alternatives",
                    "Check targetNamespace and xmlns declarations"
                ],
                useCases: [
                    "Validating SOAP messages against WSDL types",
                    "Ensuring B2B data exchange compliance",
                    "Testing XML exports against specifications",
                    "Debugging schema validation errors"
                ]
            }}
        >
            <Row gutter={[16, 16]}>
                {/* Left Panel - XSD */}
                <Col xs={24} lg={12}>
                    <Card
                        title="XSD Schema"
                        extra={
                            <Button
                                type="primary"
                                onClick={handleParseXsd}
                                icon={<FileTextOutlined />}
                            >
                                Parse XSD
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={xsdInput}
                            onChange={(v) => {
                                setXsdInput(v || "");
                                setValidated(false);
                            }}
                            language="xml"
                            height={300}
                        />

                        {xsdParseError && (
                            <Alert
                                type="error"
                                message="XSD Parse Error"
                                description={xsdParseError}
                                showIcon
                                style={{ marginTop: 12 }}
                            />
                        )}

                        {parsedXsd && (
                            <div style={{ marginTop: 16 }}>
                                <Divider>Schema Overview</Divider>
                                <Descriptions size="small" column={2}>
                                    {parsedXsd.targetNamespace && (
                                        <Descriptions.Item label="Namespace" span={2}>
                                            <Text code style={{ fontSize: 11 }}>{parsedXsd.targetNamespace}</Text>
                                        </Descriptions.Item>
                                    )}
                                    <Descriptions.Item label="Elements">
                                        <Badge count={parsedXsd.elements.length} showZero color="#1890ff" />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Types">
                                        <Badge count={parsedXsd.types.length} showZero color="#722ed1" />
                                    </Descriptions.Item>
                                </Descriptions>

                                <Collapse
                                    size="small"
                                    style={{ marginTop: 12 }}
                                    items={[
                                        {
                                            key: "types",
                                            label: `Types (${parsedXsd.types.length})`,
                                            children: (
                                                <Table
                                                    size="small"
                                                    dataSource={parsedXsd.types.map((t, i) => ({ ...t, key: i }))}
                                                    columns={[
                                                        { title: "Name", dataIndex: "name" },
                                                        {
                                                            title: "Kind",
                                                            dataIndex: "kind",
                                                            render: (k) => (
                                                                <Tag color={k === "complex" ? "purple" : "green"}>
                                                                    {k}
                                                                </Tag>
                                                            ),
                                                        },
                                                        { title: "Base", dataIndex: "base", render: (b) => b && <Text code>{b}</Text> },
                                                    ]}
                                                    pagination={false}
                                                    scroll={{ y: 150 }}
                                                />
                                            ),
                                        },
                                        {
                                            key: "elements",
                                            label: `Global Elements (${parsedXsd.elements.length})`,
                                            children: (
                                                <List
                                                    size="small"
                                                    dataSource={parsedXsd.elements}
                                                    renderItem={(el) => (
                                                        <List.Item>
                                                            <Text strong>{el.name}</Text>
                                                            {el.type && <Text type="secondary"> : {el.type}</Text>}
                                                        </List.Item>
                                                    )}
                                                />
                                            ),
                                        },
                                    ]}
                                />
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Right Panel - XML */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                XML Document
                                {validated && (
                                    isValid ? (
                                        <Tag color="success" icon={<CheckCircleOutlined />}>Valid</Tag>
                                    ) : (
                                        <Tag color="error" icon={<CloseCircleOutlined />}>Invalid</Tag>
                                    )
                                )}
                            </Space>
                        }
                        extra={
                            <Space>
                                <Tooltip title="Load valid sample">
                                    <Button size="small" onClick={loadValidSample}>Valid</Button>
                                </Tooltip>
                                <Tooltip title="Load invalid sample">
                                    <Button size="small" onClick={loadInvalidSample}>Invalid</Button>
                                </Tooltip>
                                <Button
                                    type="primary"
                                    onClick={handleValidate}
                                    disabled={!parsedXsd}
                                    icon={<CheckCircleOutlined />}
                                >
                                    Validate
                                </Button>
                            </Space>
                        }
                    >
                        <CodeEditor
                            value={xmlInput}
                            onChange={(v) => {
                                setXmlInput(v || "");
                                setValidated(false);
                            }}
                            language="xml"
                            height={300}
                        />

                        {/* Validation Results */}
                        {validated && (
                            <div style={{ marginTop: 16 }}>
                                <Divider>
                                    Validation Results
                                    <Space style={{ marginLeft: 12 }}>
                                        {errorCounts.error > 0 && (
                                            <Tag color="error">{errorCounts.error} errors</Tag>
                                        )}
                                        {errorCounts.warning > 0 && (
                                            <Tag color="warning">{errorCounts.warning} warnings</Tag>
                                        )}
                                        {errorCounts.info > 0 && (
                                            <Tag color="blue">{errorCounts.info} info</Tag>
                                        )}
                                    </Space>
                                </Divider>

                                {validationErrors.length === 0 ? (
                                    <Alert
                                        type="success"
                                        message="Validation Successful"
                                        description="The XML document is valid according to the XSD schema."
                                        showIcon
                                    />
                                ) : (
                                    <List
                                        size="small"
                                        dataSource={validationErrors}
                                        renderItem={(err, i) => (
                                            <List.Item key={i}>
                                                <Space>
                                                    {err.severity === "error" && (
                                                        <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                                                    )}
                                                    {err.severity === "warning" && (
                                                        <WarningOutlined style={{ color: "#faad14" }} />
                                                    )}
                                                    {err.severity === "info" && (
                                                        <InfoCircleOutlined style={{ color: "#1890ff" }} />
                                                    )}
                                                    <div>
                                                        {err.line > 0 && (
                                                            <Text type="secondary" style={{ marginRight: 8 }}>
                                                                Line {err.line}
                                                            </Text>
                                                        )}
                                                        <Text>{err.message}</Text>
                                                    </div>
                                                </Space>
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </div>
                        )}

                        {!parsedXsd && !validated && (
                            <Alert
                                type="info"
                                message="Parse XSD First"
                                description="Please parse the XSD schema before validating XML documents."
                                showIcon
                                style={{ marginTop: 16 }}
                            />
                        )}
                    </Card>

                    {/* Info Card */}
                    <Card size="small" style={{ marginTop: 16 }}>
                        <Space>
                            <BulbOutlined style={{ color: "#faad14" }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Browser-based validation performs structural checks only.
                                For complete type and constraint validation, use a dedicated XML validator like Xerces or libxml2.
                            </Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
