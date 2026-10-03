import { fetchApi } from '@/lib/api';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  gender?: string;
  birthday?: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED' | 'PENDING';
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  totalOrders: number;
  totalSpent: number;
  recentOrders?: {
    id: string;
    orderCode: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  blockedUsers: number;
  newUsersThisMonth: number;
}

export interface UserFilterParams {
  q?: string;
  role?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export const userService = {
  getStats: async (): Promise<UserStats> => {
    return await fetchApi('/api/v1/admin/users/stats');
  },

  getUsers: async (params: UserFilterParams = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.role) query.append('role', params.role);
    if (params.status) query.append('status', params.status);
    if (params.page !== undefined) query.append('page', params.page.toString());
    if (params.size !== undefined) query.append('size', params.size.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortDir) query.append('sortDir', params.sortDir);

    const queryString = query.toString();
    return await fetchApi(`/api/v1/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getUser: async (id: string): Promise<AdminUser> => {
    return await fetchApi(`/api/v1/admin/users/${id}`);
  },

  createUser: async (payload: any): Promise<AdminUser> => {
    return await fetchApi('/api/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateUser: async (id: string, payload: any): Promise<AdminUser> => {
    return await fetchApi(`/api/v1/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  changeStatus: async (id: string, status: string) => {
    return await fetchApi(`/api/v1/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  resetPassword: async (id: string, payload: { newPassword?: string; sendEmail?: boolean }) => {
    return await fetchApi(`/api/v1/admin/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  deleteUser: async (id: string) => {
    return await fetchApi(`/api/v1/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};
