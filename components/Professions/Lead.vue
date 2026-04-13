<template>
  <div class="prof-lead">
    <swiper-container
      ref="containerRef"
      allow-touch-move="false"
      simulate-touch="false"
      mousewheel="false"
      keyboard="false"
      slides-per-view="auto"
      @swiperslidechange="slideChange"
    >
      <swiper-slide>
        <ATitle tag="h2" class="prof-lead__title"> Подобрать специальность для профессии "{{ name }}" </ATitle>

        <form class="prof-lead__form" @submit.prevent="sendForm">
          <AInput
            v-model="inputData"
            v-maska
            mask
            size="large"
            data-maska="['+7 (###) ###-##-##']"
            name="phone"
            placeholder="Телефон"
            class="prof-lead__input"
            @focus="focusInput"
            @input="changeInput"
          />

          <AButton type="submit" :disabled="inputData?.length !== 18 || !isApprove" class="prof-lead__button">
            Отправить
          </AButton>
        </form>

        <ACheckbox
          v-model="isApprove"
          class="prof-lead__checkbox"
          label-text="Даю согласие на обработку персональных данных, согласен на получение
           информационных сообщений и соглашаюсь с
           <a href='/files/privacy_policy.pdf' target='_blank'>Политикой конфиденциальности</a>"
        />
      </swiper-slide>
      <client-only>
        <swiper-slide>
          <div class="prof-lead__thanks">Спасибо!</div>
          <p class="prof-lead__thanks-desc">Твоя заявка отправлена.</p>
          <p class="prof-lead__thanks-desc">Мы позвоним в ближайшее время.</p>
        </swiper-slide>
      </client-only>
    </swiper-container>
  </div>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import AButton from '~/components/_ui/a-button.vue';
import AInput from '~/components/_ui/a-input.vue';
import ACheckbox from '~/components/_ui/a-checkbox.vue';
import { useApiPostLeads } from '~/composables/api/useApiPostLeads';
import { DEMO_UTM_SOURCE, DEMO_LAND_SLUG } from '~/shared/constants';

const props = defineProps({
  name: { type: String, default: null },
  title: { type: String, default: null },
  id: { type: Number, default: null },
});

const containerRef = ref(null);
const swiper = useSwiper(containerRef);
const storeInfo = useInfoStore();
const DEFAULT_INPUT = '+7 (';
const inputData = ref(null);
const isApprove = ref(false);
const app = getCurrentInstance();
const device = app.appContext.config.globalProperties.$device;

const focusInput = (value) => {
  if (value && !inputData.value) {
    inputData.value = DEFAULT_INPUT;
  }
  if (!value && inputData.value === DEFAULT_INPUT) {
    inputData.value = null;
  }
};

const changeInput = (value) => {
  if (value?.length < 4) {
    inputData.value = DEFAULT_INPUT;
  }
};

const leadDevice = computed(() =>
  Object.keys(device)
    .filter((key) => device[key] === true)
    .toString(),
);

const { mutateAsync: postLead } = useApiPostLeads();
const sendForm = async () => {
  const params = {
    utm_source: DEMO_UTM_SOURCE,
    utm_campaign: undefined,
    utm_term: 'profession',
  };

  await postLead({
    body: {
      entity_type: 'Profession',
      entity_id: props.id,
      url: location.href,
      phone: inputData.value,
      cid: storeInfo.currentCID,
      device: leadDevice.value,
      land: DEMO_LAND_SLUG,
      comment: props.title,
    },
    params,
  });
  swiper.next();
};
</script>

<style lang="scss" scoped>
.prof-lead {
  padding: to-rem(16);
  background-color: var(--base-blue-pale);
  border-radius: var(--border-radius-x3);

  @media (min-width: 768px) {
    padding: to-rem(24);
  }

  &__title {
    margin-bottom: to-rem(24);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: to-rem(8);
    margin-bottom: to-rem(12);

    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr to-rem(199);
    }
  }

  &__input {
    background-color: transparent;

    &:deep(.a-input__container) {
      background-color: var(--base-white);
      border-radius: var(--border-radius-x2);
    }
    &:deep(.a-input__textfield) {
      line-height: to-rem(62);
    }
  }

  &__button {
    border-radius: var(--border-radius-x2);
    height: to-rem(60);
  }

  &__checkbox {
    &:deep(.a-checkbox__box) {
      position: relative;
      top: to-rem(5);
      align-self: flex-start;
    }
    &:deep(.a-checkbox__switch) {
      border-color: var(--base-white) !important;
    }
    &:deep(.a-checkbox__label-text) {
      color: var(--base-gray);
    }
  }

  &__thanks {
    font-weight: 700;
    font-size: to-rem(32);
    line-height: to-rem(38);
    color: var(--base-black);

    &-desc {
      font-size: to-rem(16);
      line-height: to-rem(24);
      font-weight: 500;
      color: var(--base-black);
    }
  }
}
</style>
