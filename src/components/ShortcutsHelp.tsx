"use client";
import { useLanguage } from "./LanguageProvider";
import { Modal } from "antd";
export default function ShortcutsHelp({ onClose }: { onClose: () => void }) {
    const { t } = useLanguage();
    return <Modal title={t("Keyboard shortcuts")} open onCancel={onClose} footer={null} width={420}>
        <dl>{[["⌘K / Ctrl K", "Open command search"], ["?", "Show keyboard shortcuts"], ["Esc", "Close command search"], ["↑ / ↓", "Choose a search result"], ["Enter", "Open the selected tool"]].map(([keys, description]) => <div key={keys} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 12 }}><dt>{t(description)}</dt><dd style={{ margin: 0 }}><kbd>{keys}</kbd></dd></div>)}</dl>
    </Modal>;
}
