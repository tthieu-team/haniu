'use client';

import { useState, useEffect } from 'react';
import { usePostStore } from '@/store/post';
import { PostPayload } from '@/services/post.service';
import { FileUploadInput } from '../layout-config/components/FileUploadInput';
import Icon from '@/components/common/Icons';

export default function AdminPostsPage() {
  const { posts, loading, fetchPosts, createPost, updatePost, deletePost } = usePostStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostPayload>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    imageUrl: '',
    active: true
  });

  // AI Helper States
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('Lãng mạn, sâu sắc');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [isAiWriting, setIsAiWriting] = useState(false);
  const [showAiHelper, setShowAiHelper] = useState(false);

  const handleAiWrite = async () => {
    if (!aiTopic.trim()) {
      alert('Vui lòng nhập chủ đề bài viết!');
      return;
    }
    setIsAiWriting(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_post',
          topic: aiTopic,
          tone: aiTone,
          customPrompt: aiCustomPrompt
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi khi gọi API AI');
      }

      setCurrentPost(prev => ({
        ...prev,
        title: data.title || prev.title,
        slug: data.slug || prev.slug,
        summary: data.summary || prev.summary,
        imageUrl: data.imageUrl || prev.imageUrl,
        content: data.content || prev.content
      }));

      setShowAiHelper(false);
      alert('Tạo bài viết bằng AI thành công! 🎉');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi viết bài bằng AI!');
    } finally {
      setIsAiWriting(false);
    }
  };

  const loadPosts = async () => {
    await fetchPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPost.id) {
        await updatePost(currentPost.id, currentPost);
        alert('Cập nhật bài viết thành công! 🎉');
      } else {
        await createPost(currentPost);
        alert('Đăng bài viết mới thành công! 🚀');
      }
      setIsEditing(false);
      loadPosts();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu bài viết!');
    }
  };

  const handleEdit = (post: PostPayload) => {
    setCurrentPost(post);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      await deletePost(id);
      loadPosts();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa bài viết!');
    }
  };

  const handleCreateNew = () => {
    setCurrentPost({
      title: '',
      slug: '',
      summary: '',
      content: '',
      imageUrl: '',
      active: true
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
            Quản lý Bài viết (Blog / News)
          </h1>
          <p className="text-xs text-slate-400">
            Tạo mới, biên tập nội dung, đăng tải và quản lý các bài chia sẻ kinh nghiệm tặng quà.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Icon name="plus" size={14} />
          <span>Đăng bài viết mới</span>
        </button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm space-y-6 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-800/60 pb-3">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              {currentPost.id ? 'Biên tập bài viết' : 'Soạn thảo bài viết mới'}
            </h3>
            {!currentPost.id && (
              <button
                type="button"
                onClick={() => setShowAiHelper(!showAiHelper)}
                className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>✨ Viết bài bằng AI</span>
              </button>
            )}
          </div>

          {showAiHelper && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 space-y-3 animate-fade-in">
              <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <span>🤖 Trợ lý nội dung AI</span>
                <span className="text-[10px] text-slate-400 font-normal">(Sử dụng AI để tự động tạo một bài viết chất lượng ~1000 từ)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Chủ đề / Ý tưởng bài viết</label>
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    className="w-full text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                    placeholder="Ví dụ: Bí quyết chọn quà tặng bạn gái ngày Valentine ý nghĩa..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Tone giọng</label>
                  <select
                    value={aiTone}
                    onChange={e => setAiTone(e.target.value)}
                    className="w-full text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Lãng mạn, sâu sắc">Lãng mạn, sâu sắc</option>
                    <option value="Chuyên nghiệp, thông tin">Chuyên nghiệp, chia sẻ kinh nghiệm</option>
                    <option value="Vui tươi, trẻ trung">Vui tươi, trẻ trung</option>
                    <option value="Trang trọng, tinh tế">Trang trọng, tinh tế</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Yêu cầu bổ sung (Không bắt buộc)</label>
                <input
                  type="text"
                  value={aiCustomPrompt}
                  onChange={e => setAiCustomPrompt(e.target.value)}
                  className="w-full text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                  placeholder="Ví dụ: Có nhắc tới sản phẩm nến thơm Haniu, chèn thêm 3 lời khuyên..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiHelper(false)}
                  className="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-zinc-750 bg-white dark:bg-zinc-900 text-slate-500 cursor-pointer hover:bg-slate-50"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  disabled={isAiWriting}
                  onClick={handleAiWrite}
                  className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-rose-500 hover:bg-rose-600 text-white shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <span>Chấp bút viết bài 🚀</span>
                </button>
              </div>
            </div>
          )}

          {isAiWriting && (
            <div className="p-8 rounded-2xl bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/30 flex flex-col items-center justify-center space-y-3 animate-pulse">
              <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-xs font-bold text-rose-500 dark:text-rose-450">AI đang viết bài...</div>
              <div className="text-[10px] text-slate-400 text-center">Quá trình này có thể mất khoảng 10-15 giây để tạo nội dung ~1000 từ chất lượng cao. Vui lòng giữ kết nối.</div>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Tiêu đề bài viết</label>
                <input
                  type="text"
                  required
                  value={currentPost.title}
                  onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                  placeholder="Nhập tiêu đề hấp dẫn..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Đường dẫn tĩnh (Slug - Tự động tạo nếu để trống)</label>
                <input
                  type="text"
                  value={currentPost.slug || ''}
                  onChange={e => setCurrentPost({ ...currentPost, slug: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                  placeholder="vi-du-tieu-de-bai-viet"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Mô tả ngắn (Summary)</label>
              <textarea
                required
                value={currentPost.summary || ''}
                onChange={e => setCurrentPost({ ...currentPost, summary: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none h-16"
                placeholder="Tóm tắt nội dung bài viết hiển thị ở danh sách ngoài trang chủ..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FileUploadInput
                  label="Ảnh đại diện bài viết (Cover Image)"
                  value={currentPost.imageUrl || ''}
                  onChange={url => setCurrentPost({ ...currentPost, imageUrl: url })}
                  accept="image/*"
                  type="image"
                  placeholder="Đường dẫn ảnh đại diện..."
                />
              </div>
              <div className="flex flex-col justify-end pb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={currentPost.active}
                    onChange={e => setCurrentPost({ ...currentPost, active: e.target.checked })}
                    className="rounded border-slate-350 bg-slate-50 text-rose-500 focus:ring-rose-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="active" className="text-xs text-slate-700 dark:text-zinc-300 font-bold uppercase">
                    Xuất bản ngay (Công khai lên website)
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Nội dung bài viết (HTML / Markdown)</label>
              <textarea
                required
                value={currentPost.content || ''}
                onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none h-60 font-mono"
                placeholder="<p>Viết nội dung bài viết chi tiết ở đây, hỗ trợ các thẻ HTML cơ bản...</p>"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-850/50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 cursor-pointer"
              >
                {currentPost.id ? 'Cập nhật bài viết' : 'Đăng bài viết'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800/85 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Đang tải danh sách bài viết...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Chưa có bài viết nào được tạo.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-450 font-bold">
                  <th className="p-4 w-20">Hình ảnh</th>
                  <th className="p-4">Tiêu đề bài viết</th>
                  <th className="p-4">Đường dẫn tĩnh (Slug)</th>
                  <th className="p-4 w-32">Ngày xuất bản</th>
                  <th className="p-4 w-28">Trạng thái</th>
                  <th className="p-4 text-center w-28">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-slate-50 dark:border-zinc-800/60 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-12 h-8 rounded-lg object-cover border border-slate-200/50 dark:border-zinc-800"
                        />
                      ) : (
                        <div className="w-12 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-slate-400">
                          No Pic
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-700 dark:text-zinc-300 max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="p-4 font-mono text-slate-500 dark:text-zinc-450">{post.slug}</td>
                    <td className="p-4 text-slate-500 dark:text-zinc-450">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : '---'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        post.active ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-slate-500/10 text-slate-500'
                      }`}>
                        {post.active ? 'Công khai' : 'Nháp'}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-1">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-1.5 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-750 text-slate-600 dark:text-zinc-300 rounded-lg cursor-pointer"
                        title="Chỉnh sửa bài viết"
                      >
                        <Icon name="edit" size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id!)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg cursor-pointer"
                        title="Xóa bài viết"
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
