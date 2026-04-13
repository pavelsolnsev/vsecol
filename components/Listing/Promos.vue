<template>
  <template v-if="!loading">
    <ListingPromo
      v-for="promo in promoFilterData"
      :key="promo.id"
      :data="promo"
      class="p-listing__promos-item"
      @click="handlePromoClick"
    />
  </template>
  <template v-else>
    <div v-for="item in 3" :key="item" class="p-listing__promos-item">
      <ASkeletonLoader height="44" />
    </div>
  </template>

  <ModalPromoConsultation
    v-if="showConsultationModal"
    v-model="showConsultationModal"
    :promo-data="selectedPromo"
  />
</template>

<script setup>
import { useFilterStore } from '~/store/filter';
import { isExternalUrl } from '~/composables/useExternalUrl';
import { useApiPromos } from '~/composables/api/useApiPromos';

import ASkeletonLoader from '~/components/_ui/a-skeleton-loader.vue';
import ListingPromo from '~/components/Listing/Promo.vue';
import ModalPromoConsultation from '~/components/Modal/PromoConsultation.vue';

const props = defineProps({
  type: {
    type: String,
    default: 'university',
  },
});

const route = useRoute();
const storeFilter = useFilterStore();
const { isCrawler } = useDevice();

const routeParams = useConvertedToStore(route.params.path) || [];
const specLength = computed(() => routeParams.spec && routeParams.spec.split('.').join('').length);

const showConsultationModal = ref(false);
const selectedPromo = ref(null);

// Передаём type как ref для реактивности
const typeRef = toRef(props, 'type');
const promosQuery = useApiPromos(typeRef, routeParams, specLength, isCrawler);

// Загружаем данные синхронно
await promosQuery.suspense();

// Используем данные напрямую из query (TanStack Query сам синхронизирует SSR/клиент)
const promoFilterData = promosQuery.data;
const { isPending: loading } = promosQuery;

const ymReach = useYmReachGoal();

const sendGoal = (index) => {
  ymReach(`tgb_${index + 1}`);
};

const handlePromoClick = async (promo) => {
  const isPopup = promo.click_action === 'popup' || promo.action === 'popup';

  if (isPopup) {
    // Открываем модальное окно и отправляем goal
    const index = promoFilterData.value.findIndex((p) => p.id === promo?.id);
    if (index !== -1) {
      sendGoal(index);
    }
    openConsultationModal(promo);
  } else {
    // Обычный переход - отправляем goal и переходим по ссылке
    const index = promoFilterData.value.findIndex((p) => p.id === promo?.id);
    if (index !== -1) {
      sendGoal(index);
    }

    // Переход по ссылке (логика из Promo.vue)
    if (promo.url) {
      if (isExternalUrl(promo.url)) {
        window.open(promo.url, '_blank');
      } else {
        await navigateTo({
          path: promo.url,
          query: {
            spec: storeFilter.speciality?.code || undefined,
          },
        });
      }
    }
  }
};

const openConsultationModal = (promo) => {
  selectedPromo.value = promo;
  showConsultationModal.value = true;
};

</script>

<style lang="scss" scoped>
.p-listing__promos-item {
  padding: to-rem(16);
  border-bottom: to-rem(1) solid var(--base-gray-border);

  &:last-child {
    border-bottom: 0;
  }
}
</style>
