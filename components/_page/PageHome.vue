<template>
  <MainScreen />
  <MainDatabase />
  <MainOrgs :title="orgsColledge.title" :items="orgsColledge.items" />
  <MainOrgs :title="orgsVuz.title" :items="orgsVuz.items" />

      <div class="main-articles">
        <ArticlesRecommended
          v-if="reviews"
          title="Обзоры и рейтинги"
          link-path="/review/"
          :data="reviews"
          :is-article="false"
          class="main-orgs l-wide"
        />
        <ArticlesRecommended
          v-if="articles"
          title="Журнал (демо)"
          link-path="/articles/"
          is-link
          :data="articles"
          is-article
          class="main-orgs l-wide"
        />
      </div>
</template>

<script setup>
import MainScreen from '~/components/Main/Screen.vue';
import MainDatabase from '~/components/Main/Database.vue';
import MainOrgs from '~/components/Main/Orgs.vue';
import ArticlesRecommended from '~/components/Articles/Recommended.vue';
import { useApiArticles } from '~/composables/api/useApiArticles';

const reviewsParams = {
  is_active: true,
  with: 'categories,blocks,vote_counts,view_counts',
  orderBy: '-published_at',
  perPage: 6,
  section: 'reviews',
};

const articlesParams = {
  is_active: true,
  with: 'categories,blocks,vote_counts,view_counts',
  orderBy: '-published_at',
  perPage: 6,
  section: 'articles',
};

const reviewsQuery = useApiArticles(reviewsParams);
const articlesQuery = useApiArticles(articlesParams);

await Promise.all([reviewsQuery.suspense(), articlesQuery.suspense()]);

const reviews = computed(() => reviewsQuery.data.value?.data || null);
const articles = computed(() => articlesQuery.data.value?.data || null);

const orgsColledge = ref({
  title: 'Популярные направления колледжей в России',
  items: [
    {
      title: 'Медицинские колледжи',
      href: '/kolledzh/direction_meditsinskie/',
      icon: 'meditsinskie',
    },
    {
      title: 'Педагогические колледжи',
      href: '/kolledzh/direction_pedagogicheskie/',
      icon: 'pedagogicheskie',
    },
    {
      title: 'Юридические колледжи',
      href: '/kolledzh/direction_yuridicheskie/',
      icon: 'yuridicheskie',
    },
    {
      title: 'Музыкальные колледжи',
      href: '/kolledzh/direction_muzykalnye/',
      icon: 'muzykalnye',
    },
    {
      title: 'Строительные колледжи',
      href: '/kolledzh/direction_stroitelnye/',
      icon: 'stroitelnye',
    },
    {
      title: 'Экономические колледжи',
      href: '/kolledzh/direction_ekonomicheskie/',
      icon: 'ekonomicheskie',
    },
    {
      title: 'Бюджетные колледжи',
      href: '/kolledzh/budget_true/',
      icon: 'byudzhetnyye-kolledzhi',
    },
    {
      title: 'Государственные колледжи',
      href: '/kolledzh/state_true/',
      icon: 'gosudarstvennyye-kolledzhi',
    },
  ],
});

const orgsVuz = ref({
  title: 'Популярные направления вузов в России',
  items: [
    {
      title: 'Медицинские вузы',
      href: '/vuz/direction_meditsinskie/',
      icon: 'meditsinskie-vuzy',
    },
    {
      title: 'Технические вузы',
      href: '/vuz/direction_tehnicheskie/',
      icon: 'tehnicheskie',
    },
    {
      title: 'Юридические вузы',
      href: '/vuz/direction_yuridicheskie/',
      icon: 'yuridicheskiye-vuzy',
    },
    {
      title: 'Военные вузы',
      href: '/vuz/direction_voennye/',
      icon: 'voennye',
    },
    {
      title: 'Педагогические вузы',
      href: '/vuz/direction_pedagogicheskie/',
      icon: 'pedagogicheskiye-vuzy',
    },
    {
      title: 'Театральные вузы',
      href: '/vuz/direction_teatralnye/',
      icon: 'teatralnye',
    },
    {
      title: 'Бюджетные вузы',
      href: '/vuz/budget_true/',
      icon: 'byudzhetnyye-vuzy',
    },
    {
      title: 'Государственные вузы',
      href: '/vuz/state_true/',
      icon: 'gosudarstvennyye-vuzy',
    },
  ],
});
</script>

<style lang="scss" scoped>
.main-articles {
  overflow: hidden;
}
</style>