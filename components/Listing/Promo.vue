<template>
  <div class="listing-promo">
    <div class="listing-promo__top">
      <NuxtLink :to="`/ads/${data.advertiser_id}`" class="listing-promo__tag">
        Реклама
        <Advert class="listing-promo__icon" />
      </NuxtLink>
    </div>
    <div class="listing-promo__container">
      <template v-if="isExternal">
        <NuxtLink
          :href="data?.url"
          target="_blank"
          rel="nofollow"
          class="listing-promo__info"
          @click.prevent="sendClick"
        >
          <NuxtImg
            v-if="data?.image"
            :src="data?.image.url"
            :alt="data?.title"
            width="44"
            height="44"
            class="listing-promo__image"
            loading="lazy"
          />
          <div class="listing-promo__about">
            <ATitle tag="h2" class="listing-promo__title">{{ data?.title }}</ATitle>
            <p class="listing-promo__description">{{ data?.description }}</p>
          </div></NuxtLink
        >
      </template>

      <template v-else>
        <NuxtLink
          :to="internalUrl"
          class="listing-promo__info"
          @click.prevent="sendClick"
        >
          <NuxtImg
            v-if="data?.image"
            :src="data?.image.url"
            :alt="data?.title"
            class="listing-promo__image"
            loading="lazy"
            width="44"
            height="44"
          />
          <div class="listing-promo__about">
            <ATitle tag="h2" class="listing-promo__title">{{ data?.title }}</ATitle>
            <p class="listing-promo__description">{{ data?.description }}</p>
          </div>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<script setup>
import Advert from '~/components/_icons/Advert.vue';
import ATitle from '~/components/_ui/a-title.vue';
import { isExternalUrl } from '~/composables/useExternalUrl';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => {
      return {};
    },
  },
});

const emit = defineEmits(['click']);

const isExternal = computed(() => isExternalUrl(props.data?.url));

const internalUrl = computed(() => {
  const url = props.data?.url;
  const isPopup = props.data?.click_action === 'popup' || props.data?.action === 'popup';

  // Для popup возвращаем #
  if (isPopup) {
    return '#';
  }

  if (!url) {
    return '/';
  }

  // Если внешний URL — возвращаем как есть (но это обработается в v-else, т.к. isExternal=false)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return {
    path: url,
    query: {
      spec: undefined,
    },
  };
});

const sendClick = () => {
  emit('click', props.data);
};
</script>

<style lang="scss">
.listing-promo {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: to-rem(16) 0;

  @media (min-width: 767px) {
    flex-direction: row;
  }

  @media (min-width: 1024px) {
    padding: to-rem(16);
    //border-bottom: to-rem(1) solid var(--base-gray-border);
  }

  &__top {
    position: absolute;
    top: to-rem(28);
    right: 0;
    display: flex;
    justify-content: flex-end;

    @media (min-width: 767px) {
      position: relative;
      top: 0;
      right: 0;
      margin-bottom: 0;
      margin-left: to-rem(8);
      order: 1;
    }
  }

  &__tag {
    display: flex;
    color: var(--base-black);
    font-size: to-rem(14);
  }

  &__logo {
    width: to-rem(44);
    margin-bottom: to-rem(16);

    @media (min-width: 767px) {
      margin-right: to-rem(16);
    }
  }

  &__info {
    flex: 1;

    @media (min-width: 767px) {
      display: flex;
    }
  }

  &__icon {
    display: inline-block;
    width: to-rem(18);
    height: to-rem(18);
  }

  &__title {
    display: block;
    margin-bottom: to-rem(4);
    color: var(--base-blue);
    font-size: to-rem(18);
    font-weight: 700;
    line-height: to-rem(22);
  }

  &__description {
    color: var(--base-black);
    font-size: to-rem(14);
    line-height: to-rem(18);
  }

  &__image {
    width: to-rem(44);
    height: to-rem(44);

    margin-bottom: to-rem(16);

    @media (min-width: 767px) {
      margin-right: to-rem(16);
      margin-bottom: 0;
    }
  }
}
</style>
