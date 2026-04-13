<template>
  <div class="card-search">
    <div class="card-search__container">
      <nuxt-link
        v-if="withLinks"
        :to="computedPath"
        class="card-search__link"
        @click.prevent="$emit('click', { id: id, name: name })"
      >
        {{ name }} <template v-if="shortName"> ({{ shortName }}) </template>
      </nuxt-link>
      <div v-else class="card-search__link" @click="$emit('click', { id: id, name: name })">
        {{ name }} <template v-if="shortName"> ({{ shortName }}) </template>
      </div>
      <div class="card-search__city">{{ cityName }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  shortName: {
    type: String,
    default: '',
  },
  cityName: {
    type: String,
    default: '',
  },
  withLinks: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['click']);

const computedPath = computed(() => `/org/${props.type}_${props.id}/`);
</script>

<style lang="scss">
.card-search {
  &__link {
    color: var(--base-blue);
    font-size: to-rem(14);
    font-weight: 700;
    line-height: to-rem(16);
    transition: all 0.4s ease-in;

    &:hover {
      color: var(--base-blue);
      cursor: pointer;
    }
  }

  &__city {
    font-size: to-rem(12);
    line-height: to-rem(16);
  }
}
</style>
