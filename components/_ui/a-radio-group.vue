<template>
  <div class="a-radio-group" :class="classes">
    <div v-for="option in options" :key="option.id" class="a-radio-group__item">
      <ARadio
        :label="option.name"
        :value="option"
        :model-value="modelValue"
        :name="name"
        :variant="variant"
        :trigger-position="triggerPosition"
        item-id="id"
        @update:model-value="$emit('update:modelValue', option)"
      />
    </div>
  </div>
</template>

<script setup>
import ARadio from '~/components/_ui/a-radio.vue';

defineEmits(['update:modelValue']);

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number, Object, null],
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  triggerPosition: {
    type: String,
    validator(value) {
      return ['left', 'right'].indexOf(value) !== -1;
    },
    default: 'right',
  },
  block: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    validator(value) {
      return ['default', 'filter'].indexOf(value) !== -1;
    },
    default: 'default',
  },
});

const classes = computed(() => ({
  [`a-radio-group--block`]: props.block,
}));
</script>

<style lang="scss">
.a-radio-group {
  display: block;
  overflow: hidden;

  &__item {
    display: block;
    width: 100%;
    margin-bottom: to-rem(8);

    &:last-child {
      margin-right: 0;
    }

    @media (min-width: 767px) {
      display: inline-block;
      width: fit-content;
      margin-right: to-rem(8);

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &--block & {
    &__item {
      @media (min-width: 767px) {
        display: block;
        margin-right: 0;
        margin-bottom: 0;
      }
    }
  }
}
</style>
