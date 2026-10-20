import type { TranslationColumns } from "./tool-names";

// Authored certificate/key interface copy. Encoded material and raw diagnostics remain exact.
export const CERTIFICATE_TOOL_TRANSLATIONS: Record<string, TranslationColumns> = {
    "This certificate is EXPIRED": [
        "यह प्रमाणपत्र समाप्त हो चुका है",
        "Este certificado ha CADUCADO",
        "Ce certificat a EXPIRÉ",
        "Dieses Zertifikat ist ABGELAUFEN",
        "この証明書は期限切れです",
        "此证书已过期",
        "انتهت صلاحية هذه الشهادة"
    ],
    "Expires in {days} days": [
        "{days} दिनों में समाप्त",
        "Caduca en {days} días",
        "Expire dans {days} jours",
        "Läuft in {days} Tagen ab",
        "あと{days}日で期限切れ",
        "{days} 天后到期",
        "تنتهي الصلاحية خلال {days} يومًا"
    ],
    "Valid ({days} days remaining)": [
        "मान्य ({days} दिन शेष)",
        "Válido (quedan {days} días)",
        "Valide ({days} jours restants)",
        "Gültig (noch {days} Tage)",
        "有効（残り{days}日）",
        "有效（剩余 {days} 天）",
        "صالحة (متبقٍ {days} يومًا)"
    ],
    "Summary": [
        "सारांश",
        "Resumen",
        "Résumé",
        "Übersicht",
        "概要",
        "摘要",
        "ملخص"
    ],
    "Common Name": [
        "सामान्य नाम",
        "Nombre común",
        "Nom commun",
        "Allgemeiner Name",
        "コモンネーム",
        "通用名称",
        "الاسم الشائع"
    ],
    "Issuer": [
        "जारीकर्ता",
        "Emisor",
        "Émetteur",
        "Aussteller",
        "発行者",
        "颁发者",
        "المُصدر"
    ],
    "Serial Number": [
        "क्रम संख्या",
        "Número de serie",
        "Numéro de série",
        "Seriennummer",
        "シリアル番号",
        "序列号",
        "الرقم التسلسلي"
    ],
    "Version": [
        "संस्करण",
        "Versión",
        "Version",
        "Version",
        "バージョン",
        "版本",
        "الإصدار"
    ],
    "Signature Algorithm": [
        "हस्ताक्षर एल्गोरिथ्म",
        "Algoritmo de firma",
        "Algorithme de signature",
        "Signaturalgorithmus",
        "署名アルゴリズム",
        "签名算法",
        "خوارزمية التوقيع"
    ],
    "Public Key": [
        "सार्वजनिक कुंजी",
        "Clave pública",
        "Clé publique",
        "Öffentlicher Schlüssel",
        "公開鍵",
        "公钥",
        "المفتاح العام"
    ],
    "{count} bits": [
        "{count} बिट",
        "{count} bits",
        "{count} bits",
        "{count} Bit",
        "{count}ビット",
        "{count} 位",
        "{count} بت"
    ],
    "Valid From": [
        "मान्य होने की तिथि",
        "Válido desde",
        "Valide à partir du",
        "Gültig ab",
        "有効期間の開始",
        "有效期起始",
        "صالحة من"
    ],
    "Valid Until": [
        "समाप्ति तिथि",
        "Válido hasta",
        "Valide jusqu’au",
        "Gültig bis",
        "有効期限",
        "有效期截止",
        "صالحة حتى"
    ],
    "Self-Signed": [
        "स्व-हस्ताक्षरित",
        "Autofirmado",
        "Autosigné",
        "Selbstsigniert",
        "自己署名",
        "自签名",
        "موقعة ذاتيًا"
    ],
    "Yes": [
        "हाँ",
        "Sí",
        "Oui",
        "Ja",
        "はい",
        "是",
        "نعم"
    ],
    "No": [
        "नहीं",
        "No",
        "Non",
        "Nein",
        "いいえ",
        "否",
        "لا"
    ],
    "Basic Constraints": [
        "मूल प्रतिबंध",
        "Restricciones básicas",
        "Contraintes de base",
        "Grundlegende Einschränkungen",
        "基本制約",
        "基本约束",
        "القيود الأساسية"
    ],
    "Subject / Issuer": [
        "विषय / जारीकर्ता",
        "Sujeto / Emisor",
        "Sujet / Émetteur",
        "Subjekt / Aussteller",
        "サブジェクト／発行者",
        "主体 / 颁发者",
        "الموضوع / المُصدر"
    ],
    "Subject": [
        "विषय",
        "Sujeto",
        "Sujet",
        "Subjekt",
        "サブジェクト",
        "主体",
        "الموضوع"
    ],
    "SANs ({count})": [
        "SAN ({count})",
        "SAN ({count})",
        "SAN ({count})",
        "SANs ({count})",
        "SAN（{count}）",
        "SAN（{count}）",
        "SAN ({count})"
    ],
    "SAN copied": [
        "SAN कॉपी हुआ",
        "SAN copiado",
        "SAN copié",
        "SAN kopiert",
        "SANをコピーしました",
        "已复制 SAN",
        "تم نسخ SAN"
    ],
    "No Subject Alternative Names": [
        "कोई वैकल्पिक विषय नाम नहीं",
        "Sin nombres alternativos",
        "Aucun nom alternatif du sujet",
        "Keine alternativen Subjektnamen",
        "サブジェクト代替名はありません",
        "无主体备用名称",
        "لا توجد أسماء بديلة للموضوع"
    ],
    "Key Usage": [
        "कुंजी उपयोग",
        "Uso de clave",
        "Usage de clé",
        "Schlüsselverwendung",
        "鍵用途",
        "密钥用途",
        "استخدام المفتاح"
    ],
    "Extended Key Usage": [
        "विस्तारित कुंजी उपयोग",
        "Uso extendido de clave",
        "Usage étendu de clé",
        "Erweiterte Schlüsselverwendung",
        "拡張鍵用途",
        "扩展密钥用途",
        "الاستخدام الموسع للمفتاح"
    ],
    "Fingerprints": [
        "फिंगरप्रिंट",
        "Huellas digitales",
        "Empreintes",
        "Fingerabdrücke",
        "フィンガープリント",
        "指纹",
        "البصمات"
    ],
    "Public key copied": [
        "सार्वजनिक कुंजी कॉपी हुई",
        "Clave pública copiada",
        "Clé publique copiée",
        "Öffentlicher Schlüssel kopiert",
        "公開鍵をコピーしました",
        "已复制公钥",
        "تم نسخ المفتاح العام"
    ],
    "Copy public key PEM": [
        "सार्वजनिक कुंजी PEM कॉपी करें",
        "Copiar PEM de clave pública",
        "Copier la clé publique PEM",
        "Öffentlichen Schlüssel als PEM kopieren",
        "公開鍵PEMをコピー",
        "复制公钥 PEM",
        "نسخ المفتاح العام PEM"
    ],
    "Raw": [
        "मूल डेटा",
        "Sin procesar",
        "Brut",
        "Rohdaten",
        "生データ",
        "原始数据",
        "بيانات خام"
    ],
    "PEM copied": [
        "PEM कॉपी हुआ",
        "PEM copiado",
        "PEM copié",
        "PEM kopiert",
        "PEMをコピーしました",
        "已复制 PEM",
        "تم نسخ PEM"
    ],
    "Copy PEM": [
        "PEM कॉपी करें",
        "Copiar PEM",
        "Copier PEM",
        "PEM kopieren",
        "PEMをコピー",
        "复制 PEM",
        "نسخ PEM"
    ],
    "Download DER": [
        "DER डाउनलोड करें",
        "Descargar DER",
        "Télécharger DER",
        "DER herunterladen",
        "DERをダウンロード",
        "下载 DER",
        "تنزيل DER"
    ],
    "Certificate decoded": [
        "प्रमाणपत्र डिकोड हुआ",
        "Certificado decodificado",
        "Certificat décodé",
        "Zertifikat dekodiert",
        "証明書をデコードしました",
        "已解码证书",
        "تم فك ترميز الشهادة"
    ],
    "Decoded Output": [
        "डिकोड किया गया आउटपुट",
        "Resultado decodificado",
        "Résultat décodé",
        "Dekodierte Ausgabe",
        "デコード結果",
        "解码结果",
        "الناتج المفكوك"
    ],
    "Decode a certificate to see its fields": [
        "फ़ील्ड देखने के लिए प्रमाणपत्र डिकोड करें",
        "Decodifica un certificado para ver sus campos",
        "Décodez un certificat pour voir ses champs",
        "Zertifikat dekodieren, um die Felder zu sehen",
        "証明書をデコードして各項目を表示します",
        "解码证书以查看字段",
        "فك ترميز شهادة لعرض حقولها"
    ],
    "Paste a certificate in the input area above": [
        "ऊपर इनपुट में प्रमाणपत्र पेस्ट करें",
        "Pega un certificado en la entrada superior",
        "Collez un certificat dans la zone ci-dessus",
        "Zertifikat oben in den Eingabebereich einfügen",
        "上の入力欄に証明書を貼り付けてください",
        "请在上方输入区域粘贴证书",
        "الصق شهادة في منطقة الإدخال أعلاه"
    ],
    "Could not parse certificate": [
        "प्रमाणपत्र पार्स नहीं हुआ",
        "No se pudo analizar el certificado",
        "Impossible d’analyser le certificat",
        "Zertifikat konnte nicht gelesen werden",
        "証明書を解析できませんでした",
        "无法解析证书",
        "تعذر تحليل الشهادة"
    ],
    "Failed to parse certificate": [
        "प्रमाणपत्र पार्स करना विफल",
        "Error al analizar el certificado",
        "Échec de l’analyse du certificat",
        "Zertifikatsanalyse fehlgeschlagen",
        "証明書の解析に失敗しました",
        "证书解析失败",
        "فشل تحليل الشهادة"
    ],
    "Compute Fingerprints": [
        "फिंगरप्रिंट निकालें",
        "Calcular huellas digitales",
        "Calculer les empreintes",
        "Fingerabdrücke berechnen",
        "フィンガープリントを計算",
        "计算指纹",
        "حساب البصمات"
    ],
    "Expired": [
        "समाप्त",
        "Caducado",
        "Expiré",
        "Abgelaufen",
        "期限切れ",
        "已过期",
        "منتهية الصلاحية"
    ],
    "expired": [
        "समाप्त",
        "caducado",
        "expiré",
        "abgelaufen",
        "期限切れ",
        "已过期",
        "منتهية الصلاحية"
    ],
    "recommended": [
        "अनुशंसित",
        "recomendado",
        "recommandé",
        "empfohlen",
        "推奨",
        "推荐",
        "موصى به"
    ],
    "SHA-256 copied": [
        "SHA-256 कॉपी हुआ",
        "SHA-256 copiado",
        "SHA-256 copié",
        "SHA-256 kopiert",
        "SHA-256をコピーしました",
        "已复制 SHA-256",
        "تم نسخ SHA-256"
    ],
    "Plain hex copied": [
        "सादा hex कॉपी हुआ",
        "Hexadecimal simple copiado",
        "Hexadécimal brut copié",
        "Reiner Hexwert kopiert",
        "区切りなしの16進数をコピーしました",
        "已复制纯十六进制",
        "تم نسخ القيمة السداسية"
    ],
    "plain": [
        "सादा",
        "simple",
        "brut",
        "rein",
        "区切りなし",
        "纯值",
        "بسيط"
    ],
    "SHA-1 copied": [
        "SHA-1 कॉपी हुआ",
        "SHA-1 copiado",
        "SHA-1 copié",
        "SHA-1 kopiert",
        "SHA-1をコピーしました",
        "已复制 SHA-1",
        "تم نسخ SHA-1"
    ],
    "legacy": [
        "पुराना",
        "heredado",
        "ancien",
        "veraltet",
        "旧方式",
        "旧式",
        "قديم"
    ],
    "MD5 copied": [
        "MD5 कॉपी हुआ",
        "MD5 copiado",
        "MD5 copié",
        "MD5 kopiert",
        "MD5をコピーしました",
        "已复制 MD5",
        "تم نسخ MD5"
    ],
    "Compute fingerprints to view results": [
        "परिणाम देखने के लिए फिंगरप्रिंट निकालें",
        "Calcula las huellas para ver resultados",
        "Calculez les empreintes pour afficher les résultats",
        "Fingerabdrücke berechnen, um Ergebnisse anzuzeigen",
        "フィンガープリントを計算して結果を表示します",
        "计算指纹以查看结果",
        "احسب البصمات لعرض النتائج"
    ],
    "Paste or upload a certificate in the input area above": [
        "ऊपर प्रमाणपत्र पेस्ट या अपलोड करें",
        "Pega o sube un certificado en la entrada superior",
        "Collez ou importez un certificat ci-dessus",
        "Zertifikat oben einfügen oder hochladen",
        "上の入力欄に証明書を貼り付けるかアップロードしてください",
        "请在上方粘贴或上传证书",
        "الصق شهادة أو ارفعها في منطقة الإدخال أعلاه"
    ],
    "Converted to {format}": [
        "{format} में बदला गया",
        "Convertido a {format}",
        "Converti en {format}",
        "In {format} konvertiert",
        "{format}に変換しました",
        "已转换为 {format}",
        "تم التحويل إلى {format}"
    ],
    "Conversion failed": [
        "रूपांतरण विफल",
        "Error de conversión",
        "Échec de la conversion",
        "Konvertierung fehlgeschlagen",
        "変換に失敗しました",
        "转换失败",
        "فشل التحويل"
    ],
    "Convert to:": [
        "इसमें बदलें:",
        "Convertir a:",
        "Convertir en :",
        "Konvertieren in:",
        "変換先：",
        "转换为：",
        "التحويل إلى:"
    ],
    "bits": [
        "बिट",
        "bits",
        "bits",
        "Bit",
        "ビット",
        "位",
        "بت"
    ],
    "Output copied": [
        "आउटपुट कॉपी हुआ",
        "Resultado copiado",
        "Résultat copié",
        "Ausgabe kopiert",
        "出力をコピーしました",
        "已复制输出",
        "تم نسخ الناتج"
    ],
    "Choose a format and click Convert": [
        "प्रारूप चुनकर बदलें दबाएँ",
        "Elige un formato y pulsa Convertir",
        "Choisissez un format puis Convertir",
        "Format wählen und Konvertieren anklicken",
        "形式を選び、変換をクリックしてください",
        "选择格式并点击转换",
        "اختر تنسيقًا ثم اضغط تحويل"
    ],
    "Subject: {subject}": [
        "विषय: {subject}",
        "Sujeto: {subject}",
        "Sujet : {subject}",
        "Subjekt: {subject}",
        "サブジェクト：{subject}",
        "主体：{subject}",
        "الموضوع: {subject}"
    ],
    "CSR for: {subject}": [
        "इसके लिए CSR: {subject}",
        "CSR para: {subject}",
        "CSR pour : {subject}",
        "CSR für: {subject}",
        "CSRの対象：{subject}",
        "CSR 主体：{subject}",
        "CSR لـ: {subject}"
    ],
    "{algorithm} private key ({bits} bits)": [
        "{algorithm} निजी कुंजी ({bits} बिट)",
        "Clave privada {algorithm} ({bits} bits)",
        "Clé privée {algorithm} ({bits} bits)",
        "Privater {algorithm}-Schlüssel ({bits} Bit)",
        "{algorithm}秘密鍵（{bits}ビット）",
        "{algorithm} 私钥（{bits} 位）",
        "مفتاح خاص {algorithm} ({bits} بت)"
    ],
    "{algorithm} public key ({bits} bits)": [
        "{algorithm} सार्वजनिक कुंजी ({bits} बिट)",
        "Clave pública {algorithm} ({bits} bits)",
        "Clé publique {algorithm} ({bits} bits)",
        "Öffentlicher {algorithm}-Schlüssel ({bits} Bit)",
        "{algorithm}公開鍵（{bits}ビット）",
        "{algorithm} 公钥（{bits} 位）",
        "مفتاح عام {algorithm} ({bits} بت)"
    ],
    "Key Size": [
        "कुंजी आकार",
        "Tamaño de clave",
        "Taille de clé",
        "Schlüssellänge",
        "鍵長",
        "密钥长度",
        "حجم المفتاح"
    ],
    "Block Length": [
        "ब्लॉक की लंबाई",
        "Longitud del bloque",
        "Longueur du bloc",
        "Blocklänge",
        "ブロック長",
        "块长度",
        "طول الكتلة"
    ],
    "chars": [
        "अक्षर",
        "caracteres",
        "caractères",
        "Zeichen",
        "文字",
        "字符",
        "محارف"
    ],
    "Raw DER bytes: {count} (unrecognised label)": [
        "मूल DER बाइट: {count} (अज्ञात लेबल)",
        "Bytes DER sin procesar: {count} (etiqueta desconocida)",
        "Octets DER bruts : {count} (libellé inconnu)",
        "DER-Rohbytes: {count} (unbekannte Bezeichnung)",
        "生DERバイト数：{count}（未知のラベル）",
        "原始 DER 字节：{count}（未知标签）",
        "بايتات DER الخام: {count} (تسمية غير معروفة)"
    ],
    "No specific parser for PEM label {label}. Decoded length: {count} bytes.": [
        "PEM लेबल {label} का विशेष पार्सर नहीं है। डिकोड लंबाई: {count} बाइट।",
        "No hay analizador específico para {label}. Longitud decodificada: {count} bytes.",
        "Aucun analyseur spécifique pour {label}. Longueur décodée : {count} octets.",
        "Kein eigener Parser für PEM-Bezeichnung {label}. Dekodierte Länge: {count} Byte.",
        "PEMラベル{label}専用のパーサーはありません。デコード後の長さ：{count}バイト。",
        "没有 PEM 标签 {label} 的专用解析器。解码长度：{count} 字节。",
        "لا يوجد محلل مخصص لتسمية PEM ‏{label}. الطول بعد فك الترميز: {count} بايت."
    ],
    "Paste PEM data in the input area above": [
        "ऊपर PEM डेटा पेस्ट करें",
        "Pega datos PEM en la entrada superior",
        "Collez les données PEM ci-dessus",
        "PEM-Daten oben einfügen",
        "上の入力欄にPEMデータを貼り付けてください",
        "请在上方粘贴 PEM 数据",
        "الصق بيانات PEM في منطقة الإدخال أعلاه"
    ],
    "No PEM blocks found in input": [
        "इनपुट में PEM ब्लॉक नहीं मिले",
        "No se encontraron bloques PEM",
        "Aucun bloc PEM trouvé",
        "Keine PEM-Blöcke gefunden",
        "入力にPEMブロックがありません",
        "输入中未找到 PEM 块",
        "لم يتم العثور على كتل PEM في الإدخال"
    ],
    "PEM blocks parsed: {count}": [
        "पार्स हुए PEM ब्लॉक: {count}",
        "Bloques PEM analizados: {count}",
        "Blocs PEM analysés : {count}",
        "Analysierte PEM-Blöcke: {count}",
        "解析したPEMブロック：{count}",
        "已解析 PEM 块：{count}",
        "كتل PEM المحللة: {count}"
    ],
    "Parse PEM Blocks": [
        "PEM ब्लॉक पार्स करें",
        "Analizar bloques PEM",
        "Analyser les blocs PEM",
        "PEM-Blöcke analysieren",
        "PEMブロックを解析",
        "解析 PEM 块",
        "تحليل كتل PEM"
    ],
    "Parse PEM to see all blocks": [
        "सभी ब्लॉक देखने के लिए PEM पार्स करें",
        "Analiza PEM para ver todos los bloques",
        "Analysez le PEM pour voir tous les blocs",
        "PEM analysieren, um alle Blöcke zu sehen",
        "PEMを解析してすべてのブロックを表示します",
        "解析 PEM 以查看所有块",
        "حلل PEM لعرض جميع الكتل"
    ],
    "Enter a hostname or URL": [
        "होस्टनाम या URL दें",
        "Introduce un host o URL",
        "Saisissez un nom d’hôte ou une URL",
        "Hostnamen oder URL eingeben",
        "ホスト名またはURLを入力してください",
        "请输入主机名或 URL",
        "أدخل اسم مضيف أو URL"
    ],
    "Could not parse hostname": [
        "होस्टनाम पढ़ा नहीं जा सका",
        "No se pudo analizar el host",
        "Impossible d’analyser le nom d’hôte",
        "Hostname konnte nicht gelesen werden",
        "ホスト名を解析できませんでした",
        "无法解析主机名",
        "تعذر تحليل اسم المضيف"
    ],
    "Certificates fetched from {host}: {count}": [
        "{host} से मिले प्रमाणपत्र: {count}",
        "Certificados obtenidos de {host}: {count}",
        "Certificats récupérés depuis {host} : {count}",
        "Von {host} abgerufene Zertifikate: {count}",
        "{host}から取得した証明書：{count}",
        "从 {host} 获取的证书：{count}",
        "الشهادات المسترجعة من {host}: {count}"
    ],
    "Failed to fetch certificate": [
        "प्रमाणपत्र प्राप्त नहीं हुआ",
        "Error al obtener el certificado",
        "Échec de récupération du certificat",
        "Zertifikat konnte nicht abgerufen werden",
        "証明書の取得に失敗しました",
        "证书获取失败",
        "فشل جلب الشهادة"
    ],
    "Certificate Input": [
        "प्रमाणपत्र इनपुट",
        "Entrada de certificado",
        "Certificat en entrée",
        "Zertifikateingabe",
        "証明書の入力",
        "证书输入",
        "إدخال الشهادة"
    ],
    "Upload": [
        "अपलोड करें",
        "Subir",
        "Importer",
        "Hochladen",
        "アップロード",
        "上传",
        "رفع"
    ],
    "Paste PEM-encoded or base64-DER certificate (or multiple PEM blocks)": [
        "PEM या base64-DER प्रमाणपत्र (या कई PEM ब्लॉक) पेस्ट करें",
        "Pega un certificado PEM o DER en base64 (o varios bloques PEM)",
        "Collez un certificat PEM ou DER en base64 (ou plusieurs blocs PEM)",
        "PEM- oder Base64-DER-Zertifikat einfügen (auch mehrere PEM-Blöcke)",
        "PEM形式またはBase64 DER形式の証明書（複数のPEMブロックも可）を貼り付けます",
        "粘贴 PEM 或 base64-DER 证书（可含多个 PEM 块）",
        "الصق شهادة PEM أو DER بترميز base64 (أو عدة كتل PEM)"
    ],
    "Fetch": [
        "प्राप्त करें",
        "Obtener",
        "Récupérer",
        "Abrufen",
        "取得",
        "获取",
        "جلب"
    ],
    "PEM Parser": [
        "PEM पार्सर",
        "Analizador PEM",
        "Analyseur PEM",
        "PEM-Parser",
        "PEMパーサー",
        "PEM 解析器",
        "محلل PEM"
    ],
    "Fetch failed": [
        "प्राप्त करना विफल",
        "Error al obtener",
        "Échec de récupération",
        "Abruf fehlgeschlagen",
        "取得に失敗しました",
        "获取失败",
        "فشل الجلب"
    ],
    "Enter URL or Hostname": [
        "URL या होस्टनाम दें",
        "Introduce URL o host",
        "Saisissez une URL ou un hôte",
        "URL oder Hostnamen eingeben",
        "URLまたはホスト名を入力",
        "输入 URL 或主机名",
        "أدخل URL أو اسم مضيف"
    ],
    "Inspect": [
        "निरीक्षण करें",
        "Inspeccionar",
        "Inspecter",
        "Prüfen",
        "検査",
        "检查",
        "فحص"
    ],
    "After fetching, selected chain and signature checks run locally. Browser trust, revocation and hostname verification are not performed.": [
        "प्राप्ति के बाद चुनी हुई श्रृंखला और हस्ताक्षर जाँच स्थानीय होती हैं। ब्राउज़र भरोसा, निरस्तीकरण और होस्टनाम की जाँच नहीं होती।",
        "Tras obtenerla, se comprueban localmente la cadena y ciertas firmas. No se verifica confianza del navegador, revocación ni host.",
        "Après récupération, certains contrôles de chaîne et de signature sont locaux. Confiance du navigateur, révocation et nom d’hôte ne sont pas vérifiés.",
        "Nach dem Abruf erfolgen ausgewählte Ketten- und Signaturprüfungen lokal. Browser-Vertrauen, Sperrstatus und Hostname werden nicht geprüft.",
        "取得後、選択したチェーンと署名の検査をローカルで実行します。ブラウザーの信頼、失効、ホスト名の検証は行いません。",
        "获取后会在本地执行部分证书链和签名检查，不验证浏览器信任、吊销状态或主机名。",
        "بعد الجلب، تُجرى فحوص محددة للسلسلة والتوقيع محليًا. لا يتم التحقق من ثقة المتصفح أو الإلغاء أو اسم المضيف."
    ],
    "Enter a URL to inspect its certificate chain": [
        "श्रृंखला जाँचने के लिए URL दें",
        "Introduce una URL para inspeccionar su cadena",
        "Saisissez une URL pour inspecter sa chaîne",
        "URL eingeben, um die Zertifikatskette zu prüfen",
        "URLを入力して証明書チェーンを検査します",
        "输入 URL 以检查其证书链",
        "أدخل URL لفحص سلسلة شهاداته"
    ],
    "Evaluated checks passed: {count} certificates from {host}": [
        "चुनी हुई जाँच पास: {host} के {count} प्रमाणपत्र",
        "Comprobaciones superadas: {count} certificados de {host}",
        "Contrôles effectués réussis : {count} certificats de {host}",
        "Ausgeführte Prüfungen bestanden: {count} Zertifikate von {host}",
        "実行した検査に合格：{host}の証明書{count}件",
        "已执行的检查通过：{host} 的 {count} 个证书",
        "نجحت الفحوص المجراة: {count} شهادة من {host}"
    ],
    "Chain issues: {count}": [
        "श्रृंखला समस्याएँ: {count}",
        "Problemas de cadena: {count}",
        "Problèmes de chaîne : {count}",
        "Kettenprobleme: {count}",
        "チェーンの問題：{count}",
        "证书链问题：{count}",
        "مشكلات السلسلة: {count}"
    ],
    "Leaf": [
        "अंतिम प्रमाणपत्र",
        "Certificado final",
        "Certificat final",
        "Endzertifikat",
        "リーフ",
        "叶证书",
        "الشهادة الطرفية"
    ],
    "Root CA": [
        "रूट CA",
        "CA raíz",
        "CA racine",
        "Stamm-CA",
        "ルートCA",
        "根 CA",
        "المرجع الجذري"
    ],
    "Top of chain": [
        "श्रृंखला शीर्ष",
        "Extremo de cadena",
        "Sommet de chaîne",
        "Kettenende",
        "チェーンの上位",
        "链顶端",
        "أعلى السلسلة"
    ],
    "Intermediate": [
        "मध्यवर्ती",
        "Intermedio",
        "Intermédiaire",
        "Zwischenzertifikat",
        "中間",
        "中间证书",
        "وسيطة"
    ],
    "Certificate {number}": [
        "प्रमाणपत्र {number}",
        "Certificado {number}",
        "Certificat {number}",
        "Zertifikat {number}",
        "証明書{number}",
        "证书 {number}",
        "الشهادة {number}"
    ],
    "EXPIRED": [
        "समाप्त",
        "CADUCADO",
        "EXPIRÉ",
        "ABGELAUFEN",
        "期限切れ",
        "已过期",
        "منتهية الصلاحية"
    ],
    "Serial": [
        "क्रम संख्या",
        "Serie",
        "Numéro de série",
        "Seriennummer",
        "シリアル",
        "序列号",
        "الرقم التسلسلي"
    ],
    "{days} days left": [
        "{days} दिन शेष",
        "Quedan {days} días",
        "{days} jours restants",
        "Noch {days} Tage",
        "残り{days}日",
        "剩余 {days} 天",
        "متبقٍ {days} يومًا"
    ],
    "CA": [
        "प्रमाणन प्राधिकरण",
        "Autoridad certificadora",
        "Autorité de certification",
        "Zertifizierungsstelle",
        "認証局",
        "证书颁发机构",
        "المرجع المصدّق"
    ],
    "Key Usage:": [
        "कुंजी उपयोग:",
        "Uso de clave:",
        "Usage de la clé :",
        "Schlüsselverwendung:",
        "鍵用途：",
        "密钥用途：",
        "استخدام المفتاح:"
    ],
    "Extended:": [
        "विस्तारित:",
        "Extendido:",
        "Étendu :",
        "Erweitert:",
        "拡張：",
        "扩展：",
        "موسع:"
    ],
    "Could not parse this certificate": [
        "यह प्रमाणपत्र पार्स नहीं हुआ",
        "No se pudo analizar este certificado",
        "Impossible d’analyser ce certificat",
        "Dieses Zertifikat konnte nicht gelesen werden",
        "この証明書を解析できませんでした",
        "无法解析此证书",
        "تعذر تحليل هذه الشهادة"
    ],
    "Paste at least one certificate": [
        "कम से कम एक प्रमाणपत्र पेस्ट करें",
        "Pega al menos un certificado",
        "Collez au moins un certificat",
        "Mindestens ein Zertifikat einfügen",
        "少なくとも1つの証明書を貼り付けてください",
        "请至少粘贴一个证书",
        "الصق شهادة واحدة على الأقل"
    ],
    "No CERTIFICATE PEM blocks found": [
        "CERTIFICATE PEM ब्लॉक नहीं मिले",
        "No hay bloques PEM CERTIFICATE",
        "Aucun bloc PEM CERTIFICATE trouvé",
        "Keine CERTIFICATE-PEM-Blöcke gefunden",
        "CERTIFICATE PEMブロックがありません",
        "未找到 CERTIFICATE PEM 块",
        "لم يتم العثور على كتل PEM من نوع CERTIFICATE"
    ],
    "Evaluated chain checks passed": [
        "चुनी हुई श्रृंखला जाँच पास",
        "Comprobaciones de cadena superadas",
        "Contrôles de chaîne effectués réussis",
        "Ausgeführte Kettenprüfungen bestanden",
        "実行したチェーン検査に合格",
        "已执行的证书链检查通过",
        "نجحت فحوص السلسلة المجراة"
    ],
    "Validation failed": [
        "सत्यापन विफल",
        "Validación fallida",
        "Échec de validation",
        "Prüfung fehlgeschlagen",
        "検証に失敗しました",
        "验证失败",
        "فشل التحقق"
    ],
    "Enter a hostname": [
        "होस्टनाम दें",
        "Introduce un host",
        "Saisissez un nom d’hôte",
        "Hostnamen eingeben",
        "ホスト名を入力してください",
        "请输入主机名",
        "أدخل اسم مضيف"
    ],
    "Fetch from URL": [
        "URL से प्राप्त करें",
        "Obtener desde URL",
        "Récupérer depuis une URL",
        "Von URL abrufen",
        "URLから取得",
        "从 URL 获取",
        "الجلب من URL"
    ],
    "After fetching, selected chain checks run in your browser.": [
        "प्राप्ति के बाद चुनी हुई श्रृंखला जाँच ब्राउज़र में होती हैं।",
        "Tras obtenerla, ciertas comprobaciones se realizan en el navegador.",
        "Après récupération, certains contrôles de chaîne sont effectués dans le navigateur.",
        "Nach dem Abruf erfolgen ausgewählte Kettenprüfungen im Browser.",
        "取得後、選択したチェーン検査をブラウザー内で実行します。",
        "获取后会在浏览器中执行部分证书链检查。",
        "بعد الجلب، تُجرى فحوص محددة للسلسلة في المتصفح."
    ],
    "Certificate Chain (PEM, leaf first)": [
        "प्रमाणपत्र श्रृंखला (PEM, अंतिम प्रमाणपत्र पहले)",
        "Cadena de certificados (PEM, final primero)",
        "Chaîne de certificats (PEM, final en premier)",
        "Zertifikatskette (PEM, Endzertifikat zuerst)",
        "証明書チェーン（PEM、リーフから順に）",
        "证书链（PEM，叶证书在前）",
        "سلسلة الشهادات (PEM، الطرفية أولًا)"
    ],
    "Sample": [
        "नमूना",
        "Ejemplo",
        "Exemple",
        "Beispiel",
        "サンプル",
        "示例",
        "مثال"
    ],
    "Concatenated PEM certificates": [
        "जुड़े हुए PEM प्रमाणपत्र",
        "Certificados PEM concatenados",
        "Certificats PEM concaténés",
        "Aneinandergehängte PEM-Zertifikate",
        "連結したPEM証明書",
        "拼接的 PEM 证书",
        "شهادات PEM متسلسلة"
    ],
    "Validate Chain": [
        "श्रृंखला जाँचें",
        "Validar cadena",
        "Vérifier la chaîne",
        "Kette prüfen",
        "チェーンを検証",
        "验证证书链",
        "التحقق من السلسلة"
    ],
    "Validate a chain to see results": [
        "परिणाम देखने के लिए श्रृंखला जाँचें",
        "Valida una cadena para ver resultados",
        "Vérifiez une chaîne pour voir les résultats",
        "Kette prüfen, um Ergebnisse anzuzeigen",
        "チェーンを検証して結果を表示します",
        "验证证书链以查看结果",
        "تحقق من سلسلة لعرض النتائج"
    ],
    "Issued by": [
        "जारीकर्ता",
        "Emitido por",
        "Émis par",
        "Ausgestellt von",
        "発行者",
        "颁发者",
        "صادرة عن"
    ],
    "Public key": [
        "सार्वजनिक कुंजी",
        "Clave pública",
        "Clé publique",
        "Öffentlicher Schlüssel",
        "公開鍵",
        "公钥",
        "المفتاح العام"
    ],
    "Valid until": [
        "समाप्ति तिथि",
        "Válido hasta",
        "Valide jusqu’au",
        "Gültig bis",
        "有効期限",
        "有效期截止",
        "صالحة حتى"
    ],
    "Live Server Check": [
        "लाइव सर्वर जाँच",
        "Comprobar servidor",
        "Vérifier le serveur actif",
        "Live-Server prüfen",
        "稼働中サーバーの検査",
        "在线服务器检查",
        "فحص الخادم المباشر"
    ],
    "Chain Validator": [
        "श्रृंखला सत्यापक",
        "Validador de cadenas",
        "Vérificateur de chaîne",
        "Kettenprüfung",
        "チェーン検証",
        "证书链验证器",
        "مدقق السلسلة"
    ],
    "Read PKCS#12": [
        "PKCS#12 पढ़ें",
        "Leer PKCS#12",
        "Lire PKCS#12",
        "PKCS#12 lesen",
        "PKCS#12を読み込む",
        "读取 PKCS#12",
        "قراءة PKCS#12"
    ],
    "Create PKCS#12": [
        "PKCS#12 बनाएँ",
        "Crear PKCS#12",
        "Créer PKCS#12",
        "PKCS#12 erstellen",
        "PKCS#12を作成",
        "创建 PKCS#12",
        "إنشاء PKCS#12"
    ],
    "Upload a .p12 / .pfx file first": [
        "पहले .p12 / .pfx फ़ाइल अपलोड करें",
        "Sube primero un archivo .p12 / .pfx",
        "Importez d’abord un fichier .p12 / .pfx",
        "Zuerst eine .p12-/.pfx-Datei hochladen",
        "先に.p12／.pfxファイルをアップロードしてください",
        "请先上传 .p12 / .pfx 文件",
        "ارفع ملف .p12 / .pfx أولًا"
    ],
    "PKCS#12 unlocked": [
        "PKCS#12 अनलॉक हुआ",
        "PKCS#12 desbloqueado",
        "PKCS#12 déverrouillé",
        "PKCS#12 entsperrt",
        "PKCS#12のロックを解除しました",
        "已解锁 PKCS#12",
        "تم فتح PKCS#12"
    ],
    "Upload .p12 or .pfx": [
        ".p12 या .pfx अपलोड करें",
        "Subir .p12 o .pfx",
        "Importer .p12 ou .pfx",
        ".p12 oder .pfx hochladen",
        ".p12または.pfxをアップロード",
        "上传 .p12 或 .pfx",
        "رفع .p12 أو .pfx"
    ],
    "Keystore password (empty if none)": [
        "कीस्टोर पासवर्ड (न हो तो खाली)",
        "Contraseña del almacén (vacío si no tiene)",
        "Mot de passe du magasin (vide si aucun)",
        "Keystore-Passwort (leer, falls keines)",
        "キーストアのパスワード（なければ空欄）",
        "密钥库密码（没有则留空）",
        "كلمة مرور مخزن المفاتيح (اتركها فارغة إن لم توجد)"
    ],
    "Unlock & Inspect": [
        "अनलॉक और निरीक्षण करें",
        "Desbloquear e inspeccionar",
        "Déverrouiller et inspecter",
        "Entsperren und prüfen",
        "ロック解除して検査",
        "解锁并检查",
        "فتح وفحص"
    ],
    "Wrong password": [
        "गलत पासवर्ड",
        "Contraseña incorrecta",
        "Mot de passe incorrect",
        "Falsches Passwort",
        "パスワードが違います",
        "密码错误",
        "كلمة مرور خاطئة"
    ],
    "Failed to read keystore": [
        "कीस्टोर पढ़ना विफल",
        "Error al leer el almacén",
        "Impossible de lire le magasin",
        "Keystore konnte nicht gelesen werden",
        "キーストアの読み込みに失敗しました",
        "密钥库读取失败",
        "فشلت قراءة مخزن المفاتيح"
    ],
    "Cert:": [
        "प्रमाणपत्र:",
        "Certificado:",
        "Certificat :",
        "Zertifikat:",
        "証明書：",
        "证书：",
        "الشهادة:"
    ],
    "Private key": [
        "निजी कुंजी",
        "Clave privada",
        "Clé privée",
        "Privater Schlüssel",
        "秘密鍵",
        "私钥",
        "المفتاح الخاص"
    ],
    "Chain certificates: {count}": [
        "श्रृंखला प्रमाणपत्र: {count}",
        "Certificados de cadena: {count}",
        "Certificats de chaîne : {count}",
        "Kettenzertifikate: {count}",
        "チェーン内の証明書：{count}",
        "链中证书：{count}",
        "شهادات السلسلة: {count}"
    ],
    "Friendly:": [
        "पहचान नाम:",
        "Nombre:",
        "Nom convivial :",
        "Anzeigename:",
        "表示名：",
        "友好名称：",
        "الاسم الودي:"
    ],
    "Leaf Certificate": [
        "अंतिम प्रमाणपत्र",
        "Certificado final",
        "Certificat final",
        "Endzertifikat",
        "リーフ証明書",
        "叶证书",
        "الشهادة الطرفية"
    ],
    "SHA-256 Fingerprint": [
        "SHA-256 फिंगरप्रिंट",
        "Huella SHA-256",
        "Empreinte SHA-256",
        "SHA-256-Fingerabdruck",
        "SHA-256フィンガープリント",
        "SHA-256 指纹",
        "بصمة SHA-256"
    ],
    "Download cert PEM": [
        "प्रमाणपत्र PEM डाउनलोड करें",
        "Descargar certificado PEM",
        "Télécharger le certificat PEM",
        "Zertifikat als PEM herunterladen",
        "証明書PEMをダウンロード",
        "下载证书 PEM",
        "تنزيل الشهادة PEM"
    ],
    "Private Key": [
        "निजी कुंजी",
        "Clave privada",
        "Clé privée",
        "Privater Schlüssel",
        "秘密鍵",
        "私钥",
        "المفتاح الخاص"
    ],
    "⚠ keep secret": [
        "गोपनीय रखें",
        "mantener en secreto",
        "garder secret",
        "geheim halten",
        "秘密に保管",
        "请保密",
        "احتفظ به سرًا"
    ],
    "Private key copied": [
        "निजी कुंजी कॉपी हुई",
        "Clave privada copiada",
        "Clé privée copiée",
        "Privater Schlüssel kopiert",
        "秘密鍵をコピーしました",
        "已复制私钥",
        "تم نسخ المفتاح الخاص"
    ],
    "Download .key": [
        ".key डाउनलोड करें",
        "Descargar .key",
        "Télécharger .key",
        ".key herunterladen",
        ".keyをダウンロード",
        "下载 .key",
        "تنزيل .key"
    ],
    "Chain ({count})": [
        "श्रृंखला ({count})",
        "Cadena ({count})",
        "Chaîne ({count})",
        "Kette ({count})",
        "チェーン（{count}）",
        "证书链（{count}）",
        "السلسلة ({count})"
    ],
    "Chain certificate {number}": [
        "श्रृंखला प्रमाणपत्र {number}",
        "Certificado de cadena {number}",
        "Certificat de chaîne {number}",
        "Kettenzertifikat {number}",
        "チェーン証明書{number}",
        "链证书 {number}",
        "شهادة السلسلة {number}"
    ],
    "— issued by": [
        "— जारीकर्ता",
        "— emitido por",
        "— émis par",
        "— ausgestellt von",
        "— 発行者",
        "— 颁发者",
        "— صادرة عن"
    ],
    "Provide both a certificate and a private key": [
        "प्रमाणपत्र और निजी कुंजी दोनों दें",
        "Proporciona un certificado y una clave privada",
        "Fournissez un certificat et une clé privée",
        "Zertifikat und privaten Schlüssel angeben",
        "証明書と秘密鍵の両方を指定してください",
        "请提供证书和私钥",
        "قدم الشهادة والمفتاح الخاص معًا"
    ],
    "Set a keystore password": [
        "कीस्टोर पासवर्ड सेट करें",
        "Establece una contraseña del almacén",
        "Définissez un mot de passe du magasin",
        "Keystore-Passwort festlegen",
        "キーストアのパスワードを設定してください",
        "请设置密钥库密码",
        "عيّن كلمة مرور لمخزن المفاتيح"
    ],
    "Generated {filename}": [
        "{filename} बनाया गया",
        "Generado {filename}",
        "{filename} généré",
        "{filename} erstellt",
        "{filename}を生成しました",
        "已生成 {filename}",
        "تم إنشاء {filename}"
    ],
    "Failed to create PKCS#12": [
        "PKCS#12 बनाना विफल",
        "Error al crear PKCS#12",
        "Échec de création PKCS#12",
        "PKCS#12-Erstellung fehlgeschlagen",
        "PKCS#12の作成に失敗しました",
        "PKCS#12 创建失败",
        "فشل إنشاء PKCS#12"
    ],
    "Certificate (PEM)": [
        "प्रमाणपत्र (PEM)",
        "Certificado (PEM)",
        "Certificat (PEM)",
        "Zertifikat (PEM)",
        "証明書（PEM）",
        "证书（PEM）",
        "الشهادة (PEM)"
    ],
    "Chain Certificates (optional, PEM, can be multiple concatenated)": [
        "श्रृंखला प्रमाणपत्र (वैकल्पिक, PEM, कई जोड़ सकते हैं)",
        "Certificados de cadena (opcionales, PEM, varios concatenados)",
        "Certificats de chaîne (facultatifs, PEM, plusieurs concaténés)",
        "Kettenzertifikate (optional, PEM, mehrere möglich)",
        "チェーン証明書（省略可、複数PEMの連結も可）",
        "证书链（可选，PEM，可拼接多个）",
        "شهادات السلسلة (اختيارية، PEM، يمكن ربط عدة شهادات)"
    ],
    "Intermediate CAs and root CA, in order": [
        "मध्यवर्ती CA और रूट CA, क्रम में",
        "CA intermedias y raíz, en orden",
        "CA intermédiaires et racine, dans l’ordre",
        "Zwischen- und Stamm-CA in Reihenfolge",
        "中間CAとルートCAを順番に入力",
        "按顺序输入中间 CA 和根 CA",
        "المراجع الوسيطة والجذرية بالترتيب"
    ],
    "Friendly Name": [
        "पहचान नाम",
        "Nombre descriptivo",
        "Nom convivial",
        "Anzeigename",
        "表示名",
        "友好名称",
        "الاسم الودي"
    ],
    "Keystore password": [
        "कीस्टोर पासवर्ड",
        "Contraseña del almacén",
        "Mot de passe du magasin",
        "Keystore-Passwort",
        "キーストアのパスワード",
        "密钥库密码",
        "كلمة مرور مخزن المفاتيح"
    ],
    "Create & Download .p12": [
        ".p12 बनाएँ और डाउनलोड करें",
        "Crear y descargar .p12",
        "Créer et télécharger .p12",
        ".p12 erstellen und herunterladen",
        ".p12を作成してダウンロード",
        "创建并下载 .p12",
        "إنشاء وتنزيل .p12"
    ],
    "Key pair generated successfully!": [
        "कुंजी जोड़ी बन गई!",
        "¡Par de claves generado!",
        "Paire de clés générée !",
        "Schlüsselpaar erstellt!",
        "鍵ペアを生成しました！",
        "密钥对生成成功！",
        "تم إنشاء زوج المفاتيح بنجاح!"
    ],
    "Key pair generation failed": [
        "कुंजी जोड़ी बनाना विफल",
        "Error al generar el par de claves",
        "Échec de génération de la paire de clés",
        "Schlüsselpaar-Erstellung fehlgeschlagen",
        "鍵ペアの生成に失敗しました",
        "密钥对生成失败",
        "فشل إنشاء زوج المفاتيح"
    ],
    "Could not generate {algorithm} key pair in {format} format.": [
        "{format} प्रारूप में {algorithm} कुंजी जोड़ी नहीं बनी।",
        "No se pudo generar el par {algorithm} en formato {format}.",
        "Impossible de générer une paire {algorithm} au format {format}.",
        "{algorithm}-Schlüsselpaar im Format {format} konnte nicht erstellt werden.",
        "{algorithm}鍵ペアを{format}形式で生成できませんでした。",
        "无法生成 {format} 格式的 {algorithm} 密钥对。",
        "تعذر إنشاء زوج مفاتيح {algorithm} بتنسيق {format}."
    ],
    "Try RSA 2048 or ECDSA P-256 — the most widely supported across browsers.": [
        "ब्राउज़र में व्यापक समर्थन वाले RSA 2048 या ECDSA P-256 आज़माएँ।",
        "Prueba RSA 2048 o ECDSA P-256, ampliamente compatibles.",
        "Essayez RSA 2048 ou ECDSA P-256, largement pris en charge.",
        "RSA 2048 oder ECDSA P-256 versuchen; beide sind breit unterstützt.",
        "幅広いブラウザーで対応しているRSA 2048またはECDSA P-256を試してください。",
        "请尝试浏览器广泛支持的 RSA 2048 或 ECDSA P-256。",
        "جرّب RSA 2048 أو ECDSA P-256، وهما مدعومان على نطاق واسع."
    ],
    "Ed25519 requires native Web Crypto support. Choose RSA or ECDSA if this browser does not support it.": [
        "Ed25519 के लिए मूल Web Crypto समर्थन चाहिए। समर्थन न हो तो RSA या ECDSA चुनें।",
        "Ed25519 requiere soporte nativo de Web Crypto. Si no está disponible, elige RSA o ECDSA.",
        "Ed25519 nécessite la prise en charge native de Web Crypto. Sinon, choisissez RSA ou ECDSA.",
        "Ed25519 benötigt native Web-Crypto-Unterstützung. Andernfalls RSA oder ECDSA wählen.",
        "Ed25519にはWeb Cryptoのネイティブ対応が必要です。未対応のブラウザーではRSAかECDSAを選んでください。",
        "Ed25519 需要原生 Web Crypto 支持。此浏览器不支持时，请选择 RSA 或 ECDSA。",
        "يتطلب Ed25519 دعمًا أصليًا من Web Crypto. اختر RSA أو ECDSA إذا لم يدعمه المتصفح."
    ],
    "If RSA 4096+ is failing, your browser may be capping key sizes — drop to 2048 or 3072.": [
        "RSA 4096+ विफल हो तो 2048 या 3072 चुनें; ब्राउज़र आकार सीमित कर सकता है।",
        "Si falla RSA 4096+, prueba 2048 o 3072; el navegador puede limitar el tamaño.",
        "Si RSA 4096+ échoue, essayez 2048 ou 3072 ; le navigateur peut limiter la taille.",
        "Falls RSA 4096+ fehlschlägt, 2048 oder 3072 versuchen; der Browser könnte die Größe begrenzen.",
        "RSA 4096以上で失敗する場合、ブラウザーの制限が考えられます。2048か3072を試してください。",
        "如果 RSA 4096 及以上失败，浏览器可能限制密钥长度，请尝试 2048 或 3072。",
        "إذا فشل RSA 4096 أو أكثر، فقد يحد المتصفح الحجم. جرّب 2048 أو 3072."
    ],
    "{label} copied to clipboard!": [
        "{label} क्लिपबोर्ड पर कॉपी हुआ!",
        "¡{label} copiado al portapapeles!",
        "{label} copié dans le presse-papiers !",
        "{label} in die Zwischenablage kopiert!",
        "{label}をクリップボードにコピーしました！",
        "已将{label}复制到剪贴板！",
        "تم نسخ {label} إلى الحافظة!"
    ],
    "ECDSA (Elliptic Curve)": [
        "ECDSA (अण्डाकार वक्र)",
        "ECDSA (curva elíptica)",
        "ECDSA (courbe elliptique)",
        "ECDSA (elliptische Kurve)",
        "ECDSA（楕円曲線）",
        "ECDSA（椭圆曲线）",
        "ECDSA (منحنى إهليلجي)"
    ],
    "Ed25519 (Edwards Curve)": [
        "Ed25519 (एडवर्ड्स वक्र)",
        "Ed25519 (curva de Edwards)",
        "Ed25519 (courbe d’Edwards)",
        "Ed25519 (Edwards-Kurve)",
        "Ed25519（エドワーズ曲線）",
        "Ed25519（爱德华曲线）",
        "Ed25519 (منحنى إدواردز)"
    ],
    "2048 bits (Standard)": [
        "2048 बिट (मानक)",
        "2048 bits (estándar)",
        "2048 bits (standard)",
        "2048 Bit (Standard)",
        "2048ビット（標準）",
        "2048 位（标准）",
        "2048 بت (قياسي)"
    ],
    "3072 bits (Enhanced)": [
        "3072 बिट (उन्नत)",
        "3072 bits (mejorado)",
        "3072 bits (renforcé)",
        "3072 Bit (erweitert)",
        "3072ビット（強化）",
        "3072 位（增强）",
        "3072 بت (محسن)"
    ],
    "4096 bits (Maximum)": [
        "4096 बिट (अधिकतम)",
        "4096 bits (máximo)",
        "4096 bits (maximum)",
        "4096 Bit (Maximum)",
        "4096ビット（最大）",
        "4096 位（最大）",
        "4096 بت (أقصى)"
    ],
    "Generate Key Pair": [
        "कुंजी जोड़ी बनाएँ",
        "Generar par de claves",
        "Générer une paire de clés",
        "Schlüsselpaar erstellen",
        "鍵ペアを生成",
        "生成密钥对",
        "إنشاء زوج مفاتيح"
    ],
    "Keep Secret!": [
        "गुप्त रखें!",
        "¡Mantener en secreto!",
        "À garder secret !",
        "Geheim halten!",
        "秘密にしてください",
        "请保密！",
        "احتفظ به سرًا!"
    ],
    "Organization": [
        "संगठन",
        "Organización",
        "Organisation",
        "Organisation",
        "組織",
        "组织",
        "المؤسسة"
    ],
    "Organizational Unit": [
        "संगठनात्मक इकाई",
        "Unidad organizativa",
        "Unité organisationnelle",
        "Organisationseinheit",
        "組織単位",
        "组织单位",
        "الوحدة التنظيمية"
    ],
    "Locality": [
        "स्थान",
        "Localidad",
        "Localité",
        "Ort",
        "市区町村",
        "地点",
        "المدينة"
    ],
    "State/Province": [
        "राज्य/प्रांत",
        "Estado/provincia",
        "État/province",
        "Bundesland/Provinz",
        "都道府県",
        "州/省",
        "الولاية/المقاطعة"
    ],
    "PEM (text, base64 with header)": [
        "PEM (टेक्स्ट, हेडर सहित base64)",
        "PEM (texto, base64 con cabecera)",
        "PEM (texte, base64 avec en-tête)",
        "PEM (Text, Base64 mit Header)",
        "PEM（ヘッダー付きBase64テキスト）",
        "PEM（带头部的 base64 文本）",
        "PEM (نص base64 مع ترويسة)"
    ],
    "DER (binary, shown as base64)": [
        "DER (बाइनरी, base64 में दिखाया)",
        "DER (binario, mostrado en base64)",
        "DER (binaire, affiché en base64)",
        "DER (binär, als Base64 angezeigt)",
        "DER（バイナリをBase64表示）",
        "DER（二进制，以 base64 显示）",
        "DER (ثنائي، معروض بترميز base64)"
    ],
    "DER (raw binary file)": [
        "DER (मूल बाइनरी फ़ाइल)",
        "DER (archivo binario)",
        "DER (fichier binaire brut)",
        "DER (binäre Rohdatei)",
        "DER（生バイナリファイル）",
        "DER（原始二进制文件）",
        "DER (ملف ثنائي خام)"
    ],
    "Output ({format})": [
        "आउटपुट ({format})",
        "Resultado ({format})",
        "Résultat ({format})",
        "Ausgabe ({format})",
        "出力（{format}）",
        "输出（{format}）",
        "الناتج ({format})"
    ],
    "Decode, fingerprint, convert, and parse X.509 certificates": [
        "X.509 प्रमाणपत्र डिकोड करें, फिंगरप्रिंट निकालें, बदलें और पार्स करें",
        "Decodifica, calcula huellas, convierte y analiza certificados X.509",
        "Décodez, calculez les empreintes, convertissez et analysez les certificats X.509",
        "X.509-Zertifikate dekodieren, Fingerabdrücke berechnen, konvertieren und analysieren",
        "X.509証明書のデコード、指紋計算、変換、解析",
        "解码 X.509 证书、计算指纹、转换与解析",
        "فك ترميز شهادات X.509 وحساب بصماتها وتحويلها وتحليلها"
    ],
    "A comprehensive X.509 certificate inspection suite. Decode certificate fields, compute fingerprints, convert between PEM/DER formats, and parse bundled PEM files — all in one place. Supports live URL fetching to inspect any server's certificate directly.": [
        "एक ही जगह X.509 फ़ील्ड, फिंगरप्रिंट, PEM/DER रूपांतरण और PEM बंडल देखें। URL से सर्वर का प्रमाणपत्र भी प्राप्त कर सकते हैं।",
        "Inspecciona campos X.509, huellas, conversiones PEM/DER y paquetes PEM en un solo lugar. También permite obtener certificados de servidores mediante URL.",
        "Inspectez les champs X.509, empreintes, conversions PEM/DER et lots PEM au même endroit. Vous pouvez aussi récupérer un certificat depuis une URL.",
        "X.509-Felder, Fingerabdrücke, PEM/DER-Konvertierung und PEM-Pakete an einem Ort. Zertifikate lassen sich auch von einer Server-URL abrufen.",
        "X.509の項目、フィンガープリント、PEM/DER変換、PEMバンドルをまとめて検査できます。URLからサーバー証明書を取得することもできます。",
        "在一个工具中查看 X.509 字段、计算指纹、转换 PEM/DER 并解析 PEM 包，也可通过 URL 获取服务器证书。",
        "افحص حقول X.509 والبصمات والتحويل بين PEM وDER وحزم PEM في مكان واحد. يمكنك أيضًا جلب شهادة خادم عبر URL."
    ],
    "Stop switching between openssl commands and online tools. Paste a cert or enter a URL and get fingerprints, decoded fields, format conversions, and PEM block analysis in seconds.": [
        "प्रमाणपत्र पेस्ट करें या URL दें और फिंगरप्रिंट, डिकोड फ़ील्ड, प्रारूप रूपांतरण तथा PEM ब्लॉक विश्लेषण पाएँ।",
        "Pega un certificado o introduce una URL para ver huellas, campos decodificados, conversiones y análisis de bloques PEM.",
        "Collez un certificat ou saisissez une URL pour obtenir empreintes, champs décodés, conversions et analyse des blocs PEM.",
        "Zertifikat einfügen oder URL eingeben, um Fingerabdrücke, dekodierte Felder, Formate und PEM-Blöcke zu prüfen.",
        "証明書を貼り付けるかURLを入力するだけで、指紋、デコードした項目、形式変換、PEMブロックを確認できます。",
        "粘贴证书或输入 URL，即可查看指纹、解码字段、格式转换和 PEM 块分析。",
        "الصق شهادة أو أدخل URL للحصول على البصمات والحقول المفكوكة وتحويل التنسيق وتحليل كتل PEM."
    ],
    "Paste a PEM/DER certificate or enter a URL to fetch live": [
        "PEM/DER प्रमाणपत्र पेस्ट करें या लाइव प्राप्ति के लिए URL दें",
        "Pega un certificado PEM/DER o introduce una URL",
        "Collez un certificat PEM/DER ou saisissez une URL",
        "PEM/DER-Zertifikat einfügen oder URL zum Abruf eingeben",
        "PEM/DER証明書を貼り付けるか、取得するURLを入力します",
        "粘贴 PEM/DER 证书或输入 URL 在线获取",
        "الصق شهادة PEM/DER أو أدخل URL لجلبها مباشرة"
    ],
    "Switch tabs for Decode, Fingerprints, Convert, or PEM Parser": [
        "डिकोड, फिंगरप्रिंट, रूपांतरण या PEM पार्सर टैब चुनें",
        "Cambia entre Decodificar, Huellas, Convertir y Analizador PEM",
        "Choisissez Décodage, Empreintes, Conversion ou Analyse PEM",
        "Zwischen Dekodieren, Fingerabdrücken, Konvertierung und PEM-Parser wechseln",
        "デコード、指紋、変換、PEMパーサーのタブを切り替えます",
        "切换解码、指纹、转换或 PEM 解析器标签页",
        "بدّل بين تبويبات فك الترميز والبصمات والتحويل ومحلل PEM"
    ],
    "Upload .crt/.cer/.der files directly": [
        ".crt/.cer/.der फ़ाइल सीधे अपलोड करें",
        "Sube archivos .crt/.cer/.der directamente",
        "Importez directement des fichiers .crt/.cer/.der",
        ".crt/.cer/.der-Dateien direkt hochladen",
        ".crt/.cer/.derファイルを直接アップロードできます",
        "直接上传 .crt/.cer/.der 文件",
        "ارفع ملفات .crt/.cer/.der مباشرة"
    ],
    "URL fetch retrieves the live certificate chain from the server": [
        "URL से सर्वर की लाइव प्रमाणपत्र श्रृंखला मिलती है",
        "La URL obtiene la cadena actual del servidor",
        "L’URL récupère la chaîne actuelle du serveur",
        "Der URL-Abruf liefert die aktuelle Zertifikatskette des Servers",
        "URL取得でサーバーの現在の証明書チェーンを取得します",
        "URL 获取会读取服务器当前的证书链",
        "يجلب URL سلسلة الشهادات الحالية من الخادم"
    ],
    "Fingerprints tab shows SHA-256 (recommended), SHA-1, and MD5": [
        "फिंगरप्रिंट टैब SHA-256 (अनुशंसित), SHA-1 और MD5 दिखाता है",
        "Huellas muestra SHA-256 (recomendado), SHA-1 y MD5",
        "L’onglet Empreintes affiche SHA-256 (recommandé), SHA-1 et MD5",
        "Die Fingerabdrücke umfassen SHA-256 (empfohlen), SHA-1 und MD5",
        "指紋タブにはSHA-256（推奨）、SHA-1、MD5が表示されます",
        "指纹标签页显示 SHA-256（推荐）、SHA-1 和 MD5",
        "يعرض تبويب البصمات SHA-256 (موصى به) وSHA-1 وMD5"
    ],
    "PEM Parser handles bundles with multiple certificates, keys, and CSRs": [
        "PEM पार्सर कई प्रमाणपत्र, कुंजी और CSR वाले बंडल पढ़ता है",
        "El analizador PEM admite paquetes con certificados, claves y CSR",
        "L’analyseur PEM traite les lots de certificats, clés et CSR",
        "Der PEM-Parser verarbeitet Pakete aus Zertifikaten, Schlüsseln und CSRs",
        "PEMパーサーは複数の証明書、鍵、CSRを含むバンドルを扱います",
        "PEM 解析器可处理含多个证书、密钥和 CSR 的包",
        "يتعامل محلل PEM مع حزم الشهادات والمفاتيح وطلبات CSR"
    ],
    "Debugging TLS handshake errors": [
        "TLS हैंडशेक त्रुटियाँ जाँचना",
        "Depurar errores del protocolo TLS",
        "Diagnostiquer les erreurs de négociation TLS",
        "TLS-Handshake-Fehler untersuchen",
        "TLSハンドシェイクエラーの調査",
        "排查 TLS 握手错误",
        "تشخيص أخطاء مصافحة TLS"
    ],
    "Computing fingerprints for SSL pinning": [
        "SSL पिनिंग के लिए फिंगरप्रिंट निकालना",
        "Calcular huellas para fijación SSL",
        "Calculer des empreintes pour l’épinglage SSL",
        "Fingerabdrücke für SSL-Pinning berechnen",
        "SSLピンニング用の指紋計算",
        "计算 SSL 固定所需指纹",
        "حساب البصمات لتثبيت SSL"
    ],
    "Converting PEM to DER for Java truststore": [
        "Java ट्रस्टस्टोर के लिए PEM से DER बदलना",
        "Convertir PEM a DER para almacenes Java",
        "Convertir PEM en DER pour un magasin Java",
        "PEM für Java-Truststores in DER konvertieren",
        "Javaトラストストア用にPEMをDERへ変換",
        "为 Java 信任库将 PEM 转为 DER",
        "تحويل PEM إلى DER لمخزن ثقة Java"
    ],
    "Inspecting certificate bundles": [
        "प्रमाणपत्र बंडल निरीक्षण",
        "Inspeccionar paquetes de certificados",
        "Inspecter des lots de certificats",
        "Zertifikatspakete prüfen",
        "証明書バンドルの検査",
        "检查证书包",
        "فحص حزم الشهادات"
    ],
    "Inspect live server certificates through a disclosed server route and evaluate pasted certificate chains locally": [
        "बताए गए सर्वर मार्ग से लाइव प्रमाणपत्र देखें और पेस्ट की श्रृंखलाएँ स्थानीय जाँचें",
        "Inspecciona certificados de servidores mediante una ruta informada y evalúa cadenas pegadas localmente",
        "Inspectez les certificats via une route serveur indiquée et évaluez localement les chaînes collées",
        "Serverzertifikate über den angegebenen Serverweg abrufen und eingefügte Ketten lokal prüfen",
        "明示されたサーバー経路で稼働中の証明書を取得し、貼り付けたチェーンをローカルで検査",
        "通过已说明的服务器接口检查在线证书，并在本地检查粘贴的证书链",
        "افحص شهادات الخوادم عبر مسار معلن وقيّم السلاسل الملصقة محليًا"
    ],
    "A certificate chain (trust path) links a leaf certificate to a trusted root CA via intermediates. This tool fetches the live certificate chain from any server using a direct TLS connection — no external services — then decodes every cert's fields, SANs, key usage, fingerprints, and validates the chain signature.": [
        "प्रमाणपत्र श्रृंखला मध्यवर्ती CA से अंतिम प्रमाणपत्र को रूट CA से जोड़ती है। यह ऐप का सर्वर सीधे TLS से श्रृंखला लाता है; ब्राउज़र फ़ील्ड, SAN, उपयोग, फिंगरप्रिंट और चुने हुए हस्ताक्षर जाँचता है।",
        "Una cadena une el certificado final con una CA raíz mediante intermediarias. El servidor de esta app la obtiene por TLS directo y el navegador analiza campos, SAN, usos, huellas y ciertas firmas.",
        "Une chaîne relie le certificat final à une CA racine via des intermédiaires. Le serveur de l’app la récupère directement par TLS, puis le navigateur analyse champs, SAN, usages, empreintes et certaines signatures.",
        "Eine Kette verbindet das Endzertifikat über Zwischen-CAs mit einer Stamm-CA. Der App-Server ruft sie direkt per TLS ab; der Browser untersucht Felder, SANs, Verwendungen, Fingerabdrücke und ausgewählte Signaturen.",
        "証明書チェーンは中間CAを通じてリーフをルートCAにつなぎます。このアプリのサーバーがTLSで直接取得し、ブラウザーで項目、SAN、鍵用途、指紋、一部の署名を検査します。",
        "证书链通过中间 CA 将叶证书连接至根 CA。本应用服务器直接通过 TLS 获取证书链，浏览器解析字段、SAN、用途、指纹并执行部分签名检查。",
        "تربط سلسلة الشهادات الشهادة الطرفية بمرجع جذري عبر مراجع وسيطة. يجلبها خادم التطبيق باتصال TLS مباشر، ثم يحلل المتصفح الحقول وSAN والاستخدامات والبصمات وبعض التوقيعات."
    ],
    "Fetching uses this app’s server to open a TLS connection. Parsing and selected chain/signature checks run in your browser. This does not reproduce a browser trust store, revocation checking, policy processing or full PKIX validation. Misconfigured chains are the #1 cause of TLS errors; enter a URL and diagnose instantly.": [
        "प्राप्ति के लिए ऐप का सर्वर TLS कनेक्शन खोलता है। पार्सिंग और चुनी हुई श्रृंखला/हस्ताक्षर जाँच ब्राउज़र में होती हैं। यह ब्राउज़र ट्रस्टस्टोर, निरस्तीकरण, नीति या पूर्ण PKIX सत्यापन नहीं है।",
        "La obtención usa el servidor de esta app para abrir TLS. El análisis y ciertas comprobaciones son locales. No reproduce el almacén de confianza, revocación, políticas ni validación PKIX completa.",
        "La récupération passe par le serveur de l’app en TLS. L’analyse et certains contrôles sont locaux. Cet outil ne reproduit ni magasin de confiance, ni révocation, ni politiques, ni validation PKIX complète.",
        "Der Abruf nutzt den App-Server für TLS. Analyse und ausgewählte Ketten-/Signaturprüfungen laufen im Browser. Truststore, Sperrprüfung, Richtlinien und vollständige PKIX-Validierung werden nicht nachgebildet.",
        "取得時にはアプリのサーバーがTLS接続を開きます。解析と一部のチェーン・署名検査はブラウザー内で実行します。信頼ストア、失効、ポリシー、完全なPKIX検証は再現しません。",
        "获取时使用本应用服务器建立 TLS 连接；解析与部分证书链/签名检查在浏览器中运行，不模拟浏览器信任库、吊销检查、策略处理或完整 PKIX 验证。",
        "يستخدم الجلب خادم التطبيق لفتح اتصال TLS. يجري التحليل وفحوص محددة محليًا. لا يحاكي ذلك مخزن ثقة المتصفح أو الإلغاء أو السياسات أو التحقق الكامل وفق PKIX."
    ],
    "Live Check: enter any URL or hostname to fetch and inspect the full certificate chain": [
        "लाइव जाँच: श्रृंखला प्राप्त और निरीक्षण करने के लिए URL या होस्टनाम दें",
        "Comprobación en vivo: introduce URL o host para obtener e inspeccionar la cadena",
        "Vérification active : saisissez une URL ou un hôte pour récupérer et inspecter la chaîne",
        "Live-Prüfung: URL oder Hostnamen eingeben, um die Kette abzurufen und zu prüfen",
        "サーバー検査：URLまたはホスト名を入力してチェーンを取得・検査します",
        "在线检查：输入 URL 或主机名，获取并检查证书链",
        "الفحص المباشر: أدخل URL أو اسم مضيف لجلب السلسلة وفحصها"
    ],
    "Chain Validator: paste PEM certificates manually or fetch then validate": [
        "श्रृंखला सत्यापक: PEM पेस्ट करें या प्राप्त करके जाँचें",
        "Validador: pega certificados PEM o recupéralos y valida",
        "Vérificateur : collez les certificats PEM ou récupérez-les puis vérifiez",
        "Kettenprüfung: PEM-Zertifikate einfügen oder abrufen und prüfen",
        "チェーン検証：PEM証明書を貼り付けるか、取得して検証します",
        "证书链验证：手动粘贴 PEM 证书，或获取后验证",
        "مدقق السلسلة: الصق شهادات PEM أو اجلبها ثم تحقق منها"
    ],
    "See decoded fields, SANs, fingerprints, expiry, and evaluated chain checks for every cert": [
        "हर प्रमाणपत्र के डिकोड फ़ील्ड, SAN, फिंगरप्रिंट, समाप्ति और चुनी जाँचें देखें",
        "Consulta campos, SAN, huellas, caducidad y comprobaciones de cada certificado",
        "Consultez les champs, SAN, empreintes, échéances et contrôles de chaque certificat",
        "Felder, SANs, Fingerabdrücke, Ablauf und ausgeführte Prüfungen je Zertifikat ansehen",
        "各証明書の項目、SAN、指紋、期限、実行したチェーン検査を確認します",
        "查看各证书的解码字段、SAN、指纹、有效期及已执行的检查",
        "اعرض الحقول وSAN والبصمات والصلاحية والفحوص المجراة لكل شهادة"
    ],
    "The leaf certificate is the server's own cert; intermediates link it to the root CA": [
        "अंतिम प्रमाणपत्र सर्वर का है; मध्यवर्ती उसे रूट CA से जोड़ते हैं",
        "El certificado final pertenece al servidor; las intermediarias lo unen a la CA raíz",
        "Le certificat final est celui du serveur ; les intermédiaires le relient à la CA racine",
        "Das Endzertifikat gehört zum Server; Zwischen-CAs verbinden es mit der Stamm-CA",
        "リーフはサーバー自身の証明書で、中間CAがルートCAにつなぎます",
        "叶证书属于服务器，中间证书将其连接至根 CA",
        "الشهادة الطرفية تخص الخادم؛ تربطها الوسيطة بالمرجع الجذري"
    ],
    "A self-signed root at the end is expected — browsers have their own root trust stores": [
        "अंत में स्व-हस्ताक्षरित रूट सामान्य है; ब्राउज़र का अपना रूट ट्रस्टस्टोर होता है",
        "Es normal terminar en una raíz autofirmada; los navegadores tienen su propio almacén de confianza",
        "Une racine autosignée en fin de chaîne est normale ; le navigateur a son propre magasin de confiance",
        "Ein selbstsigniertes Stammzertifikat am Ende ist normal; Browser haben eigene Truststores",
        "末尾の自己署名ルートは通常の構成です。ブラウザーには独自の信頼ストアがあります",
        "末尾为自签名根证书是正常情况；浏览器具有自己的根信任库",
        "وجود جذر موقّع ذاتيًا في النهاية أمر متوقع؛ للمتصفحات مخازن ثقة خاصة"
    ],
    "Check all SANs: the domain you're connecting to must match at least one SAN": [
        "सभी SAN देखें: डोमेन कम से कम एक SAN से मिलना चाहिए",
        "Revisa los SAN: el dominio debe coincidir con al menos uno",
        "Vérifiez les SAN : le domaine doit correspondre à au moins l’un d’eux",
        "Alle SANs prüfen: Die Domain muss zu mindestens einem SAN passen",
        "SANを確認してください。接続先ドメインは少なくとも1つのSANと一致する必要があります",
        "检查所有 SAN：连接域名至少应与一个 SAN 匹配",
        "راجع جميع SAN: يجب أن يطابق النطاق واحدًا منها على الأقل"
    ],
    "SHA-256 fingerprint uniquely identifies a certificate for pinning": [
        "SHA-256 फिंगरप्रिंट पिनिंग हेतु प्रमाणपत्र पहचानता है",
        "La huella SHA-256 identifica el certificado para fijación",
        "L’empreinte SHA-256 identifie le certificat pour l’épinglage",
        "Der SHA-256-Fingerabdruck identifiziert das Zertifikat für Pinning",
        "SHA-256指紋でピンニングする証明書を識別できます",
        "SHA-256 指纹可用于证书固定识别",
        "تحدد بصمة SHA-256 الشهادة لغرض التثبيت"
    ],
    "Debugging 'untrusted certificate' browser errors": [
        "ब्राउज़र की 'अविश्वसनीय प्रमाणपत्र' त्रुटि जाँचना",
        "Depurar errores de certificado no confiable",
        "Diagnostiquer les certificats non approuvés",
        "Browserfehler zu nicht vertrauenswürdigen Zertifikaten untersuchen",
        "ブラウザーの「信頼できない証明書」エラーの調査",
        "排查浏览器“不受信任证书”错误",
        "تشخيص أخطاء الشهادات غير الموثوقة في المتصفح"
    ],
    "Verifying nginx/Apache sends the full chain (not just leaf)": [
        "nginx/Apache पूरी श्रृंखला भेजता है या नहीं जाँचना",
        "Comprobar que nginx/Apache envía la cadena completa",
        "Vérifier que nginx/Apache envoie la chaîne complète",
        "Prüfen, ob nginx/Apache die vollständige Kette sendet",
        "nginx/Apacheがチェーン全体を送るか確認",
        "验证 nginx/Apache 是否发送完整证书链",
        "التحقق من إرسال nginx/Apache للسلسلة الكاملة"
    ],
    "Auditing certificate expiry, SANs, and key strength": [
        "समाप्ति, SAN और कुंजी शक्ति की समीक्षा",
        "Auditar caducidad, SAN y fortaleza de claves",
        "Auditer l’expiration, les SAN et la robustesse des clés",
        "Ablauf, SANs und Schlüsselstärke prüfen",
        "証明書の期限、SAN、鍵強度の確認",
        "审查证书到期时间、SAN 和密钥强度",
        "مراجعة انتهاء الشهادات وSAN وقوة المفاتيح"
    ],
    "SSL pinning — get the exact SHA-256 fingerprint": [
        "SSL पिनिंग — सटीक SHA-256 फिंगरप्रिंट पाएँ",
        "Fijación SSL: obtener la huella SHA-256 exacta",
        "Épinglage SSL : obtenir l’empreinte SHA-256 exacte",
        "SSL-Pinning: genauen SHA-256-Fingerabdruck ermitteln",
        "SSLピンニング用の正確なSHA-256指紋を取得",
        "SSL 固定：获取准确的 SHA-256 指纹",
        "تثبيت SSL — الحصول على بصمة SHA-256 الدقيقة"
    ],
    "Read, create and convert PKCS#12 (.pfx / .p12) keystores": [
        "PKCS#12 (.pfx / .p12) कीस्टोर पढ़ें, बनाएँ और बदलें",
        "Lee, crea y convierte almacenes PKCS#12 (.pfx / .p12)",
        "Lisez, créez et convertissez des magasins PKCS#12 (.pfx / .p12)",
        "PKCS#12-Keystores (.pfx/.p12) lesen, erstellen und konvertieren",
        "PKCS#12（.pfx／.p12）キーストアの読み込み・作成・変換",
        "读取、创建和转换 PKCS#12（.pfx / .p12）密钥库",
        "قراءة وإنشاء وتحويل مخازن PKCS#12 (.pfx / .p12)"
    ],
    "PKCS#12 (.pfx / .p12) is a password-protected binary keystore that bundles a certificate, its private key, and any intermediate CA certs into a single file. It's the standard format for distributing TLS server identities to Windows IIS, Java applications (after conversion to JKS), and many cloud platforms.": [
        "PKCS#12 (.pfx / .p12) पासवर्ड-सुरक्षित बाइनरी कीस्टोर है, जिसमें प्रमाणपत्र, निजी कुंजी और मध्यवर्ती CA प्रमाणपत्र एक फ़ाइल में रहते हैं। यह IIS, Java और क्लाउड प्लेटफ़ॉर्म पर TLS पहचान देने का सामान्य प्रारूप है।",
        "PKCS#12 (.pfx / .p12) reúne un certificado, su clave privada y certificados intermedios en un archivo binario protegido por contraseña. Se usa para identidades TLS en IIS, Java y plataformas de nube.",
        "PKCS#12 (.pfx / .p12) regroupe un certificat, sa clé privée et les CA intermédiaires dans un fichier binaire protégé par mot de passe. Il sert à distribuer les identités TLS pour IIS, Java et le cloud.",
        "PKCS#12 (.pfx/.p12) bündelt Zertifikat, privaten Schlüssel und Zwischen-CAs in einer passwortgeschützten Binärdatei. Es wird zur Verteilung von TLS-Identitäten an IIS, Java und Cloud-Plattformen genutzt.",
        "PKCS#12（.pfx／.p12）は証明書、秘密鍵、中間CAを1つのパスワード保護されたバイナリファイルにまとめる形式です。IIS、Java、クラウドへのTLS識別情報の配布に使われます。",
        "PKCS#12（.pfx / .p12）是受密码保护的二进制密钥库，可将证书、私钥和中间 CA 证书打包为一个文件，常用于 IIS、Java 和云平台的 TLS 身份分发。",
        "يجمع PKCS#12 (.pfx / .p12) الشهادة ومفتاحها الخاص والشهادات الوسيطة في ملف ثنائي محمي بكلمة مرور، ويُستخدم لتوزيع هويات TLS إلى IIS وJava والمنصات السحابية."
    ],
    "Generate a .p12 from PEM files, extract the private key + certs from a customer-supplied .p12, or inspect what's inside one before deploying. All processing happens locally in your browser — passwords never leave your machine.": [
        "PEM से .p12 बनाएँ, .p12 से निजी कुंजी और प्रमाणपत्र निकालें या तैनाती से पहले सामग्री देखें। सब काम ब्राउज़र में स्थानीय होता है; पासवर्ड बाहर नहीं जाता।",
        "Crea .p12 desde PEM, extrae claves y certificados o inspecciona el contenido antes de desplegar. Todo se procesa localmente; las contraseñas no salen del equipo.",
        "Créez un .p12 depuis PEM, extrayez clés et certificats ou inspectez son contenu avant déploiement. Tout reste local dans le navigateur, y compris les mots de passe.",
        ".p12 aus PEM erstellen, Schlüssel und Zertifikate extrahieren oder Inhalte vor der Bereitstellung prüfen. Alles läuft lokal im Browser; Passwörter bleiben auf dem Gerät.",
        "PEMから.p12を作成し、鍵や証明書を抽出し、配置前に内容を検査できます。すべてブラウザー内で処理し、パスワードは端末の外へ送りません。",
        "从 PEM 创建 .p12、提取私钥与证书，或在部署前检查内容。所有处理均在浏览器本地完成，密码不会离开设备。",
        "أنشئ .p12 من PEM أو استخرج المفاتيح والشهادات أو افحص المحتوى قبل النشر. تتم المعالجة محليًا في المتصفح ولا تغادر كلمات المرور الجهاز."
    ],
    "Read tab: upload a .p12/.pfx, enter password, see all bundled certs and keys": [
        "पढ़ें टैब: .p12/.pfx अपलोड करें, पासवर्ड दें और प्रमाणपत्र व कुंजियाँ देखें",
        "Leer: sube .p12/.pfx, introduce la contraseña y consulta certificados y claves",
        "Lecture : importez .p12/.pfx, saisissez le mot de passe et consultez certificats et clés",
        "Lesen: .p12/.pfx hochladen, Passwort eingeben und Zertifikate sowie Schlüssel ansehen",
        "読み込み：.p12／.pfxをアップロードし、パスワードを入力して証明書と鍵を表示します",
        "读取：上传 .p12/.pfx，输入密码，查看其中的证书和密钥",
        "القراءة: ارفع .p12/.pfx وأدخل كلمة المرور لعرض الشهادات والمفاتيح"
    ],
    "Create tab: paste a certificate PEM and private key PEM, set a password, download the .p12": [
        "बनाएँ टैब: प्रमाणपत्र और निजी कुंजी PEM पेस्ट करें, पासवर्ड दें और .p12 डाउनलोड करें",
        "Crear: pega el certificado y clave PEM, fija una contraseña y descarga .p12",
        "Création : collez certificat et clé PEM, définissez un mot de passe et téléchargez .p12",
        "Erstellen: Zertifikat und Schlüssel als PEM einfügen, Passwort setzen und .p12 herunterladen",
        "作成：証明書PEMと秘密鍵PEMを貼り付け、パスワードを設定して.p12をダウンロードします",
        "创建：粘贴证书 PEM 和私钥 PEM，设置密码并下载 .p12",
        "الإنشاء: الصق الشهادة والمفتاح بصيغة PEM وعيّن كلمة مرور ونزّل .p12"
    ],
    "PKCS#12 supports SHA1, 3DES, AES — node-forge uses 3DES for max compatibility": [
        "PKCS#12 में SHA1, 3DES और AES हैं; node-forge अनुकूलता के लिए 3DES उपयोग करता है",
        "PKCS#12 admite SHA1, 3DES y AES; node-forge usa 3DES por compatibilidad",
        "PKCS#12 prend en charge SHA1, 3DES et AES ; node-forge utilise 3DES pour la compatibilité",
        "PKCS#12 unterstützt SHA1, 3DES und AES; node-forge nutzt 3DES für Kompatibilität",
        "PKCS#12はSHA1、3DES、AESに対応し、node-forgeは互換性のため3DESを使います",
        "PKCS#12 支持 SHA1、3DES 和 AES；node-forge 使用 3DES 以兼顾兼容性",
        "يدعم PKCS#12 ‏SHA1 و3DES وAES؛ ويستخدم node-forge ‏3DES للتوافق"
    ],
    "Lost the password? It cannot be recovered — start over with a new keystore": [
        "पासवर्ड खो गया तो नया कीस्टोर बनाएँ; इसे वापस नहीं पाया जा सकता",
        "Si pierdes la contraseña, crea un almacén nuevo; no puede recuperarse",
        "Mot de passe perdu ? Créez un nouveau magasin ; il n’est pas récupérable",
        "Passwort verloren? Einen neuen Keystore erstellen; eine Wiederherstellung ist nicht möglich",
        "パスワードを失った場合は新しいキーストアを作成してください。復元はできません",
        "密码丢失后无法恢复，请创建新的密钥库",
        "إذا فقدت كلمة المرور، أنشئ مخزنًا جديدًا؛ لا يمكن استعادتها"
    ],
    "Java's keytool reads modern .p12 files since Java 9": [
        "Java 9 से keytool आधुनिक .p12 फ़ाइल पढ़ता है",
        "keytool lee archivos .p12 modernos desde Java 9",
        "keytool lit les fichiers .p12 modernes depuis Java 9",
        "keytool liest moderne .p12-Dateien seit Java 9",
        "Java 9以降のkeytoolは新しい.p12ファイルを読み込めます",
        "Java 9 起，keytool 可读取现代 .p12 文件",
        "يقرأ keytool ملفات .p12 الحديثة منذ Java 9"
    ],
    "Importing a TLS cert into Windows IIS": [
        "Windows IIS में TLS प्रमाणपत्र आयात",
        "Importar certificados TLS a Windows IIS",
        "Importer un certificat TLS dans Windows IIS",
        "TLS-Zertifikat in Windows IIS importieren",
        "Windows IISへのTLS証明書のインポート",
        "向 Windows IIS 导入 TLS 证书",
        "استيراد شهادة TLS إلى Windows IIS"
    ],
    "Splitting a vendor-supplied .pfx into separate .crt and .key files": [
        "विक्रेता की .pfx को .crt और .key में बाँटना",
        "Separar un .pfx en archivos .crt y .key",
        "Séparer un .pfx fourni en fichiers .crt et .key",
        "Gelieferte .pfx in .crt und .key aufteilen",
        "提供された.pfxを.crtと.keyに分離",
        "将供应方的 .pfx 拆分为 .crt 和 .key",
        "تقسيم .pfx إلى ملفي .crt و.key"
    ],
    "Creating a portable client-auth keystore": [
        "पोर्टेबल क्लाइंट प्रमाणीकरण कीस्टोर बनाना",
        "Crear un almacén portátil de autenticación de cliente",
        "Créer un magasin portable pour l’authentification client",
        "Portablen Keystore zur Clientauthentifizierung erstellen",
        "持ち運べるクライアント認証キーストアの作成",
        "创建便携式客户端认证密钥库",
        "إنشاء مخزن محمول لمصادقة العميل"
    ],
    "Generate RSA, ECDSA, and Ed25519 key pairs": [
        "RSA, ECDSA और Ed25519 कुंजी जोड़ियाँ बनाएँ",
        "Genera pares de claves RSA, ECDSA y Ed25519",
        "Générez des paires de clés RSA, ECDSA et Ed25519",
        "RSA-, ECDSA- und Ed25519-Schlüsselpaare erstellen",
        "RSA、ECDSA、Ed25519の鍵ペアを生成",
        "生成 RSA、ECDSA 和 Ed25519 密钥对",
        "إنشاء أزواج مفاتيح RSA وECDSA وEd25519"
    ],
    "A cryptographic key pair consists of a public key and a private key. The public key can be shared freely and is used to verify signatures or encrypt data. The private key must be kept secret and is used to sign data or decrypt messages.": [
        "कुंजी जोड़ी में सार्वजनिक और निजी कुंजी होती है। सार्वजनिक कुंजी साझा की जा सकती है; निजी कुंजी गोपनीय रखी जाती है। एल्गोरिथ्म के अनुसार इनसे हस्ताक्षर/सत्यापन या एन्क्रिप्शन/डिक्रिप्शन होता है।",
        "Un par incluye clave pública y privada. La pública puede compartirse; la privada debe guardarse en secreto. Según el algoritmo, sirven para firmar/verificar o cifrar/descifrar.",
        "Une paire comprend une clé publique partageable et une clé privée secrète. Selon l’algorithme, elles servent à signer/vérifier ou à chiffrer/déchiffrer.",
        "Ein Schlüsselpaar besteht aus einem teilbaren öffentlichen und einem geheimen privaten Schlüssel. Je nach Algorithmus dienen sie zum Signieren/Prüfen oder Verschlüsseln/Entschlüsseln.",
        "鍵ペアは共有可能な公開鍵と秘密に保管する秘密鍵で構成されます。用途はアルゴリズムによって署名・検証や暗号化・復号に分かれます。",
        "密钥对由可公开分享的公钥和必须保密的私钥组成。根据算法，密钥可用于签名/验证或加密/解密。",
        "يتكون الزوج من مفتاح عام يمكن مشاركته وآخر خاص يجب حفظه سرًا. وتُستخدم المفاتيح، حسب الخوارزمية، للتوقيع والتحقق أو للتشفير وفكه."
    ],
    "Key pairs are fundamental to public-key cryptography used in SSL/TLS certificates, SSH authentication, code signing, JWTs, and secure communication. Generating keys locally ensures the private key never leaves your machine.": [
        "सार्वजनिक-कुंजी क्रिप्टोग्राफ़ी TLS, SSH, कोड हस्ताक्षर और JWT में काम आती है। स्थानीय कुंजी निर्माण से निजी कुंजी मशीन पर रहती है।",
        "La criptografía de clave pública se usa en TLS, SSH, firma de código y JWT. La generación local mantiene la clave privada en el equipo.",
        "La cryptographie à clé publique sert à TLS, SSH, aux signatures de code et aux JWT. La génération locale garde la clé privée sur l’appareil.",
        "Public-Key-Kryptografie wird für TLS, SSH, Codesignaturen und JWTs genutzt. Lokale Erstellung hält private Schlüssel auf dem Gerät.",
        "公開鍵暗号はTLS、SSH、コード署名、JWTなどに使われます。ローカル生成により秘密鍵は端末内に留まります。",
        "公钥密码用于 TLS、SSH、代码签名和 JWT 等场景。本地生成可让私钥留在设备中。",
        "تُستخدم تشفيرات المفتاح العام في TLS وSSH وتوقيع البرامج وJWT. يبقي الإنشاء المحلي المفتاح الخاص على الجهاز."
    ],
    "Select the key algorithm: RSA for broad compatibility, ECDSA for efficiency": [
        "एल्गोरिथ्म चुनें: व्यापक अनुकूलता हेतु RSA, दक्षता हेतु ECDSA",
        "Elige RSA para compatibilidad o ECDSA para eficiencia",
        "Choisissez RSA pour la compatibilité ou ECDSA pour l’efficacité",
        "RSA für Kompatibilität oder ECDSA für Effizienz wählen",
        "互換性を重視する場合はRSA、効率を重視する場合はECDSAを選びます",
        "选择算法：RSA 兼容性广，ECDSA 效率高",
        "اختر RSA للتوافق الواسع أو ECDSA للكفاءة"
    ],
    "Choose the key size (RSA) or curve (ECDSA)": [
        "RSA कुंजी आकार या ECDSA वक्र चुनें",
        "Elige el tamaño RSA o curva ECDSA",
        "Choisissez la taille RSA ou la courbe ECDSA",
        "RSA-Schlüssellänge oder ECDSA-Kurve wählen",
        "RSAの鍵長またはECDSAの曲線を選びます",
        "选择 RSA 密钥长度或 ECDSA 曲线",
        "اختر حجم RSA أو منحنى ECDSA"
    ],
    "Select the output format: PEM for most uses, JWK for web applications": [
        "आउटपुट प्रारूप चुनें: सामान्य उपयोग हेतु PEM, वेब ऐप हेतु JWK",
        "Elige PEM para uso general o JWK para aplicaciones web",
        "Choisissez PEM pour l’usage général ou JWK pour le Web",
        "PEM für allgemeine Nutzung oder JWK für Webanwendungen wählen",
        "通常の用途はPEM、WebアプリにはJWKを選びます",
        "选择输出格式：一般用途用 PEM，Web 应用用 JWK",
        "اختر PEM للاستخدام العام أو JWK لتطبيقات الويب"
    ],
    "Click Generate to create your key pair": [
        "कुंजी जोड़ी बनाने के लिए बनाएँ दबाएँ",
        "Pulsa Generar para crear el par",
        "Cliquez sur Générer pour créer la paire",
        "Auf Erstellen klicken, um das Schlüsselpaar zu erzeugen",
        "生成をクリックして鍵ペアを作成します",
        "点击生成以创建密钥对",
        "اضغط إنشاء لتكوين زوج المفاتيح"
    ],
    "Download and securely store the private key": [
        "निजी कुंजी डाउनलोड कर सुरक्षित रखें",
        "Descarga y guarda la clave privada de forma segura",
        "Téléchargez et conservez la clé privée en sécurité",
        "Privaten Schlüssel herunterladen und sicher speichern",
        "秘密鍵をダウンロードして安全に保管します",
        "下载并安全保存私钥",
        "نزّل المفتاح الخاص واحفظه بأمان"
    ],
    "RSA 2048-bit is minimum for security; use 3072+ for long-term keys": [
        "RSA 2048 बिट न्यूनतम है; लंबे समय की कुंजियों हेतु 3072+ चुनें",
        "RSA 2048 bits es el mínimo; usa 3072+ para claves duraderas",
        "RSA 2048 bits est le minimum ; préférez 3072+ pour la durée",
        "RSA 2048 Bit ist das Minimum; für langfristige Schlüssel 3072+ nutzen",
        "RSAは2048ビット以上、長期利用には3072ビット以上を選びます",
        "RSA 至少选择 2048 位，长期密钥可选 3072 位及以上",
        "RSA ‏2048 بت حد أدنى؛ استخدم 3072 أو أكثر للمفاتيح طويلة الأجل"
    ],
    "ECDSA P-256 offers equivalent security to RSA 3072 with smaller keys": [
        "ECDSA P-256 छोटी कुंजी में RSA 3072 के समान सुरक्षा देता है",
        "ECDSA P-256 ofrece seguridad similar a RSA 3072 con claves menores",
        "ECDSA P-256 offre une sécurité comparable à RSA 3072 avec des clés plus petites",
        "ECDSA P-256 bietet mit kleineren Schlüsseln ähnliche Sicherheit wie RSA 3072",
        "ECDSA P-256はRSA 3072と同程度の安全性を小さい鍵で提供します",
        "ECDSA P-256 以更小密钥提供与 RSA 3072 相近的安全强度",
        "يوفر ECDSA P-256 أمانًا مقاربًا لـRSA 3072 بمفاتيح أصغر"
    ],
    "Never share your private key - only the public key is meant to be distributed": [
        "निजी कुंजी कभी साझा न करें; केवल सार्वजनिक कुंजी वितरित करें",
        "Nunca compartas la clave privada; distribuye solo la pública",
        "Ne partagez jamais la clé privée ; seule la publique se distribue",
        "Privaten Schlüssel niemals teilen; nur der öffentliche ist zur Weitergabe bestimmt",
        "秘密鍵は共有せず、公開鍵だけを配布してください",
        "切勿分享私钥，仅分发公钥",
        "لا تشارك المفتاح الخاص؛ المفتاح العام فقط مخصص للتوزيع"
    ],
    "PEM exports SPKI public keys and unencrypted PKCS#8 private keys; JWK exports JSON keys.": [
        "PEM में SPKI सार्वजनिक और बिना एन्क्रिप्शन PKCS#8 निजी कुंजी मिलती है; JWK में JSON कुंजी।",
        "PEM exporta claves públicas SPKI y privadas PKCS#8 sin cifrar; JWK exporta claves JSON.",
        "PEM exporte des clés publiques SPKI et privées PKCS#8 non chiffrées ; JWK exporte du JSON.",
        "PEM exportiert öffentliche SPKI- und unverschlüsselte private PKCS#8-Schlüssel; JWK exportiert JSON.",
        "PEMはSPKI公開鍵と未暗号化PKCS#8秘密鍵、JWKはJSON形式の鍵を出力します。",
        "PEM 导出 SPKI 公钥和未加密的 PKCS#8 私钥；JWK 导出 JSON 密钥。",
        "يصدّر PEM مفاتيح عامة SPKI وخاصة PKCS#8 غير مشفرة؛ ويصدّر JWK مفاتيح JSON."
    ],
    "Private keys are not encrypted by this tool. Store downloaded keys securely.": [
        "यह टूल निजी कुंजी एन्क्रिप्ट नहीं करता। डाउनलोड कुंजी सुरक्षित रखें।",
        "Esta herramienta no cifra las claves privadas. Guarda las descargas de forma segura.",
        "Cet outil ne chiffre pas les clés privées. Conservez les fichiers en sécurité.",
        "Dieses Werkzeug verschlüsselt private Schlüssel nicht. Downloads sicher verwahren.",
        "このツールは秘密鍵を暗号化しません。ダウンロードした鍵は安全に保管してください。",
        "此工具不会加密私钥，请安全保存下载的密钥。",
        "لا تشفر هذه الأداة المفاتيح الخاصة. احفظ الملفات المنزلة بأمان."
    ],
    "Generating keys for SSL/TLS certificates": [
        "SSL/TLS प्रमाणपत्र हेतु कुंजी निर्माण",
        "Generar claves para certificados SSL/TLS",
        "Générer des clés pour certificats SSL/TLS",
        "Schlüssel für SSL/TLS-Zertifikate erstellen",
        "SSL/TLS証明書用の鍵生成",
        "生成 SSL/TLS 证书密钥",
        "إنشاء مفاتيح لشهادات SSL/TLS"
    ],
    "Exporting signing key material": [
        "हस्ताक्षर कुंजी सामग्री निर्यात",
        "Exportar material de claves de firma",
        "Exporter le matériel des clés de signature",
        "Signaturschlüsselmaterial exportieren",
        "署名鍵データのエクスポート",
        "导出签名密钥材料",
        "تصدير بيانات مفاتيح التوقيع"
    ],
    "JWT signing keys for authentication systems": [
        "प्रमाणीकरण हेतु JWT हस्ताक्षर कुंजी",
        "Claves de firma JWT para autenticación",
        "Clés de signature JWT pour l’authentification",
        "JWT-Signaturschlüssel für Authentifizierung",
        "認証システム用のJWT署名鍵",
        "认证系统的 JWT 签名密钥",
        "مفاتيح توقيع JWT للمصادقة"
    ],
    "Code signing certificates": [
        "कोड हस्ताक्षर प्रमाणपत्र",
        "Certificados de firma de código",
        "Certificats de signature de code",
        "Codesignaturzertifikate",
        "コード署名証明書",
        "代码签名证书",
        "شهادات توقيع البرامج"
    ],
    "S/MIME email encryption": [
        "S/MIME ईमेल एन्क्रिप्शन",
        "Cifrado de correo S/MIME",
        "Chiffrement de courriels S/MIME",
        "S/MIME-E-Mail-Verschlüsselung",
        "S/MIMEメール暗号化",
        "S/MIME 邮件加密",
        "تشفير البريد S/MIME"
    ],
    "Public key PEM output": [
        "सार्वजनिक कुंजी PEM आउटपुट",
        "Salida PEM de clave pública",
        "Sortie PEM de clé publique",
        "Öffentliche PEM-Schlüsselausgabe",
        "公開鍵PEMの出力",
        "公钥 PEM 输出",
        "ناتج المفتاح العام PEM"
    ],
    "Certificate PEM output": [
        "प्रमाणपत्र PEM आउटपुट",
        "Salida de certificado PEM",
        "Sortie du certificat PEM",
        "PEM-Zertifikatsausgabe",
        "証明書PEMの出力",
        "证书 PEM 输出",
        "ناتج الشهادة PEM"
    ],
    "Base64 DER output": [
        "Base64 DER आउटपुट",
        "Salida DER en Base64",
        "Sortie DER en Base64",
        "Base64-DER-Ausgabe",
        "Base64 DERの出力",
        "Base64 DER 输出",
        "ناتج Base64 DER"
    ],
    "Conversion format": [
        "रूपांतरण प्रारूप",
        "Formato de conversión",
        "Format de conversion",
        "Konvertierungsformat",
        "変換形式",
        "转换格式",
        "تنسيق التحويل"
    ],
    "Converted certificate output": [
        "बदला गया प्रमाणपत्र आउटपुट",
        "Salida del certificado convertido",
        "Sortie du certificat converti",
        "Konvertierte Zertifikatsausgabe",
        "変換した証明書の出力",
        "转换后的证书输出",
        "ناتج الشهادة المحولة"
    ],
    "Certificate input": [
        "प्रमाणपत्र इनपुट",
        "Entrada del certificado",
        "Saisie du certificat",
        "Zertifikateingabe",
        "証明書の入力",
        "证书输入",
        "إدخال الشهادة"
    ],
    "Hostname or URL": [
        "होस्टनाम या URL",
        "Host o URL",
        "Nom d’hôte ou URL",
        "Hostname oder URL",
        "ホスト名またはURL",
        "主机名或 URL",
        "اسم مضيف أو URL"
    ],
    "Private key PEM output": [
        "निजी कुंजी PEM आउटपुट",
        "Salida PEM de clave privada",
        "Sortie PEM de clé privée",
        "Private PEM-Schlüsselausgabe",
        "秘密鍵PEMの出力",
        "私钥 PEM 输出",
        "ناتج المفتاح الخاص PEM"
    ],
    "Certificate PEM input": [
        "प्रमाणपत्र PEM इनपुट",
        "Entrada de certificado PEM",
        "Saisie du certificat PEM",
        "PEM-Zertifikateingabe",
        "証明書PEMの入力",
        "证书 PEM 输入",
        "إدخال الشهادة PEM"
    ],
    "Private key PEM input": [
        "निजी कुंजी PEM इनपुट",
        "Entrada PEM de clave privada",
        "Saisie PEM de clé privée",
        "Private PEM-Schlüsseleingabe",
        "秘密鍵PEMの入力",
        "私钥 PEM 输入",
        "إدخال المفتاح الخاص PEM"
    ],
    "Chain PEM input": [
        "श्रृंखला PEM इनपुट",
        "Entrada de cadena PEM",
        "Saisie de chaîne PEM",
        "PEM-Ketteneingabe",
        "チェーンPEMの入力",
        "证书链 PEM 输入",
        "إدخال السلسلة PEM"
    ],
    "Public key output": [
        "सार्वजनिक कुंजी आउटपुट",
        "Salida de clave pública",
        "Sortie de clé publique",
        "Öffentliche Schlüsselausgabe",
        "公開鍵の出力",
        "公钥输出",
        "ناتج المفتاح العام"
    ],
    "Private key output": [
        "निजी कुंजी आउटपुट",
        "Salida de clave privada",
        "Sortie de clé privée",
        "Private Schlüsselausgabe",
        "秘密鍵の出力",
        "私钥输出",
        "ناتج المفتاح الخاص"
    ],
    "What information can I extract from an X.509 certificate?": [
        "X.509 प्रमाणपत्र से क्या जानकारी मिल सकती है?",
        "¿Qué información puedo extraer de un certificado X.509?",
        "Quelles informations peut-on extraire d’un certificat X.509 ?",
        "Welche Informationen lassen sich aus einem X.509-Zertifikat auslesen?",
        "X.509証明書から何を確認できますか？",
        "可以从 X.509 证书提取哪些信息？",
        "ما المعلومات التي يمكن استخراجها من شهادة X.509؟"
    ],
    "An X.509 certificate contains the subject (owner), issuer (CA), validity period, Subject Alternative Names (SANs), public key, signature algorithm, serial number, and extensions such as Key Usage and Extended Key Usage.": [
        "X.509 प्रमाणपत्र में विषय (स्वामी), जारीकर्ता (CA), वैधता अवधि, SAN, सार्वजनिक कुंजी, हस्ताक्षर एल्गोरिथ्म, क्रम संख्या और कुंजी उपयोग जैसे एक्सटेंशन होते हैं।",
        "Un certificado X.509 contiene sujeto, emisor (CA), validez, SAN, clave pública, algoritmo de firma, número de serie y extensiones como uso de clave y uso extendido.",
        "Un certificat X.509 contient le sujet, l’émetteur (CA), la validité, les SAN, la clé publique, l’algorithme de signature, le numéro de série et les extensions d’usage de clé.",
        "Ein X.509-Zertifikat enthält Subjekt, Aussteller (CA), Gültigkeit, SANs, öffentlichen Schlüssel, Signaturalgorithmus, Seriennummer und Erweiterungen zur Schlüsselverwendung.",
        "X.509証明書にはサブジェクト、発行者（CA）、有効期間、SAN、公開鍵、署名アルゴリズム、シリアル番号、鍵用途や拡張鍵用途などが含まれます。",
        "X.509 证书包含主体、颁发者（CA）、有效期、SAN、公钥、签名算法、序列号以及密钥用途和扩展密钥用途等扩展。",
        "تحتوي شهادة X.509 على الموضوع والمُصدر (CA) والصلاحية وSAN والمفتاح العام وخوارزمية التوقيع والرقم التسلسلي وامتدادات استخدام المفتاح."
    ],
    "What is the difference between PEM and DER format?": [
        "PEM और DER प्रारूप में क्या अंतर है?",
        "¿Qué diferencia hay entre PEM y DER?",
        "Quelle différence entre les formats PEM et DER ?",
        "Was unterscheidet PEM und DER?",
        "PEM形式とDER形式の違いは何ですか？",
        "PEM 和 DER 格式有什么区别？",
        "ما الفرق بين تنسيقي PEM وDER؟"
    ],
    "PEM is a Base64-encoded certificate wrapped in -----BEGIN CERTIFICATE----- headers, commonly used in files. DER is the raw binary form. This tool accepts both formats.": [
        "PEM में Base64 प्रमाणपत्र -----BEGIN CERTIFICATE----- हेडर में लिपटा होता है। DER मूल बाइनरी रूप है। टूल दोनों प्रारूप पढ़ता है।",
        "PEM es un certificado Base64 con cabeceras -----BEGIN CERTIFICATE-----. DER es la forma binaria. La herramienta acepta ambos.",
        "PEM est un certificat Base64 entouré d’en-têtes -----BEGIN CERTIFICATE-----. DER est sa forme binaire brute. L’outil accepte les deux.",
        "PEM ist ein Base64-Zertifikat mit -----BEGIN CERTIFICATE----- als Header. DER ist die binäre Form. Das Werkzeug akzeptiert beide.",
        "PEMは-----BEGIN CERTIFICATE-----ヘッダー付きのBase64証明書で、DERは生のバイナリ形式です。このツールは両方に対応します。",
        "PEM 是带有 -----BEGIN CERTIFICATE----- 头部的 Base64 编码证书，DER 是原始二进制形式。本工具接受这两种格式。",
        "PEM شهادة بترميز Base64 محاطة بترويسات -----BEGIN CERTIFICATE-----. أما DER فهو الشكل الثنائي الخام. تقبل الأداة التنسيقين."
    ],
    "Valid until {date}": [
        "{date} तक मान्य",
        "Válido hasta {date}",
        "Valide jusqu’au {date}",
        "Gültig bis {date}",
        "有効期限：{date}",
        "有效期至 {date}",
        "صالحة حتى {date}"
    ],
    "Binary DER ({count} bytes) — click Download": [
        "बाइनरी DER ({count} बाइट) — डाउनलोड दबाएँ",
        "DER binario ({count} bytes): pulsa Descargar",
        "DER binaire ({count} octets) : cliquez sur Télécharger",
        "Binäres DER ({count} Byte) – Herunterladen anklicken",
        "バイナリDER（{count}バイト）— ダウンロードをクリック",
        "二进制 DER（{count} 字节）— 点击下载",
        "DER ثنائي ({count} بايت) — اضغط تنزيل"
    ],
    "Certificate": [
        "प्रमाणपत्र",
        "Certificado",
        "Certificat",
        "Zertifikat",
        "証明書",
        "证书",
        "الشهادة"
    ],
    "Could not generate a {algorithm} CSR for {subject}.": [
        "{subject} के लिए {algorithm} CSR नहीं बन सका।",
        "No se pudo generar un CSR {algorithm} para {subject}.",
        "Impossible de générer un CSR {algorithm} pour {subject}.",
        "{algorithm}-CSR für {subject} konnte nicht erstellt werden.",
        "{subject}の{algorithm} CSRを生成できませんでした。",
        "无法为 {subject} 生成 {algorithm} CSR。",
        "تعذر إنشاء CSR بخوارزمية {algorithm} لـ{subject}."
    ],
    "OpenSSL commands": [
        "OpenSSL कमांड",
        "Comandos OpenSSL",
        "Commandes OpenSSL",
        "OpenSSL-Befehle",
        "OpenSSLコマンド",
        "OpenSSL 命令",
        "أوامر OpenSSL"
    ],
    "Self-signed certificate and matching private key generated successfully!": [
        "स्व-हस्ताक्षरित प्रमाणपत्र और उससे मेल खाने वाली निजी कुंजी बनाई गई!",
        "¡Certificado autofirmado y clave privada correspondiente generados!",
        "Certificat autosigné et clé privée correspondante générés !",
        "Selbstsigniertes Zertifikat und passender privater Schlüssel erstellt!",
        "自己署名証明書と対応する秘密鍵を生成しました。",
        "已生成自签名证书及其匹配的私钥！",
        "تم إنشاء الشهادة الموقعة ذاتيًا والمفتاح الخاص المطابق!"
    ],
    "Check the subject, DNS/IP alternative names, validity and key usages.": [
        "विषय, DNS/IP वैकल्पिक नाम, वैधता और कुंजी उपयोग जाँचें।",
        "Revisa el sujeto, los nombres alternativos DNS/IP, la validez y los usos de clave.",
        "Vérifiez le sujet, les noms alternatifs DNS/IP, la validité et les usages de clé.",
        "Prüfen Sie Betreff, alternative DNS/IP-Namen, Gültigkeit und Schlüsselverwendungen.",
        "サブジェクト、DNS/IPの代替名、有効期間、鍵用途を確認してください。",
        "请检查主体、DNS/IP 备用名称、有效期和密钥用途。",
        "تحقق من الموضوع وأسماء DNS/IP البديلة والصلاحية واستخدامات المفتاح."
    ],
    "Certificate Signing requires CA Certificate; ECDSA keys cannot use key or data encipherment.": [
        "प्रमाणपत्र हस्ताक्षर के लिए CA प्रमाणपत्र ज़रूरी है; ECDSA कुंजियाँ कुंजी या डेटा एन्क्रिप्शन के लिए नहीं हैं।",
        "La firma de certificados requiere un certificado CA; las claves ECDSA no permiten cifrar claves ni datos.",
        "La signature de certificats nécessite un certificat CA ; les clés ECDSA ne chiffrent ni clés ni données.",
        "Zum Signieren von Zertifikaten ist ein CA-Zertifikat nötig; ECDSA-Schlüssel können weder Schlüssel noch Daten verschlüsseln.",
        "証明書署名にはCA証明書が必要です。ECDSA鍵は鍵やデータの暗号化には使用できません。",
        "证书签名需要启用 CA 证书；ECDSA 密钥不能用于密钥加密或数据加密。",
        "يتطلب توقيع الشهادات شهادة CA؛ لا يمكن استخدام مفاتيح ECDSA لتشفير المفاتيح أو البيانات."
    ],
    "Use HTTPS or localhost and a browser that supports the selected Web Crypto algorithm.": [
        "HTTPS या localhost और चुने गए Web Crypto एल्गोरिदम वाला ब्राउज़र इस्तेमाल करें।",
        "Usa HTTPS o localhost y un navegador compatible con el algoritmo Web Crypto elegido.",
        "Utilisez HTTPS ou localhost et un navigateur prenant en charge l’algorithme Web Crypto choisi.",
        "Verwenden Sie HTTPS oder localhost und einen Browser, der den gewählten Web-Crypto-Algorithmus unterstützt.",
        "HTTPSまたはlocalhostと、選択したWeb Cryptoアルゴリズムに対応するブラウザーを使用してください。",
        "请使用 HTTPS 或 localhost，以及支持所选 Web Crypto 算法的浏览器。",
        "استخدم HTTPS أو localhost ومتصفحًا يدعم خوارزمية Web Crypto المحددة."
    ],
    "Certificate generation failed": [
        "प्रमाणपत्र बनाना विफल हुआ",
        "No se pudo generar el certificado",
        "Échec de la génération du certificat",
        "Zertifikatserstellung fehlgeschlagen",
        "証明書を生成できませんでした",
        "证书生成失败",
        "فشل إنشاء الشهادة"
    ],
    "Tried to generate a self-signed X.509 certificate in the browser.": [
        "ब्राउज़र में स्व-हस्ताक्षरित X.509 प्रमाणपत्र बनाने का प्रयास किया गया।",
        "Se intentó generar un certificado X.509 autofirmado en el navegador.",
        "Tentative de génération d’un certificat X.509 autosigné dans le navigateur.",
        "Es wurde versucht, ein selbstsigniertes X.509-Zertifikat im Browser zu erstellen.",
        "ブラウザーで自己署名X.509証明書の生成を試みました。",
        "尝试在浏览器中生成自签名 X.509 证书。",
        "جرت محاولة إنشاء شهادة X.509 موقعة ذاتيًا في المتصفح."
    ],
    "Subject Information": [
        "विषय की जानकारी",
        "Información del sujeto",
        "Informations du sujet",
        "Betreffsangaben",
        "サブジェクト情報",
        "主体信息",
        "معلومات الموضوع"
    ],
    "Common Name (CN) *": [
        "सामान्य नाम (CN) *",
        "Nombre común (CN) *",
        "Nom commun (CN) *",
        "Allgemeiner Name (CN) *",
        "コモンネーム（CN）*",
        "通用名称（CN）*",
        "الاسم الشائع (CN) *"
    ],
    "localhost or your-domain.com": [
        "localhost या your-domain.com",
        "localhost o your-domain.com",
        "localhost ou your-domain.com",
        "localhost oder your-domain.com",
        "localhost または your-domain.com",
        "localhost 或 your-domain.com",
        "localhost أو your-domain.com"
    ],
    "Organization (O)": [
        "संगठन (O)",
        "Organización (O)",
        "Organisation (O)",
        "Organisation (O)",
        "組織（O）",
        "组织（O）",
        "المؤسسة (O)"
    ],
    "Your Company Name": [
        "आपकी कंपनी का नाम",
        "Nombre de tu empresa",
        "Nom de votre entreprise",
        "Ihr Firmenname",
        "会社名",
        "您的公司名称",
        "اسم شركتك"
    ],
    "Organizational Unit (OU)": [
        "संगठन इकाई (OU)",
        "Unidad organizativa (OU)",
        "Unité d’organisation (OU)",
        "Organisationseinheit (OU)",
        "組織単位（OU）",
        "组织单位（OU）",
        "الوحدة التنظيمية (OU)"
    ],
    "IT Department": [
        "आईटी विभाग",
        "Departamento de TI",
        "Service informatique",
        "IT-Abteilung",
        "IT部門",
        "信息技术部门",
        "قسم تقنية المعلومات"
    ],
    "Locality (L)": [
        "स्थान (L)",
        "Localidad (L)",
        "Localité (L)",
        "Ort (L)",
        "市区町村（L）",
        "地区（L）",
        "المدينة (L)"
    ],
    "City": [
        "शहर",
        "Ciudad",
        "Ville",
        "Stadt",
        "市区町村",
        "城市",
        "المدينة"
    ],
    "State/Province (ST)": [
        "राज्य/प्रांत (ST)",
        "Estado o provincia (ST)",
        "État ou province (ST)",
        "Bundesland/Provinz (ST)",
        "都道府県（ST）",
        "州/省（ST）",
        "الولاية/المقاطعة (ST)"
    ],
    "State or Province": [
        "राज्य या प्रांत",
        "Estado o provincia",
        "État ou province",
        "Bundesland oder Provinz",
        "都道府県",
        "州或省",
        "الولاية أو المقاطعة"
    ],
    "Subject Alternative Names (SANs)": [
        "विषय के वैकल्पिक नाम (SANs)",
        "Nombres alternativos del sujeto (SAN)",
        "Noms alternatifs du sujet (SAN)",
        "Alternative Betreffsnamen (SANs)",
        "サブジェクト代替名（SAN）",
        "主体备用名称（SAN）",
        "أسماء الموضوع البديلة (SAN)"
    ],
    "Comma-separated list of domain names and IP addresses": [
        "डोमेन नामों और IP पतों की अल्पविराम से अलग सूची",
        "Lista de dominios y direcciones IP separados por comas",
        "Liste de domaines et d’adresses IP séparés par des virgules",
        "Durch Kommas getrennte Liste von Domainnamen und IP-Adressen",
        "ドメイン名とIPアドレスをカンマで区切って指定",
        "以逗号分隔的域名和 IP 地址列表",
        "قائمة بأسماء النطاقات وعناوين IP مفصولة بفواصل"
    ],
    "Key Settings": [
        "कुंजी सेटिंग",
        "Configuración de clave",
        "Paramètres de clé",
        "Schlüsseleinstellungen",
        "鍵の設定",
        "密钥设置",
        "إعدادات المفتاح"
    ],
    "2048 bits": [
        "2048 बिट",
        "2048 bits",
        "2048 bits",
        "2048 Bit",
        "2048ビット",
        "2048 位",
        "2048 بت"
    ],
    "3072 bits": [
        "3072 बिट",
        "3072 bits",
        "3072 bits",
        "3072 Bit",
        "3072ビット",
        "3072 位",
        "3072 بت"
    ],
    "4096 bits": [
        "4096 बिट",
        "4096 bits",
        "4096 bits",
        "4096 Bit",
        "4096ビット",
        "4096 位",
        "4096 بت"
    ],
    "Validity & Extensions": [
        "वैधता और एक्सटेंशन",
        "Validez y extensiones",
        "Validité et extensions",
        "Gültigkeit und Erweiterungen",
        "有効期間と拡張",
        "有效期与扩展",
        "الصلاحية والامتدادات"
    ],
    "Validity Period (days)": [
        "वैधता अवधि (दिन)",
        "Periodo de validez (días)",
        "Durée de validité (jours)",
        "Gültigkeitsdauer (Tage)",
        "有効期間（日）",
        "有效期（天）",
        "مدة الصلاحية (أيام)"
    ],
    "CA Certificate": [
        "CA प्रमाणपत्र",
        "Certificado CA",
        "Certificat CA",
        "CA-Zertifikat",
        "CA証明書",
        "CA 证书",
        "شهادة CA"
    ],
    "Digital Signature": [
        "डिजिटल हस्ताक्षर",
        "Firma digital",
        "Signature numérique",
        "Digitale Signatur",
        "デジタル署名",
        "数字签名",
        "التوقيع الرقمي"
    ],
    "Key Encipherment": [
        "कुंजी एन्क्रिप्शन",
        "Cifrado de claves",
        "Chiffrement de clés",
        "Schlüsselverschlüsselung",
        "鍵の暗号化",
        "密钥加密",
        "تشفير المفاتيح"
    ],
    "Data Encipherment": [
        "डेटा एन्क्रिप्शन",
        "Cifrado de datos",
        "Chiffrement de données",
        "Datenverschlüsselung",
        "データの暗号化",
        "数据加密",
        "تشفير البيانات"
    ],
    "Certificate Signing": [
        "प्रमाणपत्र हस्ताक्षर",
        "Firma de certificados",
        "Signature de certificats",
        "Zertifikatssignierung",
        "証明書署名",
        "证书签名",
        "توقيع الشهادات"
    ],
    "CRL Signing": [
        "CRL हस्ताक्षर",
        "Firma de CRL",
        "Signature de CRL",
        "CRL-Signierung",
        "CRL署名",
        "CRL 签名",
        "توقيع CRL"
    ],
    "TLS Web Server Authentication": [
        "TLS वेब सर्वर प्रमाणीकरण",
        "Autenticación de servidor web TLS",
        "Authentification de serveur web TLS",
        "TLS-Webserver-Authentifizierung",
        "TLS Webサーバー認証",
        "TLS Web 服务器身份验证",
        "مصادقة خادم ويب TLS"
    ],
    "TLS Web Client Authentication": [
        "TLS वेब क्लाइंट प्रमाणीकरण",
        "Autenticación de cliente web TLS",
        "Authentification de client web TLS",
        "TLS-Webclient-Authentifizierung",
        "TLS Webクライアント認証",
        "TLS Web 客户端身份验证",
        "مصادقة عميل ويب TLS"
    ],
    "Code Signing": [
        "कोड हस्ताक्षर",
        "Firma de código",
        "Signature de code",
        "Codesignierung",
        "コード署名",
        "代码签名",
        "توقيع الشيفرة"
    ],
    "Email Protection (S/MIME)": [
        "ईमेल सुरक्षा (S/MIME)",
        "Protección de correo (S/MIME)",
        "Protection des e-mails (S/MIME)",
        "E-Mail-Schutz (S/MIME)",
        "メール保護（S/MIME）",
        "电子邮件保护（S/MIME）",
        "حماية البريد الإلكتروني (S/MIME)"
    ],
    "Generate Certificate": [
        "प्रमाणपत्र बनाएँ",
        "Generar certificado",
        "Générer le certificat",
        "Zertifikat erstellen",
        "証明書を生成",
        "生成证书",
        "إنشاء شهادة"
    ],
    "Public": [
        "सार्वजनिक",
        "Público",
        "Public",
        "Öffentlich",
        "公開",
        "公开",
        "عام"
    ],
    "Common Name (CN) is required": [
        "सामान्य नाम (CN) आवश्यक है",
        "El nombre común (CN) es obligatorio",
        "Le nom commun (CN) est requis",
        "Der allgemeine Name (CN) ist erforderlich",
        "コモンネーム（CN）が必要です",
        "通用名称（CN）为必填项",
        "الاسم الشائع (CN) مطلوب"
    ],
    "You haven't filled in the Common Name field.": [
        "आपने सामान्य नाम फ़ील्ड नहीं भरा है।",
        "No has rellenado el campo de nombre común.",
        "Vous n’avez pas renseigné le champ Nom commun.",
        "Das Feld für den allgemeinen Namen ist noch leer.",
        "コモンネームの項目が入力されていません。",
        "您尚未填写通用名称字段。",
        "لم تملأ حقل الاسم الشائع."
    ],
    "Enter a fully-qualified domain (e.g., example.com)": [
        "पूरा डोमेन नाम दें (जैसे example.com)",
        "Introduce un dominio completo (p. ej., example.com)",
        "Saisissez un domaine complet (p. ex. example.com)",
        "Geben Sie eine vollständige Domain ein (z. B. example.com)",
        "完全修飾ドメイン名を入力（例：example.com）",
        "输入完整域名（例如 example.com）",
        "أدخل اسم نطاق كاملًا (مثل example.com)"
    ],
    "For wildcards, use *.example.com": [
        "वाइल्डकार्ड के लिए *.example.com इस्तेमाल करें",
        "Para comodines, usa *.example.com",
        "Pour un nom générique, utilisez *.example.com",
        "Verwenden Sie für Platzhalter *.example.com",
        "ワイルドカードには *.example.com を使用",
        "通配符请使用 *.example.com",
        "للأسماء العامة، استخدم *.example.com"
    ],
    "For non-public certs, any identifying string works (e.g., internal-api)": [
        "गैर-सार्वजनिक प्रमाणपत्रों में पहचान वाला नाम दें (जैसे internal-api)",
        "Para certificados privados, usa un nombre identificativo (p. ej., internal-api)",
        "Pour les certificats privés, utilisez un nom identifiant l’entité (p. ex. internal-api)",
        "Für nicht öffentliche Zertifikate genügt ein kennzeichnender Name (z. B. internal-api)",
        "非公開の証明書には識別用の名前を使用（例：internal-api）",
        "非公开证书可使用识别名称（例如 internal-api）",
        "للشهادات غير العامة، استخدم اسمًا تعريفيًا (مثل internal-api)"
    ],
    "Invalid country code": [
        "अमान्य देश कोड",
        "Código de país no válido",
        "Code de pays invalide",
        "Ungültiger Ländercode",
        "国コードが無効です",
        "国家代码无效",
        "رمز البلد غير صالح"
    ],
    "Country must be exactly 2 uppercase letters.": [
        "देश कोड ठीक 2 बड़े अक्षरों का होना चाहिए।",
        "El país debe tener exactamente 2 letras mayúsculas.",
        "Le pays doit comporter exactement 2 lettres majuscules.",
        "Das Land muss aus genau 2 Großbuchstaben bestehen.",
        "国コードは大文字2文字で指定してください。",
        "国家代码必须恰好为 2 个大写字母。",
        "يجب أن يتكون رمز البلد من حرفين كبيرين بالضبط."
    ],
    "Pick a country from the dropdown — it auto-formats correctly.": [
        "ड्रॉपडाउन से देश चुनें — कोड अपने आप सही प्रारूप में होगा।",
        "Elige un país en la lista; el código tendrá el formato correcto.",
        "Choisissez un pays dans la liste ; son code sera correctement formaté.",
        "Wählen Sie ein Land aus der Liste; der Code wird automatisch richtig formatiert.",
        "リストから国を選ぶと、コードが正しい形式になります。",
        "从下拉列表选择国家，代码会自动使用正确格式。",
        "اختر بلدًا من القائمة؛ سيُنسق رمزه بالشكل الصحيح تلقائيًا."
    ],
    "Examples: US, GB, IN, DE, JP.": [
        "उदाहरण: US, GB, IN, DE, JP।",
        "Ejemplos: US, GB, IN, DE, JP.",
        "Exemples : US, GB, IN, DE, JP.",
        "Beispiele: US, GB, IN, DE, JP.",
        "例：US、GB、IN、DE、JP。",
        "示例：US、GB、IN、DE、JP。",
        "أمثلة: US, GB, IN, DE, JP."
    ],
    "Web Crypto API unavailable": [
        "Web Crypto API उपलब्ध नहीं है",
        "Web Crypto API no disponible",
        "Web Crypto API indisponible",
        "Web Crypto API nicht verfügbar",
        "Web Crypto APIを利用できません",
        "Web Crypto API 不可用",
        "واجهة Web Crypto API غير متوفرة"
    ],
    "CSR generation requires the browser's Web Crypto API.": [
        "CSR बनाने के लिए ब्राउज़र का Web Crypto API ज़रूरी है।",
        "Generar un CSR requiere la Web Crypto API del navegador.",
        "La génération d’un CSR nécessite la Web Crypto API du navigateur.",
        "Die CSR-Erstellung erfordert die Web Crypto API des Browsers.",
        "CSRの生成にはブラウザーのWeb Crypto APIが必要です。",
        "生成 CSR 需要浏览器的 Web Crypto API。",
        "يتطلب إنشاء CSR واجهة Web Crypto API في المتصفح."
    ],
    "Web Crypto requires a secure origin (HTTPS or localhost).": [
        "Web Crypto के लिए सुरक्षित स्रोत (HTTPS या localhost) ज़रूरी है।",
        "Web Crypto requiere un origen seguro (HTTPS o localhost).",
        "Web Crypto nécessite une origine sécurisée (HTTPS ou localhost).",
        "Web Crypto erfordert einen sicheren Ursprung (HTTPS oder localhost).",
        "Web Cryptoには安全なオリジン（HTTPSまたはlocalhost）が必要です。",
        "Web Crypto 需要安全来源（HTTPS 或 localhost）。",
        "تتطلب Web Crypto مصدرًا آمنًا (HTTPS أو localhost)."
    ],
    "Open this app over https:// or http://localhost.": [
        "इस ऐप को https:// या http://localhost पर खोलें।",
        "Abre esta aplicación mediante https:// o http://localhost.",
        "Ouvrez cette application via https:// ou http://localhost.",
        "Öffnen Sie diese App über https:// oder http://localhost.",
        "このアプリを https:// または http://localhost で開いてください。",
        "请通过 https:// 或 http://localhost 打开此应用。",
        "افتح هذا التطبيق عبر https:// أو http://localhost."
    ],
    "Use a modern browser (Chrome, Firefox, Safari, Edge — all current versions).": [
        "आधुनिक ब्राउज़र इस्तेमाल करें (Chrome, Firefox, Safari, Edge के वर्तमान संस्करण)।",
        "Usa un navegador moderno (versiones actuales de Chrome, Firefox, Safari o Edge).",
        "Utilisez un navigateur moderne (versions actuelles de Chrome, Firefox, Safari ou Edge).",
        "Verwenden Sie einen aktuellen Browser (Chrome, Firefox, Safari oder Edge).",
        "最新のブラウザー（Chrome、Firefox、Safari、Edge）を使用してください。",
        "请使用现代浏览器（Chrome、Firefox、Safari、Edge 的当前版本）。",
        "استخدم متصفحًا حديثًا (الإصدارات الحالية من Chrome أو Firefox أو Safari أو Edge)."
    ],
    "CSR and private key generated successfully!": [
        "CSR और निजी कुंजी बनाई गई!",
        "¡CSR y clave privada generados!",
        "CSR et clé privée générés !",
        "CSR und privater Schlüssel erstellt!",
        "CSRと秘密鍵を生成しました。",
        "已生成 CSR 和私钥！",
        "تم إنشاء CSR والمفتاح الخاص!"
    ],
    "CSR generation failed": [
        "CSR बनाना विफल हुआ",
        "No se pudo generar el CSR",
        "Échec de la génération du CSR",
        "CSR-Erstellung fehlgeschlagen",
        "CSRを生成できませんでした",
        "CSR 生成失败",
        "فشل إنشاء CSR"
    ],
    "Try a smaller / more standard key size (RSA 2048 or ECDSA P-256).": [
        "छोटा या मानक कुंजी आकार आज़माएँ (RSA 2048 या ECDSA P-256)।",
        "Prueba un tamaño de clave menor o más habitual (RSA 2048 o ECDSA P-256).",
        "Essayez une clé plus petite ou plus courante (RSA 2048 ou ECDSA P-256).",
        "Versuchen Sie eine kleinere oder gängigere Schlüssellänge (RSA 2048 oder ECDSA P-256).",
        "より小さい標準的な鍵（RSA 2048またはECDSA P-256）を試してください。",
        "请尝试较小或更常用的密钥规格（RSA 2048 或 ECDSA P-256）。",
        "جرّب حجم مفتاح أصغر أو أكثر شيوعًا (RSA 2048 أو ECDSA P-256)."
    ],
    "Use the OpenSSL Commands tab if your browser does not support the selected algorithm.": [
        "यदि ब्राउज़र चुना गया एल्गोरिदम समर्थित नहीं करता, तो OpenSSL कमांड टैब इस्तेमाल करें।",
        "Usa la pestaña Comandos OpenSSL si tu navegador no admite el algoritmo seleccionado.",
        "Utilisez l’onglet Commandes OpenSSL si votre navigateur ne prend pas en charge l’algorithme choisi.",
        "Verwenden Sie den Tab OpenSSL-Befehle, wenn Ihr Browser den gewählten Algorithmus nicht unterstützt.",
        "ブラウザーが選択したアルゴリズムに対応していない場合は、OpenSSLコマンドのタブを使用してください。",
        "如果浏览器不支持所选算法，请使用 OpenSSL 命令选项卡。",
        "استخدم تبويب أوامر OpenSSL إذا لم يدعم متصفحك الخوارزمية المحددة."
    ],
    "Check the browser console for more details.": [
        "अधिक जानकारी के लिए ब्राउज़र कंसोल जाँचें।",
        "Consulta la consola del navegador para obtener más detalles.",
        "Consultez la console du navigateur pour plus de détails.",
        "Weitere Details finden Sie in der Browserkonsole.",
        "詳細はブラウザーのコンソールを確認してください。",
        "请查看浏览器控制台了解详情。",
        "راجع وحدة تحكم المتصفح لمزيد من التفاصيل."
    ],
    "Generate CSR": [
        "CSR बनाएँ",
        "Generar CSR",
        "Générer le CSR",
        "CSR erstellen",
        "CSRを生成",
        "生成 CSR",
        "إنشاء CSR"
    ],
    "example.com, *.example.com, or www.example.com": [
        "example.com, *.example.com या www.example.com",
        "example.com, *.example.com o www.example.com",
        "example.com, *.example.com ou www.example.com",
        "example.com, *.example.com oder www.example.com",
        "example.com、*.example.com または www.example.com",
        "example.com、*.example.com 或 www.example.com",
        "example.com أو *.example.com أو www.example.com"
    ],
    "Your Company Name Inc.": [
        "आपकी कंपनी का नाम लिमिटेड",
        "Nombre de tu empresa, S. A.",
        "Nom de votre société",
        "Ihr Firmenname GmbH",
        "株式会社 会社名",
        "您的公司名称有限公司",
        "اسم شركتك المحدودة"
    ],
    "City/Locality (L)": [
        "शहर/स्थान (L)",
        "Ciudad/localidad (L)",
        "Ville/localité (L)",
        "Stadt/Ort (L)",
        "市区町村（L）",
        "城市/地区（L）",
        "المدينة/الموقع (L)"
    ],
    "Email Address": [
        "ईमेल पता",
        "Dirección de correo",
        "Adresse e-mail",
        "E-Mail-Adresse",
        "メールアドレス",
        "电子邮件地址",
        "عنوان البريد الإلكتروني"
    ],
    "Comma-separated list of additional domains or IP addresses": [
        "अतिरिक्त डोमेन या IP पतों की अल्पविराम से अलग सूची",
        "Lista de dominios o direcciones IP adicionales separados por comas",
        "Liste de domaines ou d’adresses IP supplémentaires séparés par des virgules",
        "Durch Kommas getrennte Liste weiterer Domains oder IP-Adressen",
        "追加のドメイン名やIPアドレスをカンマで区切って指定",
        "以逗号分隔的其他域名或 IP 地址列表",
        "قائمة بالنطاقات أو عناوين IP الإضافية مفصولة بفواصل"
    ],
    "Key & Algorithm Settings": [
        "कुंजी और एल्गोरिदम सेटिंग",
        "Configuración de clave y algoritmo",
        "Paramètres de clé et d’algorithme",
        "Schlüssel- und Algorithmuseinstellungen",
        "鍵とアルゴリズムの設定",
        "密钥与算法设置",
        "إعدادات المفتاح والخوارزمية"
    ],
    "RSA (Most Compatible)": [
        "RSA (सबसे अनुकूल)",
        "RSA (más compatible)",
        "RSA (compatibilité maximale)",
        "RSA (höchste Kompatibilität)",
        "RSA（高い互換性）",
        "RSA（兼容性最佳）",
        "RSA (الأكثر توافقًا)"
    ],
    "ECDSA (Modern)": [
        "ECDSA (आधुनिक)",
        "ECDSA (moderno)",
        "ECDSA (moderne)",
        "ECDSA (modern)",
        "ECDSA（モダン）",
        "ECDSA（现代）",
        "ECDSA (حديث)"
    ],
    "1024 bits (Weak - Not Recommended)": [
        "1024 बिट (कमज़ोर — अनुशंसित नहीं)",
        "1024 bits (débil; no recomendado)",
        "1024 bits (faible, déconseillé)",
        "1024 Bit (schwach, nicht empfohlen)",
        "1024ビット（弱いため非推奨）",
        "1024 位（较弱，不推荐）",
        "1024 بت (ضعيف، غير موصى به)"
    ],
    "3072 bits (Strong)": [
        "3072 बिट (मज़बूत)",
        "3072 bits (fuerte)",
        "3072 bits (fort)",
        "3072 Bit (stark)",
        "3072ビット（強力）",
        "3072 位（强）",
        "3072 بت (قوي)"
    ],
    "4096 bits (Very Strong)": [
        "4096 बिट (बहुत मज़बूत)",
        "4096 bits (muy fuerte)",
        "4096 bits (très fort)",
        "4096 Bit (sehr stark)",
        "4096ビット（より強力）",
        "4096 位（很强）",
        "4096 بت (قوي جدًا)"
    ],
    "8192 bits (Maximum)": [
        "8192 बिट (अधिकतम)",
        "8192 bits (máximo)",
        "8192 bits (maximum)",
        "8192 Bit (Maximum)",
        "8192ビット（最大）",
        "8192 位（最大）",
        "8192 بت (الحد الأقصى)"
    ],
    "P-256 (secp256r1) - 128-bit security": [
        "P-256 (secp256r1) — 128-बिट सुरक्षा",
        "P-256 (secp256r1): seguridad de 128 bits",
        "P-256 (secp256r1) — sécurité de 128 bits",
        "P-256 (secp256r1) – 128-Bit-Sicherheit",
        "P-256 (secp256r1) — 128ビット相当の安全性",
        "P-256 (secp256r1) — 128 位安全强度",
        "P-256 (secp256r1) — أمان بمستوى 128 بت"
    ],
    "P-384 (secp384r1) - 192-bit security": [
        "P-384 (secp384r1) — 192-बिट सुरक्षा",
        "P-384 (secp384r1): seguridad de 192 bits",
        "P-384 (secp384r1) — sécurité de 192 bits",
        "P-384 (secp384r1) – 192-Bit-Sicherheit",
        "P-384 (secp384r1) — 192ビット相当の安全性",
        "P-384 (secp384r1) — 192 位安全强度",
        "P-384 (secp384r1) — أمان بمستوى 192 بت"
    ],
    "P-521 (secp521r1) - 256-bit security": [
        "P-521 (secp521r1) — 256-बिट सुरक्षा",
        "P-521 (secp521r1): seguridad de 256 bits",
        "P-521 (secp521r1) — sécurité de 256 bits",
        "P-521 (secp521r1) – 256-Bit-Sicherheit",
        "P-521 (secp521r1) — 256ビット相当の安全性",
        "P-521 (secp521r1) — 256 位安全强度",
        "P-521 (secp521r1) — أمان بمستوى 256 بت"
    ],
    "Hash Algorithm": [
        "हैश एल्गोरिदम",
        "Algoritmo hash",
        "Algorithme de hachage",
        "Hashalgorithmus",
        "ハッシュアルゴリズム",
        "哈希算法",
        "خوارزمية التجزئة"
    ],
    "SHA-256 (Recommended)": [
        "SHA-256 (अनुशंसित)",
        "SHA-256 (recomendado)",
        "SHA-256 (recommandé)",
        "SHA-256 (empfohlen)",
        "SHA-256（推奨）",
        "SHA-256（推荐）",
        "SHA-256 (موصى به)"
    ],
    "Generate CSR & Private Key": [
        "CSR और निजी कुंजी बनाएँ",
        "Generar CSR y clave privada",
        "Générer le CSR et la clé privée",
        "CSR und privaten Schlüssel erstellen",
        "CSRと秘密鍵を生成",
        "生成 CSR 和私钥",
        "إنشاء CSR والمفتاح الخاص"
    ],
    "Important Security Notice": [
        "महत्वपूर्ण सुरक्षा सूचना",
        "Aviso de seguridad importante",
        "Avis de sécurité important",
        "Wichtiger Sicherheitshinweis",
        "セキュリティに関する重要事項",
        "重要安全提示",
        "تنبيه أمني مهم"
    ],
    "Keep your private key secure and never share it. Only submit the CSR to the Certificate Authority. The private key is required to install and use the issued certificate.": [
        "अपनी निजी कुंजी सुरक्षित रखें और कभी साझा न करें। प्रमाणपत्र प्राधिकरण को केवल CSR दें। जारी प्रमाणपत्र स्थापित और इस्तेमाल करने के लिए निजी कुंजी ज़रूरी है।",
        "Protege tu clave privada y no la compartas. Envía solo el CSR a la autoridad certificadora. La clave privada es necesaria para instalar y usar el certificado emitido.",
        "Protégez votre clé privée et ne la partagez jamais. Envoyez uniquement le CSR à l’autorité de certification. La clé privée est nécessaire pour installer et utiliser le certificat émis.",
        "Bewahren Sie Ihren privaten Schlüssel sicher auf und geben Sie ihn niemals weiter. Übermitteln Sie nur die CSR an die Zertifizierungsstelle. Der private Schlüssel wird benötigt, um das ausgestellte Zertifikat zu installieren und zu verwenden.",
        "秘密鍵を安全に保管し、共有しないでください。認証局にはCSRのみを提出します。発行された証明書の導入と利用には秘密鍵が必要です。",
        "请妥善保管私钥，切勿共享。仅将 CSR 提交给证书颁发机构。安装和使用颁发的证书时需要此私钥。",
        "احفظ مفتاحك الخاص بأمان ولا تشاركه أبدًا. أرسل CSR فقط إلى جهة إصدار الشهادات. يلزم المفتاح الخاص لتثبيت الشهادة الصادرة واستخدامها."
    ],
    "Certificate Signing Request": [
        "प्रमाणपत्र हस्ताक्षर अनुरोध",
        "Solicitud de firma de certificado",
        "Demande de signature de certificat",
        "Zertifikatsignierungsanforderung",
        "証明書署名要求",
        "证书签名请求",
        "طلب توقيع الشهادة"
    ],
    "Submit to CA": [
        "CA को भेजें",
        "Enviar a la CA",
        "À soumettre à la CA",
        "Bei der CA einreichen",
        "CAに提出",
        "提交给 CA",
        "يُرسل إلى CA"
    ],
    "OpenSSL Commands": [
        "OpenSSL कमांड",
        "Comandos OpenSSL",
        "Commandes OpenSSL",
        "OpenSSL-Befehle",
        "OpenSSLコマンド",
        "OpenSSL 命令",
        "أوامر OpenSSL"
    ],
    "Generate CSR using OpenSSL": [
        "OpenSSL से CSR बनाएँ",
        "Generar CSR con OpenSSL",
        "Générer un CSR avec OpenSSL",
        "CSR mit OpenSSL erstellen",
        "OpenSSLでCSRを生成",
        "使用 OpenSSL 生成 CSR",
        "إنشاء CSR باستخدام OpenSSL"
    ],
    "Run these commands in a POSIX shell with OpenSSL 1.1.1 or later (Linux, macOS, or Windows WSL/Git Bash).": [
        "ये कमांड OpenSSL 1.1.1 या बाद के संस्करण वाले POSIX शेल में चलाएँ (Linux, macOS या Windows WSL/Git Bash)।",
        "Ejecuta estos comandos en una shell POSIX con OpenSSL 1.1.1 o posterior (Linux, macOS o Windows WSL/Git Bash).",
        "Exécutez ces commandes dans un shell POSIX avec OpenSSL 1.1.1 ou ultérieur (Linux, macOS ou Windows WSL/Git Bash).",
        "Führen Sie diese Befehle in einer POSIX-Shell mit OpenSSL 1.1.1 oder neuer aus (Linux, macOS oder Windows WSL/Git Bash).",
        "OpenSSL 1.1.1以降を利用できるPOSIXシェルで実行してください（Linux、macOS、WindowsのWSL/Git Bash）。",
        "请在安装了 OpenSSL 1.1.1 或更高版本的 POSIX shell 中运行这些命令（Linux、macOS 或 Windows WSL/Git Bash）。",
        "شغّل هذه الأوامر في صدفة POSIX مع OpenSSL 1.1.1 أو أحدث (Linux أو macOS أو Windows WSL/Git Bash)."
    ],
    "Install OpenSSL via:": [
        "OpenSSL ऐसे स्थापित करें:",
        "Instala OpenSSL mediante:",
        "Installez OpenSSL via :",
        "OpenSSL installieren über:",
        "OpenSSLのインストール方法：",
        "通过以下方式安装 OpenSSL：",
        "ثبّت OpenSSL عبر:"
    ],
    "Or download from slproweb.com": [
        "या slproweb.com से डाउनलोड करें",
        "O descárgalo de slproweb.com",
        "Ou téléchargez-le sur slproweb.com",
        "Oder von slproweb.com herunterladen",
        "または slproweb.com からダウンロード",
        "或从 slproweb.com 下载",
        "أو نزّله من slproweb.com"
    ],
    "Or use WSL/Git Bash": [
        "या WSL/Git Bash इस्तेमाल करें",
        "O usa WSL/Git Bash",
        "Ou utilisez WSL/Git Bash",
        "Oder WSL/Git Bash verwenden",
        "または WSL/Git Bash を使用",
        "或使用 WSL/Git Bash",
        "أو استخدم WSL/Git Bash"
    ],
    "Install OpenSSL if it is unavailable:": [
        "यदि OpenSSL उपलब्ध नहीं है तो इसे स्थापित करें:",
        "Instala OpenSSL si no está disponible:",
        "Installez OpenSSL s’il est indisponible :",
        "Installieren Sie OpenSSL, falls es nicht verfügbar ist:",
        "OpenSSLを利用できない場合はインストールしてください：",
        "如果 OpenSSL 不可用，请安装：",
        "ثبّت OpenSSL إذا لم يكن متوفرًا:"
    ],
    "Usually pre-installed, or:": [
        "आमतौर पर पहले से स्थापित, अन्यथा:",
        "Normalmente está preinstalado; si no:",
        "Généralement préinstallé, sinon :",
        "Meist vorinstalliert, andernfalls:",
        "通常はインストール済みです。未導入の場合：",
        "通常已预装，否则可使用：",
        "عادةً ما يكون مثبتًا مسبقًا، وإلا:"
    ],
    "Generated Commands (based on your settings)": [
        "बनाए गए कमांड (आपकी सेटिंग के अनुसार)",
        "Comandos generados (según tu configuración)",
        "Commandes générées (selon vos paramètres)",
        "Erzeugte Befehle (gemäß Ihren Einstellungen)",
        "生成したコマンド（設定に基づく）",
        "生成的命令（基于您的设置）",
        "الأوامر المنشأة (حسب إعداداتك)"
    ],
    "Common OpenSSL CSR Commands": [
        "सामान्य OpenSSL CSR कमांड",
        "Comandos habituales de CSR con OpenSSL",
        "Commandes CSR OpenSSL courantes",
        "Gängige OpenSSL-CSR-Befehle",
        "よく使うOpenSSLのCSRコマンド",
        "常用 OpenSSL CSR 命令",
        "أوامر CSR الشائعة في OpenSSL"
    ],
    "Verify CSR": [
        "CSR सत्यापित करें",
        "Verificar CSR",
        "Vérifier le CSR",
        "CSR prüfen",
        "CSRを検証",
        "验证 CSR",
        "التحقق من CSR"
    ],
    "Verify Key Matches CSR": [
        "जाँचें कि कुंजी CSR से मेल खाती है",
        "Verificar que la clave coincide con el CSR",
        "Vérifier que la clé correspond au CSR",
        "Übereinstimmung von Schlüssel und CSR prüfen",
        "鍵とCSRの一致を確認",
        "验证密钥是否与 CSR 匹配",
        "التحقق من مطابقة المفتاح لـ CSR"
    ],
    "Create Self-Signed Certificate": [
        "स्व-हस्ताक्षरित प्रमाणपत्र बनाएँ",
        "Crear certificado autofirmado",
        "Créer un certificat autosigné",
        "Selbstsigniertes Zertifikat erstellen",
        "自己署名証明書を作成",
        "创建自签名证书",
        "إنشاء شهادة موقعة ذاتيًا"
    ],
    "Generate self-signed certificates and Certificate Signing Requests (CSRs)": [
        "स्व-हस्ताक्षरित प्रमाणपत्र और प्रमाणपत्र हस्ताक्षर अनुरोध (CSR) बनाएँ",
        "Genera certificados autofirmados y solicitudes de firma de certificado (CSR)",
        "Générez des certificats autosignés et des demandes de signature de certificat (CSR)",
        "Selbstsignierte Zertifikate und Zertifikatsignierungsanforderungen (CSRs) erstellen",
        "自己署名証明書と証明書署名要求（CSR）を生成",
        "生成自签名证书和证书签名请求（CSR）",
        "أنشئ شهادات موقعة ذاتيًا وطلبات توقيع شهادات (CSR)"
    ],
    "A self-signed certificate is an X.509 certificate signed by its own private key rather than a trusted CA. A Certificate Signing Request (CSR) is a block of encoded text containing your organization info and public key, submitted to a CA when applying for a certificate.": [
        "स्व-हस्ताक्षरित X.509 प्रमाणपत्र किसी विश्वसनीय CA के बजाय अपनी निजी कुंजी से हस्ताक्षरित होता है। प्रमाणपत्र हस्ताक्षर अनुरोध (CSR) में आपकी संस्था की जानकारी और सार्वजनिक कुंजी एन्कोड होती हैं; प्रमाणपत्र के आवेदन में इसे CA को दिया जाता है।",
        "Un certificado autofirmado es un certificado X.509 firmado con su propia clave privada en vez de una CA de confianza. Una solicitud de firma de certificado (CSR) contiene información de la organización y su clave pública codificadas, y se envía a una CA al solicitar un certificado.",
        "Un certificat autosigné est un certificat X.509 signé avec sa propre clé privée plutôt que par une CA de confiance. Une demande de signature de certificat (CSR) contient les informations de l’organisation et sa clé publique sous forme encodée, et est soumise à une CA pour obtenir un certificat.",
        "Ein selbstsigniertes X.509-Zertifikat wird mit seinem eigenen privaten Schlüssel statt von einer vertrauenswürdigen CA signiert. Eine Zertifikatsignierungsanforderung (CSR) enthält kodierte Organisationsangaben und den öffentlichen Schlüssel und wird für einen Zertifikatsantrag bei einer CA eingereicht.",
        "自己署名証明書は、信頼された認証局ではなく自身の秘密鍵で署名したX.509証明書です。証明書署名要求（CSR）は組織情報と公開鍵をエンコードしたもので、証明書を申請する際に認証局へ提出します。",
        "自签名证书是由自身私钥签名、而非受信任 CA 签名的 X.509 证书。证书签名请求（CSR）以编码形式包含组织信息和公钥，在申请证书时提交给 CA。",
        "الشهادة الموقعة ذاتيًا هي شهادة X.509 يوقعها مفتاحها الخاص بدلًا من جهة CA موثوقة. يتضمن طلب توقيع الشهادة (CSR) معلومات المؤسسة والمفتاح العام بصيغة مرمزة، ويُرسل إلى CA عند طلب شهادة."
    ],
    "Self-signed certificates enable HTTPS during development without cost or CA complexity. CSRs are required to obtain SSL/TLS certificates from public CAs like Let's Encrypt, DigiCert, or Sectigo.": [
        "स्व-हस्ताक्षरित प्रमाणपत्र बिना शुल्क या CA की जटिलताओं के विकास के दौरान HTTPS देते हैं। Let's Encrypt, DigiCert या Sectigo जैसे सार्वजनिक CA से SSL/TLS प्रमाणपत्र पाने के लिए CSR इस्तेमाल होता है।",
        "Los certificados autofirmados permiten usar HTTPS durante el desarrollo sin costes ni trámites con una CA. Los CSR se utilizan para obtener certificados SSL/TLS de CA públicas como Let's Encrypt, DigiCert o Sectigo.",
        "Les certificats autosignés permettent d’utiliser HTTPS pendant le développement sans coût ni démarches auprès d’une CA. Les CSR servent à obtenir des certificats SSL/TLS auprès de CA publiques comme Let's Encrypt, DigiCert ou Sectigo.",
        "Selbstsignierte Zertifikate ermöglichen HTTPS während der Entwicklung ohne Kosten oder CA-Aufwand. CSRs dienen zur Beantragung von SSL/TLS-Zertifikaten bei öffentlichen CAs wie Let's Encrypt, DigiCert oder Sectigo.",
        "自己署名証明書なら、認証局の費用や手続きなしに開発中のHTTPSを利用できます。CSRはLet's Encrypt、DigiCert、Sectigoなどの公開認証局にSSL/TLS証明書を申請する際に使います。",
        "自签名证书可在开发中启用 HTTPS，无需费用或复杂的 CA 流程。CSR 用于向 Let's Encrypt、DigiCert、Sectigo 等公共 CA 申请 SSL/TLS 证书。",
        "تتيح الشهادات الموقعة ذاتيًا استخدام HTTPS أثناء التطوير دون تكلفة أو إجراءات CA المعقدة. تُستخدم طلبات CSR للحصول على شهادات SSL/TLS من جهات عامة مثل Let's Encrypt أو DigiCert أو Sectigo."
    ],
    "Self-Signed: Enter the Common Name, SANs, and key settings, then click Generate": [
        "स्व-हस्ताक्षरित: सामान्य नाम, SAN और कुंजी सेटिंग भरें, फिर बनाएँ दबाएँ",
        "Autofirmado: introduce el nombre común, los SAN y la configuración de clave; pulsa Generar",
        "Autosigné : renseignez le nom commun, les SAN et les paramètres de clé, puis cliquez sur Générer",
        "Selbstsigniert: Allgemeinen Namen, SANs und Schlüsseleinstellungen eingeben, dann Erstellen wählen",
        "自己署名：コモンネーム、SAN、鍵の設定を入力し、生成をクリック",
        "自签名：填写通用名称、SAN 和密钥设置，然后点击生成",
        "التوقيع الذاتي: أدخل الاسم الشائع وأسماء SAN وإعدادات المفتاح، ثم اضغط إنشاء"
    ],
    "CSR Generator: Fill in your organization details and key settings, then click Generate CSR & Private Key": [
        "CSR जनरेटर: संस्था की जानकारी और कुंजी सेटिंग भरें, फिर CSR और निजी कुंजी बनाएँ दबाएँ",
        "Generador CSR: completa los datos de la organización y la clave; pulsa Generar CSR y clave privada",
        "Générateur CSR : renseignez les informations de l’organisation et les paramètres de clé, puis cliquez sur Générer le CSR et la clé privée",
        "CSR-Generator: Organisationsangaben und Schlüsseleinstellungen ausfüllen, dann CSR und privaten Schlüssel erstellen wählen",
        "CSR生成：組織情報と鍵の設定を入力し、CSRと秘密鍵を生成をクリック",
        "CSR 生成器：填写组织信息和密钥设置，然后点击生成 CSR 和私钥",
        "مولد CSR: أدخل تفاصيل المؤسسة وإعدادات المفتاح، ثم اضغط إنشاء CSR والمفتاح الخاص"
    ],
    "Submit the CSR to your Certificate Authority — keep the private key secret": [
        "CSR अपने प्रमाणपत्र प्राधिकरण को दें — निजी कुंजी गुप्त रखें",
        "Envía el CSR a tu autoridad certificadora y mantén secreta la clave privada",
        "Soumettez le CSR à votre autorité de certification et gardez la clé privée secrète",
        "CSR bei Ihrer Zertifizierungsstelle einreichen und den privaten Schlüssel geheim halten",
        "CSRを認証局に提出し、秘密鍵は秘密に保管",
        "将 CSR 提交给证书颁发机构，并保密私钥",
        "أرسل CSR إلى جهة إصدار الشهادات واحتفظ بالمفتاح الخاص سرًا"
    ],
    "Always include 'localhost' and '127.0.0.1' in SANs for local development": [
        "स्थानीय विकास के लिए SAN में 'localhost' और '127.0.0.1' शामिल करें",
        "Incluye 'localhost' y '127.0.0.1' en los SAN para desarrollo local",
        "Incluez 'localhost' et '127.0.0.1' dans les SAN pour le développement local",
        "Für lokale Entwicklung 'localhost' und '127.0.0.1' in die SANs aufnehmen",
        "ローカル開発ではSANに 'localhost' と '127.0.0.1' を含める",
        "本地开发时在 SAN 中包含 'localhost' 和 '127.0.0.1'",
        "أدرج 'localhost' و'127.0.0.1' ضمن SAN للتطوير المحلي"
    ],
    "ECDSA P-256 keys are faster and smaller than RSA 2048": [
        "ECDSA P-256 कुंजियाँ RSA 2048 से तेज़ और छोटी हैं",
        "Las claves ECDSA P-256 son más rápidas y pequeñas que RSA 2048",
        "Les clés ECDSA P-256 sont plus rapides et plus petites que RSA 2048",
        "ECDSA-P-256-Schlüssel sind schneller und kleiner als RSA 2048",
        "ECDSA P-256鍵はRSA 2048より高速でコンパクト",
        "ECDSA P-256 密钥比 RSA 2048 更快、更小",
        "مفاتيح ECDSA P-256 أسرع وأصغر من RSA 2048"
    ],
    "For production certs, use the CSR tab and submit to a trusted CA": [
        "प्रोडक्शन प्रमाणपत्र के लिए CSR टैब इस्तेमाल करके विश्वसनीय CA को भेजें",
        "Para certificados de producción, usa la pestaña CSR y envíalo a una CA de confianza",
        "Pour les certificats de production, utilisez l’onglet CSR et soumettez la demande à une CA de confiance",
        "Für Produktionszertifikate den CSR-Tab verwenden und den Antrag bei einer vertrauenswürdigen CA einreichen",
        "本番用証明書はCSRタブで作成し、信頼できる認証局に提出",
        "生产证书请使用 CSR 选项卡，并提交给受信任的 CA",
        "لشهادات الإنتاج، استخدم تبويب CSR وأرسل الطلب إلى CA موثوقة"
    ],
    "Never use self-signed certificates in production for public-facing services": [
        "सार्वजनिक सेवाओं के प्रोडक्शन में स्व-हस्ताक्षरित प्रमाणपत्र इस्तेमाल न करें",
        "No uses certificados autofirmados en producción para servicios públicos",
        "N’utilisez pas de certificats autosignés en production pour les services publics",
        "Für öffentlich zugängliche Produktionsdienste keine selbstsignierten Zertifikate verwenden",
        "公開サービスの本番環境では自己署名証明書を使用しない",
        "面向公众的生产服务请勿使用自签名证书",
        "لا تستخدم الشهادات الموقعة ذاتيًا لخدمات الإنتاج المتاحة للعامة"
    ],
    "Local development with HTTPS": [
        "HTTPS के साथ स्थानीय विकास",
        "Desarrollo local con HTTPS",
        "Développement local avec HTTPS",
        "Lokale Entwicklung mit HTTPS",
        "HTTPSを使ったローカル開発",
        "使用 HTTPS 进行本地开发",
        "التطوير المحلي باستخدام HTTPS"
    ],
    "Requesting SSL/TLS certificates from CAs": [
        "CA से SSL/TLS प्रमाणपत्र का अनुरोध",
        "Solicitar certificados SSL/TLS a una CA",
        "Demande de certificats SSL/TLS auprès des CA",
        "SSL/TLS-Zertifikate bei CAs beantragen",
        "認証局へのSSL/TLS証明書申請",
        "向 CA 申请 SSL/TLS 证书",
        "طلب شهادات SSL/TLS من جهات CA"
    ],
    "Testing SSL/TLS configurations": [
        "SSL/TLS कॉन्फ़िगरेशन का परीक्षण",
        "Probar configuraciones SSL/TLS",
        "Test des configurations SSL/TLS",
        "SSL/TLS-Konfigurationen testen",
        "SSL/TLS設定のテスト",
        "测试 SSL/TLS 配置",
        "اختبار إعدادات SSL/TLS"
    ],
    "Internal microservice authentication": [
        "आंतरिक माइक्रोसर्विस प्रमाणीकरण",
        "Autenticación interna de microservicios",
        "Authentification interne des microservices",
        "Interne Microservice-Authentifizierung",
        "内部マイクロサービス認証",
        "内部微服务身份验证",
        "مصادقة الخدمات المصغرة الداخلية"
    ],
    "Wildcard and multi-domain (SAN) certificate requests": [
        "वाइल्डकार्ड और बहु-डोमेन (SAN) प्रमाणपत्र अनुरोध",
        "Solicitudes de certificados comodín y multidominio (SAN)",
        "Demandes de certificats génériques et multidomaines (SAN)",
        "Wildcard- und Multidomain-Zertifikatsanträge (SAN)",
        "ワイルドカードと複数ドメイン（SAN）の証明書申請",
        "通配符和多域名（SAN）证书请求",
        "طلبات شهادات الأسماء العامة والمتعددة النطاقات (SAN)"
    ],
    "Self-Signed Certificate": [
        "स्व-हस्ताक्षरित प्रमाणपत्र",
        "Certificado autofirmado",
        "Certificat autosigné",
        "Selbstsigniertes Zertifikat",
        "自己署名証明書",
        "自签名证书",
        "شهادة موقعة ذاتيًا"
    ],
    "CSR Generator": [
        "CSR जनरेटर",
        "Generador de CSR",
        "Générateur de CSR",
        "CSR-Generator",
        "CSR生成",
        "CSR 生成器",
        "مولد CSR"
    ],
    "This form requires a Common Name to identify the domain or entity the certificate is issued for.": [
        "इस फ़ॉर्म में प्रत्येक CSR के लिए सामान्य नाम ज़रूरी है — यह प्रमाणपत्र के डोमेन या संस्था की पहचान करता है।",
        "Cada CSR de este formulario requiere un nombre común que identifique el dominio o la entidad del certificado.",
        "Chaque CSR de ce formulaire nécessite un nom commun identifiant le domaine ou l’entité du certificat.",
        "Jede CSR in diesem Formular benötigt einen allgemeinen Namen, der die Domain oder den Zertifikatsinhaber identifiziert.",
        "このフォームではCSRにコモンネームが必要です。証明書の対象ドメインや組織を識別します。",
        "此表单中的每个 CSR 都需要通用名称，用于标识证书所属的域名或实体。",
        "يتطلب كل CSR في هذا النموذج اسمًا شائعًا يحدد النطاق أو الجهة التي تصدر لها الشهادة."
    ],
    "Ed25519 (requires browser support)": [
        "Ed25519 (ब्राउज़र समर्थन आवश्यक)",
        "Ed25519 (requiere compatibilidad del navegador)",
        "Ed25519 (prise en charge du navigateur requise)",
        "Ed25519 (Browserunterstützung erforderlich)",
        "Ed25519（ブラウザーの対応が必要）",
        "Ed25519（需要浏览器支持）",
        "Ed25519 (يتطلب دعم المتصفح)"
    ],
    "Common Name (CN) is required.": [
        "सामान्य नाम (CN) आवश्यक है।",
        "El nombre común (CN) es obligatorio.",
        "Le nom commun (CN) est requis.",
        "Der allgemeine Name (CN) ist erforderlich.",
        "コモンネーム（CN）が必要です。",
        "通用名称（CN）为必填项。",
        "الاسم الشائع (CN) مطلوب."
    ],
    "Country must be exactly two uppercase letters.": [
        "देश कोड ठीक दो बड़े अक्षरों का होना चाहिए।",
        "El país debe tener exactamente dos letras mayúsculas.",
        "Le pays doit comporter exactement deux lettres majuscules.",
        "Das Land muss aus genau zwei Großbuchstaben bestehen.",
        "国コードは大文字2文字で指定してください。",
        "国家代码必须恰好为两个大写字母。",
        "يجب أن يتكون رمز البلد من حرفين كبيرين بالضبط."
    ],
    "Subject email must be an ASCII email address.": [
        "विषय का ईमेल पता ASCII में होना चाहिए।",
        "El correo del sujeto debe ser una dirección ASCII.",
        "L’adresse e-mail du sujet doit être une adresse ASCII.",
        "Die E-Mail-Adresse des Betreffs muss eine ASCII-Adresse sein.",
        "サブジェクトのメールアドレスはASCIIで指定してください。",
        "主体电子邮件必须是 ASCII 邮件地址。",
        "يجب أن يكون بريد الموضوع عنوان بريد إلكتروني بأحرف ASCII."
    ],
    "Subject fields must contain valid Unicode characters.": [
        "विषय फ़ील्ड में मान्य Unicode वर्ण होने चाहिए।",
        "Los campos del sujeto deben contener caracteres Unicode válidos.",
        "Les champs du sujet doivent contenir des caractères Unicode valides.",
        "Die Betreffsfelder müssen gültige Unicode-Zeichen enthalten.",
        "サブジェクトの各項目には有効なUnicode文字を指定してください。",
        "主体字段必须包含有效的 Unicode 字符。",
        "يجب أن تحتوي حقول الموضوع على محارف Unicode صالحة."
    ],
    "Subject fields cannot contain control characters.": [
        "विषय फ़ील्ड में नियंत्रण वर्ण नहीं हो सकते।",
        "Los campos del sujeto no pueden contener caracteres de control.",
        "Les champs du sujet ne peuvent pas contenir de caractères de contrôle.",
        "Die Betreffsfelder dürfen keine Steuerzeichen enthalten.",
        "サブジェクトの各項目に制御文字は使用できません。",
        "主体字段不能包含控制字符。",
        "لا يمكن أن تحتوي حقول الموضوع على محارف تحكم."
    ],
    "Invalid IPv4 subject alternative name.": [
        "अमान्य IPv4 विषय वैकल्पिक नाम।",
        "Nombre alternativo IPv4 del sujeto no válido.",
        "Nom alternatif IPv4 du sujet invalide.",
        "Ungültiger alternativer IPv4-Name des Betreffs.",
        "IPv4のサブジェクト代替名が無効です。",
        "IPv4 主体备用名称无效。",
        "اسم IPv4 البديل للموضوع غير صالح."
    ],
    "Invalid IPv6 subject alternative name.": [
        "अमान्य IPv6 विषय वैकल्पिक नाम।",
        "Nombre alternativo IPv6 del sujeto no válido.",
        "Nom alternatif IPv6 du sujet invalide.",
        "Ungültiger alternativer IPv6-Name des Betreffs.",
        "IPv6のサブジェクト代替名が無効です。",
        "IPv6 主体备用名称无效。",
        "اسم IPv6 البديل للموضوع غير صالح."
    ],
    "Subject alternative names must be DNS names or IP addresses.": [
        "विषय के वैकल्पिक नाम DNS नाम या IP पते होने चाहिए।",
        "Los nombres alternativos del sujeto deben ser nombres DNS o direcciones IP.",
        "Les noms alternatifs du sujet doivent être des noms DNS ou des adresses IP.",
        "Alternative Betreffsnamen müssen DNS-Namen oder IP-Adressen sein.",
        "サブジェクト代替名にはDNS名またはIPアドレスを指定してください。",
        "主体备用名称必须是 DNS 名称或 IP 地址。",
        "يجب أن تكون أسماء الموضوع البديلة أسماء DNS أو عناوين IP."
    ],
    "Invalid DNS subject alternative name.": [
        "अमान्य DNS विषय वैकल्पिक नाम।",
        "Nombre alternativo DNS del sujeto no válido.",
        "Nom alternatif DNS du sujet invalide.",
        "Ungültiger alternativer DNS-Name des Betreffs.",
        "DNSのサブジェクト代替名が無効です。",
        "DNS 主体备用名称无效。",
        "اسم DNS البديل للموضوع غير صالح."
    ],
    "Use a complete dotted-decimal IPv4 address for an IP subject alternative name.": [
        "IP विषय वैकल्पिक नाम के लिए बिंदुओं से अलग पूरा दशमलव IPv4 पता दें।",
        "Usa una dirección IPv4 decimal completa con puntos como nombre alternativo IP del sujeto.",
        "Utilisez une adresse IPv4 décimale complète avec points comme nom alternatif IP du sujet.",
        "Verwenden Sie für einen alternativen IP-Namen eine vollständige IPv4-Adresse in punktierter Dezimalschreibweise.",
        "IPのサブジェクト代替名にはドット区切りの完全な10進IPv4アドレスを指定してください。",
        "IP 主体备用名称请使用完整的点分十进制 IPv4 地址。",
        "استخدم عنوان IPv4 عشريًا كاملًا مفصولًا بنقاط للاسم البديل من نوع IP."
    ],
    "DNS subject alternative name is too long.": [
        "DNS विषय वैकल्पिक नाम बहुत लंबा है।",
        "El nombre alternativo DNS del sujeto es demasiado largo.",
        "Le nom alternatif DNS du sujet est trop long.",
        "Der alternative DNS-Name des Betreffs ist zu lang.",
        "DNSのサブジェクト代替名が長すぎます。",
        "DNS 主体备用名称过长。",
        "اسم DNS البديل للموضوع طويل جدًا."
    ],
    "Web Crypto requires HTTPS or localhost.": [
        "Web Crypto के लिए HTTPS या localhost ज़रूरी है।",
        "Web Crypto requiere HTTPS o localhost.",
        "Web Crypto nécessite HTTPS ou localhost.",
        "Web Crypto erfordert HTTPS oder localhost.",
        "Web CryptoにはHTTPSまたはlocalhostが必要です。",
        "Web Crypto 需要 HTTPS 或 localhost。",
        "تتطلب Web Crypto استخدام HTTPS أو localhost."
    ],
    "Unsupported signature hash.": [
        "हस्ताक्षर हैश समर्थित नहीं है।",
        "Hash de firma no compatible.",
        "Hachage de signature non pris en charge.",
        "Nicht unterstützter Signatur-Hash.",
        "署名ハッシュはサポートされていません。",
        "不支持的签名哈希。",
        "تجزئة التوقيع غير مدعومة."
    ],
    "Unsupported RSA key size.": [
        "यह RSA कुंजी आकार समर्थित नहीं है।",
        "Tamaño de clave RSA no compatible.",
        "Taille de clé RSA non prise en charge.",
        "Nicht unterstützte RSA-Schlüssellänge.",
        "対応していない RSA 鍵長です。",
        "不支持的 RSA 密钥长度。",
        "حجم مفتاح RSA غير مدعوم."
    ],
    "Unsupported elliptic curve.": [
        "अंडाकार वक्र समर्थित नहीं है।",
        "Curva elíptica no compatible.",
        "Courbe elliptique non prise en charge.",
        "Nicht unterstützte elliptische Kurve.",
        "楕円曲線はサポートされていません。",
        "不支持的椭圆曲线。",
        "المنحنى الإهليلجي غير مدعوم."
    ],
    "Unsupported key algorithm.": [
        "कुंजी एल्गोरिदम समर्थित नहीं है।",
        "Algoritmo de clave no compatible.",
        "Algorithme de clé non pris en charge.",
        "Nicht unterstützter Schlüsselalgorithmus.",
        "鍵アルゴリズムはサポートされていません。",
        "不支持的密钥算法。",
        "خوارزمية المفتاح غير مدعومة."
    ],
    "Ed25519 is unavailable in this browser. Choose RSA/ECDSA or use the OpenSSL command; no substitute key was generated.": [
        "इस ब्राउज़र में Ed25519 उपलब्ध नहीं है। RSA/ECDSA चुनें या OpenSSL कमांड इस्तेमाल करें; कोई वैकल्पिक कुंजी नहीं बनाई गई।",
        "Ed25519 no está disponible en este navegador. Elige RSA/ECDSA o usa el comando OpenSSL; no se generó ninguna clave sustituta.",
        "Ed25519 est indisponible dans ce navigateur. Choisissez RSA/ECDSA ou utilisez la commande OpenSSL ; aucune clé de substitution n’a été générée.",
        "Ed25519 ist in diesem Browser nicht verfügbar. Wählen Sie RSA/ECDSA oder den OpenSSL-Befehl; es wurde kein Ersatzschlüssel erzeugt.",
        "このブラウザーではEd25519を利用できません。RSA/ECDSAを選ぶかOpenSSLコマンドを使用してください。代わりの鍵は生成していません。",
        "此浏览器不支持 Ed25519。请选择 RSA/ECDSA 或使用 OpenSSL 命令；未生成替代算法的密钥。",
        "لا تتوفر Ed25519 في هذا المتصفح. اختر RSA/ECDSA أو استخدم أمر OpenSSL؛ لم يتم إنشاء مفتاح بديل."
    ],
    "Generated signature failed verification.": [
        "बनाए गए हस्ताक्षर का सत्यापन विफल हुआ।",
        "La firma generada no superó la verificación.",
        "La vérification de la signature générée a échoué.",
        "Die Überprüfung der erzeugten Signatur ist fehlgeschlagen.",
        "生成した署名の検証に失敗しました。",
        "生成的签名验证失败。",
        "فشل التحقق من التوقيع الذي تم إنشاؤه."
    ],
    "Unexpected ECDSA signature encoding.": [
        "ECDSA हस्ताक्षर का अप्रत्याशित एन्कोडिंग प्रारूप।",
        "Codificación de firma ECDSA inesperada.",
        "Encodage de signature ECDSA inattendu.",
        "Unerwartete ECDSA-Signaturkodierung.",
        "ECDSA署名のエンコード形式が想定外です。",
        "ECDSA 签名编码异常。",
        "ترميز توقيع ECDSA غير متوقع."
    ],
    "Certificate validity is outside the supported 1950–9999 range.": [
        "प्रमाणपत्र की वैधता समर्थित 1950–9999 सीमा से बाहर है।",
        "La validez del certificado está fuera del intervalo admitido de 1950–9999.",
        "La validité du certificat dépasse l’intervalle pris en charge de 1950–9999.",
        "Die Zertifikatsgültigkeit liegt außerhalb des unterstützten Bereichs 1950–9999.",
        "証明書の有効期間は対応範囲の1950～9999年を超えています。",
        "证书有效期超出支持的 1950–9999 年范围。",
        "صلاحية الشهادة خارج النطاق المدعوم 1950–9999."
    ],
    "Invalid generated public key encoding.": [
        "बनाई गई सार्वजनिक कुंजी का एन्कोडिंग अमान्य है।",
        "Codificación de la clave pública generada no válida.",
        "Encodage de la clé publique générée invalide.",
        "Ungültige Kodierung des erzeugten öffentlichen Schlüssels.",
        "生成した公開鍵のエンコードが無効です。",
        "生成的公钥编码无效。",
        "ترميز المفتاح العام الذي تم إنشاؤه غير صالح."
    ],
    "Validity must be a whole number between 1 and 3650 days.": [
        "वैधता 1 से 3650 दिनों के बीच एक पूर्णांक होनी चाहिए।",
        "La validez debe ser un número entero entre 1 y 3650 días.",
        "La validité doit être un nombre entier entre 1 et 3650 jours.",
        "Die Gültigkeit muss eine ganze Zahl zwischen 1 und 3650 Tagen sein.",
        "有効期間は1～3650日の整数で指定してください。",
        "有效期必须是 1 到 3650 天之间的整数。",
        "يجب أن تكون الصلاحية عددًا صحيحًا بين 1 و3650 يومًا."
    ],
    "Invalid certificate start date.": [
        "प्रमाणपत्र की आरंभ तिथि अमान्य है।",
        "Fecha de inicio del certificado no válida.",
        "Date de début du certificat invalide.",
        "Ungültiges Anfangsdatum des Zertifikats.",
        "証明書の開始日が無効です。",
        "证书开始日期无效。",
        "تاريخ بدء الشهادة غير صالح."
    ],
    "Certificate signing key usage requires CA Certificate to be enabled.": [
        "प्रमाणपत्र हस्ताक्षर कुंजी उपयोग के लिए CA प्रमाणपत्र सक्षम करें।",
        "El uso de firma de certificados requiere habilitar Certificado CA.",
        "L’usage de signature de certificats nécessite d’activer Certificat CA.",
        "Die Schlüsselverwendung für Zertifikatssignaturen erfordert ein aktiviertes CA-Zertifikat.",
        "証明書署名の鍵用途にはCA証明書を有効にする必要があります。",
        "证书签名密钥用途需要启用 CA 证书。",
        "يتطلب استخدام المفتاح لتوقيع الشهادات تفعيل شهادة CA."
    ],
    "ECDSA and Ed25519 signing keys cannot be used for key or data encipherment. Clear those key usages.": [
        "ECDSA और Ed25519 हस्ताक्षर कुंजियाँ कुंजी या डेटा एन्क्रिप्शन के लिए नहीं हैं। वे कुंजी उपयोग हटाएँ।",
        "Las claves de firma ECDSA y Ed25519 no pueden cifrar claves ni datos. Desmarca esos usos de clave.",
        "Les clés de signature ECDSA et Ed25519 ne peuvent chiffrer ni clés ni données. Décochez ces usages de clé.",
        "ECDSA- und Ed25519-Signaturschlüssel können weder Schlüssel noch Daten verschlüsseln. Deaktivieren Sie diese Schlüsselverwendungen.",
        "ECDSAとEd25519の署名鍵は鍵やデータの暗号化に使用できません。これらの鍵用途を解除してください。",
        "ECDSA 和 Ed25519 签名密钥不能用于密钥加密或数据加密。请取消这些密钥用途。",
        "لا يمكن استخدام مفاتيح توقيع ECDSA وEd25519 لتشفير المفاتيح أو البيانات. ألغِ هذه الاستخدامات."
    ],
    "Subject field exceeds its 64-character X.509 limit.": [
        "विषय फ़ील्ड X.509 की 64 वर्ण सीमा से अधिक है।",
        "El campo del sujeto supera su límite X.509 de 64 caracteres.",
        "Le champ du sujet dépasse sa limite X.509 de 64 caractères.",
        "Das Betreffsfeld überschreitet seine X.509-Grenze von 64 Zeichen.",
        "サブジェクトの項目がX.509の64文字制限を超えています。",
        "主体字段超出 X.509 的 64 字符限制。",
        "يتجاوز حقل الموضوع حد X.509 البالغ 64 محرفًا."
    ],
    "Subject field exceeds its 128-character X.509 limit.": [
        "विषय फ़ील्ड X.509 की 128 वर्ण सीमा से अधिक है।",
        "El campo del sujeto supera su límite X.509 de 128 caracteres.",
        "Le champ du sujet dépasse sa limite X.509 de 128 caractères.",
        "Das Betreffsfeld überschreitet seine X.509-Grenze von 128 Zeichen.",
        "サブジェクトの項目がX.509の128文字制限を超えています。",
        "主体字段超出 X.509 的 128 字符限制。",
        "يتجاوز حقل الموضوع حد X.509 البالغ 128 محرفًا."
    ],
    "Subject field exceeds its 255-character X.509 limit.": [
        "विषय फ़ील्ड X.509 की 255 वर्ण सीमा से अधिक है।",
        "El campo del sujeto supera su límite X.509 de 255 caracteres.",
        "Le champ du sujet dépasse sa limite X.509 de 255 caractères.",
        "Das Betreffsfeld überschreitet seine X.509-Grenze von 255 Zeichen.",
        "サブジェクトの項目がX.509の255文字制限を超えています。",
        "主体字段超出 X.509 的 255 字符限制。",
        "يتجاوز حقل الموضوع حد X.509 البالغ 255 محرفًا."
    ],
    "SSH key pair generated successfully!": [
        "SSH कुंजी जोड़ी सफलतापूर्वक बनाई गई!",
        "¡Par de claves SSH generado correctamente!",
        "Paire de clés SSH générée avec succès !",
        "SSH-Schlüsselpaar erfolgreich erstellt!",
        "SSH キーペアを生成しました。",
        "SSH 密钥对已成功生成！",
        "تم إنشاء زوج مفاتيح SSH بنجاح!"
    ],
    "SSH key generation failed": [
        "SSH कुंजी बनाना विफल रहा",
        "No se pudo generar la clave SSH",
        "Échec de la génération de la clé SSH",
        "SSH-Schlüsselerstellung fehlgeschlagen",
        "SSH キーの生成に失敗しました",
        "SSH 密钥生成失败",
        "تعذّر إنشاء مفتاح SSH"
    ],
    "Could not generate a {algorithm} SSH key pair.": [
        "{algorithm} SSH कुंजी जोड़ी नहीं बनाई जा सकी।",
        "No se pudo generar un par de claves SSH {algorithm}.",
        "Impossible de générer une paire de clés SSH {algorithm}.",
        "Ein SSH-Schlüsselpaar mit {algorithm} konnte nicht erstellt werden.",
        "{algorithm} の SSH キーペアを生成できませんでした。",
        "无法生成 {algorithm} SSH 密钥对。",
        "تعذّر إنشاء زوج مفاتيح SSH باستخدام {algorithm}."
    ],
    "Try RSA 4096 if your browser does not support Ed25519.": [
        "यदि आपका ब्राउज़र Ed25519 का समर्थन नहीं करता, तो RSA 4096 आज़माएँ।",
        "Prueba RSA 4096 si tu navegador no admite Ed25519.",
        "Essayez RSA 4096 si votre navigateur ne prend pas en charge Ed25519.",
        "Versuchen Sie RSA 4096, wenn Ihr Browser Ed25519 nicht unterstützt.",
        "ブラウザーが Ed25519 に対応していない場合は、RSA 4096 をお試しください。",
        "如果浏览器不支持 Ed25519，请尝试 RSA 4096。",
        "جرّب RSA 4096 إذا كان متصفحك لا يدعم Ed25519."
    ],
    "Downloaded private keys are unencrypted. Add a passphrase locally with ssh-keygen -p -f followed by the saved private-key path.": [
        "डाउनलोड की गई निजी कुंजियाँ एन्क्रिप्ट नहीं हैं। स्थानीय रूप से पासफ़्रेज़ जोड़ने के लिए ssh-keygen -p -f के बाद सहेजी गई निजी कुंजी का पथ दें।",
        "Las claves privadas descargadas no están cifradas. Añade una frase de contraseña localmente con ssh-keygen -p -f seguido de la ruta de la clave privada guardada.",
        "Les clés privées téléchargées ne sont pas chiffrées. Ajoutez une phrase secrète localement avec ssh-keygen -p -f suivi du chemin de la clé privée enregistrée.",
        "Heruntergeladene private Schlüssel sind unverschlüsselt. Fügen Sie lokal eine Passphrase hinzu: ssh-keygen -p -f gefolgt vom Pfad der gespeicherten privaten Schlüsseldatei.",
        "ダウンロードした秘密鍵は暗号化されていません。ssh-keygen -p -f の後に保存した秘密鍵のパスを指定し、ローカルでパスフレーズを追加してください。",
        "下载的私钥未加密。请在本地使用 ssh-keygen -p -f，后接已保存私钥的路径，添加口令。",
        "المفاتيح الخاصة التي تُنزّلها غير مشفّرة. أضف عبارة مرور محليًا باستخدام ssh-keygen -p -f متبوعًا بمسار المفتاح الخاص المحفوظ."
    ],
    "If your browser blocks Ed25519, fall back to RSA 4096.": [
        "यदि आपका ब्राउज़र Ed25519 को रोकता है, तो RSA 4096 चुनें।",
        "Si tu navegador bloquea Ed25519, selecciona RSA 4096.",
        "Si votre navigateur bloque Ed25519, choisissez RSA 4096.",
        "Wählen Sie RSA 4096, falls Ihr Browser Ed25519 blockiert.",
        "ブラウザーが Ed25519 をブロックする場合は、RSA 4096 を選択してください。",
        "如果浏览器阻止 Ed25519，请改选 RSA 4096。",
        "إذا حظر متصفحك Ed25519، فاختر RSA 4096."
    ],
    "Generate SSH key pairs for secure authentication": [
        "सुरक्षित प्रमाणीकरण के लिए SSH कुंजी जोड़ी बनाएँ",
        "Genera pares de claves SSH para una autenticación segura",
        "Générez des paires de clés SSH pour une authentification sécurisée",
        "SSH-Schlüsselpaare für sichere Authentifizierung erstellen",
        "安全な認証に使う SSH キーペアを生成",
        "生成用于安全身份验证的 SSH 密钥对",
        "أنشئ أزواج مفاتيح SSH للمصادقة الآمنة"
    ],
    "SSH (Secure Shell) keys are cryptographic key pairs used for secure authentication to remote servers without passwords. The public key is placed on servers, while the private key stays on your machine.": [
        "SSH (Secure Shell) कुंजियाँ क्रिप्टोग्राफ़िक कुंजी जोड़ियाँ हैं, जिनसे पासवर्ड के बिना दूरस्थ सर्वर पर सुरक्षित प्रमाणीकरण किया जाता है। सार्वजनिक कुंजी सर्वर पर रखी जाती है और निजी कुंजी आपकी मशीन पर रहती है।",
        "Las claves SSH (Secure Shell) son pares de claves criptográficas para autenticarse de forma segura en servidores remotos sin contraseñas. La clave pública se coloca en los servidores y la privada permanece en tu equipo.",
        "Les clés SSH (Secure Shell) sont des paires de clés cryptographiques permettant une authentification sécurisée aux serveurs distants sans mot de passe. La clé publique est placée sur les serveurs, tandis que la clé privée reste sur votre machine.",
        "SSH-Schlüssel (Secure Shell) sind kryptografische Schlüsselpaare zur sicheren Anmeldung an entfernten Servern ohne Passwort. Der öffentliche Schlüssel wird auf den Servern hinterlegt; der private bleibt auf Ihrem Rechner.",
        "SSH（Secure Shell）キーは、パスワードを使わずリモートサーバーで安全に認証するための暗号鍵ペアです。公開鍵をサーバーに登録し、秘密鍵は自分の端末に保管します。",
        "SSH（Secure Shell）密钥是用于无密码安全登录远程服务器的加密密钥对。公钥放在服务器上，私钥保留在您的计算机上。",
        "مفاتيح SSH ‏(Secure Shell) هي أزواج مفاتيح تشفير تُستخدم للمصادقة الآمنة على الخوادم البعيدة دون كلمات مرور. يُوضع المفتاح العام على الخوادم، بينما يبقى المفتاح الخاص على جهازك."
    ],
    "SSH key authentication is more secure than passwords, enables passwordless login, and is required by many services like GitHub, GitLab, and cloud providers. Keys can be used for automated scripts and CI/CD pipelines.": [
        "SSH कुंजी प्रमाणीकरण पासवर्ड की तुलना में अधिक सुरक्षित है, पासवर्ड के बिना लॉगिन देता है और GitHub, GitLab तथा क्लाउड प्रदाताओं जैसी कई सेवाओं में आवश्यक होता है। कुंजियाँ स्वचालित स्क्रिप्ट और CI/CD पाइपलाइन में भी उपयोग की जा सकती हैं।",
        "La autenticación con claves SSH es más segura que las contraseñas, permite iniciar sesión sin ellas y es necesaria en muchos servicios como GitHub, GitLab y proveedores de nube. Las claves pueden usarse en scripts automatizados y flujos CI/CD.",
        "L’authentification par clé SSH est plus sûre que les mots de passe, permet une connexion sans mot de passe et est requise par de nombreux services comme GitHub, GitLab et les fournisseurs cloud. Les clés peuvent servir aux scripts automatisés et aux pipelines CI/CD.",
        "SSH-Schlüsselauthentifizierung ist sicherer als Passwörter, ermöglicht eine Anmeldung ohne Passwort und wird von vielen Diensten wie GitHub, GitLab und Cloud-Anbietern verlangt. Schlüssel eignen sich auch für automatisierte Skripte und CI/CD-Pipelines.",
        "SSH キー認証はパスワードより安全で、パスワードなしのログインが可能です。GitHub、GitLab、クラウドサービスなどでも求められます。自動化スクリプトや CI/CD パイプラインにも利用できます。",
        "SSH 密钥认证比密码更安全，可实现无密码登录，GitHub、GitLab 和云服务商等许多服务均要求使用。密钥也可用于自动化脚本和 CI/CD 流水线。",
        "المصادقة بمفاتيح SSH أكثر أمانًا من كلمات المرور، وتتيح تسجيل الدخول دون كلمة مرور، وتطلبها خدمات عديدة مثل GitHub وGitLab ومزوّدي الخدمات السحابية. يمكن أيضًا استخدام المفاتيح في السكربتات الآلية ومسارات CI/CD."
    ],
    "Select the key type: RSA (most compatible), ECDSA (modern), or Ed25519 (newest)": [
        "कुंजी का प्रकार चुनें: RSA (सबसे अनुकूल), ECDSA (आधुनिक) या Ed25519 (नवीनतम)",
        "Selecciona el tipo de clave: RSA (más compatible), ECDSA (moderno) o Ed25519 (más reciente)",
        "Choisissez le type de clé : RSA (compatibilité maximale), ECDSA (moderne) ou Ed25519 (plus récent)",
        "Schlüsseltyp auswählen: RSA (höchste Kompatibilität), ECDSA (modern) oder Ed25519 (neuester Typ)",
        "キーの種類を選択：RSA（高い互換性）、ECDSA（モダン）、Ed25519（最新）",
        "选择密钥类型：RSA（兼容性最佳）、ECDSA（现代）或 Ed25519（最新）",
        "اختر نوع المفتاح: RSA (الأكثر توافقًا)، أو ECDSA (حديث)، أو Ed25519 (الأحدث)"
    ],
    "For RSA, choose a key size (4096 bits recommended)": [
        "RSA के लिए कुंजी का आकार चुनें (4096 बिट अनुशंसित)",
        "Para RSA, elige un tamaño de clave (se recomiendan 4096 bits)",
        "Pour RSA, choisissez une taille de clé (4096 bits recommandés)",
        "Für RSA eine Schlüssellänge wählen (4096 Bit empfohlen)",
        "RSA の鍵長を選択（4096 ビットを推奨）",
        "为 RSA 选择密钥长度（推荐 4096 位）",
        "اختر حجم مفتاح RSA (يُوصى بـ 4096 بت)"
    ],
    "Enter a comment (usually your email) for identification": [
        "पहचान के लिए टिप्पणी दर्ज करें (आमतौर पर आपका ईमेल)",
        "Introduce un comentario para identificarla (normalmente tu correo)",
        "Saisissez un commentaire d’identification (généralement votre adresse e-mail)",
        "Kommentar zur Identifikation eingeben (üblicherweise Ihre E-Mail-Adresse)",
        "識別用のコメントを入力（通常はメールアドレス）",
        "输入识别用的备注（通常是电子邮件地址）",
        "أدخل تعليقًا للتعريف بالمفتاح (عادةً بريدك الإلكتروني)"
    ],
    "Private keys are unencrypted; add a passphrase locally with ssh-keygen -p after saving": [
        "निजी कुंजियाँ एन्क्रिप्ट नहीं हैं; सहेजने के बाद स्थानीय रूप से ssh-keygen -p से पासफ़्रेज़ जोड़ें",
        "Las claves privadas no están cifradas; añade una frase de contraseña localmente con ssh-keygen -p después de guardarlas",
        "Les clés privées ne sont pas chiffrées ; ajoutez une phrase secrète localement avec ssh-keygen -p après l’enregistrement",
        "Private Schlüssel sind unverschlüsselt; nach dem Speichern lokal mit ssh-keygen -p eine Passphrase hinzufügen",
        "秘密鍵は暗号化されていません。保存後、ローカルで ssh-keygen -p を実行してパスフレーズを追加してください",
        "私钥未加密；保存后请在本地使用 ssh-keygen -p 添加口令",
        "المفاتيح الخاصة غير مشفّرة؛ أضف عبارة مرور محليًا باستخدام ssh-keygen -p بعد الحفظ"
    ],
    "Click Generate to create your SSH key pair": [
        "अपनी SSH कुंजी जोड़ी बनाने के लिए बनाएँ पर क्लिक करें",
        "Pulsa Generar para crear tu par de claves SSH",
        "Cliquez sur Générer pour créer votre paire de clés SSH",
        "Auf Erstellen klicken, um Ihr SSH-Schlüsselpaar zu erzeugen",
        "生成をクリックして SSH キーペアを作成",
        "点击“生成”创建 SSH 密钥对",
        "انقر على إنشاء لتوليد زوج مفاتيح SSH"
    ],
    "Add the public key to ~/.ssh/authorized_keys on servers": [
        "सर्वर पर सार्वजनिक कुंजी ~/.ssh/authorized_keys में जोड़ें",
        "Añade la clave pública a ~/.ssh/authorized_keys en los servidores",
        "Ajoutez la clé publique à ~/.ssh/authorized_keys sur les serveurs",
        "Öffentlichen Schlüssel auf den Servern zu ~/.ssh/authorized_keys hinzufügen",
        "サーバーの ~/.ssh/authorized_keys に公開鍵を追加",
        "将公钥添加到服务器上的 ~/.ssh/authorized_keys",
        "أضف المفتاح العام إلى ~/.ssh/authorized_keys على الخوادم"
    ],
    "Save the matching private and public files, then set the private file permissions to chmod 600": [
        "संबंधित निजी और सार्वजनिक फ़ाइलें सहेजें, फिर chmod 600 से निजी फ़ाइल की अनुमतियाँ सेट करें",
        "Guarda los archivos privado y público correspondientes y establece los permisos del privado con chmod 600",
        "Enregistrez les fichiers privé et public correspondants, puis définissez les permissions du fichier privé avec chmod 600",
        "Zugehörige private und öffentliche Schlüsseldateien speichern und die Berechtigungen der privaten Datei mit chmod 600 setzen",
        "対応する秘密鍵と公開鍵のファイルを保存し、秘密鍵ファイルの権限を chmod 600 で設定",
        "保存配对的私钥和公钥文件，然后使用 chmod 600 设置私钥文件权限",
        "احفظ ملفّي المفتاح الخاص والعام المتطابقين، ثم اضبط أذونات الملف الخاص باستخدام chmod 600"
    ],
    "Ed25519 requires browser support; unsupported browsers report an error without changing the selected algorithm": [
        "Ed25519 के लिए ब्राउज़र का समर्थन आवश्यक है; समर्थन न होने पर चुना गया एल्गोरिथ्म बदले बिना त्रुटि दिखाई जाती है",
        "Ed25519 requiere compatibilidad del navegador; los navegadores no compatibles muestran un error sin cambiar el algoritmo seleccionado",
        "Ed25519 nécessite la prise en charge du navigateur ; les navigateurs incompatibles signalent une erreur sans modifier l’algorithme choisi",
        "Ed25519 benötigt Browserunterstützung; nicht unterstützte Browser melden einen Fehler, ohne den gewählten Algorithmus zu ändern",
        "Ed25519 にはブラウザーの対応が必要です。非対応の場合、選択したアルゴリズムを変更せずエラーを表示します",
        "Ed25519 需要浏览器支持；不支持的浏览器会报告错误，不会更改所选算法",
        "يتطلب Ed25519 دعم المتصفح؛ تعرض المتصفحات غير الداعمة خطأ دون تغيير الخوارزمية المختارة"
    ],
    "Always protect private keys with file permissions (chmod 600)": [
        "निजी कुंजियों को हमेशा फ़ाइल अनुमतियों से सुरक्षित रखें (chmod 600)",
        "Protege siempre las claves privadas con permisos de archivo (chmod 600)",
        "Protégez toujours les clés privées par les permissions du fichier (chmod 600)",
        "Private Schlüssel immer durch Dateiberechtigungen schützen (chmod 600)",
        "秘密鍵は必ずファイル権限で保護してください（chmod 600）",
        "始终使用文件权限保护私钥（chmod 600）",
        "احمِ المفاتيح الخاصة دائمًا بأذونات الملفات (chmod 600)"
    ],
    "Use ssh-keygen -p -f with the saved private-key path to add a passphrase": [
        "पासफ़्रेज़ जोड़ने के लिए ssh-keygen -p -f के साथ सहेजी गई निजी कुंजी का पथ दें",
        "Usa ssh-keygen -p -f con la ruta de la clave privada guardada para añadir una frase de contraseña",
        "Utilisez ssh-keygen -p -f avec le chemin de la clé privée enregistrée pour ajouter une phrase secrète",
        "Mit ssh-keygen -p -f und dem Pfad der gespeicherten privaten Schlüsseldatei eine Passphrase hinzufügen",
        "ssh-keygen -p -f に保存した秘密鍵のパスを指定してパスフレーズを追加",
        "使用 ssh-keygen -p -f 并指定已保存私钥的路径来添加口令",
        "استخدم ssh-keygen -p -f مع مسار المفتاح الخاص المحفوظ لإضافة عبارة مرور"
    ],
    "Use ssh-agent to avoid typing passphrases repeatedly": [
        "बार-बार पासफ़्रेज़ दर्ज करने से बचने के लिए ssh-agent का उपयोग करें",
        "Usa ssh-agent para evitar introducir la frase de contraseña repetidamente",
        "Utilisez ssh-agent pour éviter de ressaisir les phrases secrètes",
        "Mit ssh-agent die wiederholte Eingabe von Passphrasen vermeiden",
        "ssh-agent を使うとパスフレーズの繰り返し入力を省けます",
        "使用 ssh-agent 避免重复输入口令",
        "استخدم ssh-agent لتجنّب كتابة عبارات المرور مرارًا"
    ],
    "Different keys for different services improves security": [
        "अलग-अलग सेवाओं के लिए अलग कुंजियाँ सुरक्षा बढ़ाती हैं",
        "Usar claves distintas para cada servicio mejora la seguridad",
        "Utiliser des clés différentes selon les services améliore la sécurité",
        "Unterschiedliche Schlüssel für verschiedene Dienste erhöhen die Sicherheit",
        "サービスごとに異なるキーを使うと安全性が高まります",
        "为不同服务使用不同密钥可提高安全性",
        "استخدام مفاتيح مختلفة للخدمات المختلفة يعزّز الأمان"
    ],
    "GitHub/GitLab authentication": [
        "GitHub/GitLab प्रमाणीकरण",
        "Autenticación en GitHub/GitLab",
        "Authentification GitHub/GitLab",
        "GitHub/GitLab-Authentifizierung",
        "GitHub/GitLab 認証",
        "GitHub/GitLab 身份验证",
        "المصادقة على GitHub/GitLab"
    ],
    "Remote server SSH access": [
        "दूरस्थ सर्वर तक SSH पहुँच",
        "Acceso SSH a servidores remotos",
        "Accès SSH aux serveurs distants",
        "SSH-Zugriff auf entfernte Server",
        "リモートサーバーへの SSH アクセス",
        "远程服务器 SSH 访问",
        "الوصول إلى الخوادم البعيدة عبر SSH"
    ],
    "CI/CD pipeline authentication": [
        "CI/CD पाइपलाइन प्रमाणीकरण",
        "Autenticación en flujos CI/CD",
        "Authentification des pipelines CI/CD",
        "Authentifizierung für CI/CD-Pipelines",
        "CI/CD パイプラインの認証",
        "CI/CD 流水线身份验证",
        "مصادقة مسارات CI/CD"
    ],
    "Cloud provider access (AWS, GCP, Azure)": [
        "क्लाउड प्रदाता तक पहुँच (AWS, GCP, Azure)",
        "Acceso a proveedores de nube (AWS, GCP, Azure)",
        "Accès aux fournisseurs cloud (AWS, GCP, Azure)",
        "Zugriff auf Cloud-Anbieter (AWS, GCP, Azure)",
        "クラウドサービスへのアクセス（AWS, GCP, Azure）",
        "云服务商访问（AWS, GCP, Azure）",
        "الوصول إلى مزوّدي الخدمات السحابية (AWS, GCP, Azure)"
    ],
    "Automated deployment scripts": [
        "स्वचालित परिनियोजन स्क्रिप्ट",
        "Scripts de despliegue automatizado",
        "Scripts de déploiement automatisé",
        "Automatisierte Bereitstellungsskripte",
        "自動デプロイスクリプト",
        "自动化部署脚本",
        "سكربتات النشر الآلي"
    ],
    "Browser-Generated SSH Keys": [
        "ब्राउज़र में बनी SSH कुंजियाँ",
        "Claves SSH generadas en el navegador",
        "Clés SSH générées dans le navigateur",
        "Im Browser erzeugte SSH-Schlüssel",
        "ブラウザーで生成する SSH キー",
        "浏览器生成的 SSH 密钥",
        "مفاتيح SSH المُنشأة في المتصفح"
    ],
    "Real RSA, ECDSA and Ed25519 keys are generated locally with Web Crypto and exported in OpenSSH format. Private keys are unencrypted. Save them with chmod 600 and add a passphrase locally using ssh-keygen -p -f followed by the private-key path.": [
        "वास्तविक RSA, ECDSA और Ed25519 कुंजियाँ स्थानीय रूप से Web Crypto से बनाई जाती हैं और OpenSSH प्रारूप में निर्यात होती हैं। निजी कुंजियाँ एन्क्रिप्ट नहीं हैं। उन्हें chmod 600 अनुमतियों से सहेजें और स्थानीय रूप से पासफ़्रेज़ जोड़ने के लिए ssh-keygen -p -f के बाद निजी कुंजी का पथ दें।",
        "Se generan claves RSA, ECDSA y Ed25519 reales localmente con Web Crypto y se exportan en formato OpenSSH. Las claves privadas no están cifradas. Guárdalas con chmod 600 y añade una frase de contraseña localmente con ssh-keygen -p -f seguido de la ruta de la clave privada.",
        "De véritables clés RSA, ECDSA et Ed25519 sont générées localement avec Web Crypto et exportées au format OpenSSH. Les clés privées ne sont pas chiffrées. Enregistrez-les avec les permissions chmod 600, puis ajoutez une phrase secrète localement avec ssh-keygen -p -f suivi du chemin de la clé privée.",
        "Echte RSA-, ECDSA- und Ed25519-Schlüssel werden lokal mit Web Crypto erstellt und im OpenSSH-Format exportiert. Private Schlüssel sind unverschlüsselt. Speichern Sie sie mit chmod 600 und fügen Sie lokal mit ssh-keygen -p -f gefolgt vom Pfad der privaten Schlüsseldatei eine Passphrase hinzu.",
        "Web Crypto を使って RSA、ECDSA、Ed25519 の実際のキーをローカルで生成し、OpenSSH 形式で出力します。秘密鍵は暗号化されていません。chmod 600 で権限を設定して保存し、ssh-keygen -p -f の後に秘密鍵のパスを指定してローカルでパスフレーズを追加してください。",
        "使用 Web Crypto 在本地生成真正的 RSA、ECDSA 和 Ed25519 密钥，并以 OpenSSH 格式导出。私钥未加密。请以 chmod 600 权限保存，再在本地使用 ssh-keygen -p -f，后接私钥路径，添加口令。",
        "تُنشأ مفاتيح RSA وECDSA وEd25519 حقيقية محليًا باستخدام Web Crypto وتُصدَّر بصيغة OpenSSH. المفاتيح الخاصة غير مشفّرة. احفظها بأذونات chmod 600 وأضف عبارة مرور محليًا باستخدام ssh-keygen -p -f متبوعًا بمسار المفتاح الخاص."
    ],
    "Ed25519 (Newest)": [
        "Ed25519 (नवीनतम)",
        "Ed25519 (más reciente)",
        "Ed25519 (plus récent)",
        "Ed25519 (neuester Typ)",
        "Ed25519（最新）",
        "Ed25519（最新）",
        "Ed25519 (الأحدث)"
    ],
    "2048 bits (Minimum)": [
        "2048 बिट (न्यूनतम)",
        "2048 bits (mínimo)",
        "2048 bits (minimum)",
        "2048 Bit (Minimum)",
        "2048 ビット（最小）",
        "2048 位（最低）",
        "2048 بت (الحد الأدنى)"
    ],
    "3072 bits (Good)": [
        "3072 बिट (अच्छा)",
        "3072 bits (bueno)",
        "3072 bits (bon)",
        "3072 Bit (gut)",
        "3072 ビット（良好）",
        "3072 位（良好）",
        "3072 بت (جيد)"
    ],
    "4096 bits (Recommended)": [
        "4096 बिट (अनुशंसित)",
        "4096 bits (recomendado)",
        "4096 bits (recommandé)",
        "4096 Bit (empfohlen)",
        "4096 ビット（推奨）",
        "4096 位（推荐）",
        "4096 بت (موصى به)"
    ],
    "nistp256 (256 bits)": [
        "nistp256 (256 बिट)",
        "nistp256 (256 bits)",
        "nistp256 (256 bits)",
        "nistp256 (256 Bit)",
        "nistp256（256 ビット）",
        "nistp256（256 位）",
        "nistp256 (256 بت)"
    ],
    "nistp384 (384 bits)": [
        "nistp384 (384 बिट)",
        "nistp384 (384 bits)",
        "nistp384 (384 bits)",
        "nistp384 (384 Bit)",
        "nistp384（384 ビット）",
        "nistp384（384 位）",
        "nistp384 (384 بت)"
    ],
    "nistp521 (521 bits)": [
        "nistp521 (521 बिट)",
        "nistp521 (521 bits)",
        "nistp521 (521 bits)",
        "nistp521 (521 Bit)",
        "nistp521（521 ビット）",
        "nistp521（521 位）",
        "nistp521 (521 بت)"
    ],
    "Comment (Email or Identifier)": [
        "टिप्पणी (ईमेल या पहचानकर्ता)",
        "Comentario (correo o identificador)",
        "Commentaire (e-mail ou identifiant)",
        "Kommentar (E-Mail oder Kennung)",
        "コメント（メールアドレスまたは識別子）",
        "备注（电子邮件或标识符）",
        "التعليق (البريد الإلكتروني أو المعرّف)"
    ],
    "Generate SSH Key Pair": [
        "SSH कुंजी जोड़ी बनाएँ",
        "Generar par de claves SSH",
        "Générer une paire de clés SSH",
        "SSH-Schlüsselpaar erstellen",
        "SSH キーペアを生成",
        "生成 SSH 密钥对",
        "إنشاء زوج مفاتيح SSH"
    ],
    "Fingerprint:": [
        "फ़िंगरप्रिंट:",
        "Huella:",
        "Empreinte :",
        "Fingerabdruck:",
        "フィンガープリント：",
        "指纹：",
        "البصمة:"
    ],
    "Add to servers": [
        "सर्वर में जोड़ें",
        "Añadir a los servidores",
        "Ajouter aux serveurs",
        "Auf Servern hinterlegen",
        "サーバーに追加",
        "添加到服务器",
        "أضف إلى الخوادم"
    ],
    "Add this to": [
        "इसे जोड़ें:",
        "Añade esto a",
        "Ajoutez ceci à",
        "Diesen Schlüssel hinzufügen zu",
        "追加先：",
        "将其添加到",
        "أضف هذا إلى"
    ],
    "on remote servers, or to GitHub/GitLab SSH settings.": [
        "दूरस्थ सर्वर पर, या GitHub/GitLab की SSH सेटिंग में।",
        "en servidores remotos, o a la configuración SSH de GitHub/GitLab.",
        "sur les serveurs distants, ou aux paramètres SSH de GitHub/GitLab.",
        "auf entfernten Servern oder in den SSH-Einstellungen von GitHub/GitLab.",
        "リモートサーバー上、または GitHub/GitLab の SSH 設定。",
        "（远程服务器上），或 GitHub/GitLab 的 SSH 设置。",
        "على الخوادم البعيدة، أو إلى إعدادات SSH في GitHub/GitLab."
    ],
    "Private Key (unencrypted OpenSSH)": [
        "निजी कुंजी (बिना एन्क्रिप्शन का OpenSSH)",
        "Clave privada (OpenSSH sin cifrar)",
        "Clé privée (OpenSSH non chiffré)",
        "Privater Schlüssel (OpenSSH, unverschlüsselt)",
        "秘密鍵（暗号化なしの OpenSSH）",
        "私钥（未加密的 OpenSSH）",
        "المفتاح الخاص (OpenSSH غير مشفّر)"
    ],
    "Never share your private key!": [
        "अपनी निजी कुंजी कभी साझा न करें!",
        "¡Nunca compartas tu clave privada!",
        "Ne partagez jamais votre clé privée !",
        "Geben Sie Ihren privaten Schlüssel niemals weiter!",
        "秘密鍵は絶対に共有しないでください。",
        "切勿分享您的私钥！",
        "لا تشارك مفتاحك الخاص أبدًا!"
    ],
    "Save the private file with chmod 600. Add a passphrase with ssh-keygen -p -f followed by its path. Keep a protected backup.": [
        "निजी फ़ाइल को chmod 600 अनुमतियों से सहेजें। पासफ़्रेज़ जोड़ने के लिए ssh-keygen -p -f के बाद उसका पथ दें। सुरक्षित बैकअप रखें।",
        "Guarda el archivo privado con chmod 600. Añade una frase de contraseña con ssh-keygen -p -f seguido de su ruta. Conserva una copia de seguridad protegida.",
        "Enregistrez le fichier privé avec les permissions chmod 600. Ajoutez une phrase secrète avec ssh-keygen -p -f suivi de son chemin. Conservez une sauvegarde protégée.",
        "Speichern Sie die private Datei mit chmod 600. Fügen Sie mit ssh-keygen -p -f gefolgt von ihrem Pfad eine Passphrase hinzu. Bewahren Sie eine geschützte Sicherung auf.",
        "秘密鍵ファイルは chmod 600 の権限で保存してください。ssh-keygen -p -f の後にそのパスを指定してパスフレーズを追加します。保護されたバックアップを保管してください。",
        "以 chmod 600 权限保存私钥文件。使用 ssh-keygen -p -f，后接其路径，添加口令。请保留受保护的备份。",
        "احفظ الملف الخاص بأذونات chmod 600. أضف عبارة مرور باستخدام ssh-keygen -p -f متبوعًا بمساره. احتفظ بنسخة احتياطية محمية."
    ],
    "Usage Instructions": [
        "उपयोग के निर्देश",
        "Instrucciones de uso",
        "Instructions d’utilisation",
        "Gebrauchsanleitung",
        "使用手順",
        "使用说明",
        "تعليمات الاستخدام"
    ],
    "1. Save the private key:": [
        "1. निजी कुंजी सहेजें:",
        "1. Guarda la clave privada:",
        "1. Enregistrez la clé privée :",
        "1. Privaten Schlüssel speichern:",
        "1. 秘密鍵を保存：",
        "1. 保存私钥：",
        "1. احفظ المفتاح الخاص:"
    ],
    "2. Copy public key to server:": [
        "2. सार्वजनिक कुंजी सर्वर पर कॉपी करें:",
        "2. Copia la clave pública al servidor:",
        "2. Copiez la clé publique sur le serveur :",
        "2. Öffentlichen Schlüssel auf den Server kopieren:",
        "2. 公開鍵をサーバーにコピー：",
        "2. 将公钥复制到服务器：",
        "2. انسخ المفتاح العام إلى الخادم:"
    ],
    "The browser did not export the required SSH key material.": [
        "ब्राउज़र ने आवश्यक SSH कुंजी सामग्री निर्यात नहीं की।",
        "El navegador no exportó el material necesario de la clave SSH.",
        "Le navigateur n’a pas exporté les données nécessaires à la clé SSH.",
        "Der Browser hat das erforderliche SSH-Schlüsselmaterial nicht exportiert.",
        "ブラウザーが必要な SSH キー情報を出力しませんでした。",
        "浏览器未导出所需的 SSH 密钥材料。",
        "لم يصدّر المتصفح بيانات مفتاح SSH المطلوبة."
    ],
    "The SSH comment must be a single line without control characters.": [
        "SSH टिप्पणी एक पंक्ति में होनी चाहिए और उसमें नियंत्रण वर्ण नहीं होने चाहिए।",
        "El comentario SSH debe ocupar una sola línea y no contener caracteres de control.",
        "Le commentaire SSH doit tenir sur une seule ligne, sans caractères de contrôle.",
        "Der SSH-Kommentar muss aus einer Zeile ohne Steuerzeichen bestehen.",
        "SSH のコメントは制御文字を含まない 1 行にしてください。",
        "SSH 备注必须为单行，且不能包含控制字符。",
        "يجب أن يكون تعليق SSH في سطر واحد دون محارف تحكّم."
    ],
    "The SSH comment must contain valid Unicode text.": [
        "SSH टिप्पणी में मान्य Unicode पाठ होना चाहिए।",
        "El comentario SSH debe contener texto Unicode válido.",
        "Le commentaire SSH doit contenir du texte Unicode valide.",
        "Der SSH-Kommentar muss gültigen Unicode-Text enthalten.",
        "SSH のコメントには有効な Unicode テキストを指定してください。",
        "SSH 备注必须包含有效的 Unicode 文本。",
        "يجب أن يحتوي تعليق SSH على نص Unicode صالح."
    ],
    "Unsupported SSH key type.": [
        "यह SSH कुंजी प्रकार समर्थित नहीं है।",
        "Tipo de clave SSH no compatible.",
        "Type de clé SSH non pris en charge.",
        "Nicht unterstützter SSH-Schlüsseltyp.",
        "対応していない SSH キーの種類です。",
        "不支持的 SSH 密钥类型。",
        "نوع مفتاح SSH غير مدعوم."
    ],
    "Unsupported ECDSA curve.": [
        "यह ECDSA वक्र समर्थित नहीं है।",
        "Curva ECDSA no compatible.",
        "Courbe ECDSA non prise en charge.",
        "Nicht unterstützte ECDSA-Kurve.",
        "対応していない ECDSA 曲線です。",
        "不支持的 ECDSA 曲线。",
        "منحنى ECDSA غير مدعوم."
    ],
    "The browser returned invalid Ed25519 key material.": [
        "ब्राउज़र ने अमान्य Ed25519 कुंजी सामग्री लौटाई।",
        "El navegador devolvió material de clave Ed25519 no válido.",
        "Le navigateur a renvoyé des données de clé Ed25519 invalides.",
        "Der Browser hat ungültiges Ed25519-Schlüsselmaterial zurückgegeben.",
        "ブラウザーが無効な Ed25519 キー情報を返しました。",
        "浏览器返回了无效的 Ed25519 密钥材料。",
        "أعاد المتصفح بيانات مفتاح Ed25519 غير صالحة."
    ]
};
