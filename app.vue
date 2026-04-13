<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <VueQueryDevtools />
</template>

<script setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

const config = useRuntimeConfig();
const gtmId = computed(() => String(config.public.gtm || '').trim());

useHead(() => {
  const id = gtmId.value;
  if (!id) {
    return {};
  }
  return {
    script: [
      {
        key: 'gtm-inline',
        innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`,
      },
    ],
    noscript: [
      {
        key: 'gtm-noscript',
        children: `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        body: true,
      },
    ],
  };
});
</script>
