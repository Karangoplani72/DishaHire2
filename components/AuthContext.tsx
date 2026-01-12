
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
  // Fix: Added picture property to UserProfile to resolve missing property error in App.tsx
  picture?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loginAdmin: (password: string) => Promise<boolean>;
  // Fix: Added loginGoogle to AuthContextType to resolve missing property error in App.tsx
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
    try {
      const response = await fetch('/api/auth/login', {
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
      return false;
    }
  };

  // Fix: Implemented loginGoogle to handle Google authentication calls from the navbar
  const loginGoogle = async () => {
    try {
      // Mocking a Google login flow for demonstration
      const mockUser: UserProfile = {
        email: 'user@example.com',
        name: 'Guest User',
        role: UserRole.USER,
        picture: 'https://ui-avatars.com/api/?name=Guest+User&background=b08d3e&color=fff'
      };
      setUser(mockUser);
      localStorage.setItem('dh_user_profile', JSON.stringify(mockUser));
    } catch (err) {
      console.error('Google login error', err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dh_admin_token');
    localStorage.removeItem('dh_user_profile');
    window.location.href = '#/'; 
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginAdmin, 
      // Fix: Provided loginGoogle in context value
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
