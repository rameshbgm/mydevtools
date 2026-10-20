import type { TranslationColumns } from "./tool-names";

// Authored help and data disclosures only. Protocol fields and private user data stay exact.
export const TOOL_GUIDANCE_TRANSLATIONS: Record<string, TranslationColumns> = {
    "This action sends data to the server": [
        "यह कार्रवाई सर्वर को डेटा भेजती है",
        "Esta acción envía datos al servidor",
        "Cette action envoie des données au serveur",
        "Diese Aktion sendet Daten an den Server",
        "この操作はサーバーにデータを送信します",
        "此操作会向服务器发送数据",
        "يرسل هذا الإجراء بيانات إلى الخادم"
    ],
    "Read IANA’s official RDAP directory, find the responsible registry and request its public registration record.": [
        "IANA की आधिकारिक RDAP निर्देशिका पढ़ें, संबंधित रजिस्ट्री खोजें और उसका सार्वजनिक पंजीकरण रिकॉर्ड माँगें।",
        "Lee el directorio RDAP oficial de IANA, encuentra el registro responsable y solicita su ficha pública.",
        "Consulter l’annuaire RDAP officiel de l’IANA, identifier le registre responsable et demander sa fiche publique.",
        "Liest das offizielle RDAP-Verzeichnis der IANA, ermittelt die zuständige Registry und fragt ihren öffentlichen Registrierungseintrag ab.",
        "IANAの公式RDAPディレクトリを読み、担当レジストリを特定して公開登録情報を取得します。",
        "读取 IANA 官方 RDAP 目录，找到负责的注册局并请求其公开注册记录。",
        "قراءة دليل RDAP الرسمي لـ IANA وتحديد السجل المسؤول وطلب بيانات التسجيل العامة منه."
    ],
    "The domain, IP address or IP prefix you enter": [
        "आपका दर्ज डोमेन, IP पता या IP प्रीफ़िक्स",
        "El dominio, dirección IP o prefijo IP que introduces",
        "Le domaine, l’adresse IP ou le préfixe IP saisi",
        "Die eingegebene Domain, IP-Adresse oder das IP-Präfix",
        "入力したドメイン、IPアドレス、IPプレフィックス",
        "输入的域名、IP 地址或 IP 前缀",
        "النطاق أو عنوان IP أو بادئة IP التي تدخلها"
    ],
    "The generated IANA-directory and registry URLs, plus ordinary HTTP metadata": [
        "बने हुए IANA निर्देशिका और रजिस्ट्री URL, साथ में सामान्य HTTP मेटाडेटा",
        "Las URL generadas del directorio IANA y del registro, y los metadatos HTTP habituales",
        "Les URL générées de l’annuaire IANA et du registre, ainsi que les métadonnées HTTP ordinaires",
        "Die erzeugten URLs für IANA-Verzeichnis und Registry sowie übliche HTTP-Metadaten",
        "生成されたIANAディレクトリとレジストリのURL、および通常のHTTPメタデータ",
        "生成的 IANA 目录及注册局 URL，以及常规 HTTP 元数据",
        "روابط دليل IANA والسجل المُنشأة، إضافة إلى بيانات HTTP الوصفية المعتادة"
    ],
    "IANA directory matching identifies the registry. Public-target and redirect checks remain enforced. Lookup data is not logged by this route; providers may log requests.": [
        "IANA निर्देशिका मिलान से रजिस्ट्री पहचानी जाती है। सार्वजनिक लक्ष्य और रीडायरेक्ट जाँच लागू रहती हैं। यह रूट खोज डेटा लॉग नहीं करता; प्रदाता अनुरोध लॉग कर सकते हैं।",
        "La coincidencia en el directorio IANA identifica el registro. Se mantienen las comprobaciones de destinos públicos y redirecciones. Esta ruta no registra los datos consultados; los proveedores pueden registrar solicitudes.",
        "La correspondance dans l’annuaire IANA identifie le registre. Les contrôles de cibles publiques et de redirections restent appliqués. Cette route ne journalise pas les recherches ; les fournisseurs peuvent journaliser les requêtes.",
        "Der Abgleich mit dem IANA-Verzeichnis ermittelt die Registry. Prüfungen öffentlicher Ziele und Weiterleitungen bleiben aktiv. Diese Route protokolliert keine Abfragedaten; Anbieter können Anfragen protokollieren.",
        "IANAディレクトリの照合でレジストリを特定します。公開宛先とリダイレクトの検査は引き続き適用されます。このルートは検索データを記録しませんが、提供元がリクエストを記録する場合があります。",
        "通过 IANA 目录匹配确定注册局。仍会执行公开目标和重定向检查。此路由不记录查询数据；提供方可能记录请求。",
        "تحدد مطابقة دليل IANA السجل. تبقى فحوص الوجهات العامة وإعادة التوجيه مفروضة. لا يسجل هذا المسار بيانات البحث؛ وقد يسجل المزوّدون الطلبات."
    ],
    "Choose and order the operations, enter input, then run the workflow to inspect each step.": [
        "क्रियाएँ चुनकर क्रम दें, इनपुट दर्ज करें और हर चरण जाँचने के लिए वर्कफ़्लो चलाएँ।",
        "Elige y ordena operaciones, introduce datos y ejecuta el flujo para revisar cada paso.",
        "Choisissez et ordonnez les opérations, saisissez l’entrée et exécutez le flux pour examiner chaque étape.",
        "Operationen auswählen und ordnen, Eingabe erfassen und Workflow ausführen, um jeden Schritt zu prüfen.",
        "操作と順序を選び、入力してワークフローを実行し、各ステップを確認します。",
        "选择并排列操作，输入数据，然后运行工作流以检查各步骤。",
        "اختر العمليات ورتبها وأدخل البيانات ثم شغل سير العمل لفحص كل خطوة."
    ],
    "Name and save the workflow for this project. Include an input fixture only when you intend to retain it.": [
        "इस प्रोजेक्ट के लिए वर्कफ़्लो को नाम देकर सहेजें। इनपुट उदाहरण तभी जोड़ें जब उसे रखना हो।",
        "Nombra y guarda el flujo en este proyecto. Incluye una entrada de prueba solo si quieres conservarla.",
        "Nommez et enregistrez le flux dans ce projet. N’incluez un exemple d’entrée que pour le conserver.",
        "Workflow für dieses Projekt benennen und speichern. Eingabebeispiel nur einschließen, wenn es aufbewahrt werden soll.",
        "このプロジェクト用に名前を付けて保存します。入力サンプルは保持したい場合のみ含めてください。",
        "为此项目命名并保存工作流。仅在需要保留时包含输入示例。",
        "سم سير العمل واحفظه لهذا المشروع. أدرج عينة الإدخال فقط إذا أردت الاحتفاظ بها."
    ],
    "Fixture redaction is a best effort. Review exported data and comparison fixtures before sharing.": [
        "उदाहरण से संवेदनशील जानकारी हटाना पूर्ण नहीं हो सकता। साझा करने से पहले निर्यात और तुलना उदाहरण जाँचें।",
        "La ocultación de datos puede ser incompleta. Revisa las exportaciones y muestras de comparación antes de compartir.",
        "L’occultation des exemples peut être incomplète. Vérifiez données exportées et exemples de comparaison avant partage.",
        "Die Bereinigung von Beispielen ist nicht garantiert vollständig. Exporte und Vergleichsbeispiele vor dem Teilen prüfen.",
        "サンプルの機密情報除去は完全ではありません。共有前にエクスポートと比較サンプルを確認してください。",
        "示例脱敏可能不完整。分享前请检查导出数据和比较示例。",
        "قد لا تكون تنقية العينات كاملة. راجع البيانات المصدرة وعينات المقارنة قبل مشاركتها."
    ],
    "Find a tool and open it in a tab. Switch tabs to keep independent inputs available.": [
        "टूल ढूँढकर टैब में खोलें। अलग इनपुट उपलब्ध रखने के लिए टैब बदलें।",
        "Busca una herramienta y ábrela en una pestaña. Cambia de pestaña para mantener entradas independientes.",
        "Trouvez un outil et ouvrez-le dans un onglet. Changez d’onglet pour conserver des entrées indépendantes.",
        "Werkzeug suchen und in einem Tab öffnen. Zwischen Tabs wechseln, um getrennte Eingaben bereitzuhalten.",
        "ツールを探してタブで開きます。タブを切り替えると別々の入力を保持できます。",
        "查找工具并在标签页中打开。切换标签页以保留独立输入。",
        "ابحث عن أداة وافتحها في تبويب. بدل التبويبات للاحتفاظ بمدخلات مستقلة."
    ],
    "Reorder tabs with the arrow controls or drag them. The saved tab list reopens after reload; unsaved inputs do not.": [
        "तीर बटन या खींचकर टैब का क्रम बदलें। रीलोड पर सहेजी टैब सूची खुलती है; असहेजे इनपुट नहीं।",
        "Reordena con flechas o arrastrando. Al recargar se reabre la lista guardada, pero no las entradas sin guardar.",
        "Réorganisez avec les flèches ou par glisser-déposer. Après rechargement, la liste enregistrée revient, pas les entrées non sauvegardées.",
        "Tabs per Pfeilen oder Ziehen ordnen. Beim Neuladen öffnet sich die gespeicherte Tabliste, ungespeicherte Eingaben nicht.",
        "矢印やドラッグで並べ替えます。再読み込みで保存済みタブ一覧は戻りますが、未保存の入力は戻りません。",
        "使用箭头或拖动调整顺序。重新加载会恢复已保存的标签列表，不会恢复未保存的输入。",
        "رتب التبويبات بالأسهم أو السحب. تعود القائمة المحفوظة بعد إعادة التحميل دون المدخلات غير المحفوظة."
    ],
    "Enter a domain, IP address or IP prefix and choose Look up registration.": [
        "डोमेन, IP पता या IP उपसर्ग दर्ज कर पंजीकरण खोजें चुनें।",
        "Introduce un dominio, IP o prefijo IP y elige Buscar registro.",
        "Saisissez un domaine, une adresse ou un préfixe IP, puis recherchez l’enregistrement.",
        "Domain, IP-Adresse oder IP-Präfix eingeben und Registrierung nachschlagen wählen.",
        "ドメイン、IPアドレス、IPプレフィックスを入力して登録情報を検索します。",
        "输入域名、IP 地址或 IP 前缀，然后选择查询注册信息。",
        "أدخل نطاقًا أو عنوان IP أو بادئته واختر البحث عن التسجيل."
    ],
    "Review the registry, events and nameservers, then inspect or export the raw RDAP response.": [
        "रजिस्ट्री, घटनाएँ और नेमसर्वर जाँचें, फिर मूल RDAP प्रतिक्रिया देखें या निर्यात करें।",
        "Revisa el registro, eventos y servidores de nombres; inspecciona o exporta la respuesta RDAP original.",
        "Examinez registre, événements et serveurs de noms, puis inspectez ou exportez la réponse RDAP brute.",
        "Registrierungsstelle, Ereignisse und Nameserver prüfen, dann rohe RDAP-Antwort ansehen oder exportieren.",
        "レジストリ、イベント、ネームサーバーを確認し、RDAPの生の応答を表示またはエクスポートします。",
        "检查注册机构、事件和域名服务器，然后查看或导出原始 RDAP 响应。",
        "راجع السجل والأحداث وخوادم الأسماء ثم افحص استجابة RDAP الخام أو صدرها."
    ],
    "Registry privacy rules may hide contact details. Registration records do not prove website ownership or availability.": [
        "रजिस्ट्री के गोपनीयता नियम संपर्क छिपा सकते हैं। पंजीकरण से वेबसाइट का स्वामित्व या उपलब्धता सिद्ध नहीं होती।",
        "Las reglas de privacidad pueden ocultar contactos. El registro no prueba propiedad ni disponibilidad del sitio.",
        "Les règles de confidentialité peuvent masquer les contacts. L’enregistrement ne prouve ni propriété ni disponibilité du site.",
        "Datenschutzregeln können Kontakte ausblenden. Registrierungsdaten beweisen weder Website-Eigentum noch Erreichbarkeit.",
        "プライバシー規則で連絡先が非公開の場合があります。登録情報はサイトの所有権や稼働状況を証明しません。",
        "注册机构的隐私规则可能隐藏联系信息。注册记录不能证明网站所有权或可用性。",
        "قد تخفي قواعد الخصوصية بيانات الاتصال. لا تثبت سجلات التسجيل ملكية الموقع أو توفره."
    ],
    "Create or unlock the vault with your passphrase, then add and manage records in this project.": [
        "पासफ़्रेज़ से वॉल्ट बनाएँ या खोलें, फिर इस प्रोजेक्ट के रिकॉर्ड जोड़ें और सँभालें।",
        "Crea o desbloquea la bóveda con tu contraseña y gestiona los registros de este proyecto.",
        "Créez ou déverrouillez le coffre avec votre phrase secrète, puis gérez les enregistrements du projet.",
        "Tresor mit der Passphrase erstellen oder entsperren und Datensätze dieses Projekts verwalten.",
        "パスフレーズで保管庫を作成・解除し、このプロジェクトのレコードを追加・管理します。",
        "使用口令创建或解锁保险库，然后添加和管理此项目的记录。",
        "أنشئ الخزنة أو افتحها بعبارة المرور ثم أضف سجلات المشروع وأدرها."
    ],
    "Export an encrypted backup before clearing browser storage. Keep the passphrase separately; it cannot be recovered.": [
        "ब्राउज़र स्टोरेज साफ़ करने से पहले एन्क्रिप्टेड बैकअप निर्यात करें। पासफ़्रेज़ अलग रखें; वह वापस नहीं मिल सकता।",
        "Exporta una copia cifrada antes de borrar el almacenamiento. Guarda la contraseña aparte; no se puede recuperar.",
        "Exportez une sauvegarde chiffrée avant d’effacer le stockage. Gardez la phrase secrète séparément ; elle est irrécupérable.",
        "Vor dem Löschen des Browserspeichers ein verschlüsseltes Backup exportieren. Passphrase getrennt aufbewahren; Wiederherstellung ist unmöglich.",
        "ブラウザー保存領域を消去する前に暗号化バックアップを出力してください。パスフレーズは別途保管し、復元できないことに注意してください。",
        "清除浏览器存储前请导出加密备份。请单独保管口令，口令无法恢复。",
        "صدر نسخة مشفرة قبل مسح تخزين المتصفح. احتفظ بعبارة المرور منفصلة؛ لا يمكن استعادتها."
    ],
    "Create or unlock the vault, then add files to encrypt their contents and metadata on this device.": [
        "वॉल्ट बनाएँ या खोलें, फिर इस डिवाइस पर सामग्री और मेटाडेटा एन्क्रिप्ट करने के लिए फ़ाइलें जोड़ें।",
        "Crea o desbloquea la bóveda y añade archivos para cifrar contenido y metadatos en este dispositivo.",
        "Créez ou déverrouillez le coffre, puis ajoutez des fichiers pour chiffrer contenu et métadonnées sur cet appareil.",
        "Tresor erstellen oder entsperren und Dateien hinzufügen, um Inhalt und Metadaten auf diesem Gerät zu verschlüsseln.",
        "保管庫を作成・解除してファイルを追加すると、この端末で内容とメタデータを暗号化します。",
        "创建或解锁保险库，然后添加文件，在此设备上加密内容和元数据。",
        "أنشئ الخزنة أو افتحها ثم أضف ملفات لتشفير محتوياتها وبياناتها الوصفية على هذا الجهاز."
    ],
    "Choose SQLite for local file queries, or configure an authenticated localhost runtime for a remote database.": [
        "स्थानीय फ़ाइल क्वेरी के लिए SQLite चुनें, या दूरस्थ डेटाबेस के लिए प्रमाणित localhost रनटाइम सेट करें।",
        "Elige SQLite para archivos locales o configura un entorno localhost autenticado para una base remota.",
        "Choisissez SQLite pour les fichiers locaux ou configurez un environnement localhost authentifié pour une base distante.",
        "SQLite für lokale Dateiabfragen wählen oder eine authentifizierte localhost-Laufzeit für entfernte Datenbanken einrichten.",
        "ローカルファイルにはSQLiteを選び、リモートDBには認証付きlocalhostランタイムを設定します。",
        "本地文件查询请选择 SQLite，远程数据库请配置已认证的 localhost 运行时。",
        "اختر SQLite لاستعلام الملفات محليًا أو جهز بيئة localhost موثقة لقاعدة بعيدة."
    ],
    "Browse tables, inspect columns, enter SQL and parameters, then run the query. Enable writes only when required.": [
        "तालिकाएँ और स्तंभ जाँचें, SQL और पैरामीटर दर्ज करके क्वेरी चलाएँ। आवश्यकता पर ही लिखना सक्षम करें।",
        "Explora tablas y columnas, introduce SQL y parámetros y ejecuta la consulta. Habilita escrituras solo si hace falta.",
        "Parcourez tables et colonnes, saisissez SQL et paramètres, puis exécutez. N’activez l’écriture que si nécessaire.",
        "Tabellen und Spalten prüfen, SQL und Parameter eingeben und Abfrage ausführen. Schreibzugriff nur bei Bedarf erlauben.",
        "表と列を確認し、SQLとパラメーターを入力して実行します。書き込みは必要な場合のみ許可してください。",
        "浏览表和列，输入 SQL 和参数，然后运行查询。仅在需要时启用写入。",
        "تصفح الجداول والأعمدة وأدخل SQL والمعاملات ثم نفذ الاستعلام. فعل الكتابة عند الحاجة فقط."
    ],
    "SQLite changes affect the temporary copy. Download the updated database to keep them.": [
        "SQLite बदलाव अस्थायी प्रति में होते हैं। उन्हें रखने के लिए अपडेट किया डेटाबेस डाउनलोड करें।",
        "Los cambios SQLite afectan a la copia temporal. Descarga la base actualizada para conservarlos.",
        "Les modifications SQLite touchent la copie temporaire. Téléchargez la base mise à jour pour les conserver.",
        "SQLite-Änderungen betreffen die temporäre Kopie. Aktualisierte Datenbank herunterladen, um sie zu behalten.",
        "SQLiteの変更は一時コピーに反映されます。保持するには更新済みDBをダウンロードしてください。",
        "SQLite 更改仅影响临时副本。请下载更新后的数据库以保留更改。",
        "تؤثر تغييرات SQLite في النسخة المؤقتة. نزل قاعدة البيانات المحدثة للاحتفاظ بها."
    ],
    "Configure the connection and localhost runtime access, then scan keys using a narrow pattern.": [
        "कनेक्शन और localhost रनटाइम पहुँच सेट करें, फिर सीमित पैटर्न से कुंजियाँ स्कैन करें।",
        "Configura la conexión y acceso a localhost; busca claves con un patrón específico.",
        "Configurez la connexion et l’accès localhost, puis recherchez les clés avec un motif précis.",
        "Verbindung und localhost-Zugriff einrichten, dann Schlüssel mit einem engen Muster durchsuchen.",
        "接続とlocalhostアクセスを設定し、絞り込んだパターンでキーを検索します。",
        "配置连接和 localhost 运行时访问，然后使用精确模式扫描键。",
        "جهز الاتصال والوصول إلى localhost ثم افحص المفاتيح بنمط محدد."
    ],
    "Inspect a key or enter a JSON array of command arguments. Enable mutations only when you intend to change data.": [
        "कुंजी जाँचें या कमांड तर्कों का JSON ऐरे दर्ज करें। डेटा बदलना हो तभी बदलाव सक्षम करें।",
        "Inspecciona una clave o introduce argumentos en una matriz JSON. Habilita cambios solo si quieres modificar datos.",
        "Inspectez une clé ou saisissez les arguments dans un tableau JSON. N’autorisez les mutations que pour modifier les données.",
        "Schlüssel prüfen oder Befehlsargumente als JSON-Array eingeben. Mutationen nur für beabsichtigte Änderungen erlauben.",
        "キーを確認するかコマンド引数のJSON配列を入力します。データを変更する場合のみ変更操作を許可してください。",
        "检查键或输入命令参数的 JSON 数组。仅在确实需要修改数据时启用变更。",
        "افحص مفتاحًا أو أدخل معاملات الأمر كمصفوفة JSON. فعل التعديل فقط عند قصد تغيير البيانات."
    ],
    "SCAN can return empty or duplicate batches as keys change. Continue with the cursor or refine the pattern.": [
        "कुंजियाँ बदलने पर SCAN खाली या दोहराए बैच दे सकता है। कर्सर से जारी रखें या पैटर्न सुधारें।",
        "SCAN puede devolver lotes vacíos o duplicados si cambian las claves. Sigue con el cursor o ajusta el patrón.",
        "SCAN peut renvoyer des lots vides ou en double si les clés changent. Continuez avec le curseur ou affinez le motif.",
        "SCAN kann bei Schlüsseländerungen leere oder doppelte Stapel liefern. Mit dem Cursor fortfahren oder Muster eingrenzen.",
        "キーの変化によりSCANが空や重複のバッチを返す場合があります。カーソルで続行するかパターンを絞り込んでください。",
        "键发生变化时，SCAN 可能返回空批次或重复批次。请使用游标继续或调整模式。",
        "قد يعيد SCAN دفعات فارغة أو مكررة عند تغير المفاتيح. تابع بالمؤشر أو ضيق النمط."
    ],
    "Paste representative JSON and infer a schema, then review the inferred types and required fields.": [
        "प्रतिनिधि JSON चिपकाकर स्कीमा निकालें, फिर अनुमानित प्रकार और आवश्यक फ़ील्ड जाँचें।",
        "Pega JSON representativo e infiere un esquema; revisa tipos y campos obligatorios.",
        "Collez un JSON représentatif, déduisez un schéma et vérifiez les types et champs obligatoires.",
        "Repräsentatives JSON einfügen, Schema ableiten und Typen sowie Pflichtfelder prüfen.",
        "代表的なJSONからスキーマを推論し、型と必須フィールドを確認します。",
        "粘贴有代表性的 JSON 并推断结构，然后检查类型和必填字段。",
        "الصق JSON ممثلًا واستنتج المخطط ثم راجع الأنواع والحقول المطلوبة."
    ],
    "Choose a target language and generate models. Review generated code before using it in your application.": [
        "लक्ष्य भाषा चुनकर मॉडल बनाएँ। उपयोग से पहले बने कोड की समीक्षा करें।",
        "Elige un lenguaje y genera modelos. Revisa el código antes de usarlo en tu aplicación.",
        "Choisissez un langage et générez les modèles. Vérifiez le code avant de l’utiliser.",
        "Zielsprache wählen und Modelle erzeugen. Code vor der Nutzung in der Anwendung prüfen.",
        "対象言語を選びモデルを生成します。アプリで使う前にコードを確認してください。",
        "选择目标语言并生成模型。在应用中使用前请检查生成的代码。",
        "اختر لغة الهدف وأنشئ النماذج. راجع الكود قبل استخدامه في التطبيق."
    ],
    "Samples describe observed values; they cannot establish every valid shape your production data may contain.": [
        "नमूने देखे गए मान बताते हैं; वे उत्पादन डेटा के हर मान्य रूप को निर्धारित नहीं कर सकते।",
        "Las muestras describen valores observados; no cubren todas las estructuras válidas de producción.",
        "Les exemples décrivent les valeurs observées, pas toutes les structures valides des données de production.",
        "Beispiele zeigen beobachtete Werte, nicht jede gültige Struktur möglicher Produktionsdaten.",
        "サンプルは観測値を示すもので、本番データのすべての有効な構造を網羅しません。",
        "示例仅描述已观察到的值，无法确定生产数据可能具有的所有有效结构。",
        "تصف العينات القيم المرصودة ولا تحدد كل البنى الصحيحة الممكنة لبيانات الإنتاج."
    ],
    "Create up to ten workspaces including Personal. Each workspace keeps its own saved tool data.": [
        "Personal सहित अधिकतम दस कार्यस्थान बनाएँ। हर कार्यस्थान अपना सहेजा टूल डेटा रखता है।",
        "Crea hasta diez espacios, incluido Personal. Cada uno conserva sus propios datos guardados.",
        "Créez jusqu’à dix espaces, Personnel compris. Chacun conserve ses propres données d’outils.",
        "Bis zu zehn Arbeitsbereiche einschließlich Persönlich erstellen. Jeder hält eigene gespeicherte Werkzeugdaten.",
        "個人用を含め最大10個のワークスペースを作成できます。各ワークスペースは独自の保存データを持ちます。",
        "最多创建十个工作区（包括个人工作区）。每个工作区保留独立的工具数据。",
        "أنشئ حتى عشر مساحات عمل بما فيها الشخصية. تحتفظ كل مساحة ببيانات أدواتها المحفوظة."
    ],
    "Switch using the workspace tabs. Double-click a custom name to rename it; closing its tab requires confirmation before permanent deletion.": [
        "कार्यस्थान टैब से बदलें। नाम बदलने के लिए कस्टम नाम पर डबल-क्लिक करें; टैब बंद करने पर स्थायी विलोपन की पुष्टि चाहिए।",
        "Cambia con las pestañas. Haz doble clic en un nombre personalizado para editarlo; cerrar exige confirmar el borrado permanente.",
        "Changez d’espace avec les onglets. Double-cliquez sur un nom personnalisé pour le renommer ; fermer exige de confirmer la suppression définitive.",
        "Per Arbeitsbereich-Tabs wechseln. Eigene Namen per Doppelklick umbenennen; Schließen erfordert Bestätigung der endgültigen Löschung.",
        "タブで切り替えます。カスタム名をダブルクリックして変更できます。タブを閉じる際は完全削除の確認が必要です。",
        "使用工作区标签切换。双击自定义名称可重命名；关闭标签需确认永久删除。",
        "بدل عبر تبويبات المساحات. انقر الاسم المخصص مرتين لتغييره؛ يتطلب إغلاق التبويب تأكيد الحذف النهائي."
    ],
    "Save unfinished work before switching. Workspace changes reload tools and lock vaults.": [
        "बदलने से पहले अधूरा काम सहेजें। कार्यस्थान बदलने से टूल रीलोड होते हैं और वॉल्ट लॉक होते हैं।",
        "Guarda el trabajo pendiente antes de cambiar. El cambio recarga herramientas y bloquea bóvedas.",
        "Enregistrez votre travail avant de changer. Le changement recharge les outils et verrouille les coffres.",
        "Unfertige Arbeit vor dem Wechsel speichern. Arbeitsbereichwechsel laden Werkzeuge neu und sperren Tresore.",
        "切り替え前に作業を保存してください。ワークスペースを変えるとツールが再読み込みされ保管庫がロックされます。",
        "切换前请保存未完成的工作。切换工作区会重新加载工具并锁定保险库。",
        "احفظ العمل غير المكتمل قبل التبديل. يعيد تغيير المساحة تحميل الأدوات ويقفل الخزائن."
    ],
    "Paste traceparent and optional tracestate headers to inspect their fields and validation results.": [
        "फ़ील्ड और सत्यापन देखने के लिए traceparent और वैकल्पिक tracestate हेडर चिपकाएँ।",
        "Pega traceparent y tracestate opcional para revisar campos y validaciones.",
        "Collez traceparent et éventuellement tracestate pour examiner champs et validations.",
        "traceparent und optional tracestate einfügen, um Felder und Prüfergebnisse zu sehen.",
        "traceparentと任意のtracestateヘッダーを貼り付け、フィールドと検証結果を確認します。",
        "粘贴 traceparent 及可选 tracestate 标头，检查字段和验证结果。",
        "الصق traceparent وtracestate الاختياري لفحص الحقول ونتائج التحقق."
    ],
    "Generate a new traceparent when you need public example identifiers for a debugging request.": [
        "डिबग अनुरोध के लिए सार्वजनिक उदाहरण पहचानकर्ता चाहिए तो नया traceparent बनाएँ।",
        "Genera un traceparent nuevo si necesitas identificadores de ejemplo públicos para depurar.",
        "Générez un traceparent pour obtenir des identifiants d’exemple publics de débogage.",
        "Neues traceparent für öffentliche Beispielkennungen einer Debug-Anfrage erzeugen.",
        "デバッグ依頼用の公開サンプル識別子が必要なら、新しいtraceparentを生成します。",
        "调试请求需要公开示例标识符时，可生成新的 traceparent。",
        "أنشئ traceparent جديدًا عند الحاجة إلى معرفات مثال عامة لطلب تصحيح."
    ],
    "Choose the webhook provider and enter the exact raw request body, signature header and signing secret.": [
        "webhook प्रदाता चुनें और अनुरोध का ठीक मूल बॉडी, हस्ताक्षर हेडर और हस्ताक्षर सीक्रेट दर्ज करें।",
        "Elige el proveedor webhook e introduce cuerpo original exacto, cabecera de firma y secreto de firma.",
        "Choisissez le fournisseur webhook et saisissez corps brut exact, en-tête de signature et secret de signature.",
        "Webhook-Anbieter wählen und exakten Rohtext des Bodys, Signatur-Header und Signaturschlüssel eingeben.",
        "Webhookプロバイダーを選び、正確な生の本文、署名ヘッダー、署名シークレットを入力します。",
        "选择 webhook 提供商，并输入精确的原始请求正文、签名标头和签名密钥。",
        "اختر مزود webhook وأدخل نص الطلب الخام الدقيق وترويسة التوقيع وسره."
    ],
    "Verify the signature and review the result. Whitespace or reformatting changes the signed bytes.": [
        "हस्ताक्षर सत्यापित कर परिणाम जाँचें। रिक्त स्थान या प्रारूप बदलने से हस्ताक्षरित बाइट बदलते हैं।",
        "Verifica la firma y revisa el resultado. Espacios o cambios de formato alteran los bytes firmados.",
        "Vérifiez la signature et le résultat. Les espaces et changements de format modifient les octets signés.",
        "Signatur verifizieren und Ergebnis prüfen. Leerraum oder Umformatierung ändern die signierten Bytes.",
        "署名と結果を確認します。空白や整形の変更は署名対象のバイトを変えます。",
        "验证签名并检查结果。空白或重新格式化会改变签名字节。",
        "تحقق من التوقيع وراجع النتيجة. تغير المسافات أو إعادة التنسيق البايتات الموقعة."
    ],
    "Signature verification does not by itself establish event freshness or prevent replay.": [
        "केवल हस्ताक्षर सत्यापन घटना की नवीनता सिद्ध नहीं करता और पुनःप्रेषण नहीं रोकता।",
        "Verificar la firma no confirma por sí solo la actualidad del evento ni evita repeticiones.",
        "La vérification seule ne garantit pas la fraîcheur de l’événement et n’empêche pas le rejeu.",
        "Signaturprüfung allein bestätigt weder Aktualität des Ereignisses noch verhindert sie Replay-Angriffe.",
        "署名検証だけではイベントの新しさを保証せず、リプレイも防ぎません。",
        "仅验证签名无法证明事件的新鲜度，也不能阻止重放。",
        "لا يثبت التحقق من التوقيع وحده حداثة الحدث ولا يمنع إعادة الإرسال."
    ],
    "Paste HAR, JSON or log text, then configure any additional sensitive field names.": [
        "HAR, JSON या लॉग चिपकाएँ, फिर अतिरिक्त संवेदनशील फ़ील्ड नाम तय करें।",
        "Pega HAR, JSON o registros y configura otros nombres de campos sensibles.",
        "Collez HAR, JSON ou journaux, puis ajoutez les noms de champs sensibles nécessaires.",
        "HAR, JSON oder Logtext einfügen und weitere sensible Feldnamen konfigurieren.",
        "HAR、JSON、ログを貼り付け、追加の機密フィールド名を設定します。",
        "粘贴 HAR、JSON 或日志文本，然后配置其他敏感字段名称。",
        "الصق HAR أو JSON أو السجل ثم حدد أسماء الحقول الحساسة الإضافية."
    ],
    "Run redaction and inspect the full result before copying or sharing it.": [
        "संवेदनशील डेटा हटाएँ और कॉपी या साझा करने से पहले पूरा परिणाम जाँचें।",
        "Ejecuta la ocultación y revisa el resultado completo antes de copiar o compartir.",
        "Lancez l’occultation et vérifiez tout le résultat avant de copier ou partager.",
        "Bereinigung ausführen und das vollständige Ergebnis vor Kopieren oder Teilen prüfen.",
        "機密情報の除去を実行し、コピー・共有前に結果全体を確認してください。",
        "执行脱敏，并在复制或分享前检查完整结果。",
        "نفذ التنقية وافحص النتيجة كاملة قبل نسخها أو مشاركتها."
    ],
    "Redaction is a best effort. Secrets in unusual fields or free text may require manual removal.": [
        "संवेदनशील डेटा हटाना पूर्ण नहीं हो सकता। असामान्य फ़ील्ड या मुक्त पाठ के सीक्रेट स्वयं हटाने पड़ सकते हैं।",
        "La ocultación puede ser incompleta. Los secretos en campos inusuales o texto libre pueden requerir borrado manual.",
        "L’occultation peut être incomplète. Les secrets dans des champs inhabituels ou du texte libre peuvent nécessiter un retrait manuel.",
        "Bereinigung ist nicht garantiert vollständig. Geheimnisse in ungewöhnlichen Feldern oder Freitext gegebenenfalls manuell entfernen.",
        "機密情報除去は完全ではありません。特殊なフィールドや自由文の秘密は手動除去が必要な場合があります。",
        "脱敏可能不完整。异常字段或自由文本中的秘密可能需要手动删除。",
        "قد لا تكون التنقية كاملة. قد تتطلب الأسرار في حقول غير معتادة أو نص حر إزالة يدوية."
    ],
    "Paste a User-Agent string and optional Client Hints, or load your browser's reported values.": [
        "User-Agent और वैकल्पिक Client Hints चिपकाएँ या ब्राउज़र के बताए मान लोड करें।",
        "Pega User-Agent y Client Hints opcionales o carga los valores declarados por tu navegador.",
        "Collez User-Agent et éventuellement Client Hints ou chargez les valeurs signalées par le navigateur.",
        "User-Agent und optionale Client Hints einfügen oder gemeldete Browserwerte laden.",
        "User-Agentと任意のClient Hintsを貼り付けるか、ブラウザーの報告値を読み込みます。",
        "粘贴 User-Agent 及可选 Client Hints，或加载浏览器报告的值。",
        "الصق User-Agent وClient Hints الاختيارية أو حمل القيم التي يبلغ عنها المتصفح."
    ],
    "Inspect the parsed browser, operating system, device and engine fields alongside the original values.": [
        "मूल मानों के साथ पहचाने गए ब्राउज़र, ऑपरेटिंग सिस्टम, डिवाइस और इंजन फ़ील्ड जाँचें।",
        "Examina navegador, sistema, dispositivo y motor analizados junto a los valores originales.",
        "Examinez navigateur, système, appareil et moteur analysés avec les valeurs d’origine.",
        "Erkannte Browser-, Betriebssystem-, Geräte- und Engine-Felder mit den Originalwerten prüfen.",
        "解析したブラウザー、OS、端末、エンジンの各フィールドを元の値と比較します。",
        "将解析出的浏览器、操作系统、设备和引擎字段与原始值一同检查。",
        "افحص حقول المتصفح والنظام والجهاز والمحرك المحللة بجانب القيم الأصلية."
    ],
    "Reported identifiers can be reduced, missing or spoofed. They are not proof of a device's identity.": [
        "बताए गए पहचानकर्ता सीमित, गायब या नकली हो सकते हैं। वे डिवाइस की पहचान का प्रमाण नहीं हैं।",
        "Los identificadores pueden estar reducidos, faltar o ser falsos. No prueban la identidad del dispositivo.",
        "Les identifiants peuvent être réduits, absents ou falsifiés. Ils ne prouvent pas l’identité d’un appareil.",
        "Gemeldete Kennungen können verkürzt, fehlend oder gefälscht sein und beweisen keine Geräteidentität.",
        "報告された識別子は簡略化・欠落・偽装される場合があり、端末の同一性を証明しません。",
        "报告的标识符可能被精简、缺失或伪造，不能作为设备身份的证明。",
        "قد تكون المعرفات مختصرة أو مفقودة أو مزورة ولا تثبت هوية الجهاز."
    ],
    "Select templates for your stack, editor and operating system, then add custom ignore patterns.": [
        "अपने स्टैक, संपादक और ऑपरेटिंग सिस्टम के टेम्पलेट चुनें, फिर कस्टम ignore पैटर्न जोड़ें।",
        "Elige plantillas de tu entorno, editor y sistema y añade patrones de exclusión propios.",
        "Choisissez les modèles de votre pile, éditeur et système, puis ajoutez vos motifs d’exclusion.",
        "Vorlagen für Stack, Editor und Betriebssystem wählen und eigene Ignoriermuster ergänzen.",
        "技術スタック、エディター、OSのテンプレートを選び、独自の除外パターンを追加します。",
        "选择技术栈、编辑器和操作系统模板，然后添加自定义忽略模式。",
        "اختر قوالب التقنيات والمحرر والنظام ثم أضف أنماط تجاهل مخصصة."
    ],
    "Review the combined result and copy or download it as .gitignore.": [
        "संयुक्त परिणाम जाँचें और .gitignore के रूप में कॉपी या डाउनलोड करें।",
        "Revisa el resultado combinado y cópialo o descárgalo como .gitignore.",
        "Vérifiez le résultat combiné, puis copiez-le ou téléchargez-le en .gitignore.",
        "Kombiniertes Ergebnis prüfen und als .gitignore kopieren oder herunterladen.",
        "統合結果を確認し、.gitignoreとしてコピーまたはダウンロードします。",
        "检查合并结果，然后复制或下载为 .gitignore。",
        "راجع النتيجة المجمعة وانسخها أو نزلها باسم .gitignore."
    ],
    "Ignore rules do not remove files already tracked by Git, and they do not protect secrets already committed.": [
        "ignore नियम Git में पहले से ट्रैक फ़ाइलें नहीं हटाते और पहले से कमिट सीक्रेट सुरक्षित नहीं करते।",
        "Las reglas no eliminan archivos ya seguidos por Git ni protegen secretos ya confirmados.",
        "Les règles ne retirent pas les fichiers déjà suivis par Git et ne protègent pas les secrets déjà commités.",
        "Ignorierregeln entfernen keine von Git erfassten Dateien und schützen keine bereits eingecheckten Geheimnisse.",
        "除外規則はGit追跡済みのファイルを削除せず、コミット済みの秘密も保護しません。",
        "忽略规则不会删除 Git 已跟踪的文件，也无法保护已提交的秘密。",
        "لا تزيل قواعد التجاهل ملفات يتتبعها Git بالفعل ولا تحمي أسرارًا سبق إيداعها."
    ],
    "Add a resource name and URL, then organize links with folders and tags.": [
        "संसाधन का नाम और URL जोड़ें, फिर फ़ोल्डर और टैग से लिंक व्यवस्थित करें।",
        "Añade nombre y URL y organiza los enlaces con carpetas y etiquetas.",
        "Ajoutez un nom et une URL, puis organisez les liens avec dossiers et étiquettes.",
        "Ressourcennamen und URL hinzufügen, dann Links mit Ordnern und Tags organisieren.",
        "リソース名とURLを追加し、フォルダーとタグでリンクを整理します。",
        "添加资源名称和 URL，然后使用文件夹和标签整理链接。",
        "أضف اسم المورد وURL ثم نظم الروابط بالمجلدات والوسوم."
    ],
    "Search the saved links or export a backup. Bookmarks belong to the current project.": [
        "सहेजे लिंक खोजें या बैकअप निर्यात करें। बुकमार्क वर्तमान प्रोजेक्ट के हैं।",
        "Busca enlaces guardados o exporta una copia. Los marcadores pertenecen al proyecto actual.",
        "Recherchez les liens ou exportez une sauvegarde. Les favoris appartiennent au projet courant.",
        "Gespeicherte Links suchen oder Backup exportieren. Lesezeichen gehören zum aktuellen Projekt.",
        "保存リンクを検索したりバックアップを出力できます。ブックマークは現在のプロジェクトに属します。",
        "搜索已保存的链接或导出备份。书签属于当前项目。",
        "ابحث في الروابط المحفوظة أو صدر نسخة احتياطية. تتبع الإشارات المشروع الحالي."
    ],
    "Enter a Base32 secret, then select the algorithm, digits and time step.": [
        "Base32 सीक्रेट दर्ज करें, फिर एल्गोरिदम, अंक और समय चरण चुनें।",
        "Introduce un secreto Base32 y elige algoritmo, dígitos y paso temporal.",
        "Saisissez un secret Base32, puis choisissez algorithme, chiffres et pas de temps.",
        "Base32-Geheimnis eingeben, dann Algorithmus, Stellenzahl und Zeitschritt wählen.",
        "Base32シークレットを入力し、アルゴリズム、桁数、時間間隔を選びます。",
        "输入 Base32 密钥，然后选择算法、位数和时间步长。",
        "أدخل سر Base32 ثم اختر الخوارزمية وعدد الأرقام والخطوة الزمنية."
    ],
    "Generate the code and check the remaining validity time. Use public test secrets when experimenting.": [
        "कोड बनाकर बचा वैध समय जाँचें। प्रयोग के लिए सार्वजनिक परीक्षण सीक्रेट उपयोग करें।",
        "Genera el código y comprueba su vigencia restante. Usa secretos públicos de prueba al experimentar.",
        "Générez le code et vérifiez sa durée restante. Utilisez des secrets de test publics pour expérimenter.",
        "Code erzeugen und Restgültigkeit prüfen. Zum Ausprobieren öffentliche Testgeheimnisse verwenden.",
        "コードを生成して残り有効時間を確認します。試す際は公開テスト用シークレットを使ってください。",
        "生成代码并检查剩余有效时间。实验时请使用公开测试密钥。",
        "أنشئ الرمز وتحقق من مدة صلاحيته المتبقية. استخدم أسرار اختبار عامة عند التجربة."
    ],
    "Authenticator codes depend on the secret and clock. Keep real secrets private and check device time when codes disagree.": [
        "कोड सीक्रेट और घड़ी पर निर्भर हैं। असली सीक्रेट निजी रखें और अंतर होने पर डिवाइस समय जाँचें।",
        "Los códigos dependen del secreto y reloj. Protege secretos reales y revisa la hora si los códigos difieren.",
        "Les codes dépendent du secret et de l’horloge. Gardez les vrais secrets privés et vérifiez l’heure en cas d’écart.",
        "Codes hängen von Geheimnis und Uhr ab. Echte Geheimnisse privat halten und bei Abweichungen Gerätezeit prüfen.",
        "認証コードは秘密と時計に依存します。本物の秘密を公開せず、不一致時は端末時刻を確認してください。",
        "验证码取决于密钥和时钟。请保护真实密钥，并在代码不一致时检查设备时间。",
        "تعتمد الرموز على السر والساعة. احفظ الأسرار الحقيقية وتحقق من وقت الجهاز عند اختلاف الرموز."
    ],
    "Name a snippet, select its language and enter code and tags before saving.": [
        "स्निपेट का नाम दें, भाषा चुनें और सहेजने से पहले कोड और टैग दर्ज करें।",
        "Nombra el fragmento, elige lenguaje e introduce código y etiquetas antes de guardar.",
        "Nommez l’extrait, choisissez la langue et saisissez code et étiquettes avant d’enregistrer.",
        "Snippet benennen, Sprache wählen und vor dem Speichern Code und Tags eingeben.",
        "スニペット名と言語を選び、コードとタグを入力して保存します。",
        "为片段命名、选择语言，并在保存前输入代码和标签。",
        "سم المقتطف واختر لغته وأدخل الكود والوسوم قبل الحفظ."
    ],
    "Search saved snippets, format or copy code, and export a backup for the current project.": [
        "सहेजे स्निपेट खोजें, कोड फ़ॉर्मेट या कॉपी करें और वर्तमान प्रोजेक्ट का बैकअप निर्यात करें।",
        "Busca fragmentos, formatea o copia código y exporta una copia del proyecto actual.",
        "Recherchez les extraits, formatez ou copiez le code et exportez une sauvegarde du projet courant.",
        "Gespeicherte Snippets suchen, Code formatieren oder kopieren und Projektbackup exportieren.",
        "保存スニペットを検索し、コードを整形・コピーして、現在のプロジェクトのバックアップを出力します。",
        "搜索已保存片段，格式化或复制代码，并导出当前项目的备份。",
        "ابحث في المقتطفات ونسق الكود أو انسخه وصدر نسخة للمشروع الحالي."
    ],
    "Focus the capture area and press a key to inspect key, code, location and modifiers.": [
        "कैप्चर क्षेत्र पर फ़ोकस कर कुंजी दबाएँ और key, code, स्थान और संशोधक जाँचें।",
        "Enfoca el área y pulsa una tecla para revisar key, code, ubicación y modificadores.",
        "Activez la zone de capture et appuyez sur une touche pour examiner key, code, emplacement et modificateurs.",
        "Erfassungsbereich fokussieren und Taste drücken, um key, code, Position und Modifikatoren zu prüfen.",
        "キャプチャ領域にフォーカスしてキーを押し、key、code、位置、修飾キーを確認します。",
        "聚焦捕获区域并按键，以检查 key、code、位置和修饰键。",
        "ركز على منطقة الالتقاط واضغط مفتاحًا لفحص key وcode والموقع والمعدلات."
    ],
    "Review event history and copy or export the captured fields for debugging.": [
        "घटना इतिहास जाँचें और डिबगिंग के लिए कैप्चर फ़ील्ड कॉपी या निर्यात करें।",
        "Revisa el historial de eventos y copia o exporta los campos para depurar.",
        "Examinez l’historique et copiez ou exportez les champs capturés pour le débogage.",
        "Ereignisverlauf prüfen und erfasste Felder zum Debuggen kopieren oder exportieren.",
        "イベント履歴を確認し、取得したフィールドをデバッグ用にコピー・出力します。",
        "检查事件历史，并复制或导出捕获字段用于调试。",
        "راجع سجل الأحداث وانسخ الحقول الملتقطة أو صدرها للتصحيح."
    ],
    "Browser and operating-system shortcuts may intercept a key before the page receives it.": [
        "ब्राउज़र या ऑपरेटिंग सिस्टम शॉर्टकट पेज से पहले कुंजी पकड़ सकते हैं।",
        "Los atajos del navegador o sistema pueden interceptar teclas antes que la página.",
        "Les raccourcis du navigateur ou du système peuvent intercepter une touche avant la page.",
        "Browser- und Systemkürzel können Tasten abfangen, bevor die Seite sie erhält.",
        "ブラウザーやOSのショートカットが、ページに届く前にキーを処理する場合があります。",
        "浏览器和操作系统快捷键可能在页面收到按键前拦截它。",
        "قد تعترض اختصارات المتصفح والنظام المفتاح قبل وصوله إلى الصفحة."
    ],
    "Choose a CSS builder and adjust its controls while checking the live preview.": [
        "CSS बिल्डर चुनें और लाइव पूर्वावलोकन देखते हुए नियंत्रण बदलें।",
        "Elige un generador CSS y ajusta controles observando la vista previa.",
        "Choisissez un générateur CSS et ajustez les réglages en observant l’aperçu.",
        "CSS-Generator wählen und Einstellungen anhand der Live-Vorschau anpassen.",
        "CSSビルダーを選び、プレビューを見ながら設定を調整します。",
        "选择 CSS 生成器，并在查看实时预览时调整控件。",
        "اختر منشئ CSS واضبط عناصره مع متابعة المعاينة المباشرة."
    ],
    "Copy the generated CSS and test it with your own layout, content and browser targets.": [
        "बना CSS कॉपी कर अपने लेआउट, सामग्री और लक्षित ब्राउज़र में जाँचें।",
        "Copia el CSS y pruébalo con tu diseño, contenido y navegadores objetivo.",
        "Copiez le CSS et testez-le avec vos mises en page, contenus et navigateurs cibles.",
        "Erzeugtes CSS kopieren und mit eigenem Layout, Inhalt und Zielbrowsern testen.",
        "生成CSSをコピーし、実際のレイアウト・内容・対象ブラウザーで試してください。",
        "复制生成的 CSS，并使用自己的布局、内容和目标浏览器测试。",
        "انسخ CSS الناتج واختبره مع تخطيطك ومحتواك والمتصفحات المستهدفة."
    ],
    "Choose a meeting date and time, then add the IANA timezones you want to compare.": [
        "मीटिंग का दिन और समय चुनें, फिर तुलना के IANA समयक्षेत्र जोड़ें।",
        "Elige fecha y hora y añade las zonas IANA que quieras comparar.",
        "Choisissez date et heure de réunion, puis ajoutez les fuseaux IANA à comparer.",
        "Besprechungsdatum und -zeit wählen, dann zu vergleichende IANA-Zeitzonen hinzufügen.",
        "会議の日時を選び、比較するIANAタイムゾーンを追加します。",
        "选择会议日期和时间，然后添加要比较的 IANA 时区。",
        "اختر موعد الاجتماع وأضف مناطق IANA الزمنية التي تريد مقارنتها."
    ],
    "Review local dates, UTC offsets and working-hour overlap before copying the schedule.": [
        "शेड्यूल कॉपी करने से पहले स्थानीय तारीख, UTC ऑफ़सेट और कार्य-समय ओवरलैप जाँचें।",
        "Revisa fechas locales, desfases UTC y coincidencias laborales antes de copiar la agenda.",
        "Vérifiez dates locales, décalages UTC et chevauchement des heures de travail avant de copier.",
        "Lokale Daten, UTC-Abstände und Arbeitszeitüberschneidungen vor dem Kopieren des Plans prüfen.",
        "予定をコピーする前に、現地日付、UTCオフセット、勤務時間の重なりを確認します。",
        "复制日程前请检查本地日期、UTC 偏移和工作时段重叠。",
        "راجع التواريخ المحلية وفروق UTC وتداخل ساعات العمل قبل نسخ الجدول."
    ],
    "Daylight-saving transitions can create missing or repeated local times. Review the selected date and offset.": [
        "डेलाइट सेविंग से स्थानीय समय गायब या दोहराए जा सकते हैं। चुनी तारीख और ऑफ़सेट जाँचें।",
        "Los cambios de horario pueden omitir o repetir horas locales. Revisa fecha y desfase.",
        "Les changements d’heure peuvent supprimer ou répéter des heures locales. Vérifiez date et décalage.",
        "Sommerzeitwechsel können lokale Zeiten auslassen oder wiederholen. Gewähltes Datum und Offset prüfen.",
        "夏時間の切り替えで現地時刻が欠落・重複する場合があります。日付とオフセットを確認してください。",
        "夏令时切换可能导致本地时间缺失或重复。请检查选定日期和偏移。",
        "قد تسبب تغييرات التوقيت الصيفي أوقاتًا محلية مفقودة أو مكررة. راجع التاريخ والفرق."
    ],
    "Select the quantity category, source unit and destination unit, then enter a value.": [
        "राशि श्रेणी, स्रोत इकाई और लक्ष्य इकाई चुनकर मान दर्ज करें।",
        "Elige categoría, unidad de origen y destino e introduce un valor.",
        "Choisissez grandeur, unité source et unité cible, puis saisissez une valeur.",
        "Größenkategorie, Quell- und Zieleinheit wählen und Wert eingeben.",
        "量のカテゴリ、変換元・先の単位を選んで値を入力します。",
        "选择数量类别、源单位和目标单位，然后输入值。",
        "اختر فئة الكمية ووحدتي المصدر والهدف ثم أدخل قيمة."
    ],
    "Review the converted value and unit definitions before copying the result.": [
        "परिणाम कॉपी करने से पहले बदला मान और इकाई परिभाषाएँ जाँचें।",
        "Revisa el valor convertido y las definiciones de unidad antes de copiar.",
        "Vérifiez la valeur convertie et les définitions d’unités avant de copier.",
        "Umgewandelten Wert und Einheitendefinitionen vor dem Kopieren prüfen.",
        "コピー前に変換値と単位の定義を確認してください。",
        "复制前请检查转换值和单位定义。",
        "راجع القيمة المحولة وتعريفات الوحدات قبل النسخ."
    ],
    "Check the displayed precision and whether a temperature conversion represents an absolute value or a difference.": [
        "दिखाई परिशुद्धता जाँचें और देखें तापमान परिवर्तन निरपेक्ष मान है या अंतर।",
        "Comprueba la precisión y si la temperatura es un valor absoluto o una diferencia.",
        "Vérifiez la précision et si la conversion de température représente une valeur absolue ou un écart.",
        "Angezeigte Präzision prüfen und klären, ob die Temperaturumrechnung einen absoluten Wert oder eine Differenz darstellt.",
        "表示精度と、温度変換が絶対値か温度差かを確認してください。",
        "检查显示精度，并确认温度转换表示绝对值还是温差。",
        "تحقق من الدقة وما إذا كان تحويل الحرارة يمثل قيمة مطلقة أو فرقًا."
    ],
    "The authenticated localhost runtime forwards the operation to your service and returns its response. Saved connections use the encrypted project vault; query results remain in page memory.": [
        "प्रमाणित localhost रनटाइम क्रिया आपकी सेवा को भेजकर प्रतिक्रिया लौटाता है। सहेजे कनेक्शन एन्क्रिप्टेड प्रोजेक्ट वॉल्ट में हैं; क्वेरी परिणाम पेज मेमोरी में रहते हैं।",
        "El entorno localhost autenticado envía la operación al servicio y devuelve su respuesta. Las conexiones se guardan en la bóveda cifrada; los resultados quedan en memoria de la página.",
        "L’environnement localhost authentifié transmet l’opération au service et renvoie sa réponse. Les connexions sont dans le coffre chiffré du projet ; les résultats restent en mémoire de page.",
        "Die authentifizierte localhost-Laufzeit leitet den Vorgang an Ihren Dienst und gibt die Antwort zurück. Gespeicherte Verbindungen liegen im verschlüsselten Projekttresor; Ergebnisse bleiben im Seitenspeicher.",
        "認証付きlocalhostランタイムがサービスに操作を転送し、応答を返します。接続は暗号化プロジェクト保管庫に保存され、クエリー結果はページのメモリーに残ります。",
        "已认证的 localhost 运行时将操作转发到服务并返回响应。已保存连接使用项目加密保险库；查询结果保留在页面内存中。",
        "ترسل بيئة localhost الموثقة العملية إلى خدمتك وتعيد استجابتها. تحفظ الاتصالات في خزنة المشروع المشفرة وتبقى النتائج في ذاكرة الصفحة."
    ],
    "Direct mode sends requests from your browser to the target. Proxy mode sends the configured request through this deployment; the target also receives it. Review credentials and payloads before sending.": [
        "सीधा मोड ब्राउज़र से लक्ष्य को अनुरोध भेजता है। प्रॉक्सी मोड इसी डिप्लॉयमेंट से अनुरोध भेजता है; लक्ष्य भी पाता है। भेजने से पहले क्रेडेंशियल और बॉडी जाँचें।",
        "El modo directo envía desde el navegador al destino. El proxy pasa la solicitud por este despliegue; el destino también la recibe. Revisa credenciales y contenido antes de enviar.",
        "Le mode direct envoie du navigateur vers la cible. Le proxy passe par ce déploiement ; la cible reçoit aussi la requête. Vérifiez identifiants et contenus avant envoi.",
        "Direktmodus sendet vom Browser zum Ziel. Proxymodus leitet die konfigurierte Anfrage durch diese Bereitstellung; auch das Ziel erhält sie. Zugangsdaten und Nutzlast vor dem Senden prüfen.",
        "直接モードはブラウザーから宛先へ送信します。プロキシモードはこのデプロイを経由し、宛先にも届きます。送信前に認証情報と本文を確認してください。",
        "直接模式从浏览器向目标发送请求。代理模式通过此部署发送配置的请求，目标也会收到。发送前请检查凭据和载荷。",
        "يرسل الوضع المباشر من المتصفح إلى الهدف. يمر وضع الوكيل عبر هذا النشر ويستلم الهدف الطلب أيضًا. راجع بيانات الاعتماد والمحتوى قبل الإرسال."
    ],
    "Target URL, configured headers and credentials, and the request payload": [
        "लक्ष्य URL, तय हेडर और क्रेडेंशियल, तथा अनुरोध बॉडी",
        "URL de destino, cabeceras y credenciales configuradas y contenido de la solicitud",
        "URL cible, en-têtes et identifiants configurés, et contenu de la requête",
        "Ziel-URL, konfigurierte Header und Zugangsdaten sowie Anfrageinhalt",
        "宛先URL、設定したヘッダー・認証情報、リクエスト本文",
        "目标 URL、配置的标头和凭据以及请求载荷",
        "URL الهدف والترويسات وبيانات الاعتماد المعدة ومحتوى الطلب"
    ],
    "Remote database actions send data to your local runtime": [
        "दूरस्थ डेटाबेस क्रियाएँ स्थानीय रनटाइम को डेटा भेजती हैं",
        "Las acciones de bases remotas envían datos a tu entorno local",
        "Les actions de base distante envoient des données à l’environnement local",
        "Entfernte Datenbankaktionen senden Daten an Ihre lokale Laufzeit",
        "リモートDB操作はローカルランタイムにデータを送信",
        "远程数据库操作会向本地运行时发送数据",
        "ترسل عمليات القواعد البعيدة البيانات إلى بيئتك المحلية"
    ],
    "SQLite files are processed locally. PostgreSQL, MySQL and MariaDB connections require the authenticated localhost runtime.": [
        "SQLite फ़ाइलें स्थानीय रूप से संसाधित होती हैं। PostgreSQL, MySQL और MariaDB को प्रमाणित localhost रनटाइम चाहिए।",
        "Los archivos SQLite se procesan localmente. PostgreSQL, MySQL y MariaDB requieren el entorno localhost autenticado.",
        "Les fichiers SQLite sont traités localement. PostgreSQL, MySQL et MariaDB exigent l’environnement localhost authentifié.",
        "SQLite-Dateien werden lokal verarbeitet. PostgreSQL, MySQL und MariaDB benötigen die authentifizierte localhost-Laufzeit.",
        "SQLiteファイルはローカル処理です。PostgreSQL、MySQL、MariaDB接続には認証付きlocalhostランタイムが必要です。",
        "SQLite 文件在本地处理。PostgreSQL、MySQL 和 MariaDB 连接需要已认证的 localhost 运行时。",
        "تعالج ملفات SQLite محليًا. تتطلب PostgreSQL وMySQL وMariaDB بيئة localhost موثقة."
    ],
    "Database host, port, database name, username, password and TLS setting": [
        "डेटाबेस होस्ट, पोर्ट, डेटाबेस नाम, उपयोगकर्ता नाम, पासवर्ड और TLS सेटिंग",
        "Host, puerto, base de datos, usuario, contraseña y ajuste TLS",
        "Hôte, port, nom de base, utilisateur, mot de passe et réglage TLS",
        "Datenbankhost, Port, Datenbankname, Benutzername, Passwort und TLS-Einstellung",
        "DBホスト、ポート、DB名、ユーザー名、パスワード、TLS設定",
        "数据库主机、端口、数据库名、用户名、密码及 TLS 设置",
        "مضيف القاعدة والمنفذ واسم القاعدة والمستخدم وكلمة المرور وإعداد TLS"
    ],
    "SQL statement, parameters, schema requests and mutation permission": [
        "SQL कथन, पैरामीटर, स्कीमा अनुरोध और बदलाव अनुमति",
        "Sentencia SQL, parámetros, consultas de esquema y permiso de modificación",
        "Instruction SQL, paramètres, demandes de schéma et permission de modification",
        "SQL-Anweisung, Parameter, Schema-Anfragen und Änderungsfreigabe",
        "SQL文、パラメーター、スキーマ要求、変更権限",
        "SQL 语句、参数、结构请求和变更权限",
        "تعليمة SQL والمعاملات وطلبات المخطط وإذن التعديل"
    ],
    "Redis actions send data to your local runtime": [
        "Redis क्रियाएँ स्थानीय रनटाइम को डेटा भेजती हैं",
        "Las acciones Redis envían datos a tu entorno local",
        "Les actions Redis envoient des données à l’environnement local",
        "Redis-Aktionen senden Daten an Ihre lokale Laufzeit",
        "Redis操作はローカルランタイムにデータを送信",
        "Redis 操作会向本地运行时发送数据",
        "ترسل عمليات Redis البيانات إلى بيئتك المحلية"
    ],
    "The browser uses the authenticated localhost runtime to connect to Redis.": [
        "ब्राउज़र Redis से जुड़ने के लिए प्रमाणित localhost रनटाइम उपयोग करता है।",
        "El navegador usa el entorno localhost autenticado para conectar a Redis.",
        "Le navigateur utilise l’environnement localhost authentifié pour se connecter à Redis.",
        "Der Browser verbindet sich über die authentifizierte localhost-Laufzeit mit Redis.",
        "ブラウザーは認証付きlocalhostランタイムを通じてRedisに接続します。",
        "浏览器通过已认证的 localhost 运行时连接 Redis。",
        "يستخدم المتصفح بيئة localhost الموثقة للاتصال بـ Redis."
    ],
    "Redis host, port, database index, ACL username, password and TLS setting": [
        "Redis होस्ट, पोर्ट, डेटाबेस इंडेक्स, ACL उपयोगकर्ता नाम, पासवर्ड और TLS सेटिंग",
        "Host Redis, puerto, índice de base, usuario ACL, contraseña y TLS",
        "Hôte Redis, port, index de base, utilisateur ACL, mot de passe et TLS",
        "Redis-Host, Port, Datenbankindex, ACL-Benutzername, Passwort und TLS",
        "Redisホスト、ポート、DB番号、ACLユーザー名、パスワード、TLS設定",
        "Redis 主机、端口、数据库索引、ACL 用户名、密码和 TLS 设置",
        "مضيف Redis والمنفذ وفهرس القاعدة ومستخدم ACL وكلمة المرور وTLS"
    ],
    "Scan pattern, cursor, key bytes, command arguments and mutation permission": [
        "स्कैन पैटर्न, कर्सर, कुंजी बाइट, कमांड तर्क और बदलाव अनुमति",
        "Patrón, cursor, bytes de clave, argumentos y permiso de modificación",
        "Motif de scan, curseur, octets de clé, arguments et permission de modification",
        "Scanmuster, Cursor, Schlüsselbytes, Befehlsargumente und Änderungsfreigabe",
        "検索パターン、カーソル、キーのバイト、コマンド引数、変更権限",
        "扫描模式、游标、键字节、命令参数和变更权限",
        "نمط الفحص والمؤشر وبايتات المفتاح ومعاملات الأمر وإذن التعديل"
    ],
    "Database actions send data to your local runtime": [
        "डेटाबेस क्रियाएँ स्थानीय रनटाइम को डेटा भेजती हैं",
        "Las acciones de base de datos envían datos al entorno local",
        "Les actions de base de données envoient des données à l’environnement local",
        "Datenbankaktionen senden Daten an Ihre lokale Laufzeit",
        "DB操作はローカルランタイムにデータを送信",
        "数据库操作会向本地运行时发送数据",
        "ترسل عمليات القاعدة البيانات إلى بيئتك المحلية"
    ],
    "MongoDB, Firestore and Elasticsearch connections require the authenticated localhost runtime.": [
        "MongoDB, Firestore और Elasticsearch को प्रमाणित localhost रनटाइम चाहिए।",
        "MongoDB, Firestore y Elasticsearch requieren el entorno localhost autenticado.",
        "MongoDB, Firestore et Elasticsearch exigent l’environnement localhost authentifié.",
        "MongoDB, Firestore und Elasticsearch benötigen die authentifizierte localhost-Laufzeit.",
        "MongoDB、Firestore、Elasticsearch接続には認証付きlocalhostランタイムが必要です。",
        "MongoDB、Firestore 和 Elasticsearch 连接需要已认证的 localhost 运行时。",
        "تتطلب اتصالات MongoDB وFirestore وElasticsearch بيئة localhost موثقة."
    ],
    "Service endpoint, database or project identifiers, authentication credentials and connection settings": [
        "सेवा एंडपॉइंट, डेटाबेस या प्रोजेक्ट पहचानकर्ता, प्रमाणीकरण क्रेडेंशियल और कनेक्शन सेटिंग",
        "Endpoint, identificadores de base o proyecto, credenciales y ajustes de conexión",
        "Point de service, identifiants de base ou projet, authentification et paramètres de connexion",
        "Dienst-Endpunkt, Datenbank- oder Projektkennungen, Zugangsdaten und Verbindungseinstellungen",
        "サービスの接続先、DB・プロジェクト識別子、認証情報、接続設定",
        "服务端点、数据库或项目标识符、认证凭据和连接设置",
        "نقطة الخدمة ومعرفات القاعدة أو المشروع وبيانات المصادقة وإعدادات الاتصال"
    ],
    "Selected resources, filters, projections, queries and pagination parameters": [
        "चुने संसाधन, फ़िल्टर, प्रोजेक्शन, क्वेरी और पृष्ठांकन पैरामीटर",
        "Recursos, filtros, proyecciones, consultas y parámetros de paginación",
        "Ressources, filtres, projections, requêtes et paramètres de pagination",
        "Ausgewählte Ressourcen, Filter, Projektionen, Abfragen und Seitenparameter",
        "選択リソース、フィルター、投影、クエリー、ページ分割パラメーター",
        "所选资源、筛选、投影、查询和分页参数",
        "الموارد المحددة والمرشحات والإسقاطات والاستعلامات ومعاملات الصفحات"
    ],
    "Storage actions send data to your local runtime": [
        "स्टोरेज क्रियाएँ स्थानीय रनटाइम को डेटा भेजती हैं",
        "Las acciones de almacenamiento envían datos al entorno local",
        "Les actions de stockage envoient des données à l’environnement local",
        "Speicheraktionen senden Daten an Ihre lokale Laufzeit",
        "ストレージ操作はローカルランタイムにデータを送信",
        "存储操作会向本地运行时发送数据",
        "ترسل عمليات التخزين البيانات إلى بيئتك المحلية"
    ],
    "The authenticated localhost runtime signs and forwards requests to your S3-compatible storage service.": [
        "प्रमाणित localhost रनटाइम आपके S3-संगत स्टोरेज को हस्ताक्षरित अनुरोध भेजता है।",
        "El entorno localhost autenticado firma y envía solicitudes a tu almacenamiento compatible con S3.",
        "L’environnement localhost authentifié signe et transmet les requêtes à votre stockage compatible S3.",
        "Die authentifizierte localhost-Laufzeit signiert Anfragen und leitet sie an Ihren S3-kompatiblen Speicher.",
        "認証付きlocalhostランタイムが署名し、S3互換ストレージに要求を転送します。",
        "已认证的 localhost 运行时签署请求，并将其转发到 S3 兼容存储服务。",
        "توقع بيئة localhost الموثقة الطلبات وترسلها لخدمة تخزينك المتوافقة مع S3."
    ],
    "Storage endpoint, region, access key, secret key and optional session token": [
        "स्टोरेज एंडपॉइंट, क्षेत्र, एक्सेस कुंजी, गुप्त कुंजी और वैकल्पिक सत्र टोकन",
        "Endpoint, región, clave de acceso, clave secreta y token de sesión opcional",
        "Point de stockage, région, clé d’accès, clé secrète et jeton de session facultatif",
        "Speicher-Endpunkt, Region, Zugriffsschlüssel, geheimer Schlüssel und optionales Sitzungstoken",
        "ストレージ接続先、リージョン、アクセスキー、秘密キー、任意のセッショントークン",
        "存储端点、区域、访问密钥、秘密密钥和可选会话令牌",
        "نقطة التخزين والمنطقة ومفتاحا الوصول والسر ورمز الجلسة الاختياري"
    ],
    "Bucket, object key, listing filters and uploaded file bytes; delete operations when confirmed": [
        "बकेट, ऑब्जेक्ट कुंजी, सूची फ़िल्टर और अपलोड फ़ाइल बाइट; पुष्टि पर विलोपन क्रियाएँ",
        "Bucket, clave de objeto, filtros y bytes de archivos cargados; borrados al confirmarlos",
        "Bucket, clé d’objet, filtres et octets des fichiers envoyés ; suppressions après confirmation",
        "Bucket, Objektschlüssel, Listenfilter und hochgeladene Dateibytes; bestätigte Löschvorgänge",
        "バケット、オブジェクトキー、一覧フィルター、アップロードしたファイルのバイト、確認済み削除操作",
        "存储桶、对象键、列表筛选和上传文件字节；确认后的删除操作",
        "الحاوية ومفتاح الكائن ومرشحات العرض وبايتات الملفات المرفوعة وعمليات الحذف المؤكدة"
    ],
    "The storage provider receives the signed operation and any uploaded contents. Downloads return through the localhost runtime. Saved credentials use the encrypted project vault.": [
        "स्टोरेज प्रदाता हस्ताक्षरित क्रिया और अपलोड सामग्री पाता है। डाउनलोड localhost रनटाइम से लौटते हैं। सहेजे क्रेडेंशियल एन्क्रिप्टेड प्रोजेक्ट वॉल्ट में हैं।",
        "El proveedor recibe la operación firmada y los contenidos cargados. Las descargas pasan por localhost. Las credenciales se guardan en la bóveda cifrada.",
        "Le fournisseur reçoit l’opération signée et les contenus envoyés. Les téléchargements passent par localhost. Les identifiants sont dans le coffre chiffré du projet.",
        "Der Speicheranbieter erhält signierten Vorgang und Uploads. Downloads kommen über localhost zurück. Gespeicherte Zugangsdaten liegen im verschlüsselten Projekttresor.",
        "ストレージ事業者は署名操作とアップロード内容を受信します。ダウンロードはlocalhost経由で戻り、認証情報は暗号化プロジェクト保管庫に保存されます。",
        "存储提供商接收已签署操作和上传内容。下载通过 localhost 运行时返回。已保存凭据使用项目加密保险库。",
        "يستلم مزود التخزين العملية الموقعة والمحتوى المرفوع. تعود التنزيلات عبر localhost وتحفظ الاعتمادات في خزنة المشروع المشفرة."
    ],
    "DNS lookups connect directly from your browser": [
        "DNS खोज सीधे ब्राउज़र से जुड़ती है",
        "Las consultas DNS salen directamente del navegador",
        "Les recherches DNS partent directement du navigateur",
        "DNS-Abfragen erfolgen direkt aus dem Browser",
        "DNS照会はブラウザーから直接接続",
        "DNS 查询直接从浏览器连接",
        "تتصل استعلامات DNS مباشرة من المتصفح"
    ],
    "The selected Cloudflare or Google DNS-over-HTTPS resolver answers the query.": [
        "चुना Cloudflare या Google DNS-over-HTTPS रिज़ॉल्वर क्वेरी का उत्तर देता है।",
        "El resolutor DNS-over-HTTPS de Cloudflare o Google elegido responde a la consulta.",
        "Le résolveur DNS-over-HTTPS Cloudflare ou Google choisi répond à la requête.",
        "Der gewählte DNS-over-HTTPS-Resolver von Cloudflare oder Google beantwortet die Abfrage.",
        "選択したCloudflareまたはGoogleのDNS-over-HTTPSリゾルバーが回答します。",
        "所选 Cloudflare 或 Google DNS-over-HTTPS 解析器响应查询。",
        "يجيب محلل DNS-over-HTTPS المختار من Cloudflare أو Google عن الاستعلام."
    ],
    "The queried hostname or address, DNS record type and ordinary HTTP metadata": [
        "क्वेरी का होस्टनाम या पता, DNS रिकॉर्ड प्रकार और सामान्य HTTP मेटाडेटा",
        "Host o dirección consultada, tipo de registro DNS y metadatos HTTP habituales",
        "Nom ou adresse recherché, type d’enregistrement DNS et métadonnées HTTP habituelles",
        "Abgefragter Hostname oder Adresse, DNS-Datensatztyp und übliche HTTP-Metadaten",
        "照会ホスト名・アドレス、DNSレコード種別、通常のHTTPメタデータ",
        "查询的主机名或地址、DNS 记录类型和普通 HTTP 元数据",
        "اسم المضيف أو العنوان المستعلم عنه ونوع سجل DNS وبيانات HTTP المعتادة"
    ],
    "The selected resolver receives the query and may retain it under its own policies. Results remain in this page; the app server does not relay this lookup.": [
        "चुना रिज़ॉल्वर क्वेरी पाता है और अपनी नीति के अनुसार रख सकता है। परिणाम पेज में रहते हैं; ऐप सर्वर खोज को रिले नहीं करता।",
        "El resolutor recibe la consulta y puede conservarla según sus políticas. Los resultados quedan en la página; el servidor de la app no la retransmite.",
        "Le résolveur reçoit la requête et peut la conserver selon ses règles. Les résultats restent dans la page ; le serveur de l’app ne relaie pas la recherche.",
        "Der Resolver erhält die Anfrage und kann sie gemäß seinen Richtlinien speichern. Ergebnisse bleiben auf dieser Seite; der App-Server leitet die Abfrage nicht weiter.",
        "リゾルバーは照会を受信し、独自方針で保存する場合があります。結果はこのページに残り、アプリサーバーは中継しません。",
        "所选解析器收到查询后可能依其政策保留。结果仅保留在此页面，应用服务器不会转发此查询。",
        "يستلم المحلل الاستعلام وقد يحتفظ به وفق سياساته. تبقى النتائج في الصفحة ولا يمرر خادم التطبيق الاستعلام."
    ],
    "Optional MX lookup connects directly from your browser": [
        "वैकल्पिक MX खोज सीधे ब्राउज़र से जुड़ती है",
        "La consulta MX opcional sale directamente del navegador",
        "La recherche MX facultative part directement du navigateur",
        "Optionale MX-Abfrage erfolgt direkt aus dem Browser",
        "任意のMX照会はブラウザーから直接接続",
        "可选 MX 查询直接从浏览器连接",
        "يتصل بحث MX الاختياري مباشرة من المتصفح"
    ],
    "Email syntax checks are local. The optional MX diagnostic queries the selected DNS-over-HTTPS resolver.": [
        "ईमेल प्रारूप जाँच स्थानीय है। वैकल्पिक MX निदान चुने DNS-over-HTTPS रिज़ॉल्वर को क्वेरी करता है।",
        "La sintaxis se valida localmente. El diagnóstico MX opcional consulta al resolutor DNS-over-HTTPS elegido.",
        "La syntaxe email est vérifiée localement. Le diagnostic MX facultatif interroge le résolveur DNS-over-HTTPS choisi.",
        "E-Mail-Syntax wird lokal geprüft. Die optionale MX-Diagnose fragt den gewählten DNS-over-HTTPS-Resolver ab.",
        "メール構文はローカルで確認します。任意のMX診断は選択したDNS-over-HTTPSリゾルバーを照会します。",
        "电子邮件语法检查在本地完成。可选 MX 诊断会查询所选 DNS-over-HTTPS 解析器。",
        "فحص صيغة البريد محلي. يستعلم تشخيص MX الاختياري من محلل DNS-over-HTTPS المختار."
    ],
    "The email domain only, MX queries and fallback A/AAAA queries; the mailbox name is not sent": [
        "केवल ईमेल डोमेन, MX और वैकल्पिक A/AAAA क्वेरी; मेलबॉक्स नाम नहीं भेजा जाता",
        "Solo dominio del correo, consultas MX y alternativas A/AAAA; no se envía el nombre del buzón",
        "Domaine email uniquement, requêtes MX et repli A/AAAA ; le nom de boîte n’est pas envoyé",
        "Nur E-Mail-Domain, MX- und Ausweichabfragen A/AAAA; der Postfachname wird nicht gesendet",
        "メールドメインのみ、MX照会と代替A/AAAA照会。メールボックス名は送信しません",
        "仅发送邮件域名、MX 查询及回退 A/AAAA 查询；不发送邮箱名称",
        "نطاق البريد فقط واستعلامات MX وA/AAAA الاحتياطية؛ لا يرسل اسم صندوق البريد"
    ],
    "Cloudflare or Google receives the domain query and may retain it under its own policies. This diagnostic does not contact the mailbox or prove delivery.": [
        "Cloudflare या Google डोमेन क्वेरी पाकर अपनी नीति अनुसार रख सकता है। निदान मेलबॉक्स से संपर्क नहीं करता और डिलीवरी सिद्ध नहीं करता।",
        "Cloudflare o Google recibe la consulta y puede conservarla según sus políticas. No se contacta al buzón ni se prueba la entrega.",
        "Cloudflare ou Google reçoit la requête et peut la conserver selon ses règles. Le diagnostic ne contacte pas la boîte et ne prouve pas la livraison.",
        "Cloudflare oder Google erhält die Domainabfrage und kann sie gemäß eigenen Richtlinien speichern. Die Diagnose kontaktiert kein Postfach und beweist keine Zustellung.",
        "CloudflareまたはGoogleが照会を受信し、独自方針で保存する場合があります。メールボックスには接続せず、配信も証明しません。",
        "Cloudflare 或 Google 收到域名查询后可能依其政策保留。此诊断不会联系邮箱或证明邮件可送达。",
        "تستلم Cloudflare أو Google استعلام النطاق وقد تحتفظ به وفق سياساتها. لا يتصل التشخيص بالصندوق ولا يثبت التسليم."
    ],
    "Optional provider counting sends text to the provider": [
        "वैकल्पिक प्रदाता गणना प्रदाता को पाठ भेजती है",
        "El recuento opcional envía texto al proveedor",
        "Le comptage facultatif envoie le texte au fournisseur",
        "Optionale Anbieterzählung sendet Text an den Anbieter",
        "任意のプロバイダー計数はテキストを送信",
        "可选提供商计数会向提供商发送文本",
        "يرسل عد المزود الاختياري النص إلى المزود"
    ],
    "Local estimates stay in your browser. Provider counting calls the selected provider directly only when requested.": [
        "स्थानीय अनुमान ब्राउज़र में रहते हैं। माँगने पर ही प्रदाता गणना चुने प्रदाता से सीधे जुड़ती है।",
        "Las estimaciones locales quedan en el navegador. El recuento del proveedor lo contacta directamente solo al solicitarlo.",
        "Les estimations locales restent dans le navigateur. Le fournisseur n’est contacté directement que sur demande de comptage.",
        "Lokale Schätzungen bleiben im Browser. Die Anbieterzählung ruft den gewählten Anbieter nur auf Anforderung direkt auf.",
        "ローカル推定はブラウザー内に留まります。プロバイダー計数は要求時のみ直接接続します。",
        "本地估算仅保留在浏览器中。仅在请求提供商计数时才直接调用所选提供商。",
        "تبقى التقديرات المحلية في المتصفح. يتصل عد المزود بالمزود المختار مباشرة عند الطلب فقط."
    ],
    "Input text, selected model identifier and your provider API key": [
        "इनपुट पाठ, चुने मॉडल का पहचानकर्ता और प्रदाता API कुंजी",
        "Texto de entrada, identificador de modelo y tu clave API del proveedor",
        "Texte d’entrée, identifiant du modèle choisi et clé API du fournisseur",
        "Eingabetext, gewählte Modellkennung und Ihr Anbieter-API-Schlüssel",
        "入力テキスト、選択モデルID、プロバイダーAPIキー",
        "输入文本、所选模型标识符和提供商 API 密钥",
        "نص الإدخال ومعرف النموذج المختار ومفتاح API للمزود"
    ],
    "OpenAI, Anthropic or Google receives the counting request under its own policies. The app server does not relay it; the provider key stays in page memory.": [
        "OpenAI, Anthropic या Google अपनी नीतियों के तहत गणना अनुरोध पाता है। ऐप सर्वर रिले नहीं करता; प्रदाता कुंजी पेज मेमोरी में रहती है।",
        "OpenAI, Anthropic o Google recibe la solicitud según sus políticas. El servidor de la app no la retransmite; la clave queda en memoria de la página.",
        "OpenAI, Anthropic ou Google reçoit la demande selon ses règles. Le serveur de l’app ne la relaie pas ; la clé reste en mémoire de page.",
        "OpenAI, Anthropic oder Google erhält die Zählanfrage gemäß eigenen Richtlinien. Der App-Server leitet sie nicht weiter; der Schlüssel bleibt im Seitenspeicher.",
        "OpenAI、Anthropic、Googleが各方針で計数要求を受信します。アプリサーバーは中継せず、キーはページのメモリーに残ります。",
        "OpenAI、Anthropic 或 Google 根据各自政策接收计数请求。应用服务器不会转发；提供商密钥保留在页面内存中。",
        "تستلم OpenAI أو Anthropic أو Google طلب العد وفق سياساتها. لا يمرره خادم التطبيق ويبقى المفتاح في ذاكرة الصفحة."
    ],
    "WebSocket connections go directly to your server": [
        "WebSocket कनेक्शन सीधे आपके सर्वर पर जाते हैं",
        "Las conexiones WebSocket van directamente a tu servidor",
        "Les connexions WebSocket vont directement à votre serveur",
        "WebSocket-Verbindungen gehen direkt zu Ihrem Server",
        "WebSocketはサーバーに直接接続",
        "WebSocket 连接直接访问你的服务器",
        "تذهب اتصالات WebSocket مباشرة إلى خادمك"
    ],
    "The browser opens a WebSocket connection to the URL you enter.": [
        "ब्राउज़र आपके दर्ज URL पर WebSocket कनेक्शन खोलता है।",
        "El navegador abre una conexión WebSocket a la URL introducida.",
        "Le navigateur ouvre une connexion WebSocket à l’URL saisie.",
        "Der Browser öffnet eine WebSocket-Verbindung zur eingegebenen URL.",
        "入力したURLにブラウザーがWebSocket接続を開きます。",
        "浏览器与输入的 URL 建立 WebSocket 连接。",
        "يفتح المتصفح اتصال WebSocket بعنوان URL المدخل."
    ],
    "WebSocket URL and subprotocols, messages you send, and browser-controlled handshake metadata": [
        "WebSocket URL और उपप्रोटोकॉल, भेजे संदेश और ब्राउज़र नियंत्रित हैंडशेक मेटाडेटा",
        "URL y subprotocolos WebSocket, mensajes enviados y metadatos de enlace controlados por el navegador",
        "URL et sous-protocoles WebSocket, messages envoyés et métadonnées de négociation du navigateur",
        "WebSocket-URL und Unterprotokolle, gesendete Nachrichten und browsergesteuerte Handshake-Metadaten",
        "WebSocketのURLとサブプロトコル、送信メッセージ、ブラウザー制御のハンドシェイク情報",
        "WebSocket URL 和子协议、发送的消息以及浏览器控制的握手元数据",
        "عنوان WebSocket وبروتوكولاته الفرعية والرسائل المرسلة وبيانات المصافحة التي يتحكم بها المتصفح"
    ],
    "The destination receives the connection and messages, including cookies the browser permits. Traffic does not pass through the app proxy; received messages remain in page memory.": [
        "लक्ष्य कनेक्शन और संदेश पाता है, ब्राउज़र की अनुमत कुकी सहित। ट्रैफ़िक ऐप प्रॉक्सी से नहीं जाता; मिले संदेश पेज मेमोरी में रहते हैं।",
        "El destino recibe conexión y mensajes, incluidas cookies permitidas. El tráfico no usa el proxy de la app; los mensajes recibidos quedan en memoria de página.",
        "La cible reçoit connexion et messages, cookies autorisés compris. Le trafic ne passe pas par le proxy ; les messages reçus restent en mémoire de page.",
        "Das Ziel erhält Verbindung und Nachrichten samt erlaubten Cookies. Der Verkehr läuft nicht über den App-Proxy; empfangene Nachrichten bleiben im Seitenspeicher.",
        "宛先は接続とメッセージ、許可されたCookieを受信します。アプリプロキシは経由せず、受信内容はページのメモリーに残ります。",
        "目标接收连接和消息，包括浏览器允许的 Cookie。流量不经过应用代理；收到的消息保留在页面内存中。",
        "يستلم الهدف الاتصال والرسائل وملفات الارتباط المسموحة. لا تمر الحركة عبر وكيل التطبيق وتبقى الرسائل المستلمة في ذاكرة الصفحة."
    ],
    "Model loading downloads assets from external hosts": [
        "मॉडल लोड बाहरी होस्ट से फ़ाइलें डाउनलोड करता है",
        "La carga del modelo descarga recursos de hosts externos",
        "Le chargement du modèle télécharge des ressources externes",
        "Modellladen lädt Ressourcen von externen Hosts herunter",
        "モデル読み込みは外部ホストから取得",
        "模型加载会从外部主机下载资源",
        "يحمل تحميل النموذج موارد من مضيفين خارجيين"
    ],
    "Semantic search downloads embedding model files from Hugging Face before computing embeddings in your browser. The inference runtime is bundled locally.": [
        "सिमैंटिक खोज ब्राउज़र में एम्बेडिंग निकालने से पहले Hugging Face से मॉडल फ़ाइलें डाउनलोड करती है। इंफ़रेंस रनटाइम स्थानीय बंडल में है।",
        "La búsqueda semántica descarga modelos de Hugging Face y calcula embeddings en el navegador. El entorno de inferencia está incluido localmente.",
        "La recherche sémantique télécharge le modèle depuis Hugging Face puis calcule les plongements dans le navigateur. Le moteur d’inférence est inclus localement.",
        "Die semantische Suche lädt Modelldateien von Hugging Face und berechnet Embeddings im Browser. Die Inferenzlaufzeit ist lokal gebündelt.",
        "Hugging Faceから埋め込みモデルを取得し、ブラウザーで埋め込みを計算します。推論ランタイムはローカルに同梱されています。",
        "语义搜索先从 Hugging Face 下载嵌入模型文件，再在浏览器中计算嵌入。推理运行时已本地打包。",
        "ينزل البحث الدلالي ملفات النموذج من Hugging Face ثم يحسب التضمينات في المتصفح. بيئة الاستدلال مرفقة محليًا."
    ],
    "Model asset requests with ordinary HTTP metadata; document text and search queries are not uploaded": [
        "मॉडल फ़ाइल अनुरोध और सामान्य HTTP मेटाडेटा; दस्तावेज़ पाठ और खोज क्वेरी अपलोड नहीं होते",
        "Solicitudes del modelo con metadatos HTTP habituales; no se cargan textos ni búsquedas",
        "Requêtes de modèle avec métadonnées HTTP habituelles ; documents et recherches ne sont pas envoyés",
        "Modellabrufe mit üblichen HTTP-Metadaten; Dokumenttext und Suchanfragen werden nicht hochgeladen",
        "通常のHTTP情報付きモデル取得要求。文書テキストと検索クエリーはアップロードしません",
        "模型资源请求及普通 HTTP 元数据；不会上传文档文本和搜索查询",
        "طلبات موارد النموذج مع بيانات HTTP المعتادة؛ لا يرفع نص المستندات أو استعلامات البحث"
    ],
    "Asset hosts receive download requests and may cache or log them. Documents, embeddings and search queries are processed locally in page memory.": [
        "फ़ाइल होस्ट डाउनलोड अनुरोध पाते हैं और कैश या लॉग कर सकते हैं। दस्तावेज़, एम्बेडिंग और खोज क्वेरी पेज मेमोरी में स्थानीय संसाधित होते हैं।",
        "Los hosts reciben descargas y pueden almacenarlas en caché o registrarlas. Documentos, embeddings y búsquedas se procesan localmente en memoria de página.",
        "Les hôtes reçoivent les demandes et peuvent les mettre en cache ou journaliser. Documents, plongements et recherches sont traités localement en mémoire de page.",
        "Ressourcenhosts erhalten Downloads und können sie zwischenspeichern oder protokollieren. Dokumente, Embeddings und Suchanfragen werden lokal im Seitenspeicher verarbeitet.",
        "取得先はダウンロード要求を受け、キャッシュ・記録する場合があります。文書・埋め込み・検索はページのメモリー内でローカル処理します。",
        "资源主机收到下载请求后可能缓存或记录。文档、嵌入和搜索查询仅在页面内存中本地处理。",
        "يستلم المضيفون طلبات التنزيل وقد يخزنونها أو يسجلونها. تعالج المستندات والتضمينات والبحث محليًا في ذاكرة الصفحة."
    ],
    "Agent requests can use your browser or the server proxy": [
        "एजेंट अनुरोध ब्राउज़र या सर्वर प्रॉक्सी उपयोग कर सकते हैं",
        "Las solicitudes al agente pueden usar navegador o proxy",
        "Les requêtes d’agent peuvent utiliser le navigateur ou le proxy",
        "Agentenanfragen können Browser oder Server-Proxy nutzen",
        "エージェント要求はブラウザーまたはプロキシ経由",
        "代理请求可使用浏览器或服务器代理",
        "يمكن لطلبات الوكيل استخدام المتصفح أو وكيل الخادم"
    ],
    "Discovery, messages and streams contact the configured agent. Proxy mode and CORS fallback use this deployment's server routes.": [
        "डिस्कवरी, संदेश और स्ट्रीम तय एजेंट से जुड़ते हैं। प्रॉक्सी मोड और CORS फ़ॉलबैक इस डिप्लॉयमेंट के सर्वर रूट उपयोग करते हैं।",
        "Descubrimiento, mensajes y flujos contactan al agente configurado. El proxy y la alternativa CORS usan las rutas de servidor de este despliegue.",
        "Découverte, messages et flux contactent l’agent configuré. Le proxy et le repli CORS utilisent les routes serveur de ce déploiement.",
        "Erkennung, Nachrichten und Streams kontaktieren den konfigurierten Agenten. Proxymodus und CORS-Fallback nutzen Serverrouten dieser Bereitstellung.",
        "検出・メッセージ・ストリームは設定したエージェントに接続します。プロキシとCORS代替はこのデプロイのサーバールートを使います。",
        "发现、消息和流会联系配置的代理。代理模式及 CORS 回退使用此部署的服务器路由。",
        "يتصل الاكتشاف والرسائل والبث بالوكيل المحدد. يستخدم وضع الوكيل وبديل CORS مسارات خادم هذا النشر."
    ],
    "Agent discovery URLs, message parts, task identifiers and stream requests": [
        "एजेंट डिस्कवरी URL, संदेश भाग, कार्य पहचानकर्ता और स्ट्रीम अनुरोध",
        "URL de descubrimiento, partes de mensajes, identificadores de tarea y solicitudes de flujo",
        "URL de découverte, parties de messages, identifiants de tâches et demandes de flux",
        "Agenten-Erkennungs-URLs, Nachrichtenteile, Aufgabenkennungen und Stream-Anfragen",
        "エージェント検出URL、メッセージ部分、タスクID、ストリーム要求",
        "代理发现 URL、消息部分、任务标识符和流请求",
        "عناوين اكتشاف الوكيل وأجزاء الرسائل ومعرفات المهام وطلبات البث"
    ],
    "SOAP requests can use your browser or the server proxy": [
        "SOAP अनुरोध ब्राउज़र या सर्वर प्रॉक्सी उपयोग कर सकते हैं",
        "Las solicitudes SOAP pueden usar navegador o proxy",
        "Les requêtes SOAP peuvent utiliser le navigateur ou le proxy",
        "SOAP-Anfragen können Browser oder Server-Proxy nutzen",
        "SOAP要求はブラウザーまたはプロキシ経由",
        "SOAP 请求可使用浏览器或服务器代理",
        "يمكن لطلبات SOAP استخدام المتصفح أو وكيل الخادم"
    ],
    "Sending a SOAP envelope contacts your service. Proxy mode or a CORS fallback passes the request through this deployment.": [
        "SOAP एन्वेलप भेजना आपकी सेवा से जुड़ता है। प्रॉक्सी मोड या CORS फ़ॉलबैक अनुरोध इस डिप्लॉयमेंट से भेजता है।",
        "Enviar SOAP contacta tu servicio. El proxy o la alternativa CORS pasa la solicitud por este despliegue.",
        "L’envoi d’une enveloppe SOAP contacte votre service. Le proxy ou le repli CORS passe par ce déploiement.",
        "Das Senden eines SOAP-Umschlags kontaktiert Ihren Dienst. Proxymodus oder CORS-Fallback leiten die Anfrage durch diese Bereitstellung.",
        "SOAPエンベロープ送信はサービスに接続します。プロキシまたはCORS代替はこのデプロイを経由します。",
        "发送 SOAP 信封会联系你的服务。代理模式或 CORS 回退会通过此部署传递请求。",
        "يرسل مظروف SOAP إلى خدمتك. يمر الطلب عبر هذا النشر في وضع الوكيل أو بديل CORS."
    ],
    "SOAPAction, XML envelope and configured TLS certificates or keys when proxying": [
        "प्रॉक्सी पर SOAPAction, XML एन्वेलप और तय TLS प्रमाणपत्र या कुंजियाँ",
        "SOAPAction, sobre XML y certificados o claves TLS configurados al usar proxy",
        "SOAPAction, enveloppe XML et certificats ou clés TLS configurés en mode proxy",
        "SOAPAction, XML-Umschlag und konfigurierte TLS-Zertifikate oder Schlüssel beim Proxybetrieb",
        "プロキシ時のSOAPAction、XMLエンベロープ、設定TLS証明書・キー",
        "使用代理时的 SOAPAction、XML 信封及配置的 TLS 证书或密钥",
        "SOAPAction ومظروف XML وشهادات أو مفاتيح TLS المعدة عند استخدام الوكيل"
    ],
    "URL loading can use your browser or the server proxy": [
        "URL लोड ब्राउज़र या सर्वर प्रॉक्सी उपयोग कर सकता है",
        "La carga de URL puede usar navegador o proxy",
        "Le chargement d’URL peut utiliser le navigateur ou le proxy",
        "URL-Laden kann Browser oder Server-Proxy nutzen",
        "URL読み込みはブラウザーまたはプロキシ経由",
        "URL 加载可使用浏览器或服务器代理",
        "يمكن لتحميل URL استخدام المتصفح أو وكيل الخادم"
    ],
    "Pasted and uploaded WSDL parsing is local. Loading a WSDL URL or explicitly loading an external schema contacts that server, with optional proxy fallback.": [
        "चिपकाए या अपलोड WSDL का पार्स स्थानीय है। WSDL URL या स्पष्ट बाहरी स्कीमा लोड सर्वर से जुड़ता है; प्रॉक्सी फ़ॉलबैक वैकल्पिक है।",
        "El WSDL pegado o cargado se analiza localmente. Cargar una URL WSDL o un esquema externo explícitamente contacta ese servidor, con proxy opcional.",
        "Le WSDL collé ou importé est analysé localement. Charger une URL WSDL ou explicitement un schéma externe contacte ce serveur, avec repli proxy facultatif.",
        "Eingefügtes oder hochgeladenes WSDL wird lokal geparst. WSDL-URL oder ausdrücklich externes Schema laden kontaktiert dessen Server, mit optionalem Proxy-Fallback.",
        "貼り付け・アップロードしたWSDLはローカル解析です。WSDLのURLや外部スキーマを明示的に読み込むと相手サーバーに接続し、任意のプロキシ代替を使います。",
        "粘贴或上传的 WSDL 在本地解析。加载 WSDL URL 或明确加载外部结构时会联系对应服务器，并可选使用代理回退。",
        "يحلل WSDL الملصق أو المرفوع محليًا. يتصل تحميل URL أو تحميل مخطط خارجي صراحة بخادمه مع بديل وكيل اختياري."
    ],
    "WSDL and imported schema URLs, configured request headers and credentials": [
        "WSDL और आयातित स्कीमा URL, तय अनुरोध हेडर और क्रेडेंशियल",
        "URL WSDL y esquemas importados, cabeceras y credenciales configuradas",
        "URL WSDL et schémas importés, en-têtes et identifiants configurés",
        "WSDL- und importierte Schema-URLs, konfigurierte Anfrage-Header und Zugangsdaten",
        "WSDL・取り込みスキーマのURL、設定リクエストヘッダー・認証情報",
        "WSDL 和导入结构的 URL、配置的请求标头和凭据",
        "عناوين WSDL والمخططات المستوردة وترويسات الطلب وبيانات الاعتماد المعدة"
    ],
    "CORS tests send requests directly to your target": [
        "CORS परीक्षण सीधे लक्ष्य को अनुरोध भेजते हैं",
        "Las pruebas CORS envían solicitudes directas al destino",
        "Les tests CORS envoient les requêtes directement à la cible",
        "CORS-Tests senden Anfragen direkt an Ihr Ziel",
        "CORSテストは宛先に直接要求を送信",
        "CORS 测试直接向目标发送请求",
        "ترسل اختبارات CORS الطلبات مباشرة إلى هدفك"
    ],
    "The browser sends the configured request so you can inspect the response and browser CORS behavior.": [
        "प्रतिक्रिया और ब्राउज़र CORS व्यवहार जाँचने के लिए ब्राउज़र तय अनुरोध भेजता है।",
        "El navegador envía la solicitud configurada para revisar respuesta y comportamiento CORS.",
        "Le navigateur envoie la requête configurée pour examiner la réponse et son comportement CORS.",
        "Der Browser sendet die konfigurierte Anfrage, damit Sie Antwort und CORS-Verhalten prüfen können.",
        "ブラウザーが設定した要求を送信し、応答とCORSの挙動を確認できます。",
        "浏览器发送配置的请求，以便检查响应和浏览器 CORS 行为。",
        "يرسل المتصفح الطلب المعد لفحص الاستجابة وسلوك CORS."
    ],
    "Browser-controlled Origin and preflight headers; same-origin cookies permitted by browser defaults": [
        "ब्राउज़र नियंत्रित Origin और प्रीफ़्लाइट हेडर; डिफ़ॉल्ट से अनुमत समान-मूल कुकी",
        "Origin y cabeceras previas controladas por el navegador; cookies del mismo origen permitidas por defecto",
        "Origin et en-têtes de pré-vérification du navigateur ; cookies de même origine autorisés par défaut",
        "Browsergesteuerte Origin- und Preflight-Header; standardmäßig erlaubte gleichursprüngliche Cookies",
        "ブラウザー制御のOriginとプリフライトヘッダー、既定で許可される同一オリジンCookie",
        "浏览器控制的 Origin 和预检标头；浏览器默认允许的同源 Cookie",
        "ترويسات Origin والفحص المسبق التي يتحكم بها المتصفح وملفات ارتباط الأصل نفسه المسموحة افتراضيًا"
    ],
    "The target may receive a preflight or actual request even when browser CORS rules prevent this page from reading a response. This test does not use the app server proxy.": [
        "ब्राउज़र CORS नियम पेज को प्रतिक्रिया पढ़ने से रोकें तब भी लक्ष्य प्रीफ़्लाइट या असली अनुरोध पा सकता है। परीक्षण ऐप सर्वर प्रॉक्सी उपयोग नहीं करता।",
        "El destino puede recibir una solicitud previa o real aunque CORS impida leer la respuesta. La prueba no usa el proxy de la app.",
        "La cible peut recevoir une pré-vérification ou une vraie requête même si CORS empêche de lire la réponse. Le test n’utilise pas le proxy de l’app.",
        "Das Ziel kann eine Preflight- oder eigentliche Anfrage erhalten, auch wenn CORS das Lesen verhindert. Dieser Test nutzt keinen App-Server-Proxy.",
        "CORSで応答を読めなくても、宛先にプリフライトや実際の要求が届く場合があります。このテストはアプリのサーバープロキシを使いません。",
        "即使 CORS 规则阻止页面读取响应，目标仍可能收到预检或实际请求。此测试不使用应用服务器代理。",
        "قد يتلقى الهدف طلب فحص مسبق أو طلبًا فعليًا حتى لو منع CORS قراءة الاستجابة. لا يستخدم الاختبار وكيل خادم التطبيق."
    ],
    "API execution can send requests from your browser": [
        "API निष्पादन ब्राउज़र से अनुरोध भेज सकता है",
        "La ejecución API puede enviar solicitudes desde el navegador",
        "L’exécution API peut envoyer des requêtes du navigateur",
        "API-Ausführung kann Anfragen aus Ihrem Browser senden",
        "API実行はブラウザーから要求を送信する場合あり",
        "API 执行可从浏览器发送请求",
        "قد يرسل تنفيذ API طلبات من المتصفح"
    ],
    "Parsing a pasted or uploaded specification is local. Swagger UI can contact API servers when you use its request controls.": [
        "चिपकाई या अपलोड की स्पेसिफ़िकेशन पार्सिंग स्थानीय है। अनुरोध नियंत्रण उपयोग करने पर Swagger UI API सर्वर से जुड़ सकता है।",
        "La especificación pegada o cargada se analiza localmente. Swagger UI puede contactar servidores API al usar sus controles de solicitud.",
        "La spécification collée ou importée est analysée localement. Swagger UI peut contacter les serveurs API via ses commandes de requête.",
        "Eingefügte oder hochgeladene Spezifikationen werden lokal geparst. Swagger UI kann über seine Anfragefunktionen API-Server kontaktieren.",
        "貼り付け・アップロードした仕様はローカル解析です。Swagger UIの要求操作を使うとAPIサーバーに接続する場合があります。",
        "粘贴或上传的规范在本地解析。使用请求控件时，Swagger UI 可以联系 API 服务器。",
        "يحلل الوصف الملصق أو المرفوع محليًا. قد تتصل Swagger UI بخوادم API عند استخدام عناصر الطلب."
    ],
    "API server URL, operation parameters, authorization values, headers and request body you configure": [
        "आपके तय API सर्वर URL, क्रिया पैरामीटर, प्राधिकरण मान, हेडर और अनुरोध बॉडी",
        "URL API, parámetros, autorización, cabeceras y cuerpo que configures",
        "URL API, paramètres, autorisation, en-têtes et corps de requête configurés",
        "Konfigurierte API-Server-URL, Operationsparameter, Autorisierungswerte, Header und Body",
        "設定したAPIサーバーURL、操作パラメーター、認可値、ヘッダー、本文",
        "配置的 API 服务器 URL、操作参数、授权值、标头和请求正文",
        "عنوان خادم API ومعاملات العملية وقيم التفويض والترويسات ونص الطلب التي تعدها"
    ],
    "API servers receive requests under their own policies. Third-party Swagger UI may also resolve external specification references. Review the specification and destination before executing requests.": [
        "API सर्वर अपनी नीतियों के तहत अनुरोध पाते हैं। तृतीय-पक्ष Swagger UI बाहरी स्पेसिफ़िकेशन संदर्भ भी लोड कर सकता है। चलाने से पहले स्पेसिफ़िकेशन और लक्ष्य जाँचें।",
        "Los servidores API reciben solicitudes según sus políticas. Swagger UI también puede resolver referencias externas. Revisa especificación y destino antes de ejecutar.",
        "Les serveurs API reçoivent les requêtes selon leurs règles. Swagger UI peut aussi résoudre des références externes. Vérifiez spécification et cible avant exécution.",
        "API-Server erhalten Anfragen gemäß eigenen Richtlinien. Swagger UI kann externe Spezifikationsverweise auflösen. Spezifikation und Ziel vor dem Ausführen prüfen.",
        "APIサーバーは独自方針で要求を受信します。Swagger UIが外部仕様参照を取得する場合もあります。実行前に仕様と宛先を確認してください。",
        "API 服务器按各自政策接收请求。第三方 Swagger UI 也可能解析外部规范引用。执行请求前请检查规范和目标。",
        "تستلم خوادم API الطلبات وفق سياساتها. قد تحل Swagger UI مراجع خارجية أيضًا. راجع الوصف والهدف قبل تنفيذ الطلبات."
    ],
    "Data sent:": [
        "भेजा जाने वाला डेटा:",
        "Datos enviados:",
        "Données envoyées :",
        "Gesendete Daten:",
        "送信データ:",
        "发送的数据：",
        "البيانات المرسلة:"
    ],
    "Network features · view data disclosure": [
        "नेटवर्क सुविधाएँ · डेटा विवरण देखें",
        "Funciones de red · ver datos enviados",
        "Fonctions réseau · voir les données transmises",
        "Netzwerkfunktionen · Datenoffenlegung ansehen",
        "ネットワーク機能・送信データを確認",
        "网络功能 · 查看数据披露",
        "ميزات الشبكة · عرض تفاصيل البيانات"
    ],
    "Build PKCS#12 files from PEM and prepare Java keytool commands for JKS workflows": [
        "PEM से PKCS#12 फ़ाइलें बनाएँ और JKS कार्य के लिए Java keytool कमांड तैयार करें",
        "Crea archivos PKCS#12 desde PEM y prepara comandos Java keytool para flujos JKS",
        "Créez des fichiers PKCS#12 depuis PEM et préparez des commandes Java keytool pour JKS",
        "PKCS#12-Dateien aus PEM erstellen und Java-keytool-Befehle für JKS vorbereiten",
        "PEMからPKCS#12を作成し、JKS用のJava keytoolコマンドを準備",
        "从 PEM 构建 PKCS#12 文件，并为 JKS 工作流准备 Java keytool 命令",
        "أنشئ ملفات PKCS#12 من PEM وجهز أوامر Java keytool لمسارات JKS"
    ]
};
