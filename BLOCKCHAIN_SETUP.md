# 🔗 Hướng Dẫn Setup Blockchain App

## ✅ Đã Hoàn Thành

- ✅ Tích hợp ethers.js
- ✅ Tạo Web3 service
- ✅ Tạo Wallet Context
- ✅ Tích hợp MetaMask
- ✅ Tạo Smart Contract
- ✅ Update TradePanel để dùng blockchain
- ✅ Update Portfolio và Transaction History từ blockchain

---

## 🚀 Cách Sử Dụng

### Bước 1: Cài Đặt MetaMask

1. Cài MetaMask extension: https://metamask.io/download/
2. Tạo wallet mới hoặc import wallet
3. Chuyển sang Sepolia Test Network

### Bước 2: Lấy Sepolia ETH (Miễn Phí)

1. Truy cập faucet:
   - https://sepoliafaucet.com/
   - https://faucet.quicknode.com/ethereum/sepolia
2. Nhập địa chỉ wallet
3. Nhận test ETH (cần để trả gas fee)

### Bước 3: Deploy Smart Contract

Xem hướng dẫn trong [DEPLOY_CONTRACT.md](./DEPLOY_CONTRACT.md)

Sau khi deploy, copy contract address và thêm vào `.env`:

```env
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Bước 4: Chạy Ứng Dụng

```bash
npm run dev
```

### Bước 5: Sử Dụng

1. Mở app trong browser
2. Click "Connect MetaMask"
3. Approve connection trong MetaMask
4. Nếu chưa có portfolio, sẽ được hỏi khởi tạo với $10,000 USD
5. Bắt đầu trading!

---

## ⚠️ Lưu Ý Quan Trọng

1. **Contract Address**: Phải deploy contract trước và set `VITE_CONTRACT_ADDRESS`
2. **Sepolia ETH**: Cần ETH để trả gas fee (khoảng 0.001 ETH cho mỗi transaction)
3. **Network**: Phải ở Sepolia testnet (không dùng mainnet)
4. **Gas Fee**: Mỗi transaction tốn gas fee (khoảng $0.01-$0.10 trên testnet)

---

## 🔍 Kiểm Tra Transaction

Sau khi trade, bạn có thể:
- Click link "View on Etherscan" trong app
- Hoặc vào https://sepolia.etherscan.io và search transaction hash

---

## 🐛 Troubleshooting

### "Contract address not set"
- Deploy contract và set `VITE_CONTRACT_ADDRESS` trong `.env`

### "Insufficient ETH for gas"
- Lấy thêm Sepolia ETH từ faucet

### "User rejected transaction"
- User đã cancel transaction trong MetaMask

### "Transaction failed"
- Kiểm tra số dư đủ không
- Kiểm tra contract đã được deploy chưa

---

**Chúc bạn thành công!** 🎉

