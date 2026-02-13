'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Service {
  _id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  image?: string;
  site?: {
    _id: string;
    nameAr: string;
    slug: string;
    logo?: string;
    siteType: string;
  };
  contactInfo?: {
    phone: string;
    email: string;
    address?: string;
    whatsapp?: string;
  };
}

interface Props {
  services: Service[];
}

const SITE_TYPE_ICONS: Record<string, string> = {
  contracting: '🏗️',
  technology: '💻',
  medical: '🏥',
  other: '🏢',
};

export default function SubscribersServicesView({ services }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Get unique site types
  const siteTypes = useMemo(() => {
    const types = new Set(services.map(s => s.site?.siteType).filter((type): type is string => Boolean(type)));
    return Array.from(types);
  }, [services]);

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = 
        service.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.site?.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = 
        selectedType === 'all' || service.site?.siteType === selectedType;

      return matchesSearch && matchesType;
    });
  }, [services, searchQuery, selectedType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-3xl">🚀</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">4IT</h1>
                <p className="text-xs text-gray-500">منصة الخدمات التقنية</p>
              </div>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">خدمات المشتركين</h1>
          <p className="text-xl text-blue-100 mb-8">
            تصفح جميع الخدمات المتاحة من مشتركينا وتواصل معهم مباشرة
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-2 shadow-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن خدمة أو شركة..."
                className="w-full px-6 py-4 text-gray-900 text-lg rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-[73px] z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
                selectedType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              الكل ({services.length})
            </button>
            {siteTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition flex items-center gap-2 ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{SITE_TYPE_ICONS[type] || '🏢'}</span>
                <span>
                  {type === 'contracting' && 'مقاولات'}
                  {type === 'technology' && 'تقنية'}
                  {type === 'medical' && 'طبي'}
                  {type === 'other' && 'أخرى'}
                </span>
                <span className="text-xs opacity-75">
                  ({services.filter(s => s.site?.siteType === type).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-12">
        {filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600">جرب البحث بكلمات مختلفة</p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-600">
              عرض {filteredServices.length} من {services.length} خدمة
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Service Image */}
                  {service.image ? (
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                      <Image
                        src={service.image}
                        alt={service.nameAr}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <span className="text-7xl">{service.icon}</span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Site Info */}
                    {service.site && (
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                        {service.site.logo ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
                            <Image
                              src={service.site.logo}
                              alt={service.site.nameAr}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                            {SITE_TYPE_ICONS[service.site.siteType] || '🏢'}
                          </div>
                        )}
                        <div className="flex-1">
                          <Link
                            href={`/s/${service.site.slug}`}
                            className="font-bold text-gray-900 hover:text-blue-600 transition"
                          >
                            {service.site.nameAr}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {service.site.siteType === 'contracting' && 'شركة مقاولات'}
                            {service.site.siteType === 'technology' && 'شركة تقنية'}
                            {service.site.siteType === 'medical' && 'مركز طبي'}
                            {service.site.siteType === 'other' && 'أخرى'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Service Info */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.nameAr}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.descriptionAr}
                    </p>

                    {/* Contact Info */}
                    {service.contactInfo && (
                      <div className="space-y-2 pt-4 border-t">
                        {service.contactInfo.phone && (
                          <a
                            href={`tel:${service.contactInfo.phone}`}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition"
                          >
                            <span>📞</span>
                            <span dir="ltr">{service.contactInfo.phone}</span>
                          </a>
                        )}
                        {service.contactInfo.whatsapp && (
                          <a
                            href={`https://wa.me/${service.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 transition"
                          >
                            <span>💬</span>
                            <span>واتساب</span>
                          </a>
                        )}
                        {service.contactInfo.email && (
                          <a
                            href={`mailto:${service.contactInfo.email}`}
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition"
                          >
                            <span>📧</span>
                            <span className="truncate">{service.contactInfo.email}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* View Site Button */}
                    {service.site && (
                      <Link
                        href={`/s/${service.site.slug}`}
                        className="mt-4 block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-xl font-bold transition"
                      >
                        زيارة الموقع
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 4IT. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
