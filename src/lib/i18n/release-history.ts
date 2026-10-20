import type { TranslationColumns } from "./tool-names";

// Hindi, Spanish, French, German, Japanese, Simplified Chinese, Arabic.
// Historical notes describe their original releases; identifiers and code remain verbatim.
export const RELEASE_HISTORY_TRANSLATIONS: Record<string, TranslationColumns> = {
    "V2.0 — project workspaces, private vaults and connected data tools": [
        "V2.0 — परियोजना कार्यक्षेत्र, निजी वॉल्ट और जुड़े डेटा उपकरण",
        "V2.0 — espacios de proyecto, bóvedas privadas y herramientas de datos conectadas",
        "V2.0 — espaces de projet, coffres privés et outils de données connectés",
        "V2.0 — Projektbereiche, private Tresore und verbundene Datenwerkzeuge",
        "V2.0 — プロジェクト領域、非公開保管庫、接続型データツール",
        "V2.0 — 项目工作区、私密保险库与联网数据工具",
        "V2.0 — مساحات المشاريع والخزائن الخاصة وأدوات البيانات المتصلة"
    ],
    "Expands the catalog to 147 tools with project isolation, encrypted storage, database clients and deeper capabilities in existing tools.": [
        "147 उपकरणों तक विस्तार: परियोजना पृथक्करण, एन्क्रिप्टेड भंडारण, डेटाबेस क्लाइंट और मौजूदा उपकरणों में अधिक क्षमताएं।",
        "Amplía el catálogo a 147 herramientas con aislamiento de proyectos, almacenamiento cifrado, clientes de bases de datos y más capacidades en las herramientas existentes.",
        "Le catalogue passe à 147 outils avec isolation des projets, stockage chiffré, clients de bases de données et fonctions enrichies.",
        "Erweitert den Katalog auf 147 Werkzeuge mit Projekttrennung, verschlüsselter Speicherung, Datenbankclients und erweiterten bestehenden Funktionen.",
        "プロジェクト分離、暗号化ストレージ、データベースクライアント、既存機能の拡張により147ツールに増えました。",
        "目录扩展至 147 个工具，加入项目隔离、加密存储、数据库客户端，并深化现有工具能力。",
        "يوسّع الكتالوج إلى 147 أداة مع عزل المشاريع والتخزين المشفّر وعملاء قواعد البيانات وتطوير قدرات الأدوات الحالية."
    ],
    "Projects and private work": [
        "परियोजनाएं और निजी कार्य",
        "Proyectos y trabajo privado",
        "Projets et travail privé",
        "Projekte und private Arbeit",
        "プロジェクトと非公開作業",
        "项目与私密工作",
        "المشاريع والعمل الخاص"
    ],
    "Restore each workspace's last page and selected tool tab; keep saved notes, snippets, bookmarks, workflows and connections separate.": [
        "हर वर्कस्पेस का पिछला पृष्ठ और चुना हुआ टूल टैब फिर खोलें; सहेजे नोट्स, स्निपेट, बुकमार्क, वर्कफ़्लो और कनेक्शन अलग रखें।",
        "Restaura la última página y pestaña de herramienta de cada espacio; mantén separados notas, fragmentos, marcadores, flujos y conexiones guardados.",
        "Retrouvez la dernière page et l’onglet d’outil sélectionné de chaque espace ; gardez séparés notes, extraits, favoris, workflows et connexions enregistrés.",
        "Letzte Seite und ausgewählten Werkzeug-Tab jedes Arbeitsbereichs wiederherstellen; gespeicherte Notizen, Snippets, Lesezeichen, Workflows und Verbindungen getrennt halten.",
        "各ワークスペースの前回のページと選択したツールタブを復元し、保存したメモ、スニペット、ブックマーク、ワークフロー、接続を分離します。",
        "恢复每个工作区上次打开的页面和选中的工具标签页；分别保存笔记、代码片段、书签、工作流和连接。",
        "استعد آخر صفحة وعلامة تبويب أداة محددة لكل مساحة عمل؛ واحتفظ بالملاحظات والمقتطفات والإشارات المرجعية وسير العمل والاتصالات المحفوظة منفصلة."
    ],
    "Translate snippet controls and shared editor copy actions across eight languages; retain saved snippet identity and highlighting when loading records.": [
        "स्निपेट नियंत्रण और साझा एडिटर कॉपी क्रियाएं आठ भाषाओं में; रिकॉर्ड खोलते समय पहचान और सिंटैक्स रंग सुरक्षित रहते हैं।",
        "Traduce controles de fragmentos y copia del editor a ocho idiomas; conserva identidad y resaltado al cargar registros.",
        "Traduit les contrôles d’extraits et la copie partagée en huit langues ; préserve identité et coloration au chargement.",
        "Snippetelemente und gemeinsame Kopieraktionen in acht Sprachen; Identität und Syntaxhervorhebung bleiben beim Laden erhalten.",
        "スニペット操作と共通エディターのコピー操作を8言語に対応し、読込時の識別情報と構文色を維持します。",
        "将片段控件和共享编辑器复制操作翻译为八种语言；加载记录时保留片段身份和语法高亮。",
        "ترجم عناصر الشيفرات والنسخ في المحرر إلى ثماني لغات مع حفظ هوية السجل والتلوين عند التحميل."
    ],
    "Keep Personal protected; rename projects, move other projects to Deleted projects and restore them with their saved data and encrypted vaults.": [
        "Personal सुरक्षित रहता है; अन्य परियोजनाओं का नाम बदलें, Deleted projects में भेजें और डेटा व एन्क्रिप्टेड वॉल्ट सहित पुनर्स्थापित करें।",
        "Protege Personal; renombra otros proyectos, envíalos a Proyectos eliminados y restáuralos con datos y bóvedas cifradas.",
        "Protège Personal ; renommez les autres projets, déplacez-les vers les projets supprimés puis restaurez données et coffres chiffrés.",
        "Personal bleibt geschützt; andere Projekte umbenennen, als gelöscht ablegen und mit Daten und verschlüsselten Tresoren wiederherstellen.",
        "Personalを保護し、他のプロジェクトは改名、削除済みへの移動、保存データと暗号化保管庫を含む復元が可能です。",
        "保护 Personal；可重命名其他项目、移至已删除项目，并连同保存数据和加密保险库恢复。",
        "احمِ Personal وأعد تسمية المشاريع الأخرى أو انقلها للمحذوفة واستعدها مع بياناتها وخزائنها المشفّرة."
    ],
    "Store credentials, connection settings and files in passphrase-protected AES-256-GCM vaults; export encrypted backups and use the local recovery CLI.": [
        "क्रेडेंशियल, कनेक्शन और फ़ाइलें पासफ़्रेज़-सुरक्षित AES-256-GCM वॉल्ट में रखें; एन्क्रिप्टेड बैकअप निर्यात करें और स्थानीय recovery CLI प्रयोग करें।",
        "Guarda credenciales, conexiones y archivos en bóvedas AES-256-GCM con frase de acceso; exporta copias cifradas y usa la CLI local de recuperación.",
        "Stockez identifiants, connexions et fichiers dans des coffres AES-256-GCM protégés ; exportez des sauvegardes chiffrées et utilisez la CLI locale de récupération.",
        "Zugangsdaten, Verbindungseinstellungen und Dateien in passphrasengeschützten AES-256-GCM-Tresoren speichern; verschlüsselte Sicherungen und lokale Wiederherstellungs-CLI nutzen.",
        "資格情報、接続設定、ファイルをパスフレーズ付きAES-256-GCM保管庫に保存し、暗号化バックアップとローカル復旧CLIを使えます。",
        "将凭据、连接设置和文件保存在口令保护的 AES-256-GCM 保险库中；导出加密备份并使用本地恢复 CLI。",
        "احفظ بيانات الاعتماد والاتصالات والملفات بخزائن AES-256-GCM محمية بعبارة مرور، وصدّر نسخًا مشفّرة واستخدم CLI الاسترداد المحلي."
    ],
    "Inspect project/global records, encrypted vaults, session data and offline caches in the redesigned Memory & Storage inventory, with filters, previews, backups and scoped clear actions.": [
        "पुनः डिज़ाइन किए Memory & Storage में परियोजना/वैश्विक रिकॉर्ड, एन्क्रिप्टेड वॉल्ट, सत्र और ऑफ़लाइन कैश देखें; फ़िल्टर, पूर्वावलोकन, बैकअप और सीमित सफ़ाई उपलब्ध हैं।",
        "Inspecciona registros de proyecto y globales, bóvedas, sesiones y cachés en Memoria y almacenamiento, con filtros, vistas previas, copias y borrado por ámbito.",
        "Inspectez données projet/globales, coffres, sessions et caches hors ligne dans Mémoire et stockage repensé, avec filtres, aperçus, sauvegardes et effacement ciblé.",
        "Überarbeitete Speicherübersicht für Projekt-/Globaldaten, verschlüsselte Tresore, Sitzungen und Offline-Caches mit Filtern, Vorschau, Sicherungen und gezieltem Löschen.",
        "Memory & Storageを再設計し、プロジェクト・共通データ、暗号化保管庫、セッション、オフラインキャッシュを絞込・確認・バックアップ・対象指定消去できます。",
        "在重新设计的内存与存储页查看项目／全局记录、加密保险库、会话数据和离线缓存，提供筛选、预览、备份及按范围清理。",
        "افحص سجلات المشروع والسجلات العامة والخزائن والجلسات وذاكرة العمل دون اتصال بصفحة الذاكرة والتخزين الجديدة، مع مرشحات ومعاينات ونسخ احتياطي ومسح محدد النطاق."
    ],
    "Align project forms and row actions, keep the current-project status beside its name, and stack project rows in narrow layouts.": [
        "परियोजना फ़ॉर्म और पंक्ति क्रियाएं संरेखित करें; वर्तमान स्थिति नाम के पास रखें और संकरी स्क्रीन पर पंक्तियां क्रम से लगाएं।",
        "Alinea formularios y acciones, muestra el estado actual junto al nombre y apila filas en pantallas estrechas.",
        "Aligne formulaires et actions, affiche l’état courant près du nom et empile les lignes sur petits écrans.",
        "Projektformulare und Zeilenaktionen ausrichten, aktuellen Status am Namen zeigen und Zeilen auf schmalen Ansichten stapeln.",
        "フォームと行操作を整列し、現在のプロジェクト表示を名前の横に置き、狭い画面では行を縦に並べます。",
        "对齐项目表单与行操作，将当前项目状态放在名称旁，并在窄屏中堆叠项目行。",
        "حاذِ نماذج المشاريع وإجراءات الصفوف وأبقِ حالة المشروع بجوار اسمه ورتّب الصفوف رأسيًا في الشاشات الضيقة."
    ],
    "Open version-specific release notes from the branding area; remember the seen release on this browser and retain an accessible icon afterward.": [
        "ब्रांडिंग से संस्करण-विशिष्ट रिलीज़ नोट खोलें; इस ब्राउज़र में देखे संस्करण को याद रखें और बाद में सुलभ आइकन रखें।",
        "Abre notas por versión desde la marca, recuerda la versión vista en este navegador y conserva un icono accesible.",
        "Ouvre les notes de version depuis la marque, mémorise la version vue dans ce navigateur et conserve une icône accessible.",
        "Versionsbezogene Hinweise am Markenzeichen öffnen, gelesene Version im Browser merken und danach ein zugängliches Symbol behalten.",
        "ブランド領域から該当版の更新履歴を開き、このブラウザーの既読版を記憶して以後はアクセシブルなアイコンを残します。",
        "从品牌区打开对应版本的发行说明，记住此浏览器已查看的版本，随后保留可访问图标。",
        "افتح ملاحظات الإصدار المحدد من منطقة العلامة، وتذكّر الإصدار المقروء في المتصفح وأبقِ أيقونة ميسّرة بعده."
    ],
    "Databases and storage": [
        "डेटाबेस और भंडारण",
        "Bases de datos y almacenamiento",
        "Bases de données et stockage",
        "Datenbanken und Speicherung",
        "データベースとストレージ",
        "数据库与存储",
        "قواعد البيانات والتخزين"
    ],
    "Run SQLite locally in a browser worker, import and export databases, browse schemas and retain project-specific query text and history.": [
        "ब्राउज़र worker में स्थानीय SQLite चलाएं; डेटाबेस आयात/निर्यात, स्कीमा ब्राउज़िंग और परियोजना-विशिष्ट क्वेरी व इतिहास संभालें।",
        "Ejecuta SQLite en un worker local, importa/exporta bases, explora esquemas y conserva consultas e historial por proyecto.",
        "Exécute SQLite dans un worker local, importe/exporte les bases, explore les schémas et garde requêtes et historique par projet.",
        "SQLite lokal im Browser-Worker ausführen, Datenbanken importieren/exportieren, Schemas durchsuchen und Abfragen samt Verlauf projektweise speichern.",
        "ブラウザーワーカーでSQLiteをローカル実行し、DBの入出力、スキーマ閲覧、プロジェクト別のクエリと履歴を保持します。",
        "在浏览器 worker 中本地运行 SQLite，导入／导出数据库、浏览架构并保留各项目的查询文本与历史。",
        "شغّل SQLite محليًا في عامل المتصفح واستورد وصدّر القواعد وتصفّح مخططاتها واحتفظ بالاستعلامات والسجل لكل مشروع."
    ],
    "Connect to PostgreSQL, MySQL, MariaDB and Redis through an explicitly enabled, authenticated localhost runtime. Native connectors are disabled by default.": [
        "स्पष्ट रूप से चालू, प्रमाणित localhost runtime से PostgreSQL, MySQL, MariaDB और Redis जोड़ें। नेटिव कनेक्टर डिफ़ॉल्ट से बंद हैं।",
        "Conecta PostgreSQL, MySQL, MariaDB y Redis mediante un runtime localhost habilitado y autenticado. Los conectores nativos están desactivados por defecto.",
        "Connectez PostgreSQL, MySQL, MariaDB et Redis via un runtime localhost explicitement activé et authentifié. Connecteurs natifs désactivés par défaut.",
        "PostgreSQL, MySQL, MariaDB und Redis über explizit aktivierte, authentifizierte localhost-Laufzeit verbinden. Native Konnektoren sind standardmäßig deaktiviert.",
        "明示的に有効化・認証したlocalhost実行環境でPostgreSQL、MySQL、MariaDB、Redisへ接続します。ネイティブ接続は初期状態で無効です。",
        "通过明确启用并认证的 localhost 运行时连接 PostgreSQL、MySQL、MariaDB 和 Redis；原生连接器默认禁用。",
        "اتصل بـPostgreSQL وMySQL وMariaDB وRedis عبر بيئة localhost مفعّلة صراحة وموثّقة. الموصلات الأصلية معطلة افتراضيًا."
    ],
    "Browse S3-compatible buckets, prefixes and metadata; upload and download bounded files, confirm deletion and save connections in the encrypted vault.": [
        "S3-संगत बकेट, प्रीफ़िक्स और मेटाडेटा देखें; सीमित फ़ाइलें अपलोड/डाउनलोड करें, मिटाने की पुष्टि करें और कनेक्शन एन्क्रिप्टेड वॉल्ट में रखें।",
        "Explora buckets, prefijos y metadatos S3; transfiere archivos acotados, confirma borrados y guarda conexiones en la bóveda cifrada.",
        "Explore buckets, préfixes et métadonnées S3 ; transfère des fichiers bornés, confirme la suppression et sauvegarde les connexions au coffre chiffré.",
        "S3-kompatible Buckets, Präfixe und Metadaten durchsuchen, begrenzte Dateien übertragen, Löschungen bestätigen und Verbindungen verschlüsselt speichern.",
        "S3互換のバケット、プレフィックス、メタデータを閲覧し、上限付きファイル転送、削除確認、接続情報の暗号化保存が可能です。",
        "浏览 S3 兼容存储桶、前缀和元数据；上传／下载有大小限制的文件，确认删除，并将连接保存至加密保险库。",
        "تصفّح حاويات S3 وبادئاتها وبياناتها الوصفية وانقل ملفات محدودة الحجم وأكد الحذف واحفظ الاتصالات بالخزنة المشفّرة."
    ],
    "Browse MongoDB collections with canonical Extended JSON, typed Firestore documents and Elasticsearch indexes, mappings and search results; keep precision-sensitive numeric data intact in raw exports.": [
        "canonical Extended JSON में MongoDB संग्रह, typed Firestore दस्तावेज़ तथा Elasticsearch इंडेक्स, mappings और खोज देखें; raw निर्यात में सटीक संख्या डेटा सुरक्षित रखें।",
        "Explora MongoDB con Extended JSON canónico, documentos Firestore tipados e índices, mappings y búsquedas Elasticsearch; conserva números sensibles a precisión en exportaciones originales.",
        "Explore MongoDB en Extended JSON canonique, documents Firestore typés, index, mappings et recherches Elasticsearch ; garde la précision numérique dans les exports bruts.",
        "MongoDB mit kanonischem Extended JSON, typisierte Firestore-Dokumente und Elasticsearch-Indizes, Mappings und Ergebnisse durchsuchen; genaue Zahlen in Rohdatenexporten erhalten.",
        "MongoDBをcanonical Extended JSON、Firestoreを型付き文書で閲覧し、Elasticsearchのインデックス・マッピング・検索結果を扱います。生データ出力で数値精度を維持します。",
        "以规范 Extended JSON 浏览 MongoDB 集合、类型化 Firestore 文档及 Elasticsearch 索引、映射与搜索结果；原始导出保留精度敏感数值。",
        "تصفّح MongoDB بـExtended JSON القياسي ووثائق Firestore المعرّفة الأنواع وفهارس Elasticsearch وخرائطها ونتائجها، مع حفظ الأرقام الدقيقة في التصدير الخام."
    ],
    "Keep Document Data Explorer read-only, with bounded responses, query timeouts and explicit cloud credentials or isolated emulator settings.": [
        "Document Data Explorer केवल-पठन है; सीमित उत्तर, क्वेरी समय-सीमा और स्पष्ट क्लाउड क्रेडेंशियल या पृथक emulator सेटिंग हैं।",
        "Document Data Explorer permanece de solo lectura, con respuestas acotadas, tiempos límite y credenciales cloud explícitas o emuladores aislados.",
        "Document Data Explorer reste en lecture seule, avec réponses bornées, délais et identifiants cloud explicites ou émulateurs isolés.",
        "Document Data Explorer bleibt schreibgeschützt, mit begrenzten Antworten, Abfragefristen und expliziten Cloud-Zugangsdaten oder isolierten Emulatoren.",
        "Document Data Explorerは読み取り専用で、応答量・時間を制限し、明示的なクラウド資格情報か分離エミュレーター設定を使います。",
        "Document Data Explorer 保持只读，限制响应量和查询时间，使用明确的云凭据或隔离模拟器设置。",
        "أبقِ Document Data Explorer للقراءة فقط مع استجابات محدودة ومهل استعلام واعتمادات سحابة صريحة أو إعدادات محاكاة معزولة."
    ],
    "Data, APIs and references": [
        "डेटा, API और संदर्भ",
        "Datos, API y referencias",
        "Données, API et références",
        "Daten, APIs und Referenzen",
        "データ、API、資料",
        "数据、API 与参考",
        "البيانات وواجهات API والمراجع"
    ],
    "Convert spreadsheets with XLSX sheet selection, JSON, CSV and TSV; infer JSON Schema and generate models in nine target languages. Reject numeric values that Excel cannot preserve and keep quoted precision-sensitive values as text.": [
        "XLSX शीट चयन, JSON, CSV और TSV से स्प्रेडशीट बदलें; JSON Schema अनुमानित करें और नौ लक्ष्य भाषाओं में मॉडल बनाएं। Excel द्वारा सुरक्षित न रखे जा सकने वाले संख्यात्मक मान अस्वीकार करें और उद्धृत सटीकता-संवेदनशील मान पाठ के रूप में रखें।",
        "Convierte hojas con selección XLSX, JSON, CSV y TSV; infiere JSON Schema y genera modelos en nueve lenguajes. Rechaza valores numéricos que Excel no pueda preservar y conserva como texto los valores entre comillas sensibles a la precisión.",
        "Convertit les feuilles avec sélection XLSX, JSON, CSV et TSV ; infère JSON Schema et génère des modèles en neuf langages. Refuse les nombres qu’Excel ne peut préserver et conserve en texte les valeurs entre guillemets sensibles à la précision.",
        "Tabellen mit XLSX-Blattauswahl, JSON, CSV und TSV konvertieren; JSON Schema ableiten und Modelle für neun Zielsprachen erzeugen. Zahlen ablehnen, die Excel nicht unverändert speichern kann, und präzisionskritische Werte in Anführungszeichen als Text erhalten.",
        "XLSXのシート選択、JSON・CSV・TSV変換、JSON Schema推論、9言語のモデル生成に対応します。 Excelで保持できない数値は拒否し、引用符付きの精度が重要な値はテキストのまま維持します。",
        "转换支持 XLSX 工作表选择、JSON、CSV 和 TSV；推断 JSON Schema 并生成九种目标语言的模型。 拒绝 Excel 无法保真的数值，并将带引号的精度敏感值保留为文本。",
        "حوّل الجداول مع اختيار أوراق XLSX وJSON وCSV وTSV واستنتج JSON Schema وولّد نماذج بتسع لغات. ارفض الأرقام التي لا يستطيع Excel حفظها بدقة وأبقِ القيم الحساسة للدقة المحاطة باقتباس كنص."
    ],
    "Convert in all twelve directions between JSON, YAML, TOML and XML; report incompatible mappings and precision-sensitive values before they can change silently, and retain TOML timestamp fractions as text.": [
        "JSON, YAML, TOML और XML में सभी बारह दिशाओं में बदलें; असंगत मैपिंग और सटीकता-संवेदनशील मान बदलने से पहले बताएं तथा TOML समय की भिन्नात्मक इकाइयां पाठ रखें।",
        "Convierte en las doce direcciones entre JSON, YAML, TOML y XML; detecta incompatibilidades y pérdidas de precisión antes de cambios silenciosos, y conserva fracciones temporales TOML como texto.",
        "Convertit dans les douze sens entre JSON, YAML, TOML et XML ; signale incompatibilités et pertes de précision avant toute altération silencieuse, et conserve les fractions temporelles TOML comme texte.",
        "Alle zwölf Richtungen zwischen JSON, YAML, TOML und XML unterstützen; inkompatible Zuordnungen und Präzisionsrisiken vor stillen Änderungen melden und TOML-Zeitbruchteile als Text erhalten.",
        "JSON・YAML・TOML・XMLの全12方向を変換し、不適合や精度損失を黙って変更する前に通知します。TOML時刻の小数部は文字列で保持します。",
        "支持 JSON、YAML、TOML 和 XML 间全部十二个方向的转换，在静默更改前报告不兼容映射和精度敏感值，并将 TOML 时间戳小数保留为文本。",
        "حوّل بالاتجاهات الاثني عشر بين JSON وYAML وTOML وXML، وأبلغ عن عدم التوافق ومخاطر الدقة قبل التغيير الصامت واحفظ كسور أوقات TOML كنص."
    ],
    "Preserve exact JSON numeric spelling, negative zero, escaped strings and duplicate keys when formatting snippets, using JSON Formatter or running JSON format/minify workflow steps.": [
        "स्निपेट, JSON Formatter और JSON format/minify वर्कफ़्लो में संख्याओं का मूल लेखन, ऋणात्मक शून्य, escaped strings और दोहरी कुंजियां सुरक्षित रखें।",
        "Conserva la escritura numérica exacta, cero negativo, cadenas escapadas y claves duplicadas al formatear fragmentos, usar JSON Formatter o flujos JSON format/minify.",
        "Préserve chiffres exacts, zéro négatif, chaînes échappées et clés dupliquées dans les extraits, JSON Formatter et workflows format/minify.",
        "Exakte JSON-Zahlenschreibweise, negative Null, Escape-Zeichen und doppelte Schlüssel beim Formatieren von Snippets, mit JSON Formatter oder Workflows erhalten.",
        "スニペット整形、JSON Formatter、JSON整形・圧縮ワークフローで、数値表記・負のゼロ・エスケープ文字列・重複キーを維持します。",
        "在格式化片段、使用 JSON Formatter 或运行 JSON 格式化／压缩工作流时，保留精确数值写法、负零、转义字符串和重复键。",
        "احفظ كتابة أرقام JSON والصفر السالب والنصوص المهروبة والمفاتيح المكررة عند تنسيق الشيفرات أو استخدام JSON Formatter أو سير عمل التنسيق والتصغير."
    ],
    "Add JMESPath and interactive JSON graphs with search, JSONPath focus, tables and image exports; expand binary Base64 and arbitrary-base number conversion.": [
        "खोज, JSONPath फ़ोकस, तालिकाओं और छवि निर्यात वाले JMESPath तथा इंटरैक्टिव JSON ग्राफ़ जोड़ें; बाइनरी Base64 और किसी भी आधार की संख्या बदलना विस्तृत करें।",
        "Añade JMESPath y grafos JSON interactivos con búsqueda, enfoque JSONPath, tablas y exportación de imágenes; amplía Base64 binario y conversión de bases.",
        "Ajoute JMESPath et graphes JSON interactifs avec recherche, focus JSONPath, tableaux et export d’images ; enrichit Base64 binaire et les bases numériques.",
        "JMESPath und interaktive JSON-Graphen mit Suche, JSONPath-Fokus, Tabellen und Bildexport ergänzen; binäres Base64 und freie Zahlenbasen erweitern.",
        "JMESPath、検索・JSONPathフォーカス・表・画像出力付きのJSONグラフを追加し、バイナリBase64と任意基数変換を拡充します。",
        "新增 JMESPath 和支持搜索、JSONPath 聚焦、表格与图像导出的交互式 JSON 图，并扩展二进制 Base64 和任意进制转换。",
        "أضف JMESPath ومخططات JSON تفاعلية بالبحث وتركيز JSONPath والجداول وتصدير الصور، ووسّع Base64 الثنائي وتحويل قواعد الأعداد."
    ],
    "Infer numeric schema types from original JSON tokens. Reject input numbers that would round during JSON queries, with an explicit option to preserve affected values as strings.": [
        "मूल JSON टोकन से स्कीमा के संख्यात्मक प्रकार अनुमानित करें। क्वेरी में राउंड होने वाली संख्याएं रोकें और प्रभावित मानों को strings में सुरक्षित रखने का स्पष्ट विकल्प दें।",
        "Infiere tipos numéricos desde tokens JSON originales. Rechaza números que se redondearían en consultas y permite preservar los afectados como cadenas.",
        "Infère les types numériques des tokens JSON originaux. Refuse les nombres arrondis par les requêtes et propose explicitement de les préserver en chaînes.",
        "Numerische Schematypen aus ursprünglichen JSON-Tokens ableiten. Rundende Abfragen ablehnen und betroffene Werte auf Wunsch als Strings erhalten.",
        "元のJSONトークンから数値型を推論し、クエリで丸められる数値を拒否します。対象値を文字列で保持する明示的な選択肢も用意します。",
        "从原始 JSON token 推断数值架构类型。拒绝查询中会被舍入的输入数值，并提供将受影响值保留为字符串的明确选项。",
        "استنتج أنواع المخطط الرقمية من رموز JSON الأصلية وارفض الأرقام التي ستُقرّب في الاستعلامات مع خيار صريح لحفظها كنصوص."
    ],
    "Build GraphQL operations from schema fields; use visual cron controls with time zones, plan across DST changes and convert units across 34 scientific and engineering categories.": [
        "स्कीमा फ़ील्ड से GraphQL ऑपरेशन बनाएं; समय क्षेत्रों वाले दृश्य cron, DST-पार योजना और 34 वैज्ञानिक/इंजीनियरिंग श्रेणियों की इकाई बदलना प्रयोग करें।",
        "Construye operaciones GraphQL desde el esquema; usa cron visual con zonas horarias, planifica cambios DST y convierte unidades en 34 categorías científicas y técnicas.",
        "Construit GraphQL depuis les champs du schéma ; propose cron visuel avec fuseaux, planification aux changements DST et conversion dans 34 catégories scientifiques et techniques.",
        "GraphQL aus Schemafeldern erstellen; visuelles Cron mit Zeitzonen, DST-Planung und Einheiten für 34 Wissenschafts- und Technikkategorien nutzen.",
        "スキーマからGraphQL操作を作成し、タイムゾーン付きcron、DSTをまたぐ計画、34分野の科学・工学単位変換に対応します。",
        "根据架构字段构建 GraphQL 操作；使用带时区的可视化 cron 控件，规划跨夏令时变更的时间，并在 34 个科学工程类别间转换单位。",
        "أنشئ عمليات GraphQL من حقول المخطط واستخدم cron المرئي بالمناطق الزمنية وخطّط لتغيّر DST وحوّل الوحدات في 34 فئة علمية وهندسية."
    ],
    "Generate TOTP codes, namespaced UUIDs and ULIDs, bulk secrets, PHP/Ruby/C# API client snippets and documented Docker Compose starters.": [
        "TOTP, namespace UUID, ULID, bulk secrets, PHP/Ruby/C# API client स्निपेट और दस्तावेज़युक्त Docker Compose starters बनाएं।",
        "Genera TOTP, UUID con namespace, ULID, secretos por lotes, clientes API PHP/Ruby/C# y plantillas Docker Compose documentadas.",
        "Génère TOTP, UUID avec espace de noms, ULID, secrets en lot, clients API PHP/Ruby/C# et modèles Docker Compose documentés.",
        "TOTP, Namespace-UUIDs, ULIDs, Sammelgeheimnisse, PHP/Ruby/C#-API-Snippets und dokumentierte Docker-Compose-Vorlagen erzeugen.",
        "TOTP、名前空間UUID、ULID、一括シークレット、PHP/Ruby/C#のAPIクライアント、説明付きDocker Compose雛形を生成します。",
        "生成 TOTP、命名空间 UUID、ULID、批量密钥、PHP/Ruby/C# API 客户端片段以及有文档的 Docker Compose 起始配置。",
        "ولّد TOTP وUUID بأسماء نطاقية وULID وأسرارًا مجمّعة وشيفرات عملاء API لـPHP/Ruby/C# وقوالب Docker Compose موثقة."
    ],
    "Run HTTP collections with variable captures and assertions, call proto-defined gRPC methods and start bounded temporary localhost HTTP mocks through authenticated native transports.": [
        "HTTP संग्रह में variable capture और assertions चलाएं; proto-परिभाषित gRPC कॉल करें और प्रमाणित native transports से सीमित अस्थायी localhost HTTP mocks शुरू करें।",
        "Ejecuta colecciones HTTP con capturas y aserciones, llama gRPC definido por proto y crea mocks HTTP localhost temporales y acotados mediante transportes nativos autenticados.",
        "Exécute des collections HTTP avec captures et assertions, appelle gRPC défini par proto et lance des mocks HTTP localhost temporaires bornés via transports natifs authentifiés.",
        "HTTP-Sammlungen mit Variablenübernahmen und Prüfungen ausführen, proto-definierte gRPC-Methoden aufrufen und begrenzte temporäre localhost-HTTP-Mocks über authentifizierte native Transporte starten.",
        "変数取得・検証付きHTTPコレクション、proto定義gRPC呼出し、認証済みネイティブ転送による一時localhost HTTPモックを上限付きで実行できます。",
        "运行支持变量捕获和断言的 HTTP 集合，调用 proto 定义的 gRPC 方法，并通过认证原生传输启动有界临时 localhost HTTP 模拟服务。",
        "شغّل مجموعات HTTP بالتقاط المتغيرات والتأكيدات واستدعِ طرق gRPC المعرّفة بـproto وابدأ محاكيات HTTP localhost مؤقتة ومحدودة عبر نقل أصلي موثّق."
    ],
    "Format PostgreSQL, MySQL and SQLite syntax without changing quoted values; convert HTML into Markdown and export sanitized HTML documents.": [
        "quoted values बदले बिना PostgreSQL, MySQL और SQLite फ़ॉर्मैट करें; HTML से Markdown और स्वच्छ HTML दस्तावेज़ निर्यात करें।",
        "Formatea PostgreSQL, MySQL y SQLite sin alterar valores entre comillas; convierte HTML a Markdown y exporta HTML saneado.",
        "Formate PostgreSQL, MySQL et SQLite sans changer les valeurs citées ; convertit HTML en Markdown et exporte du HTML assaini.",
        "PostgreSQL-, MySQL- und SQLite-Syntax ohne Änderung zitierter Werte formatieren; HTML in Markdown umwandeln und bereinigtes HTML exportieren.",
        "引用値を変えずにPostgreSQL・MySQL・SQLiteを整形し、HTMLからMarkdownへの変換と安全化したHTML出力に対応します。",
        "格式化 PostgreSQL、MySQL 和 SQLite 语法且不改变引号中的值；将 HTML 转为 Markdown 并导出净化后的 HTML 文档。",
        "نسّق PostgreSQL وMySQL وSQLite دون تغيير القيم المقتبسة وحوّل HTML إلى Markdown وصدّر مستندات HTML منقّحة."
    ],
    "Inspect keyboard events and user agents, query RDAP registration data, run explicit email MX diagnostics and generate local gitignore starters.": [
        "कीबोर्ड इवेंट और user agent देखें, RDAP पंजीकरण पूछें, स्पष्ट email MX जांच चलाएं और स्थानीय gitignore starters बनाएं।",
        "Inspecciona eventos de teclado y agentes de usuario, consulta RDAP, ejecuta diagnósticos MX explícitos y genera plantillas gitignore locales.",
        "Inspecte clavier et agents utilisateur, interroge RDAP, lance explicitement des diagnostics MX et génère des modèles gitignore locaux.",
        "Tastaturereignisse und User-Agents untersuchen, RDAP abfragen, explizite E-Mail-MX-Diagnosen ausführen und lokale gitignore-Vorlagen erzeugen.",
        "キーボードイベントとUser-Agentの確認、RDAP照会、明示的なメールMX診断、ローカルgitignore雛形生成に対応します。",
        "检查键盘事件和用户代理，查询 RDAP 注册数据，明确执行邮件 MX 诊断，并生成本地 gitignore 模板。",
        "افحص أحداث لوحة المفاتيح ووكلاء المستخدم واستعلم عن RDAP وشغّل تشخيص MX صراحة وولّد قوالب gitignore محلية."
    ],
    "Correctness and compatibility": [
        "शुद्धता और संगतता",
        "Corrección y compatibilidad",
        "Exactitude et compatibilité",
        "Korrektheit und Kompatibilität",
        "正確さと互換性",
        "正确性与兼容性",
        "الصحة والتوافق"
    ],
    "Keep exact YAML numeric tokens when formatting snippets or standalone documents, including large integers, long decimals and negative zero.": [
        "स्निपेट और स्वतंत्र YAML फ़ॉर्मैटिंग में बड़े integers, लंबी दशमलव संख्याओं और ऋणात्मक शून्य सहित मूल numeric tokens सुरक्षित रखें।",
        "Conserva tokens numéricos YAML exactos, incluidos enteros grandes, decimales largos y cero negativo, al formatear fragmentos o documentos.",
        "Préserve les tokens numériques YAML exacts, grands entiers, longs décimaux et zéro négatif dans extraits et documents.",
        "Exakte YAML-Zahlentokens einschließlich großer Ganzzahlen, langer Dezimalzahlen und negativer Null beim Formatieren erhalten.",
        "スニペットと単独文書のYAML整形で、大整数、長い小数、負のゼロを含む元の数値トークンを保持します。",
        "格式化片段或独立 YAML 文档时保留精确数值 token，包括大整数、长小数和负零。",
        "احفظ رموز أرقام YAML الدقيقة بما فيها الأعداد الكبيرة والكسور الطويلة والصفر السالب عند تنسيق الشيفرات أو المستندات."
    ],
    "Encode supplementary Unicode characters correctly in HTML references and UTF-16; decode one entity layer and preserve ordinary versus non-breaking spaces.": [
        "पूरक Unicode वर्ण HTML references और UTF-16 में सही encode करें; एक entity layer decode करें और सामान्य/न टूटने वाले स्पेस अलग रखें।",
        "Codifica Unicode suplementario correctamente en HTML y UTF-16; decodifica una capa de entidades y distingue espacios normales e inseparables.",
        "Encode correctement Unicode supplémentaire en références HTML et UTF-16 ; décode une couche d’entités et distingue espaces ordinaires et insécables.",
        "Ergänzende Unicode-Zeichen korrekt in HTML-Referenzen und UTF-16 kodieren, eine Entitätsebene dekodieren und normale/geschützte Leerzeichen unterscheiden.",
        "補助Unicode文字をHTML参照とUTF-16で正しく符号化し、エンティティを1段階だけ復号して通常空白と改行禁止空白を区別します。",
        "正确将补充 Unicode 字符编码为 HTML 字符引用和 UTF-16；仅解码一层实体，并保留普通空格与不换行空格的区别。",
        "رمّز أحرف Unicode التكميلية صحيحًا في مراجع HTML وUTF-16 وفك طبقة كيانات واحدة وميّز المسافات العادية وغير القابلة للكسر."
    ],
    "Open the CSV-to-XML entry route in XML mode; initialize timestamp clocks after hydration and reject out-of-range input without replacing the date draft.": [
        "CSV-to-XML मार्ग XML मोड में खोलें; hydration के बाद घड़ी शुरू करें और सीमा-बाहर timestamp रोकते समय तारीख draft न बदलें।",
        "Abre la ruta CSV a XML en modo XML; inicia relojes tras hidratar y rechaza fechas fuera de rango sin reemplazar el borrador.",
        "Ouvre CSV vers XML en mode XML ; initialise les horloges après hydratation et refuse les valeurs hors plage sans remplacer la date saisie.",
        "CSV-zu-XML im XML-Modus öffnen; Zeitstempeluhren nach Hydrierung starten und ungültige Bereiche ohne Überschreiben des Datumsentwurfs ablehnen.",
        "CSV-to-XML入口をXMLモードで開き、時計をハイドレーション後に初期化し、範囲外日時でも編集中の日付を消しません。",
        "以 XML 模式打开 CSV-to-XML 入口；水合后初始化时间戳时钟，拒绝越界输入时不替换日期草稿。",
        "افتح مسار CSV-to-XML بوضع XML وهيّئ الساعة بعد الترطيب وارفض القيم خارج النطاق دون استبدال مسودة التاريخ."
    ],
    "Identify CryptoJS Keccak digests accurately in displayed and copied results; show the AES tool's actual fixed legacy AES-256-CBC format and unauthenticated-data limitation.": [
        "दिखाए/कॉपी CryptoJS Keccak digest सही नाम दें; AES का वास्तविक स्थिर legacy AES-256-CBC फ़ॉर्मैट और बिना authentication की सीमा स्पष्ट करें।",
        "Identifica correctamente Keccak de CryptoJS en pantalla y copia; muestra el formato heredado fijo AES-256-CBC y su falta de autenticación.",
        "Identifie correctement Keccak de CryptoJS à l’affichage et à la copie ; indique le format fixe ancien AES-256-CBC et l’absence d’authentification.",
        "CryptoJS-Keccak-Digests in Anzeige und Kopie richtig benennen; tatsächliches festes altes AES-256-CBC-Format und fehlende Authentifizierung zeigen.",
        "表示・コピーするCryptoJS Keccakの名称を正し、AESツールが固定の旧式AES-256-CBCで認証機能を持たないことを明記します。",
        "准确标识显示和复制结果中的 CryptoJS Keccak 摘要；说明 AES 工具实际使用固定旧式 AES-256-CBC 格式且不提供数据认证。",
        "سمِّ نتائج CryptoJS Keccak المعروضة والمنسوخة بدقة ووضّح صيغة AES-256-CBC القديمة الثابتة وحدود غياب مصادقة البيانات."
    ],
    "Repair JWE direct encryption, AES key wrapping and CBC-HMAC authentication; preserve exact decrypted UTF-8 and require correctly sized keys.": [
        "JWE direct encryption, AES key wrapping और CBC-HMAC authentication सुधारें; exact decrypted UTF-8 बचाएं और सही key sizes अनिवार्य करें।",
        "Repara cifrado directo JWE, envoltura AES y autenticación CBC-HMAC; conserva UTF-8 descifrado exacto y exige claves del tamaño correcto.",
        "Répare chiffrement direct JWE, enveloppement AES et authentification CBC-HMAC ; conserve exactement l’UTF-8 déchiffré et exige les bonnes tailles de clés.",
        "JWE-Direktverschlüsselung, AES-Key-Wrapping und CBC-HMAC reparieren; exaktes entschlüsseltes UTF-8 bewahren und korrekte Schlüssellängen verlangen.",
        "JWE直接暗号化、AESキーラップ、CBC-HMAC認証を修正し、復号UTF-8を正確に保持して適切な鍵長を要求します。",
        "修复 JWE 直接加密、AES 密钥包装和 CBC-HMAC 认证；保留精确解密 UTF-8，并要求正确长度的密钥。",
        "أصلح تشفير JWE المباشر وتغليف مفاتيح AES ومصادقة CBC-HMAC واحفظ UTF-8 المفكوك بدقة واطلب أحجام المفاتيح الصحيحة."
    ],
    "Sign and verify Unicode JWS payloads, match expected algorithms and key requirements, and generate JWK metadata consistent with the actual key.": [
        "Unicode JWS payload sign/verify करें, अपेक्षित algorithm और key नियम मिलाएं तथा वास्तविक key के अनुरूप JWK metadata बनाएं।",
        "Firma y verifica cargas JWS Unicode, exige algoritmos y claves esperados y genera metadatos JWK acordes con la clave real.",
        "Signe et vérifie JWS Unicode, contrôle algorithmes et exigences de clés et génère des métadonnées JWK cohérentes.",
        "Unicode-JWS-Payloads signieren/prüfen, erwartete Algorithmen und Schlüsselregeln abgleichen und passende JWK-Metadaten erzeugen.",
        "Unicode JWSペイロードの署名・検証、指定アルゴリズムと鍵要件の照合、実際の鍵に一致するJWKメタデータ生成を行います。",
        "签名并验证 Unicode JWS 负载，匹配预期算法和密钥要求，并生成与实际密钥一致的 JWK 元数据。",
        "وقّع وتحقق من حمولات JWS Unicode وطابق الخوارزميات ومتطلبات المفاتيح وولّد بيانات JWK المتوافقة مع المفتاح الفعلي."
    ],
    "Preserve URL percent-encoded query values and support IPv4 /0; accept JSON/YAML OpenAPI input and explicitly encode A2A Basic credentials as UTF-8/NFC.": [
        "URL की percent-encoded query सुरक्षित रखें और IPv4 /0 संभालें; OpenAPI के JSON/YAML input और A2A Basic credentials के स्पष्ट UTF-8/NFC encoding का समर्थन दें।",
        "Conserva consultas URL codificadas y admite IPv4 /0; acepta OpenAPI JSON/YAML y codifica credenciales A2A Basic explícitamente en UTF-8/NFC.",
        "Préserve les paramètres URL encodés et IPv4 /0 ; accepte OpenAPI JSON/YAML et encode explicitement A2A Basic en UTF-8/NFC.",
        "Prozentkodierte URL-Abfragen und IPv4 /0 erhalten; JSON/YAML-OpenAPI akzeptieren und A2A-Basic-Zugangsdaten explizit als UTF-8/NFC kodieren.",
        "URLのパーセント符号化クエリとIPv4 /0を維持し、JSON/YAMLのOpenAPI入力とA2A Basicの明示的UTF-8/NFC符号化に対応します。",
        "保留 URL 百分号编码查询值并支持 IPv4 /0；接受 JSON/YAML OpenAPI 输入，并明确以 UTF-8/NFC 编码 A2A Basic 凭据。",
        "احفظ معاملات URL المرمّزة وادعم IPv4 /0 واقبل OpenAPI بصيغتي JSON/YAML ورمّز اعتمادات A2A Basic صراحةً بـUTF-8/NFC."
    ],
    "Isolate Mermaid previews in a sandbox with strict rendering and escape document titles in exported HTML.": [
        "Mermaid preview को strict rendering वाले sandbox में अलग करें और exported HTML के document titles escape करें।",
        "Aísla vistas Mermaid en sandbox estricto y escapa títulos en HTML exportado.",
        "Isole Mermaid dans un bac à sable à rendu strict et échappe les titres du HTML exporté.",
        "Mermaid-Vorschau in Sandbox mit striktem Rendering isolieren und HTML-Exporttitel maskieren.",
        "Mermaidを厳密描画のサンドボックスで分離し、出力HTMLの文書タイトルをエスケープします。",
        "在严格渲染的沙箱中隔离 Mermaid 预览，并对导出 HTML 的文档标题转义。",
        "اعزل معاينات Mermaid في صندوق معزول برسم صارم واهرب عناوين المستندات في HTML المصدّر."
    ],
    "Keep QR results tied to the latest input and report generation failures; reject unsupported Canvas encoders before a download can receive the wrong extension.": [
        "QR परिणाम नवीनतम input से जुड़े रखें और त्रुटियां बताएं; गलत extension से बचाने के लिए असमर्थित Canvas encoders रोकें।",
        "Vincula QR a la entrada más reciente y muestra fallos; rechaza codificadores Canvas incompatibles antes de descargar con extensión incorrecta.",
        "Lie QR à la dernière saisie et signale les échecs ; refuse les encodeurs Canvas non pris en charge avant une mauvaise extension.",
        "QR-Ergebnisse an neueste Eingabe binden und Fehler melden; nicht unterstützte Canvas-Encoder vor Downloads mit falscher Endung ablehnen.",
        "QR結果を最新入力に結び付けて失敗を通知し、未対応Canvas形式を拒否して誤った拡張子の保存を防ぎます。",
        "将 QR 结果绑定到最新输入并报告生成失败；在下载被赋予错误扩展名前拒绝不支持的 Canvas 编码器。",
        "اربط نتائج QR بأحدث إدخال وأبلغ عن الفشل وارفض مرمّزات Canvas غير المدعومة قبل تنزيل بامتداد خاطئ."
    ],
    "Certificates and SSH keys": [
        "प्रमाणपत्र और SSH keys",
        "Certificados y claves SSH",
        "Certificats et clés SSH",
        "Zertifikate und SSH-Schlüssel",
        "証明書とSSH鍵",
        "证书与 SSH 密钥",
        "الشهادات ومفاتيح SSH"
    ],
    "Generate real self-signed X.509 certificates and PKCS#10 requests with matching keys and validated subject alternative names; generate native Ed25519 keys when the browser supports them.": [
        "मेल खाते keys और जांचे SAN के साथ असली self-signed X.509 प्रमाणपत्र व PKCS#10 अनुरोध बनाएं; समर्थित ब्राउज़र में native Ed25519 keys बनाएं।",
        "Genera certificados X.509 autofirmados y solicitudes PKCS#10 reales con claves y SAN validados; usa Ed25519 nativo cuando el navegador lo admita.",
        "Génère de vrais certificats X.509 autosignés et requêtes PKCS#10 avec clés correspondantes et SAN validés ; Ed25519 natif si pris en charge.",
        "Echte selbstsignierte X.509-Zertifikate und PKCS#10-Anträge mit passenden Schlüsseln und geprüften SANs erzeugen; natives Ed25519 bei Browserunterstützung.",
        "対応する鍵と検証済みSANを持つ本物の自己署名X.509証明書・PKCS#10要求を生成し、対応ブラウザーではネイティブEd25519を使います。",
        "生成真实自签名 X.509 证书和 PKCS#10 请求，配套匹配密钥与经过验证的 SAN；浏览器支持时生成原生 Ed25519 密钥。",
        "ولّد شهادات X.509 ذاتية التوقيع وطلبات PKCS#10 فعلية بمفاتيح مطابقة وأسماء بديلة متحققة، ومفاتيح Ed25519 أصلية حين يدعمها المتصفح."
    ],
    "Export interoperable RSA, ECDSA and Ed25519 OpenSSH keys and SHA-256 fingerprints. Private files are unencrypted; add a passphrase locally with ssh-keygen.": [
        "अंतर-संगत RSA, ECDSA और Ed25519 OpenSSH keys व SHA-256 fingerprints निर्यात करें। निजी फ़ाइलें अनएन्क्रिप्टेड हैं; ssh-keygen से स्थानीय passphrase जोड़ें।",
        "Exporta claves OpenSSH RSA, ECDSA y Ed25519 interoperables y huellas SHA-256. Los archivos privados no están cifrados; añade una frase con ssh-keygen localmente.",
        "Exporte des clés OpenSSH RSA, ECDSA, Ed25519 interopérables et empreintes SHA-256. Fichiers privés non chiffrés ; ajoutez une phrase avec ssh-keygen localement.",
        "Interoperable RSA-, ECDSA- und Ed25519-OpenSSH-Schlüssel und SHA-256-Fingerprints exportieren. Private Dateien sind unverschlüsselt; Passphrase lokal mit ssh-keygen hinzufügen.",
        "相互運用可能なRSA・ECDSA・Ed25519 OpenSSH鍵とSHA-256指紋を出力します。秘密鍵ファイルは非暗号化なので、ローカルのssh-keygenでパスフレーズを付けます。",
        "导出可互操作的 RSA、ECDSA、Ed25519 OpenSSH 密钥和 SHA-256 指纹。私钥文件未加密，请在本地通过 ssh-keygen 添加口令。",
        "صدّر مفاتيح OpenSSH المتوافقة RSA وECDSA وEd25519 وبصمات SHA-256. الملفات الخاصة غير مشفّرة؛ أضف عبارة مرور محليًا باستخدام ssh-keygen."
    ],
    "Recognize PEM certificates in .crt and .cer uploads and retain the actual format of generated downloads.": [
        ".crt और .cer upload में PEM पहचानें और generated downloads का वास्तविक फ़ॉर्मैट बनाए रखें।",
        "Reconoce PEM en archivos .crt y .cer y conserva el formato real de las descargas generadas.",
        "Reconnaît PEM dans les fichiers .crt et .cer et conserve le vrai format des téléchargements.",
        "PEM in .crt- und .cer-Uploads erkennen und tatsächliches Format erzeugter Downloads erhalten.",
        ".crt・.cerのPEM証明書を認識し、生成物の実際のファイル形式を維持します。",
        "识别 .crt 和 .cer 上传中的 PEM 证书，并保留生成下载的实际格式。",
        "تعرّف على PEM في رفع .crt و.cer واحفظ التنسيق الحقيقي للتنزيلات المولّدة."
    ],
    "Images and design": [
        "छवियां और डिज़ाइन",
        "Imágenes y diseño",
        "Images et design",
        "Bilder und Gestaltung",
        "画像とデザイン",
        "图像与设计",
        "الصور والتصميم"
    ],
    "Build CSS gradients, layered shadows, elliptical radii, fluid typography, flex and grid layouts; explore color harmonies and shade scales, and create highlighted code screenshots.": [
        "CSS रंग-क्रम, परतदार छायाएं, अंडाकार कोने, प्रवाही टाइपोग्राफ़ी और flex/grid लेआउट बनाएं; रंग सामंजस्य, शेड स्तर और सिंटैक्स रंग वाले कोड स्क्रीनशॉट तैयार करें।",
        "Crea degradados CSS, sombras, radios elípticos, tipografía fluida y layouts flex/grid; explora armonías, escalas y capturas de código resaltado.",
        "Crée dégradés CSS, ombres, rayons elliptiques, typographie fluide et mises en page flex/grid ; explore harmonies, nuances et captures de code coloré.",
        "CSS-Verläufe, mehrschichtige Schatten, elliptische Radien, fließende Typografie und Flex/Grid erstellen; Farbharmonien, Abstufungen und hervorgehobene Codebilder nutzen.",
        "CSSグラデーション、重ね影、楕円角丸、流動文字、flex・gridを作成し、配色調和・階調・構文色付きコード画像を扱えます。",
        "构建 CSS 渐变、多层阴影、椭圆圆角、流式排版及 flex/grid 布局；探索配色和色阶，并创建高亮代码截图。",
        "أنشئ تدرجات CSS وظلالًا متعددة وأنصاف أقطار بيضاوية وطباعة مرنة وتخطيطات flex وgrid، واستكشف التناغم والدرجات وأنشئ صور شيفرة ملوّنة."
    ],
    "Inspect EXIF and image metadata, remove supported metadata without recompressing image data, and create multi-image ICO, maskable PNG and manifest bundles.": [
        "EXIF और छवि metadata देखें, बिना image data दोबारा compress किए समर्थित metadata हटाएं और multi-image ICO, maskable PNG व manifest bundles बनाएं।",
        "Inspecciona EXIF y metadatos, elimina los compatibles sin recomprimir imágenes y crea paquetes ICO multimagen, PNG adaptable y manifiestos.",
        "Inspecte EXIF et métadonnées, retire celles prises en charge sans recompression et crée ICO multi-images, PNG maskable et manifestes.",
        "EXIF und Metadaten untersuchen, unterstützte Metadaten ohne Bildneukomprimierung entfernen und Mehrbild-ICO, maskierbare PNGs und Manifestpakete erzeugen.",
        "EXIFと画像情報を確認し、対応メタデータを再圧縮なしで削除します。複数画像ICO、マスカブルPNG、マニフェストを生成します。",
        "检查 EXIF 和图像元数据，在不重新压缩图像数据的情况下移除支持的元数据，并创建多图 ICO、可遮罩 PNG 与清单包。",
        "افحص EXIF وبيانات الصور وأزل المدعوم منها دون إعادة ضغط الصورة وأنشئ ICO متعدد الصور وPNG قابلًا للقناع وحزم بيان."
    ],
    "Reference and workflow repairs": [
        "संदर्भ और वर्कफ़्लो सुधार",
        "Correcciones de referencias y flujos",
        "Corrections des références et workflows",
        "Referenz- und Workflowkorrekturen",
        "資料とワークフローの修正",
        "参考与工作流修复",
        "إصلاحات المراجع وسير العمل"
    ],
    "Preserve intervening snippet and bookmark edits during imports; guard binary-file reads against replacements or cancellation, and reject malformed file-vault records before saving.": [
        "आयात के दौरान किए गए स्निपेट/बुकमार्क संपादन रखें; फ़ाइल पढ़ने में replacement/cancel संभालें और खराब file-vault रिकॉर्ड सहेजने से पहले रोकें।",
        "Conserva ediciones de fragmentos y marcadores durante importaciones, protege lecturas binarias frente a reemplazo/cancelación y rechaza registros de archivos dañados antes de guardar.",
        "Préserve les modifications pendant l’import d’extraits/favoris, protège les lectures binaires contre remplacement/annulation et refuse les fichiers de coffre invalides avant sauvegarde.",
        "Zwischenzeitliche Snippet-/Lesezeichenänderungen beim Import erhalten, Binärlesevorgänge gegen Ersetzen/Abbrechen schützen und fehlerhafte Tresordateien vor Speicherung ablehnen.",
        "取込中のスニペット・ブックマーク編集を保持し、バイナリ読込の置換・取消を保護し、不正なファイル保管庫データは保存前に拒否します。",
        "导入时保留期间的片段和书签编辑；防止二进制读取被替换或取消后回写，并在保存前拒绝格式错误的文件保险库记录。",
        "احفظ تعديلات الشيفرات والإشارات أثناء الاستيراد واحمِ القراءة الثنائية من الاستبدال والإلغاء وارفض سجلات خزنة الملفات التالفة قبل الحفظ."
    ],
    "Validate complete IPv6, decimal-address and port inputs; return multiple services for shared ports and copy exact port numbers or CIDRs.": [
        "पूरा IPv6, decimal address और port input जांचें; साझा पोर्ट की सभी सेवाएं लौटाएं और पोर्ट/CIDR ठीक वैसे कॉपी करें।",
        "Valida entradas IPv6, direcciones decimales y puertos completas; muestra varios servicios por puerto y copia números o CIDR exactos.",
        "Valide entièrement IPv6, adresses décimales et ports ; renvoie tous les services d’un port partagé et copie ports/CIDR exactement.",
        "Vollständige IPv6-, Dezimaladress- und Porteingaben prüfen, mehrere Dienste gemeinsamer Ports liefern und Portnummern/CIDRs exakt kopieren.",
        "IPv6、十進アドレス、ポートの入力全体を検証し、共用ポートの複数サービスを表示して番号やCIDRを正確にコピーします。",
        "验证完整 IPv6、十进制地址及端口输入；为共享端口返回多个服务，并精确复制端口号或 CIDR。",
        "تحقق من إدخالات IPv6 والعناوين العشرية والمنافذ كاملة وأعد عدة خدمات للمنافذ المشتركة وانسخ أرقامها أو CIDR بدقة."
    ],
    "Update curated HTTP, RFC, port and IP references from primary sources; separate formal RFC maturity from obsolescence and deployment advice, and include current TLS, DMARC and IPv6 documentation references.": [
        "प्राथमिक स्रोतों से चुने HTTP, RFC, port और IP संदर्भ अपडेट करें; RFC की औपचारिक स्थिति को अप्रचलन/परिनियोजन सलाह से अलग रखें और मौजूदा TLS, DMARC व IPv6 दस्तावेज़ संदर्भ जोड़ें।",
        "Actualiza referencias HTTP, RFC, puertos e IP desde fuentes primarias; distingue madurez formal, obsolescencia y despliegue, e incluye TLS, DMARC y documentación IPv6 actuales.",
        "Actualise les références HTTP, RFC, ports et IP depuis les sources primaires ; distingue maturité formelle, obsolescence et déploiement et inclut TLS, DMARC et documentation IPv6 actuels.",
        "Ausgewählte HTTP-, RFC-, Port- und IP-Referenzen aus Primärquellen aktualisieren; RFC-Reife, Veraltung und Betriebshinweise trennen sowie aktuelle TLS-, DMARC- und IPv6-Dokumentationsreferenzen ergänzen.",
        "HTTP・RFC・ポート・IP資料を一次資料で更新し、正式なRFC成熟度と廃止・運用助言を区別します。TLS・DMARC・IPv6文書用範囲の資料も追加します。",
        "从一手来源更新精选 HTTP、RFC、端口和 IP 参考，区分正式 RFC 成熟度、废弃状态与部署建议，并加入当前 TLS、DMARC 和 IPv6 文档参考。",
        "حدّث مراجع HTTP وRFC والمنافذ وIP من المصادر الأولية وافصل نضج RFC الرسمي عن التقادم وإرشادات النشر وأدرج مراجع TLS وDMARC وتوثيق IPv6 الحالية."
    ],
    "Preserve exact model rates and context limits in pricing tables; correct YAML and EOT MIME mappings and include the generic binary media type.": [
        "मूल model rates और context limits रखें; YAML/EOT MIME mapping सुधारें और सामान्य binary media type जोड़ें।",
        "Conserva tarifas y límites de contexto exactos; corrige MIME de YAML/EOT e incluye el tipo binario genérico.",
        "Préserve tarifs et limites de contexte exacts ; corrige MIME YAML/EOT et ajoute le type binaire générique.",
        "Exakte Modellpreise und Kontextgrenzen erhalten; YAML-/EOT-MIME-Zuordnungen korrigieren und generischen Binärmedientyp ergänzen.",
        "モデル料金と文脈長上限を正確に保ち、YAML・EOTのMIMEを修正して汎用バイナリ型を追加します。",
        "保留模型精确费率和上下文限制，修正 YAML 与 EOT MIME 映射，并加入通用二进制媒体类型。",
        "احفظ أسعار النماذج وحدود السياق الدقيقة وصحح MIME لـYAML وEOT وأضف نوع الوسائط الثنائي العام."
    ],
    "Preserve physical JSONL line numbers, JSON null and original number tokens; reject precision-losing TOON conversions and preserve root arrays, scalar types and quoted strings with explicit legacy-array recovery.": [
        "JSONL की मूल पंक्ति संख्या, JSON null और numeric tokens रखें; सटीकता खोने वाला TOON रोकें और root arrays, scalar types व quoted strings के लिए स्पष्ट legacy-array recovery दें।",
        "Conserva líneas físicas JSONL, null y tokens numéricos; rechaza TOON con pérdida de precisión y preserva arrays raíz, escalares y cadenas citadas con recuperación explícita de arrays heredados.",
        "Préserve lignes physiques JSONL, null et tokens numériques ; refuse TOON avec perte de précision et garde tableaux racine, types scalaires et chaînes citées avec récupération explicite des anciens tableaux.",
        "Physische JSONL-Zeilennummern, null und Zahlentokens erhalten; verlustbehaftetes TOON ablehnen und Wurzelarrays, Skalartypen und zitierte Strings mit expliziter Altarray-Wiederherstellung bewahren.",
        "JSONLの物理行番号、null、数値トークンを維持します。精度を失うTOON変換を拒否し、ルート配列・スカラー型・引用文字列を保ち、旧配列の明示的な復旧を用意します。",
        "保留 JSONL 物理行号、JSON null 和原始数值 token；拒绝丢失精度的 TOON 转换，保留根数组、标量类型和引号字符串，并提供明确的旧数组恢复方式。",
        "احفظ أرقام أسطر JSONL الفعلية وJSON null ورموز الأرقام الأصلية وارفض TOON المفقِد للدقة واحفظ مصفوفات الجذر والأنواع القياسية والنصوص المقتبسة مع استرداد صريح للمصفوفات القديمة."
    ],
    "Keep countdowns aligned with elapsed time, cancel stale animation callbacks, prevent zero-valued dice and preserve active game results when changing language.": [
        "काउंटडाउन बीते समय के अनुरूप रखें, पुराने animation callbacks रद्द करें, शून्य पासा रोकें और भाषा बदलने पर चालू खेल परिणाम रखें।",
        "Ajusta cuentas atrás al tiempo transcurrido, cancela callbacks obsoletos, evita dados con cero y conserva partidas al cambiar de idioma.",
        "Aligne les comptes à rebours au temps écoulé, annule les rappels obsolètes, empêche les dés zéro et conserve les résultats au changement de langue.",
        "Countdowns an verstrichener Zeit ausrichten, veraltete Animationscallbacks abbrechen, Nullwürfe verhindern und Spielergebnisse beim Sprachwechsel erhalten.",
        "カウントダウンを経過時間に合わせ、古いアニメーション処理を取消し、サイコロの0を防ぎ、言語変更でも進行中の結果を保ちます。",
        "倒计时与经过时间保持一致，取消过期动画回调，防止骰子出现零值，切换语言时保留当前游戏结果。",
        "اربط العد التنازلي بالوقت المنقضي وألغِ ردود الحركة القديمة وامنع نردًا بقيمة صفر واحفظ نتائج اللعب عند تغيير اللغة."
    ],
    "Reject corrupted card-number input, retain generated batch metadata and export exact text, CSV or JSON fixtures with the correct media type. Generation does not verify an account or predict payment responses.": [
        "खराब card-number input रोकें, पुराने generated batch की metadata रखें और सही media type के साथ exact text/CSV/JSON निकालें। यह खाता सत्यापन या भुगतान परिणाम अनुमान नहीं है।",
        "Rechaza números de tarjeta corruptos, conserva metadatos del lote y exporta texto/CSV/JSON exactos con el MIME correcto. No verifica cuentas ni predice pagos.",
        "Refuse les numéros corrompus, garde les métadonnées du lot et exporte texte/CSV/JSON exacts avec le bon type. Ne vérifie pas de compte ni ne prédit le paiement.",
        "Beschädigte Karteneingaben ablehnen, Stapelmetadaten behalten und exakte Text-/CSV-/JSON-Daten mit richtigem Medientyp exportieren. Keine Kontoprüfung oder Zahlungsvorhersage.",
        "不正なカード番号を拒否し、生成済みバッチ情報を保持して正しい媒体型のテキスト・CSV・JSONを出力します。口座照会や決済予測は行いません。",
        "拒绝损坏的卡号输入，保留生成批次元数据，以正确媒体类型导出精确文本、CSV 或 JSON。生成不验证账户或预测付款结果。",
        "ارفض أرقام البطاقات الفاسدة واحفظ بيانات الدفعة وصدّر نصًا أو CSV أو JSON دقيقًا بنوع الوسائط الصحيح. التوليد لا يتحقق من الحساب ولا يتنبأ بالدفع."
    ],
    "Reject invalid contrast inputs, compare unrounded ratios and handle deterministic palette extraction, file races, decode failures and clipboard failures without false success notices.": [
        "गलत contrast input रोकें, बिना rounding ratios तुलना करें और deterministic palette, file races, decode/clipboard विफलताएं बिना झूठी सफलता संभालें।",
        "Rechaza contrastes inválidos, compara ratios sin redondear y gestiona extracción determinista, carreras de archivos y fallos de decodificación/portapapeles sin falsos éxitos.",
        "Refuse les entrées de contraste invalides, compare sans arrondi et gère palette déterministe, courses de fichiers et erreurs de décodage/presse-papiers sans faux succès.",
        "Ungültige Kontrastwerte ablehnen, ungerundete Verhältnisse vergleichen und deterministische Paletten, Dateirennen, Dekodier- und Zwischenablagefehler ohne falsche Erfolgsmeldung behandeln.",
        "不正なコントラスト入力を拒否して丸め前の比率を比較し、再現可能な配色抽出、ファイル競合、復号・コピー失敗を誤った成功表示なしで処理します。",
        "拒绝无效对比度输入、比较未舍入比率，并处理确定性调色板提取、文件竞争、解码及剪贴板失败，避免虚假成功提示。",
        "ارفض قيم التباين غير الصالحة وقارن النسب دون تقريب وتعامل مع الاستخراج الحتمي وتزامن الملفات وفشل فك الصور والحافظة دون نجاح زائف."
    ],
    "Keep SOAP and WSDL support boundaries explicit, preserve original XML and webhook bodies, quote generated shell arguments safely and avoid inferring an exact CORS failure cause from opaque browser errors.": [
        "SOAP/WSDL सीमाएं स्पष्ट रखें, मूल XML/webhook body बचाएं, shell arguments सुरक्षित quote करें और अस्पष्ट browser errors से सटीक CORS कारण न निकालें।",
        "Explicita límites SOAP/WSDL, conserva XML y cuerpos webhook originales, cita argumentos shell de forma segura y no deduce causas CORS exactas de errores opacos.",
        "Explicite les limites SOAP/WSDL, garde XML et corps webhook originaux, cite correctement le shell et n’infère pas une cause CORS précise d’erreurs opaques.",
        "SOAP-/WSDL-Grenzen offenlegen, ursprüngliches XML und Webhook-Bodys erhalten, Shellargumente sicher zitieren und aus undurchsichtigen Browserfehlern keine exakte CORS-Ursache ableiten.",
        "SOAP・WSDLの対応範囲を明確にし、元のXMLとwebhook本文を保持してシェル引数を安全に引用します。不透明なブラウザーエラーからCORS原因を断定しません。",
        "明确 SOAP/WSDL 支持边界，保留原始 XML 和 webhook 正文，安全引用生成的 shell 参数，并避免从不透明浏览器错误推断精确 CORS 原因。",
        "وضّح حدود SOAP وWSDL واحفظ XML وأجسام webhook الأصلية واقتبس معاملات shell بأمان ولا تستنتج سبب CORS دقيقًا من أخطاء متصفح مبهمة."
    ],
    "Tool guidance and data disclosures": [
        "टूल मार्गदर्शन और डेटा खुलासा",
        "Guías y avisos de datos",
        "Guides et déclarations de données",
        "Werkzeughilfe und Datenhinweise",
        "ツールの説明とデータ開示",
        "工具指南与数据披露",
        "إرشادات الأدوات وإفصاحات البيانات"
    ],
    "Show detailed network data disclosures collapsed by default, including the destination, sent fields, data handling and source links; distinguish direct browser requests, managed proxies, localhost connectors and model downloads.": [
        "गंतव्य, भेजे फ़ील्ड, डेटा प्रबंधन और स्रोत लिंक वाले network disclosures डिफ़ॉल्ट से बंद दिखाएं; browser direct, managed proxy, localhost और model downloads अलग स्पष्ट करें।",
        "Muestra avisos de red detallados contraídos, con destino, campos, tratamiento y fuentes; distingue navegador directo, proxies gestionados, localhost y descargas de modelos.",
        "Affiche les avis réseau détaillés repliés, avec destination, champs, traitement et sources ; distingue accès direct, proxies gérés, localhost et modèles téléchargés.",
        "Detaillierte Netzwerkhinweise standardmäßig einklappen, mit Ziel, Feldern, Verarbeitung und Quelllinks; direkte Browseranfragen, verwaltete Proxys, localhost und Modelldownloads unterscheiden.",
        "宛先・送信項目・処理・ソース付きの通信説明を初期状態で折り畳み、直接通信、管理プロキシ、localhost接続、モデル取得を区別します。",
        "默认折叠显示详细网络披露，包含目标、发送字段、数据处理和源码链接；区分浏览器直连、托管代理、localhost 连接器和模型下载。",
        "اعرض إفصاحات الشبكة التفصيلية مطوية افتراضيًا مع الوجهة والحقول والمعالجة والمصادر، وميّز الطلبات المباشرة والوكلاء المُدارين وlocalhost وتنزيل النماذج."
    ],
    "Add missing Learn More sections to 21 tool pages with practical instructions and limits; retain authored help and route aliases that open the corresponding tool tab.": [
        "21 टूल पृष्ठों में गायब Learn More जोड़ें; व्यावहारिक तरीके/सीमाएं बताएं और मौजूदा सहायता व सही टैब खोलने वाले route aliases रखें।",
        "Añade Aprender más a 21 páginas con instrucciones y límites; conserva ayuda y alias que abren la pestaña correspondiente.",
        "Ajoute En savoir plus à 21 pages avec instructions et limites ; conserve les aides et alias ouvrant le bon onglet.",
        "Fehlende Hilfe auf 21 Werkzeugseiten mit Anleitungen und Grenzen ergänzen; vorhandene Hilfe und Aliasse zum passenden Tab erhalten.",
        "21ページに不足していたLearn Moreを追加し、実用的な手順と制限を示します。既存の説明と対応タブを開く別名経路も保持します。",
        "为 21 个工具页补齐 Learn More，提供实用说明及限制，保留已有帮助和打开对应标签的路由别名。",
        "أضف Learn More المفقودة إلى 21 صفحة بإرشادات وحدود عملية، مع حفظ المساعدة وأسماء المسارات التي تفتح التبويب الموافق."
    ],
    "Translate generator, task and note controls and security helper findings; fix stable sample generation, Markdown table escaping, mock SQL identifiers, TypeScript inference, CSV quoting and explicit task import confirmations.": [
        "generator, task/note नियंत्रण और security helper निष्कर्ष अनुवाद करें; स्थिर samples, Markdown escaping, mock SQL identifiers, TypeScript inference, CSV quoting व स्पष्ट task import पुष्टि सुधारें।",
        "Traduce generadores, tareas, notas y hallazgos de seguridad; corrige muestras estables, tablas Markdown, identificadores SQL, inferencia TypeScript, CSV y confirmaciones de importación.",
        "Traduit générateurs, tâches, notes et diagnostics de sécurité ; corrige exemples stables, échappement Markdown, identifiants SQL, inférence TypeScript, CSV et confirmations d’import.",
        "Generator-, Aufgaben-/Notizbedienung und Sicherheitsergebnisse übersetzen; stabile Beispiele, Markdown-Escaping, SQL-Bezeichner, TypeScript-Ableitung, CSV-Zitate und Importbestätigungen korrigieren.",
        "生成・タスク・メモ操作とセキュリティ補助の診断を翻訳し、固定サンプル、Markdown表、SQL識別子、TypeScript推論、CSV引用、取込確認を修正します。",
        "翻译生成器、任务和便笺控件及安全辅助结论；修复稳定示例、Markdown 表格转义、模拟 SQL 标识符、TypeScript 推断、CSV 引用和明确任务导入确认。",
        "ترجم عناصر المولّدات والمهام والملاحظات ونتائج مساعدي الأمان، وأصلح الأمثلة الثابتة وهروب Markdown ومعرّفات SQL واستنتاج TypeScript واقتباس CSV وتأكيد الاستيراد."
    ],
    "Prepare safely quoted Java keytool commands with interactive password prompts, and describe the browser tool accurately as a PKCS#12 builder and command helper.": [
        "सुरक्षित quote और interactive password prompts वाले Java keytool commands बनाएं; ब्राउज़र टूल को सही रूप में PKCS#12 builder और command helper बताएं।",
        "Prepara comandos Java keytool citados con contraseñas interactivas; describe correctamente la herramienta como creador PKCS#12 y asistente de comandos.",
        "Prépare des commandes Java keytool citées avec mots de passe interactifs ; présente l’outil comme générateur PKCS#12 et assistant de commandes.",
        "Java-keytool-Befehle sicher zitieren und Passwörter interaktiv abfragen; Browserwerkzeug korrekt als PKCS#12-Ersteller und Befehlshelfer beschreiben.",
        "Java keytool引数を安全に引用し、パスワードを対話入力にします。ブラウザーツールはPKCS#12作成・コマンド補助として正確に説明します。",
        "准备安全引用且交互输入密码的 Java keytool 命令，准确将浏览器工具描述为 PKCS#12 构建器及命令辅助工具。",
        "جهّز أوامر Java keytool باقتباس آمن ومطالبات كلمات مرور تفاعلية وصف الأداة بدقة كباني PKCS#12 ومساعد أوامر."
    ],
    "Delivery and scope": [
        "वितरण और दायरा",
        "Distribución y alcance",
        "Distribution et périmètre",
        "Auslieferung und Umfang",
        "配布と対応範囲",
        "交付与范围",
        "التوزيع والنطاق"
    ],
    "Choose English, Hindi, Spanish, French, German, Japanese, Chinese or Arabic, including RTL navigation. Translate authored interface guidance, reference explanations, catalog descriptions and release notes while preserving code, identifiers and user data.": [
        "English, Hindi, Spanish, French, German, Japanese, Chinese या Arabic चुनें, RTL navigation सहित। निर्देश, संदर्भ, कैटलॉग विवरण और रिलीज़ नोट अनुवादित हों; code, identifiers और user data मूल रहें।",
        "Elige inglés, hindi, español, francés, alemán, japonés, chino o árabe con navegación RTL. Traduce guías, referencias, catálogo y notas, preservando código, identificadores y datos.",
        "Choisissez anglais, hindi, espagnol, français, allemand, japonais, chinois ou arabe avec navigation RTL. Traduit guides, références, catalogue et notes sans modifier code, identifiants ni données.",
        "Englisch, Hindi, Spanisch, Französisch, Deutsch, Japanisch, Chinesisch oder Arabisch samt RTL-Navigation wählen. Anleitung, Referenzen, Katalog und Versionshinweise übersetzen; Code, Bezeichner und Nutzerdaten erhalten.",
        "英語・ヒンディー語・スペイン語・フランス語・ドイツ語・日本語・中国語・アラビア語とRTLに対応し、説明・資料・カタログ・履歴を翻訳します。コード・識別子・ユーザーデータは変えません。",
        "支持英语、印地语、西班牙语、法语、德语、日语、中文和阿拉伯语及 RTL 导航；翻译界面指南、参考说明、目录描述和发行说明，保留代码、标识符与用户数据。",
        "اختر الإنجليزية أو الهندية أو الإسبانية أو الفرنسية أو الألمانية أو اليابانية أو الصينية أو العربية مع RTL. ترجم الإرشادات والمراجع والكتالوج والملاحظات مع حفظ الشيفرة والمعرّفات وبيانات المستخدم."
    ],
    "Bundle the production runtime and local assets in the desktop edition with a separate persistent profile and automatic native access. Current package validation covers macOS Apple Silicon with local ad-hoc signing; other platform targets and public signing need separate validation.": [
        "desktop edition में production runtime और local assets, अलग स्थायी profile व automatic native access पैक करें। मौजूदा validation केवल macOS Apple Silicon के local ad-hoc signing को कवर करता है; अन्य targets और public signing को अलग जांच चाहिए।",
        "Empaqueta runtime y recursos locales en escritorio con perfil separado y acceso nativo automático. La validación actual cubre macOS Apple Silicon con firma ad-hoc local; otras plataformas y firma pública requieren validación aparte.",
        "Intègre runtime et ressources locales au bureau avec profil persistant séparé et accès natif automatique. Validation actuelle sur macOS Apple Silicon signé ad-hoc localement ; autres cibles et signature publique à valider séparément.",
        "Produktionslaufzeit und lokale Assets mit getrenntem dauerhaftem Profil und automatischem nativem Zugriff bündeln. Bisherige Paketprüfung umfasst macOS Apple Silicon mit lokaler Ad-hoc-Signatur; andere Ziele und öffentliche Signaturen brauchen eigene Prüfung.",
        "デスクトップ版に実行環境とローカル資産を同梱し、別プロファイルと自動ネイティブアクセスを提供します。現行検証はmacOS Apple Siliconのローカルad-hoc署名に限定され、他OSと公開署名は別途検証が必要です。",
        "桌面版捆绑生产运行时和本地资源，使用独立持久配置及自动原生访问。当前软件包验证涵盖 macOS Apple Silicon 的本地 ad-hoc 签名；其他平台和公开签名需单独验证。",
        "اجمع بيئة الإنتاج والموارد المحلية بسطح المكتب مع ملف دائم منفصل ووصول أصلي تلقائي. التحقق الحالي يغطي macOS Apple Silicon بتوقيع ad-hoc محلي؛ تحتاج المنصات الأخرى والتوقيع العام تحققًا مستقلًا."
    ],
    "Publish a current canonical tool catalog, Markdown debugging guides and release notes, llms.txt and a custom read-only agent catalog; include a generated social preview and accurate structured counts.": [
        "मौजूदा canonical tool catalog, Markdown debugging guides, release notes, llms.txt और कस्टम read-only agent catalog प्रकाशित करें; generated social preview और सही structured counts जोड़ें।",
        "Publica catálogo canónico, guías Markdown, notas, llms.txt y catálogo de agentes de solo lectura; añade vista social generada y cifras estructuradas exactas.",
        "Publie catalogue canonique, guides Markdown, notes, llms.txt et catalogue d’agents en lecture seule ; inclut aperçu social généré et comptes structurés exacts.",
        "Aktuellen kanonischen Katalog, Markdown-Debugginghilfen, Versionshinweise, llms.txt und eigenen schreibgeschützten Agentenkatalog bereitstellen; generierte Social-Vorschau und korrekte strukturierte Zahlen ergänzen.",
        "正規ツール一覧、Markdownデバッグガイド、更新履歴、llms.txt、読み取り専用エージェント一覧を提供し、生成SNSプレビューと正確な構造化件数を含めます。",
        "发布当前规范工具目录、Markdown 调试指南、发行说明、llms.txt 和自定义只读代理目录，并包含生成的社交预览及准确结构化数量。",
        "انشر كتالوج أدوات بروابط أساسية حاليًا وأدلة Markdown وملاحظات الإصدار وllms.txt وكتالوج وكلاء للقراءة فقط، مع معاينة اجتماعية مولّدة وأعداد منظمة دقيقة."
    ],
    "Rename workspace tabs by double-clicking their names or pressing F2; use the top-corner close icon to confirm permanent deletion of the workspace and its saved content. Keep Personal protected and limit active workspaces to ten.": [
        "नाम double-click या F2 से टैब rename करें; ऊपर कोने का close icon कार्यक्षेत्र और सहेजी सामग्री की स्थायी deletion पुष्टि मांगे। Personal सुरक्षित रहे और सक्रिय सीमा दस हो।",
        "Renombra pestañas con doble clic o F2; la X superior confirma eliminar permanentemente el espacio y su contenido. Protege Personal y limita a diez espacios activos.",
        "Renomme les onglets par double clic ou F2 ; l’icône supérieure confirme la suppression définitive de l’espace et de son contenu. Protège Personal et limite à dix espaces actifs.",
        "Tabs per Doppelklick oder F2 umbenennen; Ecksymbol bestätigt dauerhaftes Löschen von Arbeitsbereich und Inhalt. Personal schützen und aktive Bereiche auf zehn begrenzen.",
        "名前のダブルクリックかF2でタブを改名し、上隅の閉じるアイコンで領域と保存内容の完全削除を確認します。Personalを保護し、有効領域を10件に制限します。",
        "双击名称或按 F2 重命名工作区标签；顶部角落关闭图标在确认后永久删除工作区及其内容，保护 Personal 并将活动工作区限制为十个。",
        "أعد تسمية التبويبات بالنقر المزدوج أو F2 واستخدم أيقونة الإغلاق العلوية لتأكيد الحذف الدائم للمساحة ومحتواها، مع حماية Personal وحد أقصى عشر مساحات نشطة."
    ],
    "Default to the compact workspace while respecting saved view choices; keep Show introduction available and remove the old live demo, recent/pinned block and paste-to-find section.": [
        "सहेजे गए दृश्य विकल्पों का सम्मान करते हुए कॉम्पैक्ट वर्कस्पेस को डिफ़ॉल्ट बनाएँ; परिचय दिखाएँ उपलब्ध रखें और पुराना लाइव डेमो, हाल का/पिन किया गया ब्लॉक और पेस्ट से खोज अनुभाग हटाएँ।",
        "Usa el espacio compacto por defecto respetando la vista guardada; conserva Mostrar introducción y elimina la demo antigua, el bloque reciente/fijado y la búsqueda por pegado.",
        "Utilisez l’espace compact par défaut en respectant le choix enregistré ; conservez Afficher l’introduction et retirez l’ancienne démo, le bloc récent/épinglé et la recherche par collage.",
        "Standardmäßig die kompakte Ansicht öffnen und gespeicherte Ansichtsoptionen beachten; Einführung anzeigen beibehalten und alte Live-Demo, letzte/angeheftete Elemente und Einfügesuche entfernen.",
        "保存した表示設定を尊重し、標準ではコンパクト表示にします。紹介を表示する操作は残し、旧ライブデモ、最近・固定項目、貼り付け検索を削除します。",
        "默认使用紧凑工作区并尊重已保存的视图选择；保留显示介绍选项，移除旧实时演示、最近／固定区块和粘贴搜索部分。",
        "اجعل مساحة العمل المضغوطة هي الافتراضية مع احترام خيارات العرض المحفوظة؛ أبقِ إظهار المقدمة وأزل العرض القديم وكتلة العناصر الأخيرة والمثبتة وقسم البحث باللصق."
    ],
    "Use Node.js 24 or newer for the full connector runtime and precision-preserving JSON support; keep native connector access on localhost with a separate access key.": [
        "पूर्ण connector runtime और सटीक JSON के लिए Node.js 24 या नया प्रयोग करें; native access localhost पर अलग access key से रखें।",
        "Usa Node.js 24 o posterior para el runtime completo y JSON preciso; mantiene acceso nativo en localhost con clave separada.",
        "Utilise Node.js 24 ou plus pour le runtime complet et JSON précis ; limite l’accès natif à localhost avec clé séparée.",
        "Node.js 24 oder neuer für vollständige Konnektoren und präzises JSON verwenden; nativen Zugriff auf localhost mit eigenem Schlüssel begrenzen.",
        "接続機能全体とJSON精度保持にはNode.js 24以降を使い、ネイティブアクセスは別鍵付きlocalhostに限定します。",
        "完整连接器运行时及精度保持 JSON 支持需使用 Node.js 24 或更新版本；原生访问保留在 localhost 并使用独立访问密钥。",
        "استخدم Node.js 24 أو أحدث لبيئة الموصلات الكاملة وJSON الدقيق، وأبقِ الوصول الأصلي على localhost بمفتاح منفصل."
    ],
    "Retain canonical category/tool URLs, self-hosted fonts and editor assets, light/dark themes and visited-page PWA caching. Network features still need connectivity.": [
        "canonical category/tool URL, self-hosted fonts/editor assets, light/dark और visited-page PWA caching रखें। Network सुविधाओं को इंटरनेट चाहिए।",
        "Conserva URL canónicas, fuentes y editor propios, temas claro/oscuro y caché PWA de páginas visitadas. Las funciones de red necesitan conexión.",
        "Conserve URL canoniques, polices et éditeur auto-hébergés, thèmes clair/sombre et cache PWA des pages visitées. Le réseau nécessite une connexion.",
        "Kanonische Kategorie-/Werkzeug-URLs, selbst gehostete Fonts/Editorassets, helle/dunkle Themen und PWA-Cache besuchter Seiten behalten. Netzwerkfunktionen brauchen Verbindung.",
        "正規URL、自己ホストのフォント・エディター、明暗テーマ、訪問済みページのPWAキャッシュを維持します。通信機能には接続が必要です。",
        "保留规范分类／工具 URL、自托管字体与编辑器资源、明暗主题及已访问页面 PWA 缓存。网络功能仍需连接。",
        "احفظ روابط الفئات والأدوات الأساسية والخطوط وموارد المحرر المستضافة محليًا والوضعين والتخزين PWA للصفحات المزارة. ميزات الشبكة تحتاج اتصالًا."
    ],
    "V1.6 — repeatable workflows, current protocols and a faster workspace": [
        "V1.6 — दोहराने योग्य वर्कफ़्लो, वर्तमान प्रोटोकॉल और तेज़ कार्यक्षेत्र",
        "V1.6 — flujos repetibles, protocolos actuales y un espacio más rápido",
        "V1.6 — flux reproductibles, protocoles actuels et espace plus rapide",
        "V1.6 — wiederholbare Abläufe, aktuelle Protokolle und schnellerer Arbeitsbereich",
        "V1.6 — 再現可能なワークフロー、最新プロトコル、高速なワークスペース",
        "V1.6 — 可重复工作流、现行协议与更快的工作区",
        "V1.6 — مسارات قابلة للتكرار وبروتوكولات حديثة ومساحة أسرع"
    ],
    "Adds four tools, refreshes version-sensitive references, and improves catalog performance, validation and privacy boundaries.": [
        "चार टूल जोड़ें, संस्करण-संवेदनशील संदर्भ ताज़ा करें और कैटलॉग प्रदर्शन, सत्यापन व गोपनीयता सीमाएं सुधारें।",
        "Añade cuatro herramientas, actualiza referencias sensibles a versiones y mejora rendimiento, validación y límites de privacidad.",
        "Ajoute quatre outils, actualise les références liées aux versions et améliore performances, validation et frontières de confidentialité.",
        "Vier Werkzeuge ergänzen, versionsabhängige Referenzen aktualisieren und Katalogleistung, Validierung und Datenschutzgrenzen verbessern.",
        "4つのツールを追加し、バージョン依存の資料を更新。カタログ性能、検証、プライバシー境界を改善します。",
        "新增四项工具，更新对版本敏感的参考资料，并改进目录性能、验证及隐私边界。",
        "يضيف أربع أدوات ويحدّث المراجع المرتبطة بالإصدارات ويحسن أداء الكتالوج والتحقق وحدود الخصوصية."
    ],
    "New tools and workflows": [
        "नए टूल और वर्कफ़्लो",
        "Nuevas herramientas y flujos",
        "Nouveaux outils et flux",
        "Neue Werkzeuge und Abläufe",
        "新しいツールとワークフロー",
        "新工具与工作流",
        "أدوات ومسارات عمل جديدة"
    ],
    "Save executable local workflows for decoding, JSON formatting, JSONPath, redaction, fixture comparison and SHA-256; pin workflows and opt in to draft restoration.": [
        "डिकोडिंग, JSON फ़ॉर्मैटिंग, JSONPath, जानकारी छिपाने, फ़िक्स्चर तुलना और SHA-256 के लिए चलने योग्य स्थानीय वर्कफ़्लो सहेजें; वर्कफ़्लो पिन करें और चाहें तो ड्राफ़्ट बहाली चालू करें।",
        "Guarda flujos locales ejecutables para decodificar, formatear JSON, JSONPath, ocultar datos, comparar fixtures y SHA-256; fíjalos y activa opcionalmente la restauración de borradores.",
        "Enregistrez des flux locaux exécutables pour décodage, formatage JSON, JSONPath, masquage, comparaison de jeux d’essai et SHA-256 ; épinglez-les et activez la restauration des brouillons au choix.",
        "Ausführbare lokale Abläufe für Decodierung, JSON-Formatierung, JSONPath, Schwärzung, Testdatenvergleich und SHA-256 speichern; Abläufe anheften und Entwurfswiederherstellung optional aktivieren.",
        "デコード、JSON整形、JSONPath、秘匿化、フィクスチャ比較、SHA-256を実行するローカルワークフローを保存・固定し、下書き復元を選択できます。",
        "保存可执行的本地解码、JSON 格式化、JSONPath、脱敏、测试夹具比较及 SHA-256 工作流；支持固定工作流并选择启用草稿恢复。",
        "احفظ مسارات محلية قابلة للتنفيذ لفك الترميز وتنسيق JSON وJSONPath والتنقيح ومقارنة بيانات الاختبار وSHA-256؛ ثبّتها وفعّل استعادة المسودات اختياريًا."
    ],
    "Preview and export redacted HAR, JSON and logs; verify GitHub, Stripe, Slack and raw HMAC-SHA256 signatures against the original UTF-8 body.": [
        "संवेदनशील जानकारी हटाए गए HAR, JSON और लॉग का पूर्वावलोकन व निर्यात करें; मूल UTF-8 body पर GitHub, Stripe, Slack और raw HMAC-SHA256 हस्ताक्षर जांचें।",
        "Previsualiza y exporta HAR, JSON y registros censurados; verifica firmas de GitHub, Stripe, Slack y HMAC-SHA256 sin procesar sobre el cuerpo UTF-8 original.",
        "Prévisualisez et exportez HAR, JSON et journaux expurgés ; vérifiez les signatures GitHub, Stripe, Slack et HMAC-SHA256 brutes sur le corps UTF-8 original.",
        "Geschwärzte HAR-, JSON- und Logdaten ansehen und exportieren; GitHub-, Stripe-, Slack- und rohe HMAC-SHA256-Signaturen anhand des ursprünglichen UTF-8-Bodys prüfen.",
        "秘匿化したHAR・JSON・ログをプレビューして出力し、元のUTF-8本文でGitHub、Stripe、Slack、未加工HMAC-SHA256署名を検証します。",
        "预览并导出脱敏 HAR、JSON 和日志；针对原始 UTF-8 正文验证 GitHub、Stripe、Slack 及原始 HMAC-SHA256 签名。",
        "عاين وصدّر HAR وJSON والسجلات المنقحة؛ وتحقق من توقيعات GitHub وStripe وSlack وHMAC-SHA256 الخام باستخدام محتوى UTF-8 الأصلي."
    ],
    "Inspect and generate W3C trace context; generate UUIDv4/v7 and inspect v7 timestamps. The catalog now contains 125 tools.": [
        "W3C trace context जांचें और बनाएं; UUIDv4/v7 बनाएं और v7 टाइमस्टैम्प जांचें। कैटलॉग में अब 125 टूल हैं।",
        "Inspecciona y genera contexto de trazas W3C; genera UUIDv4/v7 e inspecciona marcas temporales v7. El catálogo contiene ahora 125 herramientas.",
        "Inspectez et générez le contexte de trace W3C ; générez des UUIDv4/v7 et inspectez les horodatages v7. Le catalogue compte désormais 125 outils.",
        "W3C-Trace-Kontext prüfen und erzeugen; UUIDv4/v7 erzeugen und v7-Zeitstempel prüfen. Der Katalog enthält nun 125 Werkzeuge.",
        "W3Cトレースコンテキストの検査・生成、UUIDv4/v7生成とv7タイムスタンプ検査に対応。カタログは125ツールになりました。",
        "检查与生成 W3C 跟踪上下文；生成 UUIDv4/v7 并检查 v7 时间戳。目录现含 125 项工具。",
        "افحص وأنشئ سياق تتبع W3C، وأنشئ UUIDv4/v7 وافحص طوابع v7 الزمنية. يضم الكتالوج الآن 125 أداة."
    ],
    "Suggest tools from an explicit local smart paste and search by common debugging tasks.": [
        "स्पष्ट स्थानीय स्मार्ट-पेस्ट क्रिया से टूल सुझाएं और सामान्य डिबगिंग कार्यों के अनुसार खोजें।",
        "Sugiere herramientas mediante pegado inteligente local explícito y busca por tareas habituales de depuración.",
        "Suggérez des outils après un collage intelligent local explicite et cherchez par tâches courantes de débogage.",
        "Werkzeuge durch bewusstes lokales intelligentes Einfügen vorschlagen und nach üblichen Debugging-Aufgaben suchen.",
        "明示的なローカルスマート貼付けでツールを提案し、一般的なデバッグ作業から検索できます。",
        "通过明确触发的本地智能粘贴推荐工具，并按常见调试任务搜索。",
        "اقترح أدوات بعد لصق ذكي محلي صريح وابحث بحسب مهام التصحيح الشائعة."
    ],
    "Standards and correctness": [
        "मानक और शुद्धता",
        "Estándares y corrección",
        "Normes et exactitude",
        "Standards und Korrektheit",
        "標準と正確性",
        "标准与正确性",
        "المعايير والدقة"
    ],
    "Validate JSON Schema Draft 2020-12, 2019-09 and Draft-07 with Ajv in a bounded worker; fail unknown dialects, rules and unresolved references explicitly.": [
        "सीमित worker में Ajv से JSON Schema Draft 2020-12, 2019-09 और Draft-07 सत्यापित करें; अज्ञात dialect, नियम और अनसुलझे संदर्भ स्पष्ट रूप से असफल हों।",
        "Valida JSON Schema Draft 2020-12, 2019-09 y Draft-07 con Ajv en un worker acotado; rechaza explícitamente dialectos, reglas y referencias sin resolver desconocidos.",
        "Validez JSON Schema Draft 2020-12, 2019-09 et Draft-07 avec Ajv dans un worker borné ; signalez explicitement dialectes et règles inconnus ou références non résolues.",
        "JSON Schema Draft 2020-12, 2019-09 und Draft-07 mit Ajv in einem begrenzten Worker validieren; unbekannte Dialekte und Regeln sowie unaufgelöste Referenzen ausdrücklich ablehnen.",
        "制限付きワーカー内のAjvでJSON Schema Draft 2020-12、2019-09、Draft-07を検証し、未知の方言・ルールや未解決参照は明示的に失敗させます。",
        "在受限 worker 中用 Ajv 验证 JSON Schema Draft 2020-12、2019-09 和 Draft-07；明确拒绝未知方言、规则及未解析引用。",
        "تحقق من JSON Schema Draft 2020-12 و2019-09 وDraft-07 عبر Ajv في عامل محدود؛ وارفض صراحة اللهجات والقواعد المجهولة والمراجع غير المحلولة."
    ],
    "Compare selected OpenAPI request and response constraints with local references, media changes and manual-review warnings for unsupported semantics; reference OpenAPI 3.2.1.": [
        "स्थानीय संदर्भों, मीडिया परिवर्तनों और असमर्थित अर्थ के लिए मैन्युअल समीक्षा चेतावनियों सहित चुनिंदा OpenAPI अनुरोध/प्रतिक्रिया सीमाएं तुलना करें; OpenAPI 3.2.1 का संदर्भ लें।",
        "Compara restricciones seleccionadas de solicitudes y respuestas OpenAPI con referencias locales, cambios de medios y avisos de revisión manual para semánticas no admitidas; referencia OpenAPI 3.2.1.",
        "Comparez certaines contraintes de requête et réponse OpenAPI avec références locales, changements de médias et avertissements de revue manuelle pour les sémantiques non prises en charge ; référence OpenAPI 3.2.1.",
        "Ausgewählte OpenAPI-Anfrage- und Antwortbedingungen mit lokalen Referenzen und Medienänderungen vergleichen; manuelle Prüfung bei nicht unterstützter Semantik kennzeichnen; auf OpenAPI 3.2.1 verweisen.",
        "選択したOpenAPI要求・応答制約をローカル参照やメディア変更と比較し、未対応の意味論は手動レビュー警告を表示。OpenAPI 3.2.1を参照します。",
        "比较选定的 OpenAPI 请求和响应约束，支持本地引用、媒体变更，并对不支持的语义提示人工审查；参考 OpenAPI 3.2.1。",
        "قارن قيود طلبات واستجابات OpenAPI المحددة مع المراجع المحلية وتغير الوسائط وتحذيرات المراجعة اليدوية للدلالات غير المدعومة؛ واستند إلى OpenAPI 3.2.1."
    ],
    "Support MCP 2026-07-28 per-request metadata and discovery plus explicit legacy initialization; support A2A 1.0 JSONRPC with labeled 0.3 and older modes.": [
        "MCP 2026-07-28 के प्रति-अनुरोध metadata और discovery तथा स्पष्ट legacy initialization का समर्थन; A2A 1.0 JSONRPC के साथ नामांकित 0.3 और पुराने मोड का समर्थन।",
        "Admite metadatos por solicitud y descubrimiento de MCP 2026-07-28 e inicialización heredada explícita; admite A2A 1.0 JSONRPC con modos 0.3 y anteriores identificados.",
        "Prend en charge les métadonnées par requête et la découverte MCP 2026-07-28 avec initialisation historique explicite ; A2A 1.0 JSONRPC avec modes 0.3 et antérieurs identifiés.",
        "MCP 2026-07-28 mit Metadaten je Anfrage, Erkennung und expliziter älterer Initialisierung unterstützen; A2A 1.0 JSONRPC mit gekennzeichneten Modi 0.3 und älter unterstützen.",
        "MCP 2026-07-28の要求別メタデータ・探索と明示的な旧初期化に対応。A2A 1.0 JSONRPC、および明記した0.3以前のモードに対応します。",
        "支持 MCP 2026-07-28 的逐请求元数据和发现，以及明确的旧版初始化；支持 A2A 1.0 JSONRPC，并标注 0.3 及更早模式。",
        "يدعم بيانات كل طلب والاكتشاف في MCP 2026-07-28 مع تهيئة قديمة صريحة؛ ويدعم A2A 1.0 JSONRPC مع تمييز أوضاع 0.3 وما قبلها."
    ],
    "Add reviewed model records with pricing tier/expiry notes, honest local tokenizer scope, optional direct provider counting, OAuth/JWT BCP references and current IANA HTTP names.": [
        "मूल्य-स्तर/समाप्ति नोट वाले समीक्षित मॉडल रिकॉर्ड, स्थानीय tokenizer की ईमानदार सीमा, वैकल्पिक सीधे provider counting, OAuth/JWT BCP संदर्भ और वर्तमान IANA HTTP नाम जोड़ें।",
        "Añade registros de modelos revisados con notas de nivel de precios/caducidad, límites honestos del tokenizador local, recuento directo opcional del proveedor, referencias OAuth/JWT BCP y nombres HTTP actuales de IANA.",
        "Ajoute des modèles examinés avec notes tarifaires/expiration, portée réelle du tokeniseur local, comptage direct facultatif du fournisseur, références OAuth/JWT BCP et noms HTTP IANA actuels.",
        "Geprüfte Modelldatensätze mit Preisstufen-/Ablaufhinweisen, ehrlichen lokalen Tokenizer-Grenzen, optionaler direkter Anbieterzählung, OAuth/JWT-BCP-Referenzen und aktuellen IANA-HTTP-Namen ergänzen.",
        "料金階層・期限注記付きの確認済みモデル記録、ローカルトークナイザーの正確な範囲、任意の提供元直接カウント、OAuth/JWT BCP資料、現行IANA HTTP名を追加します。",
        "新增经审查的模型记录，附价格层级／到期说明；明确本地分词器范围，提供可选的提供商直接计数、OAuth/JWT BCP 参考及现行 IANA HTTP 名称。",
        "أضف سجلات نماذج مراجعة مع ملاحظات مستويات الأسعار والانتهاء، وحدود دقيقة للمجزئ المحلي، وعدًا مباشرًا اختياريًا لدى المزود، ومراجع OAuth/JWT BCP وأسماء HTTP الحالية لدى IANA."
    ],
    "Publish runnable debugging fixtures, shared source/review records and a read-only weekly source monitor that requires review before dataset updates.": [
        "चलने योग्य डिबगिंग फ़िक्स्चर, साझा स्रोत/समीक्षा रिकॉर्ड और केवल-पढ़ने योग्य साप्ताहिक स्रोत मॉनिटर प्रकाशित करें; डेटासेट अपडेट से पहले समीक्षा आवश्यक हो।",
        "Publica fixtures de depuración ejecutables, registros compartidos de fuentes/revisión y un monitor semanal de solo lectura que exige revisión antes de actualizar datos.",
        "Publiez des jeux de débogage exécutables, des relevés partagés de sources/revues et un suivi hebdomadaire en lecture seule exigeant une revue avant mise à jour des données.",
        "Ausführbare Debugging-Testdaten, gemeinsame Quellen-/Prüfprotokolle und eine schreibgeschützte wöchentliche Quellenüberwachung veröffentlichen, die vor Datensatzupdates eine Prüfung verlangt.",
        "実行可能なデバッグフィクスチャ、共通の出典・レビュー記録、データ更新前のレビューを必須とする読み取り専用の週次出典監視を公開します。",
        "发布可运行的调试夹具、共享来源／审查记录和只读周度来源监控；更新数据集前须审查。",
        "انشر بيانات تصحيح قابلة للتنفيذ وسجلات مصادر ومراجعات مشتركة ومراقب مصادر أسبوعيًا للقراءة فقط يفرض المراجعة قبل تحديث البيانات."
    ],
    "Workspace, privacy and delivery": [
        "कार्यक्षेत्र, गोपनीयता और वितरण",
        "Espacio de trabajo, privacidad y entrega",
        "Espace de travail, confidentialité et distribution",
        "Arbeitsbereich, Datenschutz und Auslieferung",
        "ワークスペース、プライバシー、配信",
        "工作区、隐私与交付",
        "مساحة العمل والخصوصية والتوزيع"
    ],
    "Use native canonical catalog links, reserve sidebar space before hydration, remove delayed marketing entrances and lazy-load workspace overlays.": [
        "मूल canonical कैटलॉग लिंक प्रयोग करें, hydration से पहले sidebar स्थान रखें, विलंबित marketing प्रवेश हटाएं और workspace overlays को जरूरत पर लोड करें।",
        "Usa enlaces canónicos nativos, reserva espacio lateral antes de hidratar, elimina entradas de marketing retrasadas y carga superposiciones bajo demanda.",
        "Utilisez des liens canoniques natifs, réservez la place latérale avant hydratation, supprimez les entrées marketing différées et chargez les superpositions à la demande.",
        "Native kanonische Kataloglinks nutzen, Seitenleistenplatz vor Hydrierung reservieren, verzögerte Marketing-Einblendungen entfernen und Arbeitsbereich-Overlays bei Bedarf laden.",
        "ネイティブな正規カタログリンクを使い、ハイドレーション前にサイドバー領域を確保。遅延マーケティング表示を除き、オーバーレイを遅延読み込みします。",
        "使用原生规范目录链接，在水合前预留侧边栏空间，移除延迟营销入场效果，并按需加载工作区浮层。",
        "استخدم روابط كتالوج أساسية أصلية، واحجز موضع الشريط الجانبي قبل الإماهة، وأزل الظهور التسويقي المتأخر وحمّل طبقات مساحة العمل عند الحاجة."
    ],
    "Self-host licensed fonts so production builds do not depend on Google Fonts requests.": [
        "लाइसेंस प्राप्त फ़ॉन्ट स्वयं होस्ट करें ताकि production build Google Fonts अनुरोधों पर निर्भर न हों।",
        "Aloja localmente fuentes con licencia para que las compilaciones de producción no dependan de Google Fonts.",
        "Hébergez les polices sous licence pour que les builds de production ne dépendent pas des requêtes Google Fonts.",
        "Lizenzierte Schriften selbst hosten, damit Produktionsbuilds nicht von Google-Fonts-Anfragen abhängen.",
        "ライセンス取得済みフォントを自己ホストし、本番ビルドのGoogle Fonts要求への依存をなくします。",
        "自托管获许可字体，使生产构建不依赖 Google Fonts 请求。",
        "استضف الخطوط المرخصة ذاتيًا كي لا تعتمد عمليات بناء الإنتاج على طلبات Google Fonts."
    ],
    "Label data boundaries, redact credentials in exports by default and exclude API/authenticated/RSC requests from service-worker persistence.": [
        "डेटा सीमाएं बताएं, निर्यात में डिफ़ॉल्ट रूप से credentials छिपाएं और API/authenticated/RSC अनुरोध service-worker persistence से बाहर रखें।",
        "Indica los límites de datos, oculta credenciales en exportaciones por defecto y excluye solicitudes API/autenticadas/RSC del almacenamiento del service worker.",
        "Indiquez les frontières de données, masquez les identifiants à l’export par défaut et excluez les requêtes API/authentifiées/RSC de la persistance du service worker.",
        "Datengrenzen kennzeichnen, Zugangsdaten standardmäßig beim Export schwärzen und API-/authentifizierte/RSC-Anfragen von der Service-Worker-Persistenz ausschließen.",
        "データ境界を明記し、出力時は認証情報を標準で秘匿化。API・認証済み・RSC要求はサービスワーカーの永続化から除外します。",
        "标注数据边界，默认在导出中隐藏凭证，并将 API／认证／RSC 请求排除在 service worker 持久化之外。",
        "وضّح حدود البيانات ونقّح بيانات الاعتماد افتراضيًا عند التصدير واستبعد طلبات API والمصادقة وRSC من تخزين عامل الخدمة."
    ],
    "Warm public pages and hashed assets for visited-tool offline use; offer an explicit reload for updates. Network and uncached features still require connectivity.": [
        "देखे गए टूल के offline उपयोग हेतु सार्वजनिक पेज और hashed assets पहले कैश करें; अपडेट पर स्पष्ट reload विकल्प दें। नेटवर्क और बिना कैश सुविधाओं को कनेक्शन चाहिए।",
        "Precarga páginas públicas y recursos con hash para usar herramientas visitadas sin conexión; ofrece recarga explícita al actualizar. Red y funciones sin caché requieren conexión.",
        "Préchargez pages publiques et ressources hachées pour l’usage hors ligne des outils visités ; proposez un rechargement explicite aux mises à jour. Réseau et fonctions non mises en cache exigent une connexion.",
        "Öffentliche Seiten und gehashte Assets für besuchte Werkzeuge offline vorhalten; Updates mit ausdrücklichem Neuladen anbieten. Netzwerk- und nicht gecachte Funktionen brauchen Verbindung.",
        "訪問済みツールのオフライン利用向けに公開ページとハッシュ付き資産をキャッシュし、更新時に明示的な再読み込みを提示。通信・未キャッシュ機能には接続が必要です。",
        "预缓存公共页面和带哈希资源，供已访问工具离线使用；更新时提供明确重载选项。网络及未缓存功能仍需连接。",
        "جهّز الصفحات العامة والموارد ذات البصمات للاستخدام دون اتصال للأدوات المزارة، مع خيار إعادة تحميل صريح للتحديثات. الشبكة والميزات غير المخزنة تحتاج اتصالًا."
    ],
    "Add a nonroot standalone Docker deployment, configurable canonical site URL, refreshed compatible dependencies and regression fixtures for the new behavior. Existing upstream dependency advisories remain disclosed in the validation report.": [
        "nonroot standalone Docker deployment, configurable canonical site URL, अनुकूल dependencies और नए व्यवहार के regression fixtures जोड़ें। मौजूदा upstream dependency advisories सत्यापन रिपोर्ट में दर्ज रहें।",
        "Añade despliegue Docker standalone sin root, URL canónica configurable, dependencias compatibles renovadas y fixtures de regresión. Los avisos existentes de dependencias upstream siguen declarados en el informe.",
        "Ajoute un déploiement Docker autonome sans root, une URL canonique configurable, des dépendances compatibles actualisées et des jeux de régression. Les avis existants des dépendances amont restent déclarés dans le rapport de validation.",
        "Eigenständiges Docker-Deployment ohne root, konfigurierbare kanonische Website-URL, aktualisierte kompatible Abhängigkeiten und Regressionstestdaten ergänzen. Bestehende Hinweise zu vorgelagerten Abhängigkeiten bleiben im Prüfbericht offengelegt.",
        "非rootのスタンドアロンDocker配備、設定可能な正規サイトURL、互換依存更新、回帰フィクスチャを追加。既存の上流依存アドバイザリは検証報告に引き続き明記します。",
        "新增非 root 独立 Docker 部署、可配置规范站点 URL、更新后的兼容依赖及新行为回归夹具。既有上游依赖安全公告仍在验证报告中披露。",
        "أضف نشر Docker مستقلًا دون root ورابط موقع أساسيًا قابلًا للضبط واعتماديات متوافقة محدثة وبيانات تراجع للسلوك الجديد. تبقى تنبيهات الاعتماديات السابقة معلنة في تقرير التحقق."
    ],
    "V1.5.1 — dependency refresh, server reliability, and route verification": [
        "V1.5.1 — dependencies का नवीनीकरण, सर्वर विश्वसनीयता और रूट सत्यापन",
        "V1.5.1 — dependencias renovadas, fiabilidad del servidor y verificación de rutas",
        "V1.5.1 — dépendances actualisées, fiabilité serveur et vérification des routes",
        "V1.5.1 — aktualisierte Abhängigkeiten, Serverzuverlässigkeit und Routenprüfung",
        "V1.5.1 — 依存更新、サーバー信頼性、ルート検証",
        "V1.5.1 — 依赖更新、服务器可靠性与路由验证",
        "V1.5.1 — تحديث الاعتماديات وموثوقية الخادم والتحقق من المسارات"
    ],
    "Refreshes the application toolchain to current registry package versions, keeps Next.js 16.3.4 and TypeScript 7 compiling cleanly, and verifies the homepage, canonical tool routes, sitemap, certificate lookup, and managed proxy behavior end to end.": [
        "टूलचेन को वर्तमान registry package संस्करणों पर लाएं, Next.js 16.3.4 और TypeScript 7 का साफ़ compilation रखें, और होमपेज, canonical tool routes, sitemap, certificate lookup व managed proxy का आरंभ से अंत तक सत्यापन करें।",
        "Actualiza la cadena a versiones actuales del registro, mantiene Next.js 16.3.4 y TypeScript 7 compilando sin errores y verifica de extremo a extremo inicio, rutas canónicas, sitemap, certificados y proxy gestionado.",
        "Actualise la chaîne aux versions du registre, maintient la compilation propre de Next.js 16.3.4 et TypeScript 7 et vérifie de bout en bout accueil, routes canoniques, sitemap, certificats et proxy géré.",
        "Toolchain auf aktuelle Registry-Versionen aktualisieren, Next.js 16.3.4 und TypeScript 7 fehlerfrei kompilieren und Startseite, kanonische Werkzeugrouten, Sitemap, Zertifikatabfrage und verwalteten Proxy durchgängig prüfen.",
        "ツールチェーンをレジストリの現行版に更新し、Next.js 16.3.4とTypeScript 7の正常ビルドを維持。ホーム、正規ツールルート、サイトマップ、証明書照会、管理プロキシを一貫検証します。",
        "更新工具链至注册表现行软件包版本，保持 Next.js 16.3.4 和 TypeScript 7 无错误编译，并端到端验证首页、规范工具路由、站点地图、证书查询及托管代理。",
        "يحدّث سلسلة الأدوات إلى إصدارات السجل الحالية ويحافظ على تجميع Next.js 16.3.4 وTypeScript 7 دون أخطاء، ويتحقق شاملًا من الرئيسية والمسارات الأساسية وخريطة الموقع والشهادات والوكيل المدار."
    ],
    "Current package baseline": [
        "वर्तमान पैकेज आधार",
        "Base actual de paquetes",
        "Socle actuel des paquets",
        "Aktuelle Paketbasis",
        "現在のパッケージ基準",
        "当前软件包基线",
        "الأساس الحالي للحزم"
    ],
    "Update Ant Design to **`6.6.2`** with **`@ant-design/icons 6.3.4`**, keeping the icon peer requirement aligned with Ant Design v6.": [
        "Ant Design को **`6.6.2`** और **`@ant-design/icons 6.3.4`** पर अपडेट करें, ताकि icon peer आवश्यकता Ant Design v6 से मेल खाए।",
        "Actualiza Ant Design a **`6.6.2`** con **`@ant-design/icons 6.3.4`**, alineando el requisito de iconos con Ant Design v6.",
        "Met à jour Ant Design vers **`6.6.2`** avec **`@ant-design/icons 6.3.4`**, en alignant la dépendance paire des icônes sur Ant Design v6.",
        "Ant Design auf **`6.6.2`** mit **`@ant-design/icons 6.3.4`** aktualisieren und die Icon-Peer-Anforderung an Ant Design v6 anpassen.",
        "Ant Designを**`6.6.2`**、**`@ant-design/icons 6.3.4`**に更新し、アイコンのpeer要件をAnt Design v6に合わせます。",
        "将 Ant Design 更新为 **`6.6.2`**，搭配 **`@ant-design/icons 6.3.4`**，使图标 peer 依赖要求与 Ant Design v6 一致。",
        "حدّث Ant Design إلى **`6.6.2`** مع **`@ant-design/icons 6.3.4`** مع مواءمة متطلب الأيقونات النظير مع Ant Design v6."
    ],
    "Update Next.js to **`16.3.4`**, React / React DOM to **`19.2.8`**, and TypeScript to **`7.0.2`**; opt into the documented TypeScript CLI path required by this Next.js toolchain.": [
        "Next.js को **`16.3.4`**, React / React DOM को **`19.2.8`** और TypeScript को **`7.0.2`** पर अपडेट करें; इस Next.js टूलचेन हेतु आवश्यक दस्तावेज़ित TypeScript CLI पथ अपनाएं।",
        "Actualiza Next.js a **`16.3.4`**, React / React DOM a **`19.2.8`** y TypeScript a **`7.0.2`**; activa la ruta CLI TypeScript documentada que requiere esta cadena Next.js.",
        "Met à jour Next.js vers **`16.3.4`**, React / React DOM vers **`19.2.8`** et TypeScript vers **`7.0.2`** ; active le chemin CLI TypeScript documenté requis par cette chaîne Next.js.",
        "Next.js auf **`16.3.4`**, React / React DOM auf **`19.2.8`** und TypeScript auf **`7.0.2`** aktualisieren; den dokumentierten, von dieser Next.js-Toolchain benötigten TypeScript-CLI-Pfad aktivieren.",
        "Next.jsを**`16.3.4`**、React / React DOMを**`19.2.8`**、TypeScriptを**`7.0.2`**へ更新し、このNext.jsツールチェーンで必要な文書化済みTypeScript CLI経路を有効化します。",
        "将 Next.js 更新为 **`16.3.4`**、React / React DOM 为 **`19.2.8`**、TypeScript 为 **`7.0.2`**；启用此 Next.js 工具链要求的已文档化 TypeScript CLI 路径。",
        "حدّث Next.js إلى **`16.3.4`** وReact / React DOM إلى **`19.2.8`** وTypeScript إلى **`7.0.2`**؛ وفعّل مسار TypeScript CLI الموثق المطلوب لهذه السلسلة."
    ],
    "Refresh Tailwind CSS / PostCSS, ESLint, Framer Motion, Mermaid, Swagger UI, XML parsing, tokenisation, formatting, UUID, YAML, Zustand, type packages, and security overrides; regenerate the lockfile for reproducible installs.": [
        "Tailwind CSS / PostCSS, ESLint, Framer Motion, Mermaid, Swagger UI, XML parsing, tokenisation, formatting, UUID, YAML, Zustand, type packages और security overrides ताज़ा करें; दोहराने योग्य स्थापना के लिए lockfile फिर बनाएं।",
        "Renueva Tailwind CSS / PostCSS, ESLint, Framer Motion, Mermaid, Swagger UI, análisis XML, tokenización, formato, UUID, YAML, Zustand, paquetes de tipos y overrides de seguridad; regenera el lockfile para instalaciones reproducibles.",
        "Actualise Tailwind CSS / PostCSS, ESLint, Framer Motion, Mermaid, Swagger UI, analyse XML, tokenisation, formatage, UUID, YAML, Zustand, types et surcharges de sécurité ; régénère le verrouillage pour des installations reproductibles.",
        "Tailwind CSS / PostCSS, ESLint, Framer Motion, Mermaid, Swagger UI, XML-Verarbeitung, Tokenisierung, Formatierung, UUID, YAML, Zustand, Typpakete und Sicherheitsüberschreibungen aktualisieren; Lockdatei für reproduzierbare Installationen erneuern.",
        "Tailwind CSS / PostCSS、ESLint、Framer Motion、Mermaid、Swagger UI、XML解析、トークン化、整形、UUID、YAML、Zustand、型パッケージ、セキュリティ上書きを更新し、再現可能な導入用にロックファイルを再生成します。",
        "更新 Tailwind CSS / PostCSS、ESLint、Framer Motion、Mermaid、Swagger UI、XML 解析、分词、格式化、UUID、YAML、Zustand、类型包及安全覆盖配置；重新生成锁文件以实现可复现安装。",
        "حدّث Tailwind CSS / PostCSS وESLint وFramer Motion وMermaid وSwagger UI وتحليل XML والتجزئة والتنسيق وUUID وYAML وZustand وحزم الأنواع وتجاوزات الأمان؛ وأعد إنشاء ملف القفل لتثبيت قابل للتكرار."
    ],
    "Patch the nested Babel, Browserslist, and brace-expansion dependency paths, and update the Hugging Face runtime path to **`sharp 0.35.4`**, **`onnxruntime-node 1.29.0`**, and **`adm-zip 0.6.0`**; `npm audit` now reports zero known vulnerabilities.": [
        "nested Babel, Browserslist और brace-expansion dependency पथ patch करें; Hugging Face runtime को **`sharp 0.35.4`**, **`onnxruntime-node 1.29.0`** और **`adm-zip 0.6.0`** पर लाएं; `npm audit` अब शून्य ज्ञात vulnerabilities दिखाता है।",
        "Corrige rutas anidadas de Babel, Browserslist y brace-expansion y actualiza Hugging Face a **`sharp 0.35.4`**, **`onnxruntime-node 1.29.0`** y **`adm-zip 0.6.0`**; `npm audit` informa cero vulnerabilidades conocidas.",
        "Corrige les dépendances imbriquées Babel, Browserslist et brace-expansion et actualise le runtime Hugging Face vers **`sharp 0.35.4`**, **`onnxruntime-node 1.29.0`** et **`adm-zip 0.6.0`** ; `npm audit` ne signale plus de vulnérabilité connue.",
        "Verschachtelte Babel-, Browserslist- und brace-expansion-Abhängigkeiten korrigieren und Hugging-Face-Runtime auf **`sharp 0.35.4`**, **`onnxruntime-node 1.29.0`** und **`adm-zip 0.6.0`** aktualisieren; `npm audit` meldet nun null bekannte Schwachstellen.",
        "入れ子のBabel、Browserslist、brace-expansion依存を修正し、Hugging Face実行環境を**`sharp 0.35.4`**、**`onnxruntime-node 1.29.0`**、**`adm-zip 0.6.0`**へ更新。`npm audit`の既知脆弱性は0件です。",
        "修补嵌套 Babel、Browserslist 和 brace-expansion 依赖路径，并将 Hugging Face 运行时更新为 **`sharp 0.35.4`**、**`onnxruntime-node 1.29.0`**、**`adm-zip 0.6.0`**；`npm audit` 现报告零个已知漏洞。",
        "أصلح مسارات اعتماديات Babel وBrowserslist وbrace-expansion المتداخلة وحدّث بيئة Hugging Face إلى **`sharp 0.35.4`** و**`onnxruntime-node 1.29.0`** و**`adm-zip 0.6.0`**؛ ويبلغ `npm audit` الآن عن صفر ثغرات معروفة."
    ],
    "Server rendering and route reliability": [
        "सर्वर रेंडरिंग और रूट विश्वसनीयता",
        "Renderizado del servidor y fiabilidad de rutas",
        "Rendu serveur et fiabilité des routes",
        "Server-Rendering und Routenzuverlässigkeit",
        "サーバーレンダリングとルートの信頼性",
        "服务器渲染与路由可靠性",
        "عرض الخادم وموثوقية المسارات"
    ],
    "Keep metadata, structured data, and sitemap generation on React-free server-safe tables so Ant Design client context is never evaluated while Next.js collects page data.": [
        "metadata, structured data और sitemap निर्माण React-मुक्त server-safe तालिकाओं पर रखें ताकि Next.js के page data संग्रह के दौरान Ant Design client context कभी न चले।",
        "Mantén metadatos, datos estructurados y sitemap en tablas seguras de servidor sin React para no evaluar contexto cliente Ant Design al recoger datos de páginas.",
        "Garde métadonnées, données structurées et sitemap sur des tables serveur sans React, afin de ne jamais évaluer le contexte client Ant Design pendant la collecte Next.js.",
        "Metadaten, strukturierte Daten und Sitemap aus React-freien serversicheren Tabellen erzeugen, damit Ant-Design-Clientkontext während der Next.js-Seitendatensammlung nie ausgewertet wird.",
        "メタデータ・構造化データ・サイトマップ生成をReact不要のサーバー安全な表で行い、Next.jsのページデータ収集時にAnt Designクライアントコンテキストを評価しないようにします。",
        "使用不依赖 React 的服务器安全数据表生成元数据、结构化数据及站点地图，避免 Next.js 收集页面数据时求值 Ant Design 客户端上下文。",
        "أبقِ توليد البيانات الوصفية والمنظمة وخريطة الموقع في جداول آمنة للخادم دون React، كي لا يُقيّم سياق عميل Ant Design أثناء جمع Next.js لبيانات الصفحات."
    ],
    "Preserve canonical **`/[categorySlug]/[toolId]`** URLs and redirect legacy **`/tools/[toolId]`** requests without breaking tool metadata or sitemap coverage.": [
        "canonical **`/[categorySlug]/[toolId]`** URL रखें और पुराने **`/tools/[toolId]`** अनुरोध redirect करें, tool metadata व sitemap coverage बनाए रखें।",
        "Conserva URL canónicas **`/[categorySlug]/[toolId]`** y redirige solicitudes heredadas **`/tools/[toolId]`** sin romper metadatos ni cobertura del sitemap.",
        "Préserve les URL canoniques **`/[categorySlug]/[toolId]`** et redirige les anciennes requêtes **`/tools/[toolId]`** sans casser métadonnées ni sitemap.",
        "Kanonische **`/[categorySlug]/[toolId]`**-URLs bewahren und alte **`/tools/[toolId]`**-Anfragen umleiten, ohne Metadaten oder Sitemap-Abdeckung zu beschädigen.",
        "正規URL **`/[categorySlug]/[toolId]`**を維持し、旧**`/tools/[toolId]`**要求をメタデータやサイトマップ範囲を損なわずリダイレクトします。",
        "保留规范 **`/[categorySlug]/[toolId]`** URL，并重定向旧 **`/tools/[toolId]`** 请求，同时保持工具元数据及站点地图覆盖。",
        "احفظ روابط **`/[categorySlug]/[toolId]`** الأساسية وأعد توجيه طلبات **`/tools/[toolId]`** القديمة دون الإخلال بالبيانات الوصفية أو خريطة الموقع."
    ],
    "Exclude reserved **`/api/*`** paths from the category/tool rewrite so certificate, proxy, webhook, and other server endpoints return JSON instead of an HTML page.": [
        "category/tool rewrite से आरक्षित **`/api/*`** पथ बाहर रखें ताकि certificate, proxy, webhook व अन्य server endpoints HTML के बजाय JSON लौटाएं।",
        "Excluye **`/api/*`** reservado de la reescritura categoría/herramienta para que certificados, proxy, webhooks y demás endpoints devuelvan JSON en vez de HTML.",
        "Exclut les chemins réservés **`/api/*`** de la réécriture catégorie/outil pour que certificats, proxy, webhooks et autres endpoints renvoient JSON plutôt que HTML.",
        "Reservierte **`/api/*`**-Pfade vom Kategorie-/Werkzeug-Rewrite ausschließen, damit Zertifikat-, Proxy-, Webhook- und andere Serverendpunkte JSON statt HTML liefern.",
        "予約済み**`/api/*`**パスをカテゴリ・ツール書き換えから除外し、証明書、プロキシ、Webhook等のサーバーがHTMLではなくJSONを返すようにします。",
        "将保留 **`/api/*`** 路径排除在分类／工具重写之外，使证书、代理、webhook 及其他服务器端点返回 JSON 而非 HTML。",
        "استبعد مسارات **`/api/*`** المحجوزة من إعادة كتابة الفئة والأداة كي تعيد نقاط الشهادات والوكيل وwebhook وغيرها JSON بدل HTML."
    ],
    "Parse server responses by content type across network-capable tools so non-JSON failures surface as actionable HTTP errors rather than `Unexpected token '<'` messages.": [
        "नेटवर्क टूल में response को content type से पढ़ें ताकि non-JSON failures पर उपयोगी HTTP त्रुटि मिले, `Unexpected token '<'` संदेश नहीं।",
        "Analiza respuestas según su tipo de contenido en herramientas de red para mostrar errores HTTP útiles ante fallos no JSON, en lugar de `Unexpected token '<'`.",
        "Analyse les réponses par type de contenu dans les outils réseau pour que les échecs non JSON donnent des erreurs HTTP exploitables plutôt que `Unexpected token '<'`.",
        "Serverantworten in Netzwerkwerkzeugen anhand des Inhaltstyps parsen, damit Nicht-JSON-Fehler als hilfreiche HTTP-Fehler statt `Unexpected token '<'` erscheinen.",
        "通信ツールでコンテンツ種別に応じて応答を解析し、JSON以外の失敗は`Unexpected token '<'`ではなく対処可能なHTTPエラーとして表示します。",
        "网络工具按内容类型解析服务器响应，使非 JSON 失败显示可处理的 HTTP 错误，而非 `Unexpected token '<'`。",
        "حلّل استجابات الخادم بحسب نوع المحتوى في أدوات الشبكة لعرض أخطاء HTTP قابلة للمعالجة عند الفشل غير JSON بدل رسائل `Unexpected token '<'`."
    ],
    "Validate proxy and streaming-proxy request objects before processing them, including omitted bodies and malformed method, header, and timeout fields.": [
        "proxy और streaming-proxy request objects को processing से पहले सत्यापित करें, जिसमें छूटी body और गलत method, header, timeout fields शामिल हों।",
        "Valida objetos de solicitud proxy y streaming antes de procesarlos, incluidos cuerpos omitidos y campos de método, cabecera o tiempo límite mal formados.",
        "Valide les objets de requête proxy et streaming avant traitement, y compris corps absents et champs méthode, en-têtes ou délai mal formés.",
        "Proxy- und Streaming-Proxy-Anfragen vor Verarbeitung validieren, einschließlich fehlender Bodys und ungültiger Methoden-, Header- und Timeoutfelder.",
        "プロキシ・ストリーミングプロキシ要求を処理前に検証し、本文省略、不正なメソッド・ヘッダー・タイムアウト項目にも対応します。",
        "处理前验证代理及流式代理请求对象，包括缺失正文和格式错误的方法、标头及超时字段。",
        "تحقق من كائنات طلب الوكيل والوكيل المتدفق قبل المعالجة، بما فيها المحتوى الغائب وحقول الطريقة والرؤوس والمهلة غير السليمة."
    ],
    "Apply the managed-route disable gate and quota to webhook history deletion as well as ingestion and polling.": [
        "managed-route disable gate और quota को webhook history deletion पर भी लागू करें, ingestion व polling के साथ।",
        "Aplica bloqueo de rutas gestionadas y cuota también al borrado del historial webhook, además de recepción y sondeo.",
        "Applique le blocage des routes gérées et le quota aussi à la suppression d’historique webhook, en plus de la réception et du sondage.",
        "Deaktivierungsschalter und Kontingent verwalteter Routen auch auf Webhook-Verlaufslöschung anwenden, neben Empfang und Polling.",
        "管理ルート無効化と割当制限を、受信・ポーリングに加えてWebhook履歴削除にも適用します。",
        "除接收和轮询外，将托管路由禁用开关及配额同样应用于 webhook 历史删除。",
        "طبّق تعطيل المسارات المدارة وحصتها على حذف سجل webhook أيضًا، إلى جانب الاستقبال والاستطلاع."
    ],
    "Enable managed network routes by default so production API and certificate tools work after deployment, while retaining public-target validation, destination blocking, bounded requests, and an explicit `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true` opt-out.": [
        "deployment के बाद production API व certificate tools के लिए managed network routes डिफ़ॉल्ट चालू करें; public-target validation, destination blocking, bounded requests और स्पष्ट `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true` opt-out रखें।",
        "Activa rutas de red gestionadas por defecto para que API y certificados funcionen tras desplegar; conserva validación pública, bloqueo de destinos, límites y desactivación explícita `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true`.",
        "Active par défaut les routes réseau gérées pour API et certificats après déploiement, tout en gardant validation des cibles publiques, blocage des destinations, requêtes bornées et désactivation explicite `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true`.",
        "Verwaltete Netzwerkrouten standardmäßig für API- und Zertifikatwerkzeuge nach Bereitstellung aktivieren; öffentliche Zielprüfung, Zielblockierung, begrenzte Anfragen und explizites Opt-out `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true` erhalten.",
        "配備後にAPI・証明書ツールが動くよう管理ネットワークルートを標準有効化し、公開宛先検証、宛先ブロック、要求制限、明示的な無効化`MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true`を維持します。",
        "默认启用托管网络路由，使生产 API 和证书工具部署后可用，同时保留公共目标验证、目标阻断、请求限制及明确退出选项 `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true`。",
        "فعّل مسارات الشبكة المدارة افتراضيًا لتعمل أدوات API والشهادات بعد النشر، مع إبقاء تحقق الأهداف العامة وحظر الوجهات وحدود الطلبات وخيار التعطيل الصريح `MYDEVTOOLS_DISABLE_MANAGED_ROUTES=true`."
    ],
    "Load deployment configuration from plain `next.config.js`, include the matching `@next/swc-wasm-nodejs 16.3.4` fallback, and use the Webpack production build on Linux hosts where old glibc leaves only WASM SWC available because Turbopack requires native bindings.": [
        "plain `next.config.js` से deployment configuration लें, matching `@next/swc-wasm-nodejs 16.3.4` fallback रखें; पुराने glibc वाले Linux पर Webpack production build लें जहां केवल WASM SWC उपलब्ध है, क्योंकि Turbopack को native bindings चाहिए।",
        "Carga configuración desde `next.config.js`, incluye fallback `@next/swc-wasm-nodejs 16.3.4` y usa Webpack en Linux con glibc antigua donde solo queda WASM SWC, pues Turbopack necesita enlaces nativos.",
        "Charge la configuration depuis `next.config.js`, inclut le repli `@next/swc-wasm-nodejs 16.3.4` et utilise Webpack sous Linux à ancien glibc où seul WASM SWC reste disponible, Turbopack exigeant des liaisons natives.",
        "Deployment-Konfiguration aus einfachem `next.config.js` laden, passenden Fallback `@next/swc-wasm-nodejs 16.3.4` einbinden und auf Linux mit altem glibc und nur WASM SWC Webpack verwenden, da Turbopack native Bindings benötigt.",
        "通常の`next.config.js`から配備設定を読み、対応する`@next/swc-wasm-nodejs 16.3.4`を同梱。古いglibcでWASM SWCしか使えないLinuxでは、ネイティブバインディング必須のTurbopackに代えWebpack本番ビルドを使います。",
        "从普通 `next.config.js` 加载部署配置，包含匹配的 `@next/swc-wasm-nodejs 16.3.4` 回退；旧 glibc 的 Linux 主机仅能使用 WASM SWC 时采用 Webpack 生产构建，因为 Turbopack 需要原生绑定。",
        "حمّل إعداد النشر من `next.config.js` العادي وأدرج البديل المطابق `@next/swc-wasm-nodejs 16.3.4` واستخدم Webpack للإنتاج على Linux ذي glibc القديم حيث لا يتاح إلا WASM SWC، لأن Turbopack يتطلب ارتباطات أصلية."
    ],
    "Verification completed": [
        "सत्यापन पूरा हुआ",
        "Verificación completada",
        "Vérification effectuée",
        "Prüfung abgeschlossen",
        "検証完了",
        "验证完成",
        "اكتمل التحقق"
    ],
    "Pass **`npx tsc --noEmit`** with no TypeScript errors.": [
        "**`npx tsc --noEmit`** बिना TypeScript त्रुटियों के पास करें।",
        "Supera **`npx tsc --noEmit`** sin errores TypeScript.",
        "Réussit **`npx tsc --noEmit`** sans erreur TypeScript.",
        "**`npx tsc --noEmit`** ohne TypeScript-Fehler bestehen.",
        "**`npx tsc --noEmit`**をTypeScriptエラーなしで通過します。",
        "**`npx tsc --noEmit`** 通过，无 TypeScript 错误。",
        "يجتاز **`npx tsc --noEmit`** دون أخطاء TypeScript."
    ],
    "Pass **`npm run build`** through Next.js Webpack, including registry parity (**121 registered tools / 127 tool directories / 6 allowlisted stubs**) and generation of **138 / 138** static pages.": [
        "Next.js Webpack से **`npm run build`** पास करें; registry parity (**121 registered tools / 127 tool directories / 6 allowlisted stubs**) और **138 / 138** static pages निर्माण शामिल हैं।",
        "Supera **`npm run build`** con Next.js Webpack, incluida paridad de registro (**121 herramientas registradas / 127 directorios / 6 stubs permitidos**) y generación de **138 / 138** páginas estáticas.",
        "Réussit **`npm run build`** via Next.js Webpack, avec parité du registre (**121 outils enregistrés / 127 répertoires / 6 squelettes autorisés**) et génération de **138 / 138** pages statiques.",
        "**`npm run build`** mit Next.js Webpack bestehen, einschließlich Registry-Abgleich (**121 registrierte Werkzeuge / 127 Werkzeugverzeichnisse / 6 erlaubte Stubs**) und **138 / 138** statischen Seiten.",
        "Next.js Webpackの**`npm run build`**を通過。レジストリ整合性（**登録121ツール / 127ディレクトリ / 許可済み6スタブ**）と**138 / 138**静的ページ生成を含みます。",
        "通过 Next.js Webpack 执行 **`npm run build`**，包括注册表一致性（**121 个注册工具 / 127 个工具目录 / 6 个允许的桩**）及 **138 / 138** 个静态页面生成。",
        "يجتاز **`npm run build`** عبر Next.js Webpack مع تطابق السجل (**121 أداة مسجلة / 127 دليل أدوات / 6 هياكل مسموحة**) وتوليد **138 / 138** صفحة ثابتة."
    ],
    "Verify the homepage and canonical certificate-inspector page (**HTTP 200**), the legacy `/tools/certificate-inspector` redirect (**HTTP 308**), sitemap entries, public certificate lookup (**5 PEM certificates from `example.com`**), loopback-target blocking (**HTTP 400**), malformed proxy-body validation (**HTTP 400**), and public HTTPS proxying (**HTTP 200** with a 559-byte response).": [
        "होमपेज व canonical certificate-inspector (**HTTP 200**), पुराने `/tools/certificate-inspector` redirect (**HTTP 308**), sitemap entries, सार्वजनिक certificate lookup (**`example.com` से 5 PEM certificates**), loopback blocking (**HTTP 400**), गलत proxy body (**HTTP 400**) और सार्वजनिक HTTPS proxy (**HTTP 200**, 559-byte response) सत्यापित करें।",
        "Verifica inicio y certificate-inspector canónico (**HTTP 200**), redirección `/tools/certificate-inspector` (**HTTP 308**), sitemap, consulta pública (**5 certificados PEM de `example.com`**), bloqueo loopback (**HTTP 400**), cuerpo proxy inválido (**HTTP 400**) y proxy HTTPS público (**HTTP 200**, respuesta de 559 bytes).",
        "Vérifie accueil et certificate-inspector canonique (**HTTP 200**), redirection `/tools/certificate-inspector` (**HTTP 308**), sitemap, recherche publique (**5 certificats PEM de `example.com`**), blocage loopback (**HTTP 400**), validation du corps proxy (**HTTP 400**) et proxy HTTPS public (**HTTP 200**, réponse de 559 octets).",
        "Startseite und kanonischen certificate-inspector (**HTTP 200**), alte Umleitung `/tools/certificate-inspector` (**HTTP 308**), Sitemap, öffentliche Zertifikatabfrage (**5 PEM-Zertifikate von `example.com`**), Loopback-Sperre (**HTTP 400**), ungültige Proxy-Bodys (**HTTP 400**) und öffentlichen HTTPS-Proxy (**HTTP 200**, 559-Byte-Antwort) prüfen.",
        "ホームと正規certificate-inspector（**HTTP 200**）、旧`/tools/certificate-inspector`転送（**HTTP 308**）、サイトマップ、公開証明書照会（**`example.com`の5 PEM証明書**）、ループバック遮断（**HTTP 400**）、不正プロキシ本文（**HTTP 400**）、公開HTTPSプロキシ（**HTTP 200**、559バイト応答）を検証します。",
        "验证首页及规范 certificate-inspector 页（**HTTP 200**）、旧 `/tools/certificate-inspector` 重定向（**HTTP 308**）、站点地图、公共证书查询（**`example.com` 的 5 个 PEM 证书**）、回环目标阻断（**HTTP 400**）、错误代理正文（**HTTP 400**）及公共 HTTPS 代理（**HTTP 200**、559 字节响应）。",
        "تحقق من الرئيسية وصفحة certificate-inspector الأساسية (**HTTP 200**) وإعادة توجيه `/tools/certificate-inspector` (**HTTP 308**) وخريطة الموقع والشهادات العامة (**5 شهادات PEM من `example.com`**) وحظر loopback (**HTTP 400**) ومحتوى الوكيل غير السليم (**HTTP 400**) والوكيل HTTPS العام (**HTTP 200** باستجابة 559 بايت)."
    ],
    "Known toolchain caveat": [
        "टूलचेन की ज्ञात सीमा",
        "Limitación conocida de la cadena",
        "Limite connue de la chaîne",
        "Bekannte Toolchain-Einschränkung",
        "既知のツールチェーン上の注意点",
        "已知工具链限制",
        "قيد معروف في سلسلة الأدوات"
    ],
    "Keep the latest TypeScript 7 baseline documented: `npm run lint` is currently blocked before source analysis because the latest `typescript-eslint 8.69.0` bundled by `eslint-config-next 16.3.4` supports TypeScript versions below 6.1, while `npx tsc --noEmit` and the production build pass cleanly.": [
        "नवीनतम TypeScript 7 आधार दस्तावेज़ित रखें: `npm run lint` अभी source analysis से पहले रुकता है क्योंकि `eslint-config-next 16.3.4` के साथ आया नवीनतम `typescript-eslint 8.69.0` केवल 6.1 से नीचे TypeScript संभालता है; `npx tsc --noEmit` और production build साफ़ पास होते हैं।",
        "Documenta la base TypeScript 7: `npm run lint` se bloquea antes de analizar código porque `typescript-eslint 8.69.0` incluido en `eslint-config-next 16.3.4` admite TypeScript inferior a 6.1, mientras `npx tsc --noEmit` y producción pasan sin errores.",
        "Documente le socle TypeScript 7 : `npm run lint` est bloqué avant analyse car `typescript-eslint 8.69.0` fourni par `eslint-config-next 16.3.4` prend en charge TypeScript inférieur à 6.1, alors que `npx tsc --noEmit` et le build production passent.",
        "Aktuelle TypeScript-7-Basis dokumentieren: `npm run lint` scheitert vor Quellanalyse, weil `typescript-eslint 8.69.0` aus `eslint-config-next 16.3.4` TypeScript unter 6.1 unterstützt; `npx tsc --noEmit` und Produktionsbuild bestehen fehlerfrei.",
        "TypeScript 7基準を文書化。`eslint-config-next 16.3.4`同梱の`typescript-eslint 8.69.0`がTypeScript 6.1未満対応のため`npm run lint`はソース解析前に停止しますが、`npx tsc --noEmit`と本番ビルドは正常です。",
        "记录最新 TypeScript 7 基线：`eslint-config-next 16.3.4` 捆绑的最新 `typescript-eslint 8.69.0` 仅支持低于 6.1 的 TypeScript，因此 `npm run lint` 在源码分析前受阻，而 `npx tsc --noEmit` 和生产构建正常通过。",
        "وثّق أساس TypeScript 7: يتوقف `npm run lint` قبل تحليل المصدر لأن `typescript-eslint 8.69.0` المضمّن في `eslint-config-next 16.3.4` يدعم TypeScript أدنى من 6.1، بينما ينجح `npx tsc --noEmit` وبناء الإنتاج دون أخطاء."
    ],
    "V1.5 — API contracts, security analysis, identity tooling, and platform hardening": [
        "V1.5 — API अनुबंध, सुरक्षा विश्लेषण, पहचान टूल और प्लेटफ़ॉर्म सुदृढ़ीकरण",
        "V1.5 — contratos API, análisis de seguridad, identidad y refuerzo de plataforma",
        "V1.5 — contrats API, analyse de sécurité, identité et durcissement de plateforme",
        "V1.5 — API-Verträge, Sicherheitsanalyse, Identitätswerkzeuge und Plattformhärtung",
        "V1.5 — API契約、セキュリティ分析、IDツール、プラットフォーム強化",
        "V1.5 — API 契约、安全分析、身份工具及平台加固",
        "V1.5 — عقود API وتحليل الأمان وأدوات الهوية وتقوية المنصة"
    ],
    "Eight local-first developer tools join the catalog, while managed network routes, untrusted previews, certificate inspection, extension handoffs, release metadata, and Ant Design v6 usage receive a focused reliability and security pass. The catalog now contains 121 tools across 15 categories.": [
        "आठ local-first developer tools कैटलॉग में जुड़ते हैं; managed network routes, अविश्वसनीय previews, certificate inspection, extension handoffs, release metadata और Ant Design v6 प्रयोग की विश्वसनीयता व सुरक्षा सुधरती है। अब 15 श्रेणियों में 121 टूल हैं।",
        "Ocho herramientas locales se suman al catálogo, mientras rutas de red, vistas no confiables, certificados, traspasos de extensión, metadatos de versión y Ant Design v6 reciben mejoras de fiabilidad y seguridad. Hay 121 herramientas en 15 categorías.",
        "Huit outils privilégiant le local rejoignent le catalogue ; routes gérées, aperçus non fiables, certificats, transferts d’extension, métadonnées et Ant Design v6 bénéficient d’une revue fiabilité/sécurité. Le catalogue compte 121 outils et 15 catégories.",
        "Acht lokal orientierte Entwicklerwerkzeuge ergänzen den Katalog; verwaltete Netzwerkrouten, nicht vertrauenswürdige Vorschauen, Zertifikatprüfung, Erweiterungsübergaben, Release-Metadaten und Ant Design v6 erhalten gezielte Zuverlässigkeits- und Sicherheitsverbesserungen. Nun 121 Werkzeuge in 15 Kategorien.",
        "ローカル優先の開発ツール8件を追加。管理ルート、未信頼プレビュー、証明書検査、拡張機能からの受け渡し、リリースメタデータ、Ant Design v6の信頼性と安全性を改善。15分類121ツールです。",
        "八项本地优先开发工具加入目录，并针对托管网络路由、不可信预览、证书检查、扩展交接、版本元数据及 Ant Design v6 用法进行可靠性与安全改进。目录现有 15 类共 121 项工具。",
        "تنضم ثماني أدوات تطوير تفضّل المعالجة المحلية، مع تحسين موثوقية وأمان المسارات المدارة والمعاينات غير الموثوقة وفحص الشهادات وتسليمات الإضافات وبيانات الإصدار واستخدام Ant Design v6. يضم الكتالوج 121 أداة في 15 فئة."
    ],
    "New API, contract & platform tools (8)": [
        "नए API, अनुबंध और प्लेटफ़ॉर्म टूल (8)",
        "Nuevas herramientas API, contratos y plataforma (8)",
        "Nouveaux outils API, contrats et plateforme (8)",
        "Neue API-, Vertrags- und Plattformwerkzeuge (8)",
        "新しいAPI・契約・プラットフォームツール（8）",
        "新增 API、契约与平台工具（8）",
        "أدوات API والعقود والمنصة الجديدة (8)"
    ],
    "**OpenAPI Contract Diff** — compares two OpenAPI or Swagger documents and reports conservative breaking changes across operations, required parameters, responses, and schema requirements.": [
        "**OpenAPI Contract Diff** — दो OpenAPI या Swagger दस्तावेज़ तुलना करके operations, आवश्यक parameters, responses व schema requirements में संभावित breaking changes की सावधानीपूर्ण रिपोर्ट देता है।",
        "**OpenAPI Contract Diff** — compara dos documentos OpenAPI o Swagger e informa de forma conservadora cambios incompatibles en operaciones, parámetros obligatorios, respuestas y requisitos de esquema.",
        "**OpenAPI Contract Diff** — compare deux documents OpenAPI ou Swagger et signale prudemment les ruptures concernant opérations, paramètres requis, réponses et exigences de schéma.",
        "**OpenAPI Contract Diff** — vergleicht zwei OpenAPI- oder Swagger-Dokumente und meldet vorsichtig inkompatible Änderungen bei Operationen, Pflichtparametern, Antworten und Schemaanforderungen.",
        "**OpenAPI Contract Diff** — 2つのOpenAPI・Swagger文書を比較し、操作、必須パラメーター、応答、スキーマ要件の破壊的変更を保守的に報告します。",
        "**OpenAPI Contract Diff** — 比较两份 OpenAPI 或 Swagger 文档，保守报告操作、必需参数、响应及 schema 要求中的破坏性变更。",
        "**OpenAPI Contract Diff** — يقارن مستندي OpenAPI أو Swagger ويبلغ بتحفظ عن التغييرات الكاسرة في العمليات والمعاملات المطلوبة والاستجابات ومتطلبات المخطط."
    ],
    "**JSON Schema Workbench** — validates JSON or YAML instances against common Draft 2020-12 schema rules, including local references, types, required properties, enums, strings, arrays, and additional-property checks.": [
        "**JSON Schema Workbench** — स्थानीय references, types, आवश्यक properties, enums, strings, arrays और additional-property checks सहित सामान्य Draft 2020-12 नियमों पर JSON या YAML instances जांचता है।",
        "**JSON Schema Workbench** — valida instancias JSON o YAML con reglas comunes Draft 2020-12, incluidas referencias locales, tipos, propiedades obligatorias, enums, cadenas, arrays y propiedades adicionales.",
        "**JSON Schema Workbench** — valide les instances JSON ou YAML selon les règles courantes Draft 2020-12 : références locales, types, propriétés requises, énumérations, chaînes, tableaux et propriétés supplémentaires.",
        "**JSON Schema Workbench** — validiert JSON- oder YAML-Instanzen anhand üblicher Draft-2020-12-Regeln mit lokalen Referenzen, Typen, Pflichtfeldern, Enums, Strings, Arrays und Zusatzfeldprüfungen.",
        "**JSON Schema Workbench** — ローカル参照、型、必須プロパティ、列挙、文字列、配列、追加プロパティ検査を含む一般的なDraft 2020-12規則でJSON・YAMLを検証します。",
        "**JSON Schema Workbench** — 按常见 Draft 2020-12 规则验证 JSON 或 YAML 实例，包括本地引用、类型、必需属性、枚举、字符串、数组及额外属性检查。",
        "**JSON Schema Workbench** — يتحقق من مثيلات JSON أو YAML بقواعد Draft 2020-12 الشائعة، بما فيها المراجع المحلية والأنواع والخصائص المطلوبة والتعدادات والنصوص والمصفوفات والخصائص الإضافية."
    ],
    "**AsyncAPI Explorer** — summarizes AsyncAPI 2.x/3.x channels, operations, servers, messages, and core required fields without contacting a broker.": [
        "**AsyncAPI एक्सप्लोरर** — ब्रोकर से संपर्क किए बिना AsyncAPI 2.x/3.x के चैनल, ऑपरेशन, सर्वर, संदेश और मुख्य आवश्यक फ़ील्ड का सार देता है।",
        "**Explorador AsyncAPI** — resume canales, operaciones, servidores, mensajes y campos obligatorios principales de AsyncAPI 2.x/3.x sin contactar con un bróker.",
        "**Explorateur AsyncAPI** — résume les canaux, opérations, serveurs, messages et champs requis d’AsyncAPI 2.x/3.x sans contacter de courtier.",
        "**AsyncAPI-Explorer** — fasst Kanäle, Operationen, Server, Nachrichten und zentrale Pflichtfelder von AsyncAPI 2.x/3.x zusammen, ohne einen Broker zu kontaktieren.",
        "**AsyncAPI エクスプローラー** — ブローカーに接続せず、AsyncAPI 2.x/3.x のチャネル、操作、サーバー、メッセージ、主要な必須項目を要約します。",
        "**AsyncAPI 浏览器** — 无需联系消息代理，即可汇总 AsyncAPI 2.x/3.x 的通道、操作、服务器、消息和核心必填字段。",
        "**مستكشف AsyncAPI** — يلخّص قنوات AsyncAPI 2.x/3.x وعملياته وخوادمه ورسائله وحقوله الأساسية المطلوبة دون الاتصال بوسيط."
    ],
    "**GraphQL Schema & Operation Explorer** — validates queries, mutations, and subscriptions against pasted SDL with the official GraphQL parser; it never connects to an endpoint.": [
        "**GraphQL स्कीमा और ऑपरेशन एक्सप्लोरर** — आधिकारिक GraphQL पार्सर से पेस्ट किए SDL के विरुद्ध क्वेरी, म्यूटेशन और सब्सक्रिप्शन जाँचता है; किसी एंडपॉइंट से नहीं जुड़ता।",
        "**Explorador de esquemas y operaciones GraphQL** — valida consultas, mutaciones y suscripciones contra SDL pegado con el analizador oficial GraphQL; nunca conecta con un endpoint.",
        "**Explorateur de schémas et opérations GraphQL** — valide requêtes, mutations et abonnements par rapport au SDL collé avec l’analyseur officiel GraphQL, sans connexion à un point de terminaison.",
        "**GraphQL-Schema- und Operations-Explorer** — prüft Abfragen, Mutationen und Abonnements anhand eingefügter SDL mit dem offiziellen GraphQL-Parser; verbindet sich nie mit einem Endpunkt.",
        "**GraphQL スキーマ・操作エクスプローラー** — 公式 GraphQL パーサーで貼り付けた SDL に対してクエリ、ミューテーション、サブスクリプションを検証します。エンドポイントには接続しません。",
        "**GraphQL 模式与操作浏览器** — 使用官方 GraphQL 解析器，针对粘贴的 SDL 验证查询、变更和订阅；不会连接端点。",
        "**مستكشف مخططات وعمليات GraphQL** — يتحقق من الاستعلامات والتعديلات والاشتراكات مقابل SDL الملصق بالمحلل الرسمي لـ GraphQL، ولا يتصل بأي نقطة نهاية."
    ],
    "**Security Headers & CSP Analyzer** — evaluates pasted response headers for CSP, HSTS, nosniff, Referrer-Policy, and Permissions-Policy gaps locally.": [
        "**सुरक्षा हेडर और CSP विश्लेषक** — पेस्ट किए रिस्पॉन्स हेडरों में CSP, HSTS, nosniff, Referrer-Policy और Permissions-Policy की कमियाँ स्थानीय रूप से जाँचता है।",
        "**Analizador de cabeceras de seguridad y CSP** — evalúa localmente carencias de CSP, HSTS, nosniff, Referrer-Policy y Permissions-Policy en cabeceras pegadas.",
        "**Analyseur d’en-têtes de sécurité et CSP** — évalue localement les lacunes CSP, HSTS, nosniff, Referrer-Policy et Permissions-Policy des en-têtes collés.",
        "**Sicherheitsheader- und CSP-Analyse** — untersucht eingefügte Antwortheader lokal auf Lücken bei CSP, HSTS, nosniff, Referrer-Policy und Permissions-Policy.",
        "**セキュリティヘッダー・CSP 解析** — 貼り付けた応答ヘッダーの CSP、HSTS、nosniff、Referrer-Policy、Permissions-Policy の不足をローカルで調べます。",
        "**安全标头与 CSP 分析器** — 在本地检查粘贴的响应标头中 CSP、HSTS、nosniff、Referrer-Policy 和 Permissions-Policy 的缺口。",
        "**محلل ترويسات الأمان وCSP** — يقيّم محليًا نواقص CSP وHSTS وnosniff وReferrer-Policy وPermissions-Policy في ترويسات الاستجابة الملصقة."
    ],
    "**OAuth / OIDC & PKCE Playground** — reviews pasted discovery metadata, generates local PKCE S256 verifier/challenge pairs, and previews an authorization request without fetching a provider or accepting secrets.": [
        "**OAuth / OIDC और PKCE प्रयोगशाला** — पेस्ट किया डिस्कवरी मेटाडेटा जाँचती है, स्थानीय PKCE S256 verifier/challenge जोड़े बनाती है और प्रदाता से डेटा लाए या रहस्य लिए बिना प्राधिकरण अनुरोध का पूर्वावलोकन देती है।",
        "**Laboratorio OAuth / OIDC y PKCE** — revisa metadatos de descubrimiento pegados, genera pares verifier/challenge PKCE S256 locales y previsualiza una autorización sin consultar proveedores ni aceptar secretos.",
        "**Atelier OAuth / OIDC et PKCE** — examine les métadonnées de découverte collées, génère localement des paires verifier/challenge PKCE S256 et prévisualise une autorisation sans contacter de fournisseur ni accepter de secrets.",
        "**OAuth-/OIDC- und PKCE-Spielplatz** — prüft eingefügte Discovery-Metadaten, erzeugt lokale PKCE-S256-Verifier/Challenge-Paare und zeigt Autorisierungsanfragen ohne Anbieterabruf oder Geheimniseingabe.",
        "**OAuth / OIDC・PKCE プレイグラウンド** — 貼り付けたディスカバリー情報を確認し、PKCE S256 verifier/challenge をローカル生成。提供元への取得や秘密情報の入力なしで認可リクエストをプレビューします。",
        "**OAuth / OIDC 与 PKCE 实验场** — 审查粘贴的发现元数据，本地生成 PKCE S256 verifier/challenge 对，并预览授权请求，不获取提供商数据或接收秘密。",
        "**مختبر OAuth / OIDC وPKCE** — يراجع بيانات الاكتشاف الملصقة، وينشئ أزواج verifier/challenge من PKCE S256 محليًا، ويعاين طلب التفويض دون جلب بيانات مزوّد أو قبول أسرار."
    ],
    "**Docker Compose Analyzer** — inspects compose.yaml services, ports, volumes, networks, privileged containers, host networking, and healthcheck coverage; it never contacts Docker.": [
        "**Docker Compose विश्लेषक** — compose.yaml के सर्विस, पोर्ट, वॉल्यूम, नेटवर्क, विशेषाधिकार कंटेनर, होस्ट नेटवर्किंग और healthcheck कवरेज जाँचता है; Docker से संपर्क नहीं करता।",
        "**Analizador Docker Compose** — inspecciona servicios, puertos, volúmenes, redes, contenedores privilegiados, red del host y healthchecks de compose.yaml; nunca contacta con Docker.",
        "**Analyseur Docker Compose** — inspecte services, ports, volumes, réseaux, conteneurs privilégiés, réseau hôte et couverture healthcheck de compose.yaml, sans contacter Docker.",
        "**Docker-Compose-Analyse** — prüft Dienste, Ports, Volumes, Netzwerke, privilegierte Container, Hostnetz und Healthchecks in compose.yaml, ohne Docker zu kontaktieren.",
        "**Docker Compose 解析** — compose.yaml のサービス、ポート、ボリューム、ネットワーク、特権コンテナー、ホストネットワーク、healthcheck の有無を調べます。Docker には接続しません。",
        "**Docker Compose 分析器** — 检查 compose.yaml 的服务、端口、卷、网络、特权容器、主机网络和 healthcheck 覆盖，不连接 Docker。",
        "**محلل Docker Compose** — يفحص خدمات compose.yaml ومنافذه ووحدات تخزينه وشبكاته والحاويات المميزة وشبكة المضيف وتغطية healthcheck دون الاتصال بـ Docker."
    ],
    "**WebAuthn / Passkey Playground** — decodes serialised credential metadata and clientDataJSON locally. Full registration and assertion ceremonies remain application-specific and require server-side challenge validation.": [
        "**WebAuthn / Passkey प्रयोगशाला** — सीरियलाइज़्ड क्रेडेंशियल मेटाडेटा और clientDataJSON स्थानीय रूप से डिकोड करती है। पूर्ण पंजीकरण और assertion प्रक्रियाएँ एप्लिकेशन-विशिष्ट हैं तथा सर्वर पर challenge सत्यापन चाहती हैं।",
        "**Laboratorio WebAuthn / Passkey** — decodifica localmente metadatos de credenciales serializados y clientDataJSON. El registro y las aserciones completos dependen de cada aplicación y requieren validar el desafío en servidor.",
        "**Atelier WebAuthn / Passkey** — décode localement les métadonnées sérialisées d’identifiants et clientDataJSON. Les cérémonies complètes dépendent de l’application et exigent une validation du défi côté serveur.",
        "**WebAuthn-/Passkey-Spielplatz** — dekodiert serialisierte Zugangsdaten-Metadaten und clientDataJSON lokal. Vollständige Registrierungs- und Bestätigungsabläufe sind anwendungsspezifisch und benötigen serverseitige Challenge-Prüfung.",
        "**WebAuthn / パスキー実験場** — シリアライズした認証情報メタデータと clientDataJSON をローカルでデコード。登録・アサーションの完全な処理はアプリ固有で、サーバー側のチャレンジ検証が必要です。",
        "**WebAuthn / 通行密钥实验场** — 本地解码序列化凭据元数据和 clientDataJSON。完整注册与断言流程因应用而异，且需要服务器端挑战验证。",
        "**مختبر WebAuthn / Passkey** — يفك محليًا بيانات الاعتماد الوصفية المسلسلة وclientDataJSON. تظل إجراءات التسجيل والإثبات الكاملة خاصة بالتطبيق وتتطلب التحقق من التحدي على الخادم."
    ],
    "Managed network route hardening": [
        "प्रबंधित नेटवर्क रूट की सुरक्षा मज़बूत",
        "Refuerzo de rutas de red gestionadas",
        "Renforcement des routes réseau gérées",
        "Härtung verwalteter Netzwerkrouten",
        "管理ネットワークルートの保護強化",
        "托管网络路由加固",
        "تعزيز حماية مسارات الشبكة المُدارة"
    ],
    "Managed proxy, streaming proxy, certificate fetch, and webhook capture routes are disabled by default in production and require `MYDEVTOOLS_ENABLE_MANAGED_ROUTES=true` behind appropriate gateway controls.": [
        "प्रबंधित प्रॉक्सी, स्ट्रीमिंग प्रॉक्सी, प्रमाणपत्र फ़ेच और webhook कैप्चर रूट प्रोडक्शन में डिफ़ॉल्ट बंद हैं; उपयुक्त गेटवे नियंत्रणों के पीछे `MYDEVTOOLS_ENABLE_MANAGED_ROUTES=true` चाहिए।",
        "Las rutas de proxy gestionado, streaming, certificados y captura webhook están desactivadas por defecto en producción y requieren `MYDEVTOOLS_ENABLE_MANAGED_ROUTES=true` detrás de controles de gateway adecuados.",
        "Les routes proxy géré, streaming, certificats et capture webhook sont désactivées par défaut en production et nécessitent `MYDEVTOOLS_ENABLE_MANAGED_ROUTES=true` derrière des contrôles de passerelle adaptés.",
        "Verwaltete Proxy-, Streaming-, Zertifikatsabruf- und Webhook-Routen sind in Produktion standardmäßig aus und erfordern `MYDEVTOOLS_ENABLE_MANAGED_ROUTES=true` hinter passenden Gateway-Kontrollen.",
        "管理プロキシ、ストリーミングプロキシ、証明書取得、webhook 受信ルートは本番で既定無効です。適切なゲートウェイ制御の背後で `MYDEVTOOLS_ENABLE_MANAGED_ROUTES=true` が必要です。",
        "托管代理、流式代理、证书获取及 webhook 捕获路由在生产环境默认关闭，需在适当网关控制后启用 `MYDEVTOOLS_ENABLE_MANAGED_ROUTES=true`。",
        "مسارات الوكيل المُدار والبث وجلب الشهادات والتقاط webhook معطلة افتراضيًا في الإنتاج، وتتطلب `MYDEVTOOLS_ENABLE_MANAGED_ROUTES=true` خلف ضوابط بوابة مناسبة."
    ],
    "Public-address validation and DNS pinning block loopback, private, link-local, multicast, documentation, and mixed public/private destinations before outbound connections are made.": [
        "आउटबाउंड कनेक्शन से पहले सार्वजनिक पता सत्यापन और DNS पिनिंग loopback, निजी, link-local, multicast, दस्तावेज़ी तथा मिश्रित सार्वजनिक/निजी गंतव्य रोकते हैं।",
        "La validación de direcciones públicas y el anclaje DNS bloquean destinos loopback, privados, link-local, multicast, de documentación y mixtos antes de conectar.",
        "La validation des adresses publiques et l’épinglage DNS bloquent les destinations loopback, privées, link-local, multicast, de documentation et mixtes avant connexion.",
        "Öffentliche Adressprüfung und DNS-Pinning blockieren Loopback-, private, Link-Local-, Multicast-, Dokumentations- und gemischte Ziele vor ausgehenden Verbindungen.",
        "公開アドレス検証と DNS 固定により、外部接続前にループバック、プライベート、リンクローカル、マルチキャスト、文書用、公開・非公開混在の宛先を拒否します。",
        "公共地址验证和 DNS 固定会在出站连接前阻止回环、私有、链路本地、组播、文档专用及公私混合目的地。",
        "يحظر التحقق من العناوين العامة وتثبيت DNS وجهات الحلقة المحلية والخاصة والمحلية للرابط والبث المتعدد والتوثيق والوجهات المختلطة قبل الاتصالات الصادرة."
    ],
    "Proxy routes now clamp request/response sizes and timeouts, use strict TLS by default, protect redirects, and remove credentials on cross-origin redirects.": [
        "प्रॉक्सी रूट अब अनुरोध/रिस्पॉन्स आकार और समयसीमा सीमित करते हैं, डिफ़ॉल्ट सख्त TLS लेते हैं, रीडायरेक्ट सुरक्षित करते हैं और cross-origin रीडायरेक्ट पर क्रेडेंशियल हटाते हैं।",
        "Los proxies limitan tamaños y tiempos, usan TLS estricto por defecto, protegen redirecciones y eliminan credenciales al cambiar de origen.",
        "Les proxys limitent tailles et délais, utilisent TLS strict par défaut, sécurisent les redirections et retirent les identifiants en cas de changement d’origine.",
        "Proxyrouten begrenzen Größen und Zeitlimits, nutzen standardmäßig striktes TLS, sichern Weiterleitungen und entfernen Zugangsdaten bei Ursprungwechseln.",
        "プロキシは要求・応答サイズと時間を制限し、既定で厳格な TLS を使用。リダイレクトを保護し、別オリジンへの転送時に資格情報を除去します。",
        "代理路由现限制请求/响应大小和超时，默认使用严格 TLS，保护重定向，并在跨源重定向时移除凭据。",
        "تحد مسارات الوكيل من أحجام الطلبات والاستجابات ومهلها، وتستخدم TLS صارمًا افتراضيًا، وتحمي التحويلات وتحذف بيانات الاعتماد عند اختلاف الأصل."
    ],
    "Webhook capture now uses stronger session identifiers plus bounded per-session/global retention. It remains temporary in-memory development/debugging storage, not durable delivery infrastructure.": [
        "Webhook कैप्चर अब मज़बूत सत्र ID और प्रति-सत्र/वैश्विक सीमित भंडारण लेता है। यह अस्थायी इन-मेमोरी विकास/डिबग स्टोरेज है, टिकाऊ डिलीवरी ढाँचा नहीं।",
        "La captura webhook usa identificadores más fuertes y retención limitada por sesión y global. Sigue siendo almacenamiento temporal en memoria para desarrollo, no infraestructura de entrega duradera.",
        "La capture webhook utilise des identifiants renforcés et une rétention bornée par session et globale. Elle reste temporaire en mémoire pour le débogage, sans livraison durable.",
        "Webhook-Erfassung nutzt stärkere Sitzungskennungen und begrenzte Aufbewahrung je Sitzung und global. Sie bleibt temporärer Entwicklungsspeicher im RAM, keine dauerhafte Zustellinfrastruktur.",
        "Webhook 受信は強化したセッション ID とセッション別・全体の保持上限を使用します。開発・調査用の一時メモリ保存であり、永続配信基盤ではありません。",
        "Webhook 捕获使用更强会话标识符及会话级/全局保留上限，仍是临时内存开发调试存储，不是持久交付基础设施。",
        "يستخدم التقاط webhook معرفات جلسات أقوى واحتفاظًا محدودًا لكل جلسة وعالميًا. يظل تخزين تطوير وتصحيح مؤقتًا في الذاكرة لا بنية تسليم دائمة."
    ],
    "Fixed certificate inspection for hosts whose TLS client requests Node DNS lookup results in `all` mode, including `mportal.passportindia.gov.in`.": [
        "जिन होस्ट के TLS क्लाइंट Node DNS lookup को `all` मोड में माँगते हैं, उनका प्रमाणपत्र निरीक्षण सुधारा, जैसे `mportal.passportindia.gov.in`।",
        "Corregida la inspección cuando el cliente TLS pide resultados DNS Node en modo `all`, incluido `mportal.passportindia.gov.in`.",
        "Inspection corrigée lorsque le client TLS demande les résultats DNS Node en mode `all`, notamment pour `mportal.passportindia.gov.in`.",
        "Zertifikatsprüfung für Hosts behoben, deren TLS-Client Node-DNS-Ergebnisse im Modus `all` anfordert, einschließlich `mportal.passportindia.gov.in`.",
        "TLS クライアントが Node DNS の `all` モードを要求するホストの証明書検査を修正しました（`mportal.passportindia.gov.in` など）。",
        "修复 TLS 客户端要求 Node DNS 查询 `all` 模式结果时的证书检查，包括 `mportal.passportindia.gov.in`。",
        "أُصلح فحص شهادات المضيفين الذين يطلب عميل TLS لديهم نتائج Node DNS بوضع `all`، ومنهم `mportal.passportindia.gov.in`."
    ],
    "Safer content handling & clearer trust boundaries": [
        "सुरक्षित कंटेंट और स्पष्ट भरोसा सीमाएँ",
        "Contenido más seguro y límites de confianza claros",
        "Contenus plus sûrs et limites de confiance claires",
        "Sicherere Inhalte und klarere Vertrauensgrenzen",
        "安全なコンテンツ処理と明確な信頼境界",
        "更安全的内容处理与更清晰的信任边界",
        "محتوى أكثر أمانًا وحدود ثقة أوضح"
    ],
    "Mermaid and SVG previews now render in sandboxed iframes; SVG optimisation strips active-content sinks before rendering or download.": [
        "Mermaid और SVG पूर्वावलोकन अब sandbox iframe में चलते हैं; SVG अनुकूलन रेंडर/डाउनलोड से पहले सक्रिय कंटेंट के प्रवेश-बिंदु हटाता है।",
        "Las vistas Mermaid y SVG usan iframes aislados; la optimización SVG elimina receptores de contenido activo antes de visualizar o descargar.",
        "Les aperçus Mermaid et SVG utilisent des iframes isolées ; l’optimisation SVG retire les points d’injection actifs avant rendu ou téléchargement.",
        "Mermaid- und SVG-Vorschauen laufen in Sandbox-Iframes; SVG-Optimierung entfernt aktive Inhaltssenken vor Anzeige oder Download.",
        "Mermaid・SVG のプレビューをサンドボックス iframe で表示し、SVG 最適化は表示・ダウンロード前にアクティブコンテンツの危険箇所を除去します。",
        "Mermaid 和 SVG 预览现于沙箱 iframe 中渲染；SVG 优化在渲染或下载前移除活动内容注入位置。",
        "تُعرض معاينات Mermaid وSVG داخل إطارات معزولة؛ ويزيل تحسين SVG مواضع المحتوى النشط قبل العرض أو التنزيل."
    ],
    "Rich Text Editor input, stored documents, previews, and exports now pass through a local allowlist sanitizer.": [
        "रिच टेक्स्ट एडिटर के इनपुट, सेव दस्तावेज़, पूर्वावलोकन और एक्सपोर्ट अब स्थानीय अनुमत-सूची sanitizer से गुजरते हैं।",
        "Entradas, documentos guardados, vistas y exportaciones del editor enriquecido pasan por un sanitizador local de lista permitida.",
        "Saisie, documents enregistrés, aperçus et exports de l’éditeur enrichi passent par un assainisseur local à liste autorisée.",
        "Eingaben, gespeicherte Dokumente, Vorschauen und Exporte des Rich-Text-Editors durchlaufen einen lokalen Allowlist-Sanitizer.",
        "リッチテキストエディターの入力、保存文書、プレビュー、エクスポートをローカルの許可リスト型サニタイザーで処理します。",
        "富文本编辑器的输入、已保存文档、预览及导出均经过本地允许列表清理器。",
        "تمر مدخلات المحرر المنسق ومستنداته المحفوظة ومعايناته وتصديراته عبر منقٍّ محلي بقائمة سماح."
    ],
    "Network-capable tool notices now state exactly what a route does and whether webhook data is temporary, instead of using a generic privacy claim.": [
        "नेटवर्क वाले टूल के नोटिस अब सामान्य निजता दावे के बजाय रूट का काम और webhook डेटा की अस्थायी प्रकृति स्पष्ट बताते हैं।",
        "Los avisos de herramientas de red detallan qué hace la ruta y si los datos webhook son temporales, en vez de promesas genéricas de privacidad.",
        "Les avis réseau précisent le rôle de chaque route et le caractère temporaire des données webhook plutôt qu’une promesse générale de confidentialité.",
        "Netzwerkhinweise erklären jetzt genau die Route und die temporäre Webhook-Speicherung statt pauschaler Datenschutzversprechen.",
        "ネットワーク対応ツールの通知は一律のプライバシー表現をやめ、ルートの動作と webhook データが一時保存かを明記します。",
        "网络工具通知现明确说明路由行为及 webhook 数据是否临时保存，代替笼统隐私声明。",
        "توضح تنبيهات أدوات الشبكة وظيفة المسار وطبيعة بيانات webhook المؤقتة بدل ادعاء خصوصية عام."
    ],
    "Certificate verification defaults to enabled; certificate fetching intentionally allows invalid chains only so they can be inspected, while destination protections remain enforced.": [
        "प्रमाणपत्र सत्यापन डिफ़ॉल्ट चालू है; फ़ेच केवल निरीक्षण के लिए अवैध चेन स्वीकार करता है, लेकिन गंतव्य सुरक्षा लागू रहती है।",
        "La verificación de certificados está activada por defecto; la obtención acepta cadenas inválidas solo para inspeccionarlas, manteniendo las protecciones de destino.",
        "La vérification est activée par défaut ; le téléchargement accepte les chaînes invalides uniquement pour inspection, tout en maintenant les protections de destination.",
        "Zertifikatsprüfung ist standardmäßig aktiv; beim Abruf sind ungültige Ketten absichtlich zur Untersuchung erlaubt, Zielschutz bleibt erhalten.",
        "証明書検証は既定で有効です。取得機能は無効なチェーンの調査を許しますが、接続先保護は引き続き適用します。",
        "证书验证默认开启；证书获取仅为检查而允许无效链，目的地保护仍然执行。",
        "التحقق من الشهادات مفعّل افتراضيًا؛ ويسمح الجلب بالسلاسل غير الصالحة للفحص فقط مع بقاء حماية الوجهات."
    ],
    "Quality, accessibility & catalog accuracy": [
        "गुणवत्ता, पहुँचयोग्यता और सही कैटलॉग",
        "Calidad, accesibilidad y precisión del catálogo",
        "Qualité, accessibilité et exactitude du catalogue",
        "Qualität, Barrierefreiheit und Kataloggenauigkeit",
        "品質・アクセシビリティ・カタログの正確性",
        "质量、无障碍与目录准确性",
        "الجودة وإمكانية الوصول ودقة الكتالوج"
    ],
    "Replaced deprecated Ant Design `Descriptions.labelStyle`, static message usage, `List`, and `Input.addonBefore` patterns in the updated tools with context-aware v6 APIs.": [
        "अपडेट टूल में पुराने Ant Design `Descriptions.labelStyle`, स्थिर message उपयोग, `List` और `Input.addonBefore` पैटर्न को संदर्भ-सचेत v6 API से बदला।",
        "Sustituidos los patrones obsoletos Ant Design `Descriptions.labelStyle`, mensajes estáticos, `List` y `Input.addonBefore` por API v6 con contexto en las herramientas actualizadas.",
        "Les modèles obsolètes Ant Design `Descriptions.labelStyle`, messages statiques, `List` et `Input.addonBefore` sont remplacés par des API v6 contextuelles.",
        "Veraltete Ant-Design-Muster `Descriptions.labelStyle`, statische Nachrichten, `List` und `Input.addonBefore` wurden in aktualisierten Tools durch kontextfähige v6-APIs ersetzt.",
        "更新対象ツールで非推奨の Ant Design `Descriptions.labelStyle`、静的メッセージ、`List`、`Input.addonBefore` をコンテキスト対応 v6 API に置き換えました。",
        "更新工具中已将弃用的 Ant Design `Descriptions.labelStyle`、静态消息、`List` 和 `Input.addonBefore` 模式替换为支持上下文的 v6 API。",
        "استُبدلت أنماط Ant Design المهجورة `Descriptions.labelStyle` والرسائل الثابتة و`List` و`Input.addonBefore` بواجهات v6 تراعي السياق في الأدوات المحدثة."
    ],
    "Tool pages use one H1, visible trust notices before managed actions, labelled controls, and responsive layouts; catalog links and structured data now match the registered count.": [
        "टूल पेज पर एक H1, प्रबंधित कार्रवाई से पहले भरोसा नोटिस, लेबल वाले कंट्रोल और responsive लेआउट हैं; कैटलॉग लिंक और संरचित डेटा पंजीकृत संख्या से मेल खाते हैं।",
        "Las páginas usan un H1, avisos antes de acciones gestionadas, controles etiquetados y diseños adaptables; enlaces y datos estructurados coinciden con el recuento registrado.",
        "Les pages utilisent un H1, des avis avant actions gérées, des contrôles étiquetés et des mises en page adaptatives ; liens et données structurées suivent le nombre enregistré.",
        "Toolseiten nutzen ein H1, sichtbare Hinweise vor verwalteten Aktionen, beschriftete Steuerelemente und responsive Layouts; Links und strukturierte Daten entsprechen der registrierten Anzahl.",
        "各ツールは H1 を1つ、管理操作前の通知、ラベル付き操作部、レスポンシブ表示を使用。カタログのリンクと構造化データは登録数に一致します。",
        "工具页采用单一 H1、托管操作前可见通知、带标签控件及响应式布局；目录链接和结构化数据与注册数量一致。",
        "تستخدم الصفحات عنوان H1 واحدًا وتنبيهات قبل الإجراءات المُدارة وعناصر معنونة وتخطيطات متجاوبة؛ وتطابق الروابط والبيانات المنظمة العدد المسجل."
    ],
    "Extension handoff state now matches each target schema, custom origins are validated, and stale manifest icon/permission references were removed.": [
        "एक्सटेंशन का हैंडऑफ़ डेटा लक्ष्य स्कीमा से मेल खाता है, कस्टम origin जाँचे जाते हैं और पुराने manifest आइकन/अनुमति संदर्भ हटाए गए।",
        "La transferencia de la extensión coincide con cada esquema destino, valida orígenes personalizados y elimina referencias antiguas de iconos/permisos del manifiesto.",
        "Le transfert de l’extension respecte chaque schéma cible, valide les origines personnalisées et retire les anciennes références d’icônes/autorisations du manifeste.",
        "Erweiterungsübergaben entsprechen dem Zielschema, eigene Ursprünge werden geprüft, veraltete Manifest-Icon- und Berechtigungsreferenzen entfernt.",
        "拡張機能の受け渡し状態を対象スキーマに合わせ、カスタムオリジンを検証し、古いマニフェストのアイコン・権限参照を削除しました。",
        "扩展传递状态现匹配各目标模式，验证自定义来源，并移除过时的清单图标及权限引用。",
        "تطابق حالة نقل الإضافة مخطط كل هدف، وتُتحقق الأصول المخصصة وأُزيلت مراجع الأيقونات والأذونات القديمة من البيان."
    ],
    "Added network-policy and contract-tool regression tests. Production build, type checks, route/catalog parity, and focused browser checks passed; lint completed with no errors (existing repository warnings remain tracked separately).": [
        "नेटवर्क नीति और कॉन्ट्रैक्ट टूल के रिग्रेशन परीक्षण जोड़े। प्रोडक्शन बिल्ड, टाइप जाँच, रूट/कैटलॉग समानता और केंद्रित ब्राउज़र जाँच सफल; lint में त्रुटि नहीं, पुराने रिपॉज़िटरी चेतावनी अलग दर्ज हैं।",
        "Añadidas regresiones de políticas de red y herramientas de contratos. Pasaron compilación de producción, tipos, paridad rutas/catálogo y pruebas de navegador; lint sin errores, con advertencias existentes registradas aparte.",
        "Ajout de tests de régression réseau et contrats. Build production, types, parité routes/catalogue et vérifications ciblées du navigateur réussis ; lint sans erreur, avertissements existants suivis séparément.",
        "Regressionstests für Netzwerkrichtlinien und Vertragstools hinzugefügt. Produktionsbuild, Typprüfung, Routen-/Katalogabgleich und gezielte Browsertests bestanden; Lint fehlerfrei, bestehende Warnungen separat erfasst.",
        "ネットワークポリシーと契約ツールの回帰テストを追加。本番ビルド、型、ルート・カタログ整合性、対象ブラウザー検査に合格。lint はエラーなしで、既存警告は別途追跡します。",
        "新增网络策略和契约工具回归测试。生产构建、类型检查、路由/目录一致性及针对性浏览器检查通过；lint 无错误，现有仓库警告单独跟踪。",
        "أُضيفت اختبارات تراجع لسياسة الشبكة وأدوات العقود. نجح بناء الإنتاج والأنواع وتطابق المسارات والكتالوج وفحوص المتصفح المستهدفة؛ lint بلا أخطاء مع تتبع التحذيرات القديمة منفصلًا."
    ],
    "V1.4 — 14 new tools, cross-tool pipelines, shareable URLs, PWA + browser extension": [
        "V1.4 — 14 नए टूल, क्रॉस-टूल पाइपलाइन, साझा URL, PWA और ब्राउज़र एक्सटेंशन",
        "V1.4 — 14 herramientas nuevas, flujos entre herramientas, URL compartibles, PWA y extensión",
        "V1.4 — 14 nouveaux outils, pipelines inter-outils, URL partageables, PWA et extension",
        "V1.4 — 14 neue Tools, Toolpipelines, teilbare URLs, PWA und Browsererweiterung",
        "V1.4 — 14個の新ツール、ツール間パイプライン、共有 URL、PWA・拡張機能",
        "V1.4 — 14 款新工具、跨工具流水线、可分享 URL、PWA 和浏览器扩展",
        "V1.4 — 14 أداة جديدة ومسارات عمل بين الأدوات وروابط مشاركة وPWA وإضافة متصفح"
    ],
    "Four new tool directions land fully implemented: Networking & Web (Webhook Receiver, WebSocket Tester, CORS Tester, DNS Lookup), Diff & Compare additions (Image Diff, CSV Diff), a new Image & Media category (Image Compressor, SVG Optimizer, Favicon Generator, Color Palette Extractor, EXIF Viewer), and Data Conversion additions (Mock Data Generator, TOML Converter, TOON Converter) — all 14 functional, no placeholders. The same release changes how the toolkit feels: tools hand off output to each other, every input has a Share button that round-trips to a URL fragment, the PWA manifest ships with an install button, and a Manifest V3 browser extension opens any selection in a tool. The AI category grows to 6 tools — all key-free, server-free, and local.": [
        "चार नए क्षेत्र पूरे लागू हुए: नेटवर्किंग और वेब (Webhook Receiver, WebSocket Tester, CORS Tester, DNS Lookup), तुलना में Image Diff और CSV Diff, नई Image & Media श्रेणी (Image Compressor, SVG Optimizer, Favicon Generator, Color Palette Extractor, EXIF Viewer), और डेटा रूपांतरण (Mock Data Generator, TOML Converter, TOON Converter) — सभी 14 काम करते हैं, कोई placeholder नहीं। इसी रिलीज़ में टूल एक-दूसरे को आउटपुट देते हैं, हर इनपुट का Share बटन URL fragment से स्थिति लौटाता है, PWA manifest के साथ इंस्टॉल बटन है और Manifest V3 एक्सटेंशन चुना टेक्स्ट टूल में खोलता है। AI श्रेणी में अब 6 टूल हैं — सब बिना कुंजी, बिना सर्वर और स्थानीय।",
        "Llegan cuatro áreas completas: Redes y Web (Webhook Receiver, WebSocket Tester, CORS Tester, DNS Lookup), comparación (Image Diff, CSV Diff), la nueva categoría Imagen y Medios (Image Compressor, SVG Optimizer, Favicon Generator, Color Palette Extractor, EXIF Viewer) y conversión (Mock Data Generator, TOML Converter, TOON Converter): las 14 funcionales, sin marcadores. También cambia el uso: las herramientas intercambian salidas, cada entrada tiene Share con restauración por fragmento URL, el manifiesto PWA incluye botón de instalación y una extensión Manifest V3 abre cualquier selección en una herramienta. IA crece a 6 herramientas, todas locales, sin claves ni servidor.",
        "Quatre axes arrivent complets : Réseau et Web (Webhook Receiver, WebSocket Tester, CORS Tester, DNS Lookup), comparaison (Image Diff, CSV Diff), nouvelle catégorie Image et médias (Image Compressor, SVG Optimizer, Favicon Generator, Color Palette Extractor, EXIF Viewer) et conversion (Mock Data Generator, TOML Converter, TOON Converter) : les 14 fonctionnent, sans substituts. L’usage change aussi : sorties transférables entre outils, bouton Share pour chaque saisie avec restauration par fragment URL, installation PWA et extension Manifest V3 ouvrant toute sélection dans un outil. L’IA passe à 6 outils, tous locaux, sans clé ni serveur.",
        "Vier Bereiche vollständig umgesetzt: Netzwerk und Web (Webhook Receiver, WebSocket Tester, CORS Tester, DNS Lookup), Vergleich (Image Diff, CSV Diff), neue Kategorie Bild und Medien (Image Compressor, SVG Optimizer, Favicon Generator, Color Palette Extractor, EXIF Viewer) und Datenkonvertierung (Mock Data Generator, TOML Converter, TOON Converter). Alle 14 funktionieren ohne Platzhalter. Tools übergeben Ausgaben untereinander, jede Eingabe hat Share mit URL-Fragment-Wiederherstellung, das PWA-Manifest erhält einen Installationsknopf und eine Manifest-V3-Erweiterung öffnet markierten Text im Tool. Die KI-Kategorie wächst auf 6 lokale Tools ohne Schlüssel oder Server.",
        "4分野を完全実装しました。ネットワーク・Web（Webhook Receiver、WebSocket Tester、CORS Tester、DNS Lookup）、比較追加（Image Diff、CSV Diff）、新しい画像・メディア（Image Compressor、SVG Optimizer、Favicon Generator、Color Palette Extractor、EXIF Viewer）、データ変換追加（Mock Data Generator、TOML Converter、TOON Converter）の全14ツールが実動します。ツール間で出力を受け渡し、各入力の Share で URL フラグメントから復元可能に。PWA のインストールボタンと選択範囲をツールで開く Manifest V3 拡張も追加。AI は6ツールとなり、すべてローカル・キー不要・サーバー不要です。",
        "四个方向完整落地：网络与 Web（Webhook Receiver、WebSocket Tester、CORS Tester、DNS Lookup），比较新增（Image Diff、CSV Diff），全新图像与媒体分类（Image Compressor、SVG Optimizer、Favicon Generator、Color Palette Extractor、EXIF Viewer），以及数据转换新增（Mock Data Generator、TOML Converter、TOON Converter）。全部 14 款均可用，无占位工具。工具可互传输出，每项输入均有 Share 按钮，通过 URL 片段完整恢复；PWA 清单带安装按钮，Manifest V3 扩展可将选中文本送入工具。AI 分类增至 6 款，均无需密钥、无需服务器、本地运行。",
        "أُنجزت أربعة اتجاهات كاملة: الشبكات والويب (Webhook Receiver وWebSocket Tester وCORS Tester وDNS Lookup)، وإضافتا المقارنة Image Diff وCSV Diff، وفئة الصور والوسائط الجديدة (Image Compressor وSVG Optimizer وFavicon Generator وColor Palette Extractor وEXIF Viewer)، وإضافات التحويل (Mock Data Generator وTOML Converter وTOON Converter). الأدوات الـ14 تعمل بلا عناصر وهمية. تتبادل الأدوات الناتج، ولكل إدخال زر Share يعيد الحالة من جزء URL، ويأتي بيان PWA بزر تثبيت وإضافة Manifest V3 تفتح أي تحديد في أداة. تضم فئة AI الآن 6 أدوات، كلها محلية دون مفاتيح أو خادم."
    ],
    "New category — Image & Media (5 tools, all client-side)": [
        "नई श्रेणी — चित्र और मीडिया (5 टूल, सभी क्लाइंट पर)",
        "Nueva categoría: Imagen y Medios (5 herramientas, todas locales)",
        "Nouvelle catégorie — Image et médias (5 outils côté client)",
        "Neue Kategorie — Bild und Medien (5 clientseitige Tools)",
        "新カテゴリ — 画像・メディア（5ツール、すべてクライアント処理）",
        "新分类 — 图像与媒体（5 款，全部客户端运行）",
        "فئة جديدة — الصور والوسائط (5 أدوات كلها على العميل)"
    ],
    "**Image Compressor** — Canvas re-encode with quality slider, JPEG/WebP/PNG output, optional max-dimension resize, live before/after preview.": [
        "**इमेज कंप्रेसर** — Canvas से पुनः एन्कोड, गुणवत्ता स्लाइडर, JPEG/WebP/PNG आउटपुट, वैकल्पिक अधिकतम आकार और लाइव पहले/बाद पूर्वावलोकन।",
        "**Compresor de imágenes** — recodifica con Canvas, calidad ajustable, salida JPEG/WebP/PNG, tamaño máximo opcional y vista antes/después.",
        "**Compresseur d’images** — réencodage Canvas, qualité réglable, sorties JPEG/WebP/PNG, dimension maximale facultative et aperçu avant/après.",
        "**Bildkompressor** — Canvas-Neukodierung, Qualitätsregler, JPEG/WebP/PNG-Ausgabe, optionale Maximalgröße und Vorher/Nachher-Vorschau.",
        "**画像圧縮** — Canvas 再符号化、品質スライダー、JPEG/WebP/PNG、最大寸法の指定、変換前後のライブ比較。",
        "**图像压缩器** — Canvas 重编码、质量滑块、JPEG/WebP/PNG 输出、可选最大尺寸及前后实时预览。",
        "**ضاغط الصور** — إعادة ترميز Canvas مع ضبط الجودة وإخراج JPEG/WebP/PNG وحجم أقصى اختياري ومعاينة قبل/بعد."
    ],
    "**SVG Optimizer** — strips editor metadata (Inkscape/Sketch/Figma), collapses whitespace, rounds numeric precision with a 0–6 decimal slider, side-by-side rendered preview.": [
        "**SVG ऑप्टिमाइज़र** — Inkscape/Sketch/Figma मेटाडेटा हटाता है, रिक्तियाँ घटाता है, 0–6 दशमलव स्लाइडर से संख्याएँ गोल करता है और साथ-साथ पूर्वावलोकन देता है।",
        "**Optimizador SVG** — elimina metadatos Inkscape/Sketch/Figma, reduce espacios, redondea con 0–6 decimales y muestra vistas paralelas.",
        "**Optimiseur SVG** — retire les métadonnées Inkscape/Sketch/Figma, réduit les espaces, arrondit à 0–6 décimales et compare les rendus.",
        "**SVG-Optimierer** — entfernt Inkscape-/Sketch-/Figma-Metadaten, reduziert Leerraum, rundet mit 0–6 Dezimalstellen und zeigt beide Ansichten.",
        "**SVG 最適化** — Inkscape/Sketch/Figma の情報と余白を削減し、0～6桁の小数精度を指定。横並びで表示比較できます。",
        "**SVG 优化器** — 移除 Inkscape/Sketch/Figma 元数据、压缩空白，通过 0–6 位小数滑块取整，并排渲染预览。",
        "**محسّن SVG** — يزيل بيانات Inkscape/Sketch/Figma ويختصر الفراغات ويقرّب الدقة بمنزلق 0–6 منازل مع معاينة متجاورة."
    ],
    "**Favicon Generator** — produces 7 sizes (16/32/48/96/180/192/512) from one source, with HTML head snippet and PWA manifest scaffolds.": [
        "**फ़ेविकॉन जनरेटर** — एक स्रोत से 7 आकार (16/32/48/96/180/192/512), HTML head स्निपेट और PWA manifest ढाँचा बनाता है।",
        "**Generador de favicon** — crea 7 tamaños (16/32/48/96/180/192/512) desde una fuente, con fragmento HTML head y base de manifiesto PWA.",
        "**Générateur de favicon** — produit 7 tailles (16/32/48/96/180/192/512) depuis une source, avec extrait HTML head et base de manifeste PWA.",
        "**Favicon-Generator** — erzeugt 7 Größen (16/32/48/96/180/192/512) aus einer Quelle, dazu HTML-head-Snippet und PWA-Manifestvorlage.",
        "**ファビコン生成** — 1画像から7サイズ（16/32/48/96/180/192/512）、HTML head 用コード、PWA マニフェストの雛形を生成。",
        "**Favicon 生成器** — 从一张图生成 7 个尺寸（16/32/48/96/180/192/512），附 HTML head 片段和 PWA 清单框架。",
        "**مولّد favicon** — ينتج 7 أحجام (16/32/48/96/180/192/512) من مصدر واحد مع مقطع HTML head وقالب بيان PWA."
    ],
    "**Color Palette Extractor** — k-means in RGB space at 200px downsample, configurable palette size 3–16, HEX/RGB/HSL per swatch.": [
        "**रंग पैलेट एक्सट्रैक्टर** — 200px डाउनसैंपल पर RGB में k-means, 3–16 रंगों का आकार और हर रंग का HEX/RGB/HSL।",
        "**Extractor de paletas** — k-means RGB sobre imagen reducida a 200px, 3–16 colores y HEX/RGB/HSL por muestra.",
        "**Extracteur de palette** — k-means en RGB sur réduction à 200px, 3–16 couleurs et valeurs HEX/RGB/HSL par échantillon.",
        "**Farbpaletten-Extraktor** — k-means im RGB-Raum bei 200px-Verkleinerung, 3–16 Farben sowie HEX/RGB/HSL je Farbfeld.",
        "**配色抽出** — 200px に縮小して RGB 空間で k-means を実行。3～16色を指定し、各色の HEX/RGB/HSL を表示。",
        "**调色板提取器** — 在 200px 缩小图的 RGB 空间进行 k-means，支持 3–16 色及每色 HEX/RGB/HSL。",
        "**مستخرج لوحة الألوان** — خوارزمية k-means في RGB بعد تصغير إلى 200px، وحجم 3–16 لونًا وقيم HEX/RGB/HSL لكل عينة."
    ],
    "**EXIF Viewer** — in-browser EXIF parser for JPEG/TIFF; groups Camera/Lens/Capture/Image/GPS tags, decodes GPS to decimal lat/lon with map link.": [
        "**EXIF व्यूअर** — JPEG/TIFF का ब्राउज़र EXIF पार्सर; Camera/Lens/Capture/Image/GPS टैग समूह और मानचित्र लिंक सहित दशमलव अक्षांश/देशांतर।",
        "**Visor EXIF** — analizador JPEG/TIFF en navegador; agrupa Cámara/Lente/Captura/Imagen/GPS y convierte GPS a latitud/longitud decimal con enlace de mapa.",
        "**Visionneuse EXIF** — analyse JPEG/TIFF dans le navigateur ; groupes appareil/objectif/prise/image/GPS et coordonnées décimales avec lien cartographique.",
        "**EXIF-Anzeige** — JPEG-/TIFF-Parser im Browser; gruppiert Kamera-/Objektiv-/Aufnahme-/Bild-/GPS-Tags und liefert dezimale Koordinaten mit Kartenlink.",
        "**EXIF 表示** — ブラウザー内で JPEG/TIFF を解析。カメラ・レンズ・撮影・画像・GPS を分類し、位置を十進緯度経度と地図リンクで表示。",
        "**EXIF 查看器** — 浏览器内 JPEG/TIFF 解析器，分类相机/镜头/拍摄/图像/GPS 标签，并将 GPS 转为十进制经纬度及地图链接。",
        "**عارض EXIF** — محلل JPEG/TIFF في المتصفح يجمع وسوم الكاميرا والعدسة والتقاط الصورة والصورة وGPS، ويحوّل الموقع إلى إحداثيات عشرية مع رابط خريطة."
    ],
    "Networking & Web (4 tools)": [
        "नेटवर्किंग और वेब (4 टूल)",
        "Redes y Web (4 herramientas)",
        "Réseau et Web (4 outils)",
        "Netzwerk und Web (4 Tools)",
        "ネットワーク・Web（4ツール）",
        "网络与 Web（4 款工具）",
        "الشبكات والويب (4 أدوات)"
    ],
    "**Webhook Receiver** — generates a unique inbound URL, captures any HTTP request, surfaces method/headers/query/body live. Uses a new `/api/webhook/[sessionId]` endpoint with in-memory store (1h idle TTL, 200 requests/session).": [
        "**Webhook रिसीवर** — अनूठा इनबाउंड URL बनाता है, हर HTTP अनुरोध पकड़कर method/headers/query/body लाइव दिखाता है। नया `/api/webhook/[sessionId]` एंडपॉइंट इन-मेमोरी स्टोर लेता है (1h निष्क्रिय TTL, 200 अनुरोध/सत्र)।",
        "**Receptor webhook** — genera URL única, captura cualquier petición HTTP y muestra método/cabeceras/consulta/cuerpo en vivo. Usa `/api/webhook/[sessionId]` con memoria temporal (TTL inactivo 1h, 200 peticiones/sesión).",
        "**Récepteur webhook** — génère une URL unique, capture les requêtes HTTP et affiche méthode/en-têtes/requête/corps en direct. Utilise `/api/webhook/[sessionId]` en mémoire (TTL inactif 1h, 200 requêtes/session).",
        "**Webhook-Empfänger** — erzeugt eine eindeutige URL, erfasst HTTP-Anfragen und zeigt Methode/Header/Query/Body live. Neuer Endpunkt `/api/webhook/[sessionId]` mit RAM-Speicher (1h Inaktivitäts-TTL, 200 Anfragen/Sitzung).",
        "**Webhook 受信** — 固有の受信 URL を生成し、任意の HTTP 要求の method/headers/query/body をリアルタイム表示。`/api/webhook/[sessionId]` とメモリ保存を使用（無操作 TTL 1h、200要求/セッション）。",
        "**Webhook 接收器** — 生成唯一入站 URL，捕获任意 HTTP 请求并实时显示方法/标头/查询/正文。使用新端点 `/api/webhook/[sessionId]` 和内存存储（空闲 TTL 1h，每会话 200 请求）。",
        "**مستقبل webhook** — يولّد عنوان استقبال فريدًا ويلتقط أي طلب HTTP ويعرض الطريقة والترويسات والاستعلام والجسم مباشرة. يستخدم `/api/webhook/[sessionId]` بمخزن ذاكرة (مهلة خمول 1h و200 طلب/جلسة)."
    ],
    "**WebSocket Tester** — real ws/wss client with connection state, text frame send, timestamped history.": [
        "**WebSocket टेस्टर** — वास्तविक ws/wss क्लाइंट, कनेक्शन स्थिति, टेक्स्ट फ़्रेम भेजना और समयांकित इतिहास।",
        "**Probador WebSocket** — cliente ws/wss real con estado, envío de texto e historial con marcas de tiempo.",
        "**Testeur WebSocket** — vrai client ws/wss avec état, envoi de trames texte et historique horodaté.",
        "**WebSocket-Tester** — echter ws/wss-Client mit Verbindungsstatus, Textframes und Zeitstempelverlauf.",
        "**WebSocket テスト** — 実際の ws/wss 接続、状態表示、テキストフレーム送信、時刻付き履歴。",
        "**WebSocket 测试器** — 真实 ws/wss 客户端，支持连接状态、文本帧发送和时间戳历史。",
        "**مختبر WebSocket** — عميل ws/wss فعلي مع حالة اتصال وإرسال إطارات نصية وسجل مؤرخ."
    ],
    "**CORS Tester** — sends real fetch from browser, classifies failures as preflight vs simple-request, decodes them into plain English.": [
        "**CORS टेस्टर** — ब्राउज़र से असली fetch भेजता है, preflight और साधारण अनुरोध की विफलताएँ अलग करके सरल अंग्रेज़ी में बताता है।",
        "**Probador CORS** — envía fetch real desde el navegador, distingue fallos preflight y de petición simple y los explica en inglés claro.",
        "**Testeur CORS** — envoie de vraies requêtes fetch, distingue les échecs preflight et simples, et les explique en anglais clair.",
        "**CORS-Tester** — sendet echte Browser-fetch-Anfragen, unterscheidet Preflight- und einfache Fehler und erklärt sie in verständlichem Englisch.",
        "**CORS テスト** — ブラウザーから実際に fetch し、preflight と単純要求の失敗を区別して平易な英語で説明。",
        "**CORS 测试器** — 从浏览器发出真实 fetch，将失败分为预检和简单请求，并用浅显英文解释。",
        "**مختبر CORS** — يرسل fetch فعليًا من المتصفح ويميّز فشل الفحص المسبق والطلب البسيط ويشرحه بإنجليزية واضحة."
    ],
    "**DNS Lookup** — DoH client (Cloudflare/Google), parallel A/AAAA/CNAME/MX/TXT/NS/SOA/CAA/SRV lookups, zone-file-format copy.": [
        "**DNS लुकअप** — Cloudflare/Google DoH क्लाइंट, समानांतर A/AAAA/CNAME/MX/TXT/NS/SOA/CAA/SRV और zone-file फ़ॉर्मैट में कॉपी।",
        "**Consulta DNS** — cliente DoH Cloudflare/Google, consultas paralelas A/AAAA/CNAME/MX/TXT/NS/SOA/CAA/SRV y copia en formato de zona.",
        "**Recherche DNS** — client DoH Cloudflare/Google, requêtes parallèles A/AAAA/CNAME/MX/TXT/NS/SOA/CAA/SRV et copie au format de zone.",
        "**DNS-Abfrage** — DoH-Client für Cloudflare/Google, parallele A/AAAA/CNAME/MX/TXT/NS/SOA/CAA/SRV-Abfragen und Zonenformat zum Kopieren.",
        "**DNS 検索** — Cloudflare/Google の DoH、A/AAAA/CNAME/MX/TXT/NS/SOA/CAA/SRV の並列照会、ゾーンファイル形式のコピー。",
        "**DNS 查询** — Cloudflare/Google DoH 客户端，并行 A/AAAA/CNAME/MX/TXT/NS/SOA/CAA/SRV 查询，可复制区域文件格式。",
        "**استعلام DNS** — عميل DoH لـ Cloudflare/Google واستعلامات A/AAAA/CNAME/MX/TXT/NS/SOA/CAA/SRV متوازية ونسخ بصيغة ملف نطاق."
    ],
    "Diff & Compare (2 tools)": [
        "तुलना (2 टूल)",
        "Diferencias y comparación (2 herramientas)",
        "Différences et comparaison (2 outils)",
        "Differenz und Vergleich (2 Tools)",
        "差分・比較（2ツール）",
        "差异与比较（2 款工具）",
        "الفروق والمقارنة (2 أدوات)"
    ],
    "**CSV Diff** — RFC 4180 parser, key-column row matching, column-level change highlighting, copyable audit report.": [
        "**CSV डिफ़** — RFC 4180 पार्सर, कुंजी-कॉलम से पंक्ति मिलान, कॉलम-स्तरीय बदलाव और कॉपी योग्य ऑडिट रिपोर्ट।",
        "**Diff CSV** — analizador RFC 4180, coincidencia de filas por clave, cambios por columna e informe copiable.",
        "**Diff CSV** — analyseur RFC 4180, correspondance par colonne clé, changements par colonne et rapport copiable.",
        "**CSV-Diff** — RFC-4180-Parser, Zeilenabgleich über Schlüsselspalte, spaltenweise Änderungen und kopierbarer Bericht.",
        "**CSV 差分** — RFC 4180 解析、キー列で行を照合、列単位の変更強調、コピー可能な監査報告。",
        "**CSV 差异** — RFC 4180 解析器、键列行匹配、列级变化高亮和可复制审计报告。",
        "**مقارنة CSV** — محلل RFC 4180 ومطابقة الصفوف بعمود مفتاح وإبراز تغييرات الأعمدة وتقرير تدقيق قابل للنسخ."
    ],
    "**Image Diff** — pixel-by-pixel comparison with side-by-side, overlay (with opacity slider) and difference modes; tolerance slider and changed-pixel stats.": [
        "**इमेज डिफ़** — पिक्सेल तुलना, साथ-साथ, opacity स्लाइडर वाला overlay और difference मोड; tolerance और बदले पिक्सेल आँकड़े।",
        "**Diff de imágenes** — compara píxeles en paralelo, superposición con opacidad o diferencia; tolerancia y estadísticas de píxeles cambiados.",
        "**Diff d’images** — comparaison pixel par pixel, vues côte à côte, superposition réglable et différences ; tolérance et statistiques.",
        "**Bild-Diff** — Pixelvergleich nebeneinander, als Deckkraft-Overlay oder Differenz; Toleranzregler und Statistik geänderter Pixel.",
        "**画像差分** — ピクセル単位で比較。横並び、透明度付き重ね合わせ、差分モード、許容値、変更ピクセル統計。",
        "**图像差异** — 逐像素比较，支持并排、带透明度滑块的叠加和差值模式，以及容差及变化像素统计。",
        "**مقارنة الصور** — مقارنة بكسلية متجاورة أو بتراكب ذي عتامة مضبوطة أو فروق، مع تسامح وإحصاءات البكسلات المتغيرة."
    ],
    "Data Conversion (3 tools)": [
        "डेटा रूपांतरण (3 टूल)",
        "Conversión de datos (3 herramientas)",
        "Conversion de données (3 outils)",
        "Datenkonvertierung (3 Tools)",
        "データ変換（3ツール）",
        "数据转换（3 款工具）",
        "تحويل البيانات (3 أدوات)"
    ],
    "**Mock Data Generator** — schema builder with 15 field types, seedable Mulberry32 RNG for reproducible fixtures, JSON/CSV/SQL output.": [
        "**मॉक डेटा जनरेटर** — 15 फ़ील्ड प्रकारों का स्कीमा बिल्डर, दोहराने योग्य डेटा के लिए seeded Mulberry32 RNG, JSON/CSV/SQL आउटपुट।",
        "**Generador de datos simulados** — esquemas con 15 tipos, RNG Mulberry32 con semilla reproducible y salida JSON/CSV/SQL.",
        "**Générateur de données fictives** — schéma de 15 types, RNG Mulberry32 initialisable pour exemples reproductibles, sorties JSON/CSV/SQL.",
        "**Testdatengenerator** — Schema mit 15 Feldtypen, reproduzierbarer Mulberry32-RNG mit Seed und JSON/CSV/SQL-Ausgabe.",
        "**モックデータ生成** — 15種のフィールド、再現用シード付き Mulberry32 RNG、JSON/CSV/SQL 出力。",
        "**模拟数据生成器** — 15 种字段模式构建器、可设种子的 Mulberry32 RNG 以生成可复现数据，输出 JSON/CSV/SQL。",
        "**مولّد بيانات تجريبية** — منشئ مخطط بـ15 نوع حقل وMulberry32 RNG ببذرة لتكرار الأمثلة وإخراج JSON/CSV/SQL."
    ],
    "**TOML Converter** — TOML ↔ JSON ↔ YAML with a minimal in-file TOML parser (sections, scalars, arrays of scalars).": [
        "**TOML कन्वर्टर** — TOML ↔ JSON ↔ YAML, छोटे अंतर्निहित TOML पार्सर से (सेक्शन, scalar और scalar ऐरे)।",
        "**Conversor TOML** — TOML ↔ JSON ↔ YAML con analizador TOML mínimo integrado (secciones, escalares y arrays de escalares).",
        "**Convertisseur TOML** — TOML ↔ JSON ↔ YAML via un analyseur TOML minimal intégré (sections, scalaires et tableaux de scalaires).",
        "**TOML-Konverter** — TOML ↔ JSON ↔ YAML mit kleinem eingebautem TOML-Parser für Abschnitte, Skalare und Skalararrays.",
        "**TOML 変換** — 小型の内蔵 TOML パーサーで TOML ↔ JSON ↔ YAML（セクション、スカラー、スカラー配列）を変換。",
        "**TOML 转换器** — 通过文件内最小 TOML 解析器实现 TOML ↔ JSON ↔ YAML，支持节、标量和标量数组。",
        "**محوّل TOML** — ‏TOML ↔ JSON ↔ YAML بمحلل TOML بسيط مدمج يدعم الأقسام والقيم المفردة ومصفوفاتها."
    ],
    "**TOON Converter** — JSON or XML → TOON (Token-Oriented Object Notation). Tabular array detection emits CSV-like rows instead of repeating keys; live characters-saved and approximate tokens-saved badges for LLM prompt budgeting.": [
        "**TOON कन्वर्टर** — JSON/XML → TOON (Token-Oriented Object Notation)। सारणी ऐरे में बार-बार कुंजियों के बजाय CSV-जैसी पंक्तियाँ; LLM बजट के लिए वर्ण और अनुमानित टोकन बचत बैज।",
        "**Conversor TOON** — JSON o XML → TOON (Token-Oriented Object Notation). Detecta arrays tabulares y emite filas tipo CSV sin repetir claves; indicadores en vivo de caracteres y tokens aproximados ahorrados.",
        "**Convertisseur TOON** — JSON ou XML → TOON (Token-Oriented Object Notation). Détection de tableaux tabulaires, lignes CSV sans répéter les clés et indicateurs de caractères/tokens approximatifs économisés.",
        "**TOON-Konverter** — JSON/XML → TOON (Token-Oriented Object Notation). Tabellenarrays werden zu CSV-artigen Zeilen ohne Schlüsselwiederholung; Liveanzeigen für Zeichen- und geschätzte Tokeneinsparung.",
        "**TOON 変換** — JSON・XML → TOON（Token-Oriented Object Notation）。表配列を検出し、キーを繰り返さない CSV 風の行を生成。LLM 予算用に文字と推定トークンの削減量を表示。",
        "**TOON 转换器** — JSON 或 XML → TOON（Token-Oriented Object Notation）。表格数组采用 CSV 式行而非重复键，实时显示字符及估算令牌节省量以规划 LLM 提示预算。",
        "**محوّل TOON** — ‏JSON أو XML → TOON ‏(Token-Oriented Object Notation). يكتشف المصفوفات الجدولية ويخرج صفوفًا شبيهة بـCSV دون تكرار المفاتيح، مع مؤشرات توفير الأحرف والرموز المقدرة لميزانية LLM."
    ],
    "Generators (1 tool)": [
        "जनरेटर (1 टूल)",
        "Generadores (1 herramienta)",
        "Générateurs (1 outil)",
        "Generatoren (1 Tool)",
        "生成ツール（1ツール）",
        "生成器（1 款工具）",
        "المولّدات (1 أداة)"
    ],
    "**Credit Card Generator** — Luhn-valid test card numbers across 14 brands (Visa, Mastercard, American Express, Discover, JCB, Diners Club, Maestro, UnionPay, RuPay, Elo, Hipercard, Mir, Troy, InterPayment), each with a brand-correct IIN prefix, supported length, matching CVV width, future expiry and holder name. Numbers render on a card-style face and export as plain text, CSV or JSON. Brand data and the Luhn helpers moved to a shared `src/lib/credit-card.ts` that the Credit Card Validator now imports, so detection and checksum logic live in one place.": [
        "**क्रेडिट कार्ड जनरेटर** — 14 ब्रांड (Visa, Mastercard, American Express, Discover, JCB, Diners Club, Maestro, UnionPay, RuPay, Elo, Hipercard, Mir, Troy, InterPayment) के Luhn-वैध परीक्षण नंबर; सही IIN, समर्थित लंबाई, CVV चौड़ाई, भविष्य समाप्ति और धारक नाम। कार्ड-जैसा दृश्य और टेक्स्ट/CSV/JSON एक्सपोर्ट। ब्रांड डेटा और Luhn हेल्पर साझा `src/lib/credit-card.ts` में गए, जिसे Validator भी लेता है; पहचान और checksum एक जगह हैं।",
        "**Generador de tarjetas** — números de prueba Luhn válidos para 14 marcas (Visa, Mastercard, American Express, Discover, JCB, Diners Club, Maestro, UnionPay, RuPay, Elo, Hipercard, Mir, Troy, InterPayment), con IIN, longitud y CVV correctos, caducidad futura y titular. Vista de tarjeta y exportación texto/CSV/JSON. Datos y funciones Luhn pasan a `src/lib/credit-card.ts`, compartido con el validador para unificar detección y checksum.",
        "**Générateur de cartes** — numéros de test Luhn valides pour 14 marques (Visa, Mastercard, American Express, Discover, JCB, Diners Club, Maestro, UnionPay, RuPay, Elo, Hipercard, Mir, Troy, InterPayment), avec IIN, longueur, CVV, échéance future et titulaire adaptés. Vue carte et export texte/CSV/JSON. Données et fonctions Luhn sont centralisées dans `src/lib/credit-card.ts`, aussi utilisé par le validateur.",
        "**Kreditkartengenerator** — Luhn-gültige Testnummern für 14 Marken (Visa, Mastercard, American Express, Discover, JCB, Diners Club, Maestro, UnionPay, RuPay, Elo, Hipercard, Mir, Troy, InterPayment), mit passendem IIN, Länge, CVV, künftigem Ablauf und Inhaber. Kartenansicht und Text-/CSV-/JSON-Export. Markendaten und Luhn-Helfer liegen gemeinsam in `src/lib/credit-card.ts`, das auch der Validator nutzt, sodass Erkennung und Prüfsumme zentral sind.",
        "**クレジットカード生成** — 14ブランド（Visa、Mastercard、American Express、Discover、JCB、Diners Club、Maestro、UnionPay、RuPay、Elo、Hipercard、Mir、Troy、InterPayment）の Luhn 有効なテスト番号。各 IIN、長さ、CVV 桁数、将来の期限、名義を生成し、カード表示とテキスト・CSV・JSON 出力に対応。ブランド情報と Luhn 処理を `src/lib/credit-card.ts` に集約し、検証ツールとも共有します。",
        "**信用卡生成器** — 生成 14 个品牌（Visa、Mastercard、American Express、Discover、JCB、Diners Club、Maestro、UnionPay、RuPay、Elo、Hipercard、Mir、Troy、InterPayment）通过 Luhn 的测试卡号，具备品牌对应 IIN、长度、CVV 位数、未来有效期和持卡人姓名。卡片样式展示并导出文本、CSV 或 JSON。品牌数据与 Luhn 辅助逻辑移至共享 `src/lib/credit-card.ts`，验证器也使用它，统一识别和校验。",
        "**مولّد بطاقات الائتمان** — أرقام اختبار صحيحة وفق Luhn لـ14 علامة (Visa وMastercard وAmerican Express وDiscover وJCB وDiners Club وMaestro وUnionPay وRuPay وElo وHipercard وMir وTroy وInterPayment)، مع IIN وطول وCVV ملائمة وتاريخ مستقبلي واسم حامل. عرض كبطاقة وتصدير نص/CSV/JSON. نُقلت بيانات العلامات ودوال Luhn إلى `src/lib/credit-card.ts` المشترك مع المدقق لتوحيد الكشف والمجموع الاختباري."
    ],
    "Infrastructure": [
        "आधारभूत ढाँचा",
        "Infraestructura",
        "Socle technique",
        "Infrastruktur",
        "基盤",
        "基础设施",
        "البنية التحتية"
    ],
    "New **Image & Media** category — colour, icon, description, order, union type.": [
        "नई **चित्र और मीडिया** श्रेणी — रंग, आइकन, विवरण, क्रम और union type।",
        "Nueva categoría **Imagen y Medios**: color, icono, descripción, orden y tipo unión.",
        "Nouvelle catégorie **Image et médias** : couleur, icône, description, ordre et type union.",
        "Neue Kategorie **Bild und Medien** mit Farbe, Icon, Beschreibung, Reihenfolge und Union-Typ.",
        "新しい **画像・メディア** カテゴリに色、アイコン、説明、順序、ユニオン型を追加。",
        "新增 **图像与媒体** 分类，含颜色、图标、说明、顺序及联合类型。",
        "فئة **الصور والوسائط** الجديدة: لون وأيقونة ووصف وترتيب ونوع اتحادي."
    ],
    "New `/api/webhook/[sessionId]` and `/api/webhook/[sessionId]/events` routes (long-poll); shared in-memory store at `src/lib/webhook-store.ts`.": [
        "नए `/api/webhook/[sessionId]` और `/api/webhook/[sessionId]/events` long-poll रूट; साझा इन-मेमोरी स्टोर `src/lib/webhook-store.ts` में।",
        "Nuevas rutas `/api/webhook/[sessionId]` y `/api/webhook/[sessionId]/events` de consulta larga; almacén compartido en memoria en `src/lib/webhook-store.ts`.",
        "Nouvelles routes `/api/webhook/[sessionId]` et `/api/webhook/[sessionId]/events` en interrogation longue ; stockage mémoire partagé dans `src/lib/webhook-store.ts`.",
        "Neue Long-Poll-Routen `/api/webhook/[sessionId]` und `/api/webhook/[sessionId]/events`; gemeinsamer RAM-Speicher unter `src/lib/webhook-store.ts`.",
        "`/api/webhook/[sessionId]` と `/api/webhook/[sessionId]/events` のロングポーリング経路を追加し、`src/lib/webhook-store.ts` の共有メモリストアを使用。",
        "新增 `/api/webhook/[sessionId]` 和 `/api/webhook/[sessionId]/events` 长轮询路由，共享内存存储位于 `src/lib/webhook-store.ts`。",
        "مسارا `/api/webhook/[sessionId]` و`/api/webhook/[sessionId]/events` جديدان للاستقصاء الطويل، مع مخزن ذاكرة مشترك في `src/lib/webhook-store.ts`."
    ],
    "`ServerProxyNotice` extended with two new route ids (`proxy-stream`, `webhook`).": [
        "`ServerProxyNotice` में दो नए रूट ID (`proxy-stream`, `webhook`) जोड़े।",
        "`ServerProxyNotice` incorpora dos identificadores de ruta nuevos (`proxy-stream`, `webhook`).",
        "`ServerProxyNotice` étendu avec deux identifiants de route (`proxy-stream`, `webhook`).",
        "`ServerProxyNotice` um zwei neue Routenkennungen (`proxy-stream`, `webhook`) erweitert.",
        "`ServerProxyNotice` に2つのルート ID（`proxy-stream`、`webhook`）を追加。",
        "`ServerProxyNotice` 扩展了两个新路由 ID（`proxy-stream`、`webhook`）。",
        "وُسّع `ServerProxyNotice` بمعرّفي مسار جديدين (`proxy-stream` و`webhook`)."
    ],
    "All 14 tools added to `tool-url-table.ts`, `tools-registry.ts` and `seo-content.ts` — full SEO + structured data from day one.": [
        "सभी 14 टूल `tool-url-table.ts`, `tools-registry.ts` और `seo-content.ts` में दर्ज — पहले दिन से पूरा SEO और संरचित डेटा।",
        "Las 14 herramientas registradas en `tool-url-table.ts`, `tools-registry.ts` y `seo-content.ts`, con SEO y datos estructurados desde el primer día.",
        "Les 14 outils ajoutés à `tool-url-table.ts`, `tools-registry.ts` et `seo-content.ts`, avec SEO et données structurées dès le départ.",
        "Alle 14 Tools in `tool-url-table.ts`, `tools-registry.ts` und `seo-content.ts` eingetragen, mit SEO und strukturierten Daten von Beginn an.",
        "全14ツールを `tool-url-table.ts`、`tools-registry.ts`、`seo-content.ts` に登録し、初日から SEO・構造化データに対応。",
        "全部 14 款加入 `tool-url-table.ts`、`tools-registry.ts` 和 `seo-content.ts`，首日即有完整 SEO 与结构化数据。",
        "أُضيفت الأدوات الـ14 إلى `tool-url-table.ts` و`tools-registry.ts` و`seo-content.ts` مع SEO وبيانات منظمة منذ البداية."
    ],
    "Cross-tool pipelines": [
        "क्रॉस-टूल पाइपलाइन",
        "Flujos entre herramientas",
        "Pipelines entre outils",
        "Toolübergreifende Pipelines",
        "ツール間パイプライン",
        "跨工具流水线",
        "مسارات عمل بين الأدوات"
    ],
    "New typed `ToolPayload` contract (`kind`, `data`, `sourceToolId`, `label`) in `src/lib/tool-bridge.ts` — payloads route through `sessionStorage` with a 1-minute TTL so the handoff survives client navigation.": [
        "नया typed `ToolPayload` अनुबंध (`kind`, `data`, `sourceToolId`, `label`) `src/lib/tool-bridge.ts` में — payload `sessionStorage` में 1-मिनट TTL के साथ जाते हैं, जिससे क्लाइंट नेविगेशन के बाद भी हैंडऑफ़ रहता है।",
        "Nuevo contrato tipado `ToolPayload` (`kind`, `data`, `sourceToolId`, `label`) en `src/lib/tool-bridge.ts`; los datos pasan por `sessionStorage` con TTL de 1 minuto para sobrevivir a la navegación.",
        "Nouveau contrat typé `ToolPayload` (`kind`, `data`, `sourceToolId`, `label`) dans `src/lib/tool-bridge.ts` ; transit via `sessionStorage` avec TTL de 1 minute pour survivre à la navigation.",
        "Neuer typisierter Vertrag `ToolPayload` (`kind`, `data`, `sourceToolId`, `label`) in `src/lib/tool-bridge.ts`; Übergaben über `sessionStorage` mit 1 Minute TTL überstehen Clientnavigation.",
        "型付き `ToolPayload` 契約（`kind`、`data`、`sourceToolId`、`label`）を `src/lib/tool-bridge.ts` に追加。`sessionStorage` に1分の TTL で保持し、クライアント遷移後も受け渡せます。",
        "新增类型化 `ToolPayload` 契约（`kind`、`data`、`sourceToolId`、`label`），位于 `src/lib/tool-bridge.ts`；负载经 `sessionStorage` 保存 1 分钟 TTL，使传递可跨客户端导航保留。",
        "عقد `ToolPayload` مضبوط الأنواع (`kind` و`data` و`sourceToolId` و`label`) في `src/lib/tool-bridge.ts`؛ تمر البيانات عبر `sessionStorage` بمهلة 1 دقيقة لتبقى عبر تنقل العميل."
    ],
    "`SendToButton` drops into any tool's output header; the dropdown is auto-populated from the tool registry based on what the target accepts.": [
        "`SendToButton` किसी टूल के आउटपुट हेडर में जुड़ता है; ड्रॉपडाउन लक्ष्य की स्वीकृति के अनुसार रजिस्ट्री से भरता है।",
        "`SendToButton` se integra en la cabecera de salida; el desplegable usa el registro según lo que acepte cada destino.",
        "`SendToButton` s’intègre à l’en-tête de sortie ; le menu est rempli depuis le registre selon les entrées acceptées.",
        "`SendToButton` passt in jeden Ausgabekopf; das Menü wird gemäß akzeptierten Zieldaten aus dem Register befüllt.",
        "`SendToButton` を出力ヘッダーへ追加でき、対象が受け付ける種類に応じてレジストリからメニューを構成します。",
        "`SendToButton` 可放入任意工具输出标题，按目标可接受内容从注册表自动填充下拉菜单。",
        "يُضاف `SendToButton` إلى رأس الناتج، وتُملأ قائمته من السجل وفق ما يقبله الهدف."
    ],
    "`ToolBridgeBanner` reads a pending payload on the receiver's mount and auto-imports (configurable). Old payloads are cleared without applying so they never surprise the user.": [
        "`ToolBridgeBanner` प्राप्तकर्ता के mount पर pending payload पढ़कर auto-import करता है (विन्यास योग्य)। पुराने payload लागू किए बिना हटते हैं, ताकि अनपेक्षित असर न हो।",
        "`ToolBridgeBanner` lee los datos pendientes al montar el receptor y los importa automáticamente si se configura. Los antiguos se eliminan sin aplicarlos.",
        "`ToolBridgeBanner` lit les données en attente au montage et peut les importer automatiquement. Les données périmées sont effacées sans application inattendue.",
        "`ToolBridgeBanner` liest beim Empfängermontieren die Übergabe und importiert optional automatisch. Alte Daten werden ohne Anwendung entfernt.",
        "`ToolBridgeBanner` は受信側のマウント時に待機データを読み、設定に応じ自動取込します。古いデータは適用せず削除し、不意の入力変更を防ぎます。",
        "`ToolBridgeBanner` 在接收方挂载时读取待传负载并按配置自动导入；过期负载直接清除而不应用，避免意外变化。",
        "يقرأ `ToolBridgeBanner` البيانات المعلقة عند تحميل المستقبل ويستوردها تلقائيًا حسب الإعداد. تُحذف البيانات القديمة دون تطبيقها لتجنب المفاجآت."
    ],
    "5 flagship tools wired as reference: **JSON Formatter, Base64, URL Encoder, Hash Generator, JWT Decoder**. ~10 lines per tool to adopt — the other 99 tools can follow incrementally.": [
        "5 प्रमुख टूल संदर्भ के रूप में जुड़े: **JSON Formatter, Base64, URL Encoder, Hash Generator, JWT Decoder**। अपनाने में प्रति टूल ~10 पंक्तियाँ; बाकी 99 धीरे-धीरे जुड़ सकते हैं।",
        "5 herramientas de referencia: **JSON Formatter, Base64, URL Encoder, Hash Generator, JWT Decoder**. Unas ~10 líneas por herramienta; las otras 99 pueden incorporarse progresivamente.",
        "5 outils de référence connectés : **JSON Formatter, Base64, URL Encoder, Hash Generator, JWT Decoder**. Environ ~10 lignes par outil ; les 99 autres peuvent suivre progressivement.",
        "5 Referenztools angebunden: **JSON Formatter, Base64, URL Encoder, Hash Generator, JWT Decoder**. Etwa ~10 Zeilen je Tool; die übrigen 99 können schrittweise folgen.",
        "参照実装として5ツール **JSON Formatter、Base64、URL Encoder、Hash Generator、JWT Decoder** を接続。各ツール約10行で導入でき、残り99は順次対応できます。",
        "5 款示范工具已接入：**JSON Formatter、Base64、URL Encoder、Hash Generator、JWT Decoder**。每款约需 10 行，剩余 99 款可逐步采用。",
        "رُبطت 5 أدوات مرجعية: **JSON Formatter وBase64 وURL Encoder وHash Generator وJWT Decoder**. يحتاج التبني نحو 10 أسطر لكل أداة، ويمكن إضافة الـ99 الباقية تدريجيًا."
    ],
    "Shareable URLs": [
        "साझा करने योग्य URL",
        "URL compartibles",
        "URL partageables",
        "Teilbare URLs",
        "共有可能な URL",
        "可分享 URL",
        "روابط قابلة للمشاركة"
    ],
    "`src/lib/shareable-state.ts` — typed `ShareSchema<T>` + `useShareableState` hook. State serialises to `JSON → deflate-raw → base64url` and lives in the URL **fragment** (never sent to a server, even for the public site).": [
        "`src/lib/shareable-state.ts` — typed `ShareSchema<T>` और `useShareableState` hook। स्थिति `JSON → deflate-raw → base64url` में सीरियलाइज़ होकर URL **fragment** में रहती है (सार्वजनिक साइट पर भी सर्वर को नहीं जाती)।",
        "`src/lib/shareable-state.ts`: `ShareSchema<T>` tipado y hook `useShareableState`. El estado se serializa como `JSON → deflate-raw → base64url` y vive en el **fragmento** URL, sin enviarse al servidor ni en el sitio público.",
        "`src/lib/shareable-state.ts` : `ShareSchema<T>` typé et hook `useShareableState`. L’état devient `JSON → deflate-raw → base64url` dans le **fragment** URL, jamais envoyé au serveur, même sur le site public.",
        "`src/lib/shareable-state.ts`: typisiertes `ShareSchema<T>` und Hook `useShareableState`. Zustand wird als `JSON → deflate-raw → base64url` im URL-**Fragment** gespeichert, auch auf der öffentlichen Seite nie an den Server gesendet.",
        "`src/lib/shareable-state.ts` — 型付き `ShareSchema<T>` と `useShareableState` フック。状態は `JSON → deflate-raw → base64url` で URL の **フラグメント**に保存し、公開サイトでもサーバーへ送信しません。",
        "`src/lib/shareable-state.ts` 提供类型化 `ShareSchema<T>` 和 `useShareableState` Hook。状态序列化为 `JSON → deflate-raw → base64url`，保存在 URL **片段**中，即使公共网站也不发给服务器。",
        "`src/lib/shareable-state.ts` — ‏`ShareSchema<T>` مضبوط الأنواع وخطاف `useShareableState`. تُسلسل الحالة إلى `JSON → deflate-raw → base64url` وتبقى في **جزء** URL، ولا تُرسل للخادم حتى في الموقع العام."
    ],
    "`ShareButton` opens a modal that builds the link on demand (always reflects current input), shows char count, and warns when sensitive fields are present (JWT decoder uses this).": [
        "`ShareButton` ज़रूरत पर लिंक बनाने वाला modal खोलता है (हमेशा वर्तमान इनपुट), वर्ण संख्या दिखाता है और संवेदनशील फ़ील्ड पर चेतावनी देता है (JWT decoder इसका उपयोग करता है)।",
        "`ShareButton` abre un modal que genera el enlace bajo demanda con la entrada actual, muestra longitud y avisa de campos sensibles; lo usa el decodificador JWT.",
        "`ShareButton` ouvre une fenêtre générant le lien à la demande avec la saisie actuelle, indique sa longueur et avertit des champs sensibles ; utilisé par le décodeur JWT.",
        "`ShareButton` öffnet einen Dialog, erzeugt den Link bei Bedarf aus aktueller Eingabe, zeigt Zeichenanzahl und warnt vor sensiblen Feldern; genutzt vom JWT-Decoder.",
        "`ShareButton` は必要時に現在の入力でリンクを作るモーダルを開き、文字数と機密項目の警告を表示します（JWT デコーダーで使用）。",
        "`ShareButton` 打开弹窗按需生成链接，始终反映当前输入，显示字符数并警告敏感字段，JWT 解码器已采用。",
        "يفتح `ShareButton` نافذة تُنشئ الرابط عند الطلب من الإدخال الحالي وتعرض عدد الأحرف وتحذر من الحقول الحساسة؛ يستخدمها مفكك JWT."
    ],
    "Schema versioning enforced — a link with `v: 2` ignored by a tool still on `v: 1`, no silent state corruption.": [
        "स्कीमा संस्करण लागू — `v: 2` लिंक को `v: 1` वाला टूल अनदेखा करता है; चुपचाप स्थिति खराब नहीं होती।",
        "Versionado de esquemas: un enlace `v: 2` se ignora si la herramienta usa `v: 1`, evitando corrupción silenciosa.",
        "Versions imposées : un lien `v: 2` est ignoré par un outil en `v: 1`, sans corruption silencieuse de l’état.",
        "Schemaversionen erzwungen: Ein Link mit `v: 2` wird von einem Tool auf `v: 1` ignoriert, ohne stille Zustandsfehler.",
        "スキーマ版を厳密化。`v: 2` リンクは `v: 1` のツールで無視され、状態を暗黙に破損しません。",
        "强制模式版本控制：`v: 2` 链接会被仍用 `v: 1` 的工具忽略，避免静默损坏状态。",
        "فُرضت إصدارات المخطط: يُتجاهل رابط `v: 2` في أداة ما تزال على `v: 1` دون إفساد صامت للحالة."
    ],
    "Same 5 flagship tools restore state on mount via the share URL.": [
        "वही 5 प्रमुख टूल mount पर साझा URL से स्थिति लौटाते हैं।",
        "Las mismas 5 herramientas restauran el estado al montarse desde la URL compartida.",
        "Ces mêmes 5 outils restaurent leur état au montage via l’URL partagée.",
        "Dieselben 5 Referenztools stellen beim Laden den Zustand aus der geteilten URL wieder her.",
        "同じ5ツールが共有 URL からマウント時に状態を復元します。",
        "同样 5 款示范工具在挂载时通过分享 URL 恢复状态。",
        "تستعيد الأدوات المرجعية الـ5 نفسها الحالة عند التحميل من رابط المشاركة."
    ],
    "PWA polish": [
        "PWA सुधार",
        "Mejoras PWA",
        "Finitions PWA",
        "PWA-Feinschliff",
        "PWA の改善",
        "PWA 完善",
        "تحسينات PWA"
    ],
    "**Fixed**: `/manifest.webmanifest` was referenced from `src/app/layout.tsx` but didn't exist on disk. Created the file with full metadata, 7 icon entries, 4 shortcuts (JSON / JWT / API Builder / Base64).": [
        "**सुधारा**: `/manifest.webmanifest` का `src/app/layout.tsx` में संदर्भ था पर फ़ाइल नहीं थी। पूरा मेटाडेटा, 7 आइकन और 4 शॉर्टकट (JSON / JWT / API Builder / Base64) वाली फ़ाइल बनाई।",
        "**Corregido**: `/manifest.webmanifest` se referenciaba en `src/app/layout.tsx` pero no existía. Se creó con metadatos completos, 7 iconos y 4 accesos (JSON / JWT / API Builder / Base64).",
        "**Corrigé** : `/manifest.webmanifest`, référencé dans `src/app/layout.tsx`, n’existait pas. Fichier créé avec métadonnées, 7 icônes et 4 raccourcis (JSON / JWT / API Builder / Base64).",
        "**Behoben**: `/manifest.webmanifest` wurde in `src/app/layout.tsx` referenziert, fehlte aber. Datei mit Metadaten, 7 Icons und 4 Kurzbefehlen (JSON / JWT / API Builder / Base64) erstellt.",
        "**修正**: `/manifest.webmanifest` は `src/app/layout.tsx` から参照されていましたが、実ファイルがありませんでした。完全な情報、7アイコン、4ショートカット（JSON / JWT / API Builder / Base64）付きで作成。",
        "**修复**：`/manifest.webmanifest` 在 `src/app/layout.tsx` 中被引用但文件不存在，现创建完整元数据、7 个图标及 4 个快捷方式（JSON / JWT / API Builder / Base64）。",
        "**إصلاح**: كان `/manifest.webmanifest` مذكورًا في `src/app/layout.tsx` لكنه غير موجود. أُنشئ ببيانات كاملة و7 أيقونات و4 اختصارات (JSON / JWT / API Builder / Base64)."
    ],
    "`PwaInstallButton` surfaces the deferred `beforeinstallprompt` event when the browser fires it and auto-hides in `display-mode: standalone`. Added to the footer.": [
        "`PwaInstallButton` ब्राउज़र का deferred `beforeinstallprompt` इवेंट दिखाता है और `display-mode: standalone` में अपने आप छिपता है। फ़ुटर में जोड़ा।",
        "`PwaInstallButton` muestra el evento diferido `beforeinstallprompt` cuando lo emite el navegador y se oculta en `display-mode: standalone`. Añadido al pie.",
        "`PwaInstallButton` affiche l’événement différé `beforeinstallprompt` quand le navigateur l’émet et se masque en `display-mode: standalone`. Ajouté au pied de page.",
        "`PwaInstallButton` zeigt das zurückgestellte Browserereignis `beforeinstallprompt` und blendet sich bei `display-mode: standalone` aus. Im Footer ergänzt.",
        "`PwaInstallButton` はブラウザーの保留中 `beforeinstallprompt` イベントを表示し、`display-mode: standalone` では自動的に隠れます。フッターに追加。",
        "`PwaInstallButton` 在浏览器触发时显示延迟的 `beforeinstallprompt` 事件，并在 `display-mode: standalone` 自动隐藏，已加入页脚。",
        "يعرض `PwaInstallButton` حدث `beforeinstallprompt` المؤجل عند إصداره من المتصفح ويختفي في `display-mode: standalone`. أُضيف للتذييل."
    ],
    "Service worker already existed (`public/sw.js`, network-first navigation + runtime cache). No changes needed.": [
        "सर्विस वर्कर पहले से था (`public/sw.js`, network-first नेविगेशन और runtime cache)। बदलाव आवश्यक नहीं था।",
        "El service worker ya existía (`public/sw.js`, navegación network-first y caché de ejecución). No necesitó cambios.",
        "Le service worker existait déjà (`public/sw.js`, navigation réseau d’abord et cache d’exécution). Aucun changement nécessaire.",
        "Service Worker war bereits vorhanden (`public/sw.js`, netzwerkorientierte Navigation und Laufzeitcache). Keine Änderungen nötig.",
        "サービスワーカーは既存（`public/sw.js`、ネットワーク優先遷移と実行時キャッシュ）のため変更不要でした。",
        "已有 service worker（`public/sw.js`，网络优先导航与运行时缓存），无需修改。",
        "كان عامل الخدمة موجودًا (`public/sw.js` مع تنقل يفضّل الشبكة وذاكرة تشغيل مؤقتة)، فلم يحتج تعديلًا."
    ],
    "Browser extension (Manifest V3)": [
        "ब्राउज़र एक्सटेंशन (Manifest V3)",
        "Extensión de navegador (Manifest V3)",
        "Extension de navigateur (Manifest V3)",
        "Browsererweiterung (Manifest V3)",
        "ブラウザー拡張（Manifest V3）",
        "浏览器扩展（Manifest V3）",
        "إضافة المتصفح (Manifest V3)"
    ],
    "New `extension/` directory — plain JS, no bundler, so users can audit every line before installing.": [
        "नई `extension/` डायरेक्टरी — सादा JS, कोई bundler नहीं, ताकि इंस्टॉल से पहले हर पंक्ति जाँची जा सके।",
        "Nuevo directorio `extension/` con JS simple y sin empaquetador para auditar cada línea antes de instalar.",
        "Nouveau dossier `extension/` en JS simple, sans bundler, pour examiner chaque ligne avant installation.",
        "Neues Verzeichnis `extension/` mit reinem JS ohne Bundler, jede Zeile vor Installation prüfbar.",
        "`extension/` を追加。バンドラーなしのプレーン JS で、インストール前に全行を確認できます。",
        "新增 `extension/` 目录，使用纯 JS、无打包器，用户可在安装前审查每一行。",
        "دليل `extension/` جديد بـJS بسيط دون حازم لتمكين مراجعة كل سطر قبل التثبيت."
    ],
    "Right-click any selected text → submenu with: Format JSON · Decode JWT · Base64 encode/decode · URL encode/decode · Generate hashes · Test with regex.": [
        "चुने टेक्स्ट पर राइट-क्लिक → JSON फ़ॉर्मैट, JWT डिकोड, Base64 encode/decode, URL encode/decode, hash बनाना और regex परीक्षण का सबमेनू।",
        "Clic derecho sobre texto → submenú para formatear JSON, decodificar JWT, Base64, URL, hashes y regex.",
        "Clic droit sur une sélection → formatage JSON, décodage JWT, Base64, URL, hachages et test regex.",
        "Rechtsklick auf Text → Untermenü für JSON-Formatierung, JWT-Dekodierung, Base64/URL-Kodierung, Hashes und Regex.",
        "選択テキストを右クリックし、JSON 整形、JWT デコード、Base64・URL の符号化/復号、ハッシュ生成、正規表現テストを実行。",
        "右击选中文本，子菜单提供 JSON 格式化、JWT 解码、Base64 编解码、URL 编解码、哈希生成及正则测试。",
        "النقر يمينًا على النص يفتح قائمة لتنسيق JSON وفك JWT وترميز/فك Base64 وURL وتوليد البصمات واختبار regex."
    ],
    "Reuses the same share-URL format as the main app — handoff is a single round trip with no extra protocol.": [
        "मुख्य ऐप का वही share-URL फ़ॉर्मैट — बिना नए प्रोटोकॉल एक ही राउंड ट्रिप में हैंडऑफ़।",
        "Reutiliza el formato de URL compartida de la app, con una sola transferencia y sin protocolo adicional.",
        "Réutilise l’URL partagée de l’application : un seul aller-retour, sans protocole supplémentaire.",
        "Nutzt dasselbe Share-URL-Format wie die App, mit einer einzigen Übergabe ohne Zusatzprotokoll.",
        "本体と同じ共有 URL 形式を使い、追加プロトコルなしの1往復で受け渡します。",
        "复用主应用分享 URL 格式，一次往返完成传递，无需额外协议。",
        "تعيد استخدام صيغة رابط المشاركة نفسها، بانتقال واحد دون بروتوكول إضافي."
    ],
    "Toolbar popup with quick-launch shortcuts and a self-hosted origin override (for users running mydevtools privately).": [
        "टूलबार popup में तुरंत खोलने के शॉर्टकट और निजी होस्टिंग के लिए origin बदलने का विकल्प।",
        "Ventana de barra con accesos rápidos y origen configurable para instalaciones privadas.",
        "Popup de barre avec raccourcis et remplacement de l’origine pour hébergement privé.",
        "Toolbar-Popup mit Schnellstarts und anpassbarem Ursprung für private Installationen.",
        "ツールバーのポップアップに起動ショートカットと、非公開ホスト向けオリジン変更を用意。",
        "工具栏弹窗提供快捷启动和自托管来源覆盖，适合私有部署。",
        "نافذة شريط أدوات باختصارات تشغيل وتخصيص الأصل للاستضافة الخاصة."
    ],
    "Zero telemetry, zero `host_permissions` — the extension only sees what you select.": [
        "शून्य telemetry और शून्य `host_permissions` — एक्सटेंशन केवल चुना हुआ टेक्स्ट देखता है।",
        "Sin telemetría ni `host_permissions`; la extensión solo ve lo seleccionado.",
        "Aucune télémétrie, aucun `host_permissions` ; l’extension ne voit que la sélection.",
        "Keine Telemetrie, keine `host_permissions`; die Erweiterung sieht nur die Auswahl.",
        "テレメトリなし、`host_permissions` なし。拡張機能が見るのは選択した内容だけです。",
        "零遥测、零 `host_permissions`，扩展仅访问用户选中的内容。",
        "لا تتبع ولا `host_permissions`؛ ترى الإضافة ما تحدده فقط."
    ],
    "Honest AI, no keys required": [
        "ईमानदार AI, बिना कुंजी",
        "IA transparente, sin claves",
        "IA honnête, sans clé",
        "Ehrliche KI ohne Schlüssel",
        "誠実な AI、キー不要",
        "坦诚的 AI，无需密钥",
        "ذكاء اصطناعي واضح دون مفاتيح"
    ],
    "**Semantic Search Playground** replaces the old keyword-matching `rag-search` demo with real sentence embeddings (all-MiniLM-L6-v2, WebGPU/WASM via `@huggingface/transformers`) — genuine meaning-based search, computed entirely in your browser. Model loads only on explicit click, never automatically.": [
        "**सिमेंटिक सर्च प्रयोगशाला** पुराने keyword-आधारित `rag-search` डेमो को वास्तविक sentence embeddings (all-MiniLM-L6-v2, `@huggingface/transformers` से WebGPU/WASM) से बदलती है — अर्थ-आधारित खोज पूरी तरह ब्राउज़र में। मॉडल केवल स्पष्ट क्लिक पर लोड होता है, अपने आप नहीं।",
        "**Laboratorio de búsqueda semántica** sustituye el demo `rag-search` de palabras clave por embeddings reales (all-MiniLM-L6-v2, WebGPU/WASM mediante `@huggingface/transformers`), con búsqueda por significado en el navegador. El modelo solo carga al hacer clic explícito.",
        "**Atelier de recherche sémantique** remplace l’ancienne démo `rag-search` par des plongements réels (all-MiniLM-L6-v2, WebGPU/WASM via `@huggingface/transformers`). Recherche par sens dans le navigateur, avec chargement uniquement sur clic explicite.",
        "**Semantischer Suchspielplatz** ersetzt die alte Stichwortdemo `rag-search` durch echte Satzeinbettungen (all-MiniLM-L6-v2, WebGPU/WASM via `@huggingface/transformers`), lokal im Browser. Modell lädt ausschließlich nach ausdrücklichem Klick.",
        "**意味検索プレイグラウンド** は旧 `rag-search` のキーワードデモを実際の文章埋め込み（all-MiniLM-L6-v2、`@huggingface/transformers` の WebGPU/WASM）に置き換え、意味に基づく検索をブラウザー内で実行します。モデルは明示クリック時のみ読み込みます。",
        "**语义搜索实验场** 将旧关键词 `rag-search` 演示替换为真实句子嵌入（all-MiniLM-L6-v2，通过 `@huggingface/transformers` 使用 WebGPU/WASM），完全在浏览器执行语义搜索。模型仅显式点击后加载。",
        "**مختبر البحث الدلالي** يستبدل عرض `rag-search` القائم على الكلمات بتضمينات جمل فعلية (all-MiniLM-L6-v2 وWebGPU/WASM عبر `@huggingface/transformers`) وبحث بالمعنى داخل المتصفح. لا يُحمّل النموذج إلا بالنقر الصريح."
    ],
    "**LLM Token Counter** — exact BPE token counts for GPT models via `gpt-tokenizer`, labeled estimates for Claude/Llama, plus a context-budget bar.": [
        "**LLM टोकन काउंटर** — `gpt-tokenizer` से GPT की सटीक BPE गणना, Claude/Llama के स्पष्ट अनुमान और कॉन्टेक्स्ट बजट बार।",
        "**Contador de tokens LLM** — BPE exacto para GPT mediante `gpt-tokenizer`, estimaciones indicadas para Claude/Llama y barra de presupuesto.",
        "**Compteur de tokens LLM** — comptage BPE exact pour GPT via `gpt-tokenizer`, estimations indiquées pour Claude/Llama et barre de contexte.",
        "**LLM-Tokenzähler** — exakte GPT-BPE-Zählung mit `gpt-tokenizer`, gekennzeichnete Claude-/Llama-Schätzungen und Kontextbudgetbalken.",
        "**LLM トークン計数** — `gpt-tokenizer` による GPT の正確な BPE 数、Claude/Llama の明示的な概算、コンテキスト予算バー。",
        "**LLM 令牌计数器** — 通过 `gpt-tokenizer` 精确统计 GPT BPE，为 Claude/Llama 显示标注的估算，并提供上下文预算条。",
        "**عدّاد رموز LLM** — عدّ BPE دقيق لـGPT عبر `gpt-tokenizer` وتقديرات موضّحة لـClaude/Llama وشريط ميزانية السياق."
    ],
    "**Fine-Tuning Dataset Validator** — validates JSONL datasets against OpenAI or Anthropic message schemas, line by line, entirely client-side.": [
        "**फ़ाइन-ट्यूनिंग डेटा सत्यापक** — OpenAI/Anthropic संदेश स्कीमा के विरुद्ध JSONL को पंक्ति-दर-पंक्ति पूरी तरह क्लाइंट पर जाँचता है।",
        "**Validador de datasets de ajuste fino** — valida JSONL línea a línea contra esquemas OpenAI/Anthropic, totalmente en cliente.",
        "**Validateur de données d’ajustement fin** — vérifie JSONL ligne par ligne selon les schémas OpenAI/Anthropic, côté client.",
        "**Fine-Tuning-Datensatzprüfer** — prüft JSONL zeilenweise anhand von OpenAI-/Anthropic-Nachrichtenschemata vollständig clientseitig.",
        "**微調整データ検証** — OpenAI・Anthropic メッセージ形式に対し JSONL を行単位でクライアント側検証。",
        "**微调数据集验证器** — 完全在客户端逐行针对 OpenAI 或 Anthropic 消息模式验证 JSONL。",
        "**مدقق بيانات الضبط الدقيق** — يتحقق من JSONL سطرًا بسطر مقابل مخططات رسائل OpenAI أو Anthropic على العميل بالكامل."
    ],
    "**Agent Card / MCP Manifest Generator** — builds a valid A2A `agent-card.json` or MCP server config with live validation, sendable straight into the existing A2A/MCP inspectors.": [
        "**एजेंट कार्ड / MCP मेनिफ़ेस्ट जनरेटर** — लाइव सत्यापन से वैध A2A `agent-card.json` या MCP सर्वर कॉन्फ़िग बनाता है, जिसे सीधे मौजूदा A2A/MCP निरीक्षकों में भेजा जा सकता है।",
        "**Generador de tarjeta de agente/MCP** — crea un `agent-card.json` A2A válido o configuración MCP con validación en vivo y envío directo a los inspectores A2A/MCP existentes.",
        "**Générateur de carte d’agent/MCP** — crée un `agent-card.json` A2A valide ou une configuration MCP, avec validation en direct et transfert aux inspecteurs A2A/MCP existants.",
        "**Agentenkarten-/MCP-Generator** — erstellt gültige A2A-`agent-card.json` oder MCP-Konfigurationen mit Liveprüfung und direkter Weitergabe an bestehende A2A-/MCP-Inspektoren.",
        "**エージェントカード・MCP 生成** — ライブ検証付きの有効な A2A `agent-card.json` や MCP サーバー設定を作成し、既存の A2A/MCP 検査ツールへ直接送れます。",
        "**智能体卡片 / MCP 清单生成器** — 实时验证生成有效 A2A `agent-card.json` 或 MCP 配置，可直接送至现有 A2A/MCP 检查器。",
        "**مولّد بطاقة الوكيل وبيان MCP** — يبني `agent-card.json` صالحًا لـA2A أو إعداد خادم MCP بتحقق مباشر وإرسال للفاحصين الحاليين A2A/MCP."
    ],
    "Deleted `code-explainer` and `text-summarizer` — both were regex/heuristic demos mislabeled as AI, unreachable from navigation since they were written.": [
        "`code-explainer` और `text-summarizer` हटाए — regex/heuristic डेमो को गलत AI नाम मिला था और बनने से ही नेविगेशन से नहीं खुलते थे।",
        "Eliminados `code-explainer` y `text-summarizer`: demos de regex/heurísticas mal etiquetados como IA e inaccesibles desde navegación desde su creación.",
        "Suppression de `code-explainer` et `text-summarizer`, démos regex/heuristiques présentées à tort comme IA et jamais accessibles par navigation.",
        "`code-explainer` und `text-summarizer` entfernt: fälschlich als KI bezeichnete Regex-/Heuristikdemos, seit Erstellung nicht über Navigation erreichbar.",
        "`code-explainer` と `text-summarizer` を削除。AI と誤表示した正規表現・ヒューリスティックのデモで、作成以来ナビゲーションから到達できませんでした。",
        "删除 `code-explainer` 和 `text-summarizer`，两者均为误标 AI 的正则/启发式演示，自创建以来就无法从导航访问。",
        "حُذف `code-explainer` و`text-summarizer`؛ كانا عرضين بتعابير نمطية وتقديرات سُمّيا AI خطأ، وغير قابلين للوصول من التنقل منذ إنشائهما."
    ],
    "Pipeline adoption + a live bug fix": [
        "पाइपलाइन का विस्तार और वास्तविक बग सुधार",
        "Adopción de flujos y corrección real",
        "Adoption des pipelines et correction concrète",
        "Pipelineausbau und echte Fehlerkorrektur",
        "パイプライン導入と実バグ修正",
        "流水线接入与实际缺陷修复",
        "توسيع مسارات العمل وإصلاح فعلي"
    ],
    "17 of 24 declared `BRIDGE_TARGETS` were silently dropping payloads sent via \"Send to\" — every one is now wired or the row was removed. Formatters, validators, converters, and diff tools all participate now (~30 tools total, up from the original 5).": [
        "घोषित 24 `BRIDGE_TARGETS` में 17 “Send to” payload चुपचाप छोड़ रहे थे — सभी जोड़े या हटाए। फ़ॉर्मैटर, सत्यापक, कन्वर्टर और तुलना अब शामिल (~30 टूल, पहले 5)।",
        "17 de 24 `BRIDGE_TARGETS` descartaban datos de «Send to» sin avisar; se conectaron o eliminaron. Participan formateadores, validadores, conversores y comparación (~30 herramientas frente a 5).",
        "17 des 24 `BRIDGE_TARGETS` perdaient silencieusement les données « Send to » ; ils sont connectés ou retirés. Formateurs, validateurs, convertisseurs et comparateurs participent (~30 outils contre 5).",
        "17 von 24 `BRIDGE_TARGETS` verwarfen „Send to“-Daten still; alle wurden angebunden oder entfernt. Formatierer, Prüfer, Konverter und Vergleicher sind dabei (~30 Tools statt 5).",
        "宣言済み24件の `BRIDGE_TARGETS` 中17件が「Send to」データを黙って破棄していたため、接続または削除。整形・検証・変換・比較が参加し、5から約30ツールになりました。",
        "24 个 `BRIDGE_TARGETS` 中 17 个曾静默丢弃“Send to”负载，现全部接入或移除。格式化、验证、转换、差异工具均参与，总数由 5 增至约 30。",
        "كانت 17 من أصل 24 `BRIDGE_TARGETS` تُسقط بيانات «Send to» بصمت؛ رُبطت أو أُزيلت جميعها. تشارك أدوات التنسيق والتحقق والتحويل والمقارنة الآن (~30 بدل 5)."
    ],
    "TOON Converter gained a real decoder (TOON → JSON/XML, not just the reverse), a direction toggle, and swapped its character-based \"savings\" claim for actual token counts.": [
        "TOON कन्वर्टर में वास्तविक TOON → JSON/XML डिकोडर और दिशा स्विच आया; वर्ण-आधारित “बचत” की जगह वास्तविक टोकन गणना।",
        "TOON incorpora decodificación real a JSON/XML, selector de dirección y recuentos reales de tokens en lugar de ahorro por caracteres.",
        "TOON gagne un vrai décodeur vers JSON/XML, un sélecteur de sens et des comptages de tokens remplaçant l’estimation par caractères.",
        "TOON-Konverter erhält echten Decoder zu JSON/XML, Richtungswechsel und tatsächliche Tokenzählung statt zeichenbasierter Einsparung.",
        "TOON → JSON/XML の実際のデコーダーと方向切替を追加し、文字数ベースの「削減」を実トークン計数へ置き換えました。",
        "TOON 转换器新增真实 TOON → JSON/XML 解码和方向切换，用实际令牌数替代基于字符的“节省”声明。",
        "أُضيف لمحوّل TOON فك فعلي إلى JSON/XML وتبديل اتجاه، واستُبدل ادعاء التوفير بالأحرف بعدّ الرموز الفعلي."
    ],
    "A new `scripts/check-parity.js` guard runs on every build, catching registry/SEO/orphan-tool drift and unwired bridge targets before they ship again.": [
        "हर बिल्ड पर नया `scripts/check-parity.js` गार्ड रजिस्ट्री/SEO/अनाथ टूल असंगति और न जुड़े bridge लक्ष्य रिलीज़ से पहले पकड़ता है।",
        "El guardián `scripts/check-parity.js` se ejecuta en cada build y detecta desajustes registro/SEO, herramientas huérfanas y destinos sin conectar antes de publicar.",
        "Le garde `scripts/check-parity.js` tourne à chaque build pour détecter dérives registre/SEO, outils orphelins et destinations non connectées avant livraison.",
        "Neue Prüfung `scripts/check-parity.js` läuft bei jedem Build und erkennt Register-/SEO-Abweichungen, verwaiste Tools und unverbundene Ziele vor Veröffentlichung.",
        "各ビルドで `scripts/check-parity.js` を実行し、登録・SEO・孤立ツールのずれと未接続の受渡先をリリース前に検出。",
        "新增 `scripts/check-parity.js` 在每次构建运行，发布前发现注册表/SEO/孤立工具偏差及未接入的传递目标。",
        "يعمل الحارس `scripts/check-parity.js` في كل بناء لكشف اختلاف السجل وSEO والأدوات اليتيمة وأهداف النقل غير المربوطة قبل الإصدار."
    ],
    "Cross-cutting fixes": [
        "सभी क्षेत्रों के सुधार",
        "Correcciones transversales",
        "Corrections transversales",
        "Übergreifende Korrekturen",
        "全体的な修正",
        "跨领域修复",
        "إصلاحات شاملة"
    ],
    "Every tool page now shows a **Related tools** section and renders **FAQ** content inline (previously JSON-LD only) — both computed from existing registry/SEO data, zero per-page changes.": [
        "हर टूल पेज पर अब **संबंधित टूल** और **FAQ** इनलाइन दिखते हैं (पहले केवल JSON-LD), मौजूदा रजिस्ट्री/SEO से स्वतः; हर पेज में बदलाव नहीं चाहिए।",
        "Cada página muestra **Herramientas relacionadas** y **FAQ** en línea (antes solo JSON-LD), calculados desde registro/SEO sin cambios individuales.",
        "Chaque page affiche **Outils associés** et **FAQ** (auparavant uniquement JSON-LD), calculés depuis le registre/SEO sans modification par page.",
        "Jede Toolseite zeigt **Verwandte Tools** und **FAQ** inline statt nur als JSON-LD, aus bestehenden Register-/SEO-Daten ohne Einzeländerungen.",
        "各ツールに **関連ツール** と **FAQ** を表示（以前は JSON-LD のみ）。既存の登録・SEO 情報から自動構成し、個別変更は不要です。",
        "每个工具页现内联显示 **相关工具** 和 **FAQ**（此前仅 JSON-LD），均由现有注册/SEO 数据计算，无需逐页改动。",
        "تعرض كل صفحة **أدوات ذات صلة** و**FAQ** ضمنها، بعد أن كانت JSON-LD فقط؛ تُحسب من بيانات السجل وSEO دون تعديلات لكل صفحة."
    ],
    "Deleted ~2,500 lines of inert `generateMetadata` exports left over in client components from before the SEO layout pattern existed.": [
        "SEO layout से पहले के क्लाइंट घटकों में बची `generateMetadata` की ~2,500 निष्क्रिय पंक्तियाँ हटाईं।",
        "Eliminadas ~2,500 líneas inertes de exportaciones `generateMetadata` en componentes cliente anteriores al patrón de layout SEO.",
        "Suppression de ~2,500 lignes inertes d’exports `generateMetadata` dans les composants clients antérieurs au layout SEO.",
        "Etwa 2,500 inaktive Zeilen von `generateMetadata`-Exporten aus Clientkomponenten vor dem SEO-Layoutmuster entfernt.",
        "SEO レイアウト導入前のクライアント部品に残っていた `generateMetadata` の未使用コード約2,500行を削除。",
        "删除 SEO 布局模式出现前遗留在客户端组件中的约 2,500 行无效 `generateMetadata` 导出。",
        "حُذفت نحو 2,500 سطر خامل من صادرات `generateMetadata` في مكونات العميل السابقة لنمط تخطيط SEO."
    ],
    "34 pages moved off raw `navigator.clipboard` onto the shared helper with its `execCommand` fallback — copy no longer silently fails in non-secure contexts.": [
        "34 पेज सीधे `navigator.clipboard` से `execCommand` fallback वाले साझा हेल्पर पर आए — असुरक्षित context में कॉपी अब चुपचाप नहीं विफल होती।",
        "34 páginas pasan de `navigator.clipboard` al helper con respaldo `execCommand`; copiar ya no falla silenciosamente en contextos no seguros.",
        "34 pages passent de `navigator.clipboard` au helper partagé avec repli `execCommand` ; la copie n’échoue plus silencieusement hors contexte sécurisé.",
        "34 Seiten nutzen statt `navigator.clipboard` den gemeinsamen Helfer mit `execCommand`-Fallback; Kopieren scheitert in unsicheren Kontexten nicht mehr still.",
        "34ページの直接 `navigator.clipboard` 呼び出しを `execCommand` 代替付き共通処理へ移し、安全でないコンテキストでの無言のコピー失敗を解消。",
        "34 个页面从直接 `navigator.clipboard` 改为带 `execCommand` 回退的共享助手，复制不再于非安全上下文静默失败。",
        "انتقلت 34 صفحة من `navigator.clipboard` إلى المساعد المشترك ببديل `execCommand`؛ فلا يفشل النسخ بصمت في السياقات غير الآمنة."
    ],
    "95 icon-only buttons across 31 pages gained `aria-label`s.": [
        "31 पेज के 95 केवल-आइकन बटनों को `aria-label` मिले।",
        "95 botones de solo icono en 31 páginas recibieron `aria-label`.",
        "95 boutons à icône seule sur 31 pages ont reçu des `aria-label`.",
        "95 reine Iconbuttons auf 31 Seiten erhielten `aria-label`.",
        "31ページのアイコンのみの95ボタンに `aria-label` を追加。",
        "为 31 个页面的 95 个纯图标按钮添加 `aria-label`。",
        "حصل 95 زرًا بأيقونة فقط في 31 صفحة على `aria-label`."
    ],
    "\"100% Client-Side\" tagline retired in favor of \"Client-side by default\" — accurate for the 8 tools that do hit a server route (already disclosed per-tool, just not reflected site-wide).": [
        "“100% Client-Side” की जगह “Client-side by default” — सर्वर रूट वाले 8 टूलों के लिए सही दावा, जिनकी पेज पर सूचना थी पर पूरे साइट पर नहीं।",
        "«100% Client-Side» pasa a «Client-side by default», preciso para las 8 herramientas con rutas servidor, ya avisadas por herramienta pero no globalmente.",
        "«100% Client-Side» devient «Client-side by default», exact pour les 8 outils utilisant un serveur, déjà signalés localement mais pas sur tout le site.",
        "„100% Client-Side“ wurde zu „Client-side by default“, passend zu 8 Tools mit Serverroute, bisher nur je Tool offengelegt.",
        "「100% Client-Side」を「Client-side by default」へ変更。サーバー経路を使う8ツールに合う表現で、個別通知だけだった説明をサイト全体へ反映。",
        "将“100% Client-Side”改为“Client-side by default”，准确反映 8 款访问服务器路由的工具；这些此前仅逐工具披露，未全站体现。",
        "استُبدل «100% Client-Side» بـ«Client-side by default» ليعكس الأدوات الـ8 التي تستخدم مسار خادم، والمعلنة سابقًا لكل أداة لا للموقع كله."
    ],
    "V1.3.1 — antd v6 fixes, CORS auto-retry, Rich Text Editor UX": [
        "V1.3.1 — antd v6 सुधार, CORS auto-retry और रिच टेक्स्ट अनुभव",
        "V1.3.1 — correcciones antd v6, reintento CORS y editor enriquecido",
        "V1.3.1 — correctifs antd v6, nouvel essai CORS et ergonomie du texte enrichi",
        "V1.3.1 — antd-v6-Korrekturen, CORS-Wiederholung und Rich-Text-UX",
        "V1.3.1 — antd v6 修正、CORS 自動再試行、リッチテキスト操作",
        "V1.3.1 — antd v6 修复、CORS 自动重试及富文本体验",
        "V1.3.1 — إصلاحات antd v6 وإعادة CORS تلقائيًا وتحسين المحرر المنسق"
    ],
    "Sweep of antd v6 deprecation warnings, transparent CORS auto-fallback for SOAP Client and WSDL Parser, WSDL request headers support, Rich Text Editor formatting reliability and notepad UX, and a pkcs12 hydration fix.": [
        "antd v6 चेतावनियों की सफ़ाई, SOAP Client/WSDL Parser के लिए पारदर्शी CORS fallback, WSDL अनुरोध हेडर, रिच टेक्स्ट फ़ॉर्मैट/नोटपैड सुधार और pkcs12 hydration सुधार।",
        "Limpieza de advertencias antd v6, respaldo CORS transparente para SOAP/WSDL, cabeceras WSDL, formato y bloc del editor enriquecido y corrección de hidratación pkcs12.",
        "Nettoyage des avertissements antd v6, repli CORS SOAP/WSDL, en-têtes WSDL, fiabilité du formatage et bloc-notes enrichi, correction d’hydratation pkcs12.",
        "antd-v6-Warnungen bereinigt, transparenter CORS-Fallback für SOAP/WSDL, WSDL-Header, zuverlässigere Rich-Text-Formatierung und Notizoberfläche sowie pkcs12-Hydrationsfix.",
        "antd v6 の警告解消、SOAP/WSDL の透過的 CORS 代替、WSDL ヘッダー、リッチテキスト整形とメモ帳操作、pkcs12 ハイドレーションを修正。",
        "集中清理 antd v6 警告，为 SOAP Client 和 WSDL Parser 添加透明 CORS 回退，支持 WSDL 请求头，改善富文本格式化和记事本体验，并修复 pkcs12 水合。",
        "تنظيف تحذيرات antd v6 وبديل CORS شفاف لـSOAP وWSDL وترويسات WSDL وتحسين موثوقية التنسيق والمفكرة وإصلاح إماهة pkcs12."
    ],
    "SOAP Client — CORS auto-retry": [
        "SOAP क्लाइंट — CORS auto-retry",
        "Cliente SOAP: reintento CORS automático",
        "Client SOAP — nouvelle tentative CORS automatique",
        "SOAP-Client — automatische CORS-Wiederholung",
        "SOAP クライアント — CORS 自動再試行",
        "SOAP 客户端 — CORS 自动重试",
        "عميل SOAP — إعادة محاولة CORS تلقائيًا"
    ],
    "Direct browser fetches that fail with a network/CORS error now **automatically retry through the server proxy** — no need to toggle 'Force server proxy' manually.": [
        "नेटवर्क/CORS त्रुटि वाले ब्राउज़र fetch अब **सर्वर प्रॉक्सी से अपने आप फिर कोशिश** करते हैं — ‘Force server proxy’ हाथ से बदलना नहीं पड़ता।",
        "Los fetch fallidos por red/CORS **reintentan automáticamente mediante el proxy**, sin activar «Force server proxy» manualmente.",
        "Les fetch échouant pour réseau/CORS **réessaient automatiquement via le proxy serveur**, sans activer manuellement « Force server proxy ».",
        "Browser-fetch mit Netzwerk-/CORS-Fehler **wiederholen automatisch über den Serverproxy**, ohne „Force server proxy“ manuell einzuschalten.",
        "ネットワーク・CORS で失敗した fetch は **サーバープロキシで自動再試行**し、「Force server proxy」の手動切替が不要です。",
        "浏览器 fetch 因网络/CORS 失败时现 **通过服务器代理自动重试**，无需手动切换“Force server proxy”。",
        "طلبات fetch الفاشلة بسبب الشبكة/CORS **تُعاد تلقائيًا عبر وكيل الخادم** دون تبديل «Force server proxy» يدويًا."
    ],
    "Fixed `Space direction=\"vertical\"` → `orientation=\"vertical\"` antd v6 deprecation in the SSL tab.": [
        "SSL टैब में पुराने antd v6 `Space direction=\"vertical\"` → `orientation=\"vertical\"` को सुधारा।",
        "Corregida la obsolescencia antd v6 `Space direction=\"vertical\"` → `orientation=\"vertical\"` en SSL.",
        "Correction antd v6 `Space direction=\"vertical\"` → `orientation=\"vertical\"` dans l’onglet SSL.",
        "Veraltetes antd-v6-Muster `Space direction=\"vertical\"` → `orientation=\"vertical\"` im SSL-Tab behoben.",
        "SSL タブの antd v6 非推奨指定を `Space direction=\"vertical\"` → `orientation=\"vertical\"` に修正。",
        "SSL 标签页中将弃用的 antd v6 `Space direction=\"vertical\"` 改为 `orientation=\"vertical\"`。",
        "أُصلح نمط antd v6 المهجور `Space direction=\"vertical\"` → `orientation=\"vertical\"` في تبويب SSL."
    ],
    "WSDL Parser — request headers & merged XSD": [
        "WSDL पार्सर — अनुरोध हेडर और संयुक्त XSD",
        "Analizador WSDL: cabeceras y XSD combinado",
        "Analyseur WSDL — en-têtes et XSD fusionné",
        "WSDL-Parser — Anfrageheader und zusammengeführtes XSD",
        "WSDL 解析 — 要求ヘッダーと XSD 結合",
        "WSDL 解析器 — 请求标头与合并 XSD",
        "محلل WSDL — ترويسات الطلب وXSD المدمج"
    ],
    "New collapsible **Request Headers** section on the WSDL input panel — configure headers in form or JSON mode, applied to every WSDL and XSD fetch.": [
        "WSDL इनपुट में नया collapsible **Request Headers** — फ़ॉर्म/JSON से हेडर सेट करें, हर WSDL और XSD fetch में लगते हैं।",
        "Nueva sección plegable **Request Headers** en WSDL: configura cabeceras en formulario o JSON para cada descarga WSDL/XSD.",
        "Nouvelle section repliable **Request Headers** : configurez en formulaire ou JSON les en-têtes appliqués à chaque récupération WSDL/XSD.",
        "Neuer einklappbarer Bereich **Request Headers**: Header per Formular oder JSON für jeden WSDL-/XSD-Abruf festlegen.",
        "WSDL 入力に折り畳み式 **Request Headers** を追加。フォームか JSON で設定し、すべての WSDL・XSD 取得に適用します。",
        "WSDL 输入面板新增可折叠 **Request Headers**，可用表单或 JSON 配置，并应用于每次 WSDL/XSD 获取。",
        "قسم **Request Headers** قابل للطي في مدخل WSDL؛ تُضبط الترويسات بنموذج أو JSON وتُطبق على كل جلب WSDL وXSD."
    ],
    "WSDL and XSD fetches now **auto-fallback through the server proxy** on CORS failure (same pattern as SOAP Client).": [
        "WSDL/XSD fetch अब CORS विफलता पर SOAP जैसा **सर्वर प्रॉक्सी fallback** लेते हैं।",
        "WSDL/XSD **recurren automáticamente al proxy servidor** ante fallo CORS, igual que SOAP.",
        "Les récupérations WSDL/XSD **basculent automatiquement vers le proxy serveur** en cas d’échec CORS, comme SOAP.",
        "WSDL-/XSD-Abrufe nutzen bei CORS-Fehlern **automatischen Serverproxy-Fallback**, wie SOAP.",
        "WSDL・XSD 取得も SOAP と同様、CORS 失敗時に **サーバープロキシへ自動切替**します。",
        "WSDL 和 XSD 获取在 CORS 失败时现 **自动回退到服务器代理**，与 SOAP Client 一致。",
        "يجري جلب WSDL وXSD **ببديل وكيل الخادم تلقائيًا** عند فشل CORS، مثل SOAP."
    ],
    "**External XSD** section is now collapsed inside the WSDL input area rather than a separate tab — less clutter, optional by default.": [
        "**External XSD** अब अलग टैब के बजाय WSDL इनपुट में बंद सेक्शन — कम अव्यवस्था और डिफ़ॉल्ट वैकल्पिक।",
        "**External XSD** queda plegado dentro de la entrada WSDL, no en otra pestaña: menos ruido y opcional por defecto.",
        "**External XSD** est replié dans la saisie WSDL plutôt qu’un onglet séparé, réduisant l’encombrement et facultatif par défaut.",
        "**External XSD** ist im WSDL-Eingabebereich eingeklappt statt in eigenem Tab; weniger Unordnung und standardmäßig optional.",
        "**External XSD** を別タブから WSDL 入力内の折り畳み欄へ移し、既定では任意として整理しました。",
        "**External XSD** 从独立标签页移至 WSDL 输入区内折叠，减少杂乱，默认可选。",
        "أصبح **External XSD** مطويًا داخل مدخل WSDL بدل تبويب مستقل، بتشويش أقل واختيارية افتراضية."
    ],
    "Rich Text Editor — formatting & UX": [
        "रिच टेक्स्ट एडिटर — फ़ॉर्मैट और अनुभव",
        "Editor enriquecido: formato y experiencia",
        "Éditeur enrichi — formatage et ergonomie",
        "Rich-Text-Editor — Formatierung und Bedienung",
        "リッチテキスト — 整形と操作性",
        "富文本编辑器 — 格式与体验",
        "المحرر المنسق — التنسيق وتجربة الاستخدام"
    ],
    "All toolbar buttons now use `onMouseDown` with `preventDefault` to keep editor focus and selection intact — formatting commands (Bold, Italic, lists, alignment, colours) now work reliably.": [
        "टूलबार बटन अब चयन/फ़ोकस बचाने के लिए `onMouseDown` और `preventDefault` लेते हैं — Bold, Italic, सूची, संरेखण और रंग भरोसेमंद चलते हैं।",
        "Los botones usan `onMouseDown` con `preventDefault` para conservar foco y selección; negrita, cursiva, listas, alineación y colores funcionan de forma fiable.",
        "Les boutons utilisent `onMouseDown` avec `preventDefault` pour conserver focus et sélection ; gras, italique, listes, alignement et couleurs sont fiables.",
        "Toolbarbuttons nutzen `onMouseDown` mit `preventDefault`, um Fokus und Auswahl zu bewahren; Fett, Kursiv, Listen, Ausrichtung und Farben funktionieren zuverlässig.",
        "全ボタンで `onMouseDown` と `preventDefault` を使い、フォーカスと選択を保持。太字・斜体・リスト・整列・色変更が安定して動作します。",
        "工具栏按钮现使用 `onMouseDown` 配合 `preventDefault` 保持焦点和选区，确保粗体、斜体、列表、对齐和颜色可靠生效。",
        "تستخدم أزرار الشريط `onMouseDown` مع `preventDefault` لحفظ التركيز والتحديد، فتعمل أوامر الغامق والمائل والقوائم والمحاذاة والألوان بموثوقية."
    ],
    "Toolbar link button saves the selection on `mousedown` so the selected text is correctly linkified after the modal opens.": [
        "लिंक बटन `mousedown` पर चयन बचाता है, ताकि modal खुलने के बाद चुने टेक्स्ट पर सही लिंक लगे।",
        "El botón de enlace guarda la selección en `mousedown` para enlazarla correctamente tras abrir el modal.",
        "Le bouton de lien sauvegarde la sélection sur `mousedown` pour l’appliquer après ouverture de la fenêtre.",
        "Linkbutton speichert die Auswahl bei `mousedown`, damit sie nach Öffnen des Dialogs korrekt verlinkt wird.",
        "リンクボタンは `mousedown` で選択を保存し、モーダルを開いても正しい箇所にリンクを設定します。",
        "链接按钮在 `mousedown` 保存选区，使弹窗打开后仍正确链接所选文本。",
        "يحفظ زر الرابط التحديد عند `mousedown` لربط النص الصحيح بعد فتح النافذة."
    ],
    "Editor area restyled as a **document canvas**: white paper background, increased padding, max-width constraint, and a subtle box-shadow separating it from the toolbar.": [
        "एडिटर को **दस्तावेज़ कैनवास** रूप दिया: सफ़ेद कागज़, बढ़ी padding, सीमित max-width और टूलबार से अलग हल्की छाया।",
        "Editor rediseñado como **lienzo documental**: papel blanco, más relleno, ancho máximo y sombra sutil que lo separa de la barra.",
        "Zone d’édition devenue **canevas de document** : papier blanc, marges accrues, largeur maximale et ombre séparant la barre.",
        "Editor als **Dokumentfläche** gestaltet: weißes Papier, mehr Innenabstand, Maximalbreite und dezenter Schatten zur Toolbar.",
        "編集領域を **文書キャンバス** に刷新。白い紙、広い余白、最大幅、ツールバーから区切る控えめな影を採用。",
        "编辑区重设计为 **文档画布**：白纸背景、更大内边距、最大宽度限制及与工具栏分隔的细阴影。",
        "أُعيد تصميم المحرر كـ**لوحة مستند**: ورق أبيض وحشو أوسع وعرض أقصى وظل خفيف يفصله عن الشريط."
    ],
    "Removed 'Start typing here…' default placeholder — new documents open with an empty editor.": [
        "‘Start typing here…’ डिफ़ॉल्ट placeholder हटाया — नया दस्तावेज़ खाली खुलता है।",
        "Eliminado el texto predeterminado «Start typing here…»; los documentos nuevos se abren vacíos.",
        "Suppression de « Start typing here… » ; les nouveaux documents s’ouvrent vides.",
        "Standardplatzhalter „Start typing here…“ entfernt; neue Dokumente starten leer.",
        "既定の「Start typing here…」を削除し、新規文書は空で開きます。",
        "移除默认“Start typing here…”占位文字，新文档以空编辑器打开。",
        "أُزيل النص الافتراضي «Start typing here…» لتفتح المستندات الجديدة بمحرر فارغ."
    ],
    "antd v6 deprecation fixes": [
        "antd v6 के पुराने API सुधार",
        "Correcciones de obsolescencias antd v6",
        "Correction des dépréciations antd v6",
        "antd-v6-Abkündigungen korrigiert",
        "antd v6 非推奨 API の修正",
        "antd v6 弃用项修复",
        "إصلاح واجهات antd v6 المهجورة"
    ],
    "`gzip-tools`: replaced static `message.success` import with `messageService` to avoid 'cannot consume context' warning; `Alert message=` → `title=`.": [
        "`gzip-tools`: context चेतावनी हटाने के लिए स्थिर `message.success` की जगह `messageService`; `Alert message=` → `title=`।",
        "`gzip-tools`: `message.success` estático sustituido por `messageService` para evitar el aviso de contexto; `Alert message=` → `title=`.",
        "`gzip-tools` : `message.success` statique remplacé par `messageService` pour éviter l’avertissement de contexte ; `Alert message=` → `title=`.",
        "`gzip-tools`: statisches `message.success` durch `messageService` ersetzt, um Kontextwarnungen zu vermeiden; `Alert message=` → `title=`.",
        "`gzip-tools`: 静的 `message.success` を `messageService` に変更してコンテキスト警告を解消。`Alert message=` → `title=`。",
        "`gzip-tools`：静态 `message.success` 导入改为 `messageService`，避免无法使用上下文警告；`Alert message=` → `title=`。",
        "`gzip-tools`: استُبدل `message.success` الثابت بـ`messageService` لتجنب تحذير السياق؛ `Alert message=` → `title=`."
    ],
    "`ssh-key-generator`: `Alert message=` → `title=`.": [
        "`ssh-key-generator`: `Alert message=` को `title=` में बदला।",
        "`ssh-key-generator`: cambiado `Alert message=` → `title=`.",
        "`ssh-key-generator` : modification `Alert message=` → `title=`.",
        "`ssh-key-generator`: `Alert message=` → `title=` geändert.",
        "`ssh-key-generator`: `Alert message=` → `title=` に変更。",
        "`ssh-key-generator`：`Alert message=` → `title=`。",
        "`ssh-key-generator`: تغيير `Alert message=` → `title=`."
    ],
    "`pkcs12-tool`: added `mounted` guard around `Input.Password` to suppress `data-sharkid` browser-extension hydration mismatch.": [
        "`pkcs12-tool`: `mounted` गार्ड `Input.Password` के आसपास जोड़ा, ताकि `data-sharkid` एक्सटेंशन का hydration mismatch रुके।",
        "`pkcs12-tool`: guardia `mounted` alrededor de `Input.Password` para evitar desajustes de hidratación de la extensión `data-sharkid`.",
        "`pkcs12-tool` : garde `mounted` autour de `Input.Password` pour supprimer le décalage d’hydratation causé par l’extension `data-sharkid`.",
        "`pkcs12-tool`: `mounted`-Schutz um `Input.Password`, um Hydrationsabweichungen durch Erweiterungsattribut `data-sharkid` zu vermeiden.",
        "`pkcs12-tool`: `mounted` ガードを `Input.Password` に追加し、拡張機能の `data-sharkid` によるハイドレーション不一致を防止。",
        "`pkcs12-tool`：添加 `mounted` 防护包裹 `Input.Password`，避免浏览器扩展 `data-sharkid` 引起水合不匹配。",
        "`pkcs12-tool`: أُضيف حارس `mounted` حول `Input.Password` لمنع اختلاف الإماهة بسبب إضافة `data-sharkid`."
    ],
    "`SslConfigSection`: `Alert message=` → `title=`; `Space direction=` → `orientation=` (fixed in previous patch, documented here).": [
        "`SslConfigSection`: `Alert message=` → `title=`; `Space direction=` → `orientation=` (पिछले पैच में सुधारा, यहाँ दर्ज)।",
        "`SslConfigSection`: `Alert message=` → `title=`; `Space direction=` → `orientation=` (corregido antes, documentado aquí).",
        "`SslConfigSection` : `Alert message=` → `title=` ; `Space direction=` → `orientation=` (corrigé au patch précédent, documenté ici).",
        "`SslConfigSection`: `Alert message=` → `title=`; `Space direction=` → `orientation=` (im vorigen Patch korrigiert, hier dokumentiert).",
        "`SslConfigSection`: `Alert message=` → `title=`、`Space direction=` → `orientation=`（前のパッチで修正済み、ここに記録）。",
        "`SslConfigSection`：`Alert message=` → `title=`；`Space direction=` → `orientation=`（前一补丁已修复，此处补充记录）。",
        "`SslConfigSection`: ‏`Alert message=` → `title=`؛ `Space direction=` → `orientation=` (أُصلح في التصحيح السابق ووُثّق هنا)."
    ],
    "V1.3 — AI protocol tooling, Fun & Games expansion, persistence & polish": [
        "V1.3 — AI प्रोटोकॉल टूल, मनोरंजन विस्तार, स्थायी डेटा और सुधार",
        "V1.3 — protocolos IA, juegos ampliados, persistencia y mejoras",
        "V1.3 — protocoles IA, jeux étendus, persistance et finitions",
        "V1.3 — KI-Protokolltools, Spieleausbau, Speicherung und Feinschliff",
        "V1.3 — AI プロトコル、ゲーム拡充、永続保存と改善",
        "V1.3 — AI 协议工具、娱乐扩充、持久化和完善",
        "V1.3 — أدوات بروتوكولات AI وتوسيع الألعاب والحفظ والتحسينات"
    ],
    "Protocol tooling for the AI era (MCP Inspector, A2A Inspector), a full Fun & Games expansion (Spin the Wheel, Magic 8-Ball, Typing Speed Test), two new persistent-text utilities (Sticky Notes, Rich Text Editor), enhanced WSDL/XSD import, and a reliability sweep fixing antd v6 deprecations and SSR hydration mismatches across the toolkit.": [
        "AI युग के MCP/A2A निरीक्षक, Spin the Wheel/Magic 8-Ball/Typing Speed Test का पूरा मनोरंजन विस्तार, स्थायी Sticky Notes/Rich Text Editor, बेहतर WSDL/XSD आयात और पूरे टूलकिट में antd v6/SSR hydration सुधार।",
        "Herramientas MCP/A2A para IA, juegos Spin the Wheel/Magic 8-Ball/Typing Speed Test, utilidades persistentes Sticky Notes/Rich Text Editor, mejor importación WSDL/XSD y correcciones antd v6/SSR.",
        "Outils MCP/A2A pour l’IA, extension des jeux Spin the Wheel/Magic 8-Ball/Typing Speed Test, utilitaires persistants Sticky Notes/Rich Text Editor, import WSDL/XSD amélioré et corrections antd v6/SSR.",
        "MCP-/A2A-Tools für KI, Spielausbau mit Spin the Wheel/Magic 8-Ball/Typing Speed Test, persistente Sticky Notes/Rich Text Editor, besserer WSDL-/XSD-Import sowie antd-v6-/SSR-Hydrationskorrekturen.",
        "AI 時代の MCP/A2A 検査、Spin the Wheel・Magic 8-Ball・Typing Speed Test、永続テキストの Sticky Notes・Rich Text Editor、WSDL/XSD 取込改善、全体の antd v6・SSR 不一致修正。",
        "面向 AI 的 MCP/A2A 检查器，扩充 Spin the Wheel、Magic 8-Ball、Typing Speed Test，新增持久文本工具 Sticky Notes 和 Rich Text Editor，增强 WSDL/XSD 导入，并全面修复 antd v6 弃用及 SSR 水合不匹配。",
        "أدوات MCP/A2A لعصر AI، وتوسيع الألعاب بـSpin the Wheel وMagic 8-Ball وTyping Speed Test، وأداتا Sticky Notes وRich Text Editor الدائمتان، وتحسين استيراد WSDL/XSD وإصلاحات antd v6 وإماهة SSR."
    ],
    "MCP Inspector (new tool)": [
        "MCP निरीक्षक (नया टूल)",
        "Inspector MCP (nuevo)",
        "Inspecteur MCP (nouvel outil)",
        "MCP-Inspektor (neues Tool)",
        "MCP 検査（新ツール）",
        "MCP 检查器（新工具）",
        "فاحص MCP (أداة جديدة)"
    ],
    "Connect to any MCP server over **stdio**, **SSE**, or **HTTP** transport from the browser.": [
        "ब्राउज़र से **stdio**, **SSE** या **HTTP** ट्रांसपोर्ट द्वारा किसी MCP सर्वर से जुड़ें।",
        "Conecta desde el navegador con servidores MCP por **stdio**, **SSE** o **HTTP**.",
        "Connectez un serveur MCP depuis le navigateur via **stdio**, **SSE** ou **HTTP**.",
        "Aus dem Browser mit MCP-Servern über **stdio**, **SSE** oder **HTTP** verbinden.",
        "ブラウザーから **stdio**、**SSE**、**HTTP** で任意の MCP サーバーに接続。",
        "从浏览器通过 **stdio**、**SSE** 或 **HTTP** 连接任意 MCP 服务器。",
        "اتصل بأي خادم MCP من المتصفح عبر **stdio** أو **SSE** أو **HTTP**."
    ],
    "Four connection modes: **direct** (auto-fallback), **direct-strict** (no fallback), **via-server-proxy** (CORS-safe), and **via-mcp-proxy** (tunnels through `npx @modelcontextprotocol/inspector`).": [
        "चार मोड: **direct** (auto-fallback), **direct-strict** (कोई fallback नहीं), **via-server-proxy** (CORS-सुरक्षित), **via-mcp-proxy** (`npx @modelcontextprotocol/inspector` से टनल)।",
        "Cuatro modos: **direct** (respaldo automático), **direct-strict** (sin respaldo), **via-server-proxy** (seguro ante CORS) y **via-mcp-proxy** (túnel por `npx @modelcontextprotocol/inspector`).",
        "Quatre modes : **direct** (repli auto), **direct-strict** (sans repli), **via-server-proxy** (compatible CORS) et **via-mcp-proxy** (tunnel via `npx @modelcontextprotocol/inspector`).",
        "Vier Modi: **direct** (automatischer Fallback), **direct-strict** (ohne Fallback), **via-server-proxy** (CORS-sicher), **via-mcp-proxy** (Tunnel über `npx @modelcontextprotocol/inspector`).",
        "4モード: **direct**（自動代替）、**direct-strict**（代替なし）、**via-server-proxy**（CORS 対応）、**via-mcp-proxy**（`npx @modelcontextprotocol/inspector` のトンネル）。",
        "四种模式：**direct**（自动回退）、**direct-strict**（无回退）、**via-server-proxy**（CORS 安全）、**via-mcp-proxy**（通过 `npx @modelcontextprotocol/inspector` 隧道）。",
        "أربعة أنماط: **direct** (بديل تلقائي)، و**direct-strict** (دون بديل)، و**via-server-proxy** (آمن لـCORS)، و**via-mcp-proxy** (نفق عبر `npx @modelcontextprotocol/inspector`)."
    ],
    "Set **custom headers**, **request timeout**, **maximum total timeout**, and optionally **reset timeout on progress** for long-running tool calls.": [
        "लंबे टूल कॉल के लिए **कस्टम हेडर**, **अनुरोध timeout**, **अधिकतम कुल timeout** और वैकल्पिक **प्रगति पर timeout reset** सेट करें।",
        "Configura **cabeceras**, **tiempo de espera por petición**, **máximo total** y **reinicio al avanzar** para llamadas largas.",
        "Définissez **en-têtes**, **délai de requête**, **délai total maximal** et éventuellement **réinitialisation à la progression** pour les appels longs.",
        "**Eigene Header**, **Anfragezeitlimit**, **Gesamtzeitlimit** und optional **Rücksetzen bei Fortschritt** für lange Aufrufe einstellen.",
        "長いツール呼出用に **カスタムヘッダー**、**要求タイムアウト**、**総時間上限**、任意の **進捗時リセット** を設定できます。",
        "为长时间工具调用设置 **自定义标头**、**请求超时**、**最大总超时**，以及可选的 **进度时重置超时**。",
        "اضبط **ترويسات مخصصة** و**مهلة الطلب** و**المهلة الإجمالية القصوى** واختياريًا **إعادة المهلة مع التقدم** للمكالمات الطويلة."
    ],
    "**OAuth 2.0** PKCE flow with configurable client ID and redirect URL; **SSL/TLS** toggle and inspector proxy token fields.": [
        "विन्यास योग्य क्लाइंट ID/रीडायरेक्ट URL वाला **OAuth 2.0** PKCE फ़्लो; **SSL/TLS** स्विच और निरीक्षक proxy token फ़ील्ड।",
        "Flujo PKCE **OAuth 2.0** con ID cliente y URL de retorno configurables; **SSL/TLS** y token de proxy del inspector.",
        "Flux PKCE **OAuth 2.0** avec ID client et URL de retour réglables ; option **SSL/TLS** et jeton proxy de l’inspecteur.",
        "**OAuth 2.0**-PKCE-Ablauf mit konfigurierbarer Client-ID und Rückleitungs-URL; **SSL/TLS**-Schalter und Inspektor-Proxytoken.",
        "クライアント ID・戻り先 URL を設定する **OAuth 2.0** PKCE、**SSL/TLS** 切替、検査プロキシトークン欄。",
        "**OAuth 2.0** PKCE 流程，可配置客户端 ID 和重定向 URL，另有 **SSL/TLS** 开关及检查器代理令牌字段。",
        "تدفق PKCE من **OAuth 2.0** بمعرّف عميل وعنوان إعادة توجيه قابلين للضبط، ومفتاح **SSL/TLS** وحقول رمز وكيل الفاحص."
    ],
    "**Diagnose** button runs a connectivity pre-flight and surfaces CORS, auth, and transport errors before you start calling tools.": [
        "**Diagnose** बटन कॉल शुरू होने से पहले कनेक्शन pre-flight से CORS, auth और transport त्रुटियाँ दिखाता है।",
        "**Diagnose** prueba la conectividad y muestra errores CORS, de autenticación y transporte antes de llamar herramientas.",
        "**Diagnose** vérifie la connectivité et affiche les erreurs CORS, d’authentification et de transport avant les appels.",
        "**Diagnose** prüft die Verbindung und zeigt CORS-, Authentifizierungs- und Transportfehler vor Toolaufrufen.",
        "**Diagnose** は接続を事前診断し、ツール実行前に CORS・認証・通信方式のエラーを表示します。",
        "**Diagnose** 按钮预检连接，在调用工具前显示 CORS、认证及传输错误。",
        "يفحص زر **Diagnose** الاتصال مسبقًا ويعرض أخطاء CORS والمصادقة والنقل قبل استدعاء الأدوات."
    ],
    "Full tool listing, schema display, and interactive **call panel** — fill arguments, fire the call, inspect the raw result.": [
        "पूरी टूल सूची, स्कीमा प्रदर्शन और इंटरैक्टिव **कॉल पैनल** — तर्क भरें, कॉल चलाएँ, मूल परिणाम देखें।",
        "Listado completo, esquemas y **panel de llamadas** interactivo: completa argumentos, ejecuta e inspecciona el resultado bruto.",
        "Liste complète, schémas et **panneau d’appel** interactif : renseignez les arguments, lancez et inspectez le résultat brut.",
        "Vollständige Toolliste, Schemas und interaktives **Aufrufpanel**: Argumente ausfüllen, ausführen und Rohresultat prüfen.",
        "全ツール一覧、スキーマ表示、対話式 **呼出パネル**。引数を入力し、実行して生の結果を確認できます。",
        "完整工具列表、模式展示和交互式 **调用面板**：填写参数、发起调用、检查原始结果。",
        "قائمة أدوات كاملة وعرض مخططات و**لوحة استدعاء** تفاعلية: املأ الوسائط ونفّذ وافحص الناتج الخام."
    ],
    "A2A Protocol Inspector (new tool)": [
        "A2A प्रोटोकॉल इंस्पेक्टर (नया टूल)",
        "Inspector del protocolo A2A (nueva herramienta)",
        "Inspecteur du protocole A2A (nouvel outil)",
        "A2A-Protokollinspektor (neues Tool)",
        "A2Aプロトコルインスペクター（新ツール）",
        "A2A 协议检查器（新工具）",
        "فاحص بروتوكول A2A (أداة جديدة)"
    ],
    "Connect to any local or remote **Agent2Agent** agent by URL and inspect its **Agent Card** (name, description, capabilities, skills).": [
        "URL से किसी स्थानीय या दूरस्थ **Agent2Agent** एजेंट से जुड़ें और उसका **Agent Card** (नाम, विवरण, क्षमताएँ, कौशल) देखें।",
        "Conecta por URL cualquier agente **Agent2Agent** local o remoto e inspecciona su **Agent Card** (nombre, descripción, capacidades, habilidades).",
        "Connectez par URL un agent **Agent2Agent** local ou distant et inspectez sa **Agent Card** (nom, description, capacités, compétences).",
        "Beliebige lokale oder entfernte **Agent2Agent**-Agenten per URL verbinden und ihre **Agent Card** mit Name, Beschreibung, Fähigkeiten und Skills prüfen.",
        "URLでローカル・リモートの**Agent2Agent**エージェントへ接続し、**Agent Card**の名前・説明・機能・スキルを確認。",
        "通过 URL 连接任意本地或远程 **Agent2Agent** 代理，检查其 **Agent Card**（名称、描述、能力、技能）。",
        "اتصل بأي وكيل **Agent2Agent** محلي أو بعيد عبر URL وافحص **Agent Card** الخاص به (الاسم والوصف والإمكانات والمهارات)."
    ],
    "Supports both current A2A spec (`message/send` + `message/stream`) and legacy protocol (`tasks/send` + `agent.json`).": [
        "वर्तमान A2A स्पेक (`message/send` + `message/stream`) और पुराने प्रोटोकॉल (`tasks/send` + `agent.json`) दोनों समर्थित।",
        "Admite la especificación A2A actual (`message/send` + `message/stream`) y el protocolo anterior (`tasks/send` + `agent.json`).",
        "Prend en charge la spécification A2A actuelle (`message/send` + `message/stream`) et l’ancien protocole (`tasks/send` + `agent.json`).",
        "Unterstützt aktuelle A2A-Spezifikation (`message/send` + `message/stream`) und altes Protokoll (`tasks/send` + `agent.json`).",
        "現行A2A仕様（`message/send` + `message/stream`）と旧プロトコル（`tasks/send` + `agent.json`）に対応。",
        "同时支持当前 A2A 规范（`message/send` + `message/stream`）和旧协议（`tasks/send` + `agent.json`）。",
        "يدعم مواصفة A2A الحالية (`message/send` + `message/stream`) والبروتوكول القديم (`tasks/send` + `agent.json`)."
    ],
    "**Spec compliance checker** — validates the card against the A2A spec and surfaces missing or malformed fields.": [
        "**स्पेक अनुपालन जाँच** — A2A स्पेक के विरुद्ध कार्ड जाँचती है और गुम या गलत फ़ील्ड दिखाती है।",
        "**Comprobación de conformidad**: valida la tarjeta contra A2A y muestra campos ausentes o incorrectos.",
        "**Vérification de conformité** : valide la carte selon A2A et signale les champs absents ou mal formés.",
        "**Spezifikationsprüfung** prüft die Karte anhand von A2A und zeigt fehlende oder fehlerhafte Felder.",
        "**仕様適合チェック**でカードをA2A仕様と照合し、不足・不正なフィールドを表示。",
        "**规范合规检查器**：依据 A2A 规范验证卡片，提示缺失或格式错误的字段。",
        "**فاحص مطابقة المواصفة** يتحقق من البطاقة مقابل A2A ويعرض الحقول المفقودة أو المشوهة."
    ],
    "**Streaming responses** — live-streamed via `fetch` + `ReadableStream`; task lifecycle, **contextId** tracking, and skill testing with structured input.": [
        "**स्ट्रीमिंग उत्तर** — `fetch` + `ReadableStream` से लाइव स्ट्रीम; टास्क जीवनचक्र, **contextId** ट्रैकिंग और संरचित इनपुट से कौशल परीक्षण।",
        "**Respuestas en streaming** mediante `fetch` + `ReadableStream`; ciclo de tareas, seguimiento de **contextId** y pruebas de habilidades con entradas estructuradas.",
        "**Réponses en streaming** via `fetch` + `ReadableStream` ; cycle de vie des tâches, suivi de **contextId** et tests de compétences avec entrées structurées.",
        "**Streamingantworten** über `fetch` + `ReadableStream`; Aufgabenlebenszyklus, **contextId**-Verfolgung und Skilltests mit strukturierten Eingaben.",
        "`fetch` + `ReadableStream`による**応答ストリーミング**、タスクのライフサイクル、**contextId**追跡、構造化入力によるスキルテスト。",
        "通过 `fetch` + `ReadableStream` 实时提供**流式响应**；支持任务生命周期、**contextId** 跟踪和结构化输入技能测试。",
        "**استجابات متدفقة** مباشرة عبر `fetch` + `ReadableStream`؛ دورة حياة المهام وتتبع **contextId** واختبار المهارات بمدخلات منظمة."
    ],
    "**Debug console** — shows every raw **JSON-RPC 2.0** request and response with syntax highlighting and copy-to-clipboard.": [
        "**डिबग कंसोल** — हर मूल **JSON-RPC 2.0** अनुरोध व उत्तर को सिंटैक्स हाइलाइटिंग और क्लिपबोर्ड कॉपी सहित दिखाता है।",
        "**Consola de depuración**: muestra cada solicitud y respuesta **JSON-RPC 2.0** original con resaltado y copia.",
        "**Console de débogage** : affiche chaque requête et réponse **JSON-RPC 2.0** brute avec coloration et copie.",
        "**Debugkonsole** zeigt alle rohen **JSON-RPC 2.0**-Anfragen und Antworten mit Syntaxhervorhebung und Kopierfunktion.",
        "**デバッグコンソール**で全**JSON-RPC 2.0**要求・応答を構文強調付きで表示し、クリップボードへコピー。",
        "**调试控制台**：显示每个原始 **JSON-RPC 2.0** 请求与响应，支持语法高亮和复制。",
        "**وحدة تصحيح** تعرض كل طلب واستجابة **JSON-RPC 2.0** خام مع إبراز الصياغة والنسخ للحافظة."
    ],
    "Persistent connection history and per-session message log.": [
        "स्थायी कनेक्शन इतिहास और प्रति-सत्र संदेश लॉग।",
        "Historial de conexiones persistente y registro de mensajes por sesión.",
        "Historique persistant des connexions et journal des messages par session.",
        "Dauerhafter Verbindungsverlauf und Nachrichtenprotokoll je Sitzung.",
        "接続履歴の永続保存とセッションごとのメッセージログ。",
        "持久连接历史和每会话消息日志。",
        "سجل اتصال دائم وسجل رسائل لكل جلسة."
    ],
    "WSDL Parser — external XSD support": [
        "WSDL पार्सर — बाहरी XSD समर्थन",
        "Analizador WSDL: soporte XSD externo",
        "Analyseur WSDL : prise en charge des XSD externes",
        "WSDL-Parser – Unterstützung externer XSDs",
        "WSDLパーサー：外部XSD対応",
        "WSDL 解析器：外部 XSD 支持",
        "محلل WSDL: دعم XSD الخارجي"
    ],
    "New **Import XSD** tab: paste an external XSD document or load one by URL to resolve `<xsd:import>` / `<xsd:include>` references that point outside the WSDL.": [
        "नया **XSD आयात** टैब: बाहरी XSD पेस्ट करें या URL से लाएँ ताकि WSDL से बाहर के `<xsd:import>` / `<xsd:include>` संदर्भ सुलझें।",
        "Nueva pestaña **Importar XSD**: pega un XSD externo o cárgalo por URL para resolver `<xsd:import>` / `<xsd:include>` fuera del WSDL.",
        "Nouvel onglet **Importer XSD** : collez un XSD externe ou chargez-le par URL pour résoudre les références `<xsd:import>` / `<xsd:include>` hors WSDL.",
        "Neuer Reiter **XSD importieren**: Externe XSD einfügen oder per URL laden, um `<xsd:import>` / `<xsd:include>` außerhalb der WSDL aufzulösen.",
        "新しい**XSDインポート**タブで外部XSDを貼り付け・URL取得し、WSDL外を参照する`<xsd:import>` / `<xsd:include>`を解決。",
        "新增 **导入 XSD** 标签页：粘贴外部 XSD 或通过 URL 加载，解析指向 WSDL 外的 `<xsd:import>` / `<xsd:include>` 引用。",
        "تبويب **استيراد XSD** جديد: الصق مستند XSD خارجيا أو اجلبه عبر URL لحل مراجع `<xsd:import>` / `<xsd:include>` خارج WSDL."
    ],
    "Multiple XSD documents can be added to the import set; the parser resolves types across all of them before rendering the schema tree.": [
        "कई XSD आयात सेट में जोड़ें; स्कीमा ट्री दिखाने से पहले पार्सर सभी में प्रकार सुलझाता है।",
        "Añade varios XSD al conjunto; el analizador resuelve sus tipos antes de mostrar el árbol.",
        "Ajoutez plusieurs XSD ; l’analyseur résout leurs types avant d’afficher l’arbre du schéma.",
        "Mehrere XSDs zum Importsatz hinzufügen; der Parser löst alle Typen vor der Schemaanzeige auf.",
        "複数XSDを追加でき、スキーマツリー表示前にすべての文書の型を解決。",
        "可向导入集添加多个 XSD；解析器在渲染模式树前跨文档解析类型。",
        "يمكن إضافة عدة مستندات XSD؛ يحل المحلل أنواعها جميعا قبل عرض شجرة المخطط."
    ],
    "Spin the Wheel (new tool)": [
        "स्पिन द व्हील (नया टूल)",
        "Gira la ruleta (nueva herramienta)",
        "Roue de la chance (nouvel outil)",
        "Glücksrad (neues Tool)",
        "スピンホイール（新ツール）",
        "幸运转盘（新工具）",
        "أدر العجلة (أداة جديدة)"
    ],
    "Customisable SVG spinning wheel with 2–12 entries, full-rotation Framer Motion animation, and a winner spotlight on landing.": [
        "2–12 विकल्प वाला कस्टम SVG व्हील, Framer Motion का पूरा घुमाव और रुकने पर विजेता पर फ़ोकस।",
        "Ruleta SVG personalizable con 2–12 opciones, giro completo Framer Motion y ganador destacado al detenerse.",
        "Roue SVG personnalisable de 2–12 choix, rotation Framer Motion complète et gagnant mis en lumière à l’arrêt.",
        "Anpassbares SVG-Rad mit 2–12 Einträgen, vollständiger Framer Motion-Drehung und Gewinnerhervorhebung beim Stoppen.",
        "2–12候補のカスタムSVGホイール。Framer Motionで回転し、停止時に当選者を強調。",
        "可自定义 SVG 转盘，含 2–12 个选项、Framer Motion 完整旋转动画和停止后的获胜者高亮。",
        "عجلة SVG مخصصة تضم 2–12 خيارا ودورانا كاملا بـ Framer Motion وإبراز الفائز عند التوقف."
    ],
    "Add, rename, or remove items freely; entries persist in **localStorage** across reloads.": [
        "विकल्प स्वतंत्र रूप से जोड़ें, नाम बदलें या हटाएँ; रीलोड पर **localStorage** में सहेजे रहते हैं।",
        "Añade, renombra o elimina opciones; se conservan en **localStorage** al recargar.",
        "Ajoutez, renommez ou supprimez les choix ; **localStorage** les conserve après rechargement.",
        "Einträge frei hinzufügen, umbenennen und entfernen; sie bleiben über **localStorage** beim Neuladen erhalten.",
        "候補を自由に追加・改名・削除。再読み込み後も**localStorage**に保持。",
        "自由添加、重命名或删除选项；刷新后仍通过 **localStorage** 保留。",
        "أضف الخيارات وأعد تسميتها أو احذفها بحرية؛ تحفظ في **localStorage** بعد إعادة التحميل."
    ],
    "12-colour palette auto-assigned to segments; winner highlight with gold border and animated reveal card.": [
        "12-रंग पैलेट खंडों को स्वतः मिलता है; सुनहरी सीमा और एनीमेटेड कार्ड से विजेता उजागर।",
        "Paleta de 12 colores automática; ganador con borde dorado y tarjeta animada.",
        "Palette de 12 couleurs automatique ; gagnant à bordure dorée et carte animée.",
        "12-Farben-Palette automatisch auf Segmente verteilt; Gewinner mit Goldrand und animierter Karte.",
        "12色を区画に自動配色し、金枠とアニメーションカードで当選者を表示。",
        "自动为分区分配 12 色调色板；用金色边框和动画揭晓卡突出获胜者。",
        "لوحة من 12 لونا توزع تلقائيا؛ إبراز الفائز بإطار ذهبي وبطاقة كشف متحركة."
    ],
    "Magic 8-Ball (new tool)": [
        "मैजिक 8-बॉल (नया टूल)",
        "Magic 8-Ball (nueva herramienta)",
        "Magic 8-Ball (nouvel outil)",
        "Magic 8-Ball (neues Tool)",
        "マジック8ボール（新ツール）",
        "魔法 8 号球（新工具）",
        "Magic 8-Ball (أداة جديدة)"
    ],
    "All 20 classic responses (10 positive, 5 neutral, 5 negative — same distribution as the original toy).": [
        "सभी 20 क्लासिक उत्तर: 10 सकारात्मक, 5 तटस्थ, 5 नकारात्मक — मूल खिलौने जैसा वितरण।",
        "Las 20 respuestas clásicas: 10 positivas, 5 neutras y 5 negativas, como el juguete original.",
        "Les 20 réponses classiques : 10 positives, 5 neutres, 5 négatives, comme le jouet original.",
        "Alle 20 klassischen Antworten: 10 positiv, 5 neutral, 5 negativ – wie beim Originalspielzeug.",
        "定番20回答（肯定10・中立5・否定5）を元のおもちゃと同じ配分で収録。",
        "全部 20 种经典回答：10 种肯定、5 种中立、5 种否定，与原玩具分布相同。",
        "كل الإجابات الكلاسيكية الـ 20: 10 إيجابية و5 محايدة و5 سلبية، بتوزيع اللعبة الأصلية."
    ],
    "Animated SVG ball with radial-gradient 3D sheen and Framer Motion shake; fortune text rendered inside the triangle window.": [
        "रेडियल ग्रेडिएंट 3D चमक और Framer Motion कंपन वाला SVG बॉल; त्रिकोण विंडो में भविष्यवाणी।",
        "Bola SVG animada con brillo 3D radial y sacudida Framer Motion; respuesta dentro del triángulo.",
        "Boule SVG animée avec éclat 3D radial et secousse Framer Motion ; réponse dans le triangle.",
        "Animierte SVG-Kugel mit radialem 3D-Glanz und Framer Motion-Schütteln; Antwort im Dreiecksfenster.",
        "放射グラデーションの3D光沢とFramer Motionの揺れを備えたSVGボール。三角窓に回答を表示。",
        "动画 SVG 球体具备径向渐变 3D 光泽和 Framer Motion 摇晃效果，预言显示于三角窗内。",
        "كرة SVG متحركة بلمعان 3D شعاعي واهتزاز Framer Motion؛ تظهر الإجابة داخل النافذة المثلثة."
    ],
    "Per-session response stats with animated progress bars and question history tracking last 8 entries.": [
        "एनीमेटेड प्रगति बार सहित प्रति-सत्र उत्तर आँकड़े और अंतिम 8 प्रश्नों का इतिहास।",
        "Estadísticas por sesión con barras animadas e historial de las últimas 8 preguntas.",
        "Statistiques par session avec barres animées et historique des 8 dernières questions.",
        "Sitzungsstatistik mit animierten Balken und Verlauf der letzten 8 Fragen.",
        "アニメーション棒グラフ付きのセッション統計と直近8件の質問履歴。",
        "每会话响应统计，含动画进度条及最近 8 条问题历史。",
        "إحصاءات إجابات لكل جلسة بأشرطة متحركة وسجل آخر 8 أسئلة."
    ],
    "Typing Speed Test (new tool)": [
        "टाइपिंग गति परीक्षण (नया टूल)",
        "Prueba de velocidad de escritura (nueva herramienta)",
        "Test de vitesse de frappe (nouvel outil)",
        "Tippgeschwindigkeitstest (neues Tool)",
        "タイピング速度テスト（新ツール）",
        "打字速度测试（新工具）",
        "اختبار سرعة الكتابة (أداة جديدة)"
    ],
    "Measures **WPM** (words per minute) and accuracy in real time using the standard correctChars ÷ 5 ÷ minutes formula.": [
        "मानक correctChars ÷ 5 ÷ minutes सूत्र से **WPM** (शब्द प्रति मिनट) और शुद्धता तुरंत मापता है।",
        "Mide **WPM** (palabras por minuto) y precisión en vivo con correctChars ÷ 5 ÷ minutes.",
        "Mesure **WPM** (mots par minute) et précision en direct avec correctChars ÷ 5 ÷ minutes.",
        "Misst **WPM** (Wörter pro Minute) und Genauigkeit live mit correctChars ÷ 5 ÷ minutes.",
        "標準式correctChars ÷ 5 ÷ minutesで**WPM**（毎分単語数）と正確率をリアルタイム計測。",
        "使用标准 correctChars ÷ 5 ÷ minutes 公式实时测量 **WPM**（每分钟词数）和准确率。",
        "يقيس **WPM** (كلمات في الدقيقة) والدقة مباشرة بصيغة correctChars ÷ 5 ÷ minutes."
    ],
    "Hidden textarea captures keystrokes; visible display highlights characters green (correct), red (error), purple (cursor), and faded (pending).": [
        "छिपा textarea कीस्ट्रोक लेता है; दृश्य में सही हरा, गलत लाल, कर्सर बैंगनी और बाकी हल्के अक्षर।",
        "Un textarea oculto recibe teclas; muestra verde lo correcto, rojo los errores, morado el cursor y tenue lo pendiente.",
        "Un textarea caché capture la frappe ; vert correct, rouge erreur, violet curseur et estompé en attente.",
        "Verstecktes textarea erfasst Tasten; grün korrekt, rot Fehler, violett Cursor und blass ausstehend.",
        "隠しtextareaで入力を受け、正解は緑、誤りは赤、カーソルは紫、未入力は薄色で表示。",
        "隐藏 textarea 捕获按键；正确字符绿色、错误红色、光标紫色、待输入淡色。",
        "يلتقط textarea مخفي الضغطات؛ الصحيح أخضر والخطأ أحمر والمؤشر بنفسجي والمنتظر باهت."
    ],
    "Four durations (15 s / 30 s / 60 s / 2 min); timer starts on first keystroke, auto-finishes when the passage is fully typed.": [
        "चार अवधियाँ (15 s / 30 s / 60 s / 2 min); पहले कीस्ट्रोक से टाइमर शुरू, पूरा अंश लिखने पर स्वतः समाप्त।",
        "Cuatro duraciones (15 s / 30 s / 60 s / 2 min); empieza al teclear y termina al completar el texto.",
        "Quatre durées (15 s / 30 s / 60 s / 2 min) ; démarre à la première frappe et finit avec le passage complet.",
        "Vier Zeiten (15 s / 30 s / 60 s / 2 min); Start beim ersten Tastendruck, Ende nach vollständigem Text.",
        "4つの時間設定（15 s / 30 s / 60 s / 2 min）。最初の入力で開始し、全文入力で自動終了。",
        "四种时长（15 s / 30 s / 60 s / 2 min）；首次按键启动，完成全文后自动结束。",
        "أربع مدد (15 s / 30 s / 60 s / 2 min)؛ يبدأ مع أول ضغطة وينتهي تلقائيا باكتمال النص."
    ],
    "Results history shows last 5 tests with WPM, accuracy, and error count.": [
        "परिणाम इतिहास में अंतिम 5 परीक्षणों के WPM, शुद्धता और त्रुटि संख्या।",
        "Historial de las últimas 5 pruebas con WPM, precisión y errores.",
        "Historique des 5 derniers tests avec WPM, précision et nombre d’erreurs.",
        "Letzte 5 Testergebnisse mit WPM, Genauigkeit und Fehlerzahl.",
        "直近5テストのWPM・正確率・エラー数を履歴表示。",
        "结果历史显示最近 5 次测试的 WPM、准确率和错误数。",
        "سجل آخر 5 اختبارات مع WPM والدقة وعدد الأخطاء."
    ],
    "Sticky Notes & Rich Text Editor (new tools)": [
        "स्टिकी नोट्स और रिच टेक्स्ट संपादक (नए टूल)",
        "Notas adhesivas y editor de texto enriquecido (nuevas herramientas)",
        "Notes adhésives et éditeur enrichi (nouveaux outils)",
        "Haftnotizen und Rich-Text-Editor (neue Tools)",
        "付箋・リッチテキスト編集（新ツール）",
        "便签与富文本编辑器（新工具）",
        "ملاحظات لاصقة ومحرر نص منسق (أدوات جديدة)"
    ],
    "**Sticky Notes**: multi-board note management with colour themes and persistence in **localStorage**.": [
        "**स्टिकी नोट्स**: रंग थीम और **localStorage** में स्थायित्व सहित कई बोर्ड पर नोट प्रबंधन।",
        "**Notas adhesivas**: gestión en varios tableros con temas de color y persistencia **localStorage**.",
        "**Notes adhésives** : gestion multitableaux, thèmes colorés et persistance **localStorage**.",
        "**Haftnotizen**: Mehrboard-Verwaltung mit Farbthemen und Speicherung in **localStorage**.",
        "**付箋**：色テーマと**localStorage**保存付きの複数ボード管理。",
        "**便签**：支持多看板、颜色主题及 **localStorage** 持久化。",
        "**ملاحظات لاصقة**: إدارة متعددة اللوحات بسمات ألوان وحفظ في **localStorage**."
    ],
    "**Rich Text Editor**: WYSIWYG editing with export options, also persisted locally so content survives page reloads.": [
        "**रिच टेक्स्ट संपादक**: निर्यात सहित WYSIWYG संपादन; स्थानीय सेव से रीलोड पर भी सामग्री रहती है।",
        "**Editor enriquecido**: edición WYSIWYG con exportación y guardado local que conserva el contenido al recargar.",
        "**Éditeur enrichi** : WYSIWYG avec export et sauvegarde locale conservant le contenu après rechargement.",
        "**Rich-Text-Editor**: WYSIWYG mit Export und lokaler Speicherung über Neuladen hinweg.",
        "**リッチテキスト編集**：WYSIWYGと書き出しに対応し、ローカル保存で再読み込み後も保持。",
        "**富文本编辑器**：WYSIWYG 编辑与导出，本地持久化让内容在刷新后保留。",
        "**محرر نص منسق**: تحرير WYSIWYG وتصدير مع حفظ محلي يبقي المحتوى بعد إعادة التحميل."
    ],
    "Antd v6 compatibility & SSR reliability": [
        "Antd v6 संगतता और SSR विश्वसनीयता",
        "Compatibilidad Antd v6 y fiabilidad SSR",
        "Compatibilité Antd v6 et fiabilité SSR",
        "Antd-v6-Kompatibilität und SSR-Zuverlässigkeit",
        "Antd v6互換性とSSRの安定性",
        "Antd v6 兼容性与 SSR 可靠性",
        "توافق Antd v6 وموثوقية SSR"
    ],
    "Fixed `Space direction=\"vertical\"` → `orientation=\"vertical\"` deprecation (MCP Inspector, Coin Toss).": [
        "`Space direction=\"vertical\"` → `orientation=\"vertical\"` की अप्रचलन चेतावनी सुधरी (MCP इंस्पेक्टर, कॉइन टॉस)।",
        "Corregida la obsolescencia `Space direction=\"vertical\"` → `orientation=\"vertical\"` (MCP Inspector, moneda).",
        "Correction de l’obsolescence `Space direction=\"vertical\"` → `orientation=\"vertical\"` (inspecteur MCP, pile ou face).",
        "Veraltung `Space direction=\"vertical\"` → `orientation=\"vertical\"` behoben (MCP-Inspektor, Münzwurf).",
        "`Space direction=\"vertical\"` → `orientation=\"vertical\"`の非推奨警告を修正（MCPインスペクター、コイントス）。",
        "修复 `Space direction=\"vertical\"` → `orientation=\"vertical\"` 弃用问题（MCP 检查器、抛硬币）。",
        "أصلحت تحذيرات `Space direction=\"vertical\"` → `orientation=\"vertical\"` في فاحص MCP وقلب العملة."
    ],
    "Fixed `Statistic valueStyle` → `styles={{ content }}` and `Progress trailColor` → `railColor` deprecations (Coin Toss, Stopwatch).": [
        "`Statistic valueStyle` → `styles={{ content }}` और `Progress trailColor` → `railColor` अप्रचलन सुधरे (कॉइन टॉस, स्टॉपवॉच)।",
        "Corregidas `Statistic valueStyle` → `styles={{ content }}` y `Progress trailColor` → `railColor` (moneda, cronómetro).",
        "Corrections `Statistic valueStyle` → `styles={{ content }}` et `Progress trailColor` → `railColor` (pile ou face, chronomètre).",
        "Veraltungen `Statistic valueStyle` → `styles={{ content }}` und `Progress trailColor` → `railColor` behoben (Münzwurf, Stoppuhr).",
        "`Statistic valueStyle` → `styles={{ content }}`、`Progress trailColor` → `railColor`の非推奨対応（コイントス、ストップウォッチ）。",
        "修复 `Statistic valueStyle` → `styles={{ content }}` 和 `Progress trailColor` → `railColor` 弃用问题（抛硬币、秒表）。",
        "أصلحت `Statistic valueStyle` → `styles={{ content }}` و`Progress trailColor` → `railColor` في قلب العملة وساعة الإيقاف."
    ],
    "Resolved **SSR hydration mismatch** in Timer's `RingTicks` SVG: `Math.sin`/`Math.cos` coordinates rounded to 4 decimal places so Node.js and browser V8 emit identical strings.": [
        "टाइमर के `RingTicks` SVG का **SSR हाइड्रेशन अंतर** सुधरा: `Math.sin`/`Math.cos` निर्देशांक 4 दशमलव तक राउंड, ताकि Node.js और ब्राउज़र V8 समान स्ट्रिंग दें।",
        "Corregida la **discordancia de hidratación SSR** en `RingTicks`: coordenadas `Math.sin`/`Math.cos` redondeadas a 4 decimales para cadenas idénticas en Node.js y V8.",
        "Correction du **décalage d’hydratation SSR** de `RingTicks` : coordonnées `Math.sin`/`Math.cos` arrondies à 4 décimales pour des chaînes identiques Node.js/V8.",
        "**SSR-Hydrationsabweichung** im Timer-SVG `RingTicks` behoben: `Math.sin`/`Math.cos` auf 4 Dezimalstellen runden für identische Node.js-/V8-Zeichenfolgen.",
        "Timerの`RingTicks` SVGの**SSRハイドレーション不一致**を修正。`Math.sin`/`Math.cos`座標を小数4桁に丸め、Node.jsとブラウザーV8の文字列を一致。",
        "解决 Timer 的 `RingTicks` SVG **SSR 水合不匹配**：`Math.sin`/`Math.cos` 坐标舍入至 4 位小数，使 Node.js 与浏览器 V8 输出一致。",
        "حل **اختلاف ترطيب SSR** في SVG الخاص بـ `RingTicks`: تقريب إحداثيات `Math.sin`/`Math.cos` إلى 4 منازل لتطابق نصوص Node.js وV8."
    ],
    "Added `mounted` guards on antd `InputNumber`/`Input`/`Select` fields in Timer and Dice Roll to prevent browser-extension (`data-sharkid`) attribute injection from causing React hydration warnings.": [
        "टाइमर और डाइस रोल के antd `InputNumber`/`Input`/`Select` में `mounted` गार्ड जोड़े, ताकि एक्सटेंशन का `data-sharkid` इंजेक्शन React हाइड्रेशन चेतावनी न बनाए।",
        "Añadidos controles `mounted` a antd `InputNumber`/`Input`/`Select` en temporizador y dados para evitar avisos React por inyección `data-sharkid` de extensiones.",
        "Ajout de gardes `mounted` aux champs antd `InputNumber`/`Input`/`Select` du minuteur et des dés contre les avertissements React dus à l’injection `data-sharkid`.",
        "`mounted`-Schutz für antd `InputNumber`/`Input`/`Select` in Timer und Würfeln ergänzt, damit Erweiterungsinjektion `data-sharkid` keine React-Hydrationswarnung erzeugt.",
        "Timer・Dice Rollのantd `InputNumber`/`Input`/`Select`に`mounted`ガードを加え、拡張機能の`data-sharkid`属性注入によるReact警告を防止。",
        "为 Timer 和 Dice Roll 的 antd `InputNumber`/`Input`/`Select` 添加 `mounted` 防护，避免扩展注入 `data-sharkid` 属性导致 React 水合警告。",
        "أضيفت حواجز `mounted` لحقول antd `InputNumber`/`Input`/`Select` بالمؤقت والنرد لمنع تحذيرات React بسبب حقن `data-sharkid` من الإضافات."
    ],
    "Fixed MCP Inspector hydration: `localStorage` read moved from `useState` initialiser to `useEffect` so server and client see the same initial state.": [
        "MCP इंस्पेक्टर हाइड्रेशन सुधरा: `localStorage` पढ़ना `useState` इनिशियलाइज़र से `useEffect` में गया, ताकि सर्वर/क्लाइंट शुरुआती स्थिति समान हो।",
        "Corregida la hidratación MCP: lectura `localStorage` movida de `useState` a `useEffect` para igualar el estado inicial cliente/servidor.",
        "Hydratation MCP corrigée : lecture `localStorage` déplacée de l’initialiseur `useState` vers `useEffect` pour un état initial identique.",
        "MCP-Hydration behoben: `localStorage`-Lesen von `useState`-Initialisierung nach `useEffect` verschoben, damit Server und Client gleich starten.",
        "MCPインスペクターの水合を修正。`localStorage`読み取りを`useState`初期化から`useEffect`へ移し、初期状態を統一。",
        "修复 MCP 检查器水合：将 `localStorage` 读取从 `useState` 初始化移至 `useEffect`，统一服务端和客户端初始状态。",
        "أصلح ترطيب MCP بنقل قراءة `localStorage` من مهيئ `useState` إلى `useEffect` لتوحيد الحالة الأولية بالخادم والعميل."
    ],
    "V1.2 — routing, polish, QA pass across 90 tools": [
        "V1.2 — रूटिंग, UI सुधार और 90 टूल की QA जाँच",
        "V1.2: rutas, pulido y QA de 90 herramientas",
        "V1.2 : routage, finitions et QA de 90 outils",
        "V1.2 – Routing, Feinschliff und QA für 90 Tools",
        "V1.2：ルーティング、仕上げ、90ツールのQA",
        "V1.2：路由、优化与 90 个工具 QA 检查",
        "V1.2: توجيه وتحسين وفحص QA لـ 90 أداة"
    ],
    "Stable canonical URLs everywhere, refreshed workshop chrome aligned with landing marketing, Timer and Stopwatch in the toolkit, and a systematic smoke pass over every registry tool route. Developer ergonomics tightened (ESLint scoping for Monaco/vendor code, converters without side effects inside useMemo, React Compiler–clean fixes in QR, timestamp, URL parser).": [
        "स्थिर कैनॉनिकल URL, लैंडिंग से मेल खाता वर्कशॉप UI, टाइमर/स्टॉपवॉच और हर रजिस्ट्री रूट का स्मोक परीक्षण। Monaco/vendor हेतु ESLint दायरा, useMemo में साइड इफ़ेक्ट रहित कन्वर्टर और QR, टाइमस्टैम्प व URL पार्सर में React Compiler-अनुकूल सुधार।",
        "URL canónicas estables, interfaz alineada con la portada, temporizador y cronómetro, y prueba de todas las rutas. Mejoras de ESLint para Monaco/vendor, conversores sin efectos en useMemo y correcciones compatibles con React Compiler en QR, timestamps y URL.",
        "URL canoniques stables, interface alignée sur l’accueil, minuteur et chronomètre, contrôle de chaque route. ESLint ciblé pour Monaco/vendor, convertisseurs sans effets dans useMemo et corrections React Compiler pour QR, horodatage et URL.",
        "Stabile kanonische URLs, zur Landingpage passende Oberfläche, Timer und Stoppuhr sowie Smoke-Tests aller registrierten Routen. ESLint für Monaco/Vendor abgegrenzt, Converter ohne useMemo-Nebeneffekte und React Compiler-konforme QR-, Zeitstempel- und URL-Korrekturen.",
        "正規URLを統一し、紹介ページに沿った作業画面へ刷新。Timer・Stopwatchを追加し、全登録ルートを簡易検証。Monaco/vendorのESLint範囲、useMemoの副作用除去、QR・時刻・URLのReact Compiler対応を改善。",
        "统一规范 URL、使工作区风格与落地页一致，加入 Timer、Stopwatch 并系统检查全部工具路由。调整 Monaco/vendor 的 ESLint 范围，移除转换器 useMemo 副作用，修复 QR、时间戳、URL 解析器的 React Compiler 问题。",
        "عناوين معيارية ثابتة وواجهة عمل متوافقة مع صفحة التعريف ومؤقت وساعة إيقاف وفحص لكل مسار. ضبط ESLint لـ Monaco/vendor ومحولات بلا آثار جانبية في useMemo وتصحيحات React Compiler لأدوات QR والطابع الزمني وURL."
    ],
    "URLs & deployment (Next.js 16)": [
        "URL और डिप्लॉयमेंट (Next.js 16)",
        "URL y despliegue (Next.js 16)",
        "URL et déploiement (Next.js 16)",
        "URLs und Bereitstellung (Next.js 16)",
        "URLとデプロイ（Next.js 16）",
        "URL 与部署（Next.js 16）",
        "عناوين URL والنشر (Next.js 16)"
    ],
    "Public paths stay **`/[categorySlug]/[toolId]`** (example: **`/formatters/html-formatter`**) via **`src/proxy.ts`** — the **`middleware`** file convention used in Next 15 does not forward to routes on this stack.": [
        "सार्वजनिक पाथ **`/[categorySlug]/[toolId]`** (उदाहरण **`/formatters/html-formatter`**) **`src/proxy.ts`** से चलते हैं; Next 15 का **`middleware`** फ़ाइल नियम इस स्टैक में रूट आगे नहीं भेजता।",
        "Las rutas públicas **`/[categorySlug]/[toolId]`** (p. ej. **`/formatters/html-formatter`**) pasan por **`src/proxy.ts`**; la convención **`middleware`** de Next 15 no reenvía rutas en esta pila.",
        "Les chemins publics **`/[categorySlug]/[toolId]`** (ex. **`/formatters/html-formatter`**) passent par **`src/proxy.ts`** ; la convention **`middleware`** de Next 15 ne transmet pas les routes ici.",
        "Öffentliche Pfade **`/[categorySlug]/[toolId]`** (etwa **`/formatters/html-formatter`**) laufen über **`src/proxy.ts`**; die Next 15-Konvention **`middleware`** leitet hier nicht weiter.",
        "公開パスは**`src/proxy.ts`**経由の**`/[categorySlug]/[toolId]`**（例：**`/formatters/html-formatter`**）。Next 15の**`middleware`**規約ではこの構成の転送は行えません。",
        "公开路径仍为 **`/[categorySlug]/[toolId]`**（如 **`/formatters/html-formatter`**），由 **`src/proxy.ts`** 处理；Next 15 的 **`middleware`** 文件约定在此技术栈中不会转发路由。",
        "تبقى المسارات العامة **`/[categorySlug]/[toolId]`** مثل **`/formatters/html-formatter`** عبر **`src/proxy.ts`**؛ لا تعيد قاعدة **`middleware`** في Next 15 توجيه المسارات بهذه البيئة."
    ],
    "**`/tools/[id]`** still works: the proxy issues a **308** redirect to the canonical category URL for known tools.": [
        "**`/tools/[id]`** भी चलता है: ज्ञात टूल को प्रॉक्सी **308** से कैनॉनिकल श्रेणी URL पर भेजता है।",
        "**`/tools/[id]`** sigue funcionando: el proxy redirige herramientas conocidas con **308** a su URL canónica.",
        "**`/tools/[id]`** fonctionne encore : le proxy redirige en **308** les outils connus vers leur URL canonique.",
        "**`/tools/[id]`** funktioniert weiter: bekannte Tools werden per **308** auf die kanonische Kategorie-URL geleitet.",
        "**`/tools/[id]`**も有効で、登録ツールは**308**で正規カテゴリURLへ転送。",
        "**`/tools/[id]`** 仍可用：代理对已知工具返回 **308** 并重定向至规范分类 URL。",
        "يظل **`/tools/[id]`** صالحا؛ يعيد الوسيط الأدوات المعروفة برمز **308** إلى URL التصنيف المعياري."
    ],
    "Every tool id listed in **`tool-url-table.ts`** was checked with **`next start`**; all **90** canonical URLs returned **HTTP 200** and matching **`/tools/...`** returned **308** as expected.": [
        "**`tool-url-table.ts`** के हर ID को **`next start`** से जाँचा; सभी **90** कैनॉनिकल URL पर **HTTP 200** और मेल खाते **`/tools/...`** पर अपेक्षित **308** मिले।",
        "Comprobado cada ID de **`tool-url-table.ts`** con **`next start`**: las **90** URL canónicas devolvieron **HTTP 200** y sus **`/tools/...`**, **308**.",
        "Tous les ID de **`tool-url-table.ts`** vérifiés avec **`next start`** : **90** URL canoniques en **HTTP 200** et leurs **`/tools/...`** en **308**.",
        "Alle IDs aus **`tool-url-table.ts`** mit **`next start`** geprüft: **90** kanonische URLs lieferten **HTTP 200**, passende **`/tools/...`** erwartete **308**.",
        "**`tool-url-table.ts`**の全IDを**`next start`**で確認。**90**正規URLが**HTTP 200**、対応**`/tools/...`**が想定どおり**308**。",
        "使用 **`next start`** 检查 **`tool-url-table.ts`** 每个 ID；全部 **90** 个规范 URL 返回 **HTTP 200**，对应 **`/tools/...`** 返回预期 **308**。",
        "فحص كل معرف في **`tool-url-table.ts`** باستخدام **`next start`**؛ أعادت **90** URL معيارية **HTTP 200** ومسارات **`/tools/...`** المطابقة **308** كما توقع."
    ],
    "Workshop UX & branding": [
        "वर्कशॉप UX और ब्रांडिंग",
        "UX y marca del espacio de trabajo",
        "UX et identité de l’atelier",
        "Werkstatt-UX und Branding",
        "作業画面のUXとブランド",
        "工作区 UX 与品牌",
        "تجربة العمل والهوية"
    ],
    "Post-landing catalogue, **`AppShell`**, dashboards, tools, Memory, Release notes, and 404 styling use **`workspace.css`** with **`--wb-*`** tokens and **`wb-*`** classes — warm stone neutrals plus emerald / amber accents, separate from **`landing-*`** marketing styles in **`globals.css`**.": [
        "लैंडिंग के बाद कैटलॉग, **`AppShell`**, डैशबोर्ड, टूल, मेमोरी, रिलीज़ नोट और 404, **`workspace.css`** के **`--wb-*`** टोकन व **`wb-*`** क्लास उपयोग करते हैं; गर्म पत्थरीले तटस्थ रंग व हरे/अंबर एक्सेंट, **`globals.css`** की **`landing-*`** मार्केटिंग से अलग।",
        "Catálogo, **`AppShell`**, paneles, herramientas, memoria, notas y 404 usan **`workspace.css`**, tokens **`--wb-*`** y clases **`wb-*`**: neutros cálidos con verde/ámbar, separados de **`landing-*`** en **`globals.css`**.",
        "Catalogue, **`AppShell`**, tableaux de bord, outils, mémoire, notes et 404 utilisent **`workspace.css`**, tokens **`--wb-*`** et classes **`wb-*`** : tons pierre chauds et accents émeraude/ambre, séparés de **`landing-*`** dans **`globals.css`**.",
        "Katalog, **`AppShell`**, Dashboards, Tools, Speicher, Versionshinweise und 404 nutzen **`workspace.css`** mit **`--wb-*`** und **`wb-*`**: warme Steintöne plus Smaragd/Bernstein, getrennt von **`landing-*`** in **`globals.css`**.",
        "紹介後のカタログ・**`AppShell`**・ダッシュボード・ツール・保存管理・更新履歴・404は**`workspace.css`**の**`--wb-*`**と**`wb-*`**を使用。温かな石色に緑・琥珀色を添え、**`globals.css`**の**`landing-*`**と分離。",
        "落地页后的目录、**`AppShell`**、仪表盘、工具、存储、发布说明及 404 使用 **`workspace.css`** 的 **`--wb-*`** 变量和 **`wb-*`** 类；暖石色配翠绿/琥珀，与 **`globals.css`** 的 **`landing-*`** 营销样式分离。",
        "يستخدم الكتالوج و**`AppShell`** واللوحات والأدوات والذاكرة والإصدارات و404 ملف **`workspace.css`** ورموز **`--wb-*`** وأصناف **`wb-*`** بألوان حجرية دافئة وزمردية وكهرمانية، منفصلة عن **`landing-*`** في **`globals.css`**."
    ],
    "Landing page remains a branded scroll experience with hero animations, stats strip, category showcase grid, theme-aware palettes, down to narrow phones.": [
        "लैंडिंग में हीरो एनीमेशन, आँकड़े, श्रेणी ग्रिड, थीम-अनुकूल रंग और छोटे फ़ोन तक ब्रांडेड स्क्रॉल अनुभव बना रहा।",
        "La portada mantiene scroll de marca con animaciones, estadísticas, categorías y paletas por tema hasta móviles estrechos.",
        "L’accueil conserve son défilement de marque avec animations, statistiques, catégories et palettes adaptées au thème, jusqu’aux petits téléphones.",
        "Landingpage bleibt markengeprägtes Scroll-Erlebnis mit Heroanimationen, Statistik, Kategorien und themengerechten Farben bis zu schmalen Handys.",
        "紹介ページはヒーロー演出・統計・カテゴリ一覧・テーマ配色を備え、細いスマホでもブランド感のあるスクロール体験を維持。",
        "落地页保留品牌滚动体验，含主视觉动画、统计栏、分类网格及主题配色，适配窄屏手机。",
        "تبقى صفحة التعريف تجربة تمرير بهوية واضحة وتحريك رئيسي وإحصاءات وفئات وألوان حسب السمة حتى الهواتف الضيقة."
    ],
    "Top-bar version **`1.2`** aligns with **`APP_VERSION`** here; **`/release-notes`** documents this changelog.": [
        "टॉपबार **`1.2`** यहाँ के **`APP_VERSION`** से मेल खाता है; **`/release-notes`** में यह बदलाव इतिहास है।",
        "La versión **`1.2`** coincide con **`APP_VERSION`**; **`/release-notes`** documenta estos cambios.",
        "La version **`1.2`** correspond à **`APP_VERSION`** ; **`/release-notes`** documente ces changements.",
        "Topbarversion **`1.2`** stimmt mit **`APP_VERSION`** überein; **`/release-notes`** beschreibt diese Änderungen.",
        "上部の版**`1.2`**は**`APP_VERSION`**に対応し、**`/release-notes`**に変更を記載。",
        "顶栏版本 **`1.2`** 与此处 **`APP_VERSION`** 一致；**`/release-notes`** 记录这些变更。",
        "إصدار الشريط **`1.2`** يطابق **`APP_VERSION`** هنا؛ يوثق **`/release-notes`** هذه التغييرات."
    ],
    "New productivity tools": [
        "नए उत्पादकता टूल",
        "Nuevas herramientas de productividad",
        "Nouveaux outils de productivité",
        "Neue Produktivitätstools",
        "新しい作業支援ツール",
        "新增效率工具",
        "أدوات إنتاجية جديدة"
    ],
    "**Timer**: presets (1 min–1 hr), custom H:M:S, circular ring, completion chime via Web Audio, Pomodoro-style session label.": [
        "**टाइमर**: प्रीसेट (1 min–1 hr), कस्टम H:M:S, गोल रिंग, Web Audio समाप्ति ध्वनि और Pomodoro जैसा सत्र लेबल।",
        "**Temporizador**: presets (1 min–1 hr), H:M:S personalizado, anillo, sonido Web Audio y etiqueta Pomodoro.",
        "**Minuteur** : préréglages (1 min–1 hr), H:M:S personnalisé, anneau, son Web Audio et étiquette Pomodoro.",
        "**Timer**: Vorlagen (1 min–1 hr), eigene H:M:S, Ringanzeige, Web-Audio-Signal und Pomodoro-Sitzungsname.",
        "**Timer**：プリセット（1 min–1 hr）、H:M:S指定、円形リング、Web Audio完了音、Pomodoro風セッション表示。",
        "**Timer**：预设（1 min–1 hr）、自定义 H:M:S、圆环、Web Audio 完成提示音和 Pomodoro 会话标签。",
        "**المؤقت**: إعدادات (1 min–1 hr) وH:M:S مخصص وحلقة دائرية وتنبيه Web Audio وتسمية جلسة Pomodoro."
    ],
    "**Stopwatch**: 10 ms ticks, laps with best/worst highlights, totals and averages.": [
        "**स्टॉपवॉच**: 10 ms टिक, सबसे अच्छे/खराब लैप हाइलाइट, कुल और औसत।",
        "**Cronómetro**: intervalos de 10 ms, mejores/peores vueltas, totales y medias.",
        "**Chronomètre** : pas de 10 ms, meilleurs/pires tours, totaux et moyennes.",
        "**Stoppuhr**: 10 ms-Takte, beste/schlechteste Runden, Summen und Mittelwerte.",
        "**Stopwatch**：10 ms刻み、最速・最遅ラップ強調、合計・平均。",
        "**秒表**：10 ms 更新、最佳/最差圈高亮、总计和平均。",
        "**ساعة الإيقاف**: تحديثات 10 ms ولفات مع أفضل وأسوأ زمن وإجماليات ومتوسطات."
    ],
    "Reliability & housekeeping": [
        "विश्वसनीयता और रखरखाव",
        "Fiabilidad y mantenimiento",
        "Fiabilité et entretien",
        "Zuverlässigkeit und Wartung",
        "安定性と整理",
        "可靠性与维护",
        "الموثوقية والصيانة"
    ],
    "**QR Generator**: hoist async generator with **`useCallback`** before the syncing effect so callbacks are not invoked before initialization.": [
        "**QR जनरेटर**: असिंक्रोनस जनरेटर को सिंक इफ़ेक्ट से पहले **`useCallback`** में रखा, ताकि इनिशियलाइज़ होने से पहले कॉल न हो।",
        "**Generador QR**: eleva el generador asíncrono con **`useCallback`** antes del efecto de sincronización para evitar llamadas previas a inicializar.",
        "**Générateur QR** : remonte le générateur asynchrone avec **`useCallback`** avant l’effet de synchronisation pour éviter les appels avant initialisation.",
        "**QR-Generator**: Asynchronen Generator mit **`useCallback`** vor den Synceffekt ziehen, damit kein Aufruf vor Initialisierung erfolgt.",
        "**QR生成**：非同期生成関数を**`useCallback`**で同期effectより前に配置し、初期化前の呼び出しを防止。",
        "**QR 生成器**：将异步生成函数通过 **`useCallback`** 提前至同步 effect 前，避免初始化前调用。",
        "**مولد QR**: رفع المولد غير المتزامن باستخدام **`useCallback`** قبل أثر المزامنة لمنع الاستدعاء قبل التهيئة."
    ],
    "**Timestamp Converter**: avoid impure **`Date.now()` / `new Date()`** directly in **`useState` initializers**; seed once in **`useEffect`** after mount.": [
        "**टाइमस्टैम्प कन्वर्टर**: **`useState` इनिशियलाइज़र** में अशुद्ध **`Date.now()` / `new Date()`** से बचें; माउंट के बाद **`useEffect`** में एक बार शुरू करें।",
        "**Conversor temporal**: evita **`Date.now()` / `new Date()`** impuros en **`useState` inicializadores**; inicializa una vez en **`useEffect`** tras montar.",
        "**Convertisseur temporel** : évite **`Date.now()` / `new Date()`** dans **`useState` initialiseurs** ; initialise une fois dans **`useEffect`** après montage.",
        "**Zeitstempelkonverter**: Unreine **`Date.now()` / `new Date()`** in **`useState` Initialisierer** vermeiden; einmal nach Mount in **`useEffect`** setzen.",
        "**時刻変換**：**`useState` 初期化子**内で不純な**`Date.now()` / `new Date()`**を使わず、マウント後の**`useEffect`**で一度初期化。",
        "**时间戳转换器**：避免在 **`useState` 初始化函数** 中直接调用非纯 **`Date.now()` / `new Date()`**；挂载后在 **`useEffect`** 初始化一次。",
        "**محول الطابع الزمني**: تجنب **`Date.now()` / `new Date()`** غير النقية في **`useState` المهيئات**؛ هيئ مرة في **`useEffect`** بعد التركيب."
    ],
    "**URL Parser**: render the literal **`//` authority separator** safely in JSX (**`{ '//' }`**) so the parser doesn’t treat it as a comment.": [
        "**URL पार्सर**: JSX में **अथॉरिटी विभाजक `//`** को **`{ '//' }`** से सुरक्षित दिखाएँ, ताकि पार्सर उसे टिप्पणी न माने।",
        "**Analizador URL**: muestra el separador de autoridad **`//`** en JSX con **`{ '//' }`**, evitando interpretarlo como comentario.",
        "**Analyseur URL** : affiche le séparateur d’autorité **`//`** en JSX via **`{ '//' }`** pour éviter un commentaire.",
        "**URL-Parser**: **`//`** als Autoritätstrenner in JSX sicher mit **`{ '//' }`** ausgeben, damit kein Kommentar entsteht.",
        "**URL解析**：JSX内のauthority区切り**`//`**を**`{ '//' }`**で安全に表示し、コメント解釈を防止。",
        "**URL 解析器**：在 JSX 中用 **`{ '//' }`** 安全渲染字面量 **`//`** authority 分隔符，避免被当作注释。",
        "**محلل URL**: عرض فاصل السلطة **`//`** بأمان في JSX عبر **`{ '//' }`** لمنع اعتباره تعليقا."
    ],
    "**CSV ↔ JSON/XML** & **YAML ↔ JSON**: derive output and parsing errors purely from **`useMemo`** (**no **`setState` inside **`useMemo`**)**, removing subtle render-loop risk.": [
        "**CSV ↔ JSON/XML** और **YAML ↔ JSON**: आउटपुट व त्रुटियाँ शुद्ध **`useMemo`** से निकालें (**`useMemo`** में **`setState`** नहीं), जिससे सूक्ष्म रेंडर-लूप जोखिम हटे।",
        "**CSV ↔ JSON/XML** y **YAML ↔ JSON**: salida y errores puros desde **`useMemo`**, sin **`setState`** dentro de **`useMemo`**, evitando bucles de render.",
        "**CSV ↔ JSON/XML** et **YAML ↔ JSON** : sortie et erreurs dérivées purement de **`useMemo`**, sans **`setState`** dans **`useMemo`**, supprimant le risque de boucle.",
        "**CSV ↔ JSON/XML** und **YAML ↔ JSON**: Ausgabe und Fehler rein in **`useMemo`** ableiten, ohne **`setState`** in **`useMemo`**, um Renderschleifen zu verhindern.",
        "**CSV ↔ JSON/XML**・**YAML ↔ JSON**：出力と解析エラーを**`useMemo`**だけで導出し、**`useMemo`**内の**`setState`**をなくして微妙な再描画ループの危険を除きます。",
        "**CSV ↔ JSON/XML** 与 **YAML ↔ JSON**：通过纯 **`useMemo`** 派生输出和解析错误，不在 **`useMemo`** 中调用 **`setState`**，消除渲染循环风险。",
        "**CSV ↔ JSON/XML** و**YAML ↔ JSON**: اشتقاق المخرجات والأخطاء بنقاء من **`useMemo`** دون **`setState`** داخل **`useMemo`** لإزالة خطر حلقات العرض."
    ],
    "**ESLint**: ignore copied **`public/monaco/**`; relax **`react-hooks/set-state-in-effect`**/**`set-state-in-render`** under **`src`** for established editor-sync patterns; **`no-explicit-any`** and **`no-unescaped-entities`** are warnings until tightened tool-by-tool.": [
        "**ESLint**: कॉपी किया **`public/monaco/**` अनदेखा; पुराने संपादक सिंक पैटर्न हेतु **`src`** में **`react-hooks/set-state-in-effect`**/**`set-state-in-render`** ढीले; **`no-explicit-any`** व **`no-unescaped-entities`** फ़िलहाल चेतावनी, हर टूल में क्रमशः कड़े होंगे।",
        "**ESLint**: ignora **`public/monaco/**`; relaja **`react-hooks/set-state-in-effect`**/**`set-state-in-render`** bajo **`src`** para sincronización; **`no-explicit-any`** y **`no-unescaped-entities`** quedan como avisos hasta endurecer por herramienta.",
        "**ESLint** : ignore **`public/monaco/**` copié ; assouplit **`react-hooks/set-state-in-effect`**/**`set-state-in-render`** sous **`src`** pour les éditeurs ; **`no-explicit-any`** et **`no-unescaped-entities`** restent des avertissements avant durcissement progressif.",
        "**ESLint**: Kopiertes **`public/monaco/**` ignorieren; **`react-hooks/set-state-in-effect`**/**`set-state-in-render`** unter **`src`** für Editorsync lockern; **`no-explicit-any`** und **`no-unescaped-entities`** bleiben bis zur Verschärfung pro Tool Warnungen.",
        "**ESLint**：コピーした**`public/monaco/**`を除外し、既存の編集同期に合わせて**`src`**の**`react-hooks/set-state-in-effect`**/**`set-state-in-render`**を緩和。**`no-explicit-any`**・**`no-unescaped-entities`**は順次厳格化まで警告。",
        "**ESLint**：忽略复制的 **`public/monaco/**`；为既有编辑同步模式放宽 **`src`** 内 **`react-hooks/set-state-in-effect`**/**`set-state-in-render`**；**`no-explicit-any`** 和 **`no-unescaped-entities`** 暂设警告，逐工具收紧。",
        "**ESLint**: تجاهل **`public/monaco/**` المنسوخ وتخفيف **`react-hooks/set-state-in-effect`**/**`set-state-in-render`** داخل **`src`** لأنماط مزامنة المحرر؛ تبقى **`no-explicit-any`** و**`no-unescaped-entities`** تحذيرات حتى تشديدها لكل أداة."
    ],
    "Lint scope is **`src`** only (**`npm run lint`** uses **`eslint src`**).": [
        "लिंट का दायरा केवल **`src`** है (**`npm run lint`** में **`eslint src`**)।",
        "Lint limitado a **`src`** (**`npm run lint`** ejecuta **`eslint src`**).",
        "Lint limité à **`src`** (**`npm run lint`** utilise **`eslint src`**).",
        "Lint nur für **`src`** (**`npm run lint`** nutzt **`eslint src`**).",
        "Lint対象は**`src`**のみ（**`npm run lint`**で**`eslint src`**を実行）。",
        "Lint 范围仅 **`src`**（**`npm run lint`** 使用 **`eslint src`**）。",
        "نطاق الفحص **`src`** فقط؛ يشغل **`npm run lint`** الأمر **`eslint src`**."
    ],
    "Small **`prefer-const`** cleanups (**Certificate Generator**, **Color Picker**, **Cron** iterator, **certificate SAN** parsing helpers).": [
        "छोटे **`prefer-const`** सुधार: प्रमाणपत्र जनरेटर, रंग पिकर, Cron इटरेटर और प्रमाणपत्र SAN पार्सिंग।",
        "Pequeñas mejoras **`prefer-const`** en generador de certificados, colores, iterador Cron y análisis SAN.",
        "Petits nettoyages **`prefer-const`** dans générateur de certificats, couleurs, itérateur Cron et analyse SAN.",
        "Kleine **`prefer-const`**-Bereinigungen in Zertifikatsgenerator, Farbwähler, Cron-Iterator und SAN-Parsern.",
        "証明書生成・色選択・Cron反復・証明書SAN解析の**`prefer-const`**を整理。",
        "对证书生成器、颜色选择器、Cron 迭代器和证书 SAN 解析做小型 **`prefer-const`** 清理。",
        "تنظيفات **`prefer-const`** في مولد الشهادات ومنتقي الألوان ومكرر Cron ومحللات SAN."
    ],
    "Trust, transparency, and a smarter dashboard": [
        "भरोसा, पारदर्शिता और स्मार्ट डैशबोर्ड",
        "Confianza, transparencia y un panel más inteligente",
        "Confiance, transparence et tableau de bord plus intelligent",
        "Vertrauen, Transparenz und intelligenteres Dashboard",
        "信頼・透明性と使いやすいダッシュボード",
        "信任、透明与更智能的仪表盘",
        "ثقة وشفافية ولوحة أذكى"
    ],
    "A polish-and-trust release. The dashboard now opens with a privacy-first overview, the catalog is searchable end-to-end, and several tools picked up real-world fixes. No paid features, no telemetry — same promise, more honest about its limits.": [
        "भरोसे और सुधार की रिलीज़। डैशबोर्ड अब गोपनीयता-प्रथम सारांश से खुलता है, पूरा कैटलॉग खोजने योग्य है और टूल में व्यवहारिक सुधार हैं। न भुगतान सुविधाएँ, न टेलीमेट्री — वही वादा, सीमाएँ अधिक स्पष्ट।",
        "Una versión de pulido y confianza: resumen de privacidad, catálogo totalmente buscable y mejoras prácticas. Sin funciones de pago ni telemetría; la misma promesa con límites más honestos.",
        "Une version de finition et de confiance : aperçu centré sur la vie privée, catalogue entièrement recherchable et corrections pratiques. Ni fonctions payantes ni télémétrie, avec des limites plus honnêtes.",
        "Eine Vertrauens- und Feinschliffversion: Datenschutzüberblick, vollständig durchsuchbarer Katalog und praktische Korrekturen. Keine Bezahlfunktionen, keine Telemetrie – gleiches Versprechen, ehrlichere Grenzen.",
        "信頼と仕上げの更新。プライバシー重視の概要、全件検索、実用上の修正を追加。有料機能・テレメトリーなしという約束を保ち、制約を明確化。",
        "一次优化与信任更新：仪表盘以隐私概览开场，目录全量可搜索，多项工具修复实际问题。无付费功能、无遥测，同样承诺，更诚实说明限制。",
        "إصدار تحسين وثقة: نظرة خصوصية أولا وكتالوج قابل للبحث وإصلاحات عملية. لا ميزات مدفوعة ولا قياس استخدام؛ الوعد نفسه مع توضيح أفضل للحدود."
    ],
    "Dashboard overview & navigation": [
        "डैशबोर्ड सारांश और नेविगेशन",
        "Resumen y navegación del panel",
        "Aperçu et navigation du tableau de bord",
        "Dashboardüberblick und Navigation",
        "ダッシュボード概要と移動",
        "仪表盘概览与导航",
        "نظرة اللوحة والتنقل"
    ],
    "New 'Learn More About This App' panel — default expanded, leads with the security and privacy promise.": [
        "नया 'इस ऐप के बारे में अधिक जानें' पैनल, डिफ़ॉल्ट खुला और सुरक्षा/गोपनीयता वादे से शुरू।",
        "Nuevo panel «Más sobre esta app», abierto por defecto y centrado en seguridad y privacidad.",
        "Nouveau panneau « En savoir plus sur cette app », ouvert par défaut et centré sur sécurité et confidentialité.",
        "Neues standardmäßig geöffnetes „Mehr über diese App“-Panel mit Sicherheits- und Datenschutzversprechen.",
        "「このアプリについて詳しく」パネルを標準で展開し、安全・プライバシーの約束を先に表示。",
        "新增“了解此应用”面板，默认展开，优先展示安全与隐私承诺。",
        "لوحة «اعرف المزيد عن التطبيق» جديدة مفتوحة افتراضيا وتبدأ بوعد الأمان والخصوصية."
    ],
    "Full categorized catalog inside the panel: every section listed with every tool and a short description.": [
        "पैनल में पूरा श्रेणीबद्ध कैटलॉग: हर सेक्शन, हर टूल और छोटा विवरण।",
        "Catálogo completo por categorías en el panel: cada sección, herramienta y descripción breve.",
        "Catalogue complet par catégories dans le panneau : chaque section, outil et brève description.",
        "Vollständiger kategorisierter Katalog im Panel mit allen Abschnitten, Tools und Kurzbeschreibungen.",
        "パネル内に全カテゴリ・全ツール・短い説明を一覧掲載。",
        "面板内完整分类目录：列出每个分区、工具和简短描述。",
        "كتالوج كامل مصنف داخل اللوحة بكل أقسامه وأدواته ووصف موجز."
    ],
    "Removed the matrix-style scramble tagline so the privacy message reads in a single scan.": [
        "मैट्रिक्स जैसा स्क्रैम्बल टैगलाइन हटाया, ताकि गोपनीयता संदेश एक नज़र में समझ आए।",
        "Eliminado el eslogan tipo Matrix para entender la privacidad de un vistazo.",
        "Suppression du slogan brouillé façon Matrix pour lire la promesse de confidentialité d’un coup d’œil.",
        "Matrix-artigen Scramble-Slogan entfernt, damit die Datenschutzbotschaft sofort lesbar ist.",
        "Matrix風の文字スクランブルを除き、プライバシーの説明を一目で読める形へ。",
        "移除 Matrix 式乱码标语，让隐私信息一眼可读。",
        "أزيل الشعار المتقلب بأسلوب Matrix لتقرأ رسالة الخصوصية بنظرة واحدة."
    ],
    "Version badge added to the topbar; clicking the Memory icon stays one click away.": [
        "टॉपबार में संस्करण बैज; मेमोरी आइकन एक क्लिक दूर।",
        "Versión en la barra superior y memoria a un clic.",
        "Badge de version en haut et mémoire à un clic.",
        "Versionsabzeichen in der Kopfzeile; Speicher bleibt einen Klick entfernt.",
        "上部に版バッジを追加し、保存管理はアイコンから1クリック。",
        "顶栏新增版本徽章，存储图标仍一键可达。",
        "أضيفت شارة إصدار للشريط وتبقى الذاكرة بنقرة واحدة."
    ],
    "This Release Notes panel itself — collapsible, sorted newest first, color-coded by change kind.": [
        "यह रिलीज़ नोट पैनल: समेटने योग्य, नए से पुराने क्रम और बदलाव प्रकार के रंग।",
        "Este panel de versiones: plegable, más recientes primero y colores por tipo de cambio.",
        "Ce panneau de versions : repliable, plus récentes d’abord et couleurs par type de changement.",
        "Dieses Versionspanel: einklappbar, neueste zuerst und farblich nach Änderungsart.",
        "この更新履歴パネルを折りたたみ対応・新しい順・変更種別ごとの色分けで表示。",
        "此发布说明面板可折叠、按最新排序，并按变更类型配色。",
        "لوحة الإصدارات هذه قابلة للطي والأحدث أولا وبألوان حسب نوع التغيير."
    ],
    "Privacy & security hardening": [
        "गोपनीयता और सुरक्षा सुदृढ़ीकरण",
        "Refuerzo de privacidad y seguridad",
        "Renforcement de la confidentialité et sécurité",
        "Datenschutz und Sicherheit gehärtet",
        "プライバシー・安全性の強化",
        "隐私与安全加固",
        "تعزيز الخصوصية والأمان"
    ],
    "Removed every third-party runtime request — no Google Fonts CDN, no analytics, no telemetry, no external scripts.": [
        "हर तृतीय-पक्ष रनटाइम अनुरोध हटाया: न Google Fonts CDN, एनालिटिक्स, टेलीमेट्री या बाहरी स्क्रिप्ट।",
        "Eliminadas todas las solicitudes externas en ejecución: sin Google Fonts CDN, analítica, telemetría ni scripts externos.",
        "Suppression des requêtes tierces à l’exécution : ni Google Fonts CDN, ni analyse, télémétrie ou scripts externes.",
        "Alle Drittanbieteranfragen zur Laufzeit entfernt: kein Google Fonts CDN, keine Analyse, Telemetrie oder externen Skripte.",
        "実行時の外部要求をすべて除去。Google Fonts CDN・分析・テレメトリー・外部スクリプトなし。",
        "移除所有运行时第三方请求：无 Google Fonts CDN、分析、遥测或外部脚本。",
        "أزيلت كل طلبات الأطراف الخارجية أثناء التشغيل؛ لا Google Fonts CDN ولا تحليلات أو قياس أو نصوص خارجية."
    ],
    "Replaced the crt.sh CT log search with a local live-server certificate inspection over a direct TLS socket. Domain names you inspect never go to a third party.": [
        "crt.sh CT लॉग खोज को सीधे TLS सॉकेट से स्थानीय लाइव-सर्वर प्रमाणपत्र निरीक्षण ने बदला। जाँचे डोमेन तृतीय पक्ष को नहीं जाते।",
        "Sustituida la búsqueda CT de crt.sh por inspección del certificado mediante socket TLS directo. Los dominios no se envían a terceros.",
        "Recherche CT crt.sh remplacée par inspection du certificat serveur via socket TLS direct. Les domaines ne sont pas transmis à un tiers.",
        "crt.sh-CT-Suche durch lokale Live-Zertifikatsprüfung über direkten TLS-Socket ersetzt. Geprüfte Domains gehen nicht an Dritte.",
        "crt.shのCT検索を直接TLSソケットでの証明書確認へ置き換え。対象ドメインを第三者へ送信しません。",
        "将 crt.sh CT 日志搜索替换为通过直接 TLS 套接字进行本地实时服务器证书检查，所查域名不发送第三方。",
        "استبدل بحث سجلات crt.sh بفحص شهادة الخادم المباشر عبر مقبس TLS مباشر؛ لا ترسل أسماء النطاقات لطرف ثالث."
    ],
    "Added a same-origin CORS proxy so the API Request Builder can hit any endpoint without leaking the referrer to a third party.": [
        "समान-मूल CORS प्रॉक्सी जोड़ा, ताकि API अनुरोध बिल्डर बिना तृतीय पक्ष रेफ़रर लीक किसी एंडपॉइंट को अनुरोध भेज सके।",
        "Añadido proxy CORS del mismo origen para acceder a endpoints sin filtrar el referente a terceros.",
        "Proxy CORS de même origine ajouté pour atteindre les endpoints sans divulguer le référent à un tiers.",
        "Same-Origin-CORS-Proxy ergänzt, damit der API-Builder Endpunkte ohne Referrer-Leck an Dritte erreicht.",
        "同一オリジンCORSプロキシを追加し、API要求先へ第三者にリファラーを漏らさずアクセス。",
        "添加同源 CORS 代理，使 API 请求构建器访问任意端点时不向第三方泄露来源。",
        "أضيف وسيط CORS من الأصل نفسه ليصل منشئ API لأي نقطة دون تسريب المرجع لطرف ثالث."
    ],
    "Honest in-browser certificate-generation messaging: Web Crypto cannot emit a valid X.509 cert, so the self-signed tab now warns and points to the matching OpenSSL command instead of claiming success.": [
        "ब्राउज़र प्रमाणपत्र निर्माण की स्पष्ट सूचना: Web Crypto मान्य X.509 नहीं निकाल सकता, इसलिए स्वहस्ताक्षरित टैब सफलता की जगह चेतावनी और संबंधित OpenSSL कमांड दिखाता है।",
        "Mensaje honesto: Web Crypto no emite X.509 válido; la pestaña autofirmada avisa y ofrece OpenSSL en lugar de afirmar éxito.",
        "Message honnête : Web Crypto ne produit pas de X.509 valide ; l’onglet autosigné avertit et propose OpenSSL au lieu d’annoncer un succès.",
        "Ehrlicher Hinweis: Web Crypto erzeugt kein gültiges X.509-Zertifikat; der Selbstsignierungsreiter warnt und zeigt den passenden OpenSSL-Befehl statt Erfolg.",
        "ブラウザー証明書生成の説明を明確化。Web Cryptoでは有効なX.509を直接出力できないため、自己署名タブは成功表示でなく警告とOpenSSLコマンドを案内。",
        "如实说明浏览器证书生成：Web Crypto 无法输出有效 X.509 证书，自签名页签改为提示警告和对应 OpenSSL 命令，而非宣称成功。",
        "توضيح صادق لإنشاء الشهادات: لا يصدر Web Crypto شهادة X.509 صالحة؛ يحذر تبويب التوقيع الذاتي ويعرض أمر OpenSSL بدلا من إعلان النجاح."
    ],
    "Open source on GitHub — every privacy claim is independently auditable.": [
        "GitHub पर ओपन सोर्स; हर गोपनीयता दावा स्वतंत्र रूप से जाँचने योग्य।",
        "Código abierto en GitHub; cada afirmación de privacidad es auditable.",
        "Open source sur GitHub ; chaque promesse de confidentialité est vérifiable.",
        "Open Source auf GitHub; jede Datenschutzbehauptung ist unabhängig prüfbar.",
        "GitHubでソース公開。プライバシーの主張を独立に検証可能。",
        "GitHub 开源，每项隐私声明均可独立审计。",
        "المصدر مفتوح على GitHub وكل ادعاء خصوصية قابل للتدقيق المستقل."
    ],
    "New & improved tools": [
        "नए और सुधरे टूल",
        "Herramientas nuevas y mejoradas",
        "Outils nouveaux et améliorés",
        "Neue und verbesserte Tools",
        "新規・改善ツール",
        "新增与改进工具",
        "أدوات جديدة ومحسنة"
    ],
    "Certificate suite consolidated: 10 separate cert tools merged into 4 cohesive ones (Inspector, Chain & SSL, Generator, PKCS#12).": [
        "प्रमाणपत्र सूट एकीकृत: 10 अलग टूल 4 सुसंगत टूल में — इंस्पेक्टर, चेन व SSL, जनरेटर, PKCS#12।",
        "Suite consolidada: 10 herramientas en 4: inspector, cadena/SSL, generador y PKCS#12.",
        "Suite consolidée : 10 outils en 4 ensembles, inspecteur, chaîne/SSL, générateur et PKCS#12.",
        "Zertifikatsuite konsolidiert: 10 Tools zu 4 – Inspektor, Kette/SSL, Generator und PKCS#12.",
        "証明書の10ツールを確認・チェーン/SSL・生成・PKCS#12の4ツールへ統合。",
        "证书套件整合：10 个独立工具合并为 4 个，分别是检查器、证书链/SSL、生成器、PKCS#12。",
        "وحدت مجموعة الشهادات: دمج 10 أدوات في 4، الفاحص والسلسلة/SSL والمولد وPKCS#12."
    ],
    "Fixed CSR generation for ECDSA and Ed25519 — signatures now verify correctly with OpenSSL.": [
        "ECDSA और Ed25519 CSR निर्माण सुधरा; हस्ताक्षर अब OpenSSL से सही सत्यापित होते हैं।",
        "Corregidos CSR ECDSA y Ed25519; firmas verifican correctamente con OpenSSL.",
        "CSR ECDSA et Ed25519 corrigés ; signatures vérifiées correctement avec OpenSSL.",
        "CSR-Erzeugung für ECDSA und Ed25519 korrigiert; Signaturen werden mit OpenSSL richtig geprüft.",
        "ECDSA・Ed25519のCSR生成を修正し、OpenSSLによる署名検証に対応。",
        "修复 ECDSA 和 Ed25519 CSR 生成，签名现在可由 OpenSSL 正确验证。",
        "أصلح إنشاء CSR لـ ECDSA وEd25519؛ تتحقق التوقيعات الآن بشكل صحيح عبر OpenSSL."
    ],
    "URL fetch lets you inspect any live server's certificate chain directly from the browser.": [
        "URL फ़ेच से किसी लाइव सर्वर की प्रमाणपत्र श्रृंखला ब्राउज़र से सीधे जाँचें।",
        "Obtén por URL la cadena de certificados de un servidor en vivo desde el navegador.",
        "Chargez par URL la chaîne de certificats d’un serveur en direct depuis le navigateur.",
        "Zertifikatsketten beliebiger Liveserver per URL direkt aus dem Browser prüfen.",
        "URL取得で稼働中サーバーの証明書チェーンをブラウザーから直接確認。",
        "通过 URL 获取，可直接从浏览器检查任意实时服务器证书链。",
        "يتيح الجلب عبر URL فحص سلسلة شهادة أي خادم مباشر من المتصفح."
    ],
    "Expanded Learn-More copy across URL Parser, Swagger Viewer, JSONPath Tester, WSDL Parser, IP Address Tools, and MAC Address Tools — with RFC references and real-world examples.": [
        "URL पार्सर, Swagger व्यूअर, JSONPath टेस्टर, WSDL पार्सर, IP और MAC टूल में RFC संदर्भ व व्यवहारिक उदाहरण सहित विस्तृत मार्गदर्शन।",
        "Ampliada la ayuda de URL, Swagger, JSONPath, WSDL, IP y MAC con RFC y ejemplos reales.",
        "Aide enrichie pour URL, Swagger, JSONPath, WSDL, IP et MAC avec RFC et exemples pratiques.",
        "Hilfe für URL-Parser, Swagger, JSONPath, WSDL, IP und MAC um RFCs und Praxisbeispiele erweitert.",
        "URL・Swagger・JSONPath・WSDL・IP・MACの解説をRFCや実用例付きで拡充。",
        "扩充 URL 解析器、Swagger、JSONPath、WSDL、IP、MAC 工具的帮助，加入 RFC 引用和实际示例。",
        "وسعت المساعدة في URL وSwagger وJSONPath وWSDL وIP وMAC بمراجع RFC وأمثلة عملية."
    ],
    "PWA, mobile, and discoverability": [
        "PWA, मोबाइल और खोज में उपलब्धता",
        "PWA, móvil y descubrimiento",
        "PWA, mobile et visibilité",
        "PWA, Mobilgeräte und Auffindbarkeit",
        "PWA・モバイル・見つけやすさ",
        "PWA、移动端与可发现性",
        "PWA والهواتف وقابلية الاكتشاف"
    ],
    "Installable as a Progressive Web App with full offline support for every tool.": [
        "Progressive Web App के रूप में इंस्टॉल, हर टूल का पूरा ऑफ़लाइन समर्थन।",
        "Instalable como Progressive Web App con soporte offline completo para cada herramienta.",
        "Installable en Progressive Web App, avec prise en charge hors ligne complète de chaque outil.",
        "Als Progressive Web App installierbar, mit voller Offlineunterstützung aller Tools.",
        "Progressive Web Appとしてインストールでき、全ツールを完全オフライン対応。",
        "可安装为 Progressive Web App，每个工具均完全支持离线。",
        "قابل للتثبيت كتطبيق Progressive Web App مع دعم كامل دون اتصال لكل أداة."
    ],
    "Every tool page is mobile-responsive end-to-end; footer padding scales with clamp() so sub-360px phones aren't cramped.": [
        "हर पृष्ठ पूरा मोबाइल-अनुकूल; clamp() से फ़ुटर पैडिंग बदलती है, ताकि sub-360px फ़ोन तंग न लगें।",
        "Todas las páginas se adaptan al móvil; el padding del pie usa clamp() para pantallas sub-360px.",
        "Toutes les pages s’adaptent au mobile ; marge du pied via clamp() pour les écrans sub-360px.",
        "Alle Toolseiten mobil angepasst; Footerabstand skaliert mit clamp() für sub-360px-Telefone.",
        "全ツールをモバイル対応し、clamp()で余白を調整してsub-360px画面の窮屈さを軽減。",
        "所有工具页适配移动端；页脚内边距随 clamp() 缩放，避免 sub-360px 手机拥挤。",
        "كل صفحات الأدوات متجاوبة؛ يتدرج حشو التذييل بـ clamp() لتناسب هواتف sub-360px."
    ],
    "Cmd/Ctrl-K opens a global command palette that jumps to any tool with keyboard navigation.": [
        "Cmd/Ctrl-K से वैश्विक कमांड पैलेट खुले, कीबोर्ड से किसी टूल पर जाएँ।",
        "Cmd/Ctrl-K abre una paleta global para ir a cualquier herramienta con teclado.",
        "Cmd/Ctrl-K ouvre une palette globale pour accéder aux outils au clavier.",
        "Cmd/Ctrl-K öffnet die globale Befehlspalette für Toolnavigation per Tastatur.",
        "Cmd/Ctrl-Kで共通コマンドパレットを開き、キーボードでツールへ移動。",
        "Cmd/Ctrl-K 打开全局命令面板，通过键盘跳转任意工具。",
        "يفتح Cmd/Ctrl-K لوحة أوامر عامة للتنقل لأي أداة بلوحة المفاتيح."
    ],
    "Header search is keyboard-navigable with category grouping in the dropdown.": [
        "हेडर खोज में कीबोर्ड नेविगेशन और ड्रॉपडाउन में श्रेणी समूह।",
        "Búsqueda superior navegable por teclado con categorías en el desplegable.",
        "Recherche d’en-tête au clavier et catégories dans la liste.",
        "Kopfleisten-Suche per Tastatur mit Kategorien im Dropdown.",
        "ヘッダー検索をキーボード操作でき、候補をカテゴリ別に表示。",
        "顶部搜索支持键盘导航，下拉列表按类别分组。",
        "بحث الرأس يدعم لوحة المفاتيح مع تجميع الفئات في القائمة."
    ],
    "Storage & memory management page so you can see and clear what's persisted locally.": [
        "स्थानीय रूप से सहेजा डेटा देखने और साफ़ करने का संग्रहण/मेमोरी पृष्ठ।",
        "Página de almacenamiento y memoria para ver y borrar datos locales.",
        "Page stockage et mémoire pour voir et effacer les données locales.",
        "Speicherverwaltungsseite zum Anzeigen und Löschen lokal gespeicherter Daten.",
        "端末に保存した内容を確認・消去する保存管理ページ。",
        "存储与内存管理页，可查看并清理本地持久数据。",
        "صفحة تخزين وذاكرة لعرض البيانات المحلية ومسحها."
    ],
    "Certificate Validator URL layout cleaned up on small screens.": [
        "छोटी स्क्रीन पर प्रमाणपत्र सत्यापक का URL लेआउट सुधरा।",
        "Mejorado el campo URL del validador de certificados en pantallas pequeñas.",
        "Disposition URL du validateur de certificats améliorée sur petit écran.",
        "URL-Anordnung im Zertifikatsprüfer auf kleinen Displays bereinigt.",
        "小画面での証明書検証URL欄の配置を改善。",
        "优化小屏证书验证器 URL 布局。",
        "حسن تخطيط URL في مدقق الشهادات على الشاشات الصغيرة."
    ],
    "Initial public release": [
        "प्रारंभिक सार्वजनिक रिलीज़",
        "Primera versión pública",
        "Première version publique",
        "Erste öffentliche Version",
        "初回公開版",
        "首次公开发布",
        "الإصدار العام الأول"
    ],
    "First public edition of My Dev Tools — a private, offline-capable workshop of developer utilities that runs entirely in your browser. No accounts, no uploads, no tracking.": [
        "My Dev Tools का पहला सार्वजनिक संस्करण — निजी, ऑफ़लाइन-सक्षम डेवलपर वर्कशॉप, पूरा ब्राउज़र में। न खाते, अपलोड या ट्रैकिंग।",
        "Primera edición pública de My Dev Tools: taller privado y offline de utilidades en el navegador. Sin cuentas, subidas ni rastreo.",
        "Première édition publique de My Dev Tools : atelier privé et hors ligne dans le navigateur. Sans compte, envoi ni suivi.",
        "Erste öffentliche Ausgabe von My Dev Tools: private, offlinefähige Browserwerkstatt. Keine Konten, Uploads oder Verfolgung.",
        "My Dev Tools初の公開版。ブラウザーで動くプライベートなオフライン対応ツール集。アカウント・アップロード・追跡なし。",
        "My Dev Tools 首个公开版本：私密、可离线的开发工具集，完全在浏览器运行，无账户、上传或跟踪。",
        "أول نسخة عامة من My Dev Tools: ورشة أدوات خاصة تدعم العمل دون اتصال في المتصفح، بلا حسابات أو رفع أو تتبع."
    ],
    "Formatting, validation & diff": [
        "फ़ॉर्मैटिंग, सत्यापन और अंतर",
        "Formato, validación y diferencias",
        "Formatage, validation et différences",
        "Formatierung, Validierung und Unterschiede",
        "整形・検証・差分",
        "格式化、验证与比较",
        "تنسيق وتحقق وفروق"
    ],
    "Formatters for JSON, XML, YAML, HTML, CSS, JavaScript, and SQL with prettify and minify modes.": [
        "JSON, XML, YAML, HTML, CSS, JavaScript और SQL फ़ॉर्मैटर, सुंदर और मिनिफ़ाई मोड सहित।",
        "Formateadores JSON, XML, YAML, HTML, CSS, JavaScript y SQL con modo legible y minificado.",
        "Formateurs JSON, XML, YAML, HTML, CSS, JavaScript et SQL avec embellissement et minification.",
        "Formatierer für JSON, XML, YAML, HTML, CSS, JavaScript und SQL mit Verschönerung und Minimierung.",
        "JSON・XML・YAML・HTML・CSS・JavaScript・SQLの整形・圧縮に対応。",
        "JSON、XML、YAML、HTML、CSS、JavaScript、SQL 格式化器，支持美化和压缩。",
        "منسقات JSON وXML وYAML وHTML وCSS وJavaScript وSQL بوضع التجميل والتصغير."
    ],
    "Validators for JSON, XML, HTML, XSD schema, email addresses, and credit-card numbers (Luhn).": [
        "JSON, XML, HTML, XSD स्कीमा, ईमेल और कार्ड नंबर (Luhn) सत्यापक।",
        "Validadores JSON, XML, HTML, XSD, email y tarjetas (Luhn).",
        "Validateurs JSON, XML, HTML, XSD, emails et cartes (Luhn).",
        "Prüfer für JSON, XML, HTML, XSD, E-Mails und Kartennummern (Luhn).",
        "JSON・XML・HTML・XSD・メール・カード番号（Luhn）を検証。",
        "JSON、XML、HTML、XSD 模式、邮箱和信用卡号（Luhn）验证器。",
        "مدققات JSON وXML وHTML ومخططات XSD والبريد وأرقام البطاقات (Luhn)."
    ],
    "Side-by-side diff for JSON, XML, and arbitrary text.": [
        "JSON, XML और किसी भी टेक्स्ट का साथ-साथ अंतर।",
        "Comparación en paralelo de JSON, XML y cualquier texto.",
        "Comparaison côte à côte de JSON, XML et de tout texte.",
        "Nebeneinandervergleich für JSON, XML und beliebigen Text.",
        "JSON・XML・任意テキストを並べて比較。",
        "并排比较 JSON、XML 和任意文本。",
        "مقارنة جنبا إلى جنب لـ JSON وXML وأي نص."
    ],
    "Data conversion": [
        "डेटा परिवर्तन",
        "Conversión de datos",
        "Conversion de données",
        "Datenumwandlung",
        "データ変換",
        "数据转换",
        "تحويل البيانات"
    ],
    "Bidirectional XML ↔ JSON, YAML ↔ JSON, CSV ↔ JSON, and CSV ↔ XML converters.": [
        "XML ↔ JSON, YAML ↔ JSON, CSV ↔ JSON और CSV ↔ XML के द्विदिश कन्वर्टर।",
        "Conversores bidireccionales XML ↔ JSON, YAML ↔ JSON, CSV ↔ JSON y CSV ↔ XML.",
        "Convertisseurs bidirectionnels XML ↔ JSON, YAML ↔ JSON, CSV ↔ JSON et CSV ↔ XML.",
        "Bidirektionale Konverter für XML ↔ JSON, YAML ↔ JSON, CSV ↔ JSON und CSV ↔ XML.",
        "XML ↔ JSON・YAML ↔ JSON・CSV ↔ JSON・CSV ↔ XMLの双方向変換。",
        "XML ↔ JSON、YAML ↔ JSON、CSV ↔ JSON、CSV ↔ XML 双向转换器。",
        "محولات ثنائية الاتجاه XML ↔ JSON وYAML ↔ JSON وCSV ↔ JSON وCSV ↔ XML."
    ],
    "JSON to TypeScript and Java POJO code generators.": [
        "JSON से TypeScript और Java POJO कोड जनरेटर।",
        "Generadores JSON a TypeScript y Java POJO.",
        "Générateurs JSON vers TypeScript et Java POJO.",
        "Codegeneratoren von JSON zu TypeScript und Java POJO.",
        "JSONからTypeScript・Java POJOを生成。",
        "JSON 转 TypeScript 和 Java POJO 代码生成器。",
        "مولدات شفرة من JSON إلى TypeScript وJava POJO."
    ],
    "XSLT transformer with live preview.": [
        "लाइव प्रीव्यू वाला XSLT ट्रांसफ़ॉर्मर।",
        "Transformador XSLT con vista previa en vivo.",
        "Transformateur XSLT avec aperçu en direct.",
        "XSLT-Transformator mit Livevorschau.",
        "リアルタイム表示付きXSLT変換。",
        "带实时预览的 XSLT 转换器。",
        "محول XSLT بمعاينة مباشرة."
    ],
    "Encoding & cryptography": [
        "एन्कोडिंग और क्रिप्टोग्राफ़ी",
        "Codificación y criptografía",
        "Encodage et cryptographie",
        "Kodierung und Kryptografie",
        "符号化・暗号",
        "编码与密码学",
        "الترميز والتشفير"
    ],
    "Base64, URL, HTML entities, Unicode, Hex, and Gzip encoders/decoders.": [
        "Base64, URL, HTML एंटिटी, Unicode, Hex और Gzip एन्कोडर/डिकोडर।",
        "Codificadores/decodificadores Base64, URL, entidades HTML, Unicode, Hex y Gzip.",
        "Encodeurs/décodeurs Base64, URL, entités HTML, Unicode, Hex et Gzip.",
        "Kodierer/Dekodierer für Base64, URL, HTML-Entitäten, Unicode, Hex und Gzip.",
        "Base64・URL・HTML文字参照・Unicode・Hex・Gzipのエンコード・デコード。",
        "Base64、URL、HTML 实体、Unicode、Hex、Gzip 编解码器。",
        "ترميز وفك Base64 وURL وكيانات HTML وUnicode وHex وGzip."
    ],
    "Hash generation: MD5, SHA-1/224/256/384/512, SHA-3, RIPEMD-160; HMAC; BCrypt with verify.": [
        "हैश: MD5, SHA-1/224/256/384/512, SHA-3, RIPEMD-160; HMAC; सत्यापन सहित BCrypt।",
        "Hashes MD5, SHA-1/224/256/384/512, SHA-3 y RIPEMD-160; HMAC y BCrypt con verificación.",
        "Hachages MD5, SHA-1/224/256/384/512, SHA-3 et RIPEMD-160 ; HMAC ; BCrypt avec vérification.",
        "Hashes MD5, SHA-1/224/256/384/512, SHA-3 und RIPEMD-160; HMAC; BCrypt mit Prüfung.",
        "MD5・SHA-1/224/256/384/512・SHA-3・RIPEMD-160、HMAC、検証付きBCrypt。",
        "哈希生成：MD5、SHA-1/224/256/384/512、SHA-3、RIPEMD-160；HMAC；BCrypt 及验证。",
        "تجزئات MD5 وSHA-1/224/256/384/512 وSHA-3 وRIPEMD-160؛ وHMAC وBCrypt مع التحقق."
    ],
    "Full JOSE suite: JWT decoder, JWS sign/verify, JWE encrypt/decrypt, JWK generator.": [
        "पूरा JOSE सूट: JWT डिकोडर, JWS हस्ताक्षर/सत्यापन, JWE एन्क्रिप्ट/डिक्रिप्ट, JWK जनरेटर।",
        "Suite JOSE: decodificador JWT, firma/verificación JWS, cifrado/descifrado JWE y generador JWK.",
        "Suite JOSE : décodeur JWT, signature/vérification JWS, chiffrement/déchiffrement JWE et générateur JWK.",
        "JOSE-Suite: JWT-Dekodierer, JWS-Signierung/Prüfung, JWE-Ver-/Entschlüsselung und JWK-Generator.",
        "JWTデコード・JWS署名検証・JWE暗号復号・JWK生成のJOSE一式。",
        "完整 JOSE 套件：JWT 解码、JWS 签名/验证、JWE 加解密、JWK 生成。",
        "مجموعة JOSE كاملة: فك JWT وتوقيع/تحقق JWS وتشفير/فك JWE ومولد JWK."
    ],
    "AES encrypt/decrypt with passphrase or key.": [
        "पासफ़्रेज़ या कुंजी से AES एन्क्रिप्ट/डिक्रिप्ट।",
        "Cifrado/descifrado AES con frase o clave.",
        "Chiffrement/déchiffrement AES par phrase secrète ou clé.",
        "AES-Ver-/Entschlüsselung mit Passphrase oder Schlüssel.",
        "パスフレーズ・鍵によるAES暗号化・復号。",
        "使用口令或密钥进行 AES 加解密。",
        "تشفير وفك AES بعبارة مرور أو مفتاح."
    ],
    "Certificates, keys & SSH": [
        "प्रमाणपत्र, कुंजियाँ और SSH",
        "Certificados, claves y SSH",
        "Certificats, clés et SSH",
        "Zertifikate, Schlüssel und SSH",
        "証明書・鍵・SSH",
        "证书、密钥与 SSH",
        "شهادات ومفاتيح وSSH"
    ],
    "X.509 certificate inspection (PEM/DER), fingerprinting, format conversion, and PEM-bundle parsing.": [
        "X.509 प्रमाणपत्र निरीक्षण (PEM/DER), फ़िंगरप्रिंट, प्रारूप परिवर्तन और PEM बंडल पार्सिंग।",
        "Inspección X.509 (PEM/DER), huellas, conversión y análisis de paquetes PEM.",
        "Inspection X.509 (PEM/DER), empreintes, conversion et analyse de lots PEM.",
        "X.509-Prüfung (PEM/DER), Fingerabdrücke, Formatkonvertierung und PEM-Bündelparsing.",
        "X.509（PEM/DER）の確認・指紋計算・形式変換・PEM束解析。",
        "X.509 证书检查（PEM/DER）、指纹、格式转换和 PEM 包解析。",
        "فحص X.509 (PEM/DER) والبصمات وتحويل الصيغ وتحليل حزم PEM."
    ],
    "Self-signed certificate and CSR generation with RSA/ECDSA keys.": [
        "RSA/ECDSA कुंजी से स्वहस्ताक्षरित प्रमाणपत्र और CSR बनाएँ।",
        "Certificados autofirmados y CSR con RSA/ECDSA.",
        "Certificats autosignés et CSR avec RSA/ECDSA.",
        "Selbstsignierte Zertifikate und CSR mit RSA/ECDSA.",
        "RSA/ECDSAによる自己署名証明書とCSR生成。",
        "使用 RSA/ECDSA 密钥生成自签名证书和 CSR。",
        "إنشاء شهادات ذاتية التوقيع وCSR بمفاتيح RSA/ECDSA."
    ],
    "PKCS#12 (.pfx) and Java KeyStore (.jks) tooling.": [
        "PKCS#12 (.pfx) और Java KeyStore (.jks) टूल।",
        "Herramientas PKCS#12 (.pfx) y Java KeyStore (.jks).",
        "Outils PKCS#12 (.pfx) et Java KeyStore (.jks).",
        "Tools für PKCS#12 (.pfx) und Java KeyStore (.jks).",
        "PKCS#12（.pfx）・Java KeyStore（.jks）ツール。",
        "PKCS#12（.pfx）与 Java KeyStore（.jks）工具。",
        "أدوات PKCS#12 (.pfx) وJava KeyStore (.jks)."
    ],
    "RSA, ECDSA, and Ed25519 key-pair generation; SSH key generation with optional passphrase.": [
        "RSA, ECDSA, Ed25519 कुंजी युग्म; वैकल्पिक पासफ़्रेज़ सहित SSH कुंजी निर्माण।",
        "Pares RSA, ECDSA y Ed25519; claves SSH con frase opcional.",
        "Paires RSA, ECDSA et Ed25519 ; clés SSH avec phrase secrète facultative.",
        "RSA-, ECDSA- und Ed25519-Schlüsselpaare; SSH-Schlüssel mit optionaler Passphrase.",
        "RSA・ECDSA・Ed25519鍵ペア、任意パスフレーズ付きSSH鍵生成。",
        "RSA、ECDSA、Ed25519 密钥对生成；SSH 密钥支持可选口令。",
        "أزواج مفاتيح RSA وECDSA وEd25519؛ ومفاتيح SSH بعبارة مرور اختيارية."
    ],
    "API, web services & network": [
        "API, वेब सेवा और नेटवर्क",
        "API, servicios web y red",
        "API, services web et réseau",
        "API, Webdienste und Netzwerk",
        "API・ウェブサービス・ネットワーク",
        "API、Web 服务与网络",
        "API وخدمات الويب والشبكات"
    ],
    "REST API request builder with auth, headers, body, history, and cURL export.": [
        "प्रमाणीकरण, हेडर, बॉडी, इतिहास और cURL निर्यात वाला REST API अनुरोध बिल्डर।",
        "Constructor REST con autenticación, cabeceras, cuerpo, historial y exportación cURL.",
        "Constructeur REST avec authentification, en-têtes, corps, historique et export cURL.",
        "REST-Anfragebuilder mit Authentifizierung, Headern, Text, Verlauf und cURL-Export.",
        "認証・ヘッダー・本文・履歴・cURL出力付きREST要求作成。",
        "REST API 请求构建器，含认证、头部、正文、历史和 cURL 导出。",
        "منشئ طلبات REST بالمصادقة والرؤوس والجسم والسجل وتصدير cURL."
    ],
    "Swagger / OpenAPI viewer; SOAP client and WSDL parser; JSONPath and XPath testers.": [
        "Swagger / OpenAPI व्यूअर; SOAP क्लाइंट और WSDL पार्सर; JSONPath तथा XPath टेस्टर।",
        "Visor Swagger / OpenAPI, cliente SOAP, analizador WSDL y pruebas JSONPath/XPath.",
        "Visionneuse Swagger / OpenAPI, client SOAP, analyseur WSDL et tests JSONPath/XPath.",
        "Swagger-/OpenAPI-Anzeige, SOAP-Client, WSDL-Parser sowie JSONPath- und XPath-Tester.",
        "Swagger / OpenAPI表示、SOAPクライアント、WSDL解析、JSONPath・XPathテスト。",
        "Swagger / OpenAPI 查看器；SOAP 客户端、WSDL 解析器；JSONPath 和 XPath 测试器。",
        "عارض Swagger / OpenAPI وعميل SOAP ومحلل WSDL وفاحصا JSONPath وXPath."
    ],
    "URL parser; IP address tools (IPv4/IPv6); subnet calculator; MAC address lookup.": [
        "URL पार्सर; IP पते (IPv4/IPv6); सबनेट कैलकुलेटर; MAC खोज।",
        "Analizador URL, IP (IPv4/IPv6), calculadora de subred y consulta MAC.",
        "Analyseur URL, IP (IPv4/IPv6), calculateur de sous-réseau et recherche MAC.",
        "URL-Parser, IP-Tools (IPv4/IPv6), Subnetzrechner und MAC-Suche.",
        "URL解析・IP（IPv4/IPv6）・サブネット計算・MAC検索。",
        "URL 解析；IP 工具（IPv4/IPv6）；子网计算；MAC 查询。",
        "محلل URL وأدوات IP (IPv4/IPv6) وحاسبة شبكة فرعية وبحث MAC."
    ],
    "Reference tables: HTTP status codes, MIME types, port numbers, RFC standards, IP ranges.": [
        "संदर्भ तालिकाएँ: HTTP कोड, MIME प्रकार, पोर्ट नंबर, RFC और IP रेंज।",
        "Tablas de códigos HTTP, MIME, puertos, RFC y rangos IP.",
        "Tables HTTP, types MIME, ports, RFC et plages IP.",
        "Referenzen für HTTP-Codes, MIME-Typen, Ports, RFCs und IP-Bereiche.",
        "HTTPコード・MIME・ポート・RFC・IP範囲の早見表。",
        "参考表：HTTP 状态码、MIME 类型、端口、RFC、IP 范围。",
        "جداول لرموز HTTP وأنواع MIME والمنافذ وRFC ونطاقات IP."
    ],
    "Generators & utilities": [
        "जनरेटर और उपयोगिताएँ",
        "Generadores y utilidades",
        "Générateurs et utilitaires",
        "Generatoren und Hilfsmittel",
        "生成・補助ツール",
        "生成器与实用工具",
        "مولدات وأدوات مساعدة"
    ],
    "UUID, password, QR code, and Lorem Ipsum generators.": [
        "UUID, पासवर्ड, QR और Lorem Ipsum जनरेटर।",
        "Generadores UUID, contraseñas, QR y Lorem Ipsum.",
        "Générateurs UUID, mots de passe, QR et Lorem Ipsum.",
        "Generatoren für UUIDs, Passwörter, QR und Lorem Ipsum.",
        "UUID・パスワード・QR・Lorem Ipsum生成。",
        "UUID、密码、QR 码和 Lorem Ipsum 生成器。",
        "مولدات UUID وكلمات المرور وQR وLorem Ipsum."
    ],
    "String case converter, escape/unescape, Unix permission calculator, cron expression parser.": [
        "केस परिवर्तन, एस्केप/अनएस्केप, Unix अनुमति गणना और cron पार्सर।",
        "Conversión de mayúsculas, escape, permisos Unix y análisis cron.",
        "Conversion de casse, échappement, permissions Unix et analyse cron.",
        "Schreibweisenkonverter, Escape/Unescape, Unix-Berechtigungen und Cron-Parser.",
        "文字形式変換・エスケープ解除・Unix権限計算・cron解析。",
        "大小写转换、转义/反转义、Unix 权限计算和 cron 表达式解析。",
        "تغيير حالة النص والهروب وعكسه وحساب أذونات Unix وتحليل cron."
    ],
    "Markdown preview, Markdown table builder, slug generator, regex tester with live highlights.": [
        "Markdown प्रीव्यू, Markdown तालिका, स्लग जनरेटर और लाइव हाइलाइट वाला regex टेस्टर।",
        "Vista Markdown, tablas Markdown, slugs y pruebas regex con resaltado en vivo.",
        "Aperçu Markdown, tableaux Markdown, slugs et regex avec surlignage direct.",
        "Markdown-Vorschau, Markdown-Tabellen, Slugs und Regex-Tests mit Livehervorhebung.",
        "Markdown表示・表作成・スラッグ生成・一致強調付き正規表現テスト。",
        "Markdown 预览、Markdown 表格构建、slug 生成和实时高亮 regex 测试。",
        "معاينة Markdown وجداوله ومولد أسماء URL وفاحص regex بإبراز مباشر."
    ],
    "Color picker, color-contrast checker, timestamp converter, number-base converter.": [
        "रंग पिकर, कंट्रास्ट जाँच, टाइमस्टैम्प और संख्या-आधार परिवर्तन।",
        "Selector de color, contraste, conversor temporal y bases numéricas.",
        "Sélecteur de couleur, contraste, horodatage et bases numériques.",
        "Farbwähler, Kontrastprüfung, Zeitstempel- und Zahlenbasiskonverter.",
        "色選択・コントラスト確認・時刻変換・基数変換。",
        "颜色选择、对比度检查、时间戳转换和进制转换。",
        "منتقي ألوان وفاحص تباين ومحول طابع زمني وأساس عددي."
    ],
    "Foundations": [
        "आधारभूत सुविधाएँ",
        "Fundamentos",
        "Fondations",
        "Grundlagen",
        "基本機能",
        "基础",
        "الأسس"
    ],
    "100% client-side execution — no data ever leaves your browser.": [
        "100% क्लाइंट-साइड निष्पादन; डेटा कभी ब्राउज़र से बाहर नहीं जाता।",
        "Ejecución 100% cliente; los datos nunca salen del navegador.",
        "Exécution 100% côté client ; les données ne quittent jamais le navigateur.",
        "100% clientseitig; keine Daten verlassen den Browser.",
        "100%クライアント実行。データはブラウザー外へ送信されません。",
        "100% 客户端执行，数据从不离开浏览器。",
        "تنفيذ 100% لدى العميل؛ لا تغادر البيانات المتصفح أبدا."
    ],
    "Light and dark themes with persistent preference.": [
        "स्थायी पसंद सहित लाइट और डार्क थीम।",
        "Temas claro y oscuro con preferencia guardada.",
        "Thèmes clair et sombre avec préférence enregistrée.",
        "Helles und dunkles Design mit gespeicherter Präferenz.",
        "好みを保存できるライト・ダークテーマ。",
        "浅色和深色主题，偏好可持久保存。",
        "سمتان فاتحة وداكنة بتفضيل محفوظ."
    ],
    "Open-source under the MIT license.": [
        "MIT लाइसेंस के तहत ओपन सोर्स।",
        "Código abierto bajo licencia MIT.",
        "Open source sous licence MIT.",
        "Open Source unter MIT-Lizenz.",
        "MITライセンスのオープンソース。",
        "以 MIT 许可证开源。",
        "مفتوح المصدر برخصة MIT."
    ],
    "Release Notes & Catalog": [
        "रिलीज़ नोट्स और कैटलॉग",
        "Notas de versión y catálogo",
        "Notes de version et catalogue",
        "Versionshinweise und Katalog",
        "リリースノートとカタログ",
        "发行说明与目录",
        "ملاحظات الإصدار والكتالوج"
    ],
    "What’s new, what’s inside, and every tool at a glance": [
        "नया क्या है, भीतर क्या है और सभी टूल एक नज़र में",
        "Novedades, contenido y todas las herramientas de un vistazo",
        "Nouveautés, contenu et tous les outils en un coup d’œil",
        "Neuerungen, Inhalte und alle Werkzeuge im Überblick",
        "新機能、内容、全ツールをひと目で確認",
        "一览新内容、产品功能及所有工具",
        "الجديد والمحتوى وكل الأدوات في لمحة"
    ],
    "{count} releases": [
        "{count} रिलीज़",
        "{count} versiones",
        "{count} versions",
        "{count} Versionen",
        "{count} リリース",
        "{count} 个版本",
        "{count} إصدارات"
    ],
    "{count} tools": [
        "{count} टूल",
        "{count} herramientas",
        "{count} outils",
        "{count} Werkzeuge",
        "{count} 個のツール",
        "{count} 个工具",
        "أدوات: {count}"
    ],
    "Release History": [
        "रिलीज़ इतिहास",
        "Historial de versiones",
        "Historique des versions",
        "Versionsverlauf",
        "リリース履歴",
        "版本历史",
        "سجل الإصدارات"
    ],
    "newest first · click a version to expand": [
        "नया पहले · विस्तार के लिए संस्करण क्लिक करें",
        "más reciente primero · pulsa una versión para expandir",
        "plus récent d’abord · cliquez sur une version pour développer",
        "neueste zuerst · Version zum Aufklappen anklicken",
        "新しい順 · バージョンをクリックして展開",
        "最新优先 · 点击版本展开",
        "الأحدث أولًا · انقر إصدارًا للتوسيع"
    ],
    "Full commit history on": [
        "पूरा commit इतिहास यहां",
        "Historial completo de commits en",
        "Historique complet des commits sur",
        "Vollständiger Commit-Verlauf auf",
        "全コミット履歴：",
        "完整提交历史见",
        "سجل الالتزامات الكامل على"
    ],
    "What’s Inside — Full Catalog": [
        "भीतर क्या है — पूरा कैटलॉग",
        "Qué incluye — catálogo completo",
        "Contenu — catalogue complet",
        "Enthaltene Funktionen — vollständiger Katalog",
        "内容 — 全カタログ",
        "产品内容 — 完整目录",
        "المحتوى — الكتالوج الكامل"
    ],
    "{tools} tools across {categories} categories": [
        "{categories} श्रेणियों में {tools} टूल",
        "{tools} herramientas en {categories} categorías",
        "{tools} outils dans {categories} catégories",
        "{tools} Werkzeuge in {categories} Kategorien",
        "{categories} 分類、{tools} ツール",
        "{categories} 类共 {tools} 项工具",
        "{tools} أدوات في {categories} فئات"
    ],
    "Tools process locally by default.": [
        "टूल डिफ़ॉल्ट रूप से स्थानीय प्रोसेसिंग करते हैं।",
        "Las herramientas procesan localmente por defecto.",
        "Les outils traitent localement par défaut.",
        "Werkzeuge verarbeiten standardmäßig lokal.",
        "ツールは標準でローカル処理します。",
        "工具默认在本地处理。",
        "تعالج الأدوات البيانات محليًا افتراضيًا."
    ],
    "Network tools disclose their connection before sending requests.": [
        "नेटवर्क टूल अनुरोध भेजने से पहले अपना कनेक्शन बताते हैं।",
        "Las herramientas de red indican su conexión antes de enviar solicitudes.",
        "Les outils réseau indiquent leur connexion avant l’envoi de requêtes.",
        "Netzwerkwerkzeuge legen ihre Verbindung vor dem Senden von Anfragen offen.",
        "通信ツールは送信前に接続先を明示します。",
        "网络工具在发送请求前披露连接方式。",
        "توضّح أدوات الشبكة اتصالها قبل إرسال الطلبات."
    ],
    "Review each tool’s data boundary before entering sensitive information. Click a tool to open it.": [
        "संवेदनशील जानकारी भरने से पहले हर टूल की डेटा सीमा देखें। खोलने के लिए टूल क्लिक करें।",
        "Revisa los límites de datos de cada herramienta antes de introducir información sensible. Pulsa para abrirla.",
        "Vérifiez les frontières de données avant de saisir des informations sensibles. Cliquez sur un outil pour l’ouvrir.",
        "Vor sensiblen Eingaben die Datengrenzen des Werkzeugs prüfen. Zum Öffnen anklicken.",
        "機密情報の入力前に各ツールのデータ境界を確認してください。クリックで開きます。",
        "输入敏感信息前请查看每项工具的数据边界。点击工具即可打开。",
        "راجع حدود بيانات كل أداة قبل إدخال معلومات حساسة. انقر الأداة لفتحها."
    ],
    "Decode a JWT — see claims, expiry, and signature details locally": [
        "JWT डिकोड करें — claims, समाप्ति और हस्ताक्षर स्थानीय रूप से देखें",
        "Decodifica JWT — consulta claims, caducidad y firma localmente",
        "Décodez un JWT — examinez claims, expiration et signature localement",
        "JWT decodieren — Claims, Ablauf und Signaturdetails lokal ansehen",
        "JWTをデコード — クレーム・期限・署名詳細をローカル確認",
        "解码 JWT — 本地查看声明、到期及签名详情",
        "فك JWT — اعرض المطالبات والانتهاء وتفاصيل التوقيع محليًا"
    ],
    "Inspect a pasted certificate locally, or explicitly fetch a live certificate": [
        "पेस्ट किया certificate स्थानीय जांचें या स्पष्ट रूप से live certificate लाएं",
        "Inspecciona un certificado pegado localmente o solicita uno en vivo",
        "Inspectez un certificat collé localement ou récupérez explicitement un certificat en ligne",
        "Eingefügtes Zertifikat lokal prüfen oder ausdrücklich ein Live-Zertifikat abrufen",
        "貼付けた証明書をローカル検査、または明示的にライブ取得",
        "本地检查粘贴的证书，或明确选择获取在线证书",
        "افحص شهادة ملصقة محليًا أو اطلب شهادة مباشرة صراحة"
    ],
    "Test a bcrypt hash — your plaintext stays in your tab": [
        "bcrypt hash जांचें — आपका मूल पाठ इसी टैब में रहता है",
        "Prueba un hash bcrypt — el texto sin cifrar queda en tu pestaña",
        "Testez un hachage bcrypt — le texte clair reste dans votre onglet",
        "bcrypt-Hash prüfen — Klartext bleibt im Tab",
        "bcryptハッシュをテスト — 平文はタブ内に保持",
        "测试 bcrypt 哈希 — 明文保留在当前标签页",
        "اختبر بصمة bcrypt — يبقى النص الصريح في علامة التبويب"
    ],
    "Build an API request — choose direct browser access or the disclosed proxy": [
        "API अनुरोध बनाएं — सीधा browser access या घोषित proxy चुनें",
        "Crea una solicitud API — elige acceso directo del navegador o proxy indicado",
        "Créez une requête API — choisissez accès direct navigateur ou proxy annoncé",
        "API-Anfrage erstellen — direkten Browserzugriff oder offengelegten Proxy wählen",
        "API要求を作成 — ブラウザー直接接続か明示済みプロキシを選択",
        "构建 API 请求 — 选择浏览器直连或已披露的代理",
        "أنشئ طلب API — اختر وصول المتصفح المباشر أو الوكيل المعلن"
    ],
    "Format JSON locally — practical limits depend on your browser and device": [
        "JSON स्थानीय फ़ॉर्मैट करें — सीमा आपके browser और device पर निर्भर है",
        "Formatea JSON localmente — los límites dependen del navegador y dispositivo",
        "Formatez JSON localement — les limites dépendent du navigateur et de l’appareil",
        "JSON lokal formatieren — praktische Grenzen hängen von Browser und Gerät ab",
        "JSONをローカル整形 — 実用上の上限はブラウザー・端末次第",
        "本地格式化 JSON — 实际限制取决于浏览器和设备",
        "نسّق JSON محليًا — تعتمد الحدود العملية على المتصفح والجهاز"
    ],
    "{count} tools · local processing by default · no account required": [
        "{count} टूल · डिफ़ॉल्ट स्थानीय प्रोसेसिंग · खाता आवश्यक नहीं",
        "{count} herramientas · procesamiento local por defecto · sin cuenta",
        "{count} outils · traitement local par défaut · sans compte",
        "{count} Werkzeuge · standardmäßig lokal · kein Konto erforderlich",
        "{count} ツール · 標準ローカル処理 · アカウント不要",
        "{count} 项工具 · 默认本地处理 · 无需账户",
        "{count} أدوات · معالجة محلية افتراضيًا · لا حاجة لحساب"
    ],
    "open source": [
        "ओपन सोर्स",
        "código abierto",
        "code ouvert",
        "quelloffen",
        "オープンソース",
        "开源",
        "مفتوح المصدر"
    ],
    "Feature": [
        "सुविधा",
        "Función",
        "Fonctionnalité",
        "Funktion",
        "機能",
        "功能",
        "ميزة"
    ],
    "Fix": [
        "सुधार",
        "Corrección",
        "Correctif",
        "Korrektur",
        "修正",
        "修复",
        "إصلاح"
    ],
    "Security": [
        "सुरक्षा",
        "Seguridad",
        "Sécurité",
        "Sicherheit",
        "セキュリティ",
        "安全",
        "الأمان"
    ],
    "UI": [
        "इंटरफ़ेस",
        "Interfaz",
        "Interface",
        "Oberfläche",
        "インターフェース",
        "界面",
        "الواجهة"
    ],
    "Performance": [
        "प्रदर्शन",
        "Rendimiento",
        "Performances",
        "Leistung",
        "パフォーマンス",
        "性能",
        "الأداء"
    ]
};
