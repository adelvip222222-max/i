interface AboutSectionProps {
  content: any;
}

export default function AboutSection({ content }: AboutSectionProps) {
  const features = content?.features?.items || [
    { titleAr: 'خبرة تقنية عميقة', icon: '💻' },
    { titleAr: 'التزام بالمواعيد', icon: '⏱️' },
    { titleAr: 'دعم فني 24/7', icon: '🛡️' },
    { titleAr: 'أسعار تنافسية', icon: '💎' },
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {content?.titleAr || 'نبتكر الحلول، لنصنع المستقبل'}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mb-8 rounded-full"></div>
            <p className="text-lg text-slate-600 mb-8 leading-loose">
              {content?.descriptionAr ||
                'نحن في 4IT نؤمن بأن التكنولوجيا هي المحرك الأساسي لنجاح الأعمال الحديثة. فريقنا مكون من نخبة المطورين والمصممين الشغوفين بتحويل التحديات إلى فرص رقمية.'}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-slate-800">{feature.titleAr}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Visual/Image Placeholder */}
          <div className="lg:w-1/2 order-1 lg:order-2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2rem] transform rotate-3 opacity-20 blur-lg"></div>
            <div className="relative bg-slate-900 rounded-[2rem] p-8 text-white min-h-[400px] flex items-center justify-center border border-slate-800 shadow-2xl">
               {/* هنا يفضل وضع صورة حقيقية للفريق أو رسم توضيحي */}
               <div className="text-center">
                 <div className="text-6xl mb-4">🚀</div>
                 <h3 className="text-2xl font-bold mb-2">+5 سنوات</h3>
                 <p className="text-slate-400">من الخبرة في السوق</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}