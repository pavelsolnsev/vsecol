import { useMutation } from '@tanstack/vue-query';

/**
 * Базовый композабл для POST запроса к leads API
 * @returns {Object} - { submitLead, isLoading, isError, isSuccess, reset, error }
 */
export const useApiPostLeads = () => {
  return useMutation({
    mutationFn: async ({ params, body }) => {
      return $fetch('/api/leads', {
        method: 'POST',
        params,
        body,
      });
    },
  });
};
