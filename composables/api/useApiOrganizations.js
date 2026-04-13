import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useApiOrganizations = (params, apiKey = 'organizations') => {
  const api = endpoints[apiKey];

  const { listingData, listingMeta } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys[apiKey], () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    select: (data) => {
      listingData.value = Array.isArray(data?.data) ? data.data.map((i) => ({ ...i })) : [];
      listingMeta.value = data?.meta;
      return data?.data;
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
  });

  return query;
};
