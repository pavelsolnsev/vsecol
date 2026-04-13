<template>
  <section :id="id" class="prof-card-related prof-card-related_bg">
    <header class="prof-card-related__header">
      <ATitle tag="h2" class="prof-card-related__title">Связанные профессии</ATitle>

      <div class="prof-card-related__buttons">
        <AButton variant="primary" class="prof-card-related__button" @click="swiper.prev()">
          <IconButtonArrow class="prof-card-related__button-icon" />
        </AButton>
        <AButton variant="primary" class="prof-card-related__button" @click="swiper.next()">
          <IconButtonArrow class="prof-card-related__button-icon" style="transform: rotate(180deg)" />
        </AButton>
      </div>
    </header>

    <swiper-container
      v-if="relatedItems?.length"
      ref="containerRef"
      class="prof-card-related__items"
      v-bind="swiperSettings"
    >
      <swiper-slide
        v-for="item in relatedItems"
        :key="item.id"
        class="prof-card-related__item"
        @click="goToProfession(item.slug)"
      >
        <div class="prof-card-related__tag">
          {{ parentsId.includes(item.id) ? 'Родительская профессия' : 'Смежная профессия' }}
        </div>
        <div class="prof-card-related__name">{{ item.name }}</div>
      </swiper-slide>
    </swiper-container>
  </section>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import AButton from '~/components/_ui/a-button.vue';
import IconButtonArrow from '../_icons/IconButtonArrow.vue';

const props = defineProps({
  id: { type: String, default: '' },
  parents: { type: Array, default: () => [] },
  children: { type: Array, default: () => [] },
});

const router = useRouter();
const containerRef = ref(null);
const swiper = useSwiper(containerRef);
const swiperSettings = {
  slidesPerView: 'auto',
  spaceBetween: 8,
  freeMode: true,
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

const parentsId = computed(() => props.parents?.map((p) => p.id) || []);
const relatedItems = computed(() => [...props.parents, ...props.children]);

const goToProfession = (profSlug) => {
  router.push({ path: `/professions/${profSlug}` });
};
</script>

<style lang="scss" scoped>
.prof-card-related {
  scroll-margin-top: to-rem(56);
  border-radius: var(--border-radius-x4);

  @media (min-width: 768px) {
    scroll-margin-top: to-rem(66);
  }

  @media (min-width: 1024px) {
    scroll-margin-top: to-rem(76);
  }
  &_bg {
    background-color: var(--base-gray-10);
  }

  &__title {
    margin-bottom: to-rem(24);
    font-size: to-rem(28);
    line-height: to-rem(34);

    @media (min-width: 768px) {
      font-size: to-rem(34);
      line-height: to-rem(42);
    }
  }

  &__buttons {
    display: flex;
    gap: to-rem(10);
  }

  &__button {
    background-color: var(--base-gray-smoky);
    border: none;

    &:hover {
      background-color: var(--base-gray-second);
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__item {
    height: auto;
    min-height: to-rem(168);
    flex-basis: 100%;
    padding: to-rem(16);
    background-color: var(--base-gray-smoky);
    border-radius: var(--border-radius-x2);
    max-width: to-rem(256);
    cursor: pointer;
    transition: background 0.15s ease;

    @media (min-width: 768px) {
      max-width: to-rem(348);
    }

    &:hover {
      background-color: var(--base-gray-border);
    }
  }

  &__tag {
    font-size: to-rem(14);
    line-height: to-rem(22);
    margin-bottom: to-rem(24);
    padding: to-rem(11) to-rem(16);
    background-color: var(--base-white);
    border-radius: to-rem(32);
  }

  &__name {
    font-weight: 700;
    font-size: to-rem(20);
    line-height: to-rem(24);
    color: var(--base-blue);

    @media (min-width: 768px) {
      font-size: to-rem(24);
      line-height: to-rem(32);
    }
  }
}
</style>
