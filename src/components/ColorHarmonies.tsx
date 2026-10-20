"use client";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { colorHarmony, type ColorHarmony } from "@/lib/color-harmonies";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadText } from "@/lib/download";
export default function ColorHarmonies({ color }: { color: string }) {
    const { t, direction } = useLanguage();
    const [mode, setMode] = useState<ColorHarmony>("complementary");
    const palette = useMemo(() => { try { return { values: colorHarmony(color, mode), error: "" }; } catch (cause) { return { values: [], error: cause instanceof Error ? cause.message : String(cause) }; } }, [color, mode]);
    const css = ":root {\n" + palette.values.map((value, index) => `  --palette-${index + 1}: ${value};`).join("\n") + "\n}";
    return <section className="wb-workbench" dir={direction} style={{ marginTop: 24 }}><h2>{t("Harmonies & shade scales")}</h2><label>{t("Palette relationship")}<select value={mode} onChange={(event) => setMode(event.target.value as ColorHarmony)}><option value="complementary">{t("Complementary · 180°")}</option><option value="analogous">{t("Analogous · ±30°")}</option><option value="triadic">{t("Triadic · 120°")}</option><option value="split-complementary">{t("Split complementary · 150° / 210°")}</option><option value="tetradic">{t("Tetradic · 90°")}</option><option value="shades">{t("Shade scale · 10–90% HSL lightness")}</option></select></label>
        {palette.error && <p role="alert">{palette.error === "Enter a HEX color with 3, 4, 6 or 8 digits." ? t(palette.error) : t("Palette diagnostic: {detail}", { detail: palette.error })}</p>}<div className="wb-palette-grid">{palette.values.map((value, index) => <button key={index} onClick={() => void copyToClipboard(value)} aria-label={t("Copy palette color {index}: {value}", { index: index + 1, value })}><span className="wb-palette-swatch" style={{ background: value }} /><code dir="ltr">{value}</code></button>)}</div>
        <div className="wb-workbench-actions"><button disabled={!palette.values.length} onClick={() => void copyToClipboard(css)}>{t("Copy CSS variables")}</button><button disabled={!palette.values.length} onClick={() => downloadText(JSON.stringify({ base: color, mode, colors: palette.values }, null, 2), "palette.json", "application/json")}>{t("Download palette JSON")}</button></div><p>{t("Harmonies rotate hue in sRGB HSL. The shade scale holds hue, saturation and alpha while changing HSL lightness; perceived brightness and contrast vary. Check foreground/background contrast before using a palette.")}</p>
    </section>;
}
