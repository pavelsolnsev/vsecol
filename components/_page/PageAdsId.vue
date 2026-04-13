<template>
  <PPage css-class="ads">
        <ATitle tag="h1" class="mb-10">Информация о рекламодателе</ATitle>

        <ATitle tag="h2" class="mb-8">{{ adsQuery.data.value?.name }}</ATitle>

        <ATitle tag="h3" class="mb-2">Данные организации</ATitle>

        <div class="mb-10">
          <div class="mb-2">{{ adsQuery.data.value?.name }}</div>
          <div class="mb-2">ИНН: {{ adsQuery.data.value?.inn }}</div>
          <div v-if="adsQuery.data.value?.city" class="mb-2">{{ adsQuery.data.value?.city.name }}</div>
        </div>

        <ATitle tag="h3" class="mb-2">Контакты</ATitle>

        <div class="mb-10">
          <div v-if="adsQuery.data.value?.address" class="mb-2">{{ adsQuery.data.value?.address }}</div>
          <div v-if="adsQuery.data.value?.email" class="ads__row mb-2">
            <Email class="mr-3" />
            <a :href="`mailto:${adsQuery.data.value?.email}`">{{ adsQuery.data.value?.email }}</a>
          </div>
          <div v-if="adsQuery.data.value?.phone" class="ads__row mb-2">
            <Phone class="mr-3" />
            <a :href="`tel:${adsQuery.data.value?.phone}`">{{ adsQuery.data.value?.phone }}</a>
          </div>
        </div>
      </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ATitle from '~/components/_ui/a-title.vue';
import Email from '~/components/_icons/Email.vue';
import Phone from '~/components/_icons/Phone.vue';
import { useApiAdvertiser } from '~/composables/api/useApiAdvertiser';

const route = useRoute();

useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

// Загрузка данных рекламодателя
const adsQuery = useApiAdvertiser(route.params.id);

await adsQuery.suspense();

if (!adsQuery.data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Ads Not Found',
    fatal: true,
  });
}
</script>

<style lang="scss">
.ads {
  &__row {
    display: flex;
  }
}
</style>