import React from 'react';
import { SiteSettings } from '../types';
import { Mail, Phone, MapPin, Twitter, Instagram } from 'lucide-react';

interface FooterProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
  siteSettings: SiteSettings;
  onOpenLegal: (policy: 'privacy' | 'terms' | 'cookies' | 'protection') => void;
  onNavigateHomeTab: (href: string) => void;
}

export default function Footer({ lang, theme, siteSettings, onOpenLegal, onNavigateHomeTab }: FooterProps) {
  const year = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigateHomeTab(href);
  };

  return (
    <footer className={`border-t relative z-10 ${
      theme === 'dark' 
        ? 'bg-slate-950 border-slate-900 text-slate-400' 
        : 'bg-white border-slate-200 text-slate-600'
    }`} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigateHomeTab('#hero')}>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <div dir="ltr" className="relative px-3 py-1 bg-slate-950 rounded-lg text-cyan-400 font-mono font-bold tracking-widest text-xl flex flex-row items-center gap-1.5">
                  <span>⚡</span>
                  <span className="text-white">LUX</span>
                  <span>COD</span>
                </div>
              </div>
            </div>
            
            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'ar' 
                ? 'وكالة LuxCod الرقمية الرائدة في هندسة الحلول البرمجية الفاخرة، تصميم تجارب الاستخدام UI/UX وتطوير مواقع الويب وبوتات واتساب الذكية لتمكين نمو أعمالكم.'
                : 'LuxCod Digital Agency is a premium developer of high-end business applications, fluid UI/UX designs, conversational AI bot scenarios, and custom portals.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href={siteSettings.twitter} target="_blank" rel="noopener noreferrer" className="p-2 border border-slate-800 rounded-xl hover:text-cyan-400 hover:border-cyan-400/50 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" className="p-2 border border-slate-800 rounded-xl hover:text-cyan-400 hover:border-cyan-400/50 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href="#hero" onClick={(e) => handleLinkClick(e, '#hero')} className="hover:text-cyan-400 transition-colors">
                  {lang === 'ar' ? 'الرئيسية' : 'Home Core'}
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleLinkClick(e, '#services')} className="hover:text-cyan-400 transition-colors">
                  {lang === 'ar' ? 'استعراض خدماتنا' : 'Our Services'}
                </a>
              </li>
              <li>
                <a href="#portfolio" onClick={(e) => handleLinkClick(e, '#portfolio')} className="hover:text-cyan-400 transition-colors">
                  {lang === 'ar' ? 'أعمالنا السابقة' : 'Our Work'}
                </a>
              </li>
              <li>
                <a href="#testimonials" onClick={(e) => handleLinkClick(e, '#testimonials')} className="hover:text-cyan-400 transition-colors">
                  {lang === 'ar' ? 'آراء العملاء' : 'Client Testimonials'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Guides */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {lang === 'ar' ? 'الضمانات والسياسات' : 'Warranties & Terms'}
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-cyan-400 transition-colors text-right cursor-pointer">
                  {lang === 'ar' ? 'سياسة الخصوصية وسرية البيانات' : 'Data Privacy Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-cyan-400 transition-colors text-right cursor-pointer">
                  {lang === 'ar' ? 'شروط الخدمة والاتفاق البرمجي' : 'Terms of Software Service'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('cookies')} className="hover:text-cyan-400 transition-colors text-right cursor-pointer">
                  {lang === 'ar' ? 'سياسة ملفات الكوكيز والتحسين' : 'Cookie & Site Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('protection')} className="hover:text-cyan-400 transition-colors text-right cursor-pointer">
                  {lang === 'ar' ? 'سياسة حماية مستخدمي خدماتنا' : 'User Protection Guidelines'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div className="space-y-4">
            <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 font-mono ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {lang === 'ar' ? 'قنوات الاتصال المباشر' : 'Direct Communications'}
            </h4>
            
            <div className="flex items-start gap-2.5 text-sm">
              <Phone className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
              <span className="font-mono">{siteSettings.phone}</span>
            </div>

            <div className="flex items-start gap-2.5 text-sm break-all">
              <Mail className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
              <span>{siteSettings.email}</span>
            </div>

            <div className="flex items-start gap-2.5 text-sm leading-relaxed">
              <MapPin className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
              <span>{lang === 'ar' ? 'الرياض وبكافة أنحاء المملكة، السعودية' : 'Riyadh HQ, Kingdom of Saudi Arabia'}</span>
            </div>
          </div>

        </div>

        {/* Divider and copyright details */}
        <div className="border-t border-slate-900 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs opacity-50 text-center gap-4">
          <p>© {lang === 'ar' ? 'جميع الحقوق محفوظة لوكالة LuxCod الرقمية' : 'All Rights Reserved to LuxCod Digital Agency'} – {year}</p>
          <p>{lang === 'ar' ? 'تجارب رقمية متميزة تنمو بها استثماراتك' : 'Premium tech-driven scaling software'}</p>
        </div>

      </div>
    </footer>
  );
}
