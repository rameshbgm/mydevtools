"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Space, Typography, Row, Col, Input, List, Tag, App, Alert } from "antd";
import { ClockCircleOutlined, CopyOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/lib/clipboard";
import ToolPageLayout from "@/components/ToolPageLayout";

const { Text, Title } = Typography;

interface CronField {
    value: string;
    valid: boolean;
    description: string;
}

interface ParsedCron {
    minute: CronField;
    hour: CronField;
    dayOfMonth: CronField;
    month: CronField;
    dayOfWeek: CronField;
    valid: boolean;
    humanReadable: string;
}

const FIELD_NAMES = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];
const FIELD_RANGES = [
    { min: 0, max: 59, name: "minute" },
    { min: 0, max: 23, name: "hour" },
    { min: 1, max: 31, name: "day of month" },
    { min: 1, max: 12, name: "month" },
    { min: 0, max: 6, name: "day of week" },
];

const MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const COMMON_EXPRESSIONS = [
    { expr: "* * * * *", desc: "Every minute" },
    { expr: "0 * * * *", desc: "Every hour" },
    { expr: "0 0 * * *", desc: "Every day at midnight" },
    { expr: "0 0 * * 0", desc: "Every Sunday at midnight" },
    { expr: "0 0 1 * *", desc: "First day of every month" },
    { expr: "0 9 * * 1-5", desc: "Weekdays at 9am" },
    { expr: "*/15 * * * *", desc: "Every 15 minutes" },
    { expr: "0 */2 * * *", desc: "Every 2 hours" },
    { expr: "0 9,17 * * *", desc: "9am and 5pm daily" },
    { expr: "0 0 1 1 *", desc: "Every New Year" },
];

function validateField(value: string, min: number, max: number): boolean {
    if (value === "*") return true;

    // Handle step values like */5
    if (value.startsWith("*/")) {
        const step = parseInt(value.slice(2), 10);
        return !isNaN(step) && step >= 1 && step <= max;
    }

    // Handle ranges like 1-5
    if (value.includes("-") && !value.includes(",")) {
        const [start, end] = value.split("-").map((v) => parseInt(v, 10));
        return !isNaN(start) && !isNaN(end) && start >= min && end <= max && start <= end;
    }

    // Handle lists like 1,2,3
    if (value.includes(",")) {
        return value.split(",").every((v) => {
            const num = parseInt(v.trim(), 10);
            return !isNaN(num) && num >= min && num <= max;
        });
    }

    // Single value
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= min && num <= max;
}

function describeField(value: string, fieldIndex: number): string {
    if (value === "*") {
        return `every ${FIELD_RANGES[fieldIndex].name}`;
    }

    if (value.startsWith("*/")) {
        const step = parseInt(value.slice(2), 10);
        return `every ${step} ${FIELD_RANGES[fieldIndex].name}${step > 1 ? "s" : ""}`;
    }

    if (value.includes("-")) {
        const [start, end] = value.split("-");
        if (fieldIndex === 4) {
            return `${DAY_NAMES[parseInt(start, 10)]} through ${DAY_NAMES[parseInt(end, 10)]}`;
        }
        if (fieldIndex === 3) {
            return `${MONTH_NAMES[parseInt(start, 10)]} through ${MONTH_NAMES[parseInt(end, 10)]}`;
        }
        return `${start} through ${end}`;
    }

    if (value.includes(",")) {
        const values = value.split(",").map((v) => v.trim());
        if (fieldIndex === 4) {
            return values.map((v) => DAY_NAMES[parseInt(v, 10)]).join(", ");
        }
        if (fieldIndex === 3) {
            return values.map((v) => MONTH_NAMES[parseInt(v, 10)]).join(", ");
        }
        return values.join(", ");
    }

    if (fieldIndex === 4) return DAY_NAMES[parseInt(value, 10)] || value;
    if (fieldIndex === 3) return MONTH_NAMES[parseInt(value, 10)] || value;
    return value;
}

function parseCron(expression: string): ParsedCron {
    const parts = expression.trim().split(/\s+/);

    if (parts.length !== 5) {
        return {
            minute: { value: "", valid: false, description: "" },
            hour: { value: "", valid: false, description: "" },
            dayOfMonth: { value: "", valid: false, description: "" },
            month: { value: "", valid: false, description: "" },
            dayOfWeek: { value: "", valid: false, description: "" },
            valid: false,
            humanReadable: "Invalid: Expected 5 fields separated by spaces",
        };
    }

    const fields = parts.map((value, index) => ({
        value,
        valid: validateField(value, FIELD_RANGES[index].min, FIELD_RANGES[index].max),
        description: describeField(value, index),
    }));

    const allValid = fields.every((f) => f.valid);

    let humanReadable = "";
    if (allValid) {
        const [minute, hour, dayOfMonth, month, dayOfWeek] = fields;

        // Build human-readable description
        const timeDesc = minute.value === "0" && hour.value === "0" ? "At midnight" :
            minute.value === "0" ? `At ${hour.description}:00` :
                hour.value === "*" ? `At ${minute.description} minutes past every hour` :
                    `At ${hour.description}:${minute.value.padStart(2, "0")}`;

        const dayDesc = dayOfMonth.value === "*" && dayOfWeek.value === "*" ? "every day" :
            dayOfWeek.value !== "*" ? `on ${dayOfWeek.description}` :
                `on day ${dayOfMonth.description} of the month`;

        const monthDesc = month.value === "*" ? "" : `in ${month.description}`;

        humanReadable = `${timeDesc}, ${dayDesc}${monthDesc ? ", " + monthDesc : ""}`;
    } else {
        humanReadable = "Invalid cron expression";
    }

    return {
        minute: fields[0],
        hour: fields[1],
        dayOfMonth: fields[2],
        month: fields[3],
        dayOfWeek: fields[4],
        valid: allValid,
        humanReadable,
    };
}

function getNextRuns(expression: string, count: number = 5): Date[] {
    const parsed = parseCron(expression);
    if (!parsed.valid) return [];

    const runs: Date[] = [];
    const now = new Date();
    const current = new Date(now);
    current.setSeconds(0, 0);

    const parts = expression.trim().split(/\s+/);
    const [minExpr, hourExpr, domExpr, monExpr, dowExpr] = parts;

    const getValues = (expr: string, min: number, max: number): number[] => {
        if (expr === "*") return Array.from({ length: max - min + 1 }, (_, i) => i + min);
        if (expr.startsWith("*/")) {
            const step = parseInt(expr.slice(2), 10);
            return Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step);
        }
        if (expr.includes("-")) {
            const [start, end] = expr.split("-").map((v) => parseInt(v, 10));
            return Array.from({ length: end - start + 1 }, (_, i) => i + start);
        }
        if (expr.includes(",")) {
            return expr.split(",").map((v) => parseInt(v.trim(), 10));
        }
        return [parseInt(expr, 10)];
    };

    const minutes = getValues(minExpr, 0, 59);
    const hours = getValues(hourExpr, 0, 23);
    const daysOfMonth = getValues(domExpr, 1, 31);
    const months = getValues(monExpr, 1, 12);
    const daysOfWeek = getValues(dowExpr, 0, 6);

    // Simple approach: iterate through time
    for (let i = 0; i < 365 * 24 * 60 && runs.length < count; i++) {
        current.setMinutes(current.getMinutes() + 1);

        const min = current.getMinutes();
        const hour = current.getHours();
        const dom = current.getDate();
        const mon = current.getMonth() + 1;
        const dow = current.getDay();

        if (
            minutes.includes(min) &&
            hours.includes(hour) &&
            months.includes(mon) &&
            (domExpr === "*" || dowExpr === "*" ?
                (daysOfMonth.includes(dom) || daysOfWeek.includes(dow)) :
                (daysOfMonth.includes(dom) && daysOfWeek.includes(dow)))
        ) {
            runs.push(new Date(current));
        }
    }

    return runs;
}

export default function CronParserPage() {
    const { message } = App.useApp();
    const [expression, setExpression] = useState("0 9 * * 1-5");
    const [parsed, setParsed] = useState<ParsedCron>(() => parseCron("0 9 * * 1-5"));
    const [nextRuns, setNextRuns] = useState<Date[]>([]);

    useEffect(() => {
        const result = parseCron(expression);
        setParsed(result);
        if (result.valid) {
            setNextRuns(getNextRuns(expression, 5));
        } else {
            setNextRuns([]);
        }
    }, [expression]);

    return (
        <ToolPageLayout
            title="Cron Expression Parser"
            description="Parse, validate and explain cron expressions"
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: "#faad14" }} />}
            color="#faad14"
            learnMore={{
                whatIs: "Cron expressions define schedules for automated tasks. The standard format uses 5-6 fields: minute, hour, day of month, month, day of week, and optionally seconds. This tool parses, validates, and explains expressions.",
                whyUse: "Cron syntax is powerful but cryptic. This tool helps you understand existing expressions, create new ones correctly, and preview when jobs will run - preventing costly scheduling mistakes.",
                howToUse: [
                    "Enter a cron expression in the input field",
                    "View the human-readable explanation",
                    "See the next execution times",
                    "Use the builder for complex expressions"
                ],
                tips: [
                    "Standard cron: minute hour day month weekday",
                    "Use * for 'every', */5 for 'every 5'",
                    "Ranges: 1-5, Lists: 1,3,5, Steps: 0-30/5",
                    "0 0 * * * = midnight, 0 */2 * * * = every 2 hours"
                ],
                useCases: [
                    "Scheduling CI/CD pipeline jobs",
                    "Setting up database backup schedules",
                    "Configuring Kubernetes CronJobs",
                    "Planning automated report generation"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    {/* Input */}
                    <Card>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Cron Expression</Text>
                        </div>
                        <Input
                            size="large"
                            value={expression}
                            onChange={(e) => setExpression(e.target.value)}
                            placeholder="* * * * *"
                            style={{ fontFamily: "var(--font-geist-mono)", fontSize: 20 }}
                            suffix={
                                parsed.valid ? (
                                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                                ) : (
                                    <CloseCircleOutlined style={{ color: "#f5222d" }} />
                                )
                            }
                        />

                        {/* Field Labels */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "0 12px" }}>
                            {FIELD_NAMES.map((name, i) => (
                                <Text key={name} type="secondary" style={{ fontSize: 11 }}>{name}</Text>
                            ))}
                        </div>
                    </Card>

                    {/* Human Readable */}
                    <Card style={{ marginTop: 16 }}>
                        <div
                            style={{
                                padding: 16,
                                background: parsed.valid ? "rgba(250, 173, 20, 0.1)" : "rgba(255, 77, 79, 0.1)",
                                borderRadius: 8,
                                textAlign: "center",
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>
                                {parsed.humanReadable}
                            </Text>
                        </div>
                    </Card>

                    {/* Field Breakdown */}
                    <Card title="Field Breakdown" style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[parsed.minute, parsed.hour, parsed.dayOfMonth, parsed.month, parsed.dayOfWeek].map((field, i) => (
                                <div
                                    key={FIELD_NAMES[i]}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                        padding: "8px 12px",
                                        background: field.valid ? "rgba(0,0,0,0.02)" : "rgba(255, 77, 79, 0.1)",
                                        borderRadius: 8,
                                    }}
                                >
                                    <Text strong style={{ width: 120 }}>{FIELD_NAMES[i]}</Text>
                                    <Tag color={field.valid ? "blue" : "red"} style={{ fontFamily: "var(--font-geist-mono)" }}>
                                        {field.value || "-"}
                                    </Tag>
                                    <Text type="secondary">{field.description || "Invalid"}</Text>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Next Runs */}
                    {nextRuns.length > 0 && (
                        <Card title="Next Scheduled Runs" style={{ marginTop: 16 }}>
                            <List
                                size="small"
                                dataSource={nextRuns}
                                renderItem={(date, index) => (
                                    <List.Item>
                                        <Tag color="green">{index + 1}</Tag>
                                        <Text style={{ fontFamily: "var(--font-geist-mono)" }}>
                                            {date.toLocaleString("en-US", {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Text>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    )}
                </Col>

                <Col xs={24} lg={8}>
                    {/* Common Expressions */}
                    <Card title="Common Expressions">
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {COMMON_EXPRESSIONS.map((e) => (
                                <div
                                    key={e.expr}
                                    onClick={() => setExpression(e.expr)}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 12px",
                                        background: expression === e.expr ? "rgba(250, 173, 20, 0.1)" : "rgba(0,0,0,0.02)",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        border: expression === e.expr ? "1px solid rgba(250, 173, 20, 0.3)" : "1px solid transparent",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    <Text style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13 }}>
                                        {e.expr}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{e.desc}</Text>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Syntax Reference */}
                    <Card title="Syntax Reference" style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                            <div><Tag>*</Tag> any value</div>
                            <div><Tag>,</Tag> value list (1,2,3)</div>
                            <div><Tag>-</Tag> range (1-5)</div>
                            <div><Tag>/</Tag> step (*/15)</div>
                        </div>
                        <div style={{ marginTop: 16, fontSize: 12, color: "#888" }}>
                            <div>Minute: 0-59</div>
                            <div>Hour: 0-23</div>
                            <div>Day of Month: 1-31</div>
                            <div>Month: 1-12</div>
                            <div>Day of Week: 0-6 (Sun-Sat)</div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
