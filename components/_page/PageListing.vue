<template>
  <PPage v-if="isListingPage" css-class="listing">
    <ASkeletonLoader v-if="isNavigating" width="350px" height="18" class="mb-8" />
    <PageBreadcrumbs v-else class="mb-8" />

    <ASkeletonLoader v-if="organizatiosPending || isNavigating" width="210px" height="40" class="mb-8" />
    <ATitle v-else tag="h1" class="mb-8">{{ title }}</ATitle>

    <section class="p-listing__counts mb-6">
      <ASkeletonLoader v-if="organizatiosPending || isNavigating" width="300px" height="18" />
      <ListingCounts v-else :total="listingMeta?.total" :total-okso="listingMeta?.total_okso" />
    </section>

    <section class="p-listing__filter-mobile mb-10">
      <ASkeletonLoader v-if="filterCountsPending" height="57" />
      <ListingFilterMobile
        v-else
        :zero-filters="zeroFilters"
        @on-change="filterHandler"
        @on-reset="filterHandler"
      />
    </section>

    <section class="p-listing__filter mb-10">
      <ASkeletonLoader v-if="filterCountsPending" height="112" />
      <ListingFilter
        v-else
        :is-mobile="storeDevice.isMobile"
        :zero-filters="zeroFilters"
        @on-change="filterHandler"
        @on-reset="filterHandler"
      />
    </section>

    <section class="p-listing__promos mb-6">
      <template v-if="promoListingPending">
        <div v-for="item in 3" :key="item" class="p-listing__promos-item">
          <ASkeletonLoader height="44" />
        </div>
      </template>
      <template v-else>
        <ListingPromos :type="pageType" />
      </template>
    </section>

    <ListingSpecialties
      v-if="(storeFilter.hasDirectionAndLevel || storeFilter.hasSpeciality) && similarSpecialties?.length > 0"
      :specialties="similarSpecialties"
      class="mb-8"
    />

    <template v-if="organizatiosPending">
      <ASkeletonLoader v-for="item in 15" :key="item" height="198" class="mb-6" />
    </template>
    <template v-else>
      <ListingSorting class="mb-4" />
      <ListingList :data="storeApi.listingData || []" :promos="storeApi.promoListing || []" class="mb-10" />
    </template>

    <section v-if="listingMeta?.total > 1" class="mb-10 d-flex justify-center">
      <ASkeletonLoader v-if="organizatiosPending" width="380" height="40" />
      <APagination
        v-else
        :page="listingMeta?.current_page"
        :total="listingMeta?.last_page"
        :total-visible="storeDevice.isMobile ? 4 : 5"
        @change="setPage"
      />
    </section>

    <section v-if="storeFilter.speciality?.code" class="p-listing__seo mb-8">
      О {{ specialityVariant && specialityVariant.toLocaleLowerCase() }}
      <NuxtLink
        :href="`/${storeInfo.isUniversity ? 'vuz' : 'kolledzh'}/specialties/code_${storeFilter.speciality?.code}/`"
        class="p-listing__link"
        >{{ storeFilter.speciality?.name }}</NuxtLink
      >
    </section>

    <ASkeletonLoader v-if="organizatiosPending" width="100%" height="72" />
    <ListingSeo
      v-show="!organizatiosPending && currentPage === 1
      && (storeApi.listingData?.length >= 3 || organizationsQuery.data.value?.data?.length >= 3)"
      :total-organizations="listingMeta?.total"
      hydrate-on-visible
    />
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ASkeletonLoader from '~/components/_ui/a-skeleton-loader.vue';
import ATitle from '~/components/_ui/a-title.vue';
import APagination from '~/components/_ui/a-pagination.vue';
import PageBreadcrumbs from '~/components/_page/PageBreadcrumbs.vue';
import ListingCounts from '~/components/Listing/Counts.vue';
import ListingFilterMobile from '~/components/Listing/FilterMobile.vue';
import ListingFilter from '~/components/Listing/Filter.vue';
import ListingPromos from '~/components/Listing/Promos.vue';
import ListingSpecialties from '~/components/Listing/Specialties.vue';
import ListingSorting from '~/components/Listing/Sorting.vue';
import ListingList from '~/components/Listing/List.vue';
import ListingSeo from '~/components/Listing/Seo.vue';
import { useApiCities } from '~/composables/api/useApiCities';
import { useApiOrganizations } from '~/composables/api/useApiOrganizations';
import { useApiPromoListing } from '~/composables/api/useApiPromoListing';
import { useApiFilterCounts } from '~/composables/api/useApiFilterCounts';
import { useApiOksoByDirectionLevel } from '~/composables/api/useApiOksoByDirectionLevel';
import { useApiOksoByCode } from '~/composables/api/useApiOksoByCode';
import { useConvertedToStore } from '~/composables/useConvertedToStore';
import { useConvertedToQuery } from '~/composables/useConvertedToQuery';
import useSmoothScroll from '~/composables/useSmoothScroll';

const props = defineProps({
  pageType: {
    type: String,
    default: '',
  },
});

const route = useRoute();
const router = useRouter();
const storeApi = useApiStore();
const storeInfo = useInfoStore();
const storeDevice = useDeviceStore();
const storeFilter = useFilterStore();
const { isCrawler } = useDevice();

// Используем новый composable для навигации
const { isListingPage, isNavigating, finishNavigation } = usePageNavigation();

// Используем computed для routeParams вместо ref, чтобы он обновлялся при изменении route
const routeParams = computed(() => useConvertedToStore(route.params.path) || []);
const specLength = computed(() => routeParams.value.spec && routeParams.value.spec.split('.').join('')?.length);
const currentPage = computed(() => parseInt(route.query.page) || 1);

// Определяем тип okso по длине кода
const oksoType = computed(() => (specLength.value > 5 ? 'okso6' : 'okso3'));

// Параметры для загрузки специальности по коду
const oksoByCodeParams = computed(() => ({
  with: 'level,group.direction',
  has_organization: true,
  city_slug: routeParams.value.city,
  subject_slug: routeParams.value.subject || undefined,
}));

// Запрос специальности по коду (используем TanStack Query)
const oksoByCodeQuery = useApiOksoByCode(
  () => routeParams.value.spec,
  oksoType,
  { params: oksoByCodeParams, enabled: () => !!routeParams.value.spec }
);

// Данные загруженной специальности
const specData = computed(() => oksoByCodeQuery.data.value);

// Параметры для запроса похожих специальностей (okso6 и okso3)
// Если загружен spec - берём из specData, иначе из routeParams
const similarSpecialtiesParams = computed(() => ({
  has_organization: true,
  direction_slug: specData.value?.group?.direction?.slug || routeParams.value.direction,
  level_slug: specData.value?.level?.slug ||
    (routeParams.value.level === 'bachelor-specialty' ? 'bachelor,specialty' : routeParams.value.level),
  city_slug: routeParams.value.city,
  subject_slug: routeParams.value.subject,
}));

// Запросы для okso6 и okso3 - enabled если есть direction и level (из любого источника)
const hasDirectionAndLevel = computed(() =>
  !!(specData.value?.group?.direction?.slug || routeParams.value.direction) &&
  !!(specData.value?.level?.slug || routeParams.value.level)
);

const okso6SimilarQuery = useApiOksoByDirectionLevel(
  similarSpecialtiesParams,
  'okso6',
  { enabled: hasDirectionAndLevel }
);
const okso3SimilarQuery = useApiOksoByDirectionLevel(
  similarSpecialtiesParams,
  'okso3',
  { enabled: hasDirectionAndLevel }
);

// Вычисляем similarSpecialties через computed для синхронизации SSR и клиента
const similarSpecialties = computed(() => {
  if (!hasDirectionAndLevel.value) {
    return [];
  }

  const okso6Data = okso6SimilarQuery.data.value || [];
  const okso3Data = okso3SimilarQuery.data.value || [];
  const specCode = routeParams.value.spec;

  const data = [...okso6Data, ...okso3Data];
  return specCode ? data.filter((i) => i.code !== specCode) : data;
});

// Параметры для API запросов
const citiesParams = computed(() => ({
  with: 'subject',
  orderBy: 'sort',
  perPage: !routeParams.value.city && routeParams.value.subject ? 'all' : 16,
  subject_slug: !routeParams.value.city ? routeParams.value.subject : undefined,
  has_universities: storeInfo.isUniversity || undefined,
  has_colleges: storeInfo.isCollege || undefined,
}));

const listingParams = computed(() => ({
  type: props.pageType,
  perPage: 12,
  is_active: true,
  city_slug: routeParams.value.city || undefined,
  subject_slug: routeParams.value.subject || undefined,
  direction_slug: routeParams.value.direction || undefined,
  level_slug:
    route.name === 'vuz'
      ? routeParams.value.level
        ? routeParams.value.level === 'bachelor-specialty'
          ? 'bachelor,specialty'
          : routeParams.value.level
        : undefined
      : undefined,
  base:
    route.name === 'kolledzh'
      ? parseInt(storeFilter.getLevelIdBySlug(routeParams.value.level)) === 1
        ? 9
        : parseInt(storeFilter.getLevelIdBySlug(routeParams.value.level)) === 2
        ? 11
        : undefined
      : undefined,
  is_budget: routeParams.value.budget || undefined,
  is_state: routeParams.value.state || undefined,
  has_hostel: routeParams.value.hostel || undefined,
  has_military: (storeInfo.isUniversity && routeParams.value.military) || undefined,
  has_distance: routeParams.value.distance || undefined,
  okso3_code: routeParams.value.spec && specLength.value < 6 ? routeParams.value.spec : undefined,
  okso6_code: routeParams.value.spec && specLength.value > 5 ? routeParams.value.spec : undefined,
  orderBy: storeFilter.sort || '-okso-count',
  page: currentPage.value || 1,
  at_vuz: (storeInfo.isCollege && routeParams.value.atvuz) || undefined,
}));

const promoListing = computed(() => ({
  limit: 2,
  'filters[organization_type]': props.pageType,
  cid: storeInfo.currentCID,
  count_views: !isCrawler,
}));

const filterCountsParams = computed(() => ({
  type: storeInfo.isUniversity ? 'university' : 'college',
  subject_slug: routeParams.value.subject || undefined,
  city_slug: routeParams.value.city || undefined,
  direction_slug: routeParams.value.direction || undefined,
  level_slug:
    route.name === 'vuz'
      ? routeParams.value.level
        ? routeParams.value.level === 'bachelor-specialty'
          ? 'bachelor,specialty'
          : routeParams.value.level
        : undefined
      : undefined,
  base:
    route.name === 'kolledzh'
      ? parseInt(storeFilter.getLevelIdBySlug(routeParams.value.level)) === 1
        ? 9
        : parseInt(storeFilter.getLevelIdBySlug(routeParams.value.level)) === 2
        ? 11
        : undefined
      : undefined,
  is_state: routeParams.value.state || undefined,
  is_budget: routeParams.value.budget || undefined,
  has_military: routeParams.value.military || undefined,
  has_hostel: routeParams.value.hostel || undefined,
  has_distance: routeParams.value.distance || undefined,
  at_vuz: routeParams.value.atvuz || undefined,
}));

// Загрузка данных для страницы листинга
const citiesQuery = useApiCities(citiesParams);
const organizationsQuery = useApiOrganizations(listingParams, 'mainListingPage');
const promoListingQuery = useApiPromoListing(promoListing);
const filterCountsQuery = useApiFilterCounts(filterCountsParams);

// Двухэтапная загрузка для корректной работы SSR
// Этап 1: основные данные + spec (если есть)
const suspensePromises = [
  citiesQuery.suspense(),
  organizationsQuery.suspense(),
  promoListingQuery.suspense(),
  filterCountsQuery.suspense(),
];

if (routeParams.value.spec) {
  suspensePromises.push(oksoByCodeQuery.suspense());
}

await Promise.all(suspensePromises);

// Этап 2: похожие специальности (после загрузки spec, если был)
if (hasDirectionAndLevel.value) {
  await Promise.all([
    okso6SimilarQuery.suspense(),
    okso3SimilarQuery.suspense(),
  ]);
}

// Проверка существования специальности после загрузки
if (routeParams.value.spec && specData.value) {
  const isSpecExist = storeInfo.isUniversity
    ? specData.value?.level?.in_university
    : specData.value?.level?.in_college;

  if (!isSpecExist) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Speciality Does Not Exist',
      fatal: true,
    });
  }

  if (!specData.value?.group?.direction?.slug) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not found okso group direction slug',
      fatal: true,
    });
  }

  storeFilter.speciality = specData.value;
} else if (routeParams.value.spec && !specData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Speciality Not Found',
    fatal: true,
  });
} else {
  storeFilter.speciality = null;
}

// Статусы загрузки
const organizatiosPending = computed(() => organizationsQuery.isPending.value);
const filterCountsPending = computed(() => filterCountsQuery.isPending.value);
const promoListingPending = computed(() => promoListingQuery.isPending.value);
const listingMeta = computed(() => storeApi.listingMeta);

// Сбрасываем флаг навигации после загрузки данных
finishNavigation();

// Фильтры для исключения опций, если их нет в результатах
const zeroFilters = ref({
  cities: storeApi.filterCounts?.cities_id || undefined,
  directions: storeApi.filterCounts?.direction_id || undefined,
  levels: storeApi.filterCounts?.level_id || undefined,
  base: storeApi.filterCounts?.base || undefined,
  state: storeApi.filterCounts?.is_state || undefined,
  budget: storeApi.filterCounts?.is_budget || undefined,
  military: storeApi.filterCounts?.has_military || undefined,
  hostel: storeApi.filterCounts?.has_hostel || undefined,
  distance: storeApi.filterCounts?.has_distance || undefined,
  atvuz: storeApi.filterCounts?.at_vuz || undefined,
});

const updateStoreQuery = (params) => {
  for (const property in params) {
    if (params[property] === 'true') {
      storeFilter.query[property] = Boolean(params[property]);
    } else {
      storeFilter.query[property] = params[property];
    }
  }

  for (const key in storeFilter.currentQuery) {
    if (!params.hasOwnProperty(key)) {
      storeFilter.query[key] = null;
    }
  }

  if (!params.hasOwnProperty('spec')) {
    storeFilter.speciality = null;
  }
};

// Инициализация storeFilter.query из URL при загрузке компонента
updateStoreQuery(routeParams.value);

// Watch для обработки изменений маршрута (обновляем storeFilter.query)
// TanStack Query автоматически обновит данные при изменении computed routeParams
watch(
  () => route.params,
  (newRoute) => {
    const params = newRoute.path ? useConvertedToStore(newRoute.path) : {};
    updateStoreQuery(params);
  },
  { deep: true },
);

// Watch для синхронизации storeFilter.speciality с загруженными данными
watch(
  () => specData.value,
  (data) => {
    if (data) {
      storeFilter.speciality = data;
    } else if (!routeParams.value.spec) {
      storeFilter.speciality = null;
    }
  }
);

let specialityMap = new Map([
  ['01', 'Профессия'],
  ['02', 'Специальность'],
  ['03', 'Бакалавриат'],
  ['04', 'Магистратура'],
  ['05', 'Специалитет'],
  ['06', 'Аспирантура'],
  ['07', 'Адъюнктура'],
  ['08', 'Ординатура'],
  ['09', 'Ассистентура-стажировка'],
]);

const specialityVariant = computed(() => {
  if (!storeFilter.speciality?.code) return;
  if (storeFilter.speciality?.code?.length < 7) {
    return specialityMap.get('06');
  } else {
    return specialityMap.get(storeFilter.speciality?.code.split('.')[1]);
  }
});

const filterHandler = async (value) => {
  const path = useConvertedToQuery(value);

  router.replace({
    path: `/${route.name}/${path}`,
    query: {
      page: path.page !== undefined && parseInt(path.page, 10) !== 1 ? path.page : undefined,
    },
  });
};

watch(
  () => route.query.page,
  (newPage) => {
    if (newPage) {
      storeFilter.page = parseInt(newPage, 10);
    } else {
      storeFilter.page = 1;
    }
  },
  { immediate: true },
);

const setPage = (event) => {
  router.replace({
    query: {
      page: event !== 1 ? event : undefined,
    },
  });
  if (process.client) {
    useSmoothScroll(600);
  }
};

const instVariant = computed(() => {
  const isVuz = route.path.startsWith('/vuz');
  const isKolledzh = route.path.startsWith('/kolledzh');

  if (isVuz) {
    return storeFilter.directionName ? 'вузы' : 'Вузы';
  }
  if (isKolledzh) {
    return storeFilter.directionName ? 'колледжи' : 'Колледжи';
  }
  return '';
});

const title = computed(() => {
  return `${specialityVariant.value ? specialityVariant.value : ''} ${
    storeFilter.speciality?.name ? `«${storeFilter.speciality?.name}» / ` : ''
  }${storeFilter.directionName ? storeFilter.directionName : ''} ${instVariant.value} ${
    storeFilter.hasCity && storeFilter.city?.name_variations?.p_roditelny
      ? storeFilter.city?.name_variations?.p_roditelny
      : storeFilter.hasSubject
      ? storeFilter.subjectNameVariant
      : 'России'
  }${storeFilter.levelName ? ' ' + storeFilter.levelName.toLowerCase() : ''}${
    storeFilter.metaTitle ? ': ' + storeFilter.metaTitle : ''
  }`;
});

watch([isNavigating, organizatiosPending], ([navigating, pending]) => {
  if (navigating && !pending) {
    finishNavigation();
  }
});

// Сбрасываем isNavigating при загрузке, если данные уже загружены
if (!organizatiosPending.value && isNavigating.value) {
  finishNavigation();
}
</script>

<style lang="scss" scoped>
.p-listing {
  &__counts {
    font-size: to-rem(14);
    line-height: to-rem(18);
  }

  &__title {
    max-width: to-rem(976);
  }

  &__seo {
    max-width: to-rem(976);
  }

  &__specialties {
    margin-bottom: to-rem(32);
    max-width: to-rem(896);
  }

  &__filter {
    display: none;

    @media (min-width: 1024px) {
      display: block;
    }

    &-mobile {
      display: block;

      @media (min-width: 1024px) {
        display: none;
      }
    }
  }

  &__link {
    color: var(--base-blue);
  }

  &__promos {
    &-item {
      padding: to-rem(16);
      border-bottom: to-rem(1) solid var(--base-gray-border);

      &:last-child {
        border-bottom: 0;
      }
    }
  }

  &__skeleton {
    &--filter {
      min-height: to-rem(112);
    }

    &--title {
      width: to-rem(210);
      min-height: to-rem(40);
    }

    &--counts {
      width: to-rem(320);
      min-height: to-rem(18);
    }

    &--listing-promo {
      width: 100%;
      min-height: to-rem(44);
      margin: to-rem(16) 0;
    }
  }
}
</style>
