import { Product } from '../types';

const WISHLIST_KEY = 'nexus_wishlist';

export const wishlistService = {
  getWishlist: (userId: string): Product[] => {
    const allLists = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '{}');
    return allLists[userId] || [];
  },

  addToWishlist: (userId: string, product: Product) => {
    const allLists = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '{}');
    const userList = allLists[userId] || [];
    
    if (!userList.some((p: Product) => p.id === product.id)) {
      userList.push(product);
      allLists[userId] = userList;
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(allLists));
    }
  },

  removeFromWishlist: (userId: string, productId: string) => {
    const allLists = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '{}');
    if (!allLists[userId]) return;
    
    allLists[userId] = allLists[userId].filter((p: Product) => p.id !== productId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(allLists));
  },

  isInWishlist: (userId: string, productId: string): boolean => {
    const allLists = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '{}');
    const userList = allLists[userId] || [];
    return userList.some((p: Product) => p.id === productId);
  }
};