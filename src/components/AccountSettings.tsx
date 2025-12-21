import { useState } from 'react';
import { ArrowLeft, User, Mail, Calendar, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen bg-[#0d1117]">
      <header className="border-b border-[#323232] bg-[#1e1e1e]">
        <div className="px-4 sm:px-6 py-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-[#1e1e1e] rounded-xl border border-[#323232] shadow-2xl">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 overflow-hidden">
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
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                Account Settings
                {isAdmin && (
                  <span className="px-3 py-1 text-xs rounded bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold">
                    ADMIN
                  </span>
                )}
              </h1>
              <p className="text-gray-400">
                Manage your profile information
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-[#161b22] rounded-lg p-6 border border-[#323232]">
                <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <User className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1">Full Name</p>
                      <p className="text-base font-medium text-white truncate">
                        {userName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <Mail className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1">Email Address</p>
                      <p className="text-base font-medium text-white truncate">
                        {user?.email || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1">Member Since</p>
                      <p className="text-base font-medium text-white">
                        {formatDate(user?.created_at)}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <Shield className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 mb-1">Role</p>
                        <p className="text-base font-medium text-yellow-400">
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
                  className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
