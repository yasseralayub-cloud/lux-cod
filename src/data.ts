import { Project, Service, Review, ContentSettings, SEOSettings, SiteSettings } from './types';

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'p1',
    nameAr: 'منصة مجمع الملكة الطبي للتجميل والليزر',
    nameEn: 'Al-Malka Laser & Aesthetic Clinic Platform',
    categoryAr: 'جمال وتجميل',
    categoryEn: 'Beauty & Aesthetics',
    descAr: 'تصميم وتطوير موقع إلكتروني فاخر وحجز مواعيد أوتوماتيكي متكامل بأحدث واجهات تجربة المستخدم لبناء هوية رقمية متميزة للمجمع.',
    descEn: 'High-end bespoke digital booking portal and brand identity developed for Al-Malka laser cosmetic clinic.',
    longDescAr: 'تم تصميم وتطوير هذه المنصة لحل مشاكل حجز الغرف التجميلية وتنسيق المواعيد التلقائية مع العملاء عبر الواتساب. يسهم الموقع في تعريف الزبائن بأحدث باقات العروض وتتبع الجلسات الطبية المتاحة، مع استخدام تصميم زجاجي أنيق بلمسات مريحة وممتازة.',
    longDescEn: 'Designed and developed a premium medical spa and skincare website. Features custom appointment workflows, SMS and WhatsApp automation for bookings, responsive galleries, and slate styling.',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    liveUrl: 'https://wa.me/966506572881',
    techs: ['React', 'Tailwind CSS', 'Vite', 'Node.js', 'WhatsApp API']
  },
  {
    id: 'p2',
    nameAr: 'بوابة مراكز خدمات سبا زن الصحي للاستجمام',
    nameEn: 'Therapeutic Zen Wellness Spa Portal',
    categoryAr: 'مراكز سبا واستجمام',
    categoryEn: 'Spas & Wellness',
    descAr: 'تصميم تجربة رقمية ناعمة ونظام تسويق ذكي لتمكين حجز خدمات المساج والجاكوزي والمساحات العلاجية.',
    descEn: 'A fluid responsive presentation and booking engine developed for luxury Zen Wellness centers.',
    longDescAr: 'قمنا ببناء بوابة متكاملة تعكس الأجواء الهادئة لمراكز سبا زن. تتيح البوابة حجز الجلسات العلاجية ومقاعد الترفيه الفاخرة بسهولة، وتعمل على تحفيز الزائر بسلاسة فائقة بفضل الحركات المخصصة والانتقالات العصرية الهادئة.',
    longDescEn: 'A pristine reservation dashboard built for high-end wellness hotels and spa lines. It optimizes therapist shift logs, custom room bookings, and features a clean dark interface layout.',
    coverImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    liveUrl: 'https://wa.me/966506572881',
    techs: ['Vite', 'React SPA', 'Framer Motion', 'TypeScript']
  },
  {
    id: 'p3',
    nameAr: 'موقع السباك شاهر بالرياض التعريفي',
    nameEn: 'Shaher Plumber Riyadh Portal',
    categoryAr: 'مواقع وعروض شركات',
    categoryEn: 'Corporate & Tech',
    descAr: 'هذا موقع للسباك اسمه شاهر يعرف فيه اعماله ويقدم خدماته ويمكن الاتصال به من خلال الواتس اب او الاتصال من خلال الموقع.',
    descEn: 'This is a website for a plumber named Shaher where he presents his work, offers his services, and can be contacted via WhatsApp or phone call from the website.',
    longDescAr: 'موقع تعريفي واحترافي للسباك المتميز شاهر بالرياض، قمنا بتصميمه وتطويره بالكامل ليعرف بخبراته العريضة في كشف تسربات المياه بأحدث الأجهزة الإلكترونية دون تكسير الجدران، وتأسيس وتمديد خطوط السباكة والصرف للفلل السكنية بطرق حديثة. يتيح الموقع للزوار التواصل والطلب المباشر من خلال قنوات الاتصال والواتساب الفورية بضغطة زر واحدة.',
    longDescEn: 'A high-conversion professional business platform engineered for Shaher the plumber in Riyadh. The platform is designed to list his expert water leak detection, pipe installation, and emergency maintenance services. Visitors can easily dial his mobile line or send pre-filled WhatsApp service requests with a simple tap.',
    coverImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=800',
    liveUrl: 'https://wa.me/966506572881',
    techs: ['React', 'Click-to-Call API', 'WhatsApp Linker', 'Liquid Grid']
  },
  {
    id: 'p4',
    nameAr: 'نظام أتمتة الـ ERP ولوحة تحكم الشركات الذكية',
    nameEn: 'Enterprise System ERP Automation & Analytics',
    categoryAr: 'مواقع وعروض شركات',
    categoryEn: 'Corporate & Tech',
    descAr: 'بناء لوحة تحكم سحابية متقدمة لربط مبيعات التجزئة وأتمتة اتصالات خدمة العملاء بالأجهزة والبرامج.',
    descEn: 'Bespoke SaaS operational dashboard and enterprise CRM automations designed for high-conversion scaling.',
    longDescAr: 'تم تنفيذ لوحة تحكم بالغة الدقة لتتبع العمليات اللوجستية، إدارة الفواتير، ومراقبة الردود الفورية للعملاء. يتميز النظام باتصال مباشر بقواعد البيانات السريعة مع إشعارات دفع وتأكيد المعاملات الفورية.',
    longDescEn: 'A cloud-based CRM and ERP dashboard integrated with smart API webhooks, real-time analytics, secure local session data management, and beautifully exported reports.',
    coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    liveUrl: 'https://wa.me/966506572881',
    techs: ['Node.js', 'ERP Connectors', 'Recharts', 'PostgreSQL Interface']
  }
];

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 's1',
    key: 'web',
    titleAr: 'تصميم وتطوير المواقع والمنصات الذكية',
    titleEn: 'Website Design & Development',
    descAr: 'بناء وتطوير مواقع إلكترونية فاخرة متكاملة وسريعة الاستجابة بأحدث الهياكل البرمجية وتكاملات الـ SEO الفعالة.',
    descEn: 'Designing and building premium, high-speed corporate portals and applications equipped with elite SEO performance.',
    longDescAr: 'نقوم بتصميم مواقع وتطبيقات ويب عصرية وفريدة من نوعها تتناغم مع هوية عملكم المتميز. نستخدم أحدث التقنيات مثل React وVite وتنسيق CSS الفاخر لضمان أسرع وقت استجابة، وتجربة تصفح تزيد من معدل التحويل (Conversion Rate)، مع مراعاة كاملة لتعليمات الكود النظيف والتوافق الكلي مع محركات البحث.',
    longDescEn: 'We craft beautiful, modern, and highly responsive web platforms customized for your target market. Utilizing React, Vite, and tailormade layouts, we ensure your users receive fluid transitions, optimized speeds, and an elite presentation that commands trust and boosts conversion rates.',
    benefitsAr: [
      'هوية برمجية فاخرة وخاصة لعلامتك التجارية لترسيخ التميز في السوق',
      'سرعة فائقة في التصفح وسلاسة تامة تعزز من بقاء الزائر وزيادة المبيعات',
      'تحسين متكامل ومسبق لمحركات البحث (SEO) لضمان الصدارة المجانية',
      'بنية برمجية معتمدة قابلة للتوسع والتطوير المستقبلي بيسر وسهولة'
    ],
    benefitsEn: [
      'Elite, tailored brand identity that builds absolute trust and sets you apart',
      'Lightning-fast page loads and micro-animations maximizing user retention',
      'Pre-optimized SEO structures providing organic Google ranking from day one',
      'Robust, clean codebase that is highly extensible for any future microservices'
    ],
    featuresAr: [
      'تصميم مخصص ١٠٠% ومستوحى بالكامل من هوية وأهداف مجمع أعمالك',
      'تكامل رائع مع أدوات التحليل وسلاسل تتبع سلوك زوار الموقع',
      'دعم كامل ومبسط للغات المتعددة (عربي / إنجليزي) باتساق اتجاهات مريح',
      'تصميم متجاوب ومتناسب مع سائر مقاسات الجوال والأجهزة اللوحية والمكتبية'
    ],
    featuresEn: [
      '100% custom-crafted interface layout reflecting your premium business goals',
      'Seamless implementation of advanced analytic trackers and heat-map pixels',
      'Elite multilingual translation (Arabic RTL / English LTR) with smooth toggles',
      'Pixel-perfect responsiveness across all smartphone views and wide resolutions'
    ],
    deliveryTimeAr: 'من أسبوع إلى أسبوعين كحد أقصى',
    deliveryTimeEn: '7 to 14 business days',
    icon: 'Globe'
  },
  {
    id: 's2',
    key: 'bot',
    titleAr: 'أنظمة بوتات واتساب الذكية والرد التلقائي',
    titleEn: 'Smart WhatsApp Bot Pipelines',
    descAr: 'برمجة وإعداد روبوتات ذكية للدردشة التلقائية والرد الفوري على استفسارات وحجوزات العملاء على مدار الساعة.',
    descEn: 'Engineering seamless automated WhatsApp CRM systems answering customer inquiries and bookings 24/7.',
    longDescAr: 'أتمت المبيعات والخدمات مع البوتات الأحدث لواتساب من LuxCod! نعمل على بناء قنوات اتصال متطورة تبدأ بمجرد نقر العميل على رابط موقعك، حيث يرد البوت تلقائياً وبدقة على التساؤلات، يعرض باقاتك، ويتحقق من تأكيد الحجوزات أو تحويل المحادثات المهمة لفريق المبيعات الخاص بك بدون تدخل يدوي.',
    longDescEn: 'Automate your customer engagement, sales qualifying, and appointment operations using custom-tailored WhatsApp bot workflows. The chatbot interacts with prospects instantly, shares menu selections, records booking parameters, and escalates keys leads to live agents securely.',
    benefitsAr: [
      'توفير هائل في نفقات خدمة العملاء ببدائل برمجية دقيقة للرد التلقائي',
      'خدمة عملاء طيلة ٢٤ ساعة متواصلة في عطل نهاية الأسبوع والمناسبات',
      'معدلات استجابة فائقة السرعة مما يحسم قرارات الشراء ويزيد المبيعات',
      'جمع بيانات العملاء المؤهلين للتسويق وإدارة المحادثات بكفاءة'
    ],
    benefitsEn: [
      'Drastically lower customer support payroll using automated smart script steps',
      'Uninterrupted 24/7 response queues during holidays and peak sales campaigns',
      'Near-zero response latency yielding high sales conversion advantages',
      'Pristine list building of pre-qualified leads for future CRM remarks'
    ],
    featuresAr: [
      'تصميم خرائط حوارية (Flows) مخصصة لمشروعك، متناهية البساطة والسهولة للعميل',
      'إتاحة الحجز التلقائي الكامل وإظهار قوائم الباقات والمنتجات بنقرة زر',
      'ربط الأنظمة الداخلية لإرسال تنبيهات الفواتير وتحديثات الطلبات مع العميل',
      'لوحة تحكم لرصد سلامة الاتصال بالمحادثات وتوجيه الردود المناسبة للمشرفين'
    ],
    featuresEn: [
      'Fluid dialogue tree configurations mapped perfectly to your sales funnel',
      'Interactive list selections, menu cards, and instant automated appointment locks',
      'Dynamic Webhook configs informing clients of their invoices and order statuses',
      'Supervisor cockpit to oversee chats and trigger manual live representative overrides'
    ],
    deliveryTimeAr: 'من ٣ إلى ٥ أيام عمل',
    deliveryTimeEn: '3 to 5 business days',
    icon: 'MessageSquare'
  },
  {
    id: 's3',
    key: 'landing',
    titleAr: 'تصميم صفحات الهبوط الاحترافية سريعة التحول',
    titleEn: 'Premium Landing Page Engineering',
    descAr: 'بناء صفحات هبوط (Landing Pages) ترويجية تهدف بشكل كامل إلى جذب العملاء وزيادة مستويات التسجيل والطلب.',
    descEn: 'Developing conversion-centric single-page landing campaigns tailored to yield maximum marketing ROIs.',
    longDescAr: 'هل تطلق حملات إعلانية على سناب شات، جوجل، أو تيك توك؟ قما بتدعيم حملاتك بصفحات هبوط فائقة التحميل وسريعة التنفيذ صممتها LuxCod. نصمم الواجهات والـ CTA (دعوات الإجراء) بحرص هندسي يجعل من السهل على الزوار ترك بياناتهم أو التواصل الفوري، مما يقلص من تكلفة العميل المؤهل (Lead Cost) ويضمن موثوقية عالية لعروضك التسويقية.',
    longDescEn: 'Creating elite single-focused landing configurations tailored to drive Snapchat, Google, or TikTok promotional traffic. We focus heavily on clear value hooks, high-contrast CTA layouts, and lightning speeds to deflate acquisition costs while establishing top corporate credibility.',
    benefitsAr: [
      'تعظيم العائد على الاستثمار الإعلاني (ROAS) وتقليل تبديد الميزانيات الترويجية',
      'تبسيط وتوجيه تركيز الزائر لمنفعة واحدة واضحة لطلب الخدمة فوراً دون تشتت',
      'سرعة تصفح لافتة تقضي تماماً على ارتداد الزوار قبل تحميل الصفحة',
      'سهولة تتبع البكسلات وأكواد التحليل لمعرفة مصادر المبيعات والتحويل'
    ],
    benefitsEn: [
      'Reduces analytical bounce rates dramatically on paid traffic segments',
      'Streamlines user focus in a unified call-to-action path, escaping clutter',
      'Zero rendering lags, retaining traffic before they contemplate backing out',
      'Pre-configured pixel tracking setups for transparent digital marketing insights'
    ],
    featuresAr: [
      'هيدر إلكتروني متميز وجاذب للانتباه يحتوي على الخطاف التسويقي الرئيسي',
      'نماذج (Forms) تواصل متجاوبة وسريعة للإرسال لتقليل الصعوبات للزبون',
      'شهادات ومراجعات العملاء وتوطين الميزات والضمانات بثقة متكاملة بالصفحة',
      'تكامل مباشر وسلسل للربط مع قواعد البيانات السحابية وجداول إكسل جوجل'
    ],
    featuresEn: [
      'Visually arresting above-the-fold hero with precise, impactful copywriting',
      'Frictionless contact forums requiring minimal fields to maximize lead flow',
      'Rich embedded social validation reviews and visual trust seals',
      'Direct, automatic spreadsheet synchronization and local cloud storage routing'
    ],
    deliveryTimeAr: 'من ٢ إلى ٤ أيام عمل',
    deliveryTimeEn: '2 to 4 business days',
    icon: 'FileText'
  },
  {
    id: 's4',
    key: 'uiux',
    titleAr: 'مراجعة وتطوير تجربة المستخدم ومظهر واجهات التطبيقات',
    titleEn: 'UI/UX Audit & Modern Redesign',
    descAr: 'إعادة تصميم وتحسين تجربة استخدام موقعك أو تطبيقك باستخدام واجهات حديثة ومريحة للعين تزيد التفاعل.',
    descEn: 'Reimagining your applications and sites with aesthetic look, comfortable visual contrast, and fluid usability.',
    longDescAr: 'انطباع العميل الأول بحدد مسار ولائه لخدمتك. فريق LuxCod للـ UI/UX يقدم لك جلسة تشخيصية ومراجعة لسلاسة التصفح وتصميم واجهات تطبيقك الحالية، لنعيد هندستها من الصفر بلمسات فاخرة من التصميم الزجاجي (Glassmorphism)، وبخطوط راقية مريحة ومناسبة تعكس مدى احترافيتك وتسهل من تنقل المستخدم.',
    longDescEn: 'Great user interface designs directly increase sales retention. Our UI/UX team conducts rigorous structural audits on existing apps or outlines premium design wireframes from scratch on Figma, applying sleek modern glass effects, exquisite typography systems, and spacious layouts that keep viewers engaged.',
    benefitsAr: [
      'زيادة واضحة ومستدامة في تفاعل الزوار واستمراريتهم داخل تطبيقك',
      'تسهيل الفهم وانسيابية مسارات الشراء والحجز لتقليل الشكاوي والاضطراب',
      'تطوير صورة مجمع أعمالك كشريك رقمي رائد يلتزم بالمعايير العالمية',
      'تقليل النفقات والمشاكل المصاحبة لأخطاء الاستخدام داخل المنصات والأنظمة'
    ],
    benefitsEn: [
      'Consistent lift in session times and user interactions across views',
      'Dramatically clean payment or selection funnels avoiding interface errors',
      'Elevates your corporate identity, cementing you as a leading pioneer',
      'Saves dev hours by identifying core usage friction early in visual designs'
    ],
    featuresAr: [
      'بناء نماذج أولية (Interactive Wireframes) تفاعلية بالكامل للمعاينة المسبقة',
      'اختبارات تباين الألوان وعناصر سهولة الاستخدام المناسبة لذوي الاحتياجات',
      'خطوط عصرية منسقة بعناية فائقة وتخصيص دقيق لسهولة قراءة النصوص والأسعار',
      'ملفات تسليم فنية منظمة ومعدة للمبرمجين لبناء واجهات مطابقة تماماً للتصميم'
    ],
    featuresEn: [
      'Highly interactive prototyping showcasing active viewport states',
      'Strict color-contrast testing making text legible and compliant to standards',
      'Exquisite typography scaling ensuring clean grids and product tags readability',
      'Developer-friendly asset documentation layout enabling frictionless frontend code builds'
    ],
    deliveryTimeAr: 'من ٤ إلى ٨ أيام عمل',
    deliveryTimeEn: '4 to 8 business days',
    icon: 'Sparkles'
  },
  {
    id: 's5',
    key: 'integrations',
    titleAr: 'ربط وتكامل الأنظمة والواجهات البرمجية الفعالة',
    titleEn: 'System Integrations & Custom APIs',
    descAr: 'ربط موقعك بوابات الدفع الإلكتروني المعتمدة، أنظمة الشحن، والـ CRM لتحقيق أتمتة كاملة لأعمالك.',
    descEn: 'Connecting your platform with payment gateways, logistics, SMS engines, and third-party SaaS APIs.',
    longDescAr: 'تخلص من إدخال البيانات يدوياً بين البرامج المختلفة. نحن نوفر أتمتة كاملة لربط متجرك أو موقعك بنظم الدفع الشهيرة، نظام الفواتير السريع، تتبع الشحنات، وأدوات إدارة العملاء (CRM) مع تهيئة الواجهات البرمجية (APIs) الآمنة التي تعمل بسرعة وخفاء لتبسيط مهام إدارتكم وزيادة الفعالية.',
    longDescEn: 'Eliminate tedious manual data transfers across distinct softwares. We construct reliable middle-layer API integrations merging your website with secure payment gateways, SMS systems, automated billing networks, dynamic mail channels, and CRM logs, ensuring fluid back-office operations.',
    benefitsAr: [
      'أتمتة مبيعات متكاملة وصفرية للجهود اليدوية مما يزيل الأخطاء تماماً',
      'تسريع إنجاز الطلبات والفواتير للعميل فور السداد تلقائياً وبأمان',
      'مراقبة فورية وسريعة لحركات المخزن والمبيعات من مكان واحد مركزي',
      'تقليص نفقات التشغيل والوقت المستهلك للمشرفين في النقل اليدوي للمعلومات'
    ],
    benefitsEn: [
      'Full administrative automation, eradicating human transcription mistakes',
      'Instant payment updates and automatic instant bill generation post checkout',
      'Centralized real-time logging of customer balances and logistics pipeline statuses',
      'Deflates administrative bloat, allowing your staff to focus on real business growth'
    ],
    featuresAr: [
      'ربط بوابات الدفع السعودية والعالمية بسلاسة وأمان تام',
      'تكامل قواعد البيانات السحابية وأتمتة تنبيهات المبيعات عبر البريد والجوال',
      'تهيئة واجهات برمجية آمنة ومحمية من الثغرات وسرقة البيانات',
      'تحديثات فورية لحالة المعاملات وتقارير ذكية دورية ومبسطة للنشاط'
    ],
    featuresEn: [
      'Secure installation of leading reliable localized and global checkout processors',
      'Configuring backend webhooks linked with instant customer notifications',
      'Constructing highly guarded, encrypted end-point APIs preventing code leaks',
      'Robust live transaction sync with dynamic administrative audit logging'
    ],
    deliveryTimeAr: 'من ٥ إلى ١٠ أيام عمل',
    deliveryTimeEn: '5 to 10 business days',
    icon: 'Link'
  },
  {
    id: 's6',
    key: 'nfc',
    titleAr: 'بطاقات الأعمال الرقمية الذكية بتقنية NFC',
    titleEn: 'Luxury NFC Digital Business Cards',
    descAr: 'تصميم وبرمجة بطاقات هوية ذكية مخصصة تتيح مشاركة معلومات الاتصال مع العملاء بملامسة الجوال.',
    descEn: 'Designing premium smart cards sharing your portfolio & contacts with a simple tap on smartphones.',
    longDescAr: 'اجعل حضورك في المعارض والاجتماعات استثنائياً تذكارياً بفضل بطاقات NFC الرقمية الفاخرة من LuxCod. بلمسة واحدة لبطاقتك الأنيقة على هاتف العميل، تفتح له صفحة برمجية مخصصة ومبهرة تحتوي على اسمك الكريم، رقم الجوال المباشر، الروابط الاجتماعية، وموجز خدماتك مع زر الحفظ السريع لتضمينك بجهات اتصاله فوراً.',
    longDescEn: 'Command every boardroom meeting and networking conference with a futuristic NFC business card designed by LuxCod. A simple hover on a smartphone opens a beautifully customized micro-portal showcasing your corporate profile, phone lines, social handles, and calendar with a tap-to-save contact file.',
    benefitsAr: [
      'حسم كفاءة التواصل الاحترافي وترك انطباع رقمي عصري يعكس ريادتك وبقوة',
      'تحديث بياناتك وهواتفك بأي وقت بشكل سحابي دون الحاجة لإعادة طباعة البطاقات',
      'تكامل تام مع الهاتف يتيح للعميل لحفظ اسمك وهاتفك برمشة عين بموقعه',
      'تصميم بطاقة فاخر من الأكريليك أو المعدن بحفر ليزر فاخر يليق بحجم أهدافك'
    ],
    benefitsEn: [
      'Establishes immediate corporate prestige, leaving an unforgettable tech-savvy mark',
      'Dynamically edit your corporate numbers or links in our database anytime for free',
      'Triggers immediate native smartphone prompt saving your details into contacts',
      'Luxury customized physical acrylic or carbon matte card layouts that invite praise'
    ],
    featuresAr: [
      'صفحة هبوط رقمية وتصميم رائع متجاوب وخفيف جداً لسرعة التحميل بالمعاينة',
      'زر تفاعلي مخصص لحفظ ملف جهة الاتصال (vCard) المتكامل مباشرة بجهات الجوال',
      'معايير أمان وتشفير متقدمة لحماية بيانات شركتك وخصوصيتك من النسخ العشوائي',
      'سهولة ربط الإحصائيات لمعرفة عدد الملامسات وقنوات الزوار للملف السحابي'
    ],
    featuresEn: [
      'Ultra-lightweight personalized dynamic profile page designed for swift rendering',
      'Engineered interactive "Add to Contacts" trigger generating a comprehensive vCard file',
      'Hardened database safeguards fully shielding sensitive social sharing links',
      'Administrative dashboard insights recording count of actual card-to-phone contact scans'
    ],
    deliveryTimeAr: 'من ٣ إلى ٦ أيام عمل مع التوريد',
    deliveryTimeEn: '3 to 6 business days including local dispatching',
    icon: 'Smartphone'
  }
];

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'عبد العزيز الشريف',
    comment: 'الموقع الإلكتروني المتطور الخاص بعيادتنا وتكامل حجز المواعيد مع واتساب سهل العمل بشكل يومي، الواجهات زجاجية فاخرة جداً والعملاء يمدحون سلاسة الاستخدام بشكل مستمر.',
    rating: 5,
    status: 'approved',
    date: '2026-05-18'
  },
  {
    id: 'r2',
    name: 'بشاير آل سعود',
    comment: 'تجربة حجز مواعيد جلسات التجميل والعروض والخدمات ممتازة جداً. الموقع سريع الاستجابة وذو تصميم مريح وسلس للغاية في تصفح سائر التفاصيل والحواف بوضوح.',
    rating: 5,
    status: 'approved',
    date: '2026-05-22'
  },
  {
    id: 'r3',
    name: 'ماجد الحربي',
    comment: 'البوت المخصص لواتساب ونظام الحجز الذكي لخدمات السبا والاستجمام وفر علينا الكثير من الجهد والوقت، والعملاء معجبون للغاية بجاذبية البوابة وسرعة استجابتها.',
    rating: 5,
    status: 'approved',
    date: '2026-06-02'
  },
  {
    id: 'r4',
    name: 'خالد الودعاني',
    comment: 'رائع جداً ومبهر. بوابة الحجز التلقائي تعطي راحة تامة للعميل في اختيار الأوقات مع المعالجين والمساحات بطريقة ذكية، والتصميم متناسق وجريء بلمساته العصرية.',
    rating: 4,
    status: 'approved',
    date: '2026-06-03'
  },
  {
    id: 'r5',
    name: 'شاهر العتيبي',
    comment: 'عمل احترافي ومتقن جداً. الموقع مخصص لخدمات السباكة وكشف التسربات ويعرف بأعمالي السابقة بوضوح، مما مكن مئات العملاء من الاتصال الهاتفي أو التواصل عبر الواتساب فوراً وبضغطة زر.',
    rating: 5,
    status: 'approved',
    date: '2026-06-07'
  },
  {
    id: 'r6',
    name: 'أبو فهد العجمي',
    comment: 'أعجبتني البساطة والسرعة البالغة في تصميم موقع السباكة وتوفير زر ذكي للاتصال الفوري بدون أي تعقيدات برمجية، تجربة رائعة وتواصل مستمر.',
    rating: 5,
    status: 'approved',
    date: '2026-06-08'
  },
  {
    id: 'r7',
    name: 'سارة الغامدي',
    comment: 'لوحة تحكم نظام إدارة الشركات ERP مذهلة ومربوطة بالكامل لتمكين المبيعات وأتمتة اتصالات العملاء مع قواعد البيانات السحابية، سهلت من مهام إدارتنا اليومية بشكل كلي.',
    rating: 5,
    status: 'approved',
    date: '2026-06-08'
  },
  {
    id: 'r8',
    name: 'فيصل السيف',
    comment: 'المنصة ممتازة جداً وتحديثاتها حية وفورية وتصميمها متجاوب للغاية، أرشفة ممتازة ومعدلات سريعة للتحويل سهلت علينا إنجاز التقارير اللوجستية بدقة متناهية.',
    rating: 5,
    status: 'approved',
    date: '2026-06-09'
  }
];

export const DEFAULT_CONTENT_SETTINGS: ContentSettings = {
  heroTitleAr: 'شريكك البرمجي المعتمد لتأسيس الويب وبوتات واتساب المتكاملة',
  heroTitleEn: 'Certified Software Partner For Elite Custom Web & Automation Pipelines',
  heroSubtitleAr: 'نحن في وكالة LuxCod الرقمية نقوم بجمع طموحاتكم الخلاقة ونصهرها بأعرق معايير هندسة البرمجيات وتجربة المستخدم الراقية. نبتكر صفحات الهبوط الفاخرة، والأنظمة السحابية الداعمة لقرارات الحجز والتكاملات الذكية لأعمال متميزة.',
  heroSubtitleEn: 'At LuxCod Digital Agency, we transform your visionary ideas into world-class software and websites. We engineer high-conversion landing pages, smart automated WhatsApp bot CRM loops, and sleek custom dashboard views designed to maximize conversion.',
  statProjects: 140,
  statCustomers: 120,
  statExperience: 6,
  statServices: 6
};

export const DEFAULT_SEO_SETTINGS: SEOSettings = {
  metaTitleAr: 'وكالة LuxCod الرقمية بالرياض | هندسة وتطوير الويب وبوتات واتساب الفعالة',
  metaTitleEn: 'LuxCod Agency Riyadh | Premium Web Design, UI/UX & Smart Conversational Bots',
  metaDescAr: 'LuxCod هي وكالة رقمية متميزة متخصصة بتطوير منصات الويب الفاخرة، تصميم تجارب استخدام أنيقة UI/UX، برمجة بوتات واتساب CRM، وتكامل الأنظمة والـ APIs لرفع أرباح أعمالك السكنية والتجارية بصورة فائقة.',
  metaDescEn: 'LuxCod Riyadh is a premium digital agency executing bespoke software configurations. We design elegant, state-of-the-art landing pages, custom CRM integrations, automated messaging workflows, and secure databases.',
  ogType: 'website',
  sitemapAuto: true
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: '+966506572881',
  whatsapp: '+966506572881',
  email: 'info@luxcod.com',
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
  linkedin: 'https://linkedin.com',
  instagram: 'https://instagram.com',
  theme: {
    primaryColor: '#00F0FF', // glowing cyan futuristic digital neon color
    glassOpacity: 0.15,
    accentGlow: true
  },
  telegramBotToken: '',
  telegramChatId: '',
  telegramEnabled: false,
  externalApiUrl: '',
  externalApiKey: '',
  externalApiEnabled: false,
  externalApiMethod: 'PUT'
};
