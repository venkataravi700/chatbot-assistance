import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useUserId } from '@nhost/react';
import { INSERT_MESSAGE, SEND_MESSAGE_ACTION, UPDATE_CHAT_TITLE } from '../../graphql/queries';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  chatId: string;
  onSendingStart: () => void;
  onSendingEnd: () => void;
  isFirstMessage?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  onSendingStart,
  onSendingEnd,
  isFirstMessage = false,
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userId = useUserId();
  
  const [insertMessage] = useMutation(INSERT_MESSAGE);
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);
  const [updateChatTitle] = useMutation(UPDATE_CHAT_TITLE);

  const generateChatTitle = (message: string): string => {
    // Take first 50 characters and add ellipsis if longer
    const title = message.trim().substring(0, 50);
    return title.length < message.trim().length ? `${title}...` : title;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !userId || isLoading) return;

    const messageContent = message.trim();
    setMessage('');
    setIsLoading(true);
    onSendingStart();

    try {
      // Update chat title if this is the first message
      if (isFirstMessage) {
        await updateChatTitle({
          variables: {
            chatId,
            title: generateChatTitle(messageContent),
          },
        });
      }

      // First mutation: Insert user message
      await insertMessage({
        variables: {
          chatId,
          content: messageContent,
        },
      });

      // Second mutation: Trigger AI response
      await sendMessageAction({
        variables: {
          input: { 
            text: messageContent,
            chat_id: chatId 
          },
        },
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message on error
      setMessage(messageContent);
    } finally {
      setIsLoading(false);
      onSendingEnd();
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border-t border-white/10 p-6">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            rows={3}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="self-end bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send</span>
            </>
          )}
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};