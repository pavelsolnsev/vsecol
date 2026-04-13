<template>
  <PPage>
    <ABreadcrumb :items="breadcrumbs" class="p-page__breadcrumb" />

    <div class="profession-card__wrapper">
      <ProfessionsNavigation v-if="storeDevice.isWideDesktop" :items="navigationList" :categories="categories" />

      <div class="profession-card">
        <section class="profession-card__header">
          <ATitle tag="h1" class="profession-card__title">{{ data.title }}</ATitle>
          <MobileNav v-if="!storeDevice.isWideDesktop" :items="navigationList" :categories="categories" />
          <ProfessionsBanner :data="data" />
          <ProfessionsLead :id="data.id" :name="data.name" :title="data.title" />
        </section>
        <template v-if="firstList?.length">
          <ProfessionsBlock
            v-for="(block, index) in firstList"
            :id="`block${index + 1}`"
            :key="index"
            :item="block"
            :data="data"
          />
        </template>
        <ProfessionsRelated
          v-if="parents?.length || children?.length"
          :id="relatedId"
          :parents="parents"
          :children="children"
        />
        <template v-if="secondList?.length">
          <ProfessionsBlock
            v-for="(block, index) in secondList"
            :id="secondListIds(index)"
            :key="index"
            :item="block"
            :data="data"
          />
        </template>
      </div>
    </div>
  </PPage>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';
import PPage from '~/components/_ui/p-page.vue';
import { useApiProfessionsBySlug } from '~/composables/api/useApiProfessionsBySlug';
import MobileNav from '../Professions/MobileNav.vue';
import { useApiProfessionCategories } from '~/composables/api/useApiProfessionCategories';
const storeDevice = useDeviceStore();

const storeApi = useApiStore();
const route = useRoute();
const params = computed(() => ({
  with: 'categories,parents,children',
}));
await useApiProfessionsBySlug(route.params.profSlug, params).suspense();
const data = computed(() => storeApi.professionsBySlug?.data || []);

const { data: categories } = await useApiProfessionCategories({
  is_active: true,
}).suspense();

const articles = computed(() =>
  data.value?.article?.length
    ? data.value.article.filter(
        (article) =>
          ![
            'Вступление',
            'Профессиональный праздник',
            'Где учиться',
            'Известные российские представители профессии',
          ].includes(article.block),
      )
    : [],
);

const parents = computed(() => data.value?.parents || []);
const children = computed(() => data.value?.children || []);

const breadcrumbs = computed(() => [
  { title: 'Профессии', path: '/professions' },
  { title: data.value?.name ?? '', path: '' },
]);

const sortedArticles = (desiredBlocks) => {
  const orderMap = {};
  desiredBlocks.forEach((blockName, index) => {
    orderMap[blockName] = index;
  });
  return [...articles.value]
    .filter((article) => desiredBlocks.includes(article.block))
    .sort((a, b) => {
      const indexA = orderMap[a.block] !== undefined ? orderMap[a.block] : 100;
      const indexB = orderMap[b.block] !== undefined ? orderMap[b.block] : 100;
      return indexA - indexB;
    });
};

const firstList = computed(() => sortedArticles(['Кто такой', 'Зарплата', 'Чем занимается']));
const secondList = computed(() =>
  sortedArticles([
    'Какими качествами должен обладать',
    'Плюсы и минусы профессии',
    'Диплом',
    'Специализация',
    'Перспективы карьерного роста в профессии',
    'Где может работать',
  ]),
);

const relatedId = computed(() => {
  if (!firstList.value?.length) return 'block0';
  return `block${firstList.value.length + 1}`;
});

const secondListIds = computed(() => (index) => {
  if (!firstList.value?.length && !secondList.value?.length) return 'block0';
  if (!firstList.value?.length && secondList.value?.length) {
    return `block${0 + index + (parents.value?.length || children.value?.length ? 2 : 0)}`;
  }
  return `block${firstList.value.length + index + (parents.value?.length || children.value?.length ? 2 : 0)}`;
});

const navigationList = computed(() => [
  ...firstList.value,
  { id: 1000, title: 'Связанные профессии' },
  ...secondList.value,
]);

useSeoMeta({
  title: data.value?.title ?? '',
  description: data.value?.description ?? '',
});
</script>

<style lang="scss" scoped>
.profession-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: to-rem(40);
  overflow: hidden;

  &__wrapper {
    display: flex;
    flex-direction: column;

    @media (min-width: 1440px) {
      display: grid;
      grid-template-columns: to-rem(287) 1fr;
      gap: to-rem(48);
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: to-rem(32);
    width: 100%;
  }

  &__title {
    @media (min-width: 768px) {
      font-size: to-rem(44);
      line-height: to-rem(48);
    }
  }
}
</style>
