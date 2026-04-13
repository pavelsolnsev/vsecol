import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';

export const useApiProfessionsBySlug = (slug, params) => {
  const api = endpoints.professionsBySlug + `/${slug}`;
  const { professionsBySlug } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.professionsBySlug, params, slug],
    queryFn: () => useApi()(api, { params: params.value }).then((res) => res),
    select: (data) => {
      professionsBySlug.value = data;
      return data;
    },
    api,
    params,
  });

  return query;
};
