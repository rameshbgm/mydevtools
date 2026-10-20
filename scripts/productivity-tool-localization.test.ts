/* eslint-disable @typescript-eslint/no-explicit-any -- Controlled React VM fixtures inspect heterogeneous component props and persistence callbacks. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { LANGUAGES, SHARED_TRANSLATIONS, translate, type Language } from "../src/lib/i18n/catalog";
import { PRODUCTIVITY_TOOL_TRANSLATIONS } from "../src/lib/i18n/productivity-tools";
import * as todoEngine from "../src/lib/todo-db";
import * as tableExport from "../src/lib/table-export";
import { parseString } from "@fast-csv/parse";
const parseCsv = (csv: string) => new Promise<string[][]>((resolve, reject) => { const rows: string[][] = []; parseString(csv).on("error", reject).on("data", row => rows.push(row)).on("end", () => resolve(rows)); });

const paths = ["todo-list", "sticky-notes"].map(id => `src/app/tools/${id}/page.tsx`);
const slots = (value: string) => (value.match(/\{[A-Za-z][A-Za-z0-9]*\}/g) ?? []).sort();
for (const [source, columns] of Object.entries(PRODUCTIVITY_TOOL_TRANSLATIONS)) {
    assert.equal(columns.length, 7, source);
    assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, source), `Catalog missing: ${source}`);
    for (const [index, language] of LANGUAGES.slice(1).entries()) {
        assert.ok(columns[index].trim(), source);
        assert.deepEqual(slots(source), slots(columns[index]), source);
        assert.equal(translate(language.id, source), columns[index], `${source}/${language.id}`);
    }
}
for (const config of [todoEngine.PRIORITY_CONFIG, todoEngine.STATUS_CONFIG]) for (const value of Object.values(config)) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, value.label), value.label);
for (const path of paths) {
    const source = readFileSync(path, "utf8"), file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.equal(ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true }).diagnostics?.length, 0, path);
    const visit = (node: ts.Node) => {
        if (ts.isCallExpression(node) && ["t", "translationRef.current"].includes(node.expression.getText(file)) && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) assert.ok(Object.hasOwn(SHARED_TRANSLATIONS, node.arguments[0].text), `${path}/${node.arguments[0].text}`);
        if (ts.isJsxText(node) && /[A-Za-z]/.test(node.text)) assert.fail(`Unlocalized copy: ${path}/${node.text}`);
        if (ts.isJsxAttribute(node) && ["title", "description", "placeholder", "aria-label", "okText", "cancelText", "label", "tooltip"].includes(node.name.getText(file))) assert.ok(!node.initializer || ts.isJsxExpression(node.initializer), `${path}/${node.getText(file)}`);
        ts.forEachChild(node, visit);
    }; visit(file);
    assert.doesNotMatch(source, /key=\{(?:language|direction)\}/);
    assert.doesNotMatch(source, /drag-and-drop|Drag and drop|Keyboard shortcuts available|Keep quick reminders, API keys/);
}

const require = createRequire(import.meta.url);
const React = require("react") as typeof import("react");
const runtime = require("react/jsx-runtime");
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const fixed = "2026-10-21T00:00:00.000Z";
const category: todoEngine.Category = { id: "category-unicode", name: '工程, "API"\r\nمرحبا', color: "#1677ff", icon: "📁", isDefault: false, createdAt: fixed };
const item = (id: string, changes: Partial<todoEngine.TodoItem> = {}): todoEngine.TodoItem => ({ ...todoEngine.createEmptyTodo(category.id), id, createdAt: fixed, updatedAt: fixed, title: 'Task, "世界"\r\nمرحبا 🌍', description: 'First\nsecond, "quoted"', tags: ['tag,one', 'quote"tag', '日本語'], priority: "high", status: "in-progress", notes: 'note\r\n"البيانات", 🌍', estimatedHours: 1.5, actualHours: 0.5, dueDate: "2026-10-22T00:00:00.000Z", subtasks: [{ id: "sub-1", title: "مرحبا 世界 🌍", done: false, completedAt: null }], ...changes });
const settings: todoEngine.TodoSettings = { id: "settings", defaultCategory: category.id, defaultPriority: "high", showArchived: false, showDeleted: false, defaultView: "list", autoArchiveCompletedDays: 0, lastExportDate: null };
type Node = { type: any; props: Record<string, any> };
type Hook = { deps?: readonly unknown[]; value?: any };
function harness(path: string, initial: Record<string, any> = {}) {
    let language: Language = "en", cursor = 0;
    const hooks: Hook[] = [], stateNames: string[] = [], writes: string[] = [], calls: string[] = [], notifications: [string, string][] = [], dialogs: Record<string, any>[] = [], downloads: any[][] = [], effects: (() => any)[] = [];
    const cells: Record<string, any> = {}, noteStorage: Record<string, string> = {};
    let records = clone([item("active"), item("archive", { isArchived: true, archivedAt: fixed }), item("deleted", { isDeleted: true, deletedAt: fixed })]);
    let cats = clone([category]), prefs = clone(settings), failure: string | null = null;
    const file = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const collect = (node: ts.Node) => { if (ts.isVariableDeclaration(node) && ts.isArrayBindingPattern(node.name) && node.initializer && ts.isCallExpression(node.initializer) && node.initializer.expression.getText(file) === "useState") stateNames.push(node.name.elements[0].getText(file)); ts.forEachChild(node, collect); }; collect(file);
    let stateCursor = 0;
    const equalDeps = (a?: readonly unknown[], b?: readonly unknown[]) => !!a && !!b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
    const stub = () => null;
    const component = (name: string) => function FixtureComponent(props: any) { return React.createElement(name, props, props.children); };
    const components = new Proxy({} as Record<string, any>, { get: (object, name: string) => object[name] ??= component(name) });
    components.Input = Object.assign(component("Input"), { TextArea: component("TextArea") });
    components.Typography = { Text: component("Text"), Paragraph: component("Paragraph") };
    components.Space = Object.assign(component("Space"), { Compact: component("Space.Compact") });
    components.FloatButton = Object.assign(component("FloatButton"), { Group: component("FloatButton.Group") });
    components.Empty = Object.assign(component("Empty"), { PRESENTED_IMAGE_SIMPLE: "empty-fixture" });
    const forms = [0, 1].map(() => ({ values: {} as Record<string, any>, resetFields() { this.values = {}; }, setFieldsValue(value: Record<string, any>) { this.values = { ...this.values, ...value }; }, getFieldValue(name: string) { return this.values[name]; }, setFieldValue(name: string, value: any) { this.values[name] = value; }, async validateFields() { return this.values; } }));
    let formCursor = 0;
    components.Form = Object.assign(component("Form"), { Item: component("Form.Item"), useForm: () => [forms[formCursor++]] });
    const app = { message: Object.fromEntries(["success", "error", "warning"].map(type => [type, (message: string) => notifications.push([type, message])])), modal: { confirm: (dialog: Record<string, any>) => { dialogs.push(dialog); return { destroy: stub }; } } };
    components.App = { useApp: () => app };
    const stats = (): todoEngine.TodoStats => ({ total: records.length, active: records.filter(r => !r.isDeleted && !r.isArchived).length, archived: records.filter(r => r.isArchived && !r.isDeleted).length, deleted: records.filter(r => r.isDeleted).length, done: records.filter(r => r.status === "done").length, inProgress: records.filter(r => r.status === "in-progress").length, overdue: 0, dueToday: 0, completionRate: 0, dueTomorrow: 0, dueThisWeek: 0, blocked: 0, avgCompletionTime: 0, totalEstimatedHours: 0, totalActualHours: 0 } as todoEngine.TodoStats);
    const boundary = async (operation: string) => { calls.push(operation); if (failure === operation) throw Error("fixture unavailable"); };
    const update = async (id: string, changes: Partial<todoEngine.TodoItem>) => { await boundary("updateTodo"); const found = records.find(r => r.id === id)!; Object.assign(found, clone(changes), { updatedAt: fixed }); return clone(found); };
    const db = { ...todoEngine,
        checkIndexedDBSupport: () => ({ supported: true }), initializeDefaultCategories: async () => boundary("initializeDefaultCategories"),
        getAllTodos: async () => { await boundary("getAllTodos"); return clone(records); }, getAllCategories: async () => { await boundary("getAllCategories"); return clone(cats); }, getSettings: async () => { await boundary("getSettings"); return clone(prefs); }, getTodoStats: async () => { await boundary("getTodoStats"); return stats(); },
        addTodo: async (values: any) => { await boundary("addTodo"); const added = item("new-task", values); records.unshift(added); return clone(added); }, updateTodo: update,
        softDeleteTodo: (id: string) => update(id, { isDeleted: true, deletedAt: fixed }), restoreTodo: (id: string) => update(id, { isDeleted: false, deletedAt: null }), archiveTodo: (id: string) => update(id, { isArchived: true, archivedAt: fixed }), unarchiveTodo: (id: string) => update(id, { isArchived: false, archivedAt: null }),
        hardDeleteTodo: async (id: string) => { await boundary("hardDeleteTodo"); records = records.filter(r => r.id !== id); }, emptyTrash: async () => { await boundary("emptyTrash"); const count = records.filter(r => r.isDeleted).length; records = records.filter(r => !r.isDeleted); return count; },
        bulkUpdateTodos: async (ids: string[], values: any) => { await boundary("bulkUpdateTodos"); records = records.map(r => ids.includes(r.id) ? { ...r, ...clone(values) } : r); },
        addCategory: async (value: any) => { await boundary("addCategory"); const cat = { ...value, id: "new-category", createdAt: fixed }; cats.push(cat); return clone(cat); }, updateCategory: async (id: string, value: any) => { await boundary("updateCategory"); const cat = cats.find(c => c.id === id)!; Object.assign(cat, clone(value)); return clone(cat); }, deleteCategory: async (id: string) => { await boundary("deleteCategory"); cats = cats.filter(c => c.id !== id); },
        updateSettings: async (value: any) => { await boundary("updateSettings"); prefs = { ...prefs, ...clone(value) }; return clone(prefs); },
        exportAllData: async () => { await boundary("exportAllData"); return { version: "1.0.0", exportedAt: fixed, todos: clone(records), categories: clone(cats), settings: clone(prefs) }; },
        importData: async (value: todoEngine.ExportData, mode: string) => { await boundary("importData:" + mode); if (mode === "replace") { records = clone(value.todos); cats = clone(value.categories); } else { records.push(...clone(value.todos)); cats.push(...clone(value.categories)); } return { todosImported: value.todos.length, categoriesImported: value.categories.length }; }, generateId: () => "new-subtask",
    };
    const react = { ...React,
        useState: (fallback: any) => { const name = stateNames[stateCursor++], index = cursor++; if (!(index in hooks)) hooks[index] = { value: Object.hasOwn(initial, name) ? initial[name] : typeof fallback === "function" ? fallback() : fallback }; cells[name] = hooks[index].value; return [hooks[index].value, (value: any) => { hooks[index].value = typeof value === "function" ? value(hooks[index].value) : value; cells[name] = hooks[index].value; writes.push(name); }]; },
        useRef: (value: any) => { const index = cursor++; return (hooks[index] ??= { value: { current: value } }).value; },
        useMemo: (fn: () => any, deps: any[]) => { const index = cursor++; if (!hooks[index] || !equalDeps(hooks[index].deps, deps)) hooks[index] = { deps, value: fn() }; return hooks[index].value; },
        useCallback: (fn: any, deps: any[]) => { const index = cursor++; if (!hooks[index] || !equalDeps(hooks[index].deps, deps)) hooks[index] = { deps, value: fn }; return hooks[index].value; },
        useEffect: (fn: () => any, deps: any[]) => { const index = cursor++; if (!hooks[index] || !equalDeps(hooks[index].deps, deps)) { hooks[index] = { deps }; effects.push(fn); } },
    };
    const compiled = { exports: {} as { default: () => unknown } };
    const dependency = (name: string): any => {
        if (name === "react") return react;
        if (name === "react/jsx-runtime") return runtime;
        if (name === "antd") return components;
        if (name === "@ant-design/icons") return new Proxy({}, { get: () => stub });
        if (name === "framer-motion") return { AnimatePresence: component("AnimatePresence"), motion: { div: component("motion.div") } };
        if (name.endsWith("LanguageProvider")) return { useLanguage: () => ({ t: stableTranslators[language], language }) };
        if (name.endsWith("ToolPageLayout")) return { __esModule: true, default: (props: any) => React.createElement("ToolPageLayout", props, props.title, props.description, JSON.stringify(props.learnMore), props.children) };
        if (name.endsWith("todo-db")) return db;
        if (name.endsWith("table-export")) return tableExport;
        if (name.endsWith("download")) return { downloadText: (...args: any[]) => downloads.push(args) };
        if (name.endsWith("project-storage")) return { projectStorage: { getItem: (key: string) => { calls.push("getItem:" + key); return noteStorage[key] ?? null; }, setItem: (key: string, value: string) => { calls.push("setItem:" + key); noteStorage[key] = value; } } };
        if (name.startsWith("dayjs")) return require(name);
        throw Error("Unexpected dependency: " + name);
    };
    const stableTranslators = Object.fromEntries(LANGUAGES.map(l => [l.id, (source: string, values?: Record<string, string | number>) => translate(l.id, source, values)])) as Record<Language, (source: string, values?: Record<string, string | number>) => string>;
    const code = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    runInNewContext(code, { module: compiled, exports: compiled.exports, require: dependency, Date, Math, Number, String, Set, Map, JSON, console: { ...console, error: stub }, window: {}, localStorage: {}, Intl });
    const text = (node: any): string => node == null || typeof node === "boolean" ? "" : typeof node === "string" || typeof node === "number" ? String(node) : Array.isArray(node) ? node.map(text).join("") : text(node.props?.children);
    const render = (nextLanguage: Language = language) => {
        language = nextLanguage; cursor = 0; stateCursor = 0; formCursor = 0;
        const elements: Node[] = [], visible: string[] = [];
        const walk = (node: any) => { if (node == null || typeof node === "boolean") return; if (typeof node === "string" || typeof node === "number") { visible.push(String(node)); return; } if (Array.isArray(node)) { node.forEach(walk); return; } if (typeof node.type === "function") { if (node.type.name === "SubtaskList") { elements.push({ type: "SubtaskList", props: node.props }); return; } walk(node.type(node.props)); return; } if (node.props) { elements.push(node); walk(node.props.children); if (node.props.extra) walk(node.props.extra); } }; walk(compiled.exports.default());
        const by = (type: string, predicate: (props: Record<string, any>) => boolean = () => true) => { const found = elements.find(node => node.type === type && predicate(node.props)); assert.ok(found, `Missing ${type}/${language}`); return found; };
        const button = (label: string) => by("Button", props => text(props.children) === translate(language, label) || props["aria-label"] === translate(language, label));
        return { elements, text: visible.join(" "), by, button };
    };
    const flush = async () => { for (let attempt = 0; attempt < 12; attempt++) { while (effects.length) await effects.shift()!(); await Promise.resolve(); } };
    return { render, flush, cells, writes, calls, downloads, dialogs, notifications, forms, noteStorage, records: () => clone(records), categories: () => clone(cats), fail: (operation: string | null) => { failure = operation; }, elementText: text };
}

async function main() {
    for (const language of LANGUAGES) {
        const t = (source: string, values?: Record<string, string | number>) => translate(language.id, source, values);
        const app = harness(paths[0], { isModalOpen: true, detailDrawerOpen: true, selectedTodo: item("active"), settingsDrawerOpen: true, searchText: "世界", filterPriority: "high", filterCategory: category.id, selectedRowKeys: ["active"] });
        app.render(language.id); await app.flush(); let view = app.render(language.id);
        assert.ok(view.text.includes(t("Subtasks"))); assert.ok(view.text.includes(category.name)); assert.ok(view.elements.some(node => node.type === "Drawer" && node.props.title === item("active").title));
        const table = view.by("Table"); assert.deepEqual(table.props.dataSource.map((row: any) => row.id), ["active"]);
        assert.equal(table.props.pagination.showTotal(42), t("Tasks: {count}", { count: 42 }));
        for (const name of ["filterStatus", "filterCategory", "filterPriority", "filterTags", "searchText", "selectedRowKeys"]) assert.deepEqual(JSON.parse(JSON.stringify(app.cells[name])), JSON.parse(JSON.stringify(({ filterStatus: "all", filterCategory: category.id, filterPriority: "high", filterTags: [], searchText: "世界", selectedRowKeys: ["active"] } as Record<string, any>)[name])));
        for (const l of LANGUAGES) { const before = JSON.stringify(app.cells), calls = app.calls.length; app.writes.length = 0; app.render(l.id); await app.flush(); assert.equal(JSON.stringify(app.cells), before, l.id); assert.equal(app.calls.length, calls, `Locale must not load or write DB/${l.id}`); assert.deepEqual(app.writes, []); }
        view = app.render(language.id); await app.flush();
        await view.button("Export").props.onClick();
        const csv = app.downloads.at(-1)!; assert.match(csv[1], /^todos-\d{4}-\d{2}-\d{2}\.csv$/); assert.equal(csv[2], "text/csv");
        const parsed = await parseCsv(csv[0]);
        assert.deepEqual(parsed[0], ["Title", "Description", "Priority", "Status", "Category", "Due Date", "Created", "Tags", "Est Hours", "Actual Hours", "Archived", "Notes"]);
        assert.equal(parsed.length, 3); // Active + archived, deleted excluded, filters do not alter export.
        assert.deepEqual(parsed[1], [item("active").title, item("active").description, "high", "in-progress", category.name, "2026-10-22T00:00:00.000Z", fixed, item("active").tags.join(", "), "1.5", "0.5", "No", item("active").notes]);
        assert.equal(parsed[2][10], "Yes");
        await view.button("Download").props.onClick();
        const backup = JSON.parse(app.downloads.at(-1)![0]); assert.deepEqual(backup.todos, app.records()); assert.deepEqual(backup.categories, [category]);
        assert.equal(backup.version, "1.0.0"); assert.equal(backup.exportedAt, fixed);
        view.button("Add Task").props.onClick(); view = app.render(language.id);
        assert.equal(app.forms[0].values.categoryId, category.id); assert.equal(app.forms[0].values.priority, "high");
        const draft = { ...todoEngine.createEmptyTodo(category.id), title: "草稿 مرحبا 🌍", description: "raw payload", priority: "medium", status: "todo", tags: ["مهم"], notes: "keep exactly", dueDate: require("dayjs")("2026-11-01T10:00:00Z") };
        app.forms[0].setFieldsValue(draft); await view.by("Modal", props => props.open === true && typeof props.onOk === "function").props.onOk();
        assert.equal(app.records()[0].title, draft.title); assert.equal(app.records()[0].dueDate, "2026-11-01T10:00:00.000Z"); assert.equal(app.records()[0].priority, "medium");
        assert.ok(app.notifications.some(([, message]) => message === t("Task added")));

        const row = item("active"), actions = table.props.columns.find((column: any) => column.key === "actions");
        const rawActions = actions.render(null, row);
        const flatten = (node: any): Node[] => !node || typeof node !== "object" ? [] : Array.isArray(node) ? node.flatMap(flatten) : [node, ...flatten(node.props?.children)];
        const rowNodes = flatten(rawActions); const archive = rowNodes.find(node => node.props?.onClick && node.props["aria-label"] === t("Archive"))!;
        await archive.props.onClick(); assert.equal(app.records().find(r => r.id === "active")!.isArchived, true);
        const pop = rowNodes.find(node => node.props?.onConfirm)!; await pop.props.onConfirm(); assert.equal(app.records().find(r => r.id === "active")!.isDeleted, true);
        view = app.render(language.id); const modes = view.by("Segmented", props => props.value === "active"); modes.props.onChange("deleted"); view = app.render(language.id);
        assert.ok(view.by("Table").props.dataSource.some((r: any) => r.id === "active"));
        view.button("Empty Trash").props.onClick(); const warning = app.dialogs.at(-1)!;
        assert.equal(warning.title, t("Empty Trash?")); assert.equal(warning.cancelText, t("Cancel")); assert.equal(app.records().filter(r => r.isDeleted).length, 2);
        await warning.onOk(); assert.equal(app.records().some(r => r.isDeleted), false); assert.ok(app.notifications.some(([, message]) => message === t("Permanently deleted items: {count}", { count: 2 })));

        const failure = harness(paths[0]); failure.render(language.id); await failure.flush(); failure.fail("exportAllData"); await failure.render(language.id).button("Download").props.onClick(); assert.equal(failure.downloads.length, 0); assert.ok(failure.notifications.some(([, message]) => message === t("Failed to export data")));
        failure.fail(null); const badFile = failure.render(language.id).by("input").props.onChange;
        await badFile({ target: { files: [{ text: async () => '{"version":"1.0.0","todos":42}' }] } }); assert.ok(failure.notifications.some(([, message]) => message === t("Missing or invalid todos array"))); assert.equal(failure.dialogs.length, 0);
        await badFile({ target: { files: [{ text: async () => "{" }] } }); assert.ok(failure.notifications.some(([, message]) => message === t("Failed to read file. Make sure it's a valid JSON backup file.")));
        const imported = { version: "1.0.0", exportedAt: fixed, todos: [item("imported")], categories: [{ ...category, id: "imported-category" }], settings };
        await badFile({ target: { files: [{ text: async () => JSON.stringify(imported) }] } }); const confirm = failure.dialogs.at(-1)!;
        assert.equal(confirm.title, t("Import Data")); assert.ok(failure.elementText(confirm.content).includes(t("Backup contains {tasks} tasks and {categories} categories.", { tasks: 1, categories: 1 })));
        assert.equal(failure.records().length, 3);
        assert.equal(confirm.cancelText, t("Cancel")); assert.equal(confirm.closable, true); assert.equal(confirm.keyboard, true);
        const callsBeforeCancel = failure.calls.length, dialogsBeforeCancel = failure.dialogs.length;
        for (const dismissal of ["Cancel", "X", "Escape"]) { if (confirm.onCancel) await confirm.onCancel({ type: dismissal }); assert.equal(failure.calls.length, callsBeforeCancel); assert.equal(failure.dialogs.length, dialogsBeforeCancel); assert.equal(failure.records().length, 3); }
        await confirm.onOk(); assert.equal(failure.records().length, 4); assert.equal(failure.records().at(-1)!.title, item("imported").title);
        await badFile({ target: { files: [{ text: async () => JSON.stringify(imported) }] } }); const replaceChoice = failure.dialogs.at(-1)!;
        const choices = flatten(replaceChoice.footer(null, { OkBtn: () => null, CancelBtn: () => null }));
        const replaceButton = choices.find(node => failure.elementText(node.props?.children) === t("Replace all") && typeof node.props?.onClick === "function")!;
        assert.ok(replaceButton); const beforeReplace = failure.calls.length; replaceButton.props.onClick(); const danger = failure.dialogs.at(-1)!;
        assert.equal(danger.title, t("Replace all task data?")); assert.equal(danger.okButtonProps.danger, true); assert.equal(failure.calls.length, beforeReplace); assert.equal(failure.records().length, 4);
        if (danger.onCancel) await danger.onCancel(); assert.equal(failure.calls.length, beforeReplace);
        await danger.onOk(); assert.deepEqual(failure.records(), imported.todos); assert.deepEqual(failure.categories(), imported.categories);
        failure.fail("importData:replace"); await assert.rejects(() => danger.onOk(), /fixture unavailable/); assert.ok(failure.notifications.some(([, message]) => message === t("Import failed. Check the backup file and try again.")));

        const management = harness(paths[0]); management.render(language.id); await management.flush(); let managed = management.render(language.id);
        managed.button("Categories").props.onClick(); managed = management.render(language.id); assert.equal(management.cells.categoryDrawerOpen, true); assert.equal(management.cells.categoryEditorOpen, false); assert.ok(managed.text.includes(category.name));
        managed.button("New Category").props.onClick(); managed = management.render(language.id); assert.equal(management.cells.categoryEditorOpen, true); assert.equal(management.forms[1].values.name, "");
        management.forms[1].setFieldsValue({ name: "تصنيف 世界 🌍", color: "#abcdef", icon: "🧭" });
        const categoryDraft = JSON.stringify(management.forms[1].values); managed = management.render("ar"); await management.flush(); assert.equal(JSON.stringify(management.forms[1].values), categoryDraft);
        managed = management.render(language.id); await management.flush(); managed.button("Cancel").props.onClick(); managed = management.render(language.id); assert.equal(management.cells.categoryEditorOpen, false); assert.ok(managed.text.includes(category.name));
        managed.button("New Category").props.onClick(); managed = management.render(language.id); management.forms[1].setFieldsValue({ name: "تصنيف 世界 🌍", color: "#abcdef", icon: "🧭" }); await managed.button("Save").props.onClick();
        assert.equal(management.categories().at(-1)!.name, "تصنيف 世界 🌍"); assert.equal(management.cells.categoryEditorOpen, false);
        managed = management.render(language.id); managed.button("Categories").props.onClick(); managed = management.render(language.id);
        managed.by("Button", props => props["aria-label"] === t("Edit")).props.onClick(); managed = management.render(language.id); assert.equal(management.cells.categoryEditorOpen, true); assert.equal(management.forms[1].values.name, category.name);
        management.forms[1].setFieldsValue({ name: "renamed, \"分類\"" }); await managed.button("Save").props.onClick(); assert.equal(management.categories()[0].name, "renamed, \"分類\"");
        managed = management.render(language.id); managed.button("Categories").props.onClick(); managed = management.render(language.id);
        const deleteCategory = managed.elements.find(node => node.type === "Popconfirm" && node.props.title === t("Delete category?"))!; const callsBeforeGuard = management.calls.length; await deleteCategory.props.onConfirm(); assert.equal(management.calls.length, callsBeforeGuard); assert.equal(management.categories().length, 2); assert.ok(management.notifications.some(([, message]) => message === t("Cannot delete a category used by {count} tasks. Move those tasks to another category first.", { count: 3 })));
        const sub = harness(paths[0], { detailDrawerOpen: true, selectedTodo: item("active") }); sub.render(language.id); await sub.flush(); let details = sub.render(language.id); const subCallbacks = details.by("SubtaskList").props;
        await subCallbacks.onToggle("sub-1"); assert.equal(sub.records()[0].subtasks[0].done, true);
        details = sub.render(language.id); await details.by("SubtaskList").props.onAdd("  添加 مرحبا 🌍  "); assert.equal(sub.records()[0].subtasks.at(-1)!.title, "添加 مرحبا 🌍");
        details = sub.render(language.id); await details.by("SubtaskList").props.onDelete("sub-1"); assert.equal(sub.records()[0].subtasks.length, 1); assert.equal(sub.records()[0].subtasks[0].id, "new-subtask");

        const notes = harness(paths[1]); let board = notes.render(language.id); await notes.flush(); board = notes.render(language.id); assert.equal(board.by("Empty").props.description, t("No notes yet — click 'New Note' to get started"));
        board.button("New Note").props.onClick(); board = notes.render(language.id);
        const title = board.by("Input", props => props["aria-label"] === t("Note title")); title.props.onChange({ target: { value: "عنوان 世界 🌍" } });
        board.by("TextArea").props.onChange({ target: { value: 'echo "世界"\nمرحبا 🌍' } }); board = notes.render(language.id);
        const original = JSON.stringify(notes.cells.notes), originalCalls = notes.calls.length; notes.writes.length = 0;
        for (const l of LANGUAGES) { const next = notes.render(l.id); await notes.flush(); assert.equal(JSON.stringify(notes.cells.notes), original); assert.equal(notes.calls.length, originalCalls); assert.equal(next.by("Input", props => props["aria-label"] === translate(l.id, "Note title")).props.value, "عنوان 世界 🌍"); }
        assert.deepEqual(notes.writes, []);
        board = notes.render(language.id); await board.button("Pin to top").props.onClick({ stopPropagation() {} }); assert.equal(notes.cells.notes[0].pinned, true);
        board = notes.render(language.id); const swatch = board.by("button", props => props["aria-label"] === t("Set note color: {color}", { color: t("Blue") })); swatch.props.onClick({ stopPropagation() {} }); assert.equal(notes.cells.notes[0].color, "#bfdbfe");
        board = notes.render(language.id); const deleteDialog = board.by("Popconfirm"); assert.equal(deleteDialog.props.title, t("Delete this note?")); assert.equal(deleteDialog.props.cancelText, t("Cancel")); assert.equal(notes.cells.notes.length, 1);
        deleteDialog.props.onConfirm(); assert.equal(notes.cells.notes.length, 0); assert.equal(notes.cells.editingId, null); assert.deepEqual(JSON.parse(notes.noteStorage["wb-sticky-notes-v1"]), []);
    }
    const inflight = harness(paths[0]); inflight.render("en"); await inflight.flush(); inflight.fail("exportAllData");
    const exportPending = inflight.render("en").button("Download").props.onClick();
    inflight.render("ar"); await inflight.flush(); await exportPending;
    assert.ok(inflight.notifications.some(([, message]) => message === translate("ar", "Failed to export data"))); assert.equal(inflight.downloads.length, 0);
    console.log("Productivity localization: all eight languages, truthful help, exact Unicode task/note data, stable locale transitions without DB operations, real CRUD/archive/trash/export/import handlers, independent multiline CSV parser round-trip and confirmation boundaries pass. Controlled persistence fixtures do not claim browser file delivery.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
