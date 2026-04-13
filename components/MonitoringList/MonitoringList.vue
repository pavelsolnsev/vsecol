<template>
  <div class="monitorings">
    <ATitle tag="h2" class="monitorings__title">{{ title }}</ATitle>

    <div class="monitorings__row">
      <div class="monitorings__col monitorings__col--left">
        <div class="table monitorings__table">
          <div class="table__row table__header">
            <div class="table__col table__param">Год</div>
            <div v-for="(year, index) in filteredStatYears" :key="index" class="table__col table__data">
              {{ year }}
            </div>
          </div>
          <div v-for="(header, indexRow) in rowHeaders[type]" :key="indexRow" class="table__row">
            <div class="table__col table__param">
              {{ header }}
            </div>
            <template v-for="(year, indexYear) in filteredStatYears" :key="indexYear">
              <div class="table__col table__data">
                {{ getData(year, attrs[type][indexRow]) > 0 ? getData(year, attrs[type][indexRow]) : '-' }}
              </div>
            </template>
          </div>
          <div class="table__row">
            <div class="table__col table__param">Количество студентов</div>
            <div class="table__container">
              <template v-for="(year, index) in filteredStatYears" :key="index">
                <div class="table__col table__data">
                  {{ getStudentSum(year) || '-' }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div v-if="noData.length" class="statistics__col">
        <div class="info">
          Результаты {{ noData.join(', ') }} года: данные для проведения мониторинга или их часть, не предоставлены или
          не соответствуют требованиям Межведомственной комиссии
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  data: {
    type: Array,
    default: () => {
      return [];
    },
    required: true,
  },
});

const rowHeaders = {
  university: ['Средний балл ЕГЭ', 'Средний балл ЕГЭ (бюджет)', 'Средний балл ЕГЭ (платно)'],
  college: ['Средний балл аттестата', 'Средний балл аттестата (бюджет)', 'Средний балл аттестата (платно)'],
};

const attrs = {
  university: ['ege', 'free', 'pay'],
  college: ['att', 'attF', 'attP'],
};

const getYearSum = (year) => {
  return props.data
    .filter((m) => m.year === year && attrs[props.type].includes(m.label))
    .filter((v) => v.value && v.value > 0);
};

// Ищет лейбл peop - количество студентов
// Если его нет в массиве, то пробуем считать самостоятельно складывая параметры o + oz + z если они есть в массиве
// o - очное отделение
// oz - очно-заочное отделение
// z - заочное отделение
const getStudentSum = (year) => {
  return (
    props.data.find((m) => m.label === 'peop' && m.year === year)?.value ||
    (parseInt(props.data.find((m) => m.label === 'o' && m.year === year)?.value, 10) || 0) +
      (parseInt(props.data.find((m) => m.label === 'oz' && m.year === year)?.value, 10) || 0) +
      (parseInt(props.data.find((m) => m.label === 'z' && m.year === year)?.value, 10) || 0)
  );
};

const statYears = [...new Set(props.data.map((m) => m.year))].reverse();

const filteredStatYears = computed(() => statYears.filter((year) => getYearSum(year) || getStudentSum(year)));

const getData = (year, label) => {
  return props.data.find((m) => m.label === label && m.year === year)?.value;
};

const noData = computed(() => statYears.filter((year) => !(getYearSum(year) && getStudentSum(year))));
</script>

<style lang="scss">
.monitorings {
  margin-bottom: to-rem(40);

  @media (min-width: 1440px) {
    margin-bottom: to-rem(48);
  }

  &__title {
    margin-bottom: to-rem(32);
  }

  &__row {
    display: flex;
    flex-direction: column;

    @media (min-width: 1024px) {
      flex-direction: row;
    }
  }

  &__col {
    &--left {
      flex: 1;
      max-width: to-rem(864);
    }
  }

  &__table {
    overflow-x: auto;

    &::-webkit-scrollbar-track {
      background-color: var(--base-gray-smoky);
      border-radius: to-rem(8);
    }

    &::-webkit-scrollbar {
      height: to-rem(8);
      background-color: var(--base-gray-selection);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--base-blue);
      border-radius: to-rem(8);
    }
  }
}

.table {
  &__row {
    display: inline-flex;
    align-items: center;
    min-width: 100%;
    border-top: to-rem(1) solid var(--base-gray-selection);

    &:first-child {
      border-top: to-rem(1) solid transparent;
    }
  }

  &__header {
    padding-bottom: to-rem(16);
    color: var(--base-gray);
  }

  &__header & {
    &__col {
      padding-top: 0;
    }
  }

  &__col {
    margin-right: to-rem(16);
    padding-top: to-rem(12);
    padding-bottom: to-rem(12);
  }

  &__param {
    flex: 1;
    min-width: to-rem(180);

    @media (min-width: 1024px) {
      min-width: to-rem(80);
    }
  }

  &__container {
    display: flex;
    align-items: center;
  }

  &__data {
    min-width: to-rem(50);
    text-align: center;
  }
}

.info {
  margin-top: to-rem(32);
  padding: to-rem(8) to-rem(8) to-rem(8) to-rem(34);
  color: var(--base-black);
  background-color: var(--base-gray-smoky);
  background-image: url('~/assets/icons/info.svg');
  background-repeat: no-repeat;
  background-position: to-rem(8) to-rem(8);
  background-size: to-rem(18) to-rem(18);
  border: to-rem(1) solid var(--base-gray-border);
  border-radius: to-rem(4);

  @media (min-width: 1024px) {
    max-width: to-rem(346);
    margin-top: 0;
    margin-left: to-rem(32);
    font-size: to-rem(14);
  }
}
</style>
