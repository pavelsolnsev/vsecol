import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';

export const useApiClientMe = () => {
  const api = endpoints.clientMe;

  const query = useQuery({
    queryKey: [...keys.clientMe],
    queryFn: () => useApi()(api),
    retry: false,
  });

  return query;
};

export const useApiClientReports = (params) => {
  const api = endpoints.clientReports;

  const query = useQuery({
    queryKey: [...keys.clientReports, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    placeholderData: (prevData) => prevData,
  });

  return query;
};

export const useApiClientReportById = (id) => {
  const query = useQuery({
    queryKey: [...keys.clientReports, () => toValue(id)],
    queryFn: () => {
      const resolvedId = toValue(id);
      return useApi()(`${endpoints.clientReports}/${resolvedId}`);
    },
    enabled: () => !!toValue(id),
    placeholderData: (prevData) => prevData,
  });

  return query;
};
