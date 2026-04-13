<template>
  <main class="s-main">
    <div class="s-main__container">
      <slot></slot>
    </div>
  </main>
</template>

<style lang="scss">
.s-main {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 auto;
  width: 100%;
  margin-top: to-rem(118);

  @media (min-width: 767px) {
    margin-top: to-rem(72);
  }

  &__container {
    flex: 1 auto;
  }
}
</style>
