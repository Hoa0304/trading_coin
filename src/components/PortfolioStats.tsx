import { Portfolio } from '../lib/supabase';
import { Wallet, TrendingUp, DollarSign } from 'lucide-react';

interface PortfolioStatsProps {
  portfolio: Portfolio | null;
  currentPrice: number;
}

export function PortfolioStats({ portfolio, currentPrice }: PortfolioStatsProps) {
  if (!portfolio) return null;

  const btcValue = portfolio.btc_balance * currentPrice;
  const totalValue = btcValue + portfolio.usd_balance;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-[#2F3133] rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-[#F263B0]/20 p-3 rounded-lg">
            <Wallet className="w-6 h-6 text-[#F263B0]" />
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Total Portfolio Value</h3>
        </div>
        <p className="text-3xl font-bold text-white">${totalValue.toFixed(2)}</p>
      </div>

      <div className="bg-[#2F3133] rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-[#F263B0]/20 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-[#F263B0]" />
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Bitcoin Holdings</h3>
        </div>
        <p className="text-3xl font-bold text-white">{portfolio.btc_balance.toFixed(8)}</p>
        <p className="text-gray-400 text-sm mt-1">${btcValue.toFixed(2)} USD</p>
      </div>

      <div className="bg-[#2F3133] rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-[#F263B0]/20 p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-[#F263B0]" />
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Cash Balance</h3>
        </div>
        <p className="text-3xl font-bold text-white">${portfolio.usd_balance.toFixed(2)}</p>
      </div>
    </div>
  );
}
