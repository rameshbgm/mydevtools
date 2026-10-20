/** Opaque sRGB hex input only: CSS alpha and named colors are intentionally excluded. */
export function parseContrastHex(source: string): [number, number, number] | null {
    const match = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.exec(source.trim());
    if (!match) return null;
    const hex = match[1].length === 3 ? [...match[1]].map((value) => value + value).join("") : match[1];
    return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)) as [number, number, number];
}
function luminance(rgb: [number, number, number]): number {
    const channels = rgb.map((value) => { const channel = value / 255; return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
/** Returns null for invalid input rather than a fabricated 0:1 contrast ratio. */
export function colorContrast(foreground: string, background: string): number | null {
    const fg = parseContrastHex(foreground), bg = parseContrastHex(background);
    if (!fg || !bg) return null;
    const a = luminance(fg), b = luminance(bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
