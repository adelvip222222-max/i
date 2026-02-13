'use client';

import { useState } from 'react';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface MessagesManagerProps {
  initialMessages: Message[];
}

export default function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

  const markAsRead = async (messageId: string) => {
    // محاكاة الاتصال بالسيرفر
    setMessages(messages.map(msg => 
      msg._id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    setMessages(messages.filter(msg => msg._id !== messageId));
  };

  const filteredMessages = messages.filter(msg => {
     if (filter === 'read') return msg.isRead;
     if (filter === 'unread') return !msg.isRead;
     return true;
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-1">
         {['all', 'unread', 'read'].map((f) => (
           <button
             key={f}
             onClick={() => setFilter(f as any)}
             className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
               filter === f 
               ? 'bg-white text-blue-600 shadow-sm' 
               : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
             }`}
           >
             {f === 'all' ? 'الكل' : f === 'unread' ? 'غير مقروء' : 'مقروء'}
           </button>
         ))}
      </div>

      {/* Messages List */}
      <div className="divide-y divide-slate-50 flex-1 overflow-y-auto">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <span className="text-4xl mb-2">📭</span>
            <p>لا توجد رسائل في هذا التصنيف</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div 
              key={msg._id} 
              className={`p-6 hover:bg-slate-50 transition-colors group relative ${!msg.isRead ? 'bg-blue-50/20' : ''}`}
            >
               {/* Read Status Indicator */}
               {!msg.isRead && <span className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500"></span>}

               <div className="flex flex-col md:flex-row justify-between gap-4 mb-3">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${!msg.isRead ? 'bg-blue-600 text-white shadow-blue-500/30 shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                     {msg.name.charAt(0)}
                   </div>
                   <div>
                     <h3 className={`text-base ${!msg.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                       {msg.name}
                     </h3>
                     <p className="text-xs text-slate-500">{msg.email}</p>
                   </div>
                 </div>
                 <div className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded self-start">
                   {new Date(msg.createdAt).toLocaleString('ar-EG')}
                 </div>
               </div>

               <div className="md:pr-14">
                 <p className="text-slate-600 leading-relaxed text-sm bg-white border border-slate-100 p-4 rounded-xl rounded-tr-none shadow-sm">
                   {msg.message}
                 </p>
                 
                 {/* Quick Actions */}
                 <div className="flex gap-3 mt-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                   <a 
                     href={`mailto:${msg.email}`} 
                     className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition flex items-center gap-1"
                   >
                     <span>📧</span> رد عبر البريد
                   </a>
                   {!msg.isRead && (
                     <button 
                       onClick={() => markAsRead(msg._id)}
                       className="text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition flex items-center gap-1"
                     >
                       <span>✓</span> قراءة
                     </button>
                   )}
                   <button 
                     onClick={() => deleteMessage(msg._id)}
                     className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition mr-auto flex items-center gap-1"
                   >
                     <span>🗑️</span> حذف
                   </button>
                 </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}