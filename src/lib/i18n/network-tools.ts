import type { TranslationColumns } from "./tool-names";

// Authored UI only; network addresses, protocol data and payloads remain exact.
export const NETWORK_TOOL_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Enter a hostname": [
        "होस्टनाम दें",
        "Introduce un host",
        "Saisissez un nom d’hôte",
        "Hostnamen eingeben",
        "ホスト名を入力してください",
        "请输入主机名",
        "أدخل اسم مضيف"
    ],
    "Resolve A, AAAA, CNAME, MX, TXT, NS, SOA records via DNS-over-HTTPS": [
        "DNS-over-HTTPS से A, AAAA, CNAME, MX, TXT, NS, SOA रिकॉर्ड खोजें",
        "Resuelve registros A, AAAA, CNAME, MX, TXT, NS y SOA mediante DNS-over-HTTPS",
        "Résolvez les enregistrements A, AAAA, CNAME, MX, TXT, NS et SOA via DNS-over-HTTPS",
        "A-, AAAA-, CNAME-, MX-, TXT-, NS- und SOA-Einträge über DNS-over-HTTPS auflösen",
        "DNS-over-HTTPSでA・AAAA・CNAME・MX・TXT・NS・SOAレコードを照会",
        "通过 DNS-over-HTTPS 解析 A、AAAA、CNAME、MX、TXT、NS、SOA 记录",
        "حل سجلات A وAAAA وCNAME وMX وTXT وNS وSOA عبر DNS-over-HTTPS"
    ],
    "Query public DNS-over-HTTPS resolvers directly from your browser. The selected resolver receives the hostname and record types.": [
        "ब्राउज़र से सीधे सार्वजनिक DNS-over-HTTPS रिज़ॉल्वर पूछें। चुने गए रिज़ॉल्वर को होस्टनाम और रिकॉर्ड प्रकार मिलते हैं।",
        "Consulta resolutores públicos DNS-over-HTTPS desde el navegador. El resolutor elegido recibe el nombre de host y los tipos de registro.",
        "Interrogez des résolveurs publics DNS-over-HTTPS depuis le navigateur. Le résolveur choisi reçoit le nom d’hôte et les types d’enregistrement.",
        "Öffentliche DNS-over-HTTPS-Resolver direkt im Browser abfragen. Der gewählte Resolver erhält Hostname und Eintragstypen.",
        "ブラウザーから公開DNS-over-HTTPSリゾルバーに直接照会します。選択したリゾルバーにホスト名とレコード種別が送られます。",
        "直接从浏览器查询公共 DNS-over-HTTPS 解析器。所选解析器会收到主机名和记录类型。",
        "استعلم من المتصفح مباشرة عن محللات DNS-over-HTTPS العامة. يتلقى المحلل المحدد اسم المضيف وأنواع السجلات."
    ],
    "Compare DNS answers while diagnosing domain, email or resolver configuration.": [
        "डोमेन, ईमेल या रिज़ॉल्वर सेटिंग की जाँच करते समय DNS उत्तरों की तुलना करें।",
        "Compara respuestas DNS al diagnosticar dominios, correo o resolutores.",
        "Comparez les réponses DNS pour diagnostiquer un domaine, le courrier ou un résolveur.",
        "DNS-Antworten bei der Prüfung von Domain-, E-Mail- oder Resolver-Einstellungen vergleichen.",
        "ドメイン、メール、リゾルバーの設定を調査しながらDNS応答を比較します。",
        "排查域名、邮件或解析器配置时比较 DNS 响应。",
        "قارن إجابات DNS أثناء تشخيص إعدادات النطاق أو البريد أو المحلل."
    ],
    "Enter a hostname without a protocol or path.": [
        "प्रोटोकॉल या पथ के बिना होस्टनाम दर्ज करें।",
        "Introduce un nombre de host sin protocolo ni ruta.",
        "Saisissez un nom d’hôte sans protocole ni chemin.",
        "Hostnamen ohne Protokoll oder Pfad eingeben.",
        "プロトコルやパスを含めずホスト名を入力します。",
        "输入不含协议或路径的主机名。",
        "أدخل اسم مضيف بلا بروتوكول أو مسار."
    ],
    "Choose record types and a resolver, then select Lookup.": [
        "रिकॉर्ड प्रकार और रिज़ॉल्वर चुनें, फिर खोजें दबाएँ।",
        "Elige tipos de registro y resolutor; después pulsa Consultar.",
        "Choisissez les types et le résolveur, puis lancez la recherche.",
        "Eintragstypen und Resolver wählen, dann Abfragen auswählen.",
        "レコード種別とリゾルバーを選び、照会を実行します。",
        "选择记录类型和解析器，然后点击查询。",
        "اختر أنواع السجلات والمحلل، ثم اضغط استعلام."
    ],
    "Copy returned answers as zone-file lines.": [
        "मिले उत्तरों को ज़ोन-फ़ाइल की पंक्तियों के रूप में कॉपी करें।",
        "Copia las respuestas como líneas de archivo de zona.",
        "Copiez les réponses sous forme de lignes de fichier de zone.",
        "Antworten als Zonen-Dateizeilen kopieren.",
        "応答をゾーンファイル形式の行としてコピーします。",
        "将响应复制为区域文件行。",
        "انسخ الإجابات كسطور ملف منطقة."
    ],
    "TXT records can contain SPF, DKIM and ownership checks. MX preference uses smaller numbers first.": [
        "TXT रिकॉर्ड में SPF, DKIM और स्वामित्व जाँच हो सकती हैं। MX प्राथमिकता में छोटी संख्या पहले आती है।",
        "Los registros TXT pueden contener SPF, DKIM y verificaciones de propiedad. MX prioriza los números menores.",
        "Les enregistrements TXT peuvent contenir SPF, DKIM et des preuves de propriété. Les plus petites préférences MX sont prioritaires.",
        "TXT-Einträge können SPF, DKIM und Eigentumsnachweise enthalten. Kleinere MX-Präferenzwerte haben Vorrang.",
        "TXTレコードにはSPF、DKIM、所有権確認などが含まれます。MXは優先度の数値が小さいものを先に使用します。",
        "TXT 记录可包含 SPF、DKIM 和所有权验证信息。MX 优先使用较小的优先级数值。",
        "قد تتضمن سجلات TXT فحوص SPF وDKIM والملكية. تعطي أولوية MX الأفضلية للأرقام الأصغر."
    ],
    "Resolver access depends on network policy, CORS support and connectivity.": [
        "रिज़ॉल्वर तक पहुँच नेटवर्क नीति, CORS समर्थन और कनेक्टिविटी पर निर्भर है।",
        "El acceso depende de la política de red, CORS y la conectividad.",
        "L’accès dépend de la politique réseau, de CORS et de la connectivité.",
        "Der Resolver-Zugriff hängt von Netzwerkrichtlinien, CORS-Unterstützung und Verbindung ab.",
        "リゾルバーへの接続はネットワークポリシー、CORS対応、接続状況に依存します。",
        "能否访问解析器取决于网络策略、CORS 支持和连接情况。",
        "يعتمد الوصول إلى المحلل على سياسة الشبكة ودعم CORS والاتصال."
    ],
    "Check DNS changes and investigate email delivery.": [
        "DNS बदलाव और ईमेल डिलीवरी की जाँच करें।",
        "Comprueba cambios DNS e investiga la entrega de correo.",
        "Vérifiez les changements DNS et diagnostiquez l’acheminement du courrier.",
        "DNS-Änderungen und E-Mail-Zustellung prüfen.",
        "DNS変更の確認やメール配送の調査に使います。",
        "检查 DNS 变更并排查邮件投递。",
        "تحقق من تغييرات DNS وشخّص تسليم البريد."
    ],
    "Lookup": [
        "खोजें",
        "Consultar",
        "Rechercher",
        "Abfragen",
        "照会",
        "查询",
        "استعلام"
    ],
    "Types:": [
        "प्रकार:",
        "Tipos:",
        "Types :",
        "Typen:",
        "種別:",
        "类型：",
        "الأنواع:"
    ],
    "Record types": [
        "रिकॉर्ड प्रकार",
        "Tipos de registro",
        "Types d’enregistrement",
        "Eintragstypen",
        "レコード種別",
        "记录类型",
        "أنواع السجلات"
    ],
    "Resolver:": [
        "रिज़ॉल्वर:",
        "Resolutor:",
        "Résolveur :",
        "Resolver:",
        "リゾルバー:",
        "解析器：",
        "المحلل:"
    ],
    "Querying resolver…": [
        "रिज़ॉल्वर से पूछ रहे हैं…",
        "Consultando resolutor…",
        "Interrogation du résolveur…",
        "Resolver wird abgefragt…",
        "リゾルバーに照会中…",
        "正在查询解析器…",
        "جارٍ استعلام المحلل…"
    ],
    "Lookups go directly from your browser to the chosen DoH resolver — no proxy, no logging by mydevtools.": [
        "क्वेरी ब्राउज़र से सीधे चुने गए DoH रिज़ॉल्वर तक जाती है; mydevtools इसे प्रॉक्सी या लॉग नहीं करता।",
        "Las consultas van directamente al resolutor DoH elegido; mydevtools no las retransmite ni registra.",
        "Les requêtes vont directement au résolveur DoH choisi ; mydevtools ne les relaie ni ne les journalise.",
        "Abfragen gehen direkt vom Browser zum gewählten DoH-Resolver; mydevtools vermittelt und protokolliert sie nicht.",
        "照会はブラウザーから選択したDoHリゾルバーに直接送信され、mydevtoolsは中継・記録しません。",
        "查询直接从浏览器发往所选 DoH 解析器；mydevtools 不代理或记录查询。",
        "تنتقل الاستعلامات مباشرة من المتصفح إلى محلل DoH المحدد؛ لا يمررها mydevtools أو يسجلها."
    ],
    "Copied as zone-file lines": [
        "ज़ोन-फ़ाइल पंक्तियाँ कॉपी हो गईं",
        "Copiado como líneas de zona",
        "Lignes de fichier de zone copiées",
        "Als Zonen-Dateizeilen kopiert",
        "ゾーンファイル形式でコピーしました",
        "已复制为区域文件行",
        "نُسخت كسطور ملف منطقة"
    ],
    "All subnet info copied!": [
        "सबनेट की सारी जानकारी कॉपी हो गई!",
        "¡Información de subred copiada!",
        "Informations de sous-réseau copiées !",
        "Alle Subnetzinformationen kopiert!",
        "サブネット情報をコピーしました！",
        "已复制全部子网信息！",
        "نُسخت جميع معلومات الشبكة الفرعية!"
    ],
    "Subnet Mask": [
        "सबनेट मास्क",
        "Máscara de subred",
        "Masque de sous-réseau",
        "Subnetzmaske",
        "サブネットマスク",
        "子网掩码",
        "قناع الشبكة الفرعية"
    ],
    "Usable Hosts": [
        "उपयोग योग्य होस्ट",
        "Hosts utilizables",
        "Hôtes utilisables",
        "Nutzbare Hosts",
        "使用可能ホスト数",
        "可用主机",
        "المضيفون المتاحون"
    ],
    "Calculate subnet masks, network ranges, CIDR notation, and available hosts": [
        "सबनेट मास्क, नेटवर्क रेंज, CIDR और उपलब्ध होस्ट की गणना करें",
        "Calcula máscaras, rangos de red, CIDR y hosts disponibles",
        "Calculez masques, plages réseau, CIDR et hôtes disponibles",
        "Subnetzmasken, Netzwerkbereiche, CIDR und verfügbare Hosts berechnen",
        "サブネットマスク、ネットワーク範囲、CIDR、利用可能ホストを計算",
        "计算子网掩码、网络范围、CIDR 和可用主机",
        "احسب أقنعة الشبكات ونطاقاتها وCIDR والمضيفين المتاحين"
    ],
    "Calculate IPv4 network boundaries, subnet masks, broadcast addresses and usable host ranges locally.": [
        "IPv4 नेटवर्क सीमा, सबनेट मास्क, ब्रॉडकास्ट पते और उपयोग योग्य होस्ट रेंज की स्थानीय गणना करें।",
        "Calcula localmente límites IPv4, máscaras, direcciones de difusión y rangos de hosts utilizables.",
        "Calculez localement limites IPv4, masques, adresses de diffusion et plages d’hôtes utilisables.",
        "IPv4-Netzwerkgrenzen, Subnetzmasken, Broadcast-Adressen und nutzbare Hostbereiche lokal berechnen.",
        "IPv4のネットワーク境界、マスク、ブロードキャストアドレス、使用可能ホスト範囲をローカルで計算します。",
        "在本地计算 IPv4 网络边界、子网掩码、广播地址和可用主机范围。",
        "احسب محليًا حدود شبكة IPv4 وأقنعتها وعناوين البث ونطاقات المضيفين المتاحين."
    ],
    "Check IP allocation and firewall or router configuration without manual binary arithmetic.": [
        "हाथ से बाइनरी गणना किए बिना IP आवंटन और फ़ायरवॉल या राउटर सेटिंग जाँचें।",
        "Comprueba asignaciones IP y configuraciones de cortafuegos o routers sin cálculos binarios manuales.",
        "Vérifiez l’attribution IP et la configuration des pare-feu ou routeurs sans calcul binaire manuel.",
        "IP-Zuweisungen sowie Firewall- und Router-Einstellungen ohne manuelle Binärrechnung prüfen.",
        "手作業の二進数計算なしでIP割り当てやファイアウォール、ルーターの設定を確認します。",
        "无需手动二进制运算即可检查 IP 分配和防火墙或路由器配置。",
        "تحقق من تخصيص IP وإعدادات الجدار الناري أو الموجّه دون حساب ثنائي يدوي."
    ],
    "Enter an IPv4 address.": [
        "IPv4 पता दर्ज करें।",
        "Introduce una dirección IPv4.",
        "Saisissez une adresse IPv4.",
        "IPv4-Adresse eingeben.",
        "IPv4アドレスを入力します。",
        "输入 IPv4 地址。",
        "أدخل عنوان IPv4."
    ],
    "Choose a CIDR prefix from /0 to /32 or enter a contiguous subnet mask.": [
        "/0 से /32 तक CIDR प्रीफ़िक्स चुनें या लगातार बिट वाला सबनेट मास्क दर्ज करें।",
        "Elige un prefijo CIDR entre /0 y /32 o una máscara contigua.",
        "Choisissez un préfixe CIDR de /0 à /32 ou un masque contigu.",
        "CIDR-Präfix von /0 bis /32 wählen oder zusammenhängende Subnetzmaske eingeben.",
        "/0～/32のCIDRプレフィックスか、ビットが連続したサブネットマスクを指定します。",
        "选择 /0 到 /32 的 CIDR 前缀，或输入位连续的子网掩码。",
        "اختر بادئة CIDR من /0 إلى /32 أو أدخل قناع شبكة ذي بتات متصلة."
    ],
    "Inspect the host range, binary values and common subnet table. Copy values for documentation.": [
        "होस्ट रेंज, बाइनरी मान और सामान्य सबनेट तालिका देखें। दस्तावेज़ के लिए मान कॉपी करें।",
        "Revisa el rango de hosts, los valores binarios y la tabla de subredes. Copia valores para documentarlos.",
        "Examinez la plage d’hôtes, les valeurs binaires et les sous-réseaux courants. Copiez les valeurs pour votre documentation.",
        "Hostbereich, Binärwerte und übliche Subnetze prüfen. Werte für die Dokumentation kopieren.",
        "ホスト範囲、二進数表示、一般的なサブネット表を確認し、記録用に値をコピーします。",
        "查看主机范围、二进制值和常用子网表，并复制数值用于文档。",
        "راجع نطاق المضيفين والقيم الثنائية وجدول الشبكات الشائعة، وانسخ القيم للتوثيق."
    ],
    "A /24 network has 254 usable host addresses. /31 point-to-point networks use both addresses; /32 identifies one host.": [
        "/24 में 254 उपयोग योग्य होस्ट पते होते हैं। /31 पॉइंट-टू-पॉइंट नेटवर्क दोनों पते इस्तेमाल करता है; /32 एक होस्ट है।",
        "Una red /24 tiene 254 direcciones utilizables. /31 punto a punto usa ambas direcciones; /32 identifica un host.",
        "Un réseau /24 fournit 254 adresses utilisables. Un lien /31 utilise ses deux adresses ; /32 désigne un hôte.",
        "Ein /24-Netz hat 254 nutzbare Hostadressen. /31-Punkt-zu-Punkt-Netze verwenden beide Adressen; /32 bezeichnet einen Host.",
        "/24は254個の使用可能ホストアドレスを持ちます。/31のポイントツーポイント接続では両方を使用し、/32は1台のホストを示します。",
        "/24 网络有 254 个可用主机地址。/31 点对点网络使用两个地址；/32 表示一个主机。",
        "تضم شبكة /24 عدد 254 عنوان مضيف متاحًا. تستخدم شبكة /31 نقطة إلى نقطة كلا العنوانين؛ وتحدد /32 مضيفًا واحدًا."
    ],
    "Wildcard masks invert subnet masks and are used in ACLs and OSPF.": [
        "वाइल्डकार्ड मास्क सबनेट मास्क का उलटा है और ACL व OSPF में इस्तेमाल होता है।",
        "Las máscaras comodín son la inversa de las de subred y se usan en ACL y OSPF.",
        "Les masques génériques inversent les masques de sous-réseau et servent aux ACL et à OSPF.",
        "Wildcard-Masken invertieren Subnetzmasken und werden in ACLs und OSPF verwendet.",
        "ワイルドカードマスクはサブネットマスクの反転で、ACLやOSPFで使われます。",
        "通配符掩码是子网掩码的反码，用于 ACL 和 OSPF。",
        "تعكس أقنعة البدل أقنعة الشبكة الفرعية وتُستخدم في ACL وOSPF."
    ],
    "Plan subnets for routers, cloud networks and local environments.": [
        "राउटर, क्लाउड नेटवर्क और स्थानीय परिवेश के लिए सबनेट योजना बनाएँ।",
        "Planifica subredes para routers, redes en la nube y entornos locales.",
        "Planifiez des sous-réseaux pour routeurs, réseaux cloud et environnements locaux.",
        "Subnetze für Router, Cloud-Netze und lokale Umgebungen planen.",
        "ルーター、クラウドネットワーク、ローカル環境のサブネットを設計します。",
        "规划路由器、云网络和本地环境的子网。",
        "خطط شبكات فرعية للموجّهات والشبكات السحابية والبيئات المحلية."
    ],
    "Subnet Input": [
        "सबनेट इनपुट",
        "Datos de subred",
        "Entrée du sous-réseau",
        "Subnetzeingabe",
        "サブネット入力",
        "子网输入",
        "إدخال الشبكة الفرعية"
    ],
    "IP Address": [
        "IP पता",
        "Dirección IP",
        "Adresse IP",
        "IP-Adresse",
        "IPアドレス",
        "IP 地址",
        "عنوان IP"
    ],
    "Enter IP address (e.g., 192.168.1.0)": [
        "IP पता दर्ज करें (जैसे 192.168.1.0)",
        "Introduce una IP (p. ej., 192.168.1.0)",
        "Saisissez une IP (ex. 192.168.1.0)",
        "IP-Adresse eingeben (z. B. 192.168.1.0)",
        "IPアドレスを入力（例: 192.168.1.0）",
        "输入 IP 地址（例如 192.168.1.0）",
        "أدخل عنوان IP (مثل 192.168.1.0)"
    ],
    "Subnet": [
        "सबनेट",
        "Subred",
        "Sous-réseau",
        "Subnetz",
        "サブネット",
        "子网",
        "الشبكة الفرعية"
    ],
    "Invalid Input": [
        "अमान्य इनपुट",
        "Entrada no válida",
        "Entrée non valide",
        "Ungültige Eingabe",
        "無効な入力",
        "输入无效",
        "إدخال غير صالح"
    ],
    "Please enter a valid IPv4 address and subnet.": [
        "मान्य IPv4 पता और सबनेट दर्ज करें।",
        "Introduce una dirección IPv4 y una subred válidas.",
        "Saisissez une adresse IPv4 et un sous-réseau valides.",
        "Gültige IPv4-Adresse und gültiges Subnetz eingeben.",
        "有効なIPv4アドレスとサブネットを入力してください。",
        "请输入有效的 IPv4 地址和子网。",
        "أدخل عنوان IPv4 وشبكة فرعية صالحين."
    ],
    "Common Subnet Sizes": [
        "सामान्य सबनेट आकार",
        "Tamaños de subred comunes",
        "Tailles courantes de sous-réseau",
        "Übliche Subnetzgrößen",
        "一般的なサブネットサイズ",
        "常用子网大小",
        "أحجام الشبكات الفرعية الشائعة"
    ],
    "Subnet Information": [
        "सबनेट जानकारी",
        "Información de subred",
        "Informations du sous-réseau",
        "Subnetzinformationen",
        "サブネット情報",
        "子网信息",
        "معلومات الشبكة الفرعية"
    ],
    "IP Class": [
        "IP वर्ग",
        "Clase IP",
        "Classe IP",
        "IP-Klasse",
        "IPクラス",
        "IP 类别",
        "فئة IP"
    ],
    "Class {value}": [
        "वर्ग {value}",
        "Clase {value}",
        "Classe {value}",
        "Klasse {value}",
        "クラス {value}",
        "类别 {value}",
        "الفئة {value}"
    ],
    "Network Address": [
        "नेटवर्क पता",
        "Dirección de red",
        "Adresse réseau",
        "Netzwerkadresse",
        "ネットワークアドレス",
        "网络地址",
        "عنوان الشبكة"
    ],
    "Broadcast Address": [
        "ब्रॉडकास्ट पता",
        "Dirección de difusión",
        "Adresse de diffusion",
        "Broadcast-Adresse",
        "ブロードキャストアドレス",
        "广播地址",
        "عنوان البث"
    ],
    "Wildcard Mask": [
        "वाइल्डकार्ड मास्क",
        "Máscara comodín",
        "Masque générique",
        "Wildcard-Maske",
        "ワイルドカードマスク",
        "通配符掩码",
        "قناع البدل"
    ],
    "Used in ACLs and OSPF": [
        "ACL और OSPF में इस्तेमाल होता है",
        "Se usa en ACL y OSPF",
        "Utilisé dans les ACL et OSPF",
        "Für ACLs und OSPF verwendet",
        "ACLとOSPFで使用",
        "用于 ACL 和 OSPF",
        "يُستخدم في ACL وOSPF"
    ],
    "First Usable Host": [
        "पहला उपयोग योग्य होस्ट",
        "Primer host utilizable",
        "Premier hôte utilisable",
        "Erster nutzbarer Host",
        "最初の使用可能ホスト",
        "首个可用主机",
        "أول مضيف متاح"
    ],
    "Last Usable Host": [
        "आखिरी उपयोग योग्य होस्ट",
        "Último host utilizable",
        "Dernier hôte utilisable",
        "Letzter nutzbarer Host",
        "最後の使用可能ホスト",
        "最后可用主机",
        "آخر مضيف متاح"
    ],
    "Total Addresses": [
        "कुल पते",
        "Direcciones totales",
        "Adresses totales",
        "Adressen insgesamt",
        "総アドレス数",
        "地址总数",
        "إجمالي العناوين"
    ],
    "Binary Representation": [
        "बाइनरी रूप",
        "Representación binaria",
        "Représentation binaire",
        "Binärdarstellung",
        "二進数表示",
        "二进制表示",
        "التمثيل الثنائي"
    ],
    "Broadcast": [
        "ब्रॉडकास्ट",
        "Difusión",
        "Diffusion",
        "Broadcast",
        "ブロードキャスト",
        "广播",
        "البث"
    ],
    "Network bits": [
        "नेटवर्क बिट",
        "Bits de red",
        "Bits réseau",
        "Netzwerkbits",
        "ネットワークビット",
        "网络位",
        "بتات الشبكة"
    ],
    "Host bits": [
        "होस्ट बिट",
        "Bits de host",
        "Bits d’hôte",
        "Hostbits",
        "ホストビット",
        "主机位",
        "بتات المضيف"
    ],
    "Connect to ws:// and wss:// endpoints, send messages, watch frames stream in": [
        "ws:// और wss:// से जुड़ें, संदेश भेजें और आने वाले फ़्रेम देखें",
        "Conecta a ws:// y wss://, envía mensajes y observa los frames",
        "Connectez-vous à ws:// et wss://, envoyez des messages et suivez les trames",
        "Mit ws:// und wss:// verbinden, Nachrichten senden und Frames beobachten",
        "ws://・wss://に接続してメッセージを送り、フレームを確認",
        "连接 ws:// 和 wss:// 端点，发送消息并查看帧",
        "اتصل بنقاط ws:// وwss:// وأرسل الرسائل وتابع الإطارات"
    ],
    "Open a browser WebSocket connection, send text frames and inspect received messages with timestamps.": [
        "ब्राउज़र में WebSocket कनेक्शन खोलें, टेक्स्ट फ़्रेम भेजें और मिले संदेश समय सहित देखें।",
        "Abre una conexión WebSocket, envía frames de texto e inspecciona mensajes con marcas de tiempo.",
        "Ouvrez une connexion WebSocket, envoyez des trames texte et inspectez les messages horodatés.",
        "WebSocket-Verbindung im Browser öffnen, Textframes senden und empfangene Nachrichten mit Zeitstempeln prüfen.",
        "ブラウザーでWebSocketに接続し、テキストフレームを送信して受信メッセージを時刻付きで確認します。",
        "在浏览器中建立 WebSocket 连接，发送文本帧并查看带时间戳的接收消息。",
        "افتح اتصال WebSocket في المتصفح وأرسل إطارات نصية وراجع الرسائل المستلمة مع طوابعها الزمنية."
    ],
    "Exercise a WebSocket endpoint independently of an application and inspect connection events.": [
        "ऐप के बिना WebSocket एंडपॉइंट जाँचें और कनेक्शन घटनाएँ देखें।",
        "Prueba un endpoint WebSocket sin una aplicación e inspecciona sus eventos de conexión.",
        "Testez un point de terminaison WebSocket sans application et inspectez les événements de connexion.",
        "Einen WebSocket-Endpunkt unabhängig von einer Anwendung testen und Verbindungsereignisse prüfen.",
        "アプリケーションとは別にWebSocketエンドポイントを試し、接続イベントを確認します。",
        "独立于应用测试 WebSocket 端点并检查连接事件。",
        "اختبر نقطة WebSocket مستقلة عن التطبيق وراجع أحداث الاتصال."
    ],
    "Enter a ws:// or wss:// endpoint and select Connect.": [
        "ws:// या wss:// एंडपॉइंट दर्ज करें और कनेक्ट करें दबाएँ।",
        "Introduce un endpoint ws:// o wss:// y pulsa Conectar.",
        "Saisissez un point ws:// ou wss:// puis sélectionnez Connecter.",
        "ws://- oder wss://-Endpunkt eingeben und Verbinden wählen.",
        "ws://またはwss://のURLを入力して接続を選びます。",
        "输入 ws:// 或 wss:// 端点并点击连接。",
        "أدخل نقطة ws:// أو wss:// واضغط اتصال."
    ],
    "When connected, enter a message and select Send frame.": [
        "कनेक्ट होने पर संदेश दर्ज करें और फ़्रेम भेजें दबाएँ।",
        "Una vez conectado, escribe un mensaje y pulsa Enviar frame.",
        "Une fois connecté, saisissez un message puis sélectionnez Envoyer la trame.",
        "Nach dem Verbinden Nachricht eingeben und Frame senden wählen.",
        "接続後、メッセージを入力してフレームを送信します。",
        "连接后输入消息并点击发送帧。",
        "بعد الاتصال، أدخل رسالة واضغط إرسال إطار."
    ],
    "Disconnect to close the socket. Clear removes displayed frames.": [
        "सॉकेट बंद करने के लिए डिस्कनेक्ट करें। साफ़ करें से दिखाई गई फ़्रेम हटती हैं।",
        "Desconectar cierra el socket. Borrar elimina los frames mostrados.",
        "Déconnecter ferme le socket. Effacer supprime les trames affichées.",
        "Trennen schließt den Socket. Leeren entfernt angezeigte Frames.",
        "切断するとソケットを閉じます。クリアは表示中のフレームを消去します。",
        "断开连接会关闭套接字；清空会移除已显示的帧。",
        "قطع الاتصال يغلق المقبس. المسح يزيل الإطارات المعروضة."
    ],
    "HTTPS pages normally require wss://. Server origin checks and network policy can reject connections.": [
        "HTTPS पेज में सामान्यतः wss:// चाहिए। सर्वर की ओरिजिन जाँच और नेटवर्क नीति कनेक्शन रोक सकती हैं।",
        "Las páginas HTTPS suelen requerir wss://. El servidor o la política de red pueden rechazar la conexión.",
        "Les pages HTTPS nécessitent généralement wss://. Les contrôles d’origine du serveur ou la politique réseau peuvent refuser la connexion.",
        "HTTPS-Seiten benötigen normalerweise wss://. Origin-Prüfungen des Servers und Netzwerkrichtlinien können Verbindungen ablehnen.",
        "HTTPSページでは通常wss://が必要です。サーバーのオリジン検証やネットワークポリシーで接続が拒否される場合があります。",
        "HTTPS 页面通常需要 wss://。服务器来源检查和网络策略可能拒绝连接。",
        "تتطلب صفحات HTTPS عادةً wss://. وقد ترفض فحوص المصدر في الخادم أو سياسة الشبكة الاتصالات."
    ],
    "Binary messages show their byte length; their contents are not decoded.": [
        "बाइनरी संदेशों की बाइट लंबाई दिखाई जाती है; सामग्री डिकोड नहीं होती।",
        "Los mensajes binarios muestran su longitud en bytes; no se decodifica su contenido.",
        "Les messages binaires affichent leur longueur en octets ; leur contenu n’est pas décodé.",
        "Binärnachrichten zeigen ihre Bytelänge; ihr Inhalt wird nicht dekodiert.",
        "バイナリメッセージはバイト数を表示し、内容はデコードしません。",
        "二进制消息仅显示字节长度，不解码内容。",
        "تعرض الرسائل الثنائية طولها بالبايت؛ ولا تُفك محتوياتها."
    ],
    "Reproduce a failing message or inspect application heartbeat traffic. Browser clients cannot send protocol-level ping frames.": [
        "विफल संदेश दोहराएँ या ऐप का हार्टबीट ट्रैफ़िक देखें। ब्राउज़र क्लाइंट प्रोटोकॉल-स्तरीय ping फ़्रेम नहीं भेज सकते।",
        "Reproduce un mensaje fallido o inspecciona heartbeats. Los clientes de navegador no pueden enviar frames ping del protocolo.",
        "Reproduisez un message défaillant ou inspectez les signaux de vie. Les clients du navigateur ne peuvent pas envoyer de trames ping du protocole.",
        "Fehlerhafte Nachrichten nachstellen oder Anwendungs-Heartbeats prüfen. Browser-Clients können keine Ping-Frames auf Protokollebene senden.",
        "失敗するメッセージの再現やアプリのハートビート確認に使います。ブラウザークライアントはプロトコルレベルのpingフレームを送信できません。",
        "复现失败消息或检查应用心跳流量。浏览器客户端无法发送协议层 ping 帧。",
        "أعد إنتاج رسالة فاشلة أو راجع نبضات التطبيق. لا تستطيع عملاء المتصفح إرسال إطارات ping على مستوى البروتوكول."
    ],
    "Connection": [
        "कनेक्शन",
        "Conexión",
        "Connexion",
        "Verbindung",
        "接続",
        "连接",
        "الاتصال"
    ],
    "Connect": [
        "कनेक्ट करें",
        "Conectar",
        "Connecter",
        "Verbinden",
        "接続",
        "连接",
        "اتصال"
    ],
    "Disconnect": [
        "डिस्कनेक्ट करें",
        "Desconectar",
        "Déconnecter",
        "Trennen",
        "切断",
        "断开连接",
        "قطع الاتصال"
    ],
    "Send frame": [
        "फ़्रेम भेजें",
        "Enviar frame",
        "Envoyer la trame",
        "Frame senden",
        "フレームを送信",
        "发送帧",
        "إرسال إطار"
    ],
    "Frames": [
        "फ़्रेम",
        "Frames",
        "Trames",
        "Frames",
        "フレーム",
        "帧",
        "الإطارات"
    ],
    "Connect and send a frame": [
        "कनेक्ट करके फ़्रेम भेजें",
        "Conecta y envía un frame",
        "Connectez-vous et envoyez une trame",
        "Verbinden und einen Frame senden",
        "接続してフレームを送信してください",
        "连接并发送帧",
        "اتصل وأرسل إطارًا"
    ],
    "Sent": [
        "भेजा गया",
        "Enviado",
        "Envoyé",
        "Gesendet",
        "送信",
        "已发送",
        "مُرسل"
    ],
    "Received": [
        "प्राप्त",
        "Recibido",
        "Reçu",
        "Empfangen",
        "受信",
        "已接收",
        "مُستلم"
    ],
    "System": [
        "सिस्टम",
        "Sistema",
        "Système",
        "System",
        "システム",
        "系统",
        "النظام"
    ],
    "Socket not open": [
        "सॉकेट खुला नहीं है",
        "El socket no está abierto",
        "Le socket n’est pas ouvert",
        "Socket ist nicht geöffnet",
        "ソケットが開いていません",
        "套接字未打开",
        "المقبس غير مفتوح"
    ],
    "closed": [
        "बंद",
        "cerrado",
        "fermée",
        "geschlossen",
        "切断済み",
        "已关闭",
        "مغلق"
    ],
    "connecting": [
        "कनेक्ट हो रहा है",
        "conectando",
        "connexion en cours",
        "Verbindung wird hergestellt",
        "接続中",
        "连接中",
        "جارٍ الاتصال"
    ],
    "closing": [
        "बंद हो रहा है",
        "cerrando",
        "fermeture en cours",
        "wird geschlossen",
        "切断中",
        "关闭中",
        "جارٍ الإغلاق"
    ],
    "Connecting to {url}…": [
        "{url} से कनेक्ट हो रहा है…",
        "Conectando a {url}…",
        "Connexion à {url}…",
        "Verbindung mit {url} wird hergestellt…",
        "{url}に接続中…",
        "正在连接 {url}…",
        "جارٍ الاتصال بـ {url}…"
    ],
    "Connection opened": [
        "कनेक्शन खुल गया",
        "Conexión abierta",
        "Connexion ouverte",
        "Verbindung geöffnet",
        "接続しました",
        "连接已建立",
        "فُتح الاتصال"
    ],
    "Socket error": [
        "सॉकेट त्रुटि",
        "Error de socket",
        "Erreur de socket",
        "Socket-Fehler",
        "ソケットエラー",
        "套接字错误",
        "خطأ في المقبس"
    ],
    "Closed (code {code}, reason: {reason})": [
        "बंद (कोड {code}, कारण: {reason})",
        "Cerrado (código {code}, motivo: {reason})",
        "Fermée (code {code}, raison : {reason})",
        "Geschlossen (Code {code}, Grund: {reason})",
        "切断（コード {code}、理由: {reason}）",
        "已关闭（代码 {code}，原因：{reason}）",
        "أُغلق (الرمز {code}، السبب: {reason})"
    ],
    "Closed (code {code})": [
        "बंद (कोड {code})",
        "Cerrado (código {code})",
        "Fermée (code {code})",
        "Geschlossen (Code {code})",
        "切断（コード {code}）",
        "已关闭（代码 {code}）",
        "أُغلق (الرمز {code})"
    ],
    "WebSocket URL": [
        "WebSocket URL",
        "URL de WebSocket",
        "URL WebSocket",
        "WebSocket-URL",
        "WebSocket URL",
        "WebSocket URL",
        "عنوان WebSocket"
    ],
    "Message to send": [
        "भेजने का संदेश",
        "Mensaje para enviar",
        "Message à envoyer",
        "Zu sendende Nachricht",
        "送信するメッセージ",
        "待发送消息",
        "الرسالة المراد إرسالها"
    ],
    "Subnet input mode": [
        "सबनेट इनपुट मोड",
        "Modo de entrada de subred",
        "Mode de saisie du sous-réseau",
        "Subnetz-Eingabemodus",
        "サブネット入力モード",
        "子网输入模式",
        "وضع إدخال الشبكة الفرعية"
    ],
    "CIDR prefix length": [
        "CIDR प्रीफ़िक्स लंबाई",
        "Longitud de prefijo CIDR",
        "Longueur du préfixe CIDR",
        "CIDR-Präfixlänge",
        "CIDRプレフィックス長",
        "CIDR 前缀长度",
        "طول بادئة CIDR"
    ],
    "CIDR Notation": [
        "CIDR संकेतन",
        "Notación CIDR",
        "Notation CIDR",
        "CIDR-Schreibweise",
        "CIDR表記",
        "CIDR 表示",
        "صيغة CIDR"
    ],
    "Parse and analyze URLs into components": [
        "URL के भाग अलग करके जाँचें",
        "Analiza los componentes de una URL",
        "Analysez les composants des URL",
        "URLs in Bestandteile zerlegen und analysieren",
        "URLを構成要素に分解して解析",
        "解析和分析 URL 的组成部分",
        "حلل عناوين URL إلى مكوناتها"
    ],
    "Inspect URL components using the browser WHATWG URL parser. Parsing happens locally and does not open the URL.": [
        "ब्राउज़र के WHATWG URL पार्सर से URL भाग देखें। पार्सिंग स्थानीय होती है और URL नहीं खुलता।",
        "Inspecciona componentes con el parser WHATWG URL del navegador. El análisis es local y no abre la URL.",
        "Inspectez les composants avec le parseur WHATWG URL du navigateur. L’analyse est locale et n’ouvre pas l’URL.",
        "URL-Bestandteile mit dem WHATWG-URL-Parser des Browsers prüfen. Die lokale Analyse öffnet die URL nicht.",
        "ブラウザーのWHATWG URLパーサーで構成要素を確認します。解析はローカルで行われ、URLは開きません。",
        "使用浏览器的 WHATWG URL 解析器检查组成部分。解析在本地进行，不会打开 URL。",
        "راجع مكونات URL بمحلل WHATWG URL في المتصفح. يتم التحليل محليًا ولا يفتح العنوان."
    ],
    "Check encoded paths, credentials, duplicate query parameters and fragments while debugging links.": [
        "लिंक जाँचते समय एन्कोड किए पथ, क्रेडेंशियल, दोहराए क्वेरी पैरामीटर और फ़्रैगमेंट देखें।",
        "Comprueba rutas codificadas, credenciales, parámetros repetidos y fragmentos al depurar enlaces.",
        "Vérifiez chemins encodés, identifiants, paramètres répétés et fragments lors du débogage des liens.",
        "Kodierte Pfade, Zugangsdaten, doppelte Abfrageparameter und Fragmente beim Prüfen von Links untersuchen.",
        "リンクのデバッグ時にエンコード済みパス、認証情報、重複クエリ、フラグメントを確認します。",
        "调试链接时检查编码路径、凭据、重复查询参数和片段。",
        "تحقق من المسارات المرمّزة وبيانات الاعتماد والمعلمات المكررة والأجزاء أثناء تصحيح الروابط."
    ],
    "Paste an absolute URL, including its scheme.": [
        "स्कीम सहित पूरा URL पेस्ट करें।",
        "Pega una URL absoluta con su esquema.",
        "Collez une URL absolue avec son schéma.",
        "Absolute URL einschließlich Schema einfügen.",
        "スキームを含む絶対URLを貼り付けます。",
        "粘贴包含协议方案的绝对 URL。",
        "ألصق عنوان URL مطلقًا مع مخططه."
    ],
    "Inspect components and query parameters. Duplicate keys stay in their original order.": [
        "भाग और क्वेरी पैरामीटर देखें। दोहराई कुंजियाँ मूल क्रम में रहती हैं।",
        "Inspecciona componentes y parámetros. Las claves repetidas mantienen su orden.",
        "Inspectez les composants et paramètres. Les clés répétées conservent leur ordre initial.",
        "Bestandteile und Abfrageparameter prüfen. Doppelte Schlüssel behalten ihre ursprüngliche Reihenfolge.",
        "構成要素とクエリを確認します。重複キーは元の順序を保ちます。",
        "检查组成部分和查询参数。重复键保持原始顺序。",
        "راجع المكونات ومعلمات الاستعلام. تبقى المفاتيح المكررة بترتيبها الأصلي."
    ],
    "Copy the normalized full URL or an individual component.": [
        "सामान्यीकृत पूरा URL या कोई एक भाग कॉपी करें।",
        "Copia la URL normalizada completa o un componente.",
        "Copiez l’URL complète normalisée ou un composant.",
        "Vollständige normalisierte URL oder einzelnen Bestandteil kopieren.",
        "正規化済みのURL全体または各構成要素をコピーします。",
        "复制规范化的完整 URL 或单个组成部分。",
        "انسخ عنوان URL الكامل بعد التطبيع أو مكونًا منفردًا."
    ],
    "Query values are decoded once by URLSearchParams. Fragments stay client-side; default ports are normalized.": [
        "URLSearchParams क्वेरी मान एक बार डिकोड करता है। फ़्रैगमेंट क्लाइंट पर रहते हैं; डिफ़ॉल्ट पोर्ट सामान्यीकृत होते हैं।",
        "URLSearchParams decodifica los valores una vez. Los fragmentos quedan en el cliente y los puertos predeterminados se normalizan.",
        "URLSearchParams décode les valeurs une seule fois. Les fragments restent côté client ; les ports par défaut sont normalisés.",
        "URLSearchParams dekodiert Abfragewerte einmal. Fragmente bleiben clientseitig; Standardports werden normalisiert.",
        "クエリ値はURLSearchParamsが一度だけデコードします。フラグメントはクライアント側に残り、既定ポートは正規化されます。",
        "查询值仅由 URLSearchParams 解码一次。片段保留在客户端；默认端口会规范化。",
        "يفك URLSearchParams قيم الاستعلام مرة واحدة. تبقى الأجزاء لدى العميل وتُطبّع المنافذ الافتراضية."
    ],
    "Usernames, passwords and tokens remain visible in the input and results.": [
        "यूज़रनेम, पासवर्ड और टोकन इनपुट व परिणाम में दिखाई देते हैं।",
        "Los usuarios, contraseñas y tokens quedan visibles en la entrada y los resultados.",
        "Les noms d’utilisateur, mots de passe et jetons restent visibles dans l’entrée et les résultats.",
        "Benutzernamen, Passwörter und Tokens bleiben in Eingabe und Ergebnissen sichtbar.",
        "ユーザー名、パスワード、トークンは入力と結果に表示されます。",
        "用户名、密码和令牌在输入和结果中保持可见。",
        "تبقى أسماء المستخدمين وكلمات المرور والرموز ظاهرة في الإدخال والنتائج."
    ],
    "Inspect callback URLs, signed links and application deep links.": [
        "कॉलबैक URL, हस्ताक्षरित लिंक और ऐप डीप लिंक जाँचें।",
        "Inspecciona URL de retorno, enlaces firmados y enlaces profundos.",
        "Inspectez les URL de rappel, liens signés et liens profonds d’applications.",
        "Callback-URLs, signierte Links und App-Deep-Links prüfen.",
        "コールバックURL、署名付きリンク、アプリのディープリンクを確認します。",
        "检查回调 URL、签名链接和应用深层链接。",
        "راجع عناوين الاستدعاء والروابط الموقعة والروابط العميقة للتطبيقات."
    ],
    "Enter URL to parse...": [
        "पार्स करने का URL दर्ज करें…",
        "Introduce la URL que analizar…",
        "Saisissez l’URL à analyser…",
        "Zu analysierende URL eingeben…",
        "解析するURLを入力…",
        "输入要解析的 URL…",
        "أدخل عنوان URL لتحليله…"
    ],
    "Examples:": [
        "उदाहरण:",
        "Ejemplos:",
        "Exemples :",
        "Beispiele:",
        "例:",
        "示例：",
        "أمثلة:"
    ],
    "URL Components": [
        "URL के भाग",
        "Componentes de URL",
        "Composants de l’URL",
        "URL-Bestandteile",
        "URL構成要素",
        "URL 组成部分",
        "مكونات URL"
    ],
    "Query Parameters": [
        "क्वेरी पैरामीटर",
        "Parámetros de consulta",
        "Paramètres de requête",
        "Abfrageparameter",
        "クエリパラメーター",
        "查询参数",
        "معلمات الاستعلام"
    ],
    "No query parameters": [
        "कोई क्वेरी पैरामीटर नहीं",
        "Sin parámetros de consulta",
        "Aucun paramètre de requête",
        "Keine Abfrageparameter",
        "クエリパラメーターなし",
        "没有查询参数",
        "لا توجد معلمات استعلام"
    ],
    "URL Structure": [
        "URL संरचना",
        "Estructura de URL",
        "Structure de l’URL",
        "URL-Struktur",
        "URL構造",
        "URL 结构",
        "بنية URL"
    ],
    "Invalid URL. Please enter a valid URL.": [
        "URL अमान्य है। मान्य URL दर्ज करें।",
        "URL no válida. Introduce una URL válida.",
        "URL non valide. Saisissez une URL valide.",
        "Ungültige URL. Bitte eine gültige URL eingeben.",
        "無効なURLです。有効なURLを入力してください。",
        "URL 无效。请输入有效的 URL。",
        "عنوان URL غير صالح. أدخل عنوانًا صالحًا."
    ],
    "URL to parse": [
        "पार्स करने का URL",
        "URL que analizar",
        "URL à analyser",
        "Zu analysierende URL",
        "解析するURL",
        "要解析的 URL",
        "عنوان URL للتحليل"
    ],
    "(none)": [
        "(कोई नहीं)",
        "(ninguno)",
        "(aucun)",
        "(keine)",
        "（なし）",
        "（无）",
        "(لا يوجد)"
    ],
    "(default)": [
        "(डिफ़ॉल्ट)",
        "(predeterminado)",
        "(par défaut)",
        "(Standard)",
        "（既定）",
        "（默认）",
        "(افتراضي)"
    ],
    "Full URL": [
        "पूरा URL",
        "URL completa",
        "URL complète",
        "Vollständige URL",
        "完全なURL",
        "完整 URL",
        "عنوان URL الكامل"
    ],
    "Origin": [
        "ओरिजिन",
        "Origen",
        "Origine",
        "Ursprung",
        "オリジン",
        "源",
        "الأصل"
    ],
    "Pathname": [
        "पथ",
        "Ruta",
        "Chemin",
        "Pfad",
        "パス名",
        "路径名",
        "اسم المسار"
    ],
    "Search": [
        "खोज",
        "Búsqueda",
        "Recherche",
        "Suche",
        "検索",
        "搜索",
        "بحث"
    ],
    "Hash": [
        "हैश",
        "Fragmento",
        "Fragment",
        "Fragment",
        "ハッシュ",
        "片段",
        "الجزء"
    ],
    "Class A": [
        "वर्ग A",
        "Clase A",
        "Classe A",
        "Klasse A",
        "クラスA",
        "A 类",
        "الفئة A"
    ],
    "Class B": [
        "वर्ग B",
        "Clase B",
        "Classe B",
        "Klasse B",
        "クラスB",
        "B 类",
        "الفئة B"
    ],
    "Class C": [
        "वर्ग C",
        "Clase C",
        "Classe C",
        "Klasse C",
        "クラスC",
        "C 类",
        "الفئة C"
    ],
    "Half C": [
        "आधा C",
        "Media C",
        "Demi-C",
        "Halbes C",
        "Cの半分",
        "半个 C 类",
        "نصف C"
    ],
    "Quarter C": [
        "चौथाई C",
        "Un cuarto de C",
        "Quart de C",
        "Viertel C",
        "Cの4分の1",
        "四分之一个 C 类",
        "ربع C"
    ],
    "1/8 C": [
        "C का 1/8",
        "1/8 de C",
        "1/8 de C",
        "1/8 von C",
        "Cの1/8",
        "C 类的 1/8",
        "1/8 من C"
    ],
    "1/16 C": [
        "C का 1/16",
        "1/16 de C",
        "1/16 de C",
        "1/16 von C",
        "Cの1/16",
        "C 类的 1/16",
        "1/16 من C"
    ],
    "1/32 C": [
        "C का 1/32",
        "1/32 de C",
        "1/32 de C",
        "1/32 von C",
        "Cの1/32",
        "C 类的 1/32",
        "1/32 من C"
    ],
    "Point-to-Point": [
        "पॉइंट-टू-पॉइंट",
        "Punto a punto",
        "Point à point",
        "Punkt zu Punkt",
        "ポイントツーポイント",
        "点对点",
        "نقطة إلى نقطة"
    ],
    "Point-to-Point (RFC 3021)": [
        "पॉइंट-टू-पॉइंट (RFC 3021)",
        "Punto a punto (RFC 3021)",
        "Point à point (RFC 3021)",
        "Punkt zu Punkt (RFC 3021)",
        "ポイントツーポイント（RFC 3021）",
        "点对点 (RFC 3021)",
        "نقطة إلى نقطة (RFC 3021)"
    ],
    "Host Route": [
        "होस्ट रूट",
        "Ruta de host",
        "Route d’hôte",
        "Hostroute",
        "ホストルート",
        "主机路由",
        "مسار المضيف"
    ],
    "DNS Lookup": [
        "DNS खोज",
        "Consulta DNS",
        "Recherche DNS",
        "DNS-Abfrage",
        "DNS検索",
        "DNS 查询",
        "استعلام DNS"
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
    "Results": [
        "परिणाम",
        "Resultados",
        "Résultats",
        "Ergebnisse",
        "結果",
        "结果",
        "النتائج"
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
    "No records": [
        "कोई रिकॉर्ड नहीं",
        "Sin registros",
        "Aucune entrée",
        "Keine Einträge",
        "レコードなし",
        "无记录",
        "لا توجد سجلات"
    ],
    "Copied!": [
        "कॉपी हो गया!",
        "¡Copiado!",
        "Copié !",
        "Kopiert!",
        "コピーしました！",
        "已复制！",
        "تم النسخ!"
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
    "Action": [
        "कार्रवाई",
        "Acción",
        "Action",
        "Aktion",
        "操作",
        "操作",
        "الإجراء"
    ],
    "Use": [
        "इस्तेमाल करें",
        "Usar",
        "Utiliser",
        "Verwenden",
        "使用",
        "使用",
        "استخدام"
    ],
    "Subnet Calculator": [
        "सबनेट कैलकुलेटर",
        "Calculadora de subredes",
        "Calculateur de sous-réseaux",
        "Subnetzrechner",
        "サブネット計算",
        "子网计算器",
        "حاسبة الشبكات الفرعية"
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
    "Network": [
        "नेटवर्क",
        "Red",
        "Réseau",
        "Netzwerk",
        "ネットワーク",
        "网络",
        "الشبكة"
    ],
    "WebSocket Tester": [
        "WebSocket परीक्षण",
        "Probador de WebSocket",
        "Testeur WebSocket",
        "WebSocket-Tester",
        "WebSocketテスター",
        "WebSocket 测试器",
        "مختبر WebSocket"
    ],
    "Send": [
        "भेजें",
        "Enviar",
        "Envoyer",
        "Senden",
        "送信",
        "发送",
        "إرسال"
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
    "URL Parser": [
        "URL पार्सर",
        "Analizador de URL",
        "Analyseur d’URL",
        "URL-Parser",
        "URL解析",
        "URL 解析器",
        "محلل URL"
    ],
    "Username": [
        "उपयोगकर्ता नाम",
        "Usuario",
        "Nom d’utilisateur",
        "Benutzername",
        "ユーザー名",
        "用户名",
        "اسم المستخدم"
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
    "Key": [
        "कुंजी",
        "Clave",
        "Clé",
        "Schlüssel",
        "キー",
        "键",
        "المفتاح"
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
    "open": [
        "खोलें",
        "abrir",
        "ouvrir",
        "öffnen",
        "開く",
        "打开",
        "فتح"
    ],
    "Hostname": [
        "होस्टनाम",
        "Nombre del host",
        "Nom d’hôte",
        "Hostname",
        "ホスト名",
        "主机名",
        "اسم المضيف"
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
    "Host": [
        "होस्ट",
        "Host",
        "Hôte",
        "Host",
        "ホスト",
        "主机",
        "المضيف"
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
    "[binary blob, {count} bytes]": [
        "[बाइनरी ब्लॉब, {count} बाइट]",
        "[blob binario, {count} bytes]",
        "[blob binaire, {count} octets]",
        "[Binär-Blob, {count} Bytes]",
        "[バイナリBlob、{count}バイト]",
        "[二进制 Blob，{count} 字节]",
        "[كتلة ثنائية، {count} بايت]"
    ],
    "[binary, {count} bytes]": [
        "[बाइनरी, {count} बाइट]",
        "[binario, {count} bytes]",
        "[binaire, {count} octets]",
        "[Binär, {count} Bytes]",
        "[バイナリ、{count}バイト]",
        "[二进制，{count} 字节]",
        "[ثنائي، {count} بايت]"
    ],
    "D (Multicast)": [
        "D (मल्टीकास्ट)",
        "D (multidifusión)",
        "D (multidiffusion)",
        "D (Multicast)",
        "D（マルチキャスト）",
        "D（组播）",
        "D (بث متعدد)"
    ],
    "E (Reserved)": [
        "E (आरक्षित)",
        "E (reservada)",
        "E (réservée)",
        "E (reserviert)",
        "E（予約済み）",
        "E（保留）",
        "E (محجوزة)"
    ],
    "Unknown": [
        "अज्ञात",
        "Desconocido",
        "Inconnu",
        "Unbekannt",
        "不明",
        "未知",
        "غير معروف"
    ]
};
