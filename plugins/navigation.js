/**
 * Универсальный plugin для управления навигацией
 * Работает на сервере (SSR) и клиенте (интерактивность)
 */
export default defineNuxtPlugin(() => {
  const route = useRoute();
  const storeInfo = useInfoStore();

  // Серверная логика - инициализация данных для SSR
  if (import.meta.server) {
    // Инициализируем данные маршрута напрямую для корректного SSR
    const pathSegment = route.path.split('/')[1] || '';
    const isListingRoute = pathSegment === 'vuz' || pathSegment === 'kolledzh';

    storeInfo.path = pathSegment;
    storeInfo.isCities = isListingRoute && route.path.split('/')[2] === 'cities';
    storeInfo.isSpecialties = isListingRoute && route.path.split('/')[2] === 'specialties';
    storeInfo.orgType = route.name === 'org' ? route.params.slug?.split('_')[0] || '' : '';
  }

  // Клиентская логика - обработка навигации
  if (import.meta.client) {
    const router = useRouter();
    const { handleNavigation, handleRouteData, handleSortReset } = usePageNavigation();

    // Обрабатываем навигацию при каждом переходе
    router.beforeEach((to, from) => {
      // Логика навигации
      handleNavigation(to, from);

      // Установка данных маршрута
      handleRouteData(to);

      // Сброс сортировки
      handleSortReset(to, from);
    });
  }
});
