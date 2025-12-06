# 🚀 Hướng Dẫn Deploy Smart Contract

## 📋 Yêu Cầu

- Node.js >= 16.x
- MetaMask extension
- Sepolia testnet ETH (miễn phí từ faucet)

---

## 🔧 Bước 1: Cài Đặt Hardhat

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

Chọn: **Create a JavaScript project**

---

## 🔧 Bước 2: Setup Hardhat Config

Tạo file `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

---

## 🔧 Bước 3: Deploy Contract

1. Copy file `contracts/BitcoinTrading.sol` vào thư mục `contracts/` của Hardhat project

2. Tạo file `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const BitcoinTrading = await hre.ethers.getContractFactory("BitcoinTrading");
  const bitcoinTrading = await BitcoinTrading.deploy();

  await bitcoinTrading.waitForDeployment();

  const address = await bitcoinTrading.getAddress();
  console.log("BitcoinTrading deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

3. Deploy:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. Copy contract address và thêm vào `.env`:

```env
VITE_CONTRACT_ADDRESS=0x...
```

---

## 🔧 Bước 4: Verify Contract (Tùy chọn)

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

---

## 📝 Lưu Ý

- Contract address sẽ được dùng trong frontend
- Mỗi network (Sepolia, Mainnet) cần deploy riêng
- Lưu contract address để dùng trong app

---

**Sau khi deploy xong, update `VITE_CONTRACT_ADDRESS` trong `.env` và restart app!**

