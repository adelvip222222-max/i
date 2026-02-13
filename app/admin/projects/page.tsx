'use client';

import { useState, useEffect } from 'react';
import { getAllProjects, createProject, updateProject, deleteProject } from '@/lib/actions/projects';
import Link from 'next/link';

export const runtime = 'nodejs';

interface Project {
  _id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  category: string;
  client?: string;
  date?: string;
  url?: string;
  isActive: boolean;
  order: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const result = await getAllProjects();
      if (result && result.data) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingProject) {
        await updateProject(editingProject._id, formData);
      } else {
        await createProject(formData);
      }
      await loadProjects();
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('حدث خطأ أثناء حفظ المشروع');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      try {
        await deleteProject(id);
        await loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const filteredProjects = projects.filter(project => 
    project.titleAr.includes(searchQuery) || project.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="بحث في المشاريع..."
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
          <span>+</span> إضافة مشروع
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-lg transition-all">
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
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  project.isActive 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {project.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{project.titleAr}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.descriptionAr}</p>
              
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                  {project.category}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Link
                  href={`/admin/projects/${project._id}`}
                  className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition text-center font-bold text-sm"
                >
                  تفاصيل
                </Link>
                <button
                  onClick={() => openEditModal(project)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition font-bold text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition font-bold text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📁</div>
          <p className="text-slate-400 text-lg">لا توجد مشاريع مضافة حتى الآن</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-800">
                {editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">العنوان (عربي)</label>
                    <input
                      type="text"
                      name="titleAr"
                      defaultValue={editingProject?.titleAr}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="مشروع تطوير موقع"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">العنوان (إنجليزي)</label>
                    <input
                      type="text"
                      name="titleEn"
                      defaultValue={editingProject?.titleEn}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-left"
                      placeholder="Website Development"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الوصف (عربي)</label>
                    <textarea
                      name="descriptionAr"
                      defaultValue={editingProject?.descriptionAr}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                      placeholder="وصف المشروع..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الوصف (إنجليزي)</label>
                    <textarea
                      name="descriptionEn"
                      defaultValue={editingProject?.descriptionEn}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none text-left"
                      placeholder="Project description..."
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">رابط الصورة</label>
                  <input
                    type="url"
                    name="image"
                    defaultValue={editingProject?.image}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="https://example.com/image.jpg"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">التصنيف</label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={editingProject?.category}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="تطوير ويب"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">العميل (اختياري)</label>
                    <input
                      type="text"
                      name="client"
                      defaultValue={editingProject?.client}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="اسم العميل"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">التاريخ (اختياري)</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={editingProject?.date ? new Date(editingProject.date).toISOString().split('T')[0] : ''}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">رابط المشروع (اختياري)</label>
                    <input
                      type="url"
                      name="url"
                      defaultValue={editingProject?.url}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="https://project.com"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الترتيب</label>
                    <input
                      type="number"
                      name="order"
                      defaultValue={editingProject?.order || 0}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الحالة</label>
                    <select
                      name="isActive"
                      defaultValue={editingProject?.isActive?.toString()}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
                    >
                      <option value="true">نشط</option>
                      <option value="false">غير نشط</option>
                    </select>
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
