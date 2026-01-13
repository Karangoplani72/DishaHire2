
import React, { createContext, useContext, useState, useEffect } from 'react';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isChecking: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getApiUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  return envUrl ? (envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl) : '';
};
const API_URL = getApiUrl();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const fetchWithAuth = async (url: string, options: any = {}) => {
    const token = localStorage.getItem('dh_token');
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };
    return fetch(`${API_URL}${url}`, { ...options, headers });
  };

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('dh_token');
      if (!token) {
        setIsChecking(false);
        return;
      }
      try {
        const res = await fetchWithAuth('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('dh_token');
        }
      } catch (e) {
        console.error("Connectivity issue with Auth service");
      } finally {
        setIsChecking(false);
      }
    };
    verify();
  }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      const res = await fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('dh_token', data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (e) {
      return { success: false, error: 'Network failure: API unreachable' };
    }
  };

  const loginAdmin = async (password: string) => {
    try {
      const res = await fetchWithAuth('/api/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ email: 'dishahire.0818@gmail.com', password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('dh_token', data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Admin access denied' };
    } catch (e) {
      return { success: false, error: 'Network failure: Admin service unreachable' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetchWithAuth('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('dh_token', data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (e) {
      return { success: false, error: 'Network failure' };
    }
  };

  const logout = () => {
    localStorage.removeItem('dh_token');
    setUser(null);
    window.location.hash = '#/';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginUser, 
      loginAdmin, 
      register, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === UserRole.ADMIN,
      isChecking 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
