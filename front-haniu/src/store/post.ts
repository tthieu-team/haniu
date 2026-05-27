import { create } from 'zustand';
import { postService, PostPayload } from '@/services/post.service';

interface PostState {
  posts: PostPayload[];
  activePosts: PostPayload[];
  loading: boolean;
  error: string | null;

  fetchPosts: () => Promise<PostPayload[]>;
  fetchActivePosts: () => Promise<PostPayload[]>;
  createPost: (payload: PostPayload) => Promise<PostPayload>;
  updatePost: (id: string, payload: PostPayload) => Promise<PostPayload>;
  deletePost: (id: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  activePosts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await postService.getAllPosts();
      set({ posts: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách bài viết' });
      return [];
    }
  },

  fetchActivePosts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await postService.getActivePosts();
      set({ activePosts: data || [], loading: false });
      return data || [];
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi lấy danh sách bài viết hoạt động' });
      return [];
    }
  },

  createPost: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await postService.createPost(payload);
      set((state) => ({
        posts: [data, ...state.posts],
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi tạo bài viết' });
      throw err;
    }
  },

  updatePost: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const data = await postService.updatePost(id, payload);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? data : p)),
        loading: false,
      }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi cập nhật bài viết' });
      throw err;
    }
  },

  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      await postService.deletePost(id);
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Lỗi xóa bài viết' });
      throw err;
    }
  },
}));
