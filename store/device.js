import { defineStore } from 'pinia';

export const useDeviceStore = defineStore({
  id: 'device-store',

  state: () => {
    return {
      width: 0,
    };
  },

  getters: {
    isWideDesktop: (state) => state.width >= 1440,
    isDesktop: (state) => state.width >= 1024 && state.width < 1440,
    isWideTablet: (state) => state.width >= 767 && state.width < 1024,
    isTablet: (state) => state.width < 767 && state.width > 430,
    isMobile: (state) => state.width > 0 && state.width <= 430,
    currentDevice: (state) => {
      if (state.width >= 1440) return 'wide-desktop';
      if (state.width >= 1024 && state.width < 1440) return 'desktop';
      if (state.width >= 767 && state.width < 1024) return 'wide-tablet';
      if (state.width < 767 && state.width > 430) return 'tablet';
      if (state.width > 0 && state.width <= 430) return 'mobile';
      return 'unknown';
    },
  },

  persist: true,
});
