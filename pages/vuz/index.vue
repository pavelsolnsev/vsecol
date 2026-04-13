<template>
  <Suspense>
    <LazyPageListing page-type="university" hydrate-on-visible />

    <template #fallback>
      <LazySkeletonListing />
    </template>
  </Suspense>
</template>
