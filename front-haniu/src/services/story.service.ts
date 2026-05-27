import { fetchApi } from '@/lib/api';

export interface StoryPayload {
  id?: string;
  title: string;
  subtitle?: string;
  content?: string;
  videoPlaceholderUrl?: string;
  videoTitle?: string;
}

export const storyService = {
  getStory: async (): Promise<StoryPayload> => {
    return fetchApi('/api/v1/stories');
  },

  updateStory: async (payload: StoryPayload): Promise<StoryPayload> => {
    return fetchApi('/api/v1/stories', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
