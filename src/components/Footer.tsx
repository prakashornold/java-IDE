import { Heart, Code2, Github, Linkedin, Mail, Terminal } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#323232] bg-gradient-to-b from-[#1e1e1e] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-[#365880] rounded">
                <Terminal className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-semibold text-[#A9B7C6]">JavaCodingPractice</span>
            </div>
            <p className="text-xs text-gray-400 text-center md:text-left max-w-xs">
              Master Java programming with hands-on coding challenges and real-time compilation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-sm font-semibold text-[#A9B7C6]">Quick Links</h3>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <a href="#problems" className="hover:text-[#00D4AA] transition-colors">Browse Problems</a>
              <a href="#about" className="hover:text-[#00D4AA] transition-colors">About Us</a>
              <a href="#dashboard" className="hover:text-[#00D4AA] transition-colors">Dashboard</a>
            </div>
          </div>

          {/* Developer & Social */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#00D4AA]" />
                <span className="text-xs text-gray-400">Developed by</span>
              </div>
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-[#00A8E8]">
                Om Prakash Peddamadthala
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#2a2d2e] hover:bg-[#365880] transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#2a2d2e] hover:bg-[#365880] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </a>
              <a
                href="mailto:contact@javacodingpractice.com"
                className="p-2 rounded-lg bg-[#2a2d2e] hover:bg-[#365880] transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#323232]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              © {currentYear} JavaCodingPractice.com. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
              <span>for Java developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
