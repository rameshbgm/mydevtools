import type { TranslationColumns } from "./tool-names";

// Authored interface/help and presentation-only findings. Keys, credentials,
// protocol values, generated commands and raw diagnostics remain exact.
export const SECURITY_HELPER_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Build PKCS#12 from PEM and prepare Java keytool commands for JKS": [
        "PEM से PKCS#12 बनाएँ और JKS के लिए Java keytool कमांड तैयार करें",
        "Crear PKCS#12 desde PEM y preparar comandos Java keytool para JKS",
        "Créer un PKCS#12 depuis PEM et préparer les commandes Java keytool pour JKS",
        "PKCS#12 aus PEM erstellen und Java-keytool-Befehle für JKS vorbereiten",
        "PEMからPKCS#12を作成し、JKS用のJava keytoolコマンドを準備",
        "从 PEM 创建 PKCS#12 并准备 JKS 的 Java keytool 命令",
        "إنشاء PKCS#12 من PEM وإعداد أوامر Java keytool لـ JKS"
    ],
    "JKS is a Java keystore format used by legacy applications. Java 9 and newer use PKCS#12 as the default keystore format.": [
        "JKS पुराने Java अनुप्रयोगों का कीस्टोर प्रारूप है। Java 9 और बाद के संस्करणों में डिफ़ॉल्ट PKCS#12 है।",
        "JKS es un formato de almacén de claves usado por aplicaciones Java antiguas. Desde Java 9, el formato predeterminado es PKCS#12.",
        "JKS est un format de magasin de clés utilisé par les anciennes applications Java. Depuis Java 9, le format par défaut est PKCS#12.",
        "JKS ist ein Schlüsselspeicherformat älterer Java-Anwendungen. Seit Java 9 ist PKCS#12 das Standardformat.",
        "JKSは従来のJavaアプリで使われるキーストア形式です。Java 9以降の標準形式はPKCS#12です。",
        "JKS 是旧版 Java 应用使用的密钥库格式。Java 9 及更新版本默认使用 PKCS#12。",
        "JKS تنسيق مخزن مفاتيح تستخدمه تطبيقات Java القديمة. ومنذ Java 9 أصبح PKCS#12 التنسيق الافتراضي."
    ],
    "This page builds a PKCS#12 file from PEM certificates and an RSA private key. It prepares keytool commands for you to run with Java; it does not read, inspect, or create native JKS files in this browser.": [
        "यह पृष्ठ PEM प्रमाणपत्रों और RSA निजी कुंजी से PKCS#12 बनाता है। keytool कमांड Java में चलानी होती हैं; ब्राउज़र में मूल JKS फ़ाइल पढ़ना, जाँचना या बनाना समर्थित नहीं है।",
        "Esta página crea PKCS#12 a partir de certificados PEM y una clave privada RSA. Prepara comandos keytool para ejecutar con Java; no lee, inspecciona ni crea archivos JKS nativos en el navegador.",
        "Cette page crée un PKCS#12 à partir de certificats PEM et d’une clé privée RSA. Les commandes keytool se lancent avec Java ; le navigateur ne lit, n’inspecte ni ne crée de fichier JKS natif.",
        "Diese Seite erstellt PKCS#12 aus PEM-Zertifikaten und einem privaten RSA-Schlüssel. keytool-Befehle werden mit Java ausgeführt; native JKS-Dateien werden im Browser weder gelesen noch geprüft oder erstellt.",
        "PEM証明書とRSA秘密鍵からPKCS#12を作成します。keytoolコマンドはJavaで実行してください。このブラウザーではネイティブJKSの読み取り、検査、作成は行いません。",
        "本页从 PEM 证书和 RSA 私钥生成 PKCS#12，并准备供 Java 执行的 keytool 命令；不会在浏览器中读取、检查或创建原生 JKS 文件。",
        "تنشئ الصفحة PKCS#12 من شهادات PEM ومفتاح RSA خاص، وتعد أوامر keytool لتشغيلها باستخدام Java؛ ولا تقرأ ملفات JKS الأصلية أو تفحصها أو تنشئها في المتصفح."
    ],
    "Convert tab: paste cert + key PEMs, generate a .p12, then use the keytool command shown to convert to .jks": [
        "रूपांतरण टैब: PEM प्रमाणपत्र और कुंजी चिपकाएँ, .p12 बनाएँ, फिर दिखी keytool कमांड से .jks में बदलें",
        "Pestaña de conversión: pegar certificado y clave PEM, generar .p12 y convertirlo a .jks con el comando keytool",
        "Conversion : coller le certificat et la clé PEM, créer le .p12, puis le convertir en .jks avec keytool",
        "Konvertierung: Zertifikat und Schlüssel als PEM einfügen, .p12 erstellen und mit dem keytool-Befehl in .jks umwandeln",
        "変換タブで証明書と鍵のPEMを貼り付け、.p12を生成し、表示されたkeytoolコマンドで.jksに変換",
        "转换页：粘贴 PEM 证书和密钥，生成 .p12，再用显示的 keytool 命令转换为 .jks",
        "تبويب التحويل: ألصق الشهادة والمفتاح بصيغة PEM وأنشئ .p12، ثم استخدم أمر keytool للتحويل إلى .jks"
    ],
    "Commands tab: enter a keystore filename and alias to prepare keytool commands": [
        "कमांड टैब: कीस्टोर फ़ाइलनाम और उपनाम देकर keytool कमांड तैयार करें",
        "Pestaña de comandos: introducir archivo y alias del almacén para preparar comandos keytool",
        "Commandes : saisir le fichier du magasin et l’alias pour préparer les commandes keytool",
        "Befehle: Dateiname des Schlüsselspeichers und Alias für keytool-Befehle eingeben",
        "コマンドタブでキーストアのファイル名とエイリアスを入力しkeytoolコマンドを準備",
        "命令页：输入密钥库文件名和别名以准备 keytool 命令",
        "تبويب الأوامر: أدخل اسم ملف مخزن المفاتيح والاسم المستعار لإعداد أوامر keytool"
    ],
    "Modern Java (≥9) reads .p12 keystores natively — JKS is rarely needed": [
        "Java 9 और बाद के संस्करण .p12 सीधे पढ़ते हैं; JKS की ज़रूरत कम पड़ती है",
        "Java moderno (≥9) lee .p12 directamente; JKS rara vez es necesario",
        "Java moderne (≥9) lit directement les .p12 ; JKS est rarement nécessaire",
        "Modernes Java (≥9) liest .p12 direkt; JKS ist selten nötig",
        "Java 9以降は.p12を直接読み取れるため、通常JKSは不要です",
        "Java 9 及以上可直接读取 .p12，通常不需要 JKS",
        "يقرأ Java الحديث (≥9) ملفات .p12 مباشرة؛ ونادرًا ما يلزم JKS"
    ],
    "Review commands before running them. Generated commands are not executed by this tool.": [
        "चलाने से पहले कमांड जाँचें। यह टूल तैयार कमांड चलाता नहीं है।",
        "Revise los comandos antes de ejecutarlos. Esta herramienta no los ejecuta.",
        "Vérifiez les commandes avant exécution. Cet outil ne les exécute pas.",
        "Befehle vor dem Ausführen prüfen. Dieses Werkzeug führt sie nicht aus.",
        "実行前にコマンドを確認してください。このツールはコマンドを実行しません。",
        "执行前请检查命令。本工具不会执行生成的命令。",
        "راجع الأوامر قبل تشغيلها. هذه الأداة لا تنفذ الأوامر الناتجة."
    ],
    "Always include the -storetype JKS flag to avoid ambiguity": [
        "अस्पष्टता से बचने के लिए -storetype JKS शामिल करें",
        "Incluya -storetype JKS para evitar ambigüedades",
        "Incluez -storetype JKS pour éviter toute ambiguïté",
        "Zur Eindeutigkeit -storetype JKS angeben",
        "曖昧さを避けるため-storetype JKSを指定",
        "包含 -storetype JKS 以明确格式",
        "أضف ‎-storetype JKS لتجنب الالتباس"
    ],
    "Migrating a legacy Tomcat keystore to PKCS#12": [
        "पुराने Tomcat कीस्टोर को PKCS#12 में माइग्रेट करना",
        "Migrar un almacén Tomcat antiguo a PKCS#12",
        "Migrer un ancien magasin Tomcat vers PKCS#12",
        "Älteren Tomcat-Schlüsselspeicher zu PKCS#12 migrieren",
        "従来のTomcatキーストアをPKCS#12に移行",
        "将旧版 Tomcat 密钥库迁移至 PKCS#12",
        "ترحيل مخزن مفاتيح Tomcat قديم إلى PKCS#12"
    ],
    "Setting up a Spring Boot SSL keystore": [
        "Spring Boot SSL कीस्टोर सेट करना",
        "Configurar un almacén SSL de Spring Boot",
        "Configurer un magasin SSL Spring Boot",
        "Spring-Boot-SSL-Schlüsselspeicher einrichten",
        "Spring BootのSSLキーストア設定",
        "配置 Spring Boot SSL 密钥库",
        "إعداد مخزن مفاتيح SSL لـ Spring Boot"
    ],
    "Generating keytool import/export commands without Googling": [
        "keytool आयात/निर्यात कमांड तैयार करना",
        "Preparar comandos keytool de importación y exportación",
        "Préparer les commandes keytool d’import et d’export",
        "keytool-Befehle für Import und Export vorbereiten",
        "keytoolのインポート・エクスポート用コマンド作成",
        "生成 keytool 导入与导出命令",
        "إعداد أوامر الاستيراد والتصدير في keytool"
    ],
    "Native JKS conversion requires Java": [
        "मूल JKS रूपांतरण के लिए Java चाहिए",
        "La conversión nativa JKS requiere Java",
        "La conversion JKS native nécessite Java",
        "Native JKS-Konvertierung benötigt Java",
        "ネイティブJKSの変換にはJavaが必要です",
        "原生 JKS 转换需要 Java",
        "يتطلب تحويل JKS الأصلي Java"
    ],
    "Step 1: Provide PEM certificates and RSA key": [
        "चरण 1: PEM प्रमाणपत्र और RSA कुंजी दें",
        "Paso 1: proporcionar certificados PEM y clave RSA",
        "Étape 1 : fournir les certificats PEM et la clé RSA",
        "Schritt 1: PEM-Zertifikate und RSA-Schlüssel angeben",
        "手順1：PEM証明書とRSA鍵を入力",
        "第 1 步：提供 PEM 证书与 RSA 密钥",
        "الخطوة 1: توفير شهادات PEM ومفتاح RSA"
    ],
    "Chain certificates (optional)": [
        "प्रमाणपत्र श्रृंखला (वैकल्पिक)",
        "Certificados de la cadena (opcional)",
        "Certificats de la chaîne (facultatif)",
        "Zertifikatskette (optional)",
        "証明書チェーン（任意）",
        "证书链（可选）",
        "شهادات السلسلة (اختياري)"
    ],
    "Concatenated intermediate CAs and root": [
        "जुड़े हुए मध्यवर्ती और रूट CA",
        "CA intermedias y raíz concatenadas",
        "AC intermédiaires et racine concaténées",
        "Zusammengefügte Zwischen- und Stammzertifikate",
        "中間CAとルートCAを連結",
        "拼接的中间 CA 与根 CA",
        "شهادات الجهات الوسيطة والجذر المجمعة"
    ],
    "Alias": [
        "उपनाम",
        "Alias de clave",
        "Alias de clé",
        "Schlüsselalias",
        "エイリアス",
        "别名",
        "الاسم المستعار"
    ],
    "Step 2: Generate PKCS#12": [
        "चरण 2: PKCS#12 बनाएँ",
        "Paso 2: generar PKCS#12",
        "Étape 2 : générer le PKCS#12",
        "Schritt 2: PKCS#12 erstellen",
        "手順2：PKCS#12を生成",
        "第 2 步：生成 PKCS#12",
        "الخطوة 2: إنشاء PKCS#12"
    ],
    "Step 3: Convert to JKS with keytool": [
        "चरण 3: keytool से JKS में बदलें",
        "Paso 3: convertir a JKS con keytool",
        "Étape 3 : convertir en JKS avec keytool",
        "Schritt 3: Mit keytool in JKS umwandeln",
        "手順3：keytoolでJKSに変換",
        "第 3 步：使用 keytool 转换为 JKS",
        "الخطوة 3: التحويل إلى JKS باستخدام keytool"
    ],
    "Requires Java JDK with keytool installed": [
        "keytool सहित Java JDK चाहिए",
        "Requiere Java JDK con keytool instalado",
        "Nécessite un JDK Java avec keytool",
        "Java JDK mit installiertem keytool erforderlich",
        "keytoolを含むJava JDKが必要",
        "需要安装含 keytool 的 Java JDK",
        "يتطلب Java JDK مع تثبيت keytool"
    ],
    "Keystore filename": [
        "कीस्टोर फ़ाइलनाम",
        "Nombre del archivo del almacén",
        "Nom du fichier du magasin",
        "Dateiname des Schlüsselspeichers",
        "キーストアのファイル名",
        "密钥库文件名",
        "اسم ملف مخزن المفاتيح"
    ],
    "Provide both certificate and private key (PEM)": [
        "प्रमाणपत्र और निजी कुंजी दोनों PEM में दें",
        "Proporcione certificado y clave privada PEM",
        "Fournissez le certificat et la clé privée PEM",
        "Zertifikat und privaten Schlüssel als PEM angeben",
        "証明書と秘密鍵の両方をPEMで入力",
        "请提供 PEM 证书与私钥",
        "وفر الشهادة والمفتاح الخاص بصيغة PEM"
    ],
    "PKCS#12 download prepared — review the keytool command below": [
        "PKCS#12 डाउनलोड तैयार है; नीचे keytool कमांड जाँचें",
        "Descarga PKCS#12 preparada; revise el comando keytool",
        "Téléchargement PKCS#12 préparé ; vérifiez la commande keytool",
        "PKCS#12-Download vorbereitet; keytool-Befehl prüfen",
        "PKCS#12のダウンロードを準備しました。keytoolコマンドを確認してください",
        "已准备 PKCS#12 下载；请检查下方 keytool 命令",
        "تم إعداد تنزيل PKCS#12؛ راجع أمر keytool أدناه"
    ],
    "Command copied": [
        "कमांड कॉपी हुई",
        "Comando copiado",
        "Commande copiée",
        "Befehl kopiert",
        "コマンドをコピーしました",
        "命令已复制",
        "تم نسخ الأمر"
    ],
    "Build PKCS#12 from PEM here, then run the prepared keytool commands with Java to convert it to JKS. Native JKS files are not parsed in this browser.": [
        "यहाँ PEM से PKCS#12 बनाएँ और JKS में बदलने के लिए Java में keytool कमांड चलाएँ। ब्राउज़र मूल JKS फ़ाइल पार्स नहीं करता।",
        "Cree PKCS#12 desde PEM y ejecute keytool con Java para convertirlo a JKS. El navegador no analiza archivos JKS nativos.",
        "Créez un PKCS#12 depuis PEM, puis utilisez keytool avec Java pour le convertir en JKS. Le navigateur n’analyse pas les fichiers JKS natifs.",
        "PKCS#12 aus PEM erstellen und mit Java-keytool in JKS umwandeln. Native JKS-Dateien werden im Browser nicht geparst.",
        "ここでPEMからPKCS#12を作成し、JavaのkeytoolでJKSに変換してください。このブラウザーはネイティブJKSを解析しません。",
        "在此从 PEM 创建 PKCS#12，再通过 Java 执行 keytool 转为 JKS。浏览器不解析原生 JKS 文件。",
        "أنشئ PKCS#12 من PEM هنا، ثم شغل keytool باستخدام Java للتحويل إلى JKS. المتصفح لا يحلل ملفات JKS الأصلية."
    ],
    "PEM → PKCS#12 + keytool": [
        "PEM → PKCS#12 और keytool",
        "PEM → PKCS#12 y keytool",
        "PEM → PKCS#12 et keytool",
        "PEM → PKCS#12 und keytool",
        "PEM → PKCS#12とkeytool",
        "PEM → PKCS#12 与 keytool",
        "PEM → PKCS#12 وأداة keytool"
    ],
    "keytool Commands": [
        "keytool कमांड",
        "Comandos keytool",
        "Commandes keytool",
        "keytool-Befehle",
        "keytoolコマンド",
        "keytool 命令",
        "أوامر keytool"
    ],
    "Failed to build keystore": [
        "कीस्टोर बनाना विफल रहा",
        "No se pudo crear el almacén",
        "Impossible de créer le magasin",
        "Schlüsselspeicher konnte nicht erstellt werden",
        "キーストアの作成に失敗しました",
        "无法创建密钥库",
        "تعذر إنشاء مخزن المفاتيح"
    ],
    "Download {filename}": [
        "{filename} डाउनलोड करें",
        "Descargar {filename}",
        "Télécharger {filename}",
        "{filename} herunterladen",
        "{filename}をダウンロード",
        "下载 {filename}",
        "تنزيل {filename}"
    ],
    "Commands use POSIX shell quoting and interactive password prompts. Review them before running in a compatible terminal; this page never executes them.": [
        "कमांड POSIX शेल कोटिंग और इंटरैक्टिव पासवर्ड प्रॉम्प्ट का उपयोग करती हैं। संगत टर्मिनल में चलाने से पहले जाँचें; यह पृष्ठ उन्हें नहीं चलाता।",
        "Los comandos usan comillas de shell POSIX y solicitan contraseñas de forma interactiva. Revise antes de ejecutarlos en un terminal compatible; esta página no los ejecuta.",
        "Les commandes utilisent l’échappement POSIX et demandent les mots de passe interactivement. Vérifiez-les avant de les lancer dans un terminal compatible ; cette page ne les exécute pas.",
        "Befehle verwenden POSIX-Shell-Quoting und interaktive Passwortabfragen. Vor der Ausführung in einem kompatiblen Terminal prüfen; die Seite führt sie nie aus.",
        "POSIXシェル用の引用を使い、パスワードは対話式に入力します。対応する端末で実行する前に確認してください。このページは実行しません。",
        "命令使用 POSIX shell 引用并交互式提示输入密码。请在兼容终端执行前检查；本页从不执行命令。",
        "تستخدم الأوامر اقتباس POSIX وتطلب كلمات المرور تفاعليًا. راجعها قبل تشغيلها في طرفية متوافقة؛ فالصفحة لا تنفذها."
    ],
    "List all entries": [
        "सभी प्रविष्टियाँ दिखाएँ",
        "Listar todas las entradas",
        "Lister toutes les entrées",
        "Alle Einträge auflisten",
        "すべてのエントリーを一覧表示",
        "列出所有条目",
        "سرد جميع الإدخالات"
    ],
    "List with details (-v)": [
        "विवरण सहित दिखाएँ (-v)",
        "Listar con detalles (-v)",
        "Lister avec les détails (-v)",
        "Mit Details auflisten (-v)",
        "詳細表示（-v）",
        "显示详细列表 (-v)",
        "السرد مع التفاصيل (-v)"
    ],
    "Export a certificate": [
        "प्रमाणपत्र निर्यात करें",
        "Exportar un certificado",
        "Exporter un certificat",
        "Zertifikat exportieren",
        "証明書をエクスポート",
        "导出证书",
        "تصدير شهادة"
    ],
    "Import a trusted certificate": [
        "विश्वसनीय प्रमाणपत्र आयात करें",
        "Importar un certificado de confianza",
        "Importer un certificat de confiance",
        "Vertrauenswürdiges Zertifikat importieren",
        "信頼できる証明書をインポート",
        "导入可信证书",
        "استيراد شهادة موثوقة"
    ],
    "Generate a new keypair (self-signed)": [
        "नई स्वहस्ताक्षरित कुंजी जोड़ी बनाएँ",
        "Generar un par de claves autofirmado",
        "Générer une paire de clés autosignée",
        "Neues selbstsigniertes Schlüsselpaar erstellen",
        "新しい鍵ペアを生成（自己署名）",
        "生成新的自签名密钥对",
        "إنشاء زوج مفاتيح جديد موقّع ذاتيًا"
    ],
    "Convert JKS → PKCS#12": [
        "JKS → PKCS#12 में बदलें",
        "Convertir JKS → PKCS#12",
        "Convertir JKS en PKCS#12",
        "JKS in PKCS#12 umwandeln",
        "JKSをPKCS#12に変換",
        "将 JKS 转为 PKCS#12",
        "تحويل JKS إلى PKCS#12"
    ],
    "Use this to read your JKS in this site's PKCS#12 tool": [
        "इस साइट के PKCS#12 टूल में पढ़ने से पहले JKS बदलें",
        "Convierta JKS para leerlo con la herramienta PKCS#12",
        "Convertissez le JKS pour le lire avec l’outil PKCS#12 du site",
        "JKS zur Nutzung im PKCS#12-Werkzeug dieser Website umwandeln",
        "このサイトのPKCS#12ツールで読むためJKSを変換",
        "转换 JKS 以供本站 PKCS#12 工具读取",
        "حوّل JKS لقراءته بأداة PKCS#12 في الموقع"
    ],
    "Change a keystore password": [
        "कीस्टोर पासवर्ड बदलें",
        "Cambiar contraseña del almacén",
        "Modifier le mot de passe du magasin",
        "Passwort des Schlüsselspeichers ändern",
        "キーストアのパスワードを変更",
        "更改密钥库密码",
        "تغيير كلمة مرور مخزن المفاتيح"
    ],
    "Delete an entry": [
        "प्रविष्टि हटाएँ",
        "Eliminar una entrada",
        "Supprimer une entrée",
        "Eintrag löschen",
        "エントリーを削除",
        "删除条目",
        "حذف إدخال"
    ],
    "Inspect WebAuthn credential response JSON and decode browser-safe client-data metadata": [
        "WebAuthn क्रेडेंशियल JSON जाँचें और सार्वजनिक क्लाइंट मेटाडेटा डिकोड करें",
        "Inspeccionar respuestas JSON WebAuthn y decodificar metadatos públicos del cliente",
        "Inspecter les réponses JSON WebAuthn et décoder les métadonnées publiques du client",
        "WebAuthn-Antwort-JSON prüfen und öffentliche Client-Metadaten dekodieren",
        "WebAuthn認証情報のJSONと公開クライアントメタデータを確認",
        "检查 WebAuthn 凭据响应 JSON 并解码公开客户端元数据",
        "فحص استجابة اعتماد WebAuthn بصيغة JSON وفك بيانات العميل العامة"
    ],
    "A local WebAuthn inspection workspace for credential JSON captured by your application. It decodes base64url clientDataJSON and reports basic credential metadata.": [
        "अनुप्रयोग से लिए WebAuthn क्रेडेंशियल JSON की स्थानीय जाँच करें। यह base64url clientDataJSON और मूल मेटाडेटा दिखाता है।",
        "Inspección local del JSON WebAuthn de su aplicación. Decodifica clientDataJSON en base64url y muestra metadatos básicos.",
        "Inspection locale du JSON WebAuthn de votre application. Décode clientDataJSON en base64url et affiche les métadonnées de base.",
        "Lokale Prüfung von WebAuthn-JSON Ihrer Anwendung. Dekodiert base64url-clientDataJSON und zeigt grundlegende Metadaten.",
        "アプリで取得したWebAuthnのJSONをローカル検査し、base64urlのclientDataJSONと基本メタデータを表示します。",
        "本地检查应用捕获的 WebAuthn JSON，解码 base64url clientDataJSON 并显示基本元数据。",
        "فحص محلي لبيانات WebAuthn JSON من تطبيقك، مع فك clientDataJSON بترميز base64url وعرض البيانات الأساسية."
    ],
    "Passkey integrations involve opaque browser payloads. Decoding their public metadata helps developers debug challenge, origin, and ceremony mismatches without exposing private keys.": [
        "पासकी पेलोड का सार्वजनिक मेटाडेटा डिकोड करके निजी कुंजियाँ उजागर किए बिना challenge, origin और प्रक्रिया की असंगतियाँ जाँचें।",
        "Decodificar los metadatos públicos de passkeys ayuda a depurar diferencias de challenge, origin y ceremonia sin revelar claves privadas.",
        "Décoder les métadonnées publiques des passkeys permet de vérifier challenge, origin et cérémonie sans exposer de clé privée.",
        "Öffentliche Passkey-Metadaten helfen, Abweichungen bei Challenge, Origin und Ablauf ohne Offenlegung privater Schlüssel zu untersuchen.",
        "公開メタデータを読むことで秘密鍵を公開せず、チャレンジ、オリジン、処理の不一致を調べられます。",
        "解码通行密钥的公开元数据，有助于排查 challenge、origin 和流程不匹配，无需暴露私钥。",
        "يساعد فك بيانات مفاتيح المرور العامة على تشخيص اختلافات challenge وorigin والعملية دون كشف المفاتيح الخاصة."
    ],
    "Paste a serialised credential response": [
        "सीरियलाइज़ की गई क्रेडेंशियल प्रतिक्रिया चिपकाएँ",
        "Pegar una respuesta de credencial serializada",
        "Coller une réponse d’identifiant sérialisée",
        "Serialisierte Anmeldedatenantwort einfügen",
        "シリアライズした認証情報の応答を貼り付け",
        "粘贴序列化的凭据响应",
        "ألصق استجابة اعتماد متسلسلة"
    ],
    "Inspect the credential": [
        "क्रेडेंशियल जाँचें",
        "Inspeccionar la credencial",
        "Inspecter l’identifiant",
        "Anmeldedaten prüfen",
        "認証情報を検査",
        "检查凭据",
        "افحص الاعتماد"
    ],
    "Review decoded clientDataJSON and authenticator-data size": [
        "डिकोड किए clientDataJSON और प्रमाणीकरण डेटा का आकार जाँचें",
        "Revisar clientDataJSON decodificado y el tamaño de datos del autenticador",
        "Examiner clientDataJSON décodé et la taille des données de l’authentificateur",
        "Dekodiertes clientDataJSON und Größe der Authentifikatordaten prüfen",
        "デコードしたclientDataJSONと認証器データのサイズを確認",
        "查看已解码的 clientDataJSON 和认证器数据大小",
        "راجع clientDataJSON المفكوك وحجم بيانات المصادق"
    ],
    "Compare the origin and challenge with your server-side expectations": [
        "origin और challenge को सर्वर की अपेक्षा से मिलाएँ",
        "Comparar origin y challenge con lo esperado por el servidor",
        "Comparer origin et challenge aux attentes du serveur",
        "Origin und Challenge mit den Servererwartungen vergleichen",
        "オリジンとチャレンジをサーバー側の期待値と比較",
        "将 origin 和 challenge 与服务端预期比较",
        "قارن origin وchallenge بما يتوقعه الخادم"
    ],
    "Never paste a private key, token, or production user data.": [
        "निजी कुंजी, टोकन या प्रोडक्शन उपयोगकर्ता डेटा न चिपकाएँ।",
        "No pegue claves privadas, tokens ni datos de usuarios en producción.",
        "Ne collez ni clé privée, ni jeton, ni données réelles d’utilisateurs.",
        "Keine privaten Schlüssel, Tokens oder produktiven Nutzerdaten einfügen.",
        "秘密鍵、トークン、本番ユーザーのデータを貼り付けないでください。",
        "请勿粘贴私钥、令牌或生产用户数据。",
        "لا تلصق مفتاحًا خاصًا أو رمزًا أو بيانات مستخدمين فعلية."
    ],
    "Real registration and assertion ceremonies need a configured relying-party origin and server-side challenge validation.": [
        "वास्तविक पंजीकरण और प्रमाणीकरण के लिए relying-party origin और सर्वर पर challenge सत्यापन चाहिए।",
        "El registro y la autenticación reales requieren origin de la parte dependiente y validación de challenge en el servidor.",
        "L’inscription et l’authentification réelles exigent un origin de partie utilisatrice configuré et la validation du challenge côté serveur.",
        "Reale Registrierung und Anmeldung benötigen eine konfigurierte Relying-Party-Origin und serverseitige Challenge-Prüfung.",
        "実際の登録・認証ではRPのオリジン設定とサーバー側のチャレンジ検証が必要です。",
        "实际注册与认证需要配置依赖方 origin，并在服务端验证 challenge。",
        "يتطلب التسجيل والتحقق الفعليان إعداد origin للجهة المعتمدة والتحقق من challenge على الخادم."
    ],
    "This tool does not create or transmit a credential.": [
        "यह टूल क्रेडेंशियल बनाता या भेजता नहीं है।",
        "Esta herramienta no crea ni transmite credenciales.",
        "Cet outil ne crée ni ne transmet d’identifiant.",
        "Dieses Werkzeug erstellt oder überträgt keine Anmeldedaten.",
        "このツールは認証情報を作成・送信しません。",
        "本工具不会创建或传输凭据。",
        "لا تنشئ هذه الأداة اعتمادًا ولا ترسله."
    ],
    "Passkey integration debugging": [
        "पासकी एकीकरण की डीबगिंग",
        "Depuración de integración de passkeys",
        "Débogage d’intégration des passkeys",
        "Passkey-Integration debuggen",
        "パスキー連携のデバッグ",
        "通行密钥集成调试",
        "تصحيح تكامل مفاتيح المرور"
    ],
    "WebAuthn fixture inspection": [
        "WebAuthn टेस्ट डेटा की जाँच",
        "Inspección de fixtures WebAuthn",
        "Inspection de jeux d’essai WebAuthn",
        "WebAuthn-Testdaten prüfen",
        "WebAuthnテストデータの検査",
        "检查 WebAuthn 测试数据",
        "فحص بيانات اختبار WebAuthn"
    ],
    "Origin and challenge troubleshooting": [
        "origin और challenge की समस्या जाँच",
        "Diagnóstico de origin y challenge",
        "Diagnostic d’origin et de challenge",
        "Probleme mit Origin und Challenge untersuchen",
        "オリジンとチャレンジの問題調査",
        "排查 origin 和 challenge 问题",
        "تشخيص مشكلات origin وchallenge"
    ],
    "Credential response": [
        "क्रेडेंशियल प्रतिक्रिया",
        "Respuesta de credencial",
        "Réponse d’identifiant",
        "Anmeldedatenantwort",
        "認証情報の応答",
        "凭据响应",
        "استجابة الاعتماد"
    ],
    "WebAuthn credential response JSON": [
        "WebAuthn क्रेडेंशियल प्रतिक्रिया JSON",
        "JSON de respuesta de credencial WebAuthn",
        "JSON de réponse d’identifiant WebAuthn",
        "WebAuthn-Anmeldedatenantwort als JSON",
        "WebAuthn認証情報応答のJSON",
        "WebAuthn 凭据响应 JSON",
        "JSON لاستجابة اعتماد WebAuthn"
    ],
    "Inspect credential": [
        "क्रेडेंशियल जाँचें",
        "Inspeccionar credencial",
        "Inspecter l’identifiant",
        "Anmeldedaten prüfen",
        "認証情報を検査",
        "检查凭据",
        "فحص الاعتماد"
    ],
    "Credential inspection": [
        "क्रेडेंशियल जाँच",
        "Inspección de credencial",
        "Inspection d’identifiant",
        "Prüfung der Anmeldedaten",
        "認証情報の検査",
        "凭据检查",
        "فحص الاعتماد"
    ],
    "Credential ID": [
        "क्रेडेंशियल आईडी",
        "ID de credencial",
        "ID d’identifiant",
        "Anmeldedaten-ID",
        "認証情報ID",
        "凭据 ID",
        "معرّف الاعتماد"
    ],
    "Authenticator data": [
        "प्रमाणीकरण डेटा",
        "Datos del autenticador",
        "Données de l’authentificateur",
        "Authentifikatordaten",
        "認証器データ",
        "认证器数据",
        "بيانات المصادق"
    ],
    "Client data JSON": [
        "क्लाइंट डेटा JSON",
        "JSON de datos del cliente",
        "JSON des données client",
        "Client-Daten als JSON",
        "クライアントデータJSON",
        "客户端数据 JSON",
        "بيانات العميل JSON"
    ],
    "Credential metadata decoded": [
        "क्रेडेंशियल मेटाडेटा डिकोड हुआ",
        "Metadatos de credencial decodificados",
        "Métadonnées d’identifiant décodées",
        "Anmeldedaten-Metadaten dekodiert",
        "認証情報のメタデータをデコードしました",
        "凭据元数据已解码",
        "تم فك بيانات الاعتماد الوصفية"
    ],
    "Invalid credential JSON.": [
        "क्रेडेंशियल JSON अमान्य है।",
        "JSON de credencial no válido.",
        "JSON d’identifiant invalide.",
        "Ungültiges Anmeldedaten-JSON.",
        "認証情報のJSONが無効です。",
        "凭据 JSON 无效。",
        "JSON الاعتماد غير صالح."
    ],
    "Not supplied": [
        "दिया नहीं गया",
        "No proporcionado",
        "Non fourni",
        "Nicht angegeben",
        "未指定",
        "未提供",
        "غير متوفر"
    ],
    "Preview and remove credential fields from HAR, JSON, and plain-text logs locally": [
        "HAR, JSON और टेक्स्ट लॉग से संवेदनशील फ़ील्ड स्थानीय रूप से हटाएँ और पूर्वावलोकन देखें",
        "Previsualizar y eliminar campos sensibles de HAR, JSON y registros de texto localmente",
        "Prévisualiser et supprimer localement les champs sensibles des HAR, JSON et journaux texte",
        "Sensible Felder in HAR, JSON und Textprotokollen lokal prüfen und entfernen",
        "HAR、JSON、テキストログの認証情報フィールドをローカルで確認・削除",
        "本地预览并移除 HAR、JSON 和文本日志中的敏感字段",
        "معاينة حقول الاعتماد وإزالتها محليًا من HAR وJSON والسجلات النصية"
    ],
    "Load a local HAR, JSON, or text file": [
        "स्थानीय HAR, JSON या टेक्स्ट फ़ाइल लोड करें",
        "Cargar archivo HAR, JSON o de texto local",
        "Charger un fichier local HAR, JSON ou texte",
        "Lokale HAR-, JSON- oder Textdatei laden",
        "ローカルのHAR、JSON、テキストファイルを読み込み",
        "加载本地 HAR、JSON 或文本文件",
        "تحميل ملف HAR أو JSON أو نص محلي"
    ],
    "Original data": [
        "मूल डेटा",
        "Datos originales",
        "Données originales",
        "Ursprüngliche Daten",
        "元のデータ",
        "原始数据",
        "البيانات الأصلية"
    ],
    "Redacted preview": [
        "छिपाए गए डेटा का पूर्वावलोकन",
        "Vista previa censurada",
        "Aperçu expurgé",
        "Bereinigte Vorschau",
        "編集済みプレビュー",
        "脱敏预览",
        "المعاينة بعد التنقيح"
    ],
    "Choose Preview redaction": [
        "संवेदनशील डेटा छिपाने का पूर्वावलोकन चुनें",
        "Seleccione Vista previa de censura",
        "Choisissez l’aperçu de l’expurgation",
        "Vorschau der Bereinigung auswählen",
        "「編集をプレビュー」を選択",
        "选择脱敏预览",
        "اختر معاينة التنقيح"
    ],
    "Preview redaction": [
        "छिपाए गए डेटा का पूर्वावलोकन",
        "Vista previa de censura",
        "Aperçu de l’expurgation",
        "Bereinigung anzeigen",
        "編集をプレビュー",
        "预览脱敏",
        "معاينة التنقيح"
    ],
    "Download redacted data": [
        "छिपाया गया डेटा डाउनलोड करें",
        "Descargar datos censurados",
        "Télécharger les données expurgées",
        "Bereinigte Daten herunterladen",
        "編集済みデータをダウンロード",
        "下载脱敏数据",
        "تنزيل البيانات المنقحة"
    ],
    "Review the preview before sharing. Custom identifiers and sensitive free text may need additional redaction. Nothing is uploaded.": [
        "साझा करने से पहले पूर्वावलोकन जाँचें। कस्टम पहचानकर्ता और संवेदनशील टेक्स्ट और छिपाना पड़ सकता है। कुछ अपलोड नहीं होता।",
        "Revise antes de compartir. Los identificadores personalizados y el texto sensible pueden requerir más censura. No se sube nada.",
        "Vérifiez avant partage. Les identifiants personnalisés et le texte sensible peuvent nécessiter une expurgation supplémentaire. Rien n’est envoyé.",
        "Vorschau vor dem Teilen prüfen. Eigene Kennungen und sensible Freitexte müssen eventuell zusätzlich bereinigt werden. Nichts wird hochgeladen.",
        "共有前に確認してください。独自の識別子や機密の自由文は追加の編集が必要な場合があります。アップロードは行いません。",
        "分享前请检查预览。自定义标识符和敏感文本可能需要进一步脱敏。不会上传任何内容。",
        "راجع المعاينة قبل المشاركة. قد تحتاج المعرّفات المخصصة والنصوص الحساسة إلى تنقيح إضافي. لا يُرفع أي شيء."
    ],
    "Verify GitHub, Stripe, Slack, or HMAC-SHA256 webhook signatures locally": [
        "GitHub, Stripe, Slack या HMAC-SHA256 वेबहुक हस्ताक्षर स्थानीय रूप से सत्यापित करें",
        "Verificar firmas webhook GitHub, Stripe, Slack o HMAC-SHA256 localmente",
        "Vérifier localement les signatures webhook GitHub, Stripe, Slack ou HMAC-SHA256",
        "Webhook-Signaturen von GitHub, Stripe, Slack oder HMAC-SHA256 lokal prüfen",
        "GitHub、Stripe、Slack、HMAC-SHA256のWebhook署名をローカル検証",
        "本地验证 GitHub、Stripe、Slack 或 HMAC-SHA256 webhook 签名",
        "التحقق محليًا من توقيعات webhook لـ GitHub وStripe وSlack أو HMAC-SHA256"
    ],
    "Signature scheme": [
        "हस्ताक्षर योजना",
        "Esquema de firma",
        "Schéma de signature",
        "Signaturschema",
        "署名方式",
        "签名方案",
        "مخطط التوقيع"
    ],
    "Raw HMAC-SHA256 hex": [
        "मूल HMAC-SHA256 हेक्स",
        "HMAC-SHA256 hexadecimal sin formato",
        "HMAC-SHA256 hexadécimal brut",
        "Rohes HMAC-SHA256-Hex",
        "HMAC-SHA256の生の16進数",
        "原始 HMAC-SHA256 十六进制",
        "HMAC-SHA256 سداسي عشري خام"
    ],
    "Signing secret": [
        "हस्ताक्षर सीक्रेट",
        "Secreto de firma",
        "Secret de signature",
        "Signaturgeheimnis",
        "署名シークレット",
        "签名密钥",
        "سر التوقيع"
    ],
    "Signature header": [
        "हस्ताक्षर हेडर",
        "Cabecera de firma",
        "En-tête de signature",
        "Signaturheader",
        "署名ヘッダー",
        "签名头",
        "ترويسة التوقيع"
    ],
    "Load the exact raw UTF-8 request body": [
        "अनुरोध का मूल UTF-8 बॉडी बिना बदलाव लोड करें",
        "Cargar el cuerpo UTF-8 original exacto de la solicitud",
        "Charger le corps UTF-8 brut exact de la requête",
        "Exakten ursprünglichen UTF-8-Anfragetext laden",
        "元のUTF-8リクエスト本文をそのまま読み込み",
        "加载精确的原始 UTF-8 请求体",
        "تحميل نص الطلب الخام الدقيق بترميز UTF-8"
    ],
    "Raw body · editing whitespace changes the signature": [
        "मूल बॉडी · खाली स्थान बदलने से हस्ताक्षर बदलता है",
        "Cuerpo original · modificar espacios cambia la firma",
        "Corps brut · modifier les espaces change la signature",
        "Rohtext · Änderungen an Leerzeichen ändern die Signatur",
        "生の本文・空白の変更で署名も変わります",
        "原始请求体 · 修改空白会改变签名",
        "النص الخام · تغيير المسافات يغير التوقيع"
    ],
    "Signature verification result": [
        "हस्ताक्षर सत्यापन परिणाम",
        "Resultado de verificación de firma",
        "Résultat de vérification de signature",
        "Ergebnis der Signaturprüfung",
        "署名検証の結果",
        "签名验证结果",
        "نتيجة التحقق من التوقيع"
    ],
    "Secrets are kept only in this page's memory. Stripe and Slack timestamps use a five-minute tolerance. Use test credentials; verify production webhooks on your server.": [
        "सीक्रेट केवल इस पृष्ठ की मेमोरी में रहता है। Stripe और Slack समय की सहनशीलता पाँच मिनट है। टेस्ट क्रेडेंशियल लें; प्रोडक्शन वेबहुक सर्वर पर जाँचें।",
        "Los secretos solo permanecen en la memoria de esta página. Stripe y Slack usan cinco minutos de tolerancia. Use datos de prueba; verifique webhooks reales en su servidor.",
        "Les secrets restent uniquement en mémoire sur cette page. Stripe et Slack ont une tolérance de cinq minutes. Utilisez des données de test ; vérifiez les webhooks réels sur le serveur.",
        "Geheimnisse bleiben nur im Seitenspeicher. Stripe und Slack erlauben fünf Minuten Zeitabweichung. Testdaten verwenden; produktive Webhooks auf dem Server prüfen.",
        "シークレットはこのページのメモリーにのみ保持します。StripeとSlackの時刻許容差は5分です。テスト用情報を使い、本番のWebhookはサーバーで検証してください。",
        "密钥仅保存在本页内存中。Stripe 和 Slack 的时间容差为五分钟。请使用测试凭据；生产 webhook 应在服务端验证。",
        "تبقى الأسرار في ذاكرة الصفحة فقط. سماحية الوقت لـ Stripe وSlack خمس دقائق. استخدم بيانات اختبار وتحقق من webhooks الفعلية على خادمك."
    ],
    "Audit pasted HTTP response headers and explain practical browser-security gaps": [
        "चिपकाए HTTP प्रतिक्रिया हेडर में ब्राउज़र सुरक्षा की कमियाँ जाँचें",
        "Auditar cabeceras HTTP pegadas y explicar carencias de seguridad del navegador",
        "Auditer les en-têtes HTTP collés et expliquer les lacunes de sécurité du navigateur",
        "Eingefügte HTTP-Antwortheader auf Browser-Sicherheitslücken prüfen",
        "貼り付けたHTTP応答ヘッダーのブラウザーセキュリティ上の不足を確認",
        "审查粘贴的 HTTP 响应头并解释浏览器安全缺口",
        "تدقيق ترويسات HTTP الملصقة وشرح ثغرات أمان المتصفح"
    ],
    "A local analyzer for Content-Security-Policy, HSTS, nosniff, Referrer-Policy, and Permissions-Policy headers.": [
        "Content-Security-Policy, HSTS, nosniff, Referrer-Policy और Permissions-Policy की स्थानीय जाँच।",
        "Analizador local de Content-Security-Policy, HSTS, nosniff, Referrer-Policy y Permissions-Policy.",
        "Analyse locale de Content-Security-Policy, HSTS, nosniff, Referrer-Policy et Permissions-Policy.",
        "Lokale Analyse von Content-Security-Policy, HSTS, nosniff, Referrer-Policy und Permissions-Policy.",
        "Content-Security-Policy、HSTS、nosniff、Referrer-Policy、Permissions-Policyのローカル解析です。",
        "本地分析 Content-Security-Policy、HSTS、nosniff、Referrer-Policy 和 Permissions-Policy。",
        "محلل محلي لترويسات Content-Security-Policy وHSTS وnosniff وReferrer-Policy وPermissions-Policy."
    ],
    "Security headers are easy to omit and difficult to review from a raw response. The analyzer turns them into focused next actions without scanning your site.": [
        "सुरक्षा हेडर छूट सकते हैं और मूल प्रतिक्रिया में जाँचना कठिन है। साइट स्कैन किए बिना यह अगली कार्रवाइयाँ सुझाता है।",
        "Las cabeceras de seguridad suelen omitirse y son difíciles de revisar en bruto. El analizador propone acciones sin escanear su sitio.",
        "Les en-têtes de sécurité s’oublient facilement et sont difficiles à examiner bruts. L’analyseur propose des actions sans scanner votre site.",
        "Sicherheitsheader werden leicht vergessen und sind in Rohantworten schwer zu prüfen. Der Analyzer zeigt nächste Schritte ohne Website-Scan.",
        "セキュリティヘッダーは見落としやすく、生の応答では確認が困難です。サイトをスキャンせず、対処の指針を示します。",
        "安全响应头容易遗漏，也难以从原始响应中检查。本工具提供改进建议，不扫描网站。",
        "يسهل إغفال ترويسات الأمان وتصعب مراجعتها خامًا. يقترح المحلل خطوات عملية دون فحص موقعك."
    ],
    "Copy response headers from your browser, CDN, or curl output": [
        "ब्राउज़र, CDN या curl से प्रतिक्रिया हेडर कॉपी करें",
        "Copiar cabeceras del navegador, CDN o salida de curl",
        "Copier les en-têtes depuis le navigateur, le CDN ou curl",
        "Antwortheader aus Browser, CDN oder curl kopieren",
        "ブラウザー、CDN、curlから応答ヘッダーをコピー",
        "从浏览器、CDN 或 curl 输出复制响应头",
        "انسخ ترويسات الاستجابة من المتصفح أو CDN أو curl"
    ],
    "Paste them below": [
        "नीचे चिपकाएँ",
        "Pegarlas abajo",
        "Les coller ci-dessous",
        "Unten einfügen",
        "以下に貼り付け",
        "粘贴到下方",
        "ألصقها أدناه"
    ],
    "Read each finding and tailor the suggested policy to your app": [
        "प्रत्येक निष्कर्ष पढ़ें और सुझाई नीति अनुप्रयोग के अनुसार ढालें",
        "Leer cada hallazgo y adaptar la política sugerida a su aplicación",
        "Lire chaque constat et adapter la politique à votre application",
        "Jeden Befund lesen und vorgeschlagene Richtlinie an die Anwendung anpassen",
        "各指摘を読み、推奨ポリシーをアプリに合わせて調整",
        "阅读每条发现并根据应用调整建议策略",
        "اقرأ كل نتيجة وكيّف السياسة المقترحة مع تطبيقك"
    ],
    "Test new CSP policies with Content-Security-Policy-Report-Only first.": [
        "नई CSP नीति पहले Content-Security-Policy-Report-Only से जाँचें।",
        "Pruebe primero las políticas CSP con Content-Security-Policy-Report-Only.",
        "Testez d’abord les politiques CSP avec Content-Security-Policy-Report-Only.",
        "Neue CSP-Richtlinien zuerst mit Content-Security-Policy-Report-Only testen.",
        "新しいCSPは最初にContent-Security-Policy-Report-Onlyでテストしてください。",
        "首先使用 Content-Security-Policy-Report-Only 测试新的 CSP 策略。",
        "اختبر سياسات CSP الجديدة باستخدام Content-Security-Policy-Report-Only أولًا."
    ],
    "Do not enable HSTS preload until every relevant subdomain supports HTTPS.": [
        "सभी संबंधित उपडोमेन HTTPS समर्थित होने तक HSTS preload चालू न करें।",
        "No active HSTS preload hasta que todos los subdominios relevantes admitan HTTPS.",
        "N’activez HSTS preload que lorsque tous les sous-domaines concernés prennent en charge HTTPS.",
        "HSTS preload erst aktivieren, wenn alle relevanten Subdomains HTTPS unterstützen.",
        "関係するすべてのサブドメインがHTTPSに対応するまでHSTS preloadを有効にしないでください。",
        "所有相关子域支持 HTTPS 后才可启用 HSTS preload。",
        "لا تفعّل HSTS preload حتى تدعم جميع النطاقات الفرعية المعنية HTTPS."
    ],
    "A green result is not a substitute for application security testing.": [
        "हरा परिणाम अनुप्रयोग सुरक्षा परीक्षण का विकल्प नहीं है।",
        "Un resultado verde no sustituye las pruebas de seguridad.",
        "Un résultat vert ne remplace pas les tests de sécurité applicative.",
        "Ein grünes Ergebnis ersetzt keine Anwendungssicherheitstests.",
        "良好な結果でもアプリのセキュリティテストは必要です。",
        "绿色结果不能替代应用安全测试。",
        "النتيجة الخضراء لا تغني عن اختبار أمان التطبيق."
    ],
    "Deployment reviews": [
        "डिप्लॉयमेंट समीक्षा",
        "Revisiones de despliegue",
        "Revues de déploiement",
        "Bereitstellungen prüfen",
        "デプロイのレビュー",
        "部署审查",
        "مراجعات النشر"
    ],
    "CSP migrations": [
        "CSP माइग्रेशन",
        "Migraciones CSP",
        "Migrations CSP",
        "CSP-Migrationen",
        "CSPの移行",
        "CSP 迁移",
        "ترحيل CSP"
    ],
    "CDN and reverse-proxy configuration checks": [
        "CDN और रिवर्स प्रॉक्सी विन्यास की जाँच",
        "Revisar configuración CDN y proxy inverso",
        "Vérifier le CDN et le proxy inverse",
        "CDN- und Reverse-Proxy-Konfiguration prüfen",
        "CDNとリバースプロキシの設定確認",
        "检查 CDN 和反向代理配置",
        "فحص إعدادات CDN والوكيل العكسي"
    ],
    "Response headers": [
        "प्रतिक्रिया हेडर",
        "Cabeceras de respuesta",
        "En-têtes de réponse",
        "Antwortheader",
        "応答ヘッダー",
        "响应头",
        "ترويسات الاستجابة"
    ],
    "HTTP response headers": [
        "HTTP प्रतिक्रिया हेडर",
        "Cabeceras de respuesta HTTP",
        "En-têtes de réponse HTTP",
        "HTTP-Antwortheader",
        "HTTP応答ヘッダー",
        "HTTP 响应头",
        "ترويسات استجابة HTTP"
    ],
    "Headers parsed: {count}": [
        "पार्स किए हेडर: {count}",
        "Cabeceras analizadas: {count}",
        "En-têtes analysés : {count}",
        "Geparste Header: {count}",
        "解析したヘッダー：{count}",
        "已解析响应头：{count}",
        "الترويسات المحللة: {count}"
    ],
    "Findings": [
        "निष्कर्ष",
        "Hallazgos",
        "Constats",
        "Befunde",
        "指摘事項",
        "发现",
        "النتائج"
    ],
    "Local analysis only": [
        "केवल स्थानीय विश्लेषण",
        "Solo análisis local",
        "Analyse locale uniquement",
        "Nur lokale Analyse",
        "ローカル解析のみ",
        "仅本地分析",
        "تحليل محلي فقط"
    ],
    "This tool does not fetch a URL or send your headers anywhere.": [
        "यह टूल URL से डेटा नहीं लाता और हेडर कहीं नहीं भेजता।",
        "Esta herramienta no consulta URL ni envía sus cabeceras.",
        "Cet outil ne consulte aucune URL et ne transmet pas vos en-têtes.",
        "Dieses Werkzeug ruft keine URL ab und sendet keine Header.",
        "このツールはURLの取得やヘッダーの送信を行いません。",
        "本工具不会请求 URL 或发送响应头。",
        "لا تجلب الأداة أي URL ولا ترسل ترويساتك إلى أي مكان."
    ],
    "High-priority findings: {count}": [
        "उच्च प्राथमिकता के निष्कर्ष: {count}",
        "Hallazgos prioritarios: {count}",
        "Constats prioritaires : {count}",
        "Befunde hoher Priorität: {count}",
        "優先度の高い指摘：{count}",
        "高优先级发现：{count}",
        "النتائج عالية الأولوية: {count}"
    ],
    "No high-priority finding": [
        "उच्च प्राथमिकता का कोई निष्कर्ष नहीं",
        "Sin hallazgos prioritarios",
        "Aucun constat prioritaire",
        "Kein Befund hoher Priorität",
        "優先度の高い指摘なし",
        "无高优先级发现",
        "لا نتائج عالية الأولوية"
    ],
    "Review Compose YAML services, networking, port exposure, and deployment hygiene locally": [
        "Compose YAML सेवाएँ, नेटवर्क, पोर्ट एक्सपोज़र और डिप्लॉयमेंट स्थानीय रूप से जाँचें",
        "Revisar servicios, redes, puertos y prácticas de despliegue de Compose YAML localmente",
        "Examiner localement les services, réseaux, ports exposés et pratiques de déploiement Compose YAML",
        "Compose-YAML-Dienste, Netzwerke, offene Ports und Bereitstellung lokal prüfen",
        "Compose YAMLのサービス、ネットワーク、公開ポート、デプロイ構成をローカル確認",
        "本地检查 Compose YAML 服务、网络、端口暴露和部署配置",
        "مراجعة خدمات Compose YAML والشبكات والمنافذ وممارسات النشر محليًا"
    ],
    "A local Docker Compose structure and risk analyzer for services, ports, volumes, networks, privilege, host networking, and health checks.": [
        "Docker Compose की सेवाएँ, पोर्ट, वॉल्यूम, नेटवर्क, विशेषाधिकार, होस्ट नेटवर्क और हेल्थचेक का स्थानीय संरचना व जोखिम विश्लेषण।",
        "Análisis local de estructura y riesgos Docker Compose: servicios, puertos, volúmenes, redes, privilegios, red host y healthchecks.",
        "Analyse locale de la structure et des risques Docker Compose : services, ports, volumes, réseaux, privilèges, réseau hôte et healthchecks.",
        "Lokale Docker-Compose-Struktur- und Risikoanalyse für Dienste, Ports, Volumes, Netzwerke, Privilegien, Host-Netzwerk und Healthchecks.",
        "Docker Composeのサービス、ポート、ボリューム、ネットワーク、権限、ホスト接続、ヘルスチェックをローカル解析します。",
        "本地分析 Docker Compose 的服务、端口、卷、网络、权限、主机网络和健康检查结构与风险。",
        "تحليل محلي لبنية Docker Compose ومخاطره: الخدمات والمنافذ ووحدات التخزين والشبكات والصلاحيات وشبكة المضيف وفحوص الصحة."
    ],
    "Compose files grow into production-like architecture quickly. This summarizes topology and highlights a few high-signal deployment concerns.": [
        "Compose फ़ाइलें जल्दी जटिल बन जाती हैं। यह संरचना का सार और प्रमुख डिप्लॉयमेंट समस्याएँ दिखाता है।",
        "Los archivos Compose crecen rápidamente. Este análisis resume la topología y destaca problemas importantes de despliegue.",
        "Les fichiers Compose se complexifient vite. Cet outil résume la topologie et signale des problèmes de déploiement importants.",
        "Compose-Dateien werden schnell komplex. Diese Analyse fasst die Topologie zusammen und zeigt wichtige Bereitstellungsprobleme.",
        "Composeの構成は複雑になりがちです。トポロジーを要約し、主要なデプロイ上の懸念を示します。",
        "Compose 配置会迅速变得复杂。本工具总结拓扑并标出关键部署问题。",
        "تتعقد ملفات Compose سريعًا. يلخص المحلل البنية ويبرز مشكلات نشر مهمة."
    ],
    "Paste a compose.yaml file": [
        "compose.yaml फ़ाइल चिपकाएँ",
        "Pegar un archivo compose.yaml",
        "Coller un fichier compose.yaml",
        "compose.yaml-Datei einfügen",
        "compose.yamlファイルを貼り付け",
        "粘贴 compose.yaml 文件",
        "ألصق ملف compose.yaml"
    ],
    "Review service, volume, and network totals": [
        "सेवा, वॉल्यूम और नेटवर्क की संख्या जाँचें",
        "Revisar totales de servicios, volúmenes y redes",
        "Vérifier les nombres de services, volumes et réseaux",
        "Anzahl von Diensten, Volumes und Netzwerken prüfen",
        "サービス、ボリューム、ネットワークの件数を確認",
        "查看服务、卷和网络总数",
        "راجع أعداد الخدمات ووحدات التخزين والشبكات"
    ],
    "Work through errors and warnings": [
        "त्रुटियाँ और चेतावनियाँ ठीक करें",
        "Revisar errores y advertencias",
        "Traiter les erreurs et avertissements",
        "Fehler und Warnungen bearbeiten",
        "エラーと警告に対処",
        "处理错误与警告",
        "عالج الأخطاء والتحذيرات"
    ],
    "Keep runtime secrets in a protected environment source": [
        "रनटाइम सीक्रेट सुरक्षित परिवेश स्रोत में रखें",
        "Mantener secretos en una fuente de entorno protegida",
        "Garder les secrets dans une source d’environnement protégée",
        "Laufzeitgeheimnisse in geschützter Umgebungsquelle halten",
        "実行時シークレットは保護された環境情報源で管理",
        "将运行时密钥保存在受保护的环境源中",
        "احتفظ بأسرار التشغيل في مصدر بيئة محمي"
    ],
    "This tool does not start containers or upload a compose file.": [
        "यह टूल कंटेनर नहीं चलाता और Compose फ़ाइल अपलोड नहीं करता।",
        "Esta herramienta no inicia contenedores ni sube archivos Compose.",
        "Cet outil ne lance pas de conteneur et n’envoie pas de fichier Compose.",
        "Dieses Werkzeug startet keine Container und lädt keine Compose-Datei hoch.",
        "このツールはコンテナーを起動せずComposeファイルを送信しません。",
        "本工具不会启动容器或上传 Compose 文件。",
        "لا تشغّل الأداة حاويات ولا ترفع ملف Compose."
    ],
    "It complements, but does not replace, Docker Compose config validation.": [
        "यह Docker Compose config सत्यापन में मदद करता है, उसका विकल्प नहीं है।",
        "Complementa la validación config de Docker Compose, sin sustituirla.",
        "Complète la validation config de Docker Compose sans la remplacer.",
        "Ergänzt die Docker-Compose-config-Prüfung, ersetzt sie aber nicht.",
        "Docker Compose configの検証を補助しますが、代替ではありません。",
        "本工具辅助 Docker Compose config 验证，不能替代它。",
        "يكمل التحقق من Docker Compose config ولا يستبدله."
    ],
    "A healthcheck should reflect real application readiness.": [
        "हेल्थचेक अनुप्रयोग की वास्तविक तैयारी दर्शाए।",
        "Un healthcheck debe reflejar la disponibilidad real de la aplicación.",
        "Un healthcheck doit refléter la disponibilité réelle de l’application.",
        "Ein Healthcheck sollte echte Anwendungsbereitschaft abbilden.",
        "ヘルスチェックは実際のアプリ稼働準備を反映させてください。",
        "健康检查应反映应用的真实就绪状态。",
        "ينبغي أن يعكس فحص الصحة جاهزية التطبيق الفعلية."
    ],
    "Local development stack reviews": [
        "स्थानीय डेवलपमेंट स्टैक की समीक्षा",
        "Revisiones de entornos de desarrollo local",
        "Revues des environnements de développement local",
        "Lokale Entwicklungsstacks prüfen",
        "ローカル開発スタックのレビュー",
        "本地开发栈审查",
        "مراجعة بيئات التطوير المحلية"
    ],
    "Container security checks": [
        "कंटेनर सुरक्षा जाँच",
        "Controles de seguridad de contenedores",
        "Contrôles de sécurité des conteneurs",
        "Container-Sicherheitsprüfungen",
        "コンテナーのセキュリティ確認",
        "容器安全检查",
        "فحوص أمان الحاويات"
    ],
    "Architecture onboarding": [
        "आर्किटेक्चर परिचय",
        "Introducción a la arquitectura",
        "Découverte de l’architecture",
        "Einführung in die Architektur",
        "アーキテクチャの把握",
        "架构入门",
        "التعرف على البنية"
    ],
    "Docker Compose YAML": [
        "Docker Compose YAML दस्तावेज़",
        "Documento YAML de Docker Compose",
        "Document YAML Docker Compose",
        "Docker-Compose-YAML-Dokument",
        "Docker ComposeのYAML",
        "Docker Compose YAML 文档",
        "مستند Docker Compose YAML"
    ],
    "Stack summary": [
        "स्टैक सारांश",
        "Resumen del entorno",
        "Résumé de l’environnement",
        "Stack-Zusammenfassung",
        "スタックの概要",
        "技术栈摘要",
        "ملخص البيئة"
    ],
    "Invalid Compose document": [
        "अमान्य Compose दस्तावेज़",
        "Documento Compose no válido",
        "Document Compose invalide",
        "Ungültiges Compose-Dokument",
        "Composeドキュメントが無効です",
        "Compose 文档无效",
        "مستند Compose غير صالح"
    ],
    "Services": [
        "सेवाएँ",
        "Servicios",
        "Services Compose",
        "Dienste",
        "サービス",
        "服务",
        "الخدمات"
    ],
    "Networks": [
        "नेटवर्क",
        "Redes",
        "Réseaux",
        "Netzwerke",
        "ネットワーク",
        "网络",
        "الشبكات"
    ],
    "Volumes": [
        "वॉल्यूम",
        "Volúmenes",
        "Volumes de stockage",
        "Speicher-Volumes",
        "ボリューム",
        "卷",
        "وحدات التخزين"
    ],
    "Parsed in this browser only; no Docker daemon is contacted.": [
        "केवल इस ब्राउज़र में पार्स होता है; Docker डेमन से संपर्क नहीं होता।",
        "Se analiza solo en el navegador; no se contacta ningún daemon Docker.",
        "Analyse uniquement dans ce navigateur ; aucun démon Docker n’est contacté.",
        "Nur in diesem Browser geparst; kein Docker-Daemon wird kontaktiert.",
        "このブラウザー内のみで解析し、Dockerデーモンには接続しません。",
        "仅在浏览器中解析，不连接 Docker 守护进程。",
        "يُحلل في هذا المتصفح فقط؛ ولا يُتصل بخدمة Docker."
    ],
    "Host port exposure: {port}.": [
        "होस्ट पर खुला पोर्ट: {port}।",
        "Puerto expuesto del host: {port}.",
        "Port exposé sur l’hôte : {port}.",
        "Offener Host-Port: {port}.",
        "ホストに公開されたポート：{port}。",
        "主机暴露端口：{port}。",
        "منفذ مكشوف على المضيف: {port}."
    ],
    "Credential id is missing.": [
        "क्रेडेंशियल आईडी नहीं है।",
        "Falta el ID de credencial.",
        "L’ID d’identifiant est absent.",
        "Anmeldedaten-ID fehlt.",
        "認証情報IDがありません。",
        "缺少凭据 ID。",
        "معرّف الاعتماد مفقود."
    ],
    "clientDataJSON is missing.": [
        "clientDataJSON नहीं है।",
        "Falta clientDataJSON.",
        "clientDataJSON est absent.",
        "clientDataJSON fehlt.",
        "clientDataJSONがありません。",
        "缺少 clientDataJSON。",
        "clientDataJSON مفقود."
    ],
    "clientDataJSON is not valid base64url-encoded JSON.": [
        "clientDataJSON मान्य base64url-एन्कोडेड JSON नहीं है।",
        "clientDataJSON no es JSON válido codificado en base64url.",
        "clientDataJSON n’est pas un JSON valide encodé en base64url.",
        "clientDataJSON ist kein gültiges base64url-kodiertes JSON.",
        "clientDataJSONが有効なbase64urlエンコードJSONではありません。",
        "clientDataJSON 不是有效的 base64url 编码 JSON。",
        "clientDataJSON ليس JSON صالحًا بترميز base64url."
    ],
    "authenticatorData is not valid base64url.": [
        "authenticatorData मान्य base64url नहीं है।",
        "authenticatorData no es base64url válido.",
        "authenticatorData n’est pas un base64url valide.",
        "authenticatorData ist kein gültiges base64url.",
        "authenticatorDataが有効なbase64urlではありません。",
        "authenticatorData 不是有效的 base64url。",
        "authenticatorData ليس base64url صالحًا."
    ],
    "No services were declared under `services`.": [
        "`services` में कोई सेवा घोषित नहीं है।",
        "No se declararon servicios en `services`.",
        "Aucun service déclaré sous `services`.",
        "Unter `services` sind keine Dienste definiert.",
        "`services`にサービスが宣言されていません。",
        "`services` 下未声明服务。",
        "لم تُعلن خدمات ضمن `services`."
    ],
    "Service needs an image or build definition.": [
        "सेवा के लिए image या build परिभाषा चाहिए।",
        "El servicio necesita image o una definición build.",
        "Le service nécessite une image ou une définition build.",
        "Dienst benötigt image oder eine build-Definition.",
        "サービスにimageまたはbuildの定義が必要です。",
        "服务需要 image 或 build 定义。",
        "تحتاج الخدمة إلى image أو تعريف build."
    ],
    "Privileged containers have broad host access.": [
        "विशेषाधिकार वाले कंटेनर को होस्ट की व्यापक पहुँच होती है।",
        "Los contenedores privilegiados tienen amplio acceso al host.",
        "Les conteneurs privilégiés ont un accès étendu à l’hôte.",
        "Privilegierte Container haben weitreichenden Host-Zugriff.",
        "特権コンテナーはホストへ広範にアクセスできます。",
        "特权容器对主机有广泛访问权限。",
        "تتمتع الحاويات ذات الامتياز بوصول واسع إلى المضيف."
    ],
    "Host networking bypasses normal container network isolation.": [
        "होस्ट नेटवर्क सामान्य कंटेनर नेटवर्क अलगाव को बायपास करता है।",
        "La red host evita el aislamiento normal de red de contenedores.",
        "Le réseau hôte contourne l’isolation réseau normale des conteneurs.",
        "Host-Netzwerk umgeht die normale Container-Netzwerkisolation.",
        "ホストネットワークは通常のコンテナーネットワーク分離を回避します。",
        "主机网络绕过容器的常规网络隔离。",
        "تتجاوز شبكة المضيف عزل شبكة الحاوية المعتاد."
    ],
    "No healthcheck is defined.": [
        "healthcheck परिभाषित नहीं है।",
        "No se ha definido healthcheck.",
        "Aucun healthcheck n’est défini.",
        "Kein healthcheck definiert.",
        "healthcheckが定義されていません。",
        "未定义 healthcheck。",
        "لم يُعرّف healthcheck."
    ],
    "Content-Security-Policy is missing": [
        "Content-Security-Policy नहीं है",
        "Falta Content-Security-Policy",
        "Content-Security-Policy est absent",
        "Content-Security-Policy fehlt",
        "Content-Security-Policyがありません",
        "缺少 Content-Security-Policy",
        "Content-Security-Policy مفقودة"
    ],
    "Start with a report-only policy, then enforce a policy tailored to your application.": [
        "पहले केवल रिपोर्ट वाली नीति आज़माएँ, फिर अनुप्रयोग के अनुसार नीति लागू करें।",
        "Comience con una política de solo informe y luego aplique una adaptada a su aplicación.",
        "Commencez par une politique de rapport seul, puis appliquez-en une adaptée à votre application.",
        "Mit einer reinen Melderichtlinie beginnen und anschließend eine passende Richtlinie erzwingen.",
        "まずレポート専用ポリシーで試し、その後アプリに合うポリシーを適用してください。",
        "先使用仅报告策略，再强制实施适合应用的策略。",
        "ابدأ بسياسة للإبلاغ فقط، ثم طبّق سياسة مناسبة لتطبيقك."
    ],
    "CSP permits inline code": [
        "CSP इनलाइन कोड की अनुमति देता है",
        "CSP permite código en línea",
        "CSP autorise le code en ligne",
        "CSP erlaubt Inline-Code",
        "CSPがインラインコードを許可しています",
        "CSP 允许内联代码",
        "تسمح CSP بالكود المضمن"
    ],
    "Replace unsafe-inline with nonces or hashes where possible.": [
        "जहाँ संभव हो unsafe-inline को nonce या हैश से बदलें।",
        "Sustituya unsafe-inline por nonces o hashes cuando sea posible.",
        "Remplacez unsafe-inline par des nonces ou des hachages si possible.",
        "unsafe-inline möglichst durch Nonces oder Hashes ersetzen.",
        "可能ならunsafe-inlineをnonceまたはハッシュに置き換えてください。",
        "尽可能用 nonce 或哈希替代 unsafe-inline。",
        "استبدل unsafe-inline بقيم nonce أو بصمات حيثما أمكن."
    ],
    "CSP permits eval-like code": [
        "CSP eval जैसे कोड की अनुमति देता है",
        "CSP permite código tipo eval",
        "CSP autorise du code de type eval",
        "CSP erlaubt eval-artigen Code",
        "CSPがeval相当のコードを許可しています",
        "CSP 允许类似 eval 的代码",
        "تسمح CSP بكود شبيه بـ eval"
    ],
    "Remove unsafe-eval unless a verified dependency requires it.": [
        "सत्यापित निर्भरता को ज़रूरत न हो तो unsafe-eval हटाएँ।",
        "Quite unsafe-eval salvo que una dependencia verificada lo requiera.",
        "Retirez unsafe-eval sauf si une dépendance vérifiée l’exige.",
        "unsafe-eval entfernen, sofern keine geprüfte Abhängigkeit es benötigt.",
        "検証済みの依存関係で必要な場合を除きunsafe-evalを削除してください。",
        "除非已验证的依赖需要，否则移除 unsafe-eval。",
        "أزل unsafe-eval ما لم تتطلبه تبعية موثوقة."
    ],
    "CSP does not set object-src": [
        "CSP में object-src सेट नहीं है",
        "CSP no define object-src",
        "CSP ne définit pas object-src",
        "CSP legt object-src nicht fest",
        "CSPにobject-srcがありません",
        "CSP 未设置 object-src",
        "لا تضبط CSP قيمة object-src"
    ],
    "Use `object-src 'none'` unless plugins are required.": [
        "प्लगइन की ज़रूरत न हो तो `object-src 'none'` उपयोग करें।",
        "Use `object-src 'none'` salvo que necesite complementos.",
        "Utilisez `object-src 'none'` sauf si des plugins sont requis.",
        "`object-src 'none'` verwenden, sofern keine Plugins nötig sind.",
        "プラグインが不要なら`object-src 'none'`を使ってください。",
        "不需要插件时请使用 `object-src 'none'`。",
        "استخدم `object-src 'none'` ما لم تكن الإضافات مطلوبة."
    ],
    "CSP does not set frame-ancestors": [
        "CSP में frame-ancestors सेट नहीं है",
        "CSP no define frame-ancestors",
        "CSP ne définit pas frame-ancestors",
        "CSP legt frame-ancestors nicht fest",
        "CSPにframe-ancestorsがありません",
        "CSP 未设置 frame-ancestors",
        "لا تضبط CSP قيمة frame-ancestors"
    ],
    "Use frame-ancestors to control who can embed the page.": [
        "पृष्ठ एम्बेड करने वालों को नियंत्रित करने के लिए frame-ancestors लें।",
        "Use frame-ancestors para controlar quién puede incrustar la página.",
        "Utilisez frame-ancestors pour contrôler qui peut intégrer la page.",
        "Mit frame-ancestors steuern, wer die Seite einbetten darf.",
        "frame-ancestorsでページを埋め込めるサイトを制御してください。",
        "使用 frame-ancestors 控制谁可以嵌入页面。",
        "استخدم frame-ancestors للتحكم بمن يمكنه تضمين الصفحة."
    ],
    "HSTS is missing": [
        "HSTS नहीं है",
        "Falta HSTS",
        "HSTS est absent",
        "HSTS fehlt",
        "HSTSがありません",
        "缺少 HSTS",
        "HSTS مفقودة"
    ],
    "On HTTPS sites, consider Strict-Transport-Security after verifying all subdomains.": [
        "HTTPS साइट में सभी उपडोमेन जाँचकर Strict-Transport-Security अपनाएँ।",
        "En sitios HTTPS, considere Strict-Transport-Security tras verificar todos los subdominios.",
        "Sur HTTPS, envisagez Strict-Transport-Security après vérification de tous les sous-domaines.",
        "Auf HTTPS-Seiten nach Prüfung aller Subdomains Strict-Transport-Security erwägen.",
        "HTTPSサイトでは全サブドメインの確認後にStrict-Transport-Securityを検討してください。",
        "HTTPS 网站在检查所有子域后可考虑 Strict-Transport-Security。",
        "في مواقع HTTPS، فكّر في Strict-Transport-Security بعد التحقق من جميع النطاقات الفرعية."
    ],
    "X-Content-Type-Options: nosniff is missing": [
        "X-Content-Type-Options: nosniff नहीं है",
        "Falta X-Content-Type-Options: nosniff",
        "X-Content-Type-Options: nosniff est absent",
        "X-Content-Type-Options: nosniff fehlt",
        "X-Content-Type-Options: nosniffがありません",
        "缺少 X-Content-Type-Options: nosniff",
        "X-Content-Type-Options: nosniff مفقودة"
    ],
    "Prevent content type sniffing for script and style responses.": [
        "स्क्रिप्ट और स्टाइल प्रतिक्रियाओं में सामग्री प्रकार अनुमान रोकें।",
        "Evite la detección automática del tipo en respuestas de scripts y estilos.",
        "Empêchez la détection automatique du type pour les scripts et styles.",
        "Inhaltstyp-Erkennung bei Skript- und Style-Antworten verhindern.",
        "スクリプトとスタイル応答のコンテンツタイプ推測を防止してください。",
        "防止脚本和样式响应的内容类型嗅探。",
        "امنع تخمين نوع المحتوى لاستجابات البرامج والأنماط."
    ],
    "Referrer-Policy is missing": [
        "Referrer-Policy नहीं है",
        "Falta Referrer-Policy",
        "Referrer-Policy est absent",
        "Referrer-Policy fehlt",
        "Referrer-Policyがありません",
        "缺少 Referrer-Policy",
        "Referrer-Policy مفقودة"
    ],
    "Use strict-origin-when-cross-origin or a stricter policy where appropriate.": [
        "उचित होने पर strict-origin-when-cross-origin या अधिक कठोर नीति लें।",
        "Use strict-origin-when-cross-origin o una política más estricta según corresponda.",
        "Utilisez strict-origin-when-cross-origin ou une politique plus stricte si nécessaire.",
        "strict-origin-when-cross-origin oder bei Bedarf eine strengere Richtlinie verwenden.",
        "strict-origin-when-cross-origin、または必要に応じてより厳しいポリシーを使ってください。",
        "使用 strict-origin-when-cross-origin，或酌情使用更严格的策略。",
        "استخدم strict-origin-when-cross-origin أو سياسة أشد عند الحاجة."
    ],
    "Permissions-Policy is missing": [
        "Permissions-Policy नहीं है",
        "Falta Permissions-Policy",
        "Permissions-Policy est absent",
        "Permissions-Policy fehlt",
        "Permissions-Policyがありません",
        "缺少 Permissions-Policy",
        "Permissions-Policy مفقودة"
    ],
    "Explicitly restrict sensitive browser capabilities that your site does not use.": [
        "साइट में उपयोग न होने वाली संवेदनशील ब्राउज़र क्षमताएँ सीमित करें।",
        "Restrinja explícitamente capacidades sensibles del navegador que su sitio no use.",
        "Restreignez explicitement les fonctions sensibles du navigateur inutilisées par votre site.",
        "Nicht benötigte sensible Browserfunktionen ausdrücklich einschränken.",
        "サイトで使わない機密性の高いブラウザー機能を明示的に制限してください。",
        "明确限制网站不使用的敏感浏览器能力。",
        "قيّد صراحة إمكانات المتصفح الحساسة التي لا يستخدمها موقعك."
    ],
    "No common header gaps detected": [
        "सामान्य हेडर की कोई कमी नहीं मिली",
        "No se detectaron carencias comunes de cabeceras",
        "Aucune lacune courante détectée dans les en-têtes",
        "Keine üblichen Header-Lücken erkannt",
        "一般的なヘッダーの不足は検出されませんでした",
        "未发现常见响应头缺口",
        "لم تُكتشف نواقص شائعة في الترويسات"
    ],
    "Review the policy against your application’s real resource and embedding requirements before deploying.": [
        "डिप्लॉय करने से पहले नीति को वास्तविक संसाधन और एम्बेडिंग आवश्यकताओं से जाँचें।",
        "Revise la política según los recursos e incrustaciones reales de su aplicación antes de desplegar.",
        "Vérifiez la politique selon les besoins réels de ressources et d’intégration avant déploiement.",
        "Richtlinie vor der Bereitstellung an realen Ressourcen- und Einbettungsanforderungen prüfen.",
        "デプロイ前に実際のリソースと埋め込み要件に照らしてポリシーを確認してください。",
        "部署前根据应用实际资源及嵌入要求审查策略。",
        "راجع السياسة وفق متطلبات الموارد والتضمين الفعلية لتطبيقك قبل النشر."
    ],
    "Body exceeds the 1 MiB limit.": [
        "बॉडी 1 MiB सीमा से बड़ी है।",
        "El cuerpo supera el límite de 1 MiB.",
        "Le corps dépasse la limite de 1 MiB.",
        "Anfragetext überschreitet 1 MiB.",
        "本文が1 MiBの上限を超えています。",
        "请求体超过 1 MiB 限制。",
        "يتجاوز النص حد 1 MiB."
    ],
    "Enter the signing secret. It stays in this page's memory.": [
        "हस्ताक्षर सीक्रेट दें। यह केवल पृष्ठ की मेमोरी में रहता है।",
        "Introduzca el secreto de firma. Solo permanece en la memoria de esta página.",
        "Saisissez le secret de signature. Il reste en mémoire sur cette page.",
        "Signaturgeheimnis eingeben. Es bleibt im Seitenspeicher.",
        "署名シークレットを入力してください。このページのメモリー内にのみ保持します。",
        "请输入签名密钥，仅保留在本页内存中。",
        "أدخل سر التوقيع. يبقى في ذاكرة هذه الصفحة."
    ],
    "A valid Unix timestamp is required by this signature scheme.": [
        "इस हस्ताक्षर योजना में मान्य Unix समय चाहिए।",
        "Este esquema de firma requiere una marca Unix válida.",
        "Ce schéma de signature exige un horodatage Unix valide.",
        "Dieses Signaturschema benötigt einen gültigen Unix-Zeitstempel.",
        "この署名方式には有効なUnixタイムスタンプが必要です。",
        "此签名方案需要有效的 Unix 时间戳。",
        "يتطلب مخطط التوقيع هذا طابع Unix زمنيًا صالحًا."
    ],
    "Signature mismatch. Check the provider, signing secret, signature header, and exact raw body bytes.": [
        "हस्ताक्षर मेल नहीं खाता। प्रदाता, सीक्रेट, हेडर और मूल बॉडी बाइट जाँचें।",
        "La firma no coincide. Revise proveedor, secreto, cabecera y bytes exactos del cuerpo.",
        "La signature ne correspond pas. Vérifiez le fournisseur, le secret, l’en-tête et les octets exacts du corps.",
        "Signatur stimmt nicht überein. Anbieter, Geheimnis, Header und exakte Rohdaten prüfen.",
        "署名が一致しません。提供元、シークレット、ヘッダー、本文の正確なバイト列を確認してください。",
        "签名不匹配。请检查提供方、密钥、签名头和请求体的精确原始字节。",
        "التوقيع غير متطابق. راجع المزود والسر وترويسة التوقيع وبايتات النص الخام الدقيقة."
    ],
    "The signature matches, but the timestamp is outside the allowed window.": [
        "हस्ताक्षर सही है, पर समय अनुमत अवधि से बाहर है।",
        "La firma coincide, pero la marca temporal está fuera del intervalo permitido.",
        "La signature correspond, mais l’horodatage est hors de la fenêtre autorisée.",
        "Signatur stimmt überein, aber der Zeitstempel liegt außerhalb des erlaubten Fensters.",
        "署名は一致しますが、タイムスタンプが許容範囲外です。",
        "签名匹配，但时间戳超出允许范围。",
        "التوقيع متطابق، لكن الطابع الزمني خارج النافذة المسموح بها."
    ],
    "Signature matches. This diagnostic does not replace server-side verification and replay protection.": [
        "हस्ताक्षर सही है। यह निदान सर्वर सत्यापन और रीप्ले सुरक्षा का विकल्प नहीं है।",
        "La firma coincide. Este diagnóstico no sustituye la verificación en servidor ni la protección contra repetición.",
        "La signature correspond. Ce diagnostic ne remplace ni la vérification serveur ni la protection contre le rejeu.",
        "Signatur stimmt überein. Diese Diagnose ersetzt weder Serverprüfung noch Replay-Schutz.",
        "署名は一致します。この診断はサーバー側の検証やリプレイ対策を代替しません。",
        "签名匹配。本诊断不能替代服务端验证和重放保护。",
        "التوقيع متطابق. لا يغني هذا التشخيص عن التحقق على الخادم والحماية من إعادة الإرسال."
    ],
    "WebAuthn supported by this browser": [
        "इस ब्राउज़र में WebAuthn समर्थित है",
        "Este navegador admite WebAuthn",
        "Ce navigateur prend en charge WebAuthn",
        "Dieser Browser unterstützt WebAuthn",
        "このブラウザーはWebAuthnに対応しています",
        "此浏览器支持 WebAuthn",
        "يدعم هذا المتصفح WebAuthn"
    ],
    "WebAuthn unavailable in this browser": [
        "इस ब्राउज़र में WebAuthn उपलब्ध नहीं है",
        "WebAuthn no está disponible en este navegador",
        "WebAuthn est indisponible dans ce navigateur",
        "WebAuthn ist in diesem Browser nicht verfügbar",
        "このブラウザーではWebAuthnを利用できません",
        "此浏览器不支持 WebAuthn",
        "WebAuthn غير متاح في هذا المتصفح"
    ],
    "HIGH": [
        "उच्च",
        "ALTA",
        "ÉLEVÉ",
        "HOCH",
        "高",
        "高风险",
        "مرتفع"
    ],
    "MEDIUM": [
        "मध्यम",
        "MEDIA",
        "MOYEN",
        "MITTEL",
        "中",
        "中风险",
        "متوسط"
    ],
    "LOW": [
        "निम्न",
        "BAJA",
        "FAIBLE",
        "NIEDRIG",
        "低",
        "低风险",
        "منخفض"
    ],
    "INFO": [
        "जानकारी",
        "INFORMACIÓN",
        "INFORMATION",
        "HINWEIS",
        "情報",
        "提示",
        "معلومات"
    ],
    "ERROR": [
        "त्रुटि",
        "ERROR DETECTADO",
        "ERREUR",
        "FEHLER",
        "エラー",
        "错误",
        "خطأ"
    ],
    "WARNING": [
        "चेतावनी",
        "ADVERTENCIA",
        "AVERTISSEMENT",
        "WARNUNG",
        "警告",
        "警告",
        "تحذير"
    ],
    "Verifying…": [
        "सत्यापन जारी…",
        "Verificando…",
        "Vérification…",
        "Prüfung läuft…",
        "検証中…",
        "正在验证…",
        "جارٍ التحقق…"
    ],
    "Verify signature": [
        "हस्ताक्षर जाँचें",
        "Verificar firma",
        "Vérifier la signature",
        "Signatur prüfen",
        "署名を検証",
        "验证签名",
        "التحقق من التوقيع"
    ],
    "Invalid webhook fixture.": [
        "अमान्य वेबहुक टेस्ट डेटा।",
        "Datos de prueba de webhook no válidos.",
        "Jeu d’essai webhook invalide.",
        "Ungültige Webhook-Testdaten.",
        "Webhookのテストデータが無効です。",
        "Webhook 测试数据无效。",
        "بيانات اختبار webhook غير صالحة."
    ],
    "Body limit is 1 MiB.": [
        "बॉडी की सीमा 1 MiB है।",
        "El límite del cuerpo es 1 MiB.",
        "Le corps est limité à 1 MiB.",
        "Anfragetext ist auf 1 MiB begrenzt.",
        "本文の上限は1 MiBです。",
        "请求体上限为 1 MiB。",
        "حد النص 1 MiB."
    ],
    "The file is not valid UTF-8. Body bytes were not changed or verified.": [
        "फ़ाइल मान्य UTF-8 नहीं है। बॉडी बाइट बदली या सत्यापित नहीं की गईं।",
        "El archivo no es UTF-8 válido. No se modificaron ni verificaron los bytes del cuerpo.",
        "Le fichier n’est pas en UTF-8 valide. Les octets du corps n’ont été ni modifiés ni vérifiés.",
        "Datei ist kein gültiges UTF-8. Rohdaten wurden weder geändert noch geprüft.",
        "ファイルは有効なUTF-8ではありません。本文のバイト列は変更・検証していません。",
        "文件不是有效的 UTF-8。请求体字节未更改或验证。",
        "الملف ليس UTF-8 صالحًا. لم تُغير بايتات النص أو يُتحقق منها."
    ],
    "Choose a file smaller than 5 MiB.": [
        "5 MiB से छोटी फ़ाइल चुनें।",
        "Elija un archivo de menos de 5 MiB.",
        "Choisissez un fichier de moins de 5 MiB.",
        "Datei kleiner als 5 MiB auswählen.",
        "5 MiB未満のファイルを選択してください。",
        "请选择小于 5 MiB 的文件。",
        "اختر ملفًا أصغر من 5 MiB."
    ],
    "Unable to parse Compose YAML.": [
        "Compose YAML पार्स नहीं हो सका।",
        "No se puede analizar Compose YAML.",
        "Impossible d’analyser le YAML Compose.",
        "Compose-YAML kann nicht geparst werden.",
        "Compose YAMLを解析できません。",
        "无法解析 Compose YAML。",
        "تعذر تحليل Compose YAML."
    ]
};
