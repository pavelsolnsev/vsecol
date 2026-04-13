import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

import { useQuery } from '@tanstack/vue-query';

export const useApiOrganizationBySlug = (slug, opts) => {
  const api = `${endpoints.organizationBySlug}/${slug}`;

  const query = useQuery({
    queryKey: [...keys.organizationBySlug, slug, () => toValue(opts)],
    queryFn: () => {
      const resolvedOpts = toValue(opts);
      return useApi()(api, { params: resolvedOpts });
    },
    select: (data) => {
      return data?.data || [];
    },
    placeholderData: (prevData) => prevData,
    api,
    slug,
    opts,
  });

  return query;
};
