"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { Select } from "antd";
import { DeleteOutlined, DownloadOutlined, PlusOutlined, SendOutlined, StopOutlined, UploadOutlined } from "@ant-design/icons";
import { connectorRequest } from "@/lib/local-connector-client";
import { downloadText } from "@/lib/download";
import type { GrpcCallResult } from "@/lib/grpc-connector";
import type { GrpcMethodInfo, ProtoFile } from "@/lib/grpc-proto";

const EXAMPLE: ProtoFile = { name: "echo.proto", source: 'syntax = "proto3";\npackage example;\nmessage EchoRequest { string message = 1; }\nmessage EchoReply { string message = 1; }\nservice Echo {\n  rpc Say(EchoRequest) returns (EchoReply);\n  rpc Watch(EchoRequest) returns (stream EchoReply);\n  rpc Collect(stream EchoRequest) returns (EchoReply);\n  rpc Chat(stream EchoRequest) returns (stream EchoReply);\n}\n' };
const EMPTY_TLS = { serverName: "", ca: "", certificate: "", privateKey: "" };
function methodLabel(method: GrpcMethodInfo, t: (source: string) => string): string { return method.path + " · " + t(method.requestStream ? method.responseStream ? "bidirectional" : "client stream" : method.responseStream ? "server stream" : "unary"); }

export default function ApiGrpcClient() {
    const { t } = useLanguage();
    const [files, setFiles] = useState<ProtoFile[]>([{ ...EXAMPLE }]), [methods, setMethods] = useState<GrpcMethodInfo[]>([]), [method, setMethod] = useState("");
    const [host, setHost] = useState("localhost"), [port, setPort] = useState(50051), [tls, setTls] = useState(true), [certificates, setCertificates] = useState(EMPTY_TLS);
    const [messages, setMessages] = useState('{"message":"Hello"}'), [metadata, setMetadata] = useState("{}"), [timeout, setTimeoutMs] = useState(10000);
    const [busy, setBusy] = useState(false), [error, setError] = useState<{ source: string; detail?: string } | null>(null), [notice, setNotice] = useState<number | null>(null), [result, setResult] = useState<GrpcCallResult | null>(null);
    const upload = useRef<HTMLInputElement>(null), abort = useRef<AbortController | null>(null), generation = useRef(0);
    useEffect(() => {
        const invalidate = () => { generation.current++; };
        const lock = () => { generation.current++; abort.current?.abort(); setResult(null); setMetadata("{}"); setMessages("{}"); setCertificates(EMPTY_TLS); setError(null); };
        window.addEventListener("mydevtools-project-lock", lock);
        return () => { invalidate(); abort.current?.abort(); window.removeEventListener("mydevtools-project-lock", lock); };
    }, []);
    const selected = methods.find((entry) => entry.path === method);
    const clearSchema = () => { setMethods([]); setMethod(""); setResult(null); setNotice(null); };
    const choose = (path: string) => { setMethod(path); setResult(null); };
    const perform = async (operation: "describe" | "call") => {
        if (abort.current) return;
        const controller = new AbortController(), epoch = generation.current; abort.current = controller; setBusy(true); setError(null); setNotice(null); setResult(null);
        try {
            if (operation === "describe") {
                const value = await connectorRequest<{ methods: GrpcMethodInfo[] }>({ service: "grpc", operation, files }, controller.signal);
                if (epoch !== generation.current) return;
                setMethods(value.methods); setMethod(value.methods[0]?.path ?? "");
                setNotice(value.methods.length);
            } else {
                const value = await connectorRequest<GrpcCallResult>({ service: "grpc", operation, files, method, messages, metadata: JSON.parse(metadata), timeoutMs: timeout, connection: { host, port, tls, ...(tls ? certificates : EMPTY_TLS) } }, controller.signal);
                if (epoch === generation.current) setResult(value);
            }
        } catch (cause) { if (epoch === generation.current) setError(controller.signal.aborted ? { source: "RPC cancelled." } : { source: "RPC failed.", detail: cause instanceof Error ? cause.message : undefined }); }
        finally { abort.current = null; setBusy(false); }
    };
    const loadFiles = async (selectedFiles: FileList | null) => {
        if (!selectedFiles?.length) return;
        try {
            const entries = Array.from(selectedFiles);
            if (entries.length + files.length > 32 || entries.reduce((total, file) => total + file.size, files.reduce((total, file) => total + new TextEncoder().encode(file.source).length, 0)) > 256 * 1024) { setError({ source: "Load at most 32 proto files and 256 KiB in total. Remove the example file first if needed." }); return; }
            const added = await Promise.all(entries.map(async (file) => ({ name: file.webkitRelativePath || file.name, source: await file.text() })));
            setFiles((current) => [...current, ...added]); clearSchema(); setError(null);
        } catch (cause) { setError({ source: "Proto files could not be read.", detail: cause instanceof Error ? cause.message : undefined }); }
    };
    return <div className="wb-workbench wb-api-extension-panel">
        <p>{t("Call unary, server-streaming, client-streaming and bidirectional gRPC methods through the local connector. Load a .proto schema and all its imports. The example describes a service; it does not start a server.")}</p>
        <details open><summary>{t("Proto schema ({count} files)", { count: files.length })}</summary><div className="wb-api-proto-files">{files.map((file, index) => <div key={index} className="wb-api-proto-file"><div className="wb-api-step-toolbar"><label>{t("Relative filename")}<input dir="ltr" aria-label={t("Proto filename {file}", { file: index + 1 })} value={file.name} maxLength={200} disabled={busy} onChange={(event) => { setFiles(files.map((entry, i) => i === index ? { ...entry, name: event.target.value } : entry)); clearSchema(); }} /></label><button type="button" disabled={busy} aria-label={t("Remove proto file {file}", { file: index + 1 })} onClick={() => { setFiles(files.filter((_, i) => i !== index)); clearSchema(); }}><DeleteOutlined />{t("Remove file")}</button></div><label>{t("Proto source")}<textarea dir="ltr" aria-label={t("Proto source {file}", { file: index + 1 })} rows={9} spellCheck={false} value={file.source} maxLength={256 * 1024} disabled={busy} onChange={(event) => { setFiles(files.map((entry, i) => i === index ? { ...entry, source: event.target.value } : entry)); clearSchema(); }} /></label></div>)}<div className="wb-workbench-actions"><input ref={upload} hidden type="file" accept=".proto" multiple onChange={(event) => { void loadFiles(event.target.files); event.target.value = ""; }} /><button type="button" disabled={busy || files.length >= 32} onClick={() => upload.current?.click()}><UploadOutlined />{t("Upload .proto files")}</button><button type="button" disabled={busy || files.length >= 32} onClick={() => { setFiles([...files, { name: "messages-" + (files.length + 1) + ".proto", source: 'syntax = "proto3";\n' }]); clearSchema(); }}><PlusOutlined />{t("Add file")}</button><button type="button" disabled={busy || !files.length} onClick={() => void perform("describe")}>{t("Load schema methods")}</button></div></div></details>
        <div className="wb-form-grid"><label>{t("Host")}<input dir="ltr" value={host} maxLength={253} disabled={busy} onChange={(event) => setHost(event.target.value)} /></label><label>{t("Port")}<input dir="ltr" type="number" min={1} max={65535} value={port} disabled={busy} onChange={(event) => setPort(Number(event.target.value))} /></label><label>{t("Deadline (ms)")}<input dir="ltr" type="number" min={100} max={15000} value={timeout} disabled={busy} onChange={(event) => setTimeoutMs(Number(event.target.value))} /></label></div>
        <label className="wb-checkbox"><input type="checkbox" checked={tls} disabled={busy} onChange={(event) => setTls(event.target.checked)} />{t("TLS with certificate verification")}</label>
        {tls && <details><summary>{t("CA, client certificate and TLS server name")}</summary><div className="wb-api-tls-fields"><label>{t("TLS server name")}<input dir="ltr" value={certificates.serverName} maxLength={253} disabled={busy} placeholder={t("DNS name on the certificate; required when host is an IP")} onChange={(event) => setCertificates({ ...certificates, serverName: event.target.value })} /></label>{([ ["ca", "CA bundle (PEM)"], ["certificate", "Client certificate (PEM)"], ["privateKey", "Client private key (PEM)"] ] as const).map(([key, label]) => <label key={key}>{t(label)}<textarea dir="ltr" rows={3} value={certificates[key]} maxLength={65536} autoComplete="off" spellCheck={false} disabled={busy} onChange={(event) => setCertificates({ ...certificates, [key]: event.target.value })} /></label>)}</div></details>}
        <label>{t("Service method")}<Select aria-label={t("gRPC service method")} value={method || undefined} placeholder={t("Load a schema to choose a method")} showSearch optionFilterProp="label" disabled={busy || !methods.length} options={methods.map((entry) => ({ value: entry.path, label: methodLabel(entry, t) }))} onChange={choose} /></label>
        {selected && <p className="wb-api-help"><bdi dir="ltr">{selected.requestType} → {selected.responseType}</bdi>. {t(selected.requestStream ? "Send a JSON array of up to 100 messages. This client sends the array in order, then half-closes the stream." : "Send one JSON object.")} {t(selected.responseStream ? "Responses are collected until stream completion or deadline." : "Returns one response message.")}</p>}
        <div className="wb-workbench-actions"><button type="button" disabled={busy || !selected} onClick={() => setMessages(JSON.stringify(selected!.requestStream ? [selected!.sample] : selected!.sample, null, 2))}>{t("Use input template")}</button></div>
        <label>{t(selected?.requestStream ? "Request messages (JSON array)" : "Request message (JSON object)")}<textarea dir="ltr" rows={8} value={messages} maxLength={1024 * 1024} spellCheck={false} disabled={busy} onChange={(event) => setMessages(event.target.value)} /></label>
        <label>{t("Metadata (JSON object)")}<textarea dir="ltr" rows={3} value={metadata} maxLength={32 * 1024} spellCheck={false} disabled={busy} placeholder={'{"authorization":"Bearer …","trace-bin":"AAE="}'} onChange={(event) => setMetadata(event.target.value)} /></label>
        <p className="wb-api-help">{t("Metadata accepts strings or string arrays; -bin values use padded base64. 64-bit values use decimal strings, bytes use base64. Files and credentials stay in page memory. Imports are limited to supplied files and bundled protobuf types; reflection and remote imports are unavailable. Responses are bounded to 100 messages / 2 MiB.")}</p>
        <div className="wb-workbench-actions"><button type="button" disabled={busy || !method} onClick={() => void perform("call")}><SendOutlined />{t(busy ? "Working…" : "Send RPC")}</button><button type="button" disabled={!busy} onClick={() => abort.current?.abort()}><StopOutlined />{t("Cancel RPC")}</button></div>
        {notice !== null && <p role="status">{t("Methods loaded: {count}. No service connection has been made.", { count: notice })}</p>}{error && <p role="alert">{t(error.source)}{error.detail && <> <bdi dir="auto">{error.detail}</bdi></>}</p>}
        {result && <section aria-label={t("gRPC result")}><div className="wb-api-result-heading"><h3 dir="ltr">gRPC {result.status.code} · {result.status.name}</h3><button type="button" onClick={() => downloadText(JSON.stringify(result, null, 2), "grpc-result.json", "application/json")}><DownloadOutlined />{t("Export RPC result")}</button></div><p role="status"><bdi dir="auto">{result.status.details}</bdi> · <bdi dir="ltr">{result.elapsedMs} ms</bdi> · {t("Messages: {count}", { count: result.messages.length })}</p><pre dir="ltr" tabIndex={0}>{JSON.stringify(result, null, 2).slice(0, 65536)}{JSON.stringify(result).length > 65536 ? "\n" + t("[Preview truncated; export for full result]") : ""}</pre></section>}
    </div>;
}
