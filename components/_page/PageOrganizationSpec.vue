<template>
  <OrganizationSpecialities
    :title="level.slug === 'all' ? `Специальности ${orgData.short_name}` : `${level.name} ${orgData.short_name}`"
    :spec-names="level.slug === 'all' ? storeFilter.dictLevels : []"
    :spec-data="specs"
    :type="orgData.type"
    :subject-slug="orgData.subject.slug"
    :city-slug="orgData.city.slug"
    class="p-organization__specialities"
  />
</template>

<script setup>
import OrganizationSpecialities from '~/components/Organization/Specialities.vue';

const storeApi = useApiStore();
const storeFilter = useFilterStore();

const props = defineProps({
  level: {
    type: [String, Object],
    default: '',
  },
});

const orgData = storeApi.orgData;

const specs = computed(() =>
  props.level.slug === 'all'
    ? storeApi.organizationSpecs
    : storeApi.organizationSpecs.filter((s) => s.level_id === props.level.id),
);
</script>
