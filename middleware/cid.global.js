import { useInfoStore } from '~/store/info';

export default defineNuxtRouteMiddleware(() => {
  const storeInfo = useInfoStore();

  const cid = useCookie('cid');

  if (process.client) {
    if (!cid.value) {
      cid.value = useGenerateGUID();
    }
    storeInfo.cid = cid.value;
  }
});
