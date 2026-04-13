<template>
  <ABreadcrumb v-if="isListingPage" :items="breadcrumbs" />
</template>

<script setup>
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';

const { isListingPage, getListingBreadcrumbs } = usePageNavigation();

const breadcrumbs = computed(() => getListingBreadcrumbs());
</script>
