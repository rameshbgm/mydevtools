# mydevtools — browser extension

A minimal Manifest V3 browser extension that adds a right-click "Open in mydevtools" menu to any web page. Select some text, right-click → pick a tool, and that text is pre-loaded in the chosen mydevtools tool.

The extension is intentionally **unbundled plain JS** so anyone can read every line before installing.

## What it does

- Right-click any selected text in any tab → submenu with: **Format JSON · Decode JWT · Base64 encode · Base64 decode · URL encode · URL decode · Generate hashes · Test with regex**
- Toolbar popup with quick-launch shortcuts to common tools.
- Options page to point the extension at a self-hosted mydevtools instance instead of the public site.

## How the handoff works

The extension uses the same **share-URL format** the main app uses for shareable links (see `src/lib/shareable-state.ts`). It encodes your selected text into the URL fragment (deflate-raw + base64url) and opens the tool. The tool reads the fragment on mount and restores the input.

URL fragments are **never sent to a server**, so the selected text stays between your browser and the mydevtools page you open.

## Files

```
extension/
├── manifest.json    # MV3 manifest
├── background.js    # service worker — context menus + URL building
├── popup.html       # toolbar popup
├── popup.js
├── options.html     # site-origin config (for self-hosters)
├── options.js
├── icons/           # 16/32/48/128 PNGs
└── README.md
```

## Permissions

| Permission | Why |
|---|---|
| `contextMenus` | The whole point — register right-click items |
| `clipboardRead` | Reserved for a future "from clipboard" launcher; can be removed if unused |
| `storage` | Persist the configured site origin |
| (no `host_permissions`) | The extension never reads page content; it only sees what you select |

## Install for development

1. Open Chrome / Edge / Brave → `chrome://extensions/`
2. Toggle **Developer mode** (top right)
3. Click **Load unpacked** → pick this `extension/` directory
4. Pin the extension to the toolbar

For Firefox: visit `about:debugging` → **This Firefox** → **Load Temporary Add-on** → pick `manifest.json`. MV3 support in Firefox is improving but may need minor adjustments.

## Self-host

If you run mydevtools on your own domain, click the extension icon → enter your origin (e.g. `https://tools.yourdomain.com`) → Save. All menu actions now route to your instance.

## Building icons

PNG icons live in `icons/`. The main app icons (`public/icons/icon-*.png`) are the source — copy and resize as needed:

```bash
# from repo root
cp public/icons/icon-192.png extension/icons/icon-128.png
# resize to 16/32/48 with any image tool, or reuse 192 and let the browser scale
```

(Icons are not committed yet — supply your own before publishing to a store.)

## Submission to web stores

This extension as-is is suitable for the Chrome Web Store and Edge Add-ons after icons are added and a privacy policy is linked. The codebase contains no telemetry; the privacy policy can be a one-liner: "This extension does not collect or transmit any user data."
