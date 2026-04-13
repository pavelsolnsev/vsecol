import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';
import { useApiStore } from '@/store/api';
import { storeToRefs } from 'pinia';

export const useApiSpecsByOrganization = (id, options = {}) => {
  const { organizationSpecs } = storeToRefs(useApiStore());

  const query = useQuery({
    queryKey: [...keys.specsByOrganization, toValue(id)],
    queryFn: () => {
      const resolvedId = toValue(id);
      const api = endpoints.specsByOrganization + `/${resolvedId}/`;
      return useApi()(api);
    },
    select: (data) => {
      organizationSpecs.value = Array.isArray(data?.data) ? data.data : [];
      return Array.isArray(data?.data) ? data.data : [];
    },
    ...options,
  });

  return query;
};
