// Load before the runtime/framework, never from build or test entrypoints.
// The server intentionally emits no runtime output, including error payloads.
module.exports = function enforceServerPrivacy() {
    process.env.NEXT_TELEMETRY_DISABLED = "1";
    process.env.OTEL_SDK_DISABLED = "true";
    process.env.OTEL_TRACES_EXPORTER = "none";
    process.env.OTEL_METRICS_EXPORTER = "none";
    process.env.OTEL_LOGS_EXPORTER = "none";
    process.env.NEXT_OTEL_FETCH_DISABLED = "1";
    process.env.NEXT_OTEL_VERBOSE = "0";
    delete process.env.NEXT_OTEL_PERFORMANCE_PREFIX;
    delete process.env.NODE_DEBUG;
    delete process.env.NODE_DEBUG_NATIVE;
    delete process.env.DEBUG;
    if (process.report) {
        process.report.reportOnFatalError = false;
        process.report.reportOnSignal = false;
        process.report.reportOnUncaughtException = false;
    }
    if (Object.getOwnPropertyDescriptor(process.stdout, "write")?.writable === false) return;
    // Fatal application errors must fail closed without printing their data.
    process.prependListener("uncaughtException", () => process.exit(1));
    process.prependListener("unhandledRejection", () => process.exit(1));
    // Dropping writes at the stream boundary also covers framework/dependency
    // errors. Preserve Writable.write's callback contract without buffering.
    for (const stream of [process.stdout, process.stderr]) {
        if (Object.getOwnPropertyDescriptor(stream, "write")?.writable === false) continue;
        Object.defineProperty(stream, "write", {
            configurable: false,
            writable: false,
            /** @param {unknown[]} args */
            value(...args) {
                const callback = args.at(-1);
                if (typeof callback === "function") queueMicrotask(() => callback());
                return true;
            },
        });
    }
};
