'use client';

import { useState, useEffect } from 'react';
import { submitContactMessage } from '@/lib/actions/site-public';
import { Cairo } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300','400','600','700','800']
});

interface Props {
  site: any;
  services: any[];
  projects: any[];
  contactInfo: any | null;
  socialLinks: any[];
}

// دالة للحصول على أيقونة المنصة
const getPlatformIcon = (platform: string) => {
  const icons: Record<string, string> = {
    facebook: '📘',
    twitter: '🐦',
    instagram: '📷',
    linkedin: '💼',
    youtube: '📺',
    whatsapp: '💬',
    telegram: '✈️',
    tiktok: '🎵',
    snapchat: '👻',
    github: '💻',
  };
  return icons[platform.toLowerCase()] || '🔗';
};

export default function PublicSiteView({ site, services, projects, contactInfo, socialLinks }: Props) {
  const [formData, setFormData] = useState({ name:'', email:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type:'success'|'error'; text:string} | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState<any>(null);

  // صور Hero - إذا لم تكن موجودة، استخدم null
  const heroImages = site.heroImages && site.heroImages.length > 0 
    ? site.heroImages 
    : null;

  // التحقق من تسجيل الدخول
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = ['home', 'services', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide للصور
  useEffect(() => {
    if (!heroImages || heroImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 
    setMessage(null);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      const result = await submitContactMessage(site._id, fd);
      if(result.success){
        setMessage({ type:'success', text: result.message || 'تم الإرسال بنجاح' });
        setFormData({ name:'', email:'', subject:'', message:'' });
      } else {
        setMessage({ type:'error', text: result.error || 'فشل في الإرسال' });
      }
    } catch { 
      setMessage({ type:'error', text:'حدث خطأ' }); 
    } finally { 
      setLoading(false); 
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${cairo.className}`} dir="rtl">
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200' 
            : 'bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => document.getElementById('home')?.scrollIntoView({behavior:'smooth'})}
          >
            {site.logo ? (
              <img 
                src={site.logo} 
                alt={site.nameAr}
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-contain bg-white/10 backdrop-blur-sm p-1 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                {site.nameAr ? site.nameAr.charAt(0) : '4'}
              </div>
            )}
            <h1 className={`text-xl md:text-2xl font-bold transition-colors ${
              isScrolled ? 'text-slate-900' : 'text-white'
            }`}>
              {site.nameAr}
            </h1>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-8">
            {['الرئيسية', 'خدماتنا', 'مشاريعنا', 'اتصل بنا'].map((item, index) => {
              const sectionId = index === 0 ? 'home' : index === 1 ? 'services' : index === 2 ? 'projects' : 'contact';
              const isActive = activeSection === sectionId;
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ y: -1 }}
                  onClick={() => document.getElementById(sectionId)?.scrollIntoView({behavior:'smooth'})}
                  className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? isScrolled ? 'text-blue-600' : 'text-blue-300'
                      : isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item}
                  {isActive && (
                    <motion.div 
                      layoutId="activeSection"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isScrolled ? 'bg-blue-600' : 'bg-blue-300'
                      }`}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl"
            >
              تواصل معنا
            </motion.button>
            
            {user && (
              <motion.a
                href="/admin/dashboard"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                إدارة الموقع
              </motion.a>
            )}
          </div>
        </div>
      </motion.header>


      {/* Hero Section مع Slider */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {heroImages && heroImages.length > 0 ? (
          <div className="absolute inset-0">
            {heroImages.map((image: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  scale: currentSlide === index ? 1 : 1.1
                }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
                style={{ zIndex: currentSlide === index ? 1 : 0 }}
              >
                <img 
                  src={image} 
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/70"></div>
              </motion.div>
            ))}
            
            {heroImages.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {heroImages.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentSlide === index 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}

            {heroImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50">
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          </div>
        )}

        <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6 px-4 py-2 bg-blue-50/90 backdrop-blur-sm rounded-md border border-blue-100"
          >
            <span className={`${heroImages ? 'text-blue-500' : 'text-blue-700'} text-sm font-medium`}>
              حلول مؤسسية متكاملة
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
              heroImages ? 'text-white' : 'text-slate-900'
            }`}
          >
            مرحباً بك في <br className="md:hidden" />
            <span className={heroImages ? 'text-blue-300' : 'text-blue-600'}>{site.nameAr}</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className={`text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed ${
              heroImages ? 'text-white/90' : 'text-slate-600'
            }`}
          >
            نقدم حلولاً تقنية متكاملة للمؤسسات والشركات، تجمع بين الخبرة المهنية والابتكار الرقمي
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={()=>document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}
              className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
            >
              استكشف خدماتنا
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}
              className={`px-8 py-4 rounded-lg font-medium transition-all shadow-sm hover:shadow ${
                heroImages 
                  ? 'bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white' 
                  : 'bg-white border border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600'
              }`}
            >
              اتصل بنا
            </motion.button>
          </motion.div>
        </div>
      </section>


      {/* Services Section */}
      <section id="services" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              خدماتنا
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات التقنية المصممة خصيصاً لتلبية احتياجات مؤسستك
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => {
              return (
                <motion.div
                  key={service._id}
                  variants={fadeInUp}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-blue-600/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {service.image ? (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.nameAr}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
                        {service.icon}
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform text-blue-600">
                        {service.icon}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {service.nameAr}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {service.descriptionAr}
                    </p>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <span className="text-blue-600 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        اعرف المزيد
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>


      {/* Projects Section */}
      <section id="projects" className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              مشاريعنا
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              نفخر بإنجازاتنا ومشاريعنا الناجحة التي قدمناها لعملائنا
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {projects && projects.length > 0 ? projects.map((project) => {
              return (
                <motion.div
                  key={project._id}
                  variants={fadeInUp}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-blue-600/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.titleAr}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        📁
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg">
                      <span className="text-sm font-bold text-slate-700">{project.category}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.titleAr}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {project.descriptionAr}
                    </p>
                    
                    {project.client && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                        <span>👤</span>
                        <span>{project.client}</span>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-blue-600 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        عرض التفاصيل
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </span>
                      {project.url && (
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-slate-400 text-lg">لا توجد مشاريع متاحة حالياً</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                تواصل معنا
              </h2>
              <div className="w-20 h-1 bg-blue-600 mb-8"></div>
              
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                فريقنا جاهز للإجابة على استفساراتك وتقديم الاستشارات المهنية لمشروعك القادم
              </p>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    📧
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">البريد الإلكتروني</p>
                    <p className="font-medium text-slate-900">{contactInfo?.email || 'info@company.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    📱
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">رقم الهاتف</p>
                    <p className="font-medium text-slate-900">{contactInfo?.phone || '+966 12 345 6789'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    📍
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">المقر الرئيسي</p>
                    <p className="font-medium text-slate-900">{contactInfo?.address || 'الرياض، المملكة العربية السعودية'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-slate-200"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                أرسل لنا رسالة
              </h3>
              
              <AnimatePresence>
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                      message.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    <span className="text-lg">{message.type === 'success' ? '✓' : '⚠'}</span>
                    <p className="font-medium">{message.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="text" 
                      required 
                      placeholder="الاسم" 
                      value={formData.name} 
                      onChange={e=>setFormData({...formData,name:e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                    />
                  </div>
                  
                  <div>
                    <input 
                      type="email" 
                      required 
                      placeholder="البريد الإلكتروني" 
                      value={formData.email} 
                      onChange={e=>setFormData({...formData,email:e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                    />
                  </div>
                </div>
                
                <div>
                  <input 
                    type="text" 
                    placeholder="الموضوع" 
                    value={formData.subject} 
                    onChange={e=>setFormData({...formData,subject:e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                  />
                </div>
                
                <div>
                  <textarea 
                    placeholder="رسالتك..." 
                    rows={4} 
                    required 
                    value={formData.message} 
                    onChange={e=>setFormData({...formData,message:e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition resize-none"
                  />
                </div>
                
                <motion.button 
                  type="submit" 
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      جاري الإرسال...
                    </span>
                  ) : 'إرسال الرسالة'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                  {site.nameAr ? site.nameAr.charAt(0) : '4'}
                </div>
                <h3 className="text-xl font-bold text-white">{site.nameAr}</h3>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-md text-sm">
                نقدم حلولاً تقنية متكاملة للمؤسسات والشركات في المملكة العربية السعودية والوطن العربي
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={()=>document.getElementById('home')?.scrollIntoView({behavior:'smooth'})} className="text-slate-400 hover:text-white transition-colors">الرئيسية</button></li>
                <li><button onClick={()=>document.getElementById('services')?.scrollIntoView({behavior:'smooth'})} className="text-slate-400 hover:text-white transition-colors">خدماتنا</button></li>
                <li><button onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})} className="text-slate-400 hover:text-white transition-colors">مشاريعنا</button></li>
                <li><button onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} className="text-slate-400 hover:text-white transition-colors">اتصل بنا</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">تابعنا</h4>
              <div className="flex gap-3">
                {socialLinks && socialLinks.length > 0 ? (
                  socialLinks.map((link) => (
                    <motion.a
                      key={link._id}
                      whileHover={{ y: -2 }}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                      title={link.platform}
                    >
                      {getPlatformIcon(link.platform)}
                    </motion.a>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">لا توجد روابط متاحة</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} {site.nameAr}. جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
