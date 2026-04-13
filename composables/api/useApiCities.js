import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useFilterStore } from '@/store/filter';
import { storeToRefs } from 'pinia';

export const useApiCities = (params) => {
  const api = endpoints.cities;

  const { cities } = storeToRefs(useFilterStore());

  const query = useQuery({
    queryKey: [...keys.cities, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    select: (data) => {
      cities.value = Array.isArray(data?.data) ? data.data : [];
      return Array.isArray(data?.data) ? data.data : [];
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
  });

  return query;
};
