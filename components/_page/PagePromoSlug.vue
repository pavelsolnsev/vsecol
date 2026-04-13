<template>
  <PPage css-class="promo">
        <ATitle
          v-if="route.query.spec && !!specQueryData.length"
          tag="h1"
      class="mb-6"
      :class="{ 'p-promo__title--spec': route.query.spec }"
      >{{ specQueryData[0]?.name }} ({{ specQueryData[0]?.level.name || 'Аспирантура' }},
      {{ specQueryData[0]?.code }})</ATitle
    >

    <ATitle v-else tag="h1" class="mb-6">{{ orgData?.organization.name }}</ATitle>

    <p v-if="route.query.spec && !!specQueryData.length" :class="{ 'mb-6': route.query.spec }">
      {{ orgData?.organization.full_name }}
    </p>

    <ul v-if="route.query.spec && !!specQueryData.length" class="p-promo__tags">
      <li v-for="tag in specTags" :key="tag?.value" class="p-promo__tags-item">
        <component
          :is="tag?.value ? HexagonPositive : HexagonNegative"
          class="p-promo__tags-icon"
        />
        {{ tag.text }}
      </li>
    </ul>

    <ul v-else class="p-promo__tags">
      <li v-for="tag in tags" :key="tag?.value" class="p-promo__tags-item">
        <component
          :is="tag?.value ? HexagonPositive : HexagonNegative"
          class="p-promo__tags-icon"
        />
        {{ tag.text }}
      </li>
    </ul>

    <FormPromo
      :sent="isSent"
      :loading="isLoading"
      :is-error="isError"
      class="mb-16"
      @on-submit="sendData"
    />

    <div v-if="orgData?.seo_text" class="p-promo__texts mb-16">{{ orgData?.seo_text }}</div>

    <ATitle v-if="licenses" tag="h2" class="mb-8">Лицензия и аккредитация</ATitle>

    <LicensesList
      v-if="licenses || accreditations"
      :licenses="licensesFiltered"
      :accreditations="accreditationsFiltered"
      has-link
    />

    <template v-if="hasSpecialities || hasSpecialities3">
      <SpecialityList
        :title="`Специальности ${orgData.organization.type === 'university' ? 'вуза' : 'колледжа'}`"
        :spec-names="storeFilter.dictLevels"
        :spec-data="spec"
        :type="orgData.organization.type"
        :subject-slug="subjectSlug"
        :city-slug="citySlug.slug"
      />
      <SpecialityList
        v-if="hasSpecialities3"
        :spec-names="storeFilter.dictLevels"
        :spec-data="spec3"
        :type="orgData.organization.type"
        :subject-slug="subjectSlug"
        :city-slug="citySlug.slug"
      />
    </template>
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ATitle from '~/components/_ui/a-title.vue';
import FormPromo from '~/components/Form/Promo.vue';
import LicensesList from '~/components/LicensesList.vue';
import SpecialityList from '~/components/SpecialityList.vue';
import HexagonPositive from '~/components/_icons/HexagonPositive.vue';
import HexagonNegative from '~/components/_icons/HexagonNegative.vue';
import { useInfoStore } from '~/store/info';
import { useFilterStore } from '~/store/filter';
import { useApiStore } from '~/store/api';
import { useApiPromosBySlug } from '~/composables/api/usePromosBySlug';
import { useApiOkso3, useApiOkso6 } from '~/composables/api/useApiOksoGroup';
import { DEMO_UTM_SOURCE } from '~/shared/constants';

const route = useRoute();
const pageAbsoluteUrl = useAbsolutePageUrl();
const storeApi = useApiStore();
const storeInfo = useInfoStore();
const storeFilter = useFilterStore();

const app = getCurrentInstance();
const device = app.appContext.config.globalProperties.$device;

const promoQuery = useApiPromosBySlug(route.params.slug);
await promoQuery.suspense();

const orgData = ref(storeApi.promoData);

if (!orgData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Org Not Found',
    fatal: true,
  });
}

// Загружаем уровни с API, если ещё не загружены
await storeFilter.fetchLevels();

const citySlug = await storeFilter.fetchCityById(orgData.value.organization.city_id);
const subjectSlug = storeFilter.findSubjectById(orgData.value.organization.subject_id).slug;
const licenses = orgData.value?.organization.licenses;

const licensesFiltered = computed(() => {
  if (!licenses || !licenses.length) return {};
  return licenses.reduce(function (sum, current) {
    return sum > current ? sum : current;
  }, {});
});

const accreditations = orgData.value?.organization.accreditations;

const accreditationsFiltered = computed(() => {
  if (!accreditations || !accreditations.length) return {};
  return accreditations.reduce(function (sum, current) {
    return sum > current ? sum : current;
  }, {});
});

const spec = (orgData && licenses && licenses[0]?.okso6s) || [];
const spec3 = (orgData && licenses && licenses[0]?.okso3s) || [];

const hasSpecialities = computed(
  () => !!spec.filter((license) => storeFilter.levels.some((l) => l.id === license.level?.id)).length,
);

const hasSpecialities3 = computed(
  () => !!spec3.filter((license) => storeFilter.levels.some((l) => l.id === license.level?.id)).length,
);

const specTags = computed(() => {
  const t = [
    {
      text: 'Все формы обучения',
      value: true,
      show: true,
    },
    {
      text: 'Идет прием',
      value: true,
      show: true,
    },
  ];

  if (orgData.value.organization.accreditations.length) {
    t.unshift(
      {
        text: 'Специальность аккредитована',
        value: true,
        show: true,
      },
      {
        text: 'Государственный диплом',
        value: true,
        show: true,
      },
      {
        text: 'Отсрочка от армии',
        value: true,
        show: true,
      },
    );
  }

  return t;
});

const tags = computed(() => {
  const t = [];

  if (orgData.value.organization.type === 'college') {
    if (orgData.value.organization.parent_id) {
      t.push({
        text: 'При вузе',
        value: true,
        show: true,
      });
    }
  }

  storeFilter.levels.forEach((element) => {
    if (hasSpeciality(element.id)) {
      t.push({
        text: element.name,
        value: true,
        show: true,
      });
    }
  });

  if (orgData.value.organization.has_distance) {
    t.push({
      text: 'Все формы обучения',
      value: true,
      show: true,
    });
  }

  return t;
});

const hasSpeciality = (id) => {
  return (
    orgData &&
    licenses.filter((license) =>
      license.okso6s.find((okso) => okso.level?.id === id && !!okso.level[`in_${orgData.value.organization.type}`]),
    ).length
  );
};

const isLoading = ref(false);
const isSent = ref(false);

const leadDevice = computed(() =>
  Object.keys(device)
    .filter((key) => device[key] === true)
    .toString(),
);

const isError = ref(false);

const sendData = async (event) => {
  isLoading.value = true;
  const utms = {
    utm_source: DEMO_UTM_SOURCE,
    utm_campaign: orgData.value.organization.type === 'college' ? 'college' : 'vuz',
    utm_term: orgData.value.slug + '_promo',
  };

  const params = new URLSearchParams(utms).toString();

  const result = await $fetch(`/api/leads/?${params}`, {
    method: 'POST',
    params: {
      entity_type: 'Promo',
      entity_id: orgData.value.id,
      url: pageAbsoluteUrl.value,
      phone: event.phone,
      content: 'Город: ' + citySlug.name,
      cid: storeInfo.currentCID,
      device: leadDevice.value,
      lead_email_to: orgData.value.lead_email_to,
    },
  });

  if (result.data.success) {
    isError.value = false;
    isSent.value = true;
    isLoading.value = false;
  } else {
    isError.value = true;
  }
};

const specCode = computed(() => route.query.spec);
const specCodeType = computed(() => (specCode.value && specCode.value.length > 5 ? 6 : 3));

const specParams = computed(() => ({
  with: 'level',
  code: specCode.value,
}));

// Вызываем оба хука безусловно с опцией enabled
const okso3Query = useApiOkso3(specParams, { enabled: () => specCodeType.value === 3 && !!specCode.value });
const okso6Query = useApiOkso6(specParams, { enabled: () => specCodeType.value === 6 && !!specCode.value });

// Ожидаем выполнение запросов только когда они включены, чтобы избежать зависания SSR
if (specCode.value) {
  if (specCodeType.value === 3) {
    await okso3Query.suspense();
  } else {
    await okso6Query.suspense();
  }
}

const specQueryData = computed(() =>
  specCodeType.value === 3
    ? (okso3Query.data.value?.data || [])
    : (okso6Query.data.value?.data || [])
);

useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

useSeoMeta({
  title: orgData.value.organization.name,
});
</script>

<style lang="scss">
.p-promo {
  &__title {
    &--spec {
      margin-bottom: to-rem(8);
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: to-rem(24);

    &-icon {
      width: to-rem(24);
      height: to-rem(24);
      margin-right: to-rem(6);
    }

    &-item {
      display: flex;
      align-items: center;
      margin-right: to-rem(16);
      margin-bottom: to-rem(16);

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>