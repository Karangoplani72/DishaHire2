
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id?: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (creds: any, isAdmin: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- SAFE FETCH UTILITY ---
const safeFetch = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  };

  const response = await fetch(url, { ...options, headers });
  
  // Defensive check for Content-Type
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e) {
      console.error('JSON Parsing failed even with header present');
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || `Server responded with status ${response.status}`);
  }

  return data;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await safeFetch('/api/auth/me');
        if (data?.user) setUser(data.user);
      } catch (e) {
        // Suppress session check errors for unauthenticated users
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (creds: any, isAdmin: boolean) => {
    setError(null);
    const endpoint = isAdmin ? '/api/admin/login' : '/api/auth/login';
    try {
      const data = await safeFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });
      if (data?.user) setUser(data.user);
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const register = async (userData: any) => {
    setError(null);
    try {
      const data = await safeFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (data?.user) setUser(data.user);
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await safeFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
