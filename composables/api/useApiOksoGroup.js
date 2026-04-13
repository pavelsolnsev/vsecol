import useApi from '@/composables/api/_client';

import keys from '@/shared/api/keys';

import { useQuery } from '@tanstack/vue-query';

export const useApiOkso6Group2 = (params, options = {}) => {
  const query = useQuery({
    queryKey: [...keys.okso6Group2, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()('/api/okso6Group2', { params: resolvedParams });
    },
    enabled: options.enabled === undefined ? true : () => toValue(options.enabled),
    placeholderData: (prevData) => prevData,
  });

  return query;
};

export const useApiOkso3Group2 = (params, options = {}) => {
  const query = useQuery({
    queryKey: [...keys.okso3Group2, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()('/api/okso3Group2', { params: resolvedParams });
    },
    enabled: options.enabled === undefined ? true : () => toValue(options.enabled),
    placeholderData: (prevData) => prevData,
  });

  return query;
};

export const useApiOkso6 = (params, options = {}) => {
  const query = useQuery({
    queryKey: [...keys.okso6, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()('/api/okso6/', { params: resolvedParams });
    },
    enabled: options.enabled === undefined ? true : () => toValue(options.enabled),
    placeholderData: (prevData) => prevData,
  });

  return query;
};

export const useApiOkso3 = (params, options = {}) => {
  const query = useQuery({
    queryKey: [...keys.okso3, () => toValue(params)],
    queryFn: () => {
      const resolvedParams = toValue(params);
      return useApi()('/api/okso3/', { params: resolvedParams });
    },
    enabled: options.enabled === undefined ? true : () => toValue(options.enabled),
    placeholderData: (prevData) => prevData,
  });

  return query;
};

export const useApiOkso6ByCode = (code, params, options = {}) => {
  const query = useQuery({
    queryKey: [...keys.okso6ByCode, () => toValue(code), () => toValue(params)],
    queryFn: () => {
      const resolvedCode = toValue(code);
      const resolvedParams = toValue(params);
      return useApi()(`/api/okso6ByCode/${resolvedCode}`, { params: resolvedParams });
    },
    enabled: () => !!toValue(code) && (options.enabled === undefined || toValue(options.enabled)),
    placeholderData: (prevData) => prevData,
  });

  return query;
};

export const useApiOkso3ByCode = (code, params, options = {}) => {
  const query = useQuery({
    queryKey: [...keys.okso3ByCode, () => toValue(code), () => toValue(params)],
    queryFn: () => {
      const resolvedCode = toValue(code);
      const resolvedParams = toValue(params);
      return useApi()(`/api/okso3ByCode/${resolvedCode}`, { params: resolvedParams });
    },
    enabled: () => !!toValue(code) && (options.enabled === undefined || toValue(options.enabled)),
    placeholderData: (prevData) => prevData,
  });

  return query;
};