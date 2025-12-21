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
  const signers = await hre.ethers.getSigners();
  
  if (signers.length === 0) {
    console.error("❌ No accounts found!");
    console.error("Please check your .env file:");
    console.error("1. PRIVATE_KEY must be set (66 characters, starting with 0x)");
    console.error("2. INFURA_API_KEY must be set");
    console.error("3. Make sure there are no spaces or quotes around the values");
    process.exit(1);
  }

  const deployer = signers[0];
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Kiểm tra balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");
  
  // Kiểm tra balance có đủ không (ít nhất 0.001 ETH)
  if (balance < hre.ethers.parseEther("0.001")) {
    console.warn("⚠️  Warning: Balance is very low. You may need more ETH for gas fees.");
    console.warn("   Get free Sepolia ETH from: https://sepoliafaucet.com/\n");
  }

  // Deploy contract
  console.log("📦 Deploying BitcoinTrading contract...");
  const BitcoinTrading = await hre.ethers.getContractFactory("BitcoinTrading");
  const bitcoinTrading = await BitcoinTrading.deploy();

  // Đợi contract được deploy
  await bitcoinTrading.waitForDeployment();

  // Lấy contract address
  const address = await bitcoinTrading.getAddress();
  console.log("✅ BitcoinTrading deployed to:", address);
  
  // Verify contract code exists
  const code = await hre.ethers.provider.getCode(address);
  if (code === "0x" || code.length < 100) {
    console.error("❌ WARNING: Contract code is empty or invalid!");
    console.error("   This might mean the contract wasn't actually deployed.");
    console.error("   Code length:", code.length);
  } else {
    console.log("✅ Contract code verified! Code length:", code.length, "characters");
  }

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

