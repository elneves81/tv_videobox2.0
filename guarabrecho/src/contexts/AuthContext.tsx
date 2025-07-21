"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type AuthContextType = {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const value = {
    user: session?.user as User | undefined,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
