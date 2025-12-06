# 🚀 Hướng Dẫn Setup với SQLite

Ứng dụng đã được chuyển đổi từ Supabase sang SQLite. Tất cả dữ liệu được lưu trong file `server/database.sqlite`.

---

## 📋 Yêu Cầu

- Node.js >= 16.x
- npm >= 8.x

---

## 🔧 Cài Đặt

### Bước 1: Cài đặt Dependencies

```bash
npm install
```

### Bước 2: Tạo file .env (Tùy chọn)

Tạo file `.env` ở root project:

```env
VITE_API_URL=http://localhost:3001
```

Nếu không tạo, mặc định sẽ dùng `http://localhost:3001`

### Bước 3: Chạy Backend Server

Mở terminal 1:

```bash
npm run dev:server
```

Server sẽ chạy tại: `http://localhost:3001`

### Bước 4: Chạy Frontend

Mở terminal 2:

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

**Hoặc chạy cả 2 cùng lúc:**

```bash
npm run dev:all
```

---

## 📁 Cấu Trúc

```
trading_coin/
├── server/
│   ├── index.js          # Backend Express server
│   └── database.sqlite  # SQLite database (tự động tạo)
├── src/
│   ├── lib/
│   │   └── api.ts       # API client (thay thế Supabase)
│   └── ...
└── package.json
```

---

## 🗄️ Database

- **File database**: `server/database.sqlite`
- **Tự động tạo**: Khi chạy server lần đầu
- **Tables**:
  - `users` - Thông tin user
  - `portfolios` - Số dư BTC/USD
  - `transactions` - Lịch sử giao dịch

---

## 🔐 Authentication

- **JWT Token**: Lưu trong localStorage
- **Password**: Được hash bằng bcrypt
- **Session**: 7 ngày

---

## 🛠️ Scripts

- `npm run dev` - Chạy frontend
- `npm run dev:server` - Chạy backend
- `npm run dev:all` - Chạy cả frontend và backend
- `npm run build` - Build production

---

## ⚠️ Lưu Ý

1. **Database file**: File `database.sqlite` sẽ được tạo tự động khi chạy server lần đầu
2. **Backup**: Nếu muốn backup, copy file `server/database.sqlite`
3. **Reset**: Xóa file `database.sqlite` để reset database
4. **Port**: Đảm bảo port 3001 không bị chiếm bởi ứng dụng khác

---

## 🐛 Troubleshooting

### Lỗi "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Lỗi "Port 3001 already in use"

- Đổi port trong `server/index.js` (dòng `const PORT = 3001`)
- Hoặc kill process đang dùng port 3001

### Database không tạo

- Kiểm tra quyền ghi trong thư mục `server/`
- Kiểm tra console log khi chạy server

---

**Chúc bạn thành công!** 🎉

