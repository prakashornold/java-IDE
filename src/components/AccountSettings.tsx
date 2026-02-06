import { useState } from 'react';
import { ArrowLeft, User, Mail, Calendar, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';

interface AccountSettingsProps {
  onNavigateHome: () => void;
}

export function AccountSettings({ onNavigateHome }: AccountSettingsProps) {
  const { user, profile, refreshProfile, isAdmin } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const userName = user?.user_metadata?.full_name ||
                   (profile?.first_name && profile?.last_name
                     ? `${profile.first_name} ${profile.last_name}`
                     : profile?.first_name || profile?.last_name || 'User');

  const userAvatar = user?.user_metadata?.avatar_url || profile?.avatar_url;

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setTimeout(() => setRefreshing(false), 500);
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
        <div className="px-4 sm:px-6 py-3">
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
        <div className="bg-[#1a1b22] rounded-xl border border-[#282934] shadow-2xl shadow-black/20">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#3a6d9e] to-[#2a5580] mb-4 overflow-hidden shadow-lg shadow-[#3a6d9e]/15">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-[#e0e4ea] mb-2 flex items-center justify-center gap-3 tracking-tight">
                Account Settings
                {isAdmin && (
                  <span className="px-2.5 py-0.5 text-[10px] rounded-md bg-[#cc7832]/15 text-[#cc7832] font-bold border border-[#cc7832]/25">
                    ADMIN
                  </span>
                )}
              </h1>
              <p className="text-[#848996]">
                Manage your profile information
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-[#1e1f26] rounded-lg p-6 border border-[#282934]">
                <h2 className="text-lg font-semibold text-[#e0e4ea] mb-4 tracking-tight">Profile Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#5294d0]/10 border border-[#5294d0]/20">
                      <User className="w-5 h-5 text-[#5294d0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#585d6a] mb-1 font-medium">Full Name</p>
                      <p className="text-base font-medium text-[#e0e4ea] truncate">
                        {userName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#5294d0]/10 border border-[#5294d0]/20">
                      <Mail className="w-5 h-5 text-[#5294d0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#585d6a] mb-1 font-medium">Email Address</p>
                      <p className="text-base font-medium text-[#e0e4ea] truncate">
                        {user?.email || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#5294d0]/10 border border-[#5294d0]/20">
                      <Calendar className="w-5 h-5 text-[#5294d0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#585d6a] mb-1 font-medium">Member Since</p>
                      <p className="text-base font-medium text-[#e0e4ea]">
                        {formatDate(user?.created_at)}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#cc7832]/10 border border-[#cc7832]/20">
                        <Shield className="w-5 h-5 text-[#cc7832]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#585d6a] mb-1 font-medium">Role</p>
                        <p className="text-base font-medium text-[#cc7832]">
                          Administrator
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#3a6d9e] to-[#2a5580] hover:from-[#4480b3] hover:to-[#336599] disabled:from-[#333440] disabled:to-[#333440] disabled:text-[#585d6a] text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-[#3a6d9e]/15"
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
