<template>
  <section class="article-categories">
    <ul class="article-categories__list">
      <li v-for="category in data" :key="category.id" class="article-categories__list-item">
        <div class="article-categories__category">
          {{ category?.name }}
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
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
.article-categories {
  &__list {
    gap: to-rem(8);
    display: flex;
    flex-wrap: wrap;
  }

  &__category {
    border-radius: to-rem(32);
    border: to-rem(1) solid var(--base-gray-selection);
    color: var(--base-black-light);
    line-height: 129%;
    font-size: to-rem(14);
    padding: to-rem(6) to-rem(12);
    transition: all 0.2s ease-in;
  }
}
</style>
