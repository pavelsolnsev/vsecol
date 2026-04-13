<template>
  <section v-if="data" class="prof-card-banner">
    <NuxtImg
      v-if="data.image"
      :src="data.image.url"
      :alt="data.name"
      class="prof-card-banner__image"
      :preload="{ fetchPriority: 'high' }"
    />
  </section>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: null,
  },
});
</script>

<style lang="scss" scoped>
.prof-card-banner {
  position: relative;
  padding: to-rem(16);
  border-radius: var(--border-radius-x2);
  height: to-rem(180);
  width: 100%;

  @media (min-width: 768px) {
    padding: to-rem(24);
    height: to-rem(297);
  }

  @media (min-width: 1024px) {
    height: to-rem(355);
  }

  &__image {
    border-radius: var(--border-radius-x2);
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}
</style>
