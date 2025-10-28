import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  btc_balance: number;
  usd_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'buy' | 'sell';
  btc_amount: number;
  usd_amount: number;
  btc_price: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  type: 'buy' | 'sell';
  btc_amount: number;
  target_price: number;
  status: 'pending' | 'executed' | 'cancelled';
  created_at: string;
  updated_at: string;
}
