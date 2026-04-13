<template>
  <section class="listing-sort">
    <ul class="listing-sort__ul">
      <li v-for="item in items" :key="item.link" class="listing-sort__item">
        <span
          class="listing-sort__link"
          :class="{ 'listing-sort__link--active': storeFilter.sort === item.link }"
          @click.prevent="sort(item.link)"
          >{{ item.title }}</span
        >
      </li>
    </ul>
  </section>
</template>

<script setup>
const storeFilter = useFilterStore();
const { isVuz: isUniversityPage } = usePageNavigation();

const sortItems = reactive({
  university: [
    {
      title: 'По умолчанию',
      link: '-okso-count',
    },
    {
      title: 'По популярности',
      link: 'pop',
    },
    {
      title: 'По рейтингу',
      link: 'rating',
    },
    {
      title: 'ЕГЭ бюджет',
      link: 'ege-b',
    },
    {
      title: 'ЕГЭ платное',
      link: 'ege-p',
    },
  ],
  college: [
    {
      title: 'По умолчанию',
      link: '-okso-count',
    },
    {
      title: 'По популярности',
      link: 'pop',
    },
    {
      title: 'По рейтингу',
      link: 'rating',
    },
    {
      title: 'Ср. балл аттестата бюджет',
      link: 'ege-b',
    },
    {
      title: 'Ср. балл аттестата платное',
      link: 'ege-p',
    },
  ],
});

const items = computed(() => (isUniversityPage.value ? sortItems.university : sortItems.college));

const sort = (item) => {
  if (item === storeFilter.sort) return;
  storeFilter.sort = item;
};
</script>

<style lang="scss" scoped>
.listing-sort {
  &__ul {
    gap: to-rem(8);
    display: flex;
    flex-wrap: wrap;

    @media (min-width: 1024px) {
      gap: to-rem(16);
    }
  }

  &__link {
    color: var(--base-blue);
    font-size: to-rem(12);
    line-height: to-rem(16);
    cursor: pointer;

    &--active {
      cursor: default;
      color: var(--base-black);
    }
  }
}
</style>
