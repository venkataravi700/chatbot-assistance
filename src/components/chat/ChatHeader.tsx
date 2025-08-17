import React from 'react';
import { useSignOut, useUserData } from '@nhost/react';
import { LogOut, MessageCircle } from 'lucide-react';
import { ConfirmationModal } from '../ui/ConfirmationModal';

export const ChatHeader: React.FC = () => {
  const [showSignOutModal, setShowSignOutModal] = React.useState(false);
  const { signOut } = useSignOut();
  const user = useUserData();

  const handleSignOut = () => {
    signOut();
    setShowSignOutModal(false);
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-semibold text-white">AI Chat</h1>
              <p className="text-sm text-gray-400">Powered by OpenRouter</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">{user?.displayName}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={() => setShowSignOutModal(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out? You'll need to sign in again to access your chats."
        confirmText="Sign Out"
        cancelText="Cancel"
        type="warning"
      />
    </>
  );
};