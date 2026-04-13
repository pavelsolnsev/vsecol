import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useApiLevelsByOrganization = (id, options = {}) => {
  const { organizationLevels } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.levelsByOrganization, toValue(id)],
    queryFn: () => {
      const resolvedId = toValue(id);
      const api = endpoints.levelsByOrganization + `/${resolvedId}/`;
      return useApi()(api);
    },
    select: (data) => {
      organizationLevels.value = Array.isArray(data?.data) ? data.data : [];
      return data?.data;
    },
    ...options,
  });

  return query;
};
