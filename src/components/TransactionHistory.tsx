import { ArrowUpCircle, ArrowDownCircle, ExternalLink, Database, Scan } from 'lucide-react';
import { getIPFSURL } from '../lib/ipfs';

interface BlockchainTransaction {
  type: 'buy' | 'sell';
  btcAmount: number;
  usdAmount: number;
  btcPrice: number;
  timestamp: number;
  ipfsCID: string;
  transactionHash?: string; // Optional transaction hash for Etherscan link
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
                <div className="flex items-center gap-2 mt-2 justify-end">
                  {/* Etherscan Link */}
                  {tx.transactionHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      title="View on Etherscan"
                    >
                      <Scan className="w-3 h-3" />
                      Etherscan
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {/* IPFS Link */}
                  {tx.ipfsCID && (
                    <a
                      href={getIPFSURL(tx.ipfsCID)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#F263B0] hover:text-[#d4559a] transition-colors"
                      title="View metadata on IPFS"
                    >
                      <Database className="w-3 h-3" />
                      IPFS
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
