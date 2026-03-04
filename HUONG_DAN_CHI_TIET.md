# 🎀 Hướng Dẫn Chi Tiết Chạy NAILS & BEAUTY PARADISE Trên Máy Tính Cá Nhân

---

## 📋 Mục Lục

1. [Bước 1: Cài Đặt Node.js](#bước-1-cài-đặt-nodejs)
2. [Bước 2: Cài Đặt MySQL](#bước-2-cài-đặt-mysql)
3. [Bước 3: Cài Đặt Git](#bước-3-cài-đặt-git)
4. [Bước 4: Clone Project](#bước-4-clone-project)
5. [Bước 5: Cài Dependencies](#bước-5-cài-dependencies)
6. [Bước 6: Tạo Database MySQL](#bước-6-tạo-database-mysql)
7. [Bước 7: Tạo File .env.local](#bước-7-tạo-file-envlocal)
8. [Bước 8: Push Database Schema](#bước-8-push-database-schema)
9. [Bước 9: Chạy Dev Server](#bước-9-chạy-dev-server)
10. [Bước 10: Truy Cập Website](#bước-10-truy-cập-website)

---

## Bước 1: Cài Đặt Node.js

### Cho Windows:

1. Vào https://nodejs.org/
2. Tải **LTS version** (khuyến nghị)
3. Chạy file `.msi` vừa tải
4. Nhấn **Next** cho đến khi xong
5. Mở **Command Prompt** (hoặc PowerShell) và kiểm tra:

```bash
node --version
npm --version
```

**Kết quả mong đợi:**
```
v18.20.0  (hoặc cao hơn)
10.5.0    (hoặc cao hơn)
```

### Cho Mac:

1. Mở **Terminal**
2. Cài Homebrew trước (nếu chưa có):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

3. Cài Node.js:
```bash
brew install node
```

4. Kiểm tra:
```bash
node --version
npm --version
```

### Cho Linux (Ubuntu/Debian):

1. Mở **Terminal**
2. Cập nhật package manager:
```bash
sudo apt update
```

3. Cài Node.js:
```bash
sudo apt install nodejs npm
```

4. Kiểm tra:
```bash
node --version
npm --version
```

---

## Bước 2: Cài Đặt MySQL

### Cho Windows:

1. Vào https://dev.mysql.com/downloads/mysql/
2. Chọn **MySQL Community Server**
3. Tải **Windows (x86, 64-bit) MSI Installer**
4. Chạy file `.msi`
5. Chọn **Setup Type**: `Server Machine`
6. Chọn **MySQL Server Port**: `3306` (mặc định)
7. Chọn **MySQL Server Character Set**: `utf8mb4`
8. Nhập **MySQL Root Password** (ghi nhớ password này!)
9. Hoàn thành cài đặt

**Kiểm tra cài đặt:**
- Mở **Command Prompt**
- Chạy:
```bash
mysql --version
```

### Cho Mac:

1. Mở **Terminal**
2. Cài qua Homebrew:
```bash
brew install mysql
```

3. Khởi động MySQL:
```bash
brew services start mysql
```

4. Kiểm tra:
```bash
mysql --version
```

### Cho Linux (Ubuntu/Debian):

1. Mở **Terminal**
2. Cài MySQL:
```bash
sudo apt install mysql-server
```

3. Khởi động MySQL:
```bash
sudo systemctl start mysql
```

4. Kiểm tra:
```bash
mysql --version
```

---

## Bước 3: Cài Đặt Git

### Cho Windows:

1. Vào https://git-scm.com/download/win
2. Tải file `.exe`
3. Chạy file và nhấn **Next** cho đến khi xong
4. Mở **Command Prompt** và kiểm tra:
```bash
git --version
```

### Cho Mac:

1. Mở **Terminal**
2. Cài Git:
```bash
brew install git
```

3. Kiểm tra:
```bash
git --version
```

### Cho Linux (Ubuntu/Debian):

1. Mở **Terminal**
2. Cài Git:
```bash
sudo apt install git
```

3. Kiểm tra:
```bash
git --version
```

---

## Bước 4: Clone Project

### Tất cả hệ điều hành:

1. Mở **Terminal** hoặc **Command Prompt**
2. Chuyển đến thư mục bạn muốn lưu project:

```bash
# Ví dụ: chuyển đến Desktop
cd Desktop
```

3. Clone project:

```bash
git clone https://github.com/your-username/nails-beauty-paradise.git
```

*(Thay `your-username` bằng username GitHub của bạn)*

4. Chuyển vào thư mục project:

```bash
cd nails-beauty-paradise
```

**Kết quả:** Bạn sẽ thấy thư mục `nails-beauty-paradise` với các file project bên trong.

---

## Bước 5: Cài Dependencies

### Tất cả hệ điều hành:

1. Đảm bảo bạn đang ở trong thư mục project:

```bash
cd nails-beauty-paradise
```

2. Cài tất cả dependencies:

```bash
npm install
```

**Chờ khoảng 5-10 phút** để tải và cài đặt tất cả packages.

**Kết quả mong đợi:**
```
added 500+ packages
```

---

## Bước 6: Tạo Database MySQL

### Cho Windows:

1. Mở **Command Prompt**
2. Đăng nhập vào MySQL:

```bash
mysql -u root -p
```

3. Nhập password MySQL (password bạn đã tạo ở Bước 2)
4. Chạy các lệnh sau:

```sql
CREATE DATABASE nails_beauty_paradise;
CREATE USER 'nails_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON nails_beauty_paradise.* TO 'nails_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Cho Mac/Linux:

1. Mở **Terminal**
2. Đăng nhập vào MySQL:

```bash
mysql -u root -p
```

3. Nhập password MySQL
4. Chạy các lệnh SQL giống như trên

**Giải thích các lệnh:**
- `CREATE DATABASE`: Tạo database mới
- `CREATE USER`: Tạo user mới
- `GRANT ALL PRIVILEGES`: Cấp quyền truy cập
- `FLUSH PRIVILEGES`: Cập nhật quyền

---

## Bước 7: Tạo File .env.local

### Tất cả hệ điều hành:

1. Mở **Text Editor** (Notepad, VS Code, v.v.)
2. Tạo file mới với nội dung sau:

```env
# Database Connection
DATABASE_URL="mysql://nails_user:password123@localhost:3306/nails_beauty_paradise"

# JWT Secret (tạo một chuỗi ngẫu nhiên, tối thiểu 32 ký tự)
JWT_SECRET="your_random_secret_key_here_minimum_32_characters_long_abcdefghijklmnop"

# App Configuration
VITE_APP_TITLE="NAILS & BEAUTY PARADISE"

# Optional - Để trống nếu không dùng
VITE_APP_ID=""
OAUTH_SERVER_URL=""
VITE_OAUTH_PORTAL_URL=""
OWNER_NAME="Nails Paradise"
OWNER_OPEN_ID=""
BUILT_IN_FORGE_API_URL=""
BUILT_IN_FORGE_API_KEY=""
VITE_FRONTEND_FORGE_API_URL=""
VITE_FRONTEND_FORGE_API_KEY=""
VITE_ANALYTICS_ENDPOINT=""
VITE_ANALYTICS_WEBSITE_ID=""
VITE_APP_LOGO=""
```

3. **Lưu file** với tên: `.env.local` (chú ý dấu chấm ở đầu)
4. **Lưu vào thư mục gốc** của project (cùng cấp với `package.json`)

**Cách lưu file `.env.local`:**

**Windows (Notepad):**
- Chọn **File** → **Save As**
- Tên file: `.env.local`
- Loại file: **All Files**
- Vị trí: Thư mục gốc của project

**Mac/Linux (Terminal):**
```bash
nano .env.local
```
- Dán nội dung trên
- Nhấn `Ctrl+X` → `Y` → `Enter`

---

## Bước 8: Push Database Schema

### Tất cả hệ điều hành:

1. Mở **Terminal** hoặc **Command Prompt**
2. Đảm bảo bạn ở trong thư mục project:

```bash
cd nails-beauty-paradise
```

3. Chạy lệnh:

```bash
npm run db:push
```

**Chờ khoảng 1-2 phút** để tạo tất cả bảng trong database.

**Kết quả mong đợi:**
```
✓ Database schema created successfully
✓ Tables created: users, bookings, blog_posts, email_history, scheduled_emails
```

---

## Bước 9: Chạy Dev Server

### Tất cả hệ điều hành:

1. Mở **Terminal** hoặc **Command Prompt**
2. Đảm bảo bạn ở trong thư mục project:

```bash
cd nails-beauty-paradise
```

3. Chạy dev server:

```bash
npm run dev
```

**Chờ khoảng 10-15 giây** để server khởi động.

**Kết quả mong đợi:**
```
VITE v7.1.9 ready in 665 ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

**Lưu ý:** 
- Đừng đóng Terminal này, nó sẽ chạy liên tục
- Nếu bạn muốn dừng server, nhấn `Ctrl+C`

---

## Bước 10: Truy Cập Website

### Trên Máy Tính Cá Nhân:

Mở **Web Browser** (Chrome, Firefox, Safari, v.v.) và vào các URL sau:

| Trang | URL | Mô Tả |
|-------|-----|-------|
| **Homepage** | http://localhost:3000 | Trang chủ |
| **Services** | http://localhost:3000/services | Dịch vụ & giá |
| **Booking** | http://localhost:3000/booking | Đặt lịch hẹn |
| **Nail Designer** | http://localhost:3000/nail-designer | Thiết kế móng tay |
| **Blog** | http://localhost:3000/blog | Blog & tin tức |
| **Admin** | http://localhost:3000/admin | Quản lý (cần login) |

### Trên Máy Khác (Cùng Mạng):

1. Tìm IP của máy chạy server:

**Windows:**
```bash
ipconfig
```
Tìm **IPv4 Address** (ví dụ: `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
```
hoặc
```bash
hostname -I
```

2. Trên máy khác, vào:
```
http://192.168.1.100:3000
```

---

## 🎯 Các Tính Năng Chính

### 1. **Homepage** (http://localhost:3000)
- Giới thiệu salon
- Danh sách dịch vụ
- Hình ảnh gallery
- Thông tin liên hệ

### 2. **Services** (http://localhost:3000/services)
- Danh sách đầy đủ dịch vụ
- Giá cả chi tiết
- Thời gian thực hiện

### 3. **Booking** (http://localhost:3000/booking)
- Chọn dịch vụ
- Chọn ngày & giờ
- Chọn nhân viên
- Ghi chú thêm
- Xác nhận đặt lịch

### 4. **Nail Designer** (http://localhost:3000/nail-designer)
- Thiết kế móng tay interactif
- 15+ màu sắc
- 6 kiểu họa tiết
- 10 mẫu thiết kế AI
- Tải xuống & chia sẻ

### 5. **Blog** (http://localhost:3000/blog)
- Bài viết mẫu
- Tìm kiếm & lọc theo danh mục
- Xem chi tiết bài viết

### 6. **Admin Dashboard** (http://localhost:3000/admin)
- Quản lý booking
- Quản lý blog
- Gửi email nhắc nhở
- Lên lịch gửi email tùy chỉnh
- Xem lịch sử email

---

## 🔧 Troubleshooting (Giải Quyết Lỗi)

### Lỗi 1: "npm: command not found"

**Nguyên nhân:** Node.js chưa được cài đặt hoặc không được thêm vào PATH

**Giải pháp:**
1. Cài lại Node.js từ https://nodejs.org/
2. Khởi động lại máy tính
3. Mở Terminal mới và thử lại

---

### Lỗi 2: "ECONNREFUSED" hoặc "Cannot connect to database"

**Nguyên nhân:** MySQL server không chạy hoặc DATABASE_URL sai

**Giải pháp:**

**Windows:**
```bash
# Kiểm tra MySQL service
sc query MySQL80

# Nếu không chạy, khởi động nó
net start MySQL80
```

**Mac:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

Hoặc kiểm tra file `.env.local`:
```env
DATABASE_URL="mysql://nails_user:password123@localhost:3306/nails_beauty_paradise"
```

---

### Lỗi 3: "Port 3000 already in use"

**Nguyên nhân:** Có chương trình khác đang dùng port 3000

**Giải pháp 1:** Tìm và tắt chương trình đó

**Giải pháp 2:** Chạy trên port khác
```bash
PORT=3001 npm run dev
```

Sau đó vào http://localhost:3001

---

### Lỗi 4: "Cannot find module"

**Nguyên nhân:** Dependencies chưa được cài đặt đầy đủ

**Giải pháp:**
```bash
npm install
```

---

### Lỗi 5: "Cannot find database"

**Nguyên nhân:** Database schema chưa được tạo

**Giải pháp:**
```bash
npm run db:push
```

---

### Lỗi 6: "ENOENT: no such file or directory, open '.env.local'"

**Nguyên nhân:** File `.env.local` không tồn tại

**Giải pháp:**
1. Tạo file `.env.local` (xem Bước 7)
2. Dán nội dung config
3. Lưu file vào thư mục gốc của project

---

## 📚 Các Lệnh Hữu Ích

```bash
# Khởi động dev server
npm run dev

# Tạo/cập nhật database schema
npm run db:push

# Chạy tests
npm test

# Format code
npm run format

# Build cho production
npm run build

# Chạy background worker (scheduled emails)
npm run worker:scheduled-emails
```

---

## 🚀 Bước Tiếp Theo

Sau khi chạy thành công:

1. **Khám phá Admin Dashboard** - Quản lý booking và blog
2. **Thử Nail Designer** - Thiết kế móng tay
3. **Tạo Booking** - Đặt lịch hẹn
4. **Gửi Email** - Test email notifications

---

## ❓ Cần Giúp Đỡ?

Nếu bạn gặp vấn đề:

1. Kiểm tra lại các bước trên
2. Xem phần **Troubleshooting**
3. Kiểm tra Terminal/Console để xem error messages
4. Đảm bảo tất cả services (Node.js, MySQL) đang chạy

---

## 🎉 Chúc Mừng!

Bạn đã cài đặt thành công **NAILS & BEAUTY PARADISE**!

Hãy bắt đầu khám phá website và tùy chỉnh theo nhu cầu của bạn.

---

**Phiên bản:** 1.0.0  
**Cập nhật lần cuối:** 2026-03-04  
**Hỗ trợ:** Xem file `LOCAL_SETUP_GUIDE.md` để biết thêm chi tiết
