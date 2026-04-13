import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useCalcSpecialities = (params) => {
  const api = endpoints.calcSpecialities;

  const { calcSpecialities } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.calcSpecialities, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    select: (data) => {
      calcSpecialities.value = data?.data || null;
      return data?.data || null;
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
  });

  return query;
};
