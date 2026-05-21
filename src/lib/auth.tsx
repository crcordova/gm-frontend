'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'gm_auth_user';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with real backend endpoint when available
      // const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.detail || 'Credenciales inválidas');
      // }
      // const data = await response.json();
      // const user: User = { ...data.user };

      // Simulated login for MVP2 frontend development
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email === 'demo@gmpropiedades.cl' && password === 'demo1234') {
        const user: User = {
          id: 'demo-user-001',
          email: 'demo@gmpropiedades.cl',
          name: 'Usuario Demo',
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('Credenciales inválidas. Prueba con demo@gmpropiedades.cl / demo1234');
      }
    } catch (e) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: e instanceof Error ? e.message : 'Error al iniciar sesión',
      }));
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with real backend endpoint when available
      // const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password }),
      // });
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.detail || 'Error al registrar usuario');
      // }
      // const data = await response.json();
      // const user: User = { ...data.user };

      await new Promise((resolve) => setTimeout(resolve, 800));

      const user: User = {
        id: `user-${Date.now()}`,
        email,
        name,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: e instanceof Error ? e.message : 'Error al registrar usuario',
      }));
      throw e;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const AuthContextProvider = AuthContext.Provider;
  return (
    <AuthContextProvider value={{ ...state, login, logout, register, clearError }}>
      {children}
    </AuthContextProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
