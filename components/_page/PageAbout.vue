<template>
  <PPage css-class="about">
    <ATitle tag="h1" class="mb-6">О проекте</ATitle>

    <div class="p-about__content">
      <p>
        Это демонстрационная версия интерфейса каталога образовательных программ и организаций, подготовленная для
        портфолио. Контент и справочные данные при необходимости подставляются с бэкенда; в репозитории нет
        продакшен-секретов и привязки к конкретному заказчику.
      </p>
      <p>
        Цель демо — показать навигацию, фильтры, карточки и формы. Для локального запуска задайте URL API в
        файле .env.local (см. .env.example).
      </p>
      <p>
        Индексация поисковиками отключена (meta noindex, файл robots.txt).
      </p>
    </div>
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ATitle from '~/components/_ui/a-title.vue';
</script>

<style lang="scss">
.p-about {
  &__content {
    p {
      margin-bottom: 1em;
    }
  }
}
</style>
