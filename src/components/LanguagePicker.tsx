"use client";
import { useRef, useState } from "react";
import { Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { LANGUAGES, validLanguage } from "@/lib/i18n/catalog";
import { useLanguage } from "./LanguageProvider";
export default function LanguagePicker() {
    const { language, direction, t, setLanguage, persistenceError } = useLanguage();
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const current = LANGUAGES.find((entry) => entry.id === language)!;
    return <div className="wb-language-control">
        <Dropdown
            trigger={["click"]}
            open={open}
            onOpenChange={setOpen}
            autoFocus
            placement={direction === "rtl" ? "bottomRight" : "bottomLeft"}
            classNames={{ root: "wb-language-menu" }}
            menu={{
                selectable: true,
                selectedKeys: [language],
                onKeyDown: (event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setOpen(false); buttonRef.current?.focus(); } },
                items: LANGUAGES.map((entry) => ({ key: entry.id, label: <span className="wb-language-option"><span dir="ltr" className="wb-language-code">{entry.id.toUpperCase()}</span><span lang={entry.id} dir={entry.id === "ar" ? "rtl" : "ltr"}>{entry.name}</span></span> })),
                onClick: ({ key }) => { setLanguage(validLanguage(key)); setOpen(false); buttonRef.current?.focus(); },
            }}
        >
            <Button ref={buttonRef} type="text" className="wb-language-picker" aria-label={`${t("Language")}: ${current.name}`} aria-haspopup="menu" aria-expanded={open} title={`${t("Language")}: ${current.name}`} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true); } }}>
                <GlobalOutlined aria-hidden="true" /><span dir="ltr" className="wb-language-code">{language.toUpperCase()}</span>
            </Button>
        </Dropdown>
        {persistenceError && <p className="wb-language-error" role="status">{t("Language changed for this session. Browser storage is unavailable.")}</p>}
    </div>;
}
