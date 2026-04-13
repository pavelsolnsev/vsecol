/**
 * reachGoal Яндекс.Метрики только при настроенном NUXT_PUBLIC_YANDEX_METRIKA_ID (клиент).
 */
export function useYmReachGoal() {
  const config = useRuntimeConfig();

  return (goal) => {
    if (!import.meta.client) {
      return;
    }
    const idRaw = config.public.yandexMetrika?.id;
    if (!idRaw) {
      return;
    }
    const id = Number(idRaw);
    if (!Number.isFinite(id)) {
      return;
    }
    if (typeof window === 'undefined' || typeof window.ym !== 'function') {
      return;
    }
    window.ym(id, 'reachGoal', goal);
  };
}
