import hre from "hardhat";

/**
 * Script để deploy BitcoinTrading contract lên blockchain
 * 
 * Usage:
 *   npx hardhat run scripts/deploy.js --network sepolia
 *   npx hardhat run scripts/deploy.js --network mainnet
 *   npx hardhat run scripts/deploy.js --network hardhat (local test)
 */
async function main() {
  console.log("🚀 Starting deployment...\n");

  // Lấy deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Kiểm tra balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy contract
  console.log("📦 Deploying BitcoinTrading contract...");
  const BitcoinTrading = await hre.ethers.getContractFactory("BitcoinTrading");
  const bitcoinTrading = await BitcoinTrading.deploy();

  // Đợi contract được deploy
  await bitcoinTrading.waitForDeployment();

  // Lấy contract address
  const address = await bitcoinTrading.getAddress();
  console.log("✅ BitcoinTrading deployed to:", address);

  // Hiển thị network info
  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId.toString() + ")");

  // Etherscan link (nếu là testnet/mainnet)
  if (network.chainId === 11155111n) {
    console.log("🔍 View on Etherscan: https://sepolia.etherscan.io/address/" + address);
  } else if (network.chainId === 1n) {
    console.log("🔍 View on Etherscan: https://etherscan.io/address/" + address);
  }

  console.log("\n📋 Next steps:");
  console.log("1. Copy contract address:", address);
  console.log("2. Add to .env file: VITE_CONTRACT_ADDRESS=" + address);
  console.log("3. (Optional) Verify contract: npx hardhat verify --network", network.name, address);
  console.log("\n✨ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

