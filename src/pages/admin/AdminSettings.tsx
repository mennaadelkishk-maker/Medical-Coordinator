import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Save } from 'lucide-react';

export default function AdminSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'منه الله عادل كشك',
    title: 'منسقة عيادات طبية & مسوقة رقمية',
    bio: 'أساعد العيادات الطبية في إدارة وتنسيق أعمالهم، بالإضافة إلى بناء حضور رقمي قوي من خلال صناعة محتوى متخصص وإدارة الحملات التسويقية.',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real implementation with DB:
    // await supabase.from('settings').upsert(settings)
    
    // For now we'll just mock a delay and show an alert
    setTimeout(() => {
      setLoading(false);
      alert('تم حفظ الإعدادات بنجاح (وضع المعاينة)');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/admin/dashboard')} 
        className="flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-colors mb-8 font-medium"
      >
        <ArrowRight className="w-5 h-5" />
        العودة للوحة التحكم
      </button>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="mb-8 border-b border-slate-100 pb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">الإعدادات العامة</h1>
          <p className="text-slate-500">تعديل المعلومات الأساسية والنبذة الشخصية</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">المعلومات الشخصية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">الاسم</label>
                <input 
                  type="text" 
                  value={settings.siteName} 
                  onChange={e => setSettings({...settings, siteName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">المسمى الوظيفي</label>
                <input 
                  type="text" 
                  value={settings.title} 
                  onChange={e => setSettings({...settings, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">النبذة المختصرة (تظهر في الصفحة الرئيسية)</label>
              <textarea 
                rows={4}
                value={settings.bio} 
                onChange={e => setSettings({...settings, bio: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 resize-none" 
              />
            </div>
          </div>

          <div className="pt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-colors disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
