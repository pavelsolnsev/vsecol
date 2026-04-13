import { useMutation } from '@tanstack/vue-query';
import useApi from '@/composables/api/_client';
import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

const AUTH_LOGIN_ENDPOINT = endpoints.clients + '/login';

export const useApiPostAuth = () =>
  useMutation({
    mutationKey: [...keys.clients, 'login'],
    mutationFn: (body) => useApi()(AUTH_LOGIN_ENDPOINT, { method: 'POST', body }).then((res) => res?.data || res),
    api: AUTH_LOGIN_ENDPOINT,
  });
