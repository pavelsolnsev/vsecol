import { ref } from 'vue';

export function useTimedRequest(requestFn, options = {}) {
  const { storageKey = 'last_request_timestamp', cooldownHours = 12 } = options;

  const isLoading = ref(false);
  const error = ref(null);
  const data = ref(null);
  const canExecute = ref(true);
  const remainingTime = ref(0);

  const checkCanExecute = () => {
    if (typeof window === 'undefined') return true;

    const lastRequestStr = localStorage.getItem(storageKey);
    if (!lastRequestStr) return true;

    try {
      const lastRequestTime = new Date(lastRequestStr).getTime();
      const currentTime = new Date().getTime();
      const cooldownMs = cooldownHours * 60 * 60 * 1000;

      const timePassed = currentTime - lastRequestTime;
      const timeRemaining = cooldownMs - timePassed;

      if (timeRemaining > 0) {
        canExecute.value = false;
        remainingTime.value = timeRemaining;
        const timer = setInterval(() => {
          remainingTime.value -= 1000;
          if (remainingTime.value <= 0) {
            canExecute.value = true;
            clearInterval(timer);
          }
        }, 1000);
        return false;
      }

      return true;
    } catch {
      return true;
    }
  };

  const getLastRequestInfo = () => {
    if (typeof window === 'undefined') return null;

    const lastRequestStr = localStorage.getItem(storageKey);
    if (!lastRequestStr) return null;

    try {
      const lastRequestDate = new Date(lastRequestStr);
      const nextAvailableDate = new Date(lastRequestDate.getTime() + cooldownHours * 60 * 60 * 1000);

      return {
        lastRequest: lastRequestDate,
        nextAvailable: nextAvailableDate,
        canExecute: new Date() >= nextAvailableDate,
      };
    } catch {
      return null;
    }
  };

  const formatRemainingTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const clearRequestHistory = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(storageKey);
    canExecute.value = true;
    remainingTime.value = 0;
  };

  const execute = async (force = false) => {
    if (!force && !checkCanExecute()) {
      throw new Error(`Запрос можно выполнить только через ${formatRemainingTime(remainingTime.value)}`);
    }

    isLoading.value = true;
    error.value = null;

    try {
      const result = await requestFn();
      data.value = result;

      if (typeof window !== 'undefined') {
        const now = new Date().toISOString();
        localStorage.setItem(storageKey, now);
        canExecute.value = false;
        remainingTime.value = cooldownHours * 60 * 60 * 1000;
      }

      return result;
    } catch (err) {
      error.value = err;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  if (typeof window !== 'undefined') {
    checkCanExecute();
  }

  return {
    execute,
    isLoading,
    error,
    data,
    canExecute,
    remainingTime: computed(() => formatRemainingTime(remainingTime.value)),
    getLastRequestInfo,
    clearRequestHistory,
  };
}
