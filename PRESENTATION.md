---
marp: true
theme: default
paginate: true
header: 'Bitcoin Trading Platform - Blockchain Application'
footer: 'Đồ án Blockchain'
style: |
  section {
    background-color: #1a1b1d;
    color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  h1 {
    color: #F263B0;
    border-bottom: 3px solid #F263B0;
    padding-bottom: 10px;
  }
  h2 {
    color: #F263B0;
  }
  code {
    background-color: #2F3133;
    color: #F263B0;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .highlight {
    color: #F263B0;
    font-weight: bold;
  }
---

# Bitcoin Trading Platform
## Blockchain Application

**Ứng dụng giao dịch Bitcoin trên Ethereum Blockchain**

---

## 📋 Mục Lục

1. Giới thiệu dự án
2. Tính năng chính
3. Công nghệ sử dụng
4. Kiến trúc hệ thống
5. Smart Contract
6. Frontend Components
7. Demo & Screenshots
8. Kết luận

---

## 🎯 Giới Thiệu Dự Án

### **Bitcoin Trading Platform**

- ✅ **Blockchain Application thật sự**
- ✅ Giao dịch Bitcoin trên Ethereum blockchain
- ✅ Sử dụng MetaMask wallet
- ✅ Smart contract transactions
- ✅ Decentralized và Transparent

**Mục tiêu:** Xây dựng nền tảng giao dịch Bitcoin phi tập trung, minh bạch và an toàn

---

## ✨ Tính Năng Chính

### **Core Features**

- 🔐 **Kết nối MetaMask Wallet**
  - Xác thực người dùng qua ví blockchain
  - Quản lý tài khoản và số dư ETH

- 💰 **Giao dịch Bitcoin**
  - Mua Bitcoin với giá thời gian thực
  - Bán Bitcoin và cập nhật portfolio
  - Tất cả giao dịch lưu trên blockchain

- 📊 **Theo dõi Portfolio**
  - Số dư BTC và USD từ blockchain
  - Tính toán giá trị portfolio theo thời gian thực

---

## ✨ Tính Năng Chính (tiếp)

### **Additional Features**

- 📈 **Biểu đồ giá Bitcoin**
  - Giá thời gian thực từ CoinGecko API
  - Hiển thị biến động 24h
  - Lịch sử giá trong 7 ngày

- 📜 **Lịch sử giao dịch**
  - Xem tất cả transactions từ blockchain
  - Có thể verify trên Etherscan
  - Hiển thị chi tiết: loại, số lượng, giá, thời gian

- 🔄 **Quản lý kết nối**
  - Kết nối/ngắt kết nối ví
  - Tự động phát hiện thay đổi account

---

## 🛠️ Công Nghệ Sử Dụng

### **Frontend Stack**

```
React 18.3.1        → UI Framework
TypeScript 5.5.3    → Type Safety
Vite 5.4.2          → Build Tool
Tailwind CSS 3.4.1  → Styling
Lucide React        → Icons
```

### **Blockchain Stack**

```
Ethereum            → Blockchain Network
Solidity 0.8.20     → Smart Contract Language
Hardhat 2.28.0      → Development Framework
Ethers.js v6        → Web3 Library
MetaMask            → Wallet Provider
```

---

## 🛠️ Công Nghệ Sử Dụng (tiếp)

### **Backend & Tools**

```
Express.js          → API Server (optional)
SQLite              → Local Database (optional)
CoinGecko API       → Bitcoin Price Data
```

### **Development Tools**

```
ESLint              → Code Linting
TypeScript          → Type Checking
Hardhat Network     → Local Blockchain Testing
```

---

## 🏗️ Kiến Trúc Hệ Thống

### **System Architecture**

```
┌─────────────────────────────────────┐
│         Frontend (React)             │
│  ┌──────────┐  ┌──────────┐         │
│  │  UI      │  │  Web3    │         │
│  │ Components│  │  Service │         │
│  └────┬─────┘  └────┬─────┘         │
└───────┼─────────────┼───────────────┘
        │             │
        │  Ethers.js  │
        │             │
┌───────▼─────────────▼───────────────┐
│      MetaMask Wallet                │
└───────┬─────────────────────────────┘
        │
┌───────▼─────────────────────────────┐
│    Ethereum Blockchain               │
│  ┌──────────────────────────────┐   │
│  │  BitcoinTrading Smart Contract│   │
│  │  - Portfolio Storage          │   │
│  │  - Trade Execution            │   │
│  │  - Transaction History        │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 📝 Smart Contract

### **BitcoinTrading.sol**

**Chức năng chính:**

```solidity
contract BitcoinTrading {
    struct Portfolio {
        uint256 btcBalance;  // Số dư BTC
        uint256 usdBalance;  // Số dư USD
    }
    
    mapping(address => Portfolio) public portfolios;
    Transaction[] public transactions;
}
```

**Functions:**
- `initializePortfolio()` - Khởi tạo với $10,000 USD
- `buyBitcoin(uint256 btcAmount)` - Mua Bitcoin
- `sellBitcoin(uint256 btcAmount)` - Bán Bitcoin
- `getPortfolio()` - Lấy số dư portfolio
- `getUserTransactions()` - Lấy lịch sử giao dịch

---

## 🎨 Frontend Components

### **Component Structure**

```
App.tsx
├── ConnectWallet.tsx      → Kết nối MetaMask
├── PriceChart.tsx         → Biểu đồ giá Bitcoin
├── PortfolioStats.tsx     → Thống kê portfolio
├── TradePanel.tsx         → Panel mua/bán
└── TransactionHistory.tsx → Lịch sử giao dịch
```

**Context & Hooks:**
- `WalletContext` - Quản lý trạng thái ví
- `useBitcoinPrice` - Hook lấy giá Bitcoin

---

## 🔧 Core Services

### **Web3 Service (`web3.ts`)**

```typescript
- connectWallet()          → Kết nối MetaMask
- disconnectWallet()        → Ngắt kết nối
- getProvider()             → Lấy Web3 provider
- getSigner()               → Lấy signer
- getBalance()              → Lấy số dư ETH
- switchNetwork()           → Chuyển network
```

### **Contract Service (`contract.ts`)**

```typescript
- getContract()             → Lấy contract instance
- initializePortfolio()     → Khởi tạo portfolio
- buyBitcoin()              → Mua Bitcoin
- sellBitcoin()             → Bán Bitcoin
- getPortfolio()            → Lấy portfolio
- getUserTransactions()    → Lấy lịch sử
```

---

## 💡 Điểm Nổi Bật

### **Blockchain Features**

✅ **Decentralized**
- Không có server trung tâm
- Dữ liệu lưu trên blockchain
- Không thể bị thay đổi bởi bên thứ ba

✅ **Transparent**
- Mọi transaction đều public
- Có thể verify trên Etherscan
- Minh bạch hoàn toàn

✅ **Secure**
- Smart contract được audit
- Private key được bảo vệ bởi MetaMask
- ACID compliance

---

## 💡 Điểm Nổi Bật (tiếp)

### **Technical Highlights**

✅ **Real-time Data**
- Giá Bitcoin cập nhật theo thời gian thực
- Portfolio tự động refresh sau mỗi giao dịch

✅ **User Experience**
- UI/UX hiện đại với Tailwind CSS
- Responsive design
- Error handling tốt

✅ **Development**
- TypeScript cho type safety
- Code comments đầy đủ
- Best practices (SOLID, KISS, DRY)

---

## 🚀 Quy Trình Giao Dịch

### **Buy Bitcoin Flow**

```
1. User nhập số lượng BTC muốn mua
2. App tính toán số USD cần thiết
3. Kiểm tra số dư USD trong portfolio
4. Gọi smart contract buyBitcoin()
5. MetaMask hiển thị transaction
6. User confirm transaction
7. Transaction được gửi lên blockchain
8. Đợi confirmation
9. Cập nhật portfolio và UI
```

---

## 🚀 Quy Trình Giao Dịch (tiếp)

### **Sell Bitcoin Flow**

```
1. User nhập số lượng BTC muốn bán
2. App tính toán số USD sẽ nhận được
3. Kiểm tra số dư BTC trong portfolio
4. Gọi smart contract sellBitcoin()
5. MetaMask hiển thị transaction
6. User confirm transaction
7. Transaction được gửi lên blockchain
8. Đợi confirmation
9. Cập nhật portfolio và UI
```

---

## 📊 Demo & Screenshots

### **Main Features**

1. **Connect Wallet Screen**
   - Giao diện kết nối MetaMask
   - Hiển thị trạng thái kết nối

2. **Trading Dashboard**
   - Biểu đồ giá Bitcoin
   - Portfolio statistics
   - Trade panel (Buy/Sell)
   - Transaction history

3. **Real-time Updates**
   - Giá Bitcoin cập nhật mỗi phút
   - Portfolio tự động refresh
   - Transaction history real-time

---

## 🔐 Bảo Mật & An Toàn

### **Security Measures**

✅ **Smart Contract Security**
- Input validation
- Overflow protection (Solidity 0.8.20)
- Access control

✅ **Frontend Security**
- MetaMask integration
- Private key không bao giờ rời khỏi wallet
- Transaction signing an toàn

✅ **Network Security**
- Hỗ trợ testnet (Sepolia) để test
- Local network (Hardhat) để development
- Mainnet ready

---

## 📈 Kết Quả Đạt Được

### **Functional Requirements**

✅ Hoàn thành 100% các tính năng cơ bản
- Kết nối ví MetaMask
- Mua/bán Bitcoin
- Xem portfolio
- Lịch sử giao dịch
- Giá Bitcoin real-time

### **Technical Requirements**

✅ Code quality tốt
- TypeScript type safety
- Error handling đầy đủ
- Code comments rõ ràng
- Best practices

✅ User Experience
- UI/UX hiện đại
- Responsive design
- Loading states
- Error messages rõ ràng

---

## 🎓 Bài Học Rút Ra

### **Technical Learnings**

1. **Blockchain Development**
   - Hiểu cách smart contract hoạt động
   - Tương tác với blockchain qua Web3
   - Xử lý transactions và confirmations

2. **Frontend Integration**
   - Tích hợp MetaMask wallet
   - Quản lý state với React Context
   - Xử lý async operations

3. **Best Practices**
   - Code organization
   - Error handling
   - User feedback

---

## 🔮 Hướng Phát Triển

### **Future Enhancements**

🚀 **Short-term**
- Thêm nhiều cryptocurrencies
- Advanced charting với TradingView
- Price alerts
- Portfolio analytics

🚀 **Long-term**
- DeFi integration (lending, staking)
- NFT marketplace
- Multi-chain support
- Mobile app

---

## 📚 Tài Liệu Tham Khảo

### **Resources**

- **Ethereum Documentation**: https://ethereum.org
- **Hardhat Documentation**: https://hardhat.org
- **Ethers.js Documentation**: https://docs.ethers.org
- **Solidity Documentation**: https://docs.soliditylang.org
- **MetaMask Documentation**: https://docs.metamask.io

### **APIs Used**

- **CoinGecko API**: Bitcoin price data
- **Etherscan API**: Transaction verification

---

## ❓ Q&A

### **Questions & Answers**

**Cảm ơn đã lắng nghe!**

---

## 🎉 Kết Luận

### **Summary**

✅ **Hoàn thành dự án Bitcoin Trading Platform**
- Blockchain application thật sự
- Smart contract trên Ethereum
- Frontend hiện đại với React
- User experience tốt

### **Key Takeaways**

- Blockchain technology mạnh mẽ
- Decentralized applications là tương lai
- Security và transparency là ưu tiên

**Thank you!** 🙏

