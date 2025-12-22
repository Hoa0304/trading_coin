import hre from "hardhat";

/**
 * Script để test chức năng buy/sell Bitcoin
 * 
 * Usage:
 *   npx hardhat run scripts/test-trade.js --network localhost
 */
async function main() {
  console.log("🧪 Testing Buy/Sell Bitcoin functions...\n");

  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId.toString() + ")\n");

  // Lấy accounts
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    console.error("❌ No accounts found!");
    process.exit(1);
  }

  const deployer = signers[0];
  console.log("📝 Testing with account:", deployer.address);

  // Đọc contract address từ .env
  const fs = await import('fs');
  let contractAddress = '';
  
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/VITE_CONTRACT_ADDRESS=(0x[a-fA-F0-9]{40})/i);
    if (match) {
      contractAddress = match[1];
      console.log("📋 Contract address:", contractAddress);
    } else {
      console.error("❌ VITE_CONTRACT_ADDRESS not found in .env");
      process.exit(1);
    }
  } else {
    console.error("❌ .env file not found");
    process.exit(1);
  }

  // Lấy contract instance
  const BitcoinTrading = await hre.ethers.getContractFactory("BitcoinTrading");
  const contract = BitcoinTrading.attach(contractAddress);

  // Kiểm tra contract có code không
  const code = await hre.ethers.provider.getCode(contractAddress);
  if (!code || code === '0x') {
    console.error("❌ Contract has no code at this address!");
    process.exit(1);
  }

  console.log("\n1️⃣  Testing getPortfolio...");
  try {
    const portfolio = await contract.getPortfolio(deployer.address);
    console.log("   ✅ Portfolio:", {
      btc: hre.ethers.formatEther(portfolio[0]),
      usd: hre.ethers.formatEther(portfolio[1])
    });
  } catch (error) {
    console.error("   ❌ Error:", error.message);
  }

  console.log("\n2️⃣  Testing buyBitcoin with 2 parameters (old function)...");
  try {
    const btcAmount = hre.ethers.parseEther("0.001");
    const btcPrice = hre.ethers.parseEther("50000");
    
    // Kiểm tra xem có function này không
    const tx = await contract.buyBitcoin(btcAmount, btcPrice);
    console.log("   ✅ Transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      console.log("   ✅ Transaction confirmed!");
    } else {
      console.error("   ❌ Transaction failed");
    }
  } catch (error) {
    console.error("   ❌ Error:", error.message);
  }

  console.log("\n3️⃣  Testing buyBitcoin with 3 parameters (new function with CID)...");
  try {
    const btcAmount = hre.ethers.parseEther("0.001");
    const btcPrice = hre.ethers.parseEther("50000");
    const testCID = "QmTest123456789";
    
    const tx = await contract.buyBitcoin(btcAmount, btcPrice, testCID);
    console.log("   ✅ Transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      console.log("   ✅ Transaction confirmed!");
    } else {
      console.error("   ❌ Transaction failed");
    }
  } catch (error) {
    console.error("   ❌ Error:", error.message);
    if (error.message?.includes('ambiguous')) {
      console.error("   ⚠️  This might be an ambiguous function error");
    }
  }

  console.log("\n4️⃣  Testing getTransaction...");
  try {
    const txCount = await contract.getTransactionCount();
    console.log("   Total transactions:", txCount.toString());
    
    if (txCount > 0n) {
      // Thử lấy transaction mới nhất
      const lastIndex = txCount - 1n;
      const tx = await contract.getTransaction(lastIndex);
      console.log("   ✅ Latest transaction:", {
        user: tx.user,
        isBuy: tx.isBuy,
        btcAmount: hre.ethers.formatEther(tx.btcAmount),
        ipfsCID: tx.ipfsCID || '(empty)'
      });
    }
  } catch (error) {
    console.error("   ❌ Error:", error.message);
    if (error.code === 'BAD_DATA' || error.message?.includes('could not decode')) {
      console.error("   ⚠️  Contract might be old version (no ipfsCID field)");
    }
  }

  console.log("\n✨ Test completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:");
    console.error(error);
    process.exit(1);
  });

