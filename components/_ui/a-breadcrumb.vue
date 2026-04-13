<template>
  <div class="a-breadcrumb">
    <ol class="a-breadcrumb__list" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="a-breadcrumb__item"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <NuxtLink
          v-if="item.path.length"
          :to="{ path: item.path, query: item.query }"
          itemprop="item"
          class="a-breadcrumb__link"
          @click="emit('click', item)"
          ><span class="a-breadcrumb__title" itemprop="name">{{ item.title }}</span></NuxtLink
        >
        <span v-else class="a-breadcrumb__title" itemprop="name">{{ item.title }}</span>
        <meta itemprop="position" :content="index + 1" />
      </li>
    </ol>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const emit = defineEmits(['click']);
</script>

<style lang="scss">
.a-breadcrumb {
  overflow: hidden;
  line-height: to-rem(18);
  white-space: nowrap;

  &__list {
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    list-style-type: none;
    line-height: to-rem(18);
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__title {
    display: block;
    overflow: hidden;
    color: var(--base-gray);
    font-size: to-rem(12);
    line-height: to-rem(18);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__item {
    position: relative;
    padding-right: to-rem(20);

    &::before {
      content: '•';
      position: absolute;
      top: 60%;
      right: 0;
      width: to-rem(20);
      height: to-rem(20);
      color: var(--base-gray);
      text-align: center;
      transform: translateY(-50%);
    }

    &:last-child {
      &::before {
        content: none;
      }
    }
  }

  &__link {
    color: var(--base-gray);
    font-size: to-rem(12);
    line-height: to-rem(18);
    transition: all 0.25s ease-in-out;
  }
}
</style>
