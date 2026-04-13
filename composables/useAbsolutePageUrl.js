/**
 * Абсолютный URL текущей страницы без привязки к прод-домену:
 * NUXT_PUBLIC_SITE_URL или origin запроса (SSR) / window (клиент).
 */
export function useAbsolutePageUrl() {
  const route = useRoute();
  const config = useRuntimeConfig();
  const requestURL = import.meta.server ? useRequestURL() : null;

  return computed(() => {
    const site = (config.public.siteUrl || '').replace(/\/$/, '');
    if (site) {
      return site + route.fullPath;
    }
    if (import.meta.client && typeof window !== 'undefined') {
      return window.location.origin + route.fullPath;
    }
    if (requestURL) {
      return requestURL.origin + route.fullPath;
    }
    return '';
  });
}
