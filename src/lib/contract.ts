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
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

/**
 * Lấy contract instance
 */
export const getContract = async (): Promise<ethers.Contract> => {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not set. Please deploy the contract first.');
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
  const contract = await getContract();
  
  // Convert to wei (1 BTC = 10^18 wei)
  const btcAmountWei = ethers.parseEther(btcAmount.toString());
  const btcPriceWei = ethers.parseEther(btcPrice.toString());

  return await contract.buyBitcoin(btcAmountWei, btcPriceWei);
};

/**
 * Bán Bitcoin
 */
export const sellBitcoin = async (
  btcAmount: number,
  btcPrice: number
): Promise<ethers.ContractTransactionResponse> => {
  const contract = await getContract();
  
  // Convert to wei
  const btcAmountWei = ethers.parseEther(btcAmount.toString());
  const btcPriceWei = ethers.parseEther(btcPrice.toString());

  return await contract.sellBitcoin(btcAmountWei, btcPriceWei);
};

/**
 * Lấy portfolio từ blockchain
 */
export const getPortfolio = async (address: string): Promise<{
  btcBalance: number;
  usdBalance: number;
}> => {
  const contract = await getContract();
  const [btcBalanceWei, usdBalanceWei] = await contract.getPortfolio(address);
  
  return {
    btcBalance: parseFloat(ethers.formatEther(btcBalanceWei)),
    usdBalance: parseFloat(ethers.formatEther(usdBalanceWei)),
  };
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
  const contract = await getContract();
  const indices = await contract.getUserTransactions(address);
  
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
};

/**
 * Đợi transaction được confirm
 */
export const waitForTransaction = async (
  tx: ethers.ContractTransactionResponse
): Promise<ethers.ContractTransactionReceipt> => {
  return await tx.wait();
};

