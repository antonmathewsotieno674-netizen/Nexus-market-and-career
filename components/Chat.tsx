import React, { useState, useEffect, useRef } from 'react';
import { User, Conversation } from '../types';
import { chatService } from '../services/chatService';
import { Send, User as UserIcon, MessageSquare, ArrowLeft } from 'lucide-react';

interface ChatProps {
  user: User;
  initialChatId?: string | null;
}

export const Chat: React.FC<ChatProps> = ({ user, initialChatId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mobile view state
  const [isMobileView, setIsMobileView] = useState(false);
  const [showList, setShowList] = useState(true);

  useEffect(() => {
    loadConversations();
    
    // Responsive check
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [user.id]);

  useEffect(() => {
    if (initialChatId) {
      const chat = chatService.getConversation(initialChatId);
      if (chat) {
        setSelectedChat(chat);
        if (isMobileView) setShowList(false);
      }
    }
  }, [initialChatId, isMobileView]);

  // Real-time polling effect
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // 1. Check for conversation list updates
      const latestChats = chatService.getConversations(user.id);
      
      setConversations(prev => {
        // Simple comparison to prevent unnecessary re-renders if data hasn't changed
        // In a real app with large data, we might check timestamps specifically
        if (JSON.stringify(prev) !== JSON.stringify(latestChats)) {
            return latestChats;
        }
        return prev;
      });

      // 2. Check for active chat updates (new messages)
      if (selectedChat) {
        const updatedChat = chatService.getConversation(selectedChat.id);
        if (updatedChat) {
             // Only update state if message count differs or ID matches but last message changed
             if (updatedChat.messages.length > selectedChat.messages.length) {
                 setSelectedChat(updatedChat);
             }
        }
      }
    }, 1000); // Poll every second

    return () => clearInterval(pollInterval);
  }, [user.id, selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const loadConversations = () => {
    const chats = chatService.getConversations(user.id);
    setConversations(chats);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const updatedChat = chatService.sendMessage(selectedChat.id, user.id, newMessage);
    if (updatedChat) {
      setSelectedChat(updatedChat);
      setNewMessage('');
      loadConversations(); // Update list to show latest message
    }
  };

  const getOtherParticipant = (chat: Conversation) => {
    return chat.participants.find(p => p.id !== user.id) || { name: 'Unknown User', avatar: '?' };
  };

  const selectChat = (chat: Conversation) => {
    setSelectedChat(chat);
    if (isMobileView) setShowList(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-8rem)] flex animate-fade-in">
      
      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-gray-100 bg-gray-50 flex flex-col ${isMobileView && !showList ? 'hidden' : 'block'}`}>
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-indigo-600" />
            Messages
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
             <div className="p-8 text-center text-gray-400">
               <p className="text-sm">No conversations yet.</p>
             </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map(chat => {
                const otherUser = getOtherParticipant(chat);
                const isActive = selectedChat?.id === chat.id;
                
                return (
                  <div 
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    className={`p-4 cursor-pointer hover:bg-white transition-colors ${isActive ? 'bg-white border-l-4 border-indigo-600' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                        {/* @ts-ignore - handling potential missing avatar */}
                        {otherUser.avatar || otherUser.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden w-full">
                        <div className="flex justify-between items-baseline">
                           {/* @ts-ignore */}
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{otherUser.name}</h4>
                          <span className="text-[10px] text-gray-400">
                            {new Date(chat.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        {chat.productName && (
                           <p className="text-xs text-indigo-500 font-medium truncate mb-0.5">{chat.productName}</p>
                        )}
                        <p className={`text-sm truncate text-gray-500`}>
                          {chat.lastMessage?.text || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${isMobileView && showList ? 'hidden' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 shadow-sm z-10">
              {isMobileView && (
                <button onClick={() => setShowList(true)} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                 {/* @ts-ignore */}
                 {getOtherParticipant(selectedChat).avatar || getOtherParticipant(selectedChat).name.charAt(0)}
              </div>
              <div>
                {/* @ts-ignore */}
                <h3 className="font-bold text-gray-900">{getOtherParticipant(selectedChat).name}</h3>
                {selectedChat.productName && (
                  <p className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
                    Topic: {selectedChat.productName}
                  </p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
              {selectedChat.messages.map(msg => {
                const isMe = msg.senderId === user.id;
                const isSystem = msg.senderId === 'system';
                
                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-4">
                      <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                      <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-8">
            <MessageSquare size={64} className="mb-4 text-gray-200" />
            <p className="text-gray-500 text-lg font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};