<template>
  <div class="quiz-stretch">
    <div class="quiz-stretch__container l-wide">
      <div class="quiz-stretch__content">
        <!-- step yes -->
        <div v-if="currentStep === 1" class="quiz-stretch__step">
          <div class="quiz-stretch__title">Подобрать программу обучения</div>
          <AButton block class="quiz-stretch__button" @click="nextStep">Да</AButton>
        </div>
        <!-- step city -->
        <div v-else-if="currentStep === 2" class="quiz-stretch__step">
          <ATitle class="quiz-stretch__title">Выберите ваш город</ATitle>
          <ASelectCity
            v-model="currentCity"
            placeholder="Выберите город"
            :options="cities"
            item-text="name"
            item-value="id"
            with-search
            search-placeholder="Введите город"
            :loading="cityIsLoading"
            class="quiz-stretch__select"
            @on-input="debouncedFetch"
            @update:model-value="nextStep"
          />
        </div>
        <!-- steps questions -->
        <div v-if="currentStep > 2 && currentStep <= steps - 2" class="quiz-stretch__step">
          <template v-for="(question, index) in questions" :key="question.id">
            <div v-if="index + 3 === currentStep">
              <ATitle class="quiz-stretch__title">{{ question.content }}</ATitle>
              <div class="quiz-stretch__answers">
                <ul class="quiz-stretch__options">
                  <li
                    v-for="(answer, answerIndex) in question.answers"
                    :key="answerIndex"
                    class="quiz-stretch__option"
                    @click="
                      saveAnswer({
                        index: index,
                        question: question.content,
                        answerId: answer.id,
                        answer: answer.content,
                      })
                    "
                  >
                    <div class="quiz-stretch__text">
                      <div
                        class="quiz-stretch__text-circle"
                        :class="{ selected: !!answers.find((a) => a.answerId === answer.id) }"
                      ></div>
                      <div class="quiz-stretch__text-value">{{ answer.content }}</div>
                    </div>
                  </li>
                </ul>
                <span class="quiz-stretch__back" @click="prevStep">Назад</span>
              </div>
            </div>

            <!-- <div v-if="index + 3 === currentStep">
              <ATitle class="quiz-stretch__title">{{ question.content }}</ATitle>
              <div class="quiz-stretch__answers">
                <ul class="quiz-stretch__options">
                  <li v-for="(answer, answerIndex) in question.answers" :key="answerIndex" class="quiz-stretch__option">
                    <ARadio
                      v-model="answers[answerIndex]"
                      :value="answer"
                      :label="answer.content"
                      @update:model-value="nextStep"
                    />
                  </li>
                </ul>
                <span class="quiz-stretch__back" @click="prevStep">Назад</span>
              </div>
            </div> -->
          </template>
        </div>

        <!-- steps lead -->
        <div v-if="currentStep === steps - 1" class="quiz-stretch__step">
          <ATitle class="quiz-stretch__title">Введите ваш номер телефона</ATitle>
          <div class="quiz-stretch__lead">
            <div class="quiz-stretch__form">
              <div class="quiz-stretch__row">
                <AInput
                  v-model="formData.phone"
                  v-maska
                  mask
                  data-maska="['+7 (###) ###-##-##']"
                  border-radius="8px"
                  size="large"
                  block
                  @keyup="handleInput"
                />
              </div>

              <div class="quiz-stretch__row">
                <AButton
                  class="quiz-stretch__button"
                  label="Отправить"
                  size="large"
                  block
                  :disabled="!checkAgreement || !validFlag || isLoading"
                  @click="sendLead"
                />
              </div>
              <div class="quiz-stretch__row">
                <ACheckbox
                  v-model="checkAgreement"
                  :label-text="checkAgreementText"
                  box-position="left"
                  class="quiz-stretch__agreement"
                />
              </div>
            </div>
            <span class="quiz-stretch__back" @click="prevStep('lead')">Назад</span>
          </div>
          <div v-if="isError" class="quiz-stretch__error">
            {{ globalError }}
          </div>
        </div>

        <!-- steps thanks -->
        <MThanks v-if="currentStep === steps" />
      </div>
    </div>
  </div>
</template>

<script setup>
import AButton from '~/components/_ui/a-button.vue';
import ATitle from '~/components/_ui/a-title.vue';
import ASelectCity from '~/components/_ui/a-select-city.vue';
import ACheckbox from '~/components/_ui/a-checkbox.vue';
import AInput from '~/components/_ui/a-input.vue';
import { useApiQuizDataList } from '~/composables/api/useApiQuizData';
import { useTimeoutFn } from '@vueuse/core';
import MThanks from '~/components/_ui/m-thanks.vue';

const emit = defineEmits(['reset']);

const pageAbsoluteUrl = useAbsolutePageUrl();
const ymReach = useYmReachGoal();
const app = getCurrentInstance();
const storeInfo = useInfoStore();
const { isCrawler } = useDevice();

const fetchCities = async (cityName) => {
  try {
    const result = await $fetch(`/api/cities`, {
      params: {
        with: 'subject',
        perPage: 16,
        orderBy: 'sort',
        name: cityName ? cityName : undefined,
      },
    });

    if (!result?.data?.length) {
      return [];
    }

    return result.data.map((city) => ({
      name: city.name,
      slug: city.slug,
      subject: city.subject,
    }));
  } catch (error) {
    console.error(error);
  }
};

const quizParams = computed(() => ({
  count_views: !isCrawler,
  cid: storeInfo.cid,
}));

const quizQuery = useApiQuizDataList(quizParams);
await quizQuery.suspense();

const quizData = computed(() => quizQuery.data.value?.data);

const currentCity = ref('');
const cities = ref((await fetchCities()) || []);
const cityIsLoading = ref(false);
const questions = ref(quizData.value?.quiz?.questions || []);
const currentStep = ref(1);
const steps = ref(questions.value.length + 4);

let answers = reactive([]);

const saveAnswer = (value) => {
  const findIndex = answers.findIndex((a) => a.index === value.index);

  if (findIndex === -1) {
    answers.push(value);
  } else {
    answers.splice(findIndex, 1, value);
  }

  nextStep();
};

const content = computed(() => {
  let result = [];
  result.push(`Город: ${currentCity.value.name}, `);

  answers.forEach((item) => {
    result += item.question + ': ' + item.answer + ', ';
  });

  return result;
});

const debouncedFetch = useDebounce(async (newValue) => {
  cityIsLoading.value = true;
  cities.value = await fetchCities(newValue);
  cityIsLoading.value = false;
}, 1000);

const sendClick = async () => {
  try {
    await $fetch('/api/clicks', {
      method: 'POST',
      params: {
        entity_type: 'Quiz',
        entity_id: quizData.value?.quiz?.id,
        cid: storeInfo.cid,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const nextStep = () => {
  if (currentStep.value < steps.value) {
    currentStep.value++;

    sendClick();

    ymReach('quiz_cities');
  }
};

const prevStep = (param) => {
  if (param === 'lead') validFlag.value = false;
  if (currentStep.value !== 0 && currentStep.value > 0) currentStep.value--;
};

const isError = ref(false);
const isSubmitted = ref(false);
const checkAgreement = ref(false);
const isLoading = ref(false);
const globalError = ref('Произошла ошибка. Попробуйте оставить заявку позднее.');
const checkAgreementText = ref(
  `Даю согласие на обработку персональных данных,
  согласен на получение информационных сообщений и соглашаюсь с
  <a href="/files/privacy_policy.pdf" target="_blank">Политикой конфиденциальности</a>`,
);
const formData = reactive({
  name: '',
  phone: '+7 (',
  content: '',
});

const handleInput = (event) => {
  if (event.target.value.length < 4) {
    formData.phone = '+7 (';
  }
};

const device = app.appContext.config.globalProperties.$device;

const leadDevice = computed(() =>
  Object.keys(device)
    .filter((key) => device[key] === true)
    .toString(),
);

const validFlag = ref(false);

const errors = reactive({
  phone: {
    value: false,
    message: 'Необходимо заполнить поле Телефон',
  },
});

const checkedValidateError = () => {
  //errors.name.value = /^([A-ZА-ЯЁ][-,a-z, a-яё. ']+[ ]*)+$/i.test(name.value) && name.value !== '';
  errors.phone.value = /^(\+7|7|8)?[\s\-]?\(?[0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/i.test(
    formData.phone,
  );

  return errors.phone.value;
};

const { start: startResetTimer } = useTimeoutFn(
  () => {
    reset();
  },
  4000,
  { immediate: false },
);

const sendLead = async () => {
  isLoading.value = true;

  validFlag.value = checkedValidateError();

  try {
    const quiz = await $fetch(`/api/quizData/${quizData.value?.quiz?.id}`, {
      method: 'PUT',
      params: {
        ...formData,
        url: pageAbsoluteUrl.value,
        ...{ cid: storeInfo.currentCID, device: leadDevice.value, utm_medium: 'quiz_footer' },
      },
    });

    ymReach('quiz_send');

    if (quiz.data?.success) {
      nextStep();
      isError.value = false;
      isSubmitted.value = true;
      isLoading.value = false;
      ymReach('quiz_success');
      startResetTimer();
    } else {
      isSubmitted.value = false;
      isError.value = true;
      globalError.value = 'Произошла ошибка. Попробуйте оставить заявку позднее.';
    }
  } catch (error) {
    console.error(error);
    if (error?.statusCode === 429) {
      isError.value = true;
      globalError.value = 'Лимит исчерпан. Попробуйте оставить заявку завтра.';
    }
  }
};

const reset = async () => {
  currentStep.value = 1;
  currentCity.value = '';

  answers = [];
  cities.value = await fetchCities();
  emit('reset');
};

watch(
  () => formData.phone,
  () => {
    validFlag.value = checkedValidateError();
  },
);

watch(
  () => content.value,
  (newValue) => {
    formData.content = newValue;
  },
);
</script>

<style lang="scss">
.quiz-stretch {
  padding-top: to-rem(20);
  padding-bottom: to-rem(20);
  background-color: #0941ac;

  @media (min-width: 1024px) {
    padding-top: to-rem(44);
    padding-bottom: to-rem(44);
  }

  &__title {
    margin-bottom: to-rem(16);
    font-weight: 700;
    font-size: to-rem(28);
    line-height: to-rem(32);

    @media (min-width: 768px) {
      font-size: to-rem(32);
      line-height: to-rem(40);
    }
  }

  &__select {
    max-width: to-rem(840);
  }

  &__button {
    max-width: to-rem(356);
  }

  &__content {
    padding: to-rem(16);
    border-radius: to-rem(8);
    background-color: #fff;

    @media (min-width: 1024px) {
      padding: to-rem(24);
    }
  }

  &__answers {
    display: flex;
    align-items: flex-end;
  }

  &__options {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: to-rem(40);

    @media (min-width: 1024px) {
      flex-direction: row;
    }
  }

  &__option {
    flex-basis: calc(100% / 3);
  }

  &__back {
    margin-left: to-rem(40);
    color: #727272;
    font-size: to-rem(16);
    line-height: to-rem(24);
    font-weight: bold;
    cursor: pointer;

    @media (min-width: 1024px) {
      font-size: to-rem(24);
      line-height: to-rem(32);
    }
  }

  &__lead {
    display: flex;
    align-items: flex-end;
  }

  &__form {
    flex: 1;
    display: flex;
    gap: to-rem(16);
    flex-direction: column;

    @media (min-width: 1024px) {
      flex-direction: row;
      gap: to-rem(24);
    }
  }

  &__row {
    flex-basis: calc(100% / 3);
  }

  &__agreement.a-checkbox {
    color: #727272;
    a {
      color: #0941ac;
    }
  }

  &__thanks {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__error {
    margin-top: to-rem(16);
    padding: to-rem(12);
    border: to-rem(1) dashed var(--additional-red);
    border-radius: to-rem(4);
    color: var(--additional-red);
    font-size: to-rem(12);
  }

  &__error {
    margin-top: to-rem(16);
    padding: to-rem(12);
    border: to-rem(1) dashed var(--additional-red);
    border-radius: to-rem(4);
    color: var(--additional-red);
    font-size: to-rem(12);
  }

  &__text {
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    &-value {
      flex: 1;
    }

    &-circle {
      width: to-rem(18);
      height: to-rem(18);
      margin-right: to-rem(12);
      border-radius: to-rem(18);
      border: to-rem(2) solid #727272;

      &.selected {
        border: to-rem(2) solid #0941ac;
        position: relative;

        &::before {
          position: absolute;
          left: to-rem(1);
          top: to-rem(1);
          content: '';
          width: to-rem(12);
          height: to-rem(12);
          border-radius: 100%;
          background-color: #0941ac;
        }
      }
    }

    &-text {
      font-size: to-rem(16);
    }
  }
}
</style>
