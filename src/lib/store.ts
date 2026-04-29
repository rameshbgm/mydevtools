import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
    darkMode: boolean;
    sidebarCollapsed: boolean;
    recentTools: string[];
    toggleDarkMode: () => void;
    toggleSidebar: () => void;
    addRecentTool: (id: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            darkMode: true,
            sidebarCollapsed: false,
            recentTools: [],
            toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
            toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
            addRecentTool: (id: string) =>
                set((s) => ({
                    recentTools: [id, ...s.recentTools.filter((t) => t !== id)].slice(0, 10),
                })),
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
