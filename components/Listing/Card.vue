<template>
  <div class="card-listing" :class="classes">
    <div class="card-listing__container">
      <div class="card-listing__topline">
        <div class="card-listing__topline__part">
          <p class="card-listing__type">
            {{ !storeFilter.hasCity ? cityName + ' / ' : '' }}{{ institutionType }} /
            {{ institutionSubtype }}
          </p>
        </div>
        <div v-if="variant" class="card-listing__topline__part">
          <div class="card-listing__tag">
            Реклама
            <Advert class="s-advert__icon" />
          </div>
        </div>
      </div>

      <NuxtLink :to="computedPath" class="card-listing__link">
        <ATitle tag="h2" class="card-listing__name">
          {{ name }}
        </ATitle>
      </NuxtLink>

      <div class="card-listing__about">
        <div class="card-listing__about__part">
          <ul class="card-listing__info">
            <li class="card-listing__info__item">
              {{ type === 'university' ? 'Средний балл ЕГЭ бюджет:' : 'Средний балл аттестата бюджет:' }}
              <strong>{{ pointBudget }}</strong>
            </li>
            <li class="card-listing__info__item">
              {{ type === 'university' ? 'Средний балл ЕГЭ платное:' : 'Средний балл аттестата платное:' }}
              <strong>{{ pointPay }}</strong>
            </li>
            <li class="card-listing__info__item">
              Специальности: <strong>{{ specCount || '-' }}</strong>
            </li>
            <li v-if="false" class="card-listing__info__item">
              Рейтинг: <strong>{{ rating?.value5 || '-' }}</strong>
            </li>
          </ul>
        </div>
        <div class="card-listing__about__part card-listing__about__part--right">
          <ul class="card-listing__approve">
            <li class="card-listing__approve__item">
              <HexagonPositive class="card-listing__approve__icon" />
              Лицензия
            </li>
            <li class="card-listing__approve__item">
              <component
                :is="hasAccreditation ? 'HexagonPositive' : 'HexagonNegative'"
                class="card-listing__approve__icon"
              />
              Аккредитован
            </li>
          </ul>
          <p v-if="metro" class="card-listing__location">
            <Metro class="card-listing__location__icon" /> {{ metro.name }}
          </p>
        </div>
      </div>

      <div class="card-listing__actions">
        <AButton size="small" variant="outline-blue" class="card-listing__actions-button" @click="handleCheck"
          >Проверить</AButton
        >
        <AButton size="small" class="card-listing__actions-button" @click="handlerAdmission">Поступить</AButton>
      </div>
    </div>
  </div>

  <ClientOnly>
    <Teleport to="body">
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
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import MThanks from '~/components/_ui/m-thanks.vue';
import ATitle from '~/components/_ui/a-title.vue';
import AButton from '~/components/_ui/a-button.vue';
import AModal from '~/components/_ui/a-modal.vue';
import FormLead from '~/components/Form/Lead.vue';
import Advert from '~/components/_icons/Advert.vue';
import HexagonPositive from '~/components/_icons/HexagonPositive.vue';
import Metro from '~/components/_icons/Metro.vue';
import { useTimeoutFn } from '@vueuse/core';
import { useFilterStore } from '~/store/filter';
import { useAuthStore } from '~/store/auth';
import { useDeviceStore } from '~/store/device';
import { DEMO_UTM_SOURCE } from '~/shared/constants';

const props = defineProps({
  id: {
    type: [String, Number],
    default: '',
  },

  type: {
    type: String,
    default: '',
  },

  typeName: {
    type: String,
    default: '',
  },

  cityId: {
    type: [String, Number],
    default: '',
  },

  cityName: {
    type: String,
    default: '',
  },

  name: {
    type: String,
    default: '',
  },

  approve: {
    type: Array,
    default: () => {
      [];
    },
  },

  metro: {
    type: [Object, String],
    default: null,
  },

  variant: {
    type: Boolean,
    default: false,
  },

  slug: {
    type: String,
    default: '',
  },

  pointBudget: {
    type: [String, Number],
    default: '',
  },

  pointPay: {
    type: [String, Number],
    default: '',
  },

  hasLicense: {
    type: Boolean,
    default: false,
  },

  hasAccreditation: {
    type: Boolean,
    default: false,
  },

  parent: {
    type: Object,
    default: () => {
      return {};
    },
  },

  hasParent: {
    type: Boolean,
    default: false,
  },

  isState: {
    type: Boolean,
    default: false,
  },

  citySlug: {
    type: String,
    default: '',
  },

  subjectSlug: {
    type: String,
    default: '',
  },

  specCount: {
    type: [String, Number],
    default: '',
  },

  rating: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const route = useRoute();
const pageAbsoluteUrl = useAbsolutePageUrl();
const ymReach = useYmReachGoal();
const { registrationSource, election } = storeToRefs(useAuthStore());
const storeInfo = useInfoStore();
const storeFilter = useFilterStore();
const storeDevice = useDeviceStore();

const app = getCurrentInstance();
const device = app.appContext.config.globalProperties.$device;

const leadDevice = computed(() =>
  Object.keys(device)
    .filter((key) => device[key] === true)
    .toString(),
);

const computedPath = computed(() => `/org/${props.type}_${props.id}/`);
const institutionType = computed(() => (props.isState ? 'Государственный' : 'Негосударственный'));
const institutionSubtype = computed(() => {
  return props.hasParent
    ? props.cityId === props.parent?.city_id
      ? 'Структурное подразделение'
      : 'Филиал'
    : props.type === 'university'
    ? 'Головной вуз'
    : 'Головной колледж';
});

const classes = computed(() => ({
  [`card-listing--adv`]: props.variant,
}));

const handleCheck = async () => {
  ymReach('listing_check');

  election.value = {
    id: props.id,
    name: props.name,
  };

  registrationSource.value = {
    form_type: 'check',
    organization_name: props.name,
    answers: undefined,
    url: window.location.href,
    city: storeFilter.city?.name || storeFilter.subjectName || 'Россия',
  };

  await navigateTo('/check/');
};

const modalLead = ref(false);
const modalTitle = ref(`Поступить в ${props.typeName.toLowerCase()}`);
const isSent = ref(false);
const isLoading = ref(false);
const isError = ref(false);
const leadErrorMessage = ref('Произошла ошибка. Попробуйте оставить заявку позднее.');

const { start: startCloseTimer, stop: stopCloseModal } = useTimeoutFn(
  () => {
    modalLead.value = false;
    modalTitle.value = 'Подобрать программу';
    isSent.value = false;
  },
  4000,
  { immediate: false },
);

const modalClosed = () => {
  stopCloseModal();
  modalTitle.value = 'Подобрать программу';
  isSent.value = false;
};

onUnmounted(() => {
  stopCloseModal();
});

const handlerAdmission = () => {
  ymReach('listing_enroll_start');
  modalLead.value = !modalLead.value;
};

const sendData = async (event) => {
  isLoading.value = true;
  try {
    const utms = {
      utm_source: DEMO_UTM_SOURCE,
      utm_campaign: props.type === 'university' ? 'vuz' : 'college',
      utm_term: 'card',
    };

    const params = new URLSearchParams(utms).toString();

    const result = await $fetch(`/api/leads/?${params}`, {
      method: 'POST',
      params: {
        entity_type: 'Organization',
        entity_id: props.id,
        url: pageAbsoluteUrl.value,
        name: event.name,
        phone: event.phone,
        cid: storeInfo.cid,
        content: 'Организация: ' + props.name + ', Город: ' + props.cityName,
        device: leadDevice.value,
      },
    });

    ymReach('listing_enroll_send');

    if (result.data?.success) {
      isLoading.value = false;
      isSent.value = true;
      isError.value = false;
      modalTitle.value = null;

      ymReach('isting_enroll_success');

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
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss">
.card-listing {
  &__link {
    &:hover {
      color: var(--base-blue);
    }
  }

  &__topline {
    display: flex;
    justify-content: space-between;

    &__part {
      &--adv {
        margin-left: to-rem(8);
      }
    }
  }

  &__tag {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    color: var(--base-black);
    font-size: to-rem(14);

    svg {
      margin-left: to-rem(4);
    }
  }

  &__type {
    color: var(--base-gray);
    font-size: to-rem(14);
    line-height: to-rem(18);

    @media (min-width: 767px) {
      margin-bottom: to-rem(4);
    }
  }

  &__name {
    margin-bottom: to-rem(24);
  }

  &__about {
    display: flex;
    flex-direction: column;
    margin-bottom: to-rem(16);

    @media (min-width: 767px) {
      flex-direction: row;
      align-items: flex-start;
      margin-bottom: to-rem(8);
    }

    @media (min-width: 1024px) {
      margin-bottom: to-rem(24);
    }

    &__part {
      &--right {
        @media (min-width: 767px) {
          margin-left: to-rem(96);
        }
      }
    }
  }

  &__info {
    margin-bottom: to-rem(16);

    @media (min-width: 767px) {
      margin-bottom: to-rem(8);
    }

    @media (min-width: 1024px) {
      margin-bottom: to-rem(16);
    }

    &__item {
      margin-bottom: to-rem(8);
      line-height: to-rem(24);

      @media (min-width: 767px) {
        margin-bottom: to-rem(16);
      }

      &:last-child {
        margin-bottom: 0;
      }

      strong {
        font-weight: 600;
      }
    }
  }

  &__approve {
    display: flex;
    flex-flow: column wrap;

    &__item {
      display: flex;
      align-items: center;
      margin-bottom: to-rem(8);

      @media (min-width: 767px) {
        margin-bottom: to-rem(16);
      }

      &:last-child {
        margin-right: 0;
      }
    }

    &__icon {
      display: inline-block;
      width: to-rem(24);
      height: to-rem(24);
      margin-right: to-rem(8);
    }
  }

  &__location {
    display: flex;
    align-items: center;

    &__icon {
      display: inline-block;
      width: to-rem(24);
      height: to-rem(24);
      margin-right: to-rem(8);
    }
  }

  &__marker {
    color: var(--base-blue);
    font-size: to-rem(16);
    line-height: to-rem(24);
  }

  &--link {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  &__actions {
    display: flex;
    gap: to-rem(12);

    &-button {
      width: to-rem(160);

      @media (min-width: 767px) {
        width: fit-content;
      }
    }
  }
}
</style>
