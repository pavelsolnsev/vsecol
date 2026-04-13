<template>
  <Suspense>
    <LazyPageProfessions  hydrate-on-visible/>

    <template #fallback>
      <SkeletonListing />
    </template>
  </Suspense>
</template>
