"use client";

import React from "react";
import { Dropdown, Button, App } from "antd";
import { ShareAltOutlined, DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { pushToBridge, targetsForKind, type ToolPayloadKind } from "@/lib/tool-bridge";
import { toolPathFromId } from "@/lib/category-routes";

interface Props {
    /** The data to forward to the next tool. */
    data: string;
    /** What kind of data this is — drives which target tools are offered. */
    kind: ToolPayloadKind;
    /** Originating tool id (for "from [tool]" provenance on the receiver). */
    sourceToolId: string;
    /** Optional one-liner the receiver can show in its import banner. */
    label?: string;
    /** Custom button look — defaults to a compact "Send to →" with chevron. */
    size?: "small" | "middle" | "large";
    /** Hide the button entirely if no compatible target exists. */
    hideIfEmpty?: boolean;
}

/**
 * "Send to →" dropdown. Drop into the header of any tool's output card.
 *
 * Behaviour: stash the payload in sessionStorage, navigate to the target
 * tool. The target tool reads `consumeFromBridge()` on mount, sees the
 * payload, and either auto-imports it or shows a banner.
 */
export default function SendToButton({
    data,
    kind,
    sourceToolId,
    label,
    size = "small",
    hideIfEmpty = true,
}: Props) {
    const { message } = App.useApp();
    const router = useRouter();
    const targets = targetsForKind(kind).filter((t) => t.toolId !== sourceToolId);
    if (targets.length === 0 && hideIfEmpty) return null;

    const handlePick = (toolId: string) => {
        if (!data) { message.warning("Nothing to send yet"); return; }
        pushToBridge({ kind, data, sourceToolId, label });
        const path = toolPathFromId(toolId);
        if (!path) { message.error("Unknown target tool"); return; }
        router.push(path);
    };

    return (
        <Dropdown
            menu={{
                items: targets.map((t) => ({
                    key: t.toolId,
                    label: t.label,
                    onClick: () => handlePick(t.toolId),
                })),
            }}
            trigger={["click"]}
            placement="bottomRight"
            disabled={!data || targets.length === 0}
        >
            <Button size={size} icon={<ShareAltOutlined />}>
                Send to <DownOutlined style={{ fontSize: 10 }} />
            </Button>
        </Dropdown>
    );
}
