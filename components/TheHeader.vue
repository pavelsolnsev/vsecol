<template>
  <header class="header">
    <div class="header__container l-wide">
      <div class="header__part">
        <div class="header__logo">
          <nuxt-link to="/" title="Перейти на главную" class="header__logo__link">
            <Logo class="header__logo__icon" />
          </nuxt-link>
        </div>
      </div>

      <nav class="header__types">
        <nuxt-link
          v-for="item in routes"
          :key="item.link"
          :to="{ path: `/${item.link}/` }"
          class="header__types__link"
          :class="{ header__types__link_active: storeInfo.path === item.link }"
          >{{ item.name }}</nuxt-link
        >
      </nav>

      <div class="header__actions">
        <AButton variant="outline-blue" size="small" @click="startQuiz">
          <template #preppend>
            <ToEnroll class="header__actions-icon" />
          </template>
          Подобрать
        </AButton>

        <a :href="demoTelegramUrl" target="_blank" rel="nofollow" class="header__button-link" @click="openLink">
          <ToTelegram class="header__actions-icon" />
          Консультация
        </a>
      </div>

      <div class="header__personal">
        <a :href="`tel:${DEMO_PHONE_TEL}`" target="_black" class="header__personal__button">
          <IconPhone />
        </a>

        <AButton
          variant="plain"
          :aria-label="
            storeInfo.isUniversity ? 'Поиск Вуза' : storeInfo.isCollege ? 'Поиск Колледжа' : 'Поиск Колледжа или Вуза'
          "
          class="header__personal__button"
          @click="dialog = true"
        >
          <Search class="header__personal__icon" />
        </AButton>
        <NuxtLink to="/login" title="Авторизация" class="header__personal__button" @click="goToLogin">
          <User class="header__personal__icon" />
        </NuxtLink>
      </div>
    </div>
  </header>

  <ClientOnly>
    <Teleport to="body">
    <div class="mobile-actions">
      <AButton
        aria-label="Подобрать программу"
        label="Подобрать"
        size="medium"
        variant="primary"
        :rounded="false"
        block
        @click="showQuiz = true"
      >
        <template #preppend>
          <ToEnrollWhite />
        </template>
      </AButton>
      <a
        :href="demoTelegramUrl"
        target="_blank"
        rel="nofollow"
        class="mobile-actions__button-link"
        aria-label="Консультация"
        @click="openLink"
      >
        <ToTelegramWhite class="mobile-actions__icon" />
        Консультация
      </a>
    </div>

    <SearchModal v-model="dialog" />

    <AModal
      v-model="showQuiz"
      indent
      :max-width="storeDevice.isWideDesktop || storeDevice.isDesktop || storeDevice.isDesktop ? '630px' : '100%'"
    >
      <TheQuiz @send="showQuiz = false" />
    </AModal>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import AButton from '~/components/_ui/a-button.vue';
import AModal from '~/components/_ui/a-modal.vue';
import Search from '~/components/_icons/Search.vue';
import User from '~/components/_icons/User.vue';
import ToEnroll from '~/components/_icons/ToEnroll.vue';
import ToTelegram from '~/components/_icons/ToTelegram.vue';
import ToEnrollWhite from '~/components/_icons/ToEnrollWhite.vue';
import ToTelegramWhite from '~/components/_icons/ToTelegramWhite.vue';
import SearchModal from '~/components/Search/Modal.vue';
import TheQuiz from '~/components/TheQuiz.vue';
import Logo from '~/components/_icons/Logo.vue';
import { useInfoStore } from '~/store/info';
import { useDeviceStore } from '~/store/device';
import { useAuthStore } from '~/store/auth';
import { useFilterStore } from '~/store/filter';
import IconPhone from '~/components/_icons/IconPhone.vue';
import { DEMO_PHONE_TEL, DEMO_TELEGRAM_URL } from '~/shared/constants';

const storeInfo = useInfoStore();
const demoTelegramUrl = DEMO_TELEGRAM_URL;
const ymReach = useYmReachGoal();
const storeDevice = useDeviceStore();
const storeFilter = useFilterStore();
const { registrationSource } = storeToRefs(useAuthStore());

const routes = [
  {
    name: 'Колледжи',
    link: 'kolledzh',
  },
  {
    name: 'Вузы',
    link: 'vuz',
  },
];

const dialog = ref(false);
const showQuiz = ref(false);

const startQuiz = () => {
  showQuiz.value = true;
  ymReach('quiz_start');
};

const openLink = () => {
  ymReach('header_consul');
};

const goToLogin = () => {
  registrationSource.value = {
    form_type: 'header',
    organization_name: undefined,
    answers: undefined,
    url: window.location.href,
    city: storeFilter.city?.name || storeFilter.subjectName || 'Россия',
  };
};
</script>

<style lang="scss">
.header {
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  left: 0;
  padding: to-rem(16) 0;
  background-color: var(--base-gray-smoky);

  &__container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
  }

  &__part {
    display: flex;
    align-items: center;
  }

  &__logo {
    flex: 1;

    @media (min-width: 767px) {
      flex: initial;
    }

    &__icon {
      display: inline-block;
      width: to-rem(190);

      @media (min-width: 767px) {
        width: to-rem(232);
        height: to-rem(32);
      }
    }

    &__link {
      display: inline-block;
    }
  }

  &__lead {
    display: none;
    margin-left: to-rem(8);

    @media (min-width: 1024px) {
      display: block;
    }
  }

  &__types {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: to-rem(24);
    order: 1;
    gap: to-rem(8);

    @media (min-width: 767px) {
      width: initial;
      order: initial;
      margin-top: 0;
    }

    &__link {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-basis: 50%;
      height: to-rem(32);
      padding-right: to-rem(16);
      padding-left: to-rem(16);
      background-color: transparent;
      border: to-rem(1) solid var(--base-gray-selection);
      border-radius: var(--border-radius-x1);
      font-size: to-rem(14);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.4s ease-in;

      @media (min-width: 767px) {
        height: to-rem(40);
      }

      &:hover,
      &_active {
        color: var(--base-white);
        background-color: var(--base-blue-dark);
        border: to-rem(1) solid var(--base-blue-dark);
      }
    }
  }

  &__personal {
    display: flex;
    gap: to-rem(24);

    &__icon {
      flex-shrink: 0;
      width: to-rem(18);
      height: to-rem(18);
    }

    &__button {
      width: to-rem(20) !important;
      height: to-rem(20) !important;
    }
  }

  &__divider {
    width: to-rem(1);
    min-height: 100%;
    border-left: 1px solid #dcdcdc;
  }

  &__actions {
    display: none;

    @media (min-width: 1024px) {
      gap: 8px;
      display: flex;
    }

    &-icon {
      width: to-rem(16);
      height: to-rem(16);
    }
  }

  &__button-link {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: to-rem(8);
    height: to-rem(40);
    padding: 0 to-rem(16);
    color: #e52421;
    background-color: transparent;
    border: to-rem(1) solid #e52421;
    border-radius: to-rem(4);
    font-size: to-rem(14);
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.25s ease-in-out;

    &:hover {
      text-decoration: none;
    }
  }
}

.mobile-actions {
  position: fixed;
  z-index: 10;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  background-color: var(--base-white);

  @media (min-width: 1024px) {
    display: none;
  }

  &__button-link {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: to-rem(8);
    width: 100%;
    height: to-rem(48);
    padding: 0 to-rem(16);
    color: #fff;
    background-color: #e52421;
    border: to-rem(1) solid #e52421;
    font-size: to-rem(14);
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.25s ease-in-out;

    &:hover {
      text-decoration: none;
    }
  }

  &__icon {
    width: to-rem(16);
    height: to-rem(16);
  }
}
</style>
