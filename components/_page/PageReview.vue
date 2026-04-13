<template>
  <PPage css-class="articles">
    <ABreadcrumb :items="breadcrumbs" class="mb-8" />
    <ATitle tag="h1" class="mb-8">Обзоры и рейтинги</ATitle>
    <ReviewFilter class="mb-10" @change="setCategory" />
    <ReviewList :data="filteredArticles" class="mb-10" />
    <div style="text-align: center">
      <APagination
        :page="articlesQuery.data.value?.meta?.current_page"
        :total="articlesQuery.data.value?.meta?.last_page"
        :total-visible="storeDevice.isMobile ? 4 : 5"
        @change="setPage"
      />
    </div>
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';
import ATitle from '~/components/_ui/a-title.vue';
import APagination from '~/components/_ui/a-pagination.vue';
import ReviewFilter from '~/components/Review/Filter.vue';
import ReviewList from '~/components/Review/List.vue';
import { useDeviceStore } from '~/store/device';
import { useApiArticles } from '~/composables/api/useApiArticles';

const route = useRoute();
const router = useRouter();
const storeDevice = useDeviceStore();

const currentPage = ref(parseInt(route.query.page) || 1);
const currentCategory = ref(parseInt(route.query.category) || undefined);

const breadcrumbs = computed(() => [
  {
    title: 'Главная',
    path: '/',
  },
  {
    title: `Обзоры и рейтинги`,
    path: `/review/`,
  },
]);

watch(
  () => [route.query.page, route.query.category],
  ([newPage, newCategory]) => {
    const page = parseInt(newPage) || 1;
    const category = parseInt(newCategory) || undefined;
    if (page !== currentPage.value || category !== currentCategory.value) {
      currentPage.value = page;
      currentCategory.value = category;
      refreshArticles();
    }
  },
);


const articlesParams = computed(() => ({
  is_active: true,
  with: 'categories,blocks,vote_counts,view_counts',
  page: currentPage.value,
  orderBy: '-published_at',
  perPage: 12,
  section: route.name === 'review' ? 'reviews' : route.name,
  category_id: currentCategory.value || undefined,
}));

const articlesQuery = useApiArticles(articlesParams);
await articlesQuery.suspense();

if (!articlesQuery.data.value?.data) {
  throw createError({
    statusCode: 404,
    message: `Articles Not Found`,
    fatal: true,
  });
}

const setCategory = (category) => {
  currentCategory.value = category || undefined;
  currentPage.value = 1;
  router.push({ query: { category: category || undefined, page: undefined } });
  refreshArticles();
};

const setPage = (event) => {
  currentPage.value = event;

  router.push({
    query: {
      category: currentCategory.value || undefined,
      page: event !== 1 ? event : undefined,
    },
  });
  useSmoothScroll(600);
  refreshArticles();
};

const filteredArticles = computed(() => articlesQuery.data.value?.data || []);

useSeoMeta({
  title: 'Обзоры и рейтинги (демо)',
  description: 'Демо-страница обзоров для портфолио.',
});
</script>
