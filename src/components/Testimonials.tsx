import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Review } from '../types';
import { Star, MessageSquareCode, Plus, Sparkles, RefreshCw } from 'lucide-react';

interface TestimonialsProps {
  lang: 'ar' | 'en';
  theme: 'dark' | 'light';
  reviews: Review[];
  onSubmitReview: (name: string, comment: string, rating: number) => void;
}

export default function Testimonials({ lang, theme, reviews, onSubmitReview }: TestimonialsProps) {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedRating, setSubmittedRating] = useState(5);

  // Filter approved reviews only for visitor display
  const approvedReviews = useMemo(() => {
    return reviews.filter(r => r.status === 'approved');
  }, [reviews]);

  // Compute average and totals
  const stats = useMemo(() => {
    if (approvedReviews.length === 0) return { avg: 5.0, count: 0 };
    const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      avg: parseFloat((totalRating / approvedReviews.length).toFixed(1)),
      count: approvedReviews.length
    };
  }, [approvedReviews]);

  // 1. HIGH-PERFORMANCE MARQUEE KEYFRAMES TICKER STATE CONTROLS
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragState, setIsDragState] = useState(false);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startDragOffsetRef = useRef(0);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const frictionFrameRef = useRef<number | null>(null);

  // Duplicate list if count is small to avoid gaps in ticker coverage 
  const itemsForBatch = useMemo(() => {
    if (approvedReviews.length === 0) return [];
    let list = [...approvedReviews];
    while (list.length < 5) {
      list = [...list, ...approvedReviews];
    }
    return list;
  }, [approvedReviews]);

  // Clean timeout on component unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      if (frictionFrameRef.current) cancelAnimationFrame(frictionFrameRef.current);
    };
  }, []);

  // Hover states - Immediately pause marquee on mouse enter, and wait 7 seconds upon mouse exit to resume
  const handleMouseEnter = () => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) return;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 7000);
  };

  // Dragging and Touch swiping mechanics
  const startDragging = (clientX: number) => {
    isDraggingRef.current = true;
    setIsDragState(true);
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    if (frictionFrameRef.current) {
      cancelAnimationFrame(frictionFrameRef.current);
      frictionFrameRef.current = null;
    }
    startXRef.current = clientX;
    startDragOffsetRef.current = dragOffset;
  };

  const moveDragging = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const dx = clientX - startXRef.current;
    setDragOffset(startDragOffsetRef.current + dx);
  };

  const stopDragging = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragState(false);

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    if (frictionFrameRef.current) {
      cancelAnimationFrame(frictionFrameRef.current);
      frictionFrameRef.current = null;
    }

    resumeTimeoutRef.current = setTimeout(() => {
      let currentVal = dragOffset;
      const step = () => {
        if (Math.abs(currentVal) < 1) {
          setDragOffset(0);
          setIsPaused(false);
          frictionFrameRef.current = null;
        } else {
          currentVal = currentVal * 0.85; // Luxurious organic friction easing
          setDragOffset(currentVal);
          frictionFrameRef.current = requestAnimationFrame(step);
        }
      };
      frictionFrameRef.current = requestAnimationFrame(step);
    }, 7000);
  };

  // Event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    startDragging(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    moveDragging(e.clientX);
  };

  const handleMouseUpOrLeave = () => {
    stopDragging();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      startDragging(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      moveDragging(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    stopDragging();
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    
    // Cache details to customize the responsive bot's reply
    setSubmittedName(name.trim());
    setSubmittedRating(rating);
    
    onSubmitReview(name.trim(), comment.trim(), rating);
    setName('');
    setComment('');
    setRating(5);
    setSuccess(true);
  };

  const handleResetForm = () => {
    setSuccess(false);
    setSubmittedName('');
  };

  const renderBotFace = () => {
    const isHigh = submittedRating >= 4;
    return (
      <div className="flex flex-col items-center justify-center mb-6">
        {/* Bot Head Structure */}
        <div className={`relative w-28 h-24 rounded-2xl border-2 p-3 flex flex-col items-center justify-center transition-all duration-500 shadow-xl ${
          isHigh 
            ? 'bg-slate-900 border-cyan-400 shadow-cyan-500/20' 
            : 'bg-slate-900 border-rose-500 shadow-rose-500/20'
        }`}>
          {/* Antennas */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className={`w-1 h-3 transition-colors duration-500 ${isHigh ? 'bg-cyan-400' : 'bg-rose-500'}`} />
            <div className={`w-3 h-3 rounded-full animate-ping absolute -top-1.5 transition-colors duration-500 ${isHigh ? 'bg-cyan-400' : 'bg-rose-500'}`} />
            <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${isHigh ? 'bg-cyan-400' : 'bg-rose-500'}`} />
          </div>
          
          {/* Ears */}
          <div className={`absolute -left-2.5 w-2.5 h-6 rounded-l-md transition-colors duration-500 ${isHigh ? 'bg-cyan-400' : 'bg-rose-500'}`} />
          <div className={`absolute -right-2.5 w-2.5 h-6 rounded-r-md transition-colors duration-500 ${isHigh ? 'bg-cyan-400' : 'bg-rose-500'}`} />

          {/* Dynamic Display Face */}
          <div className="w-full h-full bg-slate-950 rounded-lg p-2 flex flex-col justify-between items-center relative overflow-hidden">
            {/* Subtle grid pattern background */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:6px_6px]" />
            
            {/* Eyes container */}
            <div className="flex justify-around w-full mt-1.5 z-10">
              {isHigh ? (
                <>
                  <svg className="w-6 h-4 text-cyan-400 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                    <path d="M4 12c3-4 7-4 10 0" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <svg className="w-6 h-4 text-cyan-400 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                    <path d="M4 12c3-4 7-4 10 0" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </>
              ) : (
                <>
                  <svg className="w-6 h-4 text-rose-500 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                    <path d="M4 6l10 5" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <svg className="w-6 h-4 text-rose-500 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                    <path d="M20 6l-10 5" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </>
              )}
            </div>

            {/* Glowing cheeks */}
            <div className="flex justify-between w-full px-2 z-10">
              <div className={`w-2.5 h-1.5 rounded-full blur-[1px] ${isHigh ? 'bg-pink-500/60' : 'bg-orange-500/30'}`} />
              <div className={`w-2.5 h-1.5 rounded-full blur-[1px] ${isHigh ? 'bg-pink-500/60' : 'bg-orange-500/30'}`} />
            </div>

            {/* Mouth */}
            <div className="z-10 mb-1">
              {isHigh ? (
                <svg className="w-10 h-3 text-cyan-400 stroke-current fill-none" viewBox="0 0 40 10">
                  <path d="M6 2c4 5 24 5 28 0" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="w-10 h-3 text-rose-500 stroke-current fill-none" viewBox="0 0 40 10">
                  <path d="M12 8c4-4 12-4 16 0" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </div>
        </div>
        
        {/* Soft tag status */}
        <span className={`text-[10px] font-mono mt-3 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
          isHigh 
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {isHigh ? (lang === 'ar' ? 'البوت المساعد: سعيد للغاية 🤖✨' : 'Assistant Bot: Thrilled 🤖✨') : (lang === 'ar' ? 'البوت المساعد: حزين ومتعاطف 😔🌧️' : 'Assistant Bot: Sympathetic 😔🌧️')}
        </span>
      </div>
    );
  };

  return (
    <section 
      id="testimonials" 
      className={`py-24 relative z-10 overflow-hidden ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900 border-b border-slate-200'
      }`}
      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
    >
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
            theme === 'dark'
              ? 'from-cyan-400 via-white to-purple-400'
              : 'from-cyan-600 via-slate-800 to-purple-700'
          }`}>
            {lang === 'ar' ? 'ماذا يقول شركاء النجاح عن لوكسكود؟' : 'Client Success Echoes'}
          </h2>
          <div className="h-1.5 w-24 bg-cyan-400 mx-auto rounded-full mb-6" />
          <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {lang === 'ar'
              ? 'نهتم بأدق تفاصيل منتجات شركائنا ونمنحهم هيبة بصرية وقوة برمجية استثنائية تؤسس لمبيعات ناجحة.'
              : 'Our attention to visual weight and loading performance elevates customer conversion loops and secures satisfaction.'}
          </p>
        </div>

        {/* Global Statistics Summary Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 max-w-2xl mx-auto">
          <div className={`p-5 rounded-2xl border text-center flex-1 w-full ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-900' : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}>
            <span className="text-4xl font-extrabold text-cyan-400 font-mono">{stats.avg}</span>
            <div className="flex justify-center gap-1 my-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(stats.avg) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                  }`} 
                />
              ))}
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider opacity-60">
              {lang === 'ar' ? 'متوسط تقييم العملاء' : 'Average Rating'}
            </p>
          </div>

          <div className={`p-5 rounded-2xl border text-center flex-1 w-full ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-900' : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}>
            <span className="text-4xl font-extrabold text-purple-400 font-mono">{stats.count}</span>
            <div className="my-1.5 text-xs opacity-75">💬 {lang === 'ar' ? 'رأي معتمد متاح' : 'Verified Reviews'}</div>
            <p className="text-[10px] font-mono uppercase tracking-wider opacity-60">
              {lang === 'ar' ? 'إجمالي الآراء المنشورة حياً' : 'Total Approved Reviews'}
            </p>
          </div>
        </div>

        {/* 2. PREMIUM HORIZONTAL NEWS-TICKER / TESTIMONIALS SLIDER SECTION */}
        <div 
          className="relative w-full mb-20 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Lateral Feathered Fades to hide ticker boundaries in premium style */}
          <div className={`absolute top-0 bottom-0 left-0 w-12 md:w-32 z-20 pointer-events-none transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-slate-950 to-transparent' 
              : 'bg-gradient-to-r from-white to-transparent'
          }`} />
          <div className={`absolute top-0 bottom-0 right-0 w-12 md:w-32 z-20 pointer-events-none transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gradient-to-l from-slate-950 to-transparent' 
              : 'bg-gradient-to-l from-white to-transparent'
          }`} />

          {/* Continuous Ticker Scrollport Container */}
          <div
            dir="ltr"
            className={`w-full overflow-hidden py-6 select-none relative ${
              isDragState ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {approvedReviews.length > 0 ? (
              <div
                style={{
                  transform: `translateX(${dragOffset}px)`,
                  transition: isDragState ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="w-full flex"
              >
                <div
                  className="animate-marquee-slow flex gap-6"
                  style={{
                    animationPlayState: isPaused ? 'paused' : 'running'
                  }}
                >
                  {/* Batch 1 */}
                  <div className="flex gap-6 shrink-0">
                  {itemsForBatch.map((review, index) => (
                    <div
                      id={`slider-review-item-${review.id}-b1-${index}`}
                      key={`ticker-rev-b1-${review.id}-${index}`}
                      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                      className={`flex-shrink-0 w-[290px] sm:w-[350px] p-6 rounded-2xl border transition-all duration-350 hover:scale-[1.02] relative flex flex-col justify-between ${
                        theme === 'dark'
                          ? 'bg-slate-900/30 border-slate-900/80 hover:border-slate-800'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div>
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 mb-3.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-4 h-4 ${
                                s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                              }`} 
                            />
                          ))}
                        </div>

                        {/* Feedback text */}
                        <p className={`text-xs sm:text-sm leading-relaxed mb-6 italic font-medium ${
                          theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                        }`}>
                          "{review.comment}"
                        </p>
                      </div>

                      {/* Meta details */}
                      <div className="flex items-center justify-between border-t border-slate-500/10 pt-4 mt-auto">
                        <span className="font-extrabold text-xs text-cyan-400">{review.name}</span>
                        <span className="text-[9px] font-mono opacity-50 tracking-wide">{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Batch 2 (Identical Duplicate for continuous looping) */}
                <div className="flex gap-6 shrink-0" aria-hidden="true">
                  {itemsForBatch.map((review, index) => (
                    <div
                      id={`slider-review-item-${review.id}-b2-${index}`}
                      key={`ticker-rev-b2-${review.id}-${index}`}
                      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
                      className={`flex-shrink-0 w-[290px] sm:w-[350px] p-6 rounded-2xl border transition-all duration-350 hover:scale-[1.02] relative flex flex-col justify-between ${
                        theme === 'dark'
                          ? 'bg-slate-900/30 border-slate-900/80 hover:border-slate-800'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div>
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 mb-3.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-4 h-4 ${
                                s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                              }`} 
                            />
                          ))}
                        </div>

                        {/* Feedback text */}
                        <p className={`text-xs sm:text-sm leading-relaxed mb-6 italic font-medium ${
                          theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                        }`}>
                          "{review.comment}"
                        </p>
                      </div>

                      {/* Meta details */}
                      <div className="flex items-center justify-between border-t border-slate-500/10 pt-4 mt-auto">
                        <span className="font-extrabold text-xs text-cyan-400">{review.name}</span>
                        <span className="text-[9px] font-mono opacity-50 tracking-wide">{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ) : (
              <div style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }} className="w-full text-center py-10 opacity-50 text-sm font-mono border border-dashed border-slate-800 rounded-xl">
                {lang === 'ar' ? 'لا توجد آراء معروضة من الإشراف حالياً.' : 'No testimonials approved yet.'}
              </div>
            )}
          </div>

          {/* Interactive instruction tips */}
          <p className="text-center font-mono text-[9px] tracking-wide opacity-40 select-none">
            {lang === 'ar' 
              ? '💡 مرر مؤشر الماوس للتوقف المؤقت، أو اسحب لقراءة التعليقات وتصفحها حرّاً (يثبت 7 ثوانٍ ثم يعود تلقائياً)' 
              : '💡 Hover to freeze, or grab and swipe manually to read at your own pace (resumes after 7 seconds)'}
          </p>
        </div>

        {/* 3. CENTERED HIGH-FIDELITY SUBMISSION FORM OR BOT RESPONDER */}
        <div className="max-w-xl mx-auto">
          <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 relative ${
            theme === 'dark' 
              ? 'bg-slate-900/30 border-slate-900' 
              : 'bg-slate-50 border-slate-200 shadow-lg shadow-black/5'
          }`}>
            
            {!success ? (
              <>
                <h3 className="font-extrabold text-md sm:text-lg flex items-center justify-center gap-2 mb-2 text-center">
                  <MessageSquareCode className="w-5 h-5 text-purple-400" />
                  <span>{lang === 'ar' ? 'هل تعاملت معنا؟ أضف رأيك وتجربتك الفاخرة' : 'Inspiring Partner? Subscribed Voice'}</span>
                </h3>
                <p className={`text-xs mb-6 text-center max-w-md mx-auto ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {lang === 'ar' 
                    ? 'يسعدنا سماع صوتك لتطوير كفاءتنا. سيخضع تعليقك للسياسة التلقائية ضد الألفاظ غير الملائمة وفور مراجعته سينشر.' 
                    : 'We value your absolute feedback to drive elite solutions. New reviews pass content safety guidelines before publishing.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* rating selector */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1.5 font-semibold">
                      {lang === 'ar' ? 'درجة التقييم (من 1 إلى 5 نجوم)' : 'Select Rating (1 to 5 Stars)'}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                          title={`${star} Stars`}
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= (hoverRating || rating) 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : theme === 'dark' ? 'text-slate-700' : 'text-slate-300'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name input */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1.5 font-semibold">
                      {lang === 'ar' ? 'الاسم الثنائي أو اسم المنشأة' : 'Full Name / Company Name'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'ar' ? 'كتابة اسمك هنا...' : 'Enter your name...'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:ring-1 ${
                        theme === 'dark' 
                          ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500 focus:border-cyan-500' 
                          : 'bg-white border-slate-300 text-slate-900 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-1.5 font-semibold">
                      {lang === 'ar' ? 'تفاصيل المراجعة أو التجربة' : 'Your Review Details'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder={lang === 'ar' ? 'اكتب تجربتك وتفاصيل تعاملك معنا هنا بكل وضوح...' : 'Tell us about your experience with LuxCod...'}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:ring-1 ${
                        theme === 'dark' 
                          ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500 focus:border-cyan-500' 
                          : 'bg-white border-slate-300 text-slate-900 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs hover:opacity-95 hover:shadow-lg hover:shadow-cyan-500/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'إرسال المراجعة للمراجعة والتدقيق' : 'Submit Review'}</span>
                  </button>
                </form>
              </>
            ) : (
              /* Bot feedback responder card */
              <div className="flex flex-col items-center text-center py-4 animate-fadeIn">
                {renderBotFace()}

                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-5 h-5 ${
                        s <= submittedRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'
                      }`} 
                    />
                  ))}
                </div>

                <h4 className="font-extrabold text-lg mb-3 text-cyan-400">
                  {submittedRating >= 4 
                    ? (lang === 'ar' ? 'تم استلام تقييمك المذهل! 🎉' : 'A Galactic Thank You! 🎉')
                    : (lang === 'ar' ? 'نعتذر ونهتم جداً بمراجعتك.. 😔' : 'Our Deepest Apologies.. 😔')
                  }
                </h4>

                <p className={`text-xs leading-relaxed px-4 rounded-xl border p-4 mb-6 ${
                  theme === 'dark' 
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300' 
                    : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  {submittedRating >= 4 ? (
                    lang === 'ar' ? (
                      <>
                        شكراً جزيلاً لثقتك الفاخرة يا <strong className="text-cyan-400">{submittedName}</strong>! 🤩 تعليقك الرائع تم حفظه بأمان في قاعدة بيانات المخدم وخضع لفحص الكلام وجاري تمكينه في شريط الأخبار. شكراً لدعمك الشغوف الذي يغذي تميزنا دائمًا! 🚀✨
                      </>
                    ) : (
                      <>
                        What an outstanding rating, <strong className="text-cyan-400">{submittedName}</strong>! 🤩 Your review was successfully saved to our persistent server database, passed our dynamic safety checks, and is now queued. Thank you for refueling our engineering soul! 🚀✨
                      </>
                    )
                  ) : (
                    lang === 'ar' ? (
                      <>
                        اعتذار بليغ وصادق لك يا <strong className="text-rose-450 text-rose-450/90 font-bold">{submittedName}</strong>.. 💔 ملاحظتك المفصلة والقيمة جرى تسجيلها وسيقوم مهندسي النظام بفحص الخلل بجدية تامة. رأيك هو عصب جودتنا ونسعى دائمًا لنيل رضاك التام! 🛠️🌹
                      </>
                    ) : (
                      <>
                        Deepest apologies, <strong className="text-rose-400">{submittedName}</strong>.. 💔 Your detailed feedback is extremely vital to us. It has been securely cataloged for our core engineers to review. We aim to fix bottlenecks and earn back your absolute trust! 🛠️🌹
                      </>
                    )
                  )}
                </p>

                <button
                  onClick={handleResetForm}
                  className={`px-5 py-2 rounded-lg border text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                      : 'bg-white border-slate-200 text-slate-750 hover:bg-slate-50'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة رأي أو مراجعة أخرى' : 'Submit Another Testimony'}</span>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
