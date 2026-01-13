
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminProfile {
  email: string;
  name: string;
}

// Added UserProfile to match expectations in Candidate Portal
interface UserProfile {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  admin: AdminProfile | null;
  user: UserProfile | null; // Added user property
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>; // Added loginUser
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>; // Added register
  logout: () => void;
  isAuthenticated: boolean;
  isChecking: boolean;
  adminEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getApiUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  return envUrl ? (envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl) : '';
};
const API_URL = getApiUrl();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null); // Added user state
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Fetch public admin identity for login field pre-fill
      try {
        const idRes = await fetch(`${API_URL}/api/admin/identity`);
        const idData = await idRes.json().catch(() => ({}));
        if (idData.email) setAdminEmail(idData.email);
      } catch (e) {
        console.warn("System identity fetch failed");
      }

      // 2. Verify existing sessions
      const adminToken = localStorage.getItem('dh_admin_token');
      const userToken = localStorage.getItem('dh_access_token');
      
      try {
        const promises = [];
        if (adminToken) {
          promises.push(fetch(`${API_URL}/api/admin/me`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
          }).then(res => res.ok ? res.json() : null).catch(() => null));
        } else {
          promises.push(Promise.resolve(null));
        }

        if (userToken) {
          promises.push(fetch(`${API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
          }).then(res => res.ok ? res.json() : null).catch(() => null));
        } else {
          promises.push(Promise.resolve(null));
        }

        const [adminData, userData] = await Promise.all(promises);
        
        if (adminData) {
          setAdmin(adminData);
        } else if (adminToken) {
          localStorage.removeItem('dh_admin_token');
        }
        
        if (userData?.user) {
          setUser(userData.user);
        } else if (userToken) {
          localStorage.removeItem('dh_access_token');
        }
      } catch (e) {
        console.error("Session verification failed");
      } finally {
        setIsChecking(false);
      }
    };

    initializeAuth();
  }, []);

  const loginAdmin = async (password: string) => {
    if (!adminEmail) {
      return { success: false, error: 'System identity not established. Please refresh.' };
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem('dh_admin_token', data.token);
        setAdmin(data.admin);
        return { success: true };
      }
      return { success: false, error: data.error || 'Identity verification failed' };
    } catch (e) {
      return { success: false, error: 'Network failure: Admin gateway unreachable' };
    }
  };

  // Added loginUser implementation to handle candidate logins
  const loginUser = async (email: string, password: string) => {
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
      return { success: false, error: 'Network failure' };
    }
  };

  // Added register implementation to handle candidate signups
  const register = async (name: string, email: string, password: string) => {
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
      return { success: false, error: 'Network failure' };
    }
  };

  const logout = () => {
    localStorage.removeItem('dh_admin_token');
    localStorage.removeItem('dh_access_token');
    setAdmin(null);
    setUser(null);
    window.location.hash = '#/admin/login';
  };

  return (
    <AuthContext.Provider value={{ 
      admin, 
      user, // Provided user in context
      loginAdmin, 
      loginUser, // Provided loginUser in context
      register, // Provided register in context
      logout, 
      isAuthenticated: !!admin || !!user,
      isChecking,
      adminEmail
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
