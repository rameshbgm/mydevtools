import type { TranslationColumns } from "./tool-names";

// Authored explanations only. Official identifiers, titles, links and example bytes stay exact.
export const REFERENCE_STANDARDS_TRANSLATIONS: Record<string, TranslationColumns> = {
    "OAuth security guidance: use PKCE S256; do not use password grants.": [
        "OAuth सुरक्षा: PKCE S256 उपयोग करें; पासवर्ड ग्रांट न उपयोग करें।",
        "Seguridad OAuth: usa PKCE S256; no uses la concesión de contraseña.",
        "Sécurité OAuth : utilisez PKCE S256, jamais le grant par mot de passe.",
        "OAuth-Sicherheit: PKCE S256 verwenden, keine Passwort-Grants.",
        "OAuthの安全指針：PKCE S256を使用し、パスワードグラントは使用しません。",
        "OAuth 安全指南：使用 PKCE S256，禁止密码授权。",
        "إرشادات أمان OAuth: استخدم PKCE S256 ولا تستخدم منح كلمة المرور."
    ],
    "Validate JWT algorithms, keys, issuer and audience; decoding is not verification.": [
        "JWT एल्गोरिदम, कुंजी, जारीकर्ता और ऑडियंस जाँचें; डिकोड करना सत्यापन नहीं।",
        "Valida algoritmos, claves, emisor y audiencia JWT; decodificar no verifica.",
        "Validez algorithmes, clés, émetteur et audience JWT ; décoder ne vérifie pas.",
        "JWT-Algorithmen, Schlüssel, Aussteller und Zielgruppe prüfen; Dekodieren ist keine Verifikation.",
        "JWTのアルゴリズム・鍵・発行者・対象を検証します。デコードだけでは検証になりません。",
        "验证 JWT 算法、密钥、签发者和受众；解码不等于验证。",
        "تحقق من خوارزميات JWT ومفاتيحها ومصدرها وجمهورها؛ فك الترميز ليس تحققا."
    ],
    "Compact claims format carried in JWS or JWE.": [
        "JWS या JWE में भेजा जाने वाला संक्षिप्त क्लेम प्रारूप।",
        "Formato compacto de claims transportado en JWS o JWE.",
        "Format compact de revendications transporté par JWS ou JWE.",
        "Kompaktes Claim-Format in JWS oder JWE.",
        "JWSまたはJWEで運ぶコンパクトなクレーム形式。",
        "以 JWS 或 JWE 承载的紧凑声明格式。",
        "تنسيق مطالبات مختصر يحمل في JWS أو JWE."
    ],
    "JSON-based signed or MAC-protected content.": [
        "JSON आधारित हस्ताक्षरित या MAC-सुरक्षित सामग्री।",
        "Contenido JSON firmado o protegido por MAC.",
        "Contenu JSON signé ou protégé par MAC.",
        "JSON-basierter signierter oder MAC-geschützter Inhalt.",
        "JSONを使う署名またはMACで保護したコンテンツ。",
        "基于 JSON 的签名或 MAC 保护内容。",
        "محتوى قائم على JSON موقع أو محمي برمز MAC."
    ],
    "JSON-based authenticated encryption for confidential content.": [
        "गोपनीय सामग्री के लिए JSON आधारित प्रमाणित एन्क्रिप्शन।",
        "Cifrado autenticado basado en JSON para contenido confidencial.",
        "Chiffrement authentifié JSON pour contenu confidentiel.",
        "JSON-basierte authentifizierte Verschlüsselung vertraulicher Inhalte.",
        "機密コンテンツ向けのJSONベース認証付き暗号化。",
        "用于机密内容的 JSON 认证加密。",
        "تشفير موثق قائم على JSON للمحتوى السري."
    ],
    "JSON representations of cryptographic keys and key sets.": [
        "क्रिप्टोग्राफ़िक कुंजियों और कुंजी समूहों का JSON निरूपण।",
        "Representaciones JSON de claves criptográficas y conjuntos de claves.",
        "Représentation JSON des clés cryptographiques et de leurs ensembles.",
        "JSON-Darstellung kryptografischer Schlüssel und Schlüsselsätze.",
        "暗号鍵と鍵集合のJSON表現。",
        "加密密钥及密钥集的 JSON 表示。",
        "تمثيلات JSON للمفاتيح التشفيرية ومجموعاتها."
    ],
    "Algorithm identifiers and requirements for JOSE cryptography.": [
        "JOSE क्रिप्टोग्राफ़ी के एल्गोरिदम पहचानकर्ता और आवश्यकताएँ।",
        "Identificadores y requisitos de algoritmos criptográficos JOSE.",
        "Identifiants et exigences des algorithmes cryptographiques JOSE.",
        "Algorithmuskennungen und Anforderungen der JOSE-Kryptografie.",
        "JOSE暗号処理のアルゴリズム識別子と要件。",
        "JOSE 加密算法标识符和要求。",
        "معرفات الخوارزميات ومتطلبات تشفير JOSE."
    ],
    "Delegated authorization framework; apply RFC 9700 security guidance.": [
        "प्रत्यायोजित प्राधिकरण ढाँचा; RFC 9700 सुरक्षा मार्गदर्शन अपनाएँ।",
        "Marco de autorización delegada; aplica la seguridad de RFC 9700.",
        "Cadre d’autorisation déléguée ; appliquez la sécurité de RFC 9700.",
        "Delegierter Autorisierungsrahmen; Sicherheitsregeln aus RFC 9700 beachten.",
        "委任認可の枠組み。RFC 9700の安全指針を適用してください。",
        "委托授权框架；请遵循 RFC 9700 安全指南。",
        "إطار تفويض مفوض؛ طبق إرشادات أمان RFC 9700."
    ],
    "Bearer token transport; possession enables use, so protect tokens.": [
        "बेयरर टोकन परिवहन; रखने वाला उपयोग कर सकता है, इसलिए सुरक्षित रखें।",
        "Transporte de tokens bearer; quien los posee puede usarlos, protégelos.",
        "Transport des jetons bearer ; leur possession permet l’accès, protégez-les.",
        "Bearer-Token-Übertragung; Besitz ermöglicht Nutzung, daher Token schützen.",
        "Bearerトークンの転送。所有者が利用できるため保護が必要です。",
        "Bearer 令牌传输；持有即可使用，因此需保护令牌。",
        "نقل رموز bearer؛ الحيازة تتيح الاستخدام لذا احم الرموز."
    ],
    "Bind authorization-code redemption to a verifier; prefer S256.": [
        "प्राधिकरण कोड उपयोग को वेरिफ़ायर से बाँधें; S256 चुनें।",
        "Vincula el canje del código a un verificador; prefiere S256.",
        "Lie l’échange du code à un vérificateur ; préférez S256.",
        "Code-Einlösung an einen Verifier binden; S256 bevorzugen.",
        "認可コードの引き換えを検証文字列に結び付けます。S256を推奨。",
        "将授权码兑换绑定到验证器；优先使用 S256。",
        "اربط استبدال رمز التفويض بمتحقق؛ فضل S256."
    ],
    "OAuth guidance for native apps using external user agents.": [
        "बाहरी यूज़र एजेंट उपयोग करने वाले नेटिव ऐप के लिए OAuth मार्गदर्शन।",
        "Guía OAuth para aplicaciones nativas con agentes de usuario externos.",
        "Guide OAuth pour applications natives via agents utilisateur externes.",
        "OAuth-Empfehlungen für native Apps mit externen Benutzeragenten.",
        "外部ユーザーエージェントを使うネイティブアプリのOAuth指針。",
        "通过外部用户代理进行原生应用 OAuth 的指南。",
        "إرشادات OAuth للتطبيقات الأصلية باستخدام وكلاء مستخدم خارجيين."
    ],
    "Query authorization servers for token state and metadata.": [
        "टोकन स्थिति और मेटाडेटा हेतु प्राधिकरण सर्वर से पूछें।",
        "Consulta estado y metadatos de tokens al servidor de autorización.",
        "Interrogez le serveur d’autorisation sur l’état et les métadonnées d’un jeton.",
        "Tokenstatus und Metadaten beim Autorisierungsserver abfragen.",
        "認可サーバーにトークン状態とメタデータを問い合わせます。",
        "向授权服务器查询令牌状态和元数据。",
        "استعلم من خادم التفويض عن حالة الرمز وبياناته الوصفية."
    ],
    "Endpoint for revoking previously issued OAuth tokens.": [
        "पहले जारी OAuth टोकन रद्द करने का एंडपॉइंट।",
        "Endpoint para revocar tokens OAuth emitidos.",
        "Point de terminaison pour révoquer les jetons OAuth émis.",
        "Endpunkt zum Widerrufen ausgegebener OAuth-Token.",
        "発行済みOAuthトークンを失効させるエンドポイント。",
        "撤销已签发 OAuth 令牌的端点。",
        "نقطة لإلغاء رموز OAuth الصادرة سابقا."
    ],
    "Discover entity information, including OpenID Connect issuer discovery.": [
        "इकाई जानकारी खोजें, जिसमें OpenID Connect जारीकर्ता खोज शामिल है।",
        "Descubre información de entidades, incluido el emisor OpenID Connect.",
        "Découvrez des informations d’entité, dont l’émetteur OpenID Connect.",
        "Entitätsinformationen einschließlich OpenID-Connect-Aussteller ermitteln.",
        "OpenID Connect発行者など、エンティティ情報を発見します。",
        "发现实体信息，包括 OpenID Connect 签发者。",
        "اكتشف معلومات الكيانات بما فيها مصدر OpenID Connect."
    ],
    "HTTP methods, status codes, fields and representation semantics.": [
        "HTTP विधियाँ, स्थिति कोड, फ़ील्ड और निरूपण अर्थ।",
        "Métodos, estados, campos y semántica de representaciones HTTP.",
        "Méthodes, statuts, champs et sémantique des représentations HTTP.",
        "HTTP-Methoden, Statuscodes, Felder und Darstellungssemantik.",
        "HTTPメソッド、状態コード、フィールド、表現の意味。",
        "HTTP 方法、状态码、字段和表示语义。",
        "طرق HTTP ورموز الحالة والحقول ودلالات التمثيل."
    ],
    "HTTP cache operation, validation and cache-control fields.": [
        "HTTP कैश संचालन, सत्यापन और कैश नियंत्रण फ़ील्ड।",
        "Funcionamiento, validación y campos de control de caché HTTP.",
        "Fonctionnement, validation et champs de contrôle des caches HTTP.",
        "HTTP-Cachebetrieb, Validierung und Cache-Steuerfelder.",
        "HTTPキャッシュの動作、検証、制御フィールド。",
        "HTTP 缓存操作、验证和缓存控制字段。",
        "عمل ذاكرة HTTP المؤقتة والتحقق وحقول التحكم بها."
    ],
    "HTTP/1.1 message syntax, framing and connection management.": [
        "HTTP/1.1 संदेश सिंटैक्स, फ़्रेमिंग और कनेक्शन प्रबंधन।",
        "Sintaxis, delimitación de mensajes y conexiones HTTP/1.1.",
        "Syntaxe, délimitation des messages et gestion des connexions HTTP/1.1.",
        "HTTP/1.1-Nachrichtensyntax, Framing und Verbindungsverwaltung.",
        "HTTP/1.1のメッセージ構文、区切り、接続管理。",
        "HTTP/1.1 消息语法、分帧和连接管理。",
        "صياغة رسائل HTTP/1.1 وتأطيرها وإدارة الاتصال."
    ],
    "Multiplexed HTTP/2 streams and connection behavior.": [
        "मल्टीप्लेक्स HTTP/2 स्ट्रीम और कनेक्शन व्यवहार।",
        "Flujos multiplexados y comportamiento de conexiones HTTP/2.",
        "Flux multiplexés et comportement des connexions HTTP/2.",
        "Multiplexierte HTTP/2-Streams und Verbindungsverhalten.",
        "HTTP/2ストリームの多重化と接続動作。",
        "HTTP/2 多路复用流和连接行为。",
        "تدفقات HTTP/2 المتعددة وسلوك الاتصال."
    ],
    "HTTP/3 mapping over QUIC; stream loss remains independent.": [
        "QUIC पर HTTP/3 मैपिंग; स्ट्रीम हानि स्वतंत्र रहती है।",
        "Mapeo HTTP/3 sobre QUIC; la pérdida entre flujos es independiente.",
        "Correspondance HTTP/3 sur QUIC ; les pertes de flux restent indépendantes.",
        "HTTP/3-Abbildung über QUIC mit unabhängiger Behandlung von Streamverlusten.",
        "QUIC上のHTTP/3対応。ストリーム間で損失の影響を分離します。",
        "HTTP/3 在 QUIC 上的映射；流丢包彼此独立。",
        "ربط HTTP/3 فوق QUIC مع استقلال فقدان التدفقات."
    ],
    "HTTP/2 header compression with static and dynamic tables.": [
        "स्थिर और गतिशील तालिकाओं से HTTP/2 हेडर संपीड़न।",
        "Compresión de cabeceras HTTP/2 con tablas estáticas y dinámicas.",
        "Compression des en-têtes HTTP/2 avec tables statiques et dynamiques.",
        "HTTP/2-Headerkomprimierung mit statischen und dynamischen Tabellen.",
        "静的・動的テーブルによるHTTP/2ヘッダー圧縮。",
        "使用静态和动态表的 HTTP/2 头压缩。",
        "ضغط رؤوس HTTP/2 بجداول ثابتة وديناميكية."
    ],
    "Earlier TLS 1.3 specification; replaced by RFC 9846.": [
        "पुराना TLS 1.3 विनिर्देश; RFC 9846 ने प्रतिस्थापित किया।",
        "Especificación anterior de TLS 1.3; sustituida por RFC 9846.",
        "Ancienne spécification TLS 1.3, remplacée par RFC 9846.",
        "Frühere TLS-1.3-Spezifikation; durch RFC 9846 ersetzt.",
        "以前のTLS 1.3仕様。RFC 9846が置き換えています。",
        "早期 TLS 1.3 规范；已由 RFC 9846 替代。",
        "مواصفة TLS 1.3 السابقة؛ استبدلت بـ RFC 9846."
    ],
    "TLS 1.2 specification; follow its replacements and deployment guidance.": [
        "TLS 1.2 विनिर्देश; प्रतिस्थापन और डिप्लॉयमेंट मार्गदर्शन देखें।",
        "Especificación TLS 1.2; consulta sus sustituciones y guías de despliegue.",
        "Spécification TLS 1.2 ; suivez ses remplacements et guides de déploiement.",
        "TLS-1.2-Spezifikation; Nachfolger und Bereitstellungsempfehlungen beachten.",
        "TLS 1.2仕様。後継文書と運用指針を確認してください。",
        "TLS 1.2 规范；请遵循后续规范和部署指南。",
        "مواصفة TLS 1.2؛ اتبع البدائل وإرشادات النشر."
    ],
    "TLS extensions including SNI and certificate-status requests.": [
        "SNI और प्रमाणपत्र स्थिति अनुरोध सहित TLS एक्सटेंशन।",
        "Extensiones TLS, incluidos SNI y solicitudes de estado de certificado.",
        "Extensions TLS, dont SNI et requêtes d’état des certificats.",
        "TLS-Erweiterungen einschließlich SNI und Zertifikatsstatusabfragen.",
        "SNIや証明書状態要求などのTLS拡張。",
        "TLS 扩展，包括 SNI 和证书状态请求。",
        "امتدادات TLS بما فيها SNI وطلبات حالة الشهادة."
    ],
    "Tell browsers to require HTTPS for a host.": [
        "होस्ट के लिए HTTPS अनिवार्य करने का ब्राउज़र निर्देश।",
        "Indica al navegador que exija HTTPS para un host.",
        "Indique aux navigateurs d’exiger HTTPS pour un hôte.",
        "Browser zur HTTPS-Nutzung für einen Host verpflichten.",
        "ホストにHTTPSを必須とするようブラウザーへ通知。",
        "告知浏览器对主机强制使用 HTTPS。",
        "أبلغ المتصفحات بإلزام HTTPS لمضيف."
    ],
    "Historical browser key-pinning mechanism; RFC maturity is a separate property.": [
        "ऐतिहासिक ब्राउज़र कुंजी पिनिंग; RFC परिपक्वता अलग गुण है।",
        "Mecanismo histórico de fijación de claves; la madurez del RFC es independiente.",
        "Ancien mécanisme de pinning navigateur ; la maturité du RFC est distincte.",
        "Historisches Browser-Key-Pinning; RFC-Reifegrad ist eine eigene Eigenschaft.",
        "以前のブラウザー鍵ピンニング方式。RFCの成熟度は別の属性です。",
        "历史浏览器密钥固定机制；RFC 成熟度是独立属性。",
        "آلية تاريخية لتثبيت مفاتيح المتصفح؛ نضج RFC خاصية مستقلة."
    ],
    "Frame-embedding restrictions through the X-Frame-Options response header.": [
        "X-Frame-Options उत्तर हेडर से फ़्रेम एम्बेडिंग सीमाएँ।",
        "Restricciones de enmarcado mediante X-Frame-Options.",
        "Restrictions d’intégration en frame via X-Frame-Options.",
        "Frame-Einbettung über X-Frame-Options einschränken.",
        "X-Frame-Options応答ヘッダーによるフレーム埋め込み制限。",
        "通过 X-Frame-Options 响应头限制框架嵌入。",
        "قيود تضمين الإطارات عبر رأس X-Frame-Options."
    ],
    "Origins provide a security boundary for web content.": [
        "वेब सामग्री के लिए ओरिजिन सुरक्षा सीमा देते हैं।",
        "Los orígenes delimitan la seguridad del contenido web.",
        "Les origines délimitent la sécurité du contenu web.",
        "Ursprünge bilden eine Sicherheitsgrenze für Webinhalte.",
        "オリジンがウェブコンテンツの安全境界を定義します。",
        "来源为 Web 内容提供安全边界。",
        "توفر الأصول حدود أمان لمحتوى الويب."
    ],
    "Bidirectional messaging protocol established through a WebSocket handshake.": [
        "WebSocket हैंडशेक से स्थापित द्विदिश संदेश प्रोटोकॉल।",
        "Mensajería bidireccional establecida mediante un handshake WebSocket.",
        "Messagerie bidirectionnelle établie par une négociation WebSocket.",
        "Bidirektionale Nachrichten nach WebSocket-Handshake.",
        "WebSocketハンドシェイクで確立する双方向通信。",
        "通过 WebSocket 握手建立的双向消息协议。",
        "بروتوكول رسائل ثنائية الاتجاه يبدأ بمصافحة WebSocket."
    ],
    "Earlier HTTP semantics specification, obsoleted by RFC 9110.": [
        "पुराना HTTP अर्थ विनिर्देश, RFC 9110 से प्रतिस्थापित।",
        "Semántica HTTP anterior, obsoleta por RFC 9110.",
        "Ancienne sémantique HTTP, remplacée par RFC 9110.",
        "Frühere HTTP-Semantik, durch RFC 9110 abgelöst.",
        "RFC 9110で廃止された以前のHTTP意味仕様。",
        "早期 HTTP 语义规范，已由 RFC 9110 替代。",
        "مواصفة دلالات HTTP السابقة، استبدلت بـ RFC 9110."
    ],
    "DNS wire messages, resource records and implementation rules.": [
        "DNS वायर संदेश, संसाधन रिकॉर्ड और कार्यान्वयन नियम।",
        "Mensajes DNS, registros de recursos y reglas de implementación.",
        "Messages DNS, enregistrements et règles d’implémentation.",
        "DNS-Nachrichten, Ressourceneinträge und Implementierungsregeln.",
        "DNS通信メッセージ、リソースレコード、実装規則。",
        "DNS 线格式消息、资源记录和实现规则。",
        "رسائل DNS وسجلات الموارد وقواعد التنفيذ."
    ],
    "Transport DNS queries and responses over HTTPS.": [
        "DNS क्वेरी और उत्तर HTTPS पर भेजें।",
        "Transporta consultas y respuestas DNS sobre HTTPS.",
        "Transporte les requêtes et réponses DNS sur HTTPS.",
        "DNS-Anfragen und Antworten über HTTPS übertragen.",
        "DNS問い合わせと応答をHTTPSで転送。",
        "通过 HTTPS 传输 DNS 查询和响应。",
        "نقل استعلامات DNS واستجاباتها عبر HTTPS."
    ],
    "Encrypt DNS transport using TLS, normally on port 853.": [
        "TLS से DNS परिवहन एन्क्रिप्ट करें, सामान्यतः पोर्ट 853 पर।",
        "Cifra el transporte DNS con TLS, normalmente en el puerto 853.",
        "Chiffre le transport DNS avec TLS, généralement sur le port 853.",
        "DNS-Transport mit TLS verschlüsseln, üblicherweise auf Port 853.",
        "通常853番ポートでTLSによるDNS通信を暗号化。",
        "使用 TLS 加密 DNS 传输，通常使用端口 853。",
        "تشفير نقل DNS باستخدام TLS عادة على المنفذ 853."
    ],
    "Mail transfer commands and server-to-server delivery behavior.": [
        "मेल परिवहन कमांड और सर्वर के बीच डिलीवरी व्यवहार।",
        "Comandos de transferencia de correo y entrega entre servidores.",
        "Commandes de transfert du courrier et livraison entre serveurs.",
        "Mailübertragungsbefehle und Zustellung zwischen Servern.",
        "メール転送コマンドとサーバー間配送動作。",
        "邮件传输命令和服务器间投递行为。",
        "أوامر نقل البريد وسلوك التسليم بين الخوادم."
    ],
    "Internet email message headers and body syntax.": [
        "इंटरनेट ईमेल हेडर और बॉडी सिंटैक्स।",
        "Sintaxis de cabeceras y cuerpo de mensajes de correo.",
        "Syntaxe des en-têtes et du corps des messages électroniques.",
        "Syntax von Internet-E-Mail-Headern und Nachrichtentext.",
        "インターネットメールのヘッダーと本文構文。",
        "互联网邮件头和正文语法。",
        "صياغة رؤوس رسائل البريد الإلكتروني وجسمها."
    ],
    "Authorize sending hosts for an email envelope domain.": [
        "ईमेल एनवेलप डोमेन के लिए प्रेषक होस्ट अधिकृत करें।",
        "Autoriza hosts emisores para un dominio del sobre de correo.",
        "Autorise les hôtes émetteurs d’un domaine d’enveloppe email.",
        "Sendende Hosts für eine E-Mail-Umschlagdomain autorisieren.",
        "メールエンベロープドメインの送信ホストを認可。",
        "为邮件信封域授权发件主机。",
        "تفويض المضيفين المرسلين لنطاق غلاف البريد."
    ],
    "Domain-associated digital signatures over email headers and body.": [
        "ईमेल हेडर और बॉडी पर डोमेन-संबद्ध डिजिटल हस्ताक्षर।",
        "Firmas digitales asociadas a dominios sobre cabeceras y cuerpo de correo.",
        "Signatures numériques de domaine sur les en-têtes et le corps email.",
        "Domainbezogene digitale Signaturen über E-Mail-Header und Text.",
        "ドメインに関連付けたメールヘッダーと本文のデジタル署名。",
        "与域相关联的邮件头和正文数字签名。",
        "توقيعات رقمية مرتبطة بالنطاق لرؤوس البريد وجسمه."
    ],
    "Earlier DMARC specification; replaced by RFC 9989, 9990 and 9991.": [
        "पुराना DMARC विनिर्देश; RFC 9989, 9990 और 9991 से प्रतिस्थापित।",
        "DMARC anterior; sustituido por RFC 9989, 9990 y 9991.",
        "Ancien DMARC, remplacé par les RFC 9989, 9990 et 9991.",
        "Frühere DMARC-Spezifikation; durch RFC 9989, 9990 und 9991 ersetzt.",
        "以前のDMARC仕様。RFC 9989・9990・9991が置き換えています。",
        "早期 DMARC 规范；已由 RFC 9989、9990 和 9991 替代。",
        "مواصفة DMARC السابقة؛ استبدلت بـ RFC 9989 و9990 و9991."
    ],
    "Generic URI syntax and relative-reference resolution.": [
        "सामान्य URI सिंटैक्स और सापेक्ष संदर्भ समाधान।",
        "Sintaxis genérica URI y resolución de referencias relativas.",
        "Syntaxe générique des URI et résolution des références relatives.",
        "Allgemeine URI-Syntax und Auflösung relativer Referenzen.",
        "汎用URI構文と相対参照の解決。",
        "通用 URI 语法和相对引用解析。",
        "صياغة URI العامة وحل المراجع النسبية."
    ],
    "Expand variables into URI templates.": [
        "URI टेम्पलेट में चर विस्तृत करें।",
        "Expande variables en plantillas URI.",
        "Développe les variables dans les modèles URI.",
        "Variablen in URI-Vorlagen expandieren.",
        "URIテンプレートの変数展開。",
        "在 URI 模板中展开变量。",
        "توسيع المتغيرات في قوالب URI."
    ],
    "JSON data interchange syntax and interoperability considerations.": [
        "JSON डेटा विनिमय सिंटैक्स और अंतर्संचालन विचार।",
        "Sintaxis JSON y consideraciones de interoperabilidad.",
        "Syntaxe JSON et considérations d’interopérabilité.",
        "JSON-Austauschsyntax und Interoperabilitätsaspekte.",
        "JSONデータ交換の構文と相互運用上の注意。",
        "JSON 数据交换语法和互操作注意事项。",
        "صياغة تبادل بيانات JSON واعتبارات التشغيل البيني."
    ],
    "Identify a value within a JSON document.": [
        "JSON दस्तावेज़ में किसी मान की पहचान।",
        "Identifica un valor dentro de un documento JSON.",
        "Identifie une valeur dans un document JSON.",
        "Einen Wert in einem JSON-Dokument identifizieren.",
        "JSON文書内の値を指定。",
        "定位 JSON 文档内的值。",
        "تحديد قيمة داخل مستند JSON."
    ],
    "Apply ordered add, remove, replace, move, copy and test operations.": [
        "क्रम से add, remove, replace, move, copy और test ऑपरेशन लागू करें।",
        "Aplica operaciones ordenadas add, remove, replace, move, copy y test.",
        "Applique dans l’ordre add, remove, replace, move, copy et test.",
        "Geordnete Operationen add, remove, replace, move, copy und test anwenden.",
        "add・remove・replace・move・copy・testを順序付きで適用。",
        "按顺序应用 add、remove、replace、move、copy 和 test 操作。",
        "تطبيق عمليات add وremove وreplace وmove وcopy وtest بالترتيب."
    ],
    "Describe JSON updates by example; null removes object members.": [
        "उदाहरण से JSON बदलाव बताएँ; null ऑब्जेक्ट सदस्य हटाता है।",
        "Describe cambios JSON por ejemplo; null elimina miembros de objetos.",
        "Décrit les changements JSON par exemple ; null supprime les membres.",
        "JSON-Änderungen per Beispiel beschreiben; null entfernt Objektmitglieder.",
        "例でJSON更新を指定。nullはオブジェクトメンバーを削除します。",
        "通过示例描述 JSON 更新；null 删除对象成员。",
        "وصف تحديثات JSON بالمثال؛ تحذف null أعضاء الكائن."
    ],
    "Earlier HTTP problem-details format, obsoleted by RFC 9457.": [
        "पुराना HTTP समस्या विवरण प्रारूप, RFC 9457 से प्रतिस्थापित।",
        "Formato anterior de detalles de problemas HTTP, sustituido por RFC 9457.",
        "Ancien format de détails de problèmes HTTP, remplacé par RFC 9457.",
        "Früheres HTTP-Problemdetailformat; durch RFC 9457 ersetzt.",
        "RFC 9457で置き換えた以前のHTTP問題詳細形式。",
        "早期 HTTP 问题详情格式，已由 RFC 9457 替代。",
        "تنسيق تفاصيل مشكلات HTTP السابق، استبدل بـ RFC 9457."
    ],
    "WebDAV authoring, properties, collections and locking; not the source of 102.": [
        "WebDAV लेखन, गुण, संग्रह और लॉकिंग; 102 का स्रोत नहीं।",
        "Edición, propiedades, colecciones y bloqueos WebDAV; no origina el 102.",
        "Édition, propriétés, collections et verrouillage WebDAV ; pas la source de 102.",
        "WebDAV-Bearbeitung, Eigenschaften, Sammlungen und Sperren; nicht die Quelle von 102.",
        "WebDAVの編集・プロパティ・コレクション・ロック。102の出典ではありません。",
        "WebDAV 编辑、属性、集合和锁定；并非 102 的来源。",
        "تأليف WebDAV وخصائصه ومجموعاته وقفله؛ ليس مصدر 102."
    ],
    "Partial resource modification through HTTP PATCH.": [
        "HTTP PATCH से संसाधन में आंशिक बदलाव।",
        "Modificación parcial de recursos mediante HTTP PATCH.",
        "Modification partielle des ressources via HTTP PATCH.",
        "Teiländerungen an Ressourcen per HTTP PATCH.",
        "HTTP PATCHによるリソースの部分変更。",
        "通过 HTTP PATCH 部分修改资源。",
        "تعديل جزئي للموارد عبر HTTP PATCH."
    ],
    "Secure multiplexed transport over UDP with connection migration.": [
        "कनेक्शन माइग्रेशन सहित UDP पर सुरक्षित मल्टीप्लेक्स परिवहन।",
        "Transporte seguro multiplexado sobre UDP con migración de conexión.",
        "Transport multiplexé sécurisé sur UDP avec migration de connexion.",
        "Sicherer multiplexierter UDP-Transport mit Verbindungsmigration.",
        "接続移行に対応するUDP上の安全な多重化トランスポート。",
        "支持连接迁移的 UDP 安全多路复用传输。",
        "نقل آمن متعدد التدفقات فوق UDP مع ترحيل الاتصال."
    ],
    "Use TLS handshake and key derivation to secure QUIC.": [
        "QUIC सुरक्षा हेतु TLS हैंडशेक और कुंजी व्युत्पत्ति।",
        "Usa handshake y derivación de claves TLS para proteger QUIC.",
        "Sécurise QUIC par négociation et dérivation de clés TLS.",
        "QUIC mit TLS-Handshake und Schlüsselableitung absichern.",
        "TLSハンドシェイクと鍵導出でQUICを保護。",
        "使用 TLS 握手和密钥派生保护 QUIC。",
        "تأمين QUIC بمصافحة TLS واشتقاق المفاتيح."
    ],
    "RSA encryption and signature encodings, including OAEP and PSS.": [
        "OAEP और PSS सहित RSA एन्क्रिप्शन व हस्ताक्षर एन्कोडिंग।",
        "Codificaciones de cifrado y firma RSA, incluidas OAEP y PSS.",
        "Encodages de chiffrement et signature RSA, dont OAEP et PSS.",
        "RSA-Verschlüsselungs- und Signaturkodierung, einschließlich OAEP und PSS.",
        "OAEP・PSSを含むRSA暗号化と署名の符号化。",
        "RSA 加密和签名编码，包括 OAEP 和 PSS。",
        "ترميزات تشفير RSA وتوقيعه، بما فيها OAEP وPSS."
    ],
    "X25519 and X448 elliptic-curve key agreement.": [
        "X25519 और X448 एलिप्टिक कर्व कुंजी समझौता।",
        "Acuerdo de claves de curva elíptica X25519 y X448.",
        "Accord de clés sur courbes elliptiques X25519 et X448.",
        "Elliptische Schlüsselaushandlung mit X25519 und X448.",
        "X25519・X448楕円曲線鍵共有。",
        "X25519 和 X448 椭圆曲线密钥协商。",
        "اتفاق مفاتيح المنحنى الإهليلجي X25519 وX448."
    ],
    "Ed25519 and Ed448 digital signature algorithms.": [
        "Ed25519 और Ed448 डिजिटल हस्ताक्षर एल्गोरिदम।",
        "Algoritmos de firma digital Ed25519 y Ed448.",
        "Algorithmes de signature numérique Ed25519 et Ed448.",
        "Digitale Signaturalgorithmen Ed25519 und Ed448.",
        "Ed25519・Ed448デジタル署名アルゴリズム。",
        "Ed25519 和 Ed448 数字签名算法。",
        "خوارزميات التوقيع الرقمي Ed25519 وEd448."
    ],
    "Base16, Base32, Base64 and URL-safe Base64 encoding rules.": [
        "Base16, Base32, Base64 और URL-सुरक्षित Base64 नियम।",
        "Reglas de Base16, Base32, Base64 y Base64 segura para URL.",
        "Règles Base16, Base32, Base64 et Base64 compatible URL.",
        "Kodierregeln für Base16, Base32, Base64 und URL-sicheres Base64.",
        "Base16・Base32・Base64・URL安全Base64の符号化規則。",
        "Base16、Base32、Base64 和 URL 安全 Base64 编码规则。",
        "قواعد ترميز Base16 وBase32 وBase64 وBase64 الآمن لعناوين URL."
    ],
    "Internet timestamp profile with dates, times and numeric offsets.": [
        "दिनांक, समय और संख्यात्मक ऑफ़सेट वाला इंटरनेट टाइमस्टैम्प प्रारूप।",
        "Perfil de marcas temporales con fechas, horas y desplazamientos numéricos.",
        "Profil d’horodatage avec dates, heures et décalages numériques.",
        "Internet-Zeitstempelprofil mit Datum, Uhrzeit und numerischen Offsets.",
        "日付・時刻・数値オフセットを含むインターネット時刻形式。",
        "含日期、时间和数字偏移的互联网时间戳格式。",
        "نمط طابع زمني للإنترنت بالتاريخ والوقت والإزاحات الرقمية."
    ],
    "UUID formats and generation, including versions 6, 7 and 8.": [
        "UUID प्रारूप और निर्माण, जिसमें संस्करण 6, 7 और 8 हैं।",
        "Formatos y generación UUID, incluidas versiones 6, 7 y 8.",
        "Formats et génération UUID, dont versions 6, 7 et 8.",
        "UUID-Formate und Erzeugung, einschließlich Versionen 6, 7 und 8.",
        "バージョン6・7・8を含むUUID形式と生成。",
        "UUID 格式及生成，包括版本 6、7 和 8。",
        "تنسيقات UUID وإنشاؤها، بما فيها الإصدارات 6 و7 و8."
    ],
    "SVCB and HTTPS DNS records for service connection information.": [
        "सेवा कनेक्शन जानकारी के SVCB और HTTPS DNS रिकॉर्ड।",
        "Registros DNS SVCB y HTTPS para información de conexión.",
        "Enregistrements DNS SVCB et HTTPS pour les informations de connexion.",
        "SVCB- und HTTPS-DNS-Einträge für Dienstverbindungen.",
        "サービス接続情報を伝えるSVCB・HTTPS DNSレコード。",
        "提供服务连接信息的 SVCB 和 HTTPS DNS 记录。",
        "سجلات DNS من نوع SVCB وHTTPS لمعلومات اتصال الخدمة."
    ],
    "OAuth token exchange for delegation and impersonation scenarios.": [
        "प्रत्यायोजन और प्रतिरूपण के लिए OAuth टोकन एक्सचेंज।",
        "Intercambio de tokens OAuth para delegación y suplantación.",
        "Échange de jetons OAuth pour délégation et usurpation d’identité.",
        "OAuth-Tokenaustausch für Delegation und Identitätsübernahme.",
        "委任・代理を行うOAuthトークン交換。",
        "用于委托和模拟场景的 OAuth 令牌交换。",
        "تبادل رموز OAuth للتفويض وانتحال الهوية."
    ],
    "OAuth server capabilities and endpoints in JSON metadata.": [
        "JSON मेटाडेटा में OAuth सर्वर क्षमताएँ और एंडपॉइंट।",
        "Capacidades y endpoints OAuth en metadatos JSON.",
        "Capacités et points OAuth dans des métadonnées JSON.",
        "OAuth-Serverfähigkeiten und Endpunkte als JSON-Metadaten.",
        "JSONメタデータによるOAuthサーバー機能とエンドポイント。",
        "通过 JSON 元数据提供 OAuth 服务器能力和端点。",
        "إمكانات خادم OAuth ونقاطه في بيانات JSON وصفية."
    ],
    "Argon2 password hashing and memory-hard key derivation.": [
        "Argon2 पासवर्ड हैशिंग और मेमोरी-हार्ड कुंजी व्युत्पत्ति।",
        "Hash de contraseñas Argon2 y derivación de claves intensiva en memoria.",
        "Hachage Argon2 et dérivation de clés à forte mémoire.",
        "Argon2-Passworthashing und speicherintensive Schlüsselableitung.",
        "Argon2パスワードハッシュとメモリ負荷型鍵導出。",
        "Argon2 密码哈希和内存困难密钥派生。",
        "تجزئة كلمات المرور Argon2 واشتقاق المفاتيح كثيف الذاكرة."
    ],
    "scrypt password-based, memory-hard key derivation.": [
        "scrypt पासवर्ड आधारित, मेमोरी-हार्ड कुंजी व्युत्पत्ति।",
        "Derivación scrypt basada en contraseña e intensiva en memoria.",
        "Dérivation scrypt par mot de passe à forte mémoire.",
        "Passwortbasierte speicherintensive Schlüsselableitung mit scrypt.",
        "scryptによるパスワードベースのメモリ負荷型鍵導出。",
        "基于密码的 scrypt 内存困难密钥派生。",
        "اشتقاق مفاتيح scrypt القائم على كلمة المرور وكثيف الذاكرة."
    ],
    "HTTP 451 indicates access denied because of a legal demand.": [
        "कानूनी माँग से पहुँच रोके जाने पर HTTP 451।",
        "HTTP 451 indica denegación de acceso por exigencia legal.",
        "HTTP 451 indique un accès refusé pour demande légale.",
        "HTTP 451 kennzeichnet verweigerten Zugriff aufgrund rechtlicher Forderung.",
        "法的要請によるアクセス拒否を示すHTTP 451。",
        "HTTP 451 表示因法律要求拒绝访问。",
        "يشير HTTP 451 إلى رفض الوصول بسبب طلب قانوني."
    ],
    "TCP transport specification consolidating earlier requirements and corrections.": [
        "पुरानी आवश्यकताओं और सुधारों को जोड़ने वाला TCP विनिर्देश।",
        "Especificación TCP que consolida requisitos y correcciones anteriores.",
        "Spécification TCP consolidant exigences et corrections antérieures.",
        "TCP-Spezifikation mit zusammengeführten Anforderungen und Korrekturen.",
        "従来要件と修正を統合したTCPトランスポート仕様。",
        "整合早期要求和修正的 TCP 传输规范。",
        "مواصفة نقل TCP التي تجمع المتطلبات والتصحيحات السابقة."
    ],
    "Structured HTTP problem details in JSON or XML.": [
        "JSON या XML में संरचित HTTP समस्या विवरण।",
        "Detalles estructurados de problemas HTTP en JSON o XML.",
        "Détails structurés des problèmes HTTP en JSON ou XML.",
        "Strukturierte HTTP-Problemdetails in JSON oder XML.",
        "JSONまたはXMLによる構造化HTTP問題詳細。",
        "JSON 或 XML 格式的结构化 HTTP 问题详情。",
        "تفاصيل منظمة لمشكلات HTTP بصيغة JSON أو XML."
    ],
    "Sign selected HTTP message components using a signature base.": [
        "सिग्नेचर बेस से चुने HTTP संदेश घटकों पर हस्ताक्षर।",
        "Firma componentes HTTP seleccionados mediante una base de firma.",
        "Signe des composants HTTP sélectionnés à partir d’une base de signature.",
        "Ausgewählte HTTP-Komponenten über eine Signaturbasis signieren.",
        "署名ベースを使って選択したHTTP要素に署名。",
        "使用签名基串签署所选 HTTP 消息组件。",
        "توقيع مكونات HTTP مختارة باستخدام أساس التوقيع."
    ],
    "Content-Digest and Repr-Digest fields for HTTP integrity information.": [
        "HTTP अखंडता के Content-Digest और Repr-Digest फ़ील्ड।",
        "Campos Content-Digest y Repr-Digest para integridad HTTP.",
        "Champs Content-Digest et Repr-Digest pour l’intégrité HTTP.",
        "Content-Digest- und Repr-Digest-Felder für HTTP-Integritätsdaten.",
        "HTTP完全性情報のContent-Digest・Repr-Digestフィールド。",
        "用于 HTTP 完整性信息的 Content-Digest 和 Repr-Digest 字段。",
        "حقول Content-Digest وRepr-Digest لمعلومات سلامة HTTP."
    ],
    "Typed HTTP field values: items, lists and dictionaries.": [
        "टाइप किए HTTP फ़ील्ड मान: आइटम, सूची और डिक्शनरी।",
        "Valores HTTP tipados: elementos, listas y diccionarios.",
        "Valeurs HTTP typées : éléments, listes et dictionnaires.",
        "Typisierte HTTP-Feldwerte: Elemente, Listen und Wörterbücher.",
        "型付きHTTPフィールド値：項目・リスト・辞書。",
        "带类型的 HTTP 字段值：项目、列表和字典。",
        "قيم حقول HTTP ذات الأنواع: عناصر وقوائم وقواميس."
    ],
    "Registers application/yaml and describes YAML security considerations.": [
        "application/yaml पंजीकरण और YAML सुरक्षा विचार।",
        "Registra application/yaml y trata la seguridad YAML.",
        "Enregistre application/yaml et décrit les risques YAML.",
        "Registriert application/yaml und beschreibt YAML-Sicherheitsaspekte.",
        "application/yaml登録とYAMLの安全上の注意。",
        "注册 application/yaml 并说明 YAML 安全注意事项。",
        "يسجل application/yaml ويصف اعتبارات أمان YAML."
    ],
    "OpenPGP message, key, encryption and signature formats.": [
        "OpenPGP संदेश, कुंजी, एन्क्रिप्शन और हस्ताक्षर प्रारूप।",
        "Formatos OpenPGP de mensajes, claves, cifrado y firmas.",
        "Formats OpenPGP de messages, clés, chiffrement et signatures.",
        "OpenPGP-Formate für Nachrichten, Schlüssel, Verschlüsselung und Signaturen.",
        "OpenPGPのメッセージ・鍵・暗号化・署名形式。",
        "OpenPGP 消息、密钥、加密和签名格式。",
        "تنسيقات رسائل OpenPGP ومفاتيحه وتشفيره وتوقيعاته."
    ],
    "TLS and DTLS deployment guidance; review later protocol updates too.": [
        "TLS और DTLS डिप्लॉयमेंट मार्गदर्शन; बाद के प्रोटोकॉल अपडेट भी देखें।",
        "Guía de despliegue TLS y DTLS; consulta también actualizaciones posteriores.",
        "Guide de déploiement TLS et DTLS ; vérifiez aussi les mises à jour ultérieures.",
        "TLS-/DTLS-Bereitstellungsregeln; spätere Protokollupdates ebenfalls beachten.",
        "TLS・DTLS運用指針。後続のプロトコル更新も確認してください。",
        "TLS 和 DTLS 部署指南；也请检查后续协议更新。",
        "إرشادات نشر TLS وDTLS؛ راجع تحديثات البروتوكول اللاحقة أيضا."
    ],
    "TLS 1.3 specification replacing RFC 8446; also updates TLS 1.2 requirements.": [
        "RFC 8446 को बदलता TLS 1.3 विनिर्देश; TLS 1.2 आवश्यकताएँ भी अपडेट।",
        "TLS 1.3 sustituye RFC 8446 y actualiza requisitos TLS 1.2.",
        "TLS 1.3 remplace RFC 8446 et actualise les exigences TLS 1.2.",
        "TLS 1.3 ersetzt RFC 8446 und aktualisiert TLS-1.2-Anforderungen.",
        "RFC 8446を置き換えるTLS 1.3仕様。TLS 1.2要件も更新。",
        "替代 RFC 8446 的 TLS 1.3 规范；还更新 TLS 1.2 要求。",
        "مواصفة TLS 1.3 البديلة لـ RFC 8446 وتحدث متطلبات TLS 1.2 أيضا."
    ],
    "DMARC validation and handling preferences; replaces RFC 7489 and 9091.": [
        "DMARC सत्यापन और हैंडलिंग प्राथमिकताएँ; RFC 7489 व 9091 को बदलता है।",
        "Validación y preferencias DMARC; sustituye RFC 7489 y 9091.",
        "Validation et préférences DMARC ; remplace les RFC 7489 et 9091.",
        "DMARC-Prüfung und Behandlungspräferenzen; ersetzt RFC 7489 und 9091.",
        "DMARC検証と処理設定。RFC 7489・9091を置き換え。",
        "DMARC 验证和处理偏好；替代 RFC 7489 和 9091。",
        "تحقق DMARC وتفضيلات المعالجة؛ يستبدل RFC 7489 و9091."
    ],
    "DMARC aggregate XML reports; replaces reporting rules in RFC 7489.": [
        "DMARC समेकित XML रिपोर्ट; RFC 7489 के रिपोर्टिंग नियम बदलता है।",
        "Informes XML agregados DMARC; sustituye reglas de RFC 7489.",
        "Rapports XML agrégés DMARC ; remplace les règles de RFC 7489.",
        "DMARC-XML-Sammelberichte; ersetzt Berichtsregeln aus RFC 7489.",
        "DMARC集計XMLレポート。RFC 7489の報告規則を置き換え。",
        "DMARC 汇总 XML 报告；替代 RFC 7489 报告规则。",
        "تقارير DMARC التجميعية بصيغة XML؛ تستبدل قواعد RFC 7489."
    ],
    "DMARC individual-message failure reports; replaces RFC 7489 and updates 6591.": [
        "DMARC व्यक्तिगत संदेश विफलता रिपोर्ट; RFC 7489 बदलता व 6591 अपडेट करता है।",
        "Informes DMARC de fallos por mensaje; sustituye RFC 7489 y actualiza 6591.",
        "Rapports DMARC d’échec individuel ; remplace RFC 7489 et met à jour 6591.",
        "DMARC-Einzelfehlerberichte; ersetzt RFC 7489 und aktualisiert 6591.",
        "DMARC個別メッセージ失敗レポート。RFC 7489を置き換え、6591を更新。",
        "DMARC 单条消息失败报告；替代 RFC 7489 并更新 6591。",
        "تقارير DMARC لفشل الرسائل المفردة؛ تستبدل RFC 7489 وتحدث 6591."
    ],
    "Temporary upload-resumption registration; scheduled expiry 2026-11-13, checked 2026-10-21. Verify IANA before use.": [
        "अस्थायी अपलोड पुनः शुरू पंजीकरण; निर्धारित समाप्ति 2026-11-13, जाँच 2026-10-21। उपयोग से पहले IANA देखें।",
        "Registro temporal de reanudación; vence el 2026-11-13, comprobado el 2026-10-21. Verifica IANA antes de usarlo.",
        "Enregistrement temporaire de reprise ; expiration prévue le 2026-11-13, vérifié le 2026-10-21. Consultez IANA avant usage.",
        "Temporäre Upload-Fortsetzung; Ablauf geplant am 2026-11-13, geprüft am 2026-10-21. Vor Nutzung IANA prüfen.",
        "一時的なアップロード再開登録。期限2026-11-13、確認2026-10-21。使用前にIANAを再確認。",
        "临时上传恢复注册；计划于 2026-11-13 到期，核查于 2026-10-21。使用前请核实 IANA。",
        "تسجيل مؤقت لاستئناف الرفع؛ الانتهاء المقرر 2026-11-13، تحقق في 2026-10-21. راجع IANA قبل الاستخدام."
    ],
    "An interim response invites the client to continue sending.": [
        "अंतरिम उत्तर क्लाइंट को भेजना जारी रखने देता है।",
        "Una respuesta provisional invita al cliente a continuar el envío.",
        "Une réponse provisoire invite le client à poursuivre l’envoi.",
        "Eine Zwischenantwort erlaubt dem Client weiterzusenden.",
        "送信を続けるよう促す暫定応答。",
        "临时响应通知客户端继续发送。",
        "استجابة مؤقتة تدعو العميل لمتابعة الإرسال."
    ],
    "The server agrees to switch protocols.": [
        "सर्वर प्रोटोकॉल बदलने पर सहमत है।",
        "El servidor acepta cambiar de protocolo.",
        "Le serveur accepte de changer de protocole.",
        "Der Server stimmt dem Protokollwechsel zu.",
        "サーバーがプロトコルの切り替えに同意。",
        "服务器同意切换协议。",
        "يوافق الخادم على تبديل البروتوكول."
    ],
    "WebDAV processing continues; this registration originates in RFC 2518.": [
        "WebDAV प्रक्रिया जारी है; पंजीकरण RFC 2518 से है।",
        "WebDAV sigue procesando; el registro proviene de RFC 2518.",
        "Le traitement WebDAV continue ; l’enregistrement vient de RFC 2518.",
        "WebDAV-Verarbeitung läuft; Registrierung stammt aus RFC 2518.",
        "WebDAV処理が継続中。登録元はRFC 2518。",
        "WebDAV 处理继续进行；注册源于 RFC 2518。",
        "تستمر معالجة WebDAV؛ مصدر التسجيل RFC 2518."
    ],
    "Provides preliminary response fields before the final response.": [
        "अंतिम उत्तर से पहले प्रारंभिक उत्तर फ़ील्ड देता है।",
        "Proporciona campos preliminares antes de la respuesta final.",
        "Fournit des champs préliminaires avant la réponse finale.",
        "Liefert vorläufige Antwortfelder vor der endgültigen Antwort.",
        "最終応答前に暫定応答フィールドを提供。",
        "在最终响应前提供初步响应字段。",
        "يوفر حقول استجابة أولية قبل الاستجابة النهائية."
    ],
    "The request succeeded; meaning depends on the method.": [
        "अनुरोध सफल हुआ; अर्थ विधि पर निर्भर है।",
        "La solicitud tuvo éxito; el significado depende del método.",
        "La requête a réussi ; le sens dépend de la méthode.",
        "Anfrage erfolgreich; Bedeutung hängt von der Methode ab.",
        "成功を示し、意味はメソッドによって異なります。",
        "请求成功；具体含义取决于方法。",
        "نجح الطلب؛ يعتمد المعنى على الطريقة."
    ],
    "The request created one or more new resources.": [
        "अनुरोध ने एक या अधिक नए संसाधन बनाए।",
        "La solicitud creó uno o más recursos.",
        "La requête a créé une ou plusieurs ressources.",
        "Die Anfrage hat eine oder mehrere Ressourcen erstellt.",
        "1つ以上のリソースを作成しました。",
        "请求创建了一个或多个新资源。",
        "أنشأ الطلب موردا جديدا أو أكثر."
    ],
    "Accepted for processing; completion is not guaranteed.": [
        "प्रक्रिया के लिए स्वीकार; पूर्ण होने की गारंटी नहीं।",
        "Aceptada para procesamiento; no garantiza finalización.",
        "Acceptée pour traitement ; la réalisation n’est pas garantie.",
        "Zur Verarbeitung angenommen; Abschluss nicht garantiert.",
        "処理を受け付けましたが、完了の保証はありません。",
        "已接受处理；不保证完成。",
        "قبل للمعالجة؛ الاكتمال غير مضمون."
    ],
    "A transforming proxy modified the origin response content.": [
        "रूपांतरित प्रॉक्सी ने मूल उत्तर सामग्री बदली।",
        "Un proxy transformador modificó el contenido original.",
        "Un proxy transformant a modifié le contenu d’origine.",
        "Ein transformierender Proxy hat den Ursprungsinhalt geändert.",
        "変換プロキシが元の応答内容を変更。",
        "转换代理修改了源响应内容。",
        "عدل وسيط محول محتوى الاستجابة الأصلية."
    ],
    "Successful response with no response content.": [
        "सफल उत्तर जिसमें सामग्री नहीं है।",
        "Respuesta exitosa sin contenido.",
        "Réponse réussie sans contenu.",
        "Erfolgreiche Antwort ohne Inhalt.",
        "本文のない成功応答。",
        "无响应内容的成功响应。",
        "استجابة ناجحة بلا محتوى."
    ],
    "Success; the client should reset the document view.": [
        "सफल; क्लाइंट को दस्तावेज़ दृश्य रीसेट करना चाहिए।",
        "Éxito; el cliente debe restablecer la vista.",
        "Succès ; le client doit réinitialiser la vue.",
        "Erfolg; der Client soll die Dokumentansicht zurücksetzen.",
        "成功。クライアントは表示をリセットします。",
        "成功；客户端应重置文档视图。",
        "نجاح؛ ينبغي للعميل إعادة ضبط العرض."
    ],
    "Returns one or more requested representation ranges.": [
        "माँगी गई एक या अधिक निरूपण सीमाएँ लौटाता है।",
        "Devuelve uno o más rangos solicitados.",
        "Renvoie une ou plusieurs plages demandées.",
        "Liefert einen oder mehrere angeforderte Bereiche.",
        "要求された1つ以上の範囲を返します。",
        "返回请求的一个或多个表示范围。",
        "يعيد نطاقا مطلوبا أو أكثر من التمثيل."
    ],
    "The response body reports multiple resource statuses.": [
        "उत्तर बॉडी कई संसाधनों की स्थिति बताती है।",
        "El cuerpo informa estados de varios recursos.",
        "Le corps rapporte les statuts de plusieurs ressources.",
        "Der Antworttext meldet mehrere Ressourcenstatus.",
        "本文で複数リソースの状態を報告。",
        "响应正文报告多个资源状态。",
        "يبلغ الجسم حالات موارد متعددة."
    ],
    "Avoids repeating bindings already reported in a WebDAV response.": [
        "WebDAV उत्तर में बताए बाइंडिंग दोहराने से बचाता है।",
        "Evita repetir enlaces ya informados en WebDAV.",
        "Évite de répéter les liaisons déjà rapportées en WebDAV.",
        "Vermeidet wiederholte Bindungen in einer WebDAV-Antwort.",
        "WebDAV応答で報告済みのバインディングを省略。",
        "避免重复 WebDAV 响应中已报告的绑定。",
        "يتجنب تكرار ارتباطات سبق الإبلاغ عنها في WebDAV."
    ],
    "Returns a representation after supported instance manipulations.": [
        "समर्थित इंस्टेंस बदलाव के बाद निरूपण लौटाता है।",
        "Devuelve una representación tras manipulaciones de instancia admitidas.",
        "Renvoie une représentation après manipulations d’instance prises en charge.",
        "Liefert eine Darstellung nach unterstützten Instanzmanipulationen.",
        "対応するインスタンス操作を適用した表現を返します。",
        "返回应用所支持实例操作后的表示。",
        "يعيد تمثيلا بعد عمليات معالجة مثيل مدعومة."
    ],
    "Multiple alternative representations are available.": [
        "कई वैकल्पिक निरूपण उपलब्ध हैं।",
        "Hay varias representaciones alternativas disponibles.",
        "Plusieurs représentations alternatives sont disponibles.",
        "Mehrere alternative Darstellungen sind verfügbar.",
        "複数の代替表現があります。",
        "有多个可选表示。",
        "تتوفر تمثيلات بديلة متعددة."
    ],
    "Permanent redirection; clients may change POST to GET.": [
        "स्थायी रीडायरेक्ट; क्लाइंट POST को GET में बदल सकता है।",
        "Redirección permanente; el cliente puede cambiar POST a GET.",
        "Redirection permanente ; le client peut changer POST en GET.",
        "Dauerhafte Umleitung; Clients dürfen POST in GET ändern.",
        "恒久転送。POSTがGETに変わる場合があります。",
        "永久重定向；客户端可将 POST 改为 GET。",
        "إعادة توجيه دائمة؛ قد يغير العميل POST إلى GET."
    ],
    "Temporary redirection; clients may change POST to GET.": [
        "अस्थायी रीडायरेक्ट; क्लाइंट POST को GET में बदल सकता है।",
        "Redirección temporal; el cliente puede cambiar POST a GET.",
        "Redirection temporaire ; le client peut changer POST en GET.",
        "Temporäre Umleitung; Clients dürfen POST in GET ändern.",
        "一時転送。POSTがGETに変わる場合があります。",
        "临时重定向；客户端可将 POST 改为 GET。",
        "إعادة توجيه مؤقتة؛ قد يغير العميل POST إلى GET."
    ],
    "Retrieve the indicated resource with GET or HEAD.": [
        "बताए संसाधन को GET या HEAD से प्राप्त करें।",
        "Recupera el recurso indicado con GET o HEAD.",
        "Récupérez la ressource indiquée avec GET ou HEAD.",
        "Angegebene Ressource mit GET oder HEAD abrufen.",
        "指定リソースをGETまたはHEADで取得。",
        "使用 GET 或 HEAD 获取所指资源。",
        "اجلب المورد المشار إليه بواسطة GET أو HEAD."
    ],
    "A conditional GET or HEAD can reuse the stored representation.": [
        "सशर्त GET या HEAD संग्रहीत निरूपण फिर उपयोग कर सकता है।",
        "Un GET o HEAD condicional puede reutilizar la representación guardada.",
        "Un GET ou HEAD conditionnel peut réutiliser la représentation stockée.",
        "Bedingtes GET oder HEAD darf gespeicherte Darstellung wiederverwenden.",
        "条件付きGET・HEADで保存済み表現を再利用可能。",
        "条件 GET 或 HEAD 可复用已存储表示。",
        "يمكن لـ GET أو HEAD المشروط إعادة استخدام التمثيل المخزن."
    ],
    "Deprecated proxy-redirection status; not recommended for new use.": [
        "अप्रचलित प्रॉक्सी रीडायरेक्ट; नए उपयोग हेतु अनुशंसित नहीं।",
        "Estado de redirección por proxy obsoleto; no recomendado.",
        "Redirection proxy obsolète, déconseillée pour les nouveaux usages.",
        "Veraltete Proxyumleitung; für neue Nutzung nicht empfohlen.",
        "非推奨のプロキシ転送。新規利用は推奨しません。",
        "已弃用的代理重定向状态，不建议新用途使用。",
        "حالة إعادة توجيه عبر وسيط مهملة؛ لا يوصى باستخدامها حديثا."
    ],
    "Temporary redirection preserving the request method.": [
        "अनुरोध विधि सुरक्षित रखने वाला अस्थायी रीडायरेक्ट।",
        "Redirección temporal que conserva el método.",
        "Redirection temporaire conservant la méthode.",
        "Temporäre Umleitung unter Beibehaltung der Methode.",
        "メソッドを維持する一時転送。",
        "保留请求方法的临时重定向。",
        "إعادة توجيه مؤقتة تحفظ طريقة الطلب."
    ],
    "Permanent redirection preserving the request method.": [
        "अनुरोध विधि सुरक्षित रखने वाला स्थायी रीडायरेक्ट।",
        "Redirección permanente que conserva el método.",
        "Redirection permanente conservant la méthode.",
        "Dauerhafte Umleitung unter Beibehaltung der Methode.",
        "メソッドを維持する恒久転送。",
        "保留请求方法的永久重定向。",
        "إعادة توجيه دائمة تحفظ طريقة الطلب."
    ],
    "The server cannot process a request because of client error.": [
        "क्लाइंट त्रुटि के कारण सर्वर अनुरोध पूरा नहीं कर सकता।",
        "El servidor no puede procesar la solicitud por error del cliente.",
        "Le serveur ne peut traiter la requête à cause d’une erreur client.",
        "Der Server kann die Anfrage wegen eines Clientfehlers nicht verarbeiten.",
        "クライアント側の問題で処理できません。",
        "服务器因客户端错误无法处理请求。",
        "لا يستطيع الخادم معالجة الطلب بسبب خطأ من العميل."
    ],
    "Valid authentication credentials are required; include a challenge.": [
        "मान्य प्रमाणीकरण चाहिए; चुनौती शामिल करें।",
        "Se requieren credenciales válidas; incluye un desafío.",
        "Des identifiants valides sont requis ; incluez un défi.",
        "Gültige Zugangsdaten erforderlich; Authentifizierungs-Challenge senden.",
        "有効な認証情報が必要。認証チャレンジを含めます。",
        "需要有效认证凭据；响应应包含认证质询。",
        "تلزم بيانات اعتماد صالحة؛ أدرج تحدي المصادقة."
    ],
    "Reserved for future use; application conventions are not standardized.": [
        "भविष्य हेतु आरक्षित; ऐप प्रथाएँ मानकीकृत नहीं।",
        "Reservado para uso futuro; las convenciones de aplicación no están normalizadas.",
        "Réservé à un usage futur ; les conventions applicatives ne sont pas normalisées.",
        "Für spätere Nutzung reserviert; Anwendungskonventionen sind nicht standardisiert.",
        "将来用に予約。アプリ独自の慣行は未標準化。",
        "保留供将来使用；应用约定未标准化。",
        "محجوز للمستقبل؛ اصطلاحات التطبيقات غير معيارية."
    ],
    "The server understands but refuses the request.": [
        "सर्वर समझता है पर अनुरोध अस्वीकार करता है।",
        "El servidor entiende la solicitud, pero la rechaza.",
        "Le serveur comprend la requête mais la refuse.",
        "Der Server versteht die Anfrage, verweigert sie jedoch.",
        "要求は理解しましたが拒否します。",
        "服务器理解请求但拒绝处理。",
        "يفهم الخادم الطلب لكنه يرفضه."
    ],
    "No current representation was found, or existence is undisclosed.": [
        "वर्तमान निरूपण नहीं मिला या अस्तित्व छिपाया गया है।",
        "No hay representación actual o no se revela su existencia.",
        "Aucune représentation trouvée, ou son existence est masquée.",
        "Keine aktuelle Darstellung gefunden oder Existenz wird verborgen.",
        "現在の表現が見つからないか、存在を公開していません。",
        "未找到当前表示，或服务器不愿披露其存在。",
        "لم يعثر على تمثيل حالي أو لم يكشف عن وجوده."
    ],
    "Method unsupported for this resource; report allowed methods.": [
        "इस संसाधन हेतु विधि असमर्थित; अनुमत विधियाँ बताएँ।",
        "Método no admitido para el recurso; informa los permitidos.",
        "Méthode non prise en charge ; indiquez les méthodes permises.",
        "Methode für Ressource nicht unterstützt; erlaubte Methoden nennen.",
        "このリソースでは未対応のメソッド。許可メソッドを提示。",
        "此资源不支持该方法；应列出允许的方法。",
        "الطريقة غير مدعومة لهذا المورد؛ اذكر الطرق المسموحة."
    ],
    "No representation satisfies the request's negotiation preferences.": [
        "कोई निरूपण अनुरोध की नेगोशिएशन प्राथमिकताएँ पूरी नहीं करता।",
        "Ninguna representación satisface las preferencias de negociación.",
        "Aucune représentation ne satisfait les préférences de négociation.",
        "Keine Darstellung erfüllt die Aushandlungspräferenzen.",
        "交渉で指定した条件に合う表現がありません。",
        "没有满足请求内容协商偏好的表示。",
        "لا يطابق أي تمثيل تفضيلات تفاوض الطلب."
    ],
    "Authentication with the proxy is required.": [
        "प्रॉक्सी से प्रमाणीकरण आवश्यक है।",
        "Se requiere autenticación ante el proxy.",
        "Authentification auprès du proxy requise.",
        "Authentifizierung am Proxy erforderlich.",
        "プロキシ認証が必要です。",
        "需要向代理认证。",
        "تلزم المصادقة لدى الوسيط."
    ],
    "The server did not receive a complete request in time.": [
        "सर्वर को पूरा अनुरोध समय पर नहीं मिला।",
        "El servidor no recibió la solicitud completa a tiempo.",
        "Le serveur n’a pas reçu la requête complète à temps.",
        "Der Server erhielt nicht rechtzeitig eine vollständige Anfrage.",
        "完全なリクエストを時間内に受信できませんでした。",
        "服务器未及时收到完整请求。",
        "لم يتلق الخادم الطلب كاملا في الوقت المحدد."
    ],
    "Conflict with resource state; failed If-Match normally uses 412.": [
        "संसाधन स्थिति से टकराव; विफल If-Match सामान्यतः 412 देता है।",
        "Conflicto de estado; un If-Match fallido normalmente usa 412.",
        "Conflit d’état ; un If-Match échoué utilise normalement 412.",
        "Zustandskonflikt; fehlgeschlagenes If-Match verwendet üblicherweise 412.",
        "状態との競合。If-Match失敗は通常412を使用。",
        "资源状态冲突；If-Match 失败通常使用 412。",
        "تعارض مع حالة المورد؛ فشل If-Match يستخدم عادة 412."
    ],
    "The resource is unavailable and likely permanently removed.": [
        "संसाधन अनुपलब्ध है और संभवतः स्थायी रूप से हटाया गया।",
        "El recurso no está disponible y probablemente se eliminó permanentemente.",
        "Ressource indisponible, probablement supprimée définitivement.",
        "Ressource nicht verfügbar, wahrscheinlich dauerhaft entfernt.",
        "利用できず、恒久的に削除された可能性が高いリソース。",
        "资源不可用，且很可能已永久删除。",
        "المورد غير متاح ومن المرجح أنه أزيل نهائيا."
    ],
    "The request requires a defined Content-Length.": [
        "अनुरोध में निश्चित Content-Length चाहिए।",
        "La solicitud requiere Content-Length definido.",
        "La requête exige un Content-Length défini.",
        "Anfrage benötigt eine definierte Content-Length.",
        "Content-Lengthの明示が必要です。",
        "请求需要明确的 Content-Length。",
        "يتطلب الطلب قيمة Content-Length محددة."
    ],
    "A request precondition evaluated to false.": [
        "अनुरोध की पूर्वशर्त असत्य निकली।",
        "Una precondición de la solicitud resultó falsa.",
        "Une précondition de la requête est fausse.",
        "Eine Anfragevorbedingung war nicht erfüllt.",
        "リクエストの事前条件を満たしませんでした。",
        "请求的前置条件不成立。",
        "لم يتحقق شرط مسبق للطلب."
    ],
    "Request content exceeds what the server accepts.": [
        "अनुरोध सामग्री सर्वर की स्वीकार्य सीमा से अधिक है।",
        "El contenido supera lo que acepta el servidor.",
        "Le contenu dépasse la capacité acceptée par le serveur.",
        "Anfrageinhalt überschreitet die Servergrenze.",
        "リクエスト本文がサーバーの許容範囲を超えています。",
        "请求内容超出服务器可接受范围。",
        "يتجاوز محتوى الطلب ما يقبله الخادم."
    ],
    "The URI exceeds this server's limit; no universal 2,048-character limit exists.": [
        "URI सर्वर सीमा से अधिक है; सार्वभौमिक 2,048-अक्षर सीमा नहीं है।",
        "El URI supera el límite del servidor; no hay límite universal de 2048 caracteres.",
        "L’URI dépasse la limite du serveur ; aucune limite universelle de 2 048 caractères.",
        "URI überschreitet Servergrenze; keine allgemeine Grenze von 2.048 Zeichen.",
        "URIがサーバーの上限を超過。共通の2,048文字制限はありません。",
        "URI 超出该服务器限制；不存在统一的 2,048 字符上限。",
        "يتجاوز URI حد هذا الخادم؛ لا يوجد حد عام من 2048 محرفا."
    ],
    "The resource does not support this request content format.": [
        "संसाधन यह अनुरोध सामग्री प्रारूप समर्थित नहीं करता।",
        "El recurso no admite este formato de contenido.",
        "La ressource ne prend pas en charge ce format de contenu.",
        "Die Ressource unterstützt dieses Anfrageformat nicht.",
        "このリソースは要求の内容形式に未対応です。",
        "资源不支持此请求内容格式。",
        "لا يدعم المورد تنسيق محتوى الطلب هذا."
    ],
    "Requested ranges cannot be satisfied.": [
        "माँगी सीमाएँ पूरी नहीं की जा सकतीं।",
        "No se pueden satisfacer los rangos solicitados.",
        "Les plages demandées ne peuvent être satisfaites.",
        "Angeforderte Bereiche können nicht erfüllt werden.",
        "要求した範囲を提供できません。",
        "无法满足请求的范围。",
        "لا يمكن تلبية النطاقات المطلوبة."
    ],
    "The server cannot meet an Expect requirement.": [
        "सर्वर Expect की शर्त पूरी नहीं कर सकता।",
        "El servidor no puede cumplir Expect.",
        "Le serveur ne peut satisfaire une exigence Expect.",
        "Der Server kann eine Expect-Anforderung nicht erfüllen.",
        "Expectの要件を満たせません。",
        "服务器无法满足 Expect 要求。",
        "لا يستطيع الخادم تلبية متطلب Expect."
    ],
    "Reserved as unused; the teapot response is historical HTCPCP humor.": [
        "अप्रयुक्त रूप में आरक्षित; टीपॉट उत्तर ऐतिहासिक HTCPCP मज़ाक है।",
        "Reservado sin uso; la tetera es humor histórico de HTCPCP.",
        "Réservé inutilisé ; la théière relève de l’humour historique HTCPCP.",
        "Als unbenutzt reserviert; Teekanne ist historischer HTCPCP-Scherz.",
        "未使用として予約。ティーポット応答は歴史的なHTCPCPの冗談。",
        "保留为未使用；茶壶响应属于历史 HTCPCP 玩笑。",
        "محجوز بلا استخدام؛ استجابة إبريق الشاي مزحة HTCPCP تاريخية."
    ],
    "The server cannot authoritatively answer this target URI.": [
        "सर्वर इस लक्षित URI का अधिकृत उत्तर नहीं दे सकता।",
        "El servidor no puede responder autoritativamente al URI destino.",
        "Le serveur ne peut répondre avec autorité à cet URI.",
        "Der Server kann für diese Ziel-URI nicht maßgeblich antworten.",
        "対象URIに権限のある応答を返せません。",
        "服务器无法权威地响应目标 URI。",
        "لا يستطيع الخادم الإجابة بصورة مخولة عن URI الهدف."
    ],
    "Understood content type and syntax, but cannot process the instructions.": [
        "सामग्री प्रकार और सिंटैक्स समझे गए, पर निर्देश संसाधित नहीं हो सकते।",
        "Tipo y sintaxis comprendidos, pero instrucciones no procesables.",
        "Type et syntaxe compris, mais instructions impossibles à traiter.",
        "Inhaltstyp und Syntax verstanden, Anweisungen nicht verarbeitbar.",
        "形式と構文は理解しましたが、指示を処理できません。",
        "理解内容类型和语法，但无法处理指令。",
        "نوع المحتوى وصياغته مفهومان لكن التعليمات غير قابلة للمعالجة."
    ],
    "The source or destination resource is locked.": [
        "स्रोत या गंतव्य संसाधन लॉक है।",
        "El recurso origen o destino está bloqueado.",
        "La ressource source ou destination est verrouillée.",
        "Quell- oder Zielressource ist gesperrt.",
        "元または先のリソースがロック中です。",
        "源或目标资源已锁定。",
        "المورد المصدر أو الوجهة مقفل."
    ],
    "An action failed because a required dependent action failed.": [
        "आवश्यक निर्भर कार्रवाई विफल होने से कार्रवाई विफल हुई।",
        "Falló una acción porque falló otra de la que depende.",
        "Une action échoue à cause de l’échec d’une dépendance.",
        "Aktion scheiterte wegen einer fehlgeschlagenen Abhängigkeit.",
        "依存する処理の失敗により実行できませんでした。",
        "所依赖操作失败导致此操作失败。",
        "فشل إجراء بسبب فشل إجراء يعتمد عليه."
    ],
    "The server refuses the risk of replaying early data.": [
        "सर्वर अर्ली डेटा रीप्ले का जोखिम अस्वीकार करता है।",
        "El servidor rechaza el riesgo de repetición de datos tempranos.",
        "Le serveur refuse le risque de rejeu des données précoces.",
        "Der Server verweigert das Replayrisiko früher Daten.",
        "早期データのリプレイリスクをサーバーが拒否。",
        "服务器拒绝早期数据的重放风险。",
        "يرفض الخادم خطر إعادة تشغيل البيانات المبكرة."
    ],
    "Upgrade is required; the response identifies acceptable protocols.": [
        "अपग्रेड आवश्यक है; उत्तर स्वीकार्य प्रोटोकॉल बताता है।",
        "Se requiere actualización; la respuesta indica protocolos aceptables.",
        "Mise à niveau requise ; la réponse indique les protocoles acceptables.",
        "Upgrade erforderlich; Antwort nennt akzeptierte Protokolle.",
        "アップグレードが必要。対応プロトコルを応答で示します。",
        "需要升级；响应列明可接受的协议。",
        "يلزم ترقية؛ تحدد الاستجابة البروتوكولات المقبولة."
    ],
    "The origin requires a conditional request.": [
        "मूल सर्वर सशर्त अनुरोध माँगता है।",
        "El origen requiere una solicitud condicional.",
        "L’origine exige une requête conditionnelle.",
        "Der Ursprungsserver verlangt eine bedingte Anfrage.",
        "元サーバーが条件付きリクエストを要求。",
        "源服务器要求条件请求。",
        "يتطلب الأصل طلبا مشروطا."
    ],
    "Too many requests in a time period; Retry-After is optional.": [
        "समय अवधि में बहुत अनुरोध; Retry-After वैकल्पिक है।",
        "Demasiadas solicitudes en un período; Retry-After es opcional.",
        "Trop de requêtes sur une période ; Retry-After est facultatif.",
        "Zu viele Anfragen im Zeitraum; Retry-After ist optional.",
        "一定期間の要求過多。Retry-Afterは任意です。",
        "某时间段请求过多；Retry-After 为可选。",
        "طلبات كثيرة خلال فترة؛ Retry-After اختياري."
    ],
    "Request header fields exceed the server's size limits.": [
        "अनुरोध हेडर सर्वर की आकार सीमा से अधिक हैं।",
        "Las cabeceras superan los límites del servidor.",
        "Les en-têtes dépassent les limites du serveur.",
        "Anfrageheader überschreiten die Servergrößenlimits.",
        "要求ヘッダーがサーバーのサイズ上限を超過。",
        "请求头字段超出服务器大小限制。",
        "تتجاوز حقول رؤوس الطلب حدود حجم الخادم."
    ],
    "Access is denied because of a legal demand.": [
        "कानूनी माँग के कारण पहुँच अस्वीकृत है।",
        "Acceso denegado por una exigencia legal.",
        "Accès refusé en raison d’une demande légale.",
        "Zugriff aufgrund rechtlicher Forderung verweigert.",
        "法的要請によりアクセスを拒否。",
        "因法律要求拒绝访问。",
        "رفض الوصول بسبب طلب قانوني."
    ],
    "An unexpected server condition prevented fulfillment.": [
        "अनपेक्षित सर्वर स्थिति ने अनुरोध रोका।",
        "Una condición inesperada del servidor impidió completar la solicitud.",
        "Une condition serveur inattendue empêche l’exécution.",
        "Unerwarteter Serverzustand verhinderte die Ausführung.",
        "予期しないサーバーの状態で処理できませんでした。",
        "服务器异常状况导致无法完成请求。",
        "حالت حالة غير متوقعة بالخادم دون إكمال الطلب."
    ],
    "The server lacks functionality needed to fulfill the request.": [
        "सर्वर में अनुरोध पूरा करने की आवश्यक क्षमता नहीं।",
        "El servidor carece de la funcionalidad necesaria.",
        "Le serveur ne dispose pas des fonctions nécessaires.",
        "Dem Server fehlt die erforderliche Funktionalität.",
        "要求を満たすための機能が未実装。",
        "服务器缺少完成请求所需功能。",
        "يفتقر الخادم إلى الوظيفة اللازمة لإكمال الطلب."
    ],
    "A gateway received an invalid upstream response.": [
        "गेटवे को अमान्य अपस्ट्रीम उत्तर मिला।",
        "Una pasarela recibió una respuesta ascendente no válida.",
        "Une passerelle a reçu une réponse amont invalide.",
        "Gateway erhielt eine ungültige Antwort vom Zielserver.",
        "ゲートウェイが上流から不正な応答を受信。",
        "网关收到无效上游响应。",
        "تلقت بوابة استجابة غير صالحة من الخادم الأعلى."
    ],
    "Temporary unavailability, often overload or maintenance.": [
        "अस्थायी अनुपलब्धता, अक्सर ओवरलोड या रखरखाव।",
        "Indisponibilidad temporal, a menudo por sobrecarga o mantenimiento.",
        "Indisponibilité temporaire, souvent surcharge ou maintenance.",
        "Temporär nicht verfügbar, oft Überlast oder Wartung.",
        "過負荷やメンテナンスなどによる一時的な停止。",
        "暂时不可用，通常因过载或维护。",
        "عدم توفر مؤقت غالبا بسبب الحمل أو الصيانة."
    ],
    "A gateway did not receive a timely upstream response.": [
        "गेटवे को अपस्ट्रीम उत्तर समय पर नहीं मिला।",
        "Una pasarela no recibió respuesta ascendente a tiempo.",
        "Une passerelle n’a pas reçu de réponse amont à temps.",
        "Gateway erhielt nicht rechtzeitig eine Antwort vom Zielserver.",
        "ゲートウェイが上流応答を時間内に受信できませんでした。",
        "网关未及时收到上游响应。",
        "لم تتلق البوابة استجابة من الخادم الأعلى في الوقت المناسب."
    ],
    "The request's HTTP major version is unsupported.": [
        "अनुरोध का HTTP प्रमुख संस्करण असमर्थित है।",
        "La versión principal HTTP de la solicitud no se admite.",
        "La version majeure HTTP de la requête n’est pas prise en charge.",
        "HTTP-Hauptversion der Anfrage wird nicht unterstützt.",
        "要求のHTTPメジャーバージョンに未対応。",
        "不支持请求的 HTTP 主版本。",
        "الإصدار الرئيسي لـ HTTP في الطلب غير مدعوم."
    ],
    "A negotiated variant itself participates in content negotiation.": [
        "चुना वैरिएंट स्वयं सामग्री नेगोशिएशन में शामिल है।",
        "La variante negociada participa a su vez en negociación.",
        "La variante négociée participe elle-même à la négociation.",
        "Die ausgehandelte Variante nimmt selbst an Inhaltsaushandlung teil.",
        "交渉したバリアント自体が内容交渉の対象です。",
        "协商出的变体自身也参与内容协商。",
        "يشارك المتغير المتفاوض عليه نفسه في تفاوض المحتوى."
    ],
    "Insufficient storage to complete the operation.": [
        "ऑपरेशन पूरा करने हेतु संग्रहण अपर्याप्त।",
        "Almacenamiento insuficiente para completar la operación.",
        "Stockage insuffisant pour terminer l’opération.",
        "Nicht genug Speicher zum Abschließen der Aktion.",
        "処理完了に必要なストレージが不足。",
        "存储空间不足，无法完成操作。",
        "مساحة تخزين غير كافية لإكمال العملية."
    ],
    "An infinite loop was detected during WebDAV processing.": [
        "WebDAV प्रक्रिया में अनंत लूप मिला।",
        "Se detectó un bucle infinito durante WebDAV.",
        "Boucle infinie détectée pendant WebDAV.",
        "Endlosschleife bei WebDAV-Verarbeitung erkannt.",
        "WebDAV処理で無限ループを検出。",
        "WebDAV 处理时检测到无限循环。",
        "اكتشفت حلقة لا نهائية أثناء معالجة WebDAV."
    ],
    "Obsoleted extension-framework status; retained only as historical reference.": [
        "अप्रचलित एक्सटेंशन-फ़्रेमवर्क स्थिति; केवल ऐतिहासिक संदर्भ।",
        "Estado de extensiones obsoleto; solo referencia histórica.",
        "Statut du cadre d’extensions obsolète ; référence historique uniquement.",
        "Abgelöster Erweiterungsstatus; nur historische Referenz.",
        "廃止された拡張方式の状態。歴史資料として掲載。",
        "已废止的扩展框架状态；仅作历史参考。",
        "حالة إطار امتدادات ملغاة؛ مرجع تاريخي فقط."
    ],
    "Authenticate to gain network access, such as a captive portal.": [
        "कैप्टिव पोर्टल जैसे नेटवर्क उपयोग हेतु प्रमाणीकरण।",
        "Autentícate para acceder a la red, como en un portal cautivo.",
        "Authentifiez-vous pour accéder au réseau, par exemple un portail captif.",
        "Für Netzwerkzugriff authentifizieren, etwa am Captive Portal.",
        "キャプティブポータルなどのネットワーク認証が必要。",
        "需认证以访问网络，如强制门户。",
        "صادق للوصول إلى الشبكة مثل بوابة مقيدة."
    ],
    "Large upload handshake": [
        "बड़े अपलोड का हैंडशेक",
        "Negociación de carga grande",
        "Négociation d’un gros envoi",
        "Handshake für große Uploads",
        "大容量アップロードの確認",
        "大型上传握手",
        "مصافحة رفع كبير"
    ],
    "WebSocket upgrade": [
        "WebSocket अपग्रेड",
        "Actualización WebSocket",
        "Mise à niveau WebSocket",
        "WebSocket-Upgrade",
        "WebSocketへの切り替え",
        "WebSocket 升级",
        "ترقية WebSocket"
    ],
    "Long-running WebDAV operation": [
        "लंबा WebDAV ऑपरेशन",
        "Operación WebDAV prolongada",
        "Opération WebDAV longue",
        "Lange WebDAV-Aktion",
        "長時間のWebDAV処理",
        "长时间 WebDAV 操作",
        "عملية WebDAV طويلة"
    ],
    "Early resource preload hints": [
        "संसाधन प्रीलोड के शुरुआती संकेत",
        "Pistas de precarga temprana",
        "Indications de préchargement",
        "Frühe Ressourcenladehinweise",
        "リソース先読みのヒント",
        "资源预加载提示",
        "تلميحات تحميل الموارد المبكر"
    ],
    "Successful resource retrieval": [
        "सफल संसाधन प्राप्ति",
        "Obtención correcta de recurso",
        "Récupération réussie de ressource",
        "Erfolgreicher Ressourcenabruf",
        "リソースの取得成功",
        "成功获取资源",
        "جلب مورد بنجاح"
    ],
    "Resource creation": [
        "संसाधन निर्माण",
        "Creación de recursos",
        "Création de ressource",
        "Ressourcenerstellung",
        "リソース作成",
        "创建资源",
        "إنشاء مورد"
    ],
    "Queued or asynchronous work": [
        "कतार या असमकालिक कार्य",
        "Trabajo en cola o asíncrono",
        "Travail en attente ou asynchrone",
        "Warteschlangen- oder asynchrone Arbeit",
        "キュー処理・非同期処理",
        "排队或异步工作",
        "عمل في قائمة انتظار أو غير متزامن"
    ],
    "Proxy content transformation": [
        "प्रॉक्सी सामग्री रूपांतरण",
        "Transformación de contenido por proxy",
        "Transformation de contenu par proxy",
        "Inhaltsumwandlung durch Proxy",
        "プロキシによる内容変換",
        "代理内容转换",
        "تحويل محتوى عبر وسيط"
    ],
    "Successful operation without content": [
        "बिना सामग्री सफल ऑपरेशन",
        "Operación correcta sin contenido",
        "Opération réussie sans contenu",
        "Erfolgreiche Aktion ohne Inhalt",
        "本文不要の処理成功",
        "无内容的成功操作",
        "عملية ناجحة بلا محتوى"
    ],
    "Reset a submitted form": [
        "भेजा फ़ॉर्म रीसेट करें",
        "Restablecer formulario enviado",
        "Réinitialiser le formulaire envoyé",
        "Gesendetes Formular zurücksetzen",
        "送信済みフォームのリセット",
        "重置已提交表单",
        "إعادة ضبط نموذج مرسل"
    ],
    "Range downloads and streaming": [
        "रेंज डाउनलोड और स्ट्रीमिंग",
        "Descargas parciales y streaming",
        "Téléchargements partiels et streaming",
        "Bereichsdownloads und Streaming",
        "部分ダウンロード・配信",
        "范围下载和流式传输",
        "تنزيل نطاقات وبث"
    ],
    "WebDAV batch results": [
        "WebDAV बैच परिणाम",
        "Resultados de lote WebDAV",
        "Résultats de lot WebDAV",
        "WebDAV-Stapelergebnisse",
        "WebDAV一括処理結果",
        "WebDAV 批量结果",
        "نتائج دفعات WebDAV"
    ],
    "Avoid duplicate WebDAV bindings": [
        "दोहराए WebDAV बाइंडिंग से बचें",
        "Evitar enlaces WebDAV repetidos",
        "Éviter les liaisons WebDAV répétées",
        "Doppelte WebDAV-Bindungen vermeiden",
        "WebDAVバインディングの重複回避",
        "避免重复 WebDAV 绑定",
        "تجنب ارتباطات WebDAV المكررة"
    ],
    "Delta-encoded updates": [
        "डेल्टा-एन्कोड किए अपडेट",
        "Actualizaciones delta",
        "Mises à jour delta",
        "Delta-kodierte Updates",
        "差分符号化の更新",
        "差量编码更新",
        "تحديثات مرمزة تفاضليا"
    ],
    "Alternative representations": [
        "वैकल्पिक निरूपण",
        "Representaciones alternativas",
        "Représentations alternatives",
        "Alternative Darstellungen",
        "代替表現",
        "可选表示",
        "تمثيلات بديلة"
    ],
    "Permanent URL migration": [
        "स्थायी URL माइग्रेशन",
        "Migración permanente de URL",
        "Migration permanente d’URL",
        "Dauerhafte URL-Migration",
        "URLの恒久移行",
        "永久 URL 迁移",
        "ترحيل URL دائم"
    ],
    "Temporary destination": [
        "अस्थायी गंतव्य",
        "Destino temporal",
        "Destination temporaire",
        "Temporäres Ziel",
        "一時的な転送先",
        "临时目标",
        "وجهة مؤقتة"
    ],
    "Post-redirect-get workflow": [
        "पोस्ट-रीडायरेक्ट-गेट वर्कफ़्लो",
        "Flujo post-redirect-get",
        "Flux post-redirect-get",
        "Post-Redirect-Get-Ablauf",
        "POST後にGETへ転送する流れ",
        "POST 后重定向 GET 流程",
        "سير عمل POST ثم إعادة توجيه ثم GET"
    ],
    "Cache validation": [
        "कैश सत्यापन",
        "Validación de caché",
        "Validation de cache",
        "Cachevalidierung",
        "キャッシュ検証",
        "缓存验证",
        "التحقق من الذاكرة المؤقتة"
    ],
    "Historical proxy selection": [
        "ऐतिहासिक प्रॉक्सी चयन",
        "Selección histórica de proxy",
        "Ancienne sélection de proxy",
        "Historische Proxyauswahl",
        "以前のプロキシ選択",
        "历史代理选择",
        "اختيار وسيط تاريخي"
    ],
    "Temporary method-preserving redirect": [
        "विधि सुरक्षित अस्थायी रीडायरेक्ट",
        "Redirección temporal conservando método",
        "Redirection temporaire conservant la méthode",
        "Temporäre methodentreue Umleitung",
        "メソッド維持の一時転送",
        "保留方法的临时重定向",
        "توجيه مؤقت يحفظ الطريقة"
    ],
    "Permanent method-preserving redirect": [
        "विधि सुरक्षित स्थायी रीडायरेक्ट",
        "Redirección permanente conservando método",
        "Redirection permanente conservant la méthode",
        "Dauerhafte methodentreue Umleitung",
        "メソッド維持の恒久転送",
        "保留方法的永久重定向",
        "توجيه دائم يحفظ الطريقة"
    ],
    "Malformed request syntax": [
        "गलत अनुरोध सिंटैक्स",
        "Sintaxis de solicitud incorrecta",
        "Syntaxe de requête incorrecte",
        "Fehlerhafte Anfragesyntax",
        "要求構文の誤り",
        "请求语法错误",
        "صياغة طلب مشوهة"
    ],
    "Missing or invalid credentials": [
        "गुम या अमान्य क्रेडेंशियल",
        "Credenciales ausentes o no válidas",
        "Identifiants absents ou invalides",
        "Fehlende oder ungültige Zugangsdaten",
        "認証情報の欠如・無効",
        "凭据缺失或无效",
        "بيانات اعتماد مفقودة أو غير صالحة"
    ],
    "Application-specific payment convention": [
        "ऐप-विशिष्ट भुगतान प्रथा",
        "Convención de pago propia de la aplicación",
        "Convention de paiement propre à l’application",
        "Anwendungsspezifische Zahlungskonvention",
        "アプリ独自の支払い慣行",
        "应用自定义支付约定",
        "اصطلاح دفع خاص بالتطبيق"
    ],
    "Insufficient permissions": [
        "अपर्याप्त अनुमतियाँ",
        "Permisos insuficientes",
        "Autorisations insuffisantes",
        "Unzureichende Berechtigungen",
        "権限不足",
        "权限不足",
        "أذونات غير كافية"
    ],
    "Missing or hidden resource": [
        "गुम या छिपा संसाधन",
        "Recurso ausente u oculto",
        "Ressource absente ou cachée",
        "Fehlende oder verborgene Ressource",
        "存在しない・非公開のリソース",
        "缺失或隐藏的资源",
        "مورد مفقود أو مخفي"
    ],
    "Unsupported resource method": [
        "संसाधन की असमर्थित विधि",
        "Método de recurso no admitido",
        "Méthode de ressource non prise en charge",
        "Nicht unterstützte Ressourcenmethode",
        "未対応のリソースメソッド",
        "资源不支持的方法",
        "طريقة مورد غير مدعومة"
    ],
    "Content negotiation failure": [
        "सामग्री नेगोशिएशन विफल",
        "Fallo de negociación de contenido",
        "Échec de négociation du contenu",
        "Fehlgeschlagene Inhaltsaushandlung",
        "内容交渉の失敗",
        "内容协商失败",
        "فشل تفاوض المحتوى"
    ],
    "Proxy login challenge": [
        "प्रॉक्सी लॉगिन चुनौती",
        "Desafío de acceso al proxy",
        "Défi de connexion au proxy",
        "Proxy-Anmeldeaufforderung",
        "プロキシ認証の要求",
        "代理登录质询",
        "تحدي دخول الوسيط"
    ],
    "Incomplete slow request": [
        "धीमा अधूरा अनुरोध",
        "Solicitud lenta e incompleta",
        "Requête lente incomplète",
        "Unvollständige langsame Anfrage",
        "遅延した未完了リクエスト",
        "缓慢且不完整的请求",
        "طلب بطيء غير مكتمل"
    ],
    "Resource state conflict": [
        "संसाधन स्थिति टकराव",
        "Conflicto de estado del recurso",
        "Conflit d’état de ressource",
        "Ressourcenzustandskonflikt",
        "リソース状態の競合",
        "资源状态冲突",
        "تعارض حالة المورد"
    ],
    "Intentionally removed resource": [
        "जानबूझकर हटाया संसाधन",
        "Recurso eliminado intencionalmente",
        "Ressource supprimée intentionnellement",
        "Absichtlich entfernte Ressource",
        "意図的に削除したリソース",
        "主动移除的资源",
        "مورد أزيل عمدا"
    ],
    "Required content length": [
        "आवश्यक सामग्री लंबाई",
        "Longitud de contenido requerida",
        "Longueur de contenu requise",
        "Erforderliche Inhaltslänge",
        "内容長の明示要求",
        "需要内容长度",
        "طول محتوى مطلوب"
    ],
    "Failed conditional request": [
        "विफल सशर्त अनुरोध",
        "Solicitud condicional fallida",
        "Requête conditionnelle échouée",
        "Fehlgeschlagene bedingte Anfrage",
        "条件付き要求の失敗",
        "条件请求失败",
        "طلب مشروط فاشل"
    ],
    "Upload size limit": [
        "अपलोड आकार सीमा",
        "Límite de tamaño de carga",
        "Limite de taille d’envoi",
        "Uploadgrößenlimit",
        "アップロードサイズ上限",
        "上传大小限制",
        "حد حجم الرفع"
    ],
    "Oversized request target": [
        "अत्यधिक बड़ा अनुरोध लक्ष्य",
        "Destino de solicitud demasiado largo",
        "Cible de requête trop longue",
        "Zu großes Anfrageziel",
        "要求先URIが長すぎる",
        "请求目标过长",
        "هدف طلب طويل جدا"
    ],
    "Unsupported Content-Type": [
        "असमर्थित Content-Type",
        "Content-Type no admitido",
        "Content-Type non pris en charge",
        "Nicht unterstützter Content-Type",
        "未対応のContent-Type",
        "不支持的 Content-Type",
        "Content-Type غير مدعوم"
    ],
    "Unsatisfiable byte range": [
        "असंतोषजनक बाइट रेंज",
        "Rango de bytes no satisfacible",
        "Plage d’octets impossible",
        "Nicht erfüllbarer Bytebereich",
        "提供できないバイト範囲",
        "无法满足的字节范围",
        "نطاق بايتات غير قابل للتلبية"
    ],
    "Rejected Expect requirement": [
        "अस्वीकृत Expect आवश्यकता",
        "Requisito Expect rechazado",
        "Exigence Expect rejetée",
        "Abgelehnte Expect-Anforderung",
        "Expect要件の拒否",
        "Expect 要求被拒绝",
        "متطلب Expect مرفوض"
    ],
    "Historical HTCPCP joke": [
        "ऐतिहासिक HTCPCP मज़ाक",
        "Broma histórica HTCPCP",
        "Plaisanterie historique HTCPCP",
        "Historischer HTCPCP-Scherz",
        "歴史的なHTCPCPの冗談",
        "历史 HTCPCP 玩笑",
        "مزحة HTCPCP تاريخية"
    ],
    "Connection routed to wrong authority": [
        "गलत प्राधिकारी तक भेजा कनेक्शन",
        "Conexión dirigida a autoridad incorrecta",
        "Connexion vers la mauvaise autorité",
        "Verbindung zur falschen Zuständigkeit",
        "権限のない接続先への転送",
        "连接路由到错误权威方",
        "اتصال موجه إلى جهة غير صحيحة"
    ],
    "Semantically invalid instructions": [
        "अर्थ की दृष्टि से अमान्य निर्देश",
        "Instrucciones semánticamente no válidas",
        "Instructions sémantiquement invalides",
        "Semantisch ungültige Anweisungen",
        "意味上無効な指示",
        "语义无效的指令",
        "تعليمات غير صالحة دلاليا"
    ],
    "WebDAV resource lock": [
        "WebDAV संसाधन लॉक",
        "Bloqueo de recurso WebDAV",
        "Verrou de ressource WebDAV",
        "WebDAV-Ressourcensperre",
        "WebDAVリソースのロック",
        "WebDAV 资源锁",
        "قفل مورد WebDAV"
    ],
    "Dependent WebDAV action": [
        "निर्भर WebDAV कार्रवाई",
        "Acción WebDAV dependiente",
        "Action WebDAV dépendante",
        "Abhängige WebDAV-Aktion",
        "依存するWebDAV処理",
        "依赖 WebDAV 操作",
        "إجراء WebDAV تابع"
    ],
    "Early-data replay protection": [
        "अर्ली डेटा रीप्ले सुरक्षा",
        "Protección contra repetición de datos tempranos",
        "Protection contre le rejeu des données précoces",
        "Schutz vor Replay früher Daten",
        "早期データのリプレイ対策",
        "早期数据重放防护",
        "حماية إعادة تشغيل البيانات المبكرة"
    ],
    "Required protocol upgrade": [
        "आवश्यक प्रोटोकॉल अपग्रेड",
        "Actualización de protocolo requerida",
        "Mise à niveau du protocole requise",
        "Erforderliches Protokollupgrade",
        "プロトコルの切り替え要求",
        "需要协议升级",
        "ترقية بروتوكول مطلوبة"
    ],
    "Prevent lost updates": [
        "अपडेट खोने से बचाएँ",
        "Evitar actualizaciones perdidas",
        "Éviter les mises à jour perdues",
        "Verlorene Updates vermeiden",
        "更新の上書き防止",
        "防止更新丢失",
        "منع ضياع التحديثات"
    ],
    "Rate or quota limit": [
        "दर या कोटा सीमा",
        "Límite de tasa o cuota",
        "Limite de débit ou quota",
        "Raten- oder Kontingentlimit",
        "要求頻度・割り当て上限",
        "速率或配额限制",
        "حد معدل أو حصة"
    ],
    "Oversized cookies or headers": [
        "अत्यधिक बड़े कुकी या हेडर",
        "Cookies o cabeceras demasiado grandes",
        "Cookies ou en-têtes trop volumineux",
        "Zu große Cookies oder Header",
        "Cookie・ヘッダーが大きすぎる",
        "Cookie 或请求头过大",
        "ملفات تعريف ارتباط أو رؤوس كبيرة"
    ],
    "Legal access restriction": [
        "कानूनी पहुँच प्रतिबंध",
        "Restricción legal de acceso",
        "Restriction légale d’accès",
        "Rechtliche Zugriffsbeschränkung",
        "法的なアクセス制限",
        "法律访问限制",
        "قيد وصول قانوني"
    ],
    "Unexpected application failure": [
        "अनपेक्षित ऐप विफलता",
        "Fallo inesperado de aplicación",
        "Échec applicatif inattendu",
        "Unerwarteter Anwendungsfehler",
        "予期しないアプリの障害",
        "应用异常失败",
        "فشل تطبيق غير متوقع"
    ],
    "Unimplemented server capability": [
        "सर्वर की अनिर्मित क्षमता",
        "Capacidad del servidor no implementada",
        "Capacité serveur non implémentée",
        "Nicht implementierte Serverfunktion",
        "未実装のサーバー機能",
        "未实现的服务器能力",
        "إمكانية خادم غير منفذة"
    ],
    "Invalid upstream response": [
        "अमान्य अपस्ट्रीम उत्तर",
        "Respuesta ascendente no válida",
        "Réponse amont invalide",
        "Ungültige Zielserverantwort",
        "上流の不正応答",
        "无效上游响应",
        "استجابة غير صالحة من الخادم الأعلى"
    ],
    "Maintenance or overload": [
        "रखरखाव या ओवरलोड",
        "Mantenimiento o sobrecarga",
        "Maintenance ou surcharge",
        "Wartung oder Überlast",
        "保守・過負荷",
        "维护或过载",
        "صيانة أو حمل زائد"
    ],
    "Upstream response timeout": [
        "अपस्ट्रीम उत्तर समय सीमा",
        "Tiempo de espera ascendente agotado",
        "Délai de réponse amont dépassé",
        "Zeitüberschreitung beim Zielserver",
        "上流応答のタイムアウト",
        "上游响应超时",
        "انتهاء مهلة استجابة الخادم الأعلى"
    ],
    "Unsupported HTTP version": [
        "असमर्थित HTTP संस्करण",
        "Versión HTTP no admitida",
        "Version HTTP non prise en charge",
        "Nicht unterstützte HTTP-Version",
        "未対応のHTTPバージョン",
        "不支持的 HTTP 版本",
        "إصدار HTTP غير مدعوم"
    ],
    "Variant configuration error": [
        "वैरिएंट कॉन्फ़िगरेशन त्रुटि",
        "Error de configuración de variante",
        "Erreur de configuration de variante",
        "Variantenkonfigurationsfehler",
        "バリアント設定の不備",
        "变体配置错误",
        "خطأ إعداد متغير"
    ],
    "Storage or quota exhaustion": [
        "संग्रहण या कोटा समाप्त",
        "Almacenamiento o cuota agotados",
        "Stockage ou quota épuisé",
        "Speicher oder Kontingent erschöpft",
        "ストレージ・割り当て枯渇",
        "存储或配额耗尽",
        "نفاد التخزين أو الحصة"
    ],
    "WebDAV binding loop": [
        "WebDAV बाइंडिंग लूप",
        "Bucle de enlace WebDAV",
        "Boucle de liaison WebDAV",
        "WebDAV-Bindungsschleife",
        "WebDAVバインディングのループ",
        "WebDAV 绑定循环",
        "حلقة ارتباط WebDAV"
    ],
    "Historical extension framework": [
        "ऐतिहासिक एक्सटेंशन फ़्रेमवर्क",
        "Marco histórico de extensiones",
        "Ancien cadre d’extensions",
        "Historisches Erweiterungsframework",
        "以前の拡張フレームワーク",
        "历史扩展框架",
        "إطار امتدادات تاريخي"
    ],
    "Captive portal login": [
        "कैप्टिव पोर्टल लॉगिन",
        "Acceso a portal cautivo",
        "Connexion au portail captif",
        "Captive-Portal-Anmeldung",
        "キャプティブポータルへのログイン",
        "强制门户登录",
        "دخول بوابة مقيدة"
    ],
    "Selected HTTP status codes with explanations, examples and primary sources": [
        "स्पष्टीकरण, उदाहरण और प्राथमिक स्रोतों सहित चुने HTTP कोड",
        "Códigos HTTP seleccionados con explicaciones, ejemplos y fuentes primarias",
        "Codes HTTP sélectionnés, explications, exemples et sources primaires",
        "Ausgewählte HTTP-Statuscodes mit Erklärungen, Beispielen und Primärquellen",
        "HTTP状態コードの解説・例・一次資料",
        "精选 HTTP 状态码及解释、示例和一手来源",
        "رموز HTTP مختارة مع شرح وأمثلة ومصادر أولية"
    ],
    "Browse selected HTTP status codes with explanations, use cases and source links. Official reason phrases and examples remain unchanged across languages.": [
        "चुने HTTP कोड के स्पष्टीकरण, उपयोग और स्रोत देखें। आधिकारिक नाम और उदाहरण सभी भाषाओं में समान हैं।",
        "Consulta códigos HTTP, explicaciones, usos y fuentes. Los nombres oficiales y ejemplos no cambian con el idioma.",
        "Consultez codes HTTP, explications, usages et sources. Les libellés officiels et exemples restent identiques entre langues.",
        "HTTP-Codes mit Erklärungen, Anwendungsfällen und Quellen durchsuchen. Offizielle Bezeichnungen und Beispiele bleiben sprachübergreifend unverändert.",
        "HTTP状態コードの解説・用途・出典を確認できます。公式の理由句と例は言語を切り替えても維持します。",
        "浏览精选 HTTP 状态码、解释、用例和来源链接。官方原因短语和示例在各语言间保持不变。",
        "تصفح رموز HTTP المختارة مع شرح واستخدامات وروابط مصادر. تبقى العبارات الرسمية والأمثلة كما هي بين اللغات."
    ],
    "Search by code, name, translated explanation or use case, then filter by status class and expand a row.": [
        "कोड, नाम, अनुवादित स्पष्टीकरण या उपयोग से खोजें, फिर स्थिति वर्ग चुनें और पंक्ति खोलें।",
        "Busca por código, nombre, explicación traducida o uso; filtra por clase y expande una fila.",
        "Recherchez code, nom, explication traduite ou usage, filtrez par classe puis dépliez une ligne.",
        "Nach Code, Name, übersetzter Erklärung oder Verwendung suchen, nach Klasse filtern und Zeile öffnen.",
        "番号・名前・翻訳済み解説・用途で検索し、分類で絞って行を展開します。",
        "按代码、名称、翻译后的解释或用例搜索，然后按状态类别筛选并展开条目。",
        "ابحث بالرمز أو الاسم أو الشرح المترجم أو الاستخدام ثم رشح حسب الفئة ووسع الصف."
    ],
    "This is a bundled reference, not a live registry or a complete list of every vendor code.": [
        "यह साथ दिया संदर्भ है, लाइव रजिस्ट्री या सभी विक्रेता कोड की पूर्ण सूची नहीं।",
        "Esta referencia incluida no es un registro en vivo ni una lista completa de códigos de proveedores.",
        "Cette référence intégrée n’est ni un registre en direct ni une liste exhaustive des codes propriétaires.",
        "Dies ist eine mitgelieferte Referenz, kein Liveregister oder vollständiger Katalog aller Herstellercodes.",
        "同梱の参考一覧であり、リアルタイムの登録簿や全ベンダーコードの完全な一覧ではありません。",
        "这是内置参考资料，并非实时注册表或所有厂商代码的完整清单。",
        "هذا مرجع مرفق وليس سجلا مباشرا أو قائمة كاملة لكل رموز الموردين."
    ],
    "Choose response codes according to method and resource semantics; creation and validation responses depend on the operation.": [
        "विधि और संसाधन अर्थ के अनुसार कोड चुनें; निर्माण और सत्यापन उत्तर ऑपरेशन पर निर्भर हैं।",
        "Elige códigos según método y recurso; las respuestas de creación y validación dependen de la operación.",
        "Choisissez selon méthode et ressource ; les réponses de création et validation dépendent de l’opération.",
        "Statuscodes nach Methoden- und Ressourcensemantik wählen; Erstellungs- und Validierungsantworten hängen von der Aktion ab.",
        "メソッドとリソースの意味に応じて選びます。作成・検証の応答は処理内容によって異なります。",
        "根据方法和资源语义选择响应码；创建和验证响应取决于操作。",
        "اختر رموز الاستجابة وفقا لدلالات الطريقة والمورد؛ تعتمد استجابات الإنشاء والتحقق على العملية."
    ],
    "429 may include Retry-After. Redirects 307 and 308 preserve the method; 301 and 302 can change POST to GET.": [
        "429 में Retry-After हो सकता है। 307 और 308 विधि रखते हैं; 301 और 302 POST को GET बना सकते हैं।",
        "429 puede incluir Retry-After. 307 y 308 conservan el método; 301 y 302 pueden cambiar POST a GET.",
        "429 peut inclure Retry-After. 307 et 308 conservent la méthode ; 301 et 302 peuvent changer POST en GET.",
        "429 darf Retry-After enthalten. 307 und 308 erhalten die Methode; 301 und 302 können POST in GET ändern.",
        "429はRetry-Afterを含む場合があります。307・308はメソッドを維持し、301・302はPOSTをGETに変える場合があります。",
        "429 可包含 Retry-After。307 和 308 保留方法；301 和 302 可将 POST 改为 GET。",
        "قد يتضمن 429 رأس Retry-After. يحفظ 307 و308 الطريقة وقد يغير 301 و302 POST إلى GET."
    ],
    "104 is temporary with scheduled expiry 2026-11-13 in the IANA snapshot checked 2026-10-21. Recheck the registry before implementing it.": [
        "2026-10-21 को जाँचे IANA स्नैपशॉट में 104 अस्थायी है और समाप्ति 2026-11-13 है। लागू करने से पहले फिर जाँचें।",
        "104 es temporal y vence el 2026-11-13 según IANA comprobada el 2026-10-21. Revisa el registro antes de implementarlo.",
        "104 est temporaire, expiration prévue le 2026-11-13 selon IANA vérifié le 2026-10-21. Revérifiez avant implémentation.",
        "104 ist laut IANA-Stand vom 2026-10-21 temporär bis 2026-11-13. Vor Implementierung erneut prüfen.",
        "2026-10-21確認のIANA情報では104は一時登録で期限は2026-11-13です。実装前に再確認してください。",
        "根据 2026-10-21 核查的 IANA 快照，104 为临时注册，计划于 2026-11-13 到期。实现前请重新核实。",
        "104 مؤقت وينتهي حسب الجدول في 2026-11-13 وفق لقطة IANA المتحققة في 2026-10-21. تحقق مجددا قبل التنفيذ."
    ],
    "Search by code, name, description, or use case...": [
        "कोड, नाम, विवरण या उपयोग से खोजें...",
        "Busca código, nombre, descripción o uso…",
        "Recherchez code, nom, description ou usage…",
        "Nach Code, Name, Beschreibung oder Anwendung suchen…",
        "番号・名前・説明・用途を検索…",
        "按代码、名称、描述或用例搜索…",
        "ابحث بالرمز أو الاسم أو الوصف أو الاستخدام…"
    ],
    "Showing {shown} of {total} status codes": [
        "{total} में से {shown} स्थिति कोड",
        "{shown} de {total} códigos de estado",
        "{shown} codes d’état sur {total}",
        "{shown} von {total} Statuscodes",
        "状態コード{total}件中{shown}件",
        "显示 {total} 个状态码中的 {shown} 个",
        "عرض {shown} من {total} رموز حالة"
    ],
    "No matching references": [
        "कोई मेल खाता संदर्भ नहीं",
        "No hay referencias coincidentes",
        "Aucune référence correspondante",
        "Keine passenden Referenzen",
        "一致する参考資料はありません",
        "无匹配参考条目",
        "لا توجد مراجع مطابقة"
    ],
    "Use Case:": [
        "उपयोग:",
        "Uso:",
        "Usage :",
        "Anwendung:",
        "用途：",
        "用例：",
        "الاستخدام:"
    ],
    "Spec:": [
        "विनिर्देश:",
        "Especificación:",
        "Spécification :",
        "Spezifikation:",
        "仕様：",
        "规范：",
        "المواصفة:"
    ],
    "Temporary registration; scheduled expiry 2026-11-13": [
        "अस्थायी पंजीकरण; निर्धारित समाप्ति 2026-11-13",
        "Registro temporal; vence el 2026-11-13",
        "Enregistrement temporaire ; expiration prévue 2026-11-13",
        "Temporäre Registrierung; Ablauf geplant am 2026-11-13",
        "一時登録、期限2026-11-13",
        "临时注册；计划于 2026-11-13 到期",
        "تسجيل مؤقت؛ الانتهاء المقرر 2026-11-13"
    ],
    "Quick Reference": [
        "त्वरित संदर्भ",
        "Referencia rápida",
        "Référence rapide",
        "Kurzreferenz",
        "クイックリファレンス",
        "快速参考",
        "مرجع سريع"
    ],
    "Most Used Codes": [
        "अधिक उपयोग वाले कोड",
        "Códigos más usados",
        "Codes courants",
        "Häufige Codes",
        "よく使うコード",
        "常用代码",
        "الرموز الأكثر استخداما"
    ],
    "REST API Guidelines": [
        "REST API मार्गदर्शन",
        "Guía REST API",
        "Guide REST API",
        "REST-API-Leitfaden",
        "REST API指針",
        "REST API 指南",
        "إرشادات REST API"
    ],
    "GET success:": [
        "GET सफलता:",
        "GET exitoso:",
        "GET réussi :",
        "GET erfolgreich:",
        "GET成功：",
        "GET 成功：",
        "نجاح GET:"
    ],
    "POST create:": [
        "POST निर्माण:",
        "Creación POST:",
        "Création POST :",
        "POST-Erstellung:",
        "POST作成：",
        "POST 创建：",
        "إنشاء POST:"
    ],
    "Validation error:": [
        "सत्यापन त्रुटि:",
        "Error de validación:",
        "Erreur de validation :",
        "Validierungsfehler:",
        "検証エラー：",
        "验证错误：",
        "خطأ تحقق:"
    ],
    "Auth required:": [
        "प्रमाणीकरण चाहिए:",
        "Autenticación requerida:",
        "Authentification requise :",
        "Authentifizierung nötig:",
        "認証が必要：",
        "需要认证：",
        "تلزم المصادقة:"
    ],
    "No permission:": [
        "अनुमति नहीं:",
        "Sin permiso:",
        "Sans autorisation :",
        "Keine Berechtigung:",
        "権限なし：",
        "无权限：",
        "لا إذن:"
    ],
    "Not found:": [
        "नहीं मिला:",
        "No encontrado:",
        "Introuvable :",
        "Nicht gefunden:",
        "見つかりません：",
        "未找到：",
        "غير موجود:"
    ],
    "Rate limit:": [
        "दर सीमा:",
        "Límite de tasa:",
        "Limite de débit :",
        "Ratenlimit:",
        "頻度上限：",
        "速率限制：",
        "حد المعدل:"
    ],
    "Replaced by:": [
        "प्रतिस्थापित:",
        "Sustituido por:",
        "Remplacé par :",
        "Ersetzt durch:",
        "後継：",
        "替代文档：",
        "استبدل بـ:"
    ],
    "Year": [
        "वर्ष",
        "Año",
        "Année",
        "Jahr",
        "年",
        "年份",
        "السنة"
    ],
    "Related": [
        "संबंधित",
        "Relacionados",
        "Associés",
        "Verwandt",
        "関連",
        "相关",
        "ذات صلة"
    ],
    "All Standards": [
        "सभी मानक",
        "Todas las normas",
        "Toutes les normes",
        "Alle Standards",
        "すべての標準",
        "全部标准",
        "كل المعايير"
    ],
    "Selected RFCs with explanations, maturity levels and replacement links": [
        "स्पष्टीकरण, परिपक्वता और प्रतिस्थापन लिंक सहित चुने RFC",
        "RFC seleccionados con explicaciones, madurez y sustituciones",
        "RFC sélectionnés avec explications, maturité et remplacements",
        "Ausgewählte RFCs mit Erklärungen, Reifegrad und Nachfolgern",
        "RFCの解説・成熟度・後継文書",
        "精选 RFC 及解释、成熟度和替代链接",
        "RFC مختارة مع شرح ومستويات نضج وروابط بدائل"
    ],
    "Browse selected RFCs, their formal maturity and replacement links. Official titles, identifiers and URLs remain unchanged across languages.": [
        "चुने RFC, औपचारिक परिपक्वता और प्रतिस्थापन लिंक देखें। आधिकारिक शीर्षक, पहचानकर्ता और URL भाषाओं में समान रहते हैं।",
        "Consulta RFC seleccionados, madurez formal y sustituciones. Títulos oficiales, identificadores y URL no cambian de idioma.",
        "Consultez RFC, maturité formelle et remplacements. Titres officiels, identifiants et URL restent identiques entre langues.",
        "Ausgewählte RFCs, formale Reifegrade und Nachfolger durchsuchen. Offizielle Titel, Kennungen und URLs bleiben sprachübergreifend gleich.",
        "RFCの正式な成熟度と後継文書を確認できます。公式題名・識別子・URLは言語切り替えで変更しません。",
        "浏览精选 RFC、正式成熟度和替代链接。官方标题、标识符和 URL 在各语言间保持不变。",
        "تصفح RFC المختارة ونضجها الرسمي وروابط بدائلها. تبقى العناوين الرسمية والمعرفات وعناوين URL كما هي بين اللغات."
    ],
    "Search an RFC number, title, keyword or translated explanation; select a category or expand a group.": [
        "RFC नंबर, शीर्षक, शब्द या अनुवादित विवरण खोजें; श्रेणी चुनें या समूह खोलें।",
        "Busca número, título, palabra clave o explicación traducida; elige categoría o expande un grupo.",
        "Recherchez numéro, titre, mot-clé ou explication traduite ; choisissez une catégorie ou dépliez un groupe.",
        "RFC-Nummer, Titel, Stichwort oder übersetzte Erklärung suchen; Kategorie wählen oder Gruppe öffnen.",
        "RFC番号・題名・キーワード・翻訳済み解説で検索し、分類を選ぶかグループを展開します。",
        "搜索 RFC 编号、标题、关键词或翻译后的解释；选择类别或展开分组。",
        "ابحث برقم RFC أو عنوانه أو كلمة أو شرح مترجم؛ اختر فئة أو وسع مجموعة."
    ],
    "Maturity is separate from deployment advice or obsolescence. A superseded RFC can retain its formal standards-track status.": [
        "परिपक्वता डिप्लॉयमेंट सलाह या अप्रचलन से अलग है। प्रतिस्थापित RFC की औपचारिक स्थिति बनी रह सकती है।",
        "La madurez difiere del consejo de despliegue y la obsolescencia. Un RFC sustituido puede mantener su estado formal.",
        "La maturité diffère du conseil de déploiement et de l’obsolescence. Un RFC remplacé peut garder son statut formel.",
        "Reifegrad, Bereitstellungsempfehlung und Ablösung sind getrennt. Abgelöste RFCs können ihren formalen Status behalten.",
        "成熟度は運用推奨や廃止状況と別です。後継のあるRFCも正式な標準化状態を保持する場合があります。",
        "成熟度与部署建议或废止状态不同。已被替代的 RFC 仍可能保留其正式标准轨道状态。",
        "النضج منفصل عن إرشادات النشر أو الإلغاء. قد يحتفظ RFC المستبدل بحالته الرسمية ضمن مسار المعايير."
    ],
    "RFC Editor metadata checked 2026-10-21. This bundled selection does not automatically track later publications, updates or errata.": [
        "RFC Editor मेटाडेटा जाँच 2026-10-21। यह सूची बाद के प्रकाशन, अपडेट या सुधार स्वतः नहीं लाती।",
        "Metadatos RFC Editor comprobados el 2026-10-21. La selección no sigue automáticamente publicaciones, cambios o erratas posteriores.",
        "Métadonnées RFC Editor vérifiées le 2026-10-21. Cette sélection ne suit pas automatiquement les publications, mises à jour ou errata ultérieurs.",
        "RFC-Editor-Metadaten am 2026-10-21 geprüft. Diese Auswahl verfolgt spätere Publikationen, Updates oder Errata nicht automatisch.",
        "RFC Editor情報は2026-10-21確認。後続の公開・更新・正誤表を自動追跡する一覧ではありません。",
        "RFC Editor 元数据核查于 2026-10-21。此内置精选不会自动跟踪后续发布、更新或勘误。",
        "تحقق من بيانات RFC Editor في 2026-10-21. لا تتابع هذه المجموعة المنشورات أو التحديثات أو التصحيحات اللاحقة تلقائيا."
    ],
    "Follow the primary document, its replacement and relevant security guidance before implementing a protocol.": [
        "प्रोटोकॉल लागू करने से पहले मूल दस्तावेज़, प्रतिस्थापन और सुरक्षा मार्गदर्शन देखें।",
        "Consulta el documento primario, su sustituto y las guías de seguridad antes de implementar.",
        "Consultez le document primaire, son remplaçant et les conseils de sécurité avant d’implémenter.",
        "Vor Implementierung Primärdokument, Nachfolger und relevante Sicherheitsregeln prüfen.",
        "実装前に一次文書・後継文書・関連安全指針を確認してください。",
        "实现协议前请查阅原始文档、替代文档和相关安全指南。",
        "راجع المستند الأصلي وبديله وإرشادات الأمان ذات الصلة قبل تنفيذ البروتوكول."
    ],
    "Search RFCs by number, title, or keyword (e.g., 'jwt', 'oauth', 'tls')...": [
        "RFC नंबर, शीर्षक या शब्द खोजें (जैसे jwt, oauth, tls)...",
        "Busca RFC por número, título o palabra (p. ej., jwt, oauth, tls)…",
        "Recherchez numéro, titre ou mot-clé RFC (ex. jwt, oauth, tls)…",
        "RFC nach Nummer, Titel oder Stichwort suchen (z. B. jwt, oauth, tls)…",
        "RFC番号・題名・キーワードで検索（例：jwt、oauth、tls）…",
        "按编号、标题或关键词搜索 RFC（如 jwt、oauth、tls）…",
        "ابحث عن RFC بالرقم أو العنوان أو كلمة مثل jwt أو oauth أو tls…"
    ],
    "Showing {shown} of {total} standards": [
        "{total} में से {shown} मानक",
        "{shown} de {total} normas",
        "{shown} normes sur {total}",
        "{shown} von {total} Standards",
        "標準{total}件中{shown}件",
        "显示 {total} 个标准中的 {shown} 个",
        "عرض {shown} من {total} معيارا"
    ],
    "RFC Editor metadata checked 2026-10-21; follow primary links for later updates.": [
        "RFC Editor मेटाडेटा जाँच 2026-10-21; बाद के अपडेट हेतु मूल लिंक देखें।",
        "RFC Editor comprobado el 2026-10-21; consulta enlaces primarios para cambios posteriores.",
        "RFC Editor vérifié le 2026-10-21 ; consultez les sources pour les mises à jour suivantes.",
        "RFC Editor am 2026-10-21 geprüft; spätere Updates über Primärlinks prüfen.",
        "RFC Editor情報は2026-10-21確認。以降の更新は一次資料で確認してください。",
        "RFC Editor 元数据核查于 2026-10-21；后续更新请查看原始链接。",
        "تحقق من بيانات RFC Editor في 2026-10-21؛ راجع الروابط الأصلية للتحديثات اللاحقة."
    ],
    "Quick Reference: Key RFC Families": [
        "त्वरित संदर्भ: प्रमुख RFC समूह",
        "Referencia rápida: familias RFC principales",
        "Référence rapide : principales familles RFC",
        "Kurzreferenz: Wichtige RFC-Familien",
        "主要RFCグループの早見表",
        "快速参考：主要 RFC 系列",
        "مرجع سريع: مجموعات RFC الرئيسية"
    ],
    "JOSE family": [
        "JOSE समूह",
        "Familia JOSE",
        "Famille JOSE",
        "JOSE-Familie",
        "JOSEグループ",
        "JOSE 系列",
        "مجموعة JOSE"
    ],
    "OAuth 2.0 family": [
        "OAuth 2.0 समूह",
        "Familia OAuth 2.0",
        "Famille OAuth 2.0",
        "OAuth-2.0-Familie",
        "OAuth 2.0グループ",
        "OAuth 2.0 系列",
        "مجموعة OAuth 2.0"
    ],
    "HTTP specifications": [
        "HTTP विनिर्देश",
        "Especificaciones HTTP",
        "Spécifications HTTP",
        "HTTP-Spezifikationen",
        "HTTP仕様",
        "HTTP 规范",
        "مواصفات HTTP"
    ],
    "Email authentication": [
        "ईमेल प्रमाणीकरण",
        "Autenticación de correo",
        "Authentification email",
        "E-Mail-Authentifizierung",
        "メール認証",
        "邮件认证",
        "مصادقة البريد"
    ],
    "Search references": [
        "संदर्भ खोजें",
        "Buscar referencias",
        "Rechercher des références",
        "Referenzen durchsuchen",
        "参考資料を検索",
        "搜索参考资料",
        "البحث في المراجع"
    ],
    "SEO redirects": [
        "SEO रीडायरेक्ट",
        "Redirecciones SEO",
        "Redirections SEO",
        "SEO-Umleitungen",
        "SEOリダイレクト",
        "SEO 重定向",
        "إعادة توجيه SEO"
    ],
    "Caching": [
        "कैशिंग",
        "Caché",
        "Mise en cache",
        "Zwischenspeicherung",
        "キャッシュ",
        "缓存",
        "تخزين مؤقت"
    ],
    "Authorization": [
        "प्राधिकरण",
        "Autorización",
        "Autorisation",
        "Autorisierung",
        "認可",
        "授权",
        "التفويض"
    ],
    "Rate Limiting": [
        "दर सीमा",
        "Limitación de tasa",
        "Limitation de débit",
        "Ratenbegrenzung",
        "レート制限",
        "速率限制",
        "تحديد المعدل"
    ],
    "Maintenance": [
        "रखरखाव",
        "Mantenimiento",
        "Maintenance",
        "Wartung",
        "メンテナンス",
        "维护",
        "الصيانة"
    ],
    "1xx Informational": [
        "1xx सूचनात्मक",
        "1xx Informativa",
        "1xx Information",
        "1xx Information",
        "1xx 情報",
        "1xx 信息",
        "1xx معلومات"
    ],
    "2xx Success": [
        "2xx सफलता",
        "2xx Éxito",
        "2xx Succès",
        "2xx Erfolg",
        "2xx 成功",
        "2xx 成功",
        "2xx نجاح"
    ],
    "3xx Redirection": [
        "3xx रीडायरेक्ट",
        "3xx Redirección",
        "3xx Redirection",
        "3xx Umleitung",
        "3xx 転送",
        "3xx 重定向",
        "3xx إعادة توجيه"
    ],
    "4xx Client Error": [
        "4xx क्लाइंट त्रुटि",
        "4xx Error del cliente",
        "4xx Erreur client",
        "4xx Clientfehler",
        "4xx クライアントエラー",
        "4xx 客户端错误",
        "4xx خطأ عميل"
    ],
    "5xx Server Error": [
        "5xx सर्वर त्रुटि",
        "5xx Error del servidor",
        "5xx Erreur serveur",
        "5xx Serverfehler",
        "5xx サーバーエラー",
        "5xx 服务器错误",
        "5xx خطأ خادم"
    ],
    "Internet Standard": [
        "इंटरनेट मानक",
        "Norma de Internet",
        "Norme Internet",
        "Internetstandard",
        "インターネット標準",
        "互联网标准",
        "معيار إنترنت"
    ],
    "Draft Standard": [
        "ड्राफ़्ट मानक",
        "Norma en borrador",
        "Norme provisoire",
        "Entwurfsstandard",
        "ドラフト標準",
        "草案标准",
        "معيار مسودة"
    ],
    "Proposed Standard": [
        "प्रस्तावित मानक",
        "Norma propuesta",
        "Norme proposée",
        "Vorgeschlagener Standard",
        "提案標準",
        "提议标准",
        "معيار مقترح"
    ],
    "Best Current Practice": [
        "वर्तमान श्रेष्ठ प्रथा",
        "Mejor práctica actual",
        "Bonne pratique actuelle",
        "Aktuelle bewährte Praxis",
        "現行の最良慣行",
        "当前最佳实践",
        "أفضل ممارسة حالية"
    ],
    "Informational": [
        "सूचनात्मक",
        "Informativo",
        "Informatif",
        "Informativ",
        "情報提供",
        "信息性",
        "معلوماتي"
    ],
    "Experimental": [
        "प्रयोगात्मक",
        "Experimental",
        "Expérimental",
        "Experimentell",
        "実験",
        "实验性",
        "تجريبي"
    ],
    "Historic": [
        "ऐतिहासिक",
        "Histórico",
        "Historique",
        "Historisch",
        "歴史的",
        "历史性",
        "تاريخي"
    ],
    "Security - OAuth": [
        "सुरक्षा - OAuth",
        "Seguridad - OAuth",
        "Sécurité - OAuth",
        "Sicherheit – OAuth",
        "セキュリティ – OAuth",
        "安全 - OAuth",
        "الأمان - OAuth"
    ],
    "Security - JOSE": [
        "सुरक्षा - JOSE",
        "Seguridad - JOSE",
        "Sécurité - JOSE",
        "Sicherheit – JOSE",
        "セキュリティ – JOSE",
        "安全 - JOSE",
        "الأمان - JOSE"
    ],
    "Security - Identity": [
        "सुरक्षा - पहचान",
        "Seguridad - Identidad",
        "Sécurité - Identité",
        "Sicherheit – Identität",
        "セキュリティ – ID",
        "安全 - 身份",
        "الأمان - الهوية"
    ],
    "HTTP": [
        "HTTP",
        "HTTP",
        "HTTP",
        "HTTP",
        "HTTP",
        "HTTP",
        "HTTP"
    ],
    "Security - TLS": [
        "सुरक्षा - TLS",
        "Seguridad - TLS",
        "Sécurité - TLS",
        "Sicherheit – TLS",
        "セキュリティ – TLS",
        "安全 - TLS",
        "الأمان - TLS"
    ],
    "Security - Web": [
        "सुरक्षा - वेब",
        "Seguridad - Web",
        "Sécurité - Web",
        "Sicherheit – Web",
        "セキュリティ – ウェブ",
        "安全 - Web",
        "الأمان - الويب"
    ],
    "Web Protocols": [
        "वेब प्रोटोकॉल",
        "Protocolos web",
        "Protocoles web",
        "Webprotokolle",
        "ウェブプロトコル",
        "Web 协议",
        "بروتوكولات الويب"
    ],
    "DNS": [
        "DNS",
        "DNS",
        "DNS",
        "DNS",
        "DNS",
        "DNS",
        "DNS"
    ],
    "Data Formats": [
        "डेटा प्रारूप",
        "Formatos de datos",
        "Formats de données",
        "Datenformate",
        "データ形式",
        "数据格式",
        "تنسيقات البيانات"
    ],
    "API Standards": [
        "API मानक",
        "Normas API",
        "Normes API",
        "API-Standards",
        "API標準",
        "API 标准",
        "معايير API"
    ],
    "HTTP Status Codes Reference": [
        "HTTP स्टेटस कोड संदर्भ",
        "Referencia de códigos de estado HTTP",
        "Référence des codes d’état HTTP",
        "HTTP-Statuscode-Referenz",
        "HTTPステータスコード一覧",
        "HTTP 状态码参考",
        "مرجع رموز حالة HTTP"
    ],
    "All ({count})": [
        "सभी ({count})",
        "Todos ({count})",
        "Tous ({count})",
        "Alle ({count})",
        "すべて（{count}）",
        "全部（{count}）",
        "الكل ({count})"
    ],
    "Example:": [
        "उदाहरण:",
        "Ejemplo:",
        "Exemple :",
        "Beispiel:",
        "例:",
        "示例：",
        "مثال:"
    ],
    "Title": [
        "शीर्षक",
        "Título",
        "Titre",
        "Titel",
        "タイトル",
        "标题",
        "العنوان"
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
    "RFC Standards Reference": [
        "RFC मानक संदर्भ",
        "Referencia de estándares RFC",
        "Référence des normes RFC",
        "RFC-Standardreferenz",
        "RFC標準リファレンス",
        "RFC 标准参考",
        "مرجع معايير RFC"
    ],
    "Authentication": [
        "प्रमाणीकरण",
        "Autenticación",
        "Authentification",
        "Authentifizierung",
        "認証",
        "身份验证",
        "المصادقة"
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
    "Transport": [
        "परिवहन",
        "Transporte",
        "Transport",
        "Übertragung",
        "通信経路",
        "传输方式",
        "وسيلة النقل"
    ],
    "Cryptography": [
        "क्रिप्टोग्राफ़ी",
        "Criptografía",
        "Cryptographie",
        "Kryptografie",
        "暗号技術",
        "密码学",
        "التشفير"
    ],
    "Maturity": [
        "परिपक्वता",
        "Madurez",
        "Maturité",
        "Reifegrad",
        "成熟度",
        "成熟度",
        "النضج"
    ],
    "Common code examples": [
        "सामान्य कोड उदाहरण",
        "Ejemplos de códigos habituales",
        "Exemples de codes courants",
        "Beispiele häufiger Codes",
        "よく使うコードの例",
        "常见状态码示例",
        "أمثلة رموز شائعة"
    ],
    "DELETE without content:": [
        "बिना सामग्री DELETE:",
        "DELETE sin contenido:",
        "DELETE sans contenu :",
        "DELETE ohne Inhalt:",
        "本文なしのDELETE：",
        "无内容的 DELETE：",
        "DELETE بلا محتوى:"
    ]
};
