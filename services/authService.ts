import { User } from '../types';

// Mock user database
const MOCK_USERS_KEY = 'nexus_mock_users';
const CURRENT_USER_KEY = 'nexus_current_user';

// Simple mock hash function for demonstration
const hashPassword = async (password: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Demo Account fallback
    if (email === 'demo@example.com' && password === 'password') {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'demo@example.com',
        avatar: 'JD'
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }

    const hashedPassword = await hashPassword(password);
    
    // Check registered users in local storage
    const storedUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === hashedPassword);

    if (foundUser) {
      const { password, ...userWithoutPass } = foundUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPass));
      return userWithoutPass;
    }

    throw new Error('Invalid email or password');
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const storedUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
    
    if (storedUsers.some((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = { 
      id: Date.now().toString(), 
      name, 
      email, 
      password: hashedPassword, 
      avatar: name.substring(0, 2).toUpperCase() 
    };
    
    storedUsers.push(newUser);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(storedUsers));

    const { password: _, ...userWithoutPass } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPass));
    return userWithoutPass;
  },

  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  resetPassword: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real app, this would trigger an API call to send an email
    // For privacy security, we typically don't reveal if the email exists or not in the UI error
    return;
  }
};