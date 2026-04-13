<template>
  <div v-if="items?.length" class="prof-card-nav">
    <NuxtLink v-if="!isHideBack" to="/professions" class="prof-card-nav__back">
      <ArrowLink />
      Назад
    </NuxtLink>

    <div class="prof-card-nav__title">На этой странице</div>

    <ul
      class="prof-card-nav__list"
      :class="{
        pb: categories?.length && !isMobile,
      }"
    >
      <li v-for="(item, index) in items" :key="item.id ?? index">
        <NuxtLink :to="{ hash: `#block${index + 1}` }" class="prof-card-nav__link" @click="emit('close')">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="item.title ?? item.block" />
        </NuxtLink>
      </li>
    </ul>

    <div v-if="isMobile" class="prof-card-nav__title">Другие категории</div>

    <ul v-if="categoryList?.length" class="prof-card-nav__categories">
      <li
        v-for="category in categoryList"
        :key="category.id"
        class="prof-card-nav__category"
        @click="goToCategory(category)"
      >
        {{ category.name }}
      </li>
      <li class="prof-card-nav__category else" @click="showAllCategories = !showAllCategories">
        <span>
          {{ showAllCategories ? 'Свернуть' : 'Еще' }}
        </span>

        <IconSmallArrow
          class="prof-card-nav__icon"
          :class="{
            rotate: showAllCategories,
          }"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import ArrowLink from '~/components/_icons/ArrowLink.vue';
import IconSmallArrow from '~/components/_icons/IconSmallArrow.vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  isHideBack: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);
const router = useRouter();
const showAllCategories = ref(false);

const categoryList = computed(() => {
  if (!props.categories?.length) return [];

  const items = [...props.categories];

  if (!showAllCategories.value) {
    return items.slice(0, 10);
  }

  return items;
});

const goToCategory = (category) => {
  router.push({ name: 'professions', query: { category: category.slug } });
};
</script>

<style lang="scss" scoped>
.prof-card-nav {
  &__back {
    display: flex;
    gap: to-rem(10);
    margin-bottom: to-rem(40);
  }

  &__title {
    font-size: to-rem(20);
    margin-bottom: to-rem(24);
    font-weight: 700;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: to-rem(12);
    padding-bottom: to-rem(24);

    &.pb {
      border-bottom: to-rem(1) solid #cfd3d8;
    }
  }

  &__link {
    font-size: to-rem(14);
    line-height: to-rem(18);
    color: var(--base-blue);
  }

  &__categories {
    margin-top: to-rem(16);
    display: flex;
    gap: to-rem(8);
    flex-wrap: wrap;
  }

  &__category {
    cursor: pointer;
    font-size: to-rem(14);
    line-height: to-rem(18);
    padding: to-rem(11) to-rem(16);
    border: to-rem(1) solid var(--base-gray-selection);
    border-radius: to-rem(32);
    color: var(--base-black-light);

    &.else {
      display: flex;
      gap: to-rem(8);
      color: var(--base-blue);
      border-color: var(--base-blue);
    }
  }

  &__icon.rotate {
    transform: rotate(180deg);
  }
}
</style>
