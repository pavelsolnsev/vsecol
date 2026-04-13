<template>
  <section class="article-filter">
    <ul class="article-filter__list">
      <li class="article-filter__list-item">
        <div
          class="article-filter__category"
          :class="{ 'article-filter__category--active': currentCategory === 0 }"
          @click="setCategory(0)"
        >
          Все категории
        </div>
      </li>
      <li v-for="category in categories" :key="category.id" class="article-filter__list-item">
        <div
          class="article-filter__category"
          :class="{ 'article-filter__category--active': currentCategory === category.id }"
          @click="setCategory(category.id)"
        >
          {{ category?.name }}
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { useApiArticleCategories } from '~/composables/api/useApiArticleCategories';

const emit = defineEmits(['change']);

const currentCategory = ref(0);
const route = useRoute();

const setCategory = (index) => {
  currentCategory.value = index;

  emit('change', index);
};

const categoriesQuery = useApiArticleCategories({
  perPage: 'all',
  is_active: true,
  section: 'reviews',
  with: 'active_articles_count',
});

await categoriesQuery.suspense();

const categories = computed(() =>
  (categoriesQuery.data.value?.data || []).filter((cat) => cat.active_articles_count > 0)
);

currentCategory.value = parseInt(route.query.category) || 0;

watch(
  () => route.query.category,
  (newCategory) => {
    currentCategory.value = parseInt(newCategory) || 0;
  },
);
</script>

<style lang="scss" scoped>
.article-filter {
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
    padding: to-rem(11) to-rem(16);
    transition: all 0.2s ease-in;

    &:hover {
      color: var(--base-white);
      background-color: var(--base-blue);
      border: to-rem(1) solid var(--base-blue);
      cursor: pointer;
    }

    &--active {
      color: var(--base-white);
      background-color: var(--base-blue);
      border: to-rem(1) solid var(--base-blue);
    }
  }
}
</style>
