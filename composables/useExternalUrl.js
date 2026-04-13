/**
 * Проверяет, является ли URL внешним
 * @param {string} url - Проверяемый URL
 * @returns {boolean} - true если URL начинается с http:// или https://
 */
export const isExternalUrl = (url) => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Возвращает атрибуты ссылки для внешних URL
 * @param {string} url - Проверяемый URL
 * @returns {Object} - Объект с атрибутами target и rel
 */
export const getLinkAttributes = (url) => {
  return isExternalUrl(url) ? { target: '_blank', rel: 'nofollow' } : {};
};

/**
 * Возвращает URL для навигации
 * @param {string} url - Исходный URL
 * @param {Object} [options] - Опции
 * @param {boolean} [options.allowPopup] - Разрешить popup (# для popup)
 * @returns {string|Object} - URL для nuxt-link
 */
export const getNavigationUrl = (url, options = {}) => {
  const { allowPopup = false } = options;

  // Для popup возвращаем #
  if (allowPopup && !url) {
    return '#';
  }

  if (!url) {
    return '/';
  }

  // Если внешний URL - возвращаем как есть
  if (isExternalUrl(url)) {
    return url;
  }

  // Внутренний URL - возвращаем объект для nuxt-link
  return {
    path: url,
    query: {},
  };
};
