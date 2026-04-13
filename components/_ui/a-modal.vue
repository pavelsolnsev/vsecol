<template>
  <template v-if="isActive">
    <div class="a-modal__backdrop" @click="emit('update:modelValue', false)"></div>
  </template>
  <Transition name="slide-up">
    <div
      v-if="isActive"
      class="a-modal"
      :class="{ 'a-modal--mobile': storeDevice.isMobile || storeDevice.isTablet || storeDevice.isWideTablet }"
    >
      <div class="a-modal__container">
        <div ref="target" class="a-modal__block" :class="classesBlock" :style="`max-width: ${maxWidth}`">
          <div class="a-modal__close" :class="classesClose">
            <component
              :is="isOutlineClose ? ModalOutlineClose : ModalClose"
              class="a-modal__icon"
              :class="{
                outline: isOutlineClose,
              }"
              @click="emit('update:modelValue', false)"
            />
          </div>
          <ATitle v-if="title" tag="h2" class="a-modal__title">{{ title }}</ATitle>
          <div class="a-modal__content">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import ModalClose from '~/components/_icons/ModalClose.vue';
import ModalOutlineClose from '~/components/_icons/ModalOutlineClose.vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: String,
    default: '',
  },
  indent: {
    type: Boolean,
    default: false,
  },
  isOutlineClose: {
    type: Boolean,
    default: false,
  },
});

const classesClose = computed(() => ({
  [`a-modal__close--indent`]: props.indent,
}));

const classesBlock = computed(() => ({
  [`a-modal__block--indent`]: props.indent,
}));

const emit = defineEmits(['update:modelValue']);

const isActive = computed(() => props.modelValue);

import { useDeviceStore } from '~/store/device';

const storeDevice = useDeviceStore();
</script>

<style lang="scss">
.a-modal {
  position: fixed;
  z-index: 999999;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  &__backdrop {
    position: fixed;
    z-index: 999998;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: var(--base-black);
    opacity: 0.6;
    pointer-events: all;
  }

  &__container {
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 0;
    padding-left: 0;

    @media (min-width: 767px) {
      padding-right: to-rem(40);
      padding-left: to-rem(40);
    }

    @media (min-width: 1024px) {
      padding-right: to-rem(40);
      padding-left: to-rem(40);
    }
  }

  &__block {
    position: relative;
    width: 100%;
    max-width: to-rem(800);
    max-height: to-rem(828);
    padding: to-rem(20) to-rem(32);
    background-color: var(--base-white);
    border-radius: var(--border-radius-x2);

    @media (min-width: 767px) {
      height: auto;
      padding: to-rem(32);
    }

    &--indent {
      height: 100%;
      max-height: 90vh;

      @media (min-width: 767px) {
        height: auto;
      }
    }
  }

  &__close {
    display: flex;
    justify-content: flex-end;

    &--indent {
      position: absolute;
      z-index: 1;
      top: to-rem(12);
      right: to-rem(12);

      @media (min-width: 767px) {
        top: to-rem(10);
        right: to-rem(10);
      }
    }
  }

  &__icon {
    width: to-rem(34);
    height: to-rem(34);
    cursor: pointer;
  }

  &__title {
    margin-bottom: to-rem(32);
    font-size: to-rem(32);
    line-height: to-rem(40);
  }

  &--mobile & {
    &__block {
      position: absolute;
      top: to-rem(58);
      right: 0;
      left: 0;
      bottom: 0;
      max-height: calc(100% - 58px);
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
