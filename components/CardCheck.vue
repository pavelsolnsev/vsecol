<template>
  <div class="card-check">
    <div class="card-check__wrapper">
      <div class="card-check__topline">
        <div class="card-check__status">
          {{ statuses[status].label }}
          <component :is="iconComponents[statuses[status].icon]" class="card-check__status-icon" />
        </div>

        <div class="card-check__time">{{ convertedDate }}</div>
      </div>

      <ATitle tag="h2" class="card-check__title">{{ name }}</ATitle>

      <AButton
        label="Смотреть результаты"
        size="large"
        block
        :disabled="!(status === 'success')"
        class="card-check__button"
        @click="moveToResult"
      />
    </div>
    <div v-if="hasData" class="card-check__download">
      <NuxtLink :to="`/profile/reports/pdf-${id}/`" target="_blank" class="card-check__link">Скачать PDF</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import ATitle from '~/components/_ui/a-title.vue';
import AButton from '~/components/_ui/a-button.vue';
import IconCheckWaiting from '~/components/_icons/IconCheckWaiting.vue';
import IconCheckSuccess from '~/components/_icons/IconCheckSuccess.vue';
import IconCheckError from '~/components/_icons/IconCheckError.vue';

const iconComponents = {
  Waiting: IconCheckWaiting,
  Success: IconCheckSuccess,
  Error: IconCheckError,
};

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
    default: '',
  },

  name: {
    type: [String, Number],
    required: true,
    default: '',
  },

  date: {
    type: String,
    required: true,
    default: 'waiting',
  },

  status: {
    type: String,
    required: true,
    default: 'waiting',
  },

  hasData: {
    type: Boolean,
    default: false,
  },
});

const statuses = {
  new: {
    label: 'Новый',
    value: 'new',
    icon: 'Waiting',
  },
  manual: {
    label: 'Ручная проверка',
    value: 'manual',
    icon: 'Waiting',
  },
  ready: {
    label: 'Готово к генерации ',
    value: 'ready',
    icon: 'Waiting',
  },
  in_process: {
    label: 'В процессе',
    value: 'in_process',
    icon: 'Waiting',
  },
  synced: {
    label: 'Синхронизировано',
    value: 'synced',
  },
  success: {
    label: 'Выполнено',
    value: 'success',
    icon: 'Success',
  },
  error: {
    label: 'Ошибка',
    value: 'error',
    icon: 'Error',
  },
  rejected: {
    label: 'Отклонено',
    value: 'rejected',
    icon: 'Error',
  },
};

const moveToResult = () => {
  return navigateTo(`/profile/reports/${props.id}`);
};

const convertedDate = computed(() =>
  new Date(props.date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }),
);
</script>

<style lang="scss">
.card-check {
  display: flex;
  flex-direction: column;
  padding: to-rem(20) to-rem(12);
  background-color: var(--base-gray-smoky);
  border-radius: to-rem(8);

  @media (min-width: 767px) {
    flex-direction: row;
    padding: to-rem(20) to-rem(24);
  }

  &__wrapper {
    flex: 1;
    margin-bottom: to-rem(16);
  }

  &__download {
    text-align: center;

    @media (min-width: 767px) {
      display: flex;
      justify-content: center;
      align-items: center;
      width: to-rem(168);
      margin-left: to-rem(32);
      border-left: to-rem(1) solid var(--base-gray-selection);
    }
  }

  &__topline {
    display: flex;
    align-items: center;
    margin-bottom: to-rem(16);
  }

  &__button {
    @media (min-width: 767px) {
      max-width: to-rem(280);
    }
  }

  &__status {
    display: flex;
    align-items: center;
    margin-right: to-rem(16);
    padding: to-rem(6) to-rem(12);
    background-color: var(--base-white);
    border-radius: to-rem(8);
    font-size: to-rem(12);

    &-icon {
      margin-left: to-rem(12);
    }
  }

  &__time {
    color: var(--base-gray);
    font-size: to-rem(12);
  }

  &__title {
    margin-bottom: to-rem(16);
  }

  &__link {
    color: var(--base-blue);
    font-size: to-rem(16);
  }
}
</style>
