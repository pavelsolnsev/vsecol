<template>
  <div>
    <TheHeader />
    <SMain>
      <slot />
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

  if (process.client) {
    useEventListener('resize', handleResize);
  }
});
</script>
