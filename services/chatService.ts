import { Conversation, Message, User, Product } from '../types';

const CHATS_KEY = 'nexus_chats';

export const chatService = {
  getConversations: (userId: string): Conversation[] => {
    const stored = localStorage.getItem(CHATS_KEY);
    if (!stored) return [];
    const allChats: Conversation[] = JSON.parse(stored);
    
    // Return chats where the user is a participant
    return allChats
      .filter(chat => chat.participants.some(p => p.id === userId))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },

  getConversation: (chatId: string): Conversation | undefined => {
    const stored = localStorage.getItem(CHATS_KEY);
    if (!stored) return undefined;
    const allChats: Conversation[] = JSON.parse(stored);
    return allChats.find(c => c.id === chatId);
  },

  startConversation: (currentUser: User, seller: User, product?: Product): string => {
    const stored = localStorage.getItem(CHATS_KEY);
    const allChats: Conversation[] = JSON.parse(stored || '[]');

    // Check if conversation already exists between these two users for this product
    // Or if generic chat, just between these two users
    const existingChat = allChats.find(c => {
      const hasCurrentUser = c.participants.some(p => p.id === currentUser.id);
      const hasSeller = c.participants.some(p => p.id === seller.id);
      
      // If product specific, check product ID match
      if (product) {
        return hasCurrentUser && hasSeller && c.productId === product.id;
      }
      return hasCurrentUser && hasSeller;
    });

    if (existingChat) {
      return existingChat.id;
    }

    // Create new conversation
    const newChat: Conversation = {
      id: Date.now().toString(),
      participants: [currentUser, seller],
      productId: product?.id,
      productName: product?.name,
      messages: [],
      updatedAt: Date.now()
    };

    allChats.push(newChat);
    localStorage.setItem(CHATS_KEY, JSON.stringify(allChats));
    return newChat.id;
  },

  sendMessage: (chatId: string, senderId: string, text: string): Conversation | null => {
    const stored = localStorage.getItem(CHATS_KEY);
    const allChats: Conversation[] = JSON.parse(stored || '[]');
    const chatIndex = allChats.findIndex(c => c.id === chatId);

    if (chatIndex === -1) return null;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId,
      text,
      timestamp: Date.now(),
      isRead: false
    };

    allChats[chatIndex].messages.push(newMessage);
    allChats[chatIndex].lastMessage = newMessage;
    allChats[chatIndex].updatedAt = Date.now();

    localStorage.setItem(CHATS_KEY, JSON.stringify(allChats));
    return allChats[chatIndex];
  },

  markAsRead: (chatId: string, userId: string): Conversation | null => {
    const stored = localStorage.getItem(CHATS_KEY);
    const allChats: Conversation[] = JSON.parse(stored || '[]');
    const chatIndex = allChats.findIndex(c => c.id === chatId);

    if (chatIndex === -1) return null;

    let hasUpdates = false;
    const updatedMessages = allChats[chatIndex].messages.map(msg => {
      // Mark messages as read if they weren't sent by the current user
      if (msg.senderId !== userId && !msg.isRead) {
        hasUpdates = true;
        return { ...msg, isRead: true };
      }
      return msg;
    });

    if (hasUpdates) {
      allChats[chatIndex].messages = updatedMessages;
      // Also update lastMessage if needed
      if (allChats[chatIndex].lastMessage && allChats[chatIndex].lastMessage.senderId !== userId) {
         allChats[chatIndex].lastMessage.isRead = true;
      }
      localStorage.setItem(CHATS_KEY, JSON.stringify(allChats));
      return allChats[chatIndex];
    }
    
    return allChats[chatIndex];
  }
};