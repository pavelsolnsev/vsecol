<template>
  <div class="navigation">
    <div v-for="item in items" :key="item.link" class="navigation__item">
      <NuxtLink :to="item.link" class="navigation__link" @click="emit('click')">{{ item.name }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['click']);
</script>

<style lang="scss">
.navigation {
  &__item {
    margin-bottom: to-rem(16);

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__link {
    color: var(--base-white);
    font-size: to-rem(14);
    line-height: to-rem(18);
  }
}
</style>
