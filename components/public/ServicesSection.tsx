interface Service {
  _id: string;
  nameAr: string;
  descriptionAr: string;
  icon: string;
  image?: string;
  features?: string[];
  projects?: {
    name: string;
    description: string;
    image?: string;
    url?: string;
  }[];
}

export default function ServicesSection({ services }: { services: Service[] }) {
  const getIcon = (iconStr: string) => iconStr || "⚡";

  return (
    <section id="services" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <span className="text-xl">✨</span>
            <span className="text-sm font-bold text-blue-600">ما نقدمه</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 relative inline-block">
            خدماتنا التقنية
            <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-600/20 -skew-x-12 transform translate-y-2"></span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            نجمع بين الإبداع والتقنية لنقدم لك حلولاً متكاملة تخدم أهدافك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 border border-slate-100 transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Service Image or Icon */}
              {service.image ? (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.nameAr}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-2xl">
                    {getIcon(service.icon)}
                  </div>
                </div>
              ) : (
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-600/5"></div>
                  <div className="relative text-7xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                    {getIcon(service.icon)}
                  </div>
                </div>
              )}

              {/* Service Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.nameAr}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.descriptionAr}
                </p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects Count */}
                {service.projects && service.projects.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold mb-4">
                    <span>🚀</span>
                    <span>{service.projects.length} مشروع منجز</span>
                  </div>
                )}

                <div className="flex items-center text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  اقرأ المزيد 
                  <span className="mr-2">←</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {services.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-4 opacity-20">📦</div>
            <h3 className="text-xl font-bold text-slate-400 mb-2">لا توجد خدمات حالياً</h3>
            <p className="text-slate-400">سيتم إضافة الخدمات قريباً</p>
          </div>
        )}
      </div>
    </section>
  );
}