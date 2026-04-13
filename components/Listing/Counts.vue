<template>
  <section class="listing-counts">
    Найдено {{ total }}
    {{ computedOrgPhrase(total) }}
    <template v-if="!storeFilter.hasSpeciality">и {{ totalOkso }} {{ computedSpecPhrase(totalOkso) }}</template>
  </section>
</template>

<script setup>
import { useFilterStore } from '~/store/filter';

const storeFilter = useFilterStore();

// Используем route.path для определения типа страницы
const { isVuz, pageTitleSingular } = useRouteInfo();

defineProps({
  total: {
    type: [String, Number],
    default: '',
  },
  totalOkso: {
    type: [String, Number],
    default: '',
  },
});

const computedOrgPhrase = (total) => {
  const ending = isVuz.value ? useGetNoun(total, '', 'а', 'ов') : useGetNoun(total, '', 'а', 'ей');
  return pageTitleSingular.value + ending;
};

const computedSpecPhrase = (total) => {
  return `специальност${useGetNoun(total, 'ь', 'и', 'ей')}`;
};
</script>

<style lang="scss">
.listing-counts {
  color: var(--base-gray);
}
</style>
