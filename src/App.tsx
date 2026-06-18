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

  // Resolves the active external API config (checking localStorage first, then env variables)
  const getExternalApiConfig = () => {
    let localUrl = '';
    let localKey = '';
    let localEnabled = false;
    let localMethod: 'POST' | 'PUT' = 'PUT';
    
    try {
      const savedSettingsRaw = localStorage.getItem('luxcod_site_settings');
      if (savedSettingsRaw) {
        const parsed = JSON.parse(savedSettingsRaw);
        if (parsed.externalApiUrl) {
          localUrl = parsed.externalApiUrl;
          localKey = parsed.externalApiKey || '';
          localEnabled = parsed.externalApiEnabled ?? false;
          localMethod = parsed.externalApiMethod || 'PUT';
        }
      }
    } catch (e) {
      console.warn('Could not read site settings from localstorage', e);
    }

    const envUrl = (import.meta as any).env?.VITE_EXTERNAL_API_URL || '';
    const envKey = (import.meta as any).env?.VITE_EXTERNAL_API_KEY || '';
    const envEnabled = !!envUrl;
    const envMethod = ((import.meta as any).env?.VITE_EXTERNAL_API_METHOD as 'POST' | 'PUT') || 'PUT';

    if (localUrl) {
      return {
        url: localUrl,
        key: localKey,
        enabled: localEnabled,
        method: localMethod
      };
    }

    return {
      url: envUrl,
      key: envKey,
      enabled: envEnabled,
      method: envMethod
    };
  };

  // Load live CMS settings from server-side database (or direct external API)
  useEffect(() => {
    const loadCmsData = async () => {
      const apiConfig = getExternalApiConfig();
      let localCmsData: any = null;

      // 1. ALWAYS load primary local database as core ground truth first
      try {
        const res = await fetch('/api/load-cms?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
          localCmsData = await res.json();
        }
      } catch (localErr) {
        console.log('Server unreachable. Cache or default templates will be used...', localErr);
      }

      // Apply initial primary database values to the app state
      if (localCmsData) {
        if (localCmsData.projects && localCmsData.projects.length > 0) {
          setProjects(localCmsData.projects);
          dbStore.saveProjects(localCmsData.projects);
        }
        if (localCmsData.services && localCmsData.services.length > 0) {
          setServices(localCmsData.services);
          dbStore.saveServices(localCmsData.services);
        }
        if (localCmsData.reviews && localCmsData.reviews.length > 0) {
          setReviews(localCmsData.reviews);
          dbStore.saveReviews(localCmsData.reviews);
        } else {
          setReviews(DEFAULT_REVIEWS);
          dbStore.saveReviews(DEFAULT_REVIEWS);
        }
        if (localCmsData.content) {
          setContent(localCmsData.content);
          dbStore.saveContentSettings(localCmsData.content);
        }
        if (localCmsData.seo) {
          setSeo(localCmsData.seo);
          dbStore.saveSEOSettings(localCmsData.seo);
        }
        if (localCmsData.siteSettings) {
          setSiteSettings(localCmsData.siteSettings);
          dbStore.saveSiteSettings(localCmsData.siteSettings);
        }
        if (localCmsData.leads) {
          setLeads(localCmsData.leads);
          dbStore.saveLeads(localCmsData.leads);
        }
      }

      // 2. Overlay live external API values if enabled & available
      if (apiConfig.enabled && apiConfig.url) {
        try {
          console.log('Fetching CMS content overlay from dynamic remote API:', apiConfig.url);
          const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          };
          if (apiConfig.key) {
            if (apiConfig.key.toLowerCase().startsWith('bearer ') || apiConfig.key.toLowerCase().startsWith('token ')) {
              headers['Authorization'] = apiConfig.key;
            } else {
              headers['X-Api-Key'] = apiConfig.key;
              headers['Authorization'] = `Bearer ${apiConfig.key}`;
            }
          }
          
          const response = await fetch(apiConfig.url, { 
            method: 'GET',
            headers,
            cache: 'no-store'
          });

          if (response.ok) {
            const rawData = await response.json();
            let externalCms: any = null;

            // Automatically unwrap nested structures like JSONBin's .record key
            if (rawData && rawData.record) {
              externalCms = rawData.record;
            } else if (rawData && rawData.data && (rawData.data.projects || rawData.data.reviews)) {
              externalCms = rawData.data;
            } else {
              externalCms = rawData;
            }

            if (externalCms) {
              // Smart handler: If the external REST API returned a raw Array of projects directly
              if (Array.isArray(externalCms)) {
                if (externalCms.length > 0) {
                  // Ensure these objects represent projects (by checking for name/category keys)
                  const isProjectsList = externalCms.every(item => item && (item.nameAr || item.nameEn));
                  if (isProjectsList) {
                    setProjects(prev => {
                      // Non-destructive merge: keep any local projects that aren't in the external API
                      const merged = [...prev];
                      externalCms.forEach((extItem: any) => {
                        const idx = merged.findIndex(p => p.id === extItem.id);
                        if (idx >= 0) {
                          merged[idx] = { ...merged[idx], ...extItem };
                        } else {
                          merged.push(extItem);
                        }
                      });
                      dbStore.saveProjects(merged);
                      return merged;
                    });
                    console.log('Successfully merged raw projects list from external REST API - no local creations deleted!');
                  }
                }
              } else {
                // Standard full CMS JSON object payload
                if (externalCms.projects && externalCms.projects.length > 0) {
                  setProjects(prev => {
                    const merged = [...prev];
                    externalCms.projects.forEach((extItem: any) => {
                      const idx = merged.findIndex(p => p.id === extItem.id);
                      if (idx >= 0) {
                        merged[idx] = { ...merged[idx], ...extItem };
                      } else {
                        merged.push(extItem);
                      }
                    });
                    dbStore.saveProjects(merged);
                    return merged;
                  });
                }
                if (externalCms.services && externalCms.services.length > 0) {
                  setServices(prev => {
                    const merged = [...prev];
                    externalCms.services.forEach((extItem: any) => {
                      const idx = merged.findIndex(s => s.id === extItem.id);
                      if (idx >= 0) {
                        merged[idx] = { ...merged[idx], ...extItem };
                      } else {
                        merged.push(extItem);
                      }
                    });
                    dbStore.saveServices(merged);
                    return merged;
                  });
                }
                if (externalCms.reviews && externalCms.reviews.length > 0) {
                  setReviews(prev => {
                    const merged = [...prev];
                    externalCms.reviews.forEach((extItem: any) => {
                      const idx = merged.findIndex(r => r.id === extItem.id);
                      if (idx >= 0) {
                        merged[idx] = { ...merged[idx], ...extItem };
                      } else {
                        merged.push(extItem);
                      }
                    });
                    dbStore.saveReviews(merged);
                    return merged;
                  });
                }
                if (externalCms.content) {
                  setContent(prev => {
                    const next = { ...prev, ...externalCms.content };
                    dbStore.saveContentSettings(next);
                    return next;
                  });
                }
                if (externalCms.seo) {
                  setSeo(prev => {
                    const next = { ...prev, ...externalCms.seo };
                    dbStore.saveSEOSettings(next);
                    return next;
                  });
                }
                if (externalCms.siteSettings) {
                  setSiteSettings(prev => {
                    const next = { ...prev, ...externalCms.siteSettings };
                    dbStore.saveSiteSettings(next);
                    return next;
                  });
                }
                if (externalCms.leads) {
                  setLeads(prev => {
                    const merged = [...prev];
                    externalCms.leads.forEach((extItem: any) => {
                      if (!merged.some(m => m.id === extItem.id)) {
                        merged.push(extItem);
                      }
                    });
                    dbStore.saveLeads(merged);
                    return merged;
                  });
                }
              }
            }
          }
        } catch (apiErr) {
          console.error('Failed direct loading from remote API. Keeping standard local database:', apiErr);
        }
      }

      // Avoid immediate saving ticks
      setTimeout(() => {
        setIsLoaded(true);
      }, 300);
    };

    loadCmsData();
  }, []);

  // Helper to persist changes dynamically to server
  const saveToServer = async (key: string, data: any) => {
    if (!isLoaded) return;
    
    // 1. Submit update payload to standard local Express server-side file
    try {
      await fetch('/api/save-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data })
      });
    } catch (err) {
      console.warn(`Local save-cms endpoint bypassed or failed for '${key}' key. This is expected on static hosts like Vercel.`, err);
    }

    // 2. Submit full synchronized CMS backup to external remote API if enabled 
    const apiConfig = getExternalApiConfig();
    if (apiConfig.enabled && apiConfig.url) {
      try {
        const fullBackupPayload = {
          projects: dbStore.getProjects(),
          services: dbStore.getServices(),
          reviews: dbStore.getReviews(),
          content: dbStore.getContentSettings(),
          seo: dbStore.getSEOSettings(),
          siteSettings: dbStore.getSiteSettings(),
          leads: dbStore.getLeads()
        };

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        if (apiConfig.key) {
          if (apiConfig.key.toLowerCase().startsWith('bearer ') || apiConfig.key.toLowerCase().startsWith('token ')) {
            headers['Authorization'] = apiConfig.key;
          } else {
            headers['X-Api-Key'] = apiConfig.key;
            headers['Authorization'] = `Bearer ${apiConfig.key}`;
          }
        }

        // Send full JSON backup mapping the file structures
        const response = await fetch(apiConfig.url, {
          method: apiConfig.method,
          headers,
          body: JSON.stringify(fullBackupPayload)
        });

        if (response.ok) {
          console.log(`Successfully synced full CMS database backup dynamically to: ${apiConfig.url} (${apiConfig.method})`);
        } else {
          console.warn(`External remote API save status code: ${response.status}. Trying partial key/value format fallback...`);
          // Try single key delta body in case endpoint uses custom key/value router mapping
          const altResponse = await fetch(apiConfig.url, {
            method: apiConfig.method,
            headers,
            body: JSON.stringify({ key, data })
          });
          if (altResponse.ok) {
            console.log('Successfully written via Key-Value fallback payload format!');
          }
        }
      } catch (externalErr) {
        console.error('Failed writing states layout to dynamic remote API URL:', externalErr);
      }
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
  // Optimized: Instant local storage cache writes paired with a 1-second debounced server save
  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveProjects(projects);
    const handler = setTimeout(() => {
      saveToServer('projects', projects);
    }, 1000);
    return () => clearTimeout(handler);
  }, [projects, isLoaded, isAdmin]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveServices(services);
    const handler = setTimeout(() => {
      saveToServer('services', services);
    }, 1000);
    return () => clearTimeout(handler);
  }, [services, isLoaded, isAdmin]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveContentSettings(content);
    const handler = setTimeout(() => {
      saveToServer('content', content);
    }, 1000);
    return () => clearTimeout(handler);
  }, [content, isLoaded, isAdmin]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveSEOSettings(seo);
    const handler = setTimeout(() => {
      saveToServer('seo', seo);
    }, 1000);
    return () => clearTimeout(handler);
  }, [seo, lang, isLoaded, isAdmin]); // Updates title matching exact active language settings

  // Global SEO effect: Dynamically sync meta headers & favicons for all visitors on language/SEO changes
  useEffect(() => {
    if (!isLoaded) return;
    const activeLang = lang || 'ar';
    document.title = activeLang === 'ar' ? seo.metaTitleAr : seo.metaTitleEn;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', activeLang === 'ar' ? seo.metaDescAr : seo.metaDescEn);

    // Sync icons
    let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.setAttribute('rel', 'icon');
      faviconLink.setAttribute('type', 'image/svg+xml');
      document.head.appendChild(faviconLink);
    }
    faviconLink.setAttribute('href', '/favicon.svg');

    let appleIconLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if (!appleIconLink) {
      appleIconLink = document.createElement('link');
      appleIconLink.setAttribute('rel', 'apple-touch-icon');
      document.head.appendChild(appleIconLink);
    }
    appleIconLink.setAttribute('href', '/apple-touch-icon.png');
  }, [seo, lang, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveSiteSettings(siteSettings);
    const handler = setTimeout(() => {
      saveToServer('siteSettings', siteSettings);
    }, 1000);
    return () => clearTimeout(handler);
  }, [siteSettings, isLoaded, isAdmin]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveReviews(reviews);
    const handler = setTimeout(() => {
      saveToServer('reviews', reviews);
    }, 1000);
    return () => clearTimeout(handler);
  }, [reviews, isLoaded, isAdmin]);

  useEffect(() => {
    if (!isLoaded || !isAdmin) return;
    dbStore.saveLeads(leads);
    const handler = setTimeout(() => {
      saveToServer('leads', leads);
    }, 1000);
    return () => clearTimeout(handler);
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
    // 1. Gold-standard Arabic text normalization
    const normalizeArabic = (text: string): string => {
      return text
        .replace(/[\u0640]/g, '') // Remove Tatweel/Kashida (ـ)
        .replace(/[\u064B-\u065F]/g, '') // Remove Arabic diacritics (harakat like fatha, damma, kasra, shadda)
        .replace(/[أإآ]/g, 'ا') // Standardize Alef variations to bare Alef
        .replace(/ة/g, 'ه') // Standardize Teh Marbuta to Heh
        .replace(/ى/g, 'ي') // Standardize Alef Maksura to Yeh
        .replace(/(.)\1{2,}/g, '$1'); // Collapse repeated letters (e.g. "طيزززز" -> "طيز", "خرااا" -> "خرا")
    };

    const originalText = `${nameText} ${commentText}`.toLowerCase();
    const normalizedText = normalizeArabic(originalText);
    
    // Set 1: Exclusive profanity stems - safe to match anywhere as substrings (never part of any standard innocent Arabic words)
    const explicitSubstrings = [
      'طيز', 'طياز', 'اطياز', 'تطيز',
      'نيك', 'منيك', 'منيوك', 'تناك', 'تنكح', 'يتناك', 'انيك', 'تناكه', 'امنيب',
      'شرموط', 'شرمط', 'شرمو',
      'قحب', 'قحاب',
      'ديوث', 'دياث',
      'عرص', 'معرص',
      'بظر',
      'خصي', 'خصيه', 'خصية', 'خصاو',
      'سكس'
    ];

    if (explicitSubstrings.some(word => normalizedText.includes(word))) {
      return true;
    }

    // Set 2: Common terms and insults - matched with smart boundaries to prevent false positives (e.g. "زب" vs "زبون")
    const boundaryWords = [
      'زب', 'زبي', 'ازب',
      'كس', 'كسك', 'كسخ', 'كسخت',
      'خرا', 'خراء',
      'زق', 'بول',
      'وسخ', 'اوساخ', 'قذر', 'قذارة', 'حقير', 'حقارة', 'سافل', 'سفالة',
      'حمار', 'حمير', 'كلب', 'كلاب', 'حيوان', 'حيوانات', 'جحش',
      'نصاب', 'احتيال', 'محتال', 'حرامي', 'حرامية', 'سرق', 'سرقة', 'سارق', 'سرقونا',
      'كذاب', 'كذب', 'دجال', 'فاشل', 'فاشلين', 'ملعون', 'لعن', 'لعنة', 'يلعن', 'تفو'
    ];

    const hasBoundaryViolation = boundaryWords.some(word => {
      // Setup dynamic regex checking for space boundaries as well as common Arabic prefixes (الـ، ياـ، بـ، لـ، وـ)
      // and common Arabic suffixes (ـنا، ـكم، ـهم، ـه، ـي، ـك، ـين، ـون، ـات، ـه)
      const patternStr = `(?:\\b|\\s|^)(?:ال|يا|ب|ل|و|ف|ك)?${word}(?:نا|كم|هم|ه|ي|ك|ين|ون|ات|ة)?(?:\\b|\\s|$)`;
      const regex = new RegExp(patternStr, 'i');
      return regex.test(normalizedText) || regex.test(originalText);
    });

    if (hasBoundaryViolation) {
      return true;
    }

    // Set 3: Violent threat indicators / incitements
    const violencePatterns = [
      'قتل', 'موت', 'ذبح', 'إرهاب', 'ارهاب', 'تفجير', 'سلاح', 'مسدس', 'قنبلة', 'تعذيب', 
      'طائفية', 'طائفي', 'عنصرية', 'عنصري', 'كراهية', 'اكره', 'أكره', 'دموي', 'تهديد'
    ];

    if (violencePatterns.some(word => normalizedText.includes(word))) {
      return true;
    }

    // Set 4: English profanities and violent threats
    const englishWords = [
      'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'idiot', 'dumb', 'stupid', 'retard',
      'kill', 'murder', 'slay', 'death', 'die', 'threat', 'weapon', 'gun', 'bomb', 'terror', 'violence', 'blood',
      'scam', 'fraud', 'cheat', 'scammer', 'fake', 'liar', 'racist', 'hate', 'abusive'
    ];

    const hasEnglishViolation = englishWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(originalText);
    });

    return hasEnglishViolation;
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
                  onClick={() => handleHomeAnchorNavigation('#consultation-form-section')}
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
