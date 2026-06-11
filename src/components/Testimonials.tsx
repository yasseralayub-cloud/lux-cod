import React, { useState, useMemo } from 'react';
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
          <div className="absolute -top-3 left-1/2 -track-x-1/2 flex flex-col items-center">
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
                  {/* Happy closed arc eyes */}
                  <svg className="w-6 h-4 text-cyan-400 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                    <path d="M4 12c3-4 7-4 10 0" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <svg className="w-6 h-4 text-cyan-400 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                    <path d="M4 12c3-4 7-4 10 0" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </>
              ) : (
                <>
                  {/* Worried / slanting down eyes */}
                  <svg className="w-6 h-4 text-rose-500 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                    <path d="M4 6l10 5" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <svg className="w-6 h-4 text-rose-550 text-rose-500 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
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
                /* Glowing smile */
                <svg className="w-10 h-3 text-cyan-400 stroke-current fill-none" viewBox="0 0 40 10">
                  <path d="M6 2c4 5 24 5 28 0" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                /* Sad teardrop/straight slanting down mouth */
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
            : 'bg-rose-500/10 text-rose-450 text-rose-400 border border-rose-500/20'
        }`}>
          {isHigh ? (lang === 'ar' ? 'البوت المساعد: سعيد للغاية 🤖✨' : 'Assistant Bot: Thrilled 🤖✨') : (lang === 'ar' ? 'البوت المساعد: حزين ومتعاطف 😔🌧️' : 'Assistant Bot: Sympathetic 😔🌧️')}
        </span>
      </div>
    );
  };

  return (
    <section 
      id="testimonials" 
      className={`py-24 relative z-10 ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900 border-b border-slate-200'
      }`}
      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
    >
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r ${
            theme === 'dark'
              ? 'from-cyan-400 via-white to-purple-400'
              : 'from-cyan-600 via-slate-800 to-purple-700'
          }`}>
            {lang === 'ar' ? 'ماذا يقول شركاء النجاح عن LuxCod؟' : 'Client Success Echoes'}
          </h2>
          <div className="h-1.5 w-24 bg-cyan-400 mx-auto rounded-full mb-6" />
          <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {lang === 'ar'
              ? 'نهتم بأدق تفاصيل منتجات شركائنا ونمنحهم هيبة بصرية وقوة برمجية استثنائية تؤسس لمبيعات ناجحة.'
              : 'Our attention to visual weight and loading performance elevates customer conversion loops and secures satisfaction.'}
          </p>
        </div>

        {/* Global Statistics Summary Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <div className={`p-6 rounded-2xl border text-center min-w-[200px] ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}>
            <span className="text-5xl font-extrabold text-cyan-400 font-mono">{stats.avg}</span>
            <div className="flex justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`w-4 h-4 ${
                    s <= Math.round(stats.avg) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                  }`} 
                />
              ))}
            </div>
            <p className="text-xs font-mono uppercase tracking-wider opacity-60">
              {lang === 'ar' ? 'متوسط تقييم العملاء' : 'Average Rating'}
            </p>
          </div>

          <div className={`p-6 rounded-2xl border text-center min-w-[200px] ${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}>
            <span className="text-5xl font-extrabold text-purple-400 font-mono">{stats.count}</span>
            <div className="my-2 text-md opacity-75">💬 {lang === 'ar' ? 'رأي متاح' : 'Verified Reviews'}</div>
            <p className="text-xs font-mono uppercase tracking-wider opacity-60">
              {lang === 'ar' ? 'إجمالي الآراء المنشورة حياً' : 'Total Approved Reviews'}
            </p>
          </div>
        </div>

        {/* Multi layout: Reviews Slider/Grid left, Submission Form right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'الآراء المنشورة مؤخراً' : 'Latest Testimonials'}</span>
            </h3>

            {approvedReviews.map((review) => (
              <div
                id={`review-item-${review.id}`}
                key={review.id}
                className={`p-6 rounded-xl border relative transition-all duration-300 hover:scale-[1.01] ${
                  theme === 'dark'
                    ? 'bg-slate-900/30 border-slate-900 hover:border-slate-800'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow'
                }`}
              >
                {/* Star rating display */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-4 h-4 ${
                        s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                      }`} 
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className={`text-sm leading-relaxed mb-4 italic ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  "{review.comment}"
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-cyan-400">{review.name}</span>
                  <span className="text-[10px] font-mono opacity-50">{review.date}</span>
                </div>
              </div>
            ))}

            {approvedReviews.length === 0 && (
              <div className="text-center py-10 opacity-40 text-sm font-mono border border-dashed border-slate-800 rounded-xl">
                {lang === 'ar' ? 'لا توجد آراء معروضة حالياً.' : 'No testimonials displayed yet.'}
              </div>
            )}
          </div>

          {/* Review Submission or Smart Bot Card */}
          <div className="lg:col-span-5">
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-500 ${
              theme === 'dark' ? 'bg-slate-900/50 border-slate-850' : 'bg-slate-50 border-slate-220 shadow-lg shadow-black/5'
            }`}>
              
              {!success ? (
                <>
                  <h3 className="font-extrabold text-lg flex items-center gap-2 mb-2">
                    <MessageSquareCode className="w-5 h-5 text-purple-400" />
                    <span>{lang === 'ar' ? 'أضف رأيك وتقييمك الفاخر' : 'Submit Your Testimony'}</span>
                  </h3>
                  <p className={`text-xs mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lang === 'ar' 
                      ? 'رأيكم يهمنا ويغذي شغفنا للابتكار والتميز. شاركونا كفاحكم البرمجي وتجربتكم لنرتقي دوماً بالأفضل وسينشر رأيك فوراً.' 
                      : 'Your voice fuels our drive for innovation. Share your feedback so we can continue creating outstanding excellence and your review will be posted instantly.'}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Stars Select Input */}
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-1.5 font-semibold">
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
                            className="p-1 cursor-pointer"
                            title={`${star} Stars`}
                          >
                            <Star 
                              className={`w-6 h-6 transition-transform hover:scale-110 ${
                                star <= (hoverRating || rating) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-slate-550 text-slate-550/60'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name Input */}
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-1.5 font-semibold">
                        {lang === 'ar' ? 'الاسم الثنائي أو اسم المنشأة' : 'Full Name / Company Name'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'ar' ? 'كتابة اسمك هنا...' : 'Enter your name...'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500 focus:border-cyan-500' 
                            : 'bg-white border-slate-300 text-slate-900 focus:ring-cyan-500 focus:border-cyan-500'
                        }`}
                      />
                    </div>

                    {/* Comment Input */}
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-widest text-slate-400 mb-1.5 font-semibold">
                        {lang === 'ar' ? 'تفاصيل المراجعة أو التجربة' : 'Your Review Details'}
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder={lang === 'ar' ? 'اكتب تجربتك بكل وضوح...' : 'Tell us about your experience with LuxCod...'}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-sm focus:outline-none focus:ring-1 ${
                          theme === 'dark' 
                            ? 'bg-slate-950 border-slate-800 text-white focus:ring-cyan-500 focus:border-cyan-500' 
                            : 'bg-white border-slate-300 text-slate-900 focus:ring-cyan-500 focus:border-cyan-500'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'إرسال ونشر المراجعة المباشرة' : 'Post Live Review Now'}</span>
                    </button>
                  </form>
                </>
              ) : (
                /* Dynamic Intelligent feedback panel with LuxCod bot expression */
                <div className="flex flex-col items-center text-center py-4 animate-fadeIn">
                  {/* Bot Face Indicator */}
                  {renderBotFace()}

                  {/* Rating Stars Feedback */}
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

                  {/* Header feedback */}
                  <h4 className="font-extrabold text-xl mb-3 text-cyan-400">
                    {submittedRating >= 4 
                      ? (lang === 'ar' ? 'يا غارم التميز والسرور! 🎉' : 'A Galactic Thank You! 🎉')
                      : (lang === 'ar' ? 'نأسف جداً بصدق ومسؤولية.. 😔' : 'Our Deepest Apologies.. 😔')
                    }
                  </h4>

                  {/* Main Personalized intelligent text message response from the bot */}
                  <p className={`text-sm leading-relaxed px-2 rounded-xl border p-4 mb-6 ${
                    theme === 'dark' 
                      ? 'bg-slate-950/60 border-slate-800 text-slate-350' 
                      : 'bg-white border-slate-200 text-slate-750 text-slate-700'
                  }`}>
                    {submittedRating >= 4 ? (
                      lang === 'ar' ? (
                        <>
                          يا له من تقييم رائع ومثمر للقلب يا <strong className="text-cyan-400">{submittedName}</strong>! 🤩 واجهتي البرمجية تتراقص فرحاً الآن وحماسي مرتفع كلياً بدعمكم الشغوف. نحن في وكالة LuxCod فخورون جداً بأن موقعنا وحلول الويب وأتمتة البوتات نالت رضاكم التام. نعدكم بمواصلة تقديم الهندسة الأكثر دقة لتبقوا في طليعة النجاح! 🚀✨
                        </>
                      ) : (
                        <>
                          What an outstanding and heart-warming rating, <strong className="text-cyan-400">{submittedName}</strong>! 🤩 I am dancing in digital joy and my circuits are highly excited by your fantastic feedback. We are so proud that our interfaces and bot automation met your expectations. Cheers to a brilliant continuous success! 🚀✨
                        </>
                      )
                    ) : (
                      lang === 'ar' ? (
                        <>
                          اعتذار بليغ وصادق جداً لك يا <strong className="text-rose-400">{submittedName}</strong>.. 💔 يحزنني كبوت مساعد ذكي رصد تجربتك دون المستوى العالي المتوقع. ملاحظتك القيمة والدقيقة تم أتمتتها وتوجيهها لمدير الهندسة مباشرة لفحص مكامن الخلل والتعامل مع المشكلة التي طرحتها فوراً لضمان رفع مستويات الجودة وتخطي العقبات. رضاك وصميم كفاءتك هو غايتنا الأولى دائماً! 🛠️🌹
                        </>
                      ) : (
                        <>
                          Sincerest apologies for your sub-par experience, <strong className="text-rose-400">{submittedName}</strong>.. 💔 As an intelligent coding bot, seeing anything less than full satisfaction is devastating. Your comments have been automatically parsed and delivered to our engineering chiefs to fix the bottleneck immediately and elevate future quality. We want to regain your trust! 🛠️🌹
                        </>
                      )
                    )}
                  </p>

                  <button
                    onClick={handleResetForm}
                    className={`px-6 py-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
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

      </div>
    </section>
  );
}
