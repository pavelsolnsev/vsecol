<template>
  <div class="p-cities">
    <div class="p-cities__container l-wide">
          <ABreadcrumb :items="breadcrumbs" class="mb-8 mt-4" />
          <ATitle tag="h1" class="mb-12">{{ title }}</ATitle>

      <ul v-if="subjects?.length" class="subject-list mb-12">
        <li v-for="(subject, index) in subjects" :key="index" class="subject-list__item">
          <template v-if="subject.slug === 'moskva' || subject.slug === 'sankt-peterburg'">
            <nuxt-link :to="`/${currentPath}/city_${subject.slug}/`" class="subject-list__link">{{
              subject.name
            }}</nuxt-link
            >&nbsp;
            <span class="subject-list__element"
              >({{ isCollege ? subject.college_count : subject.university_count }})</span
            >
          </template>
          <template v-else>
            <nuxt-link :to="`/${currentPath}/subject_${subject.slug}/`" class="subject-list__link">{{
              subject.name
            }}</nuxt-link
            >&nbsp;
            <span class="subject-list__element"
              >({{ isCollege ? subject.college_count : subject.university_count }})</span
            >,
          </template>

          <template v-if="subject.cities?.length">
            <template v-for="(city, citiesIndex) in subject.cities" :key="citiesIndex">
              <template v-if="city.slug !== 'moskva' && city.slug !== 'sankt-peterburg'">
                <nuxt-link
                  :to="`/${currentPath}/subject_${subject.slug}/city_${city.slug}/`"
                  class="subject-list__link subject-list__link--small"
                  >{{ city.name }}</nuxt-link
                >&nbsp;<span class="subject-list__element--small"
                  >({{ isCollege ? city.college_count : city.university_count }})</span
                ><template v-if="citiesIndex !== subject.cities.length - 1">, </template>
              </template>
            </template>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';
import ATitle from '~/components/_ui/a-title.vue';
import { usePageNavigation } from '~/composables/usePageNavigation';
import { useApiSubjects } from '~/composables/api/useApiSubjects';

// Используем новый composable для навигации
const { isVuz, isKolledzh, getCitiesBreadcrumbs, getPageTitle, routeSegment } = usePageNavigation();

const isCollege = isKolledzh;
const isUniversity = isVuz;
const currentPath = routeSegment;

const title = computed(() => getPageTitle('cities'));
const breadcrumbs = computed(() => getCitiesBreadcrumbs());

const subjectsParams = computed(() => ({
  with: 'cities',
  perPage: 100,
  has_colleges: isCollege.value || undefined,
  has_universities: isUniversity.value || undefined,
  orderBy: 'sort',
}));

const subjectsQuery = useApiSubjects(subjectsParams);
await subjectsQuery.suspense();

const subjects = computed(() => subjectsQuery.data.value?.data || []);

useSeoMeta({
  title: 'Вузы по городам (демо)',
  description: 'Демо-список городов для портфолио.',
});
</script>

<style lang="scss" scoped>
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