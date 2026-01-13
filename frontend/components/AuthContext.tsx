
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verification happens on mount via the secure cookie
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (e) {
        console.error("Session verification failed");
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
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(creds)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const register = async (userData: any) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
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
