import { fetchApi } from '@/lib/api';

export interface ContactSubmissionPayload {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
}

export const contactService = {
  submitContact: async (payload: ContactSubmissionPayload) => {
    return fetchApi('/api/v1/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getAllSubmissions: async () => {
    return fetchApi('/api/v1/contacts');
  },

  markAsRead: async (id: string) => {
    return fetchApi(`/api/v1/contacts/${id}/read`, {
      method: 'PUT',
    });
  },

  deleteSubmission: async (id: string) => {
    return fetchApi(`/api/v1/contacts/${id}`, {
      method: 'DELETE',
    });
  }
};
