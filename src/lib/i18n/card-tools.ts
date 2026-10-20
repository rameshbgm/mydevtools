import type { TranslationColumns } from "./tool-names";

// Hindi, Spanish, French, German, Japanese, Simplified Chinese, Arabic.
// Brand names, synthetic card fields, CSV headers and downloaded data keep their original form.
export const CARD_TOOL_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Card numbers copied!": [
        "कार्ड नंबर कॉपी हुए!",
        "¡Números de tarjeta copiados!",
        "Numéros de carte copiés !",
        "Kartennummern kopiert!",
        "カード番号をコピーしました！",
        "卡号已复制！",
        "نُسخت أرقام البطاقات!"
    ],
    "Credit Card Validator & Generator": [
        "क्रेडिट कार्ड सत्यापक और जनरेटर",
        "Validador y generador de tarjetas",
        "Validation et génération de cartes",
        "Kreditkartenprüfung und -generator",
        "クレジットカード検証・生成",
        "信用卡校验与生成",
        "فاحص ومولّد بطاقات الائتمان"
    ],
    "Validate card numbers and generate test cards using Luhn algorithm": [
        "Luhn एल्गोरिथ्म से कार्ड नंबर जांचें और परीक्षण नंबर बनाएं",
        "Comprueba números y genera tarjetas de prueba con Luhn",
        "Vérifiez des numéros et générez des cartes de test avec Luhn",
        "Kartennummern mit Luhn prüfen und Testnummern erzeugen",
        "Luhnアルゴリズムで番号を検証しテスト番号を生成",
        "使用 Luhn 算法校验卡号并生成测试号码",
        "افحص الأرقام وولّد بطاقات اختبار بخوارزمية Luhn"
    ],
    "Check number length and the Luhn checksum, with a brand hint from the listed prefix patterns. Generate synthetic numbers for local form tests; no account lookup is performed.": [
        "नंबर की लंबाई और Luhn चेकसम जांचें; सूचीबद्ध प्रीफ़िक्स से ब्रांड का संकेत मिलता है। स्थानीय फ़ॉर्म परीक्षणों के लिए कृत्रिम नंबर बनाएं; खाते की खोज नहीं होती।",
        "Comprueba longitud y suma Luhn, con una pista de marca según los prefijos listados. Genera números sintéticos para pruebas locales; no consulta cuentas.",
        "Vérifiez longueur et somme Luhn, avec un indice de marque d’après les préfixes listés. Créez des numéros synthétiques pour tests locaux ; aucune recherche de compte.",
        "Länge und Luhn-Prüfsumme prüfen, mit Markenhinweis anhand gelisteter Präfixe. Synthetische Nummern für lokale Formulartests erzeugen; keine Kontenabfrage.",
        "桁数とLuhnチェックサムを検証し、掲載された接頭辞からブランドの手がかりを示します。ローカルのフォームテスト用番号を合成し、口座照会は行いません。",
        "检查位数和 Luhn 校验和，并根据列出的前缀提供品牌提示。生成用于本地表单测试的合成号码，不查询账户。",
        "افحص الطول ومجموع Luhn مع تلميح للعلامة من البادئات المدرجة. ولّد أرقامًا اصطناعية لاختبارات النماذج المحلية؛ لا يجري البحث عن حسابات."
    ],
    "Enter ASCII digits with spaces or hyphens to check format and checksum. Other characters are rejected. Switch to Generate, choose a brand and count, then copy the results.": [
        "फ़ॉर्मैट और चेकसम जांचने के लिए ASCII अंक, स्पेस या हाइफ़न भरें। दूसरे वर्ण अस्वीकार होते हैं। जनरेट मोड में ब्रांड और संख्या चुनकर परिणाम कॉपी करें।",
        "Introduce dígitos ASCII con espacios o guiones para comprobar formato y suma. Se rechazan otros caracteres. Cambia a Generar, elige marca y cantidad y copia.",
        "Saisissez des chiffres ASCII avec espaces ou tirets pour vérifier format et somme. Les autres caractères sont refusés. Passez à Générer, choisissez marque et nombre, puis copiez.",
        "ASCII-Ziffern mit Leerzeichen oder Bindestrichen eingeben. Andere Zeichen werden abgelehnt. Zum Erzeugen wechseln, Marke und Anzahl wählen und Ergebnisse kopieren.",
        "ASCII数字、空白、ハイフンで形式とチェックサムを確認します。他の文字は拒否します。生成モードでブランドと件数を選び、結果をコピーします。",
        "输入 ASCII 数字及空格或连字符以检查格式和校验和，其他字符会被拒绝。切换到生成模式，选择品牌与数量后复制结果。",
        "أدخل أرقام ASCII مع مسافات أو شرطات لفحص التنسيق والمجموع. تُرفض الأحرف الأخرى. انتقل للتوليد واختر العلامة والعدد ثم انسخ النتائج."
    ],
    "A valid checksum does not prove account existence, ownership or payment acceptance. Generated values may overlap allocated numbers; use your provider’s published sandbox fixtures for transaction tests.": [
        "सही चेकसम खाते का अस्तित्व, स्वामित्व या भुगतान स्वीकृति सिद्ध नहीं करता। बनाए नंबर आवंटित नंबरों से मेल खा सकते हैं; लेनदेन परीक्षण के लिए प्रदाता के प्रकाशित सैंडबॉक्स डेटा का उपयोग करें।",
        "Una suma válida no prueba existencia, titularidad ni aceptación de pagos. Los números generados pueden coincidir con números asignados; usa los datos sandbox publicados por tu proveedor para transacciones.",
        "Une somme valide ne prouve ni existence du compte, ni propriété, ni acceptation du paiement. Les numéros peuvent coïncider avec des numéros attribués ; utilisez les données sandbox du prestataire pour tester des transactions.",
        "Eine gültige Prüfsumme belegt weder Kontoexistenz noch Inhaberschaft oder Zahlungsannahme. Erzeugte Nummern können vergebenen Nummern entsprechen; für Transaktionstests veröffentlichte Sandbox-Daten des Anbieters verwenden.",
        "チェックサムが正しくても口座の存在、所有者、決済の承認は証明しません。生成番号が割当済み番号と一致する可能性があります。取引テストには決済事業者の公開サンドボックスデータを使ってください。",
        "校验和有效不代表账户存在、归属正确或付款会被接受。生成值可能与已分配号码重合；交易测试请使用支付服务商发布的沙箱数据。",
        "المجموع الصحيح لا يثبت وجود الحساب أو ملكيته أو قبول الدفع. قد تتطابق الأرقام المولّدة مع أرقام مخصصة؛ استخدم بيانات الاختبار المنشورة من مزوّدك لاختبارات المعاملات."
    ],
    "Validate Card": [
        "कार्ड जांचें",
        "Validar tarjeta",
        "Vérifier une carte",
        "Karte prüfen",
        "カードを検証",
        "校验卡号",
        "فحص البطاقة"
    ],
    "Generate Test Cards": [
        "परीक्षण कार्ड बनाएं",
        "Generar tarjetas de prueba",
        "Générer des cartes de test",
        "Testkarten erzeugen",
        "テストカードを生成",
        "生成测试卡号",
        "توليد بطاقات اختبار"
    ],
    "Card Number": [
        "कार्ड नंबर",
        "Número de tarjeta",
        "Numéro de carte",
        "Kartennummer",
        "カード番号",
        "卡号",
        "رقم البطاقة"
    ],
    "Enter credit card number...": [
        "क्रेडिट कार्ड नंबर भरें…",
        "Introduce el número de tarjeta…",
        "Saisissez le numéro de carte…",
        "Kreditkartennummer eingeben…",
        "カード番号を入力…",
        "输入信用卡号…",
        "أدخل رقم البطاقة…"
    ],
    "Card number": [
        "कार्ड नंबर",
        "Número de tarjeta",
        "Numéro de carte",
        "Kartennummer",
        "カード番号",
        "卡号",
        "رقم البطاقة"
    ],
    "Checksum and length pass": [
        "चेकसम और लंबाई सही हैं",
        "Suma y longitud correctas",
        "Somme et longueur correctes",
        "Prüfsumme und Länge stimmen",
        "チェックサムと桁数は適合",
        "校验和与位数通过",
        "المجموع والطول صحيحان"
    ],
    "Checksum or format failed": [
        "चेकसम या फ़ॉर्मैट गलत है",
        "Suma o formato incorrectos",
        "Somme ou format incorrect",
        "Prüfsumme oder Format fehlerhaft",
        "チェックサムまたは形式が不適合",
        "校验和或格式错误",
        "فشل المجموع أو التنسيق"
    ],
    "Formatted:": [
        "फ़ॉर्मैट:",
        "Formato:",
        "Format :",
        "Formatiert:",
        "整形：",
        "格式化：",
        "منسّق:"
    ],
    "Luhn Check:": [
        "Luhn जांच:",
        "Comprobación Luhn:",
        "Vérification Luhn :",
        "Luhn-Prüfung:",
        "Luhn検証：",
        "Luhn 校验：",
        "فحص Luhn:"
    ],
    "Length: {count} digits": [
        "लंबाई: {count} अंक",
        "Longitud: {count} dígitos",
        "Longueur : {count} chiffres",
        "Länge: {count} Ziffern",
        "桁数：{count}",
        "长度：{count} 位",
        "الطول: {count} أرقام"
    ],
    "Supported Card Types": [
        "समर्थित कार्ड प्रकार",
        "Tipos de tarjeta admitidos",
        "Types de cartes pris en charge",
        "Unterstützte Kartentypen",
        "対応カードの種類",
        "支持的卡类型",
        "أنواع البطاقات المدعومة"
    ],
    "Card Type": [
        "कार्ड प्रकार",
        "Tipo de tarjeta",
        "Type de carte",
        "Kartentyp",
        "カードの種類",
        "卡类型",
        "نوع البطاقة"
    ],
    "Generated {brand} Cards": [
        "बनाए गए {brand} कार्ड",
        "Tarjetas {brand} generadas",
        "Cartes {brand} générées",
        "Erzeugte {brand}-Karten",
        "生成済み{brand}カード",
        "已生成的 {brand} 卡号",
        "بطاقات {brand} المولّدة"
    ],
    "Test Cards Only": [
        "केवल परीक्षण डेटा",
        "Solo datos de prueba",
        "Données de test uniquement",
        "Nur Testdaten",
        "テストデータ専用",
        "仅测试数据",
        "بيانات اختبار فقط"
    ],
    "These random values pass a checksum only. No account lookup is performed. Use them for local form tests, and use your provider’s published sandbox fixtures for payment responses.": [
        "ये यादृच्छिक मान केवल चेकसम पास करते हैं। खाते की खोज नहीं होती। स्थानीय फ़ॉर्म में प्रयोग करें; भुगतान परिणाम जांचने के लिए प्रदाता के प्रकाशित सैंडबॉक्स डेटा लें।",
        "Estos valores aleatorios solo pasan una suma de control. No se consultan cuentas. Úsalos en formularios locales y usa los datos sandbox del proveedor para respuestas de pago.",
        "Ces valeurs aléatoires passent uniquement une somme de contrôle, sans recherche de compte. Utilisez-les pour les formulaires locaux et les données sandbox du prestataire pour les réponses de paiement.",
        "Diese Zufallswerte bestehen nur die Prüfsumme. Keine Kontenabfrage. Für lokale Formulartests verwenden; Zahlungsantworten mit veröffentlichten Sandbox-Daten des Anbieters testen.",
        "これらのランダム値はチェックサムのみを満たし、口座照会は行いません。ローカルのフォーム用に使い、決済応答には事業者の公開サンドボックスデータを使ってください。",
        "这些随机值仅通过校验和，不查询账户。用于本地表单测试；付款结果测试请使用服务商发布的沙箱数据。",
        "تجتاز هذه القيم العشوائية المجموع فقط دون البحث عن حسابات. استخدمها للنماذج المحلية وبيانات مزوّدك المنشورة لاختبار استجابات الدفع."
    ],
    "About Luhn Algorithm": [
        "Luhn एल्गोरिथ्म के बारे में",
        "Sobre el algoritmo Luhn",
        "À propos de l’algorithme Luhn",
        "Über den Luhn-Algorithmus",
        "Luhnアルゴリズムについて",
        "关于 Luhn 算法",
        "حول خوارزمية Luhn"
    ],
    "The Luhn algorithm (also known as the \"modulus 10\" algorithm) is a simple checksum formula used to validate credit card numbers, IMEI numbers, and other identification numbers.": [
        "Luhn या \"मापांक 10\" एल्गोरिथ्म एक सरल चेकसम विधि है जो कार्ड नंबर, IMEI और अन्य पहचान नंबरों को जांचती है।",
        "Luhn, también llamado módulo 10, es una fórmula sencilla de suma de control para números de tarjeta, IMEI y otros identificadores.",
        "L’algorithme Luhn, aussi appelé modulo 10, est une formule simple de somme de contrôle pour les cartes, IMEI et autres identifiants.",
        "Der Luhn- oder Modulo-10-Algorithmus ist eine einfache Prüfsummenformel für Kartennummern, IMEI und andere Kennnummern.",
        "Luhn（modulus 10）アルゴリズムは、カード番号、IMEI、その他の識別番号を検証する簡単なチェックサム式です。",
        "Luhn（也称模 10）算法是一种简单的校验和公式，用于校验卡号、IMEI 和其他标识号码。",
        "خوارزمية Luhn، المعروفة أيضًا بمعامل 10، صيغة مجموع تحقق بسيطة لأرقام البطاقات وIMEI وغيرها من أرقام التعريف."
    ],
    "It can detect any single-digit error and most transpositions of adjacent digits.": [
        "यह हर एक-अंकीय गलती और अधिकांश पास के दो अंकों की अदला-बदली पहचान सकता है।",
        "Detecta cualquier error de un dígito y la mayoría de intercambios entre dígitos adyacentes.",
        "Elle détecte toute erreur d’un chiffre et la plupart des inversions de chiffres voisins.",
        "Er erkennt jeden einzelnen Ziffernfehler und die meisten Vertauschungen benachbarter Ziffern.",
        "1桁の誤りと、隣接する数字の入れ替えの多くを検出します。",
        "可检测任何单个数字错误和大多数相邻数字交换。",
        "يمكنها كشف أي خطأ في رقم واحد ومعظم عمليات تبديل رقمين متجاورين."
    ],
    "Copy card number": [
        "कार्ड नंबर कॉपी करें",
        "Copiar número de tarjeta",
        "Copier le numéro de carte",
        "Kartennummer kopieren",
        "カード番号をコピー",
        "复制卡号",
        "نسخ رقم البطاقة"
    ],
    "Card holder": [
        "कार्डधारक",
        "Titular",
        "Titulaire",
        "Karteninhaber",
        "名義人",
        "持卡人",
        "حامل البطاقة"
    ],
    "Expires": [
        "समाप्ति",
        "Vencimiento",
        "Expiration",
        "Gültig bis",
        "有効期限",
        "到期时间",
        "انتهاء الصلاحية"
    ],
    "CVV": [
        "CVV",
        "CVV",
        "CVV",
        "CVV",
        "CVV",
        "CVV",
        "CVV"
    ],
    "{label} copied": [
        "{label} कॉपी हुआ",
        "{label} copiado",
        "{label} copié",
        "{label} kopiert",
        "{label}をコピーしました",
        "已复制{label}",
        "نُسخ {label}"
    ],
    "{count} cards ({format}) copied": [
        "{count} कार्ड ({format}) कॉपी हुए",
        "{count} tarjetas ({format}) copiadas",
        "{count} cartes ({format}) copiées",
        "{count} Karten ({format}) kopiert",
        "{count}件のカード（{format}）をコピーしました",
        "已复制 {count} 张卡（{format}）",
        "نُسخت {count} بطاقات ({format})"
    ],
    "Plain": [
        "सादा पाठ",
        "Texto sin formato",
        "Texte brut",
        "Klartext",
        "プレーンテキスト",
        "纯文本",
        "نص عادي"
    ],
    "Generate synthetic Luhn-valid card fixtures with security codes and expiry dates": [
        "सुरक्षा कोड और समाप्ति तारीख वाले कृत्रिम Luhn-सही कार्ड डेटा बनाएं",
        "Genera datos sintéticos con Luhn válido, códigos de seguridad y caducidad",
        "Générez des cartes synthétiques valides selon Luhn avec codes de sécurité et expiration",
        "Synthetische Luhn-gültige Kartendaten mit Sicherheitscodes und Ablaufdaten erzeugen",
        "セキュリティコードと有効期限付きのLuhn適合テストデータを生成",
        "生成符合 Luhn 校验的合成卡数据，附安全码和有效期",
        "ولّد بيانات بطاقات اصطناعية تجتاز Luhn مع رموز أمان وتواريخ انتهاء"
    ],
    "Generate synthetic format fixtures from the listed prefix and length patterns, with a Luhn check digit, synthetic security code, future expiry and placeholder holder. Brand patterns are hints, not issuer lookups.": [
        "सूचीबद्ध प्रीफ़िक्स और लंबाई से कृत्रिम डेटा बनाएं: Luhn जांच अंक, नकली सुरक्षा कोड, भविष्य की समाप्ति और नमूना धारक। ब्रांड पैटर्न संकेत हैं, जारीकर्ता की खोज नहीं।",
        "Genera datos sintéticos con los prefijos y longitudes listados: dígito Luhn, código de seguridad sintético, caducidad futura y titular de ejemplo. Los patrones son pistas, no consultas al emisor.",
        "Générez des données synthétiques selon les préfixes et longueurs listés : chiffre Luhn, code fictif, expiration future et titulaire exemple. Les motifs sont des indices, pas une recherche d’émetteur.",
        "Synthetische Daten anhand gelisteter Präfixe und Längen: Luhn-Ziffer, synthetischer Sicherheitscode, künftiges Ablaufdatum und Beispielinhaber. Markenmuster sind Hinweise, keine Ausstellerabfrage.",
        "掲載された接頭辞と桁数から、Luhn検査桁、合成セキュリティコード、将来の有効期限、仮の名義人を持つデータを生成します。ブランドパターンは手がかりであり発行元照会ではありません。",
        "根据列出的前缀和长度生成合成数据，含 Luhn 校验位、合成安全码、未来有效期和示例持卡人。品牌模式仅供提示，不查询发卡机构。",
        "ولّد بيانات اصطناعية من البادئات والأطوال المدرجة مع رقم تحقق Luhn ورمز أمان اصطناعي وتاريخ مستقبلي وحامل افتراضي. الأنماط تلميحات وليست بحثًا عن جهة الإصدار."
    ],
    "Choose a brand, an optional supported length and a count. Generate, copy a single value or export the batch as plain text, CSV or JSON. Changing settings does not change an existing batch until you generate again.": [
        "ब्रांड, वैकल्पिक समर्थित लंबाई और संख्या चुनें। जनरेट करें, एक मान कॉपी करें या बैच को पाठ, CSV या JSON में निर्यात करें। फिर जनरेट करने तक सेटिंग बदलने से पुराना बैच नहीं बदलता।",
        "Elige marca, longitud admitida opcional y cantidad. Genera, copia un valor o exporta como texto, CSV o JSON. Cambiar ajustes no modifica el lote hasta generar de nuevo.",
        "Choisissez marque, longueur facultative et nombre. Générez, copiez une valeur ou exportez en texte, CSV ou JSON. Les réglages ne modifient pas le lot existant sans nouvelle génération.",
        "Marke, optionale unterstützte Länge und Anzahl wählen. Erzeugen, Einzelwert kopieren oder als Text, CSV oder JSON exportieren. Einstellungen ändern bestehende Stapel erst beim erneuten Erzeugen.",
        "ブランド、任意の対応桁数、件数を選びます。生成後、個別の値をコピーするか、テキスト・CSV・JSONで出力します。設定を変えても再生成するまで既存データは変わりません。",
        "选择品牌、可选的支持位数和数量。生成后可复制单个值，或以纯文本、CSV、JSON 导出整批。更改设置不会改变现有批次，直到再次生成。",
        "اختر العلامة وطولًا مدعومًا اختياريًا والعدد. ولّد وانسخ قيمة أو صدّر الدفعة كنص أو CSV أو JSON. تغيير الإعدادات لا يغيّر الدفعة الحالية حتى تولّد مجددًا."
    ],
    "No account lookup or transaction is performed. Account allocation and payment responses are unknown; use provider-published sandbox fixtures for transaction tests. Everything is generated locally.": [
        "खाते की खोज या लेनदेन नहीं होता। खाता आवंटन और भुगतान परिणाम अज्ञात हैं; लेनदेन परीक्षण में प्रदाता के प्रकाशित सैंडबॉक्स डेटा लें। सब कुछ स्थानीय रूप से बनता है।",
        "No se consultan cuentas ni se realizan transacciones. Se desconocen asignación y respuestas de pago; usa datos sandbox publicados por el proveedor. Todo se genera localmente.",
        "Aucune recherche de compte ni transaction. Attribution et réponses de paiement inconnues ; utilisez le sandbox publié par le prestataire. Tout est généré localement.",
        "Keine Kontenabfrage oder Transaktion. Kontozuteilung und Zahlungsantworten sind unbekannt; veröffentlichte Sandbox-Daten des Anbieters nutzen. Alles wird lokal erzeugt.",
        "口座照会や取引は行いません。口座への割当や決済応答は不明です。取引テストには事業者の公開サンドボックスデータを使ってください。すべてローカルで生成します。",
        "不查询账户或执行交易。账户分配和付款结果未知；交易测试请使用服务商发布的沙箱数据。所有数据均在本地生成。",
        "لا يجري بحث عن حسابات أو تنفيذ معاملات. تخصيص الحسابات واستجابات الدفع غير معروفة؛ استخدم بيانات الاختبار المنشورة من المزوّد. يجري التوليد محليًا."
    ],
    "American Express uses a 4-digit security code and 15-digit number displayed in 4-6-5 groups. Other listed brands use 3-digit security codes. Exported field names and generated data are not translated.": [
        "American Express में 4-अंकीय सुरक्षा कोड और 15-अंकीय नंबर 4-6-5 समूहों में दिखता है। अन्य सूचीबद्ध ब्रांडों में 3-अंकीय कोड हैं। निर्यात के फ़ील्ड नाम और डेटा का अनुवाद नहीं होता।",
        "American Express usa código de 4 dígitos y número de 15 agrupado en 4-6-5. Las demás marcas listadas usan códigos de 3 dígitos. Los campos y datos exportados no se traducen.",
        "American Express utilise un code de 4 chiffres et un numéro de 15 groupé en 4-6-5. Les autres marques listées ont un code de 3 chiffres. Les champs et données exportés ne sont pas traduits.",
        "American Express verwendet 4-stellige Codes und 15-stellige Nummern in 4-6-5-Gruppen. Andere gelistete Marken verwenden 3-stellige Codes. Exportierte Feldnamen und Daten werden nicht übersetzt.",
        "American Expressは4桁のコードと15桁の番号を使用し、番号を4-6-5に区切ります。他の掲載ブランドのコードは3桁です。出力データとフィールド名は翻訳しません。",
        "American Express 使用 4 位安全码和按 4-6-5 分组的 15 位卡号。其他列出品牌使用 3 位安全码。导出字段名和生成数据不会翻译。",
        "تستخدم American Express رمز أمان من 4 أرقام ورقم بطاقة من 15 رقمًا بمجموعات 4-6-5. تستخدم العلامات الأخرى المدرجة رموزًا من 3 أرقام. لا تُترجم أسماء الحقول أو البيانات المصدرة."
    ],
    "Test data only": [
        "केवल परीक्षण डेटा",
        "Solo datos de prueba",
        "Données de test uniquement",
        "Nur Testdaten",
        "テストデータ専用",
        "仅测试数据",
        "بيانات اختبار فقط"
    ],
    "Synthetic format fixtures only. No account lookup is performed, and payment outcomes are unknown. Use your provider’s published sandbox fixtures for transaction tests.": [
        "केवल कृत्रिम फ़ॉर्मैट डेटा। खाते की खोज नहीं होती और भुगतान परिणाम अज्ञात हैं। लेनदेन परीक्षण के लिए अपने प्रदाता के प्रकाशित सैंडबॉक्स डेटा लें।",
        "Solo datos sintéticos de formato. No se consultan cuentas y se desconocen los pagos. Usa los datos sandbox de tu proveedor para probar transacciones.",
        "Données synthétiques de format uniquement. Aucune recherche de compte, paiements inconnus. Utilisez les données sandbox du prestataire pour les transactions.",
        "Nur synthetische Formatdaten. Keine Kontenabfrage und unbekannte Zahlungsergebnisse. Für Transaktionstests Sandbox-Daten des Anbieters verwenden.",
        "形式確認用の合成データです。口座照会はせず決済結果は不明です。取引テストには事業者の公開サンドボックスデータを使ってください。",
        "仅为合成格式数据，不查询账户，付款结果未知。交易测试请使用服务商发布的沙箱数据。",
        "بيانات تنسيق اصطناعية فقط. لا يجري بحث عن الحسابات ونتائج الدفع غير معروفة. استخدم بيانات مزوّدك المنشورة لاختبارات المعاملات."
    ],
    "Card brand": [
        "कार्ड ब्रांड",
        "Marca de tarjeta",
        "Marque de carte",
        "Kartenmarke",
        "カードブランド",
        "卡品牌",
        "علامة البطاقة"
    ],
    "Number length": [
        "नंबर की लंबाई",
        "Longitud del número",
        "Longueur du numéro",
        "Nummernlänge",
        "番号の桁数",
        "号码位数",
        "طول الرقم"
    ],
    "Any": [
        "कोई भी",
        "Cualquiera",
        "Au choix",
        "Beliebig",
        "任意",
        "任意",
        "أي طول"
    ],
    "{count} digits": [
        "{count} अंक",
        "{count} dígitos",
        "{count} chiffres",
        "{count} Ziffern",
        "{count}桁",
        "{count} 位",
        "{count} أرقام"
    ],
    "How many": [
        "कितने",
        "Cantidad",
        "Combien",
        "Anzahl",
        "件数",
        "数量",
        "العدد"
    ],
    "Export format": [
        "निर्यात फ़ॉर्मैट",
        "Formato de exportación",
        "Format d’export",
        "Exportformat",
        "出力形式",
        "导出格式",
        "تنسيق التصدير"
    ],
    "CSV": [
        "CSV",
        "CSV",
        "CSV",
        "CSV",
        "CSV",
        "CSV",
        "CSV"
    ],
    "JSON": [
        "JSON",
        "JSON",
        "JSON",
        "JSON",
        "JSON",
        "JSON",
        "JSON"
    ],
    "Security code: {count} digits": [
        "सुरक्षा कोड: {count} अंक",
        "Código de seguridad: {count} dígitos",
        "Code de sécurité : {count} chiffres",
        "Sicherheitscode: {count} Ziffern",
        "セキュリティコード：{count}桁",
        "安全码：{count} 位",
        "رمز الأمان: {count} أرقام"
    ],
    "Lengths: {lengths}": [
        "लंबाइयाँ: {lengths}",
        "Longitudes: {lengths}",
        "Longueurs : {lengths}",
        "Längen: {lengths}",
        "桁数：{lengths}",
        "位数：{lengths}",
        "الأطوال: {lengths}"
    ],
    "Supported brands": [
        "समर्थित ब्रांड",
        "Marcas admitidas",
        "Marques prises en charge",
        "Unterstützte Marken",
        "対応ブランド",
        "支持的品牌",
        "العلامات المدعومة"
    ],
    "digits": [
        "अंक",
        "dígitos",
        "chiffres",
        "Ziffern",
        "桁",
        "位",
        "أرقام"
    ],
    "Pass": [
        "सफल",
        "Aprobado",
        "Réussi",
        "Bestanden",
        "適合",
        "通过",
        "ناجح"
    ],
    "Fail": [
        "असफल",
        "No aprobado",
        "Échec",
        "Nicht bestanden",
        "不適合",
        "未通过",
        "غير ناجح"
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
    "Prefix": [
        "उपसर्ग",
        "Prefijo",
        "Préfixe",
        "Präfix",
        "接頭辞",
        "前缀",
        "البادئة"
    ],
    "Length": [
        "लंबाई",
        "Longitud",
        "Longueur",
        "Länge",
        "長さ",
        "长度",
        "الطول"
    ],
    "Count": [
        "संख्या",
        "Cantidad",
        "Nombre",
        "Anzahl",
        "件数",
        "数量",
        "العدد"
    ],
    "Generate": [
        "बनाएँ",
        "Generar",
        "Générer",
        "Erzeugen",
        "生成",
        "生成",
        "إنشاء"
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
    "Copy": [
        "कॉपी करें",
        "Copiar",
        "Copier",
        "Kopieren",
        "コピー",
        "复制",
        "نسخ"
    ],
    "Credit Card Generator": [
        "क्रेडिट कार्ड जनरेटर",
        "Generador de tarjetas de crédito",
        "Générateur de cartes bancaires",
        "Kreditkartengenerator",
        "クレジットカード生成",
        "信用卡生成器",
        "مولد بطاقات الائتمان"
    ],
    "Copy all": [
        "सभी कॉपी करें",
        "Copiar todo",
        "Tout copier",
        "Alle kopieren",
        "すべてコピー",
        "全部复制",
        "نسخ الكل"
    ],
    "Download": [
        "डाउनलोड करें",
        "Descargar",
        "Télécharger",
        "Herunterladen",
        "ダウンロード",
        "下载",
        "تنزيل"
    ],
    "Number": [
        "संख्या",
        "Número",
        "Nombre",
        "Zahl",
        "数値",
        "数字",
        "عدد"
    ]
};
