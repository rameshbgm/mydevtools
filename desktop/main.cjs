const { app, BrowserWindow, dialog, Menu, protocol, session, shell, utilityProcess } = require("electron");
const { randomBytes } = require("node:crypto");
const { join, resolve } = require("node:path");
const { APP_ORIGIN, FRAME_PROOF_HEADER, CSP, isAppUrl, safeExternalUrl, requestTarget, trustedDesktopInitiator, relayHeaders, boundedBody, appLocation } = require("./protocol.cjs");
protocol.registerSchemesAsPrivileged([{ scheme: "mydevtools", privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } }]);
app.enableSandbox();
app.setName("My Dev Tools");
/** @type {import('electron').BrowserWindow | null} */
let window = null;
/** @type {import('electron').UtilityProcess | undefined} */
let backend;
let quitting = false;
const singleton = app.requestSingleInstanceLock();
if (!singleton) app.quit();
else {
    app.on("second-instance", () => { if (window) { if (window.isMinimized()) window.restore(); window.focus(); } });
    app.whenReady().then(start).catch(() => { dialog.showErrorBox("My Dev Tools could not start", "The bundled runtime could not start. Reinstall the app from a trusted package, or rebuild the desktop package from the production build."); app.quit(); });
}
/** @param {string} token */
function runtimeEnvironment(token) {
    // Do not inherit Node injection flags, cloud credentials, proxies or an
    // unrelated project's secrets into the local connector process.
    /** @type {Record<string, string>} */
    const env = {};
    for (const name of ["PATH", "HOME", "USERPROFILE", "SystemRoot", "WINDIR", "TEMP", "TMP", "TMPDIR", "LANG", "LC_ALL"]) { const value = process.env[name]; if (value) env[name] = value; }
    return { ...env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1", MYDEVTOOLS_LOCAL_CONNECTORS: "true", MYDEVTOOLS_LOCAL_CONNECTOR_TOKEN: token, MYDEVTOOLS_DESKTOP: "true" };
}
async function start() {
    const token = randomBytes(32).toString("hex");
    const runtime = app.isPackaged ? join(process.resourcesPath, "runtime") : resolve(__dirname, "../.desktop/runtime");
    const origin = await /** @type {Promise<string>} */ (new Promise((resolve, reject) => {
        const timer = setTimeout(() => { backend?.kill(); reject(new Error("Runtime startup timed out.")); }, 30000);
        backend = utilityProcess.fork(join(__dirname, "backend.cjs"), [runtime], { env: runtimeEnvironment(token), stdio: "ignore", serviceName: "My Dev Tools local runtime" });
        backend.once("exit", () => { clearTimeout(timer); reject(new Error("Runtime exited during startup.")); if (!quitting && window) { dialog.showErrorBox("Local runtime stopped", "Close and reopen My Dev Tools to restart its local runtime. Saved browser data remains on this device."); app.quit(); } });
        backend.on("message", (message) => {
            if (message?.ready === true && Number.isInteger(message.port) && message.port > 0 && message.port <= 65535) { clearTimeout(timer); resolve("http://127.0.0.1:" + message.port); }
            else if (message?.error) { clearTimeout(timer); reject(new Error("Runtime startup failed.")); }
        });
    }));
    const ses = session.defaultSession;
    const frameProof = randomBytes(32).toString("hex");
    // Chromium omits Origin on same-origin custom-protocol POSTs. Authenticate
    // their original initiating frame through Electron's browser-side request
    // metadata, rather than accepting missing/opaque origins on trust.
    ses.webRequest.onBeforeSendHeaders({ urls: ["mydevtools://app/*"] }, (details, callback) => {
        const headers = { ...details.requestHeaders };
        for (const name of Object.keys(headers)) if (name.toLowerCase() === FRAME_PROOF_HEADER) delete headers[name];
        if (trustedDesktopInitiator(details, window?.webContents.id)) headers[FRAME_PROOF_HEADER] = frameProof;
        callback({ requestHeaders: headers });
    });
    ses.setPermissionCheckHandler((_contents, permission, requestingOrigin) => permission === "clipboard-sanitized-write" && isAppUrl(requestingOrigin));
    ses.setPermissionRequestHandler((contents, permission, callback) => callback(permission === "clipboard-sanitized-write" && isAppUrl(contents.getURL())));
    ses.setDevicePermissionHandler(() => false);
    ses.protocol.handle("mydevtools", async (request) => {
        try {
            const trusted = request.headers.get(FRAME_PROOF_HEADER) === frameProof;
            const target = requestTarget(request.url, origin), headers = relayHeaders(request, origin, token, trusted), body = await boundedBody(request);
            const response = await fetch(target, { method: request.method, headers, body, redirect: "manual", signal: request.signal });
            const outputHeaders = new Headers(response.headers);
            outputHeaders.delete("content-encoding"); outputHeaders.delete("content-length");
            outputHeaders.set("Content-Security-Policy", CSP);
            const location = outputHeaders.get("location");
            if (location) outputHeaders.set("location", appLocation(location, origin));
            return new Response([204, 205, 304].includes(response.status) || request.method === "HEAD" ? null : response.body, { status: response.status, statusText: response.statusText, headers: outputHeaders });
        } catch (cause) {
            const ownErrors = ["Unknown app origin.", "Invalid local runtime.", "Foreign or opaque app origin.", "Cross-site app request.", "App write request is missing its origin.", "App request exceeds 14 MiB.", "Unexpected external redirect."];
            const error = cause instanceof Error && ownErrors.includes(cause.message) ? cause.message : "The desktop relay could not complete this request.";
            return Response.json({ error }, { status: 403, headers: { "Cache-Control": "no-store", "Content-Security-Policy": CSP } });
        }
    });
    /** @param {string} value */
    const openExternal = (value) => { const url = safeExternalUrl(value); if (url) void shell.openExternal(url).catch(() => {}); };
    window = new BrowserWindow({ width: 1440, height: 960, minWidth: 360, minHeight: 540, show: false, backgroundColor: "#f8fafc", title: "My Dev Tools", autoHideMenuBar: false, webPreferences: { nodeIntegration: false, nodeIntegrationInWorker: false, nodeIntegrationInSubFrames: false, contextIsolation: true, sandbox: true, webSecurity: true, allowRunningInsecureContent: false, webviewTag: false, navigateOnDragDrop: false, spellcheck: false } });
    window.webContents.on("will-attach-webview", (event) => event.preventDefault());
    window.webContents.on("will-navigate", (event) => { if (!isAppUrl(event.url)) { event.preventDefault(); openExternal(event.url); } });
    window.webContents.on("will-frame-navigate", (event) => { if (!isAppUrl(event.url) && !event.url.startsWith("blob:" + APP_ORIGIN + "/") && event.url !== "about:blank" && event.url !== "about:srcdoc") event.preventDefault(); });
    window.webContents.setWindowOpenHandler(({ url }) => { openExternal(url); return { action: "deny" }; });
    window.once("ready-to-show", () => window?.show());
    window.on("closed", () => { window = null; app.quit(); });
    /** @type {import('electron').MenuItemConstructorOptions[]} */
    const menus = [
        { label: "File", submenu: [{ label: "Dashboard", click: () => void window?.loadURL(APP_ORIGIN + "/") }, { label: "Memory & Storage", click: () => void window?.loadURL(APP_ORIGIN + "/memory") }, { type: "separator" }, { role: "quit" }] },
        { role: "editMenu" }, { role: "viewMenu" }, { role: "windowMenu" },
        { label: "Help", submenu: [{ label: "Release notes", click: () => void window?.loadURL(APP_ORIGIN + "/release-notes") }] },
    ];
    if (process.platform === "darwin") menus.unshift({ label: "My Dev Tools", submenu: [{ role: "about" }, { type: "separator" }, { role: "hide" }, { role: "hideOthers" }, { role: "unhide" }, { type: "separator" }, { role: "quit" }] });
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
    await window.loadURL(APP_ORIGIN + "/");
}
app.on("before-quit", () => { quitting = true; backend?.kill(); });
app.on("window-all-closed", () => app.quit());
