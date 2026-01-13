
import React from 'react';
import * as RouterDOM from 'react-router-dom';
const { Navigate } = RouterDOM as any;
import { useAuth } from './AuthContext.tsx';
import { Loader2 } from 'lucide-react';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <Loader2 className="animate-spin text-brand-gold" size={48} />
    </div>
  );

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const UserGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-gold" size={48} />
    </div>
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
