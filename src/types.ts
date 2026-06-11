export interface Project {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  descAr: string;
  descEn: string;
  longDescAr?: string;
  longDescEn?: string;
  coverImage: string;
  liveUrl: string;
  techs: string[];
}

export interface Service {
  id: string;
  key: string; // e.g. web, bot, landing, uiux, integrations, nfc
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  longDescAr: string;
  longDescEn: string;
  benefitsAr: string[];
  benefitsEn: string[];
  featuresAr: string[];
  featuresEn: string[];
  deliveryTimeAr: string;
  deliveryTimeEn: string;
  icon: string; // lucide icon name
}

export interface Review {
  id: string;
  name: string;
  comment: string;
  rating: number; // 1-5
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface ContentSettings {
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  statProjects: number;
  statCustomers: number;
  statExperience: number;
  statServices: number;
}

export interface SEOSettings {
  metaTitleAr: string;
  metaTitleEn: string;
  metaDescAr: string;
  metaDescEn: string;
  ogType: string;
  sitemapAuto: boolean;
}

export interface ThemeSettings {
  primaryColor: string; // e.g. '#00F0FF'
  glassOpacity: number; // e.g. 0.2
  accentGlow: boolean;
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  theme: ThemeSettings;
  telegramBotToken?: string;
  telegramChatId?: string;
  telegramEnabled?: boolean;
}

export interface ConsultationLead {
  id: string;
  name: string;
  phone: string;
  service: string;
  msg: string;
  date: string;
  status: 'new' | 'contacted' | 'completed';
}

