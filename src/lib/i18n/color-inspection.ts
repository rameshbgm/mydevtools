import type { TranslationColumns } from "./tool-names";
export const COLOR_INSPECTION_TRANSLATIONS: Record<string, TranslationColumns> = {
  "Threshold comparisons use the unrounded ratio.": [
    "सीमाओं से तुलना बिना राउंड किए अनुपात से होती है।",
    "Los umbrales se comparan con la relación sin redondear.",
    "Les seuils sont comparés au rapport non arrondi.",
    "Grenzwerte werden mit dem ungerundeten Verhältnis verglichen.",
    "基準値との比較には丸め前の比率を使用します。",
    "阈值比较使用未四舍五入的比值。",
    "تُقارن الحدود بالنسبة غير المقربة."
  ],
  "Pass": [
    "सफल",
    "Aprobado",
    "Réussi",
    "Bestanden",
    "適合",
    "通过",
    "ناجح"
  ],
  "Fail": [
    "असफल",
    "No aprobado",
    "Échec",
    "Nicht bestanden",
    "不適合",
    "未通过",
    "غير ناجح"
  ],
  "Check WCAG contrast ratios between foreground and background": [
    "अग्रभूमि और पृष्ठभूमि का WCAG कंट्रास्ट अनुपात जाँचें",
    "Comprueba el contraste WCAG entre primer plano y fondo",
    "Vérifier le contraste WCAG entre le premier plan et le fond",
    "WCAG-Kontrast zwischen Vorder- und Hintergrund prüfen",
    "前景と背景のWCAGコントラスト比を確認",
    "检查前景与背景的 WCAG 对比度",
    "فحص تباين WCAG بين المقدمة والخلفية"
  ],
  "WCAG (Web Content Accessibility Guidelines) defines contrast ratios between text and background to ensure readability. AA requires 4.5:1 for normal text, 3:1 for large text. AAA requires 7:1 for normal text, 4.5:1 for large text.": [
    "WCAG पाठ और पृष्ठभूमि का कंट्रास्ट बताता है। AA में सामान्य पाठ के लिए 4.5:1 और बड़े पाठ के लिए 3:1 चाहिए। AAA में क्रमशः 7:1 और 4.5:1 चाहिए।",
    "WCAG define el contraste entre texto y fondo. AA exige 4.5:1 para texto normal y 3:1 para texto grande; AAA exige 7:1 y 4.5:1, respectivamente.",
    "WCAG définit le contraste entre texte et fond. AA exige 4.5:1 pour le texte normal et 3:1 pour le grand texte ; AAA exige respectivement 7:1 et 4.5:1.",
    "WCAG definiert den Kontrast zwischen Text und Hintergrund. AA verlangt 4.5:1 für normalen und 3:1 für großen Text; AAA entsprechend 7:1 und 4.5:1.",
    "WCAGは文字と背景のコントラストを定めます。AAは通常文字4.5:1、大きな文字3:1、AAAは通常文字7:1、大きな文字4.5:1です。",
    "WCAG 规定文字与背景的对比度。AA 要求普通文字 4.5:1、大号文字 3:1；AAA 分别要求 7:1 和 4.5:1。",
    "يحدد WCAG التباين بين النص والخلفية. يتطلب AA نسبة 4.5:1 للنص العادي و3:1 للكبير؛ ويتطلب AAA نسبة 7:1 و4.5:1 على الترتيب."
  ],
  "Compare opaque foreground and background colors against WCAG text and non-text thresholds. Contrast is one part of an accessibility review.": [
    "अपारदर्शी रंगों की तुलना WCAG की पाठ और गैर-पाठ सीमाओं से करें। कंट्रास्ट सुलभता समीक्षा का एक भाग है।",
    "Compara colores opacos con los umbrales WCAG de texto y elementos gráficos. El contraste es solo parte de una revisión de accesibilidad.",
    "Comparer les couleurs opaques aux seuils WCAG du texte et des éléments graphiques. Le contraste ne constitue qu’une partie d’un audit d’accessibilité.",
    "Undurchsichtige Farben mit WCAG-Grenzwerten für Text und Grafik vergleichen. Kontrast ist nur ein Teil der Barrierefreiheitsprüfung.",
    "不透明な前景色と背景色をWCAGの文字・非文字の基準と比較します。コントラストはアクセシビリティ確認の一部です。",
    "将不透明的前景和背景颜色与 WCAG 文字及非文字阈值比较。对比度只是无障碍检查的一部分。",
    "قارن الألوان المعتمة بحدود WCAG للنص والعناصر غير النصية. التباين جزء من مراجعة إمكانية الوصول."
  ],
  "Set the foreground (text) and background colors using the pickers": [
    "रंग चयनकों से पाठ और पृष्ठभूमि के रंग चुनें",
    "Elige los colores de texto y fondo con los selectores",
    "Choisir les couleurs du texte et du fond avec les sélecteurs",
    "Text- und Hintergrundfarbe mit den Farbwählern festlegen",
    "カラーピッカーで文字色と背景色を設定",
    "使用取色器设置文字及背景颜色",
    "حدد لون النص والخلفية باستخدام منتقي الألوان"
  ],
  "Read the contrast ratio and AA/AAA pass/fail badges": [
    "कंट्रास्ट अनुपात और AA/AAA परिणाम देखें",
    "Consulta la relación de contraste y el resultado AA/AAA",
    "Lire le rapport de contraste et le résultat AA/AAA",
    "Kontrastverhältnis und AA/AAA-Ergebnis ablesen",
    "コントラスト比とAA/AAAの適否を確認",
    "查看对比度及 AA/AAA 通过状态",
    "اطّلع على نسبة التباين ونتيجة AA/AAA"
  ],
  "Adjust colors until you hit your target rating": [
    "चाहे गए स्तर तक रंग समायोजित करें",
    "Ajusta los colores hasta alcanzar el nivel deseado",
    "Ajuster les couleurs jusqu’au niveau souhaité",
    "Farben bis zum gewünschten Niveau anpassen",
    "目標の基準を満たすまで色を調整",
    "调整颜色以达到目标等级",
    "عدّل الألوان للوصول إلى المستوى المطلوب"
  ],
  "A passing color pair does not establish that the whole page meets WCAG.": [
    "रंगों की जोड़ी सफल होने से पूरे पृष्ठ का WCAG अनुपालन सिद्ध नहीं होता।",
    "Una combinación aprobada no demuestra que toda la página cumpla WCAG.",
    "Une paire de couleurs conforme ne prouve pas la conformité WCAG de toute la page.",
    "Ein bestandenes Farbpaar belegt keine WCAG-Konformität der gesamten Seite.",
    "色の組み合わせが適合しても、ページ全体のWCAG適合を示すものではありません。",
    "颜色组合通过检查并不表示整个页面符合 WCAG。",
    "نجاح زوج الألوان لا يثبت توافق الصفحة كاملة مع WCAG."
  ],
  "Large text = 18pt+ (or 14pt+ bold) — has lower thresholds": [
    "बड़ा पाठ = 18pt+ (या मोटा 14pt+) — इसकी सीमा कम है",
    "Texto grande = 18pt+ (o 14pt+ en negrita), con umbrales menores",
    "Grand texte = 18pt+ (ou 14pt+ en gras), avec des seuils réduits",
    "Großer Text = 18pt+ (oder 14pt+ fett), mit niedrigeren Grenzwerten",
    "大きな文字は18pt以上（太字は14pt以上）で、基準値が低くなります",
    "大号文字为 18pt+（或粗体 14pt+），适用较低阈值",
    "النص الكبير = 18pt+ (أو 14pt+ عريض)، وله حدود أقل"
  ],
  "Don't rely on color alone; use text labels too": [
    "केवल रंग पर निर्भर न रहें; पाठ लेबल भी दें",
    "No dependas solo del color; añade etiquetas de texto",
    "Ne pas se fier uniquement à la couleur ; ajouter des libellés",
    "Nicht allein auf Farbe verlassen; auch Textbeschriftungen verwenden",
    "色だけに頼らず、文字のラベルも使用",
    "不要仅靠颜色，也应使用文字标签",
    "لا تعتمد على اللون وحده؛ استخدم تسميات نصية أيضًا"
  ],
  "Auditing design system tokens": [
    "डिज़ाइन सिस्टम टोकन की जाँच",
    "Auditar variables del sistema de diseño",
    "Auditer les variables du système de design",
    "Designsystem-Tokens prüfen",
    "デザインシステムのトークンを確認",
    "检查设计系统令牌",
    "مراجعة رموز نظام التصميم"
  ],
  "Pre-launch accessibility checks": [
    "लॉन्च से पहले सुलभता जाँच",
    "Revisar accesibilidad antes del lanzamiento",
    "Vérifier l’accessibilité avant publication",
    "Barrierefreiheit vor Veröffentlichung prüfen",
    "公開前のアクセシビリティ確認",
    "发布前的无障碍检查",
    "فحوص إمكانية الوصول قبل الإطلاق"
  ],
  "Choosing brand colors that work on web": [
    "वेब पर उपयुक्त ब्रांड रंग चुनना",
    "Elegir colores de marca adecuados para la web",
    "Choisir des couleurs de marque adaptées au Web",
    "Geeignete Markenfarben fürs Web wählen",
    "ウェブで使いやすいブランド色の選択",
    "选择适合网页的品牌颜色",
    "اختيار ألوان علامة تجارية مناسبة للويب"
  ],
  "Foreground (text)": [
    "अग्रभूमि (पाठ)",
    "Primer plano (texto)",
    "Premier plan (texte)",
    "Vordergrund (Text)",
    "前景（文字）",
    "前景（文字）",
    "المقدمة (النص)"
  ],
  "Foreground HEX color": [
    "अग्रभूमि HEX रंग",
    "Color HEX del primer plano",
    "Couleur HEX du premier plan",
    "HEX-Vordergrundfarbe",
    "前景のHEXカラー",
    "前景 HEX 颜色",
    "لون المقدمة HEX"
  ],
  "Background HEX color": [
    "पृष्ठभूमि HEX रंग",
    "Color HEX del fondo",
    "Couleur HEX du fond",
    "HEX-Hintergrundfarbe",
    "背景のHEXカラー",
    "背景 HEX 颜色",
    "لون الخلفية HEX"
  ],
  "Enter valid 3- or 6-digit HEX colors for both fields.": [
    "दोनों फ़ील्ड में मान्य 3 या 6 अंकों वाले HEX रंग दर्ज करें।",
    "Introduce colores HEX válidos de 3 o 6 dígitos en ambos campos.",
    "Saisir des couleurs HEX valides à 3 ou 6 chiffres dans les deux champs.",
    "In beiden Feldern gültige HEX-Farben mit 3 oder 6 Stellen eingeben.",
    "両方の欄に有効な3桁または6桁のHEXカラーを入力してください。",
    "请在两个字段中输入有效的 3 位或 6 位 HEX 颜色。",
    "أدخل لونَي HEX صالحين من 3 أو 6 خانات في الحقلين."
  ],
  "The quick brown fox": [
    "तेज़ भूरी लोमड़ी",
    "El veloz zorro marrón",
    "Le vif renard brun",
    "Der flinke braune Fuchs",
    "すばやい茶色のキツネが",
    "敏捷的棕色狐狸",
    "الثعلب البني السريع"
  ],
  "jumps over the lazy dog": [
    "आलसी कुत्ते के ऊपर कूदती है",
    "salta sobre el perro perezoso",
    "saute par-dessus le chien paresseux",
    "springt über den faulen Hund",
    "のんびりした犬を飛び越える",
    "跳过了懒狗",
    "يقفز فوق الكلب الكسول"
  ],
  "Body text — 13px regular weight": [
    "मुख्य पाठ — 13px सामान्य मोटाई",
    "Texto del cuerpo — 13px de peso normal",
    "Corps de texte — 13px normal",
    "Fließtext — 13px normal",
    "本文：13px、標準の太さ",
    "正文 — 13px 常规字重",
    "نص أساسي — 13px بوزن عادي"
  ],
  "Contrast ratio": [
    "कंट्रास्ट अनुपात",
    "Relación de contraste",
    "Rapport de contraste",
    "Kontrastverhältnis",
    "コントラスト比",
    "对比度",
    "نسبة التباين"
  ],
  "Normal text": [
    "सामान्य पाठ",
    "Texto normal",
    "Texte normal",
    "Normaler Text",
    "通常の文字",
    "普通文字",
    "نص عادي"
  ],
  "Large text (18pt+, or 14pt+ bold)": [
    "बड़ा पाठ (18pt+, या मोटा 14pt+)",
    "Texto grande (18pt+ o 14pt+ en negrita)",
    "Grand texte (18pt+, ou 14pt+ en gras)",
    "Großer Text (18pt+ oder 14pt+ fett)",
    "大きな文字（18pt以上、太字は14pt以上）",
    "大号文字（18pt+，或粗体 14pt+）",
    "نص كبير (18pt+ أو 14pt+ عريض)"
  ],
  "UI components / graphics": [
    "UI घटक / ग्राफ़िक्स",
    "Componentes de interfaz / gráficos",
    "Composants d’interface / graphiques",
    "UI-Komponenten / Grafiken",
    "UI部品・グラフィック",
    "UI 组件 / 图形",
    "مكونات الواجهة / الرسومات"
  ],
  "No opaque pixels were found. Choose an image with visible colors.": [
    "कोई अपारदर्शी पिक्सेल नहीं मिला। दिखाई देने वाले रंगों वाली छवि चुनें।",
    "No se encontraron píxeles opacos. Elige una imagen con colores visibles.",
    "Aucun pixel opaque trouvé. Choisir une image aux couleurs visibles.",
    "Keine undurchsichtigen Pixel gefunden. Ein Bild mit sichtbaren Farben wählen.",
    "不透明なピクセルがありません。色の見える画像を選んでください。",
    "未找到不透明像素。请选择具有可见颜色的图片。",
    "لم توجد بكسلات معتمة. اختر صورة بألوان ظاهرة."
  ],
  "Palette extraction failed. Try another image or a browser with Canvas support.": [
    "रंग-पट्टी नहीं निकाली जा सकी। दूसरी छवि या Canvas समर्थित ब्राउज़र आज़माएँ।",
    "No se pudo extraer la paleta. Prueba otra imagen o un navegador compatible con Canvas.",
    "Échec de l’extraction. Essayer une autre image ou un navigateur compatible Canvas.",
    "Palette konnte nicht extrahiert werden. Anderes Bild oder Browser mit Canvas-Unterstützung versuchen.",
    "パレットの抽出に失敗しました。別の画像かCanvas対応ブラウザーを試してください。",
    "调色板提取失败。请尝试其他图片或支持 Canvas 的浏览器。",
    "تعذر استخراج الألوان. جرّب صورة أخرى أو متصفحًا يدعم Canvas."
  ],
  "Image file limit is 32 MiB.": [
    "छवि फ़ाइल की सीमा 32 MiB है।",
    "El límite de imagen es de 32 MiB.",
    "La taille maximale d’image est de 32 MiB.",
    "Die Bilddateigrenze beträgt 32 MiB.",
    "画像ファイルの上限は32 MiBです。",
    "图片文件上限为 32 MiB。",
    "حد ملف الصورة 32 MiB."
  ],
  "Image could not be read or decoded. Choose another image.": [
    "छवि पढ़ी या डिकोड नहीं की जा सकी। दूसरी छवि चुनें।",
    "No se pudo leer o decodificar la imagen. Elige otra.",
    "Impossible de lire ou décoder l’image. En choisir une autre.",
    "Bild konnte nicht gelesen oder dekodiert werden. Anderes Bild wählen.",
    "画像を読み込めませんでした。別の画像を選んでください。",
    "无法读取或解码图片。请选择其他图片。",
    "تعذرت قراءة الصورة أو فكها. اختر صورة أخرى."
  ],
  "Palette copied": [
    "रंग-पट्टी कॉपी हुई",
    "Paleta copiada",
    "Palette copiée",
    "Palette kopiert",
    "パレットをコピーしました",
    "调色板已复制",
    "تم نسخ لوحة الألوان"
  ],
  "Extract dominant colours from any image — HEX, RGB and HSL": [
    "छवि से प्रमुख रंग निकालें — HEX, RGB और HSL",
    "Extrae los colores dominantes de una imagen: HEX, RGB y HSL",
    "Extraire les couleurs dominantes d’une image : HEX, RGB et HSL",
    "Dominante Bildfarben extrahieren – HEX, RGB und HSL",
    "画像から主要な色を抽出：HEX・RGB・HSL",
    "提取图片主色 — HEX、RGB 和 HSL",
    "استخراج الألوان السائدة من صورة — HEX وRGB وHSL"
  ],
  "Color Palette Extractor downsamples your image, then runs k-means clustering in RGB space to find a representative set of dominant colours. Each cluster becomes a swatch with HEX, RGB and HSL values.": [
    "यह टूल छवि को छोटा करके RGB में k-means समूह बनाता है। हर समूह का HEX, RGB और HSL रंग दिखता है।",
    "Reduce la imagen y agrupa sus píxeles mediante k-means en RGB. Cada grupo produce una muestra con valores HEX, RGB y HSL.",
    "L’image est réduite puis regroupée par k-means dans l’espace RGB. Chaque groupe fournit une couleur HEX, RGB et HSL.",
    "Das Bild wird verkleinert und mittels k-means im RGB-Raum gruppiert. Jeder Cluster liefert einen HEX-, RGB- und HSL-Farbwert.",
    "画像を縮小してRGB空間でk-meansクラスタリングを行い、各クラスタのHEX・RGB・HSL値を表示します。",
    "工具先缩小图片，再在 RGB 空间执行 k-means 聚类，为每个色块显示 HEX、RGB 和 HSL 值。",
    "تُصغّر الصورة ثم تُجمع بكسلاتها بخوارزمية k-means في فضاء RGB. تعرض كل مجموعة قيم HEX وRGB وHSL."
  ],
  "Group sampled pixels by RGB distance to build a starting palette. Large backgrounds can dominate; this is not a perceptual salience model.": [
    "RGB दूरी से नमूना पिक्सेल समूहित कर शुरुआती रंग-पट्टी बनाएँ। बड़ी पृष्ठभूमि हावी हो सकती है; यह दृश्य प्रमुखता का मॉडल नहीं है।",
    "Agrupa píxeles por distancia RGB para crear una paleta inicial. Los fondos grandes pueden dominar; no es un modelo de relevancia perceptual.",
    "Regrouper les pixels par distance RGB pour une palette initiale. Les grands fonds peuvent dominer ; ce n’est pas un modèle de saillance perceptive.",
    "Pixel nach RGB-Abstand für eine Ausgangspalette gruppieren. Große Hintergründe können dominieren; dies ist kein Wahrnehmungsmodell.",
    "RGB距離で画素をまとめて初期パレットを作ります。大きな背景が優勢になる場合があり、知覚的な目立ちやすさを評価するモデルではありません。",
    "按 RGB 距离对采样像素分组以生成初始调色板。大面积背景可能占主导；这不是视觉显著性模型。",
    "اجمع البكسلات حسب مسافة RGB لبناء لوحة أولية. قد تهيمن الخلفيات الكبيرة؛ فهذا ليس نموذجًا للبروز الإدراكي."
  ],
  "Pick the palette size (3-16)": [
    "रंग-पट्टी का आकार चुनें (3-16)",
    "Elige el tamaño de la paleta (3-16)",
    "Choisir la taille de palette (3-16)",
    "Palettengröße wählen (3-16)",
    "パレットの色数を選択（3-16）",
    "选择调色板大小（3-16）",
    "اختر حجم لوحة الألوان (3-16)"
  ],
  "Each swatch shows HEX/RGB/HSL plus the % of pixels it represents": [
    "हर रंग में HEX/RGB/HSL और उसके पिक्सेल का प्रतिशत दिखता है",
    "Cada muestra muestra HEX/RGB/HSL y su porcentaje de píxeles",
    "Chaque couleur indique HEX/RGB/HSL et son pourcentage de pixels",
    "Jede Farbe zeigt HEX/RGB/HSL und ihren Pixelanteil",
    "各色にHEX/RGB/HSLと画素の割合を表示",
    "每个色块显示 HEX/RGB/HSL 及所占像素百分比",
    "تعرض كل عينة HEX/RGB/HSL ونسبة البكسلات التي تمثلها"
  ],
  "Copy the whole palette in one click": [
    "एक क्लिक में पूरी रंग-पट्टी कॉपी करें",
    "Copia toda la paleta con un clic",
    "Copier toute la palette en un clic",
    "Gesamte Palette mit einem Klick kopieren",
    "パレット全体をワンクリックでコピー",
    "一键复制整个调色板",
    "انسخ لوحة الألوان كاملة بنقرة واحدة"
  ],
  "Larger k captures more nuance but starts splitting near-identical shades": [
    "बड़ा k अधिक भेद दिखाता है पर मिलते-जुलते रंग भी अलग करता है",
    "Un k mayor captura más matices, pero separa tonos casi iguales",
    "Un k élevé distingue plus de nuances, mais sépare des tons très proches",
    "Größeres k erfasst mehr Nuancen, teilt aber ähnliche Farbtöne auf",
    "kを増やすと細かな違いを捉えますが、近い色も分割します",
    "较大的 k 能捕捉更多细节，但也会拆分近似色",
    "يلتقط k الأكبر درجات أدق لكنه يقسم الألوان المتقاربة"
  ],
  "Near-transparent pixels are skipped — useful for icons with alpha": [
    "लगभग पारदर्शी पिक्सेल छोड़े जाते हैं — अल्फ़ा वाले आइकन के लिए उपयोगी",
    "Se omiten píxeles casi transparentes, útil para iconos con alfa",
    "Les pixels presque transparents sont ignorés, utile pour les icônes avec alpha",
    "Fast transparente Pixel werden übersprungen, hilfreich bei Symbolen mit Alpha",
    "ほぼ透明な画素を除外するため、アルファ付きアイコンにも対応",
    "跳过近乎透明的像素，适用于带透明度的图标",
    "تُتجاهل البكسلات شبه الشفافة، وهذا مفيد للأيقونات ذات ألفا"
  ],
  "Images are sampled at up to 200px on the longest side. Small details may disappear from the resulting palette.": [
    "छवि का लंबा किनारा अधिकतम 200px होता है। छोटे विवरण रंग-पट्टी में छूट सकते हैं।",
    "Las imágenes se muestrean hasta 200px en el lado mayor. Los detalles pequeños pueden desaparecer de la paleta.",
    "L’échantillonnage limite le grand côté à 200px. De petits détails peuvent disparaître de la palette.",
    "Bilder werden mit bis zu 200px an der längsten Seite abgetastet. Kleine Details können in der Palette fehlen.",
    "画像の長辺を最大200pxにして抽出します。小さな細部がパレットに含まれない場合があります。",
    "采样图片最长边不超过 200px。生成的调色板可能遗漏小细节。",
    "تُؤخذ عينات الصورة بعرض أقصى 200px للضلع الأطول. قد تغيب التفاصيل الصغيرة عن اللوحة."
  ],
  "Building a brand colour palette from a moodboard image": [
    "मूडबोर्ड छवि से ब्रांड रंग-पट्टी बनाना",
    "Crear colores de marca desde un panel de inspiración",
    "Créer une palette de marque depuis une planche d’inspiration",
    "Markenpalette aus einem Moodboard erstellen",
    "ムードボード画像からブランドパレットを作成",
    "从情绪板图片构建品牌调色板",
    "بناء لوحة ألوان للعلامة من صورة إلهامية"
  ],
  "Extracting theme colours from app screenshots": [
    "ऐप स्क्रीनशॉट से थीम रंग निकालना",
    "Extraer colores de capturas de aplicaciones",
    "Extraire des couleurs de captures d’application",
    "Themenfarben aus App-Screenshots extrahieren",
    "アプリ画面からテーマ色を抽出",
    "从应用截图中提取主题色",
    "استخراج ألوان السمة من لقطات التطبيقات"
  ],
  "Generating dashboard colours that match a logo": [
    "लोगो से मेल खाते डैशबोर्ड रंग बनाना",
    "Crear colores de panel que combinen con un logotipo",
    "Créer des couleurs de tableau de bord assorties au logo",
    "Zum Logo passende Dashboardfarben erstellen",
    "ロゴに合うダッシュボードの色を作成",
    "生成与徽标匹配的仪表盘颜色",
    "إنشاء ألوان لوحة تحكم تتناسب مع الشعار"
  ],
  "Source image": [
    "स्रोत छवि",
    "Imagen original",
    "Image source",
    "Quellbild",
    "元の画像",
    "源图片",
    "الصورة الأصلية"
  ],
  "Palette size:": [
    "रंगों की संख्या:",
    "Tamaño de paleta:",
    "Taille de palette :",
    "Palettengröße:",
    "パレットの色数：",
    "调色板大小：",
    "حجم اللوحة:"
  ],
  "Palette": [
    "रंग-पट्टी",
    "Paleta",
    "Palette de couleurs",
    "Farbpalette",
    "パレット",
    "调色板",
    "لوحة الألوان"
  ],
  "{count} swatches": [
    "{count} रंग",
    "{count} muestras",
    "{count} couleurs",
    "{count} Farben",
    "{count}色",
    "{count} 个色块",
    "{count} عينات"
  ],
  "No palette available": [
    "कोई रंग-पट्टी उपलब्ध नहीं",
    "No hay paleta disponible",
    "Aucune palette disponible",
    "Keine Palette verfügbar",
    "パレットがありません",
    "无可用调色板",
    "لا توجد لوحة ألوان متاحة"
  ],
  "Computing…": [
    "गणना जारी…",
    "Calculando…",
    "Calcul en cours…",
    "Berechnung…",
    "計算中…",
    "正在计算…",
    "جارٍ الحساب…"
  ],
  "Color copied": [
    "रंग कॉपी हुआ",
    "Color copiado",
    "Couleur copiée",
    "Farbe kopiert",
    "色をコピーしました",
    "颜色已复制",
    "تم نسخ اللون"
  ]
};
