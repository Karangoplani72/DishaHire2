
import React, { createContext, useContext, useState, useEffect } from 'react';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

interface UserProfile {
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loginEmail: (email: string, password: string) => Promise<boolean>;
  signupEmail: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isChecking: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = '/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isChecking, setIsChecking] = useState(true);

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
          localStorage.removeItem('dh_admin_token');
          localStorage.removeItem('dh_user_profile');
          setUser(null);
        }
      } catch (err) {
        console.error("Session restoration failed.");
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
      return false;
    }
  };

  const signupEmail = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
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
      signupEmail,
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
