'use client';

import { useState, useEffect } from 'react';
import { catalogService, Occasion } from '@/services/catalog.service';
import { productService } from '@/services/product.service';
import { getFullImageUrl } from '@/lib/api';
import Link from 'next/link';
import Icon from '@/components/common/Icons';

export default function AdminOccasionsPage() {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  // Image upload state
  const [uploading, setUploading] = useState(false);

  const loadOccasions = async () => {
    try {
      setLoading(true);
      const data = await catalogService.getAllOccasions();
      setOccasions(data || []);
    } catch (err) {
      console.error('Không thể tải danh sách dịp lễ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOccasions();
  }, []);

  const toSlug = (str: string) => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/[^a-z0-9 -]/g, ""); 
    str = str.replace(/\s+/g, "-"); 
    str = str.replace(/-+/g, "-"); 
    return str.trim();
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(toSlug(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMsg('');
      const res = await productService.uploadImage(file);
      if (res && res.url) {
        setImageUrl(res.url);
      } else {
        setErrorMsg('Tải ảnh lên thất bại, không tìm thấy URL.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi tải lên hình ảnh.');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setStartDate('');
    setEndDate('');
    setIsActive(true);
    setErrorMsg('');
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Occasion) => {
    setEditingId(item.id || null);
    setName(item.name);
    setSlug(item.slug);
    setDescription(item.description || '');
    setImageUrl(item.imageUrl || '');
    setStartDate(item.startDate || '');
    setEndDate(item.endDate || '');
    setIsActive(item.isActive ?? true);
    setErrorMsg('');
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Tên dịp lễ không được để trống.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Slug không được để trống.');
      return;
    }

    const payload: Occasion = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
      isActive,
    };

    if (editingId) {
      payload.id = editingId;
    }

    try {
      setSubmitLoading(true);
      setErrorMsg('');
      await catalogService.createOccasion(payload);
      setSuccessMsg(editingId ? 'Cập nhật dịp lễ thành công! 🎉' : 'Thêm dịp lễ mới thành công! 🎉');
      setTimeout(() => {
        setIsModalOpen(false);
        loadOccasions();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu dịp lễ.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dịp lễ này không?')) return;
    try {
      await catalogService.deleteOccasion(id);
      setSuccessMsg('Xóa dịp lễ thành công! 🎉');
      setTimeout(() => setSuccessMsg(''), 2000);
      loadOccasions();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa dịp lễ.');
    }
  };

  // Filter & Search logic
  const filteredOccasions = occasions.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || 
                          (statusFilter === 'ACTIVE' && item.isActive) || 
                          (statusFilter === 'INACTIVE' && !item.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">Quản lý Dịp lễ (Occasions)</h1>
          <p className="text-xs text-slate-400">Tạo, cập nhật thông tin và điều kiện dịp lễ tặng quà</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Icon name="plus" size={14} /> Thêm Dịp Lễ Mới
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium">
          {successMsg}
        </div>
      )}

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm w-full">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Tìm kiếm dịp lễ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
          />
          <span className="absolute left-3 top-2.5 text-slate-400">
            <Icon name="search" size={14} />
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-semibold">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider">Trạng thái:</span>
          {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-bold transition-all cursor-pointer ${
                statusFilter === f
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
              }`}
            >
              {f === 'ALL' ? 'Tất cả' : f === 'ACTIVE' ? 'Hoạt động' : 'Tạm khóa'}
            </button>
          ))}
        </div>
      </div>

      {/* Occasions Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-3" />
            Đang tải dữ liệu dịp lễ...
          </div>
        ) : filteredOccasions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            Không tìm thấy dịp lễ nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-850 border-b border-slate-100 dark:border-zinc-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4 w-20">Ảnh</th>
                  <th className="p-4">Tên dịp lễ</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Ngày diễn ra (MM-DD)</th>
                  <th className="p-4">Mô tả</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOccasions.map(item => (
                  <tr key={item.id} className="border-b border-slate-50 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      {item.imageUrl ? (
                        <img
                          src={getFullImageUrl(item.imageUrl)}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-sm">
                          🎉
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-white text-sm">{item.name}</td>
                    <td className="p-4 font-mono font-semibold text-slate-400">{item.slug}</td>
                    <td className="p-4 font-semibold text-slate-600 dark:text-zinc-300">
                      {item.startDate || item.endDate ? (
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/10">
                          {item.startDate || '??'} → {item.endDate || '??'}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 max-w-xs truncate font-medium">{item.description || 'Không có mô tả'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        item.isActive
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/10'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/10'
                      }`}>
                        {item.isActive ? 'Đang chạy' : 'Đang ẩn'}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 font-bold border border-slate-200 dark:border-zinc-700 cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1"
                      >
                        <Icon name="edit" size={12} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id!)}
                        className="px-2.5 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1"
                      >
                        <Icon name="trash" size={12} /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-2xl p-6 relative flex flex-col max-h-[90vh] overflow-y-auto scrollbar-none animate-in fade-in zoom-in-95 duration-200 text-xs font-semibold">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-850 flex items-center justify-center cursor-pointer"
            >
              <Icon name="close" size={14} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-zinc-850 pb-3 mb-5">
              {editingId ? 'Cập nhật Dịp Lễ' : 'Tạo Dịp Lễ Mới'}
            </h3>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl font-medium mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">Tên dịp lễ *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Ví dụ: Lễ Tình Nhân (Valentine)"
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">Slug (Đường dẫn tĩnh) *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(toSlug(e.target.value))}
                  placeholder="le-tinh-nhan"
                  className="w-full text-xs font-mono bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">Mô tả dịp lễ</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Nhập vài câu giới thiệu về dịp lễ này..."
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 h-20"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">Ngày bắt đầu (MM-DD)</label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    placeholder="02-10"
                    maxLength={5}
                    className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">Ngày kết thúc (MM-DD)</label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    placeholder="02-14"
                    maxLength={5}
                    className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 text-center"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">Hình ảnh đại diện</label>
                <div className="flex gap-4 items-center">
                  {imageUrl ? (
                    <div className="relative shrink-0 border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden w-20 h-20 bg-slate-100">
                      <img src={getFullImageUrl(imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 border-none text-[8px]"
                        title="Xóa ảnh"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 border border-dashed border-slate-200 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-1 shrink-0">
                      <Icon name="camera" size={16} />
                      <span className="text-[8px] font-bold">Chưa có ảnh</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      id="upload-occasion-img"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="upload-occasion-img"
                      className="px-4 py-2 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 font-bold rounded-lg cursor-pointer transition-all inline-flex items-center gap-1.5 active:scale-95"
                    >
                      {uploading ? (
                        <>
                          <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-600" />
                          Đang tải lên...
                        </>
                      ) : (
                        <>
                          <Icon name="camera" size={12} /> Chọn tập tin ảnh
                        </>
                      )}
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium">Chấp nhận JPG, PNG, GIF. Kích thước đề xuất 800x800px</p>
                  </div>
                </div>
              </div>

              {/* Status active */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={!!isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-slate-700 dark:text-zinc-300 font-bold cursor-pointer">
                  Kích hoạt hoạt động (Hiện trên trang chủ)
                </label>
              </div>

              {/* Submit buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-zinc-850 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md shadow-rose-500/10 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {submitLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Icon name="save" size={12} /> Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
