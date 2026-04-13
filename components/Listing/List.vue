<template>
  <section v-if="data?.length" class="listing-list">
    <template v-for="(item, index) in data" :key="item.id">
      <template v-if="index === 3">
        <ClientOnly>
          <div
            v-if="promos?.[0]"
            class="listing-list__item listing-list__item--adv"
          >
            <nuxt-link
              :to="promos[0]?.url"
              class="card-listing card-listing--link"
              :aria-label="promos[0]?.url"
              @click.prevent="sendClick(promos[0], index)"
            ></nuxt-link>
            <!-- eslint-disable vue/no-v-html -->
            <div class="card-listing__container" v-html="promos[0]?.markup"></div>
          </div>
          <template #fallback>
            <ASkeletonLoader height="296" />
          </template>
        </ClientOnly>
      </template>
      <template v-else-if="index === 8">
        <ClientOnly>
          <div
            v-if="promos?.[1]"
            class="listing-list__item listing-list__item--adv"
          >
            <nuxt-link
              :to="promos[1]?.url"
              class="card-listing card-listing--link"
              :aria-label="promos[0]?.url"
              @click.prevent="sendClick(promos[1], index)"
            ></nuxt-link>
            <!-- eslint-disable vue/no-v-html -->
            <div class="card-listing__container" v-html="promos[1]?.markup"></div>
          </div>
          <template #fallback>
            <ASkeletonLoader height="296" />
          </template>
        </ClientOnly>
      </template>
      <template v-else>
        <div
          class="listing-list__item"
          :class="{
            'listing-list__item--prev': index === 2 || index === 7,
          }"
        >
          <ListingCard
            v-if="item"
            :id="item?.id"
            :type="item?.type"
            :type-name="item?.type_name"
            :city-id="item?.city_id"
            :city-name="item?.city?.name"
            :name="item?.name"
            :metro="item?.metro"
            :variant="item?.adv"
            :slug="item?.slug"
            :city-slug="item?.city?.slug"
            :subject-slug="item?.subject?.slug"
            :spec-count="item?.okso_count"
            :point-budget="item?.ege_b"
            :point-pay="item?.ege_p"
            :has-accreditation="item?.has_accreditations"
            :has-parent="item?.has_parent"
            :parent="item?.parent"
            :is-state="item?.is_state"
            :rating="item?.rating"
          />
        </div>
      </template>
    </template>
  </section>
</template>

<script setup>
import ASkeletonLoader from '~/components/_ui/a-skeleton-loader.vue';
import ListingCard from '~/components/Listing/Card.vue';
import { useInfoStore } from '~/store/info';

defineProps({
  data: {
    type: Array,
    required: true,
    default: () => {
      return [];
    },
  },
  promos: {
    type: Array,
    required: true,
    default: () => {
      return [];
    },
  },
  cardType: {
    type: String,
    default: 'default',
  },
});

const storeInfo = useInfoStore();
const ymReach = useYmReachGoal();

const sendClick = async (item, index) => {
  if (index === 3) ymReach('listing_top');
  if (index === 8) ymReach('listing_down');

  await $fetch('/api/clicks', {
    method: 'POST',
    params: {
      entity_type: 'Promo',
      entity_id: item.id,
      cid: storeInfo.cid,
    },
  })
    .then((res) => {
      if (res.data.success)
        return navigateTo(
          {
            path: item?.url,
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
.listing-list {
  &__item {
    position: relative;
    padding: to-rem(24) 0;
    border-bottom: to-rem(1) solid var(--base-gray-selection);

    &:first-child {
      padding-top: 0;
      border-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
      border-bottom: to-rem(1) solid transparent;
    }

    &--prev {
      // stylelint-disable-next-line
      border-bottom: to-rem(1) solid transparent !important;
    }

    &--adv {
      position: relative;
      margin-right: to-rem(-20);
      margin-left: to-rem(-20);
      padding: to-rem(24) to-rem(20);
      background-color: var(--base-gray-smoky);
      // stylelint-disable-next-line
      border-top: to-rem(1) solid transparent !important;
      // stylelint-disable-next-line
      border-bottom: to-rem(1) solid transparent !important;

      @media (min-width: 767px) {
        margin-right: to-rem(-40);
        margin-left: to-rem(-40);
        padding: to-rem(24) to-rem(40);
      }

      @media (min-width: 1024px) {
        margin-right: 0;
        margin-left: 0;
        padding: to-rem(24) to-rem(16);
      }
    }
  }
}
</style>
