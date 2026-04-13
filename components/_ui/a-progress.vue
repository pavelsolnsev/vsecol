<template>
  <div class="a-progress">
    <div class="a-progress__container">
      <div class="a-progress__track">
        <div class="a-progress__bar" :style="{ width: trackBarWidth }" />
      </div>
      <div class="a-progress__actions">
        <ProgressPrev class="a-progress__action a-progress__action--prev" @click="prevStep" />
      </div>
      <div class="a-progress__steps">Шаг {{ modelValue }}/{{ steps }}</div>
    </div>
  </div>
</template>

<script setup>
import ProgressPrev from '~/components/_icons/ProgressPrev.vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: 1,
  },
  steps: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(['update:modelValue']);

const trackBarWidth = computed(() => (props.modelValue / props.steps) * 100 + '%');

const prevStep = () => {
  if (props.modelValue <= 1) return;

  emit('update:modelValue', props.modelValue - 1);
};
</script>

<style lang="scss">
.a-progress {
  padding: to-rem(16) 0;

  &__container {
    display: flex;
    align-items: center;
  }

  &__track {
    flex: 1;
    height: to-rem(8);
    background-color: var(--base-gray-smoky);
    border-radius: to-rem(6);
  }

  &__bar {
    height: 100%;
    background-color: var(--base-blue);
    border-radius: to-rem(6);
  }

  &__actions {
    margin-left: to-rem(24);
  }

  &__action {
    cursor: pointer;
  }

  &__steps {
    margin-left: to-rem(20);
    font-size: to-rem(24);
  }
}
</style>
