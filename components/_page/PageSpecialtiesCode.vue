<template>
  <PPage css-class="specialties-code">
    <ABreadcrumb :items="breadcrumbs" class="mb-8" />
    <ATitle tag="h1" class="mb-6">{{ title }}</ATitle>

    <div class="p-specialties-code__subtitle mb-14">
      <div class="p-specialties-code__subtitle-item">
        <span class="p-specialties-code__subtitle-name">Укрупненная группа:</span>&nbsp;<nuxt-link
          :to="`/${currentPath}/specialties/group_${specialityData?.group?.code}`"
          >{{ specialityData?.group?.name }}</nuxt-link
        >
      </div>
      <div class="p-specialties-code__subtitle-item">
        <span class="p-specialties-code__subtitle-name">Код направления:</span> {{ specialityData?.code }}
      </div>
    </div>

    <ATitle tag="h2" class="mb-8">База поступления</ATitle>

    <ul class="p-specialties-code__tags">
      <li v-for="(tag, index) in tags" :key="index" class="p-specialties-code__tags-item">
        <component :is="tag.value ? 'HexagonPositive' : 'HexagonNegative'" class="p-specialties-code__tags-icon" />
        {{ tag.text }}
      </li>
    </ul>

    <div v-if="specialityData?.level" class="p-specialties-code__term mb-14">
      <div class="p-specialties-code__term-title">
        <span class="p-specialties-code__term-name">Срок обучения:</span>&nbsp;
        <strong class="p-specialties-code__term-duration">~ {{ studyDuration }}</strong>
      </div>
      <div class="p-specialties-code__note">*Зависит от формы обучения и базового образования</div>
    </div>

    <ATitle v-if="specialityData?.about" tag="h2" class="mb-8">Описание</ATitle>

    <div v-if="specialityData?.about" class="p-specialties-code__decription mb-18">
      <!-- eslint-disable vue/no-v-html -->
      <div
        ref="desc"
        class="p-specialties-code__decription-text"
        :class="{ 'p-specialties-code__decription-text--active': toggle }"
        v-html="specialityData?.about"
      />
      <span
        class="p-specialties-code__decription-toggle"
        :class="{ 'p-specialties-code__decription-toggle--active': toggle }"
        @click="toggle = !toggle"
        >{{ toggle ? 'Свернуть' : 'Развернуть' }}
      </span>
    </div>

    <div class="p-specialties-code__where">
      <ATitle tag="h2" class="mb-8">{{ titleWhere }}</ATitle>

      <ul class="subject-list mb-12">
        <li class="subject-list__item">
          <nuxt-link :to="`/${currentPath}/spec_${routeParamsId}/`" class="subject-list__link">Вузы России</nuxt-link
          >&nbsp;
          <span class="subject-list__element">({{ getOrgCount() }})</span>
        </li>
        <template v-if="sortedSubjects?.length">
          <li v-for="(subject, index) in sortedSubjects" :key="index" class="subject-list__item">
            <template v-if="subject.slug === 'moskva' || subject.slug === 'sankt-peterburg'">
              <nuxt-link
                :to="`/${currentPath}/city_${subject.slug}/spec_${routeParamsId}/`"
                class="subject-list__link"
                >{{ subject.name }}</nuxt-link
              >&nbsp;
              <span class="subject-list__element">({{ getSubjectOrgCount(subject.id) }})</span>
            </template>
            <template v-else>
              <nuxt-link
                :to="`/${currentPath}/subject_${subject.slug}/spec_${routeParamsId}/`"
                class="subject-list__link"
                >{{ subject.name }}</nuxt-link
              >&nbsp; <span class="subject-list__element">({{ getSubjectOrgCount(subject.id) }})</span>,
            </template>

            <template v-for="(city, citiesIndex) in getCitiesBySubjectId(subject.id)" :key="citiesIndex">
              <template v-if="city.slug !== 'moskva' && city.slug !== 'sankt-peterburg'">
                <nuxt-link
                  :to="`/${currentPath}/subject_${subject.slug}/city_${city.slug}/spec_${routeParamsId}/`"
                  class="subject-list__link subject-list__link--small"
                  >{{ city.name }}</nuxt-link
                >&nbsp;<span class="subject-list__element--small">({{ getCityOrgCount(city.id) }})</span
                ><template v-if="citiesIndex !== getCitiesBySubjectId(subject.id).length - 1">, </template>
              </template>
            </template>
          </li>
        </template>
      </ul>
    </div>
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';
import ATitle from '~/components/_ui/a-title.vue';
import HexagonPositive from '~/components/_icons/HexagonPositive.vue';
import HexagonNegative from '~/components/_icons/HexagonNegative.vue';
import { useFilterStore } from '~/store/filter';

const route = useRoute();
const storeFilter = useFilterStore();

// Используем новый composable для навигации
const { isVuz, routeSegment, getSpecialtiesBreadcrumbs, pageTitleGenitive } = usePageNavigation();

const isUniversity = isVuz;
const currentPath = routeSegment;

defineProps({
  type: {
    type: String,
    required: true,
  },
});

const toggle = ref(false);
const routeParamsId = route.params.id;

if (!route.params.id) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Speciality Code Not Found',
    fatal: true,
  });
}

const { data: specialityData } = await $fetch(`/api/okso${routeParamsId.length <= 6 ? 3 : 6}ByCode/${routeParamsId}`, {
  params: {
    with: 'level,group,subject_organization_counts,city_organization_counts',
    use_about: true,
  },
});

if (!specialityData) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Speciality Not Found',
    fatal: true,
  });
}

const isCodeExist = computed(() =>
  isUniversity.value ? specialityData?.level.in_university : specialityData?.level.in_college,
);

if (!isCodeExist.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Code Does Not Exist',
    fatal: true,
  });
}

const breadcrumbs = computed(() =>
  getSpecialtiesBreadcrumbs({
    title: `${specialityData?.level ? specialityData?.level.name : ''} «${specialityData?.name}»`,
    path: ``,
  }),
);

const title = computed(() => `${specialityData.level ? specialityData?.level.name : ''} «${specialityData?.name}»`);
const studyDuration = computed(() => (specialityData.level ? specialityData?.level.study_duration : ''));
const titleWhere = computed(
  () => `Где учиться на ${specialityData.level ? specialityData?.level.name : ''} «${specialityData?.name}»?`,
);

const specialityLevel = specialityData?.level;

const tags = computed(() =>
  [
    {
      text: 'После 9 классов',
      value: specialityLevel?.nine_classes,
    },
    {
      text: 'После 11 классов',
      value: specialityLevel?.eleven_classes,
    },
    {
      text: 'После колледжа',
      value: specialityLevel?.after_college,
    },
    {
      text: 'После бакалавриата',
      value: specialityLevel?.after_bachelor,
    },
    {
      text: 'После специалитета',
      value: specialityLevel?.after_specialty,
    },
    {
      text: 'После магистратуры',
      value: specialityLevel?.after_magistracy,
    },
    {
      text: 'После аспирантуры',
      value: specialityLevel?.after_graduate_school,
    },
  ].filter((i) => i.value),
);

const subjectIds = specialityData?.subject_organization_counts
  .filter((i) => i.organization_count > 0)
  .map((item) => item.subject_id);

const subjects = storeFilter.subjects
  .filter((subject) => subjectIds && subjectIds.includes(subject.id))
  .sort((a, b) => (a.name > b.name ? 1 : -1));

const fSubject = subjects.filter((item) => item.id === 77);
const sSubject = subjects.filter((item) => item.id === 78);

const sortedSubjects = [...fSubject, ...sSubject, ...subjects.filter((item) => item.id !== 77 && item.id !== 78)];

const summarize = (acc, item) => {
  return acc + item.organization_count;
};

const getOrgCount = () => {
  return specialityData?.city_organization_counts.reduce(summarize, 0);
};

const getSubjectOrgCount = (subject_id) => {
  return specialityData?.subject_organization_counts.find((i) => i.subject_id === subject_id)?.organization_count;
};

const cityIds = specialityData?.city_organization_counts
  .filter((i) => i.organization_count > 0)
  .map((item) => item.city_id);

const cities = await $fetch('/api/cities', {
  params: {
    with: 'subject',
    orderBy: 'sort',
    id: cityIds && cityIds.join(','),
    perPage: 'all',
  },
});

const getCitiesBySubjectId = (id) => {
  return cities.data?.length ? cities.data.filter((city) => city.subject?.id === id) : [];
};

const getCityOrgCount = (city_id) => {
  return specialityData?.city_organization_counts.find((i) => i.city_id === city_id)?.organization_count;
};

const metaTitle = computed(
  () =>
    `${specialityData?.name} (${specialityData?.code}${
      specialityData?.level ? ', ' + specialityData?.level.name.toLowerCase() : ''
    })`,
);

const metaDescription = computed(
  () =>
    `${specialityData?.name} (${specialityData?.code}${
      specialityData?.level ? ', ' + specialityData?.level.name : ''
    }), список городов России ${useCurrentYear()}, в которых есть ${pageTitleGenitive.value} с данной специальностью`,
);

useSeoMeta({
  title: metaTitle.value,
  description: metaDescription.value,
});
</script>

<style lang="scss">
.p-specialties-code {
  &__tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: to-rem(32);

    @media (min-width: 767px) {
      margin-bottom: to-rem(16);
    }

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

  &__subtitle {
    &-item {
      margin-bottom: to-rem(8);
    }

    &-name {
      color: var(--base-gray);
    }
  }

  &__term {
    &-title {
      font-size: to-rem(18);
      line-height: to-rem(26);
      margin-bottom: to-rem(8);
    }

    &-name {
      color: var(--base-gray);
    }

    &-duration {
      font-weight: 700;
    }
  }

  &__note {
    font-size: to-rem(12);
  }

  &__where {
    padding: to-rem(16) to-rem(24);
    background-color: var(--base-gray-smoky);

    margin-left: to-rem(-20);
    margin-right: to-rem(-20);

    @media (min-width: 767px) {
      margin-left: to-rem(-40);
      margin-right: to-rem(-40);
    }

    @media (min-width: 1024px) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  &__decription {
    position: relative;

    &-text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;

      &--active {
        display: block;
        -webkit-line-clamp: none;
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
}

.subject-list {
  &__item {
    margin-bottom: to-rem(12);
    position: relative;
    padding-left: to-rem(26);

    &::before {
      content: '';
      width: to-rem(18);
      height: to-rem(2);
      background-color: var(--base-black);
      position: absolute;
      left: 0;
      top: to-rem(14);
    }
  }

  &__element {
    font-size: to-rem(22);
    line-height: to-rem(30);
    margin-bottom: to-rem(12);

    &--first {
      font-size: to-rem(26);
      line-height: to-rem(34);
    }

    &--small {
      font-size: to-rem(16);
      line-height: to-rem(24);
    }
  }

  &__link {
    color: var(--base-blue);
    font-size: to-rem(22);
    line-height: to-rem(30);

    &--first {
      font-size: to-rem(26);
      line-height: to-rem(34);
    }

    &--small {
      font-size: to-rem(16);
      line-height: to-rem(24);
    }
  }
}
</style>