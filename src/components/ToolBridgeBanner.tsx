"use client";

import React, { useEffect, useState } from "react";
import { Alert, Button, Space, Tag } from "antd";
import { consumeFromBridge, type ToolPayload, type ToolPayloadKind } from "@/lib/tool-bridge";

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
    const [imported, setImported] = useState<ToolPayload | null>(null);

    useEffect(() => {
        const payload = consumeFromBridge();
        if (!payload) return;
        if (!accepts.includes(payload.kind)) return; // not for us — payload is already consumed; nothing else takes it
        if (autoApply) {
            onAccept(payload);
            setImported(payload);
            // confirmation lives for ~5s; user can dismiss earlier
            const t = setTimeout(() => setImported(null), 5000);
            return () => clearTimeout(t);
        } else {
            setImported(payload);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    Imported from another tool
                    {imported.sourceToolId && <Tag color="blue">{imported.sourceToolId}</Tag>}
                    <Tag>{imported.kind}</Tag>
                </Space>
            }
            description={imported.label}
            action={
                !autoApply && (
                    <Button size="small" type="primary" onClick={() => { onAccept(imported); setImported(null); }}>
                        Import
                    </Button>
                )
            }
        />
    );
}
