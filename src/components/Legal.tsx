import { X, ShieldCheck, Lock, FileText, FileSpreadsheet } from 'lucide-react';

interface LegalProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
  activePolicy: 'privacy' | 'terms' | 'cookies' | 'protection' | null;
  onClose: () => void;
}

export default function Legal({ lang, theme, activePolicy, onClose }: LegalProps) {
  if (!activePolicy) return null;

  const content = {
    privacy: {
      titleAr: 'سياسة الخصوصية وسرية المعلومات',
      titleEn: 'Privacy & Confidentiality Scope',
      icon: <Lock className="w-8 h-8 text-cyan-400" />,
      bodyAr: `نرحب بكم في LuxCod. نحن نلتزم بحماية خصوصية بيانات عملائنا وهوياتهم الرقمية بأقصى درجات المسؤولية.

١. جمع المعلومات واستخدامها:
نقوم بجمع البيانات اللازمة للتواصل كاسمكم، ورقم الاتصال وتفاصيل فكرة مشروعكم لغرض تقديم خدمات التصميم وأتمتة الواتساب الفاخرة بدقة متكاملة.

٢. سرية الفكرة والبيانات:
جميع الأفكار التجارية والبرمجية التي تشاركونها مع فريق العمل لدينا محمية وتحظى بسرية قانونية كاملة ولا يتم الكشف عنها أو بيعها لأي جهة ثالثة تحت أي ظرف.

٣. أمن الخوادم والمعلومات:
نطبق معايير وتشفيرات حماية تقنية متقدمة لضمان أمان البيانات عبر السيرفرات وقواعد بياناتنا المشتركة.`,
      bodyEn: `Welcome to LuxCod. We treat your creative business proposals and project parameters with absolute confidentiality and physical server defense systems.

1. Information Gathering:
We collect relevant contact criteria (enterprise name, telephone numbers, and blueprint drafts) exclusively to synthesize tailored designs and smart WhatsApp responders.

2. absolute Trade-Secret Protection:
Every single blueprint, strategy, API target or custom request you share remains contractually classified. We never sell, distribute, or license clients information to third parties.

3. Cyber Defense:
We implement top cryptographic protocols shielding databases and synced assets from external access.`
    },
    terms: {
      titleAr: 'الشروط والأحكام العامة للتعامل',
      titleEn: 'Terms & Institutional Agreements',
      icon: <FileSpreadsheet className="w-8 h-8 text-indigo-400" />,
      bodyAr: `تنظم هذه الشروط العلاقة والخدمات التقنية الموفرة من قبل LuxCod لشركاء النجاح.

١. تقديم ونطاق الخدمات:
يتم الاتفاق كتابياً أو عبر الرسائل والاجتماعات على النطاق الدقيق للعمل البرمجي والمواصفات الفنية وجداول ومواعيد التسليم المطلوبة.

٢. حقوق الملكية الفكرية:
بعد سداد الرسوم المتفق عليها، تؤول كامل حقوق الملكية الفكرية، الأكواد البرمجية، وتصميمات الواجهات للموقع أو البوت إلى العميل بشكل كامل ونهائي دون أي ادعاء متبقٍ من جانبنا.

٣. التزامات العميل:
العميل مسؤول بشكل مباشر عن قانونية المحتوى الذي يقدمه وعن استخدامه السليم لخدمات الواتساب الآلية بما يتطابق مع شروط مزود الفيس بوك (Meta).`,
      bodyEn: `These Terms govern the master service provision between LuxCod engineers and client enterprises.

1. Service Scope:
The exact functional specifications, custom REST endpoints, UI view boundaries, and deployment frames are confirmed in official proposals.

2. absolute Source Code Ownership:
Upon final clearing, 100% of intellectual property, Figma design files, database architectures, and customized codebases transfer exclusively to the client.

3. Compliance:
The client is solely accountable for regulatory compliance concerning content posted or handled by custom WhatsApp messenger workflows.`
    },
    cookies: {
      titleAr: 'سياسة ملفات تعريف الارتباط والتعريف',
      titleEn: 'Cookie & Tracking Optimization',
      icon: <FileText className="w-8 h-8 text-yellow-400" />,
      bodyAr: `نستخدم في LuxCod ملفات تعريف الارتباط لتقديم تجربة تصفح سريعة ومنظمة لشركائنا.

١. ما هي الكوكيز؟
ملفات نصية صغيرة تحفظ على حاسوبك لتسريع معاودة الزيارة وحفظ لغتك المفضلة (عربية أو إنكليزية) ووضع المظهر المناسب لك.

٢. كيف نستغلها؟
لتحسين مرونة التنقل ورفع معدل التحميل وحل أي تشتت بصري في رحلة تصفح موقعنا. لا تستغل لأي رصد شخصي خارج إطار تحسين المنصة.`,
      bodyEn: `Our website architecture leverages state caching to ensure high fluid responsiveness and speedy browser renders.

1. Browser Caching:
We leverage lightweight browser local indices to securely store your localized preferences (RTL/LTR settings) and visual mode selections (dark/light toggles).

2. Analytics Tracking:
Anonymous visit sessions are measured solely to improve server response alignments and optimize our organic Lighthouse speed grades.`
    },
    protection: {
      titleAr: 'سياسة أمن وحماية البيانات الفائقة',
      titleEn: 'Strict Data Protection Policy',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      bodyAr: `إن حماية أمن معلوماتك وبياناتك المالية والخدماتية في LuxCod تعد الركن الأساسي لبناء ثقتنا المستمرة.

١. الحماية ضد الاختراق:
تخضع جميع بوابات التواصل والتكاملات التقنية التي نوفرها لعملائنا لطبقات صارمة من الفحص والأمن التقني لتفادي أي ثغرات أو محاولات عبث بالمعلومات.

٢. مشاركة وتصدير البيانات:
نلتزم بعدم تمكين أي تطبيق أو نظام خارجي من سحب بيانات عملائنا أو سجلات مبيعات بوت الواتساب إلا بالربط الآمن والمصادق عليه كلياً من إدارتكم مسبقاً وبشكل مرخص.`,
      bodyEn: `Securing your cloud-hosted records, customer databases, and physical NFC configurations lies at the heart of our engineering compliance.

1. Structural Hardening:
Every backend API constructed or webhook routed is checked to block standard vectors and guarantee continuous data integrity.

2. Access Privilege:
Database sync tools are isolated via cryptographic tokens, which are never exposed to clients, ensuring continuous protection of operational parameters.`
    }
  };

  const active = content[activePolicy];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto pt-24 pb-8">
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 my-4 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        
        {/* Header */}
        <div className={`p-6 sm:p-8 border-b ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        } flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-150'}`}>
              {active.icon}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {lang === 'ar' ? active.titleAr : active.titleEn}
              </h3>
              <span className="text-[10px] uppercase font-mono tracking-wider opacity-50 block mt-1">LuxCod Legal Protocol</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-lg cursor-pointer ${
              theme === 'dark' ? 'hover:bg-slate-900 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Text Container */}
        <div className="p-6 sm:p-8 max-h-[50vh] overflow-y-auto">
          <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            {lang === 'ar' ? active.bodyAr : active.bodyEn}
          </p>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        } flex items-center justify-end`}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs bg-cyan-400 hover:shadow-md hover:shadow-cyan-455/20 transition-all text-center cursor-pointer"
          >
            {lang === 'ar' ? 'قرأت وأوافق' : 'I Understand & Agree'}
          </button>
        </div>

      </div>
    </div>
  );
}
