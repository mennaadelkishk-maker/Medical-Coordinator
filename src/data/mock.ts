import { Project, ContentSample, Service } from '../types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'حملة توعية لعيادة أسنان',
    description: 'إدارة متكاملة لحملة تسويقية لعيادة أسنان متخصصة في زراعة وتجميل الأسنان، تضمنت كتابة المحتوى وتصميم الهوية البصرية.',
    category: 'عيادة طبية',
    date: '2023-10-01',
    images: [
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1598256989800-fea5f67ebc24?auto=format&fit=crop&q=80&w=800'
    ],
    videos: [],
    services: ['إدارة سوشيال ميديا', 'كتابة محتوى طبي', 'تصميم بوستات', 'تنسيق مواعيد'],
    copywriting_samples: [
      { title: 'بوست زراعة الأسنان', content: 'ابتسامتك هي سر جمالك! احجز الآن استشارتك المجانية لزراعة الأسنان بأحدث التقنيات وبدون ألم...' }
    ]
  },
  {
    id: '2',
    title: 'تسويق منتجات عناية بالبشرة',
    description: 'إنشاء محتوى تسويقي وخطط نشر لشركة مستحضرات تجميل وعناية بالبشرة.',
    category: 'مركز تجميل',
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800'
    ],
    videos: [],
    services: ['كتابة محتوى تسويقي', 'أفكار Reels', 'إدارة حملات'],
  }
];

export const MOCK_SAMPLES: ContentSample[] = [
  {
    id: '1',
    title: 'أهمية الفحص المبكر',
    type: 'بوست طبي',
    content: 'الفحص المبكر ليس مجرد إجراء روتيني، بل هو خطوتك الأولى نحو حياة صحية وآمنة. لا تتردد في حجز موعدك اليوم.',
  },
  {
    id: '2',
    title: 'فيديو تعريفي بخدمات العيادة',
    type: 'نص Reel',
    content: 'هل تبحث عن رعاية طبية متكاملة؟ (يظهر الطبيب مبتسماً) في عياداتنا نوفر لك أحدث الأجهزة... (لقطات سريعة للعيادة) تواصل معنا الآن!',
  }
];

export const MOCK_SERVICES: Service[] = [
  { id: '1', title: 'تنسيق عيادات طبية', description: 'إدارة وتنسيق العمليات اليومية للعيادات وجدولة المواعيد بكفاءة.', icon: 'Stethoscope' },
  { id: '2', title: 'إدارة سوشيال ميديا', description: 'إدارة حسابات التواصل الاجتماعي الطبية وبناء هوية رقمية قوية.', icon: 'Share2' },
  { id: '3', title: 'كتابة محتوى طبي', description: 'صياغة محتوى طبي دقيق وموثوق لزيادة وعي المرضى.', icon: 'PenTool' },
  { id: '4', title: 'تصميم بوستات Canva', description: 'تصميم جرافيك جذاب ومناسب للهوية البصرية للعيادات.', icon: 'Palette' },
];
