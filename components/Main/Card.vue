<template>
  <NuxtLink :to="data.href ? data.href : '#'" :title="data.title" class="card-colledge">
    <h3 class="card-colledge__title">
      {{ data.title }}
    </h3>

    <NuxtImg
      v-if="data.icon"
      :src="`/images/popular/${data.icon.toLowerCase()}.webp`"
      :alt="data.title"
      :loading="isFirst ? undefined : 'lazy'"
      :preload="isFirst ? { fetchPriority: 'high' } : undefined"
      class="card-colledge__image"
    />
  </NuxtLink>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
  isFirst: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.card-colledge {
  position: relative;
  display: flex;
  flex-direction: column;
  height: to-rem(188);
  padding: to-rem(24);
  background-color: var(--base-gray-second);
  border-radius: var(--border-radius-x1);
  transition: all 0.4s ease-in;

  &:hover {
    background-color: var(--base-gray-border);
  }

  &__title {
    flex: 1;
    width: 100%;
    max-width: to-rem(168);
    font-size: to-rem(18);
    font-weight: 700;
    line-height: 120%;
  }

  &__trigger {
    color: var(--base-gray);
    font-size: var(16);
    line-height: 150%;
  }

  &__image {
    position: absolute;
    right: 0;
    bottom: 0;
    width: fit-content;
    height: to-rem(152);
  }
}
</style>
