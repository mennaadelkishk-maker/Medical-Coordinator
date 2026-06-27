-- Database schema for Supabase

-- 1. Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null,
  date text,
  images text[] default array[]::text[],
  videos text[] default array[]::text[],
  services text[] default array[]::text[],
  copywriting_samples jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Content Samples Table
create table public.content_samples (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null,
  content text not null,
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Services Table
create table public.services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.projects enable row level security;
alter table public.content_samples enable row level security;
alter table public.services enable row level security;

-- Create read policies for public access
create policy "Allow public read access on projects" on public.projects for select using (true);
create policy "Allow public read access on content_samples" on public.content_samples for select using (true);
create policy "Allow public read access on services" on public.services for select using (true);

-- Create write policies for authenticated admins only
create policy "Allow admin full access on projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Allow admin full access on content_samples" on public.content_samples for all using (auth.role() = 'authenticated');
create policy "Allow admin full access on services" on public.services for all using (auth.role() = 'authenticated');

-- 4. Initial Seed Data
INSERT INTO public.projects (id, title, description, category, date, images, videos, services, copywriting_samples)
VALUES (
  'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a1',
  'حملة توعية لعيادة أسنان',
  'إدارة متكاملة لحملة تسويقية لعيادة أسنان متخصصة في زراعة وتجميل الأسنان، تضمنت كتابة المحتوى وتصميم الهوية البصرية.',
  'عيادة طبية',
  '2023-10-01',
  ARRAY['https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1598256989800-fea5f67ebc24?auto=format&fit=crop&q=80&w=800'],
  ARRAY[]::text[],
  ARRAY['إدارة سوشيال ميديا', 'كتابة محتوى طبي', 'تصميم بوستات', 'تنسيق مواعيد'],
  '[{"title": "بوست زراعة الأسنان", "content": "ابتسامتك هي سر جمالك! احجز الآن استشارتك المجانية لزراعة الأسنان بأحدث التقنيات وبدون ألم..."}]'::jsonb
),
(
  'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a2',
  'تسويق منتجات عناية بالبشرة',
  'إنشاء محتوى تسويقي وخطط نشر لشركة مستحضرات تجميل وعناية بالبشرة.',
  'مركز تجميل',
  '2023-11-15',
  ARRAY['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800'],
  ARRAY[]::text[],
  ARRAY['كتابة محتوى تسويقي', 'أفكار Reels', 'إدارة حملات'],
  '[]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.content_samples (id, title, type, content, project_id)
VALUES (
  'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b4b1',
  'أهمية الفحص المبكر',
  'بوست طبي',
  'الفحص المبكر ليس مجرد إجراء روتيني، بل هو خطوتك الأولى نحو حياة صحية وآمنة. لا تتردد في حجز موعدك اليوم.',
  'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a1'
),
(
  'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b4b2',
  'فيديو تعريفي بخدمات العيادة',
  'نص Reel',
  'هل تبحث عن رعاية طبية متكاملة؟ (يظهر الطبيب مبتسماً) في عياداتنا نوفر لك أحدث الأجهزة... (لقطات سريعة للعيادة) تواصل معنا الآن!',
  'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a1'
)
ON CONFLICT (id) DO NOTHING;

