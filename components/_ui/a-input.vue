<template>
  <div :class="classes">
    <label v-if="label" :for="uid" class="a-input__label">{{ label }}</label>
    <div class="a-input__container">
      <div v-if="$slots.prepend" class="a-input__prepend">
        <slot name="prepend" />
      </div>
      <input
        v-if="mask"
        :id="uid"
        ref="input"
        v-model="valueThis"
        :type="type"
        :placeholder="placeholder"
        :aria-placeholder="placeholder"
        :disabled="disabled"
        :v-maska="vMaska"
        :data-maska="dataMaska"
        :data-maska-tokens="dataMaskaTokens"
        class="a-input__textfield"
        @focus="isFocus = true"
        @blur="isFocus = false"
      />
      <input
        v-else
        :id="uid"
        ref="input"
        v-model="valueThis"
        class="a-input__textfield"
        :type="type"
        :placeholder="placeholder"
        :aria-placeholder="placeholder"
        :disabled="disabled"
        @focus="isFocus = true"
        @blur="isFocus = false"
      />
      <div v-if="$slots.append" class="a-input__append">
        <slot name="append" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  cssClass: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  labelPosition: {
    type: String,
    validator(value: string) {
      return ['default', 'inside'].indexOf(value) !== -1;
    },
    default: 'default',
  },
  type: {
    type: String,
    default: 'text',
  },
  disabled: {
    type: Boolean,
    required: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    validator(value: string) {
      return ['large', 'medium', 'small'].indexOf(value) !== -1;
    },
    default: 'medium',
  },
  variant: {
    type: String,
    validator(value: string) {
      return ['default', 'noborder'].indexOf(value) !== -1;
    },
    default: 'default',
  },
  borderRadius: {
    type: String,
    default: '',
  },
  block: {
    type: Boolean,
    default: false,
  },
  mask: {
    type: Boolean,
    default: false,
  },
  vMaska: {
    type: Boolean,
    required: false,
  },
  dataMaska: {
    type: String,
    default: '',
  },
  dataMaskaTokens: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const uid = useId();
const input = ref(null);
const isFocus = ref(false);

const valueThis = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

const classes = computed(() => ({
  'a-input': true,
  [`s-${props.size}`]: props.size,
  [`v-${props.variant}`]: props.variant,
  'block': props.block,
  [`focus`]: isFocus.value,
  [`${props.cssClass}`]: true,
}));
</script>

<style lang="scss">
.a-input {
  --color-text: var(--base-black, #2c2c2c);
  --color-text-placeholder: var(--color-placeholder-primary, #727272);
  --color-bg: var(--base-white, #fff);
  --color-border: var(--base-gray-selection, #ececee);
  --color-border-focus: var(--color-border-focus-primary, #0941ac);
  --border-radius: var(--border-radius-x1, 4px);

  @include define-line-height('medium', 40);
  @include define-line-height('large', 52);

  position: relative;
  display: inline-block;
  flex: 1;
  background-color: var(--color-bg);

  &__label {
    display: inline-block;
    margin-bottom: to-rem(2);
    font-size: to-rem(14);
    font-weight: 700;
  }

  &__container {
    display: flex;
    flex: 1;
    align-items: center;
    border: to-rem(1) solid var(--color-border);
    border-radius: var(--border-radius);
  }

  &__textfield {
    width: 100%;
    padding: 0;
    color: var(--color-text);
    background-color: var(--color-bg);
    border: 0;
    outline: none;
    font-family: inherit;
    font-size: to-rem(14);
    font-weight: 400;

    &::placeholder {
      color: var(--color-text-placeholder);
      font-size: inherit;
      transition: all 0.4s ease;
    }

    &:focus::placeholder {
      opacity: 0;
    }
  }

  // variants
  &.v-noborder & {
    &__container {
      border-color: transparent;
    }
  }

  // sizes
  &.s-medium & {
    &__container {
      padding-right: to-rem(8);
      padding-left: to-rem(8);
    }

    &__append {
      margin-left: to-rem(8);
    }

    &__prepend {
      margin-right: to-rem(8);
    }

    &__textfield {
      line-height: var(--line-height-medium);
    }
  }

  &.s-large & {
    &__container {
      padding-right: to-rem(16);
      padding-left: to-rem(16);
    }

    &__append {
      margin-left: to-rem(16);
    }

    &__prepend {
      margin-right: to-rem(16);
    }

    &__textfield {
      font-size: to-rem(16);
      line-height: to-rem(56);
    }
  }

  // conditions
  &.block {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  // active
  &.focus & {
    &__container {
      border-color: var(--color-border-focus);
    }
  }

  &.v-noborder.focus & {
    &__container {
      border-color: transparent;
    }
  }
}
</style>
