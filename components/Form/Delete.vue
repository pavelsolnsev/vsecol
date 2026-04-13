<template>
  <form v-if="!isSmsSent" class="login-form" @submit.prevent="sendCode">
    <div class="login-form__title">Вы уверены, что хотите удалить аккаунт?</div>
    <div class="login-form__row">
      <AButton
        type="submit"
        aria-label="Получить sms код"
        label="Да, получить код"
        size="xlarge"
        :disabled="!checkAgreement"
        block
        class="mb-3"
      />
    </div>
    <div class="login-form__agreement">
      <ACheckbox v-model="checkAgreement" :label-text="checkAgreementText" box-position="left" type="secondary" />
    </div>
  </form>
  <div v-else class="login-form">
    <div class="login-form__title">Введите код из СМС</div>
    <div class="login-form__description">Отправили на {{ formData.phone }}</div>
    <div class="login-form__row">
      <AOtp v-model="code" :is-error="isError" @on-complete="handleOnComplete" />
    </div>
    <div v-if="time > 0" class="login-form__timer">
      Через {{ useConvertSecondToTime(time) }} код можно получить повторно
    </div>
    <div class="login-form__resend">
      <AButton
        type="submit"
        aria-label="Запросить код повторно"
        label="Запросить код повторно"
        size="xlarge"
        block
        :disabled="!!time"
        @click="sendCode"
      />
    </div>
  </div>
</template>

<script setup>
import AButton from '~/components/_ui/a-button.vue';
import ACheckbox from '~/components/_ui/a-checkbox.vue';
import AOtp from '~/components/_ui/a-otp.vue';
import { useAuthStore } from '~/store/auth';
import { useInfoStore } from '~/store/info';
import { useQueryClient } from '@tanstack/vue-query';
import { useToken } from '@/composables/useToken';

const RESEND_INTERVAL = 120;

const storeAuth = useAuthStore();
const storeInfo = useInfoStore();
const router = useRouter();
const queryClient = useQueryClient();

const { phoneNumber, profile } = storeToRefs(storeAuth);

const formData = ref({
  phone: phoneNumber.value,
});

const code = ref('');
const isError = ref(false);
const isSmsSent = ref(false);
const validFlag = ref(false);

const checkAgreement = ref(false);
const checkAgreementText = ref(
  // eslint-disable-next-line max-len
  `Даю согласие на обработку персональных данных, согласен на получение информационных сообщений и соглашаюсь с <a href="/files/privacy_policy.pdf" target="_blank" class="link">Политикой конфиденциальности</a>`,
);

let errors = reactive({
  phone: {
    value: false,
    message: 'Необходимо заполнить поле Телефон',
  },
});

const checkedValidateError = () => {
  errors.phone.value = /^(\+7|7|8)?[\s\-]?\(?[0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/i.test(
    formData.value.phone,
  );
  validFlag.value = errors.phone.value;

  return validFlag.value;
};

watch(
  formData.value,
  () => {
    validFlag.value = checkedValidateError();
  },
  { immediate: true },
);

const cleanPhoneNumber = (number) => {
  return number.replace(/\D/g, '');
};

// resend time
const time = ref(RESEND_INTERVAL);
const timerInterval = ref(null);

const incrementTime = () => {
  if (time.value) {
    time.value = parseInt(time.value) - 1;
  } else {
    clearInterval(timerInterval.value);
  }
};

const startInterval = () => {
  timerInterval.value = setInterval(incrementTime, 1000);
};

onBeforeUnmount(() => clearInterval(timerInterval.value));

// send methods
const sendCode = async () => {
  try {
    if (validFlag.value) {
      const { data } = await $fetch('/api/clients/code', {
        method: 'post',
        body: {
          phone: cleanPhoneNumber(formData.value.phone),
          cid: storeInfo.cid,
          action: 'delete',
        },
      });

      if (data?.success) {
        isSmsSent.value = true;
        if (time !== RESEND_INTERVAL) time.value = RESEND_INTERVAL;
        startInterval();
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const { token, clearToken } = useToken();

const handleOnComplete = async () => {
  try {
    const { data } = await $fetch('/api/clients/me', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: {
        phone: cleanPhoneNumber(formData.value.phone),
        password: code.value,
      },
    });

    if (data?.success) {
      clearToken();
      profile.value = null;
      queryClient.clear();
      router.push({ path: '/login' });
    } else {
      isError.value = true;
    }
  } catch (error) {
    isError.value = true;
    // eslint-disable-next-line
    console.error('delete error', error);
  }
};
</script>

<style lang="scss">
.login-form {
  &__title {
    margin-bottom: to-rem(16);
    font-size: to-rem(18);
    font-weight: 700;
  }

  &__description {
    margin-bottom: to-rem(32);
  }

  &__timer {
    margin-top: to-rem(16);
    color: var(--base-gray);
    font-size: to-rem(12);
  }

  &__resend {
    margin-top: to-rem(16);
  }
}
</style>
