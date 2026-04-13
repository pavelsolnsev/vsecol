<template>
  <NuxtLayout name="404">
    <div class="p-error">
      <div class="p-first">
        <div class="p-first__container l-wide">
          <div class="p-first__part">
            <h1 class="p-first__title">
              <span>К сожалению,</span> <span>запрашиваемой</span> <span>Вами страницы</span> не существует
            </h1>
            <p>Вы можете <a href="/" class="p-first__link">Вернуться на главную</a></p>
          </div>
          <div class="p-first__part">
            <NuxtImg
              src="/images/404.webp"
              alt="Страница не найдена"
              class="p-first__pictire"
              :preload="{ fetchPriority: 'high' }"
            />
          </div>
        </div>
      </div>
      <div class="p-interest">
        <div class="p-interest__container l-wide">
          <ATitle tag="h2" class="p-interest__title">Возможно вас заинтересует</ATitle>
          <div class="p-interest__block p-interest__flex">
            <div class="p-interest__part p-interest__indent">
              <ATitle tag="h3" class="p-interest__subtitle">Колледжи список городов</ATitle>
              <div class="p-interest__flex p-interest__flex-1">
                <ul class="p-interest__list">
                  <li v-for="(city, index) in citiesOne" :key="index" class="p-interest__list-item">
                    <nuxt-link :to="`/kolledzh${city.link}`">{{ city.name }}</nuxt-link>
                  </li>
                </ul>
                <ul class="p-interest__list">
                  <li v-for="(city, index) in citiesTwo" :key="index" class="p-interest__list-item">
                    <nuxt-link :to="`/kolledzh${city.link}`">{{ city.name }}</nuxt-link>
                  </li>
                </ul>
                <ul class="p-interest__list">
                  <li v-for="(city, index) in citiesThree" :key="index" class="p-interest__list-item">
                    <nuxt-link :to="`/kolledzh${city.link}`">{{ city.name }}</nuxt-link>
                  </li>
                </ul>
              </div>
              <router-link to="/kolledzh/" class="p-interest__link">Все города ⟶</router-link>
            </div>
            <div class="p-interest__part">
              <NuxtImg src="/images/404-1@x2.webp" alt="Колледжи список городов" loading="lazy" />
            </div>
          </div>
          <div class="p-interest__block p-interest__flex">
            <div class="p-interest__part p-interest__bg-1">
              <NuxtImg src="/images/404-2@x2.webp" alt="Вузы список городов" loading="lazy" />
            </div>
            <div class="p-interest__part p-interest__indent">
              <ATitle tag="h3" class="p-interest__subtitle">Вузы список городов</ATitle>
              <div class="p-interest__flex p-interest__flex-1">
                <ul class="p-interest__list">
                  <li v-for="(city, index) in citiesOne" :key="index" class="p-interest__list-item">
                    <nuxt-link :to="`/vuz${city.link}`">{{ city.name }}</nuxt-link>
                  </li>
                </ul>
                <ul class="p-interest__list">
                  <li v-for="(city, index) in citiesTwo" :key="index" class="p-interest__list-item">
                    <nuxt-link :to="`/vuz${city.link}`">{{ city.name }}</nuxt-link>
                  </li>
                </ul>
                <ul class="p-interest__list">
                  <li v-for="(city, index) in citiesThree" :key="index" class="p-interest__list-item">
                    <nuxt-link :to="`/vuz${city.link}`">{{ city.name }}</nuxt-link>
                  </li>
                </ul>
              </div>
              <router-link to="/vuz/" class="p-interest__link">Все города ⟶</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';

// eslint-disable-next-line
const props = defineProps({
  error: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

console.log('error', props.error);

const citiesOne = [
  {
    name: 'Москва',
    link: '/city_moskva/',
  },
  {
    name: 'Санкт-Петербург',
    link: '/subject_sankt-peterburg/city_sankt-peterburg/',
  },
  {
    name: 'Новосибирск',
    link: '/subject_novosibirskaya-oblast/city_novosibirsk/',
  },
  {
    name: 'Екатеринбург',
    link: '/subject_sverdlovskaya-oblast/city_ekaterinburg/',
  },
  {
    name: 'Нижний Новгород',
    link: '/subject_nizhegorodskaya-oblast/city_nizhniy-novgorod/',
  },
  {
    name: 'Казань',
    link: '/subject_respublika-tatarstan/city_kazan/',
  },
];

const citiesTwo = [
  {
    name: 'Челябинск',
    link: '/subject_chelyabinskaya-oblast/city_chelyabinsk/',
  },
  {
    name: 'Омск',
    link: '/subject_omskaya-oblast/city_omsk/',
  },
  {
    name: 'Самара',
    link: '/subject_samarskaya-oblast/city_samara/',
  },
  {
    name: 'Ростов-на-Дону',
    link: '/subject_rostovskaya-oblast/city_rostov-na-donu/',
  },
  {
    name: 'Уфа',
    link: '/subject_respublika-bashkortostan/city_ufa/',
  },
  {
    name: 'Красноярск',
    link: '/subject_krasnoyarskiy-kray/city_krasnoyarsk/',
  },
];

const citiesThree = [
  {
    name: 'Пермь',
    link: '/subject_permskiy-kray/city_perm/',
  },
  {
    name: 'Воронеж',
    link: '/subject_voronezhskaya-oblast/city_voronezh/',
  },
  {
    name: 'Волгоград',
    link: '/subject_volgogradskaya-oblast/city_volgograd/',
  },
  {
    name: 'Краснодар',
    link: '/subject_krasnodarskiy-kray/city_krasnodar/',
  },
  {
    name: 'Саратов',
    link: '/subject_saratovskaya-oblast/city_saratov/',
  },
  {
    name: 'Тюмень',
    link: '/subject_tyumenskaya-oblast/city_tyumen/',
  },
];
</script>

<style lang="scss" scoped>
.p-first {
  padding-top: to-rem(32);
  padding-bottom: to-rem(32);
  background-color: var(--base-gray-second);

  @media (min-width: 767px) {
    padding-top: to-rem(64);
    padding-bottom: to-rem(64);
  }

  &__container {
    display: flex;
    flex-flow: column wrap;

    @media (min-width: 1024px) {
      flex-direction: row;
    }
  }

  &__part {
    width: 100%;

    @media (min-width: 1024px) {
      width: 50%;
    }
  }

  &__title {
    margin-bottom: 40px;
    font-size: to-rem(36);
    font-weight: 700;
    line-height: to-rem(45);

    @media (min-width: 767px) {
      font-size: to-rem(50);
      line-height: to-rem(64);
    }

    @media (min-width: 1024px) {
      margin-top: to-rem(80);
    }

    @media (min-width: 1440px) {
      font-size: to-rem(56);
    }

    span {
      display: block;
    }
  }

  &__link {
    color: var(--base-blue);
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  &__pictire {
    margin-top: to-rem(40);
  }
}

.p-interest {
  padding-top: to-rem(36);
  padding-bottom: to-rem(36);

  @media (min-width: 767px) {
    padding-top: to-rem(72);
    padding-bottom: to-rem(72);
  }

  &__container {
    padding-right: to-rem(24);
    padding-left: to-rem(24);

    @media (min-width: 767px) {
      padding-right: 0;
      padding-left: 0;
    }
  }

  &__flex {
    display: flex;
    flex-flow: column wrap;

    @media (min-width: 767px) {
      flex-direction: row;
    }

    &-1 {
      flex: 1;
    }
  }

  &__part {
    width: 100%;

    @media (min-width: 1024px) {
      width: 50%;
    }
  }

  &__list {
    width: 100%;

    @media (min-width: 767px) {
      width: 33.33%;
    }

    &-item {
      margin-right: to-rem(12);
      margin-bottom: to-rem(16);

      &:last-child {
        @media (min-width: 767px) {
          margin-bottom: 0;
        }
      }
    }
  }

  &__block {
    overflow: hidden;
    margin-bottom: to-rem(24);
    border: to-rem(1) solid var(--base-gray-border);
    border-radius: to-rem(16);
  }

  &__indent {
    display: flex;
    flex-direction: column;
    padding: to-rem(24);
  }

  &__title {
    margin-bottom: to-rem(16);

    @media (min-width: 767px) {
      margin-bottom: to-rem(32);
    }
  }

  &__subtitle {
    margin-bottom: 12px;

    @media (min-width: 767px) {
      margin-bottom: to-rem(24);
    }
  }

  &__link {
    margin-top: to-rem(16);
  }
}

.p-first {
  padding-top: to-rem(32);
  padding-bottom: to-rem(32);
  background-color: var(--base-gray-second);

  @media (min-width: 767px) {
    padding-top: to-rem(64);
    padding-bottom: to-rem(64);
  }

  &__container {
    display: flex;
    flex-flow: column wrap;

    @media (min-width: 1024px) {
      flex-direction: row;
    }
  }

  &__part {
    width: 100%;

    @media (min-width: 1024px) {
      width: 50%;
    }
  }

  &__title {
    margin-bottom: to-rem(40);
    font-size: to-rem(36);
    font-weight: 700;
    line-height: to-rem(45);

    @media (min-width: 767px) {
      font-size: to-rem(50);
      line-height: to-rem(64);
    }

    @media (min-width: 1024px) {
      margin-top: to-rem(80);
    }

    @media (min-width: 1440px) {
      font-size: to-rem(56);
    }

    span {
      display: block;
    }
  }

  &__link {
    color: var(--base-blue);
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  &__pictire {
    margin-top: to-rem(40);
  }
}
</style>
