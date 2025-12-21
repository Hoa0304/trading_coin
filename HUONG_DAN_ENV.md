# 📝 Hướng Dẫn Chi Tiết File `.env`

File `.env` chứa các thông tin cấu hình quan trọng cho dự án. File này **KHÔNG được commit vào git** (đã có trong `.gitignore`).

---

## 🎯 Tạo File `.env`

1. **Tạo file mới** trong thư mục gốc (cùng cấp với `package.json`)
2. **Đặt tên:** `.env` (có dấu chấm ở đầu)
3. **Không có extension** (không phải `.env.txt`)

---

## ✅ File `.env` Cho Hardhat Local Network (Khuyến nghị)

**Ưu điểm:**
- ✅ **KHÔNG cần faucet**
- ✅ **KHÔNG cần Mainnet ETH**
- ✅ **KHÔNG cần API keys** (Infura/Alchemy)
- ✅ **Tự động có 10,000 ETH ảo**
- ✅ **Deploy và test miễn phí**

### Nội dung file `.env`:

```env
# Private Key từ MetaMask (xem cách lấy bên dưới)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Contract Address (sẽ điền sau khi deploy)
VITE_CONTRACT_ADDRESS=
```

**Chỉ cần 2 dòng này là đủ!**

---

## 📋 Các Biến Môi Trường

### 1. PRIVATE_KEY (Bắt buộc)

**Mô tả:** Private key của wallet MetaMask dùng để deploy contract.

**Cách lấy:**

1. **Mở MetaMask**
2. **Click vào tên account** ở trên cùng (ví dụ: "Account 1", "Account 2")
3. **Chọn "Account Details"** hoặc "Chi tiết tài khoản"
4. **Click "Export Private Key"** hoặc "Xuất khóa riêng tư"
5. **Nhập password MetaMask**
6. **Copy private key** (bắt đầu bằng `0x` và có **66 ký tự**)

**Format:**
```env
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

**Lưu ý:**
- ✅ Phải bắt đầu bằng `0x`
- ✅ Phải có đúng **66 ký tự** (0x + 64 ký tự hex)
- ✅ Không có khoảng trắng
- ✅ Không có dấu ngoặc kép

**Ví dụ đúng:**
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Ví dụ sai:**
```
ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80  (thiếu 0x)
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff  (thiếu ký tự)
```

---

### 2. VITE_CONTRACT_ADDRESS (Điền sau khi deploy)

**Mô tả:** Địa chỉ contract sau khi deploy.

**Cách lấy:**

1. **Deploy contract:**
   ```bash
   npx hardhat run scripts/deploy.js --network hardhat
   ```

2. **Copy contract address** từ output (ví dụ: `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

3. **Thêm vào `.env`:**
   ```env
   VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
   ```

**Format:**
```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

## 🚀 Quy Trình Hoàn Chỉnh

### Bước 1: Tạo file `.env`

Tạo file `.env` với nội dung:

```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
VITE_CONTRACT_ADDRESS=
```

### Bước 2: Deploy contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network hardhat
```

### Bước 3: Copy contract address

Từ output, copy contract address và thêm vào `.env`:

```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Bước 4: Chạy Hardhat node

Mở terminal mới:

```bash
npx hardhat node
```

**Kết quả:** Bạn sẽ thấy 20 accounts với private keys và 10,000 ETH mỗi account.

### Bước 5: Thêm network vào MetaMask

1. Mở MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Điền:
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** `ETH`
4. Click "Save"

### Bước 6: Import account vào MetaMask

1. Copy **private key** của Account #0 từ terminal `npx hardhat node`
2. Trong MetaMask: Click icon account → "Import Account"
3. Paste private key → Click "Import"
4. **Bạn sẽ có 10,000 ETH ảo ngay lập tức!**

### Bước 7: Chạy app

```bash
npm run dev
```

Kết nối MetaMask với network "Hardhat Local" và bắt đầu test!

---

## ✅ Kiểm Tra File `.env`

Sau khi tạo file `.env`, kiểm tra:

```bash
node check-env.js
```

Script này sẽ kiểm tra:
- ✅ Private key có đúng format không (66 ký tự, bắt đầu bằng 0x)
- ✅ Cảnh báo nếu có vấn đề

---

## 🔒 Bảo Mật

### ⚠️ QUAN TRỌNG:

1. **KHÔNG commit file `.env` vào git!**
   - File đã có trong `.gitignore`
   - Kiểm tra lại trước khi commit

2. **KHÔNG chia sẻ private key với ai!**
   - Private key = quyền kiểm soát wallet
   - Nếu lộ, người khác có thể lấy hết tiền

---

## 🐛 Troubleshooting

### Lỗi: "private key too short"
- **Nguyên nhân:** Private key thiếu ký tự hoặc thiếu `0x`
- **Giải pháp:** Kiểm tra private key có đúng 66 ký tự và bắt đầu bằng `0x`

### Lỗi: "Cannot read properties of undefined (reading 'address')"
- **Nguyên nhân:** Private key không hợp lệ hoặc chưa được điền
- **Giải pháp:** Kiểm tra lại file `.env` và chạy `node check-env.js`

### Lỗi: "insufficient funds for gas"
- **Nguyên nhân:** Chưa import account từ Hardhat node
- **Giải pháp:** 
  1. Chạy `npx hardhat node` (terminal mới)
  2. Copy private key từ Account #0
  3. Import vào MetaMask
  4. Bạn sẽ có 10,000 ETH ảo!

### Lỗi: "Network error" khi kết nối MetaMask
- **Nguyên nhân:** Hardhat node chưa chạy
- **Giải pháp:** Chạy `npx hardhat node` trong terminal riêng

---

## 📚 Tài Liệu Tham Khảo

- **MetaMask:** https://metamask.io/
- **Hardhat:** https://hardhat.org/

---

## ✅ Checklist

Trước khi deploy, đảm bảo:

- [ ] File `.env` đã được tạo
- [ ] `PRIVATE_KEY` đã điền và đúng format (66 ký tự)
- [ ] Đã chạy `npx hardhat compile` thành công
- [ ] Đã deploy contract: `npx hardhat run scripts/deploy.js --network hardhat`
- [ ] `VITE_CONTRACT_ADDRESS` đã điền vào `.env`
- [ ] Đã chạy `npx hardhat node` (terminal riêng)
- [ ] Đã thêm Hardhat Local network vào MetaMask
- [ ] Đã import account từ Hardhat node vào MetaMask
- [ ] File `.env` KHÔNG được commit vào git

---

## 🎉 Kết Luận

Với Hardhat Local Network, bạn có thể:
- ✅ Test contract miễn phí
- ✅ Không cần faucet
- ✅ Không cần Mainnet ETH
- ✅ Tự động có 10,000 ETH ảo
- ✅ Phát triển và test thoải mái!

**Chúc bạn thành công!** 🎉
