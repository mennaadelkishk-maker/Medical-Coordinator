export default function Footer() {
  return (
    <footer className="h-24 border-t border-primary-100 flex items-center justify-between px-4 sm:px-12 bg-white text-[11px] text-primary-400 uppercase tracking-[0.2em] mt-auto flex-col sm:flex-row gap-4 py-4 sm:py-0">
      <div>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} منه الله عادل كشك</div>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
        <span>INSTAGRAM</span>
        <span>LINKEDIN</span>
        <span>TIKTOK</span>
      </div>
      <div className="text-center sm:text-right">
        Medical Coordinator — <span className="text-medical-600">Production Ready</span>
      </div>
    </footer>
  );
}
