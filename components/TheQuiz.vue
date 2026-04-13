<template>
  <div class="quiz">
    <template v-if="currentStep === 1">
      <div class="quiz-block quiz-start">
        <div class="quiz-block__title">Подобрать программу обучения в городе</div>
        <div class="quiz-block__row">
          <AInput v-model="searchCity" size="large" placeholder="Выберите город" block @input="debouncedFetch" />
        </div>
        <div class="quiz-block__options">
          <ARadioGroup
            v-model="currentCity"
            :options="cities"
            name="cityOptions"
            trigger-position="left"
            block
            @update:model-value="nextStep"
          />
        </div>
      </div>
    </template>

    <template v-if="currentStep > 1 && currentStep <= questions.length + 1">
      <template v-for="(question, index) in questions" :key="question.id">
        <div v-if="index === currentStep - 2" class="quiz-block quiz-questions">
          <h3 class="quiz-block__title">{{ question.content }}</h3>
          <div class="quiz-block__list">
            <ul class="quiz-block__options" :class="{ 'quiz-block__options--steps': currentStep > 1 }">
              <li v-for="(answer, answerIndex) in questions[currentStep - 2].answers" :key="answerIndex">
                <ARadio
                  v-model="answers[currentStep - 2]"
                  :value="answer"
                  :label="answer.content"
                  @update:model-value="nextStep"
                />
              </li>
            </ul>
          </div>
        </div>
      </template>
    </template>
    <template v-if="currentStep === questions.length + 2">
      <div class="quiz-block">
        <h3 class="quiz-block__title">
          <span>Оставить</span>
          заявку
        </h3>

        <div class="quiz-block__form">
          <div v-if="false">
            <AInput
              v-model="formData.name"
              v-maska
              mask
              data-maska="HHHHHHHHHHHHHHHHHHHH"
              data-maska-tokens="H:[a-zA-ZА-ЯЁa-яё]"
              label="Имя"
            />
          </div>
          <div class="quiz-block__row">
            <AInput
              v-model="formData.phone"
              v-maska
              mask
              label="Номер телефона"
              data-maska="['+7 (###) ###-##-##']"
              border-radius="8px"
              size="large"
              block
              @keyup="handleInput"
            />
          </div>
          <div class="quiz-block__row">
            <ACheckbox
              v-model="checkAgreement"
              :label-text="checkAgreementText"
              box-position="left"
              class="quiz-block__agreement"
            />
          </div>
          <div class="quiz-block__row">
            <AButton
              class="quiz-block__button"
              label="Отправить"
              size="large"
              block
              :disabled="!checkAgreement || !validFlag || isLoading"
              @click="sendLead"
            />
          </div>
        </div>

        <div v-if="!validFlag && isSubmitted" class="quiz__errors">
          <ul class="quiz__list">
            <template v-for="(error, index) in errors" :key="index">
              <li v-if="!error.value" class="quiz__list-item">
                {{ error.message }}
              </li>
            </template>
          </ul>
        </div>
        <div v-if="isError" class="quiz__errors">
          <ul class="quiz__list">
            <li class="quiz__list-item">
              {{ globalError }}
            </li>
          </ul>
        </div>
      </div>
    </template>

    <MThanks v-if="currentStep === questions.length + 3" />

    <div v-if="currentStep <= questions.length + 2" class="quiz-progress">
      <AProgress :model-value="currentStep" :steps="questions.length + 2" @update:model-value="goToStep" />
    </div>
  </div>
</template>

<script setup>
import { useTimeoutFn } from '@vueuse/core';
import { useInfoStore } from '~/store/info';
import AInput from '~/components/_ui/a-input.vue';
import ARadioGroup from '~/components/_ui/a-radio-group.vue';
import ARadio from '~/components/_ui/a-radio.vue';
import ACheckbox from '~/components/_ui/a-checkbox.vue';
import AButton from '~/components/_ui/a-button.vue';
import AProgress from '~/components/_ui/a-progress.vue';
import MThanks from '~/components/_ui/m-thanks.vue';


defineProps({
  orientation: {
    type: String,
    default: 'vertical',
  },
  sticky: {
    type: Boolean,
    default: true,
  },
});

const storeInfo = useInfoStore();
const { isCrawler } = useDevice();
const route = useRoute();
const pageAbsoluteUrl = useAbsolutePageUrl();
const ymReach = useYmReachGoal();
const app = getCurrentInstance();
//const yandexMetrika = app.appContext.config.globalProperties.$metrika;
const device = app.appContext.config.globalProperties.$device;

const emit = defineEmits(['send']);

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

const searchCity = ref('');
const currentCity = ref(null);
const cities = ref((await fetchCities()) || []);
const cityIsLoading = ref(false);

const debouncedFetch = useDebounce(async (newValue) => {
  cityIsLoading.value = true;
  cities.value = await fetchCities(newValue.target.value);
  cityIsLoading.value = false;
}, 1000);

const currentStep = ref(1);

const { data: quizData } = await $fetch('/api/quizData/list_item', {
  params: {
    count_views: !isCrawler,
    cid: storeInfo.cid,
  },
});

const questions = ref(quizData?.quiz?.questions || []);
const answers = ref([]);

const content = computed(() => {
  let result = [];
  if (currentCity.value?.name) {
    result.push(`Город: ${currentCity.value.name}, `);
  }
  questions.value.forEach((item, index) => {
    if (answers.value[index]?.content) {
      result += item.content + ': ' + answers.value[index].content + ', ';
    }
  });

  return result;
});

const isError = ref(false);
const isSubmitted = ref(false);

const formData = reactive({
  name: '',
  phone: '+7 (',
  content: '',
});

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

const checkAgreement = ref(false);
const checkAgreementText = ref(
  `Даю согласие на обработку персональных данных,
  согласен на получение информационных сообщений и соглашаюсь с
  <a href="/files/privacy_policy.pdf" target="_blank">Политикой конфиденциальности</a>`,
);

const nextStep = () => {
  if (currentStep.value >= questions.length + 2) return;

  if (currentStep.value === 1) {
    sendClick();
    ymReach('quiz_cities');
  }

  currentStep.value += 1;
};

const goToStep = (step) => {
  if (step >= 1 && step <= questions.value.length + 2) {
    currentStep.value = step;
  }
};

const isLoading = ref(false);

const leadDevice = computed(() =>
  Object.keys(device)
    .filter((key) => device[key] === true)
    .toString(),
);

const { start: startCloseTimer } = useTimeoutFn(
  () => {
    emit('send');
  },
  4000,
  { immediate: false },
);

const sendLead = async () => {
  isLoading.value = true;

  validFlag.value = checkedValidateError();

  try {
    const quiz = await $fetch(`/api/quizData/${quizData.quiz.id}`, {
      method: 'PUT',
      params: {
        ...formData,
        url: pageAbsoluteUrl.value,
        ...{ cid: storeInfo.currentCID, device: leadDevice.value, utm_medium: 'quiz_header' },
      },
    });

    ymReach('quiz_send');

    if (quiz.data?.success) {
      nextStep();
      isError.value = false;
      isSubmitted.value = true;
      ymReach('quiz_success');
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
  } finally {
    startCloseTimer();
  }
};

const handleInput = (event) => {
  if (event.target.value.length < 4) {
    formData.phone = '+7 (';
  }
};

const sendClick = async () => {
  try {
    await $fetch('/api/clicks', {
      method: 'POST',
      params: {
        entity_type: 'Quiz',
        entity_id: quizData.quiz.id,
        cid: storeInfo.cid,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

watch(
  () => route.path,
  (newRoute) => {
    if (newRoute) {
      currentStep.value = 1;
      currentCity.value = null;
      searchCity.value = '';
      answers.value = [];
      formData.name = '';
      formData.content = '';
      formData.phone = '+7 (';
    }
  },
);

const validFlag = ref(false);

const errors = reactive({
  phone: {
    value: false,
    message: 'Необходимо заполнить поле Телефон',
  },
});

const globalError = ref('Произошла ошибка. Попробуйте оставить заявку позднее.');

const checkedValidateError = () => {
  //errors.name.value = /^([A-ZА-ЯЁ][-,a-z, a-яё. ']+[ ]*)+$/i.test(name.value) && name.value !== '';
  errors.phone.value = /^(\+7|7|8)?[\s\-]?\(?[0-9][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/i.test(
    formData.phone,
  );

  return errors.phone.value;
};
</script>

<style lang="scss">
.quiz {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;

  &__decor {
    position: absolute;
    right: 0;
    bottom: 0;
    width: to-rem(276);
    height: to-rem(216);

    @media (min-width: 1024px) {
      display: block;
    }

    @media (max-width: 1023px) {
      display: none;
    }
  }

  &-progress {
    max-width: to-rem(390);
    height: to-rem(72);
  }

  &-block {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    flex: 1;

    &__title {
      margin-right: to-rem(2);
      margin-bottom: to-rem(32);
      font-size: to-rem(24);
      font-weight: 700;
      line-height: to-rem(32);

      @media (min-width: 767px) {
        font-size: to-rem(32);
        line-height: to-rem(40);
      }
    }

    &__row {
      margin-bottom: to-rem(24);
    }

    &__options {
      @include block-scroll;

      position: relative;
      z-index: 1;
      overflow-y: auto;
      flex: 1;
      min-height: to-rem(200);
      max-height: calc(90vh - 334px);
      margin-bottom: to-rem(24);
    }

    &__agreement {
      color: var(--base-gray) !important;
      font-size: to-rem(16);
    }
  }

  &__errors {
    max-width: to-rem(613);
    margin-top: to-rem(24);
    padding: to-rem(12);
    border: to-rem(1) dashed var(--additional-red);
    border-radius: to-rem(4);
  }

  &__list {
    color: var(--additional-red);
    font-size: to-rem(12);

    &-item {
      margin-bottom: to-rem(4);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
