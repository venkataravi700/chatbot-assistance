import React, { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { GET_MESSAGES } from '../../graphql/queries';
import { ChatHeader } from './ChatHeader';
import { ChatSidebar } from './ChatSidebar';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const ChatInterface: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isAIResponding, setIsAIResponding] = useState(false);

  // Check if this is the first message in the chat
  const { data: messagesData } = useSubscription(GET_MESSAGES, {
    variables: { chatId: activeChatId },
    skip: !activeChatId,
  });
  
  const messageCount = messagesData?.messages?.length || 0;
  const isFirstMessage = messageCount === 0;
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col">
      <ChatHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          activeChatId={activeChatId}
          onChatSelect={setActiveChatId}
        />
        
        <div className="flex-1 flex flex-col">
          {activeChatId ? (
            <>
              <MessageList 
                chatId={activeChatId} 
                isLoading={isAIResponding}
              />
              <MessageInput
                chatId={activeChatId}
                onSendingStart={() => setIsAIResponding(true)}
                onSendingEnd={() => setIsAIResponding(false)}
                isFirstMessage={isFirstMessage}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">💬</span>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Welcome to AI Chat
                </h2>
                <p className="text-gray-400">
                  Select a chat from the sidebar or create a new one to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};