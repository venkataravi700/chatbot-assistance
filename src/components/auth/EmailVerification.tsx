import React from 'react';
import { useSignOut } from '@nhost/react';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';

interface EmailVerificationProps {
  onBackToSignIn: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ onBackToSignIn }) => {
  const { signOut } = useSignOut();

  const handleSignOut = () => {
    signOut();
    onBackToSignIn();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="mb-8">
            <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Check Your Email</h1>
            <p className="text-purple-100">
              We've sent you a verification link. Please check your email and click the link to verify your account, then refresh this page.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-white text-sm">Check your inbox (and spam folder)</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-white text-sm">Click the verification link</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-white text-sm">Return here to sign in</p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 mb-4 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>I've verified my email</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200"
            >
              Sign out and try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};