import type { TranslationColumns } from "./tool-names";

// Hindi, Spanish, French, German, Japanese, Simplified Chinese, Arabic.
// Technical values, resolver details and generated artifacts remain unchanged.
export const COLOR_EMAIL_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Harmonies & shade scales": [
        "रंग सामंजस्य और शेड स्केल",
        "Armonías y escalas de tonos",
        "Harmonies et échelles de nuances",
        "Farbharmonien und Schattierungen",
        "配色とシェードスケール",
        "配色与明度色阶",
        "تناسق الألوان وتدرجات الظل"
    ],
    "Palette relationship": [
        "पैलेट संबंध",
        "Relación de la paleta",
        "Relation de la palette",
        "Beziehung der Farbpalette",
        "パレットの関係",
        "色板关系",
        "علاقة ألوان اللوحة"
    ],
    "Complementary · 180°": [
        "पूरक · 180°",
        "Complementarios · 180°",
        "Complémentaires · 180°",
        "Komplementär · 180°",
        "補色 · 180°",
        "互补色 · 180°",
        "متكاملة · 180°"
    ],
    "Analogous · ±30°": [
        "समान · ±30°",
        "Análogos · ±30°",
        "Analogues · ±30°",
        "Analog · ±30°",
        "類似色 · ±30°",
        "类似色 · ±30°",
        "متجاورة · ±30°"
    ],
    "Triadic · 120°": [
        "त्रिक · 120°",
        "Triádicos · 120°",
        "Triadiques · 120°",
        "Triadisch · 120°",
        "三分割配色 · 120°",
        "三角色 · 120°",
        "ثلاثية · 120°"
    ],
    "Split complementary · 150° / 210°": [
        "विभाजित पूरक · 150° / 210°",
        "Complementarios divididos · 150° / 210°",
        "Complémentaires divisées · 150° / 210°",
        "Geteilt komplementär · 150° / 210°",
        "分裂補色 · 150° / 210°",
        "分裂互补色 · 150° / 210°",
        "متكاملة منقسمة · 150° / 210°"
    ],
    "Tetradic · 90°": [
        "चतुष्क · 90°",
        "Tetrádicos · 90°",
        "Tétradiques · 90°",
        "Tetradisch · 90°",
        "四分割配色 · 90°",
        "四角色 · 90°",
        "رباعية · 90°"
    ],
    "Shade scale · 10–90% HSL lightness": [
        "शेड स्केल · 10–90% HSL हल्कापन",
        "Escala de tonos · luminosidad HSL de 10–90%",
        "Échelle de nuances · luminosité HSL de 10–90%",
        "Schattierungen · 10–90% HSL-Helligkeit",
        "シェードスケール · HSL 明度 10–90%",
        "明度色阶 · 10–90% HSL 明度",
        "تدرج الظل · إضاءة HSL ‏10–90%"
    ],
    "Copy palette color {index}: {value}": [
        "पैलेट रंग {index} कॉपी करें: {value}",
        "Copiar color {index} de la paleta: {value}",
        "Copier la couleur {index} de la palette : {value}",
        "Palettenfarbe {index} kopieren: {value}",
        "パレットの色 {index} をコピー: {value}",
        "复制色板颜色 {index}：{value}",
        "نسخ لون اللوحة {index}: {value}"
    ],
    "Copy CSS variables": [
        "CSS चर कॉपी करें",
        "Copiar variables CSS",
        "Copier les variables CSS",
        "CSS-Variablen kopieren",
        "CSS 変数をコピー",
        "复制 CSS 变量",
        "نسخ متغيرات CSS"
    ],
    "Download palette JSON": [
        "पैलेट JSON डाउनलोड करें",
        "Descargar JSON de la paleta",
        "Télécharger la palette JSON",
        "Palette als JSON herunterladen",
        "パレット JSON をダウンロード",
        "下载色板 JSON",
        "تنزيل JSON للوحة الألوان"
    ],
    "Harmonies rotate hue in sRGB HSL. The shade scale holds hue, saturation and alpha while changing HSL lightness; perceived brightness and contrast vary. Check foreground/background contrast before using a palette.": [
        "सामंजस्य sRGB HSL में ह्यू घुमाता है। शेड स्केल ह्यू, संतृप्ति और अल्फ़ा स्थिर रखकर HSL हल्कापन बदलता है; दिखाई देने वाली चमक और कंट्रास्ट बदलते हैं। पैलेट इस्तेमाल करने से पहले अग्रभूमि/पृष्ठभूमि कंट्रास्ट जाँचें।",
        "Las armonías rotan el tono en HSL sRGB. La escala mantiene tono, saturación y alfa mientras cambia la luminosidad HSL; el brillo percibido y el contraste varían. Comprueba el contraste entre texto y fondo antes de usar una paleta.",
        "Les harmonies font tourner la teinte en HSL sRGB. L’échelle conserve teinte, saturation et alpha en modifiant la luminosité HSL ; la luminosité perçue et le contraste varient. Vérifiez le contraste premier plan/arrière-plan avant d’utiliser une palette.",
        "Harmonien drehen den Farbton in sRGB HSL. Die Skala behält Farbton, Sättigung und Alpha bei und ändert die HSL-Helligkeit; wahrgenommene Helligkeit und Kontrast variieren. Prüfen Sie vor der Verwendung den Kontrast von Vorder- und Hintergrund.",
        "配色は sRGB HSL の色相を回転します。シェードスケールは色相、彩度、アルファを維持し、HSL 明度を変えます。見た目の明るさやコントラストは異なります。使用前に前景と背景のコントラストを確認してください。",
        "配色通过旋转 sRGB HSL 色相生成。明度色阶保持色相、饱和度与透明度，仅改变 HSL 明度；感知亮度与对比度会变化。使用色板前请检查前景与背景的对比度。",
        "تُدوّر التنسيقات درجة اللون في sRGB HSL. يحافظ التدرج على درجة اللون والتشبع وألفا ويغيّر إضاءة HSL؛ ويتفاوت السطوع والتباين المرئيان. افحص تباين المقدمة والخلفية قبل استخدام اللوحة."
    ],
    "Enter a HEX color with 3, 4, 6 or 8 digits.": [
        "3, 4, 6 या 8 अंकों का HEX रंग दर्ज करें।",
        "Introduce un color HEX de 3, 4, 6 u 8 dígitos.",
        "Saisissez une couleur HEX à 3, 4, 6 ou 8 chiffres.",
        "HEX-Farbe mit 3, 4, 6 oder 8 Ziffern eingeben.",
        "3、4、6、8桁のHEXカラーを入力してください。",
        "输入 3、4、6 或 8 位 HEX 颜色。",
        "أدخل لون HEX من 3 أو 4 أو 6 أو 8 خانات."
    ],
    "Palette diagnostic: {detail}": [
        "पैलेट निदान: {detail}",
        "Diagnóstico de paleta: {detail}",
        "Diagnostic de palette : {detail}",
        "Palettendiagnose: {detail}",
        "パレット診断: {detail}",
        "色板诊断：{detail}",
        "تشخيص اللوحة: {detail}"
    ],
    "Color diagnostic: {detail}": [
        "रंग निदान: {detail}",
        "Diagnóstico de color: {detail}",
        "Diagnostic de couleur : {detail}",
        "Farbdiagnose: {detail}",
        "色の診断: {detail}",
        "颜色诊断：{detail}",
        "تشخيص اللون: {detail}"
    ],
    "Email domain MX diagnostics": [
        "ईमेल डोमेन MX निदान",
        "Diagnóstico MX del dominio de correo",
        "Diagnostic MX du domaine de messagerie",
        "MX-Diagnose der E-Mail-Domain",
        "メールドメインの MX 診断",
        "电子邮件域名 MX 诊断",
        "تشخيص MX لنطاق البريد"
    ],
    "Only the domain is sent directly to the selected public DNS-over-HTTPS resolver when you click. The email address and local part stay in your browser. DNS records cannot confirm whether a mailbox exists.": [
        "क्लिक करने पर केवल डोमेन चुने गए सार्वजनिक DNS-over-HTTPS रिज़ॉल्वर को भेजा जाता है। ईमेल पता और स्थानीय भाग ब्राउज़र में रहते हैं। DNS रिकॉर्ड मेलबॉक्स के अस्तित्व की पुष्टि नहीं कर सकते।",
        "Al hacer clic, solo se envía el dominio al resolutor público DNS-over-HTTPS elegido. La dirección y la parte local permanecen en el navegador. Los registros DNS no confirman que exista un buzón.",
        "Au clic, seul le domaine est envoyé au résolveur public DNS-over-HTTPS choisi. L’adresse et sa partie locale restent dans le navigateur. Les enregistrements DNS ne confirment pas l’existence d’une boîte mail.",
        "Beim Klicken wird nur die Domain direkt an den gewählten öffentlichen DNS-over-HTTPS-Resolver gesendet. E-Mail-Adresse und lokaler Teil bleiben im Browser. DNS-Einträge bestätigen nicht, ob ein Postfach existiert.",
        "クリックすると、ドメインのみが選択した公開 DNS-over-HTTPS リゾルバーに直接送信されます。メールアドレスとローカル部はブラウザー内に残ります。DNS レコードではメールボックスの存在を確認できません。",
        "点击时仅将域名直接发送至所选的公共 DNS-over-HTTPS 解析器。电子邮件地址与本地部分保留在浏览器中。DNS 记录无法确认邮箱是否存在。",
        "عند النقر يُرسل النطاق فقط مباشرةً إلى محلّل DNS-over-HTTPS العام المحدد. يبقى عنوان البريد والجزء المحلي في المتصفح. لا تؤكد سجلات DNS وجود صندوق بريد."
    ],
    "Domain from the single email": [
        "एकल ईमेल से डोमेन",
        "Dominio del correo individual",
        "Domaine de l’adresse unique",
        "Domain der einzelnen E-Mail",
        "単一メールのドメイン",
        "单个电子邮件的域名",
        "نطاق عنوان البريد المفرد"
    ],
    "Enter a valid email above": [
        "ऊपर वैध ईमेल दर्ज करें",
        "Introduce un correo válido arriba",
        "Saisissez une adresse valide ci-dessus",
        "Oben eine gültige E-Mail eingeben",
        "上に有効なメールを入力",
        "请在上方输入有效邮箱",
        "أدخل بريدًا صالحًا أعلاه"
    ],
    "DNS resolver": [
        "DNS रिज़ॉल्वर",
        "Resolutor DNS",
        "Résolveur DNS",
        "DNS-Resolver",
        "DNS リゾルバー",
        "DNS 解析器",
        "محلّل DNS"
    ],
    "Checking DNS…": [
        "DNS जाँच रहे हैं…",
        "Comprobando DNS…",
        "Vérification DNS…",
        "DNS wird geprüft…",
        "DNS を確認中…",
        "正在检查 DNS…",
        "جارٍ فحص DNS…"
    ],
    "Check domain MX": [
        "डोमेन MX जाँचें",
        "Comprobar MX del dominio",
        "Vérifier les MX du domaine",
        "Domain-MX prüfen",
        "ドメイン MX を確認",
        "检查域名 MX",
        "فحص MX للنطاق"
    ],
    "Priority": [
        "प्राथमिकता",
        "Prioridad",
        "Priorité",
        "Priorität",
        "優先度",
        "优先级",
        "الأولوية"
    ],
    "Mail exchanger": [
        "मेल एक्सचेंजर",
        "Servidor de correo",
        "Serveur de messagerie",
        "Mailserver",
        "メール交換サーバー",
        "邮件交换服务器",
        "خادم تبادل البريد"
    ],
    "TTL (seconds)": [
        "TTL (सेकंड)",
        "TTL (segundos)",
        "TTL (secondes)",
        "TTL (Sekunden)",
        "TTL（秒）",
        "TTL（秒）",
        "TTL (ثوانٍ)"
    ],
    "Fallback addresses:": [
        "वैकल्पिक पते:",
        "Direcciones alternativas:",
        "Adresses de secours :",
        "Ersatzadressen:",
        "フォールバックアドレス:",
        "备用地址：",
        "عناوين احتياطية:"
    ],
    "The resolver set the DNSSEC authenticated-data flag.": [
        "रिज़ॉल्वर ने DNSSEC authenticated-data फ़्लैग सेट किया।",
        "El resolutor activó el indicador de datos autenticados DNSSEC.",
        "Le résolveur a activé l’indicateur de données authentifiées DNSSEC.",
        "Der Resolver hat das DNSSEC-Flag für authentifizierte Daten gesetzt.",
        "リゾルバーは DNSSEC の認証済みデータフラグを設定しました。",
        "解析器设置了 DNSSEC 已验证数据标志。",
        "ضبط المحلّل علامة البيانات الموثّقة DNSSEC."
    ],
    "The resolver did not set the DNSSEC authenticated-data flag.": [
        "रिज़ॉल्वर ने DNSSEC authenticated-data फ़्लैग सेट नहीं किया।",
        "El resolutor no activó el indicador de datos autenticados DNSSEC.",
        "Le résolveur n’a pas activé l’indicateur de données authentifiées DNSSEC.",
        "Der Resolver hat das DNSSEC-Flag für authentifizierte Daten nicht gesetzt.",
        "リゾルバーは DNSSEC の認証済みデータフラグを設定しませんでした。",
        "解析器未设置 DNSSEC 已验证数据标志。",
        "لم يضبط المحلّل علامة البيانات الموثّقة DNSSEC."
    ],
    "Results reflect this resolver’s cache at lookup time.": [
        "परिणाम खोज के समय इस रिज़ॉल्वर के कैश को दर्शाते हैं।",
        "Los resultados reflejan la caché del resolutor en el momento de la consulta.",
        "Les résultats reflètent le cache de ce résolveur au moment de la requête.",
        "Die Ergebnisse entsprechen dem Resolver-Cache zum Abfragezeitpunkt.",
        "結果は検索時点のリゾルバーのキャッシュを反映します。",
        "结果反映查询时此解析器的缓存。",
        "تعكس النتائج ذاكرة المحلّل المؤقتة وقت الاستعلام."
    ],
    "MX records found. The domain publishes mail exchangers; this does not verify the mailbox or delivery.": [
        "MX रिकॉर्ड मिले। डोमेन मेल एक्सचेंजर प्रकाशित करता है; इससे मेलबॉक्स या डिलीवरी सत्यापित नहीं होती।",
        "Se encontraron registros MX. El dominio publica servidores de correo; esto no verifica el buzón ni la entrega.",
        "Des enregistrements MX ont été trouvés. Le domaine publie des serveurs de messagerie ; cela ne vérifie ni la boîte mail ni la livraison.",
        "MX-Einträge gefunden. Die Domain veröffentlicht Mailserver; dies bestätigt weder Postfach noch Zustellung.",
        "MX レコードが見つかりました。ドメインはメール交換サーバーを公開していますが、メールボックスや配信は確認できません。",
        "找到 MX 记录。该域名公布了邮件交换服务器；这不能验证邮箱或邮件投递。",
        "عُثر على سجلات MX. ينشر النطاق خوادم بريد؛ وهذا لا يتحقق من صندوق البريد أو التسليم."
    ],
    "Null MX: this domain explicitly states that it does not accept email (RFC 7505).": [
        "Null MX: यह डोमेन स्पष्ट रूप से बताता है कि यह ईमेल स्वीकार नहीं करता (RFC 7505)।",
        "Null MX: este dominio declara que no acepta correo (RFC 7505).",
        "Null MX : ce domaine déclare explicitement ne pas accepter de courrier (RFC 7505).",
        "Null MX: Diese Domain erklärt ausdrücklich, keine E-Mails anzunehmen (RFC 7505).",
        "Null MX: このドメインはメールを受信しないことを明示しています（RFC 7505）。",
        "Null MX：该域名明确表示不接受电子邮件（RFC 7505）。",
        "Null MX: يصرّح هذا النطاق بأنه لا يقبل البريد الإلكتروني (RFC 7505)."
    ],
    "No MX records. Address records exist, so SMTP can attempt implicit delivery to the domain. This does not verify that an SMTP service is running.": [
        "MX रिकॉर्ड नहीं हैं। पता रिकॉर्ड मौजूद हैं, इसलिए SMTP डोमेन पर अंतर्निहित डिलीवरी का प्रयास कर सकता है। इससे SMTP सेवा चलने की पुष्टि नहीं होती।",
        "No hay registros MX. Existen registros de dirección, por lo que SMTP puede intentar entrega implícita al dominio. Esto no confirma que haya un servicio SMTP activo.",
        "Aucun enregistrement MX. Des enregistrements d’adresse existent : SMTP peut tenter une livraison implicite au domaine. Cela ne confirme pas qu’un service SMTP fonctionne.",
        "Keine MX-Einträge. Adresseinträge sind vorhanden, daher kann SMTP eine implizite Zustellung versuchen. Dies bestätigt keinen laufenden SMTP-Dienst.",
        "MX レコードはありません。アドレスレコードがあるため、SMTP はドメインへの暗黙の配信を試行できます。SMTP サービスの稼働は確認できません。",
        "没有 MX 记录，但存在地址记录，因此 SMTP 可尝试向域名隐式投递。这无法确认 SMTP 服务是否正在运行。",
        "لا توجد سجلات MX. توجد سجلات عناوين، لذا يمكن لـ SMTP محاولة التسليم الضمني للنطاق. لا يؤكد ذلك تشغيل خدمة SMTP."
    ],
    "No MX or fallback A/AAAA address records were returned. Delivery is not currently discoverable through these DNS answers.": [
        "कोई MX या वैकल्पिक A/AAAA पता रिकॉर्ड नहीं मिला। इन DNS उत्तरों से अभी डिलीवरी का पता नहीं चलता।",
        "No se devolvieron registros MX ni direcciones alternativas A/AAAA. Estas respuestas DNS no permiten descubrir una vía de entrega.",
        "Aucun enregistrement MX ni adresse de secours A/AAAA n’a été renvoyé. Ces réponses DNS ne permettent pas de découvrir une voie de livraison.",
        "Keine MX- oder Ersatzadresseinträge A/AAAA erhalten. Über diese DNS-Antworten ist derzeit kein Zustellweg erkennbar.",
        "MX レコードもフォールバックの A/AAAA アドレスレコードも返されませんでした。これらの DNS 応答から配信先は現在確認できません。",
        "未返回 MX 或备用 A/AAAA 地址记录。目前无法通过这些 DNS 答案发现投递路径。",
        "لم تُرجع سجلات MX أو عناوين A/AAAA احتياطية. لا يمكن حاليًا اكتشاف مسار تسليم عبر إجابات DNS هذه."
    ],
    "NXDOMAIN: the resolver reports that this domain does not exist.": [
        "NXDOMAIN: रिज़ॉल्वर के अनुसार यह डोमेन मौजूद नहीं है।",
        "NXDOMAIN: el resolutor informa de que el dominio no existe.",
        "NXDOMAIN : le résolveur indique que ce domaine n’existe pas.",
        "NXDOMAIN: Laut Resolver existiert diese Domain nicht.",
        "NXDOMAIN: リゾルバーはこのドメインが存在しないと報告しています。",
        "NXDOMAIN：解析器报告此域名不存在。",
        "NXDOMAIN: يفيد المحلّل بأن هذا النطاق غير موجود."
    ],
    "Invalid null-MX configuration: the root target must be the only MX record with priority 0. Review the domain’s DNS configuration.": [
        "अमान्य null-MX कॉन्फ़िगरेशन: मूल लक्ष्य प्राथमिकता 0 वाला एकमात्र MX रिकॉर्ड होना चाहिए। डोमेन का DNS कॉन्फ़िगरेशन जाँचें।",
        "Configuración null-MX no válida: el destino raíz debe ser el único registro MX con prioridad 0. Revisa la configuración DNS del dominio.",
        "Configuration null-MX invalide : la cible racine doit être l’unique enregistrement MX de priorité 0. Vérifiez la configuration DNS du domaine.",
        "Ungültige Null-MX-Konfiguration: Das Wurzelziel muss der einzige MX-Eintrag mit Priorität 0 sein. Prüfen Sie die DNS-Konfiguration der Domain.",
        "null-MX の設定が無効です。ルートターゲットは優先度 0 の唯一の MX レコードである必要があります。ドメインの DNS 設定を確認してください。",
        "null-MX 配置无效：根目标必须是唯一的 MX 记录，且优先级为 0。请检查域名 DNS 配置。",
        "إعداد null-MX غير صالح: يجب أن تكون الوجهة الجذرية سجل MX الوحيد بأولوية 0. راجع إعداد DNS للنطاق."
    ],
    "Enter an email domain without a protocol or path.": [
        "प्रोटोकॉल या पथ के बिना ईमेल डोमेन दर्ज करें।",
        "Introduce un dominio de correo sin protocolo ni ruta.",
        "Saisissez un domaine de messagerie sans protocole ni chemin.",
        "Geben Sie eine E-Mail-Domain ohne Protokoll oder Pfad ein.",
        "プロトコルやパスなしでメールドメインを入力してください。",
        "请输入不含协议或路径的邮件域名。",
        "أدخل نطاق بريد دون بروتوكول أو مسار."
    ],
    "Enter a valid public domain name.": [
        "वैध सार्वजनिक डोमेन नाम दर्ज करें।",
        "Introduce un nombre de dominio público válido.",
        "Saisissez un nom de domaine public valide.",
        "Geben Sie einen gültigen öffentlichen Domainnamen ein.",
        "有効な公開ドメイン名を入力してください。",
        "请输入有效的公共域名。",
        "أدخل اسم نطاق عام صالحًا."
    ],
    "The resolver truncated its response. Retry with the other resolver.": [
        "रिज़ॉल्वर ने उत्तर अधूरा दिया। दूसरे रिज़ॉल्वर से फिर प्रयास करें।",
        "El resolutor truncó su respuesta. Prueba con el otro resolutor.",
        "Le résolveur a tronqué sa réponse. Réessayez avec l’autre résolveur.",
        "Der Resolver hat die Antwort gekürzt. Versuchen Sie den anderen Resolver.",
        "リゾルバーの応答が切り詰められました。別のリゾルバーで再試行してください。",
        "解析器截断了响应。请使用另一解析器重试。",
        "اقتطع المحلّل استجابته. أعد المحاولة بالمحلّل الآخر."
    ],
    "The resolver returned malformed MX data.": [
        "रिज़ॉल्वर ने गलत प्रारूप का MX डेटा लौटाया।",
        "El resolutor devolvió datos MX mal formados.",
        "Le résolveur a renvoyé des données MX mal formées.",
        "Der Resolver hat fehlerhafte MX-Daten zurückgegeben.",
        "リゾルバーが不正な形式の MX データを返しました。",
        "解析器返回了格式错误的 MX 数据。",
        "أرجع المحلّل بيانات MX مشوهة."
    ],
    "MX was absent, but the fallback address lookup failed. Retry before drawing a conclusion.": [
        "MX अनुपस्थित था, लेकिन वैकल्पिक पता खोज विफल हुई। निष्कर्ष निकालने से पहले फिर प्रयास करें।",
        "No había MX, pero falló la consulta de direcciones alternativas. Reintenta antes de sacar conclusiones.",
        "MX absent, mais la recherche d’adresses de secours a échoué. Réessayez avant de conclure.",
        "MX fehlte, aber die Ersatzadressabfrage schlug fehl. Wiederholen Sie die Abfrage vor einer Schlussfolgerung.",
        "MX はありませんでしたが、フォールバックアドレスの検索に失敗しました。判断する前に再試行してください。",
        "没有 MX，且备用地址查询失败。请重试后再下结论。",
        "لم يوجد MX وفشل استعلام العنوان الاحتياطي. أعد المحاولة قبل الاستنتاج."
    ],
    "DNS resolver returned an empty response.": [
        "DNS रिज़ॉल्वर ने खाली उत्तर लौटाया।",
        "El resolutor DNS devolvió una respuesta vacía.",
        "Le résolveur DNS a renvoyé une réponse vide.",
        "Der DNS-Resolver hat eine leere Antwort zurückgegeben.",
        "DNS リゾルバーが空の応答を返しました。",
        "DNS 解析器返回了空响应。",
        "أرجع محلّل DNS استجابة فارغة."
    ],
    "DNS response exceeds 64 KiB.": [
        "DNS उत्तर 64 KiB से बड़ा है।",
        "La respuesta DNS supera 64 KiB.",
        "La réponse DNS dépasse 64 KiB.",
        "Die DNS-Antwort überschreitet 64 KiB.",
        "DNS 応答が 64 KiB を超えています。",
        "DNS 响应超过 64 KiB。",
        "تتجاوز استجابة DNS ‏64 KiB."
    ],
    "DNS resolver response has an invalid shape.": [
        "DNS रिज़ॉल्वर उत्तर की संरचना अमान्य है।",
        "La respuesta del resolutor DNS tiene una estructura no válida.",
        "La structure de la réponse du résolveur DNS est invalide.",
        "Die DNS-Resolver-Antwort hat eine ungültige Struktur.",
        "DNS リゾルバーの応答構造が無効です。",
        "DNS 解析器响应结构无效。",
        "بنية استجابة محلّل DNS غير صالحة."
    ],
    "Choose a supported DNS resolver.": [
        "समर्थित DNS रिज़ॉल्वर चुनें।",
        "Elige un resolutor DNS compatible.",
        "Choisissez un résolveur DNS pris en charge.",
        "Wählen Sie einen unterstützten DNS-Resolver.",
        "対応する DNS リゾルバーを選択してください。",
        "请选择受支持的 DNS 解析器。",
        "اختر محلّل DNS مدعومًا."
    ],
    "DNS resolver returned HTTP {status}.": [
        "DNS रिज़ॉल्वर ने HTTP {status} लौटाया।",
        "El resolutor DNS devolvió HTTP {status}.",
        "Le résolveur DNS a renvoyé HTTP {status}.",
        "Der DNS-Resolver hat HTTP {status} zurückgegeben.",
        "DNS リゾルバーが HTTP {status} を返しました。",
        "DNS 解析器返回 HTTP {status}。",
        "أرجع محلّل DNS ‏HTTP {status}."
    ],
    "DNS resolver returned status {status}. This does not establish whether mail is accepted.": [
        "DNS रिज़ॉल्वर ने स्थिति {status} लौटाई। इससे ईमेल स्वीकार होने की पुष्टि नहीं होती।",
        "El resolutor DNS devolvió el estado {status}. Esto no determina si se acepta correo.",
        "Le résolveur DNS a renvoyé le statut {status}. Cela ne détermine pas si le courrier est accepté.",
        "Der DNS-Resolver hat Status {status} zurückgegeben. Dies belegt nicht, ob E-Mails angenommen werden.",
        "DNS リゾルバーがステータス {status} を返しました。メールを受信するかどうかは確認できません。",
        "DNS 解析器返回状态 {status}。这无法确定是否接受邮件。",
        "أرجع محلّل DNS الحالة {status}. لا يثبت ذلك قبول البريد."
    ],
    "DNS lookup failed. Resolver details:": [
        "DNS खोज विफल हुई। रिज़ॉल्वर विवरण:",
        "La consulta DNS falló. Detalles del resolutor:",
        "Échec de la requête DNS. Détails du résolveur :",
        "DNS-Abfrage fehlgeschlagen. Resolver-Details:",
        "DNS 検索に失敗しました。リゾルバーの詳細:",
        "DNS 查询失败。解析器详情：",
        "فشل استعلام DNS. تفاصيل المحلّل:"
    ],
    "Pick a Color": [
        "रंग चुनें",
        "Elegir un color",
        "Choisir une couleur",
        "Farbe auswählen",
        "色を選択",
        "选择颜色",
        "اختيار لون"
    ],
    "Color code": [
        "रंग कोड",
        "Código de color",
        "Code couleur",
        "Farbcode",
        "カラーコード",
        "颜色代码",
        "رمز اللون"
    ],
    "Copy All Formats": [
        "सभी प्रारूप कॉपी करें",
        "Copiar todos los formatos",
        "Copier tous les formats",
        "Alle Formate kopieren",
        "すべての形式をコピー",
        "复制所有格式",
        "نسخ جميع الصيغ"
    ],
    "All formats copied!": [
        "सभी प्रारूप कॉपी हो गए!",
        "¡Todos los formatos copiados!",
        "Tous les formats copiés !",
        "Alle Formate kopiert!",
        "すべての形式をコピーしました！",
        "已复制所有格式！",
        "تم نسخ جميع الصيغ!"
    ],
    "{format} copied!": [
        "{format} कॉपी हो गया!",
        "¡{format} copiado!",
        "{format} copié !",
        "{format} kopiert!",
        "{format} をコピーしました！",
        "已复制 {format}！",
        "تم نسخ {format}!"
    ],
    "Single Email": [
        "एकल ईमेल",
        "Correo individual",
        "Adresse unique",
        "Einzelne E-Mail",
        "単一のメール",
        "单个电子邮件",
        "بريد مفرد"
    ],
    "Enter email address": [
        "ईमेल पता दर्ज करें",
        "Introduce una dirección de correo",
        "Saisissez une adresse e-mail",
        "E-Mail-Adresse eingeben",
        "メールアドレスを入力",
        "输入电子邮件地址",
        "أدخل عنوان البريد"
    ],
    "Valid syntax": [
        "वैध सिंटैक्स",
        "Sintaxis válida",
        "Syntaxe valide",
        "Gültige Syntax",
        "有効な構文",
        "语法有效",
        "صياغة صالحة"
    ],
    "Disposable": [
        "अस्थायी",
        "Desechable",
        "Jetable",
        "Wegwerfadresse",
        "使い捨て",
        "一次性",
        "مؤقت"
    ],
    "Role account": [
        "भूमिका खाता",
        "Cuenta de función",
        "Compte de fonction",
        "Funktionskonto",
        "役割アカウント",
        "职能账户",
        "حساب وظيفي"
    ],
    "Domain:": [
        "डोमेन:",
        "Dominio:",
        "Domaine :",
        "Domain:",
        "ドメイン:",
        "域名：",
        "النطاق:"
    ],
    "Local:": [
        "स्थानीय भाग:",
        "Parte local:",
        "Partie locale :",
        "Lokaler Teil:",
        "ローカル部:",
        "本地部分：",
        "الجزء المحلي:"
    ],
    "Bulk Validate": [
        "एक साथ सत्यापन",
        "Validación masiva",
        "Validation en lot",
        "Massenprüfung",
        "一括検証",
        "批量验证",
        "تحقق جماعي"
    ],
    "Allow disposable": [
        "अस्थायी स्वीकारें",
        "Permitir desechables",
        "Autoriser les adresses jetables",
        "Wegwerfadressen zulassen",
        "使い捨てを許可",
        "允许一次性邮箱",
        "السماح بالبريد المؤقت"
    ],
    "Allow role": [
        "भूमिका स्वीकारें",
        "Permitir cuentas de función",
        "Autoriser les comptes de fonction",
        "Funktionskonten zulassen",
        "役割アカウントを許可",
        "允许职能账户",
        "السماح بالحسابات الوظيفية"
    ],
    "One email per line": [
        "प्रति पंक्ति एक ईमेल",
        "Un correo por línea",
        "Une adresse par ligne",
        "Eine E-Mail pro Zeile",
        "1 行に 1 つのメール",
        "每行一个电子邮件地址",
        "بريد واحد لكل سطر"
    ],
    "Total: {count}": [
        "कुल: {count}",
        "Total: {count}",
        "Total : {count}",
        "Gesamt: {count}",
        "合計: {count}",
        "总计：{count}",
        "الإجمالي: {count}"
    ],
    "Valid: {count}": [
        "वैध: {count}",
        "Válidos: {count}",
        "Valides : {count}",
        "Gültig: {count}",
        "有効: {count}",
        "有效：{count}",
        "صالح: {count}"
    ],
    "Invalid: {count}": [
        "अमान्य: {count}",
        "No válidos: {count}",
        "Invalides : {count}",
        "Ungültig: {count}",
        "無効: {count}",
        "无效：{count}",
        "غير صالح: {count}"
    ],
    "Flags": [
        "फ़्लैग",
        "Indicadores",
        "Indicateurs",
        "Flags",
        "フラグ",
        "标志",
        "العلامات"
    ],
    "Empty": [
        "खाली",
        "Vacío",
        "Vide",
        "Leer",
        "空",
        "空",
        "فارغ"
    ],
    "Exceeds 254 chars": [
        "254 वर्णों से अधिक",
        "Supera 254 caracteres",
        "Dépasse 254 caractères",
        "Mehr als 254 Zeichen",
        "254 文字を超えています",
        "超过 254 个字符",
        "يتجاوز 254 حرفًا"
    ],
    "Invalid syntax": [
        "अमान्य सिंटैक्स",
        "Sintaxis no válida",
        "Syntaxe invalide",
        "Ungültige Syntax",
        "無効な構文",
        "语法无效",
        "صياغة غير صالحة"
    ],
    "Local part exceeds 64 chars": [
        "स्थानीय भाग 64 वर्णों से अधिक",
        "La parte local supera 64 caracteres",
        "La partie locale dépasse 64 caractères",
        "Lokaler Teil mit mehr als 64 Zeichen",
        "ローカル部が 64 文字を超えています",
        "本地部分超过 64 个字符",
        "الجزء المحلي يتجاوز 64 حرفًا"
    ],
    "Local part starts/ends with dot": [
        "स्थानीय भाग बिंदु से शुरू/समाप्त होता है",
        "La parte local empieza/termina con punto",
        "La partie locale commence/finit par un point",
        "Lokaler Teil beginnt/endet mit einem Punkt",
        "ローカル部の先頭または末尾がドットです",
        "本地部分以点开头或结尾",
        "الجزء المحلي يبدأ أو ينتهي بنقطة"
    ],
    "Consecutive dots in local part": [
        "स्थानीय भाग में लगातार बिंदु",
        "Puntos consecutivos en la parte local",
        "Points consécutifs dans la partie locale",
        "Aufeinanderfolgende Punkte im lokalen Teil",
        "ローカル部に連続するドットがあります",
        "本地部分有连续的点",
        "نقاط متتالية في الجزء المحلي"
    ],
    "Disposable domain": [
        "अस्थायी डोमेन",
        "Dominio desechable",
        "Domaine jetable",
        "Wegwerf-Domain",
        "使い捨てドメイン",
        "一次性域名",
        "نطاق مؤقت"
    ],
    "Role-based account": [
        "भूमिका आधारित खाता",
        "Cuenta basada en función",
        "Compte basé sur une fonction",
        "Rollenbasiertes Konto",
        "役割ベースのアカウント",
        "基于职能的账户",
        "حساب قائم على وظيفة"
    ],
    "disposable": [
        "अस्थायी",
        "desechable",
        "jetable",
        "Wegwerfadresse",
        "使い捨て",
        "一次性",
        "مؤقت"
    ],
    "role": [
        "भूमिका",
        "función",
        "fonction",
        "Funktion",
        "役割",
        "职能",
        "وظيفي"
    ],
    "Pick colors and convert between HEX, RGB, HSL": [
        "रंग चुनें और HEX, RGB, HSL के बीच बदलें",
        "Elige colores y convierte entre HEX, RGB y HSL",
        "Choisissez des couleurs et convertissez entre HEX, RGB et HSL",
        "Farben auswählen und zwischen HEX, RGB und HSL umwandeln",
        "色を選び、HEX・RGB・HSL 形式を変換",
        "选择颜色并在 HEX、RGB、HSL 之间转换",
        "اختر الألوان وحوّل بين HEX وRGB وHSL"
    ],
    "A color picker and converter tool for working with colors in different formats. It converts between HEX (#FF5733), RGB (255, 87, 51), and HSL (14°, 100%, 60%) color representations.": [
        "विभिन्न प्रारूपों में रंगों के लिए रंग चयन और रूपांतरण टूल। यह HEX (#FF5733), RGB (255, 87, 51) और HSL (14°, 100%, 60%) के बीच बदलता है।",
        "Una herramienta para elegir y convertir colores en distintos formatos: HEX (#FF5733), RGB (255, 87, 51) y HSL (14°, 100%, 60%).",
        "Un outil pour choisir et convertir les couleurs entre différents formats : HEX (#FF5733), RGB (255, 87, 51) et HSL (14°, 100%, 60%).",
        "Ein Werkzeug zur Farbauswahl und Umwandlung zwischen HEX (#FF5733), RGB (255, 87, 51) und HSL (14°, 100%, 60%).",
        "さまざまな形式の色を扱うカラーピッカーと変換ツールです。HEX (#FF5733)、RGB (255, 87, 51)、HSL (14°, 100%, 60%) の表現を相互変換します。",
        "用于处理不同格式颜色的取色与转换工具。可在 HEX (#FF5733)、RGB (255, 87, 51) 和 HSL (14°, 100%, 60%) 之间转换。",
        "أداة لاختيار الألوان وتحويلها بين صيغ HEX (#FF5733) وRGB (255, 87, 51) وHSL (14°, 100%, 60%)."
    ],
    "Different contexts require different color formats: CSS uses HEX or RGB, design tools use HSL. This tool helps designers and developers quickly convert and pick colors.": [
        "अलग संदर्भों में अलग रंग प्रारूप चाहिए: CSS में HEX या RGB और डिज़ाइन टूल में HSL। यह टूल डिज़ाइनरों और डेवलपरों को जल्दी रंग चुनने और बदलने में मदद करता है।",
        "Cada contexto requiere formatos distintos: CSS usa HEX o RGB y las herramientas de diseño usan HSL. Esta herramienta ayuda a diseñadores y desarrolladores a elegir y convertir colores rápidamente.",
        "Les contextes nécessitent différents formats : CSS utilise HEX ou RGB, les outils de conception HSL. Cet outil aide les designers et développeurs à choisir et convertir rapidement les couleurs.",
        "Verschiedene Kontexte erfordern verschiedene Farbformate: CSS nutzt HEX oder RGB, Designwerkzeuge HSL. Dieses Werkzeug hilft Designern und Entwicklern bei der schnellen Farbauswahl und Umwandlung.",
        "用途により色形式は異なり、CSS は HEX や RGB、デザインツールは HSL を使います。このツールは色の選択と変換をすばやく行うのに役立ちます。",
        "不同场景需要不同的颜色格式：CSS 使用 HEX 或 RGB，设计工具使用 HSL。此工具帮助设计师和开发者快速选择和转换颜色。",
        "تحتاج السياقات المختلفة إلى صيغ ألوان مختلفة: تستخدم CSS ‏HEX أو RGB وتستخدم أدوات التصميم HSL. تساعد الأداة المصممين والمطورين على اختيار الألوان وتحويلها بسرعة."
    ],
    "Use the color picker to select any color": [
        "रंग चयनक से कोई भी रंग चुनें",
        "Usa el selector para elegir cualquier color",
        "Utilisez le sélecteur pour choisir une couleur",
        "Wählen Sie mit dem Farbwähler eine Farbe",
        "カラーピッカーで任意の色を選択",
        "使用取色器选择任意颜色",
        "استخدم منتقي الألوان لاختيار أي لون"
    ],
    "View the color in HEX, RGB, and HSL formats": [
        "रंग HEX, RGB और HSL में देखें",
        "Ve el color en formatos HEX, RGB y HSL",
        "Affichez la couleur en HEX, RGB et HSL",
        "Sehen Sie die Farbe in HEX, RGB und HSL",
        "HEX・RGB・HSL 形式で色を確認",
        "查看 HEX、RGB 和 HSL 格式的颜色",
        "اعرض اللون بصيغ HEX وRGB وHSL"
    ],
    "Click any format to copy it to clipboard": [
        "किसी प्रारूप को क्लिपबोर्ड पर कॉपी करने के लिए क्लिक करें",
        "Haz clic en un formato para copiarlo al portapapeles",
        "Cliquez sur un format pour le copier dans le presse-papiers",
        "Klicken Sie auf ein Format, um es in die Zwischenablage zu kopieren",
        "形式をクリックしてクリップボードにコピー",
        "点击任意格式将其复制到剪贴板",
        "انقر أي صيغة لنسخها إلى الحافظة"
    ],
    "Enter a color code to convert to other formats": [
        "अन्य प्रारूपों में बदलने के लिए रंग कोड दर्ज करें",
        "Introduce un código de color para convertirlo a otros formatos",
        "Saisissez un code couleur pour le convertir vers d’autres formats",
        "Geben Sie einen Farbcode zur Umwandlung in andere Formate ein",
        "カラーコードを入力して他の形式に変換",
        "输入颜色代码以转换为其他格式",
        "أدخل رمز لون لتحويله إلى صيغ أخرى"
    ],
    "HSL is intuitive: Hue (color), Saturation, Lightness": [
        "HSL सहज है: ह्यू (रंग), संतृप्ति, हल्कापन",
        "HSL es intuitivo: tono (color), saturación y luminosidad",
        "HSL est intuitif : teinte (couleur), saturation, luminosité",
        "HSL ist anschaulich: Farbton, Sättigung, Helligkeit",
        "HSL は直感的：色相（色）、彩度、明度",
        "HSL 直观易懂：色相（颜色）、饱和度、明度",
        "HSL بديهي: درجة اللون والتشبع والإضاءة"
    ],
    "HEX is most common in CSS: #RRGGBB": [
        "CSS में HEX सबसे आम है: #RRGGBB",
        "HEX es el más común en CSS: #RRGGBB",
        "HEX est le plus courant en CSS : #RRGGBB",
        "HEX ist in CSS am verbreitetsten: #RRGGBB",
        "CSS で最も一般的な HEX: #RRGGBB",
        "HEX 在 CSS 中最常用：#RRGGBB",
        "HEX الأكثر شيوعًا في CSS: #RRGGBB"
    ],
    "RGB is used in most programming languages": [
        "अधिकांश प्रोग्रामिंग भाषाओं में RGB इस्तेमाल होता है",
        "RGB se usa en la mayoría de lenguajes de programación",
        "RGB est utilisé dans la plupart des langages de programmation",
        "RGB wird in den meisten Programmiersprachen verwendet",
        "RGB は多くのプログラミング言語で使用されます",
        "多数编程语言使用 RGB",
        "تُستخدم RGB في معظم لغات البرمجة"
    ],
    "RGBA/HSLA add alpha channel for transparency": [
        "RGBA/HSLA पारदर्शिता के लिए अल्फ़ा चैनल जोड़ते हैं",
        "RGBA/HSLA añaden un canal alfa para transparencia",
        "RGBA/HSLA ajoutent un canal alpha pour la transparence",
        "RGBA/HSLA ergänzen einen Alphakanal für Transparenz",
        "RGBA/HSLA は透明度用のアルファチャンネルを追加します",
        "RGBA/HSLA 添加用于透明度的 alpha 通道",
        "تضيف RGBA/HSLA قناة ألفا للشفافية"
    ],
    "Converting design colors to CSS formats": [
        "डिज़ाइन रंगों को CSS प्रारूप में बदलना",
        "Convertir colores de diseño a formatos CSS",
        "Convertir les couleurs de conception aux formats CSS",
        "Designfarben in CSS-Formate umwandeln",
        "デザインの色を CSS 形式に変換",
        "将设计颜色转换为 CSS 格式",
        "تحويل ألوان التصميم إلى صيغ CSS"
    ],
    "Creating color palettes for web projects": [
        "वेब परियोजनाओं के लिए रंग पैलेट बनाना",
        "Crear paletas de colores para proyectos web",
        "Créer des palettes pour des projets web",
        "Farbpaletten für Webprojekte erstellen",
        "Web プロジェクト用のパレットを作成",
        "为 Web 项目创建色板",
        "إنشاء لوحات ألوان لمشاريع الويب"
    ],
    "Adjusting colors using HSL for better control": [
        "बेहतर नियंत्रण के लिए HSL से रंग बदलना",
        "Ajustar colores con HSL para mayor control",
        "Ajuster les couleurs avec HSL pour plus de contrôle",
        "Farben mit HSL gezielt anpassen",
        "HSL で色を細かく調整",
        "使用 HSL 更精确地调整颜色",
        "ضبط الألوان باستخدام HSL لتحكم أفضل"
    ],
    "Finding complementary or analogous colors": [
        "पूरक या समान रंग खोजना",
        "Encontrar colores complementarios o análogos",
        "Trouver des couleurs complémentaires ou analogues",
        "Komplementäre oder analoge Farben finden",
        "補色や類似色を見つける",
        "查找互补色或类似色",
        "إيجاد ألوان متكاملة أو متجاورة"
    ],
    "Check email syntax, common disposable/role patterns and optional public DNS mail records": [
        "ईमेल सिंटैक्स, आम अस्थायी/भूमिका पैटर्न और वैकल्पिक सार्वजनिक DNS मेल रिकॉर्ड जाँचें",
        "Comprueba sintaxis de correo, patrones desechables/de función y, opcionalmente, registros DNS públicos de correo",
        "Vérifiez la syntaxe, les motifs jetables/de fonction et, en option, les enregistrements DNS publics de messagerie",
        "E-Mail-Syntax, typische Wegwerf-/Funktionsmuster und optional öffentliche DNS-Mail-Einträge prüfen",
        "メール構文、一般的な使い捨て・役割パターン、任意の公開 DNS メールレコードを確認",
        "检查邮件语法、常见一次性和职能模式，以及可选的公共 DNS 邮件记录",
        "افحص صياغة البريد وأنماط البريد المؤقت والوظيفي وسجلات بريد DNS العامة اختياريًا"
    ],
    "This practical ASCII email check validates common unquoted address syntax and flags issues like disposable temp-mail domains, role-based accounts (admin@, info@), excessive length, and malformed local parts.": [
        "यह व्यावहारिक ASCII ईमेल जाँच सामान्य बिना उद्धरण वाले पते का सिंटैक्स जाँचती है और अस्थायी मेल डोमेन, भूमिका खाते (admin@, info@), अधिक लंबाई तथा गलत स्थानीय भाग जैसी समस्याएँ बताती है।",
        "Esta comprobación práctica de correo ASCII valida la sintaxis común sin comillas y detecta dominios temporales, cuentas de función (admin@, info@), longitud excesiva y partes locales mal formadas.",
        "Cette vérification pratique des adresses ASCII valide la syntaxe courante sans guillemets et signale les domaines temporaires, comptes de fonction (admin@, info@), longueurs excessives et parties locales mal formées.",
        "Diese praktische ASCII-E-Mail-Prüfung validiert übliche unquotierte Adresssyntax und kennzeichnet Wegwerf-Domains, Funktionskonten (admin@, info@), Überlängen und fehlerhafte lokale Teile.",
        "一般的な引用符なし ASCII メールアドレスの構文を検証し、使い捨てメールドメイン、役割アカウント（admin@, info@）、長すぎるアドレス、不正なローカル部などを検出します。",
        "此实用 ASCII 邮件检查器验证常见的无引号地址语法，并标记临时邮箱域名、职能账户（admin@, info@）、长度超限及本地部分格式错误等问题。",
        "يتحقق فحص ASCII العملي من الصياغة الشائعة للعناوين غير المقتبسة ويرصد نطاقات البريد المؤقت والحسابات الوظيفية (admin@, info@) والطول الزائد والجزء المحلي المشوه."
    ],
    "Catch typos and bad submissions before they hit your database. Filter out disposable signups, identify role accounts that won't accept marketing mail, and clean bulk lists before importing into your CRM or mailing platform.": [
        "डेटाबेस तक पहुँचने से पहले टाइपिंग त्रुटियाँ और गलत प्रविष्टियाँ पकड़ें। अस्थायी साइनअप छाँटें, मार्केटिंग मेल न स्वीकारने वाले भूमिका खाते पहचानें, और CRM या मेल प्लेटफ़ॉर्म में आयात से पहले सूचियाँ साफ़ करें।",
        "Detecta errores antes de que lleguen a la base de datos. Filtra registros desechables, identifica cuentas de función que no acepten marketing y limpia listas antes de importarlas al CRM o plataforma de correo.",
        "Détectez les fautes avant leur entrée en base. Filtrez les inscriptions jetables, identifiez les comptes de fonction qui n’acceptent pas les messages marketing et nettoyez les listes avant import dans votre CRM ou plateforme d’envoi.",
        "Erkennen Sie Tippfehler und fehlerhafte Eingaben vor der Datenbank. Filtern Sie Wegwerf-Anmeldungen, erkennen Sie Funktionskonten, die keine Werbemails annehmen, und bereinigen Sie Listen vor dem Import in CRM oder Versandplattform.",
        "データベースに入る前に誤入力を検出します。使い捨てアドレスでの登録を除外し、マーケティングメールを受け付けない役割アカウントを見つけ、CRM や配信基盤へのインポート前に一括リストを整理します。",
        "在错误数据进入数据库前发现拼写和提交问题。过滤一次性注册、识别不接收营销邮件的职能账户，并在导入 CRM 或邮件平台前清理批量列表。",
        "اكتشف الأخطاء قبل وصولها لقاعدة البيانات. صفِّ التسجيلات المؤقتة وحدد الحسابات الوظيفية التي لا تقبل التسويق ونظّف القوائم قبل استيرادها إلى CRM أو منصة البريد."
    ],
    "Paste a single email address into the top field for instant validation": [
        "तुरंत सत्यापन के लिए ऊपर एक ईमेल पता चिपकाएँ",
        "Pega una dirección en el campo superior para validarla al instante",
        "Collez une adresse dans le champ supérieur pour une validation immédiate",
        "Fügen Sie oben eine E-Mail-Adresse zur Sofortprüfung ein",
        "上の欄にメールアドレスを貼り付けて即座に検証",
        "在顶部字段粘贴单个邮箱以即时验证",
        "ألصق بريدًا واحدًا في الحقل العلوي للتحقق فورًا"
    ],
    "Or paste many addresses (one per line) into the Bulk Validate panel": [
        "या सामूहिक सत्यापन पैनल में कई पते चिपकाएँ (प्रति पंक्ति एक)",
        "O pega muchas direcciones (una por línea) en el panel de validación masiva",
        "Ou collez plusieurs adresses (une par ligne) dans le panneau de validation en lot",
        "Oder fügen Sie mehrere Adressen (eine pro Zeile) in die Massenprüfung ein",
        "または一括検証パネルに複数のアドレスを貼り付けます（1 行に 1 つ）",
        "或在批量验证面板粘贴多个地址（每行一个）",
        "أو ألصق عدة عناوين (واحدًا لكل سطر) في لوحة التحقق الجماعي"
    ],
    "Toggle Disposable and Role filters to control what counts as valid": [
        "क्या वैध माना जाए यह तय करने के लिए अस्थायी और भूमिका फ़िल्टर बदलें",
        "Activa o desactiva los filtros de desechables y función para definir qué es válido",
        "Activez les filtres jetable et fonction pour définir les adresses valides",
        "Schalten Sie Wegwerf- und Funktionsfilter um, um gültige Adressen festzulegen",
        "使い捨てと役割フィルターを切り替え、有効とする条件を指定",
        "切换一次性和职能筛选器以决定有效条件",
        "بدّل مرشحات البريد المؤقت والوظيفي لتحديد الصالح"
    ],
    "This checker accepts common unquoted ASCII local parts; quoted addresses, comments and internationalized local parts need a fuller email parser.": [
        "यह जाँच सामान्य बिना उद्धरण वाले ASCII स्थानीय भाग स्वीकारती है; उद्धृत पते, टिप्पणियाँ और अंतरराष्ट्रीय स्थानीय भाग के लिए अधिक पूर्ण ईमेल पार्सर चाहिए।",
        "Este comprobador acepta partes locales ASCII comunes sin comillas; las direcciones entre comillas, comentarios y partes locales internacionalizadas requieren un analizador más completo.",
        "Ce vérificateur accepte les parties locales ASCII courantes sans guillemets ; les adresses entre guillemets, commentaires et parties locales internationalisées nécessitent un analyseur plus complet.",
        "Diese Prüfung akzeptiert übliche unquotierte ASCII-Lokalteile; quotierte Adressen, Kommentare und internationalisierte Lokalteile benötigen einen umfassenderen Parser.",
        "一般的な引用符なし ASCII ローカル部を扱います。引用符付きアドレス、コメント、国際化されたローカル部には、より完全なメールパーサーが必要です。",
        "此检查器接受常见的无引号 ASCII 本地部分；带引号地址、注释和国际化本地部分需要更完整的邮件解析器。",
        "يقبل الفاحص أجزاء ASCII المحلية الشائعة غير المقتبسة؛ وتحتاج العناوين المقتبسة والتعليقات والأجزاء المحلية الدولية إلى محلّل بريد أشمل."
    ],
    "Disposable lookups use a built-in list of common temp-mail domains": [
        "अस्थायी जाँच आम अस्थायी मेल डोमेन की अंतर्निहित सूची इस्तेमाल करती है",
        "La detección de desechables usa una lista integrada de dominios temporales comunes",
        "La détection des adresses jetables utilise une liste intégrée de domaines temporaires courants",
        "Die Wegwerfprüfung nutzt eine integrierte Liste verbreiteter temporärer Mail-Domains",
        "使い捨ての判定には一般的な一時メールドメインの内蔵リストを使用",
        "一次性邮箱检测使用内置的常见临时邮箱域名列表",
        "يستخدم كشف البريد المؤقت قائمة مدمجة بالنطاقات المؤقتة الشائعة"
    ],
    "Use the optional DNS-over-HTTPS check below to inspect MX records; mailbox verification still requires a mail-delivery workflow.": [
        "MX रिकॉर्ड देखने के लिए नीचे वैकल्पिक DNS-over-HTTPS जाँच इस्तेमाल करें; मेलबॉक्स सत्यापन के लिए अब भी मेल-डिलीवरी प्रक्रिया चाहिए।",
        "Usa la comprobación opcional DNS-over-HTTPS de abajo para inspeccionar registros MX; verificar un buzón sigue requiriendo un flujo de entrega de correo.",
        "Utilisez la vérification DNS-over-HTTPS facultative ci-dessous pour examiner les MX ; vérifier une boîte mail nécessite toujours un processus de livraison de courrier.",
        "Nutzen Sie die optionale DNS-over-HTTPS-Prüfung unten für MX-Einträge; die Postfachprüfung erfordert weiterhin einen Mailzustellungsablauf.",
        "下の任意の DNS-over-HTTPS チェックで MX レコードを確認できます。メールボックスの確認には引き続きメール配信の手順が必要です。",
        "使用下方可选的 DNS-over-HTTPS 检查来查看 MX 记录；邮箱验证仍需邮件投递流程。",
        "استخدم فحص DNS-over-HTTPS الاختياري أدناه لفحص سجلات MX؛ يظل التحقق من صندوق البريد بحاجة إلى إجراء تسليم بريد."
    ],
    "Cleaning email lists before bulk send": [
        "सामूहिक भेजने से पहले ईमेल सूची साफ़ करना",
        "Limpiar listas antes de envíos masivos",
        "Nettoyer les listes avant un envoi en masse",
        "E-Mail-Listen vor Massenversand bereinigen",
        "一括送信前にメールリストを整理",
        "群发前清理邮件列表",
        "تنظيف قوائم البريد قبل الإرسال الجماعي"
    ],
    "Pre-validating signup forms client-side": [
        "क्लाइंट पर साइनअप फ़ॉर्म का पूर्व-सत्यापन",
        "Prevalidar formularios de registro en el cliente",
        "Prévalider les formulaires d’inscription côté client",
        "Registrierungsformulare clientseitig vorprüfen",
        "クライアント側で登録フォームを事前検証",
        "在客户端预先验证注册表单",
        "التحقق المسبق من نماذج التسجيل في المتصفح"
    ],
    "Auditing CRM exports for bad addresses": [
        "गलत पतों के लिए CRM निर्यात जाँचना",
        "Auditar exportaciones CRM para detectar direcciones incorrectas",
        "Auditer les exports CRM pour détecter les mauvaises adresses",
        "CRM-Exporte auf fehlerhafte Adressen prüfen",
        "CRM エクスポートの不正なアドレスを監査",
        "审核 CRM 导出中的错误地址",
        "تدقيق صادرات CRM بحثًا عن عناوين خاطئة"
    ],
    "Email": [
        "ईमेल",
        "Correo electrónico",
        "E-mail",
        "E-Mail",
        "メール",
        "电子邮件",
        "البريد الإلكتروني"
    ],
    "Status": [
        "स्थिति",
        "Estado",
        "État",
        "Status",
        "状態",
        "状态",
        "الحالة"
    ],
    "Invalid": [
        "अमान्य",
        "No válido",
        "Invalide",
        "Ungültig",
        "無効",
        "无效",
        "غير صالح"
    ],
    "Valid": [
        "वैध",
        "Válido",
        "Valide",
        "Gültig",
        "有効",
        "有效",
        "صالح"
    ]
};
