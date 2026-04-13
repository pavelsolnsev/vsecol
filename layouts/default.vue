<template>
  <div>
    <TheHeader />
    <SMain>
      <slot></slot>
      <div class="l-wide ai-wrapper">
        <LazyAIСonsultant />
      </div>
    </SMain>
    <TheQuizStretch />
    <LazyTheFooter />
  </div>
</template>

<script setup>
import SMain from '~/components/_ui/s-main.vue';
import TheHeader from '~/components/TheHeader.vue';
import TheQuizStretch from '~/components/TheQuizStretch.vue';
import { useApiDirections } from '~/composables/api/useApiDirections';
import { useApiLevels } from '~/composables/api/useApiLevels';
import { useEventListener } from '@vueuse/core';
import { useDeviceStore } from '~/store/device';

const { width } = storeToRefs(useDeviceStore());

const handleResize = () => {
  width.value = window.innerWidth;
};

onMounted(() => {
  handleResize();

  if (import.meta.client) {
    useEventListener('resize', handleResize);
  }
});

const directionsParams = computed(() => ({ perPage: 'all', use_about: true }));
const levelsParams = computed(() => ({ perPage: 'all' }));

const [
  // eslint-disable-next-line
  { isPending: citiesPending },
  // eslint-disable-next-line
  { isPending: promoListingPending },
] = await Promise.all([useApiDirections(directionsParams), useApiLevels(levelsParams)]);

const route = useRoute();
const storeFilter = useFilterStore();
const storeInfo = useInfoStore();
const storeApi = useApiStore();
const listingMeta = computed(() => storeApi.listingMeta);

const specialityVariantMap = new Map([
  ['bachelor-specialty', 'с высшим образованием'],
  ['magistracy', 'с магистратурой'],
  ['graduate-school', 'с аспирантурой'],
  ['adjunct', 'с адъюнктурой'],
  ['residency', 'с ординатурой'],
  ['internship', 'с ассистентурой-стажировкой'],
  ['professions-spo', 'после 9 класса'],
  ['specialities-spo', 'после 11 класса'],
]);

const specialityVariant = computed(() => {
  if (!storeFilter.speciality?.code) return;
  if (storeFilter.speciality?.code.length < 7) {
    return specialityVariantMap.get('06');
  } else {
    return specialityVariantMap.get(storeFilter.speciality?.code.split('.')[1]);
  }
});

const instVariant = computed(() => {
  return storeInfo.isUniversity
    ? storeFilter.directionName
      ? 'вузы'
      : 'Вузы'
    : storeInfo.isCollege
    ? storeFilter.directionName
      ? 'колледжи'
      : 'Колледжи'
    : '';
});

const postfix = computed(() =>
  !!storeFilter.directionName || !!storeFilter.levelName || !!storeFilter.speciality?.name || !!storeFilter.metaTitle
    ? ' '
    : storeInfo.isUniversity
    ? ': список институтов и университетов'
    : ': список техникумов и училищ',
);

const metaOrgCount = computed(() => (listingMeta.value?.total > 0 ? ' ' + listingMeta.value?.total : ''));
const metaSpecCount = computed(() =>
  listingMeta.value?.total_okso ? `, специальности (${listingMeta.value?.total_okso})` : '',
);

const specialityMap = new Map([
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

const specialityLevelVariant = computed(() => {
  if (!storeFilter.speciality?.code) return;
  if (storeFilter.speciality?.code?.length < 7) {
    return specialityMap.get('06');
  } else {
    return specialityMap.get(storeFilter.speciality?.code.split('.')[1]);
  }
});

const metaTitle = computed(() => {
  if (storeInfo.path && !storeInfo.isCities && !storeInfo.isSpecialties) {
    const parts = [];

    if (specialityLevelVariant.value) {
      parts.push(`${specialityLevelVariant.value} `);
    }

    if (storeFilter.speciality?.name) {
      let specPart = `"${storeFilter.speciality?.name}"`;
      if (specialityVariant.value) {
        specPart += ` (${storeFilter.speciality?.code})`;
      }
      specPart += ' / ';
      parts.push(specPart);
    }

    if (storeFilter.directionName) {
      parts.push(`Все ${storeFilter.directionName.toLowerCase()} `);
    } else {
      parts.push('Все ');
    }

    parts.push(`${instVariant.value.toLowerCase()} `);

    if (storeFilter.hasCity && storeFilter.city?.name_variations?.p_roditelny) {
      parts.push(storeFilter.city?.name_variations?.p_roditelny);
    } else if (storeFilter.hasSubject && storeFilter.subjectNameVariant) {
      parts.push(storeFilter.subjectNameVariant);
    } else {
      parts.push('России');
    }

    if (storeFilter.query.level) {
      const levelText = specialityVariantMap.get(storeFilter.query.level);
      if (levelText) {
        parts.push(` ${levelText}`);
      }
    }

    if (storeFilter.metaTitle) {
      parts.push(`: ${storeFilter.metaTitle}`);
    }

    if (postfix.value) {
      parts.push(postfix.value);
    }

    return parts.join('');
  }

  if (storeInfo.path && storeInfo.isCities) {
    return `${storeInfo.currentRouteName} — города (демо)`;
  }

  if (storeInfo.path && storeInfo.isSpecialties) {
    if (storeInfo.isUniversity) {
      return 'Специальности ВО, ОКСО (демо)';
    } else {
      return 'Специальности СПО, ОКСО (демо)';
    }
  }

  return 'Демо: каталог ВУЗов и СПО';
});

const metaDescription = computed(() => {
  if (route.name === 'vuz' || route.name === 'kolledzh') {
    const parts = [];

    parts.push(`Список${metaOrgCount.value}`);

    if (storeFilter.directionVariant && !storeFilter.speciality?.name) {
      parts.push(` ${storeFilter.directionVariant.toLowerCase()} `);
    } else {
      parts.push(' ');
    }

    parts.push(storeInfo.isUniversity ? 'вузов' : 'ссузов');

    if (storeFilter.hasCity) {
      parts.push(` ${storeFilter.city?.name_variations?.p_roditelny}`);
    } else if (storeFilter.hasSubject) {
      parts.push(` ${storeFilter.subjectNameVariant}`);
    } else {
      parts.push(' России');
    }

    if (storeFilter.query.level) {
      const levelText = specialityVariantMap.get(storeFilter.query.level);
      if (levelText) {
        parts.push(` ${levelText}`);
      }
    }

    parts.push(storeInfo.isUniversity ? ' (университеты и институты)' : ' (колледжи, техникумы и училища)');

    if (storeFilter.speciality?.name) {
      parts.push(` по специальности «${storeFilter.speciality?.name}»`);

      if (specialityLevelVariant.value) {
        parts.push(` (${specialityLevelVariant.value.toLowerCase()}, ${storeFilter.speciality?.code})`);
      }
    }

    if (storeFilter.metaTitle) {
      parts.push(` ${storeFilter.metaTitle}`);
    }

    if (!storeFilter.speciality?.name) {
      parts.push(metaSpecCount.value);
    }

    const currentYear = useCurrentYear();
    parts.push(`. Демо-данные для портфолио, ${currentYear}.`);

    return parts.join('');
  }

  return 'Демонстрационный каталог образовательных программ для портфолио.';
});

// Добавляем пагинацию для страниц листингов
const currentPage = computed(() => parseInt(route.query.page) || 1);

const metaTitleWithPage = computed(() => {
  if (currentPage.value > 1 && (route.name === 'vuz' || route.name === 'kolledzh')) {
    return `${metaTitle.value} - страница ${currentPage.value}`;
  }
  return metaTitle.value;
});

const metaDescriptionWithPage = computed(() => {
  if (currentPage.value > 1 && (route.name === 'vuz' || route.name === 'kolledzh')) {
    return `Страница ${currentPage.value} - ${metaDescription.value}`;
  }
  return metaDescription.value;
});

useSeoMeta({
  title: metaTitleWithPage,
  description: metaDescriptionWithPage,
});
</script>

<style lang="scss" scoped>
.ai-wrapper {
  position: sticky;
  bottom: to-rem(74);
  right: to-rem(16);
  z-index: 100;

  @media (min-width: 768px) and (max-width: 1023px) {
    bottom: to-rem(64);
    right: to-rem(20);
  }

  @media (min-width: 1024px) {
    bottom: to-rem(20);
    right: to-rem(20);
  }
}
</style>
