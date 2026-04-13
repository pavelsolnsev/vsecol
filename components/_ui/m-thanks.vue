<template>
  <div class="m-thanks">
    <div class="m-thanks__info">
      <ATitle tag="h2" class="m-thanks__title">Спасибо!</ATitle>
      <p class="m-thanks__description">
        Ваша заявка отправлена! Ожидайте звонка от нашего специалиста, в течение 2-х минут. Сотрудник свяжется с Вами в
        ближайшее время.
      </p>
    </div>

    <NuxtImg src="/images/thanks-popup.webp" alt="Icon thanks" class="m-thanks__img" loading="lazy" />
  </div>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
</script>

<style lang="scss" scoped>
.m-thanks {
  display: flex;
  flex-direction: column;
  gap: to-rem(40);

  @media (min-width: 767px) {
    flex-direction: row;
    gap: to-rem(32);
    justify-content: space-between;
  }

  &__img {
    max-width: to-rem(204);
    width: 100%;
    margin-left: auto;

    @media (min-width: 767px) {
      font-size: to-rem(236);
    }
  }

  &__title {
    font-size: to-rem(32);

    @media (min-width: 767px) {
      font-size: to-rem(44);
      line-height: to-rem(48);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: to-rem(24);

    @media (min-width: 767px) {
      gap: to-rem(32);
    }
  }
}
</style>
