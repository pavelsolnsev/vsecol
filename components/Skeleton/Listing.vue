<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ASkeletonLoader from '~/components/_ui/a-skeleton-loader.vue';
</script>

<template>
  <PPage css-class="skeleton-listing">
    <ASkeletonLoader width="200px" height="18" class="mb-8" />
    <ASkeletonLoader width="210px" height="40" class="mb-8" />

    <div class="p-listing__counts mb-6">
      <ASkeletonLoader width="300px" height="18" />
    </div>

    <div class="p-listing__filter-mobile mb-10">
      <ASkeletonLoader height="57" />
    </div>

    <div class="p-listing__filter mb-10">
      <ASkeletonLoader height="112" />
    </div>

    <div class="p-listing__promos">
      <div v-for="item in 3" :key="item" class="p-listing__promos-item">
        <ASkeletonLoader height="44" />
      </div>
    </div>

    <ASkeletonLoader v-for="item in 15" :key="item" height="198" class="mb-6" />

    <div class="mb-10 d-flex justify-center">
      <ASkeletonLoader width="380" height="40" />
    </div>

    <ASkeletonLoader width="100%" height="72" />
  </PPage>
</template>

<style lang="scss" scoped>
.p-listing {
  &__filter {
    display: none;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  &__filter-mobile {
    display: block;

    @media (min-width: 1024px) {
      display: none;
    }
  }

  &__promos-item {
    padding: to-rem(16);
    border-bottom: to-rem(1) solid var(--base-gray-border);

    &:last-child {
      border-bottom: 0;
    }
  }
}
</style>
