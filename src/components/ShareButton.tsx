"use client";

import React, { useState } from "react";
import { Button, Modal, Input, Tooltip, Space, Alert, Typography, Spin, App } from "antd";
import { ShareAltOutlined, LinkOutlined, WarningOutlined } from "@ant-design/icons";
import { useBuildShareUrl, type ShareSchema } from "@/lib/shareable-state";
import { copyToClipboard } from "@/lib/clipboard";

const { Text, Paragraph } = Typography;

interface Props<T> {
    /** State to encode into the URL. Re-read each time the modal opens. */
    getState: () => T;
    /** Schema declared by the tool — must match the one the tool uses to restore. */
    schema: ShareSchema<T>;
    /** Show a warning if the user is likely sharing sensitive content. */
    sensitiveFieldHint?: string;
    size?: "small" | "middle" | "large";
}

/**
 * Drop-in "Share" button. Opens a modal that builds the URL on demand
 * (so it always reflects the current input), shows the link, and offers
 * one-click copy.
 */
export default function ShareButton<T>({ getState, schema, sensitiveFieldHint, size = "small" }: Props<T>) {
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const { url, error, building, build, reset } = useBuildShareUrl(schema);

    const onOpen = () => {
        setOpen(true);
        reset();
        build(getState());
    };

    const onClose = () => {
        setOpen(false);
        reset();
    };

    const copy = async () => {
        if (!url) return;
        await copyToClipboard(url);
        message.success("Share link copied");
    };

    return (
        <>
            <Tooltip title="Copy a link that restores this input on the recipient's machine">
                <Button size={size} icon={<ShareAltOutlined />} onClick={onOpen}>Share</Button>
            </Tooltip>
            <Modal
                title={<Space><LinkOutlined /> Shareable link</Space>}
                open={open}
                onCancel={onClose}
                footer={null}
                width={680}
                destroyOnHidden
            >
                {building ? (
                    <div style={{ textAlign: "center", padding: 24 }}><Spin /> Building link…</div>
                ) : error ? (
                    <Alert type="warning" showIcon title="Couldn't build a share link" description={error} />
                ) : url ? (
                    <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                        <Input.TextArea value={url} readOnly autoSize={{ minRows: 2, maxRows: 5 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} />
                        <Space>
                            <Button type="primary" icon={<LinkOutlined />} onClick={copy}>Copy link</Button>
                            <Text type="secondary" style={{ fontSize: 11 }}>{url.length.toLocaleString()} chars</Text>
                        </Space>
                        <Paragraph type="secondary" style={{ fontSize: 11, marginBottom: 0 }}>
                            The state is encoded into the URL fragment (after <code>#</code>) — fragments are <b>never sent to a server</b>, so the data stays between you and whoever you share the link with. Recipients open the URL and see the tool with the same input restored.
                        </Paragraph>
                        {sensitiveFieldHint && (
                            <Alert
                                type="warning"
                                showIcon
                                icon={<WarningOutlined />}
                                title="Before you share"
                                description={sensitiveFieldHint}
                            />
                        )}
                    </Space>
                ) : null}
            </Modal>
        </>
    );
}
