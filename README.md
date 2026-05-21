# Haniu - Premium Gift Shop E-Commerce Platform

Haniu là một nền tảng thương mại điện tử chuyên biệt dành cho **Quà tặng Cao cấp & Đồ lưu niệm** (Quà tặng sự kiện, sinh nhật, ngày lễ như Valentine, 20-11, quà tặng cá nhân hóa, đồ lưu niệm quốc gia/yêu nước, set combo quà tặng). 

Hệ thống được thiết kế theo kiến trúc **Modular Monolith**, kết hợp sức mạnh lưu trữ tin cậy của **Spring Boot + PostgreSQL** và hiệu năng tìm kiếm vượt trội của **Elasticsearch**.

---

## 🚀 Các Tính Năng Nổi Bật (Key Features)

* 🎁 **Cá nhân hóa quà tặng (Gift Personalization):** Khách hàng dễ dàng ghi yêu cầu khắc tên, in hình, chọn màu gói quà, hoặc viết thiệp chúc mừng riêng biệt (`customization_info`) ngay khi thêm sản phẩm vào giỏ hàng hoặc thanh toán.
* 📅 **Lọc quà tặng theo Dịp lễ & Đối tượng nhận (Occasion & Recipient Filters):** Bộ lọc thông minh cho phép phân loại nhanh quà tặng theo các ngày lễ lớn (Sinh nhật, Quốc khánh 2-9, 20-11, 8-3) và đối tượng nhận (Bạn trai, Bạn gái, Thầy cô, Bố mẹ, Đối tác).
* ⚙️ **Thuộc tính động 100% (Fully Dynamic Attribute Engine):** Quản trị viên tự định nghĩa cấu trúc thuộc tính (kích thước hộp quà, chất liệu giấy gói, nguồn gốc) trên giao diện quản trị Admin theo danh mục sản phẩm mà **không cần đổi cấu trúc Database hay sửa code Java**.
* 🛒 **Mua nhanh vãng lai (Guest Checkout & Tracking):** Khách hàng vãng lai có thể mua quà nhanh chóng mà không cần đăng nhập. Tra cứu tình trạng đơn hàng bảo mật qua số điện thoại/email kèm mã đơn, hoặc link token (`trackingToken`).
* ⚡ **Tìm kiếm siêu tốc (Elasticsearch Integration):** Đồng bộ dữ liệu danh mục, thuộc tính động, và thông số sản phẩm sang Elasticsearch để hỗ trợ tìm kiếm mờ (Fuzzy Search), gợi ý tự động (AutoComplete), và lọc sản phẩm.
* 🛡️ **An toàn chống tranh chấp (High Concurrency & Flash Sale Protection):** Tích hợp khóa lạc quan (`@Version` Lock) và các câu lệnh SQL nguyên tử (Atomic updates) đảm bảo an toàn tuyệt đối cho kho hàng (Stock) và lượt dùng mã giảm giá (Coupon usage limit) khi lượng truy cập đột biến.

---

## 🛠️ Công Nghệ Sử Dụng (Technology Stack)

### Backend (Thư mục `/backend`)
* **Framework:** Spring Boot 3.x (Java 21)
* **Data Access:** Spring Data JPA, Hibernate (Tối ưu hóa kiểu dữ liệu PostgreSQL JSONB)
* **Search Engine:** Spring Data Elasticsearch (Tích hợp Elasticsearch 8.x)
* **Database:** PostgreSQL (Supabase / Local)
* **Security:** Spring Security, JWT (AccessToken & RefreshToken), UUID làm khóa chính tăng tính bảo mật.

### Frontend (Thư mục `/front-haniu`)
* **Framework:** Next.js (React), TypeScript
* **Styling:** TailwindCSS, Vanilla CSS cho các component tùy biến.
* **State Management:** React Context / Redux Toolkit.
* **Dynamic Layout Rendering:** Hỗ trợ render linh hoạt trang chi tiết sản phẩm theo cấu hình layout (`layoutTemplate` & `layoutConfig`) trả về từ Backend.

---

## 📂 Cấu Trúc Dự Án (Project Directory Structure)

```text
haniu/
├── backend/                       # Source code Backend (Spring Boot)
│   ├── src/main/java/.../haniu/
│   │   ├── document/              # Elasticsearch Documents (ProductDocument...)
│   │   ├── entity/                # Các thực thể JPA (PostgreSQL)
│   │   │   ├── cart/              # Cart, CartItem
│   │   │   ├── feedback/          # Review, Wishlist
│   │   │   ├── marketing/         # Coupon, Banner
│   │   │   ├── order/             # Order, OrderItem, Payment
│   │   │   ├── product/           # Product, Variant, Occasion, Recipient, Category...
│   │   │   ├── system/            # Notification, AuditLog
│   │   │   └── user/              # User, RefreshToken, UserAddress
│   │   └── repository/            # JPA & Elasticsearch Repositories
│   └── pom.xml                    # Maven dependencies configuration
├── front-haniu/                   # Source code Frontend (Next.js)
│   ├── src/                       # Components, Pages, Styles, Utils
│   └── package.json               # Node dependency config
└── DATABASE_OVERVIEW.md           # Tài liệu chi tiết cấu trúc Database
```

---

## ⚙️ Hướng Dẫn Cài Đặt & Khởi Chạy (Installation & Setup)

### Yêu cầu hệ thống (Prerequisites)
* Java JDK 21 trở lên.
* Node.js 18.x trở lên & npm/yarn.
* Docker (Khuyên dùng để chạy nhanh PostgreSQL & Elasticsearch).

### Bước 1: Cấu hình Môi trường
Tạo file cấu hình Database trong `/backend/src/main/resources/application.properties` (hoặc cấu hình các biến môi trường tương ứng):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/haniu_db
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.elasticsearch.uris=http://localhost:9200
```

### Bước 2: Chạy Backend
Di chuyển vào thư mục `/backend` và chạy lệnh Maven:
```bash
# Compile dự án và kiểm tra lỗi
./mvnw clean compile

# Chạy ứng dụng Spring Boot
./mvnw spring-boot:run
```

### Bước 3: Chạy Frontend
Di chuyển vào thư mục `/front-haniu`, cài đặt package và chạy chế độ phát triển:
```bash
# Cài đặt thư viện
npm install

# Khởi chạy dev server (Port mặc định: 3000)
npm run dev
```

---

## 🛡️ Tối Ưu Hóa & Bảo Mật Production
* **Index Chiến lược:** Toàn bộ khóa ngoại, slug liên kết, cờ trạng thái (`is_active`, `is_read`, `is_approved`) đều được đánh index để tối ưu tốc độ truy vấn PostgreSQL dưới 1ms.
* **Cá nhân hóa Giỏ hàng:** Trường `customization_info` dạng JSONB giúp lưu trữ linh hoạt mọi cấu trúc cá nhân hóa mà không làm phình to số lượng bảng trong DB.
* **Đồng bộ hóa Không đồng bộ (Async Sync):** Luồng cập nhật từ database SQL sang Elasticsearch chạy không đồng bộ (hoặc qua Event Listener) giúp giảm thiểu tối đa độ trễ phản hồi (latency) cho User.
