# 📊 Hướng Dẫn Sử Dụng Slide Thuyết Trình

File `PRESENTATION.md` đã được tạo với format **Marp** - một công cụ tạo slide từ Markdown.

## 🚀 Các Cách Sử Dụng

### **Cách 1: Sử dụng Marp CLI (Khuyến nghị)**

1. **Cài đặt Marp CLI:**
```bash
npm install -g @marp-team/marp-cli
```

2. **Chuyển đổi sang PDF:**
```bash
marp PRESENTATION.md --pdf --output presentation.pdf
```

3. **Chuyển đổi sang PowerPoint:**
```bash
marp PRESENTATION.md --pptx --output presentation.pptx
```

4. **Chuyển đổi sang HTML (có thể trình chiếu trực tiếp):**
```bash
marp PRESENTATION.md --html --output presentation.html
```

### **Cách 2: Sử dụng Marp for VS Code**

1. Cài extension **"Marp for VS Code"** trong VS Code
2. Mở file `PRESENTATION.md`
3. Click nút **"Open Preview"** hoặc nhấn `Ctrl+Shift+V`
4. Click **"Export slide deck"** để xuất PDF/PPTX

### **Cách 3: Sử dụng Marp Web Editor**

1. Truy cập: https://web.marp.app/
2. Copy nội dung từ `PRESENTATION.md`
3. Paste vào editor
4. Export sang PDF/PPTX/HTML

### **Cách 4: Sử dụng Reveal.js (Alternative)**

Nếu muốn dùng Reveal.js, có thể convert markdown sang reveal.js format.

## 📝 Cấu Trúc Slide

File `PRESENTATION.md` bao gồm:

1. **Title Slide** - Giới thiệu dự án
2. **Mục Lục** - Tổng quan nội dung
3. **Giới Thiệu Dự Án** - Mục tiêu và tính năng
4. **Tính Năng Chính** - Chi tiết các features
5. **Công Nghệ Sử Dụng** - Tech stack
6. **Kiến Trúc Hệ Thống** - System architecture
7. **Smart Contract** - Chi tiết contract
8. **Frontend Components** - UI components
9. **Core Services** - Backend services
10. **Điểm Nổi Bật** - Highlights
11. **Quy Trình Giao Dịch** - Trading flow
12. **Demo & Screenshots** - Demo section
13. **Bảo Mật & An Toàn** - Security
14. **Kết Quả Đạt Được** - Results
15. **Bài Học Rút Ra** - Learnings
16. **Hướng Phát Triển** - Future plans
17. **Tài Liệu Tham Khảo** - References
18. **Q&A** - Questions
19. **Kết Luận** - Conclusion

## 🎨 Tùy Chỉnh

Bạn có thể chỉnh sửa file `PRESENTATION.md` để:
- Thêm/bớt slides
- Thay đổi nội dung
- Thay đổi theme (sửa phần `style:` trong frontmatter)
- Thêm hình ảnh: `![alt](image.png)`

## 💡 Tips

- **Thời gian thuyết trình:** Khoảng 15-20 phút
- **Mỗi slide:** Nên trình bày trong 1-2 phút
- **Demo:** Có thể mở ứng dụng và demo trực tiếp
- **Q&A:** Chuẩn bị trả lời các câu hỏi về blockchain, smart contract, security

## 📦 Export Options

Sau khi export, bạn sẽ có:
- **PDF**: Dễ in ấn, chia sẻ
- **PPTX**: Có thể chỉnh sửa trong PowerPoint
- **HTML**: Trình chiếu trực tiếp trong browser (nhấn `F` để fullscreen, `→` để next slide)

