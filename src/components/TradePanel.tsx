import { useState } from 'react';
import { buyBitcoin, sellBitcoin, waitForTransaction, initializePortfolio } from '../lib/contract';
import { useWallet } from '../contexts/WalletContext';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface BlockchainPortfolio {
  btcBalance: number;
  usdBalance: number;
}

interface TradePanelProps {
  currentPrice: number;
  portfolio: BlockchainPortfolio | null;
  address: string;
  onTradeComplete: () => void;
}

export function TradePanel({ currentPrice, portfolio, address, onTradeComplete }: TradePanelProps) {
  const { balance: ethBalance } = useWallet();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'confirming' | 'success' | 'error'>('idle');

  /**
   * Khởi tạo portfolio nếu chưa có
   */
  const handleInitializePortfolio = async () => {
    setLoading(true);
    setStatus('pending');
    try {
      const tx = await initializePortfolio();
      setTxHash(tx.hash);
      setStatus('confirming');
      
      await waitForTransaction(tx);
      setStatus('success');
      onTradeComplete();
      
      setTimeout(() => {
        setStatus('idle');
        setTxHash(null);
      }, 3000);
    } catch (error: any) {
      console.error('Initialize error:', error);
      setStatus('error');
      alert(`Failed to initialize portfolio: ${error.message || 'Unknown error'}`);
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Thực hiện giao dịch mua/bán Bitcoin trên blockchain
   */
  const handleTrade = async () => {
    // Nếu chưa có portfolio, khởi tạo trước
    if (!portfolio || (portfolio.btcBalance === 0 && portfolio.usdBalance === 0)) {
      const shouldInit = confirm('Portfolio not initialized. Initialize with $10,000 USD?');
      if (shouldInit) {
        await handleInitializePortfolio();
      }
      return;
    }

    // Validation
    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    if (!currentPrice || currentPrice <= 0) {
      alert('Invalid Bitcoin price. Please try again.');
      return;
    }

    // Kiểm tra số dư ETH để trả gas fee
    if (parseFloat(ethBalance) < 0.001) {
      alert('Insufficient ETH for gas fee. Please add ETH to your wallet.');
      return;
    }

    setLoading(true);
    setStatus('pending');
    setTxHash(null);

    try {
      const btcAmount = parseFloat(amount);
      const usdAmount = btcAmount * currentPrice;

      // Validation số dư
      if (activeTab === 'buy') {
        if (usdAmount > portfolio.usdBalance) {
          alert(`Insufficient USD balance. Available: $${portfolio.usdBalance.toFixed(2)}, Required: $${usdAmount.toFixed(2)}`);
          setLoading(false);
          setStatus('idle');
          return;
        }
      } else {
        if (btcAmount > portfolio.btcBalance) {
          alert(`Insufficient BTC balance. Available: ${portfolio.btcBalance.toFixed(8)} BTC, Required: ${btcAmount.toFixed(8)} BTC`);
          setLoading(false);
          setStatus('idle');
          return;
        }
      }

      // Gọi smart contract
      let tx;
      if (activeTab === 'buy') {
        tx = await buyBitcoin(btcAmount, currentPrice);
      } else {
        tx = await sellBitcoin(btcAmount, currentPrice);
      }

      setTxHash(tx.hash);
      setStatus('confirming');

      // Đợi transaction được confirm
      const receipt = await waitForTransaction(tx);
      
      if (receipt.status === 1) {
        setStatus('success');
        setAmount('');
        onTradeComplete();
        
        setTimeout(() => {
          setStatus('idle');
          setTxHash(null);
        }, 3000);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Trade error:', error);
      setStatus('error');
      
      let errorMessage = 'Trade failed';
      if (error.message?.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setTimeout(() => setStatus('idle'), 3000);
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
              <span className="text-white font-medium">{portfolio.btcBalance.toFixed(8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Available USD</span>
              <span className="text-white font-medium">${portfolio.usdBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
              <span className="text-gray-400">ETH Balance</span>
              <span className="text-white font-medium">{parseFloat(ethBalance).toFixed(4)} ETH</span>
            </div>
          </div>
        )}

        {/* Transaction Status */}
        {status !== 'idle' && (
          <div className={`rounded-lg p-4 ${
            status === 'success' ? 'bg-green-500/10 border border-green-500/30' :
            status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
            'bg-blue-500/10 border border-blue-500/30'
          }`}>
            <div className="flex items-center gap-2">
              {status === 'pending' || status === 'confirming' ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              ) : status === 'success' ? (
                <span className="text-green-400">✓</span>
              ) : (
                <span className="text-red-400">✗</span>
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  status === 'success' ? 'text-green-400' :
                  status === 'error' ? 'text-red-400' :
                  'text-blue-400'
                }`}>
                  {status === 'pending' && 'Transaction pending...'}
                  {status === 'confirming' && 'Waiting for confirmation...'}
                  {status === 'success' && 'Transaction confirmed!'}
                  {status === 'error' && 'Transaction failed'}
                </p>
                {txHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-[#F263B0] underline"
                  >
                    View on Etherscan: {txHash.slice(0, 10)}...
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleTrade}
          disabled={loading || !amount || parseFloat(amount) <= 0 || status === 'pending' || status === 'confirming'}
          className="w-full bg-[#F263B0] text-white py-4 rounded-lg font-semibold hover:bg-[#e055a0] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#F263B0]/30 hover:shadow-[#F263B0]/50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? (
            status === 'pending' ? 'Signing transaction...' :
            status === 'confirming' ? 'Confirming...' :
            'Processing...'
          ) : (
            `${activeTab === 'buy' ? 'Buy' : 'Sell'} Bitcoin`
          )}
        </button>
      </div>
    </div>
  );
}
