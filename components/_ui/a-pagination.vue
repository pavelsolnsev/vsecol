<template>
  <div v-if="total > 1" class="a-pagination">
    <ul class="a-pagination__list">
      <li v-for="(item, index) in range" :key="index" class="a-pagination__item">
        <template v-if="item === '...'">
          <span
            :class="{
              'a-pagination__link--disabled': item === '...',
            }"
            class="a-pagination__link"
            >{{ item }}</span
          >
        </template>
        <template v-else>
          <NuxtLink
            :href="computedPath(item)"
            :active-class="undefined"
            :exact-active-class="undefined"
            :class="{
              'a-pagination__link--current': item === parseInt(currentPage, 10),
            }"
            class="a-pagination__link"
            @click.stop.prevent="choosePage(item)"
            >{{ item }}</NuxtLink
          >
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  total: {
    type: [Number, String],
    default: 1,
    validator: (val) => val % 1 === 0,
  },
  totalVisible: {
    type: [Number, String],
    default: 5,
  },
  ellipsis: {
    type: String,
    default: '...',
  },
  page: {
    type: [Number, String],
    default: 1,
  },
  start: {
    type: [Number, String],
    default: 1,
  },
});

const route = useRoute();

const emit = defineEmits(['change']);

const currentPage = ref(props.page || 1);

const computedPath = (page) => {
  return route.path + `?page=` + page;
};

watch(
  () => props.page,
  (newValue) => {
    currentPage.value = newValue;
  },
  { immediate: true },
);

const total = computed(() => parseInt(props.total, 10));
const start = computed(() => parseInt(props.start, 10));

const totalVisible = computed(() => {
  if (props.totalVisible != null) return parseInt(props.totalVisible, 10);
});

const range = computed(() => {
  if (totalVisible.value <= 0) return [];
  else if (totalVisible.value === 1) return [currentPage.value];

  if (total.value <= totalVisible.value) {
    return useCreateRange(total.value, start.value);
  }

  const even = totalVisible.value % 2 === 0;
  const middle = even ? totalVisible.value / 2 : Math.floor(totalVisible.value / 2);
  const left = even ? middle : middle + 1;
  const right = total.value - middle;

  if (left - currentPage.value >= 0) {
    return [...useCreateRange(props.totalVisible, 1), props.ellipsis, props.total - 1, props.total];
  } else if (currentPage.value - right >= (even ? 1 : 0)) {
    const rangeLength = totalVisible.value - 1;
    const rangeStart = total.value - rangeLength + start.value;
    return [start.value, props.ellipsis, ...useCreateRange(rangeLength, rangeStart)];
  } else {
    const rangeLength = Math.max(1, totalVisible.value - 1);
    const rangeStart =
      rangeLength === 1 ? currentPage.value : currentPage.value - Math.ceil(rangeLength / 2) + start.value;

    return [1, props.ellipsis, ...useCreateRange(rangeLength, rangeStart), props.ellipsis, props.total];
  }
});

const choosePage = (item) => {
  if (item !== '...') {
    currentPage.value = item;
    emit('change', item);
  }
};
</script>

<style lang="scss">
.a-pagination {
  display: inline-block;

  &__list {
    display: flex;
  }

  &__item {
    margin-right: to-rem(8);

    &:last-child {
      margin-right: 0;
    }
  }

  &__link {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: to-rem(40);
    height: to-rem(40);
    padding-right: to-rem(8);
    padding-left: to-rem(8);
    color: var(--base-gray);
    border-radius: var(--border-radius-x1);
    font-size: to-rem(16);
    font-weight: 700;
    line-height: to-rem(24);
    cursor: pointer;
    transition: all 0.4s ease;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: var(--base-white);
        background-color: var(--base-blue);
      }
    }

    &--current {
      color: var(--base-white);
      background-color: var(--base-blue);
    }

    &--disabled {
      &:hover {
        color: var(--base-gray);
        background-color: transparent;
        cursor: default;
      }
    }
  }
}
</style>
