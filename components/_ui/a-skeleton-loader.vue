<template>
  <div
    class="a-skeleton-loader"
    :class="{ 'a-skeleton-loader--circle': shape }"
    :style="[{ height: `${height}px`, maxWidth: `${width}` }]"
  >
    <div class="a-skeleton-loader__bone"></div>
  </div>
</template>

<script setup>
defineProps({
  shape: {
    type: String,
    default: '',
  },

  width: {
    type: [String, Number],
    default: '100%',
  },

  height: {
    type: [String, Number],
    default: '100%',
  },
});
</script>

<style lang="scss">
.a-skeleton-loader {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: #e2e8f0;
  border-radius: to-rem(4);

  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, rgb(255 255 255 / 0%), rgb(255 255 255 / 40%), rgb(255 255 255 / 0%));
    transform: translateX(-100%);
    animation: a-skeleton-animation 2s infinite;
  }
}

@keyframes a-skeleton-animation {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
}
</style>
