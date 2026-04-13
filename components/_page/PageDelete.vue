<template>
  <PPage css-class="login">
        <div class="p-login__wrapper">
          <div class="p-login__form">
            <ATitle tag="h1" class="mb-8">Удалить аккаунт</ATitle>
            <div class="p-login__info">
              <div class="p-login__current-form">
                Ваш текущий номер: <span class="p-login__info--marker">{{ phoneNumber }}</span
                >.
              </div>
              Данное действие необратимо, аккаунт пользователя будет удален вместе с&nbsp;результатами всех проверок.
            </div>
            <FormDelete />
          </div>
        </div>
      </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ATitle from '~/components/_ui/a-title.vue';
import FormDelete from '~/components/Form/Delete.vue';
import { useAuthStore } from '~/store/auth';

const storeAuth = useAuthStore();

const { phoneNumber } = storeToRefs(storeAuth);
</script>

<style lang="scss" scoped>
.p-login {
  min-height: 100%;
  position: relative;
  background-color: var(--base-gray-second);

  &__part {
    width: 50%;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    position: relative;
    transform: translateY(-50%);
    align-items: center;
    max-width: to-rem(804);
    margin: 0 auto;
  }

  &__form {
    max-width: to-rem(378);

    &--wide {
      max-width: to-rem(500);
    }
  }

  &__info {
    line-height: to-rem(24);
    margin-bottom: to-rem(40);

    &--marker {
      text-decoration: underline;
      color: var(--base-blue);
    }
  }

  &__current-form {
    margin-bottom: to-rem(8);
  }

  &__about {
    flex: 1;
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