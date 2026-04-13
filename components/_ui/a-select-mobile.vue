<template>
  <div class="a-select-mobile">
    <div v-if="isOpen" class="a-select-mobile__backdrop" @click="onClickOutsideASelectInput"></div>
    <div
      ref="target"
      class="a-select-mobile__input"
      :class="{
        open: isOpen,
        checked: isChecked,
        selected: named !== placeholder,
        disabled: isDisabled,
      }"
      @click="onClickASelectInput"
    >
      <div class="a-select-mobile__placeholder">
        {{ named }}
      </div>
      <ATooltip v-if="isDisabled" text="Нет подходящих результатов" :class="tooltipClasses" />
    </div>
    <Transition name="slide-up">
      <div
        v-show="options && isOpen"
        class="a-select-mobile__list"
        :class="{ 'open': isOpen, 'visually-hidden': !(options && isOpen) }"
      >
        <div class="a-select-mobile__list-header">
          {{ named }}
          <Close name="Close" class="a-select-mobile__list-icon" @click="onClickOutsideASelectInput" />
        </div>
        <div v-if="searchable" class="a-select-mobile__search">
          <AInput
            v-model="search"
            variant="noborder"
            :placeholder="searchPlaceholder"
            block
            class="a-select-mobile__search-input"
          />
        </div>
        <div class="a-select-mobile__list-options" itemscope itemtype="https://schema.org/ItemList">
          <ASelectItem
            v-for="(option, index) in filteredOptions"
            :key="index"
            :index="index"
            :option="option"
            tag="div"
            :with-links="withLinks"
            :with-links-name="withLinksName"
            :aria-selected="selectedValue === option"
            class="a-select-mobile__list-option"
            :class="{ 'a-select-mobile__list-option_checked': selectedValue === option }"
            v-bind="$attrs"
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
            @click="onClickOption(option)"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import AInput from '~/components/_ui/a-input.vue';
import ATooltip from '~/components/_ui/a-tooltip.vue';
import ASelectItem from '~/components/_ui/a-select-item.vue';
import Close from '~/components/_icons/Close.vue';

const props = defineProps({
  modelValue: {
    type: [Object, String],
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
  searchPlaceholder: {
    type: String,
    default: 'Введите город',
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
  searchable: {
    type: Boolean,
    default: false,
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

// eslint-disable-next-line
const setItemRef = (el) => {
  if (el) {
    itemRefs.value.push(el.children[0]);
  }
};

onBeforeUpdate(() => {
  itemRefs.value = [];
});

const target = ref(null);
//onClickOutside(target, (event) => onClickOutsideASelectInput());

function onClickASelectInput(event) {
  if (!isDisabled.value) {
    isOpen.value = !isOpen.value;
  }
}

function onClickOption(value) {
  isChecked.value = true;
  selectedValue.value = value;
  isOpen.value = false;
}

function onClickOutsideASelectInput() {
  isOpen.value = false;
}

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
.a-select-mobile {
  position: initial;
  display: block;

  &__backdrop {
    position: fixed;
    z-index: 101;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: var(--base-black);
    opacity: 0.4;
    pointer-events: all;
  }

  &__input {
    resize: none;
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: to-rem(48);
    color: var(--base-black-light);
    background-color: transparent;
    border: to-rem(1) solid transparent;
    border-bottom: to-rem(1) solid var(--base-gray-selection);
    border-radius: var(--border-radius-x1);
    font-size: to-rem(14);
    font-weight: 700;
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
      background-image: url('~/assets/icons/select-chevron-down.svg');
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

    &.selected {
      color: var(--base-blue);
    }

    &:focus {
      border-color: var(--base-gray-smoky);
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
    pointer-events: none;
  }

  &__input.other &__placeholder {
    display: none;
  }

  &__list {
    position: fixed;
    z-index: 102;
    top: to-rem(108);
    right: 0;
    left: 0;
    bottom: 0;
    display: block;
    overflow: hidden;
    overflow-y: scroll;
    width: 100%;
    // stylelint-disable-next-line
    max-height: none !important;
    margin-top: to-rem(-1);
    border-top-left-radius: to-rem(8);
    border-top-right-radius: to-rem(8);

    &-header {
      display: flex;
      justify-content: space-between;
      padding: to-rem(32) to-rem(20) to-rem(26);
      font-size: to-rem(18);
      font-weight: 700;
    }

    &-icon {
      width: to-rem(24);
      height: to-rem(24);
    }

    &-options {
      padding: 0;
    }

    &-option {
      position: relative;
      flex: 1;
      padding: to-rem(12) to-rem(20);
      border-top-color: transparent;
      border-bottom: to-rem(1) solid var(--base-gray-selection);
      font-size: to-rem(14);
      line-height: to-rem(18);
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        background-color: var(--base-gray-smoky);
      }

      &_checked {
        background-color: var(--base-gray-smoky);
      }

      &:last-child {
        border-bottom-color: transparent;
      }
    }
  }

  &__input.open ~ &__list {
    overflow: auto;
    max-height: to-rem(310);
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
    border-bottom: to-rem(1) solid var(--base-gray-selection);

    &-input {
      padding: to-rem(15) to-rem(20);

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

.slide-up-enter-active {
  transition: all 0.4s ease-out;
}

.slide-up-leave-active {
  transition: none;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100px);
}

.slide-up-leave-to {
  opacity: 1;
  transform: translateY(100%);
}
</style>
