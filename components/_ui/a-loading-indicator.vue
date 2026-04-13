<template>
  <div
    class="a-loader"
    :class="classes"
    :style="{ opacity: indicator.isLoading.value ? 1 : 0, display: indicator.isLoading.value ? 'flex' : 'none' }"
  >
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'basic',
  },
  throttle: {
    type: Number,
    default: 200,
  },
  duration: {
    type: Number,
    default: 2000,
  },
});

const classes = computed(() => ({
  basic: props.type === 'basic',
  fullscreen: props.type === 'fullscreen',
}));

// eslint-disable-next-line vue/no-setup-props-destructure
const indicator = useLoadingIndicator({
  duration: props.duration,
  throttle: props.throttle,
});

const nuxtApp = useNuxtApp();
nuxtApp.hook('page:start', indicator.start);
nuxtApp.hook('page:finish', indicator.finish);
onBeforeUnmount(indicator.clear);
</script>

<style lang="scss">
.a-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--base-white);

  &.fullscreen {
    position: fixed;
    z-index: 9000;
    top: 0;
    left: 0;
    overflow: hidden;
    min-width: 100%;
    min-height: 100vh;
  }

  &.basic {
    height: 100%;
  }
}

.lds-ellipsis {
  position: relative;
  display: inline-block;
  width: to-rem(80);
  height: to-rem(80);

  div {
    position: absolute;
    top: to-rem(33);
    width: to-rem(14);
    height: to-rem(14);
    background-color: var(--base-blue);
    border-radius: 50%;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);

    &:nth-child(1) {
      left: to-rem(8);
      animation: lds-ellipsis1 0.6s infinite;
    }

    &:nth-child(2) {
      left: to-rem(8);
      animation: lds-ellipsis2 0.6s infinite;
    }

    &:nth-child(3) {
      left: to-rem(32);
      animation: lds-ellipsis2 0.6s infinite;
    }

    &:nth-child(4) {
      left: to-rem(56);
      animation: lds-ellipsis3 0.6s infinite;
    }
  }
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(24px, 0);
  }
}
</style>
