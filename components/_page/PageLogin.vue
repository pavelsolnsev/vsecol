<template>
  <PPage css-class="login">
    <div class="p-login__wrapper">
      <div class="p-login__form">
        <ATitle tag="h1" class="mb-8">Вход</ATitle>
        <FormLogin />
      </div>
      <div class="p-login__about">
        В личном кабинете можно подать заявку на <span class="marker">проверку колледжа или вуза</span> в реестрах
        лицензий, аккредитаций и мониторинга, а также хранить <span class="marker">историю проверок</span>.
      </div>
    </div>
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ATitle from '~/components/_ui/a-title.vue';
import FormLogin from '~/components/Form/Login.vue';
</script>

<style lang="scss" scoped>
.p-login {
  min-height: 100vh;
  background-color: var(--base-gray-second);

  :deep(.s-main) {
    flex: 1;
  }

  :deep(.p-page__container) {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &__wrapper {
    align-items: center;
    max-width: to-rem(804);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (min-width: 767px) {
      flex-direction: column;
      align-items: center;
    }

    @media (min-width: 1024px) {
      flex-direction: row;
    }
  }

  &__form {
    max-width: to-rem(370);
  }

  &__about {
    font-size: to-rem(18);
    line-height: 140%;
    margin-top: to-rem(32);
    max-width: to-rem(370);

    @media (min-width: 767px) {
      margin-left: 0;
      margin-top: to-rem(64);
    }

    @media (min-width: 1024px) {
      margin-left: to-rem(64);
      margin-top: 0;
    }
  }

  &__picture {
    @media (min-width: 767px) {
      top: to-rem(88);
      right: 0;
      position: absolute;
    }

    @media (min-width: 1024px) {
      top: to-rem(20);
    }

    @media (min-width: 1440px) {
      position: relative;
    }
  }
}
</style>