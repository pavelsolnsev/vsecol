import { QueryClient } from '@tanstack/vue-query';
import useApi from '@/composables/api/_client';

/**
 * Композабл для выполнения API-запросов через общий API клиент и QueryClient
 * @param {Array} queryKey - Ключ для кэширования запроса
 * @param {string|Function} endpoint - строка эндпоинта или функция, возвращающая промис с данными
 * @param {Object} options - опции запроса (params, body, method)
 * @returns {Promise<any>} - Результат запроса или null в случае ошибки
 */
export default function useApiQueryClient() {
  const fetchApiWithQueryClient = async (queryKey, endpoint, options = {}) => {
    // Получаем общий QueryClient приложения
    const queryClient = new QueryClient();

    // Если endpoint - строка, создаем функцию запроса с использованием общего API клиента
    const queryFn = typeof endpoint === 'string' ? () => useApi()(endpoint, options) : endpoint;

    try {
      // Выполняем запрос через QueryClient
      const data = await queryClient.fetchQuery({
        queryKey,
        queryFn,
      });

      return data;
    } catch (error) {
      console.error('QueryClient error:', error);
      return null;
    } finally {
      // Очищаем клиент, чтобы избежать утечек памяти на сервере
      queryClient.clear();
    }
  };

  return {
    fetchApiWithQueryClient,
  };
}
