<template>
  <PPage css-class="profile">
        <ATitle tag="h1" class="p-profile__title">Мой профиль</ATitle>

    <div class="p-profile__topline">
      <div class="p-profile__contact">
        <div class="p-profile__phone">{{ storeAuth.phoneNumber }}</div>
        <NuxtLink to="/delete" class="p-profile__link">Удалить</NuxtLink>
      </div>
      <div class="p-profile__check">
        <AButton
          label="Новая проверка"
          size="large"
          :disabled="!hasCHecks"
          class="p-profile__button"
          @click="navigateTo('/check/')"
        />
        <div class="p-profile__attempts">
          Осталось {{ reportsMeta.reports_count.rest }} провер{{
            useGetNoun(reportsMeta.reports_count.rest, 'кa', 'ки', 'ок')
          }}
          на сегодня
        </div>
      </div>
    </div>

    <div class="p-profile__list">
      <div v-for="report in reports" :key="report.id" class="p-profile__list-item">
        <CardCheck
          :id="report.id"
          :status="report.status"
          :name="report.organization_name"
          :date="report.created_at"
          :has-data="report.has_data"
        />
      </div>
    </div>
  </PPage>
</template>

<script setup>
import PPage from '~/components/_ui/p-page.vue';
import ATitle from '~/components/_ui/a-title.vue';
import AButton from '~/components/_ui/a-button.vue';
import CardCheck from '~/components/CardCheck.vue';
import { useAuthStore } from '~/store/auth';
import useGetNoun from '~/composables/useGetNoun.js';
import { useToken } from '@/composables/useToken';

const storeAuth = useAuthStore();

const { token } = useToken();

if (storeAuth.hasVerification) {
  await $fetch('/api/clients/reports/', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token.value}`,
    },
    params: {
      organization_id: storeAuth.verification.id,
    },
  })
    .then(() => storeAuth.deleteCheckOrganization())
    .catch((error) => {
      console.error(error);
    });
}

let data = [];
let reportsMeta = {
  reports_count: { rest: 0 },
};

try {
  const response = await $fetch(`/api/clients/reports/`, {
    headers: {
      authorization: `Bearer ${token.value}`,
    },
  });
  data = response.data || [];
  reportsMeta = response.meta || { reports_count: { rest: 0 } };
} catch (error) {
  console.error(error);
}

const reports = computed(() => data || []);

const hasCHecks = computed(() => reportsMeta.reports_count?.rest > 0);
</script>

<style lang="scss" scoped>
.p-profile {
  min-height: 100vh;
  background-color: var(--base-white);

  :deep(.s-main) {
    flex: 1;
  }

  :deep(.p-page__container) {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &__title {
    margin-bottom: to-rem(40);

    @media (min-width: 767px) {
      margin-bottom: to-rem(32);
    }
  }

  &__topline {
    display: flex;
    flex-direction: column;
    margin-bottom: to-rem(40);

    @media (min-width: 767px) {
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: to-rem(32);
    }
  }

  &__check {
    @media (min-width: 767px) {
      text-align: right;
    }

    @media (min-width: 1024px) {
      display: flex;
      align-items: center;
    }
  }

  &__contact {
    display: flex;
    align-items: center;
    margin-bottom: to-rem(24);

    @media (min-width: 767px) {
      flex-direction: column;
      align-items: flex-start;
    }

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: center;
      margin-bottom: 0;
    }
  }

  &__phone {
    font-weight: 700;
    font-size: to-rem(20);
  }

  &__link {
    color: var(--additional-red);
    font-size: to-rem(14);
    margin-left: to-rem(16);

    @media (min-width: 767px) {
      margin-left: 0;
      margin-top: to-rem(4);
    }

    @media (min-width: 767px) {
      margin-top: 0;
      margin-left: to-rem(16);
    }
  }

  &__button {
    width: to-rem(220);

    @media (min-width: 1024px) {
      order: 1;
    }
  }

  &__attempts {
    color: var(--base-gray);
    font-size: to-rem(14);
    margin-top: to-rem(12);

    @media (min-width: 1024px) {
      order: 0;
      margin-top: 0;
      margin-right: to-rem(24);
    }
  }

  &__list {
    &-item {
      margin-bottom: to-rem(16);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>