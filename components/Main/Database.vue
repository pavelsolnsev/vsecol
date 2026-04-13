<template>
  <section class="main-database l-wide">
    <div class="main-database__container">
      <div class="main-database__list mb-16">
        <div v-for="(item, index) in data" :key="index" class="main-database__list-item">
          <CardMainDatabase :data="item" fix-height />
        </div>
      </div>

      <h2 class="main-database__title">Дистанционное образование</h2>

      <div class="main-database__list">
        <div
          v-for="(item, index) in dataDistance"
          :key="index"
          class="main-database__list-item main-database__list-item--distance"
        >
          <CardMainDatabase :data="item" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import CardMainDatabase from '~/components/CardMainDatabase.vue';
import { useCalcOrganizations } from '~/composables/api/useCalcOrganizations';
import { useCalcSpecialities } from '~/composables/api/useCalcSpecialities';

const storeApi = useApiStore();

const calcOrgsQuery = useCalcOrganizations({});
const calcSpecsQuery = useCalcSpecialities({});
await Promise.all([calcOrgsQuery.suspense(), calcSpecsQuery.suspense()]);

const countCollege = computed(() => storeApi.calcOrganizations?.college);
const countUniversity = computed(() => storeApi.calcOrganizations?.university);

const VPO = computed(() => storeApi.calcSpecialities?.levels?.VPO);
const SPO = computed(() => storeApi.calcSpecialities?.levels?.SPO);

const data = computed(() => [
  {
    title: 'колледжей',
    description: 'Колледжи России',
    count: countCollege.value,
    link: '/kolledzh/',
  },
  {
    title: 'специальностей',
    description: 'Специальности колледжей',
    count: VPO.value,
    link: '/kolledzh/specialties/',
  },
  {
    title: 'вузов',
    description: 'Вузы России',
    count: countUniversity.value,
    link: '/vuz/',
  },
  {
    title: 'специальностей',
    description: 'Специальности вузов',
    count: SPO.value,
    link: '/vuz/specialties/',
  },
]);

const dataDistance = computed(() => [
  {
    title: '',
    description: 'Колледжи дистанционно',
    count: undefined,
    link: '/kolledzh/distance_true/',
  },
  {
    title: '',
    description: 'Вузы дистанционно',
    count: undefined,
    link: '/vuz/distance_true/',
  },
]);
</script>

<style lang="scss">
.main-database {
  margin-top: to-rem(-58);
  margin-bottom: to-rem(52);

  &__title {
    margin-bottom: to-rem(24);
    font-size: to-rem(32);
    font-weight: 700;
    line-height: to-rem(40);

    @media (min-width: 1440px) {
      margin-bottom: to-rem(32);
    }
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: to-rem(12);

    @media (min-width: 767px) {
      gap: to-rem(16);
    }

    @media (min-width: 1024px) {
      gap: to-rem(10);
    }

    @media (min-width: 1440px) {
      gap: to-rem(16);
    }

    &-item {
      flex: 1 1 100%;

      @media (min-width: 767px) {
        flex: 1 1 calc((100% / 2) - to-rem(16));
      }

      @media (min-width: 1024px) {
        flex: 1 1 calc((100% / 4) - to-rem(10));
      }

      @media (min-width: 1440px) {
        flex: 1 1 calc((100% / 4) - to-rem(16));
      }

      &--distance {
        @media (min-width: 767px) {
          flex: 1 1 calc((100% / 2) - to-rem(16));
        }
      }
    }
  }
}
</style>
