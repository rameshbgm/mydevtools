module.exports = {
    appId: "tech.mydevtools.desktop",
    productName: "My Dev Tools",
    executableName: "mydevtools",
    directories: { app: "desktop", output: "desktop-dist" },
    electronVersion: require("../package.json").devDependencies.electron,
    files: ["*.cjs", "!electron-builder.cjs", "package.json", "!node_modules{,/**/*}"],
    extraResources: [
        { from: ".desktop/runtime", to: "runtime", filter: ["**/*", "!**/.env*", "!**/*.log"] },
        // electron-builder always excludes a source root's node_modules.
        // Give traced runtime dependencies their own explicit source root.
        { from: ".desktop/runtime/node_modules", to: "runtime/node_modules", filter: ["**/*", "!**/.env*", "!**/*.log"] },
    ],
    asar: true,
    // Backend dependencies are supplied by the verified standalone trace.
    // The shell has no production node_modules to collect or rebuild.
    beforeBuild: async () => false,
    electronFuses: { runAsNode: false, enableCookieEncryption: true, enableNodeOptionsEnvironmentVariable: false, enableNodeCliInspectArguments: false, enableEmbeddedAsarIntegrityValidation: true, onlyLoadAppFromAsar: true, grantFileProtocolExtraPrivileges: false },
    mac: { category: "public.app-category.developer-tools", target: ["zip"], identity: "-", icon: require("node:path").resolve(__dirname, "../public/icons/icon-512.png") },
    win: { target: ["nsis"] },
    linux: { target: ["AppImage"], category: "Development" },
    publish: null,
};
