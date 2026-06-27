import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { ContentSample } from '../../types';
import { MOCK_SAMPLES } from '../../data/mock';
import { ArrowRight, Plus, Trash2, Edit } from 'lucide-react';

export default function ManageContent() {
  const navigate = useNavigate();
  const [samples, setSamples] = useState<ContentSample[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const isNewRoute = window.location.pathname.endsWith('/new');
  const [isEditing, setIsEditing] = useState(isNewRoute);
  const [currentSample, setCurrentSample] = useState<Partial<ContentSample>>({});

  useEffect(() => {
    fetchSamples();
  }, []);

  async function fetchSamples() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setSamples(MOCK_SAMPLES);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase!.from('content_samples').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setSamples(data as ContentSample[] || []);
    } catch (error) {
      console.error('Error fetching samples:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا النموذج؟')) return;

    if (!isSupabaseConfigured) {
      setSamples(samples.filter(s => s.id !== id));
      return;
    }

    try {
      const { error } = await supabase!.from('content_samples').delete().eq('id', id);
      if (error) throw error;
      setSamples(samples.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting sample:', error);
      alert('فشل في حذف النموذج');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      if (currentSample.id) {
        setSamples(samples.map(s => s.id === currentSample.id ? { ...s, ...currentSample } as ContentSample : s));
      } else {
        const newSample = { ...currentSample, id: Date.now().toString() } as ContentSample;
        setSamples([newSample, ...samples]);
      }
      setIsEditing(false);
      setCurrentSample({});
      return;
    }

    try {
      if (currentSample.id) {
        const { error } = await supabase!.from('content_samples').update(currentSample).eq('id', currentSample.id);
        if (error) throw error;
      } else {
        const { error } = await supabase!.from('content_samples').insert([currentSample]);
        if (error) throw error;
      }
      fetchSamples();
      setIsEditing(false);
      setCurrentSample({});
    } catch (error) {
      console.error('Error saving sample:', error);
      alert('فشل في حفظ النموذج');
    }
  };

  const openEditor = (sample?: ContentSample) => {
    if (sample) {
      setCurrentSample(sample);
    } else {
      setCurrentSample({
        title: '',
        type: '',
        content: '',
      });
    }
    setIsEditing(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/admin/dashboard')} 
        className="flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-colors mb-8 font-medium"
      >
        <ArrowRight className="w-5 h-5" />
        العودة للوحة التحكم
      </button>

      {isEditing ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{currentSample.id ? 'تعديل النموذج' : 'إضافة نموذج جديد'}</h2>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">عنوان النموذج</label>
              <input 
                type="text" 
                required 
                value={currentSample.title || ''} 
                onChange={e => setCurrentSample({...currentSample, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">نوع المحتوى</label>
              <input 
                type="text" 
                required 
                placeholder="مثال: بوست طبي، سكريبت Reel"
                value={currentSample.type || ''} 
                onChange={e => setCurrentSample({...currentSample, type: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">النص التعريفي / المحتوى</label>
              <textarea 
                required 
                rows={8}
                value={currentSample.content || ''} 
                onChange={e => setCurrentSample({...currentSample, content: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 resize-none" 
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                className="px-6 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-colors"
              >
                حفظ النموذج
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">إدارة نماذج المحتوى</h1>
              <p className="text-slate-500">أضف نصوص تسويقية وأمثلة لأعمالك الكتابية</p>
            </div>
            <button 
              onClick={() => openEditor()}
              className="flex items-center gap-2 px-6 py-3 bg-medical-600 text-white rounded-xl font-medium hover:bg-medical-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              إضافة نموذج
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">جاري التحميل...</div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">العنوان</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">النوع</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">المحتوى</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {samples.map((sample) => (
                      <tr key={sample.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{sample.title}</td>
                        <td className="px-6 py-4">
                          <span className="bg-medical-50 text-medical-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                            {sample.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-500 line-clamp-2 max-w-sm">{sample.content}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openEditor(sample)}
                              className="p-2 text-slate-400 hover:text-medical-600 bg-white border border-slate-200 rounded-lg hover:border-medical-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(sample.id)}
                              className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-lg hover:border-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {samples.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                          لا توجد نماذج مضافة حتى الآن
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
