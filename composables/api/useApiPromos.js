import { useQuery } from '@tanstack/vue-query';
import { useInfoStore } from '~/store/info';

/**
 * Композабл для загрузки промо-кампаний с использованием TanStack Query
 * @param {Ref<string>} type - Тип организаций ('university' | 'college')
 * @param {Object} routeParams - Параметры маршрута
 * @param {ComputedRef<number>} specLength - Длина spec кода
 * @param {boolean} isCrawler - Флаг бота
 */
export const useApiPromos = (type, routeParams, specLength, isCrawler) => {
  const storeInfo = useInfoStore();

  // type должен быть ref для реактивности
  const typeRef = typeof type === 'string' ? ref(type) : type;

  // Вычисляем spec реактивно
  const spec = computed(() => routeParams.spec || '');

  // Формируем параметры запроса реактивно
  const apiParams = computed(() => ({
    'limit': 3,
    'filters[organization_type]': typeRef.value,
    'filters[okso3_code]': spec.value && specLength.value < 6 ? spec.value : undefined,
    'filters[okso6_code]': spec.value && specLength.value > 5 ? spec.value : undefined,
    'modifiers[okso3_code]': spec.value && specLength.value < 6 ? spec.value : undefined,
    'modifiers[okso6_code]': spec.value && specLength.value > 5 ? spec.value : undefined,
    'cid': storeInfo.cid,
    'count_views': !isCrawler,
    'no_cache': true,
  }));

  // Ключ запроса с учётом type и spec для инвалидации при изменении
  const queryKey = computed(() => ['promoCampaigns', 'under_filter', typeRef.value, spec.value]);

  // useQuery с реактивным ключом
  const query = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      $fetch(`/api/promoCampaigns/under_filter`, {
        params: apiParams.value,
      }),
    select: (response) => {
      // Трансформируем данные
      const promos = Array.isArray(response.data?.promos)
        ? response.data.promos.map((p) => ({
            id: p.id,
            advertiser: p.advertiser,
            url: p.url,
            image: p.image,
            title: p.title,
            description: p.description,
            advertiser_id: p.advertiser_id,
            click_action: p.click_action || null,
            action: p.action || null,
            organization: p.organization,
            logo: p.logo,
            popup_logo: p.popup_logo,
            form_title: p.popup_title,
            erid: p.erid,
          }))
        : [];

      // Удаляем дубликаты по id
      const uniquePromos = promos.filter((promo, index, self) => index === self.findIndex((p) => p.id === promo.id));

      return uniquePromos;
    },
  });

  return query;
};
