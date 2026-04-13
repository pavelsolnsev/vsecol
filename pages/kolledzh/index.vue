<template>
  <Suspense>
    <LazyPageListing page-type="college" hydrate-on-visible />

    <template #fallback>
      <LazySkeletonListing />
    </template>
  </Suspense>
</template>
