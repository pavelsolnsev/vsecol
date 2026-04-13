<!-- eslint-disable max-len -->
<template>
  <div class="listing-filter-mobile listing-filter-mobile_mobile">
    <div class="listing-filter-mobile__row">
      <div
        class="listing-filter-mobile__header"
        :class="{ 'listing-filter-mobile__header--open': isShow }"
        @click="isShow = !isShow"
      >
        Фильтр
        <component :is="isShow ? FilterActive : Filter" class="listing-filter-mobile__header-icon" />
      </div>
    </div>
    <div
      v-if="isShow"
      class="listing-filter-mobile__row listing-filter-mobile__container"
      :class="{ 'listing-filter-mobile__container--mobile': !isShow }"
    >
      <ul class="listing-filter__list">
        <li class="listing-filter__list-item">
          <ASelectSearchMobile
            v-model="filterCity"
            placeholder="Выберите город"
            :options="cities"
            item-text="name"
            item-value="id"
            with-links
            with-links-name="city"
            class="listing-filter-mobile__select"
            @on-input="debouncedFetch"
          />
        </li>

        <li
          v-if="
            !storeFilter.hasCity ||
            !storeFilter.hasSubject ||
            (storeFilter.hasCity && storeFilter.city?.is_capital) ||
            storeFilter.speciality?.code !== undefined
          "
          class="listing-filter-mobile__list-item"
        >
          <ASelectMobile
            v-model="filterDirection"
            placeholder="Тип образования"
            :options="storeFilter.directionsList"
            :options-excluded="zeroFilters.directions"
            item-text="name"
            item-value="id"
            search-placeholder="Введите тип образования"
            with-links
            with-links-name="direction"
            searchable
            class="listing-filter-mobile__select"
          />
        </li>

        <li
          v-if="
            !storeFilter.hasCity ||
            !storeFilter.hasSubject ||
            (storeFilter.hasCity && storeFilter.city?.is_capital) ||
            storeFilter.speciality?.code !== undefined
          "
          class="listing-filter-mobile__list-item"
        >
          <ASelectMobile
            v-model="filterLevel"
            placeholder="Уровень образования"
            :options="filterLevels"
            :options-excluded="isUniversityPage ? zeroFilters.levels : zeroFilters.base"
            item-text="name"
            item-value="value"
            search-placeholder="Введите уровень образования"
            with-links
            with-links-name="level"
            class="listing-filter-mobile__select"
          />
        </li>
        <li class="listing-filter-mobile__list-item">
          <ASelectMobile
            v-model="filterState"
            placeholder="Форма собственности"
            :options="stateOptions"
            :options-excluded="zeroFilters.state"
            item-text="name"
            item-value="slug"
            with-links
            with-links-name="state"
            class="listing-filter__select"
          />
        </li>
        <li class="listing-filter-mobile__list-item">
          <ACheckbox
            v-model="isBudget"
            label-text="Бюджетные"
            box-position="right"
            block
            type="filter"
            with-links
            with-links-name="budget"
            :route-name="route.name"
            :with-links-params="routePath"
            :with-links-order="ORDER_ATTRIBUTES"
            :disabled="zeroFilters.budget"
            class="listing-filter-mobile__checkbox"
            @update:model-value="change"
          />
        </li>
        <li v-if="isCollegePage" class="listing-filter-mobile__list-item">
          <ACheckbox
            v-model="isAtvuz"
            label-text="При вузах"
            box-position="right"
            block
            type="filter"
            with-links
            with-links-name="atvuz"
            :route-name="route.name"
            :with-links-params="routePath"
            :with-links-order="ORDER_ATTRIBUTES"
            :disabled="zeroFilters.atvuz"
            class="listing-filter-mobile__checkbox"
            @update:model-value="change"
          />
        </li>
        <li v-if="!isCollegePage" class="listing-filter-mobile__list-item">
          <ACheckbox
            v-model="hasMilitary"
            label-text="С военной кафедрой"
            box-position="right"
            block
            type="filter"
            with-links
            with-links-name="military"
            :route-name="route.name"
            :with-links-params="routePath"
            :with-links-order="ORDER_ATTRIBUTES"
            :disabled="zeroFilters.military"
            class="listing-filter-mobile__checkbox"
            @update:model-value="change"
          />
        </li>
        <li class="listing-filter-mobile__list-item">
          <ACheckbox
            v-model="hasHostel"
            label-text="С общежитием"
            box-position="right"
            block
            type="filter"
            with-links
            with-links-name="hostel"
            :route-name="route.name"
            :with-links-params="routePath"
            :with-links-order="ORDER_ATTRIBUTES"
            :disabled="zeroFilters.hostel"
            class="listing-filter-mobile__checkbox"
            @update:model-value="change"
          />
        </li>
        <li class="listing-filter-mobile__list-item">
          <ACheckbox
            v-model="hasDistance"
            label-text="Дистанционные"
            box-position="right"
            block
            type="marked"
            with-links
            with-links-name="distance"
            :route-name="route.name"
            :with-links-params="routePath"
            :with-links-order="ORDER_ATTRIBUTES"
            :disabled="zeroFilters.distance"
            class="listing-filter-mobile__checkbox"
            @update:model-value="change"
          />
        </li>
        <li
          class="listing-filter-mobile__list-item listing-filter-mobile__list-item--flex listing-filter-mobile__list-item--flex-center"
        >
          <AButton
            aria-label="Сбросить фильтр"
            label="Сбросить"
            variant="tonal"
            block
            class="listing-filter-mobile__button"
            @click="reset"
          >
            <template #append>
              <Close class="listing-filter-mobile__button-icon" />
            </template>
          </AButton>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import ASelectSearchMobile from '~/components/_ui/a-select-search-mobile.vue';
import ASelectMobile from '~/components/_ui/a-select-mobile.vue';
import ACheckbox from '~/components/_ui/a-checkbox.vue';
import AButton from '~/components/_ui/a-button.vue';
import Close from '~/components/_icons/Close.vue';
import Filter from '~/components/_icons/Filter.vue';
import FilterActive from '~/components/_icons/FilterActive.vue';
import { SORT, ORDER_ATTRIBUTES } from '~/shared/constants';
import { levels } from '~/shared/levels';
import { useInfoStore } from '~/store/info';
import { useFilterStore } from '~/store/filter';

const emit = defineEmits(['on-change', 'on-reset']);

defineProps({
  zeroFilters: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const route = useRoute();
const storeInfo = useInfoStore();
const storeFilter = useFilterStore();
const { city } = storeToRefs(storeFilter);
const { isKolledzh: isCollegePage, isVuz: isUniversityPage } = usePageNavigation();

const isShow = ref(null);

const stateOptions = computed(() => [
  {
    id: true,
    name: 'Государственные',
    slug: 'true',
  },
  {
    id: false,
    name: 'Негосударственные',
    slug: 'false',
  },
]);

const filterCity = ref({
  name: city.value?.name || 'Выберите город',
  slug: city.value?.slug || '',
  subject: city.value?.subject,
});

const filterSubject = computed(() => {
  return storeFilter.storeSubject
    ? {
        name: storeFilter.storeSubject?.name || '',
        slug: storeFilter.storeSubject?.slug || '',
      }
    : {
        name: filterCity.value.subject?.name || '',
        slug: filterCity.value.subject?.slug || '',
      };
});

const filterLevels = computed(() => (isUniversityPage.value ? levels.vuz : levels.kolledzh));

const filterDirection = ref({
  id: storeFilter.storeDirection?.id || null,
  name: storeFilter.storeDirection?.name || 'Тип образования',
  slug: storeFilter.storeDirection?.slug || '',
});

const filterLevel = ref({
  name: storeFilter.storeLevel?.name || 'Уровень образования',
  slug: storeFilter.storeLevel?.slug || '',
});

const isBudget = computed({
  get() {
    return storeFilter.currentQuery.budget;
  },
  set(newValue) {
    storeFilter.query.budget = newValue;
  },
});

const isAtvuz = computed({
  get() {
    return storeFilter.currentQuery.atvuz;
  },
  set(newValue) {
    storeFilter.query.atvuz = newValue;
  },
});

const hasMilitary = computed({
  get() {
    return storeFilter.currentQuery.military;
  },
  set(newValue) {
    storeFilter.query.military = newValue;
  },
});

const hasHostel = computed({
  get() {
    return storeFilter.currentQuery.hostel;
  },
  set(newValue) {
    storeFilter.query.hostel = newValue;
  },
});

const hasDistance = computed({
  get() {
    return storeFilter.currentQuery.distance;
  },
  set(newValue) {
    storeFilter.query.distance = newValue;
  },
});

const filterSpec = ref({
  name: storeFilter.storeSpec?.name || 'Уровень образования',
  slug: storeFilter.storeSpec?.code || '',
});

const filterState = ref(
  (storeFilter.currentQuery.state &&
    stateOptions.value.find((i) => i.slug === storeFilter.currentQuery.state.toString())) || {
    name: 'Форма собственности',
    slug: '',
  },
);

const routePath = computed(() => useConvertedToStore(route.params.path));

const filterSort = ref(
  routePath.value.sort
    ? SORT[storeInfo.path].find((s) => s.slug === routePath.value.sort)
    : {
        name: 'По умолчанию',
        slug: '',
      },
);

const fetchCities = async (name) => {
  try {
    const result = await $fetch(`/api/cities`, {
      params: {
        with: 'subject',
        page: name ? undefined : 1,
        name: name ? name : undefined,
        perPage: storeFilter.hasCity || !storeFilter.hasSubject ? 16 : undefined,
        orderBy: storeFilter.hasCity || !storeFilter.hasSubject ? 'sort' : undefined,
        type: isUniversityPage.value ? 'university' : 'college',
      },
    });

    if (!result?.data?.length) {
      return [];
    }

    return result.data.map((c) => ({
      name: c.name,
      slug: c.slug,
      subject: c.subject,
    }));
  } catch (error) {
    console.error(error);
  }
};

const cities = ref(storeFilter.cities);
const cityIsLoading = ref(false);

//cities.value = storeFilter.cities;

const debouncedFetch = useDebounce(async (newValue) => {
  cityIsLoading.value = true;
  cities.value = await fetchCities(newValue);
  cityIsLoading.value = false;
}, 1000);

const change = () => {
  storeFilter.page = 1;

  emit('on-change', {
    subject: filterSubject.value.slug || undefined,
    city: filterCity.value.slug || undefined,
    direction: filterDirection.value.slug || undefined,
    level: filterLevel.value.slug || undefined,
    spec: filterSpec.value.slug || undefined,
    state: filterState.value.slug || undefined,
    budget: isBudget.value,
    atvuz: isAtvuz.value,
    military: hasMilitary.value,
    hostel: hasHostel.value,
    distance: hasDistance.value,
    sort: filterSort.value.slug || undefined,
  });
};

const reset = () => {
  emit('on-reset', {
    subject: filterSubject.value.slug || undefined,
    city: filterCity.value.slug || undefined,
  });
};
</script>

<style lang="scss" scoped>
.listing-filter-mobile {
  &_mobile {
    padding: to-rem(16);
    background-color: var(--base-gray-smoky);
    border-radius: to-rem(8);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: to-rem(18);

    &-icon {
      width: to-rem(24);
      height: to-rem(24);
    }

    &--open {
      color: var(--base-blue);
    }
  }

  &__container {
    height: auto;
    margin-top: to-rem(24);

    &--mobile {
      height: 0;
      margin-top: 0;
    }
  }

  &__row {
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    border-bottom: to-rem(1) solid var(--base-gray-smoky);

    @media (min-width: 1024px) {
      flex-direction: row;
      padding-top: to-rem(16);
      // stylelint-disable-next-line
      padding-bottom: 0 !important;

      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        padding-bottom: 0;
        border-bottom: 0;
      }
    }
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: to-rem(8);

    &-item {
      width: 100%;

      @media (min-width: 767px) {
        width: calc(33% - 8px);
      }

      @media (min-width: 1024px) {
        width: calc(25% - 8px);
      }

      @media (min-width: 1440px) {
        width: calc(16.666% - 8px);
      }

      &--full {
        @media (min-width: 767px) {
          width: 70%;
        }
      }

      &--flex {
        display: flex;

        &-center {
          justify-content: center;
        }
      }
    }
  }

  &__select {
    min-width: to-rem(180);

    &:last-child {
      margin-right: 0;
      margin-bottom: 0;
    }
  }

  &__checkbox {
    min-width: to-rem(180);
  }

  &__button {
    &-icon {
      width: to-rem(18);
      height: to-rem(18);
      margin-left: to-rem(16);
    }
  }
}
</style>
