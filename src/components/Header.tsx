import { useState } from 'react';
import { Shuffle, BookOpen, LogIn, CircleUser as UserCircle2, BarChart3, Terminal, Shield } from 'lucide-react';
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
      className="border-b backdrop-blur-2xl bg-white/10 shadow-2xl"
      style={{
        borderColor: 'rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}
    >
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 shadow-lg transform transition-transform group-hover:scale-105">
              <Terminal className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white drop-shadow-2xl">
            JavaCodingPractice.com
          </h1>
        </div>

        <nav className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={onRandomProblem}
            disabled={isLoadingProblem}
            className="flex items-center gap-1.5 text-sm font-medium text-white transition-all duration-300 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-white/10"
            title="Random problem"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">{isLoadingProblem ? 'Loading...' : 'Random'}</span>
          </button>

          <button
            onClick={onNavigateToProblems}
            className="text-sm font-medium text-white transition-all duration-300 hover:text-cyan-300 px-3 py-1.5 rounded-lg hover:bg-white/10"
            title="All problems"
          >
            Problems
          </button>

          {onNavigateToDashboard && user && (
            <button
              onClick={onNavigateToDashboard}
              className="text-sm font-medium text-white transition-all duration-300 hover:text-cyan-300 px-3 py-1.5 rounded-lg hover:bg-white/10"
              title="Dashboard"
            >
              Dashboard
            </button>
          )}

          {onNavigateToAdmin && isAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="text-sm font-medium text-white transition-all duration-300 hover:text-yellow-300 px-3 py-1.5 rounded-lg hover:bg-white/10"
              title="Admin"
            >
              Admin
            </button>
          )}

          {user ? (
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-white transition-all duration-300 hover:text-cyan-300 px-3 py-1.5 rounded-lg hover:bg-white/10 border border-white/20 hover:border-white/40"
              title="Account"
            >
              <UserCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm font-medium text-white px-4 py-2 rounded-lg border border-white/30 transition-all duration-300 hover:border-white/60 hover:bg-white/10 hover:shadow-lg"
              title="Login"
            >
              Login
            </button>
          )}
        </nav>
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
