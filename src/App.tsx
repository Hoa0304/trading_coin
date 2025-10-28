import { useEffect, useState } from 'react';
import { supabase, Portfolio, Transaction } from './lib/supabase';
import { useBitcoinPrice } from './hooks/useBitcoinPrice';
import { AuthForm } from './components/AuthForm';
import { PriceChart } from './components/PriceChart';
import { PortfolioStats } from './components/PortfolioStats';
import { TradePanel } from './components/TradePanel';
import { TransactionHistory } from './components/TransactionHistory';
import { Bitcoin, LogOut, TrendingUp, TrendingDown } from 'lucide-react';
import { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { price, change24h, priceHistory } = useBitcoinPrice();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    const { data: portfolioData } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (portfolioData) {
      setPortfolio(portfolioData);
    }

    const { data: transactionsData } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transactionsData) {
      setTransactions(transactionsData);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPortfolio(null);
    setTransactions([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1b1d] flex items-center justify-center">
        <div className="text-[#F263B0] text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#1a1b1d]">
      <header className="bg-[#2F3133] border-b border-[#3a3c3e] shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#F263B0] p-2 rounded-lg">
              <Bitcoin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bitcoin Trading</h1>
              <p className="text-gray-400 text-sm">Professional Trading Platform</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-[#1a1b1d] text-gray-300 px-4 py-2 rounded-lg hover:bg-[#242629] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#2F3133] rounded-xl p-6 mb-6 shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-gray-400 text-sm mb-2">Bitcoin Price</h2>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-white">
                  ${price.toFixed(2)}
                </span>
                <span
                  className={`flex items-center gap-1 text-xl font-semibold ${
                    change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {change24h >= 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  {change24h >= 0 ? '+' : ''}
                  {change24h.toFixed(2)}%
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2">24h Change</p>
            </div>
          </div>

          <div className="h-48">
            <PriceChart data={priceHistory} color="#F263B0" />
          </div>
        </div>

        <PortfolioStats portfolio={portfolio} currentPrice={price} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradePanel
            currentPrice={price}
            portfolio={portfolio}
            userId={user.id}
            onTradeComplete={loadUserData}
          />
          <TransactionHistory transactions={transactions} />
        </div>
      </main>
    </div>
  );
}

export default App;
