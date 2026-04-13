import useApi from '@/composables/api/_client';
import useSortArrayByField from '@/composables/useSortArrayByField';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useApiPromoFilter = (params) => {
  const api = endpoints.promoCampaignsFilter;

  const { promoFilter } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.promoCampaignsFilter, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    staleTime: 0,
    cacheTime: 0,
    select: (data) => {
      const list = Array.isArray(data?.data) ? useSortArrayByField(data.data.promos, 'id') : [];
      promoFilter.value = list;
      return list;
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
  });

  return query;
};
