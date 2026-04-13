import { defineStore } from 'pinia';

export const useApiStore = defineStore('api', {
  state: () => {
    return {
      articleData: null,
      listingData: null,
      listingMeta: null,
      promoListing: null,
      promoFilter: null,
      filterCounts: null,
      orgData: null,
      calcOrganizations: null,
      calcSpecialities: null,
      organizationLevels: null,
      organizationSpecs: null,
      promoData: null,
      professionsBySlug: null,
    };
  },

  getters: {
    articleBlocks: (state) => state.articleData && state.articleData.blocks,
  },
});
