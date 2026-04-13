<template>
  <div class="a-skeleton">
    <transition name="a-skeleton" mode="out-in">
      <div v-if="!isShow" class="a-skeleton__block" :class="blockClass" />
      <slot v-else />
    </transition>
  </div>
</template>

<script setup>
defineProps({
  isShow: {
    type: [Boolean, Number, String],
    default: false,
  },
  blockClass: {
    type: [String, Object],
    default: null,
  },
});
</script>

<style lang="scss">
.a-skeleton {
  &__block {
    overflow: hidden;
    background-color: #a4abb5;
    opacity: 0.5;
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    border-radius: var(--border-radius-x1);
  }

  &-enter-active {
    transition: opacity 0.15s ease-out;
  }

  &-leave-active {
    transition: opacity 0.1s ease-in;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.2;
    }
  }
}
</style>
