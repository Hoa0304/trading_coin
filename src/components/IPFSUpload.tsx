import { useState } from 'react';
import { Upload, File, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { uploadToIPFS, uploadJSONToIPFS, getIPFSURL } from '../lib/ipfs';

interface IPFSUploadProps {
  onUploadComplete?: (cid: string, url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  uploadJSON?: boolean; // If true, upload as JSON
}

/**
 * Component để upload file lên IPFS sử dụng web3.storage
 */
export function IPFSUpload({
  onUploadComplete,
  accept,
  maxSize = 10, // Default 10MB
  uploadJSON = false,
}: IPFSUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [cid, setCid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);

  // Lấy API key từ environment variable
  const apiKey = import.meta.env.VITE_WEB3_STORAGE_API_KEY || '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Kiểm tra kích thước file
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setCid(null);
    setIpfsUrl(null);
  };

  const handleJSONChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
    setError(null);
    setCid(null);
    setIpfsUrl(null);
  };

  const handleUpload = async () => {
    if (!apiKey) {
      setError('Web3.Storage API key not found. Please add VITE_WEB3_STORAGE_API_KEY to .env file.');
      return;
    }

    if (uploadJSON) {
      if (!jsonData.trim()) {
        setError('Please enter JSON data');
        return;
      }

      try {
        // Validate JSON
        JSON.parse(jsonData);
      } catch {
        setError('Invalid JSON format');
        return;
      }
    } else {
      if (!file) {
        setError('Please select a file');
        return;
      }
    }

    setUploading(true);
    setError(null);

    try {
      let uploadedCid: string;

      if (uploadJSON) {
        // Upload JSON
        uploadedCid = await uploadJSONToIPFS(jsonData, apiKey);
      } else {
        // Upload file
        uploadedCid = await uploadToIPFS(file!, apiKey);
      }

      const url = getIPFSURL(uploadedCid);
      
      setCid(uploadedCid);
      setIpfsUrl(url);

      // Callback
      if (onUploadComplete) {
        onUploadComplete(uploadedCid, url);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload to IPFS');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setJsonData('');
    setCid(null);
    setIpfsUrl(null);
    setError(null);
  };

  return (
    <div className="bg-[#1e1f21] rounded-lg p-6 border border-[#2d2e30]">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-[#F263B0]" />
        <h3 className="text-lg font-semibold text-white">
          {uploadJSON ? 'Upload JSON to IPFS' : 'Upload File to IPFS'}
        </h3>
      </div>

      {!apiKey && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-500 text-sm">
            ⚠️ Web3.Storage API key not found. Get one at{' '}
            <a
              href="https://web3.storage/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              web3.storage
            </a>
          </p>
        </div>
      )}

      {uploadJSON ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              JSON Data
            </label>
            <textarea
              value={jsonData}
              onChange={handleJSONChange}
              placeholder='{"key": "value"}'
              className="w-full h-32 px-4 py-2 bg-[#2d2e30] border border-[#3d3e40] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F263B0] resize-none"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select File (Max {maxSize}MB)
            </label>
            <div className="flex items-center gap-4">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={accept}
                  className="hidden"
                />
                <div className="px-4 py-3 bg-[#2d2e30] border border-[#3d3e40] rounded-lg hover:bg-[#3d3e40] transition-colors flex items-center gap-2">
                  <File className="w-5 h-5 text-[#F263B0]" />
                  <span className="text-white">
                    {file ? file.name : 'Choose file...'}
                  </span>
                </div>
              </label>
            </div>
            {file && (
              <div className="mt-2 text-sm text-gray-400">
                Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {cid && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-500 font-medium">Upload successful!</p>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">CID:</span>
              <code className="ml-2 text-[#F263B0] break-all">{cid}</code>
            </div>
            <div>
              <span className="text-gray-400">IPFS URL:</span>
              <a
                href={ipfsUrl || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-400 hover:underline break-all"
              >
                {ipfsUrl}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleUpload}
          disabled={uploading || (!file && !jsonData) || !apiKey}
          className="flex-1 px-4 py-2 bg-[#F263B0] text-white rounded-lg hover:bg-[#d4559a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload to IPFS
            </>
          )}
        </button>
        {(file || jsonData || cid) && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-[#2d2e30] text-white rounded-lg hover:bg-[#3d3e40] transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

