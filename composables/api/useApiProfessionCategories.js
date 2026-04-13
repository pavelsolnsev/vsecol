import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';

export const useApiProfessionCategories = (params) => {
  const api = endpoints.professionCategories;

  const query = useQuery({
    queryKey: [...keys.professionCategories, params],
    queryFn: () => useApi()(api, { params: params }).then((res) => res),
    select: (data) => {
      return Array.isArray(data?.data) ? data.data : [];
    },
    api,
    params,
  });

  return query;
};