import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (item) => {
        const current = get().items;
        if (!current.some((i) => i.id === item.id)) {
          set({ items: [...current, item] });
        }
      },
      removeFromWishlist: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      toggleWishlist: (item) => {
        const current = get().items;
        if (current.some((i) => i.id === item.id)) {
          get().removeFromWishlist(item.id);
        } else {
          get().addToWishlist(item);
        }
      },
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'haniu-wishlist-storage',
    }
  )
);
