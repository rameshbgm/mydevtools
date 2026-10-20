export interface PaletteSwatch { hex: string; rgb: [number, number, number]; hsl: [number, number, number]; count: number }
function hsl([red, green, blue]: number[]): [number, number, number] {
    const r = red / 255, g = green / 255, b = blue / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min, light = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * light - 1));
    const hue = delta === 0 ? 0 : max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
    return [Math.round(hue * 60) % 360, Math.round(saturation * 100), Math.round(light * 100)];
}
const distance = (a: number[], b: number[]) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
/** Deterministic RGB k-means. Counts describe sampled opaque pixels, not visual salience. */
export function extractPalette(pixels: number[][], requested: number, iterations = 8): PaletteSwatch[] {
    if (!pixels.length) return [];
    if (pixels.some((pixel) => pixel.length !== 3 || pixel.some((value) => !Number.isInteger(value) || value < 0 || value > 255))) throw new Error("Invalid RGB sample.");
    if (!Number.isInteger(requested) || requested < 1 || requested > 16 || !Number.isInteger(iterations) || iterations < 1 || iterations > 100) throw new Error("Invalid palette settings.");
    const distinct = [...new Map(pixels.map((pixel) => [pixel.join(","), pixel])).values()];
    const count = Math.min(requested, distinct.length), centroids = [[...distinct[0]]];
    // Farthest-point initialization avoids duplicate seeds when large flat regions
    // happen to occupy every evenly spaced sampling position.
    while (centroids.length < count) {
        let best = distinct[0], farthest = -1;
        for (const pixel of distinct) {
            const nearest = Math.min(...centroids.map((centroid) => distance(pixel, centroid)));
            if (nearest > farthest) { farthest = nearest; best = pixel; }
        }
        centroids.push([...best]);
    }
    const nearest = (pixel: number[]) => {
        let best = 0, bestDistance = Infinity;
        centroids.forEach((centroid, index) => { const d = distance(pixel, centroid); if (d < bestDistance) { bestDistance = d; best = index; } });
        return best;
    };
    for (let iteration = 0; iteration < iterations; iteration++) {
        const sums = Array.from({ length: count }, () => [0, 0, 0, 0]);
        for (const pixel of pixels) { const sum = sums[nearest(pixel)]; sum[0] += pixel[0]; sum[1] += pixel[1]; sum[2] += pixel[2]; sum[3]++; }
        for (let index = 0; index < count; index++) if (sums[index][3]) centroids[index] = sums[index].slice(0, 3).map((value) => value / sums[index][3]);
    }
    const counts = Array<number>(count).fill(0);
    pixels.forEach((pixel) => { counts[nearest(pixel)]++; });
    const merged = new Map<string, PaletteSwatch>();
    centroids.forEach((centroid, index) => {
        if (!counts[index]) return;
        const rgb = centroid.map(Math.round) as [number, number, number];
        const hex = "#" + rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("");
        const previous = merged.get(hex);
        if (previous) previous.count += counts[index];
        else merged.set(hex, { hex, rgb, hsl: hsl(rgb), count: counts[index] });
    });
    return [...merged.values()].sort((left, right) => right.count - left.count);
}
