<template>
  <ARadioGroup v-model="currentOption" :options="options" name="levelOptions" variant="filter" class="mb-10" />

  <slot :level="currentOption" />
</template>

<script setup>
import ARadioGroup from '~/components/_ui/a-radio-group.vue';
import { useApiSpecsByOrganization } from '~/composables/api/useApiSpecsByOrganization';

const route = useRoute();
const router = useRouter();

const storeApi = useApiStore();
const storeInfo = useInfoStore();

const { path: currentPath } = storeToRefs(storeInfo);

const orgData = storeApi.orgData;
const pathArray = route.path.split('/').filter((i) => i !== '');
const currentPartPath = pathArray[pathArray.length - 1];
const options = [{ id: 0, name: 'Все специальности', slug: 'all' }, ...storeApi.organizationLevels];
const currentOption = ref(options.find((i) => i.slug === currentPartPath) || options[0]);

const specsQuery = useApiSpecsByOrganization(orgData.id);
await specsQuery.suspense();

if (currentPartPath !== 'specs' && currentOption.value?.slug !== currentPartPath) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Organization spec route not defined',
    fatal: true,
  });
}

watch(
  () => currentOption.value,
  (newValue) => {
    router.replace({
      path: `/${currentPath?.value}/${storeApi.orgData.type}_${storeApi.orgData.id}/specs/${
        newValue.slug !== 'all' ? newValue.slug + '/' : ''
      }`,
    });
  },
);

// meta
const metaTitle = computed(
  () =>
    `${
      route.params.specSlug
        ? storeApi.organizationLevels.find((l) => l.slug === route.params.specSlug).name + ' в'
        : 'Специальности в'
    } ${orgData.short_name}, ${orgData.name}, г. ${orgData.city.name}`,
);
const metaDescription = computed(
  () =>
    `Лицензированные специальности ` +
    (route.params.specSlug
      ? '(уровень - ' + storeApi.organizationLevels.find((l) => l.slug === route.params.specSlug).name + ') '
      : '') +
    orgData.short_name +
    ` ` +
    useCurrentYear() +
    ` в г. ${orgData.city.name}, ` +
    `информация о приеме на бюджетное и платное отделение по формам обучения`,
);

useSeoMeta({
  title: metaTitle,
  description: metaDescription,
});
</script>
