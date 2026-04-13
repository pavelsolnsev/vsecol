<template>
  <PPage css-class="article">
    <ABreadcrumb :items="breadcrumbs" class="mb-8" />

    <div class="p-article__wrapper">
      <div class="p-article__left">
        <aside class="p-article__aside">
          <Nuxt-link to="/articles/" class="p-article__back"
            ><IconBack class="p-article__back-icon" /> Назад</Nuxt-link
          >

          <div class="p-article__section">
            <div class="p-article__section-header">На этой странице</div>

            <ul v-if="blocks?.length" class="p-article__anchors">
              <li v-for="block in blocks" :key="block.id">
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

            <ArticlesAuthor
              :name="author?.name"
              :description="author?.description"
              :image="author?.image?.url"
            />
          </div>
        </aside>
      </div>

      <section class="p-article__container">
        <div class="p-article__meta">
          <div class="p-article__meta-part">
            <div class="p-article__meta-tag">
              <ArticleDate class="p-article__meta-icon" />
              <span class="p-article__meta-value">{{ convertedDate }}</span>
            </div>
            <div class="p-article__meta-tag">
              <ArticleWatches class="p-article__meta-icon" />
              <span class="p-article__meta-value">{{ articleData?.view_counts.all }}</span>
            </div>
          </div>
          <div class="p-article__meta-part">
            <div
              class="p-article__meta-tag vote"
              :class="{ 'vote--active': activeVote === 'like' }"
              @click="vote('like')"
            >
              <ArticleLike class="p-article__meta-icon" />
              <span class="p-article__meta-value">{{ vote_counts?.likes }}</span>
            </div>
            <div
              class="p-article__meta-tag vote"
              :class="{ 'vote--active': activeVote === 'dislike' }"
              @click="vote('dislike')"
            >
              <ArticleDislike class="p-article__meta-icon" />
              <span class="p-article__meta-value">{{ vote_counts?.dislikes }}</span>
            </div>
          </div>
        </div>

        <ATitle tag="h1" class="mb-8">{{ articleData?.name }}</ATitle>

        <ArticlesContents
          class="p-article__contents"
          :author="author"
          :categories="categories"
          :article-blocks="blocks"
        />

        <figure v-if="articleData.image" class="p-article__figure">
          <picture v-if="articleData.image" class="p-article__picture">
            <source :srcset="articleData?.image.url" :type="articleData?.image?.mime" />
            <NuxtImg :src="articleData?.image.url" loading="lazy" :alt="articleData?.name" class="p-article__image"
          /></picture>
        </figure>

        <div v-if="false" class="p-article__description">{{ article?.description }}</div>

        <div v-if="blocks?.length" class="p-article__content">
          <template v-for="block in blocks" :key="block.id">
            <div v-if="block.type === 'text'" class="p-article__paragraph">
              <component
                :is="block.data?.url ? 'a' : 'div'"
                :href="block.data?.url"
                :target="isExternalUrl(block.data?.url) ? '_blank' : undefined"
                :rel="isExternalUrl(block.data?.url) ? 'nofollow' : undefined"
              >
                <ATitle
                  v-if="block.data?.header"
                  :id="block?.id"
                  class="p-article__paragraph-header"
                  :class="block.data?.url && 'p-article__paragraph-header-link'"
                  tag="h2"
                  >{{ block?.data.header }}</ATitle
                >
              </component>

              <!-- eslint-disable vue/no-v-html -->
              <div class="p-article__paragraph-content" v-html="block?.data.content"></div>
            </div>
            <div v-if="block.type === 'image' && block.image" class="p-article__paragraph">
              <figure>
                <picture class="p-article__picture">
                  <source :srcset="block.image.url" :type="block.image.mime" />
                  <NuxtImg :src="block.image.url" loading="lazy" :alt="block.data.alt" class="p-article__image"
                /></picture>
                <figcaption v-if="block.data.copyright" class="p-article__caption">
                  Фото: {{ block.data.copyright }}
                </figcaption>
              </figure>
            </div>
          </template>
        </div>
      </section>
    </div>

    <ArticlesRecommended :data="convertRecommendedData" />
  </PPage>
</template>

<script setup>
import { useApiStore } from '~/store/api';
import { useInfoStore } from '~/store/info';
import { useApiArticle } from '@/composables/api/useApiArticle.js';
import { useApiArticles } from '~/composables/api/useApiArticles';
import useSortArrayByField from '~/composables/useSortArrayByField';
import ABreadcrumb from '~/components/_ui/a-breadcrumb.vue';
import IconBack from '~/components/_icons/IconBack.vue';
import ArticleDate from '~/components/_icons/ArticleDate.vue';
import ArticleWatches from '~/components/_icons/ArticleWatches.vue';
import ArticleLike from '~/components/_icons/ArticleLike.vue';
import ArticleDislike from '~/components/_icons/ArticleDislike.vue';
import ATitle from '~/components/_ui/a-title.vue';
import PPage from '~/components/_ui/p-page.vue';
import ArticlesContents from '~/components/Articles/Contents.vue';
import ArticlesCategories from '~/components/Articles/Categories.vue';
import ArticlesAuthor from '~/components/Articles/Author.vue';
import ArticlesRecommended from '~/components/Articles/Recommended.vue';

const route = useRoute();
const storeInfo = useInfoStore();

const { articleData, articleBlocks } = storeToRefs(useApiStore());

const breadcrumbs = computed(() => [
  {
    title: 'Главная',
    path: '/',
  },
  {
    title: `Журнал абитуриента`,
    path: `/articles/`,
  },
  {
    title: `${articleData.value?.name}`,
    path: ``,
  },
]);

const articleParams = computed(() => ({
  with: 'image,blocks,categories,author,author.image,vote_counts,view_counts',
  cid: storeInfo.currentCID,
  count_views: true,
}));

const articleQuery = useApiArticle(route.params.slug, articleParams);
await articleQuery.suspense();

if (!articleData.value || articleData.value?.section !== 'articles') {
  throw createError({
    statusCode: 404,
    statusMessage: '--- Article Not Found ---',
    fatal: true,
  });
}

const author = articleData.value.author || {};
const categories = articleData.value.categories || [];
const vote_counts = ref(articleData.value?.vote_counts);
const blocks = computed(() => useSortArrayByField(articleBlocks.value, 'sort'));

const convertedDate = computed(() =>
  new Date(articleData.value.published_at).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }),
);

const recommendedParams = computed(() =>
  categories?.length
    ? {
        is_active: true,
        with: 'categories,blocks,vote_counts,view_counts',
        orderBy: '-published_at',
        perPage: 6,
        section: 'articles',
        category_slug: categories[0].slug,
      }
    : null,
);

const recommendedQuery = useApiArticles(recommendedParams);
await recommendedQuery.suspense();

const convertRecommendedData = computed(() => {
  const data = recommendedQuery.data.value?.data || [];
  return data.filter((el) => el.id !== articleData?.value?.id);
});

const activeVote = ref(undefined);

const vote = async (action) => {
  try {
    const result = await $fetch(`/api/articles/${articleData.value?.id}/vote`, {
      method: 'POST',
      params: {
        cid: storeInfo.currentCID,
        action: action,
      },
    });

    vote_counts.value = result?.vote_counts;
    activeVote.value = result?.data?.action;
  } catch (error) {
    console.error(error);
  }
};

const scrollToAnchor = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo({ top: y, behavior: 'smooth' });
};

const isExternalUrl = (url) => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

useSeoMeta({
  title: articleData.value?.name,
  description: articleData.value?.description || '',
});
</script>

<style lang="scss">
.p-article {
  &__contents {
    margin-bottom: to-rem(32);

    @media (min-width: 1440px) {
      display: none !important;
    }
  }

  &__back {
    color: to-rem(16);
    line-height: to-rem(24);
    color: var(--base-blue-dark);
    display: flex;
    align-items: center;
    margin-bottom: to-rem(40);

    &-icon {
      margin-right: to-rem(10);
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: row;
    margin-bottom: to-rem(40);
  }

  &__section {
    padding-bottom: to-rem(24);
    margin-bottom: to-rem(24);
    border-bottom: to-rem(1) solid #cfd3d8;

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: 0px solid #cfd3d8;
    }

    &-header {
      color: var(--base-black);
      font-weight: 700;
      font-size: to-rem(18);
      line-height: to-rem(24);
      margin-bottom: to-rem(16);
    }
  }

  &__anchors {
    li {
      margin-bottom: to-rem(12);

      &:last-child {
        margin-bottom: 0;
      }
    }
    a {
      color: var(--base-blue);
      font-size: to-rem(14);
      line-height: to-rem(18);
    }
  }

  &__left {
    display: none;
    width: to-rem(287);
    position: relative;
    margin-right: to-rem(48);

    @media (min-width: 1440px) {
      display: block;
    }
  }

  &__aside {
    top: to-rem(120);
    position: sticky;
  }

  &__container {
    flex: 1;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: to-rem(16);
    margin-bottom: to-rem(32);

    &-part {
      display: flex;
      gap: to-rem(8);
    }

    &-tag {
      padding: to-rem(8) to-rem(10);
      color: var(--base-gray);
      display: flex;
      background-color: var(--base-gray-smoky);
      border-radius: to-rem(8);
    }

    &-icon {
      width: to-rem(16);
      height: to-rem(16);
      margin-top: to-rem(3);
      margin-right: to-rem(8);
    }

    &-value {
      font-size: to-rem(16);
      line-height: to-rem(24);
    }
  }

  &__figure {
    margin-bottom: to-rem(32);
  }

  &__picture {
    border-radius: to-rem(8);
    overflow: hidden;
  }

  &__caption {
    color: var(--base-gray);
    font-size: to-rem(12);
    line-height: 150%;
    text-align: center;
    margin-top: to-rem(12);
  }

  &__image {
    width: 100%;
  }

  &__description {
    margin-bottom: to-rem(32);
  }

  &__paragraph {
    margin-bottom: to-rem(32);

    &-header {
      margin-bottom: to-rem(16);

      &-link {
        color: var(--base-blue) !important;
      }
    }

    &-content {
      a {
        color: var(--base-blue);
      }

      blockquote {
        position: relative;
        padding: to-rem(62) to-rem(16) to-rem(16);
        font-size: to-rem(14);
        font-weight: 700;
        line-height: to-rem(18);
        border-radius: to-rem(8);
        margin-bottom: to-rem(32);
        background-color: var(--base-gray-smoky);

        &:before {
          content: '';
          background-size: to-rem(32) to-rem(30);
          background-image: url('~/assets/icons/quote.svg');
          position: absolute;
          left: to-rem(16);
          top: to-rem(16);
          width: to-rem(32);
          height: to-rem(30);
        }

        @media (min-width: 767px) {
          font-size: to-rem(16);
          line-height: to-rem(24);
          padding: to-rem(24) to-rem(24) to-rem(24) to-rem(80);

          &:before {
            content: '';
            background-size: to-rem(40) to-rem(38);
            left: to-rem(24);
            top: to-rem(24);
            width: to-rem(40);
            height: to-rem(38);
          }
        }

        p {
          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      strong {
        font-weight: 600;
      }

      h2 {
        font-size: to-rem(20);
        line-height: to-rem(24);
        font-weight: 700;
        margin-bottom: 1em;

        @media (min-width: 767px) {
          font-size: to-rem(24);
          line-height: to-rem(32);
        }
      }

      h3 {
        font-size: to-rem(18);
        line-height: to-rem(22);
        font-weight: 700;
        margin-bottom: 1em;

        @media (min-width: 767px) {
          font-size: to-rem(18);
          line-height: to-rem(22);
        }
      }

      p {
        margin-bottom: 1em;
      }

      ul,
      ol {
        margin-bottom: 1em;
        list-style: none;
      }

      ul li {
        position: relative;
        margin-bottom: to-rem(12);
        padding-left: to-rem(14);
      }

      ul {
        counter-reset: custom-counter;
      }

      ol {
        counter-reset: custom-counter;
      }

      ol ol li {
        padding-left: to-rem(32);
      }

      ol li {
        margin-bottom: to-rem(12);
        padding-left: to-rem(20);
        position: relative;
        counter-increment: custom-counter;

        &::before {
          font-weight: bold;
          color: var(--base-blue);
          margin-right: to-rem(8);
          content: counters(custom-counter, '.') '. ';
          position: absolute;
          left: 0;
          top: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }

      ul li {
        &::before {
          content: '';
          width: to-rem(6);
          height: to-rem(6);
          background-color: var(--base-blue);
          border-radius: 100%;

          position: absolute;
          left: 0;
          top: to-rem(6);
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

.vote {
  &--active,
  &:hover {
    color: var(--base-white);
    cursor: pointer;
    background-color: var(--base-blue);

    svg {
      path {
        fill: var(--base-white);
      }
    }
  }
}
</style>