import type { TranslationColumns } from "./tool-names";

// Hindi, Spanish, French, German, Japanese, Simplified Chinese, Arabic.
// Authored explanations only: source labels, versions, ISO dates and URLs stay data.
export const REFERENCE_PROVENANCE_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Curated MIME labels and extension hints. application/yaml follows RFC 9512; extensions and registry presence do not validate file contents.": ["चुने हुए MIME लेबल और एक्सटेंशन संकेत। application/yaml RFC 9512 के अनुसार है; एक्सटेंशन और रजिस्ट्री में होना फ़ाइल सामग्री सत्यापित नहीं करते।", "Etiquetas MIME seleccionadas y extensiones indicativas. application/yaml sigue RFC 9512; las extensiones y el registro no validan el contenido.", "Sélection de types MIME et d’extensions indicatives. application/yaml suit RFC 9512 ; ni l’extension ni l’enregistrement ne valident le contenu.", "Kuratierte MIME-Typen und Dateiendungen als Hinweise. application/yaml folgt RFC 9512; Endungen und Registrierung validieren keine Dateiinhalte.", "MIMEタイプと拡張子の参考一覧。application/yamlはRFC 9512に従います。拡張子や登録の有無はファイル内容の検証にはなりません。", "精选 MIME 标签及扩展名提示。application/yaml 遵循 RFC 9512；扩展名及注册状态不能验证文件内容。", "تسميات MIME مختارة وامتدادات إرشادية. يتبع application/yaml المعيار RFC 9512؛ ولا تتحقق الامتدادات أو التسجيل من محتوى الملف."],
    "Opaque sRGB hex pairs, unrounded WCAG 2.2 text and non-text contrast thresholds; no whole-page accessibility or legal compliance claim.": ["अपारदर्शी sRGB HEX रंग-युग्म और बिना राउंड किए WCAG 2.2 पाठ व गैर-पाठ कंट्रास्ट सीमाएँ; पूरे पृष्ठ की सुलभता या कानूनी अनुपालन का दावा नहीं।", "Pares HEX sRGB opacos y umbrales WCAG 2.2 sin redondear para texto y elementos gráficos; sin afirmar accesibilidad ni cumplimiento legal de toda la página.", "Paires HEX sRGB opaques et seuils WCAG 2.2 non arrondis pour texte et graphismes ; aucune garantie d’accessibilité globale ou de conformité juridique.", "Undurchsichtige sRGB-HEX-Paare und ungerundete WCAG-2.2-Grenzwerte für Text und Grafik; keine Aussage zur Barrierefreiheit der gesamten Seite oder rechtlichen Konformität.", "不透明なsRGB HEX色の組み合わせと、丸め前のWCAG 2.2文字・非文字コントラスト基準。ページ全体のアクセシビリティや法令適合を保証しません。", "不透明 sRGB HEX 颜色组合及未四舍五入的 WCAG 2.2 文字和非文字对比度阈值；不声明整页无障碍或法律合规。", "أزواج HEX من sRGB المعتمة وحدود تباين WCAG 2.2 غير المقربة للنص وغيره؛ دون ادعاء إمكانية وصول الصفحة كاملة أو الامتثال القانوني."],
    "HTML numeric references use full Unicode code points, U+FFFD for invalid values and C1 control mappings. Semicolons are required; named decoding supports this tool's listed entity subset.": ["HTML के संख्यात्मक संदर्भ पूरे Unicode कोड पॉइंट, अमान्य मानों के लिए U+FFFD और C1 नियंत्रण मैपिंग उपयोग करते हैं। अर्धविराम आवश्यक है; नाम वाला डिकोडिंग इस टूल में सूचीबद्ध इकाइयों तक सीमित है।", "Las referencias numéricas HTML usan puntos de código Unicode completos, U+FFFD para valores no válidos y correspondencias de controles C1. Se exige punto y coma; la decodificación por nombre se limita al subconjunto listado en esta herramienta.", "Les références numériques HTML utilisent les points de code Unicode complets, U+FFFD pour les valeurs invalides et les correspondances C1. Le point-virgule est obligatoire ; le décodage nommé se limite aux entités listées par cet outil.", "Numerische HTML-Referenzen verwenden vollständige Unicode-Codepunkte, U+FFFD für ungültige Werte und C1-Steuerzeichen-Zuordnungen. Semikolons sind erforderlich; benannte Referenzen sind auf die aufgeführte Teilmenge beschränkt.", "HTML数値文字参照では完全なUnicodeコードポイント、不正な値にはU+FFFD、C1制御文字の対応表を使用します。セミコロンは必須で、名前付き参照のデコードはこのツールに掲載された範囲に限ります。", "HTML 数字字符引用使用完整 Unicode 码点，以 U+FFFD 替换无效值，并应用 C1 控制字符映射。必须使用分号；命名引用解码仅支持此工具列出的实体子集。", "تستخدم مراجع HTML الرقمية نقاط Unicode الكاملة وU+FFFD للقيم غير الصالحة وتعيينات محارف التحكم C1. الفاصلة المنقوطة مطلوبة؛ ويقتصر فك المراجع المسماة على المجموعة المدرجة في هذه الأداة."],
    "Standards, sources and review dates": ["मानक, स्रोत और समीक्षा तिथियाँ", "Normas, fuentes y fechas de revisión", "Normes, sources et dates de vérification", "Standards, Quellen und Prüfdaten", "標準・出典・確認日", "标准、来源与核查日期", "المعايير والمصادر وتواريخ المراجعة"],
    "Reviewed": ["समीक्षित", "Revisado", "Vérifié le", "Geprüft am", "確認日", "核查日期", "تاريخ المراجعة"],
    "Review interval: {days} days.": ["समीक्षा अंतराल: {days} दिन।", "Intervalo de revisión: {days} días.", "Intervalle de vérification : {days} jours.", "Prüfintervall: {days} Tage.", "確認間隔：{days}日。", "核查间隔：{days} 天。", "الفاصل بين المراجعات: {days} يومًا."],
    "HTTP JSON-RPC discovery, tool listing/calls; legacy initialize lifecycle. Not a full conformance suite.": [
        "HTTP JSON-RPC डिस्कवरी, टूल सूची/कॉल; पुराना initialize जीवनचक्र। यह पूर्ण अनुरूपता परीक्षण सूट नहीं है।",
        "Descubrimiento HTTP JSON-RPC, listado y llamadas de herramientas; ciclo initialize heredado. No es una suite completa de conformidad.",
        "Découverte HTTP JSON-RPC, liste et appels d’outils ; cycle initialize historique. Ce n’est pas une suite complète de conformité.",
        "HTTP-JSON-RPC-Erkennung, Werkzeugliste und -aufrufe; älterer initialize-Lebenszyklus. Keine vollständige Konformitätstestsuite.",
        "HTTP JSON-RPCによる検出、ツール一覧と呼び出し、従来のinitializeライフサイクル。完全な適合性テストスイートではありません。",
        "HTTP JSON-RPC 发现、工具列表与调用；旧版 initialize 生命周期。并非完整的合规测试套件。",
        "اكتشاف HTTP JSON-RPC وسرد الأدوات واستدعاؤها؛ دورة initialize القديمة. ليست مجموعة اختبارات مطابقة شاملة."
    ],
    "JSONRPC messaging, task lookup/cancel and stream artifacts. REST, gRPC and push subscriptions are not exercised.": [
        "JSONRPC संदेश, टास्क खोज/रद्द करना और स्ट्रीम आर्टिफ़ैक्ट। REST, gRPC और पुश सब्सक्रिप्शन का परीक्षण नहीं होता।",
        "Mensajería JSONRPC, consulta y cancelación de tareas, y artefactos en streaming. No se prueban REST, gRPC ni suscripciones push.",
        "Messagerie JSONRPC, recherche et annulation des tâches, et artefacts en flux. REST, gRPC et les abonnements push ne sont pas testés.",
        "JSONRPC-Nachrichten, Aufgabenabfrage/-abbruch und Streaming-Artefakte. REST, gRPC und Push-Abonnements werden nicht getestet.",
        "JSONRPCメッセージング、タスク検索・キャンセル、ストリームのアーティファクト。REST、gRPC、プッシュ購読はテストしません。",
        "JSONRPC 消息、任务查询与取消、流式产物。不测试 REST、gRPC 和推送订阅。",
        "رسائل JSONRPC والبحث عن المهام وإلغاؤها ومخرجات البث. لا تُختبر REST أو gRPC أو اشتراكات الدفع."
    ],
    "Swagger 2 / OpenAPI 3.0–3.2 structural and selected request/response schema changes. Composition, callbacks, webhooks, links and new 3.2 streaming semantics require manual review.": [
        "Swagger 2 / OpenAPI 3.0–3.2 की संरचना और चुने हुए अनुरोध/प्रतिक्रिया स्कीमा बदलाव। संयोजन, कॉलबैक, वेबहुक, लिंक और नए 3.2 स्ट्रीमिंग अर्थ की मैन्युअल समीक्षा ज़रूरी है।",
        "Cambios estructurales de Swagger 2 / OpenAPI 3.0–3.2 y cambios seleccionados de esquemas de solicitud y respuesta. La composición, los callbacks, webhooks, enlaces y la nueva semántica de streaming de 3.2 requieren revisión manual.",
        "Changements structurels de Swagger 2 / OpenAPI 3.0–3.2 et certains changements des schémas de requête et de réponse. Composition, callbacks, webhooks, liens et nouvelle sémantique de streaming 3.2 nécessitent une vérification manuelle.",
        "Strukturelle Änderungen von Swagger 2 / OpenAPI 3.0–3.2 und ausgewählte Änderungen an Anfrage-/Antwortschemata. Komposition, Callbacks, Webhooks, Links und die neue Streaming-Semantik von 3.2 erfordern manuelle Prüfung.",
        "Swagger 2 / OpenAPI 3.0–3.2の構造と、一部のリクエスト・レスポンススキーマの変更。合成、コールバック、Webhook、リンク、3.2の新しいストリーミングの意味規則は手動確認が必要です。",
        "Swagger 2 / OpenAPI 3.0–3.2 的结构变化及部分请求与响应模式变化。组合、回调、Webhook、链接和 3.2 新增的流式语义需手动核查。",
        "التغييرات البنيوية في Swagger 2 / OpenAPI 3.0–3.2 وتغييرات مختارة في مخططات الطلب والاستجابة. يتطلب التركيب وعمليات رد النداء وwebhooks والروابط ودلالات البث الجديدة في 3.2 مراجعة يدوية."
    ],
    "Ajv validation with formats and local references. Unknown keywords, remote references and unsupported dialects fail explicitly.": [
        "फ़ॉर्मैट और स्थानीय संदर्भों के साथ Ajv सत्यापन। अज्ञात कीवर्ड, दूरस्थ संदर्भ और असमर्थित डाइलेक्ट स्पष्ट त्रुटि देते हैं।",
        "Validación Ajv con formatos y referencias locales. Las palabras clave desconocidas, referencias remotas y dialectos no admitidos producen errores explícitos.",
        "Validation Ajv avec formats et références locales. Les mots-clés inconnus, références distantes et dialectes non pris en charge produisent des erreurs explicites.",
        "Ajv-Validierung mit Formaten und lokalen Verweisen. Unbekannte Schlüsselwörter, entfernte Verweise und nicht unterstützte Dialekte führen zu ausdrücklichen Fehlern.",
        "形式とローカル参照に対応したAjv検証。不明なキーワード、リモート参照、未対応の方言は明示的なエラーになります。",
        "使用 Ajv 验证格式及本地引用。未知关键字、远程引用和不支持的方言会明确报错。",
        "تحقق Ajv مع التنسيقات والمراجع المحلية. تؤدي الكلمات المفتاحية غير المعروفة والمراجع البعيدة واللهجات غير المدعومة إلى أخطاء صريحة."
    ],
    "Authorization Code + PKCE S256, exact redirect matching, no password grant. Metadata checks do not validate an authorization server.": [
        "Authorization Code + PKCE S256, रीडायरेक्ट का सटीक मिलान, पासवर्ड ग्रांट नहीं। मेटाडेटा जाँच प्राधिकरण सर्वर को प्रमाणित नहीं करती।",
        "Authorization Code + PKCE S256, coincidencia exacta de redirección y sin concesión por contraseña. Comprobar metadatos no valida un servidor de autorización.",
        "Authorization Code + PKCE S256, correspondance exacte des redirections, sans flux par mot de passe. Les contrôles de métadonnées ne valident pas un serveur d’autorisation.",
        "Authorization Code + PKCE S256, exakter Redirect-Abgleich, kein Password Grant. Metadatenprüfungen validieren keinen Autorisierungsserver.",
        "Authorization Code + PKCE S256、リダイレクトの完全一致、パスワードグラントなし。メタデータの確認は認可サーバーの検証にはなりません。",
        "Authorization Code + PKCE S256，精确匹配重定向，不使用密码授权。元数据检查不能验证授权服务器。",
        "Authorization Code + PKCE S256 ومطابقة دقيقة لإعادة التوجيه دون منح بكلمة مرور. فحوص البيانات الوصفية لا تتحقق من صحة خادم التفويض."
    ],
    "Decoding does not verify authenticity. Verification must constrain algorithms, keys, issuer, audience, token purpose and time claims.": [
        "डिकोडिंग प्रामाणिकता की जाँच नहीं करती। सत्यापन में एल्गोरिदम, कुंजियाँ, जारीकर्ता, ऑडियंस, टोकन का उद्देश्य और समय संबंधी क्लेम सीमित करने चाहिए।",
        "Decodificar no verifica la autenticidad. La verificación debe limitar algoritmos, claves, emisor, audiencia, propósito del token y declaraciones temporales.",
        "Le décodage ne vérifie pas l’authenticité. La vérification doit encadrer les algorithmes, clés, émetteur, audience, finalité du jeton et attributs temporels.",
        "Dekodieren prüft keine Echtheit. Die Verifikation muss Algorithmen, Schlüssel, Aussteller, Zielgruppe, Tokenzweck und Zeitangaben einschränken.",
        "デコードでは真正性を検証できません。検証時はアルゴリズム、鍵、発行者、対象者、トークンの用途、時刻クレームを制限する必要があります。",
        "解码不验证真实性。验证必须约束算法、密钥、签发者、受众、令牌用途和时间声明。",
        "فك الترميز لا يتحقق من الأصالة. يجب أن يقيّد التحقق الخوارزميات والمفاتيح والجهة المُصدِرة والجمهور والغرض من الرمز وادعاءات الوقت."
    ],
    "Obsoletes RFC 7807; application/problem+json reference.": [
        "RFC 7807 को अप्रचलित करता है; application/problem+json संदर्भ।",
        "Sustituye a RFC 7807; referencia de application/problem+json.",
        "Remplace RFC 7807 ; référence application/problem+json.",
        "Ersetzt RFC 7807; Referenz für application/problem+json.",
        "RFC 7807を廃止・置換。application/problem+jsonの参照資料。",
        "取代 RFC 7807；application/problem+json 参考资料。",
        "يحل محل RFC 7807؛ مرجع application/problem+json."
    ],
    "Canonical 413/418/422 names. 104 is temporary and expires 2026-11-13 unless extended; confirm the live registry.": [
        "413/418/422 के मानक नाम। 104 अस्थायी है और विस्तार न होने पर 2026-11-13 को समाप्त होगा; लाइव रजिस्ट्री से पुष्टि करें।",
        "Nombres oficiales de 413/418/422. 104 es temporal y caduca el 2026-11-13 salvo prórroga; confirma el registro vigente.",
        "Noms canoniques de 413/418/422. 104 est temporaire et expire le 2026-11-13 sauf prolongation ; vérifiez le registre actuel.",
        "Kanonische Namen für 413/418/422. 104 ist vorläufig und läuft ohne Verlängerung am 2026-11-13 ab; das aktuelle Register prüfen.",
        "413/418/422の正式名称。104は暫定で、延長されない限り2026-11-13に失効します。最新のレジストリを確認してください。",
        "413/418/422 的规范名称。104 为临时状态码，除非延期，否则于 2026-11-13 到期；请核对实时注册表。",
        "الأسماء المعتمدة لـ413/418/422. الرمز 104 مؤقت وينتهي في 2026-11-13 ما لم يُمدَّد؛ تحقّق من السجل الحالي."
    ],
    "Common ports are a curated selection, not an authoritative full registry or proof of which service is running.": [
        "सामान्य पोर्ट एक चुना हुआ संग्रह हैं, आधिकारिक पूर्ण रजिस्ट्री या चल रही सेवा का प्रमाण नहीं।",
        "Los puertos comunes son una selección curada, no un registro oficial completo ni una prueba del servicio en ejecución.",
        "Les ports courants constituent une sélection, pas un registre officiel complet ni une preuve du service en cours d’exécution.",
        "Gängige Ports sind eine kuratierte Auswahl, kein vollständiges amtliches Register und kein Nachweis für den laufenden Dienst.",
        "一般的なポートの選定リストであり、完全な公式レジストリでも、稼働中のサービスを証明するものでもありません。",
        "常用端口为精选列表，并非完整的权威注册表，也不能证明正在运行哪项服务。",
        "المنافذ الشائعة قائمة منتقاة، وليست سجلًا رسميًا كاملًا أو دليلًا على الخدمة التي تعمل."
    ],
    "v3/v5 namespace-based UUIDs, v4 randomness, v7 millisecond timestamp and version inspection. UUIDs are not secrets.": [
        "v3/v5 नेमस्पेस-आधारित UUID, v4 यादृच्छिकता, v7 मिलीसेकंड टाइमस्टैम्प और संस्करण जाँच। UUID गोपनीय मान नहीं हैं।",
        "UUID v3/v5 basados en espacios de nombres, aleatoriedad v4, marca de tiempo v7 en milisegundos e inspección de versión. Los UUID no son secretos.",
        "UUID v3/v5 fondés sur un espace de noms, aléatoire v4, horodatage v7 en millisecondes et inspection de version. Les UUID ne sont pas des secrets.",
        "Namensraumbasierte v3/v5-UUIDs, v4-Zufälligkeit, v7-Zeitstempel in Millisekunden und Versionsprüfung. UUIDs sind keine Geheimnisse.",
        "名前空間に基づくv3/v5 UUID、v4の乱数、v7のミリ秒タイムスタンプ、バージョン検査。UUIDは秘密情報ではありません。",
        "基于命名空间的 v3/v5 UUID、v4 随机性、v7 毫秒时间戳及版本检查。UUID 不是秘密值。",
        "قيم UUID المستندة إلى نطاق أسماء في v3/v5 وعشوائية v4 وطابع زمني بالمللي ثانية في v7 وفحص الإصدار. قيم UUID ليست أسرارًا."
    ],
    "Header syntax and v00 generation. Future-version extensions are only partially interpreted.": [
        "हेडर सिंटैक्स और v00 जनरेशन। भविष्य के संस्करणों के एक्सटेंशन केवल आंशिक रूप से समझे जाते हैं।",
        "Sintaxis de cabeceras y generación v00. Las extensiones de versiones futuras solo se interpretan parcialmente.",
        "Syntaxe des en-têtes et génération v00. Les extensions des versions futures ne sont interprétées que partiellement.",
        "Header-Syntax und v00-Erzeugung. Erweiterungen künftiger Versionen werden nur teilweise interpretiert.",
        "ヘッダー構文とv00生成。将来のバージョンの拡張は一部のみ解釈します。",
        "请求头语法与 v00 生成。仅部分解析未来版本的扩展。",
        "صياغة الترويسات وتوليد v00. لا تُفسَّر امتدادات الإصدارات المستقبلية إلا جزئيًا."
    ],
    "Only rows with individual review dates have refreshed metadata. Historical rows are unverified. Local BPE/heuristics are not API billing counts.": [
        "केवल अलग समीक्षा तिथि वाली पंक्तियों का मेटाडेटा अपडेट है। ऐतिहासिक पंक्तियाँ असत्यापित हैं। स्थानीय BPE/अनुमान API बिलिंग गणना नहीं हैं।",
        "Solo las filas con fecha de revisión individual tienen metadatos actualizados. Las filas históricas no están verificadas. El BPE local y las heurísticas no equivalen a los recuentos de facturación de la API.",
        "Seules les lignes avec une date de vérification individuelle ont des métadonnées actualisées. Les lignes historiques ne sont pas vérifiées. Le BPE local et les heuristiques ne correspondent pas aux décomptes facturés par l’API.",
        "Nur Zeilen mit eigenem Prüfdatum haben aktualisierte Metadaten. Historische Zeilen sind ungeprüft. Lokales BPE und Heuristiken entsprechen nicht den API-Abrechnungszählungen.",
        "個別の確認日がある行のみメタデータを更新しています。過去の行は未確認です。ローカルBPE・推定値はAPIの課金カウントではありません。",
        "仅带有单独核查日期的行更新了元数据。历史行未经验证。本地 BPE 或启发式估算不等于 API 计费数量。",
        "تُحدَّث البيانات الوصفية للصفوف ذات تواريخ المراجعة الفردية فقط. الصفوف التاريخية غير متحقق منها. لا تمثل حسابات BPE المحلية أو التقديرات أعداد الفوترة في API."
    ],
    "First-party standard text tier; long-context, caching, residency and batch rates differ.": [
        "प्रथम-पक्ष मानक टेक्स्ट श्रेणी; लंबे कॉन्टेक्स्ट, कैशिंग, डेटा रेज़िडेंसी और बैच की दरें अलग हैं।",
        "Tarifa estándar de texto del proveedor; las tarifas de contexto largo, caché, residencia de datos y lotes difieren.",
        "Tarif texte standard du fournisseur ; les tarifs de contexte long, cache, résidence des données et traitement par lots diffèrent.",
        "Standard-Texttarif des Anbieters; Tarife für langen Kontext, Caching, Datenresidenz und Stapelverarbeitung weichen ab.",
        "提供元の標準テキスト料金。長いコンテキスト、キャッシュ、データ保存地域、バッチの料金は異なります。",
        "第一方标准文本档位；长上下文、缓存、数据驻留和批量处理的费率不同。",
        "فئة النص القياسية من المزوّد مباشرة؛ تختلف أسعار السياق الطويل والتخزين المؤقت وإقامة البيانات والمعالجة الدفعية."
    ],
    "Dated promotional rates and expiry shown per row; multimodal and storage charges differ.": [
        "हर पंक्ति में तिथि सहित प्रचार दरें और समाप्ति दिखाई गई हैं; मल्टीमोडल और स्टोरेज शुल्क अलग हैं।",
        "Cada fila muestra las tarifas promocionales fechadas y su vencimiento; los cargos multimodales y de almacenamiento difieren.",
        "Tarifs promotionnels datés et expiration indiqués par ligne ; les frais multimodaux et de stockage diffèrent.",
        "Datierte Aktionspreise und Ablaufdatum je Zeile; Gebühren für multimodale Nutzung und Speicher weichen ab.",
        "日付付きのプロモーション料金と有効期限を各行に表示。マルチモーダルとストレージの料金は異なります。",
        "每行列出带日期的促销费率与到期日；多模态及存储费用不同。",
        "تُعرض الأسعار الترويجية المؤرخة وانتهاؤها في كل صف؛ وتختلف رسوم الوسائط المتعددة والتخزين."
    ],
    "Original stack/editor/OS starter patterns. Git precedence, negation and parent-directory exclusion rules apply; already tracked files remain tracked.": [
        "स्टैक/एडिटर/OS के लिए मौलिक शुरुआती पैटर्न। Git की प्राथमिकता, निषेध और पैरेंट डायरेक्टरी बहिष्करण नियम लागू होते हैं; पहले से ट्रैक फ़ाइलें ट्रैक होती रहती हैं।",
        "Patrones iniciales propios para stacks, editores y sistemas operativos. Se aplican las reglas de Git de precedencia, negación y exclusión del directorio padre; los archivos ya rastreados siguen rastreados.",
        "Motifs de départ originaux pour piles techniques, éditeurs et systèmes d’exploitation. Les règles Git de priorité, négation et exclusion du répertoire parent s’appliquent ; les fichiers déjà suivis le restent.",
        "Eigene Startmuster für Stacks, Editoren und Betriebssysteme. Git-Regeln zu Vorrang, Negation und Ausschluss übergeordneter Verzeichnisse gelten; bereits erfasste Dateien bleiben erfasst.",
        "技術スタック・エディター・OS向けの独自の初期パターン。Gitの優先順位、否定、親ディレクトリ除外ルールが適用されます。追跡済みファイルは追跡されたままです。",
        "原创的技术栈、编辑器及 OS 起始模式。遵循 Git 优先级、否定和父目录排除规则；已跟踪文件仍会被跟踪。",
        "أنماط بداية أصلية للحزم التقنية والمحررات وأنظمة التشغيل. تنطبق قواعد Git للأولوية والنفي واستبعاد المجلد الأصل؛ وتظل الملفات المتتبعة متتبعة."
    ],
    "26-character Crockford Base32 encoding, timestamp inspection and page-session monotonic generation with overflow rejection.": [
        "26-अक्षर Crockford Base32 एन्कोडिंग, टाइमस्टैम्प जाँच और ओवरफ़्लो अस्वीकार करने वाला पेज-सत्र मोनोटोनिक जनरेशन।",
        "Codificación Crockford Base32 de 26 caracteres, inspección de marcas de tiempo y generación monótona durante la sesión de página con rechazo de desbordamiento.",
        "Encodage Crockford Base32 sur 26 caractères, inspection de l’horodatage et génération monotone durant la session de page avec rejet des dépassements.",
        "Crockford-Base32-Kodierung mit 26 Zeichen, Zeitstempelprüfung und monotone Erzeugung innerhalb der Seitensitzung mit Überlaufablehnung.",
        "26文字のCrockford Base32エンコード、タイムスタンプ検査、オーバーフローを拒否するページセッション内の単調増加生成。",
        "26 字符 Crockford Base32 编码、时间戳检查，以及拒绝溢出的页面会话内单调生成。",
        "ترميز Crockford Base32 من 26 محرفًا وفحص الطابع الزمني وتوليد رتيب خلال جلسة الصفحة مع رفض التجاوز."
    ],
    "Distinguishes explicit no-mail domains, ordinary MX, implicit A/AAAA fallback, NXDOMAIN and lookup failure. DNS does not establish mailbox deliverability.": [
        "स्पष्ट रूप से मेल न स्वीकारने वाले डोमेन, सामान्य MX, निहित A/AAAA फ़ॉलबैक, NXDOMAIN और लुकअप विफलता में अंतर करता है। DNS मेलबॉक्स तक डिलीवरी सिद्ध नहीं करता।",
        "Distingue dominios que rechazan correo explícitamente, MX ordinario, alternativa implícita A/AAAA, NXDOMAIN y fallos de consulta. DNS no demuestra la capacidad de entrega a un buzón.",
        "Distingue les domaines refusant explicitement le courrier, MX ordinaire, repli implicite A/AAAA, NXDOMAIN et échec de recherche. DNS ne prouve pas la délivrabilité d’une boîte mail.",
        "Unterscheidet ausdrücklich mailfreie Domains, gewöhnliche MX, impliziten A/AAAA-Fallback, NXDOMAIN und Abfragefehler. DNS belegt keine Zustellbarkeit an ein Postfach.",
        "メール拒否を明示するドメイン、通常のMX、暗黙のA/AAAAフォールバック、NXDOMAIN、検索失敗を区別します。DNSはメールボックスへの配信可否を証明しません。",
        "区分明确拒收邮件的域名、普通 MX、隐式 A/AAAA 回退、NXDOMAIN 和查询失败。DNS 不能证明邮箱可投递。",
        "يميّز النطاقات التي ترفض البريد صراحةً وMX العادي والرجوع الضمني إلى A/AAAA وNXDOMAIN وفشل الاستعلام. لا يثبت DNS إمكانية التسليم إلى صندوق بريد."
    ],
    "Generated PHP uses CurlHandle lifetime cleanup rather than curl_close(), which is deprecated as of PHP 8.5. Actual local raw/multipart request fixtures pass.": [
        "जनरेट किया गया PHP, PHP 8.5 से अप्रचलित curl_close() के बजाय CurlHandle जीवनकाल सफ़ाई उपयोग करता है। वास्तविक स्थानीय raw/multipart अनुरोध परीक्षण पास हैं।",
        "El PHP generado utiliza la limpieza por ciclo de vida de CurlHandle en lugar de curl_close(), obsoleto desde PHP 8.5. Pasan las pruebas reales de solicitudes locales raw/multipart.",
        "Le PHP généré utilise le nettoyage lié à la durée de vie de CurlHandle plutôt que curl_close(), obsolète depuis PHP 8.5. Les tests réels de requêtes locales raw/multipart réussissent.",
        "Erzeugter PHP-Code nutzt die lebensdauergebundene Bereinigung von CurlHandle statt curl_close(), das seit PHP 8.5 veraltet ist. Tatsächliche lokale raw/multipart-Anfragetests bestehen.",
        "生成PHPは、PHP 8.5で非推奨となったcurl_close()ではなくCurlHandleのライフサイクルによる解放を使用します。実際のローカルraw/multipartリクエストテストは合格しています。",
        "生成的 PHP 通过 CurlHandle 生命周期清理资源，不调用自 PHP 8.5 起弃用的 curl_close()。实际本地 raw/multipart 请求测试已通过。",
        "يستخدم PHP المُولَّد التنظيف عند انتهاء عمر CurlHandle بدلًا من curl_close() المهمل منذ PHP 8.5. تنجح اختبارات الطلبات المحلية الفعلية raw/multipart."
    ],
    "Longest DNS-label suffix and IP-prefix matching, HTTPS registry endpoints and explicit missing-service errors. Domain/IP lookup records are retrieved at use time; registry privacy policies apply.": [
        "सबसे लंबे DNS-लेबल प्रत्यय और IP-प्रीफ़िक्स का मिलान, HTTPS रजिस्ट्री एंडपॉइंट और सेवा न मिलने की स्पष्ट त्रुटियाँ। डोमेन/IP लुकअप रिकॉर्ड उपयोग के समय प्राप्त होते हैं; रजिस्ट्री की गोपनीयता नीतियाँ लागू होती हैं।",
        "Coincidencia del sufijo de etiquetas DNS y prefijo IP más largos, endpoints de registro HTTPS y errores explícitos si falta el servicio. Los registros de dominio/IP se consultan al usarlos; se aplican las políticas de privacidad del registro.",
        "Correspondance du plus long suffixe de labels DNS et préfixe IP, points d’accès de registre HTTPS et erreurs explicites de service absent. Les données de domaine/IP sont récupérées à l’utilisation ; les politiques de confidentialité du registre s’appliquent.",
        "Abgleich des längsten DNS-Label-Suffixes und IP-Präfixes, HTTPS-Registerendpunkte und ausdrückliche Fehler bei fehlendem Dienst. Domain-/IP-Datensätze werden bei Nutzung abgerufen; Datenschutzrichtlinien des Registers gelten.",
        "最長のDNSラベル接尾辞とIPプレフィックスの照合、HTTPSレジストリエンドポイント、サービス未検出の明示的エラー。ドメイン・IPの照会レコードは利用時に取得し、レジストリのプライバシーポリシーが適用されます。",
        "匹配最长 DNS 标签后缀及 IP 前缀，使用 HTTPS 注册表端点，并明确报告缺少服务的错误。域名/IP 查询记录在使用时获取；适用注册表隐私政策。",
        "مطابقة أطول لاحقة لتسميات DNS وبادئة IP، ونقاط سجل HTTPS، وأخطاء صريحة عند غياب الخدمة. تُجلب سجلات البحث عن النطاق/IP وقت الاستخدام؛ وتسري سياسات خصوصية السجل."
    ],
    "Domain/IP-network summaries, entities, events, statuses and nameservers. Optional/redacted fields are not treated as proof of ownership or mailbox availability.": [
        "डोमेन/IP-नेटवर्क सारांश, इकाइयाँ, इवेंट, स्थितियाँ और नेमसर्वर। वैकल्पिक/छिपाए गए फ़ील्ड स्वामित्व या मेलबॉक्स उपलब्धता के प्रमाण नहीं माने जाते।",
        "Resúmenes de dominio/red IP, entidades, eventos, estados y servidores de nombres. Los campos opcionales u ocultados no se consideran prueba de propiedad ni de disponibilidad de un buzón.",
        "Résumés de domaine/réseau IP, entités, événements, statuts et serveurs de noms. Les champs facultatifs ou masqués ne prouvent ni la propriété ni la disponibilité d’une boîte mail.",
        "Domain-/IP-Netzwerkübersichten, Entitäten, Ereignisse, Status und Nameserver. Optionale oder geschwärzte Felder gelten nicht als Eigentumsnachweis oder Nachweis der Postfachverfügbarkeit.",
        "ドメイン・IPネットワークの概要、エンティティ、イベント、状態、ネームサーバー。任意・秘匿フィールドを所有権やメールボックスの利用可否の証拠として扱いません。",
        "域名/IP 网络摘要、实体、事件、状态及名称服务器。可选或隐去的字段不视为所有权或邮箱可用性的证明。",
        "ملخصات النطاق/شبكة IP والكيانات والأحداث والحالات وخوادم الأسماء. لا تُعد الحقول الاختيارية أو المحجوبة دليلًا على الملكية أو توافر صندوق البريد."
    ],
    "Legacy AES-256-CBC passphrase compatibility and Keccak digest labels. No authenticated encryption or FIPS SHA-3 claim.": ["पुराने AES-256-CBC पासफ़्रेज़ प्रारूप से संगतता और Keccak हैश नाम। प्रमाणित एन्क्रिप्शन या FIPS SHA-3 का दावा नहीं।", "Compatibilidad con frases de paso AES-256-CBC heredadas y nombres de resúmenes Keccak. No se afirma cifrado autenticado ni FIPS SHA-3.", "Compatibilité avec les phrases secrètes AES-256-CBC historiques et libellés Keccak. Aucune revendication de chiffrement authentifié ni de SHA-3 FIPS.", "Kompatibilität mit alten AES-256-CBC-Passphrasen und Keccak-Hashbezeichnungen. Keine Zusage authentifizierter Verschlüsselung oder von FIPS SHA-3.", "従来のAES-256-CBCパスフレーズ形式とKeccakダイジェスト名への互換性。認証付き暗号やFIPS SHA-3の対応は主張しません。", "兼容旧版 AES-256-CBC 口令格式并准确标注 Keccak 摘要。不宣称支持认证加密或 FIPS SHA-3。", "توافق عبارات المرور بصيغة AES-256-CBC القديمة وتسميات تجزئة Keccak. لا يُدّعى توفير تشفير موثّق أو FIPS SHA-3."],
    "JWE GCM and CBC-HMAC, direct keys and AES-KW; JWS key sizes and JWK algorithm metadata. Published vectors cover supported modes.": ["JWE GCM और CBC-HMAC, सीधे कुंजी उपयोग और AES-KW; JWS कुंजी आकार और JWK एल्गोरिदम मेटाडेटा। प्रकाशित परीक्षण वेक्टर समर्थित मोड जाँचते हैं।", "JWE GCM y CBC-HMAC, claves directas y AES-KW; tamaños de clave JWS y metadatos de algoritmos JWK. Vectores publicados cubren los modos compatibles.", "JWE GCM et CBC-HMAC, clés directes et AES-KW ; tailles de clés JWS et métadonnées des algorithmes JWK. Des vecteurs publiés couvrent les modes pris en charge.", "JWE GCM und CBC-HMAC, direkte Schlüssel und AES-KW; JWS-Schlüsselgrößen und JWK-Algorithmusmetadaten. Veröffentlichte Testvektoren decken unterstützte Modi ab.", "JWEのGCM、CBC-HMAC、直接鍵、AES-KW、JWSの鍵長、JWKのアルゴリズム情報。対応モードを公開テストベクトルで検証します。", "JWE GCM 与 CBC-HMAC、直接密钥和 AES-KW；JWS 密钥长度及 JWK 算法元数据。公开测试向量覆盖支持的模式。", "أنماط JWE GCM وCBC-HMAC والمفاتيح المباشرة وAES-KW؛ وأحجام مفاتيح JWS وبيانات خوارزميات JWK. تغطي متجهات اختبار منشورة الأنماط المدعومة."],
    "UTF-8 compact signatures with an explicitly selected algorithm. Signature checks do not validate application claims.": ["स्पष्ट रूप से चुने एल्गोरिदम के साथ संक्षिप्त UTF-8 हस्ताक्षर। हस्ताक्षर जाँच एप्लिकेशन के दावों को सत्यापित नहीं करती।", "Firmas compactas UTF-8 con un algoritmo seleccionado explícitamente. Comprobar la firma no valida las declaraciones de la aplicación.", "Signatures compactes UTF-8 avec un algorithme choisi explicitement. La vérification de signature ne valide pas les revendications applicatives.", "Kompakte UTF-8-Signaturen mit ausdrücklich gewähltem Algorithmus. Die Signaturprüfung validiert keine Anwendungs-Claims.", "明示的に選択したアルゴリズムによるUTF-8コンパクト署名。署名確認ではアプリケーションのクレームを検証しません。", "使用显式选择的算法生成 UTF-8 紧凑签名。签名检查不验证应用声明。", "تواقيع UTF-8 مدمجة بخوارزمية مختارة صراحةً. فحص التوقيع لا يتحقق من مطالبات التطبيق."],
    "Browser-generated self-signed X.509 DER signatures, subject alternative names and matching keys. No public trust or complete PKIX validation claim.": ["ब्राउज़र में बने स्व-हस्ताक्षरित X.509 के DER हस्ताक्षर, वैकल्पिक विषय नाम और मेल खाती कुंजियाँ। सार्वजनिक विश्वास या पूर्ण PKIX सत्यापन का दावा नहीं।", "Firmas DER de certificados X.509 autofirmados generados en el navegador, nombres alternativos y claves correspondientes. No se afirma confianza pública ni validación PKIX completa.", "Signatures DER X.509 autosignées générées dans le navigateur, noms alternatifs et clés correspondantes. Aucune revendication de confiance publique ni de validation PKIX complète.", "Im Browser erzeugte selbstsignierte X.509-DER-Signaturen, alternative Antragstellernamen und passende Schlüssel. Keine Zusage öffentlichen Vertrauens oder vollständiger PKIX-Validierung.", "ブラウザーで生成する自己署名X.509のDER署名、SAN、対応する鍵。公開の信頼や完全なPKIX検証は主張しません。", "浏览器生成的自签名 X.509 DER 签名、使用者备用名称和匹配密钥。不宣称具有公共信任或完整 PKIX 验证。", "تواقيع DER لشهادات X.509 ذاتية التوقيع منشأة في المتصفح، وأسماء بديلة ومفاتيح مطابقة. لا يُدّعى توفير ثقة عامة أو تحقق PKIX كامل."],
    "OpenSSH public wire blobs and unencrypted private-key files. Independent ssh-keygen fixtures validate supported algorithms and fingerprints.": ["OpenSSH सार्वजनिक कुंजी का बाइनरी प्रारूप और बिना एन्क्रिप्शन की निजी कुंजी फ़ाइलें। स्वतंत्र ssh-keygen परीक्षण समर्थित एल्गोरिदम और फ़िंगरप्रिंट जाँचते हैं।", "Bloques públicos OpenSSH y archivos de clave privada sin cifrar. Pruebas independientes con ssh-keygen validan algoritmos y huellas compatibles.", "Blocs binaires publics OpenSSH et fichiers de clés privées non chiffrés. Des tests indépendants avec ssh-keygen valident les algorithmes et empreintes pris en charge.", "Öffentliche OpenSSH-Datenblöcke und unverschlüsselte private Schlüsseldateien. Unabhängige ssh-keygen-Tests prüfen unterstützte Algorithmen und Fingerabdrücke.", "OpenSSH公開鍵の通信形式と暗号化されていない秘密鍵ファイル。独立したssh-keygenテストで対応アルゴリズムと指紋を検証します。", "OpenSSH 公钥二进制格式和未加密的私钥文件。独立 ssh-keygen 测试验证支持的算法和指纹。", "بيانات مفاتيح OpenSSH العامة وملفات مفاتيح خاصة غير مشفرة. تتحقق اختبارات ssh-keygen المستقلة من الخوارزميات والبصمات المدعومة."],
    "Two-space, comma-delimited TOON subset with strict counts and precision checks. Keyed tables, nested field groups and alternate delimiters are unsupported.": ["दो स्पेस और कॉमा वाला सीमित TOON प्रारूप; संख्या और परिशुद्धता की सख्त जाँच। keyed tables, nested field groups और दूसरे delimiters समर्थित नहीं हैं।", "Subconjunto TOON con dos espacios y comas, conteos estrictos y comprobación de precisión. No admite tablas con clave, grupos de campos anidados ni otros delimitadores.", "Sous-ensemble TOON à deux espaces et séparateurs virgule, avec vérification stricte des comptes et de la précision. Tables à clés, groupes de champs imbriqués et autres séparateurs non pris en charge.", "TOON-Teilmenge mit zwei Leerzeichen, Kommatrennung sowie strenger Anzahl- und Präzisionsprüfung. Tabellen mit Schlüsseln, verschachtelte Feldgruppen und andere Trennzeichen werden nicht unterstützt.", "2スペース・カンマ区切りのTOONサブセット。件数と精度を厳密に確認します。キー付きテーブル、入れ子のフィールドグループ、別の区切り文字には非対応です。", "使用双空格缩进、逗号分隔的 TOON 子集，严格检查数量和精度。不支持键控表格、嵌套字段组及其他分隔符。", "مجموعة فرعية من TOON بمسافتين وفواصل، مع فحص صارم للأعداد والدقة. لا تدعم الجداول ذات المفاتيح أو مجموعات الحقول المتداخلة أو المحددات البديلة."],
    "Selected IPv6 prefixes, including documentation and dummy ranges. Registry classification does not establish reachability; address counts are full block sizes.": ["दस्तावेज़ीकरण और dummy रेंज सहित चुने हुए IPv6 प्रीफ़िक्स। रजिस्ट्री का वर्गीकरण पहुँच सुनिश्चित नहीं करता; पते की संख्या पूरे ब्लॉक का आकार है।", "Prefijos IPv6 seleccionados, incluidos rangos de documentación y ficticios. La clasificación del registro no demuestra accesibilidad; los conteos corresponden al bloque completo.", "Préfixes IPv6 sélectionnés, dont les plages de documentation et factices. Le classement du registre ne prouve pas la joignabilité ; les comptes couvrent les blocs entiers.", "Ausgewählte IPv6-Präfixe einschließlich Dokumentations- und Dummy-Bereichen. Die Registrierung belegt keine Erreichbarkeit; Adresszahlen geben die vollständige Blockgröße an.", "文書用・ダミー用範囲を含むIPv6プレフィックスの選択一覧。登録区分は到達可能性を保証しません。アドレス数はブロック全体のサイズです。", "精选 IPv6 前缀，包括文档和虚拟地址范围。注册表分类不能证明可达性；地址数量表示完整块大小。", "بادئات IPv6 مختارة تشمل نطاقات التوثيق والنطاقات الوهمية. لا يثبت تصنيف السجل إمكانية الوصول؛ وتمثل أعداد العناوين حجم الكتلة الكامل."],
    "RFC 9846 replaces RFC 8446. The reference separates publication maturity and replacement links from deployment advice; it does not test protocol conformance.": ["RFC 9846, RFC 8446 की जगह लेता है। संदर्भ में प्रकाशन की स्थिति और प्रतिस्थापन लिंक, deployment सलाह से अलग हैं; यह प्रोटोकॉल अनुरूपता नहीं जाँचता।", "RFC 9846 sustituye a RFC 8446. La referencia separa madurez y enlaces de sustitución de los consejos de despliegue; no prueba conformidad del protocolo.", "RFC 9846 remplace RFC 8446. La référence distingue la maturité de publication et les liens de remplacement des conseils de déploiement ; elle ne teste pas la conformité du protocole.", "RFC 9846 ersetzt RFC 8446. Die Referenz trennt Veröffentlichungsreife und Ersatzverweise von Betriebsempfehlungen; sie prüft keine Protokollkonformität.", "RFC 9846はRFC 8446を置き換えます。公開段階と置換先リンクを運用上の助言と区別する参考資料であり、プロトコル適合性のテストではありません。", "RFC 9846 替代 RFC 8446。参考资料将发布成熟度和替代链接与部署建议区分开来；不进行协议符合性测试。", "يحل RFC 9846 محل RFC 8446. يفصل المرجع نضج النشر وروابط الاستبدال عن نصائح النشر التشغيلي؛ ولا يختبر التوافق مع البروتوكول."],
};
