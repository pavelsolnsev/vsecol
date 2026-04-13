<template>
  <div class="professions-filters-skeleton">
    <div class="professions-filters-skeleton__container">
      <ASkeletonLoader
        v-for="i in 4"
        :key="i"
        height="44px"
        class="professions-filters-skeleton__item"
      />
      <ASkeletonLoader height="44px" class="professions-filters-skeleton__more" />
    </div>
  </div>
</template>

<style lang="scss">
.professions-filters-skeleton {
  &__container {
    display: flex;
    flex-wrap: wrap;
    gap: to-rem(8);
  }

  &__item,
  &__more {
    height: to-rem(44);
    border-radius: to-rem(32);
  }

  &__item {
    flex: 1;
    min-width: to-rem(80);
    max-width: calc(20% - to-rem(6.4));
  }

  &__more {
    min-width: to-rem(90);
    max-width: calc(20% - to-rem(6.4));
  }
}
</style>