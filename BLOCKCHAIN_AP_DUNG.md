# 🔗 Blockchain Áp Dụng Trong Dự Án - Hướng Dẫn Chi Tiết

**Mục đích:** Giải thích chi tiết blockchain được áp dụng ở đâu và như thế nào trong dự án Bitcoin Trading Platform.

---

## 📋 Mục Lục

1. [Tổng Quan Blockchain Trong Dự Án](#1-tổng-quan-blockchain-trong-dự-án)
2. [Smart Contract - Trung Tâm Của Hệ Thống](#2-smart-contract---trung-tâm-của-hệ-thống)
3. [Web3 Services - Kết Nối Frontend Với Blockchain](#3-web3-services---kết-nối-frontend-với-blockchain)
4. [Áp Dụng Blockchain Trong Từng Component](#4-áp-dụng-blockchain-trong-từng-component)
5. [Flow Chi Tiết Của Các Tính Năng](#5-flow-chi-tiết-của-các-tính-năng)
6. [Dữ Liệu Lưu Trữ Trên Blockchain](#6-dữ-liệu-lưu-trữ-trên-blockchain)
7. [Transactions Trên Blockchain](#7-transactions-trên-blockchain)

---

## 1. Tổng Quan Blockchain Trong Dự Án

### **1.1. Blockchain Là Gì Trong Dự Án Này?**

**Blockchain** trong dự án này là **Ethereum Blockchain** - một mạng lưới phân tán (decentralized network) nơi:
- ✅ **Smart Contract** được deploy và chạy
- ✅ **Dữ liệu** được lưu trữ (portfolio, transactions)
- ✅ **Transactions** được xử lý và confirm
- ✅ **Logic business** được thực thi (mua/bán Bitcoin)

### **1.2. Tại Sao Dùng Blockchain?**

**Khác biệt so với ứng dụng thông thường:**

| **Ứng Dụng Thông Thường** | **Blockchain Application (Dự Án Này)** |
|---------------------------|------------------------------------------|
| Dữ liệu lưu trong database (MySQL, MongoDB) | **Dữ liệu lưu trên blockchain** |
| Logic business trong backend server | **Logic business trong Smart Contract** |
| Cần server trung tâm | **Không cần server - decentralized** |
| Dữ liệu có thể bị thay đổi | **Dữ liệu immutable - không thể thay đổi** |
| Không minh bạch | **Mọi transaction đều public** |

### **1.3. Các Thành Phần Blockchain Trong Dự Án**

```
┌─────────────────────────────────────────┐
│         FRONTEND (React)                  │
│  - UI Components                         │
│  - User Interactions                     │
└──────────────┬──────────────────────────┘
               │
               │ Ethers.js
               │
┌──────────────▼──────────────────────────┐
│      WEB3 SERVICES                       │
│  - web3.ts: Kết nối MetaMask            │
│  - contract.ts: Tương tác với Smart      │
│    Contract                              │
└──────────────┬──────────────────────────┘
               │
               │ MetaMask Wallet
               │ (Ký transactions)
               │
┌──────────────▼──────────────────────────┐
│    ETHEREUM BLOCKCHAIN                   │
│  ┌──────────────────────────────────┐   │
│  │  BitcoinTrading Smart Contract   │   │
│  │  - Portfolio Storage             │   │
│  │  - Trade Logic                   │   │
│  │  - Transaction History           │   │
│  └──────────────────────────────────┘   │
└──────────────────────────────────────────┘
```

---

## 2. Smart Contract - Trung Tâm Của Hệ Thống

### **2.1. Smart Contract Là Gì?**

**Smart Contract** (`BitcoinTrading.sol`) là:
- ✅ **Code chạy trên blockchain** - viết bằng Solidity
- ✅ **Chứa toàn bộ logic business** - không có backend server
- ✅ **Lưu trữ dữ liệu** - portfolio, transactions
- ✅ **Xử lý transactions** - mua/bán Bitcoin
- ✅ **Immutable** - không thể thay đổi sau khi deploy

### **2.2. Smart Contract Được Áp Dụng Ở Đâu?**

**File:** `contracts/BitcoinTrading.sol`

**Vị trí trong codebase:**
```
trading_coin/
└── contracts/
    └── BitcoinTrading.sol  ← Smart Contract ở đây
```

### **2.3. Cấu Trúc Smart Contract**

#### **A. Data Structures (Cấu Trúc Dữ Liệu)**

```solidity
// Portfolio của mỗi user - LƯU TRÊN BLOCKCHAIN
struct Portfolio {
    uint256 btcBalance;  // Số dư BTC (lưu trên blockchain)
    uint256 usdBalance;  // Số dư USD (lưu trên blockchain)
}

// Mapping từ address → Portfolio
// ĐÂY LÀ CÁCH LƯU DỮ LIỆU TRÊN BLOCKCHAIN
mapping(address => Portfolio) public portfolios;

// Transaction - LƯU TRÊN BLOCKCHAIN
struct Transaction {
    address user;        // Địa chỉ ví của user
    bool isBuy;          // true = mua, false = bán
    uint256 btcAmount;   // Số lượng BTC
    uint256 usdAmount;   // Số lượng USD
    uint256 btcPrice;    // Giá BTC tại thời điểm trade
    uint256 timestamp;   // Thời gian (từ blockchain)
}

// Mảng lưu TẤT CẢ transactions - LƯU TRÊN BLOCKCHAIN
Transaction[] public transactions;
```

**Giải thích:**
- ✅ `mapping(address => Portfolio)`: Mỗi địa chỉ ví có một portfolio riêng, **lưu trên blockchain**
- ✅ `Transaction[]`: Tất cả transactions được lưu trong mảng này, **lưu trên blockchain**
- ✅ **Không có database** - tất cả dữ liệu đều trên blockchain

#### **B. Functions (Các Hàm Chính)**

**1. `initializePortfolio()` - Khởi Tạo Portfolio**

```solidity
function initializePortfolio() external {
    require(portfolios[msg.sender].btcBalance == 0 && 
            portfolios[msg.sender].usdBalance == 0, 
            "Portfolio already initialized");
    
    // CẬP NHẬT DỮ LIỆU TRÊN BLOCKCHAIN
    portfolios[msg.sender].usdBalance = 10000 * 10**18; // $10,000 USD
    
    // EMIT EVENT - Frontend có thể listen
    emit PortfolioUpdated(msg.sender, 0, 10000 * 10**18);
}
```

**Áp dụng blockchain:**
- ✅ Function này **chạy trên blockchain**
- ✅ Khi được gọi, tạo một **transaction**
- ✅ Transaction được **confirm bởi network**
- ✅ Dữ liệu được **lưu trên blockchain**
- ✅ **Event** được emit để frontend biết

**2. `buyBitcoin()` - Mua Bitcoin**

```solidity
function buyBitcoin(uint256 btcAmount, uint256 btcPrice) external {
    // VALIDATION - Chạy trên blockchain
    require(btcAmount > 0, "BTC amount must be greater than 0");
    require(btcPrice > 0, "BTC price must be greater than 0");
    
    // TÍNH TOÁN - Logic business chạy trên blockchain
    uint256 usdAmount = (btcAmount * btcPrice) / 10**18;
    
    // KIỂM TRA SỐ DƯ - Đọc từ blockchain
    require(portfolios[msg.sender].usdBalance >= usdAmount, 
            "Insufficient USD balance");
    
    // CẬP NHẬT PORTFOLIO - Ghi lên blockchain
    portfolios[msg.sender].btcBalance += btcAmount;
    portfolios[msg.sender].usdBalance -= usdAmount;
    
    // LƯU TRANSACTION - Ghi lên blockchain
    transactions.push(Transaction({
        user: msg.sender,
        isBuy: true,
        btcAmount: btcAmount,
        usdAmount: usdAmount,
        btcPrice: btcPrice,
        timestamp: block.timestamp  // Lấy từ blockchain
    }));
    
    // EMIT EVENTS - Frontend listen
    emit TradeExecuted(msg.sender, true, btcAmount, usdAmount, btcPrice, block.timestamp);
    emit PortfolioUpdated(msg.sender, portfolios[msg.sender].btcBalance, portfolios[msg.sender].usdBalance);
}
```

**Áp dụng blockchain:**
- ✅ **Toàn bộ logic** chạy trên blockchain
- ✅ **Validation** chạy trên blockchain (nếu fail → transaction revert)
- ✅ **Cập nhật dữ liệu** ghi lên blockchain
- ✅ **Transaction** được lưu trên blockchain
- ✅ **Events** được emit từ blockchain

**3. `sellBitcoin()` - Bán Bitcoin**

Tương tự như `buyBitcoin()`, nhưng ngược lại:
- Giảm BTC balance
- Tăng USD balance
- Lưu transaction với `isBuy = false`

**4. `getPortfolio()` - Đọc Portfolio**

```solidity
function getPortfolio(address user) external view returns (uint256 btcBalance, uint256 usdBalance) {
    // ĐỌC DỮ LIỆU TỪ BLOCKCHAIN (view function - không tốn gas)
    return (portfolios[user].btcBalance, portfolios[user].usdBalance);
}
```

**Áp dụng blockchain:**
- ✅ **View function** - chỉ đọc, không ghi
- ✅ Đọc dữ liệu **trực tiếp từ blockchain**
- ✅ **Không tốn gas** (vì chỉ đọc)

**5. `getUserTransactions()` - Đọc Lịch Sử**

```solidity
function getUserTransactions(address user) external view returns (uint256[] memory) {
    // Tìm tất cả transactions của user
    // ĐỌC TỪ BLOCKCHAIN
    // ...
    return indices;
}
```

### **2.4. Events - Giao Tiếp Với Frontend**

```solidity
// Event khi có giao dịch
event TradeExecuted(
    address indexed user,
    bool isBuy,
    uint256 btcAmount,
    uint256 usdAmount,
    uint256 btcPrice,
    uint256 timestamp
);

// Event khi portfolio thay đổi
event PortfolioUpdated(
    address indexed user,
    uint256 btcBalance,
    uint256 usdBalance
);
```

**Áp dụng blockchain:**
- ✅ Events được **emit từ blockchain**
- ✅ Frontend có thể **listen** events để update UI real-time
- ✅ Events được **lưu trên blockchain** (có thể query sau)

---

## 3. Web3 Services - Kết Nối Frontend Với Blockchain

### **3.1. Web3 Service (`src/lib/web3.ts`)**

**Mục đích:** Kết nối frontend với blockchain thông qua MetaMask

#### **A. `connectWallet()` - Kết Nối MetaMask**

```typescript
export const connectWallet = async (): Promise<string> => {
  // Yêu cầu MetaMask kết nối
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  }) as string[];
  
  return accounts[0]; // Trả về địa chỉ ví
}
```

**Áp dụng blockchain:**
- ✅ **MetaMask** là gateway đến blockchain
- ✅ Lấy **blockchain address** của user
- ✅ Address này dùng để **xác định user** (không cần username/password)

#### **B. `getProvider()` - Tạo Web3 Provider**

```typescript
export const getProvider = (): ethers.BrowserProvider => {
  // Tạo provider từ MetaMask
  const provider = new ethers.BrowserProvider(window.ethereum, 'any');
  return provider;
}
```

**Áp dụng blockchain:**
- ✅ Provider là **kết nối đến blockchain**
- ✅ Qua provider, có thể:
  - Đọc dữ liệu từ blockchain
  - Gửi transactions lên blockchain
  - Listen events từ blockchain

#### **C. `getSigner()` - Lấy Signer**

```typescript
export const getSigner = async (): Promise<ethers.JsonRpcSigner> => {
  const provider = getProvider();
  return await provider.getSigner();
}
```

**Áp dụng blockchain:**
- ✅ Signer dùng để **ký transactions**
- ✅ Private key **không bao giờ rời khỏi MetaMask**
- ✅ Mỗi transaction phải được **ký bởi private key**

### **3.2. Contract Service (`src/lib/contract.ts`)**

**Mục đích:** Tương tác với Smart Contract

#### **A. `getContract()` - Lấy Contract Instance**

```typescript
export const getContract = async (): Promise<ethers.Contract> => {
  const signer = await getSigner();
  // Tạo contract instance với ABI và address
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}
```

**Áp dụng blockchain:**
- ✅ Tạo **contract instance** để gọi functions
- ✅ `CONTRACT_ADDRESS`: Địa chỉ smart contract trên blockchain
- ✅ `CONTRACT_ABI`: Interface để giao tiếp với contract

#### **B. `buyBitcoin()` - Gọi Smart Contract Function**

```typescript
export const buyBitcoin = async (
  btcAmount: number,
  btcPrice: number
): Promise<ethers.ContractTransactionResponse> => {
  const contract = await getContract();
  
  // Convert sang wei (đơn vị trên blockchain)
  const btcAmountWei = ethers.parseEther(btcAmount.toString());
  const btcPriceWei = ethers.parseEther(btcPrice.toString());
  
  // GỌI SMART CONTRACT FUNCTION
  // Đây tạo ra một TRANSACTION trên blockchain
  return await contract.buyBitcoin(btcAmountWei, btcPriceWei);
}
```

**Áp dụng blockchain:**
- ✅ `contract.buyBitcoin()` → **Tạo transaction**
- ✅ Transaction được **gửi lên blockchain**
- ✅ Phải đợi transaction được **confirm**
- ✅ Sau khi confirm, dữ liệu được **cập nhật trên blockchain**

#### **C. `getPortfolio()` - Đọc Dữ Liệu Từ Blockchain**

```typescript
export const getPortfolio = async (address: string): Promise<{
  btcBalance: number;
  usdBalance: number;
}> => {
  const contract = await getContract();
  
  // GỌI VIEW FUNCTION - ĐỌC TỪ BLOCKCHAIN
  const [btcBalanceWei, usdBalanceWei] = await contract.getPortfolio(address);
  
  // Convert từ wei sang số thường
  const btcBalance = parseFloat(ethers.formatEther(btcBalanceWei));
  const usdBalance = parseFloat(ethers.formatEther(usdBalanceWei));
  
  return { btcBalance, usdBalance };
}
```

**Áp dụng blockchain:**
- ✅ `contract.getPortfolio()` → **Đọc từ blockchain**
- ✅ Dữ liệu được đọc **trực tiếp từ smart contract**
- ✅ **Không tạo transaction** (view function)
- ✅ **Không tốn gas**

---

## 4. Áp Dụng Blockchain Trong Từng Component

### **4.1. ConnectWallet Component**

**File:** `src/components/ConnectWallet.tsx`

**Áp dụng blockchain:**
```typescript
const connect = async () => {
  // Gọi web3 service để kết nối MetaMask
  const addr = await connectWallet(); // ← Blockchain ở đây
  setAddress(addr);
}
```

**Giải thích:**
- ✅ Kết nối với **MetaMask wallet** (blockchain wallet)
- ✅ Lấy **blockchain address** của user
- ✅ Address này dùng để **xác định user** trên blockchain

### **4.2. TradePanel Component**

**File:** `src/components/TradePanel.tsx`

**Áp dụng blockchain:**

#### **A. Khởi Tạo Portfolio**

```typescript
const handleInitializePortfolio = async () => {
  // GỌI SMART CONTRACT FUNCTION
  const tx = await initializePortfolio(); // ← Blockchain transaction
  
  // ĐỢI TRANSACTION ĐƯỢC CONFIRM
  const receipt = await waitForTransaction(tx); // ← Đợi blockchain confirm
  
  if (receipt.status === 1) {
    // Transaction thành công trên blockchain
    await onTradeComplete(); // Reload portfolio từ blockchain
  }
}
```

**Flow blockchain:**
1. Frontend gọi `initializePortfolio()` → Tạo transaction
2. MetaMask hiển thị popup → User confirm
3. Transaction được gửi lên blockchain
4. Đợi blockchain confirm (vài giây)
5. Smart contract cập nhật dữ liệu trên blockchain
6. Frontend đọc lại từ blockchain

#### **B. Mua Bitcoin**

```typescript
const handleTrade = async () => {
  // GỌI SMART CONTRACT FUNCTION
  let tx;
  if (activeTab === 'buy') {
    tx = await buyBitcoin(btcAmount, currentPrice); // ← Blockchain transaction
  } else {
    tx = await sellBitcoin(btcAmount, currentPrice); // ← Blockchain transaction
  }
  
  // ĐỢI TRANSACTION CONFIRM
  const receipt = await waitForTransaction(tx); // ← Đợi blockchain
  
  if (receipt.status === 1) {
    // Transaction thành công
    await onTradeComplete(); // Reload từ blockchain
  }
}
```

**Flow blockchain:**
1. User nhập số lượng → Frontend validate
2. Gọi `buyBitcoin()` → Tạo transaction
3. MetaMask popup → User xem và confirm
4. Transaction gửi lên blockchain
5. Smart contract xử lý:
   - Validate số dư
   - Tính toán
   - Cập nhật portfolio trên blockchain
   - Lưu transaction trên blockchain
   - Emit events
6. Đợi confirm
7. Frontend đọc lại từ blockchain

### **4.3. PortfolioStats Component**

**File:** `src/components/PortfolioStats.tsx`

**Áp dụng blockchain:**
```typescript
// Portfolio được truyền từ App.tsx
// App.tsx đọc portfolio từ blockchain qua getPortfolio()
```

**Giải thích:**
- ✅ Portfolio **KHÔNG** lưu trong state/localStorage
- ✅ Portfolio được **đọc từ blockchain** mỗi lần load
- ✅ Dữ liệu luôn **đồng bộ với blockchain**

### **4.4. TransactionHistory Component**

**File:** `src/components/TransactionHistory.tsx`

**Áp dụng blockchain:**
```typescript
// Transactions được truyền từ App.tsx
// App.tsx đọc từ blockchain qua getUserTransactions()
```

**Giải thích:**
- ✅ Transactions **KHÔNG** lưu trong database
- ✅ Transactions được **đọc từ blockchain**
- ✅ Mỗi transaction có **transaction hash** - có thể verify trên Etherscan

### **4.5. App.tsx - Main Component**

**File:** `src/App.tsx`

**Áp dụng blockchain:**

```typescript
const loadBlockchainData = async () => {
  // ĐỌC PORTFOLIO TỪ BLOCKCHAIN
  const portfolioData = await getPortfolio(address); // ← Blockchain
  
  // ĐỌC TRANSACTIONS TỪ BLOCKCHAIN
  const transactionsData = await getUserTransactions(address, 10); // ← Blockchain
  
  // ĐỌC ETH BALANCE TỪ BLOCKCHAIN
  await refreshBalance(); // ← Blockchain
}
```

**Giải thích:**
- ✅ Tất cả dữ liệu đều **đọc từ blockchain**
- ✅ Không có API backend
- ✅ Không có database
- ✅ Dữ liệu luôn **đồng bộ với blockchain**

---

## 5. Flow Chi Tiết Của Các Tính Năng

### **5.1. Flow: Kết Nối Ví**

```
User Click "Connect MetaMask"
    ↓
Frontend: connectWallet()
    ↓
MetaMask: Request Connection
    ↓
User Confirm trong MetaMask
    ↓
MetaMask: Trả về blockchain address
    ↓
Frontend: Lưu address
    ↓
Frontend: Load data từ blockchain
    ↓
✅ Kết nối thành công
```

**Blockchain ở đây:**
- ✅ MetaMask là **blockchain wallet**
- ✅ Address là **blockchain address**
- ✅ Không cần username/password

### **5.2. Flow: Mua Bitcoin**

```
User nhập số lượng BTC
    ↓
User Click "Buy Bitcoin"
    ↓
Frontend: Validate input
    ↓
Frontend: buyBitcoin(amount, price)
    ↓
Contract Service: getContract()
    ↓
Contract Service: contract.buyBitcoin()
    ↓
Ethers.js: Tạo transaction
    ↓
MetaMask: Hiển thị transaction popup
    ↓
User: Xem transaction details và confirm
    ↓
MetaMask: Ký transaction với private key
    ↓
Transaction được gửi lên blockchain
    ↓
Blockchain: Các nodes xử lý transaction
    ↓
Smart Contract: buyBitcoin() được execute
    - Validate số dư
    - Tính toán
    - Cập nhật portfolios[user] trên blockchain
    - Lưu transaction vào transactions[] trên blockchain
    - Emit events
    ↓
Blockchain: Transaction được confirm
    ↓
Frontend: Đợi receipt
    ↓
Frontend: Đọc lại portfolio từ blockchain
    ↓
Frontend: Update UI
    ↓
✅ Hoàn thành
```

**Blockchain ở đây:**
- ✅ Transaction được **gửi lên blockchain**
- ✅ Smart contract **chạy trên blockchain**
- ✅ Dữ liệu được **cập nhật trên blockchain**
- ✅ Phải đợi **blockchain confirm**

### **5.3. Flow: Xem Portfolio**

```
User mở app
    ↓
Frontend: loadBlockchainData()
    ↓
Contract Service: getPortfolio(address)
    ↓
Contract Service: contract.getPortfolio(address)
    ↓
Smart Contract: portfolios[address] (đọc từ blockchain)
    ↓
Blockchain: Trả về dữ liệu
    ↓
Frontend: Convert từ wei sang số thường
    ↓
Frontend: Hiển thị trên UI
    ↓
✅ Hiển thị portfolio
```

**Blockchain ở đây:**
- ✅ Dữ liệu được **đọc trực tiếp từ blockchain**
- ✅ Không có cache/database
- ✅ Luôn là dữ liệu mới nhất từ blockchain

### **5.4. Flow: Xem Transaction History**

```
User mở Transaction History
    ↓
Frontend: getUserTransactions(address)
    ↓
Contract Service: contract.getUserTransactions(address)
    ↓
Smart Contract: Tìm transactions của user trong transactions[]
    ↓
Blockchain: Trả về danh sách transaction indices
    ↓
Contract Service: contract.getTransaction(index) cho mỗi index
    ↓
Smart Contract: Đọc transaction từ transactions[] trên blockchain
    ↓
Blockchain: Trả về transaction data
    ↓
Frontend: Format và hiển thị
    ↓
✅ Hiển thị lịch sử
```

**Blockchain ở đây:**
- ✅ Transactions được **đọc từ blockchain**
- ✅ Mỗi transaction có **hash** - có thể verify trên Etherscan
- ✅ Không có database lưu transactions

---

## 6. Dữ Liệu Lưu Trữ Trên Blockchain

### **6.1. Portfolio Data**

**Lưu ở đâu:**
```solidity
mapping(address => Portfolio) public portfolios;
```

**Cấu trúc:**
```solidity
struct Portfolio {
    uint256 btcBalance;  // Lưu trên blockchain
    uint256 usdBalance;  // Lưu trên blockchain
}
```

**Ví dụ:**
- User với address `0x123...` có:
  - `btcBalance = 1.5 BTC` (lưu trên blockchain)
  - `usdBalance = 5000 USD` (lưu trên blockchain)

**Giải thích:**
- ✅ **KHÔNG** lưu trong database
- ✅ **KHÔNG** lưu trong localStorage
- ✅ **CHỈ** lưu trên blockchain
- ✅ Mỗi lần đọc → đọc từ blockchain

### **6.2. Transaction History**

**Lưu ở đâu:**
```solidity
Transaction[] public transactions;
```

**Cấu trúc:**
```solidity
struct Transaction {
    address user;        // Lưu trên blockchain
    bool isBuy;          // Lưu trên blockchain
    uint256 btcAmount;   // Lưu trên blockchain
    uint256 usdAmount;   // Lưu trên blockchain
    uint256 btcPrice;    // Lưu trên blockchain
    uint256 timestamp;   // Lưu trên blockchain (từ block.timestamp)
}
```

**Ví dụ:**
- Transaction #0: User `0x123...` mua 0.5 BTC với giá $50,000
- Transaction #1: User `0x456...` bán 0.2 BTC với giá $51,000
- Tất cả lưu trong mảng `transactions[]` trên blockchain

**Giải thích:**
- ✅ **KHÔNG** lưu trong database
- ✅ **KHÔNG** lưu trong file
- ✅ **CHỈ** lưu trên blockchain
- ✅ Mỗi transaction có **index** - có thể query

### **6.3. Contract Address**

**Lưu ở đâu:**
- File `.env`: `VITE_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

**Giải thích:**
- ✅ Đây là **địa chỉ smart contract trên blockchain**
- ✅ Sau khi deploy, contract có địa chỉ cố định
- ✅ Dùng địa chỉ này để **tương tác với contract**

---

## 7. Transactions Trên Blockchain

### **7.1. Transaction Là Gì?**

**Transaction** là:
- ✅ Một **operation** được gửi lên blockchain
- ✅ Phải được **ký bởi private key**
- ✅ Phải được **confirm bởi network**
- ✅ Tốn **gas fee** (trên mainnet/testnet)
- ✅ Có **transaction hash** - có thể verify

### **7.2. Các Loại Transactions Trong Dự Án**

#### **A. Initialize Portfolio Transaction**

```typescript
const tx = await initializePortfolio();
// Tạo transaction gọi initializePortfolio()
```

**Transaction này:**
- ✅ Gọi function `initializePortfolio()` trong smart contract
- ✅ Cập nhật `portfolios[user].usdBalance = 10000 * 10^18`
- ✅ Emit event `PortfolioUpdated`
- ✅ Được lưu trên blockchain

#### **B. Buy Bitcoin Transaction**

```typescript
const tx = await buyBitcoin(btcAmount, btcPrice);
// Tạo transaction gọi buyBitcoin()
```

**Transaction này:**
- ✅ Gọi function `buyBitcoin()` trong smart contract
- ✅ Validate số dư
- ✅ Tính toán
- ✅ Cập nhật portfolio trên blockchain
- ✅ Lưu transaction vào `transactions[]` trên blockchain
- ✅ Emit events
- ✅ Được lưu trên blockchain

#### **C. Sell Bitcoin Transaction**

Tương tự như Buy, nhưng gọi `sellBitcoin()`

### **7.3. Transaction Lifecycle**

```
1. Frontend tạo transaction request
   ↓
2. MetaMask ký transaction với private key
   ↓
3. Transaction được gửi lên blockchain
   ↓
4. Blockchain nodes xử lý transaction
   ↓
5. Smart contract function được execute
   ↓
6. Dữ liệu được cập nhật trên blockchain
   ↓
7. Transaction được confirm (thêm vào block)
   ↓
8. Frontend nhận receipt
   ↓
9. ✅ Hoàn thành
```

### **7.4. Transaction Hash**

**Mỗi transaction có hash duy nhất:**
```
0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

**Dùng để:**
- ✅ Verify transaction trên Etherscan
- ✅ Track transaction status
- ✅ Query transaction details

**Ví dụ Etherscan link:**
```
https://sepolia.etherscan.io/tx/0x1234...
```

---

## 📝 Tóm Tắt: Blockchain Ở Đâu?

### **✅ Smart Contract:**
- File: `contracts/BitcoinTrading.sol`
- Chứa logic business
- Lưu trữ dữ liệu
- Chạy trên blockchain

### **✅ Web3 Services:**
- File: `src/lib/web3.ts`, `src/lib/contract.ts`
- Kết nối frontend với blockchain
- Gọi smart contract functions
- Đọc dữ liệu từ blockchain

### **✅ Components:**
- `ConnectWallet.tsx`: Kết nối MetaMask (blockchain wallet)
- `TradePanel.tsx`: Gọi smart contract để mua/bán
- `PortfolioStats.tsx`: Hiển thị dữ liệu từ blockchain
- `TransactionHistory.tsx`: Hiển thị transactions từ blockchain

### **✅ Dữ Liệu:**
- Portfolio: Lưu trong `portfolios` mapping trên blockchain
- Transactions: Lưu trong `transactions[]` array trên blockchain
- **KHÔNG** có database

### **✅ Transactions:**
- Mỗi giao dịch = một transaction trên blockchain
- Phải được ký bởi private key
- Phải được confirm bởi network
- Có thể verify trên Etherscan

---

**Kết luận:** Blockchain được áp dụng **TOÀN BỘ** trong dự án này. Không có phần nào không liên quan đến blockchain. Đây là một **blockchain application thật sự**, không phải mô phỏng.

