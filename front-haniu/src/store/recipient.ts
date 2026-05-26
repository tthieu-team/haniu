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

const normalizeRecipient = (r: any): Recipient => {
  if (!r) return r;
  const activeVal = r.active !== undefined ? r.active : (r.isActive !== undefined ? r.isActive : true);
  return {
    ...r,
    active: activeVal,
    isActive: activeVal,
  };
};

const preparePayload = (payload: Recipient): any => {
  const activeVal = payload.isActive !== undefined ? payload.isActive : ((payload as any).active !== undefined ? (payload as any).active : true);
  return {
    ...payload,
    active: activeVal,
    isActive: activeVal,
  };
};

export const useRecipientStore = create<RecipientState>((set) => ({
  recipients: [],
  loading: false,
  error: null,

  fetchRecipients: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getAllRecipients();
      const normalized = (data || []).map(normalizeRecipient);
      set({ recipients: normalized, loading: false });
      return normalized;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách đối tượng người nhận' });
      return [];
    }
  },

  saveRecipient: async (payload) => {
    set({ loading: true, error: null });
    try {
      const body = preparePayload(payload);
      const data = await catalogService.createRecipient(body);
      const normalized = normalizeRecipient(data);
      set((state) => {
        const exists = state.recipients.some((r) => r.id === normalized.id);
        const updatedRecipients = exists
          ? state.recipients.map((r) => (r.id === normalized.id ? normalized : r))
          : [normalized, ...state.recipients];
        return {
          recipients: updatedRecipients,
          loading: false,
        };
      });
      return normalized;
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
