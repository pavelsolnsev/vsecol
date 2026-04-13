import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';

export const useApiArticleCategories = (params) => {
  const api = endpoints.articleCategories;

  const query = useQuery({
    queryKey: [...keys.articleCategories, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    placeholderData: (prevData) => prevData,
  });

  return query;
};
