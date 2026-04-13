import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware(async () => {
  const storeAuth = useAuthStore();

  if (!storeAuth.isAuthenticated) {
    return navigateTo('/login/');
  }
});
