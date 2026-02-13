'use client';

import { useState } from 'react';
import { updateContactInfo, updateSocialLink, createSocialLink, deleteSocialLink } from '@/lib/actions/settings';

interface ContactInfo {
  _id?: string;
  phone: string;
  email: string;
  address: string;
}

interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

interface SettingsManagerProps {
  initialContactInfo: ContactInfo | null;
  initialSocialLinks: SocialLink[];
}

const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'فيسبوك', icon: '📘', color: 'bg-blue-50 text-blue-600' },
  { value: 'twitter', label: 'تويتر', icon: '🐦', color: 'bg-sky-50 text-sky-600' },
  { value: 'instagram', label: 'انستغرام', icon: '📷', color: 'bg-pink-50 text-pink-600' },
  { value: 'linkedin', label: 'لينكد إن', icon: '💼', color: 'bg-blue-50 text-blue-700' },
  { value: 'youtube', label: 'يوتيوب', icon: '📺', color: 'bg-red-50 text-red-600' },
  { value: 'whatsapp', label: 'واتساب', icon: '💬', color: 'bg-green-50 text-green-600' },
  { value: 'telegram', label: 'تيليجرام', icon: '✈️', color: 'bg-blue-50 text-blue-500' },
  { value: 'tiktok', label: 'تيك توك', icon: '🎵', color: 'bg-slate-50 text-slate-800' },
];

export default function SettingsManager({ initialContactInfo, initialSocialLinks }: SettingsManagerProps) {
  const [contactInfo, setContactInfo] = useState(initialContactInfo);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks);
  
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getPlatformInfo = (platform: string) => {
    return SOCIAL_PLATFORMS.find(p => p.value === platform) || SOCIAL_PLATFORMS[0];
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await updateContactInfo(formData);
      
      if (result.success) {
        setContactInfo(result.data);
        setIsEditingContact(false);
        setMessage({ type: 'success', text: 'تم حفظ معلومات الاتصال بنجاح' });
      } else {
        setMessage({ type: 'error', text: result.error || 'فشل في حفظ البيانات' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ غير متوقع' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLinkUpdate = async (linkId: string, url: string) => {
    setLoading(true);
    setMessage(null);
    
    const formData = new FormData();
    formData.append('url', url);
    formData.append('isActive', 'true');
    
    try {
      const result = await updateSocialLink(linkId, formData);
      
      if (result.success) {
        setSocialLinks(socialLinks.map(link => 
          link._id === linkId ? result.data : link
        ));
        setEditingLinkId(null);
        setMessage({ type: 'success', text: 'تم تحديث الرابط بنجاح' });
      } else {
        setMessage({ type: 'error', text: result.error || 'فشل في تحديث الرابط' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ غير متوقع' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewLink = async () => {
    if (!selectedPlatform || !newLinkUrl) {
      setMessage({ type: 'error', text: 'يرجى اختيار المنصة وإدخال الرابط' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await createSocialLink(selectedPlatform, newLinkUrl);
      
      if (result.success) {
        setSocialLinks([...socialLinks, result.data]);
        setShowAddModal(false);
        setSelectedPlatform('');
        setNewLinkUrl('');
        setMessage({ type: 'success', text: 'تم إضافة الرابط بنجاح' });
      } else {
        setMessage({ type: 'error', text: result.error || 'فشل في إضافة الرابط' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ غير متوقع' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرابط؟')) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await deleteSocialLink(linkId);
      
      if (result.success) {
        setSocialLinks(socialLinks.filter(link => link._id !== linkId));
        setMessage({ type: 'success', text: 'تم حذف الرابط بنجاح' });
      } else {
        setMessage({ type: 'error', text: result.error || 'فشل في حذف الرابط' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ غير متوقع' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contact Information Card */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">📞</span>
              معلومات الاتصال
            </h2>
            <button
              onClick={() => setIsEditingContact(!isEditingContact)}
              className={`text-sm font-bold px-4 py-2 rounded-lg transition ${
                  isEditingContact 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {isEditingContact ? 'إلغاء' : 'تعديل ✏️'}
            </button>
          </div>

          {isEditingContact ? (
            <form onSubmit={handleContactSubmit} className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف</label>
                <input 
                  type="text" 
                  name="phone" 
                  defaultValue={contactInfo?.phone} 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={contactInfo?.email} 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">العنوان</label>
                <input 
                  type="text" 
                  name="address" 
                  defaultValue={contactInfo?.address} 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-blue-600 transition shadow-lg flex justify-center gap-2 items-center disabled:opacity-50"
              >
                 {loading && <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>}
                 {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
                 <span className="text-2xl">📱</span> 
                 <div>
                    <p className="text-xs text-slate-500 font-bold mb-1">الهاتف</p>
                    <p className="font-medium text-slate-800" dir="ltr">{contactInfo?.phone}</p>
                 </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
                 <span className="text-2xl">✉️</span> 
                 <div>
                    <p className="text-xs text-slate-500 font-bold mb-1">البريد</p>
                    <p className="font-medium text-slate-800">{contactInfo?.email}</p>
                 </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
                 <span className="text-2xl">📍</span> 
                 <div>
                    <p className="text-xs text-slate-500 font-bold mb-1">العنوان</p>
                    <p className="font-medium text-slate-800">{contactInfo?.address}</p>
                 </div>
               </div>
            </div>
          )}
        </section>

        {/* Social Links Card */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg">🔗</span>
              روابط التواصل
            </h2>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="text-sm font-bold px-4 py-2 rounded-lg transition bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            >
               + إضافة رابط
            </button>
          </div>

          <div className="space-y-3">
              {socialLinks.map((link) => {
                const platformInfo = getPlatformInfo(link.platform);
                const isEditing = editingLinkId === link._id;
                
                return (
                  <div key={link._id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm text-xl ${platformInfo.color}`}>
                          {platformInfo.icon}
                      </div>
                      <div className="flex-1 overflow-hidden">
                          <p className="text-xs text-slate-500 font-bold mb-1">{platformInfo.label}</p>
                          {isEditing ? (
                            <div className="flex gap-2">
                              <input 
                                  type="url" 
                                  defaultValue={link.url}
                                  id={`link-${link._id}`}
                                  className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                  placeholder="https://..."
                              />
                              <button
                                onClick={() => {
                                  const input = document.getElementById(`link-${link._id}`) as HTMLInputElement;
                                  handleSocialLinkUpdate(link._id, input.value);
                                }}
                                className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                              >
                                حفظ
                              </button>
                            </div>
                          ) : (
                              <a href={link.url} target="_blank" className="text-sm text-indigo-600 truncate block hover:underline">{link.url}</a>
                          )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingLinkId(isEditing ? null : link._id)}
                          className="text-slate-400 hover:text-indigo-600 transition"
                        >
                          {isEditing ? '✕' : '✏️'}
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link._id)}
                          className="text-slate-400 hover:text-red-600 transition"
                        >
                          🗑️
                        </button>
                      </div>
                  </div>
                );
              })}
              
              {socialLinks.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  لا توجد روابط تواصل اجتماعي
                </div>
              )}
          </div>
        </section>
      </div>

      {/* Add New Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">إضافة رابط تواصل</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">اختر المنصة</label>
                <div className="grid grid-cols-2 gap-3">
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => setSelectedPlatform(platform.value)}
                      className={`p-3 rounded-xl border-2 transition flex items-center gap-2 ${
                        selectedPlatform === platform.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-sm font-medium">{platform.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الرابط</label>
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddNewLink}
                  disabled={loading || !selectedPlatform || !newLinkUrl}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري الإضافة...' : 'إضافة'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
