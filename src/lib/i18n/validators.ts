import type { TranslationColumns } from "./tool-names";

// Authored interface and help copy; XML, HTML, XSD, XPath, regex and raw diagnostics stay exact.
export const VALIDATOR_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Validate XML syntax and well-formedness": [
        "XML सिंटैक्स और संरचना जाँचें",
        "Validar sintaxis y estructura XML",
        "Vérifier la syntaxe et la structure XML",
        "XML-Syntax und Wohlgeformtheit prüfen",
        "XMLの構文と整形式性を検証",
        "验证 XML 语法和格式",
        "التحقق من صياغة XML وسلامة بنيته"
    ],
    "An XML validator checks whether an XML document is well-formed according to XML specification. It verifies proper tag nesting, attribute syntax, entity references, and XML declaration.": [
        "XML सत्यापक टैग नेस्टिंग, एट्रिब्यूट सिंटैक्स, एंटिटी संदर्भ और घोषणा जाँचकर बताता है कि दस्तावेज़ XML मानक के अनुसार सही बना है या नहीं।",
        "Un validador XML comprueba que el documento respete la especificación: anidación de etiquetas, sintaxis de atributos, referencias a entidades y declaración XML.",
        "Un validateur XML vérifie la conformité du document : imbrication des balises, syntaxe des attributs, références d’entités et déclaration XML.",
        "Ein XML-Prüfer kontrolliert die Wohlgeformtheit nach XML-Spezifikation: Verschachtelung, Attributsyntax, Entitätsreferenzen und XML-Deklaration.",
        "XML検証ツールは、タグの入れ子、属性の構文、実体参照、XML宣言を確認し、文書がXML仕様に沿った整形式かを調べます。",
        "XML 验证工具检查标签嵌套、属性语法、实体引用和 XML 声明，确认文档是否符合 XML 格式规范。",
        "يتحقق مدقق XML من توافق بنية المستند مع المواصفات، بما يشمل تداخل الوسوم وصياغة السمات ومراجع الكيانات وإعلان XML."
    ],
    "Malformed XML causes parser failures in applications. Validating XML ensures documents can be processed correctly by any XML-compliant parser or SOAP service.": [
        "गलत XML से ऐप में पार्सिंग विफल होती है। सत्यापन से XML पार्सर और SOAP सेवाएँ दस्तावेज़ सही पढ़ सकती हैं।",
        "El XML mal formado provoca fallos de análisis. Validarlo permite procesarlo correctamente en analizadores XML y servicios SOAP.",
        "Un XML mal formé provoque des erreurs d’analyse. La validation permet son traitement correct par les analyseurs XML et services SOAP.",
        "Fehlerhaftes XML führt zu Parserfehlern. Validierung ermöglicht die korrekte Verarbeitung durch XML-Parser und SOAP-Dienste.",
        "整形式でないXMLは解析エラーの原因になります。検証により、XML準拠のパーサーやSOAPサービスで正しく処理できるか確認します。",
        "格式错误的 XML 会导致应用解析失败。验证可确保 XML 解析器和 SOAP 服务能正确处理文档。",
        "يؤدي XML غير السليم إلى فشل التحليل في التطبيقات. يساعد التحقق في معالجة المستندات بشكل صحيح عبر محللات XML وخدمات SOAP."
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
    "Validation runs automatically as you type": [
        "टाइप करते समय सत्यापन अपने आप होता है",
        "La validación se ejecuta al escribir",
        "La validation s’effectue pendant la saisie",
        "Beim Tippen wird automatisch geprüft",
        "入力中に自動で検証します",
        "输入时自动验证",
        "يتم التحقق تلقائيًا أثناء الكتابة"
    ],
    "Errors show with detailed descriptions": [
        "त्रुटियों के विस्तृत विवरण दिखते हैं",
        "Los errores incluyen descripciones detalladas",
        "Les erreurs sont accompagnées de descriptions détaillées",
        "Fehler erscheinen mit ausführlicher Beschreibung",
        "エラーの詳細が表示されます",
        "显示错误的详细说明",
        "تظهر الأخطاء مع وصف مفصل"
    ],
    "Valid XML displays document structure info": [
        "सही XML की दस्तावेज़ संरचना दिखती है",
        "El XML válido muestra su estructura",
        "Le XML valide affiche sa structure",
        "Gültiges XML zeigt die Dokumentstruktur",
        "有効なXMLには文書構造の情報が表示されます",
        "有效 XML 会显示文档结构信息",
        "يعرض XML السليم معلومات بنية المستند"
    ],
    "XML is case-sensitive: <Tag> and <tag> are different": [
        "XML में अक्षरों का केस मायने रखता है: <Tag> और <tag> अलग हैं",
        "XML distingue mayúsculas: <Tag> y <tag> son diferentes",
        "XML distingue la casse : <Tag> et <tag> sont différents",
        "XML unterscheidet Groß-/Kleinschreibung: <Tag> und <tag> sind verschieden",
        "XMLは大文字と小文字を区別します。<Tag>と<tag>は異なります",
        "XML 区分大小写：<Tag> 和 <tag> 不同",
        "يميز XML بين حالة الأحرف: <Tag> و<tag> مختلفان"
    ],
    "All elements must have closing tags or be self-closing": [
        "हर तत्व का समापन टैग हो या वह स्व-समापन हो",
        "Cada elemento debe cerrarse o ser autocerrado",
        "Chaque élément doit être fermé ou autofermant",
        "Jedes Element benötigt einen Endtag oder muss selbstschließend sein",
        "すべての要素に終了タグか自己終了タグが必要です",
        "所有元素必须有结束标签或自行闭合",
        "يجب إغلاق كل عنصر بوسم نهاية أو وسم ذاتي الإغلاق"
    ],
    "Attribute values must be quoted (single or double)": [
        "एट्रिब्यूट मान एकल या दोहरे उद्धरणों में हों",
        "Los valores de atributos deben llevar comillas simples o dobles",
        "Les valeurs d’attributs doivent être entre guillemets simples ou doubles",
        "Attributwerte benötigen einfache oder doppelte Anführungszeichen",
        "属性値は一重または二重引用符で囲みます",
        "属性值必须用单引号或双引号括起",
        "يجب وضع قيم السمات بين علامتي اقتباس مفردتين أو مزدوجتين"
    ],
    "Special characters like < > & must be escaped": [
        "< > & जैसे विशेष वर्ण एस्केप करें",
        "Escapa caracteres especiales como < > &",
        "Échappez les caractères spéciaux comme < > &",
        "Sonderzeichen wie < > & maskieren",
        "< > &などの特殊文字はエスケープします",
        "< > & 等特殊字符必须转义",
        "استخدم تسلسلات الهروب للأحرف الخاصة مثل < > &"
    ],
    "Validating SOAP request/response messages": [
        "SOAP अनुरोध और प्रतिक्रिया संदेश जाँचना",
        "Validar mensajes de solicitud y respuesta SOAP",
        "Valider les requêtes et réponses SOAP",
        "SOAP-Anfragen und -Antworten prüfen",
        "SOAPの要求・応答メッセージの検証",
        "验证 SOAP 请求和响应消息",
        "التحقق من رسائل طلبات SOAP واستجاباتها"
    ],
    "Checking XML configuration files": [
        "XML कॉन्फ़िगरेशन फ़ाइलें जाँचना",
        "Comprobar archivos de configuración XML",
        "Vérifier les fichiers de configuration XML",
        "XML-Konfigurationsdateien prüfen",
        "XML設定ファイルの確認",
        "检查 XML 配置文件",
        "فحص ملفات إعداد XML"
    ],
    "Verifying XML exports before import": [
        "आयात से पहले XML निर्यात जाँचना",
        "Verificar exportaciones XML antes de importarlas",
        "Vérifier les exports XML avant importation",
        "XML-Exporte vor dem Import prüfen",
        "インポート前のXML出力の確認",
        "导入前检查 XML 导出文件",
        "فحص صادرات XML قبل استيرادها"
    ],
    "Debugging XML parsing errors": [
        "XML पार्सिंग त्रुटियाँ ढूँढना",
        "Depurar errores de análisis XML",
        "Déboguer les erreurs d’analyse XML",
        "XML-Parserfehler untersuchen",
        "XML解析エラーの調査",
        "排查 XML 解析错误",
        "تشخيص أخطاء تحليل XML"
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
    "XML input editor": [
        "XML इनपुट संपादक",
        "Editor de entrada XML",
        "Éditeur de saisie XML",
        "XML-Eingabeeditor",
        "XML入力エディター",
        "XML 输入编辑器",
        "محرر إدخال XML"
    ],
    "The XML is well-formed and valid.": [
        "XML सही संरचना वाला और मान्य है।",
        "El XML está bien formado y es válido.",
        "Le XML est bien formé et valide.",
        "Das XML ist wohlgeformt und gültig.",
        "XMLは整形式で有効です。",
        "XML 格式正确且有效。",
        "XML سليم البنية وصالح."
    ],
    "Elements: {count}": [
        "तत्व: {count}",
        "Elementos: {count}",
        "Éléments : {count}",
        "Elemente: {count}",
        "要素数: {count}",
        "元素数：{count}",
        "العناصر: {count}"
    ],
    "Attributes: {count}": [
        "एट्रिब्यूट: {count}",
        "Atributos: {count}",
        "Attributs : {count}",
        "Attribute: {count}",
        "属性数: {count}",
        "属性数：{count}",
        "السمات: {count}"
    ],
    "Line {line}": [
        "पंक्ति {line}",
        "Línea {line}",
        "Ligne {line}",
        "Zeile {line}",
        "行 {line}",
        "第 {line} 行",
        "السطر {line}"
    ],
    ", Column {column}": [
        ", कॉलम {column}",
        ", columna {column}",
        ", colonne {column}",
        ", Spalte {column}",
        "、列 {column}",
        "，第 {column} 列",
        "، العمود {column}"
    ],
    "Common XML Errors": [
        "सामान्य XML त्रुटियाँ",
        "Errores XML habituales",
        "Erreurs XML courantes",
        "Häufige XML-Fehler",
        "よくあるXMLエラー",
        "常见 XML 错误",
        "أخطاء XML الشائعة"
    ],
    "Unclosed tags": [
        "बिना समापन वाले टैग",
        "Etiquetas sin cerrar",
        "Balises non fermées",
        "Nicht geschlossene Tags",
        "閉じられていないタグ",
        "未闭合标签",
        "وسوم غير مغلقة"
    ],
    "Every opening tag must have a corresponding closing tag, or be self-closing.": [
        "हर शुरुआती टैग का समापन टैग हो या वह स्व-समापन हो।",
        "Cada etiqueta de apertura debe tener un cierre o ser autocerrada.",
        "Chaque balise ouvrante doit avoir une fermeture ou être autofermante.",
        "Jeder öffnende Tag benötigt einen Endtag oder muss selbstschließend sein.",
        "開始タグには対応する終了タグが必要です。自己終了タグも使えます。",
        "每个开始标签都必须有对应的结束标签，或自行闭合。",
        "يجب أن يكون لكل وسم بداية وسم نهاية مطابق، أو أن يكون ذاتي الإغلاق."
    ],
    "Mismatched tags": [
        "बेमेल टैग",
        "Etiquetas no coincidentes",
        "Balises non concordantes",
        "Nicht passende Tags",
        "対応しないタグ",
        "标签不匹配",
        "وسوم غير متطابقة"
    ],
    "Tags must be properly nested.": [
        "टैग सही क्रम में नेस्ट होने चाहिए।",
        "Las etiquetas deben anidarse correctamente.",
        "Les balises doivent être correctement imbriquées.",
        "Tags müssen korrekt verschachtelt sein.",
        "タグは正しく入れ子にします。",
        "标签必须正确嵌套。",
        "يجب أن تتداخل الوسوم بشكل صحيح."
    ],
    "is invalid.": [
        "अमान्य है।",
        "no es válido.",
        "est invalide.",
        "ist ungültig.",
        "は無効です。",
        "无效。",
        "غير صالح."
    ],
    "Unquoted attributes": [
        "बिना उद्धरण के एट्रिब्यूट",
        "Atributos sin comillas",
        "Attributs sans guillemets",
        "Attribute ohne Anführungszeichen",
        "引用符のない属性",
        "属性未加引号",
        "سمات بلا اقتباس"
    ],
    "Attribute values must be quoted: name=\"value\"": [
        "एट्रिब्यूट मान उद्धरणों में हों: name=\"value\"",
        "Los atributos deben llevar comillas: name=\"value\"",
        "Les attributs doivent être entre guillemets : name=\"value\"",
        "Attributwerte benötigen Anführungszeichen: name=\"value\"",
        "属性値を引用符で囲みます: name=\"value\"",
        "属性值必须加引号：name=\"value\"",
        "يجب اقتباس قيم السمات: name=\"value\""
    ],
    "Special characters": [
        "विशेष वर्ण",
        "Caracteres especiales",
        "Caractères spéciaux",
        "Sonderzeichen",
        "特殊文字",
        "特殊字符",
        "أحرف خاصة"
    ],
    "Use entities for < > & in text content.": [
        "टेक्स्ट में < > & के लिए एंटिटी उपयोग करें।",
        "Usa entidades para < > & en el texto.",
        "Utilisez des entités pour < > & dans le texte.",
        "Im Text Entitäten für < > & verwenden.",
        "テキスト中の< > &には実体参照を使います。",
        "文本内容中的 < > & 应使用实体。",
        "استخدم الكيانات لتمثيل < > & في النص."
    ],
    "Multiple root elements": [
        "एक से अधिक मूल तत्व",
        "Varios elementos raíz",
        "Plusieurs éléments racines",
        "Mehrere Wurzelelemente",
        "複数のルート要素",
        "多个根元素",
        "عناصر جذر متعددة"
    ],
    "XML must have exactly one root element.": [
        "XML में केवल एक मूल तत्व होना चाहिए।",
        "XML debe tener un único elemento raíz.",
        "XML doit contenir un seul élément racine.",
        "XML muss genau ein Wurzelelement haben.",
        "XMLにはルート要素が1つだけ必要です。",
        "XML 必须且只能有一个根元素。",
        "يجب أن يحتوي XML على عنصر جذر واحد فقط."
    ],
    "XML Quick Reference": [
        "XML त्वरित संदर्भ",
        "Referencia rápida XML",
        "Aide-mémoire XML",
        "XML-Kurzreferenz",
        "XMLクイックリファレンス",
        "XML 速查",
        "مرجع XML سريع"
    ],
    "Declaration:": [
        "घोषणा:",
        "Declaración:",
        "Déclaration :",
        "Deklaration:",
        "宣言:",
        "声明：",
        "الإعلان:"
    ],
    "Tags are case-sensitive": [
        "टैग में केस मायने रखता है",
        "Las etiquetas distinguen mayúsculas",
        "Les balises distinguent la casse",
        "Tags unterscheiden Groß-/Kleinschreibung",
        "タグは大文字と小文字を区別します",
        "标签区分大小写",
        "الوسوم تميز حالة الأحرف"
    ],
    "Attribute values must be quoted": [
        "एट्रिब्यूट मान उद्धरणों में हों",
        "Los valores de atributos necesitan comillas",
        "Les valeurs d’attributs doivent être entre guillemets",
        "Attributwerte benötigen Anführungszeichen",
        "属性値は引用符で囲みます",
        "属性值必须加引号",
        "يجب اقتباس قيم السمات"
    ],
    "Self-closing:": [
        "स्व-समापन:",
        "Autocierre:",
        "Autofermeture :",
        "Selbstschließend:",
        "自己終了:",
        "自闭合：",
        "إغلاق ذاتي:"
    ],
    "Comments:": [
        "टिप्पणियाँ:",
        "Comentarios:",
        "Commentaires :",
        "Kommentare:",
        "コメント:",
        "注释：",
        "التعليقات:"
    ],
    "CDATA:": [
        "CDATA:",
        "CDATA:",
        "CDATA :",
        "CDATA:",
        "CDATA:",
        "CDATA：",
        "CDATA:"
    ],
    "Validate HTML markup for errors and best practices": [
        "HTML मार्कअप की त्रुटियाँ और अच्छे अभ्यास जाँचें",
        "Validar errores y buenas prácticas de HTML",
        "Vérifier les erreurs et bonnes pratiques HTML",
        "HTML-Markup auf Fehler und bewährte Verfahren prüfen",
        "HTMLのエラーと推奨事項を確認",
        "检查 HTML 标记错误和最佳实践",
        "فحص أخطاء HTML والممارسات الموصى بها"
    ],
    "An HTML validator checks markup for syntax errors, missing tags, accessibility issues, and HTML5 compliance. It identifies problems that might cause rendering issues or SEO penalties.": [
        "HTML सत्यापक सिंटैक्स, गायब टैग, सुलभता और HTML5 अनुपालन की समस्याएँ ढूँढता है, जो प्रदर्शन या SEO को प्रभावित कर सकती हैं।",
        "Un validador HTML detecta errores de sintaxis, etiquetas ausentes, problemas de accesibilidad y conformidad HTML5 que pueden afectar a la visualización o al SEO.",
        "Un validateur HTML détecte les erreurs de syntaxe, les balises manquantes et les problèmes d’accessibilité ou de conformité HTML5 pouvant affecter le rendu ou le référencement.",
        "Ein HTML-Prüfer erkennt Syntaxfehler, fehlende Tags sowie Probleme mit Barrierefreiheit und HTML5-Konformität, die Darstellung oder SEO beeinträchtigen können.",
        "HTML検証ツールは、構文エラー、欠落タグ、アクセシビリティ、HTML5準拠を確認し、表示やSEOに影響する問題を見つけます。",
        "HTML 验证工具检查语法错误、缺少的标签、无障碍问题和 HTML5 合规性，发现可能影响呈现或 SEO 的问题。",
        "يفحص مدقق HTML أخطاء الصياغة والوسوم المفقودة وإمكانية الوصول والتوافق مع HTML5، ويكشف مشكلات قد تؤثر في العرض أو تحسين البحث."
    ],
    "Valid HTML improves browser compatibility, accessibility, SEO, and maintainability. Catching errors early prevents display issues and helps meet web standards.": [
        "सही HTML से ब्राउज़र अनुकूलता, सुलभता, SEO और रखरखाव बेहतर होते हैं। जल्दी त्रुटियाँ ढूँढने से प्रदर्शन समस्याएँ घटती हैं और वेब मानकों का पालन होता है।",
        "El HTML válido mejora la compatibilidad, accesibilidad, SEO y mantenimiento. Detectar errores pronto evita problemas de visualización y ayuda a cumplir los estándares web.",
        "Un HTML valide améliore la compatibilité, l’accessibilité, le référencement et la maintenance. Détecter les erreurs tôt évite les problèmes d’affichage et facilite le respect des normes web.",
        "Gültiges HTML verbessert Browserkompatibilität, Barrierefreiheit, SEO und Wartbarkeit. Frühe Fehlererkennung verhindert Darstellungsprobleme und unterstützt Webstandards.",
        "有効なHTMLはブラウザー互換性、アクセシビリティ、SEO、保守性を向上させます。早期のエラー発見で表示の問題を防ぎ、Web標準に対応できます。",
        "有效 HTML 可改善浏览器兼容性、无障碍体验、SEO 和可维护性。及早发现错误有助于避免显示问题并符合 Web 标准。",
        "يحسن HTML السليم توافق المتصفحات وإمكانية الوصول وتحسين البحث والصيانة. ويمنع اكتشاف الأخطاء مبكرًا مشكلات العرض ويساعد في اتباع معايير الويب."
    ],
    "Paste your HTML code in the input editor": [
        "इनपुट संपादक में HTML पेस्ट करें",
        "Pega el HTML en el editor de entrada",
        "Collez le HTML dans l’éditeur de saisie",
        "HTML in den Eingabeeditor einfügen",
        "入力エディターにHTMLを貼り付けます",
        "将 HTML 代码粘贴到输入编辑器",
        "الصق HTML في محرر الإدخال"
    ],
    "Validation runs automatically showing errors and warnings": [
        "सत्यापन अपने आप त्रुटियाँ और चेतावनियाँ दिखाता है",
        "La validación muestra errores y avisos automáticamente",
        "La validation affiche automatiquement erreurs et avertissements",
        "Automatische Prüfung zeigt Fehler und Warnungen",
        "自動検証でエラーと警告を表示します",
        "自动验证并显示错误和警告",
        "يعرض التحقق الأخطاء والتحذيرات تلقائيًا"
    ],
    "Click on issues to see detailed explanations": [
        "विस्तृत विवरण के लिए समस्याएँ क्लिक करें",
        "Haz clic en los problemas para ver detalles",
        "Cliquez sur les problèmes pour voir les détails",
        "Probleme für ausführliche Erklärungen anklicken",
        "問題をクリックして詳細を確認します",
        "点击问题查看详细说明",
        "انقر على المشكلات لعرض الشرح المفصل"
    ],
    "Fix issues to improve HTML quality": [
        "HTML की गुणवत्ता सुधारने के लिए त्रुटियाँ ठीक करें",
        "Corrige los problemas para mejorar el HTML",
        "Corrigez les problèmes pour améliorer le HTML",
        "Probleme beheben, um die HTML-Qualität zu verbessern",
        "問題を修正してHTMLの品質を改善します",
        "修复问题以改善 HTML 质量",
        "أصلح المشكلات لتحسين جودة HTML"
    ],
    "Always include doctype, html, head, and body tags": [
        "doctype, html, head और body टैग हमेशा रखें",
        "Incluye siempre doctype, html, head y body",
        "Incluez toujours doctype, html, head et body",
        "Immer doctype, html, head und body angeben",
        "doctype、html、head、bodyを必ず含めます",
        "始终包含 doctype、html、head 和 body 标签",
        "أدرج دائمًا doctype وhtml وhead وbody"
    ],
    "Close all tags or use self-closing syntax for void elements": [
        "सभी टैग बंद करें या void तत्वों के लिए स्व-समापन सिंटैक्स उपयोग करें",
        "Cierra las etiquetas o usa autocierre para elementos vacíos",
        "Fermez les balises ou utilisez l’autofermeture pour les éléments vides",
        "Tags schließen oder selbstschließende Syntax für leere Elemente verwenden",
        "タグを閉じるか、空要素には自己終了構文を使います",
        "闭合所有标签，或对空元素使用自闭合语法",
        "أغلق الوسوم أو استخدم صياغة الإغلاق الذاتي للعناصر الفارغة"
    ],
    "Add alt attributes to images for accessibility": [
        "सुलभता के लिए छवियों में alt जोड़ें",
        "Añade alt a las imágenes para accesibilidad",
        "Ajoutez alt aux images pour l’accessibilité",
        "Bildern für Barrierefreiheit alt-Attribute geben",
        "アクセシビリティのため画像にalt属性を付けます",
        "为图片添加 alt 属性以提升无障碍体验",
        "أضف alt للصور لتحسين إمكانية الوصول"
    ],
    "Use semantic elements like header, nav, main, footer": [
        "header, nav, main, footer जैसे अर्थपूर्ण तत्व उपयोग करें",
        "Usa elementos semánticos como header, nav, main y footer",
        "Utilisez des éléments sémantiques comme header, nav, main et footer",
        "Semantische Elemente wie header, nav, main und footer verwenden",
        "header、nav、main、footerなどの意味的な要素を使います",
        "使用 header、nav、main、footer 等语义元素",
        "استخدم عناصر دلالية مثل header وnav وmain وfooter"
    ],
    "Checking email templates before sending": [
        "भेजने से पहले ईमेल टेम्पलेट जाँचना",
        "Revisar plantillas de correo antes de enviarlas",
        "Vérifier les modèles d’e-mail avant envoi",
        "E-Mail-Vorlagen vor dem Versand prüfen",
        "送信前のメールテンプレート確認",
        "发送前检查邮件模板",
        "فحص قوالب البريد قبل الإرسال"
    ],
    "Validating web page markup for SEO": [
        "SEO के लिए वेब पेज मार्कअप जाँचना",
        "Validar el marcado web para SEO",
        "Valider le balisage web pour le référencement",
        "Webseiten-Markup für SEO prüfen",
        "SEO向けのWebページマークアップ検証",
        "为 SEO 验证网页标记",
        "فحص ترميز الصفحات لتحسين البحث"
    ],
    "Ensuring accessibility compliance": [
        "सुलभता अनुपालन जाँचना",
        "Comprobar la conformidad de accesibilidad",
        "Vérifier la conformité d’accessibilité",
        "Barrierefreiheit prüfen",
        "アクセシビリティへの対応確認",
        "检查无障碍合规性",
        "فحص التوافق مع إمكانية الوصول"
    ],
    "Debugging rendering issues in browsers": [
        "ब्राउज़र प्रदर्शन समस्याएँ ढूँढना",
        "Depurar problemas de visualización en navegadores",
        "Déboguer les problèmes de rendu des navigateurs",
        "Darstellungsprobleme im Browser untersuchen",
        "ブラウザー表示の問題調査",
        "排查浏览器呈现问题",
        "تشخيص مشكلات العرض في المتصفحات"
    ],
    "HTML Input": [
        "HTML इनपुट",
        "Entrada HTML",
        "Entrée HTML",
        "HTML-Eingabe",
        "HTML入力",
        "HTML 输入",
        "إدخال HTML"
    ],
    "HTML input editor": [
        "HTML इनपुट संपादक",
        "Editor de entrada HTML",
        "Éditeur de saisie HTML",
        "HTML-Eingabeeditor",
        "HTML入力エディター",
        "HTML 输入编辑器",
        "محرر إدخال HTML"
    ],
    "Valid HTML": [
        "मान्य HTML",
        "HTML válido",
        "HTML valide",
        "Gültiges HTML",
        "有効なHTML",
        "有效 HTML",
        "HTML صالح"
    ],
    "DOCTYPE ✓": [
        "DOCTYPE ✓",
        "DOCTYPE ✓",
        "DOCTYPE ✓",
        "DOCTYPE ✓",
        "DOCTYPE ✓",
        "DOCTYPE ✓",
        "DOCTYPE ✓"
    ],
    "Title ✓": [
        "शीर्षक ✓",
        "Título ✓",
        "Titre ✓",
        "Titel ✓",
        "タイトル ✓",
        "标题 ✓",
        "العنوان ✓"
    ],
    "Errors: {count}": [
        "त्रुटियाँ: {count}",
        "Errores: {count}",
        "Erreurs : {count}",
        "Fehler: {count}",
        "エラー数: {count}",
        "错误数：{count}",
        "الأخطاء: {count}"
    ],
    "Warnings: {count}": [
        "चेतावनियाँ: {count}",
        "Avisos: {count}",
        "Avertissements : {count}",
        "Warnungen: {count}",
        "警告数: {count}",
        "警告数：{count}",
        "التحذيرات: {count}"
    ],
    "Document Structure": [
        "दस्तावेज़ संरचना",
        "Estructura del documento",
        "Structure du document",
        "Dokumentstruktur",
        "文書構造",
        "文档结构",
        "بنية المستند"
    ],
    "Best Practices": [
        "अच्छे अभ्यास",
        "Buenas prácticas",
        "Bonnes pratiques",
        "Bewährte Verfahren",
        "推奨事項",
        "最佳实践",
        "ممارسات موصى بها"
    ],
    "Always include DOCTYPE": [
        "DOCTYPE हमेशा शामिल करें",
        "Incluye siempre DOCTYPE",
        "Incluez toujours DOCTYPE",
        "Immer DOCTYPE angeben",
        "DOCTYPEを必ず含めます",
        "始终包含 DOCTYPE",
        "أدرج DOCTYPE دائمًا"
    ],
    "Add lang attribute to html": [
        "html में lang एट्रिब्यूट जोड़ें",
        "Añade lang a html",
        "Ajoutez lang à html",
        "html um lang-Attribut ergänzen",
        "htmlにlang属性を付けます",
        "为 html 添加 lang 属性",
        "أضف سمة lang إلى html"
    ],
    "Use semantic HTML5 elements": [
        "अर्थपूर्ण HTML5 तत्व उपयोग करें",
        "Usa elementos semánticos HTML5",
        "Utilisez des éléments sémantiques HTML5",
        "Semantische HTML5-Elemente verwenden",
        "意味的なHTML5要素を使います",
        "使用语义化 HTML5 元素",
        "استخدم عناصر HTML5 الدلالية"
    ],
    "Include alt for images": [
        "छवियों के लिए alt शामिल करें",
        "Incluye alt para las imágenes",
        "Incluez alt pour les images",
        "alt für Bilder angeben",
        "画像にaltを付けます",
        "为图片包含 alt",
        "أدرج alt للصور"
    ],
    "Use proper heading hierarchy": [
        "सही शीर्षक क्रम रखें",
        "Usa una jerarquía de encabezados correcta",
        "Respectez la hiérarchie des titres",
        "Korrekte Überschriftenhierarchie verwenden",
        "見出しの階層を正しく設定します",
        "使用正确的标题层级",
        "استخدم تسلسل عناوين صحيحًا"
    ],
    "Close all non-void tags": [
        "सभी गैर-void टैग बंद करें",
        "Cierra todas las etiquetas no vacías",
        "Fermez toutes les balises non vides",
        "Alle nicht leeren Tags schließen",
        "空要素以外のタグをすべて閉じます",
        "闭合所有非空元素标签",
        "أغلق جميع الوسوم غير الفارغة"
    ],
    "XSD parsed successfully!": [
        "XSD सफलतापूर्वक पार्स हुआ!",
        "¡XSD analizado correctamente!",
        "XSD analysé avec succès !",
        "XSD erfolgreich eingelesen!",
        "XSDを解析しました！",
        "XSD 解析成功！",
        "تم تحليل XSD بنجاح!"
    ],
    "Please parse the XSD first": [
        "पहले XSD पार्स करें",
        "Analiza primero el XSD",
        "Analysez d’abord le XSD",
        "Zuerst XSD einlesen",
        "先にXSDを解析してください",
        "请先解析 XSD",
        "يرجى تحليل XSD أولًا"
    ],
    "Validation passed!": [
        "सत्यापन सफल रहा!",
        "¡Validación superada!",
        "Validation réussie !",
        "Prüfung bestanden!",
        "検証に成功しました！",
        "验证通过！",
        "نجح التحقق!"
    ],
    "Validation failed with {count} error(s)": [
        "सत्यापन में {count} त्रुटियाँ मिलीं",
        "La validación falló con {count} errores",
        "La validation a échoué avec {count} erreurs",
        "Prüfung mit {count} Fehlern fehlgeschlagen",
        "検証に失敗しました。エラー数: {count}",
        "验证失败，错误数：{count}",
        "فشل التحقق بعدد أخطاء: {count}"
    ],
    "XSD Validator": [
        "XSD सत्यापक",
        "Validador XSD",
        "Validateur XSD",
        "XSD-Prüfer",
        "XSD検証",
        "XSD 验证工具",
        "مدقق XSD"
    ],
    "Validate XML documents against XSD schemas": [
        "XSD स्कीमा के अनुसार XML दस्तावेज़ जाँचें",
        "Validar documentos XML con esquemas XSD",
        "Valider les documents XML avec des schémas XSD",
        "XML-Dokumente anhand von XSD-Schemas prüfen",
        "XSDスキーマに対してXML文書を検証",
        "根据 XSD 架构验证 XML 文档",
        "فحص مستندات XML وفق مخططات XSD"
    ],
    "XSD (XML Schema Definition) validation verifies that an XML document conforms to a specific schema. It checks element names, types, cardinality, and structure against the schema definition.": [
        "XSD (XML Schema Definition) सत्यापन जाँचता है कि XML दस्तावेज़ किसी स्कीमा से मेल खाता है या नहीं। इसमें तत्व के नाम, प्रकार, संख्या और संरचना शामिल हैं।",
        "La validación XSD (XML Schema Definition) comprueba que un XML se ajuste a un esquema: nombres de elementos, tipos, cardinalidad y estructura.",
        "La validation XSD (XML Schema Definition) vérifie qu’un document XML respecte un schéma : noms d’éléments, types, cardinalité et structure.",
        "XSD-Validierung (XML Schema Definition) prüft ein XML-Dokument anhand eines Schemas: Elementnamen, Typen, Häufigkeit und Struktur.",
        "XSD（XML Schema Definition）検証は、要素名、型、出現回数、構造をスキーマと照合し、XML文書の適合性を確認します。",
        "XSD（XML Schema Definition）验证检查 XML 文档是否符合指定架构，包括元素名称、类型、出现次数和结构。",
        "يتحقق XSD ‏(XML Schema Definition) من مطابقة مستند XML لمخطط محدد، بما يشمل أسماء العناصر وأنواعها وعدد مرات ظهورها وبنيتها."
    ],
    "XSD validation ensures XML data meets expected format requirements. It's essential for SOAP web services, enterprise integrations, and any system that requires strict data contracts.": [
        "XSD सत्यापन अपेक्षित डेटा प्रारूप सुनिश्चित करता है। यह SOAP सेवाओं, एंटरप्राइज़ एकीकरण और सख्त डेटा अनुबंध वाले सिस्टम के लिए आवश्यक है।",
        "La validación XSD asegura el formato esperado de los datos. Es esencial para servicios SOAP, integraciones empresariales y sistemas con contratos de datos estrictos.",
        "La validation XSD garantit le format attendu des données. Elle est essentielle aux services SOAP, aux intégrations d’entreprise et aux contrats de données stricts.",
        "XSD-Validierung sichert erwartete Datenformate. Sie ist für SOAP-Dienste, Unternehmensintegrationen und strenge Datenverträge wichtig.",
        "XSD検証は、XMLデータが所定の形式を満たすかを確認します。SOAPサービス、企業システム連携、厳密なデータ契約に役立ちます。",
        "XSD 验证确保 XML 数据符合预期格式要求，适用于 SOAP 服务、企业集成及需要严格数据契约的系统。",
        "يضمن التحقق عبر XSD توافق البيانات مع التنسيق المتوقع، وهو أساسي لخدمات SOAP وتكامل المؤسسات والأنظمة ذات عقود البيانات الصارمة."
    ],
    "Paste your XSD schema in the left editor": [
        "बाएँ संपादक में XSD स्कीमा पेस्ट करें",
        "Pega el esquema XSD en el editor izquierdo",
        "Collez le schéma XSD dans l’éditeur de gauche",
        "XSD-Schema im linken Editor einfügen",
        "左のエディターにXSDスキーマを貼り付けます",
        "将 XSD 架构粘贴到左侧编辑器",
        "الصق مخطط XSD في المحرر الأيسر"
    ],
    "Paste the XML document to validate in the right editor": [
        "दाएँ संपादक में जाँचने वाला XML पेस्ट करें",
        "Pega el XML que validar en el editor derecho",
        "Collez le XML à valider dans l’éditeur de droite",
        "Zu prüfendes XML im rechten Editor einfügen",
        "右のエディターに検証するXMLを貼り付けます",
        "将待验证 XML 文档粘贴到右侧编辑器",
        "الصق مستند XML المطلوب فحصه في المحرر الأيمن"
    ],
    "Click 'Validate' to check conformance": [
        "अनुपालन जाँचने के लिए 'सत्यापित करें' क्लिक करें",
        "Pulsa «Validar» para comprobar la conformidad",
        "Cliquez sur « Valider » pour vérifier la conformité",
        "Zum Prüfen der Konformität „Validieren“ anklicken",
        "「検証」をクリックして適合性を確認します",
        "点击“验证”检查是否符合架构",
        "انقر على «تحقق» لفحص المطابقة"
    ],
    "Review any schema violations or errors": [
        "स्कीमा उल्लंघन या त्रुटियाँ देखें",
        "Revisa las infracciones del esquema o errores",
        "Examinez les violations du schéma ou erreurs",
        "Schemaabweichungen und Fehler prüfen",
        "スキーマ違反やエラーを確認します",
        "查看架构违规或错误",
        "راجع مخالفات المخطط أو الأخطاء"
    ],
    "Ensure namespaces match between XSD and XML": [
        "XSD और XML के नेमस्पेस समान रखें",
        "Asegura que coincidan los espacios de nombres de XSD y XML",
        "Vérifiez que les espaces de noms XSD et XML correspondent",
        "Übereinstimmende Namensräume in XSD und XML sicherstellen",
        "XSDとXMLの名前空間を一致させます",
        "确保 XSD 和 XML 的命名空间匹配",
        "تأكد من تطابق مساحات الأسماء بين XSD وXML"
    ],
    "XSD can define complex types with specific constraints": [
        "XSD विशेष सीमाओं वाले जटिल प्रकार परिभाषित कर सकता है",
        "XSD puede definir tipos complejos con restricciones",
        "XSD peut définir des types complexes avec des contraintes",
        "XSD kann komplexe Typen mit Einschränkungen definieren",
        "XSDでは制約付きの複合型を定義できます",
        "XSD 可定义具有特定约束的复杂类型",
        "يمكن لـXSD تعريف أنواع مركبة بقيود محددة"
    ],
    "Use xs:sequence for ordered elements, xs:choice for alternatives": [
        "क्रमबद्ध तत्वों के लिए xs:sequence और विकल्पों के लिए xs:choice उपयोग करें",
        "Usa xs:sequence para ordenar elementos y xs:choice para alternativas",
        "Utilisez xs:sequence pour l’ordre et xs:choice pour les alternatives",
        "xs:sequence für geordnete Elemente, xs:choice für Alternativen verwenden",
        "要素の順序にはxs:sequence、選択肢にはxs:choiceを使います",
        "有序元素使用 xs:sequence，备选项使用 xs:choice",
        "استخدم xs:sequence لترتيب العناصر وxs:choice للبدائل"
    ],
    "Check targetNamespace and xmlns declarations": [
        "targetNamespace और xmlns घोषणाएँ जाँचें",
        "Comprueba targetNamespace y las declaraciones xmlns",
        "Vérifiez targetNamespace et les déclarations xmlns",
        "targetNamespace und xmlns-Deklarationen prüfen",
        "targetNamespaceとxmlns宣言を確認します",
        "检查 targetNamespace 和 xmlns 声明",
        "افحص targetNamespace وإعلانات xmlns"
    ],
    "Validating SOAP messages against WSDL types": [
        "WSDL प्रकारों के अनुसार SOAP संदेश जाँचना",
        "Validar mensajes SOAP con tipos WSDL",
        "Valider les messages SOAP selon les types WSDL",
        "SOAP-Nachrichten anhand von WSDL-Typen prüfen",
        "WSDL型に対するSOAPメッセージの検証",
        "根据 WSDL 类型验证 SOAP 消息",
        "التحقق من رسائل SOAP وفق أنواع WSDL"
    ],
    "Ensuring B2B data exchange compliance": [
        "B2B डेटा विनिमय अनुपालन जाँचना",
        "Comprobar la conformidad del intercambio B2B",
        "Vérifier la conformité des échanges B2B",
        "Konformität beim B2B-Datenaustausch prüfen",
        "B2Bデータ交換の適合性確認",
        "检查 B2B 数据交换合规性",
        "فحص توافق تبادل بيانات B2B"
    ],
    "Testing XML exports against specifications": [
        "विनिर्देशों के अनुसार XML निर्यात जाँचना",
        "Probar exportaciones XML con especificaciones",
        "Tester les exports XML selon les spécifications",
        "XML-Exporte gegen Spezifikationen prüfen",
        "仕様に対するXML出力のテスト",
        "根据规范测试 XML 导出",
        "اختبار صادرات XML وفق المواصفات"
    ],
    "Debugging schema validation errors": [
        "स्कीमा सत्यापन त्रुटियाँ ढूँढना",
        "Depurar errores de validación de esquemas",
        "Déboguer les erreurs de validation de schéma",
        "Fehler bei der Schemaprüfung untersuchen",
        "スキーマ検証エラーの調査",
        "排查架构验证错误",
        "تشخيص أخطاء التحقق من المخطط"
    ],
    "XSD Schema": [
        "XSD स्कीमा",
        "Esquema XSD",
        "Schéma XSD",
        "XSD-Schema",
        "XSDスキーマ",
        "XSD 架构",
        "مخطط XSD"
    ],
    "Parse XSD": [
        "XSD पार्स करें",
        "Analizar XSD",
        "Analyser XSD",
        "XSD einlesen",
        "XSDを解析",
        "解析 XSD",
        "تحليل XSD"
    ],
    "XSD schema editor": [
        "XSD स्कीमा संपादक",
        "Editor del esquema XSD",
        "Éditeur du schéma XSD",
        "XSD-Schemaeditor",
        "XSDスキーマエディター",
        "XSD 架构编辑器",
        "محرر مخطط XSD"
    ],
    "XSD Parse Error": [
        "XSD पार्स त्रुटि",
        "Error de análisis XSD",
        "Erreur d’analyse XSD",
        "XSD-Parserfehler",
        "XSD解析エラー",
        "XSD 解析错误",
        "خطأ تحليل XSD"
    ],
    "Schema Overview": [
        "स्कीमा अवलोकन",
        "Resumen del esquema",
        "Aperçu du schéma",
        "Schemaübersicht",
        "スキーマ概要",
        "架构概览",
        "نظرة عامة على المخطط"
    ],
    "Namespace": [
        "नेमस्पेस",
        "Espacio de nombres",
        "Espace de noms",
        "Namensraum",
        "名前空間",
        "命名空间",
        "مساحة الأسماء"
    ],
    "Elements": [
        "तत्व",
        "Elementos",
        "Éléments",
        "Elemente",
        "要素",
        "元素",
        "العناصر"
    ],
    "Types": [
        "प्रकार",
        "Tipos",
        "Types",
        "Typen",
        "型",
        "类型",
        "الأنواع"
    ],
    "Types ({count})": [
        "प्रकार ({count})",
        "Tipos ({count})",
        "Types ({count})",
        "Typen ({count})",
        "型（{count}）",
        "类型（{count}）",
        "الأنواع ({count})"
    ],
    "Kind": [
        "श्रेणी",
        "Clase",
        "Catégorie",
        "Art",
        "種別",
        "种类",
        "الفئة"
    ],
    "Complex": [
        "जटिल",
        "Complejo",
        "Complexe",
        "Komplex",
        "複合",
        "复杂",
        "مركب"
    ],
    "Simple": [
        "सरल",
        "Simple",
        "Simple",
        "Einfach",
        "単純",
        "简单",
        "بسيط"
    ],
    "Global Elements ({count})": [
        "वैश्विक तत्व ({count})",
        "Elementos globales ({count})",
        "Éléments globaux ({count})",
        "Globale Elemente ({count})",
        "グローバル要素（{count}）",
        "全局元素（{count}）",
        "العناصر العامة ({count})"
    ],
    "XML Document": [
        "XML दस्तावेज़",
        "Documento XML",
        "Document XML",
        "XML-Dokument",
        "XML文書",
        "XML 文档",
        "مستند XML"
    ],
    "Load valid sample": [
        "सही नमूना लोड करें",
        "Cargar ejemplo válido",
        "Charger un exemple valide",
        "Gültiges Beispiel laden",
        "有効なサンプルを読み込む",
        "加载有效示例",
        "تحميل مثال صالح"
    ],
    "Load invalid sample": [
        "गलत नमूना लोड करें",
        "Cargar ejemplo no válido",
        "Charger un exemple invalide",
        "Ungültiges Beispiel laden",
        "無効なサンプルを読み込む",
        "加载无效示例",
        "تحميل مثال غير صالح"
    ],
    "Validation Results": [
        "सत्यापन परिणाम",
        "Resultados de validación",
        "Résultats de validation",
        "Prüfergebnisse",
        "検証結果",
        "验证结果",
        "نتائج التحقق"
    ],
    "Info: {count}": [
        "जानकारी: {count}",
        "Información: {count}",
        "Informations : {count}",
        "Hinweise: {count}",
        "情報数: {count}",
        "信息数：{count}",
        "المعلومات: {count}"
    ],
    "Validation Successful": [
        "सत्यापन सफल",
        "Validación correcta",
        "Validation réussie",
        "Prüfung erfolgreich",
        "検証成功",
        "验证成功",
        "نجح التحقق"
    ],
    "The XML document is valid according to the XSD schema.": [
        "XML दस्तावेज़ XSD स्कीमा के अनुसार मान्य है।",
        "El documento XML es válido según el esquema XSD.",
        "Le document XML est valide selon le schéma XSD.",
        "Das XML-Dokument ist gemäß XSD-Schema gültig.",
        "XML文書はXSDスキーマに対して有効です。",
        "XML 文档符合 XSD 架构。",
        "مستند XML صالح وفق مخطط XSD."
    ],
    "Parse XSD First": [
        "पहले XSD पार्स करें",
        "Analizar XSD primero",
        "Analyser d’abord le XSD",
        "Zuerst XSD einlesen",
        "先にXSDを解析",
        "请先解析 XSD",
        "حلل XSD أولًا"
    ],
    "Please parse the XSD schema before validating XML documents.": [
        "XML दस्तावेज़ जाँचने से पहले XSD स्कीमा पार्स करें।",
        "Analiza el esquema XSD antes de validar el XML.",
        "Analysez le schéma XSD avant de valider le XML.",
        "Vor der XML-Prüfung das XSD-Schema einlesen.",
        "XML文書の検証前にXSDスキーマを解析してください。",
        "验证 XML 文档前，请先解析 XSD 架构。",
        "يرجى تحليل مخطط XSD قبل فحص مستندات XML."
    ],
    "Browser-based validation performs structural checks only. For complete type and constraint validation, use a dedicated XML validator like Xerces or libxml2.": [
        "ब्राउज़र में केवल संरचना जाँची जाती है। प्रकार और सीमाओं की पूरी जाँच के लिए Xerces या libxml2 जैसा XML सत्यापक उपयोग करें।",
        "El navegador solo realiza comprobaciones estructurales. Para validar tipos y restricciones por completo, usa un validador XML como Xerces o libxml2.",
        "Le navigateur ne vérifie que la structure. Pour valider tous les types et contraintes, utilisez un validateur XML comme Xerces ou libxml2.",
        "Im Browser werden nur Strukturen geprüft. Für vollständige Typ- und Einschränkungsprüfungen einen XML-Prüfer wie Xerces oder libxml2 verwenden.",
        "ブラウザーでは構造のみを検証します。型や制約の完全な検証には、Xercesやlibxml2などの専用XML検証ツールを使ってください。",
        "浏览器验证仅执行结构检查。完整的类型和约束验证需使用 Xerces 或 libxml2 等专用 XML 验证工具。",
        "يتحقق المتصفح من البنية فقط. لفحص الأنواع والقيود بالكامل، استخدم مدقق XML مخصصًا مثل Xerces أو libxml2."
    ],
    "All book elements": [
        "सभी book तत्व",
        "Todos los elementos book",
        "Tous les éléments book",
        "Alle book-Elemente",
        "すべてのbook要素",
        "所有 book 元素",
        "جميع عناصر book"
    ],
    "Fiction books": [
        "कथा साहित्य की पुस्तकें",
        "Libros de ficción",
        "Livres de fiction",
        "Belletristik",
        "フィクションの本",
        "小说类图书",
        "كتب أدبية"
    ],
    "All book titles": [
        "सभी पुस्तक शीर्षक",
        "Todos los títulos de libros",
        "Tous les titres des livres",
        "Alle Buchtitel",
        "すべての本のタイトル",
        "所有图书标题",
        "جميع عناوين الكتب"
    ],
    "Titles of books over $12": [
        "$12 से अधिक की पुस्तकों के शीर्षक",
        "Títulos de libros de más de $12",
        "Titres des livres à plus de $12",
        "Titel von Büchern über $12",
        "$12を超える本のタイトル",
        "价格超过 $12 的图书标题",
        "عناوين الكتب التي تزيد على $12"
    ],
    "English titles": [
        "अंग्रेज़ी शीर्षक",
        "Títulos en inglés",
        "Titres en anglais",
        "Englische Titel",
        "英語のタイトル",
        "英文标题",
        "العناوين الإنجليزية"
    ],
    "All category attributes": [
        "सभी category एट्रिब्यूट",
        "Todos los atributos category",
        "Tous les attributs category",
        "Alle category-Attribute",
        "すべてのcategory属性",
        "所有 category 属性",
        "جميع سمات category"
    ],
    "Author text nodes": [
        "लेखक के टेक्स्ट नोड",
        "Nodos de texto de autores",
        "Nœuds de texte des auteurs",
        "Textknoten der Autoren",
        "著者のテキストノード",
        "作者文本节点",
        "عقد نصوص المؤلفين"
    ],
    "Count of books": [
        "पुस्तकों की संख्या",
        "Cantidad de libros",
        "Nombre de livres",
        "Anzahl der Bücher",
        "本の数",
        "图书数量",
        "عدد الكتب"
    ],
    "Results copied!": [
        "परिणाम कॉपी हुए!",
        "¡Resultados copiados!",
        "Résultats copiés !",
        "Ergebnisse kopiert!",
        "結果をコピーしました！",
        "结果已复制！",
        "تم نسخ النتائج!"
    ],
    "Test and evaluate XPath expressions against XML": [
        "XML पर XPath अभिव्यक्तियाँ जाँचें और चलाएँ",
        "Probar y evaluar expresiones XPath en XML",
        "Tester et évaluer les expressions XPath sur XML",
        "XPath-Ausdrücke anhand von XML testen und auswerten",
        "XMLに対してXPath式をテスト・評価",
        "针对 XML 测试和求值 XPath 表达式",
        "اختبار تعبيرات XPath وتقييمها على XML"
    ],
    "XPath (XML Path Language) Tester evaluates XPath expressions against XML documents. XPath is a query language for selecting nodes from XML, similar to CSS selectors for HTML.": [
        "XPath (XML Path Language) टेस्टर XML दस्तावेज़ों पर XPath अभिव्यक्तियाँ चलाता है। XPath XML नोड चुनने की क्वेरी भाषा है, जैसे HTML के लिए CSS चयनकर्ता।",
        "El probador XPath (XML Path Language) evalúa expresiones en documentos XML. XPath selecciona nodos XML de forma similar a los selectores CSS en HTML.",
        "Le testeur XPath (XML Path Language) évalue les expressions sur des documents XML. XPath sélectionne les nœuds XML, comme les sélecteurs CSS pour HTML.",
        "Der XPath-Tester (XML Path Language) wertet Ausdrücke auf XML-Dokumenten aus. XPath wählt XML-Knoten ähnlich wie CSS-Selektoren in HTML aus.",
        "XPath（XML Path Language）テスターはXML文書に対して式を評価します。XPathは、HTMLのCSSセレクターと同様にXMLノードを選択するクエリ言語です。",
        "XPath（XML Path Language）测试工具对 XML 文档求值表达式。XPath 是用于选择 XML 节点的查询语言，类似于 HTML 的 CSS 选择器。",
        "يقيّم مختبر XPath ‏(XML Path Language) التعبيرات على مستندات XML. وهي لغة استعلام لاختيار عقد XML، مثل محددات CSS في HTML."
    ],
    "XPath is essential for XML processing, XSLT transformations, and web scraping. Testing expressions before using them in code saves debugging time and ensures correct node selection.": [
        "XPath XML प्रोसेसिंग, XSLT और वेब स्क्रैपिंग में आवश्यक है। कोड में लगाने से पहले अभिव्यक्तियाँ जाँचने से सही नोड चुनते हैं और डीबगिंग का समय बचता है।",
        "XPath es esencial para procesar XML, transformar XSLT y extraer datos web. Probar las expresiones antes de usarlas ahorra depuración y asegura seleccionar los nodos correctos.",
        "XPath est essentiel au traitement XML, aux transformations XSLT et à l’extraction web. Tester les expressions avant utilisation facilite le débogage et la sélection correcte des nœuds.",
        "XPath ist für XML-Verarbeitung, XSLT und Web-Scraping wichtig. Vorabtests sparen Fehlersuche und sichern die richtige Knotenauswahl.",
        "XPathはXML処理、XSLT変換、Webスクレイピングに役立ちます。コードに組み込む前に式をテストすると、デバッグの時間を減らし、正しいノードを選択できます。",
        "XPath 适用于 XML 处理、XSLT 转换和网页数据提取。使用前测试表达式可节省调试时间，确保选择正确节点。",
        "يُستخدم XPath في معالجة XML وتحويلات XSLT واستخراج بيانات الويب. اختبار التعبيرات قبل استخدامها يوفر وقت التشخيص ويضمن اختيار العقد الصحيحة."
    ],
    "Paste your XML document in the editor": [
        "संपादक में XML दस्तावेज़ पेस्ट करें",
        "Pega el documento XML en el editor",
        "Collez le document XML dans l’éditeur",
        "XML-Dokument im Editor einfügen",
        "エディターにXML文書を貼り付けます",
        "将 XML 文档粘贴到编辑器",
        "الصق مستند XML في المحرر"
    ],
    "Enter an XPath expression in the query field": [
        "क्वेरी फ़ील्ड में XPath अभिव्यक्ति लिखें",
        "Introduce una expresión XPath en la consulta",
        "Saisissez une expression XPath dans le champ de requête",
        "XPath-Ausdruck im Abfragefeld eingeben",
        "クエリ欄にXPath式を入力します",
        "在查询字段输入 XPath 表达式",
        "أدخل تعبير XPath في حقل الاستعلام"
    ],
    "Results show matching nodes immediately": [
        "मेल खाने वाले नोड तुरंत दिखते हैं",
        "Los nodos coincidentes aparecen al instante",
        "Les nœuds correspondants s’affichent immédiatement",
        "Passende Knoten erscheinen sofort",
        "一致するノードがすぐに表示されます",
        "立即显示匹配节点",
        "تظهر العقد المطابقة فورًا"
    ],
    "Use the quick reference for common expressions": [
        "सामान्य अभिव्यक्तियों के लिए त्वरित संदर्भ देखें",
        "Consulta la referencia de expresiones habituales",
        "Consultez l’aide-mémoire des expressions courantes",
        "Kurzreferenz für häufige Ausdrücke verwenden",
        "よく使う式はクイックリファレンスを参照します",
        "常用表达式请参阅速查",
        "استخدم المرجع السريع للتعبيرات الشائعة"
    ],
    "Use // to search anywhere in the document": [
        "पूरे दस्तावेज़ में खोजने के लिए // उपयोग करें",
        "Usa // para buscar en todo el documento",
        "Utilisez // pour chercher dans tout le document",
        "Mit // im gesamten Dokument suchen",
        "文書全体を検索するには//を使います",
        "使用 // 搜索文档任意位置",
        "استخدم // للبحث في أي موضع بالمستند"
    ],
    "[@attr='value'] filters by attribute": [
        "[@attr='value'] एट्रिब्यूट से फ़िल्टर करता है",
        "[@attr='value'] filtra por atributo",
        "[@attr='value'] filtre par attribut",
        "[@attr='value'] filtert nach Attribut",
        "[@attr='value']は属性で絞り込みます",
        "[@attr='value'] 按属性筛选",
        "يرشح [@attr='value'] حسب السمة"
    ],
    "text() returns element text content": [
        "text() तत्व का टेक्स्ट लौटाता है",
        "text() devuelve el texto del elemento",
        "text() renvoie le texte de l’élément",
        "text() liefert den Elementtext",
        "text()は要素のテキストを返します",
        "text() 返回元素的文本内容",
        "يعيد text() محتوى نص العنصر"
    ],
    "position() and last() work with node positions": [
        "position() और last() नोड की स्थिति पर काम करते हैं",
        "position() y last() usan posiciones de nodos",
        "position() et last() utilisent les positions des nœuds",
        "position() und last() arbeiten mit Knotenpositionen",
        "position()とlast()はノード位置に使います",
        "position() 和 last() 用于节点位置",
        "يعمل position() وlast() مع مواضع العقد"
    ],
    "Building XSLT transformations": [
        "XSLT रूपांतरण बनाना",
        "Crear transformaciones XSLT",
        "Créer des transformations XSLT",
        "XSLT-Transformationen erstellen",
        "XSLT変換の作成",
        "构建 XSLT 转换",
        "إنشاء تحويلات XSLT"
    ],
    "Extracting data from XML feeds": [
        "XML फ़ीड से डेटा निकालना",
        "Extraer datos de fuentes XML",
        "Extraire les données de flux XML",
        "Daten aus XML-Feeds extrahieren",
        "XMLフィードからのデータ抽出",
        "从 XML 订阅源提取数据",
        "استخراج البيانات من خلاصات XML"
    ],
    "Web scraping with XML documents": [
        "XML दस्तावेज़ से वेब डेटा निकालना",
        "Extraer datos web de documentos XML",
        "Extraire des données web de documents XML",
        "Web-Scraping mit XML-Dokumenten",
        "XML文書を使ったWebスクレイピング",
        "使用 XML 文档提取网页数据",
        "استخراج بيانات الويب باستخدام XML"
    ],
    "Testing XML parsing logic": [
        "XML पार्सिंग तर्क जाँचना",
        "Probar la lógica de análisis XML",
        "Tester la logique d’analyse XML",
        "XML-Parsinglogik testen",
        "XML解析ロジックのテスト",
        "测试 XML 解析逻辑",
        "اختبار منطق تحليل XML"
    ],
    "XPath Expression": [
        "XPath अभिव्यक्ति",
        "Expresión XPath",
        "Expression XPath",
        "XPath-Ausdruck",
        "XPath式",
        "XPath 表达式",
        "تعبير XPath"
    ],
    "Enter XPath expression...": [
        "XPath अभिव्यक्ति लिखें...",
        "Introduce una expresión XPath...",
        "Saisissez une expression XPath…",
        "XPath-Ausdruck eingeben…",
        "XPath式を入力…",
        "输入 XPath 表达式…",
        "أدخل تعبير XPath…"
    ],
    "XPath expression": [
        "XPath अभिव्यक्ति",
        "Expresión XPath",
        "Expression XPath",
        "XPath-Ausdruck",
        "XPath式",
        "XPath 表达式",
        "تعبير XPath"
    ],
    "Matches ({count})": [
        "मिलान ({count})",
        "Coincidencias ({count})",
        "Correspondances ({count})",
        "Treffer ({count})",
        "一致（{count}）",
        "匹配（{count}）",
        "المطابقات ({count})"
    ],
    "XPath evaluation failed": [
        "XPath मूल्यांकन विफल",
        "Error al evaluar XPath",
        "Échec de l’évaluation XPath",
        "XPath-Auswertung fehlgeschlagen",
        "XPathの評価に失敗",
        "XPath 求值失败",
        "فشل تقييم XPath"
    ],
    "No matches found": [
        "कोई मिलान नहीं मिला",
        "No se encontraron coincidencias",
        "Aucune correspondance trouvée",
        "Keine Treffer gefunden",
        "一致がありません",
        "未找到匹配项",
        "لم يتم العثور على مطابقات"
    ],
    "Type": [
        "प्रकार",
        "Tipo",
        "Type",
        "Typ",
        "型",
        "类型",
        "النوع"
    ],
    "XPath Examples": [
        "XPath उदाहरण",
        "Ejemplos XPath",
        "Exemples XPath",
        "XPath-Beispiele",
        "XPathの例",
        "XPath 示例",
        "أمثلة XPath"
    ],
    "XPath Syntax": [
        "XPath सिंटैक्स",
        "Sintaxis XPath",
        "Syntaxe XPath",
        "XPath-Syntax",
        "XPath構文",
        "XPath 语法",
        "صياغة XPath"
    ],
    "Root node": [
        "मूल नोड",
        "Nodo raíz",
        "Nœud racine",
        "Wurzelknoten",
        "ルートノード",
        "根节点",
        "عقدة الجذر"
    ],
    "Any descendant": [
        "कोई वंशज",
        "Cualquier descendiente",
        "Tout descendant",
        "Beliebiger Nachfahre",
        "任意の子孫",
        "任意后代",
        "أي عقدة تابعة"
    ],
    "Current node": [
        "वर्तमान नोड",
        "Nodo actual",
        "Nœud actuel",
        "Aktueller Knoten",
        "現在のノード",
        "当前节点",
        "العقدة الحالية"
    ],
    "Parent node": [
        "जनक नोड",
        "Nodo padre",
        "Nœud parent",
        "Elternknoten",
        "親ノード",
        "父节点",
        "العقدة الأم"
    ],
    "Attribute": [
        "एट्रिब्यूट",
        "Atributo",
        "Attribut",
        "Attribut",
        "属性",
        "属性",
        "سمة"
    ],
    "Any element": [
        "कोई तत्व",
        "Cualquier elemento",
        "Tout élément",
        "Beliebiges Element",
        "任意の要素",
        "任意元素",
        "أي عنصر"
    ],
    "Has attribute": [
        "एट्रिब्यूट मौजूद है",
        "Tiene atributo",
        "Possède l’attribut",
        "Attribut vorhanden",
        "属性がある",
        "具有属性",
        "توجد سمة"
    ],
    "nth element": [
        "nवाँ तत्व",
        "Elemento n",
        "Élément n",
        "n-tes Element",
        "n番目の要素",
        "第 n 个元素",
        "العنصر رقم n"
    ],
    "Text content": [
        "टेक्स्ट सामग्री",
        "Contenido de texto",
        "Contenu textuel",
        "Textinhalt",
        "テキスト内容",
        "文本内容",
        "محتوى النص"
    ],
    "Pattern copied!": [
        "पैटर्न कॉपी हुआ!",
        "¡Patrón copiado!",
        "Motif copié !",
        "Muster kopiert!",
        "パターンをコピーしました！",
        "模式已复制！",
        "تم نسخ النمط!"
    ],
    "All matches copied!": [
        "सभी मिलान कॉपी हुए!",
        "¡Todas las coincidencias copiadas!",
        "Toutes les correspondances copiées !",
        "Alle Treffer kopiert!",
        "すべての一致をコピーしました！",
        "已复制所有匹配项！",
        "تم نسخ جميع المطابقات!"
    ],
    "Test regular expressions with live matching": [
        "लाइव मिलान के साथ रेगुलर एक्सप्रेशन जाँचें",
        "Probar expresiones regulares con coincidencias en vivo",
        "Tester les expressions régulières en direct",
        "Reguläre Ausdrücke mit Live-Treffern testen",
        "一致を即座に確認して正規表現をテスト",
        "实时匹配测试正则表达式",
        "اختبار التعبيرات النمطية مع مطابقة مباشرة"
    ],
    "A Regex (Regular Expression) Tester helps you write and debug regular expressions by showing matches in real-time. Regex is a powerful pattern-matching language used for text search, validation, and transformation.": [
        "Regex (Regular Expression) टेस्टर मिलान तुरंत दिखाकर रेगुलर एक्सप्रेशन लिखने और डीबग करने में मदद करता है। Regex टेक्स्ट खोज, सत्यापन और रूपांतरण की पैटर्न-मिलान भाषा है।",
        "El probador Regex (Regular Expression) muestra coincidencias en tiempo real para escribir y depurar expresiones regulares. Regex permite buscar, validar y transformar texto con patrones.",
        "Le testeur Regex (Regular Expression) affiche les correspondances en direct pour écrire et déboguer les expressions régulières. Regex permet de rechercher, valider et transformer du texte avec des motifs.",
        "Der Regex-Tester zeigt Treffer in Echtzeit zum Schreiben und Prüfen regulärer Ausdrücke. Regex ist eine leistungsfähige Mustersprache zur Textsuche, Validierung und Umwandlung.",
        "Regex（正規表現）テスターは、一致をリアルタイムで表示し、正規表現の作成とデバッグを支援します。Regexは検索、検証、変換に使うパターン照合言語です。",
        "Regex（正则表达式）测试工具实时显示匹配结果，帮助编写和调试正则表达式。Regex 是用于文本搜索、验证和转换的强大模式匹配语言。",
        "يعرض مختبر Regex المطابقات فورًا للمساعدة في كتابة التعبيرات النمطية وتشخيصها. وهي لغة قوية لمطابقة الأنماط والبحث في النصوص والتحقق منها وتحويلها."
    ],
    "Regular expressions are essential for text processing but can be tricky to write correctly. This tool lets you test patterns instantly, see all matches, and catch errors before using regex in code.": [
        "रेगुलर एक्सप्रेशन टेक्स्ट प्रोसेसिंग में उपयोगी हैं लेकिन सही लिखना कठिन हो सकता है। यहाँ तुरंत पैटर्न, सभी मिलान और त्रुटियाँ देखकर कोड में लगाने से पहले जाँचें।",
        "Las expresiones regulares son esenciales, pero pueden ser difíciles de escribir. Prueba patrones al instante, revisa todas las coincidencias y detecta errores antes de usarlos en código.",
        "Les expressions régulières sont essentielles mais délicates à écrire. Testez les motifs, voyez toutes les correspondances et détectez les erreurs avant de les intégrer au code.",
        "Reguläre Ausdrücke sind wichtig, aber oft schwer korrekt zu schreiben. Hier lassen sich Muster sofort testen, alle Treffer ansehen und Fehler vor dem Einsatz erkennen.",
        "正規表現はテキスト処理に便利ですが、正しく書くのが難しいこともあります。パターンをすぐにテストし、すべての一致とエラーをコードで使う前に確認できます。",
        "正则表达式对文本处理很重要，但可能难以正确编写。此工具可即时测试模式、查看所有匹配结果，并在使用前发现错误。",
        "التعبيرات النمطية أساسية لمعالجة النصوص وقد يصعب كتابتها بشكل صحيح. اختبر الأنماط فورًا، واعرض كل المطابقات، واكتشف الأخطاء قبل استخدامها في الشفرة."
    ],
    "Enter your regular expression pattern": [
        "रेगुलर एक्सप्रेशन पैटर्न लिखें",
        "Introduce el patrón de expresión regular",
        "Saisissez le motif de l’expression régulière",
        "Muster des regulären Ausdrucks eingeben",
        "正規表現パターンを入力します",
        "输入正则表达式模式",
        "أدخل نمط التعبير النمطي"
    ],
    "Set flags: g (global), i (ignore case), m (multiline)": [
        "फ़्लैग सेट करें: g (वैश्विक), i (केस अनदेखा), m (बहु-पंक्ति)",
        "Configura indicadores: g (global), i (ignorar mayúsculas), m (multilínea)",
        "Définissez les indicateurs : g (global), i (ignorer la casse), m (multiligne)",
        "Flags setzen: g (global), i (Groß-/Kleinschreibung ignorieren), m (mehrzeilig)",
        "フラグを設定します: g（全体）、i（大文字小文字を区別しない）、m（複数行）",
        "设置标志：g（全局）、i（忽略大小写）、m（多行）",
        "حدد الرايات: g (شامل)، i (تجاهل حالة الأحرف)، m (متعدد الأسطر)"
    ],
    "Enter test text to match against": [
        "मिलान जाँचने वाला टेक्स्ट लिखें",
        "Introduce el texto de prueba",
        "Saisissez le texte à tester",
        "Zu prüfenden Text eingeben",
        "照合するテキストを入力します",
        "输入要匹配的测试文本",
        "أدخل النص المراد مطابقته"
    ],
    "See highlighted matches and captured groups": [
        "हाइलाइट किए मिलान और कैप्चर समूह देखें",
        "Revisa coincidencias resaltadas y grupos capturados",
        "Consultez les correspondances et groupes capturés",
        "Hervorgehobene Treffer und erfasste Gruppen ansehen",
        "強調された一致とキャプチャグループを確認します",
        "查看高亮匹配项和捕获组",
        "راجع المطابقات المميزة ومجموعات الالتقاط"
    ],
    "Use \\d for digits, \\w for word characters, \\s for whitespace": [
        "अंकों के लिए \\d, शब्द वर्णों के लिए \\w, खाली जगह के लिए \\s उपयोग करें",
        "Usa \\d para dígitos, \\w para caracteres de palabra y \\s para espacios",
        "Utilisez \\d pour les chiffres, \\w pour les caractères de mot et \\s pour les espaces",
        "\\d für Ziffern, \\w für Wortzeichen, \\s für Leerraum verwenden",
        "数字には\\d、単語構成文字には\\w、空白には\\sを使います",
        "\\d 表示数字，\\w 表示单词字符，\\s 表示空白",
        "استخدم \\d للأرقام و\\w لمحارف الكلمات و\\s للفراغات"
    ],
    "Escape special characters: . * + ? ^ $ { } [ ] \\ | ( )": [
        "विशेष वर्ण एस्केप करें: . * + ? ^ $ { } [ ] \\ | ( )",
        "Escapa los caracteres especiales: . * + ? ^ $ { } [ ] \\ | ( )",
        "Échappez les caractères spéciaux : . * + ? ^ $ { } [ ] \\ | ( )",
        "Sonderzeichen maskieren: . * + ? ^ $ { } [ ] \\ | ( )",
        "特殊文字をエスケープします: . * + ? ^ $ { } [ ] \\ | ( )",
        "转义特殊字符：. * + ? ^ $ { } [ ] \\ | ( )",
        "اهرب الأحرف الخاصة: . * + ? ^ $ { } [ ] \\ | ( )"
    ],
    "Use ? after quantifiers for non-greedy matching": [
        "गैर-लालची मिलान के लिए क्वांटिफ़ायर के बाद ? लगाएँ",
        "Usa ? tras los cuantificadores para coincidencias no voraces",
        "Ajoutez ? après les quantificateurs pour une recherche non gourmande",
        "? nach Quantifizierern für nicht gierige Suche verwenden",
        "最短一致には量指定子の後に?を付けます",
        "在量词后使用 ? 进行非贪婪匹配",
        "استخدم ? بعد محددات التكرار للمطابقة غير الجشعة"
    ],
    "Capture groups with () to extract specific parts": [
        "विशेष हिस्से निकालने के लिए () से समूह कैप्चर करें",
        "Captura grupos con () para extraer partes concretas",
        "Capturez des groupes avec () pour extraire des parties précises",
        "Mit () Gruppen für bestimmte Teile erfassen",
        "特定の部分を抽出するには()でグループを作ります",
        "使用 () 捕获组以提取特定部分",
        "التقط مجموعات باستخدام () لاستخراج أجزاء محددة"
    ],
    "Validating email addresses, phone numbers, URLs": [
        "ईमेल, फ़ोन नंबर और URL जाँचना",
        "Validar correos, teléfonos y URL",
        "Valider les e-mails, numéros de téléphone et URL",
        "E-Mail-Adressen, Telefonnummern und URLs prüfen",
        "メールアドレス、電話番号、URLの検証",
        "验证邮箱地址、电话号码和 URL",
        "التحقق من البريد وأرقام الهاتف وعناوين URL"
    ],
    "Extracting data from log files": [
        "लॉग फ़ाइलों से डेटा निकालना",
        "Extraer datos de registros",
        "Extraire des données des journaux",
        "Daten aus Protokolldateien extrahieren",
        "ログファイルからのデータ抽出",
        "从日志文件提取数据",
        "استخراج البيانات من ملفات السجل"
    ],
    "Search and replace in text editors": [
        "टेक्स्ट संपादकों में खोज और प्रतिस्थापन",
        "Buscar y reemplazar en editores de texto",
        "Rechercher et remplacer dans les éditeurs de texte",
        "Suchen und Ersetzen in Texteditoren",
        "テキストエディターでの検索と置換",
        "在文本编辑器中搜索和替换",
        "البحث والاستبدال في محررات النصوص"
    ],
    "Input validation in web forms": [
        "वेब फ़ॉर्म में इनपुट सत्यापन",
        "Validar entradas de formularios web",
        "Valider les saisies des formulaires web",
        "Eingaben in Webformularen prüfen",
        "Webフォームの入力検証",
        "验证网页表单输入",
        "التحقق من مدخلات نماذج الويب"
    ],
    "Regular Expression": [
        "रेगुलर एक्सप्रेशन",
        "Expresión regular",
        "Expression régulière",
        "Regulärer Ausdruck",
        "正規表現",
        "正则表达式",
        "تعبير نمطي"
    ],
    "Copy pattern": [
        "पैटर्न कॉपी करें",
        "Copiar patrón",
        "Copier le motif",
        "Muster kopieren",
        "パターンをコピー",
        "复制模式",
        "نسخ النمط"
    ],
    "Regular expression pattern": [
        "रेगुलर एक्सप्रेशन पैटर्न",
        "Patrón de expresión regular",
        "Motif de l’expression régulière",
        "Muster des regulären Ausdrucks",
        "正規表現パターン",
        "正则表达式模式",
        "نمط التعبير النمطي"
    ],
    "Regular expression flags": [
        "रेगुलर एक्सप्रेशन फ़्लैग",
        "Indicadores de expresión regular",
        "Indicateurs d’expression régulière",
        "Flags des regulären Ausdrucks",
        "正規表現フラグ",
        "正则表达式标志",
        "رايات التعبير النمطي"
    ],
    "Test String": [
        "परीक्षण टेक्स्ट",
        "Texto de prueba",
        "Texte de test",
        "Testtext",
        "テスト文字列",
        "测试字符串",
        "نص الاختبار"
    ],
    "Copy test string": [
        "परीक्षण टेक्स्ट कॉपी करें",
        "Copiar texto de prueba",
        "Copier le texte de test",
        "Testtext kopieren",
        "テスト文字列をコピー",
        "复制测试字符串",
        "نسخ نص الاختبار"
    ],
    "Test string copied!": [
        "परीक्षण टेक्स्ट कॉपी हुआ!",
        "¡Texto de prueba copiado!",
        "Texte de test copié !",
        "Testtext kopiert!",
        "テスト文字列をコピーしました！",
        "测试字符串已复制！",
        "تم نسخ نص الاختبار!"
    ],
    "Test string": [
        "परीक्षण टेक्स्ट",
        "Texto de prueba",
        "Texte de test",
        "Testtext",
        "テスト文字列",
        "测试字符串",
        "نص الاختبار"
    ],
    "Regular expression error": [
        "रेगुलर एक्सप्रेशन त्रुटि",
        "Error de expresión regular",
        "Erreur d’expression régulière",
        "Fehler im regulären Ausdruck",
        "正規表現エラー",
        "正则表达式错误",
        "خطأ في التعبير النمطي"
    ],
    "Copy all matches": [
        "सभी मिलान कॉपी करें",
        "Copiar todas las coincidencias",
        "Copier toutes les correspondances",
        "Alle Treffer kopieren",
        "すべての一致をコピー",
        "复制所有匹配项",
        "نسخ جميع المطابقات"
    ],
    "Copy All": [
        "सभी कॉपी करें",
        "Copiar todo",
        "Tout copier",
        "Alles kopieren",
        "すべてコピー",
        "全部复制",
        "نسخ الكل"
    ],
    "Match {number}": [
        "मिलान {number}",
        "Coincidencia {number}",
        "Correspondance {number}",
        "Treffer {number}",
        "一致 {number}",
        "匹配 {number}",
        "المطابقة {number}"
    ],
    "Index: {index}": [
        "इंडेक्स: {index}",
        "Índice: {index}",
        "Indice : {index}",
        "Index: {index}",
        "インデックス: {index}",
        "索引：{index}",
        "الفهرس: {index}"
    ],
    "Copy match": [
        "मिलान कॉपी करें",
        "Copiar coincidencia",
        "Copier la correspondance",
        "Treffer kopieren",
        "一致をコピー",
        "复制匹配项",
        "نسخ المطابقة"
    ],
    "Group {number} copied!": [
        "समूह {number} कॉपी हुआ!",
        "¡Grupo {number} copiado!",
        "Groupe {number} copié !",
        "Gruppe {number} kopiert!",
        "グループ{number}をコピーしました！",
        "已复制组 {number}！",
        "تم نسخ المجموعة {number}!"
    ],
    "Number": [
        "संख्या",
        "Número",
        "Nombre",
        "Zahl",
        "数値",
        "数字",
        "عدد"
    ],
    "String": [
        "स्ट्रिंग",
        "Cadena",
        "Chaîne",
        "Zeichenfolge",
        "文字列",
        "字符串",
        "سلسلة"
    ],
    "Boolean": [
        "बूलियन",
        "Booleano",
        "Booléen",
        "Boolesch",
        "真偽値",
        "布尔值",
        "منطقي"
    ],
    "Element": [
        "तत्व",
        "Elemento",
        "Élément",
        "Element",
        "要素",
        "元素",
        "عنصر"
    ],
    "Node": [
        "नोड",
        "Nodo",
        "Nœud",
        "Knoten",
        "ノード",
        "节点",
        "عقدة"
    ],
    "Group {number}:": [
        "समूह {number}:",
        "Grupo {number}:",
        "Groupe {number} :",
        "Gruppe {number}:",
        "グループ{number}:",
        "组 {number}：",
        "المجموعة {number}:"
    ],

    "Inspect XSD declarations and run limited XML well-formedness, root-name and namespace checks": [
        "XSD घोषणाएं देखें और XML के सही गठन, मूल नाम व नेमस्पेस की सीमित जांच करें",
        "Inspecciona declaraciones XSD y realiza comprobaciones limitadas de XML bien formado, nombre raíz y espacio de nombres",
        "Inspectez les déclarations XSD et vérifiez uniquement la bonne formation XML, le nom racine et l’espace de noms",
        "XSD-Deklarationen prüfen und begrenzte XML-Wohlgeformtheits-, Wurzelname- und Namensraumprüfungen ausführen",
        "XSD宣言を確認し、XML整形式性・ルート名・名前空間の限定チェックを実行",
        "检查 XSD 声明，并对 XML 格式、根名称及命名空间执行有限检查",
        "افحص تصريحات XSD وأجرِ فحوصًا محدودة لصحة بنية XML واسم الجذر ونطاق الأسماء"
    ],
    "This browser tool inspects XSD declarations and checks XML well-formedness, the declared root element name and the root namespace. It does not validate child content, datatypes, cardinality or required attributes.": [
        "यह ब्राउज़र टूल XSD घोषणाएं देखता है और XML का सही गठन, घोषित मूल तत्व का नाम तथा मूल नेमस्पेस जांचता है। यह संतान सामग्री, डेटा प्रकार, तत्वों की संख्या या आवश्यक एट्रिब्यूट सत्यापित नहीं करता।",
        "Esta herramienta inspecciona declaraciones XSD y comprueba XML bien formado, nombre del elemento raíz declarado y espacio de nombres raíz. No valida contenido hijo, tipos de datos, cardinalidad ni atributos obligatorios.",
        "Cet outil inspecte les déclarations XSD et vérifie la bonne formation XML, le nom de l’élément racine déclaré et son espace de noms. Il ne valide pas le contenu enfant, les types, la cardinalité ni les attributs requis.",
        "Dieses Browserwerkzeug prüft XSD-Deklarationen sowie XML-Wohlgeformtheit, deklarierten Wurzelelementnamen und Wurzelnamensraum. Kindinhalte, Datentypen, Kardinalität und Pflichtattribute werden nicht validiert.",
        "このブラウザーツールはXSD宣言を確認し、XML整形式性・宣言済みルート要素名・ルート名前空間を検査します。子の内容、データ型、出現数、必須属性は検証しません。",
        "此浏览器工具检查 XSD 声明及 XML 格式、已声明根元素名称和根命名空间。不验证子内容、数据类型、出现次数或必需属性。",
        "تفحص هذه الأداة تصريحات XSD وصحة بنية XML واسم عنصر الجذر المصرح ونطاق أسمائه. ولا تتحقق من المحتوى الفرعي أو أنواع البيانات أو عدد مرات الظهور أو السمات المطلوبة."
    ],
    "Inspect declared types and elements and catch basic XML/root mismatches before using a full XSD validator such as Xerces or libxml2.": [
        "Xerces या libxml2 जैसे पूर्ण XSD सत्यापक से पहले घोषित प्रकार व तत्व देखें और XML/मूल की बुनियादी असंगतियां पकड़ें।",
        "Inspecciona tipos y elementos declarados y detecta discrepancias básicas XML/raíz antes de usar un validador XSD completo como Xerces o libxml2.",
        "Inspectez types et éléments déclarés et repérez les écarts XML/racine élémentaires avant d’utiliser un validateur XSD complet comme Xerces ou libxml2.",
        "Deklarierte Typen und Elemente prüfen und grundlegende XML-/Wurzelabweichungen erkennen, bevor ein vollständiger XSD-Validator wie Xerces oder libxml2 eingesetzt wird.",
        "Xercesやlibxml2などの完全なXSD検証器を使う前に、宣言済みの型・要素と基本的なXML・ルートの不一致を確認します。",
        "使用 Xerces 或 libxml2 等完整 XSD 验证器前，查看已声明类型和元素，找出基本 XML／根不匹配。",
        "افحص الأنواع والعناصر المصرح بها واكتشف اختلافات XML والجذر الأساسية قبل استخدام مدقق XSD كامل مثل Xerces أو libxml2."
    ],
    "Run the limited XML and root checks; use a full XSD validator to establish schema conformance.": [
        "XML और मूल की सीमित जांच चलाएं; स्कीमा अनुरूपता स्थापित करने के लिए पूर्ण XSD सत्यापक प्रयोग करें।",
        "Ejecuta las comprobaciones limitadas XML y raíz; usa un validador XSD completo para establecer conformidad con el esquema.",
        "Exécutez les vérifications limitées XML et racine ; utilisez un validateur XSD complet pour établir la conformité au schéma.",
        "Begrenzte XML- und Wurzelprüfungen ausführen; Schemakonformität mit einem vollständigen XSD-Validator feststellen.",
        "限定的なXML・ルートチェックを実行し、スキーマ適合性の確認には完全なXSD検証器を使用します。",
        "执行有限 XML 和根检查；使用完整 XSD 验证器确定 schema 合规性。",
        "شغّل فحوص XML والجذر المحدودة؛ واستخدم مدقق XSD كاملًا لإثبات التوافق مع المخطط."
    ],
    "Review basic-check results; child content, datatypes, cardinality and required attributes are not validated.": [
        "बुनियादी जांच परिणाम देखें; संतान सामग्री, डेटा प्रकार, तत्वों की संख्या और आवश्यक एट्रिब्यूट सत्यापित नहीं किए जाते।",
        "Revisa los resultados básicos; no se validan contenido hijo, tipos de datos, cardinalidad ni atributos obligatorios.",
        "Examinez les résultats élémentaires ; contenu enfant, types, cardinalité et attributs requis ne sont pas validés.",
        "Ergebnisse der Grundprüfungen ansehen; Kindinhalte, Datentypen, Kardinalität und Pflichtattribute werden nicht validiert.",
        "基本チェック結果を確認してください。子の内容、データ型、出現数、必須属性は検証対象外です。",
        "查看基本检查结果；不验证子内容、数据类型、出现次数及必需属性。",
        "راجع نتائج الفحوص الأساسية؛ لا يُتحقق من المحتوى الفرعي أو أنواع البيانات أو عدد مرات الظهور أو السمات المطلوبة."
    ],
    "Inspecting declarations from SOAP and enterprise schemas": [
        "SOAP और एंटरप्राइज़ स्कीमा की घोषणाएं देखना",
        "Inspeccionar declaraciones de esquemas SOAP y empresariales",
        "Inspection de déclarations de schémas SOAP et d’entreprise",
        "Deklarationen aus SOAP- und Unternehmensschemata prüfen",
        "SOAP・企業スキーマの宣言確認",
        "查看 SOAP 和企业 schema 声明",
        "فحص تصريحات مخططات SOAP والمؤسسات"
    ],
    "Checking XML well-formedness and root declarations before full validation": [
        "पूर्ण सत्यापन से पहले XML का सही गठन और मूल घोषणाएं जांचना",
        "Comprobar XML bien formado y declaraciones raíz antes de validar por completo",
        "Vérification de la bonne formation XML et des déclarations racines avant validation complète",
        "XML-Wohlgeformtheit und Wurzeldeklarationen vor vollständiger Validierung prüfen",
        "完全検証前のXML整形式性・ルート宣言確認",
        "完整验证前检查 XML 格式及根声明",
        "فحص صحة بنية XML وتصريحات الجذر قبل التحقق الكامل"
    ],
    "Reviewing target namespaces and declared schema types": [
        "लक्षित नेमस्पेस और घोषित स्कीमा प्रकार देखना",
        "Revisar espacios de nombres destino y tipos declarados",
        "Examen des espaces de noms cibles et types déclarés",
        "Zielnamensräume und deklarierte Schematypen prüfen",
        "対象名前空間・宣言済みスキーマ型の確認",
        "查看目标命名空间及已声明 schema 类型",
        "مراجعة نطاقات الأسماء المستهدفة وأنواع المخطط المصرح بها"
    ],
    "Investigating root-name or namespace mismatches": [
        "मूल नाम या नेमस्पेस असंगतियों की जांच",
        "Investigar discrepancias de nombre raíz o espacio de nombres",
        "Analyse des écarts de nom racine ou d’espace de noms",
        "Abweichungen bei Wurzelnamen oder Namensräumen untersuchen",
        "ルート名・名前空間の不一致調査",
        "调查根名称或命名空间不匹配",
        "التحقيق في اختلاف اسم الجذر أو نطاق الأسماء"
    ],
    "Supported checks found no errors; full XSD conformance was not tested.": [
        "समर्थित जांच में त्रुटि नहीं मिली; पूर्ण XSD अनुरूपता नहीं जांची गई।",
        "Las comprobaciones admitidas no encontraron errores; no se probó la conformidad XSD completa.",
        "Les vérifications prises en charge n’ont trouvé aucune erreur ; la conformité XSD complète n’a pas été testée.",
        "Die unterstützten Prüfungen fanden keine Fehler; vollständige XSD-Konformität wurde nicht geprüft.",
        "対応するチェックでエラーは見つかりませんでした。完全なXSD適合性は未検証です。",
        "支持的检查未发现错误；未测试完整 XSD 合规性。",
        "لم تجد الفحوص المدعومة أخطاء؛ لم يُختبر التوافق الكامل مع XSD."
    ],
    "Basic checks found {count} error(s)": [
        "बुनियादी जांच में {count} त्रुटि मिलीं",
        "Las comprobaciones básicas encontraron {count} error(es)",
        "Les vérifications élémentaires ont trouvé {count} erreur(s)",
        "Grundprüfungen fanden {count} Fehler",
        "基本チェックで{count}件のエラー",
        "基本检查发现 {count} 个错误",
        "وجدت الفحوص الأساسية {count} أخطاء"
    ],
    "Run basic checks": [
        "बुनियादी जांच चलाएं",
        "Ejecutar comprobaciones básicas",
        "Exécuter les vérifications élémentaires",
        "Grundprüfungen ausführen",
        "基本チェックを実行",
        "运行基本检查",
        "شغّل الفحوص الأساسية"
    ],
    "No root/XML errors": [
        "मूल/XML त्रुटि नहीं",
        "Sin errores raíz/XML",
        "Aucune erreur racine/XML",
        "Keine Wurzel-/XML-Fehler",
        "ルート・XMLエラーなし",
        "无根／XML 错误",
        "لا أخطاء في الجذر أو XML"
    ],
    "Root/XML errors": [
        "मूल/XML त्रुटियां",
        "Errores raíz/XML",
        "Erreurs racine/XML",
        "Wurzel-/XML-Fehler",
        "ルート・XMLエラー",
        "根／XML 错误",
        "أخطاء الجذر أو XML"
    ],
    "Load baseline XML example": [
        "आधार XML उदाहरण लोड करें",
        "Cargar ejemplo XML base",
        "Charger l’exemple XML de référence",
        "XML-Basisbeispiel laden",
        "基準XML例を読み込む",
        "加载基准 XML 示例",
        "حمّل مثال XML الأساسي"
    ],
    "Load datatype-error XML example": [
        "डेटा-प्रकार त्रुटि वाला XML उदाहरण लोड करें",
        "Cargar ejemplo XML con errores de tipo",
        "Charger l’exemple XML avec erreurs de types",
        "XML-Beispiel mit Datentypfehlern laden",
        "データ型エラーのXML例を読み込む",
        "加载含数据类型错误的 XML 示例",
        "حمّل مثال XML بأخطاء أنواع البيانات"
    ],
    "Baseline sample": [
        "आधार उदाहरण",
        "Ejemplo base",
        "Exemple de référence",
        "Basisbeispiel",
        "基準サンプル",
        "基准示例",
        "مثال أساسي"
    ],
    "Datatype-error sample": [
        "डेटा-प्रकार त्रुटि उदाहरण",
        "Ejemplo con errores de tipo",
        "Exemple avec erreurs de types",
        "Datentypfehler-Beispiel",
        "データ型エラーのサンプル",
        "数据类型错误示例",
        "مثال أخطاء أنواع البيانات"
    ],
    "Limited check results": [
        "सीमित जांच परिणाम",
        "Resultados de comprobaciones limitadas",
        "Résultats des vérifications limitées",
        "Ergebnisse begrenzter Prüfungen",
        "限定チェック結果",
        "有限检查结果",
        "نتائج الفحوص المحدودة"
    ],
    "No errors in supported checks": [
        "समर्थित जांच में त्रुटि नहीं",
        "Sin errores en comprobaciones admitidas",
        "Aucune erreur dans les vérifications prises en charge",
        "Keine Fehler in unterstützten Prüfungen",
        "対応チェックでエラーなし",
        "支持的检查无错误",
        "لا أخطاء في الفحوص المدعومة"
    ],
    "This result does not establish XSD conformance.": [
        "यह परिणाम XSD अनुरूपता स्थापित नहीं करता।",
        "Este resultado no establece conformidad XSD.",
        "Ce résultat n’établit pas la conformité XSD.",
        "Dieses Ergebnis stellt keine XSD-Konformität fest.",
        "この結果はXSD適合性を示すものではありません。",
        "此结果并不证明 XSD 合规性。",
        "لا تثبت هذه النتيجة التوافق مع XSD."
    ],
    "Only XML well-formedness, declared root name and root namespace are checked. Child content, datatypes, cardinality and required attributes require a full XSD validator such as Xerces or libxml2.": [
        "केवल XML का सही गठन, घोषित मूल नाम और मूल नेमस्पेस जांचे जाते हैं। संतान सामग्री, डेटा प्रकार, तत्वों की संख्या व आवश्यक एट्रिब्यूट के लिए Xerces या libxml2 जैसा पूर्ण XSD सत्यापक चाहिए।",
        "Solo se comprueban XML bien formado, nombre raíz declarado y espacio de nombres raíz. Contenido hijo, tipos, cardinalidad y atributos obligatorios requieren un validador XSD completo como Xerces o libxml2.",
        "Seuls la bonne formation XML, le nom racine déclaré et son espace de noms sont vérifiés. Contenu enfant, types, cardinalité et attributs requis nécessitent un validateur XSD complet comme Xerces ou libxml2.",
        "Nur XML-Wohlgeformtheit, deklarierter Wurzelname und Wurzelnamensraum werden geprüft. Kindinhalte, Datentypen, Kardinalität und Pflichtattribute erfordern einen vollständigen XSD-Validator wie Xerces oder libxml2.",
        "検査対象はXML整形式性、宣言済みルート名、ルート名前空間のみです。子の内容、データ型、出現数、必須属性にはXercesやlibxml2などの完全なXSD検証器が必要です。",
        "仅检查 XML 格式、已声明根名称及根命名空间。子内容、数据类型、出现次数及必需属性需要 Xerces 或 libxml2 等完整 XSD 验证器。",
        "تُفحص صحة بنية XML واسم الجذر المصرح ونطاق أسمائه فقط. يتطلب المحتوى الفرعي وأنواع البيانات وعدد مرات الظهور والسمات المطلوبة مدقق XSD كاملًا مثل Xerces أو libxml2."
    ],
    "Does this tool perform full XSD validation?": [
        "क्या यह टूल पूर्ण XSD सत्यापन करता है?",
        "¿Realiza esta herramienta una validación XSD completa?",
        "Cet outil effectue-t-il une validation XSD complète ?",
        "Führt dieses Werkzeug eine vollständige XSD-Validierung durch?",
        "完全なXSD検証を行いますか？",
        "此工具执行完整 XSD 验证吗？",
        "هل تجري هذه الأداة تحقق XSD كاملًا؟"
    ],
    "No. It inspects XSD declarations and checks XML well-formedness, the declared root name and the root namespace. Child content, datatypes, cardinality and required attributes are not validated. Use a full XSD validator such as Xerces or libxml2 to establish schema conformance.": [
        "नहीं। यह XSD घोषणाएं और XML का सही गठन, घोषित मूल नाम व नेमस्पेस जांचता है। संतान सामग्री, डेटा प्रकार, तत्वों की संख्या व आवश्यक एट्रिब्यूट सत्यापित नहीं होते। स्कीमा अनुरूपता के लिए Xerces या libxml2 जैसा पूर्ण XSD सत्यापक प्रयोग करें।",
        "No. Inspecciona declaraciones XSD y comprueba XML bien formado, nombre raíz declarado y espacio de nombres raíz. No valida contenido hijo, tipos, cardinalidad ni atributos obligatorios. Usa Xerces o libxml2 para establecer conformidad completa.",
        "Non. Il inspecte les déclarations XSD et vérifie la bonne formation XML, le nom racine déclaré et son espace de noms. Contenu enfant, types, cardinalité et attributs requis ne sont pas validés. Utilisez Xerces ou libxml2 pour établir la conformité complète.",
        "Nein. Es prüft XSD-Deklarationen, XML-Wohlgeformtheit, deklarierten Wurzelnamen und Wurzelnamensraum. Kindinhalte, Datentypen, Kardinalität und Pflichtattribute werden nicht validiert. Zur Schemakonformität einen vollständigen Validator wie Xerces oder libxml2 nutzen.",
        "いいえ。XSD宣言、XML整形式性、宣言済みルート名と名前空間を検査します。子の内容、データ型、出現数、必須属性は検証しません。適合性確認にはXercesやlibxml2などの完全な検証器を使用してください。",
        "不执行。它查看 XSD 声明并检查 XML 格式、已声明根名称及根命名空间，不验证子内容、数据类型、出现次数或必需属性。请使用 Xerces 或 libxml2 等完整 XSD 验证器确定 schema 合规性。",
        "لا. تفحص تصريحات XSD وصحة بنية XML واسم الجذر المصرح ونطاق أسمائه، ولا تتحقق من المحتوى الفرعي أو أنواع البيانات أو عدد مرات الظهور أو السمات المطلوبة. استخدم مدققًا كاملًا مثل Xerces أو libxml2 لإثبات التوافق مع المخطط."
    ],
    "Why can the datatype-error example pass the basic checks?": [
        "डेटा-प्रकार त्रुटि वाला उदाहरण बुनियादी जांच क्यों पास कर सकता है?",
        "¿Por qué puede pasar el ejemplo con errores de tipo las comprobaciones básicas?",
        "Pourquoi l’exemple avec erreurs de types peut-il passer les vérifications élémentaires ?",
        "Warum kann das Datentypfehler-Beispiel die Grundprüfungen bestehen?",
        "データ型エラーの例が基本チェックに通るのはなぜですか？",
        "为何数据类型错误示例可以通过基本检查？",
        "لماذا قد يجتاز مثال أخطاء الأنواع الفحوص الأساسية؟"
    ],
    "The example keeps the expected root name and namespace. Its invalid field values and missing child content are outside these basic checks, so a result with no root/XML errors does not mean the XML conforms to the XSD.": [
        "उदाहरण अपेक्षित मूल नाम और नेमस्पेस रखता है। गलत फ़ील्ड मान और छूटी संतान सामग्री इन बुनियादी जांचों के बाहर हैं, इसलिए मूल/XML त्रुटि न मिलना XML की XSD अनुरूपता नहीं दर्शाता।",
        "El ejemplo conserva el nombre raíz y espacio de nombres esperados. Los valores inválidos y contenido hijo ausente quedan fuera de estas comprobaciones; no encontrar errores raíz/XML no implica conformidad XSD.",
        "L’exemple conserve le nom racine et l’espace de noms attendus. Ses valeurs invalides et contenus enfants manquants sont hors de ces vérifications ; aucune erreur racine/XML ne signifie pas conformité XSD.",
        "Das Beispiel behält erwarteten Wurzelnamen und Namensraum. Ungültige Feldwerte und fehlende Kindinhalte liegen außerhalb der Grundprüfungen; keine Wurzel-/XML-Fehler bedeuten daher keine XSD-Konformität.",
        "例は想定どおりのルート名・名前空間を保っています。不正な値や不足する子の内容は対象外なので、ルート・XMLエラーなしでもXSD適合とは限りません。",
        "示例保留了预期根名称及命名空间。无效字段值和缺失子内容不在基本检查范围内，因此没有根／XML 错误并不意味着 XML 符合 XSD。",
        "يحتفظ المثال باسم الجذر ونطاق الأسماء المتوقعين. قيم الحقول غير الصحيحة والمحتوى الفرعي المفقود خارج هذه الفحوص؛ لذا لا يعني غياب أخطاء الجذر وXML توافق المستند مع XSD."
    ]
,

    "Namespace mismatch. Expected: {expected}, Found: {found}": [
        "नेमस्पेस मेल नहीं खाता। अपेक्षित: {expected}, मिला: {found}",
        "Espacio de nombres distinto. Esperado: {expected}, encontrado: {found}",
        "Espace de noms différent. Attendu : {expected}, trouvé : {found}",
        "Namensraumabweichung. Erwartet: {expected}, gefunden: {found}",
        "名前空間が不一致です。想定：{expected}、実際：{found}",
        "命名空间不匹配。预期：{expected}，实际：{found}",
        "اختلاف نطاق الأسماء. المتوقع: {expected}، الموجود: {found}"
    ],
    "Unknown root element: \"{name}\". Expected one of: {expected}": [
        "अज्ञात मूल तत्व: \"{name}\"। इनमें से अपेक्षित: {expected}",
        "Elemento raíz desconocido: \"{name}\". Se esperaba uno de: {expected}",
        "Élément racine inconnu : « {name} ». Éléments attendus : {expected}",
        "Unbekanntes Wurzelelement: „{name}“. Erwartet eines von: {expected}",
        "不明なルート要素：\"{name}\"。想定される要素：{expected}",
        "未知根元素：\"{name}\"。预期为以下之一：{expected}",
        "عنصر جذر غير معروف: \"{name}\". المتوقع أحد: {expected}"
    ],
    "Note: This is structural validation only. For complete XSD validation including type checking and constraints, use a dedicated XML validator.": [
        "नोट: यह केवल संरचनात्मक जांच है। प्रकार व सीमाओं सहित पूर्ण XSD सत्यापन के लिए समर्पित XML सत्यापक प्रयोग करें।",
        "Nota: solo se comprueba estructura. Para validar XSD completo, incluidos tipos y restricciones, usa un validador XML dedicado.",
        "Remarque : vérification structurelle uniquement. Pour une validation XSD complète incluant types et contraintes, utilisez un validateur XML dédié.",
        "Hinweis: nur Strukturprüfung. Für vollständige XSD-Validierung einschließlich Typen und Bedingungen einen spezialisierten XML-Validator verwenden.",
        "注：構造チェックのみです。型・制約を含む完全なXSD検証には専用XML検証器を使用してください。",
        "注意：仅作结构检查。完整 XSD 验证（含类型及约束）需使用专用 XML 验证器。",
        "ملاحظة: هذا فحص بنيوي فقط. للتحقق الكامل من XSD بما فيه الأنواع والقيود، استخدم مدقق XML مخصصًا."
    ]

};
