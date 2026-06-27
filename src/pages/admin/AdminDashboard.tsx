import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { LogOut, Settings, Plus, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase!.auth.signOut();
    }
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-medical-100 text-medical-700 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">لوحة التحكم</h1>
            <p className="text-slate-500 text-sm">إدارة محتوى الموقع</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-8 p-6 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200">
          <h2 className="font-bold text-lg mb-2">وضع المعاينة (Mock Mode)</h2>
          <p>أنت حالياً في وضع المعاينة لأن مفاتيح Supabase غير موجودة. لتفعيل إضافة وتعديل البيانات فعلياً، قم بإضافة <code>VITE_SUPABASE_URL</code> و <code>VITE_SUPABASE_ANON_KEY</code> في إعدادات البيئة (Secrets).</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-slate-800">الأعمال والمشاريع</h2>
            <button onClick={() => navigate('/admin/projects/new')} className="w-10 h-10 bg-medical-50 text-medical-600 rounded-full flex items-center justify-center hover:bg-medical-100 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-500 mb-6 text-sm">إضافة مشاريع جديدة وعرض المشاريع الحالية</p>
          <button onClick={() => navigate('/admin/projects')} className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors">
            إدارة الأعمال
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-slate-800">نماذج المحتوى</h2>
            <button onClick={() => navigate('/admin/content/new')} className="w-10 h-10 bg-medical-50 text-medical-600 rounded-full flex items-center justify-center hover:bg-medical-100 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-500 mb-6 text-sm">إضافة نماذج للبوستات ونصوص الفيديوهات</p>
          <button onClick={() => navigate('/admin/content')} className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors">
            إدارة المحتوى
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-slate-800">الإعدادات العامة</h2>
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
          </div>
          <p className="text-slate-500 mb-6 text-sm">تعديل المعلومات الأساسية والنبذة الشخصية</p>
          <button onClick={() => navigate('/admin/settings')} className="w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors">
            فتح الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
}
