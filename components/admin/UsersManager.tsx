'use client';

import { useState } from 'react';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  isActive: boolean;
  postCount: number;
  createdAt: string;
}

interface UsersManagerProps {
  initialUsers: User[];
}

export default function UsersManager({ initialUsers }: UsersManagerProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // دالة تغيير الحالة (محاكاة)
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    // هنا يتم استدعاء Server Action
    // const res = await updateStatus(userId, !currentStatus);
    
    // تحديث الحالة محلياً للمعاينة
    setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
  };

  const deleteUser = async (userId: string) => {
    if(!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    setUsers(users.filter(u => u._id !== userId));
  };

  // تصفية المستخدمين
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilter = 
      filter === 'all' ? true : 
      filter === 'active' ? user.isActive : !user.isActive;
      
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Controls Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="بحث عن مستخدم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['all', 'active', 'inactive'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f as any)}
               className={`px-6 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                 filter === f 
                 ? 'bg-slate-900 text-white shadow-md' 
                 : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
               }`}
             >
               {f === 'all' ? 'الكل' : f === 'active' ? 'نشط' : 'محظور'}
             </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden group">
            {/* Active Status Strip */}
            <div className={`absolute top-0 right-0 w-full h-1.5 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            
            <div className="flex items-start justify-between mb-4 mt-2">
               <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 border-2 border-white shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{user.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{user.email}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div className="text-center">
                 <p className="text-xs text-slate-500 mb-1">تاريخ التسجيل</p>
                 <p className="font-semibold text-slate-700">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</p>
               </div>
               <div className="text-center border-r border-slate-200">
                 <p className="text-xs text-slate-500 mb-1">المنشورات</p>
                 <p className="font-semibold text-blue-600">{user.postCount}</p>
               </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => toggleUserStatus(user._id, user.isActive)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  user.isActive 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {user.isActive ? '🚫 حظر' : '✅ تفعيل'}
              </button>
              <button 
                onClick={() => deleteUser(user._id)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}