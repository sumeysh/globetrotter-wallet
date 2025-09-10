import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      currencies: {
        Row: {
          id: string;
          code: string;
          name: string;
          symbol: string;
          flag: string;
          rate: number;
          is_active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          symbol: string;
          flag: string;
          rate?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          symbol?: string;
          flag?: string;
          rate?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          currency_code: string;
          balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          currency_code: string;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          currency_code?: string;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: 'exchange' | 'send' | 'receive' | 'spend' | 'transfer';
          amount: number;
          currency: string;
          description: string;
          location: string | null;
          status: 'completed' | 'pending' | 'failed';
          recipient: string | null;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'exchange' | 'send' | 'receive' | 'spend' | 'transfer';
          amount: number;
          currency: string;
          description: string;
          location?: string | null;
          status?: 'completed' | 'pending' | 'failed';
          recipient?: string | null;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'exchange' | 'send' | 'receive' | 'spend' | 'transfer';
          amount?: number;
          currency?: string;
          description?: string;
          location?: string | null;
          status?: 'completed' | 'pending' | 'failed';
          recipient?: string | null;
          category?: string | null;
          created_at?: string;
        };
      };
      travel_budgets: {
        Row: {
          id: string;
          user_id: string;
          destination: string;
          total_budget: number;
          spent: number;
          currency: string;
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          destination: string;
          total_budget: number;
          spent?: number;
          currency: string;
          start_date: string;
          end_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          destination?: string;
          total_budget?: number;
          spent?: number;
          currency?: string;
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_categories: {
        Row: {
          id: string;
          budget_id: string;
          category: 'accommodation' | 'food' | 'transport' | 'activities' | 'shopping';
          budget: number;
          spent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          budget_id: string;
          category: 'accommodation' | 'food' | 'transport' | 'activities' | 'shopping';
          budget: number;
          spent?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          budget_id?: string;
          category?: 'accommodation' | 'food' | 'transport' | 'activities' | 'shopping';
          budget?: number;
          spent?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          avatar: string | null;
          last_transaction_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          avatar?: string | null;
          last_transaction_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          avatar?: string | null;
          last_transaction_date?: string | null;
          created_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          user_id: string;
          type: 'physical' | 'virtual';
          last_four: string;
          expiry_date: string;
          status: 'active' | 'frozen' | 'blocked';
          spending_limit: number;
          current_spending: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'physical' | 'virtual';
          last_four: string;
          expiry_date: string;
          status?: 'active' | 'frozen' | 'blocked';
          spending_limit?: number;
          current_spending?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'physical' | 'virtual';
          last_four?: string;
          expiry_date?: string;
          status?: 'active' | 'frozen' | 'blocked';
          spending_limit?: number;
          current_spending?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}