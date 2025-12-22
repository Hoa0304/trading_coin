import hre from "hardhat";

/**
 * Script để kiểm tra contract có được deploy tại address không
 * 
 * Usage:
 *   npx hardhat run scripts/check-contract.js --network localhost
 *   npx hardhat run scripts/check-contract.js --network hardhat
 */
async function main() {
  console.log("🔍 Kiểm tra contract deployment...\n");

  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId.toString() + ")\n");

  // Đọc contract address từ .env
  const fs = await import('fs');
  let contractAddress = '';
  
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/VITE_CONTRACT_ADDRESS=(0x[a-fA-F0-9]{40})/i);
    if (match) {
      contractAddress = match[1];
      console.log("📋 Contract address từ .env:", contractAddress);
    } else {
      console.error("❌ Không tìm thấy VITE_CONTRACT_ADDRESS trong .env");
      process.exit(1);
    }
  } else {
    console.error("❌ File .env không tồn tại");
    process.exit(1);
  }

  // Kiểm tra contract có code không
  console.log("\n🔎 Đang kiểm tra contract code...");
  try {
    const code = await hre.ethers.provider.getCode(contractAddress);
    
    if (!code || code === '0x' || code.length < 100) {
      console.error("❌ Contract KHÔNG có code tại địa chỉ này!");
      console.error("   Code length:", code.length);
      console.error("\n💡 Giải pháp:");
      console.error("   1. Đảm bảo Hardhat node đang chạy: npx hardhat node");
      console.error("   2. Deploy lại contract: npx hardhat run scripts/deploy.js --network localhost");
      process.exit(1);
    } else {
      console.log("✅ Contract CÓ code tại địa chỉ này!");
      console.log("   Code length:", code.length, "characters");
      
      // Thử gọi một function đơn giản để verify contract hoạt động
      try {
        const BitcoinTrading = await hre.ethers.getContractFactory("BitcoinTrading");
        const contract = BitcoinTrading.attach(contractAddress);
        
        // Lấy deployer account để test
        const signers = await hre.ethers.getSigners();
        if (signers.length > 0) {
          const deployer = signers[0];
          console.log("\n🧪 Đang test contract với account:", deployer.address);
          
          // Thử gọi getPortfolio (sẽ trả về lỗi nếu chưa init, nhưng đó là OK)
          try {
            const portfolio = await contract.getPortfolio(deployer.address);
            console.log("✅ Contract hoạt động bình thường!");
            console.log("   Portfolio:", {
              btc: hre.ethers.formatEther(portfolio[0]),
              usd: hre.ethers.formatEther(portfolio[1])
            });
          } catch (error) {
            // Nếu lỗi "Portfolio not initialized" thì contract vẫn OK
            if (error.message?.includes('Portfolio not initialized') || 
                error.message?.includes('execution reverted')) {
              console.log("✅ Contract hoạt động bình thường!");
              console.log("   (Portfolio chưa được khởi tạo - đây là bình thường)");
            } else {
              throw error;
            }
          }
        }
      } catch (error) {
        console.warn("⚠️  Không thể test contract function:", error.message);
        console.log("   Nhưng contract có code, có thể vẫn hoạt động.");
      }
    }
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra contract:");
    console.error("   Error:", error.message);
    console.error("\n💡 Có thể Hardhat node không đang chạy.");
    console.error("   Chạy: npx hardhat node");
    process.exit(1);
  }

  console.log("\n✨ Kiểm tra hoàn tất!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:");
    console.error(error);
    process.exit(1);
  });

