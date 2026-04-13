<template>
  <div class="s-card-base" :class="{ 's-card-base--fix': fixHeight }">
    <h2 v-if="data.count && data.title" class="s-card-base__title">
      <strong>{{ data.count }}</strong> {{ data.title }}
    </h2>

   <NuxtLink :to="data.link" :title="data.description" class="s-card-base__description">
     {{ data.description }}
   </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
  fixHeight: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss">
.s-card-base {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: to-rem(16) to-rem(24);
  background-color: var(--base-white);
  border-radius: to-rem(10);
  box-shadow: 0 to-rem(4) to-rem(32) rgb(195 195 195 / 25%);

  @media (min-width: 767px) {
    &--fix {
      min-height: to-rem(108);
    }
  }

  @media (min-width: 1024px) {
    padding: to-rem(16);

    &--fix {
      min-height: to-rem(128);
    }
  }

  @media (min-width: 1440px) {
    padding: to-rem(24);

    &--fix {
      min-height: to-rem(150);
    }
  }

  &__title {
    font-size: to-rem(16);
    line-height: to-rem(22);

    @media (min-width: 1024px) {
      font-size: to-rem(14);
    }

    @media (min-width: 1440px) {
      font-size: to-rem(18);
    }

    strong {
      font-size: to-rem(28);
      font-weight: 700;
      line-height: 120%;

      @media (min-width: 1024px) {
        font-size: to-rem(24);
      }

      @media (min-width: 1440px) {
        font-size: to-rem(38);
      }
    }
  }

  &__description {
    color: var(--base-blue);
    font-size: to-rem(18);
    line-height: 120%;
  }

  &--fix {
    min-height: to-rem(108);

    @media (min-width: 1440px) {
      min-height: to-rem(150);
    }
  }
}
</style>
