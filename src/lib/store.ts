import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeVersion = "press" | "terminal" | "brutal" | "glass";

export const THEME_VERSIONS: { id: ThemeVersion; label: string; tag: string }[] = [
    { id: "press",    label: "Press",    tag: "Editorial" },
    { id: "terminal", label: "Terminal", tag: "IDE / Hacker" },
    { id: "brutal",   label: "Brutal",   tag: "Neo-brutalism" },
    { id: "glass",    label: "Glass",    tag: "Soft minimal" },
];

interface AppState {
    darkMode: boolean;
    version: ThemeVersion;
    sidebarCollapsed: boolean;
    recentTools: string[];
    isNavigating: boolean;
    navTargetId: string | null;
    toggleDarkMode: () => void;
    setVersion: (v: ThemeVersion) => void;
    toggleSidebar: () => void;
    addRecentTool: (id: string) => void;
    clearRecentTools: () => void;
    setNavigating: (value: boolean, targetId?: string | null) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            darkMode: false,
            version: "press",
            sidebarCollapsed: false,
            recentTools: [],
            isNavigating: false,
            navTargetId: null,
            toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
            setVersion: (v: ThemeVersion) => set(() => ({ version: v })),
            toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
            addRecentTool: (id: string) =>
                set((s) => ({
                    recentTools: [id, ...s.recentTools.filter((t) => t !== id)].slice(0, 10),
                })),
            clearRecentTools: () => set(() => ({ recentTools: [] as string[] })),
            setNavigating: (value: boolean, targetId: string | null = null) =>
                set(() => ({ isNavigating: value, navTargetId: value ? targetId : null })),
        }),
        {
            name: "devtools-hub-storage",
            partialize: (state) => ({
                darkMode: state.darkMode,
                version: state.version,
                sidebarCollapsed: state.sidebarCollapsed,
                recentTools: state.recentTools,
            }),
        }
    )
);
