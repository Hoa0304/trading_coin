import { ethers } from 'ethers';
import { getSigner, isLocalNetwork, switchNetwork } from './web3';
import { CONTRACT_ABI } from './contractABI';
import { prepareTransactionMetadata } from './transactionMetadata';

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
 * Kiểm tra và đảm bảo đang ở đúng network
 */
const ensureCorrectNetwork = async (): Promise<void> => {
  try {
    const isLocal = await isLocalNetwork();
    if (!isLocal) {
      console.warn('⚠️  Not connected to local network. Attempting to switch...');
      try {
        await switchNetwork('localhost');
        console.log('✅ Switched to localhost network');
      } catch (error: any) {
        console.error('❌ Failed to switch network:', error.message);
        throw new Error('Please switch MetaMask to Hardhat Local Network (Chain ID: 1337)');
      }
    }
  } catch (error: any) {
    // Nếu không thể kiểm tra network, log warning nhưng không throw
    console.warn('Could not verify network:', error.message);
  }
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

  // Đảm bảo đang ở đúng network
  await ensureCorrectNetwork();

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
 * Tự động tạo metadata, upload lên IPFS và lưu CID vào blockchain
 */
export const buyBitcoin = async (
  btcAmount: number,
  btcPrice: number,
  userAddress: string
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = await getContract();
    
    // Convert to wei (1 BTC = 10^18 wei)
    const btcAmountWei = ethers.parseEther(btcAmount.toString());
    const btcPriceWei = ethers.parseEther(btcPrice.toString());

    // Tính USD amount
    const usdAmount = btcAmount * btcPrice;

    // Kiểm tra xem contract có code không (đã được deploy)
    const provider = contract.runner?.provider;
    if (provider) {
      try {
        const contractAddress = await contract.getAddress();
        const network = await provider.getNetwork().catch(() => null);
        const code = await provider.getCode(contractAddress);
        if (!code || code === '0x') {
          const networkInfo = network ? `Network: ${network.name} (Chain ID: ${network.chainId})` : 'Unknown network';
          console.error('❌ Contract not deployed at address:', contractAddress);
          console.error('   Current network:', networkInfo);
          throw new Error(`Contract not deployed at address ${contractAddress} on ${networkInfo}. Please ensure Hardhat node is running and contract is deployed.`);
        }
      } catch (error: any) {
        if (error.message?.includes('Contract not deployed')) {
          throw error;
        }
        // Nếu lỗi khác, log và throw
        console.error('Error checking contract deployment:', error);
        throw error;
      }
    }

    // Tạo metadata và upload lên IPFS trước khi thực hiện transaction
    let ipfsCID = '';
    const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
    const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;
    
    if (pinataApiKey && pinataSecretApiKey) {
      try {
        const network = await provider?.getNetwork().catch(() => null);
        console.log('📤 Uploading transaction metadata to IPFS via Pinata...');
        
        ipfsCID = await prepareTransactionMetadata(
          'buy',
          userAddress,
          btcAmount,
          usdAmount,
          btcPrice,
          pinataApiKey,
          pinataSecretApiKey,
          {
            network: network?.name || 'unknown',
            chainId: network ? Number(network.chainId) : undefined,
            description: `Buy ${btcAmount} BTC at $${btcPrice}`,
          }
        );
        
        console.log('✅ Metadata uploaded to IPFS via Pinata, CID:', ipfsCID);
      } catch (ipfsError: any) {
        // Nếu upload IPFS thất bại, log warning nhưng vẫn tiếp tục với transaction
        console.warn('⚠️  Failed to upload metadata to IPFS:', ipfsError.message);
        console.warn('   Transaction will continue without IPFS metadata.');
        ipfsCID = '';
      }
    } else {
      console.warn('⚠️  Pinata API keys not found. Transaction will continue without IPFS metadata.');
    }

    // Gọi contract với CID - chỉ định rõ function signature để tránh ambiguous
    // Luôn gọi function với 3 parameters (có CID, có thể là empty string)
    const buyFunction = contract.getFunction('buyBitcoin(uint256,uint256,string)');
    return await buyFunction(btcAmountWei, btcPriceWei, ipfsCID);
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
 * Tự động tạo metadata, upload lên IPFS và lưu CID vào blockchain
 */
export const sellBitcoin = async (
  btcAmount: number,
  btcPrice: number,
  userAddress: string
): Promise<ethers.ContractTransactionResponse> => {
  try {
    const contract = await getContract();
    
    // Convert to wei
    const btcAmountWei = ethers.parseEther(btcAmount.toString());
    const btcPriceWei = ethers.parseEther(btcPrice.toString());

    // Tính USD amount
    const usdAmount = btcAmount * btcPrice;

    // Kiểm tra xem contract có code không (đã được deploy)
    const provider = contract.runner?.provider;
    if (provider) {
      try {
        const contractAddress = await contract.getAddress();
        const network = await provider.getNetwork().catch(() => null);
        const code = await provider.getCode(contractAddress);
        if (!code || code === '0x') {
          const networkInfo = network ? `Network: ${network.name} (Chain ID: ${network.chainId})` : 'Unknown network';
          console.error('❌ Contract not deployed at address:', contractAddress);
          console.error('   Current network:', networkInfo);
          throw new Error(`Contract not deployed at address ${contractAddress} on ${networkInfo}. Please ensure Hardhat node is running and contract is deployed.`);
        }
      } catch (error: any) {
        if (error.message?.includes('Contract not deployed')) {
          throw error;
        }
        // Nếu lỗi khác, log và throw
        console.error('Error checking contract deployment:', error);
        throw error;
      }
    }

    // Tạo metadata và upload lên IPFS trước khi thực hiện transaction
    let ipfsCID = '';
    const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
    const pinataSecretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;
    
    if (pinataApiKey && pinataSecretApiKey) {
      try {
        const network = await provider?.getNetwork().catch(() => null);
        console.log('📤 Uploading transaction metadata to IPFS via Pinata...');
        
        ipfsCID = await prepareTransactionMetadata(
          'sell',
          userAddress,
          btcAmount,
          usdAmount,
          btcPrice,
          pinataApiKey,
          pinataSecretApiKey,
          {
            network: network?.name || 'unknown',
            chainId: network ? Number(network.chainId) : undefined,
            description: `Sell ${btcAmount} BTC at $${btcPrice}`,
          }
        );
        
        console.log('✅ Metadata uploaded to IPFS via Pinata, CID:', ipfsCID);
      } catch (ipfsError: any) {
        // Nếu upload IPFS thất bại, log warning nhưng vẫn tiếp tục với transaction
        console.warn('⚠️  Failed to upload metadata to IPFS:', ipfsError.message);
        console.warn('   Transaction will continue without IPFS metadata.');
        ipfsCID = '';
      }
    } else {
      console.warn('⚠️  Pinata API keys not found. Transaction will continue without IPFS metadata.');
    }

    // Gọi contract với CID - chỉ định rõ function signature để tránh ambiguous
    // Luôn gọi function với 3 parameters (có CID, có thể là empty string)
    const sellFunction = contract.getFunction('sellBitcoin(uint256,uint256,string)');
    return await sellFunction(btcAmountWei, btcPriceWei, ipfsCID);
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
        
        // Log network info để debug
        try {
          const network = await provider.getNetwork();
          console.log('🌐 Current network:', network.name, 'Chain ID:', network.chainId.toString());
          console.log('📋 Checking contract at:', contractAddress);
        } catch (e) {
          console.warn('Could not get network info:', e);
        }
        
        const code = await provider.getCode(contractAddress);
        if (!code || code === '0x') {
          // Log thêm thông tin để debug
          const network = await provider.getNetwork().catch(() => null);
          const networkInfo = network ? `Network: ${network.name} (Chain ID: ${network.chainId})` : 'Unknown network';
          console.warn('❌ Contract not deployed at address:', contractAddress);
          console.warn('   Current network:', networkInfo);
          console.warn('   Expected network: localhost (Chain ID: 1337)');
          console.warn('   💡 Make sure:');
          console.warn('      1. Hardhat node is running: npx hardhat node');
          console.warn('      2. MetaMask is connected to Hardhat Local Network (Chain ID: 1337)');
          console.warn('      3. Contract is deployed: npx hardhat run scripts/deploy.js --network localhost');
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
  ipfsCID: string;
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
        try {
          // Thử gọi với ABI mới (có ipfsCID)
          const tx = await contract.getTransaction(index);
          return {
            type: tx.isBuy ? 'buy' : 'sell' as 'buy' | 'sell',
            btcAmount: parseFloat(ethers.formatEther(tx.btcAmount)),
            usdAmount: parseFloat(ethers.formatEther(tx.usdAmount)),
            btcPrice: parseFloat(ethers.formatEther(tx.btcPrice)),
            timestamp: Number(tx.timestamp) * 1000, // Convert to milliseconds
            ipfsCID: tx.ipfsCID || '', // CID của metadata trên IPFS
          };
        } catch (error: any) {
          // Nếu lỗi decode (có thể là contract cũ không có ipfsCID), decode thủ công từ raw data
          if (error.code === 'BAD_DATA' || error.message?.includes('could not decode')) {
            try {
              // Decode thủ công từ raw data (transaction cũ chỉ có 6 fields, không có ipfsCID)
              const provider = contract.runner?.provider;
              if (provider) {
                // Gọi contract với interface cũ (6 return values thay vì 7)
                const oldInterface = new ethers.Interface([
                  'function getTransaction(uint256) view returns (address, bool, uint256, uint256, uint256, uint256)'
                ]);
                
                const data = oldInterface.encodeFunctionData('getTransaction', [index]);
                const result = await provider.call({
                  to: await contract.getAddress(),
                  data: data,
                });
                
                const decoded = oldInterface.decodeFunctionResult('getTransaction', result);
                
                return {
                  type: decoded[1] ? 'buy' : 'sell' as 'buy' | 'sell',
                  btcAmount: parseFloat(ethers.formatEther(decoded[2])),
                  usdAmount: parseFloat(ethers.formatEther(decoded[3])),
                  btcPrice: parseFloat(ethers.formatEther(decoded[4])),
                  timestamp: Number(decoded[5]) * 1000,
                  ipfsCID: '', // Transaction cũ không có CID
                };
              }
            } catch (oldError: any) {
              // Nếu vẫn lỗi, có thể là vấn đề khác
              console.warn(`Cannot decode transaction ${index}:`, oldError.message);
              return null;
            }
          }
          throw error;
        }
      })
    );
    
    // Filter out null transactions và đảm bảo type đúng
    return transactions.filter((tx): tx is {
      type: 'buy' | 'sell';
      btcAmount: number;
      usdAmount: number;
      btcPrice: number;
      timestamp: number;
      ipfsCID: string;
    } => tx !== null);
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
  const receipt = await tx.wait();
  if (!receipt) {
    throw new Error('Transaction receipt is null');
  }
  return receipt;
};

