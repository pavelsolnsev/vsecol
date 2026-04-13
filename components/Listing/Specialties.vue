<template>
  <section class="listing-specialties">
    <div class="listing-specialties__container">
      <div class="listing-specialties__title">
        <template v-if="storeFilter.hasSpeciality"
          >Похожие специальности {{ isVuz ? 'в вузах' : 'в колледжах' }}
          {{
            storeFilter.hasCity
              ? storeFilter.city?.name_variations?.p_roditelny
                ? storeFilter.city?.name_variations?.p_roditelny
                : 'России'
              : storeFilter.subjectNameVariant
              ? storeFilter.subjectNameVariant
              : 'России'
          }}:</template
        >
        <template v-else
          >Показаны {{ isVuz ? 'вузы' : 'колледжи' }}
          {{
            storeFilter.hasCity
              ? storeFilter.city?.name_variations?.p_roditelny
                ? storeFilter.city?.name_variations?.p_roditelny
                : 'России'
              : storeFilter.subjectNameVariant
              ? storeFilter.subjectNameVariant
              : 'России'
          }}
          по специальностям:</template
        >
      </div>

      <div class="listing-specialties__wrapper">
        <div
          class="listing-specialties__wrapper-container"
          :class="{ 'listing-specialties__wrapper-container--active': isActive }"
        >
          <ul class="listing-specialties__list">
            <li v-for="(spec, index) in specialties" :key="index" class="listing-specialties__list-item">
              <NuxtLink class="listing-specialties__spec" :href="specPath(spec?.code)">{{ spec?.name }}</NuxtLink>
              ({{ spec?.code }})<template
                v-if="!!specialties && specialties.length > 1 && index < specialties.length - 1"
                >,
              </template>
            </li>
          </ul>
        </div>
        <div
          v-if="specialties && specialties.length >= 3"
          class="listing-specialties__wrapper-all"
          :class="{ 'listing-specialties__wrapper-all--active': isActive }"
          @click="isActive = !isActive"
        >
          {{ isActive ? 'скрыть' : 'показать все' }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useFilterStore } from '~/store/filter';

const storeFilter = useFilterStore();

// Используем route.path для определения типа страницы
const { isVuz, currentPath } = useRouteInfo();

defineProps({
  specialties: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const isActive = ref(false);

const specPath = (code) => {
  if (storeFilter.hasCity && storeFilter.hasSubject)
    // eslint-disable-next-line
    return `/${currentPath.value}/subject_${storeFilter.currentQuery.subject}/city_${storeFilter.currentQuery.city}/spec_${code}/`;
  if (storeFilter.hasCity && !storeFilter.hasSubject)
    // eslint-disable-next-line
    return `/${currentPath.value}/city_${storeFilter.currentQuery.city}/spec_${code}/`;
  if (!storeFilter.hasCity && storeFilter.hasSubject)
    // eslint-disable-next-line
    return `/${currentPath.value}/subject_${storeFilter.currentQuery.subject}/spec_${code}/`;
  return `/${currentPath.value}/spec_${code}/`;
};
</script>

<style lang="scss">
.listing-specialties {
  max-width: to-rem(976);

  &__title {
    margin-bottom: to-rem(8);
    font-size: to-rem(14);
    font-weight: 700;
    line-height: to-rem(18);
  }

  &__list {
    display: flex;
    flex-wrap: wrap;

    &-item {
      margin-right: to-rem(4);
      margin-bottom: to-rem(4);

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__spec {
    color: var(--base-blue);

    &:hover {
      cursor: pointer;
    }
  }

  &__wrapper {
    position: relative;

    &-container {
      overflow: hidden;
      max-width: to-rem(790);
      height: to-rem(18);
      white-space: nowrap;
      transition: all 0.6s ease-in;

      &--active {
        height: 100%;
        white-space: initial;
        transition: all 0.6s ease-in;
      }
    }

    &-all {
      z-index: 1;
      right: 0;
      bottom: 0;
      color: var(--base-blue);
      cursor: pointer;

      @media (min-width: 767px) {
        position: absolute;
      }

      &--active {
        bottom: to-rem(-14);
      }
    }
  }
}
</style>
