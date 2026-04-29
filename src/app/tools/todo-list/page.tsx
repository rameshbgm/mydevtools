"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
    Table,
    Button,
    Input,
    Select,
    DatePicker,
    Tag,
    Space,
    Card,
    Modal,
    Form,
    Progress,
    Statistic,
    Row,
    Col,
    Checkbox,
    Tooltip,
    Dropdown,
    Badge,
    App,
    Popconfirm,
    Typography,
    Spin,
    Alert,
    Drawer,
    Divider,
    Empty,
    ColorPicker,
    InputNumber,
    Segmented,
    FloatButton,
    Result,
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    CheckSquareOutlined,
    ExportOutlined,
    SearchOutlined,
    ClearOutlined,
    DownloadOutlined,
    UploadOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    FlagOutlined,
    CalendarOutlined,
    InboxOutlined,
    SettingOutlined,
    FolderOutlined,
    ReloadOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ToolPageLayout from "@/components/ToolPageLayout";
import {
    checkIndexedDBSupport,
    getAllTodos,
    getAllCategories,
    addTodo,
    updateTodo,
    softDeleteTodo,
    restoreTodo,
    hardDeleteTodo,
    archiveTodo,
    unarchiveTodo,
    bulkUpdateTodos,
    emptyTrash,
    addCategory,
    updateCategory,
    deleteCategory,
    initializeDefaultCategories,
    getSettings,
    updateSettings,
    exportAllData,
    importData,
    validateImportData,
    getTodoStats,
    createEmptyTodo,
    generateId,
    PRIORITY_CONFIG,
    STATUS_CONFIG,
    type TodoItem,
    type Category,
    type TodoSettings,
    type Priority,
    type Status,
    type ExportData,
    type TodoStats,
    type Subtask,
} from "@/lib/todo-db";

dayjs.extend(relativeTime);

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

// ─── Emoji Picker Data ───────────────────────────────────────────────

const EMOJI_CATEGORIES = {
    "Objects": ["📁", "📂", "📋", "📌", "📍", "📎", "🔗", "📝", "✏️", "📖", "📚", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📰", "🗞️", "🔖", "🏷️", "💼", "📦", "📬", "📭", "📮", "📯", "🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "🔨", "⛏️", "🔧", "🔩", "⚙️", "🛠️", "💡", "🔦", "🏮", "📱", "💻", "🖥️", "🖨️", "⌨️", "🖱️", "💽", "💾", "💿", "📀"],
    "People & Activities": ["👤", "👥", "👨‍💻", "👩‍💻", "👨‍🔬", "👩‍🔬", "👨‍💼", "👩‍💼", "👨‍🏫", "👩‍🏫", "🧑‍🎓", "💪", "🏃", "🚶", "🧘", "🏋️", "⛹️", "🚴", "🏊", "🎯", "🎲", "🎮", "🎧", "🎬", "🎨", "🎭", "🎪", "🎤", "🎸", "🎹", "🥁", "🎺", "🎻"],
    "Nature & Weather": ["🌱", "🌿", "🍀", "🌸", "🌺", "🌻", "🌼", "🌷", "🌹", "🥀", "🌲", "🌳", "🌴", "🌵", "🌾", "🍁", "🍂", "🍃", "☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️", "☃️", "⛄", "🌪️", "🌫️", "🌈", "🔥", "💧", "🌊"],
    "Food & Drink": ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "☕", "🫖", "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🍾", "🧊"],
    "Travel & Places": ["✈️", "🚀", "🛸", "🚁", "🛩️", "🪂", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚢", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔", "🚕", "🚖", "🚗", "🚘", "🚙", "🛻", "🚚", "🚛", "🚜", "🏎️", "🏍️", "🛵", "🦽", "🦼", "🛺", "🚲", "🛴", "🛹", "🛼", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "🕌", "🛕", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁", "🌃", "🏙️", "🌄", "🌅", "🌆", "🌇", "🌉", "🎠", "🎡", "🎢", "💈", "🎪"],
    "Symbols": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "⭐", "🌟", "✨", "⚡", "💥", "🔥", "🌈", "☀️", "🌙", "⚠️", "📛", "🚫", "❌", "⭕", "✅", "☑️", "✔️", "❎", "➕", "➖", "➗", "✖️", "♾️", "💲", "💱", "💰", "💎", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪", "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛", "⬜", "◼️", "◻️", "◾", "◽", "▪️", "▫️", "🔶", "🔷", "🔸", "🔹", "🔺", "🔻", "💠", "🔘", "🔳", "🔲"],
    "Celebration": ["🎉", "🎊", "🎈", "🎁", "🎀", "🎄", "🎃", "🎗️", "🏆", "🏅", "🥇", "🥈", "🥉", "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛷", "🛼", "🎿", "⛷️", "🏂"],
    "Hands & Gestures": ["👍", "👎", "👊", "✊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "☝️", "👆", "👇", "👈", "👉", "✌️", "🤞", "🤟", "🤘", "🤙", "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✊", "👊"],
};

const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flat();

// ─── View Types ──────────────────────────────────────────────────────

type ViewType = "active" | "archived" | "deleted";

// ─── Helper Functions ────────────────────────────────────────────────

function isOverdue(item: TodoItem): boolean {
    if (!item.dueDate || item.status === "done" || item.status === "cancelled") return false;
    return dayjs(item.dueDate).isBefore(dayjs(), "day");
}

function isDueToday(item: TodoItem): boolean {
    if (!item.dueDate || item.status === "done" || item.status === "cancelled") return false;
    return dayjs(item.dueDate).isSame(dayjs(), "day");
}

function isDueTomorrow(item: TodoItem): boolean {
    if (!item.dueDate || item.status === "done" || item.status === "cancelled") return false;
    return dayjs(item.dueDate).isSame(dayjs().add(1, "day"), "day");
}

// ─── Component ───────────────────────────────────────────────────────

export default function TodoListPage() {
    const { message, modal } = App.useApp();

    // Browser compatibility
    const [isSupported, setIsSupported] = useState(true);
    const [compatError, setCompatError] = useState<string | null>(null);

    // Data state
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [settings, setSettings] = useState<TodoSettings | null>(null);
    const [stats, setStats] = useState<TodoStats | null>(null);

    // UI state
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
    const [form] = Form.useForm();
    const [categoryForm] = Form.useForm();

    // View & filters
    const [currentView, setCurrentView] = useState<ViewType>("active");
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
    const [filterCategory, setFilterCategory] = useState<string | "all">("all");
    const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // Drawers
    const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
    const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);

    // File input ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Emoji picker state
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState("📁");
    const [emojiSearchText, setEmojiSearchText] = useState("");
    const [selectedEmojiCategory, setSelectedEmojiCategory] = useState<string>("Objects");

    // ─── Check Browser Compatibility ─────────────────────────────────
    useEffect(() => {
        const check = checkIndexedDBSupport();
        setIsSupported(check.supported);
        setCompatError(check.error || null);
    }, []);

    // ─── Load Data ───────────────────────────────────────────────────
    const loadData = useCallback(async () => {
        if (!isSupported) return;

        setLoading(true);
        try {
            await initializeDefaultCategories();
            const [todosData, categoriesData, settingsData, statsData] = await Promise.all([
                getAllTodos(true),
                getAllCategories(),
                getSettings(),
                getTodoStats(),
            ]);
            setTodos(todosData);
            setCategories(categoriesData);
            setSettings(settingsData);
            setStats(statsData);
        } catch (err) {
            console.error("Failed to load data:", err);
            message.error("Failed to load data from IndexedDB");
        } finally {
            setLoading(false);
        }
    }, [isSupported, message]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ─── Refresh Stats ───────────────────────────────────────────────
    const refreshStats = useCallback(async () => {
        try {
            const statsData = await getTodoStats();
            setStats(statsData);
        } catch (err) {
            console.error("Failed to refresh stats:", err);
        }
    }, []);

    // ─── Get All Tags ────────────────────────────────────────────────
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        todos.forEach(t => t.tags.forEach(tag => tagSet.add(tag)));
        return Array.from(tagSet).sort();
    }, [todos]);

    // ─── Category Map ────────────────────────────────────────────────
    const categoryMap = useMemo(() => {
        const map = new Map<string, Category>();
        categories.forEach(c => map.set(c.id, c));
        return map;
    }, [categories]);

    // ─── Filtered Todos ──────────────────────────────────────────────
    const filteredTodos = useMemo(() => {
        return todos.filter((t) => {
            // View filter
            if (currentView === "active" && (t.isArchived || t.isDeleted)) return false;
            if (currentView === "archived" && (!t.isArchived || t.isDeleted)) return false;
            if (currentView === "deleted" && !t.isDeleted) return false;

            // Search
            if (searchText) {
                const search = searchText.toLowerCase();
                const matchesTitle = t.title.toLowerCase().includes(search);
                const matchesDesc = t.description.toLowerCase().includes(search);
                const matchesTags = t.tags.some(tag => tag.toLowerCase().includes(search));
                const matchesNotes = t.notes.toLowerCase().includes(search);
                if (!matchesTitle && !matchesDesc && !matchesTags && !matchesNotes) return false;
            }

            // Filters
            if (filterStatus !== "all" && t.status !== filterStatus) return false;
            if (filterCategory !== "all" && t.categoryId !== filterCategory) return false;
            if (filterPriority !== "all" && t.priority !== filterPriority) return false;
            if (filterTags.length > 0 && !filterTags.some(ft => t.tags.includes(ft))) return false;

            return true;
        });
    }, [todos, currentView, searchText, filterStatus, filterCategory, filterPriority, filterTags]);

    // ─── Handlers: Todo CRUD ─────────────────────────────────────────

    const handleAdd = useCallback(() => {
        setEditingTodo(null);
        form.resetFields();
        form.setFieldsValue({
            ...createEmptyTodo(settings?.defaultCategory || "work"),
            priority: settings?.defaultPriority || "medium",
        });
        setIsModalOpen(true);
    }, [form, settings]);

    const handleEdit = useCallback((todo: TodoItem) => {
        setEditingTodo(todo);
        form.setFieldsValue({
            ...todo,
            dueDate: todo.dueDate ? dayjs(todo.dueDate) : null,
            reminderDate: todo.reminderDate ? dayjs(todo.reminderDate) : null,
        });
        setIsModalOpen(true);
    }, [form]);

    const handleSave = useCallback(async () => {
        try {
            const values = await form.validateFields();
            const now = new Date().toISOString();

            if (editingTodo) {
                const updated = await updateTodo(editingTodo.id, {
                    ...values,
                    dueDate: values.dueDate ? values.dueDate.toISOString() : null,
                    reminderDate: values.reminderDate ? values.reminderDate.toISOString() : null,
                    completedAt: values.status === "done" && editingTodo.status !== "done" ? now : editingTodo.completedAt,
                });
                setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
                message.success("Task updated");
            } else {
                const newTodo = await addTodo({
                    ...values,
                    dueDate: values.dueDate ? values.dueDate.toISOString() : null,
                    reminderDate: values.reminderDate ? values.reminderDate.toISOString() : null,
                    subtasks: [],
                    notes: values.notes || "",
                    isArchived: false,
                    archivedAt: null,
                    isDeleted: false,
                    deletedAt: null,
                    isRecurring: false,
                    recurrencePattern: null,
                    parentId: null,
                    projectId: null,
                });
                setTodos(prev => [newTodo, ...prev]);
                message.success("Task added");
            }

            setIsModalOpen(false);
            form.resetFields();
            refreshStats();
        } catch (err) {
            console.error("Save failed:", err);
        }
    }, [editingTodo, form, message, refreshStats]);

    const handleToggleStatus = useCallback(async (todo: TodoItem) => {
        const newStatus: Status = todo.status === "done" ? "todo" : "done";
        const now = new Date().toISOString();

        try {
            const updated = await updateTodo(todo.id, {
                status: newStatus,
                completedAt: newStatus === "done" ? now : null,
            });
            setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
            refreshStats();
        } catch (err) {
            message.error("Failed to update status");
        }
    }, [message, refreshStats]);

    const handleSoftDelete = useCallback(async (id: string) => {
        try {
            const updated = await softDeleteTodo(id);
            setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
            message.success("Task moved to trash");
            refreshStats();
        } catch (err) {
            message.error("Failed to delete task");
        }
    }, [message, refreshStats]);

    const handleRestore = useCallback(async (id: string) => {
        try {
            const updated = await restoreTodo(id);
            setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
            message.success("Task restored");
            refreshStats();
        } catch (err) {
            message.error("Failed to restore task");
        }
    }, [message, refreshStats]);

    const handleHardDelete = useCallback(async (id: string) => {
        try {
            await hardDeleteTodo(id);
            setTodos(prev => prev.filter(t => t.id !== id));
            message.success("Task permanently deleted");
            refreshStats();
        } catch (err) {
            message.error("Failed to delete task");
        }
    }, [message, refreshStats]);

    const handleArchive = useCallback(async (id: string) => {
        try {
            const updated = await archiveTodo(id);
            setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
            message.success("Task archived");
            refreshStats();
        } catch (err) {
            message.error("Failed to archive task");
        }
    }, [message, refreshStats]);

    const handleUnarchive = useCallback(async (id: string) => {
        try {
            const updated = await unarchiveTodo(id);
            setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
            message.success("Task unarchived");
            refreshStats();
        } catch (err) {
            message.error("Failed to unarchive task");
        }
    }, [message, refreshStats]);

    const handleEmptyTrash = useCallback(async () => {
        modal.confirm({
            title: "Empty Trash?",
            content: "This will permanently delete all items in trash. This action cannot be undone.",
            okText: "Empty Trash",
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    const count = await emptyTrash();
                    setTodos(prev => prev.filter(t => !t.isDeleted));
                    message.success(`${count} items permanently deleted`);
                    refreshStats();
                } catch (err) {
                    message.error("Failed to empty trash");
                }
            },
        });
    }, [modal, message, refreshStats]);

    // ─── Bulk Actions ────────────────────────────────────────────────

    const handleBulkStatusChange = useCallback(async (status: Status) => {
        try {
            const now = new Date().toISOString();
            await bulkUpdateTodos(selectedRowKeys as string[], {
                status,
                completedAt: status === "done" ? now : null,
            });
            setTodos(prev => prev.map(t =>
                selectedRowKeys.includes(t.id)
                    ? { ...t, status, completedAt: status === "done" ? now : t.completedAt }
                    : t
            ));
            setSelectedRowKeys([]);
            message.success(`${selectedRowKeys.length} tasks updated`);
            refreshStats();
        } catch (err) {
            message.error("Failed to update tasks");
        }
    }, [selectedRowKeys, message, refreshStats]);

    const handleBulkDelete = useCallback(async () => {
        try {
            await bulkUpdateTodos(selectedRowKeys as string[], {
                isDeleted: true,
                deletedAt: new Date().toISOString(),
            });
            setTodos(prev => prev.map(t =>
                selectedRowKeys.includes(t.id)
                    ? { ...t, isDeleted: true, deletedAt: new Date().toISOString() }
                    : t
            ));
            setSelectedRowKeys([]);
            message.success(`${selectedRowKeys.length} tasks moved to trash`);
            refreshStats();
        } catch (err) {
            message.error("Failed to delete tasks");
        }
    }, [selectedRowKeys, message, refreshStats]);

    const handleBulkArchive = useCallback(async () => {
        try {
            await bulkUpdateTodos(selectedRowKeys as string[], {
                isArchived: true,
                archivedAt: new Date().toISOString(),
            });
            setTodos(prev => prev.map(t =>
                selectedRowKeys.includes(t.id)
                    ? { ...t, isArchived: true, archivedAt: new Date().toISOString() }
                    : t
            ));
            setSelectedRowKeys([]);
            message.success(`${selectedRowKeys.length} tasks archived`);
            refreshStats();
        } catch (err) {
            message.error("Failed to archive tasks");
        }
    }, [selectedRowKeys, message, refreshStats]);

    // ─── Export / Import ─────────────────────────────────────────────

    const handleExportJSON = useCallback(async () => {
        try {
            const data = await exportAllData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `todo-backup-${dayjs().format("YYYY-MM-DD-HHmmss")}.json`;
            a.click();
            URL.revokeObjectURL(url);
            message.success("Data exported successfully");
        } catch (err) {
            message.error("Failed to export data");
        }
    }, [message]);

    const handleExportCSV = useCallback(() => {
        const activeTodos = todos.filter(t => !t.isDeleted);
        const csv = [
            ["Title", "Description", "Priority", "Status", "Category", "Due Date", "Created", "Tags", "Est Hours", "Actual Hours", "Archived", "Notes"].join(","),
            ...activeTodos.map((t) => [
                `"${t.title.replace(/"/g, '""')}"`,
                `"${t.description.replace(/"/g, '""')}"`,
                t.priority,
                t.status,
                categoryMap.get(t.categoryId)?.name || t.categoryId,
                t.dueDate || "",
                t.createdAt,
                `"${t.tags.join(", ")}"`,
                t.estimatedHours,
                t.actualHours,
                t.isArchived ? "Yes" : "No",
                `"${t.notes.replace(/"/g, '""')}"`,
            ].join(","))
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `todos-${dayjs().format("YYYY-MM-DD")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        message.success("Exported to CSV");
    }, [todos, categoryMap, message]);

    const handleImportClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const validation = validateImportData(data);
            if (!validation.valid) {
                message.error(validation.error || "Invalid file format");
                return;
            }

            modal.confirm({
                title: "Import Data",
                content: (
                    <div>
                        <p>Found {data.todos?.length || 0} todos and {data.categories?.length || 0} categories.</p>
                        <p>How would you like to import?</p>
                    </div>
                ),
                okText: "Merge with existing",
                cancelText: "Replace all",
                onOk: async () => {
                    const result = await importData(data as ExportData, "merge");
                    message.success(`Imported ${result.todosImported} todos, ${result.categoriesImported} categories`);
                    loadData();
                },
                onCancel: async () => {
                    modal.confirm({
                        title: "Are you sure?",
                        content: "This will replace ALL existing data. This cannot be undone.",
                        okText: "Yes, replace everything",
                        okButtonProps: { danger: true },
                        onOk: async () => {
                            const result = await importData(data as ExportData, "replace");
                            message.success(`Imported ${result.todosImported} todos, ${result.categoriesImported} categories`);
                            loadData();
                        },
                    });
                },
            });
        } catch (err) {
            message.error("Failed to read file. Make sure it's a valid JSON backup file.");
        }

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [message, modal, loadData]);

    // ─── Category Management ─────────────────────────────────────────

    const handleAddCategory = useCallback(() => {
        setEditingCategory(null);
        categoryForm.resetFields();
        categoryForm.setFieldsValue({ name: "", color: "#1677ff", icon: "📁", isDefault: false });
        setCategoryDrawerOpen(true);
    }, [categoryForm]);

    const handleEditCategory = useCallback((cat: Category) => {
        setEditingCategory(cat);
        categoryForm.setFieldsValue(cat);
        setCategoryDrawerOpen(true);
    }, [categoryForm]);

    const handleSaveCategory = useCallback(async () => {
        try {
            const values = await categoryForm.validateFields();
            const colorValue = typeof values.color === "string" ? values.color : values.color?.toHexString?.() || "#1677ff";

            if (editingCategory) {
                const updated = await updateCategory(editingCategory.id, { ...values, color: colorValue });
                setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
                message.success("Category updated");
            } else {
                const newCat = await addCategory({ ...values, color: colorValue, isDefault: false });
                setCategories(prev => [...prev, newCat]);
                message.success("Category added");
            }
            setCategoryDrawerOpen(false);
        } catch (err) {
            console.error("Save category failed:", err);
        }
    }, [editingCategory, categoryForm, message]);

    const handleDeleteCategory = useCallback(async (id: string) => {
        // Check if any todos use this category
        const count = todos.filter(t => t.categoryId === id).length;
        if (count > 0) {
            message.warning(`Cannot delete category with ${count} tasks. Move or delete tasks first.`);
            return;
        }
        try {
            await deleteCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
            message.success("Category deleted");
        } catch (err) {
            message.error("Failed to delete category");
        }
    }, [todos, message]);

    // ─── Subtasks ────────────────────────────────────────────────────

    const handleToggleSubtask = useCallback(async (todoId: string, subtaskId: string) => {
        const todo = todos.find(t => t.id === todoId);
        if (!todo) return;

        const updatedSubtasks = todo.subtasks.map(st =>
            st.id === subtaskId
                ? { ...st, done: !st.done, completedAt: !st.done ? new Date().toISOString() : null }
                : st
        );

        try {
            const updated = await updateTodo(todoId, { subtasks: updatedSubtasks });
            setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
            if (selectedTodo?.id === todoId) {
                setSelectedTodo(updated);
            }
        } catch (err) {
            message.error("Failed to update subtask");
        }
    }, [todos, selectedTodo, message]);

    const handleAddSubtask = useCallback(async (todoId: string, title: string) => {
        const todo = todos.find(t => t.id === todoId);
        if (!todo || !title.trim()) return;

        const newSubtask: Subtask = {
            id: generateId(),
            title: title.trim(),
            done: false,
            completedAt: null,
        };

        try {
            const updated = await updateTodo(todoId, { subtasks: [...todo.subtasks, newSubtask] });
            setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
            if (selectedTodo?.id === todoId) {
                setSelectedTodo(updated);
            }
        } catch (err) {
            message.error("Failed to add subtask");
        }
    }, [todos, selectedTodo, message]);

    const handleDeleteSubtask = useCallback(async (todoId: string, subtaskId: string) => {
        const todo = todos.find(t => t.id === todoId);
        if (!todo) return;

        const updatedSubtasks = todo.subtasks.filter(st => st.id !== subtaskId);

        try {
            const updated = await updateTodo(todoId, { subtasks: updatedSubtasks });
            setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
            if (selectedTodo?.id === todoId) {
                setSelectedTodo(updated);
            }
        } catch (err) {
            message.error("Failed to delete subtask");
        }
    }, [todos, selectedTodo, message]);

    // ─── Settings ────────────────────────────────────────────────────

    const handleUpdateSettings = useCallback(async (updates: Partial<TodoSettings>) => {
        try {
            const updated = await updateSettings(updates);
            setSettings(updated);
        } catch (err) {
            message.error("Failed to update settings");
        }
    }, [message]);

    // ─── Clear Filters ───────────────────────────────────────────────

    const clearFilters = useCallback(() => {
        setSearchText("");
        setFilterStatus("all");
        setFilterCategory("all");
        setFilterPriority("all");
        setFilterTags([]);
    }, []);

    const hasActiveFilters = searchText || filterStatus !== "all" || filterCategory !== "all" || filterPriority !== "all" || filterTags.length > 0;

    // ─── Table Columns ───────────────────────────────────────────────

    const columns: ColumnsType<TodoItem> = useMemo(() => [
        {
            title: "",
            key: "check",
            width: 40,
            render: (_, record) => (
                <Checkbox
                    checked={record.status === "done"}
                    onChange={() => handleToggleStatus(record)}
                    disabled={record.isDeleted}
                />
            ),
        },
        {
            title: "Task",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => (
                <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        setSelectedTodo(record);
                        setDetailDrawerOpen(true);
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <Text
                            style={{
                                textDecoration: record.status === "done" ? "line-through" : "none",
                                opacity: record.status === "done" || record.isDeleted ? 0.5 : 1,
                                fontWeight: 500,
                            }}
                        >
                            {text}
                        </Text>
                        {isOverdue(record) && <Tag color="error" style={{ fontSize: 10 }}>OVERDUE</Tag>}
                        {isDueToday(record) && <Tag color="warning" style={{ fontSize: 10 }}>TODAY</Tag>}
                        {isDueTomorrow(record) && <Tag color="blue" style={{ fontSize: 10 }}>TOMORROW</Tag>}
                        {record.subtasks.length > 0 && (
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                ({record.subtasks.filter(s => s.done).length}/{record.subtasks.length})
                            </Text>
                        )}
                    </div>
                    {record.description && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.description.slice(0, 80)}{record.description.length > 80 ? "..." : ""}
                        </Text>
                    )}
                    {record.tags.length > 0 && (
                        <div style={{ marginTop: 4 }}>
                            {record.tags.slice(0, 3).map(tag => (
                                <Tag key={tag} style={{ fontSize: 10, padding: "0 4px" }}>{tag}</Tag>
                            ))}
                            {record.tags.length > 3 && <Text type="secondary" style={{ fontSize: 10 }}>+{record.tags.length - 3}</Text>}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            width: 100,
            sorter: (a, b) => PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order,
            render: (priority: Priority) => (
                <Tag color={PRIORITY_CONFIG[priority].color}>
                    {PRIORITY_CONFIG[priority].label}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            sorter: (a, b) => STATUS_CONFIG[a.status].order - STATUS_CONFIG[b.status].order,
            render: (status: Status) => (
                <Tag color={STATUS_CONFIG[status].color}>
                    {STATUS_CONFIG[status].icon} {STATUS_CONFIG[status].label}
                </Tag>
            ),
        },
        {
            title: "Category",
            dataIndex: "categoryId",
            key: "category",
            width: 120,
            sorter: (a, b) => (categoryMap.get(a.categoryId)?.name || "").localeCompare(categoryMap.get(b.categoryId)?.name || ""),
            render: (categoryId: string) => {
                const cat = categoryMap.get(categoryId);
                if (!cat) return <Text type="secondary">—</Text>;
                return (
                    <Tag style={{ borderColor: cat.color, color: cat.color }}>
                        {cat.icon} {cat.name}
                    </Tag>
                );
            },
        },
        {
            title: "Due",
            dataIndex: "dueDate",
            key: "dueDate",
            width: 100,
            sorter: (a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix();
            },
            render: (date: string | null, record) => {
                if (!date) return <Text type="secondary">—</Text>;
                const d = dayjs(date);
                const overdue = isOverdue(record);
                return (
                    <Tooltip title={d.format("YYYY-MM-DD HH:mm")}>
                        <Text type={overdue ? "danger" : undefined}>
                            <CalendarOutlined style={{ marginRight: 4 }} />
                            {d.fromNow()}
                        </Text>
                    </Tooltip>
                );
            },
        },
        {
            title: "",
            key: "actions",
            width: currentView === "deleted" ? 120 : 100,
            render: (_, record) => (
                <Space size="small">
                    {currentView === "deleted" ? (
                        <>
                            <Tooltip title="Restore">
                                <Button size="small" type="text" icon={<ReloadOutlined />} onClick={() => handleRestore(record.id)} />
                            </Tooltip>
                            <Popconfirm title="Permanently delete?" onConfirm={() => handleHardDelete(record.id)}>
                                <Tooltip title="Delete Forever">
                                    <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                                </Tooltip>
                            </Popconfirm>
                        </>
                    ) : currentView === "archived" ? (
                        <>
                            <Tooltip title="Unarchive">
                                <Button size="small" type="text" icon={<InboxOutlined />} onClick={() => handleUnarchive(record.id)} />
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip title="Edit">
                                <Button size="small" type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                            </Tooltip>
                            <Tooltip title="Archive">
                                <Button size="small" type="text" icon={<InboxOutlined />} onClick={() => handleArchive(record.id)} />
                            </Tooltip>
                            <Popconfirm title="Move to trash?" onConfirm={() => handleSoftDelete(record.id)}>
                                <Tooltip title="Delete">
                                    <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                                </Tooltip>
                            </Popconfirm>
                        </>
                    )}
                </Space>
            ),
        },
    ], [currentView, categoryMap, handleToggleStatus, handleEdit, handleSoftDelete, handleRestore, handleHardDelete, handleArchive, handleUnarchive]);

    // ─── Bulk Actions Menu ───────────────────────────────────────────

    const bulkActionsMenu: MenuProps = useMemo(() => ({
        items: [
            { key: "done", label: "Mark as Done", icon: <CheckOutlined /> },
            { key: "in-progress", label: "Mark In Progress", icon: <ClockCircleOutlined /> },
            { key: "todo", label: "Mark as To Do" },
            { key: "blocked", label: "Mark as Blocked", icon: <ExclamationCircleOutlined /> },
            { type: "divider" },
            { key: "archive", label: "Archive Selected", icon: <InboxOutlined /> },
            { key: "delete", label: "Delete Selected", icon: <DeleteOutlined />, danger: true },
        ],
        onClick: ({ key }) => {
            if (key === "delete") handleBulkDelete();
            else if (key === "archive") handleBulkArchive();
            else handleBulkStatusChange(key as Status);
        },
    }), [handleBulkDelete, handleBulkArchive, handleBulkStatusChange]);

    // ─── Render: Browser Not Supported ───────────────────────────────

    if (!isSupported) {
        return (
            <ToolPageLayout
                title="Personal Todo List"
                description="Production-grade task manager with IndexedDB storage"
                icon={<CheckSquareOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
                color="#52c41a"
            >
                <Result
                    status="error"
                    title="Browser Not Supported"
                    subTitle={compatError || "Your browser does not support IndexedDB."}
                    extra={
                        <Space orientation="vertical">
                            <Text>Please use a modern browser like:</Text>
                            <Text strong>Chrome, Firefox, Safari, or Edge</Text>
                            <Text type="secondary">If you are in private/incognito mode, try using a regular window.</Text>
                        </Space>
                    }
                />
            </ToolPageLayout>
        );
    }

    // ─── Render ──────────────────────────────────────────────────────

    return (
        <ToolPageLayout
            title="Personal Todo List"
            description="Production-grade task manager with IndexedDB storage"
            icon={<CheckSquareOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
            color="#52c41a"
            learnMore={{
                whatIs: "A fully-featured personal task manager that stores data locally in IndexedDB. It supports categories with custom emojis, priorities, due dates, drag-and-drop reordering, and data export/import.",
                whyUse: "Unlike cloud-based todo apps, this tool keeps all data in your browser. It's private, works offline, and doesn't require an account. Perfect for developers who value privacy and local-first apps.",
                howToUse: [
                    "Create categories with custom emojis",
                    "Add tasks with title, description, priority, and due date",
                    "Drag and drop to reorder tasks",
                    "Export data as JSON for backup"
                ],
                tips: [
                    "Data persists in IndexedDB (browser storage)",
                    "Use categories to organize different projects",
                    "Keyboard shortcuts available for power users",
                    "Export regularly for backup"
                ],
                useCases: [
                    "Personal task management without cloud sync",
                    "Privacy-focused note taking",
                    "Project planning and tracking",
                    "Developer workflow management"
                ]
            }}
        >
            <Spin spinning={loading}>
                {/* Hidden file input for import */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".json"
                    onChange={handleFileImport}
                />

                {/* Statistics */}
                {stats && (
                    <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                        <Col xs={12} sm={8} md={4} lg={3}>
                            <Card size="small" style={{ textAlign: "center" }}>
                                <Statistic title="Active" value={stats.active} styles={{ content: { color: "#1677ff" } }} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={4} lg={3}>
                            <Card size="small" style={{ textAlign: "center" }}>
                                <Statistic title="Done" value={stats.done} styles={{ content: { color: "#52c41a" } }} suffix={<CheckOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={4} lg={3}>
                            <Card size="small" style={{ textAlign: "center" }}>
                                <Statistic title="In Progress" value={stats.inProgress} styles={{ content: { color: "#1677ff" } }} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={4} lg={3}>
                            <Card size="small" style={{ textAlign: "center" }}>
                                <Statistic title="Overdue" value={stats.overdue} styles={{ content: { color: stats.overdue > 0 ? "#f5222d" : undefined } }} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={4} lg={3}>
                            <Card size="small" style={{ textAlign: "center" }}>
                                <Statistic title="Due Today" value={stats.dueToday} styles={{ content: { color: stats.dueToday > 0 ? "#faad14" : undefined } }} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={4} lg={3}>
                            <Card size="small" style={{ textAlign: "center" }}>
                                <div style={{ marginBottom: 4 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Completion</Text>
                                </div>
                                <Progress percent={stats.completionRate} size="small" status={stats.completionRate === 100 ? "success" : "active"} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={4} lg={3}>
                            <Card size="small" style={{ textAlign: "center" }}>
                                <Statistic title="Archived" value={stats.archived} styles={{ content: { color: "#8c8c8c" } }} prefix={<InboxOutlined />} />
                            </Card>
                        </Col>
                        <Col xs={12} sm={8} md={4} lg={3}>
                            <Card size="small" style={{ textAlign: "center" }}>
                                <Statistic title="Trash" value={stats.deleted} styles={{ content: { color: stats.deleted > 0 ? "#f5222d" : "#8c8c8c" } }} prefix={<DeleteOutlined />} />
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* View Tabs */}
                <Card size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={[16, 12]} align="middle">
                        <Col flex="auto">
                            <Space wrap>
                                <Segmented
                                    value={currentView}
                                    onChange={(v) => { setCurrentView(v as ViewType); setSelectedRowKeys([]); }}
                                    options={[
                                        { label: <><UnorderedListOutlined /> Active</>, value: "active" },
                                        { label: <><InboxOutlined /> Archived ({stats?.archived || 0})</>, value: "archived" },
                                        { label: <><DeleteOutlined /> Trash ({stats?.deleted || 0})</>, value: "deleted" },
                                    ]}
                                />
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                <Tooltip title="Manage Categories">
                                    <Button icon={<FolderOutlined />} onClick={handleAddCategory}>Categories</Button>
                                </Tooltip>
                                <Tooltip title="Settings">
                                    <Button icon={<SettingOutlined />} onClick={() => setSettingsDrawerOpen(true)} />
                                </Tooltip>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Toolbar */}
                <Card size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={[12, 12]} align="middle">
                        <Col>
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                                Add Task
                            </Button>
                        </Col>
                        <Col flex="200px">
                            <Input
                                placeholder="Search tasks..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                            />
                        </Col>
                        <Col>
                            <Select
                                value={filterStatus}
                                onChange={setFilterStatus}
                                style={{ width: 140 }}
                                showSearch
                                optionFilterProp="label"
                                options={[
                                    { value: "all", label: "All Status" },
                                    ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({
                                        value: k,
                                        label: `${v.icon} ${v.label}`
                                    })),
                                ]}
                            />
                        </Col>
                        <Col>
                            <Select
                                value={filterCategory}
                                onChange={setFilterCategory}
                                style={{ width: 150 }}
                                showSearch
                                optionFilterProp="label"
                                options={[
                                    { value: "all", label: "All Categories" },
                                    ...categories.map((c) => ({
                                        value: c.id,
                                        label: `${c.icon} ${c.name}`
                                    })),
                                ]}
                            />
                        </Col>
                        <Col>
                            <Select
                                value={filterPriority}
                                onChange={setFilterPriority}
                                style={{ width: 130 }}
                                showSearch
                                optionFilterProp="label"
                                options={[
                                    { value: "all", label: "All Priorities" },
                                    ...Object.entries(PRIORITY_CONFIG).map(([k, v]) => ({
                                        value: k,
                                        label: v.label
                                    })),
                                ]}
                            />
                        </Col>
                        {allTags.length > 0 && (
                            <Col>
                                <Select
                                    mode="multiple"
                                    value={filterTags}
                                    onChange={setFilterTags}
                                    style={{ minWidth: 120 }}
                                    placeholder="Tags"
                                    maxTagCount={1}
                                    options={allTags.map(t => ({ value: t, label: t }))}
                                />
                            </Col>
                        )}
                        {hasActiveFilters && (
                            <Col>
                                <Button icon={<ClearOutlined />} onClick={clearFilters}>Clear</Button>
                            </Col>
                        )}
                        <Col flex="auto" />
                        {selectedRowKeys.length > 0 && (
                            <Col>
                                <Dropdown menu={bulkActionsMenu}>
                                    <Button>
                                        <Badge count={selectedRowKeys.length} size="small" offset={[8, 0]}>
                                            Bulk Actions
                                        </Badge>
                                    </Button>
                                </Dropdown>
                            </Col>
                        )}
                        {currentView === "deleted" && stats && stats.deleted > 0 && (
                            <Col>
                                <Button danger icon={<DeleteOutlined />} onClick={handleEmptyTrash}>
                                    Empty Trash
                                </Button>
                            </Col>
                        )}
                        <Col>
                            <Space.Compact>
                                <Tooltip title="Export JSON (Full Backup)">
                                    <Button icon={<DownloadOutlined />} onClick={handleExportJSON} />
                                </Tooltip>
                                <Tooltip title="Export CSV">
                                    <Button icon={<ExportOutlined />} onClick={handleExportCSV} />
                                </Tooltip>
                                <Tooltip title="Import JSON Backup">
                                    <Button icon={<UploadOutlined />} onClick={handleImportClick} />
                                </Tooltip>
                            </Space.Compact>
                        </Col>
                    </Row>
                </Card>

                {/* Table */}
                <Card size="small" styles={{ body: { padding: 0 } }}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={filteredTodos}
                        pagination={{
                            pageSize: 20,
                            showSizeChanger: true,
                            showTotal: (t) => `${t} tasks`,
                            pageSizeOptions: ["10", "20", "50", "100"],
                        }}
                        rowSelection={currentView !== "deleted" ? {
                            selectedRowKeys,
                            onChange: setSelectedRowKeys,
                        } : undefined}
                        size="middle"
                        scroll={{ x: 1000 }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        currentView === "deleted"
                                            ? "Trash is empty"
                                            : currentView === "archived"
                                                ? "No archived tasks"
                                                : hasActiveFilters
                                                    ? "No tasks match your filters"
                                                    : "No tasks yet. Click 'Add Task' to create one!"
                                    }
                                />
                            ),
                        }}
                    />
                </Card>

                {/* Add/Edit Modal */}
                <Modal
                    title={editingTodo ? "Edit Task" : "Add New Task"}
                    open={isModalOpen}
                    onOk={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                    okText={editingTodo ? "Update" : "Add"}
                    width={700}
                    destroyOnHidden
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="title" label="Task Title" rules={[{ required: true, message: "Please enter a title" }]}>
                            <Input placeholder="What needs to be done?" size="large" />
                        </Form.Item>

                        <Form.Item name="description" label="Description">
                            <TextArea rows={3} placeholder="Add more details..." />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="priority" label="Priority" initialValue="medium">
                                    <Select
                                        options={Object.entries(PRIORITY_CONFIG).map(([k, v]) => ({
                                            value: k,
                                            label: <><FlagOutlined style={{ color: v.color, marginRight: 8 }} />{v.label}</>,
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="status" label="Status" initialValue="todo">
                                    <Select
                                        options={Object.entries(STATUS_CONFIG).map(([k, v]) => ({
                                            value: k,
                                            label: `${v.icon} ${v.label}`
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="categoryId" label="Category" initialValue="work">
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        options={categories.map((c) => ({
                                            value: c.id,
                                            label: `${c.icon} ${c.name}`,
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="dueDate" label="Due Date">
                                    <DatePicker style={{ width: "100%" }} showTime format="YYYY-MM-DD HH:mm" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="estimatedHours" label="Estimated Hours" initialValue={0}>
                                    <InputNumber min={0} step={0.5} style={{ width: "100%" }} suffix="hrs" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="actualHours" label="Actual Hours" initialValue={0}>
                                    <InputNumber min={0} step={0.5} style={{ width: "100%" }} suffix="hrs" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="tags" label="Tags">
                            <Select mode="tags" placeholder="Add tags (press Enter)" tokenSeparators={[","]} />
                        </Form.Item>

                        <Form.Item name="notes" label="Notes">
                            <TextArea rows={2} placeholder="Additional notes..." />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Task Detail Drawer */}
                <Drawer
                    title={selectedTodo?.title || "Task Details"}
                    open={detailDrawerOpen}
                    onClose={() => { setDetailDrawerOpen(false); setSelectedTodo(null); }}
                    size="large"
                    extra={
                        <Space>
                            <Button icon={<EditOutlined />} onClick={() => { setDetailDrawerOpen(false); if (selectedTodo) handleEdit(selectedTodo); }}>
                                Edit
                            </Button>
                        </Space>
                    }
                >
                    {selectedTodo && (
                        <div>
                            <Space wrap style={{ marginBottom: 16 }}>
                                <Tag color={PRIORITY_CONFIG[selectedTodo.priority].color}>
                                    {PRIORITY_CONFIG[selectedTodo.priority].label}
                                </Tag>
                                <Tag color={STATUS_CONFIG[selectedTodo.status].color}>
                                    {STATUS_CONFIG[selectedTodo.status].icon} {STATUS_CONFIG[selectedTodo.status].label}
                                </Tag>
                                {categoryMap.get(selectedTodo.categoryId) && (
                                    <Tag style={{ borderColor: categoryMap.get(selectedTodo.categoryId)!.color }}>
                                        {categoryMap.get(selectedTodo.categoryId)!.icon} {categoryMap.get(selectedTodo.categoryId)!.name}
                                    </Tag>
                                )}
                            </Space>

                            {selectedTodo.description && (
                                <Paragraph style={{ marginBottom: 16 }}>{selectedTodo.description}</Paragraph>
                            )}

                            <Row gutter={[16, 8]} style={{ marginBottom: 16 }}>
                                <Col span={12}>
                                    <Text type="secondary">Created:</Text>
                                    <br />
                                    <Text>{dayjs(selectedTodo.createdAt).format("YYYY-MM-DD HH:mm")}</Text>
                                </Col>
                                {selectedTodo.dueDate && (
                                    <Col span={12}>
                                        <Text type="secondary">Due:</Text>
                                        <br />
                                        <Text type={isOverdue(selectedTodo) ? "danger" : undefined}>
                                            {dayjs(selectedTodo.dueDate).format("YYYY-MM-DD HH:mm")}
                                        </Text>
                                    </Col>
                                )}
                                {selectedTodo.completedAt && (
                                    <Col span={12}>
                                        <Text type="secondary">Completed:</Text>
                                        <br />
                                        <Text>{dayjs(selectedTodo.completedAt).format("YYYY-MM-DD HH:mm")}</Text>
                                    </Col>
                                )}
                                <Col span={12}>
                                    <Text type="secondary">Hours:</Text>
                                    <br />
                                    <Text>Est: {selectedTodo.estimatedHours}h / Actual: {selectedTodo.actualHours}h</Text>
                                </Col>
                            </Row>

                            {selectedTodo.tags.length > 0 && (
                                <div style={{ marginBottom: 16 }}>
                                    <Text type="secondary">Tags:</Text>
                                    <div style={{ marginTop: 4 }}>
                                        {selectedTodo.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                                    </div>
                                </div>
                            )}

                            <Divider>Subtasks</Divider>
                            <SubtaskList
                                subtasks={selectedTodo.subtasks}
                                onToggle={(id) => handleToggleSubtask(selectedTodo.id, id)}
                                onDelete={(id) => handleDeleteSubtask(selectedTodo.id, id)}
                                onAdd={(title) => handleAddSubtask(selectedTodo.id, title)}
                            />

                            {selectedTodo.notes && (
                                <>
                                    <Divider>Notes</Divider>
                                    <Paragraph>{selectedTodo.notes}</Paragraph>
                                </>
                            )}
                        </div>
                    )}
                </Drawer>

                {/* Settings Drawer */}
                <Drawer
                    title="Settings"
                    open={settingsDrawerOpen}
                    onClose={() => setSettingsDrawerOpen(false)}
                    size="default"
                >
                    {settings && (
                        <Space orientation="vertical" style={{ width: "100%" }} size="large">
                            <div>
                                <Text strong>Default Category</Text>
                                <Select
                                    value={settings.defaultCategory}
                                    onChange={(v) => handleUpdateSettings({ defaultCategory: v })}
                                    style={{ width: "100%", marginTop: 8 }}
                                    options={categories.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` }))}
                                />
                            </div>
                            <div>
                                <Text strong>Default Priority</Text>
                                <Select
                                    value={settings.defaultPriority}
                                    onChange={(v) => handleUpdateSettings({ defaultPriority: v })}
                                    style={{ width: "100%", marginTop: 8 }}
                                    options={Object.entries(PRIORITY_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))}
                                />
                            </div>
                            <Divider />
                            <div>
                                <Text strong>Database Info</Text>
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary">Total Tasks: {stats?.total || 0}</Text>
                                    <br />
                                    <Text type="secondary">Categories: {categories.length}</Text>
                                    <br />
                                    <Text type="secondary">
                                        Last Export: {settings.lastExportDate ? dayjs(settings.lastExportDate).format("YYYY-MM-DD HH:mm") : "Never"}
                                    </Text>
                                </div>
                            </div>
                            <Alert
                                type="info"
                                message="Data Storage"
                                description="All data is stored locally in your browser using IndexedDB. Export regularly to backup your data."
                                showIcon
                            />
                        </Space>
                    )}
                </Drawer>

                {/* Category Management Drawer */}
                <Drawer
                    title={editingCategory ? "Edit Category" : "Manage Categories"}
                    open={categoryDrawerOpen}
                    onClose={() => { setCategoryDrawerOpen(false); setEditingCategory(null); }}
                    size="default"
                    extra={
                        editingCategory ? (
                            <Button type="primary" onClick={handleSaveCategory}>Save</Button>
                        ) : (
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                                setEditingCategory(null);
                                categoryForm.resetFields();
                                categoryForm.setFieldsValue({ name: "", color: "#1677ff", icon: "📁" });
                                setSelectedEmoji("📁");
                            }}>
                                New Category
                            </Button>
                        )
                    }
                >
                    {editingCategory || categoryForm.getFieldValue("name") !== undefined ? (
                        <Form form={categoryForm} layout="vertical">
                            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                <Input placeholder="Category name" />
                            </Form.Item>
                            <Form.Item name="icon" label="Icon (emoji)">
                                <Space>
                                    <Button
                                        style={{ fontSize: 24, width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}
                                        onClick={() => {
                                            setSelectedEmoji(categoryForm.getFieldValue("icon") || "📁");
                                            setEmojiPickerOpen(true);
                                        }}
                                    >
                                        {categoryForm.getFieldValue("icon") || "📁"}
                                    </Button>
                                    <Text type="secondary">Click to choose emoji</Text>
                                </Space>
                            </Form.Item>
                            <Form.Item name="color" label="Color">
                                <ColorPicker format="hex" />
                            </Form.Item>
                            <Space>
                                <Button type="primary" onClick={handleSaveCategory}>
                                    {editingCategory ? "Update" : "Add"}
                                </Button>
                                <Button onClick={() => setEditingCategory(null)}>Cancel</Button>
                            </Space>
                        </Form>
                    ) : (
                        <div>
                            {categories.map(cat => (
                                <Card
                                    key={cat.id}
                                    size="small"
                                    style={{ marginBottom: 8 }}
                                    extra={
                                        <Space>
                                            <Button size="small" type="text" icon={<EditOutlined />} onClick={() => {
                                                handleEditCategory(cat);
                                                setSelectedEmoji(cat.icon);
                                            }} />
                                            {!cat.isDefault && (
                                                <Popconfirm title="Delete category?" onConfirm={() => handleDeleteCategory(cat.id)}>
                                                    <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                                                </Popconfirm>
                                            )}
                                        </Space>
                                    }
                                >
                                    <Space>
                                        <span style={{ fontSize: 24 }}>{cat.icon}</span>
                                        <Text strong>{cat.name}</Text>
                                        <div style={{ width: 16, height: 16, backgroundColor: cat.color, borderRadius: 4 }} />
                                        {cat.isDefault && <Tag>Default</Tag>}
                                    </Space>
                                </Card>
                            ))}
                        </div>
                    )}
                </Drawer>

                {/* Emoji Picker Modal */}
                <Modal
                    title="Choose Icon"
                    open={emojiPickerOpen}
                    onCancel={() => setEmojiPickerOpen(false)}
                    width={500}
                    footer={[
                        <Button key="cancel" onClick={() => setEmojiPickerOpen(false)}>Cancel</Button>,
                        <Button key="select" type="primary" onClick={() => {
                            categoryForm.setFieldValue("icon", selectedEmoji);
                            setEmojiPickerOpen(false);
                        }}>
                            Select {selectedEmoji}
                        </Button>
                    ]}
                >
                    <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                        <Input
                            placeholder="Search emojis..."
                            prefix={<SearchOutlined />}
                            value={emojiSearchText}
                            onChange={(e) => setEmojiSearchText(e.target.value)}
                            allowClear
                        />

                        <Segmented
                            value={selectedEmojiCategory}
                            onChange={(v) => setSelectedEmojiCategory(v as string)}
                            options={Object.keys(EMOJI_CATEGORIES)}
                            block
                            style={{ overflowX: "auto" }}
                        />

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(10, 1fr)",
                            gap: 4,
                            maxHeight: 300,
                            overflowY: "auto",
                            padding: 8,
                            backgroundColor: "var(--ant-color-bg-container-disabled)",
                            borderRadius: 8
                        }}>
                            {(emojiSearchText
                                ? ALL_EMOJIS.filter(e => e.includes(emojiSearchText))
                                : EMOJI_CATEGORIES[selectedEmojiCategory as keyof typeof EMOJI_CATEGORIES] || []
                            ).map((emoji, idx) => (
                                <Button
                                    key={idx}
                                    type={selectedEmoji === emoji ? "primary" : "text"}
                                    style={{
                                        fontSize: 20,
                                        width: 40,
                                        height: 40,
                                        padding: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                    onClick={() => setSelectedEmoji(emoji)}
                                >
                                    {emoji}
                                </Button>
                            ))}
                        </div>

                        <div style={{ textAlign: "center", marginTop: 8 }}>
                            <Text strong style={{ fontSize: 32 }}>{selectedEmoji}</Text>
                            <br />
                            <Text type="secondary">Selected Icon</Text>
                        </div>
                    </Space>
                </Modal>

                {/* Floating Action Button */}
                <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
                    <FloatButton icon={<PlusOutlined />} type="primary" tooltip="Add Task" onClick={handleAdd} />
                    <FloatButton icon={<ReloadOutlined />} tooltip="Refresh" onClick={loadData} />
                </FloatButton.Group>
            </Spin>
        </ToolPageLayout>
    );
}

// ─── Subtask List Component ──────────────────────────────────────────

interface SubtaskListProps {
    subtasks: Subtask[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onAdd: (title: string) => void;
}

function SubtaskList({ subtasks, onToggle, onDelete, onAdd }: SubtaskListProps) {
    const [newSubtask, setNewSubtask] = useState("");

    const handleAdd = () => {
        if (newSubtask.trim()) {
            onAdd(newSubtask.trim());
            setNewSubtask("");
        }
    };

    return (
        <div>
            {subtasks.map(st => (
                <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Checkbox checked={st.done} onChange={() => onToggle(st.id)} />
                    <Text style={{ flex: 1, textDecoration: st.done ? "line-through" : "none", opacity: st.done ? 0.5 : 1 }}>
                        {st.title}
                    </Text>
                    <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(st.id)} />
                </div>
            ))}
            <Space.Compact style={{ width: "100%", marginTop: 8 }}>
                <Input
                    placeholder="Add subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onPressEnter={handleAdd}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} />
            </Space.Compact>
        </div>
    );
}
