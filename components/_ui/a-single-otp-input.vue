<script setup lang="ts">
import type { Ref } from 'vue';

type Props = {
  inputType?: 'number' | 'tel' | 'letter-numeric' | 'password';
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  // eslint-disable-next-line vue/require-default-prop
  value?: string;
  separator: string;
  focus: boolean;
  inputClasses: string | string[];
  conditionalClass: string;
  shouldAutoFocus: boolean;
  isLastChild: boolean;
  placeholder: string;
  isDisabled: boolean;
  isError: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  inputType: 'tel',
  inputmode: 'numeric',
  separator: '',
  focus: false,
  inputClasses: '',
  conditionalClass: '',
  shouldAutoFocus: false,
  isLastChild: false,
  placeholder: '',
  isDisabled: false,
});

const emit = defineEmits<{
  (e: 'on-change', value: string | number): void;
  (e: 'on-keydown', event: KeyboardEvent): void;
  (e: 'on-paste', event: ClipboardEvent): void;
  (e: 'on-focus'): void;
  (e: 'on-blur'): void;
}>();

const model = ref(props.value || '');
const input = ref<HTMLInputElement | null>(null) as Ref<HTMLInputElement>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleOnChange = (e: any) => {
  // model.value = model.value;
  // if (model.value.length > 1) {
  //   model.value = model.value.slice(0, 1);
  // }
  const value = (e.target as HTMLInputElement).value;

  if (value && value.trim().length > 1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // This is a workaround for dealing IOS does not fire onPaste event from sms auto-populate.
    e.clipboardData = {
      getData: () => value.trim(),
    };

    return emit('on-paste', e);
  }
  //return emit('on-change', model.value.toString());
  return emit('on-change', value);
};

const isCodeLetter = (charCode: number) => charCode >= 65 && charCode <= 90;
const isCodeNumeric = (charCode: number) => (charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105);
// numeric keys and numpad keys

const handleOnKeyDown = (event: KeyboardEvent) => {
  if (props.isDisabled) {
    event.preventDefault();
  }
  // Only allow characters 0-9, DEL, Backspace, Enter, Right and Left Arrows, and Pasting
  const keyEvent = event || window.event;
  const charCode = keyEvent.which ? keyEvent.which : keyEvent.keyCode;

  if (
    isCodeNumeric(charCode) ||
    (props.inputType === 'letter-numeric' && isCodeLetter(charCode)) ||
    [8, 9, 13, 37, 39, 46].includes(charCode) ||
    (keyEvent.ctrlKey && [86].includes(charCode))
  ) {
    emit('on-keydown', event);
  } else {
    keyEvent.preventDefault();
  }
};

const handleOnPaste = (event: ClipboardEvent) => {
  const value = (event.target as HTMLInputElement).value;

  if (value && value.trim().length > 1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // This is a workaround for dealing IOS does not fire onPaste event from sms auto-populate.
    event.clipboardData = {
      getData: () => value.trim(),
    };

    return emit('on-paste', event);
  }

  emit('on-paste', event);
};

const handleOnFocus = () => {
  input.value.select();
  return emit('on-focus');
};

const handleOnBlur = () => emit('on-blur');

const inputTypeValue = computed(() =>
  ['letter-numeric', 'number'].includes(props.inputType) ? 'text' : props.inputType,
);

watch(
  () => props.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      model.value = newValue;
    }
  },
);

watch(
  () => props.focus,
  (newFocusValue, oldFocusValue) => {
    // Check if focusedInput changed
    // Prevent calling function if input already in focus
    if (oldFocusValue !== newFocusValue && input.value && props.focus) {
      input.value.focus();
      input.value.select();
    }
  },
);

onMounted(() => {
  if (input.value && props.focus && props.shouldAutoFocus) {
    input.value.focus();
    input.value.select();
  }
});
</script>

<template>
  <input
    ref="input"
    :value="model"
    data-test="single-input"
    :type="inputTypeValue"
    :inputmode="inputmode"
    :placeholder="placeholder"
    :disabled="isDisabled"
    min="0"
    max="9"
    :maxlength="1"
    pattern="[0-9]"
    class="a-single-otp-input"
    autocomplete="one-time-code"
    :class="[inputClasses, conditionalClass, { 'is-complete': model, 'is-error': isError }]"
    @input="handleOnChange"
    @keydown="handleOnKeyDown"
    @paste="handleOnPaste"
    @focus="handleOnFocus"
    @blur="handleOnBlur"
  />
</template>

<style lang="scss">
.a-single-otp-input {
  display: flex;
  justify-content: center;
  align-items: center;
  width: to-rem(53);
  height: to-rem(62);
  padding: 0;
  background-color: var(--base-gray-border);
  border: to-rem(1) solid var(--base-gray-border);
  border-radius: to-rem(8);
  font-size: to-rem(32);
  text-align: center;

  &:focus-visible {
    outline: to-rem(1) solid var(--base-blue);
  }
}

.is-error {
  color: var(--base-white);
  background-color: #f7d2d2;

  &:focus-visible {
    outline: to-rem(1) solid var(--additional-red);
  }
}
</style>
