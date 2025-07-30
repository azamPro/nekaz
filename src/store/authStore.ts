// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { AuthState, User } from '../types';
// // import { API_ENDPOINTS } from '../config/api';



// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       isAuthenticated: false,
      
//       // login: async (username: string, password: string) => {
//       //   try {
//       //     const response = await fetch(API_ENDPOINTS.users);
//       //     // Direct fetch to the JSON server
//       //     // const response = await fetch('http://localhost:3001/users', {
//       //     //   method: 'GET',
//       //     //   headers: {
//       //     //     'Content-Type': 'application/json',
//       //     //   },
//       //     // });
          
//       //     if (!response.ok) {
//       //       throw new Error(`HTTP error! status: ${response.status}`);
//       //     }
          
//       //     const users: User[] = await response.json();
//       //     const user = users.find(u => u.username === username && u.password === password);
          
//       //     if (user) {
//       //       set({ user, isAuthenticated: true });
//       //       return true;
//       //     } else {
//       //       return false;
//       //     }
//       //   } catch (error) {
//       //     console.error('Login error:', error);
//       //     return false;
//       //   }
//       // },
//       // src/store/authStore.ts
//       // login: async (username: string, password: string) => {
//       //   set({
//       //     user: {
//       //       id: '0',                    // your ID type is string
//       //       username,
//       //       password,
//       //       name: username,             // fake “name”
//       //       email: `${username}@test`,  // fake “email”
//       //       role: 'admin'               // or any of 'admin'|'supervisor'|'viewer'
//       //     },
//       //     isAuthenticated: true
//       //   });
//       //   return true;
//       // },
//       login: async (u, p) => {
//         set({
//           user: { id: '0', username: u, password: p } as unknown as User,
//           isAuthenticated: true
//         });
//         return true;
//       },


          
//       logout: () => {
//         set({ user: null, isAuthenticated: false });
//       },
//     }),
//     {
//       name: 'auth-storage',
//     }
//   )
// );


import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User } from '../types'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ← PRE-AUTHENTICATE AS ADMIN by default:
      user: {
        id: '0',
        username: 'admin',
        password: '',
        name: 'Admin',
        email: 'admin@test.local',
        role: 'admin'
      } as User,
      isAuthenticated: true,

      // stub login() so it never actually fetches
      login: async (u, p) => {
        set({ isAuthenticated: true })
        return true
      },

      logout: () => {
        // if you ever want to “reset” you can:
        set({
          user: {
            id: '0',
            username: 'admin',
            password: '',
            name: 'Admin',
            email: 'admin@test.local',
            role: 'admin'
          },
          isAuthenticated: true
        })
      },
    }),
    { name: 'auth-storage' }
  )
)
