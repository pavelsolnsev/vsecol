<template>
  <div class="a-radio" :class="classes">
    <input class="a-radio__input visually-hidden" type="radio" :checked="isChecked" :value="value" v-bind="$attrs" />
    <div class="a-radio__container" @click="onLabelClick">
      <RadioTrigger class="a-radio__trigger" :class="triggerClasses" />
      <label class="a-radio__text">
        {{ label }}
      </label>
    </div>
  </div>
</template>

<script setup>
import RadioTrigger from '~/assets/icons/radio-trigger.svg';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },

  modelValue: {
    type: [String, Number, Object, null],
    default: null,
  },

  value: {
    type: [String, Number, Object],
    required: true,
  },

  variant: {
    type: String,
    validator(value) {
      return ['default', 'filter'].indexOf(value) !== -1;
    },
    default: 'default',
  },

  triggerPosition: {
    type: String,
    validator(value) {
      return ['left', 'right'].indexOf(value) !== -1;
    },
    default: 'left',
  },

  itemId: {
    type: [String, Number],
    default: '',
  },

  block: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const onLabelClick = () => {
  emit('update:modelValue', props.value);
};

const isChecked = computed(() => {
  const { modelValue, value, itemId } = props;
  if (!modelValue || !value) return false;

  // Если itemId есть — сравниваем по нему
  if (itemId != null && typeof value === 'object' && itemId in value) {
    return modelValue.id === value[itemId];
  }

  // Сравниваем по id
  if (modelValue.id != null && value.id != null) {
    return modelValue.id === value.id;
  }

  // Сравниваем по ссылке
  if (modelValue === value) return true;

  // Fallback — JSON
  try {
    return JSON.stringify(modelValue) === JSON.stringify(value);
  } catch {
    return modelValue === value;
  }
});

const classes = computed(() => ({
  [`a-radio--${props.variant}`]: true,
  'a-radio--active': isChecked.value,
}));

const triggerClasses = computed(() => ({
  [`${props.triggerPosition}`]: true,
  active: isChecked.value,
}));
</script>

<style lang="scss">
.a-radio {
  position: relative;
  overflow: hidden;
  border-radius: to-rem(4);
  cursor: pointer;
  transition: all 0.25s ease-in-out;

  @media (min-width: 767px) {
    display: inline-block;
    width: fit-content;
  }

  &:hover {
    cursor: pointer;
  }

  &__input {
    display: none;
  }

  &__container {
    display: flex;
    align-items: center;
  }

  &__text {
    position: relative;
    flex: 1;
    font-family: inherit;
    font-style: normal;
    cursor: pointer;

    &-content {
      padding-left: to-rem(33);
    }
  }

  &__trigger {
    flex-shrink: 0;

    &.left {
      margin-right: to-rem(8);
    }

    &.right {
      order: 1;
      margin-left: to-rem(8);
    }
  }

  &__border,
  .radio-border {
    stroke: var(--base-gray);
    fill: transparent;
    transition: stroke 0.15s ease-in-out, stroke-width 0.15s ease-in-out;
  }

  &__trigger.active {
    .radio-border {
      stroke: var(--base-blue);
      stroke-width: 2;
    }
  }

  &__check,
  .radio-check {
    fill: var(--base-blue);
    opacity: 0;
    transition: opacity 0.15s ease-in-out;
  }

  &__trigger.active {
    .radio-check {
      opacity: 1;
    }
  }

  &--default {
    color: var(--base-gray);
    border: to-rem(1) solid transparent;
  }

  &--default & {
    &__container {
      padding: to-rem(12) 0;
    }

    &__text {
      flex: 1;
      font-size: to-rem(16);
    }

    &__trigger {
      width: 16px;
      height: 16px;
    }
  }

  &--filter {
    color: var(--base-gray);
    border: to-rem(1) solid var(--base-gray-border);
  }

  &--filter & {
    &__container {
      padding: to-rem(12) to-rem(16);
    }

    &__text {
      font-size: to-rem(14);
    }

    &__trigger {
      width: 16px;
      height: 16px;
      margin-top: to-rem(2);
      margin-bottom: to-rem(2);
    }
  }
}
</style>
