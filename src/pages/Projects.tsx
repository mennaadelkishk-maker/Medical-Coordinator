import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_PROJECTS } from '../data/mock';
import { motion } from 'motion/react';
import { FolderHeart } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      if (!isSupabaseConfigured) {
        setProjects(MOCK_PROJECTS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase!.from('projects').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setProjects(data as Project[] || []);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        if (error?.code === '42P01') {
          setSchemaError('relation_not_found');
        } else {
          setSchemaError('connection_error');
        }
        setProjects(MOCK_PROJECTS); // Fallback on error
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">جاري التحميل...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {schemaError && (
        <div className="mb-8 p-6 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200 text-sm leading-relaxed" dir="rtl">
          <h3 className="font-bold text-base mb-2">💡 تنبيه إعداد قاعدة البيانات (Supabase)</h3>
          {schemaError === 'relation_not_found' ? (
            <p>
              تم الاتصال بـ Supabase بنجاح، ولكن لم يتم العثور على جدول المشاريع. 
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
        <h1 className="text-3xl font-bold text-slate-900 mb-4">معرض الأعمال</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          مجموعة من المشاريع التي قمت بتنفيذها .
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link to={`/projects/${project.id}`} className="group block h-full bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-medical-100/50 transition-all">
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                {project.images && project.images.length > 0 ? (
                  <img 
                    src={project.images[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <FolderHeart className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-medical-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {project.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-medical-600 transition-colors">{project.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-2">{project.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
