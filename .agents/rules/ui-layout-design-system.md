# HANIU FRONTEND DESIGN SYSTEM & AI CODING GUIDELINES
> **LƯU Ý QUAN TRỌNG CHO TẤT CẢ CÁC AI TRƯỚC KHI CHỈNH SỬA CODE:**
> 1. Đọc kỹ tài liệu kiến trúc giao diện, hệ thống font chữ và icon bên dưới.
> 2. Luôn hỗ trợ đầy đủ **Chế độ Sáng/Tối (Light/Dark Mode)** chuẩn Tailwind CSS.
> 3. Nếu file dài hoặc phức tạp, **phải chia thành các component con** để dễ quản lý.
> 4. **TUYỆT ĐỐI KHÔNG CHẠY các lệnh restart, build hoặc run server** (`npm run dev`, `npm run build`, `next build`, `pm2 restart`, ...).

---

## 1. BỐ CỤC GIAO DIỆN CHUẨN (APPLICATION LAYOUT BLUEPRINT)

Bố cục giao diện quản trị và ứng dụng hiện đại được chia thành 6 khu vực chính:

```
+-----------+---------------+-----------------------------------------------+-------------------+
| LEFT RAIL |    SIDEBAR    |                     TABS                      |   RIGHT SIDEBAR   |
|   (Icon   |  (Contextual  +-----------------------------------------------+   (Inspector /    |
|   Nav)    |   List / Nav) |                 MAIN CONTENT                  |     Preview /     |
|           |               |  - Toolbar & Search Filters                   |     Summary)      |
|  [Home]   | [Select Menu] |  - Content Cards Grid (Image + Specs)         |                   |
|  [Search] | - Item 1      |  - Data Tables / Banners                      |  [Detail Card]    |
|  [Notif]  | - Item 2      |  - Primary Action Canvas                      |  [Media Preview]  |
|  [Docs]   | - Item 3      |                                               |  [Activity List]  |
|  [Config] | ...           |                                               |                   |
|           |               |                                               |                   |
|  [Avatar] |               |                                               |                   |
+-----------+---------------+-----------------------------------------------+-------------------+
|                                      BOTTOM BAR                                               |
|                    (Status Indicators, Action Buttons, Pagination)                    |
+-----------------------------------------------------------------------------------------------+
```

### Chi tiết các thành phần bố cục:
1. **Left Rail (Thanh điều hướng biểu tượng hẹp bên trái):**
   - Chiều rộng cố định (~60px - 72px), viền phải `border-r border-slate-200 dark:border-zinc-800`.
   - Chứa các icon điều hướng chính: Home, Search, Thông báo, Tài liệu/Đơn hàng, Cài đặt hệ thống.
   - Dưới cùng chứa Avatar tài khoản người dùng / Đăng xuất.
2. **Sidebar (Thanh danh sách / Menu ngữ cảnh):**
   - Chiều rộng linh hoạt (~220px - 280px), có thể thu gọn / mở rộng.
   - Phía trên có thanh tìm kiếm / dropdown bộ lọc phân loại.
   - Danh sách các mục (Items) hiển thị dạng list item gồm icon/avatar tròn và thông tin mô tả 2 dòng.
3. **Tabs (Thanh Tab phân mục phía trên):**
   - Đặt ngay trên đầu khu vực nội dung chính, chuyển đổi nhanh giữa các chế độ xem / tiểu mục.
   - Trạng thái Active nổi bật với màu thương hiệu (`bg-rose-600 text-white` hoặc pill viền sáng).
4. **Main Content (Khu vực nội dung trọng tâm):**
   - Không gian hiển thị chính (bảng dữ liệu, lưới thẻ card có hình ảnh, thanh công cụ tìm kiếm, form thao tác).
   - Tự động cuộn (scrollable), hỗ trợ responsive linh hoạt.
5. **Right Side Bar (Thanh bổ trợ / Xem trước bên phải):**
   - Chiều rộng (~280px - 340px) hiển thị thông tin chi tiết item đang chọn, widget tổng hợp nhanh, khung preview media/ảnh in và danh sách hoạt động gần đây.
6. **Bottom Bar (Thanh trạng thái & Tác vụ đáy trang):**
   - Cố định ở chân trang hoặc chân panel, hiển thị trạng thái hệ thống, phân trang, tổng số lượng hoặc các nút bấm hành động chốt (*Lưu thay đổi, In ấn, Xuất báo cáo*).

---

## 2. QUY TẮC CHIA COMPONENT CON (MODULAR COMPONENT ARCHITECTURE)

- **Nguyên tắc độ dài file:** Khi một trang hoặc component vượt quá **250 - 300 dòng**, **BẮT BUỘC** phải tách thành các component con trong thư mục `components/` cùng cấp.
- **Quy chuẩn đặt tên file component:**
  - `LeftRail.tsx`: Thanh điều hướng icon.
  - `ContextSidebar.tsx` / `Sidebar.tsx`: Thanh danh mục phụ.
  - `TabsHeader.tsx`: Thanh chuyển tab.
  - `MainContent.tsx` / `[Feature]Grid.tsx`: Lưới nội dung chính.
  - `RightInspector.tsx` / `RightSidebar.tsx`: Thanh chi tiết / preview.
  - `BottomBar.tsx`: Thanh tác vụ đáy.
  - `modals/[ModalName]Modal.tsx`: Các cửa sổ popup độc lập.
- Mỗi component con phải có TypeScript `interface` rõ ràng cho Props, không lạm dụng `any`.

---

## 3. HỆ THỐNG FONT CHỮ (TYPOGRAPHY SYSTEM)

Dự án sử dụng Next.js Font Optimization (`next/font/google`) khai báo tại `src/app/layout.tsx`:

| Tên Font | CSS Variable | Mục đích sử dụng |
| :--- | :--- | :--- |
| **Be Vietnam Pro** | `--font-be-vietnam-pro` | **Font mặc định chính** cho toàn bộ UI, tiêu đề, nút bấm, nhãn và văn bản tiếng Việt chuẩn xác. |
| **Geist Mono** | `--font-geist-mono` | Font Monospace cho Mã đơn hàng, Tọa độ layout, Ngày tháng, Giá tiền, Mã SKU và Số liệu kỹ thuật. |
| **Dancing Script** | `--font-dancing-script` | Font viết tay nghệ thuật mềm mại cho photobooth, thiệp chúc mừng, sự kiện lãng mạn. |
| **Cormorant Garamond** | `--font-cormorant-garamond` | Font có chân (Serif) sang trọng cho sự kiện trang trọng, tiêu đề editorial. |
| **Patrick Hand** | `--font-patrick-hand` | Font chữ viết tay phong cách dễ thương học đường. |
| **Mali** | `--font-mali` | Font chữ bong bóng vui nhộn cho sinh nhật, kỷ niệm thiếu nhi. |
| **Caveat** | `--font-caveat` | Font ký tên tự nhiên cho watermark photobooth. |
| **Itim** | `--font-itim` | Font bo tròn thân thiện cho sticker chữ tiếng Việt. |

---

## 4. HỆ THỐNG BIỂU TƯỢNG (ICON SYSTEM)

- **Component trung tâm:** `@/components/common/Icons.tsx` (hoặc `Icon`).
- **Cách dùng chuẩn:**
  ```tsx
  import Icon from '@/components/common/Icons';

  <Icon name="search" size={16} className="text-slate-400 dark:text-zinc-500" />
  <Icon name="palette" size={14} className="text-rose-500" />
  ```
- **Quy tắc bắt buộc:**
  1. Không tự ý viết SVG inline tùy tiện nếu biểu tượng đã có trong `Icons.tsx`.
  2. Nếu cần thêm icon mới từ `lucide-react`, mở rộng trực tiếp vào `Icons.tsx` và map tên đồng nhất.
  3. Bảng tra cứu nhanh một số icon thường dùng:
     - Điều hướng: `home`, `search`, `menu`, `close`, `arrowRight`, `arrowLeft`, `chevronDown`, `chevronUp`.
     - Tác vụ & Chức năng: `settings`, `trash`, `edit`, `save`, `plus`, `minus`, `check`, `eye`, `eyeOff`, `copy`.
     - Photobooth & Studio: `camera`, `palette`, `image`, `sparkles`, `layers`, `type`, `layout`, `hourglass`, `play`.
     - Giao diện & Theme: `sun`, `moon`, `filter`, `list`, `grid`, `bell`, `user`.

---

## 5. CHUẨN CHẾ ĐỘ SÁNG / TỐI (LIGHT / DARK MODE TOKENS)

Dự án sử dụng **Tailwind CSS v4** với chế độ Dark mode class-based (`dark:`). Mọi thành phần UI **bắt buộc** phải tuân thủ bảng màu chuẩn sau:

| Thành phần UI | Light Mode | Dark Mode | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Nền trang chính** | `bg-white` / `bg-slate-50` | `dark:bg-zinc-950` / `dark:bg-zinc-900` | Tối chuẩn sắc nét |
| **Nền Thẻ / Card / Modal** | `bg-white` / `bg-slate-50` | `dark:bg-zinc-900` / `dark:bg-zinc-800/80` | Độ nổi khối cao |
| **Nền Input / Select / Box** | `bg-white` / `bg-slate-50` | `dark:bg-zinc-900` / `dark:bg-zinc-800` | Chống chói |
| **Đường viền (Border)** | `border-slate-200` / `border-slate-200/80` | `dark:border-zinc-800` / `dark:border-zinc-700/80` | Thanh mảnh, tinh tế |
| **Chữ chính (Heading/Title)** | `text-slate-900` / `text-slate-800` | `dark:text-zinc-100` / `dark:text-white` | Độ tương phản cao |
| **Chữ phụ (Subtitle/Mô tả)** | `text-slate-500` / `text-slate-600` | `dark:text-zinc-400` / `dark:text-zinc-300` | Rõ ràng, dễ đọc |
| **Chữ mờ / Placeholder** | `text-slate-400` | `dark:text-zinc-500` | Không bị chìm mất |
| **Màu điểm nhấn (Accent)** | `text-rose-600`, `bg-rose-600` | `dark:text-rose-400`, `dark:bg-rose-600` | Thương hiệu Haniu |

> ⚠️ **CẤM KỴ:** Tuyệt đối **KHÔNG SỬ DỤNG** các class màu tự chế không tồn tại trong Tailwind như `zinc-850`, `zinc-750`, `slate-455`, `slate-650`, `rose-455`, `red-650`. Chúng sẽ làm mất màu nền và gây lỗi hiển thị trắng bệch hoặc tàng hình trong Dark Mode!

---

## 6. QUY TẮC THI CÔNG & BẢO TRÌ (OPERATIONAL RULES)

1. **TUYỆT ĐỐI KHÔNG CHẠY CÁC LỆNH:**
   - Không chạy `npm run dev`, `npm run build`, `npm start`, `next dev`, `pm2 restart` vì server đã được người dùng khởi chạy sẵn trong môi trường phát triển.
2. **Kiểm tra cú pháp & TypeScript:**
   - Khi cần kiểm tra lỗi TypeScript, chỉ dùng lệnh không chạy server: `npx tsc --noEmit`.
3. **Phong cách thiết kế hiện đại (Modern Aesthetics):**
   - Viền mỏng 1px tinh tế (`border border-slate-200/80 dark:border-zinc-700/80`).
   - Bo góc tròn hiện đại (`rounded-2xl`, `rounded-3xl`).
   - Hiệu ứng chuyển động mượt mà (`transition-all duration-200`, `active:scale-95`, `hover:shadow-md`).
