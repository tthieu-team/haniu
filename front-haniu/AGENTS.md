<!-- BEGIN:nextjs-agent-rules -->
# HANIU FRONTEND AGENTS & CODING RULES

## 1. BỐ CỤC GIAO DIỆN (APP LAYOUT ARCHITECTURE)
Giao diện ứng dụng tuân thủ kiến trúc 6 phân vùng:
1. **Left Rail**: Thanh icon dọc siêu gọn bên trái (Home, Search, Notif, Docs, Settings, User avatar).
2. **Sidebar**: Thanh điều hướng danh mục ngữ cảnh có dropdown lọc và danh sách icon + 2 dòng chữ.
3. **Tabs**: Thanh chuyển tab đặt trên đỉnh vùng làm việc.
4. **Main Content**: Khung nội dung chính (Card lưới, Bảng biểu, Canvas làm việc).
5. **Right Sidebar**: Thanh thông tin chi tiết (Inspector), khung xem trước media, thẻ tổng kết.
6. **Bottom Bar**: Thanh trạng thái & tác vụ cố định ở chân trang.

## 2. HỆ THỐNG FONT & ICON (TYPOGRAPHY & ICONS)
- **Font mặc định:** `--font-be-vietnam-pro` (`Be_Vietnam_Pro`).
- **Font Monospace:** `--font-geist-mono` (`Geist_Mono`) cho Code, ID, Ngày tháng, Thông số.
- **Font Nghệ thuật Photobooth:** `Dancing_Script`, `Cormorant_Garamond`, `Patrick_Hand`, `Mali`, `Caveat`, `Itim`.
- **Icon hệ thống:** Luôn dùng `<Icon name="..." size={...} className="..." />` từ `@/components/common/Icons`.

## 3. CHẾ ĐỘ SÁNG / TỐI (LIGHT / DARK MODE)
- Sử dụng chuẩn màu Tailwind CSS:
  - Dark: `dark:bg-zinc-950`, `dark:bg-zinc-900`, `dark:bg-zinc-800`, `dark:border-zinc-800`, `dark:border-zinc-700`, `dark:text-zinc-100`, `dark:text-zinc-400`.
  - Light: `bg-white`, `bg-slate-50`, `border-slate-200`, `text-slate-800`, `text-slate-600`.
- Không dùng các class custom tự chế không hợp lệ (`zinc-850`, `zinc-750`, `slate-455`, `slate-650`).

## 4. QUY TẮC TÁCH COMPONENT CHO FRONTEND
- Mọi file dài quá 250 - 300 dòng phải được tách thành các component con (`components/LeftRail.tsx`, `components/Sidebar.tsx`, `components/TabsHeader.tsx`, `components/RightSidebar.tsx`, `components/BottomBar.tsx`, Modals...) để dễ quản lý.

## 5. CẤM LỆNH THI CÔNG
- **TUYỆT ĐỐI KHÔNG CHẠY** các lệnh restart, build hoặc run server (`npm run dev`, `npm run build`, `next dev`, ...).
<!-- END:nextjs-agent-rules -->
