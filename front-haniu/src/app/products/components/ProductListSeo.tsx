'use client';

export default function ProductListSeo() {
  return (
    <div className="mt-24 border-t border-slate-200/60 dark:border-zinc-800 pt-16">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black text-slate-800 dark:text-zinc-100 tracking-tight uppercase bg-gradient-to-r from-slate-900 to-slate-700 dark:from-zinc-100 dark:to-zinc-350 bg-clip-text text-transparent">
            📖 Thế giới quà tặng cá nhân hóa Haniu
          </h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-lg mx-auto font-light leading-relaxed">
            Khám phá nghệ thuật tặng quà đầy ý nghĩa và tinh tế cùng những bộ sưu tập độc bản từ Haniu.
          </p>
        </div>

        {/* Grid of SEO blocks */}
        <div className="grid md:grid-cols-2 gap-8 text-slate-500 dark:text-zinc-400 leading-relaxed font-light text-xs">
          <div className="space-y-3 bg-white dark:bg-zinc-950 p-6 rounded-[28px] border border-slate-200/60 dark:border-zinc-800 shadow-xs">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <span>🎁</span> Ý nghĩa của việc chọn quà thiết kế
            </h3>
            <p>
              Tại <strong>Haniu</strong>, chúng tôi tin rằng mỗi món quà là một câu chuyện tình cảm chưa kể. Việc lựa chọn một bộ quà tặng thiết kế hoặc combo quà tặng cá nhân hóa giúp bạn truyền tải thông điệp chân thành nhất đến người nhận. Khác với những món quà sản xuất hàng loạt, các sản phẩm tại Haniu được chăm chút tỉ mỉ từ khâu chọn hoa sáp thơm, ly sứ men hỏa biến cho đến khắc tên laser độc bản.
            </p>
          </div>
          
          <div className="space-y-3 bg-white dark:bg-zinc-950 p-6 rounded-[28px] border border-slate-200/60 dark:border-zinc-800 shadow-xs">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <span>✨</span> Dịch vụ khắc tên laser độc bản theo yêu cầu
            </h3>
            <p>
              Điểm đặc biệt tạo nên thương hiệu Haniu chính là khả năng <strong>cá nhân hóa quà tặng</strong>. Bạn có thể yêu cầu khắc tên, ngày kỷ niệm hoặc những lời chúc yêu thương trực tiếp lên bìa sổ tay da thật, bút ký kim loại, ly sứ hoặc đế gỗ trang trí. Đây chính là nét chấm phá tinh tế giúp món quà của bạn trở nên độc nhất vô nhị, lưu giữ mãi những khoảnh khắc hạnh phúc theo thời gian.
            </p>
          </div>

          <div className="space-y-3 bg-white dark:bg-zinc-950 p-6 rounded-[28px] border border-slate-200/60 dark:border-zinc-800 shadow-xs">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <span>🌹</span> Chất liệu cao cấp và an toàn cho người sử dụng
            </h3>
            <p>
              Chúng tôi cam kết sử dụng những nguyên vật liệu cao cấp, có nguồn gốc rõ ràng và thân thiện với môi trường. Hoa sáp thơm Haniu sử dụng tinh dầu tự nhiên, giữ phom dáng mềm mại và hương thơm dịu nhẹ lên tới 3 năm. Sổ tay được chế tác từ da bò thật nguyên tấm, chất giấy kraft mịn màng mang phong cách vintage quý phái. Mọi quy trình hoàn thiện đều được kiểm định chặt chẽ trước khi trao gửi.
            </p>
          </div>

          <div className="space-y-3 bg-white dark:bg-zinc-950 p-6 rounded-[28px] border border-slate-200/60 dark:border-zinc-800 shadow-xs">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <span>🚚</span> Trải nghiệm mua sắm tiện lợi tại Haniu
            </h3>
            <p>
              Với hệ thống website hiện đại, khách hàng có thể dễ dàng lọc sản phẩm theo danh mục, thương hiệu, khoảng giá hoặc nhu cầu sử dụng. Haniu hỗ trợ đóng gói hộp quà sang trọng đi kèm thiệp viết tay ý nghĩa, hỗ trợ vận chuyển hỏa tốc toàn quốc đảm bảo an toàn tuyệt đối. Chúng tôi luôn đồng hành cùng bạn để mang lại nụ cười rạng rỡ nhất cho người nhận quà.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
