import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth-store',

  state: () => {
    return {
      profile: null,
      election: {},
      verification: {},
      registrationSource: null,
    };
  },

  getters: {
    isAuthenticated: (state) => !!state.profile,
    hasVerification: (state) => !!Object.keys(state.verification).length > 0,
    phoneNumber: (state) => {
      let phoneNumber = state.profile?.phone.match(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/);
      phoneNumber =
        state.profile &&
        '+' +
          phoneNumber[1] +
          ' (' +
          phoneNumber[2] +
          ') ' +
          phoneNumber[3] +
          '-' +
          phoneNumber[4] +
          '-' +
          phoneNumber[5];
      return phoneNumber;
    },
  },
});
