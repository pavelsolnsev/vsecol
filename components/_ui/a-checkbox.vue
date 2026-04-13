<template>
  <label :class="classes" :for="checkbox?.id" tabindex="0" @keydown.enter.space.prevent="handleChange">
    <input
      v-if="!disabled"
      ref="checkbox"
      v-model="localValue"
      v-uid
      class="a-checkbox__input visually-hidden"
      type="checkbox"
      :checked="localValue"
      :disabled="disabled"
      tabindex="-1"
      @change="handleChange"
    />
    <CheckboxTrigger v-if="!disabled" :class="triggerClasses" />

    <div :class="labelClasses">
      <!-- eslint-disable vue/no-v-html -->
      <p class="a-checkbox__label-text" v-html="labelText"></p>
    </div>

    <ATooltip v-if="disabled" text="Показаны все результаты" :class="tooltipClasses" />

    <template v-if="localValue">
      <a
        v-if="withLinks && !disabled"
        :data-href="`/${routeName}/${coputedLink}`"
        tabindex="-1"
        class="a-checkbox__link visually-hidden"
        >{{ labelText }}</a
      >
    </template>
    <template v-else>
      <a
        v-if="withLinks && !disabled"
        :href="`/${routeName}/${coputedLink}`"
        tabindex="-1"
        class="a-checkbox__link visually-hidden"
        >{{ labelText }}</a
      >
    </template>
  </label>
</template>

<script setup>
import ATooltip from '~/components/_ui/a-tooltip.vue';
import CheckboxTrigger from '~/assets/icons/checkbox-trigger.svg';

const props = defineProps({
  checked: {
    type: Boolean,
    default: false,
  },

  labelText: {
    type: String,
    default: '',
  },

  disabled: {
    type: Boolean,
    required: false,
  },

  boxPosition: {
    type: String,
    validator(value) {
      return ['left', 'right'].indexOf(value) !== -1;
    },
    default: 'left',
  },

  modelValue: {
    type: Boolean,
    default: false,
  },

  block: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
    validator(value) {
      return ['default', 'secondary', 'filter', 'marked'].indexOf(value) !== -1;
    },
    default: 'default',
  },

  withLinks: {
    type: Boolean,
    default: false,
  },

  withLinksName: {
    type: String,
    default: '',
    required: false,
  },

  withLinksParams: {
    type: Object,
    default: () => {
      return {};
    },
    required: false,
  },

  withLinksOrder: {
    type: Array,
    default: () => {
      return [];
    },
    required: false,
  },

  boxSize: {
    type: String,
    default: '',
    required: false,
  },

  routeName: {
    type: String,
    default: '',
    required: false,
  },
});

const checkbox = ref(null);

const coputedLink = computed(() => {
  const newParams = { ...props.withLinksParams };

  if (props.withLinksName) {
    newParams[props.withLinksName] = true;
  }

  return useConvertedToQuery(useSortParams(props.withLinksOrder, newParams));
});

const emit = defineEmits(['input', 'change', 'update:modelValue']);

const handleChange = () => {
  emit('update:modelValue', !localValue.value);
};

const localValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('input', newValue);
  },
});

const classes = computed(() => ({
  'a-checkbox': true,
  [`a-checkbox--${props.type}`]: true,
  [`a-checkbox--block`]: props.block,
  [`a-checkbox--disabled`]: props.disabled,
  [`a-checkbox--checked`]: props.modelValue,
}));

const triggerClasses = computed(() => ({
  'a-checkbox__trigger': true,
  [`a-checkbox__trigger--${props.type}`]: true,
  [`${props.boxPosition}`]: true,
  'active': props.modelValue,
}));

const labelClasses = computed(() => ({
  'a-checkbox__label': true,
  [`disabled`]: props.disabled,
}));

const tooltipClasses = computed(() => ({
  'a-checkbox__tooltip': true,
}));
</script>

<style lang="scss">
.a-checkbox {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  color: var(--base-white);
  font-size: to-rem(12);
  line-height: to-rem(16);

  &:hover {
    cursor: pointer;
  }

  &__input {
    display: none;
  }

  &__trigger {
    flex-shrink: 0;
    width: 14px;
    height: 14px;

    &.left {
      order: 0;
      margin-right: to-rem(12);
    }

    &.right {
      order: 1;
      margin-left: to-rem(12);
    }

    &--default {
      &.left {
        margin-right: to-rem(8);
      }

      &.right {
        margin-left: to-rem(8);
      }
    }

    &--secondary {
      width: 16px;
      height: 16px;
    }
  }

  &__border,
  .checkbox-border {
    stroke: var(--base-blue);
    fill: var(--base-white);
    transition: stroke 0.15s ease-in-out;
  }

  &__trigger--filter,
  &__trigger--marked {
    .checkbox-border {
      stroke: var(--base-gray);
      rx: 0;
    }

    &.active .checkbox-border {
      stroke: var(--base-blue);
    }
  }

  &__fill,
  .checkbox-fill {
    fill: transparent;
    transition: fill 0.15s ease-in-out;
  }

  &__trigger--filter.active,
  &__trigger--marked.active {
    .checkbox-fill {
      fill: var(--base-blue);
    }
  }

  &__check,
  .checkbox-check {
    stroke: var(--base-blue);
    fill: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
  }

  &__trigger--default.active,
  &__trigger--secondary.active {
    .checkbox-check {
      opacity: 1;
      visibility: visible;
    }
  }

  &__label {
    flex: 1;

    &.disabled {
      cursor: not-allowed;
    }
  }

  &__link {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  &__tooltip {
    width: to-rem(14);
    height: to-rem(14);
    background-image: url('~/assets/icons/question.svg');
    background-repeat: no-repeat;
    background-size: to-rem(14) to-rem(14);

    &.left {
      margin-right: to-rem(12);
    }

    &.right {
      order: 1;
      margin-left: to-rem(12);
    }
  }

  &--block {
    width: 100%;
  }

  &--secondary {
    color: var(--base-gray);
    font-size: to-rem(12);
  }

  &--filter {
    align-items: center;
    padding: to-rem(14) to-rem(16);
    color: var(--base-gray);
    background-color: var(--base-white);
    border: to-rem(1) solid var(--base-gray-border);
    border-radius: var(--border-radius-x1);
    font-size: to-rem(14);
    line-height: to-rem(18);
  }

  &--marked {
    align-items: center;
    padding: to-rem(14) to-rem(16);
    color: var(--base-gray);
    background-color: var(--base-white);
    border: to-rem(1) solid var(--base-blue);
    border-radius: var(--border-radius-x1);
    font-size: to-rem(14);
    line-height: to-rem(18);

    &::before {
      content: '';
      position: absolute;
      z-index: 10;
      top: to-rem(-2);
      right: to-rem(-2);
      width: to-rem(10);
      height: to-rem(10);
      background-color: var(--base-white);
      border-radius: 100%;
    }

    &::after {
      content: '';
      position: absolute;
      z-index: 10;
      top: to-rem(-2);
      right: to-rem(-2);
      width: to-rem(6);
      height: to-rem(6);
      background-color: var(--additional-red);
      border-radius: 100%;
    }
  }

  &--disabled {
    color: var(--base-gray-border);
    border: to-rem(1) solid var(--base-gray-border);
    cursor: not-allowed;
  }
}
</style>
