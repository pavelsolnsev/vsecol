<template>
  <PPage css-class="p-result">
        <ABreadcrumb :items="breadcrumbs" class="mb-8 mt-4" />
        <ATitle tag="h1" class="mb-8">Результаты проверки: {{ reportData?.short_name }}</ATitle>

    <section class="p-result__about mb-6">
      <ATitle tag="h4" class="mb-2">Структурное подразделение вуза</ATitle>
      <p>{{ reportData?.full_name }}</p>
    </section>

    <div class="licenses">
      <CardLicense type="license" :data="licenses[0]" has-link />
      <CardLicense type="accreditation" :data="accreditations[0]" has-link />
    </div>

    <OrganizationContacts :org="reportData" class="mb-16" />

    <MonitoringList
      v-if="hasMonitoring"
      :title="`Статистика приема в ${reportData?.short_name}`"
      :type="reportData?.type"
      :data="monitoring"
    />

    <template v-if="charts">
      <ATitle tag="h2" class="mb-8">Статистические данные мониторинга</ATitle>

      <Chart
        :legend-title="chartDirections?.label"
        :legend-data="chartDirections?.data.map((i) => i.label)"
        :graph-data="chartDirections?.data"
        legend-position="left"
      />

      <div class="p-result__charts row mb-16">
        <Chart
          v-for="chart in chartOthers"
          :key="chart.label"
          :legend-title="chart.label"
          :legend-data="chart.data.map((i) => i.label)"
          :graph-data="chart.data"
          legend-position="top"
          class="col p-result__charts-col"
        />
      </div>
    </template>

    <div v-if="specs.length" class="specs-in-license">
      <ATitle tag="h2" class="mb-8">Специальности в лицензии</ATitle>

      <div class="specs-in-license__message mb-8">
        <span><HexagonNegative class="specs-in-license__message-icon" /></span>
        <span
          >— При отсутствии аккредитации не предоставляется отсрочка от армии и выдается диплом установленного образца
          (на момент выдачи диплома специальность уже может быть аккредитована)</span
        >
      </div>

      <template v-for="type in specTypes" :key="type.code">
        <template v-if="filteredSpecs(type.code).length">
          <ATitle tag="h3" class="mb-4">{{ type.name }}</ATitle>

          <table class="specs-in-license__table mb-8">
            <thead>
              <tr>
                <th class="specs-in-license__table-code">Код</th>
                <th>Название</th>
                <th class="specs-in-license__table-accr">Аккредитация</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="spec in filteredSpecs(type.code)" :key="spec.id">
                <td class="specs-in-license__table-code">{{ spec.code }}</td>
                <td>{{ spec.name }}</td>
                <td class="specs-in-license__table-accr">
                  <div class="specs-in-license__table-center">
                    <component
                      :is="spec.is_accredited ? HexagonPositive : HexagonNegative"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        </template>
    </div>
  </PPage>
</template>
<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';
import ATitle from '~/components/_ui/a-title.vue';
import CardLicense from '~/components/CardLicense.vue';
import OrganizationContacts from '~/components/Organization/Contacts.vue';
import MonitoringList from '~/components/MonitoringList/MonitoringList.vue';
import Chart from '~/components/Chart.vue';
import HexagonPositive from '~/components/_icons/HexagonPositive.vue';
import HexagonNegative from '~/components/_icons/HexagonNegative.vue';
import { useToken } from '@/composables/useToken';

const route = useRoute();
const { token } = useToken();

const breadcrumbs = computed(() => [
  {
    title: 'Главная',
    path: '/',
  },
  {
    title: `Вузы России`,
    path: reportData.type === 'university' ? `/vuz/` : '/kolledzh/',
  },
  {
    title: `Вузы ${reportData.city.name_variations.p_roditelny}`,
    path: breadCityPath.value,
  },
  {
    title: `Карточка вуза`,
    path: '',
  },
]);

const currentId = route.params.id;

const report = await $fetch(`/api/clients/reports/${currentId}`, {
  headers: {
    authorization: `Bearer ${token.value}`,
  },
});

const reportData = report.data;
const licenses = reportData?.licenses;
const monitoring = reportData?.monitorings;
const accreditations = reportData?.accreditations;
const charts = reportData?.charts[0]?.data;

const chartOthers = { ...charts };
delete chartOthers.direction;

const chartDirections = charts && charts.direction;

const hasMonitoring = computed(() => !!monitoring.length);

const breadCityPath = computed(() => {
  if (reportData.city.slug === 'moskva' || reportData.city.slug === 'sankt-peterburg') {
    return reportData.type === 'university'
      ? `/vuz/city_${reportData.city.slug}/`
      : `/kolledzh/city_${reportData.city.slug}/`;
  } else {
    return reportData.type === 'university'
      ? `/vuz/subject_${reportData.subject.slug}/city_${reportData.city.slug}/`
      : `/kolledzh/subject_${reportData.subject.slug}/city_${reportData.city.slug}/`;
  }
});

const specs = ref(reportData.licenses[0].specialities || []);

const specTypes = ref([
  {
    code: '01',
    name: 'Начальное профессиональное образование',
  },
  {
    code: '02',
    name: 'Среднее профессиональное образование',
  },
  {
    code: '03',
    name: 'Бакалавриат',
  },
  {
    code: '04',
    name: 'Магистратура',
  },
  {
    code: '05',
    name: 'Специалитет',
  },
  {
    code: '06',
    name: 'Аспирантура',
  },
]);

const filteredSpecs = (code) => {
  return specs.value.filter((spec) => {
    if (code === '06') {
      return spec.code.split('.')[1] === code || spec.code.length < 8;
    } else {
      return spec.code.split('.')[1] === code;
    }
  });
};
</script>

<style lang="scss" scoped>
.p-result {
  &__charts {
    border-top: to-rem(1) solid var(--base-gray-tertiary);
    display: flex;
    flex-wrap: wrap;
    gap: to-rem(30);
    margin-top: to-rem(48);
    padding-top: to-rem(48);

    @media (min-width: 767px) {
      display: flex;
      flex-wrap: wrap;
      gap: to-rem(30);
    }

    &-col {
      width: 100%;

      @media (min-width: 767px) {
        width: calc(33.333% - 20px);
      }
    }
  }
}

.licenses {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: to-rem(48);

  @media (min-width: 767px) {
    flex-direction: row;
    margin-bottom: to-rem(64);
    gap: to-rem(16);
  }
}

.specs-in-license {
  &__message {
    font-weight: 400;
    font-size: to-rem(16);
    line-height: 150%;
    color: var(--base-gray);
    width: 100%;
    max-width: to-rem(864);
    display: flex;
    padding: to-rem(16);
    border-radius: to-rem(8);
    background-color: var(--base-gray-smoky);

    &-icon {
      margin-top: to-rem(1);
      margin-right: to-rem(8);
    }
  }

  &__table {
    width: 100%;
    max-width: to-rem(864);

    th {
      text-align: left;
      color: var(--base-gray);
      font-weight: 400;
      font-size: to-rem(16);
      line-height: 150%;
      padding-bottom: to-rem(16);
    }

    td {
      font-weight: 400;
      font-size: to-rem(14);
      line-height: 129%;
      padding-top: to-rem(12);
      padding-bottom: to-rem(12);
      border-top: to-rem(1) solid var(--base-gray-border);
    }

    &-accr {
      width: to-rem(110);
    }

    &-code {
      width: to-rem(80);
    }

    &-center {
      display: flex;
      justify-content: center;
    }
  }
}
</style>