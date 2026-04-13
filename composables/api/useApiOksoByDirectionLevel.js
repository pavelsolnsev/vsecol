import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';

import { useQuery } from '@tanstack/vue-query';

export const useApiOksoByDirectionLevel = (params, type = 'okso6', options = {}) => {
  const api = `/api/${type}`;

  const query = useQuery({
    queryKey: [...keys[`${type}ByDirectionLevel`], () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    select: (data) => {
      return Array.isArray(data?.data) ? data.data : [];
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
    ...options,
  });

  return query;
};
