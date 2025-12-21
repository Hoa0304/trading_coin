import { ethers } from 'ethers';

/**
 * Web3 Service - Quản lý kết nối blockchain và wallet
 */

// Network configuration
export const NETWORKS = {
  localhost: {
    chainId: '0x539', // 1337 in hex (0x539 = 1337 decimal)
    chainName: 'Hardhat Local',
    rpcUrls: ['http://127.0.0.1:8545'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: [],
  },
  sepolia: {
    chainId: '0xaa36a7', // 11155111
    chainName: 'Sepolia Test Network',
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  mainnet: {
    chainId: '0x1', // 1
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://etherscan.io'],
  },
};

// Sử dụng Sepolia testnet mặc định
const DEFAULT_NETWORK = 'sepolia';

/**
 * Kiểm tra MetaMask có được cài đặt không
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Kiểm tra xem có đang ở local network không
 */
export const isLocalNetwork = async (): Promise<boolean> => {
  if (!isMetaMaskInstalled() || !window.ethereum) return false;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
    // Localhost networks: 1337 (0x539), 31337 (0x7a69)
    return chainId === '0x539' || chainId === '0x7a69';
  } catch {
    return false;
  }
};

/**
 * Kiểm tra RPC endpoint có đang hoạt động không
 */
export const checkRpcEndpoint = async (): Promise<boolean> => {
  if (!isMetaMaskInstalled() || !window.ethereum) return false;
  
  try {
    // Thử gọi eth_blockNumber để kiểm tra RPC
    await window.ethereum.request({ method: 'eth_blockNumber' });
    return true;
  } catch (error: unknown) {
    const errorObj = error as { code?: number; message?: string };
    // Nếu là lỗi -32002, RPC endpoint có vấn đề
    if (errorObj.code === -32002) {
      console.error('RPC endpoint is returning too many errors. Please ensure Hardhat node is running: `npx hardhat node`');
    }
    return false;
  }
};

/**
 * Kết nối MetaMask wallet
 */
export const connectWallet = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    }) as string[];

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    return accounts[0];
  } catch (error: unknown) {
    const errorObj = error as { code?: number };
    if (errorObj.code === 4001) {
      throw new Error('User rejected the connection request.');
    }
    throw error;
  }
};

/**
 * Đăng xuất khỏi MetaMask wallet
 * Lưu ý: MetaMask không có API để disconnect hoàn toàn,
 * nhưng ta có thể yêu cầu user disconnect từ MetaMask UI hoặc chỉ clear state trong app
 * Khi user disconnect từ MetaMask, event 'accountsChanged' sẽ được trigger với mảng rỗng
 */
export const disconnectWallet = async (): Promise<void> => {
  if (!isMetaMaskInstalled() || !window.ethereum) {
    return;
  }

  try {
    // Thử sử dụng wallet_revokePermissions nếu có (một số wallet hỗ trợ)
    // MetaMask có thể không hỗ trợ, nhưng không sao vì ta chỉ cần clear state
    try {
      await window.ethereum.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      });
    } catch {
      // Nếu không hỗ trợ, không sao - ta vẫn clear state
      // User có thể disconnect từ MetaMask UI nếu muốn
    }
  } catch {
    // Ignore errors - chỉ cần clear state trong app là đủ
    console.log('Note: MetaMask may not support wallet_revokePermissions. User can disconnect from MetaMask UI if needed.');
  }
};


/**
 * Wrapper để handle network errors gracefully
 */
const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  retries: number = 3
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      
      // Extract error information
      const errorObj = error as { 
        message?: string; 
        code?: number | string; 
        data?: { 
          cause?: { 
            message?: string;
            code?: number;
          };
          code?: number;
          message?: string;
        };
      };
      
      // Check for various network/RPC errors
      const isNetworkError = 
        errorObj?.message?.includes('Failed to fetch') ||
        errorObj?.message?.includes('could not coalesce') ||
        errorObj?.message?.includes('RPC endpoint returned too many errors') ||
        errorObj?.code === -32603 ||
        errorObj?.code === -32002 ||
        errorObj?.data?.code === -32002 ||
        errorObj?.data?.cause?.code === -32002 ||
        (errorObj?.data?.cause?.message?.includes('Failed to fetch')) ||
        (errorObj?.data?.message?.includes('RPC endpoint returned too many errors'));
      
      if (isNetworkError) {
        // Đợi một chút trước khi retry (exponential backoff)
        if (i < retries - 1) {
          const delay = Math.min(2000 * Math.pow(2, i), 10000); // Max 10 seconds
          console.warn(`Network error (attempt ${i + 1}/${retries}), retrying in ${delay}ms...`, errorObj);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          // Last retry failed - provide helpful error message
          const helpfulMessage = errorObj?.data?.message || errorObj?.message || 'Network error';
          if (helpfulMessage.includes('RPC endpoint returned too many errors')) {
            throw new Error(
              'RPC endpoint is returning too many errors. ' +
              'Please ensure Hardhat node is running: `npx hardhat node`'
            );
          }
        }
      }
      
      // Nếu không phải lỗi network, throw ngay
      throw error;
    }
  }
  
  throw lastError;
};

/**
 * Lấy provider từ MetaMask
 */
export const getProvider = (): ethers.BrowserProvider => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  // Tạo provider với network name để tránh ENS lookup
  // 'any' network sẽ không cố resolve ENS
  const provider = new ethers.BrowserProvider(window.ethereum, 'any');
  
  // Override resolveName để tránh lỗi ENS trên local network
  const originalResolveName = provider.resolveName.bind(provider);
  provider.resolveName = async (name: string) => {
    // Nếu là address (bắt đầu bằng 0x), return luôn
    if (name.startsWith('0x')) {
      return name;
    }
    // Nếu không phải address, thử resolve nhưng catch error
    try {
      return await originalResolveName(name);
    } catch (error: unknown) {
      // Nếu lỗi ENS (UNSUPPORTED_OPERATION) hoặc network error, return null
      const errorObj = error as { code?: string | number; message?: string };
      if (
        errorObj.code === 'UNSUPPORTED_OPERATION' ||
        errorObj.code === -32002 ||
        errorObj?.message?.includes('Failed to fetch') ||
        errorObj?.message?.includes('could not coalesce') ||
        errorObj?.message?.includes('RPC endpoint returned too many errors')
      ) {
        return null;
      }
      throw error;
    }
  };
  
  // Wrap các method quan trọng để handle errors
  const originalGetBalance = provider.getBalance.bind(provider);
  provider.getBalance = async (addressOrName: string | Promise<string>, blockTag?: ethers.BlockTag) => {
    return withErrorHandling(() => originalGetBalance(addressOrName, blockTag));
  };
  
  const originalGetCode = provider.getCode.bind(provider);
  provider.getCode = async (addressOrName: string | Promise<string>, blockTag?: ethers.BlockTag) => {
    return withErrorHandling(() => originalGetCode(addressOrName, blockTag));
  };
  
  const originalCall = provider.call.bind(provider);
  provider.call = async (tx: ethers.TransactionRequest) => {
    return withErrorHandling(() => originalCall(tx));
  };
  
  return provider;
};

/**
 * Lấy signer từ provider
 */
export const getSigner = async (): Promise<ethers.JsonRpcSigner> => {
  const provider = getProvider();
  try {
    return await provider.getSigner();
  } catch (error: unknown) {
    // Nếu lỗi ENS trên local network, thử lại với address trực tiếp
    const errorObj = error as { code?: string; operation?: string };
    if (errorObj.code === 'UNSUPPORTED_OPERATION' && errorObj.operation === 'getEnsAddress') {
      // Lấy address từ MetaMask trực tiếp
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      if (accounts.length > 0) {
        return await provider.getSigner(accounts[0]);
      }
    }
    throw error;
  }
};

/**
 * Lấy địa chỉ wallet hiện tại
 */
export const getCurrentAddress = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled() || !window.ethereum) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    }) as string[];
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting current address:', error);
    return null;
  }
};

/**
 * Lấy số dư ETH
 */
export const getBalance = async (address: string): Promise<string> => {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error: unknown) {
    // Handle network errors including -32002
    const errorObj = error as { message?: string; code?: number; data?: { code?: number; message?: string } };
    const isNetworkError = 
      errorObj?.message?.includes('Failed to fetch') ||
      errorObj?.message?.includes('could not coalesce') ||
      errorObj?.message?.includes('RPC endpoint returned too many errors') ||
      errorObj?.code === -32603 ||
      errorObj?.code === -32002 ||
      errorObj?.data?.code === -32002;
    
    if (isNetworkError) {
      console.warn('Network error while fetching balance, retrying...', error);
      // Retry sau 2 giây
      await new Promise(resolve => setTimeout(resolve, 2000));
      const provider = getProvider();
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    }
    throw error;
  }
};

/**
 * Chuyển đổi network (nếu cần)
 */
export const switchNetwork = async (network: keyof typeof NETWORKS = DEFAULT_NETWORK): Promise<void> => {
  if (!isMetaMaskInstalled() || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const networkConfig = NETWORKS[network];

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    });
  } catch (error: unknown) {
    // Nếu chain chưa được thêm, thêm nó
    const errorObj = error as { code?: number };
    if (errorObj.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
      } catch {
        throw new Error('Failed to add network');
      }
    } else {
      throw error;
    }
  }
};

/**
 * Lắng nghe sự kiện thay đổi account
 */
export const onAccountsChanged = (callback: (accounts: string[]) => void): (() => void) => {
  if (!isMetaMaskInstalled() || !window.ethereum) {
    return () => {};
  }

  const wrappedCallback = (...args: unknown[]) => {
    callback(args[0] as string[]);
  };

  window.ethereum.on('accountsChanged', wrappedCallback);

  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', wrappedCallback);
    }
  };
};

/**
 * Lắng nghe sự kiện thay đổi network
 */
export const onChainChanged = (callback: (chainId: string) => void): (() => void) => {
  if (!isMetaMaskInstalled() || !window.ethereum) {
    return () => {};
  }

  const wrappedCallback = (...args: unknown[]) => {
    callback(args[0] as string);
  };

  window.ethereum.on('chainChanged', wrappedCallback);

  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('chainChanged', wrappedCallback);
    }
  };
};

/**
 * Format address để hiển thị (0x1234...5678)
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Kiểm tra transaction đã được confirm chưa
 */
export const waitForTransaction = async (txHash: string): Promise<ethers.TransactionReceipt> => {
  try {
    const provider = getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    if (!receipt) {
      throw new Error('Transaction receipt is null');
    }
    return receipt;
  } catch (error: unknown) {
    // Handle network errors including -32002
    const errorObj = error as { message?: string; code?: number; data?: { code?: number; message?: string } };
    const isNetworkError = 
      errorObj?.message?.includes('Failed to fetch') ||
      errorObj?.message?.includes('could not coalesce') ||
      errorObj?.message?.includes('RPC endpoint returned too many errors') ||
      errorObj?.code === -32603 ||
      errorObj?.code === -32002 ||
      errorObj?.data?.code === -32002;
    
    if (isNetworkError) {
      console.warn('Network error while waiting for transaction, retrying...', error);
      // Retry sau 2 giây
      await new Promise(resolve => setTimeout(resolve, 2000));
      const provider = getProvider();
      const receipt = await provider.waitForTransaction(txHash);
      if (!receipt) {
        throw new Error('Transaction receipt is null');
      }
      return receipt;
    }
    throw error;
  }
};

// Extend Window interface để TypeScript nhận diện ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

