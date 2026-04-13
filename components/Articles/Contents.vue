<template>
  <div class="article-contents" :class="{ 'article-contents--open': isOpen }" v-bind="$attrs" @click="isOpen = !isOpen">
    Содержание
    <component :is="isOpen ? FilterActive : Filter" class="article-contents__icon" />
  </div>
  <div v-show="isOpen" class="article-contents__backdrop" @click="isOpen = false"></div>

  <Transition name="slide-up">
    <div v-show="isOpen" class="article-contents__container">
      <ModalClose class="article-contents__close" @click="isOpen = false" />
      <div class="p-article__section">
        <div class="p-article__section-header">На этой странице</div>

        <ul class="p-article__anchors">
          <li v-for="block in articleBlocks" :key="block.id">
            <a @click.prevent="scrollToAnchor(block.id)">{{ block.data.header }}</a>
          </li>
        </ul>
      </div>

      <div class="p-article__section">
        <div class="p-article__section-header">Категории</div>

        <ArticlesCategories :data="categories" />
      </div>

      <div class="p-article__section">
        <div class="p-article__section-header">Автор статьи</div>

        <ArticlesAuthor :name="author?.name" :description="author?.description" :image="author?.image?.url" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import FilterActive from '~/components/_icons/FilterActive.vue';
import Filter from '~/components/_icons/Filter.vue';
import ModalClose from '~/components/_icons/ModalClose.vue';
import ArticlesCategories from './Categories.vue';
import ArticlesAuthor from './Author.vue';
import { useDeviceStore } from '~/store/device';

defineProps({
  author: {
    type: Object,
    default: () => {
      return {};
    },
  },
  categories: {
    type: Array,
    default: () => {
      return [];
    },
  },
  articleBlocks: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const storeDevice = useDeviceStore();

const isOpen = ref(false);

const scrollToAnchor = (id) => {
  isOpen.value = false;

  const el = document.getElementById(id);
  if (!el) return;
  const marginTop = storeDevice.isTablet || storeDevice.isMobile ? 120 : 100;
  const y = el.getBoundingClientRect().top + window.scrollY - marginTop;

  window.scrollTo({ top: y, behavior: 'smooth' });
};
</script>

<style lang="scss" scoped>
.article-contents {
  display: flex;
  align-items: center;
  border-radius: to-rem(8);
  padding: to-rem(16);
  justify-content: space-between;
  font-size: to-rem(18);
  line-height: to-rem(24);
  background-color: var(--base-gray-smoky);

  &__close {
    position: absolute;
    top: to-rem(12);
    right: to-rem(12);
  }

  &__backdrop {
    position: fixed;
    z-index: 999997;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: var(--base-black);
    opacity: 0.4;
    pointer-events: all;
  }

  &__container {
    background-color: var(--base-white);
    position: fixed;
    z-index: 999998;
    top: to-rem(108);
    right: 0;
    left: 0;
    bottom: 0;
    display: block;
    overflow: hidden;
    overflow-y: scroll;
    width: 100%;
    max-height: none !important;
    margin-top: to-rem(-1);
    border-top-left-radius: to-rem(8);
    border-top-right-radius: to-rem(8);
    padding: to-rem(32) to-rem(20);
  }
}

.slide-up-enter-active {
  transition: all 0.4s ease-out;
}

.slide-up-leave-active {
  transition: none;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100px);
}

.slide-up-leave-to {
  opacity: 1;
  transform: translateY(100%);
}
</style>
