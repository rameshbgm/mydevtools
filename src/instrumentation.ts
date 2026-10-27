// Fallback for hosts that invoke the generated standalone server directly.
// Supported production launchers preload this before Next itself starts.
export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NEXT_PHASE !== "phase-production-build") {
        const { default: enforceServerPrivacy } = await import("../desktop/privacy.cjs");
        enforceServerPrivacy();
    }
}
