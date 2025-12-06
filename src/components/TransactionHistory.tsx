import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface BlockchainTransaction {
  type: 'buy' | 'sell';
  btcAmount: number;
  usdAmount: number;
  btcPrice: number;
  timestamp: number;
}

interface TransactionHistoryProps {
  transactions: BlockchainTransaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div className="bg-[#2F3133] rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
      <p className="text-gray-400 text-xs mb-4">From blockchain</p>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No transactions yet</p>
        ) : (
          transactions.map((tx, index) => (
            <div
              key={index}
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
                    {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.btcAmount.toFixed(8)} BTC
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  ${tx.usdAmount.toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm">
                  @${tx.btcPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
