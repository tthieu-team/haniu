# Database Overview & Purpose (Haniu Gift Shop E-commerce backend)

Hệ thống cơ sở dữ liệu của dự án Haniu được thiết kế theo chuẩn **Production-Ready**, tối ưu hóa riêng cho mô hình cửa hàng quà tặng cao cấp (quà tặng dịp lễ, sinh nhật, quốc khánh, đồ lưu niệm yêu nước, quà lưu niệm cá nhân hóa). Hệ thống kết hợp giữa độ tin cậy của **PostgreSQL** (ACID, JSONB) và hiệu suất tìm kiếm tối đa của **Elasticsearch**.

---

## 1. Mục tiêu Thiết kế (Design Objectives)
* **Cá nhân hóa sản phẩm (Personalized Gifts):** Hỗ trợ khách hàng gửi thông tin khắc tên, in ảnh, viết thiệp chúc mừng riêng cho từng món quà (`customizationInfo`) ngay khi thêm vào giỏ hàng hoặc đặt hàng.
* **Tìm kiếm theo Dịp lễ & Đối tượng (Occasion & Recipient Filtering):** Cho phép người dùng dễ dàng lọc và tìm kiếm quà tặng theo dịp (Sinh nhật, Valentine, Quốc khánh 2-9, 20-11) và đối tượng nhận (Bạn trai, Bạn gái, Thầy cô, Bố mẹ, Đối tác).
* **100% Động hóa (Fully Dynamic Catalog):** Hỗ trợ thêm/bớt thông số kỹ thuật sản phẩm (chất liệu, kích thước hộp quà, nguồn gốc) và thay đổi template giao diện Next.js cho từng sản phẩm mà không cần sửa code Java hay DDL Alter.
* **Mua hàng không cần đăng nhập (Guest Checkout):** Hỗ trợ mua quà nhanh bằng cách bỏ qua đăng nhập, lưu giỏ hàng qua `sessionId` và tra cứu đơn hàng bảo mật bằng mã đơn + điện thoại/email hoặc link token (`trackingToken`).
* **An toàn khi săn Sale (High Concurrency Protection):** Khóa lạc quan (`@Version`) ngăn chặn lố số lượng tồn kho của các set quà hoặc sử dụng quá lượt mã giảm giá vào các đợt lễ lớn.
* **Tối ưu hóa Truy vấn (Optimized Performance):** Lập chỉ mục (Index) toàn bộ các trường khóa ngoại, cờ trạng thái, slug dịp lễ/đối tượng để hệ thống đạt tốc độ phản hồi tối đa.

---

## 2. Bản đồ Các Thực thể (Entity Relationship Overview)

Hệ thống được chia làm **7 Phân hệ chính (Modules)**:

### 1. Phân hệ Người dùng (User Management)
* **`User`**: Lưu thông tin khách hàng, phân quyền (`role`: `USER`, `ADMIN`), trạng thái tài khoản (`ACTIVE`, `PENDING`, `BLOCKED`).
* **`RefreshToken`**: Quản lý phiên đăng nhập lâu dài bằng JWT Refresh Token (hỗ trợ thu hồi token khi đăng xuất).
* **`UserAddress`**: Sổ địa chỉ của người dùng (hỗ trợ địa chỉ mặc định, kinh độ/vĩ độ định vị).

### 2. Phân hệ Sản phẩm & Danh mục (Product Catalog - *Trọng tâm thiết kế*)
* **`Product`**: Thực thể sản phẩm gốc. Chứa các thông tin cốt lõi (SKU, giá, bộ sưu tập, SEO Metadata, và cấu hình layout).
* **`ProductVariant`**: Biến thể sản phẩm (VD: Hộp quà Size S/M/L, Màu đỏ/xanh). Mỗi biến thể có SKU, giá bán lẻ, tồn kho và ảnh riêng biệt.
* **`ProductMedia`**: Lưu danh sách ảnh và video giới thiệu sản phẩm quà tặng, phân loại theo định dạng (`IMAGE` hoặc `VIDEO`).
* **`Occasion`**: Các dịp tặng quà (VD: Sinh nhật, Lễ tình nhân, Quốc khánh 2-9, Ngày nhà giáo 20-11, Tết cổ truyền).
* **`Recipient`**: Đối tượng nhận quà (VD: Bạn trai, Bạn gái, Thầy cô, Bố mẹ, Đối tác, Trẻ em).
* **`Category`**: Danh mục sản phẩm (ví dụ: Ly sứ, Sổ da, Hoa sáp, Combo quà tặng).
* **`Brand`**: Thương hiệu/Nhà cung cấp.
* **`Collection`**: Các bộ sưu tập quà tặng (ví dụ: BST Quà tặng gỗ khắc tên, BST Đồ lưu niệm yêu nước).
* **`AttributeDefinition`**: Định nghĩa cấu trúc động. Xác định sản phẩm ở danh mục nào có những trường thuộc tính gì (VD: chất liệu, kích thước hộp quà).

### 3. Phân hệ Giỏ hàng & Cá nhân hóa (Cart System)
* **`Cart`**: Giỏ hàng của người dùng (cho phép liên kết với đăng nhập hoặc khách vãng lai qua `sessionId`).
* **`CartItem`**: Chi tiết sản phẩm trong giỏ hàng. Đặc biệt chứa trường `customizationInfo` để lưu thông tin cá nhân hóa (khắc tên, ghi thiệp) của món quà.

### 4. Phân hệ Đơn hàng & Thanh toán (Orders & Payments)
* **`Order`**: Lưu thông tin đơn hàng. Hỗ trợ mua nhanh không cần tài khoản, tự sinh `trackingToken` để tra cứu đơn.
* **`OrderItem`**: Snapshot sản phẩm tại thời điểm mua, bao gồm cả trường lưu vết thông tin cá nhân hóa quà tặng (`customizationInfo`).
* **`Payment`**: Giao dịch thanh toán. Liên kết 1-1 với đơn hàng, lưu mã giao dịch của các cổng thanh toán (`MOMO`, `VNPAY`, `STRIPE`) và log phản hồi từ webhook.

### 5. Phân hệ Khách hàng & Feedback (Marketing & Engagements)
* **`Coupon`**: Mã giảm giá cho các đợt săn sale, lễ hội. Có điều kiện áp dụng nghiêm ngặt và số lượt giới hạn.
* **`Banner`**: Ảnh banner quảng cáo sự kiện/ngày lễ theo vị trí hiển thị.

### 6. Phân hệ Phản hồi & Tương tác (Customer Feedback)
* **`Review`**: Đánh giá và bình luận sản phẩm kèm hình ảnh.
* **`Wishlist`**: Danh sách sản phẩm yêu thích (tiện để khách hàng lưu lại làm gợi ý quà tặng sau này).

### 7. Phân hệ Hệ thống (System Operations)
* **`Notification`**: Thông báo đẩy gửi đến người dùng.
* **`AuditLog`**: Ghi vết lịch sử thao tác của các tài khoản Admin để bảo mật dữ liệu.

---

## 3. Kiến trúc Cột Động JSONB (Dynamic Columns)

Để tránh việc sửa đổi schema database khi mở rộng sản phẩm và dịch vụ quà tặng, dự án ứng dụng cột **JSONB** của PostgreSQL:

| Thực thể | Tên Cột | Kiểu Dữ Liệu | Mục Đích |
| :--- | :--- | :--- | :--- |
| **`Product`** | `specifications` | JSONB | Lưu giá trị các thuộc tính động được cấu hình bởi Admin (VD: `{"box_size": "20x20x10cm", "material": "Leather"}`). |
| **`Product`** | `layout_config` | JSONB | Lưu trữ thiết kế tuỳ biến cho trang chi tiết (màu sắc, banner riêng, thứ tự hiển thị component). |
| **`ProductVariant`** | `specifications` | JSONB | Lưu trữ các thông số đặc thù của riêng biến thể đó. |
| **`CartItem` / `OrderItem`** | `customization_info` | JSONB | Lưu thông tin cá nhân hóa quà tặng (VD: `{"engraving_text": "Tặng cô Thảo 20-11", "gift_card_message": "Chúc cô luôn vui vẻ!"}`). |
| **`Payment`** | `raw_response` | JSONB | Lưu toàn bộ payload phản hồi từ IPN/Webhook của cổng thanh toán để đối soát khi có lỗi xảy ra. |
| **`AuditLog`** | `old_data` / `new_data` | JSONB | Lưu trạng thái dữ liệu trước và sau khi bị cập nhật bởi Admin để đối chiếu. |

---

## 4. Danh sách Index Tối ưu hóa Truy vấn (Database Indexing)

Tất cả các thực thể đã được trang bị các Index vật lý nhằm gia tốc tốc độ truy vấn ở môi trường Production:

1. **`users`**: index theo `email`, `phone`, `role`, `status` để xác thực siêu tốc.
2. **`refresh_tokens`**: index theo `token` và `user_id` để xác minh phiên nhanh nhất.
3. **`categories` / `brands` / `collections`**: index theo `slug` và cờ trạng thái `is_active` để tải menu và trang danh mục tức thì.
4. **`occasions` / `recipients`**: index theo `slug` và `is_active` để tối ưu các trang lọc quà tặng theo dịp lễ/đối tượng nhận.
5. **`products`**: index theo `slug`, `sku`, `category_id`, `brand_id`, `collection_id`, `price`, `status`, `is_featured`, `is_new`, và `created_at`.
6. **`product_variants`**: index theo `product_id` và `is_active` để hiển thị nhanh các tùy chọn sản phẩm.
7. **`orders`**: index theo `order_code`, `tracking_token`, `customer_phone`, `customer_email`, `payment_status`, `order_status`, và `created_at`.
8. **`coupons`**: index theo `code` và cờ `is_active` giúp áp dụng voucher giảm giá tức thì khi thanh toán.
