<template>
  <LazyPageLogin hydrate-on-visible />
</template>

<script setup>
definePageMeta({
  layout: 'empty',
  middleware: ['auth', 'is-auth'],
});
</script>
