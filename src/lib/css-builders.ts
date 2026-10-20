import { parseHexColor } from "./color-harmonies";
const number = (value: number, minimum: number, maximum: number, name: string) => { if (!Number.isFinite(value) || value < minimum || value > maximum) throw new Error(`${name} must be ${minimum}–${maximum}.`); return Number(value.toFixed(4)); };
export interface ShadowLayer { id: string; x: number; y: number; blur: number; spread: number; color: string; inset: boolean }
export function shadowCss(layers: ShadowLayer[]): string {
    if (!layers.length || layers.length > 8) throw new Error("Use 1–8 shadow layers.");
    return layers.map((layer) => `${layer.inset ? "inset " : ""}${number(layer.x, -200, 200, "Horizontal offset")}px ${number(layer.y, -200, 200, "Vertical offset")}px ${number(layer.blur, 0, 300, "Blur")}px ${number(layer.spread, -200, 200, "Spread")}px ${parseHexColor(layer.color).hex}`).join(",\n    ");
}
export function radiusCss(horizontal: number[], vertical: number[], unit: "px" | "%"): string {
    if (horizontal.length !== 4 || vertical.length !== 4 || !["px", "%"].includes(unit)) throw new Error("Enter four horizontal and four vertical corner radii.");
    const values = (input: number[]) => input.map((value) => number(value, 0, unit === "%" ? 100 : 300, "Corner radius") + unit).join(" ");
    return `${values(horizontal)} / ${values(vertical)}`;
}
export interface FluidFontInput { narrowSize: number; wideSize: number; narrowViewport: number; wideViewport: number; rootSize: number }
export function fluidFontCss(input: FluidFontInput) {
    const narrow = number(input.narrowSize, 1, 500, "Narrow-screen font size"), wide = number(input.wideSize, 1, 500, "Wide-screen font size"), minimumWidth = number(input.narrowViewport, 1, 10_000, "Narrow viewport"), maximumWidth = number(input.wideViewport, 1, 10_000, "Wide viewport"), root = number(input.rootSize, 8, 64, "Root font size");
    if (maximumWidth <= minimumWidth) throw new Error("Wide viewport must be larger than narrow viewport.");
    const slope = (wide - narrow) / (maximumWidth - minimumWidth), intercept = narrow - slope * minimumWidth;
    const rounded = (value: number) => Number(value.toFixed(6));
    const css = `clamp(${rounded(Math.min(narrow, wide) / root)}rem, calc(${rounded(intercept / root)}rem ${slope < 0 ? "-" : "+"} ${rounded(Math.abs(slope) * 100)}vw), ${rounded(Math.max(narrow, wide) / root)}rem)`;
    return { css, atViewport: (width: number) => Math.max(Math.min(narrow, wide), Math.min(Math.max(narrow, wide), intercept + slope * number(width, 1, 10_000, "Preview viewport"))) };
}
export interface GradientStop { id: string; color: string; position: number }
export function gradientCss(stops: GradientStop[], type: "linear" | "radial" | "conic", angle: number): string {
    if (stops.length < 2 || stops.length > 8 || !["linear", "radial", "conic"].includes(type)) throw new Error("Choose 2–8 gradient stops and a supported gradient type.");
    const rotation = number(angle, 0, 360, "Gradient angle");
    const colors = stops.map((stop) => ({ color: parseHexColor(stop.color).hex, position: number(stop.position, 0, 100, "Stop position") })).sort((left, right) => left.position - right.position).map((stop) => `${stop.color} ${type === "conic" ? Number((stop.position * 3.6).toFixed(4)) + "deg" : stop.position + "%"}`).join(", ");
    return type === "radial" ? `radial-gradient(ellipse at center, ${colors})` : type === "conic" ? `conic-gradient(from ${rotation}deg, ${colors})` : `linear-gradient(${rotation}deg, ${colors})`;
}
