<template>
  <div class="a-alert" :class="classes">
    <div class="a-alert__wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    validator(value) {
      return ['default', 'info', 'warning', 'error', 'success'].indexOf(value) !== -1;
    },
    default: 'default',
  },
});

const classes = computed(() => ({
  [`a-alert--${props.type}`]: true,
}));
</script>

<style lang="scss">
.a-alert {
  display: inline-block;
  padding: to-rem(8) to-rem(16);
  border-radius: to-rem(4);

  &--info {
    color: var(--base-blue);
    background-color: var(--base-gray-selection);
  }
}
</style>
