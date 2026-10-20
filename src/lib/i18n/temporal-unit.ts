import type { TranslationColumns } from "./tool-names";

// Human-facing copy only. Engine category names, symbols and protocol values remain unchanged.
export const TEMPORAL_UNIT_TRANSLATIONS: Record<string, TranslationColumns> = {
    "TOTP Generator": [
        "TOTP जनरेटर",
        "Generador TOTP",
        "Générateur TOTP",
        "TOTP-Generator",
        "TOTP生成",
        "TOTP 生成器",
        "مولّد TOTP"
    ],
    "Generate RFC 6238 authenticator codes locally for MFA testing": [
        "MFA परीक्षण के लिए RFC 6238 प्रमाणक कोड स्थानीय रूप से बनाएँ",
        "Genera códigos de autenticación RFC 6238 localmente para probar MFA",
        "Générez localement des codes d’authentification RFC 6238 pour tester la MFA",
        "RFC-6238-Authentifizierungscodes lokal für MFA-Tests erzeugen",
        "MFAテスト用のRFC 6238認証コードをローカルで生成",
        "在本地生成 RFC 6238 验证码，用于 MFA 测试",
        "أنشئ رموز مصادقة RFC 6238 محليًا لاختبار MFA"
    ],
    "Base32 authenticator secret": [
        "Base32 प्रमाणक गुप्त कुंजी",
        "Secreto Base32 del autenticador",
        "Secret Base32 de l’authentificateur",
        "Base32-Geheimnis des Authentifikators",
        "認証用Base32シークレット",
        "Base32 验证器密钥",
        "سرّ المصادقة بصيغة Base32"
    ],
    "HMAC algorithm": [
        "HMAC एल्गोरिदम",
        "Algoritmo HMAC",
        "Algorithme HMAC",
        "HMAC-Algorithmus",
        "HMACアルゴリズム",
        "HMAC 算法",
        "خوارزمية HMAC"
    ],
    "Digits": [
        "अंक",
        "Dígitos",
        "Chiffres",
        "Ziffern",
        "桁数",
        "位数",
        "عدد الأرقام"
    ],
    "Time step in seconds": [
        "समय चरण सेकंड में",
        "Intervalo en segundos",
        "Intervalle en secondes",
        "Zeitschritt in Sekunden",
        "時間ステップ（秒）",
        "时间步长（秒）",
        "الخطوة الزمنية بالثواني"
    ],
    "Use the current device time": [
        "डिवाइस का वर्तमान समय उपयोग करें",
        "Usar la hora actual del dispositivo",
        "Utiliser l’heure actuelle de l’appareil",
        "Aktuelle Gerätezeit verwenden",
        "端末の現在時刻を使用",
        "使用设备当前时间",
        "استخدام الوقت الحالي للجهاز"
    ],
    "Unix timestamp in seconds": [
        "Unix टाइमस्टैम्प सेकंड में",
        "Marca de tiempo Unix en segundos",
        "Horodatage Unix en secondes",
        "Unix-Zeitstempel in Sekunden",
        "Unixタイムスタンプ（秒）",
        "Unix 时间戳（秒）",
        "طابع Unix الزمني بالثواني"
    ],
    "Authenticator code": [
        "प्रमाणक कोड",
        "Código de autenticación",
        "Code d’authentification",
        "Authentifizierungscode",
        "認証コード",
        "验证码",
        "رمز المصادقة"
    ],
    "{seconds} seconds until the next code · counter {counter}": [
        "अगले कोड तक {seconds} सेकंड · काउंटर {counter}",
        "{seconds} segundos hasta el siguiente código · contador {counter}",
        "Prochain code dans {seconds} secondes · compteur {counter}",
        "Nächster Code in {seconds} Sekunden · Zähler {counter}",
        "次のコードまで{seconds}秒 · カウンター {counter}",
        "距下一个验证码 {seconds} 秒 · 计数器 {counter}",
        "{seconds} ثانية حتى الرمز التالي · العدّاد {counter}"
    ],
    "Enter a Base32 secret to generate a code.": [
        "कोड बनाने के लिए Base32 गुप्त कुंजी दर्ज करें।",
        "Introduce un secreto Base32 para generar un código.",
        "Saisissez un secret Base32 pour générer un code.",
        "Base32-Geheimnis eingeben, um einen Code zu erzeugen.",
        "Base32シークレットを入力するとコードが生成されます。",
        "输入 Base32 密钥以生成验证码。",
        "أدخل سرًا بصيغة Base32 لإنشاء رمز."
    ],
    "Copy code": [
        "कोड कॉपी करें",
        "Copiar código",
        "Copier le code",
        "Code kopieren",
        "コードをコピー",
        "复制验证码",
        "نسخ الرمز"
    ],
    "Clear secret": [
        "गुप्त कुंजी मिटाएँ",
        "Borrar secreto",
        "Effacer le secret",
        "Geheimnis löschen",
        "シークレットを消去",
        "清除密钥",
        "مسح السر"
    ],
    "Load public RFC test fixture": [
        "सार्वजनिक RFC परीक्षण उदाहरण लोड करें",
        "Cargar ejemplo público de prueba RFC",
        "Charger l’exemple de test public RFC",
        "Öffentliches RFC-Testbeispiel laden",
        "公開RFCテストデータを読み込む",
        "加载公开 RFC 测试数据",
        "تحميل بيانات اختبار RFC العامة"
    ],
    "Secrets are not saved or sent. The default is SHA-1, six digits and 30 seconds. Your authenticator and server must use the same parameters and synchronized clocks. The public fixture should produce 94287082.": [
        "गुप्त कुंजियाँ सहेजी या भेजी नहीं जातीं। डिफ़ॉल्ट SHA-1, छह अंक और 30 सेकंड है। प्रमाणक और सर्वर के पैरामीटर समान और घड़ियाँ समकालिक होनी चाहिए। सार्वजनिक उदाहरण का परिणाम 94287082 होना चाहिए।",
        "Los secretos no se guardan ni se envían. El valor predeterminado es SHA-1, seis dígitos y 30 segundos. El autenticador y el servidor deben usar los mismos parámetros y relojes sincronizados. El ejemplo público debe producir 94287082.",
        "Les secrets ne sont ni enregistrés ni envoyés. Par défaut : SHA-1, six chiffres et 30 secondes. L’authentificateur et le serveur doivent partager les mêmes paramètres et des horloges synchronisées. L’exemple public doit produire 94287082.",
        "Geheimnisse werden weder gespeichert noch gesendet. Standard: SHA-1, sechs Ziffern und 30 Sekunden. Authentifikator und Server benötigen dieselben Parameter und synchronisierte Uhren. Das öffentliche Beispiel sollte 94287082 ergeben.",
        "シークレットは保存・送信されません。既定値はSHA-1、6桁、30秒です。認証アプリとサーバーでは同じ設定と同期された時計が必要です。公開テストデータの結果は94287082です。",
        "密钥不会被保存或发送。默认使用 SHA-1、六位数字和 30 秒周期。验证器与服务器必须使用相同参数并同步时钟。公开测试数据应生成 94287082。",
        "لا تُحفظ الأسرار ولا تُرسل. الإعداد الافتراضي هو SHA-1 وستة أرقام و30 ثانية. يجب أن يستخدم المُصادق والخادم المعلمات نفسها وساعات متزامنة. ينبغي أن تنتج بيانات الاختبار العامة 94287082."
    ],
    "RFC 6238 and test vectors": [
        "RFC 6238 और परीक्षण वेक्टर",
        "RFC 6238 y vectores de prueba",
        "RFC 6238 et vecteurs de test",
        "RFC 6238 und Testvektoren",
        "RFC 6238とテストベクトル",
        "RFC 6238 和测试向量",
        "RFC 6238 ومتجهات الاختبار"
    ],
    "Enter a Base32 secret using A–Z and 2–7, with optional trailing padding.": [
        "A–Z और 2–7 से बनी Base32 गुप्त कुंजी दर्ज करें; अंत में पैडिंग वैकल्पिक है।",
        "Introduce un secreto Base32 con A–Z y 2–7 y relleno final opcional.",
        "Saisissez un secret Base32 avec A–Z et 2–7 et un remplissage final facultatif.",
        "Base32-Geheimnis aus A–Z und 2–7 eingeben, optional mit abschließender Auffüllung.",
        "A–Zと2–7のBase32シークレットを入力してください。末尾のパディングは任意です。",
        "输入由 A–Z 和 2–7 组成的 Base32 密钥，可带末尾填充。",
        "أدخل سرًا بصيغة Base32 باستخدام A–Z و2–7، مع حشو اختياري في النهاية."
    ],
    "The Base32 secret has invalid length or padding.": [
        "Base32 गुप्त कुंजी की लंबाई या पैडिंग अमान्य है।",
        "La longitud o el relleno del secreto Base32 no es válido.",
        "La longueur ou le remplissage du secret Base32 est incorrect.",
        "Länge oder Auffüllung des Base32-Geheimnisses ist ungültig.",
        "Base32シークレットの長さまたはパディングが無効です。",
        "Base32 密钥的长度或填充无效。",
        "طول سر Base32 أو حشوه غير صالح."
    ],
    "The Base32 secret has nonzero padding bits.": [
        "Base32 गुप्त कुंजी के पैडिंग बिट शून्य नहीं हैं।",
        "El secreto Base32 contiene bits de relleno distintos de cero.",
        "Les bits de remplissage du secret Base32 ne sont pas nuls.",
        "Das Base32-Geheimnis enthält Auffüllbits ungleich null.",
        "Base32シークレットのパディングビットがゼロではありません。",
        "Base32 密钥的填充位不为零。",
        "يحتوي سر Base32 على بتات حشو غير صفرية."
    ],
    "Use a nonnegative Unix timestamp, a 1–3600 second period and 6 or 8 digits.": [
        "गैर-ऋणात्मक Unix टाइमस्टैम्प, 1–3600 सेकंड की अवधि और 6 या 8 अंक उपयोग करें।",
        "Usa una marca Unix no negativa, un período de 1–3600 segundos y 6 u 8 dígitos.",
        "Utilisez un horodatage Unix positif ou nul, une période de 1–3600 secondes et 6 ou 8 chiffres.",
        "Nichtnegativen Unix-Zeitstempel, einen Zeitraum von 1–3600 Sekunden und 6 oder 8 Ziffern verwenden.",
        "0以上のUnixタイムスタンプ、1–3600秒の周期、6桁または8桁を指定してください。",
        "请使用非负 Unix 时间戳、1–3600 秒周期及 6 或 8 位数字。",
        "استخدم طابع Unix غير سالب وفترة من 1–3600 ثانية و6 أو 8 أرقام."
    ],
    "Timezone Planner": [
        "समयक्षेत्र योजनाकार",
        "Planificador de zonas horarias",
        "Planificateur de fuseaux horaires",
        "Zeitzonenplaner",
        "タイムゾーンプランナー",
        "时区规划器",
        "مخطط المناطق الزمنية"
    ],
    "Compare a meeting time across IANA timezones, daylight-saving changes and working hours": [
        "IANA समयक्षेत्रों, डेलाइट सेविंग और कार्य घंटों में बैठक समय की तुलना करें",
        "Compara reuniones entre zonas IANA, cambios de horario y horas laborables",
        "Comparez une réunion entre fuseaux IANA, changements d’heure et horaires de travail",
        "Besprechungszeiten über IANA-Zeitzonen, Zeitumstellungen und Arbeitszeiten vergleichen",
        "IANAタイムゾーン、夏時間の変更、勤務時間を考慮して会議時刻を比較",
        "比较 IANA 时区、夏令时变化及工作时间中的会议时刻",
        "قارن وقت الاجتماع عبر مناطق IANA وتغييرات التوقيت الصيفي وساعات العمل"
    ],
    "Reference date and time": [
        "संदर्भ तारीख और समय",
        "Fecha y hora de referencia",
        "Date et heure de référence",
        "Bezugsdatum und -zeit",
        "基準日時",
        "参考日期和时间",
        "التاريخ والوقت المرجعيان"
    ],
    "Reference timezone": [
        "संदर्भ समयक्षेत्र",
        "Zona horaria de referencia",
        "Fuseau horaire de référence",
        "Bezugszeitzone",
        "基準タイムゾーン",
        "参考时区",
        "المنطقة الزمنية المرجعية"
    ],
    "When clocks repeat a time": [
        "घड़ी में समय दोहराने पर",
        "Cuando se repite una hora",
        "Lorsqu’une heure se répète",
        "Wenn eine Uhrzeit doppelt vorkommt",
        "同じ時刻が繰り返される場合",
        "时钟重复某一时刻时",
        "عند تكرار وقت بسبب تغيير الساعة"
    ],
    "Ask me to choose": [
        "मुझसे विकल्प पूछें",
        "Pedir que elija",
        "Me demander de choisir",
        "Auswahl verlangen",
        "選択を求める",
        "让我选择",
        "اطلب مني الاختيار"
    ],
    "Earlier occurrence": [
        "पहली घटना",
        "Primera ocurrencia",
        "Première occurrence",
        "Früheres Vorkommen",
        "先の時刻",
        "较早的一次",
        "التكرار الأسبق"
    ],
    "Later occurrence": [
        "बाद की घटना",
        "Segunda ocurrencia",
        "Seconde occurrence",
        "Späteres Vorkommen",
        "後の時刻",
        "较晚的一次",
        "التكرار الأحدث"
    ],
    "Add timezone": [
        "समयक्षेत्र जोड़ें",
        "Añadir zona horaria",
        "Ajouter un fuseau",
        "Zeitzone hinzufügen",
        "タイムゾーンを追加",
        "添加时区",
        "إضافة منطقة زمنية"
    ],
    "Working hours start": [
        "कार्य समय की शुरुआत",
        "Inicio del horario laboral",
        "Début des heures de travail",
        "Beginn der Arbeitszeit",
        "勤務開始時刻",
        "工作开始时间",
        "بداية ساعات العمل"
    ],
    "Working hours end": [
        "कार्य समय का अंत",
        "Fin del horario laboral",
        "Fin des heures de travail",
        "Ende der Arbeitszeit",
        "勤務終了時刻",
        "工作结束时间",
        "نهاية ساعات العمل"
    ],
    "Add comparison timezone": [
        "तुलना समयक्षेत्र जोड़ें",
        "Añadir zona para comparar",
        "Ajouter un fuseau à comparer",
        "Vergleichszeitzone hinzufügen",
        "比較するタイムゾーンを追加",
        "添加比较时区",
        "إضافة منطقة زمنية للمقارنة"
    ],
    "Move meeting one hour later": [
        "बैठक एक घंटा बाद करें",
        "Retrasar la reunión una hora",
        "Décaler la réunion d’une heure",
        "Besprechung eine Stunde später legen",
        "会議を1時間後に移動",
        "将会议推迟一小时",
        "تأخير الاجتماع ساعة واحدة"
    ],
    "Copy comparison": [
        "तुलना कॉपी करें",
        "Copiar comparación",
        "Copier la comparaison",
        "Vergleich kopieren",
        "比較をコピー",
        "复制比较结果",
        "نسخ المقارنة"
    ],
    "Timezone": [
        "समयक्षेत्र",
        "Zona horaria",
        "Fuseau horaire",
        "Zeitzone",
        "タイムゾーン",
        "时区",
        "المنطقة الزمنية"
    ],
    "Date": [
        "तारीख",
        "Fecha",
        "Date",
        "Datum",
        "日付",
        "日期",
        "التاريخ"
    ],
    "Time": [
        "समय",
        "Hora",
        "Heure",
        "Zeit",
        "時刻",
        "时间",
        "الوقت"
    ],
    "UTC offset": [
        "UTC अंतर",
        "Desfase UTC",
        "Décalage UTC",
        "UTC-Abweichung",
        "UTCオフセット",
        "UTC 偏移量",
        "فرق UTC"
    ],
    "Day shift": [
        "दिन का अंतर",
        "Cambio de día",
        "Décalage de jour",
        "Tagesverschiebung",
        "日付の差",
        "日期偏移",
        "فرق الأيام"
    ],
    "Working hours": [
        "कार्य समय",
        "Horario laboral",
        "Heures de travail",
        "Arbeitszeit",
        "勤務時間",
        "工作时间",
        "ساعات العمل"
    ],
    "Outside working hours": [
        "कार्य समय से बाहर",
        "Fuera del horario laboral",
        "Hors des heures de travail",
        "Außerhalb der Arbeitszeit",
        "勤務時間外",
        "非工作时间",
        "خارج ساعات العمل"
    ],
    "Action": [
        "कार्रवाई",
        "Acción",
        "Action",
        "Aktion",
        "操作",
        "操作",
        "الإجراء"
    ],
    "Within hours": [
        "कार्य समय के भीतर",
        "Dentro del horario",
        "Dans les horaires",
        "Innerhalb der Arbeitszeit",
        "勤務時間内",
        "工作时间内",
        "ضمن ساعات العمل"
    ],
    "Outside hours / weekend": [
        "कार्य समय से बाहर / सप्ताहांत",
        "Fuera del horario / fin de semana",
        "Hors horaires / week-end",
        "Außerhalb / Wochenende",
        "勤務時間外／週末",
        "非工作时间／周末",
        "خارج الساعات / عطلة نهاية الأسبوع"
    ],
    "Remove {zone}": [
        "{zone} हटाएँ",
        "Eliminar {zone}",
        "Retirer {zone}",
        "{zone} entfernen",
        "{zone}を削除",
        "移除 {zone}",
        "إزالة {zone}"
    ],
    "UTC instant:": [
        "UTC समय:",
        "Instante UTC:",
        "Instant UTC :",
        "UTC-Zeitpunkt:",
        "UTC時刻：",
        "UTC 时刻：",
        "لحظة UTC:"
    ],
    "Working-hour indicators assume Monday–Friday and do not include holidays. Clock changes use this browser’s timezone database; rules may differ across devices until their databases update. Nonexistent local times are rejected rather than silently shifted.": [
        "कार्य समय के संकेत सोमवार–शुक्रवार मानते हैं और छुट्टियाँ शामिल नहीं करते। घड़ी में बदलाव इस ब्राउज़र के समयक्षेत्र डेटाबेस पर आधारित हैं; अपडेट होने तक डिवाइसों के नियम भिन्न हो सकते हैं। अस्तित्वहीन स्थानीय समय चुपचाप बदलने के बजाय अस्वीकार होते हैं।",
        "Los indicadores laborales suponen lunes–viernes y no incluyen festivos. Los cambios de hora usan la base de zonas del navegador; las reglas pueden variar entre dispositivos hasta actualizarse. Se rechazan las horas locales inexistentes.",
        "Les indicateurs supposent lundi–vendredi, sans jours fériés. Les changements d’heure utilisent la base du navigateur ; les règles peuvent varier selon les mises à jour des appareils. Les heures locales inexistantes sont refusées.",
        "Arbeitszeiten gelten für Montag–Freitag ohne Feiertage. Zeitumstellungen verwenden die Zeitzonendatenbank des Browsers; bis zur Aktualisierung können Regeln je nach Gerät abweichen. Nicht vorhandene Ortszeiten werden abgelehnt.",
        "勤務時間は月〜金を前提とし、祝日は考慮しません。時計の変更にはブラウザーのタイムゾーンデータベースを使用するため、更新状況により端末間で規則が異なる場合があります。存在しない現地時刻は自動でずらさず拒否します。",
        "工作时间标识假定周一至周五，不包含节假日。时钟变化使用浏览器的时区数据库；数据库更新前，各设备规则可能不同。不存在的本地时间会被拒绝，不会被静默调整。",
        "تفترض مؤشرات العمل أيام الاثنين–الجمعة ولا تشمل العطلات. تستخدم تغييرات الساعة قاعدة المناطق الزمنية للمتصفح؛ وقد تختلف القواعد بين الأجهزة حتى تحديث قواعدها. تُرفض الأوقات المحلية غير الموجودة بدلًا من نقلها بصمت."
    ],
    "Choose a date and time in YYYY-MM-DDTHH:mm format.": [
        "YYYY-MM-DDTHH:mm प्रारूप में तारीख और समय चुनें।",
        "Elige fecha y hora en formato YYYY-MM-DDTHH:mm.",
        "Choisissez une date et une heure au format YYYY-MM-DDTHH:mm.",
        "Datum und Uhrzeit im Format YYYY-MM-DDTHH:mm wählen.",
        "YYYY-MM-DDTHH:mm形式で日時を選択してください。",
        "请选择 YYYY-MM-DDTHH:mm 格式的日期和时间。",
        "اختر تاريخًا ووقتًا بتنسيق YYYY-MM-DDTHH:mm."
    ],
    "Choose a valid date from 1970 through 2100.": [
        "1970 से 2100 के बीच वैध तारीख चुनें।",
        "Elige una fecha válida entre 1970 y 2100.",
        "Choisissez une date valide entre 1970 et 2100.",
        "Gültiges Datum von 1970 bis 2100 wählen.",
        "1970年から2100年までの有効な日付を選択してください。",
        "请选择 1970 至 2100 年间的有效日期。",
        "اختر تاريخًا صالحًا من 1970 إلى 2100."
    ],
    "This local time does not exist because the timezone's clock moves forward. Choose another time.": [
        "घड़ी आगे बढ़ने से यह स्थानीय समय अस्तित्व में नहीं है। दूसरा समय चुनें।",
        "Esta hora local no existe por el adelanto del reloj. Elige otra hora.",
        "Cette heure locale n’existe pas car l’horloge avance. Choisissez une autre heure.",
        "Diese Ortszeit existiert wegen der Zeitumstellung nach vorn nicht. Andere Uhrzeit wählen.",
        "時計が進むため、この現地時刻は存在しません。別の時刻を選択してください。",
        "时钟向前调整导致此本地时间不存在。请选择其他时间。",
        "هذا الوقت المحلي غير موجود بسبب تقديم الساعة. اختر وقتًا آخر."
    ],
    "This local time occurs twice when the clock moves back. Choose the earlier or later occurrence.": [
        "घड़ी पीछे होने पर यह समय दो बार आता है। पहली या बाद की घटना चुनें।",
        "Esta hora local ocurre dos veces al atrasar el reloj. Elige la primera o la segunda.",
        "Cette heure se répète lors du recul de l’horloge. Choisissez la première ou la seconde occurrence.",
        "Diese Ortszeit kommt bei der Rückstellung zweimal vor. Früheres oder späteres Vorkommen wählen.",
        "時計が戻る際、この時刻は2回現れます。先か後の時刻を選択してください。",
        "时钟回拨时此本地时间会出现两次。请选择较早或较晚的一次。",
        "يتكرر هذا الوقت المحلي عند تأخير الساعة. اختر التكرار الأسبق أو الأحدث."
    ],
    "Choose a valid IANA timezone.": [
        "वैध IANA समयक्षेत्र चुनें।",
        "Elige una zona horaria IANA válida.",
        "Choisissez un fuseau horaire IANA valide.",
        "Gültige IANA-Zeitzone wählen.",
        "有効なIANAタイムゾーンを選択してください。",
        "请选择有效的 IANA 时区。",
        "اختر منطقة زمنية صالحة من IANA."
    ],
    "Scientific Unit Converter": [
        "वैज्ञानिक इकाई परिवर्तक",
        "Conversor de unidades científicas",
        "Convertisseur d’unités scientifiques",
        "Wissenschaftlicher Einheitenumrechner",
        "科学単位変換",
        "科学单位转换器",
        "محوّل الوحدات العلمية"
    ],
    "Convert physical, electrical, thermal and engineering quantities with explicit unit definitions": [
        "स्पष्ट इकाई परिभाषाओं के साथ भौतिक, विद्युत, तापीय और इंजीनियरिंग राशियाँ बदलें",
        "Convierte magnitudes físicas, eléctricas, térmicas y de ingeniería con unidades definidas",
        "Convertissez les grandeurs physiques, électriques, thermiques et techniques avec des unités explicites",
        "Physikalische, elektrische, thermische und technische Größen mit eindeutigen Einheitendefinitionen umrechnen",
        "単位の定義を明示して物理・電気・熱・工学量を変換",
        "使用明确的单位定义转换物理、电气、热学和工程量",
        "حوّل الكميات الفيزيائية والكهربائية والحرارية والهندسية بتعريفات وحدات واضحة"
    ],
    "Quantity category": [
        "राशि की श्रेणी",
        "Categoría de magnitud",
        "Catégorie de grandeur",
        "Größenkategorie",
        "物理量の分類",
        "物理量类别",
        "فئة الكمية"
    ],
    "Value": [
        "मान",
        "Valor",
        "Valeur",
        "Wert",
        "値",
        "数值",
        "القيمة"
    ],
    "From unit": [
        "मूल इकाई",
        "Unidad de origen",
        "Unité source",
        "Ausgangseinheit",
        "変換元の単位",
        "原单位",
        "الوحدة المصدر"
    ],
    "To unit": [
        "लक्ष्य इकाई",
        "Unidad de destino",
        "Unité cible",
        "Zieleinheit",
        "変換先の単位",
        "目标单位",
        "الوحدة الهدف"
    ],
    "Significant digits": [
        "सार्थक अंक",
        "Cifras significativas",
        "Chiffres significatifs",
        "Signifikante Stellen",
        "有効桁数",
        "有效数字",
        "الأرقام المعنوية"
    ],
    "Copy conversion": [
        "परिवर्तन कॉपी करें",
        "Copiar conversión",
        "Copier la conversion",
        "Umrechnung kopieren",
        "変換結果をコピー",
        "复制转换结果",
        "نسخ التحويل"
    ],
    "Swap units": [
        "इकाइयाँ बदलें",
        "Intercambiar unidades",
        "Inverser les unités",
        "Einheiten tauschen",
        "単位を入れ替える",
        "交换单位",
        "تبديل الوحدات"
    ],
    "Unit": [
        "इकाई",
        "Unidad",
        "Unité",
        "Einheit",
        "単位",
        "单位",
        "الوحدة"
    ],
    "Converted value": [
        "परिवर्तित मान",
        "Valor convertido",
        "Valeur convertie",
        "Umgerechneter Wert",
        "変換後の値",
        "转换后的值",
        "القيمة المحوّلة"
    ],
    "{count} quantity categories. US liquid and imperial volume units are labeled separately; calories are thermochemical and BTUs use the International Table definition. Temperature conversions are absolute temperatures, not temperature differences. Calculations use floating-point arithmetic and the selected display precision.": [
        "{count} राशि श्रेणियाँ। अमेरिकी तरल और इम्पीरियल आयतन इकाइयों के नाम अलग हैं; कैलोरी तापरासायनिक और BTU International Table परिभाषा के हैं। तापमान परिवर्तन निरपेक्ष तापमान के हैं, अंतर के नहीं। गणना फ़्लोटिंग-पॉइंट अंकगणित और चुनी गई प्रदर्शन सटीकता से होती है।",
        "{count} categorías de magnitud. El volumen líquido estadounidense y el imperial se etiquetan por separado; las calorías son termoquímicas y los BTU usan International Table. Las temperaturas son absolutas, no diferencias. Se usa coma flotante y la precisión elegida.",
        "{count} catégories de grandeurs. Les volumes liquides américains et impériaux sont distingués ; les calories sont thermochimiques et les BTU suivent International Table. Les températures sont absolues, non des écarts. Calculs en virgule flottante avec la précision choisie.",
        "{count} Größenkategorien. US-Flüssigkeits- und imperiale Volumeneinheiten sind getrennt bezeichnet; Kalorien sind thermochemisch und BTU folgen International Table. Temperaturen sind absolut, keine Differenzen. Berechnung mit Gleitkommaarithmetik und gewählter Anzeigegenauigkeit.",
        "{count}種類の物理量に対応。米液量単位と英単位は区別して表示します。カロリーは熱化学、BTUはInternational Tableの定義を使用します。温度変換は温度差ではなく絶対温度です。計算には浮動小数点演算と選択した表示精度を使用します。",
        "共 {count} 类物理量。美制液量和英制体积单位分别标注；卡路里使用热化学定义，BTU 使用 International Table 定义。温度转换为绝对温度，而非温差。计算使用浮点运算及所选显示精度。",
        "{count} فئة من الكميات. تُسمّى وحدات الحجم السائل الأمريكية والإمبراطورية بشكل منفصل؛ السعرات حرارية كيميائية وتستخدم BTU تعريف International Table. تحويلات الحرارة مطلقة وليست فروقًا. تستخدم الحسابات الفاصلة العائمة ودقة العرض المختارة."
    ],
    "NIST guide to SI units": [
        "SI इकाइयों के लिए NIST मार्गदर्शिका",
        "Guía NIST de unidades SI",
        "Guide NIST des unités SI",
        "NIST-Leitfaden zu SI-Einheiten",
        "NISTのSI単位ガイド",
        "NIST 国际单位制指南",
        "دليل NIST لوحدات SI"
    ],
    "Enter a decimal number, optionally using scientific notation.": [
        "दशमलव संख्या दर्ज करें; वैज्ञानिक संकेतन वैकल्पिक है।",
        "Introduce un decimal, opcionalmente en notación científica.",
        "Saisissez un nombre décimal, éventuellement en notation scientifique.",
        "Dezimalzahl eingeben, optional in wissenschaftlicher Schreibweise.",
        "小数を入力してください。科学表記も使用できます。",
        "请输入十进制数，可使用科学记数法。",
        "أدخل عددًا عشريًا، ويمكن استخدام الصيغة العلمية."
    ],
    "Choose units in one category and enter a finite number.": [
        "एक श्रेणी की इकाइयाँ चुनें और सीमित संख्या दर्ज करें।",
        "Elige unidades de una categoría e introduce un número finito.",
        "Choisissez des unités d’une même catégorie et un nombre fini.",
        "Einheiten einer Kategorie wählen und eine endliche Zahl eingeben.",
        "同じ分類の単位を選び、有限の数値を入力してください。",
        "请选择同一类别中的单位，并输入有限数值。",
        "اختر وحدات من فئة واحدة وأدخل عددًا محدودًا."
    ],
    "Absolute temperature cannot be below zero kelvin.": [
        "निरपेक्ष तापमान शून्य केल्विन से कम नहीं हो सकता।",
        "La temperatura absoluta no puede ser inferior a cero kelvin.",
        "La température absolue ne peut pas être inférieure à zéro kelvin.",
        "Die absolute Temperatur darf nicht unter null Kelvin liegen.",
        "絶対温度は0ケルビン未満にはできません。",
        "绝对温度不能低于零开尔文。",
        "لا يمكن أن تقل درجة الحرارة المطلقة عن صفر كلفن."
    ],
    "The converted value exceeds numeric range.": [
        "परिवर्तित मान संख्यात्मक सीमा से बाहर है।",
        "El valor convertido excede el rango numérico.",
        "La valeur convertie dépasse la plage numérique.",
        "Der umgerechnete Wert überschreitet den Zahlenbereich.",
        "変換後の値が数値の範囲を超えています。",
        "转换后的值超出数值范围。",
        "تتجاوز القيمة المحوّلة النطاق العددي."
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
    "Mass": [
        "द्रव्यमान",
        "Masa",
        "Masse",
        "Masse",
        "質量",
        "质量",
        "الكتلة"
    ],
    "Temperature": [
        "तापमान",
        "Temperatura",
        "Température",
        "Temperatur",
        "温度",
        "温度",
        "درجة الحرارة"
    ],
    "Area": [
        "क्षेत्रफल",
        "Área",
        "Aire",
        "Fläche",
        "面積",
        "面积",
        "المساحة"
    ],
    "Volume": [
        "आयतन",
        "Volumen",
        "Volume",
        "Volumen",
        "体積",
        "体积",
        "الحجم"
    ],
    "Speed": [
        "चाल",
        "Velocidad",
        "Vitesse",
        "Geschwindigkeit",
        "速さ",
        "速度",
        "السرعة"
    ],
    "Acceleration": [
        "त्वरण",
        "Aceleración",
        "Accélération",
        "Beschleunigung",
        "加速度",
        "加速度",
        "التسارع"
    ],
    "Force": [
        "बल",
        "Fuerza",
        "Force",
        "Kraft",
        "力",
        "力",
        "القوة"
    ],
    "Pressure": [
        "दाब",
        "Presión",
        "Pression",
        "Druck",
        "圧力",
        "压强",
        "الضغط"
    ],
    "Energy": [
        "ऊर्जा",
        "Energía",
        "Énergie",
        "Energie",
        "エネルギー",
        "能量",
        "الطاقة"
    ],
    "Power": [
        "शक्ति",
        "Potencia",
        "Puissance",
        "Leistung",
        "仕事率",
        "功率",
        "القدرة"
    ],
    "Frequency": [
        "आवृत्ति",
        "Frecuencia",
        "Fréquence",
        "Frequenz",
        "周波数",
        "频率",
        "التردد"
    ],
    "Angle": [
        "कोण",
        "Ángulo",
        "Angle",
        "Winkel",
        "角度",
        "角度",
        "الزاوية"
    ],
    "Torque": [
        "बलाघूर्ण",
        "Par de torsión",
        "Couple",
        "Drehmoment",
        "トルク",
        "转矩",
        "عزم الدوران"
    ],
    "Density": [
        "घनत्व",
        "Densidad",
        "Masse volumique",
        "Dichte",
        "密度",
        "密度",
        "الكثافة"
    ],
    "Dynamic viscosity": [
        "गतिशील श्यानता",
        "Viscosidad dinámica",
        "Viscosité dynamique",
        "Dynamische Viskosität",
        "粘度",
        "动力黏度",
        "اللزوجة الديناميكية"
    ],
    "Kinematic viscosity": [
        "शुद्धगतिक श्यानता",
        "Viscosidad cinemática",
        "Viscosité cinématique",
        "Kinematische Viskosität",
        "動粘度",
        "运动黏度",
        "اللزوجة الحركية"
    ],
    "Electric current": [
        "विद्युत धारा",
        "Corriente eléctrica",
        "Courant électrique",
        "Elektrische Stromstärke",
        "電流",
        "电流",
        "التيار الكهربائي"
    ],
    "Voltage": [
        "वोल्टता",
        "Tensión eléctrica",
        "Tension électrique",
        "Spannung",
        "電圧",
        "电压",
        "الجهد"
    ],
    "Resistance": [
        "प्रतिरोध",
        "Resistencia",
        "Résistance",
        "Widerstand",
        "電気抵抗",
        "电阻",
        "المقاومة"
    ],
    "Capacitance": [
        "धारिता",
        "Capacitancia",
        "Capacité électrique",
        "Kapazität",
        "静電容量",
        "电容",
        "السعة الكهربائية"
    ],
    "Inductance": [
        "प्रेरकत्व",
        "Inductancia",
        "Inductance",
        "Induktivität",
        "インダクタンス",
        "电感",
        "المحاثة"
    ],
    "Electric charge": [
        "विद्युत आवेश",
        "Carga eléctrica",
        "Charge électrique",
        "Elektrische Ladung",
        "電荷",
        "电荷",
        "الشحنة الكهربائية"
    ],
    "Conductance": [
        "चालकता",
        "Conductancia",
        "Conductance",
        "Leitwert",
        "コンダクタンス",
        "电导",
        "المواصلة الكهربائية"
    ],
    "Magnetic flux": [
        "चुंबकीय फ्लक्स",
        "Flujo magnético",
        "Flux magnétique",
        "Magnetischer Fluss",
        "磁束",
        "磁通量",
        "التدفق المغناطيسي"
    ],
    "Magnetic flux density": [
        "चुंबकीय फ्लक्स घनत्व",
        "Densidad de flujo magnético",
        "Densité de flux magnétique",
        "Magnetische Flussdichte",
        "磁束密度",
        "磁通密度",
        "كثافة التدفق المغناطيسي"
    ],
    "Illuminance": [
        "प्रदीप्ति",
        "Iluminancia",
        "Éclairement lumineux",
        "Beleuchtungsstärke",
        "照度",
        "照度",
        "الاستضاءة"
    ],
    "Data size": [
        "डेटा आकार",
        "Tamaño de datos",
        "Taille des données",
        "Datengröße",
        "データ量",
        "数据大小",
        "حجم البيانات"
    ],
    "Data rate": [
        "डेटा दर",
        "Tasa de datos",
        "Débit de données",
        "Datenrate",
        "データ転送速度",
        "数据速率",
        "معدل البيانات"
    ],
    "Volume flow": [
        "आयतन प्रवाह",
        "Caudal volumétrico",
        "Débit volumique",
        "Volumenstrom",
        "体積流量",
        "体积流量",
        "التدفق الحجمي"
    ],
    "Thermal conductivity": [
        "ऊष्मीय चालकता",
        "Conductividad térmica",
        "Conductivité thermique",
        "Wärmeleitfähigkeit",
        "熱伝導率",
        "热导率",
        "الموصلية الحرارية"
    ],
    "Specific heat capacity": [
        "विशिष्ट ऊष्मा धारिता",
        "Capacidad calorífica específica",
        "Capacité thermique massique",
        "Spezifische Wärmekapazität",
        "比熱容量",
        "比热容",
        "السعة الحرارية النوعية"
    ],
    "Surface tension": [
        "पृष्ठ तनाव",
        "Tensión superficial",
        "Tension superficielle",
        "Oberflächenspannung",
        "表面張力",
        "表面张力",
        "التوتر السطحي"
    ],
    "Metre": [
        "मीटर",
        "Metro",
        "Mètre",
        "Meter",
        "メートル",
        "米",
        "متر"
    ],
    "Millimetre": [
        "मिलीमीटर",
        "Milímetro",
        "Millimètre",
        "Millimeter",
        "ミリメートル",
        "毫米",
        "مليمتر"
    ],
    "Centimetre": [
        "सेंटीमीटर",
        "Centímetro",
        "Centimètre",
        "Zentimeter",
        "センチメートル",
        "厘米",
        "سنتيمتر"
    ],
    "Kilometre": [
        "किलोमीटर",
        "Kilómetro",
        "Kilomètre",
        "Kilometer",
        "キロメートル",
        "千米",
        "كيلومتر"
    ],
    "Micrometre": [
        "माइक्रोमीटर",
        "Micrómetro",
        "Micromètre",
        "Mikrometer",
        "マイクロメートル",
        "微米",
        "ميكرومتر"
    ],
    "Nanometre": [
        "नैनोमीटर",
        "Nanómetro",
        "Nanomètre",
        "Nanometer",
        "ナノメートル",
        "纳米",
        "نانومتر"
    ],
    "Inch": [
        "इंच",
        "Pulgada",
        "Pouce",
        "Zoll",
        "インチ",
        "英寸",
        "بوصة"
    ],
    "International foot": [
        "अंतरराष्ट्रीय फुट",
        "Pie internacional",
        "Pied international",
        "Internationaler Fuß",
        "国際フィート",
        "国际英尺",
        "قدم دولية"
    ],
    "Yard": [
        "गज",
        "Yarda",
        "Yard",
        "Yard",
        "ヤード",
        "码",
        "ياردة"
    ],
    "International mile": [
        "अंतरराष्ट्रीय मील",
        "Milla internacional",
        "Mille international",
        "Internationale Meile",
        "国際マイル",
        "国际英里",
        "ميل دولي"
    ],
    "Nautical mile": [
        "समुद्री मील",
        "Milla náutica",
        "Mille marin",
        "Seemeile",
        "海里",
        "海里",
        "ميل بحري"
    ],
    "Kilogram": [
        "किलोग्राम",
        "Kilogramo",
        "Kilogramme",
        "Kilogramm",
        "キログラム",
        "千克",
        "كيلوغرام"
    ],
    "Gram": [
        "ग्राम",
        "Gramo",
        "Gramme",
        "Gramm",
        "グラム",
        "克",
        "غرام"
    ],
    "Milligram": [
        "मिलीग्राम",
        "Miligramo",
        "Milligramme",
        "Milligramm",
        "ミリグラム",
        "毫克",
        "مليغرام"
    ],
    "Microgram": [
        "माइक्रोग्राम",
        "Microgramo",
        "Microgramme",
        "Mikrogramm",
        "マイクログラム",
        "微克",
        "ميكروغرام"
    ],
    "Metric tonne": [
        "मीट्रिक टन",
        "Tonelada métrica",
        "Tonne métrique",
        "Metrische Tonne",
        "メートルトン",
        "公吨",
        "طن متري"
    ],
    "Avoirdupois pound": [
        "एवॉयरडुपोइस पाउंड",
        "Libra avoirdupois",
        "Livre avoirdupois",
        "Avoirdupois-Pfund",
        "常用ポンド",
        "常衡磅",
        "رطل أفواردوبوا"
    ],
    "Avoirdupois ounce": [
        "एवॉयरडुपोइस औंस",
        "Onza avoirdupois",
        "Once avoirdupois",
        "Avoirdupois-Unze",
        "常用オンス",
        "常衡盎司",
        "أونصة أفواردوبوا"
    ],
    "Stone": [
        "स्टोन",
        "Stone",
        "Stone",
        "Stone",
        "ストーン",
        "英石",
        "ستون"
    ],
    "US short ton": [
        "अमेरिकी लघु टन",
        "Tonelada corta estadounidense",
        "Tonne courte américaine",
        "US-Kurztonne",
        "米ショートトン",
        "美制短吨",
        "طن أمريكي قصير"
    ],
    "Imperial long ton": [
        "इम्पीरियल दीर्घ टन",
        "Tonelada larga imperial",
        "Tonne longue impériale",
        "Imperiale Langtonne",
        "英ロングトン",
        "英制长吨",
        "طن إمبراطوري طويل"
    ],
    "Kelvin": [
        "केल्विन",
        "Kelvin",
        "Kelvin",
        "Kelvin",
        "ケルビン",
        "开尔文",
        "كلفن"
    ],
    "Celsius": [
        "सेल्सियस",
        "Celsius",
        "Celsius",
        "Celsius",
        "セルシウス",
        "摄氏度",
        "سيلسيوس"
    ],
    "Fahrenheit": [
        "फ़ारेनहाइट",
        "Fahrenheit",
        "Fahrenheit",
        "Fahrenheit",
        "ファーレンハイト",
        "华氏度",
        "فهرنهايت"
    ],
    "Rankine": [
        "रैंकिन",
        "Rankine",
        "Rankine",
        "Rankine",
        "ランキン",
        "兰金",
        "رانكين"
    ],
    "Second": [
        "सेकंड",
        "Segundo",
        "Seconde",
        "Sekunde",
        "秒",
        "秒",
        "ثانية"
    ],
    "Millisecond": [
        "मिलीसेकंड",
        "Milisegundo",
        "Milliseconde",
        "Millisekunde",
        "ミリ秒",
        "毫秒",
        "مللي ثانية"
    ],
    "Microsecond": [
        "माइक्रोसेकंड",
        "Microsegundo",
        "Microseconde",
        "Mikrosekunde",
        "マイクロ秒",
        "微秒",
        "ميكروثانية"
    ],
    "Nanosecond": [
        "नैनोसेकंड",
        "Nanosegundo",
        "Nanoseconde",
        "Nanosekunde",
        "ナノ秒",
        "纳秒",
        "نانوثانية"
    ],
    "Minute": [
        "मिनट",
        "Minuto",
        "Minute",
        "Minute",
        "分",
        "分钟",
        "دقيقة"
    ],
    "Hour": [
        "घंटा",
        "Hora",
        "Heure",
        "Stunde",
        "時間",
        "小时",
        "ساعة"
    ],
    "Day (24 hours)": [
        "दिन (24 घंटे)",
        "Día (24 horas)",
        "Jour (24 heures)",
        "Tag (24 Stunden)",
        "日（24時間）",
        "天（24 小时）",
        "يوم (24 ساعة)"
    ],
    "Week": [
        "सप्ताह",
        "Semana",
        "Semaine",
        "Woche",
        "週",
        "周",
        "أسبوع"
    ],
    "Square metre": [
        "वर्ग मीटर",
        "Metro cuadrado",
        "Mètre carré",
        "Quadratmeter",
        "平方メートル",
        "平方米",
        "متر مربع"
    ],
    "Square millimetre": [
        "वर्ग मिलीमीटर",
        "Milímetro cuadrado",
        "Millimètre carré",
        "Quadratmillimeter",
        "平方ミリメートル",
        "平方毫米",
        "مليمتر مربع"
    ],
    "Square centimetre": [
        "वर्ग सेंटीमीटर",
        "Centímetro cuadrado",
        "Centimètre carré",
        "Quadratzentimeter",
        "平方センチメートル",
        "平方厘米",
        "سنتيمتر مربع"
    ],
    "Square kilometre": [
        "वर्ग किलोमीटर",
        "Kilómetro cuadrado",
        "Kilomètre carré",
        "Quadratkilometer",
        "平方キロメートル",
        "平方千米",
        "كيلومتر مربع"
    ],
    "Hectare": [
        "हेक्टेयर",
        "Hectárea",
        "Hectare",
        "Hektar",
        "ヘクタール",
        "公顷",
        "هكتار"
    ],
    "International acre": [
        "अंतरराष्ट्रीय एकड़",
        "Acre internacional",
        "Acre international",
        "Internationaler Acre",
        "国際エーカー",
        "国际英亩",
        "أكر دولي"
    ],
    "Square foot": [
        "वर्ग फुट",
        "Pie cuadrado",
        "Pied carré",
        "Quadratfuß",
        "平方フィート",
        "平方英尺",
        "قدم مربعة"
    ],
    "Square inch": [
        "वर्ग इंच",
        "Pulgada cuadrada",
        "Pouce carré",
        "Quadratzoll",
        "平方インチ",
        "平方英寸",
        "بوصة مربعة"
    ],
    "Cubic metre": [
        "घन मीटर",
        "Metro cúbico",
        "Mètre cube",
        "Kubikmeter",
        "立方メートル",
        "立方米",
        "متر مكعب"
    ],
    "Litre": [
        "लीटर",
        "Litro",
        "Litre",
        "Liter",
        "リットル",
        "升",
        "لتر"
    ],
    "Millilitre": [
        "मिलीलीटर",
        "Mililitro",
        "Millilitre",
        "Milliliter",
        "ミリリットル",
        "毫升",
        "مليلتر"
    ],
    "Cubic centimetre": [
        "घन सेंटीमीटर",
        "Centímetro cúbico",
        "Centimètre cube",
        "Kubikzentimeter",
        "立方センチメートル",
        "立方厘米",
        "سنتيمتر مكعب"
    ],
    "Cubic foot": [
        "घन फुट",
        "Pie cúbico",
        "Pied cube",
        "Kubikfuß",
        "立方フィート",
        "立方英尺",
        "قدم مكعبة"
    ],
    "Cubic inch": [
        "घन इंच",
        "Pulgada cúbica",
        "Pouce cube",
        "Kubikzoll",
        "立方インチ",
        "立方英寸",
        "بوصة مكعبة"
    ],
    "US liquid gallon": [
        "अमेरिकी तरल गैलन",
        "Galón líquido estadounidense",
        "Gallon liquide américain",
        "US-Flüssiggallone",
        "米液量ガロン",
        "美制液量加仑",
        "غالون سائل أمريكي"
    ],
    "Imperial gallon": [
        "इम्पीरियल गैलन",
        "Galón imperial",
        "Gallon impérial",
        "Imperiale Gallone",
        "英ガロン",
        "英制加仑",
        "غالون إمبراطوري"
    ],
    "US fluid ounce": [
        "अमेरिकी तरल औंस",
        "Onza líquida estadounidense",
        "Once liquide américaine",
        "US-Flüssigunze",
        "米液量オンス",
        "美制液量盎司",
        "أونصة سائلة أمريكية"
    ],
    "Imperial fluid ounce": [
        "इम्पीरियल तरल औंस",
        "Onza líquida imperial",
        "Once liquide impériale",
        "Imperiale Flüssigunze",
        "英液量オンス",
        "英制液量盎司",
        "أونصة سائلة إمبراطورية"
    ],
    "Metres per second": [
        "मीटर प्रति सेकंड",
        "Metros por segundo",
        "Mètres par seconde",
        "Meter pro Sekunde",
        "メートル毎秒",
        "米每秒",
        "متر في الثانية"
    ],
    "Kilometres per hour": [
        "किलोमीटर प्रति घंटा",
        "Kilómetros por hora",
        "Kilomètres par heure",
        "Kilometer pro Stunde",
        "キロメートル毎時",
        "千米每小时",
        "كيلومتر في الساعة"
    ],
    "Miles per hour": [
        "मील प्रति घंटा",
        "Millas por hora",
        "Milles par heure",
        "Meilen pro Stunde",
        "マイル毎時",
        "英里每小时",
        "ميل في الساعة"
    ],
    "Knot": [
        "नॉट",
        "Nudo",
        "Nœud",
        "Knoten",
        "ノット",
        "节",
        "عقدة"
    ],
    "Feet per second": [
        "फुट प्रति सेकंड",
        "Pies por segundo",
        "Pieds par seconde",
        "Fuß pro Sekunde",
        "フィート毎秒",
        "英尺每秒",
        "قدم في الثانية"
    ],
    "Centimetres per second": [
        "सेंटीमीटर प्रति सेकंड",
        "Centímetros por segundo",
        "Centimètres par seconde",
        "Zentimeter pro Sekunde",
        "センチメートル毎秒",
        "厘米每秒",
        "سنتيمتر في الثانية"
    ],
    "Metres per second squared": [
        "मीटर प्रति सेकंड वर्ग",
        "Metros por segundo al cuadrado",
        "Mètres par seconde carrée",
        "Meter pro Quadratsekunde",
        "メートル毎秒毎秒",
        "米每二次方秒",
        "متر في الثانية المربعة"
    ],
    "Feet per second squared": [
        "फुट प्रति सेकंड वर्ग",
        "Pies por segundo al cuadrado",
        "Pieds par seconde carrée",
        "Fuß pro Quadratsekunde",
        "フィート毎秒毎秒",
        "英尺每二次方秒",
        "قدم في الثانية المربعة"
    ],
    "Standard gravity": [
        "मानक गुरुत्व",
        "Gravedad estándar",
        "Pesanteur normale",
        "Normfallbeschleunigung",
        "標準重力加速度",
        "标准重力加速度",
        "الجاذبية القياسية"
    ],
    "Galileo": [
        "गैलीलियो",
        "Galileo",
        "Galilée",
        "Galileo",
        "ガル",
        "伽利略",
        "غاليليو"
    ],
    "Newton": [
        "न्यूटन",
        "Newton",
        "Newton",
        "Newton",
        "ニュートン",
        "牛顿",
        "نيوتن"
    ],
    "Kilonewton": [
        "किलोन्यूटन",
        "Kilonewton",
        "Kilonewton",
        "Kilonewton",
        "キロニュートン",
        "千牛顿",
        "كيلونيوتن"
    ],
    "Millinewton": [
        "मिलीन्यूटन",
        "Milinewton",
        "Millinewton",
        "Millinewton",
        "ミリニュートン",
        "毫牛顿",
        "ملي نيوتن"
    ],
    "Dyne": [
        "डाइन",
        "Dina",
        "Dyne",
        "Dyn",
        "ダイン",
        "达因",
        "داين"
    ],
    "Pound-force": [
        "पाउंड-बल",
        "Libra-fuerza",
        "Livre-force",
        "Pfund-Kraft",
        "重量ポンド",
        "磅力",
        "رطل قوة"
    ],
    "Kilogram-force": [
        "किलोग्राम-बल",
        "Kilogramo-fuerza",
        "Kilogramme-force",
        "Kilopond",
        "重量キログラム",
        "千克力",
        "كيلوغرام قوة"
    ],
    "Ounce-force": [
        "औंस-बल",
        "Onza-fuerza",
        "Once-force",
        "Unzen-Kraft",
        "重量オンス",
        "盎司力",
        "أونصة قوة"
    ],
    "Pascal": [
        "पास्कल",
        "Pascal",
        "Pascal",
        "Pascal",
        "パスカル",
        "帕斯卡",
        "باسكال"
    ],
    "Kilopascal": [
        "किलोपास्कल",
        "Kilopascal",
        "Kilopascal",
        "Kilopascal",
        "キロパスカル",
        "千帕",
        "كيلوباسكال"
    ],
    "Megapascal": [
        "मेगापास्कल",
        "Megapascal",
        "Mégapascal",
        "Megapascal",
        "メガパスカル",
        "兆帕",
        "ميغاباسكال"
    ],
    "Bar": [
        "बार",
        "Bar",
        "Bar",
        "Bar",
        "バール",
        "巴",
        "بار"
    ],
    "Millibar": [
        "मिलीबार",
        "Milibar",
        "Millibar",
        "Millibar",
        "ミリバール",
        "毫巴",
        "مليبار"
    ],
    "Standard atmosphere": [
        "मानक वायुमंडल",
        "Atmósfera estándar",
        "Atmosphère normale",
        "Standardatmosphäre",
        "標準大気圧",
        "标准大气压",
        "ضغط جوي قياسي"
    ],
    "Torr": [
        "टॉर",
        "Torr",
        "Torr",
        "Torr",
        "トル",
        "托",
        "تور"
    ],
    "Pound-force per square inch": [
        "पाउंड-बल प्रति वर्ग इंच",
        "Libra-fuerza por pulgada cuadrada",
        "Livre-force par pouce carré",
        "Pfund-Kraft pro Quadratzoll",
        "重量ポンド毎平方インチ",
        "磅力每平方英寸",
        "رطل قوة لكل بوصة مربعة"
    ],
    "Pound-force per square foot": [
        "पाउंड-बल प्रति वर्ग फुट",
        "Libra-fuerza por pie cuadrado",
        "Livre-force par pied carré",
        "Pfund-Kraft pro Quadratfuß",
        "重量ポンド毎平方フィート",
        "磅力每平方英尺",
        "رطل قوة لكل قدم مربعة"
    ],
    "Joule": [
        "जूल",
        "Julio",
        "Joule",
        "Joule",
        "ジュール",
        "焦耳",
        "جول"
    ],
    "Kilojoule": [
        "किलोजूल",
        "Kilojulio",
        "Kilojoule",
        "Kilojoule",
        "キロジュール",
        "千焦",
        "كيلوجول"
    ],
    "Megajoule": [
        "मेगाजूल",
        "Megajulio",
        "Mégajoule",
        "Megajoule",
        "メガジュール",
        "兆焦",
        "ميغاجول"
    ],
    "Watt-hour": [
        "वाट-घंटा",
        "Vatio-hora",
        "Wattheure",
        "Wattstunde",
        "ワット時",
        "瓦时",
        "واط ساعة"
    ],
    "Kilowatt-hour": [
        "किलोवाट-घंटा",
        "Kilovatio-hora",
        "Kilowattheure",
        "Kilowattstunde",
        "キロワット時",
        "千瓦时",
        "كيلوواط ساعة"
    ],
    "Thermochemical calorie": [
        "तापरासायनिक कैलोरी",
        "Caloría termoquímica",
        "Calorie thermochimique",
        "Thermochemische Kalorie",
        "熱化学カロリー",
        "热化学卡路里",
        "سعر حراري كيميائي"
    ],
    "Thermochemical kilocalorie": [
        "तापरासायनिक किलोकैलोरी",
        "Kilocaloría termoquímica",
        "Kilocalorie thermochimique",
        "Thermochemische Kilokalorie",
        "熱化学キロカロリー",
        "热化学千卡",
        "كيلوسعر حراري كيميائي"
    ],
    "International Table BTU": [
        "International Table बीटीयू",
        "BTU de International Table",
        "BTU International Table",
        "BTU nach International Table",
        "国際蒸気表BTU",
        "国际蒸汽表 BTU",
        "وحدة حرارية بريطانية وفق الجدول الدولي"
    ],
    "Electronvolt": [
        "इलेक्ट्रॉनवोल्ट",
        "Electronvoltio",
        "Électronvolt",
        "Elektronenvolt",
        "電子ボルト",
        "电子伏特",
        "إلكترون فولت"
    ],
    "Foot-pound force": [
        "फुट-पाउंड बल",
        "Pie-libra fuerza",
        "Pied-livre force",
        "Fuß-Pfund-Kraft",
        "フィート重量ポンド",
        "英尺磅力",
        "قدم رطل قوة"
    ],
    "Watt": [
        "वाट",
        "Vatio",
        "Watt",
        "Watt",
        "ワット",
        "瓦",
        "واط"
    ],
    "Milliwatt": [
        "मिलीवाट",
        "Milivatio",
        "Milliwatt",
        "Milliwatt",
        "ミリワット",
        "毫瓦",
        "ملي واط"
    ],
    "Kilowatt": [
        "किलोवाट",
        "Kilovatio",
        "Kilowatt",
        "Kilowatt",
        "キロワット",
        "千瓦",
        "كيلوواط"
    ],
    "Megawatt": [
        "मेगावाट",
        "Megavatio",
        "Mégawatt",
        "Megawatt",
        "メガワット",
        "兆瓦",
        "ميغاواط"
    ],
    "Mechanical horsepower": [
        "यांत्रिक अश्वशक्ति",
        "Caballo de potencia mecánico",
        "Cheval-vapeur mécanique",
        "Mechanische Pferdestärke",
        "英馬力",
        "机械马力",
        "حصان ميكانيكي"
    ],
    "Metric horsepower": [
        "मीट्रिक अश्वशक्ति",
        "Caballo de vapor métrico",
        "Cheval-vapeur métrique",
        "Metrische Pferdestärke",
        "仏馬力",
        "公制马力",
        "حصان متري"
    ],
    "BTU IT per hour": [
        "BTU IT प्रति घंटा",
        "BTU IT por hora",
        "BTU IT par heure",
        "BTU IT pro Stunde",
        "BTU IT毎時",
        "BTU IT 每小时",
        "BTU IT في الساعة"
    ],
    "Hertz": [
        "हर्ट्ज़",
        "Hercio",
        "Hertz",
        "Hertz",
        "ヘルツ",
        "赫兹",
        "هرتز"
    ],
    "Kilohertz": [
        "किलोहर्ट्ज़",
        "Kilohercio",
        "Kilohertz",
        "Kilohertz",
        "キロヘルツ",
        "千赫",
        "كيلوهرتز"
    ],
    "Megahertz": [
        "मेगाहर्ट्ज़",
        "Megahercio",
        "Mégahertz",
        "Megahertz",
        "メガヘルツ",
        "兆赫",
        "ميغاهرتز"
    ],
    "Gigahertz": [
        "गीगाहर्ट्ज़",
        "Gigahercio",
        "Gigahertz",
        "Gigahertz",
        "ギガヘルツ",
        "吉赫",
        "غيغاهرتز"
    ],
    "Revolutions per minute": [
        "घूर्णन प्रति मिनट",
        "Revoluciones por minuto",
        "Tours par minute",
        "Umdrehungen pro Minute",
        "回転毎分",
        "转每分",
        "دورة في الدقيقة"
    ],
    "Radian": [
        "रेडियन",
        "Radián",
        "Radian",
        "Radiant",
        "ラジアン",
        "弧度",
        "راديان"
    ],
    "Degree": [
        "अंश",
        "Grado",
        "Degré",
        "Grad",
        "度",
        "度",
        "درجة"
    ],
    "Gradian": [
        "ग्रेडियन",
        "Gradián",
        "Grade",
        "Gon",
        "グラード",
        "百分度",
        "غراد"
    ],
    "Full turn": [
        "पूर्ण चक्कर",
        "Vuelta completa",
        "Tour complet",
        "Vollwinkel",
        "回転",
        "周",
        "دورة كاملة"
    ],
    "Arcminute": [
        "कोणीय मिनट",
        "Minuto de arco",
        "Minute d’arc",
        "Winkelminute",
        "角分",
        "角分",
        "دقيقة قوسية"
    ],
    "Arcsecond": [
        "कोणीय सेकंड",
        "Segundo de arco",
        "Seconde d’arc",
        "Winkelsekunde",
        "角秒",
        "角秒",
        "ثانية قوسية"
    ],
    "Newton-metre": [
        "न्यूटन-मीटर",
        "Newton-metro",
        "Newton-mètre",
        "Newtonmeter",
        "ニュートンメートル",
        "牛顿米",
        "نيوتن متر"
    ],
    "Newton-centimetre": [
        "न्यूटन-सेंटीमीटर",
        "Newton-centímetro",
        "Newton-centimètre",
        "Newtonzentimeter",
        "ニュートンセンチメートル",
        "牛顿厘米",
        "نيوتن سنتيمتر"
    ],
    "Pound-force foot": [
        "पाउंड-बल फुट",
        "Libra-fuerza pie",
        "Livre-force pied",
        "Pfund-Kraft-Fuß",
        "重量ポンドフィート",
        "磅力英尺",
        "رطل قوة قدم"
    ],
    "Pound-force inch": [
        "पाउंड-बल इंच",
        "Libra-fuerza pulgada",
        "Livre-force pouce",
        "Pfund-Kraft-Zoll",
        "重量ポンドインチ",
        "磅力英寸",
        "رطل قوة بوصة"
    ],
    "Kilogram-force metre": [
        "किलोग्राम-बल मीटर",
        "Kilogramo-fuerza metro",
        "Kilogramme-force mètre",
        "Kilopondmeter",
        "重量キログラムメートル",
        "千克力米",
        "كيلوغرام قوة متر"
    ],
    "Kilograms per cubic metre": [
        "किलोग्राम प्रति घन मीटर",
        "Kilogramos por metro cúbico",
        "Kilogrammes par mètre cube",
        "Kilogramm pro Kubikmeter",
        "キログラム毎立方メートル",
        "千克每立方米",
        "كيلوغرام لكل متر مكعب"
    ],
    "Grams per cubic centimetre": [
        "ग्राम प्रति घन सेंटीमीटर",
        "Gramos por centímetro cúbico",
        "Grammes par centimètre cube",
        "Gramm pro Kubikzentimeter",
        "グラム毎立方センチメートル",
        "克每立方厘米",
        "غرام لكل سنتيمتر مكعب"
    ],
    "Grams per litre": [
        "ग्राम प्रति लीटर",
        "Gramos por litro",
        "Grammes par litre",
        "Gramm pro Liter",
        "グラム毎リットル",
        "克每升",
        "غرام لكل لتر"
    ],
    "Pounds per cubic foot": [
        "पाउंड प्रति घन फुट",
        "Libras por pie cúbico",
        "Livres par pied cube",
        "Pfund pro Kubikfuß",
        "ポンド毎立方フィート",
        "磅每立方英尺",
        "رطل لكل قدم مكعبة"
    ],
    "Pounds per US gallon": [
        "पाउंड प्रति अमेरिकी गैलन",
        "Libras por galón estadounidense",
        "Livres par gallon américain",
        "Pfund pro US-Gallone",
        "ポンド毎米ガロン",
        "磅每美制加仑",
        "رطل لكل غالون أمريكي"
    ],
    "Pascal-second": [
        "पास्कल-सेकंड",
        "Pascal-segundo",
        "Pascal-seconde",
        "Pascalsekunde",
        "パスカル秒",
        "帕秒",
        "باسكال ثانية"
    ],
    "Millipascal-second": [
        "मिलीपास्कल-सेकंड",
        "Milipascal-segundo",
        "Millipascal-seconde",
        "Millipascalsekunde",
        "ミリパスカル秒",
        "毫帕秒",
        "مليباسكال ثانية"
    ],
    "Poise": [
        "पॉइज़",
        "Poise",
        "Poise",
        "Poise",
        "ポアズ",
        "泊",
        "بواز"
    ],
    "Centipoise": [
        "सेंटीपॉइज़",
        "Centipoise",
        "Centipoise",
        "Zentipoise",
        "センチポアズ",
        "厘泊",
        "سنتيبواز"
    ],
    "Micropascal-second": [
        "माइक्रोपास्कल-सेकंड",
        "Micropascal-segundo",
        "Micropascal-seconde",
        "Mikropascalsekunde",
        "マイクロパスカル秒",
        "微帕秒",
        "ميكروباسكال ثانية"
    ],
    "Square metres per second": [
        "वर्ग मीटर प्रति सेकंड",
        "Metros cuadrados por segundo",
        "Mètres carrés par seconde",
        "Quadratmeter pro Sekunde",
        "平方メートル毎秒",
        "平方米每秒",
        "متر مربع في الثانية"
    ],
    "Square millimetres per second": [
        "वर्ग मिलीमीटर प्रति सेकंड",
        "Milímetros cuadrados por segundo",
        "Millimètres carrés par seconde",
        "Quadratmillimeter pro Sekunde",
        "平方ミリメートル毎秒",
        "平方毫米每秒",
        "مليمتر مربع في الثانية"
    ],
    "Stokes": [
        "स्टोक्स",
        "Stokes",
        "Stokes",
        "Stokes",
        "ストークス",
        "斯托克斯",
        "ستوكس"
    ],
    "Centistokes": [
        "सेंटीस्टोक्स",
        "Centistokes",
        "Centistokes",
        "Zentistokes",
        "センチストークス",
        "厘斯托克斯",
        "سنتيستوكس"
    ],
    "Ampere": [
        "एम्पीयर",
        "Amperio",
        "Ampère",
        "Ampere",
        "アンペア",
        "安培",
        "أمبير"
    ],
    "Milliampere": [
        "मिलीएम्पीयर",
        "Miliamperio",
        "Milliampère",
        "Milliampere",
        "ミリアンペア",
        "毫安",
        "ملي أمبير"
    ],
    "Microampere": [
        "माइक्रोएम्पीयर",
        "Microamperio",
        "Microampère",
        "Mikroampere",
        "マイクロアンペア",
        "微安",
        "ميكروأمبير"
    ],
    "Kiloampere": [
        "किलोएम्पीयर",
        "Kiloamperio",
        "Kiloampère",
        "Kiloampere",
        "キロアンペア",
        "千安",
        "كيلوأمبير"
    ],
    "Volt": [
        "वोल्ट",
        "Voltio",
        "Volt",
        "Volt",
        "ボルト",
        "伏特",
        "فولت"
    ],
    "Millivolt": [
        "मिलीवोल्ट",
        "Milivoltio",
        "Millivolt",
        "Millivolt",
        "ミリボルト",
        "毫伏",
        "ملي فولت"
    ],
    "Microvolt": [
        "माइक्रोवोल्ट",
        "Microvoltio",
        "Microvolt",
        "Mikrovolt",
        "マイクロボルト",
        "微伏",
        "ميكروفولت"
    ],
    "Kilovolt": [
        "किलोवोल्ट",
        "Kilovoltio",
        "Kilovolt",
        "Kilovolt",
        "キロボルト",
        "千伏",
        "كيلوفولت"
    ],
    "Megavolt": [
        "मेगावोल्ट",
        "Megavoltio",
        "Mégavolt",
        "Megavolt",
        "メガボルト",
        "兆伏",
        "ميغافولت"
    ],
    "Ohm": [
        "ओम",
        "Ohmio",
        "Ohm",
        "Ohm",
        "オーム",
        "欧姆",
        "أوم"
    ],
    "Milliohm": [
        "मिलीओम",
        "Miliohmio",
        "Milliohm",
        "Milliohm",
        "ミリオーム",
        "毫欧",
        "ملي أوم"
    ],
    "Kiloohm": [
        "किलोओम",
        "Kiloohmio",
        "Kiloohm",
        "Kiloohm",
        "キロオーム",
        "千欧",
        "كيلوأوم"
    ],
    "Megaohm": [
        "मेगाओम",
        "Megaohmio",
        "Mégohm",
        "Megaohm",
        "メガオーム",
        "兆欧",
        "ميغاأوم"
    ],
    "Farad": [
        "फ़ैरड",
        "Faradio",
        "Farad",
        "Farad",
        "ファラド",
        "法拉",
        "فاراد"
    ],
    "Millifarad": [
        "मिलीफ़ैरड",
        "Milifaradio",
        "Millifarad",
        "Millifarad",
        "ミリファラド",
        "毫法",
        "ملي فاراد"
    ],
    "Microfarad": [
        "माइक्रोफ़ैरड",
        "Microfaradio",
        "Microfarad",
        "Mikrofarad",
        "マイクロファラド",
        "微法",
        "ميكروفاراد"
    ],
    "Nanofarad": [
        "नैनोफ़ैरड",
        "Nanofaradio",
        "Nanofarad",
        "Nanofarad",
        "ナノファラド",
        "纳法",
        "نانوفاراد"
    ],
    "Picofarad": [
        "पिकोफ़ैरड",
        "Picofaradio",
        "Picofarad",
        "Pikofarad",
        "ピコファラド",
        "皮法",
        "بيكوفاراد"
    ],
    "Henry": [
        "हेनरी",
        "Henrio",
        "Henry",
        "Henry",
        "ヘンリー",
        "亨利",
        "هنري"
    ],
    "Millihenry": [
        "मिलीहेनरी",
        "Milihenrio",
        "Millihenry",
        "Millihenry",
        "ミリヘンリー",
        "毫亨",
        "ملي هنري"
    ],
    "Microhenry": [
        "माइक्रोहेनरी",
        "Microhenrio",
        "Microhenry",
        "Mikrohenry",
        "マイクロヘンリー",
        "微亨",
        "ميكروهنري"
    ],
    "Nanohenry": [
        "नैनोहेनरी",
        "Nanohenrio",
        "Nanohenry",
        "Nanohenry",
        "ナノヘンリー",
        "纳亨",
        "نانوهنري"
    ],
    "Coulomb": [
        "कूलॉम",
        "Culombio",
        "Coulomb",
        "Coulomb",
        "クーロン",
        "库仑",
        "كولوم"
    ],
    "Millicoulomb": [
        "मिलीकूलॉम",
        "Miliculombio",
        "Millicoulomb",
        "Millicoulomb",
        "ミリクーロン",
        "毫库",
        "ملي كولوم"
    ],
    "Ampere-hour": [
        "एम्पीयर-घंटा",
        "Amperio-hora",
        "Ampère-heure",
        "Amperestunde",
        "アンペア時",
        "安时",
        "أمبير ساعة"
    ],
    "Milliampere-hour": [
        "मिलीएम्पीयर-घंटा",
        "Miliamperio-hora",
        "Milliampère-heure",
        "Milliamperestunde",
        "ミリアンペア時",
        "毫安时",
        "ملي أمبير ساعة"
    ],
    "Elementary charge": [
        "मूल आवेश",
        "Carga elemental",
        "Charge élémentaire",
        "Elementarladung",
        "電気素量",
        "元电荷",
        "الشحنة الأولية"
    ],
    "Siemens": [
        "सीमेंस",
        "Siemens",
        "Siemens",
        "Siemens",
        "ジーメンス",
        "西门子",
        "سيمنز"
    ],
    "Millisiemens": [
        "मिलीसीमेंस",
        "Milisiemens",
        "Millisiemens",
        "Millisiemens",
        "ミリジーメンス",
        "毫西门子",
        "ملي سيمنز"
    ],
    "Microsiemens": [
        "माइक्रोसीमेंस",
        "Microsiemens",
        "Microsiemens",
        "Mikrosiemens",
        "マイクロジーメンス",
        "微西门子",
        "ميكروسيمنز"
    ],
    "Kilosiemens": [
        "किलोसीमेंस",
        "Kilosiemens",
        "Kilosiemens",
        "Kilosiemens",
        "キロジーメンス",
        "千西门子",
        "كيلوسيمنز"
    ],
    "Weber": [
        "वेबर",
        "Weber",
        "Weber",
        "Weber",
        "ウェーバ",
        "韦伯",
        "ويبر"
    ],
    "Milliweber": [
        "मिलीवेबर",
        "Miliweber",
        "Milliweber",
        "Milliweber",
        "ミリウェーバ",
        "毫韦伯",
        "ملي ويبر"
    ],
    "Microweber": [
        "माइक्रोवेबर",
        "Microweber",
        "Microweber",
        "Mikroweber",
        "マイクロウェーバ",
        "微韦伯",
        "ميكروويبر"
    ],
    "Maxwell": [
        "मैक्सवेल",
        "Maxwell",
        "Maxwell",
        "Maxwell",
        "マクスウェル",
        "麦克斯韦",
        "ماكسويل"
    ],
    "Tesla": [
        "टेस्ला",
        "Tesla",
        "Tesla",
        "Tesla",
        "テスラ",
        "特斯拉",
        "تسلا"
    ],
    "Millitesla": [
        "मिलीटेस्ला",
        "Militesla",
        "Millitesla",
        "Millitesla",
        "ミリテスラ",
        "毫特斯拉",
        "ملي تسلا"
    ],
    "Microtesla": [
        "माइक्रोटेस्ला",
        "Microtesla",
        "Microtesla",
        "Mikrotesla",
        "マイクロテスラ",
        "微特斯拉",
        "ميكروتسلا"
    ],
    "Gauss": [
        "गाउस",
        "Gauss",
        "Gauss",
        "Gauß",
        "ガウス",
        "高斯",
        "غاوس"
    ],
    "Lux": [
        "लक्स",
        "Lux",
        "Lux",
        "Lux",
        "ルクス",
        "勒克斯",
        "لوكس"
    ],
    "Kilolux": [
        "किलोलक्स",
        "Kilolux",
        "Kilolux",
        "Kilolux",
        "キロルクス",
        "千勒克斯",
        "كيلولوكس"
    ],
    "Foot-candle": [
        "फुट-कैंडल",
        "Pie-candela",
        "Pied-bougie",
        "Footcandle",
        "フートカンデラ",
        "英尺烛光",
        "قدم شمعة"
    ],
    "Phot": [
        "फोट",
        "Phot",
        "Phot",
        "Phot",
        "フォト",
        "辐透",
        "فوت"
    ],
    "Byte": [
        "बाइट",
        "Byte",
        "Octet",
        "Byte",
        "バイト",
        "字节",
        "بايت"
    ],
    "Bit": [
        "बिट",
        "Bit",
        "Bit",
        "Bit",
        "ビット",
        "比特",
        "بت"
    ],
    "Kilobyte (decimal)": [
        "किलोबाइट (दशमलव)",
        "Kilobyte (decimal)",
        "Kilooctet (décimal)",
        "Kilobyte (dezimal)",
        "キロバイト（10進）",
        "千字节（十进制）",
        "كيلوبايت (عشري)"
    ],
    "Megabyte (decimal)": [
        "मेगाबाइट (दशमलव)",
        "Megabyte (decimal)",
        "Mégaoctet (décimal)",
        "Megabyte (dezimal)",
        "メガバイト（10進）",
        "兆字节（十进制）",
        "ميغابايت (عشري)"
    ],
    "Gigabyte (decimal)": [
        "गीगाबाइट (दशमलव)",
        "Gigabyte (decimal)",
        "Gigaoctet (décimal)",
        "Gigabyte (dezimal)",
        "ギガバイト（10進）",
        "吉字节（十进制）",
        "غيغابايت (عشري)"
    ],
    "Terabyte (decimal)": [
        "टेराबाइट (दशमलव)",
        "Terabyte (decimal)",
        "Téraoctet (décimal)",
        "Terabyte (dezimal)",
        "テラバイト（10進）",
        "太字节（十进制）",
        "تيرابايت (عشري)"
    ],
    "Kibibyte": [
        "किबिबाइट",
        "Kibibyte",
        "Kibioctet",
        "Kibibyte",
        "キビバイト",
        "二进制千字节",
        "كيبيبايت"
    ],
    "Mebibyte": [
        "मेबिबाइट",
        "Mebibyte",
        "Mébioctet",
        "Mebibyte",
        "メビバイト",
        "二进制兆字节",
        "ميبيبايت"
    ],
    "Gibibyte": [
        "गिबिबाइट",
        "Gibibyte",
        "Gibioctet",
        "Gibibyte",
        "ギビバイト",
        "二进制吉字节",
        "غيبيبايت"
    ],
    "Tebibyte": [
        "टेबिबाइट",
        "Tebibyte",
        "Tébioctet",
        "Tebibyte",
        "テビバイト",
        "二进制太字节",
        "تيبيبايت"
    ],
    "Bits per second": [
        "बिट प्रति सेकंड",
        "Bits por segundo",
        "Bits par seconde",
        "Bit pro Sekunde",
        "ビット毎秒",
        "比特每秒",
        "بت في الثانية"
    ],
    "Kilobits per second": [
        "किलोबिट प्रति सेकंड",
        "Kilobits por segundo",
        "Kilobits par seconde",
        "Kilobit pro Sekunde",
        "キロビット毎秒",
        "千比特每秒",
        "كيلوبت في الثانية"
    ],
    "Megabits per second": [
        "मेगाबिट प्रति सेकंड",
        "Megabits por segundo",
        "Mégabits par seconde",
        "Megabit pro Sekunde",
        "メガビット毎秒",
        "兆比特每秒",
        "ميغابت في الثانية"
    ],
    "Gigabits per second": [
        "गीगाबिट प्रति सेकंड",
        "Gigabits por segundo",
        "Gigabits par seconde",
        "Gigabit pro Sekunde",
        "ギガビット毎秒",
        "吉比特每秒",
        "غيغابت في الثانية"
    ],
    "Bytes per second": [
        "बाइट प्रति सेकंड",
        "Bytes por segundo",
        "Octets par seconde",
        "Byte pro Sekunde",
        "バイト毎秒",
        "字节每秒",
        "بايت في الثانية"
    ],
    "Megabytes per second": [
        "मेगाबाइट प्रति सेकंड",
        "Megabytes por segundo",
        "Mégaoctets par seconde",
        "Megabyte pro Sekunde",
        "メガバイト毎秒",
        "兆字节每秒",
        "ميغابايت في الثانية"
    ],
    "Mebibytes per second": [
        "मेबिबाइट प्रति सेकंड",
        "Mebibytes por segundo",
        "Mébioctets par seconde",
        "Mebibyte pro Sekunde",
        "メビバイト毎秒",
        "二进制兆字节每秒",
        "ميبيبايت في الثانية"
    ],
    "Cubic metres per second": [
        "घन मीटर प्रति सेकंड",
        "Metros cúbicos por segundo",
        "Mètres cubes par seconde",
        "Kubikmeter pro Sekunde",
        "立方メートル毎秒",
        "立方米每秒",
        "متر مكعب في الثانية"
    ],
    "Cubic metres per hour": [
        "घन मीटर प्रति घंटा",
        "Metros cúbicos por hora",
        "Mètres cubes par heure",
        "Kubikmeter pro Stunde",
        "立方メートル毎時",
        "立方米每小时",
        "متر مكعب في الساعة"
    ],
    "Litres per second": [
        "लीटर प्रति सेकंड",
        "Litros por segundo",
        "Litres par seconde",
        "Liter pro Sekunde",
        "リットル毎秒",
        "升每秒",
        "لتر في الثانية"
    ],
    "Litres per minute": [
        "लीटर प्रति मिनट",
        "Litros por minuto",
        "Litres par minute",
        "Liter pro Minute",
        "リットル毎分",
        "升每分",
        "لتر في الدقيقة"
    ],
    "US gallons per minute": [
        "अमेरिकी गैलन प्रति मिनट",
        "Galones estadounidenses por minuto",
        "Gallons américains par minute",
        "US-Gallonen pro Minute",
        "米ガロン毎分",
        "美制加仑每分",
        "غالون أمريكي في الدقيقة"
    ],
    "Cubic feet per minute": [
        "घन फुट प्रति मिनट",
        "Pies cúbicos por minuto",
        "Pieds cubes par minute",
        "Kubikfuß pro Minute",
        "立方フィート毎分",
        "立方英尺每分",
        "قدم مكعبة في الدقيقة"
    ],
    "Watts per metre-kelvin": [
        "वाट प्रति मीटर-केल्विन",
        "Vatios por metro-kelvin",
        "Watts par mètre-kelvin",
        "Watt pro Meter-Kelvin",
        "ワット毎メートルケルビン",
        "瓦每米开尔文",
        "واط لكل متر كلفن"
    ],
    "Milliwatts per metre-kelvin": [
        "मिलीवाट प्रति मीटर-केल्विन",
        "Milivatios por metro-kelvin",
        "Milliwatts par mètre-kelvin",
        "Milliwatt pro Meter-Kelvin",
        "ミリワット毎メートルケルビン",
        "毫瓦每米开尔文",
        "ملي واط لكل متر كلفن"
    ],
    "Watts per centimetre-kelvin": [
        "वाट प्रति सेंटीमीटर-केल्विन",
        "Vatios por centímetro-kelvin",
        "Watts par centimètre-kelvin",
        "Watt pro Zentimeter-Kelvin",
        "ワット毎センチメートルケルビン",
        "瓦每厘米开尔文",
        "واط لكل سنتيمتر كلفن"
    ],
    "BTU IT per hour-foot-degree Fahrenheit": [
        "BTU IT प्रति घंटा-फुट-डिग्री फ़ारेनहाइट",
        "BTU IT por hora-pie-grado Fahrenheit",
        "BTU IT par heure-pied-degré Fahrenheit",
        "BTU IT pro Stunde-Fuß-Grad Fahrenheit",
        "BTU IT毎時毎フィート毎華氏度",
        "BTU IT 每小时英尺华氏度",
        "BTU IT لكل ساعة قدم درجة فهرنهايت"
    ],
    "Joules per kilogram-kelvin": [
        "जूल प्रति किलोग्राम-केल्विन",
        "Julios por kilogramo-kelvin",
        "Joules par kilogramme-kelvin",
        "Joule pro Kilogramm-Kelvin",
        "ジュール毎キログラムケルビン",
        "焦每千克开尔文",
        "جول لكل كيلوغرام كلفن"
    ],
    "Kilojoules per kilogram-kelvin": [
        "किलोजूल प्रति किलोग्राम-केल्विन",
        "Kilojulios por kilogramo-kelvin",
        "Kilojoules par kilogramme-kelvin",
        "Kilojoule pro Kilogramm-Kelvin",
        "キロジュール毎キログラムケルビン",
        "千焦每千克开尔文",
        "كيلوجول لكل كيلوغرام كلفن"
    ],
    "Joules per gram-kelvin": [
        "जूल प्रति ग्राम-केल्विन",
        "Julios por gramo-kelvin",
        "Joules par gramme-kelvin",
        "Joule pro Gramm-Kelvin",
        "ジュール毎グラムケルビン",
        "焦每克开尔文",
        "جول لكل غرام كلفن"
    ],
    "Thermochemical calories per gram-degree Celsius": [
        "तापरासायनिक कैलोरी प्रति ग्राम-डिग्री सेल्सियस",
        "Calorías termoquímicas por gramo-grado Celsius",
        "Calories thermochimiques par gramme-degré Celsius",
        "Thermochemische Kalorien pro Gramm-Grad Celsius",
        "熱化学カロリー毎グラム毎摂氏度",
        "热化学卡路里每克摄氏度",
        "سعرات حرارية كيميائية لكل غرام درجة سيلسيوس"
    ],
    "Newtons per metre": [
        "न्यूटन प्रति मीटर",
        "Newtons por metro",
        "Newtons par mètre",
        "Newton pro Meter",
        "ニュートン毎メートル",
        "牛顿每米",
        "نيوتن لكل متر"
    ],
    "Millinewtons per metre": [
        "मिलीन्यूटन प्रति मीटर",
        "Milinewtons por metro",
        "Millinewtons par mètre",
        "Millinewton pro Meter",
        "ミリニュートン毎メートル",
        "毫牛顿每米",
        "ملي نيوتن لكل متر"
    ],
    "Dynes per centimetre": [
        "डाइन प्रति सेंटीमीटर",
        "Dinas por centímetro",
        "Dynes par centimètre",
        "Dyn pro Zentimeter",
        "ダイン毎センチメートル",
        "达因每厘米",
        "داين لكل سنتيمتر"
    ],
    "Pound-force per foot": [
        "पाउंड-बल प्रति फुट",
        "Libra-fuerza por pie",
        "Livre-force par pied",
        "Pfund-Kraft pro Fuß",
        "重量ポンド毎フィート",
        "磅力每英尺",
        "رطل قوة لكل قدم"
    ]
};
