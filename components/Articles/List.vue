<template>
  <section class="article-list">
    <ArticlesCard v-for="article in data" :key="article.id" :data="article" class="article-list__item" />
  </section>
</template>

<script setup>
import ArticlesCard from '~/components/Articles/Card.vue';

defineProps({
  data: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
</script>

<style lang="scss" scoped>
.article-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: to-rem(16);

  @media (min-width: 1024px) {
    gap: to-rem(24);
    flex-direction: row;
  }

  &__item {
    @media (min-width: 1024px) {
      width: calc(50% - 12px);
    }

    @media (min-width: 1440px) {
      width: calc(33% - 12px);
    }
  }
}
</style>
