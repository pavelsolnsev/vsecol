<template>
  <div class="licenses">
    <CardLicense type="license" :data="licenses" />
    <CardLicense type="accreditation" :data="accreditations" />
  </div>
</template>

<script setup>
import CardLicense from '~/components/CardLicense.vue';

defineProps({
  licenses: {
    type: Array,
    default: () => {
      return [];
    },
  },
  accreditations: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
</script>
