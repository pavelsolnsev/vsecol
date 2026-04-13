export default defineNuxtRouteMiddleware(async () => {
  const { profile } = storeToRefs(useAuthStore());
  const { token } = useToken();

  try {
    const { data } = await $fetch('/api/clients/me', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
    });

    profile.value = data;
  } catch (error) {
    // eslint-disable-next-line
    console.error('error', error.statusCode);
  }
});
