import { useEffect, useRef, useState } from 'react';
import { Sparkles, MessageCircle, ArrowRight, Code } from 'lucide-react';
import { ContentSettings } from '../types';

interface HeroProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
  content: ContentSettings;
  whatsappNumber: string;
}

export default function Hero({ lang, theme, content, whatsappNumber }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [typedTitle, setTypedTitle] = useState('');
  const titleText = lang === 'ar' ? content.heroTitleAr : content.heroTitleEn;

  // Modern Typewriting feedback
  useEffect(() => {
    let index = 0;
    setTypedTitle('');
    const interval = setInterval(() => {
      if (index < titleText.length) {
        setTypedTitle(() => titleText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [lang, content]);

  // Infinite Interactive Node Particle Net Animation on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 15000));
    
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.color = theme === 'dark' 
          ? `rgba(0, 240, 255, ${Math.random() * 0.4 + 0.2})` 
          : `rgba(0, 100, 200, ${Math.random() * 0.3 + 0.1})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Handle mouse movement for interactive repulsion or attraction grid links
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const resizeHandler = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resizeHandler);

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      // Connective web styling
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx!);

        // Link with other nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 120) * 0.15;
            ctx!.strokeStyle = theme === 'dark' 
              ? `rgba(0, 240, 255, ${alpha})` 
              : `rgba(0, 100, 210, ${alpha})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }

        // Link node with Mouse cursor to highlight responsive interactivity
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          ctx!.beginPath();
          ctx!.moveTo(particles[i].x, particles[i].y);
          ctx!.lineTo(mouse.x, mouse.y);
          const alpha = (1 - mdist / 180) * 0.35;
          ctx!.strokeStyle = theme === 'dark' 
            ? `rgba(168, 85, 247, ${alpha})` // purple
            : `rgba(99, 102, 241, ${alpha})`; // indigo
          ctx!.lineWidth = 0.8;
          ctx!.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [theme]);

  const handleWhatsappCTA = () => {
    const textMessage = lang === 'ar' 
      ? 'مرحباً فريق LuxCod، أرغب بمناقشة مشروع رقمي متميز وتطوير أعمالي.' 
      : 'Hello LuxCod team! I would like to schedule a session to scale my business project.';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textMessage)}`, '_blank');
  };

  return (
    <section id="hero" className={`relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden ${
      theme === 'dark' 
        ? 'bg-slate-950 text-white' 
        : 'bg-slate-50 text-slate-900 border-b border-slate-200'
    }`} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      
      {/* Dynamic Network Canvas Graphics */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-auto" />

      {/* Decorative Radial Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
        
        {/* Floating Top Chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wide mb-6 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 animate-floating">
          <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
          <span>{lang === 'ar' ? 'وكالة رقمية بمعايير عالمية' : 'World-Class Premium Digital Agency'}</span>
        </div>

        {/* Dynamic Main Title Heading with Typewriter */}
        <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-5xl leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          <span className={`bg-clip-text text-transparent bg-gradient-to-r drop-shadow-xl select-none ${
            theme === 'dark'
              ? 'from-white via-cyan-300 to-cyan-500'
              : 'from-slate-950 via-cyan-700 to-indigo-950'
          }`}>
            {typedTitle}
          </span>
          <span className="inline-block w-1.5 h-10 ms-1 bg-cyan-400 animate-pulse" />
        </h1>

        {/* Premium Description Paragraph */}
        <p className={`text-base sm:text-lg md:text-xl max-w-3xl mb-10 leading-relaxed ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {lang === 'ar' ? content.heroSubtitleAr : content.heroSubtitleEn}
        </p>

        {/* Visual Call To Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          
          {/* Main Action WhatsApp CRM Link */}
          <button
            onClick={handleWhatsappCTA}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20 active:scale-95 transition-all hover:shadow-cyan-400/40 hover:-translate-y-0.5 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-slate-950 text-slate-950" />
            <span>{lang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project Now'}</span>
          </button>

          {/* Secondary Scroll Button */}
          <a
            href="#portfolio"
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border active:scale-95 transition-all ${
              theme === 'dark'
                ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 text-slate-100'
                : 'border-slate-350 bg-white/50 hover:bg-slate-50 hover:border-slate-400 text-slate-800'
            }`}
          >
            <span>{lang === 'ar' ? 'استعرض أعمالنا' : 'Explore Our Work'}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </a>
        </div>

        {/* Dynamic Small Accents */}
        <div className="mt-16 flex items-center justify-center gap-8 text-xs font-mono opacity-50 select-none">
          <div className="flex items-center gap-1.5">
            <Code className="w-4 h-4 text-cyan-400" />
            <span>CLEAN ENGINEERING</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>SAUDI VISION 2030 SUCCESS</div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>HQ QUALITY</span>
          </div>
        </div>

      </div>

      {/* Modern Wave bottom decor */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-0">
        <div className={`w-full h-full opacity-60 ${theme === 'dark' ? 'bg-gradient-to-t from-slate-950 to-transparent' : 'bg-gradient-to-t from-slate-50 to-transparent'}`} />
      </div>
    </section>
  );
}
