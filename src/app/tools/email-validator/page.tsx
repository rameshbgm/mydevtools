"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Button, Card, Input, Space, Typography, Tag, Table, Switch } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClearOutlined, MailOutlined } from "@ant-design/icons";
import EmailMxDiagnostic from "@/components/EmailMxDiagnostic";
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
    const { t } = useLanguage();
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
            title={t("Email Validator")}
            description={t("Check email syntax, common disposable/role patterns and optional public DNS mail records")}
            icon={<MailOutlined style={{ fontSize: 24, color: "var(--wb-accent)" }} />}
            color="#1677ff"
            learnMore={{
                whatIs:
                    t("This practical ASCII email check validates common unquoted address syntax and flags issues like disposable temp-mail domains, role-based accounts (admin@, info@), excessive length, and malformed local parts."),
                whyUse:
                    t("Catch typos and bad submissions before they hit your database. Filter out disposable signups, identify role accounts that won't accept marketing mail, and clean bulk lists before importing into your CRM or mailing platform."),
                howToUse: [
                    t("Paste a single email address into the top field for instant validation"),
                    t("Or paste many addresses (one per line) into the Bulk Validate panel"),
                    t("Toggle Disposable and Role filters to control what counts as valid"),
                ],
                tips: [
                    t("This checker accepts common unquoted ASCII local parts; quoted addresses, comments and internationalized local parts need a fuller email parser."),
                    t("Disposable lookups use a built-in list of common temp-mail domains"),
                    t("Use the optional DNS-over-HTTPS check below to inspect MX records; mailbox verification still requires a mail-delivery workflow."),
                ],
                useCases: [
                    t("Cleaning email lists before bulk send"),
                    t("Pre-validating signup forms client-side"),
                    t("Auditing CRM exports for bad addresses"),
                ],
            }}
        >
            <Card title={t("Single Email")} style={{ marginBottom: 16 }}>
                <Space.Compact style={{ width: "100%" }}>
                    <Input
                        dir="ltr"
                        aria-label={t("Single Email")}
                        size="large"
                        prefix={<MailOutlined />}
                        placeholder={t("Enter email address")}
                        value={single}
                        onChange={(e) => setSingle(e.target.value)}
                    />
                    <Button size="large" icon={<ClearOutlined />} onClick={() => setSingle("")}>{t("Clear")}</Button>
                </Space.Compact>
                <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 12 }}>
                    <Tag
                        icon={singleResult.syntaxValid ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        color={singleResult.syntaxValid ? "success" : "error"}
                    >
                        {t(singleResult.syntaxValid ? "Valid syntax" : "Invalid")}
                    </Tag>
                    {singleResult.isDisposable && <Tag color="warning">{t("Disposable")}</Tag>}
                    {singleResult.isRole && <Tag color="purple">{t("Role account")}</Tag>}
                    {singleResult.domain && <Tag>{t("Domain:")} <bdi dir="ltr">{singleResult.domain}</bdi></Tag>}
                    {singleResult.localPart && <Tag>{t("Local:")} <bdi dir="ltr">{singleResult.localPart}</bdi></Tag>}
                </div>
                {singleResult.issues.length > 0 && (
                    <ul style={{ marginTop: 12, color: "var(--wb-text-body)", fontSize: 13 }}>
                        {singleResult.issues.map((i, idx) => (
                            <li key={idx}>{t(i)}</li>
                        ))}
                    </ul>
                )}
            </Card>

            <Card
                title={t("Bulk Validate")}
                extra={
                    <Space>
                        <Text style={{ fontSize: 12 }}>{t("Allow disposable")}</Text>
                        <Switch aria-label={t("Allow disposable")} checked={allowDisposable} onChange={setAllowDisposable} size="small" />
                        <Text style={{ fontSize: 12 }}>{t("Allow role")}</Text>
                        <Switch aria-label={t("Allow role")} checked={allowRole} onChange={setAllowRole} size="small" />
                    </Space>
                }
            >
                <TextArea
                    dir="ltr"
                    aria-label={t("Bulk Validate")}
                    rows={8}
                    placeholder={t("One email per line")}
                    value={bulk}
                    onChange={(e) => setBulk(e.target.value)}
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}
                />
                <div style={{ marginTop: 12, marginBottom: 16, display: "flex", gap: 8 }}>
                    <Tag color="default">{t("Total: {count}", { count: summary.total })}</Tag>
                    <Tag color="success">{t("Valid: {count}", { count: summary.valid })}</Tag>
                    <Tag color="error">{t("Invalid: {count}", { count: summary.invalid })}</Tag>
                </div>
                <Table
                    size="small"
                    dataSource={bulkResults}
                    rowKey={(r, idx) => `${idx}-${r.email}`}
                    pagination={{ pageSize: 10 }}
                    columns={[
                        { title: t("Email"), dataIndex: "email", key: "email", ellipsis: true, render: (value: string) => <bdi dir="ltr">{value}</bdi> },
                        {
                            title: t("Status"),
                            key: "status",
                            render: (_, r: ValidationResult) => {
                                const blocked =
                                    !r.syntaxValid ||
                                    (!allowDisposable && r.isDisposable) ||
                                    (!allowRole && r.isRole);
                                return blocked ? <Tag color="error">{t("Invalid")}</Tag> : <Tag color="success">{t("Valid")}</Tag>;
                            },
                        },
                        {
                            title: t("Flags"),
                            key: "flags",
                            render: (_, r: ValidationResult) => (
                                <Space size={4} wrap>
                                    {r.isDisposable && <Tag color="warning">{t("disposable")}</Tag>}
                                    {r.isRole && <Tag color="purple">{t("role")}</Tag>}
                                    {r.issues
                                        .filter((i) => i !== "Disposable domain" && i !== "Role-based account")
                                        .map((i, ix) => (
                                            <Tag key={ix} color="error">{t(i)}</Tag>
                                        ))}
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>
            <EmailMxDiagnostic domain={singleResult.syntaxValid ? singleResult.domain : ""} />
        </ToolPageLayout>
    );
}
