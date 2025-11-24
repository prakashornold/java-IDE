import { Code2, Shuffle, BookOpen, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onRandomProblem: () => void;
  isLoadingProblem: boolean;
  onNavigateToProblems: () => void;
}

export function Header({ onRandomProblem, isLoadingProblem, onNavigateToProblems }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  return (
    <header
      className="border-b px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between"
      style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <Code2 className="w-5 sm:w-6 h-5 sm:h-6" style={{ color: 'var(--accent-primary)' }} />
        <h1 className="text-base sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Java-IDE</h1>
        <span className="text-xs hidden md:inline" style={{ color: 'var(--text-tertiary)' }}>
          Online Java Compiler & Runner
        </span>
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

        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <User className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="hidden md:inline text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {profile?.first_name || user.email?.split('@')[0]}
              </span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-all duration-200"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
