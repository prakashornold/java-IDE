export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[#282934] bg-[#1a1b22]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5294d0]/10 to-transparent" />
      <div className="px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] sm:text-xs text-[#7d8490]">
        <span className="tracking-tight">JavaCodingPractice.com {currentYear}</span>
        <span className="tracking-tight">Practice AnyTime AnyWhere</span>
      </div>
    </footer>
  );
}
