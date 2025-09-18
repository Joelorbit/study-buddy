import { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { User, Session } from '../types';

// Helper to map Supabase user to our app's User type
const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser): User => {
    return {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        createdAt: supabaseUser.created_at,
    };
};

// Helper to map Supabase session to our app's Session type
const mapSupabaseSessionToAppSession = (supabaseSession: SupabaseSession | null): Session | null => {
    if (!supabaseSession || !supabaseSession.user) return null;
    return {
        user: mapSupabaseUserToAppUser(supabaseSession.user),
    };
};

export const authService = {
  signUp: async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message || null };
  },

  signIn: async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  },

  signOut: async (): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  },
  
  getSession: async (): Promise<{ session: Session | null }> => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        return { session: null };
    }
    return { session: mapSupabaseSessionToAppSession(data.session) };
  },
  
  onAuthStateChange: (callback: (session: Session | null) => void) => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          callback(mapSupabaseSessionToAppSession(session));
      });
      return subscription;
  }
};
