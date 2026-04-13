export default async function useApiRequest(request, method, opts, body, headersOpt) {
  const config = useRuntimeConfig();

  const headers = {
    Accept: 'application/vnd.api+json',
    ...headersOpt,
  };

  const { data, error } = await useFetch(request, {
    baseURL: config.public.baseURL,
    headers,
    method,
    ...opts,
    body,
  });

  if (error.value) {
    throw createError({ statusCode: 404, statusMessage: error.value.message });
  }

  if (data?.value) {
    return data.value;
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Error request' });
  }
}
