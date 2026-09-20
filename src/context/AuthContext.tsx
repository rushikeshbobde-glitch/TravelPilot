import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storage } from '../lib/storage';
import { Profile } from '../types';
import { DEMO_USER } from '../lib/mockData';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (email: string, password?: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleDemoMode: (enabled: boolean) => void;
  resetToDemoAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(storage.isDemoMode());

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured && supabase && !storage.isDemoMode()) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || '',
              full_name: data.session.user.user_metadata?.full_name || 'Traveler',
              created_at: data.session.user.created_at,
            });
          } else {
            setUser(null);
          }
        } catch (err) {
          console.warn('Supabase auth session check failed, using storage user:', err);
          setUser(storage.getAuthUser());
        }
      } else {
        setUser(storage.getAuthUser());
      }
      setLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!storage.isDemoMode()) {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || 'Traveler',
              created_at: session.user.created_at,
            });
          } else {
            setUser(null);
          }
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password = 'password123') => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase && !isDemoMode) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          const profile: Profile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || 'Traveler',
            created_at: data.user.created_at,
          };
          setUser(profile);
          storage.setAuthUser(profile);
        }
      } else {
        // Instant Demo Login
        const profile: Profile = {
          id: DEMO_USER.id,
          email: email || DEMO_USER.email,
          full_name: email === DEMO_USER.email ? DEMO_USER.full_name : email.split('@')[0],
          avatar_url: DEMO_USER.avatar_url,
          created_at: new Date().toISOString(),
        };
        setUser(profile);
        storage.setAuthUser(profile);
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password = 'password123', fullName = 'New Traveler') => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase && !isDemoMode) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        if (data.user) {
          const profile: Profile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            created_at: data.user.created_at,
          };
          setUser(profile);
          storage.setAuthUser(profile);
        }
      } else {
        const profile: Profile = {
          id: `usr-${Date.now()}`,
          email,
          full_name: fullName,
          avatar_url: DEMO_USER.avatar_url,
          created_at: new Date().toISOString(),
        };
        setUser(profile);
        storage.setAuthUser(profile);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    setUser(null);
    storage.setAuthUser(null);
  };

  const toggleDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    storage.setDemoMode(enabled);
    if (enabled && !user) {
      setUser(DEMO_USER);
      storage.setAuthUser(DEMO_USER);
    }
  };

  const resetToDemoAccount = () => {
    storage.initDefaults(true);
    setUser(DEMO_USER);
    setIsDemoMode(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        login,
        signup,
        logout,
        toggleDemoMode,
        resetToDemoAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
