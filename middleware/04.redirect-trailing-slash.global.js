export default defineNuxtRouteMiddleware((to) => {
  // if (to.path !== '/' && to.path.endsWith('/')) {
  //   const { path, query, hash } = to;
  //   const nextPath = path.replace(/\/+$/, '') || '/';
  //   const nextRoute = { path: nextPath, query, hash };
  //   return navigateTo(nextRoute, { redirectCode: 301 });
  // }

  if (
    to.path !== '/' &&
    !to.path.endsWith('/') &&
    !to.path.includes('.js:') &&
    !to.path.includes('.js') &&
    !to.path.includes('.css') &&
    !to.path.includes('.webp')
  ) {
    const { path, query, hash } = to;
    const nextPath = `${path}/`;
    const nextRoute = { path: nextPath, query, hash };
    return navigateTo(nextRoute, { redirectCode: 301 });
  }
});
