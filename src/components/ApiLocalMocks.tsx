"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { CopyOutlined, PlusOutlined, ReloadOutlined, StopOutlined } from "@ant-design/icons";
import { activeSessionProjectId } from "@/lib/project-storage";
import { connectorRequest } from "@/lib/local-connector-client";
import { copyToClipboard } from "@/lib/clipboard";
import type { MockRoute, MockSummary } from "@/lib/local-mock-server";

const EXAMPLE = JSON.stringify({ name: "Example API", routes: [{ method: "GET", path: "/hello", status: 200, headers: { "content-type": "application/json" }, body: '{"message":"Hello from your local mock"}', delayMs: 0 }], origins: [] }, null, 2);
export default function ApiLocalMocks() {
    const { t, language } = useLanguage();
    const [configuration, setConfiguration] = useState(EXAMPLE), [mocks, setMocks] = useState<MockSummary[]>([]);
    const [busy, setBusy] = useState(false), [error, setError] = useState<{ source: string; detail?: string } | null>(null), [notice, setNotice] = useState(""), [loaded, setLoaded] = useState(false);
    const abort = useRef<AbortController | null>(null), generation = useRef(0);
    useEffect(() => {
        const invalidate = () => { generation.current++; };
        const lock = () => { generation.current++; abort.current?.abort(); setConfiguration(EXAMPLE); setMocks([]); setLoaded(false); setError(null); setNotice(""); };
        window.addEventListener("mydevtools-project-lock", lock);
        return () => { invalidate(); abort.current?.abort(); window.removeEventListener("mydevtools-project-lock", lock); };
    }, []);
    const refresh = useCallback(async (signal: AbortSignal, epoch: number) => {
        const value = await connectorRequest<{ mocks: MockSummary[] }>({ service: "mock", operation: "list", project: activeSessionProjectId() }, signal);
        if (epoch === generation.current) { setMocks(value.mocks); setLoaded(true); }
    }, []);
    const perform = async (operation: string, id?: string) => {
        if (abort.current) return;
        const controller = new AbortController(), epoch = generation.current; abort.current = controller; setBusy(true); setError(null); setNotice("");
        try {
            if (operation === "list") await refresh(controller.signal, epoch);
            else {
                await connectorRequest({ service: "mock", operation, project: activeSessionProjectId(), id, ...(operation === "start" ? { configuration: JSON.parse(configuration) } : {}) }, controller.signal);
                if (epoch !== generation.current) return;
                setNotice(operation === "start" ? "Mock started. Copy its base URL and append a route path." : "Mock stopped. Response configuration released.");
                await refresh(controller.signal, epoch);
            }
        } catch (cause) { if (epoch === generation.current) setError({ source: "Mock operation failed.", detail: cause instanceof Error ? cause.message : undefined }); }
        finally { abort.current = null; setBusy(false); }
    };
    const copyUrl = async (value: string) => { try { await copyToClipboard(value); setNotice("Mock base URL copied."); } catch { setError({ source: "Clipboard access was unavailable. Select and copy the URL below." }); } };
    return <div className="wb-workbench wb-api-extension-panel">
        <p>{t("Start a temporary HTTP mock on this device. Choose exact paths, methods, response headers, text bodies, status codes and delays. Requests never forward to an upstream API.")}</p>
        <label>{t("Mock configuration (JSON)")}<textarea dir="ltr" rows={16} value={configuration} maxLength={512 * 1024} spellCheck={false} disabled={busy} onChange={(event) => setConfiguration(event.target.value)} /></label>
        <p className="wb-api-help">{t("Routes support GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS or *. Paths start with /; queries are ignored when matching. Add exact browser origins in origins when testing another local app. The current app origin is allowed automatically.")}</p>
        <div className="wb-workbench-actions"><button type="button" disabled={busy} onClick={() => void perform("start")}><PlusOutlined />{t("Start local mock")}</button><button type="button" disabled={busy} onClick={() => void perform("list")}><ReloadOutlined />{t("Refresh running mocks")}</button><button type="button" disabled={busy} onClick={() => { setConfiguration(EXAMPLE); setError(null); }}>{t("Load example configuration")}</button></div>
        {error && <p role="alert">{t(error.source)}{error.detail && <> <bdi dir="auto">{error.detail}</bdi></>}</p>}{notice && <p role="status">{t(notice)}</p>}
        <p className="wb-api-help">{t("Local mocks never record incoming headers or bodies. Only response configuration and a total request count stay in memory, for up to 10 minutes. Up to 2 mocks and 20 routes per mock are supported. Switching projects or closing this page does not stop a mock. Use Stop to release its configuration immediately.")}</p>
        {loaded && !mocks.length && <p role="status">{t("No mocks are running for this project. Start one above.")}</p>}
        <ul className="wb-api-mocks">{mocks.map((mock) => <li key={mock.id}><div className="wb-api-result-heading"><h3 dir="auto">{mock.name}</h3><button type="button" disabled={busy} onClick={() => void perform("stop", mock.id)}><StopOutlined />{t("Stop mock")}</button></div><code dir="ltr" className="wb-api-mock-url">{mock.baseUrl}</code><p>{t("Expires {time}", { time: new Date(mock.expiresAt).toLocaleTimeString(language) })} · {t("Requests received: {count}", { count: mock.requests })}</p><ul>{mock.routes.map((route: MockRoute, i) => <li key={i}><code dir="ltr">{route.method} {route.path}</code> → {route.status}{route.delayMs ? " · " + t("Delay: {duration} ms", { duration: route.delayMs }) : ""}</li>)}</ul><div className="wb-workbench-actions"><button type="button" onClick={() => void copyUrl(mock.baseUrl)}><CopyOutlined />{t("Copy base URL")}</button></div></li>)}</ul>
    </div>;
}
