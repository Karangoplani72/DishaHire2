
import React, { createContext, useContext, useState, useEffect } from 'react';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isChecking: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Resolve API URL dynamically
const getApiUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  return envUrl ? (envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl) : '';
};
const API_URL = getApiUrl();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('dh_access_token');
      if (!token) {
        setIsChecking(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('dh_access_token');
        }
      } catch (e) {
        console.error("Auth verify failed: Service unreachable at " + API_URL);
      } finally {
        setIsChecking(false);
      }
    };
    verify();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('dh_access_token', data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Identity verification failed' };
    } catch (e) {
      console.error('Login error:', e);
      return { success: false, error: 'Network failure: The authentication server at ' + (API_URL || 'local host') + ' is unreachable.' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('dh_access_token', data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Account creation failed' };
    } catch (e) {
      console.error('Signup error:', e);
      return { success: false, error: 'Network failure: Unable to connect to registration services.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('dh_access_token');
    setUser(null);
    window.location.hash = '#/';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
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
