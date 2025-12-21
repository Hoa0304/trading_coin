import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Sepolia testnet
    sepolia: {
      // Hỗ trợ cả Infura và Alchemy
      url: process.env.SEPOLIA_RPC_URL || 
           (process.env.ALCHEMY_API_KEY 
             ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
             : `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`),
      // Chỉ thêm account nếu private key hợp lệ (66 ký tự, bắt đầu bằng 0x)
      accounts: process.env.PRIVATE_KEY && 
                process.env.PRIVATE_KEY.trim().length === 66 && 
                process.env.PRIVATE_KEY.trim().startsWith('0x')
        ? [process.env.PRIVATE_KEY.trim()] 
        : [],
      chainId: 11155111,
    },
    // Ethereum mainnet (chỉ dùng khi deploy production)
    mainnet: {
      url: process.env.MAINNET_RPC_URL || `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      // Chỉ thêm account nếu private key hợp lệ
      accounts: process.env.PRIVATE_KEY && 
                process.env.PRIVATE_KEY.trim().length === 66 && 
                process.env.PRIVATE_KEY.trim().startsWith('0x')
        ? [process.env.PRIVATE_KEY.trim()] 
        : [],
      chainId: 1,
    },
    // Hardhat local network (để test)
    hardhat: {
      chainId: 1337,
    },
  },
  // Etherscan verification
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  // Paths
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

