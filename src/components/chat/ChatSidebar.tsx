import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useUserId } from '@nhost/react';
import { GET_CHATS, INSERT_CHAT } from '../../graphql/queries';
import { Plus, MessageCircle, Loader2 } from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ activeChatId, onChatSelect }) => {
  const userId = useUserId();
  const [isCreating, setIsCreating] = useState(false);
  
  const { data, loading, refetch } = useQuery(GET_CHATS, {
    variables: { userId },
    skip: !userId,
  });
  
  const [insertChat] = useMutation(INSERT_CHAT);

  const handleCreateChat = async () => {
    if (!userId) return;
    
    setIsCreating(true);
    try {
      const result = await insertChat({
        variables: {
          title: 'New Chat',
          userId,
        },
      });
      
      if (result.data?.insert_chats_one) {
        await refetch();
        onChatSelect(result.data.insert_chats_one.id);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const chats: Chat[] = data?.chats || [];

  return (
    <div className="w-80 bg-white/5 backdrop-blur-lg border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <button
          onClick={handleCreateChat}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No chats yet. Create your first chat!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  activeChatId === chat.id
                    ? 'bg-white/20 border border-white/30'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{chat.title}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(chat.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};