"use client";

import React, { useState } from "react";
import { Button, Card, Space, Typography, Row, Col, Input, Checkbox, Tooltip } from "antd";
import { FileProtectOutlined, CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text } = Typography;

interface Permission {
    read: boolean;
    write: boolean;
    execute: boolean;
}

interface Permissions {
    owner: Permission;
    group: Permission;
    others: Permission;
}

const PERMISSION_DESCRIPTIONS = {
    owner: { read: "Owner can read", write: "Owner can write", execute: "Owner can execute" },
    group: { read: "Group can read", write: "Group can write", execute: "Group can execute" },
    others: { read: "Others can read", write: "Others can write", execute: "Others can execute" },
};

function permissionToNumber(perm: Permission): number {
    return (perm.read ? 4 : 0) + (perm.write ? 2 : 0) + (perm.execute ? 1 : 0);
}

function numberToPermission(num: number): Permission {
    return {
        read: (num & 4) !== 0,
        write: (num & 2) !== 0,
        execute: (num & 1) !== 0,
    };
}

function permissionToSymbolic(perm: Permission): string {
    return (perm.read ? "r" : "-") + (perm.write ? "w" : "-") + (perm.execute ? "x" : "-");
}

function permissionsToOctal(perms: Permissions): string {
    return `${permissionToNumber(perms.owner)}${permissionToNumber(perms.group)}${permissionToNumber(perms.others)}`;
}

function permissionsToSymbolic(perms: Permissions): string {
    return permissionToSymbolic(perms.owner) + permissionToSymbolic(perms.group) + permissionToSymbolic(perms.others);
}

function octalToPermissions(octal: string): Permissions | null {
    if (!/^[0-7]{3,4}$/.test(octal)) return null;
    const digits = octal.slice(-3);
    return {
        owner: numberToPermission(parseInt(digits[0], 10)),
        group: numberToPermission(parseInt(digits[1], 10)),
        others: numberToPermission(parseInt(digits[2], 10)),
    };
}

const COMMON_PERMISSIONS = [
    { octal: "755", desc: "Standard for executables", symbolic: "rwxr-xr-x" },
    { octal: "644", desc: "Standard for files", symbolic: "rw-r--r--" },
    { octal: "777", desc: "Full access (not recommended)", symbolic: "rwxrwxrwx" },
    { octal: "700", desc: "Owner only", symbolic: "rwx------" },
    { octal: "600", desc: "Private file", symbolic: "rw-------" },
    { octal: "775", desc: "Group writable", symbolic: "rwxrwxr-x" },
    { octal: "664", desc: "Group writable file", symbolic: "rw-rw-r--" },
    { octal: "750", desc: "Group readable dir", symbolic: "rwxr-x---" },
];

function PermissionGroup({
    label,
    permission,
    onChange,
    descriptions,
}: {
    label: string;
    permission: Permission;
    onChange: (perm: Permission) => void;
    descriptions: { read: string; write: string; execute: string };
}) {
    const { t } = useLanguage();
    return (
        <Card size="small" title={label} style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 8 }}>
                <Tooltip title={t(descriptions.read)}>
                    <div>
                        <Checkbox
                            aria-label={t(descriptions.read)}
                            checked={permission.read}
                            onChange={(e) => onChange({ ...permission, read: e.target.checked })}
                        >
                            <Text strong style={{ color: permission.read ? "#52c41a" : undefined }}>R</Text>
                        </Checkbox>
                    </div>
                </Tooltip>
                <Tooltip title={t(descriptions.write)}>
                    <div>
                        <Checkbox
                            aria-label={t(descriptions.write)}
                            checked={permission.write}
                            onChange={(e) => onChange({ ...permission, write: e.target.checked })}
                        >
                            <Text strong style={{ color: permission.write ? "#faad14" : undefined }}>W</Text>
                        </Checkbox>
                    </div>
                </Tooltip>
                <Tooltip title={t(descriptions.execute)}>
                    <div>
                        <Checkbox
                            aria-label={t(descriptions.execute)}
                            checked={permission.execute}
                            onChange={(e) => onChange({ ...permission, execute: e.target.checked })}
                        >
                            <Text strong style={{ color: permission.execute ? "#f5222d" : undefined }}>X</Text>
                        </Checkbox>
                    </div>
                </Tooltip>
            </div>
            <div dir="ltr" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 18 }}>
                {permissionToSymbolic(permission)} = {permissionToNumber(permission)}
            </div>
        </Card>
    );
}

export default function UnixPermissionsPage() {
    const { t } = useLanguage();
    const [permissions, setPermissions] = useState<Permissions>({
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: false, execute: true },
        others: { read: true, write: false, execute: true },
    });
    const [octalInput, setOctalInput] = useState("755");

    const octal = permissionsToOctal(permissions);
    const symbolic = permissionsToSymbolic(permissions);

    const handleOctalChange = (value: string) => {
        setOctalInput(value);
        const parsed = octalToPermissions(value);
        if (parsed) {
            setPermissions(parsed);
        }
    };

    const applyPreset = (preset: string) => {
        const parsed = octalToPermissions(preset);
        if (parsed) {
            setPermissions(parsed);
            setOctalInput(preset);
        }
    };

    return (
        <ToolPageLayout
            title={t("Unix Permissions Calculator")}
            description={t("Calculate chmod values and understand file permissions")}
            icon={<FileProtectOutlined style={{ fontSize: 24, color: "#fa541c" }} />}
            color="#fa541c"
            learnMore={{
                whatIs: "Unix file permissions control who can read, write, and execute files. Permissions are set for owner, group, and others. This calculator converts between symbolic (rwx) and numeric (755) notation.",
                whyUse: "Setting correct permissions is crucial for security. Incorrect permissions can expose sensitive files or break applications. This tool helps understand and set the right values.",
                howToUse: [
                    "Enter a numeric chmod value (e.g., 755) or use checkboxes",
                    "See the symbolic representation (rwxr-xr-x)",
                    "Understand what each permission means",
                    "Copy the chmod command for terminal use"
                ],
                tips: [
                    "7 = rwx (read+write+execute = 4+2+1)",
                    "755 = rwxr-xr-x (common for directories)",
                    "644 = rw-r--r-- (common for files)",
                    "600 = rw------- (private files like SSH keys)"
                ],
                useCases: [
                    "Setting correct permissions for web server files",
                    "Securing sensitive configuration files",
                    "Understanding ls -l permission output",
                    "Troubleshooting 'permission denied' errors"
                ]
            }}
        >
            <Row className="signal-working-panes" gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    {/* Result Display */}
                    <Card style={{ marginBottom: 24 }}>
                        <Row gutter={24} align="middle">
                            <Col xs={12} style={{ textAlign: "center" }}>
                                <Text type="secondary">{t("Octal (Numeric)")}</Text>
                                <div
                                    dir="ltr"
                                    style={{
                                        fontSize: 48,
                                        fontWeight: 700,
                                        fontFamily: "var(--font-geist-mono)",
                                        color: "#fa541c",
                                    }}
                                >
                                    {octal}
                                </div>
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(octal)}
                                    style={{ marginTop: 8 }}
                                >
                                    {t("Copy")}</Button>
                            </Col>
                            <Col xs={12} style={{ textAlign: "center" }}>
                                <Text type="secondary">{t("Symbolic")}</Text>
                                <div
                                    dir="ltr"
                                    style={{
                                        fontSize: 32,
                                        fontWeight: 600,
                                        fontFamily: "var(--font-geist-mono)",
                                    }}
                                >
                                    -{symbolic}
                                </div>
                                <Button
                                    icon={<CopyOutlined />}
                                    onClick={() => copyToClipboard(`-${symbolic}`)}
                                    style={{ marginTop: 8 }}
                                >
                                    {t("Copy")}</Button>
                            </Col>
                        </Row>
                    </Card>

                    {/* Permission Toggles */}
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <PermissionGroup
                                label={t("Owner (User)")}
                                permission={permissions.owner}
                                onChange={(p) => setPermissions({ ...permissions, owner: p })}
                                descriptions={PERMISSION_DESCRIPTIONS.owner}
                            />
                        </Col>
                        <Col xs={24} md={8}>
                            <PermissionGroup
                                label={t("Group")}
                                permission={permissions.group}
                                onChange={(p) => setPermissions({ ...permissions, group: p })}
                                descriptions={PERMISSION_DESCRIPTIONS.group}
                            />
                        </Col>
                        <Col xs={24} md={8}>
                            <PermissionGroup
                                label={t("Others (World)")}
                                permission={permissions.others}
                                onChange={(p) => setPermissions({ ...permissions, others: p })}
                                descriptions={PERMISSION_DESCRIPTIONS.others}
                            />
                        </Col>
                    </Row>

                    {/* Octal Input */}
                    <Card title={t("Enter Octal Value")} style={{ marginTop: 24 }}>
                        <Space wrap>
                            <Input
                                dir="ltr"
                                aria-label={t("Enter Octal Value")}
                                value={octalInput}
                                onChange={(e) => handleOctalChange(e.target.value)}
                                style={{ width: 120, fontFamily: "var(--font-geist-mono)", fontSize: 18 }}
                                maxLength={4}
                                placeholder="755"
                            />
                            <Text type="secondary">{t("Enter 3 or 4 digit octal value (e.g., 755, 0644)")}</Text>
                        </Space>
                    </Card>

                    {/* Command Preview */}
                    <Card title={t("Command Preview")} style={{ marginTop: 24 }}>
                        <Space orientation="vertical" style={{ width: "100%" }}>
                            <div
                                style={{
                                    padding: 12,
                                    background: "var(--signal-inset)",
                                    borderRadius: 6,
                                    fontFamily: "var(--font-geist-mono)",
                                }}
                            >
                                <Text dir="ltr" copyable={{ tooltips: [t("Copy"), t("Copied!")], text: `chmod ${octal} filename` }}>
                                    chmod {octal} filename
                                </Text>
                            </div>
                            <div
                                style={{
                                    padding: 12,
                                    background: "var(--signal-inset)",
                                    borderRadius: 6,
                                    fontFamily: "var(--font-geist-mono)",
                                }}
                            >
                                <Text dir="ltr" copyable={{ tooltips: [t("Copy"), t("Copied!")], text: `chmod -R ${octal} directory/` }}>
                                    chmod -R {octal} directory/
                                </Text>
                            </div>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    {/* Common Permissions */}
                    <Card title={t("Common Permissions")}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {COMMON_PERMISSIONS.map((p) => (
                                <button
                                    type="button"
                                    key={p.octal}
                                    onClick={() => applyPreset(p.octal)}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: 8,
                                        width: "100%",
                                        color: "inherit",
                                        font: "inherit",
                                        textAlign: "start",
                                        padding: "10px 12px",
                                        background: octal === p.octal ? "rgba(250, 84, 28, 0.1)" : "var(--signal-inset)",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        border: octal === p.octal ? "1px solid var(--wb-card-border)" : "1px solid transparent",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    <div>
                                        <Text strong dir="ltr" style={{ fontFamily: "var(--font-geist-mono)" }}>
                                            {p.octal}
                                        </Text>
                                        <Text dir="ltr" type="secondary" style={{ marginInlineStart: 8, fontSize: 12 }}>
                                            {p.symbolic}
                                        </Text>
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{t(p.desc)}</Text>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Legend */}
                    <Card title={t("Permission Values")} style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text><strong style={{ color: "#52c41a" }}>r</strong> {t("(Read)")}</Text>
                                <Text code>4</Text>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text><strong style={{ color: "#faad14" }}>w</strong> {t("(Write)")}</Text>
                                <Text code>2</Text>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text><strong style={{ color: "#f5222d" }}>x</strong> {t("(Execute)")}</Text>
                                <Text code>1</Text>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Text><strong>-</strong> {t("(None)")}</Text>
                                <Text code>0</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
