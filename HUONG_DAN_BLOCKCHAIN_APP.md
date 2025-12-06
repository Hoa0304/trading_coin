# 🔗 Hướng Dẫn Sử Dụng Blockchain App

## 🎯 Ứng Dụng Đã Trở Thành Blockchain App Thật Sự!

Ứng dụng này giờ là **Blockchain Application thật sự**, không còn là Trading Simulator nữa!

---

## ✅ Những Gì Đã Làm Để Trở Thành Blockchain App

### 1. Tích Hợp Web3 và MetaMask ✅

**File**: `src/lib/web3.ts`

- ✅ Kết nối với Ethereum blockchain qua MetaMask
- ✅ Quản lý wallet connection/disconnection
- ✅ Lấy số dư ETH từ blockchain
- ✅ Xử lý network switching (Sepolia/Mainnet)
- ✅ Lắng nghe sự kiện thay đổi account/network

**Kết quả**: User có thể kết nối ví blockchain thật (MetaMask) thay vì đăng nhập bằng email/password.

### 2. Smart Contract ✅

**File**: `contracts/BitcoinTrading.sol`

- ✅ Smart contract lưu trữ portfolio (BTC, USD) trên blockchain
- ✅ Functions: `buyBitcoin()`, `sellBitcoin()`, `getPortfolio()`
- ✅ Events: `TradeExecuted`, `PortfolioUpdated`
- ✅ Tự động khởi tạo portfolio với $10,000 USD

**Kết quả**: Tất cả giao dịch được thực hiện trên blockchain, có thể verify trên Etherscan.

### 3. Blockchain Transactions ✅

**File**: `src/lib/contract.ts`

- ✅ Gọi smart contract functions
- ✅ Ký transaction bằng MetaMask
- ✅ Gửi transaction lên blockchain
- ✅ Đợi transaction confirmation
- ✅ Lấy transaction hash và link Etherscan

**Kết quả**: Mỗi giao dịch mua/bán là một transaction trên blockchain, không phải update database.

### 4. Portfolio Từ Blockchain ✅

**Thay đổi**: `src/components/PortfolioStats.tsx`

- ❌ Trước: Lấy từ database SQLite
- ✅ Sau: Lấy từ smart contract trên blockchain

**Kết quả**: Số dư BTC/USD được lưu và lấy từ blockchain, không phải database.

### 5. Transaction History Từ Blockchain ✅

**Thay đổi**: `src/components/TransactionHistory.tsx`

- ❌ Trước: Lấy từ database SQLite
- ✅ Sau: Lấy từ smart contract events trên blockchain

**Kết quả**: Lịch sử giao dịch được lưu trên blockchain, có thể verify trên Etherscan.

### 6. Wallet Context ✅

**File**: `src/contexts/WalletContext.tsx`

- ✅ Quản lý wallet state toàn app
- ✅ Tự động reconnect khi refresh page
- ✅ Lắng nghe thay đổi account/network
- ✅ Refresh balance tự động

**Kết quả**: App quản lý wallet connection một cách nhất quán.

---

## 🚀 Hướng Dẫn Sử Dụng

### Bước 1: Cài Đặt MetaMask

1. Truy cập: https://metamask.io/download/
2. Cài extension cho browser (Chrome, Firefox, Edge, etc.)
3. Tạo wallet mới hoặc import wallet có sẵn
4. **Lưu seed phrase** ở nơi an toàn!

### Bước 2: Lấy Sepolia Test ETH

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

### Bước 3: Deploy Smart Contract

**Xem chi tiết**: [DEPLOY_CONTRACT.md](./DEPLOY_CONTRACT.md)

Tóm tắt:
1. Cài Hardhat: `npm install --save-dev hardhat`
2. Deploy contract lên Sepolia
3. Copy contract address
4. Thêm vào `.env`: `VITE_CONTRACT_ADDRESS=0x...`

### Bước 4: Chạy Ứng Dụng

```bash
npm run dev
```

Mở browser: `http://localhost:5173`

### Bước 5: Kết Nối Wallet

1. Click **"Connect MetaMask"**
2. MetaMask popup sẽ hiện lên
3. Chọn account và click **"Connect"**
4. Approve connection

### Bước 6: Khởi Tạo Portfolio

1. Sau khi connect wallet, nếu chưa có portfolio:
2. App sẽ hỏi: "Portfolio not initialized. Initialize with $10,000 USD?"
3. Click **"OK"**
4. MetaMask popup hiện lên → Click **"Confirm"**
5. Đợi transaction được confirm (vài giây)
6. Portfolio được tạo với **$10,000 USD** và **0 BTC**

### Bước 7: Mua Bitcoin

1. Trong **Trade Panel**, chọn tab **"Buy BTC"**
2. Nhập số lượng BTC muốn mua (ví dụ: `0.001`)
3. Xem **Estimated Cost**
4. Click **"Buy Bitcoin"**
5. MetaMask popup hiện lên:
   - Xem gas fee
   - Click **"Confirm"**
6. Đợi transaction:
   - **Pending**: Đang gửi transaction
   - **Confirming**: Đang đợi block confirmation
   - **Success**: Transaction thành công!
7. Click link **"View on Etherscan"** để xem trên blockchain

### Bước 8: Bán Bitcoin

1. Chọn tab **"Sell BTC"**
2. Nhập số lượng BTC muốn bán
3. Click **"Sell Bitcoin"**
4. Confirm trong MetaMask
5. Đợi confirmation

### Bước 9: Xem Transaction History

- Phần **Transaction History** hiển thị các giao dịch từ blockchain
- Mỗi transaction có thể verify trên Etherscan
- Data được lấy trực tiếp từ smart contract

---

## 🔍 Kiểm Tra Trên Blockchain

### Xem Transaction trên Etherscan

1. Sau khi trade, click link **"View on Etherscan"** trong app
2. Hoặc vào: https://sepolia.etherscan.io
3. Paste transaction hash vào search box
4. Xem chi tiết:
   - Status (Success/Failed)
   - Gas used
   - Block number
   - Timestamp
   - From/To addresses

### Xem Contract trên Etherscan

1. Vào: https://sepolia.etherscan.io
2. Paste contract address vào search box
3. Xem:
   - Contract code (nếu đã verify)
   - Transactions
   - Events
   - Read Contract (có thể gọi functions)

### Xem Portfolio trên Blockchain

Portfolio được lưu trong smart contract, có thể xem bằng cách:
1. Vào Etherscan → Contract
2. Tab **"Read Contract"**
3. Gọi function `getPortfolio(address)` với địa chỉ wallet của bạn

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Gas Fee

- Mỗi transaction tốn **gas fee** (ETH)
- Trên Sepolia testnet: ~0.0001-0.001 ETH
- Trên Mainnet: ~$5-$50+ (tùy network congestion)
- **Luôn kiểm tra gas fee** trước khi confirm

### 2. Transaction Time

- **Pending**: Vài giây
- **Confirming**: 15 giây - vài phút
- **Tổng thời gian**: 30 giây - 5 phút
- Chậm hơn database (instant) nhưng đây là blockchain thật!

### 3. Network

- **Sepolia Testnet**: Dùng để test (ETH miễn phí)
- **Ethereum Mainnet**: Production (ETH thật, phí cao)
- **Phải đúng network** mới hoạt động

### 4. Contract Address

- Mỗi network cần contract address riêng
- Sepolia contract ≠ Mainnet contract
- Phải set đúng `VITE_CONTRACT_ADDRESS` trong `.env`

### 5. Security

- **KHÔNG BAO GIỜ** share private key
- **KHÔNG BAO GIỜ** nhập seed phrase vào website
- Chỉ approve transactions bạn tin tưởng
- Kiểm tra gas fee trước khi confirm

---

## 🎯 So Sánh: Trước vs Sau

| Tính Năng | Trước (SQLite) | Sau (Blockchain) |
|-----------|----------------|------------------|
| **Authentication** | Email/Password | MetaMask Wallet |
| **Database** | SQLite file | Ethereum Blockchain |
| **Trading** | Update database | Smart contract transaction |
| **Portfolio** | Lấy từ database | Lấy từ blockchain |
| **Transactions** | Lưu trong database | Lưu trên blockchain |
| **Verify** | Không thể | Có thể trên Etherscan |
| **Gas Fee** | Không có | Có (ETH) |
| **Speed** | Instant | 30s - 5 phút |
| **Decentralized** | ❌ | ✅ |
| **Immutable** | ❌ | ✅ |
| **Transparent** | ❌ | ✅ |

---

## ✅ Checklist Sử Dụng

- [ ] Đã cài MetaMask
- [ ] Đã chuyển sang Sepolia testnet
- [ ] Đã lấy Sepolia ETH từ faucet
- [ ] Đã deploy smart contract
- [ ] Đã set `VITE_CONTRACT_ADDRESS` trong `.env`
- [ ] Đã chạy `npm run dev`
- [ ] Đã connect MetaMask
- [ ] Đã khởi tạo portfolio
- [ ] Đã thử mua Bitcoin
- [ ] Đã thử bán Bitcoin
- [ ] Đã xem transaction trên Etherscan

---

## 🐛 Troubleshooting

### "MetaMask is not installed"
- Cài MetaMask extension
- Refresh page

### "Insufficient ETH for gas"
- Lấy thêm Sepolia ETH từ faucet
- Cần ít nhất 0.001 ETH

### "Contract address not set"
- Deploy contract và set `VITE_CONTRACT_ADDRESS`

### "Transaction failed"
- Kiểm tra số dư đủ không
- Kiểm tra contract đã deploy chưa
- Kiểm tra network đúng chưa (Sepolia)

### "User rejected transaction"
- User đã cancel trong MetaMask
- Thử lại và confirm

---

## 🎉 Kết Luận

Ứng dụng giờ là **Blockchain Application thật sự**:
- ✅ Kết nối với Ethereum blockchain
- ✅ Sử dụng MetaMask wallet
- ✅ Giao dịch trên blockchain
- ✅ Có thể verify trên Etherscan
- ✅ Số dư lưu trên blockchain
- ✅ Decentralized và transparent

**Chúc bạn sử dụng thành công!** 🚀

