'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/common/Icons';
import { userService, AdminUser, UserStats } from '@/services/user.service';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    avatarUrl: '',
    gender: 'OTHER',
    role: 'USER' as 'USER' | 'ADMIN',
    status: 'ACTIVE' as 'ACTIVE' | 'BLOCKED' | 'PENDING',
    emailVerified: true,
    phoneVerified: false,
    sendEmail: true,
  });

  const [resetPasswordData, setResetPasswordData] = useState({
    customPassword: '',
    sendEmail: true,
    generatedPassword: '',
    isCustom: false,
    successResult: null as { newPassword: string; emailSent: boolean } | null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage({ type, text });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(0);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load stats
  const fetchStats = async () => {
    try {
      const data = await userService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Lỗi khi tải thống kê người dùng:', err);
    }
  };

  // Load users list
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers({
        q: debouncedQuery,
        role: selectedRole,
        status: selectedStatus,
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDir,
      });

      if (res && res.content) {
        setUsers(res.content);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
      } else if (Array.isArray(res)) {
        setUsers(res);
        setTotalPages(1);
        setTotalElements(res.length);
      }
    } catch (err: any) {
      console.error('Lỗi khi tải danh sách người dùng:', err);
      showToast(err.message || 'Lỗi khi tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedRole, selectedStatus, currentPage, pageSize, sortBy, sortDir]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Random password generator helper
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let pass = 'Haniu@';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // Actions
  const handleOpenCreateModal = () => {
    const autoPass = generateRandomPassword();
    setUserFormData({
      email: '',
      password: autoPass,
      fullName: '',
      phone: '',
      avatarUrl: '',
      gender: 'OTHER',
      role: 'USER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: false,
      sendEmail: true,
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setUserFormData({
      email: user.email,
      password: '',
      fullName: user.fullName || '',
      phone: user.phone || '',
      avatarUrl: user.avatarUrl || '',
      gender: user.gender || 'OTHER',
      role: user.role || 'USER',
      status: user.status || 'ACTIVE',
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      sendEmail: false,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = async (user: AdminUser) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
    try {
      const detailed = await userService.getUser(user.id);
      setSelectedUser(detailed);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết người dùng:', err);
    }
  };

  const handleOpenResetPasswordModal = (user: AdminUser) => {
    setSelectedUser(user);
    const generated = generateRandomPassword();
    setResetPasswordData({
      customPassword: '',
      sendEmail: true,
      generatedPassword: generated,
      isCustom: false,
      successResult: null,
    });
    setIsResetPasswordModalOpen(true);
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const actionName = nextStatus === 'ACTIVE' ? 'Mở khóa' : 'Khóa';
    if (!confirm(`Bạn có chắc muốn ${actionName} tài khoản "${user.email}"?`)) return;

    try {
      await userService.changeStatus(user.id, nextStatus);
      showToast(`${actionName} tài khoản thành công!`, 'success');
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      showToast(err.message || `Không thể ${actionName} tài khoản`, 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      await userService.deleteUser(selectedUser.id);
      showToast(`Đã xóa tài khoản "${selectedUser.email}" thành công!`, 'success');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi xóa người dùng', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await userService.createUser(userFormData);
      showToast(`Đã tạo tài khoản thành công cho "${userFormData.email}"!`, 'success');
      setIsCreateModalOpen(false);
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi tạo tài khoản', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      await userService.updateUser(selectedUser.id, userFormData);
      showToast(`Cập nhật thông tin tài khoản thành công!`, 'success');
      setIsEditModalOpen(false);
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi cập nhật tài khoản', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      const passToSend = resetPasswordData.isCustom && resetPasswordData.customPassword.trim()
        ? resetPasswordData.customPassword.trim()
        : resetPasswordData.generatedPassword;

      const res = await userService.resetPassword(selectedUser.id, {
        newPassword: passToSend,
        sendEmail: resetPasswordData.sendEmail,
      });

      setResetPasswordData(prev => ({
        ...prev,
        successResult: {
          newPassword: res.newPassword || passToSend,
          emailSent: Boolean(res.emailSent),
        },
      }));

      showToast(
        res.emailSent
          ? `Đã cấp lại mật khẩu và gửi email thành công tới ${selectedUser.email}!`
          : `Đã đổi mật khẩu thành công!`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Lỗi khi cấp lại mật khẩu', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider text-white transition-all transform animate-bounce duration-300 ${
            feedbackMessage.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          <Icon name={feedbackMessage.type === 'success' ? 'check' : 'close'} size={16} />
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent border border-rose-500/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/25 text-rose-600 dark:text-rose-450 border border-rose-500/20">
                SECURITY & USERS
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold">• Quản lý Người Dùng & Phân Quyền</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-zinc-150 uppercase tracking-tight italic font-sans flex items-center gap-2.5">
              <Icon name="users" size={26} className="text-rose-600" />
              <span>QUẢN LÝ <span className="bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">TÀI KHOẢN NGƯỜI DÙNG</span></span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xl mt-1">
              Quản lý danh sách thành viên đăng nhập, phân quyền quản trị, cấp lại mật khẩu và gửi email tự động tới người dùng.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Icon name="plus" size={14} />
              <span>Thêm Tài Khoản Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[
          {
            label: 'Tổng Tài Khoản',
            value: stats?.totalUsers ?? '...',
            icon: 'users',
            color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          },
          {
            label: 'Đang Hoạt Động',
            value: stats?.activeUsers ?? '...',
            icon: 'check',
            color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          },
          {
            label: 'Quản Trị Viên (Admin)',
            value: stats?.adminUsers ?? '...',
            icon: 'crown',
            color: 'from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-450 border-rose-500/20',
          },
          {
            label: 'Tài Khoản Bị Khóa',
            value: stats?.blockedUsers ?? '...',
            icon: 'close',
            color: 'from-red-500/10 to-rose-500/10 text-red-600 dark:text-red-400 border-red-500/20',
          },
          {
            label: 'Mới Trong Tháng',
            value: stats?.newUsersThisMonth ?? '...',
            icon: 'sparkles',
            color: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {item.label}
              </span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br border ${item.color}`}>
                <Icon name={item.icon} size={14} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-800 dark:text-zinc-100 font-mono tracking-tight">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
        
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Icon name="search" size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850/50 text-xs font-semibold text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Icon name="close" size={13} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(0);
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-bold text-slate-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên (ADMIN)</option>
              <option value="USER">Khách hàng (USER)</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(0);
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-bold text-slate-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động (ACTIVE)</option>
              <option value="BLOCKED">Bị khóa (BLOCKED)</option>
              <option value="PENDING">Chờ duyệt (PENDING)</option>
            </select>

            {/* Refresh */}
            <button
              onClick={() => {
                fetchUsers();
                fetchStats();
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-slate-600 dark:text-zinc-400 hover:text-rose-600 hover:border-rose-500/30 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Làm mới dữ liệu"
            >
              <Icon name="refresh" size={15} className={loading ? 'animate-spin text-rose-500' : ''} />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-zinc-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-zinc-850/60 border-b border-slate-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                <th className="p-4">Tài Khoản</th>
                <th className="p-4">Liên Hệ</th>
                <th className="p-4">Vai Trò</th>
                <th className="p-4">Trạng Thái</th>
                <th className="p-4">Lịch Sử Mua Hàng</th>
                <th className="p-4">Ngày Tạo / Đăng Nhập</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-7 w-7 border-2 border-rose-500 border-t-transparent" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Đang tải danh sách người dùng...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Icon name="users" size={32} className="text-slate-300 dark:text-zinc-700" />
                      <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Không tìm thấy tài khoản nào phù hợp</span>
                      <p className="text-[10px] text-slate-400">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isAdmin = user.role === 'ADMIN';
                  const isBlocked = user.status === 'BLOCKED';
                  const initials = (user.fullName || user.email || 'U').substring(0, 2).toUpperCase();

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-850/40 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                              {initials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 dark:text-zinc-200 truncate flex items-center gap-1.5">
                              <span>{user.fullName || 'Chưa đặt tên'}</span>
                              {user.emailVerified && (
                                <span title="Email đã xác thực" className="text-emerald-500">
                                  <Icon name="check" size={13} />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 truncate">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="text-slate-700 dark:text-zinc-300 font-mono text-xs flex items-center gap-1">
                            {user.phone ? (
                              <>
                                <Icon name="phone" size={11} className="text-slate-400" />
                                <span>{user.phone}</span>
                              </>
                            ) : (
                              '—'
                            )}
                          </div>
                          {user.gender && (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[9px] text-slate-500 uppercase font-semibold">
                              {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isAdmin
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/20'
                              : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                          }`}
                        >
                          {isAdmin ? (
                            <>
                              <Icon name="crown" size={12} className="text-rose-600 dark:text-rose-450" />
                              <span>ADMIN</span>
                            </>
                          ) : (
                            <>
                              <Icon name="user" size={12} />
                              <span>USER</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : user.status === 'BLOCKED'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'ACTIVE'
                                ? 'bg-emerald-500 animate-pulse'
                                : user.status === 'BLOCKED'
                                ? 'bg-red-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {user.status === 'ACTIVE' ? 'Hoạt động' : user.status === 'BLOCKED' ? 'Bị khóa' : 'Chờ duyệt'}
                        </span>
                      </td>

                      {/* Orders & Spending */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1">
                            <Icon name="bag" size={12} className="text-slate-400" />
                            <span>{user.totalOrders} đơn hàng</span>
                          </div>
                          <div className="text-[10px] text-rose-600 dark:text-rose-450 font-bold font-mono">
                            {formatCurrency(user.totalSpent)}
                          </div>
                        </div>
                      </td>

                      {/* Created / Last login */}
                      <td className="p-4 text-[11px] text-slate-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1">
                          <Icon name="calendar" size={11} className="text-slate-400" />
                          <span>Tạo: {formatDate(user.createdAt)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Đăng nhập: {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Chưa đăng nhập'}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => handleOpenDetailModal(user)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                            title="Xem chi tiết tài khoản"
                          >
                            <Icon name="eye" size={14} />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => handleOpenResetPasswordModal(user)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-colors cursor-pointer"
                            title="Cấp lại mật khẩu & Gửi Email"
                          >
                            <Icon name="key" size={14} />
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin"
                          >
                            <Icon name="edit" size={14} />
                          </button>

                          {/* Toggle Block / Unblock */}
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isBlocked
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border-emerald-500/20'
                                : 'bg-slate-100 hover:bg-amber-500/10 text-slate-500 hover:text-amber-600 border-slate-200'
                            }`}
                            title={isBlocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                          >
                            <Icon name={isBlocked ? 'user-check' : 'user-x'} size={14} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/15 text-red-500 border border-red-500/15 transition-colors cursor-pointer"
                            title="Xóa tài khoản"
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400">
            Hiển thị <span className="font-bold text-slate-700 dark:text-zinc-200">{users.length}</span> trong tổng số{' '}
            <span className="font-bold text-slate-700 dark:text-zinc-200">{totalElements}</span> người dùng
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-850 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Icon name="arrow-left" size={12} />
              <span>Trang trước</span>
            </button>
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 px-2">
              {currentPage + 1} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-850 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Trang sau</span>
              <Icon name="arrow-right" size={12} />
            </button>
          </div>
        </div>

      </div>

      {/* ================= MODAL 1: RESET PASSWORD & SEND EMAIL ================= */}
      {isResetPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                  <Icon name="key" size={16} className="text-amber-500" />
                  <span>Cấp Lại Mật Khẩu</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[280px]">
                  Tài khoản: <span className="font-bold text-rose-500">{selectedUser.email}</span>
                </p>
              </div>
              <button
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-4">
              {resetPasswordData.successResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                      <Icon name="check" size={20} />
                    </div>
                    <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400">
                      Cấp lại mật khẩu thành công!
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Mật khẩu mới đã được cập nhật vào cơ sở dữ liệu.
                    </p>
                    <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-emerald-400 flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-slate-800 dark:text-zinc-100 tracking-wider">
                        {resetPasswordData.successResult.newPassword}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(resetPasswordData.successResult?.newPassword || '');
                          showToast('Đã sao chép mật khẩu vào bộ nhớ tạm!');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <Icon name="copy" size={12} />
                        <span>Sao chép</span>
                      </button>
                    </div>

                    {resetPasswordData.successResult.emailSent ? (
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Icon name="mail" size={13} />
                        <span>Đã gửi thông tin mật khẩu mới về email của người dùng!</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-amber-600 dark:text-amber-400">
                        (Không gửi email theo tùy chọn)
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsResetPasswordModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-xs uppercase cursor-pointer"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              ) : (
                <>
                  {/* Option switch: Random or Custom */}
                  <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-800 p-1">
                    <button
                      type="button"
                      onClick={() => setResetPasswordData((prev) => ({ ...prev, isCustom: false }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        !resetPasswordData.isCustom
                          ? 'bg-white dark:bg-zinc-900 text-rose-600 shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Tự tạo ngẫu nhiên
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetPasswordData((prev) => ({ ...prev, isCustom: true }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        resetPasswordData.isCustom
                          ? 'bg-white dark:bg-zinc-900 text-rose-600 shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      Nhập thủ công
                    </button>
                  </div>

                  {resetPasswordData.isCustom ? (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                        Mật khẩu mới
                      </label>
                      <input
                        type="text"
                        required
                        value={resetPasswordData.customPassword}
                        onChange={(e) =>
                          setResetPasswordData((prev) => ({ ...prev, customPassword: e.target.value }))
                        }
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                        Mật khẩu ngẫu nhiên được tạo
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 font-mono font-black text-sm text-slate-800 dark:text-zinc-200">
                          {resetPasswordData.generatedPassword}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setResetPasswordData((prev) => ({
                              ...prev,
                              generatedPassword: generateRandomPassword(),
                            }))
                          }
                          className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-slate-600 hover:text-rose-600 cursor-pointer"
                          title="Tạo chuỗi ngẫu nhiên khác"
                        >
                          <Icon name="refresh" size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Send Email Checkbox */}
                  <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/15 flex items-center justify-between">
                    <div className="space-y-0.5 pr-2">
                      <div className="text-xs font-black uppercase text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <Icon name="mail" size={14} className="text-rose-600" />
                        <span>Gửi mật khẩu mới tới email</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Tự động gửi email thông báo mật khẩu đăng nhập tới <strong>{selectedUser.email}</strong>
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={resetPasswordData.sendEmail}
                      onChange={(e) =>
                        setResetPasswordData((prev) => ({ ...prev, sendEmail: e.target.checked }))
                      }
                      className="w-5 h-5 rounded-lg text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsResetPasswordModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 text-xs font-bold uppercase hover:bg-slate-50 cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Đang xử lý...' : 'Xác Nhận Đổi Mật Khẩu'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CREATE NEW USER ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                <Icon name="plus" size={16} className="text-rose-500" />
                <span>Thêm Tài Khoản Mới</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Email Đăng Nhập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Mật Khẩu Ban Đầu
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={userFormData.password}
                      onChange={(e) => setUserFormData((prev) => ({ ...prev, password: e.target.value }))}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 font-mono text-xs font-bold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setUserFormData((prev) => ({ ...prev, password: generateRandomPassword() }))}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                    >
                      <Icon name="refresh" size={12} />
                      <span>Tạo lại</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Họ và Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userFormData.fullName}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="0987654321"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Vai Trò (Role)
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, role: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-bold focus:outline-none"
                  >
                    <option value="USER">Khách hàng (USER)</option>
                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Trạng Thái
                  </label>
                  <select
                    value={userFormData.status}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-bold focus:outline-none"
                  >
                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                    <option value="BLOCKED">Bị khóa (BLOCKED)</option>
                    <option value="PENDING">Chờ duyệt (PENDING)</option>
                  </select>
                </div>
              </div>

              {/* Send email checkbox */}
              <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/15 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-black uppercase text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Icon name="mail" size={14} className="text-rose-600" />
                    <span>Gửi thông tin đăng nhập qua Email</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Gửi email chào mừng kèm thông tin tài khoản và mật khẩu tới người dùng mới.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userFormData.sendEmail}
                  onChange={(e) => setUserFormData((prev) => ({ ...prev, sendEmail: e.target.checked }))}
                  className="w-5 h-5 rounded-lg text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 text-xs font-bold uppercase hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Đang tạo...' : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: EDIT USER ================= */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                  <Icon name="edit" size={16} className="text-blue-500" />
                  <span>Chỉnh Sửa Thông Tin Tài Khoản</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">{selectedUser.email}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    required
                    value={userFormData.fullName}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Số Điện Thoại
                  </label>
                  <input
                    type="text"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Giới Tính
                  </label>
                  <select
                    value={userFormData.gender}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-bold focus:outline-none"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Vai Trò (Role)
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, role: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-bold focus:outline-none"
                  >
                    <option value="USER">Khách hàng (USER)</option>
                    <option value="ADMIN">Quản trị viên (ADMIN)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-600 dark:text-zinc-300">
                    Trạng Thái
                  </label>
                  <select
                    value={userFormData.status}
                    onChange={(e) => setUserFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-850 text-xs font-bold focus:outline-none"
                  >
                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                    <option value="BLOCKED">Bị khóa (BLOCKED)</option>
                    <option value="PENDING">Chờ duyệt (PENDING)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 text-xs font-bold uppercase hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: VIEW USER DETAIL ================= */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                <Icon name="file-text" size={16} className="text-indigo-500" />
                <span>Chi Tiết Hồ Sơ Người Dùng</span>
              </h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                <Icon name="close" size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-850/50 border border-slate-200/60 dark:border-zinc-800">
                {selectedUser.avatarUrl ? (
                  <img
                    src={selectedUser.avatarUrl}
                    alt={selectedUser.fullName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-rose-500 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                    {(selectedUser.fullName || selectedUser.email || 'U').substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-800 dark:text-zinc-100 uppercase">
                    {selectedUser.fullName || 'Chưa cập nhật tên'}
                  </h4>
                  <div className="font-mono text-xs text-slate-500 dark:text-zinc-400">{selectedUser.email}</div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1">
                      <Icon name="crown" size={10} />
                      <span>{selectedUser.role}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Icon name="phone" size={11} />
                    <span>Số điện thoại</span>
                  </div>
                  <div className="font-mono font-bold text-slate-700 dark:text-zinc-300 mt-0.5">
                    {selectedUser.phone || 'Chưa có'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Icon name="bag" size={11} />
                    <span>Tổng đơn hàng</span>
                  </div>
                  <div className="font-mono font-black text-slate-800 dark:text-zinc-100 mt-0.5">
                    {selectedUser.totalOrders} đơn
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Icon name="credit-card" size={11} />
                    <span>Tổng chi tiêu</span>
                  </div>
                  <div className="font-mono font-black text-rose-600 dark:text-rose-450 mt-0.5">
                    {formatCurrency(selectedUser.totalSpent)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Icon name="calendar" size={11} />
                    <span>Ngày đăng ký</span>
                  </div>
                  <div className="text-slate-600 dark:text-zinc-400 mt-0.5">
                    {formatDate(selectedUser.createdAt)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Icon name="hourglass" size={11} />
                    <span>Đăng nhập cuối</span>
                  </div>
                  <div className="text-slate-600 dark:text-zinc-400 mt-0.5">
                    {formatDate(selectedUser.lastLoginAt)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-100 dark:border-zinc-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Icon name="mail" size={11} />
                    <span>Xác thực Email</span>
                  </div>
                  <div className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <Icon name="check" size={12} />
                    <span>{selectedUser.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Icon name="list" size={13} />
                  <span>Đơn Hàng Gần Đây ({selectedUser.recentOrders?.length || 0})</span>
                </h4>
                {selectedUser.recentOrders && selectedUser.recentOrders.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
                    {selectedUser.recentOrders.map((ord) => (
                      <div key={ord.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-zinc-850">
                        <div>
                          <div className="font-mono font-bold text-slate-800 dark:text-zinc-200">#{ord.orderCode}</div>
                          <div className="text-[10px] text-slate-400">{formatDate(ord.createdAt)}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-rose-600 font-mono">{formatCurrency(ord.totalAmount)}</div>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Người dùng chưa phát sinh đơn hàng nào.</p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: DELETE CONFIRMATION ================= */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Icon name="trash" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-100">
                Xác Nhận Xóa Tài Khoản?
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Bạn có chắc chắn muốn xóa tài khoản <strong>{selectedUser.email}</strong> không? Hành động này sẽ khóa quyền đăng nhập của người dùng.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 text-xs font-bold uppercase hover:bg-slate-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider shadow-md disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Đang xóa...' : 'Xóa Tài Khoản'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
