# Hướng Dẫn Chạy NAILS & BEAUTY PARADISE Trên Máy Tính Cá Nhân

## Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy cài đặt các phần mềm sau trên máy tính của bạn:

### 1. Node.js (v18 hoặc cao hơn)
- **Windows/Mac/Linux**: Tải từ https://nodejs.org/
- **Kiểm tra cài đặt**: Mở Terminal/Command Prompt và chạy:
  ```bash
  node --version
  npm --version
  ```

### 2. MySQL Server (v5.7 hoặc cao hơn)
- **Windows**: Tải từ https://dev.mysql.com/downloads/mysql/
- **Mac**: Cài đặt qua Homebrew: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server`
- **Kiểm tra cài đặt**: 
  ```bash
  mysql --version
  ```

### 3. Git (để clone project)
- **Windows/Mac/Linux**: Tải từ https://git-scm.com/
- **Kiểm tra cài đặt**: 
  ```bash
  git --version
  ```

---

## Bước 1: Clone Project

Mở Terminal/Command Prompt và chạy:

```bash
git clone <repository-url>
cd nails-beauty-paradise
```

---

## Bước 2: Cài Đặt Dependencies

```bash
npm install
```

Hoặc nếu bạn dùng pnpm:

```bash
pnpm install
```

---

## Bước 3: Thiết Lập Database

### 3.1 Tạo Database MySQL

Mở MySQL Command Line hoặc MySQL Workbench:

```sql
CREATE DATABASE nails_beauty_paradise;
CREATE USER 'nails_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON nails_beauty_paradise.* TO 'nails_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3.2 Tạo File `.env.local`

Tạo file `.env.local` ở thư mục gốc của project:

```env
# Database Connection
DATABASE_URL="mysql://nails_user:your_secure_password@localhost:3306/nails_beauty_paradise"

# JWT Secret (tạo một chuỗi ngẫu nhiên)
JWT_SECRET="your_random_jwt_secret_key_here_min_32_chars"

# OAuth (nếu bạn muốn dùng Manus OAuth, để trống nếu không)
VITE_APP_ID=""
OAUTH_SERVER_URL=""
VITE_OAUTH_PORTAL_URL=""

# Owner Info
OWNER_NAME="Nails Paradise"
OWNER_OPEN_ID=""

# Manus APIs (để trống nếu không dùng)
BUILT_IN_FORGE_API_URL=""
BUILT_IN_FORGE_API_KEY=""
VITE_FRONTEND_FORGE_API_URL=""
VITE_FRONTEND_FORGE_API_KEY=""

# Analytics (tùy chọn)
VITE_ANALYTICS_ENDPOINT=""
VITE_ANALYTICS_WEBSITE_ID=""

# App Title & Logo
VITE_APP_TITLE="NAILS & BEAUTY PARADISE"
VITE_APP_LOGO=""
```

### 3.3 Push Database Schema

```bash
npm run db:push
```

Lệnh này sẽ tạo tất cả các bảng cần thiết trong database.

---

## Bước 4: Chạy Development Server

### 4.1 Chạy Server (Backend + Frontend)

```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

### 4.2 Chạy Background Worker (Scheduled Emails)

Mở một Terminal/Command Prompt mới và chạy:

```bash
npm run worker:scheduled-emails
```

Worker này sẽ kiểm tra và gửi scheduled emails mỗi phút.

---

## Bước 5: Truy Cập Website

### Trên Máy Tính Cá Nhân:
- **Homepage**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Booking Page**: http://localhost:3000/booking
- **Nail Designer**: http://localhost:3000/nail-designer
- **Blog**: http://localhost:3000/blog
- **Services**: http://localhost:3000/services

### Trên Máy Khác (Cùng Mạng):
- Thay `localhost` bằng IP của máy chạy server:
  ```
  http://<your-computer-ip>:3000
  ```
- Tìm IP của bạn:
  - **Windows**: `ipconfig` (tìm IPv4 Address)
  - **Mac/Linux**: `ifconfig` hoặc `hostname -I`

---

## Bước 6: Tạo Admin Account (Tùy Chọn)

Nếu bạn không dùng OAuth, bạn có thể tạo admin account bằng cách:

1. Mở MySQL Command Line
2. Chạy:
   ```sql
   USE nails_beauty_paradise;
   INSERT INTO users (openId, name, email, role, createdAt, updatedAt, lastSignedIn) 
   VALUES ('local-admin-1', 'Admin', 'admin@nailsparadise.com', 'admin', NOW(), NOW(), NOW());
   ```

---

## Bước 7: Chạy Tests (Tùy Chọn)

Để kiểm tra tất cả các tests:

```bash
npm test
```

---

## Troubleshooting

### Lỗi: "Cannot find module"
```bash
npm install
```

### Lỗi: "ECONNREFUSED" (Database Connection)
- Kiểm tra MySQL server đang chạy
- Kiểm tra DATABASE_URL trong `.env.local` chính xác
- Kiểm tra username/password MySQL

### Lỗi: "Port 3000 already in use"
- Tìm process chạy trên port 3000 và kill nó
- Hoặc chạy trên port khác:
  ```bash
  PORT=3001 npm run dev
  ```

### Lỗi: "Cannot find database"
- Chạy `npm run db:push` để tạo tables

### Dev Server không tự reload
- Kiểm tra firewall không block port 3000
- Restart dev server: `npm run dev`

---

## Cấu Trúc Project

```
nails-beauty-paradise/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/         # Trang web
│   │   ├── components/    # React components
│   │   └── index.css      # Global styles
│   └── public/
├── server/                # Backend (Express + tRPC)
│   ├── routers.ts         # API routes
│   ├── db.ts              # Database queries
│   └── email-service.ts   # Email service
├── drizzle/               # Database schema
│   └── schema.ts
├── scheduled-email-worker.mjs  # Background job
├── package.json
├── .env.local             # Environment variables (tạo tay)
└── LOCAL_SETUP_GUIDE.md   # File này
```

---

## Các Lệnh Hữu Ích

| Lệnh | Mô Tả |
|------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build cho production |
| `npm run db:push` | Tạo/update database schema |
| `npm test` | Chạy tests |
| `npm run format` | Format code |
| `npm run worker:scheduled-emails` | Chạy background worker |

---

## Deployment (Lên Server)

Xem file `DEPLOYMENT_GUIDE_WINDOWS.md` để hướng dẫn deploy trên Windows Server.

---

## Hỗ Trợ

Nếu bạn gặp vấn đề:

1. Kiểm tra file `.env.local` có đầy đủ thông tin
2. Kiểm tra MySQL server đang chạy
3. Xem logs trong Terminal
4. Restart dev server: `npm run dev`

---

**Chúc bạn thành công! 🎉**
