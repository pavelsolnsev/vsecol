import useApi from '@/composables/api/_client';
import useSortArrayByField from '@/composables/useSortArrayByField';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useApiPromoListing = (params) => {
  const api = endpoints.promoCampaignsList;

  const { promoListing } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.promoCampaignsList, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    staleTime: 0,
    cacheTime: 0,
    select: (data) => {
      const mappedData = Array.isArray(data?.data?.promos)
        ? data.data.promos.map((d) => ({
            id: d.id,
            url: d.url,
            type: d.type,
            markup: d.markup,
          }))
        : [];
      const sortedData = useSortArrayByField(mappedData, 'id');

      if (!sortedData?.length) {
        return [];
      }

      promoListing.value = [sortedData[0], sortedData[1]];
      return [sortedData[0], sortedData[1]];
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
  });

  return query;
};
