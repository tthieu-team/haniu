'use client';

import React, { useState, useEffect } from 'react';
import { contactService, ContactSubmissionPayload } from '@/services/contact.service';
import Icon from '@/components/common/Icons';

export default function AdminContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmissionPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactSubmissionPayload | null>(null);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await contactService.getAllSubmissions();
      setSubmissions(data || []);
    } catch (err) {
      console.error('Failed to load contact submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactService.markAsRead(id);
      setSubmissions(prev => 
        prev.map(item => item.id === id ? { ...item, isRead: true } : item)
      );
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(prev => prev ? { ...prev, isRead: true } : null);
      }
    } catch (err) {
      console.error('Failed to mark contact as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) return;
    try {
      await contactService.deleteSubmission(id);
      setSubmissions(prev => prev.filter(item => item.id !== id));
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(null);
      }
    } catch (err) {
      console.error('Failed to delete contact submission:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
          Quản lý Thư liên hệ
        </h1>
        <p className="text-xs text-slate-400">
          Xem và quản lý các ý kiến, phản hồi, thắc mắc gửi từ khách hàng thông qua trang Liên hệ.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Submissions List */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Đang tải danh sách thư liên hệ...</div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Chưa có thư liên hệ nào được gửi.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-450 font-bold">
                    <th className="p-4 w-12 text-center">Trạng thái</th>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">Tiêu đề</th>
                    <th className="p-4 w-28">Ngày gửi</th>
                    <th className="p-4 text-center w-20">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((contact) => (
                    <tr 
                      key={contact.id} 
                      onClick={() => {
                        setSelectedContact(contact);
                        if (!contact.isRead && contact.id) {
                          handleMarkAsRead(contact.id);
                        }
                      }}
                      className={`border-b border-slate-50 dark:border-zinc-800/60 hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-rose-500/[0.03] dark:bg-rose-500/[0.04]' : ''
                      } ${!contact.isRead ? 'font-bold' : ''}`}
                    >
                      <td className="p-4 text-center">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                          contact.isRead ? 'bg-slate-300 dark:bg-zinc-700' : 'bg-rose-500 animate-pulse'
                        }`} />
                      </td>
                      <td className="p-4">
                        <p className="text-slate-800 dark:text-zinc-200">{contact.fullName}</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal">{contact.email}</p>
                      </td>
                      <td className="p-4 text-slate-700 dark:text-zinc-350 max-w-xs truncate">
                        {contact.subject || '(Không có tiêu đề)'}
                      </td>
                      <td className="p-4 text-slate-550 dark:text-zinc-450 font-normal">
                        {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit'
                        }) : '---'}
                      </td>
                      <td className="p-4 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => contact.id && handleDelete(contact.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg cursor-pointer transition-all"
                          title="Xóa thư liên hệ"
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

        {/* Selected Submission Detail */}
        <div className="lg:col-span-5">
          {selectedContact ? (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm p-6 space-y-6 animate-fade-in sticky top-24">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    Chi tiết thư liên hệ
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Gửi lúc {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString('vi-VN') : '---'}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  selectedContact.isRead ? 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-450' : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {selectedContact.isRead ? 'Đã đọc' : 'Mới'}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-zinc-800/60 pb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Khách hàng</span>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200">{selectedContact.fullName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Số điện thoại</span>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200">{selectedContact.phone || '(Trống)'}</p>
                  </div>
                </div>

                <div className="border-b border-slate-100 dark:border-zinc-800/60 pb-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Email</span>
                  <a href={`mailto:${selectedContact.email}`} className="font-semibold text-rose-500 hover:underline">{selectedContact.email}</a>
                </div>

                <div className="border-b border-slate-100 dark:border-zinc-800/60 pb-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Tiêu đề liên hệ</span>
                  <p className="font-semibold text-slate-800 dark:text-zinc-200">{selectedContact.subject || '(Trống)'}</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Nội dung tin nhắn</span>
                  <div className="bg-slate-50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-150/40 dark:border-zinc-800/40 text-slate-650 dark:text-zinc-300 font-normal leading-relaxed whitespace-pre-line max-h-[300px] overflow-y-auto">
                    {selectedContact.message}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-zinc-850 pt-4">
                <button
                  onClick={() => selectedContact.id && handleDelete(selectedContact.id)}
                  className="px-4 py-2.5 text-xs font-bold rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  Xóa thư
                </button>
                <a
                  href={`mailto:${selectedContact.email}?subject=Phản hồi từ Haniu: ${selectedContact.subject || ''}`}
                  className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 text-center cursor-pointer transition-all"
                >
                  Trả lời qua Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800 py-16 text-center text-slate-400 text-xs">
              <Icon name="mail" size={24} className="mx-auto text-slate-300 mb-2" />
              Chọn một liên hệ từ danh sách để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
