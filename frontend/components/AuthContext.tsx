
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

// Robust API URL Discovery
const getApiUrl = () => {
  // Priority 1: Vite Environment Variable (Required for Render static frontend calling Render web backend)
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  
  // Priority 2: Relative path for co-located server (local dev or monolithic deploy)
  return ''; 
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
          headers: { 
            'Authorization': `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('dh_access_token');
        }
      } catch (e) {
        console.warn("Secure link failed. API unreachable at: " + (API_URL || 'relative path'));
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
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json().catch(() => ({ error: 'Communication breakdown with security server.' }));
      
      if (res.ok) {
        localStorage.setItem('dh_access_token', data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Verification refused by security gateway.' };
    } catch (e) {
      console.error('Network Error:', e);
      return { 
        success: false, 
        error: `Connectivity Lost: The server at ${API_URL || window.location.origin} refused the connection. Please check if the backend service is awake.` 
      };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/signup`, { // Fixed typo to use root api
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json().catch(() => ({ error: 'Gateway timeout.' }));
      if (res.ok) {
        localStorage.setItem('dh_access_token', data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Identity creation failed.' };
    } catch (e) {
      return { success: false, error: 'Network failure: Registration services are currently unreachable.' };
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
