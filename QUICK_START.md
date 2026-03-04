# Quick Start - Chạy NAILS & BEAUTY PARADISE Trong 5 Phút

## Yêu Cầu
- **Node.js v18+**: https://nodejs.org/
- **MySQL Server**: https://dev.mysql.com/downloads/mysql/

---

## Bước 1: Chuẩn Bị (2 phút)

```bash
# Clone project
git clone <repository-url>
cd nails-beauty-paradise

# Cài dependencies
npm install
```

---

## Bước 2: Thiết Lập Database (2 phút)

### Tạo Database MySQL

Mở MySQL Command Line và chạy:

```sql
CREATE DATABASE nails_beauty_paradise;
CREATE USER 'nails_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON nails_beauty_paradise.* TO 'nails_user'@'localhost';
FLUSH PRIVILEGES;
```

### Tạo File `.env.local`

Tạo file `.env.local` ở thư mục gốc:

```env
DATABASE_URL="mysql://nails_user:password123@localhost:3306/nails_beauty-paradise"
JWT_SECRET="your_random_secret_key_min_32_characters_long_here"
VITE_APP_TITLE="NAILS & BEAUTY PARADISE"
```

### Push Database Schema

```bash
npm run db:push
```

---

## Bước 3: Chạy Website (1 phút)

### Terminal 1 - Dev Server
```bash
npm run dev
```

### Terminal 2 - Background Worker (Tùy Chọn)
```bash
npm run worker:scheduled-emails
```

---

## Bước 4: Truy Cập

Mở browser và vào:

- **Homepage**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Booking**: http://localhost:3000/booking
- **Nail Designer**: http://localhost:3000/nail-designer
- **Blog**: http://localhost:3000/blog

---

## Gặp Lỗi?

| Lỗi | Giải Pháp |
|-----|----------|
| "Cannot find module" | `npm install` |
| "ECONNREFUSED" | Kiểm tra MySQL chạy, DATABASE_URL đúng |
| "Port 3000 in use" | `PORT=3001 npm run dev` |
| "Cannot find database" | `npm run db:push` |

---

## Các Trang Chính

| Trang | URL | Mô Tả |
|-------|-----|-------|
| Home | `/` | Trang chủ |
| Services | `/services` | Dịch vụ & giá |
| Booking | `/booking` | Đặt lịch hẹn |
| Designer | `/nail-designer` | Thiết kế móng tay |
| Blog | `/blog` | Blog & tin tức |
| Admin | `/admin` | Quản lý (cần login) |

---

## Tính Năng Chính

✅ **Booking System** - Khách hàng đặt lịch hẹn  
✅ **Admin Dashboard** - Quản lý booking, blog, email  
✅ **Email Notifications** - Xác nhận & nhắc nhở tự động  
✅ **Scheduled Emails** - Lên lịch gửi email tùy chỉnh  
✅ **Nail Designer** - Thiết kế móng tay interactif  
✅ **Blog System** - Quản lý bài viết  

---

## Cần Giúp Đỡ?

Xem file `LOCAL_SETUP_GUIDE.md` để hướng dẫn chi tiết hơn.

---

**Chúc bạn thành công! 🎉**
