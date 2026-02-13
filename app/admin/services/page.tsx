'use client';

import { useState, useEffect } from 'react';
import { getAllServices, createService, updateService, deleteService } from '@/lib/actions/services';
import IconPicker from '@/components/admin/IconPicker';

interface Service {
  _id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  image?: string;
  features?: string[];
  projects?: {
    name: string;
    description: string;
    image?: string;
    url?: string;
  }[];
  isActive: boolean;
  order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💻');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const result = await getAllServices();
      // تأكد من أن النتيجة تحتوي على data وأنها مصفوفة
      if (result && result.data) {
        setServices(result.data);
      } else if (Array.isArray(result)) {
         // في حالة كانت النتيجة مصفوفة مباشرة
         setServices(result);
      }
    } catch (error) {
      console.error("Failed to load services", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // تصحيح القيم المنطقية يدوياً إذا لزم الأمر قبل الإرسال
    // ملاحظة: الـ Server Action يجب أن يتعامل مع الـ FormData
    
    try {
      if (editingService) {
        await updateService(editingService._id, formData);
      } else {
        await createService(formData);
      }
      await loadServices();
      setIsModalOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      alert('حدث خطأ أثناء حفظ الخدمة');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      try {
        await deleteService(id);
        await loadServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setSelectedIcon(service.icon);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingService(null);
    setSelectedIcon('💻');
    setIsModalOpen(true);
  };

  // تصفية الخدمات
  const filteredServices = services.filter(service => 
    service.nameAr.includes(searchQuery) || service.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="بحث في الخدمات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
        <button
          onClick={openAddModal}
          className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
        >
          <span>+</span> إضافة خدمة
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-bold">
                <tr>
                <th className="p-5">الصورة/الأيقونة</th>
                <th className="p-5">اسم الخدمة (عربي)</th>
                <th className="p-5">اسم الخدمة (إنجليزي)</th>
                <th className="p-5">الوصف</th>
                <th className="p-5">الحالة</th>
                <th className="p-5 text-center">الإجراءات</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredServices.map((service) => (
                <tr key={service._id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="p-5">
                        {service.image ? (
                          <img 
                            src={service.image} 
                            alt={service.nameAr}
                            className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                          />
                        ) : (
                          <span className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-3xl">
                            {service.icon}
                          </span>
                        )}
                    </td>
                    <td className="p-5 font-bold text-slate-800">{service.nameAr}</td>
                    <td className="p-5 font-medium text-slate-600">{service.nameEn}</td>
                    <td className="p-5">
                        <p className="text-sm text-slate-500 line-clamp-2 max-w-xs" title={service.descriptionAr}>
                            {service.descriptionAr}
                        </p>
                    </td>
                    <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            service.isActive 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                            {service.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                    </td>
                    <td className="p-5">
                        <div className="flex justify-center gap-2 opacity-100 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => openEditModal(service)}
                                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                                title="تعديل"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => handleDelete(service._id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                                title="حذف"
                            >
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            {filteredServices.length === 0 && (
                <div className="p-10 text-center text-slate-400">
                    لا توجد خدمات مضافة حتى الآن.
                </div>
            )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* الاسم */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الاسم (عربي)</label>
                    <input
                      type="text"
                      name="nameAr"
                      defaultValue={editingService?.nameAr}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="تطوير المواقع"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الاسم (إنجليزي)</label>
                    <input
                      type="text"
                      name="nameEn"
                      defaultValue={editingService?.nameEn}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-left"
                      placeholder="Web Development"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* الوصف */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الوصف (عربي)</label>
                    <textarea
                      name="descriptionAr"
                      defaultValue={editingService?.descriptionAr}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                      placeholder="وصف مختصر للخدمة..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الوصف (إنجليزي)</label>
                    <textarea
                      name="descriptionEn"
                      defaultValue={editingService?.descriptionEn}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none text-left"
                      placeholder="Short description..."
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* الأيقونة والحالة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <IconPicker
                      value={selectedIcon}
                      onChange={setSelectedIcon}
                      name="icon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الحالة</label>
                    <select
                      name="isActive"
                      defaultValue={editingService?.isActive?.toString()}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
                    >
                      <option value="true">نشط</option>
                      <option value="false">غير نشط</option>
                    </select>
                  </div>
                </div>

                {/* صورة الخدمة */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">صورة الخدمة</label>
                  <div className="space-y-3">
                    {/* رابط الصورة */}
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">رابط الصورة من الإنترنت</label>
                      <input
                        type="url"
                        name="imageUrl"
                        defaultValue={editingService?.image}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="https://example.com/image.jpg"
                        dir="ltr"
                      />
                    </div>
                    
                    {/* أو تحميل صورة */}
                    <div className="relative">
                      <label className="block text-xs text-slate-500 mb-1">أو تحميل صورة</label>
                      <input
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-slate-400 mt-1">الحد الأقصى: 5MB</p>
                    </div>

                    {/* معاينة الصورة الحالية */}
                    {editingService?.image && (
                      <div className="mt-3">
                        <p className="text-xs text-slate-500 mb-2">الصورة الحالية:</p>
                        <img 
                          src={editingService.image} 
                          alt="Service preview" 
                          className="w-full h-48 object-cover rounded-xl border border-slate-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2"
                  >
                    {loading ? (
                        <>
                         <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                         جاري الحفظ...
                        </>
                    ) : (
                        'حفظ البيانات'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}