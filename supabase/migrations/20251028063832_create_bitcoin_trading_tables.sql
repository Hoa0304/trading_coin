/*
  # Bitcoin Trading Platform Database Schema

  ## Overview
  Creates the complete database schema for a Bitcoin trading platform with user portfolios,
  transactions, and order management.

  ## New Tables

  ### 1. `profiles`
  User profile information extending Supabase auth
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `avatar_url` (text, nullable) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `portfolios`
  User cryptocurrency and fiat balances
  - `id` (uuid, primary key) - Portfolio identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `btc_balance` (numeric) - Bitcoin balance
  - `usd_balance` (numeric) - USD balance
  - `created_at` (timestamptz) - Portfolio creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `transactions`
  Complete transaction history for buys/sells
  - `id` (uuid, primary key) - Transaction identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `type` (text) - Transaction type: 'buy' or 'sell'
  - `btc_amount` (numeric) - Amount of Bitcoin transacted
  - `usd_amount` (numeric) - USD value of transaction
  - `btc_price` (numeric) - Bitcoin price at transaction time
  - `status` (text) - Transaction status: 'pending', 'completed', 'failed'
  - `created_at` (timestamptz) - Transaction timestamp

  ### 4. `orders`
  Pending and active orders
  - `id` (uuid, primary key) - Order identifier
  - `user_id` (uuid, foreign key) - References profiles
  - `type` (text) - Order type: 'buy' or 'sell'
  - `btc_amount` (numeric) - Amount of Bitcoin to trade
  - `target_price` (numeric) - Target price for execution
  - `status` (text) - Order status: 'pending', 'executed', 'cancelled'
  - `created_at` (timestamptz) - Order creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own data
  - Authenticated users required for all operations

  ### Policies
  - SELECT: Users can view their own records
  - INSERT: Users can create their own records
  - UPDATE: Users can update their own records
  - DELETE: Users can delete their own records

  ## Indexes
  - Indexes on user_id for fast lookups
  - Indexes on created_at for efficient sorting
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  btc_balance numeric(20, 8) DEFAULT 0 CHECK (btc_balance >= 0),
  usd_balance numeric(20, 2) DEFAULT 10000.00 CHECK (usd_balance >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('buy', 'sell')),
  btc_amount numeric(20, 8) NOT NULL CHECK (btc_amount > 0),
  usd_amount numeric(20, 2) NOT NULL CHECK (usd_amount > 0),
  btc_price numeric(20, 2) NOT NULL CHECK (btc_price > 0),
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('buy', 'sell')),
  btc_amount numeric(20, 8) NOT NULL CHECK (btc_amount > 0),
  target_price numeric(20, 2) NOT NULL CHECK (target_price > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Portfolios policies
CREATE POLICY "Users can view own portfolio"
  ON portfolios FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio"
  ON portfolios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio"
  ON portfolios FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own orders"
  ON orders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
