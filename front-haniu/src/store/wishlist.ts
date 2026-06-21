import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price?: number;
  basePrice?: number;
  salePrice?: number;
  isFeatured: boolean;
  isNew: boolean;
  isCustomizable: boolean;
  category?: { name: string; slug?: string };
  media?: Array<{ url: string; isThumbnail: boolean }>;
  thumbnailUrl?: string;
}

interface WishlistState {
  items: WishlistItem[];
  fetchWishlist: () => Promise<void>;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      fetchWishlist: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (!isAuthenticated) return;

        try {
          const data = await fetchApi('/api/v1/wishlist');
          if (Array.isArray(data)) {
            const mappedItems: WishlistItem[] = data.map((p: any) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              sku: p.sku || '',
              description: p.description || '',
              price: p.price,
              basePrice: p.basePrice || p.price,
              salePrice: p.salePrice,
              isFeatured: p.isFeatured || p.featured || false,
              isNew: p.isNew || p.new || false,
              isCustomizable: p.isCustomizable || false,
              category: p.category,
              media: p.media,
              thumbnailUrl: p.thumbnailUrl
            }));
            set({ items: mappedItems });
          }
        } catch (err) {
          console.error('Failed to fetch wishlist from server:', err);
        }
      },
      addToWishlist: async (item) => {
        const current = get().items;
        if (!current.some((i) => i.id === item.id)) {
          set({ items: [...current, item] });
        }

        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await fetchApi(`/api/v1/wishlist/add/${item.id}`, { method: 'POST' });
          } catch (err) {
            console.error('Failed to add item to wishlist on server:', err);
          }
        }
      },
      removeFromWishlist: async (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });

        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await fetchApi(`/api/v1/wishlist/remove/${id}`, { method: 'DELETE' });
          } catch (err) {
            console.error('Failed to remove item from wishlist on server:', err);
          }
        }
      },
      toggleWishlist: async (item) => {
        const current = get().items;
        const exists = current.some((i) => i.id === item.id);
        
        if (exists) {
          set({ items: current.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...current, item] });
        }

        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await fetchApi(`/api/v1/wishlist/toggle/${item.id}`, { method: 'POST' });
          } catch (err) {
            console.error('Failed to toggle wishlist item on server:', err);
          }
        }
      },
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },
      clearWishlist: async () => {
        set({ items: [] });

        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          try {
            await fetchApi('/api/v1/wishlist/clear', { method: 'DELETE' });
          } catch (err) {
            console.error('Failed to clear wishlist on server:', err);
          }
        }
      },
    }),
    {
      name: 'haniu-wishlist-storage',
    }
  )
);
