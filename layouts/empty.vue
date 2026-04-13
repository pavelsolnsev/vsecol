<template>
  <div>
    <TheHeader />
    <SMain>
      <slot />
      <div class="l-wide ai-wrapper">
        <LazyAIСonsultant />
      </div>
    </SMain>
    <TheFooter />
  </div>
</template>

<script setup>
import SMain from '~/components/_ui/s-main.vue';
import TheHeader from '~/components/TheHeader.vue';
import TheFooter from '~/components/TheFooter.vue';
import { useDeviceStore } from '~/store/device';
import { useEventListener } from '@vueuse/core';

const { width } = storeToRefs(useDeviceStore());

const handleResize = () => {
  width.value = window.innerWidth;
};

onMounted(() => {
  handleResize();

  if (import.meta.client) {
    useEventListener('resize', handleResize);
  }
});
</script>

<style lang="scss" scoped>
.ai-wrapper {
  position: sticky;
  bottom: to-rem(74);
  right: to-rem(16);
  z-index: 100;

  @media (min-width: 768px) and (max-width: 1023px) {
    bottom: to-rem(64);
    right: to-rem(20);
  }

  @media (min-width: 1024px) {
    bottom: to-rem(20);
    right: to-rem(20);
  }
}
</style>
