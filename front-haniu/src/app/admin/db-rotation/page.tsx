'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import Icon from '@/components/common/Icons';
import { useToast } from '@/providers/ToastProvider';

interface NeonDatabase {
  id?: string;
  name: string;
  connectionUrl: string;
  isActive: boolean;
  sortOrder: number;
  lastSwitchedAt?: string;
  createdAt?: string;
}

interface BackupMetadata {
  name: string;
  timestamp?: string;
  sourceUrl?: string;
  totalTables?: number;
  totalRows?: number;
  createdAt: string;
  tables?: string[];
}

export default function AdminDbRotationPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'config' | 'sync' | 'backup'>('config');
  const [databases, setDatabases] = useState<NeonDatabase[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Configurations tab states
  const [rotateLoading, setRotateLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDb, setCurrentDb] = useState<NeonDatabase>({
    name: '',
    connectionUrl: '',
    isActive: false,
    sortOrder: 0
  });

  // Multi-Sync tab states
  const [syncSourceId, setSyncSourceId] = useState<string>('local');
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const [syncLoading, setSyncLoading] = useState(false);

  // Backup & Restore tab states
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [selectedBackupDbId, setSelectedBackupDbId] = useState<string>('local');
  const [restoreTargetDbId, setRestoreTargetDbId] = useState<string>('local');
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedRestoreBackup, setSelectedRestoreBackup] = useState<string>('');

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

  const loadBackups = async () => {
    try {
      const data = await fetchApi('/api/v1/admin/db-rotation/backups');
      if (data && Array.isArray(data)) {
        setBackups(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách backups:', err);
    }
  };

  useEffect(() => {
    loadDatabases();
    loadBackups();
  }, []);

  // CONFIGURATION TAB HANDLERS
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentDb.id) {
        await fetchApi(`/api/v1/admin/db-rotation/${currentDb.id}`, {
          method: 'PUT',
          body: JSON.stringify(currentDb)
        });
        showToast('success', 'Cập nhật cấu hình database thành công!');
      } else {
        await fetchApi('/api/v1/admin/db-rotation', {
          method: 'POST',
          body: JSON.stringify(currentDb)
        });
        showToast('success', 'Thêm cấu hình database thành công!');
      }
      setIsEditing(false);
      loadDatabases();
    } catch (err: any) {
      showToast('error', err.message || 'Lỗi khi lưu cấu hình database!');
    }
  };

  const handleEdit = (db: NeonDatabase) => {
    setCurrentDb({ ...db });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cấu hình database này? Một bản backup tự động sẽ được tạo trước khi xóa.')) return;
    try {
      await fetchApi(`/api/v1/admin/db-rotation/${id}`, {
        method: 'DELETE'
      });
      showToast('success', 'Xóa cấu hình database thành công và đã tự động lưu backup!');
      loadDatabases();
      loadBackups();
    } catch (err: any) {
      showToast('error', err.message || 'Lỗi khi xóa cấu hình database!');
    }
  };

  const handleRotate = async () => {
    if (!confirm('⚠️ CẢNH BÁO MẤT DỮ LIỆU:\n\nHệ thống sẽ tiến hành xoay vòng database. Toàn bộ dữ liệu hiện tại ở database đích (database tiếp theo) sẽ bị XÓA SẠCH để đồng bộ dữ liệu mới sang.\n\nBạn có chắc chắn muốn xoay vòng ngay?')) return;
    setRotateLoading(true);
    try {
      const res = await fetchApi('/api/v1/admin/db-rotation/rotate', {
        method: 'POST'
      });
      showToast('success', `Xoay vòng database thành công! Từ: ${res?.oldActive || 'Không có'} sang: ${res?.newActive || 'Không rõ'}`);
      loadDatabases();
      loadBackups();
    } catch (err: any) {
      showToast('error', err.message || 'Lỗi khi xoay vòng database!');
    } finally {
      setRotateLoading(false);
    }
  };

  // MULTI-SYNC TAB HANDLERS
  const handleToggleTarget = (id: string) => {
    setSelectedTargetIds(prev =>
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const handleMultiSync = async () => {
    if (selectedTargetIds.length === 0) {
      showToast('error', 'Vui lòng chọn ít nhất 1 database đích!');
      return;
    }

    const sourceName = syncSourceId === 'local' ? 'Local DB' : databases.find(d => d.id === syncSourceId)?.name || 'Nguồn';
    const targetNames = selectedTargetIds.map(id => id === 'local' ? 'Local DB' : databases.find(d => d.id === id)?.name || id).join(', ');

    if (!confirm(`⚠️ CẢNH BÁO ĐỒNG BỘ CỰC KỲ NGUY HIỂM:\n\nHành động này sẽ XÓA SẠCH toàn bộ dữ liệu đang có trên các database đích:\n[ ${targetNames} ]\n\nĐể đồng bộ dữ liệu gốc từ database nguồn:\n[ ${sourceName} ]\n\n(Hệ thống sẽ tự động tạo backup cho các database đích trước khi ghi đè).\n\nBạn có chắc chắn muốn thực hiện?`)) return;

    setSyncLoading(true);
    try {
      const res = await fetchApi('/api/v1/admin/db-rotation/sync-multiple', {
        method: 'POST',
        body: JSON.stringify({
          sourceDbId: syncSourceId,
          targetDbIds: selectedTargetIds
        })
      });

      if (res?.failed && res.failed.length > 0) {
        showToast('warning', `Đồng bộ hoàn thành một phần. Thất bại tại: ${res.failed.join(', ')}`);
      } else {
        showToast('success', `Đồng bộ toàn bộ dữ liệu thành công sang các database đích!`);
      }
      loadDatabases();
      loadBackups();
      setSelectedTargetIds([]);
    } catch (err: any) {
      showToast('error', err.message || 'Lỗi khi tiến hành đồng bộ!');
    } finally {
      setSyncLoading(false);
    }
  };

  // BACKUP & RESTORE TAB HANDLERS
  const handleCreateBackup = async () => {
    setBackupLoading(true);
    try {
      await fetchApi('/api/v1/admin/db-rotation/backups/create', {
        method: 'POST',
        body: JSON.stringify({ dbId: selectedBackupDbId })
      });
      showToast('success', 'Tạo bản sao lưu thành công!');
      loadBackups();
    } catch (err: any) {
      showToast('error', err.message || 'Lỗi khi tạo bản sao lưu!');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleDeleteBackup = async (name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bản sao lưu "${name}"?`)) return;
    try {
      await fetchApi(`/api/v1/admin/db-rotation/backups/${name}`, {
        method: 'DELETE'
      });
      showToast('success', 'Xóa bản sao lưu thành công!');
      loadBackups();
    } catch (err: any) {
      showToast('error', err.message || 'Lỗi khi xóa bản sao lưu!');
    }
  };

  const handleOpenRestoreModal = (backupName: string) => {
    setSelectedRestoreBackup(backupName);
    setShowRestoreModal(true);
  };

  const handleRestoreBackup = async () => {
    const targetName = restoreTargetDbId === 'local' ? 'Local DB' : databases.find(d => d.id === restoreTargetDbId)?.name || 'Neon';
    if (!confirm(`⚠️ CẢNH BÁO GHI ĐÈ DỮ LIỆU:\n\nBạn chuẩn bị khôi phục bản sao lưu "${selectedRestoreBackup}" đè lên database "${targetName}". Toàn bộ dữ liệu hiện tại của database đích này sẽ bị THAY THẾ.\n\n(Hệ thống sẽ tự động tạo backup cho database đích trước khi khôi phục).\n\nBạn chắc chắn muốn tiếp tục?`)) return;

    setBackupLoading(true);
    setShowRestoreModal(false);
    try {
      await fetchApi('/api/v1/admin/db-rotation/backups/restore', {
        method: 'POST',
        body: JSON.stringify({
          backupName: selectedRestoreBackup,
          targetDbId: restoreTargetDbId
        })
      });
      showToast('success', `Khôi phục thành công lên ${targetName}!`);
      loadDatabases();
      loadBackups();
    } catch (err: any) {
      showToast('error', err.message || 'Khôi phục thất bại!');
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Icon name="settings" size={24} className="text-rose-500" />
            Trung tâm Đồng bộ & Xoay vòng DB (Neon / Local)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Cấu hình kết nối, đồng bộ dữ liệu đa kênh và quản lý sao lưu dự phòng an toàn.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'config' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
            }`}
          >
            Cấu Hình Kết Nối
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'sync' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
            }`}
          >
            Đồng Bộ Đa Kênh (Sync)
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'backup' ? 'bg-rose-500 text-white shadow-md shadow-rose-500/10' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200'
            }`}
          >
            Sao Lưu & Phục Hồi
          </button>
        </div>
      </div>

      {/* 1. CONFIGURATION TAB */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Tính năng nhanh:</span>
            <div className="flex gap-2">
              <button
                onClick={handleRotate}
                disabled={rotateLoading || databases.length <= 1}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-950/30 text-rose-500 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {rotateLoading ? <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-rose-500" /> : <Icon name="refresh" size={13} />}
                Xoay Vòng DB Ngay
              </button>
              <button
                onClick={() => {
                  setCurrentDb({ name: '', connectionUrl: '', isActive: false, sortOrder: databases.length });
                  setIsEditing(true);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-zinc-700 dark:hover:bg-zinc-650 transition-all cursor-pointer"
              >
                + Thêm DB Mới
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 space-y-6 animate-fadeIn">
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
                    className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg p-2.5 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 h-20 font-mono"
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
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 cursor-pointer"
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
                      <th className="p-4">Kích hoạt gần nhất</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databases.map(db => (
                      <tr key={db.id} className="border-b border-slate-55 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                        <td className="p-4 font-bold text-slate-700 dark:text-zinc-200">{db.name}</td>
                        <td className="p-4 font-mono text-slate-400 dark:text-zinc-400 max-w-xs truncate" title={db.connectionUrl}>
                          {db.connectionUrl}
                        </td>
                        <td className="p-4 font-bold text-slate-600 dark:text-zinc-300">{db.sortOrder}</td>
                        <td className="p-4 text-slate-500">
                          {db.lastSwitchedAt ? new Date(db.lastSwitchedAt).toLocaleString('vi-VN') : 'Chưa kích hoạt'}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            db.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-655 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}>
                            {db.isActive ? 'Đang hoạt động' : 'Chờ xoay vòng'}
                          </span>
                        </td>
                        <td className="p-4 text-center space-x-2">
                          <button
                            onClick={() => handleEdit(db)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded font-semibold hover:bg-slate-200 cursor-pointer"
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
      )}

      {/* 2. MULTI-SYNC TAB */}
      {activeTab === 'sync' && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Đồng bộ dữ liệu sang nhiều cơ sở dữ liệu con</h3>
            <p className="text-xs text-slate-400 mt-1">Giữ nguyên cơ sở dữ liệu nguồn, xóa hết các bảng và đồng bộ dữ liệu mới sang các database đích được chọn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50 dark:border-zinc-850">
            {/* Step 1: Source Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-600 dark:text-zinc-300 block">Bước 1: Chọn Database nguồn (Gốc cha)</label>
              <select
                value={syncSourceId}
                onChange={(e) => setSyncSourceId(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="local">Local DB (Đang kết nối)</option>
                {databases.map(db => (
                  <option key={db.id} value={db.id}>
                    {db.name} {db.isActive ? '(Active)' : ''}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">Dữ liệu từ database này sẽ được đọc và ghi đè sang các database đích.</p>
            </div>

            {/* Step 2: Target Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-600 dark:text-zinc-300 block">Bước 2: Chọn các Database đích (Nhận dữ liệu)</label>
              <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-zinc-700/55 max-h-48 overflow-y-auto space-y-2">
                {syncSourceId !== 'local' && (
                  <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-zinc-700/30 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTargetIds.includes('local')}
                      onChange={() => handleToggleTarget('local')}
                      className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-xs text-slate-700 dark:text-zinc-200 font-semibold">Local DB</span>
                  </label>
                )}
                {databases.map(db => {
                  if (db.id === syncSourceId) return null;
                  return (
                    <label key={db.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-zinc-700/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTargetIds.includes(db.id!)}
                        onChange={() => handleToggleTarget(db.id!)}
                        className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                      />
                      <span className="text-xs text-slate-700 dark:text-zinc-200 font-semibold">
                        {db.name} {db.isActive ? '(Active)' : ''}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Warning Card */}
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950/40 rounded-2xl p-4 flex gap-3 items-start">
            <Icon name="settings" size={20} className="text-rose-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-rose-700 dark:text-rose-455">Cảnh báo phá hủy dữ liệu!</h4>
              <p className="text-[11px] text-rose-600/90 dark:text-rose-400/90 leading-relaxed">
                Tất cả các database đích được chọn sẽ bị **xóa sạch toàn bộ bảng**. Sau đó, cấu trúc bảng mới sẽ được sinh ra từ code và toàn bộ dữ liệu từ database nguồn sẽ được ghi đè vào. Hệ thống sẽ tự động tạo một bản sao lưu (Backup) cho mỗi database đích trước khi tiến hành để đảm bảo an toàn.
              </p>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-zinc-800">
            <button
              onClick={handleMultiSync}
              disabled={syncLoading || selectedTargetIds.length === 0}
              className="px-6 py-3 text-xs font-bold rounded-xl text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-50 shadow-md shadow-rose-500/10 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              {syncLoading ? (
                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
              ) : (
                <Icon name="refresh" size={13} />
              )}
              Bắt Đầu Đồng Bộ Ngay
            </button>
          </div>
        </div>
      )}

      {/* 3. BACKUP & RESTORE TAB */}
      {activeTab === 'backup' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Create Manual Backup Box */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Tạo bản sao lưu thủ công</h3>
            <div className="flex flex-col sm:flex-row gap-3 items-end max-w-xl">
              <div className="flex-1 space-y-1">
                <label className="text-[11px] text-slate-400 block font-semibold">Chọn Database cần sao lưu</label>
                <select
                  value={selectedBackupDbId}
                  onChange={(e) => setSelectedBackupDbId(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-slate-700 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="local">Local DB (Đang kết nối)</option>
                  {databases.map(db => (
                    <option key={db.id} value={db.id}>{db.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCreateBackup}
                disabled={backupLoading}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-slate-850 text-white hover:bg-slate-900 dark:bg-zinc-700 dark:hover:bg-zinc-650 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {backupLoading ? <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" /> : <Icon name="settings" size={13} />}
                Tiến Hành Sao Lưu
              </button>
            </div>
          </div>

          {/* Backup List Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-50 dark:border-zinc-850">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Danh sách các bản sao lưu hiện có (db_backups/)</h3>
            </div>
            {backups.length === 0 ? (
              <div className="p-8 text-center text-slate-400">Không tìm thấy bản sao lưu nào. Hãy tạo một bản sao lưu trước.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-800/40 border-b border-slate-100 dark:border-zinc-800 text-slate-500 font-bold">
                      <th className="p-4">Tên bản sao lưu</th>
                      <th className="p-4">Số bảng</th>
                      <th className="p-4">Số hàng</th>
                      <th className="p-4">Thời gian tạo</th>
                      <th className="p-4 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backups.map(backup => (
                      <tr key={backup.name} className="border-b border-slate-50 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                        <td className="p-4 font-bold text-slate-700 dark:text-zinc-200">
                          <span className="bg-slate-100 dark:bg-zinc-850 px-2.5 py-1 rounded-lg text-slate-655 dark:text-zinc-300 font-mono text-[11px]">
                            {backup.name}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-600 dark:text-zinc-300">{backup.totalTables ?? 'Không rõ'}</td>
                        <td className="p-4 font-bold text-emerald-600 dark:text-emerald-450">
                          {backup.totalRows ? backup.totalRows.toLocaleString() : 'Không rõ'}
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(backup.createdAt).toLocaleString('vi-VN')}
                        </td>
                        <td className="p-4 text-center space-x-2">
                          <button
                            onClick={() => handleOpenRestoreModal(backup.name)}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-650 hover:bg-emerald-100 rounded font-semibold cursor-pointer"
                          >
                            Phục hồi
                          </button>
                          <button
                            onClick={() => handleDeleteBackup(backup.name)}
                            className="px-2.5 py-1 bg-red-50 text-red-650 hover:bg-red-100 rounded font-semibold cursor-pointer"
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
      )}

      {/* Restore Target Selection Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-150 dark:border-zinc-800 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Khôi phục bản sao lưu</h3>
              <button onClick={() => setShowRestoreModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <Icon name="settings" size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Bản sao lưu được chọn:</span>
                <span className="text-xs font-mono font-bold bg-slate-50 dark:bg-zinc-800 p-2 rounded-lg block text-slate-700 dark:text-white">
                  {selectedRestoreBackup}
                </span>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-zinc-300 block">Chọn Database đích để ghi đè dữ liệu</label>
                <select
                  value={restoreTargetDbId}
                  onChange={(e) => setRestoreTargetDbId(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-slate-700 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="local">Local DB (Đang kết nối)</option>
                  {databases.map(db => (
                    <option key={db.id} value={db.id}>{db.name}</option>
                  ))}
                </select>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950/40 rounded-xl text-[11px] text-amber-700 dark:text-amber-450 leading-relaxed font-semibold">
                ⚠️ Lưu ý: Khi khôi phục, toàn bộ cấu trúc và dữ liệu hiện tại của DB đích này sẽ bị thay thế bằng dữ liệu trong bản sao lưu này. Một bản backup đè cũng sẽ tự động được ghi nhận.
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleRestoreBackup}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
              >
                Xác Nhận Khôi Phục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
