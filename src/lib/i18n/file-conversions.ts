// Columns: hi, es, fr, de, ja, zh, ar. Source keys are English.
export const FILE_CONVERSION_TRANSLATIONS: Record<string, readonly string[]> = {
    "Excel XLSX conversion": [
        "Excel XLSX रूपांतरण",
        "Conversión Excel XLSX",
        "Conversion Excel XLSX",
        "Excel-XLSX-Konvertierung",
        "Excel XLSX変換",
        "Excel XLSX 转换",
        "تحويل Excel XLSX"
    ],
    "Read sheets locally or create an XLSX workbook from JSON. Supports up to 8 MiB compressed, 32 MiB expanded, 30 sheets and 100,000 cells. Formulas are never executed.": [
        "शीट स्थानीय रूप से पढ़ें या JSON से XLSX कार्यपुस्तिका बनाएँ। अधिकतम 8 MiB संपीड़ित, 32 MiB विस्तृत, 30 शीट और 100,000 सेल। फ़ॉर्मूले कभी नहीं चलाए जाते।",
        "Lee hojas localmente o crea un libro XLSX desde JSON. Admite hasta 8 MiB comprimidos, 32 MiB expandidos, 30 hojas y 100.000 celdas. Las fórmulas nunca se ejecutan.",
        "Lisez des feuilles localement ou créez un classeur XLSX depuis du JSON. Limites : 8 MiB compressés, 32 MiB décompressés, 30 feuilles et 100 000 cellules. Les formules ne sont jamais exécutées.",
        "Lies Tabellen lokal oder erstelle eine XLSX-Datei aus JSON. Grenzen: 8 MiB komprimiert, 32 MiB entpackt, 30 Blätter und 100.000 Zellen. Formeln werden nie ausgeführt.",
        "シートをローカルで読み取るか、JSONからXLSXブックを作成します。上限は圧縮8 MiB、展開32 MiB、30シート、100,000セルです。数式は実行しません。",
        "在本地读取工作表或从 JSON 创建 XLSX 工作簿。上限为压缩后 8 MiB、展开后 32 MiB、30 张表和 100,000 个单元格。绝不执行公式。",
        "اقرأ الأوراق محليًا أو أنشئ مصنف XLSX من JSON. الحدود: 8 MiB مضغوطة، و32 MiB بعد الفك، و30 ورقة و100,000 خلية. لا تُنفّذ الصيغ مطلقًا."
    ],
    "Open XLSX workbook": [
        "XLSX कार्यपुस्तिका खोलें",
        "Abrir libro XLSX",
        "Ouvrir un classeur XLSX",
        "XLSX-Arbeitsmappe öffnen",
        "XLSXブックを開く",
        "打开 XLSX 工作簿",
        "فتح مصنف XLSX"
    ],
    "Worksheet": [
        "वर्कशीट",
        "Hoja de cálculo",
        "Feuille de calcul",
        "Arbeitsblatt",
        "ワークシート",
        "工作表",
        "ورقة العمل"
    ],
    "{name} · {rows} rows": [
        "{name} · {rows} पंक्तियाँ",
        "{name} · {rows} filas",
        "{name} · {rows} lignes",
        "{name} · {rows} Zeilen",
        "{name} · {rows}行",
        "{name} · {rows} 行",
        "{name} · {rows} صفوف"
    ],
    "Use the first row as object keys": [
        "पहली पंक्ति को ऑब्जेक्ट कुंजियाँ बनाएँ",
        "Usar la primera fila como claves de objeto",
        "Utiliser la première ligne comme clés d’objet",
        "Erste Zeile als Objektschlüssel verwenden",
        "先頭行をオブジェクトのキーに使用",
        "将首行用作对象键",
        "استخدام الصف الأول كمفاتيح للكائن"
    ],
    "Imported JSON": [
        "आयातित JSON",
        "JSON importado",
        "JSON importé",
        "Importiertes JSON",
        "インポートしたJSON",
        "已导入的 JSON",
        "JSON المستورد"
    ],
    "Copy sheet JSON": [
        "शीट JSON कॉपी करें",
        "Copiar JSON de la hoja",
        "Copier le JSON de la feuille",
        "Blatt-JSON kopieren",
        "シートのJSONをコピー",
        "复制工作表 JSON",
        "نسخ JSON الورقة"
    ],
    "Download sheet JSON": [
        "शीट JSON डाउनलोड करें",
        "Descargar JSON de la hoja",
        "Télécharger le JSON de la feuille",
        "Blatt-JSON herunterladen",
        "シートのJSONをダウンロード",
        "下载工作表 JSON",
        "تنزيل JSON الورقة"
    ],
    "Download sheet CSV": [
        "शीट CSV डाउनलोड करें",
        "Descargar CSV de la hoja",
        "Télécharger le CSV de la feuille",
        "Blatt-CSV herunterladen",
        "シートのCSVをダウンロード",
        "下载工作表 CSV",
        "تنزيل CSV الورقة"
    ],
    "Use JSON in converter": [
        "कनवर्टर में JSON उपयोग करें",
        "Usar JSON en el conversor",
        "Utiliser le JSON dans le convertisseur",
        "JSON im Konverter verwenden",
        "コンバーターでJSONを使用",
        "在转换器中使用 JSON",
        "استخدام JSON في المحوّل"
    ],
    "Create a workbook": [
        "कार्यपुस्तिका बनाएँ",
        "Crear un libro",
        "Créer un classeur",
        "Arbeitsmappe erstellen",
        "ブックを作成",
        "创建工作簿",
        "إنشاء مصنف"
    ],
    "Uses the JSON input from the converter above. Nested objects become JSON text cells.": [
        "ऊपर के कनवर्टर का JSON इनपुट उपयोग होता है। नेस्टेड ऑब्जेक्ट JSON टेक्स्ट सेल बनते हैं।",
        "Usa el JSON del conversor anterior. Los objetos anidados se convierten en celdas de texto JSON.",
        "Utilise le JSON du convertisseur ci-dessus. Les objets imbriqués deviennent des cellules de texte JSON.",
        "Verwendet die JSON-Eingabe des Konverters oben. Verschachtelte Objekte werden zu JSON-Textzellen.",
        "上のコンバーターのJSON入力を使用します。入れ子のオブジェクトはJSONテキストセルになります。",
        "使用上方转换器的 JSON 输入。嵌套对象成为 JSON 文本单元格。",
        "يستخدم إدخال JSON من المحوّل أعلاه. تصبح الكائنات المتداخلة خلايا نص JSON."
    ],
    "JSON rows": [
        "JSON पंक्तियाँ",
        "Filas JSON",
        "Lignes JSON",
        "JSON-Zeilen",
        "JSONの行",
        "JSON 行",
        "صفوف JSON"
    ],
    "Sheet name": [
        "शीट का नाम",
        "Nombre de hoja",
        "Nom de la feuille",
        "Blattname",
        "シート名",
        "工作表名称",
        "اسم الورقة"
    ],
    "Processing…": [
        "प्रोसेस हो रहा है…",
        "Procesando…",
        "Traitement…",
        "Verarbeitung…",
        "処理中…",
        "处理中…",
        "جارٍ المعالجة…"
    ],
    "Download XLSX": [
        "XLSX डाउनलोड करें",
        "Descargar XLSX",
        "Télécharger XLSX",
        "XLSX herunterladen",
        "XLSXをダウンロード",
        "下载 XLSX",
        "تنزيل XLSX"
    ],
    "Dates import as UTC ISO strings. Exports keep ISO strings as text. Formatted cells, merged layout, formulas and chart presentation do not round-trip. Text beginning with = is written as text.": [
        "तिथियाँ UTC ISO स्ट्रिंग के रूप में आयात होती हैं। निर्यात में ISO स्ट्रिंग टेक्स्ट रहती हैं। सेल फ़ॉर्मैट, मर्ज लेआउट, फ़ॉर्मूले और चार्ट प्रस्तुति वापस सुरक्षित नहीं होते। = से शुरू टेक्स्ट को टेक्स्ट ही लिखा जाता है।",
        "Las fechas se importan como cadenas ISO UTC y se exportan como texto. El formato, las celdas combinadas, las fórmulas y la presentación de gráficos no se conservan al reconvertir. El texto que empieza por = se escribe como texto.",
        "Les dates sont importées en chaînes ISO UTC et restent du texte à l’export. La mise en forme, les cellules fusionnées, les formules et la présentation des graphiques ne sont pas préservées à l’aller-retour. Un texte commençant par = reste du texte.",
        "Datumswerte werden als UTC-ISO-Zeichenfolgen importiert und als Text exportiert. Zellformatierung, verbundene Zellen, Formeln und Diagrammdarstellung bleiben beim Rückweg nicht erhalten. Text mit führendem = bleibt Text.",
        "日付はUTCのISO文字列として読み込み、出力時もテキストとして保持します。セル書式、結合レイアウト、数式、グラフの外観は往復変換で保持されません。=で始まるテキストも文字列として書き込みます。",
        "日期导入为 UTC ISO 字符串，导出时仍为文本。单元格格式、合并布局、公式和图表外观无法往返保留。以 = 开头的文本仍写作文本。",
        "تُستورد التواريخ كسلاسل ISO بتوقيت UTC وتبقى نصًا عند التصدير. لا يُحفظ تنسيق الخلايا ودمجها والصيغ وعرض المخططات في التحويل ذهابًا وإيابًا. يُكتب النص الذي يبدأ بـ = كنص."
    ],
    "File conversion diagnostic:": [
        "फ़ाइल रूपांतरण निदान:",
        "Diagnóstico de conversión de archivos:",
        "Diagnostic de conversion de fichier :",
        "Dateikonvertierungsdiagnose:",
        "ファイル変換の診断:",
        "文件转换诊断：",
        "تشخيص تحويل الملف:"
    ],
    "Images and binary files": [
        "चित्र और बाइनरी फ़ाइलें",
        "Imágenes y archivos binarios",
        "Images et fichiers binaires",
        "Bilder und Binärdateien",
        "画像とバイナリファイル",
        "图像和二进制文件",
        "الصور والملفات الثنائية"
    ],
    "File to encode (up to 8 MiB)": [
        "एन्कोड करने की फ़ाइल (8 MiB तक)",
        "Archivo a codificar (hasta 8 MiB)",
        "Fichier à encoder (8 MiB maximum)",
        "Zu kodierende Datei (bis 8 MiB)",
        "エンコードするファイル（最大8 MiB）",
        "待编码文件（最大 8 MiB）",
        "الملف المراد ترميزه (حتى 8 MiB)"
    ],
    "MIME type": [
        "MIME प्रकार",
        "Tipo MIME",
        "Type MIME",
        "MIME-Typ",
        "MIMEタイプ",
        "MIME 类型",
        "نوع MIME"
    ],
    "Decoded filename": [
        "डिकोड की फ़ाइल का नाम",
        "Nombre del archivo decodificado",
        "Nom du fichier décodé",
        "Name der dekodierten Datei",
        "デコード後のファイル名",
        "解码后的文件名",
        "اسم الملف بعد فك الترميز"
    ],
    "Include Data URI prefix": [
        "Data URI उपसर्ग जोड़ें",
        "Incluir prefijo Data URI",
        "Inclure le préfixe Data URI",
        "Data-URI-Präfix einschließen",
        "Data URI接頭辞を含める",
        "包含 Data URI 前缀",
        "تضمين بادئة Data URI"
    ],
    "Binary Base64 or Data URI": [
        "बाइनरी Base64 या Data URI",
        "Base64 binario o Data URI",
        "Base64 binaire ou Data URI",
        "Binäres Base64 oder Data URI",
        "バイナリBase64またはData URI",
        "二进制 Base64 或 Data URI",
        "Base64 ثنائي أو Data URI"
    ],
    "Copy binary Base64": [
        "बाइनरी Base64 कॉपी करें",
        "Copiar Base64 binario",
        "Copier le Base64 binaire",
        "Binäres Base64 kopieren",
        "バイナリBase64をコピー",
        "复制二进制 Base64",
        "نسخ Base64 الثنائي"
    ],
    "Download encoded text": [
        "एन्कोड किया टेक्स्ट डाउनलोड करें",
        "Descargar texto codificado",
        "Télécharger le texte encodé",
        "Kodierten Text herunterladen",
        "エンコードしたテキストをダウンロード",
        "下载编码文本",
        "تنزيل النص المرمّز"
    ],
    "Decode and download file": [
        "डिकोड कर फ़ाइल डाउनलोड करें",
        "Decodificar y descargar archivo",
        "Décoder et télécharger le fichier",
        "Datei dekodieren und herunterladen",
        "デコードしてファイルをダウンロード",
        "解码并下载文件",
        "فك الترميز وتنزيل الملف"
    ],
    "Clear binary input": [
        "बाइनरी इनपुट साफ़ करें",
        "Borrar entrada binaria",
        "Effacer l’entrée binaire",
        "Binäre Eingabe leeren",
        "バイナリ入力をクリア",
        "清空二进制输入",
        "مسح الإدخال الثنائي"
    ],
    "{bytes} bytes encoded locally.": [
        "{bytes} बाइट स्थानीय रूप से एन्कोड हुए।",
        "{bytes} bytes codificados localmente.",
        "{bytes} octets encodés localement.",
        "{bytes} Bytes lokal kodiert.",
        "{bytes}バイトをローカルでエンコードしました。",
        "已在本地编码 {bytes} 字节。",
        "تم ترميز {bytes} بايت محليًا."
    ],
    "{bytes} bytes decoded.": [
        "{bytes} बाइट डिकोड हुए।",
        "{bytes} bytes decodificados.",
        "{bytes} octets décodés.",
        "{bytes} Bytes dekodiert.",
        "{bytes}バイトをデコードしました。",
        "已解码 {bytes} 字节。",
        "تم فك ترميز {bytes} بايت."
    ],
    "Binary data is kept separate from text sharing. Files and Data URIs are processed locally and are not previewed or executed.": [
        "बाइनरी डेटा टेक्स्ट शेयरिंग से अलग रहता है। फ़ाइलें और Data URI स्थानीय रूप से प्रोसेस होते हैं; उनका पूर्वावलोकन या निष्पादन नहीं होता।",
        "Los datos binarios se mantienen separados del texto compartido. Los archivos y Data URI se procesan localmente y no se previsualizan ni ejecutan.",
        "Les données binaires restent séparées du partage de texte. Les fichiers et Data URI sont traités localement, sans aperçu ni exécution.",
        "Binärdaten bleiben vom Teilen von Text getrennt. Dateien und Data URIs werden lokal verarbeitet, ohne Vorschau oder Ausführung.",
        "バイナリデータはテキスト共有から分離されます。ファイルとData URIはローカルで処理し、プレビューや実行は行いません。",
        "二进制数据与文本分享分开。文件和 Data URI 在本地处理，不预览或执行。",
        "تبقى البيانات الثنائية منفصلة عن مشاركة النص. تُعالج الملفات وData URI محليًا دون معاينة أو تنفيذ."
    ],
    "File limit is 8 MiB.": [
        "फ़ाइल सीमा 8 MiB है।",
        "El límite del archivo es 8 MiB.",
        "La limite du fichier est de 8 MiB.",
        "Die Dateigrenze beträgt 8 MiB.",
        "ファイルの上限は8 MiBです。",
        "文件上限为 8 MiB。",
        "حد الملف 8 MiB."
    ],
    "Binary file limit is 8 MiB.": [
        "बाइनरी फ़ाइल सीमा 8 MiB है।",
        "El límite del archivo binario es 8 MiB.",
        "La limite du fichier binaire est de 8 MiB.",
        "Die Binärdateigrenze beträgt 8 MiB.",
        "バイナリファイルの上限は8 MiBです。",
        "二进制文件上限为 8 MiB。",
        "حد الملف الثنائي 8 MiB."
    ],
    "Enter a MIME type such as image/png or application/octet-stream.": [
        "image/png या application/octet-stream जैसा MIME प्रकार दें।",
        "Introduce un tipo MIME como image/png o application/octet-stream.",
        "Saisissez un type MIME comme image/png ou application/octet-stream.",
        "Gib einen MIME-Typ wie image/png oder application/octet-stream ein.",
        "image/pngやapplication/octet-streamなどのMIMEタイプを入力してください。",
        "请输入 image/png 或 application/octet-stream 等 MIME 类型。",
        "أدخل نوع MIME مثل image/png أو application/octet-stream."
    ],
    "The Data URI must use Base64 encoding.": [
        "Data URI में Base64 एन्कोडिंग होनी चाहिए।",
        "El Data URI debe usar codificación Base64.",
        "Le Data URI doit utiliser l’encodage Base64.",
        "Die Data URI muss Base64-Kodierung verwenden.",
        "Data URIはBase64エンコードである必要があります。",
        "Data URI 必须使用 Base64 编码。",
        "يجب أن يستخدم Data URI ترميز Base64."
    ],
    "The Data URI has an invalid MIME type.": [
        "Data URI का MIME प्रकार अमान्य है।",
        "El Data URI tiene un tipo MIME no válido.",
        "Le Data URI contient un type MIME non valide.",
        "Die Data URI hat einen ungültigen MIME-Typ.",
        "Data URIのMIMEタイプが無効です。",
        "Data URI 的 MIME 类型无效。",
        "نوع MIME في Data URI غير صالح."
    ],
    "Enter valid Base64 for a file of up to 8 MiB.": [
        "8 MiB तक की फ़ाइल का मान्य Base64 दें।",
        "Introduce Base64 válido para un archivo de hasta 8 MiB.",
        "Saisissez du Base64 valide pour un fichier de 8 MiB maximum.",
        "Gib gültiges Base64 für eine Datei bis 8 MiB ein.",
        "最大8 MiBのファイルの有効なBase64を入力してください。",
        "请输入最大 8 MiB 文件的有效 Base64。",
        "أدخل Base64 صالحًا لملف لا يتجاوز 8 MiB."
    ],
    "Invalid or noncanonical Base64 padding bits.": [
        "Base64 पैडिंग बिट अमान्य या गैर-कैनोनिकल हैं।",
        "Bits de relleno Base64 no válidos o no canónicos.",
        "Bits de remplissage Base64 non valides ou non canoniques.",
        "Ungültige oder nicht kanonische Base64-Füllbits.",
        "Base64のパディングビットが無効、または正規形式ではありません。",
        "Base64 填充位无效或不规范。",
        "بتات حشو Base64 غير صالحة أو غير قياسية."
    ],
    "A spreadsheet operation is already running.": [
        "स्प्रेडशीट प्रक्रिया पहले से चल रही है।",
        "Ya hay una operación de hoja de cálculo en curso.",
        "Une opération de feuille de calcul est déjà en cours.",
        "Eine Tabellenoperation läuft bereits.",
        "スプレッドシートの処理は既に実行中です。",
        "已有电子表格操作正在运行。",
        "تجري عملية جدول بيانات بالفعل."
    ],
    "Spreadsheet processing exceeded 20 seconds. Try a smaller workbook.": [
        "स्प्रेडशीट प्रक्रिया में 20 सेकंड से अधिक लगे। छोटी कार्यपुस्तिका आज़माएँ।",
        "El proceso superó los 20 segundos. Prueba un libro más pequeño.",
        "Le traitement a dépassé 20 secondes. Essayez un classeur plus petit.",
        "Die Verarbeitung hat 20 Sekunden überschritten. Versuche eine kleinere Arbeitsmappe.",
        "処理が20秒を超えました。小さいブックで再試行してください。",
        "电子表格处理超过 20 秒。请尝试较小的工作簿。",
        "تجاوزت المعالجة 20 ثانية. جرّب مصنفًا أصغر."
    ],
    "Spreadsheet worker could not start. Reload and retry.": [
        "स्प्रेडशीट वर्कर शुरू नहीं हुआ। फिर लोड कर कोशिश करें।",
        "No se pudo iniciar el proceso de hoja de cálculo. Recarga y reintenta.",
        "Le processus de feuille de calcul n’a pas pu démarrer. Rechargez et réessayez.",
        "Der Tabellen-Worker konnte nicht starten. Lade neu und versuche es erneut.",
        "スプレッドシートのワーカーを起動できませんでした。再読み込みして再試行してください。",
        "无法启动电子表格工作线程。请重新加载后重试。",
        "تعذر بدء عامل جدول البيانات. أعد التحميل وحاول مجددًا."
    ],
    "XLSX file limit is 8 MiB.": [
        "XLSX फ़ाइल सीमा 8 MiB है।",
        "El límite del archivo XLSX es 8 MiB.",
        "La limite du fichier XLSX est de 8 MiB.",
        "Die XLSX-Dateigrenze beträgt 8 MiB.",
        "XLSXファイルの上限は8 MiBです。",
        "XLSX 文件上限为 8 MiB。",
        "حد ملف XLSX هو 8 MiB."
    ],
    "Choose an XLSX file up to 8 MiB.": [
        "8 MiB तक की XLSX फ़ाइल चुनें।",
        "Elige un archivo XLSX de hasta 8 MiB.",
        "Choisissez un fichier XLSX de 8 MiB maximum.",
        "Wähle eine XLSX-Datei bis 8 MiB.",
        "最大8 MiBのXLSXファイルを選択してください。",
        "请选择最大 8 MiB 的 XLSX 文件。",
        "اختر ملف XLSX لا يتجاوز 8 MiB."
    ],
    "Use a standard single-part XLSX ZIP archive.": [
        "मानक एकल-भाग XLSX ZIP आर्काइव उपयोग करें।",
        "Usa un archivo ZIP XLSX estándar de una sola parte.",
        "Utilisez une archive ZIP XLSX standard en une seule partie.",
        "Verwende ein standardmäßiges einteiliges XLSX-ZIP-Archiv.",
        "標準の単一パートXLSX ZIPアーカイブを使用してください。",
        "请使用标准的单部分 XLSX ZIP 归档。",
        "استخدم أرشيف ZIP قياسيًا لملف XLSX من جزء واحد."
    ],
    "The XLSX archive has too many entries or an unsupported ZIP layout.": [
        "XLSX आर्काइव में बहुत प्रविष्टियाँ या असमर्थित ZIP लेआउट है।",
        "El archivo XLSX tiene demasiadas entradas o una estructura ZIP no compatible.",
        "L’archive XLSX contient trop d’entrées ou une structure ZIP non prise en charge.",
        "Das XLSX-Archiv hat zu viele Einträge oder ein nicht unterstütztes ZIP-Layout.",
        "XLSXアーカイブの項目が多すぎるか、ZIP構造が未対応です。",
        "XLSX 归档条目过多或 ZIP 布局不受支持。",
        "يحتوي أرشيف XLSX على إدخالات كثيرة جدًا أو بنية ZIP غير مدعومة."
    ],
    "The XLSX directory is damaged.": [
        "XLSX डायरेक्टरी क्षतिग्रस्त है।",
        "El directorio XLSX está dañado.",
        "Le répertoire XLSX est endommagé.",
        "Das XLSX-Verzeichnis ist beschädigt.",
        "XLSXディレクトリが破損しています。",
        "XLSX 目录已损坏。",
        "دليل XLSX تالف."
    ],
    "Encrypted, ZIP64 or damaged XLSX entries are unsupported.": [
        "एन्क्रिप्टेड, ZIP64 या क्षतिग्रस्त XLSX प्रविष्टियाँ समर्थित नहीं हैं।",
        "No se admiten entradas XLSX cifradas, ZIP64 o dañadas.",
        "Les entrées XLSX chiffrées, ZIP64 ou endommagées ne sont pas prises en charge.",
        "Verschlüsselte, ZIP64- oder beschädigte XLSX-Einträge werden nicht unterstützt.",
        "暗号化、ZIP64、破損したXLSX項目は未対応です。",
        "不支持加密、ZIP64 或损坏的 XLSX 条目。",
        "إدخالات XLSX المشفرة أو ZIP64 أو التالفة غير مدعومة."
    ],
    "The XLSX archive has duplicate or unsafe entry names.": [
        "XLSX आर्काइव में दोहराए गए या असुरक्षित प्रविष्टि नाम हैं।",
        "El archivo XLSX tiene nombres de entrada duplicados o inseguros.",
        "L’archive XLSX contient des noms d’entrée en double ou non sûrs.",
        "Das XLSX-Archiv enthält doppelte oder unsichere Eintragsnamen.",
        "XLSXアーカイブに重複または安全でない項目名があります。",
        "XLSX 归档包含重复或不安全的条目名。",
        "أرشيف XLSX يحتوي على أسماء إدخالات مكررة أو غير آمنة."
    ],
    "The XLSX local entry is damaged.": [
        "XLSX स्थानीय प्रविष्टि क्षतिग्रस्त है।",
        "La entrada local XLSX está dañada.",
        "L’entrée locale XLSX est endommagée.",
        "Der lokale XLSX-Eintrag ist beschädigt.",
        "XLSXのローカル項目が破損しています。",
        "XLSX 本地条目已损坏。",
        "الإدخال المحلي لملف XLSX تالف."
    ],
    "XLSX content exceeds 32 MiB or has invalid entry sizes.": [
        "XLSX सामग्री 32 MiB से अधिक है या प्रविष्टि आकार अमान्य हैं।",
        "El contenido XLSX supera 32 MiB o tiene tamaños de entrada no válidos.",
        "Le contenu XLSX dépasse 32 MiB ou la taille des entrées est non valide.",
        "XLSX-Inhalt überschreitet 32 MiB oder hat ungültige Eintragsgrößen.",
        "XLSX内容が32 MiBを超えているか、項目サイズが無効です。",
        "XLSX 内容超过 32 MiB 或条目大小无效。",
        "يتجاوز محتوى XLSX ‏32 MiB أو أحجام الإدخالات غير صالحة."
    ],
    "XLSX inflated content exceeds the declared size or 32 MiB limit.": [
        "विस्तृत XLSX सामग्री घोषित आकार या 32 MiB सीमा से अधिक है।",
        "El contenido XLSX descomprimido supera el tamaño declarado o el límite de 32 MiB.",
        "Le contenu XLSX décompressé dépasse la taille déclarée ou la limite de 32 MiB.",
        "Entpackter XLSX-Inhalt überschreitet die deklarierte Größe oder 32 MiB.",
        "展開したXLSX内容が宣言サイズまたは32 MiBの上限を超えています。",
        "解压后的 XLSX 内容超过声明大小或 32 MiB 上限。",
        "يتجاوز محتوى XLSX بعد الفك الحجم المعلن أو حد 32 MiB."
    ],
    "XML entity declarations are not supported in XLSX files.": [
        "XLSX फ़ाइलों में XML एंटिटी घोषणाएँ समर्थित नहीं हैं।",
        "No se admiten declaraciones de entidades XML en archivos XLSX.",
        "Les déclarations d’entités XML ne sont pas prises en charge dans les fichiers XLSX.",
        "XML-Entitätsdeklarationen werden in XLSX-Dateien nicht unterstützt.",
        "XLSXファイル内のXML実体宣言は未対応です。",
        "XLSX 文件不支持 XML 实体声明。",
        "تصريحات كيانات XML غير مدعومة في ملفات XLSX."
    ],
    "The XLSX entry size does not match its contents.": [
        "XLSX प्रविष्टि का आकार उसकी सामग्री से मेल नहीं खाता।",
        "El tamaño de la entrada XLSX no coincide con su contenido.",
        "La taille de l’entrée XLSX ne correspond pas à son contenu.",
        "Die XLSX-Eintragsgröße stimmt nicht mit dem Inhalt überein.",
        "XLSX項目のサイズが内容と一致しません。",
        "XLSX 条目大小与内容不符。",
        "حجم إدخال XLSX لا يطابق محتواه."
    ],
    "The archive is not a supported XLSX workbook.": [
        "यह आर्काइव समर्थित XLSX कार्यपुस्तिका नहीं है।",
        "El archivo no es un libro XLSX compatible.",
        "L’archive n’est pas un classeur XLSX pris en charge.",
        "Das Archiv ist keine unterstützte XLSX-Arbeitsmappe.",
        "対応するXLSXブックのアーカイブではありません。",
        "该归档不是受支持的 XLSX 工作簿。",
        "الأرشيف ليس مصنف XLSX مدعومًا."
    ],
    "Workbook contains an invalid date.": [
        "कार्यपुस्तिका में अमान्य तिथि है।",
        "El libro contiene una fecha no válida.",
        "Le classeur contient une date non valide.",
        "Die Arbeitsmappe enthält ein ungültiges Datum.",
        "ブックに無効な日付があります。",
        "工作簿包含无效日期。",
        "يحتوي المصنف على تاريخ غير صالح."
    ],
    "Formulas are not executed. Only their cached results are imported; missing results become null.": [
        "फ़ॉर्मूले नहीं चलते। केवल कैश परिणाम आयात होते हैं; अनुपलब्ध परिणाम null होते हैं।",
        "Las fórmulas no se ejecutan. Solo se importan sus resultados en caché; los ausentes se convierten en null.",
        "Les formules ne sont pas exécutées. Seuls leurs résultats en cache sont importés ; les résultats absents deviennent null.",
        "Formeln werden nicht ausgeführt. Nur zwischengespeicherte Ergebnisse werden importiert; fehlende werden null.",
        "数式は実行しません。キャッシュされた結果のみを読み込み、結果がない場合はnullになります。",
        "不执行公式。仅导入缓存结果；缺失结果变为 null。",
        "لا تُنفّذ الصيغ. تُستورد نتائجها المخزنة مؤقتًا فقط؛ وتصبح النتائج المفقودة null."
    ],
    "Hyperlinks are imported as display text without opening links.": [
        "हाइपरलिंक खोले बिना दिखने वाले टेक्स्ट के रूप में आयात होते हैं।",
        "Los hipervínculos se importan como texto visible sin abrir enlaces.",
        "Les liens hypertextes sont importés comme texte affiché sans être ouverts.",
        "Hyperlinks werden als Anzeigetext importiert, ohne Links zu öffnen.",
        "ハイパーリンクは開かず、表示テキストとして読み込みます。",
        "超链接仅导入显示文本，不打开链接。",
        "تُستورد الروابط كنص عرض دون فتحها."
    ],
    "Excel error cells are represented by their error strings.": [
        "Excel त्रुटि सेल अपनी त्रुटि स्ट्रिंग से दर्शाए जाते हैं।",
        "Las celdas de error de Excel se representan con sus cadenas de error.",
        "Les cellules d’erreur Excel sont représentées par leur chaîne d’erreur.",
        "Excel-Fehlerzellen werden durch ihre Fehlerzeichenfolgen dargestellt.",
        "Excelのエラーセルはエラー文字列で表現します。",
        "Excel 错误单元格以其错误字符串表示。",
        "تُمثّل خلايا أخطاء Excel بسلاسل الخطأ الخاصة بها."
    ],
    "Unsupported spreadsheet cell type.": [
        "स्प्रेडशीट सेल प्रकार समर्थित नहीं है।",
        "Tipo de celda de hoja de cálculo no compatible.",
        "Type de cellule de feuille de calcul non pris en charge.",
        "Nicht unterstützter Tabellenzellentyp.",
        "未対応のスプレッドシートのセル型です。",
        "不支持的电子表格单元格类型。",
        "نوع خلية جدول البيانات غير مدعوم."
    ],
    "Workbook limit is 30 sheets.": [
        "कार्यपुस्तिका की सीमा 30 शीट है।",
        "El límite del libro es de 30 hojas.",
        "Le classeur est limité à 30 feuilles.",
        "Die Arbeitsmappe ist auf 30 Blätter begrenzt.",
        "ブックの上限は30シートです。",
        "工作簿上限为 30 张表。",
        "حد المصنف 30 ورقة."
    ],
    "Workbook limit is 10,000 rows per sheet, 200 columns and 100,000 total grid cells.": [
        "कार्यपुस्तिका की सीमा प्रति शीट 10,000 पंक्तियाँ, 200 कॉलम और कुल 100,000 ग्रिड सेल है।",
        "El límite es de 10.000 filas por hoja, 200 columnas y 100.000 celdas en total.",
        "La limite est de 10 000 lignes par feuille, 200 colonnes et 100 000 cellules au total.",
        "Die Grenze beträgt 10.000 Zeilen pro Blatt, 200 Spalten und insgesamt 100.000 Rasterzellen.",
        "上限はシートあたり10,000行、200列、合計100,000グリッドセルです。",
        "工作簿上限为每张表 10,000 行、200 列和总计 100,000 个网格单元格。",
        "الحد هو 10,000 صف لكل ورقة، و200 عمود و100,000 خلية إجمالًا."
    ],
    "Dates are normalized to ISO 8601 UTC. Styling, charts, macros and workbook metadata are not converted.": [
        "तिथियाँ ISO 8601 UTC में सामान्यीकृत होती हैं। शैली, चार्ट, मैक्रो और कार्यपुस्तिका मेटाडेटा नहीं बदलते।",
        "Las fechas se normalizan a ISO 8601 UTC. No se convierten estilos, gráficos, macros ni metadatos del libro.",
        "Les dates sont normalisées en ISO 8601 UTC. Styles, graphiques, macros et métadonnées du classeur ne sont pas convertis.",
        "Datumswerte werden zu ISO 8601 UTC normalisiert. Stile, Diagramme, Makros und Arbeitsmappen-Metadaten werden nicht konvertiert.",
        "日付をISO 8601 UTCに正規化します。スタイル、グラフ、マクロ、ブックのメタデータは変換しません。",
        "日期规范化为 ISO 8601 UTC。不转换样式、图表、宏和工作簿元数据。",
        "تُوحّد التواريخ إلى ISO 8601 UTC. لا تُحوّل الأنماط والمخططات ووحدات الماكرو وبيانات المصنف الوصفية."
    ],
    "Converted workbook text exceeds 8 MiB.": [
        "रूपांतरित कार्यपुस्तिका टेक्स्ट 8 MiB से अधिक है।",
        "El texto del libro convertido supera 8 MiB.",
        "Le texte du classeur converti dépasse 8 MiB.",
        "Der konvertierte Arbeitsmappentext überschreitet 8 MiB.",
        "変換後のブックテキストが8 MiBを超えています。",
        "转换后的工作簿文本超过 8 MiB。",
        "يتجاوز نص المصنف المحوّل 8 MiB."
    ],
    "Use a valid sheet name up to 31 characters, without \\ / * ? : [ ] or leading/trailing apostrophes.": [
        "31 अक्षर तक का मान्य शीट नाम दें, जिसमें \\ / * ? : [ ] या शुरुआत/अंत में अपॉस्ट्रॉफ़ी न हो।",
        "Usa un nombre de hoja válido de hasta 31 caracteres, sin \\ / * ? : [ ] ni apóstrofos al principio o al final.",
        "Utilisez un nom de feuille valide de 31 caractères maximum, sans \\ / * ? : [ ] ni apostrophe au début ou à la fin.",
        "Verwende einen gültigen Blattnamen mit bis zu 31 Zeichen, ohne \\ / * ? : [ ] oder führende/abschließende Apostrophe.",
        "31文字以内の有効なシート名を使用してください。\\ / * ? : [ ]や先頭・末尾のアポストロフィーは使用できません。",
        "请使用最多 31 个字符的有效工作表名，不含 \\ / * ? : [ ] 或开头、结尾的单引号。",
        "استخدم اسم ورقة صالحًا حتى 31 حرفًا، دون \\ / * ? : [ ] أو فاصلة عليا في البداية أو النهاية."
    ],
    "Generated workbook exceeds 8 MiB.": [
        "बनी कार्यपुस्तिका 8 MiB से अधिक है।",
        "El libro generado supera 8 MiB.",
        "Le classeur généré dépasse 8 MiB.",
        "Die erzeugte Arbeitsmappe überschreitet 8 MiB.",
        "生成したブックが8 MiBを超えています。",
        "生成的工作簿超过 8 MiB。",
        "يتجاوز المصنف الناتج 8 MiB."
    ],
    "Object output needs unique, nonempty first-row headers. Choose row arrays to preserve this sheet.": [
        "ऑब्जेक्ट आउटपुट के लिए पहली पंक्ति में अलग और गैर-खाली हेडर चाहिए। शीट बचाने के लिए पंक्ति ऐरे चुनें।",
        "La salida como objetos requiere encabezados únicos y no vacíos en la primera fila. Elige matrices de filas para conservar esta hoja.",
        "La sortie objet nécessite des en-têtes uniques et non vides en première ligne. Choisissez des tableaux de lignes pour préserver cette feuille.",
        "Objektausgabe benötigt eindeutige, nicht leere Kopfzellen in der ersten Zeile. Wähle Zeilenarrays, um dieses Blatt zu erhalten.",
        "オブジェクト出力には、先頭行に重複しない空でないヘッダーが必要です。このシートを保持するには行配列を選択してください。",
        "对象输出要求首行标题唯一且非空。请选择行数组以保留此表。",
        "يتطلب إخراج الكائنات عناوين فريدة وغير فارغة في الصف الأول. اختر مصفوفات الصفوف للحفاظ على الورقة."
    ],
    "JSON input limit is 8 MiB.": [
        "JSON इनपुट सीमा 8 MiB है।",
        "El límite de entrada JSON es 8 MiB.",
        "La limite de l’entrée JSON est de 8 MiB.",
        "Die JSON-Eingabegrenze beträgt 8 MiB.",
        "JSON入力の上限は8 MiBです。",
        "JSON 输入上限为 8 MiB。",
        "حد إدخال JSON هو 8 MiB."
    ],
    "Use an array of 1–10,000 row arrays or objects.": [
        "1–10,000 पंक्ति ऐरे या ऑब्जेक्ट का ऐरे उपयोग करें।",
        "Usa una matriz de 1 a 10.000 matrices de filas u objetos.",
        "Utilisez un tableau de 1 à 10 000 tableaux de lignes ou objets.",
        "Verwende ein Array mit 1–10.000 Zeilenarrays oder Objekten.",
        "1～10,000個の行配列またはオブジェクトの配列を使用してください。",
        "请使用含 1–10,000 个行数组或对象的数组。",
        "استخدم مصفوفة تضم من 1 إلى 10,000 مصفوفة صف أو كائن."
    ],
    "Unsupported cell value.": [
        "सेल मान समर्थित नहीं है।",
        "Valor de celda no compatible.",
        "Valeur de cellule non prise en charge.",
        "Nicht unterstützter Zellwert.",
        "未対応のセル値です。",
        "不支持的单元格值。",
        "قيمة الخلية غير مدعومة."
    ],
    "Use only row arrays, or only objects, in the input array.": [
        "इनपुट ऐरे में केवल पंक्ति ऐरे या केवल ऑब्जेक्ट उपयोग करें।",
        "Usa solo matrices de filas o solo objetos en la matriz de entrada.",
        "Utilisez uniquement des tableaux de lignes ou uniquement des objets dans le tableau d’entrée.",
        "Verwende im Eingabearray nur Zeilenarrays oder nur Objekte.",
        "入力配列には行配列のみ、またはオブジェクトのみを使用してください。",
        "输入数组中请仅使用行数组或仅使用对象。",
        "استخدم مصفوفات صفوف فقط أو كائنات فقط في مصفوفة الإدخال."
    ],
    "Export limit is 10,000 rows, 200 columns and 100,000 cells.": [
        "निर्यात सीमा 10,000 पंक्तियाँ, 200 कॉलम और 100,000 सेल है।",
        "El límite de exportación es de 10.000 filas, 200 columnas y 100.000 celdas.",
        "L’export est limité à 10 000 lignes, 200 colonnes et 100 000 cellules.",
        "Die Exportgrenze beträgt 10.000 Zeilen, 200 Spalten und 100.000 Zellen.",
        "出力の上限は10,000行、200列、100,000セルです。",
        "导出上限为 10,000 行、200 列和 100,000 个单元格。",
        "حد التصدير هو 10,000 صف و200 عمود و100,000 خلية."
    ],
    "Encode": [
        "एन्कोड करें",
        "Codificar",
        "Encoder",
        "Kodieren",
        "エンコード",
        "编码",
        "ترميز"
    ],
    "Decode": [
        "डिकोड करें",
        "Decodificar",
        "Décoder",
        "Dekodieren",
        "デコード",
        "解码",
        "فك الترميز"
    ],
    "Copy Output": [
        "आउटपुट कॉपी करें",
        "Copiar salida",
        "Copier la sortie",
        "Ausgabe kopieren",
        "出力をコピー",
        "复制输出",
        "نسخ الناتج"
    ],
    "Base64 input": [
        "Base64 इनपुट",
        "Entrada Base64",
        "Entrée Base64",
        "Base64-Eingabe",
        "Base64入力",
        "Base64 输入",
        "إدخال Base64"
    ],
    "Base64 output": [
        "Base64 आउटपुट",
        "Salida Base64",
        "Sortie Base64",
        "Base64-Ausgabe",
        "Base64出力",
        "Base64 输出",
        "ناتج Base64"
    ],
    "Enter text to encode/decode...": [
        "एन्कोड/डिकोड करने का टेक्स्ट दें...",
        "Introduce texto para codificar/decodificar...",
        "Saisissez le texte à encoder/décoder...",
        "Text zum Kodieren/Dekodieren eingeben...",
        "エンコード／デコードするテキストを入力…",
        "输入待编码／解码的文本...",
        "أدخل النص لترميزه أو فك ترميزه..."
    ],
    "Text could not be encoded. Check the input and try again.": [
        "टेक्स्ट एन्कोड नहीं हुआ। इनपुट जाँच कर फिर कोशिश करें।",
        "No se pudo codificar el texto. Revisa la entrada y reintenta.",
        "Le texte n’a pas pu être encodé. Vérifiez l’entrée et réessayez.",
        "Text konnte nicht kodiert werden. Prüfe die Eingabe und versuche es erneut.",
        "テキストをエンコードできませんでした。入力を確認して再試行してください。",
        "无法编码文本。请检查输入后重试。",
        "تعذر ترميز النص. تحقق من الإدخال وحاول مجددًا."
    ],
    "Base64 could not be decoded as UTF-8 text. Check the input or use binary decoding below.": [
        "Base64 को UTF-8 टेक्स्ट में डिकोड नहीं किया जा सका। इनपुट जाँचें या नीचे बाइनरी डिकोडिंग उपयोग करें।",
        "No se pudo decodificar Base64 como texto UTF-8. Revisa la entrada o usa la decodificación binaria de abajo.",
        "Impossible de décoder Base64 en texte UTF-8. Vérifiez l’entrée ou utilisez le décodage binaire ci-dessous.",
        "Base64 konnte nicht als UTF-8-Text dekodiert werden. Prüfe die Eingabe oder nutze unten die binäre Dekodierung.",
        "Base64をUTF-8テキストとしてデコードできませんでした。入力を確認するか、下のバイナリデコードを使用してください。",
        "无法将 Base64 解码为 UTF-8 文本。请检查输入或使用下方的二进制解码。",
        "تعذر فك Base64 كنص UTF-8. تحقق من الإدخال أو استخدم فك الترميز الثنائي أدناه."
    ],
    "Encode and decode Base64 strings": [
        "Base64 स्ट्रिंग एन्कोड और डिकोड करें",
        "Codifica y decodifica cadenas Base64",
        "Encodez et décodez des chaînes Base64",
        "Base64-Zeichenfolgen kodieren und dekodieren",
        "Base64文字列をエンコード・デコード",
        "编码和解码 Base64 字符串",
        "ترميز سلاسل Base64 وفك ترميزها"
    ],
    "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's commonly used to encode data that needs to be stored or transferred via media designed for text.": [
        "Base64 बाइनरी डेटा को ASCII स्ट्रिंग के रूप में दर्शाने वाली बाइनरी-टू-टेक्स्ट एन्कोडिंग है। इसका उपयोग टेक्स्ट माध्यमों से डेटा रखने या भेजने में होता है।",
        "Base64 es una codificación de binario a texto que representa datos binarios como cadenas ASCII. Se usa para almacenar o transferir datos mediante medios diseñados para texto.",
        "Base64 est un encodage binaire vers texte qui représente les données binaires par une chaîne ASCII. Il sert à stocker ou transmettre des données sur des supports conçus pour le texte.",
        "Base64 stellt Binärdaten als ASCII-Zeichenfolgen dar. Es wird verwendet, um Daten über für Text ausgelegte Medien zu speichern oder zu übertragen.",
        "Base64はバイナリデータをASCII文字列で表すエンコード方式です。テキスト用の媒体でデータを保存・転送するときによく使用します。",
        "Base64 是将二进制数据表示为 ASCII 字符串的编码方案，常用于通过文本媒介存储或传输数据。",
        "Base64 ترميز يحوّل البيانات الثنائية إلى سلسلة ASCII. يُستخدم عادة لتخزين البيانات أو نقلها عبر وسائط مصممة للنص."
    ],
    "Base64 encoding is essential for embedding images in HTML/CSS, transmitting binary data in JSON/XML, encoding email attachments (MIME), and storing binary data in databases or config files as text.": [
        "Base64 से HTML/CSS में चित्र जोड़ना, JSON/XML में बाइनरी डेटा भेजना, ईमेल संलग्नक (MIME) एन्कोड करना और डेटाबेस या कॉन्फ़िग फ़ाइल में बाइनरी डेटा को टेक्स्ट रखना संभव है।",
        "Base64 permite incrustar imágenes en HTML/CSS, enviar datos binarios en JSON/XML, codificar adjuntos de correo (MIME) y almacenar datos binarios como texto en bases de datos o archivos de configuración.",
        "Base64 permet d’intégrer des images dans HTML/CSS, de transmettre des données binaires en JSON/XML, d’encoder des pièces jointes (MIME) et de stocker du binaire en texte dans des bases de données ou fichiers de configuration.",
        "Base64 ermöglicht Bilder in HTML/CSS, Binärdaten in JSON/XML, E-Mail-Anhänge (MIME) und das Speichern von Binärdaten als Text in Datenbanken oder Konfigurationsdateien.",
        "Base64はHTML/CSSへの画像埋め込み、JSON/XMLでのバイナリ転送、メール添付（MIME）のエンコード、データベースや設定ファイルへのテキスト保存に使用します。",
        "Base64 可用于在 HTML/CSS 中嵌入图像、通过 JSON/XML 传输二进制数据、编码邮件附件（MIME），以及在数据库或配置文件中以文本存储二进制数据。",
        "يُستخدم Base64 لتضمين الصور في HTML/CSS ونقل البيانات الثنائية في JSON/XML وترميز مرفقات البريد (MIME) وتخزين البيانات الثنائية كنص في قواعد البيانات أو ملفات الإعداد."
    ],
    "Select 'Encode' to convert text to Base64 or 'Decode' to convert Base64 back to text": [
        "टेक्स्ट को Base64 में बदलने के लिए 'एन्कोड करें' या वापस टेक्स्ट बनाने के लिए 'डिकोड करें' चुनें",
        "Elige 'Codificar' para pasar texto a Base64 o 'Decodificar' para volver a texto",
        "Choisissez « Encoder » pour convertir le texte en Base64 ou « Décoder » pour revenir au texte",
        "Wähle „Kodieren“ für Text zu Base64 oder „Dekodieren“ für Base64 zu Text",
        "「エンコード」でテキストをBase64に、「デコード」でBase64をテキストに変換します",
        "选择“编码”将文本转为 Base64，或“解码”将 Base64 转回文本",
        "اختر «ترميز» لتحويل النص إلى Base64 أو «فك الترميز» لإعادته إلى نص"
    ],
    "Paste your input text or Base64 string": [
        "इनपुट टेक्स्ट या Base64 स्ट्रिंग पेस्ट करें",
        "Pega el texto o la cadena Base64",
        "Collez le texte ou la chaîne Base64",
        "Füge Text oder eine Base64-Zeichenfolge ein",
        "入力テキストまたはBase64文字列を貼り付けます",
        "粘贴输入文本或 Base64 字符串",
        "الصق النص أو سلسلة Base64"
    ],
    "Click the action button to transform": [
        "बदलने के लिए क्रिया बटन दबाएँ",
        "Pulsa el botón de acción para transformar",
        "Cliquez sur le bouton d’action pour convertir",
        "Klicke zum Umwandeln auf die Aktionsschaltfläche",
        "操作ボタンを押して変換します",
        "点击操作按钮进行转换",
        "اضغط زر الإجراء للتحويل"
    ],
    "Copy the result from the output panel": [
        "आउटपुट पैनल से परिणाम कॉपी करें",
        "Copia el resultado del panel de salida",
        "Copiez le résultat depuis le panneau de sortie",
        "Kopiere das Ergebnis aus dem Ausgabebereich",
        "出力パネルから結果をコピーします",
        "从输出面板复制结果",
        "انسخ النتيجة من لوحة الإخراج"
    ],
    "Base64 encoding increases data size by approximately 33%": [
        "Base64 एन्कोडिंग से डेटा आकार लगभग 33% बढ़ता है",
        "La codificación Base64 aumenta el tamaño de los datos aproximadamente un 33 %",
        "L’encodage Base64 augmente la taille des données d’environ 33 %",
        "Base64-Kodierung erhöht die Datengröße um etwa 33 %",
        "Base64エンコードでデータサイズは約33%増加します",
        "Base64 编码使数据大小增加约 33%",
        "يزيد ترميز Base64 حجم البيانات بنحو 33%"
    ],
    "Supports UTF-8 text including emojis and special characters": [
        "इमोजी और विशेष अक्षर सहित UTF-8 टेक्स्ट समर्थित है",
        "Admite texto UTF-8 con emojis y caracteres especiales",
        "Prend en charge le texte UTF-8 avec emojis et caractères spéciaux",
        "Unterstützt UTF-8-Text einschließlich Emojis und Sonderzeichen",
        "絵文字や特殊文字を含むUTF-8テキストに対応します",
        "支持含表情符号和特殊字符的 UTF-8 文本",
        "يدعم نص UTF-8 بما فيه الرموز التعبيرية والمحارف الخاصة"
    ],
    "Invalid Base64 strings will show an error when decoding": [
        "अमान्य Base64 स्ट्रिंग डिकोड करने पर त्रुटि दिखेगी",
        "Las cadenas Base64 no válidas mostrarán un error al decodificar",
        "Les chaînes Base64 non valides affichent une erreur au décodage",
        "Ungültige Base64-Zeichenfolgen zeigen beim Dekodieren einen Fehler",
        "無効なBase64文字列のデコード時はエラーを表示します",
        "解码无效 Base64 字符串时会显示错误",
        "تظهر رسالة خطأ عند فك سلاسل Base64 غير الصالحة"
    ],
    "Use for data URIs like 'data:image/png;base64,...'": [
        "इसे 'data:image/png;base64,...' जैसे Data URI के लिए उपयोग करें",
        "Úsalo para Data URI como 'data:image/png;base64,...'",
        "Utilisez-le pour des Data URI comme 'data:image/png;base64,...'",
        "Für Data URIs wie 'data:image/png;base64,...' verwenden",
        "'data:image/png;base64,...'などのData URIに使用できます",
        "可用于 'data:image/png;base64,...' 等 Data URI",
        "استخدمه مع Data URI مثل 'data:image/png;base64,...'"
    ],
    "Embedding small images directly in HTML or CSS": [
        "छोटे चित्र सीधे HTML या CSS में जोड़ना",
        "Incrustar imágenes pequeñas directamente en HTML o CSS",
        "Intégrer de petites images directement dans HTML ou CSS",
        "Kleine Bilder direkt in HTML oder CSS einbetten",
        "小さい画像をHTMLやCSSに直接埋め込む",
        "在 HTML 或 CSS 中直接嵌入小图像",
        "تضمين صور صغيرة مباشرة في HTML أو CSS"
    ],
    "Encoding API authentication tokens": [
        "API प्रमाणीकरण टोकन एन्कोड करना",
        "Codificar tokens de autenticación API",
        "Encoder des jetons d’authentification API",
        "API-Authentifizierungstoken kodieren",
        "API認証トークンをエンコードする",
        "编码 API 身份验证令牌",
        "ترميز رموز مصادقة API"
    ],
    "Transmitting binary files as text in JSON APIs": [
        "JSON API में बाइनरी फ़ाइलें टेक्स्ट के रूप में भेजना",
        "Transmitir archivos binarios como texto en API JSON",
        "Transmettre des fichiers binaires en texte dans des API JSON",
        "Binärdateien als Text in JSON-APIs übertragen",
        "JSON APIでバイナリファイルをテキストとして転送する",
        "在 JSON API 中以文本传输二进制文件",
        "نقل الملفات الثنائية كنص في واجهات JSON API"
    ],
    "Encoding configuration secrets for environment variables": [
        "पर्यावरण वेरिएबल के लिए कॉन्फ़िगरेशन सीक्रेट एन्कोड करना",
        "Codificar secretos de configuración para variables de entorno",
        "Encoder des secrets de configuration pour des variables d’environnement",
        "Konfigurationsgeheimnisse für Umgebungsvariablen kodieren",
        "環境変数用の設定シークレットをエンコードする",
        "为环境变量编码配置密钥",
        "ترميز أسرار الإعداد لمتغيرات البيئة"
    ],
    "What is Base64 encoding?": ["Base64 एन्कोडिंग क्या है?", "¿Qué es la codificación Base64?", "Qu’est-ce que l’encodage Base64 ?", "Was ist Base64-Kodierung?", "Base64エンコードとは何ですか？", "什么是 Base64 编码？", "ما ترميز Base64؟"],
    "Base64 is a binary-to-text encoding that represents binary data using 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It is commonly used to embed binary data (images, files) inside JSON, HTML, emails, and HTTP headers.": ["Base64 बाइनरी डेटा को 64 प्रिंट करने योग्य ASCII वर्णों (A–Z, a–z, 0–9, +, /) से टेक्स्ट में दर्शाता है। इसका उपयोग अक्सर चित्रों और फ़ाइलों को JSON, HTML, ईमेल और HTTP हेडर में शामिल करने के लिए होता है।", "Base64 representa datos binarios como texto mediante 64 caracteres ASCII imprimibles (A–Z, a–z, 0–9, +, /). Se usa para incluir imágenes y archivos en JSON, HTML, correos y cabeceras HTTP.", "Base64 représente des données binaires sous forme de texte à l’aide de 64 caractères ASCII imprimables (A–Z, a–z, 0–9, +, /). Il sert à intégrer des images et fichiers dans JSON, HTML, les courriels et les en-têtes HTTP.", "Base64 stellt Binärdaten als Text mit 64 druckbaren ASCII-Zeichen dar (A–Z, a–z, 0–9, +, /). Es wird verwendet, um Bilder und Dateien in JSON, HTML, E-Mails und HTTP-Header einzubetten.", "Base64は64種類の印字可能なASCII文字（A–Z、a–z、0–9、+、/）でバイナリーデータをテキストとして表す方式です。画像やファイルをJSON、HTML、メール、HTTPヘッダーに埋め込む際によく使われます。", "Base64 使用 64 个可打印 ASCII 字符（A–Z、a–z、0–9、+、/）将二进制数据表示为文本，常用于在 JSON、HTML、邮件和 HTTP 标头中嵌入图像、文件等二进制数据。", "يمثل Base64 البيانات الثنائية كنص باستخدام 64 محرف ASCII قابلًا للطباعة (A–Z، a–z، 0–9، +، /). ويُستخدم عادةً لتضمين الصور والملفات في JSON وHTML والبريد الإلكتروني وترويسات HTTP."],
    "What is URL-safe Base64?": ["URL-सुरक्षित Base64 क्या है?", "¿Qué es Base64 seguro para URL?", "Qu’est-ce que Base64 adapté aux URL ?", "Was ist URL-sicheres Base64?", "URLセーフなBase64とは何ですか？", "什么是 URL 安全的 Base64？", "ما Base64 الآمن لعناوين URL؟"],
    "URL-safe Base64 replaces + with - and / with _, producing strings that can be safely used in URLs and filenames without percent-encoding. JWTs use URL-safe Base64 without padding.": ["URL-सुरक्षित Base64 में + की जगह - और / की जगह _ होता है, जिससे स्ट्रिंग को प्रतिशत एन्कोडिंग के बिना URL और फ़ाइल नामों में इस्तेमाल किया जा सकता है। JWT बिना पैडिंग वाला URL-सुरक्षित Base64 इस्तेमाल करते हैं।", "Base64 seguro para URL sustituye + por - y / por _, de modo que las cadenas se usan en URL y nombres de archivo sin codificación porcentual. Los JWT usan esta variante sin relleno.", "Base64 adapté aux URL remplace + par - et / par _, pour utiliser les chaînes dans les URL et noms de fichiers sans encodage en pourcentage. Les JWT utilisent cette variante sans remplissage.", "URL-sicheres Base64 ersetzt + durch - und / durch _. Die Zeichenfolgen lassen sich dadurch ohne Prozentkodierung in URLs und Dateinamen verwenden. JWTs nutzen diese Variante ohne Auffüllzeichen.", "URLセーフなBase64は+を-に、/を_に置き換え、パーセントエンコードなしでURLやファイル名に使える文字列にします。JWTではパディングなしのURLセーフなBase64を使います。", "URL 安全的 Base64 将 + 替换为 -、将 / 替换为 _，使字符串无需百分号编码即可用于 URL 和文件名。JWT 使用不带填充的 URL 安全 Base64。", "يستبدل Base64 الآمن لعناوين URL الرمز + بالرمز - والرمز / بالرمز _، لاستخدام النص في العناوين وأسماء الملفات دون ترميز مئوي. وتستخدم رموز JWT هذه الصيغة دون حشو."],
    "Does Base64 encrypt my data?": ["क्या Base64 मेरे डेटा को एन्क्रिप्ट करता है?", "¿Base64 cifra mis datos?", "Base64 chiffre-t-il mes données ?", "Verschlüsselt Base64 meine Daten?", "Base64はデータを暗号化しますか？", "Base64 会加密数据吗？", "هل يشفّر Base64 بياناتي؟"],
    "No. Base64 is an encoding, not encryption. Anyone with the encoded string can instantly decode it. Use AES or other encryption if you need to protect sensitive data.": ["नहीं। Base64 एन्कोडिंग है, एन्क्रिप्शन नहीं। एन्कोड की गई स्ट्रिंग वाला कोई भी व्यक्ति उसे तुरंत डिकोड कर सकता है। संवेदनशील डेटा की सुरक्षा के लिए AES या अन्य एन्क्रिप्शन इस्तेमाल करें।", "No. Base64 es una codificación, no un cifrado. Cualquiera que tenga la cadena puede decodificarla al instante. Usa AES u otro cifrado para proteger datos sensibles.", "Non. Base64 est un encodage, pas un chiffrement. Toute personne disposant de la chaîne peut la décoder immédiatement. Utilisez AES ou un autre chiffrement pour protéger des données sensibles.", "Nein. Base64 ist eine Kodierung, keine Verschlüsselung. Jeder mit der Zeichenfolge kann sie sofort dekodieren. Schütze sensible Daten mit AES oder einer anderen Verschlüsselung.", "いいえ。Base64はエンコードであり、暗号化ではありません。文字列を持つ人は誰でもすぐにデコードできます。機密データの保護にはAESなどの暗号化を使用してください。", "不会。Base64 是编码，并非加密。任何拥有该字符串的人都能立即解码。保护敏感数据时应使用 AES 或其他加密方式。", "لا. Base64 ترميز وليس تشفيرًا. يستطيع أي شخص يملك النص المرمّز فك ترميزه فورًا. استخدم AES أو تشفيرًا آخر لحماية البيانات الحساسة."],
    "A JSON number cannot be preserved safely as an Excel numeric cell. Quote precision-sensitive numbers as JSON strings to keep their exact text.": ["JSON संख्या Excel संख्यात्मक सेल में सुरक्षित नहीं रह सकती। सटीक टेक्स्ट बचाने के लिए संवेदनशील संख्याएँ JSON स्ट्रिंग में उद्धृत करें।", "Un número JSON no puede conservarse con seguridad como celda numérica Excel. Pon los números sensibles entre comillas JSON para mantener su texto exacto.", "Un nombre JSON ne peut être conservé sûrement dans une cellule numérique Excel. Mettez les nombres sensibles entre guillemets JSON pour préserver leur texte exact.", "Eine JSON-Zahl lässt sich nicht sicher als Excel-Zahl erhalten. Präzisionsempfindliche Zahlen als JSON-Zeichenfolgen zitieren, um den exakten Text zu bewahren.", "JSON 数値を Excel の数値セルで安全に保持できません。精度が重要な数値は JSON 文字列として引用し、正確な表記を保持してください。", "JSON 数值无法安全保留为 Excel 数值单元格。请将精度敏感数值加引号作为 JSON 字符串以保留原文。", "لا يمكن حفظ رقم JSON بأمان كخلية Excel رقمية. ضع الأرقام الحساسة للدقة بين علامات اقتباس JSON لحفظ نصها الدقيق."],
    "Quote JSON numbers that need more than 15 significant digits, negative zero or unsupported magnitudes. They export as exact text instead of numeric cells.": ["15 से अधिक सार्थक अंकों वाली JSON संख्याएँ, ऋणात्मक शून्य या असमर्थित परिमाण उद्धरण में रखें। वे संख्यात्मक सेल के बजाय सटीक टेक्स्ट बनते हैं।", "Pon entre comillas los números JSON que necesiten más de 15 dígitos significativos, cero negativo o magnitudes no admitidas. Se exportan como texto exacto, no como celdas numéricas.", "Mettez entre guillemets les nombres JSON dépassant 15 chiffres significatifs, le zéro négatif ou les grandeurs non prises en charge. Ils sont exportés en texte exact, pas en cellules numériques.", "JSON-Zahlen mit mehr als 15 signifikanten Stellen, negatives Null oder unzulässige Größen als Zeichenfolgen angeben. Sie werden als exakter Text statt Zahlenzellen exportiert.", "有効数字15桁を超える JSON 数値、負のゼロ、非対応の大きさは引用符で囲んでください。数値セルではなく正確な文字列として出力します。", "超过 15 位有效数字、负零或不支持数量级的 JSON 数值请加引号。它们会导出为精确文本，而不是数值单元格。", "ضع أرقام JSON التي تحتاج أكثر من 15 رقمًا معنويًا أو الصفر السالب أو المقادير غير المدعومة بين اقتباسات. تُصدّر كنص دقيق لا كخلايا رقمية."],
};

export function isFileConversionMessage(source: string): boolean {
    return Object.hasOwn(FILE_CONVERSION_TRANSLATIONS, source);
}
