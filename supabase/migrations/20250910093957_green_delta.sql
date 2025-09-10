/*
  # Initial Schema for Globetrotter's Wallet

  1. New Tables
    - `profiles` - User profile information
    - `currencies` - Supported currencies with rates
    - `wallets` - User's multi-currency wallets
    - `transactions` - All financial transactions
    - `travel_budgets` - Travel budget tracking
    - `budget_categories` - Budget category breakdown
    - `contacts` - User's contact list for transfers
    - `cards` - User's physical and virtual cards

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Currencies table (global reference data)
CREATE TABLE IF NOT EXISTS currencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  symbol text NOT NULL,
  flag text NOT NULL,
  rate numeric(10,4) NOT NULL DEFAULT 1.0,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- User wallets (multi-currency balances)
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  currency_code text NOT NULL,
  balance numeric(15,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency_code)
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('exchange', 'send', 'receive', 'spend', 'transfer')),
  amount numeric(15,2) NOT NULL,
  currency text NOT NULL,
  description text NOT NULL,
  location text,
  status text DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  recipient text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Travel budgets
CREATE TABLE IF NOT EXISTS travel_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  destination text NOT NULL,
  total_budget numeric(15,2) NOT NULL,
  spent numeric(15,2) DEFAULT 0.00,
  currency text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Budget categories
CREATE TABLE IF NOT EXISTS budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid REFERENCES travel_budgets(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN ('accommodation', 'food', 'transport', 'activities', 'shopping')),
  budget numeric(15,2) NOT NULL,
  spent numeric(15,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(budget_id, category)
);

-- Contacts
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  avatar text,
  last_transaction_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Cards
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('physical', 'virtual')),
  last_four text NOT NULL,
  expiry_date text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'blocked')),
  spending_limit numeric(15,2) DEFAULT 5000.00,
  current_spending numeric(15,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for wallets
CREATE POLICY "Users can read own wallets"
  ON wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallets"
  ON wallets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallets"
  ON wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for transactions
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for travel_budgets
CREATE POLICY "Users can read own budgets"
  ON travel_budgets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own budgets"
  ON travel_budgets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for budget_categories
CREATE POLICY "Users can read own budget categories"
  ON budget_categories
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM travel_budgets 
    WHERE travel_budgets.id = budget_categories.budget_id 
    AND travel_budgets.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own budget categories"
  ON budget_categories
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM travel_budgets 
    WHERE travel_budgets.id = budget_categories.budget_id 
    AND travel_budgets.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM travel_budgets 
    WHERE travel_budgets.id = budget_categories.budget_id 
    AND travel_budgets.user_id = auth.uid()
  ));

-- Policies for contacts
CREATE POLICY "Users can read own contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for cards
CREATE POLICY "Users can read own cards"
  ON cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cards"
  ON cards
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow public read access to currencies (reference data)
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read currencies"
  ON currencies
  FOR SELECT
  TO authenticated
  USING (true);