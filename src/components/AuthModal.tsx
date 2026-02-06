import { X, Terminal, Shield } from 'lucide-react';
import { createPortal } from 'react-dom';
import { supabase } from '../config/supabase';
import { useState, useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (signInError) {
        setError(signInError.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#13141a]/85 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md bg-[#1e1f26] border border-[#383946] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-scale-in">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#5294d0]/[0.04] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#5294d0]/[0.02] to-transparent pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between p-5 pb-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#4080b5] to-[#2a5580] rounded-xl flex items-center justify-center shadow-lg shadow-[#3a6d9e]/15">
                <Terminal className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#f1f3f5] tracking-tight">
                  Welcome
                </h2>
                <p className="text-xs text-[#7d8490]">
                  Sign in to JavaCodingPractice.com
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7d8490] hover:text-[#d5d9e0] hover:bg-[#25262f] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#cf6679]/10 border border-[#cf6679]/20 text-xs text-[#cf6679] animate-fade-in">
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold text-sm bg-white hover:bg-gray-50 disabled:bg-[#333440] disabled:text-[#7d8490] text-[#3c4043] transition-all shadow-sm"
            >
              {loading ? (
                'Please wait...'
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-[#5d6472]">
              By signing in, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
