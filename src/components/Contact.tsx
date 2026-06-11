import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react';
import { cleanMobileForWhatsApp } from '../utils';

interface ContactProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
  phone: string;
  email: string;
  whatsapp: string;
  onAddLead: (name: string, phone: string, service: string, msg: string) => void;
}

export default function Contact({ lang, theme, phone, email, whatsapp, onAddLead }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', phone: '', msg: '', service: 'web' });
  const [sent, setSent] = useState(false);
  const [lastInquiry, setLastInquiry] = useState<{ name: string; phone: string; msg: string; service: string } | null>(null);

  const getServiceName = (key: string) => {
    switch (key) {
      case 'web': return lang === 'ar' ? 'تصميم وتطوير المواقع والمنصات الذكية' : 'Website Design & Development';
      case 'bot': return lang === 'ar' ? 'أنظمة بوتات واتساب الذكية والرد التلقائي' : 'Smart WhatsApp Bot Pipelines';
      case 'landing': return lang === 'ar' ? 'تصميم صفحات الهبوط الاحترافية سريعة التحول' : 'Premium Landing Page Engineering';
      case 'uiux': return lang === 'ar' ? 'مراجعة وتطوير تجربة المستخدم ومظهر واجهات التطبيقات' : 'UI/UX Audit & Modern Redesign';
      case 'integrations': return lang === 'ar' ? 'ربط وتكامل الأنظمة والواجهات البرمجية الفعالة' : 'System Integrations & Custom APIs';
      case 'nfc': return lang === 'ar' ? 'بطاقات الأعمال الرقمية الذكية بتقنية NFC' : 'Luxury NFC Digital Business Cards';
      default: return key;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.msg || !formData.phone) return;

    // Persist internally in local db state
    onAddLead(formData.name, formData.phone, formData.service, formData.msg);
    setLastInquiry({ ...formData });
    setSent(true);

    // Keep form inputs clean but preserve the feedback context so they can easily direct to WhatsApp on click
    setFormData({ name: '', phone: '', msg: '', service: 'web' });
  };

  const handleManualMapDirection = () => {
    window.open(`https://maps.google.com/?q=Riyadh+Saudi+Arabia`, '_blank');
  };

  const cardItems = [
    {
      id: 'contact-phone',
      icon: <Phone className="w-5 h-5 text-cyan-400" />,
      titleAr: 'اتصال هاتفي مباشر',
      titleEn: 'Direct Call Support',
      val: phone,
      action: `tel:${phone}`
    },
    {
      id: 'contact-whatsapp',
      icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
      titleAr: 'محادثة واتساب فورية',
      titleEn: 'Instant WhatsApp Chat',
      val: whatsapp,
      action: `https://wa.me/${whatsapp}`
    },
    {
      id: 'contact-email',
      icon: <Mail className="w-5 h-5 text-purple-400" />,
      titleAr: 'البريد الإلكتروني المعتمد',
      titleEn: 'Official Email Outreach',
      val: email,
      action: `mailto:${email}`
    },
    {
      id: 'contact-loc',
      icon: <MapPin className="w-5 h-5 text-red-400" />,
      titleAr: 'تغطيتنا الجغرافية',
      titleEn: 'Our Service Coverage',
      val: lang === 'ar' ? 'كافة مناطق الرياض، السعودية والخليج كلياً' : 'All Riyadh, Saudi Arabia, Gulf & Worldwide',
      action: `https://maps.google.com/?q=Saudi+Arabia`
    }
  ];

  return (
    <section 
      id="contact" 
      className={`py-24 relative z-10 ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900 border-b border-indigo-150'
      }`}
      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
    >
      <div className="absolute inset-0 matrix-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r font-sans ${
            theme === 'dark'
              ? 'from-cyan-400 via-white to-purple-400'
              : 'from-cyan-600 via-slate-800 to-purple-700'
          }`}>
            {lang === 'ar' ? 'تواصل مع فريق LuxCod الآن' : 'Contact LuxCod Team Now'}
          </h2>
          <div className="h-1.5 w-24 bg-cyan-400 mx-auto rounded-full mb-6" />
          <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-650'}`}>
            {lang === 'ar'
              ? 'تواصل معنا فوراً لمناقشة أفكار مشروعك البرمجي، تصميم واجهات مذهلة، أو تهيئة أذكى منظومة رد آلي لواتساب لدفع نمو أعمالك.'
              : 'Our experts are at your disposal. Schedule your free consultation session to scale your dynamic web & automated messaging platforms.'}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {cardItems.map((card) => (
            <a
              id={card.id}
              key={card.id}
              href={card.action}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 block relative group ${
                theme === 'dark'
                  ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm shadow-black/[0.02]'
              }`}
            >
              <div className={`p-3 rounded-xl inline-block mb-4 border ${
                theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'
              }`}>
                {card.icon}
              </div>
              <h3 className={`font-bold text-sm mb-1 uppercase tracking-wider opacity-90 font-sans ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
                {lang === 'ar' ? card.titleAr : card.titleEn}
              </h3>
              <p className="font-mono text-xs text-cyan-400 group-hover:underline break-all mt-1">{card.val}</p>
            </a>
          ))}
        </div>

        {/* Form and Map Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Quick Inquiry form */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className={`p-6 sm:p-8 rounded-2xl border h-full flex flex-col justify-between ${
              theme === 'dark' ? 'bg-slate-900/30 border-slate-900' : 'bg-white border-slate-200 shadow-xl shadow-black/[0.03]'
            }`}>
              <div>
                <h3 className={`font-extrabold text-xl mb-4 text-slate-900 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {lang === 'ar' ? 'ابدأ حجز مشورتك المجانية' : 'Request Free Engineering Session'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono tracking-wider text-slate-400 mb-1.5 font-sans">{lang === 'ar' ? 'اسمك الكريم' : 'Your Name'}</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={lang === 'ar' ? 'أدخل اسمك أو اسم شركتك' : 'Enter your name or business...'}
                        className={`w-full p-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-1 ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500' : 'bg-white border-slate-300 focus:ring-cyan-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono tracking-wider text-slate-400 mb-1.5 font-sans">{lang === 'ar' ? 'رقم هاتف التواصل' : 'Your Phone Number'}</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="05xxxxxxx"
                        className={`w-full p-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-1 ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500' : 'bg-white border-slate-300 focus:ring-cyan-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono tracking-wider text-slate-400 mb-1.5 font-sans">{lang === 'ar' ? 'الخدمة الرقمية المطلوبة' : 'Service Required'}</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border text-sm text-slate-400 focus:outline-none focus:ring-1 font-sans ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300 focus:ring-cyan-500' : 'bg-white border-slate-300 text-slate-800 focus:ring-cyan-500'
                      }`}
                    >
                      <option value="web">{lang === 'ar' ? 'تصميم وتطوير المواقع والمنصات الذكية' : 'Website Design & Development'}</option>
                      <option value="bot">{lang === 'ar' ? 'أنظمة بوتات واتساب الذكية والرد التلقائي' : 'Smart WhatsApp Bot Pipelines'}</option>
                      <option value="landing">{lang === 'ar' ? 'تصميم صفحات الهبوط الاحترافية سريعة التحول' : 'Premium Landing Page Engineering'}</option>
                      <option value="uiux">{lang === 'ar' ? 'مراجعة وتطوير تجربة المستخدم ومظهر واجهات التطبيقات' : 'UI/UX Audit & Modern Redesign'}</option>
                      <option value="integrations">{lang === 'ar' ? 'ربط وتكامل الأنظمة والواجهات البرمجية الفعالة' : 'System Integrations & Custom APIs'}</option>
                      <option value="nfc">{lang === 'ar' ? 'بطاقات الأعمال الرقمية الذكية بتقنية NFC' : 'Luxury NFC Digital Business Cards'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono tracking-wider text-slate-400 mb-1.5 font-sans">{lang === 'ar' ? 'تفاصيل متطلبات أعمالكم' : 'Project Specifications'}</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.msg}
                      onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                      placeholder={lang === 'ar' ? 'يرجى كتابة لمحة عن مشروعكم، التوقعات والأهداف المراد تحقيقها من أعمال التطوير...' : 'Describe what values and software modules your company seeks to construct...'}
                      className={`w-full p-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-1 ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500' : 'bg-white border-slate-300 focus:ring-cyan-500'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 hover:shadow-lg hover:shadow-cyan-400/20 active:scale-95 transition-all text-white flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                  >
                    <Send className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إرسال طلب الاستشارة الآن' : 'Initiate Consultation Now'}</span>
                  </button>
                </form>
              </div>

              {sent && lastInquiry && (
                <div role="alert" className="mt-4 p-5 rounded-xl bg-emerald-950/70 border-2 border-emerald-500 text-emerald-300 text-xs flex flex-col gap-3 animate-fade-in backdrop-blur-sm">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-5.5 h-5.5 flex-shrink-0 text-emerald-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-extrabold text-sm text-emerald-200">
                        {lang === 'ar' ? '🎉 تم تسجيل طلب استشارتك بنجاح لمراجعتها!' : '🎉 Consultation Request Saved Successfully!'}
                      </p>
                      <p className="opacity-90 mt-1 leading-relaxed">
                        {lang === 'ar' 
                          ? 'لقد تم حفظ وتوثيق بيانات طلبك بأمان في قاعدة بيانات وعاء الموقع المحلي، ويمكنك تصفحها وإدارتها في لوحة التحكم الإدارية للموقع (Admin Panel).' 
                          : 'Your request details have been safely registered and saved in our local site database, and you can browse and manage them inside the Admin CMS Panel.'}
                      </p>
                      <p className="opacity-90 mt-1.5 font-bold text-white">
                        {lang === 'ar'
                          ? '📢 لتصلنا متطلباتك فوراً وتضمن تسريع الموعد، يرجى النقر أدناه لإرسال تفاصيل المشروع إلى واتساب الوكالة بضغطة زر واحدة:'
                          : '📢 To reach us immediately and ensure a faster appointment, please click below to send the project details to our WhatsApp with a single tap:'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const cleanAgencyWhatsapp = cleanMobileForWhatsApp(whatsapp);
                      const detailMsg = lang === 'ar'
                        ? `السلام عليكم وكالة LuxCod، لقد أرسلت للتو طلب استشارة عبر موقعكم:\n\n*الاسم الكريم:* ${lastInquiry.name}\n*رقم الهاتف:* ${lastInquiry.phone}\n*الخدمة المطلوبة:* ${getServiceName(lastInquiry.service)}\n*تفاصيل المتطلبات:* ${lastInquiry.msg}`
                        : `Hello LuxCod, I just submitted a consultation request on your website:\n\n*Name:* ${lastInquiry.name}\n*Phone:* ${lastInquiry.phone}\n*Service:* ${getServiceName(lastInquiry.service)}\n*Details:* ${lastInquiry.msg}`;
                      
                      if (cleanAgencyWhatsapp) {
                        window.open(`https://wa.me/${cleanAgencyWhatsapp}?text=${encodeURIComponent(detailMsg)}`, '_blank');
                      }
                    }}
                    className="w-full mt-1.5 py-3 rounded-lg font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer relative shadow-lg shadow-emerald-500/20 font-sans"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950 text-slate-950" />
                    <span>{lang === 'ar' ? 'إرسال التفاصيل مباشرة إلى واتساب الوكالة ⚡' : 'Send Specs Directly to Agency WhatsApp ⚡'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-6 flex flex-col items-stretch">
            <div className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between h-full relative overflow-hidden group ${
              theme === 'dark' ? 'bg-slate-900/30 border-slate-900' : 'bg-white border-slate-200'
            }`}>
              
              <div className="mb-4">
                <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2 font-sans dark:text-white">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span>{lang === 'ar' ? 'نطاق وتغطية خدماتنا الواسعة' : 'Our Service Jurisdiction'}</span>
                </h3>
                <p className={`text-xs mt-1 leading-relaxed font-sans ${theme === 'dark' ? 'text-slate-400' : 'text-slate-650'}`}>
                  {lang === 'ar' 
                    ? 'نقدم كافة خدماتنا الرقمية المتكاملة والحلول البرمجية الفاخرة للشركات والقطاعات الطبية والخدمية ومحلات التجزئة في الرياض، وكافة أنحاء المملكة العربية السعودية ودول الخليج العربي وعالمياً عبر منظومة تواصل متطورة وتفانٍ مستمر.'
                    : 'We deliver custom-architected top-tier digital systems, workflows, and automated bots covering Riyadh, all provinces across KSA, the GCC region, and global clients.'}
                </p>
              </div>

              {/* Spectacular Styled Visual Map Graphic representation */}
              <div 
                onClick={handleManualMapDirection}
                className={`relative h-64 rounded-xl border overflow-hidden cursor-pointer flex flex-col justify-center items-center group-hover:border-slate-750 transition-colors ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-850' : 'bg-slate-100 border-slate-200 shadow-inner'
                }`}
              >
                {/* Riyadh schematic streets path representation */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 0 10 L 100 90 M 0 80 L 100 20 M 30 0 L 30 100 M 70 0 L 70 100 M 0 50 Q 50 30 100 50" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="0.5" fill="none" />
                  <circle cx="50" cy="50" r="10" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="0.5" fill="none" />
                  <circle cx="50" cy="50" r="2" fill="red" />
                </svg>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 flex flex-col items-center">
                  <div className="relative">
                    <span className="absolute -inset-2 bg-red-500 rounded-full blur opacity-65 animate-ping" />
                    <MapPin className="w-10 h-10 text-red-500 relative" />
                  </div>
                  
                  <span className="bg-slate-900/90 text-white font-mono text-[10px] tracking-widest uppercase border border-slate-800 px-3 py-1.5 rounded-lg mt-3 block backdrop-blur-sm shadow-md font-sans">
                    {lang === 'ar' ? 'تغطية للمملكة والخليج وعالمياً' : 'KSA & GULF COVERAGE'}
                  </span>
                </div>

                {/* Cover Hover Prompt layer */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl font-sans">
                    {lang === 'ar' ? 'عرض نطاق خدماتنا الواسع' : 'View our wide service scope'}
                  </span>
                </div>
              </div>

              {/* Coordinates indicators */}
              <div className="mt-4 flex items-center justify-between text-xs font-mono opacity-50">
                <span>LAT: 24.7136° N</span>
                <span>|</span>
                <span>LNG: 46.6753° E</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
