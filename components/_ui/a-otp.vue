<template>
  <div class="otp">
    <input
      ref="input"
      v-model="valueThis"
      type="text"
      name="sms"
      inputmode="numeric"
      pattern="[0-9]"
      min="0"
      max="9"
      autocomplete="one-time-code"
      class="otp-input"
      maxlength="6"
      @focus="handleOnFocus"
      @paste="handleOnPaste"
      @keydown="handleOnKeyDown"
    />

    <div class="otp-digits">
      <div
        v-for="(digit, index) in otpDigits"
        :key="index"
        class="otp-digits__block"
        :class="[{ 'is-complete': digit, 'is-error': isError }]"
      >
        {{ digit }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTimeoutFn } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  isError: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: Number,
    default: 6,
  },
  isAutoFocus: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'on-complete']);

const valueThis = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

const { start } = useTimeoutFn(
  () => {
    if (input.value) {
      input.value.focus();
    }
  },
  500,
  { immediate: false },
);

const input = ref(null);

onMounted(() => {
  if (input.value) {
    input.value.focus();
    input.value.select();
  }
});

const handleOnFocus = () => {
  input.value.select();
};

const emptyDigits = ref(['', '', '', '', '', '']);
const otpDigits = computed(() =>
  emptyDigits.value.map((val, index) => {
    return valueThis.value.split('')[index] || val;
  }),
);

watch(
  () => valueThis.value,
  (newValue) => {
    if (newValue.length === props.maxLength) emit('on-complete', newValue);
  },
);

//const isCodeLetter = (charCode) => charCode >= 65 && charCode <= 90;
const isCodeNumeric = (charCode) => (charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105);

const handleOnKeyDown = (event) => {
  const keyEvent = event || window.event;
  const charCode = keyEvent.which ? keyEvent.which : keyEvent.keyCode;

  if (
    !isCodeNumeric(charCode) &&
    ![8, 9, 13, 37, 39, 46].includes(charCode) &&
    !(keyEvent.ctrlKey && [86].includes(charCode))
  ) {
    keyEvent.preventDefault();
  }
};

const handleOnPaste = (event) => {
  event.preventDefault();

  const pastedData = event.clipboardData.getData('text/plain');

  if (pastedData.match(/^\d+$/)) {
    emit('update:modelValue', pastedData.slice(0, props.maxLength));
  }
};

watch(
  () => props.isAutoFocus,
  (v) => {
    if (v) {
      start();
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.otp {
  position: relative;
  width: to-rem(358);

  &-input {
    border: 0;
    font-size: to-rem(32);
    width: 100%;
    letter-spacing: to-rem(44);
    padding-left: to-rem(16);
    padding-right: to-rem(16);
    height: to-rem(62);
    background-color: transparent;
    outline: none;
    position: absolute;
    inset: 0;
    color: transparent;
    caret-color: var(--base-black);
  }

  &-digits {
    display: flex;
    gap: to-rem(8);

    &__block {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% / 6);
      height: to-rem(62);
      padding: 0;
      background-color: var(--base-gray-border);
      border: to-rem(1) solid var(--base-gray-border);
      border-radius: to-rem(8);
      font-size: to-rem(32);
      text-align: center;
    }
  }
}

.is-error {
  color: var(--additional-error);
  background-color: var(--additional-error-light);

  &:focus-visible {
    outline: 1px solid var(--additional-error-light);
  }
}
</style>
