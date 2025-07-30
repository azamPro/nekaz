import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { API_ENDPOINTS } from '../config/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        try {
          console.log('Attempting login for:', username);
          console.log('API endpoint:', API_ENDPOINTS.users);
          
          const response = await fetch(API_ENDPOINTS.users);
          
          if (!response.ok) {
            console.error('API response not ok:', response.status, response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const users: User[] = await response.json();
          console.log('Fetched users:', users.length);
          
          const user = users.find(u => u.username === username && u.password === password);
          
          if (user) {
            console.log('Login successful for user:', user.username);
            set({ user, isAuthenticated: true });
            return true;
          } else {
            console.log('Invalid credentials for username:', username);
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);