import React, { useState, useEffect } from 'react';
import { Languages, Sun, Moon, Menu, X, Lock, Unlock, LogOut, Settings } from 'lucide-react';
import { SiteSettings } from '../types';

interface NavigationProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  activeView: 'home' | 'admin';
  setActiveView: (view: 'home' | 'admin') => void;
  siteSettings: SiteSettings;
}

export default function Navigation({
  lang,
  setLang,
  theme,
  setTheme,
  isAdmin,
  setIsAdmin,
  activeView,
  setActiveView,
  siteSettings
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Check URL parameters or Hash to open the Login Gateway (e.g., ?cms or ?manage)
  // This keeps the Panel completely separate and unlinked from the public frontend
  useEffect(() => {
    if (isAdmin) return; // Prevent requesting password again if session is already active
    const params = new URLSearchParams(window.location.search);
    if (
      params.has('cms') || 
      params.has('manage') || 
      params.has('admin') || 
      window.location.hash === '#/admin' || 
      window.location.hash === '#/cms' ||
      window.location.hash === '#admin' ||
      window.location.hash === '#cms'
    ) {
      setShowLoginModal(true);
    }
  }, [isAdmin]);

  const handleLanguageToggle = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    localStorage.setItem('luxcod_lang', nextLang);
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('luxcod_theme', nextTheme);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'luxcode2026' || password === 'shaher2026') {
      setIsAdmin(true);
      setActiveView('admin');
      setShowLoginModal(false);
      setPassword('');
      setLoginError('');
    } else {
      setLoginError(lang === 'ar' ? 'كلمة المرور غير صحيحة!' : 'Incorrect password!');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveView('home');
  };

  const navItems = {
    ar: [
      { label: 'الرئيسية', href: '#hero' },
      { label: 'خدماتنا', href: '#services' },
      { label: 'لماذا LuxCod؟', href: '#why-us' },
      { label: 'أعمالنا السابقة', href: '#portfolio' },
      { label: 'آراء العملاء', href: '#testimonials' },
      { label: 'اتصل بنا', href: '#contact' },
    ],
    en: [
      { label: 'Home', href: '#hero' },
      { label: 'Services', href: '#services' },
      { label: 'Why LuxCod', href: '#why-us' },
      { label: 'Our Work', href: '#portfolio' },
      { label: 'Reviews', href: '#testimonials' },
      { label: 'Contact', href: '#contact' },
    ]
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50" id="top-navigation-container">
      {/* Dynamic Top Announcement Banner for Free Consultation */}
      {showBanner && (
        <div className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white py-2 px-4 text-[11px] sm:text-xs font-semibold relative flex items-center justify-between shadow-lg select-none" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                {lang === 'ar' 
                  ? '🎁 لفترة محدودة: احصل على استشارة تقنية مجانية وخطة عمل متكاملة لمشروعك البرمجي أو أتمتتك!' 
                  : '🎁 Limited Slot: Get a free software consultation & complete business blueprint today!'}
              </span>
            </span>
            <a 
              href="#consultation-form-section" 
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-2.5 py-1 rounded-lg text-[10px] sm:text-xs transition-all shadow hover:scale-105 active:scale-95 duration-150 shrink-0 inline-flex items-center gap-1"
            >
              <span>{lang === 'ar' ? 'احجز استشارتك مجاناً 📞' : 'Book Free Consultation 📞'}</span>
            </a>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            className="text-white hover:text-cyan-200 p-0.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 rtl:left-2 rtl:right-auto"
            title="إغلاق / Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className={`transition-all duration-300 border-b ${
        theme === 'dark' 
          ? 'bg-slate-950/85 border-slate-900 text-slate-100' 
          : 'bg-white/90 border-slate-200 text-slate-800'
      } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('home')}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div dir="ltr" className="relative px-3 py-1 bg-slate-950 rounded-lg text-cyan-400 font-mono font-bold tracking-widest text-xl flex flex-row items-center gap-1.5">
                <span>⚡</span>
                <span className="text-white">LUX</span>
                <span>COD</span>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs uppercase font-mono tracking-widest opacity-60 ml-2 font-sans text-cyan-400">
              {lang === 'ar' ? 'حلول برمجية متميزة' : 'Premium Tech Agency'}
            </span>
          </div>

          {/* Desktop Nav Items */}
          {activeView === 'home' && (
            <div className="hidden md:flex items-center gap-6">
              {navItems[lang].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-cyan-400`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          {/* Utilities & Buttons */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Free Consultation Highlight Button */}
            <a
              href="#consultation-form-section"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-cyan-500/15 hover:shadow-cyan-500/35 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-2 transform duration-150 cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{lang === 'ar' ? 'استشارة مجانية 📞' : 'Free Consultation 📞'}</span>
            </a>

            {/* Lang Switch */}
            <button
              onClick={handleLanguageToggle}
              className={`p-2 rounded-lg transition-all border ${
                theme === 'dark' 
                  ? 'hover:bg-slate-900 border-slate-800 text-slate-300' 
                  : 'hover:bg-slate-100 border-slate-300 text-slate-700'
              } flex items-center gap-1.5 text-xs font-mono`}
              title="Switch Language"
            >
              <Languages className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
            </button>

            {/* Dark & Light Theme */}
            <button
              onClick={handleThemeToggle}
              className={`p-2 rounded-lg transition-all border ${
                theme === 'dark' 
                  ? 'hover:bg-slate-900 border-slate-800 text-yellow-400' 
                  : 'hover:bg-slate-100 border-slate-300 text-purple-600'
              }`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin triggers show only when logged in inside session */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView(activeView === 'admin' ? 'home' : 'admin')}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/10 hover:shadow-purple-500/30"
                >
                  <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{activeView === 'admin' ? (lang === 'ar' ? 'الموقع' : 'Site View') : (lang === 'ar' ? 'التحكم' : 'Dashboard')}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className={`p-1.5 rounded-lg border ${
                    theme === 'dark' ? 'border-red-950/50 text-red-400 hover:bg-red-950/20' : 'border-red-200 text-red-600 hover:bg-red-50'
                  }`}
                  title={lang === 'ar' ? 'تسجيل الخروج' : 'Logout Admin'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleLanguageToggle}
              className={`p-1.5 rounded-lg border text-xs ${
                theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-300 text-slate-700'
              }`}
            >
              {lang === 'ar' ? 'EN' : 'العربية'}
            </button>
            <button
              onClick={handleThemeToggle}
              className={`p-1.5 rounded-lg border ${
                theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-300 text-slate-700'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-800/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className={`md:hidden border-t py-4 px-4 space-y-4 ${
          theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
        }`}>
          {activeView === 'home' && (
            <div className="pb-2 border-b border-slate-800/10 dark:border-slate-800/45">
              <a
                href="#consultation-form-section"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-center text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{lang === 'ar' ? 'احجز استشارة مجانية الآن 📞' : 'Book Free Consultation 📞'}</span>
              </a>
            </div>
          )}
          {activeView === 'home' && navItems[lang].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-base font-medium opacity-80 hover:opacity-100 hover:text-cyan-400"
            >
              {item.label}
            </a>
          ))}
          {isAdmin && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 w-full justify-between">
                <button
                  onClick={() => {
                    setActiveView(activeView === 'admin' ? 'home' : 'admin');
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white text-xs flex items-center gap-1 w-2/3 justify-center"
                >
                  <Settings className="w-4 h-4" />
                  <span>{activeView === 'admin' ? (lang === 'ar' ? 'عرض الموقع' : 'Show Website') : (lang === 'ar' ? 'لوحة التحكم' : 'CMS Dashboard')}</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="p-2 bg-red-950/20 text-red-400 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Quick Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-xl p-6 border shadow-2xl ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-1.5">
                <Lock className="w-5 h-5 text-cyan-400" />
                <span>{lang === 'ar' ? 'تسجيل دخول الإدارة' : 'Admin Terminal'}</span>
              </h3>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider mb-1.5 opacity-75">
                  {lang === 'ar' ? 'رمز الدخول الفاخر' : 'Access Key'}
                </label>
                <input
                  type="password"
                  placeholder={lang === 'ar' ? 'اكتب كلمة السر هنا...' : 'Enter your key...'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border focus:ring-1 focus:outline-none transition-all ${
                    theme === 'dark' 
                      ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500 focus:border-cyan-500' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-cyan-500 focus:border-cyan-500'
                  }`}
                  autoFocus
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-2 rounded">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium text-sm transition-all hover:opacity-95"
              >
                {lang === 'ar' ? 'دخول آمن' : 'Secure Entry'}
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
    </div>
  );
}
