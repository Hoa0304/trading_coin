# 🔑 Hướng Dẫn Import Account Vào MetaMask Để Có 10,000 ETH

## ⚠️ Vấn Đề

MetaMask đang ở network "Localhost 8545" nhưng không có ETH. Điều này có nghĩa là:
- Account trong MetaMask **KHÔNG phải** account từ Hardhat node
- Hoặc Hardhat node **chưa chạy**

## ✅ Giải Pháp

### Bước 1: Đảm Bảo Hardhat Node Đang Chạy

Mở terminal và chạy:

```bash
npx hardhat node
```

**Kết quả mong đợi:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
...
```

**Lưu ý:** Terminal này phải **GIỮ CHẠY** (không đóng).

---

### Bước 2: Copy Private Key Từ Hardhat Node

Từ terminal `npx hardhat node`, copy **Private Key** của **Account #0**:

```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

---

### Bước 3: Import Account Vào MetaMask

1. **Mở MetaMask**
2. **Click vào icon account** (góc trên bên phải, icon tròn)
3. **Chọn "Import Account"** hoặc "Nhập tài khoản"
4. **Paste private key** vừa copy
5. **Click "Import"** hoặc "Nhập"

---

### Bước 4: Chuyển Sang Account Đã Import

1. **Click vào tên account** ở trên cùng
2. **Chọn account vừa import** (sẽ có address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`)
3. **Bạn sẽ thấy 10,000 ETH ngay lập tức!**

---

### Bước 5: Đảm Bảo Đang Ở Đúng Network

1. **Click vào network dropdown** (hiện tại là "Localhost 8545")
2. **Đảm bảo đang chọn "Localhost 8545"** hoặc "Hardhat Local"
3. Nếu không thấy, thêm network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

---

## 🔍 Kiểm Tra

Sau khi import, bạn sẽ thấy:
- ✅ Balance: **10,000 ETH** (hoặc **10.000 ETH**)
- ✅ Network: **Localhost 8545** hoặc **Hardhat Local**
- ✅ Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` (Account #0)

---

## ❌ Nếu Vẫn Không Có ETH

### Vấn đề 1: Hardhat Node Chưa Chạy

**Giải pháp:**
```bash
npx hardhat node
```

Đảm bảo terminal hiển thị:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Vấn đề 2: Account Sai

**Giải pháp:**
- Xóa account cũ trong MetaMask
- Import lại account từ Hardhat node (Account #0)
- Copy private key chính xác (66 ký tự)

### Vấn đề 3: Network Sai

**Giải pháp:**
- Đảm bảo đang ở network "Localhost 8545" hoặc "Hardhat Local"
- RPC URL phải là: `http://127.0.0.1:8545`
- Chain ID phải là: `1337`

### Vấn đề 4: Hardhat Node Bị Restart

**Giải pháp:**
- Nếu restart Hardhat node, accounts vẫn giữ nguyên
- Nhưng nếu deploy contract mới, contract address sẽ thay đổi
- Cần deploy lại và cập nhật `.env`

---

## 📋 Checklist

- [ ] Hardhat node đang chạy (`npx hardhat node`)
- [ ] Đã copy private key từ Account #0
- [ ] Đã import account vào MetaMask
- [ ] Đã chuyển sang account vừa import
- [ ] Đang ở network "Localhost 8545"
- [ ] Thấy 10,000 ETH trong balance

---

## 🎉 Sau Khi Có ETH

1. **Kết nối MetaMask trong app**
2. **Khởi tạo portfolio** (sẽ tốn một chút gas fee)
3. **Bắt đầu trading!**

---

**Lưu ý:** Mỗi lần restart Hardhat node, accounts và private keys vẫn giữ nguyên, nhưng contract address sẽ thay đổi nếu deploy lại.


