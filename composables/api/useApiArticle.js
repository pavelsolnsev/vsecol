import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useApiArticle = (slug, params) => {
  const api = endpoints.article + `/${slug}/`;

  const { articleData } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.article, slug, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    select: (data) => {
      articleData.value = data?.data || null;
      return data?.data || null;
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
  });

  return query;
};
