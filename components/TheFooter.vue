<template>
  <footer class="footer">
    <div class="footer__container l-wide">
      <div class="footer__block footer__block_left">
        <nuxt-link to="/" title="Перейти на главную" class="footer__logo">
          <LogoWhite class="footer__logo__icon" />
        </nuxt-link>

        <div class="footer__copyright footer__copyright--desktop">
          &copy; Демо-проект, {{ useCurrentYear() }}
        </div>
      </div>
      <div class="footer__block footer__block_right">
        <ClientOnly>
          <TheNavigation :items="firstNav" class="footer__navigation" />
          <TheNavigation :items="secondNav" class="footer__navigation" />
        </ClientOnly>
      </div>
      <p class="footer__copyright footer__copyright--mobile">&copy; Демо-проект, {{ useCurrentYear() }}</p>
    </div>
  </footer>
</template>

<script setup>
import LogoWhite from '~/components/_icons/LogoWhite.vue';
import TheNavigation from '~/components/TheNavigation.vue';
import { useInfoStore } from '~/store/info';

const storeInfo = useInfoStore();

const secondNav = reactive(
  [
    {
      name: 'О сайте',
      link: '/about/',
      visible: true,
    },
    {
      name: 'Журнал (демо)',
      link: '/articles/',
      visible: true,
    },
    {
      name: 'Обзоры и рейтинги',
      link: '/review/',
      visible: true,
    },
    {
      name: 'Профессии',
      link: '/professions/',
      visible: true,
    },
  ].filter((i) => !!i.visible),
);

const defaultPages = computed(() =>
  ['', 'about', 'promo', 'ads', 'articles', 'review'].includes(storeInfo.path),
);
const firstNav = computed(() =>
  [
    {
      name: 'Специальности колледжей',
      link: '/kolledzh/specialties/',
      visible: defaultPages.value || storeInfo.isCollege || storeInfo.isOrgCollege,
    },
    {
      name: 'Колледжи в городах',
      link: '/kolledzh/cities/',
      visible: defaultPages.value || storeInfo.isCollege || storeInfo.isOrgCollege,
    },
    {
      name: 'Колледжи дистанционно',
      link: '/kolledzh/distance_true/',
      visible: defaultPages.value || storeInfo.isCollege || storeInfo.isOrgCollege,
    },
    {
      name: 'Колледжи Москвы',
      link: '/kolledzh/city_moskva/',
      visible: storeInfo.isCollege || storeInfo.isOrgCollege,
    },
    {
      name: 'Колледжи Санкт-Петербурга',
      link: '/kolledzh/city_sankt-peterburg/',
      visible: storeInfo.isCollege || storeInfo.isOrgCollege,
    },
    {
      name: 'Специальности вузов',
      link: '/vuz/specialties/',
      visible: defaultPages.value || storeInfo.isUniversity || storeInfo.isOrgUniversity,
    },
    {
      name: 'Вузы в городах',
      link: '/vuz/cities/',
      visible: defaultPages.value || storeInfo.isUniversity || storeInfo.isOrgUniversity,
    },
    {
      name: 'Вузы дистанционно',
      link: '/vuz/distance_true/',
      visible: defaultPages.value || storeInfo.isUniversity || storeInfo.isOrgUniversity,
    },
    {
      name: 'Вузы Москвы',
      link: '/vuz/city_moskva/',
      visible: storeInfo.isUniversity || storeInfo.isOrgUniversity,
    },
    {
      name: 'Вузы Санкт-Петербурга',
      link: '/vuz/city_sankt-peterburg/',
      visible: storeInfo.isUniversity || storeInfo.isOrgUniversity,
    },
  ].filter((bread) => !!bread.visible),
);
</script>

<style lang="scss">
.footer {
  padding: to-rem(48) 0 to-rem(65);
  background-color: var(--base-black-light);

  @media (min-width: 1024px) {
    padding: to-rem(48) 0;
  }

  &__container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (min-width: 767px) {
      flex-direction: row;
    }
  }

  &__block {
    margin-bottom: to-rem(32);

    @media (min-width: 767px) {
      margin-bottom: 0;
    }

    &_left {
      @media (min-width: 767px) {
        margin-right: to-rem(71);
      }
    }

    &_right {
      display: flex;
      flex-direction: column;

      @media (min-width: 767px) {
        flex-direction: row;
      }
    }
  }

  &__logo {
    display: inline-block;
    width: to-rem(232);
    height: to-rem(32);

    @media (min-width: 767px) {
      margin-bottom: to-rem(70);
    }

    &__icon {
      width: to-rem(232);
      height: to-rem(32);
    }
  }

  &__copyright {
    display: block;
    color: var(--base-white);
    font-size: to-rem(14);

    &--desktop {
      display: none;

      @media (min-width: 767px) {
        display: block;
      }
    }

    &--mobile {
      @media (min-width: 767px) {
        display: none;
      }
    }
  }

  &__navigation {
    &:first-child {
      margin-bottom: to-rem(32);

      @media (min-width: 767px) {
        margin-right: to-rem(64);
        margin-bottom: 0;
      }
    }
  }
}
</style>
