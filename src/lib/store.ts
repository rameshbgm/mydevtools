import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
    darkMode: boolean;
    sidebarCollapsed: boolean;
    recentTools: string[];
    isNavigating: boolean;
    navTargetId: string | null;
    toggleDarkMode: () => void;
    toggleSidebar: () => void;
    addRecentTool: (id: string) => void;
    clearRecentTools: () => void;
    setNavigating: (value: boolean, targetId?: string | null) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            darkMode: true,
            sidebarCollapsed: false,
            recentTools: [],
            isNavigating: false,
            navTargetId: null,
            toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
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
                sidebarCollapsed: state.sidebarCollapsed,
                recentTools: state.recentTools,
            }),
        }
    )
);
