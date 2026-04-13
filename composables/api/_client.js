import { navigateTo } from 'nuxt/app';

export default function useApi(baseurl) {
  const baseURL = baseurl || useRuntimeConfig().public.apiURL;

  return $fetch.create({
    baseURL,
    // eslint-disable-next-line
    onRequest: async ({ request, options }) => {},
    onRequestError: async ({ error }) => {
      // eslint-disable-next-line
      console.error(error);
    },
    onResponseError: async ({ response }) => {
      if (response.status === 401) {
        navigateTo('/');
      } else {
        response.status ? errorHandler(response.status) : errorHandler(408);
      }
    },
  });
}

const errorHandler = (code) => {
  showError({ statusCode: code, message: 'Error' });
  throw createError({
    statusCode: code,
    message: 'Error',
    fatal: true,
  });
};
