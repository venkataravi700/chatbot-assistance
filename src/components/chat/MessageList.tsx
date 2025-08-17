import React, { useEffect, useRef } from 'react';
import { useSubscription } from '@apollo/client';
import { useUserId } from '@nhost/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GET_MESSAGES } from '../../graphql/queries';
import { Loader2, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
}

interface MessageListProps {
  chatId: string;
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ chatId, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = useUserId();
  
  const { data, loading, error } = useSubscription(GET_MESSAGES, {
    variables: { chatId },
    skip: !chatId,
  });

  const messages: Message[] = data?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-400 font-medium">Failed to load messages</p>
          <p className="text-gray-400 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Bot className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">Start a conversation</p>
            <p className="text-gray-500 text-sm">Send a message to begin chatting with the AI</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => {
            const isUserMessage = message.user_id === currentUserId;
            return (
            <div
              key={message.id}
              className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-3xl ${
                  isUserMessage ? 'flex-row-reverse' : 'flex-row'
                } space-x-3 space-x-reverse`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isUserMessage
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                      : 'bg-gradient-to-r from-green-500 to-teal-600'
                  }`}
                >
                  {isUserMessage ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-6 py-4 max-w-2xl ${
                    isUserMessage
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                  }`}
                >
                  {isUserMessage ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Custom styling for markdown elements
                          h1: ({children}) => <h1 className="text-xl font-bold mb-3 text-white">{children}</h1>,
                          h2: ({children}) => <h2 className="text-lg font-semibold mb-2 text-white">{children}</h2>,
                          h3: ({children}) => <h3 className="text-base font-medium mb-2 text-white">{children}</h3>,
                          p: ({children}) => <p className="mb-2 leading-relaxed text-white">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1 text-white">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1 text-white">{children}</ol>,
                          li: ({children}) => <li className="text-white">{children}</li>,
                          strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                          em: ({children}) => <em className="italic text-white">{children}</em>,
                          code: ({children}) => <code className="bg-black/20 px-1 py-0.5 rounded text-blue-200 font-mono text-sm">{children}</code>,
                          pre: ({children}) => <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto mb-2">{children}</pre>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-200 mb-2">{children}</blockquote>,
                          a: ({href, children}) => <a href={href} className="text-blue-300 hover:text-blue-200 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                          hr: () => <hr className="border-white/20 my-3" />,
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                  <p
                    className={`text-xs mt-2 ${
                      isUserMessage ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-white">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};