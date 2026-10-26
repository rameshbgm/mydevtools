import { SIGNAL_TRANSLATIONS } from "./signal";
import { AUTHORED_DIAGNOSTIC_TRANSLATIONS } from "./authored-diagnostics";
import { RELEASE_HISTORY_TRANSLATIONS } from "./release-history";
import { CATALOG_DESCRIPTION_TRANSLATIONS } from "./catalog-descriptions";
import { REFERENCE_STANDARDS_TRANSLATIONS } from "./reference-standards";
import { FINAL_INTERFACE_TRANSLATIONS } from "./final-interface";
import { TOOL_FAQ_TRANSLATIONS } from "./tool-faq";
import { REFERENCE_NETWORK_TRANSLATIONS } from "./reference-network";
import { REMAINING_AI_TRANSLATIONS } from "./remaining-ai";
import { REMAINING_NETWORK_TRANSLATIONS } from "./remaining-network";
import { REFERENCE_UI_TRANSLATIONS } from "./reference-ui";
import { CARD_TOOL_TRANSLATIONS } from "./card-tools";
import { FUN_TOOL_TRANSLATIONS } from "./fun-tools";
import { COLOR_INSPECTION_TRANSLATIONS } from "./color-inspection";
import { TOOL_GUIDANCE_TRANSLATIONS } from "./tool-guidance";
import { SECURITY_HELPER_TRANSLATIONS } from "./security-helpers";
import { GENERATOR_TOOL_TRANSLATIONS } from "./generator-tools";
import { PRODUCTIVITY_TOOL_TRANSLATIONS } from "./productivity-tools";
import { MEDIA_TOOL_TRANSLATIONS } from "./media-tools";
import { PROTOCOL_TOOL_TRANSLATIONS } from "./protocol-tools";
import { TEXT_TOOL_TRANSLATIONS } from "./text-tools";
import { NETWORK_TOOL_TRANSLATIONS } from "./network-tools";
import { CERTIFICATE_TOOL_TRANSLATIONS } from "./certificate-tools";
import { COMPARISON_TRANSLATIONS } from "./comparisons";
import { CRYPTO_UTILITY_TRANSLATIONS } from "./crypto-utilities";
import { JOSE_TOOL_TRANSLATIONS } from "./jose-tools";
import { DATA_CONVERTER_TRANSLATIONS } from "./data-converters";
import { VALIDATOR_TRANSLATIONS } from "./validators";
import { ENCODING_TOOL_TRANSLATIONS } from "./encoding-tools";
import { NUMERIC_UTILITY_TRANSLATIONS } from "./numeric-utilities";
import { JSON_VALIDATION_TRANSLATIONS } from "./json-validation";
import { FORMATTER_TRANSLATIONS } from "./formatters";
import { HTTP_CLIENT_TRANSLATIONS } from "./http-client";
import { COLOR_EMAIL_TRANSLATIONS } from "./color-email";
import { API_EXTENSION_TRANSLATIONS } from "./api-extensions";
import { CRON_GRAPHQL_TRANSLATIONS } from "./cron-graphql";
import { FILE_CONVERSION_TRANSLATIONS } from "./file-conversions";
import { NETWORK_IDENTITY_TRANSLATIONS } from "./network-identity";
import { VISUAL_UTILITY_TRANSLATIONS } from "./visual-utilities";
import { IDENTIFIER_CONFIG_TRANSLATIONS } from "./identifier-config";
import { TEMPORAL_UNIT_TRANSLATIONS } from "./temporal-unit";
import { SHARED_DIALOG_TRANSLATIONS } from "./shared-dialogs";
import { MEMORY_TRANSLATIONS } from "./memory";
import { TOOL_BRIDGE_TRANSLATIONS } from "./tool-bridge";
import { REFERENCE_PROVENANCE_TRANSLATIONS } from "./reference-provenance";
import { DEBUGGING_GUIDE_TRANSLATIONS } from "./debugging-guides";
import { JSON_TOOL_TRANSLATIONS } from "./json-tools";
import { JSON_NUMBER_TRANSLATIONS } from "./json-numbers";
import { SNIPPET_TRANSLATIONS } from "./snippets";
import { WORKSPACE_TAB_TRANSLATIONS } from "./workspace-tabs";
import { MARKETING_TRANSLATIONS } from "./marketing";
import { SQL_WORKSPACE_TRANSLATIONS } from "./sql-workspace";
import { WORKSPACE_TRANSLATIONS } from "./workspace";
import { TOOL_NAME_TRANSLATIONS, type TranslationColumns } from "./tool-names";
import { JSON_GRAPH_TRANSLATIONS } from "./json-graph";
import { WORKSPACE_TOOL_TRANSLATIONS } from "./workspace-tools";
import { DATA_CLIENT_TRANSLATIONS } from "./data-clients";
import { UTILITY_EXTENSION_TRANSLATIONS } from "./utility-extensions";
import { VAULT_INTERFACE_TRANSLATIONS } from "./vault-interface";
export const LANGUAGES = [
    { id: "en", name: "English" }, { id: "hi", name: "हिन्दी" },
    { id: "es", name: "Español" }, { id: "fr", name: "Français" },
    { id: "de", name: "Deutsch" }, { id: "ja", name: "日本語" },
    { id: "zh", name: "中文" }, { id: "ar", name: "العربية" },
] as const;
export type Language = typeof LANGUAGES[number]["id"];
export const LANGUAGE_KEY = "mydevtools-language";
export function validLanguage(value: unknown): Language {
    return LANGUAGES.some((language) => language.id === value) ? value as Language : "en";
}
// Columns: Hindi, Spanish, French, German, Japanese, Simplified Chinese, Arabic.
// Source strings remain the fallback, including diagnostic details from parsers.
export const SHARED_TRANSLATIONS: Record<string, TranslationColumns> = {
    ...SIGNAL_TRANSLATIONS,
    ...AUTHORED_DIAGNOSTIC_TRANSLATIONS,
    ...RELEASE_HISTORY_TRANSLATIONS,
    ...CATALOG_DESCRIPTION_TRANSLATIONS,
    ...REFERENCE_STANDARDS_TRANSLATIONS,
    ...FINAL_INTERFACE_TRANSLATIONS,
    ...TOOL_FAQ_TRANSLATIONS,
    ...REFERENCE_NETWORK_TRANSLATIONS,
    ...REMAINING_AI_TRANSLATIONS,
    ...REMAINING_NETWORK_TRANSLATIONS,
    ...REFERENCE_UI_TRANSLATIONS,
    ...CARD_TOOL_TRANSLATIONS,
    ...FUN_TOOL_TRANSLATIONS,
    ...COLOR_INSPECTION_TRANSLATIONS,
    ...TOOL_GUIDANCE_TRANSLATIONS,
    ...SECURITY_HELPER_TRANSLATIONS,
    ...GENERATOR_TOOL_TRANSLATIONS,
    ...PRODUCTIVITY_TOOL_TRANSLATIONS,
    ...MEDIA_TOOL_TRANSLATIONS,
    ...PROTOCOL_TOOL_TRANSLATIONS,
    ...TEXT_TOOL_TRANSLATIONS,
    ...NETWORK_TOOL_TRANSLATIONS,
    ...CERTIFICATE_TOOL_TRANSLATIONS,
    ...CRYPTO_UTILITY_TRANSLATIONS,
    ...JOSE_TOOL_TRANSLATIONS,
    ...SHARED_DIALOG_TRANSLATIONS,
    ...MEMORY_TRANSLATIONS,
    ...UTILITY_EXTENSION_TRANSLATIONS,
    ...DATA_CLIENT_TRANSLATIONS,
    ...WORKSPACE_TOOL_TRANSLATIONS,
    ...JSON_GRAPH_TRANSLATIONS,
    ...TOOL_NAME_TRANSLATIONS,
    ...VAULT_INTERFACE_TRANSLATIONS,
    ...WORKSPACE_TRANSLATIONS,
    ...MARKETING_TRANSLATIONS,
    ...SQL_WORKSPACE_TRANSLATIONS,
    ...WORKSPACE_TAB_TRANSLATIONS,
    ...SNIPPET_TRANSLATIONS,
    ...JSON_NUMBER_TRANSLATIONS,
    ...JSON_TOOL_TRANSLATIONS,
    ...TOOL_BRIDGE_TRANSLATIONS,
    ...DEBUGGING_GUIDE_TRANSLATIONS,
    ...REFERENCE_PROVENANCE_TRANSLATIONS,
    "Copied!": ["कॉपी हो गया!", "¡Copiado!", "Copié !", "Kopiert!", "コピーしました！", "已复制！", "تم النسخ!"],
    "Copy failed — please copy manually": ["कॉपी नहीं हुआ — कृपया स्वयं कॉपी करें", "No se pudo copiar — copia el texto manualmente", "Échec de la copie — copiez le texte manuellement", "Kopieren fehlgeschlagen — bitte manuell kopieren", "コピーできませんでした。手動でコピーしてください", "复制失败，请手动复制", "تعذر النسخ — يرجى النسخ يدويًا"],
    "Language": ["भाषा", "Idioma", "Langue", "Sprache", "言語", "语言", "اللغة"],
    "Made with": ["प्यार से बनाया", "Hecho con", "Créé avec", "Mit", "心を込めて", "用心制作", "صُنع بكل"],
    "by": ["निर्माता", "por", "par", "von", "制作：", "作者：", "بواسطة"],
    "{count} tools": ["{count} टूल", "{count} herramientas", "{count} outils", "{count} Werkzeuge", "{count} 個のツール", "{count} 个工具", "أدوات: {count}"],
    "Client-side by default · see each tool for details": ["डिफ़ॉल्ट रूप से क्लाइंट पर · विवरण हर टूल में देखें", "Procesamiento local por defecto · consulta cada herramienta", "Traitement local par défaut · détails dans chaque outil", "Standardmäßig lokal · Details beim jeweiligen Werkzeug", "原則としてローカル処理・詳細は各ツールを参照", "默认在本地处理 · 详情请查看各工具", "معالجة محلية افتراضيًا · راجع تفاصيل كل أداة"],
    "Install app": ["ऐप इंस्टॉल करें", "Instalar aplicación", "Installer l’application", "App installieren", "アプリをインストール", "安装应用", "تثبيت التطبيق"],
    "Install mydevtools as an app": ["mydevtools को ऐप के रूप में इंस्टॉल करें", "Instalar mydevtools como aplicación", "Installer mydevtools comme application", "mydevtools als App installieren", "mydevtoolsをアプリとしてインストール", "将 mydevtools 安装为应用", "تثبيت mydevtools كتطبيق"],
    "Dashboard": ["डैशबोर्ड", "Inicio", "Tableau de bord", "Übersicht", "ダッシュボード", "仪表盘", "لوحة التحكم"],
    "Developer Toolkit": ["डेवलपर टूलकिट", "Herramientas de desarrollo", "Outils de développement", "Entwicklerwerkzeuge", "開発者向けツール", "开发者工具集", "أدوات المطورين"],
    "Artificial Intelligence": ["कृत्रिम बुद्धिमत्ता", "Inteligencia artificial", "Intelligence artificielle", "Künstliche Intelligenz", "人工知能", "人工智能", "الذكاء الاصطناعي"],
    "Diff & Compare": ["अंतर और तुलना", "Diferencias y comparación", "Différences et comparaison", "Unterschiede und Vergleich", "差分と比較", "差异与比较", "الفروق والمقارنة"],
    "API & Web Services": ["API और वेब सेवाएँ", "API y servicios web", "API et services web", "APIs und Webdienste", "APIとウェブサービス", "API 与 Web 服务", "واجهات API وخدمات الويب"],
    "Encoding & Decoding": ["एन्कोडिंग और डिकोडिंग", "Codificación y decodificación", "Encodage et décodage", "Kodierung und Dekodierung", "エンコードとデコード", "编码与解码", "الترميز وفك الترميز"],
    "Certificates & Keys": ["प्रमाणपत्र और कुंजियाँ", "Certificados y claves", "Certificats et clés", "Zertifikate und Schlüssel", "証明書と鍵", "证书与密钥", "الشهادات والمفاتيح"],
    "Cryptography": ["क्रिप्टोग्राफ़ी", "Criptografía", "Cryptographie", "Kryptografie", "暗号技術", "密码学", "التشفير"],
    "Data Converters": ["डेटा परिवर्तक", "Conversores de datos", "Convertisseurs de données", "Datenkonverter", "データ変換", "数据转换", "تحويل البيانات"],
    "Formatters": ["फ़ॉर्मैटर", "Formateadores", "Outils de formatage", "Formatierung", "フォーマッター", "格式化", "تنسيق البيانات"],
    "Fun & Games": ["मनोरंजन और खेल", "Diversión y juegos", "Jeux et loisirs", "Spaß und Spiele", "遊びとゲーム", "趣味与游戏", "الترفيه والألعاب"],
    "Generators": ["जनरेटर", "Generadores", "Générateurs", "Generatoren", "ジェネレーター", "生成器", "المولدات"],
    "Image & Media": ["छवि और मीडिया", "Imagen y multimedia", "Images et médias", "Bilder und Medien", "画像とメディア", "图像与媒体", "الصور والوسائط"],
    "Network": ["नेटवर्क", "Red", "Réseau", "Netzwerk", "ネットワーク", "网络", "الشبكة"],
    "Text & Utilities": ["टेक्स्ट और उपयोगिताएँ", "Texto y utilidades", "Texte et utilitaires", "Text und Hilfsprogramme", "テキストとユーティリティ", "文本与实用工具", "النصوص والأدوات"],
    "Validators": ["सत्यापन उपकरण", "Validadores", "Validateurs", "Validierung", "検証ツール", "验证工具", "أدوات التحقق"],
    "Reference": ["संदर्भ", "Referencias", "Références", "Referenz", "リファレンス", "参考资料", "المراجع"],
    "Search tools…": ["टूल खोजें…", "Buscar herramientas…", "Rechercher un outil…", "Werkzeuge suchen…", "ツールを検索…", "搜索工具…", "البحث عن أداة…"],
    "Open menu": ["मेन्यू खोलें", "Abrir menú", "Ouvrir le menu", "Menü öffnen", "メニューを開く", "打开菜单", "فتح القائمة"],
    "Expand sidebar": ["साइडबार फैलाएँ", "Expandir barra lateral", "Déployer le panneau latéral", "Seitenleiste erweitern", "サイドバーを展開", "展开侧栏", "توسيع الشريط الجانبي"],
    "Collapse sidebar": ["साइडबार समेटें", "Contraer barra lateral", "Réduire le panneau latéral", "Seitenleiste einklappen", "サイドバーを折りたたむ", "收起侧栏", "طي الشريط الجانبي"],
    "Memory & Storage Manager": ["मेमोरी और स्टोरेज प्रबंधक", "Memoria y almacenamiento", "Mémoire et stockage", "Speicherverwaltung", "メモリとストレージ管理", "内存与存储管理", "إدارة الذاكرة والتخزين"],
    "Switch to Light Mode": ["लाइट मोड चुनें", "Cambiar al tema claro", "Passer au thème clair", "Zum hellen Design wechseln", "ライトモードに切り替え", "切换到浅色模式", "التبديل إلى المظهر الفاتح"],
    "Switch to Dark Mode": ["डार्क मोड चुनें", "Cambiar al tema oscuro", "Passer au thème sombre", "Zum dunklen Design wechseln", "ダークモードに切り替え", "切换到深色模式", "التبديل إلى المظهر الداكن"],
    "Open bookmarks": ["बुकमार्क खोलें", "Abrir marcadores", "Ouvrir les favoris", "Lesezeichen öffnen", "ブックマークを開く", "打开书签", "فتح الإشارات المرجعية"],
    "Project": ["प्रोजेक्ट", "Proyecto", "Projet", "Projekt", "プロジェクト", "项目", "المشروع"],
    "Active project": ["सक्रिय प्रोजेक्ट", "Proyecto activo", "Projet actif", "Aktives Projekt", "現在のプロジェクト", "当前项目", "المشروع النشط"],
    "Manage projects": ["प्रोजेक्ट प्रबंधित करें", "Gestionar proyectos", "Gérer les projets", "Projekte verwalten", "プロジェクトを管理", "管理项目", "إدارة المشاريع"],
    "Open tool tabs": ["टूल टैब खोलें", "Abrir pestañas de herramientas", "Ouvrir les onglets d’outils", "Werkzeugtabs öffnen", "ツールタブを開く", "打开工具标签页", "فتح تبويبات الأدوات"],
    "What’s new": ["नया क्या है", "Novedades", "Nouveautés", "Neuigkeiten", "新機能", "新功能", "ما الجديد"],
    "What's new in version {version} — release notes": ["संस्करण {version} में नया क्या है — रिलीज़ नोट्स", "Novedades de la versión {version} — notas de la versión", "Nouveautés de la version {version} — notes de version", "Neu in Version {version} — Versionshinweise", "バージョン {version} の新機能 — リリースノート", "版本 {version} 的新功能 — 发行说明", "ما الجديد في الإصدار {version} — ملاحظات الإصدار"],
    "Debugging guides": ["डिबगिंग गाइड", "Guías de depuración", "Guides de débogage", "Anleitungen zur Fehlersuche", "デバッグガイド", "调试指南", "أدلة تصحيح الأخطاء"],
    "Use compact workspace": ["कॉम्पैक्ट कार्यक्षेत्र चुनें", "Usar espacio compacto", "Utiliser l’espace compact", "Kompakte Ansicht verwenden", "コンパクト表示にする", "使用紧凑工作区", "استخدام مساحة عمل مضغوطة"],
    "Show introduction": ["परिचय दिखाएँ", "Mostrar introducción", "Afficher l’introduction", "Einführung anzeigen", "紹介を表示", "显示介绍", "إظهار المقدمة"],
    "Learn More About This Tool": ["इस टूल के बारे में जानें", "Más información sobre esta herramienta", "En savoir plus sur cet outil", "Mehr über dieses Werkzeug", "このツールについて", "了解此工具", "المزيد عن هذه الأداة"],
    "What is it?": ["यह क्या है?", "¿Qué es?", "De quoi s’agit-il ?", "Was ist das?", "概要", "这是什么？", "ما هذه الأداة؟"],
    "Why use it?": ["इसे क्यों उपयोग करें?", "¿Por qué usarlo?", "Pourquoi l’utiliser ?", "Warum verwenden?", "利用する理由", "为什么使用？", "لماذا تُستخدم؟"],
    "How to use": ["उपयोग कैसे करें", "Cómo usarlo", "Mode d’emploi", "Anleitung", "使い方", "使用方法", "طريقة الاستخدام"],
    "Use cases": ["उपयोग के उदाहरण", "Casos de uso", "Cas d’utilisation", "Anwendungsfälle", "活用例", "使用场景", "حالات الاستخدام"],
    "Pro tips": ["उपयोगी सुझाव", "Consejos", "Conseils pratiques", "Tipps", "ヒント", "使用技巧", "نصائح"],
    "Frequently asked questions": ["अक्सर पूछे जाने वाले प्रश्न", "Preguntas frecuentes", "Questions fréquentes", "Häufige Fragen", "よくある質問", "常见问题", "الأسئلة الشائعة"],
    "Related tools": ["संबंधित टूल", "Herramientas relacionadas", "Outils associés", "Ähnliche Werkzeuge", "関連ツール", "相关工具", "أدوات ذات صلة"],
    "Local processing": ["स्थानीय प्रोसेसिंग", "Procesamiento local", "Traitement local", "Lokale Verarbeitung", "ローカル処理", "本地处理", "معالجة محلية"],
    "Network connection · review before sending": ["नेटवर्क कनेक्शन · भेजने से पहले जाँचें", "Conexión de red · revisar antes de enviar", "Connexion réseau · vérifier avant l’envoi", "Netzwerkverbindung · vor dem Senden prüfen", "ネットワーク接続・送信前に確認", "网络连接 · 发送前请检查", "اتصال بالشبكة · راجع قبل الإرسال"],
    "Connects directly from your browser": ["आपके ब्राउज़र से सीधे जुड़ता है", "Conexión directa desde tu navegador", "Connexion directe depuis votre navigateur", "Direkte Verbindung aus dem Browser", "ブラウザーから直接接続", "从浏览器直接连接", "يتصل مباشرة من متصفحك"],
    "Uses the mydevtools server": ["mydevtools सर्वर का उपयोग करता है", "Usa el servidor de mydevtools", "Utilise le serveur mydevtools", "Verwendet den mydevtools-Server", "mydevtoolsサーバーを使用", "使用 mydevtools 服务器", "يستخدم خادم mydevtools"],
    "Language changed for this session. Browser storage is unavailable.": ["इस सत्र के लिए भाषा बदल गई। ब्राउज़र स्टोरेज उपलब्ध नहीं है।", "Idioma cambiado para esta sesión. El almacenamiento del navegador no está disponible.", "Langue changée pour cette session. Le stockage du navigateur est indisponible.", "Sprache für diese Sitzung geändert. Browserspeicher ist nicht verfügbar.", "このセッションの言語を変更しました。ブラウザーストレージは利用できません。", "已更改本次会话的语言。浏览器存储不可用。", "تم تغيير لغة هذه الجلسة. تخزين المتصفح غير متاح."],
    ...TEMPORAL_UNIT_TRANSLATIONS,
    ...IDENTIFIER_CONFIG_TRANSLATIONS,
    ...VISUAL_UTILITY_TRANSLATIONS,
    ...NETWORK_IDENTITY_TRANSLATIONS,
    ...FILE_CONVERSION_TRANSLATIONS,
    ...CRON_GRAPHQL_TRANSLATIONS,
    ...API_EXTENSION_TRANSLATIONS,
    ...COLOR_EMAIL_TRANSLATIONS,
    ...HTTP_CLIENT_TRANSLATIONS,
    ...FORMATTER_TRANSLATIONS,
    ...JSON_VALIDATION_TRANSLATIONS,
    ...NUMERIC_UTILITY_TRANSLATIONS,
    ...ENCODING_TOOL_TRANSLATIONS,
    ...VALIDATOR_TRANSLATIONS,
    ...DATA_CONVERTER_TRANSLATIONS,
    ...COMPARISON_TRANSLATIONS,
};
export function translate(language: Language, source: string, values?: Record<string, string | number>): string {
    const index = LANGUAGES.findIndex((entry) => entry.id === language) - 1;
    const translated = index < 0 || !Object.hasOwn(SHARED_TRANSLATIONS, source) ? source : SHARED_TRANSLATIONS[source][index] ?? source;
    return translated.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (match, key) => values && Object.hasOwn(values, key) ? String(values[key]) : match);
}
