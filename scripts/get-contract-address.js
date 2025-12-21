import hre from "hardhat";

/**
 * Script để lấy contract address đã deploy
 * 
 * Usage:
 *   npx hardhat run scripts/get-contract-address.js --network localhost
 *   npx hardhat run scripts/get-contract-address.js --network sepolia
 */
async function main() {
  console.log("🔍 Tìm kiếm contract address...\n");

  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId.toString() + ")\n");

  // Lấy deployer account
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    console.error("❌ No accounts found!");
    process.exit(1);
  }

  const deployer = signers[0];
  console.log("📝 Deployer account:", deployer.address);

  // Lấy số lượng transactions của deployer
  const txCount = await hre.ethers.provider.getTransactionCount(deployer.address);
  console.log("📊 Transaction count:", txCount);

  if (txCount === 0) {
    console.log("\n⚠️  No transactions found. Contract may not be deployed yet.");
    console.log("   Run: npx hardhat run scripts/deploy.js --network", network.name);
    return;
  }

  // Tìm contract address từ các transactions gần nhất
  console.log("\n🔎 Checking recent transactions for contract deployments...\n");

  // Kiểm tra các địa chỉ có thể là contract (từ nonce 0 đến nonce hiện tại - 1)
  const maxCheck = Math.min(txCount, 10); // Chỉ kiểm tra 10 transactions gần nhất
  let foundContracts = [];

  for (let i = Math.max(0, txCount - maxCheck); i < txCount; i++) {
    try {
      // Tính contract address từ deployer address và nonce
      // Contract address = keccak256(rlp([deployer, nonce]))
      // Hardhat có thể sử dụng CREATE2 hoặc CREATE, nên ta kiểm tra cả hai
      
      // Thử lấy transaction hash từ nonce
      // Note: Không thể tính chính xác contract address từ nonce mà không có transaction hash
      // Nên ta sẽ kiểm tra các địa chỉ có code
    } catch (error) {
      // Ignore errors
    }
  }

  // Cách tốt nhất: Kiểm tra các địa chỉ đã biết hoặc từ .env
  console.log("📋 Các cách để biết contract address:\n");

  console.log("1️⃣  Từ output khi deploy:");
  console.log("   Khi chạy: npx hardhat run scripts/deploy.js --network", network.name);
  console.log("   Sẽ hiển thị: '✅ BitcoinTrading deployed to: 0x...'\n");

  console.log("2️⃣  Từ file .env:");
  const fs = await import('fs');
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/VITE_CONTRACT_ADDRESS=(0x[a-fA-F0-9]{40})/i);
    if (match) {
      const contractAddress = match[1];
      console.log("   ✅ Tìm thấy trong .env:", contractAddress);
      
      // Kiểm tra xem contract có code không
      const code = await hre.ethers.provider.getCode(contractAddress);
      if (code && code !== '0x' && code.length > 100) {
        console.log("   ✅ Contract CÓ code tại địa chỉ này (code length:", code.length, ")");
      } else {
        console.log("   ❌ Contract KHÔNG có code tại địa chỉ này");
        console.log("   ⚠️  Có thể contract chưa được deploy hoặc địa chỉ sai");
      }
    } else {
      console.log("   ❌ Không tìm thấy VITE_CONTRACT_ADDRESS trong .env");
    }
  } else {
    console.log("   ❌ File .env không tồn tại");
  }

  console.log("\n3️⃣  Từ Hardhat node logs:");
  console.log("   Khi deploy, Hardhat node sẽ log transaction");
  console.log("   Tìm dòng 'Contract deployed to: 0x...' hoặc transaction hash\n");

  console.log("4️⃣  Kiểm tra contract có code:");
  console.log("   Sử dụng: npx hardhat verify --network", network.name, "<address>");
  console.log("   Hoặc kiểm tra trong code với: provider.getCode(address)\n");

  console.log("💡 Tip: Luôn lưu contract address vào .env sau khi deploy!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:");
    console.error(error);
    process.exit(1);
  });

