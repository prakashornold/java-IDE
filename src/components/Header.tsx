import { useState } from 'react';
import { Shuffle, BookOpen, LogIn, UserCircle2, BarChart3, Terminal, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { AuthModal } from './AuthModal';
import { MyAccountModal } from './MyAccountModal';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onRandomProblem: () => void;
  isLoadingProblem: boolean;
  onNavigateToProblems: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToAdmin?: () => void;
}

export function Header({ onRandomProblem, isLoadingProblem, onNavigateToProblems, onNavigateToDashboard, onNavigateToAdmin }: HeaderProps) {
  const { user, isAdmin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  return (
    <header
      className="border-b px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between"
      style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 shadow-xl shadow-cyan-500/20 animate-pulse-slow">
          <Terminal className="w-5 sm:w-6 h-5 sm:h-6 text-slate-900" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm sm:text-lg font-extrabold leading-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
            JavaCodingPractice.com
          </h1>
          <span className="text-[10px] sm:text-xs leading-tight hidden sm:block font-bold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            5 Minutes Daily. Code Smarter. Faster.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <button
          onClick={onRandomProblem}
          disabled={isLoadingProblem}
          className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
          title="Load a random Java Stream API problem"
        >
          <Shuffle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          <span className="hidden sm:inline">{isLoadingProblem ? 'Loading...' : 'Random'}</span>
        </button>

        <button
          onClick={onNavigateToProblems}
          className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
          title="View all problems"
        >
          <BookOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          <span className="hidden sm:inline">Problems</span>
        </button>

        {onNavigateToDashboard && user && (
          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
            title="View dashboard"
          >
            <BarChart3 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        )}

        {onNavigateToAdmin && isAdmin && (
          <button
            onClick={onNavigateToAdmin}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
            title="Admin Panel"
          >
            <Shield className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        )}

        {user ? (
          <button
            onClick={() => setShowAccountModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
            title="My Account"
          >
            <UserCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span className="hidden sm:inline">My Account</span>
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
            title="Sign in to your account"
          >
            <LogIn className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <MyAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />
    </header>
  );
}
