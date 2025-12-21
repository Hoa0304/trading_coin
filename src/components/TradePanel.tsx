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
      
      const receipt = await waitForTransaction(tx);
      
      if (receipt.status === 1) {
        setStatus('success');
        
        // Đợi một chút để blockchain state được cập nhật
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reload portfolio sau khi khởi tạo
        await onTradeComplete();
        
        // Reload lại một lần nữa sau 1 giây để đảm bảo
        setTimeout(async () => {
          await onTradeComplete();
        }, 1000);
        
        setTimeout(() => {
          setStatus('idle');
          setTxHash(null);
        }, 2000);
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error: any) {
      console.error('Initialize error:', error);
      setStatus('error');
      
      let errorMessage = 'Khởi tạo portfolio thất bại';
      if (error.message?.includes('user rejected') || error.code === 4001) {
        errorMessage = 'Bạn đã từ chối giao dịch';
      } else if (error.message?.includes('already initialized')) {
        errorMessage = 'Portfolio đã được khởi tạo rồi';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
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
      const shouldInit = window.confirm('Portfolio chưa được khởi tạo. Bạn có muốn khởi tạo với $10,000 USD không?');
      if (shouldInit) {
        try {
          await handleInitializePortfolio();
          // Sau khi khởi tạo, reload portfolio
          await onTradeComplete();
          // Đợi một chút để blockchain state được cập nhật
          await new Promise(resolve => setTimeout(resolve, 2000));
          // Reload lại một lần nữa để đảm bảo
          await onTradeComplete();
          
          // Nếu user đã nhập amount, tiếp tục với trade
          if (amount && parseFloat(amount) > 0) {
            // Portfolio đã được khởi tạo, tiếp tục với trade
            // Không return, để code tiếp tục xuống phần trade
          } else {
            // Nếu chưa nhập amount, chỉ cần thông báo
            alert('Portfolio đã được khởi tạo với $10,000 USD. Bây giờ bạn có thể nhập số lượng BTC muốn mua và bấm "Buy Bitcoin" lại.');
            return;
          }
        } catch (error) {
          console.error('Error initializing portfolio:', error);
          return;
        }
      } else {
        return;
      }
    }

    // Validation
    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    if (!currentPrice || currentPrice <= 0) {
      alert('Giá Bitcoin chưa sẵn sàng. Vui lòng đợi một chút và thử lại.');
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
        
        // Đợi một chút để blockchain state được cập nhật
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Reload portfolio và transactions
        await onTradeComplete();
        
        // Reload lại một lần nữa sau 1 giây để đảm bảo data được cập nhật
        setTimeout(async () => {
          await onTradeComplete();
        }, 1000);
        
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
      
      let errorMessage = 'Giao dịch thất bại';
      
      // Xử lý các loại lỗi cụ thể
      if (error.message?.includes('user rejected') || error.code === 4001) {
        errorMessage = 'Bạn đã từ chối giao dịch';
      } else if (error.message?.includes('insufficient funds') || error.message?.includes('Insufficient')) {
        errorMessage = error.message || 'Số dư không đủ';
      } else if (error.message?.includes('Portfolio chưa được khởi tạo') || error.message?.includes('not initialized')) {
        errorMessage = 'Portfolio chưa được khởi tạo. Vui lòng khởi tạo trước khi giao dịch.';
      } else if (error.message?.includes('execution reverted') || error.code === 'CALL_EXCEPTION') {
        // Lỗi từ smart contract
        if (error.reason) {
          errorMessage = `Lỗi từ smart contract: ${error.reason}`;
        } else {
          errorMessage = 'Giao dịch bị từ chối bởi smart contract. Có thể portfolio chưa được khởi tạo hoặc số dư không đủ.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán giá trị ước tính, xử lý trường hợp currentPrice = 0 hoặc không hợp lệ
  const estimatedCost = amount && currentPrice > 0 
    ? (parseFloat(amount) * currentPrice).toFixed(2) 
    : '0.00';

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
            <span className="text-white font-medium">
              {currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Estimated {activeTab === 'buy' ? 'Cost' : 'Return'}</span>
            <span className="text-white font-medium">${estimatedCost}</span>
          </div>
          {currentPrice === 0 && (
            <div className="text-yellow-400 text-xs mt-2">
              ⚠️ Đang tải giá Bitcoin... Vui lòng đợi một chút.
            </div>
          )}
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
