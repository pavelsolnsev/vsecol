<template>
  <div class="org-specialities">
    <ATitle v-if="title" tag="h2" class="org-specialities__title">{{ title }}</ATitle>

    <template v-if="names">
      <template v-for="(item, index) in names" :key="index">
        <ATitle v-if="hasSpecialities(item.id)" tag="h3" class="org-specialities__subtitle">{{ item.name }}</ATitle>
        <div class="org-specialities__list">
          <OrganizationSpeciality
            v-for="spec in specialities(item.id)"
            :key="spec.id"
            :data="spec"
            :subject="subjectSlug"
            :city="citySlug"
            :type="type"
          />
        </div>
      </template>
    </template>
    <template v-else>
      <div class="org-specialities__list">
        <OrganizationSpeciality
          v-for="spec in specData"
          :key="spec.id"
          :data="spec"
          :subject="subjectSlug"
          :city="citySlug"
          :type="type"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import OrganizationSpeciality from '~/components/Organization/Speciality.vue';

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

const hasSpecialities = (id) => {
  return !!specialities(id).length;
};

const names = computed(() => props.specNames[props.type]);

const specialities = (id) => {
  return props.specData.length && props.specData.filter((s) => s.level_id && s.level_id === parseInt(id, 10));
};
</script>

<style lang="scss" scoped>
.org-specialities {
  margin: 0 to-rem(-16);
  padding: to-rem(16) to-rem(24);
  background-color: var(--base-gray-smoky);

  @media (min-width: 767px) {
    margin: 0;
  }

  &__title {
    margin-bottom: to-rem(32);
  }

  &__subtitle {
    margin-bottom: to-rem(16);
  }

  &__list {
    margin-bottom: to-rem(32);
  }
}
</style>
