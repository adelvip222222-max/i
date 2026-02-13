import RegisterForm from './RegisterForm';

interface HeroSectionProps {
  content: any;
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden bg-slate-900">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Right Side - Content */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium animate-fade-in-up">
              🚀 شريكك التقني الأول للنمو
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-white tracking-tight">
              {content?.titleAr || 'نحول أفكارك إلى'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                واقع رقمي ذكي
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {content?.descriptionAr ||
                'نقدم حلولاً برمجية متطورة، وتصاميم إبداعية، واستراتيجيات تسويقية تضمن تفوقك في السوق الرقمي.'}
            </p>
            
            {/* Tech Stack Icons Strip */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-center lg:justify-start gap-6 opacity-50">
              <span className="text-white text-sm font-mono">React</span>
              <span className="text-white text-sm font-mono">Next.js</span>
              <span className="text-white text-sm font-mono">Cloud</span>
              <span className="text-white text-sm font-mono">AI Solutions</span>
            </div>
          </div>

          {/* Left Side - Register Form */}
          <div className="order-1 lg:order-2">
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
}