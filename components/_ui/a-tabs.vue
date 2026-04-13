<template>
  <div class="a-tabs">
    <div class="a-tabs__inner">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="[currentIndex === index ? 'a-tabs__item--active' : '']"
        class="a-tabs__item a-tabs__item--padding"
        @click="selectTab(index)"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['on-change']);

let currentIndex = ref(0);

const selectTab = (index) => {
  currentIndex.value = index;
  emit('on-change', index);
};
</script>

<style lang="scss">
.a-tabs {
  overflow-x: auto;

  @media (max-width: 1024px) {
    display: flex;
  }

  &__inner {
    display: flex;

    @media (max-width: 1024px) {
      padding: to-rem(10);
      border: to-rem(1) solid var(--primary);
    }
  }

  &__item {
    flex: 1;
    padding: to-rem(10) to-rem(12);
    color: var(--primary);
    border-top: to-rem(1) solid var(--primary);
    border-bottom: to-rem(1) solid var(--primary);
    font-size: to-rem(13);
    font-weight: 400;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    letter-spacing: to-rem(3.9);
    text-transform: uppercase;
    transition: all 0.25s ease-in-out;

    @media (max-width: 1024px) {
      padding: to-rem(6) to-rem(20);
      border: none;
      font-size: to-rem(12);
      letter-spacing: to-rem(3.6);
    }

    &:first-child {
      border-left: to-rem(1) solid var(--primary);

      @media (max-width: 1024px) {
        border: none;
      }
    }

    &:last-child {
      border-right: to-rem(1) solid var(--primary);

      @media (max-width: 1024px) {
        border: none;
      }
    }

    &:hover {
      color: var(--primary-hover);
      cursor: pointer;
    }

    &--active {
      color: var(--base-white);
      background-color: var(--primary);

      &:hover {
        color: var(--base-white);
      }
    }

    &--padding {
      padding: to-rem(10) to-rem(8);

      @media (max-width: 1024px) {
        padding: to-rem(6) to-rem(20);
      }
    }
  }
}
</style>
