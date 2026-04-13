<template>
  <div class="professions-filters" role="group" aria-label="Фильтры категорий">
    <div class="professions-filters__categories" role="listbox">
      <div
        v-for="cat in visibleCategories"
        :key="cat.id"
        role="option"
        :aria-selected="isSelected(cat)"
        tabindex="0"
        class="professions-filters__category"
        :class="{ 'professions-filters__category--active': isSelected(cat) }"
        @click="selectCategory(cat)"
        @keydown.enter="selectCategory(cat)"
        @keydown.space.prevent="selectCategory(cat)"
      >
        {{ cat.name }}
      </div>

      <button
        v-if="hasHiddenCategories && !isExpanded"
        aria-label="Показать больше фильтров"
        :aria-expanded="false"
        :aria-controls="`expanded-filters-${uid}`"
        type="button"
        class="professions-filters__more"
        @click="toggleExpanded"
      >
        <span class="professions-filters__more-text">Еще</span>
        <div class="professions-filters__more-icon" aria-hidden="true">
          <IconChevronUp class="chevron-icon" />
        </div>
      </button>

      <button
        v-if="isExpanded"
        aria-label="Свернуть фильтры"
        :aria-expanded="true"
        :aria-controls="`expanded-filters-${uid}`"
        type="button"
        class="professions-filters__more professions-filters__more--expanded"
        @click="toggleExpanded"
      >
        <span class="professions-filters__more-text">Свернуть</span>
        <div class="professions-filters__more-icon professions-filters__more-icon--rotated" aria-hidden="true">
          <IconChevronUp class="chevron-icon" />
        </div>
      </button>
    </div>

    <div
      v-if="isExpanded"
      :id="`expanded-filters-${uid}`"
      class="professions-filters__expanded professions-filters__expanded--visible"
      role="listbox"
    >
      <div
        v-for="cat in hiddenCategories"
        :key="`hidden-${cat.id}`"
        role="option"
        :aria-selected="isSelected(cat)"
        tabindex="0"
        class="professions-filters__category"
        :class="{ 'professions-filters__category--active': isSelected(cat) }"
        @click="selectCategory(cat)"
        @keydown.enter="selectCategory(cat)"
        @keydown.space.prevent="selectCategory(cat)"
      >
        {{ cat.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import IconChevronUp from '@/assets/icons/chevron-up.svg';

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});

const category = defineModel('category');
const route = useRoute();
const isExpanded = ref(false);
const uid = getCurrentInstance().uid;

const isSelected = (cat) => {
  return (category.value?.id ?? null) === cat.id;
};

// Prepare categories with "Все категории" option
const categoryOptions = computed(() => [{ id: null, name: 'Все категории' }, ...(props.categories || [])]);

// 1 строка - оставляем место для кнопки "Еще"
const maxVisibleItems = 4;

const visibleCategories = computed(() => {
  if (isExpanded.value) {
    return categoryOptions.value;
  }
  return categoryOptions.value.slice(0, maxVisibleItems);
});

const hiddenCategories = computed(() => {
  if (isExpanded.value) {
    return [];
  }
  return categoryOptions.value.slice(maxVisibleItems);
});

const hasHiddenCategories = computed(() => {
  return hiddenCategories.value.length > 0;
});

// Функции для управления фильтрами
const selectCategory = (item) => {
  category.value = item;
};

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

// Проверяем выбранную категорию в query параметрах, если ее нет в списке, то раскрываем список
watch(
  () => route.query,
  (query) => {
    if (query.category && category.value) {
      const findItem = visibleCategories.value.find((c) => c.slug === category.value.slug);

      if (!findItem) {
        toggleExpanded();
      }
    }
  },
  { immediate: true },
);
</script>

<style lang="scss">
.professions-filters {
  &__categories {
    display: flex;
    flex-wrap: wrap;
    gap: to-rem(8);
  }

  &__category {
    border-radius: to-rem(32);
    border: to-rem(1) solid var(--base-gray-border);
    color: var(--base-gray-dark);
    font-size: to-rem(14);
    font-weight: 500;
    line-height: 129%;
    padding: to-rem(11) to-rem(16);
    transition: all 0.2s ease-in;
    cursor: pointer;

    &:hover {
      color: var(--base-white);
      background-color: var(--base-blue);
      border-color: var(--base-blue);
    }

    &--active {
      color: var(--base-white);
      background-color: var(--base-blue);
      border-color: var(--base-blue);
    }
  }

  &__more {
    display: flex;
    align-items: center;
    gap: to-rem(6);
    border-radius: to-rem(32);
    border: to-rem(1) solid var(--base-blue);
    color: var(--base-blue);
    font-size: to-rem(14);
    font-weight: 500;
    line-height: 129%;
    padding: to-rem(11) to-rem(16);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease-in;

    &:hover {
      color: var(--base-white);
      background-color: var(--base-blue);
    }

    &--expanded {
      color: var(--base-white);
      background-color: var(--base-blue);
    }
  }

  &__more-icon {
    transition: transform 0.2s ease-in-out;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    &--rotated {
      transform: rotate(180deg);
    }
  }

  .chevron-icon {
    width: to-rem(12);
    height: to-rem(8);

    path {
      stroke: currentColor;
    }
  }

  &__expanded {
    display: flex;
    flex-wrap: wrap;
    gap: to-rem(8);
    margin-top: to-rem(8);
  }
}
</style>
