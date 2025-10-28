import { useState } from 'react';
import { supabase, Portfolio } from '../lib/supabase';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TradePanelProps {
  currentPrice: number;
  portfolio: Portfolio | null;
  userId: string;
  onTradeComplete: () => void;
}

export function TradePanel({ currentPrice, portfolio, userId, onTradeComplete }: TradePanelProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrade = async () => {
    if (!portfolio || !amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      const btcAmount = parseFloat(amount);
      const usdAmount = btcAmount * currentPrice;

      if (activeTab === 'buy') {
        if (usdAmount > portfolio.usd_balance) {
          alert('Insufficient USD balance');
          setLoading(false);
          return;
        }

        await supabase.from('portfolios').update({
          btc_balance: portfolio.btc_balance + btcAmount,
          usd_balance: portfolio.usd_balance - usdAmount,
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId);
      } else {
        if (btcAmount > portfolio.btc_balance) {
          alert('Insufficient BTC balance');
          setLoading(false);
          return;
        }

        await supabase.from('portfolios').update({
          btc_balance: portfolio.btc_balance - btcAmount,
          usd_balance: portfolio.usd_balance + usdAmount,
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId);
      }

      await supabase.from('transactions').insert({
        user_id: userId,
        type: activeTab,
        btc_amount: btcAmount,
        usd_amount: usdAmount,
        btc_price: currentPrice,
        status: 'completed',
      });

      setAmount('');
      onTradeComplete();
    } catch (error) {
      console.error('Trade error:', error);
      alert('Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const estimatedCost = amount ? (parseFloat(amount) * currentPrice).toFixed(2) : '0.00';

  return (
    <div className="bg-[#2F3133] rounded-xl p-6 shadow-xl">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'buy'
              ? 'bg-[#F263B0] text-white shadow-lg shadow-[#F263B0]/30'
              : 'bg-[#1a1b1d] text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="inline-block w-5 h-5 mr-2" />
          Buy BTC
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
            activeTab === 'sell'
              ? 'bg-[#F263B0] text-white shadow-lg shadow-[#F263B0]/30'
              : 'bg-[#1a1b1d] text-gray-400 hover:text-white'
          }`}
        >
          <TrendingDown className="inline-block w-5 h-5 mr-2" />
          Sell BTC
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Amount (BTC)</label>
          <input
            type="number"
            step="0.00000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00000000"
            className="w-full bg-[#1a1b1d] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F263B0] transition-all"
          />
        </div>

        <div className="bg-[#1a1b1d] rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Price per BTC</span>
            <span className="text-white font-medium">${currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Estimated {activeTab === 'buy' ? 'Cost' : 'Return'}</span>
            <span className="text-white font-medium">${estimatedCost}</span>
          </div>
        </div>

        {portfolio && (
          <div className="bg-[#1a1b1d] rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Available BTC</span>
              <span className="text-white font-medium">{portfolio.btc_balance.toFixed(8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Available USD</span>
              <span className="text-white font-medium">${portfolio.usd_balance.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleTrade}
          disabled={loading || !amount || parseFloat(amount) <= 0}
          className="w-full bg-[#F263B0] text-white py-4 rounded-lg font-semibold hover:bg-[#e055a0] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#F263B0]/30 hover:shadow-[#F263B0]/50"
        >
          {loading ? 'Processing...' : `${activeTab === 'buy' ? 'Buy' : 'Sell'} Bitcoin`}
        </button>
      </div>
    </div>
  );
}
