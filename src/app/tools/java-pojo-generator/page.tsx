"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
    Input,
    Select,
    Switch,
    Button,
    Collapse,
    App,
    Tooltip,
    Segmented,
    Tag,
    Badge,
} from "antd";
import {
    CopyOutlined,
    ThunderboltOutlined,
    ClearOutlined,
    CodeOutlined,
    FileOutlined,
    FolderOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";

// ─── Types ───────────────────────────────────────────────────────────

type ConversionMode = "json-to-java" | "xml-to-java" | "java-to-json" | "java-to-xml";
type JavaType = "class" | "record" | "interface" | "annotation" | "enum" | "abstract-class";
type OutputMode = "single-file" | "multiple-files";
type AccessModifier = "private" | "protected" | "public" | "package-private";
type NamingConvention = "camelCase" | "snake_case" | "PascalCase";

interface GeneratorOptions {
    packageName: string;
    rootClassName: string;
    javaType: JavaType;
    outputMode: OutputMode;
    useLombok: boolean;
    useJackson: boolean;
    useGson: boolean;
    useValidation: boolean;
    useJaxb: boolean;
    useSwagger: boolean;
    useJpa: boolean;
    generateBuilder: boolean;
    lombokValue: boolean;
    lombokSuperBuilder: boolean;
    generateGettersSetters: boolean;
    generateToString: boolean;
    generateEqualsHashCode: boolean;
    generateConstructors: boolean;
    usePrimitives: boolean;
    makeFieldsFinal: boolean;
    serializable: boolean;
    fieldAccessModifier: AccessModifier;
    fieldNaming: NamingConvention;
    fieldPrefix: string;
    indentSize: number;
    useTab: boolean;
    includeNulls: boolean;
    prettyPrint: boolean;
    xmlRootElement: string;
}

const DEFAULT_OPTIONS: GeneratorOptions = {
    packageName: "com.example.model",
    rootClassName: "Root",
    javaType: "class",
    outputMode: "single-file",
    useLombok: false,
    useJackson: false,
    useGson: false,
    useValidation: false,
    useJaxb: false,
    useSwagger: false,
    useJpa: false,
    generateBuilder: false,
    lombokValue: false,
    lombokSuperBuilder: false,
    generateGettersSetters: true,
    generateToString: true,
    generateEqualsHashCode: false,
    generateConstructors: true,
    usePrimitives: true,
    makeFieldsFinal: false,
    serializable: false,
    fieldAccessModifier: "private",
    fieldNaming: "camelCase",
    fieldPrefix: "",
    indentSize: 4,
    useTab: false,
    includeNulls: false,
    prettyPrint: true,
    xmlRootElement: "root",
};

// ─── Sample Data ─────────────────────────────────────────────────────

const SAMPLE_JSON = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "active": true,
  "score": 95.5,
  "tags": ["developer", "admin"],
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zipCode": "62701",
    "coordinates": {
      "lat": 39.7817,
      "lng": -89.6501
    }
  },
  "roles": [
    {
      "id": 1,
      "name": "ADMIN",
      "permissions": ["READ", "WRITE", "DELETE"]
    }
  ],
  "metadata": null,
  "createdAt": "2024-01-15T10:30:00Z"
}`;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>1</id>
  <name>John Doe</name>
  <email>john@example.com</email>
  <active>true</active>
  <score>95.5</score>
  <tags>
    <tag>developer</tag>
    <tag>admin</tag>
  </tags>
  <address>
    <street>123 Main St</street>
    <city>Springfield</city>
    <zipCode>62701</zipCode>
  </address>
</user>`;

const SAMPLE_JAVA = `public class User {
    private int id;
    private String name;
    private String email;
    private boolean active;
    private double score;
    private List<String> tags;
    private Address address;
    private List<Role> roles;
    private Object metadata;
    private LocalDateTime createdAt;
}

public class Address {
    private String street;
    private String city;
    private String zipCode;
    private Coordinates coordinates;
}

public class Coordinates {
    private double lat;
    private double lng;
}

public class Role {
    private int id;
    private String name;
    private List<String> permissions;
}`;

// ─── Utilities ───────────────────────────────────────────────────────

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function toClassName(s: string): string {
    return s.replace(/[^a-zA-Z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").split("_").map(capitalize).join("");
}

function toCamelCase(s: string): string {
    const c = toClassName(s);
    return c.charAt(0).toLowerCase() + c.slice(1);
}

function toSnakeCase(s: string): string {
    return s.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
}

function applyNaming(key: string, convention: NamingConvention): string {
    switch (convention) {
        case "snake_case": return toSnakeCase(key);
        case "PascalCase": return toClassName(key);
        default: return toCamelCase(key);
    }
}

const PRIMITIVES = ["int", "long", "double", "float", "boolean", "byte", "short", "char"];

function wrapType(t: string): string {
    const m: Record<string, string> = { int: "Integer", long: "Long", double: "Double", float: "Float", boolean: "Boolean", byte: "Byte", short: "Short", char: "Character" };
    return m[t] ?? t;
}

function inferJavaType(value: unknown, key: string, usePrim: boolean, nested: Map<string, Record<string, unknown>>): string {
    if (value === null || value === undefined) return "Object";
    if (typeof value === "boolean") return usePrim ? "boolean" : "Boolean";
    if (typeof value === "number") {
        if (Number.isInteger(value)) {
            return Math.abs(value) > 2147483647 ? (usePrim ? "long" : "Long") : (usePrim ? "int" : "Integer");
        }
        return usePrim ? "double" : "Double";
    }
    if (typeof value === "string") {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return "LocalDateTime";
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return "LocalDate";
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return "UUID";
        if (/^https?:\/\//.test(value)) return "URI";
        return "String";
    }
    if (Array.isArray(value)) {
        if (value.length === 0) return "List<Object>";
        return `List<${inferJavaType(value[0], key, false, nested)}>`;
    }
    if (typeof value === "object") {
        const cn = toClassName(key);
        nested.set(cn, value as Record<string, unknown>);
        return cn;
    }
    return "Object";
}

// ─── XML Parser ──────────────────────────────────────────────────────

function parseXmlToObject(xml: string): Record<string, unknown> {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const err = doc.querySelector("parsererror");
    if (err) throw new Error("Invalid XML: " + err.textContent);
    return xmlNodeToObj(doc.documentElement);
}

function xmlNodeToObj(node: Element): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    const children = Array.from(node.children);
    if (children.length === 0) return { _text: inferPrim(node.textContent?.trim() ?? "") };
    const groups = new Map<string, Element[]>();
    for (const c of children) {
        if (!groups.has(c.tagName)) groups.set(c.tagName, []);
        groups.get(c.tagName)!.push(c);
    }
    for (const [tag, els] of groups) {
        if (els.length > 1) {
            obj[tag] = els.map((e) => e.children.length === 0 ? inferPrim(e.textContent?.trim() ?? "") : xmlNodeToObj(e));
        } else {
            const e = els[0];
            obj[tag] = e.children.length === 0 ? inferPrim(e.textContent?.trim() ?? "") : xmlNodeToObj(e);
        }
    }
    return obj;
}

function inferPrim(v: string): unknown {
    if (v === "true") return true;
    if (v === "false") return false;
    if (v === "") return null;
    const n = Number(v);
    return !isNaN(n) ? n : v;
}

// ─── Java Parser (for Java→JSON/XML) ────────────────────────────────

interface ParsedClass { name: string; fields: { type: string; name: string }[] }

function parseJavaClasses(code: string): ParsedClass[] {
    const classes: ParsedClass[] = [];
    // class/record
    const rx = /(?:public\s+)?(?:abstract\s+)?(?:class|record)\s+(\w+)(?:\s*\(([^)]*)\))?\s*(?:extends\s+\w+)?\s*(?:implements\s+[\w,\s]+)?\s*\{/g;
    let m;
    while ((m = rx.exec(code)) !== null) {
        const name = m[1];
        const start = m.index + m[0].length;
        let depth = 1, i = start;
        while (i < code.length && depth > 0) { if (code[i] === "{") depth++; if (code[i] === "}") depth--; i++; }
        const body = code.substring(start, i - 1);
        const fields: { type: string; name: string }[] = [];
        // Record components
        if (m[2]) {
            for (const p of m[2].split(",").map((s) => s.trim()).filter(Boolean)) {
                const parts = p.replace(/@\w+(\([^)]*\))?\s*/g, "").trim().split(/\s+/);
                if (parts.length >= 2) fields.push({ type: parts.slice(0, -1).join(" "), name: parts[parts.length - 1] });
            }
        } else {
            const fr = /(?:private|protected|public)?\s*(?:static\s+)?(?:final\s+)?([\w<>,\s\[\]?]+?)\s+(\w+)\s*[;=]/g;
            let fm;
            while ((fm = fr.exec(body)) !== null) {
                if (fm[2] === "serialVersionUID") continue;
                fields.push({ type: fm[1].trim(), name: fm[2] });
            }
        }
        classes.push({ name, fields });
    }
    // interfaces
    const ir = /(?:public\s+)?interface\s+(\w+)\s*(?:extends\s+[\w,\s]+)?\s*\{/g;
    while ((m = ir.exec(code)) !== null) {
        const name = m[1];
        const start = m.index + m[0].length;
        let depth = 1, i = start;
        while (i < code.length && depth > 0) { if (code[i] === "{") depth++; if (code[i] === "}") depth--; i++; }
        const body = code.substring(start, i - 1);
        const fields: { type: string; name: string }[] = [];
        const gr = /([\w<>,\s\[\]?]+)\s+(?:get|is)(\w+)\(\)\s*;/g;
        let gm;
        while ((gm = gr.exec(body)) !== null) {
            fields.push({ type: gm[1].trim(), name: gm[2].charAt(0).toLowerCase() + gm[2].slice(1) });
        }
        classes.push({ name, fields });
    }
    return classes;
}

function typeToDefault(type: string, classes: ParsedClass[], nulls: boolean): unknown {
    const map: Record<string, unknown> = {
        int: 0, Integer: 0, short: 0, Short: 0, byte: 0, Byte: 0,
        long: 0, Long: 0, float: 0.0, Float: 0.0, double: 0.0, Double: 0.0,
        boolean: false, Boolean: false, char: "a", Character: "a",
        String: "string", BigDecimal: "0.00", BigInteger: "0",
        UUID: "00000000-0000-0000-0000-000000000000",
        URI: "https://example.com", URL: "https://example.com",
        LocalDate: "2024-01-15", LocalDateTime: "2024-01-15T10:30:00",
        ZonedDateTime: "2024-01-15T10:30:00Z", OffsetDateTime: "2024-01-15T10:30:00Z",
        Instant: "2024-01-15T10:30:00Z", Date: "2024-01-15T10:30:00Z",
        Object: nulls ? null : "value",
    };
    if (type in map) return map[type];
    const listM = type.match(/^(?:List|Set|Collection|ArrayList|LinkedList|HashSet)<(.+)>$/);
    if (listM) return [typeToDefault(listM[1], classes, nulls)];
    const mapM = type.match(/^(?:Map|HashMap|TreeMap|LinkedHashMap)<(.+),\s*(.+)>$/);
    if (mapM) return { key: typeToDefault(mapM[2], classes, nulls) };
    if (type.endsWith("[]")) return [typeToDefault(type.slice(0, -2), classes, nulls)];
    const nested = classes.find((c) => c.name === type);
    if (nested) return classToObj(nested, classes, nulls);
    return nulls ? null : "value";
}

function classToObj(cls: ParsedClass, all: ParsedClass[], nulls: boolean): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    for (const f of cls.fields) {
        const v = typeToDefault(f.type, all, nulls);
        if (v === null && !nulls) continue;
        obj[f.name] = v;
    }
    return obj;
}

function objToXml(obj: unknown, tag: string, ind: string, lvl: number): string {
    const pad = ind.repeat(lvl);
    if (obj === null || obj === undefined) return `${pad}<${tag}/>\n`;
    if (Array.isArray(obj)) return obj.map((i) => objToXml(i, tag, ind, lvl)).join("");
    if (typeof obj === "object") {
        const entries = Object.entries(obj as Record<string, unknown>);
        if (entries.length === 0) return `${pad}<${tag}/>\n`;
        let x = `${pad}<${tag}>\n`;
        for (const [k, v] of entries) x += objToXml(v, k, ind, lvl + 1);
        return x + `${pad}</${tag}>\n`;
    }
    return `${pad}<${tag}>${String(obj)}</${tag}>\n`;
}

// ─── Java Code Generation ────────────────────────────────────────────

interface FD { type: string; name: string; originalKey: string }

function generateJavaFiles(data: Record<string, unknown>, opts: GeneratorOptions): Map<string, string> {
    const files = new Map<string, string>();
    const done = new Set<string>();
    const queue: { name: string; fields: Record<string, unknown> }[] = [{ name: opts.rootClassName, fields: data }];
    const ind = opts.useTab ? "\t" : " ".repeat(opts.indentSize);

    while (queue.length > 0) {
        const { name, fields } = queue.shift()!;
        if (done.has(name)) continue;
        done.add(name);
        const nested = new Map<string, Record<string, unknown>>();
        const fds: FD[] = [];
        for (const [key, value] of Object.entries(fields)) {
            if (key === "_text") continue;
            const jt = inferJavaType(value, key, opts.usePrimitives, nested);
            fds.push({ type: jt, name: opts.fieldPrefix + applyNaming(key, opts.fieldNaming), originalKey: key });
        }
        for (const [cn, obj] of nested) queue.push({ name: cn, fields: obj });
        const code = buildClassCode(name, fds, opts, ind);
        const lines: string[] = [];
        if (opts.packageName) lines.push(`package ${opts.packageName};`, "");
        lines.push(...buildImports(code, opts));
        lines.push(code);
        files.set(name, lines.join("\n"));
    }
    return files;
}

function buildImports(code: string, opts: GeneratorOptions): string[] {
    const imp = new Set<string>();
    if (code.includes("List<")) imp.add("import java.util.List;");
    if (code.includes("Map<")) imp.add("import java.util.Map;");
    if (code.includes("Set<")) imp.add("import java.util.Set;");
    if (code.includes("LocalDateTime")) imp.add("import java.time.LocalDateTime;");
    if (/LocalDate[^T]/.test(code) || code.endsWith("LocalDate")) imp.add("import java.time.LocalDate;");
    if (code.includes("UUID")) imp.add("import java.util.UUID;");
    if (code.includes("URI")) imp.add("import java.net.URI;");
    if (code.includes("BigDecimal")) imp.add("import java.math.BigDecimal;");
    if (code.includes("Objects.")) imp.add("import java.util.Objects;");
    if (opts.serializable) imp.add("import java.io.Serializable;");
    if (opts.useLombok) {
        if (opts.lombokValue) imp.add("import lombok.Value;");
        else { imp.add("import lombok.Data;"); imp.add("import lombok.NoArgsConstructor;"); imp.add("import lombok.AllArgsConstructor;"); }
        if (opts.generateBuilder) imp.add("import lombok.Builder;");
        if (opts.lombokSuperBuilder) imp.add("import lombok.experimental.SuperBuilder;");
    }
    if (opts.useJackson) {
        imp.add("import com.fasterxml.jackson.annotation.JsonProperty;");
        if (!opts.includeNulls) imp.add("import com.fasterxml.jackson.annotation.JsonInclude;");
    }
    if (opts.useGson) imp.add("import com.google.gson.annotations.SerializedName;");
    if (opts.useValidation) { imp.add("import jakarta.validation.constraints.NotNull;"); imp.add("import jakarta.validation.constraints.NotBlank;"); imp.add("import jakarta.validation.constraints.NotEmpty;"); }
    if (opts.useJaxb) { imp.add("import jakarta.xml.bind.annotation.XmlRootElement;"); imp.add("import jakarta.xml.bind.annotation.XmlElement;"); imp.add("import jakarta.xml.bind.annotation.XmlAccessType;"); imp.add("import jakarta.xml.bind.annotation.XmlAccessorType;"); }
    if (opts.useSwagger) imp.add("import io.swagger.v3.oas.annotations.media.Schema;");
    if (opts.useJpa) { imp.add("import jakarta.persistence.Entity;"); imp.add("import jakarta.persistence.Table;"); imp.add("import jakarta.persistence.Id;"); imp.add("import jakarta.persistence.GeneratedValue;"); imp.add("import jakarta.persistence.GenerationType;"); imp.add("import jakarta.persistence.Column;"); }
    if (imp.size === 0) return [];
    return [...[...imp].sort(), ""];
}

function buildClassCode(name: string, fields: FD[], opts: GeneratorOptions, ind: string): string {
    switch (opts.javaType) {
        case "record": return buildRecord(name, fields, opts, ind);
        case "interface": return buildInterface(name, fields, ind);
        case "annotation": return buildAnnotation(name, fields, ind);
        case "enum": return buildEnum(name, fields, opts, ind);
        case "abstract-class": return buildPojo(name, fields, opts, ind, true);
        default: return buildPojo(name, fields, opts, ind, false);
    }
}

function fieldAnnotations(f: FD, opts: GeneratorOptions, ind: string): string[] {
    const l: string[] = [];
    if (opts.useJackson && f.name !== f.originalKey) l.push(`${ind}@JsonProperty("${f.originalKey}")`);
    if (opts.useGson && f.name !== f.originalKey) l.push(`${ind}@SerializedName("${f.originalKey}")`);
    if (opts.useValidation && !PRIMITIVES.includes(f.type)) {
        if (f.type === "String") l.push(`${ind}@NotBlank`);
        else if (f.type.startsWith("List<") || f.type.startsWith("Set<")) l.push(`${ind}@NotEmpty`);
        else if (f.type !== "Object") l.push(`${ind}@NotNull`);
    }
    if (opts.useJaxb) l.push(`${ind}@XmlElement(name = "${f.originalKey}")`);
    if (opts.useSwagger) l.push(`${ind}@Schema(description = "${f.originalKey}")`);
    if (opts.useJpa) {
        if (f.name === "id" || f.originalKey === "id") { l.push(`${ind}@Id`); l.push(`${ind}@GeneratedValue(strategy = GenerationType.IDENTITY)`); }
        l.push(`${ind}@Column(name = "${toSnakeCase(f.originalKey)}")`);
    }
    return l;
}

function buildPojo(name: string, fields: FD[], opts: GeneratorOptions, ind: string, abs: boolean): string {
    const l: string[] = [];
    if (opts.useLombok) {
        l.push(opts.lombokValue ? "@Value" : "@Data");
        if (!opts.lombokValue) { l.push("@NoArgsConstructor"); l.push("@AllArgsConstructor"); }
        if (opts.lombokSuperBuilder) l.push("@SuperBuilder");
        else if (opts.generateBuilder) l.push("@Builder");
    }
    if (opts.useJackson && !opts.includeNulls) l.push("@JsonInclude(JsonInclude.Include.NON_NULL)");
    if (opts.useJaxb) { l.push(`@XmlRootElement(name = "${toCamelCase(name)}")`); l.push("@XmlAccessorType(XmlAccessType.FIELD)"); }
    if (opts.useJpa) { l.push("@Entity"); l.push(`@Table(name = "${toSnakeCase(name)}")`); }
    if (opts.useSwagger) l.push(`@Schema(description = "${name}")`);

    const absMod = abs ? "abstract " : "";
    const impl = opts.serializable ? " implements Serializable" : "";
    l.push(`public ${absMod}class ${name}${impl} {`);
    if (opts.serializable) { l.push(`${ind}private static final long serialVersionUID = 1L;`); l.push(""); }

    const acc = opts.fieldAccessModifier === "package-private" ? "" : opts.fieldAccessModifier + " ";
    for (const f of fields) {
        l.push(...fieldAnnotations(f, opts, ind));
        l.push(`${ind}${acc}${opts.makeFieldsFinal ? "final " : ""}${f.type} ${f.name};`);
    }

    if (!opts.useLombok && opts.generateConstructors && fields.length > 0) {
        l.push("");
        if (!opts.makeFieldsFinal) { l.push(`${ind}public ${name}() {`); l.push(`${ind}}`); l.push(""); }
        const params = fields.map((f) => `${f.type} ${f.name}`);
        if (params.join(", ").length > 80) {
            l.push(`${ind}public ${name}(`);
            params.forEach((p, i) => l.push(`${ind}${ind}${ind}${p}${i < params.length - 1 ? "," : ""}`));
            l.push(`${ind}) {`);
        } else {
            l.push(`${ind}public ${name}(${params.join(", ")}) {`);
        }
        for (const f of fields) l.push(`${ind}${ind}this.${f.name} = ${f.name};`);
        l.push(`${ind}}`);
    }

    if (!opts.useLombok && opts.generateGettersSetters && fields.length > 0) {
        l.push("");
        for (const f of fields) {
            const cap = capitalize(f.name.replace(/^[_$]+/, ""));
            const g = f.type === "boolean" ? "is" : "get";
            l.push(`${ind}public ${f.type} ${g}${cap}() {`);
            l.push(`${ind}${ind}return ${f.name};`);
            l.push(`${ind}}`);
            if (!opts.makeFieldsFinal) { l.push(""); l.push(`${ind}public void set${cap}(${f.type} ${f.name}) {`); l.push(`${ind}${ind}this.${f.name} = ${f.name};`); l.push(`${ind}}`); }
            l.push("");
        }
    }

    if (!opts.useLombok && opts.generateEqualsHashCode && fields.length > 0) {
        l.push(`${ind}@Override`);
        l.push(`${ind}public boolean equals(Object o) {`);
        l.push(`${ind}${ind}if (this == o) return true;`);
        l.push(`${ind}${ind}if (o == null || getClass() != o.getClass()) return false;`);
        l.push(`${ind}${ind}${name} that = (${name}) o;`);
        const cmp = fields.map((f) => PRIMITIVES.includes(f.type) ? `${f.name} == that.${f.name}` : `Objects.equals(${f.name}, that.${f.name})`);
        l.push(`${ind}${ind}return ${cmp.join(" &&\n" + ind + ind + ind)};`);
        l.push(`${ind}}`);
        l.push("");
        l.push(`${ind}@Override`);
        l.push(`${ind}public int hashCode() {`);
        l.push(`${ind}${ind}return Objects.hash(${fields.map((f) => f.name).join(", ")});`);
        l.push(`${ind}}`);
        l.push("");
    }

    if (!opts.useLombok && opts.generateToString && fields.length > 0) {
        l.push(`${ind}@Override`);
        l.push(`${ind}public String toString() {`);
        const parts = fields.map((f, i) => `"${i === 0 ? name + "{" : ", "}${f.name}=" + ${f.name}`);
        l.push(`${ind}${ind}return ${parts.join(" +\n" + ind + ind + ind)} +`);
        l.push(`${ind}${ind}${ind}"}";\n${ind}}`);
    }
    l.push("}");
    return l.join("\n");
}

function buildRecord(name: string, fields: FD[], opts: GeneratorOptions, ind: string): string {
    const l: string[] = [];
    if (opts.useJackson && !opts.includeNulls) l.push("@JsonInclude(JsonInclude.Include.NON_NULL)");
    if (opts.useSwagger) l.push(`@Schema(description = "${name}")`);
    const params = fields.map((f) => {
        const ann: string[] = [];
        if (opts.useJackson && f.name !== f.originalKey) ann.push(`@JsonProperty("${f.originalKey}")`);
        if (opts.useGson && f.name !== f.originalKey) ann.push(`@SerializedName("${f.originalKey}")`);
        if (opts.useValidation && !PRIMITIVES.includes(f.type)) ann.push(f.type === "String" ? "@NotBlank" : "@NotNull");
        return `${ann.length ? ann.join(" ") + " " : ""}${wrapType(f.type)} ${f.name}`;
    });
    const impl = opts.serializable ? " implements Serializable" : "";
    if (params.join(", ").length > 80) {
        l.push(`public record ${name}(`);
        params.forEach((p, i) => l.push(`${ind}${p}${i < params.length - 1 ? "," : ""}`));
        l.push(`)${impl} {}`);
    } else {
        l.push(`public record ${name}(${params.join(", ")})${impl} {}`);
    }
    return l.join("\n");
}

function buildInterface(name: string, fields: FD[], ind: string): string {
    const l = [`public interface ${name} {`];
    for (const f of fields) {
        const cap = capitalize(f.name.replace(/^[_$]+/, ""));
        const g = f.type === "boolean" || f.type === "Boolean" ? "is" : "get";
        l.push(`${ind}${wrapType(f.type)} ${g}${cap}();`);
    }
    l.push("}");
    return l.join("\n");
}

function buildAnnotation(name: string, fields: FD[], ind: string): string {
    const l: string[] = [
        "import java.lang.annotation.Retention;",
        "import java.lang.annotation.RetentionPolicy;",
        "import java.lang.annotation.Target;",
        "import java.lang.annotation.ElementType;", "",
        "@Retention(RetentionPolicy.RUNTIME)",
        "@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})",
        `public @interface ${name} {`,
    ];
    for (const f of fields) {
        let t = f.type;
        if (!PRIMITIVES.includes(t) && t !== "String") t = t.startsWith("List<") || t.endsWith("[]") ? "String[]" : "String";
        const def: Record<string, string> = { int: "0", long: "0", double: "0.0", float: "0.0", boolean: "false", char: "' '", String: '""', "String[]": "{}" };
        l.push(`${ind}${t} ${f.name}() default ${def[t] ?? '""'};`);
    }
    l.push("}");
    return l.join("\n");
}

function buildEnum(name: string, fields: FD[], opts: GeneratorOptions, ind: string): string {
    const l = [`public enum ${name} {`];
    l.push(`${ind}${fields.map((f) => f.name.replace(/([A-Z])/g, "_$1").toUpperCase()).join(",\n" + ind)};`);
    l.push("");
    for (const f of fields) l.push(`${ind}private final ${f.type} ${f.name};`);
    l.push("");
    l.push(`${ind}${name}(${fields.map((f) => `${f.type} ${f.name}`).join(", ")}) {`);
    for (const f of fields) l.push(`${ind}${ind}this.${f.name} = ${f.name};`);
    l.push(`${ind}}`);
    if (opts.generateGettersSetters) {
        l.push("");
        for (const f of fields) {
            const g = f.type === "boolean" ? "is" : "get";
            l.push(`${ind}public ${f.type} ${g}${capitalize(f.name)}() {`);
            l.push(`${ind}${ind}return ${f.name};`);
            l.push(`${ind}}`);
            l.push("");
        }
    }
    l.push("}");
    return l.join("\n");
}

// ─── Component ───────────────────────────────────────────────────────

export default function JavaPojoGeneratorPage() {
    const { message } = App.useApp();
    const [mode, setMode] = useState<ConversionMode>("json-to-java");
    const [input, setInput] = useState(SAMPLE_JSON);
    const [output, setOutput] = useState("");
    const [outputFiles, setOutputFiles] = useState<Map<string, string>>(new Map());
    const [selectedFile, setSelectedFile] = useState("");
    const [options, setOptions] = useState<GeneratorOptions>({ ...DEFAULT_OPTIONS });

    const updateOpt = useCallback(<K extends keyof GeneratorOptions>(k: K, v: GeneratorOptions[K]) => {
        setOptions((p) => ({ ...p, [k]: v }));
    }, []);

    const isToJava = mode === "json-to-java" || mode === "xml-to-java";
    const inLang = mode === "json-to-java" ? "json" : mode === "xml-to-java" ? "xml" : "java";
    const outLang = isToJava ? "java" : mode === "java-to-json" ? "json" : "xml";

    const handleModeChange = useCallback((val: string | number) => {
        const m = val as ConversionMode;
        setMode(m);
        setOutput("");
        setOutputFiles(new Map());
        switch (m) {
            case "json-to-java": setInput(SAMPLE_JSON); break;
            case "xml-to-java": setInput(SAMPLE_XML); break;
            default: setInput(SAMPLE_JAVA); break;
        }
    }, []);

    const generate = useCallback(() => {
        try {
            if (isToJava) {
                let data: Record<string, unknown>;
                if (mode === "json-to-java") {
                    data = JSON.parse(input);
                    if (Array.isArray(data)) { if (data.length === 0) throw new Error("Empty array"); data = data[0] as Record<string, unknown>; }
                } else {
                    data = parseXmlToObject(input);
                }
                const fm = generateJavaFiles(data, options);
                setOutputFiles(fm);
                if (options.outputMode === "single-file") {
                    setOutput([...fm.values()].join("\n\n// " + "─".repeat(60) + "\n\n"));
                    setSelectedFile([...fm.keys()][0]);
                } else {
                    const first = [...fm.keys()][0];
                    setSelectedFile(first);
                    setOutput(fm.get(first) ?? "");
                }
                message.success(`Generated ${fm.size} Java file${fm.size > 1 ? "s" : ""}!`);
            } else {
                const classes = parseJavaClasses(input);
                if (classes.length === 0) throw new Error("No Java classes found");
                const obj = classToObj(classes[0], classes, options.includeNulls);
                if (mode === "java-to-json") {
                    setOutput(JSON.stringify(obj, null, options.prettyPrint ? 2 : 0));
                } else {
                    const tag = options.xmlRootElement || toCamelCase(classes[0].name);
                    const xi = options.useTab ? "\t" : " ".repeat(options.indentSize);
                    setOutput(`<?xml version="1.0" encoding="UTF-8"?>\n` + objToXml(obj, tag, xi, 0));
                }
                message.success(`Converted to ${mode === "java-to-json" ? "JSON" : "XML"}!`);
            }
        } catch (err: unknown) {
            message.error(`Failed: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    }, [input, mode, options, isToJava, message]);

    const handleFileSelect = useCallback((f: string) => { setSelectedFile(f); setOutput(outputFiles.get(f) ?? ""); }, [outputFiles]);

    const handleCopy = useCallback(() => {
        if (options.outputMode === "multiple-files" && outputFiles.size > 1) {
            copyToClipboard([...outputFiles.entries()].map(([n, c]) => `// ═══ ${n}.java ═══\n\n${c}`).join("\n\n"));
        } else {
            copyToClipboard(output);
        }
    }, [output, outputFiles, options.outputMode]);

    const handleDownload = useCallback(() => {
        if (!output && outputFiles.size === 0) return;
        const content = options.outputMode === "multiple-files" && outputFiles.size > 1
            ? [...outputFiles.entries()].map(([n, c]) => `// ═══ ${n}.java ═══\n\n${c}`).join("\n\n")
            : output;
        const filename = outputFiles.size === 1 ? `${[...outputFiles.keys()][0]}.java` : "generated.java";
        downloadText(content, filename, "text/plain");
    }, [output, outputFiles, options.outputMode]);

    const toJavaOpts = useMemo(() => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-3">
            <div><label className="block text-xs opacity-60 mb-1">Package Name</label><Input size="small" value={options.packageName} onChange={(e) => updateOpt("packageName", e.target.value)} /></div>
            <div><label className="block text-xs opacity-60 mb-1">Root Class Name</label><Input size="small" value={options.rootClassName} onChange={(e) => updateOpt("rootClassName", e.target.value)} /></div>
            <div><label className="block text-xs opacity-60 mb-1">Java Type</label>
                <Select size="small" value={options.javaType} onChange={(v) => updateOpt("javaType", v)} className="w-full" options={[
                    { label: "Class (POJO)", value: "class" }, { label: "Abstract Class", value: "abstract-class" },
                    { label: "Record (Java 16+)", value: "record" }, { label: "Interface", value: "interface" },
                    { label: "Annotation", value: "annotation" }, { label: "Enum", value: "enum" },
                ]} />
            </div>
            <div><label className="block text-xs opacity-60 mb-1">Output Mode</label>
                <Select size="small" value={options.outputMode} onChange={(v) => updateOpt("outputMode", v)} className="w-full" options={[
                    { label: "📄 Single File (all classes)", value: "single-file" },
                    { label: "📁 Multiple Files (per class)", value: "multiple-files" },
                ]} />
            </div>
            <div><label className="block text-xs opacity-60 mb-1">Field Access</label>
                <Select size="small" value={options.fieldAccessModifier} onChange={(v) => updateOpt("fieldAccessModifier", v)} className="w-full" options={[
                    { label: "private", value: "private" }, { label: "protected", value: "protected" },
                    { label: "public", value: "public" }, { label: "package-private", value: "package-private" },
                ]} />
            </div>
            <div><label className="block text-xs opacity-60 mb-1">Naming Convention</label>
                <Select size="small" value={options.fieldNaming} onChange={(v) => updateOpt("fieldNaming", v)} className="w-full" options={[
                    { label: "camelCase", value: "camelCase" }, { label: "snake_case", value: "snake_case" }, { label: "PascalCase", value: "PascalCase" },
                ]} />
            </div>
            <div><label className="block text-xs opacity-60 mb-1">Field Prefix</label><Input size="small" value={options.fieldPrefix} onChange={(e) => updateOpt("fieldPrefix", e.target.value)} placeholder="e.g. m_ or _" /></div>
            <div><label className="block text-xs opacity-60 mb-1">Indent</label>
                <Select size="small" value={options.indentSize} onChange={(v) => updateOpt("indentSize", v)} className="w-full" options={[{ label: "2", value: 2 }, { label: "4", value: 4 }, { label: "8", value: 8 }]} />
            </div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.useTab} onChange={(v) => updateOpt("useTab", v)} /><span className="text-sm">Tabs</span></div>

            <div className="col-span-full mt-2 mb-0"><span className="text-xs font-bold opacity-50 uppercase tracking-wider">Annotations & Libraries</span></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.useLombok} onChange={(v) => updateOpt("useLombok", v)} /><Tooltip title="@Data / @NoArgsConstructor / @AllArgsConstructor"><span className="text-sm">Lombok @Data</span></Tooltip></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.generateBuilder} onChange={(v) => updateOpt("generateBuilder", v)} /><Tooltip title="Lombok @Builder"><span className="text-sm">@Builder</span></Tooltip></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.lombokValue} onChange={(v) => updateOpt("lombokValue", v)} /><Tooltip title="Immutable @Value class"><span className="text-sm">@Value (immutable)</span></Tooltip></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.lombokSuperBuilder} onChange={(v) => updateOpt("lombokSuperBuilder", v)} /><Tooltip title="For inheritance"><span className="text-sm">@SuperBuilder</span></Tooltip></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.useJackson} onChange={(v) => updateOpt("useJackson", v)} /><Tooltip title="@JsonProperty, @JsonInclude"><span className="text-sm">Jackson</span></Tooltip></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.useGson} onChange={(v) => updateOpt("useGson", v)} /><Tooltip title="@SerializedName"><span className="text-sm">Gson</span></Tooltip></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.useValidation} onChange={(v) => updateOpt("useValidation", v)} /><Tooltip title="@NotNull, @NotBlank, @NotEmpty"><span className="text-sm">Jakarta Validation</span></Tooltip></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.useJaxb} onChange={(v) => updateOpt("useJaxb", v)} /><Tooltip title="@XmlRootElement, @XmlElement"><span className="text-sm">JAXB (XML)</span></Tooltip></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.useSwagger} onChange={(v) => updateOpt("useSwagger", v)} /><Tooltip title="OpenAPI @Schema"><span className="text-sm">Swagger / OpenAPI</span></Tooltip></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.useJpa} onChange={(v) => updateOpt("useJpa", v)} /><Tooltip title="@Entity, @Table, @Id, @Column"><span className="text-sm">JPA / Hibernate</span></Tooltip></div>

            <div className="col-span-full mt-2 mb-0"><span className="text-xs font-bold opacity-50 uppercase tracking-wider">Code Generation</span></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.generateConstructors} onChange={(v) => updateOpt("generateConstructors", v)} /><span className="text-sm">Constructors</span></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.generateGettersSetters} onChange={(v) => updateOpt("generateGettersSetters", v)} /><span className="text-sm">Getters / Setters</span></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.generateToString} onChange={(v) => updateOpt("generateToString", v)} /><span className="text-sm">toString()</span></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.generateEqualsHashCode} onChange={(v) => updateOpt("generateEqualsHashCode", v)} /><span className="text-sm">equals() & hashCode()</span></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.usePrimitives} onChange={(v) => updateOpt("usePrimitives", v)} /><span className="text-sm">Primitives (int vs Integer)</span></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.makeFieldsFinal} onChange={(v) => updateOpt("makeFieldsFinal", v)} /><span className="text-sm">Final Fields</span></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.serializable} onChange={(v) => updateOpt("serializable", v)} /><span className="text-sm">Serializable</span></div>
        </div>
    ), [options, updateOpt]);

    const fromJavaOpts = useMemo(() => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2"><Switch size="small" checked={options.includeNulls} onChange={(v) => updateOpt("includeNulls", v)} /><span className="text-sm">Include Nulls</span></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.prettyPrint} onChange={(v) => updateOpt("prettyPrint", v)} /><span className="text-sm">Pretty Print</span></div>
            {mode === "java-to-xml" && <div><label className="block text-xs opacity-60 mb-1">XML Root Element</label><Input size="small" value={options.xmlRootElement} onChange={(e) => updateOpt("xmlRootElement", e.target.value)} /></div>}
            <div><label className="block text-xs opacity-60 mb-1">Indent</label><Select size="small" value={options.indentSize} onChange={(v) => updateOpt("indentSize", v)} className="w-full" options={[{ label: "2", value: 2 }, { label: "4", value: 4 }]} /></div>
            <div className="flex items-center gap-2"><Switch size="small" checked={options.useTab} onChange={(v) => updateOpt("useTab", v)} /><span className="text-sm">Tabs</span></div>
        </div>
    ), [options, updateOpt, mode]);

    return (
        <ToolPageLayout
            title="Java POJO Generator"
            description="Generate Java classes, records, interfaces from JSON/XML — or convert Java back to JSON/XML"
            icon={<CodeOutlined />}
            color="#597ef7"
            learnMore={{
                whatIs: "A Java POJO (Plain Old Java Object) Generator creates Java classes from JSON or XML data structures. It can generate traditional classes with getters/setters, modern Java records, or interfaces.",
                whyUse: "Manually writing data classes from API responses is tedious and error-prone. This tool instantly generates type-safe Java code with proper naming conventions, annotations, and structure.",
                howToUse: [
                    "Paste JSON or XML data in the input panel",
                    "Choose output type: Class, Record, or Interface",
                    "Configure options: Lombok, Jackson annotations, etc.",
                    "Copy the generated Java code to your project"
                ],
                tips: [
                    "Use Lombok annotations to reduce boilerplate",
                    "Java Records are great for immutable data objects",
                    "Jackson annotations help with JSON serialization",
                    "Nested objects generate separate classes"
                ],
                useCases: [
                    "Creating DTOs from REST API responses",
                    "Generating model classes from JSON schemas",
                    "Converting XML configurations to Java objects",
                    "Bootstrapping new projects with data models"
                ]
            }}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Segmented
                        options={[
                            { label: "JSON → Java", value: "json-to-java" },
                            { label: "XML → Java", value: "xml-to-java" },
                            { label: "Java → JSON", value: "java-to-json" },
                            { label: "Java → XML", value: "java-to-xml" },
                        ]}
                        value={mode}
                        onChange={handleModeChange}
                    />
                    <Button type="primary" icon={<ThunderboltOutlined />} onClick={generate} size="large">
                        {isToJava ? "Generate" : "Convert"}
                    </Button>
                    <Button icon={<ClearOutlined />} onClick={() => { setInput(""); setOutput(""); setOutputFiles(new Map()); }}>Clear</Button>
                    {output && (
                        <>
                            <Button icon={<CopyOutlined />} onClick={handleCopy}>
                                {options.outputMode === "multiple-files" && outputFiles.size > 1 ? "Copy All" : "Copy"}
                            </Button>
                            {isToJava && <Button icon={<DownloadOutlined />} onClick={handleDownload}>Download</Button>}
                        </>
                    )}
                </div>

                <Collapse size="small" items={[{
                    key: "opts",
                    label: <span>Options{options.useLombok && <Tag color="green" className="ml-2" style={{ fontSize: 10 }}>Lombok</Tag>}{options.useJackson && <Tag color="blue" className="ml-1" style={{ fontSize: 10 }}>Jackson</Tag>}{options.useJpa && <Tag color="orange" className="ml-1" style={{ fontSize: 10 }}>JPA</Tag>}{options.useValidation && <Tag color="purple" className="ml-1" style={{ fontSize: 10 }}>Validation</Tag>}{options.useSwagger && <Tag color="cyan" className="ml-1" style={{ fontSize: 10 }}>Swagger</Tag>}{options.useJaxb && <Tag color="red" className="ml-1" style={{ fontSize: 10 }}>JAXB</Tag>}</span>,
                    children: isToJava ? toJavaOpts : fromJavaOpts,
                }]} />

                {isToJava && options.outputMode === "multiple-files" && outputFiles.size > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {[...outputFiles.keys()].map((n) => (
                            <Button key={n} type={selectedFile === n ? "primary" : "default"} size="small" icon={<FileOutlined />} onClick={() => handleFileSelect(n)}>
                                {n}.java
                            </Button>
                        ))}
                        <Badge count={outputFiles.size} style={{ backgroundColor: "#597ef7" }}>
                            <Button size="small" icon={<FolderOutlined />} disabled>Files</Button>
                        </Badge>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs font-semibold opacity-60 mb-1">
                            {mode === "json-to-java" ? "JSON" : mode === "xml-to-java" ? "XML" : "Java"} Input
                        </div>
                        <CodeEditor value={input} onChange={(v) => setInput(v ?? "")} language={inLang} height="65vh" />
                    </div>
                    <div>
                        <div className="text-xs font-semibold opacity-60 mb-1">
                            {isToJava ? <>Generated Java {selectedFile && options.outputMode === "multiple-files" && outputFiles.size > 1 && <Tag color="blue" style={{ fontSize: 10 }}>{selectedFile}.java</Tag>}</> : mode === "java-to-json" ? "JSON Output" : "XML Output"}
                        </div>
                        <CodeEditor value={output} language={outLang} height="65vh" readOnly />
                    </div>
                </div>
            </div>
        </ToolPageLayout>
    );
}
