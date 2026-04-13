<template>
  <div ref="target" class="a-select" :style="`${width ? 'width:' + width : ''}`" v-bind="$attrs">
    <div
      class="a-select__input"
      tabindex="0"
      aria-haspopup="listbox"
      :aria-expanded="options && isOpen"
      :class="{ open: isOpen, checked: isChecked, disabled: isDisabled }"
      @click="onClickASelectInput"
      @keydown.enter.space.prevent="onClickASelectInput"
    >
      <div class="a-select__placeholder">
        {{ named }}
      </div>
      <ATooltip v-if="isDisabled" text="Показаны все результаты" :class="tooltipClasses" />
    </div>
    <div class="a-select__list" :class="{ 'open': isOpen, 'visually-hidden': !(options && isOpen) }">
      <div v-if="withSearch" class="a-select__list-search">
        <AInput
          v-model="search"
          variant="noborder"
          :placeholder="searchPlaceholder"
          block
          class="a-select__search-input"
        />
      </div>
      <ul
        ref="listOptions"
        aria-label="cities"
        role="listbox"
        itemscope
        itemtype="https://schema.org/ItemList"
        @keyup.down.prevent="selectNextOption"
      >
        <ASelectItem
          v-for="(option, index) in filteredOptions"
          :key="index"
          :index="index"
          :option="option"
          :with-links="withLinks"
          :with-links-name="withLinksName"
          :aria-selected="selectedValue === option"
          class="a-select__list-option"
          :class="{ 'a-select__list-option_checked': selectedValue === option }"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
          @click="onClickOption(option)"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
import AInput from '~/components/_ui/a-input.vue';
import ATooltip from '~/components/_ui/a-tooltip.vue';
import ASelectItem from '~/components/_ui/a-select-item.vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  optionsExcluded: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: '',
  },
  itemValue: {
    type: String,
    default: '',
  },
  itemText: {
    type: String,
    default: '',
  },
  withSearch: {
    type: Boolean,
    default: false,
  },
  searchPlaceholder: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '',
    required: false,
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
});

const emits = defineEmits(['update:modelValue']);

const search = ref('');

const selectedValue = computed({
  get() {
    return props.modelValue && props.modelValue !== 'Все' ? props.modelValue : props.placeholder;
  },
  set(val) {
    emits('update:modelValue', val);
  },
});

const isOpen = ref(false);
const isChecked = ref(false);
const isDisabled = ref(false);

let itemRefs = ref([]);
const setItemRef = (el) => {
  if (el) {
    itemRefs.value.push(el.children[0]);
  }
};

onBeforeUpdate(() => {
  itemRefs.value = [];
});

const target = ref(null);

onClickOutside(target, (event) => onClickOutsideASelectInput());

function onClickASelectInput(event) {
  isOpen.value = !isOpen.value;
}

function onClickOption(value) {
  isChecked.value = true;
  selectedValue.value = value;
  isOpen.value = false;
}

function onClickOutsideASelectInput() {
  isOpen.value = false;
}

const listOptions = ref();

const selectNextOption = () => {
  // eslint-disable-next-line
  console.log('next', setItemRef.value);
};

const hasDotSeparator = computed(() => !!props.itemText.includes('.'));

const named = computed(() => {
  return props.itemText.length
    ? hasDotSeparator.value
      ? useConvertedText(props.modelValue, props.itemText)
      : props.modelValue[props.itemText]
    : props.modelValue.name || props.modelValue;
});

const excludeFields = computed(() => {
  return props.optionsExcluded.length
    ? props.options.filter((option) =>
        typeof option.id === 'boolean'
          ? !props.optionsExcluded.includes(Boolean(option.id))
          : !props.optionsExcluded.includes(parseInt(option.id, 10)),
      )
    : props.options;
});

const filteredOptions = computed(() => {
  return search.value.length > 2
    ? excludeFields.value.filter((option) =>
        option[props.itemText].trim().toLowerCase().includes(search.value.trim().toLowerCase()),
      )
    : excludeFields.value;
});

watch(
  () => excludeFields,
  (newValue) => {
    if (newValue.value && !newValue.value.length) {
      isDisabled.value = true;
    } else {
      isDisabled.value = false;
    }
  },
  { immediate: true, deep: true },
);

const tooltipClasses = computed(() => ({
  'a-select__tooltip': true,
  [`${props.type}`]: true,
}));
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss">
.a-select {
  position: relative;
  display: block;

  &__input {
    resize: none;
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: to-rem(48);
    padding: 0 to-rem(40) 0 to-rem(16);
    color: var(--base-gray);
    background-color: var(--base-white);
    border: to-rem(1) solid var(--base-gray-border);
    border-radius: var(--border-radius-x1);
    font-size: to-rem(14);
    white-space: nowrap;
    cursor: pointer;
    appearance: none;

    &::before {
      content: '';
      position: absolute;
      top: to-rem(9);
      right: to-rem(10);
      width: to-rem(24);
      height: to-rem(24);
      background-image: url('~/assets/icons/chevron-down.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      transition: all 0.2s;
      transform: rotate(0deg);
    }

    &.open {
      // stylelint-disable-next-line
      border-bottom-color: transparent !important;
      border-radius: var(--border-radius-x1) var(--border-radius-x1) 0 0;

      &::before {
        transform: rotate(-180deg);
      }
    }

    &.checked {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:focus-visible {
      outline-color: var(--base-blue-dark);
    }

    &.disabled {
      justify-content: space-between;
      padding: 0 to-rem(16);
      color: var(--base-gray-selection);
      border: to-rem(1) solid var(--base-gray-border);
      cursor: not-allowed;

      &::before {
        // stylelint-disable-next-line
        content: none !important;
      }
    }

    input {
      display: none;
      width: 100%;
      border: none;
      outline: none;

      &:focus {
        outline: none;
      }
    }

    &.other input {
      display: block;
      outline: none;
    }
  }

  &__placeholder {
    overflow: hidden;
    pointer-events: none;
  }

  &__input.other &__placeholder {
    display: none;
  }

  &__list {
    @include block-scroll;

    position: absolute;
    z-index: 99998;
    top: to-rem(44);
    right: 0;
    left: 0;
    overflow: hidden;
    overflow-y: scroll;
    width: 100%;
    max-height: to-rem(184);
    margin-top: to-rem(-1);

    &-option {
      position: relative;
      flex: 1;
      width: 100%;
      color: var(--base-black-light);
      border-top-color: transparent;
      border-bottom: var(--base-gray-selection);
      font-size: to-rem(14);
      text-align: left;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        background-color: var(--base-gray-smoky);
      }

      &_checked {
        background-color: var(--base-gray-smoky);
      }

      &:focus-visible {
        background-color: var(--base-gray-smoky);
        outline: none;
      }
    }
  }

  &__input.open ~ &__list {
    overflow-y: auto;
    max-height: to-rem(320);
    background-color: var(--base-white);
    border: to-rem(1) solid var(--base-gray-border);
    border-top-color: transparent;
  }

  &_filled & {
    &__input {
      color: var(--base-black);
      background-color: var(--base-gray-smoky);
      border: to-rem(1) solid var(--base-gray-smoky);

      &::before {
        background-image: url('~/assets/icons/chevron-down-filled.svg');
      }
    }
  }

  &.error &__input {
    border-color: var(--additional-red);
  }

  &__search {
    &-input {
      padding: to-rem(12) to-rem(16);

      &::placeholder {
        color: var(--base-gray-selection);
        font-size: to-rem(14);
        font-weight: 700;
      }
    }
  }

  &__link {
    display: block;
    padding: to-rem(12) to-rem(16);
    outline: none;
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
}
</style>
