<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled"
    :aria-label="ariaLabel || label"
    role="button"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    @mousedown="isActive = true"
    @mouseup="isActive = false"
    @click="emit('click')"
  >
    <div v-if="$slots.preppend" class="a-button__preppend">
      <slot name="preppend" />
    </div>
    <span class="a-button__label">
      <slot name="default">
        {{ label }}
      </slot>
    </span>
    <div v-if="$slots.append" class="a-button__append">
      <slot name="append"></slot>
    </div>
  </button>
</template>

<script lang="ts" setup>
import type { PropType, ButtonHTMLAttributes } from 'vue';

const emit = defineEmits(['click']);

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  type: {
    type: String as PropType<ButtonHTMLAttributes['type']>,
    validator(value: string) {
      return ['button', 'submit'].indexOf(value) !== -1;
    },
    default: 'button',
  },
  iconLink: {
    type: String,
    default: '',
    required: false,
  },
  block: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    validator(value: string) {
      return ['small', 'medium', 'large', 'xlarge'].indexOf(value) !== -1;
    },
    default: 'medium',
  },
  width: {
    type: String,
    default: '',
    required: false,
  },
  rounded: {
    type: Boolean,
    default: true,
    required: false,
  },
  variant: {
    type: String,
    validator(value: string) {
      return (
        [
          'primary',
          'secondary',
          'header',
          'contrast',
          'plain',
          'plain-blue',
          'plain-red',
          'plain-white',
          'tonal',
          'outline-white',
          'outline-blue',
          'outline-red',
        ].indexOf(value) !== -1
      );
    },
    default: 'primary',
  },
  preppendIcon: {
    type: String,
    default: '',
    required: false,
  },
});

const isHover = ref(false);
const isActive = ref(false);

const classes = computed(() => ({
  [`a-button`]: true,
  [`v-${props.variant}`]: true,
  [`s-${props.size}`]: true,
  rounded: props.rounded,
  disabled: props.disabled,
  block: props.block,
  hover: isHover.value,
  active: isActive.value,
}));
</script>

<style lang="scss">
.a-button {
  --color-text: var(--color-button-text-primary, #fff);
  --color-text-hover: var(--color-button-text-primary-hover, #fff);
  --color-text-active: var(--color-button-text-primary-active, #fff);
  --color-bg: var(--color-button-bg-primary, #0941ac);
  --color-bg-hover: var(--color-button-bg-primary-hover, #3a66bc);
  --color-bg-active: var(--color-button-bg-primary-active, #073489);
  --color-border: var(--color-button-border-primary, #0941ac);
  --color-border-hover: var(--color-button-border-primary-hover, #3a66bc);
  --color-border-active: var(--color-button-border-primary-active, #073489);
  --color-outline: var(--color-outline-primary, #cdd9ee);

  // variant secondary
  --color-text-v-secondary: var(--color-button-text-secondary, #fff);
  --color-text-v-secondary-hover: var(--color-button-text-secondary-hover, #fff);
  --color-bg-v-secondary: var(--color-button-bg-secondary, #e52421);
  --color-bg-v-secondary-hover: var(--color-button-bg-secondary-hover, #e52421);
  --color-bg-v-secondary-active: var(--color-button-bg-secondary-active, #c4c4c5);
  --color-border-v-secondary: #e52421;
  --color-border-v-secondary-hover: var(--color-border-secondary-hover, #e52421);
  --color-border-v-secondary-active: var(--color-border-secondary-active, #c4c4c5);

  // variant contrast
  --color-text-v-contrast: var(--color-button-text-contrast, #141011);
  --color-bg-v-contrast: var(--color-button-bg-contrast, #fff);
  --color-border-v-contrast: var(--base-white, #fff);

  // variant outline
  --color-text-v-outline: var(--color-button-text-outline, #141011);
  --color-text-v-outline-hover: var(--color-button-text-outline-hover, #fff);
  --color-text-v-outline-active: var(--color-button-text-outline-active, #fff);
  --color-bg-v-outline: var(--color-button-bg-outline, #fff);
  --color-bg-v-outline-hover: var(--color-button-bg-outline-hover, #3a66bc);
  --color-bg-v-outline-active: var(--color-button-bg-outline-active, #073489);
  --color-border-v-outline: var(--color-border-outline, #0941ac);
  --color-border-v-outline-hover: var(--color-border-outline-hover, #3a66bc);
  --color-border-v-outline-active: var(--color-border-outline-active, #073489);

  // variant outline white
  --color-text-v-outline-white: var(--color-button-text-outline-white, #fff);
  --color-bg-v-outline-white: var(--color-button-bg-outline-white, transparent);
  --color-bg-v-outline-white-hover: var(--color-button-bg-outline-white-hover, transparent);
  --color-bg-v-outline-white-active: var(--color-button-bg-outline-white-active, transparent);
  --color-border-v-outline-white: var(--color-border-outline-white, #fff);
  --color-border-v-outline-white-hover: var(--color-border-outline-white-hover, #fff);
  --color-border-v-outline-white-active: var(--color-border-outline-white-active, #fff);
  --border-radius: var(--border-radius-x1, 4px);

  // variant outline blue
  --color-text-v-outline-blue: var(--color-button-bg-primary, #0941ac);
  --color-bg-v-outline-blue: var(--color-button-text-primary, #fff);
  --color-bg-v-outline-blue-hover: var(--color-button-text-primary, #fff);
  --color-bg-v-outline-blue-active: var(--color-button-text-primary, #fff);
  --color-border-v-outline-blue: var(--color-button-bg-primary, #0941ac);
  --color-border-v-outline-blue-hover: var(--color-button-bg-primary, #0941ac);
  --color-border-v-outline-blue-active: var(--color-button-bg-primary, #0941ac);

  // variant outline blue
  --color-text-v-outline-red: var(--color-button-bg-primary, #e52421);
  --color-bg-v-outline-red: var(--color-button-text-primary, #fff);
  --color-bg-v-outline-red-hover: var(--color-button-text-primary, #fff);
  --color-bg-v-outline-red-active: var(--color-button-text-primary, #fff);
  --color-border-v-outline-red: var(--color-button-bg-primary, #e52421);
  --color-border-v-outline-red-hover: var(--color-button-bg-primary, #e52421);
  --color-border-v-outline-red-active: var(--color-button-bg-primary, #e52421);

  // variant plain blue
  --color-text-v-plain-blue: var(--color-button-bg-primary, #0941ac);
  --color-bg-v-plain-blue: var(--color-button-text-primary, #fff);
  --color-bg-v-plain-blue-hover: var(--color-button-text-primary, #fff);
  --color-bg-v-plain-blue-active: var(--color-button-text-primary, #fff);
  --color-border-v-plain-blue: var(--color-button-text-primary, #fff);
  --color-border-v-plain-blue-hover: var(--color-button-text-primary, #fff);
  --color-border-v-plain-blue-active: var(--color-button-text-primary, #fff);

  // variant plain red
  --color-text-v-plain-red: #e52421;
  --color-bg-v-plain-red: var(--color-button-text-primary, #fff);
  --color-bg-v-plain-red-hover: var(--color-button-text-primary, #fff);
  --color-bg-v-plain-red-active: var(--color-button-text-primary, #fff);
  --color-border-v-plain-red: var(--color-button-text-primary, #fff);
  --color-border-v-plain-red-hover: var(--color-button-text-primary, #fff);
  --color-border-v-plain-red-active: var(--color-button-text-primary, #fff);

  // variant tonal
  --color-text-v-tonal: var(--base-gray, #0941ac);
  --color-bg-v-tonal: var(--base-gray-smoky, #fff);
  --color-bg-v-tonal-hover: var(--base-gray-smoky, #fff);
  --color-bg-v-tonal-active: var(--base-gray-smoky, #fff);
  --color-border-v-tonal: var(--base-gray-smoky, #fff);
  --color-border-v-tonal-hover: var(--base-gray-smoky, #fff);
  --color-border-v-tonal-active: var(--base-gray-smoky, #fff);

  @include define-line-height('small', 40);
  @include define-line-height('medium', 40);
  @include define-line-height('large', 54);
  @include define-line-height('xlarge', 62);

  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0 to-rem(16);
  border-width: to-rem(1);
  border-style: solid;
  outline: none;
  font-size: to-rem(14);
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.25s ease-in-out;

  &__preppend {
    width: to-rem(16);
    height: to-rem(16);
    margin-right: to-rem(10);
  }

  &.v-primary {
    color: var(--color-text);
    background-color: var(--base-blue);
    border-color: var(--color-border);

    &:focus-visible {
      outline: to-rem(2) solid var(--color-outline);
    }

    &.disabled {
      background-color: #cdd9ee;
      border-color: #cdd9ee;

      &:hover {
        background-color: #cdd9ee;
        border-color: #cdd9ee;
      }
    }
  }

  &.v-primary.hover {
    color: var(--color-text-hover);
    background-color: var(--color-bg-hover);
    border-color: var(--color-border-hover);
  }

  &.v-primary.active {
    color: var(--color-text-active);
    background-color: var(--color-bg-active);
    border-color: var(--color-border-active);
  }

  &.v-secondary {
    color: var(--color-text-v-secondary);
    background-color: var(--color-bg-v-secondary);
    border-color: var(--color-border-v-secondary);
  }

  &.v-secondary.hover {
    color: var(--color-text-v-secondary-hover);
    background-color: var(--color-bg-v-secondary-hover);
    border-color: var(--color-border-v-secondary-hover);
  }

  &.v-secondary.active {
    color: var(--color-text-v-secondary-active);
    background-color: var(--color-bg-v-secondary-active);
    border-color: var(--color-border-v-secondary-active);
  }

  &.v-outline {
    color: var(--color-text-v-outline);
    background-color: var(--color-bg-v-outline);
    border-color: var(--color-border-v-outline);
  }

  &.v-outline.hover {
    color: var(--color-text-v-outline-hover);
    background-color: var(--color-bg-v-outline-hover);
    border-color: var(--color-border-v-outline-hover);
  }

  &.v-outline.active {
    color: var(--color-text-v-outline-active);
    background-color: var(--color-bg-v-outline-active);
    border-color: var(--color-border-v-outline-active);
  }

  &.v-outline-white {
    color: var(--color-text-v-outline-white);
    background-color: var(--color-bg-v-outline-white);
    border-color: var(--color-border-v-outline-white);
  }

  &.v-outline-blue {
    color: var(--color-text-v-outline-blue);
    background-color: transparent;
    border-color: var(--color-border-v-outline-blue);
    border-radius: to-rem(1);
  }

  &.v-outline-red {
    color: var(--color-text-v-outline-red);
    background-color: transparent;
    border-color: var(--color-border-v-outline-red);
    border-radius: to-rem(1);
  }

  &.v-plain-blue {
    color: var(--color-text-v-plain-blue);
    background-color: var(--color-bg-v-plain-blue);
    border-color: var(--color-border-v-plain-blue);
  }

  &.v-plain-red {
    color: var(--color-text-v-plain-red);
    background-color: var(--color-bg-v-plain-red);
    border-color: var(--color-border-v-plain-red);
  }

  &.v-contrast {
    color: var(--color-text-v-contrast);
    background-color: var(--color-bg-v-contrast);
    border-color: var(--color-border-v-contrast);

    &:hover {
      color: var(--base-black-light);
      background-color: var(--base-white);
      border-color: var(--base-white);
    }
  }

  &.v-plain {
    height: fit-content !important;
    padding: 0;
    color: var(--base-black);
    background-color: transparent;
    border: to-rem(1) solid transparent;
  }

  &.v-tonal {
    color: var(--color-text-v-tonal);
    background-color: var(--color-bg-v-tonal);
    border-color: var(--color-border-v-tonal);

    &:hover {
      color: var(--base-gray);
      background-color: var(--base-gray-smoky);
      border: to-rem(1) solid var(--base-gray-smoky);
    }
  }

  // size
  &.s-small {
    height: to-rem(40);
    font-size: to-rem(14);
  }

  &.s-medium {
    height: to-rem(48);
  }

  &.s-large {
    height: to-rem(56);
  }

  &.s-xlarge {
    height: to-rem(64);
  }

  // rounded
  &.rounded {
    border-radius: var(--border-radius);
  }

  // conditions
  &.block {
    display: flex;
    width: 100%;
  }

  &.disabled {
    background-color: var(--base-gray-selection);

    &:hover {
      background-color: var(--base-gray-selection);
      cursor: not-allowed;
    }
  }

  &__preppend-icon {
    width: to-rem(24);
    height: to-rem(24);
    margin-right: to-rem(10);
  }
}
</style>
