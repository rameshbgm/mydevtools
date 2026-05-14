import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BookmarkMenu {
    id: string;
    name: string;
    toolIds: string[];
}

interface AppState {
    darkMode: boolean;
    sidebarCollapsed: boolean;
    recentTools: string[];
    isNavigating: boolean;
    navTargetId: string | null;
    bookmarks: BookmarkMenu[];
    toggleDarkMode: () => void;
    toggleSidebar: () => void;
    addRecentTool: (id: string) => void;
    clearRecentTools: () => void;
    setNavigating: (value: boolean, targetId?: string | null) => void;
    addBookmarkMenu: (name: string, id: string) => void;
    removeBookmarkMenu: (id: string) => void;
    renameBookmarkMenu: (id: string, name: string) => void;
    addToolToBookmark: (menuId: string, toolId: string) => void;
    removeToolFromBookmark: (menuId: string, toolId: string) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            darkMode: true,
            sidebarCollapsed: false,
            recentTools: [],
            isNavigating: false,
            navTargetId: null,
            bookmarks: [],
            toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
            toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
            addRecentTool: (id: string) =>
                set((s) => ({
                    recentTools: [id, ...s.recentTools.filter((t) => t !== id)].slice(0, 10),
                })),
            clearRecentTools: () => set(() => ({ recentTools: [] as string[] })),
            setNavigating: (value: boolean, targetId: string | null = null) =>
                set(() => ({ isNavigating: value, navTargetId: value ? targetId : null })),
            addBookmarkMenu: (name, id) =>
                set((s) =>
                    s.bookmarks.length >= 3
                        ? s
                        : { bookmarks: [...s.bookmarks, { id, name, toolIds: [] }] }
                ),
            removeBookmarkMenu: (id) =>
                set((s) => ({ bookmarks: s.bookmarks.filter((m) => m.id !== id) })),
            renameBookmarkMenu: (id, name) =>
                set((s) => ({
                    bookmarks: s.bookmarks.map((m) => (m.id === id ? { ...m, name } : m)),
                })),
            addToolToBookmark: (menuId, toolId) =>
                set((s) => ({
                    bookmarks: s.bookmarks.map((m) =>
                        m.id === menuId && m.toolIds.length < 10 && !m.toolIds.includes(toolId)
                            ? { ...m, toolIds: [...m.toolIds, toolId] }
                            : m
                    ),
                })),
            removeToolFromBookmark: (menuId, toolId) =>
                set((s) => ({
                    bookmarks: s.bookmarks.map((m) =>
                        m.id === menuId
                            ? { ...m, toolIds: m.toolIds.filter((t) => t !== toolId) }
                            : m
                    ),
                })),
        }),
        {
            name: "devtools-hub-storage",
            partialize: (state) => ({
                darkMode: state.darkMode,
                sidebarCollapsed: state.sidebarCollapsed,
                recentTools: state.recentTools,
                bookmarks: state.bookmarks,
            }),
        }
    )
);
