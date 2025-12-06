# 📖 Hướng Dẫn Sử Dụng Chi Tiết - Bitcoin Trading Platform

## 📋 Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Cài Đặt và Setup](#cài-đặt-và-setup)
3. [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
4. [Giải Thích Về Blockchain](#giải-thích-về-blockchain)
5. [Troubleshooting](#troubleshooting)
6. [FAQ](#faq)

---

## 🎯 Giới Thiệu

**Bitcoin Trading Platform** là một ứng dụng web mô phỏng giao dịch Bitcoin, cho phép người dùng:

- ✅ Đăng ký/Đăng nhập tài khoản
- ✅ Xem giá Bitcoin thời gian thực từ CoinGecko API
- ✅ Mua Bitcoin bằng USD (giả lập)
- ✅ Bán Bitcoin để nhận USD (giả lập)
- ✅ Theo dõi Portfolio và lịch sử giao dịch

### ⚠️ Lưu Ý Quan Trọng

**Đây KHÔNG phải là ứng dụng blockchain thật**, mà là một **Trading Simulator** (mô phỏng giao dịch):

- ❌ **KHÔNG** kết nối với blockchain Bitcoin thật
- ❌ **KHÔNG** sử dụng ví blockchain thật
- ❌ **KHÔNG** thực hiện giao dịch trên blockchain
- ✅ Chỉ mô phỏng giao dịch với dữ liệu lưu trong database
- ✅ Giá Bitcoin được lấy từ CoinGecko API (giá thật)
- ✅ Số dư và giao dịch chỉ tồn tại trong database của ứng dụng

**Mục đích**: Học tập và thực hành trading Bitcoin trong môi trường an toàn, không rủi ro tài chính.

---

## 🚀 Cài Đặt và Setup

### Yêu Cầu Hệ Thống

- **Node.js**: >= 16.x
- **npm**: >= 8.x
- **Tài khoản Supabase**: Miễn phí tại [supabase.com](https://supabase.com)

### Bước 1: Clone và Cài Đặt Dependencies

```bash
# Clone repository (nếu có)
git clone <repository-url>
cd trading_coin

# Cài đặt dependencies
npm install
```

### Bước 2: Setup Supabase

#### 2.1. Tạo Project Supabase

1. Truy cập [Supabase](https://supabase.com)
2. Đăng ký/Đăng nhập tài khoản
3. Click **"New Project"**
4. Điền thông tin:
   - **Name**: Tên project (ví dụ: `bitcoin-trading`)
   - **Database Password**: Tạo password mạnh (lưu lại)
   - **Region**: Chọn region gần nhất
5. Click **"Create new project"** và đợi project được tạo (2-3 phút)

#### 2.2. Chạy Migration (Tạo Database Tables)

1. Trong Supabase Dashboard, vào **SQL Editor**
2. Click **"New query"**
3. Mở file `supabase/migrations/20251028063832_create_bitcoin_trading_tables.sql`
4. Copy **toàn bộ nội dung** file
5. Paste vào SQL Editor
6. Click **"Run"** (hoặc `Ctrl+Enter`)
7. Kiểm tra kết quả: Nên thấy message "Success. No rows returned"

#### 2.3. Lấy API Credentials

1. Vào **Settings** > **API**
2. Copy các thông tin sau:
   - **Project URL**: Ví dụ: `https://abcdefghijklmnop.supabase.co`
   - **anon public key**: Ví dụ: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Bước 3: Tạo File .env

Tạo file `.env` ở **root của project** (cùng cấp với `package.json`):

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Ví dụ thực tế:**

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5OTk5OTk5OSwiZXhwIjoyMDE1Nzc1OTk5fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ Lưu ý:**
- Không có khoảng trắng xung quanh dấu `=`
- Không có dấu ngoặc kép `"` hoặc `'`
- File `.env` đã được thêm vào `.gitignore` (không commit lên Git)

### Bước 4: Chạy Ứng Dụng

```bash
# Development mode
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

Mở trình duyệt và truy cập địa chỉ trên.

---

## 📱 Hướng Dẫn Sử Dụng

### 1. Đăng Ký Tài Khoản Mới

#### Các Bước:

1. Mở ứng dụng trong trình duyệt: `http://localhost:5173`
2. Bạn sẽ thấy màn hình đăng nhập
3. Click vào link **"Don't have an account? Sign up"** ở cuối form
4. Điền thông tin:
   - **Full Name**: Tên đầy đủ của bạn (ví dụ: `Nguyễn Văn A`)
   - **Email**: Email hợp lệ (ví dụ: `test@example.com`)
   - **Password**: Mật khẩu (tối thiểu 6 ký tự)
5. Click nút **"Sign Up"**

#### Kết Quả:

- ✅ Tài khoản được tạo thành công
- ✅ Tự động tạo Portfolio với:
  - **$10,000 USD** (số dư ban đầu)
  - **0 BTC** (chưa có Bitcoin)
- ✅ Tự động đăng nhập và chuyển đến trang chính

#### Validation:

- ✅ Email phải đúng format (có `@` và domain)
- ✅ Password phải >= 6 ký tự
- ✅ Full Name không được để trống
- ✅ Email không được trùng với tài khoản đã có

### 2. Đăng Nhập

#### Các Bước:

1. Nhập **Email** đã đăng ký
2. Nhập **Password**
3. Click nút **"Sign In"**

#### Xử Lý Lỗi:

- **"Invalid email or password"**: Email hoặc mật khẩu sai
- **"Email not confirmed"**: Cần xác nhận email (nếu Supabase yêu cầu)
- **"Too many requests"**: Đăng nhập quá nhiều lần, đợi vài phút

### 3. Mua Bitcoin (Buy BTC)

#### Các Bước:

1. Sau khi đăng nhập, scroll xuống phần **"Trade Panel"**
2. Đảm bảo tab **"Buy BTC"** đang được chọn (màu hồng)
3. Nhập số lượng Bitcoin muốn mua vào ô **"Amount (BTC)"**
   - Ví dụ: `0.001` (một phần nghìn Bitcoin)
   - Ví dụ: `0.01` (một phần trăm Bitcoin)
4. Xem **"Estimated Cost"** để biết số USD cần chi
5. Kiểm tra **"Available USD"** để đảm bảo đủ số dư
6. Click nút **"Buy Bitcoin"**

#### Ví Dụ Cụ Thể:

```
Giá Bitcoin hiện tại: $67,234.50
Số lượng muốn mua: 0.001 BTC
Estimated Cost: $67.23 USD

Nếu Available USD >= $67.23:
  ✅ Giao dịch thành công
  - BTC balance: 0 → 0.001 BTC
  - USD balance: $10,000 → $9,932.77
  - Transaction được ghi vào lịch sử

Nếu Available USD < $67.23:
  ❌ Lỗi: "Insufficient USD balance"
```

#### Validation:

- ✅ Số lượng phải > 0
- ✅ Số lượng phải là số hợp lệ (không phải chữ)
- ✅ Số dư USD phải đủ
- ✅ Giá Bitcoin phải hợp lệ (> 0)

### 4. Bán Bitcoin (Sell BTC)

#### Các Bước:

1. Trong phần **"Trade Panel"**, click tab **"Sell BTC"**
2. Nhập số lượng Bitcoin muốn bán vào ô **"Amount (BTC)"**
   - Ví dụ: `0.0005` (nửa phần nghìn Bitcoin)
3. Xem **"Estimated Return"** để biết số USD sẽ nhận
4. Kiểm tra **"Available BTC"** để đảm bảo đủ số dư
5. Click nút **"Sell Bitcoin"**

#### Ví Dụ Cụ Thể:

```
Giá Bitcoin hiện tại: $67,234.50
Số lượng muốn bán: 0.0005 BTC
Estimated Return: $33.62 USD

Nếu Available BTC >= 0.0005:
  ✅ Giao dịch thành công
  - BTC balance: 0.001 → 0.0005 BTC
  - USD balance: $9,932.77 → $9,966.39
  - Transaction được ghi vào lịch sử

Nếu Available BTC < 0.0005:
  ❌ Lỗi: "Insufficient BTC balance"
```

### 5. Xem Portfolio Stats

Phần **"Portfolio Stats"** hiển thị:

- **Total Portfolio Value**: Tổng giá trị tài sản
  - Công thức: `(BTC balance × Giá Bitcoin hiện tại) + USD balance`
  - Ví dụ: `(0.001 × $67,234.50) + $9,932.77 = $10,000.00`

- **Bitcoin Holdings**: 
  - Số BTC hiện có
  - Giá trị USD tương ứng

- **Cash Balance**: 
  - Số dư USD hiện có

### 6. Xem Lịch Sử Giao Dịch

Phần **"Transaction History"** hiển thị **10 giao dịch gần nhất**, mỗi giao dịch bao gồm:

- **Type**: `Buy` hoặc `Sell`
- **BTC Amount**: Số lượng Bitcoin
- **USD Amount**: Giá trị USD
- **Price**: Giá Bitcoin tại thời điểm giao dịch
- **Time**: Thời gian giao dịch

### 7. Xem Giá Bitcoin Thời Gian Thực

Phần **"Bitcoin Price"** hiển thị:

- **Giá hiện tại**: Cập nhật mỗi 10 giây từ CoinGecko API
- **24h Change**: Thay đổi giá trong 24 giờ qua (%)
- **Price Chart**: Biểu đồ giá 24 giờ

---

## 🔗 Giải Thích Về Blockchain

### ❓ Ứng Dụng Này Có Phải Blockchain Thật Không?

**TRẢ LỜI: KHÔNG**

Ứng dụng này **KHÔNG phải là ứng dụng blockchain thật**, mà là một **Trading Simulator** (mô phỏng giao dịch).

### 📊 So Sánh: Blockchain Thật vs Trading Simulator

| Tính Năng | Blockchain Thật | Trading Simulator (Ứng dụng này) |
|-----------|----------------|----------------------------------|
| **Kết nối blockchain** | ✅ Kết nối với Bitcoin network | ❌ Không kết nối |
| **Ví blockchain** | ✅ Sử dụng ví thật (MetaMask, Trust Wallet) | ❌ Không có ví blockchain |
| **Giao dịch trên blockchain** | ✅ Transaction được ghi trên blockchain | ❌ Chỉ lưu trong database |
| **Phí giao dịch** | ✅ Phải trả phí gas/network | ❌ Không có phí |
| **Thời gian xác nhận** | ✅ 10-60 phút (block confirmation) | ✅ Ngay lập tức |
| **Bảo mật** | ✅ Private key, mật mã học | ✅ Username/password |
| **Số dư** | ✅ Lưu trên blockchain | ❌ Lưu trong database |
| **Giá Bitcoin** | ✅ Lấy từ nhiều nguồn | ✅ Lấy từ CoinGecko API (giá thật) |
| **Rủi ro** | ⚠️ Mất tiền thật nếu lỗi | ✅ Không có rủi ro tài chính |

### 🎯 Mục Đích Của Ứng Dụng Này

1. **Học tập**: Hiểu cách trading Bitcoin hoạt động
2. **Thực hành**: Luyện tập trading trong môi trường an toàn
3. **Demo**: Demo giao diện và flow của trading platform
4. **Phát triển**: Base code để phát triển ứng dụng blockchain thật sau này

### 🔄 Để Làm Ứng Dụng Blockchain Thật, Cần:

1. **Kết nối với Blockchain Network**:
   - Sử dụng Web3.js hoặc Ethers.js
   - Kết nối với Bitcoin network hoặc Ethereum network
   - Hoặc sử dụng các API như BlockCypher, Blockchain.info

2. **Tích hợp Ví Blockchain**:
   - MetaMask (cho Ethereum)
   - WalletConnect
   - Bitcoin wallet libraries

3. **Xử Lý Transaction Thật**:
   - Tạo transaction trên blockchain
   - Ký transaction bằng private key
   - Gửi transaction lên network
   - Đợi confirmation

4. **Quản Lý Private Key**:
   - Lưu trữ an toàn
   - Mã hóa
   - Không lưu trên server

5. **Xử Lý Phí Giao Dịch**:
   - Tính toán gas fee
   - Hiển thị cho user
   - Xử lý khi thiếu phí

### 💡 Kết Luận

- ✅ **Ứng dụng này**: Trading Simulator, an toàn, không rủi ro
- ❌ **KHÔNG phải**: Blockchain application thật
- 🎓 **Mục đích**: Học tập và thực hành
- 🚀 **Có thể phát triển**: Thành blockchain app thật nếu cần

---

## 🔧 Troubleshooting

### Lỗi Khi Setup

#### 1. "Cannot find module"

```bash
# Giải pháp: Xóa và cài lại dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. "Invalid API key" hoặc "Failed to fetch"

**Nguyên nhân:**
- File `.env` chưa được tạo
- Thông tin trong `.env` sai
- Dev server chưa restart sau khi tạo `.env`

**Giải pháp:**
1. Kiểm tra file `.env` đã tạo chưa (ở root project)
2. Kiểm tra `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` đúng chưa
3. Restart dev server:
   ```bash
   # Dừng server (Ctrl+C)
   npm run dev
   ```

#### 3. "Portfolio not found"

**Nguyên nhân:**
- Migration chưa được chạy
- RLS policies chưa được tạo
- User chưa có portfolio

**Giải pháp:**
1. Kiểm tra migration đã chạy chưa trong Supabase SQL Editor
2. Kiểm tra RLS policies trong Supabase Dashboard > Authentication > Policies
3. Đăng xuất và đăng nhập lại
4. Nếu vẫn lỗi, đăng ký tài khoản mới

### Lỗi Khi Giao Dịch

#### 1. "Insufficient USD balance"

**Nguyên nhân:** Số dư USD không đủ để mua số lượng BTC yêu cầu

**Giải pháp:**
- Giảm số lượng BTC muốn mua
- Hoặc bán BTC để có thêm USD

#### 2. "Insufficient BTC balance"

**Nguyên nhân:** Số dư BTC không đủ để bán

**Giải pháp:**
- Giảm số lượng BTC muốn bán
- Hoặc mua thêm BTC

#### 3. "Please enter a valid amount greater than 0"

**Nguyên nhân:** Chưa nhập số lượng hoặc nhập số <= 0

**Giải pháp:**
- Nhập số lượng hợp lệ (ví dụ: `0.001`)

#### 4. "Invalid Bitcoin price"

**Nguyên nhân:** Không lấy được giá Bitcoin từ API

**Giải pháp:**
- Kiểm tra kết nối internet
- Đợi vài giây rồi thử lại
- Kiểm tra CoinGecko API có hoạt động không

### Lỗi Khi Build

```bash
# Chạy build để kiểm tra lỗi
npm run build

# Các lỗi thường gặp:
# - Import/export sai
# - Type errors
# - Missing dependencies
```

---

## ❓ FAQ

### 1. Tôi có thể rút tiền thật không?

**Không.** Đây là ứng dụng mô phỏng, không có tiền thật. Số dư chỉ tồn tại trong database.

### 2. Giá Bitcoin có phải giá thật không?

**Có.** Giá Bitcoin được lấy từ CoinGecko API, là giá thật trên thị trường. Tuy nhiên, giao dịch chỉ là mô phỏng.

### 3. Tôi có thể kết nối ví blockchain không?

**Hiện tại không.** Ứng dụng này không hỗ trợ kết nối ví blockchain. Để làm điều này, cần tích hợp Web3.js hoặc các thư viện tương tự.

### 4. Dữ liệu có được lưu vĩnh viễn không?

**Có.** Dữ liệu được lưu trong Supabase database và sẽ tồn tại miễn là project Supabase còn hoạt động.

### 5. Tôi có thể reset số dư không?

**Có thể**, bằng cách:
- Xóa và tạo lại portfolio trong Supabase Dashboard
- Hoặc đăng ký tài khoản mới

### 6. Ứng dụng có an toàn không?

**Có.** Ứng dụng sử dụng:
- Row Level Security (RLS) trong Supabase
- Authentication từ Supabase Auth
- Mỗi user chỉ xem được dữ liệu của mình

### 7. Tôi có thể deploy lên production không?

**Có.** Có thể deploy lên:
- Vercel
- Netlify
- Cloudflare Pages
- Hoặc bất kỳ hosting nào hỗ trợ static files

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra phần **Troubleshooting** ở trên
2. Kiểm tra console trong trình duyệt (F12 > Console)
3. Kiểm tra Network tab để xem API calls
4. Tạo issue trên repository (nếu có)

---

## ✅ Checklist Trước Khi Sử Dụng

- [ ] Node.js >= 16.x đã cài
- [ ] Đã chạy `npm install`
- [ ] Đã tạo Supabase project
- [ ] Đã chạy migration file
- [ ] Đã lấy API keys từ Supabase
- [ ] Đã tạo file `.env` với đúng thông tin
- [ ] Đã chạy `npm run dev` thành công
- [ ] Có thể mở `http://localhost:5173` trong trình duyệt
- [ ] Đã đọc và hiểu rằng đây là Trading Simulator, không phải blockchain thật

---

**Chúc bạn sử dụng thành công!** 🎉


