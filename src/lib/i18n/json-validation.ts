import type { TranslationColumns } from "./tool-names";

// Interface/help copy only. Raw JSON, schema paths and parser/validator diagnostics remain exact.
export const JSON_VALIDATION_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Invalid JSON. Check the syntax and try again.": [
        "JSON अमान्य है। सिंटैक्स जाँचकर फिर कोशिश करें।",
        "JSON no válido. Revisa la sintaxis e inténtalo de nuevo.",
        "JSON invalide. Vérifiez la syntaxe et réessayez.",
        "Ungültiges JSON. Syntax prüfen und erneut versuchen.",
        "JSONが無効です。構文を確認して再試行してください。",
        "JSON 无效。请检查语法后重试。",
        "JSON غير صالح. تحقق من الصياغة وحاول مجددًا."
    ],
    "Parse error": [
        "पार्स त्रुटि",
        "Error de análisis",
        "Erreur d’analyse",
        "Parsefehler",
        "解析エラー",
        "解析错误",
        "خطأ في التحليل"
    ],
    "Prettify, minify and validate JSON": [
        "JSON को पठनीय बनाएँ, संक्षिप्त करें और सत्यापित करें",
        "Embellece, minimiza y valida JSON",
        "Embellissez, minifiez et validez le JSON",
        "JSON formatieren, minimieren und validieren",
        "JSONの整形・圧縮・検証",
        "美化、压缩和验证 JSON",
        "تنسيق JSON وتصغيره والتحقق منه"
    ],
    "A JSON Formatter is a tool that transforms raw JSON (JavaScript Object Notation) data into a properly indented, human-readable format. It can also minify JSON by removing all unnecessary whitespace, or validate JSON syntax to ensure it's properly structured.": [
        "JSON फ़ॉर्मैटर कच्चे JSON (JavaScript Object Notation) डेटा को सही इंडेंट वाला पठनीय रूप देता है। यह अनावश्यक खाली जगह हटाकर JSON संक्षिप्त कर सकता है और सही संरचना के लिए सिंटैक्स जाँच सकता है।",
        "Un formateador JSON transforma datos JSON (JavaScript Object Notation) sin formato en texto legible y bien indentado. También puede quitar espacios innecesarios para minimizarlo o validar su sintaxis y estructura.",
        "Un formateur JSON transforme les données JSON (JavaScript Object Notation) brutes en texte lisible et correctement indenté. Il peut aussi supprimer les espaces inutiles pour minifier le JSON ou vérifier sa syntaxe et sa structure.",
        "Ein JSON-Formatierer wandelt rohe JSON-Daten (JavaScript Object Notation) in lesbaren Text mit korrekter Einrückung um. Er kann unnötige Leerzeichen entfernen oder die JSON-Syntax und Struktur prüfen.",
        "JSONフォーマッターは、生のJSON（JavaScript Object Notation）データを適切に字下げした読みやすい形式に変換します。不要な空白を除く圧縮や、構造が正しいかを確認する構文検証もできます。",
        "JSON 格式化工具可将原始 JSON（JavaScript Object Notation）数据转换为缩进正确、易于阅读的格式，也可删除多余空白进行压缩，或验证语法以确认结构正确。",
        "تُحوّل أداة تنسيق JSON ‏(JavaScript Object Notation) البيانات الخام إلى نص مقروء بمسافات بادئة صحيحة. ويمكنها حذف الفراغات غير الضرورية لتصغير JSON أو فحص الصياغة للتأكد من صحة البنية."
    ],
    "JSON is the most common data interchange format in modern web development. Poorly formatted JSON is difficult to read and debug. This tool helps developers quickly format API responses, configuration files, and data structures for better readability and easier debugging.": [
        "आधुनिक वेब विकास में JSON सबसे आम डेटा विनिमय प्रारूप है। खराब फ़ॉर्मैट वाला JSON पढ़ना और डीबग करना कठिन होता है। यह टूल API प्रतिक्रियाओं, कॉन्फ़िगरेशन फ़ाइलों और डेटा संरचनाओं को जल्दी पठनीय बनाता है।",
        "JSON es el formato de intercambio de datos más común en el desarrollo web moderno. Un formato deficiente dificulta la lectura y depuración. Esta herramienta da formato a respuestas API, configuraciones y estructuras de datos para facilitar esas tareas.",
        "JSON est le format d’échange de données le plus courant dans le développement web moderne. Un JSON mal formaté est difficile à lire et à déboguer. Cet outil formate rapidement les réponses API, configurations et structures de données pour faciliter ces tâches.",
        "JSON ist das verbreitetste Datenaustauschformat in der modernen Webentwicklung. Schlecht formatiertes JSON erschwert Lesen und Fehlersuche. Dieses Werkzeug formatiert API-Antworten, Konfigurationsdateien und Datenstrukturen schnell und lesbar.",
        "JSONは現代のWeb開発で最も一般的なデータ交換形式です。整形されていないJSONは読解やデバッグが困難です。このツールでAPI応答、設定ファイル、データ構造をすばやく整形できます。",
        "JSON 是现代 Web 开发中最常见的数据交换格式。格式混乱的 JSON 难以阅读和调试。此工具可快速格式化 API 响应、配置文件和数据结构，便于阅读和排错。",
        "JSON هو أكثر تنسيقات تبادل البيانات شيوعًا في تطوير الويب الحديث. يصعب قراءة JSON سيئ التنسيق وتصحيحه. تساعد الأداة في تنسيق استجابات API وملفات الإعداد وبنى البيانات بسرعة لتسهيل القراءة والتصحيح."
    ],
    "Paste your JSON data into the input editor on the left": [
        "अपना JSON डेटा इनपुट एडिटर में पेस्ट करें",
        "Pega tus datos JSON en el editor de entrada",
        "Collez vos données JSON dans l’éditeur d’entrée",
        "JSON-Daten im Eingabeeditor einfügen",
        "入力エディターにJSONデータを貼り付けます",
        "将 JSON 数据粘贴到输入编辑器",
        "الصق بيانات JSON في محرر الإدخال"
    ],
    "Select 'Prettify' to format with proper indentation, 'Minify' to compress, or 'Validate' to check syntax": [
        "इंडेंट के लिए ‘पठनीय बनाएँ’, संपीड़न के लिए ‘संक्षिप्त करें’ या सिंटैक्स जाँच के लिए ‘सत्यापित करें’ चुनें",
        "Elige «Embellecer» para indentar, «Minimizar» para comprimir o «Validar» para revisar la sintaxis",
        "Choisissez « Embellir » pour indenter, « Minifier » pour compresser ou « Valider » pour vérifier la syntaxe",
        "„Formatieren“ zum Einrücken, „Minimieren“ zum Komprimieren oder „Validieren“ zur Syntaxprüfung wählen",
        "字下げには「整形」、サイズ削減には「圧縮」、構文確認には「検証」を選びます",
        "选择“美化”进行缩进、“压缩”缩小内容或“验证”检查语法",
        "اختر «تحسين التنسيق» للمسافات البادئة أو «تصغير» للضغط أو «تحقق» لفحص الصياغة"
    ],
    "The output appears instantly in the right panel": [
        "आउटपुट परिणाम पैनल में तुरंत दिखता है",
        "La salida aparece al instante en el panel de resultados",
        "Le résultat apparaît immédiatement dans le panneau de sortie",
        "Die Ausgabe erscheint sofort im Ergebnisbereich",
        "結果パネルに出力がすぐに表示されます",
        "输出会立即显示在结果面板中",
        "تظهر النتيجة فورًا في لوحة الإخراج"
    ],
    "Click 'Copy' to copy the result to your clipboard": [
        "परिणाम क्लिपबोर्ड पर लेने के लिए ‘कॉपी करें’ दबाएँ",
        "Pulsa «Copiar» para copiar el resultado al portapapeles",
        "Cliquez sur « Copier » pour copier le résultat dans le presse-papiers",
        "Mit „Kopieren“ das Ergebnis in die Zwischenablage übernehmen",
        "「コピー」で結果をクリップボードにコピーします",
        "点击“复制”将结果复制到剪贴板",
        "اضغط «نسخ» لنسخ النتيجة إلى الحافظة"
    ],
    "Use Prettify mode when debugging API responses or reading config files": [
        "API प्रतिक्रियाएँ डीबग करते या कॉन्फ़िग फ़ाइलें पढ़ते समय पठनीय मोड इस्तेमाल करें",
        "Usa Embellecer para depurar respuestas API o leer configuraciones",
        "Utilisez Embellir pour déboguer les réponses API ou lire les configurations",
        "Zum Prüfen von API-Antworten oder Lesen von Konfigurationen Formatieren verwenden",
        "API応答のデバッグや設定ファイルの閲覧には整形モードを使います",
        "调试 API 响应或阅读配置文件时使用美化模式",
        "استخدم تحسين التنسيق لتصحيح استجابات API أو قراءة ملفات الإعداد"
    ],
    "Use Minify mode before sending JSON over the network to reduce payload size": [
        "पेलोड का आकार घटाने के लिए नेटवर्क पर JSON भेजने से पहले संक्षिप्त मोड इस्तेमाल करें",
        "Usa Minimizar antes de enviar JSON por la red para reducir el tamaño",
        "Utilisez Minifier avant l’envoi réseau pour réduire la taille du JSON",
        "Vor dem Netzwerkversand JSON minimieren, um die Nutzlast zu verkleinern",
        "ネットワーク送信前に圧縮するとJSONのサイズを減らせます",
        "通过网络发送 JSON 前使用压缩模式缩小载荷",
        "استخدم التصغير قبل إرسال JSON عبر الشبكة لتقليل حجم الحمولة"
    ],
    "Validate mode is useful for catching syntax errors like missing commas or unquoted keys": [
        "गायब कॉमा या बिना उद्धरण वाली कुंजियों जैसी सिंटैक्स त्रुटियाँ पकड़ने के लिए सत्यापन मोड उपयोगी है",
        "Validar detecta errores de sintaxis como comas ausentes o claves sin comillas",
        "Valider détecte les erreurs de syntaxe comme les virgules manquantes ou les clés sans guillemets",
        "Validieren erkennt Syntaxfehler wie fehlende Kommas oder Schlüssel ohne Anführungszeichen",
        "検証モードでは、カンマの欠落や引用符のないキーなどの構文エラーを確認できます",
        "验证模式可发现缺少逗号、键未加引号等语法错误",
        "يساعد التحقق في كشف أخطاء الصياغة مثل الفواصل المفقودة أو المفاتيح دون علامات اقتباس"
    ],
    "The editor supports syntax highlighting for easier navigation": [
        "आसान नेविगेशन के लिए एडिटर सिंटैक्स हाइलाइट करता है",
        "El editor resalta la sintaxis para facilitar la navegación",
        "L’éditeur colore la syntaxe pour faciliter la navigation",
        "Der Editor hebt die Syntax zur leichteren Orientierung hervor",
        "エディターは構文を強調表示し、読み取りを助けます",
        "编辑器支持语法高亮，便于浏览",
        "يدعم المحرر تمييز الصياغة لتسهيل التصفح"
    ],
    "Formatting API responses for debugging": [
        "डीबगिंग के लिए API प्रतिक्रियाएँ फ़ॉर्मैट करना",
        "Dar formato a respuestas API para depurarlas",
        "Formater les réponses API pour le débogage",
        "API-Antworten zur Fehlersuche formatieren",
        "デバッグ用にAPI応答を整形",
        "格式化 API 响应以便调试",
        "تنسيق استجابات API لتصحيحها"
    ],
    "Preparing JSON configuration files for deployment": [
        "डिप्लॉयमेंट के लिए JSON कॉन्फ़िगरेशन फ़ाइलें तैयार करना",
        "Preparar configuraciones JSON para el despliegue",
        "Préparer les configurations JSON pour le déploiement",
        "JSON-Konfigurationen für die Bereitstellung vorbereiten",
        "デプロイ用のJSON設定ファイルを準備",
        "准备部署用的 JSON 配置文件",
        "إعداد ملفات JSON للنشر"
    ],
    "Validating JSON payloads before sending to servers": [
        "सर्वर को भेजने से पहले JSON पेलोड सत्यापित करना",
        "Validar cargas JSON antes de enviarlas a servidores",
        "Valider les charges JSON avant leur envoi aux serveurs",
        "JSON-Nutzlasten vor dem Senden an Server validieren",
        "サーバー送信前にJSONペイロードを検証",
        "向服务器发送前验证 JSON 载荷",
        "التحقق من حمولات JSON قبل إرسالها إلى الخوادم"
    ],
    "Converting minified JSON from production logs into readable format": [
        "प्रोडक्शन लॉग के संक्षिप्त JSON को पठनीय बनाना",
        "Hacer legible el JSON minimizado de registros de producción",
        "Rendre lisible le JSON minifié des journaux de production",
        "Minimiertes JSON aus Produktionsprotokollen lesbar machen",
        "本番ログの圧縮JSONを読みやすく変換",
        "将生产日志中的压缩 JSON 转为可读格式",
        "تحويل JSON المصغّر من سجلات الإنتاج إلى صيغة مقروءة"
    ],
    "Invalid JSON": [
        "अमान्य JSON",
        "JSON no válido",
        "JSON invalide",
        "Ungültiges JSON",
        "無効なJSON",
        "无效 JSON",
        "JSON غير صالح"
    ],
    "Paste JSON and it will be validated automatically": [
        "JSON पेस्ट करें, उसका सत्यापन अपने आप होगा",
        "Pega JSON y se validará automáticamente",
        "Collez du JSON pour le valider automatiquement",
        "JSON einfügen, um es automatisch zu validieren",
        "JSONを貼り付けると自動で検証します",
        "粘贴 JSON 后将自动验证",
        "الصق JSON ليتم التحقق منه تلقائيًا"
    ],
    "JSON is valid!": [
        "JSON मान्य है!",
        "¡JSON válido!",
        "Le JSON est valide !",
        "JSON ist gültig!",
        "JSONは有効です！",
        "JSON 有效！",
        "JSON صالح!"
    ],
    "JSON is invalid": [
        "JSON अमान्य है",
        "El JSON no es válido",
        "Le JSON est invalide",
        "JSON ist ungültig",
        "JSONは無効です",
        "JSON 无效",
        "JSON غير صالح"
    ],
    "Validate JSON syntax with detailed error messages": [
        "विस्तृत त्रुटि संदेशों के साथ JSON सिंटैक्स सत्यापित करें",
        "Valida la sintaxis JSON con mensajes de error detallados",
        "Validez la syntaxe JSON avec des erreurs détaillées",
        "JSON-Syntax mit ausführlichen Fehlermeldungen prüfen",
        "詳細なエラーメッセージでJSON構文を検証",
        "验证 JSON 语法并查看详细错误信息",
        "تحقق من صياغة JSON مع رسائل خطأ تفصيلية"
    ],
    "A JSON validator checks whether a JSON document is syntactically correct according to the JSON specification. It identifies issues like missing quotes, trailing commas, and malformed structures.": [
        "JSON वैलिडेटर जाँचता है कि दस्तावेज़ JSON विनिर्देश के अनुसार सही है या नहीं। यह गायब उद्धरण, अंतिम कॉमा और गलत संरचनाएँ पहचानता है।",
        "Un validador JSON comprueba que un documento siga la sintaxis de la especificación JSON. Detecta comillas ausentes, comas finales y estructuras incorrectas.",
        "Un validateur JSON vérifie la conformité de la syntaxe d’un document à la spécification JSON. Il détecte les guillemets manquants, les virgules finales et les structures incorrectes.",
        "Ein JSON-Validator prüft, ob die Syntax eines Dokuments der JSON-Spezifikation entspricht. Er erkennt fehlende Anführungszeichen, abschließende Kommas und fehlerhafte Strukturen.",
        "JSONバリデーターは、ドキュメントがJSON仕様の構文に準拠しているかを確認します。引用符の欠落、末尾のカンマ、不正な構造を検出します。",
        "JSON 验证工具检查文档语法是否符合 JSON 规范，可识别缺少引号、尾随逗号和结构错误等问题。",
        "يتحقق مدقق JSON من صحة صياغة المستند وفق مواصفات JSON. ويكشف علامات الاقتباس المفقودة والفواصل الختامية والبنى غير الصحيحة."
    ],
    "Invalid JSON causes parsing errors that can crash applications. Validating JSON before processing helps catch issues early, especially when working with API responses, configs, or data imports.": [
        "अमान्य JSON की पार्स त्रुटियाँ ऐप बंद कर सकती हैं। प्रोसेस करने से पहले सत्यापन करने से API प्रतिक्रियाओं, कॉन्फ़िग और डेटा आयात में समस्याएँ जल्दी पकड़ में आती हैं।",
        "El JSON incorrecto causa errores de análisis que pueden detener aplicaciones. Validarlo antes de procesarlo permite detectar problemas pronto en respuestas API, configuraciones e importaciones.",
        "Un JSON invalide provoque des erreurs d’analyse pouvant arrêter une application. La validation préalable détecte les problèmes tôt dans les réponses API, configurations et imports.",
        "Ungültiges JSON verursacht Parsefehler, die Anwendungen zum Absturz bringen können. Die Prüfung vor der Verarbeitung erkennt Probleme in API-Antworten, Konfigurationen und Importen frühzeitig.",
        "不正なJSONは解析エラーを起こし、アプリが停止する原因になります。処理前に検証することで、API応答、設定、データインポートの問題を早期に発見できます。",
        "无效 JSON 会导致解析错误，甚至使应用崩溃。处理前验证有助于及早发现 API 响应、配置或数据导入中的问题。",
        "يسبب JSON غير الصالح أخطاء تحليل قد توقف التطبيقات. يساعد التحقق قبل المعالجة في اكتشاف مشاكل استجابات API والإعدادات واستيراد البيانات مبكرًا."
    ],
    "Paste or type your JSON in the input editor": [
        "इनपुट एडिटर में JSON पेस्ट करें या लिखें",
        "Pega o escribe JSON en el editor de entrada",
        "Collez ou saisissez du JSON dans l’éditeur d’entrée",
        "JSON im Eingabeeditor einfügen oder eingeben",
        "入力エディターにJSONを貼り付けるか入力します",
        "在输入编辑器中粘贴或输入 JSON",
        "الصق JSON أو اكتبه في محرر الإدخال"
    ],
    "Validation happens automatically as you type": [
        "लिखते समय सत्यापन अपने आप होता है",
        "La validación es automática al escribir",
        "La validation est automatique pendant la saisie",
        "Die Validierung erfolgt automatisch beim Tippen",
        "入力に応じて自動で検証します",
        "输入时自动验证",
        "يتم التحقق تلقائيًا أثناء الكتابة"
    ],
    "Errors show the exact line and character position": [
        "त्रुटियों में पंक्ति और अक्षर की स्थिति दिखाई जाती है",
        "Los errores muestran la línea y la posición del carácter",
        "Les erreurs indiquent la ligne et la position du caractère",
        "Fehler zeigen Zeile und Zeichenposition an",
        "エラーには行と文字位置が表示されます",
        "错误会显示行号和字符位置",
        "تعرض الأخطاء السطر وموضع الحرف"
    ],
    "Valid JSON shows structure stats (objects, arrays, keys)": [
        "मान्य JSON के लिए संरचना के आँकड़े दिखते हैं (ऑब्जेक्ट, ऐरे, कुंजियाँ)",
        "El JSON válido muestra estadísticas de estructura (objetos, matrices, claves)",
        "Un JSON valide affiche des statistiques de structure (objets, tableaux, clés)",
        "Gültiges JSON zeigt Strukturstatistiken (Objekte, Arrays, Schlüssel)",
        "有効なJSONには構造の統計（オブジェクト、配列、キー）を表示します",
        "有效 JSON 会显示结构统计（对象、数组、键）",
        "يعرض JSON الصالح إحصاءات البنية (الكائنات والمصفوفات والمفاتيح)"
    ],
    "JSON requires double quotes for strings, not single quotes": [
        "JSON स्ट्रिंग में एकल के बजाय दोहरे उद्धरण चाहिए",
        "JSON exige comillas dobles para las cadenas, no simples",
        "JSON exige des guillemets doubles pour les chaînes, pas simples",
        "JSON erfordert doppelte statt einfache Anführungszeichen für Zeichenfolgen",
        "JSONの文字列には単一引用符ではなく二重引用符が必要です",
        "JSON 字符串必须使用双引号，不能使用单引号",
        "يتطلب JSON علامات اقتباس مزدوجة للسلاسل النصية، لا مفردة"
    ],
    "Trailing commas after the last item are not allowed": [
        "अंतिम आइटम के बाद कॉमा की अनुमति नहीं है",
        "No se permiten comas tras el último elemento",
        "Les virgules après le dernier élément sont interdites",
        "Nach dem letzten Element ist kein Komma zulässig",
        "最後の要素の後にカンマは付けられません",
        "最后一项后不能添加逗号",
        "لا يُسمح بفاصلة بعد العنصر الأخير"
    ],
    "Keys must be quoted strings, not bare identifiers": [
        "कुंजियाँ उद्धरण वाली स्ट्रिंग होनी चाहिए, बिना उद्धरण के पहचानकर्ता नहीं",
        "Las claves deben ser cadenas entre comillas, no identificadores sin ellas",
        "Les clés doivent être des chaînes entre guillemets, pas des identifiants nus",
        "Schlüssel müssen Zeichenfolgen in Anführungszeichen sein, keine bloßen Bezeichner",
        "キーには引用符で囲んだ文字列を使い、裸の識別子は使えません",
        "键必须是加引号的字符串，不能是裸标识符",
        "يجب أن تكون المفاتيح سلاسل بين علامات اقتباس وليست معرّفات مجردة"
    ],
    "Use JSON5 syntax for comments (though not standard JSON)": [
        "टिप्पणियों के लिए JSON5 सिंटैक्स इस्तेमाल करें (यह मानक JSON नहीं है)",
        "Usa JSON5 para comentarios (no es JSON estándar)",
        "Utilisez JSON5 pour les commentaires (ce n’est pas du JSON standard)",
        "Für Kommentare JSON5 verwenden (kein Standard-JSON)",
        "コメントにはJSON5を使います（標準JSONではありません）",
        "注释可使用 JSON5 语法（并非标准 JSON）",
        "استخدم JSON5 للتعليقات (ليس JSON قياسيًا)"
    ],
    "Validating API responses before processing": [
        "प्रोसेस करने से पहले API प्रतिक्रियाएँ सत्यापित करना",
        "Validar respuestas API antes de procesarlas",
        "Valider les réponses API avant traitement",
        "API-Antworten vor der Verarbeitung validieren",
        "処理前にAPI応答を検証",
        "处理前验证 API 响应",
        "التحقق من استجابات API قبل معالجتها"
    ],
    "Debugging malformed configuration files": [
        "गलत कॉन्फ़िगरेशन फ़ाइलें डीबग करना",
        "Depurar archivos de configuración incorrectos",
        "Déboguer les fichiers de configuration incorrects",
        "Fehlerhafte Konfigurationsdateien untersuchen",
        "不正な設定ファイルをデバッグ",
        "调试格式错误的配置文件",
        "تصحيح ملفات الإعداد غير الصحيحة"
    ],
    "Checking JSON exports from databases": [
        "डेटाबेस से निकले JSON की जाँच करना",
        "Comprobar exportaciones JSON de bases de datos",
        "Vérifier les exports JSON des bases de données",
        "JSON-Exporte aus Datenbanken prüfen",
        "データベースのJSONエクスポートを確認",
        "检查数据库导出的 JSON",
        "فحص صادرات JSON من قواعد البيانات"
    ],
    "Verifying JSON payloads in webhooks": [
        "Webhook के JSON पेलोड सत्यापित करना",
        "Verificar cargas JSON de webhooks",
        "Vérifier les charges JSON des webhooks",
        "JSON-Nutzlasten von Webhooks prüfen",
        "WebhookのJSONペイロードを検証",
        "验证 Webhook 中的 JSON 载荷",
        "التحقق من حمولات JSON في Webhook"
    ],
    "Validation Result": [
        "सत्यापन परिणाम",
        "Resultado de validación",
        "Résultat de validation",
        "Validierungsergebnis",
        "検証結果",
        "验证结果",
        "نتيجة التحقق"
    ],
    "The JSON is well-formed and valid.": [
        "JSON की संरचना सही और मान्य है।",
        "El JSON está bien formado y es válido.",
        "Le JSON est bien formé et valide.",
        "Das JSON ist wohlgeformt und gültig.",
        "JSONの形式は正しく、有効です。",
        "JSON 格式正确且有效。",
        "JSON سليم البنية وصالح."
    ],
    "Type: {type}": [
        "प्रकार: {type}",
        "Tipo: {type}",
        "Type : {type}",
        "Typ: {type}",
        "型：{type}",
        "类型：{type}",
        "النوع: {type}"
    ],
    "Keys: {count}": [
        "कुंजियाँ: {count}",
        "Claves: {count}",
        "Clés : {count}",
        "Schlüssel: {count}",
        "キー数：{count}",
        "键数：{count}",
        "المفاتيح: {count}"
    ],
    "Length: {count}": [
        "लंबाई: {count}",
        "Longitud: {count}",
        "Longueur : {count}",
        "Länge: {count}",
        "長さ：{count}",
        "长度：{count}",
        "الطول: {count}"
    ],
    "Depth: {count}": [
        "गहराई: {count}",
        "Profundidad: {count}",
        "Profondeur : {count}",
        "Tiefe: {count}",
        "深さ：{count}",
        "深度：{count}",
        "العمق: {count}"
    ],
    "Input is empty": [
        "इनपुट खाली है",
        "La entrada está vacía",
        "L’entrée est vide",
        "Die Eingabe ist leer",
        "入力が空です",
        "输入为空",
        "الإدخال فارغ"
    ],
    "Line {line}, Column {column}": [
        "पंक्ति {line}, स्तंभ {column}",
        "Línea {line}, columna {column}",
        "Ligne {line}, colonne {column}",
        "Zeile {line}, Spalte {column}",
        "行 {line}、列 {column}",
        "第 {line} 行，第 {column} 列",
        "السطر {line}، العمود {column}"
    ],
    "Common JSON Errors": [
        "JSON की सामान्य त्रुटियाँ",
        "Errores JSON habituales",
        "Erreurs JSON courantes",
        "Häufige JSON-Fehler",
        "よくあるJSONエラー",
        "常见 JSON 错误",
        "أخطاء JSON الشائعة"
    ],
    "Trailing commas": [
        "अंतिम कॉमा",
        "Comas finales",
        "Virgules finales",
        "Abschließende Kommas",
        "末尾のカンマ",
        "尾随逗号",
        "الفواصل الختامية"
    ],
    "JSON doesn't allow trailing commas after the last item in arrays or objects.": [
        "JSON में ऐरे या ऑब्जेक्ट के अंतिम आइटम के बाद कॉमा नहीं हो सकता।",
        "JSON no permite comas tras el último elemento de matrices u objetos.",
        "JSON interdit les virgules après le dernier élément d’un tableau ou objet.",
        "JSON erlaubt keine Kommas nach dem letzten Element von Arrays oder Objekten.",
        "JSONの配列やオブジェクトでは最後の要素の後にカンマを付けられません。",
        "JSON 不允许在数组或对象的最后一项后添加逗号。",
        "لا يسمح JSON بفاصلة بعد آخر عنصر في المصفوفات أو الكائنات."
    ],
    "Single quotes": [
        "एकल उद्धरण",
        "Comillas simples",
        "Guillemets simples",
        "Einfache Anführungszeichen",
        "単一引用符",
        "单引号",
        "علامات الاقتباس المفردة"
    ],
    "JSON requires double quotes for strings, not single quotes.": [
        "JSON स्ट्रिंग में एकल के बजाय दोहरे उद्धरण चाहिए।",
        "JSON exige comillas dobles para las cadenas, no simples.",
        "JSON exige des guillemets doubles pour les chaînes, pas simples.",
        "JSON erfordert doppelte statt einfache Anführungszeichen für Zeichenfolgen.",
        "JSONの文字列には単一引用符ではなく二重引用符が必要です。",
        "JSON 字符串必须使用双引号，不能使用单引号。",
        "يتطلب JSON علامات اقتباس مزدوجة للسلاسل النصية، لا مفردة."
    ],
    "Unquoted keys": [
        "बिना उद्धरण की कुंजियाँ",
        "Claves sin comillas",
        "Clés sans guillemets",
        "Schlüssel ohne Anführungszeichen",
        "引用符のないキー",
        "未加引号的键",
        "مفاتيح دون علامات اقتباس"
    ],
    "Object keys must be enclosed in double quotes.": [
        "ऑब्जेक्ट की कुंजियाँ दोहरे उद्धरणों में होनी चाहिए।",
        "Las claves de objetos deben ir entre comillas dobles.",
        "Les clés d’objet doivent être entre guillemets doubles.",
        "Objektschlüssel müssen in doppelten Anführungszeichen stehen.",
        "オブジェクトのキーは二重引用符で囲む必要があります。",
        "对象键必须用双引号括起来。",
        "يجب وضع مفاتيح الكائنات بين علامتي اقتباس مزدوجتين."
    ],
    "Comments": [
        "टिप्पणियाँ",
        "Comentarios",
        "Commentaires",
        "Kommentare",
        "コメント",
        "注释",
        "التعليقات"
    ],
    "JSON doesn't support comments. Use JSONC or JSON5 for comments.": [
        "JSON में टिप्पणियाँ नहीं हैं। टिप्पणियों के लिए JSONC या JSON5 इस्तेमाल करें।",
        "JSON no admite comentarios. Usa JSONC o JSON5 para ellos.",
        "JSON ne prend pas en charge les commentaires. Utilisez JSONC ou JSON5.",
        "JSON unterstützt keine Kommentare. Dafür JSONC oder JSON5 verwenden.",
        "JSONはコメントをサポートしません。コメントにはJSONCやJSON5を使います。",
        "JSON 不支持注释。需要注释时可使用 JSONC 或 JSON5。",
        "لا يدعم JSON التعليقات. استخدم JSONC أو JSON5 للتعليقات."
    ],
    "Special values": [
        "विशेष मान",
        "Valores especiales",
        "Valeurs spéciales",
        "Besondere Werte",
        "特殊な値",
        "特殊值",
        "القيم الخاصة"
    ],
    "undefined, NaN, and Infinity are not valid JSON values.": [
        "undefined, NaN और Infinity मान्य JSON मान नहीं हैं।",
        "undefined, NaN e Infinity no son valores JSON válidos.",
        "undefined, NaN et Infinity ne sont pas des valeurs JSON valides.",
        "undefined, NaN und Infinity sind keine gültigen JSON-Werte.",
        "undefined、NaN、Infinityは有効なJSON値ではありません。",
        "undefined、NaN 和 Infinity 不是有效的 JSON 值。",
        "undefined وNaN وInfinity ليست قيم JSON صالحة."
    ],
    "JSON Quick Reference": [
        "JSON त्वरित संदर्भ",
        "Referencia rápida de JSON",
        "Aide-mémoire JSON",
        "JSON-Kurzreferenz",
        "JSONクイックリファレンス",
        "JSON 速查",
        "مرجع JSON السريع"
    ],
    "Strings must use double quotes": [
        "स्ट्रिंग में दोहरे उद्धरण चाहिए",
        "Las cadenas deben usar comillas dobles",
        "Les chaînes exigent des guillemets doubles",
        "Zeichenfolgen benötigen doppelte Anführungszeichen",
        "文字列には二重引用符を使用",
        "字符串必须使用双引号",
        "يجب أن تستخدم السلاسل علامات اقتباس مزدوجة"
    ],
    "Numbers can be integers or floats": [
        "संख्याएँ पूर्णांक या दशमलव हो सकती हैं",
        "Los números pueden ser enteros o decimales",
        "Les nombres peuvent être entiers ou décimaux",
        "Zahlen können ganzzahlig oder gebrochen sein",
        "数値には整数と小数を使用可能",
        "数字可以是整数或小数",
        "يمكن أن تكون الأرقام صحيحة أو عشرية"
    ],
    "Booleans: true or false (lowercase)": [
        "बूलियन: true या false (छोटे अक्षरों में)",
        "Booleanos: true o false (en minúsculas)",
        "Booléens : true ou false (en minuscules)",
        "Boolesche Werte: true oder false (kleingeschrieben)",
        "真偽値：trueまたはfalse（小文字）",
        "布尔值：true 或 false（小写）",
        "القيم المنطقية: true أو false (بأحرف صغيرة)"
    ],
    "Null value: null (lowercase)": [
        "रिक्त मान: null (छोटे अक्षरों में)",
        "Valor nulo: null (en minúsculas)",
        "Valeur nulle : null (en minuscules)",
        "Nullwert: null (kleingeschrieben)",
        "ヌル値：null（小文字）",
        "空值：null（小写）",
        "القيمة الخالية: null (بأحرف صغيرة)"
    ],
    "Arrays: [item1, item2, ...]": [
        "ऐरे: [item1, item2, ...]",
        "Matrices: [item1, item2, ...]",
        "Tableaux : [item1, item2, ...]",
        "Arrays: [item1, item2, ...]",
        "配列：[item1, item2, ...]",
        "数组：[item1, item2, ...]",
        "المصفوفات: [item1, item2, ...]"
    ],
    "Objects: {example}": [
        "ऑब्जेक्ट: {example}",
        "Objetos: {example}",
        "Objets : {example}",
        "Objekte: {example}",
        "オブジェクト：{example}",
        "对象：{example}",
        "الكائنات: {example}"
    ],
    "Schema and instance together exceed the 2 MiB limit.": [
        "स्कीमा और इंस्टेंस का कुल आकार 2 MiB से अधिक है।",
        "El esquema y la instancia superan juntos el límite de 2 MiB.",
        "Le schéma et l’instance dépassent ensemble la limite de 2 Mio.",
        "Schema und Instanz überschreiten zusammen die Grenze von 2 MiB.",
        "スキーマとインスタンスの合計が2 MiBの上限を超えています。",
        "架构和实例的总大小超过 2 MiB 限制。",
        "يتجاوز المخطط والمثيل معًا حد 2 MiB."
    ],
    "Validation exceeded five seconds. Simplify the schema or input; validity has not been determined.": [
        "सत्यापन में पाँच सेकंड से अधिक लगे। स्कीमा या इनपुट सरल करें; वैधता तय नहीं हुई है।",
        "La validación superó cinco segundos. Simplifica el esquema o la entrada; no se ha determinado su validez.",
        "La validation a dépassé cinq secondes. Simplifiez le schéma ou l’entrée ; la validité n’a pas été déterminée.",
        "Die Validierung dauerte länger als fünf Sekunden. Schema oder Eingabe vereinfachen; die Gültigkeit wurde nicht ermittelt.",
        "検証が5秒を超えました。スキーマか入力を簡素化してください。有効性は判定されていません。",
        "验证超过五秒。请简化架构或输入；尚未确定有效性。",
        "تجاوز التحقق خمس ثوانٍ. بسّط المخطط أو الإدخال؛ لم تُحدَّد الصلاحية."
    ],
    "Validation worker failed. No validity claim can be made.": [
        "सत्यापन वर्कर विफल हुआ। वैधता का दावा नहीं किया जा सकता।",
        "Falló el proceso de validación. No se puede afirmar la validez.",
        "Le worker de validation a échoué. Aucune validité ne peut être affirmée.",
        "Der Validierungs-Worker ist fehlgeschlagen. Es ist keine Aussage zur Gültigkeit möglich.",
        "検証ワーカーが失敗しました。有効性は判断できません。",
        "验证工作线程失败。无法判断有效性。",
        "فشل عامل التحقق. لا يمكن إصدار حكم بالصلاحية."
    ],
    "Unable to validate the document. Check the schema and instance, then try again.": [
        "दस्तावेज़ सत्यापित नहीं हुआ। स्कीमा और इंस्टेंस जाँचकर फिर कोशिश करें।",
        "No se pudo validar el documento. Revisa el esquema y la instancia e inténtalo de nuevo.",
        "Impossible de valider le document. Vérifiez le schéma et l’instance, puis réessayez.",
        "Das Dokument konnte nicht validiert werden. Schema und Instanz prüfen und erneut versuchen.",
        "ドキュメントを検証できませんでした。スキーマとインスタンスを確認して再試行してください。",
        "无法验证文档。请检查架构和实例后重试。",
        "تعذر التحقق من المستند. راجع المخطط والمثيل وحاول مجددًا."
    ],
    "Validate JSON or YAML data against a local JSON Schema and explain each issue": [
        "स्थानीय JSON Schema से JSON या YAML डेटा सत्यापित करें और हर समस्या समझें",
        "Valida datos JSON o YAML con un JSON Schema local y explica cada problema",
        "Validez les données JSON ou YAML avec un JSON Schema local et expliquez chaque problème",
        "JSON- oder YAML-Daten mit lokalem JSON Schema prüfen und jedes Problem erläutern",
        "ローカルのJSON SchemaでJSON・YAMLデータを検証し、各問題を確認",
        "根据本地 JSON Schema 验证 JSON 或 YAML 数据并说明各项问题",
        "تحقق من بيانات JSON أو YAML باستخدام JSON Schema محلي مع شرح كل مشكلة"
    ],
    "A local JSON Schema validator supporting Draft 2020-12, Draft 2019-09 and Draft-07, including composition, conditionals, formats and local references.": [
        "स्थानीय JSON Schema वैलिडेटर Draft 2020-12, Draft 2019-09 और Draft-07 सहित संयोजन, शर्तों, फ़ॉर्मैट और स्थानीय संदर्भों का समर्थन करता है।",
        "Validador local de JSON Schema compatible con Draft 2020-12, Draft 2019-09 y Draft-07, incluidas composición, condiciones, formatos y referencias locales.",
        "Validateur JSON Schema local prenant en charge Draft 2020-12, Draft 2019-09 et Draft-07, avec composition, conditions, formats et références locales.",
        "Lokaler JSON-Schema-Validator für Draft 2020-12, Draft 2019-09 und Draft-07 mit Komposition, Bedingungen, Formaten und lokalen Referenzen.",
        "Draft 2020-12、Draft 2019-09、Draft-07に対応したローカルJSON Schema検証ツールです。合成、条件、形式、ローカル参照をサポートします。",
        "本地 JSON Schema 验证工具支持 Draft 2020-12、Draft 2019-09 和 Draft-07，包括组合、条件、格式和本地引用。",
        "مدقق JSON Schema محلي يدعم Draft 2020-12 وDraft 2019-09 وDraft-07، بما فيها التركيب والشروط والتنسيقات والمراجع المحلية."
    ],
    "It gives an API author and a consumer a shared way to test sample payloads before a service is deployed.": [
        "API लेखक और उपभोक्ता सेवा डिप्लॉय होने से पहले एक ही तरीके से नमूना पेलोड जाँच सकते हैं।",
        "Ofrece a autores y consumidores de API una forma común de probar cargas de ejemplo antes de desplegar el servicio.",
        "Les auteurs et consommateurs d’API partagent une méthode de test des charges d’exemple avant le déploiement du service.",
        "API-Autoren und -Nutzer können Beispielnutzlasten vor der Bereitstellung eines Dienstes auf gemeinsame Weise prüfen.",
        "サービスのデプロイ前に、APIの提供側と利用側が同じ方法でサンプルペイロードをテストできます。",
        "API 作者与使用者可在服务部署前用相同方法测试示例载荷。",
        "يوفر لمؤلف API ومستهلكه طريقة مشتركة لاختبار حمولات نموذجية قبل نشر الخدمة."
    ],
    "Paste a JSON Schema on the left": [
        "स्कीमा एडिटर में JSON Schema पेस्ट करें",
        "Pega un JSON Schema en el editor de esquema",
        "Collez un JSON Schema dans l’éditeur de schéma",
        "JSON Schema im Schemaeditor einfügen",
        "スキーマエディターにJSON Schemaを貼り付けます",
        "将 JSON Schema 粘贴到架构编辑器",
        "الصق JSON Schema في محرر المخطط"
    ],
    "Paste a JSON or YAML instance on the right": [
        "डेटा एडिटर में JSON या YAML इंस्टेंस पेस्ट करें",
        "Pega una instancia JSON o YAML en el editor de datos",
        "Collez une instance JSON ou YAML dans l’éditeur de données",
        "JSON- oder YAML-Instanz im Dateneditor einfügen",
        "データエディターにJSONまたはYAMLインスタンスを貼り付けます",
        "将 JSON 或 YAML 实例粘贴到数据编辑器",
        "الصق مثيل JSON أو YAML في محرر البيانات"
    ],
    "Choose Validate instance": [
        "‘इंस्टेंस सत्यापित करें’ चुनें",
        "Elige «Validar instancia»",
        "Choisissez « Valider l’instance »",
        "„Instanz validieren“ wählen",
        "「インスタンスを検証」を選びます",
        "选择“验证实例”",
        "اختر «التحقق من المثيل»"
    ],
    "Use the JSON Pointer path in each result to correct the payload or schema": [
        "पेलोड या स्कीमा ठीक करने के लिए हर परिणाम का JSON Pointer पथ देखें",
        "Usa la ruta JSON Pointer de cada resultado para corregir la carga o el esquema",
        "Utilisez le chemin JSON Pointer de chaque résultat pour corriger la charge ou le schéma",
        "Mit dem JSON-Pointer-Pfad jedes Ergebnisses die Nutzlast oder das Schema korrigieren",
        "各結果のJSON Pointerパスを使い、ペイロードやスキーマを修正します",
        "使用各结果的 JSON Pointer 路径修正载荷或架构",
        "استخدم مسار JSON Pointer في كل نتيجة لتصحيح الحمولة أو المخطط"
    ],
    "Local #/$defs and #/definitions references are supported.": [
        "स्थानीय #/$defs और #/definitions संदर्भ समर्थित हैं।",
        "Se admiten referencias locales #/$defs y #/definitions.",
        "Les références locales #/$defs et #/definitions sont prises en charge.",
        "Lokale Referenzen #/$defs und #/definitions werden unterstützt.",
        "ローカルの#/$defsと#/definitions参照に対応しています。",
        "支持本地 #/$defs 和 #/definitions 引用。",
        "تُدعم المراجع المحلية #/$defs و#/definitions."
    ],
    "Remote references are never fetched. Unresolved references, unknown keywords and unsupported dialects produce schema errors instead of a validity claim.": [
        "दूरस्थ संदर्भ कभी डाउनलोड नहीं होते। अनसुलझे संदर्भ, अज्ञात कीवर्ड और असमर्थित डायलेक्ट पर वैधता के दावे के बजाय स्कीमा त्रुटि मिलती है।",
        "Las referencias remotas nunca se descargan. Las no resueltas, palabras clave desconocidas y dialectos no compatibles producen errores de esquema sin afirmar validez.",
        "Les références distantes ne sont jamais téléchargées. Les références non résolues, mots-clés inconnus et dialectes non pris en charge produisent des erreurs de schéma sans affirmer la validité.",
        "Entfernte Referenzen werden nie abgerufen. Nicht auflösbare Referenzen, unbekannte Schlüsselwörter und nicht unterstützte Dialekte erzeugen Schemafehler statt einer Gültigkeitsaussage.",
        "リモート参照は取得しません。未解決の参照、不明なキーワード、未対応の方言はスキーマエラーになり、有効性を判定しません。",
        "永不获取远程引用。未解析的引用、未知关键字和不支持的方言将产生架构错误，而不作出有效性判断。",
        "لا تُجلب المراجع البعيدة مطلقًا. تنتج المراجع غير المحلولة والكلمات غير المعروفة واللهجات غير المدعومة أخطاء مخطط دون الحكم بالصلاحية."
    ],
    "Validation runs in a separate worker with a five-second limit to keep the page responsive.": [
        "पेज को प्रतिक्रियाशील रखने के लिए सत्यापन अलग वर्कर में पाँच सेकंड की सीमा के साथ चलता है।",
        "La validación se ejecuta en un worker separado con un límite de cinco segundos para mantener la página ágil.",
        "La validation s’exécute dans un worker séparé limité à cinq secondes pour garder la page réactive.",
        "Die Validierung läuft in einem separaten Worker mit fünf Sekunden Zeitlimit, damit die Seite bedienbar bleibt.",
        "ページの応答性を保つため、検証は5秒の制限付きで別ワーカー内で実行します。",
        "验证在独立工作线程中运行，限时五秒以保持页面响应。",
        "يعمل التحقق في عامل منفصل بحد خمس ثوانٍ للحفاظ على استجابة الصفحة."
    ],
    "OpenAPI payload design": [
        "OpenAPI पेलोड डिज़ाइन",
        "Diseño de cargas OpenAPI",
        "Conception de charges OpenAPI",
        "OpenAPI-Nutzlastentwurf",
        "OpenAPIペイロードの設計",
        "OpenAPI 载荷设计",
        "تصميم حمولات OpenAPI"
    ],
    "Configuration-file validation": [
        "कॉन्फ़िगरेशन फ़ाइल सत्यापन",
        "Validación de archivos de configuración",
        "Validation des fichiers de configuration",
        "Validierung von Konfigurationsdateien",
        "設定ファイルの検証",
        "配置文件验证",
        "التحقق من ملفات الإعداد"
    ],
    "Webhook fixture testing": [
        "Webhook नमूना परीक्षण",
        "Pruebas de ejemplos de webhook",
        "Test d’exemples de webhook",
        "Testen von Webhook-Testdaten",
        "Webhookのテストデータ検証",
        "Webhook 测试样例验证",
        "اختبار عينات Webhook"
    ],
    "Expected an object with schema and instance fields.": [
        "schema और instance फ़ील्ड वाला ऑब्जेक्ट चाहिए।",
        "Se esperaba un objeto con los campos schema e instance.",
        "Un objet avec les champs schema et instance est attendu.",
        "Ein Objekt mit den Feldern schema und instance wird erwartet.",
        "schemaとinstanceフィールドを持つオブジェクトが必要です。",
        "需要包含 schema 和 instance 字段的对象。",
        "يلزم كائن يحتوي على حقلي schema وinstance."
    ],
    "Invalid JSON fixture.": [
        "अमान्य JSON नमूना।",
        "Ejemplo JSON no válido.",
        "Exemple JSON invalide.",
        "Ungültige JSON-Testdaten.",
        "JSONテストデータが無効です。",
        "JSON 测试样例无效。",
        "عينة JSON غير صالحة."
    ],
    "Validate instance": [
        "इंस्टेंस सत्यापित करें",
        "Validar instancia",
        "Valider l’instance",
        "Instanz validieren",
        "インスタンスを検証",
        "验证实例",
        "التحقق من المثيل"
    ],
    "Issues: {count}": [
        "समस्याएँ: {count}",
        "Problemas: {count}",
        "Problèmes : {count}",
        "Probleme: {count}",
        "問題数：{count}",
        "问题数：{count}",
        "المشاكل: {count}"
    ],
    "Valid instance": [
        "मान्य इंस्टेंस",
        "Instancia válida",
        "Instance valide",
        "Gültige Instanz",
        "有効なインスタンス",
        "有效实例",
        "مثيل صالح"
    ],
    "JSON Schema": [
        "JSON स्कीमा",
        "Esquema JSON",
        "Schéma JSON",
        "JSON-Schema",
        "JSONスキーマ",
        "JSON 架构",
        "مخطط JSON"
    ],
    "Instance data": [
        "इंस्टेंस डेटा",
        "Datos de la instancia",
        "Données de l’instance",
        "Instanzdaten",
        "インスタンスデータ",
        "实例数据",
        "بيانات المثيل"
    ],
    "JSON or YAML instance data": [
        "JSON या YAML इंस्टेंस डेटा",
        "Datos de instancia JSON o YAML",
        "Données d’instance JSON ou YAML",
        "JSON- oder YAML-Instanzdaten",
        "JSONまたはYAMLのインスタンスデータ",
        "JSON 或 YAML 实例数据",
        "بيانات مثيل JSON أو YAML"
    ],
    "The instance satisfies the schema": [
        "इंस्टेंस स्कीमा की शर्तें पूरी करता है",
        "La instancia cumple el esquema",
        "L’instance respecte le schéma",
        "Die Instanz erfüllt das Schema",
        "インスタンスはスキーマを満たしています",
        "实例符合架构",
        "يستوفي المثيل المخطط"
    ],
    "Schema error. Check the schema and local references.": [
        "स्कीमा त्रुटि। स्कीमा और स्थानीय संदर्भ जाँचें।",
        "Error de esquema. Revisa el esquema y las referencias locales.",
        "Erreur de schéma. Vérifiez le schéma et les références locales.",
        "Schemafehler. Schema und lokale Referenzen prüfen.",
        "スキーマエラーです。スキーマとローカル参照を確認してください。",
        "架构错误。请检查架构和本地引用。",
        "خطأ في المخطط. راجع المخطط والمراجع المحلية."
    ],
    "Instance issue. Check the value at this path.": [
        "इंस्टेंस की समस्या। इस पथ का मान जाँचें।",
        "Problema en la instancia. Revisa el valor en esta ruta.",
        "Problème d’instance. Vérifiez la valeur à ce chemin.",
        "Instanzproblem. Den Wert an diesem Pfad prüfen.",
        "インスタンスの問題です。このパスの値を確認してください。",
        "实例有问题。请检查此路径处的值。",
        "مشكلة في المثيل. راجع القيمة في هذا المسار."
    ],
    "string": [
        "स्ट्रिंग",
        "cadena",
        "chaîne",
        "Zeichenfolge",
        "文字列",
        "字符串",
        "سلسلة نصية"
    ],
    "number": [
        "संख्या",
        "número",
        "nombre",
        "Zahl",
        "数値",
        "数字",
        "رقم"
    ],
    "boolean": [
        "बूलियन",
        "booleano",
        "booléen",
        "boolesch",
        "真偽値",
        "布尔值",
        "قيمة منطقية"
    ],
    "object": [
        "ऑब्जेक्ट",
        "objeto",
        "objet",
        "Objekt",
        "オブジェクト",
        "对象",
        "كائن"
    ],
    "undefined": [
        "अपरिभाषित",
        "indefinido",
        "indéfini",
        "undefiniert",
        "未定義",
        "未定义",
        "غير معرّف"
    ]
};
