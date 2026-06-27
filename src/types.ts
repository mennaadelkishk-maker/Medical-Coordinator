export interface Project {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., عيادة طبية, شركة أدوية, مركز تجميل
  date?: string;
  images: string[];
  videos: string[];
  services: string[]; // e.g., تصميم بوستات, كتابة محتوى
  copywriting_samples?: { title: string; content: string }[];
}

export interface ContentSample {
  id: string;
  title: string;
  type: string; // e.g., بوست طبي, Caption, أفكار حملات
  content: string;
  project_id?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
}
