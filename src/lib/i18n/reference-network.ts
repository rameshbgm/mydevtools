import type { TranslationColumns } from "./tool-names";

// Hindi, Spanish, French, German, Japanese, Simplified Chinese, Arabic.
// IANA/RFC identifiers, CIDRs, registered protocol names and product names remain exact.
export const REFERENCE_NETWORK_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Copy {value}": [
        "{value} कॉपी करें",
        "Copiar {value}",
        "Copier {value}",
        "{value} kopieren",
        "{value}をコピー",
        "复制 {value}",
        "نسخ {value}"
    ],
    "Service": [
        "सेवा",
        "Servicio",
        "Service",
        "Dienst",
        "サービス",
        "服务",
        "الخدمة"
    ],
    "Local reference of selected common ports, protocols and service conventions": [
        "चुने सामान्य पोर्ट, प्रोटोकॉल और सेवा परंपराओं का स्थानीय संदर्भ",
        "Referencia local de puertos, protocolos y convenciones de servicios seleccionados",
        "Référence locale de ports, protocoles et conventions de services sélectionnés",
        "Lokale Referenz ausgewählter Ports, Protokolle und Dienstkonventionen",
        "代表的なポート、プロトコル、サービス慣例のローカル資料",
        "常见端口、协议和服务惯例的本地精选参考",
        "مرجع محلي مختار للمنافذ والبروتوكولات وأعراف الخدمات"
    ],
    "A curated local list of common port conventions, not the full IANA registry or a live network scan. A port can host several services, and services can use other ports.": [
        "यह सामान्य पोर्ट परंपराओं की स्थानीय सूची है, पूरी IANA रजिस्ट्री या नेटवर्क स्कैन नहीं। एक पोर्ट पर कई सेवाएं और एक सेवा के लिए दूसरे पोर्ट हो सकते हैं।",
        "Lista local de convenciones comunes, no el registro IANA completo ni un escaneo. Un puerto puede tener varios servicios y un servicio usar otros puertos.",
        "Liste locale de conventions courantes, pas le registre IANA complet ni un scan réseau. Plusieurs services peuvent partager un port et utiliser d’autres ports.",
        "Lokale Auswahl üblicher Portkonventionen, weder vollständige IANA-Registrierung noch Netzwerkscan. Ein Port kann mehrere Dienste haben; Dienste können andere Ports nutzen.",
        "一般的なポート慣例のローカル一覧です。IANA全件やネットワークスキャンではありません。同じポートに複数のサービスがあり、別のポートを使う場合もあります。",
        "常见端口惯例的本地精选列表，并非完整 IANA 注册表或网络扫描。一个端口可承载多个服务，服务也可使用其他端口。",
        "قائمة محلية لأعراف المنافذ الشائعة، وليست سجل IANA كاملًا أو فحص شبكة. قد يستضيف منفذ عدة خدمات وقد تستخدم الخدمات منافذ أخرى."
    ],
    "Enter a whole port number from 0 to 65535 for all listed matches. Search service names, descriptions or numbers; combine category, protocol and security-hint filters. Copy buttons copy raw port numbers.": [
        "0 से 65535 का पूर्ण पोर्ट नंबर भरकर सभी सूचीबद्ध मेल देखें। नाम, विवरण या नंबर खोजें और श्रेणी, प्रोटोकॉल व सुरक्षा संकेत के फ़िल्टर मिलाएं। कॉपी से मूल पोर्ट नंबर मिलता है।",
        "Introduce un entero de 0 a 65535 para ver todas las coincidencias. Busca nombres, descripciones o números y combina filtros. Copiar conserva el número original.",
        "Entrez un entier de 0 à 65535 pour toutes les correspondances. Recherchez noms, descriptions ou numéros et combinez les filtres. Copier conserve le numéro brut.",
        "Ganze Portnummer von 0 bis 65535 für alle Treffer eingeben. Namen, Beschreibungen oder Nummern suchen und Filter kombinieren. Kopieren übernimmt die rohe Portnummer.",
        "0～65535の整数を入力すると全一致を表示します。名前・説明・番号で検索し、分類・プロトコル・安全性の目安を組み合わせて絞れます。コピーは元の番号です。",
        "输入 0–65535 的整数端口号查看所有匹配项。搜索名称、描述或号码，并组合分类、协议及安全提示筛选。复制按钮复制原始端口号。",
        "أدخل عددًا صحيحًا من 0 إلى 65535 لعرض كل المطابقات. ابحث بالأسماء أو الأوصاف أو الأرقام واجمع المرشحات. ينسخ الزر رقم المنفذ الأصلي."
    ],
    "Port numbers and security hints do not prove which service or encryption is actually running. Confirm the server configuration and IANA registration before using a port in firewall rules.": [
        "पोर्ट नंबर और सुरक्षा संकेत चल रही सेवा या एन्क्रिप्शन का प्रमाण नहीं हैं। फ़ायरवॉल नियमों से पहले सर्वर कॉन्फ़िगरेशन और IANA पंजीकरण जांचें।",
        "El número y los indicios de seguridad no prueban el servicio o cifrado activo. Confirma configuración e inscripción IANA antes de crear reglas de cortafuegos.",
        "Le numéro et les indices de sécurité ne prouvent ni service ni chiffrement actif. Vérifiez configuration et inscription IANA avant les règles de pare-feu.",
        "Portnummern und Sicherheitshinweise belegen keine aktiven Dienste oder Verschlüsselung. Vor Firewallregeln Serverkonfiguration und IANA-Eintrag prüfen.",
        "ポート番号や安全性の目安だけでは稼働サービスや暗号化を確認できません。ファイアウォール設定前にサーバー設定とIANA登録を確認してください。",
        "端口号和安全提示无法证明实际运行的服务或加密方式。用于防火墙规则前请确认服务器配置和 IANA 注册信息。",
        "أرقام المنافذ ومؤشرات الأمان لا تثبت الخدمة أو التشفير الفعلي. تحقّق من إعداد الخادم وتسجيل IANA قبل قواعد الجدار الناري."
    ],
    "Quick Port Lookup": [
        "त्वरित पोर्ट खोज",
        "Consulta rápida de puerto",
        "Recherche rapide de port",
        "Schnelle Portsuche",
        "ポート簡易検索",
        "快速端口查询",
        "بحث سريع عن منفذ"
    ],
    "Enter port number (e.g., 443)": [
        "पोर्ट नंबर भरें (जैसे 443)",
        "Introduce un puerto (p. ej., 443)",
        "Entrez un port (ex. 443)",
        "Portnummer eingeben (z. B. 443)",
        "ポート番号を入力（例：443）",
        "输入端口号（如 443）",
        "أدخل رقم منفذ (مثل 443)"
    ],
    "Secure": [
        "सुरक्षित",
        "Seguro",
        "Sécurisé",
        "Sicher",
        "保護あり",
        "安全",
        "آمن"
    ],
    "Insecure": [
        "असुरक्षित",
        "Inseguro",
        "Non sécurisé",
        "Unsicher",
        "保護なし",
        "不安全",
        "غير آمن"
    ],
    "No listed service for port {port}": [
        "पोर्ट {port} की सेवा सूचीबद्ध नहीं",
        "No hay servicio listado para el puerto {port}",
        "Aucun service listé pour le port {port}",
        "Kein aufgeführter Dienst für Port {port}",
        "ポート{port}のサービスは未掲載",
        "未列出端口 {port} 的服务",
        "لا توجد خدمة مدرجة للمنفذ {port}"
    ],
    "Enter a whole port number from 0 to 65535.": [
        "0 से 65535 के बीच पूर्ण पोर्ट नंबर भरें।",
        "Introduce un puerto entero de 0 a 65535.",
        "Entrez un numéro de port entier de 0 à 65535.",
        "Ganze Portnummer von 0 bis 65535 eingeben.",
        "0～65535の整数を入力してください。",
        "请输入 0 到 65535 的整数端口号。",
        "أدخل رقم منفذ صحيحًا من 0 إلى 65535."
    ],
    "This is a local reference. It does not check whether a port is open or registered.": [
        "यह स्थानीय संदर्भ है। यह पोर्ट खुला होने या पंजीकृत होने की जांच नहीं करता।",
        "Referencia local: no comprueba si el puerto está abierto o registrado.",
        "Référence locale : ne vérifie pas si un port est ouvert ou enregistré.",
        "Lokale Referenz; prüft weder offene Ports noch Registrierung.",
        "ローカル資料です。開放状態や登録状態は調べません。",
        "这是本地参考，不检查端口是否开放或已注册。",
        "هذا مرجع محلي ولا يفحص فتح المنفذ أو تسجيله."
    ],
    "Search reference": [
        "संदर्भ खोजें",
        "Buscar referencia",
        "Rechercher dans la référence",
        "Referenz durchsuchen",
        "資料を検索",
        "搜索参考",
        "بحث في المرجع"
    ],
    "Search ports, services, descriptions...": [
        "पोर्ट, सेवाएं और विवरण खोजें…",
        "Buscar puertos, servicios, descripciones…",
        "Rechercher ports, services, descriptions…",
        "Ports, Dienste, Beschreibungen suchen…",
        "ポート・サービス・説明を検索…",
        "搜索端口、服务、描述…",
        "ابحث عن منافذ وخدمات وأوصاف…"
    ],
    "All Protocols": [
        "सभी प्रोटोकॉल",
        "Todos los protocolos",
        "Tous les protocoles",
        "Alle Protokolle",
        "すべてのプロトコル",
        "所有协议",
        "كل البروتوكولات"
    ],
    "All": [
        "सभी",
        "Todos",
        "Tous",
        "Alle",
        "すべて",
        "全部",
        "الكل"
    ],
    "🔒 Secure Only": [
        "🔒 केवल सुरक्षित",
        "🔒 Solo seguros",
        "🔒 Sécurisés uniquement",
        "🔒 Nur sichere",
        "🔒 保護ありのみ",
        "🔒 仅安全",
        "🔒 الآمنة فقط"
    ],
    "⚠️ Insecure Only": [
        "⚠️ केवल असुरक्षित",
        "⚠️ Solo inseguros",
        "⚠️ Non sécurisés uniquement",
        "⚠️ Nur unsichere",
        "⚠️ 保護なしのみ",
        "⚠️ 仅不安全",
        "⚠️ غير الآمنة فقط"
    ],
    "{count} ports": [
        "{count} पोर्ट",
        "{count} puertos",
        "{count} ports",
        "{count} Ports",
        "{count}ポート",
        "{count} 个端口",
        "{count} منافذ"
    ],
    "Port Number Ranges": [
        "पोर्ट नंबर की सीमाएं",
        "Rangos de números de puerto",
        "Plages de numéros de port",
        "Portnummernbereiche",
        "ポート番号の範囲",
        "端口号范围",
        "نطاقات أرقام المنافذ"
    ],
    "Well-Known Ports": [
        "प्रसिद्ध पोर्ट",
        "Puertos conocidos",
        "Ports bien connus",
        "Bekannte Ports",
        "ウェルノウンポート",
        "知名端口",
        "المنافذ المعروفة"
    ],
    "System ports; binding restrictions depend on the operating system and configuration.": [
        "सिस्टम पोर्ट; बाइंड की पाबंदियां OS और कॉन्फ़िगरेशन पर निर्भर हैं।",
        "Puertos del sistema; las restricciones dependen del SO y la configuración.",
        "Ports système ; restrictions de liaison selon le système et sa configuration.",
        "Systemports; Bindebeschränkungen hängen von Betriebssystem und Konfiguration ab.",
        "システムポートです。バインド制限はOSと設定に依存します。",
        "系统端口；绑定限制取决于操作系统和配置。",
        "منافذ النظام؛ قيود الربط حسب نظام التشغيل والإعدادات."
    ],
    "Registered Ports": [
        "पंजीकृत पोर्ट",
        "Puertos registrados",
        "Ports enregistrés",
        "Registrierte Ports",
        "登録ポート",
        "注册端口",
        "المنافذ المسجلة"
    ],
    "User ports; consult IANA for individual registrations.": [
        "उपयोगकर्ता पोर्ट; हर पंजीकरण के लिए IANA देखें।",
        "Puertos de usuario; consulta IANA para cada registro.",
        "Ports utilisateur ; consultez IANA pour chaque inscription.",
        "Benutzerports; einzelne Registrierungen bei IANA prüfen.",
        "ユーザーポートです。個々の登録はIANAを参照してください。",
        "用户端口；具体注册信息请查询 IANA。",
        "منافذ المستخدم؛ راجع IANA للتسجيلات الفردية."
    ],
    "Dynamic/Ephemeral": [
        "डायनेमिक/अस्थायी",
        "Dinámicos/efímeros",
        "Dynamiques/éphémères",
        "Dynamisch/kurzlebig",
        "動的・一時ポート",
        "动态／临时",
        "ديناميكية/مؤقتة"
    ],
    "Dynamic/private ports; IANA does not assign these to services.": [
        "डायनेमिक/निजी पोर्ट; IANA इन्हें सेवाओं को नहीं देता।",
        "Puertos dinámicos/privados; IANA no los asigna a servicios.",
        "Ports dynamiques/privés ; IANA ne les attribue pas aux services.",
        "Dynamische/private Ports; IANA weist sie keinen Diensten zu.",
        "動的・プライベートポートはIANAがサービスに割り当てません。",
        "动态／私有端口；IANA 不将其分配给服务。",
        "منافذ ديناميكية/خاصة؛ لا تخصصها IANA للخدمات."
    ],
    "RFC": [
        "RFC",
        "RFC",
        "RFC",
        "RFC",
        "RFC",
        "RFC",
        "RFC"
    ],
    "Addresses in block": [
        "ब्लॉक के कुल पते",
        "Direcciones del bloque",
        "Adresses du bloc",
        "Adressen im Block",
        "ブロック内のアドレス数",
        "地址块总数",
        "عناوين الكتلة"
    ],
    "Reference guide for private, reserved, and special-use IP address ranges": [
        "निजी, आरक्षित और विशेष उपयोग IP सीमाओं का संदर्भ",
        "Guía de rangos IP privados, reservados y especiales",
        "Guide des plages IP privées, réservées et spéciales",
        "Referenz für private, reservierte und besondere IP-Bereiche",
        "プライベート・予約・特殊用途IPアドレスの資料",
        "私有、保留及特殊用途 IP 地址范围参考",
        "مرجع نطاقات IP الخاصة والمحجوزة وذات الاستخدام الخاص"
    ],
    "A curated local reference for selected IPv4 and IPv6 special-purpose blocks. It is not a complete registry or a live reachability test. More-specific allocations can have different rules.": [
        "चुने विशेष IPv4 और IPv6 ब्लॉकों का स्थानीय संदर्भ। पूरी रजिस्ट्री या लाइव पहुंच जांच नहीं है। अधिक विशिष्ट आवंटन के अलग नियम हो सकते हैं।",
        "Referencia local de bloques IPv4 e IPv6 especiales seleccionados. No es un registro completo ni prueba de acceso en vivo. Las asignaciones más específicas pueden tener otras reglas.",
        "Référence locale de blocs spéciaux IPv4 et IPv6 sélectionnés. Ni registre complet ni test d’accessibilité en direct. Des allocations plus précises peuvent avoir d’autres règles.",
        "Lokale Auswahl besonderer IPv4- und IPv6-Blöcke. Kein vollständiges Register oder Live-Erreichbarkeitstest. Spezifischere Zuteilungen können andere Regeln haben.",
        "代表的なIPv4・IPv6特殊用途ブロックのローカル資料です。全件登録表や到達性テストではなく、より細かい割当に別の規則がある場合があります。",
        "IPv4 和 IPv6 特殊用途块的本地精选参考。并非完整注册表或实时可达性测试。更具体的分配可能适用不同规则。",
        "مرجع محلي مختار لكتل IPv4 وIPv6 الخاصة. ليس سجلًا كاملًا أو فحص وصول مباشر. قد تختلف قواعد التخصيصات الأكثر تحديدًا."
    ],
    "Select IPv4 or IPv6, search CIDRs, RFC identifiers or descriptions, and filter by category. Expand rows for context. Copy buttons copy the CIDR exactly.": [
        "IPv4 या IPv6 चुनें, CIDR, RFC या विवरण खोजें और श्रेणी फ़िल्टर लगाएं। विवरण के लिए पंक्ति खोलें। कॉपी बटन CIDR को ठीक उसी रूप में कॉपी करता है।",
        "Elige IPv4 o IPv6, busca CIDR, RFC o descripciones y filtra por categoría. Expande filas para contexto. Copiar conserva el CIDR exacto.",
        "Choisissez IPv4 ou IPv6, cherchez CIDR, RFC ou descriptions et filtrez par catégorie. Dépliez pour le contexte. Copier préserve exactement le CIDR.",
        "IPv4 oder IPv6 wählen, nach CIDR, RFC oder Beschreibung suchen und Kategorie filtern. Zeilen für Kontext aufklappen. Kopieren erhält das exakte CIDR.",
        "IPv4かIPv6を選び、CIDR・RFC・説明で検索して分類で絞ります。行を展開すると詳細を確認でき、CIDRをそのままコピーできます。",
        "选择 IPv4 或 IPv6，搜索 CIDR、RFC 标识或描述，并按类别筛选。展开行查看详细信息。复制按钮保留 CIDR 原文。",
        "اختر IPv4 أو IPv6 وابحث عن CIDR أو RFC أو الوصف ورشّح بالفئة. وسّع الصف للسياق. ينسخ الزر CIDR كما هو."
    ],
    "Address counts describe the entire CIDR block, not usable hosts. Routing and host-assignment rules depend on the allocation and subnet. Check the linked IANA registries and RFCs for exceptions.": [
        "गिनती पूरे CIDR ब्लॉक की है, उपयोग योग्य होस्ट की नहीं। रूटिंग और होस्ट आवंटन के नियम ब्लॉक और सबनेट पर निर्भर हैं। अपवादों के लिए IANA और RFC लिंक देखें।",
        "Las cifras cuentan todo el bloque CIDR, no hosts utilizables. Las reglas dependen de la asignación y subred. Consulta IANA y los RFC para excepciones.",
        "Les nombres couvrent tout le bloc CIDR, pas les hôtes utilisables. Les règles dépendent de l’allocation et du sous-réseau. Consultez IANA et les RFC pour les exceptions.",
        "Zahlen zählen den ganzen CIDR-Block, keine nutzbaren Hosts. Regeln hängen von Zuteilung und Subnetz ab. Ausnahmen bei IANA und in den RFCs prüfen.",
        "数はCIDRブロック全体で、使用可能ホスト数ではありません。経路やホスト割当規則は割当・サブネットに依存します。例外はIANAとRFCを確認してください。",
        "数量表示整个 CIDR 块，并非可用主机数。路由和主机分配规则取决于分配与子网。例外请查阅 IANA 注册表和 RFC。",
        "الأعداد تشمل كتلة CIDR كاملة لا المضيفين القابلين للاستخدام. تعتمد القواعد على التخصيص والشبكة الفرعية. راجع IANA وRFC للاستثناءات."
    ],
    "Search ranges, descriptions, RFCs...": [
        "सीमा, विवरण और RFC खोजें…",
        "Buscar rangos, descripciones, RFC…",
        "Rechercher plages, descriptions, RFC…",
        "Bereiche, Beschreibungen, RFCs suchen…",
        "範囲・説明・RFCを検索…",
        "搜索范围、描述、RFC…",
        "ابحث عن نطاقات وأوصاف وRFC…"
    ],
    "{count} ranges": [
        "{count} सीमाएं",
        "{count} rangos",
        "{count} plages",
        "{count} Bereiche",
        "{count}範囲",
        "{count} 个范围",
        "{count} نطاقات"
    ],
    "IPv4 Ranges": [
        "IPv4 सीमाएं",
        "Rangos IPv4",
        "Plages IPv4",
        "IPv4-Bereiche",
        "IPv4の範囲",
        "IPv4 范围",
        "نطاقات IPv4"
    ],
    "IPv6 Ranges": [
        "IPv6 सीमाएं",
        "Rangos IPv6",
        "Plages IPv6",
        "IPv6-Bereiche",
        "IPv6の範囲",
        "IPv6 范围",
        "نطاقات IPv6"
    ],
    "Range:": [
        "सीमा:",
        "Rango:",
        "Plage :",
        "Bereich:",
        "範囲：",
        "范围：",
        "النطاق:"
    ],
    "Details:": [
        "विवरण:",
        "Detalles:",
        "Détails :",
        "Details:",
        "詳細：",
        "详情：",
        "التفاصيل:"
    ],
    "Private Ranges": [
        "निजी सीमाएं",
        "Rangos privados",
        "Plages privées",
        "Private Bereiche",
        "プライベート範囲",
        "私有范围",
        "النطاقات الخاصة"
    ],
    "— 16,777,216 addresses": [
        "— 16,777,216 पते",
        "— 16,777,216 direcciones",
        "— 16,777,216 adresses",
        "— 16,777,216 Adressen",
        "— 16,777,216アドレス",
        "— 16,777,216 个地址",
        "— 16,777,216 عنوانًا"
    ],
    "— 1,048,576 addresses": [
        "— 1,048,576 पते",
        "— 1,048,576 direcciones",
        "— 1,048,576 adresses",
        "— 1,048,576 Adressen",
        "— 1,048,576アドレス",
        "— 1,048,576 个地址",
        "— 1,048,576 عنوانًا"
    ],
    "— 65,536 addresses": [
        "— 65,536 पते",
        "— 65,536 direcciones",
        "— 65,536 adresses",
        "— 65,536 Adressen",
        "— 65,536アドレス",
        "— 65,536 个地址",
        "— 65,536 عنوانًا"
    ],
    "Documentation Ranges": [
        "दस्तावेज़ीकरण सीमाएं",
        "Rangos para documentación",
        "Plages de documentation",
        "Dokumentationsbereiche",
        "文書用範囲",
        "文档范围",
        "نطاقات التوثيق"
    ],
    "Reserved for examples": [
        "उदाहरणों के लिए आरक्षित",
        "Reservado para ejemplos",
        "Réservé aux exemples",
        "Für Beispiele reserviert",
        "例示用に予約",
        "保留用于示例",
        "محجوز للأمثلة"
    ],
    "Use these in tutorials, docs, and training": [
        "ट्यूटोरियल, दस्तावेज़ और प्रशिक्षण में प्रयोग करें",
        "Úsalos en tutoriales, documentación y formación",
        "À utiliser dans les tutoriels, documents et formations",
        "Für Anleitungen, Dokumentation und Schulung verwenden",
        "チュートリアル、文書、研修で使用",
        "用于教程、文档和培训",
        "استخدمها في الشروح والتوثيق والتدريب"
    ],
    "2001:db8::/32": [
        "2001:db8::/32",
        "2001:db8::/32",
        "2001:db8::/32",
        "2001:db8::/32",
        "2001:db8::/32",
        "2001:db8::/32",
        "2001:db8::/32"
    ],
    "— IPv6 documentation": [
        "— IPv6 दस्तावेज़",
        "— documentación IPv6",
        "— documentation IPv6",
        "— IPv6-Dokumentation",
        "— IPv6文書用",
        "— IPv6 文档",
        "— توثيق IPv6"
    ],
    "Special Addresses": [
        "विशेष पते",
        "Direcciones especiales",
        "Adresses spéciales",
        "Besondere Adressen",
        "特殊アドレス",
        "特殊地址",
        "العناوين الخاصة"
    ],
    "— localhost (IPv4)": [
        "— localhost (IPv4)",
        "— localhost (IPv4)",
        "— localhost (IPv4)",
        "— localhost (IPv4)",
        "— localhost（IPv4）",
        "— localhost（IPv4）",
        "— localhost ‏(IPv4)"
    ],
    "— localhost (IPv6)": [
        "— localhost (IPv6)",
        "— localhost (IPv6)",
        "— localhost (IPv6)",
        "— localhost (IPv6)",
        "— localhost（IPv6）",
        "— localhost（IPv6）",
        "— localhost ‏(IPv6)"
    ],
    "— wildcard bind address": [
        "— वाइल्डकार्ड बाइंड पता",
        "— dirección comodín de enlace",
        "— adresse de liaison générique",
        "— Platzhalter-Bindeadresse",
        "— ワイルドカードのバインド先",
        "— 通配绑定地址",
        "— عنوان ربط شامل"
    ],
    "— broadcast": [
        "— प्रसारण",
        "— difusión",
        "— diffusion",
        "— Broadcast",
        "— ブロードキャスト",
        "— 广播",
        "— بث"
    ],
    "Cloud Provider Range Sources": [
        "क्लाउड प्रदाताओं के बाहरी सीमा स्रोत",
        "Fuentes externas de rangos de proveedores cloud",
        "Sources externes des plages cloud",
        "Externe Cloud-Anbieter-Bereichsquellen",
        "クラウド範囲の外部資料",
        "云服务商范围外部来源",
        "مصادر خارجية لنطاقات مزودي السحابة"
    ],
    "Cloud range feeds change independently of this local reference. These links open provider sources; the page does not fetch or validate their current contents.": [
        "क्लाउड सीमा फ़ीड इस स्थानीय संदर्भ से स्वतंत्र बदलती हैं। लिंक प्रदाता स्रोत खोलते हैं; यह पृष्ठ उनकी वर्तमान सामग्री नहीं लाता या जांचता।",
        "Las fuentes cloud cambian independientemente de esta referencia local. Los enlaces abren fuentes del proveedor; la página no obtiene ni valida su contenido actual.",
        "Les sources cloud changent indépendamment de cette référence locale. Les liens ouvrent les fournisseurs ; la page ne charge ni ne valide leur contenu actuel.",
        "Cloud-Feeds ändern sich unabhängig von dieser lokalen Referenz. Links öffnen Anbieterquellen; die Seite lädt oder prüft deren aktuelle Inhalte nicht.",
        "クラウド範囲のフィードはこの資料と独立して変更されます。リンク先は事業者の資料で、このページでは取得・検証しません。",
        "云地址范围源独立于此本地参考更新。链接会打开服务商来源；本页面不获取或验证其当前内容。",
        "تتغير موجزات السحابة مستقلّة عن هذا المرجع. تفتح الروابط مصادر المزوّد؛ لا تجلب الصفحة محتواها الحالي أو تتحقق منه."
    ],
    "File Transfer Protocol (data transfer)": [
        "File Transfer Protocol (डेटा स्थानांतरण)",
        "File Transfer Protocol (transferencia de datos)",
        "File Transfer Protocol (transfert de données)",
        "File Transfer Protocol (Datenübertragung)",
        "File Transfer Protocol（データ転送）",
        "File Transfer Protocol（数据传输）",
        "File Transfer Protocol (نقل البيانات)"
    ],
    "File Transfer": [
        "फ़ाइल स्थानांतरण",
        "Transferencia de archivos",
        "Transfert de fichiers",
        "Dateiübertragung",
        "ファイル転送",
        "文件传输",
        "نقل الملفات"
    ],
    "File Transfer Protocol (control)": [
        "File Transfer Protocol (नियंत्रण)",
        "File Transfer Protocol (control)",
        "File Transfer Protocol (contrôle)",
        "File Transfer Protocol (Steuerung)",
        "File Transfer Protocol（制御）",
        "File Transfer Protocol（控制）",
        "File Transfer Protocol (التحكم)"
    ],
    "Secure Shell - encrypted remote access and file transfer": [
        "Secure Shell — एन्क्रिप्टेड दूरस्थ पहुंच और फ़ाइल स्थानांतरण",
        "Secure Shell: acceso remoto y archivos cifrados",
        "Secure Shell : accès distant et transfert chiffrés",
        "Secure Shell: verschlüsselter Fernzugriff und Dateitransfer",
        "Secure Shell：暗号化した遠隔アクセスと転送",
        "Secure Shell：加密远程访问和文件传输",
        "Secure Shell: وصول بعيد ونقل ملفات مشفّر"
    ],
    "Remote Access": [
        "दूरस्थ पहुंच",
        "Acceso remoto",
        "Accès distant",
        "Fernzugriff",
        "リモートアクセス",
        "远程访问",
        "الوصول البعيد"
    ],
    "Unencrypted text communications (legacy)": [
        "बिना एन्क्रिप्शन का पाठ संचार (पुराना)",
        "Comunicación de texto sin cifrar (heredada)",
        "Communication texte non chiffrée (ancienne)",
        "Unverschlüsselte Textkommunikation (veraltet)",
        "暗号化しないテキスト通信（旧式）",
        "未加密文本通信（旧式）",
        "اتصال نصي غير مشفّر (قديم)"
    ],
    "Simple Mail Transfer Protocol - email sending": [
        "Simple Mail Transfer Protocol — ईमेल भेजना",
        "Simple Mail Transfer Protocol: envío de correo",
        "Simple Mail Transfer Protocol : envoi de courriels",
        "Simple Mail Transfer Protocol: E-Mail-Versand",
        "Simple Mail Transfer Protocol：メール送信",
        "Simple Mail Transfer Protocol：发送电子邮件",
        "Simple Mail Transfer Protocol: إرسال البريد"
    ],
    "Domain Name System - translates domain names to IPs": [
        "Domain Name System — डोमेन नाम से IP",
        "Domain Name System: traduce dominios a IP",
        "Domain Name System : noms de domaine vers IP",
        "Domain Name System: Domainnamen in IP-Adressen",
        "Domain Name System：名前をIPに変換",
        "Domain Name System：将域名解析为 IP",
        "Domain Name System: تحويل الأسماء إلى IP"
    ],
    "Network Infrastructure": [
        "नेटवर्क अवसंरचना",
        "Infraestructura de red",
        "Infrastructure réseau",
        "Netzwerkinfrastruktur",
        "ネットワーク基盤",
        "网络基础设施",
        "بنية الشبكة"
    ],
    "Dynamic Host Configuration Protocol (server)": [
        "Dynamic Host Configuration Protocol (सर्वर)",
        "Dynamic Host Configuration Protocol (servidor)",
        "Dynamic Host Configuration Protocol (serveur)",
        "Dynamic Host Configuration Protocol (Server)",
        "Dynamic Host Configuration Protocol（サーバー）",
        "Dynamic Host Configuration Protocol（服务器）",
        "Dynamic Host Configuration Protocol (الخادم)"
    ],
    "Dynamic Host Configuration Protocol (client)": [
        "Dynamic Host Configuration Protocol (क्लाइंट)",
        "Dynamic Host Configuration Protocol (cliente)",
        "Dynamic Host Configuration Protocol (client)",
        "Dynamic Host Configuration Protocol (Client)",
        "Dynamic Host Configuration Protocol（クライアント）",
        "Dynamic Host Configuration Protocol（客户端）",
        "Dynamic Host Configuration Protocol (العميل)"
    ],
    "Hypertext Transfer Protocol - unencrypted web traffic": [
        "Hypertext Transfer Protocol — बिना एन्क्रिप्शन का वेब ट्रैफ़िक",
        "Hypertext Transfer Protocol: tráfico web sin cifrar",
        "Hypertext Transfer Protocol : trafic web non chiffré",
        "Hypertext Transfer Protocol: unverschlüsselter Webverkehr",
        "Hypertext Transfer Protocol：非暗号化のWeb通信",
        "Hypertext Transfer Protocol：未加密网页流量",
        "Hypertext Transfer Protocol: حركة ويب غير مشفّرة"
    ],
    "Web": [
        "वेब",
        "Web",
        "Web",
        "Web",
        "Web",
        "网页",
        "الويب"
    ],
    "Post Office Protocol v3 - email retrieval": [
        "Post Office Protocol v3 — ईमेल प्राप्ति",
        "Post Office Protocol v3: recepción de correo",
        "Post Office Protocol v3 : relève du courrier",
        "Post Office Protocol v3: E-Mail-Abruf",
        "Post Office Protocol v3：メール取得",
        "Post Office Protocol v3：接收电子邮件",
        "Post Office Protocol v3: استلام البريد"
    ],
    "Network News Transfer Protocol - Usenet": [
        "Network News Transfer Protocol — Usenet",
        "Network News Transfer Protocol: Usenet",
        "Network News Transfer Protocol : Usenet",
        "Network News Transfer Protocol: Usenet",
        "Network News Transfer Protocol：Usenet",
        "Network News Transfer Protocol：Usenet",
        "Network News Transfer Protocol: ‏Usenet"
    ],
    "News": [
        "समाचार",
        "Noticias",
        "Actualités",
        "Nachrichten",
        "ニュース",
        "新闻",
        "الأخبار"
    ],
    "Network Time Protocol - time synchronization": [
        "Network Time Protocol — समय समन्वय",
        "Network Time Protocol: sincronización horaria",
        "Network Time Protocol : synchronisation horaire",
        "Network Time Protocol: Zeitsynchronisierung",
        "Network Time Protocol：時刻同期",
        "Network Time Protocol：时间同步",
        "Network Time Protocol: مزامنة الوقت"
    ],
    "Windows Networking": [
        "Windows नेटवर्किंग",
        "Redes Windows",
        "Réseaux Windows",
        "Windows-Netzwerke",
        "Windowsネットワーク",
        "Windows 网络",
        "شبكات Windows"
    ],
    "Internet Message Access Protocol - email retrieval": [
        "Internet Message Access Protocol — ईमेल प्राप्ति",
        "Internet Message Access Protocol: recepción de correo",
        "Internet Message Access Protocol : relève du courrier",
        "Internet Message Access Protocol: E-Mail-Abruf",
        "Internet Message Access Protocol：メール取得",
        "Internet Message Access Protocol：接收电子邮件",
        "Internet Message Access Protocol: استلام البريد"
    ],
    "Network Management": [
        "नेटवर्क प्रबंधन",
        "Gestión de red",
        "Gestion réseau",
        "Netzwerkverwaltung",
        "ネットワーク管理",
        "网络管理",
        "إدارة الشبكة"
    ],
    "SNMP Trap (notifications)": [
        "SNMP Trap (सूचनाएं)",
        "SNMP Trap (notificaciones)",
        "SNMP Trap (notifications)",
        "SNMP Trap (Benachrichtigungen)",
        "SNMP Trap（通知）",
        "SNMP Trap（通知）",
        "SNMP Trap (إشعارات)"
    ],
    "Border Gateway Protocol - internet routing": [
        "Border Gateway Protocol — इंटरनेट रूटिंग",
        "Border Gateway Protocol: enrutamiento de Internet",
        "Border Gateway Protocol : routage Internet",
        "Border Gateway Protocol: Internet-Routing",
        "Border Gateway Protocol：インターネット経路制御",
        "Border Gateway Protocol：互联网路由",
        "Border Gateway Protocol: توجيه الإنترنت"
    ],
    "Communication": [
        "संचार",
        "Comunicación",
        "Communication",
        "Kommunikation",
        "通信",
        "通信",
        "الاتصالات"
    ],
    "Directory Services": [
        "डायरेक्टरी सेवाएं",
        "Servicios de directorio",
        "Services d’annuaire",
        "Verzeichnisdienste",
        "ディレクトリサービス",
        "目录服务",
        "خدمات الدليل"
    ],
    "HTTP over TLS; HTTP/3 uses QUIC over UDP on port 443": [
        "TLS पर HTTP; HTTP/3 पोर्ट 443 पर UDP में QUIC प्रयोग करता है",
        "HTTP sobre TLS; HTTP/3 usa QUIC sobre UDP en el puerto 443",
        "HTTP sur TLS ; HTTP/3 utilise QUIC sur UDP au port 443",
        "HTTP über TLS; HTTP/3 verwendet QUIC über UDP auf Port 443",
        "TLS上のHTTP。HTTP/3はポート443でUDP上のQUICを使用",
        "HTTP 基于 TLS；HTTP/3 在端口 443 上使用基于 UDP 的 QUIC",
        "HTTP عبر TLS؛ يستخدم HTTP/3 بروتوكول QUIC عبر UDP على المنفذ 443"
    ],
    "Server Message Block - Windows file sharing": [
        "Server Message Block — Windows फ़ाइल साझाकरण",
        "Server Message Block: archivos compartidos Windows",
        "Server Message Block : partage de fichiers Windows",
        "Server Message Block: Windows-Dateifreigabe",
        "Server Message Block：Windowsファイル共有",
        "Server Message Block：Windows 文件共享",
        "Server Message Block: مشاركة ملفات Windows"
    ],
    "Message submission with implicit TLS (RFC 8314)": [
        "अंतर्निहित TLS से संदेश भेजना (RFC 8314)",
        "Envío de mensajes con TLS implícito (RFC 8314)",
        "Soumission de messages avec TLS implicite (RFC 8314)",
        "Nachrichtenübermittlung mit implizitem TLS (RFC 8314)",
        "暗黙的TLSによるメッセージ送信（RFC 8314）",
        "使用隐式 TLS 提交邮件（RFC 8314）",
        "إرسال الرسائل مع TLS ضمني (RFC 8314)"
    ],
    "System logging protocol": [
        "सिस्टम लॉगिंग प्रोटोकॉल",
        "Protocolo de registro del sistema",
        "Protocole de journalisation système",
        "Systemprotokollierung",
        "システムログ用プロトコル",
        "系统日志协议",
        "بروتوكول تسجيل النظام"
    ],
    "Logging": [
        "लॉगिंग",
        "Registro",
        "Journalisation",
        "Protokollierung",
        "ログ",
        "日志",
        "التسجيل"
    ],
    "Line Printer Daemon - printing": [
        "Line Printer Daemon — प्रिंटिंग",
        "Line Printer Daemon: impresión",
        "Line Printer Daemon : impression",
        "Line Printer Daemon: Drucken",
        "Line Printer Daemon：印刷",
        "Line Printer Daemon：打印",
        "Line Printer Daemon: الطباعة"
    ],
    "Printing": [
        "प्रिंटिंग",
        "Impresión",
        "Impression",
        "Drucken",
        "印刷",
        "打印",
        "الطباعة"
    ],
    "Email message submission (STARTTLS)": [
        "ईमेल संदेश जमा करना (STARTTLS)",
        "Envío de correo (STARTTLS)",
        "Soumission de courrier (STARTTLS)",
        "E-Mail-Übermittlung (STARTTLS)",
        "メール送信（STARTTLS）",
        "邮件提交（STARTTLS）",
        "إرسال البريد (STARTTLS)"
    ],
    "LDAP over TLS": [
        "TLS पर LDAP",
        "LDAP sobre TLS",
        "LDAP sur TLS",
        "LDAP über TLS",
        "TLS上のLDAP",
        "基于 TLS 的 LDAP",
        "LDAP عبر TLS"
    ],
    "IMAP over TLS": [
        "TLS पर IMAP",
        "IMAP sobre TLS",
        "IMAP sur TLS",
        "IMAP über TLS",
        "TLS上のIMAP",
        "基于 TLS 的 IMAP",
        "IMAP عبر TLS"
    ],
    "POP3 over TLS": [
        "TLS पर POP3",
        "POP3 sobre TLS",
        "POP3 sur TLS",
        "POP3 über TLS",
        "TLS上のPOP3",
        "基于 TLS 的 POP3",
        "POP3 عبر TLS"
    ],
    "SOCKS proxy protocol": [
        "SOCKS प्रॉक्सी प्रोटोकॉल",
        "Protocolo proxy SOCKS",
        "Protocole proxy SOCKS",
        "SOCKS-Proxyprotokoll",
        "SOCKSプロキシプロトコル",
        "SOCKS 代理协议",
        "بروتوكول وكيل SOCKS"
    ],
    "Proxy": [
        "प्रॉक्सी",
        "Proxy",
        "Proxy",
        "Proxy",
        "プロキシ",
        "代理",
        "وكيل"
    ],
    "OpenVPN tunneling": [
        "OpenVPN टनलिंग",
        "Túneles OpenVPN",
        "Tunneling OpenVPN",
        "OpenVPN-Tunnel",
        "OpenVPNトンネリング",
        "OpenVPN 隧道",
        "أنفاق OpenVPN"
    ],
    "Database": [
        "डेटाबेस",
        "Base de datos",
        "Base de données",
        "Datenbank",
        "データベース",
        "数据库",
        "قاعدة البيانات"
    ],
    "Oracle Database listener": [
        "Oracle Database लिसनर",
        "Listener de Oracle Database",
        "Écouteur Oracle Database",
        "Oracle-Database-Listener",
        "Oracle Databaseリスナー",
        "Oracle Database 监听器",
        "مستمع Oracle Database"
    ],
    "cPanel control panel (HTTP)": [
        "cPanel नियंत्रण पैनल (HTTP)",
        "Panel de control cPanel (HTTP)",
        "Panneau cPanel (HTTP)",
        "cPanel-Verwaltung (HTTP)",
        "cPanel管理画面（HTTP）",
        "cPanel 控制面板（HTTP）",
        "لوحة تحكم cPanel ‏(HTTP)"
    ],
    "Web Hosting": [
        "वेब होस्टिंग",
        "Alojamiento web",
        "Hébergement web",
        "Webhosting",
        "Webホスティング",
        "网站托管",
        "استضافة الويب"
    ],
    "cPanel control panel (HTTPS)": [
        "cPanel नियंत्रण पैनल (HTTPS)",
        "Panel de control cPanel (HTTPS)",
        "Panneau cPanel (HTTPS)",
        "cPanel-Verwaltung (HTTPS)",
        "cPanel管理画面（HTTPS）",
        "cPanel 控制面板（HTTPS）",
        "لوحة تحكم cPanel ‏(HTTPS)"
    ],
    "Apache Zookeeper client": [
        "Apache Zookeeper क्लाइंट",
        "Cliente Apache Zookeeper",
        "Client Apache Zookeeper",
        "Apache-Zookeeper-Client",
        "Apache Zookeeperクライアント",
        "Apache Zookeeper 客户端",
        "عميل Apache Zookeeper"
    ],
    "Distributed Systems": [
        "वितरित प्रणालियां",
        "Sistemas distribuidos",
        "Systèmes distribués",
        "Verteilte Systeme",
        "分散システム",
        "分布式系统",
        "الأنظمة الموزعة"
    ],
    "Common development server (Node.js, React, Rails)": [
        "सामान्य विकास सर्वर (Node.js, React, Rails)",
        "Servidor de desarrollo habitual (Node.js, React, Rails)",
        "Serveur de développement courant (Node.js, React, Rails)",
        "Üblicher Entwicklungsserver (Node.js, React, Rails)",
        "一般的な開発サーバー（Node.js、React、Rails）",
        "常见开发服务器（Node.js、React、Rails）",
        "خادم تطوير شائع (Node.js وReact وRails)"
    ],
    "Development": [
        "विकास",
        "Desarrollo",
        "Développement",
        "Entwicklung",
        "開発",
        "开发",
        "التطوير"
    ],
    "MySQL/MariaDB database": [
        "MySQL/MariaDB डेटाबेस",
        "Base de datos MySQL/MariaDB",
        "Base de données MySQL/MariaDB",
        "MySQL/MariaDB-Datenbank",
        "MySQL/MariaDBデータベース",
        "MySQL/MariaDB 数据库",
        "قاعدة بيانات MySQL/MariaDB"
    ],
    "Common development server": [
        "सामान्य विकास सर्वर",
        "Servidor de desarrollo habitual",
        "Serveur de développement courant",
        "Üblicher Entwicklungsserver",
        "一般的な開発サーバー",
        "常见开发服务器",
        "خادم تطوير شائع"
    ],
    "Alternative HTTPS port": [
        "वैकल्पिक HTTPS पोर्ट",
        "Puerto HTTPS alternativo",
        "Port HTTPS alternatif",
        "Alternativer HTTPS-Port",
        "代替HTTPSポート",
        "备用 HTTPS 端口",
        "منفذ HTTPS بديل"
    ],
    "Flask, Docker Registry, development servers": [
        "Flask, Docker Registry और विकास सर्वर",
        "Flask, Docker Registry y servidores de desarrollo",
        "Flask, Docker Registry et serveurs de développement",
        "Flask, Docker Registry und Entwicklungsserver",
        "Flask、Docker Registry、開発サーバー",
        "Flask、Docker Registry 和开发服务器",
        "Flask وDocker Registry وخوادم التطوير"
    ],
    "SIP over TLS": [
        "TLS पर SIP",
        "SIP sobre TLS",
        "SIP sur TLS",
        "SIP über TLS",
        "TLS上のSIP",
        "基于 TLS 的 SIP",
        "SIP عبر TLS"
    ],
    "PostgreSQL database": [
        "PostgreSQL डेटाबेस",
        "Base de datos PostgreSQL",
        "Base de données PostgreSQL",
        "PostgreSQL-Datenbank",
        "PostgreSQLデータベース",
        "PostgreSQL 数据库",
        "قاعدة بيانات PostgreSQL"
    ],
    "Message Queue": [
        "संदेश कतार",
        "Cola de mensajes",
        "File de messages",
        "Nachrichtenwarteschlange",
        "メッセージキュー",
        "消息队列",
        "قائمة الرسائل"
    ],
    "Redis in-memory data store": [
        "Redis इन-मेमोरी डेटा भंडार",
        "Almacén de datos en memoria Redis",
        "Stockage de données en mémoire Redis",
        "Redis-In-Memory-Datenspeicher",
        "Redisのメモリ内データストア",
        "Redis 内存数据存储",
        "مخزن بيانات Redis في الذاكرة"
    ],
    "Kubernetes API server": [
        "Kubernetes API सर्वर",
        "Servidor API de Kubernetes",
        "Serveur API Kubernetes",
        "Kubernetes-API-Server",
        "Kubernetes APIサーバー",
        "Kubernetes API 服务器",
        "خادم Kubernetes API"
    ],
    "Container Orchestration": [
        "कंटेनर समन्वयन",
        "Orquestación de contenedores",
        "Orchestration de conteneurs",
        "Container-Orchestrierung",
        "コンテナー管理",
        "容器编排",
        "تنسيق الحاويات"
    ],
    "IRC (alternative)": [
        "IRC (वैकल्पिक)",
        "IRC (alternativo)",
        "IRC (alternatif)",
        "IRC (alternativ)",
        "IRC（代替）",
        "IRC（备用）",
        "IRC (بديل)"
    ],
    "IRC (common)": [
        "IRC (सामान्य)",
        "IRC (habitual)",
        "IRC (courant)",
        "IRC (üblich)",
        "IRC（一般的）",
        "IRC（常见）",
        "IRC (شائع)"
    ],
    "IRC over TLS": [
        "TLS पर IRC",
        "IRC sobre TLS",
        "IRC sur TLS",
        "IRC über TLS",
        "TLS上のIRC",
        "基于 TLS 的 IRC",
        "IRC عبر TLS"
    ],
    "Apache Cassandra inter-node": [
        "Apache Cassandra नोडों के बीच",
        "Apache Cassandra entre nodos",
        "Apache Cassandra entre nœuds",
        "Apache Cassandra zwischen Knoten",
        "Apache Cassandraのノード間通信",
        "Apache Cassandra 节点间通信",
        "Apache Cassandra بين العقد"
    ],
    "Application Server": [
        "एप्लिकेशन सर्वर",
        "Servidor de aplicaciones",
        "Serveur d’applications",
        "Anwendungsserver",
        "アプリケーションサーバー",
        "应用服务器",
        "خادم التطبيقات"
    ],
    "Alternative HTTP (Python SimpleHTTPServer, Django)": [
        "वैकल्पिक HTTP (Python SimpleHTTPServer, Django)",
        "HTTP alternativo (Python SimpleHTTPServer, Django)",
        "HTTP alternatif (Python SimpleHTTPServer, Django)",
        "Alternatives HTTP (Python SimpleHTTPServer, Django)",
        "代替HTTP（Python SimpleHTTPServer、Django）",
        "备用 HTTP（Python SimpleHTTPServer、Django）",
        "HTTP بديل (Python SimpleHTTPServer وDjango)"
    ],
    "Alternative HTTP": [
        "वैकल्पिक HTTP",
        "HTTP alternativo",
        "HTTP alternatif",
        "Alternatives HTTP",
        "代替HTTP",
        "备用 HTTP",
        "HTTP بديل"
    ],
    "HTTP proxy, Tomcat, development servers": [
        "HTTP प्रॉक्सी, Tomcat और विकास सर्वर",
        "Proxy HTTP, Tomcat y servidores de desarrollo",
        "Proxy HTTP, Tomcat et serveurs de développement",
        "HTTP-Proxy, Tomcat und Entwicklungsserver",
        "HTTPプロキシ、Tomcat、開発サーバー",
        "HTTP 代理、Tomcat 和开发服务器",
        "وكيل HTTP وTomcat وخوادم التطوير"
    ],
    "Alternative HTTP, Nexus Repository": [
        "वैकल्पिक HTTP, Nexus Repository",
        "HTTP alternativo, Nexus Repository",
        "HTTP alternatif, Nexus Repository",
        "Alternatives HTTP, Nexus Repository",
        "代替HTTP、Nexus Repository",
        "备用 HTTP、Nexus Repository",
        "HTTP بديل، Nexus Repository"
    ],
    "Alternative HTTPS, Tomcat SSL": [
        "वैकल्पिक HTTPS, Tomcat SSL",
        "HTTPS alternativo, Tomcat SSL",
        "HTTPS alternatif, Tomcat SSL",
        "Alternatives HTTPS, Tomcat SSL",
        "代替HTTPS、Tomcat SSL",
        "备用 HTTPS、Tomcat SSL",
        "HTTPS بديل، Tomcat SSL"
    ],
    "Alternative HTTP, Jupyter Notebook": [
        "वैकल्पिक HTTP, Jupyter Notebook",
        "HTTP alternativo, Jupyter Notebook",
        "HTTP alternatif, Jupyter Notebook",
        "Alternatives HTTP, Jupyter Notebook",
        "代替HTTP、Jupyter Notebook",
        "备用 HTTP、Jupyter Notebook",
        "HTTP بديل، Jupyter Notebook"
    ],
    "Cassandra Query Language native": [
        "मूल Cassandra Query Language",
        "Cassandra Query Language nativo",
        "Cassandra Query Language natif",
        "Natives Cassandra Query Language",
        "Cassandra Query Languageのネイティブ接続",
        "原生 Cassandra Query Language",
        "Cassandra Query Language الأصلي"
    ],
    "Prometheus monitoring": [
        "Prometheus निगरानी",
        "Monitorización Prometheus",
        "Supervision Prometheus",
        "Prometheus-Überwachung",
        "Prometheusの監視",
        "Prometheus 监控",
        "مراقبة Prometheus"
    ],
    "Monitoring": [
        "निगरानी",
        "Monitorización",
        "Supervision",
        "Überwachung",
        "監視",
        "监控",
        "المراقبة"
    ],
    "Apache Kafka broker": [
        "Apache Kafka ब्रोकर",
        "Broker Apache Kafka",
        "Courtier Apache Kafka",
        "Apache-Kafka-Broker",
        "Apache Kafkaブローカー",
        "Apache Kafka 代理",
        "وسيط Apache Kafka"
    ],
    "Search/Database": [
        "खोज/डेटाबेस",
        "Búsqueda/base de datos",
        "Recherche/base de données",
        "Suche/Datenbank",
        "検索・データベース",
        "搜索／数据库",
        "البحث/قاعدة البيانات"
    ],
    "Elasticsearch transport": [
        "Elasticsearch परिवहन",
        "Transporte Elasticsearch",
        "Transport Elasticsearch",
        "Elasticsearch-Transport",
        "Elasticsearchのトランスポート",
        "Elasticsearch 传输",
        "نقل Elasticsearch"
    ],
    "Git protocol": [
        "Git प्रोटोकॉल",
        "Protocolo Git",
        "Protocole Git",
        "Git-Protokoll",
        "Gitプロトコル",
        "Git 协议",
        "بروتوكول Git"
    ],
    "Version Control": [
        "संस्करण नियंत्रण",
        "Control de versiones",
        "Gestion de versions",
        "Versionsverwaltung",
        "バージョン管理",
        "版本控制",
        "التحكم بالإصدارات"
    ],
    "Webmin web-based admin": [
        "Webmin वेब प्रशासन",
        "Administración web Webmin",
        "Administration web Webmin",
        "Webmin-Webverwaltung",
        "WebminのWeb管理",
        "Webmin 网页管理",
        "إدارة Webmin عبر الويب"
    ],
    "System Administration": [
        "सिस्टम प्रशासन",
        "Administración del sistema",
        "Administration système",
        "Systemverwaltung",
        "システム管理",
        "系统管理",
        "إدارة النظام"
    ],
    "Memcached caching": [
        "Memcached कैशिंग",
        "Caché Memcached",
        "Cache Memcached",
        "Memcached-Caching",
        "Memcachedのキャッシュ",
        "Memcached 缓存",
        "تخزين Memcached المؤقت"
    ],
    "Cache": [
        "कैश",
        "Caché",
        "Cache",
        "Cache",
        "キャッシュ",
        "缓存",
        "ذاكرة مؤقتة"
    ],
    "RabbitMQ management UI": [
        "RabbitMQ प्रबंधन UI",
        "Interfaz de gestión RabbitMQ",
        "Interface de gestion RabbitMQ",
        "RabbitMQ-Verwaltung",
        "RabbitMQ管理画面",
        "RabbitMQ 管理界面",
        "واجهة إدارة RabbitMQ"
    ],
    "MQTT over TLS": [
        "TLS पर MQTT",
        "MQTT sobre TLS",
        "MQTT sur TLS",
        "MQTT über TLS",
        "TLS上のMQTT",
        "基于 TLS 的 MQTT",
        "MQTT عبر TLS"
    ],
    "Virtual Extensible LAN overlay encapsulation": [
        "Virtual Extensible LAN ओवरले एनकैप्सुलेशन",
        "Encapsulación de superposición Virtual Extensible LAN",
        "Encapsulation de superposition Virtual Extensible LAN",
        "Virtual-Extensible-LAN-Overlay-Kapselung",
        "Virtual Extensible LANのオーバーレイカプセル化",
        "Virtual Extensible LAN 覆盖网络封装",
        "تغليف شبكة Virtual Extensible LAN التراكبية"
    ],
    "Common default for gRPC services": [
        "gRPC सेवाओं का सामान्य डिफ़ॉल्ट",
        "Valor habitual para servicios gRPC",
        "Valeur courante pour services gRPC",
        "Üblicher Standard für gRPC-Dienste",
        "gRPCサービスで一般的な既定値",
        "gRPC 服务的常见默认值",
        "قيمة افتراضية شائعة لخدمات gRPC"
    ],
    "Grafana UI and many dev servers (Node, Rails)": [
        "Grafana UI और कई विकास सर्वर (Node, Rails)",
        "Interfaz Grafana y servidores de desarrollo (Node, Rails)",
        "Interface Grafana et serveurs de développement (Node, Rails)",
        "Grafana-Oberfläche und Entwicklungsserver (Node, Rails)",
        "Grafana管理画面と開発サーバー（Node、Rails）",
        "Grafana 界面及多种开发服务器（Node、Rails）",
        "واجهة Grafana وخوادم تطوير متعددة (Node وRails)"
    ],
    "Logstash Beats input": [
        "Logstash Beats इनपुट",
        "Entrada Logstash Beats",
        "Entrée Logstash Beats",
        "Logstash-Beats-Eingang",
        "Logstash Beats入力",
        "Logstash Beats 输入",
        "إدخال Logstash Beats"
    ],
    "Kibana web UI": [
        "Kibana वेब UI",
        "Interfaz web Kibana",
        "Interface web Kibana",
        "Kibana-Weboberfläche",
        "KibanaのWeb画面",
        "Kibana 网页界面",
        "واجهة ويب Kibana"
    ],
    "OpenTelemetry Protocol over gRPC": [
        "gRPC पर OpenTelemetry Protocol",
        "OpenTelemetry Protocol sobre gRPC",
        "OpenTelemetry Protocol sur gRPC",
        "OpenTelemetry Protocol über gRPC",
        "gRPC上のOpenTelemetry Protocol",
        "基于 gRPC 的 OpenTelemetry Protocol",
        "OpenTelemetry Protocol عبر gRPC"
    ],
    "OpenTelemetry Protocol over HTTP": [
        "HTTP पर OpenTelemetry Protocol",
        "OpenTelemetry Protocol sobre HTTP",
        "OpenTelemetry Protocol sur HTTP",
        "OpenTelemetry Protocol über HTTP",
        "HTTP上のOpenTelemetry Protocol",
        "基于 HTTP 的 OpenTelemetry Protocol",
        "OpenTelemetry Protocol عبر HTTP"
    ],
    "Docker daemon API (unencrypted — disable in production)": [
        "Docker डेमन API (बिना एन्क्रिप्शन — उत्पादन में बंद रखें)",
        "API Docker sin cifrar; desactivar en producción",
        "API du démon Docker non chiffrée ; désactiver en production",
        "Docker-Daemon-API unverschlüsselt; in Produktion deaktivieren",
        "DockerデーモンAPI（非暗号化。本番では無効化）",
        "Docker 守护进程 API（未加密；生产环境应禁用）",
        "Docker daemon API (غير مشفّرة؛ عطّلها في الإنتاج)"
    ],
    "Docker daemon API over TLS": [
        "TLS पर Docker डेमन API",
        "API Docker sobre TLS",
        "API du démon Docker sur TLS",
        "Docker-Daemon-API über TLS",
        "TLS上のDockerデーモンAPI",
        "基于 TLS 的 Docker 守护进程 API",
        "Docker daemon API عبر TLS"
    ],
    "Minecraft Java Edition server (default)": [
        "Minecraft Java Edition सर्वर (डिफ़ॉल्ट)",
        "Servidor Minecraft Java Edition (predeterminado)",
        "Serveur Minecraft Java Edition (par défaut)",
        "Minecraft-Java-Edition-Server (Standard)",
        "Minecraft Java Editionサーバー（既定値）",
        "Minecraft Java Edition 服务器（默认）",
        "خادم Minecraft Java Edition (الافتراضي)"
    ],
    "Game": [
        "खेल",
        "Juegos",
        "Jeux",
        "Spiele",
        "ゲーム",
        "游戏",
        "الألعاب"
    ],
    "Media": [
        "मीडिया",
        "Multimedia",
        "Médias",
        "Medien",
        "メディア",
        "媒体",
        "الوسائط"
    ],
    "Private-Use Network": [
        "निजी उपयोग नेटवर्क",
        "Red de uso privado",
        "Réseau à usage privé",
        "Netz für private Nutzung",
        "プライベート用途ネットワーク",
        "私有网络",
        "شبكة للاستخدام الخاص"
    ],
    "The largest RFC 1918 block. Used in internal networks; cloud defaults vary by provider and configuration.": [
        "सबसे बड़ा RFC 1918 ब्लॉक। आंतरिक नेटवर्क में प्रयोग होता है; क्लाउड डिफ़ॉल्ट प्रदाता और कॉन्फ़िगरेशन पर निर्भर हैं।",
        "El mayor bloque RFC 1918. Se usa en redes internas; los valores cloud dependen del proveedor y la configuración.",
        "Le plus grand bloc RFC 1918, pour réseaux internes. Les valeurs cloud dépendent du prestataire et de la configuration.",
        "Größter Block nach RFC 1918 für interne Netze. Cloud-Vorgaben hängen von Anbieter und Konfiguration ab.",
        "RFC 1918の最大ブロックで、内部ネットワークに使います。クラウドの既定値は事業者と設定によります。",
        "最大的 RFC 1918 地址块，用于内部网络；云默认值因服务商和配置而异。",
        "أكبر كتلة RFC 1918 للشبكات الداخلية. تختلف إعدادات السحابة الافتراضية حسب المزوّد والإعداد."
    ],
    "An RFC 1918 block for internal networks. Container and cloud subnet choices depend on configuration.": [
        "आंतरिक नेटवर्क के लिए RFC 1918 ब्लॉक। कंटेनर और क्लाउड सबनेट कॉन्फ़िगरेशन पर निर्भर हैं।",
        "Bloque RFC 1918 para redes internas. Las subredes de contenedores y cloud dependen de la configuración.",
        "Bloc RFC 1918 pour réseaux internes. Sous-réseaux conteneurs et cloud selon configuration.",
        "Block nach RFC 1918 für interne Netze. Container- und Cloud-Subnetze sind konfigurationsabhängig.",
        "内部ネットワーク用のRFC 1918ブロックです。コンテナーやクラウドのサブネットは設定によります。",
        "用于内部网络的 RFC 1918 地址块。容器和云子网选择取决于配置。",
        "كتلة RFC 1918 للشبكات الداخلية. تعتمد شبكات الحاويات والسحابة الفرعية على الإعداد."
    ],
    "Smallest private block. Most common in home routers and small office networks. Typically 192.168.0.x or 192.168.1.x.": [
        "सबसे छोटा निजी ब्लॉक, घरेलू और छोटे कार्यालय नेटवर्क में सामान्य। अक्सर 192.168.0.x या 192.168.1.x।",
        "El menor bloque privado, habitual en hogares y oficinas pequeñas. A menudo 192.168.0.x o 192.168.1.x.",
        "Plus petit bloc privé, courant chez soi et en petits bureaux. Souvent 192.168.0.x ou 192.168.1.x.",
        "Kleinster privater Block, üblich in Heim- und kleinen Büronetzen. Oft 192.168.0.x oder 192.168.1.x.",
        "最小のプライベートブロックで、家庭や小規模事務所で一般的です。例：192.168.0.x、192.168.1.x。",
        "最小的私有地址块，常见于家庭和小型办公网络，通常为 192.168.0.x 或 192.168.1.x。",
        "أصغر كتلة خاصة، شائعة في المنازل والمكاتب الصغيرة؛ عادةً 192.168.0.x أو 192.168.1.x."
    ],
    "Loopback (localhost)": [
        "लूपबैक (localhost)",
        "Bucle local (localhost)",
        "Bouclage (localhost)",
        "Loopback (localhost)",
        "ループバック（localhost）",
        "环回（localhost）",
        "استرجاع محلي (localhost)"
    ],
    "127.0.0.1 is 'localhost'. Used for testing local network applications. Packets never leave the host.": [
        "127.0.0.1 यानी localhost। स्थानीय नेटवर्क एप्लिकेशन परीक्षण में प्रयोग; पैकेट होस्ट से बाहर नहीं जाते।",
        "127.0.0.1 es localhost. Para pruebas locales; los paquetes no salen del equipo.",
        "127.0.0.1 est localhost. Pour les tests locaux ; les paquets restent sur l’hôte.",
        "127.0.0.1 ist localhost. Für lokale Anwendungstests; Pakete verlassen den Host nicht.",
        "127.0.0.1はlocalhostです。ローカルアプリのテスト用で、パケットはホスト外へ出ません。",
        "127.0.0.1 即 localhost，用于本地网络应用测试，数据包不会离开主机。",
        "127.0.0.1 هو localhost. لاختبار التطبيقات محليًا؛ لا تغادر الحزم الجهاز."
    ],
    "Link-local communication when routable configuration is unavailable, including isolated networks. This alone does not prove a DHCP failure.": [
        "रूट योग्य कॉन्फ़िगरेशन न मिलने पर लिंक-लोकल संचार, जैसे पृथक नेटवर्क में। इससे अकेले DHCP विफलता सिद्ध नहीं होती।",
        "Comunicación local de enlace sin configuración enrutable, incluso en redes aisladas. No prueba por sí sola un fallo DHCP.",
        "Communication lien-local sans configuration routable, y compris en réseau isolé. Cela seul ne prouve pas une panne DHCP.",
        "Link-lokale Kommunikation ohne routbare Konfiguration, auch in isolierten Netzen. Allein kein Beleg für einen DHCP-Ausfall.",
        "経路設定がない場合や孤立ネットワークのリンク内通信に使います。これだけでDHCP障害とは断定できません。",
        "缺少可路由配置时用于链路本地通信，包括隔离网络；仅凭此不能断定 DHCP 故障。",
        "اتصال محلي للرابط عند غياب إعداد قابل للتوجيه، بما فيه الشبكات المعزولة. لا يثبت وحده فشل DHCP."
    ],
    "Carrier-Grade NAT (Shared Address Space)": [
        "कैरियर-ग्रेड NAT (साझा पता स्थान)",
        "NAT de operador (espacio compartido)",
        "NAT opérateur (espace partagé)",
        "Carrier-Grade NAT (geteilter Adressraum)",
        "キャリアグレードNAT（共有空間）",
        "运营商级 NAT（共享地址空间）",
        "NAT بمستوى المزوّد (مساحة مشتركة)"
    ],
    "Carrier-Grade NAT": [
        "कैरियर-ग्रेड NAT",
        "NAT de operador",
        "NAT opérateur",
        "Carrier-Grade NAT",
        "キャリアグレードNAT",
        "运营商级 NAT",
        "NAT بمستوى المزوّد"
    ],
    "Used by ISPs for large-scale NAT. Not routable on the public internet. May appear in traceroutes.": [
        "ISP के बड़े NAT के लिए। सार्वजनिक इंटरनेट पर रूट नहीं होता; traceroute में दिख सकता है।",
        "Para NAT a gran escala de ISP. No enrutable en Internet público; puede aparecer en traceroute.",
        "Pour NAT à grande échelle des FAI. Non routable sur Internet public ; peut apparaître dans traceroute.",
        "Für großflächiges NAT bei Providern. Im öffentlichen Internet nicht routbar; kann in Traceroutes erscheinen.",
        "ISPの大規模NAT用です。公開インターネットでは経路制御されず、tracerouteに出る場合があります。",
        "用于 ISP 的大规模 NAT，不能在公共互联网路由，可能出现在 traceroute 中。",
        "لـNAT واسع النطاق لدى المزوّدين. غير قابل للتوجيه على الإنترنت العام وقد يظهر في traceroute."
    ],
    "Class D addresses for one-to-many communication. Used by IGMP, OSPF, RIPv2. 224.0.0.1 = all hosts, 224.0.0.2 = all routers.": [
        "एक से कई संचार के क्लास D पते। IGMP, OSPF, RIPv2 में प्रयोग। 224.0.0.1 = सभी होस्ट, 224.0.0.2 = सभी राउटर।",
        "Direcciones clase D para uno a muchos, usadas por IGMP, OSPF y RIPv2. 224.0.0.1 = todos los hosts; 224.0.0.2 = todos los routers.",
        "Adresses classe D pour un vers plusieurs, utilisées par IGMP, OSPF, RIPv2. 224.0.0.1 = tous les hôtes ; 224.0.0.2 = tous les routeurs.",
        "Klasse-D-Adressen für Eins-zu-viele, genutzt von IGMP, OSPF, RIPv2. 224.0.0.1 = alle Hosts; 224.0.0.2 = alle Router.",
        "1対多通信のクラスDアドレスです。IGMP、OSPF、RIPv2で使用。224.0.0.1は全ホスト、224.0.0.2は全ルーターです。",
        "用于一对多通信的 D 类地址，供 IGMP、OSPF、RIPv2 使用。224.0.0.1 = 所有主机，224.0.0.2 = 所有路由器。",
        "عناوين فئة D لاتصال واحد بمتعدد، تستخدمها IGMP وOSPF وRIPv2. ‏224.0.0.1 لكل المضيفين و224.0.0.2 لكل الموجّهات."
    ],
    "Current Network (This Host)": [
        "वर्तमान नेटवर्क (यह होस्ट)",
        "Red actual (este host)",
        "Réseau courant (cet hôte)",
        "Aktuelles Netz (dieser Host)",
        "現在のネットワーク（このホスト）",
        "当前网络（本主机）",
        "الشبكة الحالية (هذا المضيف)"
    ],
    "This-network block. The single address 0.0.0.0 has unspecified-address and wildcard-binding uses; these meanings do not apply to every address in the block.": [
        "वर्तमान नेटवर्क ब्लॉक। केवल 0.0.0.0 में अनिर्दिष्ट पता और वाइल्डकार्ड बाइंड के अर्थ हैं; पूरे ब्लॉक के हर पते में ये अर्थ नहीं हैं।",
        "Bloque de esta red. Solo 0.0.0.0 tiene usos de dirección no especificada y enlace comodín; no se aplican a todas las direcciones del bloque.",
        "Bloc de ce réseau. Seul 0.0.0.0 a les usages d’adresse non spécifiée et de liaison générique ; pas toutes les adresses du bloc.",
        "Dieser-Netz-Block. Nur 0.0.0.0 dient als unspezifizierte Adresse und Bindungsplatzhalter, nicht jede Adresse im Block.",
        "このネットワーク用ブロックです。0.0.0.0単体は未指定アドレスやワイルドカードのバインドに使いますが、ブロック全体に同じ意味はありません。",
        "“本网络”地址块。仅 0.0.0.0 用于未指定地址和通配绑定，这些含义不适用于块内每个地址。",
        "كتلة هذه الشبكة. يستخدم 0.0.0.0 وحده لعنوان غير محدد وربط شامل؛ لا تنطبق هذه المعاني على جميع عناوين الكتلة."
    ],
    "Reserved (Class E)": [
        "आरक्षित (क्लास E)",
        "Reservado (clase E)",
        "Réservé (classe E)",
        "Reserviert (Klasse E)",
        "予約済み（クラスE）",
        "保留（E 类）",
        "محجوز (فئة E)"
    ],
    "Reserved block. The more-specific 255.255.255.255/32 allocation is limited broadcast.": [
        "आरक्षित ब्लॉक। अधिक विशिष्ट 255.255.255.255/32 सीमित प्रसारण है।",
        "Bloque reservado. El 255.255.255.255/32 más específico es difusión limitada.",
        "Bloc réservé. L’allocation plus précise 255.255.255.255/32 est la diffusion limitée.",
        "Reservierter Block. Das spezifischere 255.255.255.255/32 ist begrenzter Broadcast.",
        "予約済みブロックです。より細かい255.255.255.255/32は限定ブロードキャストです。",
        "保留块。更具体的 255.255.255.255/32 为有限广播地址。",
        "كتلة محجوزة. التخصيص الأدق 255.255.255.255/32 للبث المحدود."
    ],
    "Limited Broadcast": [
        "सीमित प्रसारण",
        "Difusión limitada",
        "Diffusion limitée",
        "Begrenzter Broadcast",
        "限定ブロードキャスト",
        "有限广播",
        "بث محدود"
    ],
    "Special": [
        "विशेष",
        "Especial",
        "Spécial",
        "Besonders",
        "特殊",
        "特殊",
        "خاص"
    ],
    "Broadcast to all hosts on the local network segment. Not forwarded by routers.": [
        "स्थानीय नेटवर्क खंड के सभी होस्ट को प्रसारण। राउटर आगे नहीं भेजते।",
        "Difusión a todos los hosts del segmento local. Los routers no la reenvían.",
        "Diffusion à tous les hôtes du segment local. Non transmise par les routeurs.",
        "Broadcast an alle Hosts im lokalen Segment. Router leiten ihn nicht weiter.",
        "ローカル区間の全ホストへ送信します。ルーターは転送しません。",
        "广播至本地网段所有主机，路由器不会转发。",
        "بث لكل مضيفي الجزء المحلي من الشبكة. لا تمرّره الموجّهات."
    ],
    "TEST-NET-1 (Documentation)": [
        "TEST-NET-1 (दस्तावेज़)",
        "TEST-NET-1 (documentación)",
        "TEST-NET-1 (documentation)",
        "TEST-NET-1 (Dokumentation)",
        "TEST-NET-1（文書用）",
        "TEST-NET-1（文档）",
        "TEST-NET-1 (التوثيق)"
    ],
    "Reserved for documentation and examples. Use in tutorials, books, and training materials.": [
        "दस्तावेज़ और उदाहरणों के लिए आरक्षित। ट्यूटोरियल, पुस्तकों और प्रशिक्षण में प्रयोग करें।",
        "Reservado para documentación y ejemplos en tutoriales, libros y formación.",
        "Réservé à la documentation et aux exemples dans les tutoriels, livres et formations.",
        "Für Dokumentation und Beispiele in Anleitungen, Büchern und Schulungen reserviert.",
        "文書・例示用に予約されています。チュートリアル、書籍、研修で使います。",
        "保留用于文档及示例，可用于教程、书籍和培训材料。",
        "محجوز للتوثيق والأمثلة في الشروح والكتب ومواد التدريب."
    ],
    "TEST-NET-2 (Documentation)": [
        "TEST-NET-2 (दस्तावेज़)",
        "TEST-NET-2 (documentación)",
        "TEST-NET-2 (documentation)",
        "TEST-NET-2 (Dokumentation)",
        "TEST-NET-2（文書用）",
        "TEST-NET-2（文档）",
        "TEST-NET-2 (التوثيق)"
    ],
    "Reserved for documentation. Second documentation range for examples needing multiple networks.": [
        "दस्तावेज़ के लिए आरक्षित दूसरा ब्लॉक; अनेक नेटवर्क वाले उदाहरणों में प्रयोग करें।",
        "Segundo bloque para documentación de ejemplos con varias redes.",
        "Deuxième bloc de documentation pour les exemples à plusieurs réseaux.",
        "Zweiter Dokumentationsblock für Beispiele mit mehreren Netzen.",
        "複数ネットワークの例示用の2つ目の文書ブロックです。",
        "第二个文档保留范围，供需要多个网络的示例使用。",
        "ثاني كتلة توثيق لأمثلة تحتاج إلى عدة شبكات."
    ],
    "TEST-NET-3 (Documentation)": [
        "TEST-NET-3 (दस्तावेज़)",
        "TEST-NET-3 (documentación)",
        "TEST-NET-3 (documentation)",
        "TEST-NET-3 (Dokumentation)",
        "TEST-NET-3（文書用）",
        "TEST-NET-3（文档）",
        "TEST-NET-3 (التوثيق)"
    ],
    "Reserved for documentation. Third documentation range for complex examples.": [
        "दस्तावेज़ का तीसरा आरक्षित ब्लॉक; जटिल उदाहरणों के लिए।",
        "Tercer bloque reservado para ejemplos complejos de documentación.",
        "Troisième bloc réservé aux exemples complexes de documentation.",
        "Dritter reservierter Dokumentationsblock für komplexe Beispiele.",
        "複雑な例示用の3つ目の文書ブロックです。",
        "第三个文档保留范围，用于复杂示例。",
        "ثالث كتلة محجوزة لأمثلة التوثيق المعقدة."
    ],
    "Benchmark Testing": [
        "बेंचमार्क परीक्षण",
        "Pruebas de rendimiento",
        "Tests de performance",
        "Benchmarktests",
        "ベンチマーク試験",
        "基准测试",
        "اختبار الأداء"
    ],
    "Reserved for network benchmark testing. Used by network equipment vendors.": [
        "नेटवर्क बेंचमार्क के लिए आरक्षित। नेटवर्क उपकरण निर्माता प्रयोग करते हैं।",
        "Reservado para pruebas de rendimiento de red por fabricantes de equipos.",
        "Réservé aux tests de performance réseau des fabricants d’équipements.",
        "Für Netzwerk-Benchmarktests durch Gerätehersteller reserviert.",
        "ネットワーク機器メーカーのベンチマーク試験用に予約されています。",
        "保留用于网络基准测试，供网络设备厂商使用。",
        "محجوز لاختبارات أداء الشبكة لدى مصنّعي المعدات."
    ],
    "IETF Protocol Assignments": [
        "IETF प्रोटोकॉल आवंटन",
        "Asignaciones de protocolos IETF",
        "Attributions de protocoles IETF",
        "IETF-Protokollzuweisungen",
        "IETFプロトコル割当",
        "IETF 协议分配",
        "تخصيصات بروتوكولات IETF"
    ],
    "IETF protocol assignments with more-specific exceptions. 192.0.0.170 and 192.0.0.171 are NAT64/DNS64 discovery addresses, not translation prefixes.": [
        "IETF प्रोटोकॉल आवंटन में अधिक विशिष्ट अपवाद हैं। 192.0.0.170 और 192.0.0.171 NAT64/DNS64 खोज पते हैं, अनुवाद प्रीफ़िक्स नहीं।",
        "Asignaciones IETF con excepciones más específicas. 192.0.0.170 y 192.0.0.171 son direcciones de descubrimiento NAT64/DNS64, no prefijos de traducción.",
        "Attributions IETF avec exceptions plus précises. 192.0.0.170 et 192.0.0.171 sont des adresses de découverte NAT64/DNS64, pas des préfixes de traduction.",
        "IETF-Zuweisungen mit spezifischeren Ausnahmen. 192.0.0.170 und 192.0.0.171 sind NAT64/DNS64-Erkennungsadressen, keine Übersetzungspräfixe.",
        "IETF用割当で、より細かい例外があります。192.0.0.170と192.0.0.171はNAT64/DNS64検出アドレスであり、変換プレフィックスではありません。",
        "IETF 协议分配，存在更具体的例外。192.0.0.170 和 192.0.0.171 是 NAT64/DNS64 发现地址，并非转换前缀。",
        "تخصيصات IETF مع استثناءات أدق. ‏192.0.0.170 و192.0.0.171 عنوانا اكتشاف NAT64/DNS64 وليسا بادئتي ترجمة."
    ],
    "6to4 Relay Anycast (deprecated)": [
        "6to4 रिले एनीकास्ट (अप्रचलित)",
        "Anycast de relé 6to4 (obsoleto)",
        "Relais anycast 6to4 (obsolète)",
        "6to4-Relay-Anycast (veraltet)",
        "6to4リレーエニーキャスト（非推奨）",
        "6to4 中继任播（已弃用）",
        "بث أقرب مرحّل 6to4 (مهمل)"
    ],
    "Was used for 6to4 relay anycast. Formally deprecated in 2015; should not be used in new deployments.": [
        "पहले 6to4 रिले एनीकास्ट में प्रयुक्त। 2015 में अप्रचलित घोषित; नए परिनियोजन में प्रयोग न करें।",
        "Antiguo anycast de relé 6to4, obsoleto desde 2015; no usar en despliegues nuevos.",
        "Ancien relais anycast 6to4, déclaré obsolète en 2015 ; à éviter dans les nouveaux déploiements.",
        "Früherer 6to4-Relay-Anycast, seit 2015 veraltet; nicht für neue Bereitstellungen.",
        "以前の6to4リレーエニーキャスト用で、2015年に非推奨となりました。新規導入には使わないでください。",
        "曾用于 6to4 中继任播，2015 年正式弃用，不应在新部署中使用。",
        "استُخدم لمرحّل 6to4 بأقرب بث. أُهمل رسميًا عام 2015؛ لا يستخدم في نشر جديد."
    ],
    "Anycast prefix used by the AS112 project to absorb DNS queries for private addresses.": [
        "निजी पतों के DNS प्रश्न संभालने के लिए AS112 प्रोजेक्ट का एनीकास्ट प्रीफ़िक्स।",
        "Prefijo anycast de AS112 para absorber consultas DNS de direcciones privadas.",
        "Préfixe anycast AS112 pour absorber les requêtes DNS d’adresses privées.",
        "AS112-Anycast-Präfix zum Aufnehmen von DNS-Anfragen privater Adressen.",
        "プライベートアドレスのDNS照会を受けるAS112のエニーキャストプレフィックスです。",
        "AS112 项目的任播前缀，用于吸收私有地址的 DNS 查询。",
        "بادئة أقرب بث لمشروع AS112 لاستيعاب استعلامات DNS للعناوين الخاصة."
    ],
    "IPv6 equivalent of 127.0.0.1. Single address for local testing.": [
        "127.0.0.1 का IPv6 समकक्ष; स्थानीय परीक्षण के लिए एक पता।",
        "Equivalente IPv6 de 127.0.0.1; una dirección para pruebas locales.",
        "Équivalent IPv6 de 127.0.0.1 ; une adresse pour tests locaux.",
        "IPv6-Entsprechung von 127.0.0.1; eine Adresse für lokale Tests.",
        "127.0.0.1に相当するIPv6のローカルテスト用単一アドレスです。",
        "127.0.0.1 的 IPv6 对应值，用于本地测试的单个地址。",
        "مقابل IPv6 للعنوان 127.0.0.1؛ عنوان واحد للاختبار المحلي."
    ],
    "Unspecified Address": [
        "अनिर्दिष्ट पता",
        "Dirección no especificada",
        "Adresse non spécifiée",
        "Unspezifizierte Adresse",
        "未指定アドレス",
        "未指定地址",
        "عنوان غير محدد"
    ],
    "The unspecified IPv6 address indicates absence of an address; socket APIs can use it for wildcard binding. It is not a destination address.": [
        "अनिर्दिष्ट IPv6 पता किसी पते की अनुपस्थिति दर्शाता है। सॉकेट API इसे वाइल्डकार्ड बाइंड में प्रयोग कर सकते हैं। यह गंतव्य पता नहीं है।",
        "La dirección IPv6 no especificada indica ausencia de dirección. Las API de sockets pueden usarla como enlace comodín. No es dirección de destino.",
        "L’adresse IPv6 non spécifiée indique l’absence d’adresse. Les API de sockets peuvent l’utiliser en liaison générique. Ce n’est pas une destination.",
        "Die unspezifizierte IPv6-Adresse bedeutet fehlende Adresse. Socket-APIs können sie als Bindungsplatzhalter nutzen. Keine Zieladresse.",
        "IPv6の未指定アドレスはアドレス未設定を示します。ソケットAPIではワイルドカードのバインドに使えますが、宛先ではありません。",
        "IPv6 未指定地址表示尚无地址；套接字 API 可将其用于通配绑定，但它不是目标地址。",
        "يدل عنوان IPv6 غير المحدد على غياب عنوان. قد تستخدمه واجهات المقابس للربط الشامل؛ ليس عنوان وجهة."
    ],
    "Link-Local Unicast": [
        "लिंक-लोकल यूनिकास्ट",
        "Unicast local de enlace",
        "Unicast lien-local",
        "Link-lokales Unicast",
        "リンクローカルユニキャスト",
        "链路本地单播",
        "بث فردي محلي للرابط"
    ],
    "Link-local unicast scope. Routers must not forward these addresses beyond the link.": [
        "लिंक-लोकल यूनिकास्ट। राउटर इन्हें लिंक के बाहर आगे नहीं भेज सकते।",
        "Unicast local de enlace. Los routers no deben reenviarlo fuera del enlace.",
        "Portée unicast lien-local. Les routeurs ne doivent pas le transmettre au-delà du lien.",
        "Link-lokaler Unicast-Bereich. Router dürfen ihn nicht über den Link hinaus weiterleiten.",
        "リンク内のユニキャストです。ルーターはリンク外へ転送してはいけません。",
        "链路本地单播范围；路由器不得转发到链路之外。",
        "نطاق بث فردي محلي للرابط. يجب ألا تمرره الموجّهات خارج الرابط."
    ],
    "Unique Local Address (Private)": [
        "अद्वितीय स्थानीय पता (निजी)",
        "Dirección local única (privada)",
        "Adresse locale unique (privée)",
        "Eindeutige lokale Adresse (privat)",
        "ユニークローカルアドレス（私用）",
        "唯一本地地址（私有）",
        "عنوان محلي فريد (خاص)"
    ],
    "Unique-local space for local communication. Locally assigned prefixes use fd00::/8 and a pseudo-random Global ID; fc00::/8 is not defined for local assignment.": [
        "स्थानीय संचार के लिए अद्वितीय स्थानीय स्थान। स्थानीय आवंटन में fd00::/8 और छद्म-यादृच्छिक Global ID होता है; fc00::/8 स्थानीय आवंटन के लिए परिभाषित नहीं है।",
        "Espacio local único para comunicación local. Los prefijos locales usan fd00::/8 y Global ID pseudoaleatorio; fc00::/8 no está definido para asignación local.",
        "Espace local unique. Les préfixes locaux utilisent fd00::/8 et un Global ID pseudo-aléatoire ; fc00::/8 n’est pas défini pour attribution locale.",
        "Unique-Local-Raum für lokale Kommunikation. Lokal zugewiesene Präfixe verwenden fd00::/8 und pseudozufällige Global ID; fc00::/8 ist dafür nicht definiert.",
        "ローカル通信用です。ローカル割当ではfd00::/8と擬似乱数のGlobal IDを使います。fc00::/8のローカル割当方法は未定義です。",
        "用于本地通信的唯一本地空间。本地分配前缀使用 fd00::/8 和伪随机 Global ID；fc00::/8 未定义本地分配方式。",
        "مساحة محلية فريدة للاتصال المحلي. تستخدم البادئات المحلية fd00::/8 ومعرّف Global ID شبه عشوائي؛ لم يُعرّف fc00::/8 للتخصيص المحلي."
    ],
    "All IPv6 multicast addresses. ff02::1 = all nodes, ff02::2 = all routers.": [
        "सभी IPv6 मल्टीकास्ट पते। ff02::1 = सभी नोड, ff02::2 = सभी राउटर।",
        "Todas las direcciones multicast IPv6. ff02::1 = todos los nodos; ff02::2 = todos los routers.",
        "Toutes les adresses multicast IPv6. ff02::1 = tous les nœuds ; ff02::2 = tous les routeurs.",
        "Alle IPv6-Multicast-Adressen. ff02::1 = alle Knoten; ff02::2 = alle Router.",
        "IPv6の全マルチキャストアドレスです。ff02::1は全ノード、ff02::2は全ルーターです。",
        "所有 IPv6 组播地址。ff02::1 = 所有节点，ff02::2 = 所有路由器。",
        "كل عناوين بث IPv6 المتعدد. ‏ff02::1 لكل العقد وff02::2 لكل الموجّهات."
    ],
    "A global-unicast allocation space that also contains special-purpose subprefixes, including documentation. Membership does not guarantee global reachability.": [
        "ग्लोबल यूनिकास्ट स्थान में दस्तावेज़ सहित विशेष उप-प्रीफ़िक्स भी हैं। केवल इस ब्लॉक में होने से वैश्विक पहुंच तय नहीं होती।",
        "Espacio global unicast que incluye subprefijos especiales, como documentación. Pertenecer a él no garantiza alcance global.",
        "Espace unicast global contenant aussi des sous-préfixes spéciaux, dont documentation. L’appartenance ne garantit pas l’accessibilité globale.",
        "Global-Unicast-Zuteilungsraum enthält besondere Teilpräfixe, auch Dokumentation. Zugehörigkeit garantiert keine globale Erreichbarkeit.",
        "グローバルユニキャスト用空間にも文書用などの特殊プレフィックスがあります。この範囲内でも全世界からの到達性は保証しません。",
        "全局单播分配空间也包含文档等特殊子前缀，属于此范围不保证全球可达。",
        "مساحة بث فردي عالمي تتضمن بادئات فرعية خاصة كالتوثيق. الانتماء إليها لا يضمن الوصول العالمي."
    ],
    "Reserved for documentation and examples. Use in tutorials and documentation.": [
        "दस्तावेज़ और उदाहरणों के लिए आरक्षित। ट्यूटोरियल और दस्तावेज़ में प्रयोग करें।",
        "Reservado para documentación y ejemplos en tutoriales y documentos.",
        "Réservé à la documentation et aux exemples des tutoriels et documents.",
        "Für Dokumentation und Beispiele in Anleitungen und Dokumenten reserviert.",
        "文書と例示用に予約されています。チュートリアルや文書で使います。",
        "保留用于文档及示例，可用于教程和文档。",
        "محجوز للتوثيق والأمثلة في الشروح والوثائق."
    ],
    "Additional IPv6 documentation space for larger examples; not for operational addressing.": [
        "बड़े उदाहरणों के लिए अतिरिक्त IPv6 दस्तावेज़ स्थान; वास्तविक नेटवर्क पतों के लिए नहीं।",
        "Espacio IPv6 adicional para ejemplos mayores; no para direccionamiento operativo.",
        "Espace IPv6 de documentation supplémentaire pour grands exemples ; pas pour usage opérationnel.",
        "Zusätzlicher IPv6-Dokumentationsraum für größere Beispiele, nicht für Betriebsadressen.",
        "大規模な例示用の追加IPv6文書空間です。運用アドレス用ではありません。",
        "用于较大示例的额外 IPv6 文档空间，不用于实际运行地址。",
        "مساحة توثيق IPv6 إضافية لأمثلة أكبر؛ ليست لعنونة التشغيل."
    ],
    "Dummy IPv6 Prefix": [
        "डमी IPv6 प्रीफ़िक्स",
        "Prefijo IPv6 ficticio",
        "Préfixe IPv6 factice",
        "IPv6-Dummy-Präfix",
        "IPv6ダミープレフィックス",
        "IPv6 虚拟前缀",
        "بادئة IPv6 وهمية"
    ],
    "A dummy source prefix for specific protocol uses, including multipoint BFD; not a routable destination block.": [
        "मल्टीपॉइंट BFD सहित विशेष प्रोटोकॉल के लिए डमी स्रोत प्रीफ़िक्स; रूट योग्य गंतव्य ब्लॉक नहीं।",
        "Prefijo de origen ficticio para protocolos específicos, incluido BFD multipunto; no es destino enrutable.",
        "Préfixe source factice pour protocoles particuliers, dont BFD multipoint ; pas une destination routable.",
        "Dummy-Quellpräfix für bestimmte Protokolle, darunter Multipoint-BFD; kein routbarer Zielblock.",
        "マルチポイントBFDなどの特定用途向けダミー送信元プレフィックスです。経路制御される宛先用ではありません。",
        "用于多点 BFD 等特定协议的虚拟源前缀，并非可路由目标块。",
        "بادئة مصدر وهمية لاستخدامات بروتوكول محددة، منها BFD متعدد النقاط؛ ليست كتلة وجهة قابلة للتوجيه."
    ],
    "6to4 Transition": [
        "6to4 संक्रमण",
        "Transición 6to4",
        "Transition 6to4",
        "6to4-Übergang",
        "6to4移行",
        "6to4 过渡",
        "انتقال 6to4"
    ],
    "The 6to4 prefix embeds IPv4 addresses. RFC 7526 deprecated 6to4 relay anycast; this is a legacy transition mechanism.": [
        "6to4 में IPv4 पता समाहित होता है। RFC 7526 ने 6to4 रिले एनीकास्ट अप्रचलित किया; यह पुरानी संक्रमण विधि है।",
        "6to4 incorpora direcciones IPv4. RFC 7526 dejó obsoleto el anycast de relé 6to4; mecanismo de transición heredado.",
        "6to4 intègre des adresses IPv4. RFC 7526 rend obsolète le relais anycast 6to4 ; mécanisme de transition ancien.",
        "6to4 bettet IPv4-Adressen ein. RFC 7526 erklärte 6to4-Relay-Anycast für veraltet; alter Übergangsmechanismus.",
        "6to4はIPv4アドレスを埋め込みます。RFC 7526でリレーエニーキャストが非推奨となった旧式の移行手段です。",
        "6to4 前缀嵌入 IPv4 地址。RFC 7526 已弃用 6to4 中继任播；这是旧式过渡机制。",
        "تضمّن 6to4 عناوين IPv4. أهمل RFC 7526 أقرب بث لمرحّل 6to4؛ آلية انتقال قديمة."
    ],
    "Teredo Tunneling": [
        "Teredo टनलिंग",
        "Túneles Teredo",
        "Tunneling Teredo",
        "Teredo-Tunnel",
        "Teredoトンネリング",
        "Teredo 隧道",
        "أنفاق Teredo"
    ],
    "Teredo addresses for IPv6 tunneling through NAT. Used by Windows.": [
        "NAT से IPv6 टनलिंग के लिए Teredo पते; Windows में प्रयोग।",
        "Direcciones Teredo para túneles IPv6 a través de NAT; usadas en Windows.",
        "Adresses Teredo pour tunnels IPv6 via NAT, utilisées par Windows.",
        "Teredo-Adressen für IPv6-Tunnel durch NAT, von Windows genutzt.",
        "NATを通すIPv6トンネル用のTeredoアドレスです。Windowsで使われます。",
        "用于通过 NAT 建立 IPv6 隧道的 Teredo 地址，Windows 使用。",
        "عناوين Teredo لأنفاق IPv6 عبر NAT، يستخدمها Windows."
    ],
    "IPv4/IPv6 Translation (NAT64)": [
        "IPv4/IPv6 अनुवाद (NAT64)",
        "Traducción IPv4/IPv6 (NAT64)",
        "Traduction IPv4/IPv6 (NAT64)",
        "IPv4/IPv6-Übersetzung (NAT64)",
        "IPv4/IPv6変換（NAT64）",
        "IPv4/IPv6 转换（NAT64）",
        "ترجمة IPv4/IPv6 ‏(NAT64)"
    ],
    "Well-known prefix for IPv4-embedded IPv6 addresses used by NAT64 / DNS64 translators.": [
        "NAT64/DNS64 के IPv4-समाहित IPv6 पतों का प्रसिद्ध प्रीफ़िक्स।",
        "Prefijo conocido para direcciones IPv6 con IPv4 incorporado en NAT64/DNS64.",
        "Préfixe bien connu pour IPv6 intégrant IPv4, utilisé par NAT64/DNS64.",
        "Bekanntes Präfix für in IPv6 eingebettete IPv4-Adressen bei NAT64/DNS64.",
        "NAT64・DNS64が使う、IPv4を埋め込んだIPv6用の既知のプレフィックスです。",
        "NAT64／DNS64 转换器使用的嵌入 IPv4 的 IPv6 地址知名前缀。",
        "بادئة معروفة لعناوين IPv6 المضمّنة بـIPv4 في مترجمات NAT64/DNS64."
    ],
    "Local-Use IPv4/IPv6 Translation": [
        "स्थानीय उपयोग IPv4/IPv6 अनुवाद",
        "Traducción IPv4/IPv6 local",
        "Traduction IPv4/IPv6 locale",
        "Lokale IPv4/IPv6-Übersetzung",
        "ローカル用IPv4/IPv6変換",
        "本地使用 IPv4/IPv6 转换",
        "ترجمة IPv4/IPv6 للاستخدام المحلي"
    ],
    "Local-use prefix for IPv4/IPv6 translation when the well-known prefix is unsuitable.": [
        "प्रसिद्ध प्रीफ़िक्स अनुपयुक्त होने पर IPv4/IPv6 अनुवाद के लिए स्थानीय प्रीफ़िक्स।",
        "Prefijo local de traducción IPv4/IPv6 cuando el conocido no es adecuado.",
        "Préfixe local de traduction IPv4/IPv6 lorsque le préfixe connu ne convient pas.",
        "Lokales IPv4/IPv6-Übersetzungspräfix, wenn das bekannte Präfix ungeeignet ist.",
        "既知のプレフィックスが適さない場合のローカルIPv4/IPv6変換用です。",
        "知名前缀不适合时，用于本地 IPv4/IPv6 转换的前缀。",
        "بادئة محلية لترجمة IPv4/IPv6 عندما لا تلائم البادئة المعروفة."
    ],
    "IPv4-Mapped IPv6 Address": [
        "IPv4-मैप किया IPv6 पता",
        "Dirección IPv6 mapeada de IPv4",
        "Adresse IPv6 mappée IPv4",
        "IPv4-abgebildete IPv6-Adresse",
        "IPv4射影IPv6アドレス",
        "IPv4 映射 IPv6 地址",
        "عنوان IPv6 مضمّن بـIPv4"
    ],
    "Used to represent IPv4 addresses inside IPv6 (::ffff:192.0.2.1). Common in dual-stack sockets.": [
        "IPv6 में IPv4 दर्शाता है, जैसे ::ffff:192.0.2.1। डुअल-स्टैक सॉकेट में सामान्य।",
        "Representa IPv4 dentro de IPv6, como ::ffff:192.0.2.1; habitual en sockets de doble pila.",
        "Représente IPv4 dans IPv6, ex. ::ffff:192.0.2.1 ; courant en sockets double pile.",
        "Stellt IPv4 in IPv6 dar, z. B. ::ffff:192.0.2.1; üblich bei Dual-Stack-Sockets.",
        "::ffff:192.0.2.1のようにIPv6内でIPv4を表現します。デュアルスタックソケットで一般的です。",
        "用于在 IPv6 内表示 IPv4（如 ::ffff:192.0.2.1），常见于双栈套接字。",
        "يمثل IPv4 داخل IPv6 مثل ::ffff:192.0.2.1، وهو شائع في مقابس المكدس المزدوج."
    ],
    "Discard-Only Address Block": [
        "केवल ड्रॉप करने वाला ब्लॉक",
        "Bloque de descarte",
        "Bloc de rejet",
        "Nur-Verwerfen-Adressblock",
        "破棄専用ブロック",
        "仅丢弃地址块",
        "كتلة للإسقاط فقط"
    ],
    "Used as a sink for traffic that should be silently discarded. Routers blackhole this prefix.": [
        "बिना उत्तर दिए ट्रैफ़िक हटाने के लिए; राउटर इस प्रीफ़िक्स को ब्लैकहोल करते हैं।",
        "Sumidero para descartar tráfico silenciosamente; los routers anulan el tráfico a este prefijo.",
        "Récepteur pour rejeter silencieusement le trafic ; les routeurs en font un trou noir.",
        "Senke zum stillen Verwerfen von Verkehr; Router verwerfen Verkehr zu diesem Präfix.",
        "応答せずにトラフィックを破棄するためのプレフィックスです。ルーターでブラックホールとして扱います。",
        "用于静默丢弃流量的接收范围，路由器对此前缀执行黑洞路由。",
        "مصرف لإسقاط الحركة بصمت؛ تتخلص الموجّهات من حركة هذه البادئة."
    ],
    "Trivial File Transfer Protocol": [
        "Trivial File Transfer Protocol",
        "Trivial File Transfer Protocol",
        "Trivial File Transfer Protocol",
        "Trivial File Transfer Protocol",
        "Trivial File Transfer Protocol",
        "Trivial File Transfer Protocol",
        "Trivial File Transfer Protocol"
    ],
    "NetBIOS Name Service": [
        "NetBIOS Name Service",
        "NetBIOS Name Service",
        "NetBIOS Name Service",
        "NetBIOS Name Service",
        "NetBIOS Name Service",
        "NetBIOS Name Service",
        "NetBIOS Name Service"
    ],
    "NetBIOS Datagram Service": [
        "NetBIOS Datagram Service",
        "NetBIOS Datagram Service",
        "NetBIOS Datagram Service",
        "NetBIOS Datagram Service",
        "NetBIOS Datagram Service",
        "NetBIOS Datagram Service",
        "NetBIOS Datagram Service"
    ],
    "NetBIOS Session Service": [
        "NetBIOS Session Service",
        "NetBIOS Session Service",
        "NetBIOS Session Service",
        "NetBIOS Session Service",
        "NetBIOS Session Service",
        "NetBIOS Session Service",
        "NetBIOS Session Service"
    ],
    "Simple Network Management Protocol": [
        "Simple Network Management Protocol",
        "Simple Network Management Protocol",
        "Simple Network Management Protocol",
        "Simple Network Management Protocol",
        "Simple Network Management Protocol",
        "Simple Network Management Protocol",
        "Simple Network Management Protocol"
    ],
    "Internet Relay Chat": [
        "Internet Relay Chat",
        "Internet Relay Chat",
        "Internet Relay Chat",
        "Internet Relay Chat",
        "Internet Relay Chat",
        "Internet Relay Chat",
        "Internet Relay Chat"
    ],
    "Lightweight Directory Access Protocol": [
        "Lightweight Directory Access Protocol",
        "Lightweight Directory Access Protocol",
        "Lightweight Directory Access Protocol",
        "Lightweight Directory Access Protocol",
        "Lightweight Directory Access Protocol",
        "Lightweight Directory Access Protocol",
        "Lightweight Directory Access Protocol"
    ],
    "DNS-over-TLS (RFC 7858)": [
        "DNS-over-TLS (RFC 7858)",
        "DNS-over-TLS (RFC 7858)",
        "DNS-over-TLS (RFC 7858)",
        "DNS-over-TLS (RFC 7858)",
        "DNS-over-TLS (RFC 7858)",
        "DNS-over-TLS (RFC 7858)",
        "DNS-over-TLS (RFC 7858)"
    ],
    "VPN": [
        "VPN",
        "VPN",
        "VPN",
        "VPN",
        "VPN",
        "VPN",
        "VPN"
    ],
    "Microsoft SQL Server": [
        "Microsoft SQL Server",
        "Microsoft SQL Server",
        "Microsoft SQL Server",
        "Microsoft SQL Server",
        "Microsoft SQL Server",
        "Microsoft SQL Server",
        "Microsoft SQL Server"
    ],
    "Microsoft SQL Server Browser": [
        "Microsoft SQL Server Browser",
        "Microsoft SQL Server Browser",
        "Microsoft SQL Server Browser",
        "Microsoft SQL Server Browser",
        "Microsoft SQL Server Browser",
        "Microsoft SQL Server Browser",
        "Microsoft SQL Server Browser"
    ],
    "Point-to-Point Tunneling Protocol": [
        "Point-to-Point Tunneling Protocol",
        "Point-to-Point Tunneling Protocol",
        "Point-to-Point Tunneling Protocol",
        "Point-to-Point Tunneling Protocol",
        "Point-to-Point Tunneling Protocol",
        "Point-to-Point Tunneling Protocol",
        "Point-to-Point Tunneling Protocol"
    ],
    "Network File System": [
        "Network File System",
        "Network File System",
        "Network File System",
        "Network File System",
        "Network File System",
        "Network File System",
        "Network File System"
    ],
    "Remote Desktop Protocol": [
        "Remote Desktop Protocol",
        "Remote Desktop Protocol",
        "Remote Desktop Protocol",
        "Remote Desktop Protocol",
        "Remote Desktop Protocol",
        "Remote Desktop Protocol",
        "Remote Desktop Protocol"
    ],
    "Session Traversal Utilities for NAT": [
        "Session Traversal Utilities for NAT",
        "Session Traversal Utilities for NAT",
        "Session Traversal Utilities for NAT",
        "Session Traversal Utilities for NAT",
        "Session Traversal Utilities for NAT",
        "Session Traversal Utilities for NAT",
        "Session Traversal Utilities for NAT"
    ],
    "VoIP": [
        "VoIP",
        "VoIP",
        "VoIP",
        "VoIP",
        "VoIP",
        "VoIP",
        "VoIP"
    ],
    "Session Initiation Protocol (VoIP)": [
        "Session Initiation Protocol (VoIP)",
        "Session Initiation Protocol (VoIP)",
        "Session Initiation Protocol (VoIP)",
        "Session Initiation Protocol (VoIP)",
        "Session Initiation Protocol (VoIP)",
        "Session Initiation Protocol (VoIP)",
        "Session Initiation Protocol (VoIP)"
    ],
    "Advanced Message Queuing Protocol (RabbitMQ)": [
        "Advanced Message Queuing Protocol (RabbitMQ)",
        "Advanced Message Queuing Protocol (RabbitMQ)",
        "Advanced Message Queuing Protocol (RabbitMQ)",
        "Advanced Message Queuing Protocol (RabbitMQ)",
        "Advanced Message Queuing Protocol (RabbitMQ)",
        "Advanced Message Queuing Protocol (RabbitMQ)",
        "Advanced Message Queuing Protocol (RabbitMQ)"
    ],
    "Virtual Network Computing": [
        "Virtual Network Computing",
        "Virtual Network Computing",
        "Virtual Network Computing",
        "Virtual Network Computing",
        "Virtual Network Computing",
        "Virtual Network Computing",
        "Virtual Network Computing"
    ],
    "Apache CouchDB": [
        "Apache CouchDB",
        "Apache CouchDB",
        "Apache CouchDB",
        "Apache CouchDB",
        "Apache CouchDB",
        "Apache CouchDB",
        "Apache CouchDB"
    ],
    "Oracle WebLogic Server": [
        "Oracle WebLogic Server",
        "Oracle WebLogic Server",
        "Oracle WebLogic Server",
        "Oracle WebLogic Server",
        "Oracle WebLogic Server",
        "Oracle WebLogic Server",
        "Oracle WebLogic Server"
    ],
    "PHP FastCGI Process Manager, SonarQube": [
        "PHP FastCGI Process Manager, SonarQube",
        "PHP FastCGI Process Manager, SonarQube",
        "PHP FastCGI Process Manager, SonarQube",
        "PHP FastCGI Process Manager, SonarQube",
        "PHP FastCGI Process Manager, SonarQube",
        "PHP FastCGI Process Manager, SonarQube",
        "PHP FastCGI Process Manager, SonarQube"
    ],
    "Elasticsearch HTTP": [
        "Elasticsearch HTTP",
        "Elasticsearch HTTP",
        "Elasticsearch HTTP",
        "Elasticsearch HTTP",
        "Elasticsearch HTTP",
        "Elasticsearch HTTP",
        "Elasticsearch HTTP"
    ],
    "Message Queuing Telemetry Transport (IoT)": [
        "Message Queuing Telemetry Transport (IoT)",
        "Message Queuing Telemetry Transport (IoT)",
        "Message Queuing Telemetry Transport (IoT)",
        "Message Queuing Telemetry Transport (IoT)",
        "Message Queuing Telemetry Transport (IoT)",
        "Message Queuing Telemetry Transport (IoT)",
        "Message Queuing Telemetry Transport (IoT)"
    ],
    "Multicast DNS / Bonjour / Zeroconf": [
        "Multicast DNS / Bonjour / Zeroconf",
        "Multicast DNS / Bonjour / Zeroconf",
        "Multicast DNS / Bonjour / Zeroconf",
        "Multicast DNS / Bonjour / Zeroconf",
        "Multicast DNS / Bonjour / Zeroconf",
        "Multicast DNS / Bonjour / Zeroconf",
        "Multicast DNS / Bonjour / Zeroconf"
    ],
    "WireGuard VPN": [
        "WireGuard VPN",
        "WireGuard VPN",
        "WireGuard VPN",
        "WireGuard VPN",
        "WireGuard VPN",
        "WireGuard VPN",
        "WireGuard VPN"
    ],
    "API": [
        "API",
        "API",
        "API",
        "API",
        "API",
        "API",
        "API"
    ],
    "MongoDB shardsvr": [
        "MongoDB shardsvr",
        "MongoDB shardsvr",
        "MongoDB shardsvr",
        "MongoDB shardsvr",
        "MongoDB shardsvr",
        "MongoDB shardsvr",
        "MongoDB shardsvr"
    ],
    "MongoDB configsvr": [
        "MongoDB configsvr",
        "MongoDB configsvr",
        "MongoDB configsvr",
        "MongoDB configsvr",
        "MongoDB configsvr",
        "MongoDB configsvr",
        "MongoDB configsvr"
    ],
    "InfluxDB HTTP API": [
        "InfluxDB HTTP API",
        "InfluxDB HTTP API",
        "InfluxDB HTTP API",
        "InfluxDB HTTP API",
        "InfluxDB HTTP API",
        "InfluxDB HTTP API",
        "InfluxDB HTTP API"
    ],
    "Prometheus Node Exporter": [
        "Prometheus Node Exporter",
        "Prometheus Node Exporter",
        "Prometheus Node Exporter",
        "Prometheus Node Exporter",
        "Prometheus Node Exporter",
        "Prometheus Node Exporter",
        "Prometheus Node Exporter"
    ],
    "Prometheus Alertmanager": [
        "Prometheus Alertmanager",
        "Prometheus Alertmanager",
        "Prometheus Alertmanager",
        "Prometheus Alertmanager",
        "Prometheus Alertmanager",
        "Prometheus Alertmanager",
        "Prometheus Alertmanager"
    ],
    "HashiCorp Vault API": [
        "HashiCorp Vault API",
        "HashiCorp Vault API",
        "HashiCorp Vault API",
        "HashiCorp Vault API",
        "HashiCorp Vault API",
        "HashiCorp Vault API",
        "HashiCorp Vault API"
    ],
    "HashiCorp Consul HTTP API": [
        "HashiCorp Consul HTTP API",
        "HashiCorp Consul HTTP API",
        "HashiCorp Consul HTTP API",
        "HashiCorp Consul HTTP API",
        "HashiCorp Consul HTTP API",
        "HashiCorp Consul HTTP API",
        "HashiCorp Consul HTTP API"
    ],
    "HashiCorp Nomad HTTP API": [
        "HashiCorp Nomad HTTP API",
        "HashiCorp Nomad HTTP API",
        "HashiCorp Nomad HTTP API",
        "HashiCorp Nomad HTTP API",
        "HashiCorp Nomad HTTP API",
        "HashiCorp Nomad HTTP API",
        "HashiCorp Nomad HTTP API"
    ],
    "Kubernetes kubelet API": [
        "Kubernetes kubelet API",
        "Kubernetes kubelet API",
        "Kubernetes kubelet API",
        "Kubernetes kubelet API",
        "Kubernetes kubelet API",
        "Kubernetes kubelet API",
        "Kubernetes kubelet API"
    ],
    "Plex Media Server": [
        "Plex Media Server",
        "Plex Media Server",
        "Plex Media Server",
        "Plex Media Server",
        "Plex Media Server",
        "Plex Media Server",
        "Plex Media Server"
    ],
    "AS112-v4": [
        "AS112-v4",
        "AS112-v4",
        "AS112-v4",
        "AS112-v4",
        "AS112-v4",
        "AS112-v4",
        "AS112-v4"
    ],
    "Port": [
        "पोर्ट",
        "Puerto",
        "Port",
        "Port",
        "ポート",
        "端口",
        "المنفذ"
    ],
    "Protocol": [
        "प्रोटोकॉल",
        "Protocolo",
        "Protocole",
        "Protokoll",
        "プロトコル",
        "协议",
        "البروتوكول"
    ],
    "Description": [
        "विवरण",
        "Descripción",
        "Description",
        "Beschreibung",
        "説明",
        "说明",
        "الوصف"
    ],
    "Category": [
        "श्रेणी",
        "Categoría",
        "Catégorie",
        "Kategorie",
        "カテゴリ",
        "分类",
        "الفئة"
    ],
    "Port Number Reference": [
        "पोर्ट नंबर संदर्भ",
        "Referencia de números de puerto",
        "Référence des numéros de port",
        "Portnummern-Referenz",
        "ポート番号一覧",
        "端口号参考",
        "مرجع أرقام المنافذ"
    ],
    "All Categories": [
        "सभी श्रेणियाँ",
        "Todas las categorías",
        "Toutes les catégories",
        "Alle Kategorien",
        "すべてのカテゴリ",
        "所有分类",
        "جميع الفئات"
    ],
    "Security": [
        "सुरक्षा",
        "Seguridad",
        "Sécurité",
        "Sicherheit",
        "セキュリティ",
        "安全",
        "الأمان"
    ],
    "CIDR": [
        "CIDR",
        "CIDR",
        "CIDR",
        "CIDR",
        "CIDR",
        "CIDR",
        "CIDR"
    ],
    "IP Ranges Reference": [
        "IP रेंज संदर्भ",
        "Referencia de rangos IP",
        "Référence des plages IP",
        "IP-Bereichsreferenz",
        "IPアドレス範囲一覧",
        "IP 地址范围参考",
        "مرجع نطاقات IP"
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
    "MongoDB database": [
        "MongoDB डेटाबेस",
        "Base de datos MongoDB",
        "Base MongoDB",
        "MongoDB-Datenbank",
        "MongoDBデータベース",
        "MongoDB 数据库",
        "قاعدة بيانات MongoDB"
    ],
    "Private": [
        "निजी",
        "Privada",
        "Privée",
        "Privat",
        "プライベート",
        "私有",
        "خاص"
    ],
    "Loopback": [
        "लूपबैक",
        "Bucle local",
        "Boucle locale",
        "Loopback",
        "ループバック",
        "环回",
        "حلقة رجوع"
    ],
    "Link-Local (APIPA)": [
        "लिंक-स्थानीय (APIPA)",
        "Enlace local (APIPA)",
        "Lien local (APIPA)",
        "Link-lokal (APIPA)",
        "リンクローカル（APIPA）",
        "链路本地（APIPA）",
        "محلي للرابط (APIPA)"
    ],
    "Link-Local": [
        "लिंक-स्थानीय",
        "Enlace local",
        "Lien local",
        "Link-lokal",
        "リンクローカル",
        "链路本地",
        "محلي للرابط"
    ],
    "Multicast": [
        "मल्टीकास्ट",
        "Multidifusión",
        "Multidiffusion",
        "Multicast",
        "マルチキャスト",
        "多播",
        "بث متعدد"
    ],
    "Reserved": [
        "आरक्षित",
        "Reservada",
        "Réservée",
        "Reserviert",
        "予約済み",
        "保留",
        "محجوز"
    ],
    "Documentation": [
        "दस्तावेज़ीकरण",
        "Documentación",
        "Documentation",
        "Dokumentation",
        "文書用",
        "文档用途",
        "توثيق"
    ],
    "Global Unicast": [
        "वैश्विक यूनिकास्ट",
        "Unidifusión global",
        "Unicast global",
        "Globaler Unicast",
        "グローバルユニキャスト",
        "全局单播",
        "بث أحادي عالمي"
    ]
};
/** Searches all supplied translations as well as source data, so changing interface language preserves matching records. */
export function referenceNetworkMatches(query: string, ...fields: string[]): boolean {
    const needle = query.trim().toLowerCase();
    return fields.some(field => [field, ...(REFERENCE_NETWORK_TRANSLATIONS[field] ?? [])].some(value => value.toLowerCase().includes(needle)));
}
