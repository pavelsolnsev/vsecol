import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import useApi from '@/composables/api/_client';
import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

const USER_ENDPOINT = endpoints.clients + '/me';

export const useApiUser = (tokenRef, enabled = true) => {
  const canRequest = computed(() => Boolean(tokenRef?.value) && enabled);

  return useQuery({
    queryKey: [...keys.clients, 'me', tokenRef],
    queryFn: () =>
      useApi()(USER_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${tokenRef.value}`,
        },
      }).then((res) => res?.data || res),
    enabled: canRequest,
  });
};
