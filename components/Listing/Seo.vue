<template>
  <section class="listing-question">
    <ATitle tag="h2" class="listing-question__title a-title--h3">{{ questionPattern }}</ATitle>
    <div class="listing-question__description">
      {{ answerPattern }}
    </div>
  </section>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import { useFilterStore } from '~/store/filter';

const props = defineProps({
  totalOrganizations: {
    type: [String, Number],
    default: '',
  },
});

const storeFilter = useFilterStore();

// Используем route.path для определения типа страницы
const { isVuz, pageTitleSingular } = useRouteInfo();

const dictLevel = {
  'bachelor-specialty': 'на высшее образование',
  'magistracy': 'в магистратуру',
  'graduate-school': 'в аспирантуру',
  'adjunct': 'в адъюнктуру',
  'residency': 'в ординатуру',
  'internship': 'на ассистентуру-стажировку',
  'professions-spo': 'после 9 класса',
  'specialities-spo': 'после 11 класса',
};

const dictSpec = new Map([
  ['01', 'по профессии'],
  ['02', 'на специальность'],
  ['03', 'на бакалавриат'],
  ['05', 'на специалитет'],
  ['04', 'в магистратуру'],
  ['06', 'в аспирантуру'],
  ['07', 'в адъюнктуру'],
  ['08', 'в ординатуру'],
  ['09', 'на ассистентуру-стажировку'],
]);

const dictSpecDescription = new Map([
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

const dictLevelVariant = {
  'bachelor-specialty': 'по программам высшего образования',
  'magistracy': 'по программам магистратуры',
  'graduate-school': 'по программам аспирантуры',
  'adjunct': 'по программам адъюнктуры',
  'residency': 'по программам ординатуры',
  'internship': 'по программам ассистентуры-стажировки',
  'professions-spo': 'после 9 класса',
  'specialities-spo': 'после 11 класса',
};

const city = computed(() =>
  storeFilter.city?.name_variations?.p_roditelny
    ? storeFilter.city?.name_variations?.p_roditelny
    : storeFilter.subjectNameVariant
    ? storeFilter.subjectNameVariant
    : 'России',
);
const direction = computed(() => (storeFilter.directionName ? storeFilter.directionName.toLowerCase() : ''));
const level = computed(() => (storeFilter.currentQuery.level ? ` ${dictLevel[storeFilter.currentQuery.level]}` : ''));

const spec = computed(() => {
  if (storeFilter.currentQuery.spec) {
    if (storeFilter.currentQuery.spec.length < 7) {
      return ` ${dictSpec.get('06')} ${storeFilter.speciality?.name}`;
    } else {
      return ` ${dictSpec.get(storeFilter.currentQuery.spec.split('.')[1]) || ''} "${storeFilter.speciality?.name}"`;
    }
  }

  return '';
});

const specDescription = computed(() => {
  if (storeFilter.currentQuery.spec.length < 7) {
    return dictSpecDescription.get('06').toLowerCase();
  } else {
    return dictSpecDescription.get(storeFilter.currentQuery.spec.split('.')[1]).toLowerCase();
  }
});

const phraseIfSpec = computed(() =>
  storeFilter.currentQuery.spec
    ? `, ведущих подготовку по специальности "${storeFilter.speciality?.name}" (${specDescription.value}${
        storeFilter.speciality?.code ? ', ' + storeFilter.speciality?.code : ''
      })`
    : '',
);

const state = computed(() => (storeFilter.metaTitles[0] ? storeFilter.metaTitles[0] : ''));
const stateAnswer = computed(() =>
  storeFilter.metaTitles[0].length
    ? storeFilter.metaTitles[0] === 'государственные'
      ? 'государственных'
      : 'негосударственных'
    : '',
);
const stateVariant = computed(() => (storeFilter.directionVariant ? storeFilter.directionVariant : ''));
const type = computed(() => (isVuz.value ? 'вузы' : 'колледжи'));

const total = computed(() =>
  props.totalOrganizations && parseInt(props.totalOrganizations, 10) >= 3 ? props.totalOrganizations : '',
);
const typeVariant = computed(() =>
  isVuz.value
    ? pageTitleSingular.value + useGetNoun(total.value, '', 'а', 'ов')
    : pageTitleSingular.value + useGetNoun(total.value, '', 'а', 'ей'),
);

const points = computed(() =>
  isVuz.value
    ? 'Сравнивайте доступные фильтры и уточняйте условия на официальных сайтах организаций.'
    : 'Сравнивайте доступные фильтры и уточняйте условия на официальных сайтах организаций.',
);

const phraseIfDirection = computed(() =>
  storeFilter.storeDirection
    ? isVuz.value
      ? storeFilter.seoTitle
        ? `, ведущих подготовку в области ${storeFilter.storeDirection?.university_description}`
        : `, ведущих подготовку в области ${storeFilter.storeDirection?.university_description}`
      : storeFilter.seoTitle
      ? `, ведущих подготовку в области ${storeFilter.storeDirection?.college_description}`
      : `, ведущих подготовку в области ${storeFilter.storeDirection?.college_description}`
    : '',
);

const phraseIfLevelDistance = computed(() =>
  storeFilter.levelName || storeFilter.currentQuery.distance
    ? `, предоставляющих возможность ${storeFilter.currentQuery.distance ? 'дистанционного' : ''} обучения${
        storeFilter.currentQuery.level ? ` ${dictLevelVariant[storeFilter.currentQuery.level]}` : ''
      }`
    : '',
);

const phraseIfLevelDirection = computed(() =>
  !(storeFilter.levelName || storeFilter.directionName)
    ? isVuz.value
      ? `, используйте фильтры по ${city.value} и проверяйте актуальные данные на сайтах вузов`
      : `, используйте фильтры по ${city.value} и проверяйте актуальные данные на сайтах колледжей`
    : ' ',
);

const questionPattern = computed(() => {
  // eslint-disable-next-line max-len
  return `В какие ${state.value} ${direction.value} ${type.value} ${city.value} ${
    storeFilter.seoTitle ? ` ` + storeFilter.seoTitle : ''
  } можно поступить${level.value ? level.value : spec.value ? spec.value : ''} в ${useCurrentYear()} году?
`;
});

const answerPattern = computed(() => {
  // eslint-disable-next-line max-len
  return `В базе лицензий найден список ${total.value} ${stateAnswer.value} ${stateVariant.value} ${
    typeVariant.value
  } ${city.value}${phraseIfSpec.value}${storeFilter.seoTitleAnswer ? ` ` + storeFilter.seoTitleAnswer : ''}${
    phraseIfDirection.value
  }${phraseIfLevelDistance.value}${
    storeFilter.isFiltered
      ? ''
      : isVuz.value
      ? ', ведущих прием по специальностям ВО'
      : ', ведущих прием по специальностям СПО'
  }. ${points.value}${phraseIfLevelDirection.value} и поступайте в лучший ${pageTitleSingular.value}.`;
});
</script>

<style lang="scss" scoped>
.listing-question {
  max-width: to-rem(976);

  &__title {
    margin-bottom: to-rem(12);
  }
}
</style>
