# AI AGENTS SETTING & RULES FOR HANIU REPOSITORY

Tất cả các AI Assistant làm việc trên codebase này **BẮT BUỘC** phải tuân thủ các quy tắc sau:

## 1. QUY CHUẨN THIẾT KẾ GIAO DIỆN (UI LAYOUT & ARCHITECTURE)
Bố cục giao diện chuẩn gồm 6 khối:
- **Left Rail**: Thanh icon dọc bên trái (~64px) chứa các icon chính (Home, Search, Notif, Docs, Settings, Avatar).
- **Sidebar**: Thanh điều hướng danh mục ngữ cảnh (~240px) có bộ lọc trên đỉnh và danh sách các item kèm icon.
- **Tabs**: Thanh chuyển tab phân mục nằm trên đầu vùng làm việc chính.
- **Main Content**: Khung nội dung trung tâm (bảng biểu, card lưới ảnh, công cụ tương tác).
- **Right Sidebar**: Bảng tra cứu thông tin chi tiết (Inspector), khung xem trước media, thẻ tổng kết.
- **Bottom Bar**: Thanh trạng thái và nút hành động chốt ở chân trang.

Chi tiết quy chuẩn đầy đủ tại: [.agents/rules/ui-layout-design-system.md](file:///d:/FullStack/haniu/.agents/rules/ui-layout-design-system.md)

## 2. HỆ THỐNG FONT & ICON (TYPOGRAPHY & ICONS)
- **Font chính:** `--font-be-vietnam-pro` (`Be_Vietnam_Pro`) cho toàn bộ giao diện và văn bản tiếng Việt.
- **Font Monospace:** `--font-geist-mono` (`Geist_Mono`) cho Mã đơn hàng, Tọa độ, Thông số kỹ thuật, Ngày giờ.
- **Font Nghệ thuật Photobooth:** `Dancing_Script`, `Cormorant_Garamond`, `Patrick_Hand`, `Mali`, `Caveat`, `Itim`.
- **Icon chuẩn:** Toàn bộ biểu tượng phải import từ `@/components/common/Icons` (`<Icon name="..." size={...} className="..." />`). Không tự ý viết SVG inline tùy tiện.

## 3. CHẾ ĐỘ SÁNG / TỐI (LIGHT / DARK MODE)
- Bắt buộc hỗ trợ đầy đủ `dark:` cho mọi thành phần UI mới hoặc chỉnh sửa.
- Dùng màu chuẩn Tailwind CSS: `dark:bg-zinc-950`, `dark:bg-zinc-900`, `dark:bg-zinc-800`, `dark:border-zinc-800`, `dark:border-zinc-700`, `dark:text-zinc-100`, `dark:text-zinc-400`.
- **Tuyệt đối không dùng class màu không tồn tại** như `zinc-850`, `zinc-750`, `slate-455`, `slate-650`.

## 4. QUY TẮC TÁCH COMPONENT (MODULAR COMPONENT FOR FRONTEND)
- Khi một file trang (page/view) dài quá **250 - 300 dòng**, **phải chia thành các component con** đặt trong thư mục `components/` tương ứng (vd: `LeftRail.tsx`, `Sidebar.tsx`, `TabsHeader.tsx`, `MainGrid.tsx`, `RightSidebar.tsx`, `BottomBar.tsx`, Modals).

## 5. QUY TẮC THI HÀNH LỆNH (COMMAND RESTRICTIONS)
- **TUYỆT ĐỐI KHÔNG CHẠY CÁC LỆNH RESTART, BUILD HOẶC RUN SERVER** (`npm run dev`, `npm run build`, `next dev`, `npm start`, `pm2 restart`, ...).
- Chỉ sử dụng `npx tsc --noEmit` khi cần kiểm tra lỗi type tĩnh.
