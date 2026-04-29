"use client";

import React, { useState, useMemo } from "react";
import { Button, Card, Input, Space, Typography, Tag, Table, Switch } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClearOutlined, MailOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";

const { TextArea } = Input;
const { Text } = Typography;

const RFC_EMAIL_RE =
    /^(?:[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const DISPOSABLE_DOMAINS = new Set([
    "mailinator.com",
    "10minutemail.com",
    "tempmail.com",
    "guerrillamail.com",
    "throwawaymail.com",
    "yopmail.com",
    "trashmail.com",
    "fakeinbox.com",
    "maildrop.cc",
    "tempinbox.com",
    "sharklasers.com",
    "getnada.com",
]);

const ROLE_LOCAL_PARTS = new Set([
    "admin",
    "info",
    "support",
    "sales",
    "contact",
    "noreply",
    "no-reply",
    "postmaster",
    "webmaster",
    "abuse",
    "hostmaster",
    "billing",
    "help",
]);

interface ValidationResult {
    email: string;
    syntaxValid: boolean;
    isDisposable: boolean;
    isRole: boolean;
    domain: string;
    localPart: string;
    issues: string[];
}

function validateEmail(raw: string): ValidationResult {
    const email = raw.trim();
    const issues: string[] = [];
    const result: ValidationResult = {
        email,
        syntaxValid: false,
        isDisposable: false,
        isRole: false,
        domain: "",
        localPart: "",
        issues,
    };

    if (!email) {
        issues.push("Empty");
        return result;
    }
    if (email.length > 254) issues.push("Exceeds 254 chars");
    if (!RFC_EMAIL_RE.test(email)) {
        issues.push("Invalid syntax");
        return result;
    }

    const at = email.lastIndexOf("@");
    const localPart = email.slice(0, at);
    const domain = email.slice(at + 1).toLowerCase();
    result.localPart = localPart;
    result.domain = domain;

    if (localPart.length > 64) issues.push("Local part exceeds 64 chars");
    if (localPart.startsWith(".") || localPart.endsWith(".")) issues.push("Local part starts/ends with dot");
    if (localPart.includes("..")) issues.push("Consecutive dots in local part");

    if (DISPOSABLE_DOMAINS.has(domain)) {
        result.isDisposable = true;
        issues.push("Disposable domain");
    }
    if (ROLE_LOCAL_PARTS.has(localPart.toLowerCase())) {
        result.isRole = true;
        issues.push("Role-based account");
    }

    result.syntaxValid = issues.length === 0 || issues.every((i) => i === "Disposable domain" || i === "Role-based account");
    return result;
}

export default function EmailValidatorPage() {
    const [single, setSingle] = useState("user@example.com");
    const [bulk, setBulk] = useState("alice@example.com\nbob@mailinator.com\nadmin@company.io\nbroken@\n");
    const [allowDisposable, setAllowDisposable] = useState(true);
    const [allowRole, setAllowRole] = useState(true);

    const singleResult = useMemo(() => validateEmail(single), [single]);

    const bulkResults = useMemo(() => {
        return bulk
            .split(/\r?\n/)
            .filter((l) => l.trim())
            .map(validateEmail);
    }, [bulk]);

    const summary = useMemo(() => {
        const total = bulkResults.length;
        const valid = bulkResults.filter((r) => {
            if (!r.syntaxValid) return false;
            if (!allowDisposable && r.isDisposable) return false;
            if (!allowRole && r.isRole) return false;
            return true;
        }).length;
        return { total, valid, invalid: total - valid };
    }, [bulkResults, allowDisposable, allowRole]);

    return (
        <ToolPageLayout
            title="Email Validator"
            description="Validate email addresses with RFC syntax, disposable and role detection"
            icon={<MailOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs:
                    "An email validator checks whether an email address is well-formed according to RFC 5322 syntax rules and flags issues like disposable temp-mail domains, role-based accounts (admin@, info@), excessive length, and malformed local parts.",
                whyUse:
                    "Catch typos and bad submissions before they hit your database. Filter out disposable signups, identify role accounts that won't accept marketing mail, and clean bulk lists before importing into your CRM or mailing platform.",
                howToUse: [
                    "Paste a single email address into the top field for instant validation",
                    "Or paste many addresses (one per line) into the Bulk Validate panel",
                    "Toggle Disposable and Role filters to control what counts as valid",
                ],
                tips: [
                    "RFC 5322 allows surprising characters — apostrophes, plus signs, dots",
                    "Disposable lookups use a built-in list of common temp-mail domains",
                    "DNS / MX-record validation isn't possible in browser (no SMTP)",
                ],
                useCases: [
                    "Cleaning email lists before bulk send",
                    "Pre-validating signup forms client-side",
                    "Auditing CRM exports for bad addresses",
                ],
            }}
        >
            <Card title="Single Email" style={{ marginBottom: 16 }}>
                <Space.Compact style={{ width: "100%" }}>
                    <Input
                        size="large"
                        prefix={<MailOutlined />}
                        placeholder="Enter email address"
                        value={single}
                        onChange={(e) => setSingle(e.target.value)}
                    />
                    <Button size="large" icon={<ClearOutlined />} onClick={() => setSingle("")}>Clear</Button>
                </Space.Compact>
                <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <Tag
                        icon={singleResult.syntaxValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        color={singleResult.syntaxValid ? "success" : "error"}
                    >
                        {singleResult.syntaxValid ? "Valid syntax" : "Invalid"}
                    </Tag>
                    {singleResult.isDisposable && <Tag color="warning">Disposable</Tag>}
                    {singleResult.isRole && <Tag color="purple">Role account</Tag>}
                    {singleResult.domain && <Tag>Domain: {singleResult.domain}</Tag>}
                    {singleResult.localPart && <Tag>Local: {singleResult.localPart}</Tag>}
                </div>
                {singleResult.issues.length > 0 && (
                    <ul style={{ marginTop: 12, color: "#a3a3a3", fontSize: 13 }}>
                        {singleResult.issues.map((i, idx) => (
                            <li key={idx}>{i}</li>
                        ))}
                    </ul>
                )}
            </Card>

            <Card
                title="Bulk Validate"
                extra={
                    <Space>
                        <Text style={{ fontSize: 12 }}>Allow disposable</Text>
                        <Switch checked={allowDisposable} onChange={setAllowDisposable} size="small" />
                        <Text style={{ fontSize: 12 }}>Allow role</Text>
                        <Switch checked={allowRole} onChange={setAllowRole} size="small" />
                    </Space>
                }
            >
                <TextArea
                    rows={8}
                    placeholder="One email per line"
                    value={bulk}
                    onChange={(e) => setBulk(e.target.value)}
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                />
                <div style={{ marginTop: 12, marginBottom: 16, display: "flex", gap: 8 }}>
                    <Tag color="default">Total: {summary.total}</Tag>
                    <Tag color="success">Valid: {summary.valid}</Tag>
                    <Tag color="error">Invalid: {summary.invalid}</Tag>
                </div>
                <Table
                    size="small"
                    dataSource={bulkResults}
                    rowKey={(r, idx) => `${idx}-${r.email}`}
                    pagination={{ pageSize: 10 }}
                    columns={[
                        { title: "Email", dataIndex: "email", key: "email", ellipsis: true },
                        {
                            title: "Status",
                            key: "status",
                            render: (_, r: ValidationResult) => {
                                const blocked =
                                    !r.syntaxValid ||
                                    (!allowDisposable && r.isDisposable) ||
                                    (!allowRole && r.isRole);
                                return blocked ? <Tag color="error">Invalid</Tag> : <Tag color="success">Valid</Tag>;
                            },
                        },
                        {
                            title: "Flags",
                            key: "flags",
                            render: (_, r: ValidationResult) => (
                                <Space size={4} wrap>
                                    {r.isDisposable && <Tag color="warning">disposable</Tag>}
                                    {r.isRole && <Tag color="purple">role</Tag>}
                                    {r.issues
                                        .filter((i) => i !== "Disposable domain" && i !== "Role-based account")
                                        .map((i, ix) => (
                                            <Tag key={ix} color="error">{i}</Tag>
                                        ))}
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>
        </ToolPageLayout>
    );
}
