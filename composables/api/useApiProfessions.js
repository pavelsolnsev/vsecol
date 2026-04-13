import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';

export const useApiProfessions = (params) => {
  const api = endpoints.professions;

  const query = useQuery({
    queryKey: [...keys.professions, params],
    queryFn: () =>
      useApi()(api, {
        params: {
          is_active: true,
          orderBy: 'name',
          perPage: 12,
          with: 'categories',
          ...params.value,
        },
      }).then((res) => res),
    api,
    params,
  });

  return query;
};