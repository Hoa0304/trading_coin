import { ethers } from 'ethers';

/**
 * Web3 Service - Quản lý kết nối blockchain và wallet
 */

// Network configuration
export const NETWORKS = {
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
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY';

/**
 * Kiểm tra MetaMask có được cài đặt không
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Kết nối MetaMask wallet
 */
export const connectWallet = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected the connection request.');
    }
    throw error;
  }
};

/**
 * Lấy provider từ MetaMask
 */
export const getProvider = (): ethers.BrowserProvider => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

/**
 * Lấy signer từ provider
 */
export const getSigner = async (): Promise<ethers.JsonRpcSigner> => {
  const provider = getProvider();
  return await provider.getSigner();
};

/**
 * Lấy địa chỉ wallet hiện tại
 */
export const getCurrentAddress = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
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
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
};

/**
 * Chuyển đổi network (nếu cần)
 */
export const switchNetwork = async (network: keyof typeof NETWORKS = DEFAULT_NETWORK): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  const networkConfig = NETWORKS[network];
  const chainId = parseInt(networkConfig.chainId, 16);

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkConfig.chainId }],
    });
  } catch (error: any) {
    // Nếu chain chưa được thêm, thêm nó
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
      } catch (addError) {
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
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  window.ethereum.on('accountsChanged', callback);

  return () => {
    window.ethereum.removeListener('accountsChanged', callback);
  };
};

/**
 * Lắng nghe sự kiện thay đổi network
 */
export const onChainChanged = (callback: (chainId: string) => void): (() => void) => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  window.ethereum.on('chainChanged', callback);

  return () => {
    window.ethereum.removeListener('chainChanged', callback);
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
  const provider = getProvider();
  return await provider.waitForTransaction(txHash);
};

// Extend Window interface để TypeScript nhận diện ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

