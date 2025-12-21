# Bitcoin Trading Platform - Blockchain Application

Ứng dụng web **giao dịch Bitcoin trên blockchain**, cho phép người dùng mua và bán Bitcoin với giá thời gian thực, theo dõi portfolio và lịch sử giao dịch trên Ethereum blockchain.

## ⚠️ Lưu Ý Quan Trọng

**Đây là Blockchain Application thật sự!** 🎉

- ✅ **Kết nối với Ethereum blockchain** (Sepolia testnet hoặc Mainnet)
- ✅ **Sử dụng MetaMask wallet** - Ví blockchain thật
- ✅ **Giao dịch trên blockchain** - Smart contract transactions
- ✅ **Có thể verify trên Etherscan** - Mọi transaction đều public
- ✅ **Số dư lưu trên blockchain** - Không phải database
- ✅ **Decentralized và Transparent** - Không có server trung tâm

**Lưu ý**: 
- Cần MetaMask extension để sử dụng
- Cần ETH để trả gas fee
- Transaction cần thời gian để confirm (30s - 5 phút)
- Phải deploy smart contract trước khi dùng

## Tính năng

- ✅ **Kết nối MetaMask Wallet** - Ví blockchain thật
- ✅ **Giao dịch trên Blockchain** - Smart contract transactions
- ✅ **Xem giá Bitcoin thời gian thực** từ CoinGecko API với biểu đồ giá
- ✅ **Mua Bitcoin**: Giao dịch trên blockchain, lưu trong smart contract
- ✅ **Bán Bitcoin**: Giao dịch trên blockchain, lưu trong smart contract
- ✅ **Portfolio từ Blockchain** - Số dư BTC/USD lưu trên blockchain
- ✅ **Transaction History từ Blockchain** - Có thể verify trên Etherscan
- ✅ **Transaction Status** - Hiển thị pending, confirming, success
- ✅ **Etherscan Links** - Link trực tiếp đến transaction trên blockchain

## Công nghệ sử dụng

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Ethereum (Sepolia testnet / Mainnet)
- **Web3 Library**: Ethers.js v6
- **Wallet**: MetaMask
- **Smart Contract**: Solidity 0.8.20
- **Deployment**: Hardhat
- **Icons**: Lucide React
- **Bitcoin Price API**: CoinGecko API (giá thật, cập nhật mỗi 30 giây)
- **Block Explorer**: Etherscan

## Yêu cầu hệ thống

- Node.js >= 16.x
- npm >= 8.x
- **MetaMask Extension** (bắt buộc)
- **Sepolia Test ETH** (để trả gas fee - miễn phí từ faucet)

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

### Bước 2: Cài Đặt MetaMask

1. Truy cập: https://metamask.io/download/
2. Cài extension cho browser (Chrome, Firefox, Edge, etc.)
3. Tạo wallet mới hoặc import wallet có sẵn
4. **Lưu seed phrase** ở nơi an toàn!

### Bước 3: Lấy Sepolia Test ETH

1. Chuyển MetaMask sang **Sepolia Test Network**:
   - Click network dropdown (mặc định là "Ethereum Mainnet")
   - Chọn "Sepolia test network"
   - Nếu không thấy, thêm network:
     - Network Name: Sepolia
     - RPC URL: https://sepolia.infura.io/v3/YOUR_KEY
     - Chain ID: 11155111
     - Currency Symbol: ETH

2. Lấy test ETH miễn phí:
   - Truy cập: https://sepoliafaucet.com/
   - Hoặc: https://faucet.quicknode.com/ethereum/sepolia
   - Nhập địa chỉ wallet của bạn
   - Nhận test ETH (thường 0.5-1 ETH)

### Bước 4: Deploy Smart Contract

#### Cách 1: Deploy bằng Hardhat (Khuyến nghị)

1. **Tạo file `.env`** trong thư mục gốc:

```env
# Private Key của wallet dùng để deploy
# LƯU Ý: KHÔNG commit file .env vào git!
# Lấy từ MetaMask: Settings > Security & Privacy > Show Private Key
PRIVATE_KEY=your_private_key_here

# Infura API Key (để kết nối Sepolia/Mainnet)
# Đăng ký miễn phí tại: https://infura.io/
INFURA_API_KEY=your_infura_key_here

# Etherscan API Key (để verify contract - tùy chọn)
# Đăng ký miễn phí tại: https://etherscan.io/apis
ETHERSCAN_API_KEY=your_etherscan_key_here

# Contract Address (sẽ được set sau khi deploy)
VITE_CONTRACT_ADDRESS=
```

2. **Compile contract**:

```bash
npx hardhat compile
```

3. **Deploy contract lên Sepolia**:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. **Copy contract address** từ output và thêm vào `.env`:

```env
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
```

5. **(Tùy chọn) Verify contract trên Etherscan**:

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

#### Cách 2: Deploy bằng Remix IDE (Đơn giản hơn, không cần Hardhat)

1. Truy cập: https://remix.ethereum.org/
2. Tạo file mới: `BitcoinTrading.sol`
3. Copy code từ `contracts/BitcoinTrading.sol` và paste vào Remix
4. Compile contract (chọn compiler version 0.8.20)
5. Chọn "Deploy & Run Transactions"
6. Chọn Environment: "Injected Provider - MetaMask"
7. Chọn Contract: "BitcoinTrading"
8. Click "Deploy"
9. Confirm trong MetaMask
10. Copy contract address và thêm vào `.env`:

```env
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Bước 5: Chạy Ứng Dụng

```bash
# Chạy frontend development server
npm run dev
```

Truy cập: `http://localhost:5173`

### Bước 6: Sử Dụng Ứng Dụng

1. **Kết nối Wallet**:
   - Click **"Connect MetaMask"**
   - MetaMask popup hiện lên → Chọn account → Click **"Connect"**
   - Wallet address sẽ hiển thị ở header

2. **Khởi tạo Portfolio**:
   - Sau khi connect wallet, nếu chưa có portfolio:
   - App sẽ hỏi: "Portfolio not initialized. Initialize with $10,000 USD?"
   - Click **"OK"** → Confirm trong MetaMask
   - Đợi transaction confirm (vài giây)
   - Portfolio được tạo với **$10,000 USD** và **0 BTC**

3. **Mua Bitcoin**:
   - Trong **Trade Panel**, chọn tab **"Buy BTC"**
   - Nhập số lượng BTC muốn mua (ví dụ: `0.001`)
   - Xem **Estimated Cost** và **Gas Fee** (hiển thị trong MetaMask)
   - Click **"Buy Bitcoin"**
   - MetaMask popup hiện lên → Click **"Confirm"**
   - Đợi transaction confirm
   - Click **"View on Etherscan"** để xem trên blockchain

4. **Bán Bitcoin**:
   - Chọn tab **"Sell BTC"**
   - Nhập số lượng BTC muốn bán
   - Click **"Sell Bitcoin"**
   - Confirm trong MetaMask
   - Đợi confirmation

5. **Xem Portfolio và Lịch sử**:
   - Portfolio Stats hiển thị số dư BTC/USD từ blockchain
   - Transaction History hiển thị các giao dịch từ blockchain
   - Có thể verify trên Etherscan

---

## 📦 Build Production

```bash
npm run build
```

Build files sẽ được tạo trong thư mục `dist/`

---

## 🛠️ Scripts

- `npm run dev`: Chạy frontend development server (port 5173)
- `npm run dev:server`: Chạy backend server (port 3001)
- `npm run dev:all`: Chạy cả frontend và backend cùng lúc
- `npm run build`: Build production frontend
- `npm run lint`: Chạy ESLint
- `npm run typecheck`: Kiểm tra TypeScript types
- `npx hardhat compile`: Compile smart contracts
- `npx hardhat run scripts/deploy.js --network sepolia`: Deploy contract

---

## 🐛 Troubleshooting

### "MetaMask is not installed"
- Cài MetaMask extension: https://metamask.io/download/
- Refresh page

### "Insufficient ETH for gas"
- Lấy Sepolia ETH từ faucet: https://sepoliafaucet.com/
- Cần ít nhất 0.001 ETH để trả gas fee

### "Contract address not set"
- Deploy smart contract (xem Bước 4)
- Thêm `VITE_CONTRACT_ADDRESS` vào `.env`
- Restart app

### "Transaction failed"
- Kiểm tra số dư đủ không
- Kiểm tra contract đã deploy chưa
- Kiểm tra network đúng chưa (Sepolia)

### "User rejected transaction"
- User đã cancel trong MetaMask
- Thử lại và confirm transaction

### "Insufficient balance"
- Kiểm tra số dư hiện có trong Portfolio Stats
- Đảm bảo nhập số lượng hợp lệ (không quá số dư)

### Build errors
```bash
npm run build
```
Kiểm tra lỗi và sửa theo thông báo. Thường gặp:
- Lỗi import/export
- Type errors
- Missing dependencies

---

## 📁 Cấu trúc dự án

```
trading_coin/
├── contracts/
│   └── BitcoinTrading.sol      # Smart contract
├── scripts/
│   └── deploy.js               # Script deploy contract
├── src/
│   ├── components/            # React components
│   │   ├── ConnectWallet.tsx  # Kết nối MetaMask
│   │   ├── PortfolioStats.tsx # Hiển thị thống kê portfolio
│   │   ├── PriceChart.tsx     # Biểu đồ giá Bitcoin
│   │   ├── TradePanel.tsx     # Panel mua/bán Bitcoin (blockchain)
│   │   └── TransactionHistory.tsx # Lịch sử giao dịch (blockchain)
│   ├── contexts/
│   │   └── WalletContext.tsx  # Wallet state management
│   ├── hooks/
│   │   └── useBitcoinPrice.ts # Hook lấy giá Bitcoin
│   ├── lib/
│   │   ├── web3.ts            # Web3 service (MetaMask)
│   │   └── contract.ts        # Smart contract interaction
│   ├── App.tsx                # Component chính
│   └── main.tsx               # Entry point
├── hardhat.config.js          # Hardhat configuration
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🔒 Security

- **MetaMask Authentication**: Wallet-based authentication
- **Private Key Security**: Private key chỉ ở trong MetaMask, không bao giờ expose
- **Smart Contract Security**: Code được deploy và verify trên blockchain
- **Transaction Signing**: Mỗi transaction phải được user ký bằng MetaMask
- **Immutable**: Một khi transaction được confirm, không thể thay đổi
- **Transparent**: Tất cả transactions có thể verify trên Etherscan

---

## 📝 License

MIT

---

## 🆘 Support

Nếu gặp vấn đề, vui lòng tạo issue trên repository hoặc liên hệ maintainer.
