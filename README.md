# Bitcoin Trading Platform - Blockchain Application

Ứng dụng web **giao dịch Bitcoin trên blockchain**, cho phép người dùng mua và bán Bitcoin với giá thời gian thực, theo dõi portfolio và lịch sử giao dịch trên Ethereum blockchain.

## ⚠️ Lưu Ý Quan Trọng

**Đây là Blockchain Application thật sự!** 🎉

- ✅ **Kết nối với Ethereum blockchain** (Sepolia testnet, Mainnet, hoặc Local network)
- ✅ **Sử dụng MetaMask wallet** - Ví blockchain thật
- ✅ **Giao dịch trên blockchain** - Smart contract transactions
- ✅ **Có thể verify trên Etherscan** - Mọi transaction đều public
- ✅ **Số dư lưu trên blockchain** - Không phải database
- ✅ **Decentralized và Transparent** - Không có server trung tâm

## Tính năng

- ✅ **Kết nối MetaMask Wallet** - Ví blockchain thật
- ✅ **Giao dịch trên Blockchain** - Smart contract transactions
- ✅ **Xem giá Bitcoin thời gian thực** từ CoinGecko API với biểu đồ giá
- ✅ **Mua Bitcoin**: Giao dịch trên blockchain, lưu trong smart contract
- ✅ **Bán Bitcoin**: Giao dịch trên blockchain, lưu trong smart contract
- ✅ **Portfolio từ Blockchain** - Số dư BTC/USD lưu trên blockchain
- ✅ **Transaction History từ Blockchain** - Có thể verify trên Etherscan

## Công nghệ sử dụng

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Ethereum (Sepolia testnet / Mainnet / Hardhat Local)
- **Web3 Library**: Ethers.js v6
- **Wallet**: MetaMask
- **Smart Contract**: Solidity 0.8.20
- **Deployment**: Hardhat
- **Icons**: Lucide React
- **Bitcoin Price API**: CoinGecko API

## Yêu cầu hệ thống

- Node.js >= 16.x
- npm >= 8.x
- **MetaMask Extension** (bắt buộc)

---

## 🚀 Hướng Dẫn Cài Đặt và Chạy Dự Án

### Bước 1: Clone và Cài Đặt Dependencies

```bash
# Clone repository
git clone <repository-url>
cd trading_coin

# Cài đặt dependencies
npm install
```

### Bước 2: Tạo File `.env`

**Xem hướng dẫn chi tiết:** [HUONG_DAN_ENV.md](./HUONG_DAN_ENV.md)

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Private Key (lấy từ MetaMask - xem hướng dẫn trong HUONG_DAN_ENV.md)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Contract Address (sẽ điền sau khi deploy)
VITE_CONTRACT_ADDRESS=
```

**Lưu ý:** 
- ✅ **KHÔNG cần API keys** (Infura/Alchemy) khi dùng Hardhat Local Network
- ✅ **KHÔNG cần Sepolia ETH** từ faucet
- ✅ Chỉ cần Private Key từ MetaMask

### Bước 3: Cài Đặt MetaMask

1. Truy cập: https://metamask.io/download/
2. Cài extension cho browser
3. Tạo wallet mới hoặc import wallet có sẵn
4. **Lưu seed phrase** ở nơi an toàn!

### Bước 4: Deploy Smart Contract trên Hardhat Local Network

> **📖 Xem hướng dẫn chi tiết:** [HARDHAT_LOCAL_NETWORK.md](./HARDHAT_LOCAL_NETWORK.md)

**Ưu điểm vượt trội:**
- ✅ **KHÔNG cần faucet** - Không cần đăng ký, không cần chờ đợi
- ✅ **KHÔNG cần Mainnet ETH** - Hoàn toàn miễn phí
- ✅ **KHÔNG cần API keys** - Không cần Infura/Alchemy
- ✅ **Tự động có 10,000 ETH ảo** - Mỗi account có sẵn 10,000 ETH
- ✅ **Deploy và test miễn phí** - Không tốn phí gì cả

1. **Compile contract:**
```bash
npx hardhat compile
```

2. **Deploy contract:**
```bash
npx hardhat run scripts/deploy.js --network hardhat
```

3. **Copy contract address** từ output và thêm vào `.env`:
```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Lưu ý:** 
- ⚠️ **KHÔNG cần verify contract** trên Hardhat local network
- ✅ Verify chỉ cần khi deploy lên Sepolia/Mainnet (public networks)
- ✅ Với local network, bạn có thể bỏ qua bước verify

4. **Chạy Hardhat node** (mở terminal mới):
```bash
npx hardhat node
```

**Kết quả:** Hardhat sẽ hiển thị 20 accounts với private keys và 10,000 ETH mỗi account.

5. **Thêm Hardhat Local network vào MetaMask:**
   - Mở MetaMask → Click network dropdown
   - "Add Network" → "Add a network manually"
   - Điền thông tin:
     - **Network Name:** `Hardhat Local`
     - **RPC URL:** `http://127.0.0.1:8545`
     - **Chain ID:** `1337`
     - **Currency Symbol:** `ETH`
   - Click "Save"

6. **Import account từ Hardhat node vào MetaMask:**
   - Copy **private key** của Account #0 từ terminal `npx hardhat node`
   - Trong MetaMask: Click icon account → "Import Account"
   - Paste private key → Click "Import"
   - **Bạn sẽ có 10,000 ETH ảo ngay lập tức!**

### Bước 5: Chạy Ứng Dụng

```bash
# Chạy frontend
npm run dev
```

Truy cập: `http://localhost:5173`

### Bước 6: Sử Dụng Ứng Dụng

1. **Kết nối Wallet:**
   - Click **"Connect MetaMask"**
   - Chọn network (Hardhat Local hoặc Sepolia)
   - Approve connection

2. **Khởi tạo Portfolio:**
   - App sẽ hỏi khởi tạo với $10,000 USD
   - Confirm trong MetaMask

3. **Mua/Bán Bitcoin:**
   - Nhập số lượng
   - Click "Buy Bitcoin" hoặc "Sell Bitcoin"
   - Confirm transaction trong MetaMask

---

## 📝 Hướng Dẫn Chi Tiết File `.env`

**Xem file:** [HUONG_DAN_ENV.md](./HUONG_DAN_ENV.md)

File này hướng dẫn:
- Cách lấy Private Key từ MetaMask
- Cách lấy Infura API Key
- Cách lấy Alchemy API Key
- Cách setup cho Hardhat Local Network
- Cách setup cho Sepolia Testnet

---

## 🛠️ Scripts

- `npm run dev`: Chạy frontend development server (port 5173)
- `npm run dev:server`: Chạy backend server (port 3001)
- `npm run dev:all`: Chạy cả frontend và backend cùng lúc
- `npm run build`: Build production frontend
- `npx hardhat compile`: Compile smart contracts
- `npx hardhat run scripts/deploy.js --network hardhat`: Deploy lên local network
- `npx hardhat run scripts/deploy.js --network sepolia`: Deploy lên Sepolia
- `npx hardhat node`: Chạy local blockchain node

---

## 🐛 Troubleshooting

### "MetaMask is not installed"
- Cài MetaMask extension: https://metamask.io/download/

### "Contract address not set"
- Deploy smart contract trước
- Thêm `VITE_CONTRACT_ADDRESS` vào `.env`
- Restart app

### "Insufficient ETH for gas"
- Import account từ Hardhat node (có sẵn 10,000 ETH ảo)
- Đảm bảo `npx hardhat node` đang chạy

### "Transaction failed"
- Kiểm tra số dư đủ không
- Kiểm tra contract đã deploy chưa
- Kiểm tra network đúng chưa

---

## 📁 Cấu trúc dự án

```
trading_coin/
├── contracts/
│   └── BitcoinTrading.sol      # Smart contract
├── scripts/
│   └── deploy.js               # Script deploy contract
├── src/
│   ├── components/             # React components
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilities
│   └── App.tsx                 # Main component
├── hardhat.config.js           # Hardhat configuration
├── .env                        # Environment variables (tạo mới)
└── package.json
```

---

## 📝 License

MIT
