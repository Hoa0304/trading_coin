import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  connectWallet,
  disconnectWallet,
  getCurrentAddress,
  getBalance,
  onAccountsChanged,
  onChainChanged,
  isMetaMaskInstalled,
  formatAddress,
  isLocalNetwork,
  checkRpcEndpoint,
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
      // Kiểm tra RPC endpoint nếu đang ở local network
      const isLocal = await isLocalNetwork();
      if (isLocal) {
        const rpcOk = await checkRpcEndpoint();
        if (!rpcOk) {
          setError('RPC endpoint is not responding. Please ensure Hardhat node is running: `npx hardhat node`');
          return;
        }
      }
      
      const bal = await getBalance(addr);
      setBalance(bal);
      setError(null); // Clear error on success
    } catch (err: unknown) {
      const errorObj = err as { message?: string; code?: number; data?: { code?: number; message?: string } };
      console.error('Error loading balance:', err);
      
      // Provide helpful error messages
      if (errorObj?.code === -32002 || errorObj?.data?.code === -32002) {
        setError('RPC endpoint is returning too many errors. Please ensure Hardhat node is running: `npx hardhat node`');
      } else if (errorObj?.message?.includes('RPC endpoint returned too many errors')) {
        setError('RPC endpoint is returning too many errors. Please ensure Hardhat node is running: `npx hardhat node`');
      } else {
        setError(errorObj?.message || 'Failed to load balance');
      }
    }
  };

  const connect = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Kiểm tra RPC endpoint nếu đang ở local network
      const isLocal = await isLocalNetwork();
      if (isLocal) {
        const rpcOk = await checkRpcEndpoint();
        if (!rpcOk) {
          const errorMsg = 'RPC endpoint is not responding. Please ensure Hardhat node is running: `npx hardhat node`';
          setError(errorMsg);
          throw new Error(errorMsg);
        }
      }
      
      const addr = await connectWallet();
      setAddress(addr);
      await loadBalance(addr);
    } catch (err: unknown) {
      const errorObj = err as { message?: string; code?: number; data?: { code?: number; message?: string } };
      const errorMessage = 
        errorObj?.code === -32002 || errorObj?.data?.code === -32002
          ? 'RPC endpoint is returning too many errors. Please ensure Hardhat node is running: `npx hardhat node`'
          : errorObj?.message || 'Failed to connect wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      // Gọi disconnectWallet để thử revoke permissions (nếu được hỗ trợ)
      await disconnectWallet();
    } catch (error) {
      // Ignore errors - chỉ cần clear state
      console.log('Disconnect note:', error);
    } finally {
      // Luôn clear state trong app
      setAddress(null);
      setBalance('0');
      setError(null);
    }
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

