import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isSupabaseConfigured) {
      // Mock login for preview
      if (email === 'admin@admin.com' && password === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('بيانات الدخول غير صحيحة (جرب admin@admin.com / admin)');
      }
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="w-16 h-16 bg-medical-50 text-medical-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">لوحة التحكم</h1>
        <p className="text-center text-slate-500 mb-8">تسجيل الدخول للمشرف</p>

        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 bg-amber-50 text-amber-800 text-sm rounded-xl border border-amber-200 text-center">
            تنبيه: قاعدة البيانات السحابية (Supabase) غير متصلة. 
            يمكنك الدخول بوضع المعاينة (الايميل: admin@admin.com, كلمة المرور: admin)
          </div>
        )}

        {isSupabaseConfigured && (
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-emerald-50 text-emerald-800 text-sm rounded-xl border border-emerald-200 text-center flex flex-col items-center gap-1">
              <span className="font-bold flex items-center gap-1">
                🟢 متصل بقاعدة بيانات Supabase بنجاح!
              </span>
              <span className="text-xs text-emerald-600">
                تم تفعيل الاتصال الحقيقي وقاعدة البيانات جاهزة للعمل ومحمية.
              </span>
            </div>

            <div className="p-4 bg-blue-50/80 text-blue-900 text-xs rounded-xl border border-blue-200 leading-relaxed text-right" dir="rtl">
              <h4 className="font-bold text-sm text-blue-950 mb-1">💡 هل يظهر لك خطأ المفتاح السري (Secret Key)؟</h4>
              <p className="mb-2">
                إذا ظهرت لك رسالة <code className="bg-blue-100/80 px-1 py-0.5 rounded text-blue-950 font-mono">Forbidden use of secret API key...</code> عند محاولة تسجيل الدخول، فهذا يعني أنك استخدمت مفتاح الخدمة السري <strong>(service_role)</strong> بدلاً من المفتاح العام.
              </p>
              <h5 className="font-bold mb-1">طريقة الحل السريعة:</h5>
              <ol className="list-decimal list-inside space-y-1 text-blue-800">
                <li>اذهب إلى لوحة تحكم <strong>Supabase</strong> الخاصة بك ثم <strong>Project Settings</strong> ثم <strong>API</strong>.</li>
                <li>انسخ المفتاح المكتوب تحته <strong className="text-blue-950">anon (public)</strong>.</li>
                <li>افتح قائمة <strong>Settings</strong> في AI Studio ثم اذهب إلى <strong>Secrets</strong>.</li>
                <li>استبدل قيمة <code className="bg-blue-100/80 px-1 py-0.5 rounded text-blue-950 font-mono">VITE_SUPABASE_ANON_KEY</code> بالمفتاح العام الذي نسخته واحفظ التغييرات.</li>
              </ol>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 transition-all text-left"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 transition-all text-left"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-colors disabled:opacity-70"
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
