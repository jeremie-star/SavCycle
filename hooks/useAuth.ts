// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { login as loginService, signup as signupService, logout as logoutService } from '../services/api';

// Define types for user, token, and credentials
interface User {
  // Define the structure of your user object here
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  role: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthHook {
  user: User | null;
  token: string | null;
  login: (credentials: Credentials) => Promise<void>;
  signup: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
}

interface UserData {
  full_name: string;
  phone_number: string;
  email: string;
  password: string;
  role: string;
}

export const useAuth = (): AuthHook => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally, fetch user data based on the token
    }
  }, []);

  const login = async (credentials: Credentials) => {
    try {
      const response = await loginService(credentials);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      // Optionally, fetch user data based on the token
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const signup = async (userData: UserData) => {
    try {
      const response = await signupService(userData);
      // setToken(response.data.token);
      // localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_created', response.data.token);
      // Optionally, fetch user data based on the token
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { user, token, login, signup, logout };
};
