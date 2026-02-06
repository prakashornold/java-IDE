import { useState, useRef } from 'react';
import { Terminal, LogOut, Menu, X, User, Mail, Calendar, Shield } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNavigateToAdmin?: () => void;
}

export function Header({ onNavigateToAdmin }: HeaderProps) {
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
    <header className="relative bg-[#1a1b22] border-b border-[#282934]">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5294d0]/25 to-transparent" />

      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-shrink">
          <div className="group flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#4080b5] to-[#2a5580] rounded-lg flex-shrink-0 shadow-lg shadow-[#3a6d9e]/15 transition-shadow hover:shadow-[#3a6d9e]/25">
            <Terminal className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white transition-transform group-hover:scale-110" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-[#e8eaed] tracking-tight sm:truncate leading-tight">
              <span className="hidden sm:inline">JavaCodingPractice.com</span>
              <span className="sm:hidden whitespace-nowrap">JavaCodingPractice.com</span>
            </h1>
            <p className="text-[9px] xs:text-[10px] sm:text-xs text-[#585d6a] tracking-tight truncate hidden xs:block leading-tight">
              Makes Easy to Practice AnyTime AnyWhere
            </p>
          </div>

          {user && (
            <div className="relative ml-2 hidden md:block" ref={userTooltipRef}>
              <button
                onMouseEnter={() => setShowUserTooltip(true)}
                onMouseLeave={() => setShowUserTooltip(false)}
                className="text-xs text-[#5294d0] hover:text-[#6db0ea] font-medium transition-all cursor-default px-2.5 py-1.5 rounded-md hover:bg-[#5294d0]/[0.06]"
              >
                {userName}
              </button>

              {showUserTooltip && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-[#1e1f26] border border-[#383946] rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-scale-in">
                  <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#2a5580] rotate-45 border-l border-t border-[#383946]" />

                  <div className="relative bg-gradient-to-br from-[#2a5580] to-[#1e3a5c] p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center overflow-hidden">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt={userName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white/80" />
                          )}
                        </div>
                        {isAdmin && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#cc7832] flex items-center justify-center border-2 border-[#1e3a5c]">
                            <Shield className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm truncate">{userName}</h3>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#cc7832] text-white rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 space-y-0.5">
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[#25262f] transition-colors">
                      <Mail className="w-3.5 h-3.5 text-[#5294d0] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-[#585d6a] uppercase tracking-wider font-medium">Email</p>
                        <p className="text-[11px] text-[#c8ccd4] truncate mt-0.5">{user?.email || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-[#25262f] transition-colors">
                      <Calendar className="w-3.5 h-3.5 text-[#5294d0] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-[#585d6a] uppercase tracking-wider font-medium">Member Since</p>
                        <p className="text-[11px] text-[#c8ccd4] mt-0.5">{formatDate(user?.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden flex items-center justify-center w-9 h-9 text-[#848996] hover:text-white hover:bg-[#2c2d38] rounded-lg transition-all"
            title="Menu"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {onNavigateToAdmin && isAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#cc7832] hover:text-[#e8943e] hover:bg-[#cc7832]/[0.08] px-3 py-2 rounded-lg transition-all"
                title="Admin"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            )}

            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-xs font-medium text-[#848996] hover:text-[#cf6679] hover:bg-[#cf6679]/[0.08] px-3 py-2 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-xs font-semibold text-white px-4 py-2 rounded-lg bg-gradient-to-r from-[#3a6d9e] to-[#2a5580] hover:from-[#4480b3] hover:to-[#336599] transition-all shadow-sm shadow-[#3a6d9e]/20"
                title="Login"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </div>

      {showMobileMenu && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-[#1e1f26] border-b border-[#282934] shadow-2xl shadow-black/40 z-50 max-h-[calc(100vh-57px)] overflow-y-auto animate-slide-down"
        >
          <nav className="px-4 py-3 flex flex-col gap-1">
            {onNavigateToAdmin && isAdmin && (
              <button
                onClick={() => handleNavigate(onNavigateToAdmin)}
                className="flex items-center gap-2 text-sm font-semibold text-[#cc7832] hover:text-[#e8943e] hover:bg-[#cc7832]/[0.08] px-3 py-2.5 rounded-lg transition-all w-full text-left"
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            )}

            {user ? (
              <>
                <div className="border-t border-[#282934] my-1.5" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-sm font-medium text-[#848996] hover:text-[#cf6679] hover:bg-[#cf6679]/[0.08] px-3 py-2.5 rounded-lg transition-all w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-[#282934] my-1.5" />
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="text-sm font-semibold text-white px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#3a6d9e] to-[#2a5580] hover:from-[#4480b3] hover:to-[#336599] transition-all w-full text-center"
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
