export interface Hsla { h: number; s: number; l: number; a: number }
export function parseHexColor(source: string): { hex: string; r: number; g: number; b: number; hsla: Hsla } {
    let value = source.trim().replace(/^#/, "");
    if (!/^(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) throw new Error("Enter a HEX color with 3, 4, 6 or 8 digits.");
    if (value.length <= 4) value = [...value].map((character) => character.repeat(2)).join("");
    const r = parseInt(value.slice(0, 2), 16), g = parseInt(value.slice(2, 4), 16), b = parseInt(value.slice(4, 6), 16), a = value.length === 8 ? parseInt(value.slice(6), 16) / 255 : 1;
    const channels = [r / 255, g / 255, b / 255], max = Math.max(...channels), min = Math.min(...channels), delta = max - min, l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1)); let h = 0;
    if (delta) h = max === channels[0] ? 60 * (((channels[1] - channels[2]) / delta) % 6) : max === channels[1] ? 60 * ((channels[2] - channels[0]) / delta + 2) : 60 * ((channels[0] - channels[1]) / delta + 4);
    return { hex: "#" + value.toLowerCase(), r, g, b, hsla: { h: (h + 360) % 360, s: s * 100, l: l * 100, a } };
}
export function hslaHex({ h, s, l, a }: Hsla): string {
    const hue = ((h % 360) + 360) % 360, saturation = Math.min(100, Math.max(0, s)) / 100, lightness = Math.min(100, Math.max(0, l)) / 100;
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation, x = chroma * (1 - Math.abs((hue / 60) % 2 - 1)), m = lightness - chroma / 2;
    const values = hue < 60 ? [chroma, x, 0] : hue < 120 ? [x, chroma, 0] : hue < 180 ? [0, chroma, x] : hue < 240 ? [0, x, chroma] : hue < 300 ? [x, 0, chroma] : [chroma, 0, x];
    return "#" + [...values.map((value) => Math.round((value + m) * 255)), ...(a < 1 ? [Math.round(Math.max(0, a) * 255)] : [])].map((value) => value.toString(16).padStart(2, "0")).join("");
}
export const COLOR_HARMONIES = { complementary: [0, 180], analogous: [-30, 0, 30], triadic: [0, 120, 240], "split-complementary": [0, 150, 210], tetradic: [0, 90, 180, 270] } as const;
export type ColorHarmony = keyof typeof COLOR_HARMONIES | "shades";
export function colorHarmony(source: string, mode: ColorHarmony): string[] {
    const { hsla } = parseHexColor(source);
    return mode === "shades" ? Array.from({ length: 9 }, (_, index) => hslaHex({ ...hsla, l: (index + 1) * 10 })) : COLOR_HARMONIES[mode].map((offset) => hslaHex({ ...hsla, h: hsla.h + offset }));
}
