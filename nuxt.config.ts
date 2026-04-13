/* eslint-disable max-len */
// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-expect-error vite-plugin-eslint has incorrect type exports
import eslintPlugin from 'vite-plugin-eslint';
import svgLoader from 'vite-svg-loader';

const rawApiUrl = process.env.NUXT_PUBLIC_API_URL || process.env.VITE_APP_API_URL || '';
const apiBase = rawApiUrl ? rawApiUrl.replace(/\/?$/, '/') : '';

export default defineNuxtConfig({
  compatibilityDate: '2024-07-18',
  ssr: true,
  debug: false,
  devtools: { enabled: false },
  features: {
    //noScripts: true
    inlineStyles: false,
  },

  render: {
    // Критически важно для мобилок:
    compressor: { threshold: 1024 }, // gzip сжатие ответов
    resourceHints: false // Убирает prefetch для мобил
  },

  vite: {
    plugins: [eslintPlugin(), svgLoader({ svgo: false })],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/tools/_mixins.scss" as *;`,
          api: 'modern-compiler'
        },
      },
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: 500,
      cssCodeSplit: false,
    },

  },

  buildModules: ['@averjs/nuxt-compression'],

  'compression': {
    algorithm: 'brotliCompress',
    filter: /\.(js|mjs|json|css|html)$/is
  },

  css: ['@/assets/styles/main.scss'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },

      title: 'Демо: каталог ВУЗов и колледжей (портфолио)',

      meta: [
        { charset: 'utf-8' },
        // eslint-disable-next-line max-len
        { name: 'viewport', content: 'viewport-fit=cover, width=device-width, initial-scale=1, user-scalable=1, minimum-scale=1, maximum-scale=5' },
        { name: 'robots', content: 'noindex, nofollow' },
        {
          name: 'description',
          content: 'Демонстрационный фронтенд: каталог образовательных организаций. Не для публичного продвижения.',
        },
        { name: 'theme-color', content: '#fff' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],

      link: [
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'icon',
          sizes: '32x32',
          href: '/favicon-32x32.png',
          type: 'image/png',
        },
        { rel: 'apple-icon-precomposed', href: '/apple-icon-precomposed.png' },
        { rel: 'apple-touch-icon', href: '/apple-icon.png' },
        { rel: 'apple-touch-icon', sizes: '57x57', href: '/apple-icon-57x57.png' },
        { rel: 'apple-touch-icon', sizes: '60x60', href: '/apple-icon-60x60.png' },
        { rel: 'apple-touch-icon', sizes: '72x72', href: '/apple-icon-72x72.png' },
        { rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-icon-76x76.png' },
        { rel: 'apple-touch-icon', sizes: '114x114', href: '/apple-icon-114x114.png' },
        { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-icon-120x120.png' },
        { rel: 'apple-touch-icon', sizes: '144x144', href: '/apple-icon-144x144.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/apple-icon-152x152.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon-180x180.png' },
      ],
    },
  },

  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', '@nuxtjs/device', 'nuxt-lodash', '@nuxt/image', 'nuxt-vitalizer', '@hebilicious/vue-query-nuxt', 'nuxt-swiper', 'nuxt-delay-hydration', '@nuxtjs/critters'],

  delayHydration: {
    mode: 'mount',
    debug: import.meta.env.NODE_ENV !== 'production',
  },

  device: {
    refreshOnResize: true
  },

  vitalizer: {
    // Remove the render-blocking entry CSS
    // disableStylesheets: 'entry', // Disabled - critters will handle critical CSS
    disablePrefetchLinks: true
  },

  pinia: {
    storesDirs: ['./store/**']
  },


  nitro: {
    compressPublicAssets: {
      brotli: true
    },
    minify: true
  },

  hooks: {
    "pages:extend"(pages) {
      pages.push({
        name: "/",
        path: "/",
        file: "~/pages/index.vue",
      },{
        name: "vuz",
        path: "/vuz/:path*",
        file: "~/pages/vuz/index.vue",
      }, {
        name: "kolledzh",
        path: "/kolledzh/:path*",
        file: "~/pages/kolledzh/index.vue",
      }, {
        name: "professions",
        path: "/professions/:path*",
        file: "~/pages/professions/index.vue",
      });
    },
  },

  runtimeConfig: {
    proxyUrl: apiBase ? apiBase.slice(0, -1) : '',
    apiTarget: apiBase ? apiBase.slice(0, -1) : '',
    public: {
      baseURL: apiBase ? apiBase.slice(0, -1) : '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      fbPixel: process.env.NUXT_PUBLIC_FB_PIXEL || process.env.SITE_FB_PIXEL || '',
      gtm: process.env.NUXT_PUBLIC_GTM_ID || process.env.SITE_GTM || '',
      s3UrlBacket: process.env.NUXT_PUBLIC_S3_BUCKET || process.env.NUXT_ENV_S3BACKET || '',
      trailingSlash: true,
      apiURL: '/api',
      yandexMetrika: {
        id: process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID || process.env.YANDEX_METRIKA_ID || '',
      },
    },
  },

  routeRules: {
    '/kolledzh/specialnost': { redirect: '/kolledzh/' },
    '/kolledzh/map/': { redirect: '/kolledzh/' },
    '/profile/reports/**': { ssr: false },
    ...(apiBase
      ? {
          '/api/**': {
            proxy: `${apiBase}api/**`,
          },
        }
      : {}),
  },

  experimental: {
    restoreState: true,
    renderJsonPayloads: false,
    payloadExtraction: true,
    defaults: {
      nuxtLink: {
        trailingSlash: 'append',
        prefetch: false
      }
    }
  },

  vueQuery: {
    queryClientOptions: {
      defaultOptions: {
        queries: {
          staleTime: 60000 * 60 * 12,
          refetchOnWindowFocus: false,
          retry: false,
        }
      }
    },
  },

});
