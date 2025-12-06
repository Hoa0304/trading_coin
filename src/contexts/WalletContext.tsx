import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  connectWallet,
  getCurrentAddress,
  getBalance,
  onAccountsChanged,
  onChainChanged,
  isMetaMaskInstalled,
  formatAddress,
} from '../lib/web3';

interface WalletContextType {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  formattedAddress: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra connection khi component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) {
        setIsLoading(false);
        return;
      }

      try {
        const currentAddress = await getCurrentAddress();
        if (currentAddress) {
          setAddress(currentAddress);
          await loadBalance(currentAddress);
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  // Lắng nghe thay đổi account
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setAddress(null);
        setBalance('0');
      } else {
        setAddress(accounts[0]);
        await loadBalance(accounts[0]);
      }
    };

    const cleanup = onAccountsChanged(handleAccountsChanged);
    return cleanup;
  }, []);

  // Lắng nghe thay đổi network
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleChainChanged = () => {
      // Reload page khi network thay đổi
      window.location.reload();
    };

    const cleanup = onChainChanged(handleChainChanged);
    return cleanup;
  }, []);

  const loadBalance = async (addr: string) => {
    try {
      const bal = await getBalance(addr);
      setBalance(bal);
    } catch (err) {
      console.error('Error loading balance:', err);
    }
  };

  const connect = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const addr = await connectWallet();
      setAddress(addr);
      await loadBalance(addr);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance('0');
    setError(null);
  };

  const refreshBalance = async () => {
    if (address) {
      await loadBalance(address);
    }
  };

  const formattedAddress = address ? formatAddress(address) : '';

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        isConnected: !!address,
        isLoading,
        error,
        connect,
        disconnect,
        refreshBalance,
        formattedAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

