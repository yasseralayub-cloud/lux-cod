import { useEffect, useState, useRef } from 'react';
import { ContentSettings } from '../types';
import { Award, Layers, Sparkles, Smile } from 'lucide-react';

interface StatsProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
  content: ContentSettings;
}

export default function Stats({ lang, theme, content }: StatsProps) {
  const [projectsCount, setProjectsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Animate project count
          let pStart = 0;
          const pEnd = content.statProjects;
          const pDuration = 1500;
          const pStep = pEnd / (pDuration / 30);
          const pTimer = setInterval(() => {
            pStart += pStep;
            if (pStart >= pEnd) {
              setProjectsCount(pEnd);
              clearInterval(pTimer);
            } else {
              setProjectsCount(Math.floor(pStart));
            }
          }, 30);

          // Animate customers count
          let cStart = 0;
          const cEnd = content.statCustomers;
          const cDuration = 1500;
          const cStep = cEnd / (cDuration / 30);
          const cTimer = setInterval(() => {
            cStart += cStep;
            if (cStart >= cEnd) {
              setCustomersCount(cEnd);
              clearInterval(cTimer);
            } else {
              setCustomersCount(Math.floor(cStart));
            }
          }, 30);

          // Animate experience count
          let eStart = 0;
          const eEnd = content.statExperience;
          const eDuration = 1000;
          const eStep = eEnd / (eDuration / 30);
          const eTimer = setInterval(() => {
            eStart += eStep;
            if (eStart >= eEnd) {
              setExperienceCount(eEnd);
              clearInterval(eTimer);
            } else {
              setExperienceCount(Math.floor(eStart));
            }
          }, 30);

          // Animate services count
          let sStart = 0;
          const sEnd = content.statServices;
          const sDuration = 1000;
          const sStep = sEnd / (sDuration / 30);
          const sTimer = setInterval(() => {
            sStart += sStep;
            if (sStart >= sEnd) {
              setServicesCount(sEnd);
              clearInterval(sTimer);
            } else {
              setServicesCount(Math.floor(sStart));
            }
          }, 30);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated, content]);

  const cards = [
    {
      id: 'stat-projects',
      num: projectsCount,
      suffix: '+',
      labelAr: 'مشروع متميز منفذ',
      labelEn: 'Premium Deployed Projects',
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      glowColor: 'rgba(6, 182, 212, 0.15)'
    },
    {
      id: 'stat-customers',
      num: customersCount,
      suffix: '+',
      labelAr: 'عميل سعيد ومستمر',
      labelEn: 'Happy Retained Clients',
      icon: <Smile className="w-6 h-6 text-purple-400" />,
      glowColor: 'rgba(168, 85, 247, 0.15)'
    },
    {
      id: 'stat-experience',
      num: experienceCount,
      suffix: '+',
      labelAr: 'سنوات خبرة عملية مثمرة',
      labelEn: 'Years Enterprise Experience',
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      glowColor: 'rgba(16, 185, 129, 0.15)'
    },
    {
      id: 'stat-services',
      num: servicesCount,
      suffix: '+',
      labelAr: 'خدمات برمجية متطورة للغاية',
      labelEn: 'Elite Software Verticals',
      icon: <Sparkles className="w-6 h-6 text-pink-400" />,
      glowColor: 'rgba(236, 72, 153, 0.15)'
    }
  ];

  return (
    <div 
      id="why-us"
      ref={sectionRef} 
      className={`py-12 relative z-10 ${
        theme === 'dark' ? 'bg-slate-950/70' : 'bg-slate-100/50'
      }`}
      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {cards.map((card) => (
            <div
              id={card.id}
              key={card.id}
              className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 relative group flex flex-col items-center text-center ${
                theme === 'dark'
                  ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Absolutes Ambient Glow on Hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: card.glowColor, filter: 'blur(20px)' }}
              />

              {/* Icon Frame */}
              <div className={`p-3 rounded-full mb-4 relative ${
                theme === 'dark' ? 'bg-slate-950/85 border border-slate-800' : 'bg-slate-100 border border-slate-200'
              }`}>
                {card.icon}
              </div>

              {/* Huge animated counter */}
              <div className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-mono tracking-tight mb-2 select-none ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                <span className={`bg-clip-text text-transparent bg-gradient-to-br ${
                  theme === 'dark' 
                    ? 'from-white via-slate-100 to-slate-400' 
                    : 'from-slate-950 via-slate-800 to-indigo-950'
                }`}>
                  {card.num}
                </span>
                <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}>{card.suffix}</span>
              </div>

              {/* Counter Label */}
              <p className={`text-xs sm:text-sm font-medium tracking-wide mt-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {lang === 'ar' ? card.labelAr : card.labelEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
