import type { TranslationColumns } from "./tool-names";

// Human-facing copy only. Cron expressions, GraphQL identifiers and parser diagnostics remain exact.
export const CRON_GRAPHQL_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Pattern": [
        "पैटर्न",
        "Patrón",
        "Motif",
        "Muster",
        "パターン",
        "模式",
        "النمط"
    ],
    "Every value": [
        "हर मान",
        "Cada valor",
        "Chaque valeur",
        "Jeder Wert",
        "すべての値",
        "每个值",
        "كل قيمة"
    ],
    "One value": [
        "एक मान",
        "Un valor",
        "Une valeur",
        "Ein Wert",
        "単一の値",
        "单个值",
        "قيمة واحدة"
    ],
    "Interval": [
        "अंतराल",
        "Intervalo",
        "Intervalle",
        "Intervall",
        "間隔",
        "间隔",
        "الفاصل"
    ],
    "Range": [
        "सीमा",
        "Rango",
        "Plage",
        "Bereich",
        "範囲",
        "范围",
        "النطاق"
    ],
    "List": [
        "सूची",
        "Lista",
        "Liste",
        "Liste",
        "リスト",
        "列表",
        "قائمة"
    ],
    "Custom field": [
        "कस्टम फ़ील्ड",
        "Campo personalizado",
        "Champ personnalisé",
        "Benutzerdefiniertes Feld",
        "カスタムフィールド",
        "自定义字段",
        "حقل مخصص"
    ],
    "At ({min}–{max})": [
        "पर ({min}–{max})",
        "En ({min}–{max})",
        "À ({min}–{max})",
        "Bei ({min}–{max})",
        "指定値（{min}–{max}）",
        "指定值（{min}–{max}）",
        "عند ({min}–{max})"
    ],
    "Every n values": [
        "हर n मान",
        "Cada n valores",
        "Toutes les n valeurs",
        "Alle n Werte",
        "n値ごと",
        "每 n 个值",
        "كل n من القيم"
    ],
    "From": [
        "से",
        "Desde",
        "De",
        "Von",
        "開始",
        "从",
        "من"
    ],
    "Through": [
        "तक",
        "Hasta",
        "Jusqu’à",
        "Bis",
        "終了",
        "到",
        "إلى"
    ],
    "Comma-separated values": [
        "अल्पविराम से अलग मान",
        "Valores separados por comas",
        "Valeurs séparées par des virgules",
        "Kommagetrennte Werte",
        "カンマ区切りの値",
        "逗号分隔的值",
        "قيم مفصولة بفواصل"
    ],
    "Field expression": [
        "फ़ील्ड व्यंजक",
        "Expresión del campo",
        "Expression du champ",
        "Feldausdruck",
        "フィールド式",
        "字段表达式",
        "تعبير الحقل"
    ],
    "0 and 7 = Sunday; 1 = Monday … 6 = Saturday.": [
        "0 और 7 = रविवार; 1 = सोमवार … 6 = शनिवार।",
        "0 y 7 = domingo; 1 = lunes … 6 = sábado.",
        "0 et 7 = dimanche ; 1 = lundi … 6 = samedi.",
        "0 und 7 = Sonntag; 1 = Montag … 6 = Samstag.",
        "0と7 = 日曜、1 = 月曜 … 6 = 土曜。",
        "0 和 7 = 周日；1 = 周一 … 6 = 周六。",
        "0 و7 = الأحد؛ 1 = الاثنين … 6 = السبت."
    ],
    "Selection limit is 500 fields.": [
        "चयन की सीमा 500 फ़ील्ड है।",
        "El límite de selección es de 500 campos.",
        "La sélection est limitée à 500 champs.",
        "Die Auswahl ist auf 500 Felder begrenzt.",
        "選択できるのは500フィールドまでです。",
        "最多可选择 500 个字段。",
        "حد الاختيار 500 حقل."
    ],
    " · required": [
        " · आवश्यक",
        " · obligatorio",
        " · obligatoire",
        " · erforderlich",
        " · 必須",
        " · 必填",
        " · مطلوب"
    ],
    " · optional": [
        " · वैकल्पिक",
        " · opcional",
        " · facultatif",
        " · optional",
        " · 任意",
        " · 可选",
        " · اختياري"
    ],
    "GraphQL literal; leave optional arguments empty": [
        "GraphQL लिटरल; वैकल्पिक आर्ग्युमेंट खाली छोड़ें",
        "Literal GraphQL; deja vacíos los argumentos opcionales",
        "Littéral GraphQL ; laissez les arguments facultatifs vides",
        "GraphQL-Literal; optionale Argumente leer lassen",
        "GraphQLリテラル。任意の引数は空欄にできます",
        "GraphQL 字面量；可选参数可留空",
        "قيمة GraphQL حرفية؛ اترك الوسائط الاختيارية فارغة"
    ],
    "Depth limit reached. __typename is selected automatically.": [
        "गहराई सीमा आ गई। __typename अपने आप चुना जाता है।",
        "Se alcanzó el límite de profundidad. __typename se selecciona automáticamente.",
        "Limite de profondeur atteinte. __typename est sélectionné automatiquement.",
        "Tiefenlimit erreicht. __typename wird automatisch ausgewählt.",
        "深さの上限に達しました。__typenameが自動選択されます。",
        "已达到深度上限。自动选择 __typename。",
        "تم بلوغ حد العمق. يُختار __typename تلقائيًا."
    ],
    "Showing the first 200 fields at this level. Use the operation editor for additional fields.": [
        "इस स्तर के पहले 200 फ़ील्ड दिख रहे हैं। अतिरिक्त फ़ील्ड के लिए ऑपरेशन संपादक का उपयोग करें।",
        "Se muestran los primeros 200 campos de este nivel. Usa el editor de operaciones para más campos.",
        "Les 200 premiers champs de ce niveau sont affichés. Utilisez l’éditeur d’opération pour les autres.",
        "Die ersten 200 Felder dieser Ebene werden angezeigt. Weitere Felder im Operationseditor bearbeiten.",
        "この階層の最初の200フィールドを表示しています。追加のフィールドは操作エディターで編集してください。",
        "显示此层级的前 200 个字段。更多字段请使用操作编辑器。",
        "تُعرض أول 200 حقل في هذا المستوى. استخدم محرر العمليات للحقول الإضافية."
    ],
    "Build an operation from your schema": [
        "अपने स्कीमा से ऑपरेशन बनाएँ",
        "Crea una operación a partir de tu esquema",
        "Créez une opération à partir de votre schéma",
        "Operation aus Ihrem Schema erstellen",
        "スキーマから操作を作成",
        "从模式构建操作",
        "أنشئ عملية من مخططك"
    ],
    "Load the SDL above, choose fields and enter argument literals. No endpoint is contacted. Object and union selections include __typename when no child fields are chosen.": [
        "ऊपर का SDL लोड करें, फ़ील्ड चुनें और आर्ग्युमेंट लिटरल भरें। किसी एंडपॉइंट से संपर्क नहीं होता। चाइल्ड फ़ील्ड न चुने जाने पर ऑब्जेक्ट और यूनियन चयन में __typename शामिल होता है।",
        "Carga el SDL de arriba, elige campos e introduce argumentos literales. No se contacta ningún endpoint. Los objetos y uniones incluyen __typename si no eliges campos secundarios.",
        "Chargez le SDL ci-dessus, choisissez les champs et saisissez les arguments littéraux. Aucun point de terminaison n’est contacté. Sans sous-champs, les objets et unions incluent __typename.",
        "SDL oben laden, Felder wählen und Argumentliterale eingeben. Es wird kein Endpunkt kontaktiert. Ohne gewählte Unterfelder enthalten Objekt- und Unionsauswahlen __typename.",
        "上のSDLを読み込み、フィールドを選択して引数のリテラルを入力します。エンドポイントには接続しません。子フィールドを選択しないオブジェクトやユニオンには__typenameが含まれます。",
        "加载上方 SDL、选择字段并输入参数字面量。不会连接端点。未选择子字段时，对象和联合选择会包含 __typename。",
        "حمّل SDL أعلاه واختر الحقول وأدخل قيم الوسائط الحرفية. لا يجري الاتصال بأي نقطة نهاية. تتضمن اختيارات الكائنات والاتحادات __typename عند عدم اختيار حقول فرعية."
    ],
    "Load current schema into builder": [
        "वर्तमान स्कीमा बिल्डर में लोड करें",
        "Cargar el esquema actual en el constructor",
        "Charger le schéma actuel dans le générateur",
        "Aktuelles Schema in den Builder laden",
        "現在のスキーマをビルダーに読み込む",
        "将当前模式加载到构建器",
        "تحميل المخطط الحالي إلى المنشئ"
    ],
    "Operation": [
        "ऑपरेशन",
        "Operación",
        "Opération",
        "Operation",
        "操作",
        "操作",
        "العملية"
    ],
    "Query": [
        "क्वेरी",
        "Consulta",
        "Requête",
        "Abfrage",
        "クエリ",
        "查询",
        "استعلام"
    ],
    "Mutation": [
        "म्यूटेशन",
        "Mutación",
        "Mutation",
        "Mutation",
        "ミューテーション",
        "变更",
        "تعديل"
    ],
    "Subscription": [
        "सब्सक्रिप्शन",
        "Suscripción",
        "Abonnement",
        "Abonnement",
        "サブスクリプション",
        "订阅",
        "اشتراك"
    ],
    "Operation name": [
        "ऑपरेशन का नाम",
        "Nombre de la operación",
        "Nom de l’opération",
        "Operationsname",
        "操作名",
        "操作名称",
        "اسم العملية"
    ],
    "This schema has no {operation} root. Choose an available operation.": [
        "इस स्कीमा में {operation} रूट नहीं है। उपलब्ध ऑपरेशन चुनें।",
        "Este esquema no tiene raíz {operation}. Elige una operación disponible.",
        "Ce schéma n’a pas de racine {operation}. Choisissez une opération disponible.",
        "Dieses Schema hat keine {operation}-Wurzel. Wählen Sie eine verfügbare Operation.",
        "このスキーマには{operation}のルートがありません。利用可能な操作を選択してください。",
        "此模式没有 {operation} 根类型。请选择可用操作。",
        "لا يحتوي هذا المخطط على جذر {operation}. اختر عملية متاحة."
    ],
    "Generate validated operation": [
        "सत्यापित ऑपरेशन बनाएँ",
        "Generar operación validada",
        "Générer une opération validée",
        "Validierte Operation erzeugen",
        "検証済みの操作を生成",
        "生成已验证的操作",
        "إنشاء عملية تم التحقق منها"
    ],
    "Generated GraphQL": [
        "बनाया गया GraphQL",
        "GraphQL generado",
        "GraphQL généré",
        "Erzeugtes GraphQL",
        "生成されたGraphQL",
        "生成的 GraphQL",
        "GraphQL المُنشأ"
    ],
    "Use in operation editor": [
        "ऑपरेशन संपादक में उपयोग करें",
        "Usar en el editor de operaciones",
        "Utiliser dans l’éditeur d’opération",
        "Im Operationseditor verwenden",
        "操作エディターで使用",
        "在操作编辑器中使用",
        "استخدام في محرر العمليات"
    ],
    "Copy operation": [
        "ऑपरेशन कॉपी करें",
        "Copiar operación",
        "Copier l’opération",
        "Operation kopieren",
        "操作をコピー",
        "复制操作",
        "نسخ العملية"
    ],
    "Cron Parser & Visual Builder": [
        "Cron पार्सर और विज़ुअल बिल्डर",
        "Analizador y constructor visual de cron",
        "Analyseur cron et générateur visuel",
        "Cron-Parser und visueller Builder",
        "Cron解析・ビジュアルビルダー",
        "Cron 解析器与可视化构建器",
        "محلل Cron والمنشئ المرئي"
    ],
    "Build five-field cron schedules and preview execution times in an IANA timezone": [
        "पाँच फ़ील्ड के cron शेड्यूल बनाएँ और IANA समय क्षेत्र में चलने के समय देखें",
        "Crea horarios cron de cinco campos y previsualiza ejecuciones en una zona IANA",
        "Créez des planifications cron à cinq champs et prévisualisez les exécutions dans un fuseau IANA",
        "Cron-Zeitpläne mit fünf Feldern erstellen und Ausführungszeiten in einer IANA-Zeitzone anzeigen",
        "5フィールドのcronスケジュールを作成し、IANAタイムゾーンで実行時刻を確認",
        "构建五字段 cron 计划，并在 IANA 时区预览执行时间",
        "أنشئ جداول cron بخمسة حقول وعاين أوقات التنفيذ في منطقة IANA الزمنية"
    ],
    "Five-field cron schedules describe minute, hour, day of month, month and day of week. This tool uses cron-parser for validation and timezone-aware run previews.": [
        "पाँच फ़ील्ड के cron शेड्यूल मिनट, घंटा, महीने का दिन, महीना और सप्ताह का दिन बताते हैं। यह टूल सत्यापन और समय क्षेत्र के अनुसार पूर्वावलोकन के लिए cron-parser का उपयोग करता है।",
        "Los cinco campos cron describen minuto, hora, día del mes, mes y día de la semana. Esta herramienta usa cron-parser para validar y previsualizar con zonas horarias.",
        "Les cinq champs cron décrivent minute, heure, jour du mois, mois et jour de la semaine. Cet outil utilise cron-parser pour valider et prévisualiser selon le fuseau horaire.",
        "Fünf Cron-Felder beschreiben Minute, Stunde, Monatstag, Monat und Wochentag. Dieses Tool nutzt cron-parser zur Validierung und für zeitzonenabhängige Vorschauen.",
        "cronの5フィールドは分、時、日、月、曜日を表します。このツールはcron-parserで検証し、タイムゾーンに対応した実行プレビューを表示します。",
        "五字段 cron 计划描述分钟、小时、月中日期、月份和星期。此工具使用 cron-parser 验证并提供考虑时区的执行预览。",
        "تصف حقول cron الخمسة الدقيقة والساعة ويوم الشهر والشهر ويوم الأسبوع. تستخدم الأداة cron-parser للتحقق ومعاينة التنفيذ مع مراعاة المنطقة الزمنية."
    ],
    "Build schedules with visual controls and check their next dates before deploying them.": [
        "विज़ुअल नियंत्रणों से शेड्यूल बनाएँ और लागू करने से पहले अगली तारीखें जाँचें।",
        "Crea horarios con controles visuales y comprueba sus próximas fechas antes de desplegarlos.",
        "Créez des planifications visuellement et vérifiez les prochaines dates avant déploiement.",
        "Zeitpläne visuell erstellen und nächste Termine vor der Bereitstellung prüfen.",
        "視覚的な操作でスケジュールを作成し、導入前に次回の日付を確認できます。",
        "使用可视化控件构建计划，并在部署前检查后续日期。",
        "أنشئ الجداول بعناصر تحكم مرئية وتحقق من مواعيدها التالية قبل نشرها."
    ],
    "Choose a preset or edit the five fields": [
        "प्रीसेट चुनें या पाँच फ़ील्ड संपादित करें",
        "Elige un ajuste o edita los cinco campos",
        "Choisissez un préréglage ou modifiez les cinq champs",
        "Vorlage wählen oder die fünf Felder bearbeiten",
        "プリセットを選択するか5フィールドを編集",
        "选择预设或编辑五个字段",
        "اختر إعدادًا مسبقًا أو عدّل الحقول الخمسة"
    ],
    "Set an IANA timezone and reference timestamp": [
        "IANA समय क्षेत्र और संदर्भ टाइमस्टैम्प सेट करें",
        "Establece zona IANA y fecha de referencia",
        "Définissez le fuseau IANA et l’horodatage de référence",
        "IANA-Zeitzone und Referenzzeitstempel setzen",
        "IANAタイムゾーンと基準タイムスタンプを設定",
        "设置 IANA 时区和参考时间戳",
        "حدد منطقة IANA الزمنية والطابع الزمني المرجعي"
    ],
    "Preview the next five runs and copy the expression": [
        "अगले पाँच रन देखें और व्यंजक कॉपी करें",
        "Previsualiza cinco ejecuciones y copia la expresión",
        "Prévisualisez cinq exécutions et copiez l’expression",
        "Nächste fünf Ausführungen anzeigen und Ausdruck kopieren",
        "次の5回の実行を確認し式をコピー",
        "预览接下来五次运行并复制表达式",
        "عاين مرات التشغيل الخمس التالية وانسخ التعبير"
    ],
    "When both day-of-month and day-of-week are restricted, standard cron matches either field (OR).": [
        "महीने का दिन और सप्ताह का दिन दोनों सीमित हों तो मानक cron किसी एक फ़ील्ड का मिलान करता है (OR)।",
        "Si día del mes y día de la semana están restringidos, cron estándar coincide con cualquiera (OR).",
        "Si le jour du mois et de la semaine sont restreints, cron standard accepte l’un ou l’autre (OR).",
        "Sind Monatstag und Wochentag eingeschränkt, genügt bei Standard-cron eines der Felder (OR).",
        "日と曜日の両方を制限した場合、標準cronはどちらかの一致で実行します（OR）。",
        "当月中日期和星期均受限时，标准 cron 匹配任一字段（OR）。",
        "عند تقييد يوم الشهر ويوم الأسبوع معًا، يطابق cron القياسي أيًا منهما (OR)."
    ],
    "Schedulers differ around daylight-saving transitions. Check the behavior of your actual runtime.": [
        "डेलाइट सेविंग बदलावों में शेड्यूलर अलग व्यवहार करते हैं। अपने वास्तविक रनटाइम का व्यवहार जाँचें।",
        "Los planificadores difieren en los cambios de horario de verano. Comprueba tu entorno real.",
        "Les planificateurs diffèrent lors des changements d’heure. Vérifiez votre environnement réel.",
        "Scheduler verhalten sich bei Zeitumstellungen unterschiedlich. Prüfen Sie Ihre tatsächliche Laufzeit.",
        "夏時間の切り替え時の動作はスケジューラーによって異なります。実際の環境で確認してください。",
        "夏令时切换时各调度器的行为不同。请检查实际运行环境。",
        "تختلف المجدولات عند الانتقال للتوقيت الصيفي. تحقق من سلوك بيئة التشغيل الفعلية."
    ],
    "This interface uses five numeric fields; Quartz seconds, names and extensions are not accepted.": [
        "यह इंटरफ़ेस पाँच संख्यात्मक फ़ील्ड उपयोग करता है; Quartz सेकंड, नाम और एक्सटेंशन स्वीकार नहीं हैं।",
        "Esta interfaz usa cinco campos numéricos; no admite segundos Quartz, nombres ni extensiones.",
        "Cette interface utilise cinq champs numériques ; secondes Quartz, noms et extensions ne sont pas acceptés.",
        "Diese Oberfläche nutzt fünf numerische Felder; Quartz-Sekunden, Namen und Erweiterungen werden nicht akzeptiert.",
        "5つの数値フィールドを使用します。Quartzの秒、名前、拡張構文には対応しません。",
        "此界面使用五个数字字段；不接受 Quartz 秒、名称和扩展语法。",
        "تستخدم الواجهة خمسة حقول رقمية؛ لا تُقبل ثواني Quartz أو الأسماء أو الامتدادات."
    ],
    "Preset": [
        "प्रीसेट",
        "Ajuste predefinido",
        "Préréglage",
        "Vorlage",
        "プリセット",
        "预设",
        "إعداد مسبق"
    ],
    "Choose a schedule": [
        "शेड्यूल चुनें",
        "Elegir un horario",
        "Choisir une planification",
        "Zeitplan wählen",
        "スケジュールを選択",
        "选择计划",
        "اختر جدولًا"
    ],
    "Cron expression": [
        "Cron व्यंजक",
        "Expresión cron",
        "Expression cron",
        "Cron-Ausdruck",
        "Cron式",
        "Cron 表达式",
        "تعبير Cron"
    ],
    "Enter five fields to use visual controls.": [
        "विज़ुअल नियंत्रणों के लिए पाँच फ़ील्ड भरें।",
        "Introduce cinco campos para usar los controles visuales.",
        "Saisissez cinq champs pour utiliser les contrôles visuels.",
        "Für visuelle Steuerung fünf Felder eingeben.",
        "視覚的な操作を使うには5フィールドを入力してください。",
        "输入五个字段以使用可视化控件。",
        "أدخل خمسة حقول لاستخدام عناصر التحكم المرئية."
    ],
    "Valid five-field schedule:": [
        "वैध पाँच-फ़ील्ड शेड्यूल:",
        "Horario válido de cinco campos:",
        "Planification valide à cinq champs :",
        "Gültiger Zeitplan mit fünf Feldern:",
        "有効な5フィールドのスケジュール：",
        "有效的五字段计划：",
        "جدول صالح بخمسة حقول:"
    ],
    "Copy cron": [
        "Cron कॉपी करें",
        "Copiar cron",
        "Copier le cron",
        "Cron kopieren",
        "cronをコピー",
        "复制 cron",
        "نسخ cron"
    ],
    "Download expression": [
        "व्यंजक डाउनलोड करें",
        "Descargar expresión",
        "Télécharger l’expression",
        "Ausdruck herunterladen",
        "式をダウンロード",
        "下载表达式",
        "تنزيل التعبير"
    ],
    "IANA timezone": [
        "IANA समय क्षेत्र",
        "Zona horaria IANA",
        "Fuseau horaire IANA",
        "IANA-Zeitzone",
        "IANAタイムゾーン",
        "IANA 时区",
        "المنطقة الزمنية IANA"
    ],
    "Preview after (ISO 8601 with offset)": [
        "इसके बाद पूर्वावलोकन (ऑफ़सेट सहित ISO 8601)",
        "Previsualizar después de (ISO 8601 con desfase)",
        "Prévisualiser après (ISO 8601 avec décalage)",
        "Vorschau nach (ISO 8601 mit Offset)",
        "基準時刻（オフセット付きISO 8601）",
        "在此之后预览（带偏移量的 ISO 8601）",
        "المعاينة بعد (ISO 8601 مع الإزاحة)"
    ],
    "Include Z or an explicit UTC offset in the reference timestamp.": [
        "संदर्भ टाइमस्टैम्प में Z या स्पष्ट UTC ऑफ़सेट शामिल करें।",
        "Incluye Z o un desfase UTC explícito en la fecha de referencia.",
        "Ajoutez Z ou un décalage UTC explicite à l’horodatage de référence.",
        "Referenzzeitstempel mit Z oder explizitem UTC-Offset angeben.",
        "基準タイムスタンプにZまたは明示的なUTCオフセットを含めてください。",
        "请在参考时间戳中包含 Z 或明确的 UTC 偏移量。",
        "أدرج Z أو إزاحة UTC صريحة في الطابع الزمني المرجعي."
    ],
    "Preview next five runs": [
        "अगले पाँच रन देखें",
        "Previsualizar cinco ejecuciones",
        "Prévisualiser cinq exécutions",
        "Nächste fünf Ausführungen anzeigen",
        "次の5回の実行を表示",
        "预览接下来五次运行",
        "معاينة مرات التشغيل الخمس التالية"
    ],
    "Next executions after the selected reference time": [
        "चुने गए संदर्भ समय के बाद अगली बार चलने के समय",
        "Próximas ejecuciones tras la referencia seleccionada",
        "Prochaines exécutions après l’heure de référence choisie",
        "Nächste Ausführungen nach der gewählten Referenzzeit",
        "選択した基準時刻以降の実行予定",
        "所选参考时间之后的执行计划",
        "عمليات التنفيذ التالية بعد الوقت المرجعي المحدد"
    ],
    "In {timezone}": [
        "{timezone} में",
        "En {timezone}",
        "Dans {timezone}",
        "In {timezone}",
        "{timezone}での時刻",
        "{timezone} 时间",
        "في {timezone}"
    ],
    "Day-of-month and day-of-week restrictions use OR matching when both are set. A restricted field is respected when the other is *. Sunday is 0 or 7. These previews do not create or run a scheduled job.": [
        "महीने का दिन और सप्ताह का दिन दोनों सेट होने पर OR मिलान होता है। दूसरा फ़ील्ड * होने पर सीमित फ़ील्ड लागू होता है। रविवार 0 या 7 है। ये पूर्वावलोकन शेड्यूल जॉब बनाते या चलाते नहीं हैं।",
        "Las restricciones de día del mes y de la semana usan OR cuando ambas están definidas. Si una es *, se respeta la otra. Domingo es 0 o 7. Estas vistas no crean ni ejecutan tareas.",
        "Les restrictions du jour du mois et de la semaine utilisent OR si les deux sont définies. Si l’un vaut *, l’autre est respecté. Dimanche vaut 0 ou 7. Ces aperçus ne créent ni n’exécutent de tâche.",
        "Sind Monatstag und Wochentag gesetzt, gilt OR. Ist ein Feld *, wird die Einschränkung des anderen beachtet. Sonntag ist 0 oder 7. Vorschauen erstellen oder starten keinen geplanten Job.",
        "日と曜日の両方を指定するとORで一致を判定します。一方が*の場合は他方の制限に従います。日曜は0または7です。このプレビューはジョブを作成・実行しません。",
        "同时设置月中日期和星期限制时使用 OR 匹配。一方为 * 时遵循另一方的限制。周日为 0 或 7。预览不会创建或运行计划任务。",
        "يُستخدم تطابق OR عند تعيين قيود يوم الشهر ويوم الأسبوع معًا. يُحترم الحقل المقيد إذا كان الآخر *. الأحد هو 0 أو 7. لا تُنشئ هذه المعاينات مهمة مجدولة ولا تشغّلها."
    ],
    "Operation limit is 500,000 characters.": [
        "ऑपरेशन की सीमा 500,000 अक्षर है।",
        "El límite de la operación es de 500.000 caracteres.",
        "L’opération est limitée à 500 000 caractères.",
        "Die Operation ist auf 500.000 Zeichen begrenzt.",
        "操作は500,000文字までです。",
        "操作最多为 500,000 个字符。",
        "حد العملية 500,000 حرف."
    ],
    "Unable to parse schema or operation.": [
        "स्कीमा या ऑपरेशन पार्स नहीं हो सका।",
        "No se pudo analizar el esquema o la operación.",
        "Impossible d’analyser le schéma ou l’opération.",
        "Schema oder Operation konnte nicht geparst werden.",
        "スキーマまたは操作を解析できません。",
        "无法解析模式或操作。",
        "تعذر تحليل المخطط أو العملية."
    ],
    "GraphQL Schema & Operation Explorer": [
        "GraphQL स्कीमा और ऑपरेशन एक्सप्लोरर",
        "Explorador de esquemas y operaciones GraphQL",
        "Explorateur de schémas et opérations GraphQL",
        "GraphQL-Schema- und Operations-Explorer",
        "GraphQLスキーマと操作の探索",
        "GraphQL 架构与操作浏览器",
        "مستكشف مخططات وعمليات GraphQL"
    ],
    "Validate GraphQL operations against an SDL schema without contacting an endpoint": [
        "एंडपॉइंट से संपर्क किए बिना SDL स्कीमा के अनुसार GraphQL ऑपरेशन सत्यापित करें",
        "Valida operaciones GraphQL con un esquema SDL sin contactar endpoints",
        "Validez les opérations GraphQL avec un schéma SDL sans contacter de point de terminaison",
        "GraphQL-Operationen gegen ein SDL-Schema prüfen, ohne einen Endpunkt zu kontaktieren",
        "エンドポイントに接続せずにSDLスキーマでGraphQL操作を検証",
        "不连接端点，根据 SDL 模式验证 GraphQL 操作",
        "تحقق من عمليات GraphQL مقابل مخطط SDL دون الاتصال بنقطة نهاية"
    ],
    "A local GraphQL SDL and operation validator powered by the official GraphQL parser.": [
        "आधिकारिक GraphQL पार्सर पर आधारित स्थानीय GraphQL SDL और ऑपरेशन सत्यापक।",
        "Validador local de SDL y operaciones GraphQL con el analizador oficial de GraphQL.",
        "Validateur local de SDL et d’opérations GraphQL utilisant l’analyseur officiel GraphQL.",
        "Lokaler GraphQL-SDL- und Operationsvalidator mit dem offiziellen GraphQL-Parser.",
        "公式GraphQLパーサーを使用するローカルのSDL・操作検証ツールです。",
        "使用官方 GraphQL 解析器的本地 SDL 和操作验证工具。",
        "مدقق محلي لمخططات SDL وعمليات GraphQL يستخدم محلل GraphQL الرسمي."
    ],
    "It catches unknown fields, wrong argument types, invalid selections, and schema syntax before a query reaches production.": [
        "यह क्वेरी के प्रोडक्शन तक पहुँचने से पहले अज्ञात फ़ील्ड, गलत आर्ग्युमेंट प्रकार, अमान्य चयन और स्कीमा सिंटैक्स की समस्याएँ पकड़ता है।",
        "Detecta campos desconocidos, tipos de argumentos incorrectos, selecciones inválidas y sintaxis del esquema antes de producción.",
        "Détecte les champs inconnus, types d’arguments incorrects, sélections invalides et erreurs de syntaxe du schéma avant la production.",
        "Erkennt unbekannte Felder, falsche Argumenttypen, ungültige Auswahlen und Schema-Syntaxfehler vor dem Produktionseinsatz.",
        "本番環境に送信する前に、不明なフィールド、引数の型の誤り、無効な選択、スキーマ構文の問題を検出します。",
        "在查询进入生产环境前发现未知字段、错误的参数类型、无效选择和模式语法问题。",
        "يكشف الحقول غير المعروفة وأنواع الوسائط الخاطئة والاختيارات غير الصالحة وأخطاء صياغة المخطط قبل الإنتاج."
    ],
    "Paste a GraphQL SDL schema": [
        "GraphQL SDL स्कीमा पेस्ट करें",
        "Pega un esquema SDL de GraphQL",
        "Collez un schéma SDL GraphQL",
        "GraphQL-SDL-Schema einfügen",
        "GraphQL SDLスキーマを貼り付け",
        "粘贴 GraphQL SDL 模式",
        "ألصق مخطط GraphQL SDL"
    ],
    "Paste a query, mutation, or subscription": [
        "क्वेरी, म्यूटेशन या सब्सक्रिप्शन पेस्ट करें",
        "Pega una consulta, mutación o suscripción",
        "Collez une requête, mutation ou souscription",
        "Abfrage, Mutation oder Abonnement einfügen",
        "クエリ、ミューテーション、サブスクリプションを貼り付け",
        "粘贴查询、变更或订阅",
        "ألصق استعلامًا أو تعديلًا أو اشتراكًا"
    ],
    "Validate the operation": [
        "ऑपरेशन सत्यापित करें",
        "Valida la operación",
        "Validez l’opération",
        "Operation validieren",
        "操作を検証",
        "验证操作",
        "تحقق من العملية"
    ],
    "Fix the reported schema or operation errors": [
        "दिखाई गई स्कीमा या ऑपरेशन त्रुटियाँ ठीक करें",
        "Corrige los errores de esquema u operación indicados",
        "Corrigez les erreurs de schéma ou d’opération signalées",
        "Gemeldete Schema- oder Operationsfehler beheben",
        "報告されたスキーマまたは操作のエラーを修正",
        "修复报告的模式或操作错误",
        "أصلح أخطاء المخطط أو العملية المُبلّغ عنها"
    ],
    "This tool validates shape only; it does not execute a query or introspect a remote service.": [
        "यह टूल केवल संरचना सत्यापित करता है; क्वेरी चलाता या रिमोट सेवा का निरीक्षण नहीं करता।",
        "Esta herramienta solo valida la estructura; no ejecuta consultas ni inspecciona servicios remotos.",
        "Cet outil valide seulement la structure ; il n’exécute aucune requête et n’inspecte aucun service distant.",
        "Dieses Tool prüft nur die Struktur; es führt keine Abfrage aus und untersucht keinen entfernten Dienst.",
        "構造のみ検証します。クエリの実行やリモートサービスのイントロスペクションは行いません。",
        "此工具仅验证结构，不执行查询或检查远程服务。",
        "تتحقق هذه الأداة من البنية فقط؛ لا تنفذ استعلامًا ولا تفحص خدمة بعيدة."
    ],
    "Use a checked-in schema snapshot for repeatable review.": [
        "दोहराने योग्य समीक्षा के लिए संस्करण नियंत्रण में सहेजा स्कीमा स्नैपशॉट उपयोग करें।",
        "Usa una instantánea del esquema versionada para revisiones repetibles.",
        "Utilisez un instantané du schéma versionné pour une revue reproductible.",
        "Für reproduzierbare Prüfungen einen eingecheckten Schema-Snapshot verwenden.",
        "再現可能なレビューにはバージョン管理されたスキーマのスナップショットを使用してください。",
        "使用已纳入版本控制的模式快照进行可重复审查。",
        "استخدم لقطة مخطط محفوظة في نظام التحكم بالإصدارات لمراجعة قابلة للتكرار."
    ],
    "Frontend query reviews": [
        "फ़्रंटएंड क्वेरी समीक्षा",
        "Revisiones de consultas frontend",
        "Revues des requêtes frontend",
        "Frontend-Abfrageprüfungen",
        "フロントエンドのクエリレビュー",
        "前端查询审查",
        "مراجعات استعلامات الواجهة الأمامية"
    ],
    "GraphQL migration checks": [
        "GraphQL माइग्रेशन जाँच",
        "Comprobaciones de migración GraphQL",
        "Vérifications de migration GraphQL",
        "GraphQL-Migrationsprüfungen",
        "GraphQL移行チェック",
        "GraphQL 迁移检查",
        "فحوص ترحيل GraphQL"
    ],
    "API client test fixtures": [
        "API क्लाइंट टेस्ट फ़िक्स्चर",
        "Datos de prueba del cliente API",
        "Jeux de test du client API",
        "API-Client-Testdaten",
        "APIクライアントのテストデータ",
        "API 客户端测试数据",
        "بيانات اختبار عميل API"
    ],
    "Validate operation": [
        "ऑपरेशन सत्यापित करें",
        "Validar operación",
        "Valider l’opération",
        "Operation validieren",
        "操作を検証",
        "验证操作",
        "التحقق من العملية"
    ],
    "Reset example": [
        "उदाहरण रीसेट करें",
        "Restablecer ejemplo",
        "Réinitialiser l’exemple",
        "Beispiel zurücksetzen",
        "サンプルをリセット",
        "重置示例",
        "إعادة ضبط المثال"
    ],
    "Validation errors: {count}": [
        "सत्यापन त्रुटियाँ: {count}",
        "Errores de validación: {count}",
        "Erreurs de validation : {count}",
        "Validierungsfehler: {count}",
        "検証エラー：{count}",
        "验证错误：{count}",
        "أخطاء التحقق: {count}"
    ],
    "Operation is valid": [
        "ऑपरेशन वैध है",
        "La operación es válida",
        "L’opération est valide",
        "Operation ist gültig",
        "操作は有効です",
        "操作有效",
        "العملية صالحة"
    ],
    "Minify operation": [
        "ऑपरेशन छोटा करें",
        "Minificar operación",
        "Minifier l’opération",
        "Operation minimieren",
        "操作を圧縮",
        "压缩操作",
        "تصغير العملية"
    ],
    "Format operation": [
        "ऑपरेशन फ़ॉर्मैट करें",
        "Formatear operación",
        "Formater l’opération",
        "Operation formatieren",
        "操作を整形",
        "格式化操作",
        "تنسيق العملية"
    ],
    "Schema (SDL)": [
        "स्कीमा (SDL)",
        "Esquema (SDL)",
        "Schéma (SDL)",
        "Schema (SDL)",
        "スキーマ（SDL）",
        "模式（SDL）",
        "المخطط (SDL)"
    ],
    "GraphQL schema SDL": [
        "GraphQL स्कीमा SDL",
        "SDL del esquema GraphQL",
        "SDL du schéma GraphQL",
        "GraphQL-Schema-SDL",
        "GraphQLスキーマSDL",
        "GraphQL 模式 SDL",
        "SDL لمخطط GraphQL"
    ],
    "GraphQL operation": [
        "GraphQL ऑपरेशन",
        "Operación GraphQL",
        "Opération GraphQL",
        "GraphQL-Operation",
        "GraphQL操作",
        "GraphQL 操作",
        "عملية GraphQL"
    ],
    "Validation result": [
        "सत्यापन परिणाम",
        "Resultado de validación",
        "Résultat de validation",
        "Validierungsergebnis",
        "検証結果",
        "验证结果",
        "نتيجة التحقق"
    ],
    "The operation matches this schema": [
        "ऑपरेशन इस स्कीमा से मेल खाता है",
        "La operación coincide con este esquema",
        "L’opération correspond à ce schéma",
        "Die Operation entspricht diesem Schema",
        "操作はこのスキーマに適合しています",
        "操作与此模式匹配",
        "العملية تطابق هذا المخطط"
    ],
    "Minute": [
        "मिनट",
        "Minuto",
        "Minute",
        "Minute",
        "分",
        "分钟",
        "دقيقة"
    ],
    "Hour": [
        "घंटा",
        "Hora",
        "Heure",
        "Stunde",
        "時間",
        "小时",
        "ساعة"
    ],
    "Day of month": [
        "महीने का दिन",
        "Día del mes",
        "Jour du mois",
        "Tag des Monats",
        "日",
        "月中日期",
        "يوم الشهر"
    ],
    "Month": [
        "महीना",
        "Mes",
        "Mois",
        "Monat",
        "月",
        "月份",
        "الشهر"
    ],
    "Day of week": [
        "सप्ताह का दिन",
        "Día de la semana",
        "Jour de la semaine",
        "Wochentag",
        "曜日",
        "星期",
        "يوم الأسبوع"
    ],
    "Every minute": [
        "हर मिनट",
        "Cada minuto",
        "Chaque minute",
        "Jede Minute",
        "毎分",
        "每分钟",
        "كل دقيقة"
    ],
    "Every 15 minutes": [
        "हर 15 मिनट",
        "Cada 15 minutos",
        "Toutes les 15 minutes",
        "Alle 15 Minuten",
        "15分ごと",
        "每 15 分钟",
        "كل 15 دقيقة"
    ],
    "Every hour": [
        "हर घंटे",
        "Cada hora",
        "Chaque heure",
        "Jede Stunde",
        "毎時",
        "每小时",
        "كل ساعة"
    ],
    "Daily at midnight": [
        "रोज़ आधी रात",
        "Cada día a medianoche",
        "Chaque jour à minuit",
        "Täglich um Mitternacht",
        "毎日午前0時",
        "每天午夜",
        "يوميًا عند منتصف الليل"
    ],
    "Weekdays at 09:00": [
        "कार्यदिवसों में 09:00 पर",
        "Días laborables a las 09:00",
        "En semaine à 09:00",
        "Werktags um 09:00",
        "平日の09:00",
        "工作日 09:00",
        "أيام العمل عند 09:00"
    ],
    "Sunday at midnight": [
        "रविवार आधी रात",
        "Domingo a medianoche",
        "Dimanche à minuit",
        "Sonntags um Mitternacht",
        "日曜日の午前0時",
        "周日午夜",
        "الأحد عند منتصف الليل"
    ],
    "First day of month": [
        "महीने का पहला दिन",
        "Primer día del mes",
        "Premier jour du mois",
        "Erster Tag des Monats",
        "毎月1日",
        "每月第一天",
        "أول يوم من الشهر"
    ],
    "January 1": [
        "1 जनवरी",
        "1 de enero",
        "1er janvier",
        "1. Januar",
        "1月1日",
        "1 月 1 日",
        "1 يناير"
    ]
};
