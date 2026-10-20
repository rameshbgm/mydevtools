"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { GiftOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { APP_VERSION } from "@/lib/app-version";
import { markReleaseSeen, seenRelease, subscribeToSeenRelease } from "@/lib/release-preference";
import { useLanguage } from "./LanguageProvider";

const serverSnapshot = () => null;

export default function WhatsNewLink({ compact = false, onOpen }: { compact?: boolean; onOpen?: () => void }) {
    const { t } = useLanguage();
    const seenVersion = useSyncExternalStore(subscribeToSeenRelease, seenRelease, serverSnapshot);
    const iconOnly = compact || seenVersion === APP_VERSION;
    const label = t("What's new in version {version} — release notes", { version: APP_VERSION });
    const markSeen = () => markReleaseSeen(APP_VERSION);

    return (
        <Tooltip title={label}>
            <Link
                href={`/release-notes#release-${APP_VERSION}`}
                className={`wb-whats-new${iconOnly ? " wb-whats-new-icon" : ""}`}
                aria-label={label}
                onClick={() => { markSeen(); onOpen?.(); }}
                onAuxClick={(event) => { if (event.button === 1) markSeen(); }}
                prefetch={false}
            >
                <GiftOutlined aria-hidden="true" />
                {!iconOnly && <span className="wb-whats-new-label">{t("What’s new")}</span>}
            </Link>
        </Tooltip>
    );
}
