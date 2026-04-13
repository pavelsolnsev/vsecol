<template>
  <section class="main-screen">
    <div class="main-screen__container l-wide">
      <div class="main-screen__about">
        <h1 class="main-screen__title">Демо-каталог ВО и СПО</h1>
        <p class="main-screen__description">
          Демонстрационный интерфейс каталога образовательных организаций для портфолио. Данные приходят с вашего API.
        </p>

        <AButton
          aria-label="Подобрать программу"
          label="Подобрать программу"
          size="large"
          variant="primary"
          preppend-icon="Enroll"
          @click="modalLead = !modalLead"
        />

        <template v-if="false">
          <p class="main-screen__question">Нужна актуальная информация?</p>
          <p class="main-screen__answer">Используйте наш сервис «Проверить колледж/вуз»</p>

          <p>
            <a href="#" class="main-screen__link">Проверить ВУЗ</a>
            <a href="#" class="main-screen__link">Проверить колледж</a>
          </p>
        </template>
      </div>

      <div class="main-screen__picture">
        <NuxtImg
          :src="screenImage"
          :width="imageWidth"
          alt="Демо-каталог образования"
          loading="eager"
          :preload="{ fetchPriority: 'high' }"
          densities="1x 2x"
        />
      </div>
    </div>
  </section>

  <AModal
    v-model="modalLead"
    :title="modalTitle"
    :max-width="
      storeDevice.isWideDesktop ? '708px' : storeDevice.isDesktop || storeDevice.isWideTablet ? '615px' : '100%'
    "
    indent
    @update:model-value="modalClosed"
  >
    <FormLead
      v-if="!isSent"
      :loading="isLoading"
      :is-error="isError"
      :error-message="leadErrorMessage"
      @on-submit="sendData"
    />
    <MThanks v-else />
  </AModal>
</template>

<script setup>
import { useTimeoutFn } from '@vueuse/core';
import AButton from '~/components/_ui/a-button.vue';
import AModal from '~/components/_ui/a-modal.vue';
import FormLead from '~/components/Form/Lead.vue';
import { useDeviceStore } from '~/store/device';
import { useInfoStore } from '~/store/info';
import MThanks from '../_ui/m-thanks.vue';
import { DEMO_UTM_SOURCE } from '~/shared/constants';

const pageAbsoluteUrl = useAbsolutePageUrl();
const ymReach = useYmReachGoal();
const storeDevice = useDeviceStore();
const storeInfo = useInfoStore();

const app = getCurrentInstance();
//const yandexMetrika = app.appContext.config.globalProperties.$metrika;
const device = app.appContext.config.globalProperties.$device;

const modalLead = ref(false);
const modalTitle = ref(`Подобрать программу`);
const isSent = ref(false);
const isLoading = ref(false);
const isError = ref(false);
const leadErrorMessage = ref('Произошла ошибка. Попробуйте оставить заявку позднее.');

const screenImage = computed(() => {
  if (storeDevice.isWideDesktop) return '/images/main-wide-desktop.webp';
  if (storeDevice.isDesktop) return '/images/main-desktop.webp';
  if (storeDevice.isTablet || storeDevice.isWideTablet) return '/images/main-tablet.webp';
  return '/images/main-mobile.webp';
});

const imageWidth = computed(() => {
  if (storeDevice.isWideDesktop) return 1440;
  if (storeDevice.isDesktop) return 1024;
  if (storeDevice.isTablet || storeDevice.isWideTablet) return 768;
  return 375;
});

const leadDevice = computed(() =>
  Object.keys(device)
    .filter((key) => device[key] === true)
    .toString(),
);

const { start: startCloseTimer, stop: stopCloseModal } = useTimeoutFn(
  () => {
    modalLead.value = false;
    modalClosed();
  },
  4000,
  { immediate: false },
);

const sendData = async (event) => {
  isLoading.value = true;

  try {
    const utms = {
      utm_source: DEMO_UTM_SOURCE,
      utm_campaign: storeInfo.isCollege ? 'college' : 'vuz',
      utm_term: 'program',
    };

    const params = new URLSearchParams(utms).toString();

    const result = await $fetch(`/api/leads/?${params}`, {
      method: 'POST',
      params: {
        entity_type: 'ProgramPicker',
        entity_id: null,
        url: pageAbsoluteUrl.value,
        name: event.name,
        phone: event.phone,
        cid: storeInfo.cid,
        device: leadDevice.value,
      },
    });

    ymReach('card_send');

    if (result.data?.success) {
      isLoading.value = false;
      isSent.value = true;
      isError.value = false;
      modalTitle.value = null;

      ymReach('card_success');
      //yandexMetrika.reachGoal('card_success');

      startCloseTimer();
    } else {
      isError.value = true;
      leadErrorMessage.value = 'Произошла ошибка. Попробуйте оставить заявку позднее.';
    }
  } catch (error) {
    console.error(error);
    if (error?.statusCode === 429) {
      isError.value = true;
      leadErrorMessage.value = 'Лимит исчерпан. Попробуйте оставить заявку завтра.';
    }
  }
};

const modalClosed = () => {
  stopCloseModal();
  modalTitle.value = `Подобрать программу`;
  isSent.value = false;
  isError.value = false;
  isLoading.value = false;
};

onUnmounted(() => {
  stopCloseModal();
});
</script>

<style lang="scss">
.main-screen {
  padding-top: to-rem(32);
  padding-bottom: to-rem(90);
  background-color: var(--base-gray-second);

  @media (min-width: 767px) {
    padding-top: to-rem(40);
    padding-bottom: to-rem(120);
  }

  @media (min-width: 767px) {
    padding-top: to-rem(16);
    padding-bottom: to-rem(112);
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 767px) {
      flex-direction: row;
      align-items: flex-end;
    }

    @media (min-width: 1024px) {
      align-items: center;
    }
  }

  &__about {
    width: 100%;

    @media (min-width: 767px) {
      max-width: to-rem(450);
    }

    @media (min-width: 1024px) {
      max-width: 50%;
    }

    @media (min-width: 1440px) {
      max-width: to-rem(690);
    }
  }

  &__picture {
    align-self: flex-end;
    width: 100%;
    max-width: to-rem(240);

    @media (min-width: 480px) {
      max-width: to-rem(240);
    }

    @media (min-width: 767px) {
      max-width: to-rem(550);
    }

    @media (min-width: 1024px) {
      width: 50%;
      margin-right: 0;
    }

    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  &__image {
    display: inline;
  }

  &__title {
    margin-bottom: to-rem(16);
    font-size: to-rem(44);
    font-weight: 700;
    line-height: 112.5%;

    @media (min-width: 767px) {
      font-size: to-rem(64);
    }
  }

  &__description {
    margin-bottom: to-rem(32);
    color: var(--base-black-light);
    font-size: to-rem(18);
    line-height: 122%;
  }

  &__question {
    margin-bottom: to-rem(8);
    font-size: to-rem(18);
    font-weight: 700;
    line-height: 122%;
  }

  &__answer {
    margin-bottom: to-rem(18);
    color: var(--base-gray);
    font-size: to-rem(16);
    line-height: 150%;
  }

  &__link {
    margin-right: to-rem(24);
    color: var(--base-gray);
    font-size: to-rem(14);
    line-height: 150%;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
