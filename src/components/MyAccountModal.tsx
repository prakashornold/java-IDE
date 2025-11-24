import { X, User, Mail, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyAccountModal({ isOpen, onClose }: MyAccountModalProps) {
  const { user, profile, signOut } = useAuth();

  if (!isOpen) return null;

  const handleSignOut = async () => {
    await signOut();
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 overflow-hidden">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.first_name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              My Account
            </h2>
            <p className="text-gray-400 text-sm">
              Your profile information
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">Full Name</p>
                  <p className="text-sm font-medium text-white truncate">
                    {profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.first_name || profile?.last_name || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <p className="text-sm font-medium text-white truncate">
                    {user?.email || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">Member Since</p>
                  <p className="text-sm font-medium text-white">
                    {formatDate(user?.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
