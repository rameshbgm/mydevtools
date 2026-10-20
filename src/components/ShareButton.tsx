"use client";

import React, { useState } from "react";
import { Button, Modal, Input, Tooltip, Space, Alert, Typography, Spin } from "antd";
import { ShareAltOutlined, LinkOutlined, WarningOutlined } from "@ant-design/icons";
import { useBuildShareUrl, type ShareSchema } from "@/lib/shareable-state";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/components/LanguageProvider";

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
    const { t, language } = useLanguage();
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
        await copyToClipboard(url, t("Share link copied"));
    };

    return (
        <>
            <Tooltip title={t("Copy a link that restores this input on the recipient's machine")}>
                <Button size={size} icon={<ShareAltOutlined />} onClick={onOpen}>{t("Share")}</Button>
            </Tooltip>
            <Modal
                title={<Space><LinkOutlined /> {t("Shareable link")}</Space>}
                closable={{ "aria-label": t("Close share dialog") }}
                open={open}
                onCancel={onClose}
                footer={null}
                width={680}
                destroyOnHidden
            >
                {building ? (
                    <div role="status" style={{ textAlign: "center", padding: 24 }}><Spin /> {t("Building link…")}</div>
                ) : error ? (
                    <Alert type="warning" showIcon title={t("Couldn't build a share link")} description={<><div dir="auto">{error === "State is too large to fit in a URL — consider trimming the input." ? t(error) : error}</div><p>{t("Trim the input and open Share again to retry.")}</p></>} />
                ) : url ? (
                    <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                        <Input.TextArea aria-label={t("Shareable link")} dir="ltr" value={url} readOnly autoSize={{ minRows: 2, maxRows: 5 }} style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12 }} />
                        <Space>
                            <Button type="primary" icon={<LinkOutlined />} onClick={copy}>{t("Copy link")}</Button>
                            <Text type="secondary" style={{ fontSize: 11 }}>{t("{count} characters", { count: url.length.toLocaleString(language) })}</Text>
                        </Space>
                        <Paragraph type="secondary" style={{ fontSize: 11, marginBottom: 0 }}>
                            {t("The input is encoded in the URL fragment (after #), which is not sent in HTTP requests. Anyone with the link can restore and read the shared input. Review it for secrets before sharing.")}
                        </Paragraph>
                        {sensitiveFieldHint && (
                            <Alert
                                type="warning"
                                showIcon
                                icon={<WarningOutlined />}
                                title={t("Before you share")}
                                description={t(sensitiveFieldHint)}
                            />
                        )}
                    </Space>
                ) : null}
            </Modal>
        </>
    );
}
