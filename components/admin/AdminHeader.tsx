import { getUserSite } from '@/lib/actions/site';
import Link from 'next/link';

export default async function AdminHeader() {
  const siteRes = await getUserSite();
  const site = siteRes.success ? siteRes.data : null;

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>
        {site && (
          <p className="text-sm text-slate-500 mt-1">{site.nameAr}</p>
        )}
      </div>
      
      {site && (
        <Link
          href={`/s/${site.slug}`}
          target="_blank"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition"
        >
          <span>🌐</span>
          <span>عرض الموقع</span>
        </Link>
      )}
    </div>
  );
}
