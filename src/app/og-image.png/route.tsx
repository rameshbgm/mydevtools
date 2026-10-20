import { ImageResponse } from "next/og";
import { APP_VERSION } from "@/lib/app-version";
import toolsRegistry from "@/lib/public-tool-catalog.json";
export const dynamic = "force-static";
export function GET() {
    return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "56px 64px", background: "#f5f7fb", color: "#122b42" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#006b79"/><path d="M16 17h32v30H16zM23 26l6 6-6 6M33 38h9" fill="none" stroke="white" strokeWidth="3"/></svg>
            <span style={{ fontSize: 32 }}>My Dev Tools</span>
            <span style={{ marginLeft: "auto", fontSize: 22, color: "#526477" }}>v{APP_VERSION}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 62, fontSize: 72, lineHeight: 1.12 }}><span>Your everyday</span><span style={{ color: "#006b79" }}>developer workspace.</span></div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 25, color: "#526477" }}>Format JSON. Test APIs. Inspect tokens. Work with databases.</div>
        <div style={{ display: "flex", marginTop: "auto", paddingTop: 22, borderTop: "1px solid #cdd9e4", justifyContent: "space-between", fontSize: 21 }}><span>{toolsRegistry.length} tools · {new Set(toolsRegistry.map((tool) => tool.category)).size} categories</span><span>Local processing by default</span></div>
    </div>, { width: 1200, height: 630 });
}
