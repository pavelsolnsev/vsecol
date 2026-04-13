<template>
  <div class="speciality">
    <ATitle v-if="title" tag="h2" class="speciality__title">{{ title }}</ATitle>

    <template v-if="names">
      <template v-for="(speciality, index) in names" :key="index">
        <ATitle v-if="hasSpecialities(speciality.id)" tag="h3" class="speciality__subtitle">{{
          speciality.name
        }}</ATitle>

        <SpecialityListItem
          :data="specialities(speciality.id)"
          :subject-slug="subjectSlug"
          :type="type"
          :city-slug="citySlug"
        />
      </template>
    </template>
    <template v-else>
      <SpecialityListItem :data="specData" :subject-slug="subjectSlug" :type="type" :city-slug="citySlug" />
    </template>
  </div>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import SpecialityListItem from '~/components/SpecialityListItem.vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  specNames: {
    type: Object,
    default: () => {
      return {};
    },
  },
  specData: {
    type: Array,
    default: () => {
      return [];
    },
  },
  subjectSlug: {
    type: String,
    default: '',
  },
  citySlug: {
    type: String,
    default: '',
  },
});

const specialities = (id) => {
  return (
    props.specData.length && props.specData.filter((s) => s.level && s.level.id === parseInt(id, 10))
    // useSortArrayByField(
    //   props.specData.filter((s) => s.level && s.level.id === parseInt(id, 10)),
    //   'code',
    // )
  );
};

const hasSpecialities = (id) => {
  return !!specialities(id).length;
};

const names = computed(() => props.specNames[props.type]);
</script>

<style lang="scss">
.speciality {
  margin: 0 to-rem(-16);
  padding: to-rem(40) to-rem(16);
  background-color: var(--base-gray-smoky);

  @media (min-width: 767px) {
    margin: 0 to-rem(-40);
    padding: to-rem(40) to-rem(24);
  }

  @media (min-width: 1024px) {
    margin: 0;
    padding: to-rem(16) to-rem(24) to-rem(24);
  }

  @media (min-width: 1440px) {
    padding: to-rem(16) to-rem(24) to-rem(24);
  }

  &__title {
    margin-bottom: to-rem(32);
  }

  &__subtitle {
    margin-top: to-rem(24);
    margin-bottom: to-rem(16);
  }

  &__okso {
    display: flex;
    align-items: flex-start;
    margin-bottom: to-rem(8);

    &:last-child {
      border-bottom: to-rem(1) solid transparent;
    }

    &-number {
      margin-right: to-rem(8);
      font-size: to-rem(12);
    }

    &-name {
      font-size: to-rem(12);
      font-weight: 700;
    }

    &-link {
      color: var(--base-blue);
    }
  }

  &__toggle {
    float: right;
    color: var(--base-blue);
    font-size: to-rem(12);
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
