import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_PROJECTS } from '../data/mock';
import { ArrowRight, CheckCircle2, Video, FileText, Image as ImageIcon } from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const isUuid = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      if (!isSupabaseConfigured || !isUuid) {
        setProject(MOCK_PROJECTS.find(p => p.id === id) || null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase!.from('projects').select('*').eq('id', id).single();
        if (error) throw error;
        setProject(data as Project);
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(MOCK_PROJECTS.find(p => p.id === id) || null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500">جاري التحميل...</div>;
  if (!project) return <div className="p-12 text-center text-slate-500">لم يتم العثور على المشروع</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/projects" className="inline-flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-colors mb-8 font-medium">
        <ArrowRight className="w-5 h-5" />
        العودة للأعمال
      </Link>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold">
            {project.category}
          </span>
          {project.date && <span className="text-slate-400 text-sm font-medium">{project.date}</span>}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{project.title}</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-12">{project.description}</p>

        {project.services && project.services.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-medical-500" />
              الخدمات المقدمة في هذا المشروع
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.services.map((service, idx) => (
                <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium">
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.images && project.images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-medical-500" />
              معرض الصور والتصميمات
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.images.map((img, idx) => (
                <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-100 group">
                  <img src={img} alt={`${project.title} - ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {project.videos && project.videos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Video className="w-6 h-6 text-medical-500" />
              فيديوهات و Reels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.videos.map((vid, idx) => {
                const isPlayable = vid.startsWith('data:video') || vid.includes('.mp4') || vid.includes('.webm') || vid.includes('.ogg');
                return isPlayable ? (
                  <div key={idx} className="aspect-[9/16] bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 shadow-sm">
                    <video 
                      src={vid} 
                      controls 
                      className="w-full h-full object-cover" 
                      preload="metadata"
                      playsInline
                    />
                  </div>
                ) : (
                  <a key={idx} href={vid} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center aspect-[9/16] bg-slate-900 rounded-xl overflow-hidden group relative p-4 text-center">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                    <Video className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all z-20 mb-2" />
                    <span className="text-white text-xs font-semibold z-20 bg-medical-600 hover:bg-medical-700 px-3 py-1.5 rounded-full transition-colors shadow-md">
                      مشاهدة الفيديو الخارجي
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {project.copywriting_samples && project.copywriting_samples.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-medical-500" />
              نماذج كتابة المحتوى
            </h2>
            <div className="space-y-4">
              {project.copywriting_samples.map((sample, idx) => (
                <div key={idx} className="bg-medical-50/50 border border-medical-100 p-6 rounded-2xl">
                  <h3 className="font-bold text-medical-900 mb-3">{sample.title}</h3>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{sample.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
