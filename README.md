# Bitcoin Trading Platform

Ứng dụng web cho phép người dùng mua và bán Bitcoin với giá thời gian thực, theo dõi portfolio và lịch sử giao dịch.

## Tính năng

- ✅ Đăng ký/Đăng nhập người dùng với Supabase Auth
- ✅ Xem giá Bitcoin thời gian thực với biểu đồ giá
- ✅ **Mua Bitcoin**: Sử dụng số dư USD để mua Bitcoin
- ✅ **Bán Bitcoin**: Bán Bitcoin để nhận USD
- ✅ Theo dõi Portfolio (số dư BTC, USD, tổng giá trị)
- ✅ Lịch sử giao dịch chi tiết
- ✅ Validation đầy đủ và ACID compliance

## Công nghệ sử dụng

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Icons**: Lucide React
- **Bitcoin Price**: Mock data với giá cập nhật mỗi 3 giây

## Yêu cầu hệ thống

- Node.js >= 16.x
- npm >= 8.x
- Tài khoản Supabase (miễn phí)

## Hướng dẫn Setup

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd project
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Setup Supabase

1. Truy cập [Supabase](https://supabase.com) và tạo tài khoản (nếu chưa có)
2. Tạo một project mới
3. Vào **SQL Editor** và chạy migration file:
   - File: `supabase/migrations/20251028063832_create_bitcoin_trading_tables.sql`
   - Copy toàn bộ nội dung file và paste vào SQL Editor, sau đó click **Run**

### Bước 4: Lấy Supabase Credentials

1. Vào **Settings** > **API** trong Supabase Dashboard
2. Copy các thông tin sau:
   - **Project URL** (Project URL)
   - **anon/public key** (API Key - anon public)

### Bước 5: Tạo file .env

Tạo file `.env` ở root của project với nội dung:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Lưu ý**: Thay thế `your_supabase_project_url` và `your_supabase_anon_key` bằng giá trị thực từ Supabase Dashboard.

Ví dụ:
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Bước 6: Chạy ứng dụng

#### Development mode

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

#### Build production

```bash
npm run build
```

Build files sẽ được tạo trong thư mục `dist/`

#### Preview production build

```bash
npm run preview
```

## Hướng dẫn sử dụng

### Đăng ký tài khoản

1. Mở ứng dụng trong trình duyệt
2. Click vào "Don't have an account? Sign up"
3. Nhập đầy đủ thông tin:
   - **Full Name**: Tên đầy đủ
   - **Email**: Email hợp lệ
   - **Password**: Mật khẩu (tối thiểu 6 ký tự)
4. Click **Sign Up**
5. Tài khoản mới sẽ được tạo với **$10,000 USD** và **0 BTC** làm số dư ban đầu

### Đăng nhập

1. Nhập **Email** và **Password**
2. Click **Sign In**

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
project/
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
│   │   └── supabase.ts      # Supabase client và types
│   ├── App.tsx              # Component chính
│   └── main.tsx             # Entry point
├── supabase/
│   └── migrations/          # Database migrations
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

- **Row Level Security (RLS)**: Tất cả tables có RLS enabled
- **Authentication**: Chỉ user đã đăng nhập mới có thể giao dịch
- **Data Isolation**: Mỗi user chỉ xem và thao tác với dữ liệu của mình

## Troubleshooting

### Lỗi "Invalid API key" hoặc "Failed to fetch"

- Kiểm tra file `.env` đã được tạo đúng chưa
- Kiểm tra `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` đúng chưa
- Restart dev server sau khi thay đổi `.env`

### Lỗi "Portfolio not found"

- Đảm bảo đã chạy migration file trong Supabase
- Kiểm tra RLS policies đã được tạo đúng chưa
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

- `npm run dev`: Chạy development server
- `npm run build`: Build production
- `npm run preview`: Preview production build
- `npm run lint`: Chạy ESLint
- `npm run typecheck`: Kiểm tra TypeScript types

## License

MIT

## Support

Nếu gặp vấn đề, vui lòng tạo issue trên repository hoặc liên hệ maintainer.

