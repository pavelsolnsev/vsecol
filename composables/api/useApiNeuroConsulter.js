import { useMutation } from '@tanstack/vue-query';
import useApi from '@/composables/api/_client';
import keys from '@/shared/api/keys';
import endpoints from '@/shared/api/endpoints';

const NEURO_CONSULTER_ENDPOINT = endpoints.neuroConsulter;

export const useApiNeuroConsulter = () =>
  useMutation({
    mutationKey: keys.neuroConsulter,
    mutationFn: (body) => useApi()(NEURO_CONSULTER_ENDPOINT, { method: 'POST', body }).then((res) => res?.data || res),
    api: NEURO_CONSULTER_ENDPOINT,
  });
