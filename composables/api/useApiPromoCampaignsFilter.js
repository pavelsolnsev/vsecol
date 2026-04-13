import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';

export const useApiPromoCampaignsFilter = (params) => {
  const api = endpoints.promoCampaignsFilter;

  const query = useQuery({
    queryKey: [...keys.promoCampaignsFilter, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    select: (data) => {
      return Array.isArray(data?.data?.promos)
        ? data.data.promos.map((p) => ({
            id: p.id,
            advertiser: p.advertiser,
            url: p.url,
            image: p.image,
            title: p.title,
            description: p.description,
            advertiser_id: p.advertiser_id,
          }))
        : [];
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
  });

  return query;
};
