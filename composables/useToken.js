export function useToken() {
  const isDev = process.dev;

  const cookieOptions = {
    secure: !isDev,
    sameSite: 'strict',
  };

  const COOKIE_KEY = 'auth_token';

  const token = useCookie(COOKIE_KEY, cookieOptions);

  /**
   * @param {string} newToken  -> Access token
   * @example 'asd123jkig132jk123...'
   *
   * @param {number} expiresIn -> Время жизни в секундах
   * @example 86400 -> 1 день
   *
   */
  const setToken = (newToken, expiresIn) => {
    const updatedCookie = useCookie(COOKIE_KEY, {
      ...cookieOptions,
      maxAge: expiresIn,
    });
    updatedCookie.value = newToken;
    token.value = newToken;
  };

  /**
   *  Очищает токен в куке
   */
  const clearToken = () => {
    token.value = null;
    useCookie(COOKIE_KEY, { maxAge: 0 }).value = null;
  };

  return { token, setToken, clearToken };
}
