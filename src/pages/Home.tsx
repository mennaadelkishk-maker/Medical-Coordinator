import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, Stethoscope, Megaphone, PenTool, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-medical-50 text-medical-600 text-sm font-semibold tracking-wide mb-4">
            <Stethoscope className="w-4 h-4" />
            منسقة عيادات طبية & مسوقة رقمية
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary-900 leading-[1.1]">
            أصنع تواجداً <span className="text-medical-600">رقمياً</span> يليق بخدماتك الطبية
          </h1>
          <p className="text-lg text-primary-500 max-w-2xl leading-relaxed">
            أساعد العيادات الطبية في إدارة وتنسيق أعمالهم، بالإضافة إلى بناء حضور رقمي قوي من خلال صناعة محتوى متخصص وإدارة الحملات التسويقية.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-primary-800 transition-colors"
            >
              عرض الأعمال
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* About Section Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-32"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">مهاراتي وخبراتي</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            أجمع بين الفهم العميق للمجال الطبي ومهارات التسويق الرقمي لتقديم حلول متكاملة تساهم في نمو العيادات والمراكز الطبية.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: Megaphone, title: 'Social Media Management' },
            { icon: PenTool, title: 'Medical Copywriting' },
            { icon: Stethoscope, title: 'Clinic Coordination' },
            { icon: Calendar, title: 'Appointment Coordination' },
          ].map((skill, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="mx-auto w-12 h-12 bg-medical-50 rounded-xl flex items-center justify-center mb-4 text-medical-600">
                <skill.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">{skill.title}</h3>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-3xl mx-auto">
          {['Content Creation', 'Canva Design', 'Reels & Short Videos', 'Campaign Ideas', 'Patient Communication'].map((skill) => (
            <span key={skill} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
