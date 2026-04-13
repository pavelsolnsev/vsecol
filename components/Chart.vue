<template>
  <div class="chart" :class="[`chart--${legendPosition}`]">
    <div class="chart__legend legend">
      <div class="legend__title">{{ legendTitle && useCapitalizeFirstLetter(legendTitle) }}</div>
      <ul class="legend__list">
        <li v-for="(item, index) in legendData" :key="index" class="legend__list-item">
          <span class="legend__marker" :class="[`marker-${index + 1}`]"></span>
          <span class="legend__name">{{ item }}</span>
        </li>
      </ul>
    </div>

    <div class="chart__content graph">
      <div
        v-for="(item, index) in graphData"
        :key="index"
        :class="[`marker-${index + 1}`]"
        :style="[`max-height: ${calcPersentage(item.value)}`]"
        class="graph__item"
      >
        <div class="graph__value">
          <span>{{ parseFloat(item?.value).toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  legendTitle: {
    type: String,
    default: '',
  },
  legendData: {
    type: Array,
    default: () => {
      return [];
    },
  },
  legendPosition: {
    type: String,
    validator(value) {
      return ['left', 'top'].indexOf(value) !== -1;
    },
    default: 'left',
  },
  graphData: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const max = computed(() => props.graphData.map((item) => item.value).reduce((a, b) => Math.max(a, b), -Infinity));

const calcPersentage = (value) => {
  const r = max.value ? (value / max.value).toFixed(2) * 100 : 0;

  return `${r}%`;
};
</script>

<style lang="scss" scoped>
.chart {
  --chart-bg-1: #0941ac;
  --chart-bg-2: #71c6f1;
  --chart-bg-3: #3f87e3;
  --chart-bg-4: #53759a;
  --chart-bg-5: #e57836;
  --chart-bg-6: #428293;

  display: flex;

  &__legend {
    margin-top: to-rem(16);
    margin-right: to-rem(32);
  }

  &__content {
    flex: 1 1 auto;
    padding-left: to-rem(24);
    padding-right: to-rem(24);
    padding-bottom: to-rem(8);

    margin-top: to-rem(16);
  }

  &--top {
    height: to-rem(248);
    flex-direction: column;
  }

  &--top & {
    &__legend {
      margin-right: 0;
      margin-bottom: to-rem(24);
    }
  }

  &--left {
    flex-direction: column;

    @media (min-width: 767px) {
      flex-direction: row;
    }
  }

  &--left & {
    &__legend {
      margin-top: 0;
      margin-right: 0;
      margin-bottom: to-rem(32);

      @media (min-width: 767px) {
        width: 50%;
        margin-bottom: 0;
      }

      @media (min-width: 1024px) {
        width: 35%;
      }
    }

    &__content {
      width: 100%;
      height: to-rem(214);

      @media (min-width: 767px) {
        width: 50%;
      }

      @media (min-width: 1024px) {
        width: 65%;
      }
    }
  }
}

.marker {
  &-1 {
    background-color: var(--chart-bg-1);
  }
  &-2 {
    background-color: var(--chart-bg-2);
  }
  &-3 {
    background-color: var(--chart-bg-3);
  }
  &-4 {
    background-color: var(--chart-bg-4);
  }
  &-5 {
    background-color: var(--chart-bg-5);
  }
  &-6 {
    background-color: var(--chart-bg-6);
  }
}

.legend {
  &__title {
    font-weight: 700;
    font-size: to-rem(18);
    margin-bottom: to-rem(16);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: to-rem(16);

    &-item {
      display: flex;
      align-items: center;
    }
  }

  &__marker {
    width: to-rem(24);
    height: to-rem(18);
    border-radius: var(--border-radius-x1);
  }

  &__name {
    margin-left: to-rem(8);
    font-size: to-rem(12);
    line-height: 150%;
  }
}

.graph {
  gap: to-rem(16);
  display: flex;
  align-items: flex-end;
  border-bottom: to-rem(2) solid var(--base-gray-tertiary);

  &__item {
    height: 0;
    flex: 1 1 auto;
    border-radius: var(--border-radius-x2);
    animation: grow 0.6s forwards;
  }

  &__value {
    font-size: to-rem(12);
    text-align: center;
    margin-top: to-rem(-16);

    span {
      display: inline-block;
      margin-bottom: to-rem(4);
    }
  }
}

@keyframes grow {
  0% {
    height: 0;
  }

  100% {
    height: 100%;
  }
}
</style>
