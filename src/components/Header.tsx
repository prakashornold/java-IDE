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
      className="border-b backdrop-blur-xl bg-gradient-to-r from-slate-900/80 via-gray-900/80 to-slate-900/80 shadow-lg shadow-cyan-500/10"
      style={{ borderColor: 'rgba(6, 182, 212, 0.2)' }}
    >
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 shadow-lg transform transition-transform group-hover:scale-105">
              <Terminal className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
            JavaCodingPractice.com
          </h1>
        </div>

        <nav className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={onRandomProblem}
            disabled={isLoadingProblem}
            className="flex items-center gap-1.5 text-sm font-medium transition-all duration-300 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-cyan-500/10"
            style={{ color: 'var(--text-primary)' }}
            title="Random problem"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">{isLoadingProblem ? 'Loading...' : 'Random'}</span>
          </button>

          <button
            onClick={onNavigateToProblems}
            className="text-sm font-medium transition-all duration-300 hover:text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10"
            style={{ color: 'var(--text-primary)' }}
            title="All problems"
          >
            Problems
          </button>

          {onNavigateToDashboard && user && (
            <button
              onClick={onNavigateToDashboard}
              className="text-sm font-medium transition-all duration-300 hover:text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10"
              style={{ color: 'var(--text-primary)' }}
              title="Dashboard"
            >
              Dashboard
            </button>
          )}

          {onNavigateToAdmin && isAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="text-sm font-medium transition-all duration-300 hover:text-yellow-400 px-3 py-1.5 rounded-lg hover:bg-yellow-500/10"
              style={{ color: 'var(--text-primary)' }}
              title="Admin"
            >
              Admin
            </button>
          )}

          {user ? (
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium transition-all duration-300 hover:text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30"
              style={{ color: 'var(--text-primary)' }}
              title="Account"
            >
              <UserCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm font-medium px-4 py-2 rounded-lg border transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 hover:bg-cyan-500/5"
              style={{ color: 'var(--text-primary)', borderColor: 'rgba(6, 182, 212, 0.3)' }}
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
