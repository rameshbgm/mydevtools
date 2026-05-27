// Popup logic — quick-launch shortcuts + site origin config.

const DEFAULT_SITE = "https://mydevtools.com";

async function getSiteOrigin() {
    const stored = await chrome.storage.sync.get("siteOrigin");
    return stored.siteOrigin || DEFAULT_SITE;
}

async function setSiteOrigin(origin) {
    await chrome.storage.sync.set({ siteOrigin: origin });
}

async function init() {
    const site = document.getElementById("site");
    site.value = (await getSiteOrigin()) === DEFAULT_SITE ? "" : await getSiteOrigin();
    site.placeholder = DEFAULT_SITE;

    document.getElementById("save").addEventListener("click", async () => {
        const v = site.value.trim();
        if (v && !/^https?:\/\//.test(v)) { alert("Origin must start with http:// or https://"); return; }
        await setSiteOrigin(v || DEFAULT_SITE);
        const btn = document.getElementById("save");
        btn.textContent = "Saved ✓";
        setTimeout(() => { btn.textContent = "Save"; }, 1500);
    });

    const origin = await getSiteOrigin();
    document.querySelectorAll(".quick a").forEach((a) => {
        const path = a.getAttribute("data-path");
        a.href = `${origin}${path}`;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    });
}

init();
