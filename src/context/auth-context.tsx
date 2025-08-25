
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'jetsys_auth_status';
const CORRECT_PASSWORD = 'Jetsys@098';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage only on the client side
    try {
      const storedAuthStatus = localStorage.getItem(AUTH_KEY);
      if (storedAuthStatus === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Could not access localStorage", e);
    }
    setIsLoading(false);
  }, []);

  const login = (password: string) => {
    if (password === CORRECT_PASSWORD) {
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch (e) {
        console.error("Could not access localStorage", e);
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {
        console.error("Could not access localStorage", e);
    }
    setIsAuthenticated(false);
  };
  
  // While loading auth state from localStorage, don't render children
  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
