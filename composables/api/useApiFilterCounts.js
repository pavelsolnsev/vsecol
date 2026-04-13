import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useApiFilterCounts = (params) => {
  const api = endpoints.filterCounts;

  const { filterCounts } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.filterCounts, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    select: (data) => {
      filterCounts.value = data?.data?.result;
      return data?.data?.result;
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
  });

  return query;
};
