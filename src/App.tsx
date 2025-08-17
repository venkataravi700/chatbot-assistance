import React, { useState } from 'react';
import { NhostProvider, useAuthenticationStatus, useUserData } from '@nhost/react';
import { ApolloProvider } from '@apollo/client';
import { nhost } from './lib/nhost';
import { apolloClient } from './lib/apollo';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { EmailVerification } from './components/auth/EmailVerification';
import { ChatInterface } from './components/chat/ChatInterface';
import { Loader2 } from 'lucide-react';

type AuthView = 'sign-in' | 'sign-up' | 'email-verification';

const AuthFlow: React.FC = () => {
  const [authView, setAuthView] = useState<AuthView>('sign-in');
  
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const user = useUserData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show chat interface if user is authenticated AND verified
  if (isAuthenticated && user) {
    return <ChatInterface />;
  }


  switch (authView) {
    case 'sign-in':
      return (
        <SignIn 
          onSwitchToSignUp={() => setAuthView('sign-up')} 
        />
      );
    case 'sign-up':
      return (
        <SignUp 
          onSwitchToSignIn={() => setAuthView('sign-in')}
          onSignUpSuccess={() => setAuthView('email-verification')}
        />
      );
    case 'email-verification':
      return (
        <EmailVerification 
          onBackToSignIn={() => setAuthView('sign-in')}
        />
      );
    default:
      return null;
  }
};

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        <AuthFlow />
      </ApolloProvider>
    </NhostProvider>
  );
}

export default App;