import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';

import { useQuery } from '@tanstack/vue-query';

export const useApiArticles = (params) => {
  const api = '/api/articles';

  const query = useQuery({
    queryKey: [...keys.articles, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    placeholderData: (prevData) => prevData,
  });

  return query;
};
