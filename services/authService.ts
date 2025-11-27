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
  login: async (identifier: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const hashedPassword = await hashPassword(password);
    
    // Check registered users in local storage
    const storedUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
    
    // Find user by email OR phone
    const foundUser = storedUsers.find((u: any) => 
      (u.email === identifier || u.phone === identifier) && u.password === hashedPassword
    );

    // Demo Account fallback
    if (!foundUser && (identifier === 'demo@example.com' || identifier === '0700000000') && password === 'password') {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'demo@example.com',
        phone: '0700000000',
        avatar: 'JD'
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }

    if (foundUser) {
      const { password, ...userWithoutPass } = foundUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPass));
      return userWithoutPass;
    }

    throw new Error('Invalid credentials');
  },

  register: async (name: string, identifier: string, password: string, method: 'email' | 'phone'): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const storedUsers = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
    
    // Check duplication
    if (storedUsers.some((u: any) => u[method] === identifier)) {
      throw new Error(`User with this ${method} already exists`);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = { 
      id: Date.now().toString(), 
      name, 
      [method]: identifier, // dynamic key: email or phone
      email: method === 'email' ? identifier : '', // ensure fields exist
      phone: method === 'phone' ? identifier : '',
      password: hashedPassword, 
      avatar: name.substring(0, 2).toUpperCase() 
    };
    
    storedUsers.push(newUser);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(storedUsers));

    const { password: _, ...userWithoutPass } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPass));
    return userWithoutPass;
  },

  loginWithProvider: async (provider: string): Promise<User> => {
    // Simulate popup and network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create a mock user based on the provider
    const mockUser: User = {
      id: `social-${Date.now()}`,
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      avatar: provider.charAt(0).toUpperCase(),
      bio: `Joined via ${provider}`
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  resetPassword: async (identifier: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real app, this would trigger an API call
    return;
  }
};