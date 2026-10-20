import type { TranslationColumns } from "./tool-names";

// Authored UI and help copy; conversion data, parser details and option values stay unchanged.
export const DATA_CONVERTER_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Convert XML documents to JSON format": [
        "XML दस्तावेज़ों को JSON प्रारूप में बदलें",
        "Convierte documentos XML a JSON",
        "Convertissez des documents XML au format JSON",
        "XML-Dokumente in JSON umwandeln",
        "XML文書をJSON形式に変換",
        "将 XML 文档转换为 JSON 格式",
        "تحويل مستندات XML إلى صيغة JSON"
    ],
    "An XML to JSON converter transforms eXtensible Markup Language (XML) documents into JavaScript Object Notation (JSON) format. It preserves attributes, text content, and nested element structures.": [
        "यह कन्वर्टर XML दस्तावेज़ों को JSON में बदलता है। विशेषताएँ, टेक्स्ट सामग्री और नेस्टेड एलिमेंट संरचनाएँ सुरक्षित रहती हैं।",
        "Este conversor transforma documentos XML en JSON y conserva atributos, texto y estructuras de elementos anidados.",
        "Ce convertisseur transforme les documents XML en JSON en conservant les attributs, le texte et les éléments imbriqués.",
        "Dieser Konverter wandelt XML-Dokumente in JSON um und erhält Attribute, Textinhalte und verschachtelte Elementstrukturen.",
        "XML文書をJSON形式に変換します。属性、テキスト内容、入れ子の要素構造を保持します。",
        "此转换器将 XML 文档转换为 JSON，保留属性、文本内容和嵌套元素结构。",
        "يحوّل هذا المحوّل مستندات XML إلى JSON مع الحفاظ على السمات والمحتوى النصي وبنية العناصر المتداخلة."
    ],
    "Modern web applications and REST APIs typically use JSON. This tool helps convert XML data from legacy systems, SOAP services, or configuration files into JSON for easier processing.": [
        "आधुनिक वेब ऐप और REST API आम तौर पर JSON उपयोग करते हैं। पुराने सिस्टम, SOAP सेवाओं और कॉन्फ़िगरेशन फ़ाइलों का XML आसानी से संसाधित करने के लिए JSON में बदलें।",
        "Las aplicaciones web modernas y las API REST suelen usar JSON. Convierte XML de sistemas antiguos, servicios SOAP o archivos de configuración para facilitar su procesamiento.",
        "Les applications web modernes et les API REST utilisent généralement JSON. Convertissez le XML des anciens systèmes, services SOAP ou fichiers de configuration pour faciliter son traitement.",
        "Moderne Webanwendungen und REST-APIs verwenden meist JSON. XML aus Altsystemen, SOAP-Diensten oder Konfigurationsdateien lässt sich damit leichter verarbeiten.",
        "最近のWebアプリやREST APIでは通常JSONを使います。従来のシステム、SOAPサービス、設定ファイルのXMLをJSONに変換して処理しやすくします。",
        "现代 Web 应用和 REST API 通常使用 JSON。将旧系统、SOAP 服务或配置文件中的 XML 转换为 JSON，便于处理。",
        "تستخدم تطبيقات الويب الحديثة وواجهات REST عادةً JSON. حوّل XML من الأنظمة القديمة أو خدمات SOAP أو ملفات الإعدادات لتسهيل معالجته."
    ],
    "Paste your XML content in the input editor": [
        "इनपुट संपादक में XML पेस्ट करें",
        "Pega el XML en el editor de entrada",
        "Collez le XML dans l’éditeur de saisie",
        "XML in den Eingabeeditor einfügen",
        "入力エディターにXMLを貼り付けます",
        "将 XML 粘贴到输入编辑器",
        "الصق XML في محرر الإدخال"
    ],
    "Configure attribute prefix and text content key": [
        "विशेषता उपसर्ग और टेक्स्ट सामग्री की कुंजी सेट करें",
        "Configura el prefijo de atributos y la clave del texto",
        "Configurez le préfixe des attributs et la clé du texte",
        "Attributpräfix und Schlüssel für Textinhalte konfigurieren",
        "属性の接頭辞とテキスト内容のキーを設定します",
        "设置属性前缀和文本内容键",
        "اضبط بادئة السمات ومفتاح المحتوى النصي"
    ],
    "Choose between compact and verbose output formats": [
        "संक्षिप्त या विस्तृत आउटपुट प्रारूप चुनें",
        "Elige una salida compacta o con formato",
        "Choisissez une sortie compacte ou développée",
        "Kompakte oder ausführliche Ausgabe wählen",
        "コンパクトまたは整形された出力を選びます",
        "选择紧凑或展开的输出格式",
        "اختر إخراجًا مضغوطًا أو مفصلًا"
    ],
    "Copy the JSON result for use in your application": [
        "अपने ऐप में उपयोग के लिए JSON परिणाम कॉपी करें",
        "Copia el JSON para usarlo en tu aplicación",
        "Copiez le JSON pour l’utiliser dans votre application",
        "JSON-Ergebnis zur Verwendung in der Anwendung kopieren",
        "アプリで使うJSONの結果をコピーします",
        "复制 JSON 结果供应用使用",
        "انسخ نتيجة JSON لاستخدامها في تطبيقك"
    ],
    "Attributes are prefixed with @ by default": [
        "डिफ़ॉल्ट रूप से विशेषताओं के पहले @ जुड़ता है",
        "Los atributos llevan el prefijo @ por defecto",
        "Les attributs ont le préfixe @ par défaut",
        "Attribute erhalten standardmäßig das Präfix @",
        "属性の既定の接頭辞は@です",
        "属性默认使用 @ 前缀",
        "تستخدم السمات البادئة @ افتراضيًا"
    ],
    "Text content uses #text key when mixed with attributes": [
        "विशेषताओं के साथ टेक्स्ट सामग्री #text कुंजी उपयोग करती है",
        "El texto junto a atributos usa la clave #text",
        "Le texte associé aux attributs utilise la clé #text",
        "Textinhalte neben Attributen verwenden den Schlüssel #text",
        "属性と併存するテキスト内容には#textキーを使います",
        "与属性并存的文本内容使用 #text 键",
        "يستخدم النص المصاحب للسمات المفتاح #text"
    ],
    "Repeated elements become arrays automatically": [
        "दोहराए गए एलिमेंट अपने आप ऐरे बन जाते हैं",
        "Los elementos repetidos se convierten en arrays",
        "Les éléments répétés deviennent automatiquement des tableaux",
        "Wiederholte Elemente werden automatisch zu Arrays",
        "繰り返す要素は自動で配列になります",
        "重复元素自动转换为数组",
        "تتحول العناصر المتكررة إلى مصفوفات تلقائيًا"
    ],
    "Invalid XML will show parsing errors": [
        "अमान्य XML पर पार्सिंग त्रुटियाँ दिखेंगी",
        "El XML no válido muestra errores de análisis",
        "Un XML invalide affiche des erreurs d’analyse",
        "Ungültiges XML zeigt Parsingfehler an",
        "無効なXMLには解析エラーを表示します",
        "XML 无效时将显示解析错误",
        "تظهر أخطاء التحليل عند إدخال XML غير صالح"
    ],
    "Converting SOAP API responses to JSON": [
        "SOAP API प्रतिक्रियाओं को JSON में बदलना",
        "Convertir respuestas de API SOAP a JSON",
        "Convertir les réponses d’API SOAP en JSON",
        "SOAP-API-Antworten in JSON umwandeln",
        "SOAP APIの応答をJSONに変換",
        "将 SOAP API 响应转换为 JSON",
        "تحويل استجابات واجهات SOAP إلى JSON"
    ],
    "Parsing XML configuration files in Node.js": [
        "Node.js में XML कॉन्फ़िगरेशन फ़ाइलें पार्स करना",
        "Analizar archivos de configuración XML en Node.js",
        "Analyser des fichiers de configuration XML dans Node.js",
        "XML-Konfigurationsdateien in Node.js parsen",
        "Node.jsでXML設定ファイルを解析",
        "在 Node.js 中解析 XML 配置文件",
        "تحليل ملفات إعدادات XML في Node.js"
    ],
    "Migrating data from XML-based systems": [
        "XML आधारित सिस्टम से डेटा माइग्रेट करना",
        "Migrar datos de sistemas basados en XML",
        "Migrer les données de systèmes fondés sur XML",
        "Daten aus XML-basierten Systemen migrieren",
        "XMLを使うシステムからデータを移行",
        "从基于 XML 的系统迁移数据",
        "ترحيل البيانات من أنظمة تعتمد على XML"
    ],
    "Processing RSS/Atom feeds in JavaScript": [
        "JavaScript में RSS/Atom फ़ीड संसाधित करना",
        "Procesar canales RSS/Atom en JavaScript",
        "Traiter des flux RSS/Atom en JavaScript",
        "RSS/Atom-Feeds in JavaScript verarbeiten",
        "JavaScriptでRSS/Atomフィードを処理",
        "在 JavaScript 中处理 RSS/Atom 源",
        "معالجة موجزات RSS/Atom في JavaScript"
    ],
    "XML Input": [
        "XML इनपुट",
        "Entrada XML",
        "Entrée XML",
        "XML-Eingabe",
        "XML入力",
        "XML 输入",
        "إدخال XML"
    ],
    "JSON Output": [
        "JSON आउटपुट",
        "Salida JSON",
        "Sortie JSON",
        "JSON-Ausgabe",
        "JSON出力",
        "JSON 输出",
        "إخراج JSON"
    ],
    "Conversion Options": [
        "रूपांतरण विकल्प",
        "Opciones de conversión",
        "Options de conversion",
        "Konvertierungsoptionen",
        "変換オプション",
        "转换选项",
        "خيارات التحويل"
    ],
    "Attribute Prefix": [
        "विशेषता उपसर्ग",
        "Prefijo de atributos",
        "Préfixe des attributs",
        "Attributpräfix",
        "属性の接頭辞",
        "属性前缀",
        "بادئة السمات"
    ],
    "@ (default)": [
        "@ (डिफ़ॉल्ट)",
        "@ (predeterminado)",
        "@ (par défaut)",
        "@ (Standard)",
        "@（既定）",
        "@（默认）",
        "@ (افتراضي)"
    ],
    "_ (underscore)": [
        "_ (अंडरस्कोर)",
        "_ (guion bajo)",
        "_ (trait de soulignement)",
        "_ (Unterstrich)",
        "_（アンダースコア）",
        "_（下划线）",
        "_ (شرطة سفلية)"
    ],
    "$ (dollar)": [
        "$ (डॉलर)",
        "$ (dólar)",
        "$ (signe dollar)",
        "$ (Dollar)",
        "$（ドル記号）",
        "$（美元符号）",
        "$ (دولار)"
    ],
    "Text Content Key": [
        "टेक्स्ट सामग्री कुंजी",
        "Clave del contenido de texto",
        "Clé du contenu textuel",
        "Schlüssel für Textinhalte",
        "テキスト内容のキー",
        "文本内容键",
        "مفتاح المحتوى النصي"
    ],
    "Compact Output": [
        "संक्षिप्त आउटपुट",
        "Salida compacta",
        "Sortie compacte",
        "Kompakte Ausgabe",
        "コンパクトな出力",
        "紧凑输出",
        "إخراج مضغوط"
    ],
    "Convert JSON objects to well-formed XML": [
        "JSON ऑब्जेक्ट को सुव्यवस्थित XML में बदलें",
        "Convierte objetos JSON a XML bien formado",
        "Convertissez des objets JSON en XML bien formé",
        "JSON-Objekte in wohlgeformtes XML umwandeln",
        "JSONオブジェクトを整形式のXMLに変換",
        "将 JSON 对象转换为格式良好的 XML",
        "تحويل كائنات JSON إلى XML سليم البنية"
    ],
    "A JSON to XML converter transforms JavaScript Object Notation (JSON) data into eXtensible Markup Language (XML) format. It handles objects, arrays, nested structures, and supports configurable attribute prefixes.": [
        "यह कन्वर्टर JSON डेटा को XML में बदलता है। यह ऑब्जेक्ट, ऐरे और नेस्टेड संरचनाएँ संभालता है तथा विशेषता उपसर्ग सेट करने देता है।",
        "Este conversor transforma JSON en XML. Admite objetos, arrays, estructuras anidadas y prefijos de atributos configurables.",
        "Ce convertisseur transforme JSON en XML. Il gère les objets, tableaux, structures imbriquées et préfixes d’attributs configurables.",
        "Dieser Konverter wandelt JSON in XML um. Er verarbeitet Objekte, Arrays und verschachtelte Strukturen und unterstützt konfigurierbare Attributpräfixe.",
        "JSONデータをXML形式に変換します。オブジェクト、配列、入れ子構造に対応し、属性の接頭辞を設定できます。",
        "此转换器将 JSON 数据转换为 XML，支持对象、数组、嵌套结构以及可配置的属性前缀。",
        "يحوّل هذا المحوّل بيانات JSON إلى XML. ويدعم الكائنات والمصفوفات والبنى المتداخلة وبادئات السمات القابلة للضبط."
    ],
    "Many enterprise systems, SOAP services, and legacy applications require XML format. This tool bridges modern JSON-based APIs with XML-based systems, making data integration seamless.": [
        "कई एंटरप्राइज़ सिस्टम, SOAP सेवाएँ और पुराने ऐप XML माँगते हैं। यह टूल आधुनिक JSON API को XML सिस्टम से जोड़कर डेटा एकीकरण आसान करता है।",
        "Muchos sistemas empresariales, servicios SOAP y aplicaciones antiguas requieren XML. Esta herramienta conecta las API JSON modernas con esos sistemas y facilita la integración.",
        "De nombreux systèmes d’entreprise, services SOAP et applications anciennes exigent XML. Cet outil relie les API JSON modernes à ces systèmes et facilite l’intégration des données.",
        "Viele Unternehmenssysteme, SOAP-Dienste und Altanwendungen benötigen XML. Dieses Werkzeug verbindet moderne JSON-APIs mit XML-Systemen und erleichtert die Datenintegration.",
        "多くの企業システム、SOAPサービス、従来のアプリにはXMLが必要です。JSONを使うAPIとXMLシステムをつなぎ、データ統合を容易にします。",
        "许多企业系统、SOAP 服务和旧应用需要 XML。此工具连接现代 JSON API 与 XML 系统，简化数据集成。",
        "تتطلب أنظمة مؤسسية وخدمات SOAP وتطبيقات قديمة كثيرة صيغة XML. تربط هذه الأداة واجهات JSON الحديثة بأنظمة XML لتسهيل تكامل البيانات."
    ],
    "Paste your JSON data in the input editor": [
        "इनपुट एडिटर में JSON डेटा पेस्ट करें",
        "Pega tus datos JSON en el editor de entrada",
        "Collez vos données JSON dans l’éditeur d’entrée",
        "JSON-Daten in den Eingabeeditor einfügen",
        "入力エディターにJSONデータを貼り付けます",
        "将 JSON 数据粘贴到输入编辑器",
        "الصق بيانات JSON في محرر الإدخال"
    ],
    "Configure options like attribute prefix (@) and root element name": [
        "विशेषता उपसर्ग (@) और रूट एलिमेंट नाम जैसे विकल्प सेट करें",
        "Configura opciones como el prefijo de atributos (@) y el nombre del elemento raíz",
        "Configurez le préfixe des attributs (@) et le nom de l’élément racine",
        "Optionen wie Attributpräfix (@) und Namen des Wurzelelements konfigurieren",
        "属性の接頭辞（@）やルート要素名などを設定します",
        "设置属性前缀（@）和根元素名称等选项",
        "اضبط خيارات مثل بادئة السمات (@) واسم العنصر الجذر"
    ],
    "The XML output is generated automatically": [
        "XML आउटपुट अपने आप बनता है",
        "La salida XML se genera automáticamente",
        "La sortie XML est générée automatiquement",
        "Die XML-Ausgabe wird automatisch erzeugt",
        "XML出力は自動で生成されます",
        "XML 输出自动生成",
        "يُنشأ إخراج XML تلقائيًا"
    ],
    "Copy the result for use in your XML-based systems": [
        "अपने XML आधारित सिस्टम में उपयोग के लिए परिणाम कॉपी करें",
        "Copia el resultado para tus sistemas basados en XML",
        "Copiez le résultat pour vos systèmes utilisant XML",
        "Ergebnis für die Verwendung in XML-Systemen kopieren",
        "XMLを使うシステム用に結果をコピーします",
        "复制结果供基于 XML 的系统使用",
        "انسخ النتيجة لاستخدامها في أنظمة XML"
    ],
    "Use @attribute prefix convention for XML attributes: {@id: '123'}": [
        "XML विशेषताओं के लिए @attribute उपसर्ग उपयोग करें: {@id: '123'}",
        "Usa el prefijo @attribute para atributos XML: {@id: '123'}",
        "Utilisez le préfixe @attribute pour les attributs XML : {@id: '123'}",
        "Für XML-Attribute das Präfix @attribute verwenden: {@id: '123'}",
        "XML属性には@attributeの接頭辞を使います：{@id: '123'}",
        "XML 属性使用 @attribute 前缀约定：{@id: '123'}",
        "استخدم بادئة @attribute لسمات XML: {@id: '123'}"
    ],
    "Use #text key for element text content with attributes": [
        "विशेषताओं के साथ एलिमेंट के टेक्स्ट के लिए #text कुंजी उपयोग करें",
        "Usa #text para el texto de elementos con atributos",
        "Utilisez #text pour le texte des éléments avec attributs",
        "Für Textinhalte von Elementen mit Attributen den Schlüssel #text verwenden",
        "属性を持つ要素のテキストには#textキーを使います",
        "带属性的元素使用 #text 键存放文本内容",
        "استخدم المفتاح #text لنص العناصر التي لها سمات"
    ],
    "Arrays are converted to repeated elements": [
        "ऐरे दोहराए गए एलिमेंट में बदलते हैं",
        "Los arrays se convierten en elementos repetidos",
        "Les tableaux deviennent des éléments répétés",
        "Arrays werden in wiederholte Elemente umgewandelt",
        "配列は繰り返す要素に変換されます",
        "数组转换为重复元素",
        "تتحول المصفوفات إلى عناصر متكررة"
    ],
    "Enable XML declaration for standalone documents": [
        "स्वतंत्र दस्तावेज़ों के लिए XML घोषणा चालू करें",
        "Activa la declaración XML para documentos independientes",
        "Activez la déclaration XML pour les documents autonomes",
        "XML-Deklaration für eigenständige Dokumente aktivieren",
        "独立した文書にはXML宣言を有効にします",
        "为独立文档启用 XML 声明",
        "فعّل تصريح XML للمستندات المستقلة"
    ],
    "Converting REST API responses to SOAP format": [
        "REST API प्रतिक्रियाओं को SOAP प्रारूप में बदलना",
        "Convertir respuestas de API REST al formato SOAP",
        "Convertir les réponses d’API REST au format SOAP",
        "REST-API-Antworten ins SOAP-Format umwandeln",
        "REST APIの応答をSOAP形式に変換",
        "将 REST API 响应转换为 SOAP 格式",
        "تحويل استجابات واجهات REST إلى صيغة SOAP"
    ],
    "Generating XML configuration from JSON templates": [
        "JSON टेम्पलेट से XML कॉन्फ़िगरेशन बनाना",
        "Generar configuración XML a partir de plantillas JSON",
        "Générer une configuration XML à partir de modèles JSON",
        "XML-Konfiguration aus JSON-Vorlagen erzeugen",
        "JSONテンプレートからXML設定を生成",
        "从 JSON 模板生成 XML 配置",
        "إنشاء إعدادات XML من قوالب JSON"
    ],
    "Integrating with legacy enterprise systems": [
        "पुराने एंटरप्राइज़ सिस्टम के साथ एकीकरण",
        "Integrar sistemas empresariales antiguos",
        "Intégrer des systèmes d’entreprise anciens",
        "Anbindung an bestehende Unternehmenssysteme",
        "従来の企業システムと連携",
        "与旧企业系统集成",
        "التكامل مع الأنظمة المؤسسية القديمة"
    ],
    "Creating XML feeds from JSON data sources": [
        "JSON डेटा स्रोतों से XML फ़ीड बनाना",
        "Crear canales XML desde fuentes de datos JSON",
        "Créer des flux XML depuis des sources JSON",
        "XML-Feeds aus JSON-Datenquellen erstellen",
        "JSONデータソースからXMLフィードを作成",
        "从 JSON 数据源创建 XML 源",
        "إنشاء موجزات XML من مصادر بيانات JSON"
    ],
    "XML Output": [
        "XML आउटपुट",
        "Salida XML",
        "Sortie XML",
        "XML-Ausgabe",
        "XML出力",
        "XML 输出",
        "إخراج XML"
    ],
    "Indentation": [
        "इंडेंटेशन",
        "Sangría",
        "Indentation du code",
        "Einrückung",
        "インデント",
        "缩进",
        "المسافة البادئة"
    ],
    "2 spaces": [
        "2 स्पेस",
        "2 espacios",
        "2 espaces",
        "2 Leerzeichen",
        "2スペース",
        "2 个空格",
        "مسافتان"
    ],
    "4 spaces": [
        "4 स्पेस",
        "4 espacios",
        "4 espaces",
        "4 Leerzeichen",
        "4スペース",
        "4 个空格",
        "4 مسافات"
    ],
    "XML Declaration": [
        "XML घोषणा",
        "Declaración XML",
        "Déclaration XML",
        "XML-Deklaration",
        "XML宣言",
        "XML 声明",
        "تصريح XML"
    ],
    "CSV Converter": [
        "CSV कन्वर्टर",
        "Conversor CSV",
        "Convertisseur CSV",
        "CSV-Konverter",
        "CSV変換",
        "CSV 转换器",
        "محوّل CSV"
    ],
    "Convert CSV data to JSON or XML format": [
        "CSV डेटा को JSON या XML में बदलें",
        "Convierte CSV a JSON o XML",
        "Convertissez CSV en JSON ou XML",
        "CSV-Daten in JSON oder XML umwandeln",
        "CSVデータをJSONまたはXMLに変換",
        "将 CSV 数据转换为 JSON 或 XML",
        "تحويل بيانات CSV إلى JSON أو XML"
    ],
    "A CSV converter transforms Comma-Separated Values data into structured formats like JSON or XML. It handles headers, custom delimiters, quoted fields, and generates properly formatted output.": [
        "यह CSV कन्वर्टर कॉमा से अलग किए गए डेटा को JSON या XML जैसी संरचित शैली में बदलता है। यह हेडर, कस्टम सीमांकक और उद्धृत फ़ील्ड संभालकर फ़ॉर्मैट किया आउटपुट बनाता है।",
        "Este conversor transforma valores separados por comas en JSON o XML. Gestiona encabezados, delimitadores personalizados y campos entre comillas, y genera una salida con formato.",
        "Ce convertisseur transforme les valeurs séparées par des virgules en JSON ou XML. Il gère les en-têtes, séparateurs personnalisés et champs entre guillemets pour produire une sortie formatée.",
        "Dieser CSV-Konverter wandelt kommagetrennte Daten in JSON oder XML um. Er verarbeitet Kopfzeilen, eigene Trennzeichen und Felder in Anführungszeichen und erzeugt formatierte Ausgaben.",
        "カンマ区切りのCSVデータをJSONやXMLなどの構造化形式に変換します。ヘッダー、独自の区切り文字、引用符付きフィールドを処理して整形された出力を生成します。",
        "此 CSV 转换器将逗号分隔的数据转换为 JSON 或 XML，支持表头、自定义分隔符和带引号的字段，生成格式化输出。",
        "يحوّل هذا المحوّل القيم المفصولة بفواصل إلى JSON أو XML. ويعالج الترويسات والفواصل المخصصة والحقول المقتبسة لإنتاج إخراج منسق."
    ],
    "CSV is a universal data exchange format, but applications often need structured data. This tool converts spreadsheet exports and database dumps into formats suitable for APIs and applications.": [
        "CSV डेटा विनिमय का सामान्य प्रारूप है, पर ऐप को अक्सर संरचित डेटा चाहिए। स्प्रेडशीट निर्यात और डेटाबेस डंप को API और ऐप के योग्य प्रारूपों में बदलें।",
        "CSV es un formato universal de intercambio, pero las aplicaciones suelen necesitar datos estructurados. Convierte exportaciones de hojas de cálculo y volcados de bases de datos para API y aplicaciones.",
        "CSV est un format universel d’échange, mais les applications exigent souvent des données structurées. Convertissez les exports de tableurs et de bases de données pour les API et applications.",
        "CSV ist ein universelles Austauschformat, Anwendungen benötigen aber oft strukturierte Daten. Tabellenexporte und Datenbankauszüge lassen sich in Formate für APIs und Anwendungen umwandeln.",
        "CSVは汎用的なデータ交換形式ですが、アプリには構造化データが必要なことがあります。表計算のエクスポートやデータベースのダンプをAPIやアプリ向けに変換します。",
        "CSV 是通用的数据交换格式，但应用往往需要结构化数据。将电子表格导出和数据库转储转换为适合 API 和应用的格式。",
        "CSV صيغة شائعة لتبادل البيانات، لكن التطبيقات تحتاج غالبًا إلى بيانات مهيكلة. حوّل صادرات الجداول وتفريغات قواعد البيانات إلى صيغ مناسبة للواجهات والتطبيقات."
    ],
    "Paste your CSV data in the input area": [
        "इनपुट क्षेत्र में CSV डेटा पेस्ट करें",
        "Pega tus datos CSV en el área de entrada",
        "Collez vos données CSV dans la zone d’entrée",
        "CSV-Daten im Eingabebereich einfügen",
        "入力欄にCSVデータを貼り付けます",
        "将 CSV 数据粘贴到输入区",
        "الصق بيانات CSV في منطقة الإدخال"
    ],
    "Select output format: JSON or XML": [
        "आउटपुट प्रारूप चुनें: JSON या XML",
        "Selecciona el formato de salida: JSON o XML",
        "Choisissez le format de sortie : JSON ou XML",
        "Ausgabeformat wählen: JSON oder XML",
        "出力形式をJSONまたはXMLから選びます",
        "选择输出格式：JSON 或 XML",
        "اختر صيغة الإخراج: JSON أو XML"
    ],
    "Configure options: header row, delimiter, element names": [
        "हेडर पंक्ति, सीमांकक और एलिमेंट नाम सेट करें",
        "Configura la fila de encabezados, el delimitador y los nombres de elementos",
        "Configurez la ligne d’en-tête, le séparateur et les noms d’éléments",
        "Kopfzeile, Trennzeichen und Elementnamen konfigurieren",
        "ヘッダー行、区切り文字、要素名を設定します",
        "设置表头行、分隔符和元素名称",
        "اضبط صف الترويسة والفاصل وأسماء العناصر"
    ],
    "Copy the converted output": [
        "बदला हुआ आउटपुट कॉपी करें",
        "Copia el resultado convertido",
        "Copiez le résultat de la conversion",
        "Konvertierte Ausgabe kopieren",
        "変換結果をコピーします",
        "复制转换后的输出",
        "انسخ الإخراج المحوّل"
    ],
    "Enable 'Has Header Row' to use first row as field names": [
        "पहली पंक्ति को फ़ील्ड नाम बनाने के लिए हेडर पंक्ति चालू करें",
        "Activa la fila de encabezados para usarla como nombres de campos",
        "Activez la ligne d’en-tête pour utiliser ses valeurs comme noms de champs",
        "Kopfzeile aktivieren, um die erste Zeile als Feldnamen zu verwenden",
        "ヘッダー行を有効にすると先頭行をフィールド名に使います",
        "启用表头行以将第一行用作字段名",
        "فعّل صف الترويسة لاستخدام الصف الأول كأسماء للحقول"
    ],
    "Supports comma, semicolon, tab, and pipe delimiters": [
        "कॉमा, सेमीकोलन, टैब और पाइप सीमांकक समर्थित हैं",
        "Admite delimitadores de coma, punto y coma, tabulación y barra vertical",
        "Accepte la virgule, le point-virgule, la tabulation et la barre verticale",
        "Unterstützt Komma, Semikolon, Tabulator und senkrechten Strich als Trennzeichen",
        "カンマ、セミコロン、タブ、パイプの区切り文字に対応します",
        "支持逗号、分号、制表符和竖线分隔符",
        "يدعم الفاصلة والفاصلة المنقوطة وعلامة الجدولة والخط العمودي"
    ],
    "Quoted fields with embedded delimiters are handled correctly": [
        "उद्धृत फ़ील्ड के अंदर के सीमांकक सही संभाले जाते हैं",
        "Gestiona correctamente los delimitadores dentro de campos entre comillas",
        "Les séparateurs dans les champs entre guillemets sont correctement traités",
        "Trennzeichen innerhalb von Feldern in Anführungszeichen werden korrekt verarbeitet",
        "引用符付きフィールド内の区切り文字も処理します",
        "正确处理带引号字段内的分隔符",
        "تُعالج الفواصل داخل الحقول المقتبسة بشكل صحيح"
    ],
    "Empty values become empty strings in output": [
        "खाली मान आउटपुट में खाली स्ट्रिंग बनते हैं",
        "Los valores vacíos se convierten en cadenas vacías",
        "Les valeurs vides deviennent des chaînes vides",
        "Leere Werte werden in der Ausgabe zu leeren Zeichenfolgen",
        "空の値は出力で空文字列になります",
        "空值在输出中变为空字符串",
        "تصبح القيم الفارغة سلاسل نصية فارغة في الإخراج"
    ],
    "Converting Excel exports to JSON for APIs": [
        "Excel निर्यात को API के लिए JSON में बदलना",
        "Convertir exportaciones de Excel a JSON para API",
        "Convertir des exports Excel en JSON pour les API",
        "Excel-Exporte für APIs in JSON umwandeln",
        "ExcelのエクスポートをAPI用のJSONに変換",
        "将 Excel 导出转换为供 API 使用的 JSON",
        "تحويل صادرات Excel إلى JSON للواجهات"
    ],
    "Generating XML configuration from CSV templates": [
        "CSV टेम्पलेट से XML कॉन्फ़िगरेशन बनाना",
        "Generar configuración XML desde plantillas CSV",
        "Générer une configuration XML depuis des modèles CSV",
        "XML-Konfiguration aus CSV-Vorlagen erzeugen",
        "CSVテンプレートからXML設定を生成",
        "从 CSV 模板生成 XML 配置",
        "إنشاء إعدادات XML من قوالب CSV"
    ],
    "Importing spreadsheet data into databases": [
        "स्प्रेडशीट डेटा डेटाबेस में आयात करना",
        "Importar datos de hojas de cálculo a bases de datos",
        "Importer des données de tableur dans des bases de données",
        "Tabellendaten in Datenbanken importieren",
        "表計算データをデータベースに取り込み",
        "将电子表格数据导入数据库",
        "استيراد بيانات الجداول إلى قواعد البيانات"
    ],
    "Transforming CSV logs to structured formats": [
        "CSV लॉग को संरचित प्रारूपों में बदलना",
        "Transformar registros CSV a formatos estructurados",
        "Transformer des journaux CSV en formats structurés",
        "CSV-Protokolle in strukturierte Formate umwandeln",
        "CSVログを構造化形式に変換",
        "将 CSV 日志转换为结构化格式",
        "تحويل سجلات CSV إلى صيغ مهيكلة"
    ],
    "CSV → XML": [
        "CSV से XML",
        "CSV a XML",
        "CSV vers XML",
        "CSV in XML",
        "CSVからXML",
        "CSV 转 XML",
        "CSV إلى XML"
    ],
    "CSV Input": [
        "CSV इनपुट",
        "Entrada CSV",
        "Entrée CSV",
        "CSV-Eingabe",
        "CSV入力",
        "CSV 输入",
        "إدخال CSV"
    ],
    "Delimiter": [
        "सीमांकक",
        "Delimitador",
        "Séparateur",
        "Trennzeichen",
        "区切り文字",
        "分隔符",
        "الفاصل"
    ],
    "Comma (,)": [
        "कॉमा (,)",
        "Coma (,)",
        "Virgule (,)",
        "Komma (,)",
        "カンマ（,）",
        "逗号（,）",
        "فاصلة (,)"
    ],
    "Semicolon (;)": [
        "सेमीकोलन (;)",
        "Punto y coma (;)",
        "Point-virgule (;)",
        "Semikolon (;)",
        "セミコロン（;）",
        "分号（;）",
        "فاصلة منقوطة (;)"
    ],
    "Pipe (|)": [
        "पाइप (|)",
        "Barra vertical (|)",
        "Barre verticale (|)",
        "Senkrechter Strich (|)",
        "パイプ（|）",
        "竖线（|）",
        "خط عمودي (|)"
    ],
    "First Row is Header": [
        "पहली पंक्ति हेडर है",
        "La primera fila es el encabezado",
        "La première ligne est l’en-tête",
        "Erste Zeile ist Kopfzeile",
        "先頭行をヘッダーにする",
        "首行为表头",
        "الصف الأول ترويسة"
    ],
    "Array Format (no objects)": [
        "ऐरे प्रारूप (ऑब्जेक्ट के बिना)",
        "Formato de arrays (sin objetos)",
        "Format tableau (sans objets)",
        "Array-Format (ohne Objekte)",
        "配列形式（オブジェクトなし）",
        "数组格式（无对象）",
        "صيغة مصفوفات (بدون كائنات)"
    ],
    "Root Element": [
        "रूट एलिमेंट",
        "Elemento raíz",
        "Élément racine",
        "Wurzelelement",
        "ルート要素",
        "根元素",
        "العنصر الجذر"
    ],
    "Row Element": [
        "पंक्ति एलिमेंट",
        "Elemento de fila",
        "Élément de ligne",
        "Zeilenelement",
        "行の要素",
        "行元素",
        "عنصر الصف"
    ],
    "Redirecting to CSV Converter...": [
        "CSV कन्वर्टर पर भेजा जा रहा है…",
        "Redirigiendo al conversor CSV…",
        "Redirection vers le convertisseur CSV…",
        "Weiterleitung zum CSV-Konverter…",
        "CSV変換に移動しています…",
        "正在跳转至 CSV 转换器…",
        "جارٍ الانتقال إلى محوّل CSV…"
    ],
    "Convert between YAML and JSON formats": [
        "YAML और JSON प्रारूपों के बीच बदलें",
        "Convierte entre YAML y JSON",
        "Convertissez entre YAML et JSON",
        "Zwischen YAML und JSON umwandeln",
        "YAMLとJSONの間で変換",
        "在 YAML 与 JSON 格式之间转换",
        "التحويل بين صيغتي YAML وJSON"
    ],
    "A bidirectional converter that transforms data between YAML (YAML Ain't Markup Language) and JSON formats. YAML is more human-readable, while JSON is more widely supported in programming.": [
        "यह द्विदिश कन्वर्टर YAML और JSON के बीच डेटा बदलता है। YAML मनुष्यों के लिए पढ़ने में आसान है, जबकि प्रोग्रामिंग में JSON का समर्थन अधिक व्यापक है।",
        "Este conversor bidireccional transforma datos entre YAML y JSON. YAML resulta más legible para las personas, mientras que JSON tiene un soporte más amplio en programación.",
        "Ce convertisseur bidirectionnel transforme les données entre YAML et JSON. YAML est plus lisible pour les humains, tandis que JSON est plus largement pris en charge en programmation.",
        "Dieser bidirektionale Konverter wandelt Daten zwischen YAML und JSON um. YAML ist für Menschen leichter lesbar, während JSON in der Programmierung breiter unterstützt wird.",
        "YAMLとJSONの間で双方向にデータを変換します。YAMLは人にとって読みやすく、JSONはプログラミングで広く対応されています。",
        "此双向转换器在 YAML 和 JSON 之间转换数据。YAML 更便于人阅读，而 JSON 在编程中获得更广泛的支持。",
        "يحوّل هذا المحوّل البيانات في الاتجاهين بين YAML وJSON. يسهل على البشر قراءة YAML، بينما يحظى JSON بدعم أوسع في البرمجة."
    ],
    "YAML is preferred for configuration files (Kubernetes, Docker Compose, GitHub Actions) due to readability, while JSON is standard for APIs. This tool bridges both worlds seamlessly.": [
        "पढ़ने में आसानी के कारण Kubernetes, Docker Compose और GitHub Actions की कॉन्फ़िगरेशन में YAML लोकप्रिय है, जबकि API में JSON मानक है। यह टूल दोनों के बीच रूपांतरण करता है।",
        "YAML se prefiere para configurar Kubernetes, Docker Compose y GitHub Actions por su legibilidad; JSON es estándar en las API. Esta herramienta conecta ambos formatos.",
        "YAML est apprécié pour les configurations Kubernetes, Docker Compose et GitHub Actions grâce à sa lisibilité ; JSON est la norme pour les API. Cet outil relie les deux formats.",
        "YAML wird wegen seiner Lesbarkeit für Kubernetes, Docker Compose und GitHub Actions bevorzugt; JSON ist der Standard für APIs. Dieses Werkzeug verbindet beide Formate.",
        "YAMLは読みやすいためKubernetes、Docker Compose、GitHub Actionsの設定で使われ、JSONはAPIの標準です。このツールで両形式を変換できます。",
        "YAML 易于阅读，常用于 Kubernetes、Docker Compose 和 GitHub Actions 配置；JSON 则是 API 的标准格式。此工具连接这两种格式。",
        "يُفضَّل YAML لإعدادات Kubernetes وDocker Compose وGitHub Actions لسهولة قراءته، بينما JSON هو المعيار للواجهات. تربط هذه الأداة الصيغتين."
    ],
    "Select conversion direction: YAML → JSON or JSON → YAML": [
        "रूपांतरण दिशा चुनें: YAML → JSON या JSON → YAML",
        "Elige la dirección: YAML → JSON o JSON → YAML",
        "Choisissez le sens : YAML → JSON ou JSON → YAML",
        "Konvertierungsrichtung wählen: YAML → JSON oder JSON → YAML",
        "変換方向をYAML → JSONまたはJSON → YAMLから選びます",
        "选择转换方向：YAML → JSON 或 JSON → YAML",
        "اختر اتجاه التحويل: YAML → JSON أو JSON → YAML"
    ],
    "Paste your input data in the left editor": [
        "बाएँ एडिटर में इनपुट डेटा पेस्ट करें",
        "Pega tus datos en el editor izquierdo",
        "Collez vos données dans l’éditeur de gauche",
        "Eingabedaten in den linken Editor einfügen",
        "左のエディターに入力データを貼り付けます",
        "将输入数据粘贴到左侧编辑器",
        "الصق بيانات الإدخال في المحرر الأيسر"
    ],
    "The converted output appears instantly on the right": [
        "बदला हुआ आउटपुट तुरंत दाईं ओर दिखता है",
        "La salida convertida aparece al instante a la derecha",
        "Le résultat apparaît instantanément à droite",
        "Die konvertierte Ausgabe erscheint sofort rechts",
        "変換結果はすぐに右側に表示されます",
        "转换后的输出立即显示在右侧",
        "يظهر الإخراج المحوّل فورًا على اليمين"
    ],
    "Copy the result for use in your files": [
        "अपनी फ़ाइलों में उपयोग के लिए परिणाम कॉपी करें",
        "Copia el resultado para usarlo en tus archivos",
        "Copiez le résultat pour vos fichiers",
        "Ergebnis zur Verwendung in den Dateien kopieren",
        "ファイルで使う結果をコピーします",
        "复制结果供文件使用",
        "انسخ النتيجة لاستخدامها في ملفاتك"
    ],
    "YAML uses indentation for structure - be careful with spaces": [
        "YAML में इंडेंटेशन संरचना तय करता है; स्पेस का ध्यान रखें",
        "YAML usa la sangría como estructura; cuida los espacios",
        "YAML utilise l’indentation pour la structure ; attention aux espaces",
        "YAML nutzt Einrückung für die Struktur; auf Leerzeichen achten",
        "YAMLはインデントで構造を表すため、空白に注意してください",
        "YAML 使用缩进表示结构，请注意空格",
        "يعتمد YAML على المسافات البادئة لبنيته؛ انتبه للمسافات"
    ],
    "Comments in YAML are lost when converting to JSON": [
        "JSON में बदलते समय YAML की टिप्पणियाँ खो जाती हैं",
        "Los comentarios YAML se pierden al convertir a JSON",
        "Les commentaires YAML sont perdus lors de la conversion en JSON",
        "YAML-Kommentare gehen beim Konvertieren in JSON verloren",
        "JSONへの変換でYAMLのコメントは失われます",
        "转换为 JSON 时会丢失 YAML 注释",
        "تُفقد تعليقات YAML عند التحويل إلى JSON"
    ],
    "JSON requires quoted strings and explicit syntax": [
        "JSON में स्ट्रिंग के लिए उद्धरण और स्पष्ट सिंटैक्स चाहिए",
        "JSON exige cadenas entre comillas y sintaxis explícita",
        "JSON exige des chaînes entre guillemets et une syntaxe explicite",
        "JSON erfordert Zeichenfolgen in Anführungszeichen und eine explizite Syntax",
        "JSONには文字列の引用符と明示的な構文が必要です",
        "JSON 要求字符串加引号并使用明确的语法",
        "يتطلب JSON سلاسل نصية مقتبسة وصياغة صريحة"
    ],
    "Use YAML for config files, JSON for API data": [
        "कॉन्फ़िगरेशन फ़ाइलों के लिए YAML, API डेटा के लिए JSON उपयोग करें",
        "Usa YAML para configuración y JSON para datos de API",
        "Utilisez YAML pour la configuration et JSON pour les données d’API",
        "YAML für Konfigurationsdateien, JSON für API-Daten nutzen",
        "設定ファイルにはYAML、APIデータにはJSONを使います",
        "配置文件使用 YAML，API 数据使用 JSON",
        "استخدم YAML للإعدادات وJSON لبيانات الواجهات"
    ],
    "Converting Kubernetes manifests between formats": [
        "Kubernetes मैनिफ़ेस्ट के प्रारूप बदलना",
        "Convertir manifiestos Kubernetes entre formatos",
        "Convertir les manifestes Kubernetes entre formats",
        "Kubernetes-Manifeste zwischen Formaten umwandeln",
        "Kubernetesマニフェストの形式を変換",
        "转换 Kubernetes 清单格式",
        "تحويل ملفات تعريف Kubernetes بين الصيغ"
    ],
    "Debugging YAML configuration by viewing as JSON": [
        "JSON में देखकर YAML कॉन्फ़िगरेशन डीबग करना",
        "Depurar configuración YAML viéndola como JSON",
        "Déboguer une configuration YAML en l’affichant en JSON",
        "YAML-Konfiguration durch die JSON-Ansicht debuggen",
        "JSON表示でYAML設定をデバッグ",
        "通过 JSON 视图调试 YAML 配置",
        "تصحيح إعدادات YAML بعرضها بصيغة JSON"
    ],
    "Generating YAML from JSON API responses": [
        "JSON API प्रतिक्रियाओं से YAML बनाना",
        "Generar YAML desde respuestas de API JSON",
        "Générer du YAML à partir de réponses d’API JSON",
        "YAML aus JSON-API-Antworten erzeugen",
        "JSON APIの応答からYAMLを生成",
        "从 JSON API 响应生成 YAML",
        "إنشاء YAML من استجابات واجهات JSON"
    ],
    "Migrating configuration between different systems": [
        "अलग सिस्टम के बीच कॉन्फ़िगरेशन माइग्रेट करना",
        "Migrar configuración entre sistemas distintos",
        "Migrer une configuration entre différents systèmes",
        "Konfiguration zwischen unterschiedlichen Systemen migrieren",
        "異なるシステム間で設定を移行",
        "在不同系统之间迁移配置",
        "ترحيل الإعدادات بين أنظمة مختلفة"
    ],
    "YAML → JSON": [
        "YAML से JSON",
        "YAML a JSON",
        "YAML vers JSON",
        "YAML in JSON",
        "YAMLからJSON",
        "YAML 转 JSON",
        "YAML إلى JSON"
    ],
    "JSON → YAML": [
        "JSON से YAML",
        "JSON a YAML",
        "JSON vers YAML",
        "JSON in YAML",
        "JSONからYAML",
        "JSON 转 YAML",
        "JSON إلى YAML"
    ],
    "Convert JSON arrays to CSV with custom delimiters and flatten options": [
        "JSON ऐरे को कस्टम सीमांकक और फ़्लैटन विकल्पों के साथ CSV में बदलें",
        "Convierte arrays JSON a CSV con delimitadores y opciones de aplanado",
        "Convertissez des tableaux JSON en CSV avec séparateurs et options d’aplatissement",
        "JSON-Arrays mit eigenen Trennzeichen und Abflachungsoptionen in CSV umwandeln",
        "区切り文字と平坦化を指定してJSON配列をCSVに変換",
        "使用自定义分隔符和扁平化选项将 JSON 数组转换为 CSV",
        "تحويل مصفوفات JSON إلى CSV بفواصل مخصصة وخيارات تسطيح"
    ],
    "Convert JSON arrays and nested objects into comma-separated values (CSV) with custom delimiters, configurable headers and dot-notation flattening for nested fields.": [
        "JSON ऐरे और नेस्टेड ऑब्जेक्ट को CSV में बदलें। कस्टम सीमांकक, हेडर और नेस्टेड फ़ील्ड के लिए डॉट नोटेशन फ़्लैटनिंग चुनें।",
        "Convierte arrays JSON y objetos anidados a CSV con delimitadores personalizados, encabezados configurables y aplanado con notación de puntos para campos anidados.",
        "Convertissez des tableaux JSON et objets imbriqués en CSV avec séparateurs personnalisés, en-têtes configurables et aplatissement des champs imbriqués en notation pointée.",
        "JSON-Arrays und verschachtelte Objekte in CSV umwandeln: mit eigenen Trennzeichen, konfigurierbaren Kopfzeilen und Abflachung verschachtelter Felder in Punktnotation.",
        "JSON配列と入れ子のオブジェクトをCSVに変換します。独自の区切り文字、ヘッダー設定、入れ子フィールドをドット表記にする平坦化に対応します。",
        "将 JSON 数组和嵌套对象转换为 CSV，支持自定义分隔符、可配置表头，以及使用点号表示法展开嵌套字段。",
        "حوّل مصفوفات JSON والكائنات المتداخلة إلى CSV مع فواصل مخصصة وترويسات قابلة للضبط وتسطيح الحقول المتداخلة بترميز النقطة."
    ],
    "Open API responses in Excel, import JSON data into Google Sheets, or hand structured data to non-developers. CSV remains the universal interchange format for tabular data.": [
        "API प्रतिक्रियाएँ Excel में खोलें, JSON Google Sheets में आयात करें या गैर-डेवलपर को संरचित डेटा दें। CSV सारणीबद्ध डेटा के विनिमय का सामान्य प्रारूप है।",
        "Abre respuestas de API en Excel, importa JSON en Google Sheets o entrega datos estructurados a personas que no programan. CSV es el formato universal de intercambio de datos tabulares.",
        "Ouvrez des réponses d’API dans Excel, importez JSON dans Google Sheets ou partagez des données structurées avec des non-développeurs. CSV reste le format universel d’échange de données tabulaires.",
        "API-Antworten in Excel öffnen, JSON in Google Sheets importieren oder strukturierte Daten an Personen ohne Programmierkenntnisse weitergeben. CSV bleibt das universelle Austauschformat für Tabellendaten.",
        "APIの応答をExcelで開き、JSONをGoogle Sheetsに取り込み、開発者以外の人に構造化データを渡せます。CSVは表形式データの汎用的な交換形式です。",
        "在 Excel 中打开 API 响应，将 JSON 导入 Google Sheets，或向非开发者提供结构化数据。CSV 是表格数据的通用交换格式。",
        "افتح استجابات الواجهات في Excel أو استورد JSON إلى Google Sheets أو شارك البيانات المهيكلة مع غير المطورين. تظل CSV صيغة شائعة لتبادل البيانات الجدولية."
    ],
    "Paste a JSON array (or single object) on the left": [
        "बाईं ओर JSON ऐरे या एक ऑब्जेक्ट पेस्ट करें",
        "Pega un array JSON o un objeto a la izquierda",
        "Collez un tableau JSON ou un objet à gauche",
        "JSON-Array oder einzelnes Objekt links einfügen",
        "左側にJSON配列または単一オブジェクトを貼り付けます",
        "在左侧粘贴 JSON 数组或单个对象",
        "الصق مصفوفة JSON أو كائنًا واحدًا على اليسار"
    ],
    "Pick a delimiter (comma, tab, semicolon, pipe)": [
        "कॉमा, टैब, सेमीकोलन या पाइप सीमांकक चुनें",
        "Elige un delimitador: coma, tabulación, punto y coma o barra vertical",
        "Choisissez un séparateur : virgule, tabulation, point-virgule ou barre verticale",
        "Trennzeichen wählen: Komma, Tabulator, Semikolon oder senkrechter Strich",
        "カンマ、タブ、セミコロン、パイプから区切り文字を選びます",
        "选择逗号、制表符、分号或竖线作为分隔符",
        "اختر الفاصل: فاصلة أو جدولة أو فاصلة منقوطة أو خط عمودي"
    ],
    "Toggle 'Flatten nested' to expand objects with dot notation": [
        "ऑब्जेक्ट को डॉट नोटेशन में खोलने के लिए नेस्टेड फ़ील्ड फ़्लैटन करना चालू करें",
        "Activa «Aplanar anidados» para expandir objetos con notación de puntos",
        "Activez l’aplatissement pour développer les objets en notation pointée",
        "„Verschachtelungen abflachen“ aktivieren, um Objekte in Punktnotation aufzulösen",
        "入れ子の平坦化を有効にするとオブジェクトをドット表記で展開します",
        "启用嵌套扁平化以使用点号表示法展开对象",
        "فعّل تسطيح الحقول المتداخلة لتوسيع الكائنات بترميز النقطة"
    ],
    "Download or copy the CSV output": [
        "CSV आउटपुट डाउनलोड या कॉपी करें",
        "Descarga o copia la salida CSV",
        "Téléchargez ou copiez la sortie CSV",
        "CSV-Ausgabe herunterladen oder kopieren",
        "CSV出力をダウンロードまたはコピーします",
        "下载或复制 CSV 输出",
        "نزّل إخراج CSV أو انسخه"
    ],
    "Tab-delimited works best for pasting into Excel": [
        "Excel में पेस्ट करने के लिए टैब सीमांकक सबसे उपयोगी है",
        "La tabulación funciona mejor para pegar en Excel",
        "La tabulation convient mieux au collage dans Excel",
        "Tabulatorgetrennte Daten eignen sich am besten zum Einfügen in Excel",
        "Excelへの貼り付けにはタブ区切りが適しています",
        "粘贴到 Excel 时推荐使用制表符分隔",
        "الفصل بعلامة الجدولة أنسب للصق البيانات في Excel"
    ],
    "Flatten produces columns like 'address.city', 'address.zip'": [
        "फ़्लैटन से 'address.city', 'address.zip' जैसे कॉलम बनते हैं",
        "El aplanado produce columnas como 'address.city', 'address.zip'",
        "L’aplatissement produit des colonnes comme 'address.city', 'address.zip'",
        "Abflachung erzeugt Spalten wie 'address.city', 'address.zip'",
        "平坦化すると'address.city'、'address.zip'などの列になります",
        "扁平化会生成 'address.city'、'address.zip' 等列",
        "ينتج التسطيح أعمدة مثل 'address.city' و'address.zip'"
    ],
    "Arrays of primitives become pipe-joined strings": [
        "मूल मानों के ऐरे पाइप से जुड़ी स्ट्रिंग बनते हैं",
        "Los arrays de valores primitivos se unen con barras verticales",
        "Les tableaux de valeurs primitives sont joints par des barres verticales",
        "Arrays primitiver Werte werden mit senkrechten Strichen verbunden",
        "プリミティブ値の配列はパイプで連結した文字列になります",
        "基本类型值的数组转换为用竖线连接的字符串",
        "تتحول مصفوفات القيم الأولية إلى سلاسل موصولة بخط عمودي"
    ],
    "Converting API responses for spreadsheet analysis": [
        "स्प्रेडशीट विश्लेषण के लिए API प्रतिक्रियाएँ बदलना",
        "Convertir respuestas de API para analizarlas en hojas de cálculo",
        "Convertir des réponses d’API pour l’analyse dans un tableur",
        "API-Antworten für die Tabellenanalyse umwandeln",
        "表計算での分析用にAPIの応答を変換",
        "转换 API 响应用于电子表格分析",
        "تحويل استجابات الواجهات لتحليلها في الجداول"
    ],
    "Migrating JSON exports into a CSV import format": [
        "JSON निर्यात को CSV आयात प्रारूप में बदलना",
        "Migrar exportaciones JSON a un formato de importación CSV",
        "Migrer des exports JSON vers un format d’import CSV",
        "JSON-Exporte in ein CSV-Importformat überführen",
        "JSONのエクスポートをCSVの取り込み形式に移行",
        "将 JSON 导出迁移为 CSV 导入格式",
        "ترحيل صادرات JSON إلى صيغة استيراد CSV"
    ],
    "Quick data inspection in Excel/Numbers/Sheets": [
        "Excel/Numbers/Sheets में डेटा जल्दी देखना",
        "Inspeccionar datos rápidamente en Excel/Numbers/Sheets",
        "Examiner rapidement les données dans Excel/Numbers/Sheets",
        "Daten schnell in Excel/Numbers/Sheets prüfen",
        "Excel/Numbers/Sheetsでデータをすばやく確認",
        "在 Excel/Numbers/Sheets 中快速检查数据",
        "فحص البيانات سريعًا في Excel/Numbers/Sheets"
    ],
    "Delimiter:": [
        "सीमांकक:",
        "Delimitador:",
        "Séparateur :",
        "Trennzeichen:",
        "区切り文字：",
        "分隔符：",
        "الفاصل:"
    ],
    "Comma ,": [
        "कॉमा ,",
        "Coma ,",
        "Virgule ,",
        "Komma ,",
        "カンマ ,",
        "逗号 ,",
        "فاصلة ,"
    ],
    "Tab \\t": [
        "टैब \\t",
        "Tabulación \\t",
        "Tabulation \\t",
        "Tabulator \\t",
        "タブ \\t",
        "制表符 \\t",
        "جدولة \\t"
    ],
    "Semicolon ;": [
        "सेमीकोलन ;",
        "Punto y coma ;",
        "Point-virgule ;",
        "Semikolon ;",
        "セミコロン ;",
        "分号 ;",
        "فاصلة منقوطة ;"
    ],
    "Pipe |": [
        "पाइप |",
        "Barra vertical |",
        "Barre verticale |",
        "Senkrechter Strich |",
        "パイプ |",
        "竖线 |",
        "خط عمودي |"
    ],
    "Flatten nested": [
        "नेस्टेड फ़ील्ड फ़्लैटन करें",
        "Aplanar anidados",
        "Aplatir les champs imbriqués",
        "Verschachtelungen abflachen",
        "入れ子を平坦化",
        "展开嵌套字段",
        "تسطيح الحقول المتداخلة"
    ],
    "Convert": [
        "बदलें",
        "Convertir",
        "Convertir les données",
        "Umwandeln",
        "変換",
        "转换",
        "تحويل"
    ],
    "CSV Output": [
        "CSV आउटपुट",
        "Salida CSV",
        "Sortie CSV",
        "CSV-Ausgabe",
        "CSV出力",
        "CSV 输出",
        "إخراج CSV"
    ],
    "Transform XML documents using XSLT stylesheets": [
        "XSLT स्टाइलशीट से XML दस्तावेज़ बदलें",
        "Transforma documentos XML con hojas de estilo XSLT",
        "Transformez des documents XML avec des feuilles de style XSLT",
        "XML-Dokumente mit XSLT-Stylesheets transformieren",
        "XSLTスタイルシートでXML文書を変換",
        "使用 XSLT 样式表转换 XML 文档",
        "تحويل مستندات XML باستخدام أوراق أنماط XSLT"
    ],
    "XSLT (XSL Transformations) Transformer applies XSLT stylesheets to XML documents, producing transformed output. XSLT can convert XML to HTML, other XML formats, or plain text.": [
        "XSLT ट्रांसफ़ॉर्मर XML दस्तावेज़ों पर XSLT स्टाइलशीट लगाकर नया आउटपुट बनाता है। XSLT, XML को HTML, दूसरे XML प्रारूप या सादे टेक्स्ट में बदल सकता है।",
        "El transformador XSLT aplica hojas de estilo a documentos XML para producir una salida transformada. Puede convertir XML en HTML, otros formatos XML o texto sin formato.",
        "Le transformateur XSLT applique des feuilles de style aux documents XML pour produire une sortie transformée : HTML, autres formats XML ou texte brut.",
        "Der XSLT-Transformer wendet Stylesheets auf XML-Dokumente an und erzeugt transformierte Ausgaben. XSLT kann XML in HTML, andere XML-Formate oder Klartext umwandeln.",
        "XSLT変換はXML文書にスタイルシートを適用して変換結果を生成します。XMLをHTML、別のXML形式、プレーンテキストに変換できます。",
        "XSLT 转换器将样式表应用于 XML 文档并生成转换结果，可将 XML 转换为 HTML、其他 XML 格式或纯文本。",
        "يطبّق محوّل XSLT أوراق الأنماط على مستندات XML لإنتاج إخراج محوّل. ويمكنه تحويل XML إلى HTML أو صيغ XML أخرى أو نص عادي."
    ],
    "XSLT is a powerful language for transforming XML data. It's used for generating HTML from XML, converting between XML formats, and processing XML data in enterprise systems.": [
        "XSLT, XML डेटा बदलने की शक्तिशाली भाषा है। इसका उपयोग XML से HTML बनाने, XML प्रारूप बदलने और एंटरप्राइज़ सिस्टम में XML संसाधित करने में होता है।",
        "XSLT es un lenguaje potente para transformar XML. Se usa para generar HTML, convertir formatos XML y procesar datos XML en sistemas empresariales.",
        "XSLT est un langage puissant de transformation XML. Il sert à générer du HTML, convertir des formats XML et traiter des données XML dans les systèmes d’entreprise.",
        "XSLT ist eine leistungsfähige Sprache zur XML-Transformation. Sie erzeugt HTML aus XML, konvertiert XML-Formate und verarbeitet XML-Daten in Unternehmenssystemen.",
        "XSLTはXMLデータの変換に使う強力な言語です。XMLからのHTML生成、XML形式間の変換、企業システムでのXML処理に使われます。",
        "XSLT 是转换 XML 数据的强大语言，常用于从 XML 生成 HTML、在不同 XML 格式之间转换，以及处理企业系统中的 XML 数据。",
        "XSLT لغة قوية لتحويل XML. وتُستخدم لإنشاء HTML من XML والتحويل بين صيغ XML ومعالجة البيانات في الأنظمة المؤسسية."
    ],
    "Paste your source XML in the XML input panel": [
        "XML इनपुट पैनल में स्रोत XML पेस्ट करें",
        "Pega el XML de origen en el panel de entrada XML",
        "Collez le XML source dans le panneau d’entrée XML",
        "Quell-XML in den XML-Eingabebereich einfügen",
        "XML入力パネルに元のXMLを貼り付けます",
        "将源 XML 粘贴到 XML 输入面板",
        "الصق XML المصدر في لوحة إدخال XML"
    ],
    "Paste your XSLT stylesheet in the XSLT panel": [
        "XSLT पैनल में स्टाइलशीट पेस्ट करें",
        "Pega tu hoja de estilo en el panel XSLT",
        "Collez votre feuille de style dans le panneau XSLT",
        "XSLT-Stylesheet im XSLT-Bereich einfügen",
        "XSLTパネルにスタイルシートを貼り付けます",
        "将 XSLT 样式表粘贴到 XSLT 面板",
        "الصق ورقة أنماط XSLT في لوحتها"
    ],
    "Click 'Transform' to apply the transformation": [
        "रूपांतरण लागू करने के लिए 'रूपांतरित करें' क्लिक करें",
        "Pulsa «Transformar» para aplicar la transformación",
        "Cliquez sur « Transformer » pour appliquer la transformation",
        "Zum Anwenden auf „Transformieren“ klicken",
        "「変換を実行」を押して変換を適用します",
        "点击“执行转换”以应用转换",
        "اضغط «تنفيذ التحويل» لتطبيق التحويل"
    ],
    "View the output in the result panel": [
        "परिणाम पैनल में आउटपुट देखें",
        "Consulta la salida en el panel de resultados",
        "Consultez la sortie dans le panneau de résultat",
        "Ausgabe im Ergebnisbereich ansehen",
        "結果パネルで出力を確認します",
        "在结果面板中查看输出",
        "اعرض الإخراج في لوحة النتيجة"
    ],
    "Use xsl:for-each to iterate over node sets": [
        "नोड समूहों पर दोहराने के लिए xsl:for-each उपयोग करें",
        "Usa xsl:for-each para recorrer conjuntos de nodos",
        "Utilisez xsl:for-each pour parcourir les ensembles de nœuds",
        "Mit xsl:for-each über Knotenmengen iterieren",
        "ノード集合の反復にはxsl:for-eachを使います",
        "使用 xsl:for-each 遍历节点集",
        "استخدم xsl:for-each لتكرار المرور على مجموعات العقد"
    ],
    "xsl:value-of extracts text values": [
        "xsl:value-of टेक्स्ट मान निकालता है",
        "xsl:value-of extrae valores de texto",
        "xsl:value-of extrait les valeurs textuelles",
        "xsl:value-of extrahiert Textwerte",
        "xsl:value-ofでテキスト値を抽出します",
        "xsl:value-of 提取文本值",
        "يستخرج xsl:value-of القيم النصية"
    ],
    "xsl:template defines transformation rules": [
        "xsl:template रूपांतरण नियम तय करता है",
        "xsl:template define reglas de transformación",
        "xsl:template définit les règles de transformation",
        "xsl:template definiert Transformationsregeln",
        "xsl:templateで変換規則を定義します",
        "xsl:template 定义转换规则",
        "يعرّف xsl:template قواعد التحويل"
    ],
    "Match templates with XPath patterns": [
        "XPath पैटर्न से टेम्पलेट मिलाएँ",
        "Asocia plantillas con patrones XPath",
        "Associez les modèles avec des motifs XPath",
        "Vorlagen mit XPath-Mustern abgleichen",
        "XPathパターンでテンプレートを照合します",
        "使用 XPath 模式匹配模板",
        "طابق القوالب باستخدام أنماط XPath"
    ],
    "Converting XML data to HTML pages": [
        "XML डेटा को HTML पेज में बदलना",
        "Convertir datos XML en páginas HTML",
        "Convertir des données XML en pages HTML",
        "XML-Daten in HTML-Seiten umwandeln",
        "XMLデータをHTMLページに変換",
        "将 XML 数据转换为 HTML 页面",
        "تحويل بيانات XML إلى صفحات HTML"
    ],
    "Transforming data between different XML schemas": [
        "अलग XML स्कीमा के बीच डेटा बदलना",
        "Transformar datos entre esquemas XML distintos",
        "Transformer les données entre différents schémas XML",
        "Daten zwischen verschiedenen XML-Schemas transformieren",
        "異なるXMLスキーマ間でデータを変換",
        "在不同 XML 架构之间转换数据",
        "تحويل البيانات بين مخططات XML مختلفة"
    ],
    "Generating reports from XML data": [
        "XML डेटा से रिपोर्ट बनाना",
        "Generar informes desde datos XML",
        "Générer des rapports à partir de données XML",
        "Berichte aus XML-Daten erzeugen",
        "XMLデータからレポートを生成",
        "从 XML 数据生成报告",
        "إنشاء تقارير من بيانات XML"
    ],
    "Converting legacy XML formats": [
        "पुराने XML प्रारूप बदलना",
        "Convertir formatos XML antiguos",
        "Convertir les anciens formats XML",
        "Ältere XML-Formate konvertieren",
        "従来のXML形式を変換",
        "转换旧 XML 格式",
        "تحويل صيغ XML القديمة"
    ],
    "XSLT Stylesheet": [
        "XSLT स्टाइलशीट",
        "Hoja de estilo XSLT",
        "Feuille de style XSLT",
        "XSLT-Stylesheet",
        "XSLTスタイルシート",
        "XSLT 样式表",
        "ورقة أنماط XSLT"
    ],
    "Transform": [
        "रूपांतरित करें",
        "Transformar",
        "Transformer",
        "Transformieren",
        "変換を実行",
        "执行转换",
        "تنفيذ التحويل"
    ],
    "Click Transform to see the output": [
        "आउटपुट देखने के लिए रूपांतरित करें दबाएँ",
        "Pulsa Transformar para ver la salida",
        "Cliquez sur Transformer pour voir la sortie",
        "Zum Anzeigen der Ausgabe auf Transformieren klicken",
        "「変換を実行」を押すと出力を表示します",
        "点击“执行转换”查看输出",
        "اضغط تنفيذ التحويل لعرض الإخراج"
    ],
    "About XSLT": [
        "XSLT के बारे में",
        "Acerca de XSLT",
        "À propos de XSLT",
        "Über XSLT",
        "XSLTについて",
        "关于 XSLT",
        "حول XSLT"
    ],
    "XSLT (eXtensible Stylesheet Language Transformations) is a language for transforming XML documents into other XML documents, HTML, or plain text.": [
        "XSLT (eXtensible Stylesheet Language Transformations), XML दस्तावेज़ों को दूसरे XML दस्तावेज़, HTML या सादे टेक्स्ट में बदलने की भाषा है।",
        "XSLT (eXtensible Stylesheet Language Transformations) es un lenguaje para transformar documentos XML en otros documentos XML, HTML o texto sin formato.",
        "XSLT (eXtensible Stylesheet Language Transformations) est un langage qui transforme les documents XML en d’autres documents XML, en HTML ou en texte brut.",
        "XSLT (eXtensible Stylesheet Language Transformations) ist eine Sprache, die XML-Dokumente in andere XML-Dokumente, HTML oder Klartext umwandelt.",
        "XSLT（eXtensible Stylesheet Language Transformations）はXML文書を別のXML文書、HTML、プレーンテキストに変換する言語です。",
        "XSLT（eXtensible Stylesheet Language Transformations）是将 XML 文档转换为其他 XML 文档、HTML 或纯文本的语言。",
        "XSLT (eXtensible Stylesheet Language Transformations) لغة لتحويل مستندات XML إلى مستندات XML أخرى أو HTML أو نص عادي."
    ],
    "Common uses include converting XML data to HTML for web display, transforming between different XML schemas, and generating reports.": [
        "आम उपयोग हैं: वेब पर दिखाने के लिए XML को HTML में बदलना, XML स्कीमा बदलना और रिपोर्ट बनाना।",
        "Se usa para convertir XML a HTML para la web, transformar entre esquemas XML y generar informes.",
        "Il sert notamment à convertir XML en HTML pour le Web, passer entre schémas XML et générer des rapports.",
        "Typische Anwendungen sind XML in HTML für Webseiten umwandeln, zwischen XML-Schemas transformieren und Berichte erzeugen.",
        "主な用途はWeb表示用のXMLからHTMLへの変換、異なるXMLスキーマ間の変換、レポート生成です。",
        "常见用途包括将 XML 转为用于网页展示的 HTML、在不同 XML 架构之间转换，以及生成报告。",
        "تشمل الاستخدامات الشائعة تحويل XML إلى HTML للعرض على الويب والتحويل بين مخططات XML وإنشاء التقارير."
    ],
    "Common XSLT Elements": [
        "सामान्य XSLT एलिमेंट",
        "Elementos XSLT comunes",
        "Éléments XSLT courants",
        "Häufige XSLT-Elemente",
        "よく使うXSLT要素",
        "常用 XSLT 元素",
        "عناصر XSLT الشائعة"
    ],
    "- Define templates": [
        "- टेम्पलेट तय करें",
        "- Definir plantillas",
        "- Définir des modèles",
        "- Vorlagen definieren",
        "- テンプレートを定義",
        "- 定义模板",
        "- تعريف القوالب"
    ],
    "- Extract values": [
        "- मान निकालें",
        "- Extraer valores",
        "- Extraire les valeurs",
        "- Werte extrahieren",
        "- 値を抽出",
        "- 提取值",
        "- استخراج القيم"
    ],
    "- Loop through nodes": [
        "- नोड पर दोहराएँ",
        "- Recorrer nodos",
        "- Parcourir les nœuds",
        "- Knoten durchlaufen",
        "- ノードを反復",
        "- 遍历节点",
        "- تكرار المرور على العقد"
    ],
    "- Conditional processing": [
        "- सशर्त प्रसंस्करण",
        "- Procesamiento condicional",
        "- Traitement conditionnel",
        "- Bedingte Verarbeitung",
        "- 条件付き処理",
        "- 条件处理",
        "- معالجة شرطية"
    ],
    "- Multiple conditions": [
        "- कई शर्तें",
        "- Varias condiciones",
        "- Conditions multiples",
        "- Mehrere Bedingungen",
        "- 複数条件",
        "- 多个条件",
        "- شروط متعددة"
    ],
    "- Sort elements": [
        "- एलिमेंट क्रमबद्ध करें",
        "- Ordenar elementos",
        "- Trier les éléments",
        "- Elemente sortieren",
        "- 要素を並べ替え",
        "- 排序元素",
        "- ترتيب العناصر"
    ],
    "- Apply templates": [
        "- टेम्पलेट लागू करें",
        "- Aplicar plantillas",
        "- Appliquer les modèles",
        "- Vorlagen anwenden",
        "- テンプレートを適用",
        "- 应用模板",
        "- تطبيق القوالب"
    ],
    "YAML Input": [
        "YAML इनपुट",
        "Entrada YAML",
        "Entrée YAML",
        "YAML-Eingabe",
        "YAML入力",
        "YAML 输入",
        "إدخال YAML"
    ],
    "YAML Output": [
        "YAML आउटपुट",
        "Salida YAML",
        "Sortie YAML",
        "YAML-Ausgabe",
        "YAML出力",
        "YAML 输出",
        "إخراج YAML"
    ],
    "JSON copied!": [
        "JSON कॉपी हुआ!",
        "¡JSON copiado!",
        "JSON copié !",
        "JSON kopiert!",
        "JSONをコピーしました！",
        "JSON 已复制！",
        "تم نسخ JSON!"
    ],
    "XML copied!": [
        "XML कॉपी हुआ!",
        "¡XML copiado!",
        "XML copié !",
        "XML kopiert!",
        "XMLをコピーしました！",
        "XML 已复制！",
        "تم نسخ XML!"
    ],
    "YAML copied!": [
        "YAML कॉपी हुआ!",
        "¡YAML copiado!",
        "YAML copié !",
        "YAML kopiert!",
        "YAMLをコピーしました！",
        "YAML 已复制！",
        "تم نسخ YAML!"
    ],
    "Output copied!": [
        "आउटपुट कॉपी हुआ!",
        "¡Salida copiada!",
        "Sortie copiée !",
        "Ausgabe kopiert!",
        "出力をコピーしました！",
        "输出已复制！",
        "تم نسخ الإخراج!"
    ],
    "Conversion failed. Check the input and options, then try again.": [
        "रूपांतरण विफल। इनपुट और विकल्प जाँचकर फिर प्रयास करें।",
        "No se pudo convertir. Revisa la entrada y las opciones e inténtalo de nuevo.",
        "La conversion a échoué. Vérifiez l’entrée et les options, puis réessayez.",
        "Konvertierung fehlgeschlagen. Eingabe und Optionen prüfen und erneut versuchen.",
        "変換できませんでした。入力とオプションを確認して再試行してください。",
        "转换失败。请检查输入和选项后重试。",
        "تعذر التحويل. تحقق من الإدخال والخيارات ثم أعد المحاولة."
    ],
    "Transformation failed. Check the XML and XSLT, then try again.": [
        "रूपांतरण विफल। XML और XSLT जाँचकर फिर प्रयास करें।",
        "La transformación falló. Revisa el XML y XSLT e inténtalo de nuevo.",
        "La transformation a échoué. Vérifiez le XML et le XSLT, puis réessayez.",
        "Transformation fehlgeschlagen. XML und XSLT prüfen und erneut versuchen.",
        "変換できませんでした。XMLとXSLTを確認して再試行してください。",
        "转换失败。请检查 XML 和 XSLT 后重试。",
        "تعذر تنفيذ التحويل. تحقق من XML وXSLT ثم أعد المحاولة."
    ]
};
