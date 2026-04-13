import { useMutation } from '@tanstack/vue-query';
import useApi from '@/composables/api/_client';
import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

const AUTH_CODE_ENDPOINT = endpoints.clients + '/code';

export const useApiPostAuthCode = () =>
  useMutation({
    mutationKey: [...keys.clients, 'code'],
    mutationFn: (body) => useApi()(AUTH_CODE_ENDPOINT, { method: 'POST', body }).then((res) => res?.data || res),
    api: AUTH_CODE_ENDPOINT,
  });
