import type { TranslationColumns } from "./tool-names";

// Hindi, Spanish, French, German, Japanese, Simplified Chinese, Arabic.
// User questions, wheel labels and fixed English typing passages are opaque practice data.
export const FUN_TOOL_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Heads": [
        "चित",
        "Cara",
        "Face",
        "Kopf",
        "表",
        "正面",
        "وجه"
    ],
    "Tails": [
        "पट",
        "Cruz",
        "Pile",
        "Zahl",
        "裏",
        "反面",
        "ظهر"
    ],
    "Flip a fair virtual coin — heads or tails": [
        "निष्पक्ष आभासी सिक्का उछालें — चित या पट",
        "Lanza una moneda virtual: cara o cruz",
        "Lancez une pièce virtuelle équilibrée : pile ou face",
        "Virtuelle faire Münze werfen: Kopf oder Zahl",
        "公平な仮想コインを投げる：表か裏",
        "抛一枚公平的虚拟硬币：正面或反面",
        "ارمِ عملة افتراضية عادلة: وجه أو ظهر"
    ],
    "A virtual coin toss for quick choices and probability experiments. Outcomes use the browser’s Math.random; this is not a security or gambling tool.": [
        "त्वरित निर्णय और प्रायिकता प्रयोगों के लिए आभासी सिक्का। परिणाम ब्राउज़र के Math.random से बनते हैं; यह सुरक्षा या जुए का उपकरण नहीं है।",
        "Moneda virtual para decisiones rápidas y experimentos de probabilidad. Usa Math.random del navegador; no es una herramienta de seguridad ni de apuestas.",
        "Une pièce virtuelle pour des choix rapides et des expériences de probabilité. Elle utilise Math.random du navigateur ; pas un outil de sécurité ni de jeu d’argent.",
        "Virtueller Münzwurf für schnelle Entscheidungen und Wahrscheinlichkeitsexperimente. Verwendet Math.random des Browsers; kein Sicherheits- oder Glücksspielwerkzeug.",
        "素早い選択や確率実験向けの仮想コインです。ブラウザーのMath.randomを使用し、セキュリティや賭博用ではありません。",
        "用于快速选择和概率实验的虚拟硬币。结果使用浏览器的 Math.random；不适用于安全或赌博用途。",
        "عملة افتراضية للقرارات السريعة وتجارب الاحتمالات. تستخدم Math.random في المتصفح؛ ليست أداة للأمان أو المقامرة."
    ],
    "Flip once, or enable auto flip with a delay and a total-session flip limit.": [
        "एक बार उछालें या विलंब और पूरे सत्र की अधिकतम संख्या के साथ स्वतः उछाल चालू करें।",
        "Lanza una vez o activa lanzamientos automáticos con pausa y un límite total por sesión.",
        "Lancez une fois ou activez le mode automatique avec un délai et une limite totale par session.",
        "Einmal werfen oder automatische Würfe mit Pause und Gesamtlimit pro Sitzung aktivieren.",
        "1回投げるか、間隔とセッション全体の上限を指定して自動投げを有効にします。",
        "投掷一次，或设置间隔和本次会话的总次数上限后开启自动投掷。",
        "ارمِ مرة أو فعّل الرمي التلقائي مع فاصل وحد إجمالي للجلسة."
    ],
    "Heads and tails counters, percentages and recent results stay in this tab until reset or reload.": [
        "चित-पट की गिनती, प्रतिशत और हाल के परिणाम रीसेट या पुनः लोड तक इस टैब में रहते हैं।",
        "Los contadores, porcentajes y resultados recientes permanecen en esta pestaña hasta restablecer o recargar.",
        "Compteurs, pourcentages et résultats récents restent dans cet onglet jusqu’à la remise à zéro ou au rechargement.",
        "Zähler, Prozentsätze und letzte Ergebnisse bleiben bis zum Zurücksetzen oder Neuladen in diesem Tab.",
        "表裏の回数、割合、最近の結果はリセットまたは再読み込みまでこのタブに残ります。",
        "正反面次数、百分比和最近结果会保留在此标签页中，直到重置或重新加载。",
        "تبقى العدادات والنسب والنتائج الأخيرة في هذا التبويب حتى إعادة الضبط أو التحميل."
    ],
    "Flipping…": [
        "उछल रहा है…",
        "Lanzando…",
        "Lancement…",
        "Wird geworfen…",
        "投げています…",
        "投掷中…",
        "جارٍ الرمي…"
    ],
    "Press flip to toss the coin": [
        "सिक्का उछालने के लिए दबाएं",
        "Pulsa para lanzar la moneda",
        "Appuyez pour lancer la pièce",
        "Zum Münzwurf drücken",
        "ボタンでコインを投げます",
        "点击按钮抛硬币",
        "اضغط لرمي العملة"
    ],
    "Flip Coin": [
        "सिक्का उछालें",
        "Lanzar moneda",
        "Lancer la pièce",
        "Münze werfen",
        "コインを投げる",
        "抛硬币",
        "رمي العملة"
    ],
    "Auto flip": [
        "स्वतः उछाल",
        "Lanzamiento automático",
        "Lancement automatique",
        "Automatisch werfen",
        "自動投げ",
        "自动投掷",
        "رمي تلقائي"
    ],
    "{count} / {limit} flips": [
        "{count} / {limit} उछाल",
        "{count} / {limit} lanzamientos",
        "{count} / {limit} lancers",
        "{count} / {limit} Würfe",
        "{count} / {limit}回",
        "{count} / {limit} 次投掷",
        "{count} / {limit} رميات"
    ],
    "{count} flips": [
        "{count} उछाल",
        "{count} lanzamientos",
        "{count} lancers",
        "{count} Würfe",
        "{count}回",
        "{count} 次投掷",
        "{count} رميات"
    ],
    "Interval (sec)": [
        "अंतराल (सेकंड)",
        "Intervalo (s)",
        "Intervalle (s)",
        "Intervall (Sek.)",
        "間隔（秒）",
        "间隔（秒）",
        "الفاصل (ثانية)"
    ],
    "Max flips (0 = ∞)": [
        "अधिकतम उछाल (0 = ∞)",
        "Máximo de lanzamientos (0 = ∞)",
        "Lancers maximum (0 = ∞)",
        "Maximale Würfe (0 = ∞)",
        "上限回数（0 = ∞）",
        "最大次数（0 = ∞）",
        "أقصى الرميات (0 = ∞)"
    ],
    "{count} flips total": [
        "कुल {count} उछाल",
        "{count} lanzamientos en total",
        "{count} lancers au total",
        "Insgesamt {count} Würfe",
        "合計{count}回",
        "共 {count} 次投掷",
        "إجمالي {count} رميات"
    ],
    "Clear All": [
        "सभी साफ़ करें",
        "Borrar todo",
        "Tout effacer",
        "Alles löschen",
        "すべて消去",
        "全部清除",
        "مسح الكل"
    ],
    "Recent flips": [
        "हाल के उछाल",
        "Lanzamientos recientes",
        "Lancers récents",
        "Letzte Würfe",
        "最近の結果",
        "最近投掷",
        "الرميات الأخيرة"
    ],
    "Reset": [
        "रीसेट",
        "Restablecer",
        "Réinitialiser",
        "Zurücksetzen",
        "リセット",
        "重置",
        "إعادة الضبط"
    ],
    "Roll any polyhedral dice — d4, d6, d8, d10, d12, d20": [
        "बहुफलकीय पासे फेंकें — d4, d6, d8, d10, d12, d20",
        "Lanza dados poliédricos: d4, d6, d8, d10, d12, d20",
        "Lancez des dés polyédriques : d4, d6, d8, d10, d12, d20",
        "Polyederwürfel werfen: d4, d6, d8, d10, d12, d20",
        "多面体サイコロを振る：d4、d6、d8、d10、d12、d20",
        "掷多面骰子：d4、d6、d8、d10、d12、d20",
        "ارمِ نردًا متعدد الأوجه: d4 وd6 وd8 وd10 وd12 وd20"
    ],
    "Roll d4, d6, d8, d10, d12 or d20 dice locally. Advantage keeps the higher of two rolls; disadvantage keeps the lower.": [
        "स्थानीय रूप से d4, d6, d8, d10, d12 या d20 फेंकें। लाभ में दो में बड़ा और हानि में छोटा परिणाम लिया जाता है।",
        "Lanza d4, d6, d8, d10, d12 o d20 localmente. Ventaja conserva el mayor de dos; desventaja el menor.",
        "Lancez localement des d4, d6, d8, d10, d12 ou d20. Avantage garde le plus grand de deux résultats ; désavantage le plus petit.",
        "d4, d6, d8, d10, d12 oder d20 lokal werfen. Vorteil behält den höheren von zwei Würfen, Nachteil den niedrigeren.",
        "d4、d6、d8、d10、d12、d20をローカルで振ります。有利では2個の大きい方、不利では小さい方を採用します。",
        "在本地掷 d4、d6、d8、d10、d12 或 d20。优势模式取两次中的较大值，劣势模式取较小值。",
        "ارمِ d4 أو d6 أو d8 أو d10 أو d12 أو d20 محليًا. الأفضلية تحتفظ بالأعلى من رميتين، والحرمان بالأدنى."
    ],
    "Choose dice, count and mode, then roll. Configuration is locked during the animation.": [
        "पासे, संख्या और मोड चुनकर फेंकें। एनीमेशन के दौरान विकल्प बंद रहते हैं।",
        "Elige dados, cantidad y modo y lanza. La configuración se bloquea durante la animación.",
        "Choisissez les dés, le nombre et le mode, puis lancez. Les réglages sont bloqués pendant l’animation.",
        "Würfel, Anzahl und Modus wählen und werfen. Einstellungen sind während der Animation gesperrt.",
        "種類、個数、モードを選んで振ります。アニメーション中は設定を変更できません。",
        "选择骰子、数量和模式后投掷。动画期间锁定设置。",
        "اختر النرد والعدد والوضع ثم ارمِ. تُقفل الإعدادات أثناء الحركة."
    ],
    "Results use Math.random, not a cryptographic generator. History keeps the last 20 rolls in this tab.": [
        "परिणाम Math.random से बनते हैं, क्रिप्टोग्राफ़िक जनरेटर से नहीं। इस टैब में पिछले 20 फेंक रखे जाते हैं।",
        "Los resultados usan Math.random, no un generador criptográfico. Se guardan los últimos 20 lanzamientos en esta pestaña.",
        "Les résultats utilisent Math.random, pas un générateur cryptographique. Cet onglet conserve les 20 derniers lancers.",
        "Ergebnisse verwenden Math.random, keinen kryptografischen Generator. Die letzten 20 Würfe bleiben in diesem Tab.",
        "暗号学的生成器ではなくMath.randomを使用します。このタブに直近20回を記録します。",
        "结果使用 Math.random，并非密码学随机生成器。此标签页保留最近 20 次投掷。",
        "تستخدم النتائج Math.random وليست مولّدًا تشفيريًا. تُحفظ آخر 20 رمية في هذا التبويب."
    ],
    "Die type": [
        "पासे का प्रकार",
        "Tipo de dado",
        "Type de dé",
        "Würfeltyp",
        "サイコロの種類",
        "骰子类型",
        "نوع النرد"
    ],
    "Mode": [
        "मोड",
        "Modo",
        "Mode",
        "Modus",
        "モード",
        "模式",
        "الوضع"
    ],
    "Advantage ↑": [
        "लाभ ↑",
        "Ventaja ↑",
        "Avantage ↑",
        "Vorteil ↑",
        "有利 ↑",
        "优势 ↑",
        "أفضلية ↑"
    ],
    "Disadvantage ↓": [
        "हानि ↓",
        "Desventaja ↓",
        "Désavantage ↓",
        "Nachteil ↓",
        "不利 ↓",
        "劣势 ↓",
        "حرمان ↓"
    ],
    "Press Roll to throw {count}d{sides}": [
        "{count}d{sides} फेंकने के लिए दबाएं",
        "Pulsa para lanzar {count}d{sides}",
        "Appuyez pour lancer {count}d{sides}",
        "Drücken, um {count}d{sides} zu werfen",
        "ボタンで{count}d{sides}を振ります",
        "点击以投掷 {count}d{sides}",
        "اضغط لرمي {count}d{sides}"
    ],
    "⚡ Critical Hit!": [
        "⚡ अधिकतम परिणाम!",
        "⚡ ¡Resultado máximo!",
        "⚡ Résultat maximal !",
        "⚡ Höchstwert!",
        "⚡ 最大値！",
        "⚡ 最大值！",
        "⚡ النتيجة القصوى!"
    ],
    "Critical Fail": [
        "न्यूनतम परिणाम",
        "Resultado mínimo",
        "Résultat minimal",
        "Mindestwert",
        "最小値",
        "最小值",
        "النتيجة الدنيا"
    ],
    "Rolling…": [
        "फेंक रहे हैं…",
        "Lanzando…",
        "Lancement…",
        "Würfelt…",
        "振っています…",
        "投掷中…",
        "جارٍ الرمي…"
    ],
    "Roll {count}d{sides}": [
        "{count}d{sides} फेंकें",
        "Lanzar {count}d{sides}",
        "Lancer {count}d{sides}",
        "{count}d{sides} werfen",
        "{count}d{sides}を振る",
        "投掷 {count}d{sides}",
        "رمي {count}d{sides}"
    ],
    "Roll History": [
        "फेंक का इतिहास",
        "Historial de lanzamientos",
        "Historique des lancers",
        "Wurfverlauf",
        "履歴",
        "投掷历史",
        "سجل الرميات"
    ],
    "No rolls yet": [
        "अभी कोई फेंक नहीं",
        "Aún no hay lanzamientos",
        "Aucun lancer",
        "Noch keine Würfe",
        "まだ振っていません",
        "尚无投掷",
        "لا توجد رميات بعد"
    ],
    "Advantage": [
        "लाभ",
        "Ventaja",
        "Avantage",
        "Vorteil",
        "有利",
        "优势",
        "أفضلية"
    ],
    "Disadvantage": [
        "हानि",
        "Desventaja",
        "Désavantage",
        "Nachteil",
        "不利",
        "劣势",
        "حرمان"
    ],
    "{count} dice": [
        "{count} पासे",
        "{count} dados",
        "{count} dés",
        "{count} Würfel",
        "{count}個",
        "{count} 个骰子",
        "{count} نرد"
    ],
    "1 min": [
        "1 मिनट",
        "1 min",
        "1 min",
        "1 Min.",
        "1分",
        "1 分钟",
        "دقيقة واحدة"
    ],
    "5 min": [
        "5 मिनट",
        "5 min",
        "5 min",
        "5 Min.",
        "5分",
        "5 分钟",
        "5 دقائق"
    ],
    "10 min": [
        "10 मिनट",
        "10 min",
        "10 min",
        "10 Min.",
        "10分",
        "10 分钟",
        "10 دقائق"
    ],
    "15 min": [
        "15 मिनट",
        "15 min",
        "15 min",
        "15 Min.",
        "15分",
        "15 分钟",
        "15 دقيقة"
    ],
    "25 min": [
        "25 मिनट",
        "25 min",
        "25 min",
        "25 Min.",
        "25分",
        "25 分钟",
        "25 دقيقة"
    ],
    "30 min": [
        "30 मिनट",
        "30 min",
        "30 min",
        "30 Min.",
        "30分",
        "30 分钟",
        "30 دقيقة"
    ],
    "1 hr": [
        "1 घंटा",
        "1 h",
        "1 h",
        "1 Std.",
        "1時間",
        "1 小时",
        "ساعة واحدة"
    ],
    "Countdown timer with presets, custom duration, and audio chime — runs entirely in your browser": [
        "प्रीसेट, कस्टम अवधि और ध्वनि वाला काउंटडाउन — पूरी तरह ब्राउज़र में",
        "Cuenta atrás con preajustes, duración personalizada y sonido, en tu navegador",
        "Compte à rebours avec préréglages, durée personnalisée et son, dans votre navigateur",
        "Countdown mit Vorgaben, eigener Dauer und Signalton, vollständig im Browser",
        "プリセット、任意の時間、チャイム付きのブラウザー内カウントダウン",
        "支持预设、自定义时长和提示音的浏览器倒计时",
        "عد تنازلي بإعدادات مسبقة ومدة مخصصة وتنبيه صوتي داخل المتصفح"
    ],
    "A local countdown with presets, a custom duration and an optional label. Remaining time is calculated from a deadline rather than counting callbacks.": [
        "प्रीसेट, कस्टम अवधि और वैकल्पिक नाम वाला स्थानीय काउंटडाउन। बचा समय कॉलबैक गिनने के बजाय अंतिम समय से निकलता है।",
        "Cuenta atrás local con preajustes, duración y nombre opcional. El tiempo restante se calcula desde una fecha límite, no contando callbacks.",
        "Compte à rebours local avec préréglages, durée et nom facultatif. Le temps restant est calculé depuis une échéance, sans compter les rappels.",
        "Lokaler Countdown mit Vorgaben, eigener Dauer und optionalem Namen. Restzeit wird anhand einer Frist statt durch Callback-Zählung berechnet.",
        "プリセット、任意の時間、名前を設定できるローカルタイマーです。残り時間はコールバックの回数ではなく終了時刻から計算します。",
        "本地倒计时，支持预设、自定义时长和可选名称。剩余时间按截止时刻计算，而非累加回调次数。",
        "عد تنازلي محلي بمدد مسبقة ومدة مخصصة واسم اختياري. يُحسب الوقت المتبقي من موعد النهاية لا من عدد الاستدعاءات."
    ],
    "Choose a preset or enter hours, minutes and seconds, apply the duration, then start. Pause, resume or reset as needed.": [
        "प्रीसेट चुनें या घंटे, मिनट, सेकंड भरकर लागू करें और शुरू करें। ज़रूरत पर रोकें, जारी रखें या रीसेट करें।",
        "Elige un preajuste o indica horas, minutos y segundos, aplica y comienza. Pausa, reanuda o restablece cuando quieras.",
        "Choisissez un préréglage ou saisissez heures, minutes et secondes, appliquez puis démarrez. Mettez en pause, reprenez ou réinitialisez.",
        "Vorgabe wählen oder Stunden, Minuten und Sekunden eingeben, anwenden und starten. Nach Bedarf pausieren, fortsetzen oder zurücksetzen.",
        "プリセットを選ぶか時・分・秒を入力して適用し、開始します。一時停止、再開、リセットが可能です。",
        "选择预设或输入时、分、秒，应用时长后开始。可按需暂停、继续或重置。",
        "اختر مدة مسبقة أو أدخل الساعات والدقائق والثواني ثم طبّق وابدأ. أوقف مؤقتًا أو استأنف أو أعد الضبط عند الحاجة."
    ],
    "Background tabs and device sleep can delay the completion chime. Browser audio policies may block sound. Reloading clears the timer.": [
        "पृष्ठभूमि टैब या डिवाइस की नींद से घंटी देर से बज सकती है। ब्राउज़र की ऑडियो नीति ध्वनि रोक सकती है। पुनः लोड से टाइमर मिट जाता है।",
        "Las pestañas en segundo plano y el reposo pueden retrasar el sonido. El navegador puede bloquear el audio. Recargar borra el temporizador.",
        "Les onglets en arrière-plan et la veille peuvent retarder le son. Le navigateur peut bloquer l’audio. Recharger efface le minuteur.",
        "Hintergrund-Tabs und Geräteschlaf können den Signalton verzögern. Browserregeln können Ton blockieren. Neuladen löscht den Timer.",
        "バックグラウンドタブやスリープでチャイムが遅れる場合があります。ブラウザーの制限で音が出ない場合もあります。再読み込みでリセットされます。",
        "后台标签页和设备休眠可能延迟提示音。浏览器音频策略可能阻止声音。重新加载会清除计时器。",
        "قد تؤخر التبويبات الخلفية وسكون الجهاز التنبيه. وقد تمنع سياسة المتصفح الصوت. إعادة التحميل تمسح المؤقت."
    ],
    "Session {number}": [
        "सत्र {number}",
        "Sesión {number}",
        "Session {number}",
        "Sitzung {number}",
        "セッション{number}",
        "第 {number} 次",
        "الجلسة {number}"
    ],
    "Time’s up!": [
        "समय पूरा!",
        "¡Se acabó el tiempo!",
        "Temps écoulé !",
        "Zeit abgelaufen!",
        "時間です！",
        "时间到！",
        "انتهى الوقت!"
    ],
    "{count} sessions done": [
        "{count} सत्र पूरे",
        "{count} sesiones completadas",
        "{count} sessions terminées",
        "{count} Sitzungen abgeschlossen",
        "{count}セッション完了",
        "已完成 {count} 次",
        "اكتملت {count} جلسات"
    ],
    "Reset to start": [
        "शुरू करने के लिए रीसेट करें",
        "Restablece para comenzar",
        "Réinitialisez pour démarrer",
        "Zum Starten zurücksetzen",
        "リセットして開始",
        "重置后开始",
        "أعد الضبط للبدء"
    ],
    "Start": [
        "शुरू",
        "Iniciar",
        "Démarrer",
        "Starten",
        "開始",
        "开始",
        "بدء"
    ],
    "Pause": [
        "रोकें",
        "Pausar",
        "Pause",
        "Pausieren",
        "一時停止",
        "暂停",
        "إيقاف مؤقت"
    ],
    "Custom Duration": [
        "कस्टम अवधि",
        "Duración personalizada",
        "Durée personnalisée",
        "Eigene Dauer",
        "任意の時間",
        "自定义时长",
        "مدة مخصصة"
    ],
    "Hours": [
        "घंटे",
        "Horas",
        "Heures",
        "Stunden",
        "時",
        "小时",
        "ساعات"
    ],
    "Minutes": [
        "मिनट",
        "Minutos",
        "Minutes",
        "Minuten",
        "分",
        "分钟",
        "دقائق"
    ],
    "Seconds": [
        "सेकंड",
        "Segundos",
        "Secondes",
        "Sekunden",
        "秒",
        "秒",
        "ثوانٍ"
    ],
    "Timer Label": [
        "टाइमर का नाम",
        "Nombre del temporizador",
        "Nom du minuteur",
        "Timername",
        "タイマー名",
        "计时器名称",
        "اسم المؤقت"
    ],
    "e.g. \"Pomodoro\", \"Break\", \"Presentation\"": [
        "जैसे \"पोमोडोरो\", \"विराम\", \"प्रस्तुति\"",
        "p. ej., \"Pomodoro\", \"Descanso\", \"Presentación\"",
        "Ex. « Pomodoro », « Pause », « Présentation »",
        "z. B. „Pomodoro“, „Pause“, „Präsentation“",
        "例：「ポモドーロ」「休憩」「発表」",
        "例如“番茄钟”“休息”“演示”",
        "مثل «بومودورو» أو «استراحة» أو «عرض»"
    ],
    "Timer running — audio chime plays on completion": [
        "टाइमर चल रहा है — पूरा होने पर घंटी बजेगी",
        "Temporizador en marcha: sonará al terminar",
        "Minuteur en cours : son à la fin",
        "Timer läuft: Signalton bei Abschluss",
        "タイマー実行中：完了時にチャイム",
        "计时中：完成时播放提示音",
        "المؤقت يعمل: تنبيه صوتي عند الاكتمال"
    ],
    "Lap Time": [
        "लैप समय",
        "Tiempo de vuelta",
        "Temps au tour",
        "Rundenzeit",
        "ラップタイム",
        "圈时",
        "زمن اللفة"
    ],
    "Split": [
        "कुल समय",
        "Tiempo acumulado",
        "Temps cumulé",
        "Zwischenzeit",
        "スプリット",
        "累计时间",
        "الزمن التراكمي"
    ],
    "Best": [
        "सर्वश्रेष्ठ",
        "Mejor",
        "Meilleur",
        "Beste",
        "最速",
        "最佳",
        "الأفضل"
    ],
    "Worst": [
        "सबसे धीमा",
        "Peor",
        "Moins bon",
        "Langsamste",
        "最遅",
        "最慢",
        "الأبطأ"
    ],
    "High-precision stopwatch with lap splits": [
        "लैप समय वाला सटीक स्टॉपवॉच",
        "Cronómetro de precisión con vueltas",
        "Chronomètre de précision avec tours",
        "Präzise Stoppuhr mit Rundenzeiten",
        "ラップ機能付きストップウォッチ",
        "支持圈时的精确秒表",
        "ساعة إيقاف دقيقة مع أزمنة اللفات"
    ],
    "A browser stopwatch with lap and cumulative split times, displayed to hundredths of a second. Browser scheduling affects display updates.": [
        "ब्राउज़र स्टॉपवॉच जो लैप और कुल समय सेकंड के सौवें हिस्से तक दिखाता है। ब्राउज़र शेड्यूलिंग से दृश्य अपडेट प्रभावित होते हैं।",
        "Cronómetro con vueltas y tiempos acumulados en centésimas de segundo. La planificación del navegador afecta las actualizaciones.",
        "Chronomètre avec tours et temps cumulés affichés au centième de seconde. Le navigateur peut retarder l’affichage.",
        "Browser-Stoppuhr mit Runden- und Zwischenzeiten in Hundertstelsekunden. Die Browserplanung beeinflusst die Anzeigeaktualisierung.",
        "ラップと累積時間を100分の1秒単位で表示します。表示の更新はブラウザーのスケジュールに影響されます。",
        "显示到百分之一秒的浏览器秒表，支持圈时和累计时间。浏览器调度会影响显示刷新。",
        "ساعة إيقاف تعرض أزمنة اللفات والتراكم بأجزاء المئة من الثانية. تؤثر جدولة المتصفح في تحديث العرض."
    ],
    "Start, record laps, pause and resume. Pause before resetting; clearing laps keeps the stopwatch running.": [
        "शुरू करें, लैप दर्ज करें, रोकें और जारी रखें। रीसेट से पहले रोकें; लैप साफ़ करने पर स्टॉपवॉच चलता रहता है।",
        "Inicia, registra vueltas, pausa y reanuda. Pausa antes de restablecer; borrar vueltas mantiene el cronómetro en marcha.",
        "Démarrez, notez des tours, mettez en pause et reprenez. Pause avant remise à zéro ; effacer les tours laisse le chronomètre actif.",
        "Starten, Runden aufzeichnen, pausieren und fortsetzen. Vor dem Zurücksetzen pausieren; Runden löschen stoppt die Uhr nicht.",
        "開始、ラップ記録、一時停止、再開ができます。リセット前に停止してください。ラップ消去では計測は続きます。",
        "开始、记录圈时、暂停和继续。重置前请暂停；清除圈时不会停止秒表。",
        "ابدأ وسجّل اللفات وأوقف مؤقتًا واستأنف. أوقف قبل إعادة الضبط؛ مسح اللفات يبقي الساعة تعمل."
    ],
    "Best, worst and average lap times are shown. Results stay in this tab; there is no file export.": [
        "सर्वश्रेष्ठ, सबसे धीमा और औसत लैप दिखते हैं। परिणाम केवल इस टैब में हैं; फ़ाइल निर्यात नहीं है।",
        "Muestra la mejor, peor y media de vueltas. Los resultados quedan en esta pestaña; no hay exportación a archivo.",
        "Affiche les meilleurs, moins bons et moyens temps au tour. Résultats dans cet onglet uniquement, sans export de fichier.",
        "Beste, langsamste und durchschnittliche Runde werden angezeigt. Ergebnisse bleiben im Tab; kein Dateiexport.",
        "最速、最遅、平均ラップを表示します。結果はこのタブ内のみで、ファイル出力はありません。",
        "显示最快、最慢和平均圈时。结果仅保留在此标签页，不提供文件导出。",
        "تُعرض أفضل وأبطأ ومتوسط أزمنة اللفات. تبقى النتائج في هذا التبويب ولا يوجد تصدير ملفات."
    ],
    "Resume": [
        "जारी रखें",
        "Reanudar",
        "Reprendre",
        "Fortsetzen",
        "再開",
        "继续",
        "استئناف"
    ],
    "Start the stopwatch first": [
        "पहले स्टॉपवॉच शुरू करें",
        "Inicia primero el cronómetro",
        "Démarrez d’abord le chronomètre",
        "Zuerst die Stoppuhr starten",
        "先に計測を開始",
        "请先启动秒表",
        "ابدأ ساعة الإيقاف أولًا"
    ],
    "Record lap split": [
        "लैप का समय दर्ज करें",
        "Registrar tiempo de vuelta",
        "Enregistrer un tour",
        "Rundenzeit aufzeichnen",
        "ラップを記録",
        "记录圈时",
        "تسجيل زمن اللفة"
    ],
    "Lap": [
        "लैप",
        "Vuelta",
        "Tour",
        "Runde",
        "ラップ",
        "计圈",
        "لفة"
    ],
    "Pause before resetting": [
        "रीसेट से पहले रोकें",
        "Pausa antes de restablecer",
        "Pause avant remise à zéro",
        "Vor dem Zurücksetzen pausieren",
        "リセット前に一時停止",
        "重置前请暂停",
        "أوقف مؤقتًا قبل إعادة الضبط"
    ],
    "Reset timer and clear laps": [
        "टाइमर रीसेट और लैप साफ़ करें",
        "Restablecer y borrar vueltas",
        "Réinitialiser et effacer les tours",
        "Uhr zurücksetzen und Runden löschen",
        "計測とラップをリセット",
        "重置计时并清除圈时",
        "إعادة ضبط الوقت ومسح اللفات"
    ],
    "Lap {number}": [
        "लैप {number}",
        "Vuelta {number}",
        "Tour {number}",
        "Runde {number}",
        "ラップ{number}",
        "第 {number} 圈",
        "اللفة {number}"
    ],
    "Total Laps": [
        "कुल लैप",
        "Total de vueltas",
        "Total des tours",
        "Runden insgesamt",
        "ラップ数",
        "总圈数",
        "إجمالي اللفات"
    ],
    "Best Lap": [
        "सर्वश्रेष्ठ लैप",
        "Mejor vuelta",
        "Meilleur tour",
        "Beste Runde",
        "最速ラップ",
        "最快圈时",
        "أفضل لفة"
    ],
    "Worst Lap": [
        "सबसे धीमा लैप",
        "Peor vuelta",
        "Tour le plus lent",
        "Langsamste Runde",
        "最遅ラップ",
        "最慢圈时",
        "أبطأ لفة"
    ],
    "Avg Lap": [
        "औसत लैप",
        "Vuelta media",
        "Tour moyen",
        "Durchschnittsrunde",
        "平均ラップ",
        "平均圈时",
        "متوسط اللفة"
    ],
    "Lap Records": [
        "लैप रिकॉर्ड",
        "Registro de vueltas",
        "Relevé des tours",
        "Rundenaufzeichnungen",
        "ラップ記録",
        "圈时记录",
        "سجل اللفات"
    ],
    "Clear Laps": [
        "लैप साफ़ करें",
        "Borrar vueltas",
        "Effacer les tours",
        "Runden löschen",
        "ラップを消去",
        "清除圈时",
        "مسح اللفات"
    ],
    "Randomly select from custom options with an animated spinning wheel": [
        "एनीमेशन वाले पहिए से कस्टम विकल्पों में यादृच्छिक चुनाव",
        "Selecciona opciones al azar con una ruleta animada",
        "Choisissez au hasard parmi vos options avec une roue animée",
        "Mit einem animierten Rad zufällig aus eigenen Optionen wählen",
        "アニメーションするホイールで任意の選択肢からランダムに選ぶ",
        "通过动画转盘从自定义选项中随机选择",
        "اختيار عشوائي من خيارات مخصصة بعجلة متحركة"
    ],
    "An animated wheel chooses equally among 2–12 custom options using Math.random. It is intended for casual choices.": [
        "Math.random वाला पहिया 2–12 कस्टम विकल्पों में समान संभावना से चुनता है। यह सामान्य निर्णयों के लिए है।",
        "La ruleta elige por igual entre 2–12 opciones mediante Math.random. Está pensada para decisiones informales.",
        "La roue choisit à chances égales parmi 2 à 12 options avec Math.random, pour des choix sans enjeu.",
        "Das Rad wählt mit Math.random gleichverteilt aus 2–12 Optionen. Für alltägliche Entscheidungen gedacht.",
        "Math.randomで2～12個の選択肢から等確率で選びます。気軽な選択向けです。",
        "动画转盘使用 Math.random 从 2–12 个自定义选项中等概率选择，适用于日常轻松决策。",
        "تختار العجلة بالتساوي بين 2–12 خيارًا باستخدام Math.random. مخصصة للقرارات البسيطة."
    ],
    "Add or remove options before spinning. The selected option is highlighted and added to the last 10 results.": [
        "घुमाने से पहले विकल्प जोड़ें या हटाएं। चुना विकल्प उभरता है और अंतिम 10 परिणामों में जुड़ता है।",
        "Añade o elimina opciones antes de girar. La elegida se resalta y se añade a los últimos 10 resultados.",
        "Ajoutez ou retirez des options avant de tourner. Le choix est surligné et ajouté aux 10 derniers résultats.",
        "Optionen vor dem Drehen hinzufügen oder entfernen. Die Auswahl wird hervorgehoben und unter den letzten 10 Ergebnissen gespeichert.",
        "回す前に選択肢を追加・削除します。選ばれた項目は強調表示され、直近10件の履歴に追加されます。",
        "转动前添加或移除选项。选中项会高亮并加入最近 10 条结果。",
        "أضف الخيارات أو احذفها قبل التدوير. يُبرز الخيار المحدد ويُضاف إلى آخر 10 نتائج."
    ],
    "Options are saved in the current workspace. Sample labels and your own labels keep their original text when you change language.": [
        "विकल्प मौजूदा कार्यक्षेत्र में सहेजे जाते हैं। भाषा बदलने पर नमूना और आपके नाम मूल रूप में रहते हैं।",
        "Las opciones se guardan en el espacio actual. Los nombres de ejemplo y los tuyos conservan su texto al cambiar de idioma.",
        "Options enregistrées dans l’espace courant. Les exemples et vos libellés gardent leur texte d’origine lors d’un changement de langue.",
        "Optionen werden im aktuellen Arbeitsbereich gespeichert. Beispiel- und eigene Bezeichnungen bleiben beim Sprachwechsel unverändert.",
        "選択肢は現在のワークスペースに保存します。言語を変えてもサンプルや入力した名前は元の文字のままです。",
        "选项保存在当前工作区。切换语言时，示例名称和您输入的名称均保留原文。",
        "تُحفظ الخيارات في مساحة العمل الحالية. تحتفظ أسماء الأمثلة وأسماؤك بنصها الأصلي عند تغيير اللغة."
    ],
    "Spinning…": [
        "घूम रहा है…",
        "Girando…",
        "Rotation…",
        "Dreht sich…",
        "回転中…",
        "转动中…",
        "جارٍ التدوير…"
    ],
    "Spin!": [
        "घुमाएं!",
        "¡Girar!",
        "Tourner !",
        "Drehen!",
        "回す！",
        "转动！",
        "دوّر!"
    ],
    "Items": [
        "विकल्प",
        "Opciones",
        "Options",
        "Optionen",
        "選択肢",
        "选项",
        "الخيارات"
    ],
    "Add option…": [
        "विकल्प जोड़ें…",
        "Añadir opción…",
        "Ajouter une option…",
        "Option hinzufügen…",
        "選択肢を追加…",
        "添加选项…",
        "إضافة خيار…"
    ],
    "Reset to defaults": [
        "डिफ़ॉल्ट वापस लाएं",
        "Restablecer valores iniciales",
        "Rétablir les options initiales",
        "Standard wiederherstellen",
        "初期値に戻す",
        "恢复默认",
        "استعادة الافتراضي"
    ],
    "Spin History": [
        "घुमाव का इतिहास",
        "Historial de giros",
        "Historique des tours",
        "Drehverlauf",
        "回転履歴",
        "转盘历史",
        "سجل التدوير"
    ],
    "It is certain.": [
        "यह निश्चित है।",
        "Es seguro.",
        "C’est certain.",
        "Es ist sicher.",
        "確かです。",
        "这是肯定的。",
        "هذا مؤكد."
    ],
    "It is decidedly so.": [
        "बिल्कुल ऐसा है।",
        "Decididamente sí.",
        "C’est tout à fait cela.",
        "Ganz bestimmt.",
        "間違いなくそうです。",
        "确实如此。",
        "بالتأكيد نعم."
    ],
    "Without a doubt.": [
        "बिना संदेह।",
        "Sin duda.",
        "Sans aucun doute.",
        "Ohne Zweifel.",
        "疑いありません。",
        "毫无疑问。",
        "بلا شك."
    ],
    "Yes, definitely.": [
        "हाँ, निश्चित ही।",
        "Sí, definitivamente.",
        "Oui, absolument.",
        "Ja, definitiv.",
        "はい、絶対に。",
        "是的，绝对如此。",
        "نعم، قطعًا."
    ],
    "You may rely on it.": [
        "आप इस पर भरोसा कर सकते हैं।",
        "Puedes confiar en ello.",
        "Vous pouvez compter dessus.",
        "Darauf kannst du dich verlassen.",
        "信頼してよいでしょう。",
        "你可以相信它。",
        "يمكنك الاعتماد على ذلك."
    ],
    "As I see it, yes.": [
        "मेरी नज़र में, हाँ।",
        "Tal como lo veo, sí.",
        "À mon avis, oui.",
        "So wie ich es sehe: ja.",
        "私には、はいと見えます。",
        "在我看来，是的。",
        "كما أرى، نعم."
    ],
    "Most likely.": [
        "बहुत संभव है।",
        "Muy probablemente.",
        "Très probable.",
        "Sehr wahrscheinlich.",
        "おそらくそうです。",
        "很有可能。",
        "على الأرجح."
    ],
    "Outlook good.": [
        "संभावना अच्छी है।",
        "Buenas perspectivas.",
        "Les perspectives sont bonnes.",
        "Gute Aussichten.",
        "見通しは良好です。",
        "前景良好。",
        "التوقعات جيدة."
    ],
    "Yes.": [
        "हाँ।",
        "Sí.",
        "Oui.",
        "Ja.",
        "はい。",
        "是的。",
        "نعم."
    ],
    "Signs point to yes.": [
        "संकेत हाँ कहते हैं।",
        "Las señales indican que sí.",
        "Les signes disent oui.",
        "Die Zeichen stehen auf ja.",
        "兆しは「はい」です。",
        "迹象表明是肯定的。",
        "الإشارات تقول نعم."
    ],
    "Reply hazy, try again.": [
        "जवाब अस्पष्ट है, फिर पूछें।",
        "Respuesta confusa, prueba otra vez.",
        "Réponse floue, réessayez.",
        "Antwort unklar, versuche es erneut.",
        "答えが不鮮明です。もう一度。",
        "答案模糊，请重试。",
        "الإجابة غامضة، حاول مجددًا."
    ],
    "Ask again later.": [
        "बाद में फिर पूछें।",
        "Pregunta más tarde.",
        "Reposez la question plus tard.",
        "Frag später noch einmal.",
        "後でもう一度聞いてください。",
        "稍后再问。",
        "اسأل لاحقًا."
    ],
    "Better not tell you now.": [
        "अभी न बताना ही बेहतर है।",
        "Mejor no decírtelo ahora.",
        "Mieux vaut ne pas vous le dire.",
        "Besser, es dir jetzt nicht zu sagen.",
        "今は言わない方がよいでしょう。",
        "现在最好不告诉你。",
        "من الأفضل ألا أخبرك الآن."
    ],
    "Cannot predict now.": [
        "अभी भविष्यवाणी नहीं कर सकता।",
        "No puedo predecirlo ahora.",
        "Impossible de prédire maintenant.",
        "Jetzt nicht vorhersagbar.",
        "今は予測できません。",
        "现在无法预测。",
        "لا يمكن التنبؤ الآن."
    ],
    "Concentrate and ask again.": [
        "ध्यान लगाकर फिर पूछें।",
        "Concéntrate y pregunta otra vez.",
        "Concentrez-vous et redemandez.",
        "Konzentriere dich und frag erneut.",
        "集中してもう一度聞いてください。",
        "集中注意力再问一次。",
        "ركّز واسأل مجددًا."
    ],
    "Don't count on it.": [
        "इस पर भरोसा न करें।",
        "No cuentes con ello.",
        "N’y comptez pas.",
        "Verlass dich nicht darauf.",
        "当てにしないでください。",
        "别指望它。",
        "لا تعتمد على ذلك."
    ],
    "My reply is no.": [
        "मेरा जवाब नहीं है।",
        "Mi respuesta es no.",
        "Ma réponse est non.",
        "Meine Antwort ist nein.",
        "私の答えは「いいえ」です。",
        "我的回答是否定的。",
        "إجابتي لا."
    ],
    "My sources say no.": [
        "मेरे स्रोत नहीं कहते हैं।",
        "Mis fuentes dicen que no.",
        "Mes sources disent non.",
        "Meine Quellen sagen nein.",
        "情報源は「いいえ」と言っています。",
        "我的消息来源说不。",
        "مصادري تقول لا."
    ],
    "Outlook not so good.": [
        "संभावना अच्छी नहीं है।",
        "No hay buenas perspectivas.",
        "Les perspectives sont mauvaises.",
        "Keine guten Aussichten.",
        "見通しはよくありません。",
        "前景不太好。",
        "التوقعات ليست جيدة."
    ],
    "Very doubtful.": [
        "बहुत संदिग्ध है।",
        "Muy dudoso.",
        "Très douteux.",
        "Sehr zweifelhaft.",
        "かなり疑わしいです。",
        "非常可疑。",
        "مشكوك فيه جدًا."
    ],
    "Ask a yes/no question and let the Magic 8-Ball decide your fate": [
        "हाँ/नहीं का सवाल पूछें और मैजिक 8-बॉल से उत्तर पाएं",
        "Haz una pregunta de sí/no y deja que decida la bola mágica",
        "Posez une question oui/non à la boule magique",
        "Stelle eine Ja/Nein-Frage an die magische Kugel",
        "はい・いいえで答えられる質問を8ボールに聞く",
        "提出是非问题，让魔法八号球作答",
        "اطرح سؤال نعم أو لا ودع الكرة السحرية تجيب"
    ],
    "A playful random answer generator with 20 responses: 10 positive, 5 neutral and 5 negative. It does not predict the future.": [
        "मनोरंजक यादृच्छिक उत्तर जनरेटर: 20 उत्तर, जिनमें 10 सकारात्मक, 5 तटस्थ और 5 नकारात्मक हैं। यह भविष्यवाणी नहीं करता।",
        "Generador lúdico de 20 respuestas aleatorias: 10 positivas, 5 neutras y 5 negativas. No predice el futuro.",
        "Générateur ludique de 20 réponses aléatoires : 10 positives, 5 neutres et 5 négatives. Il ne prédit pas l’avenir.",
        "Spielerischer Zufallsantwortgenerator mit 20 Antworten: 10 positiv, 5 neutral und 5 negativ. Er sagt keine Zukunft voraus.",
        "20個の回答をランダムに返す遊びです。肯定10、中立5、否定5で、未来を予測するものではありません。",
        "趣味随机回答生成器，共 20 条回答：10 条肯定、5 条中立、5 条否定。不能预测未来。",
        "مولّد إجابات عشوائية للتسلية، يضم 20 إجابة: 10 إيجابية و5 محايدة و5 سلبية. لا يتنبأ بالمستقبل."
    ],
    "Enter an optional yes/no question, then ask the ball or press Enter. The response appears after the animation.": [
        "चाहें तो हाँ/नहीं का सवाल भरें, फिर गेंद से पूछें या Enter दबाएं। एनीमेशन के बाद उत्तर दिखता है।",
        "Escribe una pregunta opcional de sí/no y pregunta a la bola o pulsa Enter. La respuesta aparece tras la animación.",
        "Saisissez une question oui/non facultative, puis interrogez la boule ou appuyez sur Entrée. Réponse après l’animation.",
        "Optional eine Ja/Nein-Frage eingeben und die Kugel fragen oder Enter drücken. Die Antwort erscheint nach der Animation.",
        "必要なら質問を入力し、ボタンまたはEnterで聞きます。アニメーションの後に回答が表示されます。",
        "可选输入是非问题，然后点击提问或按 Enter。动画结束后显示回答。",
        "أدخل سؤال نعم أو لا اختياريًا، ثم اسأل الكرة أو اضغط Enter. تظهر الإجابة بعد الحركة."
    ],
    "Questions stay in this tab only. Changing language translates answer wording without selecting a new answer.": [
        "सवाल केवल इस टैब में रहते हैं। भाषा बदलने से उत्तर का अनुवाद होता है, नया उत्तर नहीं चुना जाता।",
        "Las preguntas quedan solo en esta pestaña. Cambiar de idioma traduce la respuesta sin elegir otra.",
        "Questions conservées uniquement dans cet onglet. Changer de langue traduit la réponse sans en choisir une autre.",
        "Fragen bleiben nur in diesem Tab. Sprachwechsel übersetzt die Antwort, ohne eine neue auszuwählen.",
        "質問はこのタブにのみ残ります。言語変更では回答を引き直さず、同じ回答の表現を翻訳します。",
        "问题仅保留在此标签页。切换语言只翻译回答文字，不会重新抽取回答。",
        "تبقى الأسئلة في هذا التبويب فقط. يترجم تغيير اللغة صياغة الإجابة دون اختيار إجابة جديدة."
    ],
    "Ask a yes or no question…": [
        "हाँ या नहीं का सवाल पूछें…",
        "Haz una pregunta de sí o no…",
        "Posez une question oui ou non…",
        "Stelle eine Ja/Nein-Frage…",
        "はい・いいえの質問を入力…",
        "输入是非问题…",
        "اطرح سؤال نعم أو لا…"
    ],
    "Shaking…": [
        "हिला रहे हैं…",
        "Agitando…",
        "Agitation…",
        "Wird geschüttelt…",
        "振っています…",
        "摇晃中…",
        "جارٍ الهز…"
    ],
    "Ask the 8-Ball": [
        "8-बॉल से पूछें",
        "Preguntar a la bola",
        "Interroger la boule",
        "Kugel fragen",
        "8ボールに聞く",
        "询问八号球",
        "اسأل الكرة"
    ],
    "Response Stats ({count} asks)": [
        "उत्तर आँकड़े ({count} सवाल)",
        "Estadísticas ({count} preguntas)",
        "Statistiques ({count} questions)",
        "Antwortstatistik ({count} Fragen)",
        "回答の統計（{count}回）",
        "回答统计（{count} 次提问）",
        "إحصاءات الإجابات ({count} أسئلة)"
    ],
    "Question History": [
        "सवालों का इतिहास",
        "Historial de preguntas",
        "Historique des questions",
        "Fragenverlauf",
        "質問履歴",
        "问题历史",
        "سجل الأسئلة"
    ],
    "Ask a question and shake the ball to reveal your destiny.": [
        "सवाल पूछें और उत्तर देखने के लिए गेंद हिलाएं।",
        "Haz una pregunta y agita la bola para ver la respuesta.",
        "Posez une question et secouez la boule pour voir la réponse.",
        "Stelle eine Frage und schüttle die Kugel für eine Antwort.",
        "質問し、ボールを振って回答を見てください。",
        "提问并摇晃球以查看答案。",
        "اطرح سؤالًا وهز الكرة لرؤية الإجابة."
    ],
    "15s": [
        "15 सेकंड",
        "15 s",
        "15 s",
        "15 Sek.",
        "15秒",
        "15 秒",
        "15 ثانية"
    ],
    "30s": [
        "30 सेकंड",
        "30 s",
        "30 s",
        "30 Sek.",
        "30秒",
        "30 秒",
        "30 ثانية"
    ],
    "60s": [
        "60 सेकंड",
        "60 s",
        "60 s",
        "60 Sek.",
        "60秒",
        "60 秒",
        "60 ثانية"
    ],
    "2min": [
        "2 मिनट",
        "2 min",
        "2 min",
        "2 Min.",
        "2分",
        "2 分钟",
        "دقيقتان"
    ],
    "Measure your typing speed in WPM with real-time accuracy tracking": [
        "रीयल-टाइम सटीकता के साथ WPM में टाइपिंग गति मापें",
        "Mide tu velocidad en palabras por minuto con precisión en tiempo real",
        "Mesurez votre vitesse en mots par minute et votre précision en direct",
        "Tippgeschwindigkeit in WPM mit Genauigkeit in Echtzeit messen",
        "正確さをリアルタイムに確認しながらWPMを測定",
        "测量每分钟字数并实时追踪准确率",
        "قِس سرعة الكتابة بالكلمات في الدقيقة مع تتبع الدقة مباشرة"
    ],
    "Practice typing with fixed English passages. WPM is correct characters divided by five and by elapsed minutes; accuracy compares your current text with the passage.": [
        "तय अंग्रेज़ी अनुच्छेदों से अभ्यास करें। WPM = सही वर्ण ÷ पाँच ÷ बीते मिनट; सटीकता मौजूदा पाठ और अनुच्छेद की तुलना है।",
        "Practica con textos fijos en inglés. WPM son caracteres correctos divididos por cinco y por minutos transcurridos; la precisión compara tu texto con el pasaje.",
        "Entraînez-vous sur des textes anglais fixes. WPM = caractères corrects divisés par cinq et par les minutes écoulées ; la précision compare votre saisie au texte.",
        "Mit festen englischen Texten üben. WPM sind korrekte Zeichen geteilt durch fünf und verstrichene Minuten; die Genauigkeit vergleicht deine Eingabe mit dem Text.",
        "固定の英語文章で練習します。WPMは正しい文字数÷5÷経過分、正確さは現在の入力と文章の一致率です。",
        "使用固定英文段落练习。WPM 为正确字符数除以五再除以经过的分钟数；准确率通过比较当前输入和原文计算。",
        "تدرّب على نصوص إنجليزية ثابتة. WPM هو الأحرف الصحيحة مقسومة على خمسة ثم على الدقائق المنقضية؛ وتقارن الدقة نصك الحالي بالمقطع."
    ],
    "Choose a duration and type to start. The test ends when time runs out or the full passage matches. Restart selects a new passage.": [
        "अवधि चुनकर टाइप शुरू करें। समय पूरा होने या पूरा अनुच्छेद सही होने पर परीक्षण समाप्त होता है। पुनः शुरू से नया अनुच्छेद चुना जाता है।",
        "Elige duración y escribe para empezar. Termina al agotarse el tiempo o coincidir todo el texto. Reiniciar elige otro pasaje.",
        "Choisissez une durée puis tapez. Le test finit à l’échéance ou quand le texte correspond entièrement. Redémarrer choisit un nouveau passage.",
        "Dauer wählen und lostippen. Der Test endet bei Zeitablauf oder vollständig korrektem Text. Neustart wählt einen neuen Text.",
        "時間を選んで入力を始めます。時間切れか全文一致で終了し、再スタートで新しい文章を選びます。",
        "选择时长并输入以开始。时间用尽或全文匹配时结束。重新开始会选择新段落。",
        "اختر مدة وابدأ بالكتابة. ينتهي الاختبار بانتهاء الوقت أو مطابقة النص كاملًا. تختار إعادة البدء مقطعًا جديدًا."
    ],
    "The interface language does not change the English practice passage or reset a running test. The last five results stay in this tab.": [
        "इंटरफ़ेस की भाषा अंग्रेज़ी अभ्यास पाठ नहीं बदलती और चालू परीक्षण रीसेट नहीं करती। पिछले पाँच परिणाम इसी टैब में रहते हैं।",
        "El idioma de la interfaz no cambia el texto inglés ni reinicia una prueba activa. Los últimos cinco resultados quedan en esta pestaña.",
        "La langue de l’interface ne modifie ni le texte anglais ni le test en cours. Les cinq derniers résultats restent dans cet onglet.",
        "Die Oberflächensprache ändert weder den englischen Übungstext noch einen laufenden Test. Die letzten fünf Ergebnisse bleiben im Tab.",
        "表示言語を変えても英語の練習文章は変わらず、進行中のテストもリセットされません。直近5件の結果をこのタブに残します。",
        "界面语言不会改变英文练习段落，也不会重置进行中的测试。此标签页保留最近五次结果。",
        "لا تغيّر لغة الواجهة المقطع الإنجليزي أو تعيد ضبط الاختبار الجاري. تبقى آخر خمس نتائج في هذا التبويب."
    ],
    "Restart": [
        "फिर शुरू करें",
        "Reiniciar",
        "Redémarrer",
        "Neu starten",
        "再スタート",
        "重新开始",
        "إعادة البدء"
    ],
    "s": [
        "से",
        "s",
        "s",
        "s",
        "秒",
        "秒",
        "ث"
    ],
    "English practice passage": [
        "अंग्रेज़ी अभ्यास अनुच्छेद",
        "Texto de práctica en inglés",
        "Texte d’entraînement en anglais",
        "Englischer Übungstext",
        "英語の練習文章",
        "英文练习段落",
        "مقطع تدريب باللغة الإنجليزية"
    ],
    "Typing test input": [
        "टाइपिंग परीक्षण इनपुट",
        "Entrada de prueba de escritura",
        "Saisie du test de frappe",
        "Eingabe für den Tipptest",
        "タイピング入力",
        "打字测试输入",
        "إدخال اختبار الكتابة"
    ],
    "Click here and start typing to begin the test": [
        "शुरू करने के लिए यहाँ क्लिक करके टाइप करें",
        "Haz clic aquí y escribe para empezar",
        "Cliquez ici et tapez pour démarrer",
        "Hier klicken und zum Starten tippen",
        "ここをクリックし、入力して開始",
        "点击此处并输入以开始测试",
        "انقر هنا وابدأ الكتابة لبدء الاختبار"
    ],
    "WPM": [
        "शब्द/मिनट",
        "PPM",
        "MPM",
        "WPM",
        "WPM",
        "WPM",
        "كلمة/دقيقة"
    ],
    "Accuracy": [
        "सटीकता",
        "Precisión",
        "Précision",
        "Genauigkeit",
        "正確さ",
        "准确率",
        "الدقة"
    ],
    "Errors": [
        "त्रुटियाँ",
        "Errores",
        "Erreurs",
        "Fehler",
        "誤り",
        "错误",
        "الأخطاء"
    ],
    "Chars": [
        "वर्ण",
        "Caracteres",
        "Caractères",
        "Zeichen",
        "文字",
        "字符",
        "الأحرف"
    ],
    "{percent}% accuracy": [
        "{percent}% सटीकता",
        "{percent}% de precisión",
        "{percent}% de précision",
        "{percent}% Genauigkeit",
        "正確さ{percent}%",
        "准确率 {percent}%",
        "دقة {percent}%"
    ],
    "{count} errors": [
        "{count} त्रुटियाँ",
        "{count} errores",
        "{count} erreurs",
        "{count} Fehler",
        "誤り{count}個",
        "{count} 个错误",
        "{count} أخطاء"
    ],
    "Try Again": [
        "फिर प्रयास करें",
        "Intentar de nuevo",
        "Réessayer",
        "Erneut versuchen",
        "もう一度",
        "再试一次",
        "حاول مجددًا"
    ],
    "Complete a test to see results": [
        "परिणाम देखने के लिए परीक्षण पूरा करें",
        "Completa una prueba para ver resultados",
        "Terminez un test pour voir les résultats",
        "Test abschließen, um Ergebnisse zu sehen",
        "テストを完了すると結果を表示",
        "完成测试以查看结果",
        "أكمل اختبارًا لرؤية النتائج"
    ],
    "Positive response": [
        "सकारात्मक उत्तर",
        "Respuesta positiva",
        "Réponse positive",
        "Positive Antwort",
        "肯定の回答",
        "肯定回答",
        "إجابة إيجابية"
    ],
    "Neutral response": [
        "तटस्थ उत्तर",
        "Respuesta neutra",
        "Réponse neutre",
        "Neutrale Antwort",
        "中立の回答",
        "中立回答",
        "إجابة محايدة"
    ],
    "Negative response": [
        "नकारात्मक उत्तर",
        "Respuesta negativa",
        "Réponse négative",
        "Negative Antwort",
        "否定の回答",
        "否定回答",
        "إجابة سلبية"
    ],
    "Coin Toss": [
        "सिक्का उछालें",
        "Lanzar una moneda",
        "Pile ou face",
        "Münzwurf",
        "コイントス",
        "抛硬币",
        "رمي العملة"
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
    "Dice Roll": [
        "पासा फेंकें",
        "Lanzar dados",
        "Lancer de dés",
        "Würfeln",
        "サイコロ",
        "掷骰子",
        "رمي النرد"
    ],
    "Count": [
        "संख्या",
        "Cantidad",
        "Nombre",
        "Anzahl",
        "件数",
        "数量",
        "العدد"
    ],
    "Normal": [
        "सामान्य",
        "Normal",
        "Normal",
        "Normaler Text",
        "標準",
        "正文",
        "عادي"
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
    "Timer": [
        "टाइमर",
        "Temporizador",
        "Minuteur",
        "Timer",
        "タイマー",
        "倒计时",
        "المؤقت"
    ],
    "Presets": [
        "प्रीसेट",
        "Preajustes",
        "Préréglages",
        "Vorlagen",
        "プリセット",
        "预设",
        "إعدادات مسبقة"
    ],
    "Apply": [
        "लागू करें",
        "Aplicar",
        "Appliquer",
        "Übernehmen",
        "適用",
        "应用",
        "تطبيق"
    ],
    "Stopwatch": [
        "स्टॉपवॉच",
        "Cronómetro",
        "Chronomètre",
        "Stoppuhr",
        "ストップウォッチ",
        "秒表",
        "ساعة الإيقاف"
    ],
    "Spin the Wheel": [
        "पहिया घुमाएँ",
        "Girar la ruleta",
        "Tourner la roue",
        "Glücksrad drehen",
        "ルーレット",
        "转盘",
        "تدوير العجلة"
    ],
    "Add": [
        "जोड़ें",
        "Añadir",
        "Ajouter",
        "Hinzufügen",
        "追加",
        "添加",
        "إضافة"
    ],
    "Delete": [
        "हटाएँ",
        "Eliminar",
        "Supprimer",
        "Löschen",
        "削除",
        "删除",
        "حذف"
    ],
    "Magic 8-Ball": [
        "मैजिक 8-बॉल",
        "Bola mágica 8",
        "Boule magique 8",
        "Magische 8er-Kugel",
        "マジック8ボール",
        "魔法八号球",
        "الكرة السحرية 8"
    ],
    "Typing Speed Test": [
        "टाइपिंग गति परीक्षण",
        "Prueba de velocidad de escritura",
        "Test de vitesse de frappe",
        "Tippgeschwindigkeitstest",
        "タイピング速度テスト",
        "打字速度测试",
        "اختبار سرعة الكتابة"
    ],
    "History": [
        "इतिहास",
        "Historial",
        "Historique",
        "Verlauf",
        "履歴",
        "历史",
        "السجل"
    ]
};
