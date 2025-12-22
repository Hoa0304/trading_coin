/**
 * IPFS Service - Sử dụng Pinata để lưu trữ file trên IPFS
 * 
 * Pinata là một service cung cấp IPFS storage và pinning
 * API: https://docs.pinata.cloud/
 */

// Pinata API endpoint
const PINATA_API_URL = 'https://api.pinata.cloud';

/**
 * Upload file lên IPFS thông qua Pinata
 * 
 * @param file - File object cần upload
 * @param pinataApiKey - Pinata API Key (lấy từ https://pinata.cloud/)
 * @param pinataSecretApiKey - Pinata Secret API Key
 * @returns CID (Content Identifier) của file trên IPFS
 */
export const uploadToIPFS = async (
  file: File,
  pinataApiKey: string,
  pinataSecretApiKey: string
): Promise<string> => {
  if (!pinataApiKey || !pinataSecretApiKey) {
    throw new Error('Pinata API keys are required. Get them at https://pinata.cloud/');
  }

  try {
    // Tạo FormData để upload file
    const formData = new FormData();
    formData.append('file', file);

    // Upload file lên Pinata
    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to upload file: ${response.status}`;
      
      // Parse error message nếu có
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        } else {
          errorMessage += ` ${errorText}`;
        }
      } catch {
        errorMessage += ` ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    const cid = result.IpfsHash;

    if (!cid) {
      throw new Error('No CID (IpfsHash) returned from Pinata');
    }

    console.log('✅ File uploaded to IPFS via Pinata:', cid);
    return cid;
  } catch (error: any) {
    console.error('❌ Error uploading to IPFS:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
};

/**
 * Upload nhiều files lên IPFS thông qua Pinata
 * 
 * @param files - Array of File objects
 * @param pinataApiKey - Pinata API Key
 * @param pinataSecretApiKey - Pinata Secret API Key
 * @returns CID của directory chứa các files
 */
export const uploadMultipleToIPFS = async (
  files: File[],
  pinataApiKey: string,
  pinataSecretApiKey: string
): Promise<string> => {
  if (!pinataApiKey || !pinataSecretApiKey) {
    throw new Error('Pinata API keys are required. Get them at https://pinata.cloud/');
  }

  if (files.length === 0) {
    throw new Error('No files to upload');
  }

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });

    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload files: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    const cid = result.IpfsHash;

    if (!cid) {
      throw new Error('No CID (IpfsHash) returned from Pinata');
    }

    console.log('✅ Files uploaded to IPFS via Pinata:', cid);
    return cid;
  } catch (error: any) {
    console.error('❌ Error uploading files to IPFS:', error);
    throw new Error(`Failed to upload files to IPFS: ${error.message}`);
  }
};

/**
 * Upload JSON data lên IPFS thông qua Pinata
 * 
 * @param data - JSON object hoặc string
 * @param pinataApiKey - Pinata API Key
 * @param pinataSecretApiKey - Pinata Secret API Key
 * @param filename - Tên file (optional, default: 'data.json')
 * @returns CID của file JSON trên IPFS
 */
export const uploadJSONToIPFS = async (
  data: object | string,
  pinataApiKey: string,
  pinataSecretApiKey: string,
  filename: string = 'data.json'
): Promise<string> => {
  if (!pinataApiKey || !pinataSecretApiKey) {
    throw new Error('Pinata API keys are required. Get them at https://pinata.cloud/');
  }

  try {
    // Convert data to JSON string if needed
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    
    // Create a Blob from JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], filename, { type: 'application/json' });

    return await uploadToIPFS(file, pinataApiKey, pinataSecretApiKey);
  } catch (error: any) {
    console.error('❌ Error uploading JSON to IPFS:', error);
    throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
  }
};

/**
 * Lấy URL để truy cập file từ IPFS
 * 
 * @param cid - Content Identifier của file trên IPFS
 * @param gateway - IPFS Gateway URL (optional, default: https://ipfs.io/ipfs/)
 * @returns URL để truy cập file
 */
export const getIPFSURL = (cid: string, gateway?: string): string => {
  // Mặc định dùng Pinata gateway hoặc IPFS public gateway
  const defaultGateway = gateway || 
                        import.meta.env.VITE_IPFS_GATEWAY_URL || 
                        'https://gateway.pinata.cloud/ipfs/';
  
  // Remove trailing slash if present
  const baseGateway = defaultGateway.endsWith('/') 
    ? defaultGateway.slice(0, -1) 
    : defaultGateway;
  
  return `${baseGateway}/${cid}`;
};

/**
 * Download file từ IPFS
 * 
 * @param cid - Content Identifier của file
 * @param gateway - IPFS Gateway URL (optional)
 * @returns File content as Blob
 */
export const downloadFromIPFS = async (
  cid: string,
  gateway?: string
): Promise<Blob> => {
  try {
    const url = getIPFSURL(cid, gateway);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download from IPFS: ${response.status}`);
    }

    return await response.blob();
  } catch (error: any) {
    console.error('❌ Error downloading from IPFS:', error);
    throw new Error(`Failed to download from IPFS: ${error.message}`);
  }
};

/**
 * Download và parse JSON từ IPFS
 * 
 * @param cid - Content Identifier của JSON file
 * @param gateway - IPFS Gateway URL (optional)
 * @returns Parsed JSON object
 */
export const downloadJSONFromIPFS = async <T = any>(
  cid: string,
  gateway?: string
): Promise<T> => {
  try {
    const blob = await downloadFromIPFS(cid, gateway);
    const text = await blob.text();
    return JSON.parse(text) as T;
  } catch (error: any) {
    console.error('❌ Error downloading JSON from IPFS:', error);
    throw new Error(`Failed to download JSON from IPFS: ${error.message}`);
  }
};

/**
 * Kiểm tra file có tồn tại trên IPFS không
 * 
 * @param cid - Content Identifier
 * @param gateway - IPFS Gateway URL (optional)
 * @returns true nếu file tồn tại, false nếu không
 */
export const checkIPFSFileExists = async (
  cid: string,
  gateway?: string
): Promise<boolean> => {
  try {
    const url = getIPFSURL(cid, gateway);
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

