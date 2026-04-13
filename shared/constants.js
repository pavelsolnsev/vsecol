export const SORT = {
  vuz: [
    {
      name: 'Популярные',
      value: 'popular',
      slug: 'pop',
    },
    {
      name: 'По рейтингу',
      value: 'rating',
      slug: 'rating',
    },
    {
      name: 'ЕГЭ бюджет',
      value: 'ege-budjet',
      slug: 'ege-b',
    },
    {
      name: 'ЕГЭ платное',
      value: 'ege-cost',
      slug: 'ege-p',
    },
  ],
  kolledzh: [
    {
      name: 'По умолчанию',
      value: 'default',
      slug: 'okso-count',
    },
    {
      name: 'Популярные',
      value: 'popular',
      slug: 'pop',
    },
    {
      name: 'По рейтингу',
      value: 'rating',
      slug: 'rating',
    },
    {
      name: 'Ср. балл аттестата бюджет',
      value: 'att-budjet',
      slug: 'ege-b',
    },
    {
      name: 'Ср. балл аттестата платное',
      value: 'att-cost',
      slug: 'ege-p',
    },
  ],
};

export const ORDER_ATTRIBUTES = [
  'subject',
  'city',
  'direction',
  'level',
  'spec',
  'state',
  'budget',
  'atvuz',
  'military',
  'hostel',
  'distance',
  'sort',
];

export const MIDDLEWARE_EXCLUDED_PAGES = [
  'index',
  'ads-id',
  'about',
  'articles',
  'articles-slug',
  'org-college_id',
  'org-university_id',
  'promo-slug',
  'kolledzh-specialties',
  'kolledzh-specialties-level_id',
  'kolledzh-specialties-code_id',
  'kolledzh-specialties-group_id',
  'vuz-specialties',
  'vuz-specialties-level_id',
  'vuz-specialties-code_id',
  'vuz-specialties-group_id',
  'professions',
];

export const UNIVERSITY_EXCLUDED_PARAMS = ['atvuz', 'sort'];
export const COLLEGE_EXCLUDED_PARAMS = ['military', 'sort'];

/** Демо-контакты для портфолио (не реальные). */
export const DEMO_PHONE_TEL = '+78005553535';
export const DEMO_TELEGRAM_URL = 'https://t.me/example_channel_demo';

/** UTM-метки без идентификаторов заказчика. */
export const DEMO_UTM_SOURCE = 'portfolio_demo';
export const DEMO_LAND_SLUG = 'portfolio_demo';
