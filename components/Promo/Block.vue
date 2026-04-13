<template>
  <section class="promo">
    <div class="promo__top">
      <nuxt-link :to="`/ads/${data.advertiser_id}`" class="promo__tag">
        Реклама
        <Advert class="promo__icon" />
      </nuxt-link>
    </div>
    <div class="promo__container">
      <template v-if="isExternalUrl">
        <NuxtLink :href="data?.url" target="_blank" rel="nofollow" class="promo__info" @click.prevent="sendClick"
          ><NuxtImg v-if="data?.image" :src="data?.image.url" :alt="data?.title" class="promo__image" loading="lazy" />
          <div class="promo__about">
            <span class="promo__title">{{ data?.title }}</span>
            <span class="promo__description">{{ data?.description }}</span>
          </div></NuxtLink
        >
      </template>

      <template v-else>
        <nuxt-link
          :to="{
            path: data?.url,
            query: {
              spec: storeFilter.speciality?.code || undefined,
            },
          }"
          class="promo__info"
          @click.prevent="sendClick"
        >
          <NuxtImg v-if="data?.image" :src="data?.image.url" :alt="data?.title" class="promo__image" loading="lazy" />
          <div class="promo__about">
            <span class="promo__title">{{ data?.title }}</span>
            <span class="promo__description">{{ data?.description }}</span>
          </div>
        </nuxt-link>
      </template>
    </div>
  </section>
</template>

<script setup>
import Advert from '~/components/_icons/Advert.vue';
import { useInfoStore } from '~/store/info';
import { useFilterStore } from '~/store/filter';

const storeInfo = useInfoStore();
const storeFilter = useFilterStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => {
      return {};
    },
  },
});

const isExternalUrl = computed(() => {
  const url = props.data?.url;
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
});

const sendClick = async () => {
  await $fetch('/api/clicks', {
    method: 'POST',
    params: {
      entity_type: 'Promo',
      entity_id: props.data.id,
      cid: storeInfo.cid,
    },
  })
    .then((res) => {
      if (res.data.success)
        return navigateTo(
          {
            path: props.data?.url,
            query: {
              spec: storeFilter.speciality?.code || undefined,
            },
          },
          { external: true },
        );
    })
    .catch((error) => {
      console.error(error);
    });
};
</script>

<style lang="scss">
.promo {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: to-rem(8);

  @media (min-width: 767px) {
    flex-direction: row;
  }

  @media (min-width: 1024px) {
    padding: to-rem(16);
    border: to-rem(1) solid var(--base-gray-border);
  }

  &__top {
    position: absolute;
    top: to-rem(11);
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
    max-width: to-rem(44);
    max-height: to-rem(44);
    margin-bottom: to-rem(16);

    @media (min-width: 767px) {
      margin-right: to-rem(16);
      margin-bottom: 0;
    }
  }
}
</style>
