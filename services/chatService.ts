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

    // If it's product related, add an initial system message or context
    if (product) {
      newChat.messages.push({
        id: Date.now().toString(),
        senderId: 'system',
        text: `Inquiry regarding: ${product.name}`,
        timestamp: Date.now()
      });
    }

    allChats.push(newChat);
    localStorage.setItem(CHATS_KEY, JSON.stringify(allChats));
    return newChat.id;
  },

  sendMessage: (chatId: string, senderId: string, text: string): Conversation | null => {
    const stored = localStorage.getItem(CHATS_KEY);
    if (!stored) return null;
    
    let allChats: Conversation[] = JSON.parse(stored);
    const chatIndex = allChats.findIndex(c => c.id === chatId);

    if (chatIndex === -1) return null;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId,
      text,
      timestamp: Date.now()
    };

    allChats[chatIndex].messages.push(newMessage);
    allChats[chatIndex].lastMessage = newMessage;
    allChats[chatIndex].updatedAt = Date.now();

    localStorage.setItem(CHATS_KEY, JSON.stringify(allChats));

    // Simulate auto-reply for demo purposes (Simulated WebSocket event)
    setTimeout(() => {
        const currentStored = localStorage.getItem(CHATS_KEY);
        if (!currentStored) return;
        const currentChats: Conversation[] = JSON.parse(currentStored);
        const currentChatIndex = currentChats.findIndex(c => c.id === chatId);
        
        if (currentChatIndex !== -1) {
            const chat = currentChats[currentChatIndex];
            // Identify the other participant
            const otherParticipant = chat.participants.find(p => p.id !== senderId);
            
            if (otherParticipant) {
                const replyMsg: Message = {
                    id: Date.now().toString(),
                    senderId: otherParticipant.id,
                    text: `(Auto-reply) Thanks for your message! I'm interested in discussing this further.`,
                    timestamp: Date.now()
                };
                
                chat.messages.push(replyMsg);
                chat.lastMessage = replyMsg;
                chat.updatedAt = Date.now();
                
                localStorage.setItem(CHATS_KEY, JSON.stringify(currentChats));
            }
        }
    }, 4000); // 4 seconds delay to simulate network/typing

    return allChats[chatIndex];
  }
};