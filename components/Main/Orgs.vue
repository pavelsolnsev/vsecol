<template>
  <section class="main-orgs l-wide">
    <div class="main-orgs__container">
      <h2 class="main-orgs__title">{{ title }}</h2>

      <div class="main-orgs__list">
        <div v-for="(item, index) in items" :key="index" class="main-orgs__list-item">
          <MainCard :data="item" :is-first="index === 0" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import MainCard from '~/components/Main/Card.vue';

defineProps({
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
</script>

<style lang="scss">
.main-orgs {
  margin-bottom: to-rem(52);

  &__title {
    margin-bottom: to-rem(32);
    font-size: to-rem(32);
    font-weight: 700;
    line-height: 125%;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: to-rem(16);

    &-item {
      flex: 1 1 100%;

      @media (min-width: 767px) {
        flex: 1 1 calc((100% / 2) - to-rem(24));
      }

      @media (min-width: 1024px) {
        flex: 1 1 calc((100% / 3) - to-rem(16));
      }

      @media (min-width: 1440px) {
        flex: 1 1 calc((100% / 4) - to-rem(32));
      }
    }
  }
}
</style>
