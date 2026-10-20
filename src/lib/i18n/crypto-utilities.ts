import type { TranslationColumns } from "./tool-names";

// Authored interface/help copy only. Never translate payloads, keys, algorithm IDs or ciphertext.
export const CRYPTO_UTILITY_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Hash Generator": [
        "हैश जनरेटर",
        "Generador de hashes",
        "Générateur de hachages",
        "Hashgenerator",
        "ハッシュ生成",
        "哈希生成器",
        "مولد التجزئة"
    ],
    "HMAC Generator": [
        "HMAC जनरेटर",
        "Generador de HMAC",
        "Générateur HMAC",
        "HMAC-Generator",
        "HMAC生成",
        "HMAC 生成器",
        "مولد HMAC"
    ],
    "BCrypt Hash & Verify": [
        "BCrypt हैश और सत्यापन",
        "Hash y verificación BCrypt",
        "Hachage et vérification BCrypt",
        "BCrypt hashen und prüfen",
        "BCryptハッシュと検証",
        "BCrypt 哈希与验证",
        "تجزئة BCrypt والتحقق"
    ],
    "AES Encrypt & Decrypt": [
        "AES एन्क्रिप्शन और डिक्रिप्शन",
        "Cifrado y descifrado AES",
        "Chiffrement et déchiffrement AES",
        "AES ver- und entschlüsseln",
        "AES暗号化と復号",
        "AES 加密与解密",
        "تشفير AES وفك التشفير"
    ],
    "Generate HMAC signatures using various algorithms": [
        "विभिन्न एल्गोरिदम से HMAC हस्ताक्षर बनाएँ",
        "Genera firmas HMAC con distintos algoritmos",
        "Générez des signatures HMAC avec différents algorithmes",
        "HMAC-Signaturen mit verschiedenen Algorithmen erzeugen",
        "各種アルゴリズムでHMAC署名を生成",
        "使用不同算法生成 HMAC 签名",
        "أنشئ توقيعات HMAC بخوارزميات مختلفة"
    ],
    "Generate BCrypt password hashes and verify passwords": [
        "BCrypt पासवर्ड हैश बनाएँ और पासवर्ड जाँचें",
        "Genera hashes BCrypt y verifica contraseñas",
        "Générez des hachages BCrypt et vérifiez les mots de passe",
        "BCrypt-Passworthashes erzeugen und Passwörter prüfen",
        "BCryptパスワードハッシュの生成と照合",
        "生成 BCrypt 密码哈希并验证密码",
        "أنشئ تجزئات BCrypt وتحقق من كلمات المرور"
    ],
    "Encrypt and decrypt text with CryptoJS AES passphrases": [
        "CryptoJS AES पासफ़्रेज़ से टेक्स्ट एन्क्रिप्ट और डिक्रिप्ट करें",
        "Cifra y descifra texto con frases de contraseña de CryptoJS AES",
        "Chiffrez et déchiffrez du texte avec les phrases secrètes de CryptoJS AES",
        "Text mit CryptoJS AES und Passphrase ver- und entschlüsseln",
        "CryptoJS AESとパスフレーズでテキストを暗号化・復号",
        "使用 CryptoJS AES 口令加密和解密文本",
        "شفّر النص وفك تشفيره بعبارات مرور CryptoJS AES"
    ],
    "Input Text": [
        "इनपुट टेक्स्ट",
        "Texto de entrada",
        "Texte d’entrée",
        "Eingabetext",
        "入力テキスト",
        "输入文本",
        "نص الإدخال"
    ],
    "Generate Hashes": [
        "हैश बनाएँ",
        "Generar hashes",
        "Générer les hachages",
        "Hashes erzeugen",
        "ハッシュを生成",
        "生成哈希",
        "إنشاء التجزئات"
    ],
    "Copy All": [
        "सभी कॉपी करें",
        "Copiar todo",
        "Tout copier",
        "Alle kopieren",
        "すべてコピー",
        "全部复制",
        "نسخ الكل"
    ],
    "All hashes copied!": [
        "सभी हैश कॉपी हो गए!",
        "¡Todos los hashes copiados!",
        "Tous les hachages ont été copiés !",
        "Alle Hashes kopiert!",
        "すべてのハッシュをコピーしました！",
        "已复制所有哈希！",
        "تم نسخ جميع التجزئات!"
    ],
    "{algorithm} copied!": [
        "{algorithm} कॉपी हो गया!",
        "¡{algorithm} copiado!",
        "{algorithm} copié !",
        "{algorithm} kopiert!",
        "{algorithm}をコピーしました！",
        "已复制 {algorithm}！",
        "تم نسخ {algorithm}!"
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
    "Enter some text first": [
        "पहले कुछ टेक्स्ट दर्ज करें",
        "Introduce primero algún texto",
        "Saisissez d’abord du texte",
        "Zuerst Text eingeben",
        "先にテキストを入力してください",
        "请先输入文本",
        "أدخل نصًا أولًا"
    ],
    "Error generating hashes": [
        "हैश बनाने में त्रुटि",
        "Error al generar hashes",
        "Erreur de génération des hachages",
        "Fehler beim Erzeugen der Hashes",
        "ハッシュを生成できませんでした",
        "生成哈希失败",
        "تعذر إنشاء التجزئات"
    ],
    "Crypto operation failed: {detail}": [
        "क्रिप्टो कार्रवाई विफल: {detail}",
        "Falló la operación criptográfica: {detail}",
        "Échec de l’opération cryptographique : {detail}",
        "Kryptografischer Vorgang fehlgeschlagen: {detail}",
        "暗号処理に失敗しました: {detail}",
        "加密处理失败：{detail}",
        "فشلت العملية التشفيرية: {detail}"
    ],
    "Operation failed": [
        "कार्रवाई विफल",
        "La operación falló",
        "Échec de l’opération",
        "Vorgang fehlgeschlagen",
        "処理に失敗しました",
        "操作失败",
        "فشلت العملية"
    ],
    "Input": [
        "इनपुट",
        "Entrada",
        "Entrée",
        "Eingabe",
        "入力",
        "输入",
        "الإدخال"
    ],
    "Message": [
        "संदेश",
        "Mensaje",
        "Message à signer",
        "Nachricht",
        "メッセージ",
        "消息",
        "الرسالة"
    ],
    "Enter the message to sign...": [
        "हस्ताक्षर के लिए संदेश दर्ज करें...",
        "Introduce el mensaje que quieres firmar...",
        "Saisissez le message à signer…",
        "Zu signierende Nachricht eingeben...",
        "署名するメッセージを入力…",
        "输入要签名的消息…",
        "أدخل الرسالة المراد توقيعها..."
    ],
    "Secret Key": [
        "गुप्त कुंजी",
        "Clave secreta",
        "Clé secrète",
        "Geheimer Schlüssel",
        "秘密鍵",
        "密钥",
        "المفتاح السري"
    ],
    "Enter secret key...": [
        "गुप्त कुंजी दर्ज करें...",
        "Introduce la clave secreta...",
        "Saisissez la clé secrète…",
        "Geheimen Schlüssel eingeben...",
        "秘密鍵を入力…",
        "输入密钥…",
        "أدخل المفتاح السري..."
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
    "Generate random secret key": [
        "यादृच्छिक गुप्त कुंजी बनाएँ",
        "Generar clave secreta aleatoria",
        "Générer une clé secrète aléatoire",
        "Zufälligen geheimen Schlüssel erzeugen",
        "ランダムな秘密鍵を生成",
        "生成随机密钥",
        "إنشاء مفتاح سري عشوائي"
    ],
    "Algorithm": [
        "एल्गोरिदम",
        "Algoritmo",
        "Algorithme",
        "Algorithmus",
        "アルゴリズム",
        "算法",
        "الخوارزمية"
    ],
    "Output Format": [
        "आउटपुट प्रारूप",
        "Formato de salida",
        "Format de sortie",
        "Ausgabeformat",
        "出力形式",
        "输出格式",
        "تنسيق الإخراج"
    ],
    "Hexadecimal": [
        "षोडशाधारी",
        "Hexadecimal (base 16)",
        "Hexadécimal",
        "Hexadezimal",
        "16進数",
        "十六进制",
        "سداسي عشري"
    ],
    "Generate HMAC": [
        "HMAC बनाएँ",
        "Generar HMAC",
        "Générer le HMAC",
        "HMAC erzeugen",
        "HMACを生成",
        "生成 HMAC",
        "إنشاء HMAC"
    ],
    "Please enter both message and secret key": [
        "संदेश और गुप्त कुंजी दोनों दर्ज करें",
        "Introduce el mensaje y la clave secreta",
        "Saisissez le message et la clé secrète",
        "Nachricht und geheimen Schlüssel eingeben",
        "メッセージと秘密鍵を両方入力してください",
        "请输入消息和密钥",
        "أدخل الرسالة والمفتاح السري معًا"
    ],
    "HMAC copied to clipboard!": [
        "HMAC क्लिपबोर्ड पर कॉपी हो गया!",
        "¡HMAC copiado al portapapeles!",
        "HMAC copié dans le presse-papiers !",
        "HMAC in die Zwischenablage kopiert!",
        "HMACをクリップボードにコピーしました！",
        "已将 HMAC 复制到剪贴板！",
        "تم نسخ HMAC إلى الحافظة!"
    ],
    "The secret key is never included in share links — only the message text.": [
        "साझा लिंक में केवल संदेश का टेक्स्ट होता है, गुप्त कुंजी कभी नहीं।",
        "Los enlaces compartidos solo incluyen el mensaje; nunca la clave secreta.",
        "Les liens partagés contiennent uniquement le message, jamais la clé secrète.",
        "Freigabelinks enthalten nur den Nachrichtentext; der geheime Schlüssel wird nie aufgenommen.",
        "共有リンクにはメッセージ本文のみが含まれ、秘密鍵は含まれません。",
        "分享链接仅包含消息文本，绝不包含密钥。",
        "تحتوي روابط المشاركة على نص الرسالة فقط، ولا تتضمن المفتاح السري أبدًا."
    ],
    "HMAC Result": [
        "HMAC परिणाम",
        "Resultado HMAC",
        "Résultat HMAC",
        "HMAC-Ergebnis",
        "HMACの結果",
        "HMAC 结果",
        "نتيجة HMAC"
    ],
    "Click “Generate HMAC” to create a signature": [
        "हस्ताक्षर बनाने के लिए “HMAC बनाएँ” पर क्लिक करें",
        "Pulsa «Generar HMAC» para crear una firma",
        "Cliquez sur « Générer le HMAC » pour créer une signature",
        "Auf „HMAC erzeugen“ klicken, um eine Signatur zu erstellen",
        "「HMACを生成」を押すと署名を作成します",
        "点击“生成 HMAC”创建签名",
        "اضغط «إنشاء HMAC» لإنشاء توقيع"
    ],
    "Length: {length} characters ({bits} bits)": [
        "लंबाई: {length} वर्ण ({bits} बिट)",
        "Longitud: {length} caracteres ({bits} bits)",
        "Longueur : {length} caractères ({bits} bits)",
        "Länge: {length} Zeichen ({bits} Bit)",
        "長さ: {length}文字（{bits}ビット）",
        "长度：{length} 个字符（{bits} 位）",
        "الطول: {length} حرفًا ({bits} بت)"
    ],
    "About HMAC": [
        "HMAC के बारे में",
        "Acerca de HMAC",
        "À propos de HMAC",
        "Über HMAC",
        "HMACについて",
        "关于 HMAC",
        "عن HMAC"
    ],
    "Algorithm Comparison": [
        "एल्गोरिदम तुलना",
        "Comparación de algoritmos",
        "Comparaison des algorithmes",
        "Algorithmenvergleich",
        "アルゴリズム比較",
        "算法对比",
        "مقارنة الخوارزميات"
    ],
    "{bits}-bit output": [
        "{bits}-बिट आउटपुट",
        "Salida de {bits} bits",
        "Sortie de {bits} bits",
        "Ausgabe mit {bits} Bit",
        "{bits}ビット出力",
        "{bits} 位输出",
        "إخراج بحجم {bits} بت"
    ],
    "Legacy, not recommended for security": [
        "पुराना, सुरक्षा के लिए अनुशंसित नहीं",
        "Antiguo, no recomendado para seguridad",
        "Ancien, déconseillé pour la sécurité",
        "Veraltet, für Sicherheit nicht empfohlen",
        "旧式。セキュリティ用途には非推奨",
        "旧版算法，不建议用于安全用途",
        "قديم، لا يُنصح به للأمان"
    ],
    "Most commonly used, good security": [
        "सबसे प्रचलित, अच्छी सुरक्षा",
        "El más utilizado, buena seguridad",
        "Très répandu, bonne sécurité",
        "Weit verbreitet, gute Sicherheit",
        "広く使われ、十分な安全性",
        "最常用，安全性良好",
        "الأكثر استخدامًا، بأمان جيد"
    ],
    "Higher security, truncated SHA-512": [
        "अधिक सुरक्षा, संक्षिप्त SHA-512",
        "Mayor seguridad, SHA-512 truncado",
        "Sécurité accrue, SHA-512 tronqué",
        "Höhere Sicherheit, gekürztes SHA-512",
        "より高い安全性。SHA-512の短縮版",
        "更高安全性，截断的 SHA-512",
        "أمان أعلى، SHA-512 مختصر"
    ],
    "Highest security, best for sensitive data": [
        "उच्चतम सुरक्षा, संवेदनशील डेटा के लिए",
        "Máxima seguridad, para datos sensibles",
        "Sécurité maximale, pour données sensibles",
        "Höchste Sicherheit, für sensible Daten",
        "最も高い安全性。機密データ向け",
        "最高安全性，适用于敏感数据",
        "أعلى أمان، للبيانات الحساسة"
    ],
    "Common Use Cases": [
        "सामान्य उपयोग",
        "Usos habituales",
        "Cas d’utilisation courants",
        "Häufige Anwendungsfälle",
        "一般的な用途",
        "常见用途",
        "الاستخدامات الشائعة"
    ],
    "API authentication signatures": [
        "API प्रमाणीकरण हस्ताक्षर",
        "Firmas de autenticación de API",
        "Signatures d’authentification API",
        "Signaturen zur API-Authentifizierung",
        "API認証署名",
        "API 身份验证签名",
        "توقيعات مصادقة API"
    ],
    "Webhook payload verification": [
        "Webhook पेलोड सत्यापन",
        "Verificación de cargas webhook",
        "Vérification des charges webhook",
        "Webhook-Nutzdaten prüfen",
        "Webhookペイロードの検証",
        "Webhook 载荷验证",
        "التحقق من حمولة Webhook"
    ],
    "Session token validation": [
        "सत्र टोकन सत्यापन",
        "Validación de tokens de sesión",
        "Validation des jetons de session",
        "Sitzungstoken prüfen",
        "セッショントークンの検証",
        "会话令牌验证",
        "التحقق من رموز الجلسة"
    ],
    "Data integrity checks": [
        "डेटा अखंडता जाँच",
        "Comprobación de integridad de datos",
        "Contrôles d’intégrité des données",
        "Datenintegrität prüfen",
        "データ完全性の確認",
        "数据完整性检查",
        "فحص سلامة البيانات"
    ],
    "OAuth 1.0 signatures": [
        "OAuth 1.0 हस्ताक्षर",
        "Firmas OAuth 1.0",
        "Signatures OAuth 1.0",
        "OAuth 1.0-Signaturen",
        "OAuth 1.0署名",
        "OAuth 1.0 签名",
        "توقيعات OAuth 1.0"
    ],
    "Hash Password": [
        "पासवर्ड हैश करें",
        "Crear hash de contraseña",
        "Hacher un mot de passe",
        "Passwort hashen",
        "パスワードをハッシュ化",
        "对密码进行哈希",
        "تجزئة كلمة المرور"
    ],
    "Verify Password": [
        "पासवर्ड सत्यापित करें",
        "Verificar contraseña",
        "Vérifier un mot de passe",
        "Passwort prüfen",
        "パスワードを照合",
        "验证密码",
        "التحقق من كلمة المرور"
    ],
    "Password": [
        "पासवर्ड",
        "Contraseña",
        "Mot de passe",
        "Passwort",
        "パスワード",
        "密码",
        "كلمة المرور"
    ],
    "Enter password to hash": [
        "हैश बनाने के लिए पासवर्ड दर्ज करें",
        "Introduce la contraseña para crear el hash",
        "Saisissez le mot de passe à hacher",
        "Zu hashendes Passwort eingeben",
        "ハッシュ化するパスワードを入力",
        "输入要哈希的密码",
        "أدخل كلمة المرور لتجزئتها"
    ],
    "Salt rounds": [
        "सॉल्ट राउंड",
        "Rondas de salt",
        "Coût du salage",
        "Salt-Runden",
        "ソルトラウンド",
        "加盐轮数",
        "جولات الملح"
    ],
    "(4–15; higher = slower & more secure)": [
        "(4–15; अधिक = धीमा और अधिक सुरक्षित)",
        "(4–15; más alto = más lento y seguro)",
        "(4–15 ; plus élevé = plus lent et plus sûr)",
        "(4–15; höher = langsamer und sicherer)",
        "（4–15。高いほど低速で安全）",
        "（4–15；越高越慢，安全性越高）",
        "(4–15؛ الأعلى أبطأ وأكثر أمانًا)"
    ],
    "Generate Hash": [
        "हैश बनाएँ",
        "Generar hash",
        "Générer le hachage",
        "Hash erzeugen",
        "ハッシュを生成",
        "生成哈希",
        "إنشاء التجزئة"
    ],
    "BCrypt Hash": [
        "BCrypt हैश",
        "Hash BCrypt",
        "Hachage BCrypt",
        "BCrypt-Hash",
        "BCryptハッシュ",
        "BCrypt 哈希",
        "تجزئة BCrypt"
    ],
    "BCrypt hash": [
        "BCrypt हैश",
        "Hash BCrypt",
        "Hachage BCrypt",
        "BCrypt-Hash",
        "BCryptハッシュ",
        "BCrypt 哈希",
        "تجزئة BCrypt"
    ],
    "Password to test": [
        "जाँचने का पासवर्ड",
        "Contraseña a comprobar",
        "Mot de passe à tester",
        "Zu prüfendes Passwort",
        "照合するパスワード",
        "待测试密码",
        "كلمة المرور للاختبار"
    ],
    "Candidate password": [
        "परीक्षण पासवर्ड",
        "Contraseña candidata",
        "Mot de passe candidat",
        "Passwortkandidat",
        "候補のパスワード",
        "候选密码",
        "كلمة المرور المرشحة"
    ],
    "Verify": [
        "सत्यापित करें",
        "Verificar",
        "Vérifier",
        "Prüfen",
        "照合",
        "验证",
        "تحقق"
    ],
    "Password matches the hash": [
        "पासवर्ड हैश से मेल खाता है",
        "La contraseña coincide con el hash",
        "Le mot de passe correspond au hachage",
        "Passwort stimmt mit dem Hash überein",
        "パスワードがハッシュと一致しました",
        "密码与哈希匹配",
        "كلمة المرور تطابق التجزئة"
    ],
    "Password does NOT match the hash": [
        "पासवर्ड हैश से मेल नहीं खाता",
        "La contraseña NO coincide con el hash",
        "Le mot de passe ne correspond PAS au hachage",
        "Passwort stimmt NICHT mit dem Hash überein",
        "パスワードがハッシュと一致しません",
        "密码与哈希不匹配",
        "كلمة المرور لا تطابق التجزئة"
    ],
    "Enter a password to hash": [
        "हैश बनाने के लिए पासवर्ड दर्ज करें",
        "Introduce una contraseña para generar el hash",
        "Saisissez un mot de passe à hacher",
        "Ein Passwort zum Hashen eingeben",
        "ハッシュ化するパスワードを入力してください",
        "请输入要哈希的密码",
        "أدخل كلمة مرور لتجزئتها"
    ],
    "Enter both a password and a BCrypt hash": [
        "पासवर्ड और BCrypt हैश दोनों दर्ज करें",
        "Introduce la contraseña y el hash BCrypt",
        "Saisissez le mot de passe et le hachage BCrypt",
        "Passwort und BCrypt-Hash eingeben",
        "パスワードとBCryptハッシュを両方入力してください",
        "请输入密码和 BCrypt 哈希",
        "أدخل كلمة المرور وتجزئة BCrypt معًا"
    ],
    "Hash generated": [
        "हैश बन गया",
        "Hash generado",
        "Hachage généré",
        "Hash erzeugt",
        "ハッシュを生成しました",
        "已生成哈希",
        "تم إنشاء التجزئة"
    ],
    "Encrypt": [
        "एन्क्रिप्ट करें",
        "Cifrar",
        "Chiffrer",
        "Verschlüsseln",
        "暗号化",
        "加密",
        "تشفير"
    ],
    "Decrypt": [
        "डिक्रिप्ट करें",
        "Descifrar",
        "Déchiffrer",
        "Entschlüsseln",
        "復号",
        "解密",
        "فك التشفير"
    ],
    "Use Output as Input": [
        "आउटपुट को इनपुट बनाएँ",
        "Usar salida como entrada",
        "Utiliser la sortie comme entrée",
        "Ausgabe als Eingabe verwenden",
        "出力を入力に使う",
        "将输出用作输入",
        "استخدام الإخراج كإدخال"
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
    "Passphrase": [
        "पासफ़्रेज़",
        "Frase de contraseña",
        "Phrase secrète",
        "Passphrase",
        "パスフレーズ",
        "口令",
        "عبارة المرور"
    ],
    "Enter passphrase used for key derivation": [
        "कुंजी व्युत्पत्ति के लिए पासफ़्रेज़ दर्ज करें",
        "Introduce la frase para derivar la clave",
        "Saisissez la phrase secrète de dérivation de clé",
        "Passphrase zur Schlüsselableitung eingeben",
        "鍵の導出に使うパスフレーズを入力",
        "输入用于派生密钥的口令",
        "أدخل عبارة المرور لاشتقاق المفتاح"
    ],
    "Plaintext": [
        "सादा टेक्स्ट",
        "Texto sin cifrar",
        "Texte en clair",
        "Klartext",
        "平文",
        "明文",
        "نص صريح"
    ],
    "Ciphertext (Base64)": [
        "सिफ़रटेक्स्ट (Base64)",
        "Texto cifrado (Base64)",
        "Texte chiffré (Base64)",
        "Geheimtext (Base64)",
        "暗号文（Base64）",
        "密文（Base64）",
        "نص مشفر (Base64)"
    ],
    "Text to encrypt": [
        "एन्क्रिप्ट करने का टेक्स्ट",
        "Texto para cifrar",
        "Texte à chiffrer",
        "Zu verschlüsselnder Text",
        "暗号化するテキスト",
        "要加密的文本",
        "النص المراد تشفيره"
    ],
    "Output will appear here": [
        "आउटपुट यहाँ दिखेगा",
        "La salida aparecerá aquí",
        "La sortie s’affichera ici",
        "Ausgabe erscheint hier",
        "ここに出力が表示されます",
        "输出将显示在此处",
        "سيظهر الإخراج هنا"
    ],
    "Enter a passphrase": [
        "पासफ़्रेज़ दर्ज करें",
        "Introduce una frase de contraseña",
        "Saisissez une phrase secrète",
        "Eine Passphrase eingeben",
        "パスフレーズを入力してください",
        "请输入口令",
        "أدخل عبارة مرور"
    ],
    "Enter text": [
        "टेक्स्ट दर्ज करें",
        "Introduce texto",
        "Saisissez du texte",
        "Text eingeben",
        "テキストを入力してください",
        "请输入文本",
        "أدخل نصًا"
    ],
    "Decryption failed — wrong passphrase or corrupted ciphertext": [
        "डिक्रिप्शन विफल — पासफ़्रेज़ गलत या सिफ़रटेक्स्ट खराब है",
        "Error al descifrar: frase incorrecta o texto cifrado dañado",
        "Échec du déchiffrement : phrase secrète incorrecte ou texte chiffré endommagé",
        "Entschlüsselung fehlgeschlagen — falsche Passphrase oder beschädigter Geheimtext",
        "復号に失敗しました。パスフレーズが違うか暗号文が破損しています",
        "解密失败：口令错误或密文已损坏",
        "فشل فك التشفير — عبارة مرور خاطئة أو نص مشفر تالف"
    ],
    "AES key size": [
        "AES कुंजी आकार",
        "Tamaño de clave AES",
        "Taille de clé AES",
        "AES-Schlüsselgröße",
        "AES鍵サイズ",
        "AES 密钥大小",
        "حجم مفتاح AES"
    ],
    "A hash maps text to a fixed-size digest. Identical text produces the same digest; hashing cannot recover the original text.": [
        "हैश टेक्स्ट को निश्चित आकार के डाइजेस्ट में बदलता है। समान टेक्स्ट का डाइजेस्ट समान होता है; हैश से मूल टेक्स्ट वापस नहीं मिलता।",
        "Un hash convierte texto en un resumen de tamaño fijo. El mismo texto produce el mismo resumen; el hash no recupera el original.",
        "Un hachage transforme le texte en une empreinte de taille fixe. Un texte identique donne la même empreinte ; le hachage ne restitue pas l’original.",
        "Ein Hash bildet Text auf eine Prüfsumme fester Länge ab. Gleicher Text ergibt denselben Hash; der Originaltext lässt sich daraus nicht wiederherstellen.",
        "ハッシュはテキストを固定長のダイジェストに変換します。同じテキストは同じ値になり、ハッシュから元のテキストには戻せません。",
        "哈希将文本映射为固定长度的摘要。相同文本得到相同摘要，无法通过哈希还原原文。",
        "تحوّل التجزئة النص إلى بصمة ثابتة الحجم. ينتج النص نفسه البصمة نفسها؛ ولا تستعيد التجزئة النص الأصلي."
    ],
    "Use digests to compare data, check known checksums or derive content-based identifiers. Plain hashes are not suitable for password storage.": [
        "डेटा तुलना, ज्ञात चेकसम जाँच या सामग्री-आधारित पहचान के लिए डाइजेस्ट उपयोग करें। साधारण हैश पासवर्ड रखने के लिए उपयुक्त नहीं हैं।",
        "Usa resúmenes para comparar datos, comprobar sumas conocidas o crear identificadores por contenido. Los hashes simples no sirven para almacenar contraseñas.",
        "Utilisez les empreintes pour comparer des données, vérifier des sommes connues ou identifier du contenu. Les hachages simples ne conviennent pas au stockage des mots de passe.",
        "Hashes dienen zum Datenvergleich, zur Prüfsummenkontrolle und für inhaltsbasierte Kennungen. Einfache Hashes eignen sich nicht zum Speichern von Passwörtern.",
        "データの比較、既知のチェックサムの照合、内容に基づく識別子に使えます。通常のハッシュはパスワード保存には適しません。",
        "使用摘要比较数据、检查已知校验和或生成基于内容的标识符。普通哈希不适合存储密码。",
        "استخدم البصمات لمقارنة البيانات وفحص المجاميع المعروفة أو إنشاء معرفات حسب المحتوى. التجزئات البسيطة غير مناسبة لتخزين كلمات المرور."
    ],
    "Enter text, generate hashes, then copy one digest or all results.": [
        "टेक्स्ट दर्ज करें, हैश बनाएँ, फिर एक डाइजेस्ट या सभी परिणाम कॉपी करें।",
        "Introduce texto, genera los hashes y copia un resumen o todos los resultados.",
        "Saisissez le texte, générez les hachages, puis copiez une empreinte ou tous les résultats.",
        "Text eingeben, Hashes erzeugen und einen Hash oder alle Ergebnisse kopieren.",
        "テキストを入力してハッシュを生成し、個別または全結果をコピーします。",
        "输入文本并生成哈希，然后复制单个摘要或所有结果。",
        "أدخل النص وأنشئ التجزئات ثم انسخ بصمة واحدة أو جميع النتائج."
    ],
    "Spaces, newlines and Unicode characters affect the exact bytes being hashed.": [
        "रिक्त स्थान, नई पंक्तियाँ और Unicode वर्ण हैश किए जाने वाले बाइट बदलते हैं।",
        "Los espacios, saltos de línea y caracteres Unicode afectan a los bytes que se procesan.",
        "Les espaces, retours à la ligne et caractères Unicode modifient les octets hachés.",
        "Leerzeichen, Zeilenumbrüche und Unicode-Zeichen beeinflussen die gehashten Bytes.",
        "空白、改行、Unicode文字はハッシュの対象バイトに影響します。",
        "空格、换行符和 Unicode 字符会影响参与哈希的确切字节。",
        "تؤثر المسافات والأسطر الجديدة ومحارف Unicode في البايتات التي تُجزّأ."
    ],
    "MD5 and SHA-1 are weak for collision resistance. Use a suitable modern algorithm for security-sensitive work.": [
        "टकराव प्रतिरोध के लिए MD5 और SHA-1 कमज़ोर हैं। सुरक्षा-संवेदनशील काम में उपयुक्त आधुनिक एल्गोरिदम चुनें।",
        "MD5 y SHA-1 tienen poca resistencia a colisiones. Usa un algoritmo moderno adecuado para tareas de seguridad.",
        "MD5 et SHA-1 résistent mal aux collisions. Choisissez un algorithme moderne adapté aux usages sensibles.",
        "MD5 und SHA-1 sind nicht kollisionssicher. Für sicherheitsrelevante Aufgaben einen geeigneten modernen Algorithmus wählen.",
        "MD5とSHA-1は衝突耐性が弱いため、セキュリティ用途には適した現代のアルゴリズムを選んでください。",
        "MD5 和 SHA-1 的抗碰撞能力较弱。安全敏感场景应选用合适的现代算法。",
        "مقاومة التصادم في MD5 وSHA-1 ضعيفة. استخدم خوارزمية حديثة مناسبة للأعمال الحساسة أمنيًا."
    ],
    "HMAC combines a secret key and a hash function to authenticate a message. A plain hash alone does not authenticate its sender.": [
        "HMAC संदेश प्रमाणीकरण के लिए गुप्त कुंजी और हैश फ़ंक्शन जोड़ता है। केवल साधारण हैश प्रेषक को प्रमाणित नहीं करता।",
        "HMAC combina una clave secreta y una función hash para autenticar un mensaje. Un hash simple no autentica al remitente.",
        "HMAC associe une clé secrète et une fonction de hachage pour authentifier un message. Un simple hachage n’authentifie pas l’expéditeur.",
        "HMAC kombiniert einen geheimen Schlüssel mit einer Hashfunktion zur Nachrichtenauthentifizierung. Ein einfacher Hash bestätigt den Absender nicht.",
        "HMACは秘密鍵とハッシュ関数を組み合わせてメッセージを認証します。通常のハッシュだけでは送信者を認証できません。",
        "HMAC 结合密钥和哈希函数认证消息。单纯的哈希无法认证发送者。",
        "يجمع HMAC مفتاحًا سريًا ودالة تجزئة لمصادقة الرسالة. التجزئة وحدها لا تصادق على المرسل."
    ],
    "Use HMAC for API request signing and webhook checks when both parties share a secret key.": [
        "दोनों पक्षों के पास साझा गुप्त कुंजी होने पर API अनुरोध हस्ताक्षर और Webhook जाँच में HMAC उपयोग करें।",
        "Usa HMAC para firmar peticiones API y comprobar webhooks cuando ambas partes comparten una clave secreta.",
        "Utilisez HMAC pour signer les requêtes API et vérifier les webhooks quand les deux parties partagent une clé secrète.",
        "HMAC signiert API-Anfragen und prüft Webhooks, wenn beide Seiten einen geheimen Schlüssel teilen.",
        "双方が秘密鍵を共有するAPIリクエスト署名やWebhookの確認にHMACを使います。",
        "当双方共享密钥时，可用 HMAC 签署 API 请求并检查 Webhook。",
        "استخدم HMAC لتوقيع طلبات API وفحص Webhook عندما يشترك الطرفان في مفتاح سري."
    ],
    "Enter a message and secret key, choose an algorithm and hex or Base64 output, then generate the signature.": [
        "संदेश और गुप्त कुंजी दर्ज करें, एल्गोरिदम तथा hex या Base64 आउटपुट चुनें, फिर हस्ताक्षर बनाएँ।",
        "Introduce el mensaje y la clave, elige el algoritmo y la salida hex o Base64, y genera la firma.",
        "Saisissez le message et la clé, choisissez l’algorithme et la sortie hex ou Base64, puis générez la signature.",
        "Nachricht und Schlüssel eingeben, Algorithmus und hex- oder Base64-Ausgabe wählen, dann die Signatur erzeugen.",
        "メッセージと秘密鍵を入力し、アルゴリズムとhexまたはBase64出力を選んで署名を生成します。",
        "输入消息和密钥，选择算法以及 hex 或 Base64 输出，然后生成签名。",
        "أدخل الرسالة والمفتاح واختر الخوارزمية وإخراج hex أو Base64 ثم أنشئ التوقيع."
    ],
    "The random-key button generates 32 random bytes and displays them as Base64 text. That text is used as the secret key; it is not Base64-decoded.": [
        "यादृच्छिक कुंजी बटन 32 यादृच्छिक बाइट बनाकर Base64 टेक्स्ट दिखाता है। वही टेक्स्ट गुप्त कुंजी है; उसे Base64 से डिकोड नहीं किया जाता।",
        "El botón genera 32 bytes aleatorios y los muestra como texto Base64. Ese texto se usa como clave; no se decodifica de Base64.",
        "Le bouton génère 32 octets aléatoires affichés en Base64. Ce texte sert de clé secrète ; il n’est pas décodé en Base64.",
        "Die Schaltfläche erzeugt 32 Zufallsbytes als Base64-Text. Dieser Text wird als Schlüssel verwendet und nicht Base64-dekodiert.",
        "ランダム鍵ボタンは32バイトの乱数をBase64テキストで表示します。このテキストを秘密鍵として使い、Base64デコードはしません。",
        "随机密钥按钮生成 32 个随机字节并显示为 Base64 文本。该文本直接作为密钥使用，不进行 Base64 解码。",
        "ينشئ الزر 32 بايتًا عشوائيًا ويعرضها كنص Base64. يُستخدم النص نفسه مفتاحًا سريًا دون فك ترميز Base64."
    ],
    "Keep keys confidential and use SHA-256 or stronger for new integrations. Match the other system’s exact message bytes and encoding.": [
        "कुंजियाँ गोपनीय रखें और नए एकीकरण में SHA-256 या अधिक मज़बूत विकल्प लें। दूसरे सिस्टम के संदेश बाइट और एन्कोडिंग सटीक मिलाएँ।",
        "Mantén las claves privadas y usa SHA-256 o superior en nuevas integraciones. Respeta los bytes y la codificación exactos del otro sistema.",
        "Gardez les clés secrètes et utilisez SHA-256 ou plus pour les nouvelles intégrations. Respectez exactement les octets et l’encodage de l’autre système.",
        "Schlüssel geheim halten und für neue Integrationen SHA-256 oder stärker verwenden. Nachrichtenbytes und Kodierung des anderen Systems exakt übernehmen.",
        "鍵を秘密に保ち、新規連携にはSHA-256以上を使います。相手側のメッセージのバイト列とエンコードを正確に合わせてください。",
        "请保密密钥，新集成使用 SHA-256 或更强算法。消息字节与编码必须和对方系统完全一致。",
        "حافظ على سرية المفاتيح واستخدم SHA-256 أو أقوى للتكاملات الجديدة. طابق بايتات الرسالة وترميزها مع النظام الآخر بدقة."
    ],
    "BCrypt hashes passwords with a random salt and an adjustable cost. The resulting hash contains the salt and cost needed for verification.": [
        "BCrypt यादृच्छिक सॉल्ट और समायोज्य लागत से पासवर्ड हैश करता है। परिणाम में सत्यापन हेतु सॉल्ट और लागत दोनों होते हैं।",
        "BCrypt aplica un salt aleatorio y un coste ajustable a las contraseñas. El hash contiene el salt y el coste para verificarlo.",
        "BCrypt hache les mots de passe avec un sel aléatoire et un coût réglable. Le résultat contient le sel et le coût nécessaires à la vérification.",
        "BCrypt hasht Passwörter mit zufälligem Salt und einstellbaren Kosten. Der Hash enthält Salt und Kosten für die Prüfung.",
        "BCryptはランダムなソルトと調整可能なコストでパスワードをハッシュ化し、照合に必要なソルトとコストを結果に含めます。",
        "BCrypt 使用随机盐和可调成本对密码进行哈希。生成的哈希包含验证所需的盐和成本。",
        "يجزّئ BCrypt كلمات المرور بملح عشوائي وكلفة قابلة للضبط. تحتوي التجزئة على الملح والكلفة اللازمين للتحقق."
    ],
    "Generate development test hashes or check a candidate password against an existing BCrypt hash.": [
        "विकास के लिए परीक्षण हैश बनाएँ या मौजूदा BCrypt हैश से पासवर्ड जाँचें।",
        "Genera hashes de prueba para desarrollo o comprueba una contraseña con un hash BCrypt existente.",
        "Générez des hachages de test ou comparez un mot de passe à un hachage BCrypt existant.",
        "Testhashes für die Entwicklung erzeugen oder ein Passwort gegen einen vorhandenen BCrypt-Hash prüfen.",
        "開発用のテストハッシュを生成したり、既存のBCryptハッシュと候補パスワードを照合したりできます。",
        "生成开发测试哈希，或将候选密码与现有 BCrypt 哈希进行比对。",
        "أنشئ تجزئات اختبار للتطوير أو افحص كلمة مرور مرشحة مقابل تجزئة BCrypt موجودة."
    ],
    "On the Hash tab, enter a password and choose 4–15 salt rounds, then generate. On the Verify tab, enter both the hash and candidate password.": [
        "हैश टैब में पासवर्ड और 4–15 सॉल्ट राउंड चुनकर बनाएँ। सत्यापन टैब में हैश और परीक्षण पासवर्ड दोनों दर्ज करें।",
        "En la pestaña de hash, introduce la contraseña y elige 4–15 rondas; genera el hash. Para verificar, introduce el hash y la contraseña candidata.",
        "Dans l’onglet de hachage, saisissez un mot de passe et choisissez 4–15 tours, puis générez. Pour vérifier, saisissez le hachage et le mot de passe candidat.",
        "Im Hash-Tab Passwort eingeben und 4–15 Salt-Runden wählen, dann erzeugen. Im Prüf-Tab Hash und Passwortkandidaten eingeben.",
        "ハッシュタブでパスワードと4–15のソルトラウンドを指定して生成します。照合タブではハッシュと候補パスワードを入力します。",
        "在哈希选项卡输入密码并选择 4–15 轮，然后生成。在验证选项卡输入哈希及候选密码。",
        "أدخل كلمة مرور واختر 4–15 جولة في تبويب التجزئة ثم أنشئها. وفي تبويب التحقق أدخل التجزئة وكلمة المرور المرشحة."
    ],
    "Each generation uses a new random salt, so matching passwords produce different hashes. Verify with BCrypt comparison, not string equality.": [
        "हर निर्माण में नया यादृच्छिक सॉल्ट होता है, इसलिए समान पासवर्ड के हैश अलग होते हैं। स्ट्रिंग समानता की जगह BCrypt तुलना करें।",
        "Cada generación usa un salt aleatorio nuevo, así que la misma contraseña produce hashes distintos. Verifica mediante BCrypt, no comparando cadenas.",
        "Chaque génération utilise un nouveau sel aléatoire ; un même mot de passe donne donc des hachages différents. Vérifiez avec BCrypt, pas par égalité de chaînes.",
        "Jede Erzeugung nutzt einen neuen zufälligen Salt; gleiche Passwörter ergeben unterschiedliche Hashes. Mit BCrypt vergleichen, nicht per Zeichenkettenvergleich.",
        "生成ごとに新しいランダムソルトを使うため、同じパスワードでも異なるハッシュになります。文字列の一致ではなくBCryptで照合してください。",
        "每次生成都会使用新的随机盐，因此相同密码产生不同哈希。应使用 BCrypt 比对，而非比较字符串是否相等。",
        "يستخدم كل إنشاء ملحًا عشوائيًا جديدًا، لذا تنتج كلمات المرور المتطابقة تجزئات مختلفة. تحقّق بمقارنة BCrypt لا بمساواة النصوص."
    ],
    "Each additional round doubles the work. BCrypt uses at most 72 UTF-8 bytes of the password; longer inputs are truncated by this implementation.": [
        "हर अतिरिक्त राउंड काम दोगुना करता है। BCrypt पासवर्ड के अधिकतम 72 UTF-8 बाइट लेता है; यह कार्यान्वयन लंबे इनपुट काटता है।",
        "Cada ronda adicional duplica el trabajo. BCrypt usa como máximo 72 bytes UTF-8; esta implementación trunca las contraseñas más largas.",
        "Chaque tour supplémentaire double le travail. BCrypt utilise au plus 72 octets UTF-8 du mot de passe ; cette implémentation tronque les entrées plus longues.",
        "Jede zusätzliche Runde verdoppelt die Arbeit. BCrypt nutzt höchstens 72 UTF-8-Bytes des Passworts; diese Implementierung kürzt längere Eingaben.",
        "ラウンドを1増やすと処理量は2倍になります。BCryptはパスワードの最大72 UTF-8バイトを使い、この実装はそれ以上を切り捨てます。",
        "每增加一轮，计算量翻倍。BCrypt 最多使用密码的 72 个 UTF-8 字节；此实现会截断更长的输入。",
        "كل جولة إضافية تضاعف العمل. يستخدم BCrypt حتى 72 بايت UTF-8 من كلمة المرور؛ ويقتطع هذا التنفيذ المدخلات الأطول."
    ],
    "This tool preserves CryptoJS passphrase AES-CBC with PKCS7 padding and the salted OpenSSL Base64 format. It uses legacy EVP key derivation (MD5, 1 iteration), not PBKDF2.": [
        "यह टूल CryptoJS पासफ़्रेज़ AES-CBC, PKCS7 पैडिंग और सॉल्ट वाला OpenSSL Base64 प्रारूप रखता है। इसमें पुराना EVP कुंजी व्युत्पत्ति (MD5, 1 पुनरावृत्ति) है, PBKDF2 नहीं।",
        "Esta herramienta conserva AES-CBC con frase de CryptoJS, relleno PKCS7 y formato OpenSSL Base64 con salt. Usa derivación EVP antigua (MD5, 1 iteración), no PBKDF2.",
        "Cet outil conserve AES-CBC avec phrase secrète CryptoJS, remplissage PKCS7 et format OpenSSL Base64 salé. Il utilise l’ancienne dérivation EVP (MD5, 1 itération), pas PBKDF2.",
        "Dieses Werkzeug behält CryptoJS AES-CBC mit Passphrase, PKCS7-Padding und gesalzenem OpenSSL-Base64-Format bei. Es nutzt die alte EVP-Schlüsselableitung (MD5, 1 Iteration), nicht PBKDF2.",
        "CryptoJSのパスフレーズAES-CBC、PKCS7パディング、ソルト付きOpenSSL Base64形式を維持しています。鍵導出は旧式のEVP（MD5、1回）で、PBKDF2ではありません。",
        "本工具保留 CryptoJS 口令式 AES-CBC、PKCS7 填充及带盐的 OpenSSL Base64 格式。它使用旧式 EVP 密钥派生（MD5、1 次迭代），而非 PBKDF2。",
        "تحافظ الأداة على AES-CBC بعبارة مرور CryptoJS وحشو PKCS7 وتنسيق OpenSSL Base64 المملّح. تستخدم اشتقاق EVP القديم (MD5، تكرار واحد)، وليس PBKDF2."
    ],
    "Use this existing format for development and compatibility checks. It provides no authentication tag and is not a modern authenticated-encryption design.": [
        "यह मौजूदा प्रारूप विकास और संगतता जाँच के लिए उपयोग करें। इसमें प्रमाणीकरण टैग नहीं है और यह आधुनिक प्रमाणित एन्क्रिप्शन डिज़ाइन नहीं है।",
        "Usa este formato existente para desarrollo y compatibilidad. No incluye etiqueta de autenticación ni es un diseño moderno de cifrado autenticado.",
        "Utilisez ce format existant pour le développement et les tests de compatibilité. Il n’a pas de balise d’authentification et n’est pas un chiffrement authentifié moderne.",
        "Dieses bestehende Format dient Entwicklung und Kompatibilitätsprüfungen. Es bietet keinen Authentifizierungstag und ist kein modernes authentifiziertes Verschlüsselungsverfahren.",
        "既存形式の開発・互換性確認に使います。認証タグはなく、現代的な認証付き暗号方式ではありません。",
        "该现有格式适用于开发和兼容性检查。它没有认证标签，也不是现代认证加密设计。",
        "استخدم التنسيق الحالي للتطوير وفحص التوافق. لا يوفر وسم مصادقة وليس تصميم تشفير موثّقًا حديثًا."
    ],
    "Choose Encrypt or Decrypt, enter the passphrase and text, then run the action. Decryption needs the same passphrase and compatible format.": [
        "एन्क्रिप्ट या डिक्रिप्ट चुनें, पासफ़्रेज़ और टेक्स्ट दर्ज करें, फिर कार्रवाई चलाएँ। डिक्रिप्शन के लिए वही पासफ़्रेज़ और संगत प्रारूप चाहिए।",
        "Elige cifrar o descifrar, introduce la frase y el texto, y ejecuta la acción. Para descifrar necesitas la misma frase y un formato compatible.",
        "Choisissez chiffrer ou déchiffrer, saisissez la phrase secrète et le texte, puis lancez l’action. Le déchiffrement exige la même phrase et un format compatible.",
        "Ver- oder Entschlüsseln wählen, Passphrase und Text eingeben, dann ausführen. Zum Entschlüsseln sind dieselbe Passphrase und ein kompatibles Format nötig.",
        "暗号化または復号を選び、パスフレーズとテキストを入力して実行します。復号には同じパスフレーズと互換形式が必要です。",
        "选择加密或解密，输入口令和文本，然后执行。解密需要相同的口令及兼容格式。",
        "اختر التشفير أو فكه وأدخل عبارة المرور والنص ثم نفّذ الإجراء. يتطلب فك التشفير العبارة نفسها وتنسيقًا متوافقًا."
    ],
    "The compatibility format always uses AES-256-CBC. Previous 128/192 selections also produced 256-bit keys; existing ciphertext still decrypts with the same passphrase.": [
        "संगतता प्रारूप हमेशा AES-256-CBC उपयोग करता है। पुराने 128/192 विकल्प भी 256-बिट कुंजी बनाते थे; मौजूदा सिफ़रटेक्स्ट उसी पासफ़्रेज़ से खुलता है।",
        "El formato compatible siempre usa AES-256-CBC. Las opciones anteriores 128/192 también producían claves de 256 bits; el texto cifrado existente se descifra con la misma frase.",
        "Le format compatible utilise toujours AES-256-CBC. Les anciens choix 128/192 produisaient aussi des clés de 256 bits ; les textes existants se déchiffrent avec la même phrase secrète.",
        "Das Kompatibilitätsformat nutzt immer AES-256-CBC. Auch die bisherigen Optionen 128/192 erzeugten 256-Bit-Schlüssel; bestehende Geheimtexte lassen sich mit derselben Passphrase entschlüsseln.",
        "互換形式は常にAES-256-CBCを使用します。以前の128/192の選択でも256ビット鍵が生成されていたため、既存の暗号文は同じパスフレーズで復号できます。",
        "兼容格式始终使用 AES-256-CBC。以前的 128/192 选项也生成 256 位密钥；现有密文仍可使用相同口令解密。",
        "يستخدم تنسيق التوافق دائمًا AES-256-CBC. كانت خيارات 128/192 السابقة تنتج أيضًا مفاتيح 256 بت؛ ويمكن فك النصوص السابقة بعبارة المرور نفسها."
    ],
    "Decryption completed": ["डिक्रिप्शन पूरा हुआ", "Descifrado completado", "Déchiffrement terminé", "Entschlüsselung abgeschlossen", "復号が完了しました", "解密完成", "اكتمل فك التشفير"],
    "Fixed compatibility format": ["निश्चित संगतता प्रारूप", "Formato de compatibilidad fijo", "Format de compatibilité fixe", "Festes Kompatibilitätsformat", "固定の互換形式", "固定兼容格式", "تنسيق توافق ثابت"],
    "Legacy compatibility only": ["केवल पुराने प्रारूपों की संगतता", "Solo compatibilidad heredada", "Compatibilité avec l’ancien format uniquement", "Nur für Altformat-Kompatibilität", "旧形式との互換性専用", "仅用于旧格式兼容", "للتوافق مع التنسيق القديم فقط"],
    "No authentication tag: a successful decryption does not prove the passphrase or ciphertext is correct. Use for existing CryptoJS data and compatibility checks.": [
        "प्रमाणीकरण टैग नहीं है: सफल डिक्रिप्शन सही पासफ़्रेज़ या सिफ़रटेक्स्ट का प्रमाण नहीं है। मौजूदा CryptoJS डेटा और संगतता जाँच के लिए उपयोग करें।",
        "Sin etiqueta de autenticación: descifrar con éxito no prueba que la frase ni el texto cifrado sean correctos. Úsalo con datos CryptoJS existentes y para comprobar compatibilidad.",
        "Sans balise d’authentification : un déchiffrement réussi ne prouve pas que la phrase secrète ou le texte chiffré est correct. À utiliser pour les données CryptoJS existantes et les tests de compatibilité.",
        "Ohne Authentifizierungstag: Erfolgreiches Entschlüsseln beweist nicht, dass Passphrase oder Geheimtext korrekt sind. Für vorhandene CryptoJS-Daten und Kompatibilitätsprüfungen verwenden.",
        "認証タグがないため、復号に成功してもパスフレーズや暗号文が正しいとは証明できません。既存のCryptoJSデータと互換性の確認に使用してください。",
        "没有认证标签：成功解密并不能证明口令或密文正确。用于现有 CryptoJS 数据和兼容性检查。",
        "لا توجد علامة مصادقة: نجاح فك التشفير لا يثبت صحة عبارة المرور أو النص المشفر. استخدمه لبيانات CryptoJS الحالية واختبارات التوافق."
    ],
    "Encryption uses a new random salt and derives the IV. Repeated encryption differs. Match the cipher, KDF, digest, padding and format in other tools.": [
        "एन्क्रिप्शन नया यादृच्छिक सॉल्ट लेता है और IV निकालता है। बार-बार एन्क्रिप्ट करने पर परिणाम अलग होते हैं। दूसरे टूल में cipher, KDF, digest, padding और प्रारूप मिलाएँ।",
        "El cifrado usa un salt aleatorio nuevo y deriva el IV. Repetirlo da resultados distintos. Iguala cifrado, KDF, resumen, relleno y formato en otras herramientas.",
        "Le chiffrement utilise un nouveau sel aléatoire et dérive l’IV. Le résultat change à chaque fois. Faites correspondre chiffrement, KDF, empreinte, remplissage et format dans les autres outils.",
        "Die Verschlüsselung nutzt einen neuen zufälligen Salt und leitet den IV ab. Wiederholungen liefern andere Ergebnisse. In anderen Werkzeugen Chiffre, KDF, Digest, Padding und Format abstimmen.",
        "暗号化は新しいランダムソルトを使い、IVを導出するため、毎回結果が変わります。他のツールでは暗号、KDF、ダイジェスト、パディング、形式を合わせてください。",
        "加密使用新的随机盐并派生 IV，因此重复加密的结果不同。与其他工具互操作时须匹配密码算法、KDF、摘要、填充和格式。",
        "يستخدم التشفير ملحًا عشوائيًا جديدًا ويشتق IV فتختلف النتيجة عند التكرار. طابق الخوارزمية وKDF والبصمة والحشو والتنسيق في الأدوات الأخرى."
    ],
    "A wrong passphrase or modified ciphertext is not reliably detected without authentication. Check expected content separately.": [
        "प्रमाणीकरण के बिना गलत पासफ़्रेज़ या बदला सिफ़रटेक्स्ट भरोसेमंद ढंग से नहीं पकड़ा जाता। अपेक्षित सामग्री अलग से जाँचें।",
        "Sin autenticación no se detectan de forma fiable las frases incorrectas ni los cambios del texto cifrado. Comprueba el contenido esperado por separado.",
        "Sans authentification, une phrase incorrecte ou un texte chiffré modifié n’est pas détecté de façon fiable. Vérifiez séparément le contenu attendu.",
        "Ohne Authentifizierung werden falsche Passphrasen oder veränderte Geheimtexte nicht zuverlässig erkannt. Erwarteten Inhalt gesondert prüfen.",
        "認証がないため、誤ったパスフレーズや暗号文の改ざんを確実には検出できません。期待する内容を別途確認してください。",
        "没有认证时，无法可靠检测错误口令或被修改的密文。请单独检查预期内容。",
        "لا يمكن كشف عبارة المرور الخاطئة أو النص المشفر المعدّل بصورة موثوقة دون مصادقة. تحقّق من المحتوى المتوقع بشكل منفصل."
    ],
    "Generate MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, Keccak (CryptoJS SHA3), RIPEMD-160 hashes": [
        "MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, Keccak (CryptoJS SHA3), RIPEMD-160 हैश बनाएँ",
        "Genera hashes MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, Keccak (CryptoJS SHA3) y RIPEMD-160",
        "Générez des hachages MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, Keccak (CryptoJS SHA3) et RIPEMD-160",
        "Hashes mit MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, Keccak (CryptoJS SHA3) und RIPEMD-160 erzeugen",
        "MD5、SHA-1、SHA-224、SHA-256、SHA-384、SHA-512、Keccak (CryptoJS SHA3)、RIPEMD-160のハッシュを生成",
        "生成 MD5、SHA-1、SHA-224、SHA-256、SHA-384、SHA-512、Keccak (CryptoJS SHA3)、RIPEMD-160 哈希",
        "أنشئ تجزئات MD5 وSHA-1 وSHA-224 وSHA-256 وSHA-384 وSHA-512 وKeccak (CryptoJS SHA3) وRIPEMD-160"
    ],
    "The Keccak entries use CryptoJS SHA3 and differ from standardized SHA-3.": [
        "Keccak प्रविष्टियाँ CryptoJS SHA3 उपयोग करती हैं और मानक SHA-3 से अलग हैं।",
        "Las opciones Keccak usan CryptoJS SHA3 y difieren del SHA-3 estandarizado.",
        "Les entrées Keccak utilisent CryptoJS SHA3 et diffèrent du SHA-3 normalisé.",
        "Die Keccak-Einträge verwenden CryptoJS SHA3 und unterscheiden sich vom standardisierten SHA-3.",
        "Keccak項目はCryptoJS SHA3を使用しており、標準のSHA-3とは異なります。",
        "Keccak 选项使用 CryptoJS SHA3，与标准 SHA-3 不同。",
        "تستخدم خيارات Keccak ‏CryptoJS SHA3 وتختلف عن SHA-3 المعياري."
    ]
};

export const CRYPTO_UTILITY_HELP = {
    "hash-generator": {
        "whatIs": "A hash maps text to a fixed-size digest. Identical text produces the same digest; hashing cannot recover the original text.",
        "whyUse": "Use digests to compare data, check known checksums or derive content-based identifiers. Plain hashes are not suitable for password storage.",
        "howToUse": [
            "Enter text, generate hashes, then copy one digest or all results."
        ],
        "tips": [
            "Spaces, newlines and Unicode characters affect the exact bytes being hashed.",
            "MD5 and SHA-1 are weak for collision resistance. Use a suitable modern algorithm for security-sensitive work.",
            "The Keccak entries use CryptoJS SHA3 and differ from standardized SHA-3."
        ],
        "useCases": [
            "Data integrity checks"
        ]
    },
    "hmac-generator": {
        "whatIs": "HMAC combines a secret key and a hash function to authenticate a message. A plain hash alone does not authenticate its sender.",
        "whyUse": "Use HMAC for API request signing and webhook checks when both parties share a secret key.",
        "howToUse": [
            "Enter a message and secret key, choose an algorithm and hex or Base64 output, then generate the signature."
        ],
        "tips": [
            "The random-key button generates 32 random bytes and displays them as Base64 text. That text is used as the secret key; it is not Base64-decoded.",
            "Keep keys confidential and use SHA-256 or stronger for new integrations. Match the other system’s exact message bytes and encoding."
        ],
        "useCases": [
            "API authentication signatures",
            "Webhook payload verification",
            "Session token validation"
        ]
    },
    "bcrypt-tool": {
        "whatIs": "BCrypt hashes passwords with a random salt and an adjustable cost. The resulting hash contains the salt and cost needed for verification.",
        "whyUse": "Generate development test hashes or check a candidate password against an existing BCrypt hash.",
        "howToUse": [
            "On the Hash tab, enter a password and choose 4–15 salt rounds, then generate. On the Verify tab, enter both the hash and candidate password."
        ],
        "tips": [
            "Each generation uses a new random salt, so matching passwords produce different hashes. Verify with BCrypt comparison, not string equality.",
            "Each additional round doubles the work. BCrypt uses at most 72 UTF-8 bytes of the password; longer inputs are truncated by this implementation."
        ],
        "useCases": [
            "Generate development test hashes or check a candidate password against an existing BCrypt hash."
        ]
    },
    "aes-tool": {
        "whatIs": "This tool preserves CryptoJS passphrase AES-CBC with PKCS7 padding and the salted OpenSSL Base64 format. It uses legacy EVP key derivation (MD5, 1 iteration), not PBKDF2.",
        "whyUse": "Use this existing format for development and compatibility checks. It provides no authentication tag and is not a modern authenticated-encryption design.",
        "howToUse": [
            "Choose Encrypt or Decrypt, enter the passphrase and text, then run the action. Decryption needs the same passphrase and compatible format."
        ],
        "tips": [
            "The compatibility format always uses AES-256-CBC. Previous 128/192 selections also produced 256-bit keys; existing ciphertext still decrypts with the same passphrase.",
            "Encryption uses a new random salt and derives the IV. Repeated encryption differs. Match the cipher, KDF, digest, padding and format in other tools.",
            "A wrong passphrase or modified ciphertext is not reliably detected without authentication. Check expected content separately."
        ],
        "useCases": [
            "Use this existing format for development and compatibility checks. It provides no authentication tag and is not a modern authenticated-encryption design."
        ]
    }
};
