"use client";

import React, { useState } from "react";
import { Card, Typography, Upload, Button, Row, Col, Space, Tag, App, Empty } from "antd";
import { EyeOutlined, UploadOutlined, CopyOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { copyToClipboard } from "@/lib/clipboard";

const { Text } = Typography;
const { Dragger } = Upload;

// Minimal EXIF parser. Reads APP1 segment from a JPEG, walks the TIFF IFD,
// and returns a flat map of tag-name → value. Covers the common camera tags;
// not a full TIFF/EXIF spec implementation.

const EXIF_TAGS: Record<number, string> = {
    0x010F: "Make", 0x0110: "Model", 0x0112: "Orientation", 0x011A: "XResolution",
    0x011B: "YResolution", 0x0128: "ResolutionUnit", 0x0131: "Software", 0x0132: "DateTime",
    0x013B: "Artist", 0x8298: "Copyright", 0x8769: "ExifOffset", 0x8825: "GPSOffset",
    0x829A: "ExposureTime", 0x829D: "FNumber", 0x8822: "ExposureProgram", 0x8827: "ISO",
    0x9000: "ExifVersion", 0x9003: "DateTimeOriginal", 0x9004: "DateTimeDigitized",
    0x9201: "ShutterSpeedValue", 0x9202: "ApertureValue", 0x9204: "ExposureBias",
    0x9205: "MaxApertureValue", 0x9206: "SubjectDistance", 0x9207: "MeteringMode",
    0x9208: "LightSource", 0x9209: "Flash", 0x920A: "FocalLength",
    0xA002: "PixelXDimension", 0xA003: "PixelYDimension", 0xA20E: "FocalPlaneXResolution",
    0xA20F: "FocalPlaneYResolution", 0xA217: "SensingMethod", 0xA300: "FileSource",
    0xA301: "SceneType", 0xA402: "ExposureMode", 0xA403: "WhiteBalance",
    0xA404: "DigitalZoomRatio", 0xA405: "FocalLengthIn35mmFilm", 0xA406: "SceneCaptureType",
    0xA432: "LensSpecification", 0xA433: "LensMake", 0xA434: "LensModel",
};
const GPS_TAGS: Record<number, string> = {
    0x0000: "GPSVersionID", 0x0001: "GPSLatitudeRef", 0x0002: "GPSLatitude",
    0x0003: "GPSLongitudeRef", 0x0004: "GPSLongitude", 0x0005: "GPSAltitudeRef",
    0x0006: "GPSAltitude", 0x0007: "GPSTimeStamp", 0x001D: "GPSDateStamp",
};

interface IfdEntry { tag: number; value: unknown; }

function readExif(buf: ArrayBuffer): Record<string, unknown> | { error: string } {
    const view = new DataView(buf);
    if (view.getUint16(0) !== 0xFFD8) return { error: "Not a JPEG file (no SOI marker)" };
    let offset = 2;
    while (offset < view.byteLength) {
        if (view.getUint8(offset) !== 0xFF) return { error: "Malformed JPEG segments" };
        const marker = view.getUint16(offset);
        const len = view.getUint16(offset + 2);
        if (marker === 0xFFE1) {
            // APP1 — check for "Exif\0\0"
            const sig = String.fromCharCode(...new Uint8Array(buf, offset + 4, 4));
            if (sig !== "Exif") { offset += 2 + len; continue; }
            const tiffStart = offset + 10;
            return parseTiff(view, tiffStart, buf);
        }
        if (marker === 0xFFDA) return { error: "No EXIF segment found before image data" };
        offset += 2 + len;
    }
    return { error: "Reached end of file without finding EXIF" };
}

function parseTiff(view: DataView, start: number, buf: ArrayBuffer): Record<string, unknown> {
    const byteOrder = view.getUint16(start);
    const little = byteOrder === 0x4949;
    const ifd0Offset = view.getUint32(start + 4, little);
    const ifd0 = readIfd(view, start, start + ifd0Offset, little, buf, EXIF_TAGS);

    const out: Record<string, unknown> = {};
    for (const e of ifd0) {
        out[EXIF_TAGS[e.tag] || `Tag_0x${e.tag.toString(16)}`] = e.value;
    }
    if (typeof out.ExifOffset === "number") {
        const sub = readIfd(view, start, start + (out.ExifOffset as number), little, buf, EXIF_TAGS);
        for (const e of sub) {
            out[EXIF_TAGS[e.tag] || `Tag_0x${e.tag.toString(16)}`] = e.value;
        }
        delete out.ExifOffset;
    }
    if (typeof out.GPSOffset === "number") {
        const gps = readIfd(view, start, start + (out.GPSOffset as number), little, buf, GPS_TAGS);
        const gpsOut: Record<string, unknown> = {};
        for (const e of gps) gpsOut[GPS_TAGS[e.tag] || `GPSTag_0x${e.tag.toString(16)}`] = e.value;
        if (Array.isArray(gpsOut.GPSLatitude) && Array.isArray(gpsOut.GPSLongitude)) {
            const toDeg = (arr: number[]) => arr[0] + arr[1] / 60 + arr[2] / 3600;
            const lat = toDeg(gpsOut.GPSLatitude as number[]) * (gpsOut.GPSLatitudeRef === "S" ? -1 : 1);
            const lon = toDeg(gpsOut.GPSLongitude as number[]) * (gpsOut.GPSLongitudeRef === "W" ? -1 : 1);
            gpsOut.GPSDecimal = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        }
        out.GPS = gpsOut;
        delete out.GPSOffset;
    }
    return out;
}

function readIfd(view: DataView, base: number, ifdOffset: number, little: boolean, buf: ArrayBuffer, tagMap: Record<number, string>): IfdEntry[] {
    if (ifdOffset + 2 > view.byteLength) return [];
    const count = view.getUint16(ifdOffset, little);
    const out: IfdEntry[] = [];
    for (let i = 0; i < count; i++) {
        const entryOffset = ifdOffset + 2 + i * 12;
        if (entryOffset + 12 > view.byteLength) break;
        const tag = view.getUint16(entryOffset, little);
        const type = view.getUint16(entryOffset + 2, little);
        const num = view.getUint32(entryOffset + 4, little);
        const valOff = entryOffset + 8;
        out.push({ tag, value: readValue(view, base, valOff, type, num, little, buf) });
        void tagMap;
    }
    return out;
}

function readValue(view: DataView, base: number, valOff: number, type: number, num: number, little: boolean, buf: ArrayBuffer): unknown {
    const sizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
    const sz = sizes[type] || 1;
    const totalBytes = sz * num;
    const dataOffset = totalBytes <= 4 ? valOff : base + view.getUint32(valOff, little);
    if (dataOffset + totalBytes > view.byteLength) return null;
    if (type === 2) {
        return String.fromCharCode(...new Uint8Array(buf, dataOffset, num)).replace(/\0+$/, "");
    }
    if (type === 3) {
        if (num === 1) return view.getUint16(dataOffset, little);
        return Array.from({ length: num }, (_, i) => view.getUint16(dataOffset + i * 2, little));
    }
    if (type === 4) {
        if (num === 1) return view.getUint32(dataOffset, little);
        return Array.from({ length: num }, (_, i) => view.getUint32(dataOffset + i * 4, little));
    }
    if (type === 5) {
        // unsigned rational: num/den pairs
        if (num === 1) {
            const n = view.getUint32(dataOffset, little);
            const d = view.getUint32(dataOffset + 4, little);
            return d === 0 ? 0 : n / d;
        }
        return Array.from({ length: num }, (_, i) => {
            const n = view.getUint32(dataOffset + i * 8, little);
            const d = view.getUint32(dataOffset + i * 8 + 4, little);
            return d === 0 ? 0 : n / d;
        });
    }
    if (type === 10) {
        if (num === 1) {
            const n = view.getInt32(dataOffset, little);
            const d = view.getInt32(dataOffset + 4, little);
            return d === 0 ? 0 : n / d;
        }
    }
    return null;
}

const GROUP_ORDER = ["Camera", "Lens", "Capture", "Image", "GPS", "Other"];
const GROUP_RULES: Record<string, string[]> = {
    Camera: ["Make", "Model", "Software"],
    Lens: ["LensMake", "LensModel", "LensSpecification", "FocalLength", "FocalLengthIn35mmFilm", "MaxApertureValue", "FNumber", "ApertureValue"],
    Capture: ["DateTime", "DateTimeOriginal", "DateTimeDigitized", "ExposureTime", "ShutterSpeedValue", "ISO", "ExposureBias", "ExposureMode", "ExposureProgram", "MeteringMode", "WhiteBalance", "Flash", "DigitalZoomRatio", "SceneCaptureType"],
    Image: ["Orientation", "XResolution", "YResolution", "ResolutionUnit", "PixelXDimension", "PixelYDimension", "Artist", "Copyright", "ExifVersion"],
};

function groupFor(key: string): string {
    if (key === "GPS") return "GPS";
    for (const g of Object.keys(GROUP_RULES)) {
        if (GROUP_RULES[g].includes(key)) return g;
    }
    return "Other";
}

export default function ExifViewerPage() {
    const { message } = App.useApp();
    const [filename, setFilename] = useState<string | null>(null);
    const [result, setResult] = useState<Record<string, unknown> | { error: string } | null>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    const upload = {
        beforeUpload: async (file: File) => {
            setFilename(file.name);
            const reader = new FileReader();
            reader.onload = () => { setImgSrc(reader.result as string); };
            reader.readAsDataURL(file);
            try {
                const buf = await file.arrayBuffer();
                setResult(readExif(buf));
            } catch (err) {
                setResult({ error: err instanceof Error ? err.message : String(err) });
            }
            return false;
        },
        showUploadList: false,
        accept: "image/jpeg,image/tiff,.jpg,.jpeg,.tif,.tiff",
    };

    const copyJson = async () => {
        if (!result) return;
        await copyToClipboard(JSON.stringify(result, null, 2));
        message.success("EXIF JSON copied");
    };

    const groups: Record<string, [string, unknown][]> = {};
    if (result && !("error" in result)) {
        Object.entries(result).forEach(([k, v]) => {
            const g = groupFor(k);
            (groups[g] = groups[g] || []).push([k, v]);
        });
    }

    return (
        <ToolPageLayout
            title="EXIF Viewer"
            description="Inspect EXIF, GPS and IPTC metadata embedded in JPEG and TIFF photos"
            icon={<EyeOutlined style={{ fontSize: 24, color: "#0c4a6e" }} />}
            color="#0c4a6e"
            learnMore={{
                whatIs: "EXIF Viewer parses the EXIF metadata segment (APP1) of JPEG/TIFF photos and surfaces camera, lens, capture and GPS information. Parsing runs entirely in your browser — the file is read into an ArrayBuffer and never uploaded.",
                whyUse: "EXIF is rich with information photographers care about (shutter, aperture, ISO, lens, GPS) — and information you may want to scrub before publishing (GPS location, camera serial).",
                howToUse: [
                    "Drop or select a JPEG or TIFF file",
                    "Inspect the grouped tags",
                    "If GPS data is present, a decimal lat/lon is computed for you",
                    "Copy the full EXIF as JSON for scripts or reports",
                ],
                tips: [
                    "PNG files almost never carry EXIF — convert to JPEG or use a tool that reads PNG tEXt chunks",
                    "Smartphone screenshots usually strip EXIF; original camera/phone photos keep it",
                    "If GPS data appears, the photo has the original capture location attached",
                ],
                useCases: [
                    "Auditing photos before publishing (privacy/compliance)",
                    "Reading lens/camera settings without booting Lightroom",
                    "Recovering capture date from corrupted file timestamps",
                ],
            }}
        >
            {!result ? (
                <Card>
                    <Dragger {...upload} style={{ padding: 32 }}>
                        <UploadOutlined style={{ fontSize: 36, color: "#0c4a6e" }} />
                        <Text style={{ display: "block", marginTop: 12, fontSize: 16 }}>Drop JPEG/TIFF or click</Text>
                        <Text type="secondary">Files stay in your browser</Text>
                    </Dragger>
                </Card>
            ) : (
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <Card size="small" title={<Tag>{filename}</Tag>}>
                            {imgSrc && <img src={imgSrc} alt={filename || ""} style={{ width: "100%", display: "block", borderRadius: 4 }} />}
                            <Space style={{ marginTop: 12 }}>
                                <Button size="small" onClick={() => { setResult(null); setFilename(null); setImgSrc(null); }}>Choose another</Button>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} md={16}>
                        {"error" in result ? (
                            <Card><Text type="danger">{String(result.error)}</Text></Card>
                        ) : (
                            <>
                                <Card size="small" extra={<a onClick={copyJson}><CopyOutlined /> Copy as JSON</a>}>
                                    <Space wrap>
                                        <Tag color="blue">{Object.keys(result).length} tags</Tag>
                                        {result.GPS ? <Tag color="orange">GPS present</Tag> : null}
                                    </Space>
                                </Card>
                                {GROUP_ORDER.filter((g) => groups[g]?.length).map((g) => (
                                    <Card size="small" title={g} key={g} style={{ marginTop: 16 }}>
                                        <table style={{ width: "100%", fontFamily: "var(--font-geist-mono)", fontSize: 12 }}>
                                            <tbody>
                                                {groups[g].map(([k, v]) => (
                                                    <tr key={k}>
                                                        <td style={{ padding: "4px 8px", color: "#888", verticalAlign: "top", width: "35%" }}>{k}</td>
                                                        <td style={{ padding: "4px 8px", wordBreak: "break-all" }}>
                                                            {typeof v === "object" && v !== null
                                                                ? <pre style={{ margin: 0, fontFamily: "inherit", fontSize: 11 }}>{JSON.stringify(v, null, 2)}</pre>
                                                                : String(v)}
                                                            {k === "GPSDecimal" && typeof v === "string" && (
                                                                <a target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/?mlat=${encodeURIComponent(v.split(",")[0])}&mlon=${encodeURIComponent(v.split(",")[1].trim())}#map=15/${encodeURIComponent(v)}`} style={{ marginLeft: 8 }}>open in map ↗</a>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Card>
                                ))}
                                {Object.keys(result).length === 0 && (
                                    <Card style={{ marginTop: 16 }}><Empty description="No EXIF tags found in this file" /></Card>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            )}
        </ToolPageLayout>
    );
}
