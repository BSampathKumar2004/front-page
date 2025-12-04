import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, User, Admin } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedAdmin = localStorage.getItem('admin');

    if (token) {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.userLogin({ email, password });
    localStorage.setItem('token', response.access_token);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    }
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  const adminLogin = async (email: string, password: string) => {
    const response = await authApi.adminLogin({ email, password });
    localStorage.setItem('token', response.access_token);
    if (response.admin) {
      localStorage.setItem('admin', JSON.stringify(response.admin));
      setAdmin(response.admin);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    const response = await authApi.userRegister({ email, password, name, phone });
    localStorage.setItem('token', response.access_token);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        isAuthenticated: !!(user || admin),
        isAdmin: !!admin,
        isLoading,
        login,
        adminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
