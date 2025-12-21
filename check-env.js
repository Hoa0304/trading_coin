// Script để kiểm tra file .env
import "dotenv/config";

console.log("🔍 Checking .env file...\n");

// Kiểm tra PRIVATE_KEY
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  console.error("❌ PRIVATE_KEY is not set in .env file");
} else {
  const trimmed = privateKey.trim();
  console.log("✅ PRIVATE_KEY is set");
  console.log("   Length:", trimmed.length, "characters");
  console.log("   Starts with 0x:", trimmed.startsWith('0x') ? "✅ Yes" : "❌ No");
  console.log("   Valid format:", (trimmed.length === 66 && trimmed.startsWith('0x')) ? "✅ Yes" : "❌ No");
  if (trimmed.length !== 66 || !trimmed.startsWith('0x')) {
    console.error("   ⚠️  PRIVATE_KEY must be 66 characters and start with 0x");
    console.error("   Example: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef");
  }
}

console.log("");

// Kiểm tra INFURA_API_KEY
const infuraKey = process.env.INFURA_API_KEY;
if (!infuraKey) {
  console.error("❌ INFURA_API_KEY is not set in .env file");
} else {
  console.log("✅ INFURA_API_KEY is set");
  console.log("   Length:", infuraKey.trim().length, "characters");
  if (infuraKey.includes('https://') || infuraKey.includes('v3/')) {
    console.error("   ⚠️  INFURA_API_KEY should NOT include 'https://' or 'v3/'");
    console.error("   It should only be the API key string");
  }
}

console.log("");

// Kiểm tra ETHERSCAN_API_KEY (optional)
const etherscanKey = process.env.ETHERSCAN_API_KEY;
if (!etherscanKey) {
  console.log("ℹ️  ETHERSCAN_API_KEY is not set (optional)");
} else {
  console.log("✅ ETHERSCAN_API_KEY is set");
}

console.log("");

// Tóm tắt
if (!privateKey || !infuraKey) {
  console.error("❌ Please fix the .env file before deploying");
  process.exit(1);
} else {
  const trimmed = privateKey.trim();
  if (trimmed.length === 66 && trimmed.startsWith('0x')) {
    console.log("✅ .env file looks good! You can proceed with deployment.");
  } else {
    console.error("❌ PRIVATE_KEY format is incorrect. Please fix it.");
    process.exit(1);
  }
}


