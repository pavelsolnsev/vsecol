<template>
  <div class="listing-search">
    <div v-if="title" class="listing-search__title">{{ title }}</div>
    <div v-for="(item, index) in data" :key="index" class="listing-search__item">
      <SearchCard
        :id="item?.id"
        :type="item?.type"
        :name="item?.name"
        :short-name="item?.short_name"
        :city-name="item?.city?.name"
        with-links
        @click="handleClick"
      />
    </div>
  </div>
</template>

<script setup>
import SearchCard from '~/components/Search/Card.vue';

defineProps({
  data: {
    type: Array,
    required: true,
    default: () => {
      return [];
    },
  },
  title: {
    type: String,
    default: '',
  },
  cardType: {
    type: String,
    default: 'default',
  },
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>

<style lang="scss">
.listing-search {
  padding-bottom: to-rem(16);
  border-bottom: to-rem(1) solid var(--base-gray-border);

  &__title {
    margin-bottom: to-rem(16);
    font-size: to-rem(16);
    font-weight: 700;
    line-height: to-rem(24);
  }

  &__item {
    padding: 0 0 to-rem(24);

    &:last-child {
      padding-bottom: 0;
      border-bottom: to-rem(1) solid transparent;
    }

    &--prev {
      // stylelint-disable-next-line
      border-bottom: to-rem(1) solid transparent !important;
    }

    &--adv {
      position: relative;
      padding: to-rem(24) to-rem(16);
      background-color: var(--base-gray-second);
      // stylelint-disable-next-line
      border-top: to-rem(1) solid transparent !important;
      // stylelint-disable-next-line
      border-bottom: to-rem(1) solid transparent !important;
    }
  }
}
</style>
