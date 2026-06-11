import { useState, useEffect } from 'react';
import { Project } from '../types';
import { ExternalLink, X, Globe, Cpu, Layers } from 'lucide-react';
import { dbStore } from '../dbStore';

interface PortfolioProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
  projects: Project[];
}

export default function Portfolio({ lang, theme, projects }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeProjectDetail, setActiveProjectDetail] = useState<Project | null>(null);
  const [loadedProjects, setLoadedProjects] = useState<Project[]>(projects);

  // جلب البيانات من الـ API عند تحميل الصفحة
  useEffect(() => {
    const fetchProjects = async () => {
      const data = await dbStore.getProjects();
      if (data && data.length > 0) {
        setLoadedProjects(data);
      }
    };
    fetchProjects();
  }, []);

  // Prevent background website scrolling
  useEffect(() => {
    if (activeProjectDetail) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [activeProjectDetail]);

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

  const matchesCategory = (project: Project, catKey: string): boolean => {
    if (catKey === 'all') return true;
    const catAr = (project.categoryAr || '').toLowerCase();
    const catEn = (project.categoryEn || '').toLowerCase();
    const nameAr = (project.nameAr || '').toLowerCase();
    const nameEn = (project.nameEn || '').toLowerCase();
    
    if (catKey === 'beauty') return catAr.includes('جمال') || catAr.includes('تجميل') || catEn.includes('beauty') || catEn.includes('aesthetic') || catAr.includes('صالون') || catEn.includes('salon');
    if (catKey === 'spa') return catAr.includes('سبا') || catAr.includes('استجمام') || catEn.includes('spa') || catEn.includes('wellness');
    if (catKey === 'corporate') return catAr.includes('شركة') || catAr.includes('عروض') || catEn.includes('corporate') || catEn.includes('tech') || catAr.includes('تجاري') || catEn.includes('business') || nameEn.includes('shaher') || nameAr.includes('شاهر');
    return true;
  };

  const filteredProjects = loadedProjects.filter(p => matchesCategory(p, activeCategory));

  return (
    <section id="portfolio" className={`py-24 relative z-10 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-100/40 text-slate-900 border-b border-slate-200'}`} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">{lang === 'ar' ? 'معرض الأعمال والمشاريع المميزة' : 'Our Professional Portfolio'}</h2>
          <div className="h-1.5 w-24 bg-cyan-400 mx-auto rounded-full mb-6" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`px-5 py-2.5 rounded-full text-xs font-semibold ${activeCategory === cat.key ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900/60 text-slate-400'}`}>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} onClick={() => setActiveProjectDetail(project)} className="rounded-2xl border cursor-pointer p-6 bg-slate-900/30 border-slate-900/80">
              <img src={project.coverImage} alt={project.nameAr} className="w-full h-64 object-cover rounded-lg" />
              <h3 className="text-xl font-bold mt-4">{lang === 'ar' ? project.nameAr : project.nameEn}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
