
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
  provider?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loginEmail: (email: string, password: string) => Promise<boolean>;
  requestOTP: (identifier: string) => Promise<boolean>;
  verifyOTP: (identifier: string, code: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isChecking: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = (window as any).VITE_API_URL || 'https://dishahire-backend.onrender.com/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Industry Standard: On mount, verify the token with the server
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('dh_admin_token');
      if (!token) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token invalid
          localStorage.removeItem('dh_admin_token');
          localStorage.removeItem('dh_user_profile');
          setUser(null);
        }
      } catch (err) {
        console.error("Session verification failure.");
      } finally {
        setIsChecking(false);
      }
    };

    verifySession();
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
      console.error("Login Network Error:", err);
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
