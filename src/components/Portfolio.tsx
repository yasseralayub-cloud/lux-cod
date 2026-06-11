import { useState, useEffect } from 'react';
import { Project } from '../types';
import { ExternalLink, X, Globe, Cpu, Layers } from 'lucide-react';

interface PortfolioProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
  projects: Project[];
}

export default function Portfolio({ lang, theme, projects }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeProjectDetail, setActiveProjectDetail] = useState<Project | null>(null);

  // Prevent background website scrolling when the project detail modal is open
  useEffect(() => {
    if (activeProjectDetail) {
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
  }, [activeProjectDetail]);

  // Derive unique categories automatically from active loaded projects!
  const categories = lang === 'ar' 
    ? [
        { key: 'all', label: 'الكل' },
        { key: 'beauty', label: 'جمال وتجميل' },
        { key: 'spa', label: 'مراكز سبا واستجمام' },
        { key: 'corporate', label: 'مواقع وعروض شركات' }
      ]
    : [
        { key: 'all', label: 'All Projects' },
        { key: 'beauty', label: 'Beauty & Aesthetics' },
        { key: 'spa', label: 'Spas & Wellness' },
        { key: 'corporate', label: 'Corporate & Tech' }
      ];

  // Map arbitrary categories to keys safely to offer seamless premium filtering!
  const matchesCategory = (project: Project, catKey: string): boolean => {
    if (catKey === 'all') return true;
    
    const catAr = (project.categoryAr || '').toLowerCase();
    const catEn = (project.categoryEn || '').toLowerCase();
    const nameAr = (project.nameAr || '').toLowerCase();
    const nameEn = (project.nameEn || '').toLowerCase();
    
    if (catKey === 'beauty') {
      return catAr.includes('جمال') || catAr.includes('تجميل') || catEn.includes('beauty') || catEn.includes('aesthetic') || catAr.includes('صالون') || catEn.includes('salon');
    }
    if (catKey === 'spa') {
      return catAr.includes('سبا') || catAr.includes('استجمام') || catEn.includes('spa') || catEn.includes('wellness');
    }
    if (catKey === 'corporate') {
      return catAr.includes('شركة') || catAr.includes('عروض') || catEn.includes('corporate') || catEn.includes('tech') || catAr.includes('تجاري') || catEn.includes('business') || nameEn.includes('shaher') || nameAr.includes('شاهر');
    }
    return true;
  };

  const filteredProjects = projects.filter(p => matchesCategory(p, activeCategory));

  return (
    <section 
      id="portfolio" 
      className={`py-24 relative z-10 ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-100/40 text-slate-900 border-b border-slate-200'
      }`}
      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
    >
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
            theme === 'dark'
              ? 'from-cyan-400 via-white to-purple-400'
              : 'from-cyan-600 via-slate-800 to-purple-700'
          }`}>
            {lang === 'ar' ? 'معرض الأعمال والمشاريع المميزة' : 'Our Professional Portfolio'}
          </h2>
          <div className="h-1.5 w-24 bg-cyan-400 mx-auto rounded-full mb-6" />
          <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {lang === 'ar'
              ? 'تصفح نخبة من أعمالنا التي صممت بعناية فائقة وتطوير تقني متقدم لتناسب تطلعات رواد الأعمال المتميزين.'
              : 'Witness how state-of-the-art layout designs meet fluid responsive development guidelines to elevate business prestige.'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold select-none transition-all duration-200 cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-600 text-slate-950 font-bold scale-105 shadow-md shadow-cyan-400/10'
                  : theme === 'dark'
                    ? 'bg-slate-900/60 text-slate-400 border border-slate-900 hover:border-slate-800 hover:text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Portfolio Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-10">
          {filteredProjects.map((project) => (
            <div
              id={`project-card-${project.id}`}
              key={project.id}
              onClick={() => setActiveProjectDetail(project)}
              className={`rounded-2xl border overflow-hidden cursor-pointer group transition-all duration-300 relative ${
                theme === 'dark' 
                  ? 'bg-slate-900/30 border-slate-900/80 hover:border-slate-800' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-lg shadow-black/5'
              }`}
            >
              
              {/* Cover Image Container */}
              <div className="h-64 sm:h-72 overflow-hidden relative">
                
                {/* Visual Cover Layer overlay */}
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors duration-300 z-10" />
                
                <img
                  src={project.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600'}
                  alt={lang === 'ar' ? project.nameAr : project.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating category Pill */}
                <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase font-mono bg-slate-950/85 backdrop-blur text-cyan-400 border border-cyan-400/20">
                  {lang === 'ar' ? project.categoryAr : project.categoryEn}
                </div>
              </div>

              {/* Text info layout */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl sm:text-2xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {lang === 'ar' ? project.nameAr : project.nameEn}
                  </h3>
                  
                  <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {lang === 'ar' ? project.descAr : project.descEn}
                </p>

                {/* Tags and technology previews */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techs && project.techs.slice(0, 3).map((t, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-md border ${
                        theme === 'dark' 
                          ? 'bg-slate-950/60 border-slate-900 text-slate-400' 
                          : 'bg-slate-50 border-slate-150 text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                  {project.techs && project.techs.length > 3 && (
                    <span className="text-[10px] font-mono px-2 rounded bg-cyan-400/10 text-cyan-400">
                      +{project.techs.length - 3}
                    </span>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 opacity-50 font-mono text-sm">
            {lang === 'ar' ? 'لا توجد مشاريع مضافة حالياً في هذا القسم.' : 'No projects loaded under this filter.'}
          </div>
        )}

      </div>

      {/* Extreme Detail Immersive Project Modal */}
      {activeProjectDetail && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveProjectDetail(null);
          }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto pt-24 pb-8 cursor-pointer"
        >
          <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 my-4 cursor-default ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Image Banner */}
            <div className="h-64 sm:h-80 relative overflow-hidden">
              <img
                src={activeProjectDetail.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600'}
                alt={lang === 'ar' ? activeProjectDetail.nameAr : activeProjectDetail.nameEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {/* Dismiss button */}
              <button
                type="button"
                onClick={() => setActiveProjectDetail(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md bg-black/60 text-white border border-white/10 cursor-pointer hover:bg-black/80 transition-colors z-20"
                title={lang === 'ar' ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Floating metadata */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 bg-cyan-950/50 border border-cyan-500/20 px-2.5 py-1 rounded">
                    {lang === 'ar' ? activeProjectDetail.categoryAr : activeProjectDetail.categoryEn}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold mt-3 drop-shadow">
                    {lang === 'ar' ? activeProjectDetail.nameAr : activeProjectDetail.nameEn}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Contents */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
              
              <div className="space-y-3">
                <h4 className="text-xs font-mono tracking-wider opacity-60 uppercase flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'حول المشروع وتجربة التطوير' : 'Case Study & Engineering details'}</span>
                </h4>
                <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  {lang === 'ar' 
                    ? (activeProjectDetail.longDescAr || activeProjectDetail.descAr) 
                    : (activeProjectDetail.longDescEn || activeProjectDetail.descEn)}
                </p>
              </div>

              {/* Technologies list */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono tracking-wider opacity-60 uppercase flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'ar' ? 'التقنيات ونظم العمل البرمجية' : 'Integrated Tech Stack'}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProjectDetail.techs && activeProjectDetail.techs.map((tech, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-slate-950 border-slate-800 text-slate-300' 
                          : 'bg-slate-150 border-slate-200 text-slate-800 shadow-sm'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* CTA action redirect links */}
            <div className={`p-6 sm:p-8 border-t ${
              theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            } flex flex-col sm:flex-row items-center justify-between gap-4`}>
              <button
                type="button"
                onClick={() => setActiveProjectDetail(null)}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm border hover:bg-opacity-10 transition-all text-center cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-slate-800 hover:bg-white/10 text-slate-400 hover:text-white' 
                    : 'border-slate-300 hover:bg-black/5 text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'ar' ? 'إغلاق والعودة للرئيسية' : 'Close & Go Back'}
              </button>
              <a
                href={activeProjectDetail.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3 rounded-xl text-slate-950 font-bold text-sm bg-gradient-to-r from-cyan-400 to-indigo-400 hover:shadow-lg hover:shadow-cyan-400/30 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-slate-950" />
                <span>{lang === 'ar' ? 'زيارة واستعراض المشروع لايف' : 'Visit Live Project Website'}</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
