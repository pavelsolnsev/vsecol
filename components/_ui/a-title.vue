<template>
  <component :is="tag" class="a-title" :class="classes">
    <slot>
      {{ title }}
    </slot>
  </component>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: 'h1',
  },
});

const classes = computed(() => ({
  [`a-title--${props.tag}`]: props.tag,
}));
</script>

<style lang="scss">
.a-title {
  color: var(--base-black-light);
  font-weight: 700;

  &--h1 {
    font-size: to-rem(28);
    line-height: to-rem(32);

    @media (min-width: 767px) {
      font-size: to-rem(32);
      line-height: to-rem(40);
    }
  }

  &--h2 {
    font-size: to-rem(20);
    line-height: to-rem(24);

    @media (min-width: 767px) {
      font-size: to-rem(24);
      line-height: to-rem(32);
    }
  }

  &--h3 {
    font-size: to-rem(18);
    line-height: to-rem(22);

    @media (min-width: 767px) {
      font-size: to-rem(18);
      line-height: to-rem(22);
    }
  }

  &--h5 {
    font-size: to-rem(12);
    font-weight: 400;
    line-height: to-rem(16);

    @media (min-width: 767px) {
      font-size: to-rem(12);
      line-height: to-rem(16);
    }
  }
}
</style>
