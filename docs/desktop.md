# Desktop edition

The desktop edition packages My Dev Tools 2.0.0, its production Next.js server and local assets. It opens at the stable `mydevtools://app` origin, so saved projects and preferences survive a restart even though the backend's loopback port changes.

## Build and run

Use Node.js 24 or newer and install the locked dependencies with `npm ci`. Electron's official binary download must be permitted by the package manager's install-script policy. The repository approves only the pinned Electron package's install script.

```bash
npm run build
npm run desktop:stage
npm run desktop:dev
```

`desktop:dev` stages the current production build again before opening Electron. Rebuild the production application after changing frontend code. Staging recreates only the ignored `.desktop` directory.

```bash
npm run desktop:package
```

Packaging runs desktop type checking and protocol boundary tests, builds the production application, stages its standalone runtime and builds the current host's package into `desktop-dist`. Configuration includes macOS ZIP, Windows NSIS and Linux AppImage targets. Build and launch each platform's target on that platform before distributing it; the current validation covers macOS Apple Silicon. The local Mac build uses ad-hoc signing. Developer ID signing, notarization, Windows signing and public distribution have not been performed.

The current local validation artifact is production build 72: `desktop-dist/validation-72/My Dev Tools-2.0.0-arm64-mac.zip` (SHA-256 `739ee760f49215e3079d6efd38159e408bb4e2f9ecdd2789124e8f2a12f44c27`). It contains build `hKxH5rvTopqVcW1Bd_kCT`. Its `validation.json` and audit sidecars record 730 exact offline asset hashes, 4,987 bundled runtime files, shell/ASAR source hashes, archive contents, strict code signatures, security fuses and isolated native-runtime checks. Native library code signing is checked separately from unchanged executable content. The staged and packaged runtimes pass loopback/authentication and asset checks; isolated PostgreSQL, MySQL, MariaDB, Redis and gRPC drivers reach their expected refused fixture connections without loading repository dependencies. No GUI/browser verification was performed for this artifact. The previous build 59 archive is preserved. This is a local ad-hoc-signed validation package, not a published or installed release; later source changes require rebuilding and repackaging.

To check the staged runtime independently:

```bash
node scripts/desktop-runtime.integration.mjs
```

## Offline behavior

The app shell, tool routes, fonts, icons, Monaco editor, SQLite worker/WASM and ONNX inference factories/WASM are bundled. Opening local tools does not require a deployed website or a first online visit. The desktop app does not install the web PWA service worker, so application updates use the bundled files directly.

Network tools still require their configured endpoints. Semantic Search downloads model metadata, tokenizer files and weights only after **Load model** or indexing is requested. Its compute runtime is local; model weights are not included in the installer. Cached model availability depends on the desktop profile's browser storage and eviction. An uncached model needs connectivity. Provider token counting and reference/source links also need their respective external services.

The ONNX assets are copied by `npm run copy-onnx`, also part of `postinstall`. Their factories and binaries come from the installed, locked `onnxruntime-web` package. `third-party/onnxruntime` contains the official license and third-party notices at that package's exact source revision. A package revision change requires reviewing and updating those notices; the copy script rejects a mismatch.

## Native connectors and isolation

Native SQL, Redis, S3, document, HTTP, gRPC and temporary mock operations use the bundled local runtime. Desktop access is supplied automatically; there is no access-key entry step. Database credentials and request payloads go to the endpoint selected in the tool. Review the tool's data boundary and connection settings before sending.

The backend binds only `127.0.0.1` on an ephemeral port. A fresh random access token is created on each app launch and stays in the main/backend processes. The custom protocol relay supplies it only to the exact native connector route. Caller-supplied access tokens and internal frame-proof headers are stripped. Write requests require the app's origin or browser-side proof of the owning app frame; opaque and foreign origins are rejected. The backend also enforces its existing access, body and concurrency checks.

The renderer has sandboxing and context isolation enabled, Node integration disabled and no preload/IPC bridge. Remote web navigation opens in the default browser; foreign embedded navigation and webviews are blocked. Device permissions are denied, with sanitized clipboard writing allowed for the app origin. Keyboard paste remains available. The content policy allows dynamic evaluation required by bundled validators and user-entered HTTP assertions; it is not a sandbox for those scripts. Do not run untrusted assertion code. Remote script imports are not enabled.

Electron fuses disable RunAsNode, Node options from the environment, Node CLI inspection and extra file-protocol privileges, and enable ASAR integrity and loading the main application only from ASAR. Runtime environment inheritance is limited to normal platform paths, temporary-directory and locale settings; unrelated cloud secrets, proxy configuration and Node injection flags are not forwarded.

## Storage and updates

The desktop browser profile is separate from Chrome and other installed browsers. Existing web data is not automatically migrated. Use tool exports, encrypted vault backups and [Memory & Storage](storage-and-projects.md) to move supported records. Local storage remains on this device and is not synchronized.

Light mode is the first-launch default. Saved light/dark preferences are preserved. Replacing a package with the same application ID retains the profile; uninstallers and system cleanup tools may remove it. Make backups before upgrades or removing the application. There is no automatic updater or update download service in this release.
