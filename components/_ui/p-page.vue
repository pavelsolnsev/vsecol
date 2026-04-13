<template>
  <div class="p-page" :class="classes">
    <div class="p-page__container l-wide">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cssClass: {
    type: String,
    default: '',
  },
});

const classes = computed(() => ({
  [`p-${props.cssClass}`]: !!props.cssClass,
}));
</script>

<style lang="scss">
.p-page {
  display: flex;
  padding-top: to-rem(16);
  padding-bottom: to-rem(32);

  @media (min-width: 767px) {
    padding-bottom: to-rem(56);
  }

  &__container {
    flex: 1 auto;
  }

  &__breadcrumb {
    margin-bottom: to-rem(32);

    @media (min-width: 1024px) {
      margin-bottom: to-rem(40);
    }
  }
}
</style>
