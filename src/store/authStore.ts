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
          const response = await fetch(API_ENDPOINTS.users);
          // Direct fetch to the JSON server
          // const response = await fetch('http://localhost:3001/users', {
          //   method: 'GET',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          // });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const users: User[] = await response.json();
          const user = users.find(u => u.username === username && u.password === password);
          
          if (user) {
            set({ user, isAuthenticated: true });
            return true;
          } else {
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