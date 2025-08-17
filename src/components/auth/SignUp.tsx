import React, { useState } from 'react';
import { useSignUpEmailPassword } from '@nhost/react';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

interface SignUpProps {
  onSwitchToSignIn: () => void;
  onSignUpSuccess: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSwitchToSignIn, onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signUpEmailPassword, isLoading, error } = useSignUpEmailPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signUpEmailPassword(email, password, {
      displayName,
    });
    
    if (result.isSuccess) {
      onSignUpSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-green-100">Join us and start chatting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-200 w-5 h-5" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-200 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-200 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-12 pr-12 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-200 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 text-red-100">
                {error.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-green-100">
              Already have an account?{' '}
              <button
                onClick={onSwitchToSignIn}
                className="text-white font-semibold hover:text-green-200 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};