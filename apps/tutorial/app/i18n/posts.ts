
// Type for translated post metadata
export type PostMetadata = {
  title: string;
  summary: string;
};

// Dictionary of post slugs to their translated metadata
export type PostsDictionary = Record<string, Record<string, PostMetadata>>;

// This could be expanded with more posts as needed
export const postsDictionary: PostsDictionary = {
  'section-1': {
    en: {
      title: 'Basic HTML Scraping: The First Steps',
      summary: 'Learn the fundamentals of web scraping through hands-on exercises with static HTML pages',
    },
    ru: {
      title: 'Основы HTML-скрапинга: Первые шаги',
      summary: 'Изучите основы веб-скрапинга через практические упражнения со статическими HTML-страницами',
    },
    es: {
      title: 'Scrapeo HTML Básico: Los Primeros Pasos',
      summary: 'Aprende los fundamentos del web scraping a través de ejercicios prácticos con páginas HTML estáticas',
    },
    zh: {
      title: '基础HTML抓取：第一步',
      summary: '通过静态HTML页面的实践练习学习网络爬虫的基础知识',
    },
    ja: {
      title: '基本的なHTMLスクレイピング：最初のステップ',
      summary: '静的HTMLページを使った実践的な演習を通じてWebスクレイピングの基礎を学ぶ',
    },
    hi: {
      title: 'बेसिक HTML स्क्रैपिंग: पहले कदम',
      summary: 'स्टेटिक HTML पेजों के साथ हाथों-हाथ अभ्यास के माध्यम से वेब स्क्रैपिंग की बुनियादी बातें सीखें',
    },
    ta: {
      title: 'அடிப்படை HTML ஸ்கிராப்பிங்: முதல் படிகள்',
      summary: 'நிலையான HTML பக்கங்களுடன் நடைமுறை பயிற்சியின் மூலம் வலை ஸ்கிராப்பிங்கின் அடிப்படைகளை கற்றுக்கொள்ளুங்கள்',
    },
    gu: {
      title: 'મૂળભૂત HTML સ્ક્રેપિંગ: પ્રથમ પગલાં',
      summary: 'સ્ટેટિક HTML પેજો સાથે હાથ-પર-હાથ કવાયત દ્વારા વેબ સ્ક્રેપિંગના મૂળભૂત સિદ્ધાંતો શીખો',
    },
    fa: {
      title: 'اسکرپینگ پایه HTML: قدم‌های نخست',
      summary: 'مبانی اسکرپینگ وب را از طریق تمرین‌های عملی با صفحات HTML استاتیک بیاموزید',
    },
    ur: {
      title: 'بنیادی HTML اسکریپنگ: پہلے قدم',
      summary: 'جامد HTML صفحات کے ساتھ عملی مشقوں کے ذریعے ویب اسکریپنگ کی بنیادی باتیں سیکھیں',
    },
    ar: {
      title: 'كشط HTML الأساسي: الخطوات الأولى',
      summary: 'تعلم أساسيات كشط الويب من خلال التمارين العملية مع صفحات HTML الثابتة',
    },
    tr: {
      title: 'Temel HTML Kazıma: İlk Adımlar',
      summary: 'Statik HTML sayfalarıyla uygulamalı egzersizler aracılığıyla web kazımanın temellerini öğrenin',
    },
  },
  'section-2': {
    en: {
      title: 'JavaScript-Rendered Content',
      summary: 'Single-page sites where content dynamically loads via JavaScript + infinite scroll / lazy loading',
    },
    hi: {
      title: 'JavaScript-रेंडर की गई सामग्री',
      summary: 'एकल-पृष्ठ साइट जहाँ सामग्री JavaScript + अनंत स्क्रॉल / लेज़ी लोडिंग के माध्यम से गतिशील रूप से लोड होती है',
    },
    ta: {
      title: 'JavaScript-ரெண்டர் செய்யப்பட்ட உள்ளடக்கம்',
      summary: 'ஒற்றை-பக்க தளம் जहাँ உள்ளடக்கம் JavaScript + முடிவில்லா ஸ்க்ரோல் / அழுக்கு ஏற்றுதல் மூலம் இயங்குதளமாக ஏற்றப்படுகிறது',
    },
    gu: {
      title: 'JavaScript-રેન્ડર્ડ કન્ટેન્ટ',
      summary: 'સિંગલ-પેજ સાઇટ જ્યાં કન્ટેન્ટ JavaScript + અનંત સ્ક્રોલ / લેઝી લોડિંગ દ્વારા ડાયનેમિક રીતે લોડ થાય છે',
    },
    fa: {
      title: 'محتوای رندر شده با جاوااسکریپت',
      summary: 'سایت تک صفحه‌ای که محتوا به صورت پویا از طریق جاوااسکریپت + اسکرول بی‌نهایت / بارگذاری تنبل',
    },
    ur: {
      title: 'جاوا اسکرپٹ سے رینڈر کیا گیا مواد',
      summary: 'واحد صفحہ سائٹ جہاں مواد جاوا اسکرپٹ کے ذریعے متحرک طور پر لوڈ ہوتا ہے + لامحدود سکرول / سست لوڈنگ',
    },
    ar: {
      title: 'المحتوى المعروض بـ JavaScript',
      summary: 'موقع صفحة واحدة حيث يتم تحميل المحتوى ديناميكياً عبر JavaScript + التمرير اللانهائي / التحميل البطيء',
    },
    tr: {
      title: 'JavaScript ile Oluşturulan İçerik',
      summary: 'İçeriğin JavaScript ile dinamik olarak yüklendiği tek sayfa sitesi + sonsuz kaydırma / tembel yükleme',
    },
  },
  'section-3': {
    en: {
      title: 'Multi-Page Crawling',
      summary: 'Master techniques for crawling interconnected websites, managing sitemaps, and handling duplicate content',
    },
    hi: {
      title: 'मल्टी-पेज क्रॉलिंग',
      summary: 'इंटरकनेक्टेड वेबसाइटों को क्रॉल करने, साइटमैप का प्रबंधन करने और डुप्लिकेट कंटेंट को संभालने की तकनीकों में महारत हासिल करें',
    },
    ta: {
      title: 'பல-பக்க ஊர்வலம்',
      summary: 'இணையுடன் இணைக்கப்பட்ட வலைதளங்களை ஊர்ந்து செல்வது, சைட்மேப்களை நிர்வகிப்பது மற்றும் நகல் உள்ளடக்கத்தை கையாள்வது ஆகியவற்றின் நுட்பங்களில் தேர்ச்சி பெறுங்கள்',
    },
    gu: {
      title: 'મલ્ટિ-પેજ ક્રોલિંગ',
      summary: 'પરસ્પર જોડાયેલી વેબસાઇટ્સને ક્રોલ કરવા, સાઇટમેપ્સ મેનેજ કરવા અને ડુપ્લિકેટ કન્ટેન્ટ હેન્ડલ કરવાની તકનીકોમાં માસ્ટરી મેળવો',
    },
    fa: {
      title: 'خزیدگی چند صفحه‌ای',
      summary: 'تکنیک‌های خزیدگی وب‌سایت‌های مترابط، مدیریت نقشه‌های سایت، و مدیریت محتوای تکراری را فراگیرید',
    },
    ur: {
      title: 'کثیر صفحاتی کرالنگ',
      summary: 'باہم جڑے ہوئے ویب سائٹس کرال کرنے، سائٹ میپس کا انتظام، اور ڈپلیکیٹ مواد سنبھالنے کی تکنیکوں میں مہارت حاصل کریں',
    },
    ar: {
      title: 'الزحف متعدد الصفحات',
      summary: 'إتقان تقنيات زحف المواقع المترابطة وإدارة خرائط الموقع والتعامل مع المحتوى المكرر',
    },
    tr: {
      title: 'Çok Sayfa Tarama',
      summary: 'Birbirine bağlı web sitelerini tarama, site haritası yönetimi ve çokün içerik işleme tekniklerinde ustalaşın',
    },
  },
  'section-4': {
    en: {
      title: 'Advanced Website Interaction and APIs',
      summary: 'Learn to scrape API-driven sites, handle forms and login, and interact with GraphQL endpoints.',
    },
    hi: {
      title: 'एडवांस्ड वेबसाइट इंटरैक्शन और APIs',
      summary: 'API-संचालित साइटों को स्क्रैप करना, फॉर्म और लॉगिन को हैंडल करना, और GraphQL endpoints के साथ इंटरैक्ट करना सीखें।',
    },
    ta: {
      title: 'மேம்பட்ட வலைதள தொடர்பு மற்றும் APIs',
      summary: 'API-இயக்கப்படும் தளங்களை ஸ்கிராப் செய்வது, படிவங்கள் மற்றும் உள்நுழைவைக் கையாள்வது, மற்றும் GraphQL endpoints உடன் தொடர்புகொள்வது கற்றுக்கொள்ளுங்கள்।',
    },
    gu: {
      title: 'અદ્યતન વેબસાઇટ ઇન્ટરેક્શન અને APIs',
      summary: 'API-સંચાલિત સાઇટ્સ સ્ક્રેપ કરવાનું, ફોર્મ અને લૉગિન્સ હેન્ડલ કરવાનું, અને GraphQL એન્ડપોઇન્ટ્સ સાથે ઇન્ટરેક્ટ કરવાનું શીખો.',
    },
    fa: {
      title: 'تعامل پیشرفته وب‌سایت و APIها',
      summary: 'اسکرپینگ سایت‌های مبتنی بر API، مدیریت فرم‌ها و ورودی‌ها، و تعامل با نقاط پایانی GraphQL را بیاموزید.',
    },
    ur: {
      title: 'اعلیٰ درجے کی ویب سائٹ انٹرایکشن اور APIs',
      summary: 'API پر مبنی سائٹس کو اسکریپ کرنا، فارمز اور لاگ انز کو سنبھالنا، اور GraphQL endpoints کے ساتھ تعامل کرنا سیکھیں۔',
    },
    ar: {
      title: 'التفاعل المتقدم مع المواقع وواجهات برمجة التطبيقات',
      summary: 'تعلم كشط المواقع القائمة على API والتعامل مع النماذج وتسجيلات الدخول والتفاعل مع نقاط نهاية GraphQL.',
    },
    tr: {
      title: 'İleri Düzey Web Sitesi Etkileşimi ve API\'ler',
      summary: 'API tabanlı siteleri kazımayı, formları ve girişleri işlemeyi ve GraphQL uç noktalarıyla etkileşim kurmayı öğrenin.',
    },
  },
  'section-5': {
    en: {
      title: 'Media + Non-Text Scraping',
      summary: 'Learn scraping techniques beyond text: extracting images with metadata, downloading and parsing PDFs, and capturing video information.',
    },
    hi: {
      title: 'मीडिया + नॉन-टेक्स्ट स्क्रैपिंग',
      summary: 'टेक्स्ट से परे स्क्रैपिंग की तकनीकें सीखें: मेटाडेटा के साथ images निकालना, डाउनलोड करना, और PDFs का विश्लेषण, और video जानकारी कैप्चर करना।',
    },
    ta: {
      title: 'ஊடகம் + உரை-அல்லாத ஸ்கிராப்பிங்',
      summary: 'உரைக்கு அப்பால் ஸ்கிராப்பிங் நுட்பங்களைக் கற்றுக்கொள்ளுங்கள்: மெட்டாடேட்டாவுடன் படங்களைப் பிரித்தெடுத்தல், பதிவிறக்கம் மற்றும் PDFs ஐ பார்ச்சிங் மற்றும் வீடியோ தகவல்களைப் பிடிக்கவும்।',
    },
    gu: {
      title: 'મીડિયા + બિન-ટેક્સ્ટ સ્ક્રેપિંગ',
      summary: 'ટેક્સ્ટથી આગળ સ્ક્રેપિંગની તકનીકો શીખો: મેટાડેટા સાથે છબીઓ એક્સ્ટ્રેક્ટ કરવી, ડાઉનલોડ કરવી, અને PDFs પાર્સ કરવી, અને વિડિયો માહિતી કેપ્ચર કરવી.',
    },
    fa: {
      title: 'رسانه + اسکرپینگ غیر متنی',
      summary: 'تکنیک‌های اسکرپینگ فراتر از متن را بیاموزید: استخراج تصاویر با متادیتا، دانلود و تجزیه PDF، و گرفتن اطلاعات ویدیو.',
    },
    ur: {
      title: 'میڈیا + غیر متنی اسکریپنگ',
      summary: 'متن سے آگے اسکریپنگ کی تکنیکیں سیکھیں: metadata کے ساتھ تصاویر نکالنا، PDFs ڈاؤن لوڈ اور پارس کرنا، اور ویڈیو کی معلومات حاصل کرنا۔',
    },
    ar: {
      title: 'الوسائط + الكشط غير النصي',
      summary: 'تعلم تقنيات الكشط ما وراء النص: استخراج الصور مع البيانات الوصفية وتحميل وتحليل ملفات PDF وجمع معلومات الفيديو.',
    },
    tr: {
      title: 'Medya + Metin Dışı Kazıma',
      summary: 'Metinden öteye kazıma tekniklerini öğrenin: metadata ile resim çıkarma, PDF indirme ve ayrıştırma, video bilgilerini yakalama.',
    },
  },
  'section-6': {
    en: {
      title: 'Handling Web Crawling Defenses',
      summary: 'Learn to navigate the complex world of anti-scraping defenses while maintaining ethical scraping practices',
    },
    hi: {
      title: 'वेब क्रॉलिंग डिफेंस को संभालना',
      summary: 'नैतिक स्क्रैपिंग प्रथाओं को बनाए रखते हुए anti-scraping defenses की जटिल दुनिया को navigate करना सीखें',
    },
    ta: {
      title: 'வலை ஊர்வல பாதுகாப்புகளைக் கையாளுதல்',
      summary: 'நெறிமுறை ஸ்கிராப்பிங் நடைமுறைகளைப் பராமரிக்கும் போது anti-scraping defenses இன் சிக்கலான உலகத்தை navigate செய்வதைக் கற்றுக்கொள்ளுங்கள்',
    },
    gu: {
      title: 'વેબ ક્રોલિંગ સંરક્ષણોનું હેન્ડલિંગ',
      summary: 'નૈતિક સ્ક્રેપિંગ પ્રથાઓ જાળવીને એન્ટિ-સ્ક્રેપિંગ સંરક્ષણોની જટિલ દુનિયામાં નેવિગેટ કરવાનું શીખો',
    },
    fa: {
      title: 'مدیریت دفاع‌های خزیدگی وب',
      summary: 'چگونگی ناوبری در دنیای پیچیده دفاع‌های ضد اسکرپینگ را بیاموزید در حالی که شیوه‌های اخلاقی اسکرپینگ را حفظ می‌کنید',
    },
    ur: {
      title: 'ویب کرالنگ کے دفاعی نظاموں سے نمٹنا',
      summary: 'اخلاقی اسکریپنگ کے طریقوں کو برقرار رکھتے ہوئے anti-scraping دفاعات کی پیچیدہ دنیا میں نیویگیٹ کرنا سیکھیں',
    },
    ar: {
      title: 'معالجة دفاعات زحف الويب',
      summary: 'تعلم كيفية التنقل في عالم دفاعات مكافحة الكشط المعقد مع الحفاظ على ممارسات الكشط الأخلاقية',
    },
    tr: {
      title: 'Web Tarama Savunmalarıyla Başa Çıkma',
      summary: 'Etik kazıma uygulamalarını korurken anti-kazıma savunmalarının karmaşık dünyasında nasıl gezineceğinizi öğrenin',
    },
  },
  'section-7': {
    en: {
      title: 'Large-Scale + Unstructured Web Crawling',
      summary: 'Messy and unstructured data + AI-assisted parsing for search crawlers',
    },
    hi: {
      title: 'बड़े पैमाने पर + असंरचित वेब क्रॉलिंग',
      summary: 'गंदे और असंरचित डेटा + search crawlers के लिए AI-सहायक parsing',
    },
    ta: {
      title: 'பெரிய அளவிலான + கட்டமைக்கப்படாத வலை ஊர்வலம்',
      summary: 'குழப்பமான மற்றும் கட்டமைக்கப்படாத தரவு + தேடல் ஊர்வலிகளுக்கான AI-உதவி பார்ச்சிங்',
    },
    gu: {
      title: 'મોટા પાયે + અસંરચિત વેબ ક્રોલિંગ',
      summary: 'અવ્યવસ્થિત અને અસંરચિત ડેટા માટે AI-સહાયિત પાર્સિંગ + સર્ચ ક્રોલર્સ',
    },
    fa: {
      title: 'خزیدگی وب مقیاس بزرگ + غیرساختاریافته',
      summary: 'تجزیه با کمک هوش مصنوعی برای داده‌های آشفته و غیرساختاریافته + خزنده‌های جستجو',
    },
    ur: {
      title: 'بڑے پیمانے + غیر منظم ویب کرالنگ',
      summary: 'بکھرے ہوئے اور غیر منظم ڈیٹا کے لیے AI سے معاون تجزیہ + سرچ کرالرز',
    },
    ar: {
      title: 'زحف الويب واسع النطاق + غير منظم',
      summary: 'تحليل بمساعدة الذكاء الاصطناعي للبيانات المبعثرة وغير المنظمة + زواحف البحث',
    },
    tr: {
      title: 'Büyük Ölçekli + Yapılandırılmamış Web Tarama',
      summary: 'Dağınık ve yapılandırılmamış veriler için AI destekli ayrıştırma + arama tarayıcıları',
    },
  },
};

// Get post metadata for a specific locale
export function getPostMetadata(slug: string, locale: string): PostMetadata | null {
  if (!postsDictionary[slug]) {
    return null;
  }
  
  // Return metadata for requested locale or fall back to English
  return postsDictionary[slug][locale] || postsDictionary[slug]['en'];
}
