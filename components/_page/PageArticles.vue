<template>
  <PPage css-class="articles">
        <ABreadcrumb :items="breadcrumbs" class="mb-8" />
        <ATitle tag="h1" class="mb-8">Журнал абитуриента</ATitle>
        <ArticlesFilter class="mb-10" @change="currentCategory = $event" />
        <ArticlesList :data="filteredArticles" class="mb-10" />
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
import ArticlesFilter from '~/components/Articles/Filter.vue';
import ArticlesList from '~/components/Articles/List.vue';
import APagination from '~/components/_ui/a-pagination.vue';
import { useDeviceStore } from '~/store/device';
import { useApiArticles } from '~/composables/api/useApiArticles';

const router = useRouter();
const storeDevice = useDeviceStore();

const currentPage = ref(1);
const currentCategory = ref();
const route = useRoute();

const breadcrumbs = computed(() => [
  {
    title: 'Главная',
    path: '/',
  },
  {
    title: `Журнал абитуриента`,
    path: `/articles/`,
  },
]);

watch(
  () => currentCategory.value,
  () => {
    setPage(1);
  },
);

// Параметры для API запросов
const articlesParams = computed(() => ({
  is_active: true,
  with: 'categories,blocks,vote_counts,view_counts',
  page: currentPage.value,
  orderBy: '-published_at',
  perPage: 12,
  section: route.name === 'review' ? 'reviews' : route.name,
  category_id: currentCategory.value || undefined,
}));

// Загрузка данных для страницы статей
const articlesQuery = useApiArticles(articlesParams);

await articlesQuery.suspense();

if (!articlesQuery.data.value?.data) {
  throw createError({
    statusCode: 404,
    message: `Articles Not Found`,
    fatal: true,
  });
}

const setPage = (event) => {
  currentPage.value = event;

  router.replace({
    query: {
      page: event !== 1 ? event : undefined,
    },
  });
  useSmoothScroll(600);
};

const filteredArticles = computed(() => articlesQuery.data.value?.data || []);

useSeoMeta({
  title: 'Материалы и статьи (демо)',
  description: 'Демо-раздел публикаций для портфолио.',
});
</script>

<style lang="scss">
</style>