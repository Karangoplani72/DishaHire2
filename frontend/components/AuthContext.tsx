
import React, { createContext, useContext, useState, useEffect } from 'react';

export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

interface UserProfile {
  id?: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loginEmail: (email: string, password: string) => Promise<boolean>;
  requestOTP: (identifier: string) => Promise<boolean>;
  verifyOTP: (identifier: string, code: string, name?: string) => Promise<boolean>;
  loginGoogle: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = (window as any).VITE_API_URL || 'https://dishahire-backend.onrender.com/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('dh_user_profile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem('dh_admin_token', token);
        localStorage.setItem('dh_user_profile', JSON.stringify(user));
        setUser(user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login request failed:", err);
      return false;
    }
  };

  const requestOTP = async (identifier: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const verifyOTP = async (identifier: string, code: string, name?: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, code, name })
      });
      if (res.ok) {
        const { token, user } = await res.json();
        localStorage.setItem('dh_admin_token', token);
        localStorage.setItem('dh_user_profile', JSON.stringify(user));
        setUser(user);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const loginGoogle = async (): Promise<boolean> => {
    try {
      // PRODUCTION SIMULATION: In a real environment, you'd use @react-oauth/google.
      // Here we simulate the successful "Google Identity" response and sync it with our backend.
      const name = prompt("Select Google Account (Simulation):", "Professional User");
      if (!name) return false;
      
      const email = name.toLowerCase().replace(/\s/g, '.') + "@gmail.com";

      const res = await fetch(`${API_BASE}/auth/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b08d3e&color=fff`,
          provider: 'GOOGLE'
        })
      });

      if (res.ok) {
        const { token, user } = await res.json();
        localStorage.setItem('dh_admin_token', token);
        localStorage.setItem('dh_user_profile', JSON.stringify(user));
        setUser(user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('External Login Sync Error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dh_admin_token');
    localStorage.removeItem('dh_user_profile');
    window.location.hash = '/';
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginEmail, 
      requestOTP,
      verifyOTP,
      loginGoogle,
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === UserRole.ADMIN
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
