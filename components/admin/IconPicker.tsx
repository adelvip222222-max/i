'use client';

import { useState } from 'react';

// قائمة الأيقونات الجاهزة
const PRESET_ICONS = [
  { emoji: '💻', name: 'كمبيوتر' },
  { emoji: '📱', name: 'موبايل' },
  { emoji: '🎨', name: 'تصميم' },
  { emoji: '🚀', name: 'صاروخ' },
  { emoji: '⚡', name: 'سرعة' },
  { emoji: '🔧', name: 'أدوات' },
  { emoji: '🛠️', name: 'صيانة' },
  { emoji: '📊', name: 'تحليلات' },
  { emoji: '📈', name: 'نمو' },
  { emoji: '🎯', name: 'هدف' },
  { emoji: '💡', name: 'فكرة' },
  { emoji: '🌐', name: 'ويب' },
  { emoji: '☁️', name: 'سحابة' },
  { emoji: '🔒', name: 'أمان' },
  { emoji: '📷', name: 'كاميرا' },
  { emoji: '🎬', name: 'فيديو' },
  { emoji: '🎵', name: 'موسيقى' },
  { emoji: '📝', name: 'كتابة' },
  { emoji: '✉️', name: 'بريد' },
  { emoji: '🔔', name: 'إشعارات' },
  { emoji: '⚙️', name: 'إعدادات' },
  { emoji: '🎓', name: 'تعليم' },
  { emoji: '💼', name: 'أعمال' },
  { emoji: '🏆', name: 'إنجاز' },
  { emoji: '🌟', name: 'نجمة' },
  { emoji: '🔥', name: 'نار' },
  { emoji: '💎', name: 'ماسة' },
  { emoji: '🎁', name: 'هدية' },
  { emoji: '📦', name: 'صندوق' },
  { emoji: '🔍', name: 'بحث' },
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  name?: string;
}

export default function IconPicker({ value, onChange, name = 'icon' }: IconPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [customIcon, setCustomIcon] = useState('');
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  const handleSelectIcon = (icon: string) => {
    onChange(icon);
    setShowPicker(false);
  };

  const handleCustomIconSubmit = () => {
    if (customIcon.trim()) {
      onChange(customIcon.trim());
      setCustomIcon('');
      setShowPicker(false);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        الأيقونة
      </label>
      
      {/* عرض الأيقونة المختارة */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center justify-center w-16 h-16 text-4xl bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-lg transition"
        >
          {value || '❓'}
        </button>
        
        <div className="flex-1">
          <input
            type="text"
            name={name}
            value={value}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
            placeholder="اختر أيقونة"
          />
          <p className="text-xs text-gray-500 mt-1">
            انقر على المربع لاختيار أيقونة
          </p>
        </div>
      </div>

      {/* نافذة اختيار الأيقونة */}
      {showPicker && (
        <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4">
          {/* التبويبات */}
          <div className="flex gap-2 mb-4 border-b">
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'preset'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              أيقونات جاهزة
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 font-medium transition ${
                activeTab === 'custom'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              أيقونة مخصصة
            </button>
          </div>

          {/* محتوى التبويبات */}
          {activeTab === 'preset' ? (
            <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
              {PRESET_ICONS.map((icon) => (
                <button
                  key={icon.emoji}
                  type="button"
                  onClick={() => handleSelectIcon(icon.emoji)}
                  className={`p-3 text-3xl hover:bg-blue-50 rounded-lg transition border-2 ${
                    value === icon.emoji
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent'
                  }`}
                  title={icon.name}
                >
                  {icon.emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                أدخل أي رمز تعبيري (emoji) أو نص
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  placeholder="مثال: 🎉 أو SVG"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCustomIconSubmit();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleCustomIconSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  إضافة
                </button>
              </div>
              {customIcon && (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-4xl mb-2">{customIcon}</div>
                  <p className="text-xs text-gray-500">معاينة</p>
                </div>
              )}
            </div>
          )}

          {/* زر الإغلاق */}
          <button
            type="button"
            onClick={() => setShowPicker(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
          >
            إغلاق
          </button>
        </div>
      )}
    </div>
  );
}
