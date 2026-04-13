import useApi from '@/composables/api/_client';

import { useQuery } from '@tanstack/vue-query';

export const useApiOksoByCode = (code, type = 'okso6', options = {}) => {
  const getApi = () => {
    const resolvedType = toValue(type) || 'okso6';
    return `/api/${resolvedType}ByCode`;
  };

  const query = useQuery({
    queryKey: ['oksoByCode', () => toValue(type), () => toValue(code)],
    queryFn: () => {
      const resolvedCode = toValue(code);
      return useApi()(`${getApi()}/${resolvedCode}`, options.params ? { params: toValue(options.params) } : {});
    },
    select: (data) => data?.data || null,
    enabled: () => !!toValue(code),
    placeholderData: (prevData) => prevData,
  });

  return query;
};
