'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import Icon from '@/components/common/Icons';

interface NeonDatabase {
  id?: string;
  name: string;
  connectionUrl: string;
  isActive: boolean;
  sortOrder: number;
  lastSwitchedAt?: string;
  createdAt?: string;
}

export default function AdminDbRotationPage() {
  const [databases, setDatabases] = useState<NeonDatabase[]>([]);
  const [loading, setLoading] = useState(false);
  const [rotateLoading, setRotateLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDb, setCurrentDb] = useState<NeonDatabase>({
    name: '',
    connectionUrl: '',
    isActive: false,
    sortOrder: 0
  });

  const loadDatabases = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/api/v1/admin/db-rotation');
      if (data && Array.isArray(data)) {
        setDatabases(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabases();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentDb.id) {
        await fetchApi(`/api/v1/admin/db-rotation/${currentDb.id}`, {
          method: 'PUT',
          body: JSON.stringify(currentDb)
        });
        alert('Cập nhật cấu hình database thành công!');
      } else {
        await fetchApi('/api/v1/admin/db-rotation', {
          method: 'POST',
          body: JSON.stringify(currentDb)
        });
        alert('Thêm cấu hình database thành công!');
      }
      setIsEditing(false);
      loadDatabases();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu cấu hình database!');
    }
  };

  const handleEdit = (db: NeonDatabase) => {
    setCurrentDb({ ...db });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cấu hình database này?')) return;
    try {
      await fetchApi(`/api/v1/admin/db-rotation/${id}`, {
        method: 'DELETE'
      });
      loadDatabases();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa cấu hình database!');
    }
  };

  const handleRotate = async () => {
    if (!confirm('Hệ thống sẽ chuyển quyền kết nối hoạt động sang database tiếp theo và cấu hình. Bạn có chắc muốn xoay vòng ngay?')) return;
    setRotateLoading(true);
    try {
      const res = await fetchApi('/api/v1/admin/db-rotation/rotate', {
        method: 'POST'
      });
      if (res && res.message) {
        alert(`🎉 ${res.message}\nTừ: ${res.oldActive}\nSang: ${res.newActive}`);
      }
      loadDatabases();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xoay vòng database!');
    } finally {
      setRotateLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentDb({
      name: '',
      connectionUrl: '',
      isActive: false,
      sortOrder: databases.length
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Quản lý Xoay vòng Cơ sở dữ liệu (Neon DB Rotation)</h1>
          <p className="text-xs text-slate-400 mt-1">Cấu hình danh sách các kết nối dự phòng, tự động đảo database kết nối để tránh quá giới hạn 100 CU-hrs miễn phí</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRotate}
            disabled={rotateLoading || databases.length <= 1}
            className="px-4 py-2.5 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-950/30 text-rose-500 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {rotateLoading ? (
              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-rose-500" />
            ) : (
              <Icon name="settings" size={13} />
            )}
            Xoay Vòng DB Ngay
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 transition-all cursor-pointer"
          >
            + Thêm Database Mới
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            {currentDb.id ? 'Cập nhật Cấu hình DB' : 'Thêm Database mới'}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Tên định danh (Ví dụ: Neon Free Acc 1)</label>
              <input
                type="text"
                required
                value={currentDb.name}
                onChange={e => setCurrentDb({ ...currentDb, name: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Chuỗi kết nối Connection URL (PostgreSQL Connection String)</label>
              <textarea
                required
                value={currentDb.connectionUrl}
                onChange={e => setCurrentDb({ ...currentDb, connectionUrl: e.target.value })}
                placeholder="postgresql://user:password@endpoint.neon.tech/dbname?sslmode=require"
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 h-24 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Thứ tự quay vòng (Sắp xếp tăng dần)</label>
                <input
                  type="number"
                  required
                  value={currentDb.sortOrder}
                  onChange={e => setCurrentDb({ ...currentDb, sortOrder: Number(e.target.value) })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={currentDb.isActive}
                  onChange={e => setCurrentDb({ ...currentDb, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                />
                <label htmlFor="isActive" className="text-xs text-slate-700 dark:text-zinc-300 font-semibold cursor-pointer">
                  Đặt làm kết nối hoạt động ngay
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-50 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-655 dark:text-zinc-300 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
              >
                Lưu lại
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Databases Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Đang tải cấu hình database...</div>
        ) : databases.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Chưa cấu hình cơ sở dữ liệu dự phòng nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/40 border-b border-slate-100 dark:border-zinc-800 text-slate-500 font-bold">
                  <th className="p-4">Tên định danh</th>
                  <th className="p-4">Chuỗi kết nối</th>
                  <th className="p-4">Thứ tự</th>
                  <th className="p-4">Ngày kích hoạt gần nhất</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {databases.map(db => (
                  <tr key={db.id} className="border-b border-slate-50 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-bold text-slate-700 dark:text-zinc-200">{db.name}</td>
                    <td className="p-4 font-mono text-slate-450 dark:text-zinc-400 max-w-xs truncate" title={db.connectionUrl}>
                      {db.connectionUrl}
                    </td>
                    <td className="p-4 font-bold text-slate-655 dark:text-zinc-300">{db.sortOrder}</td>
                    <td className="p-4 text-slate-500">
                      {db.lastSwitchedAt ? new Date(db.lastSwitchedAt).toLocaleString('vi-VN') : 'Chưa kích hoạt'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        db.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {db.isActive ? 'Đang hoạt động' : 'Chờ xoay vòng'}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(db)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-655 dark:text-zinc-300 rounded font-semibold hover:bg-slate-200 cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(db.id!)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded font-semibold cursor-pointer"
                      >
                        Xóa
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
