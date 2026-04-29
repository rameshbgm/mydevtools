"use client";

import React, { useState, useCallback } from "react";
import { Card, Input, Typography, Row, Col, Button, Space, Select, Collapse, Tag, Alert, Spin, Segmented } from "antd";
import { CodeOutlined, CopyOutlined, BulbOutlined, ThunderboltOutlined, BookOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;

type ExplanationLevel = "beginner" | "intermediate" | "expert";
type ExplanationStyle = "detailed" | "summary" | "comments";

interface CodePattern {
    name: string;
    description: string;
    examples: string[];
}

const CODE_PATTERNS: CodePattern[] = [
    { name: "Loop", description: "Iterates over elements repeatedly", examples: ["for", "while", "forEach", "map"] },
    { name: "Conditional", description: "Makes decisions based on conditions", examples: ["if", "else", "switch", "?:"] },
    { name: "Function", description: "Reusable block of code", examples: ["function", "=>", "def", "fn"] },
    { name: "Variable", description: "Stores a value", examples: ["const", "let", "var", "val"] },
    { name: "Class", description: "Blueprint for objects", examples: ["class", "struct", "interface"] },
    { name: "Import", description: "Includes external code", examples: ["import", "require", "from", "include"] },
    { name: "Array", description: "Ordered collection of items", examples: ["[", "Array", "List", "Vec"] },
    { name: "Object", description: "Key-value data structure", examples: ["{", "Object", "Map", "dict"] },
    { name: "Async", description: "Asynchronous operation", examples: ["async", "await", "Promise", "Future"] },
    { name: "Error Handling", description: "Manages errors gracefully", examples: ["try", "catch", "throw", "except"] },
];

const LANGUAGES: Record<string, { name: string; color: string }> = {
    javascript: { name: "JavaScript", color: "#f7df1e" },
    typescript: { name: "TypeScript", color: "#3178c6" },
    python: { name: "Python", color: "#3776ab" },
    java: { name: "Java", color: "#ed8b00" },
    csharp: { name: "C#", color: "#239120" },
    cpp: { name: "C++", color: "#00599c" },
    go: { name: "Go", color: "#00add8" },
    rust: { name: "Rust", color: "#dea584" },
    php: { name: "PHP", color: "#777bb4" },
    ruby: { name: "Ruby", color: "#cc342d" },
    swift: { name: "Swift", color: "#fa7343" },
    kotlin: { name: "Kotlin", color: "#7f52ff" },
};

interface ExplanationResult {
    overview: string;
    lineByLine: { line: number; code: string; explanation: string }[];
    patterns: string[];
    complexity: "simple" | "moderate" | "complex";
    suggestions: string[];
}

export default function CodeExplainerPage() {
    const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}`);
    const [language, setLanguage] = useState("javascript");
    const [level, setLevel] = useState<ExplanationLevel>("intermediate");
    const [style, setStyle] = useState<ExplanationStyle>("detailed");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ExplanationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const detectPatterns = (codeStr: string): string[] => {
        const detected: string[] = [];
        const lower = codeStr.toLowerCase();

        CODE_PATTERNS.forEach((pattern) => {
            if (pattern.examples.some((ex) => lower.includes(ex.toLowerCase()))) {
                detected.push(pattern.name);
            }
        });

        return [...new Set(detected)];
    };

    const analyzeComplexity = (codeStr: string): "simple" | "moderate" | "complex" => {
        const lines = codeStr.split("\n").filter((l) => l.trim()).length;
        const nestingLevel = (codeStr.match(/{/g) || []).length;
        const hasAsync = /async|await|Promise|then/.test(codeStr);
        const hasRecursion = /function\s+(\w+)[\s\S]*?\1\s*\(/.test(codeStr);

        const score = lines * 0.5 + nestingLevel * 2 + (hasAsync ? 3 : 0) + (hasRecursion ? 4 : 0);

        if (score < 10) return "simple";
        if (score < 25) return "moderate";
        return "complex";
    };

    const generateLineExplanations = (codeStr: string, lvl: ExplanationLevel): { line: number; code: string; explanation: string }[] => {
        const lines = codeStr.split("\n");
        const explanations: { line: number; code: string; explanation: string }[] = [];

        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "{" || trimmed === "}") return;

            let explanation = "";

            // Simple pattern matching for explanations
            if (/^(function|const|let|var)\s+\w+/.test(trimmed)) {
                const name = trimmed.match(/(?:function|const|let|var)\s+(\w+)/)?.[1];
                if (/function/.test(trimmed) || /=>/.test(trimmed)) {
                    explanation = lvl === "beginner"
                        ? `Defines a function called "${name}". Functions are reusable blocks of code that perform a specific task.`
                        : `Declares function "${name}".`;
                } else {
                    explanation = lvl === "beginner"
                        ? `Creates a variable called "${name}" to store a value.`
                        : `Variable declaration: ${name}`;
                }
            } else if (/^if\s*\(/.test(trimmed)) {
                explanation = lvl === "beginner"
                    ? "Checks a condition. If true, the code inside runs. This is called a conditional statement."
                    : "Conditional check.";
            } else if (/^for\s*\(/.test(trimmed)) {
                explanation = lvl === "beginner"
                    ? "Starts a loop that repeats code multiple times. Loops are used to avoid writing the same code over and over."
                    : "For loop iteration.";
            } else if (/^while\s*\(/.test(trimmed)) {
                explanation = lvl === "beginner"
                    ? "A while loop that keeps running as long as the condition is true."
                    : "While loop.";
            } else if (/^return\s/.test(trimmed)) {
                explanation = lvl === "beginner"
                    ? "Sends a value back from the function. This is the result the function produces."
                    : "Returns value from function.";
            } else if (/\.\w+\s*\(/.test(trimmed)) {
                const method = trimmed.match(/\.(\w+)\s*\(/)?.[1];
                explanation = lvl === "beginner"
                    ? `Calls the "${method}" method. Methods are functions that belong to objects.`
                    : `Method call: ${method}`;
            } else if (/=/.test(trimmed) && !/==/.test(trimmed)) {
                explanation = lvl === "beginner"
                    ? "Assigns a value. The equals sign (=) stores the value on the right into the variable on the left."
                    : "Assignment operation.";
            } else {
                explanation = "Code statement.";
            }

            if (explanation) {
                explanations.push({ line: idx + 1, code: line, explanation });
            }
        });

        return explanations;
    };

    const generateOverview = (codeStr: string, patterns: string[], complexity: string): string => {
        const funcMatch = codeStr.match(/(?:function|const|let|var)\s+(\w+)/);
        const funcName = funcMatch?.[1] || "code";

        let overview = `This ${complexity} ${LANGUAGES[language]?.name || language} code `;

        if (funcMatch) {
            overview += `defines a function called "${funcName}". `;
        }

        if (patterns.length > 0) {
            overview += `It uses ${patterns.slice(0, 3).join(", ")}${patterns.length > 3 ? ` and ${patterns.length - 3} more patterns` : ""}. `;
        }

        return overview;
    };

    const generateSuggestions = (codeStr: string): string[] => {
        const suggestions: string[] = [];

        if (!codeStr.includes("//") && !codeStr.includes("/*")) {
            suggestions.push("Add comments to explain complex logic");
        }
        if (/var\s/.test(codeStr)) {
            suggestions.push("Consider using 'const' or 'let' instead of 'var' for better scoping");
        }
        if (codeStr.split("\n").some((l) => l.length > 100)) {
            suggestions.push("Some lines are very long. Consider breaking them up for readability");
        }
        if (/console\.log/.test(codeStr)) {
            suggestions.push("Remove console.log statements before production");
        }

        return suggestions;
    };

    const explainCode = useCallback(() => {
        setError(null);
        setResult(null);

        if (!code.trim()) {
            setError("Please enter some code to explain");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            try {
                const patterns = detectPatterns(code);
                const complexity = analyzeComplexity(code);
                const lineByLine = generateLineExplanations(code, level);
                const overview = generateOverview(code, patterns, complexity);
                const suggestions = generateSuggestions(code);

                setResult({
                    overview,
                    lineByLine,
                    patterns,
                    complexity,
                    suggestions,
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, 600);
    }, [code, language, level, style]);

    const getComplexityColor = (c: string) => {
        switch (c) {
            case "simple": return "#52c41a";
            case "moderate": return "#faad14";
            case "complex": return "#f5222d";
            default: return "#8c8c8c";
        }
    };

    return (
        <ToolPageLayout
            title="Code Explainer"
            description="Understand code with AI-powered explanations"
            icon={<CodeOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
            color="#1677ff"
            learnMore={{
                whatIs: "The Code Explainer uses AI to analyze code and generate human-readable explanations. It breaks down complex logic, explains patterns, and helps you understand unfamiliar codebases or algorithms.",
                whyUse: "Understanding someone else's code can be challenging. This tool accelerates learning, helps in code reviews, and assists with onboarding to new projects by providing clear explanations.",
                howToUse: [
                    "Select the programming language",
                    "Paste the code you want to understand",
                    "Choose explanation depth (beginner to expert)",
                    "Read the generated explanation with highlights"
                ],
                tips: [
                    "Smaller, focused code snippets get better explanations",
                    "Include function/class context for better understanding",
                    "Use 'beginner' level for learning new concepts",
                    "Expert level includes performance and design patterns"
                ],
                useCases: [
                    "Understanding legacy code during maintenance",
                    "Learning new frameworks and libraries",
                    "Code review preparation",
                    "Onboarding to new projects"
                ]
            }}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={14}>
                    <Card title="Code Input">
                        <Space style={{ marginBottom: 16 }}>
                            <Select
                                value={language}
                                onChange={setLanguage}
                                style={{ width: 150 }}
                            >
                                {Object.entries(LANGUAGES).map(([key, val]) => (
                                    <Select.Option key={key} value={key}>
                                        <span style={{ color: val.color }}>●</span> {val.name}
                                    </Select.Option>
                                ))}
                            </Select>

                            <Segmented
                                value={level}
                                onChange={(v) => setLevel(v as ExplanationLevel)}
                                options={[
                                    { value: "beginner", label: "Beginner" },
                                    { value: "intermediate", label: "Intermediate" },
                                    { value: "expert", label: "Expert" },
                                ]}
                            />
                        </Space>

                        <CodeEditor
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            language={language}
                            height={300}
                        />

                        <Button
                            type="primary"
                            size="large"
                            icon={<BulbOutlined />}
                            onClick={explainCode}
                            loading={loading}
                            disabled={!code.trim()}
                            style={{ marginTop: 16 }}
                        >
                            Explain Code
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card title="Explanation">
                        {loading ? (
                            <div style={{ textAlign: "center", padding: 60 }}>
                                <Spin />
                                <Text style={{ display: "block", marginTop: 16 }}>Analyzing code...</Text>
                            </div>
                        ) : error ? (
                            <Alert type="error" message={error} showIcon />
                        ) : result ? (
                            <>
                                <div style={{ marginBottom: 16 }}>
                                    <Space wrap>
                                        <Tag color={getComplexityColor(result.complexity)}>
                                            {result.complexity.charAt(0).toUpperCase() + result.complexity.slice(1)} Complexity
                                        </Tag>
                                        {result.patterns.map((p) => (
                                            <Tag key={p} color="blue">{p}</Tag>
                                        ))}
                                    </Space>
                                </div>

                                <Paragraph style={{ marginBottom: 16 }}>
                                    {result.overview}
                                </Paragraph>

                                <Collapse defaultActiveKey={["lines"]}>
                                    <Panel header="Line-by-Line Explanation" key="lines">
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            {result.lineByLine.map((item) => (
                                                <div
                                                    key={item.line}
                                                    style={{
                                                        padding: 8,
                                                        background: "rgba(22, 119, 255, 0.05)",
                                                        borderRadius: 6,
                                                        borderLeft: "3px solid #1677ff",
                                                    }}
                                                >
                                                    <Text code style={{ fontSize: 11, display: "block", marginBottom: 4 }}>
                                                        L{item.line}: {item.code.trim().slice(0, 50)}{item.code.trim().length > 50 ? "..." : ""}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {item.explanation}
                                                    </Text>
                                                </div>
                                            ))}
                                        </div>
                                    </Panel>

                                    {result.suggestions.length > 0 && (
                                        <Panel header={`Suggestions (${result.suggestions.length})`} key="suggestions">
                                            <ul style={{ paddingLeft: 20, margin: 0 }}>
                                                {result.suggestions.map((s, i) => (
                                                    <li key={i}><Text type="secondary">{s}</Text></li>
                                                ))}
                                            </ul>
                                        </Panel>
                                    )}
                                </Collapse>
                            </>
                        ) : (
                            <div style={{ textAlign: "center", padding: 60, color: "#8c8c8c" }}>
                                <CodeOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
                                <Text style={{ display: "block" }}>
                                    Paste code and click Explain to understand it
                                </Text>
                            </div>
                        )}
                    </Card>

                    <Card title="Pattern Reference" style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {CODE_PATTERNS.slice(0, 6).map((p) => (
                                <Tag key={p.name} style={{ margin: 0 }}>
                                    <QuestionCircleOutlined /> {p.name}
                                </Tag>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </ToolPageLayout>
    );
}
