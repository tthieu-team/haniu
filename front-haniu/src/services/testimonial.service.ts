import { fetchApi } from '@/lib/api';

export interface TestimonialPayload {
  id?: string;
  name: string;
  role?: string;
  content?: string;
  rating: number;
  avatar?: string;
  active: boolean;
}

export const testimonialService = {
  getActiveTestimonials: async (): Promise<TestimonialPayload[]> => {
    return fetchApi('/api/v1/testimonials');
  },

  getAllTestimonials: async (): Promise<TestimonialPayload[]> => {
    return fetchApi('/api/v1/testimonials/all');
  },

  createTestimonial: async (payload: TestimonialPayload): Promise<TestimonialPayload> => {
    return fetchApi('/api/v1/testimonials', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateTestimonial: async (id: string, payload: TestimonialPayload): Promise<TestimonialPayload> => {
    return fetchApi(`/api/v1/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteTestimonial: async (id: string): Promise<void> => {
    return fetchApi(`/api/v1/testimonials/${id}`, {
      method: 'DELETE',
    });
  },
};
