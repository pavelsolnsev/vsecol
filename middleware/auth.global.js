import { useAuthStore } from '~/store/auth';
import { useToken } from '@/composables/useToken';

// Импорты эндпоинтов и ключей
import endpoints from '@/shared/api/endpoints';
import keys from '@/shared/api/keys';

// Импорт Nuxt функций
import { abortNavigation } from '#app';

// Импорт вспомогательной функции для выполнения API-запросов через QueryClient
import useApiQueryClient from '@/composables/useApiQueryClient';
const { fetchApiWithQueryClient } = useApiQueryClient();

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const { clearToken, token } = useToken();

  if (!token.value || to.path.includes('/profile')) {
    return;
  }

  if (!authStore.isAuthenticated) {
    try {
      const userData = await fetchApiWithQueryClient([...keys.clients, 'me'], () =>
        $fetch(`/api${endpoints.clients}/me`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
            Accept: 'application/json',
          },
        }),
      );

      if (userData) {
        authStore.profile = userData?.data;
      } else {
        clearToken();
        return abortNavigation('No user data. Need authorization');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      clearToken();
      authStore.profile = null;
      return abortNavigation('Error fetching user data. Need authorization');
    }
  }
});
