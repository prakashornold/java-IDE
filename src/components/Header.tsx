import { useState, useRef, useEffect } from 'react';
import { Shuffle, Terminal, PanelLeftClose, PanelLeft, User, LogOut, Info } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onRandomProblem: () => void;
  isLoadingProblem: boolean;
  onNavigateToDashboard?: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToAccountSettings?: () => void;
  onNavigateToAbout?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onRandomProblem, isLoadingProblem, onNavigateToDashboard, onNavigateToAdmin, onNavigateToAccountSettings, onNavigateToAbout, onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user?.user_metadata?.full_name ||
                   (profile?.first_name && profile?.last_name
                     ? `${profile.first_name} ${profile.last_name}`
                     : profile?.first_name || profile?.last_name || 'User');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleSignOut = async () => {
    setShowDropdown(false);
    await signOut();
  };

  const handleMyProfile = () => {
    setShowDropdown(false);
    onNavigateToAccountSettings?.();
  };
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

          {onNavigateToAbout && (
            <button
              onClick={onNavigateToAbout}
              className="flex items-center gap-1.5 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
              title="About Us"
            >
              <Info className="w-4 h-4" />
              <span className="hidden lg:inline">About</span>
            </button>
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
                title="Account"
              >
                <span className="hidden sm:inline">{userName}</span>
                <span className="sm:hidden">
                  {userName.split(' ')[0]}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] border border-[#323232] rounded-lg shadow-xl py-1 z-50">
                  <button
                    onClick={handleMyProfile}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] transition-all"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <div className="border-t border-[#323232] my-1"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#2a2d2e] transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
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
    </header>
  );
}
