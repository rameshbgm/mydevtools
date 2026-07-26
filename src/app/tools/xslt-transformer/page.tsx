"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Alert } from "antd";
import { SettingOutlined, CopyOutlined, ClearOutlined, PlayCircleOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import { copyToClipboard } from "@/lib/clipboard";

const { Text, Paragraph } = Typography;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="1">
    <title>The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price>10.99</price>
  </book>
  <book id="2">
    <title>To Kill a Mockingbird</title>
    <author>Harper Lee</author>
    <year>1960</year>
    <price>12.99</price>
  </book>
  <book id="3">
    <title>1984</title>
    <author>George Orwell</author>
    <year>1949</year>
    <price>9.99</price>
  </book>
</catalog>`;

const SAMPLE_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title>Book Catalog</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Book Catalog</h1>
        <table>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>Price</th>
          </tr>
          <xsl:for-each select="catalog/book">
            <tr>
              <td><xsl:value-of select="@id"/></td>
              <td><xsl:value-of select="title"/></td>
              <td><xsl:value-of select="author"/></td>
              <td><xsl:value-of select="year"/></td>
              <td>$<xsl:value-of select="price"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

function transformXSLT(xmlString: string, xsltString: string): string {
    const parser = new DOMParser();

    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const xmlError = xmlDoc.querySelector("parsererror");
    if (xmlError) {
        throw new Error("Invalid XML: " + xmlError.textContent);
    }

    const xsltDoc = parser.parseFromString(xsltString, "application/xml");
    const xsltError = xsltDoc.querySelector("parsererror");
    if (xsltError) {
        throw new Error("Invalid XSLT: " + xsltError.textContent);
    }

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);

    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    const serializer = new XMLSerializer();
    let result = serializer.serializeToString(resultDoc);

    // Format the output
    result = result
        .replace(/></g, ">\n<")
        .replace(/^\s+/gm, (match) => "  ".repeat(Math.floor(match.length / 2)));

    return result;
}

export default function XsltTransformerPage() {
    const [xml, setXml] = useState(SAMPLE_XML);
    const [xslt, setXslt] = useState(SAMPLE_XSLT);
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleTransform = () => {
        setError(null);
        setOutput("");

        try {
            const result = transformXSLT(xml, xslt);
            setOutput(result);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const copyOutput = () => copyToClipboard(output, "Output copied!");

    return (
        <ToolPageLayout
            title="XSLT Transformer"
            description="Transform XML documents using XSLT stylesheets"
            icon={<SettingOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "XSLT (XSL Transformations) Transformer applies XSLT stylesheets to XML documents, producing transformed output. XSLT can convert XML to HTML, other XML formats, or plain text.",
                whyUse: "XSLT is a powerful language for transforming XML data. It's used for generating HTML from XML, converting between XML formats, and processing XML data in enterprise systems.",
                howToUse: [
                    "Paste your source XML in the XML input panel",
                    "Paste your XSLT stylesheet in the XSLT panel",
                    "Click 'Transform' to apply the transformation",
                    "View the output in the result panel"
                ],
                tips: [
                    "Use xsl:for-each to iterate over node sets",
                    "xsl:value-of extracts text values",
                    "xsl:template defines transformation rules",
                    "Match templates with XPath patterns"
                ],
                useCases: [
                    "Converting XML data to HTML pages",
                    "Transforming data between different XML schemas",
                    "Generating reports from XML data",
                    "Converting legacy XML formats"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card
                        title="XML Input"
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setXml("")}>
                                Clear
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={xml}
                            onChange={(val) => setXml(val || "")}
                            language="xml"
                            height={300}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title="XSLT Stylesheet"
                        extra={
                            <Button size="small" icon={<ClearOutlined />} onClick={() => setXslt("")}>
                                Clear
                            </Button>
                        }
                    >
                        <CodeEditor
                            value={xslt}
                            onChange={(val) => setXslt(val || "")}
                            language="xml"
                            height={300}
                        />
                    </Card>
                </Col>

                <Col xs={24}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlayCircleOutlined />}
                        onClick={handleTransform}
                        style={{ background: "#722ed1" }}
                    >
                        Transform
                    </Button>
                </Col>

                <Col xs={24}>
                    <Card
                        title="Output"
                        extra={
                            output && (
                                <Button size="small" icon={<CopyOutlined />} onClick={copyOutput}>
                                    Copy
                                </Button>
                            )
                        }
                    >
                        {error ? (
                            <Alert type="error" title={error} showIcon />
                        ) : output ? (
                            <CodeEditor
                                value={output}
                                language="html"
                                height={300}
                                readOnly
                            />
                        ) : (
                            <div style={{ textAlign: "center", padding: 40, color: "#8c8c8c" }}>
                                Click Transform to see the output
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="About XSLT">
                        <Paragraph type="secondary">
                            XSLT (eXtensible Stylesheet Language Transformations) is a language
                            for transforming XML documents into other XML documents, HTML, or
                            plain text.
                        </Paragraph>
                        <Paragraph type="secondary">
                            Common uses include converting XML data to HTML for web display,
                            transforming between different XML schemas, and generating reports.
                        </Paragraph>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Common XSLT Elements">
                        <ul style={{ paddingLeft: 20, margin: 0, fontSize: 13 }}>
                            <li><Text code>xsl:template</Text> - Define templates</li>
                            <li><Text code>xsl:value-of</Text> - Extract values</li>
                            <li><Text code>xsl:for-each</Text> - Loop through nodes</li>
                            <li><Text code>xsl:if</Text> - Conditional processing</li>
                            <li><Text code>xsl:choose</Text> - Multiple conditions</li>
                            <li><Text code>xsl:sort</Text> - Sort elements</li>
                            <li><Text code>xsl:apply-templates</Text> - Apply templates</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
