export default function TeamContractSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
            نموذج العمل المميز
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            فريق كامل بتكلفة موظف واحد
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            عند التعاقد مع فريق 4IT، تحصل على فريق تقني متكامل بخبرات متنوعة بتكلفة موظف واحد فقط
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100 overflow-hidden border border-blue-100">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-4xl">🤝</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                نموذج التعاقد المرن
              </h3>
              <p className="text-blue-100 text-lg">
                حل اقتصادي ذكي لاحتياجاتك التقنية
              </p>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              
              {/* Main Benefit */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border-2 border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">
                      فريق كامل = راتب موظف واحد
                    </h4>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      بدلاً من توظيف عدة متخصصين (مطور، مصمم، مهندس شبكات، فني دعم) بتكاليف عالية، 
                      احصل على فريق متكامل من الخبراء بتكلفة موظف واحد فقط.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2">
                    خبرات متنوعة
                  </h5>
                  <p className="text-gray-600">
                    فريق من المتخصصين في مختلف المجالات التقنية يعملون معاً لخدمتك
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">💼</span>
                  </div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2">
                    توفير كبير
                  </h5>
                  <p className="text-gray-600">
                    وفّر تكاليف التوظيف والتأمينات والمزايا الإضافية لعدة موظفين
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2">
                    مرونة عالية
                  </h5>
                  <p className="text-gray-600">
                    تعاقد شهري أو سنوي حسب احتياجاتك دون التزامات طويلة الأمد
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h5 className="text-xl font-bold text-gray-900 mb-2">
                    تركيز كامل
                  </h5>
                  <p className="text-gray-600">
                    فريق مخصص لمشاريعك مع إدارة احترافية وتنسيق متكامل
                  </p>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xl font-bold text-gray-900 mb-2">
                      التزام متبادل مطلوب
                    </h5>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>تطلب إدارة الفريق دائماً احترام التعاقد</strong> من الطرفين. 
                      نحن نلتزم بتقديم أفضل الخدمات، ونتوقع من عملائنا الالتزام بشروط التعاقد 
                      والدفع في المواعيد المحددة لضمان استمرارية الخدمة بأعلى جودة.
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Composition */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  ما تحصل عليه في الفريق
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all">
                    <div className="text-4xl mb-2">👨‍💻</div>
                    <p className="font-semibold text-gray-900">مطورين</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all">
                    <div className="text-4xl mb-2">🎨</div>
                    <p className="font-semibold text-gray-900">مصممين</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all">
                    <div className="text-4xl mb-2">🔧</div>
                    <p className="font-semibold text-gray-900">فنيين</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all">
                    <div className="text-4xl mb-2">📞</div>
                    <p className="font-semibold text-gray-900">دعم فني</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-6 border-t-2 border-gray-200">
                <p className="text-gray-600 mb-6 text-lg">
                  هل أنت مستعد للحصول على فريق تقني متكامل؟
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1"
                >
                  <span>تواصل معنا الآن</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">70%</div>
            <p className="text-gray-600">توفير في التكاليف</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
            <p className="text-gray-600">دعم فني متواصل</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
            <p className="text-gray-600">التزام بالجودة</p>
          </div>
        </div>

      </div>
    </section>
  );
}
