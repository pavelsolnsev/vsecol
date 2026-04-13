<template>
  <div class="listing-filter">
    <div class="listing-filter__row listing-filter__container">
      <ul class="listing-filter__list">
        <li class="listing-filter__list-item">
          <ASelectSearch
            v-model="filterCity"
            placeholder="Выберите город"
            :options="cities"
            item-text="name"
            item-value="id"
            with-search
            search-placeholder="Введите город"
            with-links
            with-links-name="city"
            :loading="cityIsLoading"
            class="listing-filter__select"
            @on-input="debouncedFetch"
          />
        </li>
        <li
          v-if="
            !storeFilter.hasCity || !storeFilter.hasSubject || (storeFilter.hasCity && storeFilter.city?.is_capital)
          "
          class="listing-filter__list-item"
        >
          <ASelect
            v-model="filterDirection"
            placeholder="Тип образования"
            :options="storeFilter.directionsList"
            :options-excluded="zeroFilters.directions"
            item-text="name"
            item-value="id"
            with-links
            with-links-name="direction"
            class="listing-filter__select"
          />
        </li>
        <li
          v-if="
            !storeFilter.hasCity || !storeFilter.hasSubject || (storeFilter.hasCity && storeFilter.city?.is_capital)
          "
          class="listing-filter__list-item"
        >
          <ASelect
            v-model="filterLevel"
            placeholder="Уровень образования"
            :options="levelOptions"
            :options-excluded="isUniversityPage ? zeroFilters.levels : zeroFilters.base"
            item-text="name"
            item-value="value"
            with-links
            with-links-name="level"
            class="listing-filter__select"
          />
        </li>
        <li class="listing-filter__list-item">
          <ASelect
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
        <li class="listing-filter__list-item">
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
            class="listing-filter__checkbox"
            @update:model-value="change"
          />
        </li>
        <li v-if="isCollegePage" class="listing-filter__list-item">
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
            class="listing-filter__checkbox"
            @update:model-value="change"
          />
        </li>
        <li v-if="!isCollegePage" class="listing-filter__list-item">
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
            class="listing-filter__checkbox"
            @update:model-value="change"
          />
        </li>
        <li class="listing-filter__list-item">
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
            class="listing-filter__checkbox"
            @update:model-value="change"
          />
        </li>
        <li class="listing-filter__list-item">
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
            class="listing-filter__checkbox"
            @update:model-value="change"
          />
        </li>
        <li class="listing-filter__list-item listing-filter__list-item--flex listing-filter__list-item--flex-center">
          <AButton
            aria-label="Сбросить фильтр"
            label="Сбросить"
            variant="tonal"
            block
            class="listing-filter__button"
            @click="reset"
          >
            <template #append>
              <Close class="listing-filter__button-icon" />
            </template>
          </AButton>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import ASelectSearch from '~/components/_ui/a-select-search.vue';
import ASelect from '~/components/_ui/a-select.vue';
import ACheckbox from '~/components/_ui/a-checkbox.vue';
import AButton from '~/components/_ui/a-button.vue';
import Close from '~/components/_icons/Close.vue';
import { ORDER_ATTRIBUTES } from '~/shared/constants';
import { levels } from '~/shared/levels';
import { useFilterStore } from '~/store/filter';

const emit = defineEmits(['on-change', 'on-reset']);

defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
  zeroFilters: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const route = useRoute();
const storeFilter = useFilterStore();
const { city, storeDirection, storeLevel } = storeToRefs(storeFilter);
const { isKolledzh: isCollegePage, isVuz: isUniversityPage } = usePageNavigation();

const levelOptions = computed(() => (isUniversityPage.value ? levels.vuz : levels.kolledzh));

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

const filterDirection = ref({
  id: storeFilter.storeDirection?.id || null,
  name: storeFilter.storeDirection?.name || 'Тип образования',
  slug: storeFilter.storeDirection?.slug || '',
});

const filterLevel = ref({
  name: storeFilter.storeLevel?.name || 'Уровень образования',
  slug: storeFilter.storeLevel?.slug || '',
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
  }
);

// Watch для обновления filter'ов при изменении store
watch(
  () => [city.value, storeDirection.value, storeLevel.value, storeFilter.currentQuery.state],
  ([newCity, newDirection, newLevel, newState]) => {
    filterCity.value = {
      name: newCity?.name || 'Выберите город',
      slug: newCity?.slug || '',
      subject: newCity?.subject,
    };
    filterDirection.value = {
      id: newDirection?.id || null,
      name: newDirection?.name || 'Тип образования',
      slug: newDirection?.slug || '',
    };
    filterLevel.value = {
      name: newLevel?.name || 'Уровень образования',
      slug: newLevel?.slug || '',
    };
    filterState.value =
      (newState && stateOptions.value.find((i) => i.slug === newState.toString())) || {
        name: 'Форма собственности',
        slug: '',
      };
  },
);

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

const routePath = computed(() => useConvertedToStore(route.params.path));

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
  });
};

const reset = () => {
  emit('on-reset', {
    subject: filterSubject.value.slug || undefined,
    city: filterCity.value.slug || undefined,
  });
};
</script>

<style lang="scss">
.listing-filter {
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

    &--mobile {
      height: 0;
    }
  }

  &__row {
    display: flex;
    flex-flow: column wrap;
    justify-content: space-between;
    border-bottom: to-rem(1) solid var(--base-gray-smoky);

    @media (min-width: 767px) {
      flex-direction: row;
      padding-top: to-rem(16);
      padding-bottom: to-rem(16);

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
    gap: to-rem(8);
    display: flex;
    flex-wrap: wrap;

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
