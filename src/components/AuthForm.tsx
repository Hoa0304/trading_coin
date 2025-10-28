import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Bitcoin } from 'lucide-react';

interface AuthFormProps {
  onAuthComplete: () => void;
}

export function AuthForm({ onAuthComplete }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            email,
            full_name: fullName,
          });

          await supabase.from('portfolios').insert({
            user_id: data.user.id,
            btc_balance: 0,
            usd_balance: 10000,
          });
        }
      }
      onAuthComplete();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b1d] flex items-center justify-center p-4">
      <div className="bg-[#2F3133] rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-[#F263B0] p-4 rounded-full">
            <Bitcoin className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Bitcoin Trading Platform
        </h1>
        <p className="text-gray-400 text-center mb-8">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-400 text-sm mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-[#1a1b1d] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F263B0] transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1a1b1d] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F263B0] transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#1a1b1d] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F263B0] transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F263B0] text-white py-4 rounded-lg font-semibold hover:bg-[#e055a0] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#F263B0]/30 hover:shadow-[#F263B0]/50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-[#F263B0] hover:text-[#e055a0] font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
