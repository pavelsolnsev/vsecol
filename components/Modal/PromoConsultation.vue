<template>
  <ClientOnly>
    <Teleport to="body">
      <AModal
        v-model="localValue"
        :max-width="modalMaxWidth"
        indent
      >
      <div class="promo-consultation-wrapper" data-promo-consultation>
        <div class="promo-consultation">
        <template v-if="isSent">
          <ATitle tag="h2" class="promo-consultation__title">Спасибо!</ATitle>

          <p class="promo-consultation__description">
            Ваша заявка отправлена.<br />
            Сотрудник свяжется с Вами в ближайшее время.
          </p>
        </template>

        <template v-else>
          <picture v-if="logoUrl" class="promo-consultation__logo">
            <source :srcset="logoUrl" type="image/webp" />
            <NuxtImg :src="logoUrl" :alt="organizationName" loading="lazy" class="promo-consultation__logo-image" />
          </picture>
          <ATitle v-if="titleText" tag="h3" class="promo-consultation__title">{{ titleText }}</ATitle>

          <form class="promo-consultation__form" @submit.prevent="submit">
            <AInput
              v-model="formData.phone"
              v-maska
              mask
              label="Ваш телефон*"
              data-maska="['+7 (###) ###-##-##']"
              size="large"
              border-radius="4px"
              block
              class="promo-consultation__input"
              @keyup="handleInput"
            />
          </form>

          <ACheckbox
            v-model="checkAgreement"
            :label-text="checkAgreementText"
            box-position="left"
            type="secondary"
            class="promo-consultation__checkbox"
          />

          <AButton
            label="Отправить"
            size="large"
            variant="primary"
            :disabled="!checkAgreement || isLoading || !isPhoneValid"
            :loading="isLoading"
            block
            class="promo-consultation__button"
            @click="submit"
          />

          <div v-if="errors.phone.value" class="promo-consultation__errors">
            <ul class="promo-consultation__list">
              <li class="promo-consultation__list-item">
                {{ errors.phone.message }}
              </li>
            </ul>
          </div>

          <div v-if="isError || hasResponseError" class="promo-consultation__errors">
            <ul class="promo-consultation__list">
              <li class="promo-consultation__list-item">
                {{ globalError }}
              </li>
            </ul>
          </div>

          <span v-if="props.promoData?.erid" class="promo-consultation__erid">
            erid: {{ props.promoData.erid }}
          </span>
        </template>
      </div>
      </div>
    </AModal>
  </Teleport>
  </ClientOnly>
</template>

<script setup>
import { useInfoStore } from '~/store/info';
import { useDeviceStore } from '~/store/device';
import { useApiPostLeads } from '~/composables/api/useApiPostLeads';
import { useTimeoutFn } from '@vueuse/core';
import { DEMO_UTM_SOURCE, DEMO_LAND_SLUG } from '~/shared/constants';
import ATitle from '~/components/_ui/a-title.vue';
import AModal from '~/components/_ui/a-modal.vue';
import AInput from '~/components/_ui/a-input.vue';
import ACheckbox from '~/components/_ui/a-checkbox.vue';
import AButton from '~/components/_ui/a-button.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  promoData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const storeInfo = useInfoStore();
const storeDevice = useDeviceStore();
const route = useRoute();
const pageAbsoluteUrl = useAbsolutePageUrl();

// Базовый API композабл
const { mutateAsync: submitLead, isPending: isLoading, isError, reset } = useApiPostLeads();

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    if (!value) {
      emit('close');
    }
  },
});

const modalMaxWidth = computed(() => {
  if (storeDevice.isMobile || storeDevice.isTablet) return '100%';
  if (storeDevice.isWideTablet) return '615px';
  return '708px';
});

const organizationName = computed(() => props.promoData?.title || '');
const logoUrl = computed(
  () => props.promoData?.popup_logo?.url || props.promoData?.organization?.logo || props.promoData?.logo || null,
);
const titleText = computed(() => props.promoData?.form_title || props.promoData?.title || '');

const formData = reactive({
  phone: '+7 (',
});

const errors = reactive({
  phone: {
    value: false,
    message: 'Необходимо заполнить поле Телефон',
  },
});

const globalError = ref('Произошла ошибка. Попробуйте оставить заявку позднее.');
const hasResponseError = ref(false);
const isSent = ref(false);

const checkAgreement = ref(false);
const checkAgreementText = computed(
  () =>
    // eslint-disable-next-line max-len
    `Нажимая на кнопку, я соглашаюсь с <a href="/files/privacy_policy.pdf" target="_blank">политикой конфиденциальности</a> и на получение рассылок`,
);

const isPhoneValid = computed(() => {
  const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/i;
  return phoneRegex.test(formData.phone);
});

const handleInput = (event) => {
  if (event.target.value.length < 4) {
    formData.phone = '+7 (';
  }
};

const checkedValidateError = () => {
  errors.phone.value = !isPhoneValid.value;
  return errors.phone.value;
};

const { start: startCloseTimer } = useTimeoutFn(() => {
  localValue.value = false;
}, 4000, { immediate: false });

const submit = async () => {
  const hasErrors = checkedValidateError();

  if (!hasErrors) {
    hasResponseError.value = false;

    // Определяем тип по маршруту для utm_campaign
    const promoType = route.path.includes('/kolledzh')
      ? 'college'
      : route.path.includes('/vuz')
      ? 'university'
      : props.promoData?.organization?.type || 'university';

    // Формируем UTM-метки
    const utms = {
      utm_source: DEMO_UTM_SOURCE,
      utm_campaign: promoType,
      utm_term: 'popup',
      land: DEMO_LAND_SLUG,
    };

    const params = {
      ...utms,
      entity_type: 'Promo',
      entity_id: props.promoData?.id,
      url: pageAbsoluteUrl.value,
      phone: formData.phone,
      content: organizationName.value,
      cid: storeInfo.cid,
      device: storeDevice.currentDevice,
    };

    try {
      const result = await submitLead({ params });

      if (result?.data?.success) {
        isSent.value = true;
        reset();
        startCloseTimer();
      } else {
        hasResponseError.value = true;
        globalError.value = 'Произошла ошибка. Попробуйте оставить заявку позднее.';
      }
    } catch (error) {
      console.error('[PromoConsultation] Error submitting lead:', error);
      if (error?.statusCode === 429) {
        hasResponseError.value = true;
        globalError.value = 'Лимит исчерпан. Попробуйте оставить заявку завтра.';
      }
    }
  }
};


</script>

<style lang="scss">
// Переопределение для wide-tablet (768-1023px)
// AModal добавляет a-modal--mobile для tablet/wide-tablet с position: absolute
// Нам нужно центрирование как на desktop
@media (min-width: 768px) and (max-width: 1023px) {
  .a-modal.a-modal--mobile {
    .a-modal__container {
      align-items: center !important;
    }

    .a-modal .a-modal__block,
    .a-modal__block {
      position: relative !important;
      top: auto !important;
      right: auto !important;
      left: auto !important;
      bottom: auto !important;
      max-height: none !important;
    }
  }
}

.promo-consultation-wrapper {
  width: 100%;
}

.promo-consultation {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: to-rem(40);

  @media (max-width: 767px) {
    padding: to-rem(24) to-rem(20);
  }

  &__logo {
    margin-bottom: to-rem(24);

    @media (min-width: 768px) {
      margin-bottom: to-rem(32);
    }

    &-image {
      height: to-rem(48);
      object-fit: contain;

      @media (min-width: 768px) {
        height: to-rem(56);
      }
    }
  }

  &__title {
    margin-bottom: to-rem(24);
    font-size: to-rem(22);
    line-height: to-rem(30);

    @media (min-width: 768px) {
      font-size: to-rem(24);
      line-height: to-rem(32);
    }
  }

  &__description {
    font-size: to-rem(16);
    line-height: to-rem(24);
    font-weight: 700;

    @media (min-width: 768px) {
      font-size: to-rem(18);
      line-height: to-rem(26);
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: to-rem(10);
    margin-bottom: to-rem(16);
  }

  &__input {
    margin-bottom: 0;
  }

  &__checkbox {
    margin-bottom: to-rem(16);

    @media (min-width: 768px) {
      margin-top: 0;
    }
  }

  &__button {
    margin-bottom: to-rem(16);
  }

  &__errors {
    padding: to-rem(12);
    border: to-rem(1) dashed var(--additional-red);
    border-radius: to-rem(4);
  }

  &__list {
    font-size: to-rem(13);
    color: var(--additional-red);

    &-item {
      margin-bottom: to-rem(4);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__erid {
    position: absolute;
    left: to-rem(16);
    bottom: to-rem(16);
    color: var(--base-black);
    font-size: to-rem(14);

    @media (max-width: 767px) {
      left: to-rem(16);
      bottom: to-rem(16);
    }
  }
}
</style>
