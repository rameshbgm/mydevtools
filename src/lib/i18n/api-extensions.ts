import type { TranslationColumns } from "./tool-names";

// Columns: Hindi, Spanish, French, German, Japanese, Simplified Chinese, Arabic.
// Request, schema, configuration, diagnostic and response data remain unchanged.
export const API_EXTENSION_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Remove": [
        "हटाएँ",
        "Eliminar",
        "Supprimer",
        "Entfernen",
        "削除",
        "移除",
        "إزالة"
    ],
    "Running…": [
        "चल रहा है…",
        "Ejecutando…",
        "Exécution…",
        "Wird ausgeführt…",
        "実行中…",
        "运行中…",
        "جارٍ التنفيذ…"
    ],
    "Remove file": [
        "फ़ाइल हटाएँ",
        "Eliminar archivo",
        "Supprimer le fichier",
        "Datei entfernen",
        "ファイルを削除",
        "移除文件",
        "إزالة الملف"
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
    "Working…": [
        "काम जारी है…",
        "Procesando…",
        "Traitement…",
        "Wird verarbeitet…",
        "処理中…",
        "处理中…",
        "جارٍ العمل…"
    ],
    "Client private key (PEM)": [
        "क्लाइंट निजी कुंजी (PEM)",
        "Clave privada del cliente (PEM)",
        "Clé privée du client (PEM)",
        "Privater Client-Schlüssel (PEM)",
        "クライアント秘密鍵（PEM）",
        "客户端私钥（PEM）",
        "المفتاح الخاص للعميل (PEM)"
    ],
    "Collections, gRPC & local mocks": [
        "संग्रह, gRPC और स्थानीय मॉक",
        "Colecciones, gRPC y mocks locales",
        "Collections, gRPC et mocks locaux",
        "Sammlungen, gRPC und lokale Mocks",
        "コレクション、gRPC、ローカルモック",
        "集合、gRPC 与本地模拟",
        "المجموعات وgRPC والمحاكاة المحلية"
    ],
    "Collection runner": [
        "संग्रह रनर",
        "Ejecutor de colecciones",
        "Exécuteur de collections",
        "Sammlung ausführen",
        "コレクション実行",
        "集合运行器",
        "مشغّل المجموعات"
    ],
    "HTTP status": [
        "HTTP स्थिति",
        "Estado HTTP",
        "Statut HTTP",
        "HTTP-Status",
        "HTTPステータス",
        "HTTP 状态",
        "حالة HTTP"
    ],
    "Response header": [
        "प्रतिक्रिया हेडर",
        "Cabecera de respuesta",
        "En-tête de réponse",
        "Antwortheader",
        "レスポンスヘッダー",
        "响应头",
        "ترويسة الاستجابة"
    ],
    "JSON Pointer": [
        "JSON पॉइंटर",
        "Puntero JSON",
        "Pointeur JSON",
        "JSON-Zeiger",
        "JSONポインター",
        "JSON 指针",
        "مؤشر JSON"
    ],
    "Duration (ms)": [
        "अवधि (ms)",
        "Duración (ms)",
        "Durée (ms)",
        "Dauer (ms)",
        "所要時間（ms）",
        "耗时（ms）",
        "المدة (ms)"
    ],
    "Equals": [
        "बराबर है",
        "Es igual a",
        "Est égal à",
        "Ist gleich",
        "等しい",
        "等于",
        "يساوي"
    ],
    "Contains": [
        "शामिल है",
        "Contiene",
        "Contient",
        "Enthält",
        "含む",
        "包含",
        "يحتوي على"
    ],
    "Exists": [
        "मौजूद है",
        "Existe",
        "Existe",
        "Vorhanden",
        "存在する",
        "存在",
        "موجود"
    ],
    "Less than": [
        "से कम",
        "Menor que",
        "Inférieur à",
        "Kleiner als",
        "より小さい",
        "小于",
        "أقل من"
    ],
    "Plan saved in this project. Requests and environment values are managed in the HTTP client.": [
        "योजना इस प्रोजेक्ट में सहेजी गई। अनुरोध और परिवेश मान HTTP क्लाइंट में प्रबंधित होते हैं।",
        "Plan guardado en este proyecto. Las solicitudes y los valores del entorno se gestionan en el cliente HTTP.",
        "Plan enregistré dans ce projet. Les requêtes et valeurs d’environnement se gèrent dans le client HTTP.",
        "Plan in diesem Projekt gespeichert. Anfragen und Umgebungswerte werden im HTTP-Client verwaltet.",
        "このプロジェクトに計画を保存しました。リクエストと環境の値はHTTPクライアントで管理します。",
        "计划已保存在此项目中。请求和环境值在 HTTP 客户端中管理。",
        "حُفظت الخطة في هذا المشروع. تُدار الطلبات وقيم البيئة في عميل HTTP."
    ],
    "Read from": [
        "यहाँ से पढ़ें",
        "Leer de",
        "Lire depuis",
        "Lesen aus",
        "読み取り元",
        "读取来源",
        "القراءة من"
    ],
    "{rule} source": [
        "{rule} स्रोत",
        "Origen de {rule}",
        "Source de {rule}",
        "Quelle für {rule}",
        "{rule}の読み取り元",
        "{rule} 来源",
        "مصدر {rule}"
    ],
    "Header name": [
        "हेडर नाम",
        "Nombre de cabecera",
        "Nom d’en-tête",
        "Headername",
        "ヘッダー名",
        "响应头名称",
        "اسم الترويسة"
    ],
    "{rule} path": [
        "{rule} पथ",
        "Ruta de {rule}",
        "Chemin de {rule}",
        "Pfad für {rule}",
        "{rule}のパス",
        "{rule} 路径",
        "مسار {rule}"
    ],
    "Run saved HTTP requests in order. Capture a response value as a variable for later steps, and check status, headers, JSON or timing. Environment:": [
        "सहेजे HTTP अनुरोध क्रम में चलाएँ। आगे के चरणों के लिए प्रतिक्रिया मान को चर में कैप्चर करें और स्थिति, हेडर, JSON या समय जाँचें। परिवेश:",
        "Ejecuta solicitudes HTTP guardadas en orden. Captura un valor de respuesta como variable para los pasos siguientes y comprueba estado, cabeceras, JSON o tiempos. Entorno:",
        "Exécutez les requêtes HTTP enregistrées dans l’ordre. Capturez une valeur de réponse comme variable pour les étapes suivantes et vérifiez statut, en-têtes, JSON ou durée. Environnement :",
        "Gespeicherte HTTP-Anfragen der Reihe nach ausführen. Antwortwerte als Variablen für spätere Schritte erfassen und Status, Header, JSON oder Dauer prüfen. Umgebung:",
        "保存済みHTTPリクエストを順に実行します。レスポンスの値を後続ステップ用の変数に取得し、ステータス、ヘッダー、JSON、所要時間を検証します。環境：",
        "依次运行已保存的 HTTP 请求。将响应值捕获为后续步骤的变量，并检查状态、响应头、JSON 或耗时。环境：",
        "شغّل طلبات HTTP المحفوظة بالترتيب. التقط قيمة استجابة كمتغير للخطوات اللاحقة، وتحقق من الحالة أو الترويسات أو JSON أو الوقت. البيئة:"
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
    "Collection transport": [
        "संग्रह परिवहन",
        "Transporte de la colección",
        "Transport de la collection",
        "Übertragung der Sammlung",
        "コレクションの通信経路",
        "集合传输方式",
        "نقل المجموعة"
    ],
    "Managed proxy · public endpoints": [
        "प्रबंधित प्रॉक्सी · सार्वजनिक एंडपॉइंट",
        "Proxy gestionado · endpoints públicos",
        "Proxy géré · points d’accès publics",
        "Verwalteter Proxy · öffentliche Endpunkte",
        "管理プロキシ · 公開エンドポイント",
        "托管代理 · 公共端点",
        "وكيل مُدار · نقاط اتصال عامة"
    ],
    "Local connector · private / localhost": [
        "स्थानीय कनेक्टर · निजी / localhost",
        "Conector local · privado / localhost",
        "Connecteur local · privé / localhost",
        "Lokaler Connector · privat / localhost",
        "ローカルコネクター · 非公開 / localhost",
        "本地连接器 · 私有 / localhost",
        "موصل محلي · خاص / localhost"
    ],
    "Iterations": [
        "पुनरावृत्तियाँ",
        "Iteraciones",
        "Itérations",
        "Durchläufe",
        "反復回数",
        "迭代次数",
        "التكرارات"
    ],
    "Stop on failure": [
        "विफलता पर रोकें",
        "Detener al fallar",
        "Arrêter en cas d’échec",
        "Bei Fehler anhalten",
        "失敗時に停止",
        "失败时停止",
        "التوقف عند الفشل"
    ],
    "Each iteration starts with the active environment; captures last for that iteration. Use {iteration} for its number. TLS certificates are verified. Limits: 50 steps, 100 requests, 15 seconds per request, 3 minutes per run, 2 MiB per response and 8 MiB of results.": [
        "हर पुनरावृत्ति सक्रिय परिवेश से शुरू होती है; कैप्चर उसी पुनरावृत्ति तक रहते हैं। उसकी संख्या के लिए {iteration} उपयोग करें। TLS प्रमाणपत्र सत्यापित होते हैं। सीमाएँ: 50 चरण, 100 अनुरोध, प्रति अनुरोध 15 सेकंड, प्रति रन 3 मिनट, प्रति प्रतिक्रिया 2 MiB और परिणामों के लिए 8 MiB।",
        "Cada iteración empieza con el entorno activo; las capturas duran esa iteración. Usa {iteration} para su número. Se verifican los certificados TLS. Límites: 50 pasos, 100 solicitudes, 15 segundos por solicitud, 3 minutos por ejecución, 2 MiB por respuesta y 8 MiB de resultados.",
        "Chaque itération repart de l’environnement actif ; les captures durent cette itération. Utilisez {iteration} pour son numéro. Les certificats TLS sont vérifiés. Limites : 50 étapes, 100 requêtes, 15 secondes par requête, 3 minutes par exécution, 2 MiB par réponse et 8 MiB de résultats.",
        "Jeder Durchlauf beginnt mit der aktiven Umgebung; erfasste Werte gelten nur für diesen Durchlauf. {iteration} liefert seine Nummer. TLS-Zertifikate werden geprüft. Grenzen: 50 Schritte, 100 Anfragen, 15 Sekunden je Anfrage, 3 Minuten je Lauf, 2 MiB je Antwort und 8 MiB Ergebnisse.",
        "各反復は有効な環境から開始し、取得した変数はその反復内で有効です。番号には{iteration}を使います。TLS証明書を検証します。上限：50ステップ、100リクエスト、1件15秒、1回3分、レスポンスごとに2 MiB、結果全体で8 MiB。",
        "每次迭代从当前环境开始；捕获值仅在本次迭代有效。使用 {iteration} 获取迭代编号。TLS 证书会被验证。限制：50 个步骤、100 次请求、每次请求 15 秒、每轮运行 3 分钟、每个响应 2 MiB、结果总计 8 MiB。",
        "يبدأ كل تكرار بالبيئة النشطة؛ وتبقى القيم الملتقطة لذلك التكرار. استخدم {iteration} لرقمه. تُفحص شهادات TLS. الحدود: 50 خطوة و100 طلب و15 ثانية لكل طلب و3 دقائق لكل تشغيل و2 MiB لكل استجابة و8 MiB للنتائج."
    ],
    "Imported test scripts are not executed by the runner.": [
        "रनर आयातित परीक्षण स्क्रिप्ट नहीं चलाता।",
        "El ejecutor no ejecuta los scripts de prueba importados.",
        "L’exécuteur ne lance pas les scripts de test importés.",
        "Importierte Testskripte werden nicht ausgeführt.",
        "実行機能はインポートされたテストスクリプトを実行しません。",
        "运行器不会执行导入的测试脚本。",
        "لا يشغّل المشغّل نصوص الاختبار المستوردة."
    ],
    "Save a request in the HTTP client above, or import a Postman collection, to add the first step.": [
        "पहला चरण जोड़ने के लिए ऊपर HTTP क्लाइंट में अनुरोध सहेजें या Postman संग्रह आयात करें।",
        "Guarda una solicitud en el cliente HTTP de arriba o importa una colección de Postman para añadir el primer paso.",
        "Enregistrez une requête dans le client HTTP ci-dessus ou importez une collection Postman pour ajouter la première étape.",
        "Für den ersten Schritt oben eine Anfrage im HTTP-Client speichern oder eine Postman-Sammlung importieren.",
        "最初のステップを追加するには、上のHTTPクライアントでリクエストを保存するか、Postmanコレクションをインポートしてください。",
        "在上方 HTTP 客户端保存请求，或导入 Postman 集合，以添加第一个步骤。",
        "احفظ طلبًا في عميل HTTP أعلاه أو استورد مجموعة Postman لإضافة الخطوة الأولى."
    ],
    "Step {step}": [
        "चरण {step}",
        "Paso {step}",
        "Étape {step}",
        "Schritt {step}",
        "ステップ{step}",
        "步骤 {step}",
        "الخطوة {step}"
    ],
    "Request for step {step}": [
        "चरण {step} का अनुरोध",
        "Solicitud del paso {step}",
        "Requête de l’étape {step}",
        "Anfrage für Schritt {step}",
        "ステップ{step}のリクエスト",
        "步骤 {step} 的请求",
        "طلب الخطوة {step}"
    ],
    "Move step {step} up": [
        "चरण {step} ऊपर करें",
        "Subir el paso {step}",
        "Monter l’étape {step}",
        "Schritt {step} nach oben",
        "ステップ{step}を上へ",
        "上移步骤 {step}",
        "نقل الخطوة {step} لأعلى"
    ],
    "Up": [
        "ऊपर",
        "Subir",
        "Monter",
        "Nach oben",
        "上へ",
        "上移",
        "لأعلى"
    ],
    "Move step {step} down": [
        "चरण {step} नीचे करें",
        "Bajar el paso {step}",
        "Descendre l’étape {step}",
        "Schritt {step} nach unten",
        "ステップ{step}を下へ",
        "下移步骤 {step}",
        "نقل الخطوة {step} لأسفل"
    ],
    "Down": [
        "नीचे",
        "Bajar",
        "Descendre",
        "Nach unten",
        "下へ",
        "下移",
        "لأسفل"
    ],
    "Remove step {step}": [
        "चरण {step} हटाएँ",
        "Eliminar el paso {step}",
        "Supprimer l’étape {step}",
        "Schritt {step} entfernen",
        "ステップ{step}を削除",
        "移除步骤 {step}",
        "إزالة الخطوة {step}"
    ],
    "Assertions ({assertions}) and captures ({captures})": [
        "जाँचें ({assertions}) और कैप्चर ({captures})",
        "Aserciones ({assertions}) y capturas ({captures})",
        "Assertions ({assertions}) et captures ({captures})",
        "Prüfungen ({assertions}) und erfasste Variablen ({captures})",
        "検証（{assertions}）と変数取得（{captures}）",
        "断言（{assertions}）和捕获（{captures}）",
        "التحققات ({assertions}) والقيم الملتقطة ({captures})"
    ],
    "Assertions": [
        "जाँचें",
        "Aserciones",
        "Assertions",
        "Prüfungen",
        "検証",
        "断言",
        "التحققات"
    ],
    "Assertion {rule} step {step}": [
        "जाँच {rule} चरण {step}",
        "Aserción {rule} del paso {step}",
        "Assertion {rule} de l’étape {step}",
        "Prüfung {rule} in Schritt {step}",
        "ステップ{step}の検証{rule}",
        "步骤 {step} 的断言 {rule}",
        "التحقق {rule} في الخطوة {step}"
    ],
    "Check": [
        "जाँच",
        "Comprobar",
        "Vérifier",
        "Prüfen",
        "条件",
        "检查",
        "التحقق"
    ],
    "Assertion {rule} operator step {step}": [
        "जाँच {rule} ऑपरेटर चरण {step}",
        "Operador de la aserción {rule} del paso {step}",
        "Opérateur de l’assertion {rule} de l’étape {step}",
        "Operator der Prüfung {rule} in Schritt {step}",
        "ステップ{step}の検証{rule}の演算子",
        "步骤 {step} 的断言 {rule} 运算符",
        "عامل التحقق {rule} في الخطوة {step}"
    ],
    "Expected": [
        "अपेक्षित",
        "Esperado",
        "Attendu",
        "Erwartet",
        "期待値",
        "预期值",
        "القيمة المتوقعة"
    ],
    "Remove assertion {rule} step {step}": [
        "चरण {step} की जाँच {rule} हटाएँ",
        "Eliminar la aserción {rule} del paso {step}",
        "Supprimer l’assertion {rule} de l’étape {step}",
        "Prüfung {rule} aus Schritt {step} entfernen",
        "ステップ{step}の検証{rule}を削除",
        "移除步骤 {step} 的断言 {rule}",
        "إزالة التحقق {rule} من الخطوة {step}"
    ],
    "Add assertion": [
        "जाँच जोड़ें",
        "Añadir aserción",
        "Ajouter une assertion",
        "Prüfung hinzufügen",
        "検証を追加",
        "添加断言",
        "إضافة تحقق"
    ],
    "Capture variables": [
        "चर कैप्चर करें",
        "Capturar variables",
        "Capturer des variables",
        "Variablen erfassen",
        "変数を取得",
        "捕获变量",
        "التقاط المتغيرات"
    ],
    "Capture {rule} step {step}": [
        "कैप्चर {rule} चरण {step}",
        "Captura {rule} del paso {step}",
        "Capture {rule} de l’étape {step}",
        "Erfassung {rule} in Schritt {step}",
        "ステップ{step}の変数取得{rule}",
        "步骤 {step} 的捕获 {rule}",
        "الالتقاط {rule} في الخطوة {step}"
    ],
    "Variable name": [
        "चर नाम",
        "Nombre de variable",
        "Nom de variable",
        "Variablenname",
        "変数名",
        "变量名",
        "اسم المتغير"
    ],
    "Remove capture {rule} step {step}": [
        "चरण {step} का कैप्चर {rule} हटाएँ",
        "Eliminar la captura {rule} del paso {step}",
        "Supprimer la capture {rule} de l’étape {step}",
        "Erfassung {rule} aus Schritt {step} entfernen",
        "ステップ{step}の変数取得{rule}を削除",
        "移除步骤 {step} 的捕获 {rule}",
        "إزالة الالتقاط {rule} من الخطوة {step}"
    ],
    "Add capture": [
        "कैप्चर जोड़ें",
        "Añadir captura",
        "Ajouter une capture",
        "Erfassung hinzufügen",
        "変数取得を追加",
        "添加捕获",
        "إضافة التقاط"
    ],
    "Add request step": [
        "अनुरोध चरण जोड़ें",
        "Añadir paso de solicitud",
        "Ajouter une étape de requête",
        "Anfrageschritt hinzufügen",
        "リクエストステップを追加",
        "添加请求步骤",
        "إضافة خطوة طلب"
    ],
    "Save plan": [
        "योजना सहेजें",
        "Guardar plan",
        "Enregistrer le plan",
        "Plan speichern",
        "計画を保存",
        "保存计划",
        "حفظ الخطة"
    ],
    "Run collection": [
        "संग्रह चलाएँ",
        "Ejecutar colección",
        "Exécuter la collection",
        "Sammlung ausführen",
        "コレクションを実行",
        "运行集合",
        "تشغيل المجموعة"
    ],
    "Cancel run": [
        "रन रद्द करें",
        "Cancelar ejecución",
        "Annuler l’exécution",
        "Lauf abbrechen",
        "実行をキャンセル",
        "取消运行",
        "إلغاء التشغيل"
    ],
    "Running": [
        "चल रहा है",
        "En ejecución",
        "En cours",
        "Läuft",
        "実行中",
        "运行中",
        "قيد التشغيل"
    ],
    "Run {state}": [
        "रन: {state}",
        "Ejecución: {state}",
        "Exécution : {state}",
        "Lauf: {state}",
        "実行：{state}",
        "运行：{state}",
        "التشغيل: {state}"
    ],
    "Completed: {count}": [
        "पूर्ण: {count}",
        "Completadas: {count}",
        "Terminées : {count}",
        "Abgeschlossen: {count}",
        "完了：{count}",
        "已完成：{count}",
        "المكتملة: {count}"
    ],
    "Passed: {count}": [
        "सफल: {count}",
        "Correctas: {count}",
        "Réussies : {count}",
        "Bestanden: {count}",
        "成功：{count}",
        "已通过：{count}",
        "الناجحة: {count}"
    ],
    "Collection results": [
        "संग्रह परिणाम",
        "Resultados de la colección",
        "Résultats de la collection",
        "Sammlungsergebnisse",
        "コレクションの結果",
        "集合结果",
        "نتائج المجموعة"
    ],
    "Export results": [
        "परिणाम निर्यात करें",
        "Exportar resultados",
        "Exporter les résultats",
        "Ergebnisse exportieren",
        "結果を書き出す",
        "导出结果",
        "تصدير النتائج"
    ],
    "Results stay in page memory and can include credentials and response data. Export only to a trusted destination.": [
        "परिणाम पेज मेमोरी में रहते हैं और उनमें क्रेडेंशियल तथा प्रतिक्रिया डेटा हो सकता है। केवल विश्वसनीय गंतव्य पर निर्यात करें।",
        "Los resultados permanecen en la memoria de la página y pueden incluir credenciales y datos de respuesta. Exporta solo a un destino de confianza.",
        "Les résultats restent en mémoire de page et peuvent inclure des identifiants et des données de réponse. Exportez uniquement vers une destination de confiance.",
        "Ergebnisse bleiben im Seitenspeicher und können Zugangsdaten und Antwortdaten enthalten. Nur an ein vertrauenswürdiges Ziel exportieren.",
        "結果はページのメモリに保持され、認証情報やレスポンスデータを含む場合があります。信頼できる場所にのみ書き出してください。",
        "结果保留在页面内存中，可能包含凭据和响应数据。请仅导出到可信位置。",
        "تبقى النتائج في ذاكرة الصفحة وقد تتضمن بيانات اعتماد وبيانات استجابة. صدّر إلى وجهة موثوقة فقط."
    ],
    "Passed": [
        "सफल",
        "Correcto",
        "Réussi",
        "Bestanden",
        "成功",
        "通过",
        "ناجح"
    ],
    "Failed": [
        "विफल",
        "Fallido",
        "Échec",
        "Fehlgeschlagen",
        "失敗",
        "失败",
        "فاشل"
    ],
    "Iteration {iteration}": [
        "पुनरावृत्ति {iteration}",
        "Iteración {iteration}",
        "Itération {iteration}",
        "Durchlauf {iteration}",
        "反復{iteration}",
        "迭代 {iteration}",
        "التكرار {iteration}"
    ],
    "Request error:": [
        "अनुरोध त्रुटि:",
        "Error de solicitud:",
        "Erreur de requête :",
        "Anfragefehler:",
        "リクエストエラー：",
        "请求错误：",
        "خطأ الطلب:"
    ],
    "Actual:": [
        "वास्तविक:",
        "Real:",
        "Valeur obtenue :",
        "Tatsächlich:",
        "実際の値：",
        "实际值：",
        "القيمة الفعلية:"
    ],
    "Captured:": [
        "कैप्चर किए गए:",
        "Capturadas:",
        "Variables capturées :",
        "Erfasst:",
        "取得した変数：",
        "已捕获：",
        "القيم الملتقطة:"
    ],
    "[Preview truncated; export for full results]": [
        "[पूर्वावलोकन सीमित है; पूरे परिणाम निर्यात करें]",
        "[Vista previa truncada; exporta para obtener todos los resultados]",
        "[Aperçu tronqué ; exportez les résultats complets]",
        "[Vorschau gekürzt; vollständige Ergebnisse exportieren]",
        "[プレビューを省略しました。全結果は書き出してください]",
        "[预览已截断；请导出完整结果]",
        "[عُرضت معاينة مختصرة؛ صدّر النتائج كاملة]"
    ],
    "bidirectional": [
        "द्विदिश",
        "bidireccional",
        "bidirectionnel",
        "bidirektional",
        "双方向",
        "双向",
        "ثنائي الاتجاه"
    ],
    "client stream": [
        "क्लाइंट स्ट्रीम",
        "flujo de cliente",
        "flux client",
        "Clientstream",
        "クライアントストリーム",
        "客户端流",
        "تدفق العميل"
    ],
    "server stream": [
        "सर्वर स्ट्रीम",
        "flujo de servidor",
        "flux serveur",
        "Serverstream",
        "サーバーストリーム",
        "服务端流",
        "تدفق الخادم"
    ],
    "unary": [
        "एकल",
        "unario",
        "unaire",
        "unär",
        "単項",
        "一元",
        "أحادي"
    ],
    "RPC cancelled.": [
        "RPC रद्द हुआ।",
        "RPC cancelada.",
        "RPC annulé.",
        "RPC abgebrochen.",
        "RPCをキャンセルしました。",
        "RPC 已取消。",
        "أُلغي RPC."
    ],
    "RPC failed.": [
        "RPC विफल हुआ।",
        "La RPC falló.",
        "Échec du RPC.",
        "RPC fehlgeschlagen.",
        "RPCに失敗しました。",
        "RPC 失败。",
        "فشل RPC."
    ],
    "Load at most 32 proto files and 256 KiB in total. Remove the example file first if needed.": [
        "अधिकतम 32 proto फ़ाइलें और कुल 256 KiB लोड करें। ज़रूरत हो तो पहले उदाहरण फ़ाइल हटाएँ।",
        "Carga como máximo 32 archivos proto y 256 KiB en total. Si es necesario, elimina primero el archivo de ejemplo.",
        "Chargez au plus 32 fichiers proto et 256 KiB au total. Supprimez d’abord le fichier d’exemple si nécessaire.",
        "Höchstens 32 Proto-Dateien und insgesamt 256 KiB laden. Bei Bedarf zuerst die Beispieldatei entfernen.",
        "protoファイルは最大32件、合計256 KiBまでです。必要に応じて先にサンプルファイルを削除してください。",
        "最多加载 32 个 proto 文件，总计 256 KiB。必要时请先移除示例文件。",
        "حمّل 32 ملف proto و256 KiB إجمالًا كحد أقصى. أزل ملف المثال أولًا عند الحاجة."
    ],
    "Proto files could not be read.": [
        "Proto फ़ाइलें पढ़ी नहीं जा सकीं।",
        "No se pudieron leer los archivos proto.",
        "Impossible de lire les fichiers proto.",
        "Proto-Dateien konnten nicht gelesen werden.",
        "protoファイルを読み込めませんでした。",
        "无法读取 proto 文件。",
        "تعذرت قراءة ملفات proto."
    ],
    "Call unary, server-streaming, client-streaming and bidirectional gRPC methods through the local connector. Load a .proto schema and all its imports. The example describes a service; it does not start a server.": [
        "स्थानीय कनेक्टर से एकल, सर्वर-स्ट्रीमिंग, क्लाइंट-स्ट्रीमिंग और द्विदिश gRPC मेथड कॉल करें। .proto स्कीमा और उसके सभी इंपोर्ट लोड करें। उदाहरण सेवा का वर्णन करता है; सर्वर शुरू नहीं करता।",
        "Llama a métodos gRPC unarios, de flujo de servidor, de cliente y bidireccionales mediante el conector local. Carga un esquema .proto con todas sus importaciones. El ejemplo describe un servicio; no inicia un servidor.",
        "Appelez les méthodes gRPC unaires, à flux serveur, client et bidirectionnels via le connecteur local. Chargez un schéma .proto et tous ses imports. L’exemple décrit un service ; il ne démarre pas de serveur.",
        "Unäre, Serverstream-, Clientstream- und bidirektionale gRPC-Methoden über den lokalen Connector aufrufen. Ein .proto-Schema samt allen Importen laden. Das Beispiel beschreibt einen Dienst; es startet keinen Server.",
        "ローカルコネクターを通じて単項、サーバーストリーム、クライアントストリーム、双方向のgRPCメソッドを呼び出します。.protoスキーマとすべての依存ファイルを読み込んでください。サンプルはサービスの定義であり、サーバーは起動しません。",
        "通过本地连接器调用一元、服务端流、客户端流和双向 gRPC 方法。加载 .proto 模式及其全部导入文件。示例只描述服务，不会启动服务器。",
        "استدعِ طرق gRPC الأحادية وتدفقات الخادم والعميل وثنائية الاتجاه عبر الموصل المحلي. حمّل مخطط .proto وجميع استيراداته. يصف المثال خدمة؛ ولا يبدأ خادمًا."
    ],
    "Proto schema ({count} files)": [
        "Proto स्कीमा ({count} फ़ाइलें)",
        "Esquema proto ({count} archivos)",
        "Schéma proto ({count} fichiers)",
        "Proto-Schema ({count} Dateien)",
        "protoスキーマ（{count}ファイル）",
        "Proto 模式（{count} 个文件）",
        "مخطط proto ({count} ملفات)"
    ],
    "Relative filename": [
        "सापेक्ष फ़ाइल नाम",
        "Nombre de archivo relativo",
        "Nom de fichier relatif",
        "Relativer Dateiname",
        "相対ファイル名",
        "相对文件名",
        "اسم الملف النسبي"
    ],
    "Proto filename {file}": [
        "Proto फ़ाइल नाम {file}",
        "Nombre del archivo proto {file}",
        "Nom du fichier proto {file}",
        "Proto-Dateiname {file}",
        "protoファイル名{file}",
        "Proto 文件名 {file}",
        "اسم ملف proto {file}"
    ],
    "Remove proto file {file}": [
        "Proto फ़ाइल {file} हटाएँ",
        "Eliminar archivo proto {file}",
        "Supprimer le fichier proto {file}",
        "Proto-Datei {file} entfernen",
        "protoファイル{file}を削除",
        "移除 proto 文件 {file}",
        "إزالة ملف proto {file}"
    ],
    "Proto source": [
        "Proto स्रोत",
        "Código proto",
        "Source proto",
        "Proto-Quelltext",
        "protoソース",
        "Proto 源码",
        "مصدر proto"
    ],
    "Proto source {file}": [
        "Proto स्रोत {file}",
        "Código proto {file}",
        "Source proto {file}",
        "Proto-Quelltext {file}",
        "protoソース{file}",
        "Proto 源码 {file}",
        "مصدر proto {file}"
    ],
    "Upload .proto files": [
        ".proto फ़ाइलें अपलोड करें",
        "Subir archivos .proto",
        "Importer des fichiers .proto",
        ".proto-Dateien hochladen",
        ".protoファイルをアップロード",
        "上传 .proto 文件",
        "رفع ملفات .proto"
    ],
    "Add file": [
        "फ़ाइल जोड़ें",
        "Añadir archivo",
        "Ajouter un fichier",
        "Datei hinzufügen",
        "ファイルを追加",
        "添加文件",
        "إضافة ملف"
    ],
    "Load schema methods": [
        "स्कीमा मेथड लोड करें",
        "Cargar métodos del esquema",
        "Charger les méthodes du schéma",
        "Schemamethoden laden",
        "スキーマのメソッドを読み込む",
        "加载模式方法",
        "تحميل طرق المخطط"
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
    "Deadline (ms)": [
        "समय सीमा (ms)",
        "Plazo (ms)",
        "Délai limite (ms)",
        "Zeitlimit (ms)",
        "期限（ms）",
        "截止时间（ms）",
        "المهلة (ms)"
    ],
    "TLS with certificate verification": [
        "प्रमाणपत्र सत्यापन के साथ TLS",
        "TLS con verificación de certificado",
        "TLS avec vérification du certificat",
        "TLS mit Zertifikatsprüfung",
        "証明書検証付きTLS",
        "TLS 并验证证书",
        "TLS مع فحص الشهادة"
    ],
    "CA, client certificate and TLS server name": [
        "CA, क्लाइंट प्रमाणपत्र और TLS सर्वर नाम",
        "CA, certificado de cliente y nombre del servidor TLS",
        "CA, certificat client et nom du serveur TLS",
        "CA, Clientzertifikat und TLS-Servername",
        "CA、クライアント証明書、TLSサーバー名",
        "CA、客户端证书和 TLS 服务器名称",
        "CA وشهادة العميل واسم خادم TLS"
    ],
    "TLS server name": [
        "TLS सर्वर नाम",
        "Nombre del servidor TLS",
        "Nom du serveur TLS",
        "TLS-Servername",
        "TLSサーバー名",
        "TLS 服务器名称",
        "اسم خادم TLS"
    ],
    "DNS name on the certificate; required when host is an IP": [
        "प्रमाणपत्र का DNS नाम; होस्ट IP होने पर आवश्यक",
        "Nombre DNS del certificado; obligatorio si el host es una IP",
        "Nom DNS du certificat ; requis si l’hôte est une IP",
        "DNS-Name im Zertifikat; erforderlich, wenn der Host eine IP ist",
        "証明書のDNS名。ホストがIPの場合は必須",
        "证书上的 DNS 名称；主机为 IP 时必填",
        "اسم DNS في الشهادة؛ مطلوب عندما يكون المضيف عنوان IP"
    ],
    "Service method": [
        "सेवा मेथड",
        "Método del servicio",
        "Méthode du service",
        "Dienstmethode",
        "サービスメソッド",
        "服务方法",
        "طريقة الخدمة"
    ],
    "gRPC service method": [
        "gRPC सेवा मेथड",
        "Método del servicio gRPC",
        "Méthode du service gRPC",
        "gRPC-Dienstmethode",
        "gRPCサービスメソッド",
        "gRPC 服务方法",
        "طريقة خدمة gRPC"
    ],
    "Load a schema to choose a method": [
        "मेथड चुनने के लिए स्कीमा लोड करें",
        "Carga un esquema para elegir un método",
        "Chargez un schéma pour choisir une méthode",
        "Zum Auswählen einer Methode ein Schema laden",
        "スキーマを読み込んでメソッドを選択",
        "加载模式以选择方法",
        "حمّل مخططًا لاختيار طريقة"
    ],
    "Send a JSON array of up to 100 messages. This client sends the array in order, then half-closes the stream.": [
        "अधिकतम 100 संदेशों की JSON सूची भेजें। क्लाइंट सूची क्रम से भेजकर स्ट्रीम का भेजने वाला सिरा बंद करता है।",
        "Envía un array JSON de hasta 100 mensajes. El cliente envía el array en orden y después cierra el lado de envío del flujo.",
        "Envoyez un tableau JSON de 100 messages maximum. Le client l’envoie dans l’ordre, puis ferme le côté émission du flux.",
        "Ein JSON-Array mit bis zu 100 Nachrichten senden. Der Client sendet das Array der Reihe nach und schließt dann die Senderichtung des Streams.",
        "最大100メッセージのJSON配列を送信します。クライアントは配列を順に送信してからストリームの送信側を閉じます。",
        "发送最多 100 条消息的 JSON 数组。客户端按顺序发送数组，然后关闭流的发送方向。",
        "أرسل مصفوفة JSON تضم 100 رسالة كحد أقصى. يرسل العميل المصفوفة بالترتيب ثم يغلق جانب الإرسال من التدفق."
    ],
    "Send one JSON object.": [
        "एक JSON ऑब्जेक्ट भेजें।",
        "Envía un objeto JSON.",
        "Envoyez un objet JSON.",
        "Ein JSON-Objekt senden.",
        "JSONオブジェクトを1件送信します。",
        "发送一个 JSON 对象。",
        "أرسل كائن JSON واحدًا."
    ],
    "Responses are collected until stream completion or deadline.": [
        "स्ट्रीम पूर्ण होने या समय सीमा तक प्रतिक्रियाएँ एकत्र होती हैं।",
        "Las respuestas se recopilan hasta que termine el flujo o venza el plazo.",
        "Les réponses sont recueillies jusqu’à la fin du flux ou au délai limite.",
        "Antworten werden bis zum Streamende oder Zeitlimit gesammelt.",
        "ストリームの完了または期限までレスポンスを収集します。",
        "收集响应直到流完成或达到截止时间。",
        "تُجمع الاستجابات حتى اكتمال التدفق أو انقضاء المهلة."
    ],
    "Returns one response message.": [
        "एक प्रतिक्रिया संदेश लौटता है।",
        "Devuelve un mensaje de respuesta.",
        "Renvoie un message de réponse.",
        "Gibt eine Antwortnachricht zurück.",
        "レスポンスメッセージを1件返します。",
        "返回一条响应消息。",
        "يعيد رسالة استجابة واحدة."
    ],
    "Use input template": [
        "इनपुट टेम्पलेट उपयोग करें",
        "Usar plantilla de entrada",
        "Utiliser le modèle d’entrée",
        "Eingabevorlage verwenden",
        "入力テンプレートを使用",
        "使用输入模板",
        "استخدام قالب الإدخال"
    ],
    "Request messages (JSON array)": [
        "अनुरोध संदेश (JSON सूची)",
        "Mensajes de solicitud (array JSON)",
        "Messages de requête (tableau JSON)",
        "Anfragenachrichten (JSON-Array)",
        "リクエストメッセージ（JSON配列）",
        "请求消息（JSON 数组）",
        "رسائل الطلب (مصفوفة JSON)"
    ],
    "Request message (JSON object)": [
        "अनुरोध संदेश (JSON ऑब्जेक्ट)",
        "Mensaje de solicitud (objeto JSON)",
        "Message de requête (objet JSON)",
        "Anfragenachricht (JSON-Objekt)",
        "リクエストメッセージ（JSONオブジェクト）",
        "请求消息（JSON 对象）",
        "رسالة الطلب (كائن JSON)"
    ],
    "Metadata (JSON object)": [
        "मेटाडेटा (JSON ऑब्जेक्ट)",
        "Metadatos (objeto JSON)",
        "Métadonnées (objet JSON)",
        "Metadaten (JSON-Objekt)",
        "メタデータ（JSONオブジェクト）",
        "元数据（JSON 对象）",
        "البيانات الوصفية (كائن JSON)"
    ],
    "Metadata accepts strings or string arrays; -bin values use padded base64. 64-bit values use decimal strings, bytes use base64. Files and credentials stay in page memory. Imports are limited to supplied files and bundled protobuf types; reflection and remote imports are unavailable. Responses are bounded to 100 messages / 2 MiB.": [
        "मेटाडेटा में स्ट्रिंग या स्ट्रिंग सूची दें; -bin मान पैडेड base64 में हों। 64-bit मान दशमलव स्ट्रिंग और बाइट base64 में हों। फ़ाइलें और क्रेडेंशियल पेज मेमोरी में रहते हैं। इंपोर्ट केवल दी गई फ़ाइलों और बंडल किए protobuf प्रकारों तक सीमित हैं; reflection और दूरस्थ इंपोर्ट उपलब्ध नहीं हैं। प्रतिक्रियाएँ 100 संदेश / 2 MiB तक सीमित हैं।",
        "Los metadatos aceptan cadenas o arrays de cadenas; los valores -bin usan base64 con relleno. Los valores de 64 bits usan cadenas decimales y los bytes, base64. Los archivos y credenciales permanecen en memoria de la página. Solo se importan archivos suministrados y tipos protobuf incluidos; no hay reflexión ni importaciones remotas. Respuestas limitadas a 100 mensajes / 2 MiB.",
        "Les métadonnées acceptent chaînes ou tableaux de chaînes ; les valeurs -bin utilisent base64 avec remplissage. Les valeurs 64 bits sont des chaînes décimales, les octets en base64. Fichiers et identifiants restent en mémoire de page. Imports limités aux fichiers fournis et types protobuf inclus ; ni réflexion ni imports distants. Réponses limitées à 100 messages / 2 MiB.",
        "Metadaten akzeptieren Strings oder String-Arrays; -bin-Werte nutzen aufgefülltes base64. 64-Bit-Werte nutzen Dezimalstrings, Bytes base64. Dateien und Zugangsdaten bleiben im Seitenspeicher. Importe sind auf bereitgestellte Dateien und enthaltene protobuf-Typen beschränkt; Reflection und Remoteimporte sind nicht verfügbar. Antworten sind auf 100 Nachrichten / 2 MiB begrenzt.",
        "メタデータには文字列または文字列配列を使用します。-bin値はパディング付きbase64、64-bit値は10進文字列、バイトはbase64です。ファイルと認証情報はページのメモリに保持します。インポートは提供されたファイルと同梱protobuf型に限定され、リフレクションやリモートインポートは使用できません。レスポンスは100メッセージ / 2 MiBまでです。",
        "元数据接受字符串或字符串数组；-bin 值使用带填充的 base64。64 位值使用十进制字符串，字节使用 base64。文件和凭据保留在页面内存中。导入仅限提供的文件和内置 protobuf 类型；不支持反射和远程导入。响应限制为 100 条消息 / 2 MiB。",
        "تقبل البيانات الوصفية سلاسل أو مصفوفات سلاسل؛ وتستخدم قيم -bin ترميز base64 مع الحشو. تُستخدم سلاسل عشرية لقيم 64 بت وbase64 للبايتات. تبقى الملفات وبيانات الاعتماد في ذاكرة الصفحة. تقتصر الاستيرادات على الملفات المقدمة وأنواع protobuf المضمّنة؛ ولا تتوفر الانعكاسات أو الاستيرادات البعيدة. الاستجابات محدودة بـ100 رسالة / 2 MiB."
    ],
    "Send RPC": [
        "RPC भेजें",
        "Enviar RPC",
        "Envoyer le RPC",
        "RPC senden",
        "RPCを送信",
        "发送 RPC",
        "إرسال RPC"
    ],
    "Cancel RPC": [
        "RPC रद्द करें",
        "Cancelar RPC",
        "Annuler le RPC",
        "RPC abbrechen",
        "RPCをキャンセル",
        "取消 RPC",
        "إلغاء RPC"
    ],
    "Methods loaded: {count}. No service connection has been made.": [
        "लोड हुए मेथड: {count}। सेवा से कोई कनेक्शन नहीं बना है।",
        "Métodos cargados: {count}. No se ha establecido ninguna conexión con el servicio.",
        "Méthodes chargées : {count}. Aucune connexion au service n’a été établie.",
        "Geladene Methoden: {count}. Es wurde keine Verbindung zum Dienst hergestellt.",
        "読み込んだメソッド：{count}。サービスへの接続は行っていません。",
        "已加载方法：{count}。尚未连接服务。",
        "الطرق المحمّلة: {count}. لم يُنشأ اتصال بالخدمة."
    ],
    "gRPC result": [
        "gRPC परिणाम",
        "Resultado gRPC",
        "Résultat gRPC",
        "gRPC-Ergebnis",
        "gRPCの結果",
        "gRPC 结果",
        "نتيجة gRPC"
    ],
    "Export RPC result": [
        "RPC परिणाम निर्यात करें",
        "Exportar resultado RPC",
        "Exporter le résultat RPC",
        "RPC-Ergebnis exportieren",
        "RPCの結果を書き出す",
        "导出 RPC 结果",
        "تصدير نتيجة RPC"
    ],
    "Messages: {count}": [
        "संदेश: {count}",
        "Mensajes: {count}",
        "Messages : {count}",
        "Nachrichten: {count}",
        "メッセージ数：{count}",
        "消息数：{count}",
        "الرسائل: {count}"
    ],
    "[Preview truncated; export for full result]": [
        "[पूर्वावलोकन सीमित है; पूरा परिणाम निर्यात करें]",
        "[Vista previa truncada; exporta para obtener el resultado completo]",
        "[Aperçu tronqué ; exportez le résultat complet]",
        "[Vorschau gekürzt; vollständiges Ergebnis exportieren]",
        "[プレビューを省略しました。全結果は書き出してください]",
        "[预览已截断；请导出完整结果]",
        "[عُرضت معاينة مختصرة؛ صدّر النتيجة كاملة]"
    ],
    "Mock started. Copy its base URL and append a route path.": [
        "मॉक शुरू हुआ। उसका बेस URL कॉपी करके रूट पथ जोड़ें।",
        "Mock iniciado. Copia su URL base y añade la ruta.",
        "Mock démarré. Copiez son URL de base et ajoutez un chemin de route.",
        "Mock gestartet. Basis-URL kopieren und einen Routenpfad anhängen.",
        "モックを起動しました。ベースURLをコピーし、ルートのパスを追加してください。",
        "模拟已启动。复制其基础 URL 并追加路由路径。",
        "بدأت المحاكاة. انسخ عنوانها الأساسي وأضف مسارًا."
    ],
    "Mock stopped and its history cleared.": [
        "मॉक बंद हुआ और उसका इतिहास साफ़ हुआ।",
        "Mock detenido e historial borrado.",
        "Mock arrêté et historique effacé.",
        "Mock gestoppt und Verlauf gelöscht.",
        "モックを停止し、履歴を消去しました。",
        "模拟已停止，历史已清除。",
        "توقفت المحاكاة ومُسح سجلها."
    ],
    "Mock history cleared.": [
        "मॉक इतिहास साफ़ हुआ।",
        "Historial del mock borrado.",
        "Historique du mock effacé.",
        "Mock-Verlauf gelöscht.",
        "モックの履歴を消去しました。",
        "模拟历史已清除。",
        "مُسح سجل المحاكاة."
    ],
    "Mock operation failed.": [
        "मॉक कार्रवाई विफल हुई।",
        "La operación del mock falló.",
        "Échec de l’opération du mock.",
        "Mock-Vorgang fehlgeschlagen.",
        "モックの操作に失敗しました。",
        "模拟操作失败。",
        "فشلت عملية المحاكاة."
    ],
    "Mock base URL copied.": [
        "मॉक का बेस URL कॉपी हुआ।",
        "URL base del mock copiada.",
        "URL de base du mock copiée.",
        "Mock-Basis-URL kopiert.",
        "モックのベースURLをコピーしました。",
        "模拟基础 URL 已复制。",
        "نُسخ العنوان الأساسي للمحاكاة."
    ],
    "Clipboard access was unavailable. Select and copy the URL below.": [
        "क्लिपबोर्ड पहुँच उपलब्ध नहीं थी। नीचे URL चुनकर कॉपी करें।",
        "No se pudo acceder al portapapeles. Selecciona y copia la URL de abajo.",
        "Accès au presse-papiers indisponible. Sélectionnez et copiez l’URL ci-dessous.",
        "Kein Zugriff auf die Zwischenablage. Die URL unten auswählen und kopieren.",
        "クリップボードにアクセスできませんでした。下のURLを選択してコピーしてください。",
        "无法访问剪贴板。请选择并复制下方 URL。",
        "تعذر الوصول إلى الحافظة. حدّد العنوان أدناه وانسخه."
    ],
    "Start a temporary HTTP mock on this device. Choose exact paths, methods, response headers, text bodies, status codes and delays. Requests never forward to an upstream API.": [
        "इस डिवाइस पर अस्थायी HTTP मॉक शुरू करें। सटीक पथ, मेथड, प्रतिक्रिया हेडर, टेक्स्ट बॉडी, स्थिति कोड और विलंब चुनें। अनुरोध कभी अपस्ट्रीम API पर अग्रेषित नहीं होते।",
        "Inicia un mock HTTP temporal en este dispositivo. Elige rutas exactas, métodos, cabeceras de respuesta, cuerpos de texto, códigos de estado y demoras. Las solicitudes nunca se reenvían a una API externa.",
        "Démarrez un mock HTTP temporaire sur cet appareil. Choisissez chemins exacts, méthodes, en-têtes, corps texte, statuts et délais. Les requêtes ne sont jamais transférées à une API en amont.",
        "Einen temporären HTTP-Mock auf diesem Gerät starten. Exakte Pfade, Methoden, Antwortheader, Textinhalte, Statuscodes und Verzögerungen festlegen. Anfragen werden nie an eine vorgelagerte API weitergeleitet.",
        "この端末で一時HTTPモックを起動します。正確なパス、メソッド、レスポンスヘッダー、テキスト本文、ステータスコード、遅延を指定します。リクエストが上流APIに転送されることはありません。",
        "在此设备启动临时 HTTP 模拟。指定精确路径、方法、响应头、文本正文、状态码和延迟。请求绝不会转发到上游 API。",
        "ابدأ محاكاة HTTP مؤقتة على هذا الجهاز. اختر المسارات الدقيقة والطرق وترويسات الاستجابة والأجسام النصية ورموز الحالة والتأخير. لا تُحوّل الطلبات أبدًا إلى API خارجي."
    ],
    "Mock configuration (JSON)": [
        "मॉक कॉन्फ़िगरेशन (JSON)",
        "Configuración del mock (JSON)",
        "Configuration du mock (JSON)",
        "Mock-Konfiguration (JSON)",
        "モック設定（JSON）",
        "模拟配置（JSON）",
        "إعدادات المحاكاة (JSON)"
    ],
    "Routes support GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS or *. Paths start with /; queries are ignored when matching. Add exact browser origins in origins when testing another local app. The current app origin is allowed automatically.": [
        "रूट GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS या * का समर्थन करते हैं। पथ / से शुरू होते हैं; मिलान में क्वेरी अनदेखी होती है। दूसरे स्थानीय ऐप का परीक्षण करते समय origins में सटीक ब्राउज़र ओरिजिन जोड़ें। वर्तमान ऐप का ओरिजिन अपने आप अनुमत है।",
        "Las rutas admiten GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS o *. Los caminos empiezan por /; las consultas se ignoran al comparar. Añade los orígenes exactos del navegador en origins al probar otra app local. El origen de esta app se permite automáticamente.",
        "Les routes acceptent GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS ou *. Les chemins commencent par / ; les paramètres de requête sont ignorés. Ajoutez les origines exactes du navigateur dans origins pour tester une autre app locale. L’origine de cette app est autorisée automatiquement.",
        "Routen unterstützen GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS oder *. Pfade beginnen mit /; Abfrageparameter werden beim Abgleich ignoriert. Zum Testen anderer lokaler Apps exakte Browserursprünge in origins eintragen. Der Ursprung dieser App ist automatisch erlaubt.",
        "ルートはGET、HEAD、POST、PUT、PATCH、DELETE、OPTIONS、*に対応します。パスは/で始まり、照合時にクエリは無視します。別のローカルアプリを試す場合はoriginsに正確なブラウザーオリジンを追加してください。現在のアプリのオリジンは自動で許可されます。",
        "路由支持 GET、HEAD、POST、PUT、PATCH、DELETE、OPTIONS 或 *。路径以 / 开头；匹配时忽略查询参数。测试其他本地应用时，在 origins 中加入准确的浏览器来源。当前应用来源自动允许。",
        "تدعم المسارات GET وHEAD وPOST وPUT وPATCH وDELETE وOPTIONS أو *. تبدأ المسارات بـ/؛ وتُتجاهل الاستعلامات عند المطابقة. أضف أصول المتصفح الدقيقة في origins عند اختبار تطبيق محلي آخر. يُسمح بأصل التطبيق الحالي تلقائيًا."
    ],
    "Start local mock": [
        "स्थानीय मॉक शुरू करें",
        "Iniciar mock local",
        "Démarrer un mock local",
        "Lokalen Mock starten",
        "ローカルモックを起動",
        "启动本地模拟",
        "بدء محاكاة محلية"
    ],
    "Refresh running mocks": [
        "चलते मॉक ताज़ा करें",
        "Actualizar mocks activos",
        "Actualiser les mocks actifs",
        "Laufende Mocks aktualisieren",
        "稼働中のモックを更新",
        "刷新运行中的模拟",
        "تحديث المحاكاة الجارية"
    ],
    "Load example configuration": [
        "उदाहरण कॉन्फ़िगरेशन लोड करें",
        "Cargar configuración de ejemplo",
        "Charger l’exemple de configuration",
        "Beispielkonfiguration laden",
        "設定例を読み込む",
        "加载示例配置",
        "تحميل إعدادات المثال"
    ],
    "Bound to 127.0.0.1 only, with a random capability URL. Treat the URL as access to this mock. Up to 2 servers run for 10 minutes or 1,000 requests; up to 20 routes and 50 recent requests are retained. Switching projects hides other projects’ mocks; it does not stop them. Closing this page does not stop a mock. Use Stop or wait for expiry. Configuration and history are memory only.": [
        "केवल 127.0.0.1 से बंधा है, एक रैंडम क्षमता URL के साथ। URL को इस मॉक की पहुँच मानें। अधिकतम 2 सर्वर 10 मिनट या 1,000 अनुरोधों तक चलते हैं; अधिकतम 20 रूट और 50 हालिया अनुरोध रखे जाते हैं। प्रोजेक्ट बदलने पर दूसरे प्रोजेक्ट के मॉक छिपते हैं, बंद नहीं होते। पेज बंद करने से भी मॉक बंद नहीं होता। रोकें बटन उपयोग करें या समाप्ति की प्रतीक्षा करें। कॉन्फ़िगरेशन और इतिहास केवल मेमोरी में हैं।",
        "Escucha solo en 127.0.0.1 con una URL de acceso aleatoria. Trata esa URL como acceso al mock. Hasta 2 servidores funcionan durante 10 minutos o 1,000 solicitudes; se retienen hasta 20 rutas y 50 solicitudes recientes. Cambiar de proyecto oculta los mocks de otros proyectos; no los detiene. Cerrar esta página tampoco los detiene. Usa Detener o espera al vencimiento. Configuración e historial solo en memoria.",
        "Écoute uniquement sur 127.0.0.1 avec une URL d’accès aléatoire. Cette URL donne accès au mock. Jusqu’à 2 serveurs pendant 10 minutes ou 1,000 requêtes ; au plus 20 routes et 50 requêtes récentes conservées. Changer de projet masque les mocks des autres projets sans les arrêter. Fermer cette page ne les arrête pas. Utilisez Arrêter ou attendez l’expiration. Configuration et historique en mémoire uniquement.",
        "Nur an 127.0.0.1 gebunden, mit zufälliger Zugriffs-URL. Diese URL gewährt Zugriff auf den Mock. Bis zu 2 Server laufen für 10 Minuten oder 1,000 Anfragen; bis zu 20 Routen und 50 letzte Anfragen bleiben erhalten. Ein Projektwechsel blendet fremde Mocks aus, stoppt sie aber nicht. Auch das Schließen dieser Seite stoppt keinen Mock. Stoppen verwenden oder den Ablauf abwarten. Konfiguration und Verlauf nur im Arbeitsspeicher.",
        "127.0.0.1のみにバインドし、ランダムなアクセス用URLを使用します。URLはこのモックへのアクセス権として扱ってください。最大2サーバーが10分間または1,000リクエストまで稼働し、最大20ルートと直近50リクエストを保持します。プロジェクトを切り替えると他のモックは非表示になりますが、停止しません。ページを閉じても停止しません。停止操作を行うか有効期限までお待ちください。設定と履歴はメモリのみです。",
        "仅绑定 127.0.0.1，使用随机的访问授权 URL。请将 URL 视为此模拟的访问凭证。最多运行 2 个服务器，持续 10 分钟或 1,000 次请求；最多保留 20 条路由和最近 50 次请求。切换项目会隐藏其他项目的模拟，但不会停止它们。关闭页面也不会停止模拟。请使用停止按钮或等待到期。配置和历史仅保存在内存中。",
        "يرتبط بـ127.0.0.1 فقط مع عنوان وصول عشوائي. تعامل مع العنوان كإذن وصول للمحاكاة. يعمل خادمان كحد أقصى لمدة 10 دقائق أو 1,000 طلب؛ ويُحتفظ بـ20 مسارًا و50 طلبًا حديثًا كحد أقصى. يخفي تبديل المشاريع محاكاة المشاريع الأخرى ولا يوقفها. إغلاق الصفحة لا يوقف المحاكاة. استخدم إيقاف أو انتظر الانتهاء. الإعدادات والسجل في الذاكرة فقط."
    ],
    "No mocks are running for this project. Start one above.": [
        "इस प्रोजेक्ट में कोई मॉक नहीं चल रहा। ऊपर एक शुरू करें।",
        "No hay mocks activos para este proyecto. Inicia uno arriba.",
        "Aucun mock actif pour ce projet. Démarrez-en un ci-dessus.",
        "Für dieses Projekt laufen keine Mocks. Oben einen starten.",
        "このプロジェクトで稼働中のモックはありません。上で起動してください。",
        "此项目没有运行中的模拟。请在上方启动一个。",
        "لا توجد محاكاة جارية لهذا المشروع. ابدأ واحدة أعلاه."
    ],
    "Stop mock": [
        "मॉक रोकें",
        "Detener mock",
        "Arrêter le mock",
        "Mock stoppen",
        "モックを停止",
        "停止模拟",
        "إيقاف المحاكاة"
    ],
    "Expires {time}": [
        "समाप्ति {time}",
        "Vence a las {time}",
        "Expire à {time}",
        "Läuft um {time} ab",
        "有効期限：{time}",
        "到期时间：{time}",
        "ينتهي في {time}"
    ],
    "Requests received: {count}": [
        "प्राप्त अनुरोध: {count}",
        "Solicitudes recibidas: {count}",
        "Requêtes reçues : {count}",
        "Empfangene Anfragen: {count}",
        "受信リクエスト：{count}",
        "已接收请求：{count}",
        "الطلبات المستلمة: {count}"
    ],
    "Delay: {duration} ms": [
        "विलंब: {duration} ms",
        "Demora: {duration} ms",
        "Délai : {duration} ms",
        "Verzögerung: {duration} ms",
        "遅延：{duration} ms",
        "延迟：{duration} ms",
        "التأخير: {duration} ms"
    ],
    "Copy base URL": [
        "बेस URL कॉपी करें",
        "Copiar URL base",
        "Copier l’URL de base",
        "Basis-URL kopieren",
        "ベースURLをコピー",
        "复制基础 URL",
        "نسخ العنوان الأساسي"
    ],
    "View requests": [
        "अनुरोध देखें",
        "Ver solicitudes",
        "Voir les requêtes",
        "Anfragen ansehen",
        "リクエストを表示",
        "查看请求",
        "عرض الطلبات"
    ],
    "Clear request history": [
        "अनुरोध इतिहास साफ़ करें",
        "Borrar historial de solicitudes",
        "Effacer l’historique des requêtes",
        "Anfrageverlauf löschen",
        "リクエスト履歴を消去",
        "清除请求历史",
        "مسح سجل الطلبات"
    ],
    "Mock request history": [
        "मॉक अनुरोध इतिहास",
        "Historial de solicitudes del mock",
        "Historique des requêtes du mock",
        "Mock-Anfrageverlauf",
        "モックのリクエスト履歴",
        "模拟请求历史",
        "سجل طلبات المحاكاة"
    ],
    "Recent mock requests ({count})": [
        "हालिया मॉक अनुरोध ({count})",
        "Solicitudes recientes del mock ({count})",
        "Requêtes récentes du mock ({count})",
        "Letzte Mock-Anfragen ({count})",
        "最近のモックリクエスト（{count}）",
        "最近的模拟请求（{count}）",
        "طلبات المحاكاة الحديثة ({count})"
    ],
    "Export mock history": [
        "मॉक इतिहास निर्यात करें",
        "Exportar historial del mock",
        "Exporter l’historique du mock",
        "Mock-Verlauf exportieren",
        "モック履歴を書き出す",
        "导出模拟历史",
        "تصدير سجل المحاكاة"
    ],
    "History contains the headers and body sent to this mock, including any credentials. Bodies are limited to a 32 KiB preview. Export only to a trusted destination.": [
        "इतिहास में इस मॉक को भेजे हेडर और बॉडी हैं, जिनमें क्रेडेंशियल भी हो सकते हैं। बॉडी का पूर्वावलोकन 32 KiB तक है। केवल विश्वसनीय गंतव्य पर निर्यात करें।",
        "El historial contiene las cabeceras y el cuerpo enviados al mock, incluidas las credenciales. Los cuerpos se limitan a una vista previa de 32 KiB. Exporta solo a un destino de confianza.",
        "L’historique contient les en-têtes et le corps envoyés au mock, identifiants compris. Les corps sont limités à un aperçu de 32 KiB. Exportez uniquement vers une destination de confiance.",
        "Der Verlauf enthält gesendete Header und Inhalte, einschließlich Zugangsdaten. Inhalte sind auf eine Vorschau von 32 KiB begrenzt. Nur an ein vertrauenswürdiges Ziel exportieren.",
        "履歴には認証情報を含め、このモックに送信されたヘッダーと本文が含まれます。本文は32 KiBのプレビューまでです。信頼できる場所にのみ書き出してください。",
        "历史包含发送到此模拟的响应头和正文，包括任何凭据。正文预览限制为 32 KiB。请仅导出到可信位置。",
        "يتضمن السجل الترويسات والجسم المرسلين إلى هذه المحاكاة، بما فيها بيانات الاعتماد. تُعرض الأجسام بمعاينة لا تتجاوز 32 KiB. صدّر إلى وجهة موثوقة فقط."
    ],
    "No completed requests yet. Send a request, then refresh this history.": [
        "अभी कोई पूर्ण अनुरोध नहीं है। अनुरोध भेजें और फिर इतिहास ताज़ा करें।",
        "Aún no hay solicitudes completadas. Envía una y actualiza este historial.",
        "Aucune requête terminée. Envoyez une requête, puis actualisez cet historique.",
        "Noch keine abgeschlossenen Anfragen. Eine Anfrage senden und diesen Verlauf aktualisieren.",
        "完了したリクエストはまだありません。リクエストを送信し、履歴を更新してください。",
        "尚无已完成请求。发送请求后刷新此历史。",
        "لا توجد طلبات مكتملة بعد. أرسل طلبًا ثم حدّث هذا السجل."
    ],
    "CA bundle (PEM)": [
        "CA बंडल (PEM)",
        "Paquete de CA (PEM)",
        "Ensemble de CA (PEM)",
        "CA-Bündel (PEM)",
        "CAバンドル（PEM）",
        "CA 包（PEM）",
        "حزمة CA ‏(PEM)"
    ],
    "Client certificate (PEM)": [
        "क्लाइंट प्रमाणपत्र (PEM)",
        "Certificado de cliente (PEM)",
        "Certificat client (PEM)",
        "Clientzertifikat (PEM)",
        "クライアント証明書（PEM）",
        "客户端证书（PEM）",
        "شهادة العميل (PEM)"
    ],
    "The collection could not run.": [
        "संग्रह चल नहीं सका।",
        "No se pudo ejecutar la colección.",
        "Impossible d’exécuter la collection.",
        "Die Sammlung konnte nicht ausgeführt werden.",
        "コレクションを実行できませんでした。",
        "无法运行集合。",
        "تعذر تشغيل المجموعة."
    ],
    "Saved plan could not be loaded.": [
        "सहेजी योजना लोड नहीं हो सकी।",
        "No se pudo cargar el plan guardado.",
        "Impossible de charger le plan enregistré.",
        "Gespeicherter Plan konnte nicht geladen werden.",
        "保存した計画を読み込めませんでした。",
        "无法加载已保存的计划。",
        "تعذر تحميل الخطة المحفوظة."
    ],
    "Finished": [
        "पूर्ण",
        "Finalizada",
        "Terminée",
        "Abgeschlossen",
        "完了",
        "已完成",
        "مكتمل"
    ],
    "Stopped on failure": [
        "विफलता पर रुका",
        "Detenida por fallo",
        "Arrêtée sur échec",
        "Bei Fehler angehalten",
        "失敗時に停止",
        "因失败停止",
        "توقف عند الفشل"
    ],
    "Cancelled": [
        "रद्द",
        "Cancelada",
        "Annulée",
        "Abgebrochen",
        "キャンセル済み",
        "已取消",
        "ملغى"
    ],
    "Limit reached": [
        "सीमा पूरी हुई",
        "Límite alcanzado",
        "Limite atteinte",
        "Grenze erreicht",
        "上限に到達",
        "已达限制",
        "بُلغ الحد"
    ],
    "Invalid saved iteration count.": [
        "सहेजी पुनरावृत्ति संख्या अमान्य है।",
        "Número de iteraciones guardado no válido.",
        "Nombre d’itérations enregistré invalide.",
        "Ungültige gespeicherte Durchlaufzahl.",
        "保存された反復回数が無効です。",
        "保存的迭代次数无效。",
        "عدد التكرارات المحفوظ غير صالح."
    ],
    "The proxy truncated this response.": [
        "प्रॉक्सी ने यह प्रतिक्रिया सीमित की।",
        "El proxy truncó esta respuesta.",
        "Le proxy a tronqué cette réponse.",
        "Der Proxy hat diese Antwort gekürzt.",
        "プロキシがこのレスポンスを切り詰めました。",
        "代理截断了此响应。",
        "اقتطع الوكيل هذه الاستجابة."
    ],
    "gRPC client": [
        "gRPC क्लाइंट",
        "Cliente gRPC",
        "Client gRPC",
        "gRPC-Client",
        "gRPCクライアント",
        "gRPC 客户端",
        "عميل gRPC"
    ],
    "Local mock server": [
        "स्थानीय मॉक सर्वर",
        "Servidor mock local",
        "Serveur mock local",
        "Lokaler Mockserver",
        "ローカルモックサーバー",
        "本地模拟服务器",
        "خادم محاكاة محلي"
    ]
};
