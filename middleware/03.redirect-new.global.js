import { useFilterStore } from '~/store/filter';
import { levels } from '~/shared/levels';
import { MIDDLEWARE_EXCLUDED_PAGES, UNIVERSITY_EXCLUDED_PARAMS, COLLEGE_EXCLUDED_PARAMS } from '~/shared/constants';

// Редиректы для новых масок адресов /subjects_subjectName/city_cityName/...

export default defineNuxtRouteMiddleware(async (to) => {
  if (MIDDLEWARE_EXCLUDED_PAGES.includes(to.name)) return;

  const { query, hash } = to;
  const storeFilter = useFilterStore();
  const pathArray = to.path.split('/').filter((n) => n);
  const splittedPathArray = useConvertedToStore(pathArray);

  // Любые новые страницы /vuz/{path} или kolledzh/{path} необходимо добавлять у исключения для переадресации
  if (splittedPathArray.hasOwnProperty('specialties')) return;

  let currentCity = undefined;
  let currentSubject = undefined;

  // Некорректные аттрибуты для вузов в ссылке
  if (
    splittedPathArray.hasOwnProperty('vuz') &&
    Object.keys(splittedPathArray).filter((k) => UNIVERSITY_EXCLUDED_PARAMS.includes(k)).length
  ) {
    throw createError({
      statusCode: 404,
      message: `Invalid attributes`,
      fatal: true,
    });
  }

  // Некорректные аттрибуты для колледжей в ссылке
  if (
    splittedPathArray.hasOwnProperty('kolledzh') &&
    Object.keys(splittedPathArray).filter((k) => COLLEGE_EXCLUDED_PARAMS.includes(k)).length
  ) {
    throw createError({
      statusCode: 404,
      message: `Invalid attributes`,
      fatal: true,
    });
  }

  if (splittedPathArray.hasOwnProperty('city')) {
    currentCity = await storeFilter.fetchCity(splittedPathArray.city.toLowerCase());
  }

  if (splittedPathArray.hasOwnProperty('subject')) {
    currentSubject = await storeFilter.fetchSubject(splittedPathArray.subject.toLowerCase());
  }

  if (splittedPathArray.city === 'undefined' && splittedPathArray.subject === 'undefined') {
    throw createError({
      statusCode: 404,
      message: `City ${splittedPathArray.city} or Subject ${splittedPathArray.subject} Not Found`,
      fatal: true,
    });
  }

  if (splittedPathArray.city === 'undefined') {
    throw createError({
      statusCode: 404,
      message: `City ${splittedPathArray.city} Not Found`,
      fatal: true,
    });
  }

  // Обновляем city только для листинговых страниц
  // Это предотвращает мутацию крошек при переходе на другие страницы
  const isListingRoute = pathArray[0] === 'vuz' || pathArray[0] === 'kolledzh';

  if (isListingRoute) {
    if (splittedPathArray.city) {
      storeFilter.city = currentCity;
    } else {
      storeFilter.city = {};
    }
  }

  // Редирект для адресов без субъекта
  if (
    splittedPathArray.city &&
    !splittedPathArray.subject &&
    splittedPathArray.city !== 'moskva' &&
    splittedPathArray.city !== 'sankt-peterburg'
  ) {
    //const currentCity = splittedPathArray.city && storeFilter.fetchCity(splittedPathArray.city.toLowerCase());
    if (!currentCity) {
      throw createError({
        statusCode: 404,
        message: `City ${splittedPathArray.city} Not Found`,
        fatal: true,
      });
    }
    const nextPath = `/${pathArray[0]}/subject_${currentCity?.subject?.slug}/city_${currentCity.slug}/`;
    const nextRoute = { path: nextPath, query, hash };
    return navigateTo(nextRoute, { redirectCode: 301 });
  }

  // Проверяем наличие субъекта
  if (to.path.toLowerCase().includes('subject_') && splittedPathArray.hasOwnProperty('subject')) {
    //const currentSubject = await storeFilter.fetchSubject(splittedPathArray.subject.toLowerCase());

    if (!currentSubject) {
      throw createError({
        statusCode: 404,
        message: `Subject ${splittedPathArray.subject} Not Found`,
        fatal: true,
      });
    }

    if (currentSubject.slug === 'moskva' || currentSubject.slug === 'sankt-peterburg') {
      const nextPath = `/${pathArray[0]}/city_${currentSubject.slug}/`;
      const nextRoute = { path: nextPath, query, hash };
      return navigateTo(nextRoute, { redirectCode: 301 });
    }
  }

  // Проверяем наличие города
  if (to.path.includes('city_') && splittedPathArray.hasOwnProperty('city')) {
    //const currentCity = splittedPathArray.city && storeFilter.fetchCity(splittedPathArray.city.toLowerCase());
    if (!currentCity) {
      throw createError({
        statusCode: 404,
        message: `City ${splittedPathArray.city} Not Found`,
        fatal: true,
      });
    }
  }

  if (splittedPathArray.hasOwnProperty('level')) {
    const currentLevels = splittedPathArray.hasOwnProperty('vuz') ? levels.vuz : levels.kolledzh;
    const isExist = !!currentLevels.find((level) => level.slug === splittedPathArray.level);

    if (!isExist) {
      if (!currentCity && !currentSubject) {
        const nextPath = `/${pathArray[0]}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }

      if (!!currentCity && !!currentSubject) {
        const nextPath = `/${pathArray[0]}/subject_${currentCity?.subject?.slug}/city_${currentCity.slug}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }

      if (!!currentCity && !currentSubject) {
        const nextPath = `/${pathArray[0]}/city_${currentCity.slug}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }

      if (!currentCity && !!currentSubject) {
        if (currentSubject.slug === 'moskva' || currentSubject.slug === 'sankt-peterburg') {
          const nextPath = `/${pathArray[0]}/city_${currentSubject.slug}/`;
          const nextRoute = { path: nextPath, query, hash };
          return navigateTo(nextRoute, { redirectCode: 301 });
        }

        const nextPath = `/${pathArray[0]}/subject_${currentSubject?.slug}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }
    }
  }

  if (splittedPathArray.hasOwnProperty('direction')) {
    const direction = await storeFilter.fetchDirections(splittedPathArray.direction.toLowerCase());

    if (!direction) {
      if (!currentCity && !currentSubject) {
        const nextPath = `/${pathArray[0]}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }

      if (!!currentCity && !!currentSubject) {
        const nextPath = `/${pathArray[0]}/subject_${currentCity?.subject?.slug}/city_${currentCity.slug}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }

      if (!!currentCity && !currentSubject) {
        const nextPath = `/${pathArray[0]}/city_${currentCity.slug}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }

      if (!currentCity && !!currentSubject) {
        if (currentSubject.slug === 'moskva' || currentSubject.slug === 'sankt-peterburg') {
          const nextPath = `/${pathArray[0]}/city_${currentSubject.slug}/`;
          const nextRoute = { path: nextPath, query, hash };
          return navigateTo(nextRoute, { redirectCode: 301 });
        }

        const nextPath = `/${pathArray[0]}/subject_${currentSubject?.slug}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }
    }
  }

  const urlBooleanAttrs = ['budget', 'military', 'hostel', 'distance', 'atvuz'];

  for (const prop in splittedPathArray) {
    if (urlBooleanAttrs.includes(prop) && splittedPathArray[prop] !== 'true') {
      if (!currentCity && !currentSubject) {
        const nextPath = `/${pathArray[0]}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }

      if (!!currentCity && !!currentSubject) {
        const nextPath = `/${pathArray[0]}/subject_${currentCity?.subject?.slug}/city_${currentCity.slug}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }

      if (!!currentCity && !currentSubject) {
        const nextPath = `/${pathArray[0]}/city_${currentCity.slug}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }

      if (!currentCity && !!currentSubject) {
        if (currentSubject.slug === 'moskva' || currentSubject.slug === 'sankt-peterburg') {
          const nextPath = `/${pathArray[0]}/city_${currentSubject.slug}/`;
          const nextRoute = { path: nextPath, query, hash };
          return navigateTo(nextRoute, { redirectCode: 301 });
        }

        const nextPath = `/${pathArray[0]}/subject_${currentSubject?.slug}/`;
        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }
    }
  }
});
