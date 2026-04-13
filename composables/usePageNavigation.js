/**
 * Composable для управления навигацией, крошками и заголовками
 */

export const usePageNavigation = () => {
  const route = useRoute();
  const storeInfo = useInfoStore();
  const storeFilter = useFilterStore();

  // Базовая информация о маршруте
  const routeSegment = computed(() => route.path.split('/')[1] || '');
  const isVuz = computed(() => routeSegment.value === 'vuz');
  const isKolledzh = computed(() => routeSegment.value === 'kolledzh');
  const isListingPage = computed(() => isVuz.value || isKolledzh.value);
  const isSpecialtiesPage = computed(() => route.path.split('/')[2] === 'specialties');
  const isCitiesPage = computed(() => route.path.split('/')[2] === 'cities');

  // Названия страниц
  const pageTitle = computed(() => {
    if (isVuz.value) return 'Вузы';
    if (isKolledzh.value) return 'Колледжи';
    return '';
  });

  const pageTitleGenitive = computed(() => {
    if (isVuz.value) return 'вузов';
    if (isKolledzh.value) return 'колледжей';
    return '';
  });

  const pageTitlePrepositional = computed(() => {
    if (isVuz.value) return 'вузах';
    if (isKolledzh.value) return 'колледжах';
    return '';
  });

  const pageTitleSingular = computed(() => {
    if (isVuz.value) return 'вуз';
    if (isKolledzh.value) return 'колледж';
    return '';
  });

  // Логика навигации
  const { isNavigating } = storeToRefs(storeInfo);

  const handleNavigation = (to, from) => {
    const toSegment = to.path.split('/')[1] || '';
    const fromSegment = from.path.split('/')[1] || '';
    const isToListing = toSegment === 'vuz' || toSegment === 'kolledzh';
    const wasFromListing = fromSegment === 'vuz' || fromSegment === 'kolledzh';

    // Устанавливаем флаг навигации при переходе между листингами
    if (wasFromListing && isToListing && to.path !== from.path) {
      storeInfo.isNavigating = true;
    }

    return {
      isToListing,
      wasFromListing,
      shouldShowSkeleton: isNavigating.value,
    };
  };

  // plugin логика для установки данных маршрута
  const handleRouteData = (to) => {
    const excludedPages = ['org-college_id', 'org-university_id', 'promo-slug'];
    if (excludedPages.includes(to.name)) return;

    const pathSegment = to.path.split('/')[1] || '';
    const isListingRoute = pathSegment === 'vuz' || pathSegment === 'kolledzh';

    storeInfo.path = pathSegment;
    storeInfo.isCities = isListingRoute && to.path.split('/')[2] === 'cities';
    storeInfo.isSpecialties = isListingRoute && to.path.split('/')[2] === 'specialties';
    storeInfo.orgType = to.name === 'org' ? to.params.slug?.split('_')[0] || '' : '';
  };

  // Логика сброса сортировки при смене типа страницы
  const handleSortReset = (to, from) => {
    const pathArrayTo = to.path.split('/').filter((n) => n);
    const pathArrayFrom = from.path.split('/').filter((n) => n);

    if (pathArrayTo[0] !== pathArrayFrom[0]) {
      storeFilter.sort = '-okso-count';
    }
  };

  // Логика крошек
  const filterLabels = new Map([
    ['budget', 'Бюджетные'],
    ['atvuz', 'При вузах'],
    ['military', 'С военной кафедрой'],
    ['hostel', 'С общежитием'],
    ['distance', 'Дистанционные'],
  ]);

  const getListingBreadcrumbs = () => {
    if (!isListingPage.value) return [];

    const subjectPath = computed(() => (storeFilter.hasSubject ? `subject_${storeFilter.subjectSlug}/` : ''));
    const cityPath = computed(() => (storeFilter.hasCity ? `city_${storeFilter.city?.slug}/` : ''));

    const stateName = computed(() =>
      storeFilter.currentQuery.state
        ? storeFilter.currentQuery.state === true
          ? 'Государственные'
          : 'Негосударственные'
        : '',
    );

    return [
      {
        title: 'Главная',
        path: '/',
        visible: true,
      },
      {
        title: pageTitle.value + ` России`,
        path: `/${routeSegment.value}/`,
        visible: !!pageTitle.value,
      },
      {
        title: storeFilter.subjectName,
        path: `/${routeSegment.value}/subject_${storeFilter.subjectSlug}/`,
        visible: storeFilter.hasSubject,
      },
      {
        title: `${pageTitle.value + ' ' + storeFilter.city?.name_variations?.p_roditelny}`,
        path: `/${routeSegment.value}/${subjectPath.value}${cityPath.value}`,
        visible: storeFilter.hasCity && storeFilter.city?.name_variations?.p_roditelny && !!pageTitle.value,
      },
      {
        title: storeFilter.directionName,
        path: `/${routeSegment.value}/${subjectPath.value}${cityPath.value}` +
          `direction_${storeFilter.currentQuery.direction}/`,
        visible: !!storeFilter.currentQuery.direction,
      },
      {
        title: storeFilter.levelName,
        path: `/${routeSegment.value}/${subjectPath.value}${cityPath.value}level_${storeFilter.currentQuery.level}/`,
        visible: !!storeFilter.currentQuery.level,
      },
      {
        title: storeFilter.specShortName,
        path: `/${routeSegment.value}/${subjectPath.value}${cityPath.value}` +
          `spec_${storeFilter.currentQuery.spec}/`,
        visible: !!storeFilter.currentQuery.spec,
      },
      {
        title: stateName.value,
        path: `/${routeSegment.value}/${subjectPath.value}${cityPath.value}` +
          `state_${storeFilter.currentQuery.state}/`,
        visible: !!storeFilter.currentQuery.state,
      },
      {
        title: filterLabels.get('budget'),
        path: `/${routeSegment.value}/${subjectPath.value}${cityPath.value}` +
          `budget_${storeFilter.currentQuery.budget}/`,
        visible: !!storeFilter.currentQuery.budget,
      },
      {
        title: filterLabels.get('atvuz'),
        path: `/${routeSegment.value}/${subjectPath.value}${cityPath.value}` +
          `atvuz_${storeFilter.currentQuery.atvuz}/`,
        visible: !!storeFilter.currentQuery.atvuz,
      },
      {
        title: filterLabels.get('military'),
        path: `/${routeSegment.value}/${subjectPath.value}${cityPath.value}` +
          `military_${storeFilter.currentQuery.military}/`,
        visible: !!storeFilter.currentQuery.military,
      },
      {
        title: filterLabels.get('hostel'),
        path: `/${routeSegment.value}/${subjectPath.value}${cityPath.value}` +
          `hostel_${storeFilter.currentQuery.hostel}/`,
        visible: !!storeFilter.currentQuery.hostel,
      },
      {
        title: filterLabels.get('distance'),
        path: `/${routeSegment.value}/${subjectPath.value}${cityPath.value}` +
          `distance_${storeFilter.currentQuery.distance}/`,
        visible: !!storeFilter.currentQuery.distance,
      },
    ].filter((bread) => bread.visible !== false);
  };

  // Крошки для специальностей
  const getSpecialtiesBreadcrumbs = (additionalCrumb = null) => {
    return [
      {
        title: 'Главная',
        path: '/',
      },
      {
        title: pageTitle.value + ` России`,
        path: `/${routeSegment.value}/`,
      },
      {
        title: `Специальности ${pageTitleGenitive.value}`,
        path: `/${routeSegment.value}/specialties/`,
      },
      ...(additionalCrumb ? [additionalCrumb] : []),
    ];
  };

  // Крошки для городов
  const getCitiesBreadcrumbs = () => {
    return [
      {
        title: 'Главная',
        path: '/',
      },
      {
        title: pageTitle.value + ` России`,
        path: `/${routeSegment.value}/`,
      },
      {
        title: pageTitle.value + ` в городах`,
        path: '',
      },
    ];
  };

  // Заголовки для разных страниц
  const getPageTitle = (pageType = 'listing') => {
    switch (pageType) {
      case 'listing':
        return pageTitle.value;
      case 'specialties':
        return `Специальности ${pageTitleGenitive.value} России`;
      case 'cities':
        return `${pageTitle.value} в городах России`;
      default:
        return pageTitle.value;
    }
  };

  // Сброс флага навигации (вызывается после загрузки данных)
  const finishNavigation = () => {
    storeInfo.isNavigating = false;
  };

  return {
    // Флаги
    isVuz,
    isKolledzh,
    isListingPage,
    isSpecialtiesPage,
    isCitiesPage,
    isNavigating,

    // Названия
    pageTitle,
    pageTitleGenitive,
    pageTitlePrepositional,
    pageTitleSingular,

    // Пути
    routeSegment,

    // Методы
    handleNavigation,
    handleRouteData,
    handleSortReset,
    getListingBreadcrumbs,
    getSpecialtiesBreadcrumbs,
    getCitiesBreadcrumbs,
    getPageTitle,
    finishNavigation,
  };
};
