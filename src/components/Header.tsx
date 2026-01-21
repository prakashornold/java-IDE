import { useState, useRef } from 'react';
import { Terminal, LogOut, Menu, X, User, Mail, Calendar, Shield, FileText } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNavigateToAdmin?: () => void;
  onNavigateToNotes?: () => void;
}

export function Header({ onNavigateToAdmin, onNavigateToNotes }: HeaderProps) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserTooltip, setShowUserTooltip] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userTooltipRef = useRef<HTMLDivElement>(null);

  const userName = user?.user_metadata?.full_name ||
    (profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || profile?.last_name || 'User');

  const userAvatar = user?.user_metadata?.avatar_url || profile?.avatar_url;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSignOut = async () => {
    setShowMobileMenu(false);
    setShowUserTooltip(false);
    await signOut();
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
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-[#A9B7C6] sm:truncate">
              <span className="hidden sm:inline">JavaCodingPractice.com</span>
              <span className="sm:hidden whitespace-nowrap">JavaCodingPractice.com</span>
            </h1>
            <p className="text-[9px] xs:text-[10px] sm:text-xs text-[#808080] tracking-tight truncate hidden xs:block">
              Makes Easy to Practice AnyTime AnyWhere
            </p>
          </div>

          {/* User Name with Hover Tooltip */}
          {user && (
            <div className="relative ml-2 hidden md:block" ref={userTooltipRef}>
              <button
                onMouseEnter={() => setShowUserTooltip(true)}
                onMouseLeave={() => setShowUserTooltip(false)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-default px-2 py-1 rounded hover:bg-[#2a2d2e]"
              >
                {userName}
              </button>

              {/* Hover Tooltip */}
              {showUserTooltip && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#1e1e1e] border border-[#323232] rounded-lg shadow-2xl z-50 overflow-hidden">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt={userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">{userName}</h3>
                        {isAdmin && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-yellow-400 text-gray-900 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="p-2.5 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <Mail className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-[11px] text-gray-300 truncate">{user?.email || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-gray-500 uppercase tracking-wide">Member Since</p>
                        <p className="text-[11px] text-gray-300">{formatDate(user?.created_at)}</p>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex items-start gap-2">
                        <Shield className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-gray-500 uppercase tracking-wide">Role</p>
                          <p className="text-[11px] text-yellow-400 font-medium">Administrator</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
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
            {onNavigateToNotes && user && (
              <button
                onClick={onNavigateToNotes}
                className="flex items-center gap-1.5 text-sm font-medium text-[#6897BB] hover:text-[#8AB4D9] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
                title="Notes"
              >
                <FileText className="w-4 h-4" />
                <span>Notes</span>
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
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
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
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-[57px] left-0 right-0 bg-[#1e1e1e] border-b border-[#323232] shadow-xl z-50 max-h-[calc(100vh-57px)] overflow-y-auto"
        >
          <nav className="px-4 py-3 flex flex-col gap-2">
            {onNavigateToNotes && user && (
              <button
                onClick={() => handleNavigate(onNavigateToNotes)}
                className="flex items-center gap-2 text-sm font-medium text-[#6897BB] hover:text-[#8AB4D9] hover:bg-[#2a2d2e] px-3 py-2.5 rounded transition-all w-full text-left"
              >
                <FileText className="w-4 h-4" />
                Notes
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

            {user ? (
              <>
                <div className="border-t border-[#323232] my-1"></div>
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
