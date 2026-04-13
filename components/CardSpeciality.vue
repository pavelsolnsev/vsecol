<template>
  <NuxtLink :to="computedPath" class="card-speciality">
    <span class="card-speciality__code">
      <template v-if="type === 'level'"> <span>**</span>.{{ code }}.<span>**</span> </template>
      <template v-else> {{ code.split('.')[0] }}.<span>**</span>.<span>**</span> </template>
    </span>
    <ATitle tag="h3" class="card-speciality__title">{{ name }}</ATitle>
  </NuxtLink>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import { useInfoStore } from '~/store/info';

const storeInfo = useInfoStore();

const { path: currentPath } = storeToRefs(storeInfo);

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  slug: {
    type: String,
    default: '',
  },
  code: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'level',
  },
});

const computedPath = computed(
  () => `/${currentPath.value}/specialties/${props.type === 'level' ? 'level_' + props.slug : 'group_' + props.code}/`,
);
</script>

<style lang="scss">
.card-speciality {
  display: block;
  height: 100%;
  padding: to-rem(16);
  background-color: var(--base-gray-smoky);
  border-radius: to-rem(8);

  &__code {
    display: block;
    margin-bottom: to-rem(16);
    font-size: to-rem(12);

    span {
      color: var(--base-gray);
    }
  }

  &__title {
    color: var(--base-blue);
    font-size: to-rem(16);
    font-weight: 700;
    line-height: to-rem(24);
  }
}
</style>
