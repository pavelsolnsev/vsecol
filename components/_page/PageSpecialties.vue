<template>
  <PPage css-class="specialties">
    <ABreadcrumb :items="breadcrumbs" class="mb-8" />
    <ATitle tag="h1" class="mb-8">{{ title }}</ATitle>

    <ATitle tag="h2" class="mb-6">Специальности {{ pageTitleGenitive }} по уровням</ATitle>

    <div v-if="levels?.length" class="p-specialties__list mb-8">
      <div v-for="(level, index) in levels" :key="index" class="p-specialties__list-item">
        <CardSpeciality :name="level.name" :slug="level.slug" :code="level.middle_code" type="level" />
      </div>
    </div>

    <ATitle tag="h2" class="mb-6">Специальности {{ pageTitleGenitive }} по направлениям</ATitle>

    <div v-if="groups?.length" class="p-specialties__list">
      <div v-for="(group, index) in groups" :key="index" class="p-specialties__list-item">
        <CardSpeciality :name="group.name" :code="group.code" type="direction" />
      </div>
    </div>
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';
import ATitle from '~/components/_ui/a-title.vue';
import CardSpeciality from '~/components/CardSpeciality.vue';
import { useFilterStore } from '~/store/filter';

const storeFilter = useFilterStore();

// Используем новый composable для навигации
const { isVuz, pageTitleGenitive, getSpecialtiesBreadcrumbs, getPageTitle } = usePageNavigation();

const title = computed(() => getPageTitle('specialties'));
const breadcrumbs = computed(() => getSpecialtiesBreadcrumbs());

// Загружаем уровни с API, если ещё не загружены
await storeFilter.fetchLevels();

const { data: groups, error } = await $fetch('/api/okso6Group2/', {
  params: {
    perPage: 99,
    in_university: isVuz.value || undefined,
    in_college: !isVuz.value || undefined,
    orderBy: 'code',
  },
});

if (error) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found specialties',
    fatal: true,
  });
}

const levels = ref(isVuz.value ? storeFilter.levelsUniversity : storeFilter.levelsCollege);

useSeoMeta({
  description: isVuz.value
    ? 'Демо: справочник специальностей ВО (ОКСО).'
    : 'Демо: справочник специальностей СПО (ОКСО).',
});
</script>

<style lang="scss">
.p-specialties {
  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: to-rem(12);

    &-item {
      width: 100%;

      @media (min-width: 767px) {
        width: calc(33.333% - 8px);
      }

      @media (min-width: 1024px) {
        width: calc(25% - 9px);
      }
    }

    &--levels & {
      &-item {
        @media (min-width: 768px) {
          width: calc(25% - 12px);
          margin-left: to-rem(6);
          margin-right: to-rem(6);
          margin-bottom: to-rem(12);
        }
      }
    }
  }
}
</style>