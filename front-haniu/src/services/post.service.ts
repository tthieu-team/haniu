import { fetchApi } from '@/lib/api';

export interface PostPayload {
  id?: string;
  title: string;
  slug?: string;
  summary?: string;
  content?: string;
  imageUrl?: string;
  active: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const postService = {
  getActivePosts: async () => {
    return fetchApi('/api/v1/posts');
  },

  getAllPosts: async () => {
    return fetchApi('/api/v1/posts/all');
  },

  getPostBySlug: async (slug: string) => {
    return fetchApi(`/api/v1/posts/${slug}`);
  },

  createPost: async (payload: PostPayload) => {
    return fetchApi('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updatePost: async (id: string, payload: PostPayload) => {
    return fetchApi(`/api/v1/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deletePost: async (id: string) => {
    return fetchApi(`/api/v1/posts/${id}`, {
      method: 'DELETE',
    });
  }
};
