import { useEffect, useState } from 'react';
import { useWallet } from './contexts/WalletContext';
import { useBitcoinPrice } from './hooks/useBitcoinPrice';
import { ConnectWallet } from './components/ConnectWallet';
import { PriceChart } from './components/PriceChart';
import { PortfolioStats } from './components/PortfolioStats';
import { TradePanel } from './components/TradePanel';
import { TransactionHistory } from './components/TransactionHistory';
import { getPortfolio, getUserTransactions } from './lib/contract';
import { Bitcoin, Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface BlockchainPortfolio {
  btcBalance: number;
  usdBalance: number;
}

interface BlockchainTransaction {
  type: 'buy' | 'sell';
  btcAmount: number;
  usdAmount: number;
  btcPrice: number;
  timestamp: number;
}

function App() {
  const { address, isConnected, isLoading, formattedAddress, refreshBalance } = useWallet();
  const [portfolio, setPortfolio] = useState<BlockchainPortfolio | null>(null);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const { price, change24h, priceHistory } = useBitcoinPrice();

  useEffect(() => {
    if (isConnected && address) {
      loadBlockchainData();
    } else {
      setPortfolio(null);
      setTransactions([]);
    }
  }, [isConnected, address]);

  const loadBlockchainData = async () => {
    if (!address) return;

    setLoadingPortfolio(true);
    try {
      // Load portfolio từ blockchain
      const portfolioData = await getPortfolio(address);
      setPortfolio(portfolioData);

      // Load transactions từ blockchain
      const transactionsData = await getUserTransactions(address, 10);
      setTransactions(transactionsData);

      // Refresh ETH balance
      await refreshBalance();
    } catch (error: any) {
      console.error('Error loading blockchain data:', error);
      
      // Kiểm tra nếu là lỗi RPC endpoint
      if (error.message?.includes('RPC endpoint') || error.message?.includes('Hardhat node')) {
        // Không set portfolio để hiển thị thông báo lỗi
        setPortfolio(null);
        setTransactions([]);
      } else {
        // Nếu contract chưa được deploy, portfolio sẽ null
        setPortfolio(null);
        setTransactions([]);
      }
    } finally {
      setLoadingPortfolio(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1b1d] flex items-center justify-center">
        <div className="text-[#F263B0] text-xl">Loading...</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#1a1b1d] flex items-center justify-center p-4">
        <ConnectWallet />
      </div>
    );
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Wallet className="w-4 h-4 text-green-400" />
              <div className="text-right">
                <p className="text-green-400 text-sm font-medium">Connected</p>
                <p className="text-gray-400 text-xs">{formattedAddress}</p>
              </div>
            </div>
          </div>
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

        {loadingPortfolio ? (
          <div className="text-center py-8">
            <div className="text-[#F263B0] text-lg">Loading portfolio from blockchain...</div>
          </div>
        ) : (
          <>
            <PortfolioStats portfolio={portfolio} currentPrice={price} />
            
            {!portfolio && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Portfolio chưa được khởi tạo. Hãy mua/bán Bitcoin để khởi tạo portfolio với $10,000 USD.
                </p>
              </div>
            )}
            
            {/* Hiển thị thông báo nếu Hardhat node không chạy */}
            {loadingPortfolio === false && !portfolio && address && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-400 text-sm font-medium mb-2">
                  ❌ Không thể kết nối đến Hardhat node
                </p>
                <p className="text-red-300 text-xs mb-2">
                  Vui lòng đảm bảo Hardhat node đang chạy:
                </p>
                <code className="block bg-[#1a1b1d] text-red-300 text-xs p-2 rounded mt-2">
                  npx hardhat node
                </code>
                <p className="text-red-300 text-xs mt-2">
                  Sau đó reload trang này.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradePanel
                currentPrice={price}
                portfolio={portfolio}
                address={address!}
                onTradeComplete={loadBlockchainData}
              />
              <TransactionHistory transactions={transactions} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
