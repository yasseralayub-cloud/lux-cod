import React, { useState, useMemo, useEffect } from 'react';
import { Project, Service, Review, ContentSettings, SEOSettings, SiteSettings, ConsultationLead } from '../types';
import { cleanMobileForWhatsApp } from '../utils';
import { 
  Building, Layers, Sparkles, MessageSquare, Globe, Settings, Save, ArrowLeft, Plus, Trash2, Edit2, Check, X, FileCode, RotateCcw, ShieldCheck, Heart, Send 
} from 'lucide-react';

interface AdminCMSProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
  projects: Project[];
  setProjects: (p: Project[]) => void;
  services: Service[];
  setServices: (s: Service[]) => void;
  reviews: Review[];
  setReviews: (r: Review[]) => void;
  content: ContentSettings;
  setContent: (c: ContentSettings) => void;
  seo: SEOSettings;
  setSeo: (s: SEOSettings) => void;
  siteSettings: SiteSettings;
  setSiteSettings: (s: SiteSettings) => void;
  leads: ConsultationLead[];
  setLeads: (leads: ConsultationLead[]) => void;
  onResetAll: () => void;
  onBackToWebsite: () => void;
}

export default function AdminCMS({
  lang,
  theme,
  projects,
  setProjects,
  services,
  setServices,
  reviews,
  setReviews,
  content,
  setContent,
  seo,
  setSeo,
  siteSettings,
  setSiteSettings,
  leads,
  setLeads,
  onResetAll,
  onBackToWebsite
}: AdminCMSProps) {
  // Navigation inside Dashboard
  const [activeTab, setActiveTab ] = useState<'portfolio' | 'services' | 'reviews' | 'homepage' | 'seo' | 'settings' | 'leads'>('leads');

  // Form states
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({});
  const [showServiceModal, setShowServiceModal] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState<Partial<Review>>({});
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState('');
  const [testingTg, setTestingTg] = useState(false);
  const [tgTestResult, setTgTestResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleTestTelegram = async () => {
    if (!siteSettings.telegramBotToken || !siteSettings.telegramChatId) {
      setTgTestResult({
        type: 'error',
        msg: lang === 'ar' ? 'يرجى إدخال التوكن Bot Token ومعرف الدردشة Chat ID أولاً!' : 'Please enter BOT TOKEN and CHAT ID first!'
      });
      return;
    }

    setTestingTg(true);
    setTgTestResult(null);

    try {
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: siteSettings.telegramBotToken,
          chatId: siteSettings.telegramChatId,
          message: lang === 'ar' 
            ? `⚡ <b>فحص الاتصال من لوحة التحكم!</b>\n\nلقد قمت بفحص ربط بوت الإشعارات لوكالة LuxCod بنجاح.\n\n📱 <i>هذا يعني أن الإشعارات والربط يعملان بشكل سليم الآن!</i>`
            : `⚡ <b>Telegram Bot Status: OK!</b>\n\nYour LuxCod notifications pipeline has been tested successfully.\n\n📱 <i>Connection is secure and online.</i>`
        })
      });

      if (response.ok) {
        setTgTestResult({
          type: 'success',
          msg: lang === 'ar' 
            ? '✅ تم إرسال الرسالة التجريبية بنجاح! يرجى مراجعة تليجرام للتأكد.' 
            : '✅ Mock message sent successfully! Please check your Telegram app to confirm.'
        });
      } else {
        const data = await response.json().catch(() => ({}));
        let innerErr = data.error || 'Server error';
        try {
          const detailObj = JSON.parse(innerErr);
          if (detailObj.description) {
            innerErr = `${detailObj.description} (Error Code: ${detailObj.error_code})`;
          }
        } catch {
          // ignore
        }
        setTgTestResult({
          type: 'error',
          msg: lang === 'ar' 
            ? `❌ فشل الاتصال: رفض تيليجرام الطلب بالخطأ التالي:\n"${innerErr}"\n(تأكد من بدء الدردشة مع البوت بكتابة /start أولاً، وصحة المعرف والتوكين)` 
            : `❌ Connection failed: Telegram API returned:\n"${innerErr}"\n(Make sure you started the conversation with the bot by typing /start, and verified your Token/Chat ID)`
        });
      }
    } catch (err: any) {
      setTgTestResult({
        type: 'error',
        msg: lang === 'ar' 
          ? `❌ حدث خطأ غير متوقع بالشبكة: ${err?.message || err}` 
          : `❌ Network error context: ${err?.message || err}`
      });
    } finally {
      setTestingTg(false);
    }
  };

  // Prevent background website scrolling when floating edit dialogs/modals are active
  useEffect(() => {
    if (showProjectModal || showServiceModal || showReviewModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showProjectModal, showServiceModal, showReviewModal]);

  // Auto trigger success message
  const triggerSuccess = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(''), 4500);
  };

  // 1. PROJECTS (Portfolio CRUD)
  const handleOpenProjectAdd = () => {
    setEditingProjectId(null);
    setProjectForm({
      nameAr: '', nameEn: '',
      categoryAr: '', categoryEn: '',
      descAr: '', descEn: '',
      longDescAr: '', longDescEn: '',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
      liveUrl: 'https://',
      techs: ['React', 'Tailwind CSS']
    });
    setShowProjectModal(true);
  };

  const handleOpenProjectEdit = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectForm(p);
    setShowProjectModal(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProjectId) {
      const updated = projects.map(p => {
        if (p.id === editingProjectId) {
          return {
            ...p,
            ...projectForm,
            nameAr: projectForm.nameAr || p.nameAr || 'مشروع جديد',
            nameEn: projectForm.nameEn || p.nameEn || 'New Project',
            categoryAr: projectForm.categoryAr || p.categoryAr || 'عام',
            categoryEn: projectForm.categoryEn || p.categoryEn || 'General'
          } as Project;
        }
        return p;
      });
      setProjects(updated);
      triggerSuccess(lang === 'ar' ? 'تم تحديث المشروع بنجاح!' : 'Project data updated successfully!');
    } else {
      const newProj: Project = {
        id: 'p_' + Date.now(),
        nameAr: projectForm.nameAr || 'مشروع جديد',
        nameEn: projectForm.nameEn || 'New Project',
        categoryAr: projectForm.categoryAr || 'عام',
        categoryEn: projectForm.categoryEn || 'General',
        descAr: projectForm.descAr || '',
        descEn: projectForm.descEn || '',
        longDescAr: projectForm.longDescAr || '',
        longDescEn: projectForm.longDescEn || '',
        coverImage: projectForm.coverImage || '',
        liveUrl: projectForm.liveUrl || 'https://',
        techs: projectForm.techs || ['HTML5']
      };
      setProjects([...projects, newProj]);
      triggerSuccess(lang === 'ar' ? 'تم إضافة المشروع الفاخر الجديد!' : 'New premium project deployed!');
    }
    setShowProjectModal(false);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المشروع نهائياً؟' : 'Confirm absolute deletion of this project?')) {
      setProjects(projects.filter(p => p.id !== id));
      triggerSuccess(lang === 'ar' ? 'تم حذف المشروع.' : 'Project deleted successfully.');
    }
  };

  // 2. SERVICES CRUD
  const handleOpenServiceAdd = () => {
    setEditingServiceId(null);
    setServiceForm({
      key: 'custom',
      titleAr: '', titleEn: '',
      descAr: '', descEn: '',
      longDescAr: '', longDescEn: '',
      benefitsAr: ['تنفيذ فوري احترافي'], benefitsEn: ['Instant outcome integration'],
      featuresAr: ['متابعة على مدار الساعة'], featuresEn: ['Nonstop live telemetry'],
      deliveryTimeAr: 'أسبوع واحد', deliveryTimeEn: '1 week',
      icon: 'Globe'
    });
    setShowServiceModal(true);
  };

  const handleOpenServiceEdit = (s: Service) => {
    setEditingServiceId(s.id);
    setServiceForm(s);
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceId) {
      const updated = services.map(s => s.id === editingServiceId ? { ...s, ...serviceForm } as Service : s);
      setServices(updated);
      triggerSuccess(lang === 'ar' ? 'تم حفظ تعديلات الخدمة.' : 'Service modifications saved.');
    } else {
      const newServ: Service = {
        id: 's_' + Date.now(),
        key: serviceForm.key || 'custom',
        titleAr: serviceForm.titleAr || '',
        titleEn: serviceForm.titleEn || '',
        descAr: serviceForm.descAr || '',
        descEn: serviceForm.descEn || '',
        longDescAr: serviceForm.longDescAr || '',
        longDescEn: serviceForm.longDescEn || '',
        benefitsAr: serviceForm.benefitsAr || [],
        benefitsEn: serviceForm.benefitsEn || [],
        featuresAr: serviceForm.featuresAr || [],
        featuresEn: serviceForm.featuresEn || [],
        deliveryTimeAr: serviceForm.deliveryTimeAr || '7 أيام',
        deliveryTimeEn: serviceForm.deliveryTimeEn || '7 days',
        icon: serviceForm.icon || 'Globe'
      };
      setServices([...services, newServ]);
      triggerSuccess(lang === 'ar' ? 'تم إدراج الخدمة الجديدة.' : 'New service vertical published.');
    }
    setShowServiceModal(false);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الخدمة؟ ميزاتها ستختفي من واجهة العميل.' : 'Are you sure about deleting this service from front interface?')) {
      setServices(services.filter(s => s.id !== id));
      triggerSuccess(lang === 'ar' ? 'تم حذف الخدمة.' : 'Service successfully deleted.');
    }
  };

  // 3. REVIEWS MODERATION (Approve, Reject, Delete)
  const handleApproveReview = (id: string) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: 'approved' as const } : r);
    setReviews(updated);
    triggerSuccess(lang === 'ar' ? 'تم الموافقة على المراجعة وستعرض حالاً للزوار!' : 'Review approved and published live!');
  };

  const handleRejectReview = (id: string) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r);
    setReviews(updated);
    triggerSuccess(lang === 'ar' ? 'تم رفض المراجعة.' : 'Review rejected successfully.');
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف المراجعة نهائياً؟' : 'Delete this testimonial forever?')) {
      setReviews(reviews.filter(r => r.id !== id));
      triggerSuccess(lang === 'ar' ? 'تم حذف المراجعة.' : 'Review deleted.');
    }
  };

  const handleOpenReviewAdd = () => {
    setEditingReviewId(null);
    setReviewForm({
      name: '',
      comment: '',
      rating: 5,
      status: 'approved',
      date: new Date().toISOString().split('T')[0]
    });
    setShowReviewModal(true);
  };

  const handleOpenReviewEdit = (r: Review) => {
    setEditingReviewId(r.id);
    setReviewForm(r);
    setShowReviewModal(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReviewId) {
      const updated = reviews.map(r => r.id === editingReviewId ? { ...r, ...reviewForm } as Review : r);
      setReviews(updated);
      triggerSuccess(lang === 'ar' ? 'تم تحديث المراجعة بنجاح!' : 'Review updated successfully!');
    } else {
      const newReview: Review = {
        id: 'rev_' + Date.now(),
        name: reviewForm.name || 'عميل مجهول',
        comment: reviewForm.comment || '',
        rating: reviewForm.rating || 5,
        status: reviewForm.status || 'approved',
        date: reviewForm.date || new Date().toISOString().split('T')[0]
      };
      setReviews([...reviews, newReview]);
      triggerSuccess(lang === 'ar' ? 'تم إضافة رأي العميل الجديد بنجاح!' : 'New client review added successfully!');
    }
    setShowReviewModal(false);
  };

  // 4. HOMEPAGE & CMS TEXTS
  const handleSaveHomepageTexts = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSuccess(lang === 'ar' ? 'تم حفظ إعدادات الصفحة الرئيسية بنجاح!' : 'Homepage settings saved successfully!');
  };

  // 5. SEO SETTINGS
  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSuccess(lang === 'ar' ? 'تم تحديث قواعد وبطاقات الـ SEO محلياً!' : 'SEO tags fully integrated and cached!');
  };

  // 6. GENERAL CONFIG
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSuccess(lang === 'ar' ? 'تم تخزين بيانات الاتصال والحسابات بنجاح!' : 'Contact settings synced!');
  };

  // Calculate statistics summaries for visual layout
  const statsSummary = useMemo(() => {
    return {
      totalProjects: projects.length,
      activeServices: services.length,
      pendingReviews: reviews.filter(r => r.status === 'pending').length,
      approvedReviews: reviews.filter(r => r.status === 'approved').length,
      totalLeads: (leads || []).length,
      newLeads: (leads || []).filter(l => l.status === 'new').length,
    };
  }, [projects, services, reviews, leads]);

  // Generators for SEO Sitemap XML and Robots txt preview
  const sitemapXmlPreview = useMemo(() => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://luxcode.sa/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://luxcode.sa/#services</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://luxcode.sa/#portfolio</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
  }, []);

  const robotsTxtPreview = useMemo(() => {
    return `User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://luxcode.sa/sitemap.xml`;
  }, []);

  return (
    <div className={`min-h-screen pt-28 pb-16 relative z-10 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-950'
    }`} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Top Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b pb-6 border-slate-800">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{lang === 'ar' ? 'بوابة المدير المعتمدة والآمنة' : 'Secure Enterprise Admin Console'}</span>
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">
              LuxCod Live CMS
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onBackToWebsite}
              className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border w-1/2 sm:w-auto justify-center cursor-pointer ${
                theme === 'dark' 
                  ? 'border-slate-800 hover:bg-slate-900 text-slate-300' 
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
              }`}
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              <span>{lang === 'ar' ? 'رجوع للمعاينة الحية' : 'View Core Website'}</span>
            </button>

            <button
              onClick={() => {
                if(window.confirm(lang === 'ar' ? 'إعادة التعيين ستلغي كل تعديلاتك وتستعيد بيانات البداية الافتراضية. هل تريد المتابعة؟' : 'This will reset all current local edits and reload original seeds. Continue?')) {
                  onResetAll();
                  triggerSuccess(lang === 'ar' ? 'تمت استعادة الإعدادات الأصلية الافتراضية!' : 'Default settings restored successfully!');
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-red-950/20 text-red-400 border border-red-900/30 w-1/2 sm:w-auto justify-center hover:bg-red-950/40 cursor-pointer"
              title="Reset Settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إعادة ضبط كلي' : 'Factory Reset'}</span>
            </button>
          </div>
        </div>

        {/* Global CMS Counters block */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8 select-none">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-900' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-xs opacity-60 font-mono block mb-1">{lang === 'ar' ? 'استشارات جديدة 📥' : 'NEW LEADS'}</span>
            <span className={`text-2xl font-black font-mono ${statsSummary.newLeads > 0 ? 'text-rose-500 animate-pulse font-extrabold' : 'text-slate-400'}`}>{statsSummary.newLeads}</span>
          </div>
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-900' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-xs opacity-60 font-mono block mb-1">{lang === 'ar' ? 'إجمالي الاستشارات' : 'TOTAL LEADS'}</span>
            <span className="text-2xl font-black font-mono text-cyan-400">{statsSummary.totalLeads}</span>
          </div>
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-900' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-xs opacity-60 font-mono block mb-1">{lang === 'ar' ? 'مشاريع معرضة' : 'PROJECTS'}</span>
            <span className="text-2xl font-black font-mono text-purple-400">{statsSummary.totalProjects}</span>
          </div>
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-900' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-xs opacity-60 font-mono block mb-1">{lang === 'ar' ? 'آراء بانتظار الاعتماد' : 'PENDING REVIEWS'}</span>
            <span className={`text-2xl font-black font-mono ${statsSummary.pendingReviews > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`}>{statsSummary.pendingReviews}</span>
          </div>
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-900' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-xs opacity-60 font-mono block mb-1">{lang === 'ar' ? 'الخدمات النشطة' : 'ACTIVE SERVICES'}</span>
            <span className="text-2xl font-black font-mono text-emerald-400">{statsSummary.activeServices}</span>
          </div>
        </div>

        {/* Multi-Tab Navigation bar layout */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 mb-8 overflow-x-auto pb-1.5">
          {[
            { key: 'leads', labelAr: 'طلبات الاستشارة الواردة 📥', labelEn: 'Inbound Leads', icon: <FileCode className="w-4 h-4" /> },
            { key: 'portfolio', labelAr: 'معرض المشاريع', labelEn: 'Portfolio Projects', icon: <Layers className="w-4 h-4" /> },
            { key: 'services', labelAr: 'الخدمات التقنية', labelEn: 'Services Spec', icon: <Sparkles className="w-4 h-4" /> },
            { key: 'reviews', labelAr: 'إدارة الآراء والتقييمات', labelEn: 'Verify Reviews', icon: <MessageSquare className="w-4 h-4" /> },
            { key: 'homepage', labelAr: 'نصوص الواجهة', labelEn: 'Hero & Home', icon: <Building className="w-4 h-4" /> },
            { key: 'seo', labelAr: 'إدارة الـ SEO والخرائط', labelEn: 'Search Engines SEO', icon: <Globe className="w-4 h-4" /> },
            { key: 'settings', labelAr: 'بيانات التواصل', labelEn: 'Agency Contacts', icon: <Settings className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold'
                  : 'hover:text-cyan-400 opacity-70'
              }`}
            >
              {tab.icon}
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              {tab.key === 'leads' && statsSummary.newLeads > 0 && (
                <span className="ms-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500 text-white animate-pulse">
                  {statsSummary.newLeads}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic feedback banners */}
        {saveSuccess && (
          <div role="alert" className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-900 text-emerald-400 text-sm flex items-center gap-2 animate-floating">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Tab content panels */}
        <div className={`p-6 sm:p-8 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-900/30 border-slate-900' : 'bg-white border-slate-200 shadow-sm'
        }`}>

          {/* 0. INBOUND CUSTOMER CONSULTATION LEADS TABS */}
          {activeTab === 'leads' && (
            <div className="space-y-6 animate-fade">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-950 dark:text-white">
                    {lang === 'ar' ? 'طلبات الاستشارة والتحليل الرقمي الواردة' : 'Inbound Project Discovery Leads'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 pb-2">
                    {lang === 'ar' 
                      ? 'هنا تجد كافة الطلبات المسجلة من نموذج الاستشارة في موقعك، يمكنك تتبع حالاتهم والتواصل الفوري معهم.' 
                      : 'Review client inputs, project briefs, contact options and lead pipelines submitted.'}
                  </p>
                </div>
                {leads.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm(lang === 'ar' ? 'هل تود بالتأكيد مسح كافة بيانات سجل العملاء نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.' : 'Are you sure you want to clear all lead entries? This action is permanent.')) {
                        setLeads([]);
                        triggerSuccess(lang === 'ar' ? 'تم حذف السجل بنجاح.' : 'Leads database cleared.');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/30 text-red-400 border border-red-900/40 hover:bg-red-950/60 cursor-pointer transition-all self-end animate-fade"
                  >
                    {lang === 'ar' ? 'مسح كافة السجلات 🗑️' : 'Clear All Records'}
                  </button>
                )}
              </div>

              {(leads || []).length === 0 ? (
                <div className="p-12 border border-dashed border-slate-800 rounded-2xl text-center">
                  <div className="p-3 bg-slate-950/50 border border-slate-800/40 rounded-full w-fit mx-auto mb-3">
                    <FileCode className="w-8 h-8 text-slate-500 opacity-60" />
                  </div>
                  <p className="text-sm font-semibold opacity-75">{lang === 'ar' ? 'السجل فارغ حالياً!' : 'Lead registry is fully clean.'}</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    {lang === 'ar'
                      ? 'بمجرد أن يقوم أحد زوار موقع الوكالة بملء طلب "احجز مشورتك المجانية" وإرساله من الصفحة الرئيسية، سيظهر لك هنا مباشرة بتفاصيله وحالته.'
                      : 'Whenever clients submit technical scoping sheets on the frontpage, they streaming-sync instantly here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(leads || []).map((lead) => {
                    const getServiceName = (key: string) => {
                      switch (key) {
                        case 'web': return lang === 'ar' ? 'تصميم وتطوير المواقع والمنصات الذكية' : 'Website Design & Development';
                        case 'bot': return lang === 'ar' ? 'أنظمة بوتات واتساب الذكية والرد التلقائي' : 'Smart WhatsApp Bot Pipelines';
                        case 'landing': return lang === 'ar' ? 'تصميم صفحات الهبوط الاحترافية سريعة التحول' : 'Premium Landing Page Engineering';
                        case 'uiux': return lang === 'ar' ? 'مراجعة وتطوير تجربة المستخدم ومظهر واجهات التطبيقات' : 'UI/UX Audit & Redesign';
                        case 'integrations': return lang === 'ar' ? 'ربط وتكامل الأنظمة والواجهات البرمجية الفعالة' : 'System Integrations & APIs';
                        case 'nfc': return lang === 'ar' ? 'بطاقات الأعمال الرقمية الذكية بتقنية NFC' : 'Luxury NFC Digital Business Cards';
                        default: return key;
                      }
                    };

                    return (
                      <div
                        key={lead.id}
                        className={`p-5 rounded-xl border flex flex-col gap-4 transition-all ${
                          lead.status === 'new'
                            ? 'border-cyan-500/35 bg-cyan-950/10'
                            : lead.status === 'contacted'
                              ? 'border-indigo-900/40 bg-indigo-950/10'
                              : 'border-slate-800 bg-slate-950/20 opacity-70'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-extrabold text-sm text-cyan-400">{lead.name}</span>
                            <span className="text-[10px] opacity-45 font-mono">{lead.date}</span>
                            <span className={`text-[9px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded-md ${
                              lead.status === 'new'
                                ? 'bg-cyan-500/15 text-cyan-400 animate-pulse'
                                : lead.status === 'contacted'
                                  ? 'bg-indigo-500/15 text-indigo-400'
                                  : 'bg-emerald-500/15 text-emerald-400'
                            }`}>
                              {lead.status === 'new' 
                                ? (lang === 'ar' ? 'جديد 🆕' : 'New') 
                                : lead.status === 'contacted' 
                                  ? (lang === 'ar' ? 'تم التواصل 📞' : 'Contacted') 
                                  : (lang === 'ar' ? 'مكتمل ✅' : 'Completed')}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            {lead.status !== 'contacted' && (
                              <button
                                onClick={() => {
                                  const updated = leads.map(l => l.id === lead.id ? { ...l, status: 'contacted' as const } : l);
                                  setLeads(updated);
                                  triggerSuccess(lang === 'ar' ? 'تم تعليم العميل كـ "تم التواصل بنجاح".' : 'Status marked as "Contacted".');
                                }}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 hover:bg-indigo-900/30 cursor-pointer"
                              >
                                {lang === 'ar' ? 'تعليم كتم التواصل ✔' : 'Mark Contacted'}
                              </button>
                            )}
                            {lead.status !== 'completed' && (
                              <button
                                onClick={() => {
                                  const updated = leads.map(l => l.id === lead.id ? { ...l, status: 'completed' as const } : l);
                                  setLeads(updated);
                                  triggerSuccess(lang === 'ar' ? 'تم اكتمال وحفظ طلب الاستشارة.' : 'Status marked as "Completed".');
                                }}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 hover:bg-emerald-905/30 cursor-pointer"
                              >
                                {lang === 'ar' ? 'تعليم كمكتمل 🎉' : 'Mark Completed'}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (window.confirm(lang === 'ar' ? 'هل تود بالتأكيد حذف هذه الاستشارة نهائياً؟' : 'Remove this specific lead record?')) {
                                  setLeads(leads.filter(l => l.id !== lead.id));
                                  triggerSuccess(lang === 'ar' ? 'تم حذف الطلب بنجاح.' : 'Lead record removed.');
                                }
                              }}
                              className="p-1.5 rounded-lg text-red-400 bg-red-950/20 border border-red-900/30 hover:bg-red-950/50 cursor-pointer"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/50 p-4 rounded-lg border border-slate-900">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-0.5">{lang === 'ar' ? 'رقم الهاتف للتواصل مباشر' : 'Contact Phone'}</span>
                            <span className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer block" onClick={() => window.open(`tel:${lead.phone}`, '_self')}>{lead.phone}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-0.5">{lang === 'ar' ? 'الخدمة التقنية المطلوبة' : 'Requested Service'}</span>
                            <span className="text-xs text-purple-300 font-sans block">{getServiceName(lead.service)}</span>
                          </div>
                        </div>

                        <div className="bg-slate-950/30 p-4 rounded-lg border border-slate-900/40 leading-relaxed text-xs">
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                            {lang === 'ar' ? 'تفاصيل المتطلبات والطلب' : 'Inquiry Message Spec'}
                          </span>
                          <p className="text-slate-200 whitespace-pre-wrap font-sans">{lead.msg}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const cleanPhone = cleanMobileForWhatsApp(lead.phone);
                              const chatMsg = lang === 'ar'
                                ? `مرحباً أ. ${lead.name}، أنا مستشارك التقني من وكالة LuxCod الرقمية الرائدة، لقد تلقينا بكل ترحيب طلبك الاستشاري حول "${getServiceName(lead.service)}" ويسعدنا المباشرة بمناقشة تفاصيل المشروع معك...`
                                : `Hello Mr. ${lead.name}, this is your tech advisor from LuxCod digital agency. We received your project briefing on "${getServiceName(lead.service)}" and are ready to finalize scoping of development with you...`;
                              
                              if (!cleanPhone) {
                                alert(lang === 'ar' ? 'عذراً، رقم الهاتف غير صالح لإرسال واتساب.' : 'Sorry, the phone number is invalid for WhatsApp.');
                                return;
                              }
                              window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(chatMsg)}`, '_blank');
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
                            <span>{lang === 'ar' ? 'ابدأ محادثة واتساب مع العميل' : 'Open WhatsApp Scoping'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 1. PORTFOLIO TABS */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 animate-fade">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">{lang === 'ar' ? 'إدارة معرض الهوية والمشاريع' : 'Listed Projects Repository'}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === 'ar' 
                      ? 'أضف أعمال ومشاريع جديدة للوكالة، حدد صوراً مميزة، أو عدل الروابط والتفاصيل للجمهور.' 
                      : 'Deploy, configure, adjust visuals or update live web systems from active digital builds.'}
                  </p>
                </div>
                <button
                  onClick={handleOpenProjectAdd}
                  className="px-4 py-2.5 rounded-xl text-slate-950 font-bold text-xs bg-cyan-400 flex items-center gap-1.5 hover:shadow-md hover:shadow-cyan-400/30 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'ar' ? 'إضافة مشروع جديد' : 'Deploy New Project'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-slate-800/60 flex items-center justify-between gap-4 bg-slate-950/45">
                    <div className="flex items-center gap-3">
                      <img src={proj.coverImage} className="w-12 h-12 rounded object-cover border border-slate-800" alt="" />
                      <div>
                        <h4 className="font-bold text-xs">{lang === 'ar' ? proj.nameAr : proj.nameEn}</h4>
                        <span className="text-[10px] text-cyan-400 font-mono block truncate max-w-[180px] sm:max-w-xs">{proj.liveUrl}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenProjectEdit(proj)}
                        className="p-2 rounded-lg bg-indigo-950/30 text-indigo-400 border border-indigo-900/20 hover:bg-indigo-900/40 cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 rounded-lg bg-red-950/30 text-red-400 border border-red-900/20 hover:bg-red-950/50 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. SERVICES TABS */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">{lang === 'ar' ? 'الخدمات التقنية المعتمدة' : 'Tech Vertical Offerings (Locked)'}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === 'ar' 
                      ? 'تم تثبيت قائمة خدمات الموقع الرسمية لضمان سلامة الروابط وتوجيه طلبات الاستشارة.' 
                      : 'Website services are fixed to ensure absolute database and routing alignment.'}
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto flex items-center gap-1.5 select-none">
                  <ShieldCheck className="w-4 h-4 text-emerald-455" />
                  <span>{lang === 'ar' ? 'معتمد وثابت ✅' : 'Fixed & Read Only'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl border border-slate-800/60 flex items-center justify-between gap-4 bg-slate-950/45">
                    <div>
                      <h4 className="font-bold text-xs">{lang === 'ar' ? s.titleAr : s.titleEn}</h4>
                      <span className="text-[10px] text-purple-400 block mt-1">Icon: {s.icon} | Time: {s.deliveryTimeAr}</span>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400 font-bold border border-slate-700/50 select-none">
                      {lang === 'ar' ? 'ثابت 🔒' : 'Static'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. REVIEWS TABS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg">{lang === 'ar' ? 'مراقبة واعتماد مراجعات وآراء العملاء' : 'Review Moderation Desk'}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === 'ar' 
                      ? 'يمكنك إضافة مراجعات يدوية حقيقية أو تعديل وحذف الآراء الموجودة والمسجلة للتحكم المطلق بما ينشر للجمهور.' 
                      : 'Add real manual reviews, edit existing ratings, or manage approvals for public display.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenReviewAdd}
                  className="px-4 py-2 bg-cyan-400 font-bold text-slate-950 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer self-start sm:self-auto hover:opacity-90 transition-all shadow-lg shadow-cyan-500/10"
                >
                  <Plus className="w-4 h-4 text-slate-950 animate-pulse" />
                  <span>{lang === 'ar' ? 'إضافة مراجعة/تعليق جديد' : 'Add New Review'}</span>
                </button>
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400">{lang === 'ar' ? 'لا توجد مراجعات حالياً.' : 'No reviews listed.'}</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        rev.status === 'pending'
                          ? 'border-amber-900/60 bg-amber-950/15'
                          : rev.status === 'approved'
                            ? 'border-emerald-900/20 bg-emerald-950/5'
                            : 'border-slate-800 bg-slate-950/30 opacity-70'
                      }`}
                    >
                      <div className="space-y-1 w-full sm:w-3/4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{rev.name}</span>
                          <span className="text-[10px] font-mono opacity-50">({rev.date})</span>
                          <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                            rev.status === 'pending' ? 'bg-amber-400/20 text-amber-400' : rev.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-400/20 text-red-400'
                          }`}>
                            {rev.status}
                          </span>
                        </div>
                        <p className="text-xs italic text-slate-300">"{rev.comment}"</p>
                        <p className="text-xs text-cyan-455 text-cyan-400">★ {rev.rating} / 5</p>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        {rev.status === 'pending' && (
                          <button
                            onClick={() => handleApproveReview(rev.id)}
                            className="p-1.5 rounded-lg text-emerald-400 bg-emerald-950/30 hover:bg-emerald-950/70 border border-emerald-900/50"
                            title="Approve Review"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {rev.status === 'approved' && (
                          <button
                            onClick={() => handleRejectReview(rev.id)}
                            className="p-1.5 rounded-lg text-amber-400 bg-amber-950/30 hover:bg-amber-950/70 border border-amber-900/50"
                            title="Reject/Unpublish"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenReviewEdit(rev)}
                          className="p-1.5 rounded-lg text-cyan-400 bg-cyan-950/30 hover:bg-cyan-950/70 border border-cyan-900/50"
                          title="Edit Review Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg text-red-500 bg-red-950/30 hover:bg-red-950/70 border border-red-900/40"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. HOMEPAGE CONFIG */}
          {activeTab === 'homepage' && (
            <form onSubmit={handleSaveHomepageTexts} className="space-y-6">
              <h3 className="font-bold text-lg">{lang === 'ar' ? 'تعديل نصوص واجهة العميل الرئيسية ومقاييس الأداء' : 'Modify Core Layout Copy'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">{lang === 'ar' ? 'العنوان الرئيسي للـ Hero (بالعربية)' : 'Hero headline (Ar)'}</label>
                  <input
                    type="text"
                    value={content.heroTitleAr}
                    onChange={(e) => setContent({ ...content, heroTitleAr: e.target.value })}
                    className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">{lang === 'ar' ? 'العنوان الرئيسي للـ Hero (بالإنكليزية)' : 'Hero headline (En)'}</label>
                  <input
                    type="text"
                    value={content.heroTitleEn}
                    onChange={(e) => setContent({ ...content, heroTitleEn: e.target.value })}
                    className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">{lang === 'ar' ? 'العنوان الفرعي للـ Hero (العربية)' : 'Hero Subsubtitle (Ar)'}</label>
                <textarea
                  rows={3}
                  value={content.heroSubtitleAr}
                  onChange={(e) => setContent({ ...content, heroSubtitleAr: e.target.value })}
                  className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">{lang === 'ar' ? 'العنوان الفرعي للـ Hero (الإنكليزية)' : 'Hero Subsubtitle (En)'}</label>
                <textarea
                  rows={3}
                  value={content.heroSubtitleEn}
                  onChange={(e) => setContent({ ...content, heroSubtitleEn: e.target.value })}
                  className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Statistics Counters adjustment */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <h4 className="font-bold text-sm text-cyan-400">{lang === 'ar' ? 'تعديل أرقام وعدادات الإحصائيات' : 'Verify Project Metrics'}</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">{lang === 'ar' ? 'المشاريع المنفذة' : 'Projects Completed'}</label>
                    <input
                      type="number"
                      value={content.statProjects}
                      onChange={(e) => setContent({ ...content, statProjects: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded border text-xs bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">{lang === 'ar' ? 'العملاء السعداء' : 'Happy Clients'}</label>
                    <input
                      type="number"
                      value={content.statCustomers}
                      onChange={(e) => setContent({ ...content, statCustomers: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded border text-xs bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">{lang === 'ar' ? 'سنوات الخبرة' : 'Years Experience'}</label>
                    <input
                      type="number"
                      value={content.statExperience}
                      onChange={(e) => setContent({ ...content, statExperience: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded border text-xs bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">{lang === 'ar' ? 'الخدمات المهيأة' : 'Services Vertical'}</label>
                    <input
                      type="number"
                      value={content.statServices}
                      onChange={(e) => setContent({ ...content, statServices: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 rounded border text-xs bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs bg-cyan-400 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>{lang === 'ar' ? 'حفظ التعديلات الحية' : 'Save Homepage Content Settings'}</span>
              </button>
            </form>
          )}

          {/* 5. SEO MANAGER */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveSEO} className="space-y-4">
                <h3 className="font-bold text-lg">{lang === 'ar' ? 'إدارة التهيئة لمحركات البحث SEO والميتا داتا' : 'Engine Master (SEO Suite)'}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-slate-400 mb-2">{lang === 'ar' ? 'عنوان الميتا (العربية)' : 'Meta title (Ar)'}</label>
                    <input
                      type="text"
                      value={seo.metaTitleAr}
                      onChange={(e) => setSeo({ ...seo, metaTitleAr: e.target.value })}
                      className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-slate-400 mb-2">{lang === 'ar' ? 'عنوان الميتا (الانكليزية)' : 'Meta title (En)'}</label>
                    <input
                      type="text"
                      value={seo.metaTitleEn}
                      onChange={(e) => setSeo({ ...seo, metaTitleEn: e.target.value })}
                      className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-2">{lang === 'ar' ? 'وصف الميتا الترويجي (العربية)' : 'Meta Descriptor text (Ar)'}</label>
                  <textarea
                    rows={2}
                    value={seo.metaDescAr}
                    onChange={(e) => setSeo({ ...seo, metaDescAr: e.target.value })}
                    className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-slate-400 mb-2">{lang === 'ar' ? 'وصف الميتا الترويجي (الإنكليزية)' : 'Meta Descriptor text (En)'}</label>
                  <textarea
                    rows={2}
                    value={seo.metaDescEn}
                    onChange={(e) => setSeo({ ...seo, metaDescEn: e.target.value })}
                    className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-slate-100"
                  />
                </div>

                <div className="flex items-center gap-4 py-2 border-y border-slate-800">
                  <span className="text-xs uppercase text-slate-400">{lang === 'ar' ? 'نوع بطاقات Open Graph:' : 'OG:Type standard:'}</span>
                  <select
                    value={seo.ogType}
                    onChange={(e) => setSeo({ ...seo, ogType: e.target.value })}
                    className="p-1.5 rounded border text-xs bg-slate-950 border-slate-805 text-white"
                  >
                    <option value="website">website (standard)</option>
                    <option value="article">article</option>
                    <option value="profile">profile</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs bg-cyan-400 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'ar' ? 'تحديث وتطبيق الـ SEO' : 'Commit SEO Settings'}</span>
                </button>
              </form>

              {/* Dynamic Downlodable codes section (Sitemap.xml and Robots.txt representation) */}
              <div className="border-t border-slate-800 pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5 mb-2">
                      <FileCode className="w-4 h-4" />
                      <span>Sitemap.xml (Auto generated dynamically)</span>
                    </span>
                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto h-40">
                      {sitemapXmlPreview}
                    </pre>
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1.5 mb-2">
                      <FileCode className="w-4 h-4" />
                      <span>Robots.txt file code logic</span>
                    </span>
                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-orange-300 overflow-x-auto h-40">
                      {robotsTxtPreview}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. GENERAL CONFIG (Settings) */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSiteSettings} className="space-y-6">
              <h3 className="font-bold text-lg">{lang === 'ar' ? 'إعدادات المنصة وهواتف الـ CRM والواتساب' : 'Agency Global Parameters'}</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-2">{lang === 'ar' ? 'رقم الهاتف الرسمي للاتصال' : 'Direct Call Line phone'}</label>
                  <input
                    type="text"
                    value={siteSettings.phone}
                    onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">{lang === 'ar' ? 'رقم الواتساب المتصل بالرسائل الآلية' : 'API Whatsapp Target telephone'}</label>
                  <input
                    type="text"
                    value={siteSettings.whatsapp}
                    onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                    className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-white"
                  />
                  <span className="text-[9px] opacity-40 leading-none block mt-1">{lang === 'ar' ? 'اكتبه كاملا وبدون علامات زائد (مثال: 966506572881)' : 'Write in full international format (e.g. 966506572881)'}</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">{lang === 'ar' ? 'البريد الإلكتروني للوكالة' : 'Corporate Official Email'}</label>
                  <input
                    type="text"
                    value={siteSettings.email}
                    onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Twitter Profile Link</label>
                  <input
                    type="text"
                    value={siteSettings.twitter}
                    onChange={(e) => setSiteSettings({ ...siteSettings, twitter: e.target.value })}
                    className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Instagram Link</label>
                  <input
                    type="text"
                    value={siteSettings.instagram}
                    onChange={(e) => setSiteSettings({ ...siteSettings, instagram: e.target.value })}
                    className="w-full p-2.5 rounded-lg border text-sm bg-slate-950 border-slate-800 text-white"
                  />
                </div>
              </div>

              {/* Telegram Integration Configuration */}
              <div className="p-4 rounded-xl border border-dashed border-indigo-500/20 bg-indigo-950/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide">
                      {lang === 'ar' ? 'ربط وإشعارات بوت تليجرام (Telegram Bot)' : 'Telegram Bot Notifications'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {lang === 'ar' 
                        ? 'تلقى إشعارات فورية على هاتفك عبر تليجرام عند وصول أي طلب استشارة أو تعليق جديد.' 
                        : 'Get instant ping notifications on your Telegram app when new leads or reviews arrive.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={!!siteSettings.telegramEnabled} 
                      onChange={(e) => setSiteSettings({ ...siteSettings, telegramEnabled: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                {siteSettings.telegramEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[10px] text-slate-300 font-mono mb-2">BOT TOKEN</label>
                      <input
                        type="text"
                        placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                        value={siteSettings.telegramBotToken || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, telegramBotToken: e.target.value })}
                        className="w-full p-2.5 rounded-lg border text-xs bg-slate-950 border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-300 font-mono mb-2">CHAT ID</label>
                      <input
                        type="text"
                        placeholder="e.g. 987654321 or @my_channel"
                        value={siteSettings.telegramChatId || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, telegramChatId: e.target.value })}
                        className="w-full p-2.5 rounded-lg border text-xs bg-slate-950 border-slate-800 text-white font-mono"
                      />
                    </div>
                    <div className="md:col-span-2 pt-2">
                      <button
                        type="button"
                        onClick={handleTestTelegram}
                        disabled={testingTg || !siteSettings.telegramBotToken || !siteSettings.telegramChatId}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
                      >
                        {testingTg ? (
                          <span>{lang === 'ar' ? 'جاري فحص الاتصال...' : 'Testing connection...'}</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'فحص اتصال البوت وإرسال رسالة تجريبية' : 'Test Bot Connection & Send Mock Message'}</span>
                          </>
                        )}
                      </button>
                      
                      {tgTestResult && (
                        <div className={`mt-2 p-2.5 rounded-lg text-xs leading-relaxed ${
                          tgTestResult.type === 'success' 
                            ? 'bg-emerald-950/45 border border-emerald-500/30 text-emerald-300 animate-fade-in' 
                            : 'bg-red-950/45 border border-red-500/30 text-red-300 animate-fade-in'
                        }`}>
                          {tgTestResult.msg}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* HIGH-FIDELITY DYNAMIC EXTERNAL API INTEGRATION SETTINGS */}
              <div className="p-5 rounded-xl border border-dashed border-cyan-500/20 bg-cyan-950/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-cyan-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      {lang === 'ar' ? 'الربط الديناميكي ومزامنة البيانات مع API خارجي' : 'External Dynamic API Database Integration'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-xl">
                      {lang === 'ar' 
                        ? 'قم بتفعيل هذا الخيار لربط الموقع بقاعدة بيانات REST أو JSON خارجي (مثل JSONBin أو MockAPI أو مخدمك الخاص). يضمن بقاء التعديلات ديناميكية وحية عند تشغيل الموقع على منصات الاستضافة الثابتة مثل Vercel.' 
                        : 'Optionally sync live data updates directly with a remote REST/JSON API URL (e.g. JSONBin, custom server or KV). Keeps website settings dynamic on static hosting sites like Vercel.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={!!siteSettings.externalApiEnabled} 
                      onChange={(e) => setSiteSettings({ ...siteSettings, externalApiEnabled: e.target.checked })}
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-400"></div>
                  </label>
                </div>

                {siteSettings.externalApiEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                    <div className="md:col-span-6">
                      <label className="block text-[10px] text-slate-300 font-mono mb-2">
                        {lang === 'ar' ? 'رابط الـ API الخارجي (URL Endpoint)' : 'EXTERNAL API ENDPOINT URL'}
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://api.jsonbin.io/v3/b/MY_BIN_ID or custom server"
                        value={siteSettings.externalApiUrl || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, externalApiUrl: e.target.value })}
                        className="w-full p-2.5 rounded-lg border text-xs bg-slate-950 border-slate-800 text-white font-mono"
                      />
                      <p className="text-[9px] text-slate-500 mt-1">
                        {lang === 'ar' 
                          ? 'الرابط الذي سيقوم المخدم أو المتصفح بإرسال طلبات الـ GET و PUT إليه لقراءة وحفظ البيانات.' 
                          : 'Requests GET (load) and PUT/POST (save) will be automatically triggered to this endpoint.'}
                      </p>
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-[10px] text-slate-300 font-mono mb-2">
                        {lang === 'ar' ? 'مفتاح الترخيص / الرمز السري (الخياري)' : 'API SECRET KEY / TOKEN (OPTIONAL)'}
                      </label>
                      <input
                        type="password"
                        placeholder="e.g. Bearer token or master-key"
                        value={siteSettings.externalApiKey || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, externalApiKey: e.target.value })}
                        className="w-full p-2.5 rounded-lg border text-xs bg-slate-950 border-slate-800 text-white font-mono"
                      />
                      <p className="text-[9px] text-slate-500 mt-1">
                        {lang === 'ar' 
                          ? 'سيتم إرفاقه تلقائياً في خانات الهيدرز (Authorization)' 
                          : 'Passed in authorization/X-Api-Key headers automatically.'}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] text-slate-300 font-mono mb-2">
                        {lang === 'ar' ? 'طريقة الحفظ' : 'HTTP METHOD'}
                      </label>
                      <select
                        value={siteSettings.externalApiMethod || 'PUT'}
                        onChange={(e) => setSiteSettings({ ...siteSettings, externalApiMethod: e.target.value as any })}
                        className="w-full p-2.5 rounded-lg border text-xs bg-slate-950 border-slate-800 text-slate-300 font-mono"
                      >
                        <option value="PUT">PUT</option>
                        <option value="POST">POST</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs bg-cyan-400 flex items-center gap-1.5 cursor-pointer hover:bg-cyan-300 transition-all select-none"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>{lang === 'ar' ? 'حفظ إعدادات المخدم والـ API' : 'Apply Settings Parameter'}</span>
              </button>
            </form>
          )}

        </div>

      </div>

      {/* FLOATING PROJECT EDIT DIRECT DIALOG / MODAL */}
      {showProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto pt-24 pb-8">
          <form onSubmit={handleSaveProject} className={`w-full max-w-xl rounded-2xl border shadow-2xl p-6 sm:p-8 space-y-4 my-8 md:my-16 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-950'
          }`}>
            <h3 className="font-extrabold text-lg">
              {editingProjectId ? (lang === 'ar' ? 'تعديل بيانات مشروع السجل' : 'Modify Record Project Details') : (lang === 'ar' ? 'إضافة مشروع جديد للمعرض' : 'Deploy Advanced Project Profile')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'الاسم (بالعربية)' : 'Name (Ar)'}</label>
                <input
                  type="text" required
                  value={projectForm.nameAr || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, nameAr: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'الاسم (بالإنجليزية)' : 'Name (En)'}</label>
                <input
                  type="text" required
                  value={projectForm.nameEn || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, nameEn: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'القسم (بالعربية)' : 'Category (Ar)'}</label>
                <input
                  type="text" required
                  value={projectForm.categoryAr || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, categoryAr: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'القسم (بالإنجليزية)' : 'Category (En)'}</label>
                <input
                  type="text" required
                  value={projectForm.categoryEn || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, categoryEn: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'شرح مختصر (بالعربية)' : 'Short Description (Ar)'}</label>
                <input
                  type="text" required
                  value={projectForm.descAr || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, descAr: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'شرح مختصر (بالإنجليزية)' : 'Short Description (En)'}</label>
                <input
                  type="text" required
                  value={projectForm.descEn || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, descEn: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'رابط الصورة الغلاف' : 'Cover image URL'}</label>
                <input
                  type="text" required
                  value={projectForm.coverImage || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'رابط المعاينة لايف' : 'Live Preview link'}</label>
                <input
                  type="text" required
                  value={projectForm.liveUrl || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4">
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs rounded-xl"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-400 font-bold text-slate-950 text-xs rounded-xl"
              >
                {lang === 'ar' ? 'حفظ المشروع' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FLOATING SERVICE EDIT DIRECT DIALOG / MODAL */}
      {showServiceModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto pt-24 pb-8">
          <form onSubmit={handleSaveService} className={`w-full max-w-xl rounded-2xl border shadow-2xl p-6 sm:p-8 space-y-4 my-8 md:my-16 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-950'
          }`}>
            <h3 className="font-extrabold text-lg">
              {editingServiceId ? (lang === 'ar' ? 'تعديل الخدمة المتاحة' : 'Configure Vertical Service') : (lang === 'ar' ? 'إدراج خدمة فرعية جديدة' : 'Add New Tech Service Offering')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'عنوان الخدمة (بالعربية)' : 'Title (Ar)'}</label>
                <input
                  type="text" required
                  value={serviceForm.titleAr || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, titleAr: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'عنوان الخدمة (بالإنجليزية)' : 'Title (En)'}</label>
                <input
                  type="text" required
                  value={serviceForm.titleEn || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, titleEn: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'وصف موجز (بالعربية)' : 'Introduction (Ar)'}</label>
                <input
                  type="text" required
                  value={serviceForm.descAr || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, descAr: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'وصف موجز (بالإنجليزية)' : 'Introduction (En)'}</label>
                <input
                  type="text" required
                  value={serviceForm.descEn || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, descEn: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'سرعة وموعد التسليم' : 'Delivery Speed (Ar)'}</label>
                <input
                  type="text" required
                  value={serviceForm.deliveryTimeAr || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, deliveryTimeAr: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'سرعة وموعد التسليم (بالإنجليزية)' : 'Delivery Speed (En)'}</label>
                <input
                  type="text" required
                  value={serviceForm.deliveryTimeEn || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, deliveryTimeEn: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'مفتاح التعريف الفريد بالرسائل' : 'Service Key ID'}</label>
                <input
                  type="text" required
                  value={serviceForm.key || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, key: e.target.value })}
                  className="w-full p-2 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100"
                  placeholder="e.g. web, bot, nfc"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'اسم أيقونة Lucide' : 'Lucide Icon code name'}</label>
                <select
                  value={serviceForm.icon || 'Globe'}
                  onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                  className="w-full p-2.5 rounded border bg-slate-950 border-slate-800 text-xs text-slate-300"
                >
                  <option value="Globe">Globe (Web site)</option>
                  <option value="MessageSquareIcon">MessageSquare (Chatbot)</option>
                  <option value="FileText">FileText (Landing Page)</option>
                  <option value="Sparkles">Sparkles (UI/UX)</option>
                  <option value="Link">Link (Integrations)</option>
                  <option value="Smartphone">Smartphone (NFC)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4">
              <button
                type="button"
                onClick={() => setShowServiceModal(false)}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs rounded-xl"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-400 font-bold text-slate-950 text-xs rounded-xl"
              >
                {lang === 'ar' ? 'حفظ الخدمة' : 'Commit Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FLOATING REVIEW EDIT/ADD DIRECT DIALOG / MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto pt-24 pb-8">
          <form onSubmit={handleSaveReview} className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 sm:p-8 space-y-4 my-8 md:my-16 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-950'
          }`}>
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>
                {editingReviewId 
                  ? (lang === 'ar' ? 'تعديل مراجعة/رأي العميل' : 'Edit Client Review') 
                  : (lang === 'ar' ? 'إضافة مراجعة/رأي جديد يدوياً' : 'Add New Client Review')}
              </span>
            </h3>

            <div>
              <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'اسم العميل / اسم الجهة' : 'Client Name / Company Name'}</label>
              <input
                type="text" required
                value={reviewForm.name || ''}
                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                className="w-full p-2.5 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                placeholder={lang === 'ar' ? 'مثل: م. سارة أحمد أو شركة واعد للحلول' : 'e.g. John Doe / Acme Corp'}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'محتوى التعليق / نص التجربة المكتوب' : 'Review Comment / Testimony Body'}</label>
              <textarea
                required rows={4}
                value={reviewForm.comment || ''}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full p-2.5 rounded border bg-slate-950 border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                placeholder={lang === 'ar' ? 'اكتب تجربة العميل والتعليق الإيجابي الصادق هنا...' : 'Write the actual experience comment here...'}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'التقييم بالنجوم' : 'Rating Stars'}</label>
                <select
                  value={reviewForm.rating || 5}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  className="w-full p-2.5 rounded border bg-slate-950 border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4)</option>
                  <option value={3}>⭐⭐⭐ (3)</option>
                  <option value={2}>⭐⭐ (2)</option>
                  <option value={1}>⭐ (1)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'حالة النشر والموافقة' : 'Publishing Status'}</label>
                <select
                  value={reviewForm.status || 'approved'}
                  onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value as any })}
                  className="w-full p-2.5 rounded border bg-slate-950 border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="approved">{lang === 'ar' ? 'منشور للعامة (Approved)' : 'Approved & Published'}</option>
                  <option value="pending">{lang === 'ar' ? 'معلق للمراجعة (Pending)' : 'Pending Review'}</option>
                  <option value="rejected">{lang === 'ar' ? 'مرفوض ومكتوم (Rejected)' : 'Rejected / Archived'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono mb-1">{lang === 'ar' ? 'التوجيه الرياضي/التاريخ' : 'Date stamp'}</label>
                <input
                  type="date" required
                  value={reviewForm.date || ''}
                  onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })}
                  className="w-full p-2.5 rounded border bg-slate-950 border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs rounded-xl"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-cyan-400 font-bold text-slate-950 text-xs rounded-xl hover:bg-cyan-300 transition-all shadow-md shadow-cyan-400/20"
              >
                {lang === 'ar' ? 'حفظ التعليق' : 'Save Review'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
