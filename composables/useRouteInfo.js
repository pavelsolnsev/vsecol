/**
 * Composable для получения информации о маршруте
 *
 * Использует route.path напрямую для синхронного определения типа страницы.
 * Это предотвращает мутацию данных при переходе между страницами.
 */
export const useRouteInfo = () => {
  const route = useRoute();

  // Первый сегмент пути (vuz, kolledzh, articles, review и т.д.)
  const routeSegment = computed(() => route.path.split('/')[1] || '');

  // Флаги типа страницы
  const isVuz = computed(() => routeSegment.value === 'vuz');
  const isKolledzh = computed(() => routeSegment.value === 'kolledzh');
  const isListingPage = computed(() => isVuz.value || isKolledzh.value);
  const isIndexPage = computed(() => route.path === '/' || route.path === '');

  // Подстраницы листинга
  const isSpecialtiesPage = computed(() => route.path.split('/')[2] === 'specialties');
  const isCitiesPage = computed(() => route.path.split('/')[2] === 'cities');

  // Текущий путь (vuz/kolledzh)
  const currentPath = computed(() => routeSegment.value);

  // Название в именительном падеже - "Вузы", "Колледжи"
  const pageTitle = computed(() => {
    if (isVuz.value) return 'Вузы';
    if (isKolledzh.value) return 'Колледжи';
    return '';
  });

  // Родительный падеж (кого? чего?) - "вузов", "колледжей"
  const pageTitleGenitive = computed(() => {
    if (isVuz.value) return 'вузов';
    if (isKolledzh.value) return 'колледжей';
    return '';
  });

  // Предложный падеж (о ком? в чём?) - "вузах", "колледжах"
  const pageTitlePrepositional = computed(() => {
    if (isVuz.value) return 'вузах';
    if (isKolledzh.value) return 'колледжах';
    return '';
  });

  // Единственное число именительный - "вуз", "колледж"
  const pageTitleSingular = computed(() => {
    if (isVuz.value) return 'вуз';
    if (isKolledzh.value) return 'колледж';
    return '';
  });

  return {
    // Флаги
    isVuz,
    isKolledzh,
    isListingPage,
    isIndexPage,
    isSpecialtiesPage,
    isCitiesPage,
    // Пути
    routeSegment,
    currentPath,
    // Названия в разных падежах
    pageTitle,
    pageTitleGenitive,
    pageTitlePrepositional,
    pageTitleSingular,
  };
};
