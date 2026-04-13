import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useApiOrganizationsById = (id, params) => {
  const api = endpoints.organizations + `/${id}/`;

  const { orgData } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.organizations, id, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()(api, { params: resolvedParams });
    },
    select: (data) => {
      orgData.value = data?.data;
      return data?.data;
    },
    placeholderData: (prevData) => prevData,
    api,
    params,
  });

  return query;
};
