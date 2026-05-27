const DEFAULT_SITE = "https://mydevtools.com";

async function init() {
    const site = document.getElementById("site");
    const stored = await chrome.storage.sync.get("siteOrigin");
    site.value = (stored.siteOrigin && stored.siteOrigin !== DEFAULT_SITE) ? stored.siteOrigin : "";
    site.placeholder = DEFAULT_SITE;

    document.getElementById("save").addEventListener("click", async () => {
        const v = site.value.trim();
        if (v && !/^https?:\/\//.test(v)) { alert("Origin must start with http:// or https://"); return; }
        await chrome.storage.sync.set({ siteOrigin: v || DEFAULT_SITE });
        const btn = document.getElementById("save");
        btn.textContent = "Saved ✓";
        setTimeout(() => { btn.textContent = "Save"; }, 1500);
    });
}

init();
