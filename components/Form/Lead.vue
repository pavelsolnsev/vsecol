<template>
  <div class="lead-form">
    <MThanks v-if="sent" />

    <MThanks v-if="sent" />

    <template v-else>
      <div class="lead-form__row">
        <AInput
          v-if="false"
          v-model="formData.name"
          v-maska
          mask
          label="Имя"
          data-maska="HHHHHHHHHHHHHHHHHHHH"
          data-maska-tokens="H:[a-zA-ZА-ЯЁa-яё]"
          size="large"
          border-radius="8px"
          block
          class="mb-4"
        />
        <AInput
          v-model="formData.phone"
          v-maska
          mask
          label="Номер телефона"
          data-maska="['+7 (###) ###-##-##']"
          size="large"
          border-radius="8px"
          block
          class="mb-4"
          @keyup="handleInput"
        />
        <AButton
          aria-label="Отправить форму на поступление"
          label="Отправить"
          size="xlarge"
          :disabled="!checkAgreement || loading"
          block
          class="mb-4"
          @click="submit"
        />
      </div>
      <div class="lead-form__agreement">
        <ACheckbox v-model="checkAgreement" :label-text="checkAgreementText" box-position="left" type="secondary" />
      </div>
      <div v-if="validFlag" class="lead-form__errors">
        <ul class="lead-form__list">
          <template v-for="(error, index) in errors" :key="index">
            <li v-if="error.value" class="lead-form__list-item">
              {{ error.message }}
            </li>
          </template>
        </ul>
      </div>
      <div v-if="isError" class="lead-form__errors">
        <ul class="lead-form__list">
          <li class="lead-form__list-item">
            {{ globalError }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup>
import MThanks from '~/components/_ui/m-thanks.vue';
import AInput from '~/components/_ui/a-input.vue';
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
  name: '',
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
  //errors.name.value = /^([A-ZА-ЯЁ][-,a-z, a-яё. ']+[ ]*)+$/i.test(name.value) && name.value !== '';
  errors.phone.value = !/^(\+7|7|8)?[\s\-]?\(?[0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/i.test(
    formData.phone,
  );

  return errors.phone.value;
};

const emit = defineEmits(['on-submit']);

const handleInput = (event) => {
  if (event.target.value.length < 4) {
    formData.phone = '+7 (';
  }
};

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
  `Нажимая на кнопку, я соглашаюсь с
  <a href="/files/privacy_policy.pdf" target="_blank">политикой конфиденциальности</a>  и на получение рассылок`,
);
</script>

<style lang="scss">
.lead-form {
  &__errors {
    padding: to-rem(12);
    margin-top: to-rem(24);
    border-radius: to-rem(4);
    border: to-rem(1) dashed var(--additional-red);
  }

  &__list {
    font-size: to-rem(14);
    color: var(--additional-red);

    &-item {
      margin-bottom: to-rem(4);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
