<!-- eslint-disable vue/no-v-html -->
<template>
  <PPage css-class="specialties-levels">
    <ABreadcrumb :items="breadcrumbs" class="mb-8" />
    <ATitle tag="h1" class="mb-8">{{ title }}</ATitle>

    <ARadioGroup
      v-model="currentLevelItem"
      :options="isUniversity ? storeFilter.levelsUniversity : storeFilter.levelsCollege"
      name="levelOptions"
      variant="filter"
      class="mb-10"
    />

    <div class="p-specialties-levels__decription mb-18">
      <div
        ref="desc"
        class="p-specialties-levels__decription-text"
        :class="{ 'p-specialties-levels__decription-text--active': toggle }"
        v-html="levelAbout"
      />
      <span
        class="p-specialties-levels__decription-toggle"
        :class="{ 'p-specialties-levels__decription-toggle--active': toggle }"
        @click="toggle = !toggle"
        >{{ toggle ? 'Свернуть' : 'Развернуть' }}
      </span>
    </div>

    <div class="p-specialties-levels__block d-flex">
      <div class="p-specialties-levels__col p-specialties-levels__col--left">
        <div v-if="uniqueGroups?.length" class="p-specialties-levels__list">
          <CardLevelGroup
            v-for="(item, index) in uniqueGroups"
            :key="index"
            :title="item.name"
            :specialties="getSpecialitiesByLevelId(item.id)"
            class="p-specialties-levels__list-item"
          />
        </div>
      </div>
    </div>
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';
import ATitle from '~/components/_ui/a-title.vue';
import ARadioGroup from '~/components/_ui/a-radio-group.vue';
import CardLevelGroup from '~/components/CardLevelGroup.vue';
import { useFilterStore } from '~/store/filter';

const route = useRoute();
const router = useRouter();

const storeFilter = useFilterStore();

// Используем новый composable для навигации
const { isVuz, routeSegment, getSpecialtiesBreadcrumbs, pageTitlePrepositional, pageTitleGenitive } =
  usePageNavigation();

const isUniversity = isVuz;
const currentPath = routeSegment;
const currentLevelId = ref(route.params.id);

// Загружаем уровни с API, если ещё не загружены
await storeFilter.fetchLevels();

const currentLevelItem = ref(
  Array.isArray(storeFilter.levels) ? storeFilter.levels.find((level) => level.slug === currentLevelId.value) : null,
);
const currentLevel = computed(() =>
  Array.isArray(storeFilter.levels) ? storeFilter.levels.find((level) => level.slug === currentLevelId.value) : null,
);
const levelAbout = computed(() => currentLevel.value?.about);

const isLevelExist = computed(() =>
  isUniversity.value ? currentLevel.value?.in_university : currentLevel.value?.in_college,
);

if (!isLevelExist.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Level Does Not Exist',
    fatal: true,
  });
}

const title = computed(() => `${currentLevel.value?.name} в ${pageTitlePrepositional.value} России`);
const toggle = ref(false);

const breadcrumbs = computed(() =>
  getSpecialtiesBreadcrumbs({
    title: `${currentLevel.value?.name}`,
    path: ``,
  }),
);

const { data: specialitiesData } = await $fetch(
  `/api/${currentLevelId.value === 'graduate-school' ? 'okso3' : 'okso6'}/`,
  {
    params: {
      with: 'group',
      level_slug: currentLevelId.value,
      perPage: 'all',
      orderBy: 'code',
    },
  },
);

if (!specialitiesData.length) {
  throw createError({
    statusCode: 404,
    statusMessage: '--- Speciality Not Found ---',
    fatal: true,
  });
}

function findUnique(arr, predicate) {
  var found = {};
  arr.forEach((d) => {
    found[predicate(d)] = d;
  });
  return Object.keys(found).map((key) => found[key]);
}

const groups = specialitiesData && specialitiesData.map((item) => item.group);

const uniqueGroups = groups && findUnique(groups, (d) => d.id);

// const normalizeCode = (code) => {
//   if (!code) return;
//   const splitted = code.split('.');
//   let result = '';

//   splitted.forEach((item) => {
//     if (item.length === 1) {
//       result += `0${item}`;
//     } else {
//       result += item;
//     }
//   });

//   return result;
// };

// const sortedUniqueGroups = useSortArrayByField(
//   uniqueGroups.map((g) => ({
//     ...g,
//     normalizedCode: normalizeCode(g.code),
//   })),
//   'normalizedCode',
// );

const getSpecialitiesByLevelId = (id) => {
  return specialitiesData.filter((spec) => spec.group.id === id);

  //return data;
  // return useSortArrayByField(
  //   data.map((d) => ({
  //     ...d,
  //     normalizedCode: normalizeCode(d.code),
  //   })),
  //   'normalizedCode',
  // );
};

watch(
  () => currentLevelItem.value,
  (newValue) => {
    router.replace({
      path: `/${currentPath.value}/specialties/level_${newValue.slug}`,
    });
  },
);

const metaTitle = computed(() => {
  const levelName = currentLevel.value?.name;
  const levelCode = currentLevel.value?.okso6_middle_code;
  return `${levelName} в ${pageTitlePrepositional.value} России (ОКСО, уровень ${levelCode})`;
});

const metaDescription = computed(() => {
  // eslint-disable-next-line max-len
  return `${currentLevel.value?.name} (уровень образования ${
    currentLevel.value?.okso6_middle_code
  }), полный список ${useCurrentYear()} лицензированных специальностей ${pageTitleGenitive.value} России`;
});

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

  &__block {
    flex-direction: column;

    @media (min-width: 1440px) {
      flex-direction: row;
    }
  }

  &__col {
    &--left {
      flex: 1;
    }

    &--right {
      flex-basis: 100%;

      @media (min-width: 1440px) {
        margin-left: to-rem(32);
        flex-basis: to-rem(304);
        display: block;
      }
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