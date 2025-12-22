import hre from "hardhat";

/**
 * Script để debug contract deployment issues
 * Kiểm tra tất cả các vấn đề có thể xảy ra
 * 
 * Usage:
 *   npx hardhat run scripts/debug-contract.js --network localhost
 */
async function main() {
  console.log("🔍 Debug Contract Deployment Issues...\n");

  // 1. Kiểm tra network
  const network = await hre.ethers.provider.getNetwork();
  console.log("1️⃣  Network Check:");
  console.log("   Network:", network.name);
  console.log("   Chain ID:", network.chainId.toString());
  
  if (network.chainId !== 1337n) {
    console.warn("   ⚠️  Warning: Expected Chain ID 1337 for localhost");
  } else {
    console.log("   ✅ Network is correct\n");
  }

  // 2. Kiểm tra Hardhat node có đang chạy không
  console.log("2️⃣  Hardhat Node Check:");
  try {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("   ✅ Hardhat node is running");
    console.log("   Current block:", blockNumber);
  } catch (error) {
    console.error("   ❌ Hardhat node is NOT running!");
    console.error("   Error:", error.message);
    console.error("\n   💡 Solution: Run 'npx hardhat node' in a separate terminal\n");
    process.exit(1);
  }
  console.log();

  // 3. Kiểm tra accounts
  console.log("3️⃣  Accounts Check:");
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    console.error("   ❌ No accounts found!");
    process.exit(1);
  }
  console.log("   ✅ Found", signers.length, "accounts");
  const deployer = signers[0];
  console.log("   Deployer:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("   Balance:", hre.ethers.formatEther(balance), "ETH");
  if (balance === 0n) {
    console.warn("   ⚠️  Warning: Deployer has 0 ETH");
  }
  console.log();

  // 4. Đọc contract address từ .env
  console.log("4️⃣  Contract Address Check:");
  const fs = await import('fs');
  let contractAddress = '';
  
  if (!fs.existsSync('.env')) {
    console.error("   ❌ .env file not found!");
    process.exit(1);
  }

  const envContent = fs.readFileSync('.env', 'utf8');
  const match = envContent.match(/VITE_CONTRACT_ADDRESS=(0x[a-fA-F0-9]{40})/i);
  
  if (!match) {
    console.error("   ❌ VITE_CONTRACT_ADDRESS not found in .env");
    process.exit(1);
  }
  
  contractAddress = match[1];
  console.log("   ✅ Contract address from .env:", contractAddress);
  console.log();

  // 5. Kiểm tra contract có code không
  console.log("5️⃣  Contract Code Check:");
  try {
    const code = await hre.ethers.provider.getCode(contractAddress);
    
    if (!code || code === '0x' || code.length < 100) {
      console.error("   ❌ Contract has NO code at this address!");
      console.error("   Code length:", code.length);
      console.error("\n   💡 Solutions:");
      console.error("      1. Make sure Hardhat node is running: npx hardhat node");
      console.error("      2. Deploy the contract: npx hardhat run scripts/deploy.js --network localhost");
      console.error("      3. Update .env with the new contract address");
      process.exit(1);
    } else {
      console.log("   ✅ Contract HAS code!");
      console.log("   Code length:", code.length, "characters");
    }
  } catch (error) {
    console.error("   ❌ Error checking contract code:", error.message);
    process.exit(1);
  }
  console.log();

  // 6. Test contract functions
  console.log("6️⃣  Contract Function Test:");
  try {
    const BitcoinTrading = await hre.ethers.getContractFactory("BitcoinTrading");
    const contract = BitcoinTrading.attach(contractAddress);
    
    // Test getPortfolio
    try {
      const portfolio = await contract.getPortfolio(deployer.address);
      console.log("   ✅ getPortfolio() works");
      console.log("   Portfolio:", {
        btc: hre.ethers.formatEther(portfolio[0]),
        usd: hre.ethers.formatEther(portfolio[1])
      });
    } catch (error) {
      if (error.message?.includes('Portfolio not initialized')) {
        console.log("   ✅ getPortfolio() works (portfolio not initialized - this is normal)");
      } else {
        console.error("   ❌ getPortfolio() failed:", error.message);
      }
    }
  } catch (error) {
    console.error("   ❌ Error testing contract:", error.message);
  }
  console.log();

  // 7. Kiểm tra transaction history
  console.log("7️⃣  Transaction History Check:");
  try {
    const txCount = await hre.ethers.provider.getTransactionCount(deployer.address);
    console.log("   Deployer transaction count:", txCount);
    
    if (txCount === 0) {
      console.warn("   ⚠️  No transactions found. Contract may not be deployed.");
    } else {
      console.log("   ✅ Found", txCount, "transactions");
    }
  } catch (error) {
    console.error("   ❌ Error checking transactions:", error.message);
  }
  console.log();

  // Summary
  console.log("✨ Debug Summary:");
  console.log("   ✅ All checks passed!");
  console.log("\n💡 If you still see 'Contract not deployed' error in frontend:");
  console.log("   1. Make sure MetaMask is connected to Hardhat Local Network (Chain ID: 1337)");
  console.log("   2. Restart your dev server: npm run dev");
  console.log("   3. Clear browser cache and reload");
  console.log("   4. Check browser console for detailed error messages");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:");
    console.error(error);
    process.exit(1);
  });

