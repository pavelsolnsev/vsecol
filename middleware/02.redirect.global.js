import { useFilterStore } from '~/store/filter';
import { MIDDLEWARE_EXCLUDED_PAGES } from '~/shared/constants';
import useApiQueryClient from '~/composables/useApiQueryClient';
import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

export default defineNuxtRouteMiddleware(async (to) => {
  if (MIDDLEWARE_EXCLUDED_PAGES.includes(to.name)) return;

  const { query, hash } = to;

  const storeFilter = useFilterStore();
  const pathArray = to.path.split('/').filter((n) => n);

  if (pathArray[0] === '_nuxt') return;
  if (pathArray[1] === 'cities' || pathArray[1] === 'specialties') return;

  if (pathArray[0] === 'vuz' && pathArray[1] === 'city') {
    let nextPath = undefined;

    if (pathArray[2] === 'moskva' || pathArray[2] === 'sankt-peterburg') {
      nextPath = `/vuz/city_${pathArray[2]}`;
      const nextRoute = { path: nextPath, query, hash };
      return navigateTo(nextRoute, { redirectCode: 301 });
    }
  }

  // redirect works only for kolledzh
  if (pathArray[0] === 'kolledzh') {
    let nextPath = undefined;

    // redirect for old region address
    if (pathArray[1] === 'region') {
      const currentSubject = await storeFilter.fetchSubject(pathArray[2].toLocaleLowerCase());

      if (currentSubject && Object.keys(currentSubject).length > 0) {
        nextPath = `/kolledzh/subject_${currentSubject.slug}`;
      } else {
        throw createError({
          statusCode: 404,
          message: `Subject ${pathArray[2]} Not Found`,
          fatal: true,
        });
      }

      const nextRoute = { path: nextPath, query, hash };
      return navigateTo(nextRoute, { redirectCode: 301 });
    }

    // redirect for old city address
    if (pathArray[1] === 'city') {
      if (pathArray[2] === 'moskva' || pathArray[2] === 'sankt-peterburg') {
        nextPath = `/kolledzh/city_` + pathArray[2];
      } else {
        const currentCity = pathArray[2] && (await storeFilter.fetchCity(pathArray[2].toLocaleLowerCase()));

        if (currentCity && Object.keys(currentCity).length > 0) {
          const currentSubject = currentCity.subject.slug;

          nextPath = `/kolledzh/subject_${currentSubject}/city_${currentCity.slug}`;
        } else {
          throw createError({
            statusCode: 404,
            message: `City ${pathArray[2]} Not Found`,
            fatal: true,
          });
        }
      }

      const nextRoute = { path: nextPath, query, hash };
      return navigateTo(nextRoute, { redirectCode: 301 });
    }
  }

  // eslint-disable-next-line max-len
  if ((pathArray[0] === 'kolledzh' || pathArray[0] === 'vuz') && pathArray[1] === 'spec' && isNumber(+pathArray[2])) {
    const nextPath = `/${pathArray[0]}/`;
    const nextRoute = { path: nextPath, query, hash };
    return navigateTo(nextRoute, { redirectCode: 301 });
  }

  if (pathArray[0] === 'kolledzh' || pathArray[0] === 'vuz') {
    const partPathArray = pathArray[1] && pathArray[1].split('_')[0];

    if (
      partPathArray &&
      partPathArray !== 'subject' &&
      partPathArray !== 'city' &&
      partPathArray !== 'direction' &&
      partPathArray !== 'level' &&
      partPathArray !== 'state' &&
      partPathArray !== 'budget' &&
      partPathArray !== 'atvuz' &&
      partPathArray !== 'military' &&
      partPathArray !== 'hostel' &&
      partPathArray !== 'distance' &&
      partPathArray !== 'sort' &&
      partPathArray !== 'spec'
    ) {
      let org = null;
      let nextPath = undefined;

      try {
        const { fetchApiWithQueryClient } = useApiQueryClient();
        const result = await fetchApiWithQueryClient(
          [...keys.organizationsBySlug, partPathArray],
          `${endpoints.organizationsBySlug}/${partPathArray}`
        );
        org = result?.data || null;
      } catch (e) {
        org = null;
      }

      if (org?.id) {
        nextPath = `/org/college_` + org?.id + '/';

        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      } else {
        nextPath = `/kolledzh/`;

        const nextRoute = { path: nextPath, query, hash };
        return navigateTo(nextRoute, { redirectCode: 301 });
      }
    }
  }
});
