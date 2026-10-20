"use client";

import React, { useState, useMemo } from "react";
import { Card, Input, Typography, Row, Col, Table, Tag, Space, Button } from "antd";
import { OrderedListOutlined, SearchOutlined, CopyOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text } = Typography;

interface MimeType {
    type: string;
    extensions: string[];
    category: string;
}

const MIME_TYPES: MimeType[] = [
    // Text
    { type: "text/plain", extensions: [".txt"], category: "Text" },
    { type: "text/html", extensions: [".html", ".htm"], category: "Text" },
    { type: "text/css", extensions: [".css"], category: "Text" },
    { type: "text/javascript", extensions: [".js", ".mjs"], category: "Text" },
    { type: "text/csv", extensions: [".csv"], category: "Text" },
    { type: "text/xml", extensions: [".xml"], category: "Text" },
    { type: "text/markdown", extensions: [".md", ".markdown"], category: "Text" },
    { type: "text/calendar", extensions: [".ics"], category: "Text" },
    { type: "text/event-stream", extensions: [], category: "Text" },

    // Application
    { type: "application/octet-stream", extensions: [".bin"], category: "Application" },
    { type: "application/vnd.ms-fontobject", extensions: [".eot"], category: "Font" },
    { type: "application/json", extensions: [".json"], category: "Application" },
    { type: "application/ld+json", extensions: [".jsonld"], category: "Application" },
    { type: "application/problem+json", extensions: [], category: "Application" },
    { type: "application/vnd.api+json", extensions: [], category: "Application" },
    { type: "application/manifest+json", extensions: [".webmanifest"], category: "Application" },
    { type: "application/xml", extensions: [".xml"], category: "Application" },
    { type: "application/pdf", extensions: [".pdf"], category: "Application" },
    { type: "application/yaml", extensions: [".yaml", ".yml"], category: "Application" },
    { type: "application/toml", extensions: [".toml"], category: "Application" },
    { type: "application/zip", extensions: [".zip"], category: "Application" },
    { type: "application/gzip", extensions: [".gz", ".gzip"], category: "Application" },
    { type: "application/zstd", extensions: [".zst"], category: "Application" },
    { type: "application/x-bzip2", extensions: [".bz2"], category: "Application" },
    { type: "application/x-xz", extensions: [".xz"], category: "Application" },
    { type: "application/x-tar", extensions: [".tar"], category: "Application" },
    { type: "application/x-rar-compressed", extensions: [".rar"], category: "Application" },
    { type: "application/x-7z-compressed", extensions: [".7z"], category: "Application" },
    { type: "application/x-www-form-urlencoded", extensions: [], category: "Application" },
    { type: "application/javascript", extensions: [".js"], category: "Application" },
    { type: "application/typescript", extensions: [".ts"], category: "Application" },
    { type: "application/wasm", extensions: [".wasm"], category: "Application" },
    { type: "application/epub+zip", extensions: [".epub"], category: "Application" },
    { type: "application/x-sh", extensions: [".sh"], category: "Application" },

    // Microsoft Office
    { type: "application/msword", extensions: [".doc"], category: "Office" },
    { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", extensions: [".docx"], category: "Office" },
    { type: "application/vnd.ms-excel", extensions: [".xls"], category: "Office" },
    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", extensions: [".xlsx"], category: "Office" },
    { type: "application/vnd.ms-powerpoint", extensions: [".ppt"], category: "Office" },
    { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", extensions: [".pptx"], category: "Office" },

    // Images
    { type: "image/jpeg", extensions: [".jpg", ".jpeg"], category: "Image" },
    { type: "image/png", extensions: [".png"], category: "Image" },
    { type: "image/gif", extensions: [".gif"], category: "Image" },
    { type: "image/webp", extensions: [".webp"], category: "Image" },
    { type: "image/svg+xml", extensions: [".svg"], category: "Image" },
    { type: "image/x-icon", extensions: [".ico"], category: "Image" },
    { type: "image/bmp", extensions: [".bmp"], category: "Image" },
    { type: "image/tiff", extensions: [".tiff", ".tif"], category: "Image" },
    { type: "image/avif", extensions: [".avif"], category: "Image" },
    { type: "image/heic", extensions: [".heic"], category: "Image" },
    { type: "image/heif", extensions: [".heif"], category: "Image" },
    { type: "image/jxl", extensions: [".jxl"], category: "Image" },

    // Audio
    { type: "audio/mpeg", extensions: [".mp3"], category: "Audio" },
    { type: "audio/wav", extensions: [".wav"], category: "Audio" },
    { type: "audio/ogg", extensions: [".ogg", ".oga"], category: "Audio" },
    { type: "audio/webm", extensions: [".weba"], category: "Audio" },
    { type: "audio/aac", extensions: [".aac"], category: "Audio" },
    { type: "audio/flac", extensions: [".flac"], category: "Audio" },
    { type: "audio/opus", extensions: [".opus"], category: "Audio" },
    { type: "audio/midi", extensions: [".mid", ".midi"], category: "Audio" },

    // Video
    { type: "video/mp4", extensions: [".mp4"], category: "Video" },
    { type: "video/webm", extensions: [".webm"], category: "Video" },
    { type: "video/ogg", extensions: [".ogv"], category: "Video" },
    { type: "video/quicktime", extensions: [".mov"], category: "Video" },
    { type: "video/x-msvideo", extensions: [".avi"], category: "Video" },
    { type: "video/x-matroska", extensions: [".mkv"], category: "Video" },
    { type: "video/3gpp", extensions: [".3gp"], category: "Video" },
    { type: "video/x-flv", extensions: [".flv"], category: "Video" },

    // Fonts
    { type: "font/woff", extensions: [".woff"], category: "Font" },
    { type: "font/woff2", extensions: [".woff2"], category: "Font" },
    { type: "font/ttf", extensions: [".ttf"], category: "Font" },
    { type: "font/otf", extensions: [".otf"], category: "Font" },

    // Multipart
    { type: "multipart/form-data", extensions: [], category: "Multipart" },
    { type: "multipart/byteranges", extensions: [], category: "Multipart" },
];

const CATEGORY_COLORS: Record<string, string> = {
    Text: "#1677ff",
    Application: "#722ed1",
    Office: "#52c41a",
    Image: "#fa541c",
    Audio: "#eb2f96",
    Video: "#faad14",
    Font: "#13c2c2",
    Multipart: "#8c8c8c",
};

export default function MimeTypesPage() {
    const { t } = useLanguage();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredTypes = useMemo(() => {
        return MIME_TYPES.filter((mt) => {
            const matchesSearch = !search ||
                mt.type.toLowerCase().includes(search.toLowerCase()) ||
                mt.extensions.some((e) => e.toLowerCase().includes(search.toLowerCase()));
            const matchesCategory = !selectedCategory || mt.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [search, selectedCategory]);

    const categories = useMemo(() => {
        const cats = new Set(MIME_TYPES.map((mt) => mt.category));
        return Array.from(cats);
    }, []);

    const copyType = (type: string) => copyToClipboard(type, t("MIME type copied!"));

    return (
        <ToolPageLayout
            title={t("MIME Types Reference")}
            description={t("Search a curated MIME reference by type or extension")}
            icon={<OrderedListOutlined style={{ fontSize: 24, color: "#13c2c2" }} />}
            color="#13c2c2"
            learnMore={{
                whatIs: t("MIME types identify a representation's format in HTTP and email. This curated list includes common labels and extension hints; it is not the complete IANA registry."),
                whyUse: t("Setting correct MIME types is essential for web servers, APIs, and file uploads. Incorrect types can cause browsers to download instead of display, or applications to reject valid files."),
                howToUse: [
                    t("Search by MIME type (e.g., 'application/json')"),
                    t("Search by file extension (e.g., '.pdf')"),
                    t("Filter by category (image, audio, video, etc.)"),
                    t("Copy MIME types for use in code or configs")
                ],
                tips: [
                    t("application/octet-stream is the generic binary type"),
                    t("text/plain is for any unformatted text"),
                    t("Use image/svg+xml for SVG (not image/svg)"),
                    t("JSON uses application/json; YAML uses application/yaml (RFC 9512).")
                ],
                useCases: [
                    t("Configuring web server Content-Type headers"),
                    t("Setting up file upload validation"),
                    t("Debugging content type issues in APIs"),
                    t("Email attachment handling")
                ]
            }}
        >
            <p>{t("Extensions are hints, not content validation. Confirm production media types against the IANA registry.")}</p>
            <Row gutter={[24, 24]}>
                <Col xs={24}>
                    <Card>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            <Input
                                size="large"
                                aria-label={t("Search MIME types")}
                                style={{ fontSize: 16 }}
                                placeholder={t("Search by MIME type or file extension...")}
                                prefix={<SearchOutlined />}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                allowClear
                            />
                            <Space wrap>
                                <Tag
                                    style={{ cursor: "pointer", padding: "4px 12px" }}
                                    color={!selectedCategory ? "blue" : undefined}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    {t("All ({count})", { count: MIME_TYPES.length })}
                                </Tag>
                                {categories.map((cat) => (
                                    <Tag
                                        key={cat}
                                        style={{ cursor: "pointer", padding: "4px 12px" }}
                                        color={selectedCategory === cat ? CATEGORY_COLORS[cat] : undefined}
                                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                    >
                                        {t(cat)} ({MIME_TYPES.filter((mt) => mt.category === cat).length})
                                    </Tag>
                                ))}
                            </Space>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card>
                        <Table
                            size="small"
                            pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (total) => t("{count} MIME types", { count: total }) }}
                            dataSource={filteredTypes.map((mt, i) => ({ ...mt, key: i }))}
                            columns={[
                                {
                                    title: t("MIME Type"),
                                    dataIndex: "type",
                                    sorter: (a, b) => a.type.localeCompare(b.type),
                                    render: (type) => (
                                        <Space>
                                            <Text code style={{ fontSize: 12 }}>{type}</Text>
                                            <Button aria-label={t("Copy")}
                                                size="small"
                                                type="text"
                                                icon={<CopyOutlined />}
                                                onClick={() => copyType(type)}
                                            />
                                        </Space>
                                    ),
                                },
                                {
                                    title: t("Extensions"),
                                    dataIndex: "extensions",
                                    render: (exts: string[]) => (
                                        <Space wrap size={4}>
                                            {exts.length > 0 ? exts.map((ext) => (
                                                <Tag key={ext} color="blue">{ext}</Tag>
                                            )) : <Text type="secondary">—</Text>}
                                        </Space>
                                    ),
                                },
                                {
                                    title: t("Category"),
                                    dataIndex: "category",
                                    filters: categories.map((c) => ({ text: t(c), value: c })),
                                    onFilter: (value, record) => record.category === value,
                                    render: (cat) => (
                                        <Tag color={CATEGORY_COLORS[cat]}>{t(cat)}</Tag>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
