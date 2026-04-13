<template>
  <div v-for="(item, index) in computedData" :key="index" class="speciality__okso">
    <div class="speciality__okso-number">{{ item?.code }}</div>
    <div class="speciality__okso-name">
      <template v-if="!subjectSlug && !citySlug">
        <span>{{ item?.name }}</span>
      </template>
      <template v-else>
        <nuxt-link :to="computedLink(item?.code)" class="speciality__okso-link">{{ item?.name }}</nuxt-link>
      </template>
    </div>
  </div>
  <span v-if="data && data.length > 5" class="speciality__toggle" @click="showAll = !showAll">{{
    showAll ? 'Свернуть' : 'Показать все'
  }}</span>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return [];
    },
  },
  subjectSlug: {
    type: String,
    default: '',
  },
  citySlug: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
});

const showAll = ref(false);

const computedData = computed(() => (showAll.value ? props.data : props.data.slice(0, 5)));

const isMainCities = computed(() => !!(props.citySlug === 'moskva' || props.citySlug === 'sankt-peterburg'));

const computedLink = (code) => {
  return `/${props.type === 'university' ? 'vuz' : 'kolledzh'}/${
    isMainCities.value ? 'city_' + props.citySlug : 'subject_' + props.subjectSlug + '/city_' + props.citySlug
  }/spec_${code}/`;
};
</script>
