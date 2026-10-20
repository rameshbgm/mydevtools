"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { AuthoredDiagnosticError, authoredDiagnosticText } from "@/lib/i18n/authored-diagnostics";
import { useLanguage } from "@/components/LanguageProvider";
import ToolPageLayout from "@/components/ToolPageLayout";
import { packIco, maskableImageRect } from "@/lib/favicon-exports";
import { copyToClipboard } from "@/lib/clipboard";
import { downloadBlob, downloadText } from "@/lib/download";
const SIZES = [
    { size: 16, name: "favicon-16x16.png" }, { size: 32, name: "favicon-32x32.png" }, { size: 48, name: "favicon-48x48.png" }, { size: 96, name: "favicon-96x96.png" }, { size: 180, name: "apple-touch-icon.png" }, { size: 192, name: "android-chrome-192x192.png" }, { size: 512, name: "android-chrome-512x512.png" },
];
interface Variant { width: number; height: number; name: string; blob: Blob; preview?: Blob; role: "any" | "maskable" | "ico" }
function ImagePreview({ blob, name, safeZone = false }: { blob: Blob; name: string; safeZone?: boolean }) {
    const [url, setUrl] = useState("");
    useEffect(() => { const next = URL.createObjectURL(blob); setUrl(next); return () => URL.revokeObjectURL(next); }, [blob]);
    return <div className="wb-icon-preview">{url && <img src={url} alt={name} />}{safeZone && <span className="wb-icon-safe-zone" aria-hidden="true" />}</div>;
}
async function renderIcon(image: HTMLImageElement, size: number, maskable = false, background = "#ffffff"): Promise<Blob> {
    const canvas = document.createElement("canvas"); canvas.width = size; canvas.height = size; const context = canvas.getContext("2d"); if (!context) throw new AuthoredDiagnosticError("Canvas is unavailable.");
    if (maskable) { context.fillStyle = background; context.fillRect(0, 0, size, size); }
    const scale = size / Math.max(image.naturalWidth, image.naturalHeight), rectangle = maskable ? maskableImageRect(image.naturalWidth, image.naturalHeight, size) : { width: image.naturalWidth * scale, height: image.naturalHeight * scale, x: (size - image.naturalWidth * scale) / 2, y: (size - image.naturalHeight * scale) / 2 };
    context.imageSmoothingQuality = "high"; context.drawImage(image, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new AuthoredDiagnosticError("PNG encoding failed.")), "image/png"));
}
export default function FaviconGeneratorPage() {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null), [image, setImage] = useState<HTMLImageElement | null>(null), [selected, setSelected] = useState(SIZES.map((size) => size.size));
    const [includeIco, setIncludeIco] = useState(true), [includeMaskable, setIncludeMaskable] = useState(true), [background, setBackground] = useState("#ffffff"), [appName, setAppName] = useState("My app");
    const [variants, setVariants] = useState<Variant[]>([]), [loading, setLoading] = useState(false), [generating, setGenerating] = useState(false), [zipping, setZipping] = useState(false), [error, setError] = useState<AuthoredDiagnosticError | string>("");
    const fileInput = useRef<HTMLInputElement>(null);
    const busy = loading || generating || zipping;
    useEffect(() => {
        if (!file) { setImage(null); setVariants([]); return; }
        let cancelled = false; const url = URL.createObjectURL(file), next = new Image(); setLoading(true); setImage(null); setError("");
        const deadline = setTimeout(() => { if (!cancelled) { setLoading(false); setError(new AuthoredDiagnosticError("Image decoding exceeded twenty seconds. Try a smaller source or another format.")); next.onload = null; next.onerror = null; next.src = ""; } }, 20_000);
        next.onload = () => { clearTimeout(deadline); if (cancelled) return; setLoading(false); if (!next.naturalWidth || !next.naturalHeight || next.naturalWidth > 10_000 || next.naturalHeight > 10_000 || next.naturalWidth * next.naturalHeight > 40_000_000) { setError(new AuthoredDiagnosticError("Source limit is 10,000 pixels per side and 40 megapixels.")); return; } setImage(next); };
        next.onerror = () => { clearTimeout(deadline); if (!cancelled) { setLoading(false); setError(new AuthoredDiagnosticError("This browser cannot decode the image. Try a self-contained SVG, PNG, JPEG, WebP or AVIF.")); } }; next.src = url;
        return () => { cancelled = true; clearTimeout(deadline); next.onload = null; next.onerror = null; URL.revokeObjectURL(url); };
    }, [file]);
    useEffect(() => {
        if (!image) { setVariants([]); return; }
        let cancelled = false; setGenerating(true); setVariants([]); setError("");
        (async () => {
            try {
                const output: Variant[] = [];
                for (const item of SIZES.filter((size) => selected.includes(size.size))) { const blob = await renderIcon(image, item.size); output.push({ width: item.size, height: item.size, name: item.name, blob, role: "any" }); }
                if (includeIco) { const sizes = [16, 32, 48, 64, 128, 256], entries: { size: number; bytes: Uint8Array }[] = []; let preview: Blob | undefined; for (const size of sizes) { const blob = await renderIcon(image, size); entries.push({ size, bytes: new Uint8Array(await blob.arrayBuffer()) }); if (size === 256) preview = blob; } const ico = packIco(entries); output.push({ width: 256, height: 256, name: "favicon.ico", blob: new Blob([new Uint8Array(ico)], { type: "image/vnd.microsoft.icon" }), preview, role: "ico" }); }
                if (includeMaskable) output.push({ width: 512, height: 512, name: "maskable-icon-512x512.png", blob: await renderIcon(image, 512, true, background), role: "maskable" });
                if (!cancelled) setVariants(output);
            } catch (cause) { if (!cancelled) setError(cause instanceof AuthoredDiagnosticError ? cause : cause instanceof Error ? cause.message : String(cause)); }
            finally { if (!cancelled) setGenerating(false); }
        })();
        return () => { cancelled = true; };
    }, [image, selected, includeIco, includeMaskable, background]);
    const manifest = useMemo(() => JSON.stringify({ name: appName || "My app", short_name: Array.from(appName || "My app").slice(0, 20).join(""), start_url: "/", display: "standalone", theme_color: background, background_color: background, icons: variants.filter((variant) => variant.role === "maskable" || variant.role === "any" && variant.width >= 192).map((variant) => ({ src: "/" + variant.name, sizes: `${variant.width}x${variant.height}`, type: "image/png", purpose: variant.role })) }, null, 2), [variants, appName, background]);
    const html = variants.flatMap((variant) => variant.role === "ico" ? ['<link rel="icon" type="image/vnd.microsoft.icon" sizes="16x16 32x32 48x48 64x64 128x128 256x256" href="/favicon.ico">'] : variant.name === "apple-touch-icon.png" ? ['<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">'] : variant.role === "any" && variant.width <= 96 ? [`<link rel="icon" type="image/png" sizes="${variant.width}x${variant.height}" href="/${variant.name}">`] : []).join("\n") + '\n<link rel="manifest" href="/site.webmanifest">';
    const downloadPack = async () => {
        setZipping(true); setError("");
        try { const { default: JSZip } = await import("jszip"), zip = new JSZip(); for (const variant of variants) zip.file(variant.name, await variant.blob.arrayBuffer()); zip.file("site.webmanifest", manifest); zip.file("head-snippet.html", html); zip.file("README.txt", "Generated locally with My Dev Tools.\nReview app name, start_url and manifest scope before deployment.\nICO contains PNG-compressed 16/32/48/64/128/256px entries for modern icon decoders.\nMaskable content fits the central safe-zone circle (40% radius) on an opaque background.\nUse ordinary purpose:any icons alongside purpose:maskable icons.\n"); downloadBlob(await zip.generateAsync({ type: "blob" }), "favicon-pack.zip"); }
        catch (cause) { setError(cause instanceof AuthoredDiagnosticError ? cause : cause instanceof Error ? cause.message : String(cause)); } finally { setZipping(false); }
    };
    return <ToolPageLayout title={t("Favicon, ICO & Maskable Icon Generator")} description={t("Generate PNG icons, a multi-size ICO and a maskable PWA icon with a matching manifest and ZIP pack")} icon={<AppstoreOutlined />} color="#0284c7" learnMore={{ whatIs: "A local Canvas icon generator. Creates common PNG sizes, a six-size PNG-compressed ICO and a maskable icon whose entire source artwork fits inside the manifest safe-zone circle.", whyUse: "Prepare browser tab, Apple touch and PWA icons together, with manifest entries that match the actual files.", howToUse: ["Choose an image up to 16 MiB; a square vector or large PNG works well", "Choose PNG sizes and ICO/maskable exports", "Set an opaque maskable background and review previews", "Download individual files or a single ZIP with manifest and HTML"], tips: ["The maskable outline is a preview guide only; it is not included in the downloaded PNG.", "Non-square artwork is centered and fitted without stretching.", "ICO entries use PNG compression for modern decoders; very old Windows versions may need BMP-compressed entries.", "SVG sources are rendered as images; use self-contained resources. Canvas output does not copy source metadata."] }}><div className="wb-workbench">
        <label>{t("Source image (up to 16 MiB)")}<input style={{ fontSize: 16 }} ref={fileInput} type="file" accept="image/*,.svg" disabled={busy} onChange={(event) => { const next = event.target.files?.[0]; if (!next) return; if (next.size > 16 * 1024 * 1024) { setError(new AuthoredDiagnosticError("Source image limit is 16 MiB.")); return; } setFile(next); }} /></label><p>{t("The source is decoded locally in an image context and exported through Canvas. No image is uploaded.")}</p>
        <fieldset className="wb-cron-field"><legend>{t("PNG sizes")}</legend><div className="wb-workbench-actions">{SIZES.map((item) => <label className="wb-checkbox" key={item.size}><input style={{ fontSize: 16 }} type="checkbox" checked={selected.includes(item.size)} disabled={busy} onChange={(event) => setSelected((current) => event.target.checked ? [...current, item.size] : current.filter((size) => size !== item.size))} />{item.size}{t("px")}</label>)}</div></fieldset>
        <label className="wb-checkbox"><input style={{ fontSize: 16 }} type="checkbox" checked={includeIco} disabled={busy} onChange={(event) => setIncludeIco(event.target.checked)} />{t("Include favicon.ico · 16, 32, 48, 64, 128 and 256px PNG-compressed entries")}</label><label className="wb-checkbox"><input style={{ fontSize: 16 }} type="checkbox" checked={includeMaskable} disabled={busy} onChange={(event) => setIncludeMaskable(event.target.checked)} />{t("Include 512px maskable icon")}</label><div className="wb-form-grid"><label>{t("Opaque maskable / manifest background")}<input style={{ fontSize: 16 }} type="color" value={background} disabled={busy} onChange={(event) => setBackground(event.target.value)} /></label><label>{t("Application name in manifest")}<input dir="auto" style={{ fontSize: 16 }} value={appName} maxLength={100} disabled={zipping} onChange={(event) => setAppName(event.target.value)} /></label></div>
        {busy && <p role="status">{loading ? t("Decoding source…") : generating ? t("Generating icons…") : t("Preparing ZIP…")}</p>}{Boolean(error) && <div role="alert"><p>{t("Unable to process this image. Check the image format and size, then try again.")}</p><pre dir={error instanceof AuthoredDiagnosticError ? "auto" : "ltr"} style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}><bdi>{authoredDiagnosticText(t, error)}</bdi></pre></div>}
        {image && <p>{t("Source:")}{file?.name} · {image.naturalWidth} × {image.naturalHeight}{t(". Ordinary icons use a centered fit; maskable artwork fits inside a circle with radius 40% of the icon width. Transparent margins in the source count toward its bounds.")}</p>}
        {file && <button disabled={busy} onClick={() => { setFile(null); setError(""); if (fileInput.current) fileInput.current.value = ""; }}>{t("Clear source image")}</button>}
        {variants.length > 0 && <><div className="wb-workbench-actions"><button disabled={busy} onClick={() => void downloadPack()}>{t("Download ZIP pack ({count} icon files)", { count: variants.length })}</button><button disabled={busy} onClick={() => downloadText(manifest, "site.webmanifest", "application/manifest+json")}>{t("Download manifest")}</button></div><div className="wb-icon-grid">{variants.map((variant) => <section className="wb-workbench wb-icon-variant" key={variant.name}><ImagePreview blob={variant.preview ?? variant.blob} name={variant.name} safeZone={variant.role === "maskable"} /><strong dir="ltr" style={{ overflowWrap: "anywhere" }}>{variant.name}</strong><span>{variant.role === "ico" ? t("6 embedded sizes") : `${variant.width} × ${variant.height}`} · {variant.blob.size.toLocaleString()}{t("bytes")}</span><button disabled={busy} onClick={() => downloadBlob(variant.blob, variant.name)}>{t("Download")}{variant.role === "ico" ? "ICO" : variant.role === "maskable" ? t("maskable PNG") : `${variant.width}px PNG`}</button></section>)}</div><div className="tool-split-pane" style={{ gap: 24 }}><section className="wb-workbench"><label>{t("HTML head snippet")}<textarea dir="ltr" style={{ fontSize: 16, textAlign: "left" }} rows={10} readOnly value={html} /></label><button onClick={() => void copyToClipboard(html)}>{t("Copy HTML snippet")}</button></section><section className="wb-workbench"><label>{t("Web app manifest")}<textarea dir="ltr" style={{ fontSize: 16, textAlign: "left" }} rows={15} readOnly value={manifest} /></label><button onClick={() => void copyToClipboard(manifest)}>{t("Copy manifest")}</button></section></div><p>{t("Use ordinary purpose:any icons alongside maskable icons. Review app name, start_url, scope and icon paths before publishing your manifest. The preview safe-zone outline is not exported.")}</p></>}
    </div></ToolPageLayout>;
}
