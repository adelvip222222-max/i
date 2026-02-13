'use client';

import { useState } from 'react';
import { createMessage } from '@/lib/actions/messages';

interface ContactSectionProps {
  contactInfo: any;
  socialLinks: any[];
}

export default function ContactSection({ contactInfo, socialLinks }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // محاكاة الإرسال
    setTimeout(() => { 
        setIsSubmitting(false); 
        setMessage({type: 'success', text: 'تم استلام رسالتك بنجاح! سنتواصل معك قريباً.'}); 
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      
      {/* الخلفية */}
      <div className="absolute top-0 left-0 w-full h-[60%] bg-slate-900 skew-y-3 origin-top-right translate-y-[-15%] z-0 shadow-2xl"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* الجانب الأيمن: معلومات الاتصال */}
          <div className="lg:col-span-5 text-white lg:pt-8">
            <div className="relative">
                <span className="text-blue-400 font-bold tracking-wider text-sm uppercase mb-2 block">تواصل معنا</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                لنبدأ مشروعك <br /> <span className="text-blue-500">الرقمي القادم</span>
                </h2>
            </div>
            
            <p className="text-lg text-slate-300 mb-10 leading-relaxed border-r-4 border-blue-600/30 pr-4">
              فريقنا جاهز للرد على استفساراتك التقنية وتقديم الاستشارات لبناء حلول برمجية تخدم أهدافك.
            </p>

            <div className="space-y-6">
               {/* بطاقة الهاتف */}
               <div className="group flex items-center gap-5 bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300">
                 {/* الأيقونة */}
                 <div className="w-12 h-12 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                 </div>
                 
                 {/* الخط والنص - تم التعديل هنا ليدعم العربية */}
                 <div className="flex-1 border-r border-white/20 pr-5 mr-1"> 
                   <p className="text-sm text-slate-400 font-medium mb-1">اتصل بنا مباشرة</p>
                   <p className="font-bold text-xl text-white tracking-wide font-mono" dir="ltr">{contactInfo?.phone || '+966 50 000 0000'}</p>
                 </div>
               </div>

               {/* بطاقة البريد */}
               <div className="group flex items-center gap-5 bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300">
                 {/* الأيقونة */}
                 <div className="w-12 h-12 shrink-0 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                 </div>
                 
                 {/* الخط والنص - تم التعديل هنا ليدعم العربية */}
                 <div className="flex-1 border-r border-white/20 pr-5 mr-1">
                   <p className="text-sm text-slate-800 font-medium mb-1">البريد الإلكتروني</p>
                   <p className="font-bold text-lg text-white">{contactInfo?.email || 'info@4it.com'}</p>
                 </div>
               </div>
            </div>
            
            {/* Social Links */}
            <div className="mt-12">
                <p className="text-sm text-slate-400 mb-4">تابعنا على منصات التواصل</p>
                <div className="flex gap-3">
                {socialLinks && socialLinks.length > 0 ? socialLinks.map((link: any) => (
                    <a key={link._id || link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-slate-800 border border-slate-700 hover:bg-blue-600 hover:border-blue-500 flex items-center justify-center rounded-lg transition-all text-white group">
                    <span className="text-xl group-hover:scale-110 transition-transform">🔗</span>
                    </a>
                )) : (
                    ['twitter', 'linkedin', 'instagram'].map((platform) => (
                        <div key={platform} className="w-11 h-11 bg-slate-800 border border-slate-700 hover:bg-blue-600 hover:border-blue-500 flex items-center justify-center rounded-lg transition-all text-white cursor-pointer">
                            <span className="capitalize text-xs">{platform[0]}</span>
                        </div>
                    ))
                )}
                </div>
            </div>
          </div>

          {/* الجانب الأيسر: النموذج */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-blue-900/10 border border-slate-100 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] rounded-tr-[2rem] -z-0"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">أرسل استفسارك</h3>
                <p className="text-slate-500 mb-8 text-sm">سنقوم بالرد عليك خلال 24 ساعة عمل.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">الاسم بالكامل</label>
                        <input type="text" name="name" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400" placeholder="الاسم هنا" />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">البريد الإلكتروني</label>
                        <input type="email" name="email" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400" placeholder="name@example.com" />
                    </div>
                    </div>

                    <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">رقم الهاتف</label>
                    <input type="tel" name="phone" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-slate-800 placeholder:text-slate-400" placeholder="05xxxxxxxx" dir="ltr" style={{textAlign: 'right'}} />
                    </div>

                    <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors">الرسالة</label>
                    <textarea name="message" required rows={4} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all outline-none font-medium text-slate-800 resize-none placeholder:text-slate-400" placeholder="كيف يمكننا مساعدتك؟"></textarea>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:translate-y-[-2px] disabled:opacity-70 disabled:transform-none flex justify-center items-center gap-2 group">
                        {isSubmitting ? (
                            'جاري الإرسال...'
                        ) : (
                            <>
                            إرسال الرسالة الآن 
                            <span className="group-hover:-translate-x-1 transition-transform">🚀</span>
                            </>
                        )}
                    </button>
                    
                    {message && (
                    <div className={`p-4 rounded-xl text-center text-sm font-bold animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                        {message.text}
                    </div>
                    )}
                </form>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}