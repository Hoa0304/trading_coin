# Bitcoin Trading Platform

Ứng dụng web **mô phỏng giao dịch Bitcoin**, cho phép người dùng mua và bán Bitcoin với giá thời gian thực, theo dõi portfolio và lịch sử giao dịch.

## ⚠️ Lưu Ý Quan Trọng

**Đây KHÔNG phải là ứng dụng blockchain thật**, mà là một **Trading Simulator** (mô phỏng giao dịch):

- ❌ **KHÔNG** kết nối với blockchain Bitcoin thật
- ❌ **KHÔNG** sử dụng ví blockchain thật
- ❌ **KHÔNG** thực hiện giao dịch trên blockchain
- ✅ Chỉ mô phỏng giao dịch với dữ liệu lưu trong database
- ✅ Giá Bitcoin được lấy từ CoinGecko API (giá thật)
- ✅ Số dư và giao dịch chỉ tồn tại trong database của ứng dụng

**Mục đích**: Học tập và thực hành trading Bitcoin trong môi trường an toàn, không rủi ro tài chính.

## Tính năng

- ✅ Đăng ký/Đăng nhập người dùng đơn giản (JWT Authentication)
- ✅ Hiển thị thông tin user sau khi đăng nhập
- ✅ Xem giá Bitcoin thời gian thực từ CoinGecko API với biểu đồ giá
- ✅ **Mua Bitcoin**: Sử dụng số dư USD để mua Bitcoin (mô phỏng)
- ✅ **Bán Bitcoin**: Bán Bitcoin để nhận USD (mô phỏng)
- ✅ Theo dõi Portfolio (số dư BTC, USD, tổng giá trị)
- ✅ Lịch sử giao dịch chi tiết
- ✅ Validation đầy đủ và ACID compliance
- ✅ Error handling và user feedback tốt

## Công nghệ sử dụng

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Express.js + SQLite
- **Authentication**: JWT (JSON Web Token)
- **Database**: SQLite (file-based, không cần server riêng)
- **Icons**: Lucide React
- **Bitcoin Price API**: CoinGecko API (giá thật, cập nhật mỗi 30 giây)

## Yêu cầu hệ thống

- Node.js >= 16.x
- npm >= 8.x
- **Không cần** Supabase hay database server riêng

## Hướng dẫn Setup

> 📖 **Xem hướng dẫn nhanh**: [QUICK_START.md](./QUICK_START.md)  
> 📖 **Xem hướng dẫn chi tiết**: [SETUP_SQLITE.md](./SETUP_SQLITE.md)

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd trading_coin
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Chạy ứng dụng

**⚠️ QUAN TRỌNG**: Ứng dụng cần **2 server** chạy cùng lúc:
- Backend server (Express + SQLite) - Port 3001
- Frontend server (Vite) - Port 5173

#### Cách 1: Chạy cả 2 cùng lúc (Khuyến nghị)

```bash
npm run dev:all
```

Lệnh này sẽ tự động chạy cả backend và frontend.

#### Cách 2: Chạy riêng (2 terminal)

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Bước 4: Truy cập ứng dụng

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

**Lưu ý**: Database SQLite sẽ được tạo tự động tại `server/database.sqlite` khi chạy backend lần đầu.

#### Build production

```bash
npm run build
```

Build files sẽ được tạo trong thư mục `dist/`

**Lưu ý**: Sau khi build, vẫn cần chạy backend server để API hoạt động.

## Hướng dẫn sử dụng

> 📖 **Xem hướng dẫn chi tiết**: [HUONG_DAN_SU_DUNG.md](./HUONG_DAN_SU_DUNG.md)

### Đăng ký tài khoản

1. Mở ứng dụng trong trình duyệt: `http://localhost:5173`
2. Click vào **"Chưa có tài khoản? Đăng ký"**
3. Nhập thông tin:
   - **Tên** (Tùy chọn): Tên của bạn
   - **Email**: Email của bạn
   - **Mật khẩu**: Mật khẩu (bất kỳ)
4. Click **Đăng ký**
5. Tài khoản mới sẽ được tạo với **$10,000 USD** và **0 BTC** làm số dư ban đầu
6. Tự động đăng nhập và chuyển đến trang chính
7. **Thông tin user** (email/tên) sẽ hiển thị ở header

### Đăng nhập

1. Nhập **Email** và **Mật khẩu**
2. Click **Đăng nhập**
3. Sau khi đăng nhập, **thông tin user** sẽ hiển thị ở header

### Mua Bitcoin

1. Sau khi đăng nhập, scroll xuống phần **Trade Panel**
2. Đảm bảo tab **Buy BTC** đang được chọn (màu hồng)
3. Nhập số lượng Bitcoin muốn mua (ví dụ: `0.001`)
4. Xem **Estimated Cost** để biết số USD cần chi
5. Kiểm tra **Available USD** để đảm bảo đủ số dư
6. Click **Buy Bitcoin**
7. Số dư sẽ được cập nhật ngay lập tức:
   - **BTC balance** tăng lên
   - **USD balance** giảm xuống
   - Transaction được ghi vào lịch sử

### Bán Bitcoin

1. Trong phần **Trade Panel**, click tab **Sell BTC**
2. Nhập số lượng Bitcoin muốn bán (ví dụ: `0.0005`)
3. Xem **Estimated Return** để biết số USD sẽ nhận
4. Kiểm tra **Available BTC** để đảm bảo đủ số dư
5. Click **Sell Bitcoin**
6. Số dư sẽ được cập nhật ngay lập tức:
   - **BTC balance** giảm xuống
   - **USD balance** tăng lên
   - Transaction được ghi vào lịch sử

### Xem Portfolio

Phần **Portfolio Stats** hiển thị:
- **Total Portfolio Value**: Tổng giá trị portfolio (BTC value + USD)
- **Bitcoin Holdings**: Số BTC hiện có và giá trị USD tương ứng
- **Cash Balance**: Số dư USD hiện có

### Xem Lịch sử giao dịch

Phần **Transaction History** hiển thị 10 giao dịch gần nhất với:
- Loại giao dịch (Buy/Sell)
- Số lượng BTC
- Giá trị USD
- Giá Bitcoin tại thời điểm giao dịch
- Thời gian giao dịch

## Cấu trúc dự án

```
trading_coin/
├── server/
│   ├── index.js             # Backend Express server
│   └── database.sqlite      # SQLite database (tự động tạo)
├── src/
│   ├── components/          # React components
│   │   ├── AuthForm.tsx     # Form đăng ký/đăng nhập
│   │   ├── PortfolioStats.tsx # Hiển thị thống kê portfolio
│   │   ├── PriceChart.tsx   # Biểu đồ giá Bitcoin
│   │   ├── TradePanel.tsx   # Panel mua/bán Bitcoin
│   │   └── TransactionHistory.tsx # Lịch sử giao dịch
│   ├── hooks/
│   │   └── useBitcoinPrice.ts # Hook lấy giá Bitcoin
│   ├── lib/
│   │   └── api.ts           # API client (thay thế Supabase)
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
   - Kiểm tra số dư đủ trước khi giao dịch
   - Kiểm tra số dư không âm sau giao dịch
   - Hiển thị thông báo lỗi rõ ràng khi thiếu số dư

3. **ACID Compliance**:
   - Mỗi database operation là atomic
   - Validation đầy đủ trước khi thực hiện giao dịch
   - Error handling đầy đủ

### Security

- **JWT Authentication**: Token-based authentication
- **Password Hashing**: Sử dụng bcrypt để hash password
- **API Protection**: Tất cả API endpoints (trừ login/register) yêu cầu JWT token
- **Data Isolation**: Mỗi user chỉ xem và thao tác với dữ liệu của mình

## Troubleshooting

### Lỗi "ERR_CONNECTION_REFUSED"

**Nguyên nhân**: Backend server chưa chạy

**Giải pháp**: 
- Chạy `npm run dev:server` trong terminal riêng
- Hoặc chạy `npm run dev:all` để chạy cả 2 server

### Lỗi "Portfolio not found"

- Database sẽ tự động tạo khi chạy backend lần đầu
- Đảm bảo backend server đang chạy
- Đăng xuất và đăng nhập lại

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

