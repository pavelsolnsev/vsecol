<template>
  <div class="promo-form">
    <NuxtImg
      src="/images/promo-decor-mobile.webp"
      alt=""
      class="promo-form__decor promo-form__decor--mobile"
      loading="lazy"
    />
    <NuxtImg
      src="/images/promo-decor-tablet.webp"
      alt=""
      class="promo-form__decor promo-form__decor--tablet"
      loading="lazy"
    />
    <NuxtImg
      src="/images/promo-decor.webp"
      alt=""
      class="promo-form__decor promo-form__decor--desktop"
      loading="lazy"
    />

    <NuxtImg
      src="/images/promo-decor-mobile.webp"
      alt=""
      class="promo-form__decor promo-form__decor--mobile"
      loading="lazy"
    />
    <NuxtImg
      src="/images/promo-decor-tablet.webp"
      alt=""
      class="promo-form__decor promo-form__decor--tablet"
      loading="lazy"
    />
    <NuxtImg
      src="/images/promo-decor.webp"
      alt=""
      class="promo-form__decor promo-form__decor--desktop"
      loading="lazy"
    />

    <template v-if="sent">
      <h2 class="promo-form__title">Спасибо!</h2>
      <p class="promo-form__description">
        Ваша заявка отправлена.<br />
        Сотрудник свяжется с Вами в ближайшее время.
      </p>
    </template>
    <template v-else>
      <h2 class="promo-form__title">Получить консультацию</h2>
      <p class="promo-form__description">Укажите телефон и мы перезвоним вам в течение 15 мин</p>
      <div class="promo-form__row">
        <AInputPromo
          v-model="formData.phone"
          v-maska
          data-maska="['+7 (###) ###-##-##']"
          mask
          label="Телефон"
          size="small"
          border-radius="8px"
          class="promo-form__input"
          placeholder="+7 ("
          block
          @keyup="handleInput"
        />
        <AButton
          label="Получить консультацию"
          size="xlarge"
          variant="outline-white"
          class="promo-form__button"
          :disabled="!checkAgreement || loading"
          @click="submit"
        />
      </div>
      <div class="promo-form__agreement">
        <ACheckbox v-model="checkAgreement" :label-text="checkAgreementText" box-position="left" />
      </div>
      <div v-if="validFlag" class="promo-form__errors">
        <ul class="promo-form__list">
          <template v-for="(error, index) in errors" :key="index">
            <li v-if="error.value" class="promo-form__list-item">
              {{ error.message }}
            </li>
          </template>
        </ul>
      </div>
      <div v-if="isError" class="promo-form__errors">
        <ul class="promo-form__list">
          <li class="promo-form__list-item">
            {{ globalError }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useTimeoutFn } from '@vueuse/core';
import AInputPromo from '~/components/_ui/a-input-promo.vue';
import AButton from '~/components/_ui/a-button.vue';
import ACheckbox from '~/components/_ui/a-checkbox.vue';
const props = defineProps({
  sent: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isError: {
    type: Boolean,
    default: true,
  },
  errorMessage: {
    type: String,
    default: 'Произошла ошибка. Попробуйте оставить заявку позднее.',
  },
  errorMessage: {
    type: String,
    default: 'Произошла ошибка. Попробуйте оставить заявку позднее.',
  },
});

const formData = reactive({
  phone: '+7 (',
});

const errors = reactive({
  phone: {
    value: false,
    message: 'Необходимо заполнить поле Телефон',
  },
});

const globalError = computed(() => props.errorMessage);

const validFlag = ref(false);
const isSubmitted = ref(false);

const checkedValidateError = () => {
  errors.phone.value = !/^(\+7|7|8)?[\s\-]?\(?[0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/i.test(
    formData.phone,
  );

  return errors.phone.value;
};

const handleInput = (event) => {
  if (event.target.value.length < 4) {
    formData.phone = '+7 (';
  }
};

const emit = defineEmits(['on-submit', 'close']);

const { start: startCloseTimer } = useTimeoutFn(
  () => {
    emit('close');
  },
  4000,
  { immediate: false },
);

watch(
  () => props.sent,
  (newVal) => {
    if (newVal) {
      startCloseTimer();
    }
  },
);

const submit = () => {
  validFlag.value = checkedValidateError();

  if (!validFlag.value) {
    emit('on-submit', formData);
  } else {
    isSubmitted.value = true;
  }
};

const checkAgreement = ref(false);
const checkAgreementText = ref(
  `Даю согласие на обработку персональных данных,
  согласен на получение информационных сообщений и соглашаюсь с
  <a href="/files/privacy_policy.pdf" target="_blank">Политикой конфиденциальности</a>`,
);
</script>

<style lang="scss">
.promo-form {
  position: relative;
  padding: to-rem(24) to-rem(16) to-rem(218);
  color: var(--base-white);
  background-color: var(--base-blue-light);
  border-radius: to-rem(16);
  overflow: hidden;

  @media (min-width: 767px) {
    padding: to-rem(40) to-rem(32) to-rem(64);
  }

  &__decor {
    position: absolute;
    bottom: 0;
    background-repeat: no-repeat;
    pointer-events: none;

    &--mobile {
      left: 50%;
      transform: translateX(-50%);
      background-position: center bottom;

      @media (min-width: 767px) {
        display: none;
      }
    }

    &--tablet {
      right: 0;
      background-position: right bottom;

      @media (max-width: 766px) {
        display: none;
      }

      @media (min-width: 1024px) {
        display: none;
      }
    }

    &--desktop {
      right: 0;
      background-position: right bottom;

      @media (max-width: 1023px) {
        display: none;
      }

      @media (min-width: 1024px) and (max-width: 1439px) {
        right: -12%;
      }
    }
  }

  &__row {
    @media (min-width: 1024px) {
      display: flex;
      flex-direction: row;
    }
  }

  &__title {
    margin-bottom: to-rem(8);
    font-size: to-rem(32);
    font-weight: 700;
    line-height: to-rem(40);
  }

  &__description {
    margin-bottom: to-rem(32);
    font-size: to-rem(16);
    line-height: to-rem(24);
  }

  &__input {
    margin-bottom: to-rem(16);

    @media (min-width: 767px) {
      max-width: to-rem(323);
    }

    @media (min-width: 1024px) {
      margin-right: to-rem(30);
      margin-bottom: 0;
    }
  }

  &__button {
    width: 100%;

    @media (min-width: 767px) {
      max-width: to-rem(259);
    }
  }

  &__agreement {
    max-width: 100%;
    margin-top: to-rem(16);

    @media (min-width: 767px) {
      max-width: to-rem(323);
    }

    @media (min-width: 1024px) {
      max-width: to-rem(612);
    }
  }

  &__errors {
    max-width: to-rem(613);
    margin-top: to-rem(24);
    padding: to-rem(12);
    border: to-rem(1) dashed var(--base-white);
    border-radius: var(--border-radius-x1);
  }

  &__list {
    color: var(--base-white);
    font-size: to-rem(12);

    &-item {
      margin-bottom: to-rem(4);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.promo-container {
  position: relative;
  margin-bottom: 2px;

  margin-bottom: 16px;

  @media (min-width: 767px) {
    max-width: 323px;
  }

  @media (min-width: 1024px) {
    margin-right: 30px;
    margin-bottom: 0;
  }
}

.promo-label-container {
  position: absolute;
  top: 8px;
  left: 16px;
  display: inline-block;

  line-height: 11px;
  margin-bottom: 2px;
}

.promo-label-wrapper {
  font-size: 12px !important;
  color: #8997ab !important;
  font-weight: 700 !important;
  line-height: inherit !important;
  margin-bottom: 0 !important;
}

.promo-input {
  width: 100% !important;
  border: 0 !important;
  font-weight: 700 !important;
  line-height: normal !important;
  border-radius: 8px !important;
  padding: 28px 16px 16px !important;

  &:focus-visible {
    outline: none !important;
  }
}
</style>
