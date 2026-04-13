import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';

export const useApiSubjects = (params) => {
  const api = endpoints.subjects;

  const query = useQuery({
    queryKey: [...keys.subjects, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    placeholderData: (prevData) => prevData,
  });

  return query;
};
