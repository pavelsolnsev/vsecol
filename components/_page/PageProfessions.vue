<template>
  <PPage css-class="professions">
    <ABreadcrumb :items="breadcrumbs" class="mb-8" />

    <ATitle tag="h1" class="mb-8">Каталог профессий</ATitle>

    <SkeletonProfessionsFilters v-if="isCategoriesPending" class="mb-10" />
    <MProfessionsFilters
      v-else
      :category="selectedCategory"
      :categories="categories || []"
      class="mb-10"
      @update:category="onSelectCategory"
    />

    <div v-if="isProfessionsPending" class="professions__skeleton">
      <ASkeletonLoader v-for="i in 12" :key="i" height="250" class="mb-6" />
    </div>

    <div v-else-if="professionsData && !professionsData.data?.length" class="professions__empty">
      <p>По вашему запросу ничего не найдено. Попробуйте изменить параметры фильтрации.</p>
    </div>

    <div v-else-if="professionsData?.data">
      <OProfessionsList :professions="professionsData.data" class="mb-10" />
    </div>

    <div v-if="professionsMeta?.last_page > 1" style="text-align: center">
      <APagination
        :page="professionsMeta.current_page"
        :total="professionsMeta.last_page"
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
import ASkeletonLoader from '~/components/_ui/a-skeleton-loader.vue';
import { useApiProfessionCategories } from '~/composables/api/useApiProfessionCategories';
import { useApiProfessions } from '~/composables/api/useApiProfessions';
import MProfessionsFilters from '@/components/molecules/professions/MProfessionsFilters.vue';
import OProfessionsList from '@/components/organisms/professions/OProfessionsList.vue';
import SkeletonProfessionsFilters from '@/components/Skeleton/ProfessionsFilters.vue';
import { useDeviceStore } from '~/store/device';
import useSmoothScroll from '~/composables/useSmoothScroll';

const storeDevice = useDeviceStore();
const router = useRouter();
const route = useRoute();

// Хлебные крошки
const breadcrumbs = [
  { title: 'Главная', path: '/' },
  { title: 'Профессии', path: '/professions/' },
];

// Локальное состояние для фильтров и пагинации
const selectedCategory = ref(null);
const currentPage = ref(Number(route.query.page) || 1);

// Получаем категории профессий для фильтров
const categoriesQuery = useApiProfessionCategories({
  is_active: true,
});

// Параметры для запроса профессий
const professionsParams = computed(() => ({
  category_id: selectedCategory.value?.id || undefined,
  page: currentPage.value,
}));

const professionsQuery = useApiProfessions(professionsParams);

// Ждём загрузки данных категорий перед рендером
await categoriesQuery.suspense();
const { data: categories, isPending: isCategoriesPending } = categoriesQuery;

// Инициализация категории из query параметров
if (route.query.category) {
  const findCategory = categories.value?.find((category) => category.slug === route.query.category);
  if (findCategory) {
    selectedCategory.value = findCategory;
  }
}

// Ждём загрузки данных профессий перед рендером (как в PageListing.vue)
await professionsQuery.suspense();

const { data: professionsData, isPending: isProfessionsPending, refetch: refetchProfessions } = professionsQuery;

// Синхронизация страницы и категории из query — при навигации назад/вперёд
watch(
  () => route.query,
  (query) => {
    const page = parseInt(query.page) || 1;
    const categorySlug = query.category || null;
    const findCategory = categorySlug ? categories.value?.find((c) => c.slug === categorySlug) || null : null;

    const pageChanged = page !== currentPage.value;
    const categoryChanged = findCategory?.id !== selectedCategory.value?.id;

    if (pageChanged || categoryChanged) {
      currentPage.value = page;
      selectedCategory.value = findCategory;
      refetchProfessions();
    }
  },
);

// Мета-данные для пагинации
const professionsMeta = computed(() => professionsData.value?.meta);

// Выбор категории пользователем: сбрасываем страницу и обновляем URL
const onSelectCategory = (category) => {
  selectedCategory.value = category;
  currentPage.value = 1;
  router.push({ query: { category: category?.slug || undefined, page: undefined } });
};

// Обработка смены страницы
const setPage = (page) => {
  currentPage.value = page;

  refetchProfessions();

  router.push({
    query: {
      category: selectedCategory.value?.slug || undefined,
      page: page !== 1 ? page : undefined,
    },
  });
  useSmoothScroll(600);
};

// SEO
useHead({
  title: 'Каталог профессий (демо)',
  meta: [
    {
      name: 'description',
      content: 'Демо-каталог профессий для портфолио.',
    },
  ],
});
</script>

<style lang="scss">
.professions {
  &__empty {
    text-align: center;
    padding: to-rem(60) 0;
    color: var(--base-gray-dark);
  }

  &__skeleton {
    width: 100%;
  }
}
</style>
