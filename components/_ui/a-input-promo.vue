<script setup>
import AInput from '~/components/_ui/a-input.vue';
</script>

<template>
  <AInput class="a-input--promo" />
</template>

<style lang="scss">
.a-input {
  &--promo & {
    &__label {
      position: absolute;
      top: 8px;
      left: 16px;
      font-size: 12px;
      color: #8997ab;
    }

    &__container {
      padding: 0;
      border: 0;
    }

    &__textfield {
      font-weight: 700;
      line-height: 16px;
      padding: 28px 16px 16px;

      &::placeholder {
        color: #2c2c2c;
      }
    }
  }
}
</style>
