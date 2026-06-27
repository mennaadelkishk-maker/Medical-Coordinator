import { useState, useEffect } from 'react';
import { ContentSample } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_SAMPLES } from '../data/mock';
import { FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContentSamples() {
  const [samples, setSamples] = useState<ContentSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSamples() {
      if (!isSupabaseConfigured) {
        setSamples(MOCK_SAMPLES);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase!.from('content_samples').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setSamples(data as ContentSample[] || []);
      } catch (error: any) {
        console.error('Error fetching samples:', error);
        if (error?.code === '42P01') {
          setSchemaError('relation_not_found');
        } else {
          setSchemaError('connection_error');
        }
        setSamples(MOCK_SAMPLES);
      } finally {
        setLoading(false);
      }
    }

    fetchSamples();
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">جاري التحميل...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {schemaError && (
        <div className="mb-8 p-6 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200 text-sm leading-relaxed" dir="rtl">
          <h3 className="font-bold text-base mb-2">💡 تنبيه إعداد قاعدة البيانات (Supabase)</h3>
          {schemaError === 'relation_not_found' ? (
            <p>
              تم الاتصال بـ Supabase بنجاح، ولكن لم يتم العثور على جدول نماذج المحتوى. 
              يرجى نسخ الكود الموجود في ملف <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">supabase-schema.sql</code> وتشغيله في <strong>محرر SQL (SQL Editor)</strong> بداخل لوحة تحكم Supabase الخاصة بك لإنشاء الجداول والبيانات الأساسية.
            </p>
          ) : (
            <p>
              حدث خطأ أثناء الاتصال بقاعدة بيانات Supabase. يرجى التحقق من صحة مفاتيح الاتصال 
              <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">VITE_SUPABASE_URL</code> و 
              <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900">VITE_SUPABASE_ANON_KEY</code> في إعدادات البيئة (Secrets).
            </p>
          )}
          <p className="mt-2 text-xs text-amber-700">تم تفعيل وضع المعاينة التلقائي وعرض البيانات التجريبية حالياً لضمان استمرار عمل الموقع.</p>
        </div>
      )}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">نماذج كتابة المحتوى</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          مجموعة من النصوص التسويقية والطبية التي قمت بكتابتها للعيادات والحملات المختلفة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {samples.map((sample, index) => (
          <motion.div
            key={sample.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="h-full"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-100 h-full flex flex-col hover:shadow-xl hover:shadow-medical-100/50 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 group-hover:text-medical-600 transition-colors">
                  <FileText className="w-5 h-5 text-medical-500" />
                  {sample.title}
                </h3>
                <span className="bg-medical-50 text-medical-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap mr-3">
                  {sample.type}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap flex-grow">{sample.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
