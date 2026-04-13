import { defineStore } from 'pinia';

export const useInfoStore = defineStore({
  id: 'info-store',

  state: () => {
    return {
      isCities: false,
      isSpecialties: false,
      path: '',
      cid: undefined,
      orgType: undefined,
      // Флаг навигации между листинговыми страницами
      isNavigating: false,
    };
  },

  persist: false,

  getters: {
    isUniversity: (state) => state.path === 'vuz',
    isCollege: (state) => state.path === 'kolledzh',
    isOrgCollege: (state) => state.orgType === 'college',
    isOrgUniversity: (state) => state.orgType === 'university',
    currentRouteName: (state) => (state.path === 'vuz' ? 'Вузы' : state.path === 'kolledzh' ? 'Колледжи' : ''),
    currentRouteNameVariant: (state) => (state.path === 'vuz' ? 'Вуза' : state.path === 'kolledzh' ? 'Колледжа' : ''),
    routeNameNominative: (state) => (state.path === 'vuz' ? 'вуз' : state.path === 'kolledzh' ? 'колледж' : ''),
  },
});
