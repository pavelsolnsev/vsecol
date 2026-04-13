import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';

import { useQuery } from '@tanstack/vue-query';

export const useApiAdvertiser = (id) => {
  const query = useQuery({
    queryKey: [...keys.advertiser, () => toValue(id)],
    queryFn: () => {
      const resolvedId = toValue(id);
      return useApi()(`/api/advertisers/${resolvedId}`, { params: { with: 'city' } });
    },
    select: (data) => data?.data,
  });

  return query;
};
