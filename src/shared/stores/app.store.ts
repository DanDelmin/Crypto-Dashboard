import { defineStore } from 'pinia';

interface AppState {
  isOnline: boolean;
}

export const useAppStore = defineStore('appStore', {
  state: (): AppState => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  }),

  actions: {
    initConnectivityListeners() {
      if (typeof window === 'undefined') return;

      const update = () => {
        this.isOnline = navigator.onLine;
      };

      update();

      window.addEventListener('online', update);
      window.addEventListener('offline', update);
    },
  },
});
