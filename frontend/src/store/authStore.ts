import { create } from 'zustand';
import {jwtDecode} from 'jwt-decode';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeUser: () => void;
}

// Get backend URL from the environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  // Login
  login: async (email, password) => {
    try {
      const endpoint = '/api/auth/login';
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Invalid credentials');
      }

      const { user, token } = await response.json();

      // Store token in localStorage
      localStorage.setItem('auth_token', token);

      // Set user state in the store
      set({ user });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Register
  register: async (username, email, password) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Registration failed');
      }

      const { user, token } = await response.json();

      // Store token in localStorage
      localStorage.setItem('auth_token', token);

      // Set user state in the store
      set({ user });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    // Remove token from localStorage and reset the user state
    localStorage.removeItem('auth_token');
    set({ user: null });
  },

  // Initialize user from localStorage
  initializeUser: () => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      try {
        // Decode the token to extract user information
        const decoded: User = jwtDecode(token);

        // Set the user state in the store
        set({ user: decoded });
      } catch (error) {
        console.error('Failed to decode token:', error);

        // If token is invalid, clear it from localStorage
        localStorage.removeItem('auth_token');
        set({ user: null });
      }
    }
  },
}));
