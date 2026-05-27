import { create } from 'zustand';
import { testimonialService, TestimonialPayload } from '@/services/testimonial.service';

interface TestimonialState {
  testimonials: TestimonialPayload[];
  activeTestimonials: TestimonialPayload[];
  loading: boolean;
  error: string | null;

  fetchTestimonials: () => Promise<TestimonialPayload[]>;
  fetchActiveTestimonials: () => Promise<TestimonialPayload[]>;
  createTestimonial: (payload: TestimonialPayload) => Promise<TestimonialPayload>;
  updateTestimonial: (id: string, payload: TestimonialPayload) => Promise<TestimonialPayload>;
  deleteTestimonial: (id: string) => Promise<void>;
}

export const useTestimonialStore = create<TestimonialState>((set) => ({
  testimonials: [],
  activeTestimonials: [],
  loading: false,
  error: null,

  fetchTestimonials: async () => {
    set({ loading: true, error: null });
    try {
      const data = await testimonialService.getAllTestimonials();
      set({ testimonials: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách đánh giá' });
      return [];
    }
  },

  fetchActiveTestimonials: async () => {
    set({ loading: true, error: null });
    try {
      const data = await testimonialService.getActiveTestimonials();
      set({ activeTestimonials: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách đánh giá hoạt động' });
      return [];
    }
  },

  createTestimonial: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await testimonialService.createTestimonial(payload);
      set((state) => ({
        testimonials: [data, ...state.testimonials],
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi tạo đánh giá mới' });
      throw err;
    }
  },

  updateTestimonial: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const data = await testimonialService.updateTestimonial(id, payload);
      set((state) => ({
        testimonials: state.testimonials.map((t) => (t.id === id ? data : t)),
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi cập nhật đánh giá' });
      throw err;
    }
  },

  deleteTestimonial: async (id) => {
    set({ loading: true, error: null });
    try {
      await testimonialService.deleteTestimonial(id);
      set((state) => ({
        testimonials: state.testimonials.filter((t) => t.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi xóa đánh giá' });
      throw err;
    }
  },
}));
