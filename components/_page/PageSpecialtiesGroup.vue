<template>
  <PPage css-class="specialties-groups">
    <ABreadcrumb :items="breadcrumbs" class="mb-8" />
    <ATitle tag="h1" class="mb-8">{{ title }}</ATitle>

    <div class="p-specialties-groups__subtitle mb-6">
      <div class="p-specialties-groups__subtitle-item">
        <span class="p-specialties-groups__subtitle-name">Код группы:</span> {{ route.params.id }}
      </div>
    </div>

    <div v-if="description" class="p-specialties-levels__decription mb-18">
      <!-- eslint-disable vue/no-v-html -->
      <div
        ref="desc"
        class="p-specialties-levels__decription-text"
        :class="{ 'p-specialties-levels__decription-text--active': toggle }"
        v-html="description"
      />
      <span
        class="p-specialties-levels__decription-toggle"
        :class="{ 'p-specialties-levels__decription-toggle--active': toggle }"
        @click="toggle = !toggle"
        >{{ toggle ? 'Свернуть' : 'Развернуть' }}
      </span>
    </div>

    <div v-if="specialitiesData && specialitiesData?.length > 0" class="p-specialties-levels__list">
      <CardLevelGroup
        v-for="(item, index) in levels"
        :key="index"
        :title="item.name"
        :specialties="getSpecialitiesByLevelId(item.id)"
        class="p-specialties-levels__list-item"
      />
    </div>
    <div v-else>
      <AAlert type="info">Специальностей в данной группе не найдено.</AAlert>
    </div>
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';
import ATitle from '~/components/_ui/a-title.vue';
import AAlert from '~/components/_ui/a-alert.vue';
import CardLevelGroup from '~/components/CardLevelGroup.vue';
import { useFilterStore } from '~/store/filter';

const route = useRoute();
const storeFilter = useFilterStore();

// Используем новый composable для навигации
const { isVuz, getSpecialtiesBreadcrumbs, pageTitlePrepositional, pageTitleGenitive } = usePageNavigation();

const isUniversity = isVuz;

const toggle = ref(false);

if (!route.params.id) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Speciality Code Not Found',
    fatal: true,
  });
}

// Загружаем уровни с API, если ещё не загружены
await storeFilter.fetchLevels();

const { data: groupData } = await $fetch(`/api${route.params.id.length <= 6 ? '/okso3Group2' : '/okso6Group2'}`, {
  params: {
    code: route.params.id,
  },
});

if (!groupData.length) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Okso Group Not Found',
    fatal: true,
  });
}

const levels = Array.isArray(storeFilter.levels)
  ? storeFilter.levels.filter((i) => (isUniversity.value ? i.in_university : i.in_college))
  : [];
const levelIds = levels.map((item) => item.id);

const groupName = groupData[0].name;
const groupAbout = groupData[0].university_description;
const groupCode = groupData[0].code;

const { data: specialitiesData } = await $fetch(`/api/${route.params.id.length <= 6 ? 'okso3' : 'okso6'}/`, {
  params: {
    with: 'level',
    level_id: levelIds.toString(),
    code: groupCode.split('.')[0],
  },
});

const title = computed(() => `${groupName} в ${pageTitlePrepositional.value} России`);
const description = computed(() => groupAbout);

const breadcrumbs = computed(() =>
  getSpecialtiesBreadcrumbs({
    title: groupName,
    path: ``,
  }),
);

const getSpecialitiesByLevelId = (id) => {
  return specialitiesData?.length ? specialitiesData.filter((spec) => spec.level.id === id) : [];
};

const metaTitle = computed(
  () => `${groupName} в ${pageTitlePrepositional.value} России (ОКСО, код группы ${groupCode})`,
);

const metaDescription = computed(
  () =>
    // eslint-disable-next-line max-len
    `${groupName} (код группы: ${groupCode}), полный список ${useCurrentYear()} лицензированных специальностей ${
      pageTitleGenitive.value
    } России`,
);

useSeoMeta({
  title: metaTitle.value,
  description: metaDescription.value,
});
</script>

<style lang="scss">
.p-specialties-levels {
  &__list {
    &-item {
      margin-bottom: to-rem(16);
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
</style>