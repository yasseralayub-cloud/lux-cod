import { Project, Service, Review, ContentSettings, SEOSettings, SiteSettings, ConsultationLead } from './types';
import {
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  DEFAULT_REVIEWS,
  DEFAULT_CONTENT_SETTINGS,
  DEFAULT_SEO_SETTINGS,
  DEFAULT_SITE_SETTINGS
} from './data';

export const dbStore = {
  getLeads(): ConsultationLead[] {
    const data = localStorage.getItem('luxcod_leads');
    if (!data) {
      localStorage.setItem('luxcod_leads', JSON.stringify([]));
      return [];
    }
    return JSON.parse(data);
  },

  saveLeads(leads: ConsultationLead[]) {
    localStorage.setItem('luxcod_leads', JSON.stringify(leads));
  },

  getProjects(): Project[] {
    const data = localStorage.getItem('luxcod_projects');
    if (!data) {
      localStorage.setItem('luxcod_projects', JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    return JSON.parse(data);
  },

  saveProjects(projects: Project[]) {
    localStorage.setItem('luxcod_projects', JSON.stringify(projects));
  },

  getServices(): Service[] {
    const data = localStorage.getItem('luxcod_services');
    if (!data) {
      localStorage.setItem('luxcod_services', JSON.stringify(DEFAULT_SERVICES));
      return DEFAULT_SERVICES;
    }
    return JSON.parse(data);
  },

  saveServices(services: Service[]) {
    localStorage.setItem('luxcod_services', JSON.stringify(services));
  },

  getReviews(): Review[] {
    const data = localStorage.getItem('luxcod_reviews');
    if (!data) {
      localStorage.setItem('luxcod_reviews', JSON.stringify(DEFAULT_REVIEWS));
      return DEFAULT_REVIEWS;
    }
    return JSON.parse(data);
  },

  saveReviews(reviews: Review[]) {
    localStorage.setItem('luxcod_reviews', JSON.stringify(reviews));
  },

  getContentSettings(): ContentSettings {
    const data = localStorage.getItem('luxcod_content');
    if (!data) {
      localStorage.setItem('luxcod_content', JSON.stringify(DEFAULT_CONTENT_SETTINGS));
      return DEFAULT_CONTENT_SETTINGS;
    }
    return JSON.parse(data);
  },

  saveContentSettings(content: ContentSettings) {
    localStorage.setItem('luxcod_content', JSON.stringify(content));
  },

  getSEOSettings(): SEOSettings {
    const data = localStorage.getItem('luxcod_seo');
    if (!data) {
      localStorage.setItem('luxcod_seo', JSON.stringify(DEFAULT_SEO_SETTINGS));
      return DEFAULT_SEO_SETTINGS;
    }
    return JSON.parse(data);
  },

  saveSEOSettings(seo: SEOSettings) {
    localStorage.setItem('luxcod_seo', JSON.stringify(seo));
    // Dynamically update document tags
    const activeLang = localStorage.getItem('luxcod_lang') || 'ar';
    document.title = activeLang === 'ar' ? seo.metaTitleAr : seo.metaTitleEn;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', activeLang === 'ar' ? seo.metaDescAr : seo.metaDescEn);

    // Dynamic favicon updates
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
  },

  getSiteSettings(): SiteSettings {
    const data = localStorage.getItem('luxcod_site_settings');
    if (!data) {
      localStorage.setItem('luxcod_site_settings', JSON.stringify(DEFAULT_SITE_SETTINGS));
      return DEFAULT_SITE_SETTINGS;
    }
    return JSON.parse(data);
  },

  saveSiteSettings(settings: SiteSettings) {
    localStorage.setItem('luxcod_site_settings', JSON.stringify(settings));
  },

  resetAll() {
    localStorage.clear();
    return {
      projects: DEFAULT_PROJECTS,
      services: DEFAULT_SERVICES,
      reviews: DEFAULT_REVIEWS,
      content: DEFAULT_CONTENT_SETTINGS,
      seo: DEFAULT_SEO_SETTINGS,
      siteSettings: DEFAULT_SITE_SETTINGS,
      leads: []
    };
  }
};
