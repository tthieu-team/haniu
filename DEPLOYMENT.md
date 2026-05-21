# Hướng Dẫn Triển Khai (Deployment Guide)

Tài liệu này hướng dẫn chi tiết cách cấu hình và triển khai dự án:
1. **Frontend (Next.js)** lên **Vercel**
2. **Backend (Spring Boot)** lên **Render**
3. **Database (PostgreSQL)** lên **Supabase**

---

## 1. Cấu Hình Cơ Sở Dữ Liệu (PostgreSQL → Supabase)

### Bước 1: Khởi tạo database trên Supabase
1. Đăng nhập vào [Supabase](https://supabase.com).
2. Tạo một project mới (ví dụ: `haniu-db`).
3. Đặt mật khẩu cho database của bạn. **Lưu ý ghi nhớ mật khẩu này** (ở đây ký hiệu là `[YOUR-PASSWORD]`).

### Bước 2: Lấy chuỗi kết nối (Connection String)
1. Trong dashboard của Supabase, đi tới **Project Settings** > **Database**.
2. Tìm phần **Connection string** > Chọn tab **URI**.
3. Chuỗi kết nối có định dạng:
   ```text
   postgresql://postgres:[YOUR-PASSWORD]@db.jooagjrmagqhsjyplphg.supabase.co:5432/postgres
   ```
4. Thay thế `[YOUR-PASSWORD]` bằng mật khẩu thật của database của bạn.

---

## 2. Triển Khai Backend (Spring Boot → Render)

Dự án đã được tích hợp **Dockerfile** và cấu hình đọc biến môi trường tự động từ Render.

### Các biến môi trường cần cấu hình trên Render:
Khi tạo Web Service trên Render, hãy thêm các biến sau vào phần **Environment Variables**:

| Biến Môi Trường | Giá Trị ví dụ / Mô tả |
| :--- | :--- |
| `DATABASE_URL_POSTGRE` | `postgresql://postgres:[YOUR-PASSWORD]@db.jooagjrmagqhsjyplphg.supabase.co:5432/postgres` |
| `POSTGRES_USER` | `postgres` |
| `POSTGRES_PASSWORD` | Mật khẩu database Supabase của bạn |
| `PORT` | `8000` (Render sẽ tự động dùng port này để map traffic) |
| `JWT_SECRET` | Chuỗi secret key dùng để ký JWT |
| `JWT_EXPIRES_IN` | `15m` |
| `REFRESH_TOKEN_SECRET`| Chuỗi secret key dùng cho Refresh Token |
| `REFRESH_TOKEN_EXPIRES_IN`| `7d` |

### Các bước deploy trên Render:
1. Đăng nhập vào [Render](https://render.com).
2. Nhấn **New +** > Chọn **Web Service**.
3. Kết nối với kho lưu trữ Github chứa mã nguồn của bạn.
4. Cấu hình các thông tin sau:
   - **Name**: `haniu-backend` (hoặc tên tùy chọn)
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` (Render sẽ tự động phát hiện `Dockerfile` trong thư mục `backend`)
   - **Instance Type**: `Free` (hoặc gói trả phí tùy chọn)
5. Nhấp vào **Advanced** > Thêm các **Environment Variables** ở bảng trên.
6. Nhấn **Create Web Service**.

---

## 3. Triển Khai Frontend (Next.js → Vercel)

Dự án Next.js nằm trong thư mục `front-haniu`.

### Các biến môi trường cần cấu hình trên Vercel:
Thêm các biến sau (từ file `.env` của bạn) vào phần **Environment Variables** trên Vercel:
- `DATABASE_URL` / `MONGODB_URI`
- `JWT_SECRET` / `REFRESH_TOKEN_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `SMTP_USER` / `SMTP_PASS` / `SMTP_HOST` / `SMTP_PORT`
- `GROQ_API_KEY` / `OPENAI_API_KEY`
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
- *Lưu ý*: Có thể thêm biến backend URL để Next.js gọi API: `NEXT_PUBLIC_API_URL=https://<your-render-backend-url>.onrender.com`

### Các bước deploy trên Vercel:
1. Đăng nhập vào [Vercel](https://vercel.com).
2. Nhấp vào **Add New...** > chọn **Project**.
3. Chọn repo GitHub chứa dự án của bạn và nhấn **Import**.
4. Cấu hình dự án trên Vercel:
   - **Framework Preset**: Tự động phát hiện là `Next.js`
   - **Root Directory**: Chọn chỉnh sửa (Edit) và trỏ tới thư mục `front-haniu`.
5. Trong phần **Environment Variables**, thêm các biến ở trên.
6. Nhấp vào **Deploy**.

---

## 4. Kiểm thử môi trường local (Local Development)

1. Cập nhật mật khẩu Supabase hoặc cấu hình database local của bạn trong file `.env` ở thư mục gốc hoặc thư mục con.
2. Để chạy **Spring Boot**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   (Server sẽ chạy tại `http://localhost:8000`)
3. Để chạy **Next.js**:
   ```bash
   cd front-haniu
   npm run dev
   ```
   (Ứng dụng sẽ chạy tại `http://localhost:3000`)
