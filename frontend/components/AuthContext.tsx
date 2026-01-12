
import React, { createContext, useContext, useState, useEffect } from 'react';

export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN'
}

interface UserProfile {
  email: string;
  name: string;
  role: UserRole;
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loginAdmin: (password: string) => Promise<boolean>;
  loginGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('dh_user_profile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginAdmin = async (password: string): Promise<boolean> => {
    // UPDATED: Pointing to live backend URL
    const API_BASE = (window as any).VITE_API_URL || 'https://dishahire-backend.onrender.com/api';
    
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'dishahire.0818@gmail.com', password })
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

  const loginGoogle = async () => {
    const mockUser: UserProfile = {
      email: 'user@example.com',
      name: 'Guest User',
      role: UserRole.USER,
      picture: 'https://ui-avatars.com/api/?name=Guest+User&background=b08d3e&color=fff'
    };
    setUser(mockUser);
    localStorage.setItem('dh_user_profile', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dh_admin_token');
    localStorage.removeItem('dh_user_profile');
    // Using reload to clear any sensitive state
    window.location.hash = '/';
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginAdmin, 
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
