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
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 text-sm rounded-xl border border-emerald-200 text-center flex flex-col items-center gap-1">
            <span className="font-bold flex items-center gap-1">
              🟢 متصل بقاعدة بيانات Supabase بنجاح!
            </span>
            <span className="text-xs text-emerald-600">
              تم تفعيل الاتصال الحقيقي وقاعدة البيانات جاهزة للعمل ومحمية.
            </span>
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
