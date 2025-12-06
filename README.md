# Bitcoin Trading Platform

Ứng dụng web **mô phỏng giao dịch Bitcoin**, cho phép người dùng mua và bán Bitcoin với giá thời gian thực, theo dõi portfolio và lịch sử giao dịch.

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

> 📖 **Xem hướng dẫn chi tiết**: [HUONG_DAN_BLOCKCHAIN_APP.md](./HUONG_DAN_BLOCKCHAIN_APP.md)

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
- ✅ **Gas Fee Estimation** - Hiển thị gas fee trước khi trade

## Công nghệ sử dụng

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Ethereum (Sepolia testnet / Mainnet)
- **Web3 Library**: Ethers.js v6
- **Wallet**: MetaMask
- **Smart Contract**: Solidity 0.8.20
- **Icons**: Lucide React
- **Bitcoin Price API**: CoinGecko API (giá thật, cập nhật mỗi 30 giây)
- **Block Explorer**: Etherscan

## Yêu cầu hệ thống

- Node.js >= 16.x
- npm >= 8.x
- **MetaMask Extension** (bắt buộc)
- **Sepolia Test ETH** (để trả gas fee - miễn phí từ faucet)
- **Smart Contract đã deploy** (xem [DEPLOY_CONTRACT.md](./DEPLOY_CONTRACT.md))

## Hướng dẫn Setup

> 📖 **Xem hướng dẫn đầy đủ**: [HUONG_DAN_BLOCKCHAIN_APP.md](./HUONG_DAN_BLOCKCHAIN_APP.md)  
> 📖 **Hướng dẫn deploy contract**: [DEPLOY_CONTRACT.md](./DEPLOY_CONTRACT.md)  
> 📖 **Blockchain setup**: [BLOCKCHAIN_SETUP.md](./BLOCKCHAIN_SETUP.md)

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd trading_coin
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cài MetaMask và Lấy Test ETH

1. **Cài MetaMask**: https://metamask.io/download/
2. **Chuyển sang Sepolia Test Network**
3. **Lấy test ETH miễn phí**: https://sepoliafaucet.com/

### Bước 4: Deploy Smart Contract

Xem chi tiết: [DEPLOY_CONTRACT.md](./DEPLOY_CONTRACT.md)

Sau khi deploy, thêm contract address vào `.env`:
```env
VITE_CONTRACT_ADDRESS=0xYourContractAddress
```

### Bước 5: Chạy ứng dụng

```bash
npm run dev
```

Truy cập: `http://localhost:5173`

### Bước 6: Kết nối Wallet

1. Click **"Connect MetaMask"**
2. Approve connection trong MetaMask
3. Khởi tạo portfolio nếu chưa có
4. Bắt đầu trading!

#### Build production

```bash
npm run build
```

Build files sẽ được tạo trong thư mục `dist/`

**Lưu ý**: Sau khi build, vẫn cần chạy backend server để API hoạt động.

## Hướng dẫn sử dụng

> 📖 **Xem hướng dẫn đầy đủ**: [HUONG_DAN_BLOCKCHAIN_APP.md](./HUONG_DAN_BLOCKCHAIN_APP.md)

### Kết nối Wallet

1. Mở ứng dụng: `http://localhost:5173`
2. Click **"Connect MetaMask"**
3. MetaMask popup hiện lên → Chọn account → Click **"Connect"**
4. Wallet address sẽ hiển thị ở header

### Khởi tạo Portfolio

1. Sau khi connect wallet, nếu chưa có portfolio:
2. App sẽ hỏi: "Portfolio not initialized. Initialize with $10,000 USD?"
3. Click **"OK"** → Confirm trong MetaMask
4. Đợi transaction confirm (vài giây)
5. Portfolio được tạo với **$10,000 USD** và **0 BTC**

### Mua Bitcoin

1. Trong **Trade Panel**, chọn tab **"Buy BTC"**
2. Nhập số lượng BTC muốn mua (ví dụ: `0.001`)
3. Xem **Estimated Cost** và **Gas Fee** (hiển thị trong MetaMask)
4. Click **"Buy Bitcoin"**
5. MetaMask popup hiện lên:
   - Xem gas fee
   - Click **"Confirm"**
6. Đợi transaction:
   - **Pending**: Đang gửi
   - **Confirming**: Đang đợi block confirmation
   - **Success**: Hoàn thành!
7. Click **"View on Etherscan"** để xem trên blockchain
8. Portfolio tự động cập nhật từ blockchain

### Bán Bitcoin

1. Chọn tab **"Sell BTC"**
2. Nhập số lượng BTC muốn bán
3. Click **"Sell Bitcoin"**
4. Confirm trong MetaMask
5. Đợi confirmation
6. Xem transaction trên Etherscan

### Xem Portfolio

Phần **Portfolio Stats** hiển thị:
- **Total Portfolio Value**: Tổng giá trị portfolio (BTC value + USD)
- **Bitcoin Holdings**: Số BTC hiện có và giá trị USD tương ứng
- **Cash Balance**: Số dư USD hiện có

### Xem Lịch sử giao dịch

Phần **Transaction History** hiển thị các giao dịch từ **blockchain**:
- Loại giao dịch (Buy/Sell)
- Số lượng BTC
- Giá trị USD
- Giá Bitcoin tại thời điểm giao dịch
- Thời gian giao dịch (từ blockchain)
- **Có thể verify trên Etherscan**

## Cấu trúc dự án

```
trading_coin/
├── contracts/
│   └── BitcoinTrading.sol   # Smart contract
├── src/
│   ├── components/          # React components
│   │   ├── ConnectWallet.tsx # Kết nối MetaMask
│   │   ├── PortfolioStats.tsx # Hiển thị thống kê portfolio
│   │   ├── PriceChart.tsx   # Biểu đồ giá Bitcoin
│   │   ├── TradePanel.tsx   # Panel mua/bán Bitcoin (blockchain)
│   │   └── TransactionHistory.tsx # Lịch sử giao dịch (blockchain)
│   ├── contexts/
│   │   └── WalletContext.tsx # Wallet state management
│   ├── hooks/
│   │   └── useBitcoinPrice.ts # Hook lấy giá Bitcoin
│   ├── lib/
│   │   ├── web3.ts          # Web3 service (MetaMask)
│   │   └── contract.ts       # Smart contract interaction
│   ├── App.tsx              # Component chính
│   └── main.tsx             # Entry point
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Validation và Security

### Validation được thực hiện

1. **Input Validation**:
   - Kiểm tra amount > 0
   - Kiểm tra format số hợp lệ
   - Kiểm tra giá Bitcoin hợp lệ

2. **Balance Validation**:
   - Kiểm tra số dư đủ trước khi giao dịch (từ blockchain)
   - Kiểm tra số dư ETH đủ để trả gas fee
   - Smart contract tự động validate số dư

3. **Blockchain Validation**:
   - Smart contract validate tất cả inputs
   - Transaction atomic (all-or-nothing)
   - Không thể thay đổi sau khi confirm

### Security

- **MetaMask Authentication**: Wallet-based authentication
- **Private Key Security**: Private key chỉ ở trong MetaMask, không bao giờ expose
- **Smart Contract Security**: Code được deploy và verify trên blockchain
- **Transaction Signing**: Mỗi transaction phải được user ký bằng MetaMask
- **Immutable**: Một khi transaction được confirm, không thể thay đổi
- **Transparent**: Tất cả transactions có thể verify trên Etherscan

## Troubleshooting

### "MetaMask is not installed"

- Cài MetaMask extension: https://metamask.io/download/
- Refresh page

### "Insufficient ETH for gas"

- Lấy Sepolia ETH từ faucet: https://sepoliafaucet.com/
- Cần ít nhất 0.001 ETH để trả gas fee

### "Contract address not set"

- Deploy smart contract (xem [DEPLOY_CONTRACT.md](./DEPLOY_CONTRACT.md))
- Thêm `VITE_CONTRACT_ADDRESS` vào `.env`

### "Transaction failed"

- Kiểm tra số dư đủ không
- Kiểm tra contract đã deploy chưa
- Kiểm tra network đúng chưa (Sepolia)

### "User rejected transaction"

- User đã cancel trong MetaMask
- Thử lại và confirm transaction

### Lỗi "Insufficient balance"

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

## Scripts

- `npm run dev`: Chạy frontend development server (port 5173)
- `npm run dev:server`: Chạy backend server (port 3001)
- `npm run dev:all`: Chạy cả frontend và backend cùng lúc
- `npm run build`: Build production frontend
- `npm run lint`: Chạy ESLint
- `npm run typecheck`: Kiểm tra TypeScript types

## License

MIT

## Support

Nếu gặp vấn đề, vui lòng tạo issue trên repository hoặc liên hệ maintainer.

