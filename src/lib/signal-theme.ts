import { theme, type ThemeConfig } from "antd";

/** Signal's semantic palette. Keep CSS variables in workspace.css in sync. */
export const SIGNAL_PALETTES = {
    light: { ground: "#e5ebf2", surface: "#ffffff", inset: "#f0f4f8", text: "#17283d", secondary: "#53677d", border: "#c9d5e2", controlBorder: "#7c8fa8", accent: "#2458d3", actionInk: "#ffffff", selected: "#e2eaff", success: "#226b50", warning: "#925600", error: "#b22643" },
    dark: { ground: "#101a26", surface: "#172535", inset: "#142130", text: "#e8f0fc", secondary: "#a8bad0", border: "#33465e", controlBorder: "#617994", accent: "#9bbaff", actionInk: "#112956", selected: "#223e65", success: "#88d8b5", warning: "#ffcf88", error: "#ff98af" },
} as const;

export function signalTheme(dark: boolean): ThemeConfig {
    const p = SIGNAL_PALETTES[dark ? "dark" : "light"];
    return {
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: p.accent, colorInfo: p.accent, colorSuccess: p.success, colorWarning: p.warning, colorError: p.error,
            colorBgBase: p.ground, colorBgLayout: p.ground, colorBgContainer: p.surface, colorBgElevated: p.surface,
            colorFillAlter: p.inset, colorFillSecondary: p.inset, colorBorder: p.border, colorBorderSecondary: p.border,
            colorText: p.text, colorTextSecondary: p.secondary, colorTextTertiary: p.secondary, colorTextQuaternary: p.secondary,
            colorTextPlaceholder: p.secondary, colorTextLightSolid: p.actionInk, colorLink: p.accent, colorLinkHover: p.accent,
            controlOutline: "transparent", controlOutlineWidth: 0, lineWidthFocus: 1, colorPrimaryBorder: p.secondary,
            borderRadius: 6, borderRadiusLG: 7, borderRadiusSM: 4, controlHeight: 40, controlHeightLG: 40, controlHeightSM: 30,
            fontFamily: 'var(--font-geist-sans), sans-serif', fontFamilyCode: 'var(--font-geist-mono), monospace', fontSize: 12,
            fontSizeHeading1: 28, fontSizeHeading2: 23, fontSizeHeading3: 20, fontSizeHeading4: 17, fontSizeHeading5: 15,
            lineHeight: 1.65, lineWidth: 1, boxShadow: "0 12px 32px -12px rgb(0 0 0 / 24%)", boxShadowSecondary: "0 12px 32px -12px rgb(0 0 0 / 24%)",
            motionDurationMid: "0.16s", motionDurationSlow: "0.2s",
        },
        components: {
            Layout: { headerBg: p.inset, siderBg: p.ground, bodyBg: p.ground },
            Menu: { itemBg: "transparent", subMenuItemBg: "transparent", itemSelectedBg: p.selected, itemSelectedColor: p.accent, itemHoverBg: p.inset, itemColor: p.secondary, itemHoverColor: p.text, groupTitleColor: p.secondary, itemHeight: 38, itemBorderRadius: 5, subMenuItemBorderRadius: 5, iconSize: 16, itemMarginInline: 0, itemMarginBlock: 3 },
            Button: { borderRadius: 5, primaryColor: p.actionInk, primaryShadow: "none", defaultShadow: "none", fontWeight: 550, defaultHoverColor: p.text, defaultActiveColor: p.text, defaultHoverBorderColor: p.controlBorder, defaultActiveBorderColor: p.secondary },
            Card: { borderRadiusLG: 7, headerBg: p.inset, headerFontSize: 12, paddingLG: 20, padding: 16 },
            Input: { colorBorder: p.controlBorder, activeBorderColor: p.secondary, hoverBorderColor: p.controlBorder, activeShadow: "none", paddingBlock: 8 },
            InputNumber: { activeBorderColor: p.secondary, hoverBorderColor: p.controlBorder, activeShadow: "none" },
            DatePicker: { activeBorderColor: p.secondary, hoverBorderColor: p.controlBorder, activeShadow: "none" },
            Select: { colorBorder: p.controlBorder, optionSelectedBg: p.inset, optionSelectedColor: p.text, optionActiveBg: p.inset, selectorBg: p.surface, activeBorderColor: p.secondary, hoverBorderColor: p.controlBorder, activeOutlineColor: "transparent" },
            Table: { headerBg: p.inset, rowHoverBg: p.selected, borderColor: p.border, headerColor: p.secondary, cellPaddingBlock: 12, cellPaddingInline: 16, headerBorderRadius: 6 },
            Tabs: { inkBarColor: p.accent, itemSelectedColor: p.accent, itemColor: p.secondary, itemHoverColor: p.text, titleFontSize: 12 },
            Modal: { contentBg: p.surface, headerBg: p.surface, footerBg: p.inset },
            Drawer: { colorBgElevated: p.surface },
            Collapse: { headerBg: p.inset, contentBg: p.surface, borderRadiusLG: 6 },
            Segmented: { trackBg: p.inset, itemSelectedBg: p.surface, itemSelectedColor: p.text, borderRadius: 5 },
            Switch: { colorPrimary: p.accent, colorPrimaryHover: p.accent, handleBg: p.actionInk },
            Tooltip: { colorBgSpotlight: p.text, colorTextLightSolid: p.ground },
        },
    };
}
