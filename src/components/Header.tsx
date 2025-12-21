import { useState } from 'react';
import { Shuffle, CircleUser as UserCircle2, Terminal, PanelLeftClose, PanelLeft } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { MyAccountModal } from './MyAccountModal';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onRandomProblem: () => void;
  isLoadingProblem: boolean;
  onNavigateToDashboard?: () => void;
  onNavigateToAdmin?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onRandomProblem, isLoadingProblem, onNavigateToDashboard, onNavigateToAdmin, onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user, isAdmin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  return (
    <header
      className="border-b border-[#323232] bg-[#1e1e1e]"
    >
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-[#365880] rounded">
            <Terminal className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-base sm:text-lg font-semibold text-[#A9B7C6]">
            JavaCodingPractice.com
          </h1>
        </div>

        <nav className="flex items-center gap-2">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="flex items-center gap-1.5 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
              title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
              <span className="hidden lg:inline">Problems</span>
            </button>
          )}

          <button
            onClick={onRandomProblem}
            disabled={isLoadingProblem}
            className="flex items-center gap-1.5 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded transition-all"
            title="Random problem"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">{isLoadingProblem ? 'Loading...' : 'Random'}</span>
          </button>

          {onNavigateToDashboard && user && (
            <button
              onClick={onNavigateToDashboard}
              className="text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
              title="Dashboard"
            >
              Dashboard
            </button>
          )}

          {onNavigateToAdmin && isAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="text-sm font-medium text-[#CC7832] hover:text-[#FFA759] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
              title="Admin"
            >
              Admin
            </button>
          )}

          {user ? (
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all border border-[#555555]"
              title="Account"
            >
              <UserCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] px-4 py-1.5 rounded border border-[#555555] hover:bg-[#2a2d2e] transition-all"
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
