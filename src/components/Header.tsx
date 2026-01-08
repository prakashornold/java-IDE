import { useState, useRef, useEffect } from 'react';
import { Shuffle, Terminal, PanelLeftClose, PanelLeft, User, LogOut, Menu, X } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onRandomProblem: () => void;
  isLoadingProblem: boolean;
  onNavigateToAdmin?: () => void;
  onNavigateToAccountSettings?: () => void;
  onNavigateToInterview?: () => void;
  onNavigateToCheatsheet?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onRandomProblem, isLoadingProblem, onNavigateToAdmin, onNavigateToAccountSettings, onNavigateToInterview, onNavigateToCheatsheet, onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const userName = user?.user_metadata?.full_name ||
    (profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || profile?.last_name || 'User');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showDropdown || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showMobileMenu]);

  const handleSignOut = async () => {
    setShowDropdown(false);
    setShowMobileMenu(false);
    await signOut();
  };

  const handleMyProfile = () => {
    setShowDropdown(false);
    setShowMobileMenu(false);
    onNavigateToAccountSettings?.();
  };

  const handleNavigate = (callback?: () => void) => {
    setShowMobileMenu(false);
    callback?.();
  };
  return (
    <header
      className="relative border-b border-[#323232] bg-[#1e1e1e]"
    >
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-[#365880] rounded flex-shrink-0">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-[#A9B7C6] truncate">
              <span className="hidden sm:inline">JavaCodingPractice.com</span>
              <span className="sm:hidden">JavaCoding</span>
            </h1>
            <p className="text-[9px] xs:text-[10px] sm:text-xs text-[#808080] tracking-tight truncate hidden xs:block">
              Makes Easy to Practice AnyTime AnyWhere
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden flex items-center justify-center w-9 h-9 text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] rounded transition-all"
            title="Menu"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
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

            {onNavigateToInterview && (
              <button
                onClick={onNavigateToInterview}
                className="text-sm font-medium text-[#6897BB] hover:text-[#87CEEB] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
                title="Take Test"
              >
                Take Test
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

            {onNavigateToCheatsheet && (
              <button
                onClick={onNavigateToCheatsheet}
                className="text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
                title="Cheatsheet"
              >
                Cheatsheet
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
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-[57px] left-0 right-0 bg-[#1e1e1e] border-b border-[#323232] shadow-xl z-50 max-h-[calc(100vh-57px)] overflow-y-auto"
        >
          <nav className="px-4 py-3 flex flex-col gap-2">
            {onToggleSidebar && (
              <button
                onClick={() => {
                  onToggleSidebar();
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-2 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-2.5 rounded transition-all w-full text-left"
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeft className="w-4 h-4" />
                )}
                <span>{isSidebarOpen ? 'Hide' : 'Show'} Problems</span>
              </button>
            )}

            <button
              onClick={() => {
                onRandomProblem();
                setShowMobileMenu(false);
              }}
              disabled={isLoadingProblem}
              className="flex items-center gap-2 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2.5 rounded transition-all w-full text-left"
            >
              <Shuffle className="w-4 h-4" />
              <span>{isLoadingProblem ? 'Loading...' : 'Random Problem'}</span>
            </button>

            {onNavigateToInterview && (
              <button
                onClick={() => handleNavigate(onNavigateToInterview)}
                className="text-sm font-medium text-[#6897BB] hover:text-[#87CEEB] hover:bg-[#2a2d2e] px-3 py-2.5 rounded transition-all w-full text-left"
              >
                Take Test
              </button>
            )}



            {onNavigateToAdmin && isAdmin && (
              <button
                onClick={() => handleNavigate(onNavigateToAdmin)}
                className="text-sm font-medium text-[#CC7832] hover:text-[#FFA759] hover:bg-[#2a2d2e] px-3 py-2.5 rounded transition-all w-full text-left"
              >
                Admin
              </button>
            )}

            {onNavigateToCheatsheet && (
              <button
                onClick={() => handleNavigate(onNavigateToCheatsheet)}
                className="text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-2.5 rounded transition-all w-full text-left"
              >
                Cheatsheet
              </button>
            )}

            {user ? (
              <>
                <div className="border-t border-[#323232] my-1"></div>
                <div className="px-3 py-2 text-xs font-medium text-[#808080]">
                  {userName}
                </div>
                <button
                  onClick={handleMyProfile}
                  className="flex items-center gap-2 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-2.5 rounded transition-all w-full text-left"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-[#2a2d2e] px-3 py-2.5 rounded transition-all w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-[#323232] my-1"></div>
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] px-3 py-2.5 rounded border border-[#555555] hover:bg-[#2a2d2e] transition-all w-full text-center"
                >
                  Login
                </button>
              </>
            )}
          </nav>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
}
