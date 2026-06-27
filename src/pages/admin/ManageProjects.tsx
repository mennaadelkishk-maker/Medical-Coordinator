import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Project } from '../../types';
import { MOCK_PROJECTS } from '../../data/mock';
import { ArrowRight, Plus, Trash2, Edit, Image as ImageIcon, Video, CheckCircle2, Upload, Loader2 } from 'lucide-react';

const PRESET_IMAGES = [
  {
    title: 'عيادة أسنان',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'عيادة أطفال',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'تجميل وبشرة',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'صناعة محتوى تسويقي',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: 'كتابة محتوى طبي',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=60'
  }
];

export default function ManageProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Form input states
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');

  // Upload state (Image)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Upload state (Video)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [uploadVideoError, setUploadVideoError] = useState<string | null>(null);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

  // Form state
  const isNewRoute = window.location.pathname.endsWith('/new');
  const [isEditing, setIsEditing] = useState(isNewRoute);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى اختيار ملف صورة صالح (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('حجم الصورة كبير جداً، يرجى اختيار صورة أصغر من 10 ميجابايت');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
          addImageUrl(compressedBase64);
          setIsUploading(false);
        } else {
          addImageUrl(event.target?.result as string);
          setIsUploading(false);
        }
      };
      img.onerror = () => {
        setUploadError('حدث خطأ أثناء قراءة الصورة');
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('حدث خطأ أثناء تحميل الملف');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setUploadVideoError('يرجى اختيار ملف فيديو صالح (MP4, WebM, Ogg)');
      return;
    }

    // Limit to 25MB for smooth operation and upload
    if (file.size > 25 * 1024 * 1024) {
      setUploadVideoError('حجم الفيديو كبير جداً، يرجى اختيار ملف فيديو أصغر من 25 ميجابايت');
      return;
    }

    setIsUploadingVideo(true);
    setUploadVideoError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      addVideoUrl(base64Data);
      setIsUploadingVideo(false);
    };
    reader.onerror = () => {
      setUploadVideoError('حدث خطأ أثناء تحميل ملف الفيديو');
      setIsUploadingVideo(false);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processVideoFile(e.target.files[0]);
    }
  };

  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(true);
  };

  const handleVideoDragLeave = () => {
    setIsDraggingVideo(false);
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setProjects(MOCK_PROJECTS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase!.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data as Project[] || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;

    if (!isSupabaseConfigured) {
      setProjects(projects.filter(p => p.id !== id));
      return;
    }

    try {
      const { error } = await supabase!.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('فشل في حذف المشروع');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      if (currentProject.id) {
        setProjects(projects.map(p => p.id === currentProject.id ? { ...p, ...currentProject } as Project : p));
      } else {
        const newProject = { ...currentProject, id: Date.now().toString() } as Project;
        setProjects([newProject, ...projects]);
      }
      setIsEditing(false);
      setCurrentProject({});
      return;
    }

    try {
      if (currentProject.id) {
        const { error } = await supabase!.from('projects').update(currentProject).eq('id', currentProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase!.from('projects').insert([currentProject]);
        if (error) throw error;
      }
      fetchProjects();
      setIsEditing(false);
      setCurrentProject({});
    } catch (error) {
      console.error('Error saving project:', error);
      alert('فشل في حفظ المشروع');
    }
  };

  const addImageUrl = (url: string) => {
    if (!url.trim()) return;
    const currentImages = currentProject.images || [];
    if (!currentImages.includes(url.trim())) {
      setCurrentProject({
        ...currentProject,
        images: [...currentImages, url.trim()]
      });
    }
  };

  const removeImageUrl = (index: number) => {
    const currentImages = currentProject.images || [];
    setCurrentProject({
      ...currentProject,
      images: currentImages.filter((_, i) => i !== index)
    });
  };

  const addService = () => {
    if (!serviceInput.trim()) return;
    const currentServices = currentProject.services || [];
    if (!currentServices.includes(serviceInput.trim())) {
      setCurrentProject({
        ...currentProject,
        services: [...currentServices, serviceInput.trim()]
      });
    }
    setServiceInput('');
  };

  const removeService = (index: number) => {
    const currentServices = currentProject.services || [];
    setCurrentProject({
      ...currentProject,
      services: currentServices.filter((_, i) => i !== index)
    });
  };

  const addVideoUrl = (customUrl?: string) => {
    const url = (customUrl || videoUrlInput).trim();
    if (!url) return;
    const currentVideos = currentProject.videos || [];
    if (!currentVideos.includes(url)) {
      setCurrentProject({
        ...currentProject,
        videos: [...currentVideos, url]
      });
    }
    if (!customUrl) {
      setVideoUrlInput('');
    }
  };

  const removeVideoUrl = (index: number) => {
    const currentVideos = currentProject.videos || [];
    setCurrentProject({
      ...currentProject,
      videos: currentVideos.filter((_, i) => i !== index)
    });
  };

  const openEditor = (project?: Project) => {
    setImageUrlInput('');
    setServiceInput('');
    setVideoUrlInput('');
    if (project) {
      setCurrentProject(project);
    } else {
      setCurrentProject({
        title: '',
        description: '',
        category: '',
        services: [],
        images: [],
        videos: [],
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
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{currentProject.id ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</h2>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">اسم المشروع</label>
              <input 
                type="text" 
                required 
                value={currentProject.title || ''} 
                onChange={e => setCurrentProject({...currentProject, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">التصنيف</label>
              <input 
                type="text" 
                required 
                placeholder="مثال: عيادة طبية، مركز تجميل"
                value={currentProject.category || ''} 
                onChange={e => setCurrentProject({...currentProject, category: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">وصف المشروع</label>
              <textarea 
                required 
                rows={4}
                value={currentProject.description || ''} 
                onChange={e => setCurrentProject({...currentProject, description: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 resize-none" 
              />
            </div>

            {/* معرض صور المشروع */}
            <div className="border-t border-slate-100 pt-6">
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-medical-600" />
                صور ومعرض المشروع
              </label>
              
              {/* واجهة سحب وإفلات لرفع الصور مباشرة من الجهاز */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative mb-4 ${
                  isDragging 
                    ? 'border-medical-500 bg-medical-50/50 scale-[0.99]' 
                    : 'border-slate-200 hover:border-medical-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="file" 
                  id="image-file-upload" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <label htmlFor="image-file-upload" className="cursor-pointer block w-full h-full">
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Loader2 className="w-8 h-8 text-medical-500 animate-spin mb-2" />
                      <span className="text-sm font-medium text-slate-600">جاري ضغط ومعالجة الصورة...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-medical-500 transition-colors" />
                      <span className="text-sm font-bold text-slate-700 block mb-1">
                        اسحب الصورة وأفلتها هنا، أو اضغط للتصفح من جهازك
                      </span>
                      <span className="text-xs text-slate-400">
                        يدعم صيغ PNG, JPG, JPEG (يتم ضغط الصورة تلقائياً لسرعة التحميل)
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {uploadError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center">
                  ⚠️ {uploadError}
                </div>
              )}

              {/* بديل: إضافة من خلال رابط خارجي */}
              <div className="mb-6">
                <span className="block text-xs font-semibold text-slate-500 mb-2">أو أضف من خلال رابط صورة خارجي:</span>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="رابط الصورة المباشر (https://...)"
                    value={imageUrlInput} 
                    onChange={e => setImageUrlInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-left text-sm" 
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageUrlInput.trim()) {
                        addImageUrl(imageUrlInput);
                        setImageUrlInput('');
                      }
                    }}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-sm font-bold transition-colors"
                  >
                    إضافة رابط
                  </button>
                </div>
              </div>

              {/* القوالب الجاهزة لسهولة الاستخدام */}
              <div className="mb-6">
                <span className="block text-xs font-semibold text-slate-500 mb-2">أو اختر من قوالب الصور الجاهزة بالأسفل:</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => addImageUrl(preset.url)}
                      className="group relative h-16 rounded-lg overflow-hidden border border-slate-200 hover:border-medical-500 transition-all text-right"
                    >
                      <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                        <span className="text-[10px] font-bold text-white truncate w-full">{preset.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* الصور الحالية */}
              {currentProject.images && currentProject.images.length > 0 && (
                <div className="space-y-2 mb-6">
                  <span className="block text-xs font-bold text-slate-700">الصور المضافة حالياً للمشروع ({currentProject.images.length}):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {currentProject.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                        <img src={img} alt={`img-${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => removeImageUrl(idx)}
                          className="absolute top-1 right-1 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition-colors"
                          title="حذف الصورة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* الخدمات المقدمة */}
            <div className="border-t border-slate-100 pt-6">
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-medical-600" />
                الخدمات المقدمة
              </label>
              <p className="text-xs text-slate-500 mb-4">
                أضف الخدمات التي تم تقديمها في هذا المشروع (مثل: إدارة سوشيال ميديا، تصميم بوستات):
              </p>

              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder="اسم الخدمة..."
                  value={serviceInput} 
                  onChange={e => setServiceInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500" 
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addService();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addService}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors"
                >
                  إضافة
                </button>
              </div>

              {currentProject.services && currentProject.services.length > 0 && (
                <div className="flex flex-wrap gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {currentProject.services.map((service, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                      {service}
                      <button
                        type="button"
                        onClick={() => removeService(idx)}
                        className="text-slate-400 hover:text-red-600 font-bold text-sm leading-none transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* فيديوهات و Reels */}
            <div className="border-t border-slate-100 pt-6">
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Video className="w-5 h-5 text-medical-600" />
                فيديوهات و Reels للمشروع
              </label>

              {/* واجهة سحب وإفلات لرفع الفيديوهات مباشرة من الجهاز */}
              <div 
                onDragOver={handleVideoDragOver}
                onDragLeave={handleVideoDragLeave}
                onDrop={handleVideoDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative mb-4 ${
                  isDraggingVideo 
                    ? 'border-medical-500 bg-medical-50/50 scale-[0.99]' 
                    : 'border-slate-200 hover:border-medical-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="file" 
                  id="video-file-upload" 
                  accept="video/*" 
                  onChange={handleVideoFileChange} 
                  className="hidden" 
                />
                <label htmlFor="video-file-upload" className="cursor-pointer block w-full h-full">
                  {isUploadingVideo ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Loader2 className="w-8 h-8 text-medical-500 animate-spin mb-2" />
                      <span className="text-sm font-medium text-slate-600">جاري معالجة ورفع الفيديو...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <Video className="w-10 h-10 text-slate-400 mb-3 group-hover:text-medical-500 transition-colors" />
                      <span className="text-sm font-bold text-slate-700 block mb-1">
                        اسحب ملف الفيديو وأفلته هنا، أو اضغط للتصفح من جهازك
                      </span>
                      <span className="text-xs text-slate-400">
                        يدعم صيغ MP4, WebM, Ogg (الحد الأقصى للحجم: 25 ميجابايت)
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {uploadVideoError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold text-center">
                  ⚠️ {uploadVideoError}
                </div>
              )}

              {/* بديل: إضافة من خلال رابط خارجي */}
              <div className="mb-6">
                <span className="block text-xs font-semibold text-slate-500 mb-2">أو أضف من خلال رابط فيديو خارجي (YouTube / Instagram Reels):</span>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="رابط الفيديو المباشر أو Reels (https://...)"
                    value={videoUrlInput} 
                    onChange={e => setVideoUrlInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-left text-sm" 
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (videoUrlInput.trim()) {
                        addVideoUrl(videoUrlInput);
                        setVideoUrlInput('');
                      }
                    }}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-sm font-bold transition-colors"
                  >
                    إضافة رابط
                  </button>
                </div>
              </div>

              {/* قائمة الفيديوهات الحالية مع المعاينة */}
              {currentProject.videos && currentProject.videos.length > 0 && (
                <div className="space-y-3 mb-6">
                  <span className="block text-xs font-bold text-slate-700">الفيديوهات المضافة حالياً ({currentProject.videos.length}):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {currentProject.videos.map((vid, idx) => {
                      const isPlayable = vid.startsWith('data:video') || vid.includes('.mp4') || vid.includes('.webm') || vid.includes('.ogg');
                      return (
                        <div key={idx} className="relative aspect-[9/16] bg-slate-900 rounded-xl overflow-hidden border border-slate-200 group flex flex-col justify-between">
                          {isPlayable ? (
                            <video src={vid} className="w-full h-full object-cover animate-fade-in" preload="metadata" controls />
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                              <Video className="w-10 h-10 text-white/50 mb-2" />
                              <span className="text-[10px] text-white/80 font-medium truncate w-full" dir="ltr">{vid}</span>
                              <span className="text-[9px] text-slate-400 mt-1">(رابط خارجي)</span>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeVideoUrl(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md transition-colors z-30"
                            title="حذف الفيديو"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                className="px-6 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-colors"
              >
                حفظ المشروع
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
              <h1 className="text-2xl font-bold text-slate-900 mb-2">إدارة الأعمال والمشاريع</h1>
              <p className="text-slate-500">التحكم في المشاريع المعروضة</p>
            </div>
            <button 
              onClick={() => openEditor()}
              className="flex items-center gap-2 px-6 py-3 bg-medical-600 text-white rounded-xl font-medium hover:bg-medical-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              إضافة مشروع
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
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">المشروع</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">التصنيف</th>
                      <th className="px-6 py-4 text-sm font-bold text-slate-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{project.title}</div>
                          <div className="text-sm text-slate-500 line-clamp-1">{project.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-medical-50 text-medical-700 px-3 py-1 rounded-full text-xs font-bold">
                            {project.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openEditor(project)}
                              className="p-2 text-slate-400 hover:text-medical-600 bg-white border border-slate-200 rounded-lg hover:border-medical-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(project.id)}
                              className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-lg hover:border-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                          لا توجد مشاريع مضافة حتى الآن
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
