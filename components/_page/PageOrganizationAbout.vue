<template>
  <div v-if="accreditations?.length" class="p-organization__markers mb-12">
    <div class="p-organization__markers-row">
      <div class="p-organization__markers-col p-organization__markers-name">Выдаётся государственный диплом?</div>
      <div class="p-organization__markers-col p-organization__markers-mark">Да</div>
    </div>
    <div class="p-organization__markers-row">
      <div class="p-organization__markers-col p-organization__markers-name">Предоставляет отсрочку от армии?</div>
      <div class="p-organization__markers-col p-organization__markers-mark">Да</div>
    </div>
  </div>

  <MonitoringList
    v-if="hasMonitoring"
    :title="`Статистика приема в ${orgData.short_name}`"
    :type="orgData.type"
    :data="monitorings"
  />

  <!-- eslint-disable vue/no-v-html -->
  <div v-if="orgData.about" class="p-organization__about">
    <div
      class="p-organization__description-text"
      :class="{ 'p-organization__description-text--active': toggle }"
      v-html="orgData.about"
    ></div>
    <span
      class="p-organization__description-toggle"
      :class="{ 'p-organization__description-toggle--active': toggle }"
      @click="toggle = !toggle"
      >{{ toggle ? 'Свернуть' : 'Развернуть' }}
    </span>
  </div>

  <template v-if="licenses || accreditations">
    <ATitle tag="h2" class="mb-8">Лицензия {{ accreditations.length ? 'и аккредитация' : '' }} </ATitle>
    <LicensesList :licenses="licensesFiltered" :accreditations="accreditationsFiltered" />
  </template>

  <OrganizationContacts :org="orgData" class="mb-16" />

  <template v-if="hasParent">
    <ATitle tag="h2" class="mb-8">Головная организация</ATitle>

    <div class="parent">
      <nuxt-link :to="`/org/${parent?.type}_${parent?.id}/`" class="parent__link">{{ parent?.name }}</nuxt-link>
    </div>
  </template>

  <template v-if="hasChildren">
    <ATitle tag="h2" class="mb-8">Подразделения {{ orgData.short_name }}</ATitle>

    <template v-if="childrenSameCity?.length">
      <ATitle tag="h3" class="mb-4">{{ storeInfo.isUniversity ? 'Вузы' : 'Колледжи' }}:</ATitle>
      <div class="branch">
        <nuxt-link
          v-for="child in childrenSameCity"
          :key="child.id"
          :to="`/org/${child?.type}_${child?.id}/`"
          trailing-slash="append"
          class="branch__link"
          >{{ child?.name }}</nuxt-link
        >
      </div>
    </template>

    <template v-if="childrenBranches?.length">
      <ATitle tag="h3" class="mb-4">Филиалы:</ATitle>
      <div class="branch mb-8">
        <nuxt-link
          v-for="child in childrenBranches"
          :key="child.id"
          :to="`/org/${child?.type}_${child?.id}/`"
          trailing-slash="append"
          class="branch__link"
          >{{ child?.name }}</nuxt-link
        >
      </div>
    </template>
  </template>

  <div v-if="storeApi.organizationLevels?.length" class="levels">
    <ATitle tag="h2" class="mb-8"
      >{{ orgData.name }} реализует образовательные программы по следующим уровням подготовки:</ATitle
    >

    <ul class="levels-list">
      <li v-for="level in storeApi.organizationLevels" :key="level.slug" class="levels-list__item">
        <NuxtLink :to="route.path + 'specs/' + level.slug" trailing-slash="append" class="levels-list__link">
          {{ level.name }} </NuxtLink
        >&nbsp;
        <span class="levels-list__count">({{ level.specialities_count }})</span>
      </li>
      <li class="levels-list__item">
        <NuxtLink class="levels-list__link levels-list__link--all" :to="route.path + 'specs'" trailing-slash="append"
          >Все специальности</NuxtLink
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import MonitoringList from '~/components/MonitoringList/MonitoringList.vue';
import LicensesList from '~/components/LicensesList.vue';
import OrganizationContacts from '~/components/Organization/Contacts.vue';

const route = useRoute();
const storeApi = useApiStore();
const storeInfo = useInfoStore();

const toggle = ref(false);

const orgData = storeApi.orgData;
const monitorings = orgData.monitorings;
const hasMonitoring = computed(() => !!monitorings?.length);

const accreditations = orgData.accreditations;
const accreditationsFiltered = computed(() => {
  if (!accreditations || !accreditations.length) return {};
  return accreditations.reduce(function (sum, current) {
    return sum > current ? sum : current;
  }, {});
});
const licenses = orgData.licenses;
const licensesFiltered = computed(() => {
  if (!licenses || !licenses.length) return {};
  return licenses.reduce(function (sum, current) {
    return sum > current ? sum : current;
  }, {});
});
const parent = ref(orgData.parent);
const hasParent = computed(() => !!orgData.parent);
const children = ref(orgData.children);
const hasChildren = computed(() => orgData.children && orgData.children?.length);
const childrenSameCity = computed(() => children.value.filter((child) => child.city_id === orgData.city_id) || []);
const childrenBranches = computed(() => children.value.filter((child) => child.city_id !== orgData.city_id) || []);
</script>

<style lang="scss" scoped>
.levels {
  border-radius: to-rem(8);
  padding: to-rem(24) to-rem(88) to-rem(24) to-rem(24);
  background-color: var(--base-gray-smoky);

  &-list {
    &__item {
      margin-bottom: to-rem(16);

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__link {
      color: #0941ac;
      font-size: to-rem(22);

      &--all {
        font-weight: 700;
      }
    }

    &__count {
      font-size: to-rem(22);
    }
  }
}
</style>
