import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingButtonsProps {
  lang: 'ar' | 'en';
  phone: string;
  whatsapp: string;
}

export default function FloatingButtons({ lang, phone, whatsapp }: FloatingButtonsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle visibility based on scrolling down (> 200px)
      if (typeof window !== 'undefined') {
        if (window.scrollY > 200) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initially
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  const textMessage = lang === 'ar' 
    ? 'مرحباً فريق LuxCod، أرغب بطلب استشارة سريعة بخصوص تطوير أعمالي.' 
    : 'Hello LuxCod team! I would like to schedule a session to consult on my business project.';

  // Build direct secure WhatsApp deep link
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[\s+]/g, '')}?text=${encodeURIComponent(textMessage)}`;

  return (
    <div className="fixed bottom-8 left-8 z-55 flex flex-col gap-3 select-none animate-fade-in transition-all duration-300">
      
      {/* 3D Highly Transparent Glass Glowing WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full backdrop-blur-md bg-emerald-500/15 text-white flex items-center justify-center border border-emerald-400/40 shadow-[0_0_20px_rgba(37,211,102,0.35),inset_0_2px_4px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(37,211,102,0.65),inset_0_3px_6px_rgba(255,255,255,0.25)] hover:bg-emerald-500/25 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer relative"
        title="WhatsApp Direct Contact"
      >
        {/* Soft glowing concentric ring 1 */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md animate-pulse pointer-events-none" />
        
        {/* Glowing concentric ping ring 2 */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 blur-sm opacity-60 animate-ping [animation-duration:2.5s] pointer-events-none" />
        
        {/* Soft elegant glossy reflection overlay */}
        <span className="absolute top-0.5 left-1.5 right-1.5 h-3 mt-0.5 rounded-t-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none filter blur-[0.2px]" />
        
        <MessageCircle className="w-7 h-7 fill-emerald-500/20 text-[#25d366] drop-shadow-[0_0_10px_rgba(37,211,102,0.85)] relative" />
      </a>

    </div>
  );
}


