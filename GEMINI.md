# GEMINI AGENT RULES - HANIU PROJECT

Tài liệu hướng dẫn & quy chuẩn phát triển cho AI khi làm việc trên dự án Haniu:

1. **Bố cục giao diện chuẩn (6 khối)**:
   - **Left Rail**: Thanh icon dọc bên trái (Home, Search, Bell, Docs, Settings, User avatar).
   - **Sidebar**: Thanh điều hướng danh mục ngữ cảnh bên cạnh left rail.
   - **Tabs**: Thanh chuyển tab trên đầu vùng làm việc chính.
   - **Main Content**: Vùng nội dung trọng tâm (lưới card hình ảnh, bảng dữ liệu, công cụ tương tác).
   - **Right Sidebar**: Thanh thông tin chi tiết / inspector / media preview / summary widgets.
   - **Bottom Bar**: Thanh trạng thái và nút hành động chân trang.
   - Chi tiết: Xem file [.agents/rules/ui-layout-design-system.md](file:///d:/FullStack/haniu/.agents/rules/ui-layout-design-system.md).

2. **Hệ thống Font & Icon**:
   - Font chính: `Be_Vietnam_Pro` (`--font-be-vietnam-pro`).
   - Font Monospace: `Geist_Mono` (`--font-geist-mono`).
   - Font nghệ thuật: `Dancing_Script`, `Cormorant_Garamond`, `Patrick_Hand`, `Mali`, `Caveat`, `Itim`.
   - Icon: Luôn dùng component trung tâm `@/components/common/Icons` (`<Icon name="..." />`).

3. **Chế độ Sáng / Tối (Dark / Light Mode)**:
   - Bắt buộc hỗ trợ đầy đủ `dark:` cho tất cả thành phần UI.
   - Chỉ dùng màu chuẩn Tailwind CSS: `dark:bg-zinc-950`, `dark:bg-zinc-900`, `dark:bg-zinc-800`, `dark:border-zinc-800`, `dark:border-zinc-700`, `dark:text-zinc-100`.
   - Tránh tuyệt đối các class không tồn tại như `zinc-850`, `zinc-750`, `slate-455`, `slate-650`.

4. **Nguyên tắc tách Component con (FE Maintainability)**:
   - Khi một file dài vượt quá 250 - 300 dòng, phải chủ động tách ra các component con trong thư mục `components/` tương ứng.

5. **Giới hạn thực thi lệnh (Crucial)**:
   - **TUYỆT ĐỐI KHÔNG CHẠY** các lệnh restart/build/run server (`npm run dev`, `npm run build`, `next dev`, `npm start`, ...).
