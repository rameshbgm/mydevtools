import type { TranslationColumns } from "./tool-names";

export const JSON_NUMBER_TRANSLATIONS: Record<string, TranslationColumns> = {
    "Preserve precision-sensitive numbers as text": [
        "सटीकता-संवेदनशील संख्याएँ टेक्स्ट के रूप में रखें",
        "Conservar como texto los números sensibles a la precisión",
        "Conserver en texte les nombres sensibles à la précision",
        "Präzisionskritische Zahlen als Text erhalten",
        "精度に影響する数値を文字列として保持",
        "将精度敏感的数字保留为文本",
        "الاحتفاظ بالأرقام الحساسة للدقة كنص"
    ],
    "Input numbers that cannot round-trip through JavaScript numbers are rejected instead of silently changed.": [
        "JavaScript संख्या में बदलकर मूल मान वापस न पाने वाली इनपुट संख्याएँ चुपचाप बदलने के बजाय अस्वीकार की जाती हैं।",
        "Se rechazan los números de entrada que JavaScript no puede representar y devolver sin cambios.",
        "Les nombres d’entrée que JavaScript ne peut pas restituer à l’identique sont refusés plutôt que modifiés silencieusement.",
        "Eingabezahlen, die JavaScript nicht unverändert zurückgeben kann, werden abgelehnt statt unbemerkt verändert.",
        "JavaScriptの数値に変換して元の値に戻せない入力は、黙って変更せず拒否します。",
        "无法通过 JavaScript 数值无损往返的输入数字会被拒绝，而非静默更改。",
        "تُرفض أرقام الإدخال التي لا يمكن تحويلها إلى أرقام JavaScript وإعادتها دون تغيير، بدلًا من تعديلها بصمت."
    ],
    "Numeric functions use IEEE 754 arithmetic and may round. JMESPath JSON literals follow the input precision setting.": [
        "संख्यात्मक फ़ंक्शन IEEE 754 गणना का उपयोग करते हैं और राउंड हो सकते हैं। JMESPath JSON लिटरल इनपुट की सटीकता सेटिंग का पालन करते हैं।",
        "Las funciones numéricas usan aritmética IEEE 754 y pueden redondear. Los literales JSON de JMESPath siguen la configuración de precisión de la entrada.",
        "Les fonctions numériques utilisent l’arithmétique IEEE 754 et peuvent arrondir. Les littéraux JSON de JMESPath suivent le réglage de précision de l’entrée.",
        "Numerische Funktionen verwenden IEEE-754-Arithmetik und können runden. JMESPath-JSON-Literale folgen der Präzisionseinstellung der Eingabe.",
        "数値関数はIEEE 754演算を使用し、丸めが発生する場合があります。JMESPathのJSONリテラルには入力と同じ精度設定が適用されます。",
        "数值函数使用 IEEE 754 算术，可能发生舍入。JMESPath JSON 字面量遵循输入的精度设置。",
        "تستخدم الدوال العددية حساب IEEE 754 وقد تُقرَّب النتائج. تتبع قيم JSON الحرفية في JMESPath إعداد دقة الإدخال."
    ],
    "A JSON number would lose precision or negative zero. Quote that value, or enable Preserve precision-sensitive numbers as text.": [
        "JSON संख्या की सटीकता या ऋणात्मक शून्य खो जाएगा। मान को उद्धरण में रखें या सटीकता-संवेदनशील संख्याएँ टेक्स्ट के रूप में रखने का विकल्प चालू करें।",
        "Un número JSON perdería precisión o el cero negativo. Ponlo entre comillas o activa Conservar como texto los números sensibles a la precisión.",
        "Un nombre JSON perdrait sa précision ou son zéro négatif. Mettez-le entre guillemets ou activez la conservation des nombres sensibles à la précision en texte.",
        "Eine JSON-Zahl würde Präzision oder negatives Null verlieren. Setze den Wert in Anführungszeichen oder aktiviere die Texterhaltung präzisionskritischer Zahlen.",
        "JSON数値の精度または負のゼロが失われます。値を引用符で囲むか、精度に影響する数値を文字列として保持する設定を有効にしてください。",
        "JSON 数字将丢失精度或负零。请将该值放在引号中，或启用“将精度敏感的数字保留为文本”。",
        "سيفقد أحد أرقام JSON الدقة أو الصفر السالب. ضع القيمة بين علامات اقتباس أو فعّل الاحتفاظ بالأرقام الحساسة للدقة كنص."
    ],
    "Integer and number types are classified from the original JSON tokens, including values beyond JavaScript numeric precision.": [
        "पूर्णांक और संख्या प्रकार मूल JSON टोकन से पहचाने जाते हैं, JavaScript की संख्यात्मक सटीकता से बाहर के मानों के लिए भी।",
        "Los tipos entero y número se clasifican a partir del JSON original, incluso fuera de la precisión numérica de JavaScript.",
        "Les types entier et nombre sont classés d’après les jetons JSON d’origine, même au-delà de la précision numérique de JavaScript.",
        "Ganzzahl- und Zahltypen werden anhand der ursprünglichen JSON-Tokens bestimmt, auch jenseits der numerischen JavaScript-Präzision.",
        "整数と数値の型は元のJSONトークンから分類します。JavaScriptの数値精度を超える値にも対応します。",
        "整数和数值类型根据原始 JSON 标记分类，包括超出 JavaScript 数值精度的值。",
        "تُصنَّف أنواع الأعداد الصحيحة والأرقام من رموز JSON الأصلية، بما فيها القيم التي تتجاوز دقة JavaScript العددية."
    ],
    "Sample JSON editor": [
        "उदाहरण JSON एडिटर",
        "Editor del JSON de ejemplo",
        "Éditeur JSON d’exemple",
        "Editor für JSON-Beispiele",
        "サンプルJSONエディター",
        "示例 JSON 编辑器",
        "محرر JSON النموذجي"
    ],
    "JSON source input limit is 2 MiB.": [
        "JSON स्रोत इनपुट की सीमा 2 MiB है।",
        "El límite del JSON de entrada es de 2 MiB.",
        "La source JSON est limitée à 2 Mio.",
        "Die JSON-Quelle ist auf 2 MiB begrenzt.",
        "JSONソースの入力上限は2 MiBです。",
        "JSON 源输入上限为 2 MiB。",
        "الحد الأقصى لمصدر JSON هو 2 MiB."
    ],
    "Use JSON up to 2 MiB and an expression up to 2048 characters.": [
        "अधिकतम 2 MiB JSON और 2048 अक्षर की अभिव्यक्ति उपयोग करें।",
        "Usa JSON de hasta 2 MiB y una expresión de hasta 2048 caracteres.",
        "Utilisez un JSON de 2 Mio et une expression de 2048 caractères au maximum.",
        "Verwende JSON bis 2 MiB und einen Ausdruck bis 2048 Zeichen.",
        "JSONは2 MiB、式は2048文字まで使用できます。",
        "请使用不超过 2 MiB 的 JSON 和不超过 2048 个字符的表达式。",
        "استخدم JSON بحجم يصل إلى 2 MiB وتعبيرًا يصل إلى 2048 حرفًا."
    ],
    "Affected input numbers become strings. Numeric filters and functions no longer receive numbers. Use quoted text equality; string sorting is lexical.": [
        "प्रभावित इनपुट संख्याएँ स्ट्रिंग बन जाती हैं। संख्यात्मक फ़िल्टर और फ़ंक्शन को अब संख्याएँ नहीं मिलतीं। बराबरी के लिए उद्धृत टेक्स्ट उपयोग करें; स्ट्रिंग का क्रम शब्दकोश क्रम होता है।",
        "Los números afectados se convierten en cadenas. Los filtros y funciones numéricos ya no reciben números. Compara igualdad con texto entre comillas; la ordenación de cadenas es lexicográfica.",
        "Les nombres concernés deviennent des chaînes. Les filtres et fonctions numériques ne reçoivent plus de nombres. Comparez du texte entre guillemets ; le tri des chaînes est lexicographique.",
        "Betroffene Eingabezahlen werden zu Zeichenfolgen. Numerische Filter und Funktionen erhalten keine Zahlen mehr. Vergleiche Gleichheit mit Text in Anführungszeichen; Zeichenfolgen werden lexikografisch sortiert.",
        "対象の入力数値は文字列になります。数値フィルターや関数には数値が渡りません。同値比較には引用符で囲んだ文字列を使用し、文字列ソートは辞書順になります。",
        "受影响的输入数字会变为字符串。数值筛选器和函数不再接收数值。相等比较请使用带引号的文本；字符串排序按字典序进行。",
        "تتحول أرقام الإدخال المتأثرة إلى سلاسل نصية. لا تتلقى المرشحات والدوال العددية أرقامًا بعد ذلك. استخدم نصًا مقتبسًا لاختبار المساواة؛ ويكون ترتيب السلاسل النصية معجميًا."
    ]
};
