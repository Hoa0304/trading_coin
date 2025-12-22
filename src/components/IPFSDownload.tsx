import { useState } from 'react';
import { Download, File, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { downloadFromIPFS, downloadJSONFromIPFS, checkIPFSFileExists, getIPFSURL } from '../lib/ipfs';

interface IPFSDownloadProps {
  onDownloadComplete?: (data: Blob | any, cid: string) => void;
  downloadJSON?: boolean; // If true, download as JSON
}

/**
 * Component để download file từ IPFS
 */
export function IPFSDownload({
  onDownloadComplete,
  downloadJSON = false,
}: IPFSDownloadProps) {
  const [cid, setCid] = useState<string>('');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileExists, setFileExists] = useState<boolean | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);

  const handleCIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCid(e.target.value.trim());
    setError(null);
    setSuccess(false);
    setFileExists(null);
    setIpfsUrl(null);
  };

  const handleCheckExists = async () => {
    if (!cid) {
      setError('Please enter a CID');
      return;
    }

    try {
      const exists = await checkIPFSFileExists(cid);
      setFileExists(exists);
      if (exists) {
        setIpfsUrl(getIPFSURL(cid));
      } else {
        setError('File not found on IPFS');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check file existence');
      setFileExists(false);
    }
  };

  const handleDownload = async () => {
    if (!cid) {
      setError('Please enter a CID');
      return;
    }

    setDownloading(true);
    setError(null);
    setSuccess(false);

    try {
      let data: Blob | any;

      if (downloadJSON) {
        // Download as JSON
        data = await downloadJSONFromIPFS(cid);
      } else {
        // Download as file
        data = await downloadFromIPFS(cid);
      }

      setSuccess(true);
      setIpfsUrl(getIPFSURL(cid));

      // Callback
      if (onDownloadComplete) {
        onDownloadComplete(data, cid);
      }

      // Auto-download file if not JSON
      if (!downloadJSON && data instanceof Blob) {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ipfs-${cid.slice(0, 8)}.bin`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else if (downloadJSON) {
        // Show JSON in console or alert
        console.log('Downloaded JSON:', data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to download from IPFS');
    } finally {
      setDownloading(false);
    }
  };

  const handleClear = () => {
    setCid('');
    setError(null);
    setSuccess(false);
    setFileExists(null);
    setIpfsUrl(null);
  };

  return (
    <div className="bg-[#1e1f21] rounded-lg p-6 border border-[#2d2e30]">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-[#F263B0]" />
        <h3 className="text-lg font-semibold text-white">
          {downloadJSON ? 'Download JSON from IPFS' : 'Download File from IPFS'}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            IPFS CID (Content Identifier)
          </label>
          <input
            type="text"
            value={cid}
            onChange={handleCIDChange}
            placeholder="QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
            className="w-full px-4 py-2 bg-[#2d2e30] border border-[#3d3e40] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F263B0]"
          />
        </div>

        {fileExists !== null && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            fileExists 
              ? 'bg-green-500/10 border border-green-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
          }`}>
            {fileExists ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-500 text-sm">File exists on IPFS</p>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-500 text-sm">File not found on IPFS</p>
              </>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {success && ipfsUrl && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-500 font-medium">Download successful!</p>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">IPFS URL:</span>
                <a
                  href={ipfsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-400 hover:underline break-all flex items-center gap-1"
                >
                  {ipfsUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleCheckExists}
            disabled={!cid || downloading}
            className="px-4 py-2 bg-[#2d2e30] text-white rounded-lg hover:bg-[#3d3e40] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <File className="w-4 h-4" />
            Check Exists
          </button>
          <button
            onClick={handleDownload}
            disabled={!cid || downloading}
            className="flex-1 px-4 py-2 bg-[#F263B0] text-white rounded-lg hover:bg-[#d4559a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download from IPFS
              </>
            )}
          </button>
          {(cid || error || success) && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-[#2d2e30] text-white rounded-lg hover:bg-[#3d3e40] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

