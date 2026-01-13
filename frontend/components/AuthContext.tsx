
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

// --- SECURE FETCH GATEWAY ---
const safeFetch = async (url: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, { 
    ...options, 
    headers,
    credentials: 'include' // MANDATORY for cross-origin JWT cookies
  });
  
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e) {
      console.error('API Response Parse Failure');
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || `Gateway Error: ${response.status}`);
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
        // No session is expected on landing for unauthenticated users
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
    window.location.hash = '#/login';
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
