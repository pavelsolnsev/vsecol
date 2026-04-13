import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useCalcOrganizations = (params) => {
  const api = endpoints.calcOrganizations;

  const { calcOrganizations } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.calcOrganizations, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    select: (data) => {
      calcOrganizations.value = data?.data || null;
      return data?.data || null;
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
  });

  return query;
};
