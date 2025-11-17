import { defineStore } from 'pinia';
import type { CryptoMarketItem } from './crypto.types';
import { fetchCryptoMarkets } from '../api/crypto.api';

interface CryptoState {
  items: CryptoMarketItem[];
  isLoading: boolean;
  error: string | null;
  favorites: string[];
}

const FAVORITES_STORAGE_KEY = 'crypto_favorites_v1';

export const useCryptoStore = defineStore('cryptoStore', {
  state: (): CryptoState => ({
    items: [],
    isLoading: false,
    error: null,
    favorites: [],
  }),

  getters: {
    hasData(state): boolean {
      return state.items.length > 0;
    },
  },

  actions: {
    async loadMarkets(): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        const data = await fetchCryptoMarkets();
        this.items = data;
      } catch (error) {
        this.error = 'Не удалось загрузить данные о криптовалютах';
        console.error('loadMarkets error:', error);
      } finally {
        this.isLoading = false;
      }
    },

    initFavorites() {
      if (typeof window === 'undefined') return;

      try {
        const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.favorites = parsed.filter((id) => typeof id === 'string');
        }
      } catch {
        // если localStorage битый — просто игнорируем
      }
    },

    toggleFavorite(id: string) {
      const exists = this.favorites.includes(id);

      if (exists) {
        this.favorites = this.favorites.filter((favId) => favId !== id);
      } else {
        this.favorites.push(id);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(this.favorites),
        );
      }
    },

    isFavorite(id: string): boolean {
      return this.favorites.includes(id);
    },
  }
});
