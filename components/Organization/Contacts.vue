<template>
  <section class="contacts">
    <ATitle tag="h2" class="contacts__title">Контакты</ATitle>

    <div class="contacts__address">
      Адрес: {{ org?.postal_code }},
      {{ org?.subject?.id !== 77 && org?.subject?.id !== 78 ? org?.subject?.name + ', ' : '' }} г.
      {{ org?.city?.name }},
      {{ org?.address }}
    </div>

    <div class="contacts__connect">
      <div class="contacts__connect-title a-title--h5">Связаться с нами</div>

      <ul class="contacts__list">
        <li v-if="!!org?.url" class="contacts__list-item">
          <Site class="contacts__icon" />
          <nuxt-link :to="convertUrl(org.url, true)" target="_blank" rel="nofollow" external
            ><span @click.prevent="sendClick">{{ convertUrl(org.url) }}</span></nuxt-link
          >
        </li>
        <li v-if="!!org?.email" class="contacts__list-item">
          <Email class="contacts__icon" />
          {{ org.email }}
        </li>
        <li v-if="!!org?.phone" class="contacts__list-item">
          <Phone class="contacts__icon" />
          {{ org.phone }}
        </li>
      </ul>
    </div>
  </section>
</template>
<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import Email from '~/components/_icons/Email.vue';
import Phone from '~/components/_icons/Phone.vue';
import Site from '~/components/_icons/Site.vue';
import { useInfoStore } from '~/store/info';

const storeInfo = useInfoStore();

const props = defineProps({
  org: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const sendClick = async () => {
  await $fetch('/api/clicks', {
    method: 'POST',
    params: {
      entity_type: 'Organization',
      entity_id: props.org?.id,
      cid: storeInfo.cid,
    },
  })
    .then((res) => {
      if (res.data.success)
        return navigateTo(
          {
            path: convertUrl(props.org.url, true),
          },
          {
            external: true,
            open: {
              target: '_blank',
            },
          },
        );
    })
    .catch((error) => {
      console.error(error);
    });
};

const convertUrl = (string, isReturnHref = false) => {
  const url = new URL(string);
  return !isReturnHref ? url.host : url.href;
};
</script>

<style lang="scss" scoped>
.contacts {
  font-size: to-rem(14);

  &__title {
    margin-bottom: to-rem(32);
  }

  &__address {
    margin-bottom: to-rem(24);
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: to-rem(16);

    @media (min-width: 767px) {
      flex-direction: row;
      align-items: center;
      gap: to-rem(24);
    }

    &-item {
      display: flex;
      align-items: center;
    }
  }

  &__connect {
    &-title {
      color: var(--base-gray);
      margin-bottom: to-rem(8);
    }
  }

  &__icon {
    width: to-rem(18);
    height: to-rem(18);
    margin-right: to-rem(8);
  }
}
</style>
