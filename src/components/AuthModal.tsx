import { X, Terminal, Shield, User } from 'lucide-react';
import { createPortal } from 'react-dom';
import { supabase } from '../config/supabase';
import { useState, useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          handleClose();
        }
      } else {
        if (!firstName.trim() || !lastName.trim()) {
          setError('First name and last name are required');
          setLoading(false);
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: `${firstName.trim()} ${lastName.trim()}`,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          setSuccess('Account created successfully! You are now logged in.');
          setTimeout(() => {
            handleClose();
          }, 1500);
        }
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setError('');
    setSuccess('');
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
                <h2 className="text-lg font-bold text-[#e8eaed] tracking-tight">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-[11px] text-[#585d6a]">
                  {isLogin ? 'Sign in to your account' : 'Join JavaCodingPractice.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#585d6a] hover:text-[#c8ccd4] hover:bg-[#25262f] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#848996] mb-1.5">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#585d6a]" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#1a1b22] border border-[#282934] rounded-lg text-sm text-[#c8ccd4] placeholder:text-[#3e4250] focus:border-[#5294d0] focus:outline-none transition-colors"
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#848996] mb-1.5">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#585d6a]" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#1a1b22] border border-[#282934] rounded-lg text-sm text-[#c8ccd4] placeholder:text-[#3e4250] focus:border-[#5294d0] focus:outline-none transition-colors"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#848996] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 bg-[#1a1b22] border border-[#282934] rounded-lg text-sm text-[#c8ccd4] placeholder:text-[#3e4250] focus:border-[#5294d0] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#848996] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2.5 bg-[#1a1b22] border border-[#282934] rounded-lg text-sm text-[#c8ccd4] placeholder:text-[#3e4250] focus:border-[#5294d0] focus:outline-none transition-colors"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#cf6679]/10 border border-[#cf6679]/20 text-xs text-[#cf6679] animate-fade-in">
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#6aab73]/10 border border-[#6aab73]/20 text-xs text-[#6aab73] animate-fade-in">
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-[#3a6d9e] to-[#2a5580] hover:from-[#4480b3] hover:to-[#336599] disabled:from-[#333440] disabled:to-[#333440] disabled:text-[#585d6a] text-white transition-all shadow-sm shadow-[#3a6d9e]/20"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="text-xs text-[#848996] hover:text-[#5294d0] transition-colors"
              >
                {isLogin ? (
                  <>Don't have an account? <span className="font-semibold text-[#5294d0]">Sign up</span></>
                ) : (
                  <>Already have an account? <span className="font-semibold text-[#5294d0]">Sign in</span></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
