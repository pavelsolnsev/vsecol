<template>
  <button class="mobile-prof-nav" @click="showModal = !showModal">
    <span class="mobile-prof-nav__title">Содержание</span>

    <IconNav class="mobile-prof-nav__icon" />
  </button>

  <AModal
    v-if="showModal"
    v-model="showModal"
    indent
    :max-width="storeDevice.isWideDesktop || storeDevice.isDesktop || storeDevice.isDesktop ? '630px' : '100%'"
    class="prof-mobile-popup"
  >
    <ProfessionsNavigation :items="items" is-hide-back is-mobile :categories="categories" @close="showModal = false" />
  </AModal>
</template>

<script setup>
import IconNav from '~/components/_icons/IconNav.vue';
import AModal from '~/components/_ui/a-modal.vue';

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  categories: {
    type: Array,
    default: () => [],
  },
});

const storeDevice = useDeviceStore();

const showModal = ref(false);
</script>

<style lang="scss">
.a-modal__block {
  overflow: auto;
}
</style>

<style lang="scss" scoped>
.mobile-prof-nav {
  background-color: var(--base-gray-smoky);
  border: none;
  border-radius: to-rem(8);
  padding: to-rem(16);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
