"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { DesktopOutlined } from "@ant-design/icons";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { downloadText } from "@/lib/download";
import { copyToClipboard } from "@/lib/clipboard";
interface KeyRecord { event: "keydown" | "keyup"; key: string; code: string; location: number; repeat: boolean; composing: boolean; modifiers: { alt: boolean; control: boolean; meta: boolean; shift: boolean; capsLock: boolean; numLock: boolean; altGraph: boolean }; at: string }
export default function KeycodeInspectorPage() {
    const { t } = useLanguage();
    const [history, setHistory] = useState<KeyRecord[]>([]), [capturing, setCapturing] = useState(false), [prevent, setPrevent] = useState(false);
    const target = useRef<HTMLDivElement>(null);
    const capture = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") { target.current?.blur(); return; }
        if (prevent && event.key !== "Tab") event.preventDefault();
        const record: KeyRecord = { event: event.type as KeyRecord["event"], key: event.key, code: event.code, location: event.location, repeat: event.repeat, composing: event.nativeEvent.isComposing, modifiers: { alt: event.altKey, control: event.ctrlKey, meta: event.metaKey, shift: event.shiftKey, capsLock: event.getModifierState("CapsLock"), numLock: event.getModifierState("NumLock"), altGraph: event.getModifierState("AltGraph") }, at: new Date().toISOString() };
        setHistory((current) => [record, ...current].slice(0, 100));
    };
    const latest = history[0], output = JSON.stringify([...history].reverse(), null, 2);
    return <ToolPageLayout title={t("Keyboard Event Inspector")} description={t("Inspect browser key and code values, modifiers and key locations in a focused capture area")} icon={<DesktopOutlined />} color="#08979c"><div className="wb-workbench" dir="auto">
        <p>{t("Events are captured only while the area below has focus. Nothing is saved or sent. Press Escape to stop or Tab to leave. Browser and operating system shortcuts may intercept some combinations.")}</p>
        <div className="wb-workbench-actions"><button onClick={() => target.current?.focus()}>{t("Focus capture area")}</button><button disabled={!history.length} onClick={() => setHistory([])}>{t("Clear history")}</button></div>
        <div ref={target} tabIndex={0} role="group" aria-label={t("Keyboard capture area")} className="wb-key-capture" onFocus={() => setCapturing(true)} onBlur={() => setCapturing(false)} onKeyDown={capture} onKeyUp={capture}><strong>{t(capturing ? "Listening in this area. Press a key." : "Click or focus here to inspect keys.")}</strong><span dir={latest ? "ltr" : "auto"}>{latest ? `${latest.event}: ${latest.key === " " ? t("Space") : latest.key} · ${latest.code}` : t("No captured events")}</span></div>
        <label className="wb-checkbox"><input dir="ltr" type="checkbox" checked={prevent} onChange={(event) => setPrevent(event.target.checked)} />{t("Prevent default browser behavior while capturing (Tab and Escape remain available)")}</label>
        {latest && <><h2>{t("Latest event")}</h2><div className="wb-table-scroll"><table className="wb-data-table"><tbody><tr><th>{t("key · layout-aware value")}</th><td><code dir="ltr">{JSON.stringify(latest.key)}</code></td></tr><tr><th>{t("code · physical key position")}</th><td><code dir="ltr">{latest.code || t("Unavailable")}</code></td></tr><tr><th>{t("Location")}</th><td>{latest.location} · {t(["Standard", "Left", "Right", "Numpad"][latest.location] ?? "Other")}</td></tr><tr><th>{t("Modifiers")}</th><td dir="ltr">{Object.entries(latest.modifiers).filter(([, active]) => active).map(([name]) => name).join(", ") || t("None")}</td></tr><tr><th>{t("Repeated / composing")}</th><td dir="ltr">{String(latest.repeat)} / {String(latest.composing)}</td></tr></tbody></table></div></>}
        <h2>{t("Session history ({count}/100)", { count: history.length })}</h2><div className="wb-workbench-actions"><button disabled={!history.length} onClick={() => void copyToClipboard(output)}>{t("Copy events JSON")}</button><button disabled={!history.length} onClick={() => downloadText(output, "keyboard-events.json", "application/json")}>{t("Download events JSON")}</button></div>
        {history.length > 0 && <ol className="wb-resource-list">{history.map((event, index) => <li key={index}><code dir="ltr">{event.event} · {JSON.stringify(event.key)} · {event.code} · {t("location {location}", { location: event.location })}{event.repeat ? ` · ${t("repeat")}` : ""}</code><time dir="ltr">{event.at}</time></li>)}</ol>}
        <p>{t("The deprecated numeric keyCode is intentionally omitted. Use key for the user’s character and code for physical-key bindings. Test international layouts and composition before shipping shortcuts.")}</p>
    </div></ToolPageLayout>;
}
