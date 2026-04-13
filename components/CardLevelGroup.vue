<template>
  <div v-if="specialties.length > 0" class="card-level-group">
    <ATitle tag="h2" class="card-level-group__title">{{ title }}</ATitle>

    <div class="card-level-group__list">
      <div v-for="(spec, index) in specialties" :key="index" class="card-level-group__item">
        <div class="card-level-group__code">{{ spec.code }}</div>
        <nuxt-link :to="path(spec.code)" class="card-level-group__name">{{ spec.name }}</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import { useInfoStore } from '~/store/info';

const storeInfo = useInfoStore();

const { path: currentPath } = storeToRefs(storeInfo);

defineProps({
  title: {
    type: String,
    default: '',
  },
  specialties: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const path = (code) => {
  return `/` + currentPath.value + `/specialties/code_` + code + `/`;
};
</script>

<style lang="scss">
.card-level-group {
  padding: to-rem(16);
  background-color: var(--base-gray-smoky);

  @media (min-width: 767px) {
    padding: to-rem(16) to-rem(24);
  }

  &__title {
    margin-bottom: to-rem(16);
  }

  &__item {
    display: flex;
    align-items: flex-start;
    margin-bottom: to-rem(6);

    @media (min-width: 767px) {
      margin-bottom: to-rem(8);
    }
  }

  &__code {
    width: to-rem(50);
    margin-right: to-rem(12);
    font-size: to-rem(12);
  }

  &__name {
    flex: 1;
    color: var(--base-blue);
    font-size: to-rem(12);
    font-weight: 700;
    line-height: to-rem(16);
  }
}
</style>
