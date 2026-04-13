<template>
  <div class="card-author">
    <div v-if="image" class="card-author__tumb">
      <NuxtImg :src="image" alt="" itemprop="image" loading="lazy" />
    </div>
    <div class="card-author__info">
      <div class="card-author__name" itemprop="name">{{ name }}</div>
      <div class="card-author__description" itemprop="disambiguatingDescription">{{ description }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: '',
  },

  description: {
    type: String,
    default: '',
  },

  image: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss" scoped>
.card-author {
  display: flex;
  align-items: flex-start;
  gap: to-rem(10);

  &__tumb {
    width: to-rem(48);
    border-radius: 100%;
    overflow: hidden;
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-weight: 700;
    font-size: to-rem(14);
    line-height: to-rem(18);
    margin-bottom: to-rem(4);
  }

  &__description {
    color: var(--base-gray);
    font-size: to-rem(12);
    line-height: to-rem(18);
  }
}
</style>
