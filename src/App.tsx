import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Stats from './components/Stats';
import WhyUs from './components/WhyUs';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import AdminCMS from './components/AdminCMS';
import Legal from './components/Legal';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';

// DB storage wrapper
import { dbStore } from './dbStore';
import { Project, Service, Review, ContentSettings, SEOSettings, SiteSettings, ConsultationLead } from './types';
import { DEFAULT_REVIEWS } from './data';
import { MessageSquare, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { sendTelegramNotification } from './utils';

export default function App() {
  // Multilingual preference defaults to Arabic RTL conform Saudi regulations
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('luxcod_lang');
    return saved === 'en' ? 'en' : 'ar';
  });

  // Dark or Light Theme
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('luxcod_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  // Administrative session
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('luxcod_admin_session') === 'true';
  });

  // Navigation view router inside SPA
  const [activeView, setActiveView] = useState<'home' | 'admin'>(() => {
    const savedView = localStorage.getItem('luxcod_active_view');
    const savedAdmin = localStorage.getItem('luxcod_admin_session') === 'true';
    if (savedAdmin && savedView === 'admin') {
      return 'admin';
    }
    return 'home';
  });

  // Load persistent DB States
  const [projects, setProjects] = useState<Project[]>(() => dbStore.getProjects());
  const [services, setServices] = useState<Service[]>(() => dbStore.getServices());
  const [reviews, setReviews] = useState<Review[]>(() => dbStore.getReviews());
  const [content, setContent] = useState<ContentSettings>(() => dbStore.getContentSettings());
  const [seo, setSeo] = useState<SEOSettings>(() => dbStore.getSEOSettings());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => dbStore.getSiteSettings());
  const [leads, setLeads] = useState<ConsultationLead[]>(() => dbStore.getLeads());

  // Active Policy Viewer state
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'cookies' | 'protection' | null>(null);

  // Prevents saving defaults over actual server data during mounting
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync active view selection safely
  useEffect(() => {
    localStorage.setItem('luxcod_active_view', activeView);
  }, [activeView]);

  // Load live CMS settings from server-side database
  useEffect(() => {
    fetch('/api/load-cms?t=' + Date.now(), { cache: 'no-store' })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('No custom db file yet');
      })
      .then(data => {
        if (data) {
          if (data.projects) {
            setProjects(data.projects);
            dbStore.saveProjects(data.projects);
          }
          if (data.services) {
            setServices(data.services);
            dbStore.saveServices(data.services);
          }
          if (data.reviews) {
            const hasOldMocks = data.reviews.some((r: any) => 
              (r.name && r.name.includes('حي الملقا')) || 
              (r.name && r.name.includes('شركة زن الصحي')) || 
              (r.name && r.name.includes('السباك شاهر بالرياض')) ||
              (r.comment && r.comment.includes('عيادة الجمال')) ||
              (r.comment && r.comment.includes('زن الصحي'))
            );
            if (hasOldMocks || data.reviews.length < 5) {
              setReviews(DEFAULT_REVIEWS);
              dbStore.saveReviews(DEFAULT_REVIEWS);
              // Directly save back to server to correct the JSON DB file
              saveToServer('reviews', DEFAULT_REVIEWS);
            } else {
              setReviews(data.reviews);
              dbStore.saveReviews(data.reviews);
            }
          } else {
            setReviews(DEFAULT_REVIEWS);
            dbStore.saveReviews(DEFAULT_REVIEWS);
            saveToServer('reviews', DEFAULT_REVIEWS);
          }
          if (data.content) {
            setContent(data.content);
            dbStore.saveContentSettings(data.content);
          }
          if (data.seo) {
            setSeo(data.seo);
            dbStore.saveSEOSettings(data.seo);
          }
          if (data.siteSettings) {
            setSiteSettings(data.siteSettings);
            dbStore.saveSiteSettings(data.siteSettings);
          }
          if (data.leads) {
            setLeads(data.leads);
            dbStore.saveLeads(data.leads);
          }
        }
        // Small delay to allow React to apply state updates and avoid race-conditions with active saving effects
        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      })
      .catch(err => {
        console.log('Defaults or cache loaded:', err);
        setTimeout(() => {
          setIsLoaded(true);
        }, 300);
      });
  }, []);

  // Helper to persist changes dynamically to server
  const saveToServer = async (key: string, data: any) => {
    if (!isLoaded) return;
    try {
      await fetch('/api/save-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data })
      });
    } catch (err) {
      console.error(`Failed to sync key: ${key} to backend server`, err);
    }
  };

  // Redirect admin users directly to CMS view if they open administrative URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasAdminParam = params.has('cms') || 
      params.has('manage') || 
      params.has('admin') || 
      window.location.hash === '#/admin' || 
      window.location.hash === '#/cms' ||
      window.location.hash === '#admin' ||
      window.location.hash === '#cms';
      
    if (hasAdminParam && isAdmin) {
      setActiveView('admin');
    }
  }, [isAdmin]);

  // Sync state changes with local cache storage and server-side DB
  // Guarded specifically with `isAdmin` so regular users never overwrite values with local browser state
  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveProjects(projects);
    saveToServer('projects', projects);
  }, [projects, isLoaded, isAdmin]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveServices(services);
    saveToServer('services', services);
  }, [services, isLoaded, isAdmin]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveContentSettings(content);
    saveToServer('content', content);
  }, [content, isLoaded, isAdmin]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveSEOSettings(seo);
    saveToServer('seo', seo);
  }, [seo, lang, isLoaded, isAdmin]); // Updates title matching exact active language settings

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveSiteSettings(siteSettings);
    saveToServer('siteSettings', siteSettings);
  }, [siteSettings, isLoaded, isAdmin]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveReviews(reviews);
    saveToServer('reviews', reviews);
  }, [reviews, isLoaded, isAdmin]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveLeads(leads);
    saveToServer('leads', leads);
  }, [leads, isLoaded, isAdmin]);

  useEffect(() => {
    localStorage.setItem('luxcod_admin_session', String(isAdmin));
    if (!isAdmin) {
      localStorage.removeItem('luxcod_active_view');
    }
  }, [isAdmin]);

  // Apply visual theme toggles to DOM body elements safely
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.backgroundColor = '#020617'; // slate-950
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc'; // slate-50
    }
  }, [theme]);

  // Background content policy validation checks for profanity, bad words, incitement to violence or hatred
  const isViolatingContentPolicy = (nameText: string, commentText: string): boolean => {
    const textToScan = `${nameText} ${commentText}`.toLowerCase();
    
    // Background moderation list (hidden from the customer, targeting profanity, violence, and hate-speech)
    const badWords = [
      // Profanity & common hostile insults (Arabic)
      'كلب', 'كلاب', 'حمار', 'حمير', 'حيوان', 'حيوانات', 'حقير', 'حقارة', 'سافل', 'سفالة', 'قذر', 'قذارة', 'تفاهة', 'تفه',
      'غبي', 'غباء', 'كذاب', 'كذب', 'احتيال', 'محتال', 'نصاب', 'سرقة', 'سارق', 'لعن', 'لعنة', 'ملعون', 'زق', 'خرا', 'تخص',
      'يا بن', 'ابن ال', 'امك', 'أختك', 'شتم', 'شتيمة', 'عاهر', 'عاهرة', 'ديوث', 'عرص', 'قحبة', 'منيك', 'شرموط', 'شرموطة',
      
      // Violence, threats, and harassment (Arabic)
      'قتل', 'موت', 'ذبح', 'إرهاب', 'ارهاب', 'تفجير', 'سلاح', 'مسدس', 'قنبلة', 'تعذيب', 'طائفية', 'طائفي', 'عنصرية', 'عنصري',
      'كراهية', 'اكره', 'أكره', 'دموي', 'سنتخلص', 'تهديد', 'اضرب', 'ضرب', 'حرب', 'خراب', 'تدمير', 'داعش',
      
      // English profanities, bad words, and violent threats
      'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'idiot', 'dumb', 'stupid', 'retard',
      'kill', 'murder', 'slay', 'death', 'die', 'threat', 'weapon', 'gun', 'bomb', 'terror', 'violence', 'blood',
      'scam', 'fraud', 'cheat', 'scammer', 'fake', 'liar', 'racist', 'hate', 'abusive'
    ];

    return badWords.some(word => {
      if (/^[a-zA-Z]+$/.test(word)) {
        const rx = new RegExp(`\\b${word}\\b`, 'i');
        return rx.test(textToScan);
      }
      return textToScan.includes(word);
    });
  };

  // Handle client reviews submissions
  const handleAddNewReview = (name: string, comment: string, rating: number) => {
    const isFlagged = isViolatingContentPolicy(name, comment);
    
    const newRev: Review = {
      id: 'rev_' + Date.now(),
      name,
      comment,
      rating,
      status: isFlagged ? 'pending' : 'approved', // Smart publishing condition
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews(prev => {
      const updated = [newRev, ...prev];
      dbStore.saveReviews(updated);
      saveToServer('reviews', updated);
      return updated;
    });

    // Send Telegram Notification to administration bot
    if (siteSettings.telegramEnabled && siteSettings.telegramBotToken && siteSettings.telegramChatId) {
      const stars = '⭐'.repeat(rating);
      let tgMessage = '';
      
      if (isFlagged) {
        tgMessage = `🚨 <b>مراجعة عميل مَحجوزة للمراجعة والاعتماد (تحوي مخالفة)</b>\n\n` +
          `👤 <b>الاسم للعميل:</b> ${name}\n` +
          `⭐ <b>التقييم المستلم:</b> ${stars} (${rating}/5)\n` +
          `💬 <b>التعليق المكتوب:</b>\n${comment}\n\n` +
          `⚠️ <b>الرصد الذكي:</b> تم الإحباط وحجز التعليق لوجود ألفاظ دلالية أو هجومية تخالف سياسة الخصوصية. يرجى الدخول للوحة التحكم والموافقة أو الرفض يدوياً!`;
      } else {
        tgMessage = `✍️ <b>مراجعة عميل جديدة (تم نشرها تلقائياً لسلامتها)</b>\n\n` +
          `👤 <b>الاسم للعميل:</b> ${name}\n` +
          `⭐ <b>التقييم المستلم:</b> ${stars} (${rating}/5)\n` +
          `💬 <b>التعليق المكتوب:</b>\n${comment}\n\n` +
          `✅ <b>الرصد الذكي:</b> التعليق سليم ١٠٠٪ ومطابق لشروط وسياسات الخصوصية، تم نشره للعامة مباشرة بنجاح.`;
      }
        
      sendTelegramNotification(siteSettings.telegramBotToken, siteSettings.telegramChatId, tgMessage);
    }
  };

  const handleAddNewLead = (name: string, phone: string, service: string, msg: string) => {
    const newLead: ConsultationLead = {
      id: 'lead_' + Date.now(),
      name,
      phone,
      service,
      msg,
      date: new Date().toISOString().split('T')[0],
      status: 'new'
    };
    
    setLeads(prev => {
      const updated = [newLead, ...prev];
      dbStore.saveLeads(updated);
      saveToServer('leads', updated);
      return updated;
    });

    // Send Telegram Notification
    if (siteSettings.telegramEnabled && siteSettings.telegramBotToken && siteSettings.telegramChatId) {
      const getServiceName = (key: string) => {
        switch (key) {
          case 'web': return 'Website Design & Development (تطوير الويب)';
          case 'bot': return 'Smart WhatsApp Bot (الرد التلقائي)';
          case 'landing': return 'Premium Landing Page (صفحات الهبوط)';
          case 'uiux': return 'UI/UX Redesign (تجربة المستخدم)';
          case 'integrations': return 'System Integrations (ربط الأنظمة)';
          case 'nfc': return 'NFC Business Cards (بطاقات NFC)';
          default: return key;
        }
      };
      
      const tgMessage = `🔔 <b>طلب استشارة جديد (New Lead)</b>\n\n` +
        `👤 <b>الاسم:</b> ${name}\n` +
        `📞 <b>الهاتف:</b> ${phone}\n` +
        `💼 <b>الخدمة:</b> ${getServiceName(service)}\n` +
        `📝 <b>التفاصيل:</b>\n${msg}\n\n` +
        `📅 <b>التاريخ:</b> ${newLead.date}`;
        
      sendTelegramNotification(siteSettings.telegramBotToken, siteSettings.telegramChatId, tgMessage);
    }
  };

  // Reset entire mock platform database to initial state
  const handleResetEntirePlatform = () => {
    const defaults = dbStore.resetAll();
    setProjects(defaults.projects);
    setServices(defaults.services);
    setReviews(defaults.reviews);
    setContent(defaults.content);
    setSeo(defaults.seo);
    setSiteSettings(defaults.siteSettings);
    setLeads([]);
    setIsAdmin(false);
    setActiveView('home');
  };

  // Safe navigation transition click-scrolls inside home tabs
  const handleHomeAnchorNavigation = (href: string) => {
    setActiveView('home');
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCTAWhatsapp = () => {
    const textMessage = lang === 'ar' 
      ? 'مرحباً فريق LuxCod، أرغب بمراسلة مستشاريكم والمباشرة بطلب مشروع رقمي متميز لتطوير أعمالنا.' 
      : 'Hello LuxCod team! I would like to schedule a session to consult on my business project.';
    window.open(`https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(textMessage)}`, '_blank');
  };

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    } ${lang === 'ar' ? 'rtlCairo text-right' : 'ltrSpace text-left'}`} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      
      {/* 1. Header Navigation Bar */}
      <Navigation
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        activeView={activeView}
        setActiveView={setActiveView}
        siteSettings={siteSettings}
      />

      {/* 2. Main Router content switches (Website Home View vs CMS Dashboard) */}
      {activeView === 'admin' ? (
        
        // Premium Secure Dashboard CRUD CMS view
        <AdminCMS
          lang={lang}
          theme={theme}
          projects={projects}
          setProjects={setProjects}
          services={services}
          setServices={setServices}
          reviews={reviews}
          setReviews={setReviews}
          content={content}
          setContent={setContent}
          seo={seo}
          setSeo={setSeo}
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
          leads={leads}
          setLeads={setLeads}
          onResetAll={handleResetEntirePlatform}
          onBackToWebsite={() => setActiveView('home')}
        />
        
      ) : (
        
        // High-Conversion Premium Agency Front views
        <div className="space-y-0">
          
          {/* Hero segment */}
          <Hero 
            lang={lang} 
            theme={theme} 
            content={content} 
            whatsappNumber={siteSettings.whatsapp} 
          />

          {/* Counts metrics */}
          <Stats 
            lang={lang} 
            theme={theme} 
            content={content} 
          />

          {/* Core strengths grids */}
          <WhyUs 
            lang={lang} 
            theme={theme} 
          />

          {/* Services Icon and details slider mod */}
          <Services 
            lang={lang} 
            theme={theme} 
            services={services} 
            whatsappNumber={siteSettings.whatsapp} 
          />

          {/* Showcase works */}
          <Portfolio 
            lang={lang} 
            theme={theme} 
            projects={projects} 
          />

          {/* Review submission and carousels */}
          <Testimonials 
            lang={lang} 
            theme={theme} 
            reviews={reviews} 
            onSubmitReview={handleAddNewReview} 
          />

          {/* CTA before footer */}
          <section className={`py-24 relative overflow-hidden text-center z-10 border-t ${
            theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
          }`}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-4xl mx-auto px-4 relative z-10">
              <span className="text-[10px] tracking-widest font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-3.5 py-1.5 rounded-full mb-6 inline-block font-sans">
                {lang === 'ar' ? 'ابدأ مشروعك الرقمي المستقبل المتميز الآن' : 'SECURE YOUR STRATEGIC BLUEPRINT CALL'}
              </span>

              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r font-sans ${
                theme === 'dark'
                  ? 'from-white via-cyan-300 to-purple-400'
                  : 'from-slate-950 via-indigo-900 to-purple-800'
              }`}>
                {lang === 'ar' ? 'هل أنت مستعد لتطوير وأتمتة مبيعات أعمالك؟' : 'Ready to transition into automation scale?'}
              </h2>
              
              <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-650'
              }`}>
                {lang === 'ar'
                  ? 'دع فريق LuxCod الخبير يبني لك تجربة رقمية فائقة التحول والجمال مع بوتات المحادثة الذكية والأنظمة البرمجية المتكاملة لمضاعفة أرباحك وجذب العملاء.'
                  : 'Let LuxCod custom design a pristine interface equipped with conversational bots, driving high dynamic conversions.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <button
                  onClick={handleCTAWhatsapp}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 hover:shadow-lg hover:shadow-cyan-400/35 transition-all text-white flex items-center justify-center cursor-pointer"
                >
                  {lang === 'ar' ? 'تواصل عبر واتساب فوراً' : 'Consult via WhatsApp CRM'}
                </button>
                <button
                  onClick={() => handleHomeAnchorNavigation('#contact')}
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm border hover:bg-slate-900/10 transition-colors cursor-pointer ${
                    theme === 'dark' ? 'border-slate-800 text-slate-200 hover:text-white' : 'border-slate-250 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Initiate Project Draft'}
                </button>
              </div>
            </div>
          </section>

          {/* Contacts maps index */}
          <Contact
            lang={lang}
            theme={theme}
            phone={siteSettings.phone}
            email={siteSettings.email}
            whatsapp={siteSettings.whatsapp}
            onAddLead={handleAddNewLead}
          />

        </div>
      )}

      {/* 3. Global Footer Component */}
      <Footer
        lang={lang}
        theme={theme}
        siteSettings={siteSettings}
        onOpenLegal={setActivePolicy}
        onNavigateHomeTab={handleHomeAnchorNavigation}
      />

      {/* 4. Global Floating Contacts (WhatsApp / Calls) */}
      <FloatingButtons 
        lang={lang} 
        phone={siteSettings.phone} 
        whatsapp={siteSettings.whatsapp} 
      />

      {/* 5. Immersive Modals for Legal Guidelines */}
      <Legal
        lang={lang}
        theme={theme}
        activePolicy={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

    </div>
  );
}
