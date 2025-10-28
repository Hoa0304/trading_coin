import { Transaction } from '../lib/supabase';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div className="bg-[#2F3133] rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No transactions yet</p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#1a1b1d] rounded-lg p-4 flex items-center justify-between hover:bg-[#242629] transition-colors"
            >
              <div className="flex items-center gap-3">
                {tx.type === 'buy' ? (
                  <ArrowDownCircle className="w-8 h-8 text-[#F263B0]" />
                ) : (
                  <ArrowUpCircle className="w-8 h-8 text-[#F263B0]" />
                )}
                <div>
                  <p className="text-white font-semibold">
                    {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.btc_amount.toFixed(8)} BTC
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  ${tx.usd_amount.toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm">
                  @${tx.btc_price.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
