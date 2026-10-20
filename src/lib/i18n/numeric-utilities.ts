import type { TranslationColumns } from "./tool-names";

// Authored copy only. Integers, secrets, timestamps, permission bits and commands stay exact.
export const NUMERIC_UTILITY_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Number Base Converter": [
        "संख्या आधार परिवर्तक",
        "Conversor de bases numéricas",
        "Convertisseur de bases numériques",
        "Zahlenbasis-Konverter",
        "基数変換",
        "数字进制转换器",
        "محول أنظمة العد"
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
    "Password Generator": [
        "पासवर्ड जनरेटर",
        "Generador de contraseñas",
        "Générateur de mots de passe",
        "Passwortgenerator",
        "パスワード生成",
        "密码生成器",
        "مولد كلمات المرور"
    ],
    "Clear": [
        "साफ़ करें",
        "Borrar",
        "Effacer",
        "Leeren",
        "クリア",
        "清空",
        "مسح"
    ],
    "Timestamp Converter": [
        "टाइमस्टैम्प परिवर्तक",
        "Conversor de marcas de tiempo",
        "Convertisseur d’horodatages",
        "Zeitstempel-Konverter",
        "タイムスタンプ変換",
        "时间戳转换器",
        "محول الطوابع الزمنية"
    ],
    "Unix Permissions Calculator": [
        "Unix अनुमति कैलकुलेटर",
        "Calculadora de permisos Unix",
        "Calculateur de permissions Unix",
        "Unix-Berechtigungsrechner",
        "Unixパーミッション計算",
        "Unix 权限计算器",
        "حاسبة أذونات Unix"
    ],
    "Convert exact integers between any bases from 2 through 36": [
        "2 से 36 तक किसी भी आधार में सटीक पूर्णांक बदलें",
        "Convierte enteros exactos entre bases de 2 a 36",
        "Convertissez des entiers exacts entre les bases 2 à 36",
        "Ganze Zahlen exakt zwischen den Basen 2 bis 36 umrechnen",
        "2〜36の任意の基数で整数を正確に変換",
        "在 2 至 36 的任意进制间精确转换整数",
        "حوّل الأعداد الصحيحة بدقة بين الأسس من 2 إلى 36"
    ],
    "Convert integer representations without losing precision through JavaScript Number. Digits above 9 use a–z. Fractions are not supported.": [
        "JavaScript Number से परिशुद्धता खोए बिना पूर्णांक का निरूपण बदलें। 9 से बड़े अंक a–z हैं। भिन्न समर्थित नहीं हैं।",
        "Convierte representaciones enteras sin perder precisión con JavaScript Number. Los dígitos superiores a 9 usan a–z. No se admiten fracciones.",
        "Convertissez les représentations entières sans perte de précision liée à JavaScript Number. Au-delà de 9, les chiffres utilisent a–z. Les fractions ne sont pas prises en charge.",
        "Ganzzahldarstellungen ohne Präzisionsverlust durch JavaScript Number umrechnen. Ziffern über 9 verwenden a–z. Brüche werden nicht unterstützt.",
        "JavaScript Numberによる精度の損失なく整数表現を変換します。9より大きい数字にはa–zを使います。小数や分数には対応していません。",
        "转换整数表示时不会因 JavaScript Number 而丢失精度。大于 9 的数位使用 a–z。不支持分数。",
        "حوّل تمثيلات الأعداد الصحيحة دون فقدان الدقة بسبب JavaScript Number. تستخدم الخانات الأكبر من 9 الحروف a–z. الكسور غير مدعومة."
    ],
    "Choose the source and destination bases.": [
        "स्रोत और गंतव्य आधार चुनें।",
        "Elige las bases de origen y destino.",
        "Choisissez les bases source et cible.",
        "Quell- und Zielbasis wählen.",
        "変換元と変換先の基数を選びます。",
        "选择源进制和目标进制。",
        "اختر أساس المصدر والوجهة."
    ],
    "Enter an integer, optionally signed. Auto detects 0x, 0b and 0o prefixes; other inputs use decimal.": [
        "पूर्णांक दर्ज करें; चिह्न वैकल्पिक है। स्वतः मोड 0x, 0b और 0o उपसर्ग पहचानता है; बाकी इनपुट दशमलव हैं।",
        "Introduce un entero, con signo opcional. El modo automático detecta los prefijos 0x, 0b y 0o; los demás valores usan decimal.",
        "Saisissez un entier, éventuellement signé. Le mode automatique détecte les préfixes 0x, 0b et 0o ; les autres valeurs sont décimales.",
        "Eine ganze Zahl mit optionalem Vorzeichen eingeben. Automatik erkennt 0x, 0b und 0o; andere Eingaben sind dezimal.",
        "符号付きまたは符号なしの整数を入力します。自動モードは0x、0b、0o接頭辞を検出し、それ以外は10進数として扱います。",
        "输入整数，可带符号。自动模式识别 0x、0b 和 0o 前缀，其他输入按十进制处理。",
        "أدخل عددًا صحيحًا مع إشارة اختيارية. يكتشف الوضع التلقائي البادئات 0x و0b و0o، ويعامل بقية المدخلات كعشرية."
    ],
    "Copy the result or the common binary, octal, decimal and hexadecimal representations.": [
        "परिणाम या सामान्य द्विआधारी, अष्टाधारी, दशमलव और षोडशाधारी निरूपण कॉपी करें।",
        "Copia el resultado o las representaciones habituales en binario, octal, decimal y hexadecimal.",
        "Copiez le résultat ou les représentations courantes en binaire, octal, décimal et hexadécimal.",
        "Ergebnis oder die üblichen binären, oktalen, dezimalen und hexadezimalen Darstellungen kopieren.",
        "結果、または2進・8進・10進・16進の一般的な表現をコピーします。",
        "复制结果或常用的二进制、八进制、十进制及十六进制表示。",
        "انسخ النتيجة أو التمثيلات الشائعة الثنائية والثمانية والعشرية والسداسية عشرية."
    ],
    "Inputs are limited to 4096 characters.": [
        "इनपुट की सीमा 4096 अक्षर है।",
        "Las entradas se limitan a 4096 caracteres.",
        "Les entrées sont limitées à 4096 caractères.",
        "Eingaben sind auf 4096 Zeichen begrenzt.",
        "入力は4096文字までです。",
        "输入最多为 4096 个字符。",
        "المدخلات محدودة بـ4096 محرفًا."
    ],
    "Prefixes are consumed only in Auto mode or when they match the chosen source base.": [
        "उपसर्ग केवल स्वतः मोड में या चुने गए स्रोत आधार से मेल खाने पर हटते हैं।",
        "Los prefijos solo se consumen en modo automático o si coinciden con la base de origen elegida.",
        "Les préfixes ne sont retirés qu’en mode automatique ou s’ils correspondent à la base source choisie.",
        "Präfixe werden nur im Automatikmodus oder bei passender Quellbasis entfernt.",
        "接頭辞は自動モード、または選択した変換元の基数と一致する場合にのみ読み取られます。",
        "仅在自动模式或与所选源进制匹配时移除前缀。",
        "تُستهلك البادئات فقط في الوضع التلقائي أو عندما تطابق أساس المصدر المختار."
    ],
    "The conversion validates every digit instead of accepting a partial number.": [
        "रूपांतरण आंशिक संख्या स्वीकार करने के बजाय हर अंक जाँचता है।",
        "La conversión valida cada dígito en vez de aceptar un número parcial.",
        "La conversion vérifie chaque chiffre au lieu d’accepter un nombre partiel.",
        "Die Umrechnung prüft jede Ziffer, statt eine unvollständige Zahl zu akzeptieren.",
        "数値の一部だけを受け入れず、すべての桁を検証します。",
        "转换会验证每个数位，而不是接受部分数字。",
        "يتحقق التحويل من كل خانة بدلًا من قبول جزء من العدد."
    ],
    "Source base": [
        "स्रोत आधार",
        "Base de origen",
        "Base source",
        "Quellbasis",
        "変換元の基数",
        "源进制",
        "أساس المصدر"
    ],
    "Auto detect prefix": [
        "उपसर्ग स्वतः पहचानें",
        "Detectar prefijo automáticamente",
        "Détecter le préfixe automatiquement",
        "Präfix automatisch erkennen",
        "接頭辞を自動検出",
        "自动识别前缀",
        "اكتشاف البادئة تلقائيًا"
    ],
    "Destination base": [
        "गंतव्य आधार",
        "Base de destino",
        "Base cible",
        "Zielbasis",
        "変換先の基数",
        "目标进制",
        "أساس الوجهة"
    ],
    "Integer to convert": [
        "बदलने वाला पूर्णांक",
        "Entero a convertir",
        "Entier à convertir",
        "Umzurechnende ganze Zahl",
        "変換する整数",
        "待转换整数",
        "العدد الصحيح المراد تحويله"
    ],
    "Base": [
        "आधार",
        "Base",
        "Base",
        "Basis",
        "基数",
        "进制",
        "الأساس"
    ],
    "Base {base} result": [
        "आधार {base} का परिणाम",
        "Resultado en base {base}",
        "Résultat en base {base}",
        "Ergebnis zur Basis {base}",
        "基数{base}の結果",
        "{base} 进制结果",
        "النتيجة بالأساس {base}"
    ],
    "Copy result": [
        "परिणाम कॉपी करें",
        "Copiar resultado",
        "Copier le résultat",
        "Ergebnis kopieren",
        "結果をコピー",
        "复制结果",
        "نسخ النتيجة"
    ],
    "Copy common bases": [
        "सामान्य आधार कॉपी करें",
        "Copiar bases habituales",
        "Copier les bases courantes",
        "Übliche Basen kopieren",
        "一般的な基数をコピー",
        "复制常用进制",
        "نسخ الأسس الشائعة"
    ],
    "Swap conversion direction": [
        "रूपांतरण की दिशा बदलें",
        "Invertir la conversión",
        "Inverser la conversion",
        "Umrechnungsrichtung tauschen",
        "変換方向を入れ替え",
        "交换转换方向",
        "عكس اتجاه التحويل"
    ],
    "Representation": [
        "निरूपण",
        "Representación",
        "Représentation",
        "Darstellung",
        "表現",
        "表示",
        "التمثيل"
    ],
    "Copy base {base}": [
        "आधार {base} कॉपी करें",
        "Copiar base {base}",
        "Copier la base {base}",
        "Basis {base} kopieren",
        "基数{base}をコピー",
        "复制 {base} 进制",
        "نسخ الأساس {base}"
    ],
    "Choose integer bases from 2 through 36.": [
        "2 से 36 तक पूर्णांक आधार चुनें।",
        "Elige bases enteras de 2 a 36.",
        "Choisissez des bases entières de 2 à 36.",
        "Ganzzahlige Basen von 2 bis 36 wählen.",
        "2〜36の整数の基数を選んでください。",
        "请选择 2 至 36 的整数进制。",
        "اختر أسسًا صحيحة من 2 إلى 36."
    ],
    "Enter an integer of up to 4096 characters.": [
        "4096 अक्षरों तक का पूर्णांक दर्ज करें।",
        "Introduce un entero de hasta 4096 caracteres.",
        "Saisissez un entier de 4096 caractères maximum.",
        "Eine ganze Zahl mit höchstens 4096 Zeichen eingeben.",
        "4096文字以内の整数を入力してください。",
        "请输入不超过 4096 个字符的整数。",
        "أدخل عددًا صحيحًا لا يتجاوز 4096 محرفًا."
    ],
    "Enter digits after the sign or prefix.": [
        "चिह्न या उपसर्ग के बाद अंक दर्ज करें।",
        "Introduce dígitos después del signo o prefijo.",
        "Saisissez des chiffres après le signe ou le préfixe.",
        "Ziffern nach dem Vorzeichen oder Präfix eingeben.",
        "符号または接頭辞の後に数字を入力してください。",
        "请在符号或前缀后输入数位。",
        "أدخل خانات بعد الإشارة أو البادئة."
    ],
    "“{digit}” is not a digit in base {base}.": [
        "“{digit}” आधार {base} का अंक नहीं है।",
        "«{digit}» no es un dígito en base {base}.",
        "« {digit} » n’est pas un chiffre en base {base}.",
        "„{digit}“ ist keine Ziffer zur Basis {base}.",
        "「{digit}」は基数{base}の数字ではありません。",
        "“{digit}”不是 {base} 进制中的有效数位。",
        "«{digit}» ليست خانة صالحة في الأساس {base}."
    ],
    "Enter a whole-number timestamp within the supported date range.": ["समर्थित तारीख सीमा में पूर्णांक टाइमस्टैम्प दर्ज करें।", "Introduce una marca de tiempo entera dentro del intervalo de fechas admitido.", "Saisissez un horodatage entier dans la plage de dates prise en charge.", "Einen ganzzahligen Zeitstempel im unterstützten Datumsbereich eingeben.", "対応する日時範囲内の整数のタイムスタンプを入力してください。", "请输入受支持日期范围内的整数时间戳。", "أدخل طابعًا زمنيًا صحيحًا ضمن نطاق التواريخ المدعوم."],
    "Conversion diagnostic": [
        "रूपांतरण निदान",
        "Diagnóstico de conversión",
        "Diagnostic de conversion",
        "Umrechnungsdiagnose",
        "変換の診断情報",
        "转换诊断",
        "تفاصيل تشخيص التحويل"
    ],
    "Generate secure random passwords": [
        "सुरक्षित यादृच्छिक पासवर्ड बनाएँ",
        "Genera contraseñas aleatorias seguras",
        "Générez des mots de passe aléatoires sûrs",
        "Sichere zufällige Passwörter erzeugen",
        "安全なランダムパスワードを生成",
        "生成安全的随机密码",
        "أنشئ كلمات مرور عشوائية آمنة"
    ],
    "A cryptographically secure password generator creates random passwords using strong entropy sources. It ensures passwords are unpredictable and resistant to brute force attacks.": [
        "क्रिप्टोग्राफ़िक रूप से सुरक्षित जनरेटर मजबूत एंट्रॉपी स्रोतों से यादृच्छिक पासवर्ड बनाता है। इससे पासवर्ड का अनुमान लगाना और बलपूर्वक हमला करना कठिन होता है।",
        "Un generador criptográficamente seguro crea contraseñas aleatorias con fuentes de entropía sólidas, impredecibles y resistentes a ataques de fuerza bruta.",
        "Un générateur cryptographiquement sûr crée des mots de passe aléatoires à partir de sources d’entropie robustes, imprévisibles et résistants aux attaques par force brute.",
        "Ein kryptografisch sicherer Generator erstellt zufällige Passwörter aus starken Entropiequellen. Sie sind unvorhersehbar und widerstehen Brute-Force-Angriffen.",
        "暗号学的に安全な生成器は、強いエントロピー源からランダムなパスワードを作ります。予測や総当たり攻撃に強いパスワードを生成します。",
        "密码学安全的生成器使用强熵源创建随机密码，使密码难以预测并能抵御暴力破解。",
        "ينشئ المولّد الآمن تشفيريًا كلمات مرور عشوائية باستخدام مصادر إنتروبيا قوية، لتكون غير قابلة للتنبؤ ومقاومة لهجمات القوة الغاشمة."
    ],
    "Generate random passwords and API secrets with explicit length and character choices. Use an appropriate length, store them safely and avoid password reuse.": [
        "स्पष्ट लंबाई और अक्षर विकल्पों से यादृच्छिक पासवर्ड और API रहस्य बनाएँ। उचित लंबाई चुनें, सुरक्षित रखें और पासवर्ड दोबारा न इस्तेमाल करें।",
        "Genera contraseñas y secretos de API aleatorios con longitud y caracteres explícitos. Usa una longitud adecuada, guárdalos con seguridad y evita reutilizarlos.",
        "Générez des mots de passe et secrets d’API aléatoires en choisissant longueur et caractères. Choisissez une longueur adaptée, stockez-les en sécurité et évitez leur réutilisation.",
        "Zufällige Passwörter und API-Geheimnisse mit gezielter Länge und Zeichenauswahl erzeugen. Angemessene Länge wählen, sicher speichern und Passwörter nicht wiederverwenden.",
        "長さと文字種を指定してランダムなパスワードやAPIシークレットを生成します。十分な長さを選び、安全に保管し、使い回しを避けてください。",
        "明确选择长度和字符类型，生成随机密码及 API 密钥。使用合适的长度、安全保存，并避免重复使用密码。",
        "أنشئ كلمات مرور وأسرار API عشوائية بطول ومحارف محددة. اختر طولًا مناسبًا واحفظها بأمان وتجنب إعادة استخدامها."
    ],
    "Set desired password length (longer = more secure)": [
        "पासवर्ड की लंबाई चुनें (लंबा = अधिक सुरक्षित)",
        "Elige la longitud (más largo = más seguro)",
        "Choisissez la longueur (plus long = plus sûr)",
        "Passwortlänge festlegen (länger = sicherer)",
        "長さを設定します（長いほど安全）",
        "设置密码长度（越长越安全）",
        "حدد طول كلمة المرور (الأطول أكثر أمانًا)"
    ],
    "Toggle character types: uppercase, lowercase, numbers, symbols": [
        "अक्षर प्रकार चुनें: बड़े, छोटे, अंक, प्रतीक",
        "Activa mayúsculas, minúsculas, números y símbolos",
        "Activez majuscules, minuscules, chiffres et symboles",
        "Großbuchstaben, Kleinbuchstaben, Zahlen und Symbole umschalten",
        "大文字、小文字、数字、記号を切り替えます",
        "切换大写、小写、数字和符号",
        "بدّل أنواع المحارف: أحرف كبيرة وصغيرة وأرقام ورموز"
    ],
    "Optionally exclude ambiguous characters (0, O, l, 1, etc.)": [
        "चाहें तो मिलते-जुलते अक्षर हटाएँ (0, O, l, 1 आदि)",
        "Opcionalmente excluye caracteres ambiguos (0, O, l, 1, etc.)",
        "Excluez éventuellement les caractères ambigus (0, O, l, 1, etc.)",
        "Bei Bedarf mehrdeutige Zeichen ausschließen (0, O, l, 1 usw.)",
        "必要に応じて紛らわしい文字（0、O、l、1など）を除外します",
        "可选择排除易混淆字符（0、O、l、1 等）",
        "استبعد المحارف المتشابهة اختياريًا (0 وO وl و1 وغيرها)"
    ],
    "Generate and copy your secure password": [
        "सुरक्षित पासवर्ड बनाएँ और कॉपी करें",
        "Genera y copia tu contraseña segura",
        "Générez et copiez votre mot de passe sûr",
        "Sicheres Passwort erzeugen und kopieren",
        "安全なパスワードを生成してコピーします",
        "生成并复制安全密码",
        "أنشئ كلمة المرور الآمنة وانسخها"
    ],
    "Use at least 16 characters for important accounts": [
        "महत्वपूर्ण खातों के लिए कम से कम 16 अक्षर रखें",
        "Usa al menos 16 caracteres para cuentas importantes",
        "Utilisez au moins 16 caractères pour les comptes importants",
        "Für wichtige Konten mindestens 16 Zeichen verwenden",
        "重要なアカウントには16文字以上を使います",
        "重要账户至少使用 16 个字符",
        "استخدم 16 محرفًا على الأقل للحسابات المهمة"
    ],
    "Include all character types for maximum entropy": [
        "अधिकतम एंट्रॉपी के लिए सभी अक्षर प्रकार रखें",
        "Incluye todos los tipos para maximizar la entropía",
        "Incluez tous les types pour maximiser l’entropie",
        "Alle Zeichentypen für maximale Entropie verwenden",
        "エントロピーを最大にするには全種類の文字を含めます",
        "包含所有字符类型以获得最大熵",
        "ضمّن جميع أنواع المحارف لأقصى إنتروبيا"
    ],
    "Use a password manager to store generated passwords": [
        "बनाए पासवर्ड पासवर्ड प्रबंधक में रखें",
        "Guarda las contraseñas en un gestor",
        "Stockez les mots de passe dans un gestionnaire",
        "Erzeugte Passwörter in einem Passwortmanager speichern",
        "生成したパスワードはパスワード管理ツールで保管します",
        "使用密码管理器保存生成的密码",
        "استخدم مدير كلمات مرور لحفظ الكلمات المُنشأة"
    ],
    "Never reuse passwords across different sites": [
        "अलग साइटों पर पासवर्ड दोबारा न इस्तेमाल करें",
        "Nunca reutilices contraseñas entre sitios",
        "Ne réutilisez jamais un mot de passe sur plusieurs sites",
        "Passwörter niemals auf mehreren Websites verwenden",
        "異なるサイトでパスワードを使い回さないでください",
        "切勿在不同网站重复使用密码",
        "لا تعِد استخدام كلمات المرور عبر مواقع مختلفة"
    ],
    "Creating strong passwords for online accounts": [
        "ऑनलाइन खातों के लिए मजबूत पासवर्ड बनाना",
        "Crear contraseñas fuertes para cuentas en línea",
        "Créer des mots de passe robustes pour les comptes en ligne",
        "Starke Passwörter für Onlinekonten erstellen",
        "オンラインアカウントの強力なパスワード作成",
        "为在线账户创建强密码",
        "إنشاء كلمات مرور قوية للحسابات عبر الإنترنت"
    ],
    "Generating API keys and secrets": [
        "API कुंजियाँ और रहस्य बनाना",
        "Generar claves y secretos de API",
        "Générer des clés et secrets d’API",
        "API-Schlüssel und Geheimnisse erzeugen",
        "APIキーやシークレットの生成",
        "生成 API 密钥和机密",
        "إنشاء مفاتيح وأسرار API"
    ],
    "Creating encryption passphrases": [
        "एन्क्रिप्शन पासफ़्रेज़ बनाना",
        "Crear frases de cifrado",
        "Créer des phrases secrètes de chiffrement",
        "Verschlüsselungspassphrasen erstellen",
        "暗号化用パスフレーズの作成",
        "创建加密口令",
        "إنشاء عبارات مرور للتشفير"
    ],
    "Setting up service account credentials": [
        "सेवा खाते के क्रेडेंशियल बनाना",
        "Configurar credenciales de cuentas de servicio",
        "Configurer les identifiants des comptes de service",
        "Zugangsdaten für Dienstkonten einrichten",
        "サービスアカウントの認証情報設定",
        "设置服务账户凭据",
        "إعداد بيانات اعتماد حسابات الخدمة"
    ],
    "Password Strength": [
        "पासवर्ड की मजबूती",
        "Fortaleza de la contraseña",
        "Robustesse du mot de passe",
        "Passwortstärke",
        "パスワードの強度",
        "密码强度",
        "قوة كلمة المرور"
    ],
    "Generate New": [
        "नया बनाएँ",
        "Generar nueva",
        "Générer un nouveau",
        "Neu erzeugen",
        "新しく生成",
        "重新生成",
        "إنشاء جديد"
    ],
    "Copy Password": [
        "पासवर्ड कॉपी करें",
        "Copiar contraseña",
        "Copier le mot de passe",
        "Passwort kopieren",
        "パスワードをコピー",
        "复制密码",
        "نسخ كلمة المرور"
    ],
    "Password Length": [
        "पासवर्ड की लंबाई",
        "Longitud de la contraseña",
        "Longueur du mot de passe",
        "Passwortlänge",
        "パスワードの長さ",
        "密码长度",
        "طول كلمة المرور"
    ],
    "Character Sets": [
        "अक्षर समूह",
        "Conjuntos de caracteres",
        "Jeux de caractères",
        "Zeichensätze",
        "文字セット",
        "字符集",
        "مجموعات المحارف"
    ],
    "Lowercase (a-z)": [
        "छोटे अक्षर (a-z)",
        "Minúsculas (a-z)",
        "Minuscules (a-z)",
        "Kleinbuchstaben (a-z)",
        "小文字（a-z）",
        "小写字母 (a-z)",
        "أحرف صغيرة (a-z)"
    ],
    "Uppercase (A-Z)": [
        "बड़े अक्षर (A-Z)",
        "Mayúsculas (A-Z)",
        "Majuscules (A-Z)",
        "Großbuchstaben (A-Z)",
        "大文字（A-Z）",
        "大写字母 (A-Z)",
        "أحرف كبيرة (A-Z)"
    ],
    "Numbers (0-9)": [
        "अंक (0-9)",
        "Números (0-9)",
        "Chiffres (0-9)",
        "Zahlen (0-9)",
        "数字（0-9）",
        "数字 (0-9)",
        "أرقام (0-9)"
    ],
    "Symbols (!@#$...)": [
        "प्रतीक (!@#$...)",
        "Símbolos (!@#$...)",
        "Symboles (!@#$...)",
        "Symbole (!@#$...)",
        "記号（!@#$...）",
        "符号 (!@#$...)",
        "رموز (!@#$...)"
    ],
    "Password History": [
        "पासवर्ड इतिहास",
        "Historial de contraseñas",
        "Historique des mots de passe",
        "Passwortverlauf",
        "パスワード履歴",
        "密码历史",
        "سجل كلمات المرور"
    ],
    "Generated passwords will appear here": [
        "बनाए पासवर्ड यहाँ दिखेंगे",
        "Las contraseñas generadas aparecerán aquí",
        "Les mots de passe générés apparaîtront ici",
        "Erzeugte Passwörter erscheinen hier",
        "生成したパスワードがここに表示されます",
        "生成的密码将显示在此处",
        "ستظهر كلمات المرور المُنشأة هنا"
    ],
    "Configure options below": [
        "नीचे विकल्प चुनें",
        "Configura las opciones de abajo",
        "Configurez les options ci-dessous",
        "Optionen unten einstellen",
        "下のオプションを設定してください",
        "请配置下方选项",
        "اضبط الخيارات أدناه"
    ],
    "Select at least one character set": [
        "कम से कम एक अक्षर समूह चुनें",
        "Selecciona al menos un conjunto de caracteres",
        "Sélectionnez au moins un jeu de caractères",
        "Mindestens einen Zeichensatz wählen",
        "文字セットを1つ以上選んでください",
        "请至少选择一个字符集",
        "اختر مجموعة محارف واحدة على الأقل"
    ],
    "Weak": [
        "कमज़ोर",
        "Débil",
        "Faible",
        "Schwach",
        "弱い",
        "弱",
        "ضعيفة"
    ],
    "Fair": [
        "साधारण",
        "Aceptable",
        "Moyen",
        "Mittel",
        "普通",
        "一般",
        "متوسطة"
    ],
    "Good": [
        "अच्छा",
        "Buena",
        "Bon",
        "Gut",
        "良い",
        "良好",
        "جيدة"
    ],
    "Strong": [
        "मजबूत",
        "Fuerte",
        "Fort",
        "Stark",
        "強い",
        "强",
        "قوية"
    ],
    "Convert between Unix timestamps and human-readable dates": [
        "Unix टाइमस्टैम्प और पठनीय तारीखों के बीच बदलें",
        "Convierte entre marcas de tiempo Unix y fechas legibles",
        "Convertissez entre horodatages Unix et dates lisibles",
        "Zwischen Unix-Zeitstempeln und lesbaren Datumsangaben umrechnen",
        "Unixタイムスタンプと読みやすい日時を相互変換",
        "在 Unix 时间戳和易读日期间转换",
        "حوّل بين طوابع Unix الزمنية والتواريخ المقروءة"
    ],
    "A Unix timestamp is the number of seconds since January 1, 1970 (UTC). This tool converts between Unix timestamps (seconds/milliseconds) and human-readable date-time formats.": [
        "Unix टाइमस्टैम्प 1 जनवरी 1970 (UTC) से बीते सेकंड हैं। यह टूल Unix टाइमस्टैम्प (सेकंड/मिलीसेकंड) और पठनीय तारीख-समय प्रारूपों के बीच बदलता है।",
        "Una marca Unix es el número de segundos desde el 1 de enero de 1970 (UTC). Esta herramienta convierte entre marcas Unix (segundos/milisegundos) y formatos de fecha y hora legibles.",
        "Un horodatage Unix compte les secondes depuis le 1er janvier 1970 (UTC). Cet outil convertit entre horodatages Unix (secondes/millisecondes) et formats de date et d’heure lisibles.",
        "Ein Unix-Zeitstempel zählt die Sekunden seit dem 1. Januar 1970 (UTC). Dieses Werkzeug wandelt Unix-Zeitstempel (Sekunden/Millisekunden) und lesbare Datums- und Zeitformate ineinander um.",
        "Unixタイムスタンプは1970年1月1日（UTC）からの秒数です。このツールはUnixタイムスタンプ（秒・ミリ秒）と読みやすい日時形式を相互変換します。",
        "Unix 时间戳是自 1970 年 1 月 1 日（UTC）以来的秒数。此工具可在 Unix 时间戳（秒/毫秒）和易读日期时间格式之间转换。",
        "طابع Unix الزمني هو عدد الثواني منذ 1 يناير 1970 (UTC). تحوّل هذه الأداة بين طوابع Unix (ثوانٍ/مللي ثانية) وصيغ التاريخ والوقت المقروءة."
    ],
    "Timestamps are common in databases, APIs, and logs but aren't human-readable. This tool helps debug time-related issues by converting to readable dates with timezone support.": [
        "टाइमस्टैम्प डेटाबेस, API और लॉग में आम हैं पर पढ़ने में कठिन हैं। यह टूल समय क्षेत्र के समर्थन से पठनीय तारीखों में बदलकर समय संबंधी समस्याएँ जाँचने में मदद करता है।",
        "Las marcas de tiempo son habituales en bases de datos, API y registros, pero no son legibles. Esta herramienta ayuda a depurar problemas de tiempo al convertirlas en fechas con soporte de zonas horarias.",
        "Les horodatages sont courants dans les bases de données, API et journaux mais peu lisibles. Cet outil aide à résoudre les problèmes temporels en les convertissant en dates avec prise en charge des fuseaux horaires.",
        "Zeitstempel sind in Datenbanken, APIs und Protokollen üblich, aber schlecht lesbar. Dieses Werkzeug erleichtert die Fehlersuche durch lesbare Datumsangaben mit Zeitzonenunterstützung.",
        "タイムスタンプはデータベース、API、ログでよく使われますが、そのままでは読みづらいものです。タイムゾーンに対応した日時への変換で、時刻の問題の調査を助けます。",
        "时间戳常见于数据库、API 和日志，但不易直接阅读。此工具通过支持时区的易读日期转换，帮助排查时间相关问题。",
        "تشيع الطوابع الزمنية في قواعد البيانات وواجهات API والسجلات لكنها غير سهلة القراءة. تساعد الأداة في تشخيص مشكلات الوقت بتحويلها إلى تواريخ مقروءة مع دعم المناطق الزمنية."
    ],
    "View the time captured when this tool opened": [
        "टूल खुलने के समय लिया गया समय देखें",
        "Consulta la hora capturada al abrir esta herramienta",
        "Consultez l’heure capturée à l’ouverture de cet outil",
        "Beim Öffnen dieses Werkzeugs erfasste Zeit anzeigen",
        "このツールを開いた時点の時刻を確認します",
        "查看打开此工具时记录的时间",
        "اعرض الوقت المسجل عند فتح هذه الأداة"
    ],
    "Enter a timestamp to convert to a readable date": [
        "पठनीय तारीख में बदलने के लिए टाइमस्टैम्प दर्ज करें",
        "Introduce una marca para convertirla en fecha legible",
        "Saisissez un horodatage pour le convertir en date lisible",
        "Zeitstempel zur Umrechnung in ein lesbares Datum eingeben",
        "タイムスタンプを入力して読みやすい日時に変換します",
        "输入时间戳以转换为易读日期",
        "أدخل طابعًا زمنيًا لتحويله إلى تاريخ مقروء"
    ],
    "Enter a date/time to get its Unix timestamp": [
        "Unix टाइमस्टैम्प पाने के लिए तारीख/समय दर्ज करें",
        "Introduce una fecha y hora para obtener su marca Unix",
        "Saisissez une date et une heure pour obtenir l’horodatage Unix",
        "Datum und Uhrzeit eingeben, um den Unix-Zeitstempel zu erhalten",
        "日時を入力してUnixタイムスタンプを取得します",
        "输入日期时间以获取 Unix 时间戳",
        "أدخل تاريخًا ووقتًا للحصول على طابع Unix"
    ],
    "Copy timestamps in seconds or milliseconds": [
        "सेकंड या मिलीसेकंड में टाइमस्टैम्प कॉपी करें",
        "Copia marcas en segundos o milisegundos",
        "Copiez les horodatages en secondes ou millisecondes",
        "Zeitstempel in Sekunden oder Millisekunden kopieren",
        "秒またはミリ秒のタイムスタンプをコピーします",
        "复制秒或毫秒时间戳",
        "انسخ الطوابع بالثواني أو المللي ثانية"
    ],
    "JavaScript uses milliseconds, Unix uses seconds": [
        "JavaScript मिलीसेकंड और Unix सेकंड इस्तेमाल करता है",
        "JavaScript usa milisegundos; Unix usa segundos",
        "JavaScript utilise les millisecondes, Unix les secondes",
        "JavaScript verwendet Millisekunden, Unix Sekunden",
        "JavaScriptはミリ秒、Unixは秒を使います",
        "JavaScript 使用毫秒，Unix 使用秒",
        "يستخدم JavaScript المللي ثانية ويستخدم Unix الثواني"
    ],
    "Timestamps are always UTC - local time depends on timezone": [
        "टाइमस्टैम्प हमेशा UTC हैं; स्थानीय समय समय क्षेत्र पर निर्भर है",
        "Las marcas siempre son UTC; la hora local depende de la zona",
        "Les horodatages sont toujours en UTC ; l’heure locale dépend du fuseau",
        "Zeitstempel sind immer UTC; die Ortszeit hängt von der Zeitzone ab",
        "タイムスタンプは常にUTCで、現地時刻はタイムゾーンによります",
        "时间戳始终基于 UTC；本地时间取决于时区",
        "الطوابع دائمًا بتوقيت UTC، والوقت المحلي يعتمد على المنطقة الزمنية"
    ],
    "13-digit timestamps are milliseconds, 10-digit are seconds": [
        "13 अंकों के टाइमस्टैम्प मिलीसेकंड हैं, 10 अंकों के सेकंड हैं",
        "Las marcas de 13 dígitos son milisegundos; las de 10, segundos",
        "Les horodatages à 13 chiffres sont en millisecondes, ceux à 10 en secondes",
        "13-stellige Zeitstempel sind Millisekunden, 10-stellige Sekunden",
        "13桁はミリ秒、10桁は秒のタイムスタンプです",
        "13 位时间戳为毫秒，10 位为秒",
        "الطوابع ذات 13 خانة بالمللي ثانية وذات 10 خانات بالثواني"
    ],
    "Use for debugging API responses and log entries": [
        "API प्रतिक्रियाओं और लॉग की जाँच में इस्तेमाल करें",
        "Úsalo para depurar respuestas de API y registros",
        "Utilisez-le pour déboguer les réponses d’API et les journaux",
        "Zum Prüfen von API-Antworten und Protokolleinträgen verwenden",
        "APIレスポンスやログの調査に使います",
        "用于调试 API 响应和日志条目",
        "استخدمها لتشخيص استجابات API ومدخلات السجل"
    ],
    "Debugging date/time issues in APIs": [
        "API में तारीख/समय समस्याओं की जाँच",
        "Depurar problemas de fecha y hora en API",
        "Déboguer les problèmes de date et d’heure des API",
        "Datums- und Zeitprobleme in APIs untersuchen",
        "APIの日時に関する問題の調査",
        "调试 API 中的日期时间问题",
        "تشخيص مشكلات التاريخ والوقت في API"
    ],
    "Converting log timestamps to readable format": [
        "लॉग टाइमस्टैम्प को पठनीय बनाना",
        "Convertir marcas de registros a formato legible",
        "Convertir les horodatages des journaux en format lisible",
        "Protokollzeitstempel lesbar umwandeln",
        "ログのタイムスタンプを読みやすく変換",
        "将日志时间戳转换为易读格式",
        "تحويل طوابع السجل إلى صيغة مقروءة"
    ],
    "Calculating time differences between events": [
        "घटनाओं के बीच समय अंतर की गणना",
        "Calcular diferencias de tiempo entre eventos",
        "Calculer les écarts de temps entre événements",
        "Zeitabstände zwischen Ereignissen berechnen",
        "イベント間の時間差の計算",
        "计算事件间的时间差",
        "حساب الفواصل الزمنية بين الأحداث"
    ],
    "Generating timestamps for database queries": [
        "डेटाबेस क्वेरी के लिए टाइमस्टैम्प बनाना",
        "Generar marcas para consultas de bases de datos",
        "Générer des horodatages pour les requêtes de base de données",
        "Zeitstempel für Datenbankabfragen erzeugen",
        "データベースクエリ用のタイムスタンプ生成",
        "为数据库查询生成时间戳",
        "إنشاء طوابع لاستعلامات قواعد البيانات"
    ],
    "Current Time": [
        "वर्तमान समय",
        "Hora actual",
        "Heure actuelle",
        "Aktuelle Zeit",
        "現在の時刻",
        "当前时间",
        "الوقت الحالي"
    ],
    "Unix (seconds)": [
        "Unix (सेकंड)",
        "Unix (segundos)",
        "Unix (secondes)",
        "Unix (Sekunden)",
        "Unix（秒）",
        "Unix（秒）",
        "Unix (ثوانٍ)"
    ],
    "Local": [
        "स्थानीय",
        "Local",
        "Locale",
        "Ortszeit",
        "現地時刻",
        "本地时间",
        "محلي"
    ],
    "Timestamp → Date": [
        "टाइमस्टैम्प → तारीख",
        "Marca de tiempo → Fecha",
        "Horodatage → Date",
        "Zeitstempel → Datum",
        "タイムスタンプ → 日時",
        "时间戳 → 日期",
        "طابع زمني → تاريخ"
    ],
    "Date → Timestamp": [
        "तारीख → टाइमस्टैम्प",
        "Fecha → Marca de tiempo",
        "Date → Horodatage",
        "Datum → Zeitstempel",
        "日時 → タイムスタンプ",
        "日期 → 时间戳",
        "تاريخ → طابع زمني"
    ],
    "Convert to Date": [
        "तारीख में बदलें",
        "Convertir a fecha",
        "Convertir en date",
        "In Datum umrechnen",
        "日時に変換",
        "转换为日期",
        "تحويل إلى تاريخ"
    ],
    "Convert to Timestamp": [
        "टाइमस्टैम्प में बदलें",
        "Convertir a marca de tiempo",
        "Convertir en horodatage",
        "In Zeitstempel umrechnen",
        "タイムスタンプに変換",
        "转换为时间戳",
        "تحويل إلى طابع زمني"
    ],
    "Invalid timestamp": [
        "अमान्य टाइमस्टैम्प",
        "Marca de tiempo no válida",
        "Horodatage invalide",
        "Ungültiger Zeitstempel",
        "無効なタイムスタンプ",
        "无效时间戳",
        "طابع زمني غير صالح"
    ],
    "Invalid date": [
        "अमान्य तारीख",
        "Fecha no válida",
        "Date invalide",
        "Ungültiges Datum",
        "無効な日時",
        "无效日期",
        "تاريخ غير صالح"
    ],
    "Timestamp copied!": [
        "टाइमस्टैम्प कॉपी हुआ!",
        "¡Marca de tiempo copiada!",
        "Horodatage copié !",
        "Zeitstempel kopiert!",
        "タイムスタンプをコピーしました！",
        "已复制时间戳！",
        "تم نسخ الطابع الزمني!"
    ],
    "ISO date copied!": [
        "ISO तारीख कॉपी हुई!",
        "¡Fecha ISO copiada!",
        "Date ISO copiée !",
        "ISO-Datum kopiert!",
        "ISO日時をコピーしました！",
        "已复制 ISO 日期！",
        "تم نسخ تاريخ ISO!"
    ],
    "Local time copied!": [
        "स्थानीय समय कॉपी हुआ!",
        "¡Hora local copiada!",
        "Heure locale copiée !",
        "Ortszeit kopiert!",
        "現地時刻をコピーしました！",
        "已复制本地时间！",
        "تم نسخ الوقت المحلي!"
    ],
    "e.g. 1700000000": [
        "जैसे 1700000000",
        "p. ej. 1700000000",
        "p. ex. 1700000000",
        "z. B. 1700000000",
        "例: 1700000000",
        "例如 1700000000",
        "مثلًا 1700000000"
    ],
    "e.g. 2024-01-01T00:00:00Z": [
        "जैसे 2024-01-01T00:00:00Z",
        "p. ej. 2024-01-01T00:00:00Z",
        "p. ex. 2024-01-01T00:00:00Z",
        "z. B. 2024-01-01T00:00:00Z",
        "例: 2024-01-01T00:00:00Z",
        "例如 2024-01-01T00:00:00Z",
        "مثلًا 2024-01-01T00:00:00Z"
    ],
    "Calculate chmod values and understand file permissions": [
        "chmod मान निकालें और फ़ाइल अनुमतियाँ समझें",
        "Calcula valores chmod y comprende los permisos",
        "Calculez les valeurs chmod et comprenez les permissions",
        "chmod-Werte berechnen und Dateirechte verstehen",
        "chmodの値を計算し、ファイル権限を理解",
        "计算 chmod 值并了解文件权限",
        "احسب قيم chmod وافهم أذونات الملفات"
    ],
    "Unix file permissions control who can read, write, and execute files. Permissions are set for owner, group, and others. This calculator converts between symbolic (rwx) and numeric (755) notation.": [
        "Unix फ़ाइल अनुमतियाँ तय करती हैं कि कौन पढ़, लिख और चला सकता है। अनुमतियाँ स्वामी, समूह और अन्य के लिए हैं। यह कैलकुलेटर प्रतीकात्मक (rwx) और संख्यात्मक (755) रूप बदलता है।",
        "Los permisos Unix controlan quién puede leer, escribir y ejecutar archivos. Se asignan al propietario, al grupo y a otros. Esta calculadora convierte entre notación simbólica (rwx) y numérica (755).",
        "Les permissions Unix définissent qui peut lire, écrire et exécuter les fichiers, pour le propriétaire, le groupe et les autres. Cette calculatrice convertit entre notations symbolique (rwx) et numérique (755).",
        "Unix-Dateirechte bestimmen, wer Dateien lesen, schreiben und ausführen darf: Eigentümer, Gruppe und andere. Dieser Rechner wandelt symbolische (rwx) und numerische (755) Notation ineinander um.",
        "Unixのファイル権限は、所有者・グループ・その他のユーザーがファイルを読み書き・実行できるかを制御します。この計算機は記号（rwx）と数値（755）の表記を相互変換します。",
        "Unix 文件权限控制谁可以读取、写入和执行文件，分别为所有者、用户组及其他用户设置。此计算器可在符号（rwx）和数字（755）表示之间转换。",
        "تحدد أذونات Unix من يمكنه قراءة الملفات وكتابتها وتنفيذها، للمالك والمجموعة والآخرين. تحوّل هذه الحاسبة بين الصيغة الرمزية (rwx) والرقمية (755)."
    ],
    "Setting correct permissions is crucial for security. Incorrect permissions can expose sensitive files or break applications. This tool helps understand and set the right values.": [
        "सुरक्षा के लिए सही अनुमतियाँ ज़रूरी हैं। गलत अनुमतियाँ संवेदनशील फ़ाइलें उजागर या ऐप खराब कर सकती हैं। यह टूल सही मान समझने और तय करने में मदद करता है।",
        "Los permisos correctos son cruciales para la seguridad. Los incorrectos pueden exponer archivos sensibles o romper aplicaciones. Esta herramienta ayuda a entender y elegir los valores adecuados.",
        "Des permissions correctes sont essentielles à la sécurité. Des erreurs peuvent exposer des fichiers sensibles ou perturber les applications. Cet outil aide à comprendre et choisir les bonnes valeurs.",
        "Korrekte Rechte sind entscheidend für die Sicherheit. Falsche Rechte können vertrauliche Dateien offenlegen oder Anwendungen stören. Dieses Werkzeug hilft, passende Werte zu verstehen und festzulegen.",
        "適切な権限の設定は安全性に不可欠です。誤った権限は機密ファイルの漏洩やアプリの不具合につながります。このツールは正しい値の理解と設定を助けます。",
        "正确设置权限对安全至关重要。错误权限可能暴露敏感文件或导致应用故障。此工具可帮助理解并选择合适的值。",
        "ضبط الأذونات الصحيحة أساسي للأمان. قد تكشف الأذونات الخاطئة ملفات حساسة أو تعطل التطبيقات. تساعد الأداة على فهم القيم المناسبة وضبطها."
    ],
    "Enter a numeric chmod value (e.g., 755) or use checkboxes": [
        "chmod का संख्यात्मक मान (जैसे 755) दर्ज करें या चेकबॉक्स चुनें",
        "Introduce un valor chmod numérico (p. ej., 755) o usa las casillas",
        "Saisissez une valeur chmod numérique (p. ex. 755) ou utilisez les cases",
        "Numerischen chmod-Wert (z. B. 755) eingeben oder Kontrollkästchen verwenden",
        "chmodの数値（例: 755）を入力するかチェックボックスを使います",
        "输入 chmod 数字值（如 755）或使用复选框",
        "أدخل قيمة chmod رقمية (مثل 755) أو استخدم مربعات الاختيار"
    ],
    "See the symbolic representation (rwxr-xr-x)": [
        "प्रतीकात्मक रूप देखें (rwxr-xr-x)",
        "Consulta la representación simbólica (rwxr-xr-x)",
        "Consultez la représentation symbolique (rwxr-xr-x)",
        "Symbolische Darstellung (rwxr-xr-x) ansehen",
        "記号表記（rwxr-xr-x）を確認します",
        "查看符号表示 (rwxr-xr-x)",
        "اعرض التمثيل الرمزي (rwxr-xr-x)"
    ],
    "Understand what each permission means": [
        "हर अनुमति का अर्थ समझें",
        "Comprende qué significa cada permiso",
        "Comprenez la signification de chaque permission",
        "Bedeutung der einzelnen Rechte verstehen",
        "各権限の意味を理解します",
        "了解每项权限的含义",
        "افهم معنى كل إذن"
    ],
    "Copy the chmod command for terminal use": [
        "टर्मिनल के लिए chmod कमांड कॉपी करें",
        "Copia el comando chmod para la terminal",
        "Copiez la commande chmod pour le terminal",
        "chmod-Befehl für das Terminal kopieren",
        "ターミナル用のchmodコマンドをコピーします",
        "复制用于终端的 chmod 命令",
        "انسخ أمر chmod لاستخدامه في الطرفية"
    ],
    "7 = rwx (read+write+execute = 4+2+1)": [
        "7 = rwx (पढ़ना+लिखना+चलाना = 4+2+1)",
        "7 = rwx (leer+escribir+ejecutar = 4+2+1)",
        "7 = rwx (lecture+écriture+exécution = 4+2+1)",
        "7 = rwx (Lesen+Schreiben+Ausführen = 4+2+1)",
        "7 = rwx（読み取り+書き込み+実行 = 4+2+1）",
        "7 = rwx（读取+写入+执行 = 4+2+1）",
        "7 = rwx (قراءة+كتابة+تنفيذ = 4+2+1)"
    ],
    "755 = rwxr-xr-x (common for directories)": [
        "755 = rwxr-xr-x (डायरेक्टरी के लिए आम)",
        "755 = rwxr-xr-x (habitual para directorios)",
        "755 = rwxr-xr-x (courant pour les dossiers)",
        "755 = rwxr-xr-x (üblich für Verzeichnisse)",
        "755 = rwxr-xr-x（ディレクトリで一般的）",
        "755 = rwxr-xr-x（目录常用）",
        "755 = rwxr-xr-x (شائع للمجلدات)"
    ],
    "644 = rw-r--r-- (common for files)": [
        "644 = rw-r--r-- (फ़ाइलों के लिए आम)",
        "644 = rw-r--r-- (habitual para archivos)",
        "644 = rw-r--r-- (courant pour les fichiers)",
        "644 = rw-r--r-- (üblich für Dateien)",
        "644 = rw-r--r--（ファイルで一般的）",
        "644 = rw-r--r--（文件常用）",
        "644 = rw-r--r-- (شائع للملفات)"
    ],
    "600 = rw------- (private files like SSH keys)": [
        "600 = rw------- (SSH कुंजी जैसी निजी फ़ाइलें)",
        "600 = rw------- (archivos privados como claves SSH)",
        "600 = rw------- (fichiers privés comme les clés SSH)",
        "600 = rw------- (private Dateien wie SSH-Schlüssel)",
        "600 = rw-------（SSHキーなどの非公開ファイル）",
        "600 = rw-------（SSH 密钥等私密文件）",
        "600 = rw------- (ملفات خاصة مثل مفاتيح SSH)"
    ],
    "Setting correct permissions for web server files": [
        "वेब सर्वर फ़ाइलों की सही अनुमतियाँ तय करना",
        "Establecer permisos correctos en archivos del servidor web",
        "Définir les permissions des fichiers du serveur web",
        "Korrekte Rechte für Webserverdateien festlegen",
        "Webサーバーファイルの適切な権限設定",
        "为 Web 服务器文件设置正确权限",
        "ضبط أذونات ملفات خادم الويب"
    ],
    "Securing sensitive configuration files": [
        "संवेदनशील कॉन्फ़िगरेशन फ़ाइलें सुरक्षित करना",
        "Proteger archivos de configuración sensibles",
        "Protéger les fichiers de configuration sensibles",
        "Vertrauliche Konfigurationsdateien absichern",
        "機密設定ファイルの保護",
        "保护敏感配置文件",
        "تأمين ملفات الإعداد الحساسة"
    ],
    "Understanding ls -l permission output": [
        "ls -l अनुमति आउटपुट समझना",
        "Comprender los permisos de la salida de ls -l",
        "Comprendre les permissions affichées par ls -l",
        "Rechteausgabe von ls -l verstehen",
        "ls -lの権限出力を理解",
        "理解 ls -l 的权限输出",
        "فهم أذونات مخرجات ls -l"
    ],
    "Troubleshooting 'permission denied' errors": [
        "'permission denied' त्रुटियों की जाँच",
        "Resolver errores «permission denied»",
        "Résoudre les erreurs « permission denied »",
        "Fehler „permission denied“ untersuchen",
        "「permission denied」エラーの調査",
        "排查“permission denied”错误",
        "تشخيص أخطاء 'permission denied'"
    ],
    "Octal (Numeric)": [
        "अष्टाधारी (संख्यात्मक)",
        "Octal (numérico)",
        "Octal (numérique)",
        "Oktal (numerisch)",
        "8進数（数値）",
        "八进制（数字）",
        "ثماني (رقمي)"
    ],
    "Symbolic": [
        "प्रतीकात्मक",
        "Simbólico",
        "Symbolique",
        "Symbolisch",
        "記号表記",
        "符号表示",
        "رمزي"
    ],
    "Owner (User)": [
        "स्वामी (उपयोगकर्ता)",
        "Propietario (usuario)",
        "Propriétaire (utilisateur)",
        "Eigentümer (Benutzer)",
        "所有者（ユーザー）",
        "所有者（用户）",
        "المالك (المستخدم)"
    ],
    "Group": [
        "समूह",
        "Grupo",
        "Groupe",
        "Gruppe",
        "グループ",
        "用户组",
        "المجموعة"
    ],
    "Others (World)": [
        "अन्य (सभी)",
        "Otros (todos)",
        "Autres (tous)",
        "Andere (alle)",
        "その他（全員）",
        "其他用户（所有人）",
        "الآخرون (الجميع)"
    ],
    "Enter Octal Value": [
        "अष्टाधारी मान दर्ज करें",
        "Introducir valor octal",
        "Saisir une valeur octale",
        "Oktalwert eingeben",
        "8進数値を入力",
        "输入八进制值",
        "أدخل قيمة ثمانية"
    ],
    "Enter 3 or 4 digit octal value (e.g., 755, 0644)": [
        "3 या 4 अंकों का अष्टाधारी मान दर्ज करें (जैसे 755, 0644)",
        "Introduce un valor octal de 3 o 4 dígitos (p. ej., 755, 0644)",
        "Saisissez une valeur octale de 3 ou 4 chiffres (p. ex. 755, 0644)",
        "3- oder 4-stelligen Oktalwert eingeben (z. B. 755, 0644)",
        "3桁または4桁の8進数値を入力します（例: 755、0644）",
        "输入 3 或 4 位八进制值（如 755、0644）",
        "أدخل قيمة ثمانية من 3 أو 4 خانات (مثل 755، 0644)"
    ],
    "Command Preview": [
        "कमांड पूर्वावलोकन",
        "Vista previa del comando",
        "Aperçu de la commande",
        "Befehlsvorschau",
        "コマンドのプレビュー",
        "命令预览",
        "معاينة الأمر"
    ],
    "Common Permissions": [
        "सामान्य अनुमतियाँ",
        "Permisos habituales",
        "Permissions courantes",
        "Übliche Rechte",
        "一般的な権限",
        "常用权限",
        "أذونات شائعة"
    ],
    "Permission Values": [
        "अनुमति मान",
        "Valores de permisos",
        "Valeurs des permissions",
        "Berechtigungswerte",
        "権限の値",
        "权限值",
        "قيم الأذونات"
    ],
    "(Read)": [
        "(पढ़ना)",
        "(Leer)",
        "(Lecture)",
        "(Lesen)",
        "（読み取り）",
        "（读取）",
        "(قراءة)"
    ],
    "(Write)": [
        "(लिखना)",
        "(Escribir)",
        "(Écriture)",
        "(Schreiben)",
        "（書き込み）",
        "（写入）",
        "(كتابة)"
    ],
    "(Execute)": [
        "(चलाना)",
        "(Ejecutar)",
        "(Exécution)",
        "(Ausführen)",
        "（実行）",
        "（执行）",
        "(تنفيذ)"
    ],
    "(None)": [
        "(कोई नहीं)",
        "(Ninguno)",
        "(Aucun)",
        "(Keine)",
        "（なし）",
        "（无）",
        "(لا شيء)"
    ],
    "Owner can read": [
        "स्वामी पढ़ सकता है",
        "El propietario puede leer",
        "Le propriétaire peut lire",
        "Eigentümer darf lesen",
        "所有者は読み取り可能",
        "所有者可读取",
        "يمكن للمالك القراءة"
    ],
    "Owner can write": [
        "स्वामी लिख सकता है",
        "El propietario puede escribir",
        "Le propriétaire peut écrire",
        "Eigentümer darf schreiben",
        "所有者は書き込み可能",
        "所有者可写入",
        "يمكن للمالك الكتابة"
    ],
    "Owner can execute": [
        "स्वामी चला सकता है",
        "El propietario puede ejecutar",
        "Le propriétaire peut exécuter",
        "Eigentümer darf ausführen",
        "所有者は実行可能",
        "所有者可执行",
        "يمكن للمالك التنفيذ"
    ],
    "Group can read": [
        "समूह पढ़ सकता है",
        "El grupo puede leer",
        "Le groupe peut lire",
        "Gruppe darf lesen",
        "グループは読み取り可能",
        "用户组可读取",
        "يمكن للمجموعة القراءة"
    ],
    "Group can write": [
        "समूह लिख सकता है",
        "El grupo puede escribir",
        "Le groupe peut écrire",
        "Gruppe darf schreiben",
        "グループは書き込み可能",
        "用户组可写入",
        "يمكن للمجموعة الكتابة"
    ],
    "Group can execute": [
        "समूह चला सकता है",
        "El grupo puede ejecutar",
        "Le groupe peut exécuter",
        "Gruppe darf ausführen",
        "グループは実行可能",
        "用户组可执行",
        "يمكن للمجموعة التنفيذ"
    ],
    "Others can read": [
        "अन्य पढ़ सकते हैं",
        "Otros pueden leer",
        "Les autres peuvent lire",
        "Andere dürfen lesen",
        "その他は読み取り可能",
        "其他用户可读取",
        "يمكن للآخرين القراءة"
    ],
    "Others can write": [
        "अन्य लिख सकते हैं",
        "Otros pueden escribir",
        "Les autres peuvent écrire",
        "Andere dürfen schreiben",
        "その他は書き込み可能",
        "其他用户可写入",
        "يمكن للآخرين الكتابة"
    ],
    "Others can execute": [
        "अन्य चला सकते हैं",
        "Otros pueden ejecutar",
        "Les autres peuvent exécuter",
        "Andere dürfen ausführen",
        "その他は実行可能",
        "其他用户可执行",
        "يمكن للآخرين التنفيذ"
    ],
    "Standard for executables": [
        "निष्पादन योग्य फ़ाइलों का मानक",
        "Estándar para ejecutables",
        "Standard pour les exécutables",
        "Standard für ausführbare Dateien",
        "実行ファイルの標準",
        "可执行文件标准权限",
        "قياسي للملفات التنفيذية"
    ],
    "Standard for files": [
        "फ़ाइलों का मानक",
        "Estándar para archivos",
        "Standard pour les fichiers",
        "Standard für Dateien",
        "ファイルの標準",
        "文件标准权限",
        "قياسي للملفات"
    ],
    "Full access (not recommended)": [
        "पूरा अधिकार (अनुशंसित नहीं)",
        "Acceso total (no recomendado)",
        "Accès complet (déconseillé)",
        "Vollzugriff (nicht empfohlen)",
        "フルアクセス（非推奨）",
        "完全访问（不推荐）",
        "وصول كامل (غير موصى به)"
    ],
    "Owner only": [
        "केवल स्वामी",
        "Solo propietario",
        "Propriétaire uniquement",
        "Nur Eigentümer",
        "所有者のみ",
        "仅所有者",
        "المالك فقط"
    ],
    "Private file": [
        "निजी फ़ाइल",
        "Archivo privado",
        "Fichier privé",
        "Private Datei",
        "非公開ファイル",
        "私密文件",
        "ملف خاص"
    ],
    "Group writable": [
        "समूह लिख सकता है",
        "Escritura para el grupo",
        "Écriture pour le groupe",
        "Für Gruppe beschreibbar",
        "グループ書き込み可",
        "用户组可写",
        "قابل للكتابة للمجموعة"
    ],
    "Group writable file": [
        "समूह लिखने योग्य फ़ाइल",
        "Archivo editable por el grupo",
        "Fichier modifiable par le groupe",
        "Für Gruppe beschreibbare Datei",
        "グループ書き込み可能ファイル",
        "用户组可写文件",
        "ملف قابل للكتابة للمجموعة"
    ],
    "Group readable dir": [
        "समूह पढ़ने योग्य डायरेक्टरी",
        "Directorio legible por el grupo",
        "Dossier lisible par le groupe",
        "Für Gruppe lesbares Verzeichnis",
        "グループ読み取り可能ディレクトリ",
        "用户组可读目录",
        "مجلد قابل للقراءة للمجموعة"
    ]
};

/** Translate known validation messages without altering unknown diagnostic details. */
export function numericUtilityMessage(t: (source: string, values?: Record<string, string | number>) => string, message: string): string | null {
    if (NUMERIC_UTILITY_TRANSLATIONS[message]) return t(message);
    const digit = /^“([\s\S])” is not a digit in base (\d+)\.$/.exec(message);
    return digit ? t("“{digit}” is not a digit in base {base}.", { digit: digit[1], base: digit[2] }) : null;
}
