import type { TranslationColumns } from "./tool-names";

// Authored protocol UI only; requests, credentials and diagnostics remain data.
export const PROTOCOL_TOOL_TRANSLATIONS: Record<string, TranslationColumns> = {
    "stdio transport: copy the CLI command below and run it in your terminal, then switch to SSE/HTTP to connect from the browser.": [
        "stdio: CLI कमांड टर्मिनल में चलाएँ; ब्राउज़र से जुड़ने के लिए SSE/HTTP चुनें।",
        "stdio: ejecuta el comando CLI en tu terminal; usa SSE/HTTP para conectar desde el navegador.",
        "stdio : exécutez la commande CLI dans le terminal ; utilisez SSE/HTTP pour la connexion navigateur.",
        "stdio: CLI-Befehl im Terminal ausführen; für Browserverbindungen SSE/HTTP wählen.",
        "stdioではCLIコマンドをターミナルで実行し、ブラウザー接続にはSSE/HTTPを選びます。",
        "stdio：在终端运行 CLI 命令；浏览器连接请使用 SSE/HTTP。",
        "stdio: شغّل أمر CLI في الطرفية، واختر SSE/HTTP للاتصال من المتصفح."
    ],
    "Disconnected": [
        "डिस्कनेक्ट किया गया",
        "Desconectado",
        "Déconnecté",
        "Getrennt",
        "未接続",
        "已断开",
        "غير متصل"
    ],
    "Diagnose only works for SSE/HTTP transports.": [
        "निदान केवल SSE/HTTP पर उपलब्ध है।",
        "El diagnóstico solo funciona con SSE/HTTP.",
        "Le diagnostic fonctionne uniquement avec SSE/HTTP.",
        "Diagnose ist nur für SSE/HTTP verfügbar.",
        "診断はSSE/HTTPのみ対応します。",
        "诊断仅支持 SSE/HTTP。",
        "التشخيص متاح لـSSE/HTTP فقط."
    ],
    "Enter a server URL first.": [
        "पहले सर्वर URL दर्ज करें।",
        "Introduce primero la URL del servidor.",
        "Saisissez d’abord l’URL du serveur.",
        "Zuerst eine Server-URL eingeben.",
        "先にサーバーURLを入力してください。",
        "请先输入服务器 URL。",
        "أدخل عنوان URL للخادم أولًا."
    ],
    "Fix the URL format (must include http:// or https://).": [
        "http:// या https:// सहित सही URL दर्ज करें।",
        "Corrige la URL e incluye http:// o https://.",
        "Corrigez l’URL avec http:// ou https://.",
        "URL mit http:// oder https:// korrigieren.",
        "http://またはhttps://を含むURLに修正してください。",
        "请修正 URL，并包含 http:// 或 https://。",
        "صحّح العنوان وأضف http:// أو https://."
    ],
    "Tool": [
        "टूल",
        "Herramienta",
        "Outil",
        "Werkzeug",
        "ツール",
        "工具",
        "الأداة"
    ],
    "Duration": [
        "अवधि",
        "Duración",
        "Durée",
        "Dauer",
        "所要時間",
        "耗时",
        "المدة"
    ],
    "Error": [
        "त्रुटि",
        "Error",
        "Erreur",
        "Fehler",
        "エラー",
        "错误",
        "خطأ"
    ],
    "OK": [
        "सफल",
        "Correcto",
        "Réussi",
        "Erfolgreich",
        "成功",
        "成功",
        "نجاح"
    ],
    "Test and inspect Model Context Protocol servers": [
        "Model Context Protocol सर्वर जाँचें और परीक्षण करें",
        "Prueba e inspecciona servidores Model Context Protocol",
        "Tester et inspecter des serveurs Model Context Protocol",
        "Model-Context-Protocol-Server prüfen und testen",
        "Model Context Protocolサーバーを調査・テスト",
        "检查和测试 Model Context Protocol 服务器",
        "اختبر وافحص خوادم Model Context Protocol"
    ],
    "The MCP Inspector is a fully configurable client for the Model Context Protocol (MCP) — the open standard for connecting AI assistants to external tools and data sources. It connects to any MCP server over SSE or HTTP, lists all available tools, lets you call them interactively with auto-scaffolded arguments, and shows raw JSON-RPC 2.0 responses. For stdio-based servers it generates the exact CLI command to paste into your terminal. stdio config generates the equivalent CLI command.": [
        "MCP AI सहायकों को टूल और डेटा से जोड़ता है। यह निरीक्षक SSE/HTTP से टूल सूची और JSON-RPC परिणाम दिखाता है, स्कीमा से तर्क तैयार करता है और stdio के लिए स्थानीय CLI कमांड बनाता है।",
        "MCP conecta asistentes de IA con herramientas y datos. Este inspector lista herramientas por SSE/HTTP, prepara argumentos desde su esquema, muestra JSON-RPC y genera un comando CLI local para stdio.",
        "MCP relie les assistants IA aux outils et données. Cet inspecteur liste les outils via SSE/HTTP, prépare les arguments du schéma, affiche JSON-RPC et génère une commande CLI locale pour stdio.",
        "MCP verbindet KI-Assistenten mit Werkzeugen und Daten. Der Inspektor listet Werkzeuge über SSE/HTTP, erstellt Argumentvorlagen, zeigt JSON-RPC und erzeugt für stdio einen lokalen CLI-Befehl.",
        "MCPはAIアシスタントとツール・データを接続します。SSE/HTTPでツールを一覧し、スキーマから引数のひな形を作成してJSON-RPCを表示します。stdioにはローカルCLIコマンドを生成します。",
        "MCP 将 AI 助手连接到工具和数据。检查器通过 SSE/HTTP 列出工具、按模式生成参数模板、显示 JSON-RPC，并为 stdio 生成本地 CLI 命令。",
        "يربط MCP مساعدي الذكاء الاصطناعي بالأدوات والبيانات. يعرض الفاحص الأدوات عبر SSE/HTTP، ويجهّز قوالب الوسائط ونتائج JSON-RPC، وينشئ أمر CLI محليًا لـstdio."
    ],
    "MCP is the foundation for AI agent tooling. Use this inspector to develop and debug MCP server implementations, explore what tools a server exposes before wiring them into an agent, validate request/response shapes match your expectations, and diagnose CORS or connectivity issues before your agent goes live.": [
        "एजेंट से जोड़ने से पहले MCP टूल खोजें, अनुरोध/प्रतिक्रिया संरचना जाँचें और CORS या कनेक्शन समस्याओं का निदान करें।",
        "Explora herramientas MCP, revisa las estructuras de solicitud y respuesta y diagnostica CORS o conexiones antes de integrar un agente.",
        "Explorez les outils MCP, vérifiez les structures des requêtes et réponses et diagnostiquez CORS ou la connexion avant d’intégrer un agent.",
        "Vor der Agentenintegration MCP-Werkzeuge entdecken, Anfrage-/Antwortstrukturen prüfen sowie CORS und Verbindungen diagnostizieren.",
        "エージェントへの統合前にMCPツールを調査し、要求・応答の構造やCORS、接続の問題を確認できます。",
        "在集成代理前探索 MCP 工具、检查请求与响应结构，并诊断 CORS 或连接问题。",
        "استكشف أدوات MCP وافحص بنية الطلبات والردود وشخّص CORS والاتصال قبل دمج الوكيل."
    ],
    "Choose a Transport: SSE (point at the /sse endpoint) or HTTP (streamable HTTP, typically /mcp) for browser connections; stdio generates a CLI command to run locally": [
        "ब्राउज़र के लिए SSE (/sse) या HTTP (आमतौर पर /mcp) चुनें; stdio स्थानीय CLI कमांड बनाता है।",
        "Elige SSE (/sse) o HTTP (normalmente /mcp) para el navegador; stdio genera un comando CLI local.",
        "Choisissez SSE (/sse) ou HTTP (souvent /mcp) pour le navigateur ; stdio génère une commande CLI locale.",
        "Für den Browser SSE (/sse) oder HTTP (meist /mcp) wählen; stdio erzeugt einen lokalen CLI-Befehl.",
        "ブラウザーにはSSE（/sse）かHTTP（通常/mcp）を選択。stdioはローカルCLIコマンドを生成します。",
        "浏览器连接选择 SSE（/sse）或 HTTP（通常为 /mcp）；stdio 生成本地 CLI 命令。",
        "اختر SSE ‏(/sse) أو HTTP ‏(عادة /mcp) للمتصفح؛ ينشئ stdio أمر CLI محليًا."
    ],
    "Set the Connection Type to control CORS handling — 'Direct (auto-fallback)' tries a browser fetch and retries via server proxy on CORS failure; 'Direct (strict)' surfaces errors; 'Via Server Proxy' always routes via /api/proxy; 'Via MCP Proxy' tunnels through npx @modelcontextprotocol/inspector running locally": [
        "स्वचालित Direct मोड CORS विफलता पर सर्वर प्रॉक्सी आज़माता है; strict मोड त्रुटि दिखाता है। Server Proxy हमेशा /api/proxy और MCP Proxy स्थानीय inspector से भेजता है।",
        "Direct automático reintenta por proxy si falla CORS; el modo estricto muestra el error. Server Proxy usa /api/proxy y MCP Proxy el inspector local.",
        "Direct automatique réessaie via le proxy si CORS échoue ; le mode strict affiche l’erreur. Server Proxy utilise /api/proxy et MCP Proxy l’inspecteur local.",
        "Automatisch direkt versucht bei CORS-Fehlern den Proxy; strikt direkt zeigt den Fehler. Server Proxy nutzt /api/proxy, MCP Proxy den lokalen Inspector.",
        "自動DirectはCORS失敗時にプロキシで再試行し、strictはエラーを表示します。Server Proxyは/api/proxy、MCP Proxyはローカルinspectorを使用します。",
        "自动直连在 CORS 失败时通过代理重试；严格直连显示错误。Server Proxy 使用 /api/proxy，MCP Proxy 使用本地 inspector。",
        "يعيد Direct التلقائي المحاولة عبر الوكيل عند فشل CORS؛ ويعرض الوضع الصارم الخطأ. يستخدم Server Proxy المسار /api/proxy ويستخدم MCP Proxy الفاحص المحلي."
    ],
    "Click Diagnose to test direct fetch, CORS preflight, and proxy connectivity before committing to a connection": [
        "जुड़ने से पहले Diagnose से सीधे अनुरोध, CORS preflight और प्रॉक्सी जाँचें।",
        "Antes de conectar, usa Diagnosticar para comprobar acceso directo, preflight CORS y proxy.",
        "Avant la connexion, vérifiez l’accès direct, le preflight CORS et le proxy avec Diagnostiquer.",
        "Vor der Verbindung direkte Anfragen, CORS-Preflight und Proxy mit Diagnose prüfen.",
        "接続前に診断で直接要求、CORSプリフライト、プロキシを確認します。",
        "连接前使用诊断检查直接请求、CORS 预检和代理。",
        "قبل الاتصال، افحص الطلب المباشر وCORS preflight والوكيل باستخدام التشخيص."
    ],
    "Open Authentication (collapsed by default) to add Custom Headers (Form or JSON), OAuth 2.0 client credentials, or paste an Access Token directly": [
        "Authentication खोलकर कस्टम हेडर, OAuth 2.0 विवरण या पहले से मिला access token दर्ज करें।",
        "Abre Autenticación para añadir cabeceras, datos OAuth 2.0 o un token de acceso obtenido previamente.",
        "Ouvrez Authentification pour ajouter des en-têtes, des données OAuth 2.0 ou un jeton déjà obtenu.",
        "Unter Authentifizierung eigene Header, OAuth-2.0-Daten oder vorhandene Zugriffstoken eintragen.",
        "認証を開き、カスタムヘッダー、OAuth 2.0情報、取得済みアクセストークンを入力します。",
        "打开身份验证，添加自定义标头、OAuth 2.0 信息或已获取的访问令牌。",
        "افتح المصادقة لإضافة ترويسات أو بيانات OAuth 2.0 أو رمز وصول حصلت عليه مسبقًا."
    ],
    "Open Configuration to adjust request and total timeouts. Task execution extensions and progress-based deadline resets are not exercised.": [
        "Configuration में समयसीमाएँ बदलें। Task execution एक्सटेंशन और प्रगति पर समयसीमा रीसेट समर्थित नहीं हैं।",
        "Ajusta los tiempos en Configuración. No se ejercitan extensiones de tareas ni reinicios de plazo por progreso.",
        "Réglez les délais dans Configuration. Les extensions de tâches et la remise à zéro sur progression ne sont pas exercées.",
        "Zeitlimits unter Konfiguration anpassen. Task-Erweiterungen und Fristverlängerung durch Fortschritt werden nicht ausgeführt.",
        "設定で時間制限を調整します。タスク実行拡張と進捗による期限リセットには対応していません。",
        "在配置中调整超时。不执行任务扩展，也不会按进度重置期限。",
        "اضبط المهل في الإعدادات. لا تُختبر امتدادات المهام ولا إعادة ضبط المهلة مع التقدم."
    ],
    "For Via MCP Proxy: run 'npx @modelcontextprotocol/inspector' locally — it prints the proxy address and a session token; paste both in Configuration → Inspector Proxy": [
        "स्थानीय npx @modelcontextprotocol/inspector चलाएँ और दिखा प्रॉक्सी पता व session token Configuration → Inspector Proxy में चिपकाएँ।",
        "Ejecuta npx @modelcontextprotocol/inspector localmente y pega la dirección y el token en Configuración → Inspector Proxy.",
        "Exécutez npx @modelcontextprotocol/inspector localement et collez l’adresse et le jeton dans Configuration → Inspector Proxy.",
        "npx @modelcontextprotocol/inspector lokal starten; Adresse und Sitzungstoken unter Konfiguration → Inspector Proxy einfügen.",
        "npx @modelcontextprotocol/inspectorをローカル実行し、表示されたアドレスとセッショントークンを設定 → Inspector Proxyに貼り付けます。",
        "本地运行 npx @modelcontextprotocol/inspector，并将地址与会话令牌粘贴到配置 → Inspector Proxy。",
        "شغّل npx @modelcontextprotocol/inspector محليًا والصق العنوان ورمز الجلسة في الإعدادات → Inspector Proxy."
    ],
    "Click Connect to establish the session and load the tool list": [
        "Connect से सत्र शुरू कर टूल सूची लोड करें।",
        "Pulsa Conectar para iniciar la sesión y cargar las herramientas.",
        "Cliquez sur Connecter pour démarrer la session et charger les outils.",
        "Mit Verbinden die Sitzung starten und Werkzeuge laden.",
        "接続を押してセッションを開始し、ツール一覧を読み込みます。",
        "点击连接以启动会话并加载工具列表。",
        "اضغط اتصال لبدء الجلسة وتحميل قائمة الأدوات."
    ],
    "Select a tool from the list — arguments are auto-scaffolded from its JSON Schema — fill them in, and click Call": [
        "टूल चुनें, JSON Schema से बने तर्क भरें और Call दबाएँ।",
        "Elige una herramienta, completa los argumentos de JSON Schema y pulsa Invocar.",
        "Choisissez un outil, complétez les arguments du JSON Schema et cliquez sur Appeler.",
        "Werkzeug wählen, aus JSON Schema erzeugte Argumente ausfüllen und Aufrufen drücken.",
        "ツールを選び、JSON Schemaから生成した引数を入力して呼び出します。",
        "选择工具，填写按 JSON Schema 生成的参数，再点击调用。",
        "اختر أداة وأكمل الوسائط المولّدة من JSON Schema ثم اضغط استدعاء."
    ],
    "View results in the JSON editor and expand History rows to compare args vs results across calls": [
        "JSON परिणाम देखें; History में पंक्ति खोलकर तर्क और परिणाम की तुलना करें।",
        "Revisa el JSON y expande filas del historial para comparar argumentos y resultados.",
        "Consultez le JSON et développez l’historique pour comparer arguments et résultats.",
        "JSON ansehen und Verlaufszeilen für den Vergleich von Argumenten und Ergebnissen öffnen.",
        "JSON結果を確認し、履歴行を開いて引数と結果を比較します。",
        "查看 JSON 结果，展开历史记录以比较参数和结果。",
        "راجع نتائج JSON ووسّع صفوف السجل لمقارنة الوسائط والنتائج."
    ],
    "SSE endpoint is usually /sse; HTTP endpoint is usually /mcp — check your server's README": [
        "आमतौर पर SSE /sse और HTTP /mcp पर होते हैं; सर्वर README जाँचें।",
        "SSE suele usar /sse y HTTP /mcp; consulta el README del servidor.",
        "SSE utilise souvent /sse et HTTP /mcp ; consultez le README du serveur.",
        "SSE nutzt meist /sse, HTTP meist /mcp; Server-README prüfen.",
        "SSEは通常/sse、HTTPは/mcpです。サーバーのREADMEを確認してください。",
        "SSE 通常使用 /sse，HTTP 使用 /mcp；请查看服务器 README。",
        "يستخدم SSE عادة /sse وHTTP المسار /mcp؛ راجع README للخادم."
    ],
    "Diagnose before Connect: it reveals exactly which step fails and recommends a Connection Type": [
        "Connect से पहले निदान करें; विफल चरण और सुझाया कनेक्शन प्रकार दिखेगा।",
        "Diagnostica antes de conectar para ver el paso fallido y el tipo de conexión recomendado.",
        "Diagnostiquez avant la connexion pour identifier l’étape en échec et le type conseillé.",
        "Vor dem Verbinden diagnostizieren; fehlgeschlagene Schritte und Empfehlung werden angezeigt.",
        "接続前に診断すると、失敗した手順と推奨接続方式が分かります。",
        "连接前先诊断，以查看失败步骤和推荐的连接类型。",
        "شخّص قبل الاتصال لمعرفة الخطوة الفاشلة ونوع الاتصال المقترح."
    ],
    "CORS fallback tag (orange) means the browser was blocked — add 'Access-Control-Allow-Origin: *' to the server to remove the extra round-trip": [
        "नारंगी CORS fallback ब्राउज़र रोक दर्शाता है। सर्वर पर Access-Control-Allow-Origin: * से अतिरिक्त अनुरोध हट सकता है।",
        "CORS fallback naranja indica un bloqueo del navegador. Access-Control-Allow-Origin: * en el servidor puede evitar el salto extra.",
        "Le badge orange CORS fallback signale un blocage navigateur. Access-Control-Allow-Origin: * sur le serveur peut éviter le détour.",
        "Orangefarbenes CORS-Fallback zeigt eine Browsersperre. Access-Control-Allow-Origin: * am Server kann den Umweg vermeiden.",
        "オレンジのCORS fallbackはブラウザーのブロックを示します。サーバーのAccess-Control-Allow-Origin: *で追加経路を回避できます。",
        "橙色 CORS fallback 表示浏览器阻止了请求。服务器配置 Access-Control-Allow-Origin: * 可避免额外跳转。",
        "تشير شارة CORS fallback البرتقالية إلى حظر المتصفح. قد يمنع Access-Control-Allow-Origin: * على الخادم القفزة الإضافية."
    ],
    "Custom Headers accept 'Authorization: Bearer <token>' in Form or JSON mode — JSON auto-syncs back to the form": [
        "Form या JSON में Authorization: Bearer <token> हेडर जोड़ें; JSON फ़ॉर्म से स्वतः सिंक होता है।",
        "Añade Authorization: Bearer <token> en formulario o JSON; el JSON se sincroniza con el formulario.",
        "Ajoutez Authorization: Bearer <token> en formulaire ou JSON ; le JSON se synchronise au formulaire.",
        "Authorization: Bearer <token> als Formular oder JSON hinzufügen; JSON synchronisiert das Formular.",
        "フォームまたはJSONでAuthorization: Bearer <token>を設定します。JSONはフォームと自動同期します。",
        "在表单或 JSON 中添加 Authorization: Bearer <token>；JSON 会自动同步到表单。",
        "أضف Authorization: Bearer <token> في النموذج أو JSON؛ تتم مزامنة JSON مع النموذج."
    ],
    "Via MCP Proxy uses dual auth: Bearer header + MCP_PROXY_AUTH_TOKEN query param to match the official inspector's authentication pattern": [
        "MCP Proxy आधिकारिक inspector की तरह Bearer हेडर और MCP_PROXY_AUTH_TOKEN query parameter दोनों भेजता है।",
        "MCP Proxy usa cabecera Bearer y parámetro MCP_PROXY_AUTH_TOKEN, como el inspector oficial.",
        "MCP Proxy utilise l’en-tête Bearer et le paramètre MCP_PROXY_AUTH_TOKEN comme l’inspecteur officiel.",
        "MCP Proxy verwendet wie der offizielle Inspector Bearer-Header und MCP_PROXY_AUTH_TOKEN-Abfrageparameter.",
        "MCP Proxyは公式inspectorと同様にBearerヘッダーとMCP_PROXY_AUTH_TOKENクエリ引数を使用します。",
        "MCP Proxy 与官方 inspector 一样使用 Bearer 标头和 MCP_PROXY_AUTH_TOKEN 查询参数。",
        "يستخدم MCP Proxy ترويسة Bearer ومعامل MCP_PROXY_AUTH_TOKEN مثل الفاحص الرسمي."
    ],
    "SSL options (CA bundle, client cert, mTLS key) force routing through the server-side proxy — the browser cannot handle custom TLS": [
        "CA bundle, client certificate या mTLS key के लिए सर्वर प्रॉक्सी आवश्यक है; ब्राउज़र कस्टम TLS नहीं संभालता।",
        "CA personalizada, certificado de cliente o clave mTLS requieren el proxy del servidor; el navegador no gestiona TLS personalizado.",
        "CA personnalisée, certificat client ou clé mTLS imposent le proxy serveur ; le navigateur ne gère pas ce TLS.",
        "Eigene CA, Clientzertifikat oder mTLS-Schlüssel erfordern den Serverproxy; der Browser unterstützt kein eigenes TLS.",
        "独自CA、クライアント証明書、mTLS鍵はサーバープロキシが必要です。ブラウザーは独自TLSを扱えません。",
        "自定义 CA、客户端证书或 mTLS 密钥需要服务器代理；浏览器无法处理自定义 TLS。",
        "تتطلب CA مخصصة أو شهادة عميل أو مفتاح mTLS وكيل الخادم؛ لا يدعم المتصفح TLS المخصص."
    ],
    "Requests use a fixed deadline. Progress notifications do not extend the timeout; increase it before invoking long-running tools.": [
        "अनुरोध की समयसीमा निश्चित है। प्रगति घटनाएँ इसे नहीं बढ़ातीं; लंबे कार्य से पहले इसे बढ़ाएँ।",
        "El plazo es fijo. Los eventos de progreso no lo amplían; auméntalo antes de tareas largas.",
        "Le délai est fixe. La progression ne le prolonge pas ; augmentez-le avant une opération longue.",
        "Die Frist ist fest. Fortschrittsmeldungen verlängern sie nicht; vor langen Aufgaben erhöhen.",
        "要求期限は固定です。進捗通知では延長されないため、長時間の呼び出し前に増やしてください。",
        "请求期限固定。进度通知不会延长超时；执行长任务前请先调高。",
        "مهلة الطلب ثابتة. لا تمددها أحداث التقدم؛ زِدها قبل المهام الطويلة."
    ],
    "Call history is persisted to localStorage (up to 100 entries) — expand any row to see the full args and result": [
        "अधिकतम 100 कॉल localStorage में सहेजे जाते हैं। पंक्ति खोलकर पूरे तर्क और परिणाम देखें।",
        "Se guardan hasta 100 llamadas en localStorage. Expande una fila para ver argumentos y resultado completos.",
        "Jusqu’à 100 appels sont conservés dans localStorage. Développez une ligne pour voir arguments et résultat.",
        "Bis zu 100 Aufrufe bleiben in localStorage. Zeile für vollständige Argumente und Ergebnisse öffnen.",
        "最大100件の呼び出しをlocalStorageに保存します。行を開くと引数と結果の全体を確認できます。",
        "最多在 localStorage 中保存 100 次调用；展开记录可查看完整参数和结果。",
        "يُحفظ حتى 100 استدعاء في localStorage. وسّع الصف لعرض الوسائط والنتيجة كاملة."
    ],
    "Debugging a custom MCP server implementation before deploying it to production": [
        "परिनियोजन से पहले अपना MCP सर्वर डिबग करें",
        "Depurar un servidor MCP antes del despliegue",
        "Déboguer un serveur MCP avant déploiement",
        "MCP-Server vor der Bereitstellung debuggen",
        "デプロイ前に独自MCPサーバーをデバッグ",
        "部署前调试自定义 MCP 服务器",
        "تصحيح خادم MCP قبل النشر"
    ],
    "Exploring available tools on a third-party MCP server before wiring them into an AI agent": [
        "एजेंट में जोड़ने से पहले अन्य MCP सर्वर के टूल खोजें",
        "Explorar herramientas MCP antes de integrarlas en un agente",
        "Explorer les outils MCP avant intégration à un agent",
        "MCP-Werkzeuge vor der Agentenintegration entdecken",
        "エージェント統合前に外部MCPツールを調査",
        "集成代理前探索第三方 MCP 工具",
        "استكشاف أدوات MCP قبل دمجها في وكيل"
    ],
    "Validating that a server's input/output schemas match what your agent expects": [
        "एजेंट की अपेक्षा से इनपुट/आउटपुट स्कीमा मिलाएँ",
        "Comprobar esquemas de entrada y salida esperados por el agente",
        "Vérifier les schémas d’entrée/sortie attendus par l’agent",
        "Erwartete Ein-/Ausgabeschemata des Agenten prüfen",
        "エージェントが期待する入出力スキーマを確認",
        "检查输入输出模式是否符合代理预期",
        "فحص مخططات الإدخال والإخراج المتوقعة للوكيل"
    ],
    "Diagnosing CORS and proxy connectivity issues in CI or staging environments": [
        "CI या staging में CORS और प्रॉक्सी समस्याएँ जाँचें",
        "Diagnosticar CORS y proxies en CI o staging",
        "Diagnostiquer CORS et le proxy en CI ou préproduction",
        "CORS und Proxy in CI oder Staging diagnostizieren",
        "CIやステージング環境でCORSとプロキシを診断",
        "诊断 CI 或预发布环境的 CORS 与代理问题",
        "تشخيص CORS والوكيل في CI أو بيئة الاختبار"
    ],
    "Testing OAuth-protected MCP servers by pasting an access token directly": [
        "access token चिपकाकर OAuth-सुरक्षित MCP सर्वर जाँचें",
        "Probar servidores MCP protegidos por OAuth con un token",
        "Tester un serveur MCP protégé par OAuth avec un jeton",
        "OAuth-geschützte MCP-Server mit Zugriffstoken testen",
        "アクセストークンを貼り付けてOAuth保護MCPサーバーをテスト",
        "粘贴访问令牌以测试受 OAuth 保护的 MCP 服务器",
        "اختبار خوادم MCP المحمية بـOAuth باستخدام رمز وصول"
    ],
    "Connecting to MCP servers behind mTLS or custom CA certificates via the SSL/TLS panel": [
        "SSL/TLS से mTLS या कस्टम CA वाले MCP सर्वर जोड़ें",
        "Conectar a MCP con mTLS o CA personalizada mediante SSL/TLS",
        "Connecter un serveur MCP avec mTLS ou CA personnalisée via SSL/TLS",
        "MCP-Server mit mTLS oder eigener CA über SSL/TLS verbinden",
        "SSL/TLSからmTLSや独自CAを使うMCPサーバーに接続",
        "通过 SSL/TLS 连接使用 mTLS 或自定义 CA 的 MCP 服务器",
        "الاتصال بخوادم MCP ذات mTLS أو CA مخصصة عبر SSL/TLS"
    ],
    "To keep traffic 100% in-browser:": [
        "सारा ट्रैफ़िक ब्राउज़र में रखने के लिए:",
        "Para mantener el tráfico en el navegador:",
        "Pour garder le trafic dans le navigateur :",
        "Für vollständig browserseitigen Verkehr:",
        "通信をブラウザー内に保つには：",
        "要将所有流量保留在浏览器中：",
        "لإبقاء كل حركة المرور في المتصفح:"
    ],
    "configure your MCP server with": [
        "MCP सर्वर पर सेट करें",
        "configura tu servidor MCP con",
        "configurez votre serveur MCP avec",
        "MCP-Server konfigurieren mit",
        "MCPサーバーで設定：",
        "请在 MCP 服务器配置",
        "اضبط خادم MCP باستخدام"
    ],
    "and": [
        "और",
        "y",
        "et",
        "und",
        "および",
        "和",
        "و"
    ],
    ". Direct browser fetch will then succeed and no proxy badges will appear.": [
        "। सीधे अनुरोध सफल होने पर प्रॉक्सी बैज नहीं दिखेंगे।",
        ". Si la solicitud directa funciona, no aparecerán indicadores de proxy.",
        ". Si la requête directe réussit, aucun badge de proxy n’apparaît.",
        ". Bei erfolgreichem Direktzugriff erscheinen keine Proxy-Badges.",
        "。直接要求が成功すれば、プロキシのバッジは表示されません。",
        "。直接请求成功后将不显示代理徽标。",
        ". عند نجاح الطلب المباشر لن تظهر شارات الوكيل."
    ],
    "Payload doesn't look like an MCP config (missing mcpServers)": [
        "MCP config में mcpServers नहीं मिला",
        "La configuración MCP no contiene mcpServers",
        "La configuration MCP ne contient pas mcpServers",
        "MCP-Konfiguration enthält kein mcpServers",
        "MCP設定にmcpServersがありません",
        "MCP 配置中缺少 mcpServers",
        "إعداد MCP لا يحتوي على mcpServers"
    ],
    "MCP server config loaded into the connection form below": [
        "MCP सर्वर config कनेक्शन फ़ॉर्म में लोड हुआ",
        "Configuración MCP cargada en el formulario de conexión",
        "Configuration MCP chargée dans le formulaire de connexion",
        "MCP-Konfiguration ins Verbindungsformular geladen",
        "MCPサーバー設定を接続フォームに読み込みました",
        "MCP 服务器配置已加载到连接表单",
        "تم تحميل إعداد MCP في نموذج الاتصال"
    ],
    "Payload isn't valid JSON": [
        "डेटा मान्य JSON नहीं है",
        "Los datos no son JSON válido",
        "Les données ne sont pas un JSON valide",
        "Daten sind kein gültiges JSON",
        "データは有効なJSONではありません",
        "数据不是有效的 JSON",
        "البيانات ليست JSON صالحًا"
    ],
    "Connected": [
        "कनेक्ट किया गया",
        "Conectado",
        "Connecté",
        "Verbunden",
        "接続済み",
        "已连接",
        "متصل"
    ],
    "Browser direct fetch was blocked by CORS — auto-fell back to /api/proxy. Switch Connection Type to 'Via Server Proxy' to skip this fallback in future, or fix CORS on the agent.": [
        "CORS ने सीधा अनुरोध रोका, इसलिए /api/proxy से भेजा गया। Server Proxy चुनें या सर्वर की CORS सेटिंग ठीक करें।",
        "CORS bloqueó el acceso directo; se usó /api/proxy. Elige Server Proxy o corrige CORS en el servidor.",
        "CORS a bloqué l’accès direct ; /api/proxy a été utilisé. Choisissez Server Proxy ou corrigez CORS.",
        "CORS blockierte den Direktzugriff; /api/proxy wurde verwendet. Server Proxy wählen oder CORS am Server korrigieren.",
        "CORSで直接要求がブロックされたため/api/proxyを使用しました。Server Proxyを選ぶか、サーバーのCORSを修正してください。",
        "CORS 阻止了直接请求，已改用 /api/proxy。请选择 Server Proxy 或修正服务器 CORS。",
        "حظر CORS الطلب المباشر، فاستُخدم /api/proxy. اختر Server Proxy أو صحّح CORS على الخادم."
    ],
    "CORS fallback": [
        "CORS वैकल्पिक मार्ग",
        "Reintento por CORS",
        "Repli CORS",
        "CORS-Ausweichroute",
        "CORS代替経路",
        "CORS 回退",
        "مسار CORS البديل"
    ],
    "Requests are being routed through this app's /api/proxy (chosen by your Connection Type or required by SSL config).": [
        "चुने कनेक्शन प्रकार या SSL config के कारण अनुरोध इस ऐप के /api/proxy से भेजे जाते हैं।",
        "Las solicitudes pasan por /api/proxy según el tipo de conexión o la configuración SSL.",
        "Les requêtes passent par /api/proxy selon le type de connexion ou la configuration SSL.",
        "Anfragen laufen entsprechend Verbindungstyp oder SSL-Konfiguration über /api/proxy.",
        "接続方式またはSSL設定により、このアプリの/api/proxy経由で要求を送信します。",
        "请求按连接类型或 SSL 配置经由此应用的 /api/proxy 发送。",
        "تُرسل الطلبات عبر /api/proxy لهذا التطبيق وفق نوع الاتصال أو إعداد SSL."
    ],
    "via proxy": [
        "प्रॉक्सी से",
        "por proxy",
        "via proxy",
        "über Proxy",
        "プロキシ経由",
        "经代理",
        "عبر الوكيل"
    ],
    "MCP protocol version": [
        "MCP प्रोटोकॉल संस्करण",
        "Versión del protocolo MCP",
        "Version du protocole MCP",
        "MCP-Protokollversion",
        "MCPプロトコルバージョン",
        "MCP 协议版本",
        "إصدار بروتوكول MCP"
    ],
    "Auto · modern 2026-07-28, then supported legacy": [
        "स्वतः · पहले 2026-07-28, फिर समर्थित पुराने संस्करण",
        "Auto · 2026-07-28, luego versiones anteriores compatibles",
        "Auto · 2026-07-28, puis versions précédentes prises en charge",
        "Automatisch · 2026-07-28, dann unterstützte ältere Versionen",
        "自動 · 2026-07-28を試し、対応する旧版へ",
        "自动 · 先尝试 2026-07-28，再尝试受支持的旧版",
        "تلقائي · 2026-07-28 ثم الإصدارات السابقة المدعومة"
    ],
    "2026-07-28 · stateless": [
        "2026-07-28 · बिना सत्र स्थिति",
        "2026-07-28 · sin estado",
        "2026-07-28 · sans état",
        "2026-07-28 · zustandslos",
        "2026-07-28 · ステートレス",
        "2026-07-28 · 无状态",
        "2026-07-28 · عديم الحالة"
    ],
    "Connection Type": [
        "कनेक्शन प्रकार",
        "Tipo de conexión",
        "Type de connexion",
        "Verbindungstyp",
        "接続方式",
        "连接类型",
        "نوع الاتصال"
    ],
    "Direct (auto-fallback):": [
        "सीधा (स्वतः वैकल्पिक मार्ग):",
        "Directa (reintento automático):",
        "Directe (repli automatique) :",
        "Direkt (automatischer Ersatz):",
        "直接（自動代替）：",
        "直连（自动回退）：",
        "مباشر (بديل تلقائي):"
    ],
    "browser → MCP server. If a CORS error occurs, automatically retries through this app's /api/proxy.": [
        "ब्राउज़र → MCP सर्वर। CORS त्रुटि पर ऐप के /api/proxy से पुनः प्रयास होता है।",
        "Navegador → servidor MCP. Reintenta por /api/proxy si falla CORS.",
        "Navigateur → serveur MCP. Réessaie via /api/proxy si CORS échoue.",
        "Browser → MCP-Server. Bei CORS-Fehlern erneuter Versuch über /api/proxy.",
        "ブラウザー → MCPサーバー。CORS失敗時は/api/proxyで再試行します。",
        "浏览器 → MCP 服务器。CORS 失败时通过 /api/proxy 重试。",
        "المتصفح ← خادم MCP. يعيد المحاولة عبر /api/proxy عند فشل CORS."
    ],
    "Direct (strict):": [
        "सीधा (सख्त):",
        "Directa (estricta):",
        "Directe (stricte) :",
        "Direkt (strikt):",
        "直接（厳密）：",
        "直连（严格）：",
        "مباشر (صارم):"
    ],
    "direct only — surfaces CORS errors instead of falling back. Useful for debugging CORS configuration on the agent.": [
        "केवल सीधा अनुरोध; CORS त्रुटि दिखाई जाती है, वैकल्पिक मार्ग नहीं लिया जाता।",
        "Solo acceso directo: muestra los errores CORS sin usar un proxy alternativo.",
        "Accès direct uniquement : affiche les erreurs CORS sans repli.",
        "Nur Direktzugriff: CORS-Fehler werden ohne Ausweichroute angezeigt.",
        "直接要求のみ。CORSエラー時に代替せず表示するため、設定の診断に使えます。",
        "仅直接请求：显示 CORS 错误，不回退到代理，便于调试配置。",
        "طلبات مباشرة فقط؛ تُعرض أخطاء CORS دون استخدام مسار بديل."
    ],
    "Via Server Proxy:": [
        "सर्वर प्रॉक्सी से:",
        "Por proxy del servidor:",
        "Via proxy serveur :",
        "Über Serverproxy:",
        "サーバープロキシ経由：",
        "经服务器代理：",
        "عبر وكيل الخادم:"
    ],
    "always routes through /api/proxy. Bypasses browser CORS entirely; required for SSL/TLS options.": [
        "हमेशा /api/proxy से भेजता है। ब्राउज़र CORS लागू नहीं होता; SSL/TLS विकल्पों के लिए आवश्यक।",
        "Siempre usa /api/proxy. Evita CORS del navegador; es necesario para las opciones SSL/TLS.",
        "Utilise toujours /api/proxy. Évite CORS du navigateur ; requis pour les options SSL/TLS.",
        "Immer über /api/proxy. Umgeht Browser-CORS; für SSL/TLS-Optionen erforderlich.",
        "常に/api/proxyを使用。ブラウザーのCORSを回避し、SSL/TLS設定に必要です。",
        "始终经由 /api/proxy。绕过浏览器 CORS；SSL/TLS 选项需要此模式。",
        "يستخدم /api/proxy دائمًا. يتجاوز CORS للمتصفح وهو مطلوب لخيارات SSL/TLS."
    ],
    "Via MCP Proxy:": [
        "MCP प्रॉक्सी से:",
        "Por proxy MCP:",
        "Via proxy MCP :",
        "Über MCP-Proxy:",
        "MCPプロキシ経由：",
        "经 MCP 代理：",
        "عبر وكيل MCP:"
    ],
    "tunnels through the user-run": [
        "स्थानीय रूप से चलाए गए",
        "usa el proceso local",
        "utilise le processus local",
        "nutzt den lokal gestarteten",
        "ローカルで実行した",
        "通过用户本地运行的",
        "عبر العملية المحلية"
    ],
    "proxy at the configured address (with session token).": [
        "प्रॉक्सी का पता और session token उपयोग करता है।",
        "con la dirección y el token de sesión configurados.",
        "avec l’adresse et le jeton de session configurés.",
        "mit konfigurierter Adresse und Sitzungstoken.",
        "プロキシに設定済みアドレスとセッショントークンで接続します。",
        "代理，使用配置的地址和会话令牌。",
        "باستخدام عنوان الوكيل ورمز الجلسة المضبوطين."
    ],
    "Direct (auto-fallback)": [
        "सीधा (स्वतः वैकल्पिक मार्ग)",
        "Directa (reintento automático)",
        "Directe (repli automatique)",
        "Direkt (automatischer Ersatz)",
        "直接（自動代替）",
        "直连（自动回退）",
        "مباشر (بديل تلقائي)"
    ],
    "Direct (strict)": [
        "सीधा (सख्त)",
        "Directa (estricta)",
        "Directe (stricte)",
        "Direkt (strikt)",
        "直接（厳密）",
        "直连（严格）",
        "مباشر (صارم)"
    ],
    "Via Server Proxy": [
        "सर्वर प्रॉक्सी से",
        "Por proxy del servidor",
        "Via proxy serveur",
        "Über Serverproxy",
        "サーバープロキシ経由",
        "经服务器代理",
        "عبر وكيل الخادم"
    ],
    "Via MCP Proxy": [
        "MCP प्रॉक्सी से",
        "Por proxy MCP",
        "Via proxy MCP",
        "Über MCP-Proxy",
        "MCPプロキシ経由",
        "经 MCP 代理",
        "عبر وكيل MCP"
    ],
    "Test connectivity to the server: tries direct fetch, CORS preflight, and the server proxy. Recommends a Connection Type based on the results.": [
        "सीधे अनुरोध, CORS preflight और सर्वर प्रॉक्सी जाँचकर उपयुक्त कनेक्शन प्रकार सुझाएँ।",
        "Prueba acceso directo, preflight CORS y proxy para recomendar un tipo de conexión.",
        "Teste l’accès direct, le preflight CORS et le proxy pour conseiller un type de connexion.",
        "Direktzugriff, CORS-Preflight und Proxy prüfen und Verbindungstyp empfehlen.",
        "直接要求、CORSプリフライト、プロキシをテストし、接続方式を推奨します。",
        "测试直接请求、CORS 预检和代理，并推荐连接类型。",
        "اختبر الطلب المباشر وCORS preflight والوكيل لاقتراح نوع الاتصال."
    ],
    "Diagnose": [
        "निदान करें",
        "Diagnosticar",
        "Diagnostiquer",
        "Diagnose",
        "診断",
        "诊断",
        "تشخيص"
    ],
    "Connection Diagnostic": [
        "कनेक्शन निदान",
        "Diagnóstico de conexión",
        "Diagnostic de connexion",
        "Verbindungsdiagnose",
        "接続診断",
        "连接诊断",
        "تشخيص الاتصال"
    ],
    "cross-origin": [
        "अन्य मूल",
        "otro origen",
        "origine différente",
        "ursprungsübergreifend",
        "異なるオリジン",
        "跨源",
        "عبر أصول مختلفة"
    ],
    "same-origin": [
        "समान मूल",
        "mismo origen",
        "même origine",
        "gleicher Ursprung",
        "同一オリジン",
        "同源",
        "من الأصل نفسه"
    ],
    "Recommendation:": [
        "सुझाव:",
        "Recomendación:",
        "Recommandation :",
        "Empfehlung:",
        "推奨：",
        "建议：",
        "التوصية:"
    ],
    "Generated command (run in your terminal):": [
        "बना कमांड (टर्मिनल में चलाएँ):",
        "Comando generado (ejecutar en terminal):",
        "Commande générée (à exécuter dans le terminal) :",
        "Erzeugter Befehl (im Terminal ausführen):",
        "生成コマンド（ターミナルで実行）：",
        "生成的命令（请在终端运行）：",
        "الأمر المولّد (شغّله في الطرفية):"
    ],
    "Copy command": [
        "कमांड कॉपी करें",
        "Copiar comando",
        "Copier la commande",
        "Befehl kopieren",
        "コマンドをコピー",
        "复制命令",
        "نسخ الأمر"
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
    "header(s)": [
        "हेडर",
        "cabeceras",
        "en-têtes",
        "Header",
        "ヘッダー",
        "标头",
        "ترويسات"
    ],
    "OAuth token": [
        "OAuth टोकन",
        "Token OAuth",
        "Jeton OAuth",
        "OAuth-Token",
        "OAuthトークン",
        "OAuth 令牌",
        "رمز OAuth"
    ],
    "Custom Headers": [
        "कस्टम हेडर",
        "Cabeceras personalizadas",
        "En-têtes personnalisés",
        "Eigene Header",
        "カスタムヘッダー",
        "自定义标头",
        "ترويسات مخصصة"
    ],
    "Add header": [
        "हेडर जोड़ें",
        "Añadir cabecera",
        "Ajouter un en-tête",
        "Header hinzufügen",
        "ヘッダーを追加",
        "添加标头",
        "إضافة ترويسة"
    ],
    "OAuth 2.0 Flow": [
        "OAuth 2.0 प्रवाह",
        "Flujo OAuth 2.0",
        "Flux OAuth 2.0",
        "OAuth-2.0-Ablauf",
        "OAuth 2.0フロー",
        "OAuth 2.0 流程",
        "تدفق OAuth 2.0"
    ],
    "When an access token is set it will be sent as 'Authorization: Bearer <token>'. Other fields are stored for documentation; full browser-side OAuth requires server-side token exchange.": [
        "access token होने पर Authorization: Bearer <token> भेजा जाता है। अन्य फ़ील्ड दस्तावेज़ीकरण के लिए हैं; पूरा OAuth token exchange सर्वर सहायता माँगता है।",
        "El token se envía como Authorization: Bearer <token>. Los demás campos son informativos; un intercambio OAuth completo requiere soporte del servidor.",
        "Le jeton est envoyé comme Authorization: Bearer <token>. Les autres champs sont documentaires ; l’échange OAuth complet nécessite le serveur.",
        "Das Token wird als Authorization: Bearer <token> gesendet. Andere Felder dienen der Dokumentation; vollständiger OAuth-Austausch erfordert Serverunterstützung.",
        "トークンはAuthorization: Bearer <token>で送信します。他の項目は記録用で、完全なOAuth交換にはサーバー側の処理が必要です。",
        "访问令牌以 Authorization: Bearer <token> 发送。其他字段仅供记录；完整 OAuth 交换需要服务器支持。",
        "يُرسل الرمز بصيغة Authorization: Bearer <token>. الحقول الأخرى للتوثيق؛ تبادل OAuth الكامل يحتاج دعم الخادم."
    ],
    "Client ID": [
        "क्लाइंट ID",
        "ID de cliente",
        "ID client",
        "Client-ID",
        "クライアントID",
        "客户端 ID",
        "معرّف العميل"
    ],
    "Client Secret (optional)": [
        "क्लाइंट सीक्रेट (वैकल्पिक)",
        "Secreto del cliente (opcional)",
        "Secret client (facultatif)",
        "Client-Geheimnis (optional)",
        "クライアントシークレット（任意）",
        "客户端密钥（可选）",
        "سر العميل (اختياري)"
    ],
    "Client Secret": [
        "क्लाइंट सीक्रेट",
        "Secreto del cliente",
        "Secret client",
        "Client-Geheimnis",
        "クライアントシークレット",
        "客户端密钥",
        "سر العميل"
    ],
    "Redirect URL": [
        "रीडायरेक्ट URL",
        "URL de redirección",
        "URL de redirection",
        "Weiterleitungs-URL",
        "リダイレクトURL",
        "重定向 URL",
        "عنوان إعادة التوجيه"
    ],
    "Scope (space-separated)": [
        "स्कोप (स्पेस से अलग)",
        "Ámbitos (separados por espacios)",
        "Portées (séparées par des espaces)",
        "Berechtigungen (durch Leerzeichen getrennt)",
        "スコープ（スペース区切り）",
        "范围（以空格分隔）",
        "النطاقات (تفصلها مسافات)"
    ],
    "Token URL (optional)": [
        "टोकन URL (वैकल्पिक)",
        "URL del token (opcional)",
        "URL du jeton (facultative)",
        "Token-URL (optional)",
        "トークンURL（任意）",
        "令牌 URL（可选）",
        "عنوان الرمز (اختياري)"
    ],
    "Access Token": [
        "एक्सेस टोकन",
        "Token de acceso",
        "Jeton d’accès",
        "Zugriffstoken",
        "アクセストークン",
        "访问令牌",
        "رمز الوصول"
    ],
    "Paste a pre-obtained access token": [
        "पहले से मिला access token चिपकाएँ",
        "Pega un token de acceso ya obtenido",
        "Collez un jeton d’accès déjà obtenu",
        "Vorhandenes Zugriffstoken einfügen",
        "取得済みのアクセストークンを貼り付け",
        "粘贴已获取的访问令牌",
        "الصق رمز وصول حصلت عليه مسبقًا"
    ],
    "Configuration": [
        "कॉन्फ़िगरेशन",
        "Configuración",
        "Configuration",
        "Konfiguration",
        "設定",
        "配置",
        "الإعدادات"
    ],
    "Task TTL · extension not supported": [
        "Task TTL · एक्सटेंशन समर्थित नहीं",
        "TTL de tarea · extensión no compatible",
        "TTL de tâche · extension non prise en charge",
        "Task-TTL · Erweiterung nicht unterstützt",
        "タスクTTL · 拡張非対応",
        "任务 TTL · 不支持此扩展",
        "TTL للمهمة · الامتداد غير مدعوم"
    ],
    "Fixed request deadline · progress reset unavailable": [
        "निश्चित समयसीमा · प्रगति रीसेट उपलब्ध नहीं",
        "Plazo fijo · sin reinicio por progreso",
        "Délai fixe · sans remise à zéro sur progression",
        "Feste Frist · kein Zurücksetzen durch Fortschritt",
        "固定期限 · 進捗によるリセット不可",
        "固定期限 · 无法按进度重置",
        "مهلة ثابتة · لا إعادة ضبط مع التقدم"
    ],
    "This inspector uses a fixed deadline, including when progress events arrive.": [
        "प्रगति घटनाओं पर भी इस निरीक्षक की समयसीमा निश्चित रहती है।",
        "El plazo sigue siendo fijo aunque lleguen eventos de progreso.",
        "Le délai reste fixe même avec des événements de progression.",
        "Die Frist bleibt auch bei Fortschrittsereignissen unverändert.",
        "進捗イベントを受信しても、要求期限は固定のままです。",
        "即使收到进度事件，此检查器的请求期限也保持固定。",
        "تبقى مهلة الفاحص ثابتة حتى عند وصول أحداث التقدم."
    ],
    "Inspector Proxy (only used when Connection Type = \"Via MCP Proxy\")": [
        "Inspector Proxy (केवल Via MCP Proxy के लिए)",
        "Inspector Proxy (solo para Via MCP Proxy)",
        "Inspector Proxy (uniquement avec Via MCP Proxy)",
        "Inspector Proxy (nur bei Via MCP Proxy)",
        "Inspector Proxy（Via MCP Proxyのみ）",
        "Inspector Proxy（仅用于 Via MCP Proxy）",
        "Inspector Proxy (عند استخدام Via MCP Proxy فقط)"
    ],
    "Run the official inspector locally to get these values": [
        "इन मानों के लिए आधिकारिक inspector स्थानीय रूप से चलाएँ",
        "Ejecuta el inspector oficial localmente para obtener estos valores",
        "Exécutez l’inspecteur officiel localement pour obtenir ces valeurs",
        "Offiziellen Inspector lokal starten, um diese Werte zu erhalten",
        "これらの値を取得するには公式inspectorをローカル実行してください",
        "在本地运行官方 inspector 以获取这些值",
        "شغّل الفاحص الرسمي محليًا للحصول على هذه القيم"
    ],
    "It will print the proxy address (default": [
        "यह प्रॉक्सी पता दिखाएगा (डिफ़ॉल्ट",
        "Mostrará la dirección del proxy (por defecto",
        "Il affiche l’adresse du proxy (par défaut",
        "Er zeigt die Proxy-Adresse (Standard",
        "プロキシアドレス（既定：",
        "它会显示代理地址（默认",
        "سيعرض عنوان الوكيل (الافتراضي"
    ],
    ") and a session token. Paste both below.": [
        ") और session token। दोनों नीचे चिपकाएँ।",
        ") y un token de sesión. Pega ambos debajo.",
        ") et un jeton de session. Collez-les ci-dessous.",
        ") und Sitzungstoken. Beide unten einfügen.",
        "）とセッショントークンが表示されます。以下に貼り付けてください。",
        "）和会话令牌。请将两者粘贴到下方。",
        ") ورمز الجلسة. الصقهما أدناه."
    ],
    "Inspector Proxy Address": [
        "Inspector प्रॉक्सी पता",
        "Dirección del proxy Inspector",
        "Adresse du proxy Inspector",
        "Inspector-Proxy-Adresse",
        "Inspectorプロキシアドレス",
        "Inspector 代理地址",
        "عنوان وكيل Inspector"
    ],
    "Set this if you are running the MCP Inspector Proxy on a non-default address. Example: http://10.1.1.22:5577": [
        "गैर-डिफ़ॉल्ट MCP Inspector Proxy पता दर्ज करें, जैसे http://10.1.1.22:5577",
        "Introduce una dirección de MCP Inspector Proxy distinta de la predeterminada, como http://10.1.1.22:5577",
        "Saisissez une adresse MCP Inspector Proxy différente, par exemple http://10.1.1.22:5577",
        "Abweichende MCP-Inspector-Proxy-Adresse eingeben, z. B. http://10.1.1.22:5577",
        "既定以外のMCP Inspector Proxyアドレスを入力します。例：http://10.1.1.22:5577",
        "输入非默认的 MCP Inspector Proxy 地址，例如 http://10.1.1.22:5577",
        "أدخل عنوان MCP Inspector Proxy غير الافتراضي، مثل http://10.1.1.22:5577"
    ],
    "Proxy Session Token": [
        "प्रॉक्सी session token",
        "Token de sesión del proxy",
        "Jeton de session du proxy",
        "Proxy-Sitzungstoken",
        "プロキシのセッショントークン",
        "代理会话令牌",
        "رمز جلسة الوكيل"
    ],
    "Session token for authenticating with the MCP Proxy Server (displayed in proxy console on startup as 🔑 Session token: ...)": [
        "MCP Proxy Server के startup console में दिखा session token दर्ज करें।",
        "Introduce el token mostrado al iniciar MCP Proxy Server en su consola.",
        "Saisissez le jeton affiché dans la console au démarrage de MCP Proxy Server.",
        "Beim Start von MCP Proxy Server in der Konsole angezeigtes Sitzungstoken eingeben.",
        "MCP Proxy Serverの起動時にコンソールに表示されるセッショントークンを入力してください。",
        "输入 MCP Proxy Server 启动时在控制台显示的会话令牌。",
        "أدخل رمز الجلسة المعروض في وحدة تحكم MCP Proxy Server عند بدء التشغيل."
    ],
    "configured": [
        "सेट किया गया",
        "configurado",
        "configuré",
        "konfiguriert",
        "設定済み",
        "已配置",
        "تم الإعداد"
    ],
    "Tools": [
        "टूल",
        "Herramientas",
        "Outils",
        "Werkzeuge",
        "ツール",
        "工具",
        "الأدوات"
    ],
    "Available Tools": [
        "उपलब्ध टूल",
        "Herramientas disponibles",
        "Outils disponibles",
        "Verfügbare Werkzeuge",
        "利用可能なツール",
        "可用工具",
        "الأدوات المتاحة"
    ],
    "Not connected": [
        "कनेक्ट नहीं है",
        "Sin conexión",
        "Non connecté",
        "Nicht verbunden",
        "未接続",
        "未连接",
        "غير متصل"
    ],
    "No tools found": [
        "कोई टूल नहीं मिला",
        "No se encontraron herramientas",
        "Aucun outil trouvé",
        "Keine Werkzeuge gefunden",
        "ツールが見つかりません",
        "未找到工具",
        "لم يُعثر على أدوات"
    ],
    "Call": [
        "कॉल करें",
        "Invocar",
        "Appeler",
        "Aufrufen",
        "呼び出し",
        "调用",
        "استدعاء"
    ],
    "Arguments (JSON)": [
        "तर्क (JSON)",
        "Argumentos (JSON)",
        "Arguments (JSON)",
        "Argumente (JSON)",
        "引数（JSON）",
        "参数（JSON）",
        "الوسائط (JSON)"
    ],
    "Input Schema": [
        "इनपुट स्कीमा",
        "Esquema de entrada",
        "Schéma d’entrée",
        "Eingabeschema",
        "入力スキーマ",
        "输入模式",
        "مخطط الإدخال"
    ],
    "Call History": [
        "कॉल इतिहास",
        "Historial de llamadas",
        "Historique des appels",
        "Aufrufverlauf",
        "呼び出し履歴",
        "调用历史",
        "سجل الاستدعاءات"
    ],
    "No calls yet": [
        "अभी कोई कॉल नहीं",
        "Todavía no hay llamadas",
        "Aucun appel pour le moment",
        "Noch keine Aufrufe",
        "呼び出しはまだありません",
        "暂无调用",
        "لا توجد استدعاءات بعد"
    ],
    "Args": [
        "तर्क",
        "Argumentos",
        "Arguments",
        "Argumente",
        "引数",
        "参数",
        "الوسائط"
    ],
    "A2A 0.3 · previous version": [
        "A2A 0.3 · पिछला संस्करण",
        "A2A 0.3 · versión anterior",
        "A2A 0.3 · version précédente",
        "A2A 0.3 · vorherige Version",
        "A2A 0.3 · 旧版",
        "A2A 0.3 · 旧版",
        "A2A 0.3 · إصدار سابق"
    ],
    "Legacy draft (tasks/*)": [
        "पुराना ड्राफ़्ट (tasks/*)",
        "Borrador antiguo (tasks/*)",
        "Ancien brouillon (tasks/*)",
        "Älterer Entwurf (tasks/*)",
        "旧ドラフト（tasks/*）",
        "旧版草案（tasks/*）",
        "المسودة القديمة (tasks/*)"
    ],
    "Present": [
        "मौजूद",
        "Presente",
        "Présent",
        "Vorhanden",
        "あり",
        "存在",
        "موجود"
    ],
    "Required field missing": [
        "आवश्यक फ़ील्ड नहीं है",
        "Falta un campo obligatorio",
        "Champ obligatoire absent",
        "Pflichtfeld fehlt",
        "必須項目がありません",
        "缺少必填字段",
        "حقل مطلوب مفقود"
    ],
    "A2A 1.0 JSONRPC interface declared": [
        "A2A 1.0 JSONRPC इंटरफ़ेस घोषित है",
        "Interfaz JSONRPC A2A 1.0 declarada",
        "Interface JSONRPC A2A 1.0 déclarée",
        "A2A-1.0-JSONRPC-Schnittstelle deklariert",
        "A2A 1.0 JSONRPCインターフェース定義済み",
        "已声明 A2A 1.0 JSONRPC 接口",
        "تم إعلان واجهة A2A 1.0 JSONRPC"
    ],
    "A2A 1.0 requires an interface; this inspector exercises JSONRPC only": [
        "A2A 1.0 को इंटरफ़ेस चाहिए; यह निरीक्षक केवल JSONRPC जाँचता है",
        "A2A 1.0 requiere una interfaz; este inspector solo ejercita JSONRPC",
        "A2A 1.0 exige une interface ; cet inspecteur teste uniquement JSONRPC",
        "A2A 1.0 erfordert eine Schnittstelle; hier wird nur JSONRPC geprüft",
        "A2A 1.0にはインターフェースが必要です。このツールはJSONRPCのみを使用します",
        "A2A 1.0 需要接口；此检查器仅测试 JSONRPC",
        "يتطلب A2A 1.0 واجهة؛ يختبر هذا الفاحص JSONRPC فقط"
    ],
    "Must be a valid HTTP/HTTPS URL": [
        "मान्य HTTP/HTTPS URL आवश्यक है",
        "Debe ser una URL HTTP/HTTPS válida",
        "URL HTTP/HTTPS valide requise",
        "Gültige HTTP-/HTTPS-URL erforderlich",
        "有効なHTTP/HTTPS URLが必要です",
        "必须是有效的 HTTP/HTTPS URL",
        "يجب أن يكون عنوان HTTP/HTTPS صالحًا"
    ],
    "Recommended — not present": [
        "सुझाया गया — मौजूद नहीं",
        "Recomendado, pero ausente",
        "Recommandé — absent",
        "Empfohlen — nicht vorhanden",
        "推奨項目なし",
        "建议提供，但未填写",
        "موصى به — غير موجود"
    ],
    "No skills declared": [
        "कोई skill घोषित नहीं है",
        "No se declararon habilidades",
        "Aucune compétence déclarée",
        "Keine Fähigkeiten deklariert",
        "スキルが定義されていません",
        "未声明技能",
        "لم تُعلن مهارات"
    ],
    "Not declared": [
        "घोषित नहीं है",
        "No declarado",
        "Non déclaré",
        "Nicht deklariert",
        "未定義",
        "未声明",
        "غير معلن"
    ],
    "No auth schemes declared — agent may be open": [
        "कोई प्रमाणीकरण योजना नहीं है — एजेंट खुला हो सकता है",
        "Sin esquemas de autenticación; el agente podría estar abierto",
        "Aucun schéma d’authentification ; l’agent pourrait être ouvert",
        "Keine Authentifizierung deklariert; Agent könnte offen sein",
        "認証方式が未定義です。公開エージェントの可能性があります",
        "未声明身份验证方案，代理可能开放访问",
        "لم تُعلن مخططات مصادقة؛ قد يكون الوكيل مفتوحًا"
    ],
    "Fix the agent URL.": [
        "एजेंट URL ठीक करें।",
        "Corrige la URL del agente.",
        "Corrigez l’URL de l’agent.",
        "Agenten-URL korrigieren.",
        "エージェントURLを修正してください。",
        "请修正代理 URL。",
        "صحّح عنوان الوكيل."
    ],
    "Enter an agent URL": [
        "एजेंट URL दर्ज करें",
        "Introduce una URL de agente",
        "Saisissez l’URL d’un agent",
        "Agenten-URL eingeben",
        "エージェントURLを入力",
        "输入代理 URL",
        "أدخل عنوان الوكيل"
    ],
    "Agent card found at legacy path /.well-known/agent.json — consider switching protocol to 'Legacy draft'": [
        "कार्ड पुराने /.well-known/agent.json पथ पर मिला; Legacy draft प्रोटोकॉल चुनने पर विचार करें",
        "Tarjeta encontrada en /.well-known/agent.json; considera el protocolo Borrador antiguo",
        "Carte trouvée à /.well-known/agent.json ; envisagez le protocole Ancien brouillon",
        "Karte unter altem Pfad /.well-known/agent.json gefunden; älteren Entwurf erwägen",
        "旧パス/.well-known/agent.jsonでカードを検出しました。旧ドラフトへの切り替えを検討してください",
        "在旧路径 /.well-known/agent.json 找到卡片；请考虑选择旧版草案协议",
        "عُثر على البطاقة في /.well-known/agent.json القديم؛ جرّب بروتوكول المسودة القديمة"
    ],
    "Agent has not declared streaming capability — try anyway?": [
        "एजेंट ने स्ट्रीमिंग घोषित नहीं की — फिर भी आज़माएँ?",
        "El agente no declara streaming; ¿quieres probar igualmente?",
        "L’agent ne déclare pas le streaming ; essayer quand même ?",
        "Agent hat Streaming nicht deklariert — trotzdem versuchen?",
        "ストリーミング未定義です。このまま試しますか？",
        "代理未声明流式功能，仍要尝试吗？",
        "لم يعلن الوكيل دعم البث — هل تريد المحاولة؟"
    ],
    "Task fetched": [
        "टास्क मिला",
        "Tarea obtenida",
        "Tâche récupérée",
        "Task abgerufen",
        "タスクを取得しました",
        "已获取任务",
        "تم جلب المهمة"
    ],
    "Cancellation requested": [
        "रद्द करने का अनुरोध भेजा गया",
        "Cancelación solicitada",
        "Annulation demandée",
        "Abbruch angefordert",
        "キャンセルを要求しました",
        "已请求取消",
        "طُلب الإلغاء"
    ],
    "Connect, discover, and test Agent-to-Agent (A2A) protocol agents": [
        "Agent-to-Agent (A2A) एजेंट खोजें, जोड़ें और जाँचें",
        "Conecta, descubre y prueba agentes Agent-to-Agent (A2A)",
        "Connecter, découvrir et tester des agents Agent-to-Agent (A2A)",
        "Agent-to-Agent-(A2A-)Agenten verbinden, entdecken und testen",
        "Agent-to-Agent（A2A）エージェントの接続・検出・テスト",
        "连接、发现和测试 Agent-to-Agent（A2A）代理",
        "اتصل بوكلاء Agent-to-Agent ‏(A2A) واكتشفهم واختبرهم"
    ],
    "A2A is an open agent interoperability protocol. This inspector checks selected Agent Card fields and exercises the JSONRPC binding: A2A 1.0 SendMessage, SendStreamingMessage, GetTask and CancelTask. A2A 0.3 and older draft methods are explicitly selectable. REST, gRPC, push subscriptions, and full schema conformance are outside this inspector’s coverage.": [
        "A2A एजेंटों के बीच खुला प्रोटोकॉल है। यह निरीक्षक चुनिंदा कार्ड फ़ील्ड और JSONRPC से A2A 1.0 SendMessage, SendStreamingMessage, GetTask, CancelTask जाँचता है। A2A 0.3 और पुराने ड्राफ़्ट चुन सकते हैं। REST, gRPC, push subscriptions और पूर्ण स्कीमा अनुरूपता शामिल नहीं हैं।",
        "A2A es un protocolo abierto entre agentes. Este inspector revisa campos seleccionados de la tarjeta y JSONRPC A2A 1.0: SendMessage, SendStreamingMessage, GetTask y CancelTask. Permite A2A 0.3 y borradores antiguos. No cubre REST, gRPC, suscripciones push ni conformidad completa.",
        "A2A est un protocole ouvert entre agents. Cet inspecteur vérifie certains champs de carte et JSONRPC A2A 1.0 : SendMessage, SendStreamingMessage, GetTask et CancelTask. A2A 0.3 et les anciens brouillons sont sélectionnables. REST, gRPC, abonnements push et conformité complète sont exclus.",
        "A2A ist ein offenes Agentenprotokoll. Der Inspektor prüft ausgewählte Kartenfelder und A2A-1.0-JSONRPC mit SendMessage, SendStreamingMessage, GetTask und CancelTask. A2A 0.3 und ältere Entwürfe sind wählbar. REST, gRPC, Push-Abos und vollständige Schemakonformität sind nicht abgedeckt.",
        "A2Aはエージェント間の公開プロトコルです。カードの一部項目とA2A 1.0 JSONRPCのSendMessage、SendStreamingMessage、GetTask、CancelTaskを確認します。0.3と旧ドラフトも選択可能です。REST、gRPC、push購読、完全なスキーマ適合性は対象外です。",
        "A2A 是开放的代理互操作协议。此检查器检查部分卡片字段，并测试 A2A 1.0 JSONRPC 的 SendMessage、SendStreamingMessage、GetTask、CancelTask。可选择 0.3 和旧版草案。不涵盖 REST、gRPC、推送订阅或完整模式符合性。",
        "A2A بروتوكول مفتوح بين الوكلاء. يفحص حقولًا محددة من البطاقة وJSONRPC في A2A 1.0 عبر SendMessage وSendStreamingMessage وGetTask وCancelTask. يمكن اختيار 0.3 والمسودات القديمة. لا يشمل REST أو gRPC أو اشتراكات الدفع أو المطابقة الكاملة للمخطط."
    ],
    "Building or integrating A2A agents requires verifying the card structure, exercising message flows, tracking multi-turn context IDs, and debugging raw JSON-RPC exchange. This inspector covers the JSON-RPC discovery, messaging and task surface — discovery, skill testing, streaming responses, task lifecycle management — with support for all auth schemes, mTLS, custom headers, and A2A 1.0 JSON-RPC, A2A 0.3 and the legacy draft format.": [
        "कार्ड संरचना, संदेश, contextId और raw JSON-RPC देखकर A2A एकीकरण डिबग करें। discovery, skills, streaming और tasks के साथ auth, custom headers तथा mTLS के विकल्प उपलब्ध हैं।",
        "Depura integraciones A2A revisando tarjeta, mensajes, contextId y JSON-RPC sin procesar. Incluye descubrimiento, habilidades, streaming y tareas con autenticación, cabeceras y mTLS.",
        "Déboguez A2A avec la carte, les messages, contextId et JSON-RPC brut. Découvrez les compétences, le streaming et les tâches avec authentification, en-têtes et mTLS.",
        "A2A-Integration anhand von Karte, Nachrichten, contextId und rohem JSON-RPC debuggen. Discovery, Fähigkeiten, Streaming und Tasks mit Authentifizierung, Headern und mTLS prüfen.",
        "カード、メッセージ、contextId、生のJSON-RPCを確認してA2A統合をデバッグします。検出、スキル、ストリーミング、タスクに加え、認証、独自ヘッダー、mTLSを設定できます。",
        "通过卡片、消息、contextId 和原始 JSON-RPC 调试 A2A 集成。支持发现、技能、流式响应和任务，以及身份验证、自定义标头和 mTLS 配置。",
        "صحّح تكامل A2A بمراجعة البطاقة والرسائل وcontextId وJSON-RPC الخام. اختبر الاكتشاف والمهارات والبث والمهام مع المصادقة والترويسات وmTLS."
    ],
    "Enter the agent's base URL (the root, not the card path — the inspector appends /.well-known/agent-card.json automatically)": [
        "एजेंट का मूल URL दर्ज करें; /.well-known/agent-card.json स्वतः जोड़ा जाता है।",
        "Introduce la URL raíz del agente; se añade /.well-known/agent-card.json automáticamente.",
        "Saisissez l’URL racine de l’agent ; /.well-known/agent-card.json est ajouté automatiquement.",
        "Basis-URL des Agenten eingeben; /.well-known/agent-card.json wird automatisch ergänzt.",
        "エージェントのベースURLを入力します。/.well-known/agent-card.jsonは自動追加されます。",
        "输入代理根 URL；检查器会自动追加 /.well-known/agent-card.json。",
        "أدخل عنوان الوكيل الأساسي؛ يُضاف /.well-known/agent-card.json تلقائيًا."
    ],
    "Choose the Protocol Version: A2A 1.0 uses SendMessage and supportedInterfaces; A2A 0.3 uses message/send; Legacy Draft uses tasks/send and agent.json — switch if you get a 404 on discovery": [
        "संस्करण चुनें: 1.0 में SendMessage और supportedInterfaces; 0.3 में message/send; पुराने ड्राफ़्ट में tasks/send और agent.json। discovery 404 पर संस्करण जाँचें।",
        "Elige versión: 1.0 usa SendMessage y supportedInterfaces; 0.3, message/send; el borrador antiguo, tasks/send y agent.json. Revisa la versión ante un 404.",
        "Choisissez la version : 1.0 utilise SendMessage et supportedInterfaces ; 0.3, message/send ; l’ancien brouillon, tasks/send et agent.json. Vérifiez la version en cas de 404.",
        "Version wählen: 1.0 nutzt SendMessage und supportedInterfaces; 0.3 message/send; ältere Entwürfe tasks/send und agent.json. Bei Discovery-404 Version prüfen.",
        "1.0はSendMessageとsupportedInterfaces、0.3はmessage/send、旧ドラフトはtasks/sendとagent.jsonを使用します。検出が404ならバージョンを確認してください。",
        "选择版本：1.0 使用 SendMessage 和 supportedInterfaces；0.3 使用 message/send；旧草案使用 tasks/send 和 agent.json。发现返回 404 时请检查版本。",
        "اختر الإصدار: يستخدم 1.0 ‏SendMessage وsupportedInterfaces؛ ويستخدم 0.3 ‏message/send؛ والمسودة القديمة tasks/send وagent.json. راجع الإصدار عند خطأ اكتشاف 404."
    ],
    "Set the Connection Type: 'Direct (auto-fallback)' tries a browser fetch and retries via /api/proxy on CORS failure; 'Direct (strict)' surfaces errors; 'Via Server Proxy' always routes server-side — streaming is supported through /api/proxy-stream which pipes SSE events back chunk-by-chunk": [
        "Direct स्वतः मोड CORS पर /api/proxy से पुनः प्रयास करता है; strict मोड त्रुटि दिखाता है। Server Proxy हमेशा सर्वर से भेजता है; /api/proxy-stream SSE chunks लौटाता है।",
        "Direct automático reintenta por /api/proxy si falla CORS; el estricto muestra el error. Server Proxy siempre usa el servidor; /api/proxy-stream devuelve bloques SSE.",
        "Direct automatique réessaie via /api/proxy si CORS échoue ; le mode strict affiche l’erreur. Server Proxy passe toujours par le serveur ; /api/proxy-stream relaie les blocs SSE.",
        "Automatisch direkt weicht bei CORS auf /api/proxy aus; strikt direkt zeigt Fehler. Server Proxy nutzt immer den Server; /api/proxy-stream leitet SSE-Blöcke weiter.",
        "自動DirectはCORS失敗時に/api/proxyで再試行し、strictはエラーを表示します。Server Proxyは常にサーバー経由で、/api/proxy-streamがSSEを逐次返します。",
        "自动直连在 CORS 失败时通过 /api/proxy 重试；严格模式显示错误。Server Proxy 始终经服务器发送，/api/proxy-stream 逐块转发 SSE。",
        "يعيد Direct التلقائي المحاولة عبر /api/proxy عند فشل CORS؛ ويعرض الصارم الخطأ. يستخدم Server Proxy الخادم دائمًا ويعيد /api/proxy-stream كتل SSE تدريجيًا."
    ],
    "Click Diagnose to test direct fetch, OPTIONS preflight, and proxy connectivity — it recommends the best Connection Type before you start": [
        "शुरू करने से पहले Diagnose से सीधे अनुरोध, OPTIONS और प्रॉक्सी जाँचें तथा कनेक्शन सुझाव देखें।",
        "Antes de empezar, diagnostica acceso directo, OPTIONS y proxy para ver la conexión recomendada.",
        "Avant de commencer, diagnostiquez accès direct, OPTIONS et proxy pour obtenir un conseil de connexion.",
        "Vor dem Start Direktzugriff, OPTIONS und Proxy diagnostizieren und Empfehlung prüfen.",
        "開始前に直接要求、OPTIONS、プロキシを診断し、推奨接続方式を確認します。",
        "开始前诊断直接请求、OPTIONS 和代理，以获取连接建议。",
        "قبل البدء، شخّص الطلب المباشر وOPTIONS والوكيل لمعرفة الاتصال المقترح."
    ],
    "Open the Authentication panel to configure Bearer token, HTTP Basic, API Key, or OAuth 2.0 — values are applied to every request": [
        "Authentication में Bearer, HTTP Basic, API key या OAuth 2.0 सेट करें; हर अनुरोध में लागू होता है।",
        "Configura Bearer, HTTP Basic, clave API u OAuth 2.0 en Autenticación; se aplica a cada solicitud.",
        "Configurez Bearer, HTTP Basic, clé API ou OAuth 2.0 dans Authentification ; appliqué à chaque requête.",
        "Bearer, HTTP Basic, API-Schlüssel oder OAuth 2.0 unter Authentifizierung setzen; gilt für jede Anfrage.",
        "認証でBearer、HTTP Basic、APIキー、OAuth 2.0を設定します。すべての要求に適用されます。",
        "在身份验证中配置 Bearer、HTTP Basic、API 密钥或 OAuth 2.0；将应用于每个请求。",
        "اضبط Bearer أو HTTP Basic أو مفتاح API أو OAuth 2.0 في المصادقة؛ تُطبق على كل طلب."
    ],
    "Add Custom Headers for any non-standard headers the agent requires": [
        "एजेंट के लिए आवश्यक अतिरिक्त कस्टम हेडर जोड़ें",
        "Añade las cabeceras adicionales que requiera el agente",
        "Ajoutez les en-têtes supplémentaires requis par l’agent",
        "Zusätzliche vom Agenten benötigte Header hinzufügen",
        "エージェントに必要なカスタムヘッダーを追加",
        "添加代理需要的自定义标头",
        "أضف الترويسات المخصصة التي يحتاجها الوكيل"
    ],
    "Click Discover to fetch and validate the Agent Card; compliance checks highlight missing required fields": [
        "Discover से Agent Card लोड करें; जाँचें आवश्यक फ़ील्ड की कमी दिखाती हैं।",
        "Pulsa Descubrir para cargar la tarjeta; las comprobaciones señalan campos obligatorios ausentes.",
        "Cliquez sur Découvrir pour charger la carte ; les vérifications signalent les champs requis absents.",
        "Entdecken lädt die Agentenkarte; Prüfungen zeigen fehlende Pflichtfelder.",
        "検出を押してAgent Cardを読み込み、必須項目の不足を確認します。",
        "点击发现以加载代理卡片；检查结果会指出缺少的必填字段。",
        "اضغط اكتشاف لتحميل بطاقة الوكيل؛ تُظهر الفحوص الحقول المطلوبة المفقودة."
    ],
    "In the Skills tab, select a skill and send a test message; the agent's response is shown with the raw JSON-RPC payload in Debug": [
        "Skills में skill चुनकर परीक्षण संदेश भेजें; Debug में raw JSON-RPC देखें।",
        "Elige una habilidad y envía un mensaje de prueba; revisa el JSON-RPC en Depurar.",
        "Choisissez une compétence et envoyez un test ; consultez JSON-RPC brut dans Débogage.",
        "Fähigkeit wählen und Testnachricht senden; rohes JSON-RPC unter Debug prüfen.",
        "スキルを選んでテストメッセージを送り、デバッグで生のJSON-RPCを確認します。",
        "选择技能并发送测试消息；在调试中查看原始 JSON-RPC。",
        "اختر مهارة وأرسل رسالة اختبار؛ راجع JSON-RPC الخام في التصحيح."
    ],
    "Use Chat for multi-turn conversations — context IDs are tracked automatically so the agent maintains state across turns": [
        "बहु-चरण वार्तालाप के लिए Chat चुनें; contextId स्वतः रखा जाता है।",
        "Usa Chat para conversaciones de varios turnos; contextId se conserva automáticamente.",
        "Utilisez Discussion pour plusieurs échanges ; contextId est conservé automatiquement.",
        "Chat für mehrstufige Gespräche verwenden; contextId bleibt automatisch erhalten.",
        "複数ターンの会話にはチャットを使います。contextIdを自動的に引き継ぎます。",
        "使用聊天进行多轮对话；contextId 会自动保留。",
        "استخدم المحادثة لعدة جولات؛ يُحفظ contextId تلقائيًا."
    ],
    "Use Streaming to call message/stream and watch SSE events arrive token-by-token in real time": [
        "Streaming से संदेश की SSE घटनाएँ वास्तविक समय में देखें।",
        "Usa Streaming para observar eventos SSE del mensaje en tiempo real.",
        "Utilisez Streaming pour observer les événements SSE du message en temps réel.",
        "Mit Streaming SSE-Nachrichtenereignisse in Echtzeit verfolgen.",
        "ストリーミングでメッセージのSSEイベントをリアルタイム表示します。",
        "使用流式功能实时观察消息 SSE 事件。",
        "استخدم البث لمشاهدة أحداث SSE للرسائل مباشرة."
    ],
    "Use Tasks to look up a task by ID or cancel an in-progress task": [
        "Tasks में ID से टास्क खोजें या चल रहा टास्क रद्द करें",
        "Busca una tarea por ID o cancélala en Tareas",
        "Recherchez une tâche par ID ou annulez-la dans Tâches",
        "Unter Tasks nach ID suchen oder laufenden Task abbrechen",
        "タスクでID検索や実行中タスクのキャンセル",
        "在任务中按 ID 查找或取消进行中的任务",
        "ابحث عن مهمة بمعرّفها أو ألغِ المهمة الجارية"
    ],
    "Open the SSL/TLS panel to configure custom CA bundles, client certificates (mTLS), and whether to verify server certificates": [
        "SSL/TLS में CA bundle, client certificate और सर्वर प्रमाणपत्र सत्यापन सेट करें।",
        "Configura CA, certificado de cliente y verificación del servidor en SSL/TLS.",
        "Configurez CA, certificat client et vérification du serveur dans SSL/TLS.",
        "CA, Clientzertifikat und Serverzertifikatsprüfung unter SSL/TLS konfigurieren.",
        "SSL/TLSでCA、クライアント証明書、サーバー証明書の検証を設定します。",
        "在 SSL/TLS 中配置 CA、客户端证书和服务器证书验证。",
        "اضبط CA وشهادة العميل والتحقق من شهادة الخادم في SSL/TLS."
    ],
    "Streaming uses fetch + ReadableStream instead of EventSource so custom Authorization headers are honoured": [
        "Streaming fetch + ReadableStream का उपयोग करता है, इसलिए कस्टम Authorization हेडर भेजे जाते हैं।",
        "Streaming usa fetch + ReadableStream para admitir cabeceras Authorization personalizadas.",
        "Le streaming utilise fetch + ReadableStream pour transmettre les en-têtes Authorization personnalisés.",
        "Streaming nutzt fetch + ReadableStream und unterstützt eigene Authorization-Header.",
        "ストリーミングはfetch + ReadableStreamを使うため、独自Authorizationヘッダーを送信できます。",
        "流式功能使用 fetch + ReadableStream，因此可发送自定义 Authorization 标头。",
        "يستخدم البث fetch + ReadableStream لإرسال ترويسات Authorization المخصصة."
    ],
    "A2A 1.0 uses member-based parts such as {text: ...}, ROLE_USER and versioned supportedInterfaces. A2A 0.3 uses kind; the legacy draft uses type. Select the matching version explicitly.": [
        "A2A 1.0 में {text: ...}, ROLE_USER और versioned supportedInterfaces हैं। 0.3 में kind तथा पुराने ड्राफ़्ट में type है। सही संस्करण चुनें।",
        "A2A 1.0 usa {text: ...}, ROLE_USER y supportedInterfaces versionadas; 0.3 usa kind y el borrador antiguo type. Elige la versión correcta.",
        "A2A 1.0 utilise {text: ...}, ROLE_USER et supportedInterfaces versionnées ; 0.3 utilise kind, l’ancien brouillon type. Choisissez la bonne version.",
        "A2A 1.0 nutzt {text: ...}, ROLE_USER und versionierte supportedInterfaces. 0.3 nutzt kind, ältere Entwürfe type. Passende Version wählen.",
        "A2A 1.0は{text: ...}、ROLE_USER、バージョン付きsupportedInterfacesを使用します。0.3はkind、旧ドラフトはtypeです。適合する版を選択してください。",
        "A2A 1.0 使用 {text: ...}、ROLE_USER 和带版本的 supportedInterfaces。0.3 使用 kind，旧草案使用 type。请明确选择匹配的版本。",
        "يستخدم A2A 1.0 ‏{text: ...} وROLE_USER وsupportedInterfaces بإصداراتها. يستخدم 0.3 ‏kind والمسودة القديمة type. اختر الإصدار المطابق."
    ],
    "Context IDs (contextId) persist across chat turns so the agent can maintain conversation state — visible in the Debug tab": [
        "contextId अगले Chat संदेशों में रखा जाता है; Debug में देखें।",
        "contextId persiste entre turnos de Chat; consúltalo en Depurar.",
        "contextId persiste entre les échanges ; consultez-le dans Débogage.",
        "contextId bleibt zwischen Chatnachrichten erhalten; unter Debug sichtbar.",
        "contextIdはチャットの各ターンで維持され、デバッグで確認できます。",
        "contextId 会在多轮聊天中保留，可在调试中查看。",
        "يبقى contextId بين جولات المحادثة ويمكن عرضه في التصحيح."
    ],
    "SSL/TLS configuration (CA bundle, client cert, mTLS key) routes traffic through the server-side proxy; streaming continues to work via /api/proxy-stream which keeps a persistent SSE pipe between server and browser": [
        "कस्टम CA/client certificate/mTLS पर सर्वर प्रॉक्सी लगता है। /api/proxy-stream से SSE स्ट्रीम जारी रहती है।",
        "CA personalizada, certificado de cliente o mTLS usan el proxy del servidor; SSE sigue mediante /api/proxy-stream.",
        "CA personnalisée, certificat client ou mTLS passent par le proxy serveur ; SSE continue via /api/proxy-stream.",
        "Eigene CA, Clientzertifikat oder mTLS nutzen den Serverproxy; SSE bleibt über /api/proxy-stream verfügbar.",
        "独自CA、クライアント証明書、mTLSはサーバープロキシ経由です。/api/proxy-streamでSSEを継続できます。",
        "自定义 CA、客户端证书或 mTLS 会使用服务器代理；SSE 仍通过 /api/proxy-stream 工作。",
        "تستخدم CA المخصصة أو شهادة العميل أو mTLS وكيل الخادم؛ ويستمر SSE عبر /api/proxy-stream."
    ],
    "CORS fallback (orange badge) means the browser direct fetch was blocked — add 'Access-Control-Allow-Origin: *' to the agent to eliminate the extra hop": [
        "नारंगी CORS fallback का अर्थ सीधा अनुरोध रुका। एजेंट पर Access-Control-Allow-Origin: * से अतिरिक्त मार्ग हट सकता है।",
        "CORS fallback naranja significa bloqueo directo. Access-Control-Allow-Origin: * en el agente puede evitar el salto adicional.",
        "Le badge orange CORS fallback indique un blocage direct. Access-Control-Allow-Origin: * sur l’agent peut éviter le détour.",
        "Orangefarbenes CORS-Fallback zeigt eine Direktzugriffssperre. Access-Control-Allow-Origin: * am Agenten kann den Umweg vermeiden.",
        "オレンジのCORS fallbackは直接要求のブロックを示します。エージェントのAccess-Control-Allow-Origin: *で追加経路を回避できます。",
        "橙色 CORS fallback 表示直连被阻止；代理配置 Access-Control-Allow-Origin: * 可避免额外跳转。",
        "تعني شارة CORS fallback البرتقالية حظر الاتصال المباشر. قد يمنع Access-Control-Allow-Origin: * على الوكيل القفزة الإضافية."
    ],
    "The Debug tab shows every outbound request and inbound response in raw JSON-RPC format — useful for validating payload structure against the spec": [
        "Debug में सभी भेजे अनुरोध और प्राप्त प्रतिक्रियाएँ raw JSON-RPC में दिखते हैं।",
        "Depurar muestra cada solicitud y respuesta en JSON-RPC sin procesar.",
        "Débogage affiche toutes les requêtes et réponses en JSON-RPC brut.",
        "Debug zeigt sämtliche Anfragen und Antworten als rohes JSON-RPC.",
        "デバッグにすべての送受信を生のJSON-RPCで表示します。",
        "调试会以原始 JSON-RPC 显示每个请求和响应。",
        "يعرض التصحيح كل الطلبات والردود بصيغة JSON-RPC الخام."
    ],
    "Compliance checks on the card tab flag missing required fields (name, url, version) and warn on optional ones (skills, capabilities, securitySchemes)": [
        "कार्ड जाँचें चुनिंदा आवश्यक फ़ील्ड और वैकल्पिक skills, capabilities, securitySchemes की कमी बताती हैं।",
        "Las comprobaciones señalan campos seleccionados y ausencia de skills, capabilities o securitySchemes opcionales.",
        "Les vérifications signalent les champs sélectionnés et l’absence de skills, capabilities ou securitySchemes facultatifs.",
        "Kartenprüfungen melden ausgewählte Pflichtfelder und fehlende optionale skills, capabilities oder securitySchemes.",
        "カードの選択項目と、任意のskills、capabilities、securitySchemesの不足を確認します。",
        "卡片检查会指出选定字段及可选 skills、capabilities、securitySchemes 的缺失。",
        "تشير فحوص البطاقة إلى الحقول المختارة وغياب skills وcapabilities وsecuritySchemes الاختيارية."
    ],
    "Bearer tokens and API keys from the Authentication panel are sent on every request, including streaming — you don't need to add them to Custom Headers separately": [
        "Authentication में दिया Bearer token या API key स्ट्रीमिंग सहित हर अनुरोध में भेजा जाता है; अलग हेडर न जोड़ें।",
        "Los tokens Bearer y claves API se envían en cada solicitud, incluido streaming; no los dupliques en cabeceras.",
        "Les jetons Bearer et clés API sont envoyés à chaque requête, y compris streaming ; inutile de les dupliquer.",
        "Bearer-Token und API-Schlüssel werden bei allen Anfragen einschließlich Streaming gesendet; nicht als Header doppeln.",
        "認証のBearerトークンとAPIキーはストリーミングを含む各要求に送信されます。ヘッダーに重複追加する必要はありません。",
        "身份验证中的 Bearer 令牌和 API 密钥会用于每个请求，包括流式请求；无需在自定义标头中重复添加。",
        "تُرسل رموز Bearer ومفاتيح API في كل طلب بما فيه البث؛ لا تكررها في الترويسات."
    ],
    "Validating a newly built A2A agent's card structure and spec compliance before publishing": [
        "प्रकाशन से पहले एजेंट कार्ड के चुनिंदा फ़ील्ड जाँचें",
        "Revisar campos seleccionados de la tarjeta antes de publicar",
        "Vérifier certains champs de la carte avant publication",
        "Ausgewählte Kartenfelder vor Veröffentlichung prüfen",
        "公開前にカードの選択項目を確認",
        "发布前检查代理卡片的选定字段",
        "فحص حقول محددة من بطاقة الوكيل قبل النشر"
    ],
    "Debugging multi-turn conversations and tracking contextId continuity across turns": [
        "बहु-चरण वार्तालाप में contextId निरंतरता जाँचें",
        "Depurar la continuidad de contextId entre turnos",
        "Déboguer la continuité de contextId entre échanges",
        "contextId-Kontinuität zwischen Gesprächsschritten prüfen",
        "複数ターンでcontextIdの連続性をデバッグ",
        "调试多轮对话中 contextId 的连续性",
        "تصحيح استمرارية contextId بين جولات المحادثة"
    ],
    "Testing the full task lifecycle: submitted → working → completed (or failed/cancelled)": [
        "टास्क अवस्थाएँ जाँचें: submitted → working → completed या failed/cancelled",
        "Probar estados: submitted → working → completed o failed/cancelled",
        "Tester les états : submitted → working → completed ou failed/cancelled",
        "Task-Zustände prüfen: submitted → working → completed oder failed/cancelled",
        "タスク状態を確認：submitted → working → completedまたはfailed/cancelled",
        "测试任务状态：submitted → working → completed 或 failed/cancelled",
        "اختبار الحالات: submitted → working → completed أو failed/cancelled"
    ],
    "Exercising streaming responses and verifying SSE event framing matches the spec": [
        "स्ट्रीमिंग प्रतिक्रियाएँ और SSE framing जाँचें",
        "Probar respuestas en streaming y formato SSE",
        "Tester les réponses en streaming et le format SSE",
        "Streamingantworten und SSE-Framing prüfen",
        "ストリーミング応答とSSEフレーミングを確認",
        "测试流式响应与 SSE 分帧",
        "اختبار ردود البث وتأطير SSE"
    ],
    "Testing agents protected by Bearer tokens, Basic auth, API keys, or OAuth 2.0": [
        "Bearer, Basic, API key या OAuth 2.0 से सुरक्षित एजेंट जाँचें",
        "Probar agentes protegidos con Bearer, Basic, clave API u OAuth 2.0",
        "Tester les agents protégés par Bearer, Basic, clé API ou OAuth 2.0",
        "Mit Bearer, Basic, API-Schlüssel oder OAuth 2.0 geschützte Agenten testen",
        "Bearer、Basic、APIキー、OAuth 2.0保護エージェントをテスト",
        "测试受 Bearer、Basic、API 密钥或 OAuth 2.0 保护的代理",
        "اختبار وكلاء محميين بـBearer أو Basic أو مفتاح API أو OAuth 2.0"
    ],
    "Connecting to agents behind mTLS or custom certificate authorities via the SSL/TLS panel": [
        "SSL/TLS से mTLS या कस्टम CA वाले एजेंट जोड़ें",
        "Conectar agentes con mTLS o CA personalizada mediante SSL/TLS",
        "Connecter des agents avec mTLS ou CA personnalisée via SSL/TLS",
        "Agenten mit mTLS oder eigener CA über SSL/TLS verbinden",
        "SSL/TLSでmTLSや独自CAを使うエージェントに接続",
        "通过 SSL/TLS 连接使用 mTLS 或自定义 CA 的代理",
        "الاتصال بوكلاء مع mTLS أو CA مخصصة عبر SSL/TLS"
    ],
    "Smoke-testing A2A agent endpoints in CI/CD after deployment": [
        "परिनियोजन के बाद CI/CD में A2A endpoints जाँचें",
        "Probar endpoints A2A en CI/CD tras desplegar",
        "Tester les endpoints A2A en CI/CD après déploiement",
        "A2A-Endpunkte nach Bereitstellung in CI/CD prüfen",
        "デプロイ後にCI/CDでA2Aエンドポイントをテスト",
        "部署后在 CI/CD 中测试 A2A 端点",
        "اختبار نقاط A2A في CI/CD بعد النشر"
    ],
    "Exploring a third-party agent's available skills before integrating it into your system": [
        "एकीकरण से पहले अन्य एजेंट की skills खोजें",
        "Explorar habilidades de otro agente antes de integrarlo",
        "Explorer les compétences d’un agent avant intégration",
        "Fähigkeiten fremder Agenten vor Integration entdecken",
        "統合前に外部エージェントのスキルを調査",
        "集成前探索第三方代理的技能",
        "استكشاف مهارات وكيل خارجي قبل الدمج"
    ],
    "Payload doesn't look like an agent card (missing name and endpoint)": [
        "एजेंट कार्ड में name या endpoint नहीं मिला",
        "La tarjeta no contiene name o endpoint",
        "La carte ne contient pas name ou endpoint",
        "Agentenkarte ohne name oder Endpunkt",
        "カードにnameまたはエンドポイントがありません",
        "代理卡片缺少 name 或端点",
        "بطاقة الوكيل تفتقد name أو نقطة الاتصال"
    ],
    "Agent card loaded — skills and capabilities are populated below without fetching": [
        "कार्ड लोड हुआ — skills और capabilities बिना अनुरोध के भर दिए गए",
        "Tarjeta cargada: habilidades y capacidades completadas sin solicitudes",
        "Carte chargée : compétences et capacités remplies sans requête",
        "Karte geladen: Fähigkeiten und Funktionen ohne Netzabruf ausgefüllt",
        "カードを読み込みました。ネットワーク取得なしでスキルと機能を表示します",
        "卡片已加载，未发送请求，技能和能力已填入",
        "حُمّلت البطاقة؛ عُرضت المهارات والقدرات دون طلب شبكة"
    ],
    "Discover": [
        "खोजें",
        "Descubrir",
        "Découvrir",
        "Entdecken",
        "検出",
        "发现",
        "اكتشاف"
    ],
    "Test connectivity: tries direct fetch, OPTIONS preflight, and the server proxy. Recommends a Connection Type based on the results.": [
        "सीधे अनुरोध, OPTIONS और प्रॉक्सी जाँचकर कनेक्शन प्रकार सुझाएँ।",
        "Prueba acceso directo, OPTIONS y proxy para recomendar una conexión.",
        "Teste l’accès direct, OPTIONS et le proxy pour conseiller une connexion.",
        "Direktzugriff, OPTIONS und Proxy prüfen und Verbindung empfehlen.",
        "直接要求、OPTIONS、プロキシをテストし、接続方式を推奨します。",
        "测试直接请求、OPTIONS 和代理，并推荐连接方式。",
        "اختبر الطلب المباشر وOPTIONS والوكيل لاقتراح اتصال."
    ],
    "Protocol:": [
        "प्रोटोकॉल:",
        "Protocolo:",
        "Protocole :",
        "Protokoll:",
        "プロトコル：",
        "协议：",
        "البروتوكول:"
    ],
    "Connection:": [
        "कनेक्शन:",
        "Conexión:",
        "Connexion :",
        "Verbindung:",
        "接続：",
        "连接：",
        "الاتصال:"
    ],
    "browser → agent. Auto-retries via /api/proxy on CORS failure.": [
        "ब्राउज़र → एजेंट। CORS पर /api/proxy से स्वतः पुनः प्रयास।",
        "Navegador → agente. Reintento por /api/proxy si falla CORS.",
        "Navigateur → agent. Repli via /api/proxy si CORS échoue.",
        "Browser → Agent. Bei CORS automatisch über /api/proxy erneut versuchen.",
        "ブラウザー → エージェント。CORS失敗時は/api/proxyで自動再試行。",
        "浏览器 → 代理。CORS 失败时自动通过 /api/proxy 重试。",
        "المتصفح ← الوكيل. إعادة المحاولة عبر /api/proxy عند فشل CORS."
    ],
    "direct only — surfaces CORS errors instead of falling back.": [
        "केवल सीधा; CORS त्रुटियाँ दिखाई जाती हैं।",
        "Solo directa; muestra errores CORS sin reintento.",
        "Direct uniquement ; affiche les erreurs CORS sans repli.",
        "Nur direkt; CORS-Fehler ohne Ausweichroute anzeigen.",
        "直接のみ。CORSエラーを表示し、代替経路は使用しません。",
        "仅直连；显示 CORS 错误，不回退。",
        "مباشر فقط؛ يعرض أخطاء CORS دون بديل."
    ],
    "always server-side. Bypasses browser CORS; required for SSL/TLS options. Streaming uses /api/proxy-stream and works the same as direct.": [
        "हमेशा सर्वर से; CORS लागू नहीं। SSL/TLS के लिए आवश्यक। Streaming /api/proxy-stream से चलता है।",
        "Siempre por servidor, sin CORS del navegador. Necesario para SSL/TLS. Streaming usa /api/proxy-stream.",
        "Toujours côté serveur, sans CORS navigateur. Requis pour SSL/TLS. Streaming via /api/proxy-stream.",
        "Immer serverseitig, ohne Browser-CORS. Für SSL/TLS nötig. Streaming über /api/proxy-stream.",
        "常にサーバー経由でCORSを回避。SSL/TLSに必要です。ストリーミングは/api/proxy-streamを使います。",
        "始终经服务器发送，绕过浏览器 CORS。SSL/TLS 需要此模式，流式使用 /api/proxy-stream。",
        "عبر الخادم دائمًا دون CORS المتصفح. مطلوب لـSSL/TLS. البث عبر /api/proxy-stream."
    ],
    "Direct fetch was blocked by CORS — auto-fell back to /api/proxy. Switch to 'Via Server Proxy' to skip the fallback hop.": [
        "CORS ने सीधा अनुरोध रोका; /api/proxy उपयोग हुआ। अतिरिक्त प्रयास हटाने के लिए Server Proxy चुनें।",
        "CORS bloqueó el acceso directo; se usó /api/proxy. Elige Server Proxy para evitar el reintento.",
        "CORS a bloqué l’accès direct ; /api/proxy a été utilisé. Choisissez Server Proxy pour éviter le repli.",
        "CORS blockierte den Direktzugriff; /api/proxy wurde genutzt. Server Proxy vermeidet den Umweg.",
        "CORSで直接要求がブロックされ、/api/proxyを使用しました。再試行を避けるにはServer Proxyを選択してください。",
        "CORS 阻止直连，已使用 /api/proxy。选择 Server Proxy 可跳过回退步骤。",
        "حظر CORS الطلب المباشر فاستُخدم /api/proxy. اختر Server Proxy لتجنب إعادة المحاولة."
    ],
    "Connection Settings": [
        "कनेक्शन सेटिंग",
        "Configuración de conexión",
        "Paramètres de connexion",
        "Verbindungseinstellungen",
        "接続設定",
        "连接设置",
        "إعدادات الاتصال"
    ],
    "Headers (": [
        "हेडर (",
        "Cabeceras (",
        "En-têtes (",
        "Header (",
        "ヘッダー（",
        "标头（",
        "الترويسات ("
    ],
    "SSL options auto-route through /api/proxy": [
        "SSL विकल्प /api/proxy से स्वतः भेजते हैं",
        "Las opciones SSL usan /api/proxy automáticamente",
        "Les options SSL utilisent automatiquement /api/proxy",
        "SSL-Optionen leiten automatisch über /api/proxy",
        "SSL設定時は自動的に/api/proxy経由",
        "SSL 选项会自动经由 /api/proxy",
        "تستخدم خيارات SSL المسار /api/proxy تلقائيًا"
    ],
    "When any SSL option is set, requests are sent server-side regardless of Connection Type. Streaming is still supported (chunks are piped back via /api/proxy-stream) with your SSL/TLS configuration applied server-side.": [
        "SSL विकल्प सेट होने पर कनेक्शन प्रकार की परवाह किए बिना सर्वर से अनुरोध होता है। /api/proxy-stream SSL config के साथ chunks लौटाता है।",
        "Con opciones SSL, las solicitudes van por el servidor sin importar el modo. /api/proxy-stream devuelve los bloques con esa configuración.",
        "Avec une option SSL, les requêtes passent par le serveur quel que soit le mode. /api/proxy-stream relaie les blocs avec cette configuration.",
        "Bei SSL-Optionen laufen Anfragen unabhängig vom Modus über den Server. /api/proxy-stream leitet Blöcke mit dieser Konfiguration zurück.",
        "SSL設定があると接続方式にかかわらずサーバー経由になります。/api/proxy-streamがその設定でストリームを返します。",
        "设置 SSL 选项后，请求将忽略连接类型并经服务器发送。/api/proxy-stream 使用相同 SSL 配置转发数据块。",
        "عند ضبط SSL تُرسل الطلبات عبر الخادم مهما كان نوع الاتصال. يعيد /api/proxy-stream الكتل باستخدام الإعداد نفسه."
    ],
    "Advanced": [
        "उन्नत",
        "Avanzado",
        "Avancé",
        "Erweitert",
        "詳細設定",
        "高级",
        "متقدم"
    ],
    "Conversation context": [
        "वार्तालाप संदर्भ",
        "Contexto de conversación",
        "Contexte de conversation",
        "Gesprächskontext",
        "会話コンテキスト",
        "对话上下文",
        "سياق المحادثة"
    ],
    "Active:": [
        "सक्रिय:",
        "Activo:",
        "Actif :",
        "Aktiv:",
        "有効：",
        "当前：",
        "نشط:"
    ],
    "Reset context": [
        "संदर्भ रीसेट करें",
        "Restablecer contexto",
        "Réinitialiser le contexte",
        "Kontext zurücksetzen",
        "コンテキストをリセット",
        "重置上下文",
        "إعادة ضبط السياق"
    ],
    "Agent Card": [
        "एजेंट कार्ड",
        "Tarjeta del agente",
        "Carte de l’agent",
        "Agentenkarte",
        "エージェントカード",
        "代理卡片",
        "بطاقة الوكيل"
    ],
    "Provider": [
        "प्रदाता",
        "Proveedor",
        "Fournisseur",
        "Anbieter",
        "提供元",
        "提供方",
        "المزوّد"
    ],
    "Capabilities": [
        "क्षमताएँ",
        "Capacidades",
        "Capacités",
        "Funktionen",
        "機能",
        "能力",
        "القدرات"
    ],
    "Streaming": [
        "स्ट्रीमिंग",
        "Streaming",
        "Diffusion en continu",
        "Streaming",
        "ストリーミング",
        "流式传输",
        "البث"
    ],
    "Push": [
        "पुश",
        "Notificaciones push",
        "Notifications push",
        "Push-Nachrichten",
        "プッシュ",
        "推送",
        "الدفع"
    ],
    "State History": [
        "स्थिति इतिहास",
        "Historial de estados",
        "Historique des états",
        "Zustandsverlauf",
        "状態履歴",
        "状态历史",
        "سجل الحالة"
    ],
    "Input Modes": [
        "इनपुट मोड",
        "Modos de entrada",
        "Modes d’entrée",
        "Eingabemodi",
        "入力モード",
        "输入模式",
        "أوضاع الإدخال"
    ],
    "Output Modes": [
        "आउटपुट मोड",
        "Modos de salida",
        "Modes de sortie",
        "Ausgabemodi",
        "出力モード",
        "输出模式",
        "أوضاع الإخراج"
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
    "Skills (": [
        "Skills (",
        "Habilidades (",
        "Compétences (",
        "Fähigkeiten (",
        "スキル（",
        "技能（",
        "المهارات ("
    ],
    "Test": [
        "परीक्षण",
        "Probar",
        "Tester",
        "Testen",
        "テスト",
        "测试",
        "اختبار"
    ],
    "Selected card checks": [
        "चुनिंदा कार्ड जाँचें",
        "Comprobaciones seleccionadas",
        "Vérifications sélectionnées",
        "Ausgewählte Kartenprüfungen",
        "選択項目の確認",
        "选定卡片检查",
        "فحوص البطاقة المختارة"
    ],
    "Warn": [
        "चेतावनी",
        "Aviso",
        "Avertissement",
        "Warnung",
        "警告",
        "警告",
        "تحذير"
    ],
    "Raw card JSON": [
        "Raw कार्ड JSON",
        "JSON original de la tarjeta",
        "JSON brut de la carte",
        "Rohes Karten-JSON",
        "カードの生JSON",
        "原始卡片 JSON",
        "JSON الخام للبطاقة"
    ],
    "Loading agent card…": [
        "एजेंट कार्ड लोड हो रहा है…",
        "Cargando tarjeta del agente…",
        "Chargement de la carte…",
        "Agentenkarte wird geladen…",
        "エージェントカードを読み込み中…",
        "正在加载代理卡片…",
        "جارٍ تحميل بطاقة الوكيل…"
    ],
    "Skills": [
        "Skills",
        "Habilidades",
        "Compétences",
        "Fähigkeiten",
        "スキル",
        "技能",
        "المهارات"
    ],
    "Discover an agent card first": [
        "पहले एजेंट कार्ड खोजें",
        "Descubre primero una tarjeta de agente",
        "Découvrez d’abord une carte d’agent",
        "Zuerst eine Agentenkarte entdecken",
        "先にエージェントカードを検出してください",
        "请先发现代理卡片",
        "اكتشف بطاقة وكيل أولًا"
    ],
    "This agent declares no skills": [
        "इस एजेंट ने कोई skill घोषित नहीं की",
        "Este agente no declara habilidades",
        "Cet agent ne déclare aucune compétence",
        "Dieser Agent deklariert keine Fähigkeiten",
        "このエージェントはスキルを定義していません",
        "此代理未声明技能",
        "لم يعلن هذا الوكيل مهارات"
    ],
    "Choose skill": [
        "skill चुनें",
        "Elige una habilidad",
        "Choisir une compétence",
        "Fähigkeit wählen",
        "スキルを選択",
        "选择技能",
        "اختر مهارة"
    ],
    "Free-text input. The skill ID is also sent as a structured data part so agents that route by skill can match.": [
        "पाठ इनपुट। skill ID structured data part में भी भेजा जाता है, ताकि एजेंट skill से रूट कर सके।",
        "Entrada de texto. El ID de habilidad también se envía como parte de datos estructurados para permitir el enrutamiento.",
        "Texte libre. L’ID de compétence est aussi envoyé dans une partie structurée pour le routage.",
        "Freitext. Die Fähigkeits-ID wird zusätzlich als strukturierter Datenteil zum Routing gesendet.",
        "自由入力テキストです。スキルIDも構造化データとして送信し、エージェントの振り分けに使えます。",
        "自由文本输入。技能 ID 也会作为结构化数据部分发送，以便代理按技能路由。",
        "نص حر. يُرسل معرّف المهارة أيضًا كجزء بيانات منظم لتمكين التوجيه حسب المهارة."
    ],
    "Select a skill on the left": [
        "बाईं ओर skill चुनें",
        "Selecciona una habilidad a la izquierda",
        "Choisissez une compétence à gauche",
        "Links eine Fähigkeit wählen",
        "左側でスキルを選択",
        "在左侧选择技能",
        "اختر مهارة من اليسار"
    ],
    "Chat": [
        "चैट",
        "Conversación",
        "Discussion",
        "Chat",
        "チャット",
        "聊天",
        "المحادثة"
    ],
    "Tasks": [
        "टास्क",
        "Tareas",
        "Tâches",
        "Tasks",
        "タスク",
        "任务",
        "المهام"
    ],
    "Task lookup & cancel": [
        "टास्क खोजें और रद्द करें",
        "Buscar y cancelar tareas",
        "Rechercher et annuler une tâche",
        "Tasks suchen und abbrechen",
        "タスクの検索とキャンセル",
        "查找和取消任务",
        "البحث عن المهام وإلغاؤها"
    ],
    "Task IDs are returned by message/send (current spec) or from the chat tab's response": [
        "टास्क ID संदेश या चैट की प्रतिक्रिया में मिलता है",
        "Los ID de tarea aparecen en las respuestas de mensajes o del chat",
        "Les ID de tâche figurent dans les réponses des messages ou de la discussion",
        "Task-IDs stehen in Nachrichten- oder Chatantworten",
        "タスクIDはメッセージまたはチャットの応答に含まれます",
        "任务 ID 来自消息或聊天响应",
        "تظهر معرّفات المهام في ردود الرسائل أو المحادثة"
    ],
    "Debug": [
        "डिबग",
        "Depurar",
        "Débogage",
        "Debug",
        "デバッグ",
        "调试",
        "التصحيح"
    ],
    "JSON-RPC 2.0 Messages": [
        "JSON-RPC 2.0 संदेश",
        "Mensajes JSON-RPC 2.0",
        "Messages JSON-RPC 2.0",
        "JSON-RPC-2.0-Nachrichten",
        "JSON-RPC 2.0メッセージ",
        "JSON-RPC 2.0 消息",
        "رسائل JSON-RPC 2.0"
    ],
    "No messages yet": [
        "अभी कोई संदेश नहीं",
        "Todavía no hay mensajes",
        "Aucun message pour le moment",
        "Noch keine Nachrichten",
        "メッセージはまだありません",
        "暂无消息",
        "لا توجد رسائل بعد"
    ],
    "Agent declares the following security schemes": [
        "एजेंट ने ये सुरक्षा योजनाएँ घोषित की हैं",
        "El agente declara estos esquemas de seguridad",
        "L’agent déclare ces schémas de sécurité",
        "Agent deklariert folgende Sicherheitsschemata",
        "エージェントが定義するセキュリティ方式",
        "代理声明了以下安全方案",
        "يعلن الوكيل مخططات الأمان التالية"
    ],
    "Add to": [
        "यहाँ जोड़ें",
        "Añadir a",
        "Ajouter à",
        "Hinzufügen zu",
        "追加先",
        "添加到",
        "إضافة إلى"
    ],
    "Query parameter": [
        "क्वेरी पैरामीटर",
        "Parámetro de consulta",
        "Paramètre de requête",
        "Abfrageparameter",
        "クエリ引数",
        "查询参数",
        "معامل الاستعلام"
    ],
    "Key name": [
        "कुंजी नाम",
        "Nombre de clave",
        "Nom de la clé",
        "Schlüsselname",
        "キー名",
        "键名",
        "اسم المفتاح"
    ],
    "Browser-side OAuth 2.0 flows require server support.": [
        "ब्राउज़र OAuth 2.0 प्रवाह को सर्वर सहायता चाहिए।",
        "Los flujos OAuth 2.0 del navegador requieren soporte del servidor.",
        "Les flux OAuth 2.0 du navigateur nécessitent un serveur.",
        "Browserseitige OAuth-2.0-Abläufe erfordern Serverunterstützung.",
        "ブラウザーでのOAuth 2.0フローにはサーバー側の処理が必要です。",
        "浏览器 OAuth 2.0 流程需要服务器支持。",
        "تحتاج تدفقات OAuth 2.0 في المتصفح دعم الخادم."
    ],
    "Paste a pre-obtained access token below — it will be sent as 'Authorization: <tokenType> <accessToken>'.": [
        "मिला access token चिपकाएँ; Authorization: <tokenType> <accessToken> के रूप में भेजा जाएगा।",
        "Pega un token obtenido: se enviará como Authorization: <tokenType> <accessToken>.",
        "Collez un jeton obtenu : il sera envoyé comme Authorization: <tokenType> <accessToken>.",
        "Vorhandenes Token einfügen; gesendet als Authorization: <tokenType> <accessToken>.",
        "取得済みトークンを貼り付けます。Authorization: <tokenType> <accessToken>で送信します。",
        "粘贴已获取的访问令牌，将以 Authorization: <tokenType> <accessToken> 发送。",
        "الصق رمزًا حصلت عليه؛ يُرسل بصيغة Authorization: <tokenType> <accessToken>."
    ],
    "Token type": [
        "टोकन प्रकार",
        "Tipo de token",
        "Type de jeton",
        "Token-Typ",
        "トークン種別",
        "令牌类型",
        "نوع الرمز"
    ],
    "Access token": [
        "एक्सेस टोकन",
        "Token de acceso",
        "Jeton d’accès",
        "Zugriffstoken",
        "アクセストークン",
        "访问令牌",
        "رمز الوصول"
    ],
    "No custom headers configured.": [
        "कोई कस्टम हेडर सेट नहीं है।",
        "No hay cabeceras personalizadas.",
        "Aucun en-tête personnalisé configuré.",
        "Keine eigenen Header konfiguriert.",
        "カスタムヘッダーは未設定です。",
        "未配置自定义标头。",
        "لم تُضبط ترويسات مخصصة."
    ],
    "Valid JSON object — auto-syncs to form when parseable.": [
        "मान्य JSON object — पार्स होने पर फ़ॉर्म से स्वतः सिंक।",
        "Objeto JSON válido: se sincroniza con el formulario al analizarlo.",
        "Objet JSON valide : synchronisation du formulaire après analyse.",
        "Gültiges JSON-Objekt: synchronisiert bei erfolgreicher Analyse das Formular.",
        "有効なJSONオブジェクトは解析時にフォームと自動同期します。",
        "有效的 JSON 对象，解析成功时自动同步到表单。",
        "كائن JSON صالح؛ تتم مزامنته مع النموذج عند تحليله."
    ],
    "No agent loaded": [
        "कोई एजेंट लोड नहीं है",
        "No hay agente cargado",
        "Aucun agent chargé",
        "Kein Agent geladen",
        "エージェント未読み込み",
        "未加载代理",
        "لم يُحمّل وكيل"
    ],
    "Agent is responding…": [
        "एजेंट उत्तर दे रहा है…",
        "El agente está respondiendo…",
        "L’agent répond…",
        "Agent antwortet…",
        "エージェントが応答中…",
        "代理正在回复…",
        "الوكيل يرد…"
    ],
    "Stop": [
        "रोकें",
        "Detener",
        "Arrêter",
        "Stoppen",
        "停止",
        "停止",
        "إيقاف"
    ],
    "PKCE S256 pair generated locally": [
        "PKCE S256 जोड़ी स्थानीय रूप से बनी",
        "Par PKCE S256 generado localmente",
        "Paire PKCE S256 générée localement",
        "PKCE-S256-Paar lokal erzeugt",
        "PKCE S256ペアをローカル生成しました",
        "已在本地生成 PKCE S256 对",
        "تم إنشاء زوج PKCE S256 محليًا"
    ],
    "This browser cannot generate a PKCE pair.": [
        "यह ब्राउज़र PKCE जोड़ी नहीं बना सकता।",
        "Este navegador no puede generar un par PKCE.",
        "Ce navigateur ne peut pas générer une paire PKCE.",
        "Dieser Browser kann kein PKCE-Paar erzeugen.",
        "このブラウザーではPKCEペアを生成できません。",
        "此浏览器无法生成 PKCE 对。",
        "لا يستطيع هذا المتصفح إنشاء زوج PKCE."
    ],
    "Inspect discovery metadata, generate PKCE S256 values, and assemble a safe authorization request": [
        "Discovery metadata जाँचें, PKCE S256 बनाएँ और authorization अनुरोध तैयार करें",
        "Inspecciona metadatos, genera PKCE S256 y prepara una solicitud de autorización",
        "Inspectez les métadonnées, générez PKCE S256 et préparez une demande d’autorisation",
        "Metadaten prüfen, PKCE S256 erzeugen und Autorisierungsanfrage vorbereiten",
        "検出メタデータの確認、PKCE S256生成、認可要求の作成",
        "检查发现元数据、生成 PKCE S256 并构建授权请求",
        "افحص بيانات الاكتشاف وأنشئ PKCE S256 وجهّز طلب تفويض"
    ],
    "A local OAuth and OpenID Connect configuration workbench. It reviews pasted discovery metadata and creates a cryptographically random PKCE verifier and S256 challenge.": [
        "स्थानीय OAuth/OIDC कार्यक्षेत्र: चिपकाए discovery metadata जाँचता है और सुरक्षित यादृच्छिक PKCE verifier व S256 challenge बनाता है।",
        "Un entorno local OAuth/OIDC que revisa metadatos pegados y genera un verificador PKCE aleatorio criptográfico y su desafío S256.",
        "Un atelier OAuth/OIDC local qui examine les métadonnées collées et crée un vérificateur PKCE aléatoire cryptographique et son challenge S256.",
        "Lokaler OAuth-/OIDC-Arbeitsbereich für eingefügte Metadaten sowie kryptografisch zufällige PKCE-Verifier und S256-Challenges.",
        "貼り付けた検出メタデータを確認し、暗号学的乱数のPKCE verifierとS256 challengeを作るローカルOAuth/OIDCツールです。",
        "本地 OAuth/OIDC 工作台：检查粘贴的发现元数据，并生成加密安全随机的 PKCE verifier 与 S256 challenge。",
        "مساحة OAuth/OIDC محلية تراجع بيانات الاكتشاف الملصقة وتولّد PKCE verifier عشوائيًا تشفيريًا وS256 challenge."
    ],
    "OAuth integration mistakes often appear in redirect URIs, metadata, or PKCE configuration. This gives developers a private preflight before wiring an application to an identity provider.": [
        "पहचान प्रदाता से जोड़ने से पहले redirect URI, metadata और PKCE की समस्याएँ निजी रूप से जाँचें।",
        "Revisa de forma privada errores de URI de redirección, metadatos y PKCE antes de integrar un proveedor.",
        "Vérifiez en privé les URI de redirection, métadonnées et PKCE avant d’intégrer un fournisseur d’identité.",
        "Weiterleitungs-URI, Metadaten und PKCE vor der Anbindung eines Identitätsanbieters lokal prüfen.",
        "IDプロバイダーへの接続前に、リダイレクトURI、メタデータ、PKCEの問題をローカルで確認します。",
        "连接身份提供方前，私密检查重定向 URI、元数据和 PKCE 配置。",
        "افحص أخطاء URI لإعادة التوجيه والبيانات وPKCE محليًا قبل ربط مزوّد الهوية."
    ],
    "Paste an OIDC discovery document": [
        "OIDC discovery दस्तावेज़ चिपकाएँ",
        "Pega un documento de descubrimiento OIDC",
        "Collez un document de découverte OIDC",
        "OIDC-Discovery-Dokument einfügen",
        "OIDC検出ドキュメントを貼り付け",
        "粘贴 OIDC 发现文档",
        "الصق مستند اكتشاف OIDC"
    ],
    "Inspect the required endpoints and S256 support": [
        "आवश्यक endpoint और S256 समर्थन जाँचें",
        "Revisa endpoints obligatorios y soporte S256",
        "Vérifiez les endpoints requis et S256",
        "Erforderliche Endpunkte und S256-Unterstützung prüfen",
        "必須エンドポイントとS256対応を確認",
        "检查必需端点和 S256 支持",
        "افحص نقاط الاتصال المطلوبة ودعم S256"
    ],
    "Generate a PKCE pair": [
        "PKCE जोड़ी बनाएँ",
        "Genera un par PKCE",
        "Générez une paire PKCE",
        "PKCE-Paar erzeugen",
        "PKCEペアを生成",
        "生成 PKCE 对",
        "أنشئ زوج PKCE"
    ],
    "Fill your public client ID, redirect URI, and scopes to preview an authorization URL": [
        "authorization URL के लिए सार्वजनिक client ID, redirect URI और scope भरें",
        "Introduce ID público del cliente, URI de redirección y ámbitos para previsualizar la URL",
        "Saisissez l’ID public, l’URI de redirection et les portées pour prévisualiser l’URL",
        "Öffentliche Client-ID, Weiterleitungs-URI und Berechtigungen für die URL-Vorschau eingeben",
        "公開クライアントID、リダイレクトURI、スコープを入力して認可URLを確認",
        "填写公开客户端 ID、重定向 URI 和范围以预览授权 URL",
        "أدخل معرّف العميل العام وURI لإعادة التوجيه والنطاقات لمعاينة عنوان التفويض"
    ],
    "Never paste a client secret into a browser tool.": [
        "ब्राउज़र टूल में client secret कभी न चिपकाएँ।",
        "Nunca pegues secretos de cliente en una herramienta del navegador.",
        "Ne collez jamais de secret client dans un outil navigateur.",
        "Nie Client-Geheimnisse in ein Browserwerkzeug einfügen.",
        "ブラウザーツールにクライアントシークレットを貼り付けないでください。",
        "请勿在浏览器工具中粘贴客户端密钥。",
        "لا تلصق سر العميل في أداة متصفح."
    ],
    "Use exact registered redirect URIs, not wildcard patterns.": [
        "ठीक पंजीकृत redirect URI उपयोग करें; wildcard नहीं।",
        "Usa URI de redirección registradas exactas, sin comodines.",
        "Utilisez les URI de redirection exactes enregistrées, sans joker.",
        "Exakt registrierte Weiterleitungs-URIs ohne Platzhalter verwenden.",
        "登録済みの正確なリダイレクトURIを使い、ワイルドカードは避けます。",
        "使用精确注册的重定向 URI，不要使用通配符。",
        "استخدم URI مسجلًا مطابقًا لإعادة التوجيه، دون أحرف بدل."
    ],
    "The preview URL is never opened automatically and discovery URLs are never fetched.": [
        "पूर्वावलोकन URL स्वतः नहीं खुलता और discovery URL fetch नहीं होते।",
        "La URL de vista previa no se abre automáticamente ni se obtienen URL de descubrimiento.",
        "La prévisualisation ne s’ouvre pas automatiquement et aucune URL de découverte n’est chargée.",
        "Die Vorschau-URL wird nicht automatisch geöffnet; Discovery-URLs werden nicht abgerufen.",
        "プレビューURLは自動で開きません。検出URLの取得も行いません。",
        "预览 URL 不会自动打开，也不会获取发现 URL。",
        "لا يُفتح عنوان المعاينة تلقائيًا ولا تُجلب عناوين الاكتشاف."
    ],
    "OIDC provider integration": [
        "OIDC प्रदाता एकीकरण",
        "Integración de proveedores OIDC",
        "Intégration d’un fournisseur OIDC",
        "OIDC-Anbieter integrieren",
        "OIDCプロバイダー統合",
        "OIDC 提供方集成",
        "دمج مزوّد OIDC"
    ],
    "PKCE test fixtures": [
        "PKCE परीक्षण नमूने",
        "Ejemplos de prueba PKCE",
        "Exemples de test PKCE",
        "PKCE-Testdaten",
        "PKCEテストデータ",
        "PKCE 测试样本",
        "عينات اختبار PKCE"
    ],
    "Authorization-code flow troubleshooting": [
        "Authorization-code प्रवाह निदान",
        "Diagnóstico del flujo de código de autorización",
        "Diagnostic du flux de code d’autorisation",
        "Autorisierungscode-Ablauf diagnostizieren",
        "認可コードフローの診断",
        "授权码流程故障排查",
        "تشخيص تدفق رمز التفويض"
    ],
    "RFC 9700 · OAuth Security BCP": [
        "RFC 9700 · OAuth सुरक्षा मार्गदर्शन",
        "RFC 9700 · Buenas prácticas de seguridad OAuth",
        "RFC 9700 · Bonnes pratiques de sécurité OAuth",
        "RFC 9700 · OAuth-Sicherheitsempfehlungen",
        "RFC 9700 · OAuthセキュリティ指針",
        "RFC 9700 · OAuth 安全最佳实践",
        "RFC 9700 · أفضل ممارسات أمان OAuth"
    ],
    "Prefer Authorization Code + PKCE S256. Register exact redirects; avoid implicit grants and never use the password grant. Bind and validate state and OIDC nonce in your application; this preview does not complete a login or validate tokens.": [
        "Authorization Code + PKCE S256 चुनें और ठीक redirect पंजीकृत करें। implicit और password grant न उपयोग करें। ऐप में state व OIDC nonce बाँधकर जाँचें। यह preview login पूरा या token validate नहीं करता।",
        "Prefiere Authorization Code + PKCE S256 y redirecciones exactas. Evita concesiones implícitas y de contraseña. Vincula y valida state y nonce OIDC en tu aplicación. Esta vista no inicia sesión ni valida tokens.",
        "Préférez Authorization Code + PKCE S256 et des redirections exactes. Évitez les flux implicite et mot de passe. Liez et vérifiez state et nonce OIDC dans l’application. Cette prévisualisation ne connecte pas et ne valide pas les jetons.",
        "Authorization Code + PKCE S256 und exakte Weiterleitungen bevorzugen. Implicit- und Password-Grants vermeiden. state und OIDC-nonce in der Anwendung binden und prüfen. Die Vorschau meldet niemanden an und validiert keine Token.",
        "Authorization Code + PKCE S256と正確なリダイレクト登録を推奨します。implicit/password grantは避け、アプリでstateとOIDC nonceを関連付けて検証してください。このプレビューはログインやトークン検証を行いません。",
        "优先使用 Authorization Code + PKCE S256，并注册精确重定向。避免隐式授权和密码授权。在应用中绑定并验证 state 与 OIDC nonce。此预览不会完成登录或验证令牌。",
        "فضّل Authorization Code + PKCE S256 وسجّل إعادة توجيه مطابقة. تجنّب المنح الضمنية وكلمة المرور. اربط state وOIDC nonce وتحقق منهما في تطبيقك. لا تكمل المعاينة تسجيل الدخول ولا تتحقق من الرموز."
    ],
    "Provider discovery metadata": [
        "प्रदाता discovery metadata",
        "Metadatos de descubrimiento del proveedor",
        "Métadonnées de découverte du fournisseur",
        "Discovery-Metadaten des Anbieters",
        "プロバイダーの検出メタデータ",
        "提供方发现元数据",
        "بيانات اكتشاف المزوّد"
    ],
    "OIDC discovery metadata": [
        "OIDC discovery metadata",
        "Metadatos de descubrimiento OIDC",
        "Métadonnées de découverte OIDC",
        "OIDC-Discovery-Metadaten",
        "OIDC検出メタデータ",
        "OIDC 发现元数据",
        "بيانات اكتشاف OIDC"
    ],
    "Inspect metadata": [
        "Metadata जाँचें",
        "Inspeccionar metadatos",
        "Inspecter les métadonnées",
        "Metadaten prüfen",
        "メタデータを確認",
        "检查元数据",
        "فحص البيانات الوصفية"
    ],
    "Generate PKCE S256": [
        "PKCE S256 बनाएँ",
        "Generar PKCE S256",
        "Générer PKCE S256",
        "PKCE S256 erzeugen",
        "PKCE S256を生成",
        "生成 PKCE S256",
        "إنشاء PKCE S256"
    ],
    "Authorization request": [
        "प्राधिकरण अनुरोध",
        "Solicitud de autorización",
        "Demande d’autorisation",
        "Autorisierungsanfrage",
        "認可要求",
        "授权请求",
        "طلب التفويض"
    ],
    "OAuth client ID": [
        "OAuth क्लाइंट ID",
        "ID de cliente OAuth",
        "ID client OAuth",
        "OAuth-Client-ID",
        "OAuthクライアントID",
        "OAuth 客户端 ID",
        "معرّف عميل OAuth"
    ],
    "Redirect URI": [
        "रीडायरेक्ट URI",
        "URI de redirección",
        "URI de redirection",
        "Weiterleitungs-URI",
        "リダイレクトURI",
        "重定向 URI",
        "URI لإعادة التوجيه"
    ],
    "OAuth redirect URI": [
        "OAuth रीडायरेक्ट URI",
        "URI de redirección OAuth",
        "URI de redirection OAuth",
        "OAuth-Weiterleitungs-URI",
        "OAuthリダイレクトURI",
        "OAuth 重定向 URI",
        "URI لإعادة توجيه OAuth"
    ],
    "Scopes": [
        "स्कोप",
        "Ámbitos",
        "Portées",
        "Berechtigungen",
        "スコープ",
        "范围",
        "النطاقات"
    ],
    "OAuth scopes": [
        "OAuth स्कोप",
        "Ámbitos OAuth",
        "Portées OAuth",
        "OAuth-Berechtigungen",
        "OAuthスコープ",
        "OAuth 范围",
        "نطاقات OAuth"
    ],
    "Verifier": [
        "सत्यापक",
        "Verificador",
        "Vérificateur",
        "Verifier",
        "検証子",
        "验证器",
        "المتحقق"
    ],
    "S256 challenge": [
        "S256 चुनौती",
        "Desafío S256",
        "Challenge S256",
        "S256-Challenge",
        "S256チャレンジ",
        "S256 挑战",
        "تحدي S256"
    ],
    "State": [
        "स्थिति",
        "Estado",
        "État",
        "Status",
        "状態",
        "状态",
        "الحالة"
    ],
    "OIDC nonce": [
        "OIDC नॉन्स",
        "Nonce OIDC",
        "Nonce OIDC",
        "OIDC-Nonce",
        "OIDCノンス",
        "OIDC 随机数",
        "قيمة nonce لـOIDC"
    ],
    "Authorization URL preview": [
        "प्राधिकरण URL पूर्वावलोकन",
        "Vista previa de URL de autorización",
        "Aperçu de l’URL d’autorisation",
        "Autorisierungs-URL-Vorschau",
        "認可URLのプレビュー",
        "授权 URL 预览",
        "معاينة عنوان التفويض"
    ],
    "Discovery review": [
        "Discovery समीक्षा",
        "Revisión de descubrimiento",
        "Revue de découverte",
        "Discovery-Prüfung",
        "検出情報の確認",
        "发现信息检查",
        "مراجعة الاكتشاف"
    ],
    "Core discovery fields look complete": [
        "मुख्य discovery फ़ील्ड पूर्ण दिखते हैं",
        "Los campos principales de descubrimiento parecen completos",
        "Les champs de découverte principaux semblent complets",
        "Wesentliche Discovery-Felder scheinen vollständig",
        "主要な検出フィールドは揃っています",
        "核心发现字段看起来完整",
        "تبدو حقول الاكتشاف الأساسية مكتملة"
    ],
    "Inspect and generate W3C distributed tracing headers locally": [
        "W3C distributed tracing हेडर स्थानीय रूप से जाँचें और बनाएँ",
        "Inspecciona y genera cabeceras W3C de trazado distribuido localmente",
        "Inspectez et générez localement les en-têtes W3C de traçage distribué",
        "W3C-Header für verteiltes Tracing lokal prüfen und erzeugen",
        "W3C分散トレーシングヘッダーをローカルで確認・生成",
        "在本地检查和生成 W3C 分布式跟踪标头",
        "افحص وأنشئ ترويسات التتبع الموزع W3C محليًا"
    ],
    "Inspect headers": [
        "हेडर जाँचें",
        "Inspeccionar cabeceras",
        "Inspecter les en-têtes",
        "Header prüfen",
        "ヘッダーを確認",
        "检查标头",
        "فحص الترويسات"
    ],
    "Generate sampled trace": [
        "सैंपल किया trace बनाएँ",
        "Generar traza muestreada",
        "Générer une trace échantillonnée",
        "Gesampelten Trace erzeugen",
        "サンプリング有効トレースを生成",
        "生成已采样跟踪",
        "إنشاء تتبع مع أخذ عينات"
    ],
    "Trace inspection result": [
        "Trace जाँच परिणाम",
        "Resultado de inspección de traza",
        "Résultat d’inspection de trace",
        "Trace-Prüfergebnis",
        "トレースの確認結果",
        "跟踪检查结果",
        "نتيجة فحص التتبع"
    ],
    "Trace IDs correlate a distributed request; parent IDs identify a span. Sampling is the least significant trace-flags bit.": [
        "Trace ID वितरित अनुरोध को जोड़ता है; parent ID span बताता है। Sampling trace-flags का सबसे कम महत्वपूर्ण bit है।",
        "El ID de traza relaciona una solicitud distribuida; el ID padre identifica un span. El muestreo usa el bit menos significativo de trace-flags.",
        "L’ID de trace relie une requête distribuée ; l’ID parent identifie un span. L’échantillonnage utilise le bit de poids faible de trace-flags.",
        "Trace-IDs verknüpfen verteilte Anfragen; Parent-IDs kennzeichnen einen Span. Sampling ist das niederwertigste Bit der trace-flags.",
        "トレースIDは分散要求を関連付け、親IDはスパンを識別します。サンプリングはtrace-flagsの最下位ビットです。",
        "跟踪 ID 关联分布式请求，父 ID 标识跨度。采样是 trace-flags 的最低有效位。",
        "يربط معرّف التتبع طلبًا موزعًا، ويحدد معرّف الأصل مقطعًا. أخذ العينات هو البت الأقل أهمية في trace-flags."
    ],
    "W3C reference": [
        "W3C संदर्भ",
        "Referencia W3C",
        "Référence W3C",
        "W3C-Referenz",
        "W3Cリファレンス",
        "W3C 参考",
        "مرجع W3C"
    ],
    "Inspect message-driven API contracts for channels, operations, servers, and messages": [
        "चैनल, ऑपरेशन, सर्वर और संदेशों के event API अनुबंध जाँचें",
        "Inspecciona contratos de API de eventos: canales, operaciones, servidores y mensajes",
        "Inspectez les contrats d’API événementielle : canaux, opérations, serveurs et messages",
        "Ereignis-API-Verträge für Kanäle, Operationen, Server und Nachrichten prüfen",
        "チャネル、操作、サーバー、メッセージのイベントAPI契約を確認",
        "检查消息 API 契约中的通道、操作、服务器和消息",
        "افحص عقود API للأحداث من قنوات وعمليات وخوادم ورسائل"
    ],
    "A local explorer for AsyncAPI 2.x and 3.x documents—the contract format for event-driven APIs such as Kafka, MQTT, AMQP, and WebSockets.": [
        "Kafka, MQTT, AMQP और WebSocket जैसी event APIs के AsyncAPI 2.x/3.x दस्तावेज़ स्थानीय रूप से खोजें।",
        "Explorador local de documentos AsyncAPI 2.x/3.x para API de eventos como Kafka, MQTT, AMQP y WebSockets.",
        "Explorateur local de documents AsyncAPI 2.x/3.x pour les API événementielles Kafka, MQTT, AMQP et WebSockets.",
        "Lokaler Explorer für AsyncAPI-2.x-/3.x-Verträge ereignisgesteuerter APIs wie Kafka, MQTT, AMQP und WebSockets.",
        "Kafka、MQTT、AMQP、WebSocketなどのイベントAPI向けAsyncAPI 2.x/3.xドキュメントをローカルで調査します。",
        "在本地探索 AsyncAPI 2.x/3.x 文档，适用于 Kafka、MQTT、AMQP、WebSocket 等事件 API。",
        "مستكشف محلي لمستندات AsyncAPI 2.x/3.x لعقود API للأحداث مثل Kafka وMQTT وAMQP وWebSockets."
    ],
    "Event contracts are hard to review in raw YAML. This tool gives teams a fast structural summary before they generate clients or deploy a broker integration.": [
        "क्लाइंट बनाने या broker integration deploy करने से पहले raw YAML का तेज़ संरचनात्मक सार देखें।",
        "Revisa un resumen estructural del YAML antes de generar clientes o desplegar una integración de broker.",
        "Consultez un résumé structurel du YAML avant de générer des clients ou de déployer l’intégration d’un broker.",
        "Vor Clientgenerierung oder Brokerintegration eine schnelle Strukturübersicht des YAML prüfen.",
        "クライアント生成やブローカー統合のデプロイ前に、YAMLの構造をすばやく確認できます。",
        "生成客户端或部署消息代理集成前，快速查看 YAML 的结构摘要。",
        "راجع ملخص بنية YAML قبل إنشاء العملاء أو نشر تكامل وسيط الرسائل."
    ],
    "Paste an AsyncAPI JSON or YAML document": [
        "AsyncAPI JSON या YAML दस्तावेज़ चिपकाएँ",
        "Pega un documento AsyncAPI JSON o YAML",
        "Collez un document AsyncAPI JSON ou YAML",
        "AsyncAPI-Dokument als JSON oder YAML einfügen",
        "AsyncAPIのJSON/YAMLドキュメントを貼り付け",
        "粘贴 AsyncAPI JSON 或 YAML 文档",
        "الصق مستند AsyncAPI بصيغة JSON أو YAML"
    ],
    "Review the live document summary": [
        "लाइव दस्तावेज़ सार देखें",
        "Revisa el resumen en directo",
        "Consultez le résumé en direct",
        "Aktuelle Dokumentübersicht prüfen",
        "リアルタイムの要約を確認",
        "查看实时文档摘要",
        "راجع ملخص المستند المباشر"
    ],
    "Fix the listed required-field or version issues": [
        "आवश्यक फ़ील्ड या संस्करण की बताई समस्याएँ ठीक करें",
        "Corrige los problemas de campos obligatorios o versión",
        "Corrigez les problèmes de champs requis ou de version",
        "Gemeldete Pflichtfeld- oder Versionsprobleme beheben",
        "表示された必須項目やバージョンの問題を修正",
        "修正列出的必填字段或版本问题",
        "أصلح مشكلات الحقول المطلوبة أو الإصدار المعروضة"
    ],
    "Pair it with the WebSocket Tester for runtime checks": [
        "रनटाइम जाँच के लिए WebSocket Tester उपयोग करें",
        "Usa WebSocket Tester para pruebas en ejecución",
        "Utilisez WebSocket Tester pour les tests à l’exécution",
        "Für Laufzeitprüfungen WebSocket Tester verwenden",
        "実行時テストにはWebSocket Testerを併用",
        "使用 WebSocket Tester 进行运行时检查",
        "استخدم WebSocket Tester لفحوص وقت التشغيل"
    ],
    "AsyncAPI 3 separates channels and operations more explicitly than v2.": [
        "AsyncAPI 3 में channels और operations संस्करण 2 से अधिक अलग हैं।",
        "AsyncAPI 3 separa canales y operaciones más claramente que v2.",
        "AsyncAPI 3 sépare davantage les canaux et opérations que v2.",
        "AsyncAPI 3 trennt Kanäle und Operationen deutlicher als v2.",
        "AsyncAPI 3はv2よりチャネルと操作を明確に分離しています。",
        "AsyncAPI 3 比 v2 更明确地区分通道和操作。",
        "يفصل AsyncAPI 3 القنوات والعمليات بوضوح أكبر من v2."
    ],
    "Keep broker-specific detail in protocol bindings.": [
        "Broker विवरण protocol bindings में रखें।",
        "Conserva los detalles del broker en bindings de protocolo.",
        "Gardez les détails du broker dans les bindings de protocole.",
        "Brokerspezifische Details in Protokoll-Bindings ablegen.",
        "ブローカー固有情報はプロトコルbindingsに記述してください。",
        "将消息代理专用细节放在协议绑定中。",
        "ضع تفاصيل وسيط الرسائل في ارتباطات البروتوكول."
    ],
    "The explorer does not connect to your broker.": [
        "यह explorer आपके broker से नहीं जुड़ता।",
        "Este explorador no se conecta a tu broker.",
        "Cet explorateur ne se connecte pas à votre broker.",
        "Dieser Explorer verbindet sich nicht mit Ihrem Broker.",
        "このツールはブローカーに接続しません。",
        "此工具不会连接到消息代理。",
        "لا يتصل هذا المستكشف بوسيط الرسائل لديك."
    ],
    "Kafka topic contract reviews": [
        "Kafka topic अनुबंध समीक्षा",
        "Revisión de contratos de temas Kafka",
        "Revue des contrats de topics Kafka",
        "Kafka-Topic-Verträge prüfen",
        "Kafkaトピック契約の確認",
        "Kafka 主题契约检查",
        "مراجعة عقود مواضيع Kafka"
    ],
    "WebSocket event documentation": [
        "WebSocket event दस्तावेज़",
        "Documentación de eventos WebSocket",
        "Documentation d’événements WebSocket",
        "WebSocket-Ereignisse dokumentieren",
        "WebSocketイベントの文書化",
        "WebSocket 事件文档",
        "توثيق أحداث WebSocket"
    ],
    "Event-driven service onboarding": [
        "Event-driven सेवा परिचय",
        "Incorporación a servicios de eventos",
        "Prise en main de services événementiels",
        "Einstieg in ereignisgesteuerte Dienste",
        "イベント駆動サービスの導入",
        "事件驱动服务入门",
        "التعرّف على خدمات الأحداث"
    ],
    "AsyncAPI document": [
        "AsyncAPI दस्तावेज़",
        "Documento AsyncAPI",
        "Document AsyncAPI",
        "AsyncAPI-Dokument",
        "AsyncAPIドキュメント",
        "AsyncAPI 文档",
        "مستند AsyncAPI"
    ],
    "AsyncAPI JSON or YAML document": [
        "AsyncAPI JSON या YAML दस्तावेज़",
        "Documento AsyncAPI JSON o YAML",
        "Document AsyncAPI JSON ou YAML",
        "AsyncAPI-Dokument in JSON oder YAML",
        "AsyncAPIのJSON/YAMLドキュメント",
        "AsyncAPI JSON 或 YAML 文档",
        "مستند AsyncAPI بصيغة JSON أو YAML"
    ],
    "Document summary": [
        "दस्तावेज़ सार",
        "Resumen del documento",
        "Résumé du document",
        "Dokumentübersicht",
        "ドキュメントの要約",
        "文档摘要",
        "ملخص المستند"
    ],
    "Invalid document": [
        "अमान्य दस्तावेज़",
        "Documento no válido",
        "Document invalide",
        "Ungültiges Dokument",
        "無効なドキュメント",
        "无效文档",
        "مستند غير صالح"
    ],
    "Channels": [
        "चैनल",
        "Canales",
        "Canaux",
        "Kanäle",
        "チャネル",
        "通道",
        "القنوات"
    ],
    "Operations": [
        "क्रियाएँ",
        "Operaciones",
        "Opérations",
        "Aktionen",
        "操作",
        "操作",
        "العمليات"
    ],
    "Servers": [
        "सर्वर",
        "Servidores",
        "Serveurs",
        "Server",
        "サーバー",
        "服务器",
        "الخوادم"
    ],
    "Messages": [
        "संदेश",
        "Mensajes",
        "Messages",
        "Nachrichten",
        "メッセージ",
        "消息",
        "الرسائل"
    ],
    "Core document fields are present": [
        "मुख्य दस्तावेज़ फ़ील्ड मौजूद हैं",
        "Los campos principales están presentes",
        "Les champs principaux sont présents",
        "Wesentliche Dokumentfelder vorhanden",
        "主要なドキュメント項目が存在します",
        "核心文档字段均存在",
        "حقول المستند الأساسية موجودة"
    ],
    "Your document is parsed in this browser only.": [
        "दस्तावेज़ केवल इस ब्राउज़र में पार्स होता है।",
        "El documento se analiza solo en este navegador.",
        "Le document est analysé uniquement dans ce navigateur.",
        "Das Dokument wird nur in diesem Browser analysiert.",
        "ドキュメントの解析はこのブラウザー内のみで行います。",
        "文档仅在此浏览器中解析。",
        "يُحلل المستند في هذا المتصفح فقط."
    ],
    "← Back to Editor": [
        "← संपादक पर लौटें",
        "← Volver al editor",
        "← Retour à l’éditeur",
        "← Zurück zum Editor",
        "← エディターに戻る",
        "← 返回编辑器",
        "← العودة للمحرر"
    ],
    "Invalid spec": [
        "अमान्य spec",
        "Especificación no válida",
        "Spécification invalide",
        "Ungültige Spezifikation",
        "無効な仕様",
        "无效规范",
        "مواصفة غير صالحة"
    ],
    "Paste or upload an OpenAPI spec and get interactive docs": [
        "OpenAPI spec चिपकाएँ या अपलोड कर इंटरैक्टिव दस्तावेज़ देखें",
        "Pega o sube una especificación OpenAPI para ver documentación interactiva",
        "Collez ou importez une spécification OpenAPI pour une documentation interactive",
        "OpenAPI-Spezifikation einfügen oder hochladen und interaktive Dokumentation ansehen",
        "OpenAPI仕様を貼り付け・アップロードして対話型ドキュメントを表示",
        "粘贴或上传 OpenAPI 规范，查看交互式文档",
        "الصق أو ارفع مواصفة OpenAPI لعرض توثيق تفاعلي"
    ],
    "An interactive renderer for OpenAPI (formerly Swagger) specifications. Paste a JSON or YAML spec — version 2.0, 3.0, or 3.1 — and get the same browsable documentation experience that Swagger UI provides on api.example.com, including endpoint listings, request/response schemas, model definitions, security schemes, and a Try-it-out console for live calls.": [
        "OpenAPI/Swagger 2.0, 3.0 और 3.1 JSON/YAML को Swagger UI से पढ़ने योग्य बनाएँ। Endpoint, स्कीमा, security schemes और live Try-it-out console देखें।",
        "Renderiza OpenAPI/Swagger 2.0, 3.0 y 3.1 JSON/YAML con Swagger UI: endpoints, esquemas, seguridad y consola Try-it-out para llamadas reales.",
        "Affichez OpenAPI/Swagger 2.0, 3.0 et 3.1 JSON/YAML avec Swagger UI : endpoints, schémas, sécurité et console Try-it-out pour appels réels.",
        "OpenAPI-/Swagger-2.0-, 3.0- und 3.1-JSON/YAML mit Swagger UI anzeigen: Endpunkte, Schemata, Sicherheit und Try-it-out für echte Aufrufe.",
        "OpenAPI/Swagger 2.0、3.0、3.1のJSON/YAMLをSwagger UIで表示します。エンドポイント、スキーマ、認証方式と実際に要求を送るTry-it-outを確認できます。",
        "通过 Swagger UI 展示 OpenAPI/Swagger 2.0、3.0、3.1 JSON/YAML，查看端点、模式、安全方案，并可用 Try-it-out 发送真实请求。",
        "اعرض OpenAPI/Swagger ‏2.0 و3.0 و3.1 بصيغة JSON/YAML عبر Swagger UI، مع نقاط الاتصال والمخططات والأمان وTry-it-out للطلبات الفعلية."
    ],
    "An OpenAPI spec is a single source of truth — but the raw JSON is hard to read and harder to share with non-developers. This viewer turns it into navigable docs in seconds, with no install, no spec server, and no signup. Useful for design reviews, contract validation, and onboarding new team members to an API.": [
        "स्थापना, spec server या signup के बिना raw spec को नेविगेट करने योग्य दस्तावेज़ में बदलें। API डिजाइन समीक्षा और टीम परिचय में उपयोगी।",
        "Convierte una especificación en documentación navegable sin instalación, servidor de especificaciones ni registro. Útil para revisiones y formación del equipo.",
        "Transformez une spécification brute en documentation navigable sans installation, serveur dédié ni inscription. Utile pour les revues et l’accueil de l’équipe.",
        "Rohe Spezifikationen ohne Installation, Spec-Server oder Anmeldung als navigierbare Dokumentation anzeigen. Für API-Reviews und Teameinstieg geeignet.",
        "インストール、仕様サーバー、登録なしで仕様を閲覧可能なドキュメントに変換します。APIレビューやチームへの説明に役立ちます。",
        "无需安装、规范服务器或注册，即可将原始规范变成可浏览文档，方便 API 设计审查和团队入门。",
        "حوّل المواصفة الخام إلى توثيق قابل للتصفح دون تثبيت أو خادم مواصفات أو تسجيل. مفيد للمراجعات وتعريف الفريق بالواجهة."
    ],
    "Paste your OpenAPI / Swagger spec (JSON or YAML) into the editor": [
        "OpenAPI/Swagger JSON या YAML संपादक में चिपकाएँ",
        "Pega OpenAPI/Swagger JSON o YAML en el editor",
        "Collez OpenAPI/Swagger JSON ou YAML dans l’éditeur",
        "OpenAPI-/Swagger-JSON oder -YAML in den Editor einfügen",
        "OpenAPI/SwaggerのJSON/YAMLをエディターに貼り付け",
        "在编辑器中粘贴 OpenAPI/Swagger JSON 或 YAML",
        "الصق OpenAPI/Swagger بصيغة JSON أو YAML في المحرر"
    ],
    "Or upload a .json / .yaml / .yml file from disk": [
        "या डिस्क से .json/.yaml/.yml फ़ाइल अपलोड करें",
        "O sube un archivo .json/.yaml/.yml del disco",
        "Ou importez un fichier .json/.yaml/.yml du disque",
        "Oder .json-/.yaml-/.yml-Datei vom Datenträger hochladen",
        "またはディスクから.json/.yaml/.ymlをアップロード",
        "或从磁盘上传 .json/.yaml/.yml 文件",
        "أو ارفع ملف .json/.yaml/.yml من القرص"
    ],
    "Click 'Render Docs' to switch to the interactive view": [
        "इंटरैक्टिव दृश्य के लिए Render Docs दबाएँ",
        "Pulsa Renderizar documentos para abrir la vista interactiva",
        "Cliquez sur Afficher la documentation pour ouvrir la vue interactive",
        "Dokumentation anzeigen öffnet die interaktive Ansicht",
        "ドキュメントを表示を押して対話型ビューへ",
        "点击渲染文档，打开交互式视图",
        "اضغط عرض التوثيق لفتح العرض التفاعلي"
    ],
    "Expand operations to see parameters, request bodies, and example responses": [
        "ऑपरेशन खोलकर parameters, request body और उदाहरण प्रतिक्रिया देखें",
        "Expande operaciones para ver parámetros, cuerpos y respuestas de ejemplo",
        "Développez les opérations pour voir paramètres, corps et exemples de réponse",
        "Operationen für Parameter, Anfragekörper und Beispielantworten öffnen",
        "操作を展開し、引数、要求本文、応答例を確認",
        "展开操作，查看参数、请求体和响应示例",
        "وسّع العمليات لعرض المعاملات والأجسام والردود النموذجية"
    ],
    "Use 'Try it out' to make live calls — works for any CORS-enabled endpoint": [
        "Try it out से CORS-सक्षम endpoint पर वास्तविक अनुरोध भेजें",
        "Usa Try it out para enviar solicitudes reales a endpoints con CORS",
        "Utilisez Try it out pour envoyer des requêtes réelles aux endpoints autorisant CORS",
        "Try it out sendet echte Anfragen an CORS-fähige Endpunkte",
        "Try it outでCORS対応エンドポイントへ実際の要求を送信",
        "使用 Try it out 向启用 CORS 的端点发送真实请求",
        "استخدم Try it out لإرسال طلبات فعلية إلى نقاط تدعم CORS"
    ],
    "Supports OpenAPI 3.0, 3.1, and Swagger 2.0 — auto-detected from the spec": [
        "OpenAPI 3.0/3.1 और Swagger 2.0 का संस्करण spec से पहचाना जाता है",
        "Detecta OpenAPI 3.0/3.1 y Swagger 2.0 desde la especificación",
        "Détecte OpenAPI 3.0/3.1 et Swagger 2.0 depuis la spécification",
        "Erkennt OpenAPI 3.0/3.1 und Swagger 2.0 anhand der Spezifikation",
        "仕様からOpenAPI 3.0/3.1、Swagger 2.0を判別",
        "从规范识别 OpenAPI 3.0/3.1 和 Swagger 2.0",
        "يكتشف OpenAPI 3.0/3.1 وSwagger 2.0 من المواصفة"
    ],
    "$ref pointers to local components resolve automatically (external $refs need a hosted spec)": [
        "स्थानीय component के $ref सुलझते हैं; बाहरी $ref को पहुँच योग्य hosted spec चाहिए",
        "Los $ref locales se resuelven; los externos requieren una especificación alojada accesible",
        "Les $ref locaux sont résolus ; les externes exigent une spécification hébergée accessible",
        "Lokale $ref werden aufgelöst; externe benötigen eine erreichbare gehostete Spezifikation",
        "ローカルの$refを解決します。外部$refには取得可能な公開仕様が必要です",
        "本地组件 $ref 可解析；外部 $ref 需要可访问的托管规范",
        "تُحل مراجع $ref المحلية؛ وتتطلب الخارجية مواصفة مستضافة قابلة للوصول"
    ],
    "Set the `servers` block so the Try-it-out console hits the right environment": [
        "Try-it-out के सही पर्यावरण के लिए servers ब्लॉक सेट करें",
        "Configura servers para que Try-it-out use el entorno correcto",
        "Configurez servers pour que Try-it-out cible le bon environnement",
        "servers für die richtige Try-it-out-Umgebung setzen",
        "Try-it-outが正しい環境を使うようserversを設定",
        "设置 servers 块，让 Try-it-out 使用正确环境",
        "اضبط servers ليستهدف Try-it-out البيئة الصحيحة"
    ],
    "Define `securitySchemes` (bearer, apiKey, OAuth2) so the Authorize button appears": [
        "Authorize दिखाने के लिए securitySchemes (bearer, apiKey, OAuth2) परिभाषित करें",
        "Define securitySchemes (bearer, apiKey, OAuth2) para mostrar Authorize",
        "Définissez securitySchemes (bearer, apiKey, OAuth2) pour afficher Authorize",
        "securitySchemes (bearer, apiKey, OAuth2) für Authorize definieren",
        "Authorizeを表示するにはsecuritySchemes（bearer、apiKey、OAuth2）を定義",
        "定义 securitySchemes（bearer、apiKey、OAuth2）以显示 Authorize",
        "عرّف securitySchemes ‏(bearer وapiKey وOAuth2) لإظهار Authorize"
    ],
    "Use YAML for human-edited specs, JSON when generated from code (FastAPI, NestJS, springdoc)": [
        "हाथ से संपादन के लिए YAML, code से बने spec के लिए JSON उपयोग करें",
        "Usa YAML para edición manual y JSON para especificaciones generadas desde código",
        "Utilisez YAML pour l’édition manuelle et JSON pour les spécifications générées",
        "YAML für manuelle Bearbeitung, JSON für aus Code erzeugte Spezifikationen nutzen",
        "手動編集はYAML、コード生成の仕様はJSONが便利です",
        "手动编辑可用 YAML，代码生成的规范可用 JSON",
        "استخدم YAML للتحرير اليدوي وJSON للمواصفات المولّدة من الشيفرة"
    ],
    "Cross-origin Try-it-out requests are blocked by browser CORS — host a CORS-enabled mock or use the API Request Builder tool": [
        "Cross-origin Try-it-out पर CORS लागू है; CORS mock या API Request Builder उपयोग करें",
        "Try-it-out entre orígenes está sujeto a CORS; usa un mock con CORS o API Request Builder",
        "Try-it-out inter-origines dépend de CORS ; utilisez un mock CORS ou API Request Builder",
        "Ursprungsübergreifendes Try-it-out unterliegt CORS; CORS-Mock oder API Request Builder nutzen",
        "異なるオリジンへのTry-it-outはCORSに制限されます。CORS対応モックかAPI Request Builderを使ってください",
        "跨源 Try-it-out 受 CORS 限制；请使用启用 CORS 的模拟服务或 API Request Builder",
        "تخضع طلبات Try-it-out عبر الأصول لـCORS؛ استخدم محاكاة تدعم CORS أو API Request Builder"
    ],
    "Reviewing an API contract before implementation (design-first workflow)": [
        "कार्यान्वयन से पहले API अनुबंध समीक्षा",
        "Revisar contratos API antes de implementarlos",
        "Revoir les contrats API avant implémentation",
        "API-Verträge vor Implementierung prüfen",
        "実装前にAPI契約をレビュー",
        "实现前审查 API 契约",
        "مراجعة عقود API قبل التنفيذ"
    ],
    "Sharing draft API docs with frontend, QA, and stakeholders without deploying anything": [
        "बिना deploy किए frontend, QA और stakeholders को API दस्तावेज़ दिखाएँ",
        "Compartir borradores con frontend, QA y otras partes sin desplegar",
        "Partager les brouillons avec frontend, QA et partenaires sans déploiement",
        "API-Entwürfe ohne Bereitstellung mit Frontend, QA und Beteiligten teilen",
        "デプロイせずにフロントエンド、QA、関係者とAPI案を確認",
        "无需部署即可与前端、QA 和相关方审阅 API 草稿",
        "مشاركة مسودات API مع الواجهة وQA والمعنيين دون نشر"
    ],
    "Onboarding new developers to an existing API surface": [
        "नए डेवलपर को API से परिचित कराएँ",
        "Incorporar nuevos desarrolladores a una API",
        "Présenter une API aux nouveaux développeurs",
        "Neue Entwickler in eine API einführen",
        "新しい開発者にAPIを紹介",
        "帮助新开发者熟悉 API",
        "تعريف المطورين الجدد بواجهة API"
    ],
    "Validating that a generated spec (FastAPI, NestJS, springdoc, drf-spectacular) renders cleanly": [
        "Code से बना spec सही render होता है या नहीं जाँचें",
        "Comprobar el renderizado de especificaciones generadas",
        "Vérifier le rendu des spécifications générées",
        "Darstellung generierter Spezifikationen prüfen",
        "自動生成された仕様の表示を確認",
        "检查生成的规范是否正确渲染",
        "التحقق من عرض المواصفات المولّدة"
    ],
    "Debugging spec-driven SDK generation by spotting missing types or examples": [
        "गायब प्रकार या उदाहरण देखकर SDK generation डिबग करें",
        "Depurar generación de SDK detectando tipos o ejemplos ausentes",
        "Déboguer la génération SDK avec les types ou exemples manquants",
        "SDK-Generierung anhand fehlender Typen oder Beispiele debuggen",
        "不足する型や例を見つけてSDK生成をデバッグ",
        "发现缺少的类型或示例，以调试 SDK 生成",
        "تصحيح إنشاء SDK باكتشاف أنواع أو أمثلة مفقودة"
    ],
    "Smoke-testing endpoints against staging or production from a single page": [
        "एक पेज से staging या production endpoint का परीक्षण",
        "Probar endpoints de staging o producción desde una página",
        "Tester les endpoints de préproduction ou production sur une page",
        "Staging- oder Produktionsendpunkte von einer Seite testen",
        "1ページからステージング・本番エンドポイントをテスト",
        "从单个页面测试预发布或生产端点",
        "اختبار نقاط الاختبار أو الإنتاج من صفحة واحدة"
    ],
    "Render Docs": [
        "दस्तावेज़ दिखाएँ",
        "Renderizar documentos",
        "Afficher la documentation",
        "Dokumentation anzeigen",
        "ドキュメントを表示",
        "渲染文档",
        "عرض التوثيق"
    ],
    "Upload Spec": [
        "spec अपलोड करें",
        "Subir especificación",
        "Importer une spécification",
        "Spezifikation hochladen",
        "仕様をアップロード",
        "上传规范",
        "رفع المواصفة"
    ],
    "Connected — direct fetch was blocked by CORS, retried via server proxy": [
        "जुड़ गया — CORS पर सर्वर प्रॉक्सी से पुनः प्रयास हुआ",
        "Conectado: CORS bloqueó el acceso directo, se usó el proxy",
        "Connecté : CORS a bloqué l’accès direct, repli via proxy",
        "Verbunden: CORS blockierte direkt, über Serverproxy wiederholt",
        "接続済み：CORSでブロックされ、サーバープロキシで再試行しました",
        "已连接：CORS 阻止直连，已通过服务器代理重试",
        "تم الاتصال؛ حظر CORS الاتصال المباشر فأُعيد عبر الوكيل"
    ],
    "Connected via server proxy": [
        "सर्वर प्रॉक्सी से जुड़ गया",
        "Conectado por proxy del servidor",
        "Connecté via proxy serveur",
        "Über Serverproxy verbunden",
        "サーバープロキシ経由で接続済み",
        "已通过服务器代理连接",
        "تم الاتصال عبر وكيل الخادم"
    ],
    "Connected — tool list loaded": [
        "जुड़ गया — टूल सूची लोड हुई",
        "Conectado: herramientas cargadas",
        "Connecté : liste des outils chargée",
        "Verbunden: Werkzeugliste geladen",
        "接続済み：ツール一覧を読み込みました",
        "已连接：工具列表已加载",
        "تم الاتصال؛ حُمّلت قائمة الأدوات"
    ],
    "Connection failed: {value1}": [
        "कनेक्शन विफल: {value1}",
        "Error de conexión: {value1}",
        "Échec de connexion : {value1}",
        "Verbindung fehlgeschlagen: {value1}",
        "接続失敗：{value1}",
        "连接失败：{value1}",
        "فشل الاتصال: {value1}"
    ],
    "Direct connection works. Use 'Direct' or 'Direct (strict)' for the lowest latency.": [
        "सीधा कनेक्शन चलता है। कम विलंब के लिए Direct या Direct (strict) चुनें।",
        "La conexión directa funciona. Usa Direct o Direct (strict) para menor latencia.",
        "La connexion directe fonctionne. Choisissez Direct ou Direct (strict) pour moins de latence.",
        "Direktverbindung funktioniert. Für geringe Latenz Direct oder Direct (strict) wählen.",
        "直接接続に成功しました。遅延を抑えるにはDirectまたはDirect (strict)を選択します。",
        "直接连接正常。选择 Direct 或 Direct (strict) 可降低延迟。",
        "الاتصال المباشر يعمل. اختر Direct أو Direct (strict) لأقل تأخير."
    ],
    "Direct fetch is blocked (likely CORS). Use 'Via Server Proxy' for reliable access. To enable direct connections, configure your MCP server to send Access-Control-Allow-Origin: *.": [
        "सीधा अनुरोध रुका (संभवतः CORS)। Server Proxy चुनें। सीधे कनेक्शन के लिए MCP सर्वर पर Access-Control-Allow-Origin: * सेट करें।",
        "El acceso directo está bloqueado, probablemente por CORS. Usa Server Proxy o configura Access-Control-Allow-Origin: * en el servidor MCP.",
        "L’accès direct est bloqué, probablement par CORS. Utilisez Server Proxy ou configurez Access-Control-Allow-Origin: * sur le serveur MCP.",
        "Direktzugriff blockiert, vermutlich CORS. Server Proxy nutzen oder Access-Control-Allow-Origin: * am MCP-Server setzen.",
        "直接要求がブロックされています（CORSの可能性）。Server Proxyを使うか、MCPサーバーにAccess-Control-Allow-Origin: *を設定してください。",
        "直连被阻止（可能是 CORS）。请使用 Server Proxy，或在 MCP 服务器设置 Access-Control-Allow-Origin: *。",
        "الطلب المباشر محظور، غالبًا بسبب CORS. استخدم Server Proxy أو اضبط Access-Control-Allow-Origin: * على خادم MCP."
    ],
    "Neither direct nor proxy could reach the server. Check the URL, that the server is running, and (if behind HTTPS) the SSL settings.": [
        "सीधे या प्रॉक्सी से सर्वर नहीं मिला। URL, चालू सर्वर और HTTPS की SSL सेटिंग जाँचें।",
        "Ni acceso directo ni proxy alcanzaron el servidor. Revisa URL, servidor y SSL para HTTPS.",
        "Ni l’accès direct ni le proxy n’atteignent le serveur. Vérifiez URL, disponibilité et SSL pour HTTPS.",
        "Weder direkt noch per Proxy erreichbar. URL, laufenden Server und SSL für HTTPS prüfen.",
        "直接・プロキシともに接続できません。URL、サーバーの稼働、HTTPSのSSL設定を確認してください。",
        "直连与代理均无法访问服务器。请检查 URL、服务器运行状态和 HTTPS 的 SSL 设置。",
        "تعذّر الوصول مباشرة أو عبر الوكيل. افحص العنوان وتشغيل الخادم وإعداد SSL عند استخدام HTTPS."
    ],
    "Command + arguments": [
        "कमांड + तर्क",
        "Comando + argumentos",
        "Commande + arguments",
        "Befehl + Argumente",
        "コマンドと引数",
        "命令与参数",
        "الأمر والوسائط"
    ],
    "SSE Server URL": [
        "SSE सर्वर URL",
        "URL del servidor SSE",
        "URL du serveur SSE",
        "SSE-Server-URL",
        "SSEサーバーURL",
        "SSE 服务器 URL",
        "عنوان خادم SSE"
    ],
    "HTTP Server URL": [
        "HTTP सर्वर URL",
        "URL del servidor HTTP",
        "URL du serveur HTTP",
        "HTTP-Server-URL",
        "HTTPサーバーURL",
        "HTTP 服务器 URL",
        "عنوان خادم HTTP"
    ],
    "Generate CLI Command": [
        "CLI कमांड बनाएँ",
        "Generar comando CLI",
        "Générer la commande CLI",
        "CLI-Befehl erzeugen",
        "CLIコマンドを生成",
        "生成 CLI 命令",
        "إنشاء أمر CLI"
    ],
    "Connecting…": [
        "जुड़ रहा है…",
        "Conectando…",
        "Connexion…",
        "Verbindung wird hergestellt…",
        "接続中…",
        "正在连接…",
        "جارٍ الاتصال…"
    ],
    "Request Timeout ({value1})": [
        "अनुरोध समयसीमा ({value1})",
        "Tiempo de espera ({value1})",
        "Délai de requête ({value1})",
        "Anfrage-Zeitlimit ({value1})",
        "要求タイムアウト（{value1}）",
        "请求超时（{value1}）",
        "مهلة الطلب ({value1})"
    ],
    "Max Total Timeout ({value1})": [
        "अधिकतम कुल समयसीमा ({value1})",
        "Tiempo máximo total ({value1})",
        "Délai total maximal ({value1})",
        "Maximales Gesamtzeitlimit ({value1})",
        "最大合計タイムアウト（{value1}）",
        "最大总超时（{value1}）",
        "المهلة الإجمالية القصوى ({value1})"
    ],
    "Select a tool to call it": [
        "कॉल करने के लिए टूल चुनें",
        "Selecciona una herramienta para invocarla",
        "Sélectionnez un outil à appeler",
        "Werkzeug zum Aufrufen wählen",
        "呼び出すツールを選択",
        "选择要调用的工具",
        "اختر أداة لاستدعائها"
    ],
    "Connect to a server first": [
        "पहले सर्वर से जुड़ें",
        "Conecta primero a un servidor",
        "Connectez-vous d’abord à un serveur",
        "Zuerst mit einem Server verbinden",
        "先にサーバーへ接続してください",
        "请先连接服务器",
        "اتصل بخادم أولًا"
    ],
    "SendMessage / SendStreamingMessage; member-based parts and versioned supportedInterfaces.": [
        "SendMessage / SendStreamingMessage; सदस्य-आधारित parts और संस्करणयुक्त supportedInterfaces।",
        "SendMessage / SendStreamingMessage; partes por miembros y supportedInterfaces versionadas.",
        "SendMessage / SendStreamingMessage ; parties par membres et supportedInterfaces versionnées.",
        "SendMessage / SendStreamingMessage; mitgliederbasierte Teile und versionierte supportedInterfaces.",
        "SendMessage / SendStreamingMessage。メンバー形式のpartsとバージョン付きsupportedInterfaces。",
        "SendMessage / SendStreamingMessage；基于成员的 parts 和带版本的 supportedInterfaces。",
        "SendMessage / SendStreamingMessage؛ أجزاء قائمة على الأعضاء وsupportedInterfaces بإصداراتها."
    ],
    "Uses message/send + message/stream. Card at /.well-known/agent-card.json. Parts use 'kind'.": [
        "message/send + message/stream; कार्ड /.well-known/agent-card.json पर। parts में kind है।",
        "Usa message/send + message/stream. Tarjeta en /.well-known/agent-card.json. Partes con kind.",
        "Utilise message/send + message/stream. Carte à /.well-known/agent-card.json. Parties avec kind.",
        "Nutzt message/send + message/stream. Karte: /.well-known/agent-card.json. Teile nutzen kind.",
        "message/send + message/streamを使用。カードは/.well-known/agent-card.json。partsはkind形式。",
        "使用 message/send + message/stream。卡片位于 /.well-known/agent-card.json。parts 使用 kind。",
        "يستخدم message/send + message/stream. البطاقة في /.well-known/agent-card.json. تستخدم الأجزاء kind."
    ],
    "Uses tasks/send + tasks/sendSubscribe. Card at /.well-known/agent.json. Parts use 'type'.": [
        "tasks/send + tasks/sendSubscribe; कार्ड /.well-known/agent.json पर। parts में type है।",
        "Usa tasks/send + tasks/sendSubscribe. Tarjeta en /.well-known/agent.json. Partes con type.",
        "Utilise tasks/send + tasks/sendSubscribe. Carte à /.well-known/agent.json. Parties avec type.",
        "Nutzt tasks/send + tasks/sendSubscribe. Karte: /.well-known/agent.json. Teile nutzen type.",
        "tasks/send + tasks/sendSubscribeを使用。カードは/.well-known/agent.json。partsはtype形式。",
        "使用 tasks/send + tasks/sendSubscribe。卡片位于 /.well-known/agent.json。parts 使用 type。",
        "يستخدم tasks/send + tasks/sendSubscribe. البطاقة في /.well-known/agent.json. تستخدم الأجزاء type."
    ],
    "Direct connection works. Use 'Direct (strict)' for the lowest latency. Streaming will work.": [
        "सीधा कनेक्शन और स्ट्रीमिंग चलती है। कम विलंब के लिए Direct (strict) चुनें।",
        "La conexión directa y streaming funcionan. Usa Direct (strict) para menor latencia.",
        "Connexion directe et streaming fonctionnent. Choisissez Direct (strict) pour moins de latence.",
        "Direktverbindung und Streaming funktionieren. Für geringe Latenz Direct (strict) wählen.",
        "直接接続とストリーミングを利用できます。遅延を抑えるにはDirect (strict)を選択します。",
        "直连与流式功能正常。选择 Direct (strict) 可降低延迟。",
        "الاتصال المباشر والبث يعملان. اختر Direct (strict) لأقل تأخير."
    ],
    "Direct fetch is blocked (likely CORS). Use 'Via Server Proxy' for reliable access — streaming is supported through the proxy via SSE pass-through. To enable direct connections, configure the agent to send Access-Control-Allow-Origin: *.": [
        "सीधा अनुरोध रुका (संभवतः CORS)। Server Proxy में SSE streaming भी चलता है। सीधे कनेक्शन हेतु एजेंट पर Access-Control-Allow-Origin: * सेट करें।",
        "Acceso directo bloqueado, probablemente CORS. Server Proxy admite SSE en streaming. Para acceso directo, configura Access-Control-Allow-Origin: * en el agente.",
        "Accès direct bloqué, probablement CORS. Server Proxy relaie aussi SSE. Pour l’accès direct, configurez Access-Control-Allow-Origin: * sur l’agent.",
        "Direktzugriff blockiert, vermutlich CORS. Server Proxy unterstützt SSE-Streaming. Für Direktzugriff Access-Control-Allow-Origin: * am Agenten setzen.",
        "直接要求がブロックされています（CORSの可能性）。Server ProxyはSSEも中継します。直接接続にはエージェントでAccess-Control-Allow-Origin: *を設定してください。",
        "直连被阻止（可能是 CORS）。Server Proxy 支持 SSE 流式转发。直连需在代理端配置 Access-Control-Allow-Origin: *。",
        "الطلب المباشر محظور، غالبًا CORS. يدعم Server Proxy تمرير SSE. للاتصال المباشر اضبط Access-Control-Allow-Origin: * على الوكيل."
    ],
    "Neither direct nor proxy reached the agent. Check the URL, that the agent is running, and (if HTTPS) the SSL settings.": [
        "सीधे या प्रॉक्सी से एजेंट नहीं मिला। URL, चालू एजेंट और HTTPS की SSL सेटिंग जाँचें।",
        "Ni acceso directo ni proxy alcanzaron el agente. Revisa URL, agente y SSL para HTTPS.",
        "Ni l’accès direct ni le proxy n’atteignent l’agent. Vérifiez URL, disponibilité et SSL pour HTTPS.",
        "Agent weder direkt noch per Proxy erreichbar. URL, laufenden Agenten und SSL prüfen.",
        "直接・プロキシともにエージェントへ接続できません。URL、稼働状態、HTTPSのSSL設定を確認してください。",
        "直连与代理均无法访问代理服务。请检查 URL、运行状态和 HTTPS 的 SSL 设置。",
        "تعذّر الوصول إلى الوكيل مباشرة أو عبر الخادم. افحص العنوان والتشغيل وإعداد SSL لـHTTPS."
    ],
    "Agent card loaded — direct fetch was blocked by CORS, retried via /api/proxy": [
        "कार्ड लोड हुआ — CORS पर /api/proxy से पुनः प्रयास हुआ",
        "Tarjeta cargada: CORS bloqueó el acceso directo, se usó /api/proxy",
        "Carte chargée : CORS a bloqué l’accès direct, repli via /api/proxy",
        "Karte geladen: CORS blockierte direkt, über /api/proxy wiederholt",
        "カード読込済み：CORSでブロックされ/api/proxyで再試行しました",
        "卡片已加载：CORS 阻止直连，已通过 /api/proxy 重试",
        "حُمّلت البطاقة؛ حظر CORS الطلب المباشر فأُعيد عبر /api/proxy"
    ],
    "Agent card loaded via server proxy": [
        "सर्वर प्रॉक्सी से कार्ड लोड हुआ",
        "Tarjeta cargada por proxy del servidor",
        "Carte chargée via proxy serveur",
        "Karte über Serverproxy geladen",
        "サーバープロキシ経由でカードを読み込みました",
        "已通过服务器代理加载卡片",
        "حُمّلت البطاقة عبر وكيل الخادم"
    ],
    "Agent card loaded": [
        "एजेंट कार्ड लोड हुआ",
        "Tarjeta del agente cargada",
        "Carte de l’agent chargée",
        "Agentenkarte geladen",
        "エージェントカードを読み込みました",
        "代理卡片已加载",
        "حُمّلت بطاقة الوكيل"
    ],
    "Failed to load agent card: {value1}": [
        "एजेंट कार्ड लोड नहीं हुआ: {value1}",
        "No se pudo cargar la tarjeta: {value1}",
        "Échec du chargement de la carte : {value1}",
        "Agentenkarte konnte nicht geladen werden: {value1}",
        "カードの読み込みに失敗：{value1}",
        "代理卡片加载失败：{value1}",
        "فشل تحميل بطاقة الوكيل: {value1}"
    ],
    "Skill '{value1}' invoked": [
        "skill '{value1}' कॉल हुई",
        "Habilidad '{value1}' invocada",
        "Compétence '{value1}' appelée",
        "Fähigkeit '{value1}' aufgerufen",
        "スキル「{value1}」を呼び出しました",
        "已调用技能“{value1}”",
        "تم استدعاء المهارة '{value1}'"
    ],
    "Skill call failed: {value1}": [
        "skill कॉल विफल: {value1}",
        "Error al invocar habilidad: {value1}",
        "Échec de l’appel : {value1}",
        "Fähigkeitsaufruf fehlgeschlagen: {value1}",
        "スキル呼び出しに失敗：{value1}",
        "技能调用失败：{value1}",
        "فشل استدعاء المهارة: {value1}"
    ],
    "Failed to fetch task: {value1}": [
        "टास्क नहीं मिला: {value1}",
        "No se pudo obtener la tarea: {value1}",
        "Échec de récupération de tâche : {value1}",
        "Task konnte nicht abgerufen werden: {value1}",
        "タスク取得に失敗：{value1}",
        "获取任务失败：{value1}",
        "فشل جلب المهمة: {value1}"
    ],
    "Failed to cancel task: {value1}": [
        "टास्क रद्द नहीं हुआ: {value1}",
        "No se pudo cancelar la tarea: {value1}",
        "Échec d’annulation de tâche : {value1}",
        "Task konnte nicht abgebrochen werden: {value1}",
        "タスクのキャンセルに失敗：{value1}",
        "取消任务失败：{value1}",
        "فشل إلغاء المهمة: {value1}"
    ],
    "Tried {value1}.": [
        "आज़माया: {value1}।",
        "Se probó {value1}.",
        "Essai de {value1}.",
        "Versucht: {value1}.",
        "試行済み：{value1}。",
        "已尝试 {value1}。",
        "تمت تجربة {value1}."
    ],
    "Proxied": [
        "प्रॉक्सी से",
        "Por proxy",
        "Via proxy",
        "Über Proxy",
        "プロキシ経由",
        "经代理",
        "عبر الوكيل"
    ],
    "Strict": [
        "सख्त",
        "Estricto",
        "Strict",
        "Strikt",
        "厳密",
        "严格",
        "صارم"
    ],
    "Request timeout: {value1}s": [
        "अनुरोध समयसीमा: {value1}s",
        "Tiempo de espera: {value1}s",
        "Délai de requête : {value1}s",
        "Anfrage-Zeitlimit: {value1}s",
        "要求タイムアウト：{value1}s",
        "请求超时：{value1}s",
        "مهلة الطلب: {value1}s"
    ],
    "No context yet": [
        "अभी कोई संदर्भ नहीं",
        "Todavía no hay contexto",
        "Aucun contexte pour le moment",
        "Noch kein Kontext",
        "コンテキストはまだありません",
        "暂无上下文",
        "لا يوجد سياق بعد"
    ],
    " in {value1}": [
        " अवधि {value1}",
        " en {value1}",
        " en {value1}",
        " in {value1}",
        " 所要時間 {value1}",
        " 耗时 {value1}",
        " خلال {value1}"
    ],
    "Enter an agent URL above and click 'Discover'": [
        "ऊपर एजेंट URL भरकर Discover दबाएँ",
        "Introduce la URL arriba y pulsa Descubrir",
        "Saisissez l’URL ci-dessus puis cliquez sur Découvrir",
        "Agenten-URL oben eingeben und Entdecken drücken",
        "上にエージェントURLを入力して検出を押してください",
        "在上方输入代理 URL 并点击发现",
        "أدخل عنوان الوكيل أعلاه واضغط اكتشاف"
    ],
    "Invoke: {value1}": [
        "कॉल: {value1}",
        "Invocar: {value1}",
        "Appeler : {value1}",
        "Aufrufen: {value1}",
        "呼び出し：{value1}",
        "调用：{value1}",
        "استدعاء: {value1}"
    ],
    "Select a skill": [
        "skill चुनें",
        "Selecciona una habilidad",
        "Sélectionnez une compétence",
        "Fähigkeit wählen",
        "スキルを選択",
        "选择技能",
        "اختر مهارة"
    ],
    "Chat ({value1})": [
        "चैट ({value1})",
        "Conversación ({value1})",
        "Discussion ({value1})",
        "Chat ({value1})",
        "チャット（{value1}）",
        "聊天（{value1}）",
        "المحادثة ({value1})"
    ],
    "Streaming ({value1})": [
        "स्ट्रीमिंग ({value1})",
        "Streaming ({value1})",
        "Diffusion ({value1})",
        "Streaming ({value1})",
        "ストリーミング（{value1}）",
        "流式传输（{value1}）",
        "البث ({value1})"
    ],
    "→ OUT": [
        "→ भेजा",
        "→ SALIDA",
        "→ SORTANT",
        "→ AUS",
        "→ 送信",
        "→ 发送",
        "→ صادر"
    ],
    "← IN": [
        "← प्राप्त",
        "← ENTRADA",
        "← ENTRANT",
        "← EIN",
        "← 受信",
        "← 接收",
        "← وارد"
    ],
    "Sent as 'Authorization: Bearer <token>'": [
        "Authorization: Bearer <token> के रूप में भेजा जाता है",
        "Se envía como Authorization: Bearer <token>",
        "Envoyé comme Authorization: Bearer <token>",
        "Gesendet als Authorization: Bearer <token>",
        "Authorization: Bearer <token>で送信",
        "以 Authorization: Bearer <token> 发送",
        "يُرسل بصيغة Authorization: Bearer <token>"
    ],
    "Send a message to start": [
        "शुरू करने के लिए संदेश भेजें",
        "Envía un mensaje para empezar",
        "Envoyez un message pour commencer",
        "Zum Starten eine Nachricht senden",
        "メッセージを送信して開始",
        "发送消息以开始",
        "أرسل رسالة للبدء"
    ],
    "Discover an agent first": [
        "पहले एजेंट खोजें",
        "Descubre primero un agente",
        "Découvrez d’abord un agent",
        "Zuerst einen Agenten entdecken",
        "先にエージェントを検出してください",
        "请先发现代理",
        "اكتشف وكيلًا أولًا"
    ],
    "Message {value1}…": [
        "{value1} को संदेश…",
        "Mensaje a {value1}…",
        "Message à {value1}…",
        "Nachricht an {value1}…",
        "{value1}へメッセージ…",
        "向 {value1} 发送消息…",
        "رسالة إلى {value1}…"
    ],
    "Invalid discovery metadata.": [
        "अमान्य discovery metadata।",
        "Metadatos de descubrimiento no válidos.",
        "Métadonnées de découverte invalides.",
        "Ungültige Discovery-Metadaten.",
        "無効な検出メタデータです。",
        "无效的发现元数据。",
        "بيانات اكتشاف غير صالحة."
    ],
    "Basic (UTF-8)": [
        "Basic प्रमाणीकरण (UTF-8)",
        "Autenticación Basic (UTF-8)",
        "Authentification Basic (UTF-8)",
        "Basic-Authentifizierung (UTF-8)",
        "Basic認証（UTF-8）",
        "Basic 身份验证（UTF-8）",
        "مصادقة Basic ‏(UTF-8)"
    ],
    "Basic username must not contain a colon.": [
        "Basic username में colon नहीं हो सकता।",
        "El usuario Basic no debe contener dos puntos.",
        "Le nom Basic ne doit pas contenir de deux-points.",
        "Basic-Benutzername darf keinen Doppelpunkt enthalten.",
        "Basicのユーザー名にコロンは使用できません。",
        "Basic 用户名不能包含冒号。",
        "يجب ألا يتضمن اسم مستخدم Basic نقطتين رأسيتين."
    ],
    "Basic credentials must not contain control characters.": [
        "Basic credentials में control characters नहीं हो सकते।",
        "Las credenciales Basic no deben contener caracteres de control.",
        "Les identifiants Basic ne doivent pas contenir de caractères de contrôle.",
        "Basic-Zugangsdaten dürfen keine Steuerzeichen enthalten.",
        "Basicの認証情報に制御文字は使用できません。",
        "Basic 凭据不能包含控制字符。",
        "يجب ألا تتضمن بيانات Basic محارف تحكم."
    ],
    "Swagger UI keeps its own interface language. External $refs and Try-it-out can send network requests.": [
        "Swagger UI अपनी इंटरफ़ेस भाषा रखता है। बाहरी $ref और Try-it-out नेटवर्क अनुरोध भेज सकते हैं।",
        "Swagger UI conserva su propio idioma. Los $ref externos y Try-it-out pueden enviar solicitudes de red.",
        "Swagger UI garde sa propre langue. Les $ref externes et Try-it-out peuvent envoyer des requêtes réseau.",
        "Swagger UI behält seine eigene Oberflächensprache. Externe $ref und Try-it-out können Netzwerkanfragen senden.",
        "Swagger UIは独自の表示言語を使用します。外部$refとTry-it-outはネットワーク要求を送る場合があります。",
        "Swagger UI 使用自身的界面语言。外部 $ref 和 Try-it-out 可能发送网络请求。",
        "يحتفظ Swagger UI بلغته الخاصة. قد ترسل مراجع $ref الخارجية وTry-it-out طلبات شبكة."
    ],
    "Issuer should be an HTTPS URL.": [
        "Issuer HTTPS URL होना चाहिए।",
        "El emisor debe ser una URL HTTPS.",
        "L’émetteur doit être une URL HTTPS.",
        "Aussteller muss eine HTTPS-URL sein.",
        "発行者はHTTPS URLである必要があります。",
        "颁发者应为 HTTPS URL。",
        "يجب أن يكون المُصدر عنوان HTTPS."
    ],
    "Missing authorization_endpoint.": [
        "authorization_endpoint नहीं मिला।",
        "Falta authorization_endpoint.",
        "authorization_endpoint absent.",
        "authorization_endpoint fehlt.",
        "authorization_endpointがありません。",
        "缺少 authorization_endpoint。",
        "authorization_endpoint مفقود."
    ],
    "Missing token_endpoint.": [
        "token_endpoint नहीं मिला।",
        "Falta token_endpoint.",
        "token_endpoint absent.",
        "token_endpoint fehlt.",
        "token_endpointがありません。",
        "缺少 token_endpoint。",
        "token_endpoint مفقود."
    ],
    "Missing jwks_uri for signed-token key discovery.": [
        "साइन किए token की key खोज के लिए jwks_uri नहीं है।",
        "Falta jwks_uri para descubrir claves de tokens firmados.",
        "jwks_uri manque pour découvrir les clés des jetons signés.",
        "jwks_uri zur Schlüsselsuche signierter Token fehlt.",
        "署名トークンの鍵検出に必要なjwks_uriがありません。",
        "缺少用于发现签名令牌密钥的 jwks_uri。",
        "jwks_uri مفقود لاكتشاف مفاتيح الرموز الموقّعة."
    ],
    "Provider does not advertise the recommended S256 PKCE method.": [
        "प्रदाता सुझाया S256 PKCE तरीका घोषित नहीं करता।",
        "El proveedor no anuncia el método PKCE S256 recomendado.",
        "Le fournisseur n’annonce pas la méthode PKCE S256 recommandée.",
        "Anbieter nennt die empfohlene PKCE-S256-Methode nicht.",
        "プロバイダーは推奨されるS256 PKCE方式を公開していません。",
        "提供方未声明推荐的 S256 PKCE 方法。",
        "لا يعلن المزوّد طريقة S256 PKCE الموصى بها."
    ],
    "Use a lowercase W3C traceparent: version-traceId-parentId-flags.": [
        "छोटे अक्षरों में W3C traceparent दें: version-traceId-parentId-flags।",
        "Usa traceparent W3C en minúsculas: version-traceId-parentId-flags.",
        "Utilisez traceparent W3C en minuscules : version-traceId-parentId-flags.",
        "W3C-traceparent kleingeschrieben angeben: version-traceId-parentId-flags.",
        "小文字のW3C traceparentを入力：version-traceId-parentId-flags。",
        "请输入小写 W3C traceparent：version-traceId-parentId-flags。",
        "استخدم traceparent بأحرف صغيرة: version-traceId-parentId-flags."
    ],
    "Trace and parent IDs must be nonzero.": [
        "Trace और parent ID शून्य नहीं हो सकते।",
        "Los ID de traza y padre no pueden ser cero.",
        "Les ID de trace et parent doivent être non nuls.",
        "Trace- und Parent-ID dürfen nicht null sein.",
        "トレースIDと親IDはゼロ以外である必要があります。",
        "跟踪 ID 和父 ID 必须非零。",
        "يجب ألا تكون معرّفات التتبع والأصل أصفارًا."
    ],
    "Invalid version-specific traceparent fields.": [
        "संस्करण-विशिष्ट traceparent फ़ील्ड अमान्य हैं।",
        "Campos de traceparent específicos de versión no válidos.",
        "Champs traceparent spécifiques à la version invalides.",
        "Ungültige versionsspezifische traceparent-Felder.",
        "バージョン固有のtraceparentフィールドが無効です。",
        "版本专用 traceparent 字段无效。",
        "حقول traceparent الخاصة بالإصدار غير صالحة."
    ],
    "Tracestate exceeds 512 characters.": [
        "Tracestate 512 अक्षरों से बड़ा है।",
        "Tracestate supera los 512 caracteres.",
        "Tracestate dépasse 512 caractères.",
        "Tracestate überschreitet 512 Zeichen.",
        "tracestateが512文字を超えています。",
        "Tracestate 超过 512 个字符。",
        "يتجاوز Tracestate ‏512 محرفًا."
    ],
    "Tracestate supports at most 32 entries.": [
        "Tracestate में अधिकतम 32 प्रविष्टियाँ हैं।",
        "Tracestate admite como máximo 32 entradas.",
        "Tracestate accepte au plus 32 entrées.",
        "Tracestate unterstützt höchstens 32 Einträge.",
        "tracestateは最大32項目です。",
        "Tracestate 最多支持 32 个条目。",
        "يدعم Tracestate ‏32 إدخالًا كحد أقصى."
    ],
    "Invalid or duplicate tracestate entry: {entry}": [
        "अमान्य या दोहरी tracestate प्रविष्टि: {entry}",
        "Entrada tracestate no válida o duplicada: {entry}",
        "Entrée tracestate invalide ou dupliquée : {entry}",
        "Ungültiger oder doppelter tracestate-Eintrag: {entry}",
        "無効または重複するtracestate項目：{entry}",
        "无效或重复的 tracestate 条目：{entry}",
        "إدخال tracestate غير صالح أو مكرر: {entry}"
    ],
    "Missing required `asyncapi` version.": [
        "आवश्यक asyncapi संस्करण नहीं है।",
        "Falta la versión obligatoria `asyncapi`.",
        "Version `asyncapi` requise absente.",
        "Erforderliche `asyncapi`-Version fehlt.",
        "必須の`asyncapi`バージョンがありません。",
        "缺少必需的 `asyncapi` 版本。",
        "إصدار `asyncapi` المطلوب مفقود."
    ],
    "Missing `info.title`.": [
        "info.title नहीं है।",
        "Falta `info.title`.",
        "`info.title` absent.",
        "`info.title` fehlt.",
        "`info.title`がありません。",
        "缺少 `info.title`。",
        "`info.title` مفقود."
    ],
    "Missing `info.version`.": [
        "info.version नहीं है।",
        "Falta `info.version`.",
        "`info.version` absent.",
        "`info.version` fehlt.",
        "`info.version`がありません。",
        "缺少 `info.version`。",
        "`info.version` مفقود."
    ],
    "No channels were declared.": [
        "कोई चैनल घोषित नहीं है।",
        "No se declararon canales.",
        "Aucun canal déclaré.",
        "Keine Kanäle deklariert.",
        "チャネルが定義されていません。",
        "未声明通道。",
        "لم تُعلن قنوات."
    ],
    "This tool supports AsyncAPI 2.x and 3.x documents.": [
        "यह टूल AsyncAPI 2.x और 3.x दस्तावेज़ संभालता है।",
        "Esta herramienta admite documentos AsyncAPI 2.x y 3.x.",
        "Cet outil prend en charge AsyncAPI 2.x et 3.x.",
        "Dieses Werkzeug unterstützt AsyncAPI 2.x und 3.x.",
        "このツールはAsyncAPI 2.xと3.xに対応します。",
        "此工具支持 AsyncAPI 2.x 和 3.x 文档。",
        "تدعم هذه الأداة مستندات AsyncAPI 2.x و3.x."
    ],
    "Advertised": [
        "घोषित",
        "Anunciado",
        "Annoncé",
        "Angekündigt",
        "公開済み",
        "已声明",
        "معلن"
    ],
    "Not advertised": [
        "घोषित नहीं",
        "No anunciado",
        "Non annoncé",
        "Nicht angekündigt",
        "未公開",
        "未声明",
        "غير معلن"
    ],
    "Task IDs are returned by messaging responses or from the chat tab's response": [
        "टास्क ID संदेश या चैट की प्रतिक्रिया में मिलता है",
        "Los ID de tarea aparecen en las respuestas de mensajes o del chat",
        "Les ID de tâche figurent dans les réponses des messages ou de la discussion",
        "Task-IDs stehen in Nachrichten- oder Chatantworten",
        "タスクIDはメッセージまたはチャットの応答に含まれます",
        "任务 ID 来自消息或聊天响应",
        "تظهر معرّفات المهام في ردود الرسائل أو المحادثة"
    ],
    "Invalid JSON/YAML OpenAPI document": [
        "अमान्य JSON/YAML OpenAPI दस्तावेज़",
        "Documento OpenAPI JSON/YAML no válido",
        "Document OpenAPI JSON/YAML invalide",
        "Ungültiges JSON-/YAML-OpenAPI-Dokument",
        "無効なJSON/YAML OpenAPIドキュメント",
        "无效的 JSON/YAML OpenAPI 文档",
        "مستند OpenAPI بصيغة JSON/YAML غير صالح"
    ],
    "OpenAPI / Swagger Spec (JSON or YAML)": [
        "OpenAPI/Swagger spec (JSON या YAML)",
        "Especificación OpenAPI/Swagger (JSON o YAML)",
        "Spécification OpenAPI/Swagger (JSON ou YAML)",
        "OpenAPI-/Swagger-Spezifikation (JSON oder YAML)",
        "OpenAPI/Swagger仕様（JSON/YAML）",
        "OpenAPI/Swagger 规范（JSON 或 YAML）",
        "مواصفة OpenAPI/Swagger ‏(JSON أو YAML)"
    ],
    "{version} · legacy handshake": [
        "{version} · पुराना handshake",
        "{version} · negociación antigua",
        "{version} · échange initial ancien",
        "{version} · älterer Handshake",
        "{version} · 旧ハンドシェイク",
        "{version} · 旧版握手",
        "{version} · مصافحة قديمة"
    ],
    "Direct OPTIONS (CORS preflight)": [
        "सीधा OPTIONS (CORS पूर्व-जाँच)",
        "OPTIONS directo (preflight CORS)",
        "OPTIONS direct (preflight CORS)",
        "Direktes OPTIONS (CORS-Preflight)",
        "直接OPTIONS（CORSプリフライト）",
        "直接 OPTIONS（CORS 预检）",
        "OPTIONS مباشر (فحص CORS الأولي)"
    ],
    "Direct GET agent card": [
        "सीधा GET एजेंट कार्ड",
        "GET directo de tarjeta",
        "GET direct de la carte",
        "Agentenkarte direkt per GET",
        "カードを直接GET",
        "直接 GET 代理卡片",
        "GET مباشر لبطاقة الوكيل"
    ],
    "Parse URL": [
        "URL पार्स करें",
        "Analizar URL",
        "Analyser l’URL",
        "URL analysieren",
        "URLを解析",
        "解析 URL",
        "تحليل العنوان"
    ],
    "Invalid URL": [
        "अमान्य URL",
        "URL no válida",
        "URL invalide",
        "Ungültige URL",
        "無効なURL",
        "无效 URL",
        "عنوان غير صالح"
    ],
    "Invalid agent URL": [
        "अमान्य एजेंट URL",
        "URL del agente no válida",
        "URL de l’agent invalide",
        "Ungültige Agenten-URL",
        "無効なエージェントURL",
        "无效代理 URL",
        "عنوان الوكيل غير صالح"
    ],
    "Skill missing required 'id'": [
        "skill में आवश्यक id नहीं है",
        "Falta id obligatorio de habilidad",
        "id requis de compétence absent",
        "Erforderliche Fähigkeits-id fehlt",
        "スキルの必須idがありません",
        "技能缺少必需的 id",
        "معرّف id المطلوب للمهارة مفقود"
    ],
    "Skill missing required 'name'": [
        "skill में आवश्यक name नहीं है",
        "Falta name obligatorio de habilidad",
        "name requis de compétence absent",
        "Erforderlicher Fähigkeits-name fehlt",
        "スキルの必須nameがありません",
        "技能缺少必需的 name",
        "اسم name المطلوب للمهارة مفقود"
    ],
    "{count} skill(s) declared": [
        "{count} skills घोषित हैं",
        "{count} habilidades declaradas",
        "{count} compétences déclarées",
        "{count} Fähigkeiten deklariert",
        "{count}件のスキルを定義",
        "已声明 {count} 个技能",
        "مهارات معلنة: {count}"
    ],
    "{count} declared": [
        "{count} घोषित",
        "{count} declarados",
        "{count} déclarés",
        "{count} deklariert",
        "{count}件を定義",
        "已声明 {count} 项",
        "معلن: {count}"
    ],
    "Card loaded": [
        "कार्ड लोड हुआ",
        "Tarjeta cargada",
        "Carte chargée",
        "Karte geladen",
        "カード読込済み",
        "卡片已加载",
        "حُمّلت البطاقة"
    ],
    "Agent has not declared streaming capability — request may fail.": [
        "एजेंट ने स्ट्रीमिंग घोषित नहीं की — अनुरोध विफल हो सकता है।",
        "El agente no declara streaming; la solicitud puede fallar.",
        "L’agent ne déclare pas le streaming ; la requête peut échouer.",
        "Agent deklariert kein Streaming; die Anfrage kann fehlschlagen.",
        "ストリーミング未定義のため、要求が失敗する可能性があります。",
        "代理未声明流式功能，请求可能失败。",
        "لم يعلن الوكيل دعم البث؛ قد يفشل الطلب."
    ]
};
