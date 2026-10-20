import type { TranslationColumns } from "./tool-names";

// Hindi, Spanish, French, German, Japanese, Simplified Chinese, Arabic.
// Task data, category names, IDs and exported machine fields remain unchanged.
export const PRODUCTIVITY_TOOL_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Failed to load data from IndexedDB": [
        "IndexedDB से डेटा लोड नहीं हुआ",
        "No se pudieron cargar los datos de IndexedDB",
        "Impossible de charger les données IndexedDB",
        "Daten aus IndexedDB konnten nicht geladen werden",
        "IndexedDBからデータを読み込めませんでした",
        "无法从 IndexedDB 加载数据",
        "تعذر تحميل البيانات من IndexedDB"
    ],
    "Task updated": [
        "कार्य अपडेट हुआ",
        "Tarea actualizada",
        "Tâche mise à jour",
        "Aufgabe aktualisiert",
        "タスクを更新しました",
        "任务已更新",
        "تم تحديث المهمة"
    ],
    "Task added": [
        "कार्य जोड़ा गया",
        "Tarea añadida",
        "Tâche ajoutée",
        "Aufgabe hinzugefügt",
        "タスクを追加しました",
        "任务已添加",
        "تمت إضافة المهمة"
    ],
    "Failed to update status": [
        "स्थिति अपडेट नहीं हुई",
        "No se pudo actualizar el estado",
        "Impossible de modifier l’état",
        "Status konnte nicht aktualisiert werden",
        "状態を更新できませんでした",
        "无法更新状态",
        "تعذر تحديث الحالة"
    ],
    "Task moved to trash": [
        "कार्य कूड़ेदान में भेजा गया",
        "Tarea enviada a la papelera",
        "Tâche déplacée dans la corbeille",
        "Aufgabe in den Papierkorb verschoben",
        "タスクをゴミ箱に移動しました",
        "任务已移至回收站",
        "نُقلت المهمة إلى سلة المهملات"
    ],
    "Failed to delete task": [
        "कार्य हटाया नहीं गया",
        "No se pudo eliminar la tarea",
        "Impossible de supprimer la tâche",
        "Aufgabe konnte nicht gelöscht werden",
        "タスクを削除できませんでした",
        "无法删除任务",
        "تعذر حذف المهمة"
    ],
    "Task restored": [
        "कार्य बहाल हुआ",
        "Tarea restaurada",
        "Tâche restaurée",
        "Aufgabe wiederhergestellt",
        "タスクを復元しました",
        "任务已恢复",
        "تمت استعادة المهمة"
    ],
    "Failed to restore task": [
        "कार्य बहाल नहीं हुआ",
        "No se pudo restaurar la tarea",
        "Impossible de restaurer la tâche",
        "Aufgabe konnte nicht wiederhergestellt werden",
        "タスクを復元できませんでした",
        "无法恢复任务",
        "تعذرت استعادة المهمة"
    ],
    "Task permanently deleted": [
        "कार्य हमेशा के लिए हटा दिया गया",
        "Tarea eliminada definitivamente",
        "Tâche supprimée définitivement",
        "Aufgabe endgültig gelöscht",
        "タスクを完全に削除しました",
        "任务已永久删除",
        "حُذفت المهمة نهائيًا"
    ],
    "Task archived": [
        "कार्य संग्रहित हुआ",
        "Tarea archivada",
        "Tâche archivée",
        "Aufgabe archiviert",
        "タスクをアーカイブしました",
        "任务已归档",
        "تمت أرشفة المهمة"
    ],
    "Failed to archive task": [
        "कार्य संग्रहित नहीं हुआ",
        "No se pudo archivar la tarea",
        "Impossible d’archiver la tâche",
        "Aufgabe konnte nicht archiviert werden",
        "タスクをアーカイブできませんでした",
        "无法归档任务",
        "تعذرت أرشفة المهمة"
    ],
    "Task unarchived": [
        "कार्य संग्रह से निकाला गया",
        "Tarea desarchivada",
        "Tâche désarchivée",
        "Archivierung aufgehoben",
        "タスクのアーカイブを解除しました",
        "任务已取消归档",
        "أُخرجت المهمة من الأرشيف"
    ],
    "Failed to unarchive task": [
        "कार्य संग्रह से नहीं निकला",
        "No se pudo desarchivar la tarea",
        "Impossible de désarchiver la tâche",
        "Archivierung konnte nicht aufgehoben werden",
        "アーカイブを解除できませんでした",
        "无法取消归档任务",
        "تعذر إخراج المهمة من الأرشيف"
    ],
    "Empty Trash?": [
        "कूड़ेदान खाली करें?",
        "¿Vaciar la papelera?",
        "Vider la corbeille ?",
        "Papierkorb leeren?",
        "ゴミ箱を空にしますか？",
        "清空回收站？",
        "إفراغ سلة المهملات؟"
    ],
    "This will permanently delete all items in trash. This action cannot be undone.": [
        "कूड़ेदान की सभी चीज़ें हमेशा के लिए हटेंगी। यह वापस नहीं हो सकता।",
        "Se eliminarán definitivamente todos los elementos de la papelera. No se puede deshacer.",
        "Tous les éléments de la corbeille seront supprimés définitivement. Cette action est irréversible.",
        "Alle Elemente im Papierkorb werden endgültig gelöscht. Dies kann nicht rückgängig gemacht werden.",
        "ゴミ箱内のすべての項目を完全に削除します。元に戻せません。",
        "回收站内的所有项目将永久删除，无法撤销。",
        "ستُحذف جميع عناصر سلة المهملات نهائيًا. لا يمكن التراجع عن ذلك."
    ],
    "Empty Trash": [
        "कूड़ेदान खाली करें",
        "Vaciar papelera",
        "Vider la corbeille",
        "Papierkorb leeren",
        "ゴミ箱を空にする",
        "清空回收站",
        "إفراغ سلة المهملات"
    ],
    "Permanently deleted items: {count}": [
        "हमेशा के लिए हटाई गई चीज़ें: {count}",
        "Elementos eliminados definitivamente: {count}",
        "Éléments supprimés définitivement : {count}",
        "Endgültig gelöschte Elemente: {count}",
        "完全に削除した項目数: {count}",
        "永久删除的项目：{count}",
        "العناصر المحذوفة نهائيًا: {count}"
    ],
    "Failed to empty trash": [
        "कूड़ेदान खाली नहीं हुआ",
        "No se pudo vaciar la papelera",
        "Impossible de vider la corbeille",
        "Papierkorb konnte nicht geleert werden",
        "ゴミ箱を空にできませんでした",
        "无法清空回收站",
        "تعذر إفراغ سلة المهملات"
    ],
    "Updated tasks: {count}": [
        "अपडेट किए गए कार्य: {count}",
        "Tareas actualizadas: {count}",
        "Tâches mises à jour : {count}",
        "Aktualisierte Aufgaben: {count}",
        "更新したタスク数: {count}",
        "更新的任务：{count}",
        "المهام المحدثة: {count}"
    ],
    "Failed to update tasks": [
        "कार्य अपडेट नहीं हुए",
        "No se pudieron actualizar las tareas",
        "Impossible de modifier les tâches",
        "Aufgaben konnten nicht aktualisiert werden",
        "タスクを更新できませんでした",
        "无法更新任务",
        "تعذر تحديث المهام"
    ],
    "Tasks moved to trash: {count}": [
        "कूड़ेदान में भेजे गए कार्य: {count}",
        "Tareas enviadas a la papelera: {count}",
        "Tâches déplacées dans la corbeille : {count}",
        "In den Papierkorb verschobene Aufgaben: {count}",
        "ゴミ箱に移動したタスク数: {count}",
        "移至回收站的任务：{count}",
        "المهام المنقولة إلى سلة المهملات: {count}"
    ],
    "Failed to delete tasks": [
        "कार्य हटाए नहीं गए",
        "No se pudieron eliminar las tareas",
        "Impossible de supprimer les tâches",
        "Aufgaben konnten nicht gelöscht werden",
        "タスクを削除できませんでした",
        "无法删除任务",
        "تعذر حذف المهام"
    ],
    "Archived tasks: {count}": [
        "संग्रहित कार्य: {count}",
        "Tareas archivadas: {count}",
        "Tâches archivées : {count}",
        "Archivierte Aufgaben: {count}",
        "アーカイブしたタスク数: {count}",
        "归档的任务：{count}",
        "المهام المؤرشفة: {count}"
    ],
    "Failed to archive tasks": [
        "कार्य संग्रहित नहीं हुए",
        "No se pudieron archivar las tareas",
        "Impossible d’archiver les tâches",
        "Aufgaben konnten nicht archiviert werden",
        "タスクをアーカイブできませんでした",
        "无法归档任务",
        "تعذرت أرشفة المهام"
    ],
    "Data exported successfully": [
        "डेटा निर्यात किया गया",
        "Datos exportados correctamente",
        "Données exportées",
        "Daten erfolgreich exportiert",
        "データをエクスポートしました",
        "数据已成功导出",
        "تم تصدير البيانات بنجاح"
    ],
    "Failed to export data": [
        "डेटा निर्यात नहीं हुआ",
        "No se pudieron exportar los datos",
        "Impossible d’exporter les données",
        "Daten konnten nicht exportiert werden",
        "データをエクスポートできませんでした",
        "无法导出数据",
        "تعذر تصدير البيانات"
    ],
    "Exported to CSV": [
        "CSV में निर्यात किया गया",
        "Exportado a CSV",
        "Exporté en CSV",
        "Als CSV exportiert",
        "CSVにエクスポートしました",
        "已导出为 CSV",
        "تم التصدير إلى CSV"
    ],
    "Import Data": [
        "डेटा आयात करें",
        "Importar datos",
        "Importer des données",
        "Daten importieren",
        "データをインポート",
        "导入数据",
        "استيراد البيانات"
    ],
    "Backup contains {tasks} tasks and {categories} categories.": [
        "बैकअप में {tasks} कार्य और {categories} श्रेणियाँ हैं।",
        "La copia contiene {tasks} tareas y {categories} categorías.",
        "La sauvegarde contient {tasks} tâches et {categories} catégories.",
        "Die Sicherung enthält {tasks} Aufgaben und {categories} Kategorien.",
        "バックアップにはタスク{tasks}件とカテゴリ{categories}件があります。",
        "备份包含 {tasks} 个任务和 {categories} 个分类。",
        "تحتوي النسخة على {tasks} من المهام و{categories} من الفئات."
    ],
    "How would you like to import?": [
        "कैसे आयात करना चाहेंगे?",
        "¿Cómo quieres importar?",
        "Comment souhaitez-vous importer ?",
        "Wie möchten Sie importieren?",
        "インポート方法を選んでください",
        "请选择导入方式",
        "كيف تريد الاستيراد؟"
    ],
    "Merge with existing": [
        "मौजूदा के साथ मिलाएँ",
        "Combinar con los existentes",
        "Fusionner avec les données existantes",
        "Mit bestehenden Daten zusammenführen",
        "既存データと統合",
        "与现有数据合并",
        "دمج مع البيانات الحالية"
    ],
    "Replace all": [
        "सब बदलें",
        "Reemplazar todo",
        "Tout remplacer",
        "Alles ersetzen",
        "すべて置き換える",
        "全部替换",
        "استبدال الكل"
    ],
    "Imported tasks: {tasks}; categories: {categories}": [
        "आयातित कार्य: {tasks}; श्रेणियाँ: {categories}",
        "Tareas importadas: {tasks}; categorías: {categories}",
        "Tâches importées : {tasks} ; catégories : {categories}",
        "Importierte Aufgaben: {tasks}; Kategorien: {categories}",
        "インポートしたタスク: {tasks}、カテゴリ: {categories}",
        "已导入任务：{tasks}；分类：{categories}",
        "المهام المستوردة: {tasks}؛ الفئات: {categories}"
    ],
    "Are you sure?": [
        "क्या आप निश्चित हैं?",
        "¿Estás seguro?",
        "Confirmer ?",
        "Sind Sie sicher?",
        "よろしいですか？",
        "确定吗？",
        "هل أنت متأكد؟"
    ],
    "This will replace ALL existing data. This cannot be undone.": [
        "सभी मौजूदा डेटा बदल जाएगा। यह वापस नहीं हो सकता।",
        "Se reemplazarán TODOS los datos existentes. No se puede deshacer.",
        "TOUTES les données existantes seront remplacées. Cette action est irréversible.",
        "ALLE vorhandenen Daten werden ersetzt. Dies kann nicht rückgängig gemacht werden.",
        "既存のすべてのデータを置き換えます。元に戻せません。",
        "这将替换所有现有数据，无法撤销。",
        "ستُستبدل جميع البيانات الحالية. لا يمكن التراجع عن ذلك."
    ],
    "Yes, replace everything": [
        "हाँ, सब बदलें",
        "Sí, reemplazar todo",
        "Oui, tout remplacer",
        "Ja, alles ersetzen",
        "はい、すべて置き換える",
        "是，全部替换",
        "نعم، استبدال كل شيء"
    ],
    "Failed to read file. Make sure it's a valid JSON backup file.": [
        "फ़ाइल पढ़ी नहीं गई। मान्य JSON बैकअप फ़ाइल चुनें।",
        "No se pudo leer el archivo. Comprueba que sea una copia JSON válida.",
        "Impossible de lire le fichier. Choisissez une sauvegarde JSON valide.",
        "Datei konnte nicht gelesen werden. Wählen Sie eine gültige JSON-Sicherung.",
        "ファイルを読み取れませんでした。有効なJSONバックアップを選んでください。",
        "无法读取文件，请选择有效的 JSON 备份文件。",
        "تعذرت قراءة الملف. تأكد من أنه نسخة احتياطية صالحة بصيغة JSON."
    ],
    "Category updated": [
        "श्रेणी अपडेट हुई",
        "Categoría actualizada",
        "Catégorie mise à jour",
        "Kategorie aktualisiert",
        "カテゴリを更新しました",
        "分类已更新",
        "تم تحديث الفئة"
    ],
    "Category added": [
        "श्रेणी जोड़ी गई",
        "Categoría añadida",
        "Catégorie ajoutée",
        "Kategorie hinzugefügt",
        "カテゴリを追加しました",
        "分类已添加",
        "تمت إضافة الفئة"
    ],
    "Cannot delete a category used by {count} tasks. Move those tasks to another category first.": [
        "{count} कार्यों की श्रेणी नहीं हटा सकते। पहले उन कार्यों को दूसरी श्रेणी में भेजें।",
        "No se puede eliminar una categoría usada por {count} tareas. Muévelas primero a otra categoría.",
        "Impossible de supprimer une catégorie utilisée par {count} tâches. Déplacez-les d’abord vers une autre catégorie.",
        "Diese Kategorie wird von {count} Aufgaben verwendet. Verschieben Sie diese zuerst in eine andere Kategorie.",
        "{count}件のタスクで使用中のカテゴリは削除できません。先にタスクを別のカテゴリへ移動してください。",
        "该分类被 {count} 个任务使用，无法删除。请先将这些任务移至其他分类。",
        "لا يمكن حذف فئة تستخدمها {count} من المهام. انقل تلك المهام إلى فئة أخرى أولًا."
    ],
    "Category deleted": [
        "श्रेणी हटाई गई",
        "Categoría eliminada",
        "Catégorie supprimée",
        "Kategorie gelöscht",
        "カテゴリを削除しました",
        "分类已删除",
        "تم حذف الفئة"
    ],
    "Failed to delete category": [
        "श्रेणी हटाई नहीं गई",
        "No se pudo eliminar la categoría",
        "Impossible de supprimer la catégorie",
        "Kategorie konnte nicht gelöscht werden",
        "カテゴリを削除できませんでした",
        "无法删除分类",
        "تعذر حذف الفئة"
    ],
    "Failed to update subtask": [
        "उपकार्य अपडेट नहीं हुआ",
        "No se pudo actualizar la subtarea",
        "Impossible de modifier la sous-tâche",
        "Unteraufgabe konnte nicht aktualisiert werden",
        "サブタスクを更新できませんでした",
        "无法更新子任务",
        "تعذر تحديث المهمة الفرعية"
    ],
    "Failed to add subtask": [
        "उपकार्य जोड़ा नहीं गया",
        "No se pudo añadir la subtarea",
        "Impossible d’ajouter la sous-tâche",
        "Unteraufgabe konnte nicht hinzugefügt werden",
        "サブタスクを追加できませんでした",
        "无法添加子任务",
        "تعذرت إضافة المهمة الفرعية"
    ],
    "Failed to delete subtask": [
        "उपकार्य हटाया नहीं गया",
        "No se pudo eliminar la subtarea",
        "Impossible de supprimer la sous-tâche",
        "Unteraufgabe konnte nicht gelöscht werden",
        "サブタスクを削除できませんでした",
        "无法删除子任务",
        "تعذر حذف المهمة الفرعية"
    ],
    "Failed to update settings": [
        "सेटिंग अपडेट नहीं हुई",
        "No se pudo actualizar la configuración",
        "Impossible de modifier les paramètres",
        "Einstellungen konnten nicht aktualisiert werden",
        "設定を更新できませんでした",
        "无法更新设置",
        "تعذر تحديث الإعدادات"
    ],
    "Toggle task completion": [
        "कार्य की पूर्णता बदलें",
        "Alternar finalización de la tarea",
        "Basculer l’achèvement de la tâche",
        "Aufgabenabschluss umschalten",
        "タスクの完了を切り替え",
        "切换任务完成状态",
        "تبديل اكتمال المهمة"
    ],
    "Task": [
        "कार्य",
        "Tarea",
        "Tâche",
        "Aufgabe",
        "タスク",
        "任务",
        "المهمة"
    ],
    "OVERDUE": [
        "समय बीत गया",
        "VENCIDA",
        "EN RETARD",
        "ÜBERFÄLLIG",
        "期限超過",
        "已逾期",
        "متأخرة"
    ],
    "TODAY": [
        "आज",
        "HOY",
        "AUJOURD’HUI",
        "HEUTE",
        "今日",
        "今天",
        "اليوم"
    ],
    "TOMORROW": [
        "कल",
        "MAÑANA",
        "DEMAIN",
        "MORGEN",
        "明日",
        "明天",
        "غدًا"
    ],
    "Category": [
        "श्रेणी",
        "Categoría",
        "Catégorie",
        "Kategorie",
        "カテゴリ",
        "分类",
        "الفئة"
    ],
    "Due": [
        "नियत समय",
        "Vencimiento",
        "Échéance",
        "Fällig",
        "期限",
        "截止时间",
        "الاستحقاق"
    ],
    "Confirm": [
        "पुष्टि करें",
        "Confirmar",
        "Confirmer",
        "Bestätigen",
        "確認",
        "确认",
        "تأكيد"
    ],
    "Permanently delete?": [
        "हमेशा के लिए हटाएँ?",
        "¿Eliminar definitivamente?",
        "Supprimer définitivement ?",
        "Endgültig löschen?",
        "完全に削除しますか？",
        "永久删除？",
        "حذف نهائي؟"
    ],
    "Delete Forever": [
        "हमेशा के लिए हटाएँ",
        "Eliminar definitivamente",
        "Supprimer définitivement",
        "Endgültig löschen",
        "完全に削除",
        "永久删除",
        "حذف نهائي"
    ],
    "Unarchive": [
        "संग्रह से निकालें",
        "Desarchivar",
        "Désarchiver",
        "Archivierung aufheben",
        "アーカイブを解除",
        "取消归档",
        "إخراج من الأرشيف"
    ],
    "Archive": [
        "संग्रहित करें",
        "Archivar",
        "Archiver",
        "Archivieren",
        "アーカイブ",
        "归档",
        "أرشفة"
    ],
    "Move to trash?": [
        "कूड़ेदान में भेजें?",
        "¿Mover a la papelera?",
        "Déplacer dans la corbeille ?",
        "In den Papierkorb verschieben?",
        "ゴミ箱に移動しますか？",
        "移至回收站？",
        "نقل إلى سلة المهملات؟"
    ],
    "Mark as Done": [
        "पूर्ण चिह्नित करें",
        "Marcar como terminada",
        "Marquer comme terminée",
        "Als erledigt markieren",
        "完了にする",
        "标记为已完成",
        "وضع علامة مكتملة"
    ],
    "Mark In Progress": [
        "प्रगति में चिह्नित करें",
        "Marcar en curso",
        "Marquer en cours",
        "Als in Bearbeitung markieren",
        "進行中にする",
        "标记为进行中",
        "وضع علامة قيد التنفيذ"
    ],
    "Mark as To Do": [
        "करना है चिह्नित करें",
        "Marcar como pendiente",
        "Marquer à faire",
        "Als offen markieren",
        "未着手にする",
        "标记为待办",
        "وضع علامة للإنجاز"
    ],
    "Mark as Blocked": [
        "अवरुद्ध चिह्नित करें",
        "Marcar como bloqueada",
        "Marquer comme bloquée",
        "Als blockiert markieren",
        "ブロック中にする",
        "标记为受阻",
        "وضع علامة محظورة"
    ],
    "Archive Selected": [
        "चयनित संग्रहित करें",
        "Archivar selección",
        "Archiver la sélection",
        "Auswahl archivieren",
        "選択した項目をアーカイブ",
        "归档所选项",
        "أرشفة المحدد"
    ],
    "Delete Selected": [
        "चयनित हटाएँ",
        "Eliminar selección",
        "Supprimer la sélection",
        "Auswahl löschen",
        "選択した項目を削除",
        "删除所选项",
        "حذف المحدد"
    ],
    "Manage tasks, subtasks, categories and backups in your current workspace": [
        "मौजूदा कार्यक्षेत्र में कार्य, उपकार्य, श्रेणियाँ और बैकअप सँभालें",
        "Gestiona tareas, subtareas, categorías y copias en tu espacio actual",
        "Gérez les tâches, sous-tâches, catégories et sauvegardes de votre espace actuel",
        "Aufgaben, Unteraufgaben, Kategorien und Sicherungen im aktuellen Arbeitsbereich verwalten",
        "現在のワークスペースのタスク、サブタスク、カテゴリ、バックアップを管理",
        "管理当前工作区的任务、子任务、分类和备份",
        "إدارة المهام والمهام الفرعية والفئات والنسخ الاحتياطية في مساحة العمل الحالية"
    ],
    "Browser Not Supported": [
        "ब्राउज़र समर्थित नहीं है",
        "Navegador no compatible",
        "Navigateur non pris en charge",
        "Browser nicht unterstützt",
        "非対応のブラウザー",
        "不支持此浏览器",
        "المتصفح غير مدعوم"
    ],
    "Please use a modern browser like:": [
        "आधुनिक ब्राउज़र इस्तेमाल करें, जैसे:",
        "Usa un navegador moderno como:",
        "Utilisez un navigateur récent comme :",
        "Verwenden Sie einen aktuellen Browser wie:",
        "次のような最新のブラウザーを使用してください:",
        "请使用现代浏览器，例如：",
        "استخدم متصفحًا حديثًا مثل:"
    ],
    "Chrome, Firefox, Safari, or Edge": [
        "Chrome, Firefox, Safari या Edge",
        "Chrome, Firefox, Safari o Edge",
        "Chrome, Firefox, Safari ou Edge",
        "Chrome, Firefox, Safari oder Edge",
        "Chrome、Firefox、Safari、Edge",
        "Chrome、Firefox、Safari 或 Edge",
        "Chrome أو Firefox أو Safari أو Edge"
    ],
    "If you are in private/incognito mode, try using a regular window.": [
        "निजी/गुप्त मोड में हैं तो सामान्य विंडो आज़माएँ।",
        "Si estás en modo privado o incógnito, prueba una ventana normal.",
        "En navigation privée, essayez une fenêtre normale.",
        "Versuchen Sie im privaten Modus ein normales Fenster.",
        "プライベートモードの場合は通常のウィンドウをお試しください。",
        "如果正在使用隐私模式，请尝试普通窗口。",
        "إذا كنت في وضع التصفح الخاص، فجرّب نافذة عادية."
    ],
    "A local task manager with categories, priorities, due dates, subtasks, archive, trash and JSON backup import/export. Tasks are stored in this workspace using IndexedDB.": [
        "श्रेणियों, प्राथमिकताओं, नियत समय, उपकार्यों, संग्रह, कूड़ेदान और JSON बैकअप आयात/निर्यात वाला स्थानीय कार्य प्रबंधक। कार्य इस कार्यक्षेत्र में IndexedDB में रखे जाते हैं।",
        "Gestor local con categorías, prioridades, vencimientos, subtareas, archivo, papelera e importación/exportación JSON. Las tareas se guardan en este espacio con IndexedDB.",
        "Gestionnaire local avec catégories, priorités, échéances, sous-tâches, archives, corbeille et sauvegardes JSON. Les tâches sont stockées dans cet espace avec IndexedDB.",
        "Lokale Aufgabenverwaltung mit Kategorien, Prioritäten, Terminen, Unteraufgaben, Archiv, Papierkorb und JSON-Sicherungen. Aufgaben werden in diesem Arbeitsbereich in IndexedDB gespeichert.",
        "カテゴリ、優先度、期限、サブタスク、アーカイブ、ゴミ箱、JSONバックアップ入出力を備えたローカルのタスク管理です。このワークスペースのIndexedDBに保存します。",
        "本地任务管理器，支持分类、优先级、截止时间、子任务、归档、回收站及 JSON 备份导入导出。任务通过 IndexedDB 保存在此工作区中。",
        "مدير مهام محلي بالفئات والأولويات والمواعيد والمهام الفرعية والأرشيف وسلة المهملات ونسخ JSON. تُخزن المهام في مساحة العمل هذه باستخدام IndexedDB."
    ],
    "Plan tasks without an account or cloud sync. Task data stays in this browser; export a JSON backup before clearing site storage.": [
        "बिना खाते या क्लाउड सिंक के कार्य बनाएँ। डेटा इसी ब्राउज़र में रहता है; साइट स्टोरेज साफ करने से पहले JSON बैकअप निर्यात करें।",
        "Planifica sin cuenta ni sincronización en la nube. Los datos quedan en este navegador; exporta una copia JSON antes de borrar el almacenamiento del sitio.",
        "Planifiez sans compte ni synchronisation cloud. Les données restent dans ce navigateur ; exportez une sauvegarde JSON avant d’effacer le stockage du site.",
        "Planen Sie ohne Konto oder Cloud-Synchronisierung. Die Daten bleiben in diesem Browser; exportieren Sie vor dem Löschen des Website-Speichers eine JSON-Sicherung.",
        "アカウントやクラウド同期なしでタスクを計画できます。データはこのブラウザーに保存されます。サイトデータの消去前にJSONバックアップを出力してください。",
        "无需账户或云同步即可规划任务。数据保存在此浏览器中；清除网站存储前，请导出 JSON 备份。",
        "خطط للمهام دون حساب أو مزامنة سحابية. تبقى البيانات في هذا المتصفح؛ صدّر نسخة JSON قبل مسح تخزين الموقع."
    ],
    "Create categories with custom emojis": [
        "पसंदीदा इमोजी वाली श्रेणियाँ बनाएँ",
        "Crea categorías con emojis propios",
        "Créez des catégories avec des emojis personnalisés",
        "Kategorien mit eigenen Emojis erstellen",
        "好きな絵文字でカテゴリを作成",
        "使用自定义表情符号创建分类",
        "أنشئ فئات برموز تعبيرية مخصصة"
    ],
    "Add tasks with title, description, priority, and due date": [
        "शीर्षक, विवरण, प्राथमिकता और नियत समय के साथ कार्य जोड़ें",
        "Añade tareas con título, descripción, prioridad y vencimiento",
        "Ajoutez des tâches avec titre, description, priorité et échéance",
        "Aufgaben mit Titel, Beschreibung, Priorität und Termin hinzufügen",
        "タイトル、説明、優先度、期限を付けてタスクを追加",
        "添加带标题、描述、优先级和截止时间的任务",
        "أضف مهام بعنوان ووصف وأولوية وموعد استحقاق"
    ],
    "Use column headers to sort tasks and filters to narrow the list": [
        "स्तंभ शीर्षकों से क्रम बदलें और फ़िल्टर से सूची सीमित करें",
        "Ordena con las cabeceras y reduce la lista con filtros",
        "Triez avec les en-têtes et affinez la liste avec les filtres",
        "Aufgaben über Spaltenüberschriften sortieren und mit Filtern eingrenzen",
        "列見出しで並べ替え、フィルターで絞り込み",
        "使用列标题排序，用筛选器缩小列表范围",
        "استخدم عناوين الأعمدة للترتيب والمرشحات لتضييق القائمة"
    ],
    "Export data as JSON for backup": [
        "बैकअप के लिए JSON निर्यात करें",
        "Exporta los datos como JSON para una copia",
        "Exportez les données en JSON pour les sauvegarder",
        "Daten zur Sicherung als JSON exportieren",
        "バックアップ用にJSONを出力",
        "将数据导出为 JSON 备份",
        "صدّر البيانات بصيغة JSON للنسخ الاحتياطي"
    ],
    "Data persists in IndexedDB (browser storage)": [
        "डेटा IndexedDB (ब्राउज़र स्टोरेज) में रहता है",
        "Los datos persisten en IndexedDB (almacenamiento del navegador)",
        "Les données persistent dans IndexedDB (stockage du navigateur)",
        "Daten bleiben in IndexedDB (Browserspeicher) erhalten",
        "データはIndexedDB（ブラウザーストレージ）に保存されます",
        "数据保存在 IndexedDB（浏览器存储）中",
        "تُحفظ البيانات في IndexedDB (تخزين المتصفح)"
    ],
    "Use categories to organize different projects": [
        "अलग परियोजनाओं को श्रेणियों से व्यवस्थित करें",
        "Organiza distintos proyectos con categorías",
        "Organisez différents projets avec des catégories",
        "Verschiedene Projekte mit Kategorien ordnen",
        "カテゴリでプロジェクトを整理",
        "使用分类组织不同项目",
        "استخدم الفئات لتنظيم المشاريع المختلفة"
    ],
    "Restore tasks from Trash, or permanently delete them after confirmation": [
        "कूड़ेदान से कार्य बहाल करें, या पुष्टि के बाद हमेशा के लिए हटाएँ",
        "Restaura tareas de la papelera o elimínalas definitivamente tras confirmar",
        "Restaurez les tâches de la corbeille ou supprimez-les définitivement après confirmation",
        "Aufgaben aus dem Papierkorb wiederherstellen oder nach Bestätigung endgültig löschen",
        "ゴミ箱から復元するか、確認後に完全削除できます",
        "从回收站恢复任务，或确认后永久删除",
        "استعد المهام من سلة المهملات أو احذفها نهائيًا بعد التأكيد"
    ],
    "Export regularly for backup": [
        "नियमित बैकअप निर्यात करें",
        "Exporta copias con regularidad",
        "Exportez régulièrement une sauvegarde",
        "Regelmäßig Sicherungen exportieren",
        "定期的にバックアップを出力",
        "定期导出备份",
        "صدّر نسخًا احتياطية بانتظام"
    ],
    "Personal task management without cloud sync": [
        "क्लाउड सिंक के बिना निजी कार्य प्रबंधन",
        "Gestión personal sin sincronización en la nube",
        "Gestion personnelle sans synchronisation cloud",
        "Persönliche Aufgabenverwaltung ohne Cloud-Synchronisierung",
        "クラウド同期なしの個人タスク管理",
        "无需云同步的个人任务管理",
        "إدارة المهام الشخصية دون مزامنة سحابية"
    ],
    "Privacy-focused note taking": [
        "निजता केंद्रित नोट लेखन",
        "Notas centradas en la privacidad",
        "Prise de notes axée sur la confidentialité",
        "Datenschutzorientierte Notizen",
        "プライバシーを重視したメモ",
        "注重隐私的笔记",
        "تدوين ملاحظات يراعي الخصوصية"
    ],
    "Project planning and tracking": [
        "परियोजना योजना और निगरानी",
        "Planificación y seguimiento de proyectos",
        "Planification et suivi de projets",
        "Projektplanung und -verfolgung",
        "プロジェクトの計画と追跡",
        "项目规划与跟踪",
        "تخطيط المشاريع ومتابعتها"
    ],
    "Developer workflow management": [
        "डेवलपर कार्यप्रवाह प्रबंधन",
        "Gestión del flujo de desarrollo",
        "Gestion des processus de développement",
        "Entwicklungsabläufe verwalten",
        "開発ワークフローの管理",
        "开发者工作流管理",
        "إدارة سير عمل المطورين"
    ],
    "Import JSON Backup": [
        "JSON बैकअप आयात करें",
        "Importar copia JSON",
        "Importer une sauvegarde JSON",
        "JSON-Sicherung importieren",
        "JSONバックアップをインポート",
        "导入 JSON 备份",
        "استيراد نسخة JSON"
    ],
    "Done": [
        "पूर्ण",
        "Terminada",
        "Terminée",
        "Erledigt",
        "完了",
        "已完成",
        "مكتملة"
    ],
    "In Progress": [
        "प्रगति में",
        "En curso",
        "En cours",
        "In Bearbeitung",
        "進行中",
        "进行中",
        "قيد التنفيذ"
    ],
    "Overdue": [
        "समय बीत गया",
        "Vencida",
        "En retard",
        "Überfällig",
        "期限超過",
        "已逾期",
        "متأخرة"
    ],
    "Due Today": [
        "आज नियत",
        "Vence hoy",
        "À faire aujourd’hui",
        "Heute fällig",
        "本日期限",
        "今天到期",
        "تستحق اليوم"
    ],
    "Completion": [
        "पूर्णता",
        "Finalización",
        "Achèvement",
        "Fortschritt",
        "完了率",
        "完成率",
        "الإنجاز"
    ],
    "Archived": [
        "संग्रहित",
        "Archivadas",
        "Archivées",
        "Archiviert",
        "アーカイブ済み",
        "已归档",
        "مؤرشفة"
    ],
    "Trash": [
        "कूड़ेदान",
        "Papelera",
        "Corbeille",
        "Papierkorb",
        "ゴミ箱",
        "回收站",
        "سلة المهملات"
    ],
    "Archived: {count}": [
        "संग्रहित: {count}",
        "Archivadas: {count}",
        "Archivées : {count}",
        "Archiviert: {count}",
        "アーカイブ済み: {count}",
        "已归档：{count}",
        "مؤرشفة: {count}"
    ],
    "Trash: {count}": [
        "कूड़ेदान: {count}",
        "Papelera: {count}",
        "Corbeille : {count}",
        "Papierkorb: {count}",
        "ゴミ箱: {count}",
        "回收站：{count}",
        "سلة المهملات: {count}"
    ],
    "Manage Categories": [
        "श्रेणियाँ सँभालें",
        "Gestionar categorías",
        "Gérer les catégories",
        "Kategorien verwalten",
        "カテゴリを管理",
        "管理分类",
        "إدارة الفئات"
    ],
    "Categories": [
        "श्रेणियाँ",
        "Categorías",
        "Catégories",
        "Kategorien",
        "カテゴリ",
        "分类",
        "الفئات"
    ],
    "Add Task": [
        "कार्य जोड़ें",
        "Añadir tarea",
        "Ajouter une tâche",
        "Aufgabe hinzufügen",
        "タスクを追加",
        "添加任务",
        "إضافة مهمة"
    ],
    "Search tasks...": [
        "कार्य खोजें...",
        "Buscar tareas...",
        "Rechercher des tâches…",
        "Aufgaben suchen…",
        "タスクを検索…",
        "搜索任务…",
        "البحث في المهام…"
    ],
    "Choose an option": [
        "विकल्प चुनें",
        "Elegir una opción",
        "Choisir une option",
        "Option auswählen",
        "オプションを選択",
        "选择一个选项",
        "اختيار خيار"
    ],
    "All Status": [
        "सभी स्थितियाँ",
        "Todos los estados",
        "Tous les états",
        "Alle Status",
        "すべての状態",
        "所有状态",
        "جميع الحالات"
    ],
    "All Categories": [
        "सभी श्रेणियाँ",
        "Todas las categorías",
        "Toutes les catégories",
        "Alle Kategorien",
        "すべてのカテゴリ",
        "所有分类",
        "جميع الفئات"
    ],
    "All Priorities": [
        "सभी प्राथमिकताएँ",
        "Todas las prioridades",
        "Toutes les priorités",
        "Alle Prioritäten",
        "すべての優先度",
        "所有优先级",
        "جميع الأولويات"
    ],
    "Tags": [
        "टैग",
        "Etiquetas",
        "Étiquettes",
        "Tags",
        "タグ",
        "标签",
        "الوسوم"
    ],
    "Bulk Actions": [
        "एक साथ कार्रवाइयाँ",
        "Acciones en lote",
        "Actions groupées",
        "Stapelaktionen",
        "一括操作",
        "批量操作",
        "إجراءات جماعية"
    ],
    "Export JSON (Full Backup)": [
        "JSON निर्यात (पूरा बैकअप)",
        "Exportar JSON (copia completa)",
        "Exporter JSON (sauvegarde complète)",
        "JSON exportieren (vollständige Sicherung)",
        "JSON出力（完全バックアップ）",
        "导出 JSON（完整备份）",
        "تصدير JSON (نسخة كاملة)"
    ],
    "Export CSV": [
        "CSV निर्यात करें",
        "Exportar CSV",
        "Exporter en CSV",
        "CSV exportieren",
        "CSVを出力",
        "导出 CSV",
        "تصدير CSV"
    ],
    "Tasks: {count}": [
        "कार्य: {count}",
        "Tareas: {count}",
        "Tâches : {count}",
        "Aufgaben: {count}",
        "タスク: {count}",
        "任务：{count}",
        "المهام: {count}"
    ],
    "Trash is empty": [
        "कूड़ेदान खाली है",
        "La papelera está vacía",
        "La corbeille est vide",
        "Der Papierkorb ist leer",
        "ゴミ箱は空です",
        "回收站为空",
        "سلة المهملات فارغة"
    ],
    "No archived tasks": [
        "कोई संग्रहित कार्य नहीं",
        "No hay tareas archivadas",
        "Aucune tâche archivée",
        "Keine archivierten Aufgaben",
        "アーカイブ済みのタスクはありません",
        "没有归档任务",
        "لا توجد مهام مؤرشفة"
    ],
    "No tasks match your filters": [
        "फ़िल्टर से कोई कार्य नहीं मिला",
        "Ninguna tarea coincide con los filtros",
        "Aucune tâche ne correspond aux filtres",
        "Keine Aufgaben entsprechen den Filtern",
        "フィルターに一致するタスクはありません",
        "没有符合筛选条件的任务",
        "لا توجد مهام تطابق المرشحات"
    ],
    "No tasks yet. Click 'Add Task' to create one!": [
        "अभी कोई कार्य नहीं। बनाने के लिए 'कार्य जोड़ें' चुनें।",
        "Aún no hay tareas. Pulsa «Añadir tarea» para crear una.",
        "Aucune tâche. Cliquez sur « Ajouter une tâche » pour commencer.",
        "Noch keine Aufgaben. Klicken Sie zum Erstellen auf „Aufgabe hinzufügen“.",
        "タスクはまだありません。「タスクを追加」で作成してください。",
        "暂无任务。点击“添加任务”创建。",
        "لا توجد مهام بعد. انقر «إضافة مهمة» لإنشاء واحدة."
    ],
    "Edit Task": [
        "कार्य संपादित करें",
        "Editar tarea",
        "Modifier la tâche",
        "Aufgabe bearbeiten",
        "タスクを編集",
        "编辑任务",
        "تعديل المهمة"
    ],
    "Add New Task": [
        "नया कार्य जोड़ें",
        "Añadir nueva tarea",
        "Ajouter une tâche",
        "Neue Aufgabe hinzufügen",
        "新しいタスクを追加",
        "添加新任务",
        "إضافة مهمة جديدة"
    ],
    "Update": [
        "अपडेट करें",
        "Actualizar",
        "Mettre à jour",
        "Aktualisieren",
        "更新",
        "更新",
        "تحديث"
    ],
    "Add": [
        "जोड़ें",
        "Añadir",
        "Ajouter",
        "Hinzufügen",
        "追加",
        "添加",
        "إضافة"
    ],
    "Task Title": [
        "कार्य शीर्षक",
        "Título de la tarea",
        "Titre de la tâche",
        "Aufgabentitel",
        "タスクのタイトル",
        "任务标题",
        "عنوان المهمة"
    ],
    "Please enter a title": [
        "शीर्षक दर्ज करें",
        "Introduce un título",
        "Saisissez un titre",
        "Geben Sie einen Titel ein",
        "タイトルを入力してください",
        "请输入标题",
        "أدخل عنوانًا"
    ],
    "What needs to be done?": [
        "क्या करना है?",
        "¿Qué hay que hacer?",
        "Que faut-il faire ?",
        "Was ist zu erledigen?",
        "何をしますか？",
        "需要做什么？",
        "ما الذي يجب إنجازه؟"
    ],
    "Add more details...": [
        "अधिक जानकारी जोड़ें...",
        "Añadir más detalles...",
        "Ajouter des détails…",
        "Weitere Details hinzufügen…",
        "詳細を追加…",
        "添加更多详细信息…",
        "إضافة مزيد من التفاصيل…"
    ],
    "Due Date": [
        "नियत तारीख",
        "Fecha límite",
        "Date d’échéance",
        "Fälligkeitsdatum",
        "期限",
        "截止日期",
        "تاريخ الاستحقاق"
    ],
    "Estimated Hours": [
        "अनुमानित घंटे",
        "Horas estimadas",
        "Heures estimées",
        "Geschätzte Stunden",
        "予定時間",
        "预计小时数",
        "الساعات المقدرة"
    ],
    "hrs": [
        "घंटे",
        "h",
        "h",
        "Std.",
        "時間",
        "小时",
        "ساعة"
    ],
    "Actual Hours": [
        "वास्तविक घंटे",
        "Horas reales",
        "Heures réelles",
        "Tatsächliche Stunden",
        "実績時間",
        "实际小时数",
        "الساعات الفعلية"
    ],
    "Add tags (press Enter)": [
        "टैग जोड़ें (Enter दबाएँ)",
        "Añadir etiquetas (pulsa Enter)",
        "Ajouter des étiquettes (Entrée)",
        "Tags hinzufügen (Enter drücken)",
        "タグを追加（Enterで確定）",
        "添加标签（按 Enter）",
        "أضف وسومًا (اضغط Enter)"
    ],
    "Additional notes...": [
        "अतिरिक्त नोट्स...",
        "Notas adicionales...",
        "Notes supplémentaires…",
        "Zusätzliche Notizen…",
        "追加のメモ…",
        "附加备注…",
        "ملاحظات إضافية…"
    ],
    "Created:": [
        "बनाया गया:",
        "Creada:",
        "Création :",
        "Erstellt:",
        "作成日時:",
        "创建时间：",
        "تاريخ الإنشاء:"
    ],
    "Due:": [
        "नियत:",
        "Vencimiento:",
        "Échéance :",
        "Fällig:",
        "期限:",
        "截止时间：",
        "الاستحقاق:"
    ],
    "Completed:": [
        "पूर्ण हुआ:",
        "Completada:",
        "Terminée le :",
        "Abgeschlossen:",
        "完了日時:",
        "完成时间：",
        "تاريخ الإكمال:"
    ],
    "Hours:": [
        "घंटे:",
        "Horas:",
        "Heures :",
        "Stunden:",
        "時間:",
        "小时数：",
        "الساعات:"
    ],
    "Estimated: {estimated} h / Actual: {actual} h": [
        "अनुमानित: {estimated} घंटे / वास्तविक: {actual} घंटे",
        "Estimadas: {estimated} h / Reales: {actual} h",
        "Estimées : {estimated} h / Réelles : {actual} h",
        "Geschätzt: {estimated} Std. / Tatsächlich: {actual} Std.",
        "予定: {estimated}時間 / 実績: {actual}時間",
        "预计：{estimated} 小时 / 实际：{actual} 小时",
        "المقدرة: {estimated} ساعة / الفعلية: {actual} ساعة"
    ],
    "Tags:": [
        "टैग:",
        "Etiquetas:",
        "Étiquettes :",
        "Tags:",
        "タグ:",
        "标签：",
        "الوسوم:"
    ],
    "Subtasks": [
        "उपकार्य",
        "Subtareas",
        "Sous-tâches",
        "Unteraufgaben",
        "サブタスク",
        "子任务",
        "المهام الفرعية"
    ],
    "Default Category": [
        "डिफ़ॉल्ट श्रेणी",
        "Categoría predeterminada",
        "Catégorie par défaut",
        "Standardkategorie",
        "既定のカテゴリ",
        "默认分类",
        "الفئة الافتراضية"
    ],
    "Default Priority": [
        "डिफ़ॉल्ट प्राथमिकता",
        "Prioridad predeterminada",
        "Priorité par défaut",
        "Standardpriorität",
        "既定の優先度",
        "默认优先级",
        "الأولوية الافتراضية"
    ],
    "Database Info": [
        "डेटाबेस जानकारी",
        "Información de la base",
        "Informations de la base",
        "Datenbankinformationen",
        "データベース情報",
        "数据库信息",
        "معلومات قاعدة البيانات"
    ],
    "Total Tasks:": [
        "कुल कार्य:",
        "Total de tareas:",
        "Total des tâches :",
        "Aufgaben insgesamt:",
        "タスク総数:",
        "任务总数：",
        "إجمالي المهام:"
    ],
    "Categories:": [
        "श्रेणियाँ:",
        "Categorías:",
        "Catégories :",
        "Kategorien:",
        "カテゴリ:",
        "分类：",
        "الفئات:"
    ],
    "Last Export:": [
        "अंतिम निर्यात:",
        "Última exportación:",
        "Dernier export :",
        "Letzter Export:",
        "最終エクスポート:",
        "上次导出：",
        "آخر تصدير:"
    ],
    "Never": [
        "कभी नहीं",
        "Nunca",
        "Jamais",
        "Nie",
        "なし",
        "从未",
        "أبدًا"
    ],
    "Data Storage": [
        "डेटा भंडारण",
        "Almacenamiento de datos",
        "Stockage des données",
        "Datenspeicherung",
        "データ保存",
        "数据存储",
        "تخزين البيانات"
    ],
    "All data is stored locally in your browser using IndexedDB. Export regularly to backup your data.": [
        "सारा डेटा ब्राउज़र में IndexedDB में रखा जाता है। नियमित बैकअप निर्यात करें।",
        "Todos los datos se guardan localmente en IndexedDB. Exporta copias de seguridad con regularidad.",
        "Les données sont stockées localement dans IndexedDB. Exportez régulièrement une sauvegarde.",
        "Alle Daten werden lokal im Browser in IndexedDB gespeichert. Exportieren Sie regelmäßig Sicherungen.",
        "すべてのデータはブラウザー内のIndexedDBに保存されます。定期的にバックアップを出力してください。",
        "所有数据都通过 IndexedDB 保存在浏览器本地。请定期导出备份。",
        "تُخزن جميع البيانات محليًا في متصفحك باستخدام IndexedDB. صدّر نسخًا احتياطية بانتظام."
    ],
    "Edit Category": [
        "श्रेणी संपादित करें",
        "Editar categoría",
        "Modifier la catégorie",
        "Kategorie bearbeiten",
        "カテゴリを編集",
        "编辑分类",
        "تعديل الفئة"
    ],
    "New Category": [
        "नई श्रेणी",
        "Nueva categoría",
        "Nouvelle catégorie",
        "Neue Kategorie",
        "新しいカテゴリ",
        "新分类",
        "فئة جديدة"
    ],
    "Enter a category name": [
        "श्रेणी का नाम दर्ज करें",
        "Introduce un nombre de categoría",
        "Saisissez un nom de catégorie",
        "Kategorienamen eingeben",
        "カテゴリ名を入力してください",
        "请输入分类名称",
        "أدخل اسم الفئة"
    ],
    "Category name": [
        "श्रेणी का नाम",
        "Nombre de categoría",
        "Nom de la catégorie",
        "Kategoriename",
        "カテゴリ名",
        "分类名称",
        "اسم الفئة"
    ],
    "Icon (emoji)": [
        "आइकन (इमोजी)",
        "Icono (emoji)",
        "Icône (emoji)",
        "Symbol (Emoji)",
        "アイコン（絵文字）",
        "图标（表情符号）",
        "الأيقونة (رمز تعبيري)"
    ],
    "Click to choose emoji": [
        "इमोजी चुनने के लिए क्लिक करें",
        "Pulsa para elegir un emoji",
        "Cliquez pour choisir un emoji",
        "Klicken, um ein Emoji auszuwählen",
        "クリックして絵文字を選択",
        "点击选择表情符号",
        "انقر لاختيار رمز تعبيري"
    ],
    "Color": [
        "रंग",
        "Color",
        "Couleur",
        "Farbe",
        "色",
        "颜色",
        "اللون"
    ],
    "Delete category?": [
        "श्रेणी हटाएँ?",
        "¿Eliminar categoría?",
        "Supprimer la catégorie ?",
        "Kategorie löschen?",
        "カテゴリを削除しますか？",
        "删除分类？",
        "حذف الفئة؟"
    ],
    "Choose Icon": [
        "आइकन चुनें",
        "Elegir icono",
        "Choisir une icône",
        "Symbol auswählen",
        "アイコンを選択",
        "选择图标",
        "اختيار أيقونة"
    ],
    "Select": [
        "चुनें",
        "Seleccionar",
        "Sélectionner",
        "Auswählen",
        "選択",
        "选择",
        "اختيار"
    ],
    "Search emojis...": [
        "इमोजी खोजें...",
        "Buscar emojis...",
        "Rechercher des emojis…",
        "Emojis suchen…",
        "絵文字を検索…",
        "搜索表情符号…",
        "البحث عن رموز تعبيرية…"
    ],
    "Selected Icon": [
        "चयनित आइकन",
        "Icono seleccionado",
        "Icône sélectionnée",
        "Ausgewähltes Symbol",
        "選択したアイコン",
        "已选图标",
        "الأيقونة المحددة"
    ],
    "Toggle subtask completion": [
        "उपकार्य की पूर्णता बदलें",
        "Alternar finalización de la subtarea",
        "Basculer l’achèvement de la sous-tâche",
        "Unteraufgabenabschluss umschalten",
        "サブタスクの完了を切り替え",
        "切换子任务完成状态",
        "تبديل اكتمال المهمة الفرعية"
    ],
    "Add subtask...": [
        "उपकार्य जोड़ें...",
        "Añadir subtarea...",
        "Ajouter une sous-tâche…",
        "Unteraufgabe hinzufügen…",
        "サブタスクを追加…",
        "添加子任务…",
        "إضافة مهمة فرعية…"
    ],
    "New Note": [
        "नया नोट",
        "Nueva nota",
        "Nouvelle note",
        "Neue Notiz",
        "新しいメモ",
        "新笔记",
        "ملاحظة جديدة"
    ],
    "Create, organize, and persist colorful sticky notes. Notes auto-save to your browser's localStorage — no account needed.": [
        "रंगीन नोट बनाएँ और व्यवस्थित करें। नोट ब्राउज़र के localStorage में स्वतः सहेजते हैं — खाता नहीं चाहिए।",
        "Crea y organiza notas de colores. Se guardan automáticamente en localStorage, sin cuenta.",
        "Créez et organisez des notes colorées. Elles s’enregistrent automatiquement dans localStorage, sans compte.",
        "Farbige Notizen erstellen und ordnen. Sie werden automatisch im localStorage des Browsers gespeichert, ohne Konto.",
        "色付きのメモを作成して整理できます。ブラウザーのlocalStorageに自動保存され、アカウントは不要です。",
        "创建和整理彩色便签。笔记自动保存在浏览器 localStorage 中，无需账户。",
        "أنشئ ملاحظات ملونة ونظّمها. تُحفظ تلقائيًا في localStorage بمتصفحك، دون حساب."
    ],
    "A digital sticky notes board that lives entirely in your browser. All notes are stored in localStorage — no server, no account, no sync required.": [
        "पूरी तरह ब्राउज़र में चलने वाला नोट बोर्ड। सभी नोट localStorage में हैं — सर्वर, खाता या सिंक नहीं चाहिए।",
        "Un tablero de notas en tu navegador. Todo se guarda en localStorage, sin servidor, cuenta ni sincronización.",
        "Un tableau de notes dans votre navigateur. Tout est stocké dans localStorage, sans serveur, compte ni synchronisation.",
        "Eine Notizwand im Browser. Alle Notizen bleiben im localStorage, ohne Server, Konto oder Synchronisierung.",
        "ブラウザー内で動く付箋ボードです。すべてのメモはlocalStorageに保存され、サーバー、アカウント、同期は不要です。",
        "完全在浏览器内运行的数字便签板。笔记均保存在 localStorage 中，无需服务器、账户或同步。",
        "لوحة ملاحظات تعمل بالكامل في متصفحك. تُخزن جميع الملاحظات في localStorage دون خادم أو حساب أو مزامنة."
    ],
    "Keep reminders and non-sensitive snippets near your tools. Notes are not encrypted; do not store API keys, passwords or other secrets here.": [
        "रिमाइंडर और गैर-संवेदनशील स्निपेट पास रखें। नोट एन्क्रिप्टेड नहीं हैं; यहाँ API कुंजियाँ, पासवर्ड या रहस्य न रखें।",
        "Guarda recordatorios y fragmentos no sensibles. Las notas no están cifradas; no guardes claves API, contraseñas ni secretos.",
        "Gardez des rappels et extraits non sensibles à portée de main. Les notes ne sont pas chiffrées ; n’y stockez ni clés API, ni mots de passe, ni secrets.",
        "Erinnerungen und unkritische Ausschnitte griffbereit halten. Notizen sind nicht verschlüsselt; speichern Sie hier keine API-Schlüssel, Passwörter oder andere Geheimnisse.",
        "リマインダーや機密性のないスニペットを保存できます。メモは暗号化されません。APIキー、パスワードなどの秘密情報は保存しないでください。",
        "在工具旁保存提醒和非敏感片段。笔记未加密；请勿在此存储 API 密钥、密码或其他机密信息。",
        "احتفظ بالتذكيرات والمقتطفات غير الحساسة قرب أدواتك. الملاحظات غير مشفرة؛ لا تخزن مفاتيح API أو كلمات مرور أو أسرارًا هنا."
    ],
    "Click 'New Note' to create a note.": [
        "नोट बनाने के लिए 'नया नोट' चुनें।",
        "Pulsa «Nueva nota» para crear una nota.",
        "Cliquez sur « Nouvelle note » pour créer une note.",
        "Klicken Sie auf „Neue Notiz“, um eine Notiz zu erstellen.",
        "「新しいメモ」でメモを作成します。",
        "点击“新笔记”创建笔记。",
        "انقر «ملاحظة جديدة» لإنشاء ملاحظة."
    ],
    "Click any note to start editing its title and content.": [
        "शीर्षक और सामग्री बदलने के लिए नोट पर क्लिक करें।",
        "Pulsa una nota para editar su título y contenido.",
        "Cliquez sur une note pour modifier son titre et son contenu.",
        "Klicken Sie auf eine Notiz, um Titel und Inhalt zu bearbeiten.",
        "メモをクリックするとタイトルと内容を編集できます。",
        "点击任意笔记，编辑标题和内容。",
        "انقر أي ملاحظة لتعديل عنوانها ومحتواها."
    ],
    "Pick a color from the swatches at the bottom of each note.": [
        "हर नोट के नीचे रंगों से रंग चुनें।",
        "Elige un color en las muestras al pie de la nota.",
        "Choisissez une couleur en bas de chaque note.",
        "Wählen Sie unten an der Notiz eine Farbe.",
        "メモ下部の色見本から色を選びます。",
        "从每条笔记底部的色块选择颜色。",
        "اختر لونًا من العينات أسفل كل ملاحظة."
    ],
    "Pin important notes to keep them at the top of the board.": [
        "महत्वपूर्ण नोट सबसे ऊपर पिन करें।",
        "Fija las notas importantes para mantenerlas arriba.",
        "Épinglez les notes importantes pour les garder en haut.",
        "Wichtige Notizen anheften, damit sie oben bleiben.",
        "重要なメモをピン留めすると上部に表示されます。",
        "置顶重要笔记，让它们保持在顶部。",
        "ثبّت الملاحظات المهمة لتبقى أعلى اللوحة."
    ],
    "Use the search bar to filter notes by title or content.": [
        "खोज से शीर्षक या सामग्री के अनुसार नोट छाँटें।",
        "Busca notas por título o contenido.",
        "Recherchez des notes par titre ou contenu.",
        "Notizen nach Titel oder Inhalt durchsuchen.",
        "検索欄でタイトルや内容から絞り込めます。",
        "使用搜索栏按标题或内容筛选笔记。",
        "استخدم البحث لتصفية الملاحظات حسب العنوان أو المحتوى."
    ],
    "Notes auto-save on every keystroke — no save button needed.": [
        "हर अक्षर पर नोट स्वतः सहेजते हैं — सहेजें बटन नहीं चाहिए।",
        "Las notas se guardan con cada pulsación, sin botón de guardar.",
        "Les notes s’enregistrent à chaque frappe, sans bouton de sauvegarde.",
        "Notizen werden bei jedem Tastendruck gespeichert, ohne Speichern-Schaltfläche.",
        "入力するたびに自動保存されるため、保存ボタンは不要です。",
        "每次输入都会自动保存笔记，无需保存按钮。",
        "تُحفظ الملاحظات مع كل ضغطة مفتاح، دون زر حفظ."
    ],
    "Pinned notes always stay at the top of the board.": [
        "पिन किए नोट हमेशा सबसे ऊपर रहते हैं।",
        "Las notas fijadas siempre quedan arriba.",
        "Les notes épinglées restent en haut.",
        "Angeheftete Notizen bleiben immer oben.",
        "ピン留めしたメモは常に上部に表示されます。",
        "置顶笔记始终显示在顶部。",
        "تبقى الملاحظات المثبتة أعلى اللوحة دائمًا."
    ],
    "Clearing browser localStorage will erase notes — copy important content elsewhere if needed.": [
        "ब्राउज़र का localStorage साफ करने पर नोट मिटेंगे — ज़रूरी सामग्री कहीं और कॉपी कर लें।",
        "Al borrar localStorage se eliminarán las notas; copia lo importante en otro lugar.",
        "Effacer localStorage supprime les notes ; copiez les contenus importants ailleurs.",
        "Das Löschen von localStorage entfernt alle Notizen; kopieren Sie wichtige Inhalte an einen anderen Ort.",
        "ブラウザーのlocalStorageを消去するとメモも削除されます。重要な内容は別の場所にコピーしてください。",
        "清除浏览器 localStorage 会删除笔记；请将重要内容复制到其他位置。",
        "مسح localStorage في المتصفح يحذف الملاحظات؛ انسخ المحتوى المهم إلى مكان آخر."
    ],
    "Search notes…": [
        "नोट खोजें…",
        "Buscar notas…",
        "Rechercher des notes…",
        "Notizen suchen…",
        "メモを検索…",
        "搜索笔记…",
        "البحث في الملاحظات…"
    ],
    "Notes shown: {visible} / {total}": [
        "दिख रहे नोट: {visible} / {total}",
        "Notas visibles: {visible} / {total}",
        "Notes affichées : {visible} / {total}",
        "Angezeigte Notizen: {visible} / {total}",
        "表示中のメモ: {visible} / {total}",
        "显示的笔记：{visible} / {total}",
        "الملاحظات المعروضة: {visible} / {total}"
    ],
    "No notes match your search": [
        "खोज से कोई नोट नहीं मिला",
        "Ninguna nota coincide con la búsqueda",
        "Aucune note ne correspond à la recherche",
        "Keine Notizen entsprechen der Suche",
        "検索に一致するメモはありません",
        "没有匹配搜索的笔记",
        "لا توجد ملاحظات تطابق البحث"
    ],
    "No notes yet — click 'New Note' to get started": [
        "अभी नोट नहीं — शुरू करने के लिए 'नया नोट' चुनें",
        "Aún no hay notas; pulsa «Nueva nota» para empezar",
        "Aucune note ; cliquez sur « Nouvelle note » pour commencer",
        "Noch keine Notizen; klicken Sie auf „Neue Notiz“",
        "メモはまだありません。「新しいメモ」で始めてください",
        "暂无笔记；点击“新笔记”开始",
        "لا توجد ملاحظات بعد؛ انقر «ملاحظة جديدة» للبدء"
    ],
    "Note title": [
        "नोट का शीर्षक",
        "Título de la nota",
        "Titre de la note",
        "Notiztitel",
        "メモのタイトル",
        "笔记标题",
        "عنوان الملاحظة"
    ],
    "Untitled": [
        "बिना शीर्षक",
        "Sin título",
        "Sans titre",
        "Ohne Titel",
        "無題",
        "无标题",
        "بلا عنوان"
    ],
    "Note content": [
        "नोट की सामग्री",
        "Contenido de la nota",
        "Contenu de la note",
        "Notizinhalt",
        "メモの内容",
        "笔记内容",
        "محتوى الملاحظة"
    ],
    "Write your note…": [
        "अपना नोट लिखें…",
        "Escribe tu nota…",
        "Écrivez votre note…",
        "Schreiben Sie Ihre Notiz…",
        "メモを入力…",
        "输入笔记…",
        "اكتب ملاحظتك…"
    ],
    "Empty note…": [
        "खाली नोट…",
        "Nota vacía…",
        "Note vide…",
        "Leere Notiz…",
        "空のメモ…",
        "空笔记…",
        "ملاحظة فارغة…"
    ],
    "Set note color: {color}": [
        "नोट का रंग चुनें: {color}",
        "Color de la nota: {color}",
        "Couleur de la note : {color}",
        "Notizfarbe setzen: {color}",
        "メモの色を設定: {color}",
        "设置笔记颜色：{color}",
        "تعيين لون الملاحظة: {color}"
    ],
    "Unpin": [
        "पिन हटाएँ",
        "Desfijar",
        "Désépingler",
        "Lösen",
        "ピン留めを解除",
        "取消置顶",
        "إلغاء التثبيت"
    ],
    "Pin to top": [
        "ऊपर पिन करें",
        "Fijar arriba",
        "Épingler en haut",
        "Oben anheften",
        "上部にピン留め",
        "置顶",
        "تثبيت في الأعلى"
    ],
    "Done editing": [
        "संपादन पूरा",
        "Terminar edición",
        "Terminer la modification",
        "Bearbeitung abschließen",
        "編集を完了",
        "完成编辑",
        "إنهاء التعديل"
    ],
    "Delete this note?": [
        "यह नोट हटाएँ?",
        "¿Eliminar esta nota?",
        "Supprimer cette note ?",
        "Diese Notiz löschen?",
        "このメモを削除しますか？",
        "删除此笔记？",
        "حذف هذه الملاحظة؟"
    ],
    "This cannot be undone.": [
        "यह वापस नहीं हो सकता।",
        "No se puede deshacer.",
        "Cette action est irréversible.",
        "Dies kann nicht rückgängig gemacht werden.",
        "元に戻せません。",
        "此操作无法撤销。",
        "لا يمكن التراجع عن ذلك."
    ],
    "Yellow": [
        "पीला",
        "Amarillo",
        "Jaune",
        "Gelb",
        "黄",
        "黄色",
        "أصفر"
    ],
    "Blue": [
        "नीला",
        "Azul",
        "Bleu",
        "Blau",
        "青",
        "蓝色",
        "أزرق"
    ],
    "Green": [
        "हरा",
        "Verde",
        "Vert",
        "Grün",
        "緑",
        "绿色",
        "أخضر"
    ],
    "Pink": [
        "गुलाबी",
        "Rosa",
        "Rose",
        "Rosa",
        "ピンク",
        "粉色",
        "وردي"
    ],
    "Orange": [
        "नारंगी",
        "Naranja",
        "Orange",
        "Orange",
        "オレンジ",
        "橙色",
        "برتقالي"
    ],
    "Purple": [
        "बैंगनी",
        "Morado",
        "Violet",
        "Violett",
        "紫",
        "紫色",
        "بنفسجي"
    ],
    "Teal": [
        "नीलहरित",
        "Verde azulado",
        "Bleu sarcelle",
        "Türkis",
        "ティール",
        "青绿色",
        "أزرق مخضر"
    ],
    "Red": [
        "लाल",
        "Rojo",
        "Rouge",
        "Rot",
        "赤",
        "红色",
        "أحمر"
    ],
    "Objects": [
        "वस्तुएँ",
        "Objetos",
        "Objets",
        "Objekte",
        "物",
        "物品",
        "أشياء"
    ],
    "People & Activities": [
        "लोग और गतिविधियाँ",
        "Personas y actividades",
        "Personnes et activités",
        "Menschen und Aktivitäten",
        "人物と活動",
        "人物与活动",
        "الأشخاص والأنشطة"
    ],
    "Nature & Weather": [
        "प्रकृति और मौसम",
        "Naturaleza y clima",
        "Nature et météo",
        "Natur und Wetter",
        "自然と天気",
        "自然与天气",
        "الطبيعة والطقس"
    ],
    "Food & Drink": [
        "खाना और पेय",
        "Comida y bebida",
        "Alimentation et boissons",
        "Essen und Trinken",
        "食べ物と飲み物",
        "食物与饮品",
        "الطعام والشراب"
    ],
    "Travel & Places": [
        "यात्रा और स्थान",
        "Viajes y lugares",
        "Voyages et lieux",
        "Reisen und Orte",
        "旅行と場所",
        "旅行与地点",
        "السفر والأماكن"
    ],
    "Symbols": [
        "प्रतीक",
        "Símbolos",
        "Symboles",
        "Symbole",
        "記号",
        "符号",
        "الرموز"
    ],
    "Celebration": [
        "उत्सव",
        "Celebración",
        "Fête",
        "Feiern",
        "お祝い",
        "庆祝",
        "الاحتفالات"
    ],
    "Hands & Gestures": [
        "हाथ और संकेत",
        "Manos y gestos",
        "Mains et gestes",
        "Hände und Gesten",
        "手とジェスチャー",
        "手势",
        "الأيدي والإيماءات"
    ],
    "Low": [
        "कम",
        "Baja",
        "Faible",
        "Niedrig",
        "低",
        "低",
        "منخفضة"
    ],
    "Medium": [
        "मध्यम",
        "Media",
        "Moyenne",
        "Mittel",
        "中",
        "中",
        "متوسطة"
    ],
    "High": [
        "उच्च",
        "Alta",
        "Élevée",
        "Hoch",
        "高",
        "高",
        "عالية"
    ],
    "Urgent": [
        "अत्यावश्यक",
        "Urgente",
        "Urgente",
        "Dringend",
        "緊急",
        "紧急",
        "عاجلة"
    ],
    "To Do": [
        "करना है",
        "Pendiente",
        "À faire",
        "Offen",
        "未着手",
        "待办",
        "للإنجاز"
    ],
    "Blocked": [
        "अवरुद्ध",
        "Bloqueada",
        "Bloquée",
        "Blockiert",
        "ブロック中",
        "受阻",
        "محظورة"
    ],
    "Your browser does not support IndexedDB.": [
        "आपका ब्राउज़र IndexedDB का समर्थन नहीं करता।",
        "Tu navegador no admite IndexedDB.",
        "Votre navigateur ne prend pas en charge IndexedDB.",
        "Ihr Browser unterstützt IndexedDB nicht.",
        "このブラウザーはIndexedDBに対応していません。",
        "您的浏览器不支持 IndexedDB。",
        "متصفحك لا يدعم IndexedDB."
    ],
    "Invalid file format": [
        "अमान्य फ़ाइल प्रारूप",
        "Formato de archivo no válido",
        "Format de fichier invalide",
        "Ungültiges Dateiformat",
        "無効なファイル形式",
        "文件格式无效",
        "صيغة ملف غير صالحة"
    ],
    "Invalid data format": [
        "अमान्य डेटा प्रारूप",
        "Formato de datos no válido",
        "Format de données invalide",
        "Ungültiges Datenformat",
        "無効なデータ形式",
        "数据格式无效",
        "صيغة بيانات غير صالحة"
    ],
    "Missing or invalid version": [
        "संस्करण अनुपस्थित या अमान्य है",
        "Versión ausente o no válida",
        "Version absente ou invalide",
        "Version fehlt oder ist ungültig",
        "バージョンがないか無効です",
        "版本缺失或无效",
        "الإصدار مفقود أو غير صالح"
    ],
    "Missing or invalid todos array": [
        "कार्य सूची अनुपस्थित या अमान्य है",
        "Lista de tareas ausente o no válida",
        "Liste de tâches absente ou invalide",
        "Aufgabenliste fehlt oder ist ungültig",
        "タスク配列がないか無効です",
        "任务数组缺失或无效",
        "مصفوفة المهام مفقودة أو غير صالحة"
    ],
    "Invalid todo item": [
        "अमान्य कार्य",
        "Tarea no válida",
        "Tâche invalide",
        "Ungültige Aufgabe",
        "無効なタスク",
        "任务项无效",
        "عنصر مهمة غير صالح"
    ],
    "Todo missing required fields (id, title, status, priority)": [
        "कार्य में आवश्यक फ़ील्ड नहीं हैं (id, title, status, priority)",
        "Faltan campos obligatorios (id, title, status, priority)",
        "Champs obligatoires manquants (id, title, status, priority)",
        "Pflichtfelder fehlen (id, title, status, priority)",
        "必須フィールドがありません（id, title, status, priority）",
        "任务缺少必填字段（id, title, status, priority）",
        "حقول المهمة المطلوبة مفقودة (id, title, status, priority)"
    ],
    "IndexedDB requires a browser environment": [
        "IndexedDB के लिए ब्राउज़र चाहिए",
        "IndexedDB requiere un navegador",
        "IndexedDB nécessite un navigateur",
        "IndexedDB benötigt eine Browserumgebung",
        "IndexedDBにはブラウザー環境が必要です",
        "IndexedDB 需要浏览器环境",
        "تتطلب IndexedDB بيئة متصفح"
    ],
    "Your browser doesn't support IndexedDB. Please use a modern browser like Chrome, Firefox, Safari, or Edge.": [
        "आपका ब्राउज़र IndexedDB का समर्थन नहीं करता। Chrome, Firefox, Safari या Edge जैसा आधुनिक ब्राउज़र इस्तेमाल करें।",
        "Tu navegador no admite IndexedDB. Usa uno moderno como Chrome, Firefox, Safari o Edge.",
        "Votre navigateur ne prend pas en charge IndexedDB. Utilisez Chrome, Firefox, Safari ou Edge.",
        "Ihr Browser unterstützt IndexedDB nicht. Verwenden Sie Chrome, Firefox, Safari oder Edge.",
        "このブラウザーはIndexedDBに対応していません。Chrome、Firefox、Safari、Edgeなどを使用してください。",
        "您的浏览器不支持 IndexedDB。请使用 Chrome、Firefox、Safari 或 Edge 等现代浏览器。",
        "متصفحك لا يدعم IndexedDB. استخدم متصفحًا حديثًا مثل Chrome أو Firefox أو Safari أو Edge."
    ],
    "IndexedDB may not work in private/incognito mode. Please use a regular browser window.": [
        "IndexedDB निजी/गुप्त मोड में काम न करे। सामान्य ब्राउज़र विंडो इस्तेमाल करें।",
        "IndexedDB podría no funcionar en modo privado. Usa una ventana normal.",
        "IndexedDB peut ne pas fonctionner en navigation privée. Utilisez une fenêtre normale.",
        "IndexedDB funktioniert möglicherweise nicht im privaten Modus. Verwenden Sie ein normales Fenster.",
        "プライベートモードではIndexedDBが動作しない場合があります。通常のウィンドウを使用してください。",
        "IndexedDB 可能无法在隐私模式下运行。请使用普通浏览器窗口。",
        "قد لا تعمل IndexedDB في التصفح الخاص. استخدم نافذة متصفح عادية."
    ],
    "Backlog": [
        "लंबित सूची",
        "Pendientes sin planificar",
        "À planifier",
        "Rückstand",
        "バックログ",
        "待规划",
        "قائمة الانتظار"
    ],
    "In Review": [
        "समीक्षा में",
        "En revisión",
        "En révision",
        "In Prüfung",
        "レビュー中",
        "审核中",
        "قيد المراجعة"
    ],
    "Waiting": [
        "प्रतीक्षा में",
        "En espera",
        "En attente",
        "Wartend",
        "待機中",
        "等待中",
        "قيد الانتظار"
    ],
    "Critical": [
        "अत्यंत महत्वपूर्ण",
        "Crítica",
        "Critique",
        "Kritisch",
        "最重要",
        "极高",
        "حرجة"
    ],
    "None": [
        "कोई नहीं",
        "Ninguno",
        "Aucun",
        "Keine",
        "なし",
        "无",
        "لا شيء"
    ],
    "Import failed. Check the backup file and try again.": [
        "आयात विफल हुआ। बैकअप फ़ाइल जाँचकर फिर कोशिश करें।",
        "La importación falló. Revisa la copia y vuelve a intentarlo.",
        "Échec de l’import. Vérifiez la sauvegarde et réessayez.",
        "Import fehlgeschlagen. Prüfen Sie die Sicherungsdatei und versuchen Sie es erneut.",
        "インポートに失敗しました。バックアップファイルを確認して再試行してください。",
        "导入失败。请检查备份文件后重试。",
        "فشل الاستيراد. تحقق من ملف النسخة الاحتياطية وحاول مجددًا."
    ],
    "Replace all task data?": [
        "सभी कार्य डेटा बदलें?",
        "¿Reemplazar todos los datos de tareas?",
        "Remplacer toutes les données de tâches ?",
        "Alle Aufgabendaten ersetzen?",
        "すべてのタスクデータを置き換えますか？",
        "替换所有任务数据？",
        "استبدال جميع بيانات المهام؟"
    ],
    "This replaces all task data in this workspace. This cannot be undone.": [
        "इस कार्यक्षेत्र के सभी कार्य डेटा बदलेंगे। यह वापस नहीं हो सकता।",
        "Se reemplazarán todos los datos de tareas de este espacio. No se puede deshacer.",
        "Toutes les données de tâches de cet espace seront remplacées. Cette action est irréversible.",
        "Alle Aufgabendaten dieses Arbeitsbereichs werden ersetzt. Dies kann nicht rückgängig gemacht werden.",
        "このワークスペースのすべてのタスクデータを置き換えます。元に戻せません。",
        "这将替换此工作区的所有任务数据，无法撤销。",
        "سيُستبدل جميع بيانات المهام في مساحة العمل هذه. لا يمكن التراجع عن ذلك."
    ],
    "Task Details": [
        "कार्य का विवरण",
        "Detalles de la tarea",
        "Détails de la tâche",
        "Aufgabendetails",
        "タスクの詳細",
        "任务详情",
        "تفاصيل المهمة"
    ],
    "Active": [
        "सक्रिय",
        "Activo",
        "Actif",
        "Aktiv",
        "有効",
        "活跃",
        "نشط"
    ],
    "Cancel": [
        "रद्द करें",
        "Cancelar",
        "Annuler",
        "Abbrechen",
        "キャンセル",
        "取消",
        "إلغاء"
    ],
    "Cancelled": [
        "रद्द",
        "Cancelada",
        "Annulée",
        "Abgebrochen",
        "キャンセル済み",
        "已取消",
        "ملغى"
    ],
    "Clear": [
        "साफ़ करें",
        "Borrar",
        "Effacer",
        "Leeren",
        "クリア",
        "清空",
        "مسح"
    ],
    "Default": [
        "डिफ़ॉल्ट",
        "Predeterminado",
        "Par défaut",
        "Standard",
        "デフォルト",
        "默认",
        "افتراضي"
    ],
    "Delete": [
        "हटाएँ",
        "Eliminar",
        "Supprimer",
        "Löschen",
        "削除",
        "删除",
        "حذف"
    ],
    "Description": [
        "विवरण",
        "Descripción",
        "Description",
        "Beschreibung",
        "説明",
        "说明",
        "الوصف"
    ],
    "Download": [
        "डाउनलोड करें",
        "Descargar",
        "Télécharger",
        "Herunterladen",
        "ダウンロード",
        "下载",
        "تنزيل"
    ],
    "Edit": [
        "संपादित करें",
        "Editar",
        "Modifier",
        "Bearbeiten",
        "編集",
        "编辑",
        "تعديل"
    ],
    "Export": [
        "निर्यात करें",
        "Exportar",
        "Exporter",
        "Exportieren",
        "エクスポート",
        "导出",
        "تصدير"
    ],
    "Name": [
        "नाम",
        "Nombre",
        "Nom",
        "Name",
        "名前",
        "名称",
        "الاسم"
    ],
    "Notes": [
        "नोट्स",
        "Notas",
        "Notes",
        "Notizen",
        "メモ",
        "笔记",
        "ملاحظات"
    ],
    "Personal Todo List": [
        "व्यक्तिगत कार्य सूची",
        "Lista personal de tareas",
        "Liste de tâches personnelle",
        "Persönliche Aufgabenliste",
        "個人用タスクリスト",
        "个人待办事项",
        "قائمة المهام الشخصية"
    ],
    "Priority": [
        "प्राथमिकता",
        "Prioridad",
        "Priorité",
        "Priorität",
        "優先度",
        "优先级",
        "الأولوية"
    ],
    "Refresh": [
        "रीफ़्रेश करें",
        "Actualizar",
        "Actualiser",
        "Aktualisieren",
        "更新",
        "刷新",
        "تحديث"
    ],
    "Restore": [
        "वापस लाएँ",
        "Restaurar",
        "Restaurer",
        "Wiederherstellen",
        "復元",
        "恢复",
        "استعادة"
    ],
    "Save": [
        "सहेजें",
        "Guardar",
        "Enregistrer",
        "Speichern",
        "保存",
        "保存",
        "حفظ"
    ],
    "Settings": [
        "सेटिंग",
        "Configuración",
        "Paramètres",
        "Einstellungen",
        "設定",
        "设置",
        "الإعدادات"
    ],
    "Status": [
        "स्थिति",
        "Estado",
        "État",
        "Status",
        "状態",
        "状态",
        "الحالة"
    ],
    "Sticky Notes": [
        "स्टिकी नोट्स",
        "Notas adhesivas",
        "Notes autocollantes",
        "Haftnotizen",
        "付箋メモ",
        "便笺",
        "الملاحظات اللاصقة"
    ],
    "Upload": [
        "अपलोड करें",
        "Subir",
        "Importer",
        "Hochladen",
        "アップロード",
        "上传",
        "رفع"
    ]
};
