import { ethers } from 'ethers';
import { getSigner } from './web3';

/**
 * Contract ABI - Simplified version
 * Trong production, nên import từ file JSON sau khi compile
 */
export const CONTRACT_ABI = [
  'function initializePortfolio() external',
  'function buyBitcoin(uint256 btcAmount, uint256 btcPrice) external',
  'function sellBitcoin(uint256 btcAmount, uint256 btcPrice) external',
  'function getPortfolio(address user) external view returns (uint256 btcBalance, uint256 usdBalance)',
  'function getTransactionCount() external view returns (uint256)',
  'function getTransaction(uint256 index) external view returns (address user, bool isBuy, uint256 btcAmount, uint256 usdAmount, uint256 btcPrice, uint256 timestamp)',
  'function getUserTransactions(address user) external view returns (uint256[] memory)',
  'event TradeExecuted(address indexed user, bool isBuy, uint256 btcAmount, uint256 usdAmount, uint256 btcPrice, uint256 timestamp)',
  'event PortfolioUpdated(address indexed user, uint256 btcBalance, uint256 usdBalance)',
];

// Contract address - Sẽ được set sau khi deploy
// Để test, bạn cần deploy contract lên Sepolia testnet và paste address ở đây
const rawContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';

// Validate và normalize contract address
export const CONTRACT_ADDRESS = (() => {
  if (!rawContractAddress) return '';
  
  // Trim whitespace và kiểm tra format
  const trimmed = rawContractAddress.trim();
  
  // Kiểm tra format address (phải bắt đầu bằng 0x và có 42 ký tự)
  if (trimmed.startsWith('0x') && trimmed.length === 42) {
    return trimmed;
  }
  
  // Nếu không đúng format, log warning nhưng vẫn return để hiển thị lỗi rõ hơn
  console.warn('Invalid contract address format:', trimmed);
  return trimmed;
})();

/**
 * Validate contract address
 */
const isValidAddress = (address: string): boolean => {
  return address.startsWith('0x') && address.length === 42 && /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Lấy contract instance
 */
export const getContract = async (): Promise<ethers.Contract> => {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not set. Please deploy the contract first and add VITE_CONTRACT_ADDRESS to .env file.');
  }

  // Validate address format
  if (!isValidAddress(CONTRACT_ADDRESS)) {
    throw new Error(`Invalid contract address format: "${CONTRACT_ADDRESS}". Address must be 42 characters (0x + 40 hex characters). Please check your .env file.`);
  }

  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

/**
 * Khởi tạo portfolio cho user mới
 */
export const initializePortfolio = async (): Promise<ethers.ContractTransactionResponse> => {
  const contract = await getContract();
  return await contract.initializePortfolio();
};

/**
 * Mua Bitcoin
 */
export const buyBitcoin = async (
  btcAmount: number,
  btcPrice: number
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = await getContract();
    
    // Convert to wei (1 BTC = 10^18 wei)
    const btcAmountWei = ethers.parseEther(btcAmount.toString());
    const btcPriceWei = ethers.parseEther(btcPrice.toString());

    // Kiểm tra xem contract có code không (đã được deploy)
    const code = await contract.runner?.provider?.getCode(await contract.getAddress());
    if (!code || code === '0x') {
      throw new Error('Contract not deployed. Please deploy the contract first.');
    }

    return await contract.buyBitcoin(btcAmountWei, btcPriceWei);
  } catch (error: any) {
    // Xử lý lỗi cụ thể hơn
    if (error.message?.includes('Portfolio not initialized')) {
      throw new Error('Portfolio chưa được khởi tạo. Vui lòng khởi tạo portfolio trước.');
    }
    if (error.message?.includes('Insufficient balance')) {
      throw new Error('Số dư USD không đủ để mua Bitcoin.');
    }
    if (error.code === 'CALL_EXCEPTION' || error.message?.includes('execution reverted')) {
      throw new Error('Giao dịch thất bại. Có thể portfolio chưa được khởi tạo hoặc số dư không đủ.');
    }
    throw error;
  }
};

/**
 * Bán Bitcoin
 */
export const sellBitcoin = async (
  btcAmount: number,
  btcPrice: number
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = await getContract();
    
    // Convert to wei
    const btcAmountWei = ethers.parseEther(btcAmount.toString());
    const btcPriceWei = ethers.parseEther(btcPrice.toString());

    // Kiểm tra xem contract có code không (đã được deploy)
    const code = await contract.runner?.provider?.getCode(await contract.getAddress());
    if (!code || code === '0x') {
      throw new Error('Contract not deployed. Please deploy the contract first.');
    }

    return await contract.sellBitcoin(btcAmountWei, btcPriceWei);
  } catch (error: any) {
    // Xử lý lỗi cụ thể hơn
    if (error.message?.includes('Portfolio not initialized')) {
      throw new Error('Portfolio chưa được khởi tạo. Vui lòng khởi tạo portfolio trước.');
    }
    if (error.message?.includes('Insufficient balance')) {
      throw new Error('Số dư BTC không đủ để bán.');
    }
    if (error.code === 'CALL_EXCEPTION' || error.message?.includes('execution reverted')) {
      throw new Error('Giao dịch thất bại. Có thể portfolio chưa được khởi tạo hoặc số dư không đủ.');
    }
    throw error;
  }
};

/**
 * Lấy portfolio từ blockchain
 */
export const getPortfolio = async (address: string): Promise<{
  btcBalance: number;
  usdBalance: number;
}> => {
  try {
    const contract = await getContract();
    
    // Kiểm tra contract có code không
    const provider = contract.runner?.provider;
    if (provider) {
      try {
        const contractAddress = await contract.getAddress();
        const code = await provider.getCode(contractAddress);
        if (!code || code === '0x') {
          console.warn('Contract not deployed at address:', contractAddress);
          return {
            btcBalance: 0,
            usdBalance: 0,
          };
        }
      } catch (error: any) {
        // Nếu lỗi khi gọi getCode, có thể là RPC endpoint không hoạt động
        if (error.message?.includes('RPC endpoint') || error.message?.includes('Failed to fetch')) {
          throw new Error('RPC endpoint is returning too many errors. Please ensure Hardhat node is running: `npx hardhat node`');
        }
        throw error;
      }
    }
    
    // Gọi contract với retry nếu cần
    let retries = 3;
    while (retries > 0) {
      try {
        const [btcBalanceWei, usdBalanceWei] = await contract.getPortfolio(address);
        
        const btcBalance = parseFloat(ethers.formatEther(btcBalanceWei));
        const usdBalance = parseFloat(ethers.formatEther(usdBalanceWei));
        
        return {
          btcBalance,
          usdBalance,
        };
      } catch (error: any) {
        retries--;
        if (retries === 0) {
          throw error;
        }
        // Đợi một chút trước khi retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Fallback (sẽ không bao giờ đến đây)
    return {
      btcBalance: 0,
      usdBalance: 0,
    };
  } catch (error: any) {
    console.error('Error getting portfolio:', error);
    // Nếu portfolio chưa được khởi tạo, trả về 0
    if (error.code === 'CALL_EXCEPTION' || error.message?.includes('execution reverted')) {
      return {
        btcBalance: 0,
        usdBalance: 0,
      };
    }
    throw error;
  }
};

/**
 * Lấy transactions của user từ blockchain
 */
export const getUserTransactions = async (
  address: string,
  limit: number = 10
): Promise<Array<{
  type: 'buy' | 'sell';
  btcAmount: number;
  usdAmount: number;
  btcPrice: number;
  timestamp: number;
}>> => {
  try {
    const contract = await getContract();
    
    // Kiểm tra contract có code không
    const provider = contract.runner?.provider;
    if (provider) {
      const contractAddress = await contract.getAddress();
      const code = await provider.getCode(contractAddress);
      if (!code || code === '0x') {
        console.warn('Contract not deployed at address:', contractAddress);
        return []; // Trả về mảng rỗng nếu contract chưa deploy
      }
    }
    
    const indices = await contract.getUserTransactions(address);
    
    // Nếu không có transactions, trả về mảng rỗng
    if (!indices || indices.length === 0) {
      return [];
    }
    
    // Lấy transactions mới nhất (reverse và limit)
    const reversedIndices = [...indices].reverse().slice(0, limit);
    
    const transactions = await Promise.all(
      reversedIndices.map(async (index: bigint) => {
        const tx = await contract.getTransaction(index);
        return {
          type: tx.isBuy ? 'buy' : 'sell' as 'buy' | 'sell',
          btcAmount: parseFloat(ethers.formatEther(tx.btcAmount)),
          usdAmount: parseFloat(ethers.formatEther(tx.usdAmount)),
          btcPrice: parseFloat(ethers.formatEther(tx.btcPrice)),
          timestamp: Number(tx.timestamp) * 1000, // Convert to milliseconds
        };
      })
    );
    
    return transactions;
  } catch (error: any) {
    console.error('Error getting user transactions:', error);
    // Nếu contract chưa được deploy hoặc có lỗi decode, trả về mảng rỗng
    if (error.code === 'CALL_EXCEPTION' || 
        error.code === 'BAD_DATA' || 
        error.message?.includes('execution reverted') ||
        error.message?.includes('could not decode')) {
      return [];
    }
    throw error;
  }
};

/**
 * Đợi transaction được confirm
 */
export const waitForTransaction = async (
  tx: ethers.ContractTransactionResponse
): Promise<ethers.ContractTransactionReceipt> => {
  return await tx.wait();
};

