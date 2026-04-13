<template>
  <div class="articles-card" :class="{ '--hover': isHover }">
    <div class="articles-card__container">
      <ArticlesCategories :data="data?.categories" class="articles-card__categories" />

      <div class="articles-card__title">
        <NuxtLink
          :to="`/articles/${data?.slug}/`"
          class="articles-card__link"
          @mouseover="isHover = true"
          @mouseleave="isHover = false"
        >
          <ATitle tag="h2">
            {{ data?.name }}
          </ATitle>
        </NuxtLink>
      </div>
    </div>
    <div class="articles-card__meta">
      <div class="articles-card__meta-part">
        <span class="articles-card__meta-tag"
          ><ArticleDate class="articles-card__meta-icon" /> {{ convertedDate }}</span
        >
        <span v-if="data?.view_counts" class="articles-card__meta-tag">&bull;</span>
        <span v-if="data?.view_counts" class="articles-card__meta-tag"
          ><ArticleWatches class="articles-card__meta-icon" /> {{ data?.view_counts.all }}</span
        >
        <span v-if="data?.time" class="articles-card__meta-tag">&bull;</span>
        <span v-if="data?.time" class="articles-card__meta-tag"
          ><ArticleTime class="articles-card__meta-icon" /> {{ data?.time }}</span
        >
      </div>
      <div class="articles-card__meta-part">
        <span class="articles-card__meta-tag"
          ><ArticleLike class="articles-card__meta-icon" /> {{ data?.vote_counts.likes }}</span
        >
        <span class="articles-card__meta-tag"
          ><ArticleDislike class="articles-card__meta-icon" /> {{ data?.vote_counts.dislikes }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import ArticlesCategories from '~/components/Articles/Categories.vue';
import ArticleDate from '~/components/_icons/ArticleDate.vue';
import ATitle from '~/components/_ui/a-title.vue';
import ArticleWatches from '~/components/_icons/ArticleWatches.vue';
import ArticleTime from '~/components/_icons/ArticleTime.vue';
import ArticleLike from '~/components/_icons/ArticleLike.vue';
import ArticleDislike from '~/components/_icons/ArticleDislike.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const isHover = ref(false);

const convertedDate = computed(() =>
  new Date(props.data.published_at).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }),
);
</script>

<style lang="scss" scoped>
.articles-card {
  border-radius: to-rem(8);
  padding: to-rem(16);
  background-color: var(--base-gray-smoky);
  min-height: to-rem(190);
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease-in;

  @media (min-width: 767px) {
    min-height: to-rem(194);
  }

  @media (min-width: 1024px) {
    padding: to-rem(24);
    min-height: to-rem(258);
  }

  &.--hover {
    background-color: var(--base-gray-border);
  }

  &__container {
    flex: 1;
  }

  &__categories {
    margin-bottom: to-rem(20);

    @media (min-width: 767px) {
      margin-bottom: to-rem(16);
    }
  }

  &__link h2 {
    color: var(--base-blue);
    font-weight: 700;
    font-size: to-rem(20);
    line-height: 120%;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 767px) {
      font-size: to-rem(24);
      line-height: 133%;
    }
  }

  &__categories {
    gap: to-rem(8);
    display: flex;
    flex-wrap: wrap;
  }

  &__meta {
    display: flex;
    justify-content: space-between;

    &-part {
      gap: to-rem(8);
      display: flex;
      align-items: center;
    }

    &-tag {
      display: flex;
      align-items: center;
      font-size: to-rem(12);
      line-height: 150%;
      color: var(--base-gray);
    }

    &-icon {
      margin-right: to-rem(4);
    }
  }
}
</style>
