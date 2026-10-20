import type { TranslationColumns } from "./tool-names";

// Hindi, Spanish, French, German, Japanese, Simplified Chinese, Arabic.
export const TOOL_FAQ_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Does this send my documents to a server?": [
        "क्या मेरे दस्तावेज़ सर्वर को भेजे जाते हैं?",
        "¿Se envían mis documentos a un servidor?",
        "Mes documents sont-ils envoyés à un serveur ?",
        "Werden meine Dokumente an einen Server gesendet?",
        "文書をサーバーに送信しますか？",
        "文档会发送到服务器吗？",
        "هل تُرسل مستنداتي إلى خادم؟"
    ],
    "How is this different from keyword search?": [
        "यह कीवर्ड खोज से कैसे अलग है?",
        "¿En qué se diferencia de buscar palabras clave?",
        "Quelle différence avec la recherche par mots-clés ?",
        "Wie unterscheidet sich dies von Stichwortsuche?",
        "キーワード検索との違いは何ですか？",
        "与关键词搜索有什么区别？",
        "كيف يختلف عن بحث الكلمات؟"
    ],
    "Semantic search compares sentence embedding vectors; keyword comparison measures literal term overlap. Similar meaning can match without shared words, but relevance is not guaranteed.": [
        "अर्थगत खोज वाक्य एम्बेडिंग वेक्टर तुलना करती है; कीवर्ड खोज समान शब्द देखती है। बिना समान शब्द के अर्थ मिल सकता है, पर प्रासंगिकता निश्चित नहीं।",
        "La búsqueda semántica compara vectores de frases; la de palabras mide coincidencias literales. Puede coincidir el sentido sin palabras compartidas, sin garantía de relevancia.",
        "La recherche sémantique compare des vecteurs de phrases ; les mots-clés mesurent les termes identiques. Un sens proche peut correspondre sans mots communs, sans garantie de pertinence.",
        "Semantische Suche vergleicht Satzeinbettungen, Stichwortsuche wörtliche Überschneidung. Ähnliche Bedeutung kann ohne gemeinsame Wörter passen, Relevanz ist nicht garantiert.",
        "意味検索は文章の埋め込みベクトル、キーワード比較は語の完全一致を比較します。共通語なしでも意味が近い場合に一致しますが、関連性は保証しません。",
        "语义搜索比较句子嵌入向量，关键词比较衡量字面重合。没有相同词也可能匹配相近含义，但不保证相关性。",
        "يقارن البحث الدلالي متجهات الجمل، وتقيس الكلمات التطابق الحرفي. قد يتطابق المعنى دون كلمات مشتركة لكن الصلة غير مضمونة."
    ],
    "Why does the model take a moment to load?": [
        "मॉडल लोड होने में समय क्यों लगता है?",
        "¿Por qué tarda en cargar el modelo?",
        "Pourquoi le chargement prend-il du temps ?",
        "Warum dauert das Laden des Modells etwas?",
        "モデルの読み込みに時間がかかるのはなぜですか？",
        "模型加载为什么需要时间？",
        "لماذا يستغرق تحميل النموذج وقتًا؟"
    ],
    "How often is this pricing updated?": [
        "कीमतें कितनी बार अपडेट होती हैं?",
        "¿Con qué frecuencia se actualizan los precios?",
        "À quelle fréquence les tarifs sont-ils mis à jour ?",
        "Wie oft werden die Preise aktualisiert?",
        "料金はどのくらいの頻度で更新されますか？",
        "价格多久更新一次？",
        "كم مرة تُحدّث الأسعار؟"
    ],
    "The table shows review dates. Prices, processing tiers and limits can change; open the linked provider pricing before budgeting.": [
        "तालिका समीक्षा तिथियाँ दिखाती है। कीमत, प्रोसेसिंग टियर और सीमा बदल सकती हैं; बजट से पहले प्रदाता लिंक खोलें।",
        "La tabla muestra fechas de revisión. Precios, niveles y límites pueden cambiar; consulta el enlace del proveedor antes de presupuestar.",
        "Le tableau indique les dates de vérification. Tarifs, niveaux et limites peuvent changer ; consultez le fournisseur avant de budgéter.",
        "Die Tabelle zeigt Prüfdaten. Preise, Verarbeitungsstufen und Grenzen können sich ändern; Anbieterpreislink vor Budgetplanung öffnen.",
        "表に確認日を表示します。料金、処理階層、制限は変わるため、予算計画前にリンク先の提供元料金を確認してください。",
        "表格显示审核日期。价格、处理层级和限制可能变化，预算前请打开提供商定价链接。",
        "يعرض الجدول تواريخ المراجعة. قد تتغير الأسعار والفئات والحدود؛ افتح تسعير المزوّد قبل إعداد الميزانية."
    ],
    "What does \"cached input\" pricing mean?": [
        "\"cached input\" कीमत क्या है?",
        "¿Qué significa el precio de «entrada en caché»?",
        "Que signifie le tarif « entrée en cache » ?",
        "Was bedeutet der Preis für „gecachte Eingabe“?",
        "「キャッシュ入力」料金とは何ですか？",
        "“缓存输入”价格是什么意思？",
        "ما معنى سعر «الإدخال المؤقت»؟"
    ],
    "A provider may discount eligible reused prompt tokens. Cache creation, retention, minimum sizes and rates vary by provider and model.": [
        "प्रदाता योग्य दोबारा इस्तेमाल टोकनों पर छूट दे सकता है। कैश बनाना, अवधि, न्यूनतम आकार और दर मॉडल/प्रदाता पर निर्भर हैं।",
        "El proveedor puede descontar tokens reutilizados elegibles. Creación, retención, mínimos y tarifas dependen del proveedor y modelo.",
        "Le fournisseur peut réduire le prix de tokens réutilisés éligibles. Création, rétention, tailles minimales et tarifs varient.",
        "Anbieter können berechtigte wiederverwendete Prompttokens rabattieren. Erstellung, Dauer, Mindestgröße und Preise variieren je Modell und Anbieter.",
        "再利用可能な入力トークンが割引される場合があります。キャッシュ作成、保持期間、最小サイズ、料金はモデルや提供元ごとに異なります。",
        "提供商可能对符合条件的重复提示令牌打折。缓存创建、保留时间、最小大小和费用因提供商及模型而异。",
        "قد يخصم المزوّد الرموز المعاد استخدامها والمؤهلة. تختلف كلفة الإنشاء والاحتفاظ والحدود الدنيا والأسعار حسب المزوّد والنموذج."
    ],
    "Why do some models show a higher price above a certain context length?": [
        "कुछ मॉडल लंबा कॉन्टेक्स्ट होने पर महँगे क्यों हैं?",
        "¿Por qué algunos modelos cuestan más con contextos largos?",
        "Pourquoi certains modèles coûtent-ils plus cher avec un contexte long ?",
        "Warum kosten manche Modelle bei längerem Kontext mehr?",
        "コンテキストが長いと料金が高いモデルがあるのはなぜですか？",
        "为什么有些模型在长上下文下更贵？",
        "لماذا ترتفع أسعار بعض النماذج مع السياق الطويل؟"
    ],
    "Some providers apply different rates or limits to long requests. Read the model note and provider pricing; the listed input rate alone may not cover your request.": [
        "लंबे अनुरोधों पर अलग दर या सीमा हो सकती है। मॉडल नोट और प्रदाता कीमत पढ़ें; सूचीबद्ध इनपुट दर अकेली पर्याप्त नहीं हो सकती।",
        "Algunos proveedores cambian tarifas o límites para solicitudes largas. Lee la nota y precios: la tarifa de entrada por sí sola puede no cubrir tu caso.",
        "Certains fournisseurs changent tarifs ou limites pour les longues requêtes. Lisez la note et les tarifs ; le taux d’entrée seul peut être insuffisant.",
        "Für lange Anfragen gelten teils andere Preise oder Grenzen. Modellhinweis und Anbieterpreise lesen; der Eingabepreis allein deckt nicht jeden Fall ab.",
        "長いリクエストには別の料金や制限が適用される場合があります。モデル注記と公式料金を確認してください。表示入力料金だけでは算定できないことがあります。",
        "某些提供商对长请求采用不同费用或限制。请阅读模型说明及提供商定价，单独列出的输入费率可能不适用。",
        "تطبق بعض الجهات أسعارًا أو حدودًا مختلفة للطلبات الطويلة. اقرأ ملاحظة النموذج والتسعير؛ قد لا يكفي سعر الإدخال المعروض وحده."
    ],
    "What is Model Context Protocol (MCP)?": [
        "Model Context Protocol (MCP) क्या है?",
        "¿Qué es Model Context Protocol (MCP)?",
        "Qu’est-ce que Model Context Protocol (MCP) ?",
        "Was ist Model Context Protocol (MCP)?",
        "Model Context Protocol（MCP）とは何ですか？",
        "什么是 Model Context Protocol（MCP）？",
        "ما هو Model Context Protocol ‏(MCP)؟"
    ],
    "MCP lets clients discover and invoke tools and resources through a versioned protocol. This inspector covers selected JSONRPC operations and transports, not every protocol capability.": [
        "MCP संस्करणित प्रोटोकॉल से टूल/संसाधन खोजने और चलाने देता है। यह निरीक्षक चुनिंदा JSONRPC क्रियाएँ और ट्रांसपोर्ट कवर करता है, सभी क्षमताएँ नहीं।",
        "MCP permite descubrir e invocar herramientas y recursos mediante un protocolo versionado. El inspector cubre operaciones JSONRPC y transportes seleccionados, no todas las capacidades.",
        "MCP permet de découvrir et appeler outils et ressources via un protocole versionné. L’inspecteur couvre des opérations JSONRPC et transports sélectionnés, pas tout le protocole.",
        "MCP ermöglicht Auffinden und Aufrufen von Tools und Ressourcen per versioniertem Protokoll. Der Inspektor deckt ausgewählte JSONRPC-Operationen und Transporte ab.",
        "MCP はバージョン付きプロトコルでツールやリソースを発見・呼び出せます。この検査ツールは一部の JSONRPC 操作と通信方式を対象とし、全機能は網羅しません。",
        "MCP 通过带版本的协议发现和调用工具及资源。此检查器仅覆盖选定 JSONRPC 操作及传输方式，不包含全部协议能力。",
        "يتيح MCP اكتشاف الأدوات والموارد واستدعاءها عبر بروتوكول بإصدارات. يغطي الفاحص عمليات JSONRPC ووسائل نقل محددة لا جميع القدرات."
    ],
    "What transports does the MCP Inspector support?": [
        "MCP निरीक्षक कौन से ट्रांसपोर्ट चलाता है?",
        "¿Qué transportes admite el inspector MCP?",
        "Quels transports l’inspecteur MCP prend-il en charge ?",
        "Welche Transporte unterstützt der MCP-Inspektor?",
        "MCP 検査ツールはどの通信方式に対応しますか？",
        "MCP 检查器支持哪些传输方式？",
        "ما وسائل النقل التي يدعمها فاحص MCP؟"
    ],
    "Streamable HTTP and legacy SSE are supported. Modes include direct with proxy fallback, direct-strict without fallback, managed server proxy, and a user-run MCP proxy tunnel.": [
        "Streamable HTTP और पुराना SSE समर्थित हैं। मोड: प्रॉक्सी फ़ॉलबैक वाला direct, बिना फ़ॉलबैक direct-strict, प्रबंधित सर्वर प्रॉक्सी, और उपयोगकर्ता MCP प्रॉक्सी टनल।",
        "Admite Streamable HTTP y SSE heredado. Modos: directo con respaldo proxy, direct-strict sin respaldo, proxy gestionado y túnel MCP propio.",
        "Streamable HTTP et SSE ancien sont pris en charge. Modes : direct avec repli proxy, direct-strict sans repli, proxy géré et tunnel MCP utilisateur.",
        "Streamable HTTP und älteres SSE. Modi: direkt mit Proxy-Fallback, direct-strict ohne Fallback, verwalteter Serverproxy und eigener MCP-Proxytunnel.",
        "Streamable HTTP と旧 SSE に対応します。直接接続＋プロキシ代替、代替なし direct-strict、管理サーバープロキシ、ユーザー MCP トンネルを選べます。",
        "支持 Streamable HTTP 和旧 SSE。模式有带代理回退的直接连接、无回退的 direct-strict、托管服务器代理和用户运行的 MCP 代理隧道。",
        "يدعم Streamable HTTP وSSE القديم. الأنماط: مباشر مع بديل وكيل، وdirect-strict دون بديل، ووكيل خادم مُدار ونفق MCP يشغّله المستخدم."
    ],
    "How does session tracking work?": [
        "सत्र ट्रैकिंग कैसे होती है?",
        "¿Cómo funciona el seguimiento de sesión?",
        "Comment le suivi des sessions fonctionne-t-il ?",
        "Wie funktioniert die Sitzungsverfolgung?",
        "セッション追跡はどのように動作しますか？",
        "会话跟踪如何工作？",
        "كيف يعمل تتبع الجلسة؟"
    ],
    "MCP 2026-07-28 requests carry version, client identity and capabilities independently and do not use initialization sessions. Selected older versions use initialize and echo a server-provided Mcp-Session-Id on subsequent requests.": [
        "MCP 2026-07-28 अनुरोध अलग-अलग संस्करण, क्लाइंट पहचान और क्षमताएँ देते हैं, प्रारंभिक सत्र नहीं। चुने पुराने संस्करण initialize और बाद में सर्वर का Mcp-Session-Id भेजते हैं।",
        "Las solicitudes MCP 2026-07-28 incluyen versión, identidad y capacidades sin sesión de inicialización. Versiones anteriores usan initialize y repiten Mcp-Session-Id del servidor.",
        "MCP 2026-07-28 transmet version, identité et capacités sans session d’initialisation. Les anciennes versions sélectionnées utilisent initialize puis renvoient Mcp-Session-Id.",
        "MCP 2026-07-28 übermittelt Version, Identität und Fähigkeiten ohne Initialisierungssitzung. Ausgewählte ältere Versionen nutzen initialize und danach Mcp-Session-Id.",
        "MCP 2026-07-28 は各要求にバージョン、クライアント識別、能力を含め、初期化セッションを使用しません。選択した旧版は initialize と後続要求の Mcp-Session-Id を使用します。",
        "MCP 2026-07-28 请求独立携带版本、客户端身份和能力，不使用初始化会话。选定旧版本使用 initialize，并在后续请求回传服务器 Mcp-Session-Id。",
        "تحمل طلبات MCP 2026-07-28 الإصدار والهوية والقدرات دون جلسة تهيئة. تستخدم إصدارات أقدم محددة initialize ثم تعيد Mcp-Session-Id المقدم من الخادم."
    ],
    "What is the A2A (Agent-to-Agent) protocol?": [
        "A2A (Agent-to-Agent) प्रोटोकॉल क्या है?",
        "¿Qué es el protocolo A2A (Agent-to-Agent)?",
        "Qu’est-ce que le protocole A2A (Agent-to-Agent) ?",
        "Was ist das A2A-Protokoll (Agent-to-Agent)?",
        "A2A（Agent-to-Agent）とは何ですか？",
        "什么是 A2A（Agent-to-Agent）协议？",
        "ما بروتوكول A2A ‏(Agent-to-Agent)؟"
    ],
    "A2A describes agent discovery and communication. This inspector supports selected 1.0 and 0.3 JSONRPC operations and version-specific agent cards.": [
        "A2A एजेंट खोज और संचार बताता है। निरीक्षक चुनिंदा 1.0/0.3 JSONRPC क्रियाएँ और संस्करणानुसार कार्ड चलाता है।",
        "A2A describe descubrimiento y comunicación de agentes. El inspector admite operaciones JSONRPC 1.0/0.3 y tarjetas específicas seleccionadas.",
        "A2A décrit découverte et communication entre agents. L’inspecteur couvre certaines opérations JSONRPC 1.0/0.3 et leurs cartes.",
        "A2A beschreibt Agentensuche und -kommunikation. Der Inspektor unterstützt ausgewählte JSONRPC-Operationen 1.0/0.3 und passende Karten.",
        "A2A はエージェント発見と通信を定義します。検査ツールは一部の 1.0/0.3 JSONRPC 操作と各版のカードに対応します。",
        "A2A 描述智能体发现及通信。此检查器支持选定的 1.0/0.3 JSONRPC 操作和对应版本的智能体卡片。",
        "يصف A2A اكتشاف الوكلاء وتواصلهم. يدعم الفاحص عمليات JSONRPC محددة من 1.0 و0.3 وبطاقات الإصدار الملائمة."
    ],
    "What does the compliance checker verify?": [
        "अनुपालन जाँच क्या सत्यापित करती है?",
        "¿Qué verifica el comprobador de conformidad?",
        "Que vérifie le contrôle de conformité ?",
        "Was prüft die Konformitätsprüfung?",
        "準拠チェックは何を確認しますか？",
        "一致性检查会验证什么？",
        "ماذا يفحص مدقق التوافق؟"
    ],
    "The inspector checks selected fields and JSONRPC interfaces for the chosen version. It is a partial structural review, not a complete conformance test.": [
        "निरीक्षक चुने संस्करण के कुछ फ़ील्ड और JSONRPC इंटरफ़ेस जाँचता है। यह आंशिक संरचना जाँच है, पूर्ण अनुपालन परीक्षण नहीं।",
        "Revisa campos e interfaces JSONRPC seleccionados de la versión elegida. Es revisión estructural parcial, no una prueba completa de conformidad.",
        "Il vérifie certains champs et interfaces JSONRPC de la version choisie. Contrôle structurel partiel, pas un test de conformité complet.",
        "Prüft ausgewählte Felder und JSONRPC-Schnittstellen der gewählten Version. Teilweise Strukturprüfung, kein vollständiger Konformitätstest.",
        "選択版の一部の項目と JSONRPC インターフェースを確認します。構造の部分的な確認で、完全な準拠試験ではありません。",
        "检查所选版本的部分字段和 JSONRPC 接口，只是部分结构审查，不是完整一致性测试。",
        "يفحص حقولًا وواجهات JSONRPC محددة للإصدار المختار. مراجعة بنيوية جزئية وليست اختبار توافق كاملًا."
    ],
    "Is the token count exact or an estimate?": [
        "टोकन गणना सटीक है या अनुमान?",
        "¿El recuento es exacto o estimado?",
        "Le comptage est-il exact ou estimé ?",
        "Ist die Tokenzahl exakt oder geschätzt?",
        "トークン数は正確ですか、推定ですか？",
        "令牌计数是准确值还是估算？",
        "هل عدّ الرموز دقيق أم تقديري؟"
    ],
    "Does my text get sent anywhere?": [
        "क्या मेरा टेक्स्ट कहीं भेजा जाता है?",
        "¿Se envía mi texto a algún sitio?",
        "Mon texte est-il envoyé quelque part ?",
        "Wird mein Text irgendwohin gesendet?",
        "テキストはどこかに送信されますか？",
        "文本会发送到其他地方吗？",
        "هل يُرسل نصي إلى أي جهة؟"
    ],
    "Local counts stay on the device. Optional provider counting sends text and the in-memory key directly to the selected provider only after you choose Send.": [
        "स्थानीय गणना डिवाइस पर रहती है। प्रदाता विकल्प केवल भेजें चुनने पर टेक्स्ट और मेमोरी कुंजी सीधे प्रदाता को देता है।",
        "El recuento local queda en el dispositivo. Solo al elegir Enviar se manda texto y clave en memoria directamente al proveedor.",
        "Le comptage local reste sur l’appareil. L’option fournisseur n’envoie texte et clé en mémoire qu’après votre choix d’envoi.",
        "Lokale Zählung bleibt auf dem Gerät. Anbieterzählung sendet Text und Speicherschlüssel erst nach Senden direkt an den Anbieter.",
        "ローカル計数は端末内です。提供元計数は送信を選択した場合のみ、テキストとメモリ上のキーを提供元に直接送ります。",
        "本地计数留在设备上。只有选择发送后，提供商计数才将文本和内存密钥直接发给所选提供商。",
        "يبقى العدّ المحلي على الجهاز. لا يُرسل النص والمفتاح من الذاكرة مباشرة للمزوّد إلا بعد اختيار إرسال."
    ],
    "Why does the same text have a different token count for different models?": [
        "एक ही टेक्स्ट के टोकन मॉडल के अनुसार क्यों बदलते हैं?",
        "¿Por qué cambia el número de tokens según el modelo?",
        "Pourquoi le nombre de tokens varie-t-il selon le modèle ?",
        "Warum hat derselbe Text je Modell andere Tokenzahlen?",
        "同じテキストでもモデルによりトークン数が違うのはなぜですか？",
        "为什么同一文本在不同模型的令牌数不同？",
        "لماذا يختلف عدّ النص نفسه بين النماذج؟"
    ],
    "Encodings use different vocabularies and token boundaries. Some choices here use a character heuristic instead of the model tokenizer; local counts do not verify model mappings or API overhead.": [
        "एन्कोडिंग की शब्दावली और सीमाएँ अलग होती हैं। यहाँ कुछ विकल्प वास्तविक टोकनाइज़र की जगह वर्ण अनुमान हैं; स्थानीय गणना मॉडल-मैपिंग या API ओवरहेड सत्यापित नहीं करती।",
        "Las codificaciones tienen vocabularios y límites distintos. Algunas opciones usan heurística de caracteres; el recuento local no verifica el modelo ni la sobrecarga API.",
        "Les encodages ont des vocabulaires différents. Certains choix sont des heuristiques par caractères ; le comptage local ne garantit ni modèle ni surcoût API.",
        "Kodierungen haben andere Vokabulare und Tokengrenzen. Manche Auswahl nutzt Zeichenschätzungen; lokale Zählung bestätigt weder Modellzuordnung noch API-Overhead.",
        "符号化ごとに語彙と区切りが異なります。一部の選択肢は実モデルの分詞器ではなく文字数推定です。ローカル計数はモデル対応や API 付加分を保証しません。",
        "编码使用不同词表和边界。部分选项采用字符估算，而非模型分词器；本地计数不验证模型映射或 API 开销。",
        "تختلف المفردات وحدود الرموز بين الترميزات. بعض الخيارات تقديرات أحرف بدل محلل النموذج؛ لا يثبت العدّ المحلي المطابقة أو كلفة API الإضافية."
    ],
    "Does this tool upload my dataset anywhere?": [
        "क्या यह मेरा डेटा अपलोड करता है?",
        "¿Se sube mi dataset a algún sitio?",
        "Cet outil envoie-t-il mes données ?",
        "Lädt dieses Tool meinen Datensatz hoch?",
        "データセットをアップロードしますか？",
        "此工具会上传数据集吗？",
        "هل ترفع الأداة بياناتي إلى أي جهة؟"
    ],
    "Which chat checks do the presets perform?": [
        "प्रीसेट कौन सी चैट जाँच करते हैं?",
        "¿Qué comprueban los presets de chat?",
        "Quels contrôles les profils de chat effectuent-ils ?",
        "Welche Chatprüfungen führen die Profile durch?",
        "プリセットはどのチャット検証を行いますか？",
        "聊天预设执行哪些检查？",
        "ما فحوص المحادثة التي تجريها الإعدادات؟"
    ],
    "Why does a line fail even though the JSON is valid?": [
        "वैध JSON होने पर भी पंक्ति क्यों विफल है?",
        "¿Por qué falla una línea con JSON válido?",
        "Pourquoi une ligne échoue-t-elle avec un JSON valide ?",
        "Warum scheitert eine Zeile trotz gültigem JSON?",
        "JSON が有効でも行が失敗するのはなぜですか？",
        "为什么 JSON 有效但该行仍未通过？",
        "لماذا يفشل سطر رغم صحة JSON؟"
    ],
    "What is an A2A agent card?": [
        "A2A एजेंट कार्ड क्या है?",
        "¿Qué es una tarjeta de agente A2A?",
        "Qu’est-ce qu’une carte d’agent A2A ?",
        "Was ist eine A2A-Agentenkarte?",
        "A2A エージェントカードとは何ですか？",
        "什么是 A2A 智能体卡片？",
        "ما بطاقة وكيل A2A؟"
    ],
    "What is the MCP server config used for?": [
        "MCP सर्वर कॉन्फ़िग का उपयोग क्या है?",
        "¿Para qué sirve la configuración MCP?",
        "À quoi sert la configuration du serveur MCP ?",
        "Wozu dient die MCP-Serverkonfiguration?",
        "MCP サーバー設定は何に使いますか？",
        "MCP 服务器配置有什么用途？",
        "فيمَ يُستخدم إعداد خادم MCP؟"
    ],
    "A client configuration lists MCP server commands or URLs. Argument parsing and HTTP configuration vary by client; this generator uses a JSON string array to preserve argument spaces.": [
        "क्लाइंट कॉन्फ़िग में MCP कमांड या URL होते हैं। तर्क/HTTP कॉन्फ़िग क्लाइंट के अनुसार अलग हैं; यह जनरेटर रिक्तियाँ बचाने के लिए JSON स्ट्रिंग ऐरे लेता है।",
        "La configuración enumera comandos o URL MCP. Los argumentos y HTTP varían por cliente; el generador usa un array JSON para conservar espacios.",
        "La configuration liste commandes ou URL MCP. Arguments et HTTP dépendent du client ; le générateur utilise un tableau JSON pour conserver les espaces.",
        "Konfiguration listet MCP-Befehle oder URLs. Argumente und HTTP variieren je Client; JSON-Zeichenfolgenarrays erhalten Leerzeichen.",
        "クライアント設定に MCP のコマンドや URL を記載します。引数や HTTP 設定はクライアント次第です。ここでは空白を保持する JSON 文字列配列を使用します。",
        "客户端配置列出 MCP 命令或 URL。参数和 HTTP 设置因客户端而异；此生成器使用 JSON 字符串数组保留空格。",
        "يسرد إعداد العميل أوامر MCP أو عناوينه. تختلف معالجة الوسائط وHTTP حسب العميل؛ يستخدم المولد مصفوفة نصوص JSON لحفظ المسافات."
    ],
    "Can I test the generated manifest immediately?": [
        "क्या बना मेनिफ़ेस्ट तुरंत जाँच सकता हूँ?",
        "¿Puedo probar el manifiesto inmediatamente?",
        "Puis-je tester le manifeste immédiatement ?",
        "Kann ich das Manifest sofort testen?",
        "生成したマニフェストをすぐ試せますか？",
        "可以立即测试生成的清单吗？",
        "هل أستطيع اختبار البيان الناتج فورًا؟"
    ],
    "What is the Pomodoro technique?": [
        "पोमोडोरो तकनीक क्या है?",
        "¿Qué es la técnica Pomodoro?",
        "Qu’est-ce que la technique Pomodoro ?",
        "Was ist die Pomodoro-Technik?",
        "ポモドーロ・テクニックとは何ですか？",
        "什么是番茄工作法？",
        "ما تقنية بومودورو؟"
    ],
    "A common routine alternates 25 minutes of focused work with 5-minute breaks, then takes a longer break after several cycles. This timer provides durations; it does not automatically run that cycle.": [
        "आम तरीका 25 मिनट काम और 5 मिनट विराम है, कुछ चक्रों बाद लंबा विराम। यह टाइमर अवधि देता है, पूरा चक्र अपने आप नहीं चलाता।",
        "Una rutina común alterna 25 minutos de trabajo y 5 de descanso, con pausas largas tras varios ciclos. Este temporizador no automatiza el ciclo.",
        "Une routine alterne 25 minutes de travail et 5 de pause, puis une pause longue après plusieurs cycles. Le minuteur n’automatise pas ce cycle.",
        "Üblich sind 25 Minuten Arbeit und 5 Minuten Pause, später eine längere Pause. Dieser Timer bietet Dauern, führt aber keinen automatischen Zyklus aus.",
        "一般的には25分の集中と5分の休憩を繰り返し、数回後に長い休憩を入れます。このタイマーは時間設定用で、自動サイクル実行はしません。",
        "常见方法交替进行 25 分钟专注与 5 分钟休息，数轮后长休息。此计时器提供时长，不自动执行该循环。",
        "تتناوب طريقة شائعة بين 25 دقيقة عمل و5 دقائق راحة ثم راحة أطول بعد دورات. يوفّر المؤقت المدد ولا ينفذ الدورة تلقائيًا."
    ],
    "Does the timer play a sound when it finishes?": [
        "समाप्ति पर टाइमर आवाज़ करता है?",
        "¿Suena al terminar el temporizador?",
        "Le minuteur émet-il un son à la fin ?",
        "Spielt der Timer am Ende einen Ton ab?",
        "タイマー終了時に音が鳴りますか？",
        "计时结束会发声吗？",
        "هل يصدر المؤقت صوتًا عند الانتهاء؟"
    ],
    "Is the coin flip truly random?": [
        "क्या सिक्का वास्तव में यादृच्छिक है?",
        "¿La moneda es realmente aleatoria?",
        "Le lancer est-il vraiment aléatoire ?",
        "Ist der Münzwurf wirklich zufällig?",
        "コイントスは本当にランダムですか？",
        "抛硬币是真随机吗？",
        "هل رمي العملة عشوائي حقًا؟"
    ],
    "Each flip uses Math.random() with a heads threshold of 0.5. This is pseudorandom entertainment, not cryptographic randomness or a guarantee of balanced results in a short run.": [
        "हर उछाल Math.random() और 0.5 हेड सीमा लेता है। यह मनोरंजन का छद्मयादृच्छिक विकल्प है, क्रिप्टोग्राफ़िक सुरक्षा या कम उछालों में बराबरी की गारंटी नहीं।",
        "Usa Math.random() con umbral 0.5 para cara. Es entretenimiento pseudoaleatorio, sin seguridad criptográfica ni garantía de equilibrio en pocas tiradas.",
        "Chaque lancer utilise Math.random() et un seuil de 0.5. Divertissement pseudoaléatoire, sans sécurité cryptographique ni équilibre garanti à court terme.",
        "Jeder Wurf nutzt Math.random() mit Kopfgrenze 0.5. Pseudozufällige Unterhaltung, keine kryptografische Sicherheit oder garantierte Ausgeglichenheit weniger Würfe.",
        "Math.random() を使い、0.5 を表の閾値にします。娯楽用の疑似乱数で、暗号学的乱数や少数回での均等な結果を保証しません。",
        "每次使用 Math.random() 并以 0.5 为正面阈值。这是娱乐性伪随机，不是密码学随机，也不保证短期结果均衡。",
        "تستخدم كل رمية Math.random() بعتبة 0.5 للوجه. ترفيه شبه عشوائي، لا عشوائية تشفيرية ولا ضمان لتوازن النتائج في رميات قليلة."
    ],
    "Which dice types are supported?": [
        "कौन से पासे समर्थित हैं?",
        "¿Qué tipos de dados admite?",
        "Quels types de dés sont pris en charge ?",
        "Welche Würfeltypen werden unterstützt?",
        "どの種類のサイコロに対応しますか？",
        "支持哪些骰子类型？",
        "ما أنواع النرد المدعومة؟"
    ],
    "D4, D6, D8, D10, D12, D20 and D100 are supported, with multiple dice, individual results and a total.": [
        "D4, D6, D8, D10, D12, D20 और D100 समर्थित हैं; कई पासे, अलग परिणाम और योग मिलते हैं।",
        "Admite D4, D6, D8, D10, D12, D20 y D100, varios dados, resultados individuales y total.",
        "D4, D6, D8, D10, D12, D20 et D100, avec plusieurs dés, résultats individuels et total.",
        "D4, D6, D8, D10, D12, D20 und D100, mehrere Würfel, Einzelergebnisse und Summe.",
        "D4、D6、D8、D10、D12、D20、D100 に対応し、複数個の個別結果と合計を表示します。",
        "支持 D4、D6、D8、D10、D12、D20 和 D100，可投多个骰子并显示各项及总和。",
        "يدعم D4 وD6 وD8 وD10 وD12 وD20 وD100 مع عدة نرد ونتائج منفردة ومجموع."
    ],
    "Can I add modifiers to my dice rolls?": [
        "क्या पासे में संशोधक जोड़ सकता हूँ?",
        "¿Puedo añadir modificadores a la tirada?",
        "Puis-je ajouter des modificateurs aux dés ?",
        "Kann ich Würfelmodifikatoren hinzufügen?",
        "出目に修正値を加えられますか？",
        "可以给骰子结果添加修正值吗？",
        "هل أستطيع إضافة معدّلات لرمي النرد؟"
    ],
    "A positive or negative integer modifier is added once to the roll total, not once per die.": [
        "धनात्मक/ऋणात्मक पूर्णांक संशोधक कुल योग में एक बार जुड़ता है, हर पासे में नहीं।",
        "Un modificador entero positivo o negativo se añade una vez al total, no a cada dado.",
        "Un modificateur entier positif ou négatif s’ajoute une fois au total, pas à chaque dé.",
        "Ein positiver oder negativer ganzzahliger Modifikator wird einmal zur Summe addiert, nicht je Würfel.",
        "正負の整数の修正値を合計に1回加えます。サイコロごとではありません。",
        "正或负整数修正值只添加到总和一次，不是每个骰子一次。",
        "يُضاف معدّل صحيح موجب أو سالب مرة واحدة للمجموع، لا لكل نرد."
    ],
    "How many options can I add to the wheel?": [
        "पहिए में कितने विकल्प जोड़ सकता हूँ?",
        "¿Cuántas opciones puedo añadir a la rueda?",
        "Combien d’options puis-je ajouter à la roue ?",
        "Wie viele Radoptionen kann ich hinzufügen?",
        "ホイールにいくつ選択肢を追加できますか？",
        "转盘可以添加多少选项？",
        "كم خيارًا يمكنني إضافة للعجلة؟"
    ],
    "The wheel accepts 2–12 options. A pseudorandom selection determines the winner; the animation displays that result.": [
        "पहिया 2–12 विकल्प लेता है। छद्मयादृच्छिक चयन विजेता तय करता है; एनीमेशन वही परिणाम दिखाता है।",
        "Admite 2–12 opciones. Una selección pseudoaleatoria decide el ganador; la animación muestra el resultado.",
        "La roue accepte 2–12 options. Une sélection pseudoaléatoire décide du gagnant ; l’animation montre ce résultat.",
        "Das Rad erlaubt 2–12 Optionen. Pseudozufällige Auswahl bestimmt den Gewinner; die Animation zeigt das Ergebnis.",
        "2～12個の選択肢に対応します。疑似乱数で当選を決め、アニメーションでその結果を表示します。",
        "转盘接受 2–12 个选项，伪随机选择决定获胜者，动画展示该结果。",
        "تقبل العجلة 2–12 خيارًا. يحدد اختيار شبه عشوائي الفائز وتعرض الحركة النتيجة."
    ],
    "Are my wheel options saved?": [
        "क्या पहिए के विकल्प सेव होते हैं?",
        "¿Se guardan mis opciones de la rueda?",
        "Les options de la roue sont-elles enregistrées ?",
        "Werden meine Radoptionen gespeichert?",
        "ホイールの選択肢は保存されますか？",
        "转盘选项会保存吗？",
        "هل تُحفظ خيارات العجلة؟"
    ],
    "Options are stored for the active workspace on this device when browser storage is available. Clearing that storage removes them.": [
        "ब्राउज़र स्टोरेज मिलने पर इस डिवाइस के सक्रिय कार्यक्षेत्र में विकल्प सेव होते हैं। स्टोरेज साफ होने पर वे मिटते हैं।",
        "Se guardan para el espacio activo de este dispositivo si hay almacenamiento disponible. Borrarlo elimina las opciones.",
        "Les options sont enregistrées dans l’espace actif sur cet appareil si le stockage est disponible. Le vider les supprime.",
        "Optionen werden bei verfügbarem Browserspeicher im aktiven Arbeitsbereich dieses Geräts gespeichert. Löschen des Speichers entfernt sie.",
        "ブラウザー保存が可能なら、この端末のアクティブなワークスペースに保存します。保存領域を消去すると削除されます。",
        "浏览器存储可用时，选项保存在本设备当前工作区。清除此存储会移除它们。",
        "تُحفظ الخيارات لمساحة العمل النشطة على الجهاز إن توفر تخزين المتصفح. مسح التخزين يزيلها."
    ],
    "How many responses does the Magic 8-Ball have?": [
        "Magic 8-Ball में कितने उत्तर हैं?",
        "¿Cuántas respuestas tiene la bola mágica?",
        "Combien de réponses la boule magique propose-t-elle ?",
        "Wie viele Antworten hat die magische Acht?",
        "マジック8ボールには何種類の回答がありますか？",
        "魔术八号球有多少种回答？",
        "كم إجابة لدى الكرة السحرية؟"
    ],
    "There are 20 entertainment responses: 10 positive, 5 neutral and 5 negative. They do not predict events.": [
        "मनोरंजन के 20 उत्तर हैं: 10 सकारात्मक, 5 तटस्थ और 5 नकारात्मक। ये भविष्यवाणी नहीं हैं।",
        "Hay 20 respuestas de entretenimiento: 10 positivas, 5 neutras y 5 negativas. No predicen eventos.",
        "20 réponses ludiques : 10 positives, 5 neutres et 5 négatives. Elles ne prédisent pas les événements.",
        "20 Unterhaltungsantworten: 10 positiv, 5 neutral und 5 negativ. Sie sagen keine Ereignisse voraus.",
        "娯楽用の20回答（肯定10、中立5、否定5）があります。出来事を予言するものではありません。",
        "有 20 种娱乐回答：10 种肯定、5 种中立、5 种否定，不会预测事件。",
        "توجد 20 إجابة ترفيهية: 10 إيجابية و5 محايدة و5 سلبية. لا تتنبأ بالأحداث."
    ],
    "How is WPM calculated?": [
        "WPM कैसे निकलता है?",
        "¿Cómo se calcula WPM?",
        "Comment le WPM est-il calculé ?",
        "Wie wird WPM berechnet?",
        "WPM はどう計算しますか？",
        "WPM 如何计算？",
        "كيف يُحسب WPM؟"
    ],
    "WPM is rounded from (correct characters ÷ 5) ÷ elapsed minutes. The exercise uses fixed English passages.": [
        "WPM = (सही वर्ण ÷ 5) ÷ बीते मिनट, निकट पूर्णांक में। अभ्यास में तय अंग्रेज़ी अनुच्छेद हैं।",
        "WPM redondea (caracteres correctos ÷ 5) ÷ minutos transcurridos. Usa pasajes fijos en inglés.",
        "WPM arrondit (caractères corrects ÷ 5) ÷ minutes écoulées. Les passages sont fixes et en anglais.",
        "WPM ist gerundet: (korrekte Zeichen ÷ 5) ÷ vergangene Minuten. Übung nutzt feste englische Texte.",
        "WPM は（正しい文字数 ÷ 5）÷ 経過分数を四捨五入します。練習は固定の英文です。",
        "WPM 将（正确字符数 ÷ 5）÷ 已用分钟数取整，练习采用固定英文段落。",
        "يُقرّب WPM من (الأحرف الصحيحة ÷ 5) ÷ الدقائق المنقضية. التدريب يستخدم فقرات إنجليزية ثابتة."
    ],
    "What counts as an error?": [
        "गलती किसे माना जाता है?",
        "¿Qué cuenta como error?",
        "Qu’est-ce qui compte comme erreur ?",
        "Was zählt als Fehler?",
        "何をエラーとして数えますか？",
        "什么算作错误？",
        "ما الذي يُحسب خطأ؟"
    ],
    "A typed character that differs from the target position is an error. Accuracy compares the current text, and WPM uses only correctly matched characters.": [
        "निर्धारित स्थान से अलग टाइप वर्ण गलती है। शुद्धता वर्तमान टेक्स्ट तुलना करती है; WPM केवल सही वर्ण लेता है।",
        "Es error un carácter distinto al objetivo en esa posición. La precisión compara el texto actual y WPM solo cuenta caracteres correctos.",
        "Un caractère différent à sa position est une erreur. La précision compare le texte actuel et WPM ne compte que les caractères corrects.",
        "Ein abweichendes Zeichen an derselben Position ist ein Fehler. Genauigkeit nutzt den aktuellen Text; WPM nur korrekte Zeichen.",
        "目標の同じ位置と異なる文字がエラーです。精度は現在の入力を比較し、WPM は一致する文字だけを使います。",
        "输入字符与目标同一位置不符即为错误。准确率比较当前文本，WPM 只计算正确匹配字符。",
        "الحرف المخالف لموضع الهدف خطأ. تقارن الدقة النص الحالي ويستخدم WPM الأحرف المطابقة فقط."
    ],
    "What is TOON?": [
        "TOON क्या है?",
        "¿Qué es TOON?",
        "Qu’est-ce que TOON ?",
        "Was ist TOON?",
        "TOON とは何ですか？",
        "什么是 TOON？",
        "ما هو TOON؟"
    ],
    "Is TOON lossless from JSON?": [
        "क्या JSON से TOON में डेटा सुरक्षित रहता है?",
        "¿TOON conserva JSON sin pérdidas?",
        "TOON préserve-t-il JSON sans perte ?",
        "Ist TOON aus JSON verlustfrei?",
        "JSON から TOON は可逆ですか？",
        "JSON 转 TOON 是无损的吗？",
        "هل يحوّل TOON بيانات JSON دون فقد؟"
    ],
    "Supported JSON values round-trip, but precision-sensitive numbers must be quoted explicitly. XML mapping is lossy. This implementation is a subset, not a complete TOON validator; older root-array exports have an explicit legacy decode switch.": [
        "समर्थित JSON मान वापस मिलते हैं, पर संवेदनशील संख्याएँ उद्धरण में हों। XML मैपिंग हानिपूर्ण है। यह उपसमूह है, पूर्ण TOON सत्यापक नहीं; पुराने रूट ऐरे के लिए legacy स्विच है।",
        "Los valores admitidos regresan sin cambios; los números sensibles deben ir entre comillas. XML pierde información. Es un subconjunto, no un validador completo; los arrays raíz antiguos tienen un modo heredado.",
        "Les valeurs prises en charge reviennent, mais les nombres sensibles doivent être entre guillemets. XML perd des informations. Sous-ensemble, pas validation complète ; mode ancien pour les anciens tableaux racine.",
        "Unterstützte JSON-Werte lassen sich zurückwandeln; präzisionsempfindliche Zahlen müssen zitiert werden. XML-Abbildung ist verlustbehaftet. Teilumfang, kein vollständiger Validator; alte Wurzelarrays nutzen den Legacy-Schalter.",
        "対応する JSON 値は往復できますが、精度が重要な数値は明示的に文字列化が必要です。XML 変換は非可逆です。完全な TOON 検証器ではなく、旧ルート配列には互換スイッチがあります。",
        "支持的 JSON 值可往返，但精度敏感数值必须显式加引号。XML 映射有损。此实现是子集而非完整 TOON 验证器；旧根数组导出可用旧版解码开关。",
        "تعود قيم JSON المدعومة، لكن الأرقام الحساسة للدقة تحتاج اقتباسًا صريحًا. تحويل XML فاقد. التنفيذ جزء من TOON لا مدقق كامل، وللمصفوفات القديمة مفتاح فكّ قديم."
    ]
};
