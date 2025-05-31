import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    apiKey?: string;
  } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  saveApiKey: (apiKey: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        // In a real app, you would validate credentials with a backend
        // For demo purposes, we'll simulate a successful login
        set({
          user: {
            id: '1',
            name: 'Demo User',
            email,
            apiKey: '',
          },
          isAuthenticated: true,
        });
      },
      
      register: async (name, email, password) => {
        // In a real app, you would send registration data to a backend
        // For demo purposes, we'll simulate a successful registration
        set({
          user: {
            id: '1',
            name,
            email,
            apiKey: '',
          },
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      saveApiKey: (apiKey) => {
        set((state) => ({
          user: state.user ? { ...state.user, apiKey } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);