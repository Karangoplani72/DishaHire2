
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

const ADMIN_EMAIL = 'dishahire.0818@gmail.com';
const ADMIN_PASSWORD_HASH = 'DishaHire@Admin#2024';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dh_session_ptr');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const loginAdmin = async (password: string): Promise<boolean> => {
    if (password === ADMIN_PASSWORD_HASH) {
      const adminProfile: UserProfile = {
        email: ADMIN_EMAIL,
        name: 'Super Admin',
        role: UserRole.ADMIN
      };
      setUser(adminProfile);
      localStorage.setItem('dh_session_ptr', JSON.stringify(adminProfile));
      return true;
    }
    return false;
  };

  const loginGoogle = async () => {
    const googleProfile: UserProfile = {
      email: 'partner@gmail.com',
      name: 'Elite Partner',
      role: UserRole.USER,
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Executive'
    };
    setUser(googleProfile);
    localStorage.setItem('dh_session_ptr', JSON.stringify(googleProfile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dh_session_ptr');
    window.location.href = '#/'; 
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
