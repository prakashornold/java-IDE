import { Heart, Code2, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gradient-to-r from-[#161b22] via-[#0d1117] to-[#161b22] px-2 sm:px-4 py-3 sm:py-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
        <div className="flex items-center gap-1 sm:gap-2">
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-yellow-400" />
          <span className="text-gray-400 text-[10px] sm:text-xs">Developed By</span>
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-[#00A8E8] text-[10px] sm:text-xs">
            Om Prakash Peddamadthala
          </span>
          <Code2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#00D4AA]" />
          <Heart className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-red-500 fill-red-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="text-gray-500 text-[10px] sm:text-xs">© 2024 JavaCodingPractice.com - All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
