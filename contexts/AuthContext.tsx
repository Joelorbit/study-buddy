import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Session } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the initial session state on app load
    authService.getSession().then(({ session: currentSession }) => {
      setSession(currentSession);
      setIsLoading(false);
    });

    // Listen for changes in authentication state (sign-in, sign-out)
    const subscription = authService.onAuthStateChange((newSession) => {
      setSession(newSession);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await authService.signIn(email, password);
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await authService.signUp(email, password);
    return { error };
  };

  const signOut = async () => {
    await authService.signOut();
    // The onAuthStateChange listener will handle setting the session to null.
  };

  const value = {
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
