<template>
  <LazyPageProfileReportId hydrate-on-visible />
</template>

<script setup>
definePageMeta({
  layout: 'empty',
  middleware: ['auth', 'not-auth'],
});
</script>
