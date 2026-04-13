import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useApiPromosBySlug = (slug) => {
  const api = endpoints.promosBySlug + `/${slug}/`;

  const { promoData } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.promosBySlug, slug],
    queryFn: () => useApi()(api),
    select: (data) => {
      promoData.value = data?.data;
      return data?.data;
    },
    placeholderData: (prevData) => prevData,
  });

  return query;
};
