<template>
  <section class="recommended-items">
    <header class="recommended-items__header">
      <NuxtLink v-if="linkPath" :to="linkPath">
        <ATitle tag="h2">{{ title }}</ATitle>
      </NuxtLink>

      <ATitle v-else tag="h2">{{ title }}</ATitle>

      <div class="recommended-items__buttons">
        <AButton variant="primary" class="recommended-items__button" @click="swiper.prev()">
          <IconBack class="recommended-items__button-icon" />
        </AButton>
        <AButton variant="primary" class="recommended-items__button" @click="swiper.next()">
          <IconBack class="recommended-items__button-icon" style="transform: rotate(180deg)" />
        </AButton>
      </div>
    </header>

    <client-only>
      <swiper-container ref="containerRef" v-bind="swiperSettings">
        <swiper-slide v-for="item in data" :key="item?.id" class="recommended-items__slide">
          <ArticlesCard v-if="isArticle" :data="item" />
          <ReviewCard v-else :data="item" />
        </swiper-slide>
      </swiper-container>
    </client-only>
  </section>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import AButton from '~/components/_ui/a-button.vue';
import IconBack from '~/components/_icons/IconBack.vue';
import ArticlesCard from '~/components/Articles/Card.vue';
import ReviewCard from '~/components/Review/Card.vue';

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  isArticle: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'Читать также',
  },
  linkPath: {
    type: String,
    default: null,
  },
});

const containerRef = ref(null);
const swiperSettings = {
  slidesPerView: 'auto',
  spaceBetween: 40,
  scrollbar: true,
  freeMode: true,
  scrollbar: {
    draggable: true,
  },
  injectStyles: [
    `
    .swiper {
      overflow: visible;
    }

    .swiper-scrollbar.swiper-scrollbar-horizontal {
      position: relative;
      margin-top: 2.5rem;
      height: 0.375rem;
      border-radius: 1.25rem;
      width: 100%;
      left: 0;
      cursor: pointer;
    }

    .swiper-scrollbar-drag {
       background-color: var(--base-blue);
       cursor: grab;
    }
  `,
  ],
};

const swiper = useSwiper(containerRef);
</script>

<style lang="scss">
.recommended-items {
  width: 100%;
  position: relative;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: to-rem(24);

    a .a-title {
      color: var(--base-blue);
    }
  }

  &__buttons {
    display: flex;
    gap: to-rem(12);
  }

  &__button {
    &-icon path {
      fill: var(--base-white);
    }
  }

  swiper-slide {
    display: flex;
    height: auto;
    width: to-rem(288);

    @media (min-width: 768px) {
      width: to-rem(450);
    }

    @media (min-width: 1024px) {
      width: to-rem(357);
    }
  }
}
</style>
