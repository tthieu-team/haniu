import { create } from 'zustand';
import { catalogService, Recipient } from '@/services/catalog.service';

interface RecipientState {
  recipients: Recipient[];
  loading: boolean;
  error: string | null;

  fetchRecipients: () => Promise<Recipient[]>;
  saveRecipient: (payload: Recipient) => Promise<Recipient>;
  deleteRecipient: (id: string) => Promise<void>;
}

export const useRecipientStore = create<RecipientState>((set) => ({
  recipients: [],
  loading: false,
  error: null,

  fetchRecipients: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getAllRecipients();
      set({ recipients: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách đối tượng người nhận' });
      return [];
    }
  },

  saveRecipient: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.createRecipient(payload);
      set((state) => {
        const exists = state.recipients.some((r) => r.id === data.id);
        const updatedRecipients = exists
          ? state.recipients.map((r) => (r.id === data.id ? data : r))
          : [data, ...state.recipients];
        return {
          recipients: updatedRecipients,
          loading: false,
        };
      });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lưu thông tin đối tượng người nhận' });
      throw err;
    }
  },

  deleteRecipient: async (id) => {
    set({ loading: true, error: null });
    try {
      await catalogService.deleteRecipient(id);
      set((state) => ({
        recipients: state.recipients.filter((r) => r.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi xóa đối tượng người nhận' });
      throw err;
    }
  },
}));
