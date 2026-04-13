import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';

export const useApiQuizDataList = (params) => {
  const api = endpoints.quizData;

  const query = useQuery({
    queryKey: [...keys.quizData, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    placeholderData: (prevData) => prevData,
  });

  return query;
};

export const useApiQuizDataById = (id) => {
  const query = useQuery({
    queryKey: [...keys.quizData, () => toValue(id)],
    queryFn: () => {
      const resolvedId = toValue(id);
      return useApi()(`${endpoints.quizData}/${resolvedId}`);
    },
    enabled: () => !!toValue(id),
    placeholderData: (prevData) => prevData,
  });

  return query;
};
