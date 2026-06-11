import React from 'react';
import { ShieldCheck, Zap, HeartHandshake, Eye, Award, DollarSign } from 'lucide-react';

interface WhyUsProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
}

export default function WhyUs({ lang, theme }: WhyUsProps) {
  const content = {
    ar: {
      title: 'لماذا وكالة LuxCod للشريك الرقمي؟',
      subtitle: 'نحن ندمج الإبداع والتنوع متمثلين في أرقى تفاصيل كتابة الأكواد والبرمجيات الذكية مع بوتات المحادثة والتكاملات السحابية المدهشة التي تسهل وتأمت خدماتك وترفع مبيعاتك.',
      cards: [
        {
          id: 'why-quality',
          title: 'هندسة كود معتمد وعالي الأداء',
          desc: 'نلتزم بالتفاصيل وبناء كود برمجي متميز وآمن وسريع متوافق كلياً مع معايير الـ SEO وسياسات قوقل ومبني ليستمر ويتوسع.',
          icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />
        },
        {
          id: 'why-speed',
          title: 'سرعة وكفاءة استثنائية في التسليم',
          desc: 'نحترم أوقاتكم ونسلم المواقع والمنصات وبوتات الواتساب في جدول زمني محكم ومتقن لنطلق مبيعاتك فورياً دون تشتت.',
          icon: <Zap className="w-6 h-6 text-amber-400" />
        },
        {
          id: 'why-support',
          title: 'شراكة نمو حقيقية ومصداقية',
          desc: 'لا ننفذ ونغادر؛ بل نقترح وننصحك بكافة المبادرات التسويقية والحلول التقدمية لتبسيط تجربة زبائنك لضمان أعلى ولاء.',
          icon: <HeartHandshake className="w-6 h-6 text-emerald-400" />
        },
        {
          id: 'why-techs',
          title: 'منظومات بوتات CRM متطورة',
          desc: 'نبتكر سيناريوهات تفاعلية ممتازة للرد والتحقق على واتساب تسهم في أتمتة حجز طابور طويل من الطلبات بلمح البصر.',
          icon: <Eye className="w-6 h-6 text-purple-400" />
        },
        {
          id: 'why-solutions',
          title: 'خبرة عريضة بالسوق المحلي والخليجي',
          desc: 'ندرك كيف تجتذب عميلك في الرياض والمملكة، ونبسط كافة وسائل الدفع والنماذج والاتصالات بضغطة زر جاذبة.',
          icon: <Award className="w-6 h-6 text-pink-400" />
        },
        {
          id: 'why-experience',
          title: 'تسعير عادل وعائد مالي جلي',
          desc: 'باقاتنا واضحة وتقدم قيمة استثمارية مدهشة بمردود مالي مرتفع، دون مصاريف مستترة، ومع دعم فني دوري متواصل.',
          icon: <DollarSign className="w-6 h-6 text-indigo-400" />
        }
      ]
    },
    en: {
      title: 'Why Choose LuxCod Digital Agency?',
      subtitle: 'We synthesize absolute visual prestige with secure software engineering and cutting-edge conversational CRM modules that automate bookings and maximize conversions.',
      cards: [
        {
          id: 'why-quality',
          title: 'Elite Certified Engineering & Code',
          desc: 'Constructing robust, lightweight, clean architectures. Every platform has built-in elite indexing and loading efficiency.',
          icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />
        },
        {
          id: 'why-speed',
          title: 'Frictionless Fast Delivery Loops',
          desc: 'Respecting your deadlines and delivering landing configurations, bots, and digital layouts inside neat schedules.',
          icon: <Zap className="w-6 h-6 text-amber-400" />
        },
        {
          id: 'why-support',
          title: 'Honest Advisory & Growth Alliance',
          desc: 'We consult on performance marketing optimizations and custom CRM strategies to elevate your conversion funnel metrics.',
          icon: <HeartHandshake className="w-6 h-6 text-emerald-400" />
        },
        {
          id: 'why-techs',
          title: 'Advanced Conversational Bots',
          desc: 'Creating direct integration pathways and WhatsApp routing options resulting in effortless client captures.',
          icon: <Eye className="w-6 h-6 text-purple-400" />
        },
        {
          id: 'why-solutions',
          title: 'Extensive Local Market Focus',
          desc: 'Deep knowledge of regional markets within Riyadh and wider KSA, establishing checkout systems that prompt high action.',
          icon: <Award className="w-6 h-6 text-pink-400" />
        },
        {
          id: 'why-experience',
          title: 'High ROI & Upfront Quotations',
          desc: 'No hidden ongoing maintenance rates. We price on real product value and deliver tangible client acquisition results.',
          icon: <DollarSign className="w-6 h-6 text-indigo-400" />
        }
      ]
    }
  };

  const activeContent = content[lang];

  return (
    <section 
      id="why-us" 
      className={`py-24 relative z-10 ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900 border-b border-indigo-50/50'
      }`}
      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
    >
      <div className="absolute inset-0 matrix-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r font-sans ${
            theme === 'dark'
              ? 'from-cyan-400 via-white to-purple-400'
              : 'from-cyan-600 via-slate-800 to-purple-700'
          }`}>
            {activeContent.title}
          </h2>
          <div className="h-1.5 w-24 bg-cyan-400 mx-auto rounded-full mb-6" />
          <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-650'}`}>
            {activeContent.subtitle}
          </p>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeContent.cards.map((card) => (
            <div
              id={card.id}
              key={card.id}
              className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative group flex flex-col justify-between ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-900 hover:border-slate-800'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm shadow-black/[0.02]'
              }`}
            >
              {/* Corner Accent Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors duration-300 pointer-events-none" />

              <div>
                {/* Icon Container */}
                <div className={`p-4 rounded-xl inline-block mb-6 relative border ${
                  theme === 'dark' 
                    ? 'bg-slate-950 border-slate-800' 
                    : 'bg-slate-50 border-slate-100 shadow-inner'
                }`}>
                  {card.icon}
                </div>

                {/* Card Title */}
                <h3 className={`text-xl font-bold mb-3 font-sans ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-650'}`}>
                  {card.desc}
                </p>
              </div>

              {/* Bottom bar indicator */}
              <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600 absolute bottom-0 left-0 transition-all duration-300 rounded-b-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
