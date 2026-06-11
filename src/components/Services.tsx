import { useState } from 'react';
import { Globe, MessageSquare, FileText, Sparkles, Link as LinkIcon, Smartphone, X, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
  services: Service[];
  whatsappNumber: string;
}

// Map icon string to actual Lucide component safely
function ServiceIcon({ iconName, className }: { iconName: string, className?: string }) {
  switch (iconName) {
    case 'Globe':
      return <Globe className={className} />;
    case 'MessageSquareIcon':
    case 'MessageSquare':
      return <MessageSquare className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Link':
      return <LinkIcon className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    default:
      return <Globe className={className} />;
  }
}

export default function Services({ lang, theme, services, whatsappNumber }: ServicesProps) {
  const [activeModalService, setActiveModalService] = useState<Service | null>(null);

  // Prefilled WhatsApp text generator according to specifications
  const getWhatsAppLink = (service: Service) => {
    let text = '';
    
    if (lang === 'ar') {
      if (service.key === 'web') {
        text = `مرحباً فريق LuxCod،\n\nأرغب بطلب خدمة تصميم موقع إلكتروني.\n\nالاسم:\nرقم الجوال:\nتفاصيل المشروع:`;
      } else if (service.key === 'bot') {
        text = `مرحباً فريق LuxCod،\n\nأرغب بطلب بوت واتساب ذكي.\n\nنوع النشاط:\nالتفاصيل:`;
      } else if (service.key === 'landing') {
        text = `مرحباً فريق LuxCod،\n\nأرغب بطلب صفحة هبوط احترافية.\n\nاسم المشروع:\nالتفاصيل:`;
      } else if (service.key === 'uiux') {
        text = `مرحباً فريق LuxCod،\n\nأرغب بخدمة تحسين تجربة المستخدم.\n\nرابط الموقع:\nالتفاصيل:`;
      } else if (service.key === 'integrations') {
        text = `مرحباً فريق LuxCod،\n\nأرغب بخدمة التكاملات.\n\nالأنظمة المطلوبة:\nالتفاصيل:`;
      } else if (service.key === 'nfc') {
        text = `مرحباً فريق LuxCod،\n\nأرغب بطلب بطاقة NFC.\n\nالاسم:\nالمسمى الوظيفي:\nالتفاصيل:`;
      } else {
        text = `مرحباً فريق LuxCod، أرغب بطلب خدمة ${service.titleAr}.\nالتفاصيل:`;
      }
    } else {
      // English messages
      if (service.key === 'web') {
        text = `Hello LuxCod Team,\n\nI want to request a Website Design & Development project.\n\nName:\nPhone:\nProject Details:`;
      } else if (service.key === 'bot') {
        text = `Hello LuxCod Team,\n\nI want to request a Smart WhatsApp Bot project.\n\nBusiness Type:\nDetails:`;
      } else if (service.key === 'landing') {
        text = `Hello LuxCod Team,\n\nI want to request a Premium Landing Page.\n\nProject Name:\nDetails:`;
      } else if (service.key === 'uiux') {
        text = `Hello LuxCod Team,\n\nI want to request a UI/UX Review and Redesign project.\n\nWebsite URL:\nDetails:`;
      } else if (service.key === 'integrations') {
        text = `Hello LuxCod Team,\n\nI want to request System Integrations & REST API configurations.\n\nSystems Required:\nDetails:`;
      } else if (service.key === 'nfc') {
        text = `Hello LuxCod Team,\n\nI want to request custom luxury NFC Business Cards.\n\nName:\nJob Title:\nDetails:`;
      } else {
        text = `Hello LuxCod Team, I am interested in requesting ${service.titleEn}.\nDetails:`;
      }
    }

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section 
      id="services" 
      className={`py-24 relative z-10 ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900 border-y border-slate-200'
      }`}
      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
    >
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-cyan-400 via-white to-purple-400' 
              : 'from-cyan-600 via-slate-800 to-purple-700'
          }`}>
            {lang === 'ar' ? 'خدماتنا الرقمية المتكاملة' : 'Our Digital Solutions'}
          </h2>
          <div className="h-1.5 w-24 bg-cyan-400 mx-auto rounded-full mb-6" />
          <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {lang === 'ar' 
              ? 'حلول تقنية وهندسة برمجية متكاملة مصممة خصيصاً لمضاعفة مبيعاتك وأتمتة اتصالاتك بمستويات عالمية.'
              : 'Elite technical development custom-built to maximize your checkout rates, streamline system pathways, and build absolute trust.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              id={`service-card-${service.id}`}
              key={service.id}
              onClick={() => setActiveModalService(service)}
              className={`p-8 rounded-2xl border transition-all duration-300 relative group cursor-pointer flex flex-col justify-between h-[320px] ${
                theme === 'dark'
                  ? 'bg-slate-900/35 border-slate-940 hover:border-slate-800'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Glow Overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none glowing-border-glow" />

              <div>
                {/* Luminous floating icon */}
                <div className={`p-3.5 rounded-xl inline-block mb-6 relative border transition-transform duration-300 group-hover:-translate-y-1.5 ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-150 shadow-sm'
                }`}>
                  <ServiceIcon iconName={service.icon} className="w-6 h-6 text-cyan-400" />
                </div>

                {/* Service title */}
                <h3 className={`text-xl font-bold mb-3 transition-colors ${
                  theme === 'dark' ? 'text-slate-100 group-hover:text-cyan-300' : 'text-slate-800 group-hover:text-cyan-600'
                }`}>
                  {lang === 'ar' ? service.titleAr : service.titleEn}
                </h3>

                {/* Service short description */}
                <p className={`text-sm leading-relaxed line-clamp-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {lang === 'ar' ? service.descAr : service.descEn}
                </p>
              </div>

              {/* Click to inspect link */}
              <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 group-hover:underline mt-4">
                <span>{lang === 'ar' ? 'استكشف التفاصيل والميزات' : 'Explore Details & Specs'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA */}
        <div className="mt-16 text-center">
          <button 
            onClick={() => setActiveModalService(services[0])}
            className="px-8 py-3.5 rounded-xl font-bold text-sm border-2 border-dashed border-cyan-400/50 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/5 transition-all duration-200"
          >
            {lang === 'ar' ? 'طلب خدمة مخصصة الآن' : 'Request A Custom Architecture'}
          </button>
        </div>

      </div>

      {/* High-Fidelity Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto pt-24 pb-8">
          <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 my-4 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header banner */}
            <div className={`p-6 sm:p-8 border-b ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            } flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-xl border ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <ServiceIcon iconName={activeModalService.icon} className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {lang === 'ar' ? activeModalService.titleAr : activeModalService.titleEn}
                  </h3>
                  <div className="flex items-center gap-1 text-xs opacity-65 font-mono mt-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? `مدة التسليم التقريبية: ${activeModalService.deliveryTimeAr}` : `Delivery Speed: ${activeModalService.deliveryTimeEn}`}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveModalService(null)} 
                className={`p-2 rounded-lg cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-slate-900 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-sm font-mono tracking-wider opacity-60 uppercase mb-2">
                  {lang === 'ar' ? 'نبذة تفصيلية' : 'Full Value Overview'}
                </h4>
                <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {lang === 'ar' ? activeModalService.longDescAr : activeModalService.longDescEn}
                </p>
              </div>

              {/* Benefits and Features side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Benefits */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-150'}`}>
                  <h4 className="font-bold text-md mb-4 flex items-center gap-1.5 text-cyan-400">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'العوائد والفوائد لأعمالك' : 'Key Strategic Outcomes'}</span>
                  </h4>
                  <ul className="space-y-3.5">
                    {(lang === 'ar' ? activeModalService.benefitsAr : activeModalService.benefitsEn).map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
                        <span className="text-cyan-400 font-mono mt-0.5">•</span>
                        <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Features */}
                <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-150'}`}>
                  <h4 className="font-bold text-md mb-4 flex items-center gap-1.5 text-purple-400">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span>{lang === 'ar' ? 'الميزات والخصائص الفنية' : 'Premium Tech Features'}</span>
                  </h4>
                  <ul className="space-y-3.5">
                    {(lang === 'ar' ? activeModalService.featuresAr : activeModalService.featuresEn).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
                        <span className="text-purple-400 font-mono mt-0.5">•</span>
                        <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

            {/* Modal Footer (Instant WhatsApp CTA) */}
            <div className={`p-6 sm:p-8 border-t ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            } flex flex-col sm:flex-row gap-4 items-center justify-between`}>
              <div className="text-xs font-mono opacity-65 text-center sm:text-left mb-2 sm:mb-0">
                {lang === 'ar' ? 'طلبك سيرسل كرسالة مخصصة مجهزة للفريق فورا.' : 'Your request launches a pre-filled, instant order link directly.'}
              </div>
              <button
                onClick={() => {
                  window.open(getWhatsAppLink(activeModalService), '_blank');
                  setActiveModalService(null);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-slate-950 font-bold text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-lg hover:shadow-cyan-400/35 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4.5 h-4.5 fill-slate-950" />
                <span>{lang === 'ar' ? 'اطلب الخدمة الآن عبر واتساب' : 'Request Service via WhatsApp Now'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
