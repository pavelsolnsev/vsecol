<template>
  <PPage v-if="orgParams" css-class="organization">
        <ABreadcrumb :items="breadcrumbs" class="mb-8" />
        <ATitle tag="h1" class="mb-4">{{ title }}</ATitle>

    <ul v-if="tags?.length" class="p-organization__tags">
      <li v-for="tag in tags" :key="tag?.value" class="p-organization__tags-item">
        <component :is="tag?.value ? HexagonPositive : HexagonNegative" class="p-organization__tags-icon" />
        {{ tag.text }}
      </li>
    </ul>

    <ul class="p-organization__nav mb-12">
      <li class="p-organization__nav-item">
        <NuxtLink
          :to="`/org/${type}_${currentId}/`"
          class="p-organization__nav-link"
          trailing-slash="append"
          :class="[{ 'p-organization__nav-link--active': route.name !== `org-${type}_id` }]"
          >{{ orgData.short_name }}</NuxtLink
        >
      </li>
      <li v-if="storeApi.organizationSpecs?.length">
        <NuxtLink
          :to="`/org/${type}_${currentId}/specs/`"
          trailing-slash="append"
          class="p-organization__nav-link"
          :class="[{ 'p-organization__nav-link--active': route.name === `org-${type}_id` }]"
          >Специальности</NuxtLink
        >
      </li>
      <li>
        <AButton variant="outline-blue" label="Проверить" size="large" block @click="handleCheck">
          <template #preppend>
            <ToCheckBlue />
          </template>
        </AButton>
      </li>
      <li>
        <AButton variant="outline-red" label="Поступить" size="large" block @click="handlerAdmission">
          <template #preppend>
            <ToEnrollRed />
          </template>
        </AButton>
      </li>
    </ul>

    <slot />
  </PPage>

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
import PPage from '~/components/_ui/p-page.vue';
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';
import ATitle from '~/components/_ui/a-title.vue';
import AButton from '~/components/_ui/a-button.vue';
import AModal from '~/components/_ui/a-modal.vue';
import HexagonPositive from '~/components/_icons/HexagonPositive.vue';
import HexagonNegative from '~/components/_icons/HexagonNegative.vue';
import ToCheckBlue from '~/components/_icons/ToCheckBlue.vue';
import ToEnrollRed from '~/components/_icons/ToEnrollRed.vue';
import FormLead from '~/components/Form/Lead.vue';
import { useTimeoutFn } from '@vueuse/core';
import { useInfoStore } from '~/store/info';
import { useApiStore } from '~/store/api';
import { useFilterStore } from '~/store/filter';
import { useDeviceStore } from '~/store/device';
import { useAuthStore } from '~/store/auth';
import { useApiOrganizationsById } from '~/composables/api/useApiOrganizationsById';
import { useApiLevelsByOrganization } from '~/composables/api/useApiLevelsByOrganization';
import { useApiSpecsByOrganization } from '~/composables/api/useApiSpecsByOrganization';
import { DEMO_UTM_SOURCE } from '~/shared/constants';

const props = defineProps({
  type: {
    type: String,
    default: 'university',
  },
});

const route = useRoute();
const storeApi = useApiStore();
const storeInfo = useInfoStore();
const storeDevice = useDeviceStore();
const storeFilter = useFilterStore();
const { isCrawler } = useDevice();
const app = getCurrentInstance();
const device = app.appContext.config.globalProperties.$device;

const { registrationSource, election } = storeToRefs(useAuthStore());

const pageAbsoluteUrl = useAbsolutePageUrl();
const ymReach = useYmReachGoal();

const leadDevice = computed(() =>
  Object.keys(device)
    .filter((key) => device[key] === true)
    .toString(),
);

const currentId = route.params.id;

// Устанавливаем orgType для страниц организаций (включая специальности)
watch(
  () => props.type,
  (newType) => {
    storeInfo.orgType = newType;
  },
  { immediate: true },
);

if (!currentId) {
  throw createError({
    statusCode: 404,
    statusMessage: 'currentType or currentId Not Found',
    fatal: true,
  });
}

const orgParams = computed(() => ({
  // eslint-disable-next-line max-len
  with: 'parent,children,subject,city,metro,accreditations,monitorings,licenses',
  type: props.type || undefined,
  cid: storeInfo.cid,
  count_views: !isCrawler,
  is_active: true,
}));

const orgQuery = useApiOrganizationsById(currentId, orgParams);
const orgData = orgQuery.data;
await orgQuery.suspense();

if (!orgData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Organization not found',
    fatal: true,
  });
}

// Computed для orgId - используется в queries
const orgId = computed(() => orgData.value?.id);

// Запросы уровней и специальностей
const levelsQuery = useApiLevelsByOrganization(orgId, { enabled: computed(() => !!orgData.value?.id) });
const specsQuery = useApiSpecsByOrganization(orgId, { enabled: computed(() => !!orgData.value?.id) });
await levelsQuery.suspense();
await specsQuery.suspense();
const title = computed(() => {
  if (!orgData.value) return '';
  if (route.params?.specSlug){
    return storeApi.organizationLevels.find((l) =>
    l?.slug === route.params?.specSlug)?.name + ' / ' + orgData.value?.name;
  }
  return route?.name === `org-${orgData.value.type}_id-specs` ? 'Специальности / ' + orgData.value?.name
   : orgData.value?.name;
});

const breadcrumbs = computed(() => {
  if (!orgData.value) return [];

  const breads = [
    {
      title: 'Главная',
      path: '/',
    },
    {
      title: `${orgData.value.type === 'university' ? 'Вузы' : 'Колледжи'} России`,
      path: `/${orgData.value.type === 'university' ? 'vuz' : 'kolledzh'}/`,
    },
  ];

  const isMoscowOrSpb =
    orgData.value.subject?.id === 77 || orgData.value.subject?.id === 78;
  const typePath = orgData.value.type === 'university' ? 'vuz' : 'kolledzh';

  if (!isMoscowOrSpb) {
    breads.push({
      title: `${orgData.value?.subject?.name}`,
      path: `/${typePath}/subject_${orgData.value?.subject?.slug}/`,
    });
  }

  const typeLabel = orgData.value.type === 'university' ? 'Вузы' : 'Колледжи';
  const cityLabel = orgData.value?.city?.name_variations?.p_roditelny;
  const cityLabelMoscow = orgData.value?.city?.name_variations.p_roditelny;

  if (!isMoscowOrSpb) {
    breads.push({
      title: `${typeLabel} ${cityLabel}`,
      path: `/${typePath}/subject_${orgData.value?.subject?.slug}/city_${orgData.value?.city?.slug}/`,
    });
  } else {
    breads.push({
      title: `${typeLabel} ${cityLabelMoscow}`,
      path: `/${typePath}/city_${orgData.value?.city?.slug}/`,
    });
  }

  breads.push({
    title: `${orgData.value.short_name}`,
    path: '',
  });

  return breads;
});

const tags = computed(() => {
  if (!orgData.value) return [];

  const t = [
    {
      text: 'Государственный',
      value: orgData.value.is_state,
    },
    {
      text: 'Бюджетные места',
      value: orgData.value.is_budget,
    },
  ];

  if (orgData.value.type === 'college') {
    t.push({
      text: 'При вузе',
      value: orgData.value.at_vuz,
    });
  }

  if (orgData.value.type === 'university') {
    t.push({
      text: 'С военной кафедрой',
      value: orgData.value.has_military,
    });
  }

  t.push(
    {
      text: 'С общежитием',
      value: orgData.value.has_hostel,
    },
    {
      text: 'Дистанционный',
      value: !!orgData.value.has_distance,
    },
  );

  return t.filter((tag) => tag.value);
});

const modalLead = ref(false);
const modalTitle = ref(orgData.value?.type_name ? `Поступить в ${orgData.value.type_name.toLowerCase()}` : '');
const isSent = ref(false);
const isLoading = ref(false);
const isError = ref(false);
const leadErrorMessage = ref('Произошла ошибка. Попробуйте оставить заявку позднее.');

const modalClosed = () => {
  stopCloseModal();
  modalTitle.value = 'Подобрать программу';
  isSent.value = false;
};

const { start: startCloseModal, stop: stopCloseModal } = useTimeoutFn(
  () => {
    modalLead.value = false;
    modalClosed();
  },
  4000,
  { immediate: false },
);

onUnmounted(() => {
  stopCloseModal();
});

const handlerAdmission = () => {
  modalLead.value = !modalLead.value;
  ymReach('card_start');
};

const sendData = async (event) => {
  if (!orgData.value) return;

  isLoading.value = true;

  try {
    const utms = {
      utm_source: DEMO_UTM_SOURCE,
      utm_campaign: orgData.value.type === 'university' ? 'vuz' : 'college',
      utm_term: 'card',
    };

    const params = new URLSearchParams(utms).toString();

    const result = await $fetch(`/api/leads/?${params}`, {
      method: 'POST',
      params: {
        entity_type: 'Organization',
        entity_id: orgData.value.id,
        url: pageAbsoluteUrl.value,
        name: event?.name,
        phone: event.phone,
        cid: storeInfo.cid,
        content: 'Организация: ' + orgData?.name + ', Город: ' + orgData.city?.name,
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

      startCloseModal();
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

const handleCheck = async () => {
  if (!orgData.value) return;

  ymReach('card_check');

  election.value = {
    id: orgData.value.id,
    name: orgData.value.name,
  };

  registrationSource.value = {
    form_type: 'check',
    organization_name: orgData.value.name,
    answers: undefined,
    url: window.location.href,
    city: orgData.value?.city?.name || storeFilter.city?.name || storeFilter.subjectName || 'Россия',
  };

  await navigateTo('/check/');
};

// meta
const metaTitle = computed(
  () =>
    orgData.value
      ? `${orgData.value.short_name}, ${orgData.value.name} — демо-карточка`
      : '',
);
const metaDescription = computed(() => {
  if (!orgData.value) return '';
  const city = orgData.value.city?.name || '';
  const y = useCurrentYear();
  return `Демо: карточка организации ${orgData.value.short_name}, ${city} (${y}).`;
});

useSeoMeta({
  title: metaTitle,
  description: metaDescription,
});
</script>

<style lang="scss">
.p-organization {
  &__markers {
    padding-top: to-rem(5);
    max-width: to-rem(864);
    border-top: to-rem(1) solid #dfdbda;

    &-row {
      gap: to-rem(12);
      display: flex;
      align-items: center;
      border-bottom: to-rem(1) solid #ececee;

      &:last-child {
        border-bottom: 0;
      }
    }

    &-name {
      flex: 1;
    }

    &-mark {
      padding-left: to-rem(16);
      padding-right: to-rem(16);
    }

    &-col {
      padding-top: to-rem(12);
      padding-bottom: to-rem(12);
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: to-rem(32);
    gap: to-rem(16);
    flex-direction: column;

    @media (min-width: 767px) {
      flex-direction: row;
    }

    &-icon {
      width: to-rem(24);
      height: to-rem(24);
      margin-right: to-rem(6);
    }

    &-item {
      display: flex;
      align-items: center;
    }
  }

  &__nav {
    width: 100%;
    padding: to-rem(6);
    gap: to-rem(10);
    display: inline-flex;
    border-radius: to-rem(8);
    background-color: #f6f6f7;
    flex-direction: column;

    @media (min-width: 767px) {
      width: fit-content;
      align-items: center;
      flex-direction: row;
    }

    &-link {
      border-radius: to-rem(4);
      height: to-rem(56);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 to-rem(16);
      color: #fff;
      background-color: #0941ac;

      &--active {
        color: #2c2c2c;
        background-color: #fff;
      }
    }
  }

  &__contacts {
    font-size: to-rem(14);
    margin-bottom: to-rem(40);

    @media (min-width: 1440px) {
      margin-bottom: to-rem(48);
    }

    &-title {
      margin-bottom: to-rem(32);
    }

    &-address {
      margin-bottom: to-rem(24);
    }
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    &-item {
      margin-bottom: to-rem(16);
      margin-right: to-rem(24);
      display: flex;
      align-items: center;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  &__icon {
    width: to-rem(18);
    height: to-rem(18);
    margin-right: to-rem(8);
  }

  &__connect {
    &:last-child {
      margin-bottom: 0;
    }

    &-title {
      color: var(--base-gray);
      margin-bottom: to-rem(8);
    }
  }

  &__about {
    position: relative;
    margin-bottom: to-rem(40);

    @media (min-width: 1440px) {
      margin-bottom: to-rem(72);
    }
  }

  &__description {
    &-text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;

      &--active {
        display: block;
        -webkit-line-clamp: none;
      }

      h1,
      h2,
      h3 {
        color: var(---base-black-light);
        font-weight: 700;
        margin-bottom: 1em;
      }

      h1 {
        font-size: to-rem(28);
        line-height: to-rem(32);

        @media (min-width: 767px) {
          font-size: to-rem(32);
          line-height: to-rem(40);
        }
      }

      h2 {
        font-size: to-rem(20);
        line-height: to-rem(24);

        @media (min-width: 767px) {
          font-size: to-rem(24);
          line-height: to-rem(32);
        }
      }

      h3 {
        font-size: to-rem(18);
        line-height: to-rem(22);

        @media (min-width: 767px) {
          font-size: to-rem(18);
          line-height: to-rem(22);
        }
      }

      p {
        margin-bottom: 1em;
      }

      ul,
      ol {
        padding-left: to-rem(28);
        margin-bottom: to-rem(12);
      }

      li {
        margin-bottom: to-rem(4);
      }

      h3 {
        font-size: to-rem(18);
        line-height: to-rem(22);
        font-weight: 700;
        margin-bottom: var(--a-margin-x4);
      }

      p {
        margin-bottom: 1em;
      }
    }

    &-toggle {
      font-size: to-rem(14);
      color: var(--base-blue);
      position: absolute;
      left: 0;
      bottom: to-rem(-32);
      cursor: pointer;

      &::before {
        content: '';
        position: absolute;
        right: 0;
      }

      &::before {
        top: to-rem(6);
        right: to-rem(-14);
        background-repeat: no-repeat;
        background-image: url('~/assets/icons/toggle.svg');
        width: to-rem(10);
        height: to-rem(10);
      }

      &--active {
        &::before {
          top: to-rem(2);
          transform: rotate(180deg);
        }
      }
    }
  }

  &__menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
}

.parent {
  margin-bottom: to-rem(40);

  @media (min-width: 1440px) {
    margin-bottom: to-rem(48);
  }

  &__link {
    color: var(--base-blue);
    font-size: to-rem(14);
  }
}

.branch {
  margin-bottom: to-rem(40);

  @media (min-width: 1440px) {
    margin-bottom: to-rem(48);
  }

  &__link {
    display: block;
    color: var(--base-blue);
    font-size: to-rem(14);
    margin-bottom: to-rem(8);
  }
}
</style>
