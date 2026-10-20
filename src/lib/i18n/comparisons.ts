import type { TranslationColumns } from "./tool-names";

// Authored comparison UI/help; documents, report bytes, option values and diagnostics stay exact.
export const COMPARISON_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Text Diff compares any two text blocks and highlights line-by-line differences. It shows added, removed, and modified lines similar to Git diff output.": [
        "Text Diff दो टेक्स्ट की पंक्ति-दर-पंक्ति तुलना करता है। Git diff की तरह जोड़ी, हटाई और बदली पंक्तियाँ दिखाता है।",
        "Text Diff compara dos textos línea por línea y resalta líneas añadidas, eliminadas y modificadas, como Git diff.",
        "Text Diff compare deux textes ligne par ligne et souligne les ajouts, suppressions et modifications, comme Git diff.",
        "Text Diff vergleicht zwei Texte zeilenweise und markiert hinzugefügte, entfernte und geänderte Zeilen wie Git diff.",
        "Text Diffは2つのテキストを行ごとに比較し、Git diffのように追加・削除・変更行を強調します。",
        "文本差异工具逐行比较两段文本，像 Git diff 一样标出新增、删除和修改的行。",
        "تقارن أداة فروق النص نصين سطرًا بسطر وتبرز الأسطر المضافة والمحذوفة والمعدلة مثل Git diff."
    ],
    "Comparing text files, code snippets, or documents helps identify changes quickly. It's essential for code reviews, document versioning, and troubleshooting.": [
        "टेक्स्ट फ़ाइलों, कोड या दस्तावेज़ों की तुलना से बदलाव जल्दी मिलते हैं। कोड समीक्षा, दस्तावेज़ संस्करण और समस्या निवारण में उपयोगी है।",
        "Comparar archivos de texto, código o documentos permite detectar cambios rápidamente en revisiones, versiones y diagnósticos.",
        "Comparer des fichiers texte, du code ou des documents permet de repérer vite les changements lors des revues, du suivi des versions et du dépannage.",
        "Der Vergleich von Textdateien, Code und Dokumenten zeigt Änderungen schnell auf und hilft bei Codeprüfungen, Versionierung und Fehlersuche.",
        "テキストファイルやコード、文書の比較で変更を素早く確認でき、コードレビュー、版管理、トラブル対応に役立ちます。",
        "比较文本文件、代码或文档可快速发现改动，便于代码审查、文档版本管理和排错。",
        "تساعد مقارنة الملفات النصية والشيفرات والمستندات على اكتشاف التغييرات بسرعة أثناء المراجعة وإدارة الإصدارات واستكشاف الأخطاء."
    ],
    "Paste the original text in the left editor": [
        "बाएँ संपादक में मूल टेक्स्ट पेस्ट करें",
        "Pega el texto original en el editor izquierdo",
        "Collez le texte original dans l’éditeur de gauche",
        "Originaltext in den linken Editor einfügen",
        "左のエディターに元のテキストを貼り付けます",
        "在左侧编辑器粘贴原始文本",
        "الصق النص الأصلي في المحرر الأيسر"
    ],
    "Paste the modified text in the right editor": [
        "दाएँ संपादक में बदला हुआ टेक्स्ट पेस्ट करें",
        "Pega el texto modificado en el editor derecho",
        "Collez le texte modifié dans l’éditeur de droite",
        "Geänderten Text in den rechten Editor einfügen",
        "右のエディターに変更後のテキストを貼り付けます",
        "在右侧编辑器粘贴修改后的文本",
        "الصق النص المعدل في المحرر الأيمن"
    ],
    "Click 'Compare' to see line-by-line differences": [
        "पंक्ति-दर-पंक्ति अंतर देखने के लिए ‘तुलना करें’ दबाएँ",
        "Pulsa «Comparar» para ver las diferencias por línea",
        "Cliquez sur « Comparer » pour voir les différences ligne par ligne",
        "Zum Anzeigen der Zeilenunterschiede auf „Vergleichen“ klicken",
        "「比較」を押して行ごとの差分を表示します",
        "点击“比较”查看逐行差异",
        "اضغط «مقارنة» لعرض الفروق سطرًا بسطر"
    ],
    "Review additions (green) and deletions (red)": [
        "जोड़ (हरा) और हटाव (लाल) की समीक्षा करें",
        "Revisa las adiciones (verde) y eliminaciones (rojo)",
        "Examinez les ajouts (vert) et suppressions (rouge)",
        "Ergänzungen (grün) und Löschungen (rot) prüfen",
        "追加（緑）と削除（赤）を確認します",
        "检查新增内容（绿色）和删除内容（红色）",
        "راجع الإضافات بالأخضر والمحذوفات بالأحمر"
    ],
    "Works with any plain text: code, logs, configs, etc.": [
        "कोड, लॉग और कॉन्फ़िगरेशन जैसे किसी भी सादे टेक्स्ट पर काम करता है",
        "Funciona con cualquier texto: código, registros, configuraciones, etc.",
        "Fonctionne avec tout texte brut : code, journaux, configurations, etc.",
        "Für beliebigen Klartext geeignet: Code, Protokolle, Konfigurationen usw.",
        "コード、ログ、設定など、どんなプレーンテキストにも対応します",
        "支持代码、日志、配置等各种纯文本",
        "تعمل مع أي نص عادي كالشيفرات والسجلات والإعدادات"
    ],
    "Line-level diff shows exactly which lines changed": [
        "पंक्ति-स्तरीय अंतर बताता है कि कौन सी पंक्तियाँ बदली हैं",
        "El diff por línea muestra exactamente qué líneas cambiaron",
        "La comparaison par ligne montre précisément les lignes modifiées",
        "Der Zeilenvergleich zeigt genau, welche Zeilen geändert wurden",
        "行単位の差分で変更された行を正確に示します",
        "行级差异准确显示哪些行发生了变化",
        "توضح المقارنة على مستوى السطر الأسطر التي تغيرت بدقة"
    ],
    "Character-level highlighting within changed lines": [
        "बदली पंक्तियों में अक्षर-स्तरीय हाइलाइटिंग",
        "Resaltado por carácter dentro de las líneas modificadas",
        "Mise en évidence des caractères dans les lignes modifiées",
        "Zeichenweise Hervorhebung innerhalb geänderter Zeilen",
        "変更行の中を文字単位で強調します",
        "在修改的行内按字符高亮",
        "إبراز الفروق على مستوى الحرف داخل الأسطر المعدلة"
    ],
    "Use for comparing code before and after refactoring": [
        "रिफ़ैक्टरिंग से पहले और बाद के कोड की तुलना करें",
        "Compara código antes y después de refactorizar",
        "Comparez le code avant et après une refactorisation",
        "Code vor und nach dem Refactoring vergleichen",
        "リファクタリング前後のコード比較に使えます",
        "比较重构前后的代码",
        "استخدمها لمقارنة الشيفرة قبل إعادة الهيكلة وبعدها"
    ],
    "Comparing code versions during review": [
        "समीक्षा के दौरान कोड संस्करणों की तुलना",
        "Comparar versiones de código durante una revisión",
        "Comparer les versions du code lors d’une revue",
        "Codeversionen bei der Prüfung vergleichen",
        "レビュー時のコードバージョン比較",
        "审查时比较代码版本",
        "مقارنة إصدارات الشيفرة أثناء المراجعة"
    ],
    "Tracking changes in configuration files": [
        "कॉन्फ़िगरेशन फ़ाइलों के बदलावों पर नज़र रखना",
        "Seguir cambios en archivos de configuración",
        "Suivre les changements des fichiers de configuration",
        "Änderungen an Konfigurationsdateien verfolgen",
        "設定ファイルの変更追跡",
        "跟踪配置文件改动",
        "تتبع تغييرات ملفات الإعدادات"
    ],
    "Diffing log files to find differences": [
        "अंतर खोजने के लिए लॉग फ़ाइलों की तुलना",
        "Comparar registros para encontrar diferencias",
        "Comparer les journaux pour trouver les différences",
        "Protokolldateien auf Unterschiede vergleichen",
        "ログファイルの差分確認",
        "比较日志文件以查找差异",
        "مقارنة ملفات السجل لاكتشاف الفروق"
    ],
    "Verifying text transformations": [
        "टेक्स्ट रूपांतरणों की पुष्टि",
        "Verificar transformaciones de texto",
        "Vérifier les transformations de texte",
        "Textumwandlungen überprüfen",
        "テキスト変換の検証",
        "验证文本转换",
        "التحقق من تحويلات النص"
    ],
    "JSON Diff compares two JSON documents and highlights the differences between them. It shows added, removed, and modified keys/values in a visual side-by-side format.": [
        "JSON Diff दो JSON दस्तावेज़ों की तुलना करता है और जोड़ी, हटाई व बदली कुंजियों और मानों को साथ-साथ दिखाता है।",
        "JSON Diff compara dos documentos JSON y resalta las claves y valores añadidos, eliminados y modificados en una vista paralela.",
        "JSON Diff compare deux documents JSON et souligne les clés et valeurs ajoutées, supprimées et modifiées dans une vue côte à côte.",
        "JSON Diff vergleicht zwei JSON-Dokumente und markiert hinzugefügte, entfernte und geänderte Schlüssel und Werte nebeneinander.",
        "JSON Diffは2つのJSON文書を比較し、追加・削除・変更されたキーや値を左右に並べて強調します。",
        "JSON 差异工具并排比较两份 JSON 文档，高亮新增、删除和修改的键与值。",
        "تقارن أداة فروق JSON مستندين وتبرز المفاتيح والقيم المضافة والمحذوفة والمعدلة جنبًا إلى جنب."
    ],
    "When debugging API responses, configuration changes, or data migrations, seeing exactly what changed between two JSON documents saves time and prevents errors.": [
        "API प्रतिक्रिया, कॉन्फ़िगरेशन या डेटा माइग्रेशन की जाँच में JSON के सटीक बदलाव देखना समय बचाता है और गलतियाँ रोकता है।",
        "Ver exactamente qué cambió entre dos documentos JSON ahorra tiempo y evita errores al depurar respuestas API, configuraciones o migraciones.",
        "Voir précisément les changements entre deux documents JSON fait gagner du temps et évite les erreurs lors du dépannage d’API, de configurations ou de migrations.",
        "Genaue JSON-Unterschiede sparen Zeit und vermeiden Fehler bei API-Antworten, Konfigurationsänderungen und Datenmigrationen.",
        "APIレスポンス、設定変更、データ移行の調査では、JSONの具体的な変更を確認することで時間を節約し、ミスを防げます。",
        "调试 API 响应、配置变更或数据迁移时，准确查看两份 JSON 的变化可节省时间并避免错误。",
        "توفر معرفة ما تغير بدقة بين مستندي JSON الوقت وتمنع الأخطاء عند فحص استجابات API أو تغييرات الإعدادات أو ترحيل البيانات."
    ],
    "Paste the original JSON in the left editor": [
        "बाएँ संपादक में मूल JSON पेस्ट करें",
        "Pega el JSON original en el editor izquierdo",
        "Collez le JSON original dans l’éditeur de gauche",
        "Original-JSON in den linken Editor einfügen",
        "左のエディターに元のJSONを貼り付けます",
        "在左侧编辑器粘贴原始 JSON",
        "الصق JSON الأصلي في المحرر الأيسر"
    ],
    "Paste the modified JSON in the right editor": [
        "दाएँ संपादक में बदला हुआ JSON पेस्ट करें",
        "Pega el JSON modificado en el editor derecho",
        "Collez le JSON modifié dans l’éditeur de droite",
        "Geändertes JSON in den rechten Editor einfügen",
        "右のエディターに変更後のJSONを貼り付けます",
        "在右侧编辑器粘贴修改后的 JSON",
        "الصق JSON المعدل في المحرر الأيمن"
    ],
    "Click 'Compare' to see highlighted differences": [
        "हाइलाइट किए अंतर देखने के लिए ‘तुलना करें’ दबाएँ",
        "Pulsa «Comparar» para ver las diferencias resaltadas",
        "Cliquez sur « Comparer » pour afficher les différences en surbrillance",
        "Zum Hervorheben der Unterschiede auf „Vergleichen“ klicken",
        "「比較」を押して強調された差分を表示します",
        "点击“比较”查看高亮差异",
        "اضغط «مقارنة» لعرض الفروق المميزة"
    ],
    "Green = added, red = removed, yellow = modified": [
        "हरा = जोड़ा, लाल = हटाया, पीला = बदला",
        "Verde = añadido, rojo = eliminado, amarillo = modificado",
        "Vert = ajouté, rouge = supprimé, jaune = modifié",
        "Grün = hinzugefügt, Rot = entfernt, Gelb = geändert",
        "緑＝追加、赤＝削除、黄＝変更",
        "绿色＝新增，红色＝删除，黄色＝修改",
        "الأخضر = مضاف، الأحمر = محذوف، الأصفر = معدل"
    ],
    "Format both JSON documents first for better comparison": [
        "बेहतर तुलना के लिए पहले दोनों JSON दस्तावेज़ फ़ॉर्मैट करें",
        "Formatea ambos documentos JSON antes de compararlos",
        "Formatez d’abord les deux documents JSON pour mieux les comparer",
        "Für einen besseren Vergleich zuerst beide JSON-Dokumente formatieren",
        "比較しやすいように、先に両方のJSON文書を整形します",
        "先格式化两份 JSON 文档，便于比较",
        "نسّق مستندي JSON أولًا للحصول على مقارنة أوضح"
    ],
    "Use semantic diff to compare by structure, not just text": [
        "सिर्फ़ टेक्स्ट के बजाय संरचना की तुलना के लिए सिमैंटिक डिफ़ उपयोग करें",
        "Usa el diff semántico para comparar la estructura, además del texto",
        "Utilisez la comparaison sémantique pour comparer la structure au-delà du texte",
        "Semantischen Vergleich für die Struktur statt nur für den Text verwenden",
        "テキストだけでなく構造を比較するには意味的差分を使います",
        "使用语义差异比较结构，而不只是文本",
        "استخدم المقارنة الدلالية لمقارنة البنية بدلًا من النص وحده"
    ],
    "The diff tool handles nested objects and arrays": [
        "डिफ़ टूल नेस्टेड ऑब्जेक्ट और ऐरे संभालता है",
        "La herramienta admite objetos y matrices anidados",
        "L’outil gère les objets et tableaux imbriqués",
        "Das Vergleichswerkzeug verarbeitet verschachtelte Objekte und Arrays",
        "入れ子のオブジェクトと配列を扱えます",
        "差异工具支持嵌套对象和数组",
        "تتعامل الأداة مع الكائنات والمصفوفات المتداخلة"
    ],
    "Order of keys doesn't affect semantic comparison": [
        "कुंजियों का क्रम सिमैंटिक तुलना को प्रभावित नहीं करता",
        "El orden de las claves no afecta a la comparación semántica",
        "L’ordre des clés n’affecte pas la comparaison sémantique",
        "Die Schlüsselreihenfolge beeinflusst den semantischen Vergleich nicht",
        "キーの順序は意味的比較に影響しません",
        "键的顺序不影响语义比较",
        "لا يؤثر ترتيب المفاتيح على المقارنة الدلالية"
    ],
    "Comparing API response changes between versions": [
        "संस्करणों के बीच API प्रतिक्रिया के बदलावों की तुलना",
        "Comparar cambios en respuestas API entre versiones",
        "Comparer les changements des réponses API entre versions",
        "API-Antworten zwischen Versionen vergleichen",
        "バージョン間のAPIレスポンス変更比較",
        "比较不同版本的 API 响应变更",
        "مقارنة تغييرات استجابات API بين الإصدارات"
    ],
    "Reviewing configuration file changes": [
        "कॉन्फ़िगरेशन फ़ाइल के बदलावों की समीक्षा",
        "Revisar cambios en archivos de configuración",
        "Examiner les changements des fichiers de configuration",
        "Änderungen an Konfigurationsdateien prüfen",
        "設定ファイル変更のレビュー",
        "审查配置文件改动",
        "مراجعة تغييرات ملفات الإعدادات"
    ],
    "Debugging data transformation pipelines": [
        "डेटा रूपांतरण पाइपलाइन में समस्या निवारण",
        "Depurar procesos de transformación de datos",
        "Déboguer les chaînes de transformation de données",
        "Fehler in Datenumwandlungsprozessen suchen",
        "データ変換パイプラインのデバッグ",
        "调试数据转换流程",
        "تصحيح أخطاء مسارات تحويل البيانات"
    ],
    "Verifying database exports against expected output": [
        "डेटाबेस निर्यात को अपेक्षित आउटपुट से मिलाना",
        "Verificar exportaciones de bases de datos con la salida esperada",
        "Vérifier les exports de base de données par rapport au résultat attendu",
        "Datenbankexporte mit der erwarteten Ausgabe abgleichen",
        "データベースのエクスポートを期待する出力と照合",
        "将数据库导出与预期输出核对",
        "مطابقة صادرات قاعدة البيانات مع الإخراج المتوقع"
    ],
    "XML Diff compares two XML documents and shows the differences in a visual side-by-side format. It highlights changes in elements, attributes, and text content.": [
        "XML Diff दो XML दस्तावेज़ों को साथ-साथ दिखाकर एलिमेंट, विशेषताओं और टेक्स्ट सामग्री के बदलाव हाइलाइट करता है।",
        "XML Diff compara dos documentos XML en paralelo y resalta cambios en elementos, atributos y texto.",
        "XML Diff compare deux documents XML côte à côte et souligne les changements d’éléments, d’attributs et de texte.",
        "XML Diff vergleicht zwei XML-Dokumente nebeneinander und markiert Änderungen an Elementen, Attributen und Textinhalten.",
        "XML Diffは2つのXML文書を並べて比較し、要素、属性、テキスト内容の変更を強調します。",
        "XML 差异工具并排比较两份 XML 文档，高亮元素、属性和文本内容的变化。",
        "تقارن أداة فروق XML مستندين جنبًا إلى جنب وتبرز تغييرات العناصر والسمات والمحتوى النصي."
    ],
    "XML documents are common in enterprise systems. Comparing configurations, SOAP messages, or data exports helps identify changes and troubleshoot integration issues.": [
        "एंटरप्राइज़ सिस्टम में XML आम है। कॉन्फ़िगरेशन, SOAP संदेश या डेटा निर्यात की तुलना से बदलाव और एकीकरण समस्याएँ मिलती हैं।",
        "XML es habitual en sistemas empresariales. Comparar configuraciones, mensajes SOAP o exportaciones ayuda a detectar cambios y problemas de integración.",
        "XML est courant en entreprise. Comparer les configurations, messages SOAP ou exports aide à repérer les changements et les problèmes d’intégration.",
        "XML ist in Unternehmenssystemen verbreitet. Vergleiche von Konfigurationen, SOAP-Nachrichten und Datenexporten helfen bei Änderungen und Integrationsproblemen.",
        "企業システムではXMLがよく使われます。設定、SOAPメッセージ、データ出力の比較で変更や連携の問題を確認できます。",
        "XML 常用于企业系统。比较配置、SOAP 消息或数据导出，有助于发现变更并排查集成问题。",
        "تشيع مستندات XML في أنظمة المؤسسات. وتساعد مقارنة الإعدادات ورسائل SOAP وصادرات البيانات على كشف التغييرات وحل مشكلات التكامل."
    ],
    "Paste the original XML in the left editor": [
        "बाएँ संपादक में मूल XML पेस्ट करें",
        "Pega el XML original en el editor izquierdo",
        "Collez le XML original dans l’éditeur de gauche",
        "Original-XML in den linken Editor einfügen",
        "左のエディターに元のXMLを貼り付けます",
        "在左侧编辑器粘贴原始 XML",
        "الصق XML الأصلي في المحرر الأيسر"
    ],
    "Paste the modified XML in the right editor": [
        "दाएँ संपादक में बदला हुआ XML पेस्ट करें",
        "Pega el XML modificado en el editor derecho",
        "Collez le XML modifié dans l’éditeur de droite",
        "Geändertes XML in den rechten Editor einfügen",
        "右のエディターに変更後のXMLを貼り付けます",
        "在右侧编辑器粘贴修改后的 XML",
        "الصق XML المعدل في المحرر الأيمن"
    ],
    "Click 'Compare' to view differences": [
        "अंतर देखने के लिए ‘तुलना करें’ दबाएँ",
        "Pulsa «Comparar» para ver las diferencias",
        "Cliquez sur « Comparer » pour voir les différences",
        "Zum Anzeigen der Unterschiede auf „Vergleichen“ klicken",
        "「比較」を押して差分を表示します",
        "点击“比较”查看差异",
        "اضغط «مقارنة» لعرض الفروق"
    ],
    "Review highlighted additions, deletions, and changes": [
        "हाइलाइट किए जोड़, हटाव और बदलाव देखें",
        "Revisa las adiciones, eliminaciones y modificaciones resaltadas",
        "Examinez les ajouts, suppressions et changements en surbrillance",
        "Hervorgehobene Ergänzungen, Löschungen und Änderungen prüfen",
        "強調された追加、削除、変更を確認します",
        "检查高亮的新增、删除和修改",
        "راجع الإضافات والمحذوفات والتغييرات المميزة"
    ],
    "Format XML first for cleaner comparison results": [
        "स्पष्ट तुलना के लिए पहले XML फ़ॉर्मैट करें",
        "Formatea primero el XML para obtener una comparación más clara",
        "Formatez d’abord le XML pour une comparaison plus lisible",
        "XML zuerst formatieren, um den Vergleich übersichtlicher zu machen",
        "比較結果を見やすくするため、先にXMLを整形します",
        "先格式化 XML，使比较结果更清晰",
        "نسّق XML أولًا للحصول على مقارنة أوضح"
    ],
    "Whitespace differences are typically ignored": [
        "व्हाइटस्पेस के अंतर आम तौर पर अनदेखे होते हैं",
        "Normalmente se ignoran las diferencias de espacios en blanco",
        "Les différences d’espaces sont généralement ignorées",
        "Unterschiede bei Leerraum werden in der Regel ignoriert",
        "空白の違いは通常無視されます",
        "通常忽略空白字符差异",
        "عادةً ما تُتجاهل فروق المسافات البيضاء"
    ],
    "The diff handles namespaces and complex structures": [
        "डिफ़ नेमस्पेस और जटिल संरचनाएँ संभालता है",
        "La comparación admite espacios de nombres y estructuras complejas",
        "La comparaison gère les espaces de noms et structures complexes",
        "Der Vergleich verarbeitet Namensräume und komplexe Strukturen",
        "名前空間と複雑な構造を扱えます",
        "差异工具支持命名空间和复杂结构",
        "تتعامل المقارنة مع مساحات الأسماء والبنى المعقدة"
    ],
    "Use for comparing SOAP request/response pairs": [
        "SOAP अनुरोध और प्रतिक्रिया जोड़ों की तुलना करें",
        "Compara pares de solicitudes y respuestas SOAP",
        "Comparez les paires de requêtes et réponses SOAP",
        "SOAP-Anfragen und -Antworten vergleichen",
        "SOAPのリクエストとレスポンスの比較に使えます",
        "比较 SOAP 请求与响应对",
        "استخدمها لمقارنة أزواج طلبات SOAP واستجاباتها"
    ],
    "Comparing SOAP messages for debugging": [
        "डिबगिंग के लिए SOAP संदेशों की तुलना",
        "Comparar mensajes SOAP para depuración",
        "Comparer les messages SOAP pour le débogage",
        "SOAP-Nachrichten zur Fehlersuche vergleichen",
        "デバッグ用のSOAPメッセージ比較",
        "比较 SOAP 消息以排错",
        "مقارنة رسائل SOAP لتصحيح الأخطاء"
    ],
    "Reviewing XML configuration changes": [
        "XML कॉन्फ़िगरेशन बदलावों की समीक्षा",
        "Revisar cambios de configuración XML",
        "Examiner les changements de configuration XML",
        "XML-Konfigurationsänderungen prüfen",
        "XML設定変更のレビュー",
        "审查 XML 配置改动",
        "مراجعة تغييرات إعدادات XML"
    ],
    "Validating XML transformations (XSLT output)": [
        "XML रूपांतरण (XSLT आउटपुट) की पुष्टि",
        "Validar transformaciones XML (salida XSLT)",
        "Valider les transformations XML (sortie XSLT)",
        "XML-Transformationen prüfen (XSLT-Ausgabe)",
        "XML変換（XSLT出力）の検証",
        "验证 XML 转换（XSLT 输出）",
        "التحقق من تحويلات XML (إخراج XSLT)"
    ],
    "Auditing data export changes": [
        "डेटा निर्यात के बदलावों का ऑडिट",
        "Auditar cambios de exportación de datos",
        "Auditer les changements des exports de données",
        "Änderungen an Datenexporten prüfen",
        "データエクスポート変更の監査",
        "审计数据导出变更",
        "تدقيق تغييرات صادرات البيانات"
    ],
    "CSV Diff compares two CSV files row by row, matching rows by a chosen key column. Unlike text diff, it understands CSV structure and highlights changes at the column level rather than the line level.": [
        "CSV Diff चुने हुए कुंजी कॉलम से पंक्तियाँ मिलाकर दो CSV फ़ाइलों की तुलना करता है। यह CSV संरचना समझता है और पंक्ति के बजाय कॉलम स्तर के बदलाव हाइलाइट करता है।",
        "CSV Diff compara dos archivos CSV emparejando filas por una columna clave. Reconoce la estructura CSV y resalta cambios por columna, en lugar de por línea.",
        "CSV Diff compare deux fichiers CSV en associant les lignes par une colonne clé. Il comprend la structure CSV et souligne les changements par colonne plutôt que par ligne.",
        "CSV Diff vergleicht zwei CSV-Dateien anhand einer Schlüsselspalte. Es berücksichtigt die CSV-Struktur und markiert Änderungen auf Spalten- statt auf Zeilenebene.",
        "CSV Diffは選んだキー列で行を対応付け、2つのCSVを比較します。CSVの構造を認識し、行ではなく列単位の変更を強調します。",
        "CSV 差异工具按所选键列匹配两份 CSV 的行，理解 CSV 结构，并在列级而非文本行级高亮改动。",
        "تقارن أداة فروق CSV ملفين بربط الصفوف عبر عمود مفتاح مختار. وتفهم بنية CSV وتبرز التغييرات على مستوى العمود بدلًا من السطر."
    ],
    "Plain text diff treats reordered rows as huge changes. Key-based diff matches semantically equivalent rows even when they appear in different positions, so you only see real data changes.": [
        "सादा टेक्स्ट डिफ़ क्रम बदली पंक्तियों को बड़े बदलाव मानता है। कुंजी-आधारित डिफ़ अलग स्थानों की समान पंक्तियाँ मिलाता है ताकि केवल डेटा के बदलाव दिखें।",
        "El diff de texto interpreta las filas reordenadas como grandes cambios. La comparación por clave empareja filas equivalentes aunque cambien de posición y muestra los cambios de datos reales.",
        "La comparaison textuelle considère les lignes réordonnées comme de gros changements. La comparaison par clé associe les lignes équivalentes malgré leur position pour ne montrer que les changements de données.",
        "Textvergleiche werten umsortierte Zeilen als große Änderungen. Der Schlüsselvergleich ordnet inhaltlich entsprechende Zeilen unabhängig von ihrer Position zu und zeigt echte Datenänderungen.",
        "テキスト比較では行の並べ替えが大きな変更になります。キーで比較すると位置が違っても対応する行を結び付け、実際のデータ変更を確認できます。",
        "纯文本比较会把行顺序调整视为大量改动。基于键的比较即使位置不同也能匹配对应行，只显示实际数据变化。",
        "تعتبر المقارنة النصية إعادة ترتيب الصفوف تغييرات كبيرة. أما المقارنة بالمفتاح فتربط الصفوف المتكافئة مهما اختلف موضعها لتعرض تغييرات البيانات الفعلية فقط."
    ],
    "Paste two CSV files in the left and right panels": [
        "बाएँ और दाएँ पैनल में दो CSV फ़ाइलें पेस्ट करें",
        "Pega los dos archivos CSV en los paneles izquierdo y derecho",
        "Collez les deux fichiers CSV dans les panneaux gauche et droit",
        "Zwei CSV-Dateien in den linken und rechten Bereich einfügen",
        "左右のパネルに2つのCSVを貼り付けます",
        "将两份 CSV 粘贴到左右面板",
        "الصق ملفي CSV في اللوحتين اليسرى واليمنى"
    ],
    "Pick the key column (defaults to the first)": [
        "कुंजी कॉलम चुनें (डिफ़ॉल्ट पहला है)",
        "Elige la columna clave (la primera por defecto)",
        "Choisissez la colonne clé (la première par défaut)",
        "Schlüsselspalte wählen (standardmäßig die erste)",
        "キー列を選びます（既定は最初の列）",
        "选择键列（默认为第一列）",
        "اختر عمود المفتاح (الأول افتراضيًا)"
    ],
    "Review added, removed, modified and unchanged rows": [
        "जोड़ी, हटाई, बदली और अपरिवर्तित पंक्तियाँ देखें",
        "Revisa las filas añadidas, eliminadas, modificadas y sin cambios",
        "Examinez les lignes ajoutées, supprimées, modifiées et inchangées",
        "Hinzugefügte, entfernte, geänderte und unveränderte Zeilen prüfen",
        "追加、削除、変更、未変更の行を確認します",
        "查看新增、删除、修改和未更改的行",
        "راجع الصفوف المضافة والمحذوفة والمعدلة وغير المتغيرة"
    ],
    "Copy the report for a PR comment or audit log": [
        "PR टिप्पणी या ऑडिट लॉग के लिए रिपोर्ट कॉपी करें",
        "Copia el informe para un comentario de PR o un registro de auditoría",
        "Copiez le rapport pour un commentaire de PR ou un journal d’audit",
        "Bericht für einen PR-Kommentar oder ein Prüfprotokoll kopieren",
        "PRコメントや監査ログに使うためレポートをコピーします",
        "复制报告，用于 PR 评论或审计日志",
        "انسخ التقرير لتعليق PR أو سجل تدقيق"
    ],
    "Quoted fields with embedded commas/newlines/escaped quotes are supported (RFC 4180)": [
        "कॉमा, नई पंक्ति और एस्केप किए उद्धरण वाले उद्धृत फ़ील्ड समर्थित हैं (RFC 4180)",
        "Admite campos entre comillas con comas, saltos de línea y comillas escapadas (RFC 4180)",
        "Prend en charge les champs entre guillemets avec virgules, sauts de ligne et guillemets échappés (RFC 4180)",
        "Felder in Anführungszeichen mit Kommas, Zeilenumbrüchen und maskierten Anführungszeichen werden unterstützt (RFC 4180)",
        "カンマ、改行、エスケープした引用符を含む引用符付きフィールドに対応します（RFC 4180）",
        "支持包含逗号、换行和转义引号的引号字段（RFC 4180）",
        "تُدعم الحقول المقتبسة التي تحتوي فواصل وأسطرًا جديدة وعلامات اقتباس مهربة (RFC 4180)"
    ],
    "Pick a stable identifier (id, primary key, slug) as the key column": [
        "कुंजी कॉलम के लिए स्थिर पहचानकर्ता (id, प्राथमिक कुंजी, slug) चुनें",
        "Elige un identificador estable (id, clave primaria, slug) como columna clave",
        "Choisissez un identifiant stable (id, clé primaire, slug) comme colonne clé",
        "Stabile Kennung (id, Primärschlüssel, slug) als Schlüsselspalte wählen",
        "キー列には安定した識別子（id、主キー、slug）を選びます",
        "选择稳定标识符（id、主键、slug）作为键列",
        "اختر معرّفًا ثابتًا (id أو مفتاحًا أساسيًا أو slug) لعمود المفتاح"
    ],
    "Rows present in both with no column changes are marked 'unchanged'": [
        "दोनों में मौजूद और बिना कॉलम बदलाव वाली पंक्तियाँ ‘अपरिवर्तित’ होती हैं",
        "Las filas presentes en ambos archivos sin cambios de columna se marcan como «Sin cambios»",
        "Les lignes présentes dans les deux fichiers sans changement de colonne sont marquées « Inchangé »",
        "In beiden Dateien vorhandene Zeilen ohne Spaltenänderungen werden als „Unverändert“ markiert",
        "両方に存在し、列に変更がない行は「未変更」と表示します",
        "两份文件都存在且各列均无变化的行标为“未更改”",
        "تُعلَّم الصفوف الموجودة في الملفين دون تغييرات بالأعمدة بأنها «غير متغيرة»"
    ],
    "Auditing data exports between environments": [
        "परिवेशों के बीच डेटा निर्यात का ऑडिट",
        "Auditar exportaciones de datos entre entornos",
        "Auditer les exports de données entre environnements",
        "Datenexporte zwischen Umgebungen prüfen",
        "環境間のデータ出力監査",
        "审计不同环境的数据导出",
        "تدقيق صادرات البيانات بين البيئات"
    ],
    "Reviewing seed / fixture data PRs": [
        "सीड या फ़िक्स्चर डेटा के PR की समीक्षा",
        "Revisar PR de datos iniciales o de prueba",
        "Examiner les PR de données initiales ou de test",
        "PRs für Ausgangs- oder Testdaten prüfen",
        "シードデータやテストデータのPRレビュー",
        "审查种子或测试数据的 PR",
        "مراجعة طلبات PR لبيانات التهيئة أو الاختبار"
    ],
    "Comparing third-party report exports day over day": [
        "बाहरी रिपोर्ट निर्यात की रोज़ाना तुलना",
        "Comparar exportaciones diarias de informes de terceros",
        "Comparer les exports de rapports tiers d’un jour à l’autre",
        "Tägliche Berichtsexporte von Drittanbietern vergleichen",
        "外部レポート出力の日次比較",
        "逐日比较第三方报告导出",
        "مقارنة صادرات تقارير الجهات الخارجية يومًا بيوم"
    ],
    "Migrating between spreadsheets": [
        "स्प्रेडशीट के बीच माइग्रेशन",
        "Migrar entre hojas de cálculo",
        "Migrer entre feuilles de calcul",
        "Zwischen Tabellenkalkulationen migrieren",
        "スプレッドシート間の移行",
        "在电子表格之间迁移",
        "الترحيل بين جداول البيانات"
    ],
    "Image Diff loads two images, scales them to a common canvas, and compares them pixel-by-pixel. Three modes — side-by-side for human review, overlay for alignment checks, and difference for highlighting changed pixels.": [
        "Image Diff दो छवियों को साझा कैनवास पर आकार देकर पिक्सेल-दर-पिक्सेल तुलना करता है। साथ-साथ समीक्षा, संरेखण के लिए ओवरले और बदले पिक्सेल दिखाने के लिए अंतर मोड हैं।",
        "Image Diff carga dos imágenes, las adapta a un lienzo común y las compara píxel a píxel. Ofrece vista paralela para revisión, superposición para alineación y diferencias para resaltar píxeles cambiados.",
        "Image Diff charge deux images, les adapte à un canevas commun et compare leurs pixels. Les modes côte à côte, superposition et différence servent à la revue, à l’alignement et au repérage des pixels modifiés.",
        "Image Diff lädt zwei Bilder, skaliert sie auf eine gemeinsame Zeichenfläche und vergleicht sie pixelweise. Nebeneinander dient der Prüfung, Überlagerung der Ausrichtung und Differenz der Markierung geänderter Pixel.",
        "Image Diffは2つの画像を共通のキャンバスに合わせ、ピクセル単位で比較します。目視確認用の並列、位置確認用の重ね合わせ、変更ピクセルを強調する差分の3モードがあります。",
        "图像差异工具将两张图像缩放到同一画布，逐像素比较。并排模式便于人工检查，叠加模式便于对齐检查，差异模式高亮变化像素。",
        "تحمّل أداة فروق الصور صورتين وتحجمهما إلى لوحة مشتركة وتقارنهما بكسلًا ببكسل. تتيح العرض المتجاور للمراجعة والتراكب لفحص المحاذاة والفروق لإبراز البكسلات المتغيرة."
    ],
    "Visual regression bugs are easy to miss with text diff. A real pixel comparison surfaces a single anti-aliased edge that shifted by one pixel — exactly the kind of thing screenshot tests catch in CI.": [
        "टेक्स्ट डिफ़ से दृश्य बग छूट सकते हैं। पिक्सेल तुलना एक पिक्सेल खिसके एंटी-अलियास किनारे भी दिखाती है, जैसे CI में स्क्रीनशॉट टेस्ट पकड़ते हैं।",
        "El diff de texto puede pasar por alto errores visuales. La comparación de píxeles revela incluso un borde suavizado desplazado un píxel, como las pruebas de capturas en CI.",
        "La comparaison textuelle peut manquer les régressions visuelles. Le contrôle des pixels révèle même un bord lissé décalé d’un pixel, comme les tests de captures en CI.",
        "Textvergleiche übersehen leicht visuelle Fehler. Ein Pixelvergleich zeigt selbst eine um einen Pixel verschobene geglättete Kante, wie Screenshot-Tests in CI.",
        "テキスト差分では視覚的な退行を見逃しがちです。ピクセル比較なら、CIのスクリーンショットテストのように、アンチエイリアスの境界が1ピクセルずれた場合も確認できます。",
        "文本差异容易漏掉视觉回归。像素比较可发现仅偏移一个像素的抗锯齿边缘，这正是 CI 截图测试常捕获的问题。",
        "قد تفوت المقارنة النصية الأخطاء البصرية. تكشف مقارنة البكسلات حتى حافة ملساء تحركت بكسلًا واحدًا، كما تفعل اختبارات لقطات الشاشة في CI."
    ],
    "Drop two images into the left and right slots (any size, any format the browser decodes)": [
        "बाएँ और दाएँ स्थान में छवियाँ छोड़ें (किसी भी आकार या ब्राउज़र समर्थित प्रारूप में)",
        "Suelta dos imágenes a izquierda y derecha (cualquier tamaño o formato que decodifique el navegador)",
        "Déposez deux images à gauche et à droite (toute taille et tout format décodable par le navigateur)",
        "Zwei Bilder links und rechts ablegen (beliebige Größe und vom Browser lesbare Formate)",
        "左右に画像をドロップします（ブラウザーが読める形式ならサイズは任意です）",
        "将两张图像拖入左右区域（任意尺寸，格式需浏览器支持）",
        "أسقط صورتين في الجانبين الأيسر والأيمن بأي حجم وصيغة يستطيع المتصفح فكها"
    ],
    "Pick a mode: difference colours changed pixels red, overlay blends them, side-by-side puts them next to each other": [
        "मोड चुनें: अंतर में बदले पिक्सेल लाल, ओवरले में मिश्रित और साथ-साथ में दोनों छवियाँ बगल में दिखती हैं",
        "Elige un modo: diferencias marca los píxeles cambiados en rojo, superposición mezcla las imágenes y paralelo las muestra juntas",
        "Choisissez un mode : différence colore les pixels modifiés en rouge, superposition mélange les images et côte à côte les juxtapose",
        "Modus wählen: Differenz markiert geänderte Pixel rot, Überlagerung mischt Bilder und Nebeneinander zeigt sie nebeneinander",
        "モードを選びます。差分は変更ピクセルを赤く表示し、重ね合わせは画像を混ぜ、並列は左右に並べます",
        "选择模式：差异模式将变化像素标红，叠加模式混合图像，并排模式将其左右排列",
        "اختر نمطًا: الفروق تلوّن البكسلات المتغيرة بالأحمر، والتراكب يمزج الصورتين، والتجاور يعرضهما بجانب بعضهما"
    ],
    "In difference mode, raise tolerance to ignore tiny anti-aliasing variations": [
        "अंतर मोड में छोटे एंटी-अलियास बदलाव छोड़ने के लिए सहनशीलता बढ़ाएँ",
        "En modo diferencias, aumenta la tolerancia para ignorar pequeñas variaciones de suavizado",
        "En mode différence, augmentez la tolérance pour ignorer les petites variations de lissage",
        "Im Differenzmodus die Toleranz erhöhen, um kleine Kantenglättungsunterschiede zu ignorieren",
        "差分モードで許容値を上げると、わずかなアンチエイリアスの違いを無視できます",
        "在差异模式提高容差，可忽略细微抗锯齿变化",
        "ارفع السماحية في نمط الفروق لتجاهل التغيرات الطفيفة في تنعيم الحواف"
    ],
    "Stats below show what % of pixels differ": [
        "नीचे के आँकड़े भिन्न पिक्सेल का प्रतिशत दिखाते हैं",
        "Las estadísticas inferiores muestran el porcentaje de píxeles distintos",
        "Les statistiques ci-dessous indiquent le pourcentage de pixels différents",
        "Die Statistik unten zeigt den Anteil unterschiedlicher Pixel",
        "下の統計で異なるピクセルの割合を確認できます",
        "下方统计显示不同像素所占百分比",
        "تعرض الإحصاءات أدناه نسبة البكسلات المختلفة"
    ],
    "Tolerance of 0 catches every JPEG re-compression artefact — start at 5-10 for realistic comparisons": [
        "0 सहनशीलता हर JPEG पुनःसंपीड़न प्रभाव पकड़ती है। व्यावहारिक तुलना के लिए 5–10 से शुरू करें",
        "Una tolerancia de 0 detecta cualquier artefacto de recompresión JPEG; empieza con 5–10 para comparaciones realistas",
        "Une tolérance de 0 détecte tout artefact de recompression JPEG ; commencez entre 5 et 10 pour une comparaison réaliste",
        "Toleranz 0 erfasst jedes JPEG-Neukomprimierungsartefakt. Für realistische Vergleiche mit 5–10 beginnen",
        "許容値0ではJPEG再圧縮の微細な差も検出します。実用的な比較では5〜10から始めてください",
        "容差为 0 会捕获所有 JPEG 再压缩痕迹；实际比较可从 5–10 开始",
        "تكشف السماحية 0 كل آثار إعادة ضغط JPEG؛ ابدأ بقيمة 5–10 لمقارنات واقعية"
    ],
    "If the images have different sizes, both are stretched to the larger dimensions": [
        "छवियों का आकार अलग हो तो दोनों को बड़े आयामों तक खींचा जाता है",
        "Si los tamaños difieren, ambas imágenes se estiran a las dimensiones mayores",
        "Si les tailles diffèrent, les deux images sont étirées aux dimensions les plus grandes",
        "Bei unterschiedlichen Größen werden beide Bilder auf die größeren Abmessungen gestreckt",
        "画像サイズが異なる場合、両方を大きい方の寸法に引き伸ばします",
        "图像尺寸不同时，两张都会拉伸至较大尺寸",
        "إذا اختلف حجما الصورتين تُمددان إلى الأبعاد الأكبر"
    ],
    "Everything runs locally — images never leave your browser": [
        "सब स्थानीय रूप से चलता है। छवियाँ ब्राउज़र से बाहर नहीं जातीं",
        "Todo se ejecuta localmente; las imágenes no salen del navegador",
        "Tout s’exécute localement ; les images ne quittent jamais le navigateur",
        "Alles läuft lokal; die Bilder verlassen den Browser nicht",
        "すべてローカルで処理され、画像はブラウザーの外に送られません",
        "全部在本地运行，图像不会离开浏览器",
        "تعمل جميع العمليات محليًا ولا تغادر الصور متصفحك"
    ],
    "Visual regression testing": [
        "दृश्य रिग्रेशन टेस्ट",
        "Pruebas de regresión visual",
        "Tests de régression visuelle",
        "Visuelle Regressionstests",
        "ビジュアルリグレッションテスト",
        "视觉回归测试",
        "اختبارات التراجع البصري"
    ],
    "Diffing screenshots from two builds": [
        "दो बिल्ड के स्क्रीनशॉट की तुलना",
        "Comparar capturas de dos compilaciones",
        "Comparer les captures de deux versions compilées",
        "Screenshots aus zwei Builds vergleichen",
        "2つのビルドのスクリーンショット比較",
        "比较两次构建的截图",
        "مقارنة لقطات الشاشة من بنيتين"
    ],
    "Detecting JPEG re-encode quality loss": [
        "JPEG पुनःएन्कोडिंग की गुणवत्ता हानि पहचानना",
        "Detectar pérdida de calidad al recodificar JPEG",
        "Détecter la perte de qualité lors du réencodage JPEG",
        "Qualitätsverluste durch JPEG-Neukodierung erkennen",
        "JPEG再エンコードによる品質劣化の検出",
        "检测 JPEG 重新编码造成的质量损失",
        "كشف فقدان الجودة عند إعادة ترميز JPEG"
    ],
    "Spotting near-identical duplicates": [
        "लगभग समान प्रतियाँ ढूँढना",
        "Detectar duplicados casi idénticos",
        "Repérer les doublons presque identiques",
        "Nahezu identische Duplikate erkennen",
        "ほぼ同じ重複画像の発見",
        "发现近乎相同的重复图像",
        "اكتشاف النسخ المتطابقة تقريبًا"
    ],
    "A structural diff for OpenAPI and Swagger documents. It compares operations, required parameters, responses, and component-schema requirements rather than just lines of YAML.": [
        "OpenAPI और Swagger दस्तावेज़ों की संरचनात्मक तुलना। यह YAML की पंक्तियों के बजाय ऑपरेशन, आवश्यक पैरामीटर, प्रतिक्रिया और कंपोनेंट स्कीमा की आवश्यकताएँ मिलाता है।",
        "Comparación estructural de documentos OpenAPI y Swagger: operaciones, parámetros obligatorios, respuestas y requisitos de esquemas de componentes, más allá de las líneas YAML.",
        "Comparaison structurelle de documents OpenAPI et Swagger : opérations, paramètres requis, réponses et exigences des schémas de composants, plutôt que les seules lignes YAML.",
        "Struktureller Vergleich von OpenAPI- und Swagger-Dokumenten: Operationen, Pflichtparameter, Antworten und Anforderungen an Komponentenschemas statt nur YAML-Zeilen.",
        "OpenAPIとSwagger文書の構造的差分です。YAMLの行だけでなく、操作、必須パラメーター、レスポンス、コンポーネントスキーマの要件を比較します。",
        "对 OpenAPI 和 Swagger 文档进行结构比较，比较操作、必需参数、响应和组件架构要求，而不仅是 YAML 文本行。",
        "مقارنة بنيوية لمستندات OpenAPI وSwagger، تشمل العمليات والمعلمات المطلوبة والاستجابات ومتطلبات مخططات المكونات بدلًا من أسطر YAML وحدها."
    ],
    "A text diff cannot tell a release manager whether a change breaks an existing client. This tool labels conservative, actionable compatibility risks.": [
        "टेक्स्ट डिफ़ से पता नहीं चलता कि बदलाव मौजूदा क्लाइंट को तोड़ेगा या नहीं। यह टूल सावधानीपूर्वक संगतता जोखिम चिह्नित करता है जिन पर कार्रवाई की जा सके।",
        "El diff de texto no indica si un cambio rompe un cliente existente. Esta herramienta señala riesgos de compatibilidad conservadores y accionables.",
        "Une comparaison textuelle ne dit pas si un changement casse un client existant. Cet outil signale des risques de compatibilité prudents et exploitables.",
        "Ein Textvergleich zeigt nicht, ob eine Änderung bestehende Clients beeinträchtigt. Dieses Werkzeug markiert vorsichtig bewertete, konkret prüfbare Kompatibilitätsrisiken.",
        "テキスト差分だけでは既存クライアントへの影響を判断できません。このツールは慎重な基準で、対処できる互換性リスクを示します。",
        "文本差异无法说明变更是否会破坏现有客户端。本工具以保守规则标记可采取行动的兼容性风险。",
        "لا تخبر المقارنة النصية مسؤول الإصدار إن كان التغيير يعطل عميلًا قائمًا. تحدد هذه الأداة مخاطر توافق تحفظية قابلة للمعالجة."
    ],
    "Paste the currently published contract on the left": [
        "बाईं ओर वर्तमान प्रकाशित कॉन्ट्रैक्ट पेस्ट करें",
        "Pega el contrato publicado actualmente a la izquierda",
        "Collez le contrat actuellement publié à gauche",
        "Aktuell veröffentlichten Vertrag links einfügen",
        "左に現在公開中の契約を貼り付けます",
        "在左侧粘贴当前已发布契约",
        "الصق العقد المنشور حاليًا على اليسار"
    ],
    "Paste the proposed contract on the right": [
        "दाईं ओर प्रस्तावित कॉन्ट्रैक्ट पेस्ट करें",
        "Pega el contrato propuesto a la derecha",
        "Collez le contrat proposé à droite",
        "Vorgeschlagenen Vertrag rechts einfügen",
        "右に変更案の契約を貼り付けます",
        "在右侧粘贴拟议契约",
        "الصق العقد المقترح على اليمين"
    ],
    "Run Compare contracts": [
        "‘कॉन्ट्रैक्ट की तुलना करें’ चलाएँ",
        "Ejecuta «Comparar contratos»",
        "Lancez « Comparer les contrats »",
        "„Verträge vergleichen“ ausführen",
        "「契約を比較」を実行します",
        "运行“比较契约”",
        "شغّل «مقارنة العقود»"
    ],
    "Resolve every breaking finding or document it in your release notes": [
        "हर असंगत बदलाव ठीक करें या रिलीज़ नोट्स में दर्ज करें",
        "Resuelve cada hallazgo incompatible o documéntalo en las notas de la versión",
        "Résolvez chaque incompatibilité ou documentez-la dans les notes de version",
        "Jeden inkompatiblen Befund beheben oder in den Versionshinweisen dokumentieren",
        "互換性を損なう指摘をすべて解消するか、リリースノートに記録します",
        "解决每个破坏性问题，或将其记录在发行说明中",
        "عالج كل نتيجة تكسر التوافق أو وثّقها في ملاحظات الإصدار"
    ],
    "Coverage: operation removal, required parameters, request/response schemas, media types, types, enum sets, bounds, and required properties. Changed composition, security, and unresolved references require review.": [
        "कवरेज: ऑपरेशन हटाना, आवश्यक पैरामीटर, अनुरोध/प्रतिक्रिया स्कीमा, मीडिया प्रकार, प्रकार, enum समुच्चय, सीमाएँ और आवश्यक गुण। संरचना, सुरक्षा और अनसुलझे संदर्भ के बदलावों की समीक्षा करें।",
        "Cobertura: eliminación de operaciones, parámetros obligatorios, esquemas de petición/respuesta, tipos de medios, tipos, conjuntos enum, límites y propiedades obligatorias. Revisa cambios de composición, seguridad y referencias sin resolver.",
        "Couverture : suppression d’opérations, paramètres requis, schémas de requête/réponse, types de médias, types, ensembles enum, bornes et propriétés requises. Examinez les changements de composition, de sécurité et les références non résolues.",
        "Abgedeckt: entfernte Operationen, Pflichtparameter, Anfrage-/Antwortschemas, Medientypen, Typen, enum-Mengen, Grenzen und Pflichtfelder. Änderungen an Komposition und Sicherheit sowie unaufgelöste Referenzen müssen geprüft werden.",
        "対象は操作の削除、必須パラメーター、リクエスト・レスポンススキーマ、メディア型、型、enum集合、境界値、必須プロパティです。合成やセキュリティの変更、未解決の参照は確認が必要です。",
        "覆盖操作删除、必需参数、请求/响应架构、媒体类型、类型、enum 集合、边界和必需属性。组合、安全性的变更及未解析引用需要另行审查。",
        "التغطية: حذف العمليات والمعلمات المطلوبة ومخططات الطلب والاستجابة وأنواع الوسائط والأنواع ومجموعات enum والحدود والخصائص المطلوبة. تتطلب تغييرات التركيب والأمان والمراجع غير المحلولة مراجعة."
    ],
    "Keep external $ref files bundled before comparing.": [
        "तुलना से पहले बाहरी $ref फ़ाइलें बंडल में रखें।",
        "Agrupa los archivos $ref externos antes de comparar.",
        "Regroupez les fichiers $ref externes avant la comparaison.",
        "Externe $ref-Dateien vor dem Vergleich bündeln.",
        "比較前に外部の$refファイルをまとめてください。",
        "比较前请将外部 $ref 文件打包。",
        "اجمع ملفات $ref الخارجية قبل المقارنة."
    ],
    "Use JSON or YAML; nothing leaves this browser.": [
        "JSON या YAML उपयोग करें। डेटा इस ब्राउज़र से बाहर नहीं जाता।",
        "Usa JSON o YAML; nada sale de este navegador.",
        "Utilisez JSON ou YAML ; rien ne quitte ce navigateur.",
        "JSON oder YAML verwenden; nichts verlässt diesen Browser.",
        "JSONまたはYAMLを使えます。データはブラウザーの外に送られません。",
        "使用 JSON 或 YAML，数据不会离开此浏览器。",
        "استخدم JSON أو YAML؛ لا شيء يغادر هذا المتصفح."
    ],
    "API release reviews": [
        "API रिलीज़ की समीक्षा",
        "Revisiones de versiones de API",
        "Revues des versions d’API",
        "API-Release-Prüfungen",
        "APIリリースレビュー",
        "API 发布审查",
        "مراجعات إصدارات API"
    ],
    "CI contract-check baselines": [
        "CI कॉन्ट्रैक्ट जाँच के आधार",
        "Líneas base de comprobación de contratos en CI",
        "Références pour les contrôles de contrats en CI",
        "Baselines für CI-Vertragsprüfungen",
        "CI契約チェックのベースライン",
        "CI 契约检查基线",
        "خطوط أساس لفحص العقود في CI"
    ],
    "Partner API migration planning": [
        "पार्टनर API माइग्रेशन की योजना",
        "Planificar migraciones de API de socios",
        "Planifier la migration des API partenaires",
        "Migration von Partner-APIs planen",
        "パートナーAPI移行計画",
        "合作方 API 迁移规划",
        "تخطيط ترحيل واجهات API للشركاء"
    ],
    "Compare any two text blocks with highlighted differences": [
        "हाइलाइट किए अंतर के साथ किसी भी दो टेक्स्ट की तुलना करें",
        "Compara dos textos con las diferencias resaltadas",
        "Comparez deux textes avec les différences en surbrillance",
        "Zwei Texte mit hervorgehobenen Unterschieden vergleichen",
        "任意の2つのテキストを比較し、差分を強調表示",
        "比较任意两段文本并高亮差异",
        "قارن أي نصين مع إبراز الفروق"
    ],
    "Compare": [
        "तुलना करें",
        "Comparar",
        "Comparer",
        "Vergleichen",
        "比較",
        "比较",
        "مقارنة"
    ],
    "Modified": [
        "बदला हुआ",
        "Modificado",
        "Modifié",
        "Geändert",
        "変更後",
        "修改后",
        "معدل"
    ],
    "Diff View": [
        "अंतर दृश्य",
        "Vista de diferencias",
        "Vue des différences",
        "Vergleichsansicht",
        "差分表示",
        "差异视图",
        "عرض الفروق"
    ],
    "Compare two JSON documents side by side": [
        "दो JSON दस्तावेज़ों की साथ-साथ तुलना करें",
        "Compara dos documentos JSON en paralelo",
        "Comparez deux documents JSON côte à côte",
        "Zwei JSON-Dokumente nebeneinander vergleichen",
        "2つのJSON文書を並べて比較",
        "并排比较两份 JSON 文档",
        "قارن مستندي JSON جنبًا إلى جنب"
    ],
    "Compare two XML documents side by side": [
        "दो XML दस्तावेज़ों की साथ-साथ तुलना करें",
        "Compara dos documentos XML en paralelo",
        "Comparez deux documents XML côte à côte",
        "Zwei XML-Dokumente nebeneinander vergleichen",
        "2つのXML文書を並べて比較",
        "并排比较两份 XML 文档",
        "قارن مستندي XML جنبًا إلى جنب"
    ],
    "Report copied": [
        "रिपोर्ट कॉपी हुई",
        "Informe copiado",
        "Rapport copié",
        "Bericht kopiert",
        "レポートをコピーしました",
        "报告已复制",
        "تم نسخ التقرير"
    ],
    "Row-keyed CSV comparison with column-level change highlighting": [
        "कुंजी से CSV पंक्तियाँ मिलाएँ और कॉलम-स्तरीय बदलाव देखें",
        "Compara CSV por filas clave y resalta cambios por columna",
        "Comparez des CSV par clé de ligne et soulignez les changements par colonne",
        "CSV anhand von Zeilenschlüsseln vergleichen und Spaltenänderungen markieren",
        "行キーでCSVを比較し、列単位の変更を強調表示",
        "按键匹配 CSV 行并高亮列级改动",
        "قارن صفوف CSV بالمفتاح مع إبراز تغييرات الأعمدة"
    ],
    "Rows: {count}": [
        "पंक्तियाँ: {count}",
        "Filas: {count}",
        "Lignes : {count}",
        "Zeilen: {count}",
        "行数: {count}",
        "行数：{count}",
        "الصفوف: {count}"
    ],
    "Original CSV": [
        "मूल CSV",
        "CSV original",
        "CSV original",
        "Original-CSV",
        "元のCSV",
        "原始 CSV",
        "CSV الأصلي"
    ],
    "Paste CSV here…": [
        "यहाँ CSV पेस्ट करें…",
        "Pega CSV aquí…",
        "Collez le CSV ici…",
        "CSV hier einfügen…",
        "ここにCSVを貼り付け…",
        "在此粘贴 CSV…",
        "الصق CSV هنا…"
    ],
    "Modified CSV": [
        "बदला हुआ CSV",
        "CSV modificado",
        "CSV modifié",
        "Geändertes CSV",
        "変更後のCSV",
        "修改后的 CSV",
        "CSV المعدل"
    ],
    "Key column:": [
        "कुंजी कॉलम:",
        "Columna clave:",
        "Colonne clé :",
        "Schlüsselspalte:",
        "キー列:",
        "键列：",
        "عمود المفتاح:"
    ],
    "Key column": [
        "कुंजी कॉलम",
        "Columna clave",
        "Colonne clé",
        "Schlüsselspalte",
        "キー列",
        "键列",
        "عمود المفتاح"
    ],
    "(empty)": [
        "(खाली)",
        "(vacío)",
        "(vide)",
        "(leer)",
        "（空）",
        "（空）",
        "(فارغ)"
    ],
    "Copy report": [
        "रिपोर्ट कॉपी करें",
        "Copiar informe",
        "Copier le rapport",
        "Bericht kopieren",
        "レポートをコピー",
        "复制报告",
        "نسخ التقرير"
    ],
    "Diff": [
        "अंतर",
        "Diferencias",
        "Différences",
        "Unterschiede",
        "差分",
        "差异",
        "الفروق"
    ],
    "Paste CSV in both panels to see a diff": [
        "अंतर देखने के लिए दोनों पैनल में CSV पेस्ट करें",
        "Pega CSV en ambos paneles para ver las diferencias",
        "Collez du CSV dans les deux panneaux pour voir les différences",
        "CSV in beide Bereiche einfügen, um Unterschiede zu sehen",
        "両方のパネルにCSVを貼り付けて差分を表示します",
        "在两个面板粘贴 CSV 以查看差异",
        "الصق CSV في اللوحتين لعرض الفروق"
    ],
    "Image could not be loaded.": [
        "छवि लोड नहीं हो सकी।",
        "No se pudo cargar la imagen.",
        "Impossible de charger l’image.",
        "Bild konnte nicht geladen werden.",
        "画像を読み込めませんでした。",
        "无法加载图像。",
        "تعذر تحميل الصورة."
    ],
    "Pixel-perfect visual comparison with side-by-side, overlay and difference modes": [
        "साथ-साथ, ओवरले और अंतर मोड में पिक्सेल-स्तरीय दृश्य तुलना",
        "Comparación visual por píxeles con modos paralelo, superposición y diferencias",
        "Comparaison visuelle pixel par pixel : côte à côte, superposition et différence",
        "Pixelgenauer Bildvergleich mit Nebeneinander-, Überlagerungs- und Differenzmodus",
        "並列・重ね合わせ・差分モードでピクセル単位の画像比較",
        "通过并排、叠加和差异模式逐像素比较图像",
        "مقارنة بصرية دقيقة بالبكسل بأنماط التجاور والتراكب والفروق"
    ],
    "Drop image or click": [
        "छवि छोड़ें या क्लिक करें",
        "Suelta una imagen o haz clic",
        "Déposez une image ou cliquez",
        "Bild ablegen oder klicken",
        "画像をドロップまたはクリック",
        "拖入图像或点击",
        "أسقط صورة أو انقر"
    ],
    "Comparison mode": [
        "तुलना मोड",
        "Modo de comparación",
        "Mode de comparaison",
        "Vergleichsmodus",
        "比較モード",
        "比较模式",
        "نمط المقارنة"
    ],
    "Side-by-side": [
        "साथ-साथ",
        "En paralelo",
        "Côte à côte",
        "Nebeneinander",
        "並列",
        "并排",
        "جنبًا إلى جنب"
    ],
    "Overlay": [
        "ओवरले",
        "Superposición",
        "Superposition",
        "Überlagerung",
        "重ね合わせ",
        "叠加",
        "تراكب"
    ],
    "Difference": [
        "अंतर",
        "Diferencias",
        "Différence",
        "Differenz",
        "差分",
        "差异",
        "الفروق"
    ],
    "Tolerance: {count}": [
        "सहनशीलता: {count}",
        "Tolerancia: {count}",
        "Tolérance : {count}",
        "Toleranz: {count}",
        "許容値: {count}",
        "容差：{count}",
        "السماحية: {count}"
    ],
    "Pixel tolerance": [
        "पिक्सेल सहनशीलता",
        "Tolerancia de píxeles",
        "Tolérance des pixels",
        "Pixeltoleranz",
        "ピクセルの許容値",
        "像素容差",
        "سماحية البكسل"
    ],
    "Top opacity: {percent}": [
        "ऊपरी परत की अपारदर्शिता: {percent}",
        "Opacidad superior: {percent}",
        "Opacité supérieure : {percent}",
        "Obere Deckkraft: {percent}",
        "上の画像の不透明度: {percent}",
        "上层不透明度：{percent}",
        "عتامة الطبقة العليا: {percent}"
    ],
    "Overlay opacity": [
        "ओवरले की अपारदर्शिता",
        "Opacidad de superposición",
        "Opacité de superposition",
        "Deckkraft der Überlagerung",
        "重ね合わせの不透明度",
        "叠加不透明度",
        "عتامة التراكب"
    ],
    "Different pixels: {count}": [
        "भिन्न पिक्सेल: {count}",
        "Píxeles distintos: {count}",
        "Pixels différents : {count}",
        "Unterschiedliche Pixel: {count}",
        "異なるピクセル数: {count}",
        "不同像素：{count}",
        "البكسلات المختلفة: {count}"
    ],
    "Comparison": [
        "तुलना",
        "Comparación",
        "Comparaison",
        "Vergleich",
        "比較",
        "比较",
        "المقارنة"
    ],
    "Load images on both sides": [
        "दोनों ओर छवियाँ लोड करें",
        "Carga imágenes en ambos lados",
        "Chargez des images des deux côtés",
        "Bilder auf beiden Seiten laden",
        "両側に画像を読み込んでください",
        "请在两侧加载图像",
        "حمّل صورًا على الجانبين"
    ],
    "Unable to compare these contracts.": [
        "इन कॉन्ट्रैक्ट की तुलना नहीं हो सकी।",
        "No se pudieron comparar estos contratos.",
        "Impossible de comparer ces contrats.",
        "Diese Verträge konnten nicht verglichen werden.",
        "これらの契約を比較できませんでした。",
        "无法比较这些契约。",
        "تعذر مقارنة هذه العقود."
    ],
    "Compare API specifications and surface breaking contract changes before release": [
        "रिलीज़ से पहले API विनिर्देशों की तुलना करें और असंगत बदलाव खोजें",
        "Compara especificaciones API y detecta cambios incompatibles antes de publicar",
        "Comparez les spécifications API et repérez les incompatibilités avant publication",
        "API-Spezifikationen vergleichen und inkompatible Änderungen vor der Freigabe erkennen",
        "API仕様を比較し、リリース前に互換性を損なう変更を確認",
        "比较 API 规范，在发布前发现破坏性契约变更",
        "قارن مواصفات API واكشف تغييرات العقود الكاسرة للتوافق قبل الإصدار"
    ],
    "Compare contracts": [
        "कॉन्ट्रैक्ट की तुलना करें",
        "Comparar contratos",
        "Comparer les contrats",
        "Verträge vergleichen",
        "契約を比較",
        "比较契约",
        "مقارنة العقود"
    ],
    "Breaking changes: {count}": [
        "असंगत बदलाव: {count}",
        "Cambios incompatibles: {count}",
        "Changements incompatibles : {count}",
        "Inkompatible Änderungen: {count}",
        "互換性を損なう変更: {count}",
        "破坏性变更：{count}",
        "التغييرات الكاسرة للتوافق: {count}"
    ],
    "No breaking changes found in evaluated rules": [
        "जाँचे गए नियमों में असंगत बदलाव नहीं मिले",
        "No se encontraron cambios incompatibles en las reglas evaluadas",
        "Aucun changement incompatible trouvé selon les règles évaluées",
        "Keine inkompatiblen Änderungen in den geprüften Regeln gefunden",
        "評価した規則では互換性を損なう変更は見つかりませんでした",
        "已评估规则中未发现破坏性变更",
        "لم تُعثر على تغييرات كاسرة للتوافق وفق القواعد المقيّمة"
    ],
    "Published baseline": [
        "प्रकाशित आधार",
        "Base publicada",
        "Référence publiée",
        "Veröffentlichte Baseline",
        "公開中のベースライン",
        "已发布基线",
        "خط الأساس المنشور"
    ],
    "Published OpenAPI contract": [
        "प्रकाशित OpenAPI कॉन्ट्रैक्ट",
        "Contrato OpenAPI publicado",
        "Contrat OpenAPI publié",
        "Veröffentlichter OpenAPI-Vertrag",
        "公開中のOpenAPI契約",
        "已发布的 OpenAPI 契约",
        "عقد OpenAPI المنشور"
    ],
    "Proposed contract": [
        "प्रस्तावित कॉन्ट्रैक्ट",
        "Contrato propuesto",
        "Contrat proposé",
        "Vorgeschlagener Vertrag",
        "変更案の契約",
        "拟议契约",
        "العقد المقترح"
    ],
    "Proposed OpenAPI contract": [
        "प्रस्तावित OpenAPI कॉन्ट्रैक्ट",
        "Contrato OpenAPI propuesto",
        "Contrat OpenAPI proposé",
        "Vorgeschlagener OpenAPI-Vertrag",
        "変更案のOpenAPI契約",
        "拟议的 OpenAPI 契约",
        "عقد OpenAPI المقترح"
    ],
    "Compatibility findings": [
        "संगतता निष्कर्ष",
        "Hallazgos de compatibilidad",
        "Résultats de compatibilité",
        "Kompatibilitätsbefunde",
        "互換性の検出結果",
        "兼容性检查结果",
        "نتائج التوافق"
    ],
    "No compatibility findings in evaluated rules": [
        "जाँचे गए नियमों में संगतता समस्याएँ नहीं मिलीं",
        "No hay hallazgos de compatibilidad en las reglas evaluadas",
        "Aucun problème de compatibilité selon les règles évaluées",
        "Keine Kompatibilitätsbefunde in den geprüften Regeln",
        "評価した規則では互換性の問題は見つかりませんでした",
        "已评估规则中未发现兼容性问题",
        "لا توجد نتائج توافق ضمن القواعد المقيّمة"
    ],
    "Tested document families: Swagger 2.0 and OpenAPI 3.0, 3.1 and 3.2. Review behavioral changes, composition and reference warnings separately. An empty report is not a guarantee of full compatibility.": [
        "परीक्षित दस्तावेज़: Swagger 2.0 और OpenAPI 3.0, 3.1, 3.2। व्यवहार बदलाव, संरचना और संदर्भ चेतावनियों की अलग समीक्षा करें। खाली रिपोर्ट पूर्ण संगतता की गारंटी नहीं है।",
        "Familias probadas: Swagger 2.0 y OpenAPI 3.0, 3.1 y 3.2. Revisa aparte los cambios de comportamiento, composición y referencias. Un informe vacío no garantiza compatibilidad total.",
        "Familles testées : Swagger 2.0 et OpenAPI 3.0, 3.1 et 3.2. Examinez séparément les changements de comportement, la composition et les références. Un rapport vide ne garantit pas une compatibilité totale.",
        "Geprüfte Dokumentfamilien: Swagger 2.0 und OpenAPI 3.0, 3.1 und 3.2. Verhaltensänderungen, Komposition und Referenzwarnungen separat prüfen. Ein leerer Bericht garantiert keine vollständige Kompatibilität.",
        "検証済み形式はSwagger 2.0とOpenAPI 3.0、3.1、3.2です。動作の変更、合成、参照の警告は別途確認してください。空のレポートは完全な互換性を保証しません。",
        "已测试文档类型：Swagger 2.0 以及 OpenAPI 3.0、3.1、3.2。行为变化、组合和引用警告应另行审查。空报告不保证完全兼容。",
        "العائلات المختبرة: Swagger 2.0 وOpenAPI 3.0 و3.1 و3.2. راجع تغييرات السلوك والتركيب وتحذيرات المراجع بصورة منفصلة. التقرير الفارغ لا يضمن توافقًا كاملًا."
    ],
    "Added": [
        "जोड़ा गया",
        "Añadido",
        "Ajouté",
        "Hinzugefügt",
        "追加",
        "新增",
        "مضاف"
    ],
    "Removed": [
        "हटाया गया",
        "Eliminado",
        "Supprimé",
        "Entfernt",
        "削除",
        "已删除",
        "محذوف"
    ],
    "Unchanged": [
        "अपरिवर्तित",
        "Sin cambios",
        "Inchangé",
        "Unverändert",
        "未変更",
        "未更改",
        "غير متغير"
    ],
    "Breaking": [
        "असंगत",
        "Incompatible",
        "Incompatible",
        "Inkompatibel",
        "互換性の破壊",
        "破坏性",
        "كاسر للتوافق"
    ],
    "Needs review": [
        "समीक्षा ज़रूरी",
        "Requiere revisión",
        "À examiner",
        "Prüfung erforderlich",
        "要確認",
        "需审查",
        "يتطلب مراجعة"
    ],
    "Information": [
        "जानकारी",
        "Información",
        "À titre informatif",
        "Informationen",
        "情報",
        "信息",
        "معلومات"
    ]
};
