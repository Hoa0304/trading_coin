# Hướng Dẫn Nhanh - Bitcoin Trading Platform

## 🚀 Flow Chạy Bài

### Bước 1: Chuẩn bị môi trường

1. **Kiểm tra Node.js đã cài chưa:**
   ```bash
   node --version
   ```
   Cần Node.js >= 16.x

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

### Bước 2: Setup Supabase

1. **Tạo tài khoản Supabase:**
   - Truy cập: https://supabase.com
   - Đăng ký/Đăng nhập
   - Tạo project mới

2. **Chạy Migration:**
   - Vào **SQL Editor** trong Supabase Dashboard
   - Copy toàn bộ nội dung file: `supabase/migrations/20251028063832_create_bitcoin_trading_tables.sql`
   - Paste vào SQL Editor và click **Run**

3. **Lấy API Keys:**
   - Vào **Settings** > **API**
   - Copy **Project URL** và **anon public key**

### Bước 3: Tạo file .env

Tạo file `.env` ở root project với nội dung:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Ví dụ thực tế:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5OTk5OTk5OSwiZXhwIjoyMDE1Nzc1OTk5fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Bước 4: Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

---

## 📖 Hướng Dẫn Sử Dụng

### 🔐 Đăng ký tài khoản mới

1. Mở trình duyệt và truy cập: `http://localhost:5173`
2. Click vào **"Don't have an account? Sign up"**
3. Điền thông tin:
   - **Full Name**: Tên của bạn (ví dụ: Nguyễn Văn A)
   - **Email**: Email của bạn (ví dụ: test@example.com)
   - **Password**: Mật khẩu (tối thiểu 6 ký tự)
4. Click **Sign Up**
5. ✅ Tài khoản được tạo với **$10,000 USD** ban đầu

### 🔑 Đăng nhập

1. Nhập **Email** và **Password**
2. Click **Sign In**

### 💰 Mua Bitcoin (Buy BTC)

**Cách thực hiện:**

1. Sau khi đăng nhập, scroll xuống phần **Trade Panel**
2. Đảm bảo tab **Buy BTC** đang được chọn (màu hồng)
3. Nhập số lượng Bitcoin muốn mua (ví dụ: `0.001`)
4. Xem **Estimated Cost** để biết số USD cần chi
5. Kiểm tra **Available USD** đảm bảo đủ số dư
6. Click **Buy Bitcoin**
7. ✅ Kết quả:
   - Số dư BTC tăng lên
   - Số dư USD giảm xuống
   - Giao dịch xuất hiện trong lịch sử

**Ví dụ:**
- Giá Bitcoin hiện tại: $67,234.50
- Muốn mua: 0.001 BTC
- Cần chi: $67.23 USD
- Nếu số dư USD >= $67.23 → Giao dịch thành công

### 💸 Bán Bitcoin (Sell BTC)

**Cách thực hiện:**

1. Trong phần **Trade Panel**, click tab **Sell BTC**
2. Nhập số lượng Bitcoin muốn bán (ví dụ: `0.0005`)
3. Xem **Estimated Return** để biết số USD sẽ nhận
4. Kiểm tra **Available BTC** đảm bảo đủ số dư
5. Click **Sell Bitcoin**
6. ✅ Kết quả:
   - Số dư BTC giảm xuống
   - Số dư USD tăng lên
   - Giao dịch xuất hiện trong lịch sử

**Ví dụ:**
- Giá Bitcoin hiện tại: $67,234.50
- Muốn bán: 0.0005 BTC
- Sẽ nhận: $33.62 USD
- Nếu số dư BTC >= 0.0005 → Giao dịch thành công

---

## 📊 Hiểu Các Thành Phần Trên Giao Diện

### 1. Bitcoin Price
- Hiển thị giá Bitcoin hiện tại
- Biểu đồ giá 24h
- Thay đổi giá 24h (%)

### 2. Portfolio Stats
- **Total Portfolio Value**: Tổng giá trị tài sản (BTC + USD)
- **Bitcoin Holdings**: Số BTC hiện có và giá trị USD
- **Cash Balance**: Số dư USD hiện có

### 3. Trade Panel
- **Buy BTC**: Tab để mua Bitcoin
- **Sell BTC**: Tab để bán Bitcoin
- **Amount (BTC)**: Nhập số lượng BTC
- **Estimated Cost/Return**: Số USD cần chi/sẽ nhận
- **Available BTC/USD**: Số dư hiện có

### 4. Transaction History
- Hiển thị 10 giao dịch gần nhất
- Mỗi giao dịch hiển thị:
  - Loại: Buy/Sell
  - Số lượng BTC
  - Giá trị USD
  - Giá Bitcoin tại thời điểm giao dịch
  - Thời gian

---

## ⚠️ Lưu Ý Quan Trọng

### Validation
- ✅ Phải nhập số lượng > 0
- ✅ Số dư phải đủ trước khi giao dịch
- ✅ Không thể mua/bán số lượng âm

### Thông báo lỗi thường gặp

1. **"Insufficient USD balance"**
   - **Nguyên nhân**: Số dư USD không đủ để mua số lượng BTC yêu cầu
   - **Giải pháp**: Giảm số lượng BTC hoặc bán BTC để có thêm USD

2. **"Insufficient BTC balance"**
   - **Nguyên nhân**: Số dư BTC không đủ để bán
   - **Giải pháp**: Mua thêm BTC hoặc giảm số lượng muốn bán

3. **"Please enter a valid amount greater than 0"**
   - **Nguyên nhân**: Chưa nhập số lượng hoặc nhập số <= 0
   - **Giải pháp**: Nhập số lượng hợp lệ (ví dụ: 0.001)

4. **"Portfolio not found"**
   - **Nguyên nhân**: Portfolio chưa được tạo
   - **Giải pháp**: Đăng xuất và đăng nhập lại

---

## 🔧 Troubleshooting

### Lỗi khi chạy `npm run dev`

**Lỗi: "Cannot find module"**
```bash
# Giải pháp: Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

**Lỗi: "Invalid API key"**
- Kiểm tra file `.env` đã tạo chưa
- Kiểm tra `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` đúng chưa
- Restart dev server: `Ctrl+C` rồi chạy lại `npm run dev`

### Lỗi khi giao dịch

**Lỗi: "Failed to fetch"**
- Kiểm tra kết nối internet
- Kiểm tra Supabase project còn hoạt động không
- Kiểm tra RLS policies đã được tạo đúng chưa trong Supabase

**Lỗi: "Row Level Security violation"**
- Kiểm tra đã chạy migration file chưa
- Kiểm tra user đã đăng nhập chưa
- Kiểm tra RLS policies trong Supabase Dashboard

---

## 🎯 Flow Hoàn Chỉnh: Từ Setup Đến Giao Dịch

```
1. Setup môi trường
   ├─ npm install
   └─ Tạo file .env

2. Setup Supabase
   ├─ Tạo project
   ├─ Chạy migration
   └─ Lấy API keys

3. Chạy ứng dụng
   └─ npm run dev

4. Sử dụng
   ├─ Đăng ký/Đăng nhập
   ├─ Xem giá Bitcoin
   ├─ Mua Bitcoin
   └─ Bán Bitcoin

5. Theo dõi
   ├─ Xem Portfolio
   └─ Xem lịch sử giao dịch
```

---

## 📝 Checklist Trước Khi Chạy

- [ ] Node.js >= 16.x đã cài
- [ ] Đã chạy `npm install`
- [ ] Đã tạo Supabase project
- [ ] Đã chạy migration file
- [ ] Đã lấy API keys từ Supabase
- [ ] Đã tạo file `.env` với đúng thông tin
- [ ] Đã chạy `npm run dev` thành công
- [ ] Có thể mở `http://localhost:5173` trong trình duyệt

---

## 🎓 Tips

1. **Bắt đầu với số nhỏ**: Mua/bán số lượng nhỏ (0.001 BTC) để test trước
2. **Kiểm tra số dư**: Luôn kiểm tra Available Balance trước khi giao dịch
3. **Theo dõi giá**: Giá Bitcoin thay đổi mỗi 3 giây, chờ giá tốt trước khi giao dịch
4. **Xem lịch sử**: Kiểm tra Transaction History để theo dõi các giao dịch đã thực hiện

---

## ✅ Kết Luận

Sau khi hoàn thành các bước trên, bạn đã có thể:
- ✅ Đăng ký/Đăng nhập tài khoản
- ✅ Xem giá Bitcoin thời gian thực
- ✅ **Mua Bitcoin** với số dư USD
- ✅ **Bán Bitcoin** để nhận USD
- ✅ Theo dõi Portfolio và lịch sử giao dịch

**Chúc bạn sử dụng thành công!** 🎉

