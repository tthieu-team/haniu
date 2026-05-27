import { create } from 'zustand';
import { storyService, StoryPayload } from '@/services/story.service';

interface StoryState {
  story: StoryPayload | null;
  loading: boolean;
  error: string | null;

  fetchStory: () => Promise<StoryPayload | null>;
  updateStory: (payload: StoryPayload) => Promise<StoryPayload>;
}

export const useStoryStore = create<StoryState>((set) => ({
  story: null,
  loading: false,
  error: null,

  fetchStory: async () => {
    set({ loading: true, error: null });
    try {
      const data = await storyService.getStory();
      set({ story: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy câu chuyện thương hiệu' });
      return null;
    }
  },

  updateStory: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await storyService.updateStory(payload);
      set({ story: data, loading: false });
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi cập nhật câu chuyện thương hiệu' });
      throw err;
    }
  },
}));
