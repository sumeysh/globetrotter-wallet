import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      // Create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: '',
      });

      // Create initial wallets for major currencies
      const currencies = ['USD', 'EUR', 'GBP'];
      const wallets = currencies.map(currency => ({
        user_id: data.user!.id,
        currency_code: currency,
        balance: currency === 'USD' ? 2450.75 : currency === 'EUR' ? 890.30 : 320.50,
      }));

      await supabase.from('wallets').insert(wallets);

      // Add some sample transactions
      const sampleTransactions = [
        {
          user_id: data.user!.id,
          type: 'receive' as const,
          amount: 1000,
          currency: 'USD',
          description: 'Initial deposit',
          status: 'completed' as const,
        },
        {
          user_id: data.user!.id,
          type: 'exchange' as const,
          amount: 500,
          currency: 'EUR',
          description: 'USD → EUR Exchange',
          status: 'completed' as const,
        },
      ];

      await supabase.from('transactions').insert(sampleTransactions);

      // Add sample contacts
      const sampleContacts = [
        {
          user_id: data.user!.id,
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          avatar: 'SJ',
        },
        {
          user_id: data.user!.id,
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          avatar: 'MC',
        },
      ];

      await supabase.from('contacts').insert(sampleContacts);

      // Add sample card
      await supabase.from('cards').insert({
        user_id: data.user!.id,
        type: 'physical' as const,
        last_four: '4521',
        expiry_date: '12/27',
        status: 'active' as const,
        spending_limit: 5000,
        current_spending: 1250.75,
      });
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
}