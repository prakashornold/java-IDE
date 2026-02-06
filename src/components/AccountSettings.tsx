import { useState } from 'react';
import { ArrowLeft, User, Mail, Calendar, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';

interface AccountSettingsProps {
  onNavigateHome: () => void;
}

export function AccountSettings({ onNavigateHome }: AccountSettingsProps) {
  const { user, profile, isAdmin } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const userName = user?.user_metadata?.full_name ||
                   (profile?.first_name && profile?.last_name
                     ? `${profile.first_name} ${profile.last_name}`
                     : profile?.first_name || profile?.last_name || 'User');

  const userAvatar = user?.user_metadata?.avatar_url || profile?.avatar_url;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#13141a]">
      <header className="border-b border-[#282934] bg-[#1a1b22]">
        <div className="px-4 sm:px-6 py-2.5">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-medium text-[#848996] hover:text-[#c8ccd4] hover:bg-[#25262f] px-3 py-2 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="bg-[#1a1b22] rounded-xl border border-[#282934] shadow-2xl shadow-black/20 overflow-hidden">
          <div className="bg-gradient-to-br from-[#2a5580]/30 to-[#1a1b22] p-6 sm:p-8 border-b border-[#282934]">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4080b5] to-[#2a5580] flex items-center justify-center overflow-hidden shadow-lg shadow-[#3a6d9e]/20 border-2 border-[#5294d0]/20">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white/80" />
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#e8eaed] flex items-center gap-3 tracking-tight">
                  {userName}
                  {isAdmin && (
                    <span className="px-2.5 py-0.5 text-[10px] rounded-md bg-[#cc7832]/15 text-[#cc7832] font-bold border border-[#cc7832]/25">
                      ADMIN
                    </span>
                  )}
                </h1>
                <p className="text-sm text-[#848996] mt-1">Manage your profile information</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 px-4 py-3.5 rounded-lg bg-[#1e1f26] border border-[#282934] hover:border-[#383946] transition-colors">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#5294d0]/10 border border-[#5294d0]/15">
                  <User className="w-4 h-4 text-[#5294d0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#585d6a] font-medium uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-medium text-[#e8eaed] truncate mt-0.5">
                    {userName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-4 py-3.5 rounded-lg bg-[#1e1f26] border border-[#282934] hover:border-[#383946] transition-colors">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#5294d0]/10 border border-[#5294d0]/15">
                  <Mail className="w-4 h-4 text-[#5294d0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#585d6a] font-medium uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-medium text-[#e8eaed] truncate mt-0.5">
                    {user?.email || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-4 py-3.5 rounded-lg bg-[#1e1f26] border border-[#282934] hover:border-[#383946] transition-colors">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#5294d0]/10 border border-[#5294d0]/15">
                  <Calendar className="w-4 h-4 text-[#5294d0]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#585d6a] font-medium uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-medium text-[#e8eaed] mt-0.5">
                    {formatDate(user?.created_at)}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-4 px-4 py-3.5 rounded-lg bg-[#1e1f26] border border-[#282934] hover:border-[#383946] transition-colors">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#cc7832]/10 border border-[#cc7832]/15">
                    <Shield className="w-4 h-4 text-[#cc7832]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#585d6a] font-medium uppercase tracking-wider">Role</p>
                    <p className="text-sm font-medium text-[#cc7832] mt-0.5">
                      Administrator
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#3a6d9e] to-[#2a5580] hover:from-[#4480b3] hover:to-[#336599] disabled:from-[#333440] disabled:to-[#333440] disabled:text-[#585d6a] text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-sm shadow-[#3a6d9e]/20 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
