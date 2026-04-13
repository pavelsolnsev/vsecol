<template>
  <LazyPageDelete hydrate-on-visible />
</template>

<script setup>
definePageMeta({
  layout: 'empty',
  middleware: ['not-auth'],
});
</script>
