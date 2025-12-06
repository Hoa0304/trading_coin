import { useWallet } from '../contexts/WalletContext';
import { Wallet, AlertCircle } from 'lucide-react';

export function ConnectWallet() {
  const { address, isConnected, isLoading, error, connect, formattedAddress } = useWallet();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
        <Wallet className="w-5 h-5 text-green-400" />
        <div>
          <p className="text-green-400 text-sm font-medium">Connected</p>
          <p className="text-gray-400 text-xs">{formattedAddress}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2F3133] rounded-xl p-6 shadow-xl max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-[#F263B0] p-4 rounded-full">
          <Wallet className="w-12 h-12 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-2">
        Connect Your Wallet
      </h2>
      <p className="text-gray-400 text-center mb-6">
        Connect your MetaMask wallet to start trading Bitcoin on the blockchain
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 text-sm font-medium">Error</p>
            <p className="text-red-300 text-xs">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={connect}
        disabled={isLoading}
        className="w-full bg-[#F263B0] text-white py-4 rounded-lg font-semibold hover:bg-[#e055a0] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#F263B0]/30 hover:shadow-[#F263B0]/50"
      >
        {isLoading ? 'Connecting...' : 'Connect MetaMask'}
      </button>

      <p className="text-gray-500 text-xs text-center mt-4">
        Don't have MetaMask?{' '}
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#F263B0] hover:underline"
        >
          Install it here
        </a>
      </p>
    </div>
  );
}

