"use client";

import { useLanguage } from "./LanguageProvider";
import React, { useEffect, useState } from "react";
import { Alert, Button, Space, Tag } from "antd";
import { clearBridge, consumeFromBridge, type ToolPayload, type ToolPayloadKind } from "@/lib/tool-bridge";
import { guideExamplePayload } from "@/lib/guide-examples";

interface Props {
    /** Which kinds this tool can usefully consume. */
    accepts: ToolPayloadKind[];
    /** Apply the payload — typically calls setInput / setBody / etc. */
    onAccept: (payload: ToolPayload) => void;
    /** Auto-apply on mount if accepted (default true). When false, show a "Import" button. */
    autoApply?: boolean;
}

/**
 * Renders nothing unless there's a fresh cross-tool payload of an accepted kind
 * in sessionStorage. When there is, auto-applies it (or shows a banner with an
 * Import button if `autoApply` is false), and shows a transient confirmation.
 */
export default function ToolBridgeBanner({ accepts, onAccept, autoApply = true }: Props) {
    const { t } = useLanguage();
    const [imported, setImported] = useState<ToolPayload | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        let timer: ReturnType<typeof setTimeout> | undefined;
        // Child effects run before their parent's mount effects. Apply after
        // defaults and saved settings have initialized, so they cannot replace
        // the imported example or its decoded result. StrictMode cleanup also
        // cancels the first attempt before its one-shot payload is consumed.
        queueMicrotask(() => {
            if (cancelled) return;
            try {
                const guide = guideExamplePayload(window.location.pathname, window.location.search);
                const payload = guide ?? consumeFromBridge();
                if (!payload) return;
                if (!accepts.includes(payload.kind)) {
                    if (guide) throw new Error("This tool cannot load this example format. Choose its example from the Debugging guides.");
                    return;
                }
                if (guide) clearBridge();
                if (autoApply) onAccept(payload);
                setImported(payload);
                if (autoApply) timer = setTimeout(() => setImported(null), 5000);
            } catch (cause) { setError(cause instanceof Error ? cause.message : "The example could not be loaded. Open its guide and try again."); }
        });
        return () => { cancelled = true; if (timer) clearTimeout(timer); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) return <Alert type="error" showIcon title={t("Example could not be loaded")} description={t(error)} style={{ marginBottom: 12 }} />;
    if (!imported) return null;

    return (
        <Alert
            type="success"
            showIcon
            closable
            onClose={() => setImported(null)}
            style={{ marginBottom: 12 }}
            title={
                <Space>
                    {t(imported.sourceToolId === "guides" ? "Loaded guide example" : "Imported from another tool")}
                    {imported.sourceToolId && <Tag color="blue"><bdi dir="ltr">{imported.sourceToolId}</bdi></Tag>}
                    <Tag><bdi dir="ltr">{imported.kind}</bdi></Tag>
                </Space>
            }
            description={imported.sourceToolId === "guides" ? t(imported.label ?? "") : imported.label}
            action={
                !autoApply && (
                    <Button size="small" type="primary" onClick={() => { onAccept(imported); setImported(null); }}>
                        {t("Import")}
                    </Button>
                )
            }
        />
    );
}
