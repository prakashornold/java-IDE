import { Terminal, Code2, Play, BookOpen, Trophy, Users, Zap, Shield, Check, ArrowLeft, Heart } from 'lucide-react';
import { Footer } from './Footer';

interface AboutProps {
  onNavigateHome: () => void;
}

export function About({ onNavigateHome }: AboutProps) {
  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Powerful Online Java IDE",
      description: "Write, compile, and run Java code instantly in your browser. No installation required. Experience a professional-grade code editor with syntax highlighting, auto-completion, and IntelliSense support."
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Instant Code Execution",
      description: "Execute your Java programs in real-time with our high-performance compiler service. Get immediate feedback on your code with detailed error messages and console output."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Curated Practice Problems",
      description: "Access a comprehensive library of Java coding problems covering basics, data structures, algorithms, Java Streams, collections, and advanced topics. Problems are carefully designed for progressive skill development."
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Interview Preparation",
      description: "Prepare for technical interviews with real-world coding challenges. Practice common interview questions from top tech companies and improve your problem-solving skills."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Dashboard & Progress Tracking",
      description: "Track your coding journey with a personalized dashboard. Monitor solved problems, track your progress, view submission history, and identify areas for improvement."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Modern Developer Experience",
      description: "Enjoy a clean, intuitive interface with dark mode support, customizable layouts, resizable panels, and a mobile-responsive design. Code comfortably on any device."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Authentication",
      description: "Create your free account with secure email/password authentication powered by Supabase. Your code and progress are safely stored and always accessible."
    }
  ];

  const techStack = [
    "Java 8 - 21 Support",
    "React with TypeScript",
    "Monaco Editor (VS Code)",
    "Supabase Backend",
    "Edge Functions",
    "Real-time Compilation",
    "Responsive Design",
    "Dark Mode UI"
  ];

  return (
    <div className="h-screen flex flex-col bg-[#2B2B2B] text-[#A9B7C6]">
      <header className="border-b border-[#323232] bg-[#1e1e1e] flex-shrink-0">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-[#365880] rounded">
              <Terminal className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-base sm:text-lg font-semibold text-[#A9B7C6]">
              About Us
            </h1>
          </div>
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-4 py-2 rounded transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to IDE</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
          <section className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-[#365880] rounded-lg">
                <Terminal className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFFFFF] leading-tight">
              Welcome to JavaCodingPractice.com
            </h1>
            <p className="text-lg sm:text-xl text-[#808080] max-w-3xl mx-auto leading-relaxed">
              Your ultimate destination for mastering Java programming through hands-on practice, real-world challenges, and interview preparation.
            </p>
          </section>

          <section className="bg-[#1e1e1e] border border-[#323232] rounded-lg p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] flex items-center gap-3">
              <Code2 className="w-7 h-7 text-[#CC7832]" />
              Our Mission
            </h2>
            <div className="space-y-4 text-base sm:text-lg text-[#A9B7C6] leading-relaxed">
              <p>
                At JavaCodingPractice.com, we believe that the best way to learn programming is by doing.
                Our platform provides a professional, browser-based Java IDE where developers of all skill levels
                can write, compile, and run Java code without any setup or installation.
              </p>
              <p>
                Whether you're a beginner learning Java fundamentals, an intermediate developer mastering data
                structures and algorithms, or an experienced engineer preparing for technical interviews at top
                tech companies, we've got you covered.
              </p>
              <p>
                Our carefully curated collection of coding problems spans from basic Java syntax to advanced topics
                like Java Streams, collections, design patterns, concurrency, and system design. Each problem is
                designed to build your skills progressively and prepare you for real-world software development challenges.
              </p>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] text-center">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#1e1e1e] border border-[#323232] rounded-lg p-6 hover:border-[#365880] transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#365880] bg-opacity-20 text-[#6897BB] rounded-lg">
                      {feature.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[#FFFFFF]">{feature.title}</h3>
                      <p className="text-[#A9B7C6] leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#1e1e1e] border border-[#323232] rounded-lg p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF] flex items-center gap-3">
              <Zap className="w-7 h-7 text-[#CC7832]" />
              Technology Stack
            </h2>
            <p className="text-[#A9B7C6] leading-relaxed">
              Built with modern web technologies to deliver a fast, reliable, and enjoyable coding experience:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-[#2a2d2e] border border-[#323232] rounded-lg px-4 py-3 hover:border-[#365880] transition-all"
                >
                  <Check className="w-4 h-4 text-[#6A8759] flex-shrink-0" />
                  <span className="text-sm text-[#A9B7C6] font-medium">{tech}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-[#365880] to-[#2a4a6b] border border-[#365880] rounded-lg p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-7 h-7 text-white" />
              Why Choose JavaCodingPractice.com?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#6A8759] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">100% Free to Use</h4>
                  <p className="text-sm text-gray-200 opacity-90">No hidden charges or premium tiers. All features available for free.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#6A8759] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">No Installation Required</h4>
                  <p className="text-sm text-gray-200 opacity-90">Start coding immediately. Works on any device with a web browser.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#6A8759] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Industry-Standard Editor</h4>
                  <p className="text-sm text-gray-200 opacity-90">Powered by Monaco Editor, the same editor used in VS Code.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#6A8759] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Real Interview Questions</h4>
                  <p className="text-sm text-gray-200 opacity-90">Practice problems asked by Google, Amazon, Microsoft, and more.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#6A8759] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Progress Tracking</h4>
                  <p className="text-sm text-gray-200 opacity-90">Monitor your improvement with detailed analytics and statistics.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#6A8759] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Mobile Friendly</h4>
                  <p className="text-sm text-gray-200 opacity-90">Practice on-the-go with our responsive mobile interface.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#1e1e1e] border border-[#323232] rounded-lg p-6 sm:p-8 space-y-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-[#BC3F3C] fill-[#BC3F3C]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#FFFFFF]">
              Developed with Passion
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              <p className="text-lg text-[#A9B7C6] leading-relaxed">
                JavaCodingPractice.com is proudly developed by <span className="font-bold text-[#FFFFFF]">Om Prakash Peddamadthala</span>,
                a passionate software engineer dedicated to making programming education accessible to everyone.
              </p>
              <p className="text-[#A9B7C6] leading-relaxed">
                With years of experience in software development and a deep understanding of what it takes
                to excel in technical interviews, this platform was built to bridge the gap between learning
                and practical application. Every feature has been carefully crafted to provide the best possible
                learning experience for aspiring and experienced Java developers.
              </p>
              <div className="pt-6 border-t border-[#323232] mt-6">
                <p className="text-sm text-[#808080]">
                  Questions, feedback, or suggestions? We'd love to hear from you!
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-[#2a4a6b] to-[#1e3a52] border border-[#365880] rounded-lg p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Ready to Start Your Java Journey?
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Join thousands of developers improving their Java skills. Start practicing today and take your coding abilities to the next level.
            </p>
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 bg-white text-[#2a4a6b] hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-all text-lg shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5" />
              Start Coding Now
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
