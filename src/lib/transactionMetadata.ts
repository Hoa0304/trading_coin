/**
 * Transaction Metadata Service
 * Tạo metadata JSON cho mỗi transaction và upload lên IPFS
 */

import { uploadJSONToIPFS, getIPFSURL } from './ipfs';

/**
 * Interface cho transaction metadata
 */
export interface TransactionMetadata {
  type: 'buy' | 'sell';
  userAddress: string;
  btcAmount: number;
  usdAmount: number;
  btcPrice: number;
  timestamp: number;
  transactionHash?: string;
  network?: string;
  chainId?: number;
  description?: string;
}

/**
 * Tạo metadata JSON cho transaction
 * 
 * @param metadata - Thông tin transaction
 * @returns JSON string
 */
export const createTransactionMetadata = (metadata: TransactionMetadata): string => {
  const metadataObj = {
    version: '1.0.0',
    type: metadata.type,
    userAddress: metadata.userAddress,
    btcAmount: metadata.btcAmount.toString(),
    usdAmount: metadata.usdAmount.toString(),
    btcPrice: metadata.btcPrice.toString(),
    timestamp: metadata.timestamp,
    transactionHash: metadata.transactionHash || null,
    network: metadata.network || 'unknown',
    chainId: metadata.chainId || null,
    description: metadata.description || `${metadata.type === 'buy' ? 'Buy' : 'Sell'} ${metadata.btcAmount} BTC at $${metadata.btcPrice}`,
    createdAt: new Date(metadata.timestamp * 1000).toISOString(),
  };

  return JSON.stringify(metadataObj, null, 2);
};

/**
 * Upload transaction metadata lên IPFS thông qua Pinata
 * 
 * @param metadata - Thông tin transaction
 * @param pinataApiKey - Pinata API Key
 * @param pinataSecretApiKey - Pinata Secret API Key
 * @returns CID của metadata trên IPFS
 */
export const uploadTransactionMetadataToIPFS = async (
  metadata: TransactionMetadata,
  pinataApiKey: string,
  pinataSecretApiKey: string
): Promise<string> => {
  try {
    // Tạo metadata JSON
    const jsonString = createTransactionMetadata(metadata);
    
    // Tạo filename với timestamp
    const filename = `transaction-${metadata.type}-${metadata.timestamp}.json`;
    
    // Upload lên IPFS qua Pinata
    const cid = await uploadJSONToIPFS(jsonString, pinataApiKey, pinataSecretApiKey, filename);
    
    console.log('✅ Transaction metadata uploaded to IPFS via Pinata:', cid);
    console.log('   IPFS URL:', getIPFSURL(cid));
    
    return cid;
  } catch (error: any) {
    console.error('❌ Error uploading transaction metadata to IPFS:', error);
    throw new Error(`Failed to upload transaction metadata: ${error.message}`);
  }
};

/**
 * Tạo metadata và upload lên IPFS trước khi thực hiện transaction
 * 
 * @param type - 'buy' hoặc 'sell'
 * @param userAddress - Địa chỉ ví của user
 * @param btcAmount - Số lượng BTC
 * @param usdAmount - Số lượng USD
 * @param btcPrice - Giá BTC
 * @param pinataApiKey - Pinata API Key
 * @param pinataSecretApiKey - Pinata Secret API Key
 * @param additionalInfo - Thông tin bổ sung (optional)
 * @returns CID của metadata trên IPFS
 */
export const prepareTransactionMetadata = async (
  type: 'buy' | 'sell',
  userAddress: string,
  btcAmount: number,
  usdAmount: number,
  btcPrice: number,
  pinataApiKey: string,
  pinataSecretApiKey: string,
  additionalInfo?: {
    network?: string;
    chainId?: number;
    description?: string;
  }
): Promise<string> => {
  const timestamp = Math.floor(Date.now() / 1000);
  
  const metadata: TransactionMetadata = {
    type,
    userAddress,
    btcAmount,
    usdAmount,
    btcPrice,
    timestamp,
    network: additionalInfo?.network,
    chainId: additionalInfo?.chainId,
    description: additionalInfo?.description,
  };

  return await uploadTransactionMetadataToIPFS(metadata, pinataApiKey, pinataSecretApiKey);
};

